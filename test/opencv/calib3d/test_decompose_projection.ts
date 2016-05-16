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

class CV_DecomposeProjectionMatrixTest  extends alvision.cvtest.BaseTest
{
    constructor() {
        super();
        this.test_case_count = 30;
    }

    run(start_from: alvision.int): void {

        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);

        var  rng = this.ts.get_rng();
        var  progress = 0;


        for (var iter = start_from.valueOf(); iter < this.test_case_count; ++iter)
        {
            this.ts.update_context(this, iter, true);
            progress = this.update_progress(progress, iter, this.test_case_count, 0);

            // Create the original (and random) camera matrix, rotation, and translation
            alvision.Vec2d f, c;
            rng.fill(f, alvision.RNG UNIFORM, 300, 1000);
            rng.fill(c, alvision.RNG UNIFORM, 150, 600);

            var alpha = 0.01 * rng.gaussian(1).valueOf();

            alvision.Matx33d origK(f(0), alpha * f(0), c(0),
                0, f(1), c(1),
                0, 0, 1);


            var rVec = new alvision.Vecd();
            rng.fill(rVec, alvision.RNG::UNIFORM, -Math.PI, Math.PI);

            var origR = new alvision.Matxd();
            alvision.Rodrigues(rVec, origR);

            var origT = new alvision.Vecd() //3
            rng.fill(origT, alvision.RNG::NORMAL, 0, 1);


            // Compose the projection matrix
            var P = new alvision.Matxd(3, 4); //34
            alvision.hconcat(origK * origR, origK * origT, P);


            // Decompose
            alvision.Matx33d K, R;
            alvision.Vec4d homogCameraCenter;
            decomposeProjectionMatrix(P, K, R, homogCameraCenter);


            // Recover translation from the camera center
            alvision.Vec3d cameraCenter(homogCameraCenter(0), homogCameraCenter(1), homogCameraCenter(2));
            cameraCenter /= homogCameraCenter(3);

            alvision.Vec3d t = -R * cameraCenter;


            const double thresh = 1e-6;
            if (norm(origK, K, alvision.NORM_INF) > thresh) {
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                break;
            }

            if (norm(origR, R, alvision.NORM_INF) > thresh) {
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                break;
            }

            if (norm(origT, t, alvision.NORM_INF) > thresh) {
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                break;
            }

        }
    }
};



alvision.cvtest.TEST('Calib3d_DecomposeProjectionMatrix', 'accuracy', () => {
    var test = new CV_DecomposeProjectionMatrixTest();
    test.safe_run();
});
