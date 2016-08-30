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
//#include "opencv2/core/cuda.hpp"
//#include "opencv2/ts/cuda_test.hpp"
//
//using namespace cvtest;

////////////////////////////////////////////////////////////////////////////////
// SetTo


//PARAM_TEST_CASE(GpuMat_SetTo, alvision.cuda.DeviceInfo, alvision.Size, MatType, UseRoi)
class GpuMat_SetTo extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo 
    protected size: alvision.Size
    protected type: alvision.int;
    protected useRoi: boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size = this.GET_PARAM < alvision.Size>(1);
        this.type = this.GET_PARAM<alvision.int>(2);
        this.useRoi = this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};



//CUDA_TEST_P(GpuMat_SetTo, Zero)
class GpuMat_SetTo_Zero extends GpuMat_SetTo
{
    public TestBody(): void {
        var zero = alvision.Scalar.all(0);

        var mat = alvision.createMat(this.size, this.type, this.useRoi);
        mat.setTo(zero);

        alvision.EXPECT_MAT_NEAR(alvision.Mat.zeros(this.size, this.type).toMat(), mat, 0.0);
    }
}

//CUDA_TEST_P(GpuMat_SetTo, SameVal)
class GpuMat_SetTo_SameVal extends GpuMat_SetTo
{
    public TestBody(): void {
        var val = alvision.Scalar.all(alvision.randomDouble(0.0, 255.0));

        if (alvision.MatrixType.CV_MAT_DEPTH(this.type) == alvision.MatrixType.CV_64F && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                var mat = alvision.createMat(this.size, this.type, this.useRoi);
                mat.setTo(val);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            var mat = alvision.createMat(this.size, this.type, this.useRoi);
            mat.setTo(val);

            alvision.EXPECT_MAT_NEAR(new alvision.Mat(this.size, this.type, val), mat, 0.0);
        }
    }
}

//CUDA_TEST_P(GpuMat_SetTo, DifferentVal)
class GpuMat_SetTo_DifferentVal extends GpuMat_SetTo
{
    public TestBody(): void {
        var val = alvision.randomScalar(0.0, 255.0);

        if (alvision.MatrixType.CV_MAT_DEPTH(this.type) == alvision.MatrixType.CV_64F && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                var mat = alvision.createMat(this.size, this.type, this.useRoi);
                mat.setTo(val);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat , e.code);
            }
        }
        else {
            var mat = alvision.createMat(this.size, this.type, this.useRoi);
            mat.setTo(val);

            alvision.EXPECT_MAT_NEAR(new alvision.Mat(this.size, this.type, val), mat, 0.0);
        }
    }
}

//CUDA_TEST_P(GpuMat_SetTo, Masked)
class GpuMat_SetTo_Masked extends GpuMat_SetTo
{
    public TestBody(): void {
        var val = alvision.randomScalar(0.0, 255.0);
        var mat_gold = alvision.randomMat(this.size, this.type);
        var mask = alvision.randomMat(this.size, alvision.MatrixType.CV_8UC1, 0.0, 2.0);

        if(alvision.MatrixType.CV_MAT_DEPTH(this.type) == alvision.MatrixType.CV_64F && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                var mat = alvision.createMat(this.size, this.type, this.useRoi);
                mat.setTo(val, alvision.loadMat(mask));
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
    else
    {
            var mat = alvision.loadMat(mat_gold, this.useRoi);
            mat.setTo(val,alvision.loadMat(mask, this.useRoi));

            mat_gold.setTo(val, mask);

            alvision.EXPECT_MAT_NEAR(mat_gold, mat, 0.0);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA', 'GpuMat_SetTo', (case_name, test_name) => { return null;},new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.ALL_TYPES,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// CopyTo

//PARAM_TEST_CASE(GpuMat_CopyTo, alvision.cuda.DeviceInfo, alvision.Size, MatType, UseRoi)
class GpuMat_CopyTo extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected type: alvision.int;
    protected useRoi: boolean;


    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size = this.GET_PARAM<alvision.Size>(1);
        this.type = this.GET_PARAM<alvision.int>(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};


//CUDA_TEST_P(GpuMat_CopyTo, WithOutMask)
class GpuMat_CopyTo_WithOutMask extends GpuMat_CopyTo
{
    public TestBody(): void {
        var src = alvision.randomMat(this.size, this.type);

        var d_src = alvision.loadMat(src,this. useRoi);
        var dst = alvision.createMat(this.size, this.type,this. useRoi);
        d_src.copyTo(dst);

        alvision.EXPECT_MAT_NEAR(src, dst, 0.0);
    }
}

//CUDA_TEST_P(GpuMat_CopyTo, Masked)
class GpuMat_CopyTo_Masked extends GpuMat_CopyTo
{
    public TestBody(): void {
        var src = alvision.randomMat(this.size, this.type);
        var mask = alvision.randomMat(this.size,alvision.MatrixType. CV_8UC1, 0.0, 2.0);

        if (alvision.MatrixType.CV_MAT_DEPTH(this.type) == alvision.MatrixType.CV_64F && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                var d_src = alvision.loadMat(src);
                var dst = new alvision.cuda.GpuMat();
                d_src.copyTo(dst, alvision.loadMat(mask, this.useRoi));
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            var d_src = alvision.loadMat(src, this.useRoi);
            var dst =   alvision.loadMat(alvision.Mat.zeros(this.size,this. type).toMat(), this.useRoi);
            d_src.copyTo(dst, alvision.loadMat(mask,this. useRoi));

            var dst_gold = alvision.Mat.zeros(this.size, this.type).toMat();
            src.copyTo(dst_gold, mask);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA', 'GpuMat_CopyTo', (case_name, test_name) => { return null;} , new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.ALL_TYPES,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// ConvertTo


//PARAM_TEST_CASE(GpuMat_ConvertTo, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, MatDepth, UseRoi)
class GpuMat_ConvertTo extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected depth1: alvision.int;
    protected depth2 : alvision.int;
    protected useRoi: boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.depth1 =  this.GET_PARAM<alvision.int>(2);
        this.depth2 =  this.GET_PARAM<alvision.int>(3);
        this.useRoi =  this.GET_PARAM<boolean>(4);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(GpuMat_ConvertTo, WithOutScaling)
class GpuMat_ConvertTo_WithOutScaling extends GpuMat_ConvertTo
{
    public TestBody(): void {
        var src = alvision.randomMat(this.size, this.depth1);

        if ((this.depth1 == alvision.MatrixType.CV_64F || this.depth2 == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                var d_src = alvision.loadMat(src);
                var dst = new alvision.cuda.GpuMat();
                d_src.convertTo(dst, this.depth2);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            var d_src = alvision.loadMat(src, this.useRoi);
            var dst = alvision.createMat(this.size, this.depth2, this.useRoi);
            d_src.convertTo(dst, this.depth2);

            var dst_gold = new alvision.Mat();
            src.convertTo(dst_gold, this.depth2);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth2 < alvision.MatrixType.CV_32F ? 1.0 : 1e-4);
        }
    }
}

//CUDA_TEST_P(GpuMat_ConvertTo, WithScaling)
class GpuMat_ConvertTo_WithScaling extends GpuMat_ConvertTo
{
    public TestBody(): void {
        var src = alvision.randomMat(this.size, this.depth1);
        var a = alvision.randomDouble(0.0, 1.0);
        var b = alvision.randomDouble(-10.0, 10.0);

        if ((this.depth1 == alvision.MatrixType.CV_64F || this.depth2 == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                var d_src = alvision.loadMat(src);
                var dst = new alvision.cuda.GpuMat();
                d_src.convertTo(dst,this. depth2, a, b);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            var d_src = alvision.loadMat(src, this.useRoi);
            var dst = alvision.createMat(this.size, this.depth2, this.useRoi);
            d_src.convertTo(dst, this.depth2, a, b);

            var dst_gold = new alvision.Mat();
            src.convertTo(dst_gold, this.depth2, a, b);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth2 < alvision.MatrixType.CV_32F ? 1.0 : 1e-4);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA', 'GpuMat_ConvertTo', (case_name, test_name) => { return null;}, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.ALL_DEPTH,
    alvision.ALL_DEPTH,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// ensureSizeIsEnough

class EnsureSizeIsEnough extends alvision.cvtest.CUDA_TEST// : testing::TestWithParam<alvision.cuda.DeviceInfo>
{
    SetUp() : void
    {
        var devInfo = this.GET_PARAM < alvision.cuda.DeviceInfo>(0);
        alvision.cuda.setDevice(devInfo.deviceID());
    }
};

//CUDA_TEST_P(EnsureSizeIsEnough, BufferReuse)
class EnsureSizeIsEnough_BufferReuse extends EnsureSizeIsEnough
{
    public TestBody(): void {
        var buffer = new alvision.cuda.GpuMat (100, 100, alvision.MatrixType.CV_8U);
        var old = buffer;

        // don't reallocate memory
        alvision.cuda.ensureSizeIsEnough(10, 20, alvision.MatrixType.CV_8U, buffer);
        alvision.EXPECT_EQ(10, buffer.rows);
        alvision.EXPECT_EQ(20, buffer.cols);
        alvision.EXPECT_EQ(alvision.MatrixType.CV_8UC1, buffer.type());

        //TODO: find a way to implement this test
        //alvision.EXPECT_EQ(reinterpret_cast<intptr_t>(old.data), reinterpret_cast<intptr_t>(buffer.data));

        // don't reallocate memory
        alvision.cuda.ensureSizeIsEnough(20, 30, alvision.MatrixType.CV_8U, buffer);
        alvision.EXPECT_EQ(20, buffer.rows);
        alvision.EXPECT_EQ(30, buffer.cols);
        alvision.EXPECT_EQ(alvision.MatrixType.CV_8UC1, buffer.type());
        //alvision.EXPECT_EQ(reinterpret_cast<intptr_t>(old.data), reinterpret_cast<intptr_t>(buffer.data));
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA', 'EnsureSizeIsEnough', (case_name, test_name) => { return null; },new alvision.cvtest.Combine([ alvision.ALL_DEVICES]));

//#endif // HAVE_CUDA
