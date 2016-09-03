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
//#include <iostream>
//#include <fstream>
//
//using namespace cv;
//using namespace std;

import {str_to_boost_type,str_to_svm_type, str_to_svm_kernel_type, ann_get_new_responses, str_to_ann_train_method, ann_calc_error} from "./test_mltests2";


import {MLERROR, CV_BIG_INT, CV_NBAYES, CV_KNEAREST, CV_SVM, CV_EM, CV_ANN, CV_DTREE, CV_BOOST, CV_RTREES, CV_ERTREES  } from "./test_precomp";





class CV_MLBaseTest extends alvision.cvtest.BaseTest {
    constructor(_modelName: string) {
        super();
        let seeds = [
            CV_BIG_INT(0x00009fff4f9c8d52),
            CV_BIG_INT(0x0000a17166072c7c),
            CV_BIG_INT(0x0201b32115cd1f9a),
            CV_BIG_INT(0x0513cb37abcd1234),
            CV_BIG_INT(0x0001a2b3c4d5f678)
        ];

        let seedCount = seeds.length;//sizeof(seeds) / sizeof(seeds[0]);
        let rng = alvision.theRNG();

        this.initSeed = rng.state;
        rng.state = seeds[rng.uniform(0, seedCount).valueOf()];

        this.modelName = _modelName;
    }
    clear(): void {
        if (this.validationFS.isOpened())
            this.validationFS.release();
        alvision.theRNG().state = this.initSeed;
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
                for (let i = 0; i < this.test_case_count; i++) {
                    this.dataSetNames[i] = fn[i];// (string) * it;
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

        let code = alvision.cvtest.FailureCode.OK;
        for (let i = 0; i < this.test_case_count; i++) {
            let temp_code = this.run_test_case(i);
            if (temp_code == alvision.cvtest.FailureCode.OK)
                temp_code = this.validate_test_results(i);
            if (temp_code != alvision.cvtest.FailureCode.OK)
                code = <alvision.cvtest.FailureCode>temp_code;
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
        if (dataPath == null || dataPath == "") {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "data path is empty");
            return alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
        }

        let dataName = this.dataSetNames[test_case_idx.valueOf()],
            filename = dataPath + dataName + ".data";

        let dataParamsNode = this.validationFS.getFirstTopLevelNode().nodes["validation"].nodes[this.modelName].nodes[dataName].nodes["data_params"];
        alvision.CV_DbgAssert(()=>!dataParamsNode.empty());

        alvision.CV_DbgAssert(()=>!dataParamsNode["LS"].empty());
        let trainSampleCount = dataParamsNode["LS"];

        alvision.CV_DbgAssert(()=>!dataParamsNode["resp_idx"].empty());
        let respIdx = dataParamsNode["resp_idx"].int();

        alvision.CV_DbgAssert(()=>!dataParamsNode["types"].empty());
        let varTypes = dataParamsNode["types"].string();

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
                //let svm_type_str: string, kernel_type_str: string;
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
        else if(this.modelName == CV_DTREE) {
            //int MAX_DEPTH, MIN_SAMPLE_COUNT, MAX_CATEGORIES, CV_FOLDS;
            let REG_ACCURACY = 0;
            let USE_SURROGATE = false;
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
    else if(this.modelName == CV_BOOST) {
            //int BOOST_TYPE, WEAK_COUNT, MAX_DEPTH;
            //float WEIGHT_TRIM_RATE;
            let USE_SURROGATE = false;
            //String typeStr;
            let typeStr = modelParamsNode.nodes["type"].String();// >> typeStr;
            let BOOST_TYPE = str_to_boost_type(typeStr);
            let WEAK_COUNT = modelParamsNode.nodes["weak_count"].int();// >> WEAK_COUNT;
            let WEIGHT_TRIM_RATE = modelParamsNode.nodes["weight_trim_rate"].float();// >> WEIGHT_TRIM_RATE;
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
    else if(this.modelName == CV_RTREES) {
            //int MAX_DEPTH, MIN_SAMPLE_COUNT, MAX_CATEGORIES, CV_FOLDS, NACTIVE_VARS, MAX_TREES_NUM;
            let REG_ACCURACY = 0;
                let OOB_EPS = 0.0;
            let USE_SURROGATE = false;//, IS_PRUNED;
                let MAX_DEPTH = modelParamsNode.nodes["max_depth"].int();// >> MAX_DEPTH;
                let MIN_SAMPLE_COUNT = modelParamsNode.nodes["min_sample_count"].int();// >> MIN_SAMPLE_COUNT;
            //modelParamsNode["use_surrogate"] >> USE_SURROGATE;
                let MAX_CATEGORIES = modelParamsNode.nodes["max_categories"].int();// >> MAX_CATEGORIES;
                let CV_FOLDS = modelParamsNode.nodes["cv_folds"].int();// >> CV_FOLDS;
                let IS_PRUNED = (modelParamsNode.nodes["is_pruned"].int() > 0);// >> IS_PRUNED;
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

        if(!this.model.empty())
    is_trained = this.model.train(this.data, 0);

    if (!is_trained) {
        this.ts.printf(alvision.cvtest.TSConstants.LOG, "in test case %d model training was failed", testCaseIdx);
        return alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
    }
    return alvision.cvtest.FailureCode.OK;
        }
    get_test_error( testCaseIdx : alvision.int, resp : Array < alvision.float >  = null) : alvision.float{
        let type = MLERROR.CV_TEST_ERROR;
        let err : alvision.float= 0;
        let _resp = new alvision.Mat();
        if (this.modelName == CV_EM)
            alvision.assert(() => false);//0);
        else if (this.modelName == CV_ANN)
            err = ann_calc_error(this.model, this.data, this.cls_map, type, resp);
        else if (this.modelName == CV_DTREE || this.modelName == CV_BOOST || this.modelName == CV_RTREES ||
            this.modelName == CV_SVM || this.modelName == CV_NBAYES || this.modelName == CV_KNEAREST)
            err = this.model.calcError(this.data, true, _resp);
        if (!_resp.empty() && resp)
            _resp.convertTo(resp, alvision.MatrixType.CV_32F);
        return err;
    }
    save(filename : string): void {
        this.model.save(filename);
    }
    load(filename  : string) : void {
        if(this.modelName == CV_NBAYES)
            this.model = alvision.Algorithm.load<alvision.ml.NormalBayesClassifier>("NormalBayesClassifier",filename);
        else if (this.modelName == CV_KNEAREST)
        this.model = alvision.Algorithm.load<alvision.ml.KNearest>("KNearest",filename);
        else if (this.modelName == CV_SVM)
        this.model = alvision.Algorithm.load<alvision.ml.SVM>("SVM", filename);
        else if (this.modelName == CV_ANN)
            this.model = alvision.Algorithm.load<alvision.ml.ANN_MLP>("ANN_MLP",filename);
        else if (this.modelName == CV_DTREE)
            this.model = alvision.Algorithm.load<alvision.ml.DTrees>("DTrees",filename);
        else if (this.modelName == CV_BOOST)
            this.model = alvision.Algorithm.load<alvision.ml.Boost>("Boost",filename);
        else if (this.modelName == CV_RTREES)
            this.model = alvision.Algorithm.load<alvision.ml.RTrees>("RTrees",filename);
        else
    alvision.CV_Error(alvision.cv.Error.Code.StsNotImplemented, "invalid stat model name");
    }

    protected data: alvision.ml.TrainData;
    protected modelName: string
    protected validationFN: string;
    protected dataSetNames: Array<string>;
    protected validationFS: alvision.FileStorage;

    protected model: alvision.ml.StatModel;


    protected cls_map: alvision.Dictionary<number, number>;// { [key: number]: number };

    protected initSeed: alvision.int64;
}




class CV_SLMLTest extends CV_MLBaseTest {
    constructor(_modelName: string) {
        super(_modelName);
        this.validationFN = "slvalidation.xml";
    }

    run_test_case(testCaseIdx: alvision.int): alvision.int {
        let code: alvision.cvtest.FailureCode | alvision.int = alvision.cvtest.FailureCode.OK;
        code = this.prepare_test_case(testCaseIdx);

        if (code == alvision.cvtest.FailureCode.OK) {
            this.data.setTrainTestSplit(this.data.getNTrainSamples(), true);
            code = this.train(testCaseIdx);
            if (code == alvision.cvtest.FailureCode.OK) {
                this.get_test_error(testCaseIdx, this.test_resps1);
                this.fname1 = alvision.tempfile(".yml.gz");
                this.save(this.fname1);
                this.load(this.fname1);
                this.get_test_error(testCaseIdx, this.test_resps2);
                this.fname2 = alvision.tempfile(".yml.gz");
                this.save(this.fname2);
            }
            else
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "model can not be trained");
        }
        return code;
    }

    validate_test_results(testCaseIdx: alvision.int): alvision.int {
        let code = alvision.cvtest.FailureCode.OK;

        // 1. compare files
        //FILE * fs1 = fopen(fname1, "rb"), *fs2 = fopen(fname2, "rb");
        let fs1 = fs.openSync(this.fname1, "rb");
        let fs2 = fs.openSync(this.fname2, "rb");

        let sz1 = fs.statSync(this.fname1).size;
        let sz2 = fs.statSync(this.fname2).size;

        let floc1 = 0;
        let floc2 = 0;
        //size_t sz1 = 0, sz2 = 0;

        if (!fs1 || !fs2)
            code =alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA;
        if (code >= 0) {
            
            //fseek(fs1, 0, SEEK_END); fseek(fs2, 0, SEEK_END);
            //sz1 = ftell(fs1);
            //sz2 = ftell(fs2);
            //fseek(fs1, 0, SEEK_SET); fseek(fs2, 0, SEEK_SET);
        }

        if (sz1 != sz2)
            code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;

        if (code >= 0) {
            const BUFSZ = 1024;
            //uchar buf1[BUFSZ], buf2[BUFSZ];
            let buf1 = new Buffer(BUFSZ);
            let buf2 = new Buffer(BUFSZ);

            for (let pos = 0; pos < sz1;  )
            {
                let r1 = fs.readSync(fs1, buf1, 0, BUFSZ, floc1); floc1 += r1;
                let r2 = fs.readSync(fs2, buf2, 0, BUFSZ, floc2); floc2 += r2;
                
                if (r1 != r2 || Buffer.compare(buf1,buf2) != 0) {
                    this.ts.printf(alvision.cvtest.TSConstants.LOG,
                        "in test case %d first (%s) and second (%s) saved files differ in %d-th kb\n",
                        testCaseIdx, this.fname1, this.fname2,
                        pos );
                    code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
                    break;
                }
                pos += r1;
            }
        }

        if (fs1)
            fs.closeSync(fs1);
        if (fs2)
            fs.closeSync(fs2);

        // delete temporary files
        if (code >= 0) {
            alvision.remove(this.fname1);
            alvision.remove(this.fname2);
        }

        if (code >= 0) {
            // 2. compare responses
            alvision.CV_Assert(()=>this.test_resps1.length == this.test_resps2.length);
            //Array<float>.const_iterator it1 = test_resps1.begin(), it2 = test_resps2.begin();
            //for (; it1 != test_resps1.end(); ++it1, ++it2) {
            for (var i = 0; i < this.test_resps1.length; i++){
                let it1 = this.test_resps1[i];
                let it2 = this.test_resps2[i];

                if (Math.abs(it1.valueOf() - it2.valueOf()) > alvision.FLT_EPSILON) {
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "in test case %d responses predicted before saving and after loading is different", testCaseIdx);
                    code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
                    break;
                }
            }
        }
        return code;
    }

    protected test_resps1: Array<alvision.float>;
    protected test_resps2: Array<alvision.float>; // predicted responses for test data
    protected fname1: string;
    protected fname2: string;
}



alvision.cvtest.TEST('ML_NaiveBayes', 'save_load', () => { let test = new CV_SLMLTest(CV_NBAYES); test.safe_run(); });
alvision.cvtest.TEST('ML_KNearest', 'save_load', () => { let test = new CV_SLMLTest(CV_KNEAREST); test.safe_run(); });
alvision.cvtest.TEST('ML_SVM', 'save_load', () => { let test = new CV_SLMLTest(CV_SVM); test.safe_run(); });
alvision.cvtest.TEST('ML_ANN', 'save_load', () => { let test = new CV_SLMLTest(CV_ANN); test.safe_run(); });
alvision.cvtest.TEST('ML_DTree', 'save_load', () => { let test = new CV_SLMLTest (CV_DTREE); test.safe_run(); });
alvision.cvtest.TEST('ML_Boost', 'save_load', () => { let test = new CV_SLMLTest(CV_BOOST); test.safe_run(); });
alvision.cvtest.TEST('ML_RTrees', 'save_load', () => { let test = new CV_SLMLTest(CV_RTREES); test.safe_run(); });
alvision.cvtest.TEST('DISABLED_ML_ERTrees', 'save_load', () => { let test = new CV_SLMLTest(CV_ERTREES); test.safe_run(); });

class CV_LegacyTest  extends alvision.cvtest.BaseTest
{
 constructor(_modelName : string, _suffixes : string = ""){
     super();
     this.modelName = (_modelName);
     this.suffixes = (_suffixes);
    }
    
    run(iii: alvision.int) : void
    {
        let idx = 0;
        for (;;)
        {
            if (idx >= this.suffixes.length)
                break;
            let found = this.suffixes.indexOf(';', idx);
            let piece = this.suffixes.substr(idx, found - idx);
            if (piece != null)
                break;
            this.oneTest(piece);
            idx += piece.length + 1;
        }
    }
     oneTest(suffix : string) : void
    {
        //using namespace alvision.ml;

        let code = alvision.cvtest.FailureCode.OK;
        let filename = this.ts.get_data_path() + "legacy/" + this.modelName + suffix;
        let isTree = this.modelName == CV_BOOST || this.modelName == CV_DTREE || this.modelName == CV_RTREES;
        let model : alvision.ml.StatModel = null; 
        if (this.modelName == CV_BOOST)
            model = alvision.Algorithm.load<alvision.ml.Boost>("Boost",filename);
        else if (this.modelName == CV_ANN)
            model = alvision.Algorithm.load<alvision.ml.ANN_MLP>("ANN_MLP",filename);
        else if (this.modelName == CV_DTREE)
            model = alvision.Algorithm.load<alvision.ml.DTrees>("DTrees",filename);
        else if (this.modelName == CV_NBAYES)
            model = alvision.Algorithm.load<alvision.ml.NormalBayesClassifier>("NormalBayesClassifier",filename);
        else if (this.modelName == CV_SVM)
            model = alvision.Algorithm.load<alvision.ml.SVM>("SVM",filename);
        else if (this.modelName == CV_RTREES)
            model = alvision.Algorithm.load<alvision.ml.RTrees>("RTrees",filename);
        if (!model)
        {
            code = alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
        }
        else
        {
            let input = new alvision.Mat(isTree ? 10 : 1, model.getVarCount(), alvision.MatrixType. CV_32F);
            this.ts.get_rng().fill(input, alvision.DistType.UNIFORM, 0, 40);

            if (isTree)
                this.randomFillCategories(filename, input);

            let output = new alvision.Mat();
            model.predict(input, output, alvision.ml.StatModelFlags.RAW_OUTPUT | (isTree ? alvision.ml.DTreesFlags.PREDICT_SUM : 0));
            // just check if no internal assertions or errors thrown
        }
        this.ts.set_failed_test_info(code);
    }
    randomFillCategories(filename : string, input : alvision.Mat) : void{
        //let catMap = new alvision.Mat();
        //let catCount = new alvision.Mat();
        //let varTypes = new Array<alvision.uchar>();

        let fs = new alvision.FileStorage (filename, alvision.FileStorageMode.READ);
        let root = fs.getFirstTopLevelNode();
        let catMap = root.nodes["cat_map"].readMat();// >> catMap;
        let catCount = root.nodes["cat_count"].readMat();// >> catCount;
        let varTypes = root.nodes["var_type"].readArray<alvision.uchar>("uchar");// >> varTypes;

        let offset = 0;
        let countOffset = 0;
        let val = 0, varCount = varTypes.length;//.size();
        for (; val < varCount; ++val)
        {
            if (varTypes[val] == alvision.ml.VariableTypes.VAR_CATEGORICAL)
            {
                let size = catCount.at<alvision.int>("int",0, countOffset).get();
                for (let row = 0; row < input.rows(); ++row)
                {
                    let randomChosenIndex = offset + (this.ts.get_rng().unsigned()).valueOf() % size.valueOf();
                    let value = catMap.at<alvision.int>("int", 0, randomChosenIndex).get();
                    input.at<alvision.float>("float", row, val).set(value);
                }
                offset += size.valueOf();
                ++countOffset;
            }
        }
    }
    protected modelName : string;
    protected suffixes: string;
};

alvision.cvtest.TEST('ML_ANN', 'legacy_load', () => { let test = new CV_LegacyTest(CV_ANN, "_waveform.xml"); test.safe_run(); });
alvision.cvtest.TEST('ML_Boost', 'legacy_load', () => { let test = new CV_LegacyTest (CV_BOOST, "_adult.xml;_1.xml;_2.xml;_3.xml"); test.safe_run(); });
alvision.cvtest.TEST('ML_DTree', 'legacy_load', () => { let test = new CV_LegacyTest (CV_DTREE, "_abalone.xml;_mushroom.xml"); test.safe_run(); });
alvision.cvtest.TEST('ML_NBayes', 'legacy_load', () => { let test = new CV_LegacyTest(CV_NBAYES, "_waveform.xml"); test.safe_run(); });
alvision.cvtest.TEST('ML_SVM', 'legacy_load', () => { let test = new CV_LegacyTest(CV_SVM, "_poletelecomm.xml;_waveform.xml"); test.safe_run(); });
alvision.cvtest.TEST('ML_RTrees', 'legacy_load', () => { let test = new CV_LegacyTest(CV_RTREES, "_waveform.xml"); test.safe_run(); });

/*TEST(ML_SVM, throw_exception_when_save_untrained_model)
{
    Ptr<alvision.ml.SVM> svm;
    string filename = tempfile("svm.xml");
    ASSERT_THROW(svm.save(filename), Exception);
    remove(filename);
}*/

alvision.cvtest.TEST('DISABLED_ML_SVM', 'linear_save_load', () => {
    let svm1: alvision.ml.SVM;
    let svm2: alvision.ml.SVM;
    let svm3: alvision.ml.SVM;


    svm1 = alvision.Algorithm.load<alvision.ml.SVM>("SVM","SVM45_X_38-1.xml");
    svm2 = alvision.Algorithm.load<alvision.ml.SVM>("SVM","SVM45_X_38-2.xml");
    let tname = alvision.tempfile("a.xml");
    svm2.save(tname);
    svm3 = alvision.Algorithm.load<alvision.ml.SVM>("SVM",tname);

    alvision.ASSERT_EQ(svm1.getVarCount(), svm2.getVarCount());
    alvision.ASSERT_EQ(svm1.getVarCount(), svm3.getVarCount());

    let m = 10000, n = svm1.getVarCount();
    let samples = new alvision.Mat(m, n, alvision.MatrixType.CV_32F), r1 = new alvision.Mat(), r2 = new alvision.Mat(), r3 = new alvision.Mat();
    alvision.randu(samples, 0., 1.);

    svm1.predict(samples, r1);
    svm2.predict(samples, r2);
    svm3.predict(samples, r3);

    let eps = 1e-4;
    alvision.EXPECT_LE(alvision.norm(r1, r2,alvision.NormTypes. NORM_INF), eps);
    alvision.EXPECT_LE(alvision.norm(r1, r3,alvision.NormTypes. NORM_INF), eps);

    alvision.remove(tname);
});

/* End of file. */
