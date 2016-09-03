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

////////////////////////////////////////////////////////
// Canny

//namespace
//{
//    IMPLEMENT_PARAM_CLASS(AppertureSize, int)
//    IMPLEMENT_PARAM_CLASS(L2gradient, bool)
//}

//PARAM_TEST_CASE(Canny, alvision.cuda.DeviceInfo, AppertureSize, L2gradient, UseRoi)
class Canny extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected apperture_size: alvision.int;
    protected useL2gradient: boolean;
    protected useRoi: boolean;

    SetUp() : void
    {
        this.devInfo =          this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.apperture_size =   this.GET_PARAM<alvision.int>(1);
        this.useL2gradient =    this.GET_PARAM<boolean>(2);
        this.useRoi =           this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Canny, Accuracy)
class Canny_Accuracy extends Canny
{
    TestBody() {
        let img = alvision.readImage("stereobm/aloe-L.png", alvision.ImreadModes.IMREAD_GRAYSCALE);
        alvision.ASSERT_FALSE(img.empty());

        let low_thresh = 50.0;
        let high_thresh = 100.0;

        let canny = alvision.cudaimgproc.createCannyEdgeDetector(low_thresh, high_thresh, this.apperture_size, this.useL2gradient);

        let edges = new alvision.cuda.GpuMat();
        canny.detect(alvision.loadMat(img, this.useRoi), edges);

        let edges_gold = new alvision.Mat();
        alvision.Canny(img, edges_gold, low_thresh, high_thresh, this.apperture_size, this.useL2gradient);

        alvision.EXPECT_MAT_SIMILAR(edges_gold, edges.getMat(), 2e-2);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'Canny', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    [3,5],
    [false,true],
    alvision.WHOLE_SUBMAT
]));

//#endif // HAVE_CUDA
