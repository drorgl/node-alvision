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

import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');

//#include "test_precomp.hpp"
//
//using namespace cv;
//using namespace std;

class Core_RotatedRectConstructorTest extends alvision.cvtest.BaseTest
{
    constructor() {
        super();
        this.test_case_count = 100;
        this.MAX_COORD_VAL = 1000.0;
    }

    prepare_test_case(test_case_idx : alvision.int): alvision.int{
        super.prepare_test_case(test_case_idx);
        var rng = this.ts.get_rng();
        this.a = new alvision.Point2f(rng.uniform(-this.MAX_COORD_VAL, this.MAX_COORD_VAL), rng.uniform(-this.MAX_COORD_VAL, this.MAX_COORD_VAL));
        do {
            this.b = new alvision.Point2f(rng.uniform(-this.MAX_COORD_VAL, this.MAX_COORD_VAL), rng.uniform(-this.MAX_COORD_VAL, this.MAX_COORD_VAL));
        }
        while (alvision.norm(this.a.op_Substraction(this.b)) <= alvision.FLT_EPSILON);

        var pointab = this.a.op_Substraction(this.b);
        var along = new alvision.Vecf(pointab.x, pointab.y);

        var perp = new alvision.Vecf(-along[1], along[0]);
        var d =  rng.uniform(1.0, 5.0);
        if (alvision.cvtest.randInt(rng).valueOf() % 2 == 0 ) d = -d;
        this.c = new alvision.Point2f((this.b.x.valueOf() + d.valueOf() * perp.at(0).get().valueOf()), (this.b.y.valueOf() + d.valueOf() * perp.at(1).get().valueOf()));
        return 1;
}

    run_func(): void {
        this.rec = new alvision.RotatedRect(this.a, this.b, this.c);
}

    validate_test_results(int): alvision.int{
        var vertices = new Array<alvision.Point2f>();
        this.rec.points(vertices);
        var count_match = 0;
        for (var i = 0; i < 4; i++ )
        {
            if (alvision.norm(vertices[i].op_Substraction( this.a)) <= 0.001) count_match++;
            else if (alvision.norm(vertices[i] .op_Substraction( this.b)) <= 0.001) count_match++;
            else if (alvision.norm(vertices[i] .op_Substraction( this.c)) <= 0.001) count_match++;
        }
        if (count_match == 3)
            return alvision.cvtest.FailureCode.OK;
        this.ts.printf(alvision.cvtest.TSConstants.LOG, "RotatedRect end points don't match those supplied in constructor");
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
        return alvision.cvtest.FailureCode.OK;
    }



    protected MAX_COORD_VAL: alvision.float;
    protected a: alvision.Point2f;
    protected b: alvision.Point2f;
    protected c: alvision.Point2f;
    protected rec: alvision.RotatedRect;
};

alvision.cvtest.TEST('Core_RotatedRect', 'three_point_constructor', () => { var test = new Core_RotatedRectConstructorTest(); test.safe_run(); });
