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
//#include <string>
//
//using namespace std;
//using namespace cv;

class CV_InpaintTest extends alvision.cvtest.BaseTest
{
    run(iii : alvision.int): void {
        var folder = this.ts.get_data_path() + "inpaint/";
        var orig = alvision.imread(folder + "orig.png");
        var exp1 = alvision.imread(folder + "exp1.png");
        var exp2 = alvision.imread(folder + "exp2.png");
        var mask = alvision.imread(folder + "mask.png");

        if (orig.empty() || exp1.empty() || exp2.empty() || mask.empty()) {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            return;
        }

        var inv_mask = new alvision.Mat();
        mask.convertTo(inv_mask,alvision.MatrixType.CV_8UC3, -1.0, 255.0);

        var mask1ch = new alvision.Mat();
        alvision.cvtColor(mask, mask1ch,alvision.ColorConversionCodes. COLOR_BGR2GRAY);

        var test = orig.clone();
        test.setTo(new alvision.Scalar.all(255), mask1ch);

        Mat res1, res2;
        alvision.inpaint(test, mask1ch, res1, 5, INPAINT_NS);
        alvision.inpaint(test, mask1ch, res2, 5, INPAINT_TELEA);

        Mat diff1, diff2;
        alvision.absdiff(orig, res1, diff1);
        alvision.absdiff(orig, res2, diff2);

        var n1 = alvision.cvtest.norm(diff1.reshape(1), NORM_INF, inv_mask.reshape(1));
        var n2 = alvision.cvtest.norm(diff2.reshape(1), NORM_INF, inv_mask.reshape(1));

        if (n1 != 0 || n2 != 0) {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
            return;
        }

        alvision.absdiff(exp1, res1, diff1);
        alvision.absdiff(exp2, res2, diff2);

        n1 = alvision.cvtest.norm(diff1.reshape(1), NORM_INF, mask.reshape(1));
        n2 = alvision.cvtest.norm(diff2.reshape(1), NORM_INF, mask.reshape(1));

        const jpeg_thres = 3;
        if (n1 > jpeg_thres || n2 > jpeg_thres) {
            ts ->set_failed_test_info(cvtest::TS::FAIL_BAD_ACCURACY);
            return;
        }

        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }
};


alvision.cvtest.TEST('Photo_Inpaint', 'regression', () => { var test = new CV_InpaintTest(); test.safe_run(); });
