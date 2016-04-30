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


class CV_Affine3D_EstTest// : public cvtest::BaseTest
{
    constructor(){
    }

    public run(int /* start_from */): void {

    cvtest::DefaultRngAuto dra;

    if (!test4Points())
        return;

    if (!testNPoints())
        return;

    ts ->set_failed_test_info(cvtest::TS::OK);
}


    public test4Points(): boolean {
        var aff = new alvision.Matrix(3, 4, alvision.MatrixType.CV_64F);
        //Mat aff(3, 4, CV_64F);
        alvision.randu(aff, new alvision.Scalar(1), new alvision.Scalar(3));
        //cv::randu(aff, Scalar(1), Scalar(3));

        // setting points that are no in the same line
        var fpts = new alvision.Matrix(1, 4, alvision.MatrixType.CV_32FC3);
        //Mat fpts(1, 4, CV_32FC3);
        var tpts = new alvision.Matrix(1, 4, alvision.MatrixType.CV_32FC3);
        //Mat tpts(1, 4, CV_32FC3);

        fpts.ptr<Point3f>()[0] = Point3f(rngIn(1, 2), rngIn(1, 2), rngIn(5, 6));
        fpts.ptr<Point3f>()[1] = Point3f(rngIn(3, 4), rngIn(3, 4), rngIn(5, 6));
        fpts.ptr<Point3f>()[2] = Point3f(rngIn(1, 2), rngIn(3, 4), rngIn(5, 6));
        fpts.ptr<Point3f>()[3] = Point3f(rngIn(3, 4), rngIn(1, 2), rngIn(5, 6));

        alvision.transform(fpts.ptr<Point3f>(), fpts.ptr<Point3f>() + 4, tpts.ptr<Point3f>(), (new WrapAff(aff)).get());

        var aff_est = new alvision.Matrix();
        //Mat aff_est;
        var outliers: Array<alvision.uchar> = [];
        //vector < uchar > outliers;
        alvision.estimateAffine3D(fpts, tpts, aff_est, outliers);

        var thres : alvision.double = 1e-3;
        //const double thres = 1e-3;

        if (alvision.test.norm(aff_est,aff,alvision.NormTypes.NORM_INF) > thres)
        //if (cvtest::norm(aff_est, aff, NORM_INF) > thres)
        {
            //cout << cvtest::norm(aff_est, aff, NORM_INF) << endl;
            //ts ->set_failed_test_info(cvtest::TS::FAIL_MISMATCH);
            return false;
        }
        return true;
    }
    public testNPoints(): boolean {
        var aff = new alvision.Matrix(3, 4, alvision.MatrixType.CV_64F);
        //Mat aff(3, 4, CV_64F);
        alvision.randu(aff, new alvision.Scalar(-2), new alvision.Scalar(2));
        //cv::randu(aff, Scalar(-2), Scalar(2));

        // setting points that are no in the same line

        var n: alvision.int = 100;
        //const int n = 100;
        var m: alvision.int = 3 * n.valueOf() / 5;
        //const int m = 3 * n / 5;
        var shift_outl = new alvision.Point3f(15, 15, 15);
        //const Point3f shift_outl = Point3f(15, 15, 15);
        var noise_level: alvision.float = 20;
        //const float noise_level = 20.f;

        var fpts = new alvision.Matrix(1, n.valueOf(), alvision.MatrixType.CV_32FC3);
        //Mat fpts(1, n, CV_32FC3);
        var tpts = new alvision.Matrix(1, n.valueOf(), alvision.MatrixType.CV_32FC3);
        //Mat tpts(1, n, CV_32FC3);

        alvision.randu(fpts, alvision.Scalar.All(0), alvision.Scalar.All(100);
        //randu(fpts, Scalar::all(0), Scalar::all(100));

        transform(fpts.ptr<Point3f>(), fpts.ptr<Point3f>() + n, tpts.ptr<Point3f>(), WrapAff(aff));

        /* adding noise*/
        transform(tpts.ptr<Point3f>() + m, tpts.ptr<Point3f>() + n, tpts.ptr<Point3f>() + m, bind2nd(plus<Point3f>(), shift_outl));
        transform(tpts.ptr<Point3f>() + m, tpts.ptr<Point3f>() + n, tpts.ptr<Point3f>() + m, Noise(noise_level));

        var aff_est = new alvision.Matrix();
        //Mat aff_est;
        
        var outl: Array<alvision.uchar> = [];
        //vector < uchar > outl;

        var res = alvision.estimateAffine3D(fpts, tpts, aff_est, outl);
        //int res = estimateAffine3D(fpts, tpts, aff_est, outl);

        if (!res) {
            //ts ->set_failed_test_info(cvtest::TS::FAIL_MISMATCH);
            return false;
        }

        var thres: alvision.double = 1e-4;
        //const double thres = 1e-4;

        if (alvision.test.norm(aff_est,aff, alvision.NormTypes.NORM_INF) > thres)
        //if (cvtest::norm(aff_est, aff, NORM_INF) > thres)
        {
            //cout << "aff est: " << aff_est << endl;
            //cout << "aff ref: " << aff << endl;
            //ts ->set_failed_test_info(cvtest::TS::FAIL_MISMATCH);
            return false;
        }

        var outl_good : boolean = count2
        bool outl_good = count(outl.begin(), outl.end(), 1) == m &&
            m == accumulate(outl.begin(), outl.begin() + m, 0);

        if (!outl_good) {
            ts ->set_failed_test_info(cvtest::TS::FAIL_MISMATCH);
            return false;
        }
        return true;
    }
}




function rngIn(from: alvision.float, to: alvision.float) {
    return from.valueOf() + (to.valueOf() - from.valueOf()) * (alvision.theRNG().next());
}
//float rngIn(float from, float to) { return from + (to-from) * (float)theRNG(); }


class WrapAff
{
    //F: alvision.double;

    //const double *F;
    private _aff: alvision.Matrix;
    
    constructor(aff: alvision.Matrix) {
        this._aff = aff;
    }// : F(aff.ptr<double>()) {}


    public get(p : alvision.Point3f) : alvision.Point3f
    {
        return new alvision.Point3f(
                        
                        (p.x.valueOf() * this._aff.at(0) + p.y.valueOf() * this._aff.at(1) + p.z.valueOf() *  this._aff.at(2) +  this._aff.at(3)),
                        (p.x.valueOf() * this._aff.at(4) + p.y.valueOf() * this._aff.at(5) + p.z.valueOf() *  this._aff.at(6) +  this._aff.at(7)),
                        (p.x.valueOf() * this._aff.at(8) + p.y.valueOf() * this._aff.at(9) + p.z.valueOf() *  this._aff.at(10) + this._aff.at(11))  );
    }
};



class Noise
{
    private _l: alvision.float;
    
    Noise(level: alvision.float) {
        this._l = level;
    }

    public run(p : alvision.Point3f) : alvision.Point3f
    {
        var rng = alvision.theRNG();

        //RNG& rng = theRNG();
        return new alvision.Point3f(p.x.valueOf() + this._l.valueOf() * rng.next(), p.y.valueOf() + this._l.valueOf() * rng.next(), p.z.valueOf() + this._l.valueOf() * rng.next());
        //return Point3f( p.x + l * (float)rng,  p.y + l * (float)rng,  p.z + l * (float)rng);
    }
};





tape('Calib3d_EstimateAffineTransform_accuracy', (t) => {
    var test: CV_Affine3D_EstTest = new CV_Affine3D_EstTest();
    test.run();
}); //{ CV_Affine3D_EstTest test; test.safe_run(); }
