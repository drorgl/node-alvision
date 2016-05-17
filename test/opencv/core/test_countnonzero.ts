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
//#include <limits>
//using namespace cv;
//using namespace std;

const CORE_COUNTNONZERO_ERROR_COUNT = 1;

const MESSAGE_ERROR_COUNT = "Count non zero elements returned by OpenCV function is incorrect.";

//#define sign(a) a > 0 ? 1 : a == 0 ? 0 : -1
function sign(a: any) {
    return a > 0 ? 1 : a == 0 ? 0 : -1;
}

const MAX_WIDTH = 100;
const  MAX_HEIGHT = 100;

class CV_CountNonZeroTest extends alvision.cvtest.BaseTest
{
    constructor() {
        super();
        this.eps_32 = (alvision.FLT_MIN);
        this.eps_64 = (alvision.DBL_MIN);
        this.src = (new alvision.Mat());
        this.current_type = (-1);
    }

    run(iii: alvision.int): void {
        const N = 1500;

        for (var k = 1; k <= 3; ++k)
        for (var  i = 0; i < N; ++i)
        {
            var rng = this.ts.get_rng();

            var w = rng.next() % MAX_WIDTH + 1, h = rng.next() % MAX_HEIGHT + 1;

            current_type = rng.next() % 7;

            switch (k) {
                case 1: {
                    this.generate_src_data(new alvision.Size(w, h), current_type);
                    var right = this.get_count_non_zero(), result = countNonZero(src);
                    if (result != right) {
                        console.log("Number of experiment: " + i);
                        console.log("Method of data generation: RANDOM");
                        this.print_information(right, result);
                        alvision.CV_Error(CORE_COUNTNONZERO_ERROR_COUNT, MESSAGE_ERROR_COUNT);
                        return;
                    }

                    break;
                }

                case 2: {
                    var count_non_zero = rng.next() % (w * h);
                    this.generate_src_data(new alvision.Size(w, h), current_type, count_non_zero);
                    var result = countNonZero(src);
                    if (result != count_non_zero) {
                        console.log("Number of experiment: "  + i );
                        console.log("Method of data generation: HALF-RANDOM");
                        this.print_information(count_non_zero, result);
                        alvision.CV_Error(CORE_COUNTNONZERO_ERROR_COUNT, MESSAGE_ERROR_COUNT);
                        return;
                    }

                    break;
                }

                case 3: {
                    var distribution = alvision.randu<uchar>() % 2;
                    this.generate_src_stat_data(new alvision.Size(w, h), current_type, distribution);
                    var right = get_count_non_zero(), result = countNonZero(src);
                    if (right != result) {
                        console.log("Number of experiment: "+ i);
                        console.log("Method of data generation: STATISTIC");
                        this.print_information(right, result);
                        alvision.CV_Error(CORE_COUNTNONZERO_ERROR_COUNT, MESSAGE_ERROR_COUNT);
                        return;
                    }

                    break;
                }

                default: break;
            }
        }
    }

    private eps_32 : alvision.float;
    private eps_64 : alvision.double;
    private src : alvision.Mat;
    private current_type: alvision.int;

    private generate_src_data(size: alvision.Size, type: alvision.int): void {
        src.create(size, CV_MAKETYPE(type, 1));

        for (var j = 0; j < size.width; ++j)
        for (var i = 0; i < size.height; ++i)
        switch (type) {
            case alvision.MatrixType.CV_8U: { src.at<uchar>(i, j) = alvision.randu<uchar>(); break; }
            case alvision.MatrixType.CV_8S: { src.at<char>(i, j) = alvision.randu<uchar>() - 128; break; }
            case alvision.MatrixType.CV_16U: { src.at<ushort>(i, j) = alvision.randu<ushort>(); break; }
            case alvision.MatrixType.CV_16S: { src.at<short>(i, j) = alvision.randu<short>(); break; }
            case alvision.MatrixType.CV_32S: { src.at<int>(i, j) = alvision.randu<int>(); break; }
            case alvision.MatrixType.CV_32F: { src.at<float>(i, j) = alvision.randu<float>(); break; }
            case alvision.MatrixType.CV_64F: { src.at<double>(i, j) = alvision.randu<double>(); break; }
            default: break;
        }
    }
    private generate_src_data(size: alvision.Size, type: alvision.int, count_non_zero: alvision.int): void {
        src = alvision.Mat.zeros(size,alvision.MatrixType. CV_MAKETYPE(type, 1));

        var n = 0; var rng = this.ts.get_rng();

        while (n < count_non_zero) {
            var i = rng.next() % size.height, j = rng.next() % size.width;

            switch (type) {
                case alvision.MatrixType.CV_8U: { if (!src.at<uchar>(i, j)) { src.at<uchar>(i, j) = alvision.randu<uchar>(); n += (src.at<uchar>(i, j) > 0); } break; }
                case alvision.MatrixType.CV_8S: { if (!src.at<char>(i, j)) { src.at<char>(i, j) = alvision.randu<uchar>() - 128; n += abs(sign(src.at<char>(i, j))); } break; }
                case alvision.MatrixType.CV_16U: { if (!src.at<ushort>(i, j)) { src.at<ushort>(i, j) = alvision.randu<ushort>(); n += (src.at<ushort>(i, j) > 0); } break; }
                case alvision.MatrixType.CV_16S: { if (!src.at<short>(i, j)) { src.at<short>(i, j) = alvision.randu<short>(); n += abs(sign(src.at<short>(i, j))); } break; }
                case alvision.MatrixType.CV_32S: { if (!src.at<int>(i, j)) { src.at<int>(i, j) = alvision.randu<int>(); n += abs(sign(src.at<int>(i, j))); } break; }
                case alvision.MatrixType.CV_32F: { if (fabs(src.at<float>(i, j)) <= eps_32) { src.at<float>(i, j) = alvision.randu<float>(); n += (fabs(src.at<float>(i, j)) > eps_32); } break; }
                case alvision.MatrixType.CV_64F: { if (fabs(src.at<double>(i, j)) <= eps_64) { src.at<double>(i, j) = alvision.randu<double>(); n += (fabs(src.at<double>(i, j)) > eps_64); } break; }

                default: break;
            }
        }
    }
    private generate_src_stat_data(size: alvision.Size, type: alvision.int, distribution: alvision.int): void {
        src.create(size, CV_MAKETYPE(type, 1));

        var mean = 0.0, sigma = 1.0;
        var left = -1.0, right = 1.0;

        var rng = this.ts.get_rng();

        if (distribution == RNG::NORMAL)
        rng.fill(src, RNG::NORMAL, Scalar::all(mean), Scalar::all(sigma));
    else if (distribution == RNG::UNIFORM)
        rng.fill(src, RNG::UNIFORM, Scalar::all(left), Scalar::all(right));
    }

    private get_count_non_zero(): alvision.int{
        var result = 0;

        for (var i = 0; i < src.rows; ++i)
        for (var j = 0; j < src.cols; ++j)
        {
            if (current_type == CV_8U) result += (src.at<uchar>(i, j) > 0);
            else if (current_type == CV_8S) result += abs(sign(src.at<char>(i, j)));
            else if (current_type == CV_16U) result += (src.at<ushort>(i, j) > 0);
            else if (current_type == CV_16S) result += abs(sign(src.at<short>(i, j)));
            else if (current_type == CV_32S) result += abs(sign(src.at<int>(i, j)));
            else if (current_type == CV_32F) result += (fabs(src.at<float>(i, j)) > eps_32);
            else result += (fabs(src.at<double>(i, j)) > eps_64);
        }

        return result;
    }

    private print_information(right: alvision.int, result: alvision.int): void {
        console.log("Checking for the work of countNonZero function...");
        console.log("Type of Mat: ");
        switch (current_type) {
            case 0: { console.log("CV_8U"); break; }
            case 1: { console.log("CV_8S"); break; }
            case 2: { console.log("CV_16U"); break; }
            case 3: { console.log("CV_16S"); break; }
            case 4: { console.log("CV_32S"); break; }
            case 5: { console.log("CV_32F"); break; }
            case 6: { console.log("CV_64F"); break; }
            default: break;
        }
        console.log("Number of rows: " + src.rows + "   Number of cols: " + src.cols);
        console.log("True count non zero elements: " + right + "   Result: " + result);
    }
};

alvision.cvtest.TEST('Core_CountNonZero', 'accuracy', () => { var test = new CV_CountNonZeroTest(); test.safe_run(); });
