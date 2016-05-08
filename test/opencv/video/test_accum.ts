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
//#include "opencv2/imgproc/imgproc_c.h"
//
//using namespace cv;
//using namespace std;

class CV_AccumBaseTest extends alvision.cvtest.ArrayTest {
    constructor() {
        super();
        this.test_array[this.INPUT].push(null);
        this.test_array[this.INPUT_OUTPUT].push(null);
        this.test_array[this.REF_INPUT_OUTPUT].push(null);
        this.test_array[this.MASK].push(null);
        this.optional_mask = true;
        this.element_wise_relative_error = false;
    }
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        var rng = this.ts.get_rng();
        var depth = alvision.cvtest.randInt(rng).valueOf() % 3, cn = alvision.cvtest.randInt(rng).valueOf() & 1 ? 3 : 1;
        var accdepth = Math.max((alvision.cvtest.randInt(rng).valueOf() % 2 + 1), depth);
        var input_count = this.test_array[this.INPUT].length;
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
        depth = depth == 0 ? alvision.MatrixType.CV_8U : depth == 1 ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_64F;
        accdepth = accdepth == 1 ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_64F;
        accdepth = Math.max(accdepth, depth);

        for (var i = 0; i < input_count; i++)
            types[this.INPUT][i] = alvision.MatrixType.CV_MAKETYPE(depth, cn);

        types[this.INPUT_OUTPUT][0] = types[this.REF_INPUT_OUTPUT][0] = alvision.MatrixType.CV_MAKETYPE(accdepth, cn);

        this.alpha = alvision.cvtest.randReal(rng);
    }

    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        return this.test_mat[this.INPUT_OUTPUT][0].depth() < alvision.MatrixType.CV_64F ||
            this.test_mat[this.INPUT][0].depth() == alvision.MatrixType.CV_32F ? alvision.FLT_EPSILON * 100 : alvision.DBL_EPSILON * 1000;
    }

    protected alpha: alvision.double;
}

/// acc
class CV_AccTest extends CV_AccumBaseTest {
    run_func(): void {
        alvision.accumulate(this.test_array[this.INPUT][0], this.test_array[this.INPUT_OUTPUT][0], this.test_array[this.MASK][0]);
    }
    prepare_to_validation(iii: alvision.int): void {
        var src = this.test_mat[this.INPUT][0];
        var dst = this.test_mat[this.REF_INPUT_OUTPUT][0];
        var mask = this.test_array[this.MASK][0] ? this.test_mat[this.MASK][0] : new alvision.Mat();
        var temp = new alvision.Mat();

        alvision.cvtest.add(src, 1, dst, 1,alvision.Scalar.all(0.), temp, dst.type());
        alvision.cvtest.copy(temp, dst, mask);

    }
}

/// square acc
class CV_SquareAccTest extends CV_AccumBaseTest
{
    run_func(): void{
        alvision.accumulateSquare(this.test_array[this.INPUT][0], this.test_array[this.INPUT_OUTPUT][0], this.test_array[this.MASK][0]);
}
    prepare_to_validation(iii: alvision.int): void {
        var src = this.test_mat[this.INPUT][0];
        var dst = this.test_mat[this.REF_INPUT_OUTPUT][0];
        var mask = this.test_array[this.MASK][0] ? this.test_mat[this.MASK][0] : new alvision.Mat();
        var temp = new alvision.Mat();

        alvision.cvtest.convert(src, temp, dst.type());
        alvision.cvtest.multiply(temp, temp, temp, 1);
        alvision.cvtest.add(temp, 1, dst, 1, alvision.Scalar.all(0.), temp, dst.depth());
        alvision.cvtest.copy(temp, dst, mask);
    }
};

/// multiply acc
class CV_MultiplyAccTest extends CV_AccumBaseTest
{
    constructor() {
        super();
        this.test_array[this.INPUT].push(null);
    }
    run_func(): void {
        alvision.accumulateProduct(this.test_array[this.INPUT][0], this.test_array[this.INPUT][1],
            this.test_array[this.INPUT_OUTPUT][0], this.test_array[this.MASK][0]);
    }
    prepare_to_validation(int): void {
        var src1 = this.test_mat[this.INPUT][0];
        var src2 = this.test_mat[this.INPUT][1];
        var dst = this.test_mat[this.REF_INPUT_OUTPUT][0];
        var mask = this.test_array[this.MASK][0] ? this.test_mat[this.MASK][0] : new alvision.Mat();
        //Mat temp1, temp2;
        var temp1 = new alvision.Mat();
        var temp2 = new alvision.Mat();

        alvision.cvtest.convert(src1, temp1, dst.type());
        alvision.cvtest.convert(src2, temp2, dst.type());

        alvision.cvtest.multiply(temp1, temp2, temp1, 1);
        alvision.cvtest.add(temp1, 1, dst, 1,alvision.Scalar.all(0.), temp1, dst.depth());
        alvision.cvtest.copy(temp1, dst, mask);

    }
};


/// running average
class CV_RunningAvgTest extends CV_AccumBaseTest
{
    run_func(): void {
        alvision.accumulateWeighted(this.test_array[this.INPUT][0], this.test_array[this.INPUT_OUTPUT][0],
            this.alpha, this.test_array[this.MASK][0]);

    }
    prepare_to_validation(iii: alvision.int): void {
        var src = this.test_mat[this.INPUT][0];
        var dst = this.test_mat[this.REF_INPUT_OUTPUT][0];
        var temp = new alvision.Mat();
        var mask = this.test_array[this.MASK][0] ? this.test_mat[this.MASK][0] : new alvision.Mat();
        double a[1], b[1];

        var accdepth = this.test_mat[this.INPUT_OUTPUT][0].depth();
        CvMat A = cvMat(1, 1, accdepth, a), B = cvMat(1, 1, accdepth, b);

        cvSetReal1D( &A, 0, alpha);
        cvSetReal1D( &B, 0, 1 - cvGetReal1D(&A, 0));

        alvision.cvtest.convert(src, temp, dst.type());
        alvision.cvtest.add(src, cvGetReal1D(&A, 0), dst, cvGetReal1D(&B, 0), cvScalarAll(0.), temp, temp.depth());
        alvision.cvtest.copy(temp, dst, mask);

    }
};

alvision.cvtest.TEST('Video_Acc', 'accuracy', () => { var test = new CV_AccTest(); test.safe_run(); });
alvision.cvtest.TEST('Video_AccSquared', 'accuracy', () => { var test = new CV_SquareAccTest(); test.safe_run(); });
alvision.cvtest.TEST('Video_AccProduct', 'accuracy', () => { var test = new CV_MultiplyAccTest(); test.safe_run(); });
alvision.cvtest.TEST('Video_RunningAvg', 'accuracy', () => { var test = new CV_RunningAvgTest(); test.safe_run(); });
