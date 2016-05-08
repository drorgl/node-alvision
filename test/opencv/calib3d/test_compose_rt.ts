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
//
//using namespace cv;
//using namespace std;

class Differential
{
//public:
    //typedef Mat_<double> mat_t;

    constructor(eps_: alvision.double, rv1_: alvision.Mat_<alvision.double>, tv1_: alvision.Mat_<alvision.double>, rv2_ : alvision.Mat_<alvision.double>, tv2_ : alvision.Mat_<alvision.double>) {
        this.rv1 = (rv1_);
        this.tv1 = (tv1_);
        this.rv2 = (rv2_);
        this.tv2 = (tv2_);
        this.eps = (eps_);
        this.ev = (3, 1)
    }

    dRv1(dr3_dr1: alvision.Mat_<alvision.double>, dt3_dr1: alvision.Mat_<alvision.double>) : void
    {
        dr3_dr1.create(3, 3);     dt3_dr1.create(3, 3);

        for(var i = 0; i < 3; ++i)
        {
            ev.setTo(new alvision.Scalar(0));    ev(i, 0) = eps;

            composeRT( rv1 + ev, tv1, rv2, tv2, rv3_p, tv3_p);
            composeRT( rv1 - ev, tv1, rv2, tv2, rv3_m, tv3_m);

            dr3_dr1.col(i) = rv3_p - rv3_m;
            dt3_dr1.col(i) = tv3_p - tv3_m;
        }
        dr3_dr1 /= 2 * eps;       dt3_dr1 /= 2 * eps;
    }

    dRv2(dr3_dr2 : alvision.Mat_ < alvision.double >, dt3_dr2 : alvision.Mat_<alvision.double>) : void
    {
        dr3_dr2.create(3, 3);     dt3_dr2.create(3, 3);

        for(var i = 0; i < 3; ++i)
        {
            ev.setTo(Scalar(0));    ev(i, 0) = eps;

            composeRT( rv1, tv1, rv2 + ev, tv2, rv3_p, tv3_p);
            composeRT( rv1, tv1, rv2 - ev, tv2, rv3_m, tv3_m);

            dr3_dr2.col(i) = rv3_p - rv3_m;
            dt3_dr2.col(i) = tv3_p - tv3_m;
        }
        dr3_dr2 /= 2 * eps;       dt3_dr2 /= 2 * eps;
    }

    dTv1(drt3_dt1: alvision.Mat_<alvision.double>, dt3_dt1: alvision.Mat_<alvision.double>)
    {
        drt3_dt1.create(3, 3);     dt3_dt1.create(3, 3);

        for(var i = 0; i < 3; ++i)
        {
            ev.setTo(Scalar(0));    ev(i, 0) = eps;

            composeRT( rv1, tv1 + ev, rv2, tv2, rv3_p, tv3_p);
            composeRT( rv1, tv1 - ev, rv2, tv2, rv3_m, tv3_m);

            drt3_dt1.col(i) = rv3_p - rv3_m;
            dt3_dt1.col(i) = tv3_p - tv3_m;
        }
        drt3_dt1 /= 2 * eps;       dt3_dt1 /= 2 * eps;
    }

    dTv2(dr3_dt2: alvision.Mat_<alvision.double>, dt3_dt2 : alvision.Mat_<alvision.double>) : void
    {
        dr3_dt2.create(3, 3);     dt3_dt2.create(3, 3);

        for(var i = 0; i < 3; ++i)
        {
            ev.setTo(Scalar(0));    ev(i, 0) = eps;

            composeRT( rv1, tv1, rv2, tv2 + ev, rv3_p, tv3_p);
            composeRT( rv1, tv1, rv2, tv2 - ev, rv3_m, tv3_m);

            dr3_dt2.col(i) = rv3_p - rv3_m;
            dt3_dt2.col(i) = tv3_p - tv3_m;
        }
        dr3_dt2 /= 2 * eps;       dt3_dt2 /= 2 * eps;
    }

    protected rv1: alvision.Mat_<alvision.double>;
    protected tv1: alvision.Mat_<alvision.double>;
    protected rv2: alvision.Mat_<alvision.double>;
    protected tv2: alvision.Mat_<alvision.double>;

    protected eps: alvision.double;
    protected ev: alvision.Mat_<alvision.double>;

    //Differential& operator=(const Differential&);
    protected rv3_m: alvision.Mat; 
    protected tv3_m : alvision.Mat; 
    protected rv3_p : alvision.Mat; 
    protected tv3_p : alvision.Mat;
};

class CV_composeRT_Test  extends alvision.cvtest.BaseTest
{
    run(iii: alvision.int) : void
    {
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);

        Mat_<double> rvec1(3, 1), tvec1(3, 1), rvec2(3, 1), tvec2(3, 1);

        alvision.randu(rvec1, new alvision.Scalar(0), new alvision.Scalar(6.29));
        alvision.randu(rvec2, new alvision.Scalar(0), new alvision.Scalar(6.29));

        alvision.randu(tvec1, new alvision.Scalar(-2), new alvision.Scalar(2));
        alvision.randu(tvec2, new alvision.Scalar(-2), new alvision.Scalar(2));

        Mat rvec3, tvec3;
        composeRT(rvec1, tvec1, rvec2, tvec2, rvec3, tvec3);

        Mat rvec3_exp, tvec3_exp;

        Mat rmat1, rmat2;
        Rodrigues(rvec1, rmat1);
        Rodrigues(rvec2, rmat2);
        Rodrigues(rmat2 * rmat1, rvec3_exp);

        tvec3_exp = rmat2 * tvec1 + tvec2;

        const double thres = 1e-5;
        if (alvision.norm(rvec3_exp, rvec3) > thres ||  alvision.norm(tvec3_exp, tvec3) > thres)
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);

        const eps = 1e-3;
        var diff = new Differential(eps, rvec1, tvec1, rvec2, tvec2);

        Mat dr3dr1, dr3dt1, dr3dr2, dr3dt2, dt3dr1, dt3dt1, dt3dr2, dt3dt2;

        composeRT(rvec1, tvec1, rvec2, tvec2, rvec3, tvec3,
            dr3dr1, dr3dt1, dr3dr2, dr3dt2, dt3dr1, dt3dt1, dt3dr2, dt3dt2);

        Mat_<double> dr3_dr1, dt3_dr1;
           diff.dRv1(dr3_dr1, dt3_dr1);

        if (alvision.norm(dr3_dr1, dr3dr1) > thres || alvision.norm(dt3_dr1, dt3dr1) > thres)
        {
            this.ts.printf( alvision.cvtest.TSConstants.LOG, "Invalid derivates by r1\n" );
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
        }

        Mat_<double> dr3_dr2, dt3_dr2;
           diff.dRv2(dr3_dr2, dt3_dr2);

        if (alvision.norm(dr3_dr2, dr3dr2) > thres || alvision.norm(dt3_dr2, dt3dr2) > thres)
        {
            this.ts.printf( alvision.cvtest.TSConstants.LOG, "Invalid derivates by r2\n" );
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
        }

        Mat_<double> dr3_dt1, dt3_dt1;
           diff.dTv1(dr3_dt1, dt3_dt1);

           if (alvision.norm(dr3_dt1, dr3dt1) > thres || alvision.norm(dt3_dt1, dt3dt1) > thres)
        {
            this.ts.printf( alvision.cvtest.TSConstants.LOG, "Invalid derivates by t1\n" );
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
        }

        Mat_<double> dr3_dt2, dt3_dt2;
           diff.dTv2(dr3_dt2, dt3_dt2);

        if (alvision.norm(dr3_dt2, dr3dt2) > thres || alvision.norm(dt3_dt2, dt3dt2) > thres)
        {
            ts.printf( alvision.cvtest.TSConstants.LOG, "Invalid derivates by t2\n" );
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
        }
    }
};

alvision.cvtest.TEST('Calib3d_ComposeRT', 'accuracy', () => { var test = new CV_composeRT_Test(); test.safe_run(); });
