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
import tape = require("tape");
import path = require("path");

import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');


//#include "test_precomp.hpp"
//
//using namespace std;
//using namespace cv;
//using alvision.ml::TrainData;
//using alvision.ml::EM;
//using alvision.ml::KNearest;

function defaultDistribs(means : alvision.Mat, covs: Array<alvision.Mat>, type: alvision.int= alvision.MatrixType.CV_32FC1): void {
    var mp0 = [ 0.0, 0.0], cp0 = [ 0.67, 0.0, 0.0, 0.67];
    var mp1 = [ 5.0, 0.0], cp1 = [ 1.0, 0.0, 0.0, 1.0];
    var mp2 = [1.0, 5.0], cp2 = [1.0, 0.0, 0.0, 1.0];
    means.create(3, 2, type);
    var m0 = new alvision.Mat(1, 2,alvision.MatrixType. CV_32FC1, mp0), c0 = new alvision.Mat(2, 2, alvision.MatrixType.CV_32FC1, cp0);
    var m1 = new alvision.Mat(1, 2,alvision.MatrixType. CV_32FC1, mp1), c1 = new alvision.Mat(2, 2, alvision.MatrixType.CV_32FC1, cp1);
    var m2 = new alvision.Mat(1, 2,alvision.MatrixType. CV_32FC1, mp2), c2 = new alvision.Mat(2, 2, alvision.MatrixType.CV_32FC1, cp2);
    means.resize(3), covs.length = 3;

    var mr0 = means.row(0);
    m0.convertTo(mr0, type);
    c0.convertTo(covs[0], type);

    var mr1 = means.row(1);
    m1.convertTo(mr1, type);
    c1.convertTo(covs[1], type);

    var mr2 = means.row(2);
    m2.convertTo(mr2, type);
    c2.convertTo(covs[2], type);
}

// generate points sets by normal distributions
function generateData(data: alvision.Mat, labels: alvision.Mat, sizes: Array<alvision.int>, _means: alvision.Mat, covs: Array<alvision.Mat>, dataType: alvision.int, labelType: alvision.int): void {
    //Array<int>::const_iterator sit = sizes.begin();
    let total = 0;
    for (let i = 0; i < sizes.length; i++)
        total += sizes[i].valueOf();
    alvision.CV_Assert(()=>_means.rows() == sizes.length && covs.length == sizes.length);
    alvision.CV_Assert(()=>!data.empty() && data.rows() == total);
    alvision.CV_Assert(()=>data.type() == dataType);

    labels.create(data.rows(), 1, labelType);

    alvision.randn(data, alvision.Scalar.all(-1.0), alvision.Scalar.all(1.0));
    var means = new Array<alvision.Mat>(sizes.length);
    for (var i = 0; i < _means.rows(); i++)
        means[i] = _means.row(i);
    //Array<Mat>::const_iterator mit = means.begin(), cit = covs.begin();
    //int bi, ei = 0;
    let ei = 0;
    let bi = 0;
    //sit = sizes.begin();
    //for (let p = 0, l = 0; sit != sizes.end(); ++sit, ++mit, ++cit, l++ )
    for (let p = 0, l = 0; l < sizes.length;l++)
    {
        var sit = sizes[l];
        var mit = means[l];
        var cit = covs[l];
        bi = ei;
        ei = bi + sit.valueOf();
        alvision.assert(()=>mit.rows() == 1 && mit.cols() == data.cols());
        alvision.assert(()=>cit.rows() == data.cols() && cit.cols() == data.cols());
        for (let i = bi; i < ei; i++ , p++ )
        {
            let r = data.row(i);
            r = alvision.MatExpr.op_Multiplication( r ,cit).op_Addition(mit).toMat();
            if (labelType == alvision.MatrixType.CV_32FC1)
                labels.at<alvision.float>("float", p, 0).set( l);
            else if (labelType == alvision.MatrixType.CV_32SC1)
                labels.at<alvision.int>("int", p, 0).set( l);
            else {
                alvision.CV_DbgAssert(()=>false);
            }
        }
    }
}

function maxIdx(count: Array<alvision.int> ) : alvision.int   
{
    var idx = -1;
    var maxVal = -1;
    //Array<int>::const_iterator it = count.begin();
    //for( var i = 0; it != count.end(); ++it, i++ )
    for (let i = 0; i < count.length;i++)
    {
        if( count[i] > maxVal)
        {
            maxVal = count[i].valueOf()
            idx = i;
        }
    }
    alvision.assert(()=> idx >= 0);
    return idx;
}

function getLabelsMap(labels: alvision.Mat, sizes: Array<alvision.int>, labelsMap: Array<alvision.int> , checkClusterUniq : boolean=true ) : boolean
{
    var total = 0, nclusters = sizes.length;
    for(var i = 0; i < sizes.length; i++)
        total += sizes[i].valueOf();

    alvision.assert(()=> !labels.empty() );
    alvision.assert(()=> labels.total() == total && (labels.cols() == 1 || labels.rows() == 1));
    alvision.assert(()=>labels.type() == alvision.MatrixType.CV_32SC1 || labels.type() == alvision.MatrixType.CV_32FC1 );

    var isFlt = labels.type() == alvision.MatrixType.CV_32FC1;

    labelsMap.length = (nclusters);

    let buzy = alvision.NewArray<boolean>(nclusters,()=> false);
    var startIndex = 0;
    for( let clusterIndex = 0; clusterIndex < sizes.length; clusterIndex++ )
    {
        var count = alvision.NewArray<alvision.int>( nclusters,()=> 0 );
        for( let i = startIndex; i < startIndex.valueOf() + sizes[clusterIndex].valueOf(); i++)
        {
            var lbl = isFlt ? labels.at<alvision.float>("float", i).get() : labels.at<alvision.int>("int", i).get();
            alvision.CV_Assert(()=>lbl < nclusters);
            count[lbl.valueOf()] = count[lbl.valueOf()].valueOf() + 1;
            alvision.CV_Assert(()=>count[lbl.valueOf()] < total);
        }
        startIndex += sizes[clusterIndex].valueOf();

        var cls = maxIdx( count );
        alvision.CV_Assert(()=> !checkClusterUniq || !buzy[cls.valueOf()] );

        labelsMap[clusterIndex] = cls;

        buzy[cls.valueOf()] = true;
    }

    if(checkClusterUniq)
    {
        for(var i = 0; i < buzy.length; i++)
            if(!buzy[i])
                return false;
    }

    return true;
}


function calcErr(labels: alvision.Mat, origLabels: alvision.Mat, sizes: Array<alvision.int>,cbErr: ( err: alvision.float)=>void ,  labelsEquivalent  : boolean= true,checkClusterUniq : boolean =true ) : boolean
{
    let err = 0;
    alvision.CV_Assert(()=> !labels.empty() && !origLabels.empty() );
    alvision.CV_Assert(()=> labels.rows() == 1 || labels.cols() == 1 );
    alvision.CV_Assert(()=> origLabels.rows() == 1 || origLabels.cols() == 1 );
    alvision.CV_Assert(()=> labels.total() == origLabels.total() );
    alvision.CV_Assert(() => labels.type() == alvision.MatrixType.CV_32SC1 || labels.type() == alvision.MatrixType.CV_32FC1 );
    alvision.CV_Assert(()=> origLabels.type() == labels.type() );

    let labelsMap = new Array<alvision.int>();
    var isFlt = labels.type() == alvision.MatrixType.CV_32FC1;
    if( !labelsEquivalent )
    {
        if( !getLabelsMap( labels, sizes, labelsMap, checkClusterUniq ) )
            return false;

        for( var i = 0; i < labels.rows(); i++ )
            if( isFlt )
                err = err.valueOf() + (labels.at<alvision.float>("float",i).get() != labelsMap[origLabels.at<alvision.float>("float",i).get().valueOf()] ? 1. : 0.);
            else
                err = err.valueOf() + (labels.at<alvision.int>("int",i).get() != labelsMap[origLabels.at<alvision.int>("int", i).get().valueOf()] ? 1. : 0.);
    }
    else
    {
        for( var i = 0; i < labels.rows(); i++ )
            if( isFlt )
                err = err.valueOf() + (labels.at<alvision.float>("float", i) != origLabels.at<alvision.float>("float",i) ? 1. : 0.);
            else
                err = err.valueOf() + (labels.at<alvision.int>("int",i) != origLabels.at<alvision.int>("int",i) ? 1. : 0.);
    }
    err = err.valueOf() / labels.rows().valueOf();
    cbErr(err);
    return true;
}

//--------------------------------------------------------------------------------------------
class CV_KMeansTest  extends alvision.cvtest.BaseTest {
    run(start_from: alvision.int): void {
        const  iters = 100;
        var sizesArr = [5000, 7000, 8000];
        var pointsCount = sizesArr[0] + sizesArr[1] + sizesArr[2];

        var data = new alvision.Mat(pointsCount, 2, alvision.MatrixType.CV_32FC1), labels;
        let sizes = Array<alvision.int>(sizesArr.length);//, sizesArr + sizeof(sizesArr) / sizeof(sizesArr[0]));
        let means = new alvision.Mat();
        let covs = new Array<alvision.Mat>();
        defaultDistribs(means, covs);
        generateData(data, labels, sizes, means, covs, alvision.MatrixType.CV_32FC1, alvision.MatrixType.CV_32SC1);

        var code = alvision.cvtest.FailureCode.OK;
        let err: alvision.float;
        let bestLabels = new alvision.Mat();
        // 1. flag==KMEANS_PP_CENTERS
        alvision.kmeans(data, 3, bestLabels, new alvision.TermCriteria(alvision.TermCriteriaType.COUNT, iters, 0.0), 0, alvision.KmeansFlags. KMEANS_PP_CENTERS, null);
        if (!calcErr(bestLabels, labels, sizes, (err_) => { err = err_; }, false)) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Bad output labels if flag==KMEANS_PP_CENTERS.\n");
            code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
        }
        else if (err > 0.01 )
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Bad accuracy (%f) if flag==KMEANS_PP_CENTERS.\n", err);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
        }

        // 2. flag==KMEANS_RANDOM_CENTERS
        alvision.kmeans(data, 3, bestLabels, new alvision.TermCriteria(alvision.TermCriteriaType.COUNT, iters, 0.0), 0, alvision.KmeansFlags. KMEANS_RANDOM_CENTERS, null);
        if (!calcErr(bestLabels, labels, sizes, (err_) => { err = err_; }, false)) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Bad output labels if flag==KMEANS_RANDOM_CENTERS.\n");
            code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
        }
        else if (err > 0.01 )
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Bad accuracy (%f) if flag==KMEANS_RANDOM_CENTERS.\n", err);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
        }

        // 3. flag==KMEANS_USE_INITIAL_LABELS
        labels.copyTo(bestLabels);
        var rng = new alvision.RNG();
        for (var i = 0; i < 0.5 * pointsCount; i++)
            bestLabels.at<alvision.int>("int", rng.next().valueOf() % pointsCount, 0).set(rng.next().valueOf() % 3);
        alvision.kmeans(data, 3, bestLabels, new alvision.TermCriteria(alvision.TermCriteriaType.COUNT, iters, 0.0), 0, alvision.KmeansFlags. KMEANS_USE_INITIAL_LABELS, null);
        if (!calcErr(bestLabels, labels, sizes, (err_) => { err = err_; }, false)) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Bad output labels if flag==KMEANS_USE_INITIAL_LABELS.\n");
            code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
        }
        else if (err > 0.01)
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Bad accuracy (%f) if flag==KMEANS_USE_INITIAL_LABELS.\n", err);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
        }

        this.ts.set_failed_test_info(code);
    }
};

//--------------------------------------------------------------------------------------------
class CV_KNearestTest  extends alvision.cvtest.BaseTest {
    run(start_from: alvision.int): void {
        let sizesArr = [ 500, 700, 800 ];
        let pointsCount = sizesArr[0] + sizesArr[1] + sizesArr[2];

        // train data
        let trainData = new alvision.Mat(pointsCount, 2, alvision.MatrixType. CV_32FC1), trainLabels = new alvision.Mat();
        let sizes = new Array<alvision.int>(sizesArr.length);//, sizesArr + sizeof(sizesArr) / sizeof(sizesArr[0]));
        let means = new alvision.Mat();
        let covs = new Array<alvision.Mat>();
        defaultDistribs(means, covs);
        generateData(trainData, trainLabels, sizes, means, covs, alvision.MatrixType.CV_32FC1, alvision.MatrixType.CV_32FC1);

        // test data
        let testData = new alvision.Mat(pointsCount, 2, alvision.MatrixType.CV_32FC1), testLabels, bestLabels;
        generateData(testData, testLabels, sizes, means, covs, alvision.MatrixType. CV_32FC1, alvision.MatrixType.CV_32FC1);

        let code = alvision.cvtest.FailureCode.OK;

        // KNearest default implementation
        let knearest = alvision.ml.KNearest.create();
        knearest.train(trainData,alvision.ml.SampleTypes.ROW_SAMPLE, trainLabels);
        knearest.findNearest(testData, 4, bestLabels);
        let err : alvision.float;
        if (!calcErr(bestLabels, testLabels, sizes, (err_) => { err = err; }, true)) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Bad output labels.\n");
            code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
        }
        else if (err > 0.01 )
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Bad accuracy (%f) on test data.\n", err);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
        }

        // KNearest KDTree implementation
        let knearestKdt = alvision.ml.KNearest.create();
        knearestKdt.setAlgorithmType(alvision.ml.KNearestTypes.KDTREE);
        knearestKdt.train(trainData,alvision.ml.SampleTypes.ROW_SAMPLE, trainLabels);
        knearestKdt.findNearest(testData, 4, bestLabels);
        if (!calcErr(bestLabels, testLabels, sizes, (err_) => { err = err_; }, true)) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Bad output labels.\n");
            code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
        }
        else if (err > 0.01)
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Bad accuracy (%f) on test data.\n", err);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
        }

        this.ts.set_failed_test_info(code);
    }
};



export class EM_Params
{
    constructor(_nclusters: alvision.int = 10, _covMatType: alvision.ml.EMTypes | alvision.int = alvision.ml.EMTypes.COV_MAT_DIAGONAL, _startStep: alvision.ml.EMStartStep | alvision.int = alvision.ml.EMStartStep.START_AUTO_STEP,
        _termCrit: alvision.TermCriteria =new alvision.TermCriteria(alvision.TermCriteriaType.COUNT+alvision.TermCriteriaType.EPS, 100, alvision.FLT_EPSILON),
        _probs: alvision.Mat =null, _weights: alvision.Mat =null,
        _means: alvision.Mat =null,  _covs: Array<alvision.Mat>=null){
    /*: nclusters(_nclusters), covMatType(_covMatType), startStep(_startStep),
    probs(_probs), weights(_weights), means(_means), covs(_covs), termCrit(_termCrit)*/

    this.nclusters = _nclusters;

}

    public nclusters: alvision.int;
    public  covMatType    : alvision.int;
    public  startStep     : alvision.int;

    // all 4 following matrices should have type CV_32FC1
    public probs: alvision.Mat;//*  ;
    public weights: alvision.Mat;//*  ;
    public means: alvision.Mat;// * ;
    public covs: Array<alvision.Mat>;//* ;

    public termCrit: alvision.TermCriteria;
};

//--------------------------------------------------------------------------------------------
class CV_EMTest  extends alvision.cvtest.BaseTest
{
    run(start_from: alvision.int): void {
        var sizesArr = [ 500, 700, 800 ];
        let pointsCount = sizesArr[0] + sizesArr[1] + sizesArr[2];

        // Points distribution
        let means = new alvision.Mat();
        let covs = new Array<alvision.Mat>();
        defaultDistribs(means, covs, alvision.MatrixType.CV_64FC1);

        // train data
        let trainData = new alvision.Mat(pointsCount, 2, alvision.MatrixType. CV_64FC1), trainLabels;
        let sizes = new Array<alvision.int>(sizesArr.length);//, sizesArr + sizeof(sizesArr) / sizeof(sizesArr[0]));
        generateData(trainData, trainLabels, sizes, means, covs, alvision.MatrixType.CV_64FC1, alvision.MatrixType.CV_32SC1);

        // test data
        let testData = new alvision.Mat (pointsCount, 2, alvision.MatrixType. CV_64FC1), testLabels;
        generateData(testData, testLabels, sizes, means, covs, alvision.MatrixType.CV_64FC1, alvision.MatrixType.CV_32SC1);

        let params = new EM_Params();
        params.nclusters = 3;
        let probs = new alvision.Mat (trainData.rows(), params.nclusters, alvision.MatrixType. CV_64FC1, new alvision.Scalar(1));
        params.probs = probs;
        let weights = new alvision.Mat (1, params.nclusters, alvision.MatrixType.CV_64FC1, new alvision.Scalar(1));
        params.weights = weights;
        params.means = means;
        params.covs = covs;

        let code: alvision.cvtest.FailureCode  | alvision.int = alvision.cvtest.FailureCode.OK;
        let caseIndex = 0;
        {
            params.startStep = alvision.ml.EMStartStep.START_AUTO_STEP;
            params.covMatType =  alvision.ml.EMTypes.COV_MAT_GENERIC;
            let currCode = this.runCase(caseIndex++, params, trainData, trainLabels, testData, testLabels, sizes);
            code = currCode == alvision.cvtest.FailureCode.OK ? code : currCode;
        }
        {
            params.startStep = alvision.ml.EMStartStep.START_AUTO_STEP;
            params.covMatType =  alvision.ml.EMTypes.COV_MAT_DIAGONAL;
            let currCode = this.runCase(caseIndex++, params, trainData, trainLabels, testData, testLabels, sizes);
            code = currCode == alvision.cvtest.FailureCode.OK ? code : currCode;
        }
        {
            params.startStep = alvision.ml.EMStartStep.START_AUTO_STEP;
            params.covMatType =  alvision.ml.EMTypes.COV_MAT_SPHERICAL;
            let currCode = this.runCase(caseIndex++, params, trainData, trainLabels, testData, testLabels, sizes);
            code = currCode == alvision.cvtest.FailureCode.OK ? code : currCode;
        }
        {
            params.startStep =  alvision.ml.EMStartStep.START_M_STEP;
            params.covMatType = alvision.ml.EMTypes.COV_MAT_GENERIC;
            let currCode = this.runCase(caseIndex++, params, trainData, trainLabels, testData, testLabels, sizes);
            code = currCode == alvision.cvtest.FailureCode.OK ? code : currCode;
        }
        {
            params.startStep = alvision.ml.EMStartStep.START_M_STEP;
            params.covMatType = alvision.ml.EMTypes.COV_MAT_DIAGONAL;
            let currCode = this.runCase(caseIndex++, params, trainData, trainLabels, testData, testLabels, sizes);
            code = currCode == alvision.cvtest.FailureCode.OK ? code : currCode;
        }
        {
            params.startStep = alvision.ml.EMStartStep.START_M_STEP;
            params.covMatType = alvision.ml.EMTypes.COV_MAT_SPHERICAL;
            let currCode = this.runCase(caseIndex++, params, trainData, trainLabels, testData, testLabels, sizes);
            code = currCode == alvision.cvtest.FailureCode.OK ? code : currCode;
        }
        {
            params.startStep =  alvision.ml.EMStartStep.START_E_STEP;
            params.covMatType = alvision.ml.EMTypes.COV_MAT_GENERIC;
            let currCode = this.runCase(caseIndex++, params, trainData, trainLabels, testData, testLabels, sizes);
            code = currCode == alvision.cvtest.FailureCode.OK ? code : currCode;
        }
        {
            params.startStep = alvision.ml.EMStartStep.START_E_STEP;
            params.covMatType = alvision.ml.EMTypes.COV_MAT_DIAGONAL;
            let currCode = this.runCase(caseIndex++, params, trainData, trainLabels, testData, testLabels, sizes);
            code = currCode == alvision.cvtest.FailureCode.OK ? code : currCode;
        }
        {
            params.startStep = alvision.ml.EMStartStep.START_E_STEP;
            params.covMatType = alvision.ml.EMTypes.COV_MAT_SPHERICAL;
            let currCode = this.runCase(caseIndex++, params, trainData, trainLabels, testData, testLabels, sizes);
            code = currCode == alvision.cvtest.FailureCode.OK ? code : currCode;
        }

        this.ts.set_failed_test_info(code);
    }

    runCase(caseIndex: alvision.int, params: EM_Params,
        trainData: alvision.Mat, trainLabels: alvision.Mat,
        testData: alvision.Mat, testLabels: alvision.Mat,
        sizes: Array<alvision.int>): alvision.int {
        let code = alvision.cvtest.FailureCode.OK;

        let labels = new alvision.Mat();
        let err: alvision.float;

        let em = alvision.ml.EM.create();
        em.setClustersNumber(params.nclusters);
        em.setCovarianceMatrixType(params.covMatType);
        em.setTermCriteria(params.termCrit);
        if (params.startStep == alvision.ml.EMStartStep.START_AUTO_STEP)
            em.trainEM(trainData, null, labels, null);
        else if (params.startStep == alvision.ml.EMStartStep.START_E_STEP)
            em.trainE(trainData, params.means, params.covs,
                params.weights, null, labels, null);
        else if (params.startStep == alvision.ml.EMStartStep.START_M_STEP)
            em.trainM(trainData, params.probs,
                null, labels, null);

        // check train error
        if (!calcErr(labels, trainLabels, sizes, (err_) => { err = err_; }, false, false)) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Case index %i : Bad output labels.\n", caseIndex);
            code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
        }
        else if (err > 0.008) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Case index %i : Bad accuracy (%f) on train data.\n", caseIndex, err);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
        }

        // check test error
        labels.create(testData.rows(), 1, alvision.MatrixType.CV_32SC1);
        for (let i = 0; i < testData.rows(); i++) {
            let sample = testData.row(i);
            let probs = new alvision.Mat();
            labels.at<alvision.int>("int", i).set((em.predict2(sample, probs)[1]));
        }
        if (!calcErr(labels, testLabels, sizes, (err_) => { err = err_; }, false, false)) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Case index %i : Bad output labels.\n", caseIndex);
            code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
        }
        else if (err > 0.008) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Case index %i : Bad accuracy (%f) on test data.\n", caseIndex, err);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
        }

        return code;
    }
};


class CV_EMTest_SaveLoad  extends alvision.cvtest.BaseTest {
    run(start_from: alvision.int  ) : void
    {
        var code = alvision.cvtest.FailureCode.OK;
        const nclusters = 2;

        let samples = new alvision.Mat(3,1,alvision.MatrixType.CV_64FC1);
        samples.at<alvision.double>("double",0,0).set( 1);
        samples.at<alvision.double>("double",1,0).set( 2);
        samples.at<alvision.double>("double",2,0).set( 3);

        let labels = new alvision.Mat();

        let em =alvision.ml.EM.create();
        em.setClustersNumber(nclusters);
        em.trainEM(samples, null, labels, null);

        let firstResult = new alvision.Mat(samples.rows(), 1, alvision.MatrixType.CV_32SC1);
        for (let i = 0; i < samples.rows(); i++)
            firstResult.at<alvision.int>("int", i).set((em.predict2(samples.row(i), null)[1]));

        // Write out
        let filename = alvision.tempfile(".xml");
        {
            let fs = new alvision.FileStorage(filename, alvision.FileStorageMode.WRITE);
            try
            {
                fs.writeScalar("em");
                fs.writeScalar("{");
                //fs << "em" << "{";

                em.write(fs);
                //fs << "}";
                fs.writeScalar("}");
            }
            catch(e)
            {
                this.ts.printf( alvision.cvtest.TSConstants.LOG, "Crash in write method.\n" );
                this.ts.set_failed_test_info(  alvision.cvtest.FailureCode.FAIL_EXCEPTION );
            }
        }

        em = null;

        // Read in
        try
        {
            em =  alvision.Algorithm.load<alvision.ml.EM>("EM", filename);
        }
        catch(e)
        {
            this.ts.printf( alvision.cvtest.TSConstants.LOG, "Crash in read method.\n" );
            this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_EXCEPTION );
        }

        alvision.remove( filename );

        let errCaseCount = 0;
        for( let i = 0; i < samples.rows(); i++)
            errCaseCount = Math.abs(em.predict2(samples.row(i), null)[1] - firstResult.at<alvision.int>("int",i).get().valueOf()) < alvision.FLT_EPSILON ? 0 : 1;

        if( errCaseCount > 0 )
        {
            this.ts.printf( alvision.cvtest.TSConstants.LOG, "Different prediction results before writeing and after reading (errCaseCount=%d).\n", errCaseCount );
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
        }

        this.ts.set_failed_test_info( code );
    }
};

class CV_EMTest_Classification  extends alvision.cvtest.BaseTest
{

run(iii: alvision.int): void
    {
        // This test classifies spam by the following way:
        // 1. estimates distributions of "spam" / "not spam"
        // 2. predict classID using Bayes classifier for estimated distributions.

        let dataFilename = this.ts.get_data_path() + "spambase.data";
        let data = alvision.ml.TrainData.loadFromCSV(dataFilename, 0);

        if (data == null)//.empty() )
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "File with spambase dataset cann't be read.\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
        }

        let samples = data.getSamples();
        alvision.CV_Assert(()=>samples.cols() == 57);
        let responses = data.getResponses();

        let trainSamplesMask = new Array<alvision.int> (samples.rows(), 0);
        let trainSamplesCount = (0.5 * samples.rows().valueOf());
        for(let i = 0; i < trainSamplesCount; i++)
            trainSamplesMask[i] = 1;
        let rng = new alvision.RNG (0);
        for(let i = 0; i < trainSamplesMask.length; i++)
        {
            let i1 = rng.unsigned((trainSamplesMask.length));
            let i2 = rng.unsigned((trainSamplesMask.length));
            let t = trainSamplesMask[i1.valueOf()]; trainSamplesMask[i1.valueOf()] = trainSamplesMask[i2.valueOf()]; trainSamplesMask[i2.valueOf()] = t;
            //std::swap(, trainSamplesMask[i2]);
        }

        let samples0 = new alvision.Mat(), samples1 = new alvision.Mat();
        for(let i = 0; i < samples.rows(); i++)
        {
            if(trainSamplesMask[i])
            {
                let sample = samples.row(i);
                let resp = responses.at<alvision.float>("float", i).get();
                if(resp == 0)
                    samples0.push(sample);
                else
                    samples1.push(sample);
            }
        }
        let model0 = alvision.ml.EM.create();
        model0.setClustersNumber(3);
        model0.trainEM(samples0, null, null, null);

        let model1 = alvision.ml.EM.create();
        model1.setClustersNumber(3);
        model1.trainEM(samples1, null, null, null);

        let trainConfusionMat = new alvision.Mat (2, 2, alvision.MatrixType.CV_32SC1, new alvision.Scalar(0)),
            testConfusionMat = new alvision.Mat(2, 2, alvision.MatrixType.CV_32SC1,  new alvision.Scalar(0));
        const lambda = 1.;
        for(let i = 0; i < samples.rows(); i++)
        {
            let sample = samples.row(i);
            let sampleLogLikelihoods0 = model0.predict2(sample, null)[0];
            let sampleLogLikelihoods1 = model1.predict2(sample, null)[0];

            let classID = sampleLogLikelihoods0 >= lambda * sampleLogLikelihoods1 ? 0 : 1;

            if (trainSamplesMask[i]) {
                let tc = trainConfusionMat.at<alvision.int>("int", responses.at<alvision.float>("float", i).get(), classID);
                tc.set(tc.get().valueOf() + 1);
            }
            else {
                let tc = testConfusionMat.at<alvision.int>("int", responses.at<alvision.float>("float", i).get(), classID);
                tc.set(tc.get().valueOf() + 1);
            }
        }
//        console.log(trainConfusionMat << std::endl;
//        console.log(testConfusionMat << std::endl;

        let trainError = (trainConfusionMat.at<alvision.int>("int", 1,0).get().valueOf() + trainConfusionMat.at<alvision.int>("int", 0,1).get().valueOf()) / trainSamplesCount;
        let testError = (testConfusionMat.at<alvision.int>("int", 1,0).get().valueOf() + testConfusionMat.at<alvision.int>("int", 0,1).get().valueOf()) / (samples.rows().valueOf() - trainSamplesCount);
        const  maxTrainError = 0.23;
        const  maxTestError = 0.26;

        let code = alvision.cvtest.FailureCode.OK;
        if(trainError > maxTrainError)
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Too large train classification error (calc = %f, valid=%f).\n", trainError, maxTrainError);
            code = alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
        }
        if(testError > maxTestError)
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Too large test classification error (calc = %f, valid=%f).\n", testError, maxTestError);
            code = alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
        }

        this.ts.set_failed_test_info(code);
    }
};

alvision.cvtest.TEST('ML_KMeans', 'accuracy', () => { let test = new CV_KMeansTest(); test.safe_run(); });
alvision.cvtest.TEST('ML_KNearest', 'accuracy', () => { let test = new CV_KNearestTest(); test.safe_run(); });
alvision.cvtest.TEST('ML_EM', 'accuracy', () => { let test = new CV_EMTest(); test.safe_run(); });
alvision.cvtest.TEST('ML_EM', 'save_load', () => { let test = new CV_EMTest_SaveLoad(); test.safe_run(); });
alvision.cvtest.TEST('ML_EM', 'classification', () => { let test = new CV_EMTest_Classification(); test.safe_run(); });
