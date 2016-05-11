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
//#include <time.h>
//
const CALIB3D_HOMOGRAPHY_ERROR_MATRIX_SIZE = 1;
const CALIB3D_HOMOGRAPHY_ERROR_MATRIX_DIFF =2;
const CALIB3D_HOMOGRAPHY_ERROR_REPROJ_DIFF =3;
const CALIB3D_HOMOGRAPHY_ERROR_RANSAC_MASK =4;
const CALIB3D_HOMOGRAPHY_ERROR_RANSAC_DIFF =5;
//
const MESSAGE_MATRIX_SIZE = "Homography matrix must have 3*3 sizes.";
const MESSAGE_MATRIX_DIFF = "Accuracy of homography transformation matrix less than required.";
const MESSAGE_REPROJ_DIFF_1 = "Reprojection error for current pair of points more than required.";
const MESSAGE_REPROJ_DIFF_2 = "Reprojection error is not optimal.";
const MESSAGE_RANSAC_MASK_1 = "Sizes of inliers/outliers mask are incorrect.";
const MESSAGE_RANSAC_MASK_2 = "Mask mustn't have any outliers.";
const MESSAGE_RANSAC_MASK_3 = "All values of mask must be 1 (true) or 0 (false).";
const MESSAGE_RANSAC_MASK_4 = "Mask of inliers/outliers is incorrect.";
const MESSAGE_RANSAC_MASK_5 = "Inlier in original mask shouldn't be outlier in found mask.";
const MESSAGE_RANSAC_DIFF = "Reprojection error for current pair of points more than required.";
//
const MAX_COUNT_OF_POINTS = 303;
const COUNT_NORM_TYPES = 3;
const METHODS_COUNT = 4;
//
const NORM_TYPE = [alvision.NORM_L1, alvision.NORM_L2, alvision.NORM_INF];
const METHOD = [0, alvision.RANSAC, alvision.LMEDS, alvision.RHO];
//
//using namespace cv;
//using namespace std;

class CV_HomographyTest extends alvision.cvtest.ArrayTest {
    constructor() {
        super();
        this.max_diff = (1e-2);
        this.max_2diff = (2e-2);
        this.method = 0;
        this.image_size = 100;
        this.reproj_threshold = 3.0;
        this.sigma = 0.01;
    }

    run(iii: alvision.int): void {
        for (var N = 4; N <= MAX_COUNT_OF_POINTS; ++N) {
            var rng = this.ts.get_rng();

            var src_data = new Array<alvision.float>(2 * N);

            for (var i = 0; i < N; ++i) {
                src_data[2 * i] = alvision.cvtest.randReal(rng).valueOf() * this.image_size.valueOf();
                src_data[2 * i + 1] = alvision.cvtest.randReal(rng).valueOf() * this.image_size.valueOf();
            }

            var src_mat_2f = new alvision.Mat(1, N, alvision.MatrixType.CV_32FC2, src_data);
            var src_mat_2d = new alvision.Mat(2, N, alvision.MatrixType.CV_32F, src_data);
            var src_mat_3d = new alvision.Mat(3, N, alvision.MatrixType.CV_32F);
            var dst_mat_2f = new alvision.Mat();
            var dst_mat_2d = new alvision.Mat();
            var dst_mat_3d = new alvision.Mat();

            var src_vec = new Array<alvision.Point2f>();
            var dst_vec = new Array<alvision.Point2f>();

            for (var i = 0; i < N; ++i) {
                var tmp = src_mat_2d.ptr<alvision.float>("float") + 2 * i;
                src_mat_3d.at<float>(0, i) = tmp[0];
                src_mat_3d.at<float>(1, i) = tmp[1];
                src_mat_3d.at<float>(2, i) = 1.0;

                src_vec.push(new alvision.Point2f(tmp[0], tmp[1]));
            }

            var fi = alvision.cvtest.randReal(rng).valueOf() * 2 * Math.PI;

            var t_x = alvision.cvtest.randReal(rng).valueOf() * Math.sqrt(this.image_size.valueOf() * 1.0),
                t_y = alvision.cvtest.randReal(rng).valueOf() * Math.sqrt(this.image_size.valueOf() * 1.0);

            var Hdata = [Math.cos(fi), -Math.sin(fi), t_x,
                Math.sin(fi), Math.cos(fi), t_y,
                0.0, 0.0, 1.0];

            var H_64 = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F, Hdata), H_32 = new alvision.Mat();

            H_64.convertTo(H_32, alvision.MatrixType.CV_32F);

            dst_mat_3d = alvision.Mat.from(alvision.MatExpr.op_Multiplication(H_32, src_mat_3d));

            dst_mat_2d.create(2, N, alvision.MatrixType.CV_32F); dst_mat_2f.create(1, N, alvision.MatrixType.CV_32FC2);

            for (var i = 0; i < N; ++i) {
                var tmp_2f = dst_mat_2f.ptr<alvision.float>("float") + 2 * i;
                tmp_2f[0] = dst_mat_2d.at<float>(0, i) = dst_mat_3d.at<float>(0, i) /= dst_mat_3d.at<float>(2, i);
                tmp_2f[1] = dst_mat_2d.at<float>(1, i) = dst_mat_3d.at<float>(1, i) /= dst_mat_3d.at<float>(2, i);
                dst_mat_3d.at<float>(2, i) = 1.0f;

                dst_vec.push(new alvision.Point2f(tmp_2f[0], tmp_2f[1]));
            }

            for (var i = 0; i < METHODS_COUNT; ++i) {
                this.method = METHOD[i];
                switch (this.method) {
                    case 0:
                    case LMEDS:
                        {
                            var H_res_64  = [
                                alvision.findHomography(src_mat_2f, dst_mat_2f, this.method),
                                alvision.findHomography(src_mat_2f, dst_vec, this.method),
                                alvision.findHomography(src_vec, dst_mat_2f, this.method),
                                alvision.findHomography(src_vec, dst_vec, this.method)
                            ];

                            for (var j = 0; j < 4; ++j) {

                                if (!this.check_matrix_size(H_res_64[j])) {
                                    this.print_information_1(j, N,this. method, H_res_64[j]);
                                    alvision.CV_Error(CALIB3D_HOMOGRAPHY_ERROR_MATRIX_SIZE, MESSAGE_MATRIX_SIZE);
                                    return;
                                }

                                double diff;

                                for (var k = 0; k < COUNT_NORM_TYPES; ++k)
                                    if (!this.check_matrix_diff(H_64, H_res_64[j], NORM_TYPE[k], diff)) {
                                        this.print_information_2(j, N, this.method, H_64, H_res_64[j], k, diff);
                                        alvision.CV_Error(CALIB3D_HOMOGRAPHY_ERROR_MATRIX_DIFF, MESSAGE_MATRIX_DIFF);
                                        return;
                                    }
                            }

                            continue;
                        }
                    case alvision.RHO:
                    case RANSAC:
                        {
                            alvision.Mat mask [4]; double diff;

                            var H_res_64 = [
                                alvision.findHomography(src_mat_2f, dst_mat_2f, this.method,this. reproj_threshold, mask[0]),
                                alvision.findHomography(src_mat_2f, dst_vec, this.method,this. reproj_threshold, mask[1]),
                                alvision.findHomography(src_vec, dst_mat_2f, this.method,this. reproj_threshold, mask[2]),
                                alvision.findHomography(src_vec, dst_vec, this.method, this.reproj_threshold, mask[3])
                            ];

                            for (var j = 0; j < 4; ++j)
                            {

                                if (!this.check_matrix_size(H_res_64[j])) {
                                    this.print_information_1(j, N,this. method, H_res_64[j]);
                                    alvision.CV_Error(CALIB3D_HOMOGRAPHY_ERROR_MATRIX_SIZE, MESSAGE_MATRIX_SIZE);
                                    return;
                                }

                                for (var k = 0; k < COUNT_NORM_TYPES; ++k)
                                if (!this.check_matrix_diff(H_64, H_res_64[j], NORM_TYPE[k], diff)) {
                                    this.print_information_2(j, N,this. method, H_64, H_res_64[j], k, diff);
                                    alvision.CV_Error(CALIB3D_HOMOGRAPHY_ERROR_MATRIX_DIFF, MESSAGE_MATRIX_DIFF);
                                    return;
                                }

                                var code = this.check_ransac_mask_1(src_mat_2f, mask[j]);

                                if (code) {
                                    this.print_information_3(this.method, j, N, mask[j]);

                                    switch (code) {
                                        case 1: { alvision.CV_Error(CALIB3D_HOMOGRAPHY_ERROR_RANSAC_MASK, MESSAGE_RANSAC_MASK_1); break; }
                                        case 2: { alvision.CV_Error(CALIB3D_HOMOGRAPHY_ERROR_RANSAC_MASK, MESSAGE_RANSAC_MASK_2); break; }
                                        case 3: { alvision.CV_Error(CALIB3D_HOMOGRAPHY_ERROR_RANSAC_MASK, MESSAGE_RANSAC_MASK_3); break; }

                                        default: break;
                                    }

                                    return;
                                }

                            }

                            continue;
                        }

                    default: continue;
                }
            }

            var noise_2f = new alvision.Mat(1, N, alvision.MatrixType.CV_32FC2);
            rng.fill(noise_2f, alvision.DistType.NORMAL, alvision.Scalar.all(0), alvision.Scalar.all(this.sigma));

            var mask = new alvision.Mat(N, 1,alvision.MatrixType. CV_8UC1);

            for (var i = 0; i < N; ++i) {
                float * a = noise_2f.ptr<float>() + 2 * i, *_2f = dst_mat_2f.ptr<float>() + 2 * i;
                _2f[0] += a[0]; _2f[1] += a[1];
                mask.at<bool>(i, 0) = !(sqrt(a[0] * a[0] + a[1] * a[1]) > reproj_threshold);
            }

            for (var i = 0; i < METHODS_COUNT; ++i) {
                this.method = METHOD[i];
                switch (this.method) {
                    case 0:
                    case LMEDS:
                        {
                            var H_res_64 = [
                                alvision.findHomography(src_mat_2f, dst_mat_2f),
                                alvision.findHomography(src_mat_2f, dst_vec),
                                alvision.findHomography(src_vec, dst_mat_2f),
                                alvision.findHomography(src_vec, dst_vec)
                            ];

                            for (var j = 0; j < 4; ++j)
                            {

                                if (!this.check_matrix_size(H_res_64[j])) {
                                    this.print_information_1(j, N, this.method, H_res_64[j]);
                                    alvision.CV_Error(CALIB3D_HOMOGRAPHY_ERROR_MATRIX_SIZE, MESSAGE_MATRIX_SIZE);
                                    return;
                                }

                                Mat H_res_32; H_res_64[j].convertTo(H_res_32, CV_32F);

                                alvision.Mat dst_res_3d(3, N, CV_32F), noise_2d(2, N, CV_32F);

                                for (var k = 0; k < N; ++k) {

                                    Mat tmp_mat_3d = H_res_32 * src_mat_3d.col(k);

                                    dst_res_3d.at<float>(0, k) = tmp_mat_3d.at<float>(0, 0) /= tmp_mat_3d.at<float>(2, 0);
                                    dst_res_3d.at<float>(1, k) = tmp_mat_3d.at<float>(1, 0) /= tmp_mat_3d.at<float>(2, 0);
                                    dst_res_3d.at<float>(2, k) = tmp_mat_3d.at<float>(2, 0) = 1.0f;

                                    float * a = noise_2f.ptr<float>() + 2 * k;
                                    noise_2d.at<float>(0, k) = a[0]; noise_2d.at<float>(1, k) = a[1];

                                    for (var l = 0; l < COUNT_NORM_TYPES; ++l)
                                        if (alvision.norm(tmp_mat_3d, dst_mat_3d.col(k), NORM_TYPE[l]) - alvision.norm(noise_2d.col(k), NORM_TYPE[l]) > max_2diff) {
                                            this.print_information_4(method, j, N, k, l, alvision.norm(tmp_mat_3d, dst_mat_3d.col(k), NORM_TYPE[l]) - alvision.norm(noise_2d.col(k), NORM_TYPE[l]));
                                            alvision.CV_Error(CALIB3D_HOMOGRAPHY_ERROR_REPROJ_DIFF, MESSAGE_REPROJ_DIFF_1);
                                            return;
                                        }

                                }

                                for (var l = 0; l < COUNT_NORM_TYPES; ++l)
                                    if (alvision.norm(dst_res_3d, dst_mat_3d, NORM_TYPE[l]) - alvision.norm(noise_2d, NORM_TYPE[l]) > max_diff) {
                                        this.print_information_5(method, j, N, l, alvision.norm(dst_res_3d, dst_mat_3d, NORM_TYPE[l]) - alvision.norm(noise_2d, NORM_TYPE[l]));
                                        alvision.CV_Error(CALIB3D_HOMOGRAPHY_ERROR_REPROJ_DIFF, MESSAGE_REPROJ_DIFF_2);
                                        return;
                                    }

                            }

                            continue;
                        }
                    case alvision.RHO:
                    case RANSAC:
                        {
                            alvision.Mat mask_res [4];

                            var H_res_64 = [
                                alvision.findHomography(src_mat_2f, dst_mat_2f, this.method, this.reproj_threshold, mask_res[0]),
                                alvision.findHomography(src_mat_2f, dst_vec, this.method, this.reproj_threshold, mask_res[1]),
                                alvision.findHomography(src_vec, dst_mat_2f, this.method, this.reproj_threshold, mask_res[2]),
                                alvision.findHomography(src_vec, dst_vec, this.method, this.reproj_threshold, mask_res[3])
                            ];

                            for (var j = 0; j < 4; ++j) {
                                if (!this.check_matrix_size(H_res_64[j])) {
                                    this.print_information_1(j, N, this.method, H_res_64[j]);
                                    alvision.CV_Error(CALIB3D_HOMOGRAPHY_ERROR_MATRIX_SIZE, MESSAGE_MATRIX_SIZE);
                                    return;
                                }

                                var code = this.check_ransac_mask_2(mask, mask_res[j]);

                                if (code) {
                                    this.print_information_3(this.method, j, N, mask_res[j]);

                                    switch (code) {
                                        case 1: { alvision.CV_Error(CALIB3D_HOMOGRAPHY_ERROR_RANSAC_MASK, MESSAGE_RANSAC_MASK_1); break; }
                                        case 2: { alvision.CV_Error(CALIB3D_HOMOGRAPHY_ERROR_RANSAC_MASK, MESSAGE_RANSAC_MASK_3); break; }

                                        default: break;
                                    }

                                    return;
                                }

                                alvision.Mat H_res_32; H_res_64[j].convertTo(H_res_32, CV_32F);

                                alvision.Mat dst_res_3d = H_res_32 * src_mat_3d;

                                for (var k = 0; k < N; ++k) {
                                    dst_res_3d.at<float>(0, k) /= dst_res_3d.at<float>(2, k);
                                    dst_res_3d.at<float>(1, k) /= dst_res_3d.at<float>(2, k);
                                    dst_res_3d.at<float>(2, k) = 1.0f;

                                    float * p = dst_mat_2f.ptr<float>() + 2 * k;

                                    dst_mat_3d.at<float>(0, k) = p[0];
                                    dst_mat_3d.at<float>(1, k) = p[1];

                                    var diff = alvision.norm(dst_res_3d.col(k), dst_mat_3d.col(k), alvision.NormTypes.NORM_L2);

                                    if (mask_res[j].at<bool>(k, 0) != (diff <= reproj_threshold)) {
                                        this.print_information_6(this.method, j, N, k, diff, mask_res[j].at<bool>(k, 0));
                                        alvision.CV_Error(CALIB3D_HOMOGRAPHY_ERROR_RANSAC_MASK, MESSAGE_RANSAC_MASK_4);
                                        return;
                                    }

                                    if (mask.at<bool>(k, 0) && !mask_res[j].at<bool>(k, 0)) {
                                        this.print_information_7(this.method, j, N, k, diff, mask.at<bool>(k, 0), mask_res[j].at<bool>(k, 0));
                                        alvision.CV_Error(CALIB3D_HOMOGRAPHY_ERROR_RANSAC_MASK, MESSAGE_RANSAC_MASK_5);
                                        return;
                                    }

                                    if (mask_res[j].at<bool>(k, 0)) {
                                        float * a = noise_2f.ptr<float>() + 2 * k;
                                        dst_mat_3d.at<float>(0, k) -= a[0];
                                        dst_mat_3d.at<float>(1, k) -= a[1];

                                        alvision.Mat noise_2d(2, 1, CV_32F);
                                        noise_2d.at<float>(0, 0) = a[0]; noise_2d.at<float>(1, 0) = a[1];

                                        for (var l = 0; l < COUNT_NORM_TYPES; ++l) {
                                            diff = alvision.norm(dst_res_3d.col(k), dst_mat_3d.col(k), NORM_TYPE[l]);

                                            if (diff - alvision.norm(noise_2d, NORM_TYPE[l]) > max_2diff) {
                                                this.print_information_8(this.method, j, N, k, l, diff - alvision.norm(noise_2d, NORM_TYPE[l]));
                                                alvision.CV_Error(CALIB3D_HOMOGRAPHY_ERROR_RANSAC_DIFF, MESSAGE_RANSAC_DIFF);
                                                return;
                                            }
                                        }
                                    }
                                }
                            }

                            continue;
                        }

                    default: continue;
                }
            }
        }
    }



    protected method: alvision.int;
    protected image_size: alvision.int;
    protected reproj_threshold: alvision.double;
    protected sigma: alvision.double;

    private max_diff: alvision.float;
    private max_2diff: alvision.float;

    check_matrix_size(H: alvision.Mat): boolean {
        return (H.rows == 3) && (H.cols == 3);
    }
    check_matrix_diff(original: alvision.Mat, found: alvision.Mat, norm_type: alvision.int, diff: alvision.double): boolean {
        diff = alvision.cvtest.norm(original, found, norm_type);
        return diff <= max_diff;
    }
    check_ransac_mask_1(src: alvision.Mat, mask: alvision.Mat): alvision.int {
        if (!(mask.cols == 1) && (mask.rows == src.cols)) return 1;
        if (countNonZero(mask) < mask.rows) return 2;
        for (var i = 0; i < mask.rows; ++i) if (mask.at<uchar>(i, 0) > 1) return 3;
        return 0;
    }
    check_ransac_mask_2(original_mask: alvision.Mat, found_mask: alvision.Mat): alvision.int {
        if (!(found_mask.cols == 1) && (found_mask.rows == original_mask.rows)) return 1;
        for (var i = 0; i < found_mask.rows; ++i) if (found_mask.at<uchar>(i, 0) > 1) return 2;
        return 0;
    }

    print_information_1(j: alvision.int, N: alvision.int, method: alvision.int, H: alvision.Mat): void {
        console.log("Checking for homography matrix sizes...");
        console.log("Type of srcPoints: " + ((j > -1) && (j < 2)) ? "Mat of CV_32FC2" : "vector <Point2f>");
        console.log("   Type of dstPoints: " + (j.valueOf() % 2 == 0) ? "Mat of CV_32FC2" : "vector <Point2f>");
        console.log("Count of points: " + N);

        var methodstr = "";

        if (method == 0)
            methodstr = "";
        else if (method == 8)
            methodstr = "RANSAC";
        else if (method == alvision.RHO)
            methodstr = "RHO";
        else
            methodstr = "LMEDS";

        console.log("Method: " + methodstr);
        console.log("Homography matrix:");
        console.log(H);
        console.log("Number of rows: " + H.rows + "   Number of cols: " + H.cols);
    }
    print_information_2(j: alvision.int, N: alvision.int, method: alvision.int, H: alvision.Mat, H_res: alvision.Mat, k: alvision.int, diff: alvision.double): void {
        console.log("Checking for accuracy of homography matrix computing...");
        console.log("Type of srcPoints: " + ((j > -1) && (j < 2)) ? "Mat of CV_32FC2" : "vector <Point2f>");
        console.log("   Type of dstPoints: " + (j % 2 == 0) ? "Mat of CV_32FC2" : "vector <Point2f>");
        console.log("Count of points: " + N);
        var methodstr = "";

        if (method == 0)
            methodstr = "";
        else if (method == 8)
            methodstr = "RANSAC";
        else if (method == alvision.RHO)
            methodstr = "RHO";
        else
            methodstr = "LMEDS";

        console.log("Method: " + methodstr);
        console.log("Original matrix:");
        console.log(H);
        console.log("Found matrix:");
        console.log(H_res);
        console.log("Norm type using in criteria: "; if (NORM_TYPE[k] == 1) cout << "INF"; else if (NORM_TYPE[k] == 2) cout << "L1"; else cout << "L2"; cout << endl;
        console.log("Difference between matrices: ");
        console.log("Maximum allowed difference: " + this.max_diff);
    }
    print_information_3(method: alvision.int, j: alvision.int, N: alvision.int, mask: alvision.Mat): void {
        console.log("Checking for inliers/outliers mask...");
        console.log("Type of srcPoints: " + ((j > -1) && (j < 2)) ? "Mat of CV_32FC2" : "vector <Point2f>");
        console.log("   Type of dstPoints: " + (j % 2 == 0) ? "Mat of CV_32FC2" : "vector <Point2f>");
        console.log("Count of points: " + N);
        var methodstr = "";

        if (method == 0)
            methodstr = "";
        else if (method == 8)
            methodstr = "RANSAC";
        else if (method == alvision.RHO)
            methodstr = "RHO";
        else
            methodstr = "LMEDS";

        console.log("Method: " + methodstr);
        console.log("Found mask:");
        console.log(mask);
        console.log("Number of rows: " + mask.rows + "   Number of cols: " + mask.cols);
    }
    print_information_4(method: alvision.int, j: alvision.int, N: alvision.int, k: alvision.int, l: alvision.int, diff: alvision.double): void {
        console.log("Checking for accuracy of reprojection error computing...");
        console.log("Method: " + (method == 0) ? 0 : "CV_LMEDS");
        console.log("Type of srcPoints: " + ((j > -1) && (j < 2)) ? "Mat of CV_32FC2" : "vector <Point2f>");
        console.log("   Type of dstPoints: " + (j.valueOf() % 2 == 0) ? "Mat of CV_32FC2" : "vector <Point2f>");
        console.log("Sigma of normal noise: " + this.sigma);
        console.log("Count of points: " + N);
        console.log("Number of point: " + k);
        console.log("Norm type using in criteria: "; if (NORM_TYPE[l] == 1) cout << "INF"; else if (NORM_TYPE[l] == 2) cout << "L1"; else cout << "L2"; cout << endl;
        console.log("Difference with noise of point: " + diff);
        console.log("Maxumum allowed difference: " + this.max_2diff);
    }
    print_information_5(method: alvision.int, j: alvision.int, N: alvision.int, l: alvision.int, diff: alvision.double): void {
        console.log("Checking for accuracy of reprojection error computing...");
        console.log("Method: " + (method == 0) ? 0 : "CV_LMEDS");
        console.log("Type of srcPoints: " + ((j > -1) && (j < 2)) ? "Mat of CV_32FC2" : "vector <Point2f>");
        console.log("   Type of dstPoints: " + (j.valueOf() % 2 == 0) ? "Mat of CV_32FC2" : "vector <Point2f>");
        console.log("Sigma of normal noise: " + this.sigma);
        console.log("Count of points: " + N);
        console.log("Norm type using in criteria: "; if (NORM_TYPE[l] == 1) cout << "INF"; else if (NORM_TYPE[l] == 2) cout << "L1"; else cout << "L2"; cout << endl;
        console.log("Difference with noise of points: " + diff);
        console.log("Maxumum allowed difference: " + this.max_diff);
    }
    print_information_6(method: alvision.int, j: alvision.int, N: alvision.int, k: alvision.int, diff: alvision.double, value: boolean): void {
        console.log("Checking for inliers/outliers mask...");
        var methodstr = "";

        if (method == 0)
            methodstr = "";
        else if (method == 8)
            methodstr = "RANSAC";
        else if (method == alvision.RHO)
            methodstr = "RHO";
        else
            methodstr = "LMEDS";

        console.log("Method: " + methodstr);
        console.log("Type of srcPoints: " + ((j > -1) && (j < 2)) ? "Mat of CV_32FC2" : "vector <Point2f>");
        console.log("   Type of dstPoints: " + (j.valueOf() % 2 == 0) ? "Mat of CV_32FC2" : "vector <Point2f>");
        console.log("Count of points: " + N);
        console.log("Number of point: " + k);
        console.log("Reprojection error for this point: " + diff);
        console.log("Reprojection error threshold: " + this.reproj_threshold);
        console.log("Value of found mask: " + value);
    }
    print_information_7(method: alvision.int, j: alvision.int, N: alvision.int, k: alvision.int, diff: alvision.double, original_value: boolean, found_value: boolean): void {
        console.log("Checking for inliers/outliers mask...");
        var methodstr = "";

        if (method == 0)
            methodstr = "";
        else if (method == 8)
            methodstr = "RANSAC";
        else if (method == alvision.RHO)
            methodstr = "RHO";
        else
            methodstr = "LMEDS";

        console.log("Method: " + methodstr);
        console.log("Type of srcPoints: " + ((j > -1) && (j < 2)) ? "Mat of CV_32FC2" : "vector <Point2f>");
        console.log("   Type of dstPoints: " + (j % 2 == 0) ? "Mat of CV_32FC2" : "vector <Point2f>");
        console.log("Count of points: " + N);
        console.log("Number of point: " + k);
        console.log("Reprojection error for this point: ", diff);
        console.log("Reprojection error threshold: " + this.reproj_threshold);
        console.log("Value of original mask: " + original_value + "   Value of found mask: " + found_value);
    }
    print_information_8(method: alvision.int, j: alvision.int, N: alvision.int, k: alvision.int, l: alvision.int, diff: alvision.double): void {
        console.log("Checking for reprojection error of inlier...");
        var methodstr = "";

        if (method == 0)
            methodstr = "";
        else if (method == 8)
            methodstr = "RANSAC";
        else if (method == alvision.RHO)
            methodstr = "RHO";
        else
            methodstr = "LMEDS";

        console.log("Method: " + methodstr);
        console.log("Sigma of normal noise: " + this.sigma);
        console.log("Type of srcPoints: " + ((j > -1) && (j < 2)) ? "Mat of CV_32FC2" : "vector <Point2f>");
        console.log("   Type of dstPoints: " + (j % 2 == 0) ? "Mat of CV_32FC2" : "vector <Point2f>");
        console.log("Count of points: " + N);
        console.log("Number of point: " + k);
        console.log("Norm type using in criteria: "; if (NORM_TYPE[l] == 1) cout << "INF"; else if (NORM_TYPE[l] == 2) cout << "L1"; else cout << "L2"; cout << endl;
        console.log("Difference with noise of point: " + diff);
        console.log("Maxumum allowed difference: " + this.max_2diff);
    }
}




alvision.cvtest.TEST('Calib3d_Homography', 'accuracy', () => { var test = new CV_HomographyTest(); test.safe_run(); });
