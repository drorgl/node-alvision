//TODO: implement!


////#ifdef __GNUC__
////#  pragma GCC diagnostic ignored "-Wmissing-declarations"
////#  if defined __clang__ || defined __APPLE__
////#    pragma GCC diagnostic ignored "-Wmissing-prototypes"
////#    pragma GCC diagnostic ignored "-Wextra"
////#  endif
////#endif
////
////#ifndef __OPENCV_TEST_PRECOMP_HPP__
////#define __OPENCV_TEST_PRECOMP_HPP__
////
////#include <iostream>
////#include <map>
////#include "opencv2/ts.hpp"
////#include "opencv2/ml.hpp"
////#include "opencv2/core/core_c.h"



export enum MLERROR {
    CV_TRAIN_ERROR = 0,
    CV_TEST_ERROR = 1
};

export function CV_BIG_INT(x: number): number {
    return x;
}

export const CV_NBAYES = "nbayes";
export const CV_KNEAREST = "knearest";
export const CV_SVM = "svm";
export const CV_EM = "em";
export const CV_ANN = "ann";
export const CV_DTREE = "dtree";
export const CV_BOOST = "boost";
export const CV_RTREES = "rtrees";
export const CV_ERTREES = "ertrees";



////using alvision.Ptr;
////using alvision.ml::StatModel;
////using alvision.ml::TrainData;
////using alvision.ml::NormalBayesClassifier;
////using alvision.ml::SVM;
////using alvision.ml::KNearest;
////using alvision.ml::ParamGrid;
////using alvision.ml::ANN_MLP;
////using alvision.ml::DTrees;
////using alvision.ml::Boost;
////using alvision.ml::RTrees;




//class CV_SLMLTest extends CV_MLBaseTest
//{
//    constructor(_modelName: string) {
//        super();
//    }
//    virtual int run_test_case( int testCaseIdx );
//    virtual int validate_test_results( int testCaseIdx );

//    Array<float> test_resps1, test_resps2; // predicted responses for test data
//    protected fname1: string;
//    protected fname2: string;
//};

////#endif
