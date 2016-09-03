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

import {MLERROR,CV_BIG_INT, CV_NBAYES, CV_KNEAREST, CV_SVM, CV_EM, CV_ANN, CV_DTREE, CV_BOOST, CV_RTREES, CV_ERTREES  } from "./test_precomp";

//#include "test_precomp.hpp"
//
//using namespace cv;
//using namespace std;

export function str_to_svm_type(str : string) : alvision.int
{
    if(str == "C_SVC") 
        return alvision.ml.SVMTypes.C_SVC;
    if(str == "NU_SVC")
        return alvision.ml.SVMTypes.NU_SVC;
    if(str == "ONE_CLASS")
        return alvision.ml.SVMTypes.ONE_CLASS;
    if(str == "EPS_SVR") 
        return alvision.ml.SVMTypes.EPS_SVR;
    if(str == "NU_SVR") 
        return alvision.ml.SVMTypes.NU_SVR;
    alvision.CV_Error(alvision.cv.Error.Code.StsBadArg, "incorrect svm type string" );
    return -1;
}
export function str_to_svm_kernel_type(str: string): alvision.int {
    if (str == "LINEAR")
        return alvision.ml.SVMKernelTypes.LINEAR;
    if (str == "POLY")
        return alvision.ml.SVMKernelTypes.POLY;
    if (str == "RBF")
        return alvision.ml.SVMKernelTypes.RBF;
    if (str == "SIGMOID")
        return alvision.ml.SVMKernelTypes.SIGMOID;
    alvision.CV_Error(alvision.cv.Error.Code.StsBadArg, "incorrect svm type string");
    return -1;
}

// 4. em
// 5. ann
export function str_to_ann_train_method(str : string ) : alvision.int
{
    if (str == "BACKPROP")
        return alvision.ml.TrainingMethods.BACKPROP;
    if(str == "RPROP")
        return alvision.ml.TrainingMethods.RPROP;
    alvision.CV_Error(alvision.cv.Error.Code.StsBadArg, "incorrect ann train method string" );
    return -1;
}

function ann_check_data(_data: alvision.ml.TrainData) : void
{
    var values = _data.getSamples();
    var var_idx = _data.getVarIdx();
    var nvars = var_idx.total();
    if( nvars != 0 && nvars != values.cols() )
        alvision.CV_Error(alvision.cv.Error.Code.StsBadArg, "var_idx is not supported" );
    if( !_data.getMissing().empty() )
        alvision.CV_Error(alvision.cv.Error.Code.StsBadArg, "missing values are not supported" );
}

// unroll the categorical responses to binary vectors
export function ann_get_new_responses(_data: alvision.ml.TrainData, cls_map: alvision.Dictionary<number,number>): alvision.Mat
{
    var train_sidx = _data.getTrainSampleIdx();
    var train_sidx_ptr = train_sidx.ptr<alvision.int>("int");
    var responses = _data.getResponses();
    var cls_count = 0;
    // construct cls_map
    cls_map.clear();
    var nresponses = responses.total();
    let  n = !train_sidx.empty() ? train_sidx.total() : nresponses;

    for(let si = 0; si < n; si++ )
    {
        let sidx = train_sidx_ptr ? train_sidx_ptr[si] : si;
        let r = Math.round(responses.at<alvision.float>("float",sidx).get().valueOf());
        //alvision.CV_DbgAssert(() => Math.abs(responses.at<alvision.float>("float", sidx).get().valueOf() - r) < alvision.FLT_EPSILON );
        //map<int,int>::iterator it = cls_map.find(r);
        if (cls_map[r] == null)
            cls_map[r] = cls_count++;
    }
    var new_responses = alvision.Mat.zeros( nresponses, cls_count, alvision.MatrixType.CV_32F ).toMat();
    for(var si = 0; si < n; si++ )
    {
        var sidx = train_sidx_ptr ? train_sidx_ptr[si] : si;
        var r = Math.round(responses.at<alvision.float>("float",sidx).get().valueOf());
        let cidx = cls_map[r];
        new_responses.at<alvision.float>("float", sidx, cidx).set(1.);
    }
    return new_responses;
}

export function ann_calc_error(ann: alvision.ml.StatModel, _data: alvision.ml.TrainData, cls_map: alvision.Dictionary<alvision.int,alvision.int>, type: alvision.int, resp_labels: Array<alvision.float> ) : alvision.float
{
    var err = 0;
    var samples = _data.getSamples();
    var responses = _data.getResponses();
    var sample_idx = (type == MLERROR.CV_TEST_ERROR) ? _data.getTestSampleIdx() : _data.getTrainSampleIdx();
    let sidx = !sample_idx.empty() ? sample_idx.ptr<alvision.int>("int") : null;
    ann_check_data( _data );
    let sample_count = sample_idx.total();
    sample_count = (type == MLERROR.CV_TRAIN_ERROR && sample_count == 0) ? samples.rows() : sample_count;
    //float* pred_resp = 0;
    let pred_resp : Array<alvision.float>;
    let innresp = new Array<alvision.float>();
    if( sample_count > 0 )
    {
        if( resp_labels )
        {
            resp_labels.length = ( sample_count ).valueOf();
            pred_resp = resp_labels;
        }
        else
        {
            innresp.length = ( sample_count ).valueOf();
            pred_resp = innresp;
        }
    }
    let cls_count = cls_map.count();// .size();
    let output = new alvision.Mat( 1, cls_count, alvision.MatrixType.CV_32FC1 );

    for( let i = 0; i < sample_count; i++ )
    {
        var si = sidx ? sidx[i] : i;
        var sample = samples.row(si);
        ann.predict( sample, output );
        var best_cls = new alvision.Point();
        alvision.minMaxLoc(output, (minVal_, maxVal_, minLoc_, maxLoc_) => { best_cls = minLoc_[0]; });
        var r = Math.round(responses.at<alvision.float>("float",si).get().valueOf());
        alvision.CV_DbgAssert(()=> Math.abs(responses.at<alvision.float>("float",si).get().valueOf() - r) < alvision.FLT_EPSILON );
        r = cls_map[r];
        var d = best_cls.x == r ? 0 : 1;
        err += d;
        pred_resp[i] = best_cls.x;
    }
    err = sample_count ? err / sample_count.valueOf() * 100 : -alvision.FLT_MAX;
    return err;
}

// 6. dtree
// 7. boost
export function str_to_boost_type(str : string): alvision.int 
{
    if (str == ("DISCRETE"))
        return alvision.ml.BoostTypes.DISCRETE;
    if (str == ("REAL") )
        return alvision.ml.BoostTypes.REAL;
    if (str == ("LOGIT") )
        return alvision.ml.BoostTypes.LOGIT;
    if (str == ("GENTLE") )
        return alvision.ml.BoostTypes.GENTLE;

    alvision.CV_Error(alvision.cv.Error.Code.StsBadArg, "incorrect boost type string");
    return -1;
}

// 8. rtrees
// 9. ertrees


export class CV_MLBaseTest extends alvision.cvtest.BaseTest {
    constructor(_modelName: string) {
        super();
        let seeds = [
            CV_BIG_INT(0x00009fff4f9c8d52),
            CV_BIG_INT(0x0000a17166072c7c),
            CV_BIG_INT(0x0201b32115cd1f9a),
            CV_BIG_INT(0x0513cb37abcd1234),
            CV_BIG_INT(0x0001a2b3c4d5f678)
        ];

        let seedCount = seeds.length;
        var rng = alvision.theRNG();

        this.initSeed = rng.state;
        rng.state = seeds[rng.unsigned(seedCount).valueOf()];

        this.modelName = _modelName;
    }
    read_params(fs: alvision.FileStorage): alvision.int {
        let _fs = new alvision.FileStorage(fs, false);
        if (!_fs.isOpened())
            this.test_case_count = -1;
        else {
            let fn = _fs.getFirstTopLevelNode().nodes["run_params"].nodes[this.modelName];
            this.test_case_count = fn.size();
            if (this.test_case_count <= 0)
                this.test_case_count = -1;
            if (this.test_case_count > 0) {
                this.dataSetNames.length = (this.test_case_count).valueOf();
                //FileNodeIterator it = fn.begin();
                for (let i = 0; i < this.test_case_count; i++)// , ++it )
                {
                    this.dataSetNames[i] = fn.data[i].String();////(string) * it;
                }
            }
        }
        return alvision.cvtest.FailureCode.OK;;
    }

    run(startFrom: alvision.int): void {
        let filename = this.ts.get_data_path();
        filename += this.get_validation_filename();
        this.validationFS.open(filename, alvision.FileStorageMode.READ);
        this.read_params(this.validationFS);

        let code: alvision.cvtest.FailureCode | alvision.int = alvision.cvtest.FailureCode.OK;
        for (let i = 0; i < this.test_case_count; i++) {
            let temp_code = this.run_test_case(i);
            if (temp_code == alvision.cvtest.FailureCode.OK)
                temp_code = this.validate_test_results(i);
            if (temp_code != alvision.cvtest.FailureCode.OK)
                code = temp_code;
        }
        if (this.test_case_count <= 0) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "validation file is not determined or not correct");
            code = alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
        }
        this.ts.set_failed_test_info(code);
    }

    prepare_test_case(test_case_idx: alvision.int): alvision.int {
        this.clear();

        let dataPath = this.ts.get_data_path();
        if (!dataPath) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "data path is empty");
            return alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
        }

        let dataName = this.dataSetNames[test_case_idx.valueOf()],
            filename = dataPath + dataName + ".data";

        let dataParamsNode = this.validationFS.getFirstTopLevelNode().nodes["validation"].nodes[this.modelName].nodes[dataName].nodes["data_params"];
        alvision.CV_DbgAssert(() => !dataParamsNode.empty());

        alvision.CV_DbgAssert(() => !dataParamsNode["LS"].empty());
        let trainSampleCount = dataParamsNode["LS"];

        alvision.CV_DbgAssert(() => !dataParamsNode["resp_idx"].empty());
        let respIdx = dataParamsNode["resp_idx"];

        alvision.CV_DbgAssert(() => !dataParamsNode["types"].empty());
        let varTypes = dataParamsNode["types"];

        this.data = alvision.ml.TrainData.loadFromCSV(filename, 0, respIdx, respIdx + 1, varTypes);
        if (!this.data) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "file %s can not be read\n", filename);
            return alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
        }

        this.data.setTrainTestSplit(trainSampleCount);
        return alvision.cvtest.FailureCode.OK;

    }

    get_validation_filename(): string {
        return this.validationFN;
    }
    run_test_case(testCaseIdx: alvision.int): alvision.int {
        throw new Error("not implemented");
    }
    validate_test_results(testCaseIdx: alvision.int): alvision.int {
        throw new Error("not implemented");
    }

    train(testCaseIdx: alvision.int): alvision.int {
        let is_trained = false;
        let modelParamsNode =
            this.validationFS.getFirstTopLevelNode().nodes["validation"].nodes[this.modelName].nodes[this.dataSetNames[testCaseIdx.valueOf()]].nodes["model_params"];

        if (this.modelName == CV_NBAYES)
            this.model = alvision.ml.NormalBayesClassifier.create();
        else if (this.modelName == CV_KNEAREST) {
            this.model = alvision.ml.KNearest.create();
        }
        else if (this.modelName == CV_SVM) {
            //String svm_type_str, kernel_type_str;
            let svm_type_str = modelParamsNode.nodes["svm_type"].String();// >> svm_type_str;
            let kernel_type_str = modelParamsNode.nodes["kernel_type"].String();// >> kernel_type_str;
            let m = alvision.ml.SVM.create();
            m.setType(str_to_svm_type(svm_type_str));
            m.setKernel(str_to_svm_kernel_type(kernel_type_str));
            m.setDegree(modelParamsNode["degree"]);
            m.setGamma(modelParamsNode["gamma"]);
            m.setCoef0(modelParamsNode["coef0"]);
            m.setC(modelParamsNode["C"]);
            m.setNu(modelParamsNode["nu"]);
            m.setP(modelParamsNode["p"]);
            this.model = m;
        }
        else if (this.modelName == CV_EM) {
            alvision.assert(() => false);//0);
        }
        else if (this.modelName == CV_ANN) {
            //String train_method_str;
            //double param1, param2;
            let train_method_str = modelParamsNode.nodes["train_method"].String();// >> train_method_str;
            let param1 = modelParamsNode.nodes["param1"].double();// >> param1;
            let param2 = modelParamsNode.nodes["param2"].double();// >> param2;
            let new_responses = ann_get_new_responses(this.data, this.cls_map);
            // binarize the responses
            this.data = alvision.ml.TrainData.create(this.data.getSamples(), this.data.getLayout(), new_responses,
                this.data.getVarIdx(), this.data.getTrainSampleIdx());
            let layer_sz = [this.data.getNAllVars(), 100, 100, this.cls_map.count()];
            let layer_sizes = new alvision.Mat(1, layer_sz.length, alvision.MatrixType.CV_32S, layer_sz);
            let m = alvision.ml.ANN_MLP.create();
            m.setLayerSizes(layer_sizes);
            m.setActivationFunction(alvision.ml.ANN_MLP_ActivationFunctions.SIGMOID_SYM, 0, 0);
            m.setTermCriteria(new alvision.TermCriteria(alvision.TermCriteriaType.COUNT, 300, 0.01));
            m.setTrainMethod(str_to_ann_train_method(train_method_str), param1, param2);
            this.model = m;

        }
        else if (this.modelName == CV_DTREE) {
            //int MAX_DEPTH, MIN_SAMPLE_COUNT, MAX_CATEGORIES, CV_FOLDS;
            let REG_ACCURACY = 0;
            let USE_SURROGATE = false
            //, IS_PRUNED;
            let MAX_DEPTH = modelParamsNode.nodes["max_depth"].int();// >> MAX_DEPTH;
            let MIN_SAMPLE_COUNT = modelParamsNode.nodes["min_sample_count"].int();// >> MIN_SAMPLE_COUNT;
            //modelParamsNode["use_surrogate"] >> USE_SURROGATE;
            let MAX_CATEGORIES = modelParamsNode.nodes["max_categories"].int();// >> MAX_CATEGORIES;
            let CV_FOLDS = modelParamsNode.nodes["cv_folds"].int();// >> CV_FOLDS;
            let IS_PRUNED = (modelParamsNode.nodes["is_pruned"].int() > 0);// >> IS_PRUNED;

            let m = alvision.ml.DTrees.create();
            m.setMaxDepth(MAX_DEPTH);
            m.setMinSampleCount(MIN_SAMPLE_COUNT);
            m.setRegressionAccuracy(REG_ACCURACY);
            m.setUseSurrogates(USE_SURROGATE);
            m.setMaxCategories(MAX_CATEGORIES);
            m.setCVFolds(CV_FOLDS);
            m.setUse1SERule(false);
            m.setTruncatePrunedTree(IS_PRUNED);
            m.setPriors(new alvision.Mat());
            this.model = m;
        }
        else if (this.modelName == CV_BOOST) {
            //int BOOST_TYPE, WEAK_COUNT, MAX_DEPTH;
            //float WEIGHT_TRIM_RATE;
            let USE_SURROGATE = false;
            //String typeStr;
            let typeStr = modelParamsNode.nodes["type"].String();// >> typeStr;
            let BOOST_TYPE = str_to_boost_type(typeStr);
            let WEAK_COUNT = modelParamsNode.nodes["weak_count"].int();// >> WEAK_COUNT;
            let WEIGHT_TRIM_RATE = modelParamsNode.nodes["weight_trim_rate"].int();// >> WEIGHT_TRIM_RATE;
            let MAX_DEPTH = modelParamsNode.nodes["max_depth"].int();// >> MAX_DEPTH;
            //modelParamsNode["use_surrogate"] >> USE_SURROGATE;

            let m = alvision.ml.Boost.create();
            m.setBoostType(BOOST_TYPE);
            m.setWeakCount(WEAK_COUNT);
            m.setWeightTrimRate(WEIGHT_TRIM_RATE);
            m.setMaxDepth(MAX_DEPTH);
            m.setUseSurrogates(USE_SURROGATE);
            m.setPriors(new alvision.Mat());
            this.model = m;
        }
        else if (this.modelName == CV_RTREES) {
            //int MAX_DEPTH, MIN_SAMPLE_COUNT, MAX_CATEGORIES, CV_FOLDS, NACTIVE_VARS, MAX_TREES_NUM;
            let REG_ACCURACY = 0, OOB_EPS = 0.0;
            let USE_SURROGATE = false;
            //, IS_PRUNED;
            let MAX_DEPTH = modelParamsNode.nodes["max_depth"].int();// >> MAX_DEPTH;
            let MIN_SAMPLE_COUNT = modelParamsNode.nodes["min_sample_count"].int();// >> MIN_SAMPLE_COUNT;
            //modelParamsNode["use_surrogate"] >> USE_SURROGATE;
            let MAX_CATEGORIES = modelParamsNode.nodes["max_categories"].int();// >> MAX_CATEGORIES;
            let CV_FOLDS = modelParamsNode.nodes["cv_folds"].int();// >> CV_FOLDS;
            let IS_PRUNED = (modelParamsNode.nodes["is_pruned"].int() > 0);//>> IS_PRUNED;
            let NACTIVE_VARS = modelParamsNode.nodes["nactive_vars"].int();// >> NACTIVE_VARS;
            let MAX_TREES_NUM = modelParamsNode.nodes["max_trees_num"].int();// >> MAX_TREES_NUM;

            let m = alvision.ml.RTrees.create();
            m.setMaxDepth(MAX_DEPTH);
            m.setMinSampleCount(MIN_SAMPLE_COUNT);
            m.setRegressionAccuracy(REG_ACCURACY);
            m.setUseSurrogates(USE_SURROGATE);
            m.setMaxCategories(MAX_CATEGORIES);
            m.setPriors(new alvision.Mat());
            m.setCalculateVarImportance(true);
            m.setActiveVarCount(NACTIVE_VARS);
            m.setTermCriteria(new alvision.TermCriteria(alvision.TermCriteriaType.COUNT, MAX_TREES_NUM, OOB_EPS));
            this.model = m;
        }

        if (!this.model)
            is_trained = this.model.train(this.data, 0);

        if (!is_trained) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "in test case %d model training was failed", testCaseIdx);
            return alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
        }
        return alvision.cvtest.FailureCode.OK;
    }

    get_test_error(testCaseIdx: alvision.int, resp: Array<alvision.float> = null): alvision.float {
        let type = MLERROR.CV_TEST_ERROR;
        let err = 0;
        let _resp = new alvision.Mat();
        if (this.modelName == CV_EM)
            alvision.assert(() => false);
        else if (this.modelName == CV_ANN)
            err = ann_calc_error(this.model, this.data, this.cls_map, type, resp).valueOf();
        else if (this.modelName == CV_DTREE || this.modelName == CV_BOOST || this.modelName == CV_RTREES ||
            this.modelName == CV_SVM || this.modelName == CV_NBAYES || this.modelName == CV_KNEAREST)
            err = this.model.calcError(this.data, true, _resp).valueOf();
        if (!_resp.empty() && resp)
            _resp.convertTo(resp, alvision.MatrixType.CV_32F);
        return err;
    }

    save(filename: string): void {
        this.model.save(filename);

    }
    load(filename: string): void {
        if (this.modelName == CV_NBAYES)
            this.model = alvision.Algorithm.load<alvision.ml.NormalBayesClassifier>("NormalBayesClassifier", filename);
        else if (this.modelName == CV_KNEAREST)
            this.model = alvision.Algorithm.load<alvision.ml.KNearest>("KNearest", filename);
        else if (this.modelName == CV_SVM)
            this.model = alvision.Algorithm.load<alvision.ml.SVM>("SVM", filename);
        else if (this.modelName == CV_ANN)
            this.model = alvision.Algorithm.load<alvision.ml.ANN_MLP>("ANN_MLP", filename);
        else if (this.modelName == CV_DTREE)
            this.model = alvision.Algorithm.load<alvision.ml.DTrees>("DTrees", filename);
        else if (this.modelName == CV_BOOST)
            this.model = alvision.Algorithm.load<alvision.ml.Boost>("Boost", filename);
        else if (this.modelName == CV_RTREES)
            this.model = alvision.Algorithm.load<alvision.ml.RTrees>("RTrees", filename);
        else
            alvision.CV_Error(alvision.cv.Error.Code.StsNotImplemented, "invalid stat model name");
    }

    protected data: alvision.ml.TrainData;
    protected modelName: string;
    protected validationFN: string
    protected dataSetNames: Array<string>;
    protected validationFS: alvision.FileStorage;

    protected model: alvision.ml.StatModel;

    protected cls_map: alvision.Dictionary<number, number>;// { [id: number]: number };

    protected initSeed: alvision.int64;
};

// ---------------------------------- MLBaseTest ---------------------------------------------------


//CV_MLBaseTest::~CV_MLBaseTest()
//{
//    if( validationFS.isOpened() )
//        validationFS.release();
//    theRNG().state = initSeed;
//}


/* End of file. */
