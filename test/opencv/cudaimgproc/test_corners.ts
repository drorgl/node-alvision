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

///////////////////////////////////////////////////////////////////////////////////////////////////////
// CornerHarris

//namespace
//{
//    IMPLEMENT_PARAM_CLASS(BlockSize, int);
//    IMPLEMENT_PARAM_CLASS(ApertureSize, int);
//}

//PARAM_TEST_CASE(CornerHarris, alvision.cuda.DeviceInfo, MatType, BorderType, BlockSize, ApertureSize)
class CornerHarris extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected type: alvision.int;
    protected borderType: alvision.int;
    protected blockSize: alvision.int;
    protected apertureSize: alvision.int;

    SetUp() : void
    {
        this.devInfo =      this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.type =         this.GET_PARAM<alvision.int>(1);
        this.borderType =   this.GET_PARAM<alvision.int>(2);
        this.blockSize =    this.GET_PARAM<alvision.int>(3);
        this.apertureSize = this.GET_PARAM<alvision.int>(4);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(CornerHarris, Accuracy)
class CornerHarris_Accuracy extends CornerHarris
{
    TestBody() {
        let src = alvision.readImageType("stereobm/aloe-L.png", this.type);
        alvision.ASSERT_FALSE(src.empty());

        let k = alvision.randomDouble(0.1, 0.9);

        let harris = alvision.cuda.createHarrisCorner(src.type(), this.blockSize, this.apertureSize, k, this.borderType);

        let dst = new alvision.cuda.GpuMat();
        harris.compute(alvision.loadMat(src), dst);

        let dst_gold = new alvision.Mat();
        alvision.cornerHarris(src, dst_gold, this.blockSize, this.apertureSize, k, this.borderType);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.02);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'CornerHarris', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    [alvision.MatrixType.CV_8UC1,alvision.MatrixType.CV_32FC1],
    [alvision.BorderTypes.BORDER_REFLECT101,alvision.BorderTypes.BORDER_REPLICATE,alvision.BorderTypes.BORDER_REFLECT],
    [3,5,7],
    [0,3,5,7]
    ]));

///////////////////////////////////////////////////////////////////////////////////////////////////////
// cornerMinEigen

//PARAM_TEST_CASE(CornerMinEigen, alvision.cuda.DeviceInfo, MatType, BorderType, BlockSize, ApertureSize)
class CornerMinEigen extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected type: alvision.int;
    protected borderType: alvision.int;
    protected blockSize: alvision.int;
    protected apertureSize: alvision.int;

    SetUp() : void
    {
        this.devInfo =          this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.type =             this.GET_PARAM<alvision.int>(1);
        this.borderType =       this.GET_PARAM<alvision.int>(2);
        this.blockSize =        this.GET_PARAM<alvision.int>(3);
        this.apertureSize =     this.GET_PARAM<alvision.int>(4);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(CornerMinEigen, Accuracy)
class CornerMinEigen_Accuracy extends CornerMinEigen
{
    TestBody() {
        let src = alvision.readImageType("stereobm/aloe-L.png", this.type);
        alvision.ASSERT_FALSE(src.empty());

        let minEigenVal = alvision.cuda.createMinEigenValCorner(src.type(), this.blockSize, this.apertureSize, this.borderType);

        let dst = new alvision.cuda.GpuMat();
        minEigenVal.compute(alvision.loadMat(src), dst);

        let dst_gold = new alvision.Mat();
        alvision.cornerMinEigenVal(src, dst_gold, this.blockSize, this.apertureSize, this.borderType);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.02);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'CornerMinEigen', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    [alvision.MatrixType.CV_8UC1,alvision.MatrixType.CV_32FC1],
    [alvision.BorderTypes.BORDER_REFLECT101,alvision.BorderTypes.BORDER_REPLICATE,alvision.BorderTypes.BORDER_REFLECT],
    [3,5,7],
    [0,3,5,7]
    ]));

//#endif // HAVE_CUDA
