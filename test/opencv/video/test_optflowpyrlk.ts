
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

        //CvPoint2D32f * u = 0, *v = 0, *v2 = 0;
        //let u: alvision.Point2f, v: alvision.Point2f, v2: alvision.Point2f;
        let _u = new alvision.Mat(), _v = new alvision.Mat(), _v2 = new alvision.Mat();
        //char * status = 0;

        let imgI: alvision.Mat;
        let imgJ: alvision.Mat;

        let imgI2 = new alvision.Mat();
        let imgJ2 = new alvision.Mat();

        //let  n = 0, i = 0;

        console.log(util.format(filename, "%soptflow/%s", this.ts.get_data_path(), "lk_prev.dat"));
        _u = alvision.readImage(filename);

        if (!_u) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "could not read %s\n", filename);
            code = alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA;
            //goto _exit_;
            if (code < 0) this.ts.set_failed_test_info(code); return;
        }

        console.log(util.format(filename, "%soptflow/%s", this.ts.get_data_path(), "lk_next.dat"));
        _v = alvision.readImage(filename);

        if (!_v) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "could not read %s\n", filename);
            code = alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA;
            //goto _exit_;
            if (code < 0) this.ts.set_failed_test_info(code); return;
        }

        if (_u .cols() != 2 || alvision.MatrixType.CV_MAT_TYPE(_u .type()) != alvision.MatrixType.CV_32F ||
            _v .cols() != 2 || alvision.MatrixType.CV_MAT_TYPE(_v .type()) != alvision.MatrixType.CV_32F || _v .rows != _u .rows) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "the loaded matrices of points are not valid\n");
            code = alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA;
            //goto _exit_;
            if (code < 0) this.ts.set_failed_test_info(code); return;

        }

        let u = _u.ptr<alvision.Point2f>("Point2f");
        let v = _v.ptr<alvision.Point2f>("Point2f");

        /* allocate adidtional buffers */
        _v2 = _u.clone();
        let v2 = _v2.ptr<alvision.Point2f>("Point2f");

        /* read first image */
        console.log(util.format(filename, "%soptflow/%s", this.ts .get_data_path(), "rock_1.bmp"));
        imgI2 = alvision.imread(filename, alvision.ImreadModes.IMREAD_UNCHANGED);
        imgI = imgI2;

        if (imgI2.empty()) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "could not read %s\n", filename);
            code = alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA;
            //goto _exit_;
            if (code < 0) this.ts.set_failed_test_info(code); return;
        }

        /* read second image */
        console.log(util.format(filename, "%soptflow/%s", this.ts .get_data_path(), "rock_2.bmp"));
        imgJ2 = alvision.imread(filename, alvision.ImreadModes.IMREAD_UNCHANGED);
        imgJ = imgJ2;

        if (imgJ2.empty()) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "could not read %s\n", filename);
            code =alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA;
            //goto _exit_;
            if (code < 0) this.ts.set_failed_test_info(code); return;
        }

        let n = _u .rows();
        //status = (char *)cvAlloc(n * sizeof(status[0]));

        /* calculate flow */
        alvision.calcOpticalFlowPyrLK(imgI, imgJ, null,u, v2, null, new alvision.Size(41, 41),
            4, new alvision.TermCriteria( alvision.TermCriteriaType.MAX_ITER | alvision.TermCriteriaType.EPS, 30, 0.01 ), 0);

        /* compare results */
        for (let i = 0; i < n; i++) {
            if (status[i] != null) {
                //double err;
                if (isNaN(v[i].x.valueOf())) {
                    merr_j++;
                    continue;
                }

                let err = Math.abs(v2[i].x.valueOf() - v[i].x.valueOf()) + Math.abs(v2[i].y.valueOf() - v[i].y.valueOf());
                if (err > max_err) {
                    max_err = err;
                    merr_i = i;
                }

                pt_exceed += (err > success_error_level) ? 1 : 0;
                sum_err += err;
                pt_cmpd++;
            }
            else {
                if (!isNaN(v[i].x.valueOf())) {
                    merr_i = i;
                    merr_k++;
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "The algorithm lost the point #%d\n", i);
                    code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
                    //goto _exit_;
                    if (code < 0) this.ts.set_failed_test_info(code); return;
                }
            }
        }

        if (pt_exceed > bad_points_max) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG,
                "The number of poorly tracked points is too big (>=%d)\n", pt_exceed);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
            //goto _exit_;
            if (code < 0) this.ts.set_failed_test_info(code); return;
        }

        if (max_err > 1) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Maximum tracking error is too big (=%g) at %d\n", max_err, merr_i);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
            //goto _exit_;
            if (code < 0) this.ts.set_failed_test_info(code); return;
        }

        //_exit_:


        //cvFree( &status);
        //cvReleaseMat( &_u);
        //cvReleaseMat( &_v);
        //cvReleaseMat( &_v2);

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

    var img1 = wholeImage.roi(new alvision.Rect(0, 0, 640, 360)).clone();
    var img2 = wholeImage.roi(new alvision.Rect(40, 60, 640, 360));

    
    var status = new Array<alvision.uchar>();
    var error = new Array<alvision.float>();
    var prev = new Array<alvision.Point2f>();
    var next = new Array<alvision.Point2f>();

    var rng = new alvision.RNG (123123);

    for(var i = 0; i < 50; ++i)
    {
        var x = rng.uniform(0, 640);
        var y = rng.uniform(0, 360);

        prev.push(new alvision.Point2f(x, y));
    }

    alvision.ASSERT_NO_THROW(()=>alvision.calcOpticalFlowPyrLK(img1, img2, prev, next, status, error));
});
