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

namespace cvtest
{

/// phase correlation
class CV_PhaseCorrelatorTest extends alvision.cvtest.ArrayTest
{
    run(int): void {
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);

        var r1 =alvision.Mat.from( alvision.Mat.ones(new alvision.Size(129, 128), alvision.MatrixType.CV_64F));
        var r2 =alvision.Mat.from( alvision.Mat.ones(new alvision.Size(129, 128), alvision.MatrixType.CV_64F));

        var expectedShiftX = -10.0;
        var expectedShiftY = -20.0;

        // draw 10x10 rectangles @ (100, 100) and (90, 80) should see ~(-10, -20) shift here...
        alvision.rectangle(r1, new alvision.Point(100, 100), new alvision.Point(110, 110), new alvision.Scalar(0, 0, 0),alvision.CV_FILLED);
        alvision.rectangle(r2, new alvision.Point(90, 80),   new alvision.Point(100, 90),  new alvision.Scalar(0, 0, 0),alvision.CV_FILLED);

        var hann = new alvision.Mat();
        alvision.createHanningWindow(hann, r1.size(), alvision.MatrixType.CV_64F);
        var phaseShift = alvision.phaseCorrelate(r1, r2, hann);

        // test accuracy should be less than 1 pixel...
        if ((expectedShiftX - phaseShift.x.valueOf()) >= 1 || (expectedShiftY - phaseShift.y.valueOf()) >= 1) {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
        }
    }
};


alvision.cvtest.TEST('Imgproc_PhaseCorrelatorTest', 'accuracy',()=> { var test = new CV_PhaseCorrelatorTest(); test.safe_run(); });

}
