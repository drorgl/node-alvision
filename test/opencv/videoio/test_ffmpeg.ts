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
//
//using namespace cv;
//
//#ifdef HAVE_FFMPEG
//
//using namespace std;

class CV_FFmpegWriteBigVideoTest  extends alvision.cvtest.BaseTest
{
    run(iii : alvision.int) : void
    {
        const  img_r = 4096;
        const  img_c = 4096;
        const  fps0 = 15;
        const  time_sec = 1;

        const tags = [
            0,
            //VideoWriter.fourcc('D', 'I', 'V', '3'),
            //VideoWriter.fourcc('D', 'I', 'V', 'X'),
            alvision.VideoWriter.fourcc('D', 'X', '5', '0'),
            alvision.VideoWriter.fourcc('F', 'L', 'V', '1'),
            alvision.VideoWriter.fourcc('H', '2', '6', '1'),
            alvision.VideoWriter.fourcc('H', '2', '6', '3'),
            alvision.VideoWriter.fourcc('I', '4', '2', '0'),
            //VideoWriter.fourcc('j', 'p', 'e', 'g'),
            alvision.VideoWriter.fourcc('M', 'J', 'P', 'G'),
            alvision.VideoWriter.fourcc('m', 'p', '4', 'v'),
            alvision.VideoWriter.fourcc('M', 'P', 'E', 'G'),
            //VideoWriter.fourcc('W', 'M', 'V', '1'),
            //VideoWriter.fourcc('W', 'M', 'V', '2'),
            alvision.VideoWriter.fourcc('X', 'V', 'I', 'D'),
            //VideoWriter.fourcc('Y', 'U', 'Y', '2'),
        ]

        const n = tags.length;// sizeof(tags)/sizeof(tags[0]);

        var created = false;

        for (var j = 0; j < n; ++j)
        {
            var tag = tags[j];

            //stringstream s;
            //s << tag;
            var s = tag;

            const  filename = alvision.tempfile((s+".avi"));

            try
            {
                var fps = fps0;
                var frame_s = new alvision.Size(img_c, img_r);

                if( tag == alvision.VideoWriter.fourcc('H', '2', '6', '1') )
                    frame_s = new alvision.Size(352, 288);
                else if( tag == alvision.VideoWriter.fourcc('H', '2', '6', '3') )
                    frame_s = new alvision.Size(704, 576);
                /*else if( tag == CV_FOURCC('M', 'J', 'P', 'G') ||
                         tag == CV_FOURCC('j', 'p', 'e', 'g') )
                    frame_s = Size(1920, 1080);*/

                if( tag == alvision.VideoWriter.fourcc('M', 'P', 'E', 'G') )
                {
                    frame_s = new alvision.Size(720, 576);
                    fps = 25;
                }

                var writer = new alvision.VideoWriter(filename, tag, fps, frame_s);

                if (writer.isOpened() == false)
                {
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "\n\nFile name: %s\n", filename);
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "Codec id: %d   Codec tag: %c%c%c%c\n", j,
                               tag.valueOf() & 255, (tag.valueOf() >> 8) & 255, (tag.valueOf() >> 16) & 255, (tag.valueOf() >> 24) & 255);
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "Error: cannot create video file.");
                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                }
                else
                {
                    var img = new alvision.Mat(frame_s, alvision.MatrixType.CV_8UC3, alvision.Scalar.all(0));
                    const coeff = Math.round(Math.min(frame_s.width.valueOf(), frame_s.height.valueOf())/(fps0 * time_sec));

                    for (var i = 0 ; i < (fps * time_sec); i++ )
                    {
                        //circle(img, Point2i(img_c / 2, img_r / 2), min(img_r, img_c) / 2 * (i + 1), Scalar(255, 0, 0, 0), 2);
                        alvision.rectangle(img, new alvision.Point2i(coeff * i, coeff * i), new alvision.Point2i(coeff * (i + 1), coeff * (i + 1)),
                            alvision.Scalar.all(255 * (1.0 - (i) / (fps * time_sec * 2))), -1);
                        writer.write(img);
                        //writer << img;
                    }

                    writer.release();
                    if (!created) created = true;
                    else alvision.remove(filename);
                }
            }
            catch(e)
            {
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
            }
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
        }
    }
};

alvision.cvtest.TEST('Videoio_Video', 'ffmpeg_writebig', () => { var test = new CV_FFmpegWriteBigVideoTest (); test.safe_run(); });

class CV_FFmpegReadImageTest  extends alvision.cvtest.BaseTest
{
    run(iii : alvision.int) : void
    {
        try
        {
            var filename = this.ts.get_data_path() + "readwrite/ordinary.bmp";
            var cap = new alvision.VideoCapture (filename);
            var img0 = alvision.imread(filename, 1);
            var img = new alvision.Mat(), img_next = new alvision.Mat();
            cap.read(img);
            cap.read(img_next);

            alvision.CV_Assert(()=> !img0.empty() && !img.empty() && img_next.empty() );

            var diff = alvision.cvtest.norm(img0, img,alvision.NormTypes.NORM_INF);
            alvision.CV_Assert(()=> diff == 0 );
        }
        catch(e)
        {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
        }
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }
};

alvision.cvtest.TEST('Videoio_Video', 'ffmpeg_image', () => { var test = new CV_FFmpegReadImageTest(); test.safe_run(); });

//#endif

//#if defined(HAVE_FFMPEG)

//there is no parallel invoker in JS, consider implementation in other ways

//////////////////////////////// Parallel VideoWriters and VideoCaptures ////////////////////////////////////
//
//class CreateVideoWriterInvoker extends ParallelLoopBody
//{
//public:
//    const static Size FrameSize;
//    static std::string TmpDirectory;
//
//    CreateVideoWriterInvoker(Array<VideoWriter*>& _writers, Array<std::string>& _files) :
//        ParallelLoopBody(), writers(&_writers), files(&_files)
//    {
//    }
//
//    virtual void operator() (const Range& range) const
//    {
//        for (let i = range.start; i != range.end; ++i)
//        {
//            std::ostringstream stream;
//            stream << i << ".avi";
//            std::string fileName = tempfile(stream);
//
//            files.operator[](i) = fileName;
//            writers.operator[](i) = new VideoWriter(fileName, VideoWriter::fourcc('X','V','I','D'), 25.0f, FrameSize);
//
//            CV_Assert(writers.operator[](i).isOpened());
//        }
//    }
//
//private:
//    Array<VideoWriter*>* writers;
//    Array<std::string>* files;
//};
//
//std::string CreateVideoWriterInvoker::TmpDirectory;
//const Size CreateVideoWriterInvoker::FrameSize(1020, 900);
//
//class WriteVideo_Invoker extends ParallelLoopBody
//{
//public:
//    enum { FrameCount = 300 };
//
//    static const Scalar ObjectColor;
//    static const Point Center;
//
//    WriteVideo_Invoker(const Array<VideoWriter*>& _writers) :
//        ParallelLoopBody(), writers(&_writers)
//    {
//    }
//
//    static void GenerateFrame(Mat& frame, unsigned int i)
//    {
//        frame = Scalar.all(i % 255);
//
//        std::string text = to_string(i);
//        putText(frame, text, Point(50, Center.y), FONT_HERSHEY_SIMPLEX, 5.0, ObjectColor, 5, CV_AA);
//        circle(frame, Center, i + 2, ObjectColor, 2, CV_AA);
//    }
//
//    virtual void operator() (const Range& range) const
//    {
//        for (int j = range.start; j < range.end; ++j)
//        {
//            VideoWriter* writer = writers.operator[](j);
//            CV_Assert(writer != NULL);
//            CV_Assert(writer.isOpened());
//
//            Mat frame(CreateVideoWriterInvoker::FrameSize, CV_8UC3);
//            for (unsigned int i = 0; i < FrameCount; ++i)
//            {
//                GenerateFrame(frame, i);
//                writer.operator<< (frame);
//            }
//        }
//    }
//
//protected:
//    static std::string to_string(unsigned int i)
//    {
//        std::stringstream stream(std::ios::out);
//        stream << "frame #" << i;
//        return stream;
//    }
//
//private:
//    const Array<VideoWriter*>* writers;
//};
//
//const Scalar WriteVideo_Invoker::ObjectColor(alvision.Scalar.all(0));
//const Point WriteVideo_Invoker::Center(CreateVideoWriterInvoker::FrameSize.height / 2,
//    CreateVideoWriterInvoker::FrameSize.width / 2);
//
//class CreateVideoCaptureInvoker  extends ParallelLoopBody
//{
//public:
//    CreateVideoCaptureInvoker(Array<VideoCapture*>& _readers, const Array<std::string>& _files) :
//        ParallelLoopBody(), readers(&_readers), files(&_files)
//    {
//    }
//
//    virtual void operator() (const Range& range) const
//    {
//        for (let i = range.start; i != range.end; ++i)
//        {
//            readers.operator[](i) = new VideoCapture(files.operator[](i));
//            CV_Assert(readers.operator[](i).isOpened());
//        }
//    }
//private:
//    Array<VideoCapture*>* readers;
//    const Array<std::string>* files;
//};
//
//class ReadImageAndTest  extends ParallelLoopBody
//{
//public:
//    ReadImageAndTest(const Array<VideoCapture*>& _readers, alvision.cvtest.TS* _ts) :
//        ParallelLoopBody(), readers(&_readers), ts(_ts)
//    {
//    }
//
//    virtual void operator() (const Range& range) const
//    {
//        for (int j = range.start; j < range.end; ++j)
//        {
//            VideoCapture* capture = readers.operator[](j);
//            CV_Assert(capture != NULL);
//            CV_Assert(capture.isOpened());
//
//            const static double eps = 23.0;
//            unsigned int frameCount = static_cast<unsigned int>(capture.get(CAP_PROP_FRAME_COUNT));
//            CV_Assert(frameCount == WriteVideo_Invoker::FrameCount);
//            Mat reference(CreateVideoWriterInvoker::FrameSize, CV_8UC3);
//
//            for (unsigned int i = 0; i < frameCount && next; ++i)
//            {
//                Mat actual;
//                (*capture) >> actual;
//
//                WriteVideo_Invoker::GenerateFrame(reference, i);
//
//                alvision.EXPECT_EQ(reference.cols, actual.cols);
//                alvision.EXPECT_EQ(reference.rows, actual.rows);
//                alvision.EXPECT_EQ(reference.depth(), actual.depth());
//                alvision.EXPECT_EQ(reference.channels(), actual.channels());
//
//                double psnr = alvision.cvtest.PSNR(actual, reference);
//                if (psnr < eps)
//                {
//    #define SUM alvision.cvtest.TSConstants.SUMMARY
//                    ts.printf(SUM, "\nPSNR: %lf\n", psnr);
//                    ts.printf(SUM, "Video #: %d\n", range.start);
//                    ts.printf(SUM, "Frame #: %d\n", i);
//    #undef SUM
//                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
//                    ts.set_gtest_status();
//
//                    Mat diff;
//                    absdiff(actual, reference, diff);
//
//                    alvision.EXPECT_EQ(countNonZero(diff.reshape(1) > 1), 0);
//
//                    next = false;
//                }
//            }
//        }
//    }
//
//    static bool next;
//
//private:
//    const Array<VideoCapture*>* readers;
//    alvision.cvtest.TS* ts;
//};
//
//bool ReadImageAndTest::next;
//
//alvision.cvtest.TEST('Videoio_Video_parallel_writers_and_readers', 'accuracy',()=>
//{
//    const unsigned int threadsCount = 4;
//    var ts = alvision.cvtest.TS.ptr();
//
//    // creating VideoWriters
//    Array<VideoWriter*> writers(threadsCount);
//    Range range(0, threadsCount);
//    Array<std::string> files(threadsCount);
//    CreateVideoWriterInvoker invoker1(writers, files);
//    parallel_for_(range, invoker1);
//
//    // write a video
//    parallel_for_(range, WriteVideo_Invoker(writers));
//
//    // deleting the writers
//    for (Array<VideoWriter*>::iterator i = writers.begin(), end = writers.end(); i != end; ++i)
//        delete *i;
//    writers.clear();
//
//    Array<VideoCapture*> readers(threadsCount);
//    CreateVideoCaptureInvoker invoker2(readers, files);
//    parallel_for_(range, invoker2);
//
//    ReadImageAndTest::next = true;
//
//    parallel_for_(range, ReadImageAndTest(readers, ts));
//
//    // deleting tmp video files
//    for (Array<std::string>::const_iterator i = files.begin(), end = files.end(); i != end; ++i)
//    {
//        int code = remove(i.c_str());
//        if (code == 1)
//            std::cerr << "Couldn't delete " << *i << std::endl;
//    }
//});

//#endif
