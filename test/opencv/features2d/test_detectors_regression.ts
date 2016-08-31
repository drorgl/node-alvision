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
//
//using namespace std;
//using namespace cv;

const  FEATURES2D_DIR = "features2d";
const  IMAGE_FILENAME = "tsukuba.png";
const  DETECTOR_DIR = FEATURES2D_DIR + "/feature_detectors";

/****************************************************************************************\
*            Regression tests for feature detectors comparing keypoints.                 *
\****************************************************************************************/

class CV_FeatureDetectorTest  extends alvision.cvtest.BaseTest
{
    constructor(_name: string, _fdetector: alvision.FeatureDetector) {
        super();
        this.name = (_name);
        this.fdetector = (_fdetector);
    }

    isSimilarKeypoints(p1: alvision.KeyPoint, p2: alvision.KeyPoint): boolean {
        const  maxPtDif = 1.;
        const  maxSizeDif = 1.;
        const  maxAngleDif = 2.;
        const  maxResponseDif = 0.1;

        var dist = alvision.Point.norm(p1.pt.op_Substraction( p2.pt));
        return (dist < maxPtDif &&
            Math.abs(p1.size.valueOf() - p2.size.valueOf()) < maxSizeDif &&
            Math.abs(p1.angle.valueOf() - p2.angle.valueOf()) < maxAngleDif &&
            Math.abs(p1.response.valueOf() - p2.response.valueOf()) < maxResponseDif &&
            p1.octave == p2.octave &&
            p1.class_id == p2.class_id);
    }
    compareKeypointSets(validKeypoints: Array<alvision.KeyPoint>, calcKeypoints: Array<alvision.KeyPoint>): void{
        const  maxCountRatioDif = 0.01;

        // Compare counts of validation and calculated keypoints.
        var countRatio = validKeypoints.length / calcKeypoints.length;
        if (countRatio < 1 - maxCountRatioDif || countRatio > 1. + maxCountRatioDif )
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Bad keypoints count ratio (validCount = %d, calcCount = %d).\n",
                validKeypoints.length, calcKeypoints.length);
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
            return;
        }

        var  progress = 0, progressCount = (validKeypoints.length * calcKeypoints.length);
        var  badPointCount = 0, commonPointCount = Math.max(validKeypoints.length, calcKeypoints.length);
        for (var v = 0; v < validKeypoints.length; v++ )
        {
            var nearestIdx = -1;
            var minDist = alvision.FLT_MAX;

            for (var c = 0; c < calcKeypoints.length; c++ )
            {
                progress = this.update_progress(progress, (v * calcKeypoints.length + c), progressCount, 0).valueOf();
                var curDist = alvision.Point.norm(calcKeypoints[c].pt.op_Substraction( validKeypoints[v].pt)).valueOf();
                if (curDist < minDist) {
                    minDist = curDist;
                    nearestIdx = c;
                }
            }

            alvision.assert(()=>minDist >= 0);
            if (!this.isSimilarKeypoints(validKeypoints[v], calcKeypoints[nearestIdx]))
                badPointCount++;
        }
        this.ts.printf(alvision.cvtest.TSConstants.LOG, "badPointCount = %d; validPointCount = %d; calcPointCount = %d\n",
            badPointCount, validKeypoints.length, calcKeypoints.length);
        if (badPointCount > 0.9 * commonPointCount) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, " - Bad accuracy!\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
            return;
        }
        this.ts.printf(alvision.cvtest.TSConstants.LOG, " - OK\n");
    }

    emptyDataTest(): void {
        // One image.
        var image = new alvision.Mat();
        var keypoints = new Array<alvision.KeyPoint>();
        try {
            this.fdetector.detect(image, (kp) => { keypoints = kp; });
        }
        catch (e) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "detect() on empty image must not generate exception (1).\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
        }

        if (!keypoints.length) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "detect() on empty image must return empty keypoints vector (1).\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
            return;
        }

        // Several images.
        var images = new Array<alvision.Mat>();
        var keypointCollection = new Array<Array<alvision.KeyPoint>>();
        try {
            this.fdetector.detect(images, keypointCollection);
        }
        catch (e) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "detect() on empty image vector must not generate exception (2).\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
        }
    }
    regressionTest(): void {
        alvision.assert(()=>!this.fdetector.empty());
        var imgFilename = this.ts.get_data_path() + FEATURES2D_DIR + "/" + IMAGE_FILENAME;
        var resFilename = this.ts.get_data_path() + DETECTOR_DIR + "/" + (name) + ".xml.gz";

        // Read the test image.
        var image = alvision.imread(imgFilename);
        if (image.empty()) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Image %s can not be read.\n", imgFilename);
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            return;
        }

        var fs = new alvision.FileStorage (resFilename, alvision.FileStorageMode.READ);

        // Compute keypoints.
        var calcKeypoints = new Array<alvision.KeyPoint>();
        this.fdetector.detect(image, (kp) => { calcKeypoints = kp; });

        if (fs.isOpened()) // Compare computed and valid keypoints.
        {
            // TODO compare saved feature detector params with current ones

            // Read validation keypoints set.
            var validKeypoints = new Array<alvision.KeyPoint>();
            fs.nodes["keypoints"].readKeyPoint(validKeypoints);
            //read(fs["keypoints"], validKeypoints);
            if (validKeypoints.length) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Keypoints can not be read.\n");
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
                return;
            }

            this.compareKeypointSets(validKeypoints, calcKeypoints);
        }
        else // Write detector parameters and computed keypoints as validation data.
        {
            fs.open(resFilename, alvision.FileStorageMode.WRITE);
            if (!fs.isOpened()) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "File %s can not be opened to write.\n", resFilename);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
                return;
            }
            else {
                fs.writeScalar("detector_params");
                fs.writeScalar("{");
                this.fdetector.write(fs);
                fs.writeScalar( "}");

                fs.write("keypoints", calcKeypoints);
                //write(fs, "keypoints", calcKeypoints);
            }
        }
    } // TODO test of detect() with mask

    run(start_from: alvision.int): void {
        if (!this.fdetector) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Feature detector is empty.\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            return;
        }

        this.emptyDataTest();
        this.regressionTest();

        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }

    protected name: string;
    protected fdetector: alvision.FeatureDetector;
};


/****************************************************************************************\
*                                Tests registrations                                     *
\****************************************************************************************/

alvision.cvtest.TEST('Features2d_Detector_BRISK', 'regression', () => {
    var test = new CV_FeatureDetectorTest("detector-brisk", alvision.BRISK.create());
    test.safe_run();
});

alvision.cvtest.TEST('Features2d_Detector_FAST', 'regression', () => {
    var test = new CV_FeatureDetectorTest("detector-fast", alvision.FastFeatureDetector.create());
    test.safe_run();
});

alvision.cvtest.TEST('Features2d_Detector_AGAST', 'regression', () => {
    var test = new CV_FeatureDetectorTest("detector-agast", alvision.AgastFeatureDetector.create());
    test.safe_run();
});

alvision.cvtest.TEST('Features2d_Detector_GFTT', 'regression', () => {
    var test = new CV_FeatureDetectorTest("detector-gftt", alvision.GFTTDetector.create());
    test.safe_run();
});

alvision.cvtest.TEST('Features2d_Detector_Harris', 'regression', () => {
    var gftt = alvision.GFTTDetector.create();
    gftt.setHarrisDetector(true);
    var test = new CV_FeatureDetectorTest("detector-harris", gftt);
    test.safe_run();
});

alvision.cvtest.TEST('Features2d_Detector_MSER', 'DISABLED_regression', () => {
    var test = new CV_FeatureDetectorTest("detector-mser", alvision.MSER.create());
    test.safe_run();
});

alvision.cvtest.TEST('Features2d_Detector_ORB', 'regression', () => {
    var test = new CV_FeatureDetectorTest("detector-orb", alvision.ORB.create());
    test.safe_run();
});

alvision.cvtest.TEST('Features2d_Detector_KAZE', 'regression', () => {
    var test = new CV_FeatureDetectorTest("detector-kaze", alvision.KAZE.create());
    test.safe_run();
});

alvision.cvtest.TEST('Features2d_Detector_AKAZE', 'regression', () => {
    var test = new CV_FeatureDetectorTest("detector-akaze", alvision.AKAZE.create());
    test.safe_run();
});
