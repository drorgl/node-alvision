/*M///////////////////////////////////////////////////////////////////////////////////////
//
//  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
//
//  By downloading, copying, installing or using the software you agree to this license.
//  If you do not agree to this license, do not download, install,
//  copy or use the software.
//
//
//                        Intel License Agreement
//                For Open Source Computer Vision Library
//
// Copyright (C) 2000, Intel Corporation, all rights reserved.
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
//   * The name of Intel Corporation may not be used to endorse or promote products
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
//#include "opencv2/highgui.hpp"
//#include "opencv2/core/core_c.h"
//
//using namespace std;
//using namespace cv;

const FEATURES2D_DIR = "features2d";
const IMAGE_FILENAME = "tsukuba.png";

/****************************************************************************************\
*                                     Test for KeyPoint                                  *
\****************************************************************************************/

class CV_FeatureDetectorKeypointsTest  extends alvision.cvtest.BaseTest
{
    constructor(_detector: alvision.FeatureDetector) {
        super();
        this.detector = (_detector);
    }

    public run(iii : alvision.int) : void
    {
        alvision.CV_Assert(()=>this.detector != null);
        var imgFilename = this.ts.get_data_path() + FEATURES2D_DIR + "/" + IMAGE_FILENAME;

        // Read the test image.
        var image = alvision.imread(imgFilename);
        if(image.empty())
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Image %s can not be read.\n", imgFilename);
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            return;
        }

        var keypoints = new Array<alvision.KeyPoint>();
        this.detector.detect(image, (kp) => { keypoints = kp; });

        if(keypoints.length == 0)
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Detector can't find keypoints in image.\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
            return;
        }

        var r = new alvision.Rect (0, 0, image.cols(), image.rows());
        for(var i = 0; i < keypoints.length; i++)
        {
            const  kp = keypoints[i];

            if(!r.contains(kp.pt))
            {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "KeyPoint::pt is out of image (x=%f, y=%f).\n", kp.pt.x, kp.pt.y);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                return;
            }

            if(kp.size <= 0.)
            {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "KeyPoint::size is not positive (%f).\n", kp.size);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                return;
            }

            if((kp.angle < 0. && kp.angle != -1.) || kp.angle >= 360.)
            {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "KeyPoint::angle is out of range [0, 360). It's %f.\n", kp.angle);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                return;
            }
        }
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }

    protected detector: alvision.FeatureDetector;
};


// Registration of tests

alvision.cvtest.TEST('Features2d_Detector_Keypoints_BRISK', 'validation', () => {
    var test = new CV_FeatureDetectorKeypointsTest (alvision.BRISK.create());
    test.safe_run();
});

alvision.cvtest.TEST('Features2d_Detector_Keypoints_FAST', 'validation', () => {
    var test = new CV_FeatureDetectorKeypointsTest(alvision.FastFeatureDetector.create());
    test.safe_run();
});

alvision.cvtest.TEST('Features2d_Detector_Keypoints_AGAST', 'validation', () => {
    var test = new CV_FeatureDetectorKeypointsTest(alvision.AgastFeatureDetector.create());
    test.safe_run();
});

alvision.cvtest.TEST('Features2d_Detector_Keypoints_HARRIS', 'validation', () => {

    var test = new CV_FeatureDetectorKeypointsTest(alvision.GFTTDetector.create(1000, 0.01, 1, 3, true, 0.04));
    test.safe_run();
});

alvision.cvtest.TEST('Features2d_Detector_Keypoints_GFTT', 'validation', () => {
    var gftt = alvision.GFTTDetector.create();
    gftt.setHarrisDetector(true);
    var test = new CV_FeatureDetectorKeypointsTest (gftt);
    test.safe_run();
});

alvision.cvtest.TEST('Features2d_Detector_Keypoints_MSER', 'validation', () => {
    var test = new CV_FeatureDetectorKeypointsTest(alvision.MSER.create());
    test.safe_run();
});

alvision.cvtest.TEST('Features2d_Detector_Keypoints_ORB', 'validation', () => {
    var test = new CV_FeatureDetectorKeypointsTest (alvision.ORB.create());
    test.safe_run();
});

alvision.cvtest.TEST('Features2d_Detector_Keypoints_KAZE', 'validation', () => {
    var test = new CV_FeatureDetectorKeypointsTest (alvision.KAZE.create());
    test.safe_run();
});

alvision.cvtest.TEST('Features2d_Detector_Keypoints_AKAZE', 'validation', () => {
    var test_kaze = new CV_FeatureDetectorKeypointsTest(alvision.AKAZE.create(alvision.DescriptorType.DESCRIPTOR_KAZE));
    test_kaze.safe_run();

    var test_mldb = new CV_FeatureDetectorKeypointsTest(alvision.AKAZE.create(alvision.DescriptorType.DESCRIPTOR_MLDB));
    test_mldb.safe_run();
});
