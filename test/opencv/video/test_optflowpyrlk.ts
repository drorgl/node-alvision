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
//#include "opencv2/video/tracking_c.h"

/* ///////////////////// pyrlk_test ///////////////////////// */

class CV_OptFlowPyrLKTest  extends alvision.cvtest.BaseTest
{
    run(iii: alvision.int): void {
        var code = alvision.cvtest.FailureCode.OK;

        const success_error_level = 0.3;
        const bad_points_max = 8;

        /* test parameters */
        var max_err = 0., sum_err = 0;
        var    pt_cmpd = 0;
        var    pt_exceed = 0;
        var    merr_i = 0, merr_j = 0, merr_k = 0;
        var filename: string;

        CvPoint2D32f * u = 0, *v = 0, *v2 = 0;
        CvMat * _u = 0, *_v = 0, *_v2 = 0;
        char * status = 0;

        IplImage imgI;
        IplImage imgJ;
        alvision.Mat  imgI2, imgJ2;

        int  n = 0, i = 0;

        console.log(util.format(filename, "%soptflow/%s", this.ts.get_data_path(), "lk_prev.dat"));
        _u = (CvMat *)cvLoad(filename);

        if (!_u) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "could not read %s\n", filename);
            code = alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA;
            goto _exit_;
        }

        console.log(util.format(filename, "%soptflow/%s", this.ts.get_data_path(), "lk_next.dat"));
        _v = (CvMat *)cvLoad(filename);

        if (!_v) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "could not read %s\n", filename);
            code = alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA;
            goto _exit_;
        }

        if (_u ->cols != 2 || CV_MAT_TYPE(_u ->type) != CV_32F ||
            _v ->cols != 2 || CV_MAT_TYPE(_v ->type) != CV_32F || _v ->rows != _u ->rows) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "the loaded matrices of points are not valid\n");
            code = alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA;
            goto _exit_;

        }

        u = (CvPoint2D32f *)_u->data.fl;
        v = (CvPoint2D32f *)_v->data.fl;

        /* allocate adidtional buffers */
        _v2 = cvCloneMat(_u);
        v2 = (CvPoint2D32f *)_v2->data.fl;

        /* read first image */
        console.log(util.format(filename, "%soptflow/%s", ts ->get_data_path(), "rock_1.bmp"));
        imgI2 = alvision.imread(filename, alvision.ImreadModes.IMREAD_UNCHANGED);
        imgI = imgI2;

        if (imgI2.empty()) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "could not read %s\n", filename);
            code = alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA;
            goto _exit_;
        }

        /* read second image */
        console.log(util.format(filename, "%soptflow/%s", ts ->get_data_path(), "rock_2.bmp"));
        imgJ2 = alvision.imread(filename, alvision.IMREAD_UNCHANGED);
        imgJ = imgJ2;

        if (imgJ2.empty()) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "could not read %s\n", filename);
            code = alvision.cvtest.TS::FAIL_MISSING_TEST_DATA;
            goto _exit_;
        }

        n = _u ->rows;
        status = (char *)cvAlloc(n * sizeof(status[0]));

        /* calculate flow */
        cvCalcOpticalFlowPyrLK( &imgI, &imgJ, 0, 0, u, v2, n, cvSize(41, 41),
            4, status, 0, cvTermCriteria(CV_TERMCRIT_ITER |
                CV_TERMCRIT_EPS, 30, 0.01f ), 0);

        /* compare results */
        for (i = 0; i < n; i++) {
            if (status[i] != 0) {
                double err;
                if (cvIsNaN(v[i].x)) {
                    merr_j++;
                    continue;
                }

                err = fabs(v2[i].x - v[i].x) + fabs(v2[i].y - v[i].y);
                if (err > max_err) {
                    max_err = err;
                    merr_i = i;
                }

                pt_exceed += err > success_error_level;
                sum_err += err;
                pt_cmpd++;
            }
            else {
                if (!cvIsNaN(v[i].x)) {
                    merr_i = i;
                    merr_k++;
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "The algorithm lost the point #%d\n", i);
                    code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
                    goto _exit_;
                }
            }
        }

        if (pt_exceed > bad_points_max) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG,
                "The number of poorly tracked points is too big (>=%d)\n", pt_exceed);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
            goto _exit_;
        }

        if (max_err > 1) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Maximum tracking error is too big (=%g) at %d\n", max_err, merr_i);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
            goto _exit_;
        }

        _exit_:

        cvFree( &status);
        cvReleaseMat( &_u);
        cvReleaseMat( &_v);
        cvReleaseMat( &_v2);

        if (code < 0)
            this.ts.set_failed_test_info(code);
    }
};



alvision.cvtest.TEST('Video_OpticalFlowPyrLK', 'accuracy', () => { var test = new CV_OptFlowPyrLKTest(); test.safe_run(); });

alvision.cvtest.TEST('Video_OpticalFlowPyrLK', 'submat',()=>
{
    // see bug #2075
    var path = alvision.cvtest.TS.ptr().get_data_path() + "../cv/shared/lena.png";

    var lenaImg = alvision.imread(path);
    alvision.ASSERT_FALSE(lenaImg.empty());

    var wholeImage = new alvision.Mat();
    alvision.resize(lenaImg, wholeImage, new alvision.Size(1024, 1024));

    var img1 = wholeImage(alvision.Rect(0, 0, 640, 360)).clone();
    var img2 = wholeImage(alvision.Rect(40, 60, 640, 360));

    std::Array<uchar> status;
    std::Array<float> error;
    std::Array<alvision.Point2f> prev;
    std::Array<alvision.Point2f> next;

    var rng = new alvision.RNG (123123);

    for(var i = 0; i < 50; ++i)
    {
        var x = rng.uniform(0, 640);
        var y = rng.uniform(0, 360);

        prev.push(new alvision.Point2f(x, y));
    }

    alvision.ASSERT_NO_THROW(alvision.calcOpticalFlowPyrLK(img1, img2, prev, next, status, error));
});
