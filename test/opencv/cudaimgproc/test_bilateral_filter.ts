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

////////////////////////////////////////////////////////
// BilateralFilter


//PARAM_TEST_CASE(BilateralFilter, alvision.cuda.DeviceInfo, alvision.Size, MatType)
class BilateralFilter extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected type: alvision.int;
    protected kernel_size: alvision.int;
    protected sigma_color: alvision.float;
    protected sigma_spatial: alvision.float;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.type =    this.GET_PARAM<alvision.int>(2);

        this.kernel_size = 5;
        this.sigma_color = 10.;
        this.sigma_spatial = 3.5;

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(BilateralFilter, Accuracy)
class BilateralFilter_Accuracy extends BilateralFilter
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.type);

        src.convertTo(src, this.type);
        let dst = new alvision.cuda.GpuMat();

        alvision.cudaimgproc.bilateralFilter(alvision.loadMat(src), dst, this.kernel_size, this.sigma_color, this.sigma_spatial);

        let dst_gold = new alvision.Mat();
        alvision.bilateralFilter(src, dst_gold, this.kernel_size, this.sigma_color, this.sigma_spatial);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, src.depth() == alvision.MatrixType.CV_32F ? 1e-3 : 1.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'BilateralFilter', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    [new alvision.Size(128, 128), new alvision.Size(113, 113), new alvision.Size(639, 481)],
    [alvision.MatrixType.CV_8UC1,alvision.MatrixType.CV_8UC3,alvision.MatrixType.CV_32FC1,alvision.MatrixType.CV_32FC3]
    ]));


//#endif // HAVE_CUDA
