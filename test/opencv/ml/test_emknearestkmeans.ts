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
import colors = require("colors");
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
    var m0 = alvision.Mat(1, 2,alvision.MatrixType. CV_32FC1, mp0), c0 = new alvision.Mat(2, 2, alvision.MatrixType.CV_32FC1, cp0);
    var m1 = alvision.Mat(1, 2,alvision.MatrixType. CV_32FC1, mp1), c1 = new alvision.Mat(2, 2, alvision.MatrixType.CV_32FC1, cp1);
    var m2 = alvision.Mat(1, 2,alvision.MatrixType. CV_32FC1, mp2), c2 = new alvision.Mat(2, 2, alvision.MatrixType.CV_32FC1, cp2);
    means.resize(3), covs.resize(3);

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
    Array<int>::const_iterator sit = sizes.begin();
    int total = 0;
    for (; sit != sizes.end(); ++sit)
        total += *sit;
    alvision.CV_Assert(_means.rows == (int)sizes.size() && covs.size() == sizes.size());
    alvision.CV_Assert(!data.empty() && data.rows == total);
    alvision.CV_Assert(data.type() == dataType);

    labels.create(data.rows, 1, labelType);

    alvision, randn(data, alvision.Scalar.all(-1.0), alvision.Scalar.all(1.0));
    var means = new Array<alvision.Mat>(sizes.size());
    for (var i = 0; i < _means.rows; i++)
        means[i] = _means.row(i);
    Array<Mat>::const_iterator mit = means.begin(), cit = covs.begin();
    int bi, ei = 0;
    sit = sizes.begin();
    for (int p = 0, l = 0; sit != sizes.end(); ++sit, ++mit, ++cit, l++ )
    {
        bi = ei;
        ei = bi + *sit;
        assert(mit.rows == 1 && mit.cols == data.cols);
        assert(cit.rows == data.cols && cit.cols == data.cols);
        for (int i = bi; i < ei; i++ , p++ )
        {
            Mat r = data.row(i);
            r = r * (*cit) + *mit;
            if (labelType == CV_32FC1)
                labels.at<float>(p, 0) = (float)l;
            else if (labelType == CV_32SC1)
                labels.at<int>(p, 0) = l;
            else {
                CV_DbgAssert(0);
            }
        }
    }
}

function maxIdx(count: Array<alvision.int> ) : alvision.int   
{
    var idx = -1;
    var maxVal = -1;
    Array<int>::const_iterator it = count.begin();
    for( var i = 0; it != count.end(); ++it, i++ )
    {
        if( *it > maxVal)
        {
            maxVal = *it;
            idx = i;
        }
    }
    assert( idx >= 0);
    return idx;
}

function getLabelsMap(labels: alvision.Mat, sizes: Array<alvision.int>, labelsMap: Array<alvision.int> , checkClusterUniq : boolean=true ) : boolean
{
    var total = 0, nclusters = sizes.length;
    for(var i = 0; i < sizes.length; i++)
        total += sizes[i];

    alvision.assert( !labels.empty() );
    alvision.assert( labels.total() == total && (labels.cols == 1 || labels.rows == 1));
    alvision.assert(labels.type() == alvision.MatrixType.CV_32SC1 || labels.type() == alvision.MatrixType.CV_32FC1 );

    var isFlt = labels.type() == alvision.MatrixType.CV_32FC1;

    labelsMap.resize(nclusters);

    Array<bool> buzy(nclusters, false);
    var startIndex = 0;
    for( var clusterIndex = 0; clusterIndex < sizes.length; clusterIndex++ )
    {
        Array<int> count( nclusters, 0 );
        for( var i = startIndex; i < startIndex + sizes[clusterIndex]; i++)
        {
            int lbl = isFlt ? (int)labels.at<float>(i) : labels.at<int>(i);
            alvision.CV_Assert(()=>lbl < (int)nclusters);
            count[lbl]++;
            alvision.CV_Assert(()=>count[lbl] < (int)total);
        }
        startIndex += sizes[clusterIndex];

        var cls = maxIdx( count );
        alvision.CV_Assert( !checkClusterUniq || !buzy[cls] );

        labelsMap[clusterIndex] = cls;

        buzy[cls] = true;
    }

    if(checkClusterUniq)
    {
        for(var i = 0; i < buzy.size(); i++)
            if(!buzy[i])
                return false;
    }

    return true;
}


function calcErr(labels: alvision.Mat, origLabels: alvision.Mat, sizes: Array<alvision.int>, err: alvision.float ,  labelsEquivalent  : boolean= true,checkClusterUniq : boolean =true ) : boolean
{
    err = 0;
    alvision.CV_Assert(()=> !labels.empty() && !origLabels.empty() );
    alvision.CV_Assert(()=> labels.rows == 1 || labels.cols == 1 );
    alvision.CV_Assert(()=> origLabels.rows == 1 || origLabels.cols == 1 );
    alvision.CV_Assert(()=> labels.total() == origLabels.total() );
    alvision.CV_Assert(()=> labels.type() == CV_32SC1 || labels.type() == CV_32FC1 );
    alvision.CV_Assert(()=> origLabels.type() == labels.type() );

    Array<int> labelsMap;
    var isFlt = labels.type() == CV_32FC1;
    if( !labelsEquivalent )
    {
        if( !getLabelsMap( labels, sizes, labelsMap, checkClusterUniq ) )
            return false;

        for( var i = 0; i < labels.rows; i++ )
            if( isFlt )
                err += labels.at<float>(i) != labelsMap[(int)origLabels.at<float>(i)] ? 1.f : 0.f;
            else
                err += labels.at<int>(i) != labelsMap[origLabels.at<int>(i)] ? 1.f : 0.f;
    }
    else
    {
        for( var i = 0; i < labels.rows; i++ )
            if( isFlt )
                err += labels.at<float>(i) != origLabels.at<float>(i) ? 1.f : 0.f;
            else
                err += labels.at<int>(i) != origLabels.at<int>(i) ? 1.f : 0.f;
    }
    err /= (float)labels.rows;
    return true;
}

//--------------------------------------------------------------------------------------------
class CV_KMeansTest  extends alvision.cvtest.BaseTest {
    run(start_from: alvision.int): void {
        const  iters = 100;
        var sizesArr = [5000, 7000, 8000];
        var pointsCount = sizesArr[0] + sizesArr[1] + sizesArr[2];

        var data = new alvision.Mat (pointsCount, 2, CV_32FC1), labels;
        Array < int > sizes(sizesArr, sizesArr + sizeof(sizesArr) / sizeof(sizesArr[0]));
        Mat means;
        Array < Mat > covs;
        defaultDistribs(means, covs);
        generateData(data, labels, sizes, means, covs, CV_32FC1, CV_32SC1);

        var code = alvision.cvtest.FailureCode.OK;
        float err;
        Mat bestLabels;
        // 1. flag==KMEANS_PP_CENTERS
        alvision.kmeans(data, 3, bestLabels, TermCriteria(TermCriteria::COUNT, iters, 0.0), 0, KMEANS_PP_CENTERS, noArray());
        if (!calcErr(bestLabels, labels, sizes, err, false)) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Bad output labels if flag==KMEANS_PP_CENTERS.\n");
            code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
        }
        else if (err > 0.01f )
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Bad accuracy (%f) if flag==KMEANS_PP_CENTERS.\n", err);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
        }

        // 2. flag==KMEANS_RANDOM_CENTERS
        alvision.kmeans(data, 3, bestLabels, TermCriteria(TermCriteria::COUNT, iters, 0.0), 0, KMEANS_RANDOM_CENTERS, noArray());
        if (!calcErr(bestLabels, labels, sizes, err, false)) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Bad output labels if flag==KMEANS_RANDOM_CENTERS.\n");
            code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
        }
        else if (err > 0.01f )
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Bad accuracy (%f) if flag==KMEANS_RANDOM_CENTERS.\n", err);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
        }

        // 3. flag==KMEANS_USE_INITIAL_LABELS
        labels.copyTo(bestLabels);
        var rng = new alvision.RNG();
        for (var i = 0; i < 0.5f * pointsCount; i++ )
        bestLabels.at<int>(rng.next() % pointsCount, 0) = rng.next() % 3;
        alvision.kmeans(data, 3, bestLabels, TermCriteria(TermCriteria::COUNT, iters, 0.0), 0, KMEANS_USE_INITIAL_LABELS, noArray());
        if (!calcErr(bestLabels, labels, sizes, err, false)) {
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
        int sizesArr[] = { 500, 700, 800 };
        int pointsCount = sizesArr[0] + sizesArr[1] + sizesArr[2];

        // train data
        Mat trainData(pointsCount, 2, CV_32FC1), trainLabels;
        Array < int > sizes(sizesArr, sizesArr + sizeof(sizesArr) / sizeof(sizesArr[0]));
        Mat means;
        Array < Mat > covs;
        defaultDistribs(means, covs);
        generateData(trainData, trainLabels, sizes, means, covs, CV_32FC1, CV_32FC1);

        // test data
        Mat testData(pointsCount, 2, CV_32FC1), testLabels, bestLabels;
        generateData(testData, testLabels, sizes, means, covs, CV_32FC1, CV_32FC1);

        int code = alvision.cvtest.FailureCode.OK;

        // KNearest default implementation
        Ptr < KNearest > knearest = KNearest::create();
        knearest.train(trainData, ml::ROW_SAMPLE, trainLabels);
        knearest.findNearest(testData, 4, bestLabels);
        float err;
        if (!calcErr(bestLabels, testLabels, sizes, err, true)) {
            ts.printf(alvision.cvtest.TSConstants.LOG, "Bad output labels.\n");
            code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
        }
        else if (err > 0.01f )
        {
            ts.printf(alvision.cvtest.TSConstants.LOG, "Bad accuracy (%f) on test data.\n", err);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
        }

        // KNearest KDTree implementation
        Ptr < KNearest > knearestKdt = KNearest::create();
        knearestKdt.setAlgorithmType(KNearest::KDTREE);
        knearestKdt.train(trainData, ml::ROW_SAMPLE, trainLabels);
        knearestKdt.findNearest(testData, 4, bestLabels);
        if (!calcErr(bestLabels, testLabels, sizes, err, true)) {
            ts.printf(alvision.cvtest.TSConstants.LOG, "Bad output labels.\n");
            code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
        }
        else if (err > 0.01f )
        {
            ts.printf(alvision.cvtest.TSConstants.LOG, "Bad accuracy (%f) on test data.\n", err);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
        }

        this.ts.set_failed_test_info(code);
    }
};



class EM_Params
{
    constructor(int _nclusters=10, int _covMatType=EM::COV_MAT_DIAGONAL, int _startStep=EM::START_AUTO_STEP,
           const alvision.TermCriteria& _termCrit=alvision.TermCriteria(alvision.TermCriteria::COUNT+alvision.TermCriteria::EPS, 100, FLT_EPSILON),
           const alvision.Mat* _probs=0, const alvision.Mat* _weights=0,
           const alvision.Mat* _means=0, const Array<alvision.Mat>* _covs=0)
        : nclusters(_nclusters), covMatType(_covMatType), startStep(_startStep),
        probs(_probs), weights(_weights), means(_means), covs(_covs), termCrit(_termCrit)
    {}

        protected nclusters: alvision.int;
    protected  covMatType    : alvision.int;
    protected  startStep     : alvision.int;

    // all 4 following matrices should have type CV_32FC1
    const alvision.Mat* probs;
    const alvision.Mat* weights;
    const alvision.Mat* means;
    const Array<alvision.Mat>* covs;

    protected termCrit: alvision.TermCriteria;
};

//--------------------------------------------------------------------------------------------
class CV_EMTest  extends alvision.cvtest.BaseTest
{
    run(start_from: alvision.int): void {
        int sizesArr[] = { 500, 700, 800 };
        int pointsCount = sizesArr[0] + sizesArr[1] + sizesArr[2];

        // Points distribution
        Mat means;
        Array < Mat > covs;
        defaultDistribs(means, covs, CV_64FC1);

        // train data
        Mat trainData(pointsCount, 2, CV_64FC1), trainLabels;
        Array < int > sizes(sizesArr, sizesArr + sizeof(sizesArr) / sizeof(sizesArr[0]));
        generateData(trainData, trainLabels, sizes, means, covs, CV_64FC1, CV_32SC1);

        // test data
        Mat testData(pointsCount, 2, CV_64FC1), testLabels;
        generateData(testData, testLabels, sizes, means, covs, CV_64FC1, CV_32SC1);

        EM_Params params;
        params.nclusters = 3;
        Mat probs(trainData.rows, params.nclusters, CV_64FC1, alvision.Scalar(1));
        params.probs = &probs;
        Mat weights(1, params.nclusters, CV_64FC1, alvision.Scalar(1));
        params.weights = &weights;
        params.means = &means;
        params.covs = &covs;

        int code = alvision.cvtest.FailureCode.OK;
        int caseIndex = 0;
        {
            params.startStep = EM::START_AUTO_STEP;
            params.covMatType = EM::COV_MAT_GENERIC;
            int currCode = runCase(caseIndex++, params, trainData, trainLabels, testData, testLabels, sizes);
            code = currCode == alvision.cvtest.FailureCode.OK ? code : currCode;
        }
        {
            params.startStep = EM::START_AUTO_STEP;
            params.covMatType = EM::COV_MAT_DIAGONAL;
            int currCode = runCase(caseIndex++, params, trainData, trainLabels, testData, testLabels, sizes);
            code = currCode == alvision.cvtest.FailureCode.OK ? code : currCode;
        }
        {
            params.startStep = EM::START_AUTO_STEP;
            params.covMatType = EM::COV_MAT_SPHERICAL;
            int currCode = runCase(caseIndex++, params, trainData, trainLabels, testData, testLabels, sizes);
            code = currCode == alvision.cvtest.FailureCode.OK ? code : currCode;
        }
        {
            params.startStep = EM::START_M_STEP;
            params.covMatType = EM::COV_MAT_GENERIC;
            int currCode = runCase(caseIndex++, params, trainData, trainLabels, testData, testLabels, sizes);
            code = currCode == alvision.cvtest.FailureCode.OK ? code : currCode;
        }
        {
            params.startStep = EM::START_M_STEP;
            params.covMatType = EM::COV_MAT_DIAGONAL;
            int currCode = runCase(caseIndex++, params, trainData, trainLabels, testData, testLabels, sizes);
            code = currCode == alvision.cvtest.FailureCode.OK ? code : currCode;
        }
        {
            params.startStep = EM::START_M_STEP;
            params.covMatType = EM::COV_MAT_SPHERICAL;
            int currCode = runCase(caseIndex++, params, trainData, trainLabels, testData, testLabels, sizes);
            code = currCode == alvision.cvtest.FailureCode.OK ? code : currCode;
        }
        {
            params.startStep = EM::START_E_STEP;
            params.covMatType = EM::COV_MAT_GENERIC;
            int currCode = runCase(caseIndex++, params, trainData, trainLabels, testData, testLabels, sizes);
            code = currCode == alvision.cvtest.FailureCode.OK ? code : currCode;
        }
        {
            params.startStep = EM::START_E_STEP;
            params.covMatType = EM::COV_MAT_DIAGONAL;
            int currCode = runCase(caseIndex++, params, trainData, trainLabels, testData, testLabels, sizes);
            code = currCode == alvision.cvtest.FailureCode.OK ? code : currCode;
        }
        {
            params.startStep = EM::START_E_STEP;
            params.covMatType = EM::COV_MAT_SPHERICAL;
            int currCode = runCase(caseIndex++, params, trainData, trainLabels, testData, testLabels, sizes);
            code = currCode == alvision.cvtest.FailureCode.OK ? code : currCode;
        }

        this.ts.set_failed_test_info(code);
    }

    runCase(int caseIndex, const EM_Params& params,
                  const alvision.Mat & trainData, const alvision.Mat & trainLabels,
                  const alvision.Mat & testData, const alvision.Mat & testLabels,
                  const Array<int>& sizes) : alvision.int{
                      int code = alvision.cvtest.FailureCode.OK;

                      alvision.Mat labels;
                      float err;

                      Ptr<EM>em = EM::create();
                      em.setClustersNumber(params.nclusters);
                      em.setCovarianceMatrixType(params.covMatType);
                      em.setTermCriteria(params.termCrit);
                      if( params.startStep == EM::START_AUTO_STEP )
    em.trainEM(trainData, noArray(), labels, noArray() );
    else if(params.startStep == EM::START_E_STEP)
    em.trainE(trainData, *params.means, *params.covs,
    *params.weights, noArray(), labels, noArray() );
    else if(params.startStep == EM::START_M_STEP)
    em.trainM(trainData, *params.probs,
    noArray(), labels, noArray() );

    // check train error
    if( !calcErr(labels, trainLabels, sizes, err, false, false) )
{
    ts.printf(alvision.cvtest.TSConstants.LOG, "Case index %i : Bad output labels.\n", caseIndex);
    code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
}
    else if (err > 0.008f )
{
    ts.printf(alvision.cvtest.TSConstants.LOG, "Case index %i : Bad accuracy (%f) on train data.\n", caseIndex, err);
    code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
}

// check test error
labels.create(testData.rows, 1, CV_32SC1);
for (int i = 0; i < testData.rows; i++ )
{
    Mat sample = testData.row(i);
    Mat probs;
    labels.at<int>(i) = static_cast<int>(em.predict2(sample, probs)[1]);
}
if (!calcErr(labels, testLabels, sizes, err, false, false)) {
    ts.printf(alvision.cvtest.TSConstants.LOG, "Case index %i : Bad output labels.\n", caseIndex);
    code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
}
else if (err > 0.008f )
{
    ts.printf(alvision.cvtest.TSConstants.LOG, "Case index %i : Bad accuracy (%f) on test data.\n", caseIndex, err);
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

        Mat samples = Mat(3,1,CV_64FC1);
        samples.at<double>(0,0) = 1;
        samples.at<double>(1,0) = 2;
        samples.at<double>(2,0) = 3;

        Mat labels;

        Ptr<EM> em = EM::create();
        em.setClustersNumber(nclusters);
        em.trainEM(samples, noArray(), labels, noArray());

        Mat firstResult(samples.rows, 1, CV_32SC1);
        for( int i = 0; i < samples.rows; i++)
            firstResult.at<int>(i) = static_cast<int>(em.predict2(samples.row(i), noArray())[1]);

        // Write out
        string filename = alvision.tempfile(".xml");
        {
            FileStorage fs = FileStorage(filename, FileStorage::WRITE);
            try
            {
                fs << "em" << "{";
                em.write(fs);
                fs << "}";
            }
            catch(e)
            {
                ts.printf( alvision.cvtest.TSConstants.LOG, "Crash in write method.\n" );
                this.ts.set_failed_test_info( alvision.cvtest.TS::FAIL_EXCEPTION );
            }
        }

        em.release();

        // Read in
        try
        {
            em = Algorithm::load<EM>(filename);
        }
        catch(e)
        {
            ts.printf( alvision.cvtest.TSConstants.LOG, "Crash in read method.\n" );
            this.ts.set_failed_test_info( alvision.cvtest.TS::FAIL_EXCEPTION );
        }

        remove( filename );

        int errCaseCount = 0;
        for( int i = 0; i < samples.rows; i++)
            errCaseCount = std::abs(em.predict2(samples.row(i), noArray())[1] - firstResult.at<int>(i)) < FLT_EPSILON ? 0 : 1;

        if( errCaseCount > 0 )
        {
            ts.printf( alvision.cvtest.TSConstants.LOG, "Different prediction results before writeing and after reading (errCaseCount=%d).\n", errCaseCount );
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
        }

        this.ts.set_failed_test_info( code );
    }
};

class CV_EMTest_Classification  extends alvision.cvtest.BaseTest
{
public:
    CV_EMTest_Classification() {}
protected:
    virtual void run(int)
    {
        // This test classifies spam by the following way:
        // 1. estimates distributions of "spam" / "not spam"
        // 2. predict classID using Bayes classifier for estimated distributions.

        string dataFilename = this.ts.get_data_path() + "spambase.data";
        Ptr<TrainData> data = TrainData::loadFromCSV(dataFilename, 0);

        if( data.empty() )
        {
            ts.printf(alvision.cvtest.TSConstants.LOG, "File with spambase dataset cann't be read.\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
        }

        Mat samples = data.getSamples();
        CV_Assert(samples.cols == 57);
        Mat responses = data.getResponses();

        Array<int> trainSamplesMask(samples.rows, 0);
        int trainSamplesCount = (int)(0.5f * samples.rows);
        for(int i = 0; i < trainSamplesCount; i++)
            trainSamplesMask[i] = 1;
        RNG rng(0);
        for(size_t i = 0; i < trainSamplesMask.size(); i++)
        {
            int i1 = rng(static_cast<unsigned>(trainSamplesMask.size()));
            int i2 = rng(static_cast<unsigned>(trainSamplesMask.size()));
            std::swap(trainSamplesMask[i1], trainSamplesMask[i2]);
        }

        Mat samples0, samples1;
        for(int i = 0; i < samples.rows; i++)
        {
            if(trainSamplesMask[i])
            {
                Mat sample = samples.row(i);
                int resp = (int)responses.at<float>(i);
                if(resp == 0)
                    samples0.push(sample);
                else
                    samples1.push(sample);
            }
        }
        Ptr<EM> model0 = EM::create();
        model0.setClustersNumber(3);
        model0.trainEM(samples0, noArray(), noArray(), noArray());

        Ptr<EM> model1 = EM::create();
        model1.setClustersNumber(3);
        model1.trainEM(samples1, noArray(), noArray(), noArray());

        Mat trainConfusionMat(2, 2, CV_32SC1, Scalar(0)),
            testConfusionMat(2, 2, CV_32SC1, Scalar(0));
        const double lambda = 1.;
        for(int i = 0; i < samples.rows; i++)
        {
            Mat sample = samples.row(i);
            double sampleLogLikelihoods0 = model0.predict2(sample, noArray())[0];
            double sampleLogLikelihoods1 = model1.predict2(sample, noArray())[0];

            int classID = sampleLogLikelihoods0 >= lambda * sampleLogLikelihoods1 ? 0 : 1;

            if(trainSamplesMask[i])
                trainConfusionMat.at<int>((int)responses.at<float>(i), classID)++;
            else
                testConfusionMat.at<int>((int)responses.at<float>(i), classID)++;
        }
//        std::cout << trainConfusionMat << std::endl;
//        std::cout << testConfusionMat << std::endl;

        double trainError = (double)(trainConfusionMat.at<int>(1,0) + trainConfusionMat.at<int>(0,1)) / trainSamplesCount;
        double testError = (double)(testConfusionMat.at<int>(1,0) + testConfusionMat.at<int>(0,1)) / (samples.rows - trainSamplesCount);
        const double maxTrainError = 0.23;
        const double maxTestError = 0.26;

        int code = alvision.cvtest.FailureCode.OK;
        if(trainError > maxTrainError)
        {
            ts.printf(alvision.cvtest.TSConstants.LOG, "Too large train classification error (calc = %f, valid=%f).\n", trainError, maxTrainError);
            code = alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
        }
        if(testError > maxTestError)
        {
            ts.printf(alvision.cvtest.TSConstants.LOG, "Too large test classification error (calc = %f, valid=%f).\n", testError, maxTestError);
            code = alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
        }

        this.ts.set_failed_test_info(code);
    }
};

TEST(ML_KMeans, accuracy) { CV_KMeansTest test; test.safe_run(); }
TEST(ML_KNearest, accuracy) { CV_KNearestTest test; test.safe_run(); }
TEST(ML_EM, accuracy) { CV_EMTest test; test.safe_run(); }
TEST(ML_EM, save_load) { CV_EMTest_SaveLoad test; test.safe_run(); }
TEST(ML_EM, classification) { CV_EMTest_Classification test; test.safe_run(); }
