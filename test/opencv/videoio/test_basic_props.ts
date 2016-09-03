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
//#include "opencv2/videoio.hpp"
//#include "opencv2/ts.hpp"
//#include <stdio.h>
//
//#if BUILD_WITH_VIDEO_INPUT_SUPPORT
//
//using namespace cv;
//using namespace std;
//using namespace cvtest;

//#ifdef HAVE_GSTREAMER
//const string ext[] = {"avi"};
//#else
const ext = ["avi", "mov", "mp4"];
//#endif

alvision.cvtest.TEST('Videoio_Video', 'prop_resolution',()=>
{
    const n = ext.length;//sizeof(ext)/sizeof(ext[0]);
    const src_dir = alvision.cvtest.TS.ptr().get_data_path();

    alvision.cvtest.TS.ptr().printf(alvision.cvtest.TSConstants.LOG, "\n\nSource files directory: %s\n", (src_dir+"video/"));

    for (var i = 0; i < n; ++i)
    {
        var file_path = src_dir+"video/big_buck_bunny."+ext[i];
        var cap = new alvision.VideoCapture (file_path);
        if (!cap.isOpened())
        {
            alvision.cvtest.TS.ptr().printf(alvision.cvtest.TSConstants.LOG, "\nFile information (video %d): \n\nName: big_buck_bunny.%s\nFAILED\n\n", i+1, ext[i]);
            alvision.cvtest.TS.ptr().printf(alvision.cvtest.TSConstants.LOG, "Error: cannot read source video file.\n");
            alvision.cvtest.TS.ptr().set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            return;
        }

        alvision.ASSERT_EQ(672, cap.get(alvision.CAP_PROP.CAP_PROP_FRAME_WIDTH));
        alvision.ASSERT_EQ(384, cap.get(alvision.CAP_PROP.CAP_PROP_FRAME_HEIGHT));
    }
});

alvision.cvtest.TEST('Videoio_Video', 'actual_resolution',()=>
{
    const n = ext.length;//sizeof(ext)/sizeof(ext[0]);
    const  src_dir = alvision.cvtest.TS.ptr().get_data_path();

    alvision.cvtest.TS.ptr().printf(alvision.cvtest.TSConstants.LOG, "\n\nSource files directory: %s\n", (src_dir+"video/"));

    for (var i = 0; i < n; ++i)
    {
        var file_path = src_dir+"video/big_buck_bunny."+ext[i];
        var cap = new alvision.VideoCapture (file_path);
        if (!cap.isOpened())
        {
            alvision.cvtest.TS.ptr().printf(alvision.cvtest.TSConstants.LOG, "\nFile information (video %d): \n\nName: big_buck_bunny.%s\nFAILED\n\n", i+1, ext[i]);
            alvision.cvtest.TS.ptr().printf(alvision.cvtest.TSConstants.LOG, "Error: cannot read source video file.\n");
            alvision.cvtest.TS.ptr().set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            return;
        }

        var frame = new alvision.Mat();
        cap.retrieve(frame);
        //
        //cap >> frame;

        alvision.ASSERT_EQ(672, frame.cols);
        alvision.ASSERT_EQ(384, frame.rows);
    }
});

alvision.cvtest.TEST('Videoio_Video', 'DISABLED_prop_fps',()=>
{
    const n = ext.length;// sizeof(ext)/sizeof(ext[0]);
    const  src_dir = alvision.cvtest.TS.ptr().get_data_path();

    alvision.cvtest.TS.ptr().printf(alvision.cvtest.TSConstants.LOG, "\n\nSource files directory: %s\n", (src_dir+"video/"));

    for (var i = 0; i < n; ++i)
    {
        var file_path = src_dir+"video/big_buck_bunny."+ext[i];
        var cap = new alvision.VideoCapture (file_path);
        if (!cap.isOpened())
        {
            alvision.cvtest.TS.ptr().printf(alvision.cvtest.TSConstants.LOG, "\nFile information (video %d): \n\nName: big_buck_bunny.%s\nFAILED\n\n", i+1, ext[i]);
            alvision.cvtest.TS.ptr().printf(alvision.cvtest.TSConstants.LOG, "Error: cannot read source video file.\n");
            alvision.cvtest.TS.ptr().set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            return;
        }

        alvision.ASSERT_EQ(24, cap.get(alvision.CAP_PROP.CAP_PROP_FPS));
    }
});

alvision.cvtest.TEST('Videoio_Video', 'prop_framecount', () => {
    const n = ext.length;// sizeof(ext)/sizeof(ext[0]);
    const src_dir = alvision.cvtest.TS.ptr().get_data_path();

    alvision.cvtest.TS.ptr().printf(alvision.cvtest.TSConstants.LOG, "\n\nSource files directory: %s\n", (src_dir + "video/"));

    for (var i = 0; i < n; ++i) {
        var file_path = src_dir + "video/big_buck_bunny." + ext[i];
        var cap = new alvision.VideoCapture (file_path);
        if (!cap.isOpened()) {
            alvision.cvtest.TS.ptr().printf(alvision.cvtest.TSConstants.LOG, "\nFile information (video %d): \n\nName: big_buck_bunny.%s\nFAILED\n\n", i + 1, ext[i]);
            alvision.cvtest.TS.ptr().printf(alvision.cvtest.TSConstants.LOG, "Error: cannot read source video file.\n");
            alvision.cvtest.TS.ptr().set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            return;
        }

        alvision.ASSERT_EQ(125, cap.get(alvision.CAP_PROP.CAP_PROP_FRAME_COUNT));
    }
});

//#endif
