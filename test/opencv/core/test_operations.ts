//TODO: implement!

///*M///////////////////////////////////////////////////////////////////////////////////////
////
////  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
////
////  By downloading, copying, installing or using the software you agree to this license.
////  If you do not agree to this license, do not download, install,
////  copy or use the software.
////
////
////                           License Agreement
////                For Open Source Computer Vision Library
////
//// Copyright (C) 2000-2008, Intel Corporation, all rights reserved.
//// Copyright (C) 2009, Willow Garage Inc., all rights reserved.
//// Third party copyrights are property of their respective owners.
////
//// Redistribution and use in source and binary forms, with or without modification,
//// are permitted provided that the following conditions are met:
////
////   * Redistribution's of source code must retain the above copyright notice,
////     this list of conditions and the following disclaimer.
////
////   * Redistribution's in binary form must reproduce the above copyright notice,
////     this list of conditions and the following disclaimer in the documentation
////     and/or other materials provided with the distribution.
////
////   * The name of the copyright holders may not be used to endorse or promote products
////     derived from this software without specific prior written permission.
////
//// This software is provided by the copyright holders and contributors "as is" and
//// any express or implied warranties, including, but not limited to, the implied
//// warranties of merchantability and fitness for a particular purpose are disclaimed.
//// In no event shall the Intel Corporation or contributors be liable for any direct,
//// indirect, incidental, special, exemplary, or consequential damages
//// (including, but not limited to, procurement of substitute goods or services;
//// loss of use, data, or profits; or business interruption) however caused
//// and on any theory of liability, whether in contract, strict liability,
//// or tort (including negligence or otherwise) arising in any way out of
//// the use of this software, even if advised of the possibility of such damage.
////
////M*/

//import tape = require("tape");
//import path = require("path");
//
//import async = require("async");
//import alvision = require("../../../tsbinding/alvision");
//import util = require('util');
//import fs = require('fs');

////#include "test_precomp.hpp"
////
////#include <string>
////#include <iostream>
////#include <fstream>
////#include <iterator>
////#include <limits>
////#include <numeric>
////
////using namespace cv;
////using namespace std;

//function CHECK_DIFF(a : alvision.Mat, b : alvision.Mat) {
//    var s = "diff error";
//    //todo, add stack trace to s;
//    if (alvision.cvtest.norm(a, b, alvision.NormTypes.NORM_INF) != 0) throw new test_excep(s);
//}

//function CHECK_DIFF_FLT(a : alvision.Mat, b : alvision.Mat) {
//    var s = "diff error";
//    //todo: add stack trace to s
//    if (alvision.cvtest.norm(a, b, alvision.NormTypes.NORM_INF) > 1e-5) throw new test_excep(s);
//}

////function CHECK_DIFF_FLT(a, b) checkDiffF(a, b, "(" #a ")  !=(eps)  (" #b ")  at l." STR(__LINE__))


//class test_excep
//{
//    constructor(_s: string = "") {
//        this.s = (_s);
//    }
//    protected s: string;
//};

//class CV_OperationsTest  extends alvision.cvtest.BaseTest
//{

//    run(iii: alvision.int): void {
//        if (!this.TestMat())
//            return;

//        if (!this.SomeMatFunctions())
//            return;

//        if (!this.TestTemplateMat())
//            return;

//        /*   if (!TestMatND())
//               return;*/

//        if (!this.TestSparseMat())
//            return;

//        if (!this.TestVec())
//            return;

//        if (!this.TestMatxMultiplication())
//            return;

//        if (!this.TestMatxElementwiseDivison())
//            return;

//        if (!this.TestSubMatAccess())
//            return;

//        if (!this.TestExp())
//            return;

//        if (!this.TestSVD())
//            return;

//        if (!this.operations1())
//            return;

//        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
//    }

    

//    SomeMatFunctions(): boolean {
//        try {
//            var rgba = new alvision.Mat(10, 10, alvision.MatrixType.CV_8UC4, new alvision.Scalar(1, 2, 3, 4));
//            var bgr = new alvision.Mat (rgba.rows, rgba.cols,  alvision.MatrixType.CV_8UC3);
//            var alpha = new alvision.Mat(rgba.rows, rgba.cols, alvision.MatrixType.CV_8UC1);
//            var out = [bgr, alpha];
//            // rgba[0] . bgr[2], rgba[1] . bgr[1],
//            // rgba[2] . bgr[0], rgba[3] . alpha[0]
//            var from_to = [0, 2, 1, 1, 2, 0, 3, 3];
//            alvision.mixChannels( rgba, 1, out, 2, from_to, 4);

//            var bgr_exp = new alvision.Mat(rgba.size(),    alvision.MatrixType.CV_8UC3, new alvision.Scalar(3, 2, 1));
//            var alpha_exp = new alvision.Mat (rgba.size(), alvision.MatrixType.CV_8UC1, new alvision.Scalar(4));

//            CHECK_DIFF(bgr_exp, bgr);
//            CHECK_DIFF(alpha_exp, alpha);
//        }
//        catch (e) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "%s\n", e.s);
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
//            return false;
//        }
//        return true;

//    }
//    TestMat(): boolean {
//        try {
//            var one_3x1 = new alvision.Mat(3, 1, alvision.MatrixType.CV_32F,new alvision. Scalar(1.0));
//            var shi_3x1 = new alvision.Mat(3, 1, alvision.MatrixType.CV_32F,new alvision. Scalar(1.2));
//            var shi_2x1 = new alvision.Mat(2, 1, alvision.MatrixType.CV_32F,new alvision. Scalar(-1));
//            var shift = alvision.Scalar.all(15);

//            var data = [Math.sqrt(2.) / 2, -Math.sqrt(2.) / 2, 1., Math.sqrt(2.) / 2, Math.sqrt(2.) / 2, 10. ];
//            var rot_2x3 = new alvision.Mat(2, 3,alvision.MatrixType. CV_32F, data);

//            var res = alvision.Mat.from(alvision.MatExpr.op_Addition( one_3x1 , shi_3x1).op_Addition(shi_3x1).op_Addition( shi_3x1));
//            res = alvision.Mat.from(alvision.MatExpr.op_Multiplication(2 , rot_2x3).op_Multiplication( res).op_Substraction( shi_2x1).op_Addition( shift);

//            var tmp = new alvision.Mat(), res2 = new alvision.Mat();
//            alvision.add(one_3x1, shi_3x1, tmp);
//            alvision.add(tmp, shi_3x1, tmp);
//            alvision.add(tmp, shi_3x1, tmp);
//            alvision.gemm(rot_2x3, tmp, 2, shi_2x1, -1, res2, 0);
//            alvision.add(res2, new alvision.Mat(2, 1, alvision.MatrixType.CV_32F, shift), res2);

//            CHECK_DIFF(res, res2);

//            var mat4x4 = new alvision.Mat(4, 4, alvision.MatrixType.CV_32F);
//            alvision.randu(mat4x4,new alvision. Scalar(0),new alvision. Scalar(10));

//            var roi1 = mat4x4(new alvision.Rect(Point(1, 1), new alvision.Size(2, 2)));
//            var roi2 = mat4x4(new alvision.Range(1, 3), new alvision.Range(1, 3));

//            CHECK_DIFF(roi1, roi2);
//            CHECK_DIFF(mat4x4, mat4x4(new alvision.Rect(Point(0, 0), mat4x4.size())));

//            var intMat10 = new alvision.Mat(3, 3, alvision.MatrixType.CV_32S, new alvision.Scalar(10));
//            var intMat11 = new alvision.Mat(3, 3, alvision.MatrixType.CV_32S, new alvision.Scalar(11));
//            var resMat = new alvision.Mat(3, 3,   alvision.MatrixType.CV_8U,  new alvision.Scalar(255));

//            CHECK_DIFF(resMat, alvision.Mat.from(alvision.MatExpr.op_Equals(intMat10, intMat10)));
//            CHECK_DIFF(resMat, alvision.Mat.from(alvision.MatExpr.op_LessThan( intMat10 , intMat11)));
//            CHECK_DIFF(resMat, alvision.Mat.from(alvision.MatExpr.op_GreaterThan(intMat11, intMat10)));
//            CHECK_DIFF(resMat, alvision.Mat.from(alvision.MatExpr.op_LessThenOrEqual(intMat10, intMat11)));
//            CHECK_DIFF(resMat, alvision.Mat.from(alvision.MatExpr.op_GreaterThanOrEqual( intMat11 , intMat10)));
//            CHECK_DIFF(resMat,alvision.Mat.from(alvision.MatExpr.op_NotEquals( intMat11 , intMat10)));

//            CHECK_DIFF(resMat,alvision.Mat.from(alvision.MatExpr.op_Equals( intMat10 , 10.0)));
//            CHECK_DIFF(resMat, alvision.Mat.from(alvision.MatExpr.op_Equals(10.0, intMat10)));
//            CHECK_DIFF(resMat, alvision.Mat.from(alvision.MatExpr.op_LessThan(intMat10, 11.0)));
//            CHECK_DIFF(resMat, alvision.Mat.from(alvision.MatExpr.op_GreaterThan( 11.0 , intMat10)));
//            CHECK_DIFF(resMat, alvision.Mat.from(alvision.MatExpr.op_LessThan(10.0, intMat11)));
//            CHECK_DIFF(resMat, alvision.Mat.from(alvision.MatExpr.op_GreaterThanOrEqual(11.0, intMat10)));
//            CHECK_DIFF(resMat, alvision.Mat.from(alvision.MatExpr.op_LessThenOrEqual( 10.0, intMat11)));
//            CHECK_DIFF(resMat,alvision.Mat.from(alvision.MatExpr.op_NotEquals( 10.0 , intMat11)));
//            CHECK_DIFF(resMat,alvision.Mat.from(alvision.MatExpr.op_NotEquals( intMat11 , 10.0)));

//            var eye = alvision.Mat.eye(3, 3, alvision.MatrixType.CV_16S);
//            var maskMat4 = new alvision.Mat(3, 3, alvision.MatrixType.CV_16S, new alvision.Scalar(4));
//            var maskMat1 = new alvision.Mat(3, 3, alvision.MatrixType.CV_16S, new alvision.Scalar(1));
//            var maskMat5 = new alvision.Mat(3, 3, alvision.MatrixType.CV_16S, new alvision.Scalar(5));
//            var maskMat0 = new alvision.Mat(3, 3, alvision.MatrixType.CV_16S, new alvision.Scalar(0));

//            CHECK_DIFF(maskMat0,alvision.Mat.from(alvision.MatExpr.op_And( maskMat4 , maskMat1)));
//            CHECK_DIFF(maskMat0,alvision.Mat.from(alvision.MatExpr.op_And( new alvision.Scalar(1) , maskMat4)));
//            CHECK_DIFF(maskMat0,alvision.Mat.from(alvision.MatExpr.op_And( maskMat4 , new alvision.Scalar(1))));

//            var m = new alvision.Mat();

//            //DROR: will not be implemented in javascript
//            //m = maskMat4.clone(); m &= maskMat1; CHECK_DIFF(maskMat0, m);
//            //m = maskMat4.clone(); m &= maskMat1 | maskMat1; CHECK_DIFF(maskMat0, m);
//            //m = maskMat4.clone(); m &= (2 * maskMat1 - maskMat1); CHECK_DIFF(maskMat0, m);

//            //m = maskMat4.clone(); m &= Scalar(1); CHECK_DIFF(maskMat0, m);
//            //m = maskMat4.clone(); m |= maskMat1; CHECK_DIFF(maskMat5, m);
//            //m = maskMat5.clone(); m ^= maskMat1; CHECK_DIFF(maskMat4, m);
//            //m = maskMat4.clone(); m |= (2 * maskMat1 - maskMat1); CHECK_DIFF(maskMat5, m);
//            //m = maskMat5.clone(); m ^= (2 * maskMat1 - maskMat1); CHECK_DIFF(maskMat4, m);

//            //m = maskMat4.clone(); m |= Scalar(1); CHECK_DIFF(maskMat5, m);
//            //m = maskMat5.clone(); m ^= Scalar(1); CHECK_DIFF(maskMat4, m);



//            CHECK_DIFF(maskMat0, alvision.Mat.from(alvision.MatExpr.op_Or(maskMat4, maskMat4).op_And( alvision.MatExpr.op_Or(maskMat1, maskMat1))));
//            CHECK_DIFF(maskMat0, alvision.Mat.from(alvision.MatExpr.op_Or(maskMat4 , maskMat4).op_And( maskMat1)));
//            CHECK_DIFF(maskMat0, alvision.Mat.from(alvision.MatExpr.op_And( maskMat4 , alvision.MatExpr.op_Or(maskMat1 , maskMat1))));
//            CHECK_DIFF(maskMat0, alvision.Mat.from(alvision.MatExpr.op_Or(maskMat1 , maskMat1).op_And(new alvision.Scalar(4))));
//            CHECK_DIFF(maskMat0, alvision.Mat.from(alvision.MatExpr.op_And( new alvision.Scalar(4) , alvision.MatExpr.op_Or(maskMat1 , maskMat1))));

//            CHECK_DIFF(maskMat0, alvision.Mat.from(alvision.MatExpr.op_Xor( maskMat5 ,alvision.MatExpr.op_Or(maskMat4 , maskMat1))));
//            CHECK_DIFF(maskMat0, alvision.Mat.from(alvision.MatExpr.op_Or(maskMat4, maskMat1).op_Xor(maskMat5)));
//            CHECK_DIFF(maskMat0, alvision.Mat.from(alvision.MatExpr.op_Addition(maskMat4 , maskMat1).op_Xor( alvision.MatExpr.op_Addition(maskMat4 , maskMat1))));
//            CHECK_DIFF(maskMat0, alvision.Mat.from(alvision.MatExpr.op_Xor( new alvision.Scalar(5) , alvision.MatExpr.op_Or(maskMat4 , new alvision.Scalar(1)))));
//            CHECK_DIFF(maskMat1, alvision.Mat.from(alvision.MatExpr.op_Xor(new alvision. Scalar(5),maskMat4)));
//            CHECK_DIFF(maskMat0, alvision.Mat.from(alvision.MatExpr.op_Xor(new alvision. Scalar(5),alvision.MatExpr.op_Addition(maskMat4 , maskMat1))));
//            CHECK_DIFF(maskMat5, alvision.Mat.from(alvision.MatExpr.op_Or(new alvision. Scalar(5) ,alvision.MatExpr.op_Addition(maskMat4 , maskMat1)));
//            CHECK_DIFF(maskMat0, alvision.Mat.from(alvision.MatExpr.op_Addition (maskMat4 , maskMat1).op_Xor(new alvision. Scalar(5))));

//            CHECK_DIFF(maskMat5,alvision.Mat.from(alvision.MatExpr.op_Or( maskMat5 ,alvision.MatExpr.op_Xor(maskMat4 , maskMat1))));
//            CHECK_DIFF(maskMat5,alvision.Mat.from(alvision.MatExpr.op_Xor (maskMat4 , maskMat1).op_Or( maskMat5)));
//            CHECK_DIFF(maskMat5,alvision.Mat.from(alvision.MatExpr.op_Or( maskMat5 ,alvision.MatExpr.op_Xor(maskMat4 , new alvision.Scalar(1)))));
//            CHECK_DIFF(maskMat5,alvision.Mat.from(alvision.MatExpr.op_Or (maskMat4 , maskMat4).op_Or(new alvision. Scalar(1))));
//            CHECK_DIFF(maskMat5,alvision.Mat.from(alvision.MatExpr.op_Or(new alvision. Scalar(1) ,alvision.MatExpr.op_Or (maskMat4 , maskMat4))));
//            CHECK_DIFF(maskMat5,alvision.Mat.from(alvision.MatExpr.op_Or(new alvision. Scalar(1) , maskMat4)));
//            CHECK_DIFF(maskMat5,alvision.Mat.from(alvision.MatExpr.op_Or(maskMat5 , maskMat5).op_Or(alvision.MatExpr.op_Xor(maskMat4 , maskMat1))));

//            CHECK_DIFF(maskMat1, alvision.Mat.from(alvision.MatExpr.min(maskMat1, maskMat5)));;
//            CHECK_DIFF(maskMat1,alvision.Mat.from(alvision.MatExpr. min(alvision.Mat.from(alvision.MatExpr.op_Or( maskMat1 , maskMat1)), alvision.MatExpr.op_Or(maskMat5 , maskMat5).toMat())));
//            CHECK_DIFF(maskMat5,alvision.Mat.from(alvision.MatExpr. max(maskMat1, maskMat5)));
//            CHECK_DIFF(maskMat5,alvision.Mat.from(alvision.MatExpr. max(alvision.MatExpr.op_Or(maskMat1 , maskMat1), alvision.MatExpr.op_Or(maskMat5 , maskMat5))));

//            CHECK_DIFF(maskMat1,alvision.Mat.from(alvision.MatExpr. min(maskMat1,alvision.MatExpr.op_Or( maskMat5 , maskMat5))));
//            CHECK_DIFF(maskMat1,alvision.Mat.from(alvision.MatExpr. min(alvision.MatExpr.op_Or( maskMat1 , maskMat1), maskMat5)));
//            CHECK_DIFF(maskMat5,alvision.Mat.from(alvision.MatExpr. max(alvision.MatExpr.op_Or( maskMat1 , maskMat1), maskMat5)));
//            CHECK_DIFF(maskMat5,alvision.Mat.from(alvision.MatExpr. max(maskMat1,alvision.MatExpr.op_Or( maskMat5 , maskMat5))));

//            CHECK_DIFF(alvision.MatExpr.op_BinaryNot(maskMat1).toMat(), alvision.MatExpr.op_Xor( maskMat1 , -1).toMat());
//            CHECK_DIFF(alvision.MatExpr.op_Or( maskMat1 , maskMat1).op_BinaryNot().toMat(), alvision.MatExpr.op_Xor(maskMat1 , -1).toMat());

//            CHECK_DIFF(maskMat1,alvision.MatExpr.op_Division( maskMat4 , 4.0).toMat());

//            /////////////////////////////

//            CHECK_DIFF(alvision.MatExpr.op_Substraction( 1.0 , alvision.MatExpr.op_Or(maskMat5 , maskMat5)).toMat(), alvision.MatExpr.op_Substraction( maskMat4).toMat());
//            CHECK_DIFF(alvision.MatExpr.op_Or(maskMat4, maskMat4).op_Multiplication(1.0).op_Addition(1.0).toMat(), maskMat5);

//            //TODO:contiue..
////            CHECK_DIFF(1.0 + (maskMat4 | maskMat4) * 1.0, maskMat5);
////            CHECK_DIFF((maskMat5 | maskMat5) * 1.0 - 1.0, maskMat4);
////            CHECK_DIFF(5.0 - (maskMat4 | maskMat4) * 1.0, maskMat1);
////            CHECK_DIFF((maskMat4 | maskMat4) * 1.0 + 0.5 + 0.5, maskMat5);
////            CHECK_DIFF(0.5 + ((maskMat4 | maskMat4) * 1.0 + 0.5), maskMat5);
////            CHECK_DIFF(((maskMat4 | maskMat4) * 1.0 + 2.0) - 1.0, maskMat5);
////            CHECK_DIFF(5.0 - ((maskMat1 | maskMat1) * 1.0 + 3.0), maskMat1);
////            CHECK_DIFF(((maskMat1 | maskMat1) * 2.0 + 2.0) * 1.25, maskMat5);
////            CHECK_DIFF(1.25 * ((maskMat1 | maskMat1) * 2.0 + 2.0), maskMat5);
////            CHECK_DIFF(-((maskMat1 | maskMat1) * (-2.0) + 1.0), maskMat1);
////            CHECK_DIFF(maskMat1 * 1.0 + maskMat4 * 0.5 + 2.0, maskMat5);
////            CHECK_DIFF(1.0 + (maskMat1 * 1.0 + maskMat4 * 0.5 + 1.0), maskMat5);
////            CHECK_DIFF((maskMat1 * 1.0 + maskMat4 * 0.5 + 2.0) - 1.0, maskMat4);
////            CHECK_DIFF(5.0 - (maskMat1 * 1.0 + maskMat4 * 0.5 + 1.0), maskMat1);
////            CHECK_DIFF((maskMat1 * 1.0 + maskMat4 * 0.5 + 1.0) * 1.25, maskMat5);
////            CHECK_DIFF(1.25 * (maskMat1 * 1.0 + maskMat4 * 0.5 + 1.0), maskMat5);
////            CHECK_DIFF(-(maskMat1 * 2.0 + maskMat4 * (-1) + 1.0), maskMat1);
////            CHECK_DIFF((maskMat1 * 1.0 + maskMat4), maskMat5);
////            CHECK_DIFF((maskMat4 + maskMat1 * 1.0), maskMat5);
////            CHECK_DIFF((maskMat1 * 3.0 + 1.0) + maskMat1, maskMat5);
////            CHECK_DIFF(maskMat1 + (maskMat1 * 3.0 + 1.0), maskMat5);
////            CHECK_DIFF(maskMat1 * 4.0 + (maskMat1 | maskMat1), maskMat5);
////            CHECK_DIFF((maskMat1 | maskMat1) + maskMat1 * 4.0, maskMat5);
////            CHECK_DIFF((maskMat1 * 3.0 + 1.0) + (maskMat1 | maskMat1), maskMat5);
////            CHECK_DIFF((maskMat1 | maskMat1) + (maskMat1 * 3.0 + 1.0), maskMat5);
////            CHECK_DIFF(maskMat1 * 4.0 + maskMat4 * 2.0, maskMat1 * 12);
////            CHECK_DIFF((maskMat1 * 3.0 + 1.0) + maskMat4 * 2.0, maskMat1 * 12);
////            CHECK_DIFF(maskMat4 * 2.0 + (maskMat1 * 3.0 + 1.0), maskMat1 * 12);
////            CHECK_DIFF((maskMat1 * 3.0 + 1.0) + (maskMat1 * 2.0 + 2.0), maskMat1 * 8);

////            CHECK_DIFF(maskMat5 * 1.0 - maskMat4, maskMat1);
////            CHECK_DIFF(maskMat5 - maskMat1 * 4.0, maskMat1);
////            CHECK_DIFF((maskMat4 * 1.0 + 4.0) - maskMat4, maskMat4);
////            CHECK_DIFF(maskMat5 - (maskMat1 * 2.0 + 2.0), maskMat1);
////            CHECK_DIFF(maskMat5 * 1.0 - (maskMat4 | maskMat4), maskMat1);
////            CHECK_DIFF((maskMat5 | maskMat5) - maskMat1 * 4.0, maskMat1);
////            CHECK_DIFF((maskMat4 * 1.0 + 4.0) - (maskMat4 | maskMat4), maskMat4);
////            CHECK_DIFF((maskMat5 | maskMat5) - (maskMat1 * 2.0 + 2.0), maskMat1);
////            CHECK_DIFF(maskMat1 * 5.0 - maskMat4 * 1.0, maskMat1);
////            CHECK_DIFF((maskMat1 * 5.0 + 3.0) - maskMat4 * 1.0, maskMat4);
////            CHECK_DIFF(maskMat4 * 2.0 - (maskMat1 * 4.0 + 3.0), maskMat1);
////            CHECK_DIFF((maskMat1 * 2.0 + 3.0) - (maskMat1 * 3.0 + 1.0), maskMat1);

////            CHECK_DIFF((maskMat5 - maskMat4) * 4.0, maskMat4);
////            CHECK_DIFF(4.0 * (maskMat5 - maskMat4), maskMat4);

////            CHECK_DIFF(-((maskMat4 | maskMat4) - (maskMat5 | maskMat5)), maskMat1);

////            CHECK_DIFF(4.0 * (maskMat1 | maskMat1), maskMat4);
////            CHECK_DIFF((maskMat4 | maskMat4) / 4.0, maskMat1);

//////            #if !MSVC_OLD
////        CHECK_DIFF(2.0 * (maskMat1 * 2.0), maskMat4);
//////            #endif
////            CHECK_DIFF((maskMat4 / 2.0) / 2.0, maskMat1);
////            CHECK_DIFF(-(maskMat4 - maskMat5), maskMat1);
////            CHECK_DIFF(-((maskMat4 - maskMat5) * 1.0), maskMat1);


////            /////////////////////////////
////            CHECK_DIFF(maskMat4 / maskMat4, maskMat1);

////            ///// Element-wise multiplication

////            CHECK_DIFF(maskMat4.mul(maskMat4, 0.25), maskMat4);
////            CHECK_DIFF(maskMat4.mul(maskMat1 * 4, 0.25), maskMat4);
////            CHECK_DIFF(maskMat4.mul(maskMat4 / 4), maskMat4);
////            CHECK_DIFF(maskMat4.mul(maskMat4 / 4), maskMat4);
////            CHECK_DIFF(maskMat4.mul(maskMat4) * 0.25, maskMat4);
////            CHECK_DIFF(0.25 * maskMat4.mul(maskMat4), maskMat4);

////            ////// Element-wise division

////            CHECK_DIFF(maskMat4 / maskMat4, maskMat1);
////            CHECK_DIFF((maskMat4 & maskMat4) / (maskMat1 * 4), maskMat1);

////            CHECK_DIFF((maskMat4 & maskMat4) / maskMat4, maskMat1);
////            CHECK_DIFF(maskMat4 / (maskMat4 & maskMat4), maskMat1);
////            CHECK_DIFF((maskMat1 * 4) / maskMat4, maskMat1);

////            CHECK_DIFF(maskMat4 / (maskMat1 * 4), maskMat1);
////            CHECK_DIFF((maskMat4 * 0.5) / (maskMat1 * 2), maskMat1);

////            CHECK_DIFF(maskMat4 / maskMat4.mul(maskMat1), maskMat1);
////            CHECK_DIFF((maskMat4 & maskMat4) / maskMat4.mul(maskMat1), maskMat1);

////            CHECK_DIFF(4.0 / maskMat4, maskMat1);
////            CHECK_DIFF(4.0 / (maskMat4 | maskMat4), maskMat1);
////            CHECK_DIFF(4.0 / (maskMat1 * 4.0), maskMat1);
////            CHECK_DIFF(4.0 / (maskMat4 / maskMat1), maskMat1);

//            //m = maskMat4.clone(); m /= 4.0; CHECK_DIFF(m, maskMat1);
//            //m = maskMat4.clone(); m /= maskMat4; CHECK_DIFF(m, maskMat1);
//            //m = maskMat4.clone(); m /= (maskMat1 * 4.0); CHECK_DIFF(m, maskMat1);
//            //m = maskMat4.clone(); m /= (maskMat4 / maskMat1); CHECK_DIFF(m, maskMat1);

//            /////////////////////////////
//            var matrix_data = [3, 1, -4, -5, 1, 0, 0, 1.1, 1.5];
//            var mt = new alvision.Mat(3, 3, alvision.MatrixType.CV_32F, matrix_data);
//            var mi = mt.inv().toMat();
//            var d1 = alvision.Mat.eye(3, 3, alvision.MatrixType.CV_32F).toMat();
//            var d2 = alvision.MatExpr.op_Multiplication( d1 , 2).toMat();
//            var mt_tr = mt.t();
//            var mi_tr = mi.t();
//            var mi2 = alvision.MatExpr.op_Multiplication(mi, 2).toMat();


//            CHECK_DIFF_FLT(alvision.MatExpr.op_Multiplication(mi2 , mt).toMat(), d2);
//            CHECK_DIFF_FLT(alvision.MatExpr.op_Multiplication(mi , mt).toMat(), d1);
//            CHECK_DIFF_FLT(alvision.MatExpr.op_Multiplication(mt_tr , mi_tr).toMat(), d1);

//            //DROR: op + equals not implemented in javascript
//            //m = mi.clone(); m *= mt; CHECK_DIFF_FLT(m, d1);
//            //m = mi.clone(); m *= (2 * mt - mt); CHECK_DIFF_FLT(m, d1);

//            //m = maskMat4.clone(); m += (maskMat1 * 1.0); CHECK_DIFF(m, maskMat5);
//            //m = maskMat5.clone(); m -= (maskMat1 * 4.0); CHECK_DIFF(m, maskMat1);

//            //m = maskMat1.clone(); m += (maskMat1 * 3.0 + 1.0); CHECK_DIFF(m, maskMat5);
//            //m = maskMat5.clone(); m -= (maskMat1 * 3.0 + 1.0); CHECK_DIFF(m, maskMat1);
//            ////#if !MSVC_OLD
//            //m = mi.clone(); m += (3.0 * mi * mt + d1); CHECK_DIFF_FLT(m, mi + d1 * 4);
//            //m = mi.clone(); m -= (3.0 * mi * mt + d1); CHECK_DIFF_FLT(m, mi - d1 * 4);
//            //m = mi.clone(); m *= (mt * 1.0); CHECK_DIFF_FLT(m, d1);
//            //m = mi.clone(); m *= (mt * 1.0 + alvision.Mat.eye(m.size(), m.type())); CHECK_DIFF_FLT(m, d1 + mi);
//            //m = mi.clone(); m *= mt_tr.t(); CHECK_DIFF_FLT(m, d1);

//            //TODO: continue to implement expressions
//            //CHECK_DIFF_FLT((mi * 2) * mt, d2);
//            //CHECK_DIFF_FLT(mi * (2 * mt), d2);
//            //CHECK_DIFF_FLT(mt.t() * mi_tr, d1);
//            //CHECK_DIFF_FLT(mt_tr * mi.t(), d1);
//            //CHECK_DIFF_FLT((mi * 0.4) * (mt * 5), d2);

//            //CHECK_DIFF_FLT(mt.t() * (mi_tr * 2), d2);
//            //CHECK_DIFF_FLT((mt_tr * 2) * mi.t(), d2);

//            //CHECK_DIFF_FLT(mt.t() * mi.t(), d1);
//            //CHECK_DIFF_FLT((mi * mt) * 2.0, d2);
//            //CHECK_DIFF_FLT(2.0 * (mi * mt), d2);
//            //CHECK_DIFF_FLT(-(mi * mt), -d1);

//            //CHECK_DIFF_FLT((mi * mt) / 2.0, d1 / 2);

//            var mt_mul_2_plus_1 = new alvision.Mat();
//            alvision.gemm(mt, d1, 2, alvision.Mat.ones(3, 3, alvision.MatrixType.CV_32F).toMat(), 1, mt_mul_2_plus_1);


//            //TODO: continue to implement
//            //CHECK_DIFF((mt * 2.0 + 1.0) * mi, mt_mul_2_plus_1 * mi);        // (A*alpha + beta)*B
//            //CHECK_DIFF(mi * (mt * 2.0 + 1.0), mi * mt_mul_2_plus_1);        // A*(B*alpha + beta)
//            //CHECK_DIFF((mt * 2.0 + 1.0) * (mi * 2), mt_mul_2_plus_1 * mi2); // (A*alpha + beta)*(B*gamma)
//            //CHECK_DIFF((mi * 2) * (mt * 2.0 + 1.0), mi2 * mt_mul_2_plus_1);   // (A*gamma)*(B*alpha + beta)
//            //CHECK_DIFF_FLT((mt * 2.0 + 1.0) * mi.t(), mt_mul_2_plus_1 * mi_tr); // (A*alpha + beta)*B^t
//            //CHECK_DIFF_FLT(mi.t() * (mt * 2.0 + 1.0), mi_tr * mt_mul_2_plus_1); // A^t*(B*alpha + beta)

//            //CHECK_DIFF_FLT((mi * mt + d2) * 5, d1 * 3 * 5);
//            //CHECK_DIFF_FLT(mi * mt + d2, d1 * 3);
//            //CHECK_DIFF_FLT(-(mi * mt) + d2, d1);
//            //CHECK_DIFF_FLT((mi * mt) + d1, d2);
//            //CHECK_DIFF_FLT(d1 + (mi * mt), d2);
//            //CHECK_DIFF_FLT((mi * mt) - d2, -d1);
//            //CHECK_DIFF_FLT(d2 - (mi * mt), d1);

//            //CHECK_DIFF_FLT((mi * mt) + d2 * 0.5, d2);
//            //CHECK_DIFF_FLT(d2 * 0.5 + (mi * mt), d2);
//            //CHECK_DIFF_FLT((mi * mt) - d1 * 2, -d1);
//            //CHECK_DIFF_FLT(d1 * 2 - (mi * mt), d1);

//            //CHECK_DIFF_FLT((mi * mt) + mi.t(), mi_tr + d1);
//            //CHECK_DIFF_FLT(mi.t() + (mi * mt), mi_tr + d1);
//            //CHECK_DIFF_FLT((mi * mt) - mi.t(), d1 - mi_tr);
//            //CHECK_DIFF_FLT(mi.t() - (mi * mt), mi_tr - d1);

//            //CHECK_DIFF_FLT(2.0 * (mi * mt + d2), d1 * 6);
//            //CHECK_DIFF_FLT(-(mi * mt + d2), d1 * -3);

//            //CHECK_DIFF_FLT(mt.inv() * mt, d1);

//            //CHECK_DIFF_FLT(mt.inv() * (2 * mt - mt), d1);
//            //#endif
//        }
//        catch (e) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "%s\n", e.s);
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
//            return false;
//        }
//        return true;
//    }
//    TestType<T>(sz: alvision.Size, value: T): void {
//        alvision.Mat_ < T > m(sz);
//        alvision.CV_Assert(() => m.cols == sz.width && m.rows == sz.height && m.depth() == DataType<_Tp>::depth &&
//            m.channels() == DataType<_Tp>::channels &&
//                m.elemSize() == sizeof(_Tp) && m.step == m.elemSize() * m.cols);
//        for (var y = 0; y < sz.height; y++)
//            for (var x = 0; x < sz.width; x++) {
//                m(y, x) = value;
//            }

//        var s = sum(Mat(m).reshape(1))[0];
//        alvision.CV_Assert(() => s == (double)sz.width * sz.height);
//    }


//    TestTemplateMat(): boolean {
//        try {
//            Mat_ < float > one_3x1(3, 1, 1.0);
//            Mat_ < float > shi_3x1(3, 1, 1.2);
//            Mat_ < float > shi_2x1(2, 1, -2);
//            var shift = alvision.Scalar.all(15);

//            var data = [Math.sqrt(2.) / 2, -Math.sqrt(2.) / 2, 1., Math.sqrt(2.) / 2, Math.sqrt(2.) / 2, 10.]
//            Mat_ < float > rot_2x3(2, 3, data);

//            Mat_ < float > res = Mat(Mat(2 * rot_2x3) * Mat(one_3x1 + shi_3x1 + shi_3x1 + shi_3x1) - shi_2x1) + shift;
//            Mat_ < float > resS = rot_2x3 * one_3x1;

//            Mat_ < float > tmp, res2, resS2;
//            alvision.add(one_3x1, shi_3x1, tmp);
//            alvision.add(tmp, shi_3x1, tmp);
//            alvision.add(tmp, shi_3x1, tmp);
//            alvision.gemm(rot_2x3, tmp, 2, shi_2x1, -1, res2, 0);
//            alvision.add(res2, Mat(2, 1, alvision.MatrixType.CV_32F, shift), res2);

//            alvision.gemm(rot_2x3, one_3x1, 1, shi_2x1, 0, resS2, 0);
//            CHECK_DIFF(res, res2);
//            CHECK_DIFF(resS, resS2);


//            Mat_ < float > mat4x4(4, 4);
//            randu(mat4x4, Scalar(0), Scalar(10));

//            Mat_ < float > roi1 = mat4x4(Rect(Point(1, 1), Size(2, 2)));
//            Mat_ < float > roi2 = mat4x4(Range(1, 3), Range(1, 3));

//            CHECK_DIFF(roi1, roi2);
//            CHECK_DIFF(mat4x4, mat4x4(Rect(Point(0, 0), mat4x4.size())));

//            Mat_ < int > intMat10(3, 3, 10);
//            Mat_ < int > intMat11(3, 3, 11);
//            Mat_ < uchar > resMat(3, 3, 255);

//            CHECK_DIFF(resMat, intMat10 == intMat10);
//            CHECK_DIFF(resMat, intMat10 < intMat11);
//            CHECK_DIFF(resMat, intMat11 > intMat10);
//            CHECK_DIFF(resMat, intMat10 <= intMat11);
//            CHECK_DIFF(resMat, intMat11 >= intMat10);

//            CHECK_DIFF(resMat, intMat10 == 10.0);
//            CHECK_DIFF(resMat, intMat10 < 11.0);
//            CHECK_DIFF(resMat, intMat11 > 10.0);
//            CHECK_DIFF(resMat, intMat10 <= 11.0);
//            CHECK_DIFF(resMat, intMat11 >= 10.0);

//            Mat_ < uchar > maskMat4(3, 3, 4);
//            Mat_ < uchar > maskMat1(3, 3, 1);
//            Mat_ < uchar > maskMat5(3, 3, 5);
//            Mat_ < uchar > maskMat0(3, 3, (uchar)0);

//            CHECK_DIFF(maskMat0, maskMat4 & maskMat1);
//            CHECK_DIFF(maskMat0, Scalar(1) & maskMat4);
//            CHECK_DIFF(maskMat0, maskMat4 & Scalar(1));

//            Mat_ < uchar > m;
//            m = maskMat4.clone(); m &= maskMat1; CHECK_DIFF(maskMat0, m);
//            m = maskMat4.clone(); m &= Scalar(1); CHECK_DIFF(maskMat0, m);

//            m = maskMat4.clone(); m |= maskMat1; CHECK_DIFF(maskMat5, m);
//            m = maskMat4.clone(); m ^= maskMat1; CHECK_DIFF(maskMat5, m);

//            CHECK_DIFF(maskMat0, (maskMat4 | maskMat4) & (maskMat1 | maskMat1));
//            CHECK_DIFF(maskMat0, (maskMat4 | maskMat4) & maskMat1);
//            CHECK_DIFF(maskMat0, maskMat4 & (maskMat1 | maskMat1));

//            CHECK_DIFF(maskMat0, maskMat5 ^ (maskMat4 | maskMat1));
//            CHECK_DIFF(maskMat0, Scalar(5) ^ (maskMat4 | Scalar(1)));

//            CHECK_DIFF(maskMat5, maskMat5 | (maskMat4 ^ maskMat1));
//            CHECK_DIFF(maskMat5, maskMat5 | (maskMat4 ^ Scalar(1)));

//            CHECK_DIFF(~maskMat1, maskMat1 ^ 0xFF);
//            CHECK_DIFF(~(maskMat1 | maskMat1), maskMat1 ^ 0xFF);

//            CHECK_DIFF(maskMat1 + maskMat4, maskMat5);
//            CHECK_DIFF(maskMat1 + Scalar(4), maskMat5);
//            CHECK_DIFF(Scalar(4) + maskMat1, maskMat5);
//            CHECK_DIFF(Scalar(4) + (maskMat1 & maskMat1), maskMat5);

//            CHECK_DIFF(maskMat1 + 4.0, maskMat5);
//            CHECK_DIFF((maskMat1 & 0xFF) + 4.0, maskMat5);
//            CHECK_DIFF(4.0 + maskMat1, maskMat5);

//            m = maskMat4.clone(); m += Scalar(1); CHECK_DIFF(m, maskMat5);
//            m = maskMat4.clone(); m += maskMat1; CHECK_DIFF(m, maskMat5);
//            m = maskMat4.clone(); m += (maskMat1 | maskMat1); CHECK_DIFF(m, maskMat5);

//            CHECK_DIFF(maskMat5 - maskMat1, maskMat4);
//            CHECK_DIFF(maskMat5 - Scalar(1), maskMat4);
//            CHECK_DIFF((maskMat5 | maskMat5) - Scalar(1), maskMat4);
//            CHECK_DIFF(maskMat5 - 1, maskMat4);
//            CHECK_DIFF((maskMat5 | maskMat5) - 1, maskMat4);
//            CHECK_DIFF((maskMat5 | maskMat5) - (maskMat1 | maskMat1), maskMat4);

//            CHECK_DIFF(maskMat1, min(maskMat1, maskMat5));
//            CHECK_DIFF(maskMat5, max(maskMat1, maskMat5));

//            m = maskMat5.clone(); m -= Scalar(1); CHECK_DIFF(m, maskMat4);
//            m = maskMat5.clone(); m -= maskMat1; CHECK_DIFF(m, maskMat4);
//            m = maskMat5.clone(); m -= (maskMat1 | maskMat1); CHECK_DIFF(m, maskMat4);

//            m = maskMat4.clone(); m |= Scalar(1); CHECK_DIFF(maskMat5, m);
//            m = maskMat5.clone(); m ^= Scalar(1); CHECK_DIFF(maskMat4, m);

//            CHECK_DIFF(maskMat1, maskMat4 / 4.0);

//            Mat_ < float > negf(3, 3, -3.0);
//            Mat_ < float > posf = -negf;
//            Mat_ < float > posf2 = posf * 2;
//            Mat_ < int > negi(3, 3, -3);

//            CHECK_DIFF(abs(negf), -negf);
//            CHECK_DIFF(abs(posf - posf2), -negf);
//            CHECK_DIFF(abs(negi), -(negi & negi));

//            CHECK_DIFF(5.0 - maskMat4, maskMat1);


//            CHECK_DIFF(maskMat4.mul(maskMat4, 0.25), maskMat4);
//            CHECK_DIFF(maskMat4.mul(maskMat1 * 4, 0.25), maskMat4);
//            CHECK_DIFF(maskMat4.mul(maskMat4 / 4), maskMat4);


//            ////// Element-wise division

//            CHECK_DIFF(maskMat4 / maskMat4, maskMat1);
//            CHECK_DIFF(4.0 / maskMat4, maskMat1);
//            m = maskMat4.clone(); m /= 4.0; CHECK_DIFF(m, maskMat1);

//            ////////////////////////////////

//            typedef Mat_< int > TestMat_t;

//            const cnegi = negi.clone();

//            TestMat_t::iterator beg = negi.begin();
//            TestMat_t::iterator end = negi.end();

//            TestMat_t::const_iterator cbeg = cnegi.begin();
//            TestMat_t::const_iterator cend = cnegi.end();

//            var sum = 0;
//            for (; beg != end; ++beg)
//                sum +=*beg;

//            for (; cbeg != cend; ++cbeg)
//                sum -=*cbeg;

//            if (sum != 0) throw test_excep();

//            CHECK_DIFF(negi.col(1), negi.col(2));
//            CHECK_DIFF(negi.row(1), negi.row(2));
//            CHECK_DIFF(negi.col(1), negi.diag());

//            if (Mat_<Point2f>(1, 1).elemSize1() != sizeof(float)) throw test_excep();
//            if (Mat_<Point2f>(1, 1).elemSize() != 2 * sizeof(float)) throw test_excep();
//            if (Mat_<Point2f>(1, 1).depth() != alvision.MatrixType.CV_32F) throw test_excep();
//            if (Mat_<float>(1, 1).depth() != alvision.MatrixType.CV_32F) throw test_excep();
//            if (Mat_<int>(1, 1).depth() != alvision.MatrixType.CV_32S) throw test_excep();
//            if (Mat_<double>(1, 1).depth() != alvision.MatrixType.CV_64F) throw test_excep();
//            if (Mat_<Point3d>(1, 1).depth() != alvision.MatrixType. CV_64F) throw test_excep();
//            if (Mat_<signed char>(1, 1).depth() != alvision.MatrixType.CV_8S) throw test_excep();
//            if (Mat_<unsigned short>(1, 1).depth() != alvision.MatrixType. CV_16U) throw test_excep();
//            if (Mat_<unsigned short>(1, 1).channels() != 1) throw test_excep();
//            if (Mat_<Point2f>(1, 1).channels() != 2) throw test_excep();
//            if (Mat_<Point3f>(1, 1).channels() != 3) throw test_excep();
//            if (Mat_<Point3d>(1, 1).channels() != 3) throw test_excep();

//            Mat_ < uchar > eye = Mat_<uchar>::zeros(2, 2); CHECK_DIFF(Mat_<uchar>::zeros(Size(2, 2)), eye);
//            eye.at<uchar>(Point(0, 0)) = 1; eye.at<uchar>(1, 1) = 1;

//            CHECK_DIFF(Mat_<uchar>::eye(2, 2), eye);
//            CHECK_DIFF(eye, Mat_<uchar>::eye(Size(2, 2)));

//            Mat_ < uchar > ones(2, 2, (uchar)1);
//            CHECK_DIFF(ones, Mat_<uchar>::ones(Size(2, 2)));
//            CHECK_DIFF(Mat_<uchar>::ones(2, 2), ones);

//            Mat_ < Point2f > pntMat(2, 2, Point2f(1, 0));
//            if (pntMat.stepT() != 2) throw test_excep();

//            uchar uchar_data[] = { 1, 0, 0, 1};

//            Mat_ < uchar > matFromData(1, 4, uchar_data);
//            const Mat_<uchar>mat2 = matFromData.clone();
//            CHECK_DIFF(matFromData, eye.reshape(1, 1));
//            if (matFromData(Point(0, 0)) != uchar_data[0]) throw test_excep();
//            if (mat2(Point(0, 0)) != uchar_data[0]) throw test_excep();

//            if (matFromData(0, 0) != uchar_data[0]) throw test_excep();
//            if (mat2(0, 0) != uchar_data[0]) throw test_excep();

//            Mat_ < uchar > rect(eye, Rect(0, 0, 1, 1));
//            if (rect.cols != 1 || rect.rows != 1 || rect(0, 0) != uchar_data[0]) throw test_excep();

//            //alvision.Mat_<_Tp>::adjustROI(int,int,int,int)
//            //alvision.Mat_<_Tp>::cross(const Mat_&) const
//            //alvision.Mat_<_Tp>::Mat_(const Array<_Tp>&,bool)
//            //alvision.Mat_<_Tp>::Mat_(int,int,_Tp*,size_t)
//            //alvision.Mat_<_Tp>::Mat_(int,int,const _Tp&)
//            //alvision.Mat_<_Tp>::Mat_(Size,const _Tp&)
//            //alvision.Mat_<_Tp>::mul(const Mat_<_Tp>&,double) const
//            //alvision.Mat_<_Tp>::mul(const MatExpr_<MatExpr_Op2_<Mat_<_Tp>,double,Mat_<_Tp>,MatOp_DivRS_<Mat> >,Mat_<_Tp> >&,double) const
//            //alvision.Mat_<_Tp>::mul(const MatExpr_<MatExpr_Op2_<Mat_<_Tp>,double,Mat_<_Tp>,MatOp_Scale_<Mat> >,Mat_<_Tp> >&,double) const
//            //alvision.Mat_<_Tp>::operator Mat_<T2>() const
//            //alvision.Mat_<_Tp>::operator MatExpr_<Mat_<_Tp>,Mat_<_Tp> >() const
//            //alvision.Mat_<_Tp>::operator()(const Range&,const Range&) const
//            //alvision.Mat_<_Tp>::operator()(const Rect&) const

//            //alvision.Mat_<_Tp>::operator=(const MatExpr_Base&)
//            //alvision.Mat_<_Tp>::operator[](int) const


//            ///////////////////////////////

//            var matrix_data = [3, 1, -4, -5, 1, 0, 0, 1.1, 1.5]
//            Mat_ < float > mt(3, 3, matrix_data);
//            Mat_ < float > mi = mt.inv();
//            Mat_ < float > d1 = Mat_<float>::eye(3, 3);
//            Mat_ < float > d2 = d1 * 2;
//            Mat_ < float > mt_tr = mt.t();
//            Mat_ < float > mi_tr = mi.t();
//            Mat_ < float > mi2 = mi * 2;

//            CHECK_DIFF_FLT(mi2 * mt, d2);
//            CHECK_DIFF_FLT(mi * mt, d1);
//            CHECK_DIFF_FLT(mt_tr * mi_tr, d1);

//            Mat_ < float > mf;
//            mf = mi.clone(); mf *= mt; CHECK_DIFF_FLT(mf, d1);

//            ////// typedefs //////

//            if (Mat1b(1, 1).elemSize() != sizeof(uchar)) throw new test_excep();
//            if (Mat2b(1, 1).elemSize() != 2 * sizeof(uchar)) throw new test_excep();
//            if (Mat3b(1, 1).elemSize() != 3 * sizeof(uchar)) throw new test_excep();
//            if (Mat1f(1, 1).elemSize() != sizeof(float)) throw new test_excep();
//            if (Mat2f(1, 1).elemSize() != 2 * sizeof(float)) throw new test_excep();
//            if (Mat3f(1, 1).elemSize() != 3 * sizeof(float)) throw new test_excep();
//            if (Mat1f(1, 1).depth() != alvision.MatrixType.CV_32F) throw new test_excep();
//            if (Mat3f(1, 1).depth() != alvision.MatrixType.CV_32F) throw new test_excep();
//            if (Mat3f(1, 1).type() !=  alvision.MatrixType.CV_32FC3) throw new test_excep();
//            if (Mat1i(1, 1).depth() != alvision.MatrixType.CV_32S) throw new test_excep();
//            if (Mat1d(1, 1).depth() != alvision.MatrixType.CV_64F) throw new test_excep();
//            if (Mat1b(1, 1).depth() != alvision.MatrixType.CV_8U) throw   new test_excep();
//            if (Mat3b(1, 1).type() !=  alvision.MatrixType.CV_8UC3) throw new test_excep();
//            if (Mat1w(1, 1).depth() != alvision.MatrixType.CV_16U) throw  new test_excep();
//            if (Mat1s(1, 1).depth() != alvision.MatrixType.CV_16S) throw  new test_excep();
//            if (Mat1f(1, 1).channels() != 1) throw new test_excep();
//            if (Mat1b(1, 1).channels() != 1) throw new test_excep();
//            if (Mat1i(1, 1).channels() != 1) throw new test_excep();
//            if (Mat1w(1, 1).channels() != 1) throw new test_excep();
//            if (Mat1s(1, 1).channels() != 1) throw new test_excep();
//            if (Mat2f(1, 1).channels() != 2) throw new test_excep();
//            if (Mat2b(1, 1).channels() != 2) throw new test_excep();
//            if (Mat2i(1, 1).channels() != 2) throw new test_excep();
//            if (Mat2w(1, 1).channels() != 2) throw new test_excep();
//            if (Mat2s(1, 1).channels() != 2) throw new test_excep();
//            if (Mat3f(1, 1).channels() != 3) throw new test_excep();
//            if (Mat3b(1, 1).channels() != 3) throw new test_excep();
//            if (Mat3i(1, 1).channels() != 3) throw new test_excep();
//            if (Mat3w(1, 1).channels() != 3) throw new test_excep();
//            if (Mat3s(1, 1).channels() != 3) throw new test_excep();

//            Array < Mat_ < float > > mvf, mvf2;
//            Mat_ < Vec2f > mf2;
//            mvf.push(Mat_<float>::ones(4, 3));
//            mvf.push(Mat_<float>::zeros(4, 3));
//            merge(mvf, mf2);
//            split(mf2, mvf2);
//            alvision.CV_Assert(alvision.cvtest.norm(mvf2[0], mvf[0], CV_C) == 0 &&
//                alvision.cvtest.norm(mvf2[1], mvf[1], CV_C) == 0);

//            {
//                Mat a(2, 2, alvision.MatrixType.CV_32F, 1.);
//                Mat b(1, 2, alvision.MatrixType.CV_32F, 1.);
//                Mat c = (a * b.t()).t();
//                alvision.CV_Assert(alvision.cvtest.norm(c, CV_L1) == 4.);
//            }

//            var badarg_catched = false;
//            try {
//                var m1 = alvision.Mat.zeros(1, 10, alvision.MatrixType.CV_8UC1);
//                var m2 = alvision.Mat.zeros(10, 10, alvision.MatrixType.CV_8UC3);
//                m1.copyTo(m2.row(1));
//            }
//            catch (e) {
//                badarg_catched = true;
//            }
//            alvision.CV_Assert(() => badarg_catched);

//            var size = new alvision.Size(2, 5);
//            this.TestType<float>(size, 1.);
//            var val1 = new alvision.Vecf(1.)
//            this.TestType<alvision.Vec3f>(size, val1);
//            alvision.Matx31f val2 = 1.f;
//            this.TestType<alvision.Matx31f>(size, val2);
//            alvision.Matx41f val3 = 1.f;
//            this.TestType<alvision.Matx41f>(size, val3);
//            alvision.Matx32f val4 = 1.f;
//            this.TestType<alvision.Matx32f>(size, val4);
//        }
//        catch (e) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "%s\n", e.s);
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
//            return false;
//        }
//        return true;
//    }
//    TestMatND(): boolean {
//        var sizes = [3, 3, 3]
//        var nd = new alvision.MatND (3, sizes, alvision.MatrixType.CV_32F);

//        return true;
//    }
//    TestSparseMat(): boolean {
//        try {
//            var sizes = [10, 10, 10]
//            var dims = sizes.length;//sizeof(sizes) / sizeof(sizes[0]);
//            var mat = new alvision.SparseMat(dims, sizes, alvision.MatrixType.CV_32FC2);

//            if (mat.dims() != dims) throw test_excep();
//            if (mat.channels() != 2) throw test_excep();
//            if (mat.depth() != alvision.MatrixType.CV_32F) throw test_excep();

//            var mat2 = mat.clone();
//        }
//        catch (test_excet) {
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
//            return false;
//        }
//        return true;
//    }

//    TestVec(): boolean {
//        try {
//            var hsvImage_f = new alvision.Mat(5, 5, alvision.MatrixType.CV_32FC3), hsvImage_b = new alvision.Mat(5, 5, alvision.MatrixType.CV_8UC3);
//            var i = 0, j = 0;
//            var a = new alvision.Vecf();

//            //these compile
//            var b = a;
//            hsvImage_f.at<alvision.Vec3f>(i, j) = alvision.Vec3f((float)i, 0, 1);
//            hsvImage_b.at<alvision.Vec3b>(i, j) = alvision.Vec3b(alvision.Vec3f((float)i, 0, 1));

//            //these don't
//            b = alvision.Vec3f(1, 0, 0);
//            var c = new alvision.Vecb();
//            c = alvision.Vec3f(0, 0, 1);
//            hsvImage_b.at<alvision.Vec3b>(i, j) = alvision.Vec3f((float)i, 0, 1);
//            hsvImage_b.at<alvision.Vec3b>(i, j) = a;
//            hsvImage_b.at<alvision.Vec3b>(i, j) = alvision.Vec3f(1, 2, 3);
//        }
//        catch (test_excep) {
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
//            return false;
//        }
//        return true;
//    }
//    TestMatxMultiplication(): boolean {
//        try {
//            var mat = new alvision.Matxf(1, 1, 1, 0, 1, 1, 0, 0, 1); // Identity matrix
//            var pt = new alvision.Point2f(3, 4);
//            var res = mat * pt; // Correctly assumes homogeneous coordinates

//            Vec3f res2 = mat * Vec3f(res.x, res.y, res.z);

//            if (res.x != 8.0) throw test_excep();
//            if (res.y != 5.0) throw test_excep();
//            if (res.z != 1.0) throw test_excep();

//            if (res2[0] != 14.0) throw test_excep();
//            if (res2[1] != 6.0) throw test_excep();
//            if (res2[2] != 1.0) throw test_excep();

//            Matx44f mat44f(1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1);
//            Matx44d mat44d(1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1);
//            var s = new alvision.Scalar(4, 3, 2, 1);
//            Scalar sf = mat44f * s;
//            Scalar sd = mat44d * s;

//            if (sf[0] != 10.0) throw test_excep();
//            if (sf[1] != 6.0) throw test_excep();
//            if (sf[2] != 3.0) throw test_excep();
//            if (sf[3] != 1.0) throw test_excep();

//            if (sd[0] != 10.0) throw test_excep();
//            if (sd[1] != 6.0) throw test_excep();
//            if (sd[2] != 3.0) throw test_excep();
//            if (sd[3] != 1.0) throw test_excep();
//        }
//        catch (test_except) {
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
//            return false;
//        }
//        return true;
//    }
//    TestMatxElementwiseDivison(): boolean {
//        try {
//            var mat = new alvision.Matxf(2, 4, 6, 8);
//            var mat2 = new alvision.Matxf(2, 2, 2, 2);

//            Matx22f res = mat.div(mat2);

//            if (res(0, 0) != 1.0) throw test_excep();
//            if (res(0, 1) != 2.0) throw test_excep();
//            if (res(1, 0) != 3.0) throw test_excep();
//            if (res(1, 1) != 4.0) throw test_excep();
//        }
//        catch (test_except) {
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
//            return false;
//        }
//        return true;
//    }
//    TestSubMatAccess(): boolean {
//        try {
//            Mat_ < float > T_bs(4, 4);
//            Vec3f cdir(1.f, 1.f, 0.f);
//            Vec3f ydir(1.f, 0.f, 1.f);
//            Vec3f fpt(0.1f, 0.7f, 0.2f);
//            T_bs.setTo(0);
//            T_bs(Range(0, 3), Range(2, 3)) = 1.0 * Mat(cdir); // wierd OpenCV stuff, need to do multiply
//            T_bs(Range(0, 3), Range(1, 2)) = 1.0 * Mat(ydir);
//            T_bs(Range(0, 3), Range(0, 1)) = 1.0 * Mat(cdir.cross(ydir));
//            T_bs(Range(0, 3), Range(3, 4)) = 1.0 * Mat(fpt);
//            T_bs(3, 3) = 1.0;
//            //console.log("[Nav Grok] S frame =" << std::endl << T_bs << std::endl;

//            // set up display coords, really just the S frame
//            Array < float > coords;

//            for (int i= 0; i < 16; i++)
//            {
//                coords.push(T_bs(i));
//                //console.log(T_bs1(i) << std::endl;
//            }
//            alvision.CV_Assert(() => alvision.cvtest.norm(coords, T_bs.reshape(1, 1), alvision.NormTypes.NORM_INF) == 0);
//        }
//        catch (e) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "%s\n", e.s);
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
//            return false;
//        }
//        return true;
//    }
//    TestExp(): boolean {
//        Mat1f tt = Mat1f::ones(4, 2);
//        Mat1f outs;
//        exp(-tt, outs);
//        Mat1f tt2 = Mat1f::ones(4, 1), outs2;
//        exp(-tt2, outs2);
//        return true;
//    }
//    TestSVD(): boolean {
//        try {
//            Mat A = (Mat_<double>(3, 4) << 1, 2, -1, 4, 2, 4, 3, 5, -1, -2, 6, 7);
//            Mat x;
//            SVD::solveZ(A, x);
//            if (alvision.cvtest.norm(A * x, CV_C) > alvision.FLT_EPSILON)
//                throw test_excep();

//            SVD svd(A, SVD::FULL_UV);
//            if (alvision.cvtest.norm(A * svd.vt.row(3).t(), CV_C) > alvision.FLT_EPSILON)
//                throw test_excep();

//            Mat Dp(3, 3, alvision.MatrixType.CV_32FC1);
//            Mat Dc(3, 3, alvision.MatrixType.CV_32FC1);
//            Mat Q(3, 3,  alvision.MatrixType.CV_32FC1);
//            Mat U, Vt, R, T, W;

//            Dp.at<float>(0, 0) = 0.86483884f; Dp.at<float>(0, 1) = -0.3077251f; Dp.at<float>(0, 2) = -0.55711365f;
//            Dp.at<float>(1, 0) = 0.49294353f; Dp.at<float>(1, 1) = -0.24209651f; Dp.at<float>(1, 2) = -0.25084701f;
//            Dp.at<float>(2, 0) = 0; Dp.at<float>(2, 1) = 0; Dp.at<float>(2, 2) = 0;

//            Dc.at<float>(0, 0) = 0.75632739f; Dc.at<float>(0, 1) = -0.38859656f; Dc.at<float>(0, 2) = -0.36773083f;
//            Dc.at<float>(1, 0) = 0.9699229f; Dc.at<float>(1, 1) = -0.49858192f; Dc.at<float>(1, 2) = -0.47134098f;
//            Dc.at<float>(2, 0) = 0.10566688f; Dc.at<float>(2, 1) = -0.060333252f; Dc.at<float>(2, 2) = -0.045333147f;

//            Q = Dp * Dc.t();
//            SVD decomp;
//            decomp = SVD(Q);
//            U = decomp.u;
//            Vt = decomp.vt;
//            W = decomp.w;
//            Mat I = alvision.Mat.eye(3, 3, alvision.MatrixType.CV_32F);

//            if (alvision.cvtest.norm(U * U.t(), I, CV_C) > alvision.FLT_EPSILON ||
//                alvision.cvtest.norm(Vt * Vt.t(), I, CV_C) > alvision.FLT_EPSILON ||
//                W.at<float>(2) < 0 || W.at<float>(1) < W.at<float>(2) ||
//                W.at<float>(0) < W.at<float>(1) ||
//                alvision.cvtest.norm(U * Mat::diag(W) * Vt, Q, CV_C) > alvision.FLT_EPSILON)
//                throw test_excep();
//        }
//        catch (test_except) {
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
//            return false;
//        }
//        return true;
//    }
//    operations1(): boolean {
//        try {
//            Point3d p1(1, 1, 1), p2(2, 2, 2), p4(4, 4, 4);
//            p1 *= 2;
//            if (!(p1 == p2)) throw test_excep();
//            if (!(p2 * 2 == p4)) throw test_excep();
//            if (!(p2 * 2.f == p4)) throw test_excep();
//            if (!(p2 * 2.f == p4)) throw test_excep();

//            Point2d pi1(1, 1), pi2(2, 2), pi4(4, 4);
//            pi1 *= 2;
//            if (!(pi1 == pi2)) throw test_excep();
//            if (!(pi2 * 2 == pi4)) throw test_excep();
//            if (!(pi2 * 2.f == pi4)) throw test_excep();
//            if (!(pi2 * 2.f == pi4)) throw test_excep();

//            Vec2d v12(1, 1), v22(2, 2);
//            v12 *= 2.0;
//            if (!(v12 == v22)) throw test_excep();

//            Vec3d v13(1, 1, 1), v23(2, 2, 2);
//            v13 *= 2.0;
//            if (!(v13 == v23)) throw test_excep();

//            Vec4d v14(1, 1, 1, 1), v24(2, 2, 2, 2);
//            v14 *= 2.0;
//            if (!(v14 == v24)) throw test_excep();

//            Size sz(10, 20);
//            if (sz.area() != 200) throw test_excep();
//            if (sz.width != 10 || sz.height != 20) throw test_excep();
//            if (((alvision.Size)sz).width != 10 || ((alvision.Size)sz).height != 20) throw test_excep();

//            Vec < double, 5 > v5d(1, 1, 1, 1, 1);
//            Vec < double, 6 > v6d(1, 1, 1, 1, 1, 1);
//            Vec < double, 7 > v7d(1, 1, 1, 1, 1, 1, 1);
//            Vec < double, 8 > v8d(1, 1, 1, 1, 1, 1, 1, 1);
//            Vec < double, 9 > v9d(1, 1, 1, 1, 1, 1, 1, 1, 1);
//            Vec < double, 10 > v10d(1, 1, 1, 1, 1, 1, 1, 1, 1, 1);

//            Vec < double, 10 > v10dzero;
//            for (int ii = 0; ii < 10; ++ii) {
//                if (v10dzero[ii] != 0.0)
//                    throw test_excep();
//            }

//            Mat A(1, 32, alvision.MatrixType.CV_32F), B;
//            for (let i = 0; i < A.cols; i++ )
//            A.at<float>(i) = (float)(i <= 12 ? i : 24 - i);
//            transpose(A, B);

//            int minidx[2] = { 0, 0}, maxidx[2] = { 0, 0};
//            double minval = 0, maxval = 0;
//            minMaxIdx(A, &minval, &maxval, minidx, maxidx);

//            if (!(minidx[0] == 0 && minidx[1] == 31 && maxidx[0] == 0 && maxidx[1] == 12 &&
//                minval == -7 && maxval == 12))
//                throw test_excep();

//            minMaxIdx(B, &minval, &maxval, minidx, maxidx);

//            if (!(minidx[0] == 31 && minidx[1] == 0 && maxidx[0] == 12 && maxidx[1] == 0 &&
//                minval == -7 && maxval == 12))
//                throw test_excep();

//            Matx33f b(1.f, 2.f, 3.f, 4.f, 5.f, 6.f, 7.f, 8.f, 9.f);
//            Mat c;
//            add(alvision.Mat.zeros(3, 3, alvision.MatrixType.CV_32F), b, c);
//            alvision.CV_Assert(()=>alvision.cvtest.norm(b, c, CV_C) == 0);

//            add(alvision.Mat.zeros(3, 3, alvision.MatrixType.CV_64F), b, c, null, c.type());
//            alvision.CV_Assert(()=>alvision.cvtest.norm(b, c, CV_C) == 0);

//            add(alvision.Mat.zeros(6, 1, alvision.MatrixType.CV_64F), 1, c, null, c.type());
//            alvision.CV_Assert(()=>alvision.cvtest.norm(Matx61f(1.f, 1.f, 1.f, 1.f, 1.f, 1.f), c, CV_C) == 0);

//            Array < Point2f > pt2d(3);
//            Array < Point3d > pt3d(2);

//            alvision.CV_Assert(()=>Mat(pt2d).checkVector(2) == 3 && Mat(pt2d).checkVector(3) < 0 &&
//                Mat(pt3d).checkVector(2) < 0 && Mat(pt3d).checkVector(3) == 2);

//            Matx44f m44(0.8147, 0.6324, 0.9575, 0.9572,
//                0.9058, 0.0975, 0.9649, 0.4854,
//                0.1270, 0.2785, 0.1576, 0.8003,
//                0.9134, 0.5469, 0.9706, 0.1419);
//            double d = determinant(m44);
//            alvision.CV_Assert(()=>Math.abs(d - (-0.0262)) <= 0.001);

//            Cv32suf z;
//            z.i = 0x80000000;
//            alvision.CV_Assert(()=>Math.floor(z.f) == 0 && Math.ceil(z.f) == 0 && Math.round(z.f) == 0);
//        }
//        catch (test_except) {
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
//            return false;
//        }
//        return true;
//    }

//    checkDiff(m1: alvision.Mat, m2: alvision.Mat, s : string) : void
//    {
//        if (alvision.cvtest.norm(m1, m2,alvision.NormTypes. NORM_INF) != 0) throw new test_excep(s);
//    }
//    checkDiffF(m1: alvision.Mat, m2: alvision.Mat ,s : string) : void
//    {
//        if (alvision.cvtest.norm(m1, m2,alvision.NormTypes. NORM_INF) > 1e-5) throw new test_excep(s);
//    }
//};


////#define STR(a) STR2(a)
////#define STR2(a) #a
////
////
////#if defined _MSC_VER && _MSC_VER < 1400
////#define MSVC_OLD 1
////#else
////#define MSVC_OLD 0
////#endif



//alvision.cvtest.TEST('Core_Array', 'expressions', () => { CV_OperationsTest test; test.safe_run(); });

//class CV_SparseMatTest  extends alvision.cvtest.BaseTest
//{
//    run(iii: alvision.int) : void
//    {
//        try
//        {
//            var rng = alvision.theRNG();
//            const MAX_DIM=3;
//            int sizes[MAX_DIM], idx[MAX_DIM];
//            for( var iter = 0; iter < 100; iter++ )
//            {
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, ".");
//                this.ts.update_context(this, iter, true);
//                //int k, 
//                var dims = rng.uniform(1, MAX_DIM + 1), p = 1;
//                for(var k = 0; k < dims; k++ )
//                {
//                    sizes[k] = rng.uniform(1, 30);
//                    p *= sizes[k];
//                }
//                int j, nz = rng.uniform(0, (p+2)/2), nz0 = 0;
//                SparseMat_<int> v(dims,sizes);

//                CV_Assert( (int)v.nzcount() == 0 );

//                SparseMatIterator_<int> it = v.begin();
//                SparseMatIterator_<int> it_end = v.end();

//                for(var k = 0; it != it_end; ++it, ++k )
//                    ;
//                alvision.CV_Assert(()=> k == 0 );

//                var sum0 = 0, sum = 0;
//                for(var j = 0; j < nz; j++ )
//                {
//                    var val = rng.uniform(1, 100);
//                    for(var k = 0; k < dims; k++ )
//                        idx[k] = rng.uniform(0, sizes[k]);
//                    if( dims == 1 )
//                    {
//                        alvision.CV_Assert(()=> v.ref(idx[0]) == v(idx[0]) );
//                    }
//                    else if( dims == 2 )
//                    {
//                        alvision.CV_Assert(()=> v.ref(idx[0], idx[1]) == v(idx[0], idx[1]) );
//                    }
//                    else if( dims == 3 )
//                    {
//                        alvision.CV_Assert(()=> v.ref(idx[0], idx[1], idx[2]) == v(idx[0], idx[1], idx[2]) );
//                    }
//                    alvision.CV_Assert(()=> v.ref(idx) == v(idx) );
//                    v.ref(idx) += val;
//                    if( v(idx) == val )
//                        nz0++;
//                    sum0 += val;
//                }

//                alvision.CV_Assert(()=> (int)v.nzcount() == nz0 );

//                it = v.begin();
//                it_end = v.end();

//                for(var k = 0; it != it_end; ++it, ++k )
//                    sum += *it;
//                alvision.CV_Assert(()=> k == nz0 && sum == sum0 );

//                v.clear();
//                alvision.CV_Assert(()=> (int)v.nzcount() == 0 );

//                it = v.begin();
//                it_end = v.end();

//                for(var k = 0; it != it_end; ++it, ++k )
//                    ;
//                alvision.CV_Assert(()=> k == 0 );
//            }
//        }
//        catch(e)
//        {
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
//        }
//    }
//};

//alvision.cvtest.TEST('Core_SparseMat', 'iterations', () => { var test = new CV_SparseMatTest(); test.safe_run(); });
