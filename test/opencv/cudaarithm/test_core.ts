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
// Merge

//PARAM_TEST_CASE(Merge, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, Channels, UseRoi)
class Merge extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected depth: alvision.int;
    protected channels: alvision.int;
    protected useRoi: boolean;

    SetUp() : void
    {
        this.devInfo =  this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =     this.GET_PARAM<alvision.Size>(1);
        this.depth =    this.GET_PARAM<alvision.int>(2);
        this.channels = this.GET_PARAM<alvision.int>(3);
        this.useRoi =   this.GET_PARAM<boolean>(4);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Merge, Accuracy)
class Merge_Accuracy extends Merge
{
    TestBody() {
        let src = new Array<alvision.Mat>(this.channels.valueOf());
        //src.reserve(channels);
        for (let i = 0; i < this.channels; ++i)
            src.push(new alvision.Mat(this.size, this.depth, alvision.Scalar.all(i)));

        let d_src = new Array<alvision.cuda.GpuMat>();
        for (let i = 0; i < this.channels; ++i)
            d_src.push(alvision.loadMat(src[i], this.useRoi));

        if (this.depth == alvision.MatrixType.CV_64F && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat();
                alvision.cudaarithm.merge(d_src, dst);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = new alvision.cuda.GpuMat();
            alvision.cudaarithm.merge(d_src, dst);

            let dst_gold = new alvision.Mat();
            alvision.merge(src, dst_gold);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Merge', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.ALL_DEPTH,
    [1, 2, 3, 4],
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Split

//PARAM_TEST_CASE(Split, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, Channels, UseRoi)
class Split extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected depth: alvision.int;
    protected channels: alvision.int;
    protected useRoi: boolean;

    protected type: alvision.int;

    SetUp() : void
    {
        this.devInfo =  this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =     this.GET_PARAM<alvision.Size>(1);
        this.depth =    this.GET_PARAM<alvision.int>(2);
        this.channels = this.GET_PARAM<alvision.int>(3);
        this.useRoi =   this.GET_PARAM<boolean>(4);

        alvision.cuda.setDevice(this.devInfo.deviceID());

        this.type = alvision.MatrixType.CV_MAKETYPE(this.depth, this.channels);
    }
};

//CUDA_TEST_P(Split, Accuracy)
class Split_Accuracy extends Split
{
    TestBody(): void {
        let src = alvision.randomMat(this.size, this.type);

        if (this.depth == alvision.MatrixType.CV_64F && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new Array<alvision.cuda.GpuMat>();
                alvision.cudaarithm.split(alvision.loadMat(src), dst);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = new Array<alvision.cuda.GpuMat>();
            alvision.cudaarithm.split(alvision.loadMat(src, this.useRoi), dst);

            let dst_gold = new Array<alvision.Mat>();
            alvision.split(src, dst_gold);

            alvision.ASSERT_EQ(dst_gold.length, dst.length);

            for (let i = 0; i < dst_gold.length; ++i)
            {
                alvision.EXPECT_MAT_NEAR(dst_gold[i], dst[i], 0.0);
            }
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Split', (case_name, test_name) => { return null;}, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.ALL_DEPTH,
    [1, 2, 3, 4],
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Transpose

//PARAM_TEST_CASE(Transpose, alvision.cuda.DeviceInfo, alvision.Size, MatType, UseRoi)
class Transpose extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected type: alvision.int;
    protected useRoi: boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.type =    this.GET_PARAM<alvision.int>(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Transpose, Accuracy)
class Transpose_Accuracy extends Transpose
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.type);

        if (alvision.MatrixType.CV_MAT_DEPTH(this.type) == alvision.MatrixType.CV_64F && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat();
                alvision.cudaarithm.transpose(alvision.loadMat(src), dst);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(new alvision.Size(this.size.height, this.size.width), this.type, this.useRoi);
            alvision.cudaarithm.transpose(alvision.loadMat(src, this.useRoi), dst);

            let dst_gold = new alvision.Mat();
            alvision.transpose(src, dst_gold);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Transpose', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8UC1,
     alvision.MatrixType.CV_8UC4,
     alvision.MatrixType.CV_16UC2,
     alvision.MatrixType.CV_16SC2,
     alvision.MatrixType.CV_32SC1,
     alvision.MatrixType.CV_32SC2,
     alvision.MatrixType.CV_64FC1],
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Flip

enum FlipCode{FLIP_BOTH = 0, FLIP_X = 1, FLIP_Y = -1};
//CV_ENUM(FlipCode, FLIP_BOTH, FLIP_X, FLIP_Y)
const ALL_FLIP_CODES = [FlipCode.FLIP_BOTH, FlipCode.FLIP_X, FlipCode.FLIP_Y];

//PARAM_TEST_CASE(Flip, alvision.cuda.DeviceInfo, alvision.Size, MatType, FlipCode, UseRoi)
class Flip extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected type: alvision.int;
    protected flip_code: alvision.int;
    protected useRoi: boolean;

    SetUp() : void
    {
        this.devInfo =   this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =      this.GET_PARAM<alvision.Size>(1);
        this.type =      this.GET_PARAM<alvision.int>(2);
        this.flip_code = this.GET_PARAM<alvision.int>(3);
        this.useRoi =    this.GET_PARAM<boolean>(4);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Flip, Accuracy)
class Flip_Accuracy extends Flip
{
    TestBody(): void {
        let src = alvision.randomMat(this.size, this.type);

        let dst = alvision.createMat(this.size, this.type, this.useRoi);
        alvision.cudaarithm.flip(alvision.loadMat(src, this.useRoi), dst, this.flip_code);

        let dst_gold = new alvision.Mat();
        alvision.flip(src, dst_gold, this.flip_code);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Flip', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8UC1,
    alvision.MatrixType.CV_8UC3,
    alvision.MatrixType.CV_8UC4,
    alvision.MatrixType.CV_16UC1,
    alvision.MatrixType.CV_16UC3,
    alvision.MatrixType.CV_16UC4,
    alvision.MatrixType.CV_32SC1,
    alvision.MatrixType.CV_32SC3,
    alvision.MatrixType.CV_32SC4,
    alvision.MatrixType.CV_32FC1,
    alvision.MatrixType.CV_32FC3,
    alvision.MatrixType.CV_32FC4],
    ALL_FLIP_CODES,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// LUT

//PARAM_TEST_CASE(LUT, alvision.cuda.DeviceInfo, alvision.Size, MatType, UseRoi)
class LUT extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected type: alvision.int;
    protected useRoi: boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.type =    this.GET_PARAM<alvision.int>(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(LUT, OneChannel)
class LUT_OneChannel extends LUT
{
    TestBody(): void {
        let src = alvision.randomMat(this.size, this.type);
        let lut = alvision.randomMat(new alvision.Size(256, 1),alvision.MatrixType. CV_8UC1);

        let lutAlg = alvision.cudaarithm.createLookUpTable(lut);

        let dst = alvision.createMat(this.size, alvision.MatrixType.CV_MAKETYPE(lut.depth(), src.channels()));
        lutAlg.transform(alvision.loadMat(src, this.useRoi), dst);

        let dst_gold = new alvision.Mat();
        alvision.LUT(src, lut, dst_gold);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(LUT, MultiChannel)
class LUT_MultiChannel extends LUT
{
    TestBody(): void {
        let src = alvision.randomMat(this.size, this.type);
        let lut = alvision.randomMat(new alvision.Size(256, 1), alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_8U, src.channels()));

        let lutAlg = alvision.cudaarithm.createLookUpTable(lut);

        let dst = alvision.createMat(this.size, alvision.MatrixType.CV_MAKETYPE(lut.depth(), src.channels()), this.useRoi);
        lutAlg.transform(alvision.loadMat(src, this.useRoi), dst);

        let dst_gold = new alvision.Mat();
        alvision.LUT(src, lut, dst_gold);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'LUT', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8UC1,alvision.MatrixType.CV_8UC3],
    alvision.WHOLE_SUBMAT]));

//////////////////////////////////////////////////////////////////////////////
// CopyMakeBorder

//namespace
//{
//    IMPLEMENT_PARAM_CLASS(Border, int)
//}

//PARAM_TEST_CASE(CopyMakeBorder, alvision.cuda.DeviceInfo, alvision.Size, MatType, Border, BorderType, UseRoi)
class CopyMakeBorder extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected type: alvision.int; 
    protected border: alvision.int;
    protected borderType: alvision.BorderTypes;
    protected useRoi: boolean;

    SetUp() : void
    {
        this.devInfo =    this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =       this.GET_PARAM<alvision.Size>(1);
        this.type =       this.GET_PARAM<alvision.int>(2);
        this.border = this.GET_PARAM<alvision.int>(3);
        this.borderType = this.GET_PARAM<alvision.BorderTypes>(4);
        this.useRoi =     this.GET_PARAM<boolean>(5);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(CopyMakeBorder, Accuracy)
class CopyMakeBorder_Accuracy extends CopyMakeBorder
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.type);
        let val = alvision.randomScalar(0, 255);

        let dst = alvision.createMat(new alvision.Size(this.size.width.valueOf() + 2 * this.border.valueOf(), this.size.height.valueOf() + 2 * this.border.valueOf()), this.type, this.useRoi);
        alvision.cudaarithm.copyMakeBorder(alvision.loadMat(src, this.useRoi), dst, this.border, this.border, this.border, this.border, this.borderType, val);

        let dst_gold = new alvision.Mat();
        alvision.copyMakeBorder(src, dst_gold, this.border, this.border, this.border, this.border, this.borderType, val);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'CopyMakeBorder', (case_name, test_name) => { return null;}, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8UC1,
    alvision.MatrixType.CV_8UC3,
    alvision.MatrixType.CV_8UC4,
    alvision.MatrixType.CV_16UC1,
    alvision.MatrixType.CV_16UC3,
    alvision.MatrixType.CV_16UC4,
    alvision.MatrixType.CV_32FC1,
    alvision.MatrixType.CV_32FC3,
    alvision.MatrixType.CV_32FC4],
    [1,10,50],
    alvision.ALL_BORDER_TYPES,
    alvision.WHOLE_SUBMAT]));

//#endif // HAVE_CUDA
