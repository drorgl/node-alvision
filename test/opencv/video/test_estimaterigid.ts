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
//#include <string>
//#include <iostream>
//#include <fstream>
//#include <iterator>
//#include <limits>
//#include <numeric>
//
//using namespace cv;
//using namespace std;

class CV_RigidTransform_Test extends alvision.cvtest.BaseTest {
    run(start_from: alvision.int): void {
        alvision.cvtest.DefaultRngAuto dra;

        if (!this.testNPoints(start_from))
            return;

        if (!this.testImage())
            return;

        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }

    testNPoints(from: alvision.int): boolean {
        var rng = this.ts.get_rng();

        var progress : alvision.int = 0;
        var ntests = 10000;

        for (var k = from; k < ntests; k++) {
            this.ts.update_context(this, k, true);
            progress = this.update_progress(progress, k, ntests, 0);

            var aff = new alvision.Mat(2, 3,alvision.MatrixType. CV_64F);
            rng.fill(aff, RNG::UNIFORM, new alvision.Scalar(-2), new alvision.Scalar(2));

            var n = (unsigned)rng % 100 + 10;

            var fpts = new alvision.Mat(1, n,alvision.MatrixType. CV_32FC2);
            var tpts = new alvision.Mat(1, n,alvision.MatrixType. CV_32FC2);

            rng.fill(fpts, RNG::UNIFORM, new alvision.Scalar(0, 0), new alvision.Scalar(10, 10));
            alvision.transform(fpts.ptr<alvision.Point2f>("Point2f"), fpts.ptr<alvision.Point2f>("Point2f") + n, tpts.ptr<alvision.Point2f>("Point2f"), WrapAff2D(aff));

            var noise = new alvision.Mat (1, n,alvision.MatrixType. CV_32FC2);
            rng.fill(noise, RNG::NORMAL, alvision.Scalar.all(0), alvision.Scalar.all(0.001 * (n <= 7 ? 0 : n <= 30 ? 1 : 10)));
            tpts += noise;

            var aff_est = alvision.estimateRigidTransform(fpts, tpts, true);

            var thres = 0.1 * alvision.cvtest.norm(aff, alvision.NormTypes.NORM_L2);
            var d = alvision.cvtest.norm(aff_est, aff, alvision.NormTypes.NORM_L2);
            if (d > thres) {
                var dB= 0, nB = 0;
                if (n <= 4) {
                    var A = fpts.reshape(1, 3);
                    var B = A - alvision.repeat(A.row(0), 3, 1), Bt = B.t();
                    B = Bt * B;
                    dB = alvision.determinant(B);
                    nB = alvision.cvtest.norm(B, alvision.NormTypes.NORM_L2);
                    if (Math.abs(dB) < 0.01 * nB)
                        continue;
                }
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Threshold = %f, norm of difference = %f", thres, d);
                return false;
            }
        }
        return true;
    }
    testImage(): boolean {
        Mat img;
        Mat testImg = imread(this.ts.get_data_path() + "shared/graffiti.png", 1);
        if (testImg.empty()) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "test image can not be read");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            return false;
        }
        pyrDown(testImg, img);

        Mat aff = alvision.getRotationMatrix2D(Point(img.cols / 2, img.rows / 2), 1, 0.99);
        aff.ptr<double>()[2] += 3;
        aff.ptr<double>()[5] += 3;

        Mat rotated;
        warpAffine(img, rotated, aff, img.size());

        Mat aff_est = estimateRigidTransform(img, rotated, true);

        const double thres = 0.033;
        if (alvision.cvtest.norm(aff_est, aff, NORM_INF) > thres) {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Threshold = %f, norm of difference = %f", thres,
                alvision.cvtest.norm(aff_est, aff, NORM_INF));
            return false;
        }

        return true;
    }
}

class WrapAff2D
{
    const double *F;
    WrapAff2D(const Mat& aff) : F(aff.ptr<double>()) {}
    Point2f operator()(const Point2f& p)
    {
        return Point2f( (float)(p.x * F[0] + p.y * F[1] + F[2]),
                        (float)(p.x * F[3] + p.y * F[4] + F[5]) );
    }
};



alvision.cvtest.TEST('Video_RigidFlow', 'accuracy', () => { var test = new CV_RigidTransform_Test(); test.safe_run(); });
