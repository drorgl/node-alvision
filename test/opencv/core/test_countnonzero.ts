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
//function sign(a: any) {
//    return a > 0 ? 1 : a == 0 ? 0 : -1;
//}

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

            var w = rng.next().valueOf() % MAX_WIDTH + 1, h = rng.next().valueOf() % MAX_HEIGHT + 1;

            this.current_type = rng.next().valueOf() % 7;

            switch (k) {
                case 1: {
                    this.generate_src_data1(new alvision.Size(w, h), this.current_type);
                    var right = this.get_count_non_zero(), result = alvision.countNonZero(this.src);
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
                    var count_non_zero = rng.next().valueOf() % (w * h);
                    this.generate_src_data2(new alvision.Size(w, h), this.current_type, count_non_zero);
                    var result = alvision.countNonZero(this.src);
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
                    var distribution = <number>(alvision.theRNG().uchar()) % 2;
                    this.generate_src_stat_data(new alvision.Size(w, h), this.current_type, distribution);
                    var right = this.get_count_non_zero(), result = alvision.countNonZero(this.src);
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

    private generate_src_data1(size: alvision.Size, type: alvision.int): void {
        this.src.create(size, alvision.MatrixType.CV_MAKETYPE(type, 1));

        for (var j = 0; j < size.width; ++j)
        for (var i = 0; i < size.height; ++i)
        switch (type) {
            case alvision.MatrixType.CV_8U: {  this.src.at<alvision.uchar>("uchar",i, j).set(alvision.theRNG().uchar()); break; }
            case alvision.MatrixType.CV_8S: {  this.src.at<alvision.char>("char", i, j).set(<any>(<number>alvision.theRNG().uchar() - 128)); break; }
            case alvision.MatrixType.CV_16U: { this.src.at<alvision.ushort>("ushort", i, j).set(alvision.theRNG().ushort()); break; }
            case alvision.MatrixType.CV_16S: { this.src.at<alvision.short>("short", i, j).set(alvision.theRNG().short()); break; }
            case alvision.MatrixType.CV_32S: { this.src.at<alvision.int>("int", i, j).set(alvision.theRNG().int()); break; }
            case alvision.MatrixType.CV_32F: { this.src.at<alvision.float>("float", i, j).set(alvision.theRNG().float()); break; }
            case alvision.MatrixType.CV_64F: { this.src.at<alvision.double>("double", i, j).set(alvision.theRNG().double()); break; }
            default: break;
        }
    }
    private generate_src_data2(size: alvision.Size, type: alvision.int, count_non_zero: alvision.int): void {
        this.src = alvision.Mat.zeros(size,alvision.MatrixType. CV_MAKETYPE(type, 1)).toMat();

        var n = 0; var rng = this.ts.get_rng();

        while (n < count_non_zero) {
            var i = rng.next().valueOf() % size.height.valueOf(), j = rng.next().valueOf() % size.width.valueOf();

            switch (type) {
                case alvision.MatrixType.CV_8U: {  if (!this.src.at<alvision.uchar>("uchar", i, j)) {   this.src.at<alvision.uchar>("uchar", i, j).set(alvision.theRNG().uchar()); n += (this.src.at<alvision.uchar>("uchar", i, j).get() > 0) ? 1 : 0; } break; }
                case alvision.MatrixType.CV_8S: {  if (!this.src.at<alvision.char>("char", i, j)) {     this.src.at<alvision.char>("char", i, j).set(<any>(<number>alvision.theRNG().uchar() - 128)); n += Math.abs(alvision.sign(this.src.at<alvision.char>("char", i, j))); } break; }
                case alvision.MatrixType.CV_16U: { if (!this.src.at<alvision.ushort>("ushort", i, j)) { this.src.at<alvision.ushort>("ushort", i, j).set(alvision.theRNG().ushort()); n += (this.src.at<alvision.ushort>("ushort", i, j).get() > 0) ? 1 : 0; } break; }
                case alvision.MatrixType.CV_16S: { if (!this.src.at<alvision.short>("short", i, j)) {   this.src.at<alvision.short>("short", i, j).set(alvision.theRNG().short()); n += Math.abs(alvision.sign(this.src.at<alvision.short>("short", i, j))); } break; }
                case alvision.MatrixType.CV_32S: { if (!this.src.at<alvision.int>("int", i, j)) {       this.src.at<alvision.int>("int", i, j).set(alvision.theRNG().int()); n += Math.abs(alvision.sign(this.src.at<alvision.int>("int", i, j))); } break; }
                case alvision.MatrixType.CV_32F: { if (Math.abs(this.src.at<alvision.float>("float", i, j).get().valueOf()) <= this.eps_32) { this.src.at<alvision.float>("float", i, j).set(alvision.theRNG().float()); n += (Math.abs(this.src.at<alvision.float>("float", i, j).get().valueOf()) > this.eps_32) ? 1 : 0; } break; }
                case alvision.MatrixType.CV_64F: { if (Math.abs(this.src.at<alvision.double>("double", i, j).get().valueOf()) <= this.eps_64) { this.src.at<alvision.double>("double", i, j).set(alvision.theRNG().double()); n += (Math.abs(this.src.at<alvision.double>("double", i, j).get().valueOf()) > this.eps_64) ? 1 : 0; } break; }

                default: break;
            }
        }
    }
    private generate_src_stat_data(size: alvision.Size, type: alvision.int, distribution: alvision.int): void {
        this.src.create(size, alvision.MatrixType.CV_MAKETYPE(type, 1));

        var mean = 0.0, sigma = 1.0;
        var left = -1.0, right = 1.0;

        var rng = this.ts.get_rng();

        if (distribution == alvision.DistType.NORMAL)
        rng.fill(this.src, alvision.DistType.NORMAL, alvision.Scalar.all(mean), alvision.Scalar.all(sigma));
    else if (distribution == alvision.DistType.UNIFORM)
        rng.fill(this.src, alvision.DistType.UNIFORM, alvision.Scalar.all(left), alvision.Scalar.all(right));
    }

    private get_count_non_zero(): alvision.int{
        var result = 0;

        for (var i = 0; i < this.src.rows; ++i)
        for (var j = 0; j < this.src.cols; ++j)
        {
            if (this.current_type == alvision.MatrixType.CV_8U) result += (this.src.at<alvision.uchar>("uchar", i, j).get() > 0) ? 1 : 0;
            else if (this.current_type == alvision.MatrixType.CV_8S) result += Math.abs(alvision.sign(this.src.at<alvision.char>("char", i, j).get()));
            else if (this.current_type == alvision.MatrixType.CV_16U) result += (this.src.at<alvision.ushort>("ushort", i, j).get() > 0) ? 1 : 0;
            else if (this.current_type == alvision.MatrixType.CV_16S) result += Math.abs(alvision.sign(this.src.at<alvision.short>("short", i, j).get()));
            else if (this.current_type == alvision.MatrixType.CV_32S) result += Math.abs(alvision.sign(this.src.at<alvision.int>("int", i, j).get()));
            else if (this.current_type == alvision.MatrixType.CV_32F) result += (Math.abs(this.src.at<alvision.float>("float", i, j).get().valueOf()) > this.eps_32) ? 1 : 0;
            else result += (Math.abs(this.src.at<alvision.double>("double", i, j).get().valueOf()) > this.eps_64) ? 1 : 0;
        }

        return result;
    }

    private print_information(right: alvision.int, result: alvision.int): void {
        console.log("Checking for the work of countNonZero function...");
        console.log("Type of Mat: ");
        switch (this.current_type) {
            case 0: { console.log("CV_8U"); break; }
            case 1: { console.log("CV_8S"); break; }
            case 2: { console.log("CV_16U"); break; }
            case 3: { console.log("CV_16S"); break; }
            case 4: { console.log("CV_32S"); break; }
            case 5: { console.log("CV_32F"); break; }
            case 6: { console.log("CV_64F"); break; }
            default: break;
        }
        console.log("Number of rows: " + this.src.rows + "   Number of cols: " + this.src.cols);
        console.log("True count non zero elements: " + right + "   Result: " + result);
    }
};

alvision.cvtest.TEST('Core_CountNonZero', 'accuracy', () => { var test = new CV_CountNonZeroTest(); test.safe_run(); });
