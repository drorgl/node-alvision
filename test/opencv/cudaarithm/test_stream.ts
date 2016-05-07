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
//#include <cuda_runtime.h>
//
//#include "opencv2/core/cuda.hpp"
//#include "opencv2/ts/cuda_test.hpp"
//
//using namespace cvtest;

struct Async : testing::TestWithParam<alvision.cuda::DeviceInfo>
{
    alvision.cuda::HostMem src;
    alvision.cuda::GpuMat d_src;

    alvision.cuda::HostMem dst;
    alvision.cuda::GpuMat d_dst;

    virtual void SetUp()
    {
        alvision.cuda::DeviceInfo devInfo = GetParam();
        alvision.cuda::setDevice(devInfo.deviceID());

        src = alvision.cuda::HostMem(alvision.cuda::HostMem::PAGE_LOCKED);

        alvision.Mat m = randomMat(alvision.Size(128, 128), CV_8UC1);
        m.copyTo(src);
    }
};

void checkMemSet(int status, void* userData)
{
    ASSERT_EQ(cudaSuccess, status);

    Async* test = reinterpret_cast<Async*>(userData);

    alvision.cuda::HostMem src = test->src;
    alvision.cuda::HostMem dst = test->dst;

    alvision.Mat dst_gold = alvision.Mat::zeros(src.size(), src.type());

    ASSERT_MAT_NEAR(dst_gold, dst, 0);
}

alvision.cvtest.CUDA_TEST_P(Async, MemSet)
{
    alvision.cuda::Stream stream;

    d_dst.upload(src);

    d_dst.setTo(alvision.alvision.Scalar.all(0), stream);
    d_dst.download(dst, stream);

    Async* test = this;
    stream.enqueueHostCallback(checkMemSet, test);

    stream.waitForCompletion();
}

void checkConvert(int status, void* userData)
{
    ASSERT_EQ(cudaSuccess, status);

    Async* test = reinterpret_cast<Async*>(userData);

    alvision.cuda::HostMem src = test->src;
    alvision.cuda::HostMem dst = test->dst;

    alvision.Mat dst_gold;
    src.createMatHeader().convertTo(dst_gold, CV_32S);

    ASSERT_MAT_NEAR(dst_gold, dst, 0);
}

alvision.cvtest.CUDA_TEST_P(Async, Convert)
{
    alvision.cuda::Stream stream;

    d_src.upload(src, stream);
    d_src.convertTo(d_dst, CV_32S, stream);
    d_dst.download(dst, stream);

    Async* test = this;
    stream.enqueueHostCallback(checkConvert, test);

    stream.waitForCompletion();
}

alvision.cvtest.CUDA_TEST_P(Async, HostMemAllocator)
{
    alvision.cuda::Stream stream;

    alvision.Mat h_dst;
    h_dst.allocator = alvision.cuda::HostMem::getAllocator();

    d_src.upload(src, stream);
    d_src.convertTo(d_dst, CV_32S, stream);
    d_dst.download(h_dst, stream);

    stream.waitForCompletion();

    alvision.Mat dst_gold;
    src.createMatHeader().convertTo(dst_gold, CV_32S);

    ASSERT_MAT_NEAR(dst_gold, h_dst, 0);
}

INSTANTIATE_TEST_CASE_P(CUDA_Stream, Async, ALL_DEVICES);

#endif // HAVE_CUDA
