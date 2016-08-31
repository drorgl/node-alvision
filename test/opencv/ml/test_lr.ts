//TODO: implement!

/////////////////////////////////////////////////////////////////////////////////////////
//// IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.

////  By downloading, copying, installing or using the software you agree to this license.
////  If you do not agree to this license, do not download, install,
////  copy or use the software.

//// This is a implementation of the Logistic Regression algorithm in C++ in OpenCV.

//// AUTHOR:
//// Rahul Kavi rahulkavi[at]live[at]com
////

//// contains a subset of data from the popular Iris Dataset (taken from "http://archive.ics.uci.edu/ml/datasets/Iris")

//// # You are free to use, change, or redistribute the code in any way you wish for
//// # non-commercial purposes, but please maintain the name of the original author.
//// # This code comes with no warranty of any kind.

//// #
//// # You are free to use, change, or redistribute the code in any way you wish for
//// # non-commercial purposes, but please maintain the name of the original author.
//// # This code comes with no warranty of any kind.

//// # Logistic Regression ALGORITHM


////                           License Agreement
////                For Open Source Computer Vision Library

//// Copyright (C) 2000-2008, Intel Corporation, all rights reserved.
//// Copyright (C) 2008-2011, Willow Garage Inc., all rights reserved.
//// Third party copyrights are property of their respective owners.

//// Redistribution and use in source and binary forms, with or without modification,
//// are permitted provided that the following conditions are met:

////   * Redistributions of source code must retain the above copyright notice,
////     this list of conditions and the following disclaimer.

////   * Redistributions in binary form must reproduce the above copyright notice,
////     this list of conditions and the following disclaimer in the documentation
////     and/or other materials provided with the distribution.

////   * The name of the copyright holders may not be used to endorse or promote products
////     derived from this software without specific prior written permission.

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

//import tape = require("tape");
//import path = require("path");
//import colors = require("colors");
//import async = require("async");
//import alvision = require("../../../tsbinding/alvision");
//import util = require('util');
//import fs = require('fs');


////#include "test_precomp.hpp"
////
////using namespace std;
////using namespace cv;
////using namespace alvision.ml;

//function calculateError(_p_labels: alvision.Mat, _o_labels: alvision.Mat, error: alvision.float): boolean {
//    error = 0.0;
//    var accuracy = 0.0;
//    var _p_labels_temp = new alvision.Mat();
//    var _o_labels_temp = new alvision.Mat();
//    _p_labels.convertTo(_p_labels_temp,alvision.MatrixType. CV_32S);
//    _o_labels.convertTo(_o_labels_temp,alvision.MatrixType. CV_32S);

//    alvision.CV_Assert(() => _p_labels_temp.total() == _o_labels_temp.total());
//    alvision.CV_Assert(() => _p_labels_temp.rows == _o_labels_temp.rows);

//    accuracy = (alvision.countNonZero(alvision.Mat.from(alvision.MatExpr.op_Equals( _p_labels_temp , _o_labels_temp))).valueOf() / _p_labels_temp.rows.valueOf());
//    error = 1 - accuracy;
//    return true;
//}

////--------------------------------------------------------------------------------------------

//class CV_LRTest  extends alvision.cvtest.BaseTest
//{
//    run(start_from: alvision.int): void {
//        // initialize varibles from the popular Iris Dataset
//        var dataFileName = this.ts.get_data_path() + "iris.data";
//        var tdata = alvision.ml.TrainData.loadFromCSV(dataFileName, 0);

//        // run LR classifier train classifier
//        var p = alvision.LogisticRegression.create();
//        p.setLearningRate(1.0);
//        p.setIterations(10001);
//        p.setRegularization(LogisticRegression::REG_L2);
//        p.setTrainMethod(LogisticRegression::BATCH);
//        p.setMiniBatchSize(10);
//        p.train(tdata);

//        // predict using the same data
//        var responses = new alvision.Mat();
//        p.predict(tdata.getSamples(), responses);

//        // calculate error
//        var test_code = alvision.cvtest.FailureCode.OK;
//        var error = 0.0;
//        if (!calculateError(responses, tdata.getResponses(), error)) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Bad prediction labels\n");
//            test_code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
//        }
//        else if (error > 0.05)
//        {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Bad accuracy of (%f)\n", error);
//            test_code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//        }

//        {
//            var s = new alvision.FileStorage("debug.xml", alvision.FileStorageMode.WRITE);
            
//            s.write("original", tdata.getResponses());
//            s.write("predicted1", responses);
//            s.write("learnt", p.get_learnt_thetas());
//            s.write("error", error);
//            s.release();
//        }
//        this.ts.set_failed_test_info(test_code);
//    }
//};


////--------------------------------------------------------------------------------------------
//class CV_LRTest_SaveLoad  extends alvision.cvtest.BaseTest
//{
//    run(start_from: alvision.int): void {
//        var code = alvision.cvtest.FailureCode.OK;

//        // initialize varibles from the popular Iris Dataset
//        var dataFileName = this.ts.get_data_path() + "iris.data";
//        var tdata = alvision.ml.TrainData.loadFromCSV(dataFileName, 0);

//        Mat responses1, responses2;
//        Mat learnt_mat1, learnt_mat2;

//        // train and save the classifier
//        var filename = alvision.tempfile(".xml");
//        try {
//            // run LR classifier train classifier
//            var lr1 = alvision.ml.LogisticRegression.create();
//            lr1.setLearningRate(1.0);
//            lr1.setIterations(10001);
//            lr1.setRegularization(LogisticRegression::REG_L2);
//            lr1.setTrainMethod(LogisticRegression::BATCH);
//            lr1.setMiniBatchSize(10);
//            lr1.train(tdata);
//            lr1.predict(tdata.getSamples(), responses1);
//            learnt_mat1 = lr1.get_learnt_thetas();
//            lr1.save(filename);
//        }
//        catch (e) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Crash in write method.\n");
//            this.ts.set_failed_test_info(alvision.cvtest.alvision.cvtest.FailureCode.FAIL_EXCEPTION);
//        }

//        // and load to another
//        try {
//            var lr2 = Algorithm::load<LogisticRegression>(filename);
//            lr2.predict(tdata.getSamples(), responses2);
//            learnt_mat2 = lr2.get_learnt_thetas();
//        }
//        catch (e) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Crash in write method.\n");
//            this.ts.set_failed_test_info(alvision.cvtest.alvision.cvtest.FailureCode.FAIL_EXCEPTION);
//        }

//        alvision.CV_Assert(()=>responses1.rows == responses2.rows);

//        // compare difference in learnt matrices before and after loading from disk
//        Mat comp_learnt_mats;
//        comp_learnt_mats = (learnt_mat1 == learnt_mat2);
//        comp_learnt_mats = comp_learnt_mats.reshape(1, comp_learnt_mats.rows * comp_learnt_mats.cols);
//        comp_learnt_mats.convertTo(comp_learnt_mats, CV_32S);
//        comp_learnt_mats = comp_learnt_mats / 255;

//        // compare difference in prediction outputs and stored inputs
//        // check if there is any difference between computed learnt mat and retreived mat

//        var errorCount = 0.0;
//        errorCount += 1 - countNonZero(responses1 == responses2) / responses1.rows;
//        errorCount += 1 - sum(comp_learnt_mats)[0] / comp_learnt_mats.rows;

//        if (errorCount > 0) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Different prediction results before writing and after reading (errorCount=%d).\n", errorCount);
//            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//        }

//        remove(filename);

//        this.ts.set_failed_test_info(code);
//    }
//};


//alvision.cvtest.TEST('ML_LR', 'accuracy', () => { CV_LRTest test; test.safe_run(); });
//alvision.cvtest.TEST('ML_LR', 'save_load', () => { CV_LRTest_SaveLoad test; test.safe_run(); });
