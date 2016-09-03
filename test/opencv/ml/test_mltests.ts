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

import {MLERROR, CV_BIG_INT, CV_NBAYES, CV_KNEAREST, CV_SVM, CV_EM, CV_ANN, CV_DTREE, CV_BOOST, CV_RTREES, CV_ERTREES  } from "./test_precomp";


//#include "test_precomp.hpp"
//
//using namespace cv;
//using namespace std;

import {CV_MLBaseTest} from "./test_mltests2";


class CV_AMLTest extends CV_MLBaseTest
{
    constructor(_modelName: string) {
        super(_modelName);
        this.validationFN = "avalidation.xml";
    }

    run_test_case(testCaseIdx: alvision.int): alvision.int {
        let code: alvision.cvtest.FailureCode | alvision.int= alvision.cvtest.FailureCode.OK;
        code = this.prepare_test_case(testCaseIdx);

        if (code == alvision.cvtest.FailureCode.OK) {
            //#define GET_STAT
            //#ifdef GET_STAT
            //const data_name = ((CvFileNode *)cvGetSeqElem(this.dataSetNames, testCaseIdx)).data.str.ptr;
            const data_name = this.dataSetNames[testCaseIdx.valueOf()];
            console.log(util.format("%s, %s      ", name, data_name));
            const icount = 100;
            let res = new Array(icount);
            for (let k = 0; k < icount; k++)
            {
                //#endif
                this.data.shuffleTrainTest();
                code = this.train(testCaseIdx);
                //#ifdef GET_STAT

                //TODO: get_error (?!)
                //let case_result = this.get_error();

                //res[k] = case_result;
            }
            let  mean = 0, sigma = 0;
            for (let k = 0; k < icount; k++)
            {
                mean += res[k];
            }
            mean = mean / icount;
            for (let  k = 0; k < icount; k++)
            {
                sigma += (res[k] - mean) * (res[k] - mean);
            }
            sigma = Math.sqrt(sigma / icount);
            console.log(util.format("%f, %f\n", mean, sigma));
            //#endif
        }
        return code;
    }

    validate_test_results(testCaseIdx: alvision.int): alvision.int {
        //int iters;
        //float mean, sigma;
        // read validation params
        let resultNode =
            this.validationFS.getFirstTopLevelNode().nodes["validation"].nodes[this.modelName].nodes[this.dataSetNames[testCaseIdx.valueOf()]].nodes["result"];
        let iters = resultNode.nodes["iter_count"].readInt();
        if (iters > 0) {
            let mean = resultNode.nodes["mean"].float();
            let sigma = resultNode.nodes["sigma"].float();
            this.model.save(util.format("/Users/vp/tmp/dtree/testcase_%02d.cur.yml", testCaseIdx));
            let curErr = this.get_test_error(testCaseIdx);
            const coeff = 4;
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Test case = %d; test error = %f; mean error = %f (diff=%f), %d*sigma = %f\n",
                testCaseIdx, curErr, mean, Math.abs(curErr.valueOf() - mean.valueOf()), coeff, coeff * sigma.valueOf());
            if (Math.abs(curErr.valueOf() - mean.valueOf()) > coeff * sigma.valueOf()) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "abs(%f - %f) > %f - OUT OF RANGE!\n", curErr, mean, coeff * sigma.valueOf(), coeff);
                return alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
            }
            else
                this.ts.printf(alvision.cvtest.TSConstants.LOG, ".\n");

        }
        else {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "validation info is not suitable");
            return alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
        }
        return alvision.cvtest.FailureCode.OK;
    }
};


alvision.cvtest.TEST('ML_DTree', 'regression', () => { let test = new CV_AMLTest(CV_DTREE); test.safe_run(); });
alvision.cvtest.TEST('ML_Boost', 'regression', () => { let test = new CV_AMLTest (CV_BOOST); test.safe_run(); });
alvision.cvtest.TEST('ML_RTrees', 'regression', () => { let test = new CV_AMLTest(CV_RTREES); test.safe_run(); });
alvision.cvtest.TEST('DISABLED_ML_ERTrees', 'regression', () => { let test = new CV_AMLTest(CV_ERTREES); test.safe_run(); });

/* End of file. */
