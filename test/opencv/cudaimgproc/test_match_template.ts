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
// MatchTemplate8U

//CV_ENUM(TemplateMethod, alvision.TM_SQDIFF, alvision.TM_SQDIFF_NORMED, alvision.TM_CCORR, alvision.TM_CCORR_NORMED, alvision.TM_CCOEFF, alvision.TM_CCOEFF_NORMED)
//#define ALL_TEMPLATE_METHODS testing::Values(TemplateMethod(alvision.TM_SQDIFF), TemplateMethod(alvision.TM_SQDIFF_NORMED), TemplateMethod(alvision.TM_CCORR), TemplateMethod(alvision.TM_CCORR_NORMED), TemplateMethod(alvision.TM_CCOEFF), TemplateMethod(alvision.TM_CCOEFF_NORMED))
const ALL_TEMPLATE_METHODS = [alvision.TemplateMatchModes.TM_SQDIFF,alvision.TemplateMatchModes.TM_SQDIFF_NORMED,alvision.TemplateMatchModes.TM_CCORR,alvision.TemplateMatchModes.TM_CCORR_NORMED,alvision.TemplateMatchModes.TM_CCOEFF,alvision.TemplateMatchModes.TM_CCOEFF_NORMED];

//namespace
//{
//    IMPLEMENT_PARAM_CLASS(TemplateSize, alvision.Size);
//}

//PARAM_TEST_CASE(MatchTemplate8U, alvision.cuda.DeviceInfo, alvision.Size, TemplateSize, Channels, TemplateMethod)
class MatchTemplate8U extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size 
    protected templ_size: alvision.Size;
    protected cn: alvision.int;
    protected method: alvision.int;

    SetUp() : void
    {
        this.devInfo =      this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =         this.GET_PARAM<alvision.Size>(1);
        this.templ_size =   this.GET_PARAM<alvision.Size>(2);
        this.cn =           this.GET_PARAM<alvision.int>(3);
        this.method =       this.GET_PARAM<alvision.int>(4);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(MatchTemplate8U, Accuracy)
class MatchTemplate8U_Accuracy extends MatchTemplate8U
{
    TestBody() {
        let image = alvision.randomMat(this.size, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_8U,this. cn));
        let templ = alvision.randomMat(this.templ_size, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_8U,this. cn));

        let alg = alvision.cudaimgproc.createTemplateMatching(image.type(), this.method);

        let dst = new alvision.cuda.GpuMat();
        alg.match(alvision.loadMat(image), alvision.loadMat(templ), dst);

        let dst_gold = new alvision.Mat();
        alvision.matchTemplate(image, templ, dst_gold, this.method);

        let h_dst = new alvision.Mat(dst);
        alvision.ASSERT_EQ(dst_gold.size(), h_dst.size());
        alvision.ASSERT_EQ(dst_gold.type(), h_dst.type());
        for (let y = 0; y < h_dst.rows(); ++y) {
            for (let x = 0; x < h_dst.cols(); ++x) {
                let gold_val = dst_gold.at<alvision.float>("float",y, x);
                let actual_val = dst_gold.at<alvision.float>("float", y, x);
                alvision.ASSERT_EQ(gold_val, actual_val, y + ", " + x);
            }
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'MatchTemplate8U', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [new alvision.Size(5, 5),new alvision.Size(16, 16),new alvision.Size(30, 30)],
    [1,3,4],
    ALL_TEMPLATE_METHODS
    ]));

////////////////////////////////////////////////////////////////////////////////
// MatchTemplate32F

//PARAM_TEST_CASE(MatchTemplate32F, alvision.cuda.DeviceInfo, alvision.Size, TemplateSize, Channels, TemplateMethod)
class MatchTemplate32F extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected templ_size: alvision.Size;
    protected cn: alvision.int;
    protected method: alvision.int;

    protected n: alvision.int;
    protected m: alvision.int;
    protected h: alvision.int;
    protected w: alvision.int;

    SetUp(): void
    {
        this.devInfo =      this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =         this.GET_PARAM<alvision.Size>(1);
        this.templ_size =   this.GET_PARAM<alvision.Size>(2);
        this.cn =           this.GET_PARAM<alvision.int>(3);
        this.method =       this.GET_PARAM<alvision.int>(4);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(MatchTemplate32F, Regression)
class MatchTemplate32F_Regression extends MatchTemplate32F
{
    TestBody() {
        let image = alvision.randomMat(this.size, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_32F,this. cn));
        let templ = alvision.randomMat(this.templ_size,alvision.MatrixType. CV_MAKETYPE(alvision.MatrixType.CV_32F, this.cn));

        let alg = alvision.cudaimgproc.createTemplateMatching(image.type(), this.method);

        let dst = new alvision.cuda.GpuMat();
        alg.match(alvision.loadMat(image), alvision.loadMat(templ), dst);

        let dst_gold = new alvision.Mat();
        alvision.matchTemplate(image, templ, dst_gold, this.method);

        let h_dst = new alvision.Mat(dst);
        alvision.ASSERT_EQ(dst_gold.size(), h_dst.size());
        alvision.ASSERT_EQ(dst_gold.type(), h_dst.type());
        for (let y = 0; y < h_dst.rows(); ++y) {
            for (let x = 0; x < h_dst.cols(); ++x) {
                let gold_val = dst_gold.at<alvision.float>("float", y, x);
                let actual_val = dst_gold.at<alvision.float>("float", y, x);
                alvision.ASSERT_EQ(gold_val, actual_val, y + ", " + x);
            }
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'MatchTemplate32F', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [new alvision.Size(5, 5),new alvision.Size(16, 16), new alvision.Size(30, 30)], 
    [1, 3, 4],
    [alvision.TemplateMatchModes.TM_SQDIFF, alvision.TemplateMatchModes.TM_CCORR]
    ]));

////////////////////////////////////////////////////////////////////////////////
// MatchTemplateBlackSource

//PARAM_TEST_CASE(MatchTemplateBlackSource, alvision.cuda.DeviceInfo, TemplateMethod)
class MatchTemplateBlackSource extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected method: alvision.int;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.method =  this.GET_PARAM<alvision.int>(1);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(MatchTemplateBlackSource, Accuracy)
class MatchTemplateBlackSource_Accuracy extends MatchTemplateBlackSource {
    TestBody() {
        let image = alvision.readImage("matchtemplate/black.png");
        alvision.ASSERT_FALSE(image.empty());

        let pattern = alvision.readImage("matchtemplate/cat.png");
        alvision.ASSERT_FALSE(pattern.empty());

        let alg = alvision.cudaimgproc.createTemplateMatching(image.type(), this.method);

        let d_dst = new alvision.cuda.GpuMat();
        alg.match(alvision.loadMat(image), alvision.loadMat(pattern), d_dst);

        let dst = new alvision.Mat (d_dst);

        let maxValue: alvision.double;
        let maxLoc = new alvision.Point();
        alvision.minMaxLoc(dst, (minVal_, maxVal_, minIdx_, maxIdx_) => { maxValue = maxVal_; maxLoc = maxIdx_[0]; });

        let maxLocGold = new alvision.Point(284, 12);

        alvision.ASSERT_EQ(maxLocGold, maxLoc);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'MatchTemplateBlackSource', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    [alvision.TemplateMatchModes.TM_CCOEFF_NORMED,alvision.TemplateMatchModes.TM_CCORR_NORMED]
    ]));

////////////////////////////////////////////////////////////////////////////////
// MatchTemplate_CCOEF_NORMED

//PARAM_TEST_CASE(MatchTemplate_CCOEF_NORMED, alvision.cuda.DeviceInfo, alvision.pair<string, string>)
class MatchTemplate_CCOEF_NORMED extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected imageName: string;
    protected patternName: string;

    SetUp() : void
    {
        this.devInfo =      this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.imageName =    this.GET_PARAM<alvision.pair<string,string>>(1).first;
        this.patternName =  this.GET_PARAM<alvision.pair<string,string>>(1).second;

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(MatchTemplate_CCOEF_NORMED, Accuracy)
class MatchTemplate_CCOEF_NORMED_Accuracy extends MatchTemplate_CCOEF_NORMED
{
    TestBody() {
        let image = alvision.readImage(this.imageName);
        alvision.ASSERT_FALSE(image.empty());

        let pattern = alvision.readImage(this.patternName);
        alvision.ASSERT_FALSE(pattern.empty());

        let alg = alvision.cudaimgproc.createTemplateMatching(image.type(), alvision.TemplateMatchModes.TM_CCOEFF_NORMED);

        let d_dst = new alvision.cuda.GpuMat();
        alg.match(alvision.loadMat(image), alvision.loadMat(pattern), d_dst);

        let dst = new alvision.Mat (d_dst);

        let minLoc = new alvision.Point(), maxLoc = new alvision.Point();
        let minVal: alvision.double, maxVal: alvision.double ;
        alvision.minMaxLoc(dst, (minVal_, maxVal_, minIdx_, maxIdx_) => { minVal = minVal_; maxVal = maxVal_; minLoc = minIdx_[0]; maxLoc = maxIdx_[0]; });

        let dstGold = new alvision.Mat();
        alvision.matchTemplate(image, pattern, dstGold, alvision.TemplateMatchModes.TM_CCOEFF_NORMED);

        let minValGold: alvision.double, maxValGold: alvision.double ;
        let minLocGold = new alvision.Point(), maxLocGold = new alvision.Point ();
        alvision.minMaxLoc(dstGold, (minVal_, maxVal_, minIdx_, maxIdx_) => { minValGold = minVal_; maxValGold = maxVal_; minLocGold = minIdx_[0]; maxLocGold = maxIdx_[0]; });

        alvision.ASSERT_EQ(minLocGold, minLoc);
        alvision.ASSERT_EQ(maxLocGold, maxLoc);
        alvision.ASSERT_LE(maxVal, 1.0);
        alvision.ASSERT_GE(minVal, -1.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'MatchTemplate_CCOEF_NORMED', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    [new alvision.pair("matchtemplate/source-0.png","matchtemplate/target-0.png")]
    ]));

////////////////////////////////////////////////////////////////////////////////
// MatchTemplate_CanFindBigTemplate

class MatchTemplate_CanFindBigTemplate extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(MatchTemplate_CanFindBigTemplate, SQDIFF_NORMED)
class MatchTemplate_CanFindBigTemplate_SQDIFF_NORMED extends MatchTemplate_CanFindBigTemplate
{
    TestBody() {
        let scene = alvision.readImage("matchtemplate/scene.png");
        alvision.ASSERT_FALSE(scene.empty());

        let templ = alvision.readImage("matchtemplate/template.png");
        alvision.ASSERT_FALSE(templ.empty());

        let alg = alvision.cudaimgproc.createTemplateMatching(scene.type(), alvision.TemplateMatchModes.TM_SQDIFF_NORMED);

        let d_result = new alvision.cuda.GpuMat();
        alg.match(alvision.loadMat(scene), alvision.loadMat(templ), d_result);

        let result = new alvision.Mat (d_result);

        let minVal: alvision.double;
        let minLoc = new alvision.Point();
        alvision.minMaxLoc(result, (minVal_, maxVal_, minIdx_, maxIdx_) => { minVal = minVal_[0]; minLoc = minIdx_[0]; });

        alvision.ASSERT_GE(minVal, 0);
        alvision.ASSERT_LT(minVal, 1e-3);
        alvision.ASSERT_EQ(344, minLoc.x);
        alvision.ASSERT_EQ(0, minLoc.y);
    }
}

//CUDA_TEST_P(MatchTemplate_CanFindBigTemplate, SQDIFF)
class MatchTemplate_CanFindBigTemplate_SQDIFF extends MatchTemplate_CanFindBigTemplate
{
    TestBody() {
        let scene = alvision.readImage("matchtemplate/scene.png");
        alvision.ASSERT_FALSE(scene.empty());

        let templ = alvision.readImage("matchtemplate/template.png");
        alvision.ASSERT_FALSE(templ.empty());

        let alg = alvision.cudaimgproc.createTemplateMatching(scene.type(), alvision.TemplateMatchModes.TM_SQDIFF);

        let d_result = new alvision.cuda.GpuMat();
        alg.match(alvision.loadMat(scene), alvision.loadMat(templ), d_result);

        let result = new alvision.Mat (d_result);

        let minVal: alvision.double ;
        let minLoc = new alvision.Point();
        alvision.minMaxLoc(result, (minVal_, maxVal_, minIdx_, maxIdx_) => { minVal = minVal_[0]; minLoc = minIdx_[0]; });

        alvision.ASSERT_GE(minVal, 0);
        alvision.ASSERT_EQ(344, minLoc.x);
        alvision.ASSERT_EQ(0, minLoc.y);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'MatchTemplate_CanFindBigTemplate', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES
]));

//#endif // HAVE_CUDA
