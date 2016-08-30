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
//using namespace cv;
//using namespace std;

//function sign(a) {
//    return a > 0 ? 1 : a == 0 ? 0 : -1
//}
                               
const CORE_EIGEN_ERROR_COUNT = 1;
const CORE_EIGEN_ERROR_SIZE  =2;
const CORE_EIGEN_ERROR_DIFF  =3;
const CORE_EIGEN_ERROR_ORTHO =4;
const CORE_EIGEN_ERROR_ORDER =5;

const MESSAGE_ERROR_COUNT ="Matrix of eigen values must have the same rows as source matrix and 1 column.";
const MESSAGE_ERROR_SIZE  ="Source matrix and matrix of eigen vectors must have the same sizes."          ;
const MESSAGE_ERROR_DIFF_1= "Accurasy of eigen values computing less than required."                      ;
const MESSAGE_ERROR_DIFF_2= "Accuracy of eigen vectors computing less than required."                     ;
const MESSAGE_ERROR_ORTHO ="Matrix of eigen vectors is not orthogonal."                                   ;
const MESSAGE_ERROR_ORDER = "Eigen values are not sorted in ascending order.";

const COUNT_NORM_TYPES = 3;
const NORM_TYPE/*[COUNT_NORM_TYPES]*/ = [alvision.NormTypes.NORM_L1, alvision.NormTypes.NORM_L2, alvision.NormTypes.NORM_INF];

enum TASK_TYPE_EIGEN {VALUES, VECTORS};

class Core_EigenTest extends alvision.cvtest.BaseTest
{

    test_values(src: alvision.Mat): boolean {
        var type = src.type();
        var eps_val = type == alvision.MatrixType.CV_32FC1 ? this.eps_val_32 : this.eps_val_64;

        var eigen_values_1 = new alvision.Mat(), eigen_values_2 = new alvision.Mat(), eigen_vectors = new alvision.Mat ();

        if (!this.test_pairs(src)) return false;

        alvision.eigen(src, eigen_values_1, eigen_vectors);
        alvision.eigen(src, eigen_values_2);

        if (!this.check_pair_count1(src, eigen_values_2)) return false;

        for (var i = 0; i < COUNT_NORM_TYPES; ++i)
        {
            var diff = alvision.cvtest.norm(eigen_values_1, eigen_values_2, NORM_TYPE[i]);
            if (diff > eps_val) {
                console.log("Checking accuracy of eigen values computing for matrix " + src + ": ");
                this.print_information(i, src, diff, eps_val);
                alvision.CV_Error(CORE_EIGEN_ERROR_DIFF, MESSAGE_ERROR_DIFF_1);
                return false;
            }
        }

        return true;
    }											// complex test for eigen without vectors
    check_full(type: alvision.int): boolean {
        const  MAX_DEGREE = 7;

        //srand((unsigned int)time(0));

        for (var i = 0; i < this.ntests; ++i)
        {
            //var src_size = (Math.pow(2.0, (rand() % MAX_DEGREE) + 1.));
            var src_size = (Math.pow(2.0, (alvision.theRNG().int().valueOf() % MAX_DEGREE) + 1.));

            var src = new alvision.Mat(src_size, src_size, type);

            for (var j = 0; j < src.rows; ++j)
                for (var k = j; k < src.cols; ++k)
                    if (type == alvision.MatrixType.CV_32FC1) {
                        src.at<alvision.float>("float", k, j).set(src.at<alvision.float>("float", j, k).set(alvision.theRNG().float()));//alvision.randu<float>()));
                    }
                    else {
                        src.at<alvision.double>("double", k, j).set(src.at<alvision.double>("double", j, k).set(alvision.theRNG().double()));//alvision.randu<double>()));
                    }

            if (!this.test_values(src)) return false;
        }

        return true;
    }													// compex test for symmetric matrix
    run(int): void { }													// main testing method


    protected eps_val_32 : alvision.float;
    protected eps_vec_32: alvision.float;
    protected eps_val_64: alvision.float; 
    protected eps_vec_64: alvision.float;
    protected ntests: alvision.int ;

    check_pair_count1(src: alvision.Mat, evalues: alvision.Mat, low_index: alvision.int = -1, high_index: alvision.int = -1): boolean {
        var n = src.rows.valueOf(), s = alvision.sign(high_index);
        if (!((evalues.rows == n - Math.max(0, low_index.valueOf()) - (((n / 2.0) * (s * s - s)) + (1 + s - s * s) * (n - (high_index.valueOf() + 1)))) && (evalues.cols == 1))) {
            console.log("Checking sizes of eigen values matrix " + evalues + "...");
            console.log("Number of rows: " + evalues.rows + "   Number of cols: " + evalues.cols);
            console.log("Size of src symmetric matrix: " + src.rows + " * " + src.cols);
            alvision.CV_Error(CORE_EIGEN_ERROR_COUNT, MESSAGE_ERROR_COUNT);
            return false;
        }
        return true;
    }
    check_pair_count2(src: alvision.Mat, evalues: alvision.Mat, evectors: alvision.Mat, low_index: alvision.int = -1, high_index: alvision.int = -1): boolean {
        var n = src.rows.valueOf(), s = alvision.sign(high_index);
        var right_eigen_pair_count = n - Math.max(0, low_index.valueOf()) - (((n / 2.0) * (s * s - s)) + (1 + s - s * s) * (n - (high_index.valueOf() + 1)));

        if (!(evectors.rows == right_eigen_pair_count && evectors.cols == right_eigen_pair_count)) {
            console.log("Checking sizes of eigen vectors matrix " + evectors + "...");
            console.log("Number of rows: " + evectors.rows + "   Number of cols: " + evectors.cols);
            console.log("Size of src symmetric matrix: " + src.rows + " * " + src.cols);
            alvision.CV_Error(CORE_EIGEN_ERROR_SIZE, MESSAGE_ERROR_SIZE);
            return false;
        }

        if (!(evalues.rows == right_eigen_pair_count && evalues.cols == 1)) {
            console.log("Checking sizes of eigen values matrix " + evalues + "...");
            console.log("Number of rows: " + evalues.rows + "   Number of cols: " + evalues.cols);
            console.log("Size of src symmetric matrix: " + src.rows + " * " + src.cols);
            alvision.CV_Error(CORE_EIGEN_ERROR_COUNT, MESSAGE_ERROR_COUNT);
            return false;
        }

        return true;
    }
    check_pairs_order(eigen_values: alvision.Mat): boolean {
        switch (eigen_values.type()) {
            case alvision.MatrixType.CV_32FC1:
                {
                    for (var i = 0; i < (eigen_values.total().valueOf() - 1); ++i)
                        if (!(eigen_values.at<alvision.float>("float", i, 0).get() > eigen_values.at<alvision.float>("float",i + 1, 0).get())) {
                            console.log("Checking order of eigen values vector " + eigen_values + "...");
                            console.log("Pair of indexes with non ascending of eigen values: (" + i + ", " + i + 1 + ").");
                            alvision.CV_Error(CORE_EIGEN_ERROR_ORDER, MESSAGE_ERROR_ORDER);
                            return false;
                        }

                    break;
                }

            case alvision.MatrixType.CV_64FC1:
                {
                    for (var i = 0; i <(eigen_values.total().valueOf() - 1); ++i)
                        if (!(eigen_values.at<alvision.double>("double", i, 0).get() > eigen_values.at<alvision.double>("double", i + 1, 0).get())) {
                            console.log("Checking order of eigen values vector " + eigen_values + "...");
                            console.log("Pair of indexes with non ascending of eigen values: (" + i + ", " + i + 1 + ").");
                            alvision.CV_Error(CORE_EIGEN_ERROR_ORDER, "Eigen values are not sorted in ascending order.");
                            return false;
                        }

                    break;
                }

            default: ;
        }

        return true;
    }											// checking order of eigen values & vectors (it should be none up)
    check_orthogonality(U: alvision.Mat): boolean {
        var type = U.type();
        var eps_vec = type == alvision.MatrixType.CV_32FC1 ? this.eps_vec_32 : this.eps_vec_64;
        var UUt = new alvision.Mat();
        alvision.mulTransposed(U, UUt, false);

        var E = alvision.Mat.eye(U.rows, U.cols, type).toMat();

        for (var i = 0; i < COUNT_NORM_TYPES; ++i) {
            var diff = alvision.cvtest.norm(UUt, E, NORM_TYPE[i]);
            if (diff > eps_vec) {
                console.log("Checking orthogonality of matrix " + U + ": ");
                this.print_information(i, U, diff, eps_vec);
                alvision.CV_Error(CORE_EIGEN_ERROR_ORTHO, MESSAGE_ERROR_ORTHO);
                return false;
            }
        }

        return true;
    }												// checking is matrix of eigen vectors orthogonal
    test_pairs(src: alvision.Mat): boolean {									// complex test for eigen with vectors
        var type = src.type();
        var eps_vec = type == alvision.MatrixType.CV_32FC1 ? this.eps_vec_32 : this.eps_vec_64;

        var eigen_values = new alvision.Mat(), eigen_vectors = new alvision.Mat ();

        alvision.eigen(src, eigen_values, eigen_vectors);

        if (!this.check_pair_count2(src, eigen_values, eigen_vectors))
            return false;

        if (!this.check_orthogonality(eigen_vectors))
            return false;

        if (!this.check_pairs_order(eigen_values))
            return false;

        var eigen_vectors_t = new alvision.Mat (); alvision.transpose(eigen_vectors, eigen_vectors_t);

        var src_evec = new alvision.Mat (src.rows, src.cols, type);
        src_evec = alvision.MatExpr.op_Multiplication( src ,eigen_vectors_t).toMat();

        var eval_evec = new alvision.Mat (src.rows, src.cols, type);

        switch (type) {
            case alvision.MatrixType.CV_32FC1:
                {
                    for (var i = 0; i < src.cols; ++i)
                    {
                        var tmp =alvision.MatExpr.op_Multiplication( eigen_values.at<alvision.float>("float",i, 0).get() , eigen_vectors_t.col(i)).toMat();
                        for (var j = 0; j < src.rows; ++j) {
                            eval_evec.at<alvision.float>("float",j, i).set(tmp.at<alvision.float>("float",j, 0).get());
                        }
                    }

                    break;
                }

            case alvision.MatrixType.CV_64FC1:
                {
                    for (var i = 0; i < src.cols; ++i) {
                        var tmp = alvision.MatExpr.op_Multiplication( eigen_values.at < alvision.double>("double", i, 0).get() , eigen_vectors_t.col(i)).toMat();
                        for (var j = 0; j < src.rows; ++j) {
                            eval_evec.at<alvision.double>("double", j, i).set( tmp.at<alvision.double>("double",j, 0).get());
                        }
                    }

                    break;
                }

            default: ;
        }

        var disparity = alvision.MatExpr.op_Substraction( src_evec , eval_evec).toMat();

        for (var i = 0; i < COUNT_NORM_TYPES; ++i) {
            var diff = alvision.cvtest.norm(disparity, NORM_TYPE[i]);
            if (diff > eps_vec) {
                console.log("Checking accuracy of eigen vectors computing for matrix " + src + ": ");
                this.print_information(i, src, diff, eps_vec);
                alvision.CV_Error(CORE_EIGEN_ERROR_DIFF, MESSAGE_ERROR_DIFF_2);
                return false;
            }
        }

        return true;
    }				

    print_information(norm_idx: alvision.size_t, src: alvision.Mat, diff: alvision.double, max_diff: alvision.double): void{

        switch (NORM_TYPE[norm_idx.valueOf()]) {
            case alvision.NormTypes.NORM_L1: console.log("L1"); break;
            case alvision.NormTypes.NORM_L2: console.log("L2"); break;
            case alvision.NormTypes.NORM_INF: console.log("INF"); break;
            default: break;
        }

        console.log("-criteria... ");
        console.log("Source size: " + src.rows + " * " + src.cols);
        console.log("Difference between original eigen vectors matrix and result: " + diff);
        console.log("Maximum allowed difference: " + max_diff);
    }

    
};

class Core_EigenTest_Scalar extends Core_EigenTest
{
    constructor() {
        super()
        this.eps_val_32 = (1e-3);
        this.eps_vec_32 = (12e-3);
        this.eps_val_64 = (1e-4);
        this.eps_vec_64 = (1e-3);
        this.ntests = (100);

    }
    run(int): void { }
};

class Core_EigenTest_Scalar_32 extends Core_EigenTest_Scalar
{
    run(int): void {
        for (var i = 0; i < this.ntests; ++i) {
            var value = alvision.theRNG().float();// alvision.randu<alvision.float>();
            var src = new alvision.Mat (1, 1, alvision.MatrixType.CV_32FC1, alvision.Scalar.all(value));
            this.test_values(src);
        }
    }
};

class Core_EigenTest_Scalar_64 extends Core_EigenTest_Scalar
{
    run(int): void {
        for (var i = 0; i < this.ntests; ++i) {
            var value = alvision.theRNG().float();// alvision.randu<float>();
            var src = new alvision.Mat (1, 1, alvision.MatrixType.CV_64FC1, alvision.Scalar.all(value));
            this.test_values(src);
        }
    }
};

class Core_EigenTest_32 extends Core_EigenTest
{
    run(int): void { this.check_full(alvision.MatrixType.CV_32FC1);  }
};

class Core_EigenTest_64 extends Core_EigenTest
{
    run(int): void { this.check_full(alvision.MatrixType.CV_64FC1);  }
};



alvision.cvtest.TEST('Core_Eigen', 'scalar_32', () => { var test = new Core_EigenTest_Scalar_32(); test.safe_run(); });
alvision.cvtest.TEST('Core_Eigen', 'scalar_64', () => { var test = new Core_EigenTest_Scalar_64 (); test.safe_run(); });
alvision.cvtest.TEST('Core_Eigen', 'vector_32', () => { var test = new Core_EigenTest_32(); test.safe_run(); });
alvision.cvtest.TEST('Core_Eigen', 'vector_64', () => { var test = new Core_EigenTest_64(); test.safe_run(); });
