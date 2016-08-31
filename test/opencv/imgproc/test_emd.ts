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
//
//using namespace cv;
//using namespace std;

/*////////////////////// emd_test /////////////////////////*/

class CV_EMDTest extends alvision.cvtest.BaseTest
{

    run(iii : alvision.int): void {
        var code = alvision.cvtest.FailureCode.OK;
        var success_error_level = 1e-6;
        const M = 10000;
        var emd0 = 2460. / 210;
    var cost =
    [
        16, 16, 13, 22, 17,
        14, 14, 13, 19, 15,
        19, 19, 20, 23,  M,
        M, 0,  M, 0,  0
    ];
    var w1 = [50, 60, 50, 50];
    var w2 = [ 30, 20, 70, 30, 60 ];
    var _w1= new alvision.Mat(4, 1, alvision.MatrixType.CV_32F, w1);
    var _w2 = new alvision.Mat(5, 1,alvision.MatrixType. CV_32F, w2);
    var _cost = new alvision.Mat(_w1.rows(), _w2.rows(), alvision.MatrixType.CV_32F, cost);

    var emd = alvision.EMD(_w1, _w2, -1, _cost);
    if(Math.abs( emd.valueOf() - emd0) > success_error_level * emd0) {
        this.ts.printf(alvision.cvtest.TSConstants.LOG,
            "The computed distance is %.2f, while it should be %.2f\n", emd, emd0);
        code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
    }

    if(code < 0 )
    this.ts.set_failed_test_info(code);
    }
}



alvision.cvtest.TEST('Imgproc_EMD', 'regression', () => { var test = new CV_EMDTest(); test.safe_run(); });

/* End of file. */
