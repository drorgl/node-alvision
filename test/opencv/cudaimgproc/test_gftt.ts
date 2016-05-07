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

//////////////////////////////////////////////////////
// GoodFeaturesToTrack

//namespace
//{
//    IMPLEMENT_PARAM_CLASS(MinDistance, double)
//}
//
//PARAM_TEST_CASE(GoodFeaturesToTrack, alvision.cuda::DeviceInfo, MinDistance)
//{
//    alvision.cuda::DeviceInfo devInfo;
//    double minDistance;
//
//    virtual void SetUp()
//    {
//        devInfo = GET_PARAM(0);
//        minDistance = GET_PARAM(1);
//
//        alvision.cuda::setDevice(devInfo.deviceID());
//    }
//};


alvision.cvtest.CUDA_TEST_P('GoodFeaturesToTrack', 'Accuracy',()=>
{
    var image = readImage("opticalflow/frame0.png", alvision.ImreadModes.IMREAD_GRAYSCALE);
    alvision.ASSERT_FALSE(image.empty());

    var maxCorners = 1000;
    var qualityLevel = 0.01;

    alvision.Ptr < alvision.cuda::CornersDetector > detector = alvision.cuda::createGoodFeaturesToTrackDetector(image.type(), maxCorners, qualityLevel, minDistance);
    var detector = alvision.cuda.

    alvision.cuda::GpuMat d_pts;
    detector->detect(loadMat(image), d_pts);

    ASSERT_FALSE(d_pts.empty());

    std::Array<alvision.Point2f> pts(d_pts.cols);
    alvision.Mat pts_mat(1, d_pts.cols, CV_32FC2, (void*) &pts[0]);
    d_pts.download(pts_mat);

    std::Array<alvision.Point2f> pts_gold;
    alvision.goodFeaturesToTrack(image, pts_gold, maxCorners, qualityLevel, minDistance);

    ASSERT_EQ(pts_gold.size(), pts.size());

    size_t mistmatch = 0;
    for (size_t i = 0; i < pts.size(); ++i)
    {
        alvision.Point2i a = pts_gold[i];
        alvision.Point2i b = pts[i];

        bool eq = std::abs(a.x - b.x) < 1 && std::abs(a.y - b.y) < 1;

        if (!eq)
            ++mistmatch;
    }

    double bad_ratio = static_cast<double>(mistmatch) / pts.size();

    ASSERT_LE(bad_ratio, 0.01);
});

alvision.cvtest.CUDA_TEST_P('GoodFeaturesToTrack', 'EmptyCorners', () => {
    int maxCorners = 1000;
    double qualityLevel = 0.01;

    alvision.cuda::GpuMat src(100, 100, CV_8UC1, alvision.Scalar::all(0));
    alvision.cuda::GpuMat corners(1, maxCorners, CV_32FC2);

    alvision.Ptr < alvision.cuda::CornersDetector > detector = alvision.cuda::createGoodFeaturesToTrackDetector(src.type(), maxCorners, qualityLevel, minDistance);

    detector ->detect(src, corners);

    ASSERT_TRUE(corners.empty());
});

//INSTANTIATE_TEST_CASE_P(CUDA_ImgProc, GoodFeaturesToTrack, testing::Combine(
//    ALL_DEVICES,
//    testing::Values(MinDistance(0.0), MinDistance(3.0))));

//#endif // HAVE_CUDA
