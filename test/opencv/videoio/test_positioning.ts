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
//#include "opencv2/videoio/videoio_c.h"
//#include <stdio.h>
//
//using namespace cv;
//using namespace std;

enum METHOD{PROGRESSIVE, RANDOM };

class CV_VideoPositioningTest extends alvision.cvtest.BaseTest
{
    protected idx: Array<alvision.int>;

run_test(method : METHOD) : void{
    var src_dir = this.ts.get_data_path();

    this.ts.printf(alvision.cvtest.TSConstants.LOG, "\n\nSource files directory: %s\n", (src_dir + "video/"));

    var ext = ["avi", "mov", "mp4", "mpg"];

    var n = ext.length;//(int)(sizeof(ext) / sizeof(ext[0]));

    var failed_videos = 0;

    for (var i = 0; i < ext.length; ++i)
    {
        // skip random positioning test in plain mpegs
        if (method == METHOD.RANDOM && ext[i] == "mpg")
            continue;
        var file_path = src_dir + "video/big_buck_bunny." + ext[i];

        this.ts.printf(alvision.cvtest.TSConstants.LOG, "\nReading video file in %s...\n", file_path);

        var cap = alvision.cvCreateFileCapture(file_path);

        if (!cap) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "\nFile information (video %d): \n\nName: big_buck_bunny.%s\nFAILED\n\n", i + 1, ext[i]);
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Error: cannot read source video file.\n");
            //this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            failed_videos++; continue;
        }

        alvision.cvSetCaptureProperty(cap, CAP_PROP_POS_FRAMES, 0);

        this.generate_idx_seq(cap, method);

        var N =  (int)idx.size(), failed_frames = 0, failed_positions = 0, failed_iterations = 0;

        for (var j = 0; j < N; ++j)
        {
            var flag = false;

            alvision.cvSetCaptureProperty(cap, CAP_PROP_POS_FRAMES, idx.at(j));

            /* IplImage* frame = cvRetrieveFrame(cap);

            if (!frame)
            {
                if (!failed_frames)
                {
                    ts->printf(alvision.cvtest.TSConstants.LOG, "\nFile information (video %d): \n\nName: big_buck_bunny.%s\n", i+1, ext[i]);
                }
                failed_frames++;
                ts->printf(alvision.cvtest.TSConstants.LOG, "\nIteration: %d\n\nError: cannot read a frame with index %d.\n", j, idx.at(j));
                this.ts.set_failed_test_info(alvision.cvtest.TS::FAIL_EXCEPTION);
                flag = !flag;
            } */

            var val = (int)cvGetCaptureProperty(cap, CAP_PROP_POS_FRAMES);

            if (idx.at(j) != val) {
                if (!(failed_frames || failed_positions)) {
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "\nFile information (video %d): \n\nName: big_buck_bunny.%s\n", i + 1, ext[i]);
                }
                failed_positions++;
                if (!failed_frames) {
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "\nIteration: %d\n", j);
                }
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Required pos: %d\nReturned pos: %d\n", idx.at(j), val);
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Error: required and returned positions are not matched.\n");
                this.ts.set_failed_test_info(alvision.cvtest.FalureCode.FAIL_INVALID_OUTPUT);
                flag = true;
            }

            if (flag) {
                failed_iterations++;
                failed_videos++;
                break;
            }
        }

        cvReleaseCapture(&cap);
    }

    this.ts.printf(alvision.cvtest.TSConstants.LOG, "\nSuccessfull experiments: %d (%d%%)\n", n - failed_videos, 100 * (n - failed_videos) / n);
    this.ts.printf(alvision.cvtest.TSConstants.LOG, "Failed experiments: %d (%d%%)\n", failed_videos, 100 * failed_videos / n);
}

    generate_idx_seq(CvCapture * cap, int method) : void{
    idx.clear();
    int N = (int)cvGetCaptureProperty(cap, CAP_PROP_FRAME_COUNT);
    switch (method) {
        case PROGRESSIVE:
            {
                int pos = 1, step = 20;
                do {
                    idx.push_back(pos);
                    pos += step;
                }
                while (pos <= N);
                break;
            }
        case RANDOM:
            {
                RNG rng(N);
                idx.clear();
                for (int i = 0; i < N - 1; i++ )
                idx.push_back(rng.uniform(0, N));
                idx.push_back(N - 1);
                std::swap(idx.at(rng.uniform(0, N - 1)), idx.at(N - 1));
                break;
            }
        default: break;
    }
    }
};

class CV_VideoProgressivePositioningTest extends CV_VideoPositioningTest
{
    run(iii: alvision.int) :void{
        this.run_test(METHOD.PROGRESSIVE);
    }
};

class CV_VideoRandomPositioningTest extends CV_VideoPositioningTest
{
    run(iii : alvision.int):void {
        this.run_test(METHOD.RANDOM);
    }
};

//#if BUILD_WITH_VIDEO_INPUT_SUPPORT && defined HAVE_FFMPEG
alvision.cvtest.TEST('Videoio_Video', 'seek_progressive', () => { var test = new CV_VideoProgressivePositioningTest(); test.safe_run(); });
alvision.cvtest.TEST('Videoio_Video', 'seek_random', () => { var test = new CV_VideoRandomPositioningTest(); test.safe_run(); });
//#endif
