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

class Core_ConcatenationTest  extends alvision.cvtest.BaseTest
{
    constructor(horizontal_: boolean, firstEmpty_: boolean, secondEmpty_: boolean) {
        super();
        this.horizontal = (horizontal_);
        this.firstEmpty = (firstEmpty_);
        this.secondEmpty = (secondEmpty_);

        this.test_case_count = 1;
        
            this.mat0x5 =  alvision.Mat.from(alvision.Mat.ones(0, 5,  alvision.MatrixType.CV_8U));
            this.mat10x5 = alvision.Mat.from(alvision.Mat.ones(10, 5, alvision.MatrixType.CV_8U));
            this.mat20x5 = alvision.Mat.from(alvision.Mat.ones(20, 5, alvision.MatrixType.CV_8U));

            this.mat5x0 =  alvision.Mat.from(alvision.Mat.ones(5, 0, alvision.MatrixType.CV_8U) );
            this.mat5x10 = alvision.Mat.from(alvision.Mat.ones(5, 10, alvision.MatrixType.CV_8U));
            this.mat5x20 = alvision.Mat.from(alvision.Mat.ones(5, 20, alvision.MatrixType.CV_8U));
    }

    prepare_test_case(test_case_idx: alvision.int): alvision.int {
        super.prepare_test_case(test_case_idx);
        return 1;
    }
    run_func(): void {
        if (this.horizontal) {
            alvision.hconcat((this.firstEmpty ? this.mat5x0 : this.mat5x10),
                (this.secondEmpty ? this.mat5x0 : this.mat5x10),
                this.result);
        } else {
            alvision.vconcat((this.firstEmpty ? this.mat0x5 : this.mat10x5),
                (this.secondEmpty ? this.mat0x5 : this.mat10x5),
                this.result);
        }
    }
    validate_test_results(test_case_idx: alvision.int): alvision.int {
        var expected = new alvision.Mat();

        if (this.firstEmpty && this.secondEmpty)
            expected = (this.horizontal ? this.mat5x0 : this.mat0x5);
        else if ((this.firstEmpty && !this.secondEmpty) || (!this.firstEmpty && this.secondEmpty))
            expected = (this.horizontal ? this.mat5x10 : this.mat10x5);
        else
            expected = (this.horizontal ? this.mat5x20 : this.mat20x5);

        if (this.areEqual(expected, this.result)) {
            return alvision.cvtest.FailureCode.OK;
        } else {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Concatenation failed");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
        }

        return alvision.cvtest.FailureCode.OK;
    }

    protected  mat0x5  : alvision.Mat;
    protected  mat10x5 : alvision.Mat;
    protected  mat20x5 : alvision.Mat;

    protected  mat5x0  : alvision.Mat;
    protected  mat5x10 : alvision.Mat;
    protected  mat5x20 : alvision.Mat;

    protected result = new alvision.Mat();

    protected  horizontal  : boolean;
    protected  firstEmpty  : boolean;
    protected  secondEmpty : boolean;

    private areEqual(m1 : alvision.Mat, m2 : alvision.Mat): boolean {
        return m1.size() == m2.size()
            && m1.type() == m2.type()
            && alvision.countNonZero(alvision.MatExpr.op_NotEquals( m1 , m2)) == 0;
    }

};


alvision.cvtest.TEST('Core_Concatenation', 'hconcat_empty_nonempty', () => { var test = new Core_ConcatenationTest(true, true, false); test.safe_run(); });
alvision.cvtest.TEST('Core_Concatenation', 'hconcat_nonempty_empty', () => { var test = new Core_ConcatenationTest(true, false, true); test.safe_run(); });
alvision.cvtest.TEST('Core_Concatenation', 'hconcat_empty_empty', () => { var test = new Core_ConcatenationTest(true, true, true); test.safe_run(); });

alvision.cvtest.TEST('Core_Concatenation', 'vconcat_empty_nonempty', () => { var test = new Core_ConcatenationTest(false, true, false); test.safe_run(); });
alvision.cvtest.TEST('Core_Concatenation', 'vconcat_nonempty_empty', () => { var test = new Core_ConcatenationTest(false, false, true); test.safe_run(); });
alvision.cvtest.TEST('Core_Concatenation', 'vconcat_empty_empty', () => { var test = new Core_ConcatenationTest(false, true, true); test.safe_run(); });
