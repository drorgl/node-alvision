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

#include "opencv2/core/cuda.hpp"
#include "opencv2/ts/cuda_test.hpp"

using namespace cvtest;

////////////////////////////////////////////////////////////////////////////////
// SetTo

PARAM_TEST_CASE(GpuMat_SetTo, alvision.cuda::DeviceInfo, alvision.Size, MatType, UseRoi)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    int type;
    bool useRoi;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        type = GET_PARAM(2);
        useRoi = GET_PARAM(3);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(GpuMat_SetTo, Zero)
{
    alvision.Scalar zero = alvision.alvision.Scalar.all(0);

    alvision.cuda::GpuMat mat = createMat(size, type, useRoi);
    mat.setTo(zero);

    EXPECT_MAT_NEAR(alvision.Mat::zeros(size, type), mat, 0.0);
}

CUDA_TEST_P(GpuMat_SetTo, SameVal)
{
    alvision.Scalar val = alvision.Scalar::all(randomDouble(0.0, 255.0));

    if (CV_MAT_DEPTH(type) == CV_64F && !supportFeature(devInfo, alvision.cuda::NATIVE_DOUBLE))
    {
        try
        {
            alvision.cuda::GpuMat mat = createMat(size, type, useRoi);
            mat.setTo(val);
        }
        catch(e)
        {
            ASSERT_EQ(alvision.Error::StsUnsupportedFormat, e.code);
        }
    }
    else
    {
        alvision.cuda::GpuMat mat = createMat(size, type, useRoi);
        mat.setTo(val);

        EXPECT_MAT_NEAR(alvision.Mat(size, type, val), mat, 0.0);
    }
}

CUDA_TEST_P(GpuMat_SetTo, DifferentVal)
{
    alvision.Scalar val = randomScalar(0.0, 255.0);

    if (CV_MAT_DEPTH(type) == CV_64F && !supportFeature(devInfo, alvision.cuda::NATIVE_DOUBLE))
    {
        try
        {
            alvision.cuda::GpuMat mat = createMat(size, type, useRoi);
            mat.setTo(val);
        }
        catch(e)
        {
            ASSERT_EQ(alvision.Error::StsUnsupportedFormat, e.code);
        }
    }
    else
    {
        alvision.cuda::GpuMat mat = createMat(size, type, useRoi);
        mat.setTo(val);

        EXPECT_MAT_NEAR(alvision.Mat(size, type, val), mat, 0.0);
    }
}

CUDA_TEST_P(GpuMat_SetTo, Masked)
{
    alvision.Scalar val = randomScalar(0.0, 255.0);
    alvision.Mat mat_gold = randomMat(size, type);
    alvision.Mat mask = randomMat(size, CV_8UC1, 0.0, 2.0);

    if (CV_MAT_DEPTH(type) == CV_64F && !supportFeature(devInfo, alvision.cuda::NATIVE_DOUBLE))
    {
        try
        {
            alvision.cuda::GpuMat mat = createMat(size, type, useRoi);
            mat.setTo(val, loadMat(mask));
        }
        catch(e)
        {
            ASSERT_EQ(alvision.Error::StsUnsupportedFormat, e.code);
        }
    }
    else
    {
        alvision.cuda::GpuMat mat = loadMat(mat_gold, useRoi);
        mat.setTo(val, loadMat(mask, useRoi));

        mat_gold.setTo(val, mask);

        EXPECT_MAT_NEAR(mat_gold, mat, 0.0);
    }
}

INSTANTIATE_TEST_CASE_P(CUDA, GpuMat_SetTo, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    ALL_TYPES,
    WHOLE_SUBMAT));

////////////////////////////////////////////////////////////////////////////////
// CopyTo

PARAM_TEST_CASE(GpuMat_CopyTo, alvision.cuda::DeviceInfo, alvision.Size, MatType, UseRoi)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    int type;
    bool useRoi;


    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        type = GET_PARAM(2);
        useRoi = GET_PARAM(3);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(GpuMat_CopyTo, WithOutMask)
{
    alvision.Mat src = randomMat(size, type);

    alvision.cuda::GpuMat d_src = loadMat(src, useRoi);
    alvision.cuda::GpuMat dst = createMat(size, type, useRoi);
    d_src.copyTo(dst);

    EXPECT_MAT_NEAR(src, dst, 0.0);
}

CUDA_TEST_P(GpuMat_CopyTo, Masked)
{
    alvision.Mat src = randomMat(size, type);
    alvision.Mat mask = randomMat(size, CV_8UC1, 0.0, 2.0);

    if (CV_MAT_DEPTH(type) == CV_64F && !supportFeature(devInfo, alvision.cuda::NATIVE_DOUBLE))
    {
        try
        {
            alvision.cuda::GpuMat d_src = loadMat(src);
            alvision.cuda::GpuMat dst;
            d_src.copyTo(dst, loadMat(mask, useRoi));
        }
        catch(e)
        {
            ASSERT_EQ(alvision.Error::StsUnsupportedFormat, e.code);
        }
    }
    else
    {
        alvision.cuda::GpuMat d_src = loadMat(src, useRoi);
        alvision.cuda::GpuMat dst = loadMat(alvision.Mat::zeros(size, type), useRoi);
        d_src.copyTo(dst, loadMat(mask, useRoi));

        alvision.Mat dst_gold = alvision.Mat::zeros(size, type);
        src.copyTo(dst_gold, mask);

        EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

INSTANTIATE_TEST_CASE_P(CUDA, GpuMat_CopyTo, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    ALL_TYPES,
    WHOLE_SUBMAT));

////////////////////////////////////////////////////////////////////////////////
// ConvertTo

PARAM_TEST_CASE(GpuMat_ConvertTo, alvision.cuda::DeviceInfo, alvision.Size, MatDepth, MatDepth, UseRoi)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    int depth1;
    int depth2;
    bool useRoi;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        depth1 = GET_PARAM(2);
        depth2 = GET_PARAM(3);
        useRoi = GET_PARAM(4);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(GpuMat_ConvertTo, WithOutScaling)
{
    alvision.Mat src = randomMat(size, depth1);

    if ((depth1 == CV_64F || depth2 == CV_64F) && !supportFeature(devInfo, alvision.cuda::NATIVE_DOUBLE))
    {
        try
        {
            alvision.cuda::GpuMat d_src = loadMat(src);
            alvision.cuda::GpuMat dst;
            d_src.convertTo(dst, depth2);
        }
        catch(e)
        {
            ASSERT_EQ(alvision.Error::StsUnsupportedFormat, e.code);
        }
    }
    else
    {
        alvision.cuda::GpuMat d_src = loadMat(src, useRoi);
        alvision.cuda::GpuMat dst = createMat(size, depth2, useRoi);
        d_src.convertTo(dst, depth2);

        alvision.Mat dst_gold;
        src.convertTo(dst_gold, depth2);

        EXPECT_MAT_NEAR(dst_gold, dst, depth2 < CV_32F ? 1.0 : 1e-4);
    }
}

CUDA_TEST_P(GpuMat_ConvertTo, WithScaling)
{
    alvision.Mat src = randomMat(size, depth1);
    double a = randomDouble(0.0, 1.0);
    double b = randomDouble(-10.0, 10.0);

    if ((depth1 == CV_64F || depth2 == CV_64F) && !supportFeature(devInfo, alvision.cuda::NATIVE_DOUBLE))
    {
        try
        {
            alvision.cuda::GpuMat d_src = loadMat(src);
            alvision.cuda::GpuMat dst;
            d_src.convertTo(dst, depth2, a, b);
        }
        catch(e)
        {
            ASSERT_EQ(alvision.Error::StsUnsupportedFormat, e.code);
        }
    }
    else
    {
        alvision.cuda::GpuMat d_src = loadMat(src, useRoi);
        alvision.cuda::GpuMat dst = createMat(size, depth2, useRoi);
        d_src.convertTo(dst, depth2, a, b);

        alvision.Mat dst_gold;
        src.convertTo(dst_gold, depth2, a, b);

        EXPECT_MAT_NEAR(dst_gold, dst, depth2 < CV_32F ? 1.0 : 1e-4);
    }
}

INSTANTIATE_TEST_CASE_P(CUDA, GpuMat_ConvertTo, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    ALL_DEPTH,
    ALL_DEPTH,
    WHOLE_SUBMAT));

////////////////////////////////////////////////////////////////////////////////
// ensureSizeIsEnough

struct EnsureSizeIsEnough : testing::TestWithParam<alvision.cuda::DeviceInfo>
{
    virtual void SetUp()
    {
        alvision.cuda::DeviceInfo devInfo = GetParam();
        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(EnsureSizeIsEnough, BufferReuse)
{
    alvision.cuda::GpuMat buffer(100, 100, CV_8U);
    alvision.cuda::GpuMat old = buffer;

    // don't reallocate memory
    alvision.cuda::ensureSizeIsEnough(10, 20, CV_8U, buffer);
    EXPECT_EQ(10, buffer.rows);
    EXPECT_EQ(20, buffer.cols);
    EXPECT_EQ(CV_8UC1, buffer.type());
    EXPECT_EQ(reinterpret_cast<intptr_t>(old.data), reinterpret_cast<intptr_t>(buffer.data));

    // don't reallocate memory
    alvision.cuda::ensureSizeIsEnough(20, 30, CV_8U, buffer);
    EXPECT_EQ(20, buffer.rows);
    EXPECT_EQ(30, buffer.cols);
    EXPECT_EQ(CV_8UC1, buffer.type());
    EXPECT_EQ(reinterpret_cast<intptr_t>(old.data), reinterpret_cast<intptr_t>(buffer.data));
}

INSTANTIATE_TEST_CASE_P(CUDA, EnsureSizeIsEnough, ALL_DEVICES);

#endif // HAVE_CUDA
