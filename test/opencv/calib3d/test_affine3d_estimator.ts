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
//
//using namespace cv;
//using namespace std;
//
//#include < string >
//#include < iostream >
//#include < fstream >
//#include < functional >
//#include < iterator >
//#include < limits >
//#include < numeric >

class CV_Affine3D_EstTest extends alvision.cvtest.BaseTest
{
//    public:
//    CV_Affine3D_EstTest();
//    ~CV_Affine3D_EstTest();
    //protected:
    run(int /* start_from */): void {
        //alvision.cvtest.DefaultRngAuto dra;

        if (!this.test4Points())
            return;

        if (!this.testNPoints())
            return;

        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }

    test4Points(): boolean {
        var aff = new alvision.Mat(3, 4, alvision.MatrixType.CV_64F);
        alvision.randu(aff, new alvision.Scalar(1), new alvision.Scalar(3));

        // setting points that are no in the same line

        var fpts = new alvision.Mat(1, 4, alvision.MatrixType.CV_32FC3);
        var tpts = new alvision.Mat(1, 4, alvision.MatrixType.CV_32FC3);

        fpts.ptr<alvision.Point3f>("Point3f")[0] = new alvision.Point3f(rngIn(1, 2), rngIn(1, 2), rngIn(5, 6));
        fpts.ptr<alvision.Point3f>("Point3f")[1] = new alvision.Point3f(rngIn(3, 4), rngIn(3, 4), rngIn(5, 6));
        fpts.ptr<alvision.Point3f>("Point3f")[2] = new alvision.Point3f(rngIn(1, 2), rngIn(3, 4), rngIn(5, 6));
        fpts.ptr<alvision.Point3f>("Point3f")[3] = new alvision.Point3f(rngIn(3, 4), rngIn(1, 2), rngIn(5, 6));

        
        alvision.transformOp<alvision.Point3f>(fpts.ptr<alvision.Point3f>("Point3f"), tpts.ptr<alvision.Point3f>("Point3f"), new WrapAff(aff));
        //alvision.transform(fpts.ptr<alvision.Point3f>("Point3f"), fpts.ptr<alvision.Point3f>("Point3f") + 4, tpts.ptr<alvision.Point3f>("Point3f"), WrapAff(aff));

        var aff_est = new alvision.Mat();
        var outliers = new Array<alvision.uchar>();
        alvision.estimateAffine3D(fpts, tpts, aff_est, outliers);

        const thres = 1e-3;
        if (alvision.cvtest.norm(aff_est, aff, alvision.NormTypes.NORM_INF) > thres) {
            //cout << alvision.cvtest.norm(aff_est, aff, NORM_INF) << endl;
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
            return false;
        }
        return true;
    }
    testNPoints() : boolean
    {
        var aff = new alvision.Mat(3, 4,alvision.MatrixType. CV_64F);
        alvision.randu(aff, new alvision.Scalar(-2), new alvision.Scalar(2));

        // setting points that are no in the same line

        const  n = 100;
        const  m = 3 * n / 5;
        const shift_outl = new alvision.Point3f(15, 15, 15);
        const  noise_level = 20.;

        var fpts = new alvision.Mat(1, n,alvision.MatrixType. CV_32FC3);
        var tpts = new alvision.Mat(1, n,alvision.MatrixType. CV_32FC3);

        alvision.randu(fpts, alvision.Scalar.all(0), alvision.Scalar.all(100));
        alvision.transformOp<alvision.Point3f>(fpts.ptr<alvision.Point3f>("Point3f"), tpts.ptr<alvision.Point3f>("Point3f"), new WrapAff(aff));
        //alvision.transform(fpts.ptr<alvision.Point3f>("Point3f"), fpts.ptr<alvision.Point3f>("Point3f") + n, tpts.ptr<alvision.Point3f>("Point3f"), WrapAff(aff));

        /* adding noise*/

        alvision.transformOp<alvision.Point3f>(tpts.ptr<alvision.Point3f>("Point3f").slice(m, n), tpts.ptr<alvision.Point3f>("Point3f").slice(m), new Plus(shift_outl));
        //alvision.transform(tpts.ptr<alvision.Point3f>("Point3f") + m, tpts.ptr<alvision.Point3f>("Point3f") + n, tpts.ptr<alvision.Point3f>("Point3f") + m, bind2nd(plus<Point3f>(), shift_outl));

        alvision.transformOp<alvision.Point3f>(tpts.ptr<alvision.Point3f>("Point3f").slice(m, n), tpts.ptr<alvision.Point3f>("Point3f").slice(m), new Noise(noise_level));
        //alvision.transform(tpts.ptr<alvision.Point3f>("Point3f") + m, tpts.ptr<alvision.Point3f>("Point3f") + n, tpts.ptr<alvision.Point3f>("Point3f") + m, Noise(noise_level));

        var aff_est = new alvision.Mat();
        var outl = new Array<alvision.uchar>();
        var res = alvision.estimateAffine3D(fpts, tpts, aff_est, outl);

        if (!res) {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
            return false;
        }

        const thres = 1e-4;
        if (alvision.cvtest.norm(aff_est, aff,alvision.NormTypes. NORM_INF) > thres)
        {
            console.log( "aff est: " + aff_est );
            console.log( "aff ref: " + aff     );
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
            return false;
        }

        //var outl_good = alvision.count(outl, 1) == m &&
        //    m == alvision.accumulate(outl.begin(), outl.begin() + m, 0);
        var outl_good = alvision.countOp(outl, 1) == m &&
            m == alvision.accumulateOp(outl, 0);


        if (!outl_good) {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
            return false;
        }
        return true;
    }
};




function rngIn(from: alvision.float, to: alvision.float ) : alvision.float { 
    return from.valueOf() + (to.valueOf() - from.valueOf()) * alvision.theRNG().float().valueOf();
}


class WrapAff implements alvision.ItransformOp<alvision.Point3f>
{
    protected F: Array<alvision.double>;

    constructor(aff: alvision.Mat) {
        this.F = aff.ptr<alvision.double>("double");
    }

    run(p: alvision.Point3f): alvision.Point3f {
        return new alvision.Point3f((p.x.valueOf() * this.F[0].valueOf() + p.y.valueOf() * this.F[1].valueOf() + p.z.valueOf() * this.F[2].valueOf() + this.F[3].valueOf()),
                (p.x.valueOf() * this.F[4].valueOf() + p.y.valueOf() * this.F[5].valueOf() + p.z.valueOf() * this.F[6].valueOf() + this.F[7].valueOf()),
                (p.x.valueOf() * this.F[8].valueOf() + p.y.valueOf() * this.F[9].valueOf() + p.z.valueOf() * this.F[10].valueOf() + this.F[11].valueOf()));
    }


}

class Plus implements alvision.ItransformOp<alvision.Point3f>
{
    protected F: alvision.Point3f;

    constructor(aff: alvision.Point3f) {
        this.F = aff;
    }

    run(p: alvision.Point3f): alvision.Point3f {
        return new alvision.Point3f(p.x.valueOf() + this.F.x.valueOf(), p.y.valueOf() + this.F.y.valueOf(), p.z.valueOf() + this.F.z.valueOf());
    }
}


class Noise implements alvision.ItransformOp<alvision.Point3f>
{
    protected l: alvision.float;
    constructor(level: alvision.float) {
        this.l = (level);
    }

    run(p: alvision.Point3f): alvision.Point3f {
        var rng = alvision.theRNG();
        return new alvision.Point3f(
            p.x.valueOf() + this.l.valueOf() * rng.float().valueOf(),
            p.y.valueOf() + this.l.valueOf() * rng.float().valueOf(),
            p.z.valueOf() + this.l.valueOf() * rng.float().valueOf());
    }
};






alvision.cvtest.TEST('Calib3d_EstimateAffineTransform', 'accuracy', () => { var test = new CV_Affine3D_EstTest(); test.safe_run(); });
