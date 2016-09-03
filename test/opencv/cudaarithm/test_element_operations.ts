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

//////////////////////////////////////////////////////////////////////////////
 Add_Array

//PARAM_TEST_CASE(Add_Array, alvision.cuda.DeviceInfo, alvision.Size, alvision.pair < MatDepth, MatDepth >, Channels, this.useRoi)
class Add_Array extends alvision.cvtest.CUDA_TEST {
    constructor(test_case_name: string, test_name: string) {
        super(test_case_name, test_name);
    }
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected depth : alvision.pair<alvision.MatrixType, alvision.MatrixType>;
    protected channels: alvision.int;
    protected useRoi: boolean;

    protected stype: alvision.int;
    protected dtype: alvision.int;

    SetUp(): void {
        this.devInfo = <any>this.GET_PARAM(0);
        this.size =    <any>this.GET_PARAM(1);
        this.depth =   <any>this.GET_PARAM(2);
        this.channels =<any>this.GET_PARAM(3);
        this.useRoi =  <any>this.GET_PARAM(4);

        alvision.cuda.setDevice(this.devInfo.deviceID());

        this.stype = alvision.MatrixType.CV_MAKETYPE(this.depth.first, this.channels);
        this.dtype = alvision.MatrixType.CV_MAKETYPE(this.depth.second, this.channels);
    }
}

//CUDA_TEST_P(Add_Array, Accuracy)
class Add_Array_Accuracy extends Add_Array
{
    TestBody(): void {
        var mat1 = alvision.cvtest.randomMat(this.size, this.stype);
        var mat2 = alvision.cvtest.randomMat(this.size, this.stype);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                var dst = new alvision.cuda.GpuMat();
                alvision.cudaarithm.add(alvision.loadMat(mat1), alvision.loadMat(mat2), dst, new alvision.cuda.GpuMat(), this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            var dst = alvision.createMat(this.size, this.dtype, this.useRoi);
            dst.setTo(alvision.Scalar.all(0));
            alvision.cudaarithm.add(alvision.loadMat(mat1, this.useRoi), alvision.loadMat(mat2, this.useRoi), dst,new  alvision.cuda.GpuMat(), this.depth.second);

            var dst_gold = new alvision.Mat (this.size, this.dtype, alvision.Scalar.all(0));
            alvision.add(mat1, mat2, dst_gold, null, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth.first >= alvision.MatrixType.CV_32F || this.depth.second >= alvision.MatrixType.CV_32F ? 1e-4 : 0.0);
        }
    }
}

//alvision.cvtest.TEST('Add_Array', 'Accuracy', () => { var test = new Add_Array_Accuracy(); test.test(); });

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Accuracy', (case_name, test_name) => { return null; },new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.DEPTH_PAIRS,
    alvision.ALL_CHANNELS,
    alvision.WHOLE_SUBMAT]));


//TODO: implement...

//PARAM_TEST_CASE(Add_Array_Mask, alvision.cuda.DeviceInfo, alvision.Size, alvision.pair<MatDepth, MatDepth>, this.useRoi)
class Add_Array_Mask extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size 
    protected depth: alvision.pair<alvision.MatrixType, alvision.MatrixType>;
    protected useRoi: boolean;

    protected stype: alvision.int;
    protected dtype: alvision.int;

    SetUp() : void
    {
        this.devInfo =  this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =     this.GET_PARAM<alvision.Size>(1);
        this.depth =    this.GET_PARAM<alvision.pair<alvision.MatrixType, alvision.MatrixType>>(2);
        this.useRoi =   this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());

        this.stype = alvision.MatrixType.CV_MAKETYPE(this.depth.first, 1);
        this.dtype = alvision.MatrixType.CV_MAKETYPE(this.depth.second, 1);
    }
};

//CUDA_TEST_P(Add_Array_Mask, Accuracy)
class Add_Array_Mask_Accuracy extends Add_Array_Mask
{
    TestBody() {
        let  mat1 = alvision.randomMat(this.size, this.stype);
        let  mat2 = alvision.randomMat(this.size, this.stype);
        let  mask = alvision.randomMat(this.size,alvision.MatrixType. CV_8UC1, 0, 2);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat();
                alvision.cudaarithm.add(alvision.loadMat(mat1), alvision.loadMat(mat2), dst, new alvision.cuda.GpuMat(), this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.dtype, this.useRoi);
            dst.setTo(alvision.Scalar.all(0));
            alvision.cudaarithm.add(alvision.loadMat(mat1, this.useRoi), alvision.loadMat(mat2, this.useRoi), dst, alvision.loadMat(mask, this.useRoi), this.depth.second);

            let dst_gold = new alvision.Mat (this.size, this.dtype, alvision.Scalar.all(0));
            alvision.add(mat1, mat2, dst_gold, mask, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth.first >= alvision.MatrixType.CV_32F || this.depth.second >= alvision.MatrixType.CV_32F ? 1e-4 : 0.0);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Add_Array_Mask', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.DEPTH_PAIRS,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Add_Scalar

//PARAM_TEST_CASE(Add_Scalar, alvision.cuda.DeviceInfo, alvision.Size, alvision.pair<MatDepth, MatDepth>, this.useRoi)
class Add_Scalar extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size 
    protected depth: alvision.pair<alvision.MatrixType, alvision.MatrixType> 
    protected useRoi: boolean;

    SetUp() 
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.depth = this.GET_PARAM<alvision.pair<alvision.MatrixType, alvision.MatrixType> >(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Add_Scalar, WithOutMask)
class Add_Scalar_WithOutMask extends Add_Scalar
{
    TestBody() {
        let mat =alvision. randomMat(this.size, this.depth.first);
        let val =alvision. randomScalar(0, 255);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat();
                alvision.cudaarithm.add(alvision.loadMat(mat), val, dst, new alvision.cuda.GpuMat(), this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth.second, this.useRoi);
            dst.setTo(alvision.Scalar.all(0));
            alvision.cudaarithm.add(alvision.loadMat(mat, this.useRoi), val, dst, new alvision.cuda.GpuMat(), this.depth.second);

            let dst_gold = new alvision.Mat (this.size, this.depth.second, alvision.Scalar.all(0));
            alvision.add(mat, val, dst_gold, null, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth.first >= alvision.MatrixType.CV_32F || this.depth.second >= alvision.MatrixType.CV_32F ? 1e-4 : 1.0);
        }
    }
}

//CUDA_TEST_P(Add_Scalar, WithMask)
class Add_Scalar_WithMask extends Add_Scalar
{
    TestBody() {
        let mat = alvision.randomMat(this.size, this.depth.first);
        let val = alvision.randomScalar(0, 255);
        let mask = alvision.randomMat(this.size, alvision.MatrixType.CV_8UC1, 0.0, 2.0);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat();
                alvision.cudaarithm.add(alvision.loadMat(mat), val, dst,new  alvision.cuda.GpuMat(), this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth.second, this.useRoi);
            dst.setTo(alvision.Scalar.all(0));
            alvision.cudaarithm.add(alvision.loadMat(mat, this.useRoi), val, dst, alvision.loadMat(mask, this.useRoi), this.depth.second);

            let dst_gold = new alvision.Mat (this.size, this.depth.second, alvision.Scalar.all(0));
            alvision.add(mat, val, dst_gold, mask, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth.first >= alvision.MatrixType.CV_32F || this.depth.second >= alvision.MatrixType.CV_32F ? 1e-4 : 1.0);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Add_Scalar', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.DEPTH_PAIRS,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Add_Scalar_First

//PARAM_TEST_CASE(Add_Scalar_First, alvision.cuda.DeviceInfo, alvision.Size, alvision.pair<MatDepth, MatDepth>, this.useRoi)
class Add_Scalar_First extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected  depth : alvision.pair<alvision.MatrixType, alvision.MatrixType>;
    protected useRoi : boolean;

    SetUp()  :void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.depth = this.GET_PARAM < alvision.pair<alvision.MatrixType, alvision.MatrixType>>(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Add_Scalar_First, WithOutMask)
class Add_Scalar_First_WithOutMask extends Add_Scalar_First
{
    TestBody() {
        let mat = alvision.randomMat(this.size, this.depth.first);
        let val = alvision.randomScalar(0, 255);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.add(val, alvision.loadMat(mat), dst, new alvision.cuda.GpuMat(), this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth.second, this.useRoi);
            dst.setTo(alvision.Scalar.all(0));
            alvision.cudaarithm.add(val, alvision.loadMat(mat, this.useRoi), dst, new alvision.cuda.GpuMat(), this.depth.second);

            let dst_gold = new alvision.Mat (this.size, this.depth.second, alvision.Scalar.all(0));
            alvision.add(val, mat, dst_gold, null, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth.first >= alvision.MatrixType.CV_32F || this.depth.second >= alvision.MatrixType.CV_32F ? 1e-4 : 0.0);
        }
    }
}

//CUDA_TEST_P(Add_Scalar_First, WithMask)
class Add_Scalar_First_WithMask extends Add_Scalar_First
{
    TestBody() {
        let mat = alvision.randomMat(this.size, this.depth.first);
        let val = alvision.randomScalar(0, 255);
        let mask = alvision.randomMat(this.size, alvision.MatrixType.CV_8UC1, 0.0, 2.0);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.add(val, alvision.loadMat(mat), dst, new alvision.cuda.GpuMat(), this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth.second, this.useRoi);
            dst.setTo(alvision.Scalar.all(0));
            alvision.cudaarithm.add(val, alvision.loadMat(mat, this.useRoi), dst, alvision.loadMat(mask, this.useRoi), this.depth.second);

            let dst_gold = new alvision.Mat (this.size, this.depth.second, alvision.Scalar.all(0));
            alvision.add(val, mat, dst_gold, mask,this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth.first >= alvision.MatrixType.CV_32F || this.depth.second >= alvision.MatrixType.CV_32F ? 1e-4 : 0.0);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Add_Scalar_First', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.DEPTH_PAIRS,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Subtract_Array

//PARAM_TEST_CASE(Subtract_Array, alvision.cuda.DeviceInfo, alvision.Size, alvision.pair<MatDepth, MatDepth>, Channels, this.useRoi)
class Subtract_Array extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected  depth : alvision.pair<alvision.MatrixType, alvision.MatrixType>;
    protected channels : alvision.int;
    protected useRoi : boolean;

    protected stype : alvision.int;
    protected dtype : alvision.int;

    SetUp()
    {
        this.devInfo =  this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =     this.GET_PARAM<alvision.Size>(1);
        this.depth = this.GET_PARAM < alvision.pair<alvision.MatrixType, alvision.MatrixType>>(2);
        this.channels = this.GET_PARAM<alvision.int>(3);
        this.useRoi =   this.GET_PARAM<boolean>(4);

        alvision.cuda.setDevice(this.devInfo.deviceID());

        this.stype = alvision.MatrixType.CV_MAKETYPE(this.depth.first, this.channels);
        this.dtype = alvision.MatrixType.CV_MAKETYPE(this.depth.second, this.channels);
    }
};

//CUDA_TEST_P(Subtract_Array, Accuracy)
class Subtract_Array_Accuracy extends Subtract_Array
{
    TestBody() {
        let mat1 = alvision.randomMat(this.size, this.stype);
        let mat2 = alvision.randomMat(this.size, this.stype);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.subtract(alvision.loadMat(mat1), alvision.loadMat(mat2), dst, new alvision.cuda.GpuMat(), this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.dtype, this.useRoi);
            dst.setTo(alvision.Scalar.all(0));
            alvision.cudaarithm.subtract(alvision.loadMat(mat1, this.useRoi), alvision.loadMat(mat2, this.useRoi), dst, new alvision.cuda.GpuMat(), this.depth.second);

            let dst_gold = new alvision.Mat (this.size, this.dtype, alvision.Scalar.all(0));
            alvision.subtract(mat1, mat2, dst_gold, null, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth.first >= alvision.MatrixType.CV_32F || this.depth.second >= alvision.MatrixType.CV_32F ? 1e-4 : 0.0);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Subtract_Array', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.DEPTH_PAIRS,
    alvision.ALL_CHANNELS,
    alvision.WHOLE_SUBMAT]));

//PARAM_TEST_CASE(Subtract_Array_Mask, alvision.cuda.DeviceInfo, alvision.Size, alvision.pair<MatDepth, MatDepth>, this.useRoi)
class Subtract_Array_Mask extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected  depth : alvision.pair<alvision.MatrixType, alvision.MatrixType>;
    protected useRoi : boolean;

    protected stype : alvision.int;
    protected dtype : alvision.int;

SetUp()
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.depth = this.GET_PARAM < alvision.pair<alvision.MatrixType, alvision.MatrixType>>(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());

        this.stype = alvision.MatrixType.CV_MAKETYPE(this.depth.first, 1);
        this.dtype = alvision.MatrixType.CV_MAKETYPE(this.depth.second, 1);
    }
};

//CUDA_TEST_P(Subtract_Array_Mask, Accuracy)
class Subtract_Array_Mask_Accuracy extends Subtract_Array_Mask
{
    TestBody() {
        let mat1 = alvision.randomMat(this.size, this.stype);
        let mat2 = alvision.randomMat(this.size, this.stype);
        let mask = alvision.randomMat(this.size, alvision.MatrixType.CV_8UC1, 0.0, 2.0);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.subtract(alvision.loadMat(mat1), alvision.loadMat(mat2), dst, new alvision.cuda.GpuMat(), this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.dtype, this.useRoi);
            dst.setTo(alvision.Scalar.all(0));
            alvision.cudaarithm.subtract(alvision.loadMat(mat1, this.useRoi), alvision.loadMat(mat2, this.useRoi), dst, alvision.loadMat(mask, this.useRoi), this.depth.second);

            let dst_gold = new alvision.Mat (this.size, this.dtype, alvision.Scalar.all(0));
            alvision.subtract(mat1, mat2, dst_gold, mask, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth.first >= alvision.MatrixType.CV_32F || this.depth.second >= alvision.MatrixType.CV_32F ? 1e-4 : 0.0);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Subtract_Array_Mask', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.DEPTH_PAIRS,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Subtract_Scalar

//PARAM_TEST_CASE(Subtract_Scalar, alvision.cuda.DeviceInfo, alvision.Size, alvision.pair<MatDepth, MatDepth>, this.useRoi)
class Subtract_Scalar extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected  depth : alvision.pair<alvision.MatrixType, alvision.MatrixType>;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.depth = this.GET_PARAM < alvision.pair<alvision.MatrixType, alvision.MatrixType>>(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Subtract_Scalar, WithOutMask)
class Subtract_Scalar_WithOutMask extends Subtract_Scalar
{
    TestBody() {
        let mat = alvision.randomMat(this.size, this.depth.first);
        let val = alvision.randomScalar(0, 255);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.subtract(alvision.loadMat(mat), val, dst, new alvision.cuda.GpuMat(), this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth.second, this.useRoi);
            dst.setTo(alvision.Scalar.all(0));
            alvision.cudaarithm.subtract(alvision.loadMat(mat, this.useRoi), val, dst,new alvision.cuda.GpuMat(), this.depth.second);

            let dst_gold = new alvision.Mat (this.size, this.depth.second, alvision.Scalar.all(0));
            alvision.subtract(mat, val, dst_gold, null, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth.first >= alvision.MatrixType.CV_32F || this.depth.second >= alvision.MatrixType.CV_32F ? 1e-4 : 1.0);
        }
    }
}

//CUDA_TEST_P(Subtract_Scalar, WithMask)
class Subtract_Scalar_WithMask extends Subtract_Scalar
{
    TestBody() {
        let mat = alvision.randomMat(this.size, this.depth.first);
        let val = alvision.randomScalar(0, 255);
        let mask = alvision.randomMat(this.size, alvision.MatrixType.CV_8UC1, 0.0, 2.0);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.subtract(alvision.loadMat(mat), val, dst, new alvision.cuda.GpuMat(), this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth.second, this.useRoi);
            dst.setTo(alvision.Scalar.all(0));
            alvision.cudaarithm.subtract(alvision.loadMat(mat, this.useRoi), val, dst, alvision.loadMat(mask, this.useRoi), this.depth.second);

            let dst_gold = new alvision.Mat (this.size, this.depth.second, alvision.Scalar.all(0));
            alvision.subtract(mat, val, dst_gold, mask, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth.first >= alvision.MatrixType.CV_32F || this.depth.second >= alvision.MatrixType.CV_32F ? 1e-4 : 1.0);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Subtract_Scalar', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.DEPTH_PAIRS,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Subtract_Scalar_First

//PARAM_TEST_CASE(Subtract_Scalar_First, alvision.cuda.DeviceInfo, alvision.Size, alvision.pair<MatDepth, MatDepth>, this.useRoi)
class Subtract_Scalar_First extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected  depth : alvision.pair<alvision.MatrixType, alvision.MatrixType>;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.depth = this.GET_PARAM<alvision.pair<alvision.MatrixType, alvision.MatrixType>>(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Subtract_Scalar_First, WithOutMask)
class Subtract_Scalar_First_WithOutMask extends Subtract_Scalar_First
{
    TestBody() {
        let mat = alvision.randomMat(this.size, this.depth.first);
        let val = alvision.randomScalar(0, 255);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.subtract(val, alvision.loadMat(mat), dst,new  alvision.cuda.GpuMat(),this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth.second, this.useRoi);
            dst.setTo(alvision.Scalar.all(0));
            alvision.cudaarithm.subtract(val,alvision.loadMat(mat, this.useRoi), dst, new alvision.cuda.GpuMat(), this.depth.second);

            let dst_gold = new alvision.Mat (this.size, this.depth.second, alvision.Scalar.all(0));
            alvision.subtract(val, mat, dst_gold, null, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth.first >= alvision.MatrixType.CV_32F || this.depth.second >= alvision.MatrixType.CV_32F ? 1e-4 : 0.0);
        }
    }
}

//CUDA_TEST_P(Subtract_Scalar_First, WithMask)
class Subtract_Scalar_First_WithMask extends Subtract_Scalar_First
{
    TestBody() {
        let mat = alvision.randomMat(this.size, this.depth.first);
        let val = alvision.randomScalar(0, 255);
        let mask = alvision.randomMat(this.size, alvision.MatrixType.CV_8UC1, 0.0, 2.0);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.subtract(val, alvision.loadMat(mat), dst,new alvision.cuda.GpuMat(), this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth.second, this.useRoi);
            dst.setTo(alvision.Scalar.all(0));
            alvision.cudaarithm.subtract(val, alvision.loadMat(mat, this.useRoi), dst, alvision.loadMat(mask, this.useRoi),this.depth.second);

            let dst_gold = new alvision.Mat (this.size, this.depth.second, alvision.Scalar.all(0));
            alvision.subtract(val, mat, dst_gold, mask, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth.first >= alvision.MatrixType.CV_32F || this.depth.second >= alvision.MatrixType.CV_32F ? 1e-4 : 0.0);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Subtract_Scalar_First', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.DEPTH_PAIRS,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Multiply_Array

//PARAM_TEST_CASE(Multiply_Array, alvision.cuda.DeviceInfo, alvision.Size, alvision.pair<MatDepth, MatDepth>, Channels, this.useRoi)
class Multiply_Array extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected  depth : alvision.pair<alvision.MatrixType, alvision.MatrixType>;
    protected channels : alvision.int;
    protected useRoi : boolean;

    protected stype : alvision.int;
    protected dtype : alvision.int;

    SetUp():void
    {
        this.devInfo =  this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =     this.GET_PARAM<alvision.Size>(1);
        this.depth = this.GET_PARAM<alvision.pair<alvision.MatrixType, alvision.MatrixType>>(2);
        this.channels = this.GET_PARAM<alvision.int>(3);
        this.useRoi =   this.GET_PARAM<boolean>(4);

        alvision.cuda.setDevice(this.devInfo.deviceID());

        this.stype = alvision.MatrixType.CV_MAKETYPE(this.depth.first, this.channels);
        this.dtype = alvision.MatrixType.CV_MAKETYPE(this.depth.second, this.channels);
    }
};

//CUDA_TEST_P(Multiply_Array, WithOutScale)
class Multiply_Array_WithOutScale extends Multiply_Array
{
    TestBody() {
        let mat1 = alvision.randomMat(this.size, this.stype);
        let mat2 = alvision.randomMat(this.size, this.stype);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.multiply(alvision.loadMat(mat1), alvision.loadMat(mat2), dst, 1,this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.dtype, this.useRoi);
            alvision.cudaarithm.multiply(alvision.loadMat(mat1, this.useRoi), alvision.loadMat(mat2, this.useRoi), dst, 1,this.depth.second);

            let dst_gold = new alvision.Mat ();
            alvision.multiply(mat1, mat2, dst_gold, 1, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth.first >= alvision.MatrixType.CV_32F || this.depth.second >= alvision.MatrixType.CV_32F ? 1e-2 : 0.0);
        }
    }
}

//CUDA_TEST_P(Multiply_Array, WithScale)
class Multiply_Array_WithScale extends Multiply_Array
{
    TestBody() {
        let mat1 = alvision.randomMat(this.size, this.stype);
        let mat2 = alvision.randomMat(this.size, this.stype);
        let scale = alvision.randomDouble(0.0, 255.0);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.multiply(alvision.loadMat(mat1), alvision.loadMat(mat2), dst, scale,this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.dtype, this.useRoi);
            alvision.cudaarithm.multiply(alvision.loadMat(mat1, this.useRoi), alvision.loadMat(mat2, this.useRoi), dst, scale, this.depth.second);

            let dst_gold = new alvision.Mat ();
            alvision.multiply(mat1, mat2, dst_gold, scale, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 2.0);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Multiply_Array', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.DEPTH_PAIRS,
    alvision.ALL_CHANNELS,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Multiply_Array_Special

//PARAM_TEST_CASE(Multiply_Array_Special, alvision.cuda.DeviceInfo, alvision.Size, this.useRoi)
class Multiply_Array_Special extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.useRoi =  this.GET_PARAM<boolean>(2);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Multiply_Array_Special, Case_8UC4x_32FC1)
class Multiply_Array_Special_Case_8UC4x_32FC1 extends Multiply_Array_Special
{
    TestBody() {
        let mat1 = alvision.randomMat(this.size, alvision.MatrixType.CV_8UC4);
        let mat2 = alvision.randomMat(this.size, alvision.MatrixType.CV_32FC1);

        let dst = alvision.createMat(this.size, alvision.MatrixType.CV_8UC4, this.useRoi);
        alvision.cudaarithm.multiply(alvision.loadMat(mat1, this.useRoi), alvision.loadMat(mat2, this.useRoi), dst);

        let h_dst = new alvision.Mat (dst);

        for (let y = 0; y < h_dst.rows(); ++y)
        {
            const mat1_row = mat1.ptr<alvision.Vecb>("Vec4b",y);
            const mat2_row = mat2.ptr<alvision.float>("float", y);
            const dst_row = h_dst.ptr<alvision.Vecb>("Vec4b",y);

            for (let x = 0; x < h_dst.cols(); ++x)
            {
                let val1 = mat1_row[x];
                let val2 = mat2_row[x];
                let actual = dst_row[x];

                let gold = new alvision.Vecb();

                gold[0] = alvision.saturate_cast<alvision.uchar>(val1[0] * val2.valueOf(),"uchar");
                gold[1] = alvision.saturate_cast<alvision.uchar>(val1[1] * val2.valueOf(),"uchar");
                gold[2] = alvision.saturate_cast<alvision.uchar>(val1[2] * val2.valueOf(),"uchar");
                gold[3] = alvision.saturate_cast<alvision.uchar>(val1[3] * val2.valueOf(),"uchar");

                alvision.ASSERT_LE(Math.abs(gold[0] - actual[0]), 1.0);
                alvision.ASSERT_LE(Math.abs(gold[1] - actual[1]), 1.0);
                alvision.ASSERT_LE(Math.abs(gold[1] - actual[1]), 1.0);
                alvision.ASSERT_LE(Math.abs(gold[1] - actual[1]), 1.0);
            }
        }
    }
}

//CUDA_TEST_P(Multiply_Array_Special, Case_16SC4x_32FC1)
class Multiply_Array_Special_Case_16SC4x_32FC1 extends Multiply_Array_Special
{
    TestBody() {
        let mat1 = alvision.randomMat(this.size, alvision.MatrixType.CV_16SC4);
        let mat2 = alvision.randomMat(this.size, alvision.MatrixType.CV_32FC1);

        let dst = alvision.createMat(this.size, alvision.MatrixType.CV_16SC4, this.useRoi);
        alvision.cudaarithm.multiply(alvision.loadMat(mat1, this.useRoi), alvision.loadMat(mat2, this.useRoi), dst);

        let h_dst = new alvision.Mat (dst);

        for (let y = 0; y < h_dst.rows(); ++y)
        {
            const mat1_row = mat1.ptr<alvision.Vecs>("Vec4s",y);
            const mat2_row = mat2.ptr<alvision.float>("float", y);
            const dst_row = h_dst.ptr<alvision.Vecs>("Vec4s",y);

            for (let x = 0; x < h_dst.cols(); ++x)
            {
                let val1 = mat1_row[x];
                let val2 = mat2_row[x];
                let actual = dst_row[x];

                let gold = new alvision.Vecs();

                gold[0] = alvision.saturate_cast<alvision.short>(val1[0] * val2.valueOf(),"short");
                gold[1] = alvision.saturate_cast<alvision.short>(val1[1] * val2.valueOf(),"short");
                gold[2] = alvision.saturate_cast<alvision.short>(val1[2] * val2.valueOf(),"short");
                gold[3] = alvision.saturate_cast<alvision.short>(val1[3] * val2.valueOf(),"short");

                alvision.ASSERT_LE(Math.abs(gold[0] - actual[0]), 1.0);
                alvision.ASSERT_LE(Math.abs(gold[1] - actual[1]), 1.0);
                alvision.ASSERT_LE(Math.abs(gold[1] - actual[1]), 1.0);
                alvision.ASSERT_LE(Math.abs(gold[1] - actual[1]), 1.0);
            }
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Multiply_Array_Special', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Multiply_Scalar

//PARAM_TEST_CASE(Multiply_Scalar, alvision.cuda.DeviceInfo, alvision.Size, alvision.pair<MatDepth, MatDepth>, this.useRoi)
class Multiply_Scalar extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected  depth : alvision.pair<alvision.MatrixType, alvision.MatrixType>;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.depth = this.GET_PARAM<alvision.pair<alvision.MatrixType, alvision.MatrixType>>(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

///CUDA_TEST_P(Multiply_Scalar, WithOutScale)
class Multiply_Scalar_WithOutScale extends Multiply_Scalar {
    TestBody() {
        let mat = alvision.randomMat(this.size, this.depth.first);
        let val = alvision.randomScalar(0, 255);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.multiply(alvision.loadMat(mat), val, dst, 1, this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth.second, this.useRoi);
            alvision.cudaarithm.multiply(alvision.loadMat(mat, this.useRoi), val, dst, 1, this.depth.second);

            let dst_gold = new alvision.Mat ();
            alvision.multiply(mat, val, dst_gold, 1, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1.0);
        }
    }
}


//CUDA_TEST_P(Multiply_Scalar, WithScale)
class Multiply_Scalar_WithScale extends Multiply_Scalar
{
    TestBody() {
        let mat = alvision.randomMat(this.size, this.depth.first);
        let val = alvision.randomScalar(0, 255);
        let scale = alvision.randomDouble(0.0, 255.0);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.multiply(alvision.loadMat(mat), val, dst, scale, this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth.second, this.useRoi);
            alvision.cudaarithm.multiply(alvision.loadMat(mat, this.useRoi), val, dst, scale, this.depth.second);

            let dst_gold = new alvision.Mat ();
            alvision.multiply(mat, val, dst_gold, scale, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1.0);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Multiply_Scalar', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.DEPTH_PAIRS,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Multiply_Scalar_First

//PARAM_TEST_CASE(Multiply_Scalar_First, alvision.cuda.DeviceInfo, alvision.Size, alvision.pair<MatDepth, MatDepth>, this.useRoi)
class Multiply_Scalar_First extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected  depth : alvision.pair<alvision.MatrixType, alvision.MatrixType>;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size = this.GET_PARAM<alvision.Size>(1);
        this.depth = this.GET_PARAM<alvision.pair<alvision.MatrixType, alvision.MatrixType>>(2);
        this.useRoi = this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Multiply_Scalar_First, WithOutScale)
class Multiply_Scalar_First_WithOutScale extends Multiply_Scalar_First {
    TestBody() {
        let mat = alvision.randomMat(this.size, this.depth.first);
        let val = alvision.randomScalar(0, 255);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.multiply(val, alvision.loadMat(mat), dst, 1, this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth.second, this.useRoi);
            alvision.cudaarithm.multiply(val, alvision.loadMat(mat, this.useRoi), dst, 1, this.depth.second);

            let dst_gold = new alvision.Mat ();
            alvision.multiply(val, mat, dst_gold, 1, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1.0);
        }
    }
}


//CUDA_TEST_P(Multiply_Scalar_First, WithScale)
class Multiply_Scalar_First_WithScale extends Multiply_Scalar_First
{
    TestBody() {
        let mat = alvision.randomMat(this.size, this.depth.first);
        let val = alvision.randomScalar(0, 255);
        let scale = alvision.randomDouble(0.0, 255.0);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.multiply(val, alvision.loadMat(mat), dst, scale, this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth.second, this.useRoi);
            alvision.cudaarithm.multiply(val, alvision.loadMat(mat, this.useRoi), dst, scale, this.depth.second);

            let dst_gold = new alvision.Mat ();
            alvision.multiply(val, mat, dst_gold, scale, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1.0);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Multiply_Scalar_First', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.DEPTH_PAIRS,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Divide_Array

//PARAM_TEST_CASE(Divide_Array, alvision.cuda.DeviceInfo, alvision.Size, alvision.pair<MatDepth, MatDepth>, Channels, this.useRoi)
class Divide_Array extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected  depth : alvision.pair<alvision.MatrixType, alvision.MatrixType>;
    protected channels : alvision.int;
    protected useRoi : boolean;

    protected stype : alvision.int;
    protected dtype : alvision.int;

    SetUp() : void
    {
        this.devInfo =  this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =     this.GET_PARAM<alvision.Size>(1);
        this.depth = this.GET_PARAM<alvision.pair<alvision.MatrixType, alvision.MatrixType>>(2);
        this.channels = this.GET_PARAM<alvision.int>(3);
        this.useRoi =   this.GET_PARAM<boolean>(4);

        alvision.cuda.setDevice(this.devInfo.deviceID());

        this.stype = alvision.MatrixType.CV_MAKETYPE(this.depth.first, this.channels);
        this.dtype = alvision.MatrixType.CV_MAKETYPE(this.depth.second, this.channels);
    }
};

//CUDA_TEST_P(Divide_Array, WithOutScale)
class Divide_Array_WithOutScale extends Divide_Array
{
    TestBody() {
        let mat1 = alvision.randomMat(this.size, this.stype);
        let mat2 = alvision.randomMat(this.size, this.stype, 1.0, 255.0);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.divide(alvision.loadMat(mat1), alvision.loadMat(mat2), dst, 1, this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.dtype, this.useRoi);
            alvision.cudaarithm.divide(alvision.loadMat(mat1, this.useRoi), alvision.loadMat(mat2, this.useRoi), dst, 1, this.depth.second);

            let dst_gold = new alvision.Mat ();
            alvision.divide(mat1, mat2, dst_gold, 1, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth.first >= alvision.MatrixType.CV_32F || this.depth.second >= alvision.MatrixType.CV_32F ? 1e-4 : 1.0);
        }
    }

}

//CUDA_TEST_P(Divide_Array, WithScale)
class Divide_Array_WithScale extends Divide_Array
{
    TestBody() {
        let mat1 = alvision.randomMat(this.size, this.stype);
        let mat2 = alvision.randomMat(this.size, this.stype, 1.0, 255.0);
        let scale = alvision.randomDouble(0.0, 255.0);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.divide(alvision.loadMat(mat1), alvision.loadMat(mat2), dst, scale, this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.dtype, this.useRoi);
            alvision.cudaarithm.divide(alvision.loadMat(mat1, this.useRoi), alvision.loadMat(mat2, this.useRoi), dst, scale, this.depth.second);

            let dst_gold = new alvision.Mat ();
            alvision.divide(mat1, mat2, dst_gold, scale, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth.first >= alvision.MatrixType.CV_32F || this.depth.second >= alvision.MatrixType.CV_32F ? 1e-2 : 1.0);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Divide_Array', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.DEPTH_PAIRS,
    alvision.ALL_CHANNELS,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Divide_Array_Special

//PARAM_TEST_CASE(Divide_Array_Special, alvision.cuda.DeviceInfo, alvision.Size, this.useRoi)
class Divide_Array_Special extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.useRoi =  this.GET_PARAM<boolean>(2);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Divide_Array_Special, Case_8UC4x_32FC1)
class Divide_Array_Special_Case_8UC4x_32FC1 extends Divide_Array_Special
{
    TestBody() {
        let mat1 = alvision.randomMat(this.size, alvision.MatrixType.CV_8UC4);
        let mat2 = alvision.randomMat(this.size, alvision.MatrixType.CV_32FC1, 1.0, 255.0);

        let dst = alvision.createMat(this.size, alvision.MatrixType.CV_8UC4, this.useRoi);
        alvision.cudaarithm.divide(alvision.loadMat(mat1, this.useRoi), alvision.loadMat(mat2, this.useRoi), dst);

        let h_dst = new alvision.Mat (dst);

        for (let y = 0; y < h_dst.rows(); ++y)
        {
            const mat1_row = mat1.ptr<alvision.Vecb>("Vec4b",y);
            const mat2_row = mat2.ptr<alvision.float>("float", y);
            const dst_row = h_dst.ptr<alvision.Vecb>("Vec4b",y);

            for (let x = 0; x < h_dst.cols(); ++x)
            {
                let val1 = mat1_row[x];
                let val2 = mat2_row[x];
                let actual = dst_row[x];

                let gold = new alvision.Vecb();

                gold[0] = alvision.saturate_cast<alvision.uchar>(val1[0] / val2.valueOf(),"uchar");
                gold[1] = alvision.saturate_cast<alvision.uchar>(val1[1] / val2.valueOf(),"uchar");
                gold[2] = alvision.saturate_cast<alvision.uchar>(val1[2] / val2.valueOf(),"uchar");
                gold[3] = alvision.saturate_cast<alvision.uchar>(val1[3] / val2.valueOf(),"uchar");

                alvision.ASSERT_LE(Math.abs(gold[0] - actual[0]), 1.0);
                alvision.ASSERT_LE(Math.abs(gold[1] - actual[1]), 1.0);
                alvision.ASSERT_LE(Math.abs(gold[1] - actual[1]), 1.0);
                alvision.ASSERT_LE(Math.abs(gold[1] - actual[1]), 1.0);
            }
        }
    }
}

//CUDA_TEST_P(Divide_Array_Special, Case_16SC4x_32FC1)
class Divide_Array_Special_Case_16SC4x_32FC1 extends Divide_Array_Special
{
    TestBody() {
        let mat1 = alvision.randomMat(this.size, alvision.MatrixType.CV_16SC4);
        let mat2 = alvision.randomMat(this.size, alvision.MatrixType.CV_32FC1, 1.0, 255.0);

        let dst = alvision.createMat(this.size, alvision.MatrixType.CV_16SC4, this.useRoi);
        alvision.cudaarithm.divide(alvision.loadMat(mat1, this.useRoi), alvision.loadMat(mat2, this.useRoi), dst);

        let h_dst = new alvision.Mat (dst);

        for (let y = 0; y < h_dst.rows(); ++y)
        {
            const mat1_row = mat1.ptr<alvision.Vecs>("Vec4s",y);
            const mat2_row = mat2.ptr<alvision.float>("float", y);
            const dst_row = h_dst.ptr<alvision.Vecs>("Vec4s",y);

            for (let x = 0; x < h_dst.cols(); ++x)
            {
                let val1 = mat1_row[x];
                let val2 = mat2_row[x];
                let actual = dst_row[x];

                let gold = new alvision.Vecs();

                gold[0] = alvision.saturate_cast<alvision.short>(val1[0] / val2.valueOf(),"short");
                gold[1] = alvision.saturate_cast<alvision.short>(val1[1] / val2.valueOf(),"short");
                gold[2] = alvision.saturate_cast<alvision.short>(val1[2] / val2.valueOf(),"short");
                gold[3] = alvision.saturate_cast<alvision.short>(val1[3] / val2.valueOf(),"short");

                alvision.ASSERT_LE(Math.abs(gold[0] - actual[0]), 1.0);
                alvision.ASSERT_LE(Math.abs(gold[1] - actual[1]), 1.0);
                alvision.ASSERT_LE(Math.abs(gold[1] - actual[1]), 1.0);
                alvision.ASSERT_LE(Math.abs(gold[1] - actual[1]), 1.0);
            }
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Divide_Array_Special', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Divide_Scalar

//PARAM_TEST_CASE(Divide_Scalar, alvision.cuda.DeviceInfo, alvision.Size, alvision.pair<MatDepth, MatDepth>, this.useRoi)
class Divide_Scalar extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected  depth : alvision.pair<alvision.MatrixType, alvision.MatrixType>;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.depth = this.GET_PARAM < alvision.pair<alvision.MatrixType, alvision.MatrixType>>(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Divide_Scalar, WithOutScale)
class Divide_Scalar_WithOutScale extends Divide_Scalar
{
    TestBody() {
        let mat = alvision.randomMat(this.size, this.depth.first);
        let val = alvision.randomScalar(1.0, 255.0);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.divide(alvision.loadMat(mat), val, dst, 1, this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth.second, this.useRoi);
            alvision.cudaarithm.divide(alvision.loadMat(mat, this.useRoi), val, dst, 1, this.depth.second);

            let dst_gold = new alvision.Mat ();
            alvision.divide(mat, val, dst_gold, 1, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth.first >= alvision.MatrixType.CV_32F || this.depth.second >= alvision.MatrixType.CV_32F ? 1e-4 : 1.0);
        }
    }
}

//CUDA_TEST_P(Divide_Scalar, WithScale)
class Divide_Scalar_WithScale extends Divide_Scalar
{
    TestBody() {
        let mat = alvision.randomMat(this.size, this.depth.first);
        let val = alvision.randomScalar(1.0, 255.0);
        let scale = alvision.randomDouble(0.0, 255.0);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.divide(alvision.loadMat(mat), val, dst, scale, this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth.second, this.useRoi);
            alvision.cudaarithm.divide(alvision.loadMat(mat, this.useRoi), val, dst, scale, this.depth.second);

            let dst_gold = new alvision.Mat ();
            alvision.divide(mat, val, dst_gold, scale, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth.first >= alvision.MatrixType.CV_32F || this.depth.second >= alvision.MatrixType.CV_32F ? 1e-2 : 1.0);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Divide_Scalar', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.DEPTH_PAIRS,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Divide_Scalar_First

//PARAM_TEST_CASE(Divide_Scalar_First, alvision.cuda.DeviceInfo, alvision.Size, alvision.pair<MatDepth, MatDepth>, this.useRoi)
class Divide_Scalar_First extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected  depth : alvision.pair<alvision.MatrixType, alvision.MatrixType>;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.depth = this.GET_PARAM<alvision.pair<alvision.MatrixType, alvision.MatrixType>>(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Divide_Scalar_First, Accuracy)
class Divide_Scalar_First_Accuracy extends Divide_Scalar_First
{
    TestBody() {
        let scale = alvision.randomDouble(0.0, 255.0);
        let mat = alvision.randomMat(this.size, this.depth.first, 1.0, 255.0);

        if ((this.depth.first == alvision.MatrixType.CV_64F || this.depth.second == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.divide(new alvision.Scalar(scale), alvision.loadMat(mat), dst, 1.0, this.depth.second);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth.second, this.useRoi);
            alvision.cudaarithm.divide(new alvision.Scalar(scale), alvision.loadMat(mat, this.useRoi), dst, 1.0, this.depth.second);

            let dst_gold = new alvision.Mat ();
            alvision.divide(scale, mat, dst_gold, this.depth.second);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth.first >= alvision.MatrixType.CV_32F || this.depth.second >= alvision.MatrixType.CV_32F ? 1e-4 : 1.0);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Divide_Scalar_First', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.DEPTH_PAIRS,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// AbsDiff

//PARAM_TEST_CASE(AbsDiff, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, this.useRoi)
class AbsDiff extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected depth : alvision.int;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo =  this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =     this.GET_PARAM<alvision.Size>(1);
        this.depth =    this.GET_PARAM<alvision.int>(2);
        this.useRoi =   this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(AbsDiff, Array)
class AbsDiff_Array extends AbsDiff {
    TestBody() {
        let src1 = alvision.randomMat(this.size, this.depth);
        let src2 = alvision.randomMat(this.size, this.depth);

        if (this.depth == alvision.MatrixType.CV_64F && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.absdiff(alvision.loadMat(src1), alvision.loadMat(src2), dst);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth, this.useRoi);
            alvision.cudaarithm.absdiff(alvision.loadMat(src1, this.useRoi), alvision.loadMat(src2, this.useRoi), dst);

            let dst_gold = new alvision.Mat ();
            alvision.absdiff(src1, src2, dst_gold);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
        }
    }
}

//CUDA_TEST_P(AbsDiff, Scalar)
class AbsDiff_Scalar extends AbsDiff {
    TestBody() {
        let src = alvision.randomMat(this.size, this.depth);
        let val = alvision.randomScalar(0.0, 255.0);

        if (this.depth == alvision.MatrixType.CV_64F && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.absdiff(alvision.loadMat(src), val, dst);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth, this.useRoi);
            alvision.cudaarithm.absdiff(alvision.loadMat(src, this.useRoi), val, dst);

            let dst_gold = new alvision.Mat ();
            alvision.absdiff(src, val, dst_gold);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth <= alvision.MatrixType.CV_32F ? 1.0 : 1e-5);
        }
    }
}

//CUDA_TEST_P(AbsDiff, Scalar_First)
class AbsDiff_Scalar_First extends AbsDiff
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.depth);
        let val = alvision.randomScalar(0.0, 255.0);

        if (this.depth == alvision.MatrixType.CV_64F && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.absdiff(val, alvision.loadMat(src), dst);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth, this.useRoi);
            alvision.cudaarithm.absdiff(val, alvision.loadMat(src, this.useRoi), dst);

            let dst_gold = new alvision.Mat ();
            alvision.absdiff(val, src, dst_gold);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth <= alvision.MatrixType.CV_32F ? 1.0 : 1e-5);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'AbsDiff', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.ALL_DEPTH,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Abs

//PARAM_TEST_CASE(Abs, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, this.useRoi)
class Abs extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected depth : alvision.int;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.depth =   this.GET_PARAM<alvision.int>(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Abs, Accuracy)
class Abs_Accuracy extends Abs
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.depth);

        let dst = alvision.createMat(this.size, this.depth, this.useRoi);
        alvision.cudaarithm.abs(alvision.loadMat(src, this.useRoi), dst);

        let dst_gold = alvision.MatExpr.abs(src);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Abs', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_16S,alvision.MatrixType.CV_32F],
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Sqr

//PARAM_TEST_CASE(Sqr, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, this.useRoi)
class Sqr extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected depth : alvision.int;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.depth =   this.GET_PARAM<alvision.int>(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Sqr, Accuracy)
class Sqr_Accuracy extends Sqr
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.depth, 0, this.depth == alvision.MatrixType.CV_8U ? 16 : 255);

        let dst = alvision.createMat(this.size, this.depth, this.useRoi);
        alvision.cudaarithm.sqr(alvision.loadMat(src, this.useRoi), dst);

        let dst_gold = new alvision.Mat ();
        alvision.multiply(src, src, dst_gold);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Sqr', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
[alvision.MatrixType.CV_8U,
alvision.MatrixType.CV_16U,
alvision.MatrixType.CV_16S,
alvision.MatrixType.CV_32F],
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Sqrt

//namespace
//{
    //template <typename T> void sqrtImpl(const alvision.Mat& src, alvision.Mat& dst)
function sqrtImpl<T>(Ttype : string, src: alvision.Mat, dst: alvision.Mat ) : void
    {
        dst.create(src.size(), src.type());

        for (let y = 0; y < src.rows(); ++y)
        {
            for (let x = 0; x < src.cols(); ++x)
                dst.at<T>(Ttype, y, x).set(<any>(Math.sqrt(<any>(src.at<T>(Ttype, y, x).get()))));
        }
    }

function sqrtGold(src: alvision.Mat, dst: alvision.Mat): void {
    //typedef void (*func_t)(const alvision.Mat& src, alvision.Mat& dst);

    const funcs =
        [
            (src: alvision.Mat, dst: alvision.Mat )=>{ sqrtImpl<alvision.uchar>("uchar", src, dst);}, 
            (src: alvision.Mat, dst: alvision.Mat) => {sqrtImpl<alvision.schar>("schar", src, dst); },   
            (src: alvision.Mat, dst: alvision.Mat )=>{ sqrtImpl<alvision.ushort >("ushort",src,dst);}, 
            (src: alvision.Mat, dst: alvision.Mat )=>{ sqrtImpl<alvision.short > ("short",src,dst);},
            (src: alvision.Mat, dst: alvision.Mat )=>{ sqrtImpl<alvision.int >   ("int",src,dst);}, 
            (src: alvision.Mat, dst: alvision.Mat )=>{ sqrtImpl<alvision.float>    ("float",src,dst);}
        ];

    funcs[src.depth().valueOf()](src, dst);
}
//}

//PARAM_TEST_CASE(Sqrt, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, this.useRoi)
class Sqrt extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected depth : alvision.int;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.depth =   this.GET_PARAM<alvision.int>(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Sqrt, Accuracy)
class Sqrt_Accuracy extends Sqrt
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.depth);

        let dst = alvision.createMat(this.size, this.depth, this.useRoi);
        alvision.cudaarithm.sqrt(alvision.loadMat(src, this.useRoi), dst);

        let dst_gold = new alvision.Mat ();
        sqrtGold(src, dst_gold);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth < alvision.MatrixType.CV_32F ? 1.0 : 1e-5);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Sqrt', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8U,
    alvision.MatrixType.CV_16U,
    alvision.MatrixType.CV_16S,
    alvision.MatrixType.CV_32F],
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Log

//namespace
//{
    //template <typename T> void logImpl(const alvision.Mat& src, alvision.Mat& dst)
function logImpl<T>(Ttype : string, src: alvision.Mat, dst: alvision.Mat ) : void
    {
        dst.create(src.size(), src.type());

        for (var y = 0; y < src.rows(); ++y)
        {
            for (var x = 0; x < src.cols(); ++x)
                dst.at<T>(Ttype, y, x).set(<any>(Math.log(<any>(src.at<T>(Ttype, y, x)))));
        }
    }

function logGold(src: alvision.Mat, dst: alvision.Mat) : void
    {
        //typedef void (*func_t)(const alvision.Mat& src, alvision.Mat& dst);

        const funcs =
        [
                (src: alvision.Mat, dst: alvision.Mat )=>{ logImpl<alvision.uchar>("uchar", src, dst);}, 
                (src: alvision.Mat, dst: alvision.Mat) => { logImpl<alvision.schar>("schar", src, dst);}, 
                (src: alvision.Mat, dst: alvision.Mat )=>{logImpl < alvision.ushort >("ushort",src,dst);}, 
                (src: alvision.Mat, dst: alvision.Mat )=>{logImpl < alvision.short > ("short",src,dst);},
                (src: alvision.Mat, dst: alvision.Mat )=>{logImpl < alvision.int >   ("int",src,dst);},   
                (src: alvision.Mat, dst: alvision.Mat )=>{logImpl<alvision.float>    ("float",src,dst);}
        ];

        funcs[src.depth().valueOf()](src, dst);
    }
//}

//PARAM_TEST_CASE(Log, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, this.useRoi)
class Log extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected depth : alvision.int;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.depth =   this.GET_PARAM<alvision.int>(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Log, Accuracy)
class Log_Accuracy extends Log
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.depth, 1.0, 255.0);

        let dst = alvision.createMat(this.size, this.depth, this.useRoi);
        alvision.cudaarithm.log(alvision.loadMat(src, this.useRoi), dst);

        let dst_gold = new alvision.Mat ();
        logGold(src, dst_gold);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth < alvision.MatrixType.CV_32F ? 1.0 : 1e-6);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Log', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8U,
    alvision.MatrixType.CV_16U,
    alvision.MatrixType.CV_16S,
    alvision.MatrixType.CV_32F],
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Exp

//namespace
//{
    //template <typename T> void expImpl(const alvision.Mat& src, alvision.Mat& dst)
function expImpl<T>(Ttype, src: alvision.Mat, dst: alvision.Mat ): void 
    {
        dst.create(src.size(), src.type());

        for (let y = 0; y < src.rows(); ++y)
        {
            for (let x = 0; x < src.cols(); ++x)
                dst.at<T>(Ttype, y, x).set(alvision.saturate_cast<T>((Math.exp(<number><any>(src.at<T>(Ttype, y, x).get()))), Ttype));
        }
    }
function expImpl_float(src: alvision.Mat, dst: alvision.Mat ) : void
    {
        dst.create(src.size(), src.type());

        for (let y = 0; y < src.rows(); ++y)
        {
            for (let x = 0; x < src.cols(); ++x)
                dst.at<alvision.float>("float", y, x).set(Math.exp(<number>(src.at<alvision.float>("float", y, x).get())));
        }
    }

function expGold(src: alvision.Mat, dst: alvision.Mat): void {
    //typedef void (*func_t)(const alvision.Mat& src, alvision.Mat& dst);

    const funcs =
        [
            (src: alvision.Mat, dst: alvision.Mat) => { expImpl<alvision.uchar>("uchar", src, dst); },
            (src: alvision.Mat, dst: alvision.Mat) => { expImpl<alvision.schar>("schar", src, dst); },
            (src: alvision.Mat, dst: alvision.Mat) => { expImpl<alvision.ushort>("ushort", src, dst); },
            (src: alvision.Mat, dst: alvision.Mat) => { expImpl<alvision.short>("short", src, dst); },
            (src: alvision.Mat, dst: alvision.Mat) => { expImpl<alvision.int>("int", src, dst); },
            (src: alvision.Mat, dst: alvision.Mat) => { expImpl_float(src, dst); }
        ];

    funcs[src.depth().valueOf()](src, dst);
}


//PARAM_TEST_CASE(Exp, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, this.useRoi)
class Exp extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected depth : alvision.int;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.depth =   this.GET_PARAM<alvision.int>(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Exp, Accuracy)
class Exp_Accuracy extends Exp
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.depth, 0.0, 10.0);

        let dst = alvision.createMat(this.size, this.depth, this.useRoi);
        alvision.cudaarithm.exp(alvision.loadMat(src, this.useRoi), dst);

        let dst_gold = new alvision.Mat ();
        expGold(src, dst_gold);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth < alvision.MatrixType.CV_32F ? 1.0 : 1e-2);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Exp', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8U,
    alvision.MatrixType.CV_16U,
    alvision.MatrixType.CV_16S,
    alvision.MatrixType.CV_32F],
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Pow

//PARAM_TEST_CASE(Pow, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, this.useRoi)
class Pow extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected depth : alvision.int;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.depth =   this.GET_PARAM<alvision.int>(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Pow, Accuracy)
class Pow_Accuracy extends Pow
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.depth, 0.0, 10.0);
        let power = alvision.randomDouble(2.0, 4.0);

        //if (src.depth() < alvision.MatrixType.CV_32F)
        //    power = static_cast<int>(power);

        if (this.depth == alvision.MatrixType.CV_64F && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.pow(alvision.loadMat(src), power, dst);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth, this.useRoi);
            alvision.cudaarithm.pow(alvision.loadMat(src, this.useRoi), power, dst);

            let dst_gold = new alvision.Mat ();
            alvision.pow(src, power, dst_gold);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth < alvision.MatrixType.CV_32F ? 0.0 : 1e-1);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Pow', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.ALL_DEPTH,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Compare_Array

//CV_ENUM(CmpCode, alvision.CMP_EQ, alvision.CMP_GT, alvision.CMP_GE, alvision.CMP_LT, alvision.CMP_LE, alvision.CMP_NE)
//#define ALL_CMP_CODES testing::Values(CmpCode(alvision.CMP_EQ), CmpCode(alvision.CMP_NE), CmpCode(alvision.CMP_GT), CmpCode(alvision.CMP_GE), CmpCode(alvision.CMP_LT), CmpCode(alvision.CMP_LE))
const ALL_CMP_CODES = [alvision.CmpTypes.CMP_EQ, alvision.CmpTypes.CMP_NE, alvision.CmpTypes.CMP_GT, alvision.CmpTypes.CMP_GE, alvision.CmpTypes.CMP_LT, alvision.CmpTypes.CMP_LE];

//PARAM_TEST_CASE(Compare_Array, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, CmpCode, this.useRoi)
class Compare_Array extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected depth : alvision.int;
    protected cmp_code : alvision.CmpTypes;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo =  this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =     this.GET_PARAM<alvision.Size>(1);
        this.depth =    this.GET_PARAM<alvision.int>(2);
        this.cmp_code = this.GET_PARAM<alvision.CmpTypes>(3);
        this.useRoi =   this.GET_PARAM<boolean>(4);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Compare_Array, Accuracy)
class Compare_Array_Accuracy extends Compare_Array
{
    TestBody() {
        let src1 = alvision.randomMat(this.size, this.depth);
        let src2 = alvision.randomMat(this.size, this.depth);

        if (this.depth == alvision.MatrixType.CV_64F && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.compare(alvision.loadMat(src1), alvision.loadMat(src2), dst, this.cmp_code);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size,alvision.MatrixType. CV_8UC1, this.useRoi);
            alvision.cudaarithm.compare(alvision.loadMat(src1, this.useRoi), alvision.loadMat(src2, this.useRoi), dst, this.cmp_code);

            let dst_gold = new alvision.Mat ();
            alvision.compare(src1, src2, dst_gold, this.cmp_code);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Compare_Array', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.ALL_DEPTH,
    ALL_CMP_CODES,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// Compare_Scalar

//namespace
//{
    //template <template <typename> class Op, typename T>
function compareScalarImpl<T>(Ttype:string, src: alvision.Mat, sc: alvision.Scalar, dst: alvision.Mat, op: (val1 : T, val2:T)=>T ) : void
    {
        //Op<T> op;

        const  cn = src.channels();

        dst.create(src.size(), alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_8U, cn));

        for (let y = 0; y < src.rows(); ++y)
        {
            for (let x = 0; x < src.cols(); ++x)
            {
                for (let c = 0; c < cn; ++c)
                {
                    let src_val = src.at<T>(Ttype, y, x * cn.valueOf() + c);
                    let sc_val = alvision.saturate_cast<T>(sc.val[c],Ttype);
                    dst.at<alvision.uchar>("uchar", y, x * cn.valueOf() + c).set(((<any>op(<any>src_val.get(), <any>sc_val)) * 255));
                }
            }
        }
    }

function compareScalarGold(src: alvision.Mat, sc: alvision.Scalar, dst: alvision.Mat, cmpop: alvision.int ) : void
    {
        //typedef void (*func_t)(const alvision.Mat& src, alvision.Scalar sc, alvision.Mat& dst);
        const  funcs =
        [
            [(src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.uchar> ("uchar",src,sc,dst,(v1,v2)=>{return (v1 == v2) ? 1 : 0;});},             (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.uchar>         ("uchar", src,sc,dst,(v1,v2)=>{return (v1 > v2) ? 1 : 0;});},            (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.uchar>          ("uchar", src,sc,dst,(v1,v2)=>{return (v1 >= v2) ? 1 : 0;});},           (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.uchar>         ("uchar", src,sc,dst,(v1,v2)=>{return (v1 < v2) ? 1 : 0;});},           (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.uchar>         ("uchar", src,sc,dst,(v1,v2)=>{return (v1 <= v2) ? 1 : 0;});},           (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.uchar>         ("uchar", src,sc,dst,(v1,v2)=>{return (v1 != v2) ? 1 : 0;});}          ],
            [(src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.char>  ("char",src,sc,dst,(v1,v2)=>{return (v1 == v2) ? <any>1 : <any>0;});},    (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.char>          ("char",  src,sc,dst,(v1,v2)=>{return (v1 > v2) ? <any>1 : <any>0;});},  (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.char>           ("char",  src,sc,dst,(v1,v2)=>{return (v1 >= v2) ? <any>1 : <any>0;});}, (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.char>          ("char",  src,sc,dst,(v1,v2)=>{return (v1 < v2) ? <any>1 : <any>0;});}, (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.char>          ("char",  src,sc,dst,(v1,v2)=>{return (v1 <= v2) ? <any>1 : <any>0;});}, (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.char>          ("char",  src,sc,dst,(v1,v2)=>{return (v1 != v2) ? <any>1 : <any>0;});}],
            [(src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.ushort>("ushort",src,sc,dst,(v1,v2)=>{return (v1 == v2) ? 1 : 0;});},            (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.ushort>        ("ushort",src,sc,dst,(v1,v2)=>{return (v1 > v2) ? 1 : 0;});},            (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.ushort>         ("ushort",src,sc,dst,(v1,v2)=>{return (v1 >= v2) ? 1 : 0;});},           (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.ushort>        ("ushort",src,sc,dst,(v1,v2)=>{return (v1 < v2) ? 1 : 0;});},           (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.ushort>        ("ushort",src,sc,dst,(v1,v2)=>{return (v1 <= v2) ? 1 : 0;});},           (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.ushort>        ("ushort",src,sc,dst,(v1,v2)=>{return (v1 != v2) ? 1 : 0;});}          ],
            [(src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.short> ("short",src,sc,dst,(v1,v2)=>{return (v1 == v2) ? 1 : 0;});},             (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.short>         ("short", src,sc,dst,(v1,v2)=>{return (v1 > v2) ? 1 : 0;});},            (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.short>          ("short", src,sc,dst,(v1,v2)=>{return (v1 >= v2) ? 1 : 0;});},           (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.short>         ("short", src,sc,dst,(v1,v2)=>{return (v1 < v2) ? 1 : 0;});},           (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.short>         ("short", src,sc,dst,(v1,v2)=>{return (v1 <= v2) ? 1 : 0;});},           (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.short>         ("short", src,sc,dst,(v1,v2)=>{return (v1 != v2) ? 1 : 0;});}          ],
            [(src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.int>   ("int",src,sc,dst,(v1,v2)=>{return (v1 == v2) ? 1 : 0;});},               (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.int>           ("int",   src,sc,dst,(v1,v2)=>{return (v1 > v2) ? 1 : 0;});},            (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.int>            ("int",   src,sc,dst,(v1,v2)=>{return (v1 >= v2) ? 1 : 0;});},           (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.int>           ("int",   src,sc,dst,(v1,v2)=>{return (v1 < v2) ? 1 : 0;});},           (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.int>           ("int",   src,sc,dst,(v1,v2)=>{return (v1 <= v2) ? 1 : 0;});},           (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.int>           ("int",   src,sc,dst,(v1,v2)=>{return (v1 != v2) ? 1 : 0;});}          ],
            [(src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.float> ("float",src,sc,dst,(v1,v2)=>{return (v1 == v2) ? 1 : 0;});},             (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.float>         ("float", src,sc,dst,(v1,v2)=>{return (v1 > v2) ? 1 : 0;});},            (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.float>          ("float", src,sc,dst,(v1,v2)=>{return (v1 >= v2) ? 1 : 0;});},           (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.float>         ("float", src,sc,dst,(v1,v2)=>{return (v1 < v2) ? 1 : 0;});},           (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.float>         ("float", src,sc,dst,(v1,v2)=>{return (v1 <= v2) ? 1 : 0;});},           (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.float>         ("float", src,sc,dst,(v1,v2)=>{return (v1 != v2) ? 1 : 0;});}          ],
            [(src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.double>("double",src,sc,dst,(v1,v2)=>{return (v1 == v2) ? 1 : 0;});},            (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.double>        ("double",src,sc,dst,(v1,v2)=>{return (v1 > v2) ? 1 : 0;});},            (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.double>         ("double",src,sc,dst,(v1,v2)=>{return (v1 >= v2) ? 1 : 0;});},           (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.double>        ("double",src,sc,dst,(v1,v2)=>{return (v1 < v2) ? 1 : 0;});},           (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.double>        ("double",src,sc,dst,(v1,v2)=>{return (v1 <= v2) ? 1 : 0;});},           (src:alvision.Mat, sc:alvision.Scalar, dst:alvision.Mat)=>{compareScalarImpl<alvision.double>        ("double",src,sc,dst,(v1,v2)=>{return (v1 != v2) ? 1 : 0;});}          ]
        ];

        funcs[src.depth().valueOf()][cmpop.valueOf()](src, sc, dst);
    }
//}

//PARAM_TEST_CASE(Compare_Scalar, alvision.cuda.DeviceInfo, alvision.Size, MatType, CmpCode, this.useRoi)
class Compare_Scalar extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected type: alvision.int;
    protected cmp_code: alvision.int;
    protected useRoi: boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size = this.GET_PARAM<alvision.Size>(1);
        this.type =     this.GET_PARAM<alvision.int>(2);
        this.cmp_code = this.GET_PARAM<alvision.int>(3);
        this.useRoi =   this.GET_PARAM<boolean>(4);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Compare_Scalar, Accuracy)
class Compare_Scalar_Accuracy extends Compare_Scalar
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.type);
        let sc = alvision.randomScalar(0.0, 255.0);

        if (src.depth() < alvision.MatrixType.CV_32F) {
            sc.val[0] = Math.round(sc.val[0].valueOf());
            sc.val[1] = Math.round(sc.val[1].valueOf());
            sc.val[2] = Math.round(sc.val[2].valueOf());
            sc.val[3] = Math.round(sc.val[3].valueOf());
        }

        if (src.depth() == alvision.MatrixType.CV_64F && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.compare(alvision.loadMat(src), sc, dst, this.cmp_code);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_8U, src.channels()), this.useRoi);

            alvision.cudaarithm.compare(alvision.loadMat(src, this.useRoi), sc, dst,this. cmp_code);

            let dst_gold = new alvision.Mat ();
            compareScalarGold(src, sc, dst_gold, this.cmp_code);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Compare_Scalar', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8U, alvision.MatrixType.CV_64F, 1, 4],
    ALL_CMP_CODES,
    alvision.WHOLE_SUBMAT]));

//////////////////////////////////////////////////////////////////////////////
// Bitwise_Array

//PARAM_TEST_CASE(Bitwise_Array, alvision.cuda.DeviceInfo, alvision.Size, MatType)
class Bitwise_Array extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected type: alvision.int;

    protected  src1 : alvision.Mat;
    protected src2: alvision.Mat;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.type =    this.GET_PARAM<alvision.int>(2);

        alvision.cuda.setDevice(this.devInfo.deviceID());

        this.src1 = alvision.randomMat(this.size, this.type, 0.0,alvision.INT_MAX );
        this.src2 = alvision.randomMat(this.size, this.type, 0.0, alvision.INT_MAX);
    }
};

//CUDA_TEST_P(Bitwise_Array, Not)
class Bitwise_Array_Not extends Bitwise_Array
{
    TestBody() {
        let dst = new alvision.cuda.GpuMat ();
        alvision.cudaarithm.bitwise_not(alvision.loadMat(this.src1), dst);

        let dst_gold = alvision.MatExpr.op_BinaryNot(this.src1).toMat();

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(Bitwise_Array, Or)
class Bitwise_Array_Or extends Bitwise_Array
{
    TestBody() {
        let dst = new alvision.cuda.GpuMat ();
        alvision.cudaarithm.bitwise_or(alvision.loadMat(this.src1), alvision.loadMat(this.src2), dst);

        let dst_gold = alvision.MatExpr.op_Or(this.src1, this.src2).toMat();

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(Bitwise_Array, And)
class Bitwise_Array_And extends Bitwise_Array
{
    TestBody() {
        let dst = new alvision.cuda.GpuMat ();
        alvision.cudaarithm.bitwise_and(alvision.loadMat(this.src1), alvision.loadMat(this.src2), dst);

        let dst_gold = alvision.MatExpr.op_And(this.src1, this.src2).toMat();

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(Bitwise_Array, Xor)
class Bitwise_Array_Xor extends Bitwise_Array
{
    TestBody() {
        let dst = new alvision.cuda.GpuMat ();
        alvision.cudaarithm.bitwise_xor(alvision.loadMat(this.src1), alvision.loadMat(this.src2), dst);

        let dst_gold = alvision.MatExpr.op_Xor(this.src1 , this.src2).toMat();

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Bitwise_Array', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8U, alvision.MatrixType.CV_32S, 1, 4]
    ]));

//////////////////////////////////////////////////////////////////////////////
// Bitwise_Scalar

//PARAM_TEST_CASE(Bitwise_Scalar, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, Channels)
class Bitwise_Scalar extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected depth : alvision.int;
    protected channels : alvision.int;

    protected  src : alvision.Mat;
    protected  val : alvision.Scalar;

    SetUp() : void
    {
        this.devInfo =  this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =     this.GET_PARAM<alvision.Size>(1);
        this.depth =    this.GET_PARAM<alvision.int>(2);
        this.channels = this.GET_PARAM<alvision.int>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());

        this.src = alvision.randomMat(this.size, alvision.MatrixType.CV_MAKETYPE(this.depth, this.channels));
        let ival = alvision.randomScalar(0.0, alvision.INT_MAX);
        this.val = ival;
    }
};

//CUDA_TEST_P(Bitwise_Scalar, Or)
class Bitwise_Scalar_Or extends Bitwise_Scalar
{
    TestBody() {
        let dst = new alvision.cuda.GpuMat ();
        alvision.cudaarithm.bitwise_or(alvision.loadMat(this.src), this.val, dst);

        let dst_gold = new alvision.Mat ();
        alvision.bitwise_or(this.src, this.val, dst_gold);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(Bitwise_Scalar, And)
class Bitwise_Scalar_And extends Bitwise_Scalar
{
    TestBody() {
        let dst = new alvision.cuda.GpuMat ();
        alvision.cudaarithm.bitwise_and(alvision.loadMat(this.src), this.val, dst);

        let dst_gold = new alvision.Mat ();
        alvision.bitwise_and(this.src, this.val, dst_gold);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(Bitwise_Scalar, Xor)
class Bitwise_Scalar_Xor extends Bitwise_Scalar
{
    TestBody() {
        let dst = new alvision.cuda.GpuMat ();
        alvision.cudaarithm.bitwise_xor(alvision.loadMat(this.src), this.val, dst);

        let dst_gold = new alvision.Mat ();
        alvision.bitwise_xor(this.src, this.val, dst_gold);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Bitwise_Scalar', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8U,alvision.MatrixType.CV_16U,alvision.MatrixType.CV_32S],
    alvision.IMAGE_CHANNELS
    ]));

//////////////////////////////////////////////////////////////////////////////
// RShift

//namespace
//{
    //template <typename T> void rhiftImpl(const alvision.Mat& src, alvision.Scalar_<int> val, alvision.Mat& dst)
function rhiftImpl<T>(Ttype : string, src: alvision.Mat, val: alvision.Scalar_<alvision.int>, dst: alvision.Mat) : void
    {
        const  cn = src.channels();

        dst.create(src.size(), src.type());

        for (let y = 0; y < src.rows(); ++y)
        {
            for (let x = 0; x < src.cols(); ++x)
            {
                for (let c = 0; c < cn; ++c)
                    dst.at<T>(Ttype, y, x * cn.valueOf() + c).set(<any> (<any>(src.at<T>(Ttype, y, x * cn.valueOf() + c).get()) >> val.val[c].valueOf()));
            }
        }
    }

function rhiftGold(src: alvision.Mat, val: alvision.Scalar_<alvision.int>, dst: alvision.Mat): void {
    //typedef void (*func_t)(const alvision.Mat& src, alvision.Scalar_<int> val, alvision.Mat& dst);

    const funcs =
        [
            (src: alvision.Mat, val: alvision.Scalar_<alvision.int>, dst: alvision.Mat) => { rhiftImpl<alvision.uchar>("uchar", src, val, dst); },
            (src: alvision.Mat, val: alvision.Scalar_<alvision.int>, dst: alvision.Mat) => { rhiftImpl<alvision.schar>("schar", src, val, dst); },
            (src: alvision.Mat, val: alvision.Scalar_<alvision.int>, dst: alvision.Mat) => { rhiftImpl<alvision.ushort>("ushort", src, val, dst); },
            (src: alvision.Mat, val: alvision.Scalar_<alvision.int>, dst: alvision.Mat) => { rhiftImpl<alvision.short>("short", src, val, dst); },
            (src: alvision.Mat, val: alvision.Scalar_<alvision.int>, dst: alvision.Mat) => { rhiftImpl<alvision.int>("int", src, val, dst); }
        ];

    funcs[src.depth().valueOf()](src, val, dst);
}


//PARAM_TEST_CASE(RShift, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, Channels, this.useRoi)
class RShift extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected depth : alvision.int;
    protected channels : alvision.int;
    protected useRoi : boolean;

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

//CUDA_TEST_P(RShift, Accuracy)
class RShift_Accuracy extends RShift
{
    TestBody() {
        let type = alvision.MatrixType.CV_MAKETYPE(this.depth, this.channels);
        let src = alvision.randomMat(this.size, type);
        let val = alvision.randomScalar(0.0, 8.0);

        let dst = alvision.createMat(this.size, type, this.useRoi);
        alvision.cudaarithm.rshift(alvision.loadMat(src, this.useRoi), val, dst);

        let dst_gold = new alvision.Mat ();
        rhiftGold(src, val, dst_gold);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
    
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'RShift', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8U,
    alvision.MatrixType.CV_8S,
    alvision.MatrixType.CV_16U,
    alvision.MatrixType.CV_16S,
    alvision.MatrixType.CV_32S],
    alvision.IMAGE_CHANNELS,
    alvision.WHOLE_SUBMAT
    ]));

//////////////////////////////////////////////////////////////////////////////
// LShift

//namespace
//{
    //template <typename T> void lhiftImpl(const alvision.Mat& src, alvision.Scalar_<int> val, alvision.Mat& dst)
function lhiftImpl<T>(Ttype : string, src: alvision.Mat, val: alvision.Scalar_<alvision.int>, dst: alvision.Mat)
    {
        const cn = src.channels();

        dst.create(src.size(), src.type());

        for (let y = 0; y < src.rows(); ++y)
        {
            for (let x = 0; x < src.cols(); ++x)
            {
                for (let c = 0; c < cn; ++c)
                    dst.at<T>(Ttype, y, x * cn.valueOf() + c).set(<any> (<any>(src.at<T>(Ttype, y, x * cn.valueOf() + c).get()) << val.val[c].valueOf()));
            }
        }
    }

function lhiftGold(src: alvision.Mat, val: alvision.Scalar_<alvision.int>, dst: alvision.Mat): void {
    //typedef void (*func_t)(const alvision.Mat& src, alvision.Scalar_<int> val, alvision.Mat& dst);

    const funcs =
        [
            (src: alvision.Mat, val: alvision.Scalar_<alvision.int>, dst: alvision.Mat) => { lhiftImpl<alvision.uchar>("uchar", src, val, dst); },
            (src: alvision.Mat, val: alvision.Scalar_<alvision.int>, dst: alvision.Mat) => { lhiftImpl<alvision.schar>("schar", src, val, dst); },
            (src: alvision.Mat, val: alvision.Scalar_<alvision.int>, dst: alvision.Mat) => { lhiftImpl<alvision.ushort>("ushort", src, val, dst); },
            (src: alvision.Mat, val: alvision.Scalar_<alvision.int>, dst: alvision.Mat) => { lhiftImpl<alvision.short>("short", src, val, dst); },
            (src: alvision.Mat, val: alvision.Scalar_<alvision.int>, dst: alvision.Mat) => { lhiftImpl<alvision.int>("int", src, val, dst); }
        ];

    funcs[src.depth().valueOf()](src, val, dst);
}

//PARAM_TEST_CASE(LShift, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, Channels, this.useRoi)
class LShift extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected depth : alvision.int;
    protected channels : alvision.int;
    protected useRoi : boolean;

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

//CUDA_TEST_P(LShift, Accuracy)
class LShift_Accuracy extends LShift
{
    TestBody() {
        let type = alvision.MatrixType.CV_MAKETYPE(this.depth, this.channels);
        let src = alvision.randomMat(this.size, type);
        let val = alvision.randomScalar(0.0, 8.0);

        let dst = alvision.createMat(this.size, type, this.useRoi);
        alvision.cudaarithm.lshift(alvision.loadMat(src, this.useRoi), val, dst);

        let dst_gold = new alvision.Mat ();
        lhiftGold(src, val, dst_gold);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'LShift', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8U,alvision.MatrixType.CV_16U,alvision.MatrixType.CV_32S],
    alvision.IMAGE_CHANNELS,
    alvision.WHOLE_SUBMAT
]));

//////////////////////////////////////////////////////////////////////////////
// Min

//PARAM_TEST_CASE(Min, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, this.useRoi)
class Min extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected depth : alvision.int;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.depth =   this.GET_PARAM<alvision.int>(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Min, Array)
class Min_Array extends Min
{
    TestBody() {
        let src1 = alvision.randomMat(this.size, this.depth);
        let src2 = alvision.randomMat(this.size, this.depth);

        if (this.depth == alvision.MatrixType.CV_64F && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.min(alvision.loadMat(src1), alvision.loadMat(src2), dst);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth, this.useRoi);
            alvision.cudaarithm.min(alvision.loadMat(src1, this.useRoi), alvision.loadMat(src2, this.useRoi), dst);

            let dst_gold = new alvision.Mat();
            alvision.min(src1, src2, dst_gold);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
        }
    }
}

//CUDA_TEST_P(Min, Scalar)
class Min_Scalar extends Min
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.depth);
        let val = alvision.randomDouble(0.0, 255.0);

        if (this.depth == alvision.MatrixType.CV_64F && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.min(alvision.loadMat(src), new alvision.Scalar( val), dst);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth, this.useRoi);
            alvision.cudaarithm.min(alvision.loadMat(src, this.useRoi), new alvision.Scalar( val), dst);

            let dst_gold = new alvision.Mat();
            alvision.min(src, new alvision.Scalar(val),dst_gold);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth < alvision.MatrixType.CV_32F ? 1.0 : 1e-5);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Min', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.ALL_DEPTH,
    alvision.WHOLE_SUBMAT]));

//////////////////////////////////////////////////////////////////////////////
// Max

//PARAM_TEST_CASE(Max, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, this.useRoi)
class Max extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected depth : alvision.int;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.depth =   this.GET_PARAM<alvision.int>(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Max, Array)
class Max_Array extends Max
{
    TestBody() {
        let src1 = alvision.randomMat(this.size, this.depth);
        let src2 = alvision.randomMat(this.size, this.depth);

        if (this.depth ==alvision.MatrixType. CV_64F && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.max(alvision.loadMat(src1), alvision.loadMat(src2), dst);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth, this.useRoi);
            alvision.cudaarithm.max(alvision.loadMat(src1, this.useRoi), alvision.loadMat(src2, this.useRoi), dst);


            let dst_gold = new alvision.Mat();
                alvision.max(src1, src2,dst_gold);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
        }
    }
}

//CUDA_TEST_P(Max, Scalar)
class Max_Scalar extends Max
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.depth);
        let val = alvision.randomDouble(0.0, 255.0);

        if (this.depth == alvision.MatrixType.CV_64F && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.max(alvision.loadMat(src),new alvision.Scalar( val), dst);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.depth, this.useRoi);
            alvision.cudaarithm.max(alvision.loadMat(src, this.useRoi),new alvision.Scalar( val), dst);

            let dst_gold = new alvision.Mat();
            alvision.max(src, new alvision.Scalar(val),dst_gold);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth < alvision.MatrixType.CV_32F ? 1.0 : 1e-5);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Max', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.ALL_DEPTH,
    alvision.WHOLE_SUBMAT
    ]));

//////////////////////////////////////////////////////////////////////////////
// AddWeighted

//PARAM_TEST_CASE(AddWeighted, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, MatDepth, MatDepth, this.useRoi)
class AddWeighted extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected depth1: alvision.int;
    protected depth2: alvision.int;
    protected dst_depth: alvision.int;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo =   this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =      this.GET_PARAM<alvision.Size>(1);
        this.depth1 =    this.GET_PARAM<alvision.int>(2);
        this.depth2 =    this.GET_PARAM<alvision.int>(3);
        this.dst_depth = this.GET_PARAM<alvision.int>(4);
        this.useRoi =    this.GET_PARAM<boolean>(5);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(AddWeighted, Accuracy)
class AddWeighted_Accuracy extends AddWeighted
{
    TestBody() {
        let src1 = alvision.randomMat(this.size, this.depth1);
        let src2 = alvision.randomMat(this.size, this.depth2);
        let alpha = alvision.randomDouble(-10.0, 10.0);
        let beta = alvision.randomDouble(-10.0, 10.0);
        let gamma = alvision.randomDouble(-10.0, 10.0);

        if ((this.depth1 ==alvision.MatrixType. CV_64F || this.depth2 == alvision.MatrixType.CV_64F ||this. dst_depth == alvision.MatrixType.CV_64F) && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                let dst = new alvision.cuda.GpuMat ();
                alvision.cudaarithm.addWeighted(alvision.loadMat(src1), alpha, alvision.loadMat(src2), beta, gamma, dst, this.dst_depth);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else {
            let dst = alvision.createMat(this.size, this.dst_depth, this.useRoi);
            alvision.cudaarithm.addWeighted(alvision.loadMat(src1, this.useRoi), alpha, alvision.loadMat(src2, this.useRoi), beta, gamma, dst, this.dst_depth);

            let dst_gold = new alvision.Mat ();
            alvision.addWeighted(src1, alpha, src2, beta, gamma, dst_gold, this.dst_depth);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.dst_depth < alvision.MatrixType.CV_32F ? 2.0 : 1e-3);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'AddWeighted', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.ALL_DEPTH,
    alvision.ALL_DEPTH,
    alvision.ALL_DEPTH,
    alvision.WHOLE_SUBMAT
    ]));

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Threshold

//CV_ENUM(ThreshOp, alvision.THRESH_BINARY, alvision.THRESH_BINARY_INV, alvision.THRESH_TRUNC, alvision.THRESH_TOZERO, alvision.THRESH_TOZERO_INV)
//#define ALL_THRESH_OPS testing::Values(ThreshOp(alvision.THRESH_BINARY), ThreshOp(alvision.THRESH_BINARY_INV), ThreshOp(alvision.THRESH_TRUNC), ThreshOp(alvision.THRESH_TOZERO), ThreshOp(alvision.THRESH_TOZERO_INV))

const ALL_THRESH_OPS = [alvision.ThresholdTypes.THRESH_BINARY, alvision.ThresholdTypes.THRESH_BINARY_INV, alvision.ThresholdTypes.THRESH_TRUNC, alvision.ThresholdTypes.THRESH_TOZERO, alvision.ThresholdTypes.THRESH_TOZERO_INV];

//PARAM_TEST_CASE(Threshold, alvision.cuda.DeviceInfo, alvision.Size, MatType, ThreshOp, this.useRoi)
class Threshold extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected type: alvision.int;
    protected threshOp: alvision.int;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo =  this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =     this.GET_PARAM<alvision.Size>(1);
        this.type =     this.GET_PARAM<alvision.int>(2);
        this.threshOp = this.GET_PARAM<alvision.int>(3);
        this.useRoi =   this.GET_PARAM<boolean>(4);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Threshold, Accuracy)
class Threshold_Accuracy extends Threshold
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.type);
        let maxVal = alvision.randomDouble(20.0, 127.0);
        let thresh = alvision.randomDouble(0.0, maxVal);

        let dst = alvision.createMat(src.size(), src.type(), this.useRoi);
        alvision.cudaarithm.threshold(alvision.loadMat(src, this.useRoi), dst, thresh, maxVal, this.threshOp);

        let dst_gold = new alvision.Mat ();
        alvision.threshold(src, dst_gold, thresh, maxVal, this.threshOp);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Threshold', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8UC1,alvision.MatrixType.CV_16SC1,alvision.MatrixType.CV_32FC1],
    ALL_THRESH_OPS,
    alvision.WHOLE_SUBMAT
    ]));

////////////////////////////////////////////////////////////////////////////////
// Magnitude

//PARAM_TEST_CASE(Magnitude, alvision.cuda.DeviceInfo, alvision.Size, this.useRoi)
class Magnitude extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.useRoi =  this.GET_PARAM<boolean>(2);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Magnitude, NPP)
class Magnitude_NPP extends Magnitude
{
    TestBody() {
        let src = alvision.randomMat(this.size, alvision.MatrixType.CV_32FC2);

        let dst = alvision.createMat(this.size, alvision.MatrixType.CV_32FC1, this.useRoi);
        alvision.cudaarithm.magnitude(alvision.loadMat(src, this.useRoi), dst);

        let arr = new Array < alvision.Mat >(2);
        alvision.split(src, arr);
        let dst_gold = new alvision.Mat ();
        alvision.magnitude(arr[0], arr[1], dst_gold);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-4);
    }
}

//CUDA_TEST_P(Magnitude, Sqr_NPP)
class Magnitude_Sqr_NPP extends Magnitude
{
    TestBody() {
        let src = alvision.randomMat(this.size, alvision.MatrixType.CV_32FC2);

        let dst = alvision.createMat(this.size, alvision.MatrixType.CV_32FC1, this.useRoi);
        alvision.cudaarithm.magnitudeSqr(alvision.loadMat(src, this.useRoi), dst);

        let arr = new Array<alvision.Mat> (2);
        alvision.split(src, arr);
        let dst_gold = new alvision.Mat ();
        alvision.magnitude(arr[0], arr[1], dst_gold);
        alvision.multiply(dst_gold, dst_gold, dst_gold);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-1);
    }
}

//CUDA_TEST_P(Magnitude, Accuracy)
class Magnitude_Accuracy extends Magnitude
{
    TestBody() {
        let x = alvision.randomMat(this.size, alvision.MatrixType.CV_32FC1);
        let y = alvision.randomMat(this.size, alvision.MatrixType.CV_32FC1);

        let dst = alvision.createMat(this.size, alvision.MatrixType.CV_32FC1, this.useRoi);
        alvision.cudaarithm.magnitude(alvision.loadMat(x, this.useRoi), alvision.loadMat(y, this.useRoi), dst);

        let dst_gold = new alvision.Mat ();
        alvision.magnitude(x, y, dst_gold);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-4);
    }
}

//CUDA_TEST_P(Magnitude, Sqr_Accuracy)
class Magnitude_Sqr_Accuracy extends Magnitude
{
    TestBody() {
        let x = alvision.randomMat(this. size, alvision.MatrixType.CV_32FC1);
        let y = alvision.randomMat(this. size, alvision.MatrixType.CV_32FC1);

        let dst = alvision.createMat(this.size, alvision.MatrixType.CV_32FC1, this.useRoi);
        alvision.cudaarithm.magnitudeSqr(alvision.loadMat(x, this.useRoi), alvision.loadMat(y, this.useRoi), dst);

        let dst_gold = new alvision.Mat ();
        alvision.magnitude(x, y, dst_gold);
        alvision.multiply(dst_gold, dst_gold, dst_gold);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-1);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Magnitude', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.WHOLE_SUBMAT
    ]));

////////////////////////////////////////////////////////////////////////////////
// Phase

//namespace
//{
//    IMPLEMENT_PARAM_CLASS(AngleInDegrees, bool)
//}

//PARAM_TEST_CASE(Phase, alvision.cuda.DeviceInfo, alvision.Size, AngleInDegrees, this.useRoi)
class Phase extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected angleInDegrees : boolean;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size = this.GET_PARAM<alvision.Size>(1);
        this.angleInDegrees = this.GET_PARAM<boolean>(2);
        this.useRoi =         this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Phase, Accuracy)
class Phase_Accuracy extends Phase
{
    TestBody() {
        let x = alvision.randomMat(this.size, alvision.MatrixType.CV_32FC1);
        let y = alvision.randomMat(this.size, alvision.MatrixType.CV_32FC1);

        let dst = alvision.createMat(this.size, alvision.MatrixType.CV_32FC1, this.useRoi);
        alvision.cudaarithm.phase(alvision.loadMat(x, this.useRoi), alvision.loadMat(y, this.useRoi), dst, this.angleInDegrees);

        let dst_gold = new alvision.Mat ();
        alvision.phase(x, y, dst_gold, this.angleInDegrees);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.angleInDegrees ? 1e-2 : 1e-3);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Phase', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [false,true],
    alvision.WHOLE_SUBMAT
    ]));

////////////////////////////////////////////////////////////////////////////////
// CartToPolar

//PARAM_TEST_CASE(CartToPolar, alvision.cuda.DeviceInfo, alvision.Size, AngleInDegrees, this.useRoi)
class CartToPolar extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected angleInDegrees : boolean;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo =          this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =             this.GET_PARAM<alvision.Size>(1);
        this.angleInDegrees =   this.GET_PARAM<boolean>(2);
        this.useRoi =           this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(CartToPolar, Accuracy)
class CartToPolar_Accuracy extends CartToPolar
{
    TestBody() {
        let x = alvision.randomMat(this.size, alvision.MatrixType.CV_32FC1);
        let y = alvision.randomMat(this.size, alvision.MatrixType.CV_32FC1);

        let mag = alvision.createMat(this.size, alvision.MatrixType.CV_32FC1, this.useRoi);
        let angle = alvision.createMat(this.size, alvision.MatrixType.CV_32FC1, this.useRoi);
        alvision.cudaarithm.cartToPolar(alvision.loadMat(x, this.useRoi), alvision.loadMat(y, this.useRoi), mag, angle, this.angleInDegrees);

        let mag_gold = new alvision.Mat();
        let angle_gold = new alvision.Mat();
        alvision.cartToPolar(x, y, mag_gold, angle_gold, this.angleInDegrees);

        alvision.EXPECT_MAT_NEAR(mag_gold, mag, 1e-4);
        alvision.EXPECT_MAT_NEAR(angle_gold, angle, this.angleInDegrees ? 1e-2 : 1e-3);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'CartToPolar', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [false,true],
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////////
// polarToCart

//PARAM_TEST_CASE(PolarToCart, alvision.cuda.DeviceInfo, alvision.Size, AngleInDegrees, this.useRoi)
class PolarToCart extends alvision.cvtest.CUDA_TEST
{
    protected devInfo : alvision.cuda.DeviceInfo;
    protected size : alvision.Size;
    protected angleInDegrees : boolean;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size = this.GET_PARAM<alvision.Size>(1);
        this.angleInDegrees =   this.GET_PARAM<boolean>(2);
        this.useRoi =           this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(PolarToCart, Accuracy)
class PolarToCart_Accuracy extends PolarToCart
{
    TestBody() {
        let magnitude = alvision.randomMat(this.size, alvision.MatrixType.CV_32FC1);
        let angle = alvision.randomMat(this.size, alvision.MatrixType.CV_32FC1);

        let x = alvision.createMat(this.size, alvision.MatrixType.CV_32FC1, this.useRoi);
        let y = alvision.createMat(this.size, alvision.MatrixType.CV_32FC1, this.useRoi);
        alvision.cudaarithm.polarToCart(alvision.loadMat(magnitude, this.useRoi), alvision.loadMat(angle, this.useRoi), x, y,this. angleInDegrees);

        let x_gold = new alvision.Mat();
        let y_gold = new alvision.Mat();
        alvision.polarToCart(magnitude, angle, x_gold, y_gold, this.angleInDegrees);

        alvision.EXPECT_MAT_NEAR(x_gold, x, 1e-4);
        alvision.EXPECT_MAT_NEAR(y_gold, y, 1e-4);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'PolarToCart', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [false,true],
    alvision.WHOLE_SUBMAT]));

//#endif // HAVE_CUDA
