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

import * as _interpolation from './interpolation';

//#include "test_precomp.hpp"
//
//#ifdef HAVE_CUDA
//
//using namespace cvtest;

///////////////////////////////////////////////////////////////////
// Gold implementation

//namespace
//{
//template < typename T, template < typename >


function resizeImpl<T>(Ttype : string, Interpolator : _interpolation.Interpolator, src: alvision.Mat, dst: alvision.Mat, fx: alvision.double, fy: alvision.double ): void 
    {
        const cn = src.channels();

        var dsize = new alvision.Size (alvision.saturate_cast<alvision.int>(src.cols().valueOf() * fx.valueOf(),"int"), alvision.saturate_cast<alvision.int>(src.rows().valueOf() * fy.valueOf(),"int"));

        dst.create(dsize, src.type());

        var ifx = (1.0 / fx.valueOf());
        var ify = (1.0 / fy.valueOf());

        for (var y = 0; y < dsize.height; ++y)
        {
            for (var x = 0; x < dsize.width; ++x)
            {
                for (var c = 0; c < cn; ++c)
                    dst.at<T>(Ttype, y, x * cn.valueOf() + c).set(Interpolator.getValue<T>(Ttype, src, y * ify, x * ifx, c, alvision.BorderTypes.BORDER_REPLICATE));
            }
        }
}

interface func_t {
    (src: alvision.Mat, dst: alvision.Mat, fx: alvision.double, fy: alvision.double ): void;
}

    function resizeGold(src: alvision.Mat, dst: alvision.Mat, fx: alvision.double, fy: alvision.double, interpolation: alvision.int ) : void
    {
        //typedef void (*func_t)(const alvision.Mat& src, alvision.Mat& dst, double fx, double fy);

        const nearest_funcs =
        [
            (src: alvision.Mat, dst: alvision.Mat, fx: alvision.double, fy: alvision.double )=>{resizeImpl<alvision.uchar >("uchar",new _interpolation. NearestInterpolator(),src,dst,fx,fy) },
            (src: alvision.Mat, dst: alvision.Mat, fx: alvision.double, fy: alvision.double )=>{resizeImpl<alvision.schar >("schar",new _interpolation. NearestInterpolator(),src,dst,fx,fy) },
            (src: alvision.Mat, dst: alvision.Mat, fx: alvision.double, fy: alvision.double )=>{resizeImpl<alvision.ushort>("ushort",new _interpolation. NearestInterpolator(),src,dst,fx,fy) },
            (src: alvision.Mat, dst: alvision.Mat, fx: alvision.double, fy: alvision.double )=>{resizeImpl<alvision.short >("short",new _interpolation. NearestInterpolator(),src,dst,fx,fy) },
            (src: alvision.Mat, dst: alvision.Mat, fx: alvision.double, fy: alvision.double )=>{resizeImpl<alvision.int   >("int",new _interpolation. NearestInterpolator(),src,dst,fx,fy) },
            (src: alvision.Mat, dst: alvision.Mat, fx: alvision.double, fy: alvision.double )=>{resizeImpl<alvision.float >("float",new _interpolation. NearestInterpolator(),src,dst,fx,fy) }
        ];


         const linear_funcs =
        [
            (src: alvision.Mat, dst: alvision.Mat, fx: alvision.double, fy: alvision.double )=>{resizeImpl<alvision.uchar  >("uchar",new _interpolation.LinearInterpolator(),src,dst,fx,fy) },
            (src: alvision.Mat, dst: alvision.Mat, fx: alvision.double, fy: alvision.double )=>{resizeImpl<alvision.schar  >("schar",new _interpolation.LinearInterpolator(),src,dst,fx,fy)   },
            (src: alvision.Mat, dst: alvision.Mat, fx: alvision.double, fy: alvision.double )=>{resizeImpl<alvision.ushort >("ushort",new _interpolation.LinearInterpolator(),src,dst,fx,fy)},
            (src: alvision.Mat, dst: alvision.Mat, fx: alvision.double, fy: alvision.double )=>{resizeImpl<alvision.short  >("short",new _interpolation.LinearInterpolator(),src,dst,fx,fy)         },
            (src: alvision.Mat, dst: alvision.Mat, fx: alvision.double, fy: alvision.double )=>{resizeImpl<alvision.int    >("int",new _interpolation.LinearInterpolator(),src,dst,fx,fy)           },
            (src: alvision.Mat, dst: alvision.Mat, fx: alvision.double, fy: alvision.double )=>{resizeImpl<alvision.float  >("float",new _interpolation.LinearInterpolator(),src,dst,fx,fy)         },
        ];

         const cubic_funcs =
        [
            (src: alvision.Mat, dst: alvision.Mat, fx: alvision.double, fy: alvision.double )=>{resizeImpl<alvision.uchar >("uchar",new _interpolation.CubicInterpolator(), src,dst,fx,fy) },
            (src: alvision.Mat, dst: alvision.Mat, fx: alvision.double, fy: alvision.double )=>{resizeImpl<alvision.schar >("schar",new _interpolation.CubicInterpolator(), src,dst,fx,fy)   },
            (src: alvision.Mat, dst: alvision.Mat, fx: alvision.double, fy: alvision.double )=>{resizeImpl<alvision.ushort>("ushort",new _interpolation.CubicInterpolator(), src,dst,fx,fy)},
            (src: alvision.Mat, dst: alvision.Mat, fx: alvision.double, fy: alvision.double )=>{resizeImpl<alvision.short >("short",new _interpolation.CubicInterpolator(), src,dst,fx,fy)         },
            (src: alvision.Mat, dst: alvision.Mat, fx: alvision.double, fy: alvision.double )=>{resizeImpl<alvision.int   >("int",new _interpolation.CubicInterpolator(), src,dst,fx,fy)           },
            (src: alvision.Mat, dst: alvision.Mat, fx: alvision.double, fy: alvision.double )=>{resizeImpl<alvision.float >("float",new _interpolation.CubicInterpolator(), src,dst,fx,fy)         }
        ];

        const funcs = [nearest_funcs, linear_funcs, cubic_funcs];

        funcs[interpolation.valueOf()][src.depth().valueOf()](src, dst, fx, fy);
    }


///////////////////////////////////////////////////////////////////
// Test

//PARAM_TEST_CASE(Resize, alvision.cuda.DeviceInfo, alvision.Size, MatType, double, Interpolation, UseRoi)
class Resize extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected coeff: alvision.double;
    protected interpolation: alvision.int;
    protected type: alvision.int;
    protected useRoi: boolean;

    SetUp() : void
    {
        this.devInfo =          this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =             this.GET_PARAM<alvision.Size>(1);
        this.type =             this.GET_PARAM<alvision.int>(2);
        this.coeff =            this.GET_PARAM<alvision.double>(3);
        this.interpolation =    this.GET_PARAM<alvision.int>(4);
        this.useRoi =           this.GET_PARAM<boolean>(5);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Resize, Accuracy)
class Resize_Accuracy extends Resize
{
    public TestBody(): void {
        var src = alvision.randomMat(this.size,this. type);

        var dst = alvision.createMat(new alvision.Size(alvision.saturate_cast<alvision.int>(src.cols().valueOf() * this.coeff.valueOf(),"int"), alvision.saturate_cast<alvision.int>(src.rows().valueOf() * this.coeff.valueOf(),"int")), this.type, this.useRoi);
        alvision.cudawarping.resize(alvision.loadMat(src, this.useRoi), dst,new alvision.Size(), this.coeff, this.coeff, this.interpolation);

        var dst_gold = new alvision.Mat();
        resizeGold(src, dst_gold, this.coeff, this.coeff, this.interpolation);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, src.depth() == alvision.MatrixType.CV_32F ? 1e-2 : 1.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Warping', 'Resize', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8UC1,alvision.MatrixType.CV_8UC3,alvision.MatrixType.CV_8UC4,alvision.MatrixType.CV_16UC1,alvision.MatrixType.CV_16UC3,alvision.MatrixType.CV_16UC4,alvision.MatrixType.CV_32FC1,alvision.MatrixType.CV_32FC3,alvision.MatrixType.CV_32FC4],
    [0.3, 0.5, 1.5, 2.0],
    [alvision.InterpolationFlags.INTER_NEAREST,alvision.InterpolationFlags.INTER_LINEAR,alvision.InterpolationFlags.INTER_CUBIC],
    alvision.WHOLE_SUBMAT
]));

/////////////////

//PARAM_TEST_CASE(ResizeSameAsHost, alvision.cuda.DeviceInfo, alvision.Size, MatType, double, Interpolation, UseRoi)
class ResizeSameAsHost extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected coeff: alvision.double;
    protected interpolation: alvision.int;
    protected type: alvision.int;
    protected useRoi: boolean;

    public SetUp() : void
    {
        this.devInfo =          this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =             this.GET_PARAM<alvision.Size>(1);
        this.type =             this.GET_PARAM<alvision.int>(2);
        this.coeff =            this.GET_PARAM<alvision.double>(3);
        this.interpolation = this.GET_PARAM<alvision.int>(4);
        this.useRoi =           this.GET_PARAM<boolean>(5);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

// downscaling only: used for classifiers
//CUDA_TEST_P(ResizeSameAsHost, Accuracy)
class ResizeSameAsHost_Accuracy extends ResizeSameAsHost {
    public TestBody(): void {
 var src = alvision.randomMat(this.size, this.type);

        var dst = alvision.createMat(new alvision.Size(alvision.saturate_cast<alvision.int>(src.cols().valueOf() *this. coeff.valueOf(),"int"), alvision.saturate_cast<alvision.int>(src.rows().valueOf() * this.coeff.valueOf(),"int")), this.type, this.useRoi);
        alvision.cudawarping.resize(alvision.loadMat(src,this. useRoi), dst, new alvision.Size(),this. coeff,this. coeff,this. interpolation);

        var dst_gold = new alvision.Mat();
        alvision.resize(src, dst_gold, new alvision.Size(), this.coeff, this.coeff, this.interpolation);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, src.depth() == alvision.MatrixType.CV_32F ? 1e-2 : 1.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Warping', 'ResizeSameAsHost', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8UC1,alvision.MatrixType.CV_8UC3,alvision.MatrixType.CV_8UC4,alvision.MatrixType.CV_16UC1,alvision.MatrixType.CV_16UC3,alvision.MatrixType.CV_16UC4,alvision.MatrixType.CV_32FC1,alvision.MatrixType.CV_32FC3,alvision.MatrixType.CV_32FC4],
    [0.3, 0.5],
    [alvision.InterpolationFlags.INTER_NEAREST,alvision.InterpolationFlags.INTER_AREA],
    alvision.WHOLE_SUBMAT
    ]));

//#endif // HAVE_CUDA
