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

//#include "test_precomp.hpp"
//
//using namespace cv;


class Caller {

    public table_number: alvision.int;
    public key_size: alvision.int;
    public multi_probe_level: alvision.int;
    public features: alvision.Mat;
    

    //    void operator()() const
    public run(): void {
        var indexParams = new alvision.flann.LshIndexParams(this.table_number, this.key_size, this.multi_probe_level);
        var lsh = new alvision.flann.Index(this.features, indexParams);
        //flann::Index lsh(features, indexParams);
    }
}

class CV_LshTableBadArgTest extends alvision.cvtest.BadArgTest {
    //protected:
    
    
    run_func(): void {
    }
    


    run(start_from: alvision.int): void {
        var rng = this.ts.get_rng();

        //Caller caller;
        var caller = new Caller();

        var featuresSize = alvision.cvtest.randomSize(rng, 10.0);


        caller.features = alvision.cvtest.randomMat(rng, featuresSize, alvision.MatrixType.CV_8UC1, 0, 255, false);
        caller.table_number = 12;
        caller.multi_probe_level = 2;

        var errors = 0;
        caller.key_size = 0;
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "key_size is zero", caller.run).valueOf();

        caller.key_size = 0;// static_cast<int>(sizeof(size_t) * CHAR_BIT);
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "key_size is too big", caller.run).valueOf();

        caller.key_size = caller.key_size.valueOf() + alvision.cvtest.randInt(rng).valueOf() % 100;
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "key_size is too big", caller.run).valueOf();

        if (errors != 0)
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
        else
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }

}

alvision.cvtest.TEST('Flann_LshTable', 'badarg',()=> { var test = new CV_LshTableBadArgTest(); test.safe_run(); });
