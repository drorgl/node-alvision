//TODO: implement!

///*M///////////////////////////////////////////////////////////////////////////////////////
////
////  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
////
////  By downloading, copying, installing or using the software you agree to this license.
////  If you do not agree to this license, do not download, install,
////  copy or use the software.
////
////
////                           License Agreement
////                For Open Source Computer Vision Library
////
//// Copyright (C) 2013, OpenCV Foundation, all rights reserved.
//// Third party copyrights are property of their respective owners.
////
//// Redistribution and use in source and binary forms, with or without modification,
//// are permitted provided that the following conditions are met:
////
////   * Redistribution's of source code must retain the above copyright notice,
////     this list of conditions and the following disclaimer.
////
////   * Redistribution's in binary form must reproduce the above copyright notice,
////     this list of conditions and the following disclaimer in the documentation
////     and/or other materials provided with the distribution.
////
////   * The name of the copyright holders may not be used to endorse or promote products
////     derived from this software without specific prior written permission.
////
//// This software is provided by the copyright holders and contributors "as is" and
//// any express or implied warranties, including, but not limited to, the implied
//// warranties of merchantability and fitness for a particular purpose are disclaimed.
//// In no event shall the OpenCV Foundation or contributors be liable for any direct,
//// indirect, incidental, special, exemplary, or consequential damages
//// (including, but not limited to, procurement of substitute goods or services;
//// loss of use, data, or profits; or business interruption) however caused
//// and on any theory of liability, whether in contract, strict liability,
//// or tort (including negligence or otherwise) arising in any way out of
//// the use of this software, even if advised of the possibility of such damage.
////
////M*/

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
////using namespace cvtest;
////using namespace testing;
////using namespace cv;
////
//namespace cvtest {
//namespace ocl {

////#define UMAT_TEST_SIZES testing::Values(alvision.Size(1, 1), alvision.Size(1,128), alvision.Size(128, 1), \
////    alvision.Size(128, 128), alvision.Size(640, 480), alvision.Size(751, 373), alvision.Size(1200, 1200))

///////////////////////////////// Basic Tests ////////////////////////////////

//    //PARAM_TEST_CASE(UMatBasicTests, int, int, Size, bool)
//    class UMatBasicTests extends alvision.cvtest.TestWithParam {
//        constructor() {
//            super();
//        }


//        protected a: alvision.Mat;
//        protected ua: alvision.UMat;
//        protected type: alvision.int;
//        protected depth: alvision.int;
//        protected cn: alvision.int;
//        protected size: alvision.Size;
//        protected useRoi: boolean;
//        protected roi_size: alvision.Size;
//        protected roi: alvision.Rect;

//        SetUp(): void {
//            this.depth = this.GET_PARAM<alvision.int>(0);
//            this.cn = this.GET_PARAM<alvision.int>(1);
//            this.size =   this.GET_PARAM<alvision.Size>(2);
//            this.useRoi = this.GET_PARAM<boolean>(3);
//            this.type = alvision.MatrixType.CV_MAKETYPE(depth, cn);
//            this.a = alvision.cvtest.randomMat(size, type, -100, 100);
//            this.a.copyTo(ua);
//            var roi_shift_x = alvision.cvtest.randomInt(0, this.size.width .valueOf()- 1);
//            var roi_shift_y = alvision.cvtest.randomInt(0, this.size.height.valueOf() - 1);
//            this.roi_size = new alvision.Size(this.size.width.valueOf() - roi_shift_x, this.size.height.valueOf() - roi_shift_y);
//            this.roi = new alvision.Rect(roi_shift_x, roi_shift_y, this.roi_size.width, this.roi_size.height);
//        }
//    }



////alvision.cvtest.TEST_P('UMatBasicTests', 'createUMat',()=>
//    class UMatBasicTests_createUMat extends UMatBasicTests {
//        public createUMat(): void {
//            if (this.useRoi) {
//                this.ua = new alvision.UMat(this.ua, this.roi);
//            }
//            var dims = this.randomInt(2, 6);
//            //int _sz[CV_MAX_DIM];
//            var sz = new Array<alvision.int>();
//            for (var i = 0; i < dims; i++)
//            {
//                sz[i] = this.randomInt(1, 50);
//            }
//            //int * sz = _sz;
//            var new_depth = this.randomInt(alvision.MatrixType.CV_8S, alvision.MatrixType.CV_64F);
//            var new_cn = this.randomInt(1, 4);
//            this.ua.create(dims, sz, alvision.MatrixType.CV_MAKETYPE(new_depth, new_cn));

//            for (var i = 0; i < dims; i++)
//            {
//                alvision.ASSERT_EQ(this.ua.size[i], sz[i]);
//            }
//            alvision.ASSERT_EQ(this.ua.dims, dims);
//            alvision.ASSERT_EQ(this.ua.type(), alvision.MatrixType.CV_MAKETYPE(new_depth, new_cn));
//            Size new_size = randomSize(1, 1000);
//            ua.create(new_size, alvision.MatrixType.CV_MAKETYPE(new_depth, new_cn));
//            alvision.ASSERT_EQ(ua.size(), new_size);
//            alvision.ASSERT_EQ(ua.type(), alvision.MatrixType.CV_MAKETYPE(new_depth, new_cn));
//            alvision.ASSERT_EQ(ua.dims, 2);
//        }
//    }

//    alvision.cvtest.TEST('UMatBasicTests', 'createUMat', () => { var test = new UMatBasicTests_createUMat(); test.createUMat(); });

//    alvision.cvtest.TEST_P('UMatBasicTests', 'swap',()=>
//{
//    Mat b = alvision.randomMat(size, type, -100, 100);
//    UMat ub;
//    b.copyTo(ub);
//    if(useRoi)
//    {
//        ua = UMat(ua,roi);
//        ub = UMat(ub,roi);
//    }
//    UMat uc = ua, ud = ub;
//    swap(ua,ub);
//    alvision.EXPECT_MAT_NEAR(ub,uc, 0);
//    alvision.EXPECT_MAT_NEAR(ud, ua, 0);
//    });

//    alvision.cvtest.TEST_P('UMatBasicTests', 'base',()=>
//{
//    const int align_mask = 3;
//    roi.x &= ~align_mask;
//    roi.y &= ~align_mask;
//    roi.width = (roi.width + align_mask) & ~align_mask;
//    roi &= Rect(0, 0, ua.cols, ua.rows);

//    if(useRoi)
//    {
//        ua = UMat(ua,roi);
//    }
//    UMat ub = ua.clone();
//    alvision.EXPECT_MAT_NEAR(ub,ua,0);

//    ASSERT_EQ(ua.channels(), cn);
//    ASSERT_EQ(ua.depth(), depth);
//    ASSERT_EQ(ua.type(), type);
//    ASSERT_EQ(ua.elemSize(), a.elemSize());
//    ASSERT_EQ(ua.elemSize1(), a.elemSize1());
//    ASSERT_EQ(ub.empty(), ub.cols*ub.rows == 0);
//    ub.release();
//    ASSERT_TRUE( ub.empty() );
//    if(useRoi && a.size() != ua.size())
//    {
//        ASSERT_EQ(ua.isSubmatrix(), true);
//    }
//    else
//    {
//        ASSERT_EQ(ua.isSubmatrix(), false);
//    }

//    int dims = randomInt(2,6);
//    int sz[CV_MAX_DIM];
//    size_t total = 1;
//    for(int i = 0; i<dims; i++)
//    {
//        sz[i] = randomInt(1,45);
//        total *= (size_t)sz[i];
//    }
//    int new_type = alvision.MatrixType.CV_MAKETYPE(randomInt(alvision.MatrixType.CV_8S, alvision.MatrixType.CV_64F),randomInt(1,4));
//    ub = UMat(dims, sz, new_type);
//    ASSERT_EQ(ub.total(), total);
//});

//alvision.cvtest.TEST_P('UMatBasicTests', 'DISABLED_copyTo', () => {
//    UMat roi_ua;
//    Mat roi_a;
//    int i;
//    if (useRoi) {
//        roi_ua = UMat(ua, roi);
//        roi_a = Mat(a, roi);
//        roi_a.copyTo(roi_ua);
//        alvision.EXPECT_MAT_NEAR(roi_a, roi_ua, 0);
//        roi_ua.copyTo(roi_a);
//        alvision.EXPECT_MAT_NEAR(roi_ua, roi_a, 0);
//        roi_ua.copyTo(ua);
//        alvision.EXPECT_MAT_NEAR(roi_ua, ua, 0);
//        ua.copyTo(a);
//        alvision.EXPECT_MAT_NEAR(ua, a, 0);
//    }
//    {
//        UMat ub;
//        ua.copyTo(ub);
//        alvision.EXPECT_MAT_NEAR(ua, ub, 0);
//    }
//    {
//        UMat ub;
//        i = randomInt(0, ua.cols - 1);
//        a.col(i).copyTo(ub);
//        alvision.EXPECT_MAT_NEAR(a.col(i), ub, 0);
//    }
//    {
//        UMat ub;
//        ua.col(i).copyTo(ub);
//        alvision.EXPECT_MAT_NEAR(ua.col(i), ub, 0);
//    }
//    {
//        Mat b;
//        ua.col(i).copyTo(b);
//        alvision.EXPECT_MAT_NEAR(ua.col(i), b, 0);
//    }
//    {
//        UMat ub;
//        i = randomInt(0, a.rows - 1);
//        ua.row(i).copyTo(ub);
//        alvision.EXPECT_MAT_NEAR(ua.row(i), ub, 0);
//    }
//    {
//        UMat ub;
//        a.row(i).copyTo(ub);
//        alvision.EXPECT_MAT_NEAR(a.row(i), ub, 0);
//    }
//    {
//        Mat b;
//        ua.row(i).copyTo(b);
//        alvision.EXPECT_MAT_NEAR(ua.row(i), b, 0);
//    }
//});

//alvision.cvtest.TEST_P('UMatBasicTests', 'DISABLED_GetUMat', () => {
//    if (useRoi) {
//        a = Mat(a, roi);
//        ua = UMat(ua, roi);
//    }
//    {
//        UMat ub;
//        ub = a.getUMat(ACCESS_RW);
//        alvision.EXPECT_MAT_NEAR(ub, ua, 0);
//    }
//    {
//        Mat b;
//        b = a.getUMat(ACCESS_RW).getMat(ACCESS_RW);
//        alvision.EXPECT_MAT_NEAR(b, a, 0);
//    }
//    {
//        Mat b;
//        b = ua.getMat(ACCESS_RW);
//        alvision.EXPECT_MAT_NEAR(b, a, 0);
//    }
//    {
//        UMat ub;
//        ub = ua.getMat(ACCESS_RW).getUMat(ACCESS_RW);
//        alvision.EXPECT_MAT_NEAR(ub, ua, 0);
//    }
//});

//    INSTANTIATE_TEST_CASE_P(UMat, UMatBasicTests, Combine(testing::Values(alvision.MatrixType.CV_8U), testing::Values(1, 2),
//    testing::Values(alvision.Size(1, 1), alvision.Size(1, 128), alvision.Size(128, 1), alvision.Size(128, 128), alvision.Size(640, 480)), Bool()));


////TBD!

//////////////////////////////////////////////////////////////////// Reshape ////////////////////////////////////////////////////////////////////////

////PARAM_TEST_CASE(UMatTestReshape,  int, int, Size, bool)
////{
////    Mat a;
////    UMat ua, ub;
////    int type;
////    int depth;
////    int cn;
////    Size size;
////    bool useRoi;
////    Size roi_size;
////    virtual void SetUp()
////    {
////        depth = GET_PARAM(0);
////        cn = GET_PARAM(1);
////        size = GET_PARAM(2);
////        useRoi = GET_PARAM(3);
////        type = alvision.MatrixType.CV_MAKETYPE(depth, cn);
////    }
////};

////alvision.cvtest.TEST_P(UMatTestReshape, DISABLED_reshape)
////{
////    a = alvision.randomMat(size,type, -100, 100);
////    a.copyTo(ua);
////    if(useRoi)
////    {
////        int roi_shift_x = randomInt(0, size.width-1);
////        int roi_shift_y = randomInt(0, size.height-1);
////        roi_size = Size(size.width - roi_shift_x, size.height - roi_shift_y);
////        Rect roi(roi_shift_x, roi_shift_y, roi_size.width, roi_size.height);
////        ua = UMat(ua, roi).clone();
////        a = Mat(a, roi).clone();
////    }

////    int nChannels = randomInt(1,4);

////    if ((ua.cols*ua.channels()*ua.rows)%nChannels != 0)
////    {
////        EXPECT_ANY_THROW(ua.reshape(nChannels));
////    }
////    else
////    {
////        ub = ua.reshape(nChannels);
////        ASSERT_EQ(ub.channels(),nChannels);
////        ASSERT_EQ(ub.channels()*ub.cols*ub.rows, ua.channels()*ua.cols*ua.rows);

////        alvision.EXPECT_MAT_NEAR(ua.reshape(nChannels), a.reshape(nChannels), 0);

////        int new_rows = randomInt(1, INT_MAX);
////        if ( ((int)ua.total()*ua.channels())%(new_rows*nChannels) != 0)
////        {
////            EXPECT_ANY_THROW (ua.reshape(nChannels, new_rows) );
////        }
////        else
////        {
////            EXPECT_NO_THROW ( ub = ua.reshape(nChannels, new_rows) );
////            ASSERT_EQ(ub.channels(),nChannels);
////            ASSERT_EQ(ub.rows, new_rows);
////            ASSERT_EQ(ub.channels()*ub.cols*ub.rows, ua.channels()*ua.cols*ua.rows);

////            alvision.EXPECT_MAT_NEAR(ua.reshape(nChannels,new_rows), a.reshape(nChannels,new_rows), 0);
////        }

////        new_rows = (int)ua.total()*ua.channels()/(nChannels*randomInt(1, size.width*size.height));
////        if (new_rows == 0) new_rows = 1;
////        int new_cols = (int)ua.total()*ua.channels()/(new_rows*nChannels);
////        int sz[] = {new_rows, new_cols};
////        if( ((int)ua.total()*ua.channels()) % (new_rows*new_cols) != 0 )
////        {
////            EXPECT_ANY_THROW( ua.reshape(nChannels, ua.dims, sz) );
////        }
////        else
////        {
////            EXPECT_NO_THROW ( ub = ua.reshape(nChannels, ua.dims, sz) );
////            ASSERT_EQ(ub.channels(),nChannels);
////            ASSERT_EQ(ub.rows, new_rows);
////            ASSERT_EQ(ub.cols, new_cols);
////            ASSERT_EQ(ub.channels()*ub.cols*ub.rows, ua.channels()*ua.cols*ua.rows);

////            alvision.EXPECT_MAT_NEAR(ua.reshape(nChannels, ua.dims, sz), a.reshape(nChannels, a.dims, sz), 0);
////        }
////    }
////}

////INSTANTIATE_TEST_CASE_P(UMat, UMatTestReshape, Combine(OCL_ALL_DEPTHS, OCL_ALL_CHANNELS, UMAT_TEST_SIZES, Bool() ));

////////////////////////////////////////////////////////////////////// ROI testing ///////////////////////////////////////////////////////////////

////PARAM_TEST_CASE(UMatTestRoi, int, int, Size)
////{
////    Mat a, roi_a;
////    UMat ua, roi_ua;
////    int type;
////    int depth;
////    int cn;
////    Size size;
////    Size roi_size;
////    virtual void SetUp()
////    {
////        depth = GET_PARAM(0);
////        cn = GET_PARAM(1);
////        size = GET_PARAM(2);
////        type = alvision.MatrixType.CV_MAKETYPE(depth, cn);
////    }
////};

////alvision.cvtest.TEST_P(UMatTestRoi, createRoi)
////{
////    int roi_shift_x = randomInt(0, size.width-1);
////    int roi_shift_y = randomInt(0, size.height-1);
////    roi_size = Size(size.width - roi_shift_x, size.height - roi_shift_y);
////    a = alvision.randomMat(size, type, -100, 100);
////    Rect roi(roi_shift_x, roi_shift_y, roi_size.width, roi_size.height);
////    roi_a = Mat(a, roi);
////    a.copyTo(ua);
////    roi_ua = UMat(ua, roi);

////    alvision.EXPECT_MAT_NEAR(roi_a, roi_ua, 0);
////}

////alvision.cvtest.TEST_P(UMatTestRoi, locateRoi)
////{
////    int roi_shift_x = randomInt(0, size.width-1);
////    int roi_shift_y = randomInt(0, size.height-1);
////    roi_size = Size(size.width - roi_shift_x, size.height - roi_shift_y);
////    a = alvision.randomMat(size, type, -100, 100);
////    Rect roi(roi_shift_x, roi_shift_y, roi_size.width, roi_size.height);
////    roi_a = Mat(a, roi);
////    a.copyTo(ua);
////    roi_ua = UMat(ua,roi);
////    Size sz, usz;
////    Point p, up;
////    roi_a.locateROI(sz, p);
////    roi_ua.locateROI(usz, up);
////    ASSERT_EQ(sz, usz);
////    ASSERT_EQ(p, up);
////}

////alvision.cvtest.TEST_P(UMatTestRoi, adjustRoi)
////{
////    int roi_shift_x = randomInt(0, size.width-1);
////    int roi_shift_y = randomInt(0, size.height-1);
////    roi_size = Size(size.width - roi_shift_x, size.height - roi_shift_y);
////    a = alvision.randomMat(size, type, -100, 100);
////    Rect roi(roi_shift_x, roi_shift_y, roi_size.width, roi_size.height);
////    a.copyTo(ua);
////    roi_ua = UMat( ua, roi);
////    int adjLeft = randomInt(-(roi_ua.cols/2), (size.width-1)/2);
////    int adjRight = randomInt(-(roi_ua.cols/2), (size.width-1)/2);
////    int adjTop = randomInt(-(roi_ua.rows/2), (size.height-1)/2);
////    int adjBot = randomInt(-(roi_ua.rows/2), (size.height-1)/2);
////    roi_ua.adjustROI(adjTop, adjBot, adjLeft, adjRight);
////    roi_shift_x = Math.max(0, roi.x-adjLeft);
////    roi_shift_y = Math.max(0, roi.y-adjTop);
////    Rect new_roi( roi_shift_x, roi_shift_y, Math.min(roi.width+adjRight+adjLeft, size.width-roi_shift_x), Math.min(roi.height+adjBot+adjTop, size.height-roi_shift_y) );
////    UMat test_roi = UMat(ua, new_roi);
////    alvision.EXPECT_MAT_NEAR(roi_ua, test_roi, 0);
////}

////INSTANTIATE_TEST_CASE_P(UMat, UMatTestRoi, Combine(OCL_ALL_DEPTHS, OCL_ALL_CHANNELS, UMAT_TEST_SIZES ));

/////////////////////////////////////////////////////////////////// Size ////////////////////////////////////////////////////////////////////

////PARAM_TEST_CASE(UMatTestSizeOperations, int, int, Size, bool)
////{
////    Mat a, b, roi_a, roi_b;
////    UMat ua, ub, roi_ua, roi_ub;
////    int type;
////    int depth;
////    int cn;
////    Size size;
////    Size roi_size;
////    bool useRoi;
////    virtual void SetUp()
////    {
////        depth = GET_PARAM(0);
////        cn = GET_PARAM(1);
////        size = GET_PARAM(2);
////        useRoi = GET_PARAM(3);
////        type = alvision.MatrixType.CV_MAKETYPE(depth, cn);
////    }
////};

////alvision.cvtest.TEST_P(UMatTestSizeOperations, copySize)
////{
////    Size s = randomSize(1,300);
////    a = alvision.randomMat(size, type, -100, 100);
////    b = alvision.randomMat(s, type, -100, 100);
////    a.copyTo(ua);
////    b.copyTo(ub);
////    if(useRoi)
////    {
////        int roi_shift_x = randomInt(0, size.width-1);
////        int roi_shift_y = randomInt(0, size.height-1);
////        roi_size = Size(size.width - roi_shift_x, size.height - roi_shift_y);
////        Rect roi(roi_shift_x, roi_shift_y, roi_size.width, roi_size.height);
////        ua = UMat(ua,roi);

////        roi_shift_x = randomInt(0, s.width-1);
////        roi_shift_y = randomInt(0, s.height-1);
////        roi_size = Size(s.width - roi_shift_x, s.height - roi_shift_y);
////        roi = Rect(roi_shift_x, roi_shift_y, roi_size.width, roi_size.height);
////        ub = UMat(ub, roi);
////    }
////    ua.copySize(ub);
////    ASSERT_EQ(ua.size, ub.size);
////}

////INSTANTIATE_TEST_CASE_P(UMat, UMatTestSizeOperations, Combine(OCL_ALL_DEPTHS, OCL_ALL_CHANNELS, UMAT_TEST_SIZES, Bool() ));

///////////////////////////////////////////////////////////////////// UMat operations ////////////////////////////////////////////////////////////////////////////

////PARAM_TEST_CASE(UMatTestUMatOperations, int, int, Size, bool)
////{
////    Mat a, b;
////    UMat ua, ub;
////    int type;
////    int depth;
////    int cn;
////    Size size;
////    Size roi_size;
////    bool useRoi;
////    virtual void SetUp()
////    {
////        depth = GET_PARAM(0);
////        cn = GET_PARAM(1);
////        size = GET_PARAM(2);
////        useRoi = GET_PARAM(3);
////        type = alvision.MatrixType.CV_MAKETYPE(depth, cn);
////    }
////};

////alvision.cvtest.TEST_P(UMatTestUMatOperations, diag)
////{
////    a = alvision.randomMat(size, type, -100, 100);
////    a.copyTo(ua);
////    Mat new_diag;
////    if(useRoi)
////    {
////        int roi_shift_x = randomInt(0, size.width-1);
////        int roi_shift_y = randomInt(0, size.height-1);
////        roi_size = Size(size.width - roi_shift_x, size.height - roi_shift_y);
////        Rect roi(roi_shift_x, roi_shift_y, roi_size.width, roi_size.height);
////        ua = UMat(ua,roi);
////        a = Mat(a, roi);
////    }
////    int n = randomInt(0, ua.cols-1);
////    ub = ua.diag(n);
////    b = a.diag(n);
////    alvision.EXPECT_MAT_NEAR(b, ub, 0);
////    new_diag = alvision.randomMat(Size(ua.rows, 1), type, -100, 100);
////    new_diag.copyTo(ub);
////    ua = alvision.UMat::diag(ub);
////    alvision.EXPECT_MAT_NEAR(ua.diag(), new_diag.t(), 0);
////}

////INSTANTIATE_TEST_CASE_P(UMat, UMatTestUMatOperations, Combine(OCL_ALL_DEPTHS, OCL_ALL_CHANNELS, UMAT_TEST_SIZES, Bool()));

///////////////////////////////////////////////////////////////////// OpenCL ////////////////////////////////////////////////////////////////////////////

////alvision.cvtest.TEST(UMat, BufferPoolGrowing)
////{
////#ifdef _DEBUG
////    const int ITERATIONS = 100;
////#else
////    const int ITERATIONS = 200;
////#endif
////    const Size sz(1920, 1080);
////    BufferPoolController* c = alvision.ocl::getOpenCLAllocator().getBufferPoolController();
////    if (c)
////    {
////        size_t oldMaxReservedSize = c.getMaxReservedSize();
////        c.freeAllReservedBuffers();
////        c.setMaxReservedSize(sz.area() * 10);
////        for (let i = 0; i < ITERATIONS; i++)
////        {
////            UMat um(Size(sz.width + i, sz.height + i), CV_8UC1);
////            UMat um2(Size(sz.width + 2 * i, sz.height + 2 * i), CV_8UC1);
////        }
////        c.setMaxReservedSize(oldMaxReservedSize);
////        c.freeAllReservedBuffers();
////    }
////    else
////        console.log("Skipped, no OpenCL" << std::endl;
////}

////class CV_UMatTest :
////        public alvision.cvtest.BaseTest
////{
////public:
////    CV_UMatTest() {}
////    ~CV_UMatTest() {}
////protected:
////    void run(int);

////    struct test_excep
////    {
////        test_excep(const string& _s=string("")) : s(_s) { }
////        string s;
////    };

////    bool TestUMat();

////    void checkDiff(const Mat& m1, const Mat& m2, const string& s)
////    {
////        if (alvision.cvtest.norm(m1, m2, NORM_INF) != 0)
////            throw test_excep(s);
////    }
////    void checkDiffF(const Mat& m1, const Mat& m2, const string& s)
////    {
////        if (alvision.cvtest.norm(m1, m2, NORM_INF) > 1e-5)
////            throw test_excep(s);
////    }
////};

////#define STR(a) STR2(a)
////#define STR2(a) #a

////#define CHECK_DIFF(a, b) checkDiff(a, b, "(" #a ")  !=  (" #b ")  at l." STR(__LINE__))
////#define CHECK_DIFF_FLT(a, b) checkDiffF(a, b, "(" #a ")  !=(eps)  (" #b ")  at l." STR(__LINE__))


////bool CV_UMatTest::TestUMat()
////{
////    try
////    {
////        Mat a(100, 100, CV_16SC2), b, c;
////        randu(a, Scalar.all(-100), Scalar.all(100));
////        Rect roi(1, 3, 5, 4);
////        Mat ra(a, roi), rb, rc, rc0;
////        UMat ua, ura, ub, urb, uc, urc;
////        a.copyTo(ua);
////        ua.copyTo(b);
////        CHECK_DIFF(a, b);

////        ura = ua(roi);
////        ura.copyTo(rb);

////        CHECK_DIFF(ra, rb);

////        ra += Scalar.all(1.f);
////        {
////            Mat temp = ura.getMat(ACCESS_RW);
////            temp += Scalar.all(1.f);
////        }
////        ra.copyTo(rb);
////        CHECK_DIFF(ra, rb);

////        b = a.clone();
////        ra = a(roi);
////        rb = b(roi);
////        randu(b, Scalar.all(-100), Scalar.all(100));
////        b.copyTo(ub);
////        urb = ub(roi);

////        /*console.log("==============================================\nbefore op (CPU):\n";
////        console.log("ra: " << ra << std::endl;
////        console.log("rb: " << rb << std::endl;*/

////        ra.copyTo(ura);
////        rb.copyTo(urb);
////        ra.release();
////        rb.release();
////        ura.copyTo(ra);
////        urb.copyTo(rb);

////        /*console.log("==============================================\nbefore op (GPU):\n";
////        console.log("ra: " << ra << std::endl;
////        console.log("rb: " << rb << std::endl;*/

////        alvision.max(ra, rb, rc);
////        alvision.max(ura, urb, urc);
////        urc.copyTo(rc0);

////        /*console.log("==============================================\nafter op:\n";
////        console.log("rc: " << rc << std::endl;
////        console.log("rc0: " << rc0 << std::endl;*/

////        CHECK_DIFF(rc0, rc);

////        {
////            UMat tmp = rc0.getUMat(ACCESS_WRITE);
////            alvision.max(ura, urb, tmp);
////        }
////        CHECK_DIFF(rc0, rc);

////        ura.copyTo(urc);
////        alvision.max(urc, urb, urc);
////        urc.copyTo(rc0);
////        CHECK_DIFF(rc0, rc);

////        rc = ra ^ rb;
////        alvision.bitwise_xor(ura, urb, urc);
////        urc.copyTo(rc0);

////        /*console.log("==============================================\nafter op:\n";
////        console.log("ra: " << rc0 << std::endl;
////        console.log("rc: " << rc << std::endl;*/

////        CHECK_DIFF(rc0, rc);

////        rc = ra + rb;
////        alvision.add(ura, urb, urc);
////        urc.copyTo(rc0);

////        CHECK_DIFF(rc0, rc);

////        alvision.subtract(ra, Scalar.all(5), rc);
////        alvision.subtract(ura, Scalar.all(5), urc);
////        urc.copyTo(rc0);

////        CHECK_DIFF(rc0, rc);
////    }
////    catch(e)
////    {
////        ts.printf(alvision.cvtest.TSConstants.LOG, "%s\n", e.s);
////        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
////        return false;
////    }
////    return true;
////}

////void CV_UMatTest::run( int /* start_from */)
////{
////    console.log(util.format("Use OpenCL: %s\nHave OpenCL: %s\n",
////           alvision.ocl::useOpenCL() ? "TRUE" : "FALSE",
////           alvision.ocl::haveOpenCL() ? "TRUE" : "FALSE" );

////    if (!TestUMat())
////        return;

////    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
////}

////alvision.cvtest.TEST(Core_UMat, base) { CV_UMatTest test; test.safe_run(); }

////alvision.cvtest.TEST(Core_UMat, getUMat)
////{
////    {
////        int a[3] = { 1, 2, 3 };
////        Mat m = Mat(1, 1, CV_32SC3, a);
////        UMat u = m.getUMat(ACCESS_READ);
////        alvision.EXPECT_NE((void*)NULL, u.u);
////    }

////    {
////        Mat m(10, 10, CV_8UC1), ref;
////        for (let y = 0; y < m.rows; ++y)
////        {
////            uchar * const ptr = m.ptr<uchar>(y);
////            for (let x = 0; x < m.cols; ++x)
////                ptr[x] = (uchar)(x + y * 2);
////        }

////        ref = m.clone();
////        Rect r(1, 1, 8, 8);
////        ref(r).setTo(17);

////        {
////            UMat um = m(r).getUMat(ACCESS_WRITE);
////            um.setTo(17);
////        }

////        double err = alvision.cvtest.norm(m, ref, NORM_INF);
////        if (err > 0)
////        {
////            console.log("m: " << std::endl << m << std::endl;
////            console.log("ref: " << std::endl << ref << std::endl;
////        }
////        alvision.EXPECT_EQ(0., err);
////    }
////}

////alvision.cvtest.TEST(UMat, Sync)
////{
////    UMat um(10, 10, CV_8UC1);

////    {
////        Mat m = um.getMat(ACCESS_WRITE);
////        m.setTo(alvision.Scalar.all(17));
////    }

////    um.setTo(alvision.Scalar.all(19));

////    alvision.EXPECT_EQ(0, alvision.cvtest.norm(um.getMat(ACCESS_READ), alvision.Mat(um.size(), um.type(), 19), NORM_INF));
////}

////alvision.cvtest.TEST(UMat, CopyToIfDeviceCopyIsObsolete)
////{
////    UMat um(7, 2, CV_8UC1);
////    Mat m(um.size(), um.type());
////    m.setTo(alvision.Scalar.all(0));

////    {
////        // make obsolete device copy of UMat
////        Mat temp = um.getMat(ACCESS_WRITE);
////        temp.setTo(Scalar.all(10));
////    }

////    m.copyTo(um);
////    um.setTo(Scalar.all(17));

////    alvision.EXPECT_EQ(0, alvision.cvtest.norm(um.getMat(ACCESS_READ), Mat(um.size(), um.type(), 17), NORM_INF));
////}

////alvision.cvtest.TEST(UMat, setOpenCL)
////{
////    // save the current state
////    bool useOCL = alvision.ocl::useOpenCL();

////    Mat m = (Mat_<uchar>(3,3)<<0,1,2,3,4,5,6,7,8);

////    alvision.ocl::setUseOpenCL(true);
////    UMat um1;
////    m.copyTo(um1);

////    alvision.ocl::setUseOpenCL(false);
////    UMat um2;
////    m.copyTo(um2);

////    alvision.ocl::setUseOpenCL(true);
////    countNonZero(um1);
////    countNonZero(um2);

////    um1.copyTo(um2);
////    alvision.EXPECT_MAT_NEAR(um1, um2, 0);
////    alvision.EXPECT_MAT_NEAR(um1, m, 0);
////    um2.copyTo(um1);
////    alvision.EXPECT_MAT_NEAR(um1, m, 0);
////    alvision.EXPECT_MAT_NEAR(um1, um2, 0);

////    alvision.ocl::setUseOpenCL(false);
////    countNonZero(um1);
////    countNonZero(um2);

////    um1.copyTo(um2);
////    alvision.EXPECT_MAT_NEAR(um1, um2, 0);
////    alvision.EXPECT_MAT_NEAR(um1, m, 0);
////    um2.copyTo(um1);
////    alvision.EXPECT_MAT_NEAR(um1, um2, 0);
////    alvision.EXPECT_MAT_NEAR(um1, m, 0);

////    // reset state to the previous one
////    alvision.ocl::setUseOpenCL(useOCL);
////}

////alvision.cvtest.TEST(UMat, ReadBufferRect)
////{
////    UMat m(1, 10000, CV_32FC2, Scalar.all(-1));
////    Mat t(1, 9000, CV_32FC2, Scalar.all(-200)), t2(1, 9000, CV_32FC2, Scalar.all(-1));
////    m.colRange(0, 9000).copyTo(t);

////    alvision.EXPECT_MAT_NEAR(t, t2, 0);
////}

////// Use iGPU or OPENCV_OPENCL_DEVICE=:CPU: to catch problem
////alvision.cvtest.TEST(UMat, DISABLED_synchronization_map_unmap)
////{
////    class TestParallelLoopBody extends alvision.ParallelLoopBody
////    {
////        UMat u_;
////    public:
////        TestParallelLoopBody(const UMat& u) : u_(u) { }
////        void operator() (const alvision.Range& range) const
////        {
////            console.log(util.format("range: %d, %d -- begin\n", range.start, range.end);
////            for (let i = 0; i < 10; i++)
////            {
////                console.log(util.format("%d: %d map...\n", range.start, i);
////                Mat m = u_.getMat(alvision.ACCESS_READ);

////                console.log(util.format("%d: %d unmap...\n", range.start, i);
////                m.release();
////            }
////            console.log(util.format("range: %d, %d -- end\n", range.start, range.end);
////        }
////    };
////    try
////    {
////        UMat u(1000, 1000, CV_32FC1);
////        parallel_for_(alvision.Range(0, 2), TestParallelLoopBody(u));
////    }
////    catch(e)
////    {
////        FAIL() << "Exception: " << e.what();
////        ADD_FAILURE();
////    }
////    catch(e)
////    {
////        FAIL() << "Exception!";
////    }
////}

//} } // namespace alvision.cvtest.ocl

////alvision.cvtest.TEST(UMat, DISABLED_bug_with_unmap)
////{
////    for (let i = 0; i < 20; i++)
////    {
////        try
////        {
////            Mat m = Mat(1000, 1000, CV_8UC1);
////            UMat u = m.getUMat(ACCESS_READ);
////            UMat dst;
////            add(u, alvision.Scalar.all(0), dst); // start async operation
////            u.release();
////            m.release();
////        }
////        catch(e)
////        {
////            console.log(util.format("i = %d... %s\n", i, e.what());
////            ADD_FAILURE();
////        }
////        catch(e)
////        {
////            console.log(util.format("i = %d...\n", i);
////            ADD_FAILURE();
////        }
////    }
////}

////alvision.cvtest.TEST(UMat, DISABLED_bug_with_unmap_in_class)
////{
////    class Logic
////    {
////    public:
////        Logic() {}
////        void processData(InputArray input)
////        {
////            Mat m = input.getMat();
////            {
////                Mat dst;
////                m.convertTo(dst, CV_32FC1);
////                // some additional CPU-based per-pixel processing into dst
////                intermediateResult = dst.getUMat(ACCESS_READ);
////                console.log("data processed..." << std::endl;
////            } // problem is here: dst::~Mat()
////            console.log("leave ProcessData()" << std::endl;
////        }
////        UMat getResult() const { return intermediateResult; }
////    protected:
////        UMat intermediateResult;
////    };
////    try
////    {
////        Mat m = Mat(1000, 1000, CV_8UC1);
////        Logic l;
////        l.processData(m);
////        UMat result = l.getResult();
////    }
////    catch(e)
////    {
////        console.log(util.format("exception... %s\n", e.what());
////        ADD_FAILURE();
////    }
////    catch (e)
////    {
////        console.log(util.format("exception... \n");
////        ADD_FAILURE();
////    }
////}

////alvision.cvtest.TEST(UMat, Test_same_behaviour_read_and_read)
////{
////    bool exceptionDetected = false;
////    try
////    {
////        UMat u(Size(10, 10), CV_8UC1);
////        Mat m = u.getMat(ACCESS_READ);
////        UMat dst;
////        add(u, Scalar.all(1), dst);
////    }
////    catch(e)
////    {
////        exceptionDetected = true;
////    }
////    ASSERT_FALSE(exceptionDetected); // no data race, 2+ reads are valid
////}

////// VP: this test (and probably others from same_behaviour series) is not valid in my opinion.
////alvision.cvtest.TEST(UMat, DISABLED_Test_same_behaviour_read_and_write)
////{
////    bool exceptionDetected = false;
////    try
////    {
////        UMat u(Size(10, 10), CV_8UC1);
////        Mat m = u.getMat(ACCESS_READ);
////        add(u, Scalar.all(1), u);
////    }
////    catch(e)
////    {
////        exceptionDetected = true;
////    }
////    ASSERT_TRUE(exceptionDetected); // data race
////}

////alvision.cvtest.TEST(UMat, DISABLED_Test_same_behaviour_write_and_read)
////{
////    bool exceptionDetected = false;
////    try
////    {
////        UMat u(Size(10, 10), CV_8UC1);
////        Mat m = u.getMat(ACCESS_WRITE);
////        UMat dst;
////        add(u, Scalar.all(1), dst);
////    }
////    catch(e)
////    {
////        exceptionDetected = true;
////    }
////    ASSERT_TRUE(exceptionDetected); // data race
////}

////alvision.cvtest.TEST(UMat, DISABLED_Test_same_behaviour_write_and_write)
////{
////    bool exceptionDetected = false;
////    try
////    {
////        UMat u(Size(10, 10), CV_8UC1);
////        Mat m = u.getMat(ACCESS_WRITE);
////        add(u, Scalar.all(1), u);
////    }
////    catch(e)
////    {
////        exceptionDetected = true;
////    }
////    ASSERT_TRUE(exceptionDetected); // data race
////}
