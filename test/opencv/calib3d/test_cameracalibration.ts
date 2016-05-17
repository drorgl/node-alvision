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
//#include "opencv2/calib3d/calib3d_c.h"
//
//#include <limits>
//
//using namespace std;
//using namespace cv;
//
//#if 0
//class CV_ProjectPointsTest extends alvision.cvtest.ArrayTest {
//    constructor() {
//        super();
//        //super("3d-ProjectPoints", "cvProjectPoints2", "");
//        this.test_array[this.INPUT].push(null);  // rotation vector
//        this.test_array[this.OUTPUT].push(null); // rotation matrix
//        this.test_array[this.OUTPUT].push(null); // jacobian (J)
//        this.test_array[this.OUTPUT].push(null); // rotation vector (backward transform result)
//        this.test_array[this.OUTPUT].push(null); // inverse transform jacobian (J1)
//        this.test_array[this.OUTPUT].push(null); // J*J1 (or J1*J) == I(3x3)
//        this.test_array[this.REF_OUTPUT].push(null);
//        this.test_array[this.REF_OUTPUT].push(null);
//        this.test_array[this.REF_OUTPUT].push(null);
//        this.test_array[this.REF_OUTPUT].push(null);
//        this.test_array[this.REF_OUTPUT].push(null);
//
//        this.element_wise_relative_error = false;
//        this.calc_jacobians = false;
//    }
//
//
//    protected read_params(fs: alvision.CvFileStorage): alvision.int {
//        var code = super.read_params(fs);
//        return code;
//    }
//
//    protected fill_array(test_case_idx: alvision.int, i: alvision.int, j: alvision.int, arr: alvision.Mat): void {
//        //double r[3], theta0, theta1, f;
//        var _r = new alvision.Mat(arr.rows, arr.cols, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_64F, arr.channels()));// CV_MAT_CN(arr .type)),);
//        var rng = this.ts.get_rng();
//
//        var r = _r.ptr<alvision.double>("double");
//
//        r[0] = alvision.cvtest.randReal(rng).valueOf() * Math.PI * 2;
//        r[1] = alvision.cvtest.randReal(rng).valueOf() * Math.PI * 2;
//        r[2] = alvision.cvtest.randReal(rng).valueOf() * Math.PI * 2;
//
//        var theta0 = Math.sqrt(r[0].valueOf() * r[0].valueOf() + r[1].valueOf() * r[1].valueOf() + r[2].valueOf() * r[2].valueOf());
//        var theta1 = (theta0) % (Math.PI * 2);
//
//        if (theta1 > Math.PI)
//            theta1 = -(Math.PI * 2 - theta1);
//
//        var f = theta1 / (theta0 ? theta0 : 1);
//        r[0] = r[0].valueOf() * f;
//        r[1] = r[1].valueOf() * f;
//        r[2] = r[2].valueOf() * f;
//
//        cvTsConvert(_r, arr);
//    }
//
//
//    protected prepare_test_case(test_case_idx: alvision.int): alvision.int {
//        var code = super.prepare_test_case(test_case_idx);
//        return code;
//    }
//
//    get_test_array_types_and_sizes(
//        test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        var rng = this.ts.get_rng();
//        var depth = alvision.cvtest.randInt(rng).valueOf() % 2 == 0 ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_64F;
//        //int i, code;
//
//        var code = alvision.cvtest.randInt(rng).valueOf() % 3;
//        types[this.INPUT][0] = alvision.MatrixType.CV_MAKETYPE(depth, 1);
//
//        if (code == 0) {
//            sizes[this.INPUT][0] = new alvision.Size(1, 1);
//            types[this.INPUT][0] = alvision.MatrixType.CV_MAKETYPE(depth, 3);
//        }
//        else if (code == 1)
//            sizes[this.INPUT][0] = new alvision.Size(3, 1);
//        else
//            sizes[this.INPUT][0] = new alvision.Size(1, 3);
//
//        sizes[this.OUTPUT][0] = new alvision.Size(3, 3);
//        types[this.OUTPUT][0] = alvision.MatrixType.CV_MAKETYPE(depth, 1);
//
//        types[this.OUTPUT][1] = alvision.MatrixType.CV_MAKETYPE(depth, 1);
//
//        if (alvision.cvtest.randInt(rng).valueOf() % 2)
//            sizes[this.OUTPUT][1] = new alvision.Size(3, 9);
//        else
//            sizes[this.OUTPUT][1] = new alvision.Size(9, 3);
//
//        types[this.OUTPUT][2] = types[this.INPUT][0];
//        sizes[this.OUTPUT][2] = sizes[this.INPUT][0];
//
//        types[this.OUTPUT][3] = types[this.OUTPUT][1];
//        sizes[this.OUTPUT][3] = new alvision.Size(sizes[this.OUTPUT][1].height, sizes[this.OUTPUT][1].width);
//
//        types[this.OUTPUT][4] = types[this.OUTPUT][1];
//        sizes[this.OUTPUT][4] = new alvision.Size(3, 3);
//
//        this.calc_jacobians = true;//alvision.cvtest.randInt(rng) % 3 != 0;
//        if (!this.calc_jacobians)
//            sizes[this.OUTPUT][1] = sizes[this.OUTPUT][3] = sizes[this.OUTPUT][4] = new alvision.Size(0, 0);
//
//        for (var i = 0; i < 5; i++) {
//            types[this.REF_OUTPUT][i] = types[this.OUTPUT][i];
//            sizes[this.REF_OUTPUT][i] = sizes[this.OUTPUT][i];
//        }
//    }
//    protected get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
//        return j == 4 ? 1e-2 : 1e-2;
//    }
//
//    protected run_func(): void {
//        var v2m_jac: alvision.Mat = null; 
//            var m2v_jac  : alvision.Mat = null;
//            if (this.calc_jacobians) {
//                v2m_jac = this.test_mat[this.OUTPUT][1];
//                m2v_jac = this.test_mat[this.OUTPUT][3];
//            }
//
//        cvProjectPoints2( this.test_mat[this.INPUT][0],  this.test_mat[this.OUTPUT][0], v2m_jac);
//        cvProjectPoints2( this.test_mat[this.OUTPUT][0], this.test_mat[this.OUTPUT][2], m2v_jac);
//    }
//    protected prepare_to_validation(int /*test_case_idx*/): void {
//        var vec = this.test_mat[this.INPUT][0];
//        var m = this.test_mat[this.REF_OUTPUT][0];
//        var vec2 = this.test_mat[this.REF_OUTPUT][2];
//        var v2m_jac: alvision.Mat = null; 
//            var m2v_jac : alvision.Mat = null;
//        //double theta0, theta1;
//
//        if (this.calc_jacobians) {
//            v2m_jac = this.test_mat[this.REF_OUTPUT][1];
//            m2v_jac = this.test_mat[this.REF_OUTPUT][3];
//        }
//
//
//        cvTsProjectPoints(vec, m, v2m_jac);
//        cvTsProjectPoints(m, vec2, m2v_jac);
//        cvTsCopy(vec, vec2);
//
//        var theta0 = alvision.cvtest.norm(cvarrtomat(vec2), 0, CV_L2);
//        var theta1 = (theta0) % (Math.PI * 2);
//
//        if (theta1 > Math.PI)
//            theta1 = -(Math.PI * 2 - theta1);
//        cvScale(vec2, vec2, theta1 / (theta0 ? theta0 : 1));
//
//        if (calc_jacobians) {
//            //cvInvert( v2m_jac, m2v_jac, CV_SVD );
//            if (alvision.cvtest.norm(cvarrtomat(&test_mat[OUTPUT][3]), 0, CV_C) < 1000) {
//                cvTsGEMM( &test_mat[OUTPUT][1], &test_mat[OUTPUT][3],
//                    1, 0, 0, &test_mat[OUTPUT][4],
//                    v2m_jac.rows == 3 ? 0 : CV_GEMM_A_T + CV_GEMM_B_T);
//            }
//            else {
//                cvTsSetIdentity( &test_mat[OUTPUT][4], cvScalarAll(1.));
//                cvTsCopy( &test_mat[REF_OUTPUT][2], &test_mat[OUTPUT][2]);
//            }
//            cvTsSetIdentity( &test_mat[REF_OUTPUT][4], cvScalarAll(1.));
//        }
//    }
//
//    protected calc_jacobians: boolean;
//}
//
//
//
//
//
//var ProjectPoints_test = new CV_ProjectPointsTest();
//
//#endif

// --------------------------------- CV_CameraCalibrationTest --------------------------------------------

class CV_CameraCalibrationTest extends alvision.cvtest.BaseTest {

    clear(): void {
        super.clear();
    }

    protected compare(val: Array<alvision.double>, ref_val: Array<alvision.double>,
        eps: alvision.double, param_name: string): alvision.int {
        return alvision.cvtest.cmpEps2_64f(this.ts, val, ref_val, eps, param_name);
    }

    calibrate(imageCount: alvision.int, pointCounts: Array<alvision.int>,
        imageSize: alvision.Size, imagePoints: Array<alvision.CvPoint2D64f>, objectPoints: Array<alvision.CvPoint3D64f>,
        distortionCoeffs: Array<alvision.double>, cameraMatrix: Array<alvision.double>, translationVectors: Array<alvision.double>,
        rotationMatrices: Array<alvision.double>, flags: alvision.int): void { }

    project(pointCount: alvision.int, objectPoints: Array<alvision.CvPoint3D64f>,
        rotationMatrix: Array<alvision.double>, translationVector: Array<alvision.double>,
        cameraMatrix: Array<alvision.double>, distortion: Array<alvision.double>, imagePoints: Array<alvision.CvPoint2D64f>): void { }

    run(start_from: alvision.int): void {
        var code = alvision.cvtest.FailureCode.OK;
        var filepath: string;
        var filename: string;

        var imageSize: alvision.Size;
        var etalonSize: alvision.Size;
        var numImages: alvision.int;

        var imagePoints = new Array<alvision.CvPoint2D64f>();
        var objectPoints = new Array<alvision.CvPoint3D64f>();
        var reprojectPoints = new Array<alvision.CvPoint2D64f>();

        var transVects = new Array<alvision.double>();
        var rotMatrs = new Array<alvision.double>();

        var goodTransVects = new Array<alvision.double>();
        var goodRotMatrs = new Array<alvision.double>();

        var cameraMatrix = new Array<alvision.double>(3 * 3);
        var distortion = [0, 0, 0, 0, 0];

        var goodDistortion = new Array<alvision.double>(4);

        int * numbers;
        FILE * file = 0;
        //FILE * datafile = 0;
        //int             i, j;
        //int             currImage;
        int             currPoint;

        int             calibFlags;
        char            i_dat_file[100];
        //int             numPoints;
        int numTests;
        //int currTest;

        imagePoints = 0;
        objectPoints = 0;
        reprojectPoints = 0;
        numbers = 0;

        transVects = 0;
        rotMatrs = 0;
        goodTransVects = 0;
        goodRotMatrs = 0;
        var progress = 0;
        var values_read = -1;

        filepath = util.format("%scv/cameracalibration/", this.ts.get_data_path());
        filename = util.format("%sdatafiles.txt", filepath);
        var datafile = fs.openSync(filename, "r");
        if (datafile == 0) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Could not open file with list of test files: %s\n", filename);
            code = alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA;
            return;
            //goto _exit_;
        }

        values_read = fscanf(datafile, "%d",&numTests);
        alvision.CV_Assert(values_read == 1);

        for (var currTest = start_from; currTest < numTests; currTest++) {
            values_read = fscanf(datafile, "%s", i_dat_file);
            alvision.CV_Assert(values_read == 1);
            filename = util.format("%s%s", filepath, i_dat_file);
            file = fs.openSync(filename, "r");

            this.ts.update_context(this, currTest, true);

            if (file == 0) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG,
                    "Can't open current test file: %s\n", filename);
                if (numTests == 1) {
                    code = alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA;
                    goto _exit_;
                }
                continue; // if there is more than one test, just skip the test
            }

            values_read = fscanf(file, "%d %d\n",&(imageSize.width),&(imageSize.height));
            alvision.CV_Assert(values_read == 2);
            if (imageSize.width <= 0 || imageSize.height <= 0) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Image size in test file is incorrect\n");
                code = alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
                goto _exit_;
            }

            /* Read etalon size */
            values_read = fscanf(file, "%d %d\n",&(etalonSize.width),&(etalonSize.height));
            alvision.CV_Assert(values_read == 2);
            if (etalonSize.width <= 0 || etalonSize.height <= 0) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Pattern size in test file is incorrect\n");
                code = alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
                goto _exit_;
            }

            var numPoints = etalonSize.width * etalonSize.height;

            /* Read number of images */
            values_read = fscanf(file, "%d\n",&numImages);
            alvision.CV_Assert(values_read == 1);
            if (numImages <= 0) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Number of images in test file is incorrect\n");
                code = alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
                goto _exit_;
            }

            /* Need to allocate memory */
            imagePoints = new Array<alvision.CvPoint2D64f>(numPoints * numImages);

            objectPoints = new Array<alvision.CvPoint3D64f>(numPoints * numImages);

            reprojectPoints = new Array<alvision.CvPoint2D64f>(numPoints * numImages);

            /* Alloc memory for numbers */
            numbers = new Array<alvision.int>(numImages);

            /* Fill it by numbers of points of each image*/
            for (var currImage = 0; currImage < numImages; currImage++) {
                numbers[currImage] = etalonSize.width * etalonSize.height;
            }

            /* Allocate memory for translate vectors and rotmatrixs*/
            transVects = new Array<alvision.double>(3 * 1 * numImages);
            rotMatrs = new Array<alvision.double>(3 * 3 * numImages);

            goodTransVects = new Array<alvision.double>(3 * 1 * numImages);
            goodRotMatrs = new Array<alvision.double>(3 * 3 * numImages);

            /* Read object points */
            var i = 0;/* shift for current point */
            for (var currImage = 0; currImage < numImages; currImage++) {
                for (var currPoint = 0; currPoint < numPoints; currPoint++) {
                    //double x, y, z;
                    var x: alvision.double, y: alvision.double, z: alvision.double;
                    values_read = fscanf(file, "%lf %lf %lf\n",&x,&y,&z);
                    alvision.CV_Assert(values_read == 3);

                    (objectPoints + i).x = x;
                    (objectPoints + i).y = y;
                    (objectPoints + i).z = z;
                    i++;
                }
            }

            /* Read image points */
            i = 0;/* shift for current point */
            for (currImage = 0; currImage < numImages; currImage++) {
                for (currPoint = 0; currPoint < numPoints; currPoint++) {
                    var x: alvision.double, y: alvision.double;

                    values_read = fscanf(file, "%lf %lf\n",&x,&y);
                    alvision.CV_Assert(values_read == 2);

                    (imagePoints + i).x = x;
                    (imagePoints + i).y = y;
                    i++;
                }
            }

            /* Read good data computed before */

            /* Focal lengths */
            double goodFcx, goodFcy;
            values_read = fscanf(file, "%lf %lf",&goodFcx,&goodFcy);
            alvision.CV_Assert(values_read == 2);

            /* Principal points */
            double goodCx, goodCy;
            values_read = fscanf(file, "%lf %lf",&goodCx,&goodCy);
            alvision.CV_Assert(values_read == 2);

            /* Read distortion */

            values_read = fscanf(file, "%lf", goodDistortion + 0); alvision.CV_Assert(values_read == 1);
            values_read = fscanf(file, "%lf", goodDistortion + 1); alvision.CV_Assert(values_read == 1);
            values_read = fscanf(file, "%lf", goodDistortion + 2); alvision.CV_Assert(values_read == 1);
            values_read = fscanf(file, "%lf", goodDistortion + 3); alvision.CV_Assert(values_read == 1);

            /* Read good Rot matrices */
            for (currImage = 0; currImage < numImages; currImage++) {
                for (i = 0; i < 3; i++)
                    for (j = 0; j < 3; j++) {
                        values_read = fscanf(file, "%lf", goodRotMatrs + currImage * 9 + j * 3 + i);
                        alvision.CV_Assert(values_read == 1);
                    }
            }

            /* Read good Trans vectors */
            for (currImage = 0; currImage < numImages; currImage++) {
                for (i = 0; i < 3; i++) {
                    values_read = fscanf(file, "%lf", goodTransVects + currImage * 3 + i);
                    alvision.CV_Assert(values_read == 1);
                }
            }

            calibFlags = 0
                // + CV_CALIB_FIX_PRINCIPAL_POINT
                // + CV_CALIB_ZERO_TANGENT_DIST
                // + CV_CALIB_FIX_ASPECT_RATIO
                // + CV_CALIB_USE_INTRINSIC_GUESS
                + alvision.CALIB.CALIB_FIX_K3
                + alvision.CALIB.CALIB_FIX_K4 + alvision.CALIB.CALIB_FIX_K5
                + alvision.CALIB.CALIB_FIX_K6
                ;
            memset(cameraMatrix, 0, 9 * sizeof(cameraMatrix[0]));
            cameraMatrix[0] = cameraMatrix[4] = 807.;
            cameraMatrix[2] = (imageSize.width - 1) * 0.5;
            cameraMatrix[5] = (imageSize.height - 1) * 0.5;
            cameraMatrix[8] = 1.;

            /* Now we can calibrate camera */
            this.calibrate(numImages,
                numbers,
                imageSize,
                imagePoints,
                objectPoints,
                distortion,
                cameraMatrix,
                transVects,
                rotMatrs,
                calibFlags);

            /* ---- Reproject points to the image ---- */
            for (currImage = 0; currImage < numImages; currImage++) {
                var nPoints = etalonSize.width * etalonSize.height;
                this.project(nPoints,
                    objectPoints + currImage * nPoints,
                    rotMatrs + currImage * 9,
                    transVects + currImage * 3,
                    cameraMatrix,
                    distortion,
                    reprojectPoints + currImage * nPoints);
            }

            /* ----- Compute reprojection error ----- */
            i = 0;
            double dx, dy;
            double rx, ry;
            //double meanDx, meanDy;
            var maxDx = 0.0;
            var maxDy = 0.0;

            var meanDx = 0;
            var meanDy = 0;
            for (currImage = 0; currImage < numImages; currImage++) {
                for (currPoint = 0; currPoint < etalonSize.width * etalonSize.height; currPoint++) {
                    rx = reprojectPoints[i].x;
                    ry = reprojectPoints[i].y;
                    dx = rx - imagePoints[i].x;
                    dy = ry - imagePoints[i].y;

                    meanDx += dx;
                    meanDy += dy;

                    dx = fabs(dx);
                    dy = fabs(dy);

                    if (dx > maxDx)
                        maxDx = dx;

                    if (dy > maxDy)
                        maxDy = dy;
                    i++;
                }
            }

            meanDx /= numImages * etalonSize.width * etalonSize.height;
            meanDy /= numImages * etalonSize.width * etalonSize.height;

            /* ========= Compare parameters ========= */

            /* ----- Compare focal lengths ----- */
            code = this.compare(cameraMatrix + 0,&goodFcx,  0.1, "fx");
            if (code < 0)
                goto _exit_;

            code = this.compare(cameraMatrix + 4,&goodFcy,0.1, "fy");
            if (code < 0)
                goto _exit_;

            /* ----- Compare principal points ----- */
            code = this.compare(cameraMatrix + 2,&goodCx,  0.1, "cx");
            if (code < 0)
                goto _exit_;

            code = this.compare(cameraMatrix + 5,&goodCy,  0.1, "cy");
            if (code < 0)
                goto _exit_;

            /* ----- Compare distortion ----- */
            code = this.compare(distortion, goodDistortion, 0.1, "[k1,k2,p1,p2]");
            if (code < 0)
                goto _exit_;

            /* ----- Compare rot matrixs ----- */
            code = this.compare(rotMatrs, goodRotMatrs,0.05, "rotation matrices");
            if (code < 0)
                goto _exit_;

            /* ----- Compare rot matrixs ----- */
            code = this.compare(transVects, goodTransVects, 0.1, "translation vectors");
            if (code < 0)
                goto _exit_;

            if (maxDx > 1.0) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG,
                    "Error in reprojection maxDx=%f > 1.0\n", maxDx);
                code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY; goto _exit_;
            }

            if (maxDy > 1.0) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG,
                    "Error in reprojection maxDy=%f > 1.0\n", maxDy);
                code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY; goto _exit_;
            }

            progress = this.update_progress(progress, currTest, numTests, 0);

            //cvFree(&imagePoints);
            //cvFree(&objectPoints);
            //cvFree(&reprojectPoints);
            //cvFree(&numbers);
            //
            //cvFree(&transVects);
            //cvFree(&rotMatrs);
            //cvFree(&goodTransVects);
            //cvFree(&goodRotMatrs);

            fs.closeSync(file);
            file = 0;
        }

        //_exit_:

        if (file)
            fs.closeSync(file);

        if (datafile)
            fs.closeSync(datafile);

        /* Free all allocated memory */
        //cvFree(&imagePoints);
        //cvFree(&objectPoints);
        //cvFree(&reprojectPoints);
        //cvFree(&numbers);
        //
        //cvFree(&transVects);
        //cvFree(&rotMatrs);
        //cvFree(&goodTransVects);
        //cvFree(&goodRotMatrs);

        if (code < 0)
            this.ts.set_failed_test_info(code);
    }
}








// --------------------------------- CV_CameraCalibrationTest_C --------------------------------------------

//class CV_CameraCalibrationTest_C extends CV_CameraCalibrationTest
//{
//
//protected calibrate(int imageCount, int* pointCounts,
//    CvSize imageSize, CvPoint2D64f* imagePoints, CvPoint3D64f* objectPoints,
//    double* distortionCoeffs, double* cameraMatrix, double* translationVectors,
//    double* rotationMatrices, int flags ) : void {
//    int i, total = 0;
//    for (i = 0; i < imageCount; i++)
//        total += pointCounts[i];
//
//    CvMat _objectPoints = cvMat(1, total, CV_64FC3, objectPoints);
//    CvMat _imagePoints = cvMat(1, total, CV_64FC2, imagePoints);
//    CvMat _pointCounts = cvMat(1, imageCount, CV_32S, pointCounts);
//    CvMat _cameraMatrix = cvMat(3, 3, CV_64F, cameraMatrix);
//    CvMat _distCoeffs = cvMat(4, 1, CV_64F, distortionCoeffs);
//    CvMat _rotationMatrices = cvMat(imageCount, 9, CV_64F, rotationMatrices);
//    CvMat _translationVectors = cvMat(imageCount, 3, CV_64F, translationVectors);
//
//    cvCalibrateCamera2(&_objectPoints, &_imagePoints, &_pointCounts, imageSize,
//                       &_cameraMatrix, &_distCoeffs, &_rotationMatrices, &_translationVectors,
//        flags);
//}
//    protected project(int pointCount, CvPoint3D64f * objectPoints,
//    double * rotationMatrix, double * translationVector,
//    double * cameraMatrix, double * distortion, CvPoint2D64f * imagePoints) : void
//{
//    CvMat _objectPoints = cvMat(1, pointCount, CV_64FC3, objectPoints);
//    CvMat _imagePoints = cvMat(1, pointCount, CV_64FC2, imagePoints);
//    CvMat _cameraMatrix = cvMat(3, 3, CV_64F, cameraMatrix);
//    CvMat _distCoeffs = cvMat(4, 1, CV_64F, distortion);
//    CvMat _rotationMatrix = cvMat(3, 3, CV_64F, rotationMatrix);
//    CvMat _translationVector = cvMat(1, 3, CV_64F, translationVector);
//
//    cvProjectPoints2(&_objectPoints, &_rotationMatrix, &_translationVector, &_cameraMatrix, &_distCoeffs, &_imagePoints);
//}
//};





// --------------------------------- CV_CameraCalibrationTest_CPP --------------------------------------------

class CV_CameraCalibrationTest_CPP extends CV_CameraCalibrationTest
{
    constructor() {
        super();
    }

    calibrate(imageCount: alvision.int, pointCounts: Array<alvision.int>,
        imageSize: alvision.Size, imagePoints: Array<alvision.CvPoint2D64f>, objectPoints: Array<alvision.CvPoint3D64f>,
        distortionCoeffs: Array<alvision.double>, cameraMatrix: Array<alvision.double>, translationVectors: Array<alvision.double>,
        rotationMatrices: Array<alvision.double>, flags: alvision.int): void {

        var objectPoints = new Array<Array<alvision.Point3f>>(imageCount.valueOf());
        var imagePoints = new Array<Array<alvision.Point2f>>(imageCount.valueOf());
        //var imageSize = _imageSize;
        //var cameraMatrix = new alvision.Mat();
        var distCoeffs = new alvision.Mat(1, 4, alvision.MatrixType.CV_64F, alvision.Scalar.all(0));

        var rvecs = new Array<alvision.Mat>();
        var tvecs = new Array<alvision.Mat>();

        var op = objectPoints;
        var ip = imagePoints;
        //Array<Array<Point3f>>::iterator objectPointsIt = objectPoints.begin();
        //Array<Array<Point2f>>::iterator imagePointsIt = imagePoints.begin();
        for (var i = 0; i < imageCount; ++objectPointsIt, ++imagePointsIt, i++ )
        {
            int num = pointCounts[i];
            objectPointsIt.resize(num);
            imagePointsIt.resize(num);
            Array<Point3f>::iterator oIt = objectPointsIt.begin();
            Array<Point2f>::iterator iIt = imagePointsIt.begin();
            for (var j = 0; j < num; ++oIt, ++iIt, j++ , op++ , ip++)
            {
                oIt.x = (float)op.x, oIt.y = (float)op.y, oIt.z = (float)op.z;
                iIt.x = (float)ip.x, iIt.y = (float)ip.y;
            }
        }

        alvision.calibrateCamera(objectPoints,
            imagePoints,
            imageSize,
            cameraMatrix,
            distCoeffs,
            rvecs,
            tvecs,
            flags);

        alvision.assert(cameraMatrix.type() == alvision.MatrixType.CV_64FC1);
        memcpy(_cameraMatrix, cameraMatrix.ptr(), 9 * sizeof(double));

        assert(cameraMatrix.type() == CV_64FC1);
        memcpy(_distortionCoeffs, distCoeffs.ptr(), 4 * sizeof(double));

        Array<Mat>::iterator rvecsIt = rvecs.begin();
        Array<Mat>::iterator tvecsIt = tvecs.begin();
        double * rm = rotationMatrices,
           *tm = translationVectors;
        alvision.assert(rvecsIt.type() == alvision.MatrixType.CV_64FC1);
        alvision.assert(tvecsIt.type() == alvision.MatrixType.CV_64FC1);
        for (var i = 0; i < imageCount; ++rvecsIt, ++tvecsIt, i++ , rm += 9, tm += 3 )
        {
            var r9 = new alvision.Mat(3, 3, alvision.MatrixType.CV_64FC1);
            alvision.Rodrigues( *rvecsIt, r9);
            memcpy(rm, r9.ptr(), 9 * sizeof(double));
            memcpy(tm, tvecsIt.ptr(), 3 * sizeof(double));
        }
    }

    project(pointCount: alvision.int, objectPoints: Array<alvision.CvPoint3D64f>,
        rotationMatrix: Array<alvision.double>, translationVector: Array<alvision.double>,
        cameraMatrix: Array<alvision.double>, distortion: Array<alvision.double>, imagePoints: Array<alvision.CvPoint2D64f>): void {

        var objectPoints = new alvision.Mat(pointCount, 3,alvision.MatrixType. CV_64FC1, _objectPoints);
        var rmat = new alvision.Mat(3, 3, alvision.MatrixType.CV_64FC1, rotationMatrix);
        var rvec = new alvision.Mat(1, 3, alvision.MatrixType.CV_64FC1);
        var tvec = new alvision.Mat(1, 3, alvision.MatrixType.CV_64FC1, translationVector);
        var cameraMatrix = new alvision.Mat(3, 3, CV_64FC1, _cameraMatrix);
        var distCoeffs = new alvision.Mat(1, 4, CV_64FC1, distortion);
        var imagePoints = new Array<alvision.Point2f>();
        alvision.Rodrigues(rmat, rvec);

        objectPoints.convertTo(objectPoints, alvision.MatrixType.CV_32FC1);
        alvision.projectPoints(objectPoints, rvec, tvec,
            cameraMatrix, distCoeffs, imagePoints);
        Array<Point2f>::const_iterator it = imagePoints.begin();
        for (var i = 0; it != imagePoints.end(); ++it, i++ )
        {
            _imagePoints[i] = cvPoint2D64f(it.x, it.y);
        }
    }
};





//----------------------------------------- CV_CalibrationMatrixValuesTest --------------------------------

class CV_CalibrationMatrixValuesTest extends alvision.cvtest.BaseTest
{
    run(iii: alvision.int): void {
        var code = alvision.cvtest.FailureCode.OK;
        const  fcMinVal = 1e-5;
        const  fcMaxVal = 1000;
        const  apertureMaxVal = 0.01;

        var rng = this.ts.get_rng();

        double fx, fy, cx, cy, nx, ny;
        var cameraMatrix = new alvision.Mat(3, 3, CV_64FC1);
        cameraMatrix.setTo(new alvision.Scalar(0));
        fx = cameraMatrix.at<double>(0, 0) = rng.uniform(fcMinVal, fcMaxVal);
        fy = cameraMatrix.at<double>(1, 1) = rng.uniform(fcMinVal, fcMaxVal);
        cx = cameraMatrix.at<double>(0, 2) = rng.uniform(fcMinVal, fcMaxVal);
        cy = cameraMatrix.at<double>(1, 2) = rng.uniform(fcMinVal, fcMaxVal);
        cameraMatrix.at<double>(2, 2) = 1;

        var imageSize = new alvision.Size(600, 400);

        var apertureWidth = rng.double().valueOf() * apertureMaxVal,
            apertureHeight = rng.double().valueOf() * apertureMaxVal;

        double fovx, fovy, focalLength, aspectRatio,
            goodFovx, goodFovy, goodFocalLength, goodAspectRatio;
        Point2d principalPoint, goodPrincipalPoint;


        this.calibMatrixValues(cameraMatrix, imageSize, apertureWidth, apertureHeight,
            fovx, fovy, focalLength, principalPoint, aspectRatio);

        // calculate calibration matrix values
        goodAspectRatio = fy / fx;

        if (apertureWidth != 0.0 && apertureHeight != 0.0) {
            nx = imageSize.width / apertureWidth;
            ny = imageSize.height / apertureHeight;
        }
        else {
            nx = 1.0;
            ny = goodAspectRatio;
        }

        goodFovx = 2 * atan(imageSize.width / (2 * fx)) * 180.0 / Math.PI;
        goodFovy = 2 * atan(imageSize.height / (2 * fy)) * 180.0 / Math.PI;

        goodFocalLength = fx / nx;

        goodPrincipalPoint.x = cx / nx;
        goodPrincipalPoint.y = cy / ny;

        // check results
        if (Math.abs(fovx - goodFovx) > alvision.FLT_EPSILON) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "bad fovx (real=%f, good = %f\n", fovx, goodFovx);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
            goto _exit_;
        }
        if (Math.abs(fovy - goodFovy) > alvision.FLT_EPSILON) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "bad fovy (real=%f, good = %f\n", fovy, goodFovy);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
            goto _exit_;
        }
        if (Math.abs(focalLength - goodFocalLength) > alvision.FLT_EPSILON) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "bad focalLength (real=%f, good = %f\n", focalLength, goodFocalLength);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
            goto _exit_;
        }
        if (Math.abs(aspectRatio - goodAspectRatio) > alvision.FLT_EPSILON) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "bad aspectRatio (real=%f, good = %f\n", aspectRatio, goodAspectRatio);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
            goto _exit_;
        }
        if (norm(principalPoint - goodPrincipalPoint) > alvision.FLT_EPSILON) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "bad principalPoint\n");
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
            goto _exit_;
        }

        _exit_:
        var _rng = this.ts.get_rng();
        _rng = rng;
        this.ts.set_failed_test_info(code);

    }
    calibMatrixValues(cameraMatrix: alvision.Mat, imageSize: alvision.Size,
        apertureWidth: alvision.double, apertureHeight: alvision.double, fovx: alvision.double, fovy: alvision.double  , focalLength: alvision.double ,
        principalPoint: alvision.Point2d, aspectRatio: alvision.double ): void {
    }
};

//----------------------------------------- CV_CalibrationMatrixValuesTest_C --------------------------------

//class CV_CalibrationMatrixValuesTest_C extends CV_CalibrationMatrixValuesTest
//{
//public:
//    CV_CalibrationMatrixValuesTest_C(){}
//protected:
//    virtual void calibMatrixValues( const Mat& cameraMatrix, Size imageSize,
//        double apertureWidth, double apertureHeight, double& fovx, double& fovy, double& focalLength,
//        Point2d& principalPoint, double& aspectRatio );
//};
//
//void CV_CalibrationMatrixValuesTest_C::calibMatrixValues( const Mat& _cameraMatrix, Size imageSize,
//                                               double apertureWidth, double apertureHeight,
//                                               double& fovx, double& fovy, double& focalLength,
//                                               Point2d& principalPoint, double& aspectRatio )
//{
//    CvMat cameraMatrix = _cameraMatrix;
//    CvPoint2D64f pp;
//    cvCalibrationMatrixValues( &cameraMatrix, imageSize, apertureWidth, apertureHeight,
//        &fovx, &fovy, &focalLength, &pp, &aspectRatio );
//    principalPoint.x = pp.x;
//    principalPoint.y = pp.y;
//}


//----------------------------------------- CV_CalibrationMatrixValuesTest_CPP --------------------------------

class CV_CalibrationMatrixValuesTest_CPP extends CV_CalibrationMatrixValuesTest
{
    calibMatrixValues(cameraMatrix: alvision.Mat, imageSize: alvision.Size,
        apertureWidth: alvision.double, apertureHeight: alvision.double, fovx: alvision.double, fovy: alvision.double, focalLength: alvision.double ,
        principalPoint: alvision.Point2d, aspectRatio: alvision.double): void {
        alvision.calibrationMatrixValues(cameraMatrix, imageSize, apertureWidth, apertureHeight,
            fovx, fovy, focalLength, principalPoint, aspectRatio);
    }
};


//----------------------------------------- CV_ProjectPointsTest --------------------------------
function calcdfdx(leftF: Array<Array<alvision.Point2f>>, rightF: Array<Array<alvision.Point2f>>, eps: alvision.double, dfdx: alvision.Mat ): void
{
    const fdim = 2;
    alvision.CV_Assert(()=> !leftF.empty() && !rightF.empty() && !leftF[0].empty() && !rightF[0].empty() );
    alvision.CV_Assert(()=> leftF[0].size() ==  rightF[0].size() );
    alvision.CV_Assert(()=> Math.abs(eps) > std::numeric_limits<double>::epsilon() );
    var fcount = leftF[0].size(), xdim = leftF.size();

    dfdx.create( fcount*fdim, xdim, CV_64FC1 );

    Array<Array<Point2f> >::const_iterator arrLeftIt = leftF.begin();
    Array<Array<Point2f> >::const_iterator arrRightIt = rightF.begin();
    for( var xi = 0; xi < xdim; xi++, ++arrLeftIt, ++arrRightIt )
    {
        alvision.CV_Assert(()=> arrLeftIt.size() ==  fcount );
        alvision.CV_Assert(()=> arrRightIt.size() ==  fcount );
        Array<alvision.Point2f>::const_iterator lIt = arrLeftIt.begin();
        Array<alvision.Point2f>::const_iterator rIt = arrRightIt.begin();
        for(var fi = 0; fi < dfdx.rows; fi+=fdim, ++lIt, ++rIt )
        {
            dfdx.at<double>(fi, xi )   = 0.5 * ((double)(rIt.x - lIt.x)) / eps;
            dfdx.at<double>(fi+1, xi ) = 0.5 * ((double)(rIt.y - lIt.y)) / eps;
        }
    }
}

class CV_ProjectPointsTest extends alvision.cvtest.BaseTest
{
    run(iii: alvision.int): void {
        //typedef float matType;

        var code = alvision.cvtest.FailureCode.OK;
        const  pointCount = 100;

        const  zMinVal = 10.0, zMaxVal = 100.0,
            rMinVal = -0.3, rMaxVal = 0.3,
            tMinVal = -2.0, tMaxVal = 2.0;

        const imgPointErr = 1e-3,
            dEps = 1e-3;

        double err;

        var imgSize = new alvision.Size (600, 800);
        Mat_ < float > objPoints(pointCount, 3), rvec(1, 3), rmat, tvec(1, 3), cameraMatrix(3, 3), distCoeffs(1, 4),
            leftRvec, rightRvec, leftTvec, rightTvec, leftCameraMatrix, rightCameraMatrix, leftDistCoeffs, rightDistCoeffs;

        var rng = this.ts.get_rng();

        // generate data
        cameraMatrix << 300., 0., imgSize.width / 2.,
            0., 300., imgSize.height / 2.,
                0., 0., 1.;
        distCoeffs << 0.1, 0.01, 0.001, 0.001;

        rvec(0, 0) = rng.uniform(rMinVal, rMaxVal);
        rvec(0, 1) = rng.uniform(rMinVal, rMaxVal);
        rvec(0, 2) = rng.uniform(rMinVal, rMaxVal);
        Rodrigues(rvec, rmat);

        tvec(0, 0) = rng.uniform(tMinVal, tMaxVal);
        tvec(0, 1) = rng.uniform(tMinVal, tMaxVal);
        tvec(0, 2) = rng.uniform(tMinVal, tMaxVal);

        for (var y = 0; y < objPoints.rows; y++ )
        {
            var point = new alvision.Mat(1, 3, CV_32FC1, objPoints.ptr(y));
            var z = rng.uniform(zMinVal, zMaxVal);
            point.at<float>(0, 2) = z;
            point.at<float>(0, 0) = (rng.uniform(2., (float)(imgSize.width - 2)) - cameraMatrix(0, 2)) / cameraMatrix(0, 0) * z;
            point.at<float>(0, 1) = (rng.uniform(2., (float)(imgSize.height - 2)) - cameraMatrix(1, 2)) / cameraMatrix(1, 1) * z;
            point = (point - tvec) * rmat;
        }

        Array < Point2f > imgPoints;
        Array < Array < Point2f > > leftImgPoints;
        Array < Array < Point2f > > rightImgPoints;
        Mat dpdrot, dpdt, dpdf, dpdc, dpddist,
            valDpdrot, valDpdt, valDpdf, valDpdc, valDpddist;

        project(objPoints, rvec, tvec, cameraMatrix, distCoeffs,
            imgPoints, dpdrot, dpdt, dpdf, dpdc, dpddist, 0);

        // calculate and check image points
        assert((int)imgPoints.size() == pointCount);
        Array<Point2f>::const_iterator it = imgPoints.begin();
        for (int i = 0; i < pointCount; i++ , ++it )
        {
            Point3d p(objPoints(i, 0), objPoints(i, 1), objPoints(i, 2));
            var z = p.x * rmat(2, 0) + p.y * rmat(2, 1) + p.z * rmat(2, 2) + tvec(0, 2),
                x = (p.x * rmat(0, 0) + p.y * rmat(0, 1) + p.z * rmat(0, 2) + tvec(0, 0)) / z,
                y = (p.x * rmat(1, 0) + p.y * rmat(1, 1) + p.z * rmat(1, 2) + tvec(0, 1)) / z,
                r2 = x * x + y * y,
                r4 = r2 * r2;
            var validImgPoint = new alvision.Point2f();
            var a1 = 2 * x * y,
                a2 = r2 + 2 * x * x,
                a3 = r2 + 2 * y * y,
                cdist = 1 + distCoeffs(0, 0) * r2 + distCoeffs(0, 1) * r4;
            validImgPoint.x = static_cast<float>((double)cameraMatrix(0, 0) * (x * cdist + (double)distCoeffs(0, 2) * a1 + (double)distCoeffs(0, 3) * a2)
                + (double)cameraMatrix(0, 2));
            validImgPoint.y = static_cast<float>((double)cameraMatrix(1, 1) * (y * cdist + (double)distCoeffs(0, 2) * a3 + distCoeffs(0, 3) * a1)
                + (double)cameraMatrix(1, 2));

            if (Math.abs(it.x - validImgPoint.x) > imgPointErr ||
                Math.abs(it.y - validImgPoint.y) > imgPointErr) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "bad image point\n");
                code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
                goto _exit_;
            }
        }

        // check derivatives
        // 1. rotation
        leftImgPoints.resize(3);
        rightImgPoints.resize(3);
        for (var i = 0; i < 3; i++ )
        {
            rvec.copyTo(leftRvec); leftRvec(0, i) -= dEps;
            project(objPoints, leftRvec, tvec, cameraMatrix, distCoeffs,
                leftImgPoints[i], valDpdrot, valDpdt, valDpdf, valDpdc, valDpddist, 0);
            rvec.copyTo(rightRvec); rightRvec(0, i) += dEps;
            project(objPoints, rightRvec, tvec, cameraMatrix, distCoeffs,
                rightImgPoints[i], valDpdrot, valDpdt, valDpdf, valDpdc, valDpddist, 0);
        }
        calcdfdx(leftImgPoints, rightImgPoints, dEps, valDpdrot);
        err = alvision.cvtest.norm(dpdrot, valDpdrot, NORM_INF);
        if (err > 3) {
            ts.printf(alvision.cvtest.TSConstants.LOG, "bad dpdrot: too big difference = %g\n", err);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
        }

        // 2. translation
        for (var i = 0; i < 3; i++ )
        {
            tvec.copyTo(leftTvec); leftTvec(0, i) -= dEps;
            project(objPoints, rvec, leftTvec, cameraMatrix, distCoeffs,
                leftImgPoints[i], valDpdrot, valDpdt, valDpdf, valDpdc, valDpddist, 0);
            tvec.copyTo(rightTvec); rightTvec(0, i) += dEps;
            project(objPoints, rvec, rightTvec, cameraMatrix, distCoeffs,
                rightImgPoints[i], valDpdrot, valDpdt, valDpdf, valDpdc, valDpddist, 0);
        }
        calcdfdx(leftImgPoints, rightImgPoints, dEps, valDpdt);
        if (alvision.cvtest.norm(dpdt, valDpdt, NORM_INF) > 0.2) {
            ts.printf(alvision.cvtest.TSConstants.LOG, "bad dpdtvec\n");
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
        }

        // 3. camera matrix
        // 3.1. focus
        leftImgPoints.resize(2);
        rightImgPoints.resize(2);
        cameraMatrix.copyTo(leftCameraMatrix); leftCameraMatrix(0, 0) -= dEps;
        project(objPoints, rvec, tvec, leftCameraMatrix, distCoeffs,
            leftImgPoints[0], valDpdrot, valDpdt, valDpdf, valDpdc, valDpddist, 0);
        cameraMatrix.copyTo(leftCameraMatrix); leftCameraMatrix(1, 1) -= dEps;
        project(objPoints, rvec, tvec, leftCameraMatrix, distCoeffs,
            leftImgPoints[1], valDpdrot, valDpdt, valDpdf, valDpdc, valDpddist, 0);
        cameraMatrix.copyTo(rightCameraMatrix); rightCameraMatrix(0, 0) += dEps;
        project(objPoints, rvec, tvec, rightCameraMatrix, distCoeffs,
            rightImgPoints[0], valDpdrot, valDpdt, valDpdf, valDpdc, valDpddist, 0);
        cameraMatrix.copyTo(rightCameraMatrix); rightCameraMatrix(1, 1) += dEps;
        project(objPoints, rvec, tvec, rightCameraMatrix, distCoeffs,
            rightImgPoints[1], valDpdrot, valDpdt, valDpdf, valDpdc, valDpddist, 0);
        calcdfdx(leftImgPoints, rightImgPoints, dEps, valDpdf);
        if (alvision.cvtest.norm(dpdf, valDpdf, alvision.NormTypes.NORM_L2) > 0.2) {
            ts.printf(alvision.cvtest.TSConstants.LOG, "bad dpdf\n");
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
        }
        // 3.2. principal point
        leftImgPoints.resize(2);
        rightImgPoints.resize(2);
        cameraMatrix.copyTo(leftCameraMatrix); leftCameraMatrix(0, 2) -= dEps;
        project(objPoints, rvec, tvec, leftCameraMatrix, distCoeffs,
            leftImgPoints[0], valDpdrot, valDpdt, valDpdf, valDpdc, valDpddist, 0);
        cameraMatrix.copyTo(leftCameraMatrix); leftCameraMatrix(1, 2) -= dEps;
        project(objPoints, rvec, tvec, leftCameraMatrix, distCoeffs,
            leftImgPoints[1], valDpdrot, valDpdt, valDpdf, valDpdc, valDpddist, 0);
        cameraMatrix.copyTo(rightCameraMatrix); rightCameraMatrix(0, 2) += dEps;
        project(objPoints, rvec, tvec, rightCameraMatrix, distCoeffs,
            rightImgPoints[0], valDpdrot, valDpdt, valDpdf, valDpdc, valDpddist, 0);
        cameraMatrix.copyTo(rightCameraMatrix); rightCameraMatrix(1, 2) += dEps;
        project(objPoints, rvec, tvec, rightCameraMatrix, distCoeffs,
            rightImgPoints[1], valDpdrot, valDpdt, valDpdf, valDpdc, valDpddist, 0);
        calcdfdx(leftImgPoints, rightImgPoints, dEps, valDpdc);
        if (alvision.cvtest.norm(dpdc, valDpdc, alvision.NormTypes.NORM_L2) > 0.2) {
            ts.printf(alvision.cvtest.TSConstants.LOG, "bad dpdc\n");
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
        }

        // 4. distortion
        leftImgPoints.resize(distCoeffs.cols);
        rightImgPoints.resize(distCoeffs.cols);
        for (var i = 0; i < distCoeffs.cols; i++ )
        {
            distCoeffs.copyTo(leftDistCoeffs); leftDistCoeffs(0, i) -= dEps;
            project(objPoints, rvec, tvec, cameraMatrix, leftDistCoeffs,
                leftImgPoints[i], valDpdrot, valDpdt, valDpdf, valDpdc, valDpddist, 0);
            distCoeffs.copyTo(rightDistCoeffs); rightDistCoeffs(0, i) += dEps;
            project(objPoints, rvec, tvec, cameraMatrix, rightDistCoeffs,
                rightImgPoints[i], valDpdrot, valDpdt, valDpdf, valDpdc, valDpddist, 0);
        }
        calcdfdx(leftImgPoints, rightImgPoints, dEps, valDpddist);
        if (alvision.cvtest.norm(dpddist, valDpddist, alvision.NormTypes.NORM_L2) > 0.3) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "bad dpddist\n");
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
        }

        _exit_:
        var _rng = this.ts.get_rng();
        _rng = rng;
        this.ts.set_failed_test_info(code);
    }
    project(objectPoints: alvision.Mat ,
        rvec: alvision.Mat, tvec: alvision.Mat,
        cameraMatrix: alvision.Mat,
        distCoeffs: alvision.Mat,
        imagePoints: Array<alvision.Point2f>,
        dpdrot: alvision.Mat, dpdt: alvision.Mat, dpdf: alvision.Mat,
        dpdc: alvision.Mat, dpddist: alvision.Mat,
        aspectRatio: alvision.double = 0): void {
    }
};


//----------------------------------------- CV_ProjectPointsTest_C --------------------------------
//class CV_ProjectPointsTest_C extends CV_ProjectPointsTest
//{
//public:
//    CV_ProjectPointsTest_C() {}
//protected:
//    virtual void project( const Mat& objectPoints,
//        const Mat& rvec, const Mat& tvec,
//        const Mat& cameraMatrix,
//        const Mat& distCoeffs,
//        Array<Point2f>& imagePoints,
//        Mat& dpdrot, Mat& dpdt, Mat& dpdf,
//        Mat& dpdc, Mat& dpddist,
//        double aspectRatio=0 );
//};
//
//void CV_ProjectPointsTest_C::project( const Mat& opoints, const Mat& rvec, const Mat& tvec,
//                                       const Mat& cameraMatrix, const Mat& distCoeffs, Array<Point2f>& ipoints,
//                                       Mat& dpdrot, Mat& dpdt, Mat& dpdf, Mat& dpdc, Mat& dpddist, double aspectRatio)
//{
//    int npoints = opoints.cols*opoints.rows*opoints.channels()/3;
//    ipoints.resize(npoints);
//    dpdrot.create(npoints*2, 3, CV_64F);
//    dpdt.create(npoints*2, 3, CV_64F);
//    dpdf.create(npoints*2, 2, CV_64F);
//    dpdc.create(npoints*2, 2, CV_64F);
//    dpddist.create(npoints*2, distCoeffs.rows + distCoeffs.cols - 1, CV_64F);
//    CvMat _objectPoints = opoints, _imagePoints = Mat(ipoints);
//    CvMat _rvec = rvec, _tvec = tvec, _cameraMatrix = cameraMatrix, _distCoeffs = distCoeffs;
//    CvMat _dpdrot = dpdrot, _dpdt = dpdt, _dpdf = dpdf, _dpdc = dpdc, _dpddist = dpddist;
//
//    cvProjectPoints2( &_objectPoints, &_rvec, &_tvec, &_cameraMatrix, &_distCoeffs,
//                      &_imagePoints, &_dpdrot, &_dpdt, &_dpdf, &_dpdc, &_dpddist, aspectRatio );
//}


//----------------------------------------- CV_ProjectPointsTest_CPP --------------------------------
class CV_ProjectPointsTest_CPP extends CV_ProjectPointsTest
{
    constructor() {
        super();

    }
    project(objectPoints: alvision.Mat,
        rvec: alvision.Mat, tvec: alvision.Mat,
        cameraMatrix: alvision.Mat,
        distCoeffs: alvision.Mat,
        imagePoints: Array<alvision.Point2f>,
        dpdrot: alvision.Mat, dpdt: alvision.Mat, dpdf: alvision.Mat,
        dpdc: alvision.Mat, dpddist: alvision.Mat,
        aspectRatio: alvision.double = 0): void {

        var J = new alvision.Mat()
        alvision.projectPoints(objectPoints, rvec, tvec, cameraMatrix, distCoeffs, imagePoints, J, aspectRatio);
        J.colRange(0, 3).copyTo(dpdrot);
        J.colRange(3, 6).copyTo(dpdt);
        J.colRange(6, 8).copyTo(dpdf);
        J.colRange(8, 10).copyTo(dpdc);
        J.colRange(10, J.cols).copyTo(dpddist);
    }
};

///////////////////////////////// Stereo Calibration /////////////////////////////////////

class CV_StereoCalibrationTest extends alvision.cvtest.BaseTest
{
    constructor() {
        super();
    }

    clear(): void {
        super.clear();
    }

    checkPandROI(test_case_idx: alvision.int,
        M: alvision.Mat, D: alvision.Mat, R: alvision.Mat,
        P: alvision.Mat, imgsize: alvision.Size, roi: alvision.Rect): boolean {

        const eps = 0.05;
        const N = 21;
        //int x, y, k;
            var pts = new Array<alvision.Point2f>();
            var upts = new Array<alvision.Point2f>();

        // step 1. check that all the original points belong to the destination image
        for (var y = 0; y < N; y++)
            for (var x = 0; x < N; x++)
                pts.push(new alvision.Point2f((float)x* imgsize.width / (N - 1), (float)y* imgsize.height / (N - 1)));

        undistortPoints(new alvision.Mat(pts), upts, M, D, R, P);
        for (var k = 0; k < N * N; k++)
            if (upts[k].x < -imgsize.width * eps || upts[k].x > imgsize.width * (1 + eps) ||
                upts[k].y < -imgsize.height * eps || upts[k].y > imgsize.height * (1 + eps)) {
                ts.printf(alvision.cvtest.TSConstants.LOG, "Test #%d. The point (%g, %g) was mapped to (%g, %g) which is out of image\n",
                    test_case_idx, pts[k].x, pts[k].y, upts[k].x, upts[k].y);
                return false;
            }

        // step 2. check that all the points inside ROI belong to the original source image
        Mat temp(imgsize, CV_8U), utemp, map1, map2;
        temp = Scalar::all(1);
        initUndistortRectifyMap(M, D, R, P, imgsize, CV_16SC2, map1, map2);
        remap(temp, utemp, map1, map2, INTER_LINEAR);

        if (roi.x < 0 || roi.y < 0 || roi.x + roi.width > imgsize.width || roi.y + roi.height > imgsize.height) {
            ts.printf(alvision.cvtest.TSConstants.LOG, "Test #%d. The ROI=(%d, %d, %d, %d) is outside of the imge rectangle\n",
                test_case_idx, roi.x, roi.y, roi.width, roi.height);
            return false;
        }
        double s = sum(utemp(roi))[0];
        if (s > roi.area() || roi.area() - s > roi.area() * (1 - eps)) {
            ts.printf(alvision.cvtest.TSConstants.LOG, "Test #%d. The ratio of black pixels inside the valid ROI (~%g%%) is too large\n",
                test_case_idx, s * 100. / roi.area());
            return false;
        }

        return true;
    }

    // covers of tested functions
    calibrateStereoCamera(objectPoints: Array<Array<alvision.Point3f>>,
        imagePoints1: Array<Array<alvision.Point2f>>,
        imagePoints2: Array<Array<alvision.Point2f>>,
        cameraMatrix1: alvision.Mat, distCoeffs1: alvision.Mat,
        cameraMatrix2: alvision.Mat, distCoeffs2: alvision.Mat,
        imageSize: alvision.Size, R: alvision.Mat, T: alvision.Mat,
        E: alvision.Mat, F: alvision.Mat, criteria: alvision.TermCriteria, flags: alvision.int): alvision.double { }

    rectify(cameraMatrix1: alvision.Mat, distCoeffs1: alvision.Mat ,
        cameraMatrix2: alvision.Mat, distCoeffs2: alvision.Mat ,
        imageSize: alvision.Size, R: alvision.Mat, T: alvision.Mat ,
        R1: alvision.Mat, R2: alvision.Mat, P1: alvision.Mat, P2: alvision.Mat, Q: alvision.Mat,
        alpha: alvision.double, newImageSize: alvision.Size,
        validPixROI1: alvision.Rect, validPixROI2: alvision.Rect, flags: alvision.int): void { }

    rectifyUncalibrated(points1: alvision.Mat,
        points2: alvision.Mat, F: alvision.Mat, imgSize: alvision.Size,
        H1: alvision.Mat, H2: alvision.Mat, threshold: alvision.double = 5): boolean { }

    triangulate(P1: alvision.Mat, P2: alvision.Mat,
        points1: alvision.Mat, points2: alvision.Mat,
        points4D: alvision.Mat): void { }

    correct(F: alvision.Mat,
        points1: alvision.Mat, points2: alvision.Mat,
        newPoints1: alvision.Mat, newPoints2: alvision.Mat) { }

        run(iii: alvision.int): void {
            const ntests = 1;
            const  maxReprojErr = 2;
            const  maxScanlineDistErr_c = 3;
            const  maxScanlineDistErr_uc = 4;
            FILE * f = 0;

            for (var testcase = 1; testcase <= ntests; testcase++)
            {
                //alvision.String filepath;
                char buf[1000];
                var filepath = alvision.format("%scv/stereo/case%d/stereo_calib.txt", this.ts.get_data_path(), testcase);
                f = fopen(filepath, "rt");
                Size patternSize;
                Array < string > imglist;

                if (!f || !fgets(buf, sizeof(buf) - 3, f) || sscanf(buf, "%d%d", &patternSize.width, &patternSize.height) != 2) {
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "The file %s can not be opened or has invalid content\n", filepath);
                    this.ts.set_failed_test_info(f ? alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA : alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA);
                    fclose(f);
                    return;
                }

                for (; ;) {
                    if (!fgets(buf, sizeof(buf) - 3, f))
                        break;
                    size_t len = strlen(buf);
                    while (len > 0 && isspace(buf[len - 1]))
                        buf[--len] = '\0';
                    if (buf[0] == '#')
                        continue;
                    filepath = alvision.format("%scv/stereo/case%d/%s", ts.get_data_path(), testcase, buf);
                    imglist.push(string(filepath));
                }
                fclose(f);

                if (imglist.size() == 0 || imglist.size() % 2 != 0) {
                    ts.printf(alvision.cvtest.TSConstants.LOG, "The number of images is 0 or an odd number in the case #%d\n", testcase);
                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
                    return;
                }

                var nframes = (int)(imglist.size() / 2);
                var npoints = patternSize.width * patternSize.height;
                var objpt = new Array<Array<alvision.Point3f>> (nframes);
                var imgpt1 = new Array<Array<alvision.Point2f>> (nframes);
                var imgpt2 = new Array<Array<alvision.Point2f>> (nframes);
                var imgsize = new alvision.Size();
                var total = 0;

                for (var i = 0; i < nframes; i++ )
                {
                    var left =  alvision.imread(imglist[i * 2]);
                    var right = alvision.imread(imglist[i * 2 + 1]);
                    if (left.empty() || right.empty()) {
                        this.ts.printf(alvision.cvtest.TSConstants.LOG, "Can not load images %s and %s, testcase %d\n",
                            imglist[i * 2], imglist[i * 2 + 1], testcase);
                        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA);
                        return;
                    }
                    imgsize = left.size();
                    var found1 = findChessboardCorners(left, patternSize, imgpt1[i]);
                    var found2 = findChessboardCorners(right, patternSize, imgpt2[i]);
                    if (!found1 || !found2) {
                        this.ts.printf(alvision.cvtest.TSConstants.LOG, "The function could not detect boards on the images %s and %s, testcase %d\n",
                            imglist[i * 2], imglist[i * 2 + 1], testcase);
                        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                        return;
                    }
                    total += (int)imgpt1[i].size();
                    for (var j = 0; j < npoints; j++ )
                    objpt[i].push(new alvision.Point3f((float)(j % patternSize.width), (float)(j / patternSize.width), 0.f));
                }

                // rectify (calibrated)
                var M1 = alvision.Mat.from(alvision.Mat.eye(3, 3,  alvision.MatrixType.CV_64F));
                var M2 = alvision.Mat.from(alvision.Mat.eye(3, 3, alvision.MatrixType.CV_64F));
                var D1 = new alvision.Mat(5, 1, alvision.MatrixType.CV_64F);
                var D2 = new alvision.Mat(5, 1, alvision.MatrixType.CV_64F);
                var R = new alvision.Mat();
                    var T = new alvision.Mat();
                    var E = new alvision.Mat();
                    var F = new alvision.Mat();



                M1.at<double>(0, 2) = M2.at<double>(0, 2) = (imgsize.width - 1) * 0.5;
                M1.at<double>(1, 2) = M2.at<double>(1, 2) = (imgsize.height - 1) * 0.5;
                D1 = alvision.Scalar.all(0);
                D2 = alvision.Scalar.all(0);
                var err = calibrateStereoCamera(objpt, imgpt1, imgpt2, M1, D1, M2, D2, imgsize, R, T, E, F,
                    new alvision.TermCriteria(TermCriteria::MAX_ITER + TermCriteria::EPS, 30, 1e-6),
                    CV_CALIB_SAME_FOCAL_LENGTH
                    //+ CV_CALIB_FIX_ASPECT_RATIO
                    + CV_CALIB_FIX_PRINCIPAL_POINT
                    + CV_CALIB_ZERO_TANGENT_DIST
                    + CV_CALIB_FIX_K3
                    + CV_CALIB_FIX_K4 + CV_CALIB_FIX_K5 //+ CV_CALIB_FIX_K6
                );
                err /= nframes * npoints;
                if (err > maxReprojErr) {
                    ts.printf(alvision.cvtest.TSConstants.LOG, "The average reprojection error is too big (=%g), testcase %d\n", err, testcase);
                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                    return;
                }

                Mat R1, R2, P1, P2, Q;
                Rect roi1, roi2;
                rectify(M1, D1, M2, D2, imgsize, R, T, R1, R2, P1, P2, Q, 1, imgsize, &roi1, &roi2, 0);
                Mat eye33 = Mat::eye(3, 3, CV_64F);
                Mat R1t = R1.t(), R2t = R2.t();

                if (alvision.cvtest.norm(R1t * R1 - eye33, alvision.NormTypes.NORM_L2) > 0.01 ||
                    alvision.cvtest.norm(R2t * R2 - eye33, alvision.NormTypes.NORM_L2) > 0.01 ||
                    abs(determinant(F)) > 0.01) {
                    ts.printf(alvision.cvtest.TSConstants.LOG, "The computed (by rectify) R1 and R2 are not orthogonal,"
                "or the computed (by calibrate) F is not singular, testcase %d\n", testcase);
                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                    return;
                }

                if (!checkPandROI(testcase, M1, D1, R1, P1, imgsize, roi1)) {
                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                    return;
                }

                if (!checkPandROI(testcase, M2, D2, R2, P2, imgsize, roi2)) {
                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                    return;
                }

                //check that Tx after rectification is equal to distance between cameras
                var tx = Math.abs(P2.at<double>(0, 3) / P2.at<double>(0, 0));
                if (Math.abs(tx - alvision.cvtest.norm(T, alvision.NormTypes.NORM_L2)) > 1e-5) {
                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                    return;
                }

                //check that Q reprojects points before the camera
                var testPoint = [ 0.0, 0.0, 100.0, 1.0];
                Mat reprojectedTestPoint = Q * Mat_<double>(4, 1, testPoint);
                alvision.CV_Assert(()=>reprojectedTestPoint.type() ==alvision.MatrixType. CV_64FC1);
                if (reprojectedTestPoint.at<double>(2) / reprojectedTestPoint.at<double>(3) < 0) {
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "A point after rectification is reprojected behind the camera, testcase %d\n", testcase);
                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                }

                //check that Q reprojects the same points as reconstructed by triangulation
                const  minCoord = -300.0;
                const  maxCoord = 300.0;
                const  minDisparity = 0.1;
                const  maxDisparity = 600.0;
                const  pointsCount = 500;
                const  requiredAccuracy = 1e-3;
                var rng = this.ts.get_rng();

                Mat projectedPoints_1(2, pointsCount, CV_32FC1);
                Mat projectedPoints_2(2, pointsCount, CV_32FC1);
                Mat disparities(1, pointsCount, CV_32FC1);

                rng.fill(projectedPoints_1, RNG::UNIFORM, minCoord, maxCoord);
                rng.fill(disparities, RNG::UNIFORM, minDisparity, maxDisparity);
                projectedPoints_2.row(0) = projectedPoints_1.row(0) - disparities;
                Mat ys_2 = projectedPoints_2.row(1);
                projectedPoints_1.row(1).copyTo(ys_2);

                Mat points4d;
                triangulate(P1, P2, projectedPoints_1, projectedPoints_2, points4d);
                Mat homogeneousPoints4d = points4d.t();
                const int dimension = 4;
                homogeneousPoints4d = homogeneousPoints4d.reshape(dimension);
                Mat triangulatedPoints;
                convertPointsFromHomogeneous(homogeneousPoints4d, triangulatedPoints);

                Mat sparsePoints;
                sparsePoints.push(projectedPoints_1);
                sparsePoints.push(disparities);
                sparsePoints = sparsePoints.t();
                sparsePoints = sparsePoints.reshape(3);
                Mat reprojectedPoints;
                perspectiveTransform(sparsePoints, reprojectedPoints, Q);

                if (alvision.cvtest.norm(triangulatedPoints, reprojectedPoints, alvision.NormTypes.NORM_L2) / sqrt((double)pointsCount) > requiredAccuracy) {
                    ts.printf(alvision.cvtest.TSConstants.LOG, "Points reprojected with a matrix Q and points reconstructed by triangulation are different, testcase %d\n", testcase);
                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                }

                //check correctMatches
                const float constraintAccuracy = 1e-5f;
                Mat newPoints1, newPoints2;
                Mat points1 = projectedPoints_1.t();
                points1 = points1.reshape(2, 1);
                Mat points2 = projectedPoints_2.t();
                points2 = points2.reshape(2, 1);
                correctMatches(F, points1, points2, newPoints1, newPoints2);
                Mat newHomogeneousPoints1, newHomogeneousPoints2;
                convertPointsToHomogeneous(newPoints1, newHomogeneousPoints1);
                convertPointsToHomogeneous(newPoints2, newHomogeneousPoints2);
                newHomogeneousPoints1 = newHomogeneousPoints1.reshape(1);
                newHomogeneousPoints2 = newHomogeneousPoints2.reshape(1);
                Mat typedF;
                F.convertTo(typedF, newHomogeneousPoints1.type());
                for (int i = 0; i < newHomogeneousPoints1.rows; ++i)
                {
                    Mat error = newHomogeneousPoints2.row(i) * typedF * newHomogeneousPoints1.row(i).t();
                    CV_Assert(error.rows == 1 && error.cols == 1);
                    if (alvision.cvtest.norm(error, alvision.NormTypes.NORM_L2) > constraintAccuracy) {
                        ts.printf(alvision.cvtest.TSConstants.LOG, "Epipolar constraint is violated after correctMatches, testcase %d\n", testcase);
                        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                    }
                }

                // rectifyUncalibrated
                alvision.CV_Assert(()=>imgpt1.size() == imgpt2.size());
                Mat _imgpt1(total, 1, CV_32FC2), _imgpt2(total, 1, CV_32FC2);
                Array<Array<Point2f>>::const_iterator iit1 = imgpt1.begin();
                Array<Array<Point2f>>::const_iterator iit2 = imgpt2.begin();
                for (int pi = 0; iit1 != imgpt1.end(); ++iit1, ++iit2 )
                {
                    Array<Point2f>::const_iterator pit1 = iit1.begin();
                    Array<Point2f>::const_iterator pit2 = iit2.begin();
                    CV_Assert(iit1.size() == iit2.size());
                    for (; pit1 != iit1.end(); ++pit1, ++pit2, pi++) {
                        _imgpt1.at<Point2f>(pi, 0) = Point2f(pit1.x, pit1.y);
                        _imgpt2.at<Point2f>(pi, 0) = Point2f(pit2.x, pit2.y);
                    }
                }

                Mat _M1, _M2, _D1, _D2;
                Array < Mat > _R1, _R2, _T1, _T2;
                calibrateCamera(objpt, imgpt1, imgsize, _M1, _D1, _R1, _T1, 0);
                calibrateCamera(objpt, imgpt2, imgsize, _M2, _D2, _R2, _T2, 0);
                undistortPoints(_imgpt1, _imgpt1, _M1, _D1, Mat(), _M1);
                undistortPoints(_imgpt2, _imgpt2, _M2, _D2, Mat(), _M2);

                Mat matF, _H1, _H2;
                matF = findFundamentalMat(_imgpt1, _imgpt2);
                rectifyUncalibrated(_imgpt1, _imgpt2, matF, imgsize, _H1, _H2);

                Mat rectifPoints1, rectifPoints2;
                perspectiveTransform(_imgpt1, rectifPoints1, _H1);
                perspectiveTransform(_imgpt2, rectifPoints2, _H2);

                var verticalStereo = abs(P2.at<double>(0, 3)) < abs(P2.at<double>(1, 3));
                var maxDiff_c = 0, maxDiff_uc = 0;
                for (var i = 0, k = 0; i < nframes; i++ )
                {
                    Array < Point2f > temp[2];
                    undistortPoints(Mat(imgpt1[i]), temp[0], M1, D1, R1, P1);
                    undistortPoints(Mat(imgpt2[i]), temp[1], M2, D2, R2, P2);

                    for (int j = 0; j < npoints; j++ , k++ )
                    {
                        var diff_c = verticalStereo ? abs(temp[0][j].x - temp[1][j].x) : abs(temp[0][j].y - temp[1][j].y);
                        Point2f d = rectifPoints1.at<Point2f>(k, 0) - rectifPoints2.at<Point2f>(k, 0);
                        double diff_uc = verticalStereo ? abs(d.x) : abs(d.y);
                        maxDiff_c = max(maxDiff_c, diff_c);
                        maxDiff_uc = max(maxDiff_uc, diff_uc);
                        if (maxDiff_c > maxScanlineDistErr_c) {
                            ts.printf(alvision.cvtest.TSConstants.LOG, "The distance between %s coordinates is too big(=%g) (used calibrated stereo), testcase %d\n",
                                verticalStereo ? "x" : "y", diff_c, testcase);
                            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                            return;
                        }
                        if (maxDiff_uc > maxScanlineDistErr_uc) {
                            ts.printf(alvision.cvtest.TSConstants.LOG, "The distance between %s coordinates is too big(=%g) (used uncalibrated stereo), testcase %d\n",
                                verticalStereo ? "x" : "y", diff_uc, testcase);
                            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                            return;
                        }
                    }
                }

                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Testcase %d. Max distance (calibrated) =%g\n Max distance (uncalibrated) =%g\n", testcase, maxDiff_c, maxDiff_uc);
            }

        }
};



//-------------------------------- CV_StereoCalibrationTest_C ------------------------------
//
//class CV_StereoCalibrationTest_C extends CV_StereoCalibrationTest
//{
//public:
//    CV_StereoCalibrationTest_C() {}
//protected:
//    virtual double calibrateStereoCamera( const Array<Array<Point3f> >& objectPoints,
//        const Array<Array<Point2f> >& imagePoints1,
//        const Array<Array<Point2f> >& imagePoints2,
//        Mat& cameraMatrix1, Mat& distCoeffs1,
//        Mat& cameraMatrix2, Mat& distCoeffs2,
//        Size imageSize, Mat& R, Mat& T,
//        Mat& E, Mat& F, TermCriteria criteria, int flags );
//    virtual void rectify( const Mat& cameraMatrix1, const Mat& distCoeffs1,
//        const Mat& cameraMatrix2, const Mat& distCoeffs2,
//        Size imageSize, const Mat& R, const Mat& T,
//        Mat& R1, Mat& R2, Mat& P1, Mat& P2, Mat& Q,
//        double alpha, Size newImageSize,
//        Rect* validPixROI1, Rect* validPixROI2, int flags );
//    virtual bool rectifyUncalibrated( const Mat& points1,
//        const Mat& points2, const Mat& F, Size imgSize,
//        Mat& H1, Mat& H2, double threshold=5 );
//    virtual void triangulate( const Mat& P1, const Mat& P2,
//        const Mat &points1, const Mat &points2,
//        Mat &points4D );
//    virtual void correct( const Mat& F,
//        const Mat &points1, const Mat &points2,
//        Mat &newPoints1, Mat &newPoints2 );
//};
//
//double CV_StereoCalibrationTest_C::calibrateStereoCamera( const Array<Array<Point3f> >& objectPoints,
//                 const Array<Array<Point2f> >& imagePoints1,
//                 const Array<Array<Point2f> >& imagePoints2,
//                 Mat& cameraMatrix1, Mat& distCoeffs1,
//                 Mat& cameraMatrix2, Mat& distCoeffs2,
//                 Size imageSize, Mat& R, Mat& T,
//                 Mat& E, Mat& F, TermCriteria criteria, int flags )
//{
//    cameraMatrix1.create( 3, 3, CV_64F );
//    cameraMatrix2.create( 3, 3, CV_64F);
//    distCoeffs1.create( 1, 5, CV_64F);
//    distCoeffs2.create( 1, 5, CV_64F);
//    R.create(3, 3, CV_64F);
//    T.create(3, 1, CV_64F);
//    E.create(3, 3, CV_64F);
//    F.create(3, 3, CV_64F);
//
//    int  nimages = (int)objectPoints.size(), total = 0;
//    for( int i = 0; i < nimages; i++ )
//    {
//        total += (int)objectPoints[i].size();
//    }
//
//    Mat npoints( 1, nimages, CV_32S ),
//        objPt( 1, total, DataType<Point3f>::type ),
//        imgPt( 1, total, DataType<Point2f>::type ),
//        imgPt2( 1, total, DataType<Point2f>::type );
//
//    Point2f* imgPtData2 = imgPt2.ptr<Point2f>();
//    Point3f* objPtData = objPt.ptr<Point3f>();
//    Point2f* imgPtData = imgPt.ptr<Point2f>();
//    for( int i = 0, ni = 0, j = 0; i < nimages; i++, j += ni )
//    {
//        ni = (int)objectPoints[i].size();
//        npoints.ptr<int>()[i] = ni;
//        std::copy(objectPoints[i].begin(), objectPoints[i].end(), objPtData + j);
//        std::copy(imagePoints1[i].begin(), imagePoints1[i].end(), imgPtData + j);
//        std::copy(imagePoints2[i].begin(), imagePoints2[i].end(), imgPtData2 + j);
//    }
//    CvMat _objPt = objPt, _imgPt = imgPt, _imgPt2 = imgPt2, _npoints = npoints;
//    CvMat _cameraMatrix1 = cameraMatrix1, _distCoeffs1 = distCoeffs1;
//    CvMat _cameraMatrix2 = cameraMatrix2, _distCoeffs2 = distCoeffs2;
//    CvMat matR = R, matT = T, matE = E, matF = F;
//
//    return cvStereoCalibrate(&_objPt, &_imgPt, &_imgPt2, &_npoints, &_cameraMatrix1,
//        &_distCoeffs1, &_cameraMatrix2, &_distCoeffs2, imageSize,
//        &matR, &matT, &matE, &matF, flags, criteria );
//}
//
//void CV_StereoCalibrationTest_C::rectify( const Mat& cameraMatrix1, const Mat& distCoeffs1,
//             const Mat& cameraMatrix2, const Mat& distCoeffs2,
//             Size imageSize, const Mat& R, const Mat& T,
//             Mat& R1, Mat& R2, Mat& P1, Mat& P2, Mat& Q,
//             double alpha, Size newImageSize,
//             Rect* validPixROI1, Rect* validPixROI2, int flags )
//{
//    int rtype = CV_64F;
//    R1.create(3, 3, rtype);
//    R2.create(3, 3, rtype);
//    P1.create(3, 4, rtype);
//    P2.create(3, 4, rtype);
//    Q.create(4, 4, rtype);
//    CvMat _cameraMatrix1 = cameraMatrix1, _distCoeffs1 = distCoeffs1;
//    CvMat _cameraMatrix2 = cameraMatrix2, _distCoeffs2 = distCoeffs2;
//    CvMat matR = R, matT = T, _R1 = R1, _R2 = R2, _P1 = P1, _P2 = P2, matQ = Q;
//    cvStereoRectify( &_cameraMatrix1, &_cameraMatrix2, &_distCoeffs1, &_distCoeffs2,
//        imageSize, &matR, &matT, &_R1, &_R2, &_P1, &_P2, &matQ, flags,
//        alpha, newImageSize, (CvRect*)validPixROI1, (CvRect*)validPixROI2);
//}
//
//bool CV_StereoCalibrationTest_C::rectifyUncalibrated( const Mat& points1,
//           const Mat& points2, const Mat& F, Size imgSize, Mat& H1, Mat& H2, double threshold )
//{
//    H1.create(3, 3, CV_64F);
//    H2.create(3, 3, CV_64F);
//    CvMat _pt1 = points1, _pt2 = points2, matF, *pF=0, _H1 = H1, _H2 = H2;
//    if( F.size() == Size(3, 3) )
//        pF = &(matF = F);
//    return cvStereoRectifyUncalibrated(&_pt1, &_pt2, pF, imgSize, &_H1, &_H2, threshold) > 0;
//}
//
//void CV_StereoCalibrationTest_C::triangulate( const Mat& P1, const Mat& P2,
//        const Mat &points1, const Mat &points2,
//        Mat &points4D )
//{
//    CvMat _P1 = P1, _P2 = P2, _points1 = points1, _points2 = points2;
//    points4D.create(4, points1.cols, points1.type());
//    CvMat _points4D = points4D;
//    cvTriangulatePoints(&_P1, &_P2, &_points1, &_points2, &_points4D);
//}
//
//void CV_StereoCalibrationTest_C::correct( const Mat& F,
//        const Mat &points1, const Mat &points2,
//        Mat &newPoints1, Mat &newPoints2 )
//{
//    CvMat _F = F, _points1 = points1, _points2 = points2;
//    newPoints1.create(1, points1.cols, points1.type());
//    newPoints2.create(1, points2.cols, points2.type());
//    CvMat _newPoints1 = newPoints1, _newPoints2 = newPoints2;
//    cvCorrectMatches(&_F, &_points1, &_points2, &_newPoints1, &_newPoints2);
//}
//
//-------------------------------- CV_StereoCalibrationTest_CPP ------------------------------

class CV_StereoCalibrationTest_CPP extends CV_StereoCalibrationTest
{
    constructor() {
        super();
    }

    calibrateStereoCamera(objectPoints: Array<Array<alvision.Point3f>>,
        imagePoints1: Array<Array<alvision.Point2f>>,
        imagePoints2: Array<Array<alvision.Point2f>>,
        cameraMatrix1: alvision.Mat, distCoeffs1: alvision.Mat,
        cameraMatrix2: alvision.Mat, distCoeffs2: alvision.Mat,
        imageSize: alvision.Size, R: alvision.Mat, T: alvision.Mat,
        E: alvision.Mat, F: alvision.Mat, criteria: alvision.TermCriteria, flags: alvision.int): alvision.double {

        return alvision.stereoCalibrate(objectPoints, imagePoints1, imagePoints2,
            cameraMatrix1, distCoeffs1, cameraMatrix2, distCoeffs2,
            imageSize, R, T, E, F, flags, criteria);
    }
    rectify(cameraMatrix1: alvision.Mat, distCoeffs1: alvision.Mat,
        cameraMatrix2: alvision.Mat, distCoeffs2: alvision.Mat,
        imageSize: alvision.Size, R: alvision.Mat, T: alvision.Mat ,
        R1: alvision.Mat, R2: alvision.Mat, P1: alvision.Mat, P2: alvision.Mat, Q: alvision.Mat ,
        alpha: alvision.double, newImageSize: alvision.Size ,
        validPixROI1: alvision.Rect, validPixROI2: alvision.Rect, flags: alvision.int): void {

        alvision.stereoRectify(cameraMatrix1, distCoeffs1, cameraMatrix2, distCoeffs2,
            imageSize, R, T, R1, R2, P1, P2, Q, flags, alpha, newImageSize, validPixROI1, validPixROI2);
    }
    rectifyUncalibrated(points1: alvision.Mat,
        points2: alvision.Mat, F: alvision.Mat, imgSize: alvision.Size,
        H1: alvision.Mat, H2: alvision.Mat, threshold: alvision.double = 5): boolean {
        return alvision.stereoRectifyUncalibrated(points1, points2, F, imgSize, H1, H2, threshold);
    }
    triangulate(P1: alvision.Mat, P2: alvision.Mat,
        points1: alvision.Mat, points2: alvision.Mat,
        points4D: alvision.Mat): void {
        alvision.triangulatePoints(P1, P2, points1, points2, points4D);
    }
    correct(F: alvision.Mat ,
        points1: alvision.Mat, points2: alvision.Mat,
        newPoints1: alvision.Mat, newPoints2: alvision.Mat) {
        alvision.correctMatches(F, points1, points2, newPoints1, newPoints2);
    }
};


///////////////////////////////////////////////////////////////////////////////////////////////////

//alvision.cvtest.TEST('Calib3d_CalibrateCamera_C', 'regression', () => { var test = new CV_CameraCalibrationTest_C(); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_CalibrateCamera_CPP', 'regression', () => { var test = new CV_CameraCalibrationTest_CPP (); test.safe_run(); });
//alvision.cvtest.TEST('Calib3d_CalibrationMatrixValues_C', 'accuracy', () => { var test = new CV_CalibrationMatrixValuesTest_C(); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_CalibrationMatrixValues_CPP', 'accuracy', () => { var test = new CV_CalibrationMatrixValuesTest_CPP(); test.safe_run(); });
//alvision.cvtest.TEST('Calib3d_ProjectPoints_C', 'accuracy', () => { var test = new CV_ProjectPointsTest_C (); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_ProjectPoints_CPP', 'regression', () => { var test = new CV_ProjectPointsTest_CPP(); test.safe_run(); });
//alvision.cvtest.TEST('Calib3d_StereoCalibrate_C', 'regression', () => { var test = new CV_StereoCalibrationTest_C(); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_StereoCalibrate_CPP', 'regression', () => { var test = new CV_StereoCalibrationTest_CPP(); test.safe_run(); });
