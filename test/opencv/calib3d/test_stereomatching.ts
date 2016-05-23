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
    if (_img.empty())
        alvision.CV_Error(alvision.cv.Error.Code.StsBadArg, "img is empty");

    var img = _img;
    if( _img.channels() > 1)
    {
        var tmp = new alvision.Mat; alvision.cvtColor( _img, tmp,alvision.ColorConversionCodes. COLOR_BGR2GRAY ); img = tmp;
    }
    var dxI = new alvision.Mat(); alvision.Sobel( img, dxI, alvision.MatrixType.CV_32FC1, 1, 0, 3 );
    var dxI2 = new alvision.Mat(); alvision.pow(alvision.MatExpr.op_Division( dxI , 8.).toMat()/*normalize*/, 2, dxI2 );
    var avgDxI2 = new alvision.Mat(); alvision.boxFilter(dxI2, avgDxI2, alvision.MatrixType.CV_32FC1, new alvision.Size(texturelessWidth,texturelessWidth) );

    if (texturelessMask) {
        alvision.MatExpr.op_LessThan(avgDxI2, texturelessThresh).toMat().copyTo(texturelessMask);
        //*texturelessMask = avgDxI2 < texturelessThresh;
    }
    if (texturedMask) {
        alvision.MatExpr.op_GreaterThanOrEqual(avgDxI2, texturelessThresh).toMat().copyTo(texturedMask);
        //*texturedMask = avgDxI2 >= texturelessThresh;
    }
}

function checkTypeAndSizeOfDisp(dispMap: alvision.Mat, sz: alvision.Size ) : void
{
    if( dispMap.empty() )
        alvision.CV_Error( alvision.cv.Error.Code.StsBadArg, "dispMap is empty" );
    if (dispMap.type() != alvision.MatrixType.CV_32FC1 )
        alvision.CV_Error( alvision.cv.Error.Code.StsBadArg, "dispMap must have CV_32FC1 type" );
    if( sz && (dispMap.rows != sz.height || dispMap.cols != sz.width) )
        alvision.CV_Error( alvision.cv.Error.Code.StsBadArg, "dispMap has incorrect size" );
}

function checkTypeAndSizeOfMask(mask: alvision.Mat, sz: alvision.Size ) : void
{
    if( mask.empty() )
        alvision.CV_Error( alvision.cv.Error.Code.StsBadArg, "mask is empty" );
    if (mask.type() != alvision.MatrixType.CV_8UC1 )
        alvision.CV_Error( alvision.cv.Error.Code.StsBadArg, "mask must have CV_8UC1 type" );
    if( mask.rows != sz.height || mask.cols != sz.width )
        alvision.CV_Error( alvision.cv.Error.Code.StsBadArg, "mask has incorrect size" );
}

function checkDispMapsAndUnknDispMasks(leftDispMap: alvision.Mat, rightDispMap: alvision.Mat,
    leftUnknDispMask: alvision.Mat, rightUnknDispMask: alvision.Mat): void {
    // check type and size of disparity maps
    checkTypeAndSizeOfDisp(leftDispMap, null);
    if (!rightDispMap.empty()) {
        var sz = leftDispMap.size();
        checkTypeAndSizeOfDisp(rightDispMap, sz);
    }

    // check size and type of unknown disparity maps
    if (!leftUnknDispMask.empty())
        checkTypeAndSizeOfMask(leftUnknDispMask, leftDispMap.size());
    if (!rightUnknDispMask.empty())
        checkTypeAndSizeOfMask(rightUnknDispMask, rightDispMap.size());

    // check values of disparity maps (known disparity values musy be positive)
    var leftMinVal = 0, rightMinVal = 0;
    if (leftUnknDispMask.empty())
        alvision.minMaxLoc(leftDispMap, (minVal) => {leftMinVal = minVal.valueOf()});
    else
        alvision.minMaxLoc(leftDispMap, (minVal) => { leftMinVal = minVal.valueOf() }, ~leftUnknDispMask );
    if( !rightDispMap.empty() )
    {
        if( rightUnknDispMask.empty() )
            alvision.minMaxLoc(rightDispMap, (minVal) => { rightMinVal = minVal.valueOf() } );
        else
            alvision.minMaxLoc(rightDispMap, (minVal) => { rightMinVal = minVal.valueOf() }, ~rightUnknDispMask );
    }
    if( leftMinVal < 0 || rightMinVal < 0)
        alvision.CV_Error( alvision.cv.Error.Code.StsBadArg, "known disparity values must be positive" );
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

    var rightDisp = new alvision.Mat();
    if( _rightDisp.empty() )
    {
        if( !rightUnknDispMask.empty() )
           alvision.CV_Error( alvision.cv.Error.Code.StsBadArg, "rightUnknDispMask must be empty if _rightDisp is empty" );
        rightDisp.create(leftDisp.size(),alvision.MatrixType. CV_32FC1);
        rightDisp.setTo(alvision.Scalar.all(0) );
        for( var leftY = 0; leftY < leftDisp.rows; leftY++ )
        {
            for( var leftX = 0; leftX < leftDisp.cols; leftX++ )
            {
                if( !leftUnknDispMask.empty() && leftUnknDispMask.at<alvision.uchar>("uchar", leftY,leftX).get() )
                    continue;
                var leftDispVal = leftDisp.at<alvision.float>("float", leftY, leftX).get();
                var rightX = leftX - Math.round(leftDispVal.valueOf()), rightY = leftY;
                if( rightX >= 0)
                    rightDisp.at<alvision.float>("float",rightY,rightX).set(Math.max(rightDisp.at<alvision.float>("float", rightY,rightX).get().valueOf(), leftDispVal.valueOf()));
            }
        }
    }
    else
        _rightDisp.copyTo(rightDisp);

    if( occludedMask )
    {
        occludedMask.create(leftDisp.size(), alvision.MatrixType.CV_8UC1);
        occludedMask.setTo(alvision.Scalar.all(0) );
    }
    if( nonOccludedMask )
    {
        nonOccludedMask.create(leftDisp.size(), alvision.MatrixType.CV_8UC1);
        nonOccludedMask.setTo(alvision.Scalar.all(0) );
    }
    for( var leftY = 0; leftY < leftDisp.rows; leftY++ )
    {
        for( var leftX = 0; leftX < leftDisp.cols; leftX++ )
        {
            if( !leftUnknDispMask.empty() && leftUnknDispMask.at<alvision.uchar>("uchar", leftY,leftX).get() )
                continue;
            var leftDispVal = leftDisp.at<alvision.float>("float", leftY, leftX).get();
            var rightX = leftX - Math.round(leftDispVal.valueOf()), rightY = leftY;
            if( rightX < 0 && occludedMask )
                occludedMask.at<alvision.uchar>("uchar", leftY, leftX).set( 255);
            else
            {
                if( !rightUnknDispMask.empty() && rightUnknDispMask.at<alvision.uchar>("uchar", rightY,rightX) )
                    continue;
                var rightDispVal = rightDisp.at < alvision.float>("float", rightY, rightX).get();
                if( rightDispVal > leftDispVal.valueOf() + dispThresh.valueOf() )
                {
                    if (occludedMask)
                        occludedMask.at<alvision.uchar>("uchar", leftY, leftX).set(255);
                }
                else
                {
                    if (nonOccludedMask)
                        nonOccludedMask.at<alvision.uchar>("uchar", leftY, leftX).set(255);
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
        alvision.CV_Error( alvision.cv.Error.Code.StsBadArg, "disp is empty" );
    if (disp.type() != alvision.MatrixType.CV_32FC1 )
        alvision.CV_Error( alvision.cv.Error.Code.StsBadArg, "disp must have CV_32FC1 type" );
    if( !unknDispMask.empty() )
        checkTypeAndSizeOfMask( unknDispMask, disp.size() );

    var curDisp = disp.clone();
    if( !unknDispMask.empty() )
        curDisp.setTo( new alvision.Scalar(alvision.FLT_MIN /*alvision.FLT_MIN*/), unknDispMask );
    var maxNeighbDisp = new alvision.Mat(); alvision.dilate(curDisp, maxNeighbDisp, new alvision.Mat(3, 3, alvision.MatrixType.CV_8UC1, new alvision.Scalar(1)) );
    if( !unknDispMask.empty() )
        curDisp.setTo(new alvision. Scalar(alvision.FLT_MAX), unknDispMask );
    var minNeighbDisp = new alvision.Mat(); alvision.erode(curDisp, minNeighbDisp, new alvision.Mat(3, 3, alvision.MatrixType.CV_8UC1, new alvision.Scalar(1)));

    alvision.max(alvision.MatExpr.op_Substraction(maxNeighbDisp, disp).toMat(), alvision.MatExpr.op_Substraction(disp, minNeighbDisp).toMat(), depthDiscontMask);
    alvision.MatExpr.op_GreaterThan(depthDiscontMask, dispGap).toMat().copyTo(depthDiscontMask);

    //depthDiscontMask = alvision.max((alvision.MatExpr.op_Substraction( maxNeighbDisp,disp).toMat(), alvision.MatExpr.op_Substraction(disp,minNeighbDisp).toMat() ) > dispGap;
    if (!unknDispMask.empty()) {
        alvision.MatExpr.op_And(depthDiscontMask, alvision.MatExpr.op_BinaryNot(unknDispMask)).toMat().copyTo(depthDiscontMask);
        //depthDiscontMask &= ~unknDispMask;
    }
    alvision.dilate(depthDiscontMask, depthDiscontMask, new alvision.Mat(discontWidth, discontWidth, alvision.MatrixType.CV_8UC1, new alvision.Scalar(1)) );
}

/*
   Get evaluation masks excluding a border.
*/
function getBorderedMask(maskSize: alvision.Size, border: alvision.int = EVAL_IGNORE_BORDER ) : alvision.Mat
{
    alvision.CV_Assert(()=> border >= 0 );
    var mask = new alvision.Mat (maskSize, alvision.MatrixType.CV_8UC1, new alvision.Scalar(0));
    var w = maskSize.width.valueOf() - 2*border.valueOf(), h = maskSize.height.valueOf() - 2*border.valueOf();
    if( w < 0 ||  h < 0 )
        mask.setTo(new alvision.Scalar(0));
    else
        mask.roi(new alvision.Rect(new alvision.Point(border,border),new alvision.Size(w,h)) ).setTo(new alvision.Scalar(255));
    return mask;
}

/*
  Calculate root-mean-squared error between the computed disparity map (computedDisp) and ground truth map (groundTruthDisp).
*/
function dispRMS(computedDisp: alvision.Mat, groundTruthDisp: alvision.Mat, mask: alvision.Mat ) : alvision.float  
{
    checkTypeAndSizeOfDisp( groundTruthDisp, null);
    var sz = groundTruthDisp.size();
    checkTypeAndSizeOfDisp( computedDisp, sz );

    var pointsCount = sz.height.valueOf()*sz.width.valueOf();
    if( !mask.empty() )
    {
        checkTypeAndSizeOfMask( mask, sz );
        pointsCount = alvision.countNonZero(mask).valueOf();
    }
    return 1./Math.sqrt(pointsCount) * alvision.norm(computedDisp, groundTruthDisp,alvision.NormTypes. NORM_L2, mask).valueOf();
}

/*
  Calculate fraction of bad matching pixels.
*/
function badMatchPxlsFraction(computedDisp: alvision.Mat, groundTruthDisp: alvision.Mat, mask: alvision.Mat ,
    _badThresh: alvision.float  = EVAL_BAD_THRESH ) : alvision.float
{
    var badThresh = Math.round(_badThresh.valueOf());
    checkTypeAndSizeOfDisp( groundTruthDisp, null);
    var sz = groundTruthDisp.size();
    checkTypeAndSizeOfDisp( computedDisp, sz );

    var badPxlsMap = new alvision.Mat();
    alvision.absdiff(computedDisp, groundTruthDisp, badPxlsMap);
    badPxlsMap = alvision.MatExpr.op_GreaterThan( badPxlsMap , badThresh).toMat();
    var pointsCount = sz.height.valueOf()*sz.width.valueOf();
    if( !mask.empty() )
    {
        checkTypeAndSizeOfMask( mask, sz );
        badPxlsMap = alvision.MatExpr.op_And( badPxlsMap , mask).toMat();
        pointsCount = alvision.countNonZero(mask).valueOf();
    }
    return 1./pointsCount * alvision.countNonZero(badPxlsMap).valueOf();
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
     public badThresh: alvision.float;
     public texturelessWidth: alvision.int ;
     public texturelessThresh: alvision.float ;
     public dispThresh: alvision.float;
     public dispGap: alvision.float ;
     public discontWidth: alvision.int ;
     public ignoreBorder: alvision.int ;
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
        this.rmsEps = alvision.NewArray <alvision.float>(ERROR_KINDS_COUNT, ()=> 0.01 );
        this.fracEps = alvision.NewArray<alvision.float>(ERROR_KINDS_COUNT,()=> 1.e-6);
    }
    // assumed that left image is a reference image
    runStereoMatchingAlgorithm(leftImg: alvision.Mat, rightImg: alvision.Mat,
        leftDisp: alvision.Mat, rightDisp: alvision.Mat, caseIdx: alvision.int): alvision.int { throw new Error("abstract"); } // return ignored border width

    readDatasetsParams(fs: alvision.FileStorage): alvision.int {
        if (!fs.isOpened()) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "datasetsParams can not be read ");
            return alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
        }
        this.datasetsParams = {};// .clear();
        var fn = fs.getFirstTopLevelNode();
        alvision.assert(()=>fn.isSeq());
        for (var i = 0; i < fn.size(); i += 3 )
        {
            var _name = fn[i];
            var params = new DatasetParams();
            var sf = fn[i + 1]; params.dispScaleFactor = +(sf);
            var uv = fn[i + 2]; params.dispUnknVal = +(uv);
            this.datasetsParams[_name] = params;
        }
        return alvision.cvtest.FailureCode.OK;
    }
    readRunParams(fs: alvision.FileStorage): alvision.int {
        if (!fs.isOpened()) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "runParams can not be read ");
            return alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
        }
        this.caseNames.length = 0;
        this.caseDatasets.length = 0;
        return alvision.cvtest.FailureCode.OK;
    }
    writeErrors(errName: string, errors: Array<alvision.float>, fs: alvision.FileStorage = null): void {
        alvision.assert(()=>errors.length == ERROR_KINDS_COUNT);
        //Array<float>::const_iterator it = errors.begin();
        errors.forEach((it, i, a) => {
            if (fs)
                for (var i = 0; i < ERROR_KINDS_COUNT; i++ )
                    fs.write(ERROR_PREFIXES[i] + errName,it);
            else
                for (var i = 0; i < ERROR_KINDS_COUNT; i++ )
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "%s = %f\n", ERROR_PREFIXES[i] + errName, it);
        });
    }
    readErrors(fn: alvision.FileNode, errName: string, errors: Array<alvision.float>): void {
        errors.length = (ERROR_KINDS_COUNT);
        //Array<float>::iterator it = errors.begin();
        errors.forEach((it, i, a) => {
            for (var i = 0; i < ERROR_KINDS_COUNT; i++)
                a[i] = fn.nodes[ERROR_PREFIXES[i] + errName].readFloat();
            
        });
    }
    compareErrors(calcErrors: Array<alvision.float>, validErrors: Array<alvision.float>,
        eps: Array<alvision.float>, errName: string): alvision.int {
        alvision.assert(()=>calcErrors.length == ERROR_KINDS_COUNT);
        alvision.assert(()=>validErrors.length == ERROR_KINDS_COUNT);
        alvision.assert(()=>eps.length == ERROR_KINDS_COUNT);
        //Array<float>::const_iterator calcIt = calcErrors.begin(),
            //validIt = validErrors.begin(),
            //epsIt = eps.begin();
        var ok = true;
        for (var i = 0; i < ERROR_KINDS_COUNT; i++)//, ++calcIt, ++validIt, ++epsIt)
            if (calcErrors[i].valueOf() - validErrors[i].valueOf() > eps[i]) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "bad accuracy of %s (valid=%f; calc=%f)\n", (ERROR_PREFIXES[i] + errName), validErrors[i], calcErrors[i]);
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
        var code = alvision.cvtest.FailureCode.OK;
        alvision.assert(()=>fs.isOpened());
        alvision.assert(()=>trueLeftDisp.type() == alvision.MatrixType.CV_32FC1);
        alvision.assert(()=>trueRightDisp.empty() || trueRightDisp.type() == alvision.MatrixType.CV_32FC1);
        alvision.assert(()=>leftDisp.type() == alvision.MatrixType.CV_32FC1 && rightDisp.type() == alvision.MatrixType.CV_32FC1);

        // get masks for unknown ground truth disparity values
        var leftUnknMask = new alvision.Mat(), rightUnknMask = new alvision.Mat();
        var params = this.datasetsParams[this.caseDatasets[caseIdx.valueOf()]];
        alvision.absdiff(trueLeftDisp, new alvision.Scalar(params.dispUnknVal), leftUnknMask);
        leftUnknMask = alvision.MatExpr.op_LessThan( leftUnknMask , alvision.FLT_EPSILON).toMat();
        alvision.assert(()=>leftUnknMask.type() == alvision.MatrixType.CV_8UC1);
        if (!trueRightDisp.empty()) {
            alvision.absdiff(trueRightDisp, new alvision.Scalar(params.dispUnknVal), rightUnknMask);
            rightUnknMask = alvision.MatExpr.op_LessThan( rightUnknMask , alvision.FLT_EPSILON).toMat();
            alvision.assert(()=>leftUnknMask.type() == alvision.MatrixType.CV_8UC1);
        }

        // calculate errors
        var rmss = new Array < alvision.float >() , badPxlsFractions = new Array<alvision.float>() ;
        calcErrors(leftImg, rightImg, trueLeftDisp, trueRightDisp, leftUnknMask, rightUnknMask,
            leftDisp, rightDisp, rmss, badPxlsFractions, qualityEvalParams);

        if (isWrite) {
            fs.writeScalar(this.caseNames[caseIdx.valueOf()]);
            fs.writeScalar("{");
            //fs << caseNames[caseIdx] << "{";
            //cvWriteComment( fs.fs, RMS_STR, 0 );
            this.writeErrors(RMS_STR, rmss, fs);
            //cvWriteComment( fs.fs, BAD_PXLS_FRACTION_STR, 0 );
            this.writeErrors(BAD_PXLS_FRACTION_STR, badPxlsFractions, fs);
            //fs << "}"; // datasetName
            fs.writeScalar("}");
        }
        else // compare
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "\nquality of case named %s\n", this.caseNames[caseIdx.valueOf()]);
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "%s\n", RMS_STR);
            this.writeErrors(RMS_STR, rmss);
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "%s\n", BAD_PXLS_FRACTION_STR);
            this.writeErrors(BAD_PXLS_FRACTION_STR, badPxlsFractions);

            var fn = fs.getFirstTopLevelNode()[this.caseNames[caseIdx.valueOf()]];
            var validRmss = new Array<alvision.float>(), validBadPxlsFractions = new Array<alvision.float>();

            this.readErrors(fn, RMS_STR, validRmss);
            this.readErrors(fn, BAD_PXLS_FRACTION_STR, validBadPxlsFractions);
            var tempCode = <alvision.cvtest.FailureCode>this.compareErrors(rmss, validRmss, this.rmsEps, RMS_STR);
            code = tempCode == alvision.cvtest.FailureCode.OK ? code : tempCode;
            tempCode = <alvision.cvtest.FailureCode>this.compareErrors(badPxlsFractions, validBadPxlsFractions, this.fracEps, BAD_PXLS_FRACTION_STR);
            code = tempCode == alvision.cvtest.FailureCode.OK ? code : tempCode;
        }
        return code;
    }
    run(iii: alvision.int): void {
        var dataPath = this.ts.get_data_path() + "cv/";
        var algorithmName = name;
        alvision.assert(()=>(algorithmName) ? true : false);
        if (!dataPath) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "dataPath is empty");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ARG_CHECK);
            return;
        }

        var datasetsFS = new alvision.FileStorage(dataPath + DATASETS_DIR + DATASETS_FILE, alvision.FileStorageMode.READ);
        var code = this.readDatasetsParams(datasetsFS);
        if (code != alvision.cvtest.FailureCode.OK) {
            this.ts.set_failed_test_info(code);
            return;
        }
        var runParamsFS = new alvision.FileStorage(dataPath + ALGORITHMS_DIR + algorithmName + RUN_PARAMS_FILE, alvision.FileStorageMode.READ);
        code = this.readRunParams(runParamsFS);
        if (code != alvision.cvtest.FailureCode.OK) {
            this.ts.set_failed_test_info(code);
            return;
        }

        var fullResultFilename = dataPath + ALGORITHMS_DIR + algorithmName + RESULT_FILE;
        var resFS = new alvision.FileStorage(fullResultFilename, alvision.FileStorageMode.READ);
        var isWrite = true; // write or compare results
        if (resFS.isOpened())
            isWrite = false;
        else {
            resFS.open(fullResultFilename, alvision.FileStorageMode.WRITE);
            if (!resFS.isOpened()) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "file %s can not be read or written\n", fullResultFilename);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ARG_CHECK);
                return;
            }
            
            resFS.writeScalar("stereo_matching");resFS.writeScalar( "{");
        }

        var progress = 0, caseCount = this.caseNames.length;
        for (var ci = 0; ci < caseCount; ci++) {
            progress = this.update_progress(progress, ci, caseCount, 0).valueOf();
            console.log(util.format("progress: %d%%\n", progress));
            //fflush(stdout);
            var datasetName = this.caseDatasets[ci];
            var datasetFullDirName = dataPath + DATASETS_DIR + datasetName + "/";
            var leftImg = alvision.imread(datasetFullDirName + LEFT_IMG_NAME);
            var rightImg = alvision.imread(datasetFullDirName + RIGHT_IMG_NAME);
            var trueLeftDisp = alvision.imread(datasetFullDirName + TRUE_LEFT_DISP_NAME, 0);
            var trueRightDisp = alvision.imread(datasetFullDirName + TRUE_RIGHT_DISP_NAME, 0);

            if (leftImg.empty() || rightImg.empty() || trueLeftDisp.empty()) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "images or left ground-truth disparities of dataset %s can not be read", datasetName);
                code = alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
                continue;
            }
            var dispScaleFactor = this.datasetsParams[datasetName].dispScaleFactor;
            var tmp = new alvision.Mat();

            trueLeftDisp.convertTo(tmp, alvision.MatrixType.CV_32FC1, 1. / dispScaleFactor.valueOf());
            trueLeftDisp = tmp;
            tmp = null;

            if (!trueRightDisp.empty()) {
                trueRightDisp.convertTo(tmp, alvision.MatrixType.CV_32FC1, 1./ dispScaleFactor.valueOf());
                trueRightDisp = tmp;
                tmp = null;
            }

            var leftDisp = new alvision.Mat(), rightDisp = new alvision.Mat();
            var ignBorder = Math.max(this.runStereoMatchingAlgorithm(leftImg, rightImg, leftDisp, rightDisp, ci).valueOf(), EVAL_IGNORE_BORDER);

            leftDisp.convertTo(tmp, alvision.MatrixType.CV_32FC1);
            leftDisp = tmp;
            //tmp.release();

            rightDisp.convertTo(tmp, alvision.MatrixType.CV_32FC1);
            rightDisp = tmp;
            //tmp.release();

            var tempCode = this.processStereoMatchingResults(resFS, ci, isWrite,
                leftImg, rightImg, trueLeftDisp, trueRightDisp, leftDisp, rightDisp, new QualityEvalParams(ignBorder));
            code = tempCode == alvision.cvtest.FailureCode.OK ? code : tempCode;
        }

        if (isWrite)
            resFS.writeScalar("}");
            //resFS << "}"; // "stereo_matching"

        this.ts.set_failed_test_info(code);
    }

    protected rmsEps    : Array<alvision.float> ;
    protected  fracEps  : Array< alvision.float >;

    
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

    computeTextureBasedMasks( leftImg, texturelessMask, texturedMask,
                              qualityEvalParams.texturelessWidth, qualityEvalParams.texturelessThresh );
    var occludedMask = new alvision.Mat();
    var nonOccludedMask = new alvision.Mat();


    computeOcclusionBasedMasks( trueLeftDisp, trueRightDisp, occludedMask, nonOccludedMask,
                                trueLeftUnknDispMask, trueRightUnknDispMask, qualityEvalParams.dispThresh);
    var depthDiscontMask = new alvision.Mat();
    computeDepthDiscontMask( trueLeftDisp, depthDiscontMask, trueLeftUnknDispMask,
                             qualityEvalParams.dispGap, qualityEvalParams.discontWidth);

    var borderedKnownMask = alvision.MatExpr.op_And( getBorderedMask( leftImg.size(), qualityEvalParams.ignoreBorder ) ,alvision.MatExpr.op_BinaryNot( trueLeftUnknDispMask)).toMat();

    nonOccludedMask = alvision.MatExpr.op_And(nonOccludedMask, borderedKnownMask).toMat();
    occludedMask = alvision.MatExpr.op_And(occludedMask, borderedKnownMask).toMat();
    texturedMask = alvision.MatExpr.op_And(texturedMask, nonOccludedMask).toMat(); // & borderedKnownMask
    texturelessMask = alvision.MatExpr.op_And(texturelessMask, nonOccludedMask).toMat(); // & borderedKnownMask
    depthDiscontMask = alvision.MatExpr.op_And(depthDiscontMask, nonOccludedMask).toMat(); // & borderedKnownMask

    rms.length  = (ERROR_KINDS_COUNT);
    rms[0] = dispRMS( calcLeftDisp, trueLeftDisp, borderedKnownMask );
    rms[1] = dispRMS( calcLeftDisp, trueLeftDisp, nonOccludedMask );
    rms[2] = dispRMS( calcLeftDisp, trueLeftDisp, occludedMask );
    rms[3] = dispRMS( calcLeftDisp, trueLeftDisp, texturedMask );
    rms[4] = dispRMS( calcLeftDisp, trueLeftDisp, texturelessMask );
    rms[5] = dispRMS( calcLeftDisp, trueLeftDisp, depthDiscontMask );

    badPxlsFractions.length = (ERROR_KINDS_COUNT);
    badPxlsFractions[0] = badMatchPxlsFraction( calcLeftDisp, trueLeftDisp, borderedKnownMask, qualityEvalParams.badThresh );
    badPxlsFractions[1] = badMatchPxlsFraction( calcLeftDisp, trueLeftDisp, nonOccludedMask, qualityEvalParams.badThresh );
    badPxlsFractions[2] = badMatchPxlsFraction( calcLeftDisp, trueLeftDisp, occludedMask, qualityEvalParams.badThresh );
    badPxlsFractions[3] = badMatchPxlsFraction( calcLeftDisp, trueLeftDisp, texturedMask, qualityEvalParams.badThresh );
    badPxlsFractions[4] = badMatchPxlsFraction( calcLeftDisp, trueLeftDisp, texturelessMask, qualityEvalParams.badThresh );
    badPxlsFractions[5] = badMatchPxlsFraction( calcLeftDisp, trueLeftDisp, depthDiscontMask, qualityEvalParams.badThresh );
}


//----------------------------------- StereoBM test -----------------------------------------------------

 //class RunParams
 //{
 //    public ndisp: alvision.int;
 //    public winSize: alvision.int;
 //};


class CV_StereoBMTest extends CV_StereoMatchingTest
{
    constructor()
    {
        super();
        this.name = "stereobm";
        this.rmsEps = alvision.NewArray(this.rmsEps.length, () => 0.4);
        this.fracEps = alvision.NewArray(this.fracEps.length,()=> 0.022);
    }

    
    protected caseRunParams: Array<RunParams>;

    readRunParams(fs  :alvision.FileStorage ) : alvision.int
    {
        var code = super.readRunParams( fs );
        var fn = fs.getFirstTopLevelNode();
        alvision.assert(()=>fn.isSeq());
        for( var i = 0; i < fn.size(); i+=4 )
        {
            var caseName = fn[i], datasetName = fn[i+1];
            var params = new RunParams();
            var ndisp = fn[i+2]; params.ndisp = +(ndisp);
            var winSize = fn[i+3]; params.winSize = +(winSize);
            this.caseNames.push( caseName );
            this.caseDatasets.push( datasetName );
            this.caseRunParams.push( params );
        }
        return code;
    }

    runStereoMatchingAlgorithm(_leftImg : alvision.Mat, _rightImg : alvision.Mat,
        leftDisp : alvision.Mat, rightDisp : alvision.Mat, caseIdx  :alvision.int ) : alvision.int
    {
        var params = this.caseRunParams[caseIdx.valueOf()];
        alvision.assert(()=> params.ndisp.valueOf()%16 == 0 );
        alvision.assert(()=>_leftImg.type() == alvision.MatrixType.CV_8UC3 && _rightImg.type() == alvision.MatrixType.CV_8UC3 );
        var leftImg  = new alvision.Mat(); alvision.cvtColor( _leftImg, leftImg, alvision.ColorConversionCodes.COLOR_BGR2GRAY);
        var rightImg = new alvision.Mat(); alvision.cvtColor(_rightImg, rightImg, alvision.ColorConversionCodes.COLOR_BGR2GRAY );


        var bm = alvision.StereoBM.create( params.ndisp, params.winSize );
        var tempDisp = new alvision.Mat();
        bm.compute( leftImg, rightImg, tempDisp );
        tempDisp.convertTo(leftDisp, alvision.MatrixType.CV_32F, 1./alvision.StereoDISP.DISP_SCALE);
        return params.winSize.valueOf()/2;
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
    constructor() {
        super();
        name = "stereosgbm";
        this.rmsEps.forEach((v, i, a) => a[i] = 0.25);
        this.fracEps.forEach((v, i, a) => a[i] = 0.01);
    }

    
    protected caseRunParams: Array<RunParams>;

    readRunParams(fs : alvision.FileStorage ) : alvision.int 
    {
        var code = super.readRunParams(fs);
        var fn = fs.getFirstTopLevelNode();
        alvision.assert(()=>fn.isSeq());
        for( var i = 0; i < fn.size(); i+=5 )
        {
            var caseName = fn[i], datasetName = fn[i+1];
            var params = new RunParams();
            var ndisp = fn[i+2]; params.ndisp = +(ndisp);
            var winSize = fn[i+3]; params.winSize = +(winSize);
            var fullDP = fn[i+4]; params.fullDP = +(fullDP) == 0 ? false : true;
            this.caseNames.push( caseName );
            this.caseDatasets.push( datasetName );
            this.caseRunParams.push( params );
        }
        return code;
    }

    runStereoMatchingAlgorithm(leftImg : alvision.Mat, rightImg : alvision.Mat,
        leftDisp : alvision.Mat, rightDisp : alvision.Mat, caseIdx  : alvision.int ) : alvision.int
    {
        var params = this.caseRunParams[caseIdx.valueOf()];
        alvision.assert(()=> params.ndisp.valueOf() %16 == 0 );
        var sgbm = alvision.StereoSGBM.create(0, params.ndisp, params.winSize,
            10 * params.winSize.valueOf() * params.winSize.valueOf(),
            40 * params.winSize.valueOf() * params.winSize.valueOf(),
            1, 63, 10, 100, 32, params.fullDP ?
                alvision.StereoSGBMMode.MODE_HH : alvision.StereoSGBMMode.MODE_SGBM);

        sgbm.compute( leftImg, rightImg, leftDisp );
        alvision.CV_Assert(()=>leftDisp.type() == alvision.MatrixType.CV_16SC1 );
        
        //leftDisp /= 16;
        alvision.MatExpr.op_Division(leftDisp, 16).toMat().copyTo(leftDisp);

        return 0;
    }
};


alvision.cvtest.TEST('Calib3d_StereoBM', 'regression', () => { var test = new CV_StereoBMTest(); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_StereoSGBM', 'regression', () => { var test = new CV_StereoSGBMTest (); test.safe_run(); });
