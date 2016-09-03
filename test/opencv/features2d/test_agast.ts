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


//#include "test_precomp.hpp"
//
//using namespace std;
//using namespace cv;

class CV_AgastTest extends alvision.cvtest.BaseTest
{
    run(x : alvision.int): void
{
        for (var type = 0; type <= 2; ++type) {
        
            var image1 = alvision.imread(this.ts.get_data_path() + "inpaint/orig.png");

            var image2 = alvision.imread(this.ts.get_data_path() + "cameracalibration/chess9.png");
            var xml = this.ts.get_data_path() + util.format
            var xml = this.ts.get_data_path() + util.format("agast/result%d.xml", type);

        if (image1.empty() || image2.empty()) {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            return;
        }
        
        var gray1 = new alvision.Mat();
        var gray2 = new alvision.Mat();
        //Mat gray1, gray2;
        alvision.cvtColor(image1, gray1, alvision.ColorConversionCodes.COLOR_BGR2GRAY);
        alvision.cvtColor(image2, gray2, alvision.ColorConversionCodes.COLOR_BGR2GRAY);

        var keypoints1 : Array<alvision.KeyPoint>;
        var keypoints2: Array<alvision.KeyPoint>;

        alvision.AGAST(gray1, (kp) => { keypoints1 = kp;}, 30, true, type);
        alvision.AGAST(gray2, (kp) => { keypoints2 }, (type > 0 ? 30 : 20), true, type);

        for (var i = 0; i < keypoints1.length; ++i)
        {
                var kp = keypoints1[i];
                
            alvision.circle(image1, kp.pt, Math.round(kp.size.valueOf() / 2), new alvision.Scalar(255, 0, 0));
        }

        for (var i = 0; i < keypoints2.length; ++i)
        {
            var kp = keypoints2[i];
            alvision.circle(image2, kp.pt, Math.round(kp.size.valueOf() / 2), new alvision.Scalar(255, 0, 0));
        }

          

            //TODO: how to define a mat of keypoints?...
        var kps1 = new alvision.Mat(1, (keypoints1.length * alvision.KeyPoint.sizeof().valueOf()), alvision.MatrixType.CV_8U, keypoints1);
        var kps2 = new alvision.Mat(1, (keypoints2.length * alvision.KeyPoint.sizeof().valueOf()), alvision.MatrixType.CV_8U, keypoints2);

        var fs = new alvision.FileStorage(xml, alvision.FileStorageMode.READ);

        //FileStorage fs(xml, alvision.FileStorageMode.READ);
        if (!fs.isOpened()) {
            fs.open(xml, alvision.FileStorageMode.WRITE);
            if (!fs.isOpened()) {
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
                return;
            }

            fs.write("exp_kps1", kps1);
            fs.write("exp_kps2", kps2);
            fs.release();
            fs.open(xml, alvision.FileStorageMode.READ);
            if (!fs.isOpened()) {
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
                return;
            }
        }
        var exp_kps1 = new alvision.Mat();
        var exp_kps2 = new alvision.Mat();
        //Mat exp_kps1, exp_kps2;


        exp_kps1 = fs.nodes["exp_kps1"].readMat(new alvision.Mat());
        exp_kps2 = fs.nodes["exp_kps2"].readMat(new alvision.Mat());
        fs.release();

        if (exp_kps1.size != kps1.size || 0 != alvision.cvtest.norm(exp_kps1, kps1,alvision.NormTypes. NORM_L2) ||
            exp_kps2.size != kps2.size || 0 != alvision.cvtest.norm(exp_kps2, kps2,alvision.NormTypes. NORM_L2))
        {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
            return;
        }

        /*alvision.namedWindow("Img1"); alvision.imshow("Img1", image1);
        alvision.namedWindow("Img2"); alvision.imshow("Img2", image2);
        alvision.waitKey(0);*/
    }

        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
}
};



alvision.cvtest.TEST('Features2d_AGAST', 'regression', () => { var test = new CV_AgastTest(); test.safe_run(); });
