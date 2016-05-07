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

////////////////////////////////////////////////////////////////////////////////
// MeanShift

struct MeanShift : testing::TestWithParam<alvision.cuda::DeviceInfo>
{
    alvision.cuda::DeviceInfo devInfo;

    alvision.Mat img;

    int spatialRad;
    int colorRad;

    virtual void SetUp()
    {
        devInfo = GetParam();

        alvision.cuda::setDevice(devInfo.deviceID());

        img = readImageType("meanshift/cones.png", CV_8UC4);
        ASSERT_FALSE(img.empty());

        spatialRad = 30;
        colorRad = 30;
    }
};

CUDA_TEST_P(MeanShift, Filtering)
{
    alvision.Mat img_template;
    if (supportFeature(devInfo, alvision.cuda::FEATURE_SET_COMPUTE_20))
        img_template = readImage("meanshift/con_result.png");
    else
        img_template = readImage("meanshift/con_result_CC1X.png");
    ASSERT_FALSE(img_template.empty());

    alvision.cuda::GpuMat d_dst;
    alvision.cuda::meanShiftFiltering(loadMat(img), d_dst, spatialRad, colorRad);

    ASSERT_EQ(CV_8UC4, d_dst.type());

    alvision.Mat dst(d_dst);

    alvision.var result = new alvision.Mat();
    alvision.cvtColor(dst, result, alvision.COLOR_BGRA2BGR);

    EXPECT_MAT_NEAR(img_template, result, 0.0);
}

CUDA_TEST_P(MeanShift, Proc)
{
    alvision.FileStorage fs;
    if (supportFeature(devInfo, alvision.cuda::FEATURE_SET_COMPUTE_20))
        fs.open(std::alvision.cvtest.TS.ptr().get_data_path() + "meanshift/spmap.yaml", alvision.FileStorage::READ);
    else
        fs.open(std::alvision.cvtest.TS.ptr().get_data_path() + "meanshift/spmap_CC1X.yaml", alvision.FileStorage::READ);
    ASSERT_TRUE(fs.isOpened());

    alvision.Mat spmap_template;
    fs["spmap"] >> spmap_template;
    ASSERT_FALSE(spmap_template.empty());

    alvision.cuda::GpuMat rmap_filtered;
    alvision.cuda::meanShiftFiltering(loadMat(img), rmap_filtered, spatialRad, colorRad);

    alvision.cuda::GpuMat rmap;
    alvision.cuda::GpuMat spmap;
    alvision.cuda::meanShiftProc(loadMat(img), rmap, spmap, spatialRad, colorRad);

    ASSERT_EQ(CV_8UC4, rmap.type());

    EXPECT_MAT_NEAR(rmap_filtered, rmap, 0.0);
    EXPECT_MAT_NEAR(spmap_template, spmap, 0.0);
}

INSTANTIATE_TEST_CASE_P(CUDA_ImgProc, MeanShift, ALL_DEVICES);

////////////////////////////////////////////////////////////////////////////////
// MeanShiftSegmentation

namespace
{
    IMPLEMENT_PARAM_CLASS(MinSize, int);
}

PARAM_TEST_CASE(MeanShiftSegmentation, alvision.cuda::DeviceInfo, MinSize)
{
    alvision.cuda::DeviceInfo devInfo;
    int minsize;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        minsize = GET_PARAM(1);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(MeanShiftSegmentation, Regression)
{
    alvision.Mat img = readImageType("meanshift/cones.png", CV_8UC4);
    ASSERT_FALSE(img.empty());

    std::ostringstream path;
    path << "meanshift/cones_segmented_sp10_sr10_minsize" << minsize;
    if (supportFeature(devInfo, alvision.cuda::FEATURE_SET_COMPUTE_20))
        path << ".png";
    else
        path << "_CC1X.png";
    alvision.Mat dst_gold = readImage(path);
    ASSERT_FALSE(dst_gold.empty());

    alvision.Mat dst;
    alvision.cuda::meanShiftSegmentation(loadMat(img), dst, 10, 10, minsize);

    alvision.Mat dst_rgb;
    alvision.cvtColor(dst, dst_rgb, alvision.COLOR_BGRA2BGR);

    EXPECT_MAT_SIMILAR(dst_gold, dst_rgb, 1e-3);
}

INSTANTIATE_TEST_CASE_P(CUDA_ImgProc, MeanShiftSegmentation, testing::Combine(
    ALL_DEVICES,
    testing::Values(MinSize(0), MinSize(4), MinSize(20), MinSize(84), MinSize(340), MinSize(1364))));

#endif // HAVE_CUDA
