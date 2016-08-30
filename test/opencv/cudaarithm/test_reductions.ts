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

////////////////////////////////////////////////////////////////////////////////
// Norm

//PARAM_TEST_CASE(Norm, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, NormCode, UseRoi)
class Norm extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected depth: alvision.int;
    protected normCode: alvision.NormTypes;
    protected useRoi: boolean;

    SetUp() : void
    {
        this.devInfo =  this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =     this.GET_PARAM<alvision.Size>(1);
        this.depth =    this.GET_PARAM<alvision.int>(2);
        this.normCode = this.GET_PARAM<alvision.NormTypes>(3);
        this.useRoi =   this.GET_PARAM<boolean>(4);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Norm, Accuracy)
class Norm_Accuracy extends Norm
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.depth);
        let mask = alvision.randomMat(this.size,alvision.MatrixType. CV_8UC1, 0, 2);

        let val = alvision.cudaarithm.norm(alvision.loadMat(src, this.useRoi), this.normCode, alvision.loadMat(mask, this.useRoi));

        let val_gold = alvision.norm(src, this.normCode, mask);

        alvision.EXPECT_NEAR(val_gold, val, this.depth < alvision.MatrixType.CV_32F ? 0.0 : 1.0);
    }
}

//CUDA_TEST_P(Norm, Async)
class Norm_Async extends Norm
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.depth);
        let mask = alvision.randomMat(this.size,alvision.MatrixType. CV_8UC1, 0, 2);

        let stream = new alvision.cuda.Stream();

        let dst = new alvision.cuda.HostMem();
        alvision.cudaarithm.calcNorm(alvision.loadMat(src, this.useRoi), dst, this.normCode, alvision.loadMat(mask, this.useRoi), stream);

        stream.waitForCompletion(() => {

            //double val;
            let val = new Array<alvision.double>();
            dst.createMatHeader().convertTo(new alvision.Mat(1, 1, alvision.MatrixType.CV_64FC1, val), alvision.MatrixType.CV_64F);

            let val_gold = alvision.norm(src, this.normCode, mask);

            alvision.EXPECT_NEAR(val_gold, val, this.depth < alvision.MatrixType.CV_32F ? 0.0 : 1.0);
        });

    }
}

//INSTANTIATE_TEST_CASE_P(CUDA_Arithm, Norm, new alvision.cvtest.Combine(
//    ALL_DEVICES,
//    DIFFERENT_SIZES,
//    testing::Values(MatDepth(alvision.MatrixType.CV_8U),
//                    MatDepth(alvision.MatrixType.CV_8S),
//                    MatDepth(alvision.MatrixType.CV_16U),
//                    MatDepth(alvision.MatrixType.CV_16S),
//                    MatDepth(alvision.MatrixType.CV_32S),
//                    MatDepth(alvision.MatrixType.CV_32F)),
//    testing::Values(NormCode(alvision.NormTypes..NORM_L1), NormCode(alvision.NormTypes.NORM_L2), NormCode(alvision.NormTypes.NORM_INF)),
//    WHOLE_SUBMAT));

//////////////////////////////////////////////////////////////////////////////////
//// normDiff

//PARAM_TEST_CASE(NormDiff, alvision.cuda.DeviceInfo, alvision.Size, NormCode, UseRoi)
//{
//    alvision.cuda.DeviceInfo devInfo;
//    alvision.Size size;
//    int normCode;
//    bool useRoi;

//    virtual void SetUp()
//    {
//        devInfo = GET_PARAM(0);
//        size = GET_PARAM(1);
//        normCode = GET_PARAM(2);
//        useRoi = GET_PARAM(3);

//        alvision.cuda.setDevice(this.devInfo.deviceID());
//    }
//};

//CUDA_TEST_P(NormDiff, Accuracy)
//{
//    let src1 = alvision.randomMat(size, alvision.MatrixType.CV_8UC1);
//    let src2 = alvision.randomMat(size, alvision.MatrixType.CV_8UC1);

//    double val = alvision.cuda::norm(alvision.loadMat(src1, useRoi), alvision.loadMat(src2, useRoi), normCode);

//    double val_gold = alvision.norm(src1, src2, normCode);

//    EXPECT_NEAR(val_gold, val, 0.0);
//}

//CUDA_TEST_P(NormDiff, Async)
//{
//    let src1 = alvision.randomMat(size, alvision.MatrixType.CV_8UC1);
//    let src2 = alvision.randomMat(size, alvision.MatrixType.CV_8UC1);

//    alvision.cuda.Stream stream;

//    alvision.cuda::HostMem dst;
//    alvision.cuda::calcNormDiff(alvision.loadMat(src1, useRoi), alvision.loadMat(src2, useRoi), dst, normCode, stream);

//    stream.waitForCompletion();

//    double val;
//    const alvision.Mat val_mat(1, 1, CV_64FC1, &val);
//    dst.createMatHeader().convertTo(val_mat, alvision.MatrixType.CV_64F);

//    double val_gold = alvision.norm(src1, src2, normCode);

//    EXPECT_NEAR(val_gold, val, 0.0);
//}

//INSTANTIATE_TEST_CASE_P(CUDA_Arithm, NormDiff, new alvision.cvtest.Combine(
//    ALL_DEVICES,
//    DIFFERENT_SIZES,
//    testing::Values(NormCode(alvision.NormTypes.NORM_L1), NormCode(alvision.NORM_L2), NormCode(alvision.NormTypes.NORM_INF)),
//    WHOLE_SUBMAT));

////////////////////////////////////////////////////////////////////////////////
//// Sum

//namespace
//{
//    template <typename T>
//    alvision.Scalar absSumImpl(const alvision.Mat& src)
//    {
//        const int cn = src.channels();

//        alvision.Scalar sum = alvision.Scalar.all(0);

//        for (let y = 0; y < src.rows; ++y)
//        {
//            for (let x = 0; x < src.cols; ++x)
//            {
//                for (int c = 0; c < cn; ++c)
//                    sum[c] += Math.abs(src.at<T>(y, x * cn + c));
//            }
//        }

//        return sum;
//    }

//    alvision.Scalar absSumGold(const alvision.Mat& src)
//    {
//        typedef alvision.Scalar (*func_t)(const alvision.Mat& src);

//        static const func_t funcs[] =
//        {
//            absSumImpl<uchar>,
//            absSumImpl<schar>,
//            absSumImpl<ushort>,
//            absSumImpl<short>,
//            absSumImpl<int>,
//            absSumImpl<float>,
//            absSumImpl<double>
//        };

//        return funcs[src.depth()](src);
//    }

//    template <typename T>
//    alvision.Scalar sqrSumImpl(const alvision.Mat& src)
//    {
//        const int cn = src.channels();

//        alvision.Scalar sum = alvision.Scalar.all(0);

//        for (let y = 0; y < src.rows; ++y)
//        {
//            for (let x = 0; x < src.cols; ++x)
//            {
//                for (int c = 0; c < cn; ++c)
//                {
//                    const T val = src.at<T>(y, x * cn + c);
//                    sum[c] += val * val;
//                }
//            }
//        }

//        return sum;
//    }

//    alvision.Scalar sqrSumGold(const alvision.Mat& src)
//    {
//        typedef alvision.Scalar (*func_t)(const alvision.Mat& src);

//        static const func_t funcs[] =
//        {
//            sqrSumImpl<uchar>,
//            sqrSumImpl<schar>,
//            sqrSumImpl<ushort>,
//            sqrSumImpl<short>,
//            sqrSumImpl<int>,
//            sqrSumImpl<float>,
//            sqrSumImpl<double>
//        };

//        return funcs[src.depth()](src);
//    }
//}

//PARAM_TEST_CASE(Sum, alvision.cuda.DeviceInfo, alvision.Size, MatType, UseRoi)
//{
//    alvision.cuda.DeviceInfo devInfo;
//    alvision.Size size;
//    int type;
//    bool useRoi;

//    alvision.Mat src;

//    virtual void SetUp()
//    {
//        devInfo = GET_PARAM(0);
//        size = GET_PARAM(1);
//        type = GET_PARAM(2);
//        useRoi = GET_PARAM(3);

//        alvision.cuda.setDevice(this.devInfo.deviceID());

//        src = alvision.randomMat(size, type, -128.0, 128.0);
//    }
//};

//CUDA_TEST_P(Sum, Simple)
//{
//    alvision.Scalar val = alvision.cuda::sum(alvision.loadMat(src, useRoi));

//    alvision.Scalar val_gold = alvision.sum(src);

//    EXPECT_SCALAR_NEAR(val_gold, val, CV_MAT_DEPTH(type) < alvision.MatrixType.CV_32F ? 0.0 : 0.5);
//}

//CUDA_TEST_P(Sum, Simple_Async)
//{
//    alvision.cuda.Stream stream;

//    alvision.cuda::HostMem dst;
//    alvision.cuda::calcSum(alvision.loadMat(src, useRoi), dst, null, stream);

//    stream.waitForCompletion();

//    alvision.Scalar val;
//    alvision.Mat val_mat(dst.size(), alvision.MatrixType.CV_64FC(dst.channels()), val.val);
//    dst.createMatHeader().convertTo(val_mat, alvision.MatrixType.CV_64F);

//    alvision.Scalar val_gold = alvision.sum(src);

//    EXPECT_SCALAR_NEAR(val_gold, val, CV_MAT_DEPTH(type) < alvision.MatrixType.CV_32F ? 0.0 : 0.5);
//}

//CUDA_TEST_P(Sum, Abs)
//{
//    alvision.Scalar val = alvision.cuda::absSum(alvision.loadMat(src, useRoi));

//    alvision.Scalar val_gold = absSumGold(src);

//    EXPECT_SCALAR_NEAR(val_gold, val, CV_MAT_DEPTH(type) < alvision.MatrixType.CV_32F ? 0.0 : 0.5);
//}

//CUDA_TEST_P(Sum, Abs_Async)
//{
//    alvision.cuda.Stream stream;

//    alvision.cuda::HostMem dst;
//    alvision.cuda::calcAbsSum(alvision.loadMat(src, useRoi), dst, null, stream);

//    stream.waitForCompletion();

//    alvision.Scalar val;
//    alvision.Mat val_mat(dst.size(), alvision.MatrixType.CV_64FC(dst.channels()), val.val);
//    dst.createMatHeader().convertTo(val_mat, alvision.MatrixType.CV_64F);

//    alvision.Scalar val_gold = absSumGold(src);

//    EXPECT_SCALAR_NEAR(val_gold, val, CV_MAT_DEPTH(type) < alvision.MatrixType.CV_32F ? 0.0 : 0.5);
//}

//CUDA_TEST_P(Sum, Sqr)
//{
//    alvision.Scalar val = alvision.cuda::sqrSum(alvision.loadMat(src, useRoi));

//    alvision.Scalar val_gold = sqrSumGold(src);

//    EXPECT_SCALAR_NEAR(val_gold, val, CV_MAT_DEPTH(type) < alvision.MatrixType.CV_32F ? 0.0 : 0.5);
//}

//CUDA_TEST_P(Sum, Sqr_Async)
//{
//    alvision.cuda.Stream stream;

//    alvision.cuda::HostMem dst;
//    alvision.cuda::calcSqrSum(alvision.loadMat(src, useRoi), dst, null, stream);

//    stream.waitForCompletion();

//    alvision.Scalar val;
//    alvision.Mat val_mat(dst.size(), CV_64FC(dst.channels()), val.val);
//    dst.createMatHeader().convertTo(val_mat, alvision.MatrixType.CV_64F);

//    alvision.Scalar val_gold = sqrSumGold(src);

//    EXPECT_SCALAR_NEAR(val_gold, val, CV_MAT_DEPTH(type) < alvision.MatrixType.CV_32F ? 0.0 : 0.5);
//}

//INSTANTIATE_TEST_CASE_P(CUDA_Arithm, Sum, new alvision.cvtest.Combine(
//    ALL_DEVICES,
//    DIFFERENT_SIZES,
//    TYPES(alvision.MatrixType.CV_8U, alvision.MatrixType.CV_64F, 1, 4),
//    WHOLE_SUBMAT));

//////////////////////////////////////////////////////////////////////////////////
//// MinMax

//PARAM_TEST_CASE(MinMax, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, UseRoi)
//{
//    alvision.cuda.DeviceInfo devInfo;
//    alvision.Size size;
//    int depth;
//    bool useRoi;

//    virtual void SetUp()
//    {
//        devInfo = GET_PARAM(0);
//        size = GET_PARAM(1);
//        depth = GET_PARAM(2);
//        useRoi = GET_PARAM(3);

//        alvision.cuda.setDevice(this.devInfo.deviceID());
//    }
//};

//CUDA_TEST_P(MinMax, WithoutMask)
//{
//    let src = alvision.randomMat(size, depth);

//    if (depth == alvision.MatrixType.CV_64F && !alvision.supportFeature(devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE))
//    {
//        try
//        {
//            double minVal, maxVal;
//            alvision.cuda::minMax(alvision.loadMat(src), &minVal, &maxVal);
//        }
//        catch(e)
//        {
//            alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
//        }
//    }
//    else
//    {
//        double minVal, maxVal;
//        alvision.cuda::minMax(alvision.loadMat(src, useRoi), &minVal, &maxVal);

//        double minVal_gold, maxVal_gold;
//        minMaxLocGold(src, &minVal_gold, &maxVal_gold);

//        EXPECT_DOUBLE_EQ(minVal_gold, minVal);
//        EXPECT_DOUBLE_EQ(maxVal_gold, maxVal);
//    }
//}

//CUDA_TEST_P(MinMax, Async)
//{
//    let src = alvision.randomMat(size, depth);

//    alvision.cuda.Stream stream;

//    alvision.cuda::HostMem dst;
//    alvision.cuda::findMinMax(alvision.loadMat(src, useRoi), dst, null, stream);

//    stream.waitForCompletion();

//    double vals[2];
//    const alvision.Mat vals_mat(1, 2, CV_64FC1, &vals[0]);
//    dst.createMatHeader().convertTo(vals_mat, CV_64F);

//    double minVal_gold, maxVal_gold;
//    minMaxLocGold(src, &minVal_gold, &maxVal_gold);

//    EXPECT_DOUBLE_EQ(minVal_gold, vals[0]);
//    EXPECT_DOUBLE_EQ(maxVal_gold, vals[1]);
//}

//CUDA_TEST_P(MinMax, WithMask)
//{
//    let src = alvision.randomMat(size, depth);
//    let mask = alvision.randomMat(this.size, alvision.MatrixType.CV_8UC1, 0.0, 2.0);

//    if (depth == alvision.MatrixType.CV_64F && !alvision.supportFeature(devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE))
//    {
//        try
//        {
//            double minVal, maxVal;
//            alvision.cuda::minMax(alvision.loadMat(src), &minVal, &maxVal, alvision.loadMat(mask));
//        }
//        catch(e)
//        {
//            alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
//        }
//    }
//    else
//    {
//        double minVal, maxVal;
//        alvision.cuda::minMax(alvision.loadMat(src, useRoi), &minVal, &maxVal, alvision.loadMat(mask, useRoi));

//        double minVal_gold, maxVal_gold;
//        minMaxLocGold(src, &minVal_gold, &maxVal_gold, 0, 0, mask);

//        EXPECT_DOUBLE_EQ(minVal_gold, minVal);
//        EXPECT_DOUBLE_EQ(maxVal_gold, maxVal);
//    }
//}

//CUDA_TEST_P(MinMax, NullPtr)
//{
//    let src = alvision.randomMat(size, depth);

//    if (depth == alvision.MatrixType.CV_64F && !alvision.supportFeature(devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE))
//    {
//        try
//        {
//            double minVal, maxVal;
//            alvision.cuda::minMax(alvision.loadMat(src), &minVal, 0);
//            alvision.cuda::minMax(alvision.loadMat(src), 0, &maxVal);
//        }
//        catch(e)
//        {
//            alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
//        }
//    }
//    else
//    {
//        double minVal, maxVal;
//        alvision.cuda::minMax(alvision.loadMat(src, useRoi), &minVal, 0);
//        alvision.cuda::minMax(alvision.loadMat(src, useRoi), 0, &maxVal);

//        double minVal_gold, maxVal_gold;
//        minMaxLocGold(src, &minVal_gold, &maxVal_gold, 0, 0);

//        EXPECT_DOUBLE_EQ(minVal_gold, minVal);
//        EXPECT_DOUBLE_EQ(maxVal_gold, maxVal);
//    }
//}

//INSTANTIATE_TEST_CASE_P(CUDA_Arithm, MinMax, new alvision.cvtest.Combine(
//    ALL_DEVICES,
//    DIFFERENT_SIZES,
//    ALL_DEPTH,
//    WHOLE_SUBMAT));

//////////////////////////////////////////////////////////////////////////////////
//// MinMaxLoc

//namespace
//{
//    template <typename T>
//    void expectEqualImpl(const alvision.Mat& src, alvision.Point loc_gold, alvision.Point loc)
//    {
//        alvision.EXPECT_EQ(src.at<T>(loc_gold.y, loc_gold.x), src.at<T>(loc.y, loc.x));
//    }

//    void expectEqual(const alvision.Mat& src, alvision.Point loc_gold, alvision.Point loc)
//    {
//        typedef void (*func_t)(const alvision.Mat& src, alvision.Point loc_gold, alvision.Point loc);

//        static const func_t funcs[] =
//        {
//            expectEqualImpl<uchar>,
//            expectEqualImpl<schar>,
//            expectEqualImpl<ushort>,
//            expectEqualImpl<short>,
//            expectEqualImpl<int>,
//            expectEqualImpl<float>,
//            expectEqualImpl<double>
//        };

//        funcs[src.depth()](src, loc_gold, loc);
//    }
//}

//PARAM_TEST_CASE(MinMaxLoc, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, UseRoi)
//{
//    alvision.cuda.DeviceInfo devInfo;
//    alvision.Size size;
//    int depth;
//    bool useRoi;

//    virtual void SetUp()
//    {
//        devInfo = GET_PARAM(0);
//        size = GET_PARAM(1);
//        depth = GET_PARAM(2);
//        useRoi = GET_PARAM(3);

//        alvision.cuda.setDevice(this.devInfo.deviceID());
//    }
//};

//CUDA_TEST_P(MinMaxLoc, WithoutMask)
//{
//    let src = alvision.randomMat(size, depth);

//    if (depth == alvision.MatrixType.CV_64F && !alvision.supportFeature(devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE))
//    {
//        try
//        {
//            double minVal, maxVal;
//            alvision.Point minLoc, maxLoc;
//            alvision.cuda::minMaxLoc(alvision.loadMat(src), &minVal, &maxVal, &minLoc, &maxLoc);
//        }
//        catch(e)
//        {
//            alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
//        }
//    }
//    else
//    {
//        double minVal, maxVal;
//        alvision.Point minLoc, maxLoc;
//        alvision.cuda::minMaxLoc(alvision.loadMat(src, useRoi), &minVal, &maxVal, &minLoc, &maxLoc);

//        double minVal_gold, maxVal_gold;
//        alvision.Point minLoc_gold, maxLoc_gold;
//        minMaxLocGold(src, &minVal_gold, &maxVal_gold, &minLoc_gold, &maxLoc_gold);

//        EXPECT_DOUBLE_EQ(minVal_gold, minVal);
//        EXPECT_DOUBLE_EQ(maxVal_gold, maxVal);

//        expectEqual(src, minLoc_gold, minLoc);
//        expectEqual(src, maxLoc_gold, maxLoc);
//    }
//}

//CUDA_TEST_P(MinMaxLoc, OneRowMat)
//{
//    let src = alvision.randomMat(alvision.Size(size.width, 1), depth);

//    double minVal, maxVal;
//    alvision.Point minLoc, maxLoc;
//    alvision.cuda::minMaxLoc(alvision.loadMat(src, useRoi), &minVal, &maxVal, &minLoc, &maxLoc);

//    double minVal_gold, maxVal_gold;
//    alvision.Point minLoc_gold, maxLoc_gold;
//    minMaxLocGold(src, &minVal_gold, &maxVal_gold, &minLoc_gold, &maxLoc_gold);

//    EXPECT_DOUBLE_EQ(minVal_gold, minVal);
//    EXPECT_DOUBLE_EQ(maxVal_gold, maxVal);

//    expectEqual(src, minLoc_gold, minLoc);
//    expectEqual(src, maxLoc_gold, maxLoc);
//}

//CUDA_TEST_P(MinMaxLoc, OneColumnMat)
//{
//    let src = alvision.randomMat(alvision.Size(1, size.height), depth);

//    double minVal, maxVal;
//    alvision.Point minLoc, maxLoc;
//    alvision.cuda::minMaxLoc(alvision.loadMat(src, useRoi), &minVal, &maxVal, &minLoc, &maxLoc);

//    double minVal_gold, maxVal_gold;
//    alvision.Point minLoc_gold, maxLoc_gold;
//    minMaxLocGold(src, &minVal_gold, &maxVal_gold, &minLoc_gold, &maxLoc_gold);

//    EXPECT_DOUBLE_EQ(minVal_gold, minVal);
//    EXPECT_DOUBLE_EQ(maxVal_gold, maxVal);

//    expectEqual(src, minLoc_gold, minLoc);
//    expectEqual(src, maxLoc_gold, maxLoc);
//}

//CUDA_TEST_P(MinMaxLoc, Async)
//{
//    let src = alvision.randomMat(size, depth);

//    alvision.cuda.Stream stream;

//    alvision.cuda::HostMem minMaxVals, locVals;
//    alvision.cuda::findMinMaxLoc(alvision.loadMat(src, useRoi), minMaxVals, locVals, null, stream);

//    stream.waitForCompletion();

//    double vals[2];
//    const alvision.Mat vals_mat(2, 1, alvision.MatrixType.CV_64FC1, &vals[0]);
//    minMaxVals.createMatHeader().convertTo(vals_mat, alvision.MatrixType.CV_64F);

//    int locs[2];
//    const alvision.Mat locs_mat(2, 1, alvision.MatrixType.CV_32SC1, &locs[0]);
//    locVals.createMatHeader().copyTo(locs_mat);

//    alvision.Point locs2D[] = {
//        alvision.Point(locs[0] % src.cols, locs[0] / src.cols),
//        alvision.Point(locs[1] % src.cols, locs[1] / src.cols),
//    };

//    double minVal_gold, maxVal_gold;
//    alvision.Point minLoc_gold, maxLoc_gold;
//    minMaxLocGold(src, &minVal_gold, &maxVal_gold, &minLoc_gold, &maxLoc_gold);

//    EXPECT_DOUBLE_EQ(minVal_gold, vals[0]);
//    EXPECT_DOUBLE_EQ(maxVal_gold, vals[1]);

//    expectEqual(src, minLoc_gold, locs2D[0]);
//    expectEqual(src, maxLoc_gold, locs2D[1]);
//}

//CUDA_TEST_P(MinMaxLoc, WithMask)
//{
//    let src = alvision.randomMat(size, depth);
//    let mask = alvision.randomMat(this.size, alvision.MatrixType.CV_8UC1, 0.0, 2.0);

//    if (depth == alvision.MatrixType.CV_64F && !alvision.supportFeature(devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE))
//    {
//        try
//        {
//            double minVal, maxVal;
//            alvision.Point minLoc, maxLoc;
//            alvision.cuda::minMaxLoc(alvision.loadMat(src), &minVal, &maxVal, &minLoc, &maxLoc, alvision.loadMat(mask));
//        }
//        catch(e)
//        {
//            alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
//        }
//    }
//    else
//    {
//        double minVal, maxVal;
//        alvision.Point minLoc, maxLoc;
//        alvision.cuda::minMaxLoc(alvision.loadMat(src, useRoi), &minVal, &maxVal, &minLoc, &maxLoc, alvision.loadMat(mask, useRoi));

//        double minVal_gold, maxVal_gold;
//        alvision.Point minLoc_gold, maxLoc_gold;
//        minMaxLocGold(src, &minVal_gold, &maxVal_gold, &minLoc_gold, &maxLoc_gold, mask);

//        EXPECT_DOUBLE_EQ(minVal_gold, minVal);
//        EXPECT_DOUBLE_EQ(maxVal_gold, maxVal);

//        expectEqual(src, minLoc_gold, minLoc);
//        expectEqual(src, maxLoc_gold, maxLoc);
//    }
//}

//CUDA_TEST_P(MinMaxLoc, NullPtr)
//{
//    let src = alvision.randomMat(size, depth);

//    if (depth == alvision.MatrixType. CV_64F && !alvision.supportFeature(devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE))
//    {
//        try
//        {
//            double minVal, maxVal;
//            alvision.Point minLoc, maxLoc;
//            alvision.cuda::minMaxLoc(alvision.loadMat(src, useRoi), &minVal, 0, 0, 0);
//            alvision.cuda::minMaxLoc(alvision.loadMat(src, useRoi), 0, &maxVal, 0, 0);
//            alvision.cuda::minMaxLoc(alvision.loadMat(src, useRoi), 0, 0, &minLoc, 0);
//            alvision.cuda::minMaxLoc(alvision.loadMat(src, useRoi), 0, 0, 0, &maxLoc);
//        }
//        catch(e)
//        {
//            alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
//        }
//    }
//    else
//    {
//        double minVal, maxVal;
//        alvision.Point minLoc, maxLoc;
//        alvision.cuda::minMaxLoc(alvision.loadMat(src, useRoi), &minVal, 0, 0, 0);
//        alvision.cuda::minMaxLoc(alvision.loadMat(src, useRoi), 0, &maxVal, 0, 0);
//        alvision.cuda::minMaxLoc(alvision.loadMat(src, useRoi), 0, 0, &minLoc, 0);
//        alvision.cuda::minMaxLoc(alvision.loadMat(src, useRoi), 0, 0, 0, &maxLoc);

//        double minVal_gold, maxVal_gold;
//        alvision.Point minLoc_gold, maxLoc_gold;
//        minMaxLocGold(src, &minVal_gold, &maxVal_gold, &minLoc_gold, &maxLoc_gold);

//        EXPECT_DOUBLE_EQ(minVal_gold, minVal);
//        EXPECT_DOUBLE_EQ(maxVal_gold, maxVal);

//        expectEqual(src, minLoc_gold, minLoc);
//        expectEqual(src, maxLoc_gold, maxLoc);
//    }
//}

//INSTANTIATE_TEST_CASE_P(CUDA_Arithm, MinMaxLoc, new alvision.cvtest.Combine(
//    ALL_DEVICES,
//    DIFFERENT_SIZES,
//    ALL_DEPTH,
//    WHOLE_SUBMAT));

//////////////////////////////////////////////////////////////////////////////
//// CountNonZero

//PARAM_TEST_CASE(CountNonZero, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, UseRoi)
//{
//    alvision.cuda.DeviceInfo devInfo;
//    alvision.Size size;
//    int depth;
//    bool useRoi;

//    alvision.Mat src;

//    virtual void SetUp()
//    {
//        devInfo = GET_PARAM(0);
//        size = GET_PARAM(1);
//        depth = GET_PARAM(2);
//        useRoi = GET_PARAM(3);

//        alvision.cuda.setDevice(this.devInfo.deviceID());

//        alvision.Mat srcBase = alvision.randomMat(size, alvision.MatrixType.CV_8U, 0.0, 1.5);
//        srcBase.convertTo(src, depth);
//    }
//};

//CUDA_TEST_P(CountNonZero, Accuracy)
//{
//    if (depth == alvision.MatrixType.CV_64F && !alvision.supportFeature(devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE))
//    {
//        try
//        {
//            alvision.cuda::countNonZero(alvision.loadMat(src));
//        }
//        catch(e)
//        {
//            alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
//        }
//    }
//    else
//    {
//        int val = alvision.cuda::countNonZero(alvision.loadMat(src, useRoi));

//        int val_gold = alvision.countNonZero(src);

//        ASSERT_EQ(val_gold, val);
//    }
//}

//CUDA_TEST_P(CountNonZero, Async)
//{
//    alvision.cuda.Stream stream;

//    alvision.cuda::HostMem dst;
//    alvision.cuda::countNonZero(alvision.loadMat(src, useRoi), dst, stream);

//    stream.waitForCompletion();

//    int val;
//    const alvision.Mat val_mat(1, 1, alvision.MatrixType.CV_32SC1, &val);
//    dst.createMatHeader().copyTo(val_mat);

//    int val_gold = alvision.countNonZero(src);

//    ASSERT_EQ(val_gold, val);
//}

//INSTANTIATE_TEST_CASE_P(CUDA_Arithm, CountNonZero, new alvision.cvtest.Combine(
//    ALL_DEVICES,
//    DIFFERENT_SIZES,
//    ALL_DEPTH,
//    WHOLE_SUBMAT));

////////////////////////////////////////////////////////////////////////////////
//// Reduce

//CV_ENUM(ReduceCode, alvision.REDUCE_SUM, alvision.REDUCE_AVG, alvision.REDUCE_MAX, alvision.REDUCE_MIN)
//#define ALL_REDUCE_CODES testing::Values(ReduceCode(alvision.REDUCE_SUM), ReduceCode(alvision.REDUCE_AVG), ReduceCode(alvision.REDUCE_MAX), ReduceCode(alvision.REDUCE_MIN))

//PARAM_TEST_CASE(Reduce, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, Channels, ReduceCode, UseRoi)
//{
//    alvision.cuda.DeviceInfo devInfo;
//    alvision.Size size;
//    int depth;
//    int channels;
//    int reduceOp;
//    bool useRoi;

//    int type;
//    int dst_depth;
//    int dst_type;

//    virtual void SetUp()
//    {
//        devInfo = GET_PARAM(0);
//        size = GET_PARAM(1);
//        depth = GET_PARAM(2);
//        channels = GET_PARAM(3);
//        reduceOp = GET_PARAM(4);
//        useRoi = GET_PARAM(5);

//        alvision.cuda.setDevice(this.devInfo.deviceID());

//        type = alvision.MatrixType.CV_MAKETYPE(depth, channels);

//        if (reduceOp == alvision.REDUCE_MAX || reduceOp == alvision.REDUCE_MIN)
//            dst_depth = depth;
//        else if (reduceOp == alvision.REDUCE_SUM)
//            dst_depth = depth == alvision.MatrixType.CV_8U ? alvision.MatrixType.CV_32S : depth < alvision.MatrixType.CV_64F ? alvision.MatrixType.CV_32F : depth;
//        else
//            dst_depth = depth < alvision.MatrixType.CV_32F ? alvision.MatrixType.CV_32F : depth;

//        dst_type = alvision.MatrixType.CV_MAKETYPE(dst_depth, channels);
//    }

//};

//CUDA_TEST_P(Reduce, Rows)
//{
//    let src = alvision.randomMat(size, type);

//    let dst = alvision.createMat(alvision.Size(src.cols, 1), dst_type, useRoi);
//    alvision.cuda::reduce(alvision.loadMat(src, useRoi), dst, 0, reduceOp, dst_depth);

//    let dst_gold = new alvision.Mat ();
//    alvision.reduce(src, dst_gold, 0, reduceOp, dst_depth);

//    alvision.EXPECT_MAT_NEAR(dst_gold, dst, dst_depth < alvision.MatrixType.CV_32F ? 0.0 : 0.02);
//}

//CUDA_TEST_P(Reduce, Cols)
//{
//    let src = alvision.randomMat(size, type);

//    let dst = alvision.createMat(alvision.Size(src.rows, 1), dst_type, useRoi);
//    alvision.cuda::reduce(alvision.loadMat(src, useRoi), dst, 1, reduceOp, dst_depth);

//    let dst_gold = new alvision.Mat ();
//    alvision.reduce(src, dst_gold, 1, reduceOp, dst_depth);
//    dst_gold.cols = dst_gold.rows;
//    dst_gold.rows = 1;
//    dst_gold.step = dst_gold.cols * dst_gold.elemSize();

//    alvision.EXPECT_MAT_NEAR(dst_gold, dst, dst_depth < alvision.MatrixType.CV_32F ? 0.0 : 0.02);
//}

//INSTANTIATE_TEST_CASE_P(CUDA_Arithm, Reduce, new alvision.cvtest.Combine(
//    ALL_DEVICES,
//    DIFFERENT_SIZES,
//    testing::Values(MatDepth(alvision.MatrixType.CV_8U),
//                    MatDepth(alvision.MatrixType.CV_16U),
//                    MatDepth(alvision.MatrixType.CV_16S),
//                    MatDepth(alvision.MatrixType.CV_32F),
//                    MatDepth(alvision.MatrixType.CV_64F)),
//    ALL_CHANNELS,
//    ALL_REDUCE_CODES,
//    WHOLE_SUBMAT));

////////////////////////////////////////////////////////////////////////////////
//// Normalize

//PARAM_TEST_CASE(Normalize, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, NormCode, UseRoi)
//{
//    alvision.cuda.DeviceInfo devInfo;
//    alvision.Size size;
//    int type;
//    int norm_type;
//    bool useRoi;

//    double alpha;
//    double beta;

//    virtual void SetUp()
//    {
//        devInfo = GET_PARAM(0);
//        size = GET_PARAM(1);
//        type = GET_PARAM(2);
//        norm_type = GET_PARAM(3);
//        useRoi = GET_PARAM(4);

//        alvision.cuda.setDevice(this.devInfo.deviceID());

//        alpha = 1;
//        beta = 0;
//    }

//};

//CUDA_TEST_P(Normalize, WithOutMask)
//{
//    let src = alvision.randomMat(size, type);

//    let dst = alvision.createMat(size, type, useRoi);
//    alvision.cuda::normalize(alvision.loadMat(src, useRoi), dst, alpha, beta, norm_type, type);

//    let dst_gold = new alvision.Mat ();
//    alvision.normalize(src, dst_gold, alpha, beta, norm_type, type);

//    alvision.EXPECT_MAT_NEAR(dst_gold, dst, type < alvision.MatrixType.CV_32F ? 1.0 : 1e-4);
//}

//CUDA_TEST_P(Normalize, WithMask)
//{
//    let src = alvision.randomMat(size, type);
//    alvision.Mat mask = alvision.randomMat(size, alvision.MatrixType.CV_8UC1, 0, 2);

//    let dst = alvision.createMat(size, type, useRoi);
//    dst.setTo(alvision.Scalar.all(0));
//    alvision.cuda::normalize(alvision.loadMat(src, useRoi), dst, alpha, beta, norm_type, type, alvision.loadMat(mask, useRoi));

//    alvision.Mat dst_gold(size, type);
//    dst_gold.setTo(alvision.Scalar.all(0));
//    alvision.normalize(src, dst_gold, alpha, beta, norm_type, type, mask);

//    alvision.EXPECT_MAT_NEAR(dst_gold, dst, type < alvision.MatrixType.CV_32F ? 1.0 : 1e-4);
//}

//INSTANTIATE_TEST_CASE_P(CUDA_Arithm, Normalize, new alvision.cvtest.Combine(
//    ALL_DEVICES,
//    DIFFERENT_SIZES,
//    ALL_DEPTH,
//    testing::Values(NormCode(alvision.NormTypes.NORM_L1), NormCode(alvision.NORM_L2), NormCode(alvision.NormTypes.NORM_INF), NormCode(alvision.NORM_MINMAX)),
//    WHOLE_SUBMAT));

//////////////////////////////////////////////////////////////////////////////////
//// MeanStdDev

//PARAM_TEST_CASE(MeanStdDev, alvision.cuda.DeviceInfo, alvision.Size, UseRoi)
//{
//    alvision.cuda.DeviceInfo devInfo;
//    alvision.Size size;
//    bool useRoi;

//    virtual void SetUp()
//    {
//        devInfo = GET_PARAM(0);
//        size = GET_PARAM(1);
//        useRoi = GET_PARAM(2);

//        alvision.cuda.setDevice(this.devInfo.deviceID());
//    }
//};

//CUDA_TEST_P(MeanStdDev, Accuracy)
//{
//    let src = alvision.randomMat(size, alvision.MatrixType.CV_8UC1);

//    if (!alvision.supportFeature(devInfo, alvision.cuda::FEATURE_SET_COMPUTE_13))
//    {
//        try
//        {
//            alvision.Scalar mean;
//            alvision.Scalar stddev;
//            alvision.cuda::meanStdDev(alvision.loadMat(src, useRoi), mean, stddev);
//        }
//        catch(e)
//        {
//            ASSERT_EQ(alvision.cv.Error.Code.StsNotImplemented, e.code);
//        }
//    }
//    else
//    {
//        alvision.Scalar mean;
//        alvision.Scalar stddev;
//        alvision.cuda::meanStdDev(alvision.loadMat(src, useRoi), mean, stddev);

//        alvision.Scalar mean_gold;
//        alvision.Scalar stddev_gold;
//        alvision.meanStdDev(src, mean_gold, stddev_gold);

//        EXPECT_SCALAR_NEAR(mean_gold, mean, 1e-5);
//        EXPECT_SCALAR_NEAR(stddev_gold, stddev, 1e-5);
//    }
//}

//CUDA_TEST_P(MeanStdDev, Async)
//{
//    let src = alvision.randomMat(size, alvision.MatrixType.CV_8UC1);

//    alvision.cuda.Stream stream;

//    alvision.cuda::HostMem dst;
//    alvision.cuda::meanStdDev(alvision.loadMat(src, useRoi), dst, stream);

//    stream.waitForCompletion();

//    double vals[2];
//    dst.createMatHeader().copyTo(alvision.Mat(1, 2, alvision.MatrixType.CV_64FC1, &vals[0]));

//    alvision.Scalar mean_gold;
//    alvision.Scalar stddev_gold;
//    alvision.meanStdDev(src, mean_gold, stddev_gold);

//    EXPECT_SCALAR_NEAR(mean_gold, alvision.Scalar(vals[0]), 1e-5);
//    EXPECT_SCALAR_NEAR(stddev_gold, alvision.Scalar(vals[1]), 1e-5);
//}

//INSTANTIATE_TEST_CASE_P(CUDA_Arithm, MeanStdDev, new alvision.cvtest.Combine(
//    ALL_DEVICES,
//    DIFFERENT_SIZES,
//    WHOLE_SUBMAT));

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//// Integral

//PARAM_TEST_CASE(Integral, alvision.cuda.DeviceInfo, alvision.Size, UseRoi)
//{
//    alvision.cuda.DeviceInfo devInfo;
//    alvision.Size size;
//    bool useRoi;

//    virtual void SetUp()
//    {
//        devInfo = GET_PARAM(0);
//        size = GET_PARAM(1);
//        useRoi = GET_PARAM(2);

//        alvision.cuda.setDevice(this.devInfo.deviceID());
//    }
//};

//CUDA_TEST_P(Integral, Accuracy)
//{
//    let src = alvision.randomMat(size, alvision.MatrixType.CV_8UC1);

//    let dst = alvision.createMat(alvision.Size(src.cols + 1, src.rows + 1), alvision.MatrixType.CV_32SC1, useRoi);
//    alvision.cuda::integral(alvision.loadMat(src, useRoi), dst);

//    let dst_gold = new alvision.Mat ();
//    alvision.integral(src, dst_gold, alvision.MatrixType.CV_32S);

//    alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
//}

//INSTANTIATE_TEST_CASE_P(CUDA_Arithm, Integral, new alvision.cvtest.Combine(
//    ALL_DEVICES,
//    testing::Values(alvision.Size(128, 128), alvision.Size(113, 113), alvision.Size(768, 1066)),
//    WHOLE_SUBMAT));

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//// IntegralSqr

//PARAM_TEST_CASE(IntegralSqr, alvision.cuda.DeviceInfo, alvision.Size, UseRoi)
//{
//    alvision.cuda.DeviceInfo devInfo;
//    alvision.Size size;
//    bool useRoi;

//    virtual void SetUp()
//    {
//        devInfo = GET_PARAM(0);
//        size = GET_PARAM(1);
//        useRoi = GET_PARAM(2);

//        alvision.cuda.setDevice(this.devInfo.deviceID());
//    }
//};

//CUDA_TEST_P(IntegralSqr, Accuracy)
//{
//    let src = alvision.randomMat(size, alvision.MatrixType.CV_8UC1);

//    let dst = alvision.createMat(alvision.Size(src.cols + 1, src.rows + 1), alvision.MatrixType.CV_64FC1, useRoi);
//    alvision.cuda::sqrIntegral(alvision.loadMat(src, useRoi), dst);

//    alvision.Mat dst_gold, temp;
//    alvision.integral(src, temp, dst_gold);

//    alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
//}

//INSTANTIATE_TEST_CASE_P(CUDA_Arithm, IntegralSqr, new alvision.cvtest.Combine(
//    ALL_DEVICES,
//    DIFFERENT_SIZES,
//    WHOLE_SUBMAT));

//#endif // HAVE_CUDA
