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
//using namespace cv;
//using namespace std;

class CV_ConnectedComponentsTest extends alvision.cvtest.BaseTest
{
    run(int): void {
        var exp_path = this.ts.get_data_path() + "connectedcomponents/ccomp_exp.png";
        var exp = alvision.imread(exp_path, 0);
        var orig = alvision.imread(this.ts.get_data_path() + "connectedcomponents/concentric_circles.png", 0);

        if (orig.empty()) {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            return;
        }

        Mat bw = orig > 128;
        Mat labelImage;
        var nLabels = alvision.connectedComponents(bw, labelImage, 8, alvision.MatrixType.CV_32S);

        for (var r = 0; r < labelImage.rows; ++r){
            for (int c = 0; c < labelImage.cols; ++c){
                int l = labelImage.at<int>(r, c);
                var pass = l >= 0 && l <= nLabels;
                if (!pass) {
                    this.ts.set_failed_test_info(alvision.cvtest.FalureCode.FAIL_INVALID_OUTPUT);
                    return;
                }
            }
        }

        if (exp.empty() || orig.size() != exp.size()) {
            alvision.imwrite(exp_path, labelImage);
            exp = labelImage;
        }

        if (0 != alvision.cvtest.norm(labelImage > 0, exp > 0, NORM_INF))
        {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
            return;
        }
        if (nLabels != alvision.cvtest.norm(labelImage, NORM_INF) + 1)
        {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
            return;
        }
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }
};


alvision.cvtest.TEST('Imgproc_ConnectedComponents', 'regression', () => { var test = new CV_ConnectedComponentsTest(); test.safe_run(); });
