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
// HistEven

//PARAM_TEST_CASE(HistEven, alvision.cuda.DeviceInfo, alvision.Size)
class HistEven extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;

    SetUp() : void
    {
        this.devInfo =  this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =     this.GET_PARAM<alvision.Size>(1);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(HistEven, Accuracy)
class HistEven_Accuracy extends HistEven
{
    TestBody() {
        let src = alvision.randomMat(this.size, alvision.MatrixType.CV_8UC1);

        let hbins = 30;
        let hranges = [50.0, 200.0];

        let hist = new alvision.cuda.GpuMat();
        alvision.cuda.histEven(alvision.loadMat(src), hist, hbins,  hranges[0],  hranges[1]);

        let hist_gold = new alvision.Mat();

        let histSize = [hbins];
        const ranges : Array<alvision.float> = hranges;
        let channels = [0];
        alvision.calcHist([src], channels, new alvision.Mat(), hist_gold, 1, histSize, ranges);

        hist_gold = hist_gold.t().toMat();
        hist_gold.convertTo(hist_gold, alvision.MatrixType.CV_32S);

        alvision.EXPECT_MAT_NEAR(hist_gold, hist, 0.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'HistEven', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES
    ]));

///////////////////////////////////////////////////////////////////////////////////////////////////////
// CalcHist

//PARAM_TEST_CASE(CalcHist, alvision.cuda.DeviceInfo, alvision.Size)
class CalcHist extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;

    protected size: alvision.Size;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size = this.GET_PARAM<alvision.Size>(1);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(CalcHist, Accuracy)
class CalcHist_Accuracy extends CalcHist
{
    TestBody() {
        let src = alvision.randomMat(this.size, alvision.MatrixType.CV_8UC1);

        let hist = new alvision.cuda.GpuMat();
        alvision.cuda.calcHist(alvision.loadMat(src), hist);

        let hist_gold = new alvision.Mat();

        const hbins = 256;
        const hranges = [0.0, 256.0];
        const histSize = [ hbins ]
        const ranges = hranges;
        const channels = [0];

        alvision.calcHist([src], channels, new alvision.Mat(), hist_gold, 1, histSize, ranges);
        hist_gold = hist_gold.reshape(1, 1);
        hist_gold.convertTo(hist_gold, alvision.MatrixType.CV_32S);

        alvision.EXPECT_MAT_NEAR(hist_gold, hist, 0.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'CalcHist', (case_name, test_name) => { return null }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES
    ]));

///////////////////////////////////////////////////////////////////////////////////////////////////////
// EqualizeHist

//PARAM_TEST_CASE(EqualizeHist, alvision.cuda.DeviceInfo, alvision.Size)
class EqualizeHist extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;

    SetUp() : void
    {
        this.devInfo =  this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =     this.GET_PARAM<alvision.Size>(1);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(EqualizeHist, Accuracy)
class EqualizeHist_Accuracy extends EqualizeHist
{
    TestBody() {
        let src = alvision.randomMat(this.size, alvision.MatrixType.CV_8UC1);

        let dst = new alvision.cuda.GpuMat();
        alvision.cuda.equalizeHist(alvision.loadMat(src), dst);

        let dst_gold = new alvision.Mat();
        alvision.equalizeHist(src, dst_gold);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 3.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'EqualizeHist', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES
    ]));

///////////////////////////////////////////////////////////////////////////////////////////////////////
// CLAHE

//namespace
//{
//    IMPLEMENT_PARAM_CLASS(ClipLimit, double)
//}

//PARAM_TEST_CASE(CLAHE, alvision.cuda.DeviceInfo, alvision.Size, ClipLimit)
class CLAHE extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected clipLimit: alvision.double;

    SetUp() : void
    {
        this.devInfo =      this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =         this.GET_PARAM<alvision.Size>(1);
        this.clipLimit =    this.GET_PARAM<alvision.double>(2);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(CLAHE, Accuracy)
class CLAHE_Accuracy extends CLAHE
{
    TestBody() {
        let src = alvision.randomMat(this.size, alvision.MatrixType.CV_8UC1);

        let clahe = alvision.cuda.createCLAHE(this.clipLimit);
        let dst = new alvision.cuda.GpuMat();
        clahe.apply(alvision.loadMat(src), dst);

        let clahe_gold = alvision.createCLAHE(this.clipLimit);
        let dst_gold = new alvision.Mat();
        clahe_gold.apply(src, dst_gold);

        alvision.ASSERT_MAT_NEAR(dst_gold, dst, 1.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'CLAHE', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [0.0, 40.0]
    ]));

//#endif // HAVE_CUDA
