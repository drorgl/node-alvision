/*M///////////////////////////////////////////////////////////////////////////////////////
//
//  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
//
//  By downloading, copying, installing or using the software you agree to this license.
//  If you do not agree to this license, do not download, install,
//  copy or use the software.
//
//
//                        Intel License Agreement
//                For Open Source Computer Vision Library
//
// Copyright (C) 2000, Intel Corporation, all rights reserved.
// Third party copyrights are property of their respective owners.
//
// Redistribution and use in source and binary forms, with or without modification,
// are permitted provided that the following conditions are met:
//
//   * Redistribution's of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//
//   * Redistribution's in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//
//   * The name of Intel Corporation may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
//
// This software is provided by the copyright holders and contributors "as is" and
// any express or implied warranties, including, but not limited to, the implied
// warranties of merchantability and fitness for a particular purpose are disclaimed.
// In no event shall the Intel Corporation or contributors be liable for any direct,
// indirect, incidental, special, exemplary, or consequential damages
// (including, but not limited to, procurement of substitute goods or services;
// loss of use, data, or profits; or business interruption) however caused
// and on any theory of liability, whether in contract, strict liability,
// or tort (including negligence or otherwise) arising in any way out of
// the use of this software, even if advised of the possibility of such damage.
//
//M*/

/*
  This is a regression test for stereo matching algorithms. This test gets some quality metrics
  discribed in "A Taxonomy and Evaluation of Dense Two-Frame Stereo Correspondence Algorithms".
  Daniel Scharstein, Richard Szeliski
*/

import tape = require("tape");
import path = require("path");
import colors = require("colors");
import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');

//#include "test_precomp.hpp"
//#include <limits>
//#include <cstdio>
//#include <map>
//
//using namespace std;
//using namespace cv;

const EVAL_BAD_THRESH = 1.;
const EVAL_TEXTURELESS_WIDTH = 3;
const  EVAL_TEXTURELESS_THRESH = 4.;
const  EVAL_DISP_THRESH = 1.;
const  EVAL_DISP_GAP = 2.;
const  EVAL_DISCONT_WIDTH = 9;
const  EVAL_IGNORE_BORDER = 10;

const  ERROR_KINDS_COUNT = 6;

//============================== quality measuring functions =================================================

/*
  Calculate textureless regions of image (regions where the squared horizontal intensity gradient averaged over
  a square window of size=evalTexturelessWidth is below a threshold=evalTexturelessThresh) and textured regions.
*/
function computeTextureBasedMasks(_img : alvision.Mat, texturelessMask : alvision.Mat, texturedMask : alvision.Mat,
    texturelessWidth  : alvision.int = EVAL_TEXTURELESS_WIDTH, texturelessThresh  : alvision.float = EVAL_TEXTURELESS_THRESH ) : void
{
    if( !texturelessMask && !texturedMask )
        return;
    if( _img.empty() )
        alvision.CV_Error( Error::StsBadArg, "img is empty" );

    var img = _img;
    if( _img.channels() > 1)
    {
        var tmp = new alvision.Mat; alvision.cvtColor( _img, tmp,alvision.ColorConversionCodes. COLOR_BGR2GRAY ); img = tmp;
    }
    var dxI = new alvision.Mat(); alvision.Sobel( img, dxI, CV_32FC1, 1, 0, 3 );
    var dxI2 = new alvision.Mat(); alvision.pow( dxI / 8./*normalize*/, 2, dxI2 );
    var avgDxI2 = new alvision.Mat(); alvision.boxFilter( dxI2, avgDxI2, CV_32FC1, Size(texturelessWidth,texturelessWidth) );

    if( texturelessMask )
        *texturelessMask = avgDxI2 < texturelessThresh;
    if( texturedMask )
        *texturedMask = avgDxI2 >= texturelessThresh;
}

function checkTypeAndSizeOfDisp(dispMap: alvision.Mat, sz: alvision.Size ) : void
{
    if( dispMap.empty() )
        alvision.CV_Error( Error::StsBadArg, "dispMap is empty" );
    if( dispMap.type() != CV_32FC1 )
        alvision.CV_Error( Error::StsBadArg, "dispMap must have CV_32FC1 type" );
    if( sz && (dispMap.rows != sz.height || dispMap.cols != sz.width) )
        alvision.CV_Error( Error::StsBadArg, "dispMap has incorrect size" );
}

function checkTypeAndSizeOfMask(mask: alvision.Mat, sz: alvision.Size ) : void
{
    if( mask.empty() )
        alvision.CV_Error( Error::StsBadArg, "mask is empty" );
    if( mask.type() != CV_8UC1 )
        alvision.CV_Error( Error::StsBadArg, "mask must have CV_8UC1 type" );
    if( mask.rows != sz.height || mask.cols != sz.width )
        alvision.CV_Error( Error::StsBadArg, "mask has incorrect size" );
}

function checkDispMapsAndUnknDispMasks(leftDispMap: alvision.Mat, rightDispMap: alvision.Mat,
    leftUnknDispMask: alvision.Mat, rightUnknDispMask: alvision.Mat ) : void
{
    // check type and size of disparity maps
    checkTypeAndSizeOfDisp( leftDispMap, 0 );
    if( !rightDispMap.empty() )
    {
        var sz = leftDispMap.size();
        checkTypeAndSizeOfDisp( rightDispMap, &sz );
    }

    // check size and type of unknown disparity maps
    if( !leftUnknDispMask.empty() )
        checkTypeAndSizeOfMask( leftUnknDispMask, leftDispMap.size() );
    if( !rightUnknDispMask.empty() )
        checkTypeAndSizeOfMask( rightUnknDispMask, rightDispMap.size() );

    // check values of disparity maps (known disparity values musy be positive)
    var leftMinVal = 0, rightMinVal = 0;
    if( leftUnknDispMask.empty() )
        minMaxLoc( leftDispMap, &leftMinVal );
    else
        minMaxLoc( leftDispMap, &leftMinVal, 0, 0, 0, ~leftUnknDispMask );
    if( !rightDispMap.empty() )
    {
        if( rightUnknDispMask.empty() )
            minMaxLoc( rightDispMap, &rightMinVal );
        else
            minMaxLoc( rightDispMap, &rightMinVal, 0, 0, 0, ~rightUnknDispMask );
    }
    if( leftMinVal < 0 || rightMinVal < 0)
        CV_Error( Error::StsBadArg, "known disparity values must be positive" );
}

/*
  Calculate occluded regions of reference image (left image) (regions that are occluded in the matching image (right image),
  i.e., where the forward-mapped disparity lands at a location with a larger (nearer) disparity) and non occluded regions.
*/
function computeOcclusionBasedMasks(leftDisp: alvision.Mat, _rightDisp: alvision.Mat,
    occludedMask: alvision.Mat, nonOccludedMask: alvision.Mat,
    leftUnknDispMask: alvision.Mat = new alvision.Mat(), rightUnknDispMask: alvision.Mat  = new alvision.Mat(),
    dispThresh: alvision.float = EVAL_DISP_THRESH ) : void
{
    if( !occludedMask && !nonOccludedMask )
        return;
    checkDispMapsAndUnknDispMasks( leftDisp, _rightDisp, leftUnknDispMask, rightUnknDispMask );

    Mat rightDisp;
    if( _rightDisp.empty() )
    {
        if( !rightUnknDispMask.empty() )
           CV_Error( Error::StsBadArg, "rightUnknDispMask must be empty if _rightDisp is empty" );
        rightDisp.create(leftDisp.size(), CV_32FC1);
        rightDisp.setTo(alvision.Scalar.all(0) );
        for( int leftY = 0; leftY < leftDisp.rows; leftY++ )
        {
            for( int leftX = 0; leftX < leftDisp.cols; leftX++ )
            {
                if( !leftUnknDispMask.empty() && leftUnknDispMask.at<uchar>(leftY,leftX) )
                    continue;
                float leftDispVal = leftDisp.at<float>(leftY, leftX);
                int rightX = leftX - Math.round(leftDispVal), rightY = leftY;
                if( rightX >= 0)
                    rightDisp.at<float>(rightY,rightX) = max(rightDisp.at<float>(rightY,rightX), leftDispVal);
            }
        }
    }
    else
        _rightDisp.copyTo(rightDisp);

    if( occludedMask )
    {
        occludedMask.create(leftDisp.size(), CV_8UC1);
        occludedMask.setTo(alvision.Scalar.all(0) );
    }
    if( nonOccludedMask )
    {
        nonOccludedMask.create(leftDisp.size(), CV_8UC1);
        nonOccludedMask.setTo(alvision.Scalar.all(0) );
    }
    for( var leftY = 0; leftY < leftDisp.rows; leftY++ )
    {
        for( var leftX = 0; leftX < leftDisp.cols; leftX++ )
        {
            if( !leftUnknDispMask.empty() && leftUnknDispMask.at<uchar>(leftY,leftX) )
                continue;
            float leftDispVal = leftDisp.at<float>(leftY, leftX);
            int rightX = leftX - Math.round(leftDispVal), rightY = leftY;
            if( rightX < 0 && occludedMask )
                occludedMask.at<uchar>(leftY, leftX) = 255;
            else
            {
                if( !rightUnknDispMask.empty() && rightUnknDispMask.at<uchar>(rightY,rightX) )
                    continue;
                float rightDispVal = rightDisp.at<float>(rightY, rightX);
                if( rightDispVal > leftDispVal + dispThresh )
                {
                    if( occludedMask )
                        occludedMask.at<uchar>(leftY, leftX) = 255;
                }
                else
                {
                    if( nonOccludedMask )
                        nonOccludedMask.at<uchar>(leftY, leftX) = 255;
                }
            }
        }
    }
}

/*
  Calculate depth discontinuty regions: pixels whose neiboring disparities differ by more than
  dispGap, dilated by window of width discontWidth.
*/
function computeDepthDiscontMask(disp: alvision.Mat, depthDiscontMask: alvision.Mat, unknDispMask: alvision.Mat = new alvision.Mat(),
    dispGap: alvision.float = EVAL_DISP_GAP, discontWidth: alvision.int = EVAL_DISCONT_WIDTH ) : void
{
    if( disp.empty() )
        CV_Error( Error::StsBadArg, "disp is empty" );
    if( disp.type() != CV_32FC1 )
        CV_Error( Error::StsBadArg, "disp must have CV_32FC1 type" );
    if( !unknDispMask.empty() )
        checkTypeAndSizeOfMask( unknDispMask, disp.size() );

    Mat curDisp; disp.copyTo( curDisp );
    if( !unknDispMask.empty() )
        curDisp.setTo( Scalar(alvision.FLT_MIN /*alvision.FLT_MIN*/), unknDispMask );
    Mat maxNeighbDisp; dilate( curDisp, maxNeighbDisp, Mat(3, 3, CV_8UC1, Scalar(1)) );
    if( !unknDispMask.empty() )
        curDisp.setTo( Scalar(alvision.FLT_MAX), unknDispMask );
    Mat minNeighbDisp; erode( curDisp, minNeighbDisp, Mat(3, 3, CV_8UC1, Scalar(1)) );
    depthDiscontMask = max( (Mat)(maxNeighbDisp-disp), (Mat)(disp-minNeighbDisp) ) > dispGap;
    if( !unknDispMask.empty() )
        depthDiscontMask &= ~unknDispMask;
    dilate( depthDiscontMask, depthDiscontMask, Mat(discontWidth, discontWidth, CV_8UC1, Scalar(1)) );
}

/*
   Get evaluation masks excluding a border.
*/
function getBorderedMask(maskSize: alvision.Size, border: alvision.int = EVAL_IGNORE_BORDER ) : alvision.Mat
{
    CV_Assert( border >= 0 );
    Mat mask(maskSize, CV_8UC1, Scalar(0));
    int w = maskSize.width - 2*border, h = maskSize.height - 2*border;
    if( w < 0 ||  h < 0 )
        mask.setTo(Scalar(0));
    else
        mask( Rect(Point(border,border),Size(w,h)) ).setTo(Scalar(255));
    return mask;
}

/*
  Calculate root-mean-squared error between the computed disparity map (computedDisp) and ground truth map (groundTruthDisp).
*/
function dispRMS(computedDisp: alvision.Mat, groundTruthDisp: alvision.Mat, mask: alvision.Mat ) : alvision.float  
{
    checkTypeAndSizeOfDisp( groundTruthDisp, 0 );
    Size sz = groundTruthDisp.size();
    checkTypeAndSizeOfDisp( computedDisp, &sz );

    int pointsCount = sz.height*sz.width;
    if( !mask.empty() )
    {
        checkTypeAndSizeOfMask( mask, sz );
        pointsCount = countNonZero(mask);
    }
    return 1./sqrt((float)pointsCount) * (float)alvision.cvtest.norm(computedDisp, groundTruthDisp,alvision.NormTypes. NORM_L2, mask);
}

/*
  Calculate fraction of bad matching pixels.
*/
function badMatchPxlsFraction(computedDisp: alvision.Mat, groundTruthDisp: alvision.Mat, mask: alvision.Mat ,
    _badThresh: alvision.float  = EVAL_BAD_THRESH ) : alvision.float
{
    var badThresh = Math.round(_badThresh);
    checkTypeAndSizeOfDisp( groundTruthDisp, 0 );
    Size sz = groundTruthDisp.size();
    checkTypeAndSizeOfDisp( computedDisp, &sz );

    Mat badPxlsMap;
    absdiff( computedDisp, groundTruthDisp, badPxlsMap );
    badPxlsMap = badPxlsMap > badThresh;
    int pointsCount = sz.height*sz.width;
    if( !mask.empty() )
    {
        checkTypeAndSizeOfMask( mask, sz );
        badPxlsMap = badPxlsMap & mask;
        pointsCount = countNonZero(mask);
    }
    return 1./pointsCount * countNonZero(badPxlsMap);
}

//===================== regression test for stereo matching algorithms ==============================

const  ALGORITHMS_DIR = "stereomatching/algorithms/";
const  DATASETS_DIR = "stereomatching/datasets/";
const  DATASETS_FILE = "datasets.xml";

const  RUN_PARAMS_FILE = "_params.xml";
const  RESULT_FILE = "_res.xml";

const  LEFT_IMG_NAME = "im2.png";
const  RIGHT_IMG_NAME = "im6.png";
const  TRUE_LEFT_DISP_NAME = "disp2.png";
const  TRUE_RIGHT_DISP_NAME = "disp6.png";

var ERROR_PREFIXES = [ "borderedAll",
                            "borderedNoOccl",
                            "borderedOccl",
                            "borderedTextured",
                            "borderedTextureless",
                            "borderedDepthDiscont" ]; // size of ERROR_KINDS_COUNT


const  RMS_STR = "RMS";
const  BAD_PXLS_FRACTION_STR = "BadPxlsFraction";

class QualityEvalParams
{
    //constructor() {
    //    this.setDefaults();
    //}
    constructor(_ignoreBorder: alvision.int)
    {
        this.setDefaults();
        this.ignoreBorder = _ignoreBorder;
    }
     setDefaults() : void
    {
        this.badThresh = EVAL_BAD_THRESH;
        this.texturelessWidth = EVAL_TEXTURELESS_WIDTH;
        this.texturelessThresh = EVAL_TEXTURELESS_THRESH;
        this.dispThresh = EVAL_DISP_THRESH;
        this.dispGap = EVAL_DISP_GAP;
        this.discontWidth = EVAL_DISCONT_WIDTH;
        this.ignoreBorder = EVAL_IGNORE_BORDER;
    }
     protected badThresh: alvision.float;
     protected texturelessWidth: alvision.int ;
     protected texturelessThresh: alvision.float ;
     protected dispThresh: alvision.float;
     protected dispGap: alvision.float ;
     protected discontWidth: alvision.int ;
     protected ignoreBorder: alvision.int ;
};

class DatasetParams
{
    public  dispScaleFactor: alvision.int;
    public dispUnknVal: alvision.int;
};

class CV_StereoMatchingTest  extends alvision.cvtest.BaseTest
{
    constructor()
    {
        super();
        this.rmsEps.resize(ERROR_KINDS_COUNT, 0.01f );
        this.fracEps.resize(ERROR_KINDS_COUNT, 1.e-6f );
    }
    // assumed that left image is a reference image
    abstract runStereoMatchingAlgorithm(leftImg: alvision.Mat, rightImg: alvision.Mat,
        leftDisp: alvision.Mat, rightDisp: alvision.Mat, caseIdx: alvision.int): alvision.int; // return ignored border width

    readDatasetsParams(fs: alvision.FileStorage): alvision.int {
        if (!fs.isOpened()) {
            ts.printf(alvision.cvtest.TSConstants.LOG, "datasetsParams can not be read ");
            return alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
        }
        datasetsParams.clear();
        FileNode fn = fs.getFirstTopLevelNode();
        assert(fn.isSeq());
        for (int i = 0; i < (int)fn.size(); i += 3 )
        {
            String _name = fn[i];
            DatasetParams params;
            String sf = fn[i + 1]; params.dispScaleFactor = atoi(sf);
            String uv = fn[i + 2]; params.dispUnknVal = atoi(uv);
            datasetsParams[_name] = params;
        }
        return alvision.cvtest.FailureCode.OK;
    }
    readRunParams(fs: alvision.FileStorage): alvision.int {
        if (!fs.isOpened()) {
            ts.printf(alvision.cvtest.TSConstants.LOG, "runParams can not be read ");
            return alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
        }
        caseNames.clear();;
        caseDatasets.clear();
        return alvision.cvtest.FailureCode.OK;
    }
    writeErrors(errName: string, errors: Array<alvision.float>, fs: alvision.FileStorage = null): void {
        assert((int)errors.size() == ERROR_KINDS_COUNT);
        Array<float>::const_iterator it = errors.begin();
        if (fs)
            for (int i = 0; i < ERROR_KINDS_COUNT; i++ , ++it )
            *fs << ERROR_PREFIXES[i] + errName << *it;
    else
    for(int i = 0; i < ERROR_KINDS_COUNT; i++, ++it )
ts.printf(alvision.cvtest.TSConstants.LOG, "%s = %f\n", string(ERROR_PREFIXES[i] + errName), *it);
    }
readErrors(fn: alvision.FileNode, errName: string, errors: Array<alvision.float> ) : void{
    errors.resize(ERROR_KINDS_COUNT);
    Array<float>::iterator it = errors.begin();
    for(int i = 0; i <ERROR_KINDS_COUNT; i++, ++it )
fn[ERROR_PREFIXES[i] + errName] >> *it;
}
    compareErrors(calcErrors: Array<alvision.float>, validErrors: Array<alvision.float> ,
    eps: Array < alvision.float > , errName : string): alvision.int { 
    assert((int)calcErrors.size() == ERROR_KINDS_COUNT);
    assert((int)validErrors.size() == ERROR_KINDS_COUNT);
    assert((int)eps.size() == ERROR_KINDS_COUNT);
    Array<float>::const_iterator calcIt = calcErrors.begin(),
        validIt = validErrors.begin(),
        epsIt = eps.begin();
    bool ok = true;
    for (int i = 0; i < ERROR_KINDS_COUNT; i++ , ++calcIt, ++validIt, ++epsIt )
    if ( *calcIt - *validIt > *epsIt) {
        ts.printf(alvision.cvtest.TSConstants.LOG, "bad accuracy of %s (valid=%f; calc=%f)\n", string(ERROR_PREFIXES[i] + errName), *validIt, *calcIt);
        ok = false;
    }
    return ok ? alvision.cvtest.FailureCode.OK : alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
}
    processStereoMatchingResults(fs: alvision.FileStorage, caseIdx: alvision.int, isWrite: boolean,
        leftImg: alvision.Mat, rightImg: alvision.Mat,
        trueLeftDisp: alvision.Mat, trueRightDisp: alvision.Mat,
        leftDisp: alvision.Mat, rightDisp: alvision.Mat,
        qualityEvalParams: QualityEvalParams): alvision.int {
        // rightDisp is not used in current test virsion
        int code = alvision.cvtest.FailureCode.OK;
        assert(fs.isOpened());
        assert(trueLeftDisp.type() == CV_32FC1);
        assert(trueRightDisp.empty() || trueRightDisp.type() == CV_32FC1);
        assert(leftDisp.type() == CV_32FC1 && rightDisp.type() == CV_32FC1);

        // get masks for unknown ground truth disparity values
        Mat leftUnknMask, rightUnknMask;
        DatasetParams params = datasetsParams[caseDatasets[caseIdx]];
        absdiff(trueLeftDisp, Scalar(params.dispUnknVal), leftUnknMask);
        leftUnknMask = leftUnknMask < numeric_limits<float>::epsilon();
        assert(leftUnknMask.type() == CV_8UC1);
        if (!trueRightDisp.empty()) {
            absdiff(trueRightDisp, Scalar(params.dispUnknVal), rightUnknMask);
            rightUnknMask = rightUnknMask < numeric_limits<float>::epsilon();
            assert(leftUnknMask.type() == CV_8UC1);
        }

        // calculate errors
        Array < float > rmss, badPxlsFractions;
        calcErrors(leftImg, rightImg, trueLeftDisp, trueRightDisp, leftUnknMask, rightUnknMask,
            leftDisp, rightDisp, rmss, badPxlsFractions, qualityEvalParams);

        if (isWrite) {
            fs << caseNames[caseIdx] << "{";
            //cvWriteComment( fs.fs, RMS_STR, 0 );
            writeErrors(RMS_STR, rmss, &fs);
            //cvWriteComment( fs.fs, BAD_PXLS_FRACTION_STR, 0 );
            writeErrors(BAD_PXLS_FRACTION_STR, badPxlsFractions, &fs);
            fs << "}"; // datasetName
        }
        else // compare
        {
            ts.printf(alvision.cvtest.TSConstants.LOG, "\nquality of case named %s\n", caseNames[caseIdx]);
            ts.printf(alvision.cvtest.TSConstants.LOG, "%s\n", RMS_STR);
            writeErrors(RMS_STR, rmss);
            ts.printf(alvision.cvtest.TSConstants.LOG, "%s\n", BAD_PXLS_FRACTION_STR);
            writeErrors(BAD_PXLS_FRACTION_STR, badPxlsFractions);

            FileNode fn = fs.getFirstTopLevelNode()[caseNames[caseIdx]];
            Array < float > validRmss, validBadPxlsFractions;

            readErrors(fn, RMS_STR, validRmss);
            readErrors(fn, BAD_PXLS_FRACTION_STR, validBadPxlsFractions);
            int tempCode = compareErrors(rmss, validRmss, rmsEps, RMS_STR);
            code = tempCode == alvision.cvtest.FailureCode.OK ? code : tempCode;
            tempCode = compareErrors(badPxlsFractions, validBadPxlsFractions, fracEps, BAD_PXLS_FRACTION_STR);
            code = tempCode == alvision.cvtest.FailureCode.OK ? code : tempCode;
        }
        return code;
    }
    run(iii: alvision.int): void {
        string dataPath = ts.get_data_path() + "cv/";
        string algorithmName = name;
        assert(!algorithmName.empty());
        if (dataPath.empty()) {
            ts.printf(alvision.cvtest.TSConstants.LOG, "dataPath is empty");
            this.ts.set_failed_test_info(alvision.cvtest.TS::FAIL_BAD_ARG_CHECK);
            return;
        }

        FileStorage datasetsFS(dataPath + DATASETS_DIR + DATASETS_FILE, FileStorage::READ);
        int code = readDatasetsParams(datasetsFS);
        if (code != alvision.cvtest.FailureCode.OK) {
            this.ts.set_failed_test_info(code);
            return;
        }
        FileStorage runParamsFS(dataPath + ALGORITHMS_DIR + algorithmName + RUN_PARAMS_FILE, FileStorage::READ);
        code = readRunParams(runParamsFS);
        if (code != alvision.cvtest.FailureCode.OK) {
            this.ts.set_failed_test_info(code);
            return;
        }

        string fullResultFilename = dataPath + ALGORITHMS_DIR + algorithmName + RESULT_FILE;
        FileStorage resFS(fullResultFilename, FileStorage::READ);
        bool isWrite = true; // write or compare results
        if (resFS.isOpened())
            isWrite = false;
        else {
            resFS.open(fullResultFilename, FileStorage::WRITE);
            if (!resFS.isOpened()) {
                ts.printf(alvision.cvtest.TSConstants.LOG, "file %s can not be read or written\n", fullResultFilename);
                this.ts.set_failed_test_info(alvision.cvtest.TS::FAIL_BAD_ARG_CHECK);
                return;
            }
            resFS << "stereo_matching" << "{";
        }

        int progress = 0, caseCount = (int)caseNames.size();
        for (int ci = 0; ci < caseCount; ci++)
        {
            progress = update_progress(progress, ci, caseCount, 0);
            printf("progress: %d%%\n", progress);
            fflush(stdout);
            string datasetName = caseDatasets[ci];
            string datasetFullDirName = dataPath + DATASETS_DIR + datasetName + "/";
            Mat leftImg = imread(datasetFullDirName + LEFT_IMG_NAME);
            Mat rightImg = imread(datasetFullDirName + RIGHT_IMG_NAME);
            Mat trueLeftDisp = imread(datasetFullDirName + TRUE_LEFT_DISP_NAME, 0);
            Mat trueRightDisp = imread(datasetFullDirName + TRUE_RIGHT_DISP_NAME, 0);

            if (leftImg.empty() || rightImg.empty() || trueLeftDisp.empty()) {
                ts.printf(alvision.cvtest.TSConstants.LOG, "images or left ground-truth disparities of dataset %s can not be read", datasetName);
                code = alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
                continue;
            }
            int dispScaleFactor = datasetsParams[datasetName].dispScaleFactor;
            Mat tmp;

            trueLeftDisp.convertTo(tmp, CV_32FC1, 1.f/ dispScaleFactor);
            trueLeftDisp = tmp;
            tmp.release();

            if (!trueRightDisp.empty()) {
                trueRightDisp.convertTo(tmp, CV_32FC1, 1.f/ dispScaleFactor);
                trueRightDisp = tmp;
                tmp.release();
            }

            Mat leftDisp, rightDisp;
            int ignBorder = max(runStereoMatchingAlgorithm(leftImg, rightImg, leftDisp, rightDisp, ci), EVAL_IGNORE_BORDER);

            leftDisp.convertTo(tmp, CV_32FC1);
            leftDisp = tmp;
            tmp.release();

            rightDisp.convertTo(tmp, CV_32FC1);
            rightDisp = tmp;
            tmp.release();

            int tempCode = processStereoMatchingResults(resFS, ci, isWrite,
                leftImg, rightImg, trueLeftDisp, trueRightDisp, leftDisp, rightDisp, QualityEvalParams(ignBorder));
            code = tempCode == alvision.cvtest.FailureCode.OK ? code : tempCode;
        }

        if (isWrite)
            resFS << "}"; // "stereo_matching"

        this.ts.set_failed_test_info(code);
    }

    protected rmsEps   Array<alvision.float> ;
    protected  fracEps  Array< alvision.float >;

    
    protected datasetsParams: { [id: string]: DatasetParams };

    protected caseNames     :Array<string>;
    protected caseDatasets  :Array<string>;
};

 function calcErrors(leftImg : alvision.Mat, rightImg : alvision.Mat  ,
    trueLeftDisp : alvision.Mat, trueRightDisp :alvision.Mat ,
    trueLeftUnknDispMask : alvision.Mat, trueRightUnknDispMask : alvision.Mat ,
    calcLeftDisp : alvision.Mat, calcRightDisp : alvision.Mat ,
    rms : Array < alvision.float >, badPxlsFractions : Array<alvision.float>,
    qualityEvalParams  : QualityEvalParams ) : void
{

     var texturelessMask = new alvision.Mat(), texturedMask = new alvision.Mat();

    computeTextureBasedMasks( leftImg, &texturelessMask, &texturedMask,
                              qualityEvalParams.texturelessWidth, qualityEvalParams.texturelessThresh );
    var occludedMask = new alvision.Mat();
    var nonOccludedMask = new alvision.Mat();


    computeOcclusionBasedMasks( trueLeftDisp, trueRightDisp, &occludedMask, &nonOccludedMask,
                                trueLeftUnknDispMask, trueRightUnknDispMask, qualityEvalParams.dispThresh);
    var depthDiscontMask = new alvision.Mat();
    computeDepthDiscontMask( trueLeftDisp, depthDiscontMask, trueLeftUnknDispMask,
                             qualityEvalParams.dispGap, qualityEvalParams.discontWidth);

    var borderedKnownMask = getBorderedMask( leftImg.size(), qualityEvalParams.ignoreBorder ) & ~trueLeftUnknDispMask;

    nonOccludedMask &= borderedKnownMask;
    occludedMask &= borderedKnownMask;
    texturedMask &= nonOccludedMask; // & borderedKnownMask
    texturelessMask &= nonOccludedMask; // & borderedKnownMask
    depthDiscontMask &= nonOccludedMask; // & borderedKnownMask

    rms.resize(ERROR_KINDS_COUNT);
    rms[0] = dispRMS( calcLeftDisp, trueLeftDisp, borderedKnownMask );
    rms[1] = dispRMS( calcLeftDisp, trueLeftDisp, nonOccludedMask );
    rms[2] = dispRMS( calcLeftDisp, trueLeftDisp, occludedMask );
    rms[3] = dispRMS( calcLeftDisp, trueLeftDisp, texturedMask );
    rms[4] = dispRMS( calcLeftDisp, trueLeftDisp, texturelessMask );
    rms[5] = dispRMS( calcLeftDisp, trueLeftDisp, depthDiscontMask );

    badPxlsFractions.resize(ERROR_KINDS_COUNT);
    badPxlsFractions[0] = badMatchPxlsFraction( calcLeftDisp, trueLeftDisp, borderedKnownMask, qualityEvalParams.badThresh );
    badPxlsFractions[1] = badMatchPxlsFraction( calcLeftDisp, trueLeftDisp, nonOccludedMask, qualityEvalParams.badThresh );
    badPxlsFractions[2] = badMatchPxlsFraction( calcLeftDisp, trueLeftDisp, occludedMask, qualityEvalParams.badThresh );
    badPxlsFractions[3] = badMatchPxlsFraction( calcLeftDisp, trueLeftDisp, texturedMask, qualityEvalParams.badThresh );
    badPxlsFractions[4] = badMatchPxlsFraction( calcLeftDisp, trueLeftDisp, texturelessMask, qualityEvalParams.badThresh );
    badPxlsFractions[5] = badMatchPxlsFraction( calcLeftDisp, trueLeftDisp, depthDiscontMask, qualityEvalParams.badThresh );
}


//----------------------------------- StereoBM test -----------------------------------------------------

class CV_StereoBMTest extends CV_StereoMatchingTest
{
    constructor()
    {
        super();
        this.name = "stereobm";
        fill(rmsEps.begin(), rmsEps.end(), 0.4f);
        fill(fracEps.begin(), fracEps.end(), 0.022f);
    }

    struct RunParams
    {
        int ndisp;
        int winSize;
    };
    Array<RunParams> caseRunParams;

    readRunParams(fs  :alvision.FileStorage ) : alvision.int
    {
        int code = CV_StereoMatchingTest::readRunParams( fs );
        FileNode fn = fs.getFirstTopLevelNode();
        assert(fn.isSeq());
        for( int i = 0; i < (int)fn.size(); i+=4 )
        {
            String caseName = fn[i], datasetName = fn[i+1];
            RunParams params;
            String ndisp = fn[i+2]; params.ndisp = atoi(ndisp);
            String winSize = fn[i+3]; params.winSize = atoi(winSize);
            caseNames.push( caseName );
            caseDatasets.push( datasetName );
            caseRunParams.push( params );
        }
        return code;
    }

    runStereoMatchingAlgorithm(_leftImg : alvision.Mat, _rightImg : alvision.Mat,
        leftDisp : alvision.Mat, rightDisp : alvision.Mat, caseIdx  :alvision.int ) : alvision.int
    {
        RunParams params = caseRunParams[caseIdx];
        assert( params.ndisp%16 == 0 );
        assert( _leftImg.type() == CV_8UC3 && _rightImg.type() == CV_8UC3 );
        Mat leftImg; cvtColor( _leftImg, leftImg, COLOR_BGR2GRAY );
        Mat rightImg; cvtColor( _rightImg, rightImg, COLOR_BGR2GRAY );

        Ptr<StereoBM> bm = StereoBM::create( params.ndisp, params.winSize );
        Mat tempDisp;
        bm.compute( leftImg, rightImg, tempDisp );
        tempDisp.convertTo(leftDisp, CV_32F, 1./StereoMatcher::DISP_SCALE);
        return params.winSize/2;
    }
};

//----------------------------------- StereoSGBM test -----------------------------------------------------

class RunParams
{
    public ndisp: alvision.int; 
    public winSize: alvision.int;
    public fullDP : boolean;
};

class CV_StereoSGBMTest extends CV_StereoMatchingTest
{
    constructor()
    {
        super();
        name = "stereosgbm";
        fill(rmsEps.begin(), rmsEps.end(), 0.25f);
        fill(fracEps.begin(), fracEps.end(), 0.01f);
    }

    
    protected caseRunParams: Array<RunParams>;

    readRunParams(fs : alvision.FileStorage ) : alvision.int 
    {
        int code = CV_StereoMatchingTest::readRunParams(fs);
        FileNode fn = fs.getFirstTopLevelNode();
        assert(fn.isSeq());
        for( int i = 0; i < (int)fn.size(); i+=5 )
        {
            String caseName = fn[i], datasetName = fn[i+1];
            RunParams params;
            String ndisp = fn[i+2]; params.ndisp = atoi(ndisp);
            String winSize = fn[i+3]; params.winSize = atoi(winSize);
            String fullDP = fn[i+4]; params.fullDP = atoi(fullDP) == 0 ? false : true;
            caseNames.push( caseName );
            caseDatasets.push( datasetName );
            caseRunParams.push( params );
        }
        return code;
    }

    runStereoMatchingAlgorithm(leftImg : alvision.Mat, rightImg : alvision.Mat,
        leftDisp : alvision.Mat, rightDisp : alvision.Mat, caseIdx  : alvision.int ) : alvision.int
    {
        RunParams params = caseRunParams[caseIdx];
        assert( params.ndisp%16 == 0 );
        Ptr<StereoSGBM> sgbm = StereoSGBM::create( 0, params.ndisp, params.winSize,
                                                 10*params.winSize*params.winSize,
                                                 40*params.winSize*params.winSize,
                                                 1, 63, 10, 100, 32, params.fullDP ?
                                                 StereoSGBM::MODE_HH : StereoSGBM::MODE_SGBM );
        sgbm.compute( leftImg, rightImg, leftDisp );
        CV_Assert( leftDisp.type() == CV_16SC1 );
        leftDisp/=16;
        return 0;
    }
};


alvision.cvtest.TEST('Calib3d_StereoBM', 'regression', () => { var test = new CV_StereoBMTest(); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_StereoSGBM', 'regression', () => { var test = new CV_StereoSGBMTest (); test.safe_run(); });
