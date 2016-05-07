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
import colors = require("colors");
import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');

//#include "test_precomp.hpp"
//#include "opencv2/imgproc/imgproc_c.h"
//#include "opencv2/calib3d/calib3d_c.h"

class CV_ChessboardDetectorTimingTest extends alvision.cvtest.BaseTest
{
public:
    CV_ChessboardDetectorTimingTest();
protected:
    void run(int);
};


CV_ChessboardDetectorTimingTest::CV_ChessboardDetectorTimingTest()
{
}

/* ///////////////////// chess_corner_test ///////////////////////// */
void CV_ChessboardDetectorTimingTest::run( int start_from )
{
    int code = alvision.cvtest.TS::OK;

    /* test parameters */
    std::string   filepath;
    std::string   filename;

    CvMat*  _v = 0;
    CvPoint2D32f* v;

    IplImage img;
    IplImage* gray = 0;
    IplImage* thresh = 0;

    int  idx, max_idx;
    int  progress = 0;

    filepath = alvision.format("%scv/cameracalibration/", ts->get_data_path() );
    filename = alvision.format("%schessboard_timing_list.dat", filepath );
    CvFileStorage* fs = cvOpenFileStorage( filename, 0, CV_STORAGE_READ );
    CvFileNode* board_list = fs ? cvGetFileNodeByName( fs, 0, "boards" ) : 0;

    if( !fs || !board_list || !CV_NODE_IS_SEQ(board_list->tag) ||
        board_list->data.seq->total % 4 != 0 )
    {
        ts->printf( alvision.cvtest.TSConstants.LOG, "chessboard_timing_list.dat can not be readed or is not valid" );
        code = alvision.cvtest.TS::FAIL_MISSING_TEST_DATA;
        goto _exit_;
    }

    max_idx = board_list->data.seq->total/4;

    for( idx = start_from; idx < max_idx; idx++ )
    {
        int count0 = -1;
        int count = 0;
        CvSize pattern_size;
        int result, result1 = 0;

        const char* imgname = cvReadString((CvFileNode*)cvGetSeqElem(board_list->data.seq,idx*4), "dummy.txt");
        int is_chessboard = cvReadInt((CvFileNode*)cvGetSeqElem(board_list->data.seq,idx*4+1), 0);
        pattern_size.width = cvReadInt((CvFileNode*)cvGetSeqElem(board_list->data.seq,idx*4 + 2), -1);
        pattern_size.height = cvReadInt((CvFileNode*)cvGetSeqElem(board_list->data.seq,idx*4 + 3), -1);

        ts->update_context( this, idx-1, true );

        /* read the image */
        filename = alvision.format("%s%s", filepath, imgname );

        alvision.Mat img2 = alvision.imread( filename );
        img = img2;

        if( img2.empty() )
        {
            ts->printf( alvision.cvtest.TSConstants.LOG, "one of chessboard images can't be read: %s\n", filename );
            if( max_idx == 1 )
            {
                code = alvision.cvtest.TS::FAIL_MISSING_TEST_DATA;
                goto _exit_;
            }
            continue;
        }

        ts->printf(alvision.cvtest.TSConstants.LOG, "%s: chessboard %d:\n", imgname, is_chessboard);

        gray = cvCreateImage( cvSize( img.width, img.height ), IPL_DEPTH_8U, 1 );
        thresh = cvCreateImage( cvSize( img.width, img.height ), IPL_DEPTH_8U, 1 );
        cvCvtColor( &img, gray, CV_BGR2GRAY );


        count0 = pattern_size.width*pattern_size.height;

        /* allocate additional buffers */
        _v = cvCreateMat(1, count0, CV_32FC2);
        count = count0;

        v = (CvPoint2D32f*)_v->data.fl;

        int64 _time0 = cvGetTickCount();
        result = cvCheckChessboard(gray, pattern_size);
        int64 _time01 = cvGetTickCount();

        OPENCV_CALL( result1 = cvFindChessboardCorners(
                 gray, pattern_size, v, &count, 15 ));
        int64 _time1 = cvGetTickCount();

        if( result != is_chessboard )
        {
            ts->printf( alvision.cvtest.TSConstants.LOG, "Error: chessboard was %sdetected in the image %s\n",
                       result ? "" : "not ", imgname );
            code = alvision.cvtest.FalureCode.FAIL_INVALID_OUTPUT;
            goto _exit_;
        }
        if(result != result1)
        {
            ts->printf( alvision.cvtest.TSConstants.LOG, "Warning: results differ cvCheckChessboard %d, cvFindChessboardCorners %d\n",
                       result, result1);
        }

        int num_pixels = gray->width*gray->height;
        float check_chessboard_time = float(_time01 - _time0)/(float)cvGetTickFrequency(); // in us
        ts->printf(alvision.cvtest.TSConstants.LOG, "    cvCheckChessboard time s: %f, us per pixel: %f\n",
                   check_chessboard_time*1e-6, check_chessboard_time/num_pixels);

        float find_chessboard_time = float(_time1 - _time01)/(float)cvGetTickFrequency();
        ts->printf(alvision.cvtest.TSConstants.LOG, "    cvFindChessboard time s: %f, us per pixel: %f\n",
                   find_chessboard_time*1e-6, find_chessboard_time/num_pixels);

        cvReleaseMat( &_v );
        cvReleaseImage( &gray );
        cvReleaseImage( &thresh );
        progress = update_progress( progress, idx-1, max_idx, 0 );
    }

_exit_:

    /* release occupied memory */
    cvReleaseMat( &_v );
    cvReleaseFileStorage( &fs );
    cvReleaseImage( &gray );
    cvReleaseImage( &thresh );

    if( code < 0 )
        this.ts.set_failed_test_info( code );
}

alvision.cvtest.TEST('Calib3d_ChessboardDetector', 'timing', () => { var test = new CV_ChessboardDetectorTimingTest(); test.safe_run(); });

/* End of file. */
