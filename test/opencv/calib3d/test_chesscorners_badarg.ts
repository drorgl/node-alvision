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

import * as _cbgen from './test_chessboardgenerator';

//#include "test_precomp.hpp"
//#include "test_chessboardgenerator.hpp"
//#include "opencv2/calib3d/calib3d_c.h"
//
//#include <limits>
//
//using namespace std;
//using namespace cv;

class CV_ChessboardDetectorBadArgTest extends alvision.cvtest.BadArgTest {
    constructor() {
        super();
        this.cpp = false;
        this.flags = 0;
        //this.out_corners = null;
        //this.out_corner_count = null;
        this.drawCorners = this.was_found = false;
    }

    run(iii: alvision.int): void {
        var bg = new alvision.Mat (800, 600,alvision.MatrixType. CV_8U, new alvision.Scalar(0));
        var camMat = new alvision.Mat1f(3, 3, [300., 0., bg.cols().valueOf() / 2., 0, 300., bg.rows().valueOf() / 2., 0., 0., 1.]);
        //camMat << 300.f, 0.f, bg.cols / 2.f, 0, 300.f, bg.rows / 2.f, 0.f, 0.f, 1.f;
        var distCoeffs = new alvision.Mat1f(1, 5, [1.2, 0.2, 0., 0., 0.]);
        //distCoeffs << 1.2f, 0.2f, 0.f, 0.f, 0.f;

        var cbg = new _cbgen.ChessBoardGenerator (new alvision.Size(8, 6));
        var exp_corn = new Array<alvision.Point2f>();
        var cb = cbg.run1(bg, camMat, distCoeffs, exp_corn);

        /* /*//*/ */
        var errors = 0;
        this.flags = alvision.CALIB_CB.CALIB_CB_ADAPTIVE_THRESH | alvision.CALIB_CB.CALIB_CB_NORMALIZE_IMAGE;
        this.cpp = true;

        this.img = cb.clone();
        this.pattern_size = new alvision.Size(2, 2);
        errors += this.run_test_case(alvision.cv.Error.Code.StsOutOfRange, "Invlid pattern size").valueOf();

        this.pattern_size = cbg.cornersSize();
        cb.convertTo(this.img,alvision.MatrixType. CV_32F);
        errors += this.run_test_case(alvision.cv.Error.Code.StsUnsupportedFormat, "Not 8-bit image").valueOf();

        alvision.merge(alvision.NewArray<alvision.Mat>(2,()=> cb), this.img);
        errors += this.run_test_case(alvision.cv.Error.Code.StsUnsupportedFormat, "2 channel image").valueOf();

        this.cpp = false;
        this.drawCorners = false;

        this.img = cb.clone();
        //this.arr = img;
        //this.out_corner_count = 0;
        //this.out_corners = 0;
        errors += this.run_test_case(alvision.cv.Error.Code.StsNullPtr, "Null pointer to corners").valueOf();

        this.drawCorners = true;
        var cvdrawCornImg= new alvision.Mat(this.img.size(),alvision.MatrixType. CV_8UC2);
        this.drawCorImg = cvdrawCornImg;
        this.was_found = true;
        errors += this.run_test_case(alvision.cv.Error.Code.StsUnsupportedFormat, "2 channel image").valueOf();


        if (errors)
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
        else
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }
    protected checkByGenerator(): void {/*abstract*/ }

    protected cpp: boolean;

    /* cpp interface */
    protected img: alvision.Mat;
    protected pattern_size: alvision.Size;
    protected flags: alvision.int;
    protected corners: Array<alvision.Point2f>;

    /* c interface */
    //CvMat arr;
    //CvPoint2D32f* out_corners;
    //int* out_corner_count;


    /* c interface draw  corners */
    protected drawCorners: boolean;
    protected drawCorImg: alvision.Mat;
    protected was_found: boolean;

    run_func(): void {
        //if (cpp)
        alvision.findChessboardCorners(this.img, this.pattern_size, this.corners, this.flags);
        //else
        //    if (!drawCorners)
        //        cvFindChessboardCorners( &arr, pattern_size, out_corners, out_corner_count, flags );
        //    else
        //        cvDrawChessboardCorners( &drawCorImg, pattern_size,
        //            (CvPoint2D32f*)(corners.empty() ? 0 : &corners[0]),
        //            (int)corners.size(), was_found);
    }
}



alvision.cvtest.TEST('Calib3d_ChessboardDetector', 'badarg', () => { var test = new CV_ChessboardDetectorBadArgTest(); test.safe_run(); });

/* End of file. */
