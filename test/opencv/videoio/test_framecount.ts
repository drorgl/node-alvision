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
//#include "opencv2/videoio/videoio_c.h"
//#include <stdio.h>
//
//using namespace cv;
//using namespace std;


//class CV_FramecountTest extends alvision. cvtest.BaseTest
//{
    //run(ii : alvision.int): void {
        //const time_sec = 5, fps = 25;

        //const ext = ["avi", "mov", "mp4"];

        ////const n = sizeof(ext) / sizeof(ext[0]);

        //const src_dir = this.ts.get_data_path();

        //this.ts.printf(alvision.cvtest.TSConstants.LOG, "\n\nSource files directory: %s\n", (src_dir + "video/"));

        //Ptr < CvCapture > cap;
        

        //for (size_t i = 0; i < n; ++i)
        //{
            //string file_path = src_dir + "video/big_buck_bunny." + ext[i];

            //cap.reset(cvCreateFileCapture(file_path));
            //if (!cap) {
                //this.ts.printf(alvision.cvtest.TSConstants.LOG, "\nFile information (video %d): \n\nName: big_buck_bunny.%s\nFAILED\n\n", i + 1, ext[i]);
                //this.ts.printf(alvision.cvtest.TSConstants.LOG, "Error: cannot read source video file.\n");
                //this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
                //return;
            //}

            ////cvSetCaptureProperty(cap, CV_CAP_PROP_POS_FRAMES, 0);
            //IplImage * frame; int FrameCount = 0;

            //for (; ;) {
                //frame = cvQueryFrame(cap);
                //if (!frame)
                    //break;
                //FrameCount++;
            //}

            //int framecount = (int)cvGetCaptureProperty(cap, CAP_PROP_FRAME_COUNT);

            //this.ts.printf(alvision.cvtest.TSConstants.LOG, "\nFile information (video %d): \n"\
                //"\nName: big_buck_bunny.%s\nActual frame count: %d\n"\
                //"Frame count computed in the cycle of queries of frames: %d\n"\
                //"Frame count returned by cvGetCaptureProperty function: %d\n",
                //i + 1, ext[i], time_sec * fps, FrameCount, framecount);

            //if ((FrameCount != Math.round(time_sec * fps) ||
                //FrameCount != framecount) && ext[i] != "mpg") {
                //this.ts.printf(alvision.cvtest.TSConstants.LOG, "FAILED\n");
                //this.ts.printf(alvision.cvtest.TSConstants.LOG, "\nError: actual frame count and returned frame count are not matched.\n");
                //this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                //return;
            //}
        //}
    //}
//};

//alvision.cvtest.TEST('Videoio_Video', 'framecount', () => { var test = new CV_FramecountTest(); test.safe_run(); });
