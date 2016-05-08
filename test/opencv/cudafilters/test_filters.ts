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
    IMPLEMENT_PARAM_CLASS(KSize, alvision.Size)
    IMPLEMENT_PARAM_CLASS(Anchor, alvision.Point)
    IMPLEMENT_PARAM_CLASS(Deriv_X, int)
    IMPLEMENT_PARAM_CLASS(Deriv_Y, int)
    IMPLEMENT_PARAM_CLASS(Iterations, int)

    alvision.Mat getInnerROI(alvision.InputArray m_, alvision.Size ksize)
    {
        alvision.Mat m = getMat(m_);
        alvision.Rect roi(ksize.width, ksize.height, m.cols - 2 * ksize.width, m.rows - 2 * ksize.height);
        return m(roi);
    }

    alvision.Mat getInnerROI(alvision.InputArray m, int ksize)
    {
        return getInnerROI(m, alvision.Size(ksize, ksize));
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////
// Blur

PARAM_TEST_CASE(Blur, alvision.cuda::DeviceInfo, alvision.Size, MatType, KSize, Anchor, BorderType, UseRoi)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    int type;
    alvision.Size ksize;
    alvision.Point anchor;
    int borderType;
    bool useRoi;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        type = GET_PARAM(2);
        ksize = GET_PARAM(3);
        anchor = GET_PARAM(4);
        borderType = GET_PARAM(5);
        useRoi = GET_PARAM(6);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(Blur, Accuracy)
{
    alvision.Mat src = randomMat(size, type);

    alvision.Ptr<alvision.cuda::Filter> blurFilter = alvision.cuda::createBoxFilter(src.type(), -1, ksize, anchor, borderType);

    alvision.cuda::GpuMat dst = createMat(size, type, useRoi);
    blurFilter.apply(loadMat(src, useRoi), dst);

    alvision.Mat dst_gold;
    alvision.blur(src, dst_gold, ksize, anchor, borderType);

    EXPECT_MAT_NEAR(dst_gold, dst, 1.0);
}

INSTANTIATE_TEST_CASE_P(CUDA_Filters, Blur, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    testing::Values(MatType(CV_8UC1), MatType(CV_8UC4)),
    testing::Values(KSize(alvision.Size(3, 3)), KSize(alvision.Size(5, 5)), KSize(alvision.Size(7, 7))),
    testing::Values(Anchor(alvision.Point(-1, -1)), Anchor(alvision.Point(0, 0)), Anchor(alvision.Point(2, 2))),
    testing::Values(BorderType(alvision.BORDER_REFLECT101), BorderType(alvision.BORDER_REPLICATE), BorderType(alvision.BORDER_CONSTANT), BorderType(alvision.BORDER_REFLECT)),
    WHOLE_SUBMAT));

/////////////////////////////////////////////////////////////////////////////////////////////////
// Filter2D

PARAM_TEST_CASE(Filter2D, alvision.cuda::DeviceInfo, alvision.Size, MatType, KSize, Anchor, BorderType, UseRoi)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    int type;
    alvision.Size ksize;
    alvision.Point anchor;
    int borderType;
    bool useRoi;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        type = GET_PARAM(2);
        ksize = GET_PARAM(3);
        anchor = GET_PARAM(4);
        borderType = GET_PARAM(5);
        useRoi = GET_PARAM(6);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(Filter2D, Accuracy)
{
    alvision.Mat src = randomMat(size, type);
    alvision.Mat kernel = randomMat(alvision.Size(ksize.width, ksize.height), CV_32FC1, 0.0, 1.0);

    alvision.Ptr<alvision.cuda::Filter> filter2D = alvision.cuda::createLinearFilter(src.type(), -1, kernel, anchor, borderType);

    alvision.cuda::GpuMat dst = createMat(size, type, useRoi);
    filter2D.apply(loadMat(src, useRoi), dst);

    alvision.Mat dst_gold;
    alvision.filter2D(src, dst_gold, -1, kernel, anchor, 0, borderType);

    EXPECT_MAT_NEAR(dst_gold, dst, CV_MAT_DEPTH(type) == CV_32F ? 1e-1 : 1.0);
}

INSTANTIATE_TEST_CASE_P(CUDA_Filters, Filter2D, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    testing::Values(MatType(CV_8UC1), MatType(CV_8UC4), MatType(CV_16UC1), MatType(CV_16UC4), MatType(CV_32FC1), MatType(CV_32FC4)),
    testing::Values(KSize(alvision.Size(3, 3)), KSize(alvision.Size(5, 5)), KSize(alvision.Size(7, 7)), KSize(alvision.Size(11, 11)), KSize(alvision.Size(13, 13)), KSize(alvision.Size(15, 15))),
    testing::Values(Anchor(alvision.Point(-1, -1)), Anchor(alvision.Point(0, 0)), Anchor(alvision.Point(2, 2))),
    testing::Values(BorderType(alvision.BORDER_REFLECT101), BorderType(alvision.BORDER_REPLICATE), BorderType(alvision.BORDER_CONSTANT), BorderType(alvision.BORDER_REFLECT)),
    WHOLE_SUBMAT));

/////////////////////////////////////////////////////////////////////////////////////////////////
// Laplacian

PARAM_TEST_CASE(Laplacian, alvision.cuda::DeviceInfo, alvision.Size, MatType, KSize, UseRoi)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    int type;
    alvision.Size ksize;
    bool useRoi;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        type = GET_PARAM(2);
        ksize = GET_PARAM(3);
        useRoi = GET_PARAM(4);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(Laplacian, Accuracy)
{
    alvision.Mat src = randomMat(size, type);

    alvision.Ptr<alvision.cuda::Filter> laplacian = alvision.cuda::createLaplacianFilter(src.type(), -1, ksize.width);

    alvision.cuda::GpuMat dst = createMat(size, type, useRoi);
    laplacian.apply(loadMat(src, useRoi), dst);

    alvision.Mat dst_gold;
    alvision.Laplacian(src, dst_gold, -1, ksize.width);

    EXPECT_MAT_NEAR(dst_gold, dst, src.depth() < CV_32F ? 0.0 : 1e-3);
}

INSTANTIATE_TEST_CASE_P(CUDA_Filters, Laplacian, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    testing::Values(MatType(CV_8UC1), MatType(CV_8UC4), MatType(CV_32FC1)),
    testing::Values(KSize(alvision.Size(1, 1)), KSize(alvision.Size(3, 3))),
    WHOLE_SUBMAT));

/////////////////////////////////////////////////////////////////////////////////////////////////
// SeparableLinearFilter

PARAM_TEST_CASE(SeparableLinearFilter, alvision.cuda::DeviceInfo, alvision.Size, MatDepth, Channels, KSize, Anchor, BorderType, UseRoi)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    int depth;
    int cn;
    alvision.Size ksize;
    alvision.Point anchor;
    int borderType;
    bool useRoi;

    int type;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        depth = GET_PARAM(2);
        cn = GET_PARAM(3);
        ksize = GET_PARAM(4);
        anchor = GET_PARAM(5);
        borderType = GET_PARAM(6);
        useRoi = GET_PARAM(7);

        alvision.cuda::setDevice(devInfo.deviceID());

        type = CV_MAKE_TYPE(depth, cn);
    }
};

CUDA_TEST_P(SeparableLinearFilter, Accuracy)
{
    alvision.Mat src = randomMat(size, type);
    alvision.Mat rowKernel = randomMat(Size(ksize.width, 1), CV_32FC1, 0.0, 1.0);
    alvision.Mat columnKernel = randomMat(Size(ksize.height, 1), CV_32FC1, 0.0, 1.0);

    alvision.Ptr<alvision.cuda::Filter> filter = alvision.cuda::createSeparableLinearFilter(src.type(), -1, rowKernel, columnKernel, anchor, borderType);

    alvision.cuda::GpuMat dst = createMat(size, type, useRoi);
    filter.apply(loadMat(src, useRoi), dst);

    alvision.Mat dst_gold;
    alvision.sepFilter2D(src, dst_gold, -1, rowKernel, columnKernel, anchor, 0, borderType);

    EXPECT_MAT_NEAR(dst_gold, dst, src.depth() < CV_32F ? 1.0 : 1e-2);
}

INSTANTIATE_TEST_CASE_P(CUDA_Filters, SeparableLinearFilter, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    testing::Values(MatDepth(CV_8U), MatDepth(CV_16U), MatDepth(CV_16S), MatDepth(CV_32F)),
    IMAGE_CHANNELS,
    testing::Values(KSize(alvision.Size(3, 3)),
                    KSize(alvision.Size(7, 7)),
                    KSize(alvision.Size(13, 13)),
                    KSize(alvision.Size(15, 15)),
                    KSize(alvision.Size(17, 17)),
                    KSize(alvision.Size(23, 15)),
                    KSize(alvision.Size(31, 3))),
    testing::Values(Anchor(alvision.Point(-1, -1)), Anchor(alvision.Point(0, 0)), Anchor(alvision.Point(2, 2))),
    testing::Values(BorderType(alvision.BORDER_REFLECT101),
                    BorderType(alvision.BORDER_REPLICATE),
                    BorderType(alvision.BORDER_CONSTANT),
                    BorderType(alvision.BORDER_REFLECT)),
    WHOLE_SUBMAT));

/////////////////////////////////////////////////////////////////////////////////////////////////
// Sobel

PARAM_TEST_CASE(Sobel, alvision.cuda::DeviceInfo, alvision.Size, MatDepth, Channels, KSize, Deriv_X, Deriv_Y, BorderType, UseRoi)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    int depth;
    int cn;
    alvision.Size ksize;
    int dx;
    int dy;
    int borderType;
    bool useRoi;

    int type;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        depth = GET_PARAM(2);
        cn = GET_PARAM(3);
        ksize = GET_PARAM(4);
        dx = GET_PARAM(5);
        dy = GET_PARAM(6);
        borderType = GET_PARAM(7);
        useRoi = GET_PARAM(8);

        alvision.cuda::setDevice(devInfo.deviceID());

        type = CV_MAKE_TYPE(depth, cn);
    }
};

CUDA_TEST_P(Sobel, Accuracy)
{
    if (dx == 0 && dy == 0)
        return;

    alvision.Mat src = randomMat(size, type);

    alvision.Ptr<alvision.cuda::Filter> sobel = alvision.cuda::createSobelFilter(src.type(), -1, dx, dy, ksize.width, 1.0, borderType);

    alvision.cuda::GpuMat dst = createMat(size, type, useRoi);
    sobel.apply(loadMat(src, useRoi), dst);

    alvision.Mat dst_gold;
    alvision.Sobel(src, dst_gold, -1, dx, dy, ksize.width, 1.0, 0.0, borderType);

    EXPECT_MAT_NEAR(dst_gold, dst, src.depth() < CV_32F ? 0.0 : 0.1);
}

INSTANTIATE_TEST_CASE_P(CUDA_Filters, Sobel, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    testing::Values(MatDepth(CV_8U), MatDepth(CV_16U), MatDepth(CV_16S), MatDepth(CV_32F)),
    IMAGE_CHANNELS,
    testing::Values(KSize(alvision.Size(3, 3)), KSize(alvision.Size(5, 5)), KSize(alvision.Size(7, 7))),
    testing::Values(Deriv_X(0), Deriv_X(1), Deriv_X(2)),
    testing::Values(Deriv_Y(0), Deriv_Y(1), Deriv_Y(2)),
    testing::Values(BorderType(alvision.BORDER_REFLECT101),
                    BorderType(alvision.BORDER_REPLICATE),
                    BorderType(alvision.BORDER_CONSTANT),
                    BorderType(alvision.BORDER_REFLECT)),
    WHOLE_SUBMAT));

/////////////////////////////////////////////////////////////////////////////////////////////////
// Scharr

PARAM_TEST_CASE(Scharr, alvision.cuda::DeviceInfo, alvision.Size, MatDepth, Channels, Deriv_X, Deriv_Y, BorderType, UseRoi)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    int depth;
    int cn;
    int dx;
    int dy;
    int borderType;
    bool useRoi;

    int type;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        depth = GET_PARAM(2);
        cn = GET_PARAM(3);
        dx = GET_PARAM(4);
        dy = GET_PARAM(5);
        borderType = GET_PARAM(6);
        useRoi = GET_PARAM(7);

        alvision.cuda::setDevice(devInfo.deviceID());

        type = CV_MAKE_TYPE(depth, cn);
    }
};

CUDA_TEST_P(Scharr, Accuracy)
{
    if (dx + dy != 1)
        return;

    alvision.Mat src = randomMat(size, type);

    alvision.Ptr<alvision.cuda::Filter> scharr = alvision.cuda::createScharrFilter(src.type(), -1, dx, dy, 1.0, borderType);

    alvision.cuda::GpuMat dst = createMat(size, type, useRoi);
    scharr.apply(loadMat(src, useRoi), dst);

    alvision.Mat dst_gold;
    alvision.Scharr(src, dst_gold, -1, dx, dy, 1.0, 0.0, borderType);

    EXPECT_MAT_NEAR(dst_gold, dst, src.depth() < CV_32F ? 0.0 : 0.1);
}

INSTANTIATE_TEST_CASE_P(CUDA_Filters, Scharr, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    testing::Values(MatDepth(CV_8U), MatDepth(CV_16U), MatDepth(CV_16S), MatDepth(CV_32F)),
    IMAGE_CHANNELS,
    testing::Values(Deriv_X(0), Deriv_X(1)),
    testing::Values(Deriv_Y(0), Deriv_Y(1)),
    testing::Values(BorderType(alvision.BORDER_REFLECT101),
                    BorderType(alvision.BORDER_REPLICATE),
                    BorderType(alvision.BORDER_CONSTANT),
                    BorderType(alvision.BORDER_REFLECT)),
    WHOLE_SUBMAT));

/////////////////////////////////////////////////////////////////////////////////////////////////
// GaussianBlur

PARAM_TEST_CASE(GaussianBlur, alvision.cuda::DeviceInfo, alvision.Size, MatDepth, Channels, KSize, BorderType, UseRoi)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    int depth;
    int cn;
    alvision.Size ksize;
    int borderType;
    bool useRoi;

    int type;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        depth = GET_PARAM(2);
        cn = GET_PARAM(3);
        ksize = GET_PARAM(4);
        borderType = GET_PARAM(5);
        useRoi = GET_PARAM(6);

        alvision.cuda::setDevice(devInfo.deviceID());

        type = CV_MAKE_TYPE(depth, cn);
    }
};

CUDA_TEST_P(GaussianBlur, Accuracy)
{
    alvision.Mat src = randomMat(size, type);
    double sigma1 = randomDouble(0.1, 1.0);
    double sigma2 = randomDouble(0.1, 1.0);

    alvision.Ptr<alvision.cuda::Filter> gauss = alvision.cuda::createGaussianFilter(src.type(), -1, ksize, sigma1, sigma2, borderType);

    alvision.cuda::GpuMat dst = createMat(size, type, useRoi);
    gauss.apply(loadMat(src, useRoi), dst);

    alvision.Mat dst_gold;
    alvision.GaussianBlur(src, dst_gold, ksize, sigma1, sigma2, borderType);

    EXPECT_MAT_NEAR(dst_gold, dst, src.depth() < CV_32F ? 4.0 : 1e-4);
}

INSTANTIATE_TEST_CASE_P(CUDA_Filters, GaussianBlur, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    testing::Values(MatDepth(CV_8U), MatDepth(CV_16U), MatDepth(CV_16S), MatDepth(CV_32F)),
    IMAGE_CHANNELS,
    testing::Values(KSize(alvision.Size(3, 3)),
                    KSize(alvision.Size(5, 5)),
                    KSize(alvision.Size(7, 7)),
                    KSize(alvision.Size(9, 9)),
                    KSize(alvision.Size(11, 11)),
                    KSize(alvision.Size(13, 13)),
                    KSize(alvision.Size(15, 15)),
                    KSize(alvision.Size(17, 17)),
                    KSize(alvision.Size(19, 19)),
                    KSize(alvision.Size(21, 21)),
                    KSize(alvision.Size(23, 23)),
                    KSize(alvision.Size(25, 25)),
                    KSize(alvision.Size(27, 27)),
                    KSize(alvision.Size(29, 29)),
                    KSize(alvision.Size(31, 31))),
    testing::Values(BorderType(alvision.BORDER_REFLECT101),
                    BorderType(alvision.BORDER_REPLICATE),
                    BorderType(alvision.BORDER_CONSTANT),
                    BorderType(alvision.BORDER_REFLECT)),
    WHOLE_SUBMAT));

/////////////////////////////////////////////////////////////////////////////////////////////////
// Erode

PARAM_TEST_CASE(Erode, alvision.cuda::DeviceInfo, alvision.Size, MatType, Anchor, Iterations, UseRoi)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    int type;
    alvision.Point anchor;
    int iterations;
    bool useRoi;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        type = GET_PARAM(2);
        anchor = GET_PARAM(3);
        iterations = GET_PARAM(4);
        useRoi = GET_PARAM(5);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(Erode, Accuracy)
{
    alvision.Mat src = randomMat(size, type);
    alvision.Mat kernel = alvision.Mat::ones(3, 3, CV_8U);

    alvision.Ptr<alvision.cuda::Filter> erode = alvision.cuda::createMorphologyFilter(alvision.MORPH_ERODE, src.type(), kernel, anchor, iterations);

    alvision.cuda::GpuMat dst = createMat(size, type, useRoi);
    erode.apply(loadMat(src, useRoi), dst);

    alvision.Mat dst_gold;
    alvision.erode(src, dst_gold, kernel, anchor, iterations);

    alvision.Size ksize = alvision.Size(kernel.cols + iterations * (kernel.cols - 1), kernel.rows + iterations * (kernel.rows - 1));

    EXPECT_MAT_NEAR(getInnerROI(dst_gold, ksize), getInnerROI(dst, ksize), 0.0);
}

INSTANTIATE_TEST_CASE_P(CUDA_Filters, Erode, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    testing::Values(MatType(CV_8UC1), MatType(CV_8UC4)),
    testing::Values(Anchor(alvision.Point(-1, -1)), Anchor(alvision.Point(0, 0)), Anchor(alvision.Point(2, 2))),
    testing::Values(Iterations(1), Iterations(2), Iterations(3)),
    WHOLE_SUBMAT));

/////////////////////////////////////////////////////////////////////////////////////////////////
// Dilate

PARAM_TEST_CASE(Dilate, alvision.cuda::DeviceInfo, alvision.Size, MatType, Anchor, Iterations, UseRoi)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    int type;
    alvision.Point anchor;
    int iterations;
    bool useRoi;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        type = GET_PARAM(2);
        anchor = GET_PARAM(3);
        iterations = GET_PARAM(4);
        useRoi = GET_PARAM(5);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(Dilate, Accuracy)
{
    alvision.Mat src = randomMat(size, type);
    alvision.Mat kernel = alvision.Mat::ones(3, 3, CV_8U);

    alvision.Ptr<alvision.cuda::Filter> dilate = alvision.cuda::createMorphologyFilter(alvision.MORPH_DILATE, src.type(), kernel, anchor, iterations);

    alvision.cuda::GpuMat dst = createMat(size, type, useRoi);
    dilate.apply(loadMat(src, useRoi), dst);

    alvision.Mat dst_gold;
    alvision.dilate(src, dst_gold, kernel, anchor, iterations);

    alvision.Size ksize = alvision.Size(kernel.cols + iterations * (kernel.cols - 1), kernel.rows + iterations * (kernel.rows - 1));

    EXPECT_MAT_NEAR(getInnerROI(dst_gold, ksize), getInnerROI(dst, ksize), 0.0);
}

INSTANTIATE_TEST_CASE_P(CUDA_Filters, Dilate, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    testing::Values(MatType(CV_8UC1), MatType(CV_8UC4)),
    testing::Values(Anchor(alvision.Point(-1, -1)), Anchor(alvision.Point(0, 0)), Anchor(alvision.Point(2, 2))),
    testing::Values(Iterations(1), Iterations(2), Iterations(3)),
    WHOLE_SUBMAT));

/////////////////////////////////////////////////////////////////////////////////////////////////
// MorphEx

CV_ENUM(MorphOp, MORPH_OPEN, MORPH_CLOSE, MORPH_GRADIENT, MORPH_TOPHAT, MORPH_BLACKHAT)

PARAM_TEST_CASE(MorphEx, alvision.cuda::DeviceInfo, alvision.Size, MatType, MorphOp, Anchor, Iterations, UseRoi)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    int type;
    int morphOp;
    alvision.Point anchor;
    int iterations;
    bool useRoi;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        type = GET_PARAM(2);
        morphOp = GET_PARAM(3);
        anchor = GET_PARAM(4);
        iterations = GET_PARAM(5);
        useRoi = GET_PARAM(6);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(MorphEx, Accuracy)
{
    alvision.Mat src = randomMat(size, type);
    alvision.Mat kernel = alvision.Mat::ones(3, 3, CV_8U);

    alvision.Ptr<alvision.cuda::Filter> morph = alvision.cuda::createMorphologyFilter(morphOp, src.type(), kernel, anchor, iterations);

    alvision.cuda::GpuMat dst = createMat(size, type, useRoi);
    morph.apply(loadMat(src, useRoi), dst);

    alvision.Mat dst_gold;
    alvision.morphologyEx(src, dst_gold, morphOp, kernel, anchor, iterations);

    alvision.Size border = alvision.Size(kernel.cols + (iterations + 1) * kernel.cols + 2, kernel.rows + (iterations + 1) * kernel.rows + 2);

    EXPECT_MAT_NEAR(getInnerROI(dst_gold, border), getInnerROI(dst, border), 0.0);
}

INSTANTIATE_TEST_CASE_P(CUDA_Filters, MorphEx, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    testing::Values(MatType(CV_8UC1), MatType(CV_8UC4)),
    MorphOp::all(),
    testing::Values(Anchor(alvision.Point(-1, -1)), Anchor(alvision.Point(0, 0)), Anchor(alvision.Point(2, 2))),
    testing::Values(Iterations(1), Iterations(2), Iterations(3)),
    WHOLE_SUBMAT));

#endif // HAVE_CUDA
