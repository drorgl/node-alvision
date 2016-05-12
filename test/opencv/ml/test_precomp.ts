//#ifdef __GNUC__
//#  pragma GCC diagnostic ignored "-Wmissing-declarations"
//#  if defined __clang__ || defined __APPLE__
//#    pragma GCC diagnostic ignored "-Wmissing-prototypes"
//#    pragma GCC diagnostic ignored "-Wextra"
//#  endif
//#endif
//
//#ifndef __OPENCV_TEST_PRECOMP_HPP__
//#define __OPENCV_TEST_PRECOMP_HPP__
//
//#include <iostream>
//#include <map>
//#include "opencv2/ts.hpp"
//#include "opencv2/ml.hpp"
//#include "opencv2/core/core_c.h"



enum { CV_TRAIN_ERROR=0, CV_TEST_ERROR=1 };

//using alvision.Ptr;
//using alvision.ml::StatModel;
//using alvision.ml::TrainData;
//using alvision.ml::NormalBayesClassifier;
//using alvision.ml::SVM;
//using alvision.ml::KNearest;
//using alvision.ml::ParamGrid;
//using alvision.ml::ANN_MLP;
//using alvision.ml::DTrees;
//using alvision.ml::Boost;
//using alvision.ml::RTrees;

class CV_MLBaseTest  extends alvision.cvtest.BaseTest
{
    constructor(_modelName: string) {
        super();
    }
     read_params(fs : alvision.FileStorage) : alvision.int{}
     void run( int startFrom );
     int prepare_test_case( int testCaseIdx );
     get_validation_filename() : string{}
     int run_test_case( int testCaseIdx ) = 0;
     int validate_test_results( int testCaseIdx ) = 0;

     train(int testCaseIdx ) : alvision.int{
     }
    float get_test_error( int testCaseIdx, Array<float> *resp = 0 );
    void save( const char* filename );
    void load( const char* filename );

    Ptr<TrainData> data;
    std::string modelName, validationFN;
    Array<std::string> dataSetNames;
    alvision.FileStorage validationFS;

    Ptr<StatModel> model;

    std::map<int, int> cls_map;

    int64 initSeed;
};

class CV_AMLTest extends CV_MLBaseTest
{
    constructor(_modelName: string) {
        super();
    }

    virtual int run_test_case(int testCaseIdx );
    virtual int validate_test_results( int testCaseIdx );
};

class CV_SLMLTest extends CV_MLBaseTest
{
    constructor(_modelName: string) {
        super();
    }
    virtual int run_test_case( int testCaseIdx );
    virtual int validate_test_results( int testCaseIdx );

    Array<float> test_resps1, test_resps2; // predicted responses for test data
    protected fname1: string;
    protected fname2: string;
};

//#endif
