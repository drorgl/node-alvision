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
//using alvision.ml::SVM;
//using alvision.ml::TrainData;

//--------------------------------------------------------------------------------------------
class CV_SVMTrainAutoTest extends alvision.cvtest.BaseTest {
    run(start_from: alvision.int  ): void {
        var datasize = 100;
        var samples = alvision.Mat.from(alvision.Mat.zeros(datasize, 2, alvision.MatrixType.CV_32FC1));
        var responses = alvision.Mat.from(alvision.Mat.zeros(datasize, 1, alvision.MatrixType.CV_32S));

        var rng = new alvision.RNG(0);
        for (var i = 0; i < datasize; ++i)
        {
            var response = rng.uniform(0, 2);  // Random from {0, 1}.
            samples.at<float>(i, 0) = rng.uniform(0.f, 0.5f) + response * 0.5f;
            samples.at<float>(i, 1) = rng.uniform(0.f, 0.5f) + response * 0.5f;
            responses.at<int>(i, 0) = response;
        }

        var data = alvision.ml.TrainData.create(samples,alvision.ml.SampleTypes.ROW_SAMPLE, responses);

        //alvision.Ptr < TrainData > data = TrainData::create(samples, alvision.ml::ROW_SAMPLE, responses);
        var svm = alvision.ml.SVM.create();
        svm.trainAuto(data, 10);  // 2-fold cross validation.

        var test_data0 = [ 0.25, 0.25];
        var test_point0 = new alvision.Mat(1, 2,alvision.MatrixType.CV_32FC1, test_data0);
        var result0 = svm.predict(test_point0);
        var test_data1 = [ 0.75, 0.75];
        var test_point1 = new alvision.Mat(1, 2,alvision.MatrixType.CV_32FC1, test_data1);
        var result1 = svm.predict(test_point1);

        if (Math.abs(result0.valueOf() - 0) > 0.001 || Math.abs(result1.valueOf() - 1) > 0.001) {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
        }
    }
};


alvision.cvtest.TEST('ML_SVM', 'trainauto', () => { var test = new CV_SVMTrainAutoTest(); test.safe_run(); });
