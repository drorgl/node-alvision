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
//
//#include "test_precomp.hpp"
//
//#ifdef HAVE_CUDA
//
//using namespace cvtest;
//
//#if defined(HAVE_XINE)         || \
//    defined(HAVE_GSTREAMER)    || \
//    defined(HAVE_QUICKTIME)    || \
//    defined(HAVE_QTKIT)        || \
//    defined(HAVE_AVFOUNDATION) || \
//    defined(HAVE_FFMPEG)       || \
//    defined(WIN32) /* assume that we have ffmpeg */
//
//#  define BUILD_WITH_VIDEO_INPUT_SUPPORT 1
//#else
//#  define BUILD_WITH_VIDEO_INPUT_SUPPORT 0
//#endif

//////////////////////////////////////////////////////
// MOG2

//#if BUILD_WITH_VIDEO_INPUT_SUPPORT
//
//namespace
//    {
//IMPLEMENT_PARAM_CLASS(UseGray, bool)
//    IMPLEMENT_PARAM_CLASS(DetectShadow, bool)
//}

//PARAM_TEST_CASE(MOG2, alvision.cuda.DeviceInfo, std::string, UseGray, DetectShadow, UseRoi)
class MOG2 extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected inputFile: string;
    protected useGray: boolean;
    protected detectShadow: boolean;
    protected useRoi: boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        alvision.cuda.setDevice(this.devInfo.deviceID());

        this.inputFile = alvision.cvtest.TS.ptr().get_data_path() + "video/" + this.GET_PARAM<string>(1);
        this.useGray = this.GET_PARAM<boolean>(2);
        this.detectShadow = this.GET_PARAM<boolean>(3);
        this.useRoi = this.GET_PARAM<boolean>(4);
    }
};


//CUDA_TEST_P(MOG2, Update)
class MOG2_Update extends MOG2
{
    public TestBody(): void {
        var cap = new alvision.VideoCapture (this.inputFile);
        alvision.ASSERT_TRUE(cap.isOpened());

        var frame = new alvision.Mat();
        cap.read(frame);
        alvision.ASSERT_FALSE(frame.empty());

        var mog2 = alvision.cuda.createBackgroundSubtractorMOG2();
        mog2.setDetectShadows(this.detectShadow);
        var foreground = alvision.createMat(frame.size(), alvision.MatrixType.CV_8UC1, this.useRoi);

        var  mog2_gold = alvision.createBackgroundSubtractorMOG2();
        mog2_gold.setDetectShadows(this.detectShadow);
        var foreground_gold = new alvision.Mat();

        for (var i = 0; i < 10; ++i)
        {
            cap.read(frame);
            alvision.ASSERT_FALSE(frame.empty());

            if (this.useGray) {
                var temp = new alvision.Mat();
                alvision.cvtColor(frame, temp, alvision.ColorConversionCodes.COLOR_BGR2GRAY);
                alvision.swap(temp, frame);
            }

            mog2.apply(alvision.loadMat(frame, this.useRoi), foreground);

            mog2_gold.apply(frame, foreground_gold);

            if (this.detectShadow) {
                alvision.ASSERT_MAT_SIMILAR(foreground_gold, foreground.getMat(), 1e-2);
            }
            else {
                alvision.ASSERT_MAT_NEAR(foreground_gold, foreground, 0);
            }
        }
    }
}

//CUDA_TEST_P(MOG2, getBackgroundImage)
class MOG2_getBackgroundImage extends MOG2
{
    public TestBody(): void {
        if (this.useGray)
            return;

        var cap = new alvision.VideoCapture (this.inputFile);
        alvision.ASSERT_TRUE(cap.isOpened());

        var frame = new alvision.Mat();

        var mog2 = alvision.cuda.createBackgroundSubtractorMOG2();
        mog2.setDetectShadows(this.detectShadow);
        var foreground = new alvision.cuda.GpuMat();

        var mog2_gold = alvision.createBackgroundSubtractorMOG2();
        mog2_gold.setDetectShadows(this.detectShadow);
        var foreground_gold = new alvision.Mat();

        for (var i = 0; i < 10; ++i)
        {
            cap.read(frame);
            alvision.ASSERT_FALSE(frame.empty());

            mog2.apply(alvision.loadMat(frame, this.useRoi), foreground);

            mog2_gold.apply(frame, foreground_gold);
        }

        var background = alvision.createMat(frame.size(), frame.type(), this.useRoi);
        mog2.getBackgroundImage(background);

        var background_gold = new alvision.Mat();
        mog2_gold.getBackgroundImage(background_gold);

        alvision.ASSERT_MAT_NEAR(background_gold, background, 1);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_BgSegm', 'MOG2', (test_case, test_name) => { return null; },new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    ["768x576.avi"],
    [true, false],
    [true, false],
    [alvision.WHOLE_SUBMAT]]));
//
//#endif
//
//#endif // HAVE_CUDA
