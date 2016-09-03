/*M///////////////////////////////////////////////////////////////////////////////////////
//
//  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
//
//  By downloading, copying, installing or using the software you agree to this license.
//  If you do not agree to this license, do not download, install,
//  copy or use the software.
//
//
//                        Intel License Agreement
//                For Open Source Computer Vision Library
//
// Copyright (C) 2000, Intel Corporation, all rights reserved.
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
//   * The name of Intel Corporation may not be used to endorse or promote products
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
//#include "opencv2/imgproc/imgproc_c.h"
//#include "opencv2/calib3d/calib3d_c.h"

class CV_ChessboardDetectorTimingTest extends alvision.cvtest.BaseTest
{
    run(start_from: alvision.int) {
        var code = alvision.cvtest.FailureCode.OK;

        /* test parameters */
        //std::string   filepath;
        //std::string   filename;

        //CvMat * _v = 0;
        //CvPoint2D32f * v;

        //IplImage img;
        //IplImage * gray = 0;
        //IplImage * thresh = 0;

        //int  idx, max_idx;
        //int  progress = 0;
        var progress = 0;
        //
        var filepath = util.format("%scv/cameracalibration/", this.ts.get_data_path());
        var filename = util.format("%schessboard_timing_list.dat", filepath);
        var fs = new alvision.FileStorage(filename, alvision.FileStorageMode.READ);// CV_STORAGE_READ);
        var board_list = fs ? fs.nodes[ "boards"] : null;

        if (!fs || !board_list || !board_list.isSeq() || // CV_NODE_IS_SEQ(board_list.name()) ||
            board_list.data.length % 4 != 0) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "chessboard_timing_list.dat can not be readed or is not valid");
            code = alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA;
            return;
            //goto _exit_;
        }

        var max_idx = board_list.data.length / 4;

        for (var idx = start_from.valueOf(); idx < max_idx; idx++) {
            var count0 = -1;
            var count = 0;
            var pattern_size = new alvision.Size();
            //int result, result1 = 0;

            const imgname = board_list.data[idx * 4].readString(); // cvReadString((CvFileNode *)cvGetSeqElem(board_list.data.seq, idx * 4), "dummy.txt");
            var is_chessboard =   board_list.data[idx * 4 + 1].readInt(0) == 1;  //cvReadInt((CvFileNode *)cvGetSeqElem(board_list.data.seq, idx * 4 + 1), 0);
            pattern_size.width =  board_list.data[idx * 4 + 2].readInt(-1);  //cvReadInt((CvFileNode *)cvGetSeqElem(board_list.data.seq, idx * 4 + 2), -1);
            pattern_size.height = board_list.data[idx * 4 + 3].readInt(-1);  // cvReadInt((CvFileNode *)cvGetSeqElem(board_list.data.seq, idx * 4 + 3), -1);

            this.ts.update_context(this, idx - 1, true);

            /* read the image */
            filename = util.format("%s%s", filepath, imgname);

            var img2 = alvision.imread(filename);
            var img = img2;

            if (img2.empty()) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "one of chessboard images can't be read: %s\n", filename);
                if (max_idx == 1) {
                    code = alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA;
                    return;
                    //goto _exit_;
                }
                continue;
            }

            this.ts.printf(alvision.cvtest.TSConstants.LOG, "%s: chessboard %d:\n", imgname, is_chessboard);

            var gray = new alvision.Mat(new alvision.Size(img.cols(), img.rows()), alvision.MatrixType.CV_8UC1);
            var thresh = new alvision.Mat(new alvision.Size(img.cols(), img.rows()), alvision.MatrixType.CV_8UC1);
            alvision.cvtColor( img, gray,alvision.ColorConversionCodes.COLOR_BGR2GRAY );


            count0 = pattern_size.width.valueOf() * pattern_size.height.valueOf();

            /* allocate additional buffers */
            var _v = new alvision.Mat(1, count0,alvision.MatrixType. CV_32FC2);
            count = count0;

            var v = _v.ptr<alvision.Point2f>("Point2f");
            //v = (CvPoint2D32f *)_v.data.fl;

            var _time0 = alvision.cvGetTickCount();
            var result = alvision.cvCheckChessboard(gray, pattern_size);
            var _time01 = alvision.cvGetTickCount();

            var result1 = alvision.findChessboardCorners(gray, pattern_size, v,
                alvision.CALIB_CB.CALIB_CB_ADAPTIVE_THRESH |
                alvision.CALIB_CB.CALIB_CB_FAST_CHECK |
                alvision.CALIB_CB.CALIB_CB_FILTER_QUADS |
                alvision.CALIB_CB.CALIB_CB_NORMALIZE_IMAGE);

            var _time1 = alvision.cvGetTickCount();

            if (result != is_chessboard) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Error: chessboard was %sdetected in the image %s\n",
                    result ? "" : "not ", imgname);
                code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
                return;
                //goto _exit_;
            }
            if (result != result1) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Warning: results differ cvCheckChessboard %d, cvFindChessboardCorners %d\n",result, result1);
            }

            var num_pixels = gray.cols().valueOf() * gray.rows().valueOf();
            var check_chessboard_time = (_time01 - _time0) / alvision.cvGetTickFrequency(); // in us
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "    cvCheckChessboard time s: %f, us per pixel: %f\n",
                check_chessboard_time * 1e-6, check_chessboard_time / num_pixels);

            var find_chessboard_time = (_time1 - _time01) / alvision.cvGetTickFrequency();
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "    cvFindChessboard time s: %f, us per pixel: %f\n",
                find_chessboard_time * 1e-6, find_chessboard_time / num_pixels);

            //cvReleaseMat( &_v);
            //cvReleaseImage( &gray);
            //cvReleaseImage( &thresh);
            progress = this.update_progress(progress, idx - 1, max_idx, 0).valueOf();
        }

        //_exit_:

        /* release occupied memory */
        //cvReleaseMat( &_v);
        //cvReleaseFileStorage( &fs);
        //cvReleaseImage( &gray);
        //cvReleaseImage( &thresh);

        fs.release();

        if (code < 0)
            this.ts.set_failed_test_info(code);
}
};



alvision.cvtest.TEST('Calib3d_ChessboardDetector', 'timing', () => { var test = new CV_ChessboardDetectorTimingTest(); test.safe_run(); });

/* End of file. */
