
import tape = require("tape");
import path = require("path");
import colors = require("colors");
import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');


//#include "test_precomp.hpp"
//
////#if 0
////
////#include <string>
////#include <fstream>
////#include <iostream>
////
////using namespace std;
//function CV_BIG_INT(x: number): number {
//    return x;
//}
//
//
//class CV_GBTreesTest  extends alvision.cvtest.BaseTest
//{
//    constructor() {
//        super();
//        var seeds = [
//            CV_BIG_INT(0x00009fff4f9c8d52),
//            CV_BIG_INT(0x0000a17166072c7c),
//            CV_BIG_INT(0x0201b32115cd1f9a),
//            CV_BIG_INT(0x0513cb37abcd1234),
//            CV_BIG_INT(0x0001a2b3c4d5f678)
//        ];
//
//        var seedCount = seeds.length;// sizeof(seeds) / sizeof(seeds[0]);
//        var rng = alvision.theRNG();
//        this.initSeed = rng.state;
//        rng.state = seeds[rng.uniform(0, seedCount).valueOf()];
//
//        this.datasets = new Array<string>();
//        this.data = 0;
//        this.gtb = 0;
//    }
//    
//    run(iii: alvision.int): void {
//        var dataPath = this.ts.get_data_path();
//        this.datasets = new Array<string>(2);
//        this.datasets[0] = dataPath + ("spambase.data"); /*string("dataset_classification.csv");*/
//        this.datasets[1] = dataPath + ("housing_.data");  /*string("dataset_regression.csv");*/
//
//        var code = alvision.cvtest.FailureCode.OK;
//
//        for (var i = 0; i < 4; i++)
//        {
//
//            var temp_code = this.TestTrainPredict(i);
//            if (temp_code != alvision.cvtest.FailureCode.OK) {
//                code = temp_code;
//                break;
//            }
//
//            else if (i == 0) {
//                temp_code = this.TestSaveLoad();
//                if (temp_code != alvision.cvtest.FailureCode.OK)
//                    code = temp_code;
//                delete data;
//                data = 0;
//            }
//
//            delete gtb;
//            gtb = 0;
//        }
//        delete data;
//        data = 0;
//
//        this.ts.set_failed_test_info(code);
//    }
//
//    TestTrainPredict(test_num: alvision.int): alvision.int {
//        var code = alvision.cvtest.FailureCode.OK;
//
//        var weak_count = 200;
//        var shrinkage = 0.1;
//        var subsample_portion = 0.5;
//        var max_depth = 5;
//        var use_surrogates = false;
//        var loss_function_type = 0;
//        switch (test_num) {
//            case (1): loss_function_type = alvision.ml.GBTrees.SQUARED_LOSS; break;
//            case (2): loss_function_type = alvision.ml.GBTrees.ABSOLUTE_LOSS; break;
//            case (3): loss_function_type = alvision.ml.GBTrees.HUBER_LOSS; break;
//            case (0): loss_function_type = alvision.ml.GBTrees.DEVIANCE_LOSS; break;
//            default:
//                {
//                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "Bad test_num value in CV_GBTreesTest::TestTrainPredict(..) function.");
//                    return alvision.cvtest.FailureCode.FAIL_BAD_ARG_CHECK;
//                }
//        }
//
//        var dataset_num = test_num == 0 ? 0 : 1;
//        if (!data) {
//            data = new CvMLData();
//            data.set_delimiter(',');
//
//            if (data.read_csv(datasets[dataset_num])) {
//                ts.printf(alvision.cvtest.TSConstants.LOG, "File reading error.");
//                return alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
//            }
//
//            if (test_num == 0) {
//                data.set_response_idx(57);
//                data.set_var_types("ord[0-56],cat[57]");
//            }
//            else {
//                data.set_response_idx(13);
//                data.set_var_types("ord[0-2,4-13],cat[3]");
//                subsample_portion = 0.7f;
//            }
//
//            var train_sample_count = Math.floor(_get_len(data.get_responses()) * 0.5);
//            CvTrainTestSplit spl(train_sample_count);
//            data.set_train_test_split( &spl);
//        }
//
//        data.mix_train_and_test_idx();
//
//
//        if (gtb) delete gtb;
//        gtb = new CvGBTrees();
//        bool tmp_code = true;
//        tmp_code = gtb.train(data, CvGBTreesParams(loss_function_type, weak_count,
//            shrinkage, subsample_portion,
//            max_depth, use_surrogates));
//
//        if (!tmp_code) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Model training was failed.");
//            return alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
//        }
//
//        code = checkPredictError(test_num);
//
//        return code;
//    }
//    TestSaveLoad(): alvision.int {
//        if (!this.gtb)
//            return alvision.cvtest.TS::FAIL_GENERIC;
//
//        this.model_file_name1 = alvision.tempfile();
//        this.model_file_name2 = alvision.tempfile();
//
//        this.gtb.save(model_file_name1);
//        this.gtb.calc_error(data, CV_TEST_ERROR, &test_resps1);
//        this.gtb.load(model_file_name1);
//        this.gtb.calc_error(data, CV_TEST_ERROR, &test_resps2);
//        this.gtb.save(model_file_name2);
//
//        return this.checkLoadSave();
//    }
//
//    checkPredictError(test_num: alvision.int): alvision.int {
//        if (!thi.sgtb)
//            return alvision.cvtest.TS::FAIL_GENERIC;
//
//        //float mean[] = {5.430247f, 13.5654f, 12.6569f, 13.1661f};
//        //float sigma[] = {0.4162694f, 3.21161f, 3.43297f, 3.00624f};
//        var mean = [ 5.80226, 12.68689, 13.49095, 13.19628];
//        var sigma = [ 0.4764534, 3.166919, 3.022405, 2.868722];
//
//        var current_error = this.gtb.calc_error(data, CV_TEST_ERROR);
//
//        if (Math.abs(current_error - mean[test_num]) > 6 * sigma[test_num]) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Test error is out of range:\n"
//                    "abs(%f/*curEr*/ - %f/*mean*/ > %f/*6*sigma*/",
//                current_error, mean[test_num], 6 * sigma[test_num]);
//            return alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//        }
//
//        return alvision.cvtest.FailureCode.OK;
//    }
//    checkLoadSave(): alvision.int {
//        var code = alvision.cvtest.FailureCode.OK;
//
//        // 1. compare files
//        ifstream f1(model_file_name1), f2(model_file_name2);
//        string s1, s2;
//        int lineIdx = 0;
//        CV_Assert(f1.is_open() && f2.is_open());
//        for (; !f1.eof() && !f2.eof(); lineIdx++) {
//            getline(f1, s1);
//            getline(f2, s2);
//            if (s1.compare(s2)) {
//                ts.printf(alvision.cvtest.TSConstants.LOG, "first and second saved files differ in %n-line; first %n line: %s; second %n-line: %s",
//                    lineIdx, lineIdx, s1, lineIdx, s2);
//                code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
//            }
//        }
//        if (!f1.eof() || !f2.eof()) {
//            ts.printf(alvision.cvtest.TSConstants.LOG, "First and second saved files differ in %n-line; first %n line: %s; second %n-line: %s",
//                lineIdx, lineIdx, s1, lineIdx, s2);
//            code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
//        }
//        f1.close();
//        f2.close();
//        // delete temporary files
//        remove(model_file_name1);
//        remove(model_file_name2);
//
//        // 2. compare responses
//        CV_Assert(test_resps1.size() == test_resps2.size());
//        Array<float>::const_iterator it1 = test_resps1.begin(), it2 = test_resps2.begin();
//        for (; it1 != test_resps1.end(); ++it1, ++it2) {
//            if (fabs(*it1 - *it2) > FLT_EPSILON) {
//                ts.printf(alvision.cvtest.TSConstants.LOG, "Responses predicted before saving and after loading are different");
//                code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
//            }
//        }
//        return code;
//    }
//
//    protected model_file_name1: string;
//    protected model_file_name2: string;
//
//    //string* datasets;
//    protected datasets: Array<string>;
//    protected data_path: string;
//
//    //CvMLData* data;
//    //CvGBTrees* gtb;
//
//    protected test_resps1 : Array<alvision.float> ;
//    protected test_resps2 : Array<alvision.float> ;
//
//    protected initSeed: alvision.int64;
//};
//
//
//function _get_len(mat : alvision.Mat) :alvision.int
//{
//    return (mat.cols > mat.rows) ? mat.cols : mat.rows;
//}
//
////CV_GBTreesTest::~CV_GBTreesTest()
////{
////    //if (data)
////    //    delete data;
////    //delete[] datasets;
////    //alvision.theRNG().state = initSeed;
////}
//
///////////////////////////////////////////////////////////////////////////////
////////////////////// test registration  /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//
//alvision.cvtest.TEST('ML_GBTrees', 'regression', () => { var test = new CV_GBTreesTest(); test.safe_run(); });
//
////#endif
