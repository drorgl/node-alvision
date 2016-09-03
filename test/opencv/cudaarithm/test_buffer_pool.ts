//private opencv tests, not implemented

///*M///////////////////////////////////////////////////////////////////////////////////////
////
////  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
////
////  By downloading, copying, installing or using the software you agree to this license.
////  If you do not agree to this license, do not download, install,
////  copy or use the software.
////
////
////                           License Agreement
////                For Open Source Computer Vision Library
////
//// Copyright (C) 2000-2008, Intel Corporation, all rights reserved.
//// Copyright (C) 2009, Willow Garage Inc., all rights reserved.
//// Third party copyrights are property of their respective owners.
////
//// Redistribution and use in source and binary forms, with or without modification,
//// are permitted provided that the following conditions are met:
////
////   * Redistribution's of source code must retain the above copyright notice,
////     this list of conditions and the following disclaimer.
////
////   * Redistribution's in binary form must reproduce the above copyright notice,
////     this list of conditions and the following disclaimer in the documentation
////     and/or other materials provided with the distribution.
////
////   * The name of the copyright holders may not be used to endorse or promote products
////     derived from this software without specific prior written permission.
////
//// This software is provided by the copyright holders and contributors "as is" and
//// any express or implied warranties, including, but not limited to, the implied
//// warranties of merchantability and fitness for a particular purpose are disclaimed.
//// In no event shall the Intel Corporation or contributors be liable for any direct,
//// indirect, incidental, special, exemplary, or consequential damages
//// (including, but not limited to, procurement of substitute goods or services;
//// loss of use, data, or profits; or business interruption) however caused
//// and on any theory of liability, whether in contract, strict liability,
//// or tort (including negligence or otherwise) arising in any way out of
//// the use of this software, even if advised of the possibility of such damage.
////
////M*/

//import tape = require("tape");
//import path = require("path");
//
//import async = require("async");
//import alvision = require("../../../tsbinding/alvision");
//import util = require('util');
//import fs = require('fs');

////#include "test_precomp.hpp"
////
////#ifdef HAVE_CUDA
////
////#include "opencv2/core/cuda.hpp"
////#include "opencv2/core/private.cuda.hpp"
////#include "opencv2/ts/cuda_test.hpp"
////
////using namespace testing;
////using namespace cv;
////using namespace alvision.cuda;

//class BufferPoolTest extends alvision.cvtest.TestWithParam
//{
//    RunSimpleTest(stream: alvision.cuda.Stream, dst_1: alvision.cuda.HostMem, dst_2: alvision.cuda.HostMem) : void
//    {
//        var pool = new BufferPool(stream);

//        {
//        var buf0 = pool.getBuffer(new alvision.Size(640, 480), alvision.MatrixType.CV_8UC1);
//            alvision.EXPECT_FALSE( buf0.empty() );

//            buf0.setTo(alvision.Scalar.all(0), stream);

//            var buf1 = pool.getBuffer(new alvision.Size(640, 480), alvision.MatrixType. CV_8UC1);
//            alvision.EXPECT_FALSE( buf1.empty() );

//            buf0.convertTo(buf1, buf1.type(), 1.0, 1.0, stream);

//            buf1.download(dst_1, stream);
//        }

//        {
//        var buf2 = pool.getBuffer(new alvision.Size(1280, 1024), alvision.MatrixType.CV_32SC1);
//            alvision.EXPECT_FALSE( buf2.empty() );

//            buf2.setTo(alvision.Scalar.all(2), stream);

//            buf2.download(dst_2, stream);
//        }
//    }

//    CheckSimpleTest(dst_1: alvision.cuda.HostMem, dst_2: alvision.cuda.HostMem): void {
//        alvision.EXPECT_MAT_NEAR(new alvision.Mat(new alvision.Size(640, 480), alvision.MatrixType.CV_8UC1,    alvision.Scalar.all(1)), dst_1, 0.0);
//        alvision.EXPECT_MAT_NEAR(new alvision.Mat(new alvision.Size(1280, 1024), alvision.MatrixType.CV_32SC1, alvision.Scalar.all(2)), dst_2, 0.0);
//    }
//};

////CUDA_TEST_P(BufferPoolTest, FromNullStream)
//class BufferPoolTest_FromNullStream extends BufferPoolTest
//{
//    TestBody(): void {
//        var dst_1 = new alvision.cuda.HostMem(), dst_2 = new alvision.cuda.HostMem ();

//        this.RunSimpleTest(alvision.Stream.Null(), dst_1, dst_2);

//        this.CheckSimpleTest(dst_1, dst_2);
//    }
//}

////CUDA_TEST_P(BufferPoolTest, From2Streams)
//class BufferPoolTest_From2Streams extends BufferPoolTest
//{
//    TestBody(): void {
//        var dst1_1 = new alvision.cuda.HostMem(), dst1_2 = new alvision.cuda.HostMem();
//        var dst2_1 = new alvision.cuda.HostMem(), dst2_2 = new alvision.cuda.HostMem ();

//        var stream1 = new Stream(), stream2 = new Stream ();
//        this.RunSimpleTest(stream1, dst1_1, dst1_2);
//        this.RunSimpleTest(stream2, dst2_1, dst2_2);

//        stream1.waitForCompletion();
//        stream2.waitForCompletion();

//        this.CheckSimpleTest(dst1_1, dst1_2);
//        this.CheckSimpleTest(dst2_1, dst2_2);
//    }
//}

//alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Stream', 'BufferPoolTest', (case_name, test_name) => { return null }, new alvision.cvtest.Combine([[alvision.ALL_DEVICES]]));;

/////#endif // HAVE_CUDA
