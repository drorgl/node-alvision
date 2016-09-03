//not implemented, external API


//import tape = require("tape");
//import path = require("path");
//
//import async = require("async");
//import alvision = require("../../../tsbinding/alvision");
//import util = require('util');
//import fs = require('fs');


////#include "test_precomp.hpp"
////#include "opencv2/ts/ocl_test.hpp"
////
////#ifdef HAVE_IPP_A
////#include "opencv2/core/ippasync.hpp"
////
////using namespace cv;
////using namespace std;
////using namespace cvtest;
////
//namespace cvtest {
//namespace ocl {



//    //PARAM_TEST_CASE(IPPAsync, MatDepth, Channels, hppAccelType)
//    class IPPAsync extends alvision.cvtest.TestWithParam
//{
//    protected  type : alvision.int;
//    protected cn: alvision.int;
//    protected depth: alvision.int;
//    protected accelType: hppAccelType ;

//    protected matrix: alvision.Mat;
//    protected result : alvision.Mat;
//    protected hppiMatrix * hppMat;
//    protected hppAccel accel;
//    protected hppiVirtualMatrix * virtMatrix;
//    protected hppStatus sts;

//    SetUp() : void
//    {
//        type = alvision.MatrixType.CV_MAKETYPE(GET_PARAM(0), GET_PARAM(1));
//        depth = GET_PARAM(0);
//        cn = GET_PARAM(1);
//        accelType = GET_PARAM(2);
//    }

//    generateTestData() : void
//    {
//        Size matrix_Size = randomSize(2, 100);
//        const double upValue = 100;

//        matrix = alvision.randomMat(matrix_Size, type, -upValue, upValue);
//    }

//    Near(double threshold = 0.0) : void
//    {
//        alvision.EXPECT_MAT_NEAR(matrix, result, threshold);
//    }
//};

//TEST_P(IPPAsync, accuracy)
//{
//    sts = hppCreateInstance(accelType, 0, &accel);
//    if (sts!=HPP_STATUS_NO_ERROR) console.log(util.format("hppStatus = %d\n",sts);
//    alvision.CV_Assert(()=>sts==HPP_STATUS_NO_ERROR);

//    virtMatrix = hppiCreateVirtualMatrices(accel, 2);

//    for (int j = 0; j < test_loop_times; j++)
//    {
//        generateTestData();
//        hppMat = hpp::getHpp(matrix,accel);

//        hppScalar a = 3;

//        sts = hppiAddC(accel, hppMat, a, 0, virtMatrix[0]);
//        alvision.CV_Assert(()=>sts==HPP_STATUS_NO_ERROR);
//        sts = hppiSubC(accel, virtMatrix[0], a, 0, virtMatrix[1]);
//        alvision.CV_Assert(()=>sts==HPP_STATUS_NO_ERROR);

//        sts = hppWait(accel, HPP_TIME_OUT_INFINITE);
//        alvision.CV_Assert(()=>sts==HPP_STATUS_NO_ERROR);

//        result = hpp::getMat(virtMatrix[1], accel, cn);

//        Near(5.0e-6);

//        sts =  hppiFreeMatrix(hppMat);
//        alvision.CV_Assert(()=>sts==HPP_STATUS_NO_ERROR);
//    }

//    sts = hppiDeleteVirtualMatrices(accel, virtMatrix);
//    alvision.CV_Assert(()=>sts==HPP_STATUS_NO_ERROR);
//    sts = hppDeleteInstance(accel);
//    alvision.CV_Assert(()=>sts==HPP_STATUS_NO_ERROR);
//}

//PARAM_TEST_CASE(IPPAsyncShared, Channels, hppAccelType)
//{
//    int cn;
//    int type;
//    hppAccelType accelType;

//    Mat matrix, result;
//    hppiMatrix* hppMat;
//    hppAccel accel;
//    hppiVirtualMatrix * virtMatrix;
//    hppStatus sts;

//    virtual void SetUp()
//    {
//        cn = GET_PARAM(0);
//        accelType = GET_PARAM(1);
//        type = alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_8U, GET_PARAM(0));
//    }

//    virtual void generateTestData()
//    {
//        Size matrix_Size = randomSize(2, 100);
//        hpp32u pitch, size;
//        const int upValue = 100;

//        sts = hppQueryMatrixAllocParams(accel, (hpp32u)(matrix_Size.width*cn), (hpp32u)matrix_Size.height, HPP_DATA_TYPE_8U, &pitch, &size);

//        if (pitch!=0 && size!=0)
//        {
//            uchar *pData = (uchar*)_aligned_malloc(size, 4096);

//            for (int j=0; j<matrix_Size.height; j++)
//                for(int i=0; i<matrix_Size.width*cn; i++)
//                    pData[i+j*pitch] = rand()%upValue;

//            matrix = Mat(matrix_Size.height, matrix_Size.width, type, pData, pitch);
//        }

//        matrix = alvision.randomMat(matrix_Size, type, 0, upValue);
//    }

//    void Near(double threshold = 0.0)
//    {
//        alvision.EXPECT_MAT_NEAR(matrix, result, threshold);
//    }
//};

//TEST_P(IPPAsyncShared, accuracy)
//{
//    sts = hppCreateInstance(accelType, 0, &accel);
//    if (sts!=HPP_STATUS_NO_ERROR) console.log(util.format("hppStatus = %d\n",sts);
//    alvision.CV_Assert(()=>sts==HPP_STATUS_NO_ERROR);

//    virtMatrix = hppiCreateVirtualMatrices(accel, 2);

//    for (int j = 0; j < test_loop_times; j++)
//    {
//        generateTestData();
//        hppMat = hpp::getHpp(matrix,accel);

//        hppScalar a = 3;

//        sts = hppiAddC(accel, hppMat, a, 0, virtMatrix[0]);
//        alvision.CV_Assert(()=>sts==HPP_STATUS_NO_ERROR);
//        sts = hppiSubC(accel, virtMatrix[0], a, 0, virtMatrix[1]);
//        alvision.CV_Assert(()=>sts==HPP_STATUS_NO_ERROR);

//        sts = hppWait(accel, HPP_TIME_OUT_INFINITE);
//        alvision.CV_Assert(()=>sts==HPP_STATUS_NO_ERROR);

//        result = hpp::getMat(virtMatrix[1], accel, cn);

//        Near(0);

//        sts =  hppiFreeMatrix(hppMat);
//        alvision.CV_Assert(()=>sts==HPP_STATUS_NO_ERROR);
//    }

//    sts = hppiDeleteVirtualMatrices(accel, virtMatrix);
//    alvision.CV_Assert(()=>sts==HPP_STATUS_NO_ERROR);
//    sts = hppDeleteInstance(accel);
//    alvision.CV_Assert(()=>sts==HPP_STATUS_NO_ERROR);
//}

//INSTANTIATE_TEST_CASE_P(IppATest, IPPAsyncShared, Combine(Values(1, 2, 3, 4),
//                                                    Values( HPP_ACCEL_TYPE_CPU, HPP_ACCEL_TYPE_GPU)));

//INSTANTIATE_TEST_CASE_P(IppATest, IPPAsync, Combine(Values(alvision.MatrixType.CV_8U, alvision.MatrixType.CV_16U, alvision.MatrixType.CV_16S, alvision.MatrixType.CV_32F),
//                                                   Values(1, 2, 3, 4),
//                                                   Values( HPP_ACCEL_TYPE_CPU, HPP_ACCEL_TYPE_GPU)));

//}
//}
//#endif