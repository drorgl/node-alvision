/*M///////////////////////////////////////////////////////////////////////////////////////
//
//  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
//
//  By downloading, copying, installing or using the software you agree to this license.
//  If you do not agree to this license, do not download, install,
//  copy or use the software.
//
//
//                           License Agreement
//                For Open Source Computer Vision Library
//
// Copyright (C) 2000-2008, Intel Corporation, all rights reserved.
// Copyright (C) 2009, Willow Garage Inc., all rights reserved.
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
//   * The name of the copyright holders may not be used to endorse or promote products
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
//#ifdef HAVE_CUDA
//
//using namespace cvtest;

/////////////////////////////////////////////////////////////////////////////////////////////////
// FAST

//namespace
//{
//    IMPLEMENT_PARAM_CLASS(FAST_Threshold, int)
//    IMPLEMENT_PARAM_CLASS(FAST_NonmaxSuppression, bool)
//}

//PARAM_TEST_CASE(FAST, alvision.cuda.DeviceInfo, FAST_Threshold, FAST_NonmaxSuppression)
class FAST extends  alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected threshold: alvision.int;
    protected nonmaxSuppression: boolean;

    SetUp() : void
    {
        this.devInfo =             this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.threshold =           this.GET_PARAM<alvision.int>(1);
        this.nonmaxSuppression =   this.GET_PARAM<boolean>(2);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(FAST, Accuracy)
class FAST_Accuracy extends FAST
{
    TestBody() {
        let image = alvision.readImage("features2d/aloe.png", alvision.ImreadModes.IMREAD_GRAYSCALE);
        alvision.ASSERT_FALSE(image.empty());

        let fast = alvision.cudafeatures2d.FastFeatureDetector.create(this.threshold, this.nonmaxSuppression);

        if (!alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.GLOBAL_ATOMICS)) {
            try {
                let keypoints = new Array<alvision.KeyPoint>();
                fast.detect(alvision.loadMat(image), (kp) => { keypoints = kp; });
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsNotImplemented, e.code);
            }
        }
        else {
            let keypoints = new Array<alvision.KeyPoint>();
            fast.detect(alvision.loadMat(image), (kp) => { keypoints = kp; });

            let keypoints_gold = new Array<alvision.KeyPoint>();
            alvision.FAST(image, (kp) => { keypoints_gold = kp; }, this.threshold, this.nonmaxSuppression);

            alvision.ASSERT_KEYPOINTS_EQ(keypoints_gold, keypoints);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Features2D', 'FAST', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    [25,50],
    [false,true]
    ]));

/////////////////////////////////////////////////////////////////////////////////////////////////
// ORB

//namespace
//{
//    IMPLEMENT_PARAM_CLASS(ORB_FeaturesCount, int)
//    IMPLEMENT_PARAM_CLASS(ORB_ScaleFactor, float)
//    IMPLEMENT_PARAM_CLASS(ORB_LevelsCount, int)
//    IMPLEMENT_PARAM_CLASS(ORB_EdgeThreshold, int)
//    IMPLEMENT_PARAM_CLASS(ORB_firstLevel, int)
//    IMPLEMENT_PARAM_CLASS(ORB_WTA_K, int)
//    IMPLEMENT_PARAM_CLASS(ORB_PatchSize, int)
//    IMPLEMENT_PARAM_CLASS(ORB_BlurForDescriptor, bool)
//}

//CV_ENUM(ORB_ScoreType, alvision.ORB::HARRIS_SCORE, alvision.ORB::FAST_SCORE)

//PARAM_TEST_CASE(ORB, alvision.cuda.DeviceInfo, ORB_FeaturesCount, ORB_ScaleFactor, ORB_LevelsCount, ORB_EdgeThreshold, ORB_firstLevel, ORB_WTA_K, ORB_ScoreType, ORB_PatchSize, ORB_BlurForDescriptor)
class ORB extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected nFeatures: alvision.int;
    protected scaleFactor: alvision.float;
    protected nLevels: alvision.int;
    protected edgeThreshold: alvision.int;
    protected firstLevel: alvision.int;
    protected WTA_K: alvision.int;
    protected scoreType: alvision.int;
    protected patchSize: alvision.int;
    protected blurForDescriptor: boolean;

    SetUp() : void
    {
        this.devInfo =           this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.nFeatures =         this.GET_PARAM<alvision.int>(1);
        this.scaleFactor =       this.GET_PARAM<alvision.float>(2);
        this.nLevels =           this.GET_PARAM<alvision.int>(3);
        this.edgeThreshold =     this.GET_PARAM<alvision.int>(4);
        this.firstLevel =        this.GET_PARAM<alvision.int>(5);
        this.WTA_K =             this.GET_PARAM<alvision.int>(6);
        this.scoreType =         this.GET_PARAM<alvision.int>(7);
        this.patchSize =         this.GET_PARAM<alvision.int>(8);
        this.blurForDescriptor = this.GET_PARAM<boolean>(9);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(ORB, Accuracy)
class ORB_Accuracy extends ORB
{
    TestBody() {
        let image = alvision.readImage("features2d/aloe.png", alvision.ImreadModes.IMREAD_GRAYSCALE);
        alvision.ASSERT_FALSE(image.empty());

        let mask = new alvision.Mat(image.size(), alvision.MatrixType.CV_8UC1, alvision.Scalar.all(1));
        mask.roi([new alvision.Range(0, image.rows().valueOf() / 2), new alvision.Range(0, image.cols().valueOf() / 2)]).setTo(alvision.Scalar.all(0));

        let orb =
            alvision.cudafeatures2d.ORB.create(this.nFeatures, this.scaleFactor, this.nLevels, this.edgeThreshold,this. firstLevel,
                this.WTA_K, this.scoreType, this.patchSize, 20,this. blurForDescriptor);

        if (!alvision.supportFeature(this.devInfo,alvision.cuda.FeatureSet.GLOBAL_ATOMICS)) {
            try {
                let keypoints = new Array<alvision.KeyPoint>();
                let descriptors = new alvision.cuda.GpuMat();
                orb.detectAndComputeAsync(alvision.loadMat(image), alvision.loadMat(mask), keypoints, descriptors);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsNotImplemented, e.code);
            }
        }
        else {
            let keypoints = new Array<alvision.KeyPoint>();
            let descriptors = new alvision.cuda.GpuMat ();
            orb.detectAndCompute(alvision.loadMat(image), alvision.loadMat(mask), (kp) => { keypoints = kp; }, descriptors);

            let orb_gold = alvision.ORB.create(this.nFeatures, this.scaleFactor, this.nLevels, this.edgeThreshold, this.firstLevel, this.WTA_K, this.scoreType, this.patchSize);

            let keypoints_gold = new Array<alvision.KeyPoint>();
            let descriptors_gold = new alvision.Mat();
            orb_gold.detectAndCompute(image, mask, (kp) => { keypoints_gold = kp; }, descriptors_gold);

            let matcher = new alvision.BFMatcher (alvision.NormTypes.NORM_HAMMING);
            let matches = new Array<alvision.DMatch>();
            matcher.match(descriptors_gold, new alvision.Mat(descriptors), (m) => { matches = m; });

            let matchedCount = alvision.cvtest.getMatchedPointsCount2(keypoints_gold, keypoints, matches);
            let matchedRatio = (matchedCount.valueOf()) / keypoints.length;

            alvision.EXPECT_GT(matchedRatio, 0.35);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Features2D', 'ORB', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    [1000],
    [1.2],
    [4,8],
    [31],
    [0],
    [2,3,4],
    [alvision.ORBEnum.HARRIS_SCORE],
    [31,29],
    [false,true]
    ]));

/////////////////////////////////////////////////////////////////////////////////////////////////
// BruteForceMatcher

//namespace
//{
//    IMPLEMENT_PARAM_CLASS(DescriptorSize, int)
//    IMPLEMENT_PARAM_CLASS(UseMask, bool)
//}

//PARAM_TEST_CASE(BruteForceMatcher, alvision.cuda.DeviceInfo, NormCode, DescriptorSize, UseMask)
class BruteForceMatcher extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo ;
    protected normCode : alvision.int;
    protected dim: alvision.int;
    protected useMask: boolean;

    protected queryDescCount: alvision.int;
    protected countFactor: alvision.int;

    protected query: alvision.Mat;
    protected train: alvision.Mat;

    SetUp() : void
    {
        this.devInfo =      this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.normCode =     this.GET_PARAM<alvision.int>(1);
        this.dim =          this.GET_PARAM<alvision.int>(2);
        this.useMask =      this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());

        this.queryDescCount = 300; // must be even number because we split train data in some cases in two
        this.countFactor = 4; // do not change it

        let rng = alvision.cvtest.TS.ptr().get_rng();

        let queryBuf = new alvision.Mat(), trainBuf = new alvision.Mat ();

        // Generate query descriptors randomly.
        // Descriptor vector elements are integer values.
        queryBuf.create(this.queryDescCount, this.dim, alvision.MatrixType.CV_32SC1);
        rng.fill(queryBuf, alvision.DistType.UNIFORM, alvision.Scalar.all(0), alvision.Scalar.all(3));
        queryBuf.convertTo(queryBuf, alvision.MatrixType.CV_32FC1);

        // Generate train decriptors as follows:
        // copy each query descriptor to train set countFactor times
        // and perturb some one element of the copied descriptors in
        // in ascending order. General boundaries of the perturbation
        // are (0.f, 1.f).
        trainBuf.create(this.queryDescCount.valueOf() * this.countFactor.valueOf(), this.dim, alvision.MatrixType.CV_32FC1);
        let step = 1. / this.countFactor.valueOf();
        for (let qIdx = 0; qIdx < this.queryDescCount; qIdx++)
        {
            let queryDescriptor = queryBuf.row(qIdx);
            for (let c = 0; c < this.countFactor; c++)
            {
                let tIdx = qIdx * this.countFactor.valueOf() + c;
                let trainDescriptor = trainBuf.row(tIdx);
                queryDescriptor.copyTo(trainDescriptor);
                let elem = rng.unsigned(this.dim);
                let diff = rng.uniform(step * c, step * (c + 1));
                trainDescriptor.at<alvision.float>("float", 0, elem).set(trainDescriptor.at<alvision.float>("float", 0, elem).get().valueOf() + diff.valueOf());
            }
        }

        queryBuf.convertTo(this.query, alvision.MatrixType.CV_32F);
        trainBuf.convertTo(this.train, alvision.MatrixType.CV_32F);
    }
};

//CUDA_TEST_P(BruteForceMatcher, Match_Single)
class BruteForceMatcher_Match_Single extends BruteForceMatcher
{
    TestBody() {
        let matcher =
        alvision.cudafeatures2d.DescriptorMatcher.createBFMatcher(this.normCode);

        let mask = new alvision.cuda.GpuMat();
        if (this.useMask) {
            mask.create(this.query.rows(), this.train.rows(), alvision.MatrixType.CV_8UC1);
            mask.setTo(alvision.Scalar.all(1));
        }

        let matches = new Array<alvision.DMatch>();
        matcher.match(alvision.loadMat(this.query), alvision.loadMat(this.train), matches, mask);

        alvision.ASSERT_EQ((this.queryDescCount), matches.length);

        let badCount = 0;
        for (let i = 0; i < matches.length; i++)
        {
            let match = matches[i];
            if ((match.queryIdx != i) || (match.trainIdx != i * this.countFactor.valueOf()) || (match.imgIdx != 0))
            badCount++;
        }

        alvision.ASSERT_EQ(0, badCount);
    }
}

//CUDA_TEST_P(BruteForceMatcher, Match_Collection)
class BruteForceMatcher_Match_Collection extends BruteForceMatcher
{
    TestBody(){
    let matcher =
            alvision.cudafeatures2d.DescriptorMatcher.createBFMatcher(this.normCode);

    let d_train = new alvision.cuda.GpuMat (this.train);

    // make add() twice to test such case
    matcher.add(alvision.NewArray<alvision.cuda.GpuMat>(1,()=> d_train.rowRange(0, this.train.rows().valueOf() / 2)));
    matcher.add(alvision.NewArray<alvision.cuda.GpuMat>(1,()=> d_train.rowRange(this.train.rows().valueOf() / 2, this.train.rows().valueOf())));

    // prepare masks (make first nearest match illegal)
    let masks = new Array<alvision.cuda.GpuMat> (2);
    for (let mi = 0; mi < 2; mi++)
    {
        masks[mi] = new alvision.cuda.GpuMat(this.query.rows(), this.train.rows().valueOf()/2,alvision.MatrixType. CV_8UC1, alvision.Scalar.all(1));
        for (let di = 0; di < this.queryDescCount.valueOf()/2; di++)
            masks[mi].col(di * this.countFactor.valueOf()).setTo(alvision.Scalar.all(0));
    }

    let matches = new Array<alvision.DMatch>();
    if (this.useMask)
        matcher.match(new alvision.cuda.GpuMat(this.query), matches, masks);
    else
        matcher.match(new alvision.cuda.GpuMat(this.query), matches);

    alvision.ASSERT_EQ((this.queryDescCount), matches.length);

    let badCount = 0;
    let shift = this.useMask ? 1 : 0;
    for (let i = 0; i < matches.length; i++)
    {
        let match = matches[i];

        if (i < this.queryDescCount.valueOf() / 2)
        {
            let validQueryIdx = (match.queryIdx == i);
            let validTrainIdx = (match.trainIdx == i * this.countFactor.valueOf() + shift);
            let validImgIdx = (match.imgIdx == 0);
            if (!validQueryIdx || !validTrainIdx || !validImgIdx)
                badCount++;
        }
        else
        {
            let validQueryIdx = (match.queryIdx == i);
            let validTrainIdx = (match.trainIdx == (i - this.queryDescCount.valueOf() / 2) * this.countFactor.valueOf() + shift);
            let validImgIdx = (match.imgIdx == 1);
            if (!validQueryIdx || !validTrainIdx || !validImgIdx)
                badCount++;
        }
    }

        alvision.ASSERT_EQ(0, badCount);
}
}

//CUDA_TEST_P(BruteForceMatcher, KnnMatch_2_Single)
class BruteForceMatcher_KnnMatch_2_Single extends BruteForceMatcher
{
    TestBody(){
    let  matcher =
            alvision.cudafeatures2d.DescriptorMatcher.createBFMatcher(this.normCode);

    const knn = 2;

    let mask = new alvision.cuda.GpuMat();
    if (this.useMask)
    {
        mask.create(this.query.rows(), this.train.rows(), alvision.MatrixType.CV_8UC1);
        mask.setTo(alvision.Scalar.all(1));
    }

    let matches = new Array<Array<alvision.DMatch>>();
    matcher.knnMatch(alvision.loadMat(this.query), alvision.loadMat(this.train), matches, knn, mask);

    alvision.ASSERT_EQ((this.queryDescCount), matches.length);

    let badCount = 0;
    for (let i = 0; i < matches.length; i++)
    {
        if (matches[i].length != knn)
            badCount++;
        else
        {
            let localBadCount = 0;
            for (let k = 0; k < knn; k++)
            {
                let match = matches[i][k];
                if ((match.queryIdx != i) || (match.trainIdx != i * this.countFactor.valueOf() + k) || (match.imgIdx != 0))
                    localBadCount++;
            }
            badCount += localBadCount > 0 ? 1 : 0;
        }
    }

        alvision.ASSERT_EQ(0, badCount);
}
}

//CUDA_TEST_P(BruteForceMatcher, KnnMatch_3_Single)
class BruteForceMatcher_KnnMatch_3_Single extends BruteForceMatcher {
    TestBody() {
        let matcher =
            alvision.cudafeatures2d.DescriptorMatcher.createBFMatcher(this.normCode);

        const knn = 3;

        let mask = new alvision.cuda.GpuMat();
        if (this.useMask) {
            mask.create(this.query.rows(), this.train.rows(), alvision.MatrixType.CV_8UC1);
            mask.setTo(alvision.Scalar.all(1));
        }

        let matches = new Array<Array<alvision.DMatch>>();
        matcher.knnMatch(alvision.loadMat(this.query), alvision.loadMat(this.train), matches, knn, mask);

        alvision.ASSERT_EQ((this.queryDescCount), matches.length);

        let badCount = 0;
        for (let i = 0; i < matches.length; i++) {
            if (matches[i].length != knn)
                badCount++;
            else {
                let localBadCount = 0;
                for (let k = 0; k < knn; k++) {
                    let match = matches[i][k];
                    if ((match.queryIdx != i) || (match.trainIdx != i * this.countFactor.valueOf() + k) || (match.imgIdx != 0))
                        localBadCount++;
                }
                badCount += localBadCount > 0 ? 1 : 0;
            }
        }

        alvision.ASSERT_EQ(0, badCount);
    }
}

//CUDA_TEST_P(BruteForceMatcher, KnnMatch_2_Collection)
class BruteForceMatcher_KnnMatch_2_Collection extends BruteForceMatcher
{
    TestBody(){
    let matcher =
            alvision.cudafeatures2d.DescriptorMatcher.createBFMatcher(this.normCode);

    const knn = 2;

    let d_train = new alvision.cuda.GpuMat (this.train);

    // make add() twice to test such case
    matcher.add(alvision.NewArray<alvision.cuda.GpuMat>(1,()=> d_train.rowRange(0, this.train.rows().valueOf() / 2)));
    matcher.add(alvision.NewArray<alvision.cuda.GpuMat>(1,()=> d_train.rowRange(this.train.rows().valueOf() / 2, this.train.rows())));

    // prepare masks (make first nearest match illegal)
    let masks = new Array<alvision.cuda.GpuMat> (2);
    for (let mi = 0; mi < 2; mi++ )
    {
        masks[mi] = new alvision.cuda.GpuMat(this.query.rows(), this.train.rows().valueOf() / 2, alvision.MatrixType.CV_8UC1, alvision.Scalar.all(1));
        for (let di = 0; di < this.queryDescCount.valueOf() / 2; di++)
            masks[mi].col(di * this.countFactor.valueOf()).setTo(alvision.Scalar.all(0));
    }

    let matches = new Array<Array<alvision.DMatch>>();

    if (this.useMask)
        matcher.knnMatch(new alvision.cuda.GpuMat(this.query), matches, knn, masks);
    else
        matcher.knnMatch(new alvision.cuda.GpuMat(this.query), matches, knn);

    alvision.ASSERT_EQ((this.queryDescCount), matches.length);

    let badCount = 0;
    let shift = this.useMask ? 1 : 0;
    for (let i = 0; i < matches.length; i++)
    {
        if (matches[i].length != knn)
            badCount++;
        else
        {
            let localBadCount = 0;
            for (let k = 0; k < knn; k++)
            {
                let match = matches[i][k];
                {
                    if (i < this.queryDescCount.valueOf() / 2)
                    {
                        if ((match.queryIdx != i) || (match.trainIdx != i * this.countFactor.valueOf() + k + shift) || (match.imgIdx != 0) )
                            localBadCount++;
                    }
                    else
                    {
                        if ((match.queryIdx != i) || (match.trainIdx != (i - this.queryDescCount.valueOf() / 2) * this.countFactor.valueOf() + k + shift) || (match.imgIdx != 1) )
                            localBadCount++;
                    }
                }
            }
            badCount += localBadCount > 0 ? 1 : 0;
        }
    }

        alvision.ASSERT_EQ(0, badCount);
}
}

//CUDA_TEST_P(BruteForceMatcher, KnnMatch_3_Collection)
class BruteForceMatcher_KnnMatch_3_Collection extends BruteForceMatcher
{
    TestBody(){
    let matcher =
            alvision.cudafeatures2d.DescriptorMatcher.createBFMatcher(this.normCode);

    const knn = 3;

    let d_train = new alvision.cuda.GpuMat (this.train);

    // make add() twice to test such case
    matcher.add(alvision.NewArray<alvision.cuda.GpuMat>(1,()=> d_train.rowRange(0, this.train.rows().valueOf() / 2)));
    matcher.add(alvision.NewArray<alvision.cuda.GpuMat>(1,()=> d_train.rowRange(this.train.rows().valueOf() / 2, this.train.rows().valueOf())));

    // prepare masks (make first nearest match illegal)
    let masks = new Array<alvision.cuda.GpuMat> (2);
    for (let mi = 0; mi < 2; mi++ )
    {
        masks[mi] = new alvision.cuda.GpuMat(this.query.rows(), this.train.rows().valueOf() / 2, alvision.MatrixType.CV_8UC1, alvision.Scalar.all(1));
        for (let di = 0; di < this.queryDescCount.valueOf() / 2; di++)
            masks[mi].col(di * this.countFactor.valueOf()).setTo(alvision.Scalar.all(0));
    }

    let matches = new Array<Array<alvision.DMatch>>();

    if (this.useMask)
        matcher.knnMatch(new alvision.cuda.GpuMat(this.query), matches, knn, masks);
    else
        matcher.knnMatch(new alvision.cuda.GpuMat(this.query), matches, knn);

    alvision.ASSERT_EQ((this.queryDescCount), matches.length);

    let badCount = 0;
    let shift = this.useMask ? 1 : 0;
    for(let i = 0; i < matches.length; i++)
    {
        if (matches[i].length != knn)
            badCount++;
        else
        {
            let localBadCount = 0;
            for (let k = 0; k < knn; k++)
            {
                let match = matches[i][k];
                {
                    if (i < this.queryDescCount.valueOf() / 2)
                    {
                        if ((match.queryIdx != i) || (match.trainIdx != i * this.countFactor.valueOf() + k + shift) || (match.imgIdx != 0) )
                            localBadCount++;
                    }
                    else
                    {
                        if ((match.queryIdx != i) || (match.trainIdx != (i - this.queryDescCount.valueOf() / 2) * this.countFactor.valueOf() + k + shift) || (match.imgIdx != 1) )
                            localBadCount++;
                    }
                }
            }
            badCount += localBadCount > 0 ? 1 : 0;
        }
    }

        alvision.ASSERT_EQ(0, badCount);
}
}

//CUDA_TEST_P(BruteForceMatcher, RadiusMatch_Single)
class BruteForceMatcher_RadiusMatch_Single extends BruteForceMatcher
{
    TestBody(){
    let matcher =
            alvision.cudafeatures2d.DescriptorMatcher.createBFMatcher(this.normCode);

    const radius = 1./ this.countFactor.valueOf();

    if (!alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.GLOBAL_ATOMICS))
    {
        try
        {
            let matches = new Array<Array<alvision.DMatch>>();
            matcher.radiusMatch(alvision.loadMat(this.query), alvision.loadMat(this.train), matches, radius);
        }
        catch(e)
        {
            alvision.ASSERT_EQ(alvision.cv.Error.Code.StsNotImplemented, e.code);
        }
    }
    else
    {
        let mask = new alvision.cuda.GpuMat();
        if (this.useMask)
        {
            mask.create(this.query.rows(), this.train.rows(),alvision.MatrixType. CV_8UC1);
            mask.setTo(alvision.Scalar.all(1));
        }

        let matches = new Array<Array<alvision.DMatch>>();
        matcher.radiusMatch(alvision.loadMat(this.query), alvision.loadMat(this.train), matches, radius, mask);

        alvision.ASSERT_EQ((this.queryDescCount), matches.length);

        let badCount = 0;
        for(let i = 0; i < matches.length; i++)
        {
            if (matches[i].length != 1)
                badCount++;
            else
            {
                let match = matches[i][0];
                if ((match.queryIdx != i) || (match.trainIdx != i*this.countFactor.valueOf()) || (match.imgIdx != 0))
                    badCount++;
            }
        }

        alvision.ASSERT_EQ(0, badCount);
    }
}
}

//CUDA_TEST_P(BruteForceMatcher, RadiusMatch_Collection)
class BruteForceMatcher_RadiusMatch_Collection extends BruteForceMatcher
{
    TestBody(){
    let matcher =
            alvision.cudafeatures2d.DescriptorMatcher.createBFMatcher(this.normCode);

    const n = 3;
    const radius = 1. / this.countFactor.valueOf() * n;

    let d_train = new alvision.cuda.GpuMat (this.train);

    // make add() twice to test such case
    matcher.add(alvision.NewArray<alvision.cuda.GpuMat>(1,()=> d_train.rowRange(0, this.train.rows().valueOf() / 2)));
    matcher.add(alvision.NewArray<alvision.cuda.GpuMat>(1,()=> d_train.rowRange(this.train.rows().valueOf() / 2, this.train.rows())));

    // prepare masks (make first nearest match illegal)
    let masks = new Array<alvision.cuda.GpuMat> (2);
    for (let mi = 0; mi < 2; mi++)
    {
        masks[mi] =new alvision.cuda.GpuMat(this.query.rows(), this.train.rows().valueOf() / 2, alvision.MatrixType.CV_8UC1, alvision.Scalar.all(1));
        for (let di = 0; di < this.queryDescCount.valueOf() / 2; di++)
            masks[mi].col(di * this.countFactor.valueOf()).setTo(alvision.Scalar.all(0));
    }

    if (!alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.GLOBAL_ATOMICS))
    {
        try
        {
            let matches = new Array<Array<alvision.DMatch>>();
            matcher.radiusMatch(new alvision.cuda.GpuMat(this.query), matches, radius, masks);
        }
        catch(e)
        {
            alvision.ASSERT_EQ(alvision.cv.Error.Code.StsNotImplemented, e.code);
        }
    }
    else
    {
        let matches = new Array<Array<alvision.DMatch>>();

        if (this.useMask)
            matcher.radiusMatch(new alvision.cuda.GpuMat(this.query), matches, radius, masks);
        else
            matcher.radiusMatch(new alvision.cuda.GpuMat(this.query), matches, radius);

        alvision.ASSERT_EQ((this.queryDescCount), matches.length);

        let badCount = 0;
        let shift = this.useMask ? 1 : 0;
        let needMatchCount = this.useMask ? n-1 : n;
        for(let i = 0; i < matches.length; i++)
        {
            if (matches[i].length != needMatchCount)
                badCount++;
            else
            {
                let localBadCount = 0;
                for (let k = 0; k < needMatchCount; k++)
                {
                    let match = matches[i][k];
                    {
                        if (i < this.queryDescCount.valueOf() / 2)
                        {
                            if ((match.queryIdx != i) || (match.trainIdx != i * this.countFactor.valueOf() + k + shift) || (match.imgIdx != 0) )
                                localBadCount++;
                        }
                        else
                        {
                            if ((match.queryIdx != i) || (match.trainIdx != (i - this.queryDescCount.valueOf() / 2) * this.countFactor.valueOf() + k + shift) || (match.imgIdx != 1) )
                                localBadCount++;
                        }
                    }
                }
                badCount += localBadCount > 0 ? 1 : 0;
            }
        }

        alvision.ASSERT_EQ(0, badCount);
    }
}
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Features2D', 'BruteForceMatcher', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    [alvision.NormTypes.NORM_L1,alvision.NormTypes.NORM_L2],
    [57,64,83,128,179,256,304],
    [false,true],
    ]));

//#endif // HAVE_CUDA
