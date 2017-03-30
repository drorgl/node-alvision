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
//using namespace cv;
//using namespace std;

class CV_ECC_BaseTest  extends alvision.cvtest.BaseTest
{
    constructor() {
        super();
        this.MAX_RMS_ECC = 0.1;
        this.ntests = 3;
        this.ECC_iterations = 50;
        this.ECC_epsilon = -1; //. negative value means that ECC_Iterations will be executed
    }

    computeRMS(mat1: alvision.Mat, mat2: alvision.Mat): alvision.double {
        alvision.CV_Assert(()=>mat1.rows == mat2.rows);
        alvision.CV_Assert(()=>mat1.cols == mat2.cols);

        var errorMat = new alvision.Mat();
        alvision.subtract(mat1, mat2, errorMat);

        return Math.sqrt(errorMat.dot(errorMat).valueOf() / (mat1.rows().valueOf() * mat1.cols().valueOf()));
    }
    isMapCorrect(mat: alvision.Mat): boolean {
        var tr = true;
        for (var i = 0; i < mat.rows(); i++)
            for (var j = 0; j < mat.cols(); j++){
                var mapVal = mat.at<alvision.float>("float",i, j).get();
            tr = tr && (!isNaN(mapVal.valueOf()) && (Math.abs(mapVal.valueOf()) < 1e9));
        }

        return tr;
    }


    protected MAX_RMS_ECC: alvision.double ;//upper bound for RMS error
    protected ntests : alvision.int;//number of tests per motion type
    protected ECC_iterations : alvision.int;//number of iterations for ECC
    protected ECC_epsilon: alvision.double ; //we choose a negative value, so that
    // ECC_iterations are always executed
};


class CV_ECC_Test_Translation extends CV_ECC_BaseTest
{
    run(from: alvision.int): void {
        if (!this.testTranslation(from))
            return;

        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }

    testTranslation(from: alvision.int): boolean{
        var img = alvision.imread(this.ts.get_data_path() + "shared/fruits.png", 0);


        if (img.empty()) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "test image can not be read");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            return false;
        }
        var testImg = new alvision.Mat();
        alvision.resize(img, testImg, new alvision.Size(216, 216));

        var rng = this.ts.get_rng();

        var progress : alvision.int = 0;

        for (var k= from.valueOf(); k < this.ntests; k++){

            this.ts.update_context(this, k, true);
            progress = this.update_progress(progress, k, this.ntests, 0);

            var translationGround = new alvision.Mat (new alvision.Mat1f(2, 3,[ 1, 0, (rng.uniform(10., 20.)),0, 1, (rng.uniform(10., 20.))]));

            var warpedImage = new alvision.Mat();

            alvision.warpAffine(testImg, warpedImage, translationGround,
                new alvision.Size(200, 200),alvision.InterpolationFlags. INTER_LINEAR +alvision.InterpolationFlags. WARP_INVERSE_MAP);

            var mapTranslation = new alvision.Mat (new alvision.Mat1f(2, 3,[ 1, 0, 0, 0, 1, 0]));

            alvision.findTransformECC(warpedImage, testImg, mapTranslation, 0,
                new alvision.TermCriteria(alvision.TermCriteriaType.COUNT + alvision.TermCriteriaType.EPS,this. ECC_iterations,this. ECC_epsilon));

            if (!this.isMapCorrect(mapTranslation)) {
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                return false;
            }

            if (this.computeRMS(mapTranslation, translationGround) > this.MAX_RMS_ECC) {
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "RMS = %f",
                    this.computeRMS(mapTranslation, translationGround));
                return false;
            }

        }
        return true;
    }
};

class CV_ECC_Test_Euclidean extends CV_ECC_BaseTest
{
    run(from: alvision.int): void {
        if (!this.testEuclidean(from))
            return;

        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }

    testEuclidean(from: alvision.int): boolean {
        var img = alvision.imread(this.ts.get_data_path() + "shared/fruits.png", 0);


        if (img.empty()) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "test image can not be read");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            return false;
        }
        var testImg = new alvision.Mat();
        alvision.resize(img, testImg, new alvision.Size(216, 216));

        var rng = this.ts.get_rng();

        var progress: alvision.int  = 0;
        for (var k= from.valueOf(); k < this.ntests; k++){
            this.ts.update_context(this, k, true);
            progress = this.update_progress(progress, k, this.ntests, 0);

            var angle = Math.PI / 30 + Math.PI * rng.uniform( - 2., 2.).valueOf() / 180;

            var euclideanGround = new alvision.Mat(new alvision.Mat1f(2, 3, [Math.cos(angle), -Math.sin(angle), (rng.uniform(10., 20.)),
                Math.sin(angle), Math.cos(angle), (rng.uniform(10., 20.))]));

            var warpedImage = new alvision.Mat();

            alvision.warpAffine(testImg, warpedImage, euclideanGround,
                new alvision.Size(200, 200),alvision.InterpolationFlags. INTER_LINEAR +alvision.InterpolationFlags. WARP_INVERSE_MAP);

            var mapEuclidean = new alvision.Mat (new alvision.Mat1f(2, 3,[ 1, 0, 0, 0, 1, 0]));

            alvision.findTransformECC(warpedImage, testImg, mapEuclidean, 1,
                new alvision.TermCriteria(alvision.TermCriteriaType.COUNT+ alvision.TermCriteriaType.EPS, this.ECC_iterations,this. ECC_epsilon));

            if (!this.isMapCorrect(mapEuclidean)) {
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                return false;
            }

            if (this.computeRMS(mapEuclidean, euclideanGround) > this.MAX_RMS_ECC) {
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "RMS = %f",
                    this.computeRMS(mapEuclidean, euclideanGround));
                return false;
            }

        }
        return true;
    }
};



class CV_ECC_Test_Affine extends CV_ECC_BaseTest
{
    run(from: alvision.int): void {
        if (!this.testAffine(from))
            return;

        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }

    testAffine(from : alvision.int) : boolean{
    var img = alvision.imread(this.ts.get_data_path() + "shared/fruits.png", 0);

    if (img.empty()) {
        this.ts.printf(alvision.cvtest.TSConstants.LOG, "test image can not be read");
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
        return false;
    }
    var testImg = new alvision.Mat();
    alvision.resize(img, testImg, new alvision.Size(216, 216));

    var rng = this.ts.get_rng();

    var progress: alvision.int  = 0;
    for (var k= from.valueOf(); k < this.ntests; k++){
        this.ts.update_context(this, k, true);
        progress = this.update_progress(progress, k, this.ntests, 0);


        var affineGround = new alvision.Mat(new alvision.Mat1f(2, 3,[ (1 - rng.uniform(-0.05, 0.05).valueOf()),
            (rng.uniform(-0.03, 0.03)), (rng.uniform(10., 20.)),
            (rng.uniform(-0.03, 0.03)), (1 - rng.uniform(-0.05, 0.05).valueOf()),
            (rng.uniform(10., 20.))]));

        let warpedImage = new alvision.Mat();

        alvision.warpAffine(testImg, warpedImage, affineGround,
            new alvision.Size(200, 200), alvision.InterpolationFlags.INTER_LINEAR + alvision.InterpolationFlags.WARP_INVERSE_MAP);

        let mapAffine = new alvision.Mat (new alvision.Mat1f(2, 3,[ 1, 0, 0, 0, 1, 0]));

        alvision.findTransformECC(warpedImage, testImg, mapAffine, 2,
            new alvision.TermCriteria(alvision.TermCriteriaType.COUNT + alvision.TermCriteriaType.EPS, this.ECC_iterations,this. ECC_epsilon));

        if (!this.isMapCorrect(mapAffine)) {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
            return false;
        }

        if (this.computeRMS(mapAffine, affineGround) > this.MAX_RMS_ECC) {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "RMS = %f",
                this.computeRMS(mapAffine, affineGround));
            return false;
        }

    }

    return true;
    }
};

class CV_ECC_Test_Homography extends CV_ECC_BaseTest
{
    run(from: alvision.int): void {
        if (!this.testHomography(from))
            return;

        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }

    testHomography(from: alvision.int): boolean{
        var img = alvision.imread(this.ts.get_data_path() + "shared/fruits.png", 0);


        if (img.empty()) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "test image can not be read");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            return false;
        }
        var testImg = new alvision.Mat();
        alvision.resize(img, testImg,new alvision. Size(216, 216));

        var rng = this.ts.get_rng();

        var progress: alvision.int  = 0;
        for (var k= from.valueOf(); k < this.ntests; k++){
            this.ts.update_context(this, k, true);
            progress = this.update_progress(progress, k, this.ntests, 0);

            var homoGround = new alvision.Mat (new alvision.Mat1f(3, 3,[ (1 - rng.uniform(-0.05, 0.05).valueOf()),
                (rng.uniform(-0.03, 0.03)), (rng.uniform(10., 20.)),
                (rng.uniform(-0.03, 0.03)), (1 - rng.uniform(-0.05, 0.05).valueOf()), (rng.uniform(10., 20.)),
                (rng.uniform(0.0001, 0.0003)), (rng.uniform(0.0001, 0.0003)), 1.]));

            var warpedImage = new alvision.Mat();

            alvision.warpPerspective(testImg, warpedImage, homoGround,
                new alvision.Size(200, 200), alvision.InterpolationFlags.INTER_LINEAR + alvision.InterpolationFlags.WARP_INVERSE_MAP);

            var mapHomography = alvision.Mat.eye(3, 3,alvision.MatrixType. CV_32F).toMat();

            alvision.findTransformECC(warpedImage, testImg, mapHomography, 3,
                new alvision.TermCriteria(alvision.TermCriteriaType.COUNT + alvision.TermCriteriaType.EPS, this.ECC_iterations,this. ECC_epsilon));

            if (!this.isMapCorrect(mapHomography)) {
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                return false;
            }

            if (this.computeRMS(mapHomography, homoGround) > this.MAX_RMS_ECC) {
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "RMS = %f",
                    this.computeRMS(mapHomography, homoGround));
                return false;
            }

        }
        return true;
    }
};




alvision.cvtest.TEST('Video_ECC_Translation', 'accuracy', () => { var test = new CV_ECC_Test_Translation(); test.safe_run(); });
alvision.cvtest.TEST('Video_ECC_Euclidean', 'accuracy', () => { var test = new CV_ECC_Test_Euclidean(); test.safe_run(); });
alvision.cvtest.TEST('Video_ECC_Affine', 'accuracy', () => { var test = new CV_ECC_Test_Affine(); test.safe_run(); });
alvision.cvtest.TEST('Video_ECC_Homography', 'accuracy', () => { var test = new CV_ECC_Test_Homography(); test.safe_run(); });
