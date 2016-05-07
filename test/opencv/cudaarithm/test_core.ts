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
// Merge

PARAM_TEST_CASE(Merge, alvision.cuda::DeviceInfo, alvision.Size, MatDepth, Channels, UseRoi)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    int depth;
    int channels;
    bool useRoi;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        depth = GET_PARAM(2);
        channels = GET_PARAM(3);
        useRoi = GET_PARAM(4);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(Merge, Accuracy)
{
    std::Array<alvision.Mat> src;
    src.reserve(channels);
    for (int i = 0; i < channels; ++i)
        src.push_back(alvision.Mat(size, depth, alvision.Scalar::all(i)));

    std::Array<alvision.cuda::GpuMat> d_src;
    for (int i = 0; i < channels; ++i)
        d_src.push_back(loadMat(src[i], useRoi));

    if (depth == CV_64F && !supportFeature(devInfo, alvision.cuda::NATIVE_DOUBLE))
    {
        try
        {
            alvision.cuda::GpuMat dst;
            alvision.cuda::merge(d_src, dst);
        }
        catch (const alvision.Exception& e)
        {
            ASSERT_EQ(alvision.Error::StsUnsupportedFormat, e.code);
        }
    }
    else
    {
        alvision.cuda::GpuMat dst;
        alvision.cuda::merge(d_src, dst);

        alvision.Mat dst_gold;
        alvision.merge(src, dst_gold);

        EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

INSTANTIATE_TEST_CASE_P(CUDA_Arithm, Merge, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    ALL_DEPTH,
    testing::Values(1, 2, 3, 4),
    WHOLE_SUBMAT));

////////////////////////////////////////////////////////////////////////////////
// Split

PARAM_TEST_CASE(Split, alvision.cuda::DeviceInfo, alvision.Size, MatDepth, Channels, UseRoi)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    int depth;
    int channels;
    bool useRoi;

    int type;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        depth = GET_PARAM(2);
        channels = GET_PARAM(3);
        useRoi = GET_PARAM(4);

        alvision.cuda::setDevice(devInfo.deviceID());

        type = CV_MAKE_TYPE(depth, channels);
    }
};

CUDA_TEST_P(Split, Accuracy)
{
    alvision.Mat src = randomMat(size, type);

    if (depth == CV_64F && !supportFeature(devInfo, alvision.cuda::NATIVE_DOUBLE))
    {
        try
        {
            std::Array<alvision.cuda::GpuMat> dst;
            alvision.cuda::split(loadMat(src), dst);
        }
        catch (const alvision.Exception& e)
        {
            ASSERT_EQ(alvision.Error::StsUnsupportedFormat, e.code);
        }
    }
    else
    {
        std::Array<alvision.cuda::GpuMat> dst;
        alvision.cuda::split(loadMat(src, useRoi), dst);

        std::Array<alvision.Mat> dst_gold;
        alvision.split(src, dst_gold);

        ASSERT_EQ(dst_gold.size(), dst.size());

        for (size_t i = 0; i < dst_gold.size(); ++i)
        {
            EXPECT_MAT_NEAR(dst_gold[i], dst[i], 0.0);
        }
    }
}

INSTANTIATE_TEST_CASE_P(CUDA_Arithm, Split, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    ALL_DEPTH,
    testing::Values(1, 2, 3, 4),
    WHOLE_SUBMAT));

////////////////////////////////////////////////////////////////////////////////
// Transpose

PARAM_TEST_CASE(Transpose, alvision.cuda::DeviceInfo, alvision.Size, MatType, UseRoi)
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

CUDA_TEST_P(Transpose, Accuracy)
{
    alvision.Mat src = randomMat(size, type);

    if (CV_MAT_DEPTH(type) == CV_64F && !supportFeature(devInfo, alvision.cuda::NATIVE_DOUBLE))
    {
        try
        {
            alvision.cuda::GpuMat dst;
            alvision.cuda::transpose(loadMat(src), dst);
        }
        catch (const alvision.Exception& e)
        {
            ASSERT_EQ(alvision.Error::StsUnsupportedFormat, e.code);
        }
    }
    else
    {
        alvision.cuda::GpuMat dst = createMat(alvision.Size(size.height, size.width), type, useRoi);
        alvision.cuda::transpose(loadMat(src, useRoi), dst);

        alvision.Mat dst_gold;
        alvision.transpose(src, dst_gold);

        EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

INSTANTIATE_TEST_CASE_P(CUDA_Arithm, Transpose, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    testing::Values(MatType(CV_8UC1),
                    MatType(CV_8UC4),
                    MatType(CV_16UC2),
                    MatType(CV_16SC2),
                    MatType(CV_32SC1),
                    MatType(CV_32SC2),
                    MatType(CV_64FC1)),
    WHOLE_SUBMAT));

////////////////////////////////////////////////////////////////////////////////
// Flip

enum {FLIP_BOTH = 0, FLIP_X = 1, FLIP_Y = -1};
CV_ENUM(FlipCode, FLIP_BOTH, FLIP_X, FLIP_Y)
#define ALL_FLIP_CODES testing::Values(FlipCode(FLIP_BOTH), FlipCode(FLIP_X), FlipCode(FLIP_Y))

PARAM_TEST_CASE(Flip, alvision.cuda::DeviceInfo, alvision.Size, MatType, FlipCode, UseRoi)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    int type;
    int flip_code;
    bool useRoi;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        type = GET_PARAM(2);
        flip_code = GET_PARAM(3);
        useRoi = GET_PARAM(4);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(Flip, Accuracy)
{
    alvision.Mat src = randomMat(size, type);

    alvision.cuda::GpuMat dst = createMat(size, type, useRoi);
    alvision.cuda::flip(loadMat(src, useRoi), dst, flip_code);

    alvision.Mat dst_gold;
    alvision.flip(src, dst_gold, flip_code);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

INSTANTIATE_TEST_CASE_P(CUDA_Arithm, Flip, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    testing::Values(MatType(CV_8UC1),
                    MatType(CV_8UC3),
                    MatType(CV_8UC4),
                    MatType(CV_16UC1),
                    MatType(CV_16UC3),
                    MatType(CV_16UC4),
                    MatType(CV_32SC1),
                    MatType(CV_32SC3),
                    MatType(CV_32SC4),
                    MatType(CV_32FC1),
                    MatType(CV_32FC3),
                    MatType(CV_32FC4)),
    ALL_FLIP_CODES,
    WHOLE_SUBMAT));

////////////////////////////////////////////////////////////////////////////////
// LUT

PARAM_TEST_CASE(LUT, alvision.cuda::DeviceInfo, alvision.Size, MatType, UseRoi)
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

CUDA_TEST_P(LUT, OneChannel)
{
    alvision.Mat src = randomMat(size, type);
    alvision.Mat lut = randomMat(alvision.Size(256, 1), CV_8UC1);

    alvision.Ptr<alvision.cuda::LookUpTable> lutAlg = alvision.cuda::createLookUpTable(lut);

    alvision.cuda::GpuMat dst = createMat(size, CV_MAKE_TYPE(lut.depth(), src.channels()));
    lutAlg->transform(loadMat(src, useRoi), dst);

    alvision.Mat dst_gold;
    alvision.LUT(src, lut, dst_gold);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

CUDA_TEST_P(LUT, MultiChannel)
{
    alvision.Mat src = randomMat(size, type);
    alvision.Mat lut = randomMat(alvision.Size(256, 1), CV_MAKE_TYPE(CV_8U, src.channels()));

    alvision.Ptr<alvision.cuda::LookUpTable> lutAlg = alvision.cuda::createLookUpTable(lut);

    alvision.cuda::GpuMat dst = createMat(size, CV_MAKE_TYPE(lut.depth(), src.channels()), useRoi);
    lutAlg->transform(loadMat(src, useRoi), dst);

    alvision.Mat dst_gold;
    alvision.LUT(src, lut, dst_gold);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

INSTANTIATE_TEST_CASE_P(CUDA_Arithm, LUT, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    testing::Values(MatType(CV_8UC1), MatType(CV_8UC3)),
    WHOLE_SUBMAT));

//////////////////////////////////////////////////////////////////////////////
// CopyMakeBorder

namespace
{
    IMPLEMENT_PARAM_CLASS(Border, int)
}

PARAM_TEST_CASE(CopyMakeBorder, alvision.cuda::DeviceInfo, alvision.Size, MatType, Border, BorderType, UseRoi)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    int type;
    int border;
    int borderType;
    bool useRoi;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        type = GET_PARAM(2);
        border = GET_PARAM(3);
        borderType = GET_PARAM(4);
        useRoi = GET_PARAM(5);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(CopyMakeBorder, Accuracy)
{
    alvision.Mat src = randomMat(size, type);
    alvision.Scalar val = randomScalar(0, 255);

    alvision.cuda::GpuMat dst = createMat(alvision.Size(size.width + 2 * border, size.height + 2 * border), type, useRoi);
    alvision.cuda::copyMakeBorder(loadMat(src, useRoi), dst, border, border, border, border, borderType, val);

    alvision.Mat dst_gold;
    alvision.copyMakeBorder(src, dst_gold, border, border, border, border, borderType, val);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

INSTANTIATE_TEST_CASE_P(CUDA_Arithm, CopyMakeBorder, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    testing::Values(MatType(CV_8UC1),
                    MatType(CV_8UC3),
                    MatType(CV_8UC4),
                    MatType(CV_16UC1),
                    MatType(CV_16UC3),
                    MatType(CV_16UC4),
                    MatType(CV_32FC1),
                    MatType(CV_32FC3),
                    MatType(CV_32FC4)),
    testing::Values(Border(1), Border(10), Border(50)),
    ALL_BORDER_TYPES,
    WHOLE_SUBMAT));

#endif // HAVE_CUDA
