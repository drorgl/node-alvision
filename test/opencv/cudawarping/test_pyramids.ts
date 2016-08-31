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
//
////////////////////////////////////////////////////////
// pyrDown

//PARAM_TEST_CASE(PyrDown, alvision.cuda.DeviceInfo, alvision.Size, MatType, UseRoi)
class PyrDown extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected type: alvision.int;
    protected useRoi: boolean;

    public SetUp() : void
    {
        this.devInfo =  this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =     this.GET_PARAM<alvision.Size>(1);
        this.type =     this.GET_PARAM<alvision.int>(2);
        this.useRoi =   this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(PyrDown, Accuracy)
class PyrDown_Accuracy extends PyrDown
{
    public TestBody(): void {
        var src = alvision.randomMat(this.size, this.type);

        var dst = alvision.createMat(new alvision.Size((this.size.width.valueOf() + 1) / 2, (this.size.height.valueOf() + 1) / 2), this.type, this.useRoi);
        alvision.cudawarping.pyrDown(alvision.loadMat(src, this.useRoi), dst);

        var dst_gold = new alvision.Mat();
        alvision.pyrDown(src, dst_gold);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, src.depth() == alvision.MatrixType.CV_32F ? 1e-4 : 1.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Warping', 'PyrDown', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8UC1,alvision.MatrixType.CV_8UC3,alvision.MatrixType.CV_8UC4,alvision.MatrixType.CV_16UC1,alvision.MatrixType.CV_16UC3,alvision.MatrixType.CV_16UC4,alvision.MatrixType.CV_32FC1,alvision.MatrixType.CV_32FC3,alvision.MatrixType.CV_32FC4],
    alvision.WHOLE_SUBMAT
    ]));

////////////////////////////////////////////////////////
// pyrUp

//PARAM_TEST_CASE(PyrUp, alvision.cuda.DeviceInfo, alvision.Size, MatType, UseRoi)
class PyrUp extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected type: alvision.int;
    protected useRoi: boolean;

    public SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.type =    this.GET_PARAM<alvision.int>(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(PyrUp, Accuracy)
class PyrUp_Accuracy extends PyrUp
{
    public TestBody(): void {
        var src = alvision.randomMat(this.size, this.type);

        var dst = alvision.createMat(new alvision.Size(this.size.width.valueOf() * 2, this.size.height.valueOf() * 2), this.type,this. useRoi);
        alvision.cudawarping.pyrUp(alvision.loadMat(src, this.useRoi), dst);

        var dst_gold = new alvision.Mat();
        alvision.pyrUp(src, dst_gold);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, src.depth() == alvision.MatrixType.CV_32F ? 1e-4 : 1.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Warping', 'PyrUp', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8UC1,alvision.MatrixType.CV_8UC3,alvision.MatrixType.CV_8UC4,alvision.MatrixType.CV_16UC1,alvision.MatrixType.CV_16UC3,alvision.MatrixType.CV_16UC4,alvision.MatrixType.CV_32FC1,alvision.MatrixType.CV_32FC3,alvision.MatrixType.CV_32FC4],
    alvision.WHOLE_SUBMAT
    ]));

//#endif // HAVE_CUDA
