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

#include "test_precomp.hpp"

#ifdef HAVE_CUDA

using namespace cvtest;

/////////////////////////////////////////////////////////////////////////////////////////////////
// FAST

namespace
{
    IMPLEMENT_PARAM_CLASS(FAST_Threshold, int)
    IMPLEMENT_PARAM_CLASS(FAST_NonmaxSuppression, bool)
}

PARAM_TEST_CASE(FAST, alvision.cuda::DeviceInfo, FAST_Threshold, FAST_NonmaxSuppression)
{
    alvision.cuda::DeviceInfo devInfo;
    int threshold;
    bool nonmaxSuppression;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        threshold = GET_PARAM(1);
        nonmaxSuppression = GET_PARAM(2);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(FAST, Accuracy)
{
    alvision.Mat image = readImage("features2d/aloe.png", alvision.ImreadModes.IMREAD_GRAYSCALE);
    ASSERT_FALSE(image.empty());

    alvision.Ptr<alvision.cuda::FastFeatureDetector> fast = alvision.cuda::FastFeatureDetector::create(threshold, nonmaxSuppression);

    if (!supportFeature(devInfo, alvision.cuda::GLOBAL_ATOMICS))
    {
        try
        {
            std::Array<alvision.KeyPoint> keypoints;
            fast->detect(loadMat(image), keypoints);
        }
        catch (const alvision.Exception& e)
        {
            ASSERT_EQ(alvision.Error::StsNotImplemented, e.code);
        }
    }
    else
    {
        std::Array<alvision.KeyPoint> keypoints;
        fast->detect(loadMat(image), keypoints);

        std::Array<alvision.KeyPoint> keypoints_gold;
        alvision.FAST(image, keypoints_gold, threshold, nonmaxSuppression);

        ASSERT_KEYPOINTS_EQ(keypoints_gold, keypoints);
    }
}

INSTANTIATE_TEST_CASE_P(CUDA_Features2D, FAST, testing::Combine(
    ALL_DEVICES,
    testing::Values(FAST_Threshold(25), FAST_Threshold(50)),
    testing::Values(FAST_NonmaxSuppression(false), FAST_NonmaxSuppression(true))));

/////////////////////////////////////////////////////////////////////////////////////////////////
// ORB

namespace
{
    IMPLEMENT_PARAM_CLASS(ORB_FeaturesCount, int)
    IMPLEMENT_PARAM_CLASS(ORB_ScaleFactor, float)
    IMPLEMENT_PARAM_CLASS(ORB_LevelsCount, int)
    IMPLEMENT_PARAM_CLASS(ORB_EdgeThreshold, int)
    IMPLEMENT_PARAM_CLASS(ORB_firstLevel, int)
    IMPLEMENT_PARAM_CLASS(ORB_WTA_K, int)
    IMPLEMENT_PARAM_CLASS(ORB_PatchSize, int)
    IMPLEMENT_PARAM_CLASS(ORB_BlurForDescriptor, bool)
}

CV_ENUM(ORB_ScoreType, alvision.ORB::HARRIS_SCORE, alvision.ORB::FAST_SCORE)

PARAM_TEST_CASE(ORB, alvision.cuda::DeviceInfo, ORB_FeaturesCount, ORB_ScaleFactor, ORB_LevelsCount, ORB_EdgeThreshold, ORB_firstLevel, ORB_WTA_K, ORB_ScoreType, ORB_PatchSize, ORB_BlurForDescriptor)
{
    alvision.cuda::DeviceInfo devInfo;
    int nFeatures;
    float scaleFactor;
    int nLevels;
    int edgeThreshold;
    int firstLevel;
    int WTA_K;
    int scoreType;
    int patchSize;
    bool blurForDescriptor;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        nFeatures = GET_PARAM(1);
        scaleFactor = GET_PARAM(2);
        nLevels = GET_PARAM(3);
        edgeThreshold = GET_PARAM(4);
        firstLevel = GET_PARAM(5);
        WTA_K = GET_PARAM(6);
        scoreType = GET_PARAM(7);
        patchSize = GET_PARAM(8);
        blurForDescriptor = GET_PARAM(9);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(ORB, Accuracy)
{
    alvision.Mat image = readImage("features2d/aloe.png", alvision.ImreadModes.IMREAD_GRAYSCALE);
    ASSERT_FALSE(image.empty());

    alvision.Mat mask(image.size(), CV_8UC1, alvision.Scalar::all(1));
    mask(alvision.Range(0, image.rows / 2), alvision.Range(0, image.cols / 2)).setTo(alvision.Scalar::all(0));

    alvision.Ptr<alvision.cuda::ORB> orb =
            alvision.cuda::ORB::create(nFeatures, scaleFactor, nLevels, edgeThreshold, firstLevel,
                                  WTA_K, scoreType, patchSize, 20, blurForDescriptor);

    if (!supportFeature(devInfo, alvision.cuda::GLOBAL_ATOMICS))
    {
        try
        {
            std::Array<alvision.KeyPoint> keypoints;
            alvision.cuda::GpuMat descriptors;
            orb->detectAndComputeAsync(loadMat(image), loadMat(mask), keypoints, descriptors);
        }
        catch (const alvision.Exception& e)
        {
            ASSERT_EQ(alvision.Error::StsNotImplemented, e.code);
        }
    }
    else
    {
        std::Array<alvision.KeyPoint> keypoints;
        alvision.cuda::GpuMat descriptors;
        orb->detectAndCompute(loadMat(image), loadMat(mask), keypoints, descriptors);

        alvision.Ptr<alvision.ORB> orb_gold = alvision.ORB::create(nFeatures, scaleFactor, nLevels, edgeThreshold, firstLevel, WTA_K, scoreType, patchSize);

        std::Array<alvision.KeyPoint> keypoints_gold;
        alvision.Mat descriptors_gold;
        orb_gold->detectAndCompute(image, mask, keypoints_gold, descriptors_gold);

        alvision.BFMatcher matcher(alvision.NORM_HAMMING);
        std::Array<alvision.DMatch> matches;
        matcher.match(descriptors_gold, alvision.Mat(descriptors), matches);

        int matchedCount = getMatchedPointsCount(keypoints_gold, keypoints, matches);
        double matchedRatio = static_cast<double>(matchedCount) / keypoints.size();

        EXPECT_GT(matchedRatio, 0.35);
    }
}

INSTANTIATE_TEST_CASE_P(CUDA_Features2D, ORB,  testing::Combine(
    ALL_DEVICES,
    testing::Values(ORB_FeaturesCount(1000)),
    testing::Values(ORB_ScaleFactor(1.2f)),
    testing::Values(ORB_LevelsCount(4), ORB_LevelsCount(8)),
    testing::Values(ORB_EdgeThreshold(31)),
    testing::Values(ORB_firstLevel(0)),
    testing::Values(ORB_WTA_K(2), ORB_WTA_K(3), ORB_WTA_K(4)),
    testing::Values(ORB_ScoreType(alvision.ORB::HARRIS_SCORE)),
    testing::Values(ORB_PatchSize(31), ORB_PatchSize(29)),
    testing::Values(ORB_BlurForDescriptor(false), ORB_BlurForDescriptor(true))));

/////////////////////////////////////////////////////////////////////////////////////////////////
// BruteForceMatcher

namespace
{
    IMPLEMENT_PARAM_CLASS(DescriptorSize, int)
    IMPLEMENT_PARAM_CLASS(UseMask, bool)
}

PARAM_TEST_CASE(BruteForceMatcher, alvision.cuda::DeviceInfo, NormCode, DescriptorSize, UseMask)
{
    alvision.cuda::DeviceInfo devInfo;
    int normCode;
    int dim;
    bool useMask;

    int queryDescCount;
    int countFactor;

    alvision.Mat query, train;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        normCode = GET_PARAM(1);
        dim = GET_PARAM(2);
        useMask = GET_PARAM(3);

        alvision.cuda::setDevice(devInfo.deviceID());

        queryDescCount = 300; // must be even number because we split train data in some cases in two
        countFactor = 4; // do not change it

        alvision.RNG& rng = alvision.cvtest.TS::ptr()->get_rng();

        alvision.Mat queryBuf, trainBuf;

        // Generate query descriptors randomly.
        // Descriptor vector elements are integer values.
        queryBuf.create(queryDescCount, dim, CV_32SC1);
        rng.fill(queryBuf, alvision.RNG::UNIFORM, alvision.Scalar::all(0), alvision.Scalar::all(3));
        queryBuf.convertTo(queryBuf, CV_32FC1);

        // Generate train decriptors as follows:
        // copy each query descriptor to train set countFactor times
        // and perturb some one element of the copied descriptors in
        // in ascending order. General boundaries of the perturbation
        // are (0.f, 1.f).
        trainBuf.create(queryDescCount * countFactor, dim, CV_32FC1);
        float step = 1.f / countFactor;
        for (int qIdx = 0; qIdx < queryDescCount; qIdx++)
        {
            alvision.Mat queryDescriptor = queryBuf.row(qIdx);
            for (int c = 0; c < countFactor; c++)
            {
                int tIdx = qIdx * countFactor + c;
                alvision.Mat trainDescriptor = trainBuf.row(tIdx);
                queryDescriptor.copyTo(trainDescriptor);
                int elem = rng(dim);
                float diff = rng.uniform(step * c, step * (c + 1));
                trainDescriptor.at<float>(0, elem) += diff;
            }
        }

        queryBuf.convertTo(query, CV_32F);
        trainBuf.convertTo(train, CV_32F);
    }
};

CUDA_TEST_P(BruteForceMatcher, Match_Single)
{
    alvision.Ptr<alvision.cuda::DescriptorMatcher> matcher =
            alvision.cuda::DescriptorMatcher::createBFMatcher(normCode);

    alvision.cuda::GpuMat mask;
    if (useMask)
    {
        mask.create(query.rows, train.rows, CV_8UC1);
        mask.setTo(alvision.Scalar::all(1));
    }

    std::Array<alvision.DMatch> matches;
    matcher->match(loadMat(query), loadMat(train), matches, mask);

    ASSERT_EQ(static_cast<size_t>(queryDescCount), matches.size());

    int badCount = 0;
    for (size_t i = 0; i < matches.size(); i++)
    {
        alvision.DMatch match = matches[i];
        if ((match.queryIdx != (int)i) || (match.trainIdx != (int)i * countFactor) || (match.imgIdx != 0))
            badCount++;
    }

    ASSERT_EQ(0, badCount);
}

CUDA_TEST_P(BruteForceMatcher, Match_Collection)
{
    alvision.Ptr<alvision.cuda::DescriptorMatcher> matcher =
            alvision.cuda::DescriptorMatcher::createBFMatcher(normCode);

    alvision.cuda::GpuMat d_train(train);

    // make add() twice to test such case
    matcher->add(std::Array<alvision.cuda::GpuMat>(1, d_train.rowRange(0, train.rows / 2)));
    matcher->add(std::Array<alvision.cuda::GpuMat>(1, d_train.rowRange(train.rows / 2, train.rows)));

    // prepare masks (make first nearest match illegal)
    std::Array<alvision.cuda::GpuMat> masks(2);
    for (int mi = 0; mi < 2; mi++)
    {
        masks[mi] = alvision.cuda::GpuMat(query.rows, train.rows/2, CV_8UC1, alvision.Scalar::all(1));
        for (int di = 0; di < queryDescCount/2; di++)
            masks[mi].col(di * countFactor).setTo(alvision.Scalar::all(0));
    }

    std::Array<alvision.DMatch> matches;
    if (useMask)
        matcher->match(alvision.cuda::GpuMat(query), matches, masks);
    else
        matcher->match(alvision.cuda::GpuMat(query), matches);

    ASSERT_EQ(static_cast<size_t>(queryDescCount), matches.size());

    int badCount = 0;
    int shift = useMask ? 1 : 0;
    for (size_t i = 0; i < matches.size(); i++)
    {
        alvision.DMatch match = matches[i];

        if ((int)i < queryDescCount / 2)
        {
            bool validQueryIdx = (match.queryIdx == (int)i);
            bool validTrainIdx = (match.trainIdx == (int)i * countFactor + shift);
            bool validImgIdx = (match.imgIdx == 0);
            if (!validQueryIdx || !validTrainIdx || !validImgIdx)
                badCount++;
        }
        else
        {
            bool validQueryIdx = (match.queryIdx == (int)i);
            bool validTrainIdx = (match.trainIdx == ((int)i - queryDescCount / 2) * countFactor + shift);
            bool validImgIdx = (match.imgIdx == 1);
            if (!validQueryIdx || !validTrainIdx || !validImgIdx)
                badCount++;
        }
    }

    ASSERT_EQ(0, badCount);
}

CUDA_TEST_P(BruteForceMatcher, KnnMatch_2_Single)
{
    alvision.Ptr<alvision.cuda::DescriptorMatcher> matcher =
            alvision.cuda::DescriptorMatcher::createBFMatcher(normCode);

    const int knn = 2;

    alvision.cuda::GpuMat mask;
    if (useMask)
    {
        mask.create(query.rows, train.rows, CV_8UC1);
        mask.setTo(alvision.Scalar::all(1));
    }

    std::Array< std::Array<alvision.DMatch> > matches;
    matcher->knnMatch(loadMat(query), loadMat(train), matches, knn, mask);

    ASSERT_EQ(static_cast<size_t>(queryDescCount), matches.size());

    int badCount = 0;
    for (size_t i = 0; i < matches.size(); i++)
    {
        if ((int)matches[i].size() != knn)
            badCount++;
        else
        {
            int localBadCount = 0;
            for (int k = 0; k < knn; k++)
            {
                alvision.DMatch match = matches[i][k];
                if ((match.queryIdx != (int)i) || (match.trainIdx != (int)i * countFactor + k) || (match.imgIdx != 0))
                    localBadCount++;
            }
            badCount += localBadCount > 0 ? 1 : 0;
        }
    }

    ASSERT_EQ(0, badCount);
}

CUDA_TEST_P(BruteForceMatcher, KnnMatch_3_Single)
{
    alvision.Ptr<alvision.cuda::DescriptorMatcher> matcher =
            alvision.cuda::DescriptorMatcher::createBFMatcher(normCode);

    const int knn = 3;

    alvision.cuda::GpuMat mask;
    if (useMask)
    {
        mask.create(query.rows, train.rows, CV_8UC1);
        mask.setTo(alvision.Scalar::all(1));
    }

    std::Array< std::Array<alvision.DMatch> > matches;
    matcher->knnMatch(loadMat(query), loadMat(train), matches, knn, mask);

    ASSERT_EQ(static_cast<size_t>(queryDescCount), matches.size());

    int badCount = 0;
    for (size_t i = 0; i < matches.size(); i++)
    {
        if ((int)matches[i].size() != knn)
            badCount++;
        else
        {
            int localBadCount = 0;
            for (int k = 0; k < knn; k++)
            {
                alvision.DMatch match = matches[i][k];
                if ((match.queryIdx != (int)i) || (match.trainIdx != (int)i * countFactor + k) || (match.imgIdx != 0))
                    localBadCount++;
            }
            badCount += localBadCount > 0 ? 1 : 0;
        }
    }

    ASSERT_EQ(0, badCount);
}

CUDA_TEST_P(BruteForceMatcher, KnnMatch_2_Collection)
{
    alvision.Ptr<alvision.cuda::DescriptorMatcher> matcher =
            alvision.cuda::DescriptorMatcher::createBFMatcher(normCode);

    const int knn = 2;

    alvision.cuda::GpuMat d_train(train);

    // make add() twice to test such case
    matcher->add(std::Array<alvision.cuda::GpuMat>(1, d_train.rowRange(0, train.rows / 2)));
    matcher->add(std::Array<alvision.cuda::GpuMat>(1, d_train.rowRange(train.rows / 2, train.rows)));

    // prepare masks (make first nearest match illegal)
    std::Array<alvision.cuda::GpuMat> masks(2);
    for (int mi = 0; mi < 2; mi++ )
    {
        masks[mi] = alvision.cuda::GpuMat(query.rows, train.rows / 2, CV_8UC1, alvision.Scalar::all(1));
        for (int di = 0; di < queryDescCount / 2; di++)
            masks[mi].col(di * countFactor).setTo(alvision.Scalar::all(0));
    }

    std::Array< std::Array<alvision.DMatch> > matches;

    if (useMask)
        matcher->knnMatch(alvision.cuda::GpuMat(query), matches, knn, masks);
    else
        matcher->knnMatch(alvision.cuda::GpuMat(query), matches, knn);

    ASSERT_EQ(static_cast<size_t>(queryDescCount), matches.size());

    int badCount = 0;
    int shift = useMask ? 1 : 0;
    for (size_t i = 0; i < matches.size(); i++)
    {
        if ((int)matches[i].size() != knn)
            badCount++;
        else
        {
            int localBadCount = 0;
            for (int k = 0; k < knn; k++)
            {
                alvision.DMatch match = matches[i][k];
                {
                    if ((int)i < queryDescCount / 2)
                    {
                        if ((match.queryIdx != (int)i) || (match.trainIdx != (int)i * countFactor + k + shift) || (match.imgIdx != 0) )
                            localBadCount++;
                    }
                    else
                    {
                        if ((match.queryIdx != (int)i) || (match.trainIdx != ((int)i - queryDescCount / 2) * countFactor + k + shift) || (match.imgIdx != 1) )
                            localBadCount++;
                    }
                }
            }
            badCount += localBadCount > 0 ? 1 : 0;
        }
    }

    ASSERT_EQ(0, badCount);
}

CUDA_TEST_P(BruteForceMatcher, KnnMatch_3_Collection)
{
    alvision.Ptr<alvision.cuda::DescriptorMatcher> matcher =
            alvision.cuda::DescriptorMatcher::createBFMatcher(normCode);

    const int knn = 3;

    alvision.cuda::GpuMat d_train(train);

    // make add() twice to test such case
    matcher->add(std::Array<alvision.cuda::GpuMat>(1, d_train.rowRange(0, train.rows / 2)));
    matcher->add(std::Array<alvision.cuda::GpuMat>(1, d_train.rowRange(train.rows / 2, train.rows)));

    // prepare masks (make first nearest match illegal)
    std::Array<alvision.cuda::GpuMat> masks(2);
    for (int mi = 0; mi < 2; mi++ )
    {
        masks[mi] = alvision.cuda::GpuMat(query.rows, train.rows / 2, CV_8UC1, alvision.Scalar::all(1));
        for (int di = 0; di < queryDescCount / 2; di++)
            masks[mi].col(di * countFactor).setTo(alvision.Scalar::all(0));
    }

    std::Array< std::Array<alvision.DMatch> > matches;

    if (useMask)
        matcher->knnMatch(alvision.cuda::GpuMat(query), matches, knn, masks);
    else
        matcher->knnMatch(alvision.cuda::GpuMat(query), matches, knn);

    ASSERT_EQ(static_cast<size_t>(queryDescCount), matches.size());

    int badCount = 0;
    int shift = useMask ? 1 : 0;
    for (size_t i = 0; i < matches.size(); i++)
    {
        if ((int)matches[i].size() != knn)
            badCount++;
        else
        {
            int localBadCount = 0;
            for (int k = 0; k < knn; k++)
            {
                alvision.DMatch match = matches[i][k];
                {
                    if ((int)i < queryDescCount / 2)
                    {
                        if ((match.queryIdx != (int)i) || (match.trainIdx != (int)i * countFactor + k + shift) || (match.imgIdx != 0) )
                            localBadCount++;
                    }
                    else
                    {
                        if ((match.queryIdx != (int)i) || (match.trainIdx != ((int)i - queryDescCount / 2) * countFactor + k + shift) || (match.imgIdx != 1) )
                            localBadCount++;
                    }
                }
            }
            badCount += localBadCount > 0 ? 1 : 0;
        }
    }

    ASSERT_EQ(0, badCount);
}

CUDA_TEST_P(BruteForceMatcher, RadiusMatch_Single)
{
    alvision.Ptr<alvision.cuda::DescriptorMatcher> matcher =
            alvision.cuda::DescriptorMatcher::createBFMatcher(normCode);

    const float radius = 1.f / countFactor;

    if (!supportFeature(devInfo, alvision.cuda::GLOBAL_ATOMICS))
    {
        try
        {
            std::Array< std::Array<alvision.DMatch> > matches;
            matcher->radiusMatch(loadMat(query), loadMat(train), matches, radius);
        }
        catch (const alvision.Exception& e)
        {
            ASSERT_EQ(alvision.Error::StsNotImplemented, e.code);
        }
    }
    else
    {
        alvision.cuda::GpuMat mask;
        if (useMask)
        {
            mask.create(query.rows, train.rows, CV_8UC1);
            mask.setTo(alvision.Scalar::all(1));
        }

        std::Array< std::Array<alvision.DMatch> > matches;
        matcher->radiusMatch(loadMat(query), loadMat(train), matches, radius, mask);

        ASSERT_EQ(static_cast<size_t>(queryDescCount), matches.size());

        int badCount = 0;
        for (size_t i = 0; i < matches.size(); i++)
        {
            if ((int)matches[i].size() != 1)
                badCount++;
            else
            {
                alvision.DMatch match = matches[i][0];
                if ((match.queryIdx != (int)i) || (match.trainIdx != (int)i*countFactor) || (match.imgIdx != 0))
                    badCount++;
            }
        }

        ASSERT_EQ(0, badCount);
    }
}

CUDA_TEST_P(BruteForceMatcher, RadiusMatch_Collection)
{
    alvision.Ptr<alvision.cuda::DescriptorMatcher> matcher =
            alvision.cuda::DescriptorMatcher::createBFMatcher(normCode);

    const int n = 3;
    const float radius = 1.f / countFactor * n;

    alvision.cuda::GpuMat d_train(train);

    // make add() twice to test such case
    matcher->add(std::Array<alvision.cuda::GpuMat>(1, d_train.rowRange(0, train.rows / 2)));
    matcher->add(std::Array<alvision.cuda::GpuMat>(1, d_train.rowRange(train.rows / 2, train.rows)));

    // prepare masks (make first nearest match illegal)
    std::Array<alvision.cuda::GpuMat> masks(2);
    for (int mi = 0; mi < 2; mi++)
    {
        masks[mi] = alvision.cuda::GpuMat(query.rows, train.rows / 2, CV_8UC1, alvision.Scalar::all(1));
        for (int di = 0; di < queryDescCount / 2; di++)
            masks[mi].col(di * countFactor).setTo(alvision.Scalar::all(0));
    }

    if (!supportFeature(devInfo, alvision.cuda::GLOBAL_ATOMICS))
    {
        try
        {
            std::Array< std::Array<alvision.DMatch> > matches;
            matcher->radiusMatch(alvision.cuda::GpuMat(query), matches, radius, masks);
        }
        catch (const alvision.Exception& e)
        {
            ASSERT_EQ(alvision.Error::StsNotImplemented, e.code);
        }
    }
    else
    {
        std::Array< std::Array<alvision.DMatch> > matches;

        if (useMask)
            matcher->radiusMatch(alvision.cuda::GpuMat(query), matches, radius, masks);
        else
            matcher->radiusMatch(alvision.cuda::GpuMat(query), matches, radius);

        ASSERT_EQ(static_cast<size_t>(queryDescCount), matches.size());

        int badCount = 0;
        int shift = useMask ? 1 : 0;
        int needMatchCount = useMask ? n-1 : n;
        for (size_t i = 0; i < matches.size(); i++)
        {
            if ((int)matches[i].size() != needMatchCount)
                badCount++;
            else
            {
                int localBadCount = 0;
                for (int k = 0; k < needMatchCount; k++)
                {
                    alvision.DMatch match = matches[i][k];
                    {
                        if ((int)i < queryDescCount / 2)
                        {
                            if ((match.queryIdx != (int)i) || (match.trainIdx != (int)i * countFactor + k + shift) || (match.imgIdx != 0) )
                                localBadCount++;
                        }
                        else
                        {
                            if ((match.queryIdx != (int)i) || (match.trainIdx != ((int)i - queryDescCount / 2) * countFactor + k + shift) || (match.imgIdx != 1) )
                                localBadCount++;
                        }
                    }
                }
                badCount += localBadCount > 0 ? 1 : 0;
            }
        }

        ASSERT_EQ(0, badCount);
    }
}

INSTANTIATE_TEST_CASE_P(CUDA_Features2D, BruteForceMatcher, testing::Combine(
    ALL_DEVICES,
    testing::Values(NormCode(alvision.NORM_L1), NormCode(alvision.NORM_L2)),
    testing::Values(DescriptorSize(57), DescriptorSize(64), DescriptorSize(83), DescriptorSize(128), DescriptorSize(179), DescriptorSize(256), DescriptorSize(304)),
    testing::Values(UseMask(false), UseMask(true))));

#endif // HAVE_CUDA
