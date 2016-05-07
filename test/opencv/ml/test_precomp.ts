#ifdef __GNUC__
#  pragma GCC diagnostic ignored "-Wmissing-declarations"
#  if defined __clang__ || defined __APPLE__
#    pragma GCC diagnostic ignored "-Wmissing-prototypes"
#    pragma GCC diagnostic ignored "-Wextra"
#  endif
#endif

#ifndef __OPENCV_TEST_PRECOMP_HPP__
#define __OPENCV_TEST_PRECOMP_HPP__

#include <iostream>
#include <map>
#include "opencv2/ts.hpp"
#include "opencv2/ml.hpp"
#include "opencv2/core/core_c.h"

#define CV_NBAYES   "nbayes"
#define CV_KNEAREST "knearest"
#define CV_SVM      "svm"
#define CV_EM       "em"
#define CV_ANN      "ann"
#define CV_DTREE    "dtree"
#define CV_BOOST    "boost"
#define CV_RTREES   "rtrees"
#define CV_ERTREES  "ertrees"

enum { CV_TRAIN_ERROR=0, CV_TEST_ERROR=1 };

using alvision.Ptr;
using alvision.ml::StatModel;
using alvision.ml::TrainData;
using alvision.ml::NormalBayesClassifier;
using alvision.ml::SVM;
using alvision.ml::KNearest;
using alvision.ml::ParamGrid;
using alvision.ml::ANN_MLP;
using alvision.ml::DTrees;
using alvision.ml::Boost;
using alvision.ml::RTrees;

class CV_MLBaseTest  extends alvision.cvtest.BaseTest
{
public:
    CV_MLBaseTest( const char* _modelName );
    virtual ~CV_MLBaseTest();
protected:
    virtual int read_params( CvFileStorage* fs );
    virtual void run( int startFrom );
    virtual int prepare_test_case( int testCaseIdx );
    virtual std::string& get_validation_filename();
    virtual int run_test_case( int testCaseIdx ) = 0;
    virtual int validate_test_results( int testCaseIdx ) = 0;

    int train( int testCaseIdx );
    float get_test_error( int testCaseIdx, std::Array<float> *resp = 0 );
    void save( const char* filename );
    void load( const char* filename );

    Ptr<TrainData> data;
    std::string modelName, validationFN;
    std::Array<std::string> dataSetNames;
    alvision.FileStorage validationFS;

    Ptr<StatModel> model;

    std::map<int, int> cls_map;

    int64 initSeed;
};

class CV_AMLTest : public CV_MLBaseTest
{
public:
    CV_AMLTest( const char* _modelName );
    virtual ~CV_AMLTest() {}
protected:
    virtual int run_test_case( int testCaseIdx );
    virtual int validate_test_results( int testCaseIdx );
};

class CV_SLMLTest : public CV_MLBaseTest
{
public:
    CV_SLMLTest( const char* _modelName );
    virtual ~CV_SLMLTest() {}
protected:
    virtual int run_test_case( int testCaseIdx );
    virtual int validate_test_results( int testCaseIdx );

    std::Array<float> test_resps1, test_resps2; // predicted responses for test data
    std::string fname1, fname2;
};

#endif
