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

///////////////////////////////////////////////////////////////////////////////////////////////////////
// cvtColor

PARAM_TEST_CASE(CvtColor, alvision.cuda::DeviceInfo, alvision.Size, MatDepth, UseRoi)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    int depth;
    bool useRoi;

    alvision.Mat img;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        depth = GET_PARAM(2);
        useRoi = GET_PARAM(3);

        alvision.cuda::setDevice(devInfo.deviceID());

        img = randomMat(size, CV_MAKE_TYPE(depth, 3), 0.0, depth == CV_32F ? 1.0 : 255.0);
    }
};

CUDA_TEST_P(CvtColor, BGR2RGB)
{
    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2RGB);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2RGB);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, BGR2RGBA)
{
    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2RGBA);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2RGBA);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, BGR2BGRA)
{
    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2BGRA);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2BGRA);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, BGRA2RGB)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2BGRA);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGRA2RGB);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGRA2RGB);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, BGRA2BGR)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2BGRA);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGRA2BGR);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGRA2BGR);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, BGRA2RGBA)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2BGRA);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGRA2RGBA);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGRA2RGBA);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, BGR2GRAY)
{
    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2GRAY);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2GRAY);

    EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
}

CUDA_TEST_P(CvtColor, RGB2GRAY)
{
    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGB2GRAY);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGB2GRAY);

    EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
}

CUDA_TEST_P(CvtColor, GRAY2BGR)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2GRAY);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_GRAY2BGR);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_GRAY2BGR);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, GRAY2BGRA)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2GRAY);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_GRAY2BGRA, 4);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_GRAY2BGRA, 4);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, BGRA2GRAY)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2BGRA);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGRA2GRAY);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGRA2GRAY);

    EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
}

CUDA_TEST_P(CvtColor, RGBA2GRAY)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2RGBA);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGBA2GRAY);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGBA2GRAY);

    EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
}

CUDA_TEST_P(CvtColor, BGR2BGR565)
{
    if (depth != CV_8U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2BGR565);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2BGR565);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, RGB2BGR565)
{
    if (depth != CV_8U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGB2BGR565);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGB2BGR565);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, BGR5652BGR)
{
    if (depth != CV_8U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2BGR565);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR5652BGR);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR5652BGR);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, BGR5652RGB)
{
    if (depth != CV_8U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2BGR565);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR5652RGB);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR5652RGB);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, BGRA2BGR565)
{
    if (depth != CV_8U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2BGRA);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGRA2BGR565);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGRA2BGR565);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, RGBA2BGR565)
{
    if (depth != CV_8U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2RGBA);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGBA2BGR565);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGBA2BGR565);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, BGR5652BGRA)
{
    if (depth != CV_8U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2BGR565);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR5652BGRA, 4);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR5652BGRA, 4);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, BGR5652RGBA)
{
    if (depth != CV_8U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2BGR565);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR5652RGBA, 4);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR5652RGBA, 4);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, GRAY2BGR565)
{
    if (depth != CV_8U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2GRAY);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_GRAY2BGR565);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_GRAY2BGR565);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, BGR5652GRAY)
{
    if (depth != CV_8U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2BGR565);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR5652GRAY);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR5652GRAY);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, BGR2BGR555)
{
    if (depth != CV_8U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2BGR555);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2BGR555);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, RGB2BGR555)
{
    if (depth != CV_8U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGB2BGR555);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGB2BGR555);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, BGR5552BGR)
{
    if (depth != CV_8U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2BGR555);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR5552BGR);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR5552BGR);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, BGR5552RGB)
{
    if (depth != CV_8U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2BGR555);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR5552RGB);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR5552RGB);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, BGRA2BGR555)
{
    if (depth != CV_8U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2BGRA);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGRA2BGR555);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGRA2BGR555);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, RGBA2BGR555)
{
    if (depth != CV_8U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2RGBA);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGBA2BGR555);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGBA2BGR555);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, BGR5552BGRA)
{
    if (depth != CV_8U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2BGR555);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR5552BGRA, 4);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR5552BGRA, 4);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, BGR5552RGBA)
{
    if (depth != CV_8U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2BGR555);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR5552RGBA, 4);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR5552RGBA, 4);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, GRAY2BGR555)
{
    if (depth != CV_8U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2GRAY);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_GRAY2BGR555);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_GRAY2BGR555);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, BGR5552GRAY)
{
    if (depth != CV_8U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2BGR555);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR5552GRAY);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR5552GRAY);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(CvtColor, BGR2XYZ)
{
    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2XYZ);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2XYZ);

    EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
}

CUDA_TEST_P(CvtColor, RGB2XYZ)
{
    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGB2XYZ);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGB2XYZ);

    EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
}

CUDA_TEST_P(CvtColor, BGR2XYZ4)
{
    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2XYZ, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2XYZ);

    alvision.Mat h_dst(dst);

    alvision.Mat channels[4];
    alvision.split(h_dst, channels);
    alvision.merge(channels, 3, h_dst);

    EXPECT_MAT_NEAR(dst_gold, h_dst, 1e-5);
}

CUDA_TEST_P(CvtColor, BGRA2XYZ4)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2BGRA);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2XYZ, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2XYZ);

    alvision.Mat h_dst(dst);

    alvision.Mat channels[4];
    alvision.split(h_dst, channels);
    alvision.merge(channels, 3, h_dst);

    EXPECT_MAT_NEAR(dst_gold, h_dst, 1e-5);
}

CUDA_TEST_P(CvtColor, XYZ2BGR)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2XYZ);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_XYZ2BGR);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_XYZ2BGR);

    EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
}

CUDA_TEST_P(CvtColor, XYZ2RGB)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2XYZ);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_XYZ2RGB);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_XYZ2RGB);

    EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
}

CUDA_TEST_P(CvtColor, XYZ42BGR)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2XYZ);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_XYZ2BGR);

    alvision.Mat channels[4];
    alvision.split(src, channels);
    channels[3] = alvision.Mat(src.size(), depth, alvision.alvision.Scalar.all(0));
    alvision.merge(channels, 4, src);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_XYZ2BGR);

    EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
}

CUDA_TEST_P(CvtColor, XYZ42BGRA)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2XYZ);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_XYZ2BGR, 4);

    alvision.Mat channels[4];
    alvision.split(src, channels);
    channels[3] = alvision.Mat(src.size(), depth, alvision.alvision.Scalar.all(0));
    alvision.merge(channels, 4, src);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_XYZ2BGR, 4);

    EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
}

CUDA_TEST_P(CvtColor, BGR2YCrCb)
{
    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2YCrCb);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2YCrCb);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, RGB2YCrCb)
{
    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGB2YCrCb);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGB2YCrCb);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, BGR2YCrCb4)
{
    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2YCrCb, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2YCrCb);

    alvision.Mat h_dst(dst);

    alvision.Mat channels[4];
    alvision.split(h_dst, channels);
    alvision.merge(channels, 3, h_dst);

    EXPECT_MAT_NEAR(dst_gold, h_dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, RGBA2YCrCb4)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2RGBA);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2YCrCb, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2YCrCb);

    alvision.Mat h_dst(dst);

    alvision.Mat channels[4];
    alvision.split(h_dst, channels);
    alvision.merge(channels, 3, h_dst);

    EXPECT_MAT_NEAR(dst_gold, h_dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, YCrCb2BGR)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2YCrCb);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_YCrCb2BGR);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_YCrCb2BGR);

    EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
}

CUDA_TEST_P(CvtColor, YCrCb2RGB)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2YCrCb);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_YCrCb2RGB);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_YCrCb2RGB);

    EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
}

CUDA_TEST_P(CvtColor, YCrCb42RGB)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2YCrCb);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_YCrCb2RGB);

    alvision.Mat channels[4];
    alvision.split(src, channels);
    channels[3] = alvision.Mat(src.size(), depth, alvision.alvision.Scalar.all(0));
    alvision.merge(channels, 4, src);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_YCrCb2RGB);

    EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
}

CUDA_TEST_P(CvtColor, YCrCb42RGBA)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2YCrCb);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_YCrCb2RGB, 4);

    alvision.Mat channels[4];
    alvision.split(src, channels);
    channels[3] = alvision.Mat(src.size(), depth, alvision.alvision.Scalar.all(0));
    alvision.merge(channels, 4, src);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_YCrCb2RGB, 4);

    EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
}

CUDA_TEST_P(CvtColor, BGR2HSV)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2HSV);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2HSV);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, RGB2HSV)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGB2HSV);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGB2HSV);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, RGB2HSV4)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGB2HSV, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGB2HSV);

    alvision.Mat h_dst(dst);

    alvision.Mat channels[4];
    alvision.split(h_dst, channels);
    alvision.merge(channels, 3, h_dst);

    EXPECT_MAT_NEAR(dst_gold, h_dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, RGBA2HSV4)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2RGBA);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGB2HSV, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGB2HSV);

    alvision.Mat h_dst(dst);

    alvision.Mat channels[4];
    alvision.split(h_dst, channels);
    alvision.merge(channels, 3, h_dst);

    EXPECT_MAT_NEAR(dst_gold, h_dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, BGR2HLS)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2HLS);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2HLS);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, RGB2HLS)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGB2HLS);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGB2HLS);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, RGB2HLS4)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGB2HLS, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGB2HLS);

    alvision.Mat h_dst(dst);

    alvision.Mat channels[4];
    alvision.split(h_dst, channels);
    alvision.merge(channels, 3, h_dst);

    EXPECT_MAT_NEAR(dst_gold, h_dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, RGBA2HLS4)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2RGBA);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGB2HLS, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGB2HLS);

    alvision.Mat h_dst(dst);

    alvision.Mat channels[4];
    alvision.split(h_dst, channels);
    alvision.merge(channels, 3, h_dst);

    EXPECT_MAT_NEAR(dst_gold, h_dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, HSV2BGR)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2HSV);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_HSV2BGR);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_HSV2BGR);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, HSV2RGB)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2HSV);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_HSV2RGB);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_HSV2RGB);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, HSV42BGR)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2HSV);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_HSV2BGR);

    alvision.Mat channels[4];
    alvision.split(src, channels);
    channels[3] = alvision.Mat(src.size(), depth, alvision.alvision.Scalar.all(0));
    alvision.merge(channels, 4, src);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_HSV2BGR);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, HSV42BGRA)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2HSV);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_HSV2BGR, 4);

    alvision.Mat channels[4];
    alvision.split(src, channels);
    channels[3] = alvision.Mat(src.size(), depth, alvision.alvision.Scalar.all(0));
    alvision.merge(channels, 4, src);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_HSV2BGR, 4);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, HLS2BGR)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2HLS);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_HLS2BGR);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_HLS2BGR);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, HLS2RGB)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2HLS);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_HLS2RGB);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_HLS2RGB);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, HLS42RGB)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2HLS);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_HLS2RGB);

    alvision.Mat channels[4];
    alvision.split(src, channels);
    channels[3] = alvision.Mat(src.size(), depth, alvision.alvision.Scalar.all(0));
    alvision.merge(channels, 4, src);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_HLS2RGB);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, HLS42RGBA)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2HLS);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_HLS2RGB, 4);

    alvision.Mat channels[4];
    alvision.split(src, channels);
    channels[3] = alvision.Mat(src.size(), depth, alvision.alvision.Scalar.all(0));
    alvision.merge(channels, 4, src);


    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_HLS2RGB, 4);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, BGR2HSV_FULL)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2HSV_FULL);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2HSV_FULL);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, RGB2HSV_FULL)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGB2HSV_FULL);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGB2HSV_FULL);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, RGB2HSV4_FULL)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGB2HSV_FULL, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGB2HSV_FULL);

    alvision.Mat h_dst(dst);

    alvision.Mat channels[4];
    alvision.split(h_dst, channels);
    alvision.merge(channels, 3, h_dst);

    EXPECT_MAT_NEAR(dst_gold, h_dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, RGBA2HSV4_FULL)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2RGBA);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGB2HSV_FULL, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGB2HSV_FULL);

    alvision.Mat h_dst(dst);

    alvision.Mat channels[4];
    alvision.split(h_dst, channels);
    alvision.merge(channels, 3, h_dst);

    EXPECT_MAT_NEAR(dst_gold, h_dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, BGR2HLS_FULL)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2HLS_FULL);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2HLS_FULL);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, RGB2HLS_FULL)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGB2HLS_FULL);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGB2HLS_FULL);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, RGB2HLS4_FULL)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGB2HLS_FULL, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGB2HLS_FULL);

    alvision.Mat h_dst(dst);

    alvision.Mat channels[4];
    alvision.split(h_dst, channels);
    alvision.merge(channels, 3, h_dst);

    EXPECT_MAT_NEAR(dst_gold, h_dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, RGBA2HLS4_FULL)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2RGBA);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGB2HLS_FULL, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGB2HLS_FULL);

    alvision.Mat h_dst(dst);

    alvision.Mat channels[4];
    alvision.split(h_dst, channels);
    alvision.merge(channels, 3, h_dst);

    EXPECT_MAT_NEAR(dst_gold, h_dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, HSV2BGR_FULL)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2HSV_FULL);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_HSV2BGR_FULL);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_HSV2BGR_FULL);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, HSV2RGB_FULL)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2HSV_FULL);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_HSV2RGB_FULL);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_HSV2RGB_FULL);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, HSV42RGB_FULL)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2HSV_FULL);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_HSV2RGB_FULL);

    alvision.Mat channels[4];
    alvision.split(src, channels);
    channels[3] = alvision.Mat(src.size(), depth, alvision.alvision.Scalar.all(0));
    alvision.merge(channels, 4, src);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_HSV2RGB_FULL);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, HSV42RGBA_FULL)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2HSV_FULL);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_HSV2RGB_FULL, 4);

    alvision.Mat channels[4];
    alvision.split(src, channels);
    channels[3] = alvision.Mat(src.size(), depth, alvision.alvision.Scalar.all(0));
    alvision.merge(channels, 4, src);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_HSV2RGB_FULL, 4);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, HLS2BGR_FULL)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2HLS_FULL);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_HLS2BGR_FULL);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_HLS2BGR_FULL);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, HLS2RGB_FULL)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2HLS_FULL);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_HLS2RGB_FULL);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_HLS2RGB_FULL);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, HLS42RGB_FULL)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2HLS_FULL);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_HLS2RGB_FULL);

    alvision.Mat channels[4];
    alvision.split(src, channels);
    channels[3] = alvision.Mat(src.size(), depth, alvision.alvision.Scalar.all(0));
    alvision.merge(channels, 4, src);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_HLS2RGB_FULL);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, HLS42RGBA_FULL)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2HLS_FULL);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_HLS2RGB_FULL, 4);

    alvision.Mat channels[4];
    alvision.split(src, channels);
    channels[3] = alvision.Mat(src.size(), depth, alvision.alvision.Scalar.all(0));
    alvision.merge(channels, 4, src);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_HLS2RGB_FULL, 4);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_32F ? 1e-2 : 1);
}

CUDA_TEST_P(CvtColor, BGR2YUV)
{
    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2YUV);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2YUV);

    EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
}

CUDA_TEST_P(CvtColor, RGB2YUV)
{
    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGB2YUV);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGB2YUV);

    EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
}

CUDA_TEST_P(CvtColor, YUV2BGR)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2YUV);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_YUV2BGR);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_YUV2BGR);

    EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
}

CUDA_TEST_P(CvtColor, YUV42BGR)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2YUV);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_YUV2BGR);

    alvision.Mat channels[4];
    alvision.split(src, channels);
    channels[3] = alvision.Mat(src.size(), depth, alvision.alvision.Scalar.all(0));
    alvision.merge(channels, 4, src);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_YUV2BGR);

    EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
}

CUDA_TEST_P(CvtColor, YUV42BGRA)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2YUV);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_YUV2BGR, 4);

    alvision.Mat channels[4];
    alvision.split(src, channels);
    channels[3] = alvision.Mat(src.size(), depth, alvision.alvision.Scalar.all(0));
    alvision.merge(channels, 4, src);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_YUV2BGR, 4);

    EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
}

CUDA_TEST_P(CvtColor, YUV2RGB)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_RGB2YUV);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_YUV2RGB);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_YUV2RGB);

    EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
}

CUDA_TEST_P(CvtColor, BGR2YUV4)
{
    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2YUV, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2YUV);

    alvision.Mat h_dst(dst);

    alvision.Mat channels[4];
    alvision.split(h_dst, channels);
    alvision.merge(channels, 3, h_dst);

    EXPECT_MAT_NEAR(dst_gold, h_dst, 1e-5);
}

CUDA_TEST_P(CvtColor, RGBA2YUV4)
{
    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2RGBA);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGB2YUV, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGB2YUV);

    alvision.Mat h_dst(dst);

    alvision.Mat channels[4];
    alvision.split(h_dst, channels);
    alvision.merge(channels, 3, h_dst);

    EXPECT_MAT_NEAR(dst_gold, h_dst, 1e-5);
}

CUDA_TEST_P(CvtColor, BGR2Lab)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2Lab);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2Lab);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_8U ? 1 : 1e-3);
}

CUDA_TEST_P(CvtColor, RGB2Lab)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGB2Lab);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGB2Lab);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_8U ? 1 : 1e-3);
}

CUDA_TEST_P(CvtColor, BGRA2Lab4)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2RGBA);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2Lab, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2Lab);

    alvision.Mat h_dst(dst);

    alvision.Mat channels[4];
    alvision.split(h_dst, channels);
    alvision.merge(channels, 3, h_dst);

    EXPECT_MAT_NEAR(dst_gold, h_dst, depth == CV_8U ? 1 : 1e-3);
}

CUDA_TEST_P(CvtColor, LBGR2Lab)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_LBGR2Lab);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_LBGR2Lab);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_8U ? 1 : 1e-3);
}

CUDA_TEST_P(CvtColor, LRGB2Lab)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_LRGB2Lab);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_LRGB2Lab);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_8U ? 1 : 1e-3);
}

CUDA_TEST_P(CvtColor, LBGRA2Lab4)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2RGBA);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_LBGR2Lab, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_LBGR2Lab);

    alvision.Mat h_dst(dst);

    alvision.Mat channels[4];
    alvision.split(h_dst, channels);
    alvision.merge(channels, 3, h_dst);

    EXPECT_MAT_NEAR(dst_gold, h_dst, depth == CV_8U ? 1 : 1e-3);
}

CUDA_TEST_P(CvtColor, Lab2BGR)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2Lab);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_Lab2BGR);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_Lab2BGR);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_8U ? 1 : 1e-5);
}

CUDA_TEST_P(CvtColor, Lab2RGB)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2Lab);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_Lab2RGB);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_Lab2RGB);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_8U ? 1 : 1e-5);
}

CUDA_TEST_P(CvtColor, Lab2BGRA)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2Lab);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_Lab2BGR, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_Lab2BGR, 4);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_8U ? 1 : 1e-5);
}

CUDA_TEST_P(CvtColor, Lab2LBGR)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2Lab);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_Lab2LBGR);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_Lab2LBGR);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_8U ? 1 : 1e-5);
}

CUDA_TEST_P(CvtColor, Lab2LRGB)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2Lab);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_Lab2LRGB);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_Lab2LRGB);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_8U ? 1 : 1e-5);
}

CUDA_TEST_P(CvtColor, Lab2LRGBA)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2Lab);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_Lab2LRGB, 4);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_Lab2LRGB, 4);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_8U ? 1 : 1e-5);
}

CUDA_TEST_P(CvtColor, BGR2Luv)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2Luv);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2Luv);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_8U ? 1 : 1e-3);
}

CUDA_TEST_P(CvtColor, RGB2Luv)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGB2Luv);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGB2Luv);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_8U ? 1 : 1e-3);
}

CUDA_TEST_P(CvtColor, BGRA2Luv4)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2RGBA);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BGR2Luv, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGR2Luv);

    alvision.Mat h_dst(dst);

    alvision.Mat channels[4];
    alvision.split(h_dst, channels);
    alvision.merge(channels, 3, h_dst);

    EXPECT_MAT_NEAR(dst_gold, h_dst, depth == CV_8U ? 1 : 1e-3);
}

CUDA_TEST_P(CvtColor, LBGR2Luv)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_LBGR2Luv);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_LBGR2Luv);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_8U ? 1 : 1e-3);
}

CUDA_TEST_P(CvtColor, LRGB2Luv)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src = img;

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_LRGB2Luv);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_LRGB2Luv);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_8U ? 1 : 1e-3);
}

CUDA_TEST_P(CvtColor, LBGRA2Luv4)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2RGBA);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_LBGR2Luv, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_LBGR2Luv);

    alvision.Mat h_dst(dst);

    alvision.Mat channels[4];
    alvision.split(h_dst, channels);
    alvision.merge(channels, 3, h_dst);

    EXPECT_MAT_NEAR(dst_gold, h_dst, depth == CV_8U ? 1 : 1e-3);
}

CUDA_TEST_P(CvtColor, Luv2BGR)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2Luv);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_Luv2BGR);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_Luv2BGR);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_8U ? 1 : 1e-4);
}

CUDA_TEST_P(CvtColor, Luv2RGB)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2Luv);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_Luv2RGB);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_Luv2RGB);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_8U ? 1 : 1e-4);
}

CUDA_TEST_P(CvtColor, Luv2BGRA)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2Luv);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_Luv2BGR, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_Luv2BGR, 4);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_8U ? 1 : 1e-4);
}

CUDA_TEST_P(CvtColor, Luv2LBGR)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2Luv);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_Luv2LBGR);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_Luv2LBGR);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_8U ? 1 : 1e-4);
}

CUDA_TEST_P(CvtColor, Luv2LRGB)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2Luv);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_Luv2LRGB);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_Luv2LRGB);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_8U ? 1 : 1e-4);
}

CUDA_TEST_P(CvtColor, Luv2LRGBA)
{
    if (depth == CV_16U)
        return;

    alvision.Mat src;
    alvision.cvtColor(img, src, alvision.COLOR_BGR2Luv);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_Luv2LRGB, 4);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_Luv2LRGB, 4);

    EXPECT_MAT_NEAR(dst_gold, dst, depth == CV_8U ? 1 : 1e-4);
}

#if defined (CUDA_VERSION) && (CUDA_VERSION >= 5000)

CUDA_TEST_P(CvtColor, RGBA2mRGBA)
{
    if (depth != CV_8U)
        return;

    alvision.Mat src = randomMat(size, CV_MAKE_TYPE(depth, 4));

    alvision.cuda::GpuMat dst = createMat(src.size(), src.type(), useRoi);
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_RGBA2mRGBA);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_RGBA2mRGBA);

    EXPECT_MAT_NEAR(dst_gold, dst, 1);
}

#endif // defined (CUDA_VERSION) && (CUDA_VERSION >= 5000)

CUDA_TEST_P(CvtColor, BayerBG2BGR)
{
    if ((depth != CV_8U && depth != CV_16U) || useRoi)
        return;

    alvision.Mat src = randomMat(size, depth);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BayerBG2BGR);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BayerBG2BGR);

    EXPECT_MAT_NEAR(dst_gold(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), dst(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), 0);
}

CUDA_TEST_P(CvtColor, BayerBG2BGR4)
{
    if ((depth != CV_8U && depth != CV_16U) || useRoi)
        return;

    alvision.Mat src = randomMat(size, depth);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BayerBG2BGR, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BayerBG2BGR);

    alvision.Mat dst4(dst);
    alvision.Mat dst3;
    alvision.cvtColor(dst4, dst3, alvision.COLOR_BGRA2BGR);


    EXPECT_MAT_NEAR(dst_gold(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), dst3(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), 0);
}

CUDA_TEST_P(CvtColor, BayerGB2BGR)
{
    if ((depth != CV_8U && depth != CV_16U) || useRoi)
        return;

    alvision.Mat src = randomMat(size, depth);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BayerGB2BGR);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BayerGB2BGR);

    EXPECT_MAT_NEAR(dst_gold(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), dst(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), 0);
}

CUDA_TEST_P(CvtColor, BayerGB2BGR4)
{
    if ((depth != CV_8U && depth != CV_16U) || useRoi)
        return;

    alvision.Mat src = randomMat(size, depth);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BayerGB2BGR, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BayerGB2BGR);

    alvision.Mat dst4(dst);
    alvision.Mat dst3;
    alvision.cvtColor(dst4, dst3, alvision.COLOR_BGRA2BGR);

    EXPECT_MAT_NEAR(dst_gold(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), dst3(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), 0);
}

CUDA_TEST_P(CvtColor, BayerRG2BGR)
{
    if ((depth != CV_8U && depth != CV_16U) || useRoi)
        return;

    alvision.Mat src = randomMat(size, depth);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BayerRG2BGR);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BayerRG2BGR);

    EXPECT_MAT_NEAR(dst_gold(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), dst(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), 0);
}

CUDA_TEST_P(CvtColor, BayerRG2BGR4)
{
    if ((depth != CV_8U && depth != CV_16U) || useRoi)
        return;

    alvision.Mat src = randomMat(size, depth);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BayerRG2BGR, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BayerRG2BGR);

    alvision.Mat dst4(dst);
    alvision.Mat dst3;
    alvision.cvtColor(dst4, dst3, alvision.COLOR_BGRA2BGR);

    EXPECT_MAT_NEAR(dst_gold(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), dst3(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), 0);
}

CUDA_TEST_P(CvtColor, BayerGR2BGR)
{
    if ((depth != CV_8U && depth != CV_16U) || useRoi)
        return;

    alvision.Mat src = randomMat(size, depth);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BayerGR2BGR);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BayerGR2BGR);

    EXPECT_MAT_NEAR(dst_gold(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), dst(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), 0);
}

CUDA_TEST_P(CvtColor, BayerGR2BGR4)
{
    if ((depth != CV_8U && depth != CV_16U) || useRoi)
        return;

    alvision.Mat src = randomMat(size, depth);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BayerGR2BGR, 4);

    ASSERT_EQ(4, dst.channels());

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BayerGR2BGR);

    alvision.Mat dst4(dst);
    alvision.Mat dst3;
    alvision.cvtColor(dst4, dst3, alvision.COLOR_BGRA2BGR);

    EXPECT_MAT_NEAR(dst_gold(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), dst3(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), 0);
}

CUDA_TEST_P(CvtColor, BayerBG2Gray)
{
    if ((depth != CV_8U && depth != CV_16U) || useRoi)
        return;

    alvision.Mat src = randomMat(size, depth);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BayerBG2GRAY);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BayerBG2GRAY);

    EXPECT_MAT_NEAR(dst_gold(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), dst(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), 2);
}

CUDA_TEST_P(CvtColor, BayerGB2Gray)
{
    if ((depth != CV_8U && depth != CV_16U) || useRoi)
        return;

    alvision.Mat src = randomMat(size, depth);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BayerGB2GRAY);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BayerGB2GRAY);

    EXPECT_MAT_NEAR(dst_gold(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), dst(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), 2);
}

CUDA_TEST_P(CvtColor, BayerRG2Gray)
{
    if ((depth != CV_8U && depth != CV_16U) || useRoi)
        return;

    alvision.Mat src = randomMat(size, depth);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BayerRG2GRAY);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BayerRG2GRAY);

    EXPECT_MAT_NEAR(dst_gold(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), dst(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), 2);
}

CUDA_TEST_P(CvtColor, BayerGR2Gray)
{
    if ((depth != CV_8U && depth != CV_16U) || useRoi)
        return;

    alvision.Mat src = randomMat(size, depth);

    alvision.cuda::GpuMat dst;
    alvision.cuda::cvtColor(loadMat(src, useRoi), dst, alvision.COLOR_BayerGR2GRAY);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BayerGR2GRAY);

    EXPECT_MAT_NEAR(dst_gold(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), dst(alvision.Rect(1, 1, dst.cols - 2, dst.rows - 2)), 2);
}

INSTANTIATE_TEST_CASE_P(CUDA_ImgProc, CvtColor, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    testing::Values(MatDepth(CV_8U), MatDepth(CV_16U), MatDepth(CV_32F)),
    WHOLE_SUBMAT));

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Demosaicing

struct Demosaicing : testing::TestWithParam<alvision.cuda::DeviceInfo>
{
    alvision.cuda::DeviceInfo devInfo;

    virtual void SetUp()
    {
        devInfo = GetParam();

        alvision.cuda::setDevice(devInfo.deviceID());
    }

    static void mosaic(const alvision.Mat_<alvision.Vec3b>& src, alvision.Mat_<uchar>& dst, alvision.Point firstRed)
    {
        dst.create(src.size());

        for (int y = 0; y < src.rows; ++y)
        {
            for (int x = 0; x < src.cols; ++x)
            {
                alvision.Vec3b pix = src(y, x);

                alvision.Point alternate;
                alternate.x = (x + firstRed.x) % 2;
                alternate.y = (y + firstRed.y) % 2;

                if (alternate.y == 0)
                {
                    if (alternate.x == 0)
                    {
                        // RG
                        // GB
                        dst(y, x) = pix[2];
                    }
                    else
                    {
                        // GR
                        // BG
                        dst(y, x) = pix[1];
                    }
                }
                else
                {
                    if (alternate.x == 0)
                    {
                        // GB
                        // RG
                        dst(y, x) = pix[1];
                    }
                    else
                    {
                        // BG
                        // GR
                        dst(y, x) = pix[0];
                    }
                }
            }
        }
    }
};

CUDA_TEST_P(Demosaicing, BayerBG2BGR)
{
    alvision.Mat img = readImage("stereobm/aloe-L.png");
    ASSERT_FALSE(img.empty()) << "Can't load input image";

    alvision.Mat_<uchar> src;
    mosaic(img, src, alvision.Point(1, 1));

    alvision.cuda::GpuMat dst;
    alvision.cuda::demosaicing(loadMat(src), dst, alvision.COLOR_BayerBG2BGR);

    EXPECT_MAT_SIMILAR(img, dst, 2e-2);
}

CUDA_TEST_P(Demosaicing, BayerGB2BGR)
{
    alvision.Mat img = readImage("stereobm/aloe-L.png");
    ASSERT_FALSE(img.empty()) << "Can't load input image";

    alvision.Mat_<uchar> src;
    mosaic(img, src, alvision.Point(0, 1));

    alvision.cuda::GpuMat dst;
    alvision.cuda::demosaicing(loadMat(src), dst, alvision.COLOR_BayerGB2BGR);

    EXPECT_MAT_SIMILAR(img, dst, 2e-2);
}

CUDA_TEST_P(Demosaicing, BayerRG2BGR)
{
    alvision.Mat img = readImage("stereobm/aloe-L.png");
    ASSERT_FALSE(img.empty()) << "Can't load input image";

    alvision.Mat_<uchar> src;
    mosaic(img, src, alvision.Point(0, 0));

    alvision.cuda::GpuMat dst;
    alvision.cuda::demosaicing(loadMat(src), dst, alvision.COLOR_BayerRG2BGR);

    EXPECT_MAT_SIMILAR(img, dst, 2e-2);
}

CUDA_TEST_P(Demosaicing, BayerGR2BGR)
{
    alvision.Mat img = readImage("stereobm/aloe-L.png");
    ASSERT_FALSE(img.empty()) << "Can't load input image";

    alvision.Mat_<uchar> src;
    mosaic(img, src, alvision.Point(1, 0));

    alvision.cuda::GpuMat dst;
    alvision.cuda::demosaicing(loadMat(src), dst, alvision.COLOR_BayerGR2BGR);

    EXPECT_MAT_SIMILAR(img, dst, 2e-2);
}

CUDA_TEST_P(Demosaicing, BayerBG2BGR_MHT)
{
    alvision.Mat img = readImage("stereobm/aloe-L.png");
    ASSERT_FALSE(img.empty()) << "Can't load input image";

    alvision.Mat_<uchar> src;
    mosaic(img, src, alvision.Point(1, 1));

    alvision.cuda::GpuMat dst;
    alvision.cuda::demosaicing(loadMat(src), dst, alvision.cuda::COLOR_BayerBG2BGR_MHT);

    EXPECT_MAT_SIMILAR(img, dst, 5e-3);
}

CUDA_TEST_P(Demosaicing, BayerGB2BGR_MHT)
{
    alvision.Mat img = readImage("stereobm/aloe-L.png");
    ASSERT_FALSE(img.empty()) << "Can't load input image";

    alvision.Mat_<uchar> src;
    mosaic(img, src, alvision.Point(0, 1));

    alvision.cuda::GpuMat dst;
    alvision.cuda::demosaicing(loadMat(src), dst, alvision.cuda::COLOR_BayerGB2BGR_MHT);

    EXPECT_MAT_SIMILAR(img, dst, 5e-3);
}

CUDA_TEST_P(Demosaicing, BayerRG2BGR_MHT)
{
    alvision.Mat img = readImage("stereobm/aloe-L.png");
    ASSERT_FALSE(img.empty()) << "Can't load input image";

    alvision.Mat_<uchar> src;
    mosaic(img, src, alvision.Point(0, 0));

    alvision.cuda::GpuMat dst;
    alvision.cuda::demosaicing(loadMat(src), dst, alvision.cuda::COLOR_BayerRG2BGR_MHT);

    EXPECT_MAT_SIMILAR(img, dst, 5e-3);
}

CUDA_TEST_P(Demosaicing, BayerGR2BGR_MHT)
{
    alvision.Mat img = readImage("stereobm/aloe-L.png");
    ASSERT_FALSE(img.empty()) << "Can't load input image";

    alvision.Mat_<uchar> src;
    mosaic(img, src, alvision.Point(1, 0));

    alvision.cuda::GpuMat dst;
    alvision.cuda::demosaicing(loadMat(src), dst, alvision.cuda::COLOR_BayerGR2BGR_MHT);

    EXPECT_MAT_SIMILAR(img, dst, 5e-3);
}

INSTANTIATE_TEST_CASE_P(CUDA_ImgProc, Demosaicing, ALL_DEVICES);

///////////////////////////////////////////////////////////////////////////////////////////////////////
// swapChannels

PARAM_TEST_CASE(SwapChannels, alvision.cuda::DeviceInfo, alvision.Size, UseRoi)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    bool useRoi;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        useRoi = GET_PARAM(2);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(SwapChannels, Accuracy)
{
    alvision.Mat src = readImageType("stereobm/aloe-L.png", CV_8UC4);
    ASSERT_FALSE(src.empty());

    alvision.cuda::GpuMat d_src = loadMat(src, useRoi);

    const int dstOrder[] = {2, 1, 0, 3};
    alvision.cuda::swapChannels(d_src, dstOrder);

    alvision.Mat dst_gold;
    alvision.cvtColor(src, dst_gold, alvision.COLOR_BGRA2RGBA);

    EXPECT_MAT_NEAR(dst_gold, d_src, 0.0);
}

INSTANTIATE_TEST_CASE_P(CUDA_ImgProc, SwapChannels, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    WHOLE_SUBMAT));

#endif // HAVE_CUDA
