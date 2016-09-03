//TODO: 2nd stage

//import tape = require("tape");
//import path = require("path");
//
//import async = require("async");
//import alvision = require("../../../tsbinding/alvision");
//import util = require('util');
//import fs = require('fs');

////#include "test_precomp.hpp"
////
////using namespace cv;
////using namespace std;

//class local {
//    static create(arr: alvision.OutputArray, submatSize: alvision.Size , type : alvision.int): void {
//        let sizes = [ submatSize.width, submatSize.height ];
//        arr.create(sizeof(sizes) / sizeof(sizes[0]), sizes, type);
//    }
//};

//alvision.cvtest.TEST('Core_OutputArrayCreate', '_1997',()=>
//{
//    let mat = new alvision.Mat (new alvision.Size(512, 512),alvision.MatrixType. CV_8U);
//    let submatSize = new alvision.Size(256, 256);

//    alvision.ASSERT_NO_THROW(()=>local.create( mat.roi(new alvision.Rect(new alvision.Point(), submatSize)), submatSize, mat.type() ));
//});

//alvision.cvtest.TEST('Core_SaturateCast', 'NegativeNotClipped', () => {
//    let d = -1.0;
//    let val = alvision.saturate_cast<alvision.uint>(d,"uint");

//    alvision.ASSERT_EQ(0xffffffff, val);
//});

////template<typename T, typename U>
//function maxAbsDiff(t: alvision.InputArray, u: alvision.InputArray): alvision.double 
//{
//    let d = new alvision.Matd();
//    alvision.absdiff(t, u, d);

//  let ret: alvision.double;

//  alvision.minMaxLoc(d, (minVal_, maxVal_) => { ret = maxVal_; });
//  return ret;
//}

//alvision.cvtest.TEST('Core_OutputArrayAssign', '_Matxd_Matd', () => {
//    Mat expected = (Mat_<double>(2, 3) << 1, 2, 3, .1, .2, .3);
//    Matx23d actualx;

//    {
//        OutputArray oa(actualx);
//        oa.assign(expected);
//    }

//    let actual = (Mat) actualx;

//    alvision.EXPECT_LE(maxAbsDiff(expected, actual), 0.0);
//});

//TEST(Core_OutputArrayAssign, _Matxd_Matf)
//{
//    Mat expected = (Mat_<float>(2,3) << 1, 2, 3, .1, .2, .3);
//    Matx23d actualx;

//    {
//        OutputArray oa(actualx);
//        oa.assign(expected);
//    }

//    Mat actual = (Mat) actualx;

//    EXPECT_LE(maxAbsDiff(expected, actual), FLT_EPSILON);
//}

//TEST(Core_OutputArrayAssign, _Matxf_Matd)
//{
//    Mat expected = (Mat_<double>(2,3) << 1, 2, 3, .1, .2, .3);
//    Matx23f actualx;

//    {
//        OutputArray oa(actualx);
//        oa.assign(expected);
//    }

//    Mat actual = (Mat) actualx;

//    EXPECT_LE(maxAbsDiff(expected, actual), FLT_EPSILON);
//}

//TEST(Core_OutputArrayAssign, _Matxd_UMatd)
//{
//    Mat expected = (Mat_<double>(2,3) << 1, 2, 3, .1, .2, .3);
//    UMat uexpected = expected.getUMat(ACCESS_READ);
//    Matx23d actualx;

//    {
//        OutputArray oa(actualx);
//        oa.assign(uexpected);
//    }

//    Mat actual = (Mat) actualx;

//    EXPECT_LE(maxAbsDiff(expected, actual), 0.0);
//}

//TEST(Core_OutputArrayAssign, _Matxd_UMatf)
//{
//    Mat expected = (Mat_<float>(2,3) << 1, 2, 3, .1, .2, .3);
//    UMat uexpected = expected.getUMat(ACCESS_READ);
//    Matx23d actualx;

//    {
//        OutputArray oa(actualx);
//        oa.assign(uexpected);
//    }

//    Mat actual = (Mat) actualx;

//    EXPECT_LE(maxAbsDiff(expected, actual), FLT_EPSILON);
//}

//TEST(Core_OutputArrayAssign, _Matxf_UMatd)
//{
//    Mat expected = (Mat_<double>(2,3) << 1, 2, 3, .1, .2, .3);
//    UMat uexpected = expected.getUMat(ACCESS_READ);
//    Matx23f actualx;

//    {
//        OutputArray oa(actualx);
//        oa.assign(uexpected);
//    }

//    Mat actual = (Mat) actualx;

//    EXPECT_LE(maxAbsDiff(expected, actual), FLT_EPSILON);
//}
