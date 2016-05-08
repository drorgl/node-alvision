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

function str_to_svm_type(str : string) : alvision.int
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
function str_to_svm_kernel_type(str: string): alvision.int {
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
function str_to_ann_train_method(str : string ) : alvision.int
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
    if( nvars != 0 && nvars != values.cols )
        alvision.CV_Error(alvision.cv.Error.Code.StsBadArg, "var_idx is not supported" );
    if( !_data.getMissing().empty() )
        alvision.CV_Error(alvision.cv.Error.Code.StsBadArg, "missing values are not supported" );
}

// unroll the categorical responses to binary vectors
function ann_get_new_responses(_data: alvision.ml.TrainData, map<int, int>& cls_map): alvision.Mat
{
    var train_sidx = _data.getTrainSampleIdx();
    var train_sidx_ptr = train_sidx.ptr<alvision.int>("int");
    var responses = _data.getResponses();
    var cls_count = 0;
    // construct cls_map
    cls_map.clear();
    var nresponses = (int)responses.total();
    int  n = !train_sidx.empty() ? (int)train_sidx.total() : nresponses;

    for(var si = 0; si < n; si++ )
    {
        int sidx = train_sidx_ptr ? train_sidx_ptr[si] : si;
        int r = Math.round(responses.atGet<alvision.float>("float",sidx));
        alvision.CV_DbgAssert(Math.abs(responses.atGet<alvision.float>("float",sidx) - r) < alvision.FLT_EPSILON );
        map<int,int>::iterator it = cls_map.find(r);
        if( it == cls_map.end() )
            cls_map[r] = cls_count++;
    }
    var new_responses = alvision.Mat.zeros( nresponses, cls_count, alvision.MatrixType.CV_32F );
    for(var si = 0; si < n; si++ )
    {
        var sidx = train_sidx_ptr ? train_sidx_ptr[si] : si;
        var r = Math.round(responses.at<float>(sidx));
        int cidx = cls_map[r];
        new_responses.at<float>(sidx, cidx) = 1.f;
    }
    return new_responses;
}

function ann_calc_error(ann: alvision.ml.StatModel, _data: alvision.ml.TrainData, map<int, int>& cls_map, type: alvision.int, resp_labels: Array<alvision.float> ) : alvision.float
{
    var err = 0;
    var samples = _data.getSamples();
    var responses = _data.getResponses();
    var sample_idx = (type == CV_TEST_ERROR) ? _data.getTestSampleIdx() : _data.getTrainSampleIdx();
    int* sidx = !sample_idx.empty() ? sample_idx.ptr<int>() : 0;
    ann_check_data( _data );
    int sample_count = (int)sample_idx.total();
    sample_count = (type == CV_TRAIN_ERROR && sample_count == 0) ? samples.rows : sample_count;
    float* pred_resp = 0;
    Array<float> innresp;
    if( sample_count > 0 )
    {
        if( resp_labels )
        {
            resp_labels.resize( sample_count );
            pred_resp = &((*resp_labels)[0]);
        }
        else
        {
            innresp.resize( sample_count );
            pred_resp = &(innresp[0]);
        }
    }
    int cls_count = (int)cls_map.size();
    Mat output( 1, cls_count, CV_32FC1 );

    for( int i = 0; i < sample_count; i++ )
    {
        int si = sidx ? sidx[i] : i;
        Mat sample = samples.row(si);
        ann.predict( sample, output );
        Point best_cls;
        minMaxLoc(output, 0, 0, 0, &best_cls, 0);
        int r = Math.round(responses.at<float>(si));
        CV_DbgAssert( fabs(responses.at<float>(si) - r) < FLT_EPSILON );
        r = cls_map[r];
        int d = best_cls.x == r ? 0 : 1;
        err += d;
        pred_resp[i] = (float)best_cls.x;
    }
    err = sample_count ? err / (float)sample_count * 100 : -FLT_MAX;
    return err;
}

// 6. dtree
// 7. boost
int str_to_boost_type( String& str )
{
    if ( !str.compare("DISCRETE") )
        return Boost::DISCRETE;
    if ( !str.compare("REAL") )
        return Boost::REAL;
    if ( !str.compare("LOGIT") )
        return Boost::LOGIT;
    if ( !str.compare("GENTLE") )
        return Boost::GENTLE;
    CV_Error( CV_StsBadArg, "incorrect boost type string" );
    return -1;
}

// 8. rtrees
// 9. ertrees

// ---------------------------------- MLBaseTest ---------------------------------------------------

CV_MLBaseTest::CV_MLBaseTest(const char* _modelName)
{
    int64 seeds[] = { CV_BIG_INT(0x00009fff4f9c8d52),
                      CV_BIG_INT(0x0000a17166072c7c),
                      CV_BIG_INT(0x0201b32115cd1f9a),
                      CV_BIG_INT(0x0513cb37abcd1234),
                      CV_BIG_INT(0x0001a2b3c4d5f678)
                    };

    int seedCount = sizeof(seeds)/sizeof(seeds[0]);
    RNG& rng = theRNG();

    initSeed = rng.state;
    rng.state = seeds[rng(seedCount)];

    modelName = _modelName;
}

CV_MLBaseTest::~CV_MLBaseTest()
{
    if( validationFS.isOpened() )
        validationFS.release();
    theRNG().state = initSeed;
}

int CV_MLBaseTest::read_params( CvFileStorage* __fs )
{
    FileStorage _fs(__fs, false);
    if( !_fs.isOpened() )
        test_case_count = -1;
    else
    {
        FileNode fn = _fs.getFirstTopLevelNode()["run_params"][modelName];
        test_case_count = (int)fn.size();
        if( test_case_count <= 0 )
            test_case_count = -1;
        if( test_case_count > 0 )
        {
            dataSetNames.resize( test_case_count );
            FileNodeIterator it = fn.begin();
            for( int i = 0; i < test_case_count; i++, ++it )
            {
                dataSetNames[i] = (string)*it;
            }
        }
    }
    return alvision.cvtest.FailureCode.OK;;
}

void CV_MLBaseTest::run( int )
{
    string filename = ts.get_data_path();
    filename += get_validation_filename();
    validationFS.open( filename, FileStorage::READ );
    read_params( *validationFS );

    int code = alvision.cvtest.FailureCode.OK;
    for (int i = 0; i < test_case_count; i++)
    {
        int temp_code = run_test_case( i );
        if (temp_code == alvision.cvtest.FailureCode.OK)
            temp_code = validate_test_results( i );
        if (temp_code != alvision.cvtest.FailureCode.OK)
            code = temp_code;
    }
    if ( test_case_count <= 0)
    {
        ts.printf( alvision.cvtest.TSConstants.LOG, "validation file is not determined or not correct" );
        code = alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
    }
    this.ts.set_failed_test_info( code );
}

int CV_MLBaseTest::prepare_test_case( int test_case_idx )
{
    clear();

    string dataPath = ts.get_data_path();
    if ( dataPath.empty() )
    {
        ts.printf( alvision.cvtest.TSConstants.LOG, "data path is empty" );
        return alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
    }

    string dataName = dataSetNames[test_case_idx],
        filename = dataPath + dataName + ".data";

    FileNode dataParamsNode = validationFS.getFirstTopLevelNode()["validation"][modelName][dataName]["data_params"];
    CV_DbgAssert( !dataParamsNode.empty() );

    CV_DbgAssert( !dataParamsNode["LS"].empty() );
    int trainSampleCount = (int)dataParamsNode["LS"];

    CV_DbgAssert( !dataParamsNode["resp_idx"].empty() );
    int respIdx = (int)dataParamsNode["resp_idx"];

    CV_DbgAssert( !dataParamsNode["types"].empty() );
    String varTypes = (String)dataParamsNode["types"];

    data = TrainData::loadFromCSV(filename, 0, respIdx, respIdx+1, varTypes);
    if( data.empty() )
    {
        ts.printf( alvision.cvtest.TSConstants.LOG, "file %s can not be read\n", filename );
        return alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
    }

    data.setTrainTestSplit(trainSampleCount);
    return alvision.cvtest.FailureCode.OK;
}

string& CV_MLBaseTest::get_validation_filename()
{
    return validationFN;
}

int CV_MLBaseTest::train( int testCaseIdx )
{
    bool is_trained = false;
    FileNode modelParamsNode =
        validationFS.getFirstTopLevelNode()["validation"][modelName][dataSetNames[testCaseIdx]]["model_params"];

    if( modelName == CV_NBAYES )
        model = NormalBayesClassifier::create();
    else if( modelName == CV_KNEAREST )
    {
        model = KNearest::create();
    }
    else if( modelName == CV_SVM )
    {
        String svm_type_str, kernel_type_str;
        modelParamsNode["svm_type"] >> svm_type_str;
        modelParamsNode["kernel_type"] >> kernel_type_str;
        Ptr<SVM> m = SVM::create();
        m.setType(str_to_svm_type( svm_type_str ));
        m.setKernel(str_to_svm_kernel_type( kernel_type_str ));
        m.setDegree(modelParamsNode["degree"]);
        m.setGamma(modelParamsNode["gamma"]);
        m.setCoef0(modelParamsNode["coef0"]);
        m.setC(modelParamsNode["C"]);
        m.setNu(modelParamsNode["nu"]);
        m.setP(modelParamsNode["p"]);
        model = m;
    }
    else if( modelName == CV_EM )
    {
        assert( 0 );
    }
    else if( modelName == CV_ANN )
    {
        String train_method_str;
        double param1, param2;
        modelParamsNode["train_method"] >> train_method_str;
        modelParamsNode["param1"] >> param1;
        modelParamsNode["param2"] >> param2;
        Mat new_responses = ann_get_new_responses( data, cls_map );
        // binarize the responses
        data = TrainData::create(data.getSamples(), data.getLayout(), new_responses,
                                 data.getVarIdx(), data.getTrainSampleIdx());
        int layer_sz[] = { data.getNAllVars(), 100, 100, (int)cls_map.size() };
        Mat layer_sizes( 1, (int)(sizeof(layer_sz)/sizeof(layer_sz[0])), CV_32S, layer_sz );
        Ptr<ANN_MLP> m = ANN_MLP::create();
        m.setLayerSizes(layer_sizes);
        m.setActivationFunction(ANN_MLP::SIGMOID_SYM, 0, 0);
        m.setTermCriteria(TermCriteria(TermCriteria::COUNT,300,0.01));
        m.setTrainMethod(str_to_ann_train_method(train_method_str), param1, param2);
        model = m;

    }
    else if( modelName == CV_DTREE )
    {
        int MAX_DEPTH, MIN_SAMPLE_COUNT, MAX_CATEGORIES, CV_FOLDS;
        float REG_ACCURACY = 0;
        bool USE_SURROGATE = false, IS_PRUNED;
        modelParamsNode["max_depth"] >> MAX_DEPTH;
        modelParamsNode["min_sample_count"] >> MIN_SAMPLE_COUNT;
        //modelParamsNode["use_surrogate"] >> USE_SURROGATE;
        modelParamsNode["max_categories"] >> MAX_CATEGORIES;
        modelParamsNode["cv_folds"] >> CV_FOLDS;
        modelParamsNode["is_pruned"] >> IS_PRUNED;

        Ptr<DTrees> m = DTrees::create();
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
    else if( modelName == CV_BOOST )
    {
        int BOOST_TYPE, WEAK_COUNT, MAX_DEPTH;
        float WEIGHT_TRIM_RATE;
        bool USE_SURROGATE = false;
        String typeStr;
        modelParamsNode["type"] >> typeStr;
        BOOST_TYPE = str_to_boost_type( typeStr );
        modelParamsNode["weak_count"] >> WEAK_COUNT;
        modelParamsNode["weight_trim_rate"] >> WEIGHT_TRIM_RATE;
        modelParamsNode["max_depth"] >> MAX_DEPTH;
        //modelParamsNode["use_surrogate"] >> USE_SURROGATE;

        Ptr<Boost> m = Boost::create();
        m.setBoostType(BOOST_TYPE);
        m.setWeakCount(WEAK_COUNT);
        m.setWeightTrimRate(WEIGHT_TRIM_RATE);
        m.setMaxDepth(MAX_DEPTH);
        m.setUseSurrogates(USE_SURROGATE);
        m.setPriors(Mat());
        model = m;
    }
    else if( modelName == CV_RTREES )
    {
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

        Ptr<RTrees> m = RTrees::create();
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

    if( !model.empty() )
        is_trained = model.train(data, 0);

    if( !is_trained )
    {
        ts.printf( alvision.cvtest.TSConstants.LOG, "in test case %d model training was failed", testCaseIdx );
        return alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
    }
    return alvision.cvtest.FailureCode.OK;
}

float CV_MLBaseTest::get_test_error( int /*testCaseIdx*/, Array<float> *resp )
{
    int type = CV_TEST_ERROR;
    float err = 0;
    Mat _resp;
    if( modelName == CV_EM )
        assert( 0 );
    else if( modelName == CV_ANN )
        err = ann_calc_error( model, data, cls_map, type, resp );
    else if( modelName == CV_DTREE || modelName == CV_BOOST || modelName == CV_RTREES ||
             modelName == CV_SVM || modelName == CV_NBAYES || modelName == CV_KNEAREST )
        err = model.calcError( data, true, _resp );
    if( !_resp.empty() && resp )
        _resp.convertTo(*resp, CV_32F);
    return err;
}

void CV_MLBaseTest::save( const char* filename )
{
    model.save( filename );
}

void CV_MLBaseTest::load( const char* filename )
{
    if( modelName == CV_NBAYES )
        model = Algorithm::load<NormalBayesClassifier>( filename );
    else if( modelName == CV_KNEAREST )
        model = Algorithm::load<KNearest>( filename );
    else if( modelName == CV_SVM )
        model = Algorithm::load<SVM>( filename );
    else if( modelName == CV_ANN )
        model = Algorithm::load<ANN_MLP>( filename );
    else if( modelName == CV_DTREE )
        model = Algorithm::load<DTrees>( filename );
    else if( modelName == CV_BOOST )
        model = Algorithm::load<Boost>( filename );
    else if( modelName == CV_RTREES )
        model = Algorithm::load<RTrees>( filename );
    else
        CV_Error( CV_StsNotImplemented, "invalid stat model name");
}

/* End of file. */
