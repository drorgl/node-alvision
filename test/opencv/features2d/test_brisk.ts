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
//using namespace std;
//using namespace cv;

class CV_BRISKTest extends alvision.cvtest.BaseTest
{
    run(ii : alvision.int): void {
        var image1 = alvision.imread(this.ts.get_data_path() + "inpaint/orig.png");
        var image2 = alvision.imread(this.ts.get_data_path() + "cameracalibration/chess9.png");

        if (image1 == null || image2 == null) {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            return;
        }

        var gray1 = new alvision.Mat()
        var gray2 = new alvision.Mat();
        
        alvision.cvtColor(image1, gray1,alvision.ColorConversionCodes.COLOR_BGR2GRAY);
        alvision.cvtColor(image2, gray2,alvision.ColorConversionCodes.COLOR_BGR2GRAY);

        //Ptr < FeatureDetector > detector = BRISK::create();
        var detector = alvision.BRISK.create();

        var keypoints1 = new Array<alvision.KeyPoint>();
        var keypoints2 = new Array<alvision.KeyPoint>();

        detector.detect(image1, (kp) => { keypoints1 = kp;});
        detector.detect(image2, (kp) => { keypoints2 = kp; });

        for (var i = 0; i < keypoints1.length; ++i)
        {
            var kp = keypoints1[i];
            alvision.ASSERT_NE(kp.angle, -1);
        }

        for (var i = 0; i < keypoints2.length; ++i)
        {
            var kp = keypoints2[i];
            alvision.ASSERT_NE(kp.angle, -1);
        }
    }
};


alvision.cvtest.TEST('Features2d_BRISK', 'regression', () => { var test = new CV_BRISKTest(); test.safe_run(); });
