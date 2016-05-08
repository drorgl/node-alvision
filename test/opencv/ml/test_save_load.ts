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
//#include <iostream>
//#include <fstream>
//
//using namespace cv;
//using namespace std;

const CV_NBAYES  = "nbayes"     ;
const CV_KNEAREST= "knearest"   ;
const CV_SVM     = "svm"        ;
const CV_EM      = "em"         ;
const CV_ANN     = "ann"        ;
const CV_DTREE   = "dtree"      ;
const CV_BOOST   = "boost"      ;
const CV_RTREES  = "rtrees"     ;
const CV_ERTREES = "ertrees";

function CV_BIG_INT(x: number): number {
    return x;
}

class CV_MLBaseTest extends alvision.cvtest.BaseTest {
    constructor(_modelName: string) {
        super();
        var seeds = [
            CV_BIG_INT(0x00009fff4f9c8d52),
            CV_BIG_INT(0x0000a17166072c7c),
            CV_BIG_INT(0x0201b32115cd1f9a),
            CV_BIG_INT(0x0513cb37abcd1234),
            CV_BIG_INT(0x0001a2b3c4d5f678)
        ];

        var seedCount = seeds.length;//sizeof(seeds) / sizeof(seeds[0]);
        var rng = alvision.theRNG();

        this.initSeed = rng.state;
        rng.state = seeds[rng.uniform(0,seedCount).valueOf()];

        this.modelName = _modelName;
    }
    clear(): void {
        if (this.validationFS.isOpened())
            this.validationFS.release();
        alvision.theRNG().state = initSeed;
    }

    read_params(fs: alvision.FileStorage): alvision.int{
        var _fs = new alvision.FileStorage(fs, false);
        if (!_fs.isOpened())
            this.test_case_count = -1;
        else {
            var fn = _fs.getFirstTopLevelNode()["run_params"][this.modelName];
            this.test_case_count = fn.size();
            if (this.test_case_count <= 0)
                this.test_case_count = -1;
            if (this.test_case_count > 0) {
                dataSetNames.resize(this.test_case_count);
                FileNodeIterator it = fn.begin();
                for (int i = 0; i < this.test_case_count; i++ , ++it )
                {
                    dataSetNames[i] = (string) * it;
                }
            }
        }
        return alvision.cvtest.FailureCode.OK;;
    }
    run(startFrom: alvision.int): void {
        var filename = this.ts.get_data_path();
        filename += this.get_validation_filename();
        this.validationFS.open(filename, alvision.FileStorageMode.READ);
        this.read_params( this.validationFS);

        var code = alvision.cvtest.FailureCode.OK;
        for (var i = 0; i < this.test_case_count; i++)
        {
            var temp_code = this.run_test_case(i);
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
    prepare_test_case(testCaseIdx: alvision.int): alvision.int {
        this.clear();

        var dataPath = this.ts.get_data_path();
        if (dataPath == null || dataPath == "") {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "data path is empty");
            return alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
        }

        var dataName = dataSetNames[test_case_idx],
            filename = dataPath + dataName + ".data";

        var dataParamsNode = this.validationFS.getFirstTopLevelNode()["validation"][this.modelName][dataName]["data_params"];
        alvision.CV_DbgAssert(!dataParamsNode.empty());

        alvision.CV_DbgAssert(!dataParamsNode["LS"].empty());
        var trainSampleCount = (int)dataParamsNode["LS"];

        alvision.CV_DbgAssert(!dataParamsNode["resp_idx"].empty());
        var respIdx = (int)dataParamsNode["resp_idx"];

        alvision.CV_DbgAssert(!dataParamsNode["types"].empty());
        var varTypes = (String)dataParamsNode["types"];

        data = alvision.TrainData.loadFromCSV(filename, 0, respIdx, respIdx + 1, varTypes);
        if (data.empty()) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "file %s can not be read\n", filename);
            return alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
        }

        data.setTrainTestSplit(trainSampleCount);
        return alvision.cvtest.FailureCode.OK;
    }

    get_validation_filename(): string {
        return this.validationFN;
    }

    run_test_case(testCaseIdx: alvision.int): alvision.int { }

    validate_test_results(testCaseIdx: alvision.int): alvision.int { }

    train(testCaseIdx: alvision.int ): alvision.int {
        var is_trained = false;
        var modelParamsNode =
            this.validationFS.getFirstTopLevelNode()["validation"][this.modelName][dataSetNames[testCaseIdx]]["model_params"];

        if (this.modelName == CV_NBAYES)
            this.model = alvision.NormalBayesClassifier.create();
    else if (modelName == CV_KNEAREST) {
            this.model = alvision.KNearest.create();
        }
        else if (this.modelName == CV_SVM) {
            var svm_type_str : string, kernel_type_str : string;
            modelParamsNode["svm_type"] >> svm_type_str;
            modelParamsNode["kernel_type"] >> kernel_type_str;

            var m = alvision.ml.SVM.create();

            m.setType(str_to_svm_type(svm_type_str));
            m.setKernel(str_to_svm_kernel_type(kernel_type_str));
            m.setDegree(modelParamsNode["degree"]);
            m.setGamma(modelParamsNode["gamma"]);
            m.setCoef0(modelParamsNode["coef0"]);
            m.setC(modelParamsNode["C"]);
            m.setNu(modelParamsNode["nu"]);
            m.setP(modelParamsNode["p"]);
            model = m;
        }
        else if (modelName == CV_EM) {
            assert(0);
        }
        else if (modelName == CV_ANN) {
            String train_method_str;
            double param1, param2;
            modelParamsNode["train_method"] >> train_method_str;
            modelParamsNode["param1"] >> param1;
            modelParamsNode["param2"] >> param2;
            var new_responses = ann_get_new_responses(data, cls_map);
            // binarize the responses
            data = alvision.ml.TrainData::create(data.getSamples(), data.getLayout(), new_responses,
                data.getVarIdx(), data.getTrainSampleIdx());
            int layer_sz[] = { data.getNAllVars(), 100, 100, (int)cls_map.size()
        };
        var layer_sizes = new alvision.Mat(1, (int)(sizeof(layer_sz) / sizeof(layer_sz[0])), CV_32S, layer_sz);
        var m = alvision.ml.ANN_MLP.create();
        m.setLayerSizes(layer_sizes);
        m.setActivationFunction(ANN_MLP::SIGMOID_SYM, 0, 0);
        m.setTermCriteria(TermCriteria(TermCriteria::COUNT, 300, 0.01));
        m.setTrainMethod(str_to_ann_train_method(train_method_str), param1, param2);
        model = m;

    }
    else if(modelName == CV_DTREE) {
        int MAX_DEPTH, MIN_SAMPLE_COUNT, MAX_CATEGORIES, CV_FOLDS;
        float REG_ACCURACY = 0;
        bool USE_SURROGATE = false, IS_PRUNED;
        modelParamsNode["max_depth"] >> MAX_DEPTH;
        modelParamsNode["min_sample_count"] >> MIN_SAMPLE_COUNT;
        //modelParamsNode["use_surrogate"] >> USE_SURROGATE;
        modelParamsNode["max_categories"] >> MAX_CATEGORIES;
        modelParamsNode["cv_folds"] >> CV_FOLDS;
        modelParamsNode["is_pruned"] >> IS_PRUNED;

        var m = alvision.ml.Dtrees.create();
        m.setMaxDepth(MAX_DEPTH);
        m.setMinSampleCount(MIN_SAMPLE_COUNT);
        m.setRegressionAccuracy(REG_ACCURACY);
        m.setUseSurrogates(USE_SURROGATE);
        m.setMaxCategories(MAX_CATEGORIES);
        m.setCVFolds(CV_FOLDS);
        m.setUse1SERule(false);
        m.setTruncatePrunedTree(IS_PRUNED);
        m.setPriors(Mat());
        model = m;
    }
else if(modelName == CV_BOOST) {
        int BOOST_TYPE, WEAK_COUNT, MAX_DEPTH;
        float WEIGHT_TRIM_RATE;
        bool USE_SURROGATE = false;
        String typeStr;
        modelParamsNode["type"] >> typeStr;
        BOOST_TYPE = str_to_boost_type(typeStr);
        modelParamsNode["weak_count"] >> WEAK_COUNT;
        modelParamsNode["weight_trim_rate"] >> WEIGHT_TRIM_RATE;
        modelParamsNode["max_depth"] >> MAX_DEPTH;
        //modelParamsNode["use_surrogate"] >> USE_SURROGATE;

        var m = alvision.ml.Boost.create();
        m.setBoostType(BOOST_TYPE);
        m.setWeakCount(WEAK_COUNT);
        m.setWeightTrimRate(WEIGHT_TRIM_RATE);
        m.setMaxDepth(MAX_DEPTH);
        m.setUseSurrogates(USE_SURROGATE);
        m.setPriors(Mat());
        model = m;
    }
else if(modelName == CV_RTREES) {
        int MAX_DEPTH, MIN_SAMPLE_COUNT, MAX_CATEGORIES, CV_FOLDS, NACTIVE_VARS, MAX_TREES_NUM;
        float REG_ACCURACY = 0, OOB_EPS = 0.0;
        bool USE_SURROGATE = false, IS_PRUNED;
        modelParamsNode["max_depth"] >> MAX_DEPTH;
        modelParamsNode["min_sample_count"] >> MIN_SAMPLE_COUNT;
        //modelParamsNode["use_surrogate"] >> USE_SURROGATE;
        modelParamsNode["max_categories"] >> MAX_CATEGORIES;
        modelParamsNode["cv_folds"] >> CV_FOLDS;
        modelParamsNode["is_pruned"] >> IS_PRUNED;
        modelParamsNode["nactive_vars"] >> NACTIVE_VARS;
        modelParamsNode["max_trees_num"] >> MAX_TREES_NUM;

        var m = alvision.ml.RTrees.create();
        m.setMaxDepth(MAX_DEPTH);
        m.setMinSampleCount(MIN_SAMPLE_COUNT);
        m.setRegressionAccuracy(REG_ACCURACY);
        m.setUseSurrogates(USE_SURROGATE);
        m.setMaxCategories(MAX_CATEGORIES);
        m.setPriors(Mat());
        m.setCalculateVarImportance(true);
        m.setActiveVarCount(NACTIVE_VARS);
        m.setTermCriteria(TermCriteria(TermCriteria::COUNT, MAX_TREES_NUM, OOB_EPS));
        model = m;
    }

    if(!model.empty())
is_trained = model.train(data, 0);

if (!is_trained) {
    this.ts.printf(alvision.cvtest.TSConstants.LOG, "in test case %d model training was failed", testCaseIdx);
    return alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
}
return alvision.cvtest.FailureCode.OK;
    }
get_test_error(int testCaseIdx, Array < float > *resp = 0) : alvision.float{
    int type = CV_TEST_ERROR;
    float err = 0;
    Mat _resp;
    if (modelName == CV_EM)
        assert(0);
    else if (modelName == CV_ANN)
        err = ann_calc_error(model, data, cls_map, type, resp);
    else if (modelName == CV_DTREE || modelName == CV_BOOST || modelName == CV_RTREES ||
        modelName == CV_SVM || modelName == CV_NBAYES || modelName == CV_KNEAREST)
        err = model .calcError(data, true, _resp);
    if (!_resp.empty() && resp)
        _resp.convertTo(*resp, CV_32F);
    return err;
}
save(filename : string): void {
    model.save(filename);
}
load(filename  : string) : void {
    if(modelName == CV_NBAYES)
        model = Algorithm::load<NormalBayesClassifier>(filename);
    else if (modelName == CV_KNEAREST)
    model = Algorithm::load<KNearest>(filename);
    else if (modelName == CV_SVM)
    model = Algorithm::load<SVM>(filename);
    else if (modelName == CV_ANN)
    model = Algorithm::load<ANN_MLP>(filename);
    else if (modelName == CV_DTREE)
    model = Algorithm::load<DTrees>(filename);
    else if (modelName == CV_BOOST)
    model = Algorithm::load<Boost>(filename);
    else if (modelName == CV_RTREES)
    model = Algorithm::load<RTrees>(filename);
    else
CV_Error(CV_StsNotImplemented, "invalid stat model name");
}

protected data: alvision.ml.TrainData;
protected modelName: string
protected validationFN: string;
    protected dataSetNames: Array<string>;
    protected validationFS: alvision.FileStorage;

    protected model: StatModel;


std::map < int, int > cls_map;

protected initSeed: alvision.int64;
}




class CV_SLMLTest extends CV_MLBaseTest {
    constructor(_modelName: string) {
        super(_modelName);
        this.validationFN = "slvalidation.xml";
    }

    run_test_case(testCaseIdx: alvision.int): alvision.int {
        var code = alvision.cvtest.FailureCode.OK;
        code = this.prepare_test_case(testCaseIdx);

        if (code == alvision.cvtest.FailureCode.OK) {
            data.setTrainTestSplit(data.getNTrainSamples(), true);
            code = this.train(testCaseIdx);
            if (code == alvision.cvtest.FailureCode.OK) {
                this.get_test_error(testCaseIdx, &test_resps1);
                this.fname1 = tempfile(".yml.gz");
                this.save(fname1);
                this.load(fname1);
                this.get_test_error(testCaseIdx, &test_resps2);
                this.fname2 = tempfile(".yml.gz");
                this.save(fname2);
            }
            else
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "model can not be trained");
        }
        return code;
    }

    validate_test_results(testCaseIdx: alvision.int): alvision.int {
        var code = alvision.cvtest.FailureCode.OK;

        // 1. compare files
        FILE * fs1 = fopen(fname1, "rb"), *fs2 = fopen(fname2, "rb");
        size_t sz1 = 0, sz2 = 0;
        if (!fs1 || !fs2)
            code = alvision.cvtest.TS::FAIL_MISSING_TEST_DATA;
        if (code >= 0) {
            fseek(fs1, 0, SEEK_END); fseek(fs2, 0, SEEK_END);
            sz1 = ftell(fs1);
            sz2 = ftell(fs2);
            fseek(fs1, 0, SEEK_SET); fseek(fs2, 0, SEEK_SET);
        }

        if (sz1 != sz2)
            code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;

        if (code >= 0) {
            const int BUFSZ = 1024;
            uchar buf1[BUFSZ], buf2[BUFSZ];
            for (size_t pos = 0; pos < sz1;  )
            {
                size_t r1 = fread(buf1, 1, BUFSZ, fs1);
                size_t r2 = fread(buf2, 1, BUFSZ, fs2);
                if (r1 != r2 || memcmp(buf1, buf2, r1) != 0) {
                    ts .printf(alvision.cvtest.TSConstants.LOG,
                        "in test case %d first (%s) and second (%s) saved files differ in %d-th kb\n",
                        testCaseIdx, fname1, fname2,
                        (int)pos );
                    code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
                    break;
                }
                pos += r1;
            }
        }

        if (fs1)
            fclose(fs1);
        if (fs2)
            fclose(fs2);

        // delete temporary files
        if (code >= 0) {
            remove(fname1);
            remove(fname2);
        }

        if (code >= 0) {
            // 2. compare responses
            CV_Assert(test_resps1.size() == test_resps2.size());
            Array<float>::const_iterator it1 = test_resps1.begin(), it2 = test_resps2.begin();
            for (; it1 != test_resps1.end(); ++it1, ++it2) {
                if (fabs(*it1 - *it2) > FLT_EPSILON) {
                    ts .printf(alvision.cvtest.TSConstants.LOG, "in test case %d responses predicted before saving and after loading is different", testCaseIdx);
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



alvision.cvtest.TEST('ML_NaiveBayes', 'save_load', () => { var test = new CV_SLMLTest(CV_NBAYES); test.safe_run(); });
alvision.cvtest.TEST('ML_KNearest', 'save_load', () => { var test = new CV_SLMLTest(CV_KNEAREST); test.safe_run(); });
alvision.cvtest.TEST('ML_SVM', 'save_load', () => { var test = new CV_SLMLTest(CV_SVM); test.safe_run(); });
alvision.cvtest.TEST('ML_ANN', 'save_load', () => { var test = new CV_SLMLTest(CV_ANN); test.safe_run(); });
alvision.cvtest.TEST('ML_DTree', 'save_load', () => { var test = new CV_SLMLTest (CV_DTREE); test.safe_run(); });
alvision.cvtest.TEST('ML_Boost', 'save_load', () => { var test = new CV_SLMLTest(CV_BOOST); test.safe_run(); });
alvision.cvtest.TEST('ML_RTrees', 'save_load', () => { var test = new CV_SLMLTest(CV_RTREES); test.safe_run(); });
alvision.cvtest.TEST('DISABLED_ML_ERTrees', 'save_load', () => { var test = new CV_SLMLTest(CV_ERTREES); test.safe_run(); });

class CV_LegacyTest  extends alvision.cvtest.BaseTest
{
 constructor(_modelName : string, _suffixes? : string = ""){
     super();
     this.modelName = (_modelName);
     this.suffixes = (_suffixes);
    }
    
    run(iii: alvision.int) : void
    {
        var idx = 0;
        for (;;)
        {
            if (idx >= this.suffixes.length)
                break;
            int found = (int)suffixes.find(';', idx);
            string piece = suffixes.substr(idx, found - idx);
            if (piece.empty())
                break;
            oneTest(piece);
            idx += (unsigned int)piece.size() + 1;
        }
    }
     oneTest(suffix : string) : void
    {
        //using namespace alvision.ml;

        int code = alvision.cvtest.FailureCode.OK;
        string filename = ts.get_data_path() + "legacy/" + modelName + suffix;
        bool isTree = modelName == CV_BOOST || modelName == CV_DTREE || modelName == CV_RTREES;
        Ptr<StatModel> model;
        if (modelName == CV_BOOST)
            model = Algorithm::load<Boost>(filename);
        else if (modelName == CV_ANN)
            model = Algorithm::load<ANN_MLP>(filename);
        else if (modelName == CV_DTREE)
            model = Algorithm::load<DTrees>(filename);
        else if (modelName == CV_NBAYES)
            model = Algorithm::load<NormalBayesClassifier>(filename);
        else if (modelName == CV_SVM)
            model = Algorithm::load<SVM>(filename);
        else if (modelName == CV_RTREES)
            model = Algorithm::load<RTrees>(filename);
        if (!model)
        {
            code = alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
        }
        else
        {
            Mat input = Mat(isTree ? 10 : 1, model.getVarCount(), CV_32F);
            ts.get_rng().fill(input, RNG::UNIFORM, 0, 40);

            if (isTree)
                randomFillCategories(filename, input);

            Mat output;
            model.predict(input, output, StatModel::RAW_OUTPUT | (isTree ? DTrees::PREDICT_SUM : 0));
            // just check if no internal assertions or errors thrown
        }
        this.ts.set_failed_test_info(code);
    }
    randomFillCategories(filename : string, input : alvision.Mat) : void{
        Mat catMap;
        Mat catCount;
        Array<uchar> varTypes;

        var fs = new alvision.FileStorage (filename, FileStorage::READ);
        var root = fs.getFirstTopLevelNode();
        root["cat_map"] >> catMap;
        root["cat_count"] >> catCount;
        root["var_type"] >> varTypes;

        var offset = 0;
        var countOffset = 0;
        uint var = 0, varCount = (uint)varTypes.size();
        for (; var < varCount; ++var)
        {
            if (varTypes[var] == ml::VAR_CATEGORICAL)
            {
                int size = catCount.at<int>(0, countOffset);
                for (int row = 0; row < input.rows; ++row)
                {
                    int randomChosenIndex = offset + ((uint)ts.get_rng()) % size;
                    int value = catMap.at<int>(0, randomChosenIndex);
                    input.at<float>(row, var) = (float)value;
                }
                offset += size;
                ++countOffset;
            }
        }
    }
    protected modelName : string;
    protected suffixes: string;
};

alvision.cvtest.TEST('ML_ANN', 'legacy_load', () => { CV_LegacyTest test(CV_ANN, "_waveform.xml"); test.safe_run(); });
alvision.cvtest.TEST('ML_Boost', 'legacy_load', () => { CV_LegacyTest test(CV_BOOST, "_adult.xml;_1.xml;_2.xml;_3.xml"); test.safe_run(); });
alvision.cvtest.TEST('ML_DTree', 'legacy_load', () => { CV_LegacyTest test(CV_DTREE, "_abalone.xml;_mushroom.xml"); test.safe_run(); });
alvision.cvtest.TEST('ML_NBayes', 'legacy_load', () => { CV_LegacyTest test(CV_NBAYES, "_waveform.xml"); test.safe_run(); });
alvision.cvtest.TEST('ML_SVM', 'legacy_load', () => { CV_LegacyTest test(CV_SVM, "_poletelecomm.xml;_waveform.xml"); test.safe_run(); });
alvision.cvtest.TEST('ML_RTrees', 'legacy_load', () => { CV_LegacyTest test(CV_RTREES, "_waveform.xml"); test.safe_run(); });

/*TEST(ML_SVM, throw_exception_when_save_untrained_model)
{
    Ptr<alvision.ml::SVM> svm;
    string filename = tempfile("svm.xml");
    ASSERT_THROW(svm.save(filename), Exception);
    remove(filename);
}*/

alvision.cvtest.TEST('DISABLED_ML_SVM', 'linear_save_load', () => {
    var svm1: alvision.ml.SVM;
    var svm2: alvision.ml.SVM;
    var svm3: alvision.ml.SVM;


    svm1 = alvision.Algorithm.load<SVM>("SVM45_X_38-1.xml");
    svm2 = alvision.Algorithm.load<SVM>("SVM45_X_38-2.xml");
    var tname = alvision.tempfile("a.xml");
    svm2.save(tname);
    svm3 = alvision.Algorithm.load<SVM>(tname);

    alvision.ASSERT_EQ(svm1.getVarCount(), svm2.getVarCount());
    alvision.ASSERT_EQ(svm1.getVarCount(), svm3.getVarCount());

    var m = 10000, n = svm1.getVarCount();
    var samples = new alvision.Mat (m, n, CV_32F), r1 = new alvision.Mat(), r2 = new alvision.Mat(), r3 = new alvision.Mat();
    alvision.randu(samples, 0., 1.);

    svm1.predict(samples, r1);
    svm2.predict(samples, r2);
    svm3.predict(samples, r3);

    var eps = 1e-4;
    alvision.EXPECT_LE(alvision.norm(r1, r2,alvision.NormTypes. NORM_INF), eps);
    alvision.EXPECT_LE(alvision.norm(r1, r3,alvision.NormTypes. NORM_INF), eps);

    remove(tname);
});

/* End of file. */
