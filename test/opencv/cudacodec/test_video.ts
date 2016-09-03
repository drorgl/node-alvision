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
//#ifdef HAVE_NVCUVID
//
//PARAM_TEST_CASE(Video, alvision.cuda.DeviceInfo, std::string)
//{
//};

//////////////////////////////////////////////////////
// VideoReader

//CUDA_TEST_P(Video, Reader)
class Video_Reader extends alvision.cvtest.CUDA_TEST
{
    public TestBody(): void {
        alvision.cuda.setDevice(this.GET_PARAM<alvision.cuda.DeviceInfo>(0).deviceID());

        const inputFile = alvision.cvtest.TS.ptr().get_data_path() + "video/" + this.GET_PARAM<string>(1);

        var reader = alvision.cudacodec.createVideoReader(inputFile);

        var frame = new alvision.cuda.GpuMat();

        for (var i = 0; i < 10; ++i)
        {
            alvision.ASSERT_TRUE(reader.nextFrame(frame));
            alvision.ASSERT_FALSE(frame == null);
        }
    }
}

//////////////////////////////////////////////////////
// VideoWriter

//#ifdef WIN32


//CUDA_TEST_P(Video, Writer)
class Video_Writer extends alvision.cvtest.CUDA_TEST
{
    public TestBody(): void {
        alvision.cuda.setDevice(this.GET_PARAM<alvision.cuda.DeviceInfo>(0).deviceID());

        const inputFile = alvision.cvtest.TS.ptr().get_data_path() + "video/" + this.GET_PARAM<string>(1);

        var outputFile = alvision.tempfile(".avi");
        const FPS = 25.0;

        var reader = new alvision.VideoCapture (inputFile);
        alvision.ASSERT_TRUE(reader.isOpened());

        var d_writer: alvision.cudacodec.VideoWriter;

        var frame = new alvision.Mat();
        var d_frame = new alvision.cuda.GpuMat();

        for (var i = 0; i < 10; ++i)
        {
            reader.read(frame);
            alvision.ASSERT_FALSE(frame == null);

            d_frame.upload(frame);

            if (d_writer == null)
                d_writer = alvision.cudacodec.createVideoWriter(outputFile, frame.size(), FPS);

            d_writer.write(d_frame);
        }

        reader.release();
        d_writer = null;//.release();

        reader.open(outputFile);
        alvision.ASSERT_TRUE(reader.isOpened());

        for (var  i = 0; i < 5; ++i)
        {
            reader.read(frame);
            alvision.ASSERT_FALSE(frame.empty());
        }
    }
}

//#endif // WIN32

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Codec', 'Video', (case_name, test_name) => { return null; },new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    ["768x576.avi","1920x1080.avi"]]));

//#endif // HAVE_NVCUVID
