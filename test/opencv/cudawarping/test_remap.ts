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

import _interpolation = require('./interpolation');

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
   function remapImpl<T>(Ttype : string, Interpolator : _interpolation.Interpolator, src: alvision.Mat, xmap: alvision.Mat, ymap: alvision.Mat, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar) : void
    {
        const cn = src.channels();

        var dsize = xmap.size();

        dst.create(dsize, src.type());

        for (var y = 0; y < dsize.height; ++y)
        {
            for (var x = 0; x < dsize.width; ++x)
            {
                for (var c = 0; c < cn; ++c)
                    dst.at<T>(Ttype, y, x * cn.valueOf() + c).set(Interpolator.getValue<T>(Ttype,src, ymap.at<alvision.float>("float",y, x).get(), xmap.at<alvision.float>("float", y, x).get(), c, borderType, borderVal));
            }
        }
}

   interface func_t {
       (src: alvision.Mat, xmap: alvision.Mat, ymap: alvision.Mat, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar): void;
   }
//typedef void (*func_t)(const alvision.Mat& src, const alvision.Mat& xmap, const alvision.Mat& ymap, alvision.Mat& dst, int borderType, alvision.Scalar borderVal);


   function remapGold(src: alvision.Mat, xmap: alvision.Mat, ymap: alvision.Mat, dst: alvision.Mat, interpolation: alvision.int, borderType: alvision.int, borderVal: alvision.Scalar): void {
       //typedef void (*func_t)(const alvision.Mat& src, const alvision.Mat& xmap, const alvision.Mat& ymap, alvision.Mat& dst, int borderType, alvision.Scalar borderVal);

       const nearest_funcs =
           [
               (src: alvision.Mat, xmap: alvision.Mat, ymap: alvision.Mat, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar) => { remapImpl<alvision.uchar>("uchar", new _interpolation.NearestInterpolator(), src, xmap, ymap, dst, borderType, borderVal); },
               (src: alvision.Mat, xmap: alvision.Mat, ymap: alvision.Mat, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar) => { remapImpl<alvision.schar>("uchar", new _interpolation.NearestInterpolator(), src, xmap, ymap, dst, borderType, borderVal); },
               (src: alvision.Mat, xmap: alvision.Mat, ymap: alvision.Mat, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar) => { remapImpl<alvision.ushort>("uchar", new _interpolation.NearestInterpolator(), src, xmap, ymap, dst, borderType, borderVal); },
               (src: alvision.Mat, xmap: alvision.Mat, ymap: alvision.Mat, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar) => { remapImpl<alvision.short>("uchar", new _interpolation.NearestInterpolator(), src, xmap, ymap, dst, borderType, borderVal); },
               (src: alvision.Mat, xmap: alvision.Mat, ymap: alvision.Mat, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar) => { remapImpl<alvision.int>("uchar", new _interpolation.NearestInterpolator(), src, xmap, ymap, dst, borderType, borderVal); },
               (src: alvision.Mat, xmap: alvision.Mat, ymap: alvision.Mat, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar) => { remapImpl<alvision.float>("uchar", new _interpolation.NearestInterpolator(), src, xmap, ymap, dst, borderType, borderVal); }
           ];

       const linear_funcs =
           [
               (src: alvision.Mat, xmap: alvision.Mat, ymap: alvision.Mat, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar) => { remapImpl<alvision.uchar>("uchar", new _interpolation.LinearInterpolator(), src, xmap, ymap, dst, borderType, borderVal); },
               (src: alvision.Mat, xmap: alvision.Mat, ymap: alvision.Mat, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar) => { remapImpl<alvision.schar>("uchar", new _interpolation.LinearInterpolator(), src, xmap, ymap, dst, borderType, borderVal); },
               (src: alvision.Mat, xmap: alvision.Mat, ymap: alvision.Mat, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar) => { remapImpl<alvision.ushort>("uchar", new _interpolation.LinearInterpolator(), src, xmap, ymap, dst, borderType, borderVal); },
               (src: alvision.Mat, xmap: alvision.Mat, ymap: alvision.Mat, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar) => { remapImpl<alvision.short>("uchar", new _interpolation.LinearInterpolator(), src, xmap, ymap, dst, borderType, borderVal); },
               (src: alvision.Mat, xmap: alvision.Mat, ymap: alvision.Mat, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar) => { remapImpl<alvision.int>("uchar", new _interpolation.LinearInterpolator(), src, xmap, ymap, dst, borderType, borderVal); },
               (src: alvision.Mat, xmap: alvision.Mat, ymap: alvision.Mat, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar) => { remapImpl<alvision.float>("uchar", new _interpolation.LinearInterpolator(), src, xmap, ymap, dst, borderType, borderVal); }
           ];

       const cubic_funcs =
           [
               (src: alvision.Mat, xmap: alvision.Mat, ymap: alvision.Mat, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar) => { remapImpl<alvision.uchar>("uchar", new _interpolation.CubicInterpolator(), src, xmap, ymap, dst, borderType, borderVal); },
               (src: alvision.Mat, xmap: alvision.Mat, ymap: alvision.Mat, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar) => { remapImpl<alvision.schar>("uchar", new _interpolation.CubicInterpolator(), src, xmap, ymap, dst, borderType, borderVal); },
               (src: alvision.Mat, xmap: alvision.Mat, ymap: alvision.Mat, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar) => { remapImpl<alvision.ushort>("uchar", new _interpolation.CubicInterpolator(), src, xmap, ymap, dst, borderType, borderVal); },
               (src: alvision.Mat, xmap: alvision.Mat, ymap: alvision.Mat, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar) => { remapImpl<alvision.short>("uchar", new _interpolation.CubicInterpolator(), src, xmap, ymap, dst, borderType, borderVal); },
               (src: alvision.Mat, xmap: alvision.Mat, ymap: alvision.Mat, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar) => { remapImpl<alvision.int>("uchar", new _interpolation.CubicInterpolator(), src, xmap, ymap, dst, borderType, borderVal); },
               (src: alvision.Mat, xmap: alvision.Mat, ymap: alvision.Mat, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar) => { remapImpl<alvision.float>("uchar", new _interpolation.CubicInterpolator(), src, xmap, ymap, dst, borderType, borderVal); }
           ];

       const funcs = [nearest_funcs, linear_funcs, cubic_funcs];

       funcs[interpolation.valueOf()][src.depth().valueOf()](src, xmap, ymap, dst, borderType, borderVal);
   }
//}
//}

///////////////////////////////////////////////////////////////////
// Test


//PARAM_TEST_CASE(Remap, alvision.cuda.DeviceInfo, alvision.Size, MatType, Interpolation, BorderType, UseRoi)
class Remap extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected type: alvision.int;
    protected interpolation: alvision.int;
    protected borderType: alvision.int;
    protected useRoi: boolean;

    protected xmap: alvision.Mat;
    protected  ymap : alvision.Mat;

    SetUp() : void
    {
        this.devInfo =       this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =          this.GET_PARAM<alvision.Size>(1);
        this.type =          this.GET_PARAM<alvision.int>(2);
        this.interpolation = this.GET_PARAM<alvision.int>(3);
        this.borderType =    this.GET_PARAM<alvision.int>(4);
        this.useRoi =        this.GET_PARAM<boolean>(5);

        alvision.cuda.setDevice(this.devInfo.deviceID());

        // rotation matrix

        const aplha = Math.PI / 4;
        const M = [[Math.cos(aplha), -Math.sin(aplha), this.size.width.valueOf() / 2.0],
                                  [Math.sin(aplha),  Math.cos(aplha), 0.0]];

        this.xmap.create(this.size, alvision.MatrixType.CV_32FC1);
        this.ymap.create(this.size, alvision.MatrixType.CV_32FC1);

        for (var y = 0; y < this.size.height; ++y)
        {
            for (var x = 0; x < this.size.width; ++x)
            {
                this.xmap.at<alvision.float>("float",y, x).set( (M[0][0] * x + M[0][1] * y + M[0][2]));
                this.ymap.at<alvision.float>("float",y, x).set( (M[1][0] * x + M[1][1] * y + M[1][2]));
            }
        }
    }
};

//CUDA_TEST_P(Remap, Accuracy)
class Remap_Accuracy extends Remap
{
    public TestBody(): void {
        var src = alvision.randomMat(this.size, this.type);
        var val = alvision.randomScalar(0.0, 255.0);

        var dst = alvision.createMat(this.xmap.size(), this.type, this.useRoi);
        alvision.cudawarping.remap(alvision.loadMat(src, this.useRoi), dst, alvision.loadMat(this.xmap, this.useRoi), alvision.loadMat(this.ymap, this.useRoi), this.interpolation, this.borderType, val);

        var dst_gold = new alvision.Mat();
        remapGold(src, this.xmap, this.ymap, dst_gold, this.interpolation, this.borderType, val);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, src.depth() == alvision.MatrixType.CV_32F ? 1e-3 : 1.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Warping', 'Remap', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8UC1, alvision.MatrixType.CV_8UC3, alvision.MatrixType.CV_8UC4, alvision.MatrixType.CV_32FC1, alvision.MatrixType.CV_32FC3, alvision.MatrixType.CV_32FC4],
    [alvision.InterpolationFlags.INTER_NEAREST, alvision.InterpolationFlags.INTER_LINEAR, alvision.InterpolationFlags.INTER_CUBIC],
    [alvision.BorderTypes.BORDER_REFLECT101, alvision.BorderTypes.BORDER_REPLICATE, alvision.BorderTypes.BORDER_CONSTANT, alvision.BorderTypes.BORDER_REFLECT, alvision.BorderTypes.BORDER_WRAP],
    alvision.WHOLE_SUBMAT
]));

//#endif // HAVE_CUDA
