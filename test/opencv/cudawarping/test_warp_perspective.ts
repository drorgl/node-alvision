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
//
//namespace
//{
function createTransfomMatrix(srcSize: alvision.Size, angle: alvision.double ): alvision.Mat 
    {
    var M = new alvision.Mat (3, 3,alvision.MatrixType. CV_64FC1);

        M.at<alvision.double>("double",0, 0).set( Math.cos(angle.valueOf())); M.at<alvision.double>("double", 0, 1).set( -Math.sin(angle.valueOf())); M.at<alvision.double>("double",0, 2).set( srcSize.width.valueOf() / 2);
        M.at<alvision.double>("double",1, 0).set( Math.sin(angle.valueOf())); M.at<alvision.double>("double", 1, 1).set(  Math.cos(angle.valueOf())); M.at<alvision.double>("double",1, 2).set( 0.0);
        M.at<alvision.double>("double",2, 0).set( 0.0           )           ; M.at<alvision.double>("double", 2, 1).set(  0.0          )            ; M.at<alvision.double>("double",2, 2).set( 1.0);

        return M;
    }
//}

///////////////////////////////////////////////////////////////////
// Test buildWarpPerspectiveMaps

//PARAM_TEST_CASE(BuildWarpPerspectiveMaps, alvision.cuda.DeviceInfo, alvision.Size, Inverse)
class BuildWarpPerspectiveMaps extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected inverse: boolean;

    public SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.inverse = this.GET_PARAM<boolean>(2);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(BuildWarpPerspectiveMaps, Accuracy)
class BuildWarpPerspectiveMaps_Accuracy extends BuildWarpPerspectiveMaps
{
    public TestBody(): void {
        var M = createTransfomMatrix(this.size, Math.PI / 4);

        var xmap = new alvision.cuda.GpuMat(), ymap = new alvision.cuda.GpuMat ();
        alvision.cudawarping.buildWarpPerspectiveMaps(M, this.inverse, this.size, xmap, ymap);

        var src = alvision.randomMat(alvision.randomSize(200, 400), alvision.MatrixType.CV_8UC1);
        var interpolation = alvision.InterpolationFlags.INTER_NEAREST;
        var borderMode = alvision.BorderTypes.BORDER_CONSTANT;
        var flags = interpolation;
        if (this.inverse)
            flags |= alvision.InterpolationFlags.WARP_INVERSE_MAP;

        var dst = new alvision.Mat();
        alvision.remap(src, dst, new alvision.Mat(xmap), new alvision.Mat(ymap), interpolation, borderMode);

        var dst_gold = new alvision.Mat();
        alvision.warpPerspective(src, dst_gold, M, this.size, flags, borderMode);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 0.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Warping', 'BuildWarpPerspectiveMaps', (case_name, test_name) => { return null;}, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.DIRECT_INVERSE
    ]));

///////////////////////////////////////////////////////////////////
// Gold implementation

//namespace
//{
//template < typename T, template < typename > class Interpolator> 
//class Interpolator{
  function  warpPerspectiveImpl<T>(Ttype : string, Interpolator : _interpolation.Interpolator, src: alvision.Mat, M: alvision.Mat, dsize: alvision.Size, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar ) : void
    {
        const cn = src.channels();

        dst.create(dsize, src.type());

        for (var y = 0; y < dsize.height; ++y)
        {
            for (var x = 0; x < dsize.width; ++x)
            {
                var coeff = (M.at<alvision.double>("double",2, 0).get().valueOf() * x + M.at<alvision.double>("double", 2, 1).get().valueOf() * y + M.at<alvision.double>("double", 2, 2).get().valueOf());

                var xcoo = ((M.at<alvision.double>("double", 0, 0).get().valueOf() * x + M.at<alvision.double>("double", 0, 1).get().valueOf() * y + M.at<alvision.double>("double", 0, 2).get().valueOf()) / coeff);
                var ycoo = ((M.at<alvision.double>("double", 1, 0).get().valueOf() * x + M.at<alvision.double>("double", 1, 1).get().valueOf() * y + M.at<alvision.double>("double", 1, 2).get().valueOf()) / coeff);

                for (var c = 0; c < cn; ++c)
                    dst.at<T>(Ttype, y, x * cn.valueOf() + c).set(Interpolator.getValue<T>(Ttype,src, ycoo, xcoo, c, borderType, borderVal));
            }
        }
    }

  function  warpPerspectiveGold(src: alvision.Mat, M: alvision.Mat, inverse: boolean, dsize: alvision.Size, dst: alvision.Mat, interpolation: alvision.int, borderType: alvision.int, borderVal: alvision.Scalar ) : void
    {
        //typedef void (*func_t)(const alvision.Mat& src, const alvision.Mat& M, alvision.Size dsize, alvision.Mat& dst, int borderType, alvision.Scalar borderVal);

        const  nearest_funcs =
        [
                (src: alvision.Mat, M: alvision.Mat, dsize: alvision.Size, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar )=> {warpPerspectiveImpl<alvision.uchar  >("uchar",new _interpolation.NearestInterpolator(),src,M,dsize,dst,borderType,borderVal)},
                (src: alvision.Mat, M: alvision.Mat, dsize: alvision.Size, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar )=> {warpPerspectiveImpl<alvision.schar  >("schar",new _interpolation.NearestInterpolator(),src,M,dsize,dst,borderType,borderVal)},
                (src: alvision.Mat, M: alvision.Mat, dsize: alvision.Size, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar) => {warpPerspectiveImpl<alvision.ushort >("ushort",new _interpolation.NearestInterpolator(),src,M,dsize,dst,borderType,borderVal)},
                (src: alvision.Mat, M: alvision.Mat, dsize: alvision.Size, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar )=> {warpPerspectiveImpl<alvision.short  >("short",new _interpolation.NearestInterpolator(),src,M,dsize,dst,borderType,borderVal)},
                (src: alvision.Mat, M: alvision.Mat, dsize: alvision.Size, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar )=> {warpPerspectiveImpl<alvision.int    >("int",new _interpolation.NearestInterpolator(),src,M,dsize,dst,borderType,borderVal)},
                (src: alvision.Mat, M: alvision.Mat, dsize: alvision.Size, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar) => {warpPerspectiveImpl<alvision.float  >("float",new _interpolation.NearestInterpolator(),src,M,dsize,dst,borderType,borderVal)}
        ];

        const linear_funcs =
        [
            (src: alvision.Mat, M: alvision.Mat, dsize: alvision.Size, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar )=> {warpPerspectiveImpl<alvision.uchar  >("uchar",new _interpolation.LinearInterpolator(), src,M,dsize,dst,borderType,borderVal)},
            (src: alvision.Mat, M: alvision.Mat, dsize: alvision.Size, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar )=> {warpPerspectiveImpl<alvision.schar  >("schar",new _interpolation.LinearInterpolator(), src,M,dsize,dst,borderType,borderVal)},
            (src: alvision.Mat, M: alvision.Mat, dsize: alvision.Size, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar )=> {warpPerspectiveImpl<alvision.ushort >("ushort",new _interpolation.LinearInterpolator(), src,M,dsize,dst,borderType,borderVal)},
            (src: alvision.Mat, M: alvision.Mat, dsize: alvision.Size, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar )=> {warpPerspectiveImpl<alvision.short  >("short",new _interpolation.LinearInterpolator(), src,M,dsize,dst,borderType,borderVal)},
            (src: alvision.Mat, M: alvision.Mat, dsize: alvision.Size, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar )=> {warpPerspectiveImpl<alvision.int    >("int",new _interpolation.LinearInterpolator(), src,M,dsize,dst,borderType,borderVal)},
            (src: alvision.Mat, M: alvision.Mat, dsize: alvision.Size, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar )=> {warpPerspectiveImpl<alvision.float  >("float",new _interpolation.LinearInterpolator(), src,M,dsize,dst,borderType,borderVal)}
        ];

        const cubic_funcs =
        [
            (src: alvision.Mat, M: alvision.Mat, dsize: alvision.Size, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar )=> {warpPerspectiveImpl<alvision.uchar >("uchar", new _interpolation.CubicInterpolator(),src,M,dsize,dst,borderType,borderVal)},
            (src: alvision.Mat, M: alvision.Mat, dsize: alvision.Size, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar )=> {warpPerspectiveImpl<alvision.schar  >("schar", new _interpolation.CubicInterpolator(),src,M,dsize,dst,borderType,borderVal)},
            (src: alvision.Mat, M: alvision.Mat, dsize: alvision.Size, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar )=> {warpPerspectiveImpl<alvision.ushort >("ushort", new _interpolation.CubicInterpolator(),src,M,dsize,dst,borderType,borderVal)},
            (src: alvision.Mat, M: alvision.Mat, dsize: alvision.Size, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar )=> {warpPerspectiveImpl<alvision.short  >("short", new _interpolation.CubicInterpolator(),src,M,dsize,dst,borderType,borderVal)},
            (src: alvision.Mat, M: alvision.Mat, dsize: alvision.Size, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar )=> {warpPerspectiveImpl<alvision.int    >("int", new _interpolation.CubicInterpolator(),src,M,dsize,dst,borderType,borderVal)},
            (src: alvision.Mat, M: alvision.Mat, dsize: alvision.Size, dst: alvision.Mat, borderType: alvision.int, borderVal: alvision.Scalar )=> {warpPerspectiveImpl<alvision.float  >("float", new _interpolation.CubicInterpolator(),src,M,dsize,dst,borderType,borderVal)}
        ];

        const funcs = [nearest_funcs, linear_funcs, cubic_funcs];

        if (inverse)
            funcs[interpolation.valueOf()][src.depth().valueOf()](src, M, dsize, dst, borderType, borderVal);
        else
        {
            var iM = new alvision.Mat();
            alvision.invert(M, iM);
            funcs[interpolation.valueOf()][src.depth().valueOf()](src, iM, dsize, dst, borderType, borderVal);
        }
    }
//}

///////////////////////////////////////////////////////////////////
// Test

//PARAM_TEST_CASE(WarpPerspective, alvision.cuda.DeviceInfo, alvision.Size, MatType, Inverse, Interpolation, BorderType, UseRoi)
class WarpPerspective extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected type: alvision.int;
    protected inverse: boolean;
    protected interpolation: alvision.int;
    protected borderType: alvision.int;
    protected useRoi: boolean;

    SetUp() : void
    {
        this.devInfo =       this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =          this.GET_PARAM<alvision.Size>(1);
        this.type =          this.GET_PARAM<alvision.int>(2);
        this.inverse =       this.GET_PARAM<boolean>(3);
        this.interpolation = this.GET_PARAM<alvision.int>(4);
        this.borderType =    this.GET_PARAM<alvision.int>(5);
        this.useRoi =        this.GET_PARAM<boolean>(6);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(WarpPerspective, Accuracy)
class WarpPerspective_Accuracy extends WarpPerspective
{
    public TestBody(): void {
        var src = alvision.randomMat(this.size, this.type);
        var M = createTransfomMatrix(this.size, Math.PI / 3);
        var flags = this.interpolation.valueOf();
        if (this.inverse)
            flags |= alvision.InterpolationFlags.WARP_INVERSE_MAP;
        var val = alvision.randomScalar(0.0, 255.0);

        var dst = alvision.createMat(this.size, this.type, this.useRoi);
        alvision.cudawarping.warpPerspective(alvision.loadMat(src, this.useRoi), dst, M, this.size, flags, this.borderType, val);

        var dst_gold = new alvision.Mat();
        warpPerspectiveGold(src, M, this.inverse, this.size, dst_gold, this.interpolation, this.borderType, val);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, src.depth() == alvision.MatrixType.CV_32F ? 1e-1 : 1.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Warping', 'WarpPerspective', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8UC1,alvision.MatrixType.CV_8UC3,alvision.MatrixType.CV_8UC4,alvision.MatrixType.CV_16UC1,alvision.MatrixType.CV_16UC3,alvision.MatrixType.CV_16UC4,alvision.MatrixType.CV_32FC1,alvision.MatrixType.CV_32FC3,alvision.MatrixType.CV_32FC4],
    alvision.DIRECT_INVERSE,
    [alvision.InterpolationFlags.INTER_NEAREST, alvision.InterpolationFlags.INTER_LINEAR, alvision.InterpolationFlags.INTER_CUBIC],
    [alvision.BorderTypes.BORDER_REFLECT101, alvision.BorderTypes.BORDER_REPLICATE, alvision.BorderTypes.BORDER_REFLECT, alvision.BorderTypes.BORDER_WRAP],
    alvision.WHOLE_SUBMAT
]));

///////////////////////////////////////////////////////////////////
// Test NPP

//PARAM_TEST_CASE(WarpPerspectiveNPP, alvision.cuda.DeviceInfo, MatType, Inverse, Interpolation)
class WarpPerspectiveNPP extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected type: alvision.int;
    protected inverse: boolean;
    protected interpolation: alvision.int;

    SetUp() : void
    {
        this.devInfo =       this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.type =          this.GET_PARAM<alvision.int>(1);
        this.inverse =       this.GET_PARAM<boolean>(2);
        this.interpolation = this.GET_PARAM<alvision.int>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(WarpPerspectiveNPP, Accuracy)
class WarpPerspectiveNPP_Accuracy extends WarpPerspectiveNPP
{
    public TestBody(): void {
        var src = alvision.readImageType("stereobp/aloe-L.png", this.type);
        alvision.ASSERT_FALSE(src.empty());

        var M = createTransfomMatrix(src.size(), Math.PI / 4);
        var flags = this.interpolation.valueOf();
        if (this.inverse)
            flags |= alvision.InterpolationFlags.WARP_INVERSE_MAP;

        var dst = new alvision.cuda.GpuMat();
        alvision.cudawarping.warpPerspective(alvision.loadMat(src), dst, M, src.size(), flags);

        var dst_gold = new alvision.Mat();
        warpPerspectiveGold(src, M, this.inverse, src.size(), dst_gold, this.interpolation, alvision.BorderTypes.BORDER_CONSTANT, alvision.Scalar.all(0));

        alvision.EXPECT_MAT_SIMILAR(dst_gold, dst.getMat(), 2e-2);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Warping', 'WarpPerspectiveNPP', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    [alvision.MatrixType.CV_8UC1,alvision.MatrixType.CV_8UC3,alvision.MatrixType.CV_8UC4,alvision.MatrixType.CV_32FC1,alvision.MatrixType.CV_32FC3,alvision.MatrixType.CV_32FC4],
    alvision.DIRECT_INVERSE,
    [alvision.InterpolationFlags.INTER_NEAREST, alvision.InterpolationFlags.INTER_LINEAR, alvision.InterpolationFlags.INTER_CUBIC]
    ]));

//#endif // HAVE_CUDA
