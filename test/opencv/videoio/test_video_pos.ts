/*M///////////////////////////////////////////////////////////////////////////////////////
 //
 //  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
 //
 //  By downloading, copying, installing or using the software you agree to this license.
 //  If you do not agree to this license, do not download, install,
 //  copy or use the software.
 //
 //
 //                          License Agreement
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
//
//using namespace cv;
//using namespace std;

//    string fourccToString(int fourcc);
//
class VideoFormat {
    //constructor() { this.fourcc = -1; }
    constructor(_ext?: string, _fourcc?: alvision.int) 
    {
        if (_ext == null) {
            this.fourcc = -1;
        } else {
            this.ext = _ext;
            this.fourcc = _fourcc;
        }
    }
    empty(): boolean {
        return this.ext == null;
    }

    public ext: string;
    public fourcc: alvision.int;
}

function fourccToString(fourcc: alvision.int): string {
    return util.format("%c%c%c%c", fourcc.valueOf() & 255, (fourcc.valueOf() >> 8) & 255, (fourcc.valueOf() >> 16) & 255, (fourcc.valueOf() >> 24) & 255);
}

const g_specific_fmt_list =
    [
        /*VideoFormat("wmv", alvision.CV_FOURCC('d', 'v', '2', '5')),
        VideoFormat("wmv", alvision.CV_FOURCC('d', 'v', '5', '0')),
        VideoFormat("wmv", alvision.CV_FOURCC('d', 'v', 'c', ' ')),
        VideoFormat("wmv", alvision.CV_FOURCC('d', 'v', 'h', '1')),
        VideoFormat("wmv", alvision.CV_FOURCC('d', 'v', 'h', 'd')),
        VideoFormat("wmv", alvision.CV_FOURCC('d', 'v', 's', 'd')),
        VideoFormat("wmv", alvision.CV_FOURCC('d', 'v', 's', 'l')),
        VideoFormat("wmv", alvision.CV_FOURCC('H', '2', '6', '3')),
        VideoFormat("wmv", alvision.CV_FOURCC('M', '4', 'S', '2')),
        VideoFormat("avi", alvision.CV_FOURCC('M', 'J', 'P', 'G')),
        VideoFormat("mp4", alvision.CV_FOURCC('M', 'P', '4', 'S')),
        VideoFormat("mp4", alvision.CV_FOURCC('M', 'P', '4', 'V')),
        VideoFormat("wmv", alvision.CV_FOURCC('M', 'P', '4', '3')),
        VideoFormat("wmv", alvision.CV_FOURCC('M', 'P', 'G', '1')),
        VideoFormat("wmv", alvision.CV_FOURCC('M', 'S', 'S', '1')),
        VideoFormat("wmv", alvision.CV_FOURCC('M', 'S', 'S', '2')),*/
        //#if !defined(_M_ARM)
        new VideoFormat("wmv", alvision.CV_FOURCC('W', 'M', 'V', '1')),
        new VideoFormat("wmv", alvision.CV_FOURCC('W', 'M', 'V', '2')),
        //#endif
        new VideoFormat("wmv", alvision.CV_FOURCC('W', 'M', 'V', '3')),
        new VideoFormat("avi", alvision.CV_FOURCC('H', '2', '6', '4')),
        //VideoFormat("wmv", alvision.CV_FOURCC('W', 'V', 'C', '1')),
        new VideoFormat(),
        //#else
        new VideoFormat("avi", alvision.VideoWriter.fourcc('X', 'V', 'I', 'D')),
        new VideoFormat("avi", alvision.VideoWriter.fourcc('M', 'P', 'E', 'G')),
        new VideoFormat("avi", alvision.VideoWriter.fourcc('M', 'J', 'P', 'G')),
        //VideoFormat("avi", VideoWriter::fourcc('I', 'Y', 'U', 'V')),
        new VideoFormat("mkv", alvision.VideoWriter.fourcc('X', 'V', 'I', 'D')),
        new VideoFormat("mkv", alvision.VideoWriter.fourcc('M', 'P', 'E', 'G')),
        new VideoFormat("mkv", alvision.VideoWriter.fourcc('M', 'J', 'P', 'G')),
        //#ifndef HAVE_GSTREAMER
        new VideoFormat("mov", alvision.VideoWriter.fourcc('m', 'p', '4', 'v')),
        //#endif
        new VideoFormat()
    ];

//
//const VideoFormat g_specific_fmt_list[];


class CV_PositioningTest  extends alvision.cvtest.BaseTest
{

    constructor()
    {
        super();
        this.framesize = new alvision.Size(640, 480);
    }

    drawFrame(i : alvision.int): alvision.Mat
    {
        var mat = alvision.Mat.from(alvision.Mat.zeros(this.framesize, alvision.MatrixType.CV_8UC3));

        mat = new alvision.Scalar(Math.abs(Math.cos(i.valueOf() * 0.08) * 255), Math.abs(Math.sin(i.valueOf() * 0.05) * 255), i).getMat();
        alvision.putText(mat, util.format("%03d", i),new alvision. Point(10, 350), 0, 10, new alvision.Scalar(128, 255, 255), 15);
        return mat;
    }

    getFilename(fmt: VideoFormat ) : string
    {
        return alvision.tempfile((fourccToString(fmt.fourcc) + "." + fmt.ext));
    }

    CreateTestVideo(fmt: VideoFormat, framecount: alvision.int , filename : string): boolean
    {
        var writer = new alvision.VideoWriter (filename, fmt.fourcc, 25, this.framesize, true);
        if( !writer.isOpened() )
            return false;

        for (var i = 0; i < framecount; ++i)
        {
            var img = this.drawFrame(i);
            writer.write(img);
        }
        return true;
    }

    run(iii : alvision.int) : void
    {
        var n_frames = 100;

        for(var testcase = 0; ; testcase++ )
        {
            var fmt = g_specific_fmt_list[testcase];
            if( fmt.empty() )
                break;
            var filename = this.getFilename(fmt);
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "\nFile: %s\n", filename);

            if( !this.CreateTestVideo(fmt, n_frames, filename) )
            {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "\nError: cannot create video file");
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                return;
            }

            var cap = new alvision.VideoCapture(filename);

            if (!cap.isOpened())
            {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "\nError: cannot read video file.");
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
                return;
            }

            let N0 = cap.get(alvision.CAP_PROP.CAP_PROP_FRAME_COUNT);
            cap.set(alvision.CAP_PROP.CAP_PROP_POS_FRAMES, 0);
            let N = cap.get(alvision.CAP_PROP.CAP_PROP_FRAME_COUNT);

            // See the same hack in CV_VideoIOTest::SpecificVideoTest for explanation.
            var allowed_extra_frames = 0;
            if (fmt.fourcc == alvision.VideoWriter.fourcc('M', 'P', 'E', 'G') && fmt.ext == "mkv")
                allowed_extra_frames = 1;

            if (N < n_frames || N > n_frames + allowed_extra_frames || N != N0)
            {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "\nError: returned frame count (N0=%d, N=%d) is different from the reference number %d\n", N0, N, n_frames);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                return;
            }

            for (var k = 0; k < n_frames; ++k)
            {
                var idx = alvision.theRNG().uniform(0, n_frames);

                if( !cap.set(alvision.CAP_PROP.CAP_PROP_POS_FRAMES, idx) )
                {
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "\nError: cannot seek to frame %d.\n", idx);
                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                    return;
                }

                let idx1 = cap.get(alvision.CAP_PROP.CAP_PROP_POS_FRAMES);

                let img = new alvision.Mat();
                cap.read(img);

                let img0 = this.drawFrame(idx);

                if( idx != idx1 )
                {
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "\nError: the current position (%d) after seek is different from specified (%d)\n",
                               idx1, idx);
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "Saving both frames ...\n");
                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                    return;
                }

                if (img.empty())
                {
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "\nError: cannot read a frame at position %d.\n", idx);
                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                    return;
                }

                var err = alvision.cvtest.PSNR(img, img0);

                if( err < 20 )
                {
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "The frame read after positioning to %d is incorrect (PSNR=%g)\n", idx, err);
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "Saving both frames ...\n");
                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                    return;
                }
            }
        }
    }

    protected framesize: alvision.Size;
};

//#if BUILD_WITH_VIDEO_INPUT_SUPPORT && BUILD_WITH_VIDEO_OUTPUT_SUPPORT && defined HAVE_FFMPEG
alvision.cvtest.TEST('Videoio_Video', 'seek_random_synthetic', () => { var test = new CV_PositioningTest(); test.safe_run(); });
//#endif
