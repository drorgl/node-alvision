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
// cvtColor

//PARAM_TEST_CASE(CvtColor, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, UseRoi)
class CvtColor extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected depth: alvision.int;
    protected useRoi: boolean;

    protected img: alvision.Mat;

    SetUp() : void
    {
        this.devInfo =  this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =     this.GET_PARAM<alvision.Size>(1);
        this.depth =    this.GET_PARAM<alvision.int>(2);
        this.useRoi =   this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());

        this.img = alvision.randomMat(this.size, alvision.MatrixType.CV_MAKETYPE(this.depth, 3), 0.0, this.depth == alvision.MatrixType.CV_32F ? 1.0 : 255.0);
    }
};

//CUDA_TEST_P(CvtColor, BGR2RGB)
class CvtColor_BGR2RGB extends CvtColor
{
    TestBody() {
        let src = this.img;

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2RGB);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2RGB);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, BGR2RGBA)
class CvtColor_BGR2RGBA extends CvtColor
{
    TestBody() {
        let src = this.img;

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2RGBA);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2RGBA);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, BGR2BGRA)
class CvtColor_BGR2BGRA extends CvtColor
{
    TestBody() {
        let src = this.img;

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2BGRA);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2BGRA);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, BGRA2RGB)
class CvtColor_BGRA2RGB extends CvtColor
{
    TestBody() {
        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2BGRA);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGRA2RGB);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGRA2RGB);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    } 
}

//CUDA_TEST_P(CvtColor, BGRA2BGR)
class CvtColor_BGRA2BGR extends CvtColor
{
    TestBody() {
        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2BGRA);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGRA2BGR);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGRA2BGR);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, BGRA2RGBA)
class CvtColor_BGRA2RGBA extends CvtColor
{
    TestBody() {
        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2BGRA);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGRA2RGBA);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGRA2RGBA);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, BGR2GRAY)
class CvtColor_BGR2GRAY extends CvtColor
{
    TestBody() {
        let src = this.img;

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2GRAY);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2GRAY);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
    }
}

//CUDA_TEST_P(CvtColor, RGB2GRAY)
class CvtColor_RGB2GRAY extends CvtColor
{
    TestBody() {
        let src = this.img;

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGB2GRAY);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGB2GRAY);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
    }
}

//CUDA_TEST_P(CvtColor, GRAY2BGR)
class CvtColor_GRAY2BGR extends CvtColor
{
    TestBody() {
        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2GRAY);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_GRAY2BGR);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_GRAY2BGR);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, GRAY2BGRA)
class CvtColor_GRAY2BGRA extends CvtColor
{
    TestBody() {
        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2GRAY);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_GRAY2BGRA, 4);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_GRAY2BGRA, 4);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, BGRA2GRAY)
class CvtColor_BGRA2GRAY extends CvtColor
{
    TestBody() {
        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2BGRA);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGRA2GRAY);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGRA2GRAY);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
    }
}

//CUDA_TEST_P(CvtColor, RGBA2GRAY)
class CvtColor_RGBA2GRAY extends CvtColor
{
    TestBody() {
        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2RGBA);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGBA2GRAY);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGBA2GRAY);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
    }
}

//CUDA_TEST_P(CvtColor, BGR2BGR565)
class CvtColor_BGR2BGR565 extends CvtColor
{
    TestBody() {
        if (this.depth != alvision.MatrixType.CV_8U)
            return;

        let src = this.img;

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2BGR565);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2BGR565);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, RGB2BGR565)
class CvtColor_RGB2BGR565 extends CvtColor
{
    TestBody() {
        if (this.depth != alvision.MatrixType.CV_8U)
            return;

        let src = this.img;

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGB2BGR565);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGB2BGR565);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, BGR5652BGR)
class CvtColor_BGR5652BGR extends CvtColor
{
    TestBody() {
        if (this.depth != alvision.MatrixType.CV_8U)
            return;

        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2BGR565);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR5652BGR);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR5652BGR);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, BGR5652RGB)
class CvtColor_BGR5652RGB extends CvtColor
{
    TestBody() {
        if (this.depth != alvision.MatrixType.CV_8U)
            return;

        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2BGR565);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR5652RGB);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR5652RGB);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, BGRA2BGR565)
class CvtColor_BGRA2BGR565 extends CvtColor
{
    TestBody() {
        if (this.depth != alvision.MatrixType.CV_8U)
            return;

        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2BGRA);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGRA2BGR565);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGRA2BGR565);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, RGBA2BGR565)
class CvtColor_RGBA2BGR565 extends CvtColor
{
    TestBody() {
        if (this.depth != alvision.MatrixType.CV_8U)
            return;

        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2RGBA);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGBA2BGR565);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGBA2BGR565);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, BGR5652BGRA)
class CvtColor_BGR5652BGRA extends CvtColor
{
    TestBody() {
        if (this.depth != alvision.MatrixType.CV_8U)
            return;

        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2BGR565);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR5652BGRA, 4);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR5652BGRA, 4);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, BGR5652RGBA)
class CvtColor_BGR5652RGBA extends CvtColor
{
    TestBody() {
        if (this.depth != alvision.MatrixType.CV_8U)
            return;

        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2BGR565);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR5652RGBA, 4);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR5652RGBA, 4);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, GRAY2BGR565)
class CvtColor_GRAY2BGR565 extends CvtColor
{
    TestBody() {
        if (this.depth != alvision.MatrixType.CV_8U)
            return;

        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2GRAY);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_GRAY2BGR565);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_GRAY2BGR565);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, BGR5652GRAY)
class CvtColor_BGR5652GRAY extends CvtColor
{
    TestBody() {
        if (this.depth != alvision.MatrixType.CV_8U)
            return;

        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2BGR565);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR5652GRAY);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR5652GRAY);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, BGR2BGR555)
class CvtColor_BGR2BGR555 extends CvtColor
{
    TestBody() {
        if (this.depth != alvision.MatrixType.CV_8U)
            return;

        let src = this.img;

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2BGR555);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2BGR555);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, RGB2BGR555)
class CvtColor_RGB2BGR555 extends CvtColor
{
    TestBody() {
        if (this.depth != alvision.MatrixType.CV_8U)
            return;

        let src = this.img;

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGB2BGR555);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGB2BGR555);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, BGR5552BGR)
class CvtColor_BGR5552BGR extends CvtColor
{
    TestBody() {
        if (this.depth != alvision.MatrixType.CV_8U)
            return;

        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2BGR555);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR5552BGR);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR5552BGR);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, BGR5552RGB)
class CvtColor_BGR5552RGB extends CvtColor
{
    TestBody() {
        if (this.depth != alvision.MatrixType.CV_8U)
            return;

        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2BGR555);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR5552RGB);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR5552RGB);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, BGRA2BGR555)
class CvtColor_BGRA2BGR555 extends CvtColor
{
    TestBody() {
        if (this.depth != alvision.MatrixType.CV_8U)
            return;

        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2BGRA);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGRA2BGR555);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGRA2BGR555);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, RGBA2BGR555)
class CvtColor_RGBA2BGR555 extends CvtColor
{
    TestBody() {
        if (this.depth != alvision.MatrixType.CV_8U)
            return;

        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2RGBA);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGBA2BGR555);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGBA2BGR555);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, BGR5552BGRA)
class CvtColor_BGR5552BGRA extends CvtColor
{
    TestBody() {
        if (this.depth != alvision.MatrixType.CV_8U)
            return;

        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2BGR555);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR5552BGRA, 4);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR5552BGRA, 4);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, BGR5552RGBA)
class CvtColor_BGR5552RGBA extends CvtColor
{
    TestBody() {
        if (this.depth != alvision.MatrixType.CV_8U)
            return;

        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2BGR555);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR5552RGBA, 4);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR5552RGBA, 4);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, GRAY2BGR555)
class CvtColor_GRAY2BGR555 extends CvtColor
{
    TestBody() {
        if (this.depth != alvision.MatrixType.CV_8U)
            return;

        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2GRAY);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_GRAY2BGR555);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_GRAY2BGR555);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, BGR5552GRAY)
class CvtColor_BGR5552GRAY extends CvtColor
{
    TestBody() {
        if (this.depth != alvision.MatrixType.CV_8U)
            return;

        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2BGR555);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR5552GRAY);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR5552GRAY);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

//CUDA_TEST_P(CvtColor, BGR2XYZ)
class CvtColor_BGR2XYZ extends CvtColor
{
    TestBody() {
        let src = this.img;

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2XYZ);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2XYZ);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
    }
}

//CUDA_TEST_P(CvtColor, RGB2XYZ)
class CvtColor_RGB2XYZ extends CvtColor
{
    TestBody() {
        let src = this.img;

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGB2XYZ);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGB2XYZ);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
    }
}

//CUDA_TEST_P(CvtColor, BGR2XYZ4)
class CvtColor_BGR2XYZ4 extends CvtColor
{
    TestBody() {
        let src = this.img;

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2XYZ, 4);

        alvision.ASSERT_EQ(4, dst.channels());

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2XYZ);

        let h_dst = new alvision.Mat(dst);

        let channels = new Array<alvision.Mat>(4);
        alvision.split(h_dst, channels);
        alvision.merge(channels/*,3*/, h_dst);

        alvision.EXPECT_MAT_NEAR(dst_gold, h_dst, 1e-5);
    }
}

//CUDA_TEST_P(CvtColor, BGRA2XYZ4)
class CvtColor_BGRA2XYZ4 extends CvtColor
{
    TestBody() {
        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2BGRA);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2XYZ, 4);

        alvision.ASSERT_EQ(4, dst.channels());

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2XYZ);

        let h_dst = new alvision.Mat(dst);

        let channels = new Array < alvision.Mat >(4);
        alvision.split(h_dst, channels);
        alvision.merge(channels/*,3*/, h_dst);

        alvision.EXPECT_MAT_NEAR(dst_gold, h_dst, 1e-5);
    }
}

//CUDA_TEST_P(CvtColor, XYZ2BGR)
class CvtColor_XYZ2BGR extends CvtColor
{
    TestBody() {
        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2XYZ);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_XYZ2BGR);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_XYZ2BGR);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
    }
}

//CUDA_TEST_P(CvtColor, XYZ2RGB)
class CvtColor_XYZ2RGB extends CvtColor
{
    TestBody() {
        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2XYZ);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_XYZ2RGB);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_XYZ2RGB);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
    }
}

//CUDA_TEST_P(CvtColor, XYZ42BGR)
class CvtColor_XYZ42BGR extends CvtColor
{
    TestBody() {
        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2XYZ);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_XYZ2BGR);

        let channels = new Array < alvision.Mat >(4);
        alvision.split(src, channels);
        channels[3] = new alvision.Mat(src.size(), this.depth, alvision.Scalar.all(0));
        alvision.merge(channels/*, 4*/, src);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_XYZ2BGR);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
    }
}

//CUDA_TEST_P(CvtColor, XYZ42BGRA)
class CvtColor_XYZ42BGRA extends CvtColor
{
    TestBody() {
        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2XYZ);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_XYZ2BGR, 4);

        let channels = new Array < alvision.Mat >(4);
        alvision.split(src, channels);
        channels[3] = new alvision.Mat(src.size(), this.depth, alvision.Scalar.all(0));
        alvision.merge(channels/*, 4*/, src);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_XYZ2BGR, 4);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
    }
}

//CUDA_TEST_P(CvtColor, BGR2YCrCb)
class CvtColor_BGR2YCrCb extends CvtColor
{
    TestBody() {
        let src = this.img;

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2YCrCb);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2YCrCb);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
    }
}

//CUDA_TEST_P(CvtColor, RGB2YCrCb)
class CvtColor_RGB2YCrCb extends CvtColor
{
    TestBody() {
        let src = this.img;

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGB2YCrCb);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGB2YCrCb);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
    }
}

//CUDA_TEST_P(CvtColor, BGR2YCrCb4)
class CvtColor_BGR2YCrCb4 extends CvtColor
{
    TestBody() {
        let src = this.img;

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2YCrCb, 4);

        alvision.ASSERT_EQ(4, dst.channels());

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2YCrCb);

        let h_dst = new alvision.Mat(dst);

        let channels = new Array < alvision.Mat >(4);
        alvision.split(h_dst, channels);
        alvision.merge(channels/*, 3*/, h_dst);

        alvision.EXPECT_MAT_NEAR(dst_gold, h_dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
    }
}

//CUDA_TEST_P(CvtColor, RGBA2YCrCb4)
class CvtColor_RGBA2YCrCb4 extends CvtColor
{
    TestBody() {
        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2RGBA);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2YCrCb, 4);

        alvision.ASSERT_EQ(4, dst.channels());

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2YCrCb);

        let h_dst = new alvision.Mat(dst);

        let channels = new Array < alvision.Mat >(4);
        alvision.split(h_dst, channels);
        alvision.merge(channels/*, 3*/, h_dst);

        alvision.EXPECT_MAT_NEAR(dst_gold, h_dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
    }
}

//CUDA_TEST_P(CvtColor, YCrCb2BGR)
class CvtColor_YCrCb2BGR extends CvtColor
{
    TestBody() {
        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2YCrCb);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_YCrCb2BGR);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_YCrCb2BGR);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
    } 
}

//CUDA_TEST_P(CvtColor, YCrCb2RGB)
class CvtColor_YCrCb2RGB extends CvtColor
    {
        TestBody() {
            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2YCrCb);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_YCrCb2RGB);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_YCrCb2RGB);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
        }
}

//CUDA_TEST_P(CvtColor, YCrCb42RGB)
class CvtColor_YCrCb42RGB extends CvtColor
    {
        TestBody() {
            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2YCrCb);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_YCrCb2RGB);

            let channels = new Array < alvision.Mat >(4);
            alvision.split(src, channels);
            channels[3] = new alvision.Mat(src.size(), this.depth, alvision.Scalar.all(0));
            alvision.merge(channels/*, 4*/, src);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_YCrCb2RGB);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
        }
}

//CUDA_TEST_P(CvtColor, YCrCb42RGBA)
class CvtColor_YCrCb42RGBA extends CvtColor
    {
        TestBody() {
            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2YCrCb);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_YCrCb2RGB, 4);

            let channels = new Array < alvision.Mat >(4);
            alvision.split(src, channels);
            channels[3] = new alvision.Mat(src.size(), this.depth, alvision.Scalar.all(0));
            alvision.merge(channels/*, 4*/, src);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_YCrCb2RGB, 4);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
        }
}

//CUDA_TEST_P(CvtColor, BGR2HSV)
class CvtColor_BGR2HSV extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2HSV);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2HSV);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst,this. depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, RGB2HSV)
class CvtColor_RGB2HSV extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGB2HSV);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGB2HSV);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, RGB2HSV4)
class CvtColor_RGB2HSV4 extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGB2HSV, 4);

            alvision.ASSERT_EQ(4, dst.channels());

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGB2HSV);

            let h_dst = new alvision.Mat(dst);

            let channels = new Array < alvision.Mat >(4);
            alvision.split(h_dst, channels);
            alvision.merge(channels/*, 3*/, h_dst);

            alvision.EXPECT_MAT_NEAR(dst_gold, h_dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, RGBA2HSV4)
class CvtColor_RGBA2HSV4 extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2RGBA);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGB2HSV, 4);

            alvision.ASSERT_EQ(4, dst.channels());

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGB2HSV);

            let h_dst = new alvision.Mat(dst);

            let channels = new Array < alvision.Mat >(4);
            alvision.split(h_dst, channels);
            alvision.merge(channels/*, 3*/, h_dst);

            alvision.EXPECT_MAT_NEAR(dst_gold, h_dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, BGR2HLS)
class CvtColor_BGR2HLS extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2HLS);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2HLS);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, RGB2HLS)
class CvtColor_RGB2HLS extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGB2HLS);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGB2HLS);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, RGB2HLS4)
class CvtColor_RGB2HLS4 extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGB2HLS, 4);

            alvision.ASSERT_EQ(4, dst.channels());

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGB2HLS);

            let h_dst = new alvision.Mat(dst);

            let channels = new Array < alvision.Mat >(4);
            alvision.split(h_dst, channels);
            alvision.merge(channels/*, 3*/, h_dst);

            alvision.EXPECT_MAT_NEAR(dst_gold, h_dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, RGBA2HLS4)
class CvtColor_RGBA2HLS4 extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2RGBA);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGB2HLS, 4);

            alvision.ASSERT_EQ(4, dst.channels());

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGB2HLS);

            let h_dst = new alvision.Mat(dst);

            let channels = new Array < alvision.Mat >(4);
            alvision.split(h_dst, channels);
            alvision.merge(channels/*, 3*/, h_dst);

            alvision.EXPECT_MAT_NEAR(dst_gold, h_dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, HSV2BGR)
class CvtColor_HSV2BGR extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2HSV);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_HSV2BGR);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_HSV2BGR);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, HSV2RGB)
class CvtColor_HSV2RGB extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2HSV);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_HSV2RGB);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_HSV2RGB);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst,this. depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, HSV42BGR)
class CvtColor_HSV42BGR extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2HSV);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_HSV2BGR);

            let channels = new Array < alvision.Mat>(4);
            alvision.split(src, channels);
            channels[3] = new alvision.Mat(src.size(), this.depth, alvision.Scalar.all(0));
            alvision.merge(channels/*, 4*/, src);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_HSV2BGR);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, HSV42BGRA)
class CvtColor_HSV42BGRA extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2HSV);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_HSV2BGR, 4);

            let channels = new Array < alvision.Mat >(4);
            alvision.split(src, channels);
            channels[3] = new alvision.Mat(src.size(), this.depth, alvision.Scalar.all(0));
            alvision.merge(channels/*, 4*/, src);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_HSV2BGR, 4);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, HLS2BGR)
class CvtColor_HLS2BGR extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2HLS);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_HLS2BGR);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_HLS2BGR);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, HLS2RGB)
class CvtColor_HLS2RGB extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2HLS);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_HLS2RGB);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_HLS2RGB);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, HLS42RGB)
class CvtColor_HLS42RGB extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2HLS);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_HLS2RGB);

            let channels = new Array<alvision.Mat>(4);
            alvision.split(src, channels);
            channels[3] = new alvision.Mat(src.size(), this.depth, alvision.Scalar.all(0));
            alvision.merge(channels/*, 4*/, src);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_HLS2RGB);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, HLS42RGBA)
class CvtColor_HLS42RGBA extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2HLS);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_HLS2RGB, 4);

            let channels = new Array<alvision.Mat>(4);
            alvision.split(src, channels);
            channels[3] = new alvision.Mat(src.size(), this.depth, alvision.Scalar.all(0));
            alvision.merge(channels/*, 4*/, src);


            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_HLS2RGB, 4);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, BGR2HSV_FULL)
class CvtColor_BGR2HSV_FULL extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2HSV_FULL);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2HSV_FULL);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, RGB2HSV_FULL)
class CvtColor_RGB2HSV_FULL extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGB2HSV_FULL);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGB2HSV_FULL);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, RGB2HSV4_FULL)
class CvtColor_RGB2HSV4_FULL extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGB2HSV_FULL, 4);

            alvision.ASSERT_EQ(4, dst.channels());

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGB2HSV_FULL);

            let h_dst = new alvision.Mat(dst);

            let channels = new Array<alvision.Mat>(4);
            alvision.split(h_dst, channels);
            alvision.merge(channels/*, 3*/, h_dst);

            alvision.EXPECT_MAT_NEAR(dst_gold, h_dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, RGBA2HSV4_FULL)
class CvtColor_RGBA2HSV4_FULL extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2RGBA);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGB2HSV_FULL, 4);

            alvision.ASSERT_EQ(4, dst.channels());

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGB2HSV_FULL);

            let h_dst = new alvision.Mat(dst);

            let channels = new Array<alvision.Mat>(4);
            alvision.split(h_dst, channels);
            alvision.merge(channels/*, 3*/, h_dst);

            alvision.EXPECT_MAT_NEAR(dst_gold, h_dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, BGR2HLS_FULL)
class CvtColor_BGR2HLS_FULL extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2HLS_FULL);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2HLS_FULL);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, RGB2HLS_FULL)
class CvtColor_RGB2HLS_FULL extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGB2HLS_FULL);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGB2HLS_FULL);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, RGB2HLS4_FULL)
class CvtColor_RGB2HLS4_FULL extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGB2HLS_FULL, 4);

            alvision.ASSERT_EQ(4, dst.channels());

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGB2HLS_FULL);

            let h_dst = new alvision.Mat(dst);

            let channels = new Array<alvision.Mat>(4);
            alvision.split(h_dst, channels);
            alvision.merge(channels/*, 3*/, h_dst);

            alvision.EXPECT_MAT_NEAR(dst_gold, h_dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, RGBA2HLS4_FULL)
class CvtColor_RGBA2HLS4_FULL extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2RGBA);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGB2HLS_FULL, 4);

            alvision.ASSERT_EQ(4, dst.channels());

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGB2HLS_FULL);

            let h_dst = new alvision.Mat(dst);

            let channels = new Array<alvision.Mat>(4);
            alvision.split(h_dst, channels);
            alvision.merge(channels/*, 3*/, h_dst);

            alvision.EXPECT_MAT_NEAR(dst_gold, h_dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, HSV2BGR_FULL)
class CvtColor_HSV2BGR_FULL extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2HSV_FULL);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_HSV2BGR_FULL);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_HSV2BGR_FULL);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, HSV2RGB_FULL)
class CvtColor_HSV2RGB_FULL extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2HSV_FULL);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_HSV2RGB_FULL);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_HSV2RGB_FULL);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, HSV42RGB_FULL)
class CvtColor_HSV42RGB_FULL extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2HSV_FULL);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_HSV2RGB_FULL);

            let channels = new Array<alvision.Mat>(4);
            alvision.split(src, channels);
            channels[3] = new alvision.Mat(src.size(), this.depth, alvision.Scalar.all(0));
            alvision.merge(channels/*, 4*/, src);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_HSV2RGB_FULL);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, HSV42RGBA_FULL)
class CvtColor_HSV42RGBA_FULL extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2HSV_FULL);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_HSV2RGB_FULL, 4);

            let channels = new Array<alvision.Mat>(4);
            alvision.split(src, channels);
            channels[3] = new alvision.Mat(src.size(), this.depth, alvision.Scalar.all(0));
            alvision.merge(channels/*, 4*/, src);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_HSV2RGB_FULL, 4);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, HLS2BGR_FULL)
class CvtColor_HLS2BGR_FULL extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2HLS_FULL);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_HLS2BGR_FULL);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_HLS2BGR_FULL);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, HLS2RGB_FULL)
class CvtColor_HLS2RGB_FULL extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2HLS_FULL);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_HLS2RGB_FULL);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_HLS2RGB_FULL);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, HLS42RGB_FULL)
class CvtColor_HLS42RGB_FULL extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2HLS_FULL);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_HLS2RGB_FULL);

            let channels = new Array<alvision.Mat>(4);
            alvision.split(src, channels);
            channels[3] = new alvision.Mat(src.size(), this.depth, alvision.Scalar.all(0));
            alvision.merge(channels/*, 4*/, src);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_HLS2RGB_FULL);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, HLS42RGBA_FULL)
class CvtColor_HLS42RGBA_FULL extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2HLS_FULL);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_HLS2RGB_FULL, 4);

            let channels = new Array<alvision.Mat>(4);
            alvision.split(src, channels);
            channels[3] = new alvision.Mat(src.size(), this.depth, alvision.Scalar.all(0));
            alvision.merge(channels/*, 4*/, src);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_HLS2RGB_FULL, 4);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_32F ? 1e-2 : 1);
        }
}

//CUDA_TEST_P(CvtColor, BGR2YUV)
class CvtColor_BGR2YUV extends CvtColor
    {
        TestBody() {
            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2YUV);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2YUV);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
        }
}

//CUDA_TEST_P(CvtColor, RGB2YUV)
class CvtColor_RGB2YUV extends CvtColor
    {
        TestBody() {
            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGB2YUV);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGB2YUV);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
        }
}

//CUDA_TEST_P(CvtColor, YUV2BGR)
class CvtColor_YUV2BGR extends CvtColor
    {
        TestBody() {
            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2YUV);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_YUV2BGR);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_YUV2BGR);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
        }
}

//CUDA_TEST_P(CvtColor, YUV42BGR)
class CvtColor_YUV42BGR extends CvtColor
    {
        TestBody() {
            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2YUV);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_YUV2BGR);

            let channels = new Array<alvision.Mat>(4);
            alvision.split(src, channels);
            channels[3] = new alvision.Mat(src.size(), this.depth, alvision.Scalar.all(0));
            alvision.merge(channels/*, 4*/, src);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_YUV2BGR);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
        }
}

//CUDA_TEST_P(CvtColor, YUV42BGRA)
class CvtColor_YUV42BGRA extends CvtColor
    {
        TestBody() {
            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2YUV);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_YUV2BGR, 4);

            let channels = new Array<alvision.Mat>(4);
            alvision.split(src, channels);
            channels[3] = new alvision.Mat(src.size(), this.depth, alvision.Scalar.all(0));
            alvision.merge(channels/*, 4*/, src);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_YUV2BGR, 4);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
        }
}

//CUDA_TEST_P(CvtColor, YUV2RGB)
class CvtColor_YUV2RGB extends CvtColor
    {
        TestBody() {
            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_RGB2YUV);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_YUV2RGB);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_YUV2RGB);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
        }
}

//CUDA_TEST_P(CvtColor, BGR2YUV4)
class CvtColor_BGR2YUV4 extends CvtColor
    {
        TestBody() {
            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2YUV, 4);

            alvision.ASSERT_EQ(4, dst.channels());

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2YUV);

            let h_dst = new alvision.Mat(dst);

            let channels = new Array<alvision.Mat>(4);
            alvision.split(h_dst, channels);
            alvision.merge(channels/*, 3*/, h_dst);

            alvision.EXPECT_MAT_NEAR(dst_gold, h_dst, 1e-5);
        }
}

//CUDA_TEST_P(CvtColor, RGBA2YUV4)
class CvtColor_RGBA2YUV4 extends CvtColor
    {
        TestBody() {
            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2RGBA);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGB2YUV, 4);

            alvision.ASSERT_EQ(4, dst.channels());

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGB2YUV);

            let h_dst = new alvision.Mat(dst);

            let channels = new Array<alvision.Mat>(4);
            alvision.split(h_dst, channels);
            alvision.merge(channels/*, 3*/, h_dst);

            alvision.EXPECT_MAT_NEAR(dst_gold, h_dst, 1e-5);
        }
}

//CUDA_TEST_P(CvtColor, BGR2Lab)
class CvtColor_BGR2Lab extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2Lab);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2Lab);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-3);
        }
}

//CUDA_TEST_P(CvtColor, RGB2Lab)
class CvtColor_RGB2Lab extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGB2Lab);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGB2Lab);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-3);
        }
}

//CUDA_TEST_P(CvtColor, BGRA2Lab4)
class CvtColor_BGRA2Lab4 extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2RGBA);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2Lab, 4);

            alvision.ASSERT_EQ(4, dst.channels());

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2Lab);

            let h_dst = new alvision.Mat(dst);

            let channels = new Array<alvision.Mat>(4);
            alvision.split(h_dst, channels);
            alvision.merge(channels/*, 3*/, h_dst);

            alvision.EXPECT_MAT_NEAR(dst_gold, h_dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-3);
        }
}

//CUDA_TEST_P(CvtColor, LBGR2Lab)
class CvtColor_LBGR2Lab extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_LBGR2Lab);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_LBGR2Lab);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-3);
        }
}

//CUDA_TEST_P(CvtColor, LRGB2Lab)
class CvtColor_LRGB2Lab extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_LRGB2Lab);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_LRGB2Lab);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-3);
        }
}

//CUDA_TEST_P(CvtColor, LBGRA2Lab4)
class CvtColor_LBGRA2Lab4 extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2RGBA);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_LBGR2Lab, 4);

            alvision.ASSERT_EQ(4, dst.channels());

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_LBGR2Lab);

            let h_dst = new alvision.Mat(dst);

            let channels = new Array<alvision.Mat>(4);
            alvision.split(h_dst, channels);
            alvision.merge(channels/*, 3*/, h_dst);

            alvision.EXPECT_MAT_NEAR(dst_gold, h_dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-3);
        }
}

//CUDA_TEST_P(CvtColor, Lab2BGR)
class CvtColor_Lab2BGR extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2Lab);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_Lab2BGR);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_Lab2BGR);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-5);
        }
}

//CUDA_TEST_P(CvtColor, Lab2RGB)
class CvtColor_Lab2RGB extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2Lab);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_Lab2RGB);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_Lab2RGB);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-5);
        }
}

//CUDA_TEST_P(CvtColor, Lab2BGRA)
class CvtColor_Lab2BGRA extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2Lab);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_Lab2BGR, 4);

            alvision.ASSERT_EQ(4, dst.channels());

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_Lab2BGR, 4);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-5);
        }
}

//CUDA_TEST_P(CvtColor, Lab2LBGR)
class CvtColor_Lab2LBGR extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2Lab);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_Lab2LBGR);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_Lab2LBGR);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-5);
        }
}

//CUDA_TEST_P(CvtColor, Lab2LRGB)
class CvtColor_Lab2LRGB extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2Lab);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_Lab2LRGB);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_Lab2LRGB);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-5);
        }
}

//CUDA_TEST_P(CvtColor, Lab2LRGBA)
class CvtColor_Lab2LRGBA extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2Lab);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_Lab2LRGB, 4);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_Lab2LRGB, 4);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-5);
        }
}

//CUDA_TEST_P(CvtColor, BGR2Luv)
class CvtColor_BGR2Luv extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2Luv);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2Luv);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-3);
        }
}

//CUDA_TEST_P(CvtColor, RGB2Luv)
class CvtColor_RGB2Luv extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGB2Luv);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGB2Luv);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-3);
        }
}

//CUDA_TEST_P(CvtColor, BGRA2Luv4)
class CvtColor_BGRA2Luv4 extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2RGBA);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BGR2Luv, 4);

            alvision.ASSERT_EQ(4, dst.channels());

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGR2Luv);

            let h_dst = new alvision.Mat(dst);

            let channels = new Array<alvision.Mat>(4);
            alvision.split(h_dst, channels);
            alvision.merge(channels/*, 3*/, h_dst);

            alvision.EXPECT_MAT_NEAR(dst_gold, h_dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-3);
        }
}

//CUDA_TEST_P(CvtColor, LBGR2Luv)
class CvtColor_LBGR2Luv extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_LBGR2Luv);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_LBGR2Luv);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-3);
        }
}

//CUDA_TEST_P(CvtColor, LRGB2Luv)
class CvtColor_LRGB2Luv extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = this.img;

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_LRGB2Luv);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_LRGB2Luv);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-3);
        }
}

//CUDA_TEST_P(CvtColor, LBGRA2Luv4)
class CvtColor_LBGRA2Luv4 extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2RGBA);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_LBGR2Luv, 4);

            alvision.ASSERT_EQ(4, dst.channels());

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_LBGR2Luv);

            let h_dst = new alvision.Mat(dst);

            let channels = new Array<alvision.Mat>(4);
            alvision.split(h_dst, channels);
            alvision.merge(channels/*, 3*/, h_dst);

            alvision.EXPECT_MAT_NEAR(dst_gold, h_dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-3);
        }
}

//CUDA_TEST_P(CvtColor, Luv2BGR)
class CvtColor_Luv2BGR extends CvtColor
{
    TestBody() {
        if (this.depth == alvision.MatrixType.CV_16U)
            return;

        let src = new alvision.Mat();
        alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2Luv);

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_Luv2BGR);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_Luv2BGR);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-4);
    }
}

//CUDA_TEST_P(CvtColor, Luv2RGB)
class CvtColor_Luv2RGB extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2Luv);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_Luv2RGB);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_Luv2RGB);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-4);
        }
}

//CUDA_TEST_P(CvtColor, Luv2BGRA)
class CvtColor_Luv2BGRA extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2Luv);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_Luv2BGR, 4);

            alvision.ASSERT_EQ(4, dst.channels());

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_Luv2BGR, 4);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-4);
        }
}

//CUDA_TEST_P(CvtColor, Luv2LBGR)
class CvtColor_Luv2LBGR extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2Luv);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_Luv2LBGR);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_Luv2LBGR);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-4);
        }
}

//CUDA_TEST_P(CvtColor, Luv2LRGB)
class CvtColor_Luv2LRGB extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2Luv);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_Luv2LRGB);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_Luv2LRGB);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-4);
        }
}

//CUDA_TEST_P(CvtColor, Luv2LRGBA)
class CvtColor_Luv2LRGBA extends CvtColor
    {
        TestBody() {
            if (this.depth == alvision.MatrixType.CV_16U)
                return;

            let src = new alvision.Mat();
            alvision.cvtColor(this.img, src, alvision.ColorConversionCodes.COLOR_BGR2Luv);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_Luv2LRGB, 4);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_Luv2LRGB, 4);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, this.depth == alvision.MatrixType.CV_8U ? 1 : 1e-4);
        }
}

//#if defined (CUDA_VERSION) && (CUDA_VERSION >= 5000)

//CUDA_TEST_P(CvtColor, RGBA2mRGBA)
class CvtColor_RGBA2mRGBA extends CvtColor
    {
        TestBody() {
            if (this.depth != alvision.MatrixType.CV_8U)
                return;

            let src = alvision.randomMat(this.size, alvision.MatrixType.CV_MAKETYPE(this.depth, 4));

            let dst = alvision.createMat(src.size(), src.type(), this.useRoi);
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_RGBA2mRGBA);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_RGBA2mRGBA);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1);
        }
}

//#endif // defined (CUDA_VERSION) && (CUDA_VERSION >= 5000)

//CUDA_TEST_P(CvtColor, BayerBG2BGR)
class CvtColor_BayerBG2BGR extends CvtColor
    {
        TestBody() {
            if ((this.depth != alvision.MatrixType.CV_8U && this.depth != alvision.MatrixType.CV_16U) || this.useRoi)
                return;

            let src = alvision.randomMat(this.size, this.depth);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BayerBG2BGR);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BayerBG2BGR);

            alvision.EXPECT_MAT_NEAR(dst_gold.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), dst.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), 0);
        }
}

//CUDA_TEST_P(CvtColor, BayerBG2BGR4)
class CvtColor_BayerBG2BGR4 extends CvtColor
    {
        TestBody() {
            if ((this.depth != alvision.MatrixType.CV_8U && this.depth != alvision.MatrixType.CV_16U) || this.useRoi)
                return;

            let src = alvision.randomMat(this.size, this.depth);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BayerBG2BGR, 4);

            alvision.ASSERT_EQ(4, dst.channels());

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BayerBG2BGR);

            let dst4 = new alvision.Mat (dst);
            let dst3 = new alvision.Mat();
            alvision.cvtColor(dst4, dst3, alvision.ColorConversionCodes.COLOR_BGRA2BGR);


            alvision.EXPECT_MAT_NEAR(dst_gold.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), dst3.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), 0);
        }
}

//CUDA_TEST_P(CvtColor, BayerGB2BGR)
class CvtColor_BayerGB2BGR extends CvtColor
    {
        TestBody() {
            if ((this.depth != alvision.MatrixType.CV_8U && this.depth != alvision.MatrixType.CV_16U) || this.useRoi)
                return;

            let src = alvision.randomMat(this.size, this.depth);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BayerGB2BGR);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BayerGB2BGR);

            alvision.EXPECT_MAT_NEAR(dst_gold.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), dst.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), 0);
        }
}

//CUDA_TEST_P(CvtColor, BayerGB2BGR4)
class CvtColor_BayerGB2BGR4 extends CvtColor
    {
        TestBody() {
            if ((this.depth != alvision.MatrixType.CV_8U && this.depth != alvision.MatrixType.CV_16U) || this.useRoi)
                return;

            let src = alvision.randomMat(this.size, this.depth);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BayerGB2BGR, 4);

            alvision.ASSERT_EQ(4, dst.channels());

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BayerGB2BGR);

            let dst4 = new alvision.Mat (dst);
            let dst3 = new alvision.Mat();
            alvision.cvtColor(dst4, dst3, alvision.ColorConversionCodes.COLOR_BGRA2BGR);

            alvision.EXPECT_MAT_NEAR(dst_gold.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), dst3.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), 0);
        }
}

//CUDA_TEST_P(CvtColor, BayerRG2BGR)
class CvtColor_BayerRG2BGR extends CvtColor
    {
        TestBody() {
            if ((this.depth != alvision.MatrixType.CV_8U && this.depth != alvision.MatrixType.CV_16U) || this.useRoi)
                return;

            let src = alvision.randomMat(this.size, this.depth);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BayerRG2BGR);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BayerRG2BGR);

            alvision.EXPECT_MAT_NEAR(dst_gold.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), dst.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), 0);
        }
}

//CUDA_TEST_P(CvtColor, BayerRG2BGR4)
class CvtColor_BayerRG2BGR4 extends CvtColor
    {
        TestBody() {
            if ((this.depth != alvision.MatrixType.CV_8U && this.depth != alvision.MatrixType.CV_16U) || this.useRoi)
                return;

            let src = alvision.randomMat(this.size, this.depth);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BayerRG2BGR, 4);

            alvision.ASSERT_EQ(4, dst.channels());

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BayerRG2BGR);

            let dst4 = new alvision.Mat (dst);
            let dst3 = new alvision.Mat();
            alvision.cvtColor(dst4, dst3, alvision.ColorConversionCodes.COLOR_BGRA2BGR);

            alvision.EXPECT_MAT_NEAR(dst_gold.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), dst3.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), 0);
        }
}

//CUDA_TEST_P(CvtColor, BayerGR2BGR)
class CvtColor_BayerGR2BGR extends CvtColor
    {
        TestBody() {
            if ((this.depth != alvision.MatrixType.CV_8U && this.depth != alvision.MatrixType.CV_16U) || this.useRoi)
                return;

            let src = alvision.randomMat(this.size, this.depth);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BayerGR2BGR);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BayerGR2BGR);

            alvision.EXPECT_MAT_NEAR(dst_gold.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), dst.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), 0);
        }
}

//CUDA_TEST_P(CvtColor, BayerGR2BGR4)
class CvtColor_BayerGR2BGR4 extends CvtColor
    {
        TestBody() {
            if ((this.depth != alvision.MatrixType.CV_8U && this.depth != alvision.MatrixType.CV_16U) || this.useRoi)
                return;

            let src = alvision.randomMat(this.size, this.depth);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BayerGR2BGR, 4);

            alvision.ASSERT_EQ(4, dst.channels());

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BayerGR2BGR);

            let dst4 = new alvision.Mat (dst);
            let dst3 = new alvision.Mat();
            alvision.cvtColor(dst4, dst3, alvision.ColorConversionCodes.COLOR_BGRA2BGR);

            alvision.EXPECT_MAT_NEAR(dst_gold.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), dst3.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), 0);
        }
}

//CUDA_TEST_P(CvtColor, BayerBG2Gray)
class CvtColor_BayerBG2Gray extends CvtColor
    {
        TestBody() {
            if ((this.depth != alvision.MatrixType.CV_8U && this.depth != alvision.MatrixType.CV_16U) || this.useRoi)
                return;

            let src = alvision.randomMat(this.size, this.depth);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BayerBG2GRAY);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BayerBG2GRAY);

            alvision.EXPECT_MAT_NEAR(dst_gold.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), dst.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), 2);
        }
}

//CUDA_TEST_P(CvtColor, BayerGB2Gray)
class CvtColor_BayerGB2Gray extends CvtColor
    {
        TestBody() {
            if ((this.depth != alvision.MatrixType.CV_8U && this.depth != alvision.MatrixType.CV_16U) || this.useRoi)
                return;

            let src = alvision.randomMat(this.size, this.depth);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BayerGB2GRAY);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BayerGB2GRAY);

            alvision.EXPECT_MAT_NEAR(dst_gold.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), dst.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), 2);
        }
}

//CUDA_TEST_P(CvtColor, BayerRG2Gray)
class CvtColor_BayerRG2Gray extends CvtColor
    {
        TestBody() {
            if ((this.depth != alvision.MatrixType.CV_8U && this.depth != alvision.MatrixType.CV_16U) || this.useRoi)
                return;

            let src = alvision.randomMat(this.size, this.depth);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BayerRG2GRAY);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BayerRG2GRAY);

            alvision.EXPECT_MAT_NEAR(dst_gold.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), dst.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), 2);
        }
}

//CUDA_TEST_P(CvtColor, BayerGR2Gray)
class CvtColor_BayerGR2Gray extends CvtColor
    {
        TestBody() {
            if ((this.depth != alvision.MatrixType.CV_8U && this.depth != alvision.MatrixType.CV_16U) || this.useRoi)
                return;

            let src = alvision.randomMat(this.size, this.depth);

            let dst = new alvision.cuda.GpuMat();
            alvision.cudaimgproc.cvtColor(alvision.loadMat(src, this.useRoi), dst, alvision.ColorConversionCodes.COLOR_BayerGR2GRAY);

            let dst_gold = new alvision.Mat();
            alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BayerGR2GRAY);

            alvision.EXPECT_MAT_NEAR(dst_gold.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), dst.roi(new alvision.Rect(1, 1, dst.cols().valueOf() - 2, dst.rows().valueOf() - 2)), 2);
        }
}

    alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'CvtColor', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8U,alvision.MatrixType.CV_16U,alvision.MatrixType.CV_32F],
     alvision.   WHOLE_SUBMAT
    ]));

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Demosaicing

class Demosaicing extends alvision.cvtest.CUDA_TEST// testing::TestWithParam<alvision.cuda.DeviceInfo>
{
    protected devInfo: alvision.cuda.DeviceInfo;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }

    mosaic(src: alvision.Mat_<alvision.Vecb> | alvision.Mat, dst: alvision.Mat_<alvision.uchar>, firstRed: alvision.Point ) : void
    {
        dst.create(src.size());

        for (let y = 0; y < src.rows(); ++y)
        {
            for (let x = 0; x < src.cols(); ++x)
            {
                let pix = src.at<alvision.Vecb>("Vecb", y, x).get();

                let alternate = new alvision.Point();
                alternate.x = (x + firstRed.x.valueOf()) % 2;
                alternate.y = (y + firstRed.y.valueOf()) % 2;

                if (alternate.y == 0)
                {
                    if (alternate.x == 0)
                    {
                        // RG
                        // GB
                        dst.at<alvision.Vecb>("Vecb", x).set(pix[2]);
                    }
                    else
                    {
                        // GR
                        // BG
                        dst.at<alvision.Vecb>("Vecb", y, x).set(pix[1]);
                    }
                }
                else
                {
                    if (alternate.x == 0)
                    {
                        // GB
                        // RG
                        dst.at<alvision.Vecb>("Vecb", y, x).set(pix[1]);
                    }
                    else
                    {
                        // BG
                        // GR
                        dst.at<alvision.Vecb>("Vecb", y, x).set(pix[0]);
                    }
                }
            }
        }
    }
};

//CUDA_TEST_P(Demosaicing, BayerBG2BGR)
class Demosaicing_BayerBG2BGR extends Demosaicing
{
    TestBody() {
        let img = alvision.readImage("stereobm/aloe-L.png");
        alvision.ASSERT_FALSE(img.empty(), "Can't load input image");

        let src = new alvision.Matb();
        this.mosaic(img, src, new alvision.Point(1, 1));

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.demosaicing(alvision.loadMat(src), dst, alvision.ColorConversionCodes.COLOR_BayerBG2BGR);

        alvision.EXPECT_MAT_SIMILAR(img, dst.getMat(), 2e-2);
    }
}

//CUDA_TEST_P(Demosaicing, BayerGB2BGR)
class Demosaicing_BayerGB2BGR extends Demosaicing
{
    TestBody() {
        let img = alvision.readImage("stereobm/aloe-L.png");
        alvision.ASSERT_FALSE(img.empty(), "Can't load input image");

        let src = new alvision.Matb();
        this.mosaic(img, src, new alvision.Point(0, 1));

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.demosaicing(alvision.loadMat(src), dst, alvision.ColorConversionCodes.COLOR_BayerGB2BGR);

        alvision.EXPECT_MAT_SIMILAR(img, dst.getMat(), 2e-2);
    }
}

//CUDA_TEST_P(Demosaicing, BayerRG2BGR)
class Demosaicing_BayerRG2BGR extends Demosaicing
{
    TestBody() {
        let img = alvision.readImage("stereobm/aloe-L.png");
        alvision.ASSERT_FALSE(img.empty(), "Can't load input image");

        let src = new alvision.Matb();
        this.mosaic(img, src, new alvision.Point(0, 0));

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.demosaicing(alvision.loadMat(src), dst, alvision.ColorConversionCodes.COLOR_BayerRG2BGR);

        alvision.EXPECT_MAT_SIMILAR(img, dst.getMat(), 2e-2);
    }
}

//CUDA_TEST_P(Demosaicing, BayerGR2BGR)
class Demosaicing_BayerGR2BGR extends Demosaicing
{
    TestBody() {
        let img = alvision.readImage("stereobm/aloe-L.png");
        alvision.ASSERT_FALSE(img.empty(), "Can't load input image");

        let src = new alvision.Matb();
        this.mosaic(img, src, new alvision.Point(1, 0));

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.demosaicing(alvision.loadMat(src), dst, alvision.ColorConversionCodes.COLOR_BayerGR2BGR);

        alvision.EXPECT_MAT_SIMILAR(img, dst.getMat(), 2e-2);
    }
}

//CUDA_TEST_P(Demosaicing, BayerBG2BGR_MHT)
class Demosaicing_BayerBG2BGR_MHT extends Demosaicing
{
    TestBody() {
        let img = alvision.readImage("stereobm/aloe-L.png");
        alvision.ASSERT_FALSE(img.empty(), "Can't load input image");

        let src = new alvision.Matb();
        this.mosaic(img, src, new alvision.Point(1, 1));

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.demosaicing(alvision.loadMat(src), dst, alvision.cudaimgproc.DemosaicTypes.COLOR_BayerBG2BGR_MHT);

        alvision.EXPECT_MAT_SIMILAR(img, dst.getMat(), 5e-3);
    }
}

//CUDA_TEST_P(Demosaicing, BayerGB2BGR_MHT)
class Demosaicing_BayerGB2BGR_MHT extends Demosaicing
{
    TestBody() {
        let img = alvision.readImage("stereobm/aloe-L.png");
        alvision.ASSERT_FALSE(img.empty(), "Can't load input image");

        let src = new alvision.Matb();
        this.mosaic(img, src, new alvision.Point(0, 1));

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.demosaicing(alvision.loadMat(src), dst, alvision.cudaimgproc.DemosaicTypes.COLOR_BayerGB2BGR_MHT);

        alvision.EXPECT_MAT_SIMILAR(img, dst.getMat(), 5e-3);
    }
}

//CUDA_TEST_P(Demosaicing, BayerRG2BGR_MHT)
class Demosaicing_BayerRG2BGR_MHT extends Demosaicing
{
    TestBody() {
        let img = alvision.readImage("stereobm/aloe-L.png");
        alvision.ASSERT_FALSE(img.empty(), "Can't load input image");

        let src = new alvision.Matb();
        this.mosaic(img, src, new alvision.Point(0, 0));

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.demosaicing(alvision.loadMat(src), dst, alvision.cudaimgproc.DemosaicTypes.COLOR_BayerRG2BGR_MHT);

        alvision.EXPECT_MAT_SIMILAR(img, dst.getMat(), 5e-3);
    }
}

//CUDA_TEST_P(Demosaicing, BayerGR2BGR_MHT)
class Demosaicing_BayerGR2BGR_MHT extends Demosaicing
{
    TestBody() {
        let img = alvision.readImage("stereobm/aloe-L.png");
        alvision.ASSERT_FALSE(img.empty(), "Can't load input image");

        let src = new alvision.Matb();
        this.mosaic(img, src, new alvision.Point(1, 0));

        let dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.demosaicing(alvision.loadMat(src), dst, alvision.cudaimgproc.DemosaicTypes.COLOR_BayerGR2BGR_MHT);

        alvision.EXPECT_MAT_SIMILAR(img, dst.getMat(), 5e-3);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'Demosaicing', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([ alvision.ALL_DEVICES]));

///////////////////////////////////////////////////////////////////////////////////////////////////////
// swapChannels

//PARAM_TEST_CASE(SwapChannels, alvision.cuda.DeviceInfo, alvision.Size, UseRoi)
class SwapChannels extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected useRoi: boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.useRoi =  this.GET_PARAM<boolean>(2);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(SwapChannels, Accuracy)
class SwapChannels_Accuracy extends SwapChannels
{
    TestBody(){
        let src = alvision.readImageType("stereobm/aloe-L.png", alvision.MatrixType.CV_8UC4);
        alvision.ASSERT_FALSE(src.empty());

        let d_src = alvision.loadMat(src, this.useRoi);

        const dstOrder = [2, 1, 0, 3];
        alvision.cudaimgproc.swapChannels(d_src, dstOrder);

        let dst_gold = new alvision.Mat();
        alvision.cvtColor(src, dst_gold, alvision.ColorConversionCodes.COLOR_BGRA2RGBA);

        alvision.EXPECT_MAT_NEAR(dst_gold, d_src, 0.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'SwapChannels', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.WHOLE_SUBMAT
    ]));

//#endif // HAVE_CUDA
