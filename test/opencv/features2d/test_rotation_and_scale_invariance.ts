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

import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');


//#include "test_precomp.hpp"
//#include "opencv2/highgui.hpp"
//
//using namespace std;
//using namespace cv;

const IMAGE_TSUKUBA = "/features2d/tsukuba.png";
const IMAGE_BIKES = "/detectors_descriptors_evaluation/images_datasets/bikes/img1.png";

//#define SHOW_DEBUG_LOG 0


function generateHomography(angle: alvision.float ): alvision.Mat
{
    // angle - rotation around Oz in degrees
    var angleRadian = (angle.valueOf() * Math.PI / 180);
    var H = alvision.Mat.eye(3, 3, alvision.MatrixType.CV_32FC1).toMat();
    H.at<alvision.float>("float", 0, 0).set(H.at<alvision.float>("float", 1, 1).set(Math.cos(angleRadian)));
    H.at<alvision.float>("float",0,1).set( -Math.sin(angleRadian));
    H.at<alvision.float>("float",1,0).set(  Math.sin(angleRadian));

    return H;
}


function rotateImage(srcImage: alvision.Mat, angle: alvision.float, dstImage: alvision.Mat, dstMask: alvision.Mat): alvision.Mat {
    // angle - rotation around Oz in degrees
    var diag = Math.sqrt((srcImage.cols().valueOf() * srcImage.cols().valueOf() + srcImage.rows().valueOf() * srcImage.rows().valueOf()));
    var LUShift = alvision.Mat.eye(3, 3, alvision.MatrixType.CV_32FC1).toMat(); // left up
    LUShift.at<alvision.float>("float", 0, 2).set((-srcImage.cols / 2));
    LUShift.at<alvision.float>("float", 1, 2).set((-srcImage.rows / 2));
    var RDShift = alvision.Mat.eye(3, 3, alvision.MatrixType.CV_32FC1).toMat(); // right down
    RDShift.at<alvision.float>("float", 0, 2).set(diag / 2);
    RDShift.at<alvision.float>("float", 1, 2).set(diag / 2);
    var sz = new alvision.Size(Math.round(diag), Math.round(diag));

    var srcMask = new alvision.Mat(srcImage.size(), alvision.MatrixType.CV_8UC1, new alvision.Scalar(255));

    var H = alvision.MatExpr.op_Multiplication(RDShift, generateHomography(angle)).op_Multiplication(LUShift).toMat();
    alvision.warpPerspective(srcImage, dstImage, H, sz);
    alvision.warpPerspective(srcMask, dstMask, H, sz);

    return H;
}

function rotateKeyPoints(src: Array<alvision.KeyPoint>, H: alvision.Mat, angle: alvision.float, dst: Array<alvision.KeyPoint>): void {
    // suppose that H is rotation given from rotateImage() and angle has value passed to rotateImage()
    var srcCenters = new Array<alvision.Point2f>(), dstCenters = new Array<alvision.Point2f>();
    alvision.KeyPoint.convert(src, (p) => { srcCenters = p;});

    alvision.perspectiveTransform(srcCenters, dstCenters, H);

    dst = src;
    for (var i = 0; i < dst.length; i++) {
        dst[i].pt = dstCenters[i];
        var dstAngle = src[i].angle.valueOf() + angle.valueOf();
        if (dstAngle >= 360.)
            dstAngle -= 360.;
        dst[i].angle = dstAngle;
    }
}

function scaleKeyPoints(src: Array<alvision.KeyPoint>, dst: Array<alvision.KeyPoint>, scale: alvision.float ) : void
{
    dst.length = src.length;
    for(var i = 0; i < src.length; i++)
        dst[i] = new alvision.KeyPoint(src[i].pt.x.valueOf() * scale.valueOf(), src[i].pt.y.valueOf() * scale.valueOf(), src[i].size.valueOf() * scale.valueOf(), src[i].angle.valueOf());
}


function calcCirclesIntersectArea(p0: alvision.Point2f, r0: alvision.float, p1: alvision.Point2f, r1: alvision.float ): alvision.float 
{
    var c = (alvision.Point2f.norm(p0.op_Substraction( p1))), sqr_c = c.valueOf() * c.valueOf();

    var sqr_r0 = r0.valueOf() * r0.valueOf();
    var sqr_r1 = r1.valueOf() * r1.valueOf();

    if(r0.valueOf() + r1.valueOf() <= c)
       return 0;

    var minR = Math.min(r0.valueOf(), r1.valueOf());
    var maxR = Math.max(r0.valueOf(), r1.valueOf());
    if(c.valueOf() + minR.valueOf() <= maxR)
        return (Math.PI * minR * minR);

    var cos_halfA0 = (sqr_r0 + sqr_c - sqr_r1) / (2 * r0.valueOf() * c.valueOf());
    var cos_halfA1 = (sqr_r1 + sqr_c - sqr_r0) / (2 * r1.valueOf() * c.valueOf());

    var A0 = 2 * Math.acos(cos_halfA0);
    var A1 = 2 * Math.acos(cos_halfA1);

    return  0.5 * sqr_r0 * (A0 - Math.sin(A0)) +
            0.5 * sqr_r1 * (A1 - Math.sin(A1));
}


function calcIntersectRatio(p0: alvision.Point2f, r0: alvision.float, p1: alvision.Point2f, r1: alvision.float ): alvision.float {
    var intersectArea = calcCirclesIntersectArea(p0, r0, p1, r1);
    var unionArea = (Math.PI) * (r0.valueOf() * r0.valueOf() + r1.valueOf() * r1.valueOf()) - intersectArea.valueOf();
    return intersectArea.valueOf() / unionArea;
}


function matchKeyPoints(keypoints0: Array<alvision.KeyPoint>, H: alvision.Mat ,
    keypoints1: Array<alvision.KeyPoint>,
    matches: Array<alvision.DMatch>) : void
{
    var points0 = new Array<alvision.Point2f>();
    alvision.KeyPoint.convert(keypoints0, (p) => { points0 = p;});
    var points0t = new alvision.Mat();
    if(H.empty())
        points0t = new alvision.Mat(points0);
    else
        alvision.perspectiveTransform(new alvision.Mat(points0), points0t, H);

    matches.length = 0;
    var usedMask = alvision.NewArray<alvision.uchar>(keypoints1.length,()=> 0);
    for(var i0 = 0; i0 < (keypoints0.length); i0++)
    {
        var nearestPointIndex = -1;
        var maxIntersectRatio = 0.;
        const r0 =  0.5 * keypoints0[i0].size.valueOf();
        for(var i1 = 0; i1 < keypoints1.length; i1++)
        {
            if(nearestPointIndex >= 0 && usedMask[i1])
                continue;

            var r1 = 0.5 * keypoints1[i1].size.valueOf();
            var intersectRatio = calcIntersectRatio(points0t.at<alvision.Point2f>("Point2f",i0).get(), r0,
                                                      keypoints1[i1].pt, r1);
            if(intersectRatio > maxIntersectRatio)
            {
                maxIntersectRatio = intersectRatio.valueOf();
                nearestPointIndex = (i1);
            }
        }

        matches.push(new alvision.DMatch(i0, nearestPointIndex, maxIntersectRatio));
        if(nearestPointIndex >= 0)
            usedMask[nearestPointIndex] = 1;
    }
}

class DetectorRotationInvarianceTest extends alvision.cvtest.BaseTest {
    constructor(_featureDetector: alvision.FeatureDetector,
        _minKeyPointMatchesRatio: alvision.float,
        _minAngleInliersRatio: alvision.float) {
        super();
        this.featureDetector = (_featureDetector);

        this.minKeyPointMatchesRatio = (_minKeyPointMatchesRatio);
        this.minAngleInliersRatio = (_minAngleInliersRatio);

        alvision.CV_Assert(() => this.featureDetector != null);
    }


    run(iii : alvision.int) : void
    {
        const imageFilename = this.ts.get_data_path() + IMAGE_TSUKUBA;

        // Read test data
        var  image0 = alvision.imread(imageFilename), image1, mask1;
        if(image0.empty())
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Image %s can not be read.\n", imageFilename);
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            return;
        }

        var keypoints0 = new Array<alvision.KeyPoint>();
        this.featureDetector.detect(image0, (kp) => { keypoints0 = kp; });
        if(keypoints0.length < 15)
            alvision.CV_Error(alvision.cv.Error.Code.StsAssert , "Detector gives too few points in a test image\n");

        const maxAngle = 360, angleStep = 15;
        for(var angle = 0; angle < maxAngle; angle += angleStep)
        {
            var H = rotateImage(image0, angle, image1, mask1);

            var keypoints1 = new Array<alvision.KeyPoint>();
            this.featureDetector.detect(image1, (kp) => { keypoints1 = kp; }, mask1);

            var matches = new Array<alvision.DMatch>();
            matchKeyPoints(keypoints0, H, keypoints1, matches);

            var angleInliersCount = 0;

            const minIntersectRatio = 0.5;
            var keyPointMatchesCount = 0;
            for(var m = 0; m < matches.length; m++)
            {
                if(matches[m].distance < minIntersectRatio)
                    continue;

                keyPointMatchesCount++;

                // Check does this inlier have consistent angles
                const  maxAngleDiff = 15.; // grad
                var angle0 = keypoints0[matches[m].queryIdx.valueOf()].angle;
                var angle1 = keypoints1[matches[m].trainIdx.valueOf()].angle;
                if(angle0 == -1 || angle1 == -1)
                    alvision.CV_Error(alvision.cv.Error.Code.StsBadArg, "Given FeatureDetector is not rotation invariant, it can not be tested here.\n");
                alvision.CV_Assert(()=>angle0 >= 0. && angle0 < 360.);
                alvision.CV_Assert(()=>angle1 >= 0. && angle1 < 360.);

                var rotAngle0 = angle0.valueOf() + angle.valueOf();
                if (rotAngle0 >= 360.)
                    rotAngle0 -= 360.;

                var angleDiff = Math.max(rotAngle0, angle1.valueOf()) - Math.min(rotAngle0, angle1.valueOf());
                angleDiff = Math.min(angleDiff, (360. - angleDiff));
                alvision.CV_Assert(()=>angleDiff >= 0.);
                var isAngleCorrect = angleDiff < maxAngleDiff;
                if(isAngleCorrect)
                    angleInliersCount++;
            }

            var keyPointMatchesRatio = (keyPointMatchesCount) / keypoints0.length;
            if(keyPointMatchesRatio < this.minKeyPointMatchesRatio)
            {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Incorrect keyPointMatchesRatio: curr = %f, min = %f.\n",
                           keyPointMatchesRatio, this.minKeyPointMatchesRatio);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                return;
            }

            if(keyPointMatchesCount)
            {
                var angleInliersRatio = (angleInliersCount) / keyPointMatchesCount;
                if(angleInliersRatio < this.minAngleInliersRatio)
                {
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "Incorrect angleInliersRatio: curr = %f, min = %f.\n",
                               angleInliersRatio, this.minAngleInliersRatio);
                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                    return;
                }
            }
//#if SHOW_DEBUG_LOG
            console.log("keyPointMatchesRatio - ", keyPointMatchesRatio
                , " - angleInliersRatio ", (angleInliersCount) / keyPointMatchesCount);
//#endif
        }
        this.ts.set_failed_test_info( alvision.cvtest.FailureCode.OK );
    }

    protected featureDetector: alvision.FeatureDetector;
    protected minKeyPointMatchesRatio: alvision.float;
    protected minAngleInliersRatio: alvision.float;
};

class DescriptorRotationInvarianceTest  extends alvision.cvtest.BaseTest
{
    constructor(_featureDetector: alvision.FeatureDetector,
        _descriptorExtractor: alvision.DescriptorExtractor,
        _normType: alvision.int,
        _minDescInliersRatio: alvision.float) {
        super();

        this.featureDetector = (_featureDetector);
        this.descriptorExtractor = (_descriptorExtractor);
        this.normType = (_normType);
        this.minDescInliersRatio = (_minDescInliersRatio);

        alvision.CV_Assert(()=>this.featureDetector != null);
        alvision.CV_Assert(()=>this.descriptorExtractor != null);
    }

    run(iii: alvision.int) : void
    {
        const  imageFilename = this.ts.get_data_path() + IMAGE_TSUKUBA;

        // Read test data
        var image0 = alvision.imread(imageFilename), image1, mask1;
        if(image0.empty())
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Image %s can not be read.\n", imageFilename);
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            return;
        }

        var keypoints0 = new Array<alvision.KeyPoint>();
        var descriptors0 = new alvision.Mat();
        this.featureDetector.detect(image0, (kp) => { keypoints0 = kp; });
        if(keypoints0.length < 15)
            alvision.CV_Error(alvision.cv.Error.Code.StsAssert, "Detector gives too few points in a test image\n");
        this.descriptorExtractor.compute(image0, keypoints0, descriptors0);

        var bfmatcher = new alvision.BFMatcher (this.normType);

        const minIntersectRatio = 0.5;
        const  maxAngle = 360, angleStep = 15;
        for(var angle = 0; angle < maxAngle; angle += angleStep)
        {
            var H = rotateImage(image0, (angle), image1, mask1);

            var keypoints1 = new Array<alvision.KeyPoint>();
            rotateKeyPoints(keypoints0, H, (angle), keypoints1);
            var descriptors1 = new alvision.Mat();
            this.descriptorExtractor.compute(image1, keypoints1, descriptors1);

            var descMatches = new Array<alvision.DMatch>();
            bfmatcher.match(descriptors0, descriptors1, (matches_) => { descMatches = matches_; });

            var descInliersCount = 0;
            for(var m = 0; m < descMatches.length; m++)
            {
                const transformed_p0 = keypoints1[descMatches[m].queryIdx.valueOf()];
                const  p1 = keypoints1[descMatches[m].trainIdx.valueOf()];
                if(calcIntersectRatio(transformed_p0.pt, 0.5 * transformed_p0.size.valueOf(),
                                      p1.pt, 0.5 * p1.size.valueOf()) >= minIntersectRatio)
                {
                    descInliersCount++;
                }
            }

            var descInliersRatio = (descInliersCount) / keypoints0.length;
            if(descInliersRatio < this.minDescInliersRatio)
            {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Incorrect descInliersRatio: curr = %f, min = %f.\n",
                           descInliersRatio, this.minDescInliersRatio);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                return;
            }
//#if SHOW_DEBUG_LOG
            console.log("descInliersRatio " ,(descInliersCount) / keypoints0.length);
//#endif
        }
        this.ts.set_failed_test_info( alvision.cvtest.FailureCode.OK );
    }

    protected featureDetector: alvision.FeatureDetector;
    protected descriptorExtractor: alvision.DescriptorExtractor;
    protected normType: alvision.int;
    protected minDescInliersRatio: alvision.float;
};

class DetectorScaleInvarianceTest extends alvision.cvtest.BaseTest {
    constructor(_featureDetector: alvision.FeatureDetector,
        _minKeyPointMatchesRatio: alvision.float,
        _minScaleInliersRatio: alvision.float) {
        super();
        this.featureDetector = (_featureDetector);
        this.minKeyPointMatchesRatio = (_minKeyPointMatchesRatio);
        this.minScaleInliersRatio = (_minScaleInliersRatio);

        alvision.CV_Assert(() => this.featureDetector != null);
    }

    run(iii: alvision.int): void {
        const imageFilename = this.ts.get_data_path() + IMAGE_BIKES;

        // Read test data
        var image0 = alvision.imread(imageFilename);
        if (image0.empty()) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Image %s can not be read.\n", imageFilename);
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            return;
        }

        var keypoints0 = new Array<alvision.KeyPoint>();
        this.featureDetector.detect(image0, (kp) => { keypoints0 = kp; });
        if (keypoints0.length < 15)
            alvision.CV_Error(alvision.cv.Error.Code.StsAssert, "Detector gives too few points in a test image\n");

        for (var scaleIdx = 1; scaleIdx <= 3; scaleIdx++) {
            var scale = 1. + scaleIdx * 0.5;
            var image1 = new alvision.Mat();
            alvision.resize(image0, image1, new alvision.Size(), 1. / scale, 1. / scale);

            var keypoints1 = new Array<alvision.KeyPoint>(), osiKeypoints1 = new Array<alvision.KeyPoint>(); // osi - original size image
            this.featureDetector.detect(image1, (kp) => { keypoints1 = kp; });
            if (keypoints1.length < 15)
                alvision.CV_Error(alvision.cv.Error.Code.StsAssert, "Detector gives too few points in a test image\n");

            if (keypoints1.length > keypoints0.length) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Strange behavior of the detector. " +
                    "It gives more points count in an image of the smaller size.\n" +
                    "original size (%d, %d), keypoints count = %d\n" +
                    "reduced size (%d, %d), keypoints count = %d\n",
                    image0.cols, image0.rows, keypoints0.length,
                    image1.cols, image1.rows, keypoints1.length);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                return;
            }

            scaleKeyPoints(keypoints1, osiKeypoints1, scale);

            var matches = new Array<alvision.DMatch>();
            // image1 is query image (it's reduced image0)
            // image0 is train image
            matchKeyPoints(osiKeypoints1, new alvision.Mat(), keypoints0, matches);

            const minIntersectRatio = 0.5;
            var keyPointMatchesCount = 0;
            var scaleInliersCount = 0;

            for (var m = 0; m < matches.length; m++) {
                if (matches[m].distance < minIntersectRatio)
                    continue;

                keyPointMatchesCount++;

                // Check does this inlier have consistent sizes
                const maxSizeDiff = 0.8;//0.9f; // grad
                var size0 = keypoints0[matches[m].trainIdx.valueOf()].size;
                var size1 = osiKeypoints1[matches[m].queryIdx.valueOf()].size;
                alvision.CV_Assert(() => size0 > 0 && size1 > 0);
                if (Math.min(size0.valueOf(), size1.valueOf()) > maxSizeDiff * Math.max(size0.valueOf(), size1.valueOf()))
                    scaleInliersCount++;
            }

            var keyPointMatchesRatio = (keyPointMatchesCount) / keypoints1.length;
            if (keyPointMatchesRatio < this.minKeyPointMatchesRatio) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Incorrect keyPointMatchesRatio: curr = %f, min = %f.\n",
                    keyPointMatchesRatio, this.minKeyPointMatchesRatio);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                return;
            }

            if (keyPointMatchesCount) {
                var scaleInliersRatio = (scaleInliersCount) / keyPointMatchesCount;
                if (scaleInliersRatio < this.minScaleInliersRatio) {
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "Incorrect scaleInliersRatio: curr = %f, min = %f.\n",
                        scaleInliersRatio, this.minScaleInliersRatio);
                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                    return;
                }
            }
            //#if SHOW_DEBUG_LOG
            console.log("keyPointMatchesRatio - ", keyPointMatchesRatio
                , " - scaleInliersRatio ", (scaleInliersCount) / keyPointMatchesCount);
            //#endif
        }
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }

    protected featureDetector: alvision.FeatureDetector;
    protected minKeyPointMatchesRatio: alvision.float;
    protected minScaleInliersRatio: alvision.float;
};

class DescriptorScaleInvarianceTest  extends alvision.cvtest.BaseTest
{
    constructor(_featureDetector: alvision.FeatureDetector,
        _descriptorExtractor: alvision.DescriptorExtractor,
        _normType: alvision.int,
        _minDescInliersRatio: alvision.float) {
        super();
        this.featureDetector = (_featureDetector);
        this.descriptorExtractor = (_descriptorExtractor);
        this.normType = (_normType);
        this.minDescInliersRatio = (_minDescInliersRatio);

        alvision.CV_Assert(() => this.featureDetector != null);
        alvision.CV_Assert(() => this.descriptorExtractor != null);
    }

    run(iii : alvision.int) : void
    {
        const imageFilename = this.ts.get_data_path() + IMAGE_BIKES;

        // Read test data
        var image0 = alvision.imread(imageFilename);
        if(image0.empty())
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Image %s can not be read.\n", imageFilename);
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            return;
        }

        var keypoints0 = new Array<alvision.KeyPoint>();
        this.featureDetector.detect(image0, (kp) => { keypoints0 = kp; });
        if(keypoints0.length < 15)
            alvision.CV_Error(alvision.cv.Error.Code.StsAssert, "Detector gives too few points in a test image\n");
        var descriptors0 = new alvision.Mat();
        this.descriptorExtractor.compute(image0, keypoints0, descriptors0);

        var bfmatcher = new alvision.BFMatcher (this.normType);
        for(var scaleIdx = 1; scaleIdx <= 3; scaleIdx++)
        {
            var scale = 1. + scaleIdx * 0.5;

            var image1 = new alvision.Mat();
            alvision.resize(image0, image1,new alvision. Size(), 1./scale, 1./scale);

            var keypoints1 = new Array<alvision.KeyPoint>();
            scaleKeyPoints(keypoints0, keypoints1, 1.0/scale);
            var descriptors1 = new alvision.Mat();
            this.descriptorExtractor.compute(image1, keypoints1, descriptors1);

            var descMatches = new Array<alvision.DMatch>();
            bfmatcher.match(descriptors0, descriptors1, (matches_) => { descMatches = matches_; });

            const minIntersectRatio = 0.5;
            var descInliersCount = 0;
            for (var m = 0; m < descMatches.length; m++) {
                const transformed_p0 = keypoints0[descMatches[m].queryIdx.valueOf()];
                const p1 = keypoints0[descMatches[m].trainIdx.valueOf()];
                if (calcIntersectRatio(transformed_p0.pt, 0.5 * transformed_p0.size.valueOf(),
                    p1.pt, 0.5 * p1.size.valueOf()) >= minIntersectRatio) {
                    descInliersCount++;
                }
            }

            var descInliersRatio = (descInliersCount) / keypoints0.length;
            if(descInliersRatio < this.minDescInliersRatio)
            {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Incorrect descInliersRatio: curr = %f, min = %f.\n",
                           descInliersRatio, this.minDescInliersRatio);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                return;
            }
//#if SHOW_DEBUG_LOG
            console.log("descInliersRatio ", (descInliersCount) / keypoints0.length);
//#endif
        }
        this.ts.set_failed_test_info( alvision.cvtest.FailureCode.OK );
    }

    protected featureDetector: alvision.FeatureDetector;
    protected descriptorExtractor: alvision.DescriptorExtractor;
    protected normType: alvision.int;
    protected minKeyPointMatchesRatio: alvision.float;
    protected minDescInliersRatio: alvision.float;
};

// Tests registration

/*
 * Detector's rotation invariance check
 */

alvision.cvtest.TEST('Features2d_RotationInvariance_Detector_BRISK', 'regression', () => {
    var test = new DetectorRotationInvarianceTest(alvision.BRISK.create(),
        0.32,
        0.76);
    test.safe_run();
});

    alvision.cvtest.TEST('Features2d_RotationInvariance_Detector_ORB', 'regression', () => {
        var test = new DetectorRotationInvarianceTest (alvision.ORB.create(),
            0.47,
            0.76);
        test.safe_run();
    });

/*
 * Descriptors's rotation invariance check
 */

alvision.cvtest.TEST('Features2d_RotationInvariance_Descriptor_BRISK', 'regression', () => {
    var f2d = alvision.BRISK.create();
    var test = new DescriptorRotationInvarianceTest (f2d, f2d, f2d.defaultNorm(), 0.99);
    test.safe_run();
});

alvision.cvtest.TEST('Features2d_RotationInvariance_Descriptor_ORB', 'regression', () => {
    var f2d = alvision.ORB.create();
    var test = new DescriptorRotationInvarianceTest (f2d, f2d, f2d.defaultNorm(), 0.99);
    test.safe_run();
});

//TEST(Features2d_RotationInvariance_Descriptor_FREAK, regression)
//{
//    DescriptorRotationInvarianceTest test(Algorithm::create<FeatureDetector>("Feature2D.ORB"),
//                                          Algorithm::create<DescriptorExtractor>("Feature2D.FREAK"),
//                                          Algorithm::create<DescriptorExtractor>("Feature2D.FREAK").defaultNorm(),
//                                          0.f);
//    test.safe_run();
//}

/*
 * Detector's scale invariance check
 */

alvision.cvtest.TEST('Features2d_ScaleInvariance_Detector_BRISK', 'regression', () => {
    var test = new DetectorScaleInvarianceTest (alvision.BRISK.create(), 0.08, 0.49);
    test.safe_run();
});

alvision.cvtest.TEST('Features2d_ScaleInvariance_Detector_KAZE', 'regression', () => {
    var test = new DetectorScaleInvarianceTest (alvision.KAZE.create(), 0.08, 0.49);
    test.safe_run();
});

alvision.cvtest.TEST('Features2d_ScaleInvariance_Detector_AKAZE', 'regression', () => {
    var test = new DetectorScaleInvarianceTest (alvision.AKAZE.create(), 0.08, 0.49);
    test.safe_run();
});

//TEST(Features2d_ScaleInvariance_Detector_ORB, regression)
//{
//    DetectorScaleInvarianceTest test(Algorithm::create<FeatureDetector>("Feature2D.ORB"),
//                                     0.22f,
//                                     0.83f);
//    test.safe_run();
//}

/*
 * Descriptor's scale invariance check
 */

//TEST(Features2d_ScaleInvariance_Descriptor_BRISK, regression)
//{
//    DescriptorScaleInvarianceTest test(Algorithm::create<FeatureDetector>("Feature2D.BRISK"),
//                                       Algorithm::create<DescriptorExtractor>("Feature2D.BRISK"),
//                                       Algorithm::create<DescriptorExtractor>("Feature2D.BRISK").defaultNorm(),
//                                       0.99f);
//    test.safe_run();
//}

//TEST(Features2d_ScaleInvariance_Descriptor_ORB, regression)
//{
//    DescriptorScaleInvarianceTest test(Algorithm::create<FeatureDetector>("Feature2D.ORB"),
//                                       Algorithm::create<DescriptorExtractor>("Feature2D.ORB"),
//                                       Algorithm::create<DescriptorExtractor>("Feature2D.ORB").defaultNorm(),
//                                       0.01f);
//    test.safe_run();
//}

//TEST(Features2d_ScaleInvariance_Descriptor_FREAK, regression)
//{
//    DescriptorScaleInvarianceTest test(Algorithm::create<FeatureDetector>("Feature2D.ORB"),
//                                       Algorithm::create<DescriptorExtractor>("Feature2D.FREAK"),
//                                       Algorithm::create<DescriptorExtractor>("Feature2D.FREAK").defaultNorm(),
//                                       0.01f);
//    test.safe_run();
//}
