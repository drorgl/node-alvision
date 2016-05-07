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

namespace
{
    alvision.Mat createTransfomMatrix(alvision.Size srcSize, double angle)
    {
        alvision.Mat M(3, 3, CV_64FC1);

        M.at<double>(0, 0) = std::cos(angle); M.at<double>(0, 1) = -std::sin(angle); M.at<double>(0, 2) = srcSize.width / 2;
        M.at<double>(1, 0) = std::sin(angle); M.at<double>(1, 1) =  std::cos(angle); M.at<double>(1, 2) = 0.0;
        M.at<double>(2, 0) = 0.0            ; M.at<double>(2, 1) =  0.0            ; M.at<double>(2, 2) = 1.0;

        return M;
    }
}

///////////////////////////////////////////////////////////////////
// Test buildWarpPerspectiveMaps

PARAM_TEST_CASE(BuildWarpPerspectiveMaps, alvision.cuda::DeviceInfo, alvision.Size, Inverse)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    bool inverse;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        inverse = GET_PARAM(2);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(BuildWarpPerspectiveMaps, Accuracy)
{
    alvision.Mat M = createTransfomMatrix(size, Math.PI / 4);

    alvision.cuda::GpuMat xmap, ymap;
    alvision.cuda::buildWarpPerspectiveMaps(M, inverse, size, xmap, ymap);

    alvision.Mat src = randomMat(randomSize(200, 400), CV_8UC1);
    int interpolation = alvision.INTER_NEAREST;
    int borderMode = alvision.BORDER_CONSTANT;
    int flags = interpolation;
    if (inverse)
        flags |= alvision.WARP_INVERSE_MAP;

    alvision.Mat dst;
    alvision.remap(src, dst, alvision.Mat(xmap), alvision.Mat(ymap), interpolation, borderMode);

    alvision.Mat dst_gold;
    alvision.warpPerspective(src, dst_gold, M, size, flags, borderMode);

    EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
}

INSTANTIATE_TEST_CASE_P(CUDA_Warping, BuildWarpPerspectiveMaps, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    DIRECT_INVERSE));

///////////////////////////////////////////////////////////////////
// Gold implementation

namespace
{
    template <typename T, template <typename> class Interpolator> void warpPerspectiveImpl(const alvision.Mat& src, const alvision.Mat& M, alvision.Size dsize, alvision.Mat& dst, int borderType, alvision.Scalar borderVal)
    {
        const int cn = src.channels();

        dst.create(dsize, src.type());

        for (int y = 0; y < dsize.height; ++y)
        {
            for (int x = 0; x < dsize.width; ++x)
            {
                float coeff = static_cast<float>(M.at<double>(2, 0) * x + M.at<double>(2, 1) * y + M.at<double>(2, 2));

                float xcoo = static_cast<float>((M.at<double>(0, 0) * x + M.at<double>(0, 1) * y + M.at<double>(0, 2)) / coeff);
                float ycoo = static_cast<float>((M.at<double>(1, 0) * x + M.at<double>(1, 1) * y + M.at<double>(1, 2)) / coeff);

                for (int c = 0; c < cn; ++c)
                    dst.at<T>(y, x * cn + c) = Interpolator<T>::getValue(src, ycoo, xcoo, c, borderType, borderVal);
            }
        }
    }

    void warpPerspectiveGold(const alvision.Mat& src, const alvision.Mat& M, bool inverse, alvision.Size dsize, alvision.Mat& dst, int interpolation, int borderType, alvision.Scalar borderVal)
    {
        typedef void (*func_t)(const alvision.Mat& src, const alvision.Mat& M, alvision.Size dsize, alvision.Mat& dst, int borderType, alvision.Scalar borderVal);

        static const func_t nearest_funcs[] =
        {
            warpPerspectiveImpl<unsigned char, NearestInterpolator>,
            warpPerspectiveImpl<signed char, NearestInterpolator>,
            warpPerspectiveImpl<unsigned short, NearestInterpolator>,
            warpPerspectiveImpl<short, NearestInterpolator>,
            warpPerspectiveImpl<int, NearestInterpolator>,
            warpPerspectiveImpl<float, NearestInterpolator>
        };

        static const func_t linear_funcs[] =
        {
            warpPerspectiveImpl<unsigned char, LinearInterpolator>,
            warpPerspectiveImpl<signed char, LinearInterpolator>,
            warpPerspectiveImpl<unsigned short, LinearInterpolator>,
            warpPerspectiveImpl<short, LinearInterpolator>,
            warpPerspectiveImpl<int, LinearInterpolator>,
            warpPerspectiveImpl<float, LinearInterpolator>
        };

        static const func_t cubic_funcs[] =
        {
            warpPerspectiveImpl<unsigned char, CubicInterpolator>,
            warpPerspectiveImpl<signed char, CubicInterpolator>,
            warpPerspectiveImpl<unsigned short, CubicInterpolator>,
            warpPerspectiveImpl<short, CubicInterpolator>,
            warpPerspectiveImpl<int, CubicInterpolator>,
            warpPerspectiveImpl<float, CubicInterpolator>
        };

        static const func_t* funcs[] = {nearest_funcs, linear_funcs, cubic_funcs};

        if (inverse)
            funcs[interpolation][src.depth()](src, M, dsize, dst, borderType, borderVal);
        else
        {
            alvision.Mat iM;
            alvision.invert(M, iM);
            funcs[interpolation][src.depth()](src, iM, dsize, dst, borderType, borderVal);
        }
    }
}

///////////////////////////////////////////////////////////////////
// Test

PARAM_TEST_CASE(WarpPerspective, alvision.cuda::DeviceInfo, alvision.Size, MatType, Inverse, Interpolation, BorderType, UseRoi)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    int type;
    bool inverse;
    int interpolation;
    int borderType;
    bool useRoi;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        type = GET_PARAM(2);
        inverse = GET_PARAM(3);
        interpolation = GET_PARAM(4);
        borderType = GET_PARAM(5);
        useRoi = GET_PARAM(6);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(WarpPerspective, Accuracy)
{
    alvision.Mat src = randomMat(size, type);
    alvision.Mat M = createTransfomMatrix(size, Math.PI / 3);
    int flags = interpolation;
    if (inverse)
        flags |= alvision.WARP_INVERSE_MAP;
    alvision.Scalar val = randomScalar(0.0, 255.0);

    alvision.cuda::GpuMat dst = createMat(size, type, useRoi);
    alvision.cuda::warpPerspective(loadMat(src, useRoi), dst, M, size, flags, borderType, val);

    alvision.Mat dst_gold;
    warpPerspectiveGold(src, M, inverse, size, dst_gold, interpolation, borderType, val);

    EXPECT_MAT_NEAR(dst_gold, dst, src.depth() == CV_32F ? 1e-1 : 1.0);
}

INSTANTIATE_TEST_CASE_P(CUDA_Warping, WarpPerspective, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    testing::Values(MatType(CV_8UC1), MatType(CV_8UC3), MatType(CV_8UC4), MatType(CV_16UC1), MatType(CV_16UC3), MatType(CV_16UC4), MatType(CV_32FC1), MatType(CV_32FC3), MatType(CV_32FC4)),
    DIRECT_INVERSE,
    testing::Values(Interpolation(alvision.INTER_NEAREST), Interpolation(alvision.INTER_LINEAR), Interpolation(alvision.INTER_CUBIC)),
    testing::Values(BorderType(alvision.BORDER_REFLECT101), BorderType(alvision.BORDER_REPLICATE), BorderType(alvision.BORDER_REFLECT), BorderType(alvision.BORDER_WRAP)),
    WHOLE_SUBMAT));

///////////////////////////////////////////////////////////////////
// Test NPP

PARAM_TEST_CASE(WarpPerspectiveNPP, alvision.cuda::DeviceInfo, MatType, Inverse, Interpolation)
{
    alvision.cuda::DeviceInfo devInfo;
    int type;
    bool inverse;
    int interpolation;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        type = GET_PARAM(1);
        inverse = GET_PARAM(2);
        interpolation = GET_PARAM(3);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(WarpPerspectiveNPP, Accuracy)
{
    alvision.Mat src = readImageType("stereobp/aloe-L.png", type);
    ASSERT_FALSE(src.empty());

    alvision.Mat M = createTransfomMatrix(src.size(), Math.PI / 4);
    int flags = interpolation;
    if (inverse)
        flags |= alvision.WARP_INVERSE_MAP;

    alvision.cuda::GpuMat dst;
    alvision.cuda::warpPerspective(loadMat(src), dst, M, src.size(), flags);

    alvision.Mat dst_gold;
    warpPerspectiveGold(src, M, inverse, src.size(), dst_gold, interpolation, alvision.BORDER_CONSTANT, alvision.Scalar::all(0));

    EXPECT_MAT_SIMILAR(dst_gold, dst, 2e-2);
}

INSTANTIATE_TEST_CASE_P(CUDA_Warping, WarpPerspectiveNPP, testing::Combine(
    ALL_DEVICES,
    testing::Values(MatType(CV_8UC1), MatType(CV_8UC3), MatType(CV_8UC4), MatType(CV_32FC1), MatType(CV_32FC3), MatType(CV_32FC4)),
    DIRECT_INVERSE,
    testing::Values(Interpolation(alvision.INTER_NEAREST), Interpolation(alvision.INTER_LINEAR), Interpolation(alvision.INTER_CUBIC))));

#endif // HAVE_CUDA
