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
        this.ev = new alvision.Matd (3, 1)
    }

    dRv1(dr3_dr1: alvision.Mat_<alvision.double>, dt3_dr1: alvision.Mat_<alvision.double>) : void
    {
        dr3_dr1.create(3, 3);     dt3_dr1.create(3, 3);

        for(var i = 0; i < 3; ++i)
        {
            this.ev.setTo(new alvision.Scalar(0));    this.ev.at<alvision.double>("double",i, 0).set( this.eps);

            alvision.composeRT( this.rv1.op_Addition( this.ev), this.tv1, this.rv2, this.tv2, this.rv3_p, this.tv3_p);
            alvision.composeRT( this.rv1.op_Substraction( this.ev), this.tv1, this.rv2, this.tv2, this.rv3_m, this.tv3_m);

            dr3_dr1.col(i).setTo(alvision.MatExpr.op_Substraction(this.rv3_p, this.rv3_m));
            dt3_dr1.col(i).setTo(alvision.MatExpr.op_Substraction(this.tv3_p, this.tv3_m));
        }
        dr3_dr1.op_Division( 2 * this.eps.valueOf()).copyTo(dr3_dr1);       dt3_dr1.op_Division(2 * this.eps.valueOf()).copyTo(dt3_dr1);
    }

    dRv2(dr3_dr2 : alvision.Mat_ < alvision.double >, dt3_dr2 : alvision.Mat_<alvision.double>) : void
    {
        dr3_dr2.create(3, 3);     dt3_dr2.create(3, 3);

        for(var i = 0; i < 3; ++i)
        {
            this.ev.setTo(new alvision.Scalar(0));    this.ev.at<alvision.double>("double", i, 0).set( this.eps);

            alvision.composeRT( this.rv1, this.tv1, this.rv2.op_Addition( this.ev), this.tv2, this.rv3_p, this.tv3_p);
            alvision.composeRT( this.rv1, this.tv1, this.rv2.op_Substraction(this.ev), this.tv2, this.rv3_m, this.tv3_m);

            dr3_dr2.col(i).setTo( alvision.MatExpr.op_Substraction(this.rv3_p , this.rv3_m));
            dt3_dr2.col(i).setTo( alvision.MatExpr.op_Substraction(this.tv3_p , this.tv3_m));
        }
        dr3_dr2.op_Division(2 * this.eps.valueOf()).copyTo(dr3_dr2); dt3_dr2.op_Division( 2 * this.eps.valueOf()).copyTo(dt3_dr2);
    }

    dTv1(drt3_dt1: alvision.Mat_<alvision.double>, dt3_dt1: alvision.Mat_<alvision.double>) {
        drt3_dt1.create(3, 3); dt3_dt1.create(3, 3);

        for (var i = 0; i < 3; ++i) {
            this.ev.setTo(new alvision.Scalar(0)); this.ev.at<alvision.double>("double", i, 0).set(this.eps);

            alvision.composeRT(this.rv1, this.tv1.op_Addition(this.ev), this.rv2, this.tv2, this.rv3_p, this.tv3_p);
            alvision.composeRT(this.rv1, this.tv1.op_Substraction(this.ev), this.rv2, this.tv2, this.rv3_m, this.tv3_m);

            drt3_dt1.col(i).setTo(alvision.MatExpr.op_Substraction(this.rv3_p, this.rv3_m));
            dt3_dt1.col(i).setTo(alvision.MatExpr.op_Substraction(this.tv3_p, this.tv3_m));
        }
        drt3_dt1.op_Division(2 * this.eps.valueOf()).copyTo(drt3_dt1); dt3_dt1.op_Division(2 * this.eps.valueOf()).copyTo(dt3_dt1);
    }

    dTv2(dr3_dt2: alvision.Mat_<alvision.double>, dt3_dt2 : alvision.Mat_<alvision.double>) : void
    {
        dr3_dt2.create(3, 3);     dt3_dt2.create(3, 3);

        for(var i = 0; i < 3; ++i)
        {
            this.ev.setTo(new alvision.Scalar(0));    this.ev.at<alvision.double>("double", i, 0).set(this.eps);

            alvision.composeRT( this.rv1, this.tv1, this.rv2, this.tv2.op_Addition( this.ev), this.rv3_p, this.tv3_p);
            alvision.composeRT( this.rv1, this.tv1, this.rv2, this.tv2.op_Substraction( this.ev), this.rv3_m, this.tv3_m);

            dr3_dt2.col(i).setTo( alvision.MatExpr.op_Substraction(this.rv3_p , this.rv3_m));
            dt3_dt2.col(i).setTo( alvision.MatExpr.op_Substraction(this.tv3_p , this.tv3_m));
        }
        dr3_dt2.op_Division( 2 * this.eps.valueOf()).copyTo(dr3_dt2);       dt3_dt2.op_Division( 2 * this.eps.valueOf()).copyTo(dt3_dt2);
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

class CV_composeRT_Test extends alvision.cvtest.BaseTest {
    run(iii: alvision.int): void {
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);

        var rvec1 = new alvision.Matd(3, 1);
        var tvec1 = new alvision.Matd(3, 1);
        var rvec2 = new alvision.Matd(3, 1);
        var tvec2 = new alvision.Matd(3, 1);

        alvision.randu(rvec1, new alvision.Scalar(0), new alvision.Scalar(6.29));
        alvision.randu(rvec2, new alvision.Scalar(0), new alvision.Scalar(6.29));

        alvision.randu(tvec1, new alvision.Scalar(-2), new alvision.Scalar(2));
        alvision.randu(tvec2, new alvision.Scalar(-2), new alvision.Scalar(2));

        var rvec3 = new alvision.Mat();
        var tvec3 = new alvision.Mat();
        alvision.composeRT(rvec1, tvec1, rvec2, tvec2, rvec3, tvec3);

        var rvec3_exp = new alvision.Mat();
        var tvec3_exp = new alvision.Mat();

        var rmat1 = new alvision.Mat();
        var rmat2 = new alvision.Mat();
        alvision.Rodrigues(rvec1, rmat1);
        alvision.Rodrigues(rvec2, rmat2);
        alvision.Rodrigues(alvision.MatExpr.op_Multiplication(rmat2 , rmat1).toMat(), rvec3_exp);

        tvec3_exp = alvision.MatExpr.op_Multiplication(rmat2 , tvec1).op_Addition( tvec2).toMat();

        const thres = 1e-5;
        if (alvision.norm(rvec3_exp, rvec3) > thres || alvision.norm(tvec3_exp, tvec3) > thres)
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);

        const eps = 1e-3;
        var diff = new Differential(eps, rvec1, tvec1, rvec2, tvec2);

        var dr3dr1 = new alvision.Mat();
        var dr3dt1 = new alvision.Mat();
        var dr3dr2 = new alvision.Mat();
        var dr3dt2 = new alvision.Mat();
        var dt3dr1 = new alvision.Mat();
        var dt3dt1 = new alvision.Mat();
        var dt3dr2 = new alvision.Mat();
        var dt3dt2 = new alvision.Mat();

        alvision.composeRT(rvec1, tvec1, rvec2, tvec2, rvec3, tvec3,
            dr3dr1, dr3dt1, dr3dr2, dr3dt2, dt3dr1, dt3dt1, dt3dr2, dt3dt2);

        var dr3_dr1 = new alvision.Matd();
        var dt3_dr1 = new alvision.Matd();
        diff.dRv1(dr3_dr1, dt3_dr1);

        if (alvision.norm(dr3_dr1, dr3dr1) > thres || alvision.norm(dt3_dr1, dt3dr1) > thres) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Invalid derivates by r1\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
        }

        var dr3_dr2 = new alvision.Matd();
        var dt3_dr2 = new alvision.Matd();
        diff.dRv2(dr3_dr2, dt3_dr2);

        if (alvision.norm(dr3_dr2, dr3dr2) > thres || alvision.norm(dt3_dr2, dt3dr2) > thres) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Invalid derivates by r2\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
        }

        var dr3_dt1 = new alvision.Matd();
        var dt3_dt1 = new alvision.Matd();
        diff.dTv1(dr3_dt1, dt3_dt1);

        if (alvision.norm(dr3_dt1, dr3dt1) > thres || alvision.norm(dt3_dt1, dt3dt1) > thres) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Invalid derivates by t1\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
        }

        var dr3_dt2 = new alvision.Matd();
        var dt3_dt2 = new alvision.Matd();
        diff.dTv2(dr3_dt2, dt3_dt2);

        if (alvision.norm(dr3_dt2, dr3dt2) > thres || alvision.norm(dt3_dt2, dt3dt2) > thres) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Invalid derivates by t2\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
        }
    }
}

alvision.cvtest.TEST('Calib3d_ComposeRT', 'accuracy', () => { var test = new CV_composeRT_Test(); test.safe_run(); });
