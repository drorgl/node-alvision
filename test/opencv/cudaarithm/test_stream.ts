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
//#include <cuda_runtime.h>
//
//#include "opencv2/core/cuda.hpp"
//#include "opencv2/ts/cuda_test.hpp"
//
//using namespace cvtest;

class Async extends alvision.cvtest.CUDA_TEST// : testing::TestWithParam<alvision.cuda.DeviceInfo>
{
    public src: alvision.cuda.HostMem;
    public d_src: alvision.cuda.GpuMat;

    public dst: alvision.cuda.HostMem;
    public d_dst: alvision.cuda.GpuMat;

    public SetUp(): void {
        var devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        alvision.cuda.setDevice(devInfo.deviceID());

        this.src = new alvision.cuda.HostMem(alvision.cuda.HostMemAllocType.PAGE_LOCKED);

        var m = alvision.randomMat(new alvision.Size(128, 128), alvision.MatrixType.CV_8UC1);
        m.copyTo(this.src);
    }
};

function checkMemSet(status: alvision.int, userData : Async) : void
{
    //probably need to implement cuda basic apis for this test to work, cudaSuccess
    //https://www.cs.cmu.edu/afs/cs/academic/class/15668-s11/www/cuda-doc/html/group__CUDART__TYPES_g3f51e3575c2178246db0a94a430e0038.html

    //alvision.ASSERT_EQ(cudaSuccess, status);

    //Async* test = reinterpret_cast<Async*>(userData);
    var test = userData;

    var src = test.src;
    var dst = test.dst;

    var dst_gold = alvision.Mat.zeros(src.size(), src.type());

    alvision.ASSERT_MAT_NEAR(dst_gold, dst, 0);
}

//alvision.cvtest.CUDA_TEST_P(Async, MemSet)
class Async_MemSet extends Async
{
    public TestBody(): void {
        var stream = new alvision.cuda.Stream ();

        this.d_dst.upload(this.src);

        this.d_dst.setTo(alvision.Scalar.all(0), stream);
        this.d_dst.download(this.dst, stream);

        var test = this;
        stream.enqueueHostCallback(checkMemSet, test);

        //TODO: async call, need to figure out how to do it in current design
        stream.waitForCompletion(() => {
        });
    }
}

function checkConvert(status : alvision.int , userData  : Async) : void
{
    //TODO: Implement CUDA
    //alvision.ASSERT_EQ(cudaSuccess, status);

    //Async* test = reinterpret_cast<Async*>(userData);
    var test = userData;

    var src = test.src;
    var dst = test.dst;

    var dst_gold = new alvision.Mat();
    src.createMatHeader().convertTo(dst_gold, alvision.MatrixType.CV_32S);

    alvision.ASSERT_MAT_NEAR(dst_gold, dst, 0);
}

//alvision.cvtest.CUDA_TEST_P(Async, Convert)
class Async_Convert extends Async
{
    public TestBody(): void {
        var stream = new alvision.cuda.Stream ();

        this.d_src.upload(this.src, stream);
        this.d_src.convertTo(this.d_dst, alvision.MatrixType.CV_32S, stream);
        this.d_dst.download(this.dst, stream);

        var test = this;
        stream.enqueueHostCallback(checkConvert, test);

        stream.waitForCompletion(() => {
        });
    }
}

//all allocators are not implemented
//alvision.cvtest.CUDA_TEST_P(Async, HostMemAllocator)
//class Async_HostMemAllocator
//{
//    alvision.cuda.Stream stream;
//
//    alvision.Mat h_dst;
//    h_dst.allocator = alvision.cuda::HostMem::getAllocator();
//
//    d_src.upload(src, stream);
//    d_src.convertTo(d_dst, alvision.MatrixType.CV_32S, stream);
//    d_dst.download(h_dst, stream);
//
//    stream.waitForCompletion();
//
//    let dst_gold = new alvision.Mat ();
//    src.createMatHeader().convertTo(dst_gold, alvision.MatrixType.CV_32S);
//
//    ASSERT_MAT_NEAR(dst_gold, h_dst, 0);
//}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Stream', 'Async', (case_name, test_name) => {return null },new alvision.cvtest.Combine([ alvision.ALL_DEVICES]));

//#endif // HAVE_CUDA
