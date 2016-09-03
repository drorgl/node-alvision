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
//
//using namespace cv;
//using namespace std;

//namespace cvtest {

class VideoFormat {
    //constructor() { this.fourcc = -1; }
    constructor(_ext?: string, _fourcc?: alvision.int) {
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

    //#ifdef HAVE_MSMF
   
//#endif

//}

class CV_VideoIOTest extends alvision.cvtest.BaseTest {
    ImageTest(dir: string): void {
        var _name = dir + "../cv/shared/baboon.png";
        this.ts.printf(alvision.cvtest.TSConstants.LOG, "reading image : %s\n", _name);

        var image = alvision.imread(_name);
        image.convertTo(image, alvision.MatrixType.CV_8UC3);

        if (image.empty()) {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA); //this.ts.FAIL_MISSING_TEST_DATA
            return;
        }

        const exts = [
            //#ifdef HAVE_PNG
            "png",
            //#endif
            //#ifdef HAVE_TIFF
            "tiff",
            //#endif
            //#ifdef HAVE_JPEG
            "jpg",
            //#endif
            //#ifdef HAVE_JASPER
            "jp2",
            //#endif
            //#if 0 /*defined HAVE_OPENEXR && !defined __APPLE__*/
            "exr",
            //#endif
            "bmp",
            "ppm",
            "ras"
        ];
        const ext_num = exts.length;// sizeof(exts) / sizeof(exts[0]);

        for (var i = 0; i < ext_num; ++i) {
            var ext = exts[i];
            var full_name = alvision.tempfile(ext);
            this.ts.printf(alvision.cvtest.TSConstants.LOG, " full_name : %s\n", full_name);

            alvision.imwrite(full_name, image);

            var loaded = alvision.imread(full_name);
            if (loaded.empty()) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Reading failed at fmt=%s\n", ext);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH );
                continue;
            }

            const thresDbell = 20;
            var psnr = alvision.cvtest.PSNR(loaded, image);
            if (psnr < thresDbell) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Reading image from file: too big difference (=%g) with fmt=%s\n", psnr, ext);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
                continue;
            }

            //vector < uchar > from_file;
            

            //FILE * f = fopen(full_name, "rb");
            let f = fs.openSync(full_name, "rb");
            let len = fs.statSync(full_name).size;
            //fseek(f, 0, SEEK_END);
            //long len = ftell(f);
            //from_file.resize((size_t)len);
            let from_file = new Buffer(len);
            
            //fseek(f, 0, SEEK_SET);
            fs.readSync(f, from_file, 0, len, 0);
            //from_file.resize(fread(&from_file[0], 1, from_file.size(), f));
            //fclose(f);
            fs.closeSync(f);

            //vector < uchar > buf;
            let buf = new Buffer(0);
            alvision.imencode("." + exts[i], image, buf);

            if (buf != from_file) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Encoding failed with fmt=%s\n", ext);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
                continue;
            }

            var buf_loaded = alvision.imdecode(new alvision.Mat(buf), 1);

            if (buf_loaded.empty()) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Decoding failed with fmt=%s\n", ext);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
                continue;
            }

            psnr = alvision.cvtest.PSNR(buf_loaded, image);

            if (psnr < thresDbell) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Decoding image from memory: too small PSNR (=%gdb) with fmt=%s\n", psnr, ext);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
                continue;
            }

        }

        this.ts.printf(alvision.cvtest.TSConstants.LOG, "end test function : ImagesTest \n");
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);

    }
    VideoTest(dir: string, fmt: VideoFormat): void {
        var src_file = dir + "../cv/shared/video_for_test.avi";
        var tmp_name = alvision.tempfile((fourccToString(fmt.fourcc) + "." + fmt.ext));

        this.ts.printf(alvision.cvtest.TSConstants.LOG, "reading video : %s and converting it to %s\n", src_file, tmp_name);

        let cap = new alvision.VideoCapture(src_file);

        //CvCapture * cap = cvCaptureFromFile(src_file);

        if (!cap) {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
            return;
        }

        //CvVideoWriter * writer = 0;
        let writer = new alvision.VideoWriter();

        let frames = new Array<alvision.Mat>();

        for (; ;) {
            let img: alvision.Mat = null;
            if (cap.grab()) {
                cap.retrieve(img);
            }
            //IplImage * img = cvQueryFrame(cap);

            if (!img)
                break;

            frames.push(img);

            if (writer == null) {
                writer = new alvision.VideoWriter(tmp_name, fmt.fourcc, 24,new alvision.Size( img.size().width, img.size().height));
                if (writer == null) {
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "can't create writer (with fourcc : %s)\n",
                        fourccToString(fmt.fourcc));
                    cap.release();
                    cap = null;
                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
                    return;
                }
            }

            writer.write(img);
        }

        writer.release();
        cap.release();

        let saved = new alvision.VideoCapture(tmp_name);
        if (!saved) {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
            return;
        }

        const thresDbell = 20;

        for (var i = 0; ; i++) {
            let ipl1: alvision.Mat = null;
            if (cap.grab()) {
                cap.retrieve(ipl1);
            }

            if (!ipl1)
                break;

            let img = frames[i];
            let img1 = ipl1; 

            var psnr = alvision.cvtest.PSNR(img1, img);
            if (psnr < thresDbell) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Too low frame %d psnr = %gdb\n", i, psnr);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);

                //imwrite("original.png", img);
                //imwrite("after_test.png", img1);
                //Mat diff;
                //absdiff(img, img1, diff);
                //imwrite("diff.png", diff);

                break;
            }
        }

        saved.release();

        this.ts.printf(alvision.cvtest.TSConstants.LOG, "end test function : ImagesVideo \n");
    }
    SpecificImageTest(dir: string): void {
        const IMAGE_COUNT = 10;

        for (var i = 0; i < IMAGE_COUNT; ++i) {
            //stringstream s; s << i;
            let s = i.toString();

            var file_path = dir + "../python/images/QCIF_0" + s + ".bmp";
            var image = alvision.imread(file_path);

            if (image.empty()) {
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA);
                return;
            }

            alvision.resize(image, image, new alvision.Size(968, 757), 0.0, 0.0,alvision.InterpolationFlags. INTER_CUBIC);

            //stringstream s_digit; s_digit << i;
            let s_digit = i.toString();

            var full_name = alvision.tempfile((s_digit + ".bmp"));
            this.ts.printf(alvision.cvtest.TSConstants.LOG, " full_name : %s\n", full_name);

            alvision.imwrite(full_name, image);

            var loaded = alvision.imread(full_name);
            if (loaded.empty()) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Reading failed at fmt=bmp\n");
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
                continue;
            }

            const thresDbell = 20;
            var psnr = alvision.cvtest.PSNR(loaded, image);
            if (psnr < thresDbell) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Reading image from file: too big difference (=%g) with fmt=bmp\n", psnr);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                continue;
            }

            //vector < uchar > from_file;
            

            let f = fs.openSync(full_name, "rb");
            let len = fs.statSync(full_name).size;
            let from_file = new Buffer(len);
            fs.readSync(f, from_file, 0, len, 0);
            fs.closeSync(f);

            let buf = new Buffer(0);
            alvision.imencode(".bmp", image, buf);

            if (buf != from_file) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Encoding failed with fmt=bmp\n");
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
                continue;
            }

            var buf_loaded = alvision.imdecode(new alvision.Mat(buf), 1);

            if (buf_loaded.empty()) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Decoding failed with fmt=bmp\n");
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
                continue;
            }

            psnr = alvision.cvtest.PSNR(buf_loaded, image);

            if (psnr < thresDbell) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Decoding image from memory: too small PSNR (=%gdb) with fmt=bmp\n", psnr);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
                continue;
            }
        }

        this.ts.printf(alvision.cvtest.TSConstants.LOG, "end test function : SpecificImageTest \n");
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }
    SpecificVideoTest(dir: string, fmt: VideoFormat): void {
        var ext = fmt.ext;
        var fourcc = fmt.fourcc;

        var fourcc_str = fourccToString(fourcc);
        const video_file = alvision.tempfile((fourcc_str + "." + ext));

        var frame_size = new alvision.Size(968 & -2, 757 & -2);
        var writer = new alvision.VideoWriter(video_file, fourcc, 25, frame_size, true);

        if (!writer.isOpened()) {
            // call it repeatedly for easier debugging
            var writer2 = new alvision.VideoWriter(video_file, fourcc, 25, frame_size, true);
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Creating a video in %s...\n", video_file);
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Cannot create VideoWriter object with codec %s.\n", fourcc_str);
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
            return;
        }

        const IMAGE_COUNT = 30;
        let images = new Array<alvision.Mat>();

        for (var i = 0; i < IMAGE_COUNT; ++i) {
            var file_path = util.format("%s../python/images/QCIF_%02d.bmp", dir, i);
            var img = alvision.imread(file_path, alvision.ImreadModes.IMREAD_COLOR);

            if (img.empty()) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Creating a video in %s...\n", video_file);
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Error: cannot read frame from %s.\n", file_path);
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Continue creating the video file...\n");
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
                break;
            }

            for (var k = 0; k < img.rows(); ++k)
                for (var l = 0; l < img.cols(); ++l)
                    if (img.at<alvision.Vecb>("Vec3b",k, l).get() == alvision.Vecb.all(0))
                        img.at<alvision.Vecb>("Vec3b", k, l).set(new alvision.Vecb(0, 255, 0));
                else img.at<alvision.Vecb>("Vec3b",k, l).set( new alvision.Vecb(0, 0, 255));

            alvision.resize(img, img, frame_size, 0.0, 0.0,alvision.InterpolationFlags. INTER_CUBIC);

            images.push(img);
            writer.write(img);
        }

        writer.release();
        var cap = new alvision.VideoCapture(video_file);

        var FRAME_COUNT = cap.get(alvision.CAP_PROP.CAP_PROP_FRAME_COUNT);

        var allowed_extra_frames = 0;

        // Hack! Newer FFmpeg versions in this combination produce a file
        // whose reported duration is one frame longer than needed, and so
        // the calculated frame count is also off by one. Ideally, we'd want
        // to fix both writing (to produce the correct duration) and reading
        // (to correctly report frame count for such files), but I don't know
        // how to do either, so this is a workaround for now.
        // See also the same hack in CV_PositioningTest::run.
        if (fourcc == alvision.VideoWriter.fourcc('M', 'P', 'E', 'G') && ext == "mkv")
            allowed_extra_frames = 1;

        // Hack! Some GStreamer encoding pipelines drop last frame in the video
        var allowed_frame_frop = 0;
        //#ifdef HAVE_GSTREAMER
        //allowed_frame_frop = 1;
        //#endif

        if (FRAME_COUNT < IMAGE_COUNT - allowed_frame_frop || FRAME_COUNT > IMAGE_COUNT + allowed_extra_frames) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "\nFrame count checking for video_%s.%s...\n", fourcc_str, ext);
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Video codec: %s\n", fourcc_str);
            if (allowed_extra_frames != 0)
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Required frame count: %d-%d; Returned frame count: %d\n",
                    IMAGE_COUNT, IMAGE_COUNT + allowed_extra_frames, FRAME_COUNT);
            else
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Required frame count: %d; Returned frame count: %d\n", IMAGE_COUNT, FRAME_COUNT);
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Error: Incorrect frame count in the video.\n");
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Continue checking...\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
            return;
        }

        for (var i = 0; i < IMAGE_COUNT - allowed_frame_frop; i++) {
            let frame = new alvision.Mat(); cap.read(frame);
            if (frame.empty()) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "\nVideo file directory: %s\n", ".");
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "File name: video_%s.%s\n", fourcc_str, ext);
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Video codec: %s\n", fourcc_str);
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Error: cannot read the next frame with index %d.\n", i + 1);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA);
                break;
            }

            var img = images[i];

            const thresDbell = 40;
            let psnr = alvision.cvtest.PSNR(img, frame);

            if (psnr > thresDbell) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "\nReading frame from the file video_%s.%s...\n", fourcc_str, ext);
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Frame index: %d\n", i + 1);
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Difference between saved and original images: %g\n", psnr);
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Maximum allowed difference: %g\n", thresDbell);
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Error: too big difference between saved and original images.\n");
                break;
            }
        }

    }


}

class CV_ImageTest extends CV_VideoIOTest {
    run(iii: alvision.int): void {
        this.ImageTest(this.ts.get_data_path());
    }
}

class CV_SpecificImageTest extends CV_VideoIOTest {
    run(iii: alvision.int): void {
        this.SpecificImageTest(this.ts.get_data_path());
    }
}

class CV_VideoTest extends CV_VideoIOTest {
    run(iii: alvision.int): void {
        for (var i = 0; ; ++i) {
            const fmt = g_specific_fmt_list[i];
            if (fmt.empty())
                break;
            this.VideoTest(this.ts.get_data_path(), fmt);
        }
    }
}

class CV_SpecificVideoTest extends CV_VideoIOTest {
    run(iii: alvision.int): void {
        for (var i = 0; ; ++i)
        {
            const fmt = g_specific_fmt_list[i];
            if (fmt.empty())
                break;
            this.SpecificVideoTest(this.ts.get_data_path(), fmt);
        }

    }
}


//#ifdef HAVE_JPEG
alvision.cvtest.TEST('Videoio_Image', 'regression', () => { var test = new CV_ImageTest(); test.safe_run(); });
//#endif

//#if BUILD_WITH_VIDEO_INPUT_SUPPORT && BUILD_WITH_VIDEO_OUTPUT_SUPPORT && !defined(__APPLE__)
alvision.cvtest.TEST('Videoio_Video', 'regression', () => { var test = new CV_VideoTest(); test.safe_run(); });
alvision.cvtest.TEST('Videoio_Video', 'write_read', () => { var test = new CV_SpecificVideoTest(); test.safe_run(); });
//#endif

alvision.cvtest.TEST('Videoio_Image', 'write_read', () => { var test = new CV_SpecificImageTest(); test.safe_run(); });
