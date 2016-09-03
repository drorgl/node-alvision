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
// Copyright (C) 2013, OpenCV Foundation, all rights reserved.
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
// In no event shall the OpenCV Foundation or contributors be liable for any direct,
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
//#include <iostream>

alvision.cvtest.TEST('Core_LPSolver', 'regression_basic', () => {
    var A: alvision.Mat, B: alvision.Mat, z: alvision.Mat, etalon_z: alvision.Mat ;

    //#if 1
    //cormen's example #1
    A= new alvision.Matd(3, 1, [ 3, 1, 2]);
    B = new alvision.Matd(3, 4,[ 1, 1, 3, 30, 2, 2, 5, 24, 4, 1, 2, 36]);
    console.log("here A goes\n" + A);
    alvision.solveLP(A, B, z);
    console.log("here z goes\n" + z);
    etalon_z = new alvision.Matd(3, 1, [8, 4, 0]);
    alvision.ASSERT_LT(alvision.cvtest.norm(z, etalon_z, alvision.NormTypes.NORM_L1), 1e-12);
    //#endif

    //#if 1
    //cormen's example #2
    A=  new alvision.Matd(1, 2,[ 18, 12.5]);
    B = new alvision.Matd(3, 3,[ 1, 1, 20, 1, 0, 20, 0, 1, 16]);
    console.log("here A goes\n" + A);
    alvision.solveLP(A, B, z);
    console.log("here z goes\n" + z);
    etalon_z = new alvision.Matd(2, 1,[ 20, 0]);
    alvision.ASSERT_LT(alvision.cvtest.norm(z, etalon_z, alvision.NormTypes.NORM_L1), 1e-12);
    //#endif

    //#if 1
    //cormen's example #3
    A=  new alvision.Matd(1, 2,[ 5, -3]);
    B = new alvision.Matd(2, 3,[ 1, -1, 1, 2, 1, 2]);
    console.log("here A goes\n" + A);
    alvision.solveLP(A, B, z);
    console.log("here z goes\n" + z);
    etalon_z = new alvision.Matd(2, 1,[ 1, 0]);
    alvision.ASSERT_LT(alvision.cvtest.norm(z, etalon_z, alvision.NormTypes.NORM_L1), 1e-12);
    //#endif
});

alvision.cvtest.TEST('Core_LPSolver', 'regression_init_unfeasible', () => {
    var A: alvision.Mat, B: alvision.Mat, z: alvision.Mat, etalon_z: alvision.Mat;

    //#if 1
    //cormen's example #4 - unfeasible
    A = new alvision.Matd(1, 3,[ -1, -1, -1]);
    B = new alvision.Matd(2, 4,[ -2, -7.5, -3, -10000, -20, -5, -10, -30000]);
    console.log("here A goes\n" + A);
    alvision.solveLP(A, B, z);
    console.log("here z goes\n" + z);
    etalon_z = new alvision.Matd(3, 1,[ 1250, 1000, 0]);
    alvision.ASSERT_LT(alvision.cvtest.norm(z, etalon_z, alvision.NormTypes.NORM_L1), 1e-12);
    //#endif
});

alvision.cvtest.TEST('DISABLED_Core_LPSolver', 'regression_absolutely_unfeasible', () => {
    var A: alvision.Mat, B: alvision.Mat, z: alvision.Mat, etalon_z: alvision.Mat ;

    //#if 1
    //trivial absolutely unfeasible example
    A = new alvision.Matd(1, 1,[ 1]);
    B = new alvision.Matd(2, 2,[ 1, -1]);
    console.log("here A goes\n" + A);
    var res= alvision.solveLP(A, B, z);
    alvision.ASSERT_EQ(res, -1);
    //#endif
});

alvision.cvtest.TEST('Core_LPSolver', 'regression_multiple_solutions', () => {
    var A: alvision.Mat, B: alvision.Mat, z: alvision.Mat, etalon_z: alvision.Mat ;

    //#if 1
    //trivial example with multiple solutions
    A = new alvision.Matd(2, 1,[ 1, 1]);
    B = new alvision.Matd(1, 3,[ 1, 1, 1]);
    console.log("here A goes\n" + A);
    var res= alvision.solveLP(A, B, z);
    console.log(util.format("res=%d\n", res));
    console.log(util.format("scalar %g\n", z.dot(A)));
    console.log("here z goes\n" + z);
    alvision.ASSERT_EQ(res, 1);
    alvision.ASSERT_LT(Math.abs(z.dot(A).valueOf() - 1), alvision.DBL_EPSILON);
    //#endif
});

alvision.cvtest.TEST('Core_LPSolver', 'regression_cycling', () => {
    var A: alvision.Mat, B: alvision.Mat, z: alvision.Mat, etalon_z: alvision.Mat;

    //#if 1
    //example with cycling from http://people.orie.cornell.edu/miketodd/or630/SimplexCyclingExample.pdf
    A = new alvision.Matd(4, 1,[ 10, -57, -9, -24]);
    B = new alvision.Matd(3, 5,[ 0.5, -5.5, -2.5, 9, 0, 0.5, -1.5, -0.5, 1, 0, 1, 0, 0, 0, 1]);
    console.log("here A goes\n" + A);
    var res= alvision.solveLP(A, B, z);
    console.log(util.format("res=%d\n", res));
    console.log(util.format("scalar %g\n", z.dot(A)));
    console.log("here z goes\n" + z);
    alvision.ASSERT_LT(Math.abs(z.dot(A).valueOf() - 1), alvision.DBL_EPSILON);
    //ASSERT_EQ(res,1);
    //#endif
});
