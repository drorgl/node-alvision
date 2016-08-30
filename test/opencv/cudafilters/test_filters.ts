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

//namespace
//{
//    IMPLEMENT_PARAM_CLASS(KSize, alvision.Size)
//    IMPLEMENT_PARAM_CLASS(Anchor, alvision.Point)
//    IMPLEMENT_PARAM_CLASS(Deriv_X, int)
//    IMPLEMENT_PARAM_CLASS(Deriv_Y, int)
//    IMPLEMENT_PARAM_CLASS(Iterations, int)

function getInnerROI(m_: alvision.InputArray, ksize: alvision.Size ): alvision.Mat 
    {
    //let m = getMat(m_);
    let m = <alvision.Mat>m_;
        let roi = new alvision.Rect (ksize.width, ksize.height, m.cols.valueOf() - 2 * ksize.width.valueOf(), m.rows.valueOf() - 2 * ksize.height.valueOf());
        return m.roi(roi);
    }

//function getInnerROI(m: alvision.InputArray, ksize: alvision.int ): alvision.Mat
//    {
//        return getInnerROI(m,new alvision.Size(ksize, ksize));
//    }
//}

/////////////////////////////////////////////////////////////////////////////////////////////////
// Blur

//PARAM_TEST_CASE(Blur, alvision.cuda.DeviceInfo, alvision.Size, MatType, KSize, Anchor, BorderType, UseRoi)
class Blur extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected type: alvision.int;
    protected ksize: alvision.Size;
    protected anchor: alvision.Point;
    protected borderType: alvision.int;
    protected useRoi: boolean;

    SetUp() : void
    {
        this.devInfo =    this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =       this.GET_PARAM<alvision.Size>(1);
        this.type = this.GET_PARAM<alvision.int>(2);
        this.ksize = this.GET_PARAM<alvision.Size>(3);
        this.anchor =     this.GET_PARAM<alvision.Point>(4);
        this.borderType = this.GET_PARAM<alvision.int>(5);
        this.useRoi =     this.GET_PARAM<boolean>(6);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Blur, Accuracy)
class Blur_Accuracy extends Blur
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.type);

        let blurFilter = alvision.cudafilters.createBoxFilter(src.type(), -1, this.ksize, this.anchor, this.borderType);

        let dst = alvision.createMat(this.size, this.type, this.useRoi);
        blurFilter.apply(alvision.loadMat(src, this.useRoi), dst);

        let dst_gold = new alvision.Mat();
        alvision.blur(src, dst_gold, this.ksize, this.anchor, this.borderType);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Filters', 'Blur', (case_name, test_name) => { return null; },new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8UC1,alvision.MatrixType.CV_8UC4],
    [new alvision.Size(3, 3),new alvision.Size(5, 5),new alvision.Size(7, 7)],
    [new alvision.Point(-1, -1), new alvision.Point(0, 0), new alvision.Point(2, 2)],
    [alvision.BorderTypes.BORDER_REFLECT101, alvision.BorderTypes.BORDER_REPLICATE, alvision.BorderTypes.BORDER_CONSTANT, alvision.BorderTypes.BORDER_REFLECT],
    alvision.WHOLE_SUBMAT
    ]));

/////////////////////////////////////////////////////////////////////////////////////////////////
// Filter2D

//PARAM_TEST_CASE(Filter2D, alvision.cuda.DeviceInfo, alvision.Size, MatType, KSize, Anchor, BorderType, UseRoi)
class Filter2D extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected type: alvision.int;
    protected ksize: alvision.Size;
    protected anchor: alvision.Point;
    protected borderType: alvision.int;
    protected useRoi: boolean;

    SetUp() : void
    {
        this.devInfo =    this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =       this.GET_PARAM<alvision.Size>(1);
        this.type =       this.GET_PARAM<alvision.int>(2);
        this.ksize =      this.GET_PARAM<alvision.Size>(3);
        this.anchor =     this.GET_PARAM<alvision.Point>(4);
        this.borderType = this.GET_PARAM<alvision.int>(5);
        this.useRoi =     this.GET_PARAM<boolean>(6);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Filter2D, Accuracy)
class Filter2D_Accuracy extends Filter2D
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.type);
        let kernel = alvision.randomMat(new alvision.Size(this.ksize.width, this.ksize.height), alvision.MatrixType.CV_32FC1, 0.0, 1.0);

        let filter2D = alvision.cudafilters.createLinearFilter(src.type(), -1, kernel, this.anchor, this.borderType);

        let dst = alvision.createMat(this.size,this. type,this. useRoi);
        filter2D.apply(alvision.loadMat(src, this.useRoi), dst);

        let dst_gold = new alvision.Mat();
        alvision.filter2D(src, dst_gold, -1, kernel,this. anchor, 0, this.borderType);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst,alvision.MatrixType. CV_MAT_DEPTH(this.type) == alvision.MatrixType.CV_32F ? 1e-1 : 1.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Filters', 'Filter2D', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8UC1,alvision.MatrixType.CV_8UC4,alvision.MatrixType.CV_16UC1,alvision.MatrixType.CV_16UC4,alvision.MatrixType.CV_32FC1,alvision.MatrixType.CV_32FC4],
    [new alvision.Size(3, 3),new alvision.Size(5, 5),new alvision.Size(7, 7),new alvision.Size(11, 11),new alvision.Size(13, 13),new alvision.Size(15, 15)],
    [new alvision.Point(-1, -1),new alvision.Point(0, 0),new alvision.Point(2, 2)],
    [alvision.BorderTypes.BORDER_REFLECT101,alvision.BorderTypes.BORDER_REPLICATE,alvision.BorderTypes.BORDER_CONSTANT,alvision.BorderTypes.BORDER_REFLECT],
    alvision.WHOLE_SUBMAT
]));

/////////////////////////////////////////////////////////////////////////////////////////////////
// Laplacian

//PARAM_TEST_CASE(Laplacian, alvision.cuda.DeviceInfo, alvision.Size, MatType, KSize, UseRoi)
class Laplacian extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected type: alvision.int;
    protected ksize: alvision.Size;
    protected useRoi: boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.type =    this.GET_PARAM<alvision.int>(2);
        this.ksize =   this.GET_PARAM<alvision.Size>(3);
        this.useRoi =  this.GET_PARAM<boolean>(4);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Laplacian, Accuracy)
class Laplacian_Accuracy extends Laplacian
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.type);

        let laplacian = alvision.cudafilters.createLaplacianFilter(src.type(), -1, this.ksize.width);

        let dst = alvision.createMat(this.size, this.type, this.useRoi);
        laplacian.apply(alvision.loadMat(src, this.useRoi), dst);

        let dst_gold = new alvision.Mat();
        alvision.Laplacian(src, dst_gold, -1, this.ksize.width);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, src.depth() < alvision.MatrixType.CV_32F ? 0.0 : 1e-3);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Filters', 'Laplacian', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8UC1,alvision.MatrixType.CV_8UC4,alvision.MatrixType.CV_32FC1],
    [new alvision.Size(1, 1),new alvision.Size(3, 3)],
    alvision.WHOLE_SUBMAT
]));

/////////////////////////////////////////////////////////////////////////////////////////////////
// SeparableLinearFilter

//PARAM_TEST_CASE(SeparableLinearFilter, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, Channels, KSize, Anchor, BorderType, UseRoi)
class SeparableLinearFilter extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected depth: alvision.int;
    protected cn: alvision.int;
    protected ksize: alvision.Size;
    protected anchor: alvision.Point;
    protected borderType: alvision.int;
    protected useRoi: boolean;

    protected type: alvision.int;

    SetUp() : void
    {
        this.devInfo =    this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =       this.GET_PARAM<alvision.Size>(1);
        this.depth =      this.GET_PARAM<alvision.int>(2);
        this.cn =         this.GET_PARAM<alvision.int>(3);
        this.ksize =      this.GET_PARAM<alvision.Size>(4);
        this.anchor =     this.GET_PARAM<alvision.Point>(5);
        this.borderType = this.GET_PARAM<alvision.int>(6);
        this.useRoi =     this.GET_PARAM<boolean>(7);

        alvision.cuda.setDevice(this.devInfo.deviceID());

        this.type = alvision.MatrixType.CV_MAKETYPE(this.depth, this.cn);
    }
};

//CUDA_TEST_P(SeparableLinearFilter, Accuracy)
class SeparableLinearFilter_Accuracy extends SeparableLinearFilter
{
    TestBody() {
        let src = alvision.randomMat(this.size,this. type);
        let rowKernel = alvision.randomMat(new alvision.Size(this.ksize.width, 1), alvision.MatrixType.CV_32FC1, 0.0, 1.0);
        let columnKernel = alvision.randomMat(new alvision.Size(this.ksize.height, 1), alvision.MatrixType.CV_32FC1, 0.0, 1.0);

        let filter = alvision.cudafilters.createSeparableLinearFilter(src.type(), -1, rowKernel, columnKernel, this.anchor, this.borderType);

        let dst = alvision.createMat(this.size, this.type, this.useRoi);
        filter.apply(alvision.loadMat(src, this.useRoi), dst);

        let dst_gold = new alvision.Mat();
        alvision.sepFilter2D(src, dst_gold, -1, rowKernel, columnKernel,this. anchor, 0, this.borderType);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, src.depth() < alvision.MatrixType.CV_32F ? 1.0 : 1e-2);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Filters', 'SeparableLinearFilter', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8U,alvision.MatrixType.CV_16U,alvision.MatrixType.CV_16S,alvision.MatrixType.CV_32F],
    alvision.IMAGE_CHANNELS,
    [new alvision.Size(3, 3),
    new alvision.Size(7, 7),
    new alvision.Size(13, 13),
    new alvision.Size(15, 15),
    new alvision.Size(17, 17),
    new alvision.Size(23, 15),
    new alvision.Size(31, 3)],
    [new alvision.Point(-1, -1), new alvision.Point(0, 0),new alvision.Point(2, 2)],
    [alvision.BorderTypes.BORDER_REFLECT101,
    alvision.BorderTypes.BORDER_REPLICATE,
    alvision.BorderTypes.BORDER_CONSTANT,
    alvision.BorderTypes.BORDER_REFLECT],
    alvision.WHOLE_SUBMAT
]));

/////////////////////////////////////////////////////////////////////////////////////////////////
// Sobel

//PARAM_TEST_CASE(Sobel, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, Channels, KSize, Deriv_X, Deriv_Y, BorderType, UseRoi)
class Sobel extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected depth: alvision.int;
    protected cn: alvision.int;
    protected ksize: alvision.Size;
    protected dx: alvision.int;
    protected dy: alvision.int;
    protected borderType: alvision.int;
    protected useRoi: boolean;

    protected type: alvision.int;

    SetUp() : void
    {
        this.devInfo =    this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =       this.GET_PARAM<alvision.Size>(1);
        this.depth =      this.GET_PARAM<alvision.int>(2);
        this.cn =         this.GET_PARAM<alvision.int>(3);
        this.ksize =      this.GET_PARAM<alvision.Size>(4);
        this.dx =         this.GET_PARAM<alvision.int>(5);
        this.dy =         this.GET_PARAM<alvision.int>(6);
        this.borderType = this.GET_PARAM<alvision.int>(7);
        this.useRoi =     this.GET_PARAM<boolean>(8);

        alvision.cuda.setDevice(this.devInfo.deviceID());

        this.type = alvision.MatrixType.CV_MAKETYPE(this.depth, this.cn);
    }
};

//CUDA_TEST_P(Sobel, Accuracy)
class Sobel_Accuracy extends Sobel
{
    TestBody() {
        if (this.dx == 0 && this.dy == 0)
            return;

        let src = alvision.randomMat(this.size, this.type);

        let sobel = alvision.cudafilters.createSobelFilter(src.type(), -1, this.dx, this.dy, this.ksize.width, 1.0, this.borderType);

        let dst = alvision.createMat(this.size, this.type, this.useRoi);
        sobel.apply(alvision.loadMat(src, this.useRoi), dst);

        let dst_gold = new alvision.Mat();
        alvision.Sobel(src, dst_gold, -1, this.dx, this.dy, this.ksize.width, 1.0, 0.0, this.borderType);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, src.depth() < alvision.MatrixType.CV_32F ? 0.0 : 0.1);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Filters', 'Sobel', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8U, alvision.MatrixType.CV_16U, alvision.MatrixType.CV_16S, alvision.MatrixType.CV_32F],
    alvision.IMAGE_CHANNELS,
    [new alvision.Size(3, 3), new alvision.Size(5, 5), new alvision.Size(7, 7)],
    [0,1,2],
    [0,1,2],
     [alvision.BorderTypes.BORDER_REFLECT101,
     alvision.BorderTypes.BORDER_REPLICATE,
     alvision.BorderTypes.BORDER_CONSTANT,
     alvision.BorderTypes.BORDER_REFLECT],
    alvision.WHOLE_SUBMAT
]));

/////////////////////////////////////////////////////////////////////////////////////////////////
// Scharr

//PARAM_TEST_CASE(Scharr, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, Channels, Deriv_X, Deriv_Y, BorderType, UseRoi)
class Scharr extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size 
    protected depth : alvision.int;
    protected cn: alvision.int;
    protected dx: alvision.int;
    protected dy: alvision.int;
    protected borderType: alvision.int;
    protected useRoi : boolean;

    protected type:alvision.int;

    SetUp() : void
    {
        this.devInfo =    this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =       this.GET_PARAM<alvision.Size>(1);
        this.depth =      this.GET_PARAM<alvision.int>(2);
        this.cn =         this.GET_PARAM<alvision.int>(3);
        this.dx =         this.GET_PARAM<alvision.int>(4);
        this.dy =         this.GET_PARAM<alvision.int>(5);
        this.borderType = this.GET_PARAM<alvision.int>(6);
        this.useRoi =     this.GET_PARAM<boolean>(7);

        alvision.cuda.setDevice(this.devInfo.deviceID());

        this.type = alvision.MatrixType.CV_MAKETYPE(this.depth, this.cn);
    }
};

//CUDA_TEST_P(Scharr, Accuracy)
class Scharr_Accuracy extends Scharr
{
    TestBody() {
        if (this.dx.valueOf() + this.dy.valueOf() != 1)
            return;

        let src = alvision.randomMat(this.size, this.type);

        let scharr = alvision.cudafilters.createScharrFilter(src.type(), -1, this.dx, this.dy, 1.0, this.borderType);

        let dst = alvision.createMat(this.size,this. type, this.useRoi);
        scharr.apply(alvision.loadMat(src, this.useRoi), dst);

        let dst_gold = new alvision.Mat();
        alvision.Scharr(src, dst_gold, -1, this.dx, this.dy, 1.0, 0.0, this.borderType);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, src.depth() < alvision.MatrixType.CV_32F ? 0.0 : 0.1);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Filters', 'Scharr', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8U,alvision.MatrixType.CV_16U,alvision.MatrixType.CV_16S,alvision.MatrixType.CV_32F],
    alvision.IMAGE_CHANNELS,
    [0,1],
    [0,1],
    [ alvision.BorderTypes.BORDER_REFLECT101,
     alvision.BorderTypes.BORDER_REPLICATE,
     alvision.BorderTypes.BORDER_CONSTANT,
     alvision.BorderTypes.BORDER_REFLECT],
    alvision.WHOLE_SUBMAT
    ]));

/////////////////////////////////////////////////////////////////////////////////////////////////
// GaussianBlur

//PARAM_TEST_CASE(GaussianBlur, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, Channels, KSize, BorderType, UseRoi)
class GaussianBlur extends alvision.cvtest.CUDA_TEST
{
    protected  devInfo : alvision.cuda.DeviceInfo;
    protected  size : alvision.Size;
    protected depth : alvision.int;
    protected cn: alvision.int;
    protected ksize: alvision.Size;
    protected borderType: alvision.int;
    protected useRoi: boolean;

    protected type: alvision.int;

    SetUp() : void
    {
        this.devInfo =    this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =       this.GET_PARAM<alvision.Size>(1);
        this.depth =      this.GET_PARAM<alvision.int>(2);
        this.cn =         this.GET_PARAM<alvision.int>(3);
        this.ksize =      this.GET_PARAM<alvision.Size>(4);
        this.borderType = this.GET_PARAM<alvision.int>(5);
        this.useRoi =     this.GET_PARAM<boolean>(6);

        alvision.cuda.setDevice(this.devInfo.deviceID());

        this.type = alvision.MatrixType.CV_MAKETYPE(this.depth, this.cn);
    }
};

//CUDA_TEST_P(GaussianBlur, Accuracy)
class GaussianBlur_Accuracy extends GaussianBlur
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.type);
        let sigma1 = alvision.randomDouble(0.1, 1.0);
        let sigma2 = alvision.randomDouble(0.1, 1.0);

        let gauss = alvision.cudafilters.createGaussianFilter(src.type(), -1, this.ksize, sigma1, sigma2, this.borderType);

        let dst = alvision.createMat(this.size,this. type,this. useRoi);
        gauss.apply(alvision.loadMat(src, this.useRoi), dst);

        let dst_gold = new alvision.Mat();
        alvision.GaussianBlur(src, dst_gold,this. ksize, sigma1, sigma2, this.borderType);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, src.depth() < alvision.MatrixType.CV_32F ? 4.0 : 1e-4);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Filters', 'GaussianBlur', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8U,alvision.MatrixType.CV_16U,alvision.MatrixType.CV_16S,alvision.MatrixType.CV_32F],
    alvision.IMAGE_CHANNELS,
    [new  alvision.Size(3, 3),
     new alvision.Size(5, 5),
     new alvision.Size(7, 7),
     new alvision.Size(9, 9),
     new alvision.Size(11, 11),
     new alvision.Size(13, 13),
     new alvision.Size(15, 15),
     new alvision.Size(17, 17),
     new alvision.Size(19, 19),
     new alvision.Size(21, 21),
     new alvision.Size(23, 23),
     new alvision.Size(25, 25),
     new alvision.Size(27, 27),
     new alvision.Size(29, 29),
     new alvision.Size(31, 31)],
    [ alvision.BorderTypes.BORDER_REFLECT101,
     alvision.BorderTypes.BORDER_REPLICATE,
     alvision.BorderTypes.BORDER_CONSTANT,
     alvision.BorderTypes.BORDER_REFLECT],
    alvision.WHOLE_SUBMAT]));

/////////////////////////////////////////////////////////////////////////////////////////////////
// Erode

//PARAM_TEST_CASE(Erode, alvision.cuda.DeviceInfo, alvision.Size, MatType, Anchor, Iterations, UseRoi)
class Erode extends alvision.cvtest.CUDA_TEST
{
    protected  devInfo : alvision.cuda.DeviceInfo;
    protected  size : alvision.Size;
    protected type: alvision.int;
    protected anchor: alvision.Point;
    protected iterations: alvision.int;
    protected useRoi: boolean;

    SetUp() : void
    {
        this.devInfo =    this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =       this.GET_PARAM<alvision.Size>(1);
        this.type =       this.GET_PARAM<alvision.int>(2);
        this.anchor =     this.GET_PARAM<alvision.Point>(3);
        this.iterations = this.GET_PARAM<alvision.int>(4);
        this.useRoi =     this.GET_PARAM<boolean>(5);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Erode, Accuracy)
class Erode_Accuracy extends Erode
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.type);
        let kernel = alvision.Mat.ones(3, 3, alvision.MatrixType.CV_8U).toMat();

        let erode = alvision.cudafilters.createMorphologyFilter(alvision.MorphTypes.MORPH_ERODE, src.type(), kernel, this.anchor, this.iterations);

        let dst = alvision.createMat(this.size, this.type,this. useRoi);
        erode.apply(alvision.loadMat(src, this.useRoi), dst);

        let dst_gold = new alvision.Mat();
        alvision.erode(src, dst_gold, kernel, this.anchor,this. iterations);

        let ksize = new alvision.Size(kernel.cols.valueOf() + this.iterations.valueOf() * (kernel.cols.valueOf() - 1), kernel.rows.valueOf() + this.iterations.valueOf() * (kernel.rows.valueOf() - 1));

        alvision.EXPECT_MAT_NEAR(getInnerROI(dst_gold, ksize), getInnerROI(dst, ksize), 0.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Filters', 'Erode', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8UC1,alvision.MatrixType.CV_8UC4],
    [new alvision.Point(-1, -1),new alvision.Point(0, 0),new alvision.Point(2, 2)],
    [1,2,3],
    alvision.WHOLE_SUBMAT]));

/////////////////////////////////////////////////////////////////////////////////////////////////
// Dilate

//PARAM_TEST_CASE(Dilate, alvision.cuda.DeviceInfo, alvision.Size, MatType, Anchor, Iterations, UseRoi)
class Dilate extends alvision.cvtest.CUDA_TEST
{
    protected  devInfo : alvision.cuda.DeviceInfo;
    protected  size : alvision.Size;
    protected type: alvision.int;
    protected anchor: alvision.Point;
    protected iterations: alvision.int;
    protected useRoi: boolean;

    SetUp() : void
    {
        this.devInfo =    this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =       this.GET_PARAM<alvision.Size>(1);
        this.type =       this.GET_PARAM<alvision.int>(2);
        this.anchor =     this.GET_PARAM<alvision.Point>(3);
        this.iterations = this.GET_PARAM<alvision.int>(4);
        this.useRoi =     this.GET_PARAM<boolean>(5);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Dilate, Accuracy)
class Dilate_Accuracy extends Dilate
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.type);
        let kernel = alvision.Mat.ones(3, 3, alvision.MatrixType.CV_8U).toMat()

        let dilate = alvision.cudafilters.createMorphologyFilter(alvision.MorphTypes.MORPH_DILATE, src.type(), kernel, this.anchor, this.iterations);

        let dst = alvision.createMat(this.size, this.type, this.useRoi);
        dilate.apply(alvision.loadMat(src, this.useRoi), dst);

        let dst_gold = new alvision.Mat();
        alvision.dilate(src, dst_gold, kernel, this.anchor, this.iterations);

        let ksize = new alvision.Size(kernel.cols.valueOf() + this.iterations.valueOf() * (kernel.cols.valueOf() - 1), kernel.rows.valueOf() + this.iterations.valueOf() * (kernel.rows.valueOf() - 1));

        alvision.EXPECT_MAT_NEAR(getInnerROI(dst_gold, ksize), getInnerROI(dst, ksize), 0.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Filters', 'Dilate', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8UC1,alvision.MatrixType.CV_8UC4],
    [new alvision.Point(-1, -1), new alvision.Point(0, 0), new alvision.Point(2, 2)],
    [1,2,3],
    alvision.WHOLE_SUBMAT
]));

/////////////////////////////////////////////////////////////////////////////////////////////////
// MorphEx

//CV_ENUM(MorphOp, MORPH_OPEN, MORPH_CLOSE, MORPH_GRADIENT, MORPH_TOPHAT, MORPH_BLACKHAT)
const MorphOp = [alvision.MorphTypes.MORPH_OPEN, alvision.MorphTypes.MORPH_CLOSE, alvision.MorphTypes.MORPH_GRADIENT, alvision.MorphTypes.MORPH_TOPHAT, alvision.MorphTypes.MORPH_BLACKHAT];

//PARAM_TEST_CASE(MorphEx, alvision.cuda.DeviceInfo, alvision.Size, MatType, MorphOp, Anchor, Iterations, UseRoi)
class MorphEx extends alvision.cvtest.CUDA_TEST
{
    protected  devInfo : alvision.cuda.DeviceInfo;
    protected  size : alvision.Size;
    protected type: alvision.int;
    protected morphOp: alvision.int;
    protected anchor: alvision.Point;
    protected iterations: alvision.int;
    protected useRoi: boolean;

    SetUp() : void
    {
        this.devInfo =    this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =       this.GET_PARAM<alvision.Size>(1);
        this.type =       this.GET_PARAM<alvision.int>(2);
        this.morphOp =    this.GET_PARAM<alvision.int>(3);
        this.anchor =     this.GET_PARAM<alvision.Point>(4);
        this.iterations = this.GET_PARAM<alvision.int>(5);
        this.useRoi =     this.GET_PARAM<boolean>(6);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(MorphEx, Accuracy)
class MorphEx_Accuracy extends MorphEx
{
    TestBody() {
        let src = alvision.randomMat(this.size, this.type);
        let kernel = alvision.Mat.ones(3, 3, alvision.MatrixType.CV_8U).toMat();

        let morph = alvision.cudafilters.createMorphologyFilter(this.morphOp, src.type(), kernel, this.anchor, this.iterations);

        let dst = alvision.createMat(this.size,this. type, this.useRoi);
        morph.apply(alvision.loadMat(src, this.useRoi), dst);

        let dst_gold = new alvision.Mat();
        alvision.morphologyEx(src, dst_gold, this.morphOp, kernel, this.anchor, this.iterations);

        let border = new alvision.Size(kernel.cols.valueOf() + (this.iterations.valueOf() + 1) * kernel.cols.valueOf() + 2, kernel.rows.valueOf() + (this.iterations.valueOf() + 1) * kernel.rows.valueOf() + 2);

        alvision.EXPECT_MAT_NEAR(getInnerROI(dst_gold, border), getInnerROI(dst, border), 0.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Filters', 'MorphEx', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8UC1,alvision.MatrixType.CV_8UC4],
    MorphOp,
    [new alvision.Point(-1, -1),new alvision.Point(0, 0), new alvision.Point(2, 2)], 
    [1,2,3],
    alvision.WHOLE_SUBMAT
    ]));

//#endif // HAVE_CUDA
