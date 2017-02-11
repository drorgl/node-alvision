/*M///////////////////////////////////////////////////////////////////////////////////////
//
//  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
//
//  By downloading, copying, installing or using the software you agree to this license.
//  If you do not agree to this license, do not download, install,
//  copy or use the software.
//
//
//                           License Agreement
//                For Open Source Computer Vision Library
//
// Copyright (C) 2000-2008, Intel Corporation, all rights reserved.
// Copyright (C) 2009, Willow Garage Inc., all rights reserved.
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
//   * The name of the copyright holders may not be used to endorse or promote products
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

import alvision_module from "../../bindings";

import * as _mat from './../mat'
import * as _matx from './../matx'
//import * as _st from './Constants'
import * as _st from './../static'
import * as _types from './../types'
import * as _core from './../core'
import * as _base from './../base'
import * as _affine from './../Affine'
import * as _features2d from './../features2d'
import * as _cuda from './../cuda'
import * as _cvdef from './../cvdef'
import * as _imgcodecs from './../imgcodecs'
import * as _tsperf from './ts_perf';
import * as _ts from './../ts';

//#ifndef __OPENCV_CUDA_TEST_UTILITY_HPP__
//#define __OPENCV_CUDA_TEST_UTILITY_HPP__

//#include <stdexcept>
//#include "cvconfig.h"
//#include "opencv2/core.hpp"
//#include "opencv2/core/cuda.hpp"
//#include "opencv2/imgcodecs.hpp"
//#include "opencv2/highgui.hpp"
//#include "opencv2/imgproc.hpp"
//#include "opencv2/ts.hpp"

//namespace cvtest
//{
//    //////////////////////////////////////////////////////////////////////
//    // random generators

//    CV_EXPORTS int randomInt(int minVal, int maxVal);
interface IrandomInt{
    (minVal: _st.int, maxVal: _st.int ): _st.int;
}

export var randomInt: IrandomInt = alvision_module.randomInt;

//    CV_EXPORTS double randomDouble(double minVal, double maxVal);
interface IrandomDouble{
    (minVal: _st.double, maxVal: _st.double ): _st.double;
}

export var randomDouble: IrandomDouble = alvision_module.randomDouble;

//    CV_EXPORTS cv::Size randomSize(int minVal, int maxVal);
interface IrandomSize{
    (minVal: _st.int, maxVal: _st.int ): _types.Size;
}

export var randomSize: IrandomSize = alvision_module.randomSize;

interface IrandomScalar{
    (minVal: _st.double, maxVal: _st.double ): _types.Scalar;
}

export var randomScalar: IrandomScalar = alvision_module.randomScalar;

//    CV_EXPORTS cv::Scalar randomScalar(double minVal, double maxVal);

interface IrandomMat {
    (size: _types.Size, type: _st.int, minVal?: _st.double /*= 0.0*/, maxVal?: _st.double /*= 255.0*/): _mat.Mat;
}

export var randomMat: IrandomMat = alvision_module.randomMat;

//    CV_EXPORTS cv::Mat randomMat(cv::Size size, int type, double minVal = 0.0, double maxVal = 255.0);

//    //////////////////////////////////////////////////////////////////////
//    // GpuMat create

interface IcreateMat {
    (size : _types.Size, type : _st.int, useRoi? : boolean /* = false*/): _cuda.cuda.GpuMat;
}

export var createMat: IcreateMat = alvision_module.createMat;

//    CV_EXPORTS cv::cuda::GpuMat createMat(cv::Size size, int type, bool useRoi = false);


interface IloadMat{
    (m: _mat.Mat, useRoi?  : boolean /*= false*/): _cuda.cuda.GpuMat;
}

export var loadMat: IloadMat = alvision_module.loadMat;
//CV_EXPORTS cv::cuda::GpuMat loadMat(const cv::Mat& m, bool useRoi = false);

//    //////////////////////////////////////////////////////////////////////
//    // Image load

//    //! read image from testdata folder

interface IreadImage {
    (fileName: string, flags?: _imgcodecs.ImreadModes | _st.int /*= cv::IMREAD_COLOR*/): _mat.Mat;
}
export var readImage: IreadImage = alvision_module.cvtest.readImage;
//    CV_EXPORTS cv::Mat readImage(const std::string& fileName, int flags = cv::IMREAD_COLOR);

//    //! read image from testdata folder and convert it to specified type
interface IreadImageType {
    (fname: string, type: _st.int): _mat.Mat;
}

export var readImageType: IreadImageType = alvision_module.readImageType;
//    CV_EXPORTS cv::Mat readImageType(const std::string& fname, int type);

//    //////////////////////////////////////////////////////////////////////
//    // Gpu devices

//    //! return true if device supports specified feature and gpu module was built with support the feature.
interface IsupportFeature {
    (info: _cuda.cuda.DeviceInfo, feature: _cuda.cuda.FeatureSet): boolean;
}
export var supportFeature: IsupportFeature = alvision_module.supportFeature;
//supportFeature(const cv::cuda::DeviceInfo& info, cv::cuda::FeatureSet feature);
//    CV_EXPORTS bool supportFeature(const cv::cuda::DeviceInfo& info, cv::cuda::FeatureSet feature);


interface DeviceManagerStatic {
    instance(): DeviceManager;
}

interface DeviceManager
    {
//    public:


//        void load(int i);
//        void loadAll();

    values(): Array<_cuda.cuda.DeviceInfo>;

//    private:
//        std::vector<cv::cuda::DeviceInfo> devices_;
};

export var DeviceManager: DeviceManagerStatic = alvision_module.DeviceManager;

export var ALL_DEVICES = _st.CheckAndAssign(DeviceManager,()=> DeviceManager.instance().values(),()=> []);
//    #define ALL_DEVICES testing::ValuesIn(cvtest::DeviceManager::instance().values())

//    //////////////////////////////////////////////////////////////////////
//    // Additional assertion

//    CV_EXPORTS void minMaxLocGold(const cv::Mat& src, double* minVal_, double* maxVal_ = 0, cv::Point* minLoc_ = 0, cv::Point* maxLoc_ = 0, const cv::Mat& mask = cv::Mat());
function minMaxLocGold(src: _mat.Mat, cb:(minVal_: _st.double, maxVal_: _st.double, minLoc_: Array<_types.Point>, maxLoc_: Array<_types.Point>) => void, mask?: _mat.Mat): void {
    if (src.depth() != _cvdef.MatrixType.CV_8S) {
        _core.minMaxLoc(src, (minVal_, maxVal_, minLoc_, maxLoc_) => { cb(minVal_, maxVal_, minLoc_, maxLoc_); }, mask);
        return;
    }

    // OpenCV's minMaxLoc doesn't support CV_8S type
    var minVal = _st.DBL_MAX;// std::numeric_limits<double>::max();
    var minLoc = new _types.Point(-1, -1);

    var maxVal = -_st.DBL_MAX;// std::numeric_limits<double>::max();
    var maxLoc = new _types.Point(-1, -1);

    for (var y = 0; y < src.rows(); ++y) {
        const src_row = src.ptr<_st.schar>("schar", y);
        const mask_row = mask.empty() ? null : mask.ptr<_st.uchar>("uchar", y);

        for (var x = 0; x < src.cols(); ++x) {
            if (!mask_row || mask_row[x]) {
                var val = src_row[x];

                if (val < minVal) {
                    minVal = <any>val;
                    minLoc = new _types.Point(x, y);
                }

                if (val > maxVal) {
                    maxVal = <any>val;
                    maxLoc = new _types.Point(x, y);
                }
            }
        }
    }

    cb(minVal, maxVal, [minLoc], [maxLoc]);
    //if (minVal_) *minVal_ = minVal;
    //if (maxVal_) *maxVal_ = maxVal;
    //
    //if (minLoc_) *minLoc_ = minLoc;
    //if (maxLoc_) *maxLoc_ = maxLoc;
}


function getMat(arr: _st.InputArray): _mat.Mat {
    if (arr.kind() == _st.IOArrayKind.CUDA_GPU_MAT) {
        var m = new _mat.Mat();
        arr.getGpuMat().download(m);
        return m;
    }

    return arr.getMat();
}

function PrintToString(val: any): string {
    return val.toString();
}

function MatType(matType: _st.int | _cvdef.MatrixType) {
    return matType.toString();
}

//template < typename T, typename OutT>
function printMatValImpl(Ttype : string, m: _mat.Mat, p: _types.Point): string {
    const cn = m.channels();

    //std::ostringstream ostr;
    var ostr = "";
    ostr += "(";

    p.x = p.x.valueOf()  / cn.valueOf();

    ostr += (m.at<any>(Ttype, p.y.valueOf(), p.x.valueOf() * cn.valueOf())).get().toString();
    for (var c = 1; c < m.channels(); ++c)
    {
        ostr += ", " + (m.at<any>(Ttype, p.y.valueOf(), p.x.valueOf() * cn.valueOf() + c)).get().toString();
    }
    ostr += ")";

    return ostr;
}

function printMatVal(m: _mat.Mat, p: _types.Point ): string {
    //typedef std::string(*func_t)(const Mat& m, Point p);
    var funcsDepthName = ["uchar", "schar", "ushort", "short", "int", "float","double"];

    //static const  funcs =
    //    [
    //        printMatValImpl < _st.uchar>, 
    //        printMatValImpl < _st.schar>, 
    //        printMatValImpl < _st.ushort>, 
    //        printMatValImpl < _st.short>,
    //        printMatValImpl < _st.int>, 
    //        printMatValImpl < _st.float>, 
    //        printMatValImpl<_st.double>
    //        ];

    //return funcs[m.depth().valueOf()](funcsDepthName[m.depth().valueOf()], m, p);
    return printMatValImpl(funcsDepthName[m.depth().valueOf()], m, p);
}





//CV_EXPORTS testing::AssertionResult assertMatNear(const char* expr1, const char* expr2, const char* eps_expr, cv::InputArray m1, cv::InputArray m2, double eps);
function assertMatNear(expr1: string, expr2: string, eps_expr: string, m1_: _st.InputArray, m2_: _st.InputArray, eps: _st.double) {
    var m1 = getMat(m1_);
    var m2 = getMat(m2_);

    if (m1.size() != m2.size()) {
        throw new Error("Matrices \"" + expr1 + "\" and \"" + expr2 + "\" have different sizes : \"" +
            + expr1 + "\" [" + PrintToString(m1.size()) + "] vs \"" +
            + expr2 + "\" [" + PrintToString(m2.size()) + "]");
    }

    if (m1.type() != m2.type()) {
        throw new Error("Matrices \"" + expr1 + "\" and \"" + expr2 + "\" have different types : \"" +
            + expr1 + "\" [" + PrintToString(MatType(m1.type())) + "] vs \"" +
            + expr2 + "\" [" + PrintToString(MatType(m2.type())) + "]");
    }

    var diff = new _mat.Mat();
    _core.absdiff(m1.reshape(1), m2.reshape(1), diff);

    var maxVal = 0.0;
    var maxLoc = new _types.Point();
    minMaxLocGold(diff, (minVal_, maxVal_, minLoc_, maxLoc_) => { maxVal = maxVal_.valueOf(); maxLoc = maxLoc_[0]; });

    if (maxVal > eps) {
        throw new Error("The max difference between matrices \"" + expr1 + "\" and \"" + expr2
            + "\" is " + maxVal + " at (" + maxLoc.y + ", " + maxLoc.x.valueOf() / m1.channels().valueOf() + ")"
            + ", which exceeds \"" + eps_expr + "\", where \""
            + expr1 + "\" at (" + maxLoc.y + ", " + maxLoc.x.valueOf() / m1.channels().valueOf() + ") evaluates to " + printMatVal(m1, maxLoc) + ", \""
            + expr2 + "\" at (" + maxLoc.y + ", " + maxLoc.x.valueOf() / m1.channels().valueOf() + ") evaluates to " + printMatVal(m2, maxLoc) + ", \""
            + eps_expr + "\" evaluates to " + eps);
    }

    //return AssertionSuccess();
}

export function ASSERT_MAT_NEAR(m1: _st.InputArray, m2: _st.InputArray, eps: _st.double) {
    assertMatNear(m1.toString(), m2.toString(), eps.toString(), m1, m2, eps);
}

export function EXPECT_MAT_NEAR(m1 : _st.InputArray, m2 : _st.InputArray, eps : _st.double) {
    assertMatNear(m1.toString(), m2.toString(), eps.toString(), m1, m2, eps);
    //assertMatNear(m1, m2, eps);
    //EXPECT_PRED_FORMAT3(assertMatNear, m1, m2, eps)
}
//    #define EXPECT_MAT_NEAR(m1, m2, eps) EXPECT_PRED_FORMAT3(cvtest::assertMatNear, m1, m2, eps)
//    #define ASSERT_MAT_NEAR(m1, m2, eps) ASSERT_PRED_FORMAT3(cvtest::assertMatNear, m1, m2, eps)

//    #define EXPECT_SCALAR_NEAR(s1, s2, eps) \
//        { \
//            EXPECT_NEAR(s1[0], s2[0], eps); \
//            EXPECT_NEAR(s1[1], s2[1], eps); \
//            EXPECT_NEAR(s1[2], s2[2], eps); \
//            EXPECT_NEAR(s1[3], s2[3], eps); \
//        }
//    #define ASSERT_SCALAR_NEAR(s1, s2, eps) \
//        { \
//            ASSERT_NEAR(s1[0], s2[0], eps); \
//            ASSERT_NEAR(s1[1], s2[1], eps); \
//            ASSERT_NEAR(s1[2], s2[2], eps); \
//            ASSERT_NEAR(s1[3], s2[3], eps); \
//        }

//    #define EXPECT_POINT2_NEAR(p1, p2, eps) \
//        { \
//            EXPECT_NEAR(p1.x, p2.x, eps); \
//            EXPECT_NEAR(p1.y, p2.y, eps); \
//        }
//    #define ASSERT_POINT2_NEAR(p1, p2, eps) \
//        { \
//            ASSERT_NEAR(p1.x, p2.x, eps); \
//            ASSERT_NEAR(p1.y, p2.y, eps); \
//        }

//    #define EXPECT_POINT3_NEAR(p1, p2, eps) \
//        { \
//            EXPECT_NEAR(p1.x, p2.x, eps); \
//            EXPECT_NEAR(p1.y, p2.y, eps); \
//            EXPECT_NEAR(p1.z, p2.z, eps); \
//        }
//    #define ASSERT_POINT3_NEAR(p1, p2, eps) \
//        { \
//            ASSERT_NEAR(p1.x, p2.x, eps); \
//            ASSERT_NEAR(p1.y, p2.y, eps); \
//            ASSERT_NEAR(p1.z, p2.z, eps); \
//        }

//    CV_EXPORTS double checkSimilarity(cv::InputArray m1, cv::InputArray m2);


interface IcheckSimilarity{
    (m1: _st.InputArray, m2: _st.InputArray ): _st.double;
}

export var checkSimilarity: IcheckSimilarity = alvision_module.checkSimilarity;

export function EXPECT_MAT_SIMILAR(mat1 : _mat.Mat, mat2 : _mat.Mat, eps : _st.double)  : void
        {
            _base.ASSERT_EQ(mat1.type(), mat2.type()); 
            _base.ASSERT_EQ(mat1.size(), mat2.size()); 
            _base.EXPECT_LE(checkSimilarity(mat1, mat2), eps); 
}

export function ASSERT_MAT_SIMILAR(mat1: _mat.Mat, mat2: _mat.Mat, eps: _st.double): void {
    _base.ASSERT_EQ(mat1.type(), mat2.type());
    _base.ASSERT_EQ(mat1.size(), mat2.size());
    _base.EXPECT_LE(checkSimilarity(mat1, mat2), eps);
}


//    #define ASSERT_MAT_SIMILAR(mat1, mat2, eps) \
//        { \
//            ASSERT_EQ(mat1.type(), mat2.type()); \
//            ASSERT_EQ(mat1.size(), mat2.size()); \
//            ASSERT_LE(checkSimilarity(mat1, mat2), eps); \
//        }

//    //////////////////////////////////////////////////////////////////////
//    // Helper structs for value-parameterized tests

//    #define CUDA_TEST_P(test_case_name, test_name) \
//      class GTEST_TEST_CLASS_NAME_(test_case_name, test_name) \
//           extends  test_case_name { \
//       public: \
//        GTEST_TEST_CLASS_NAME_(test_case_name, test_name)() {} \
//        virtual void TestBody(); \
//       private: \
//        void UnsafeTestBody(); \
//        static int AddToRegistry() { \
//          ::testing::UnitTest::GetInstance()->parameterized_test_registry(). \
//              GetTestCasePatternHolder<test_case_name>(\
//                  #test_case_name, __FILE__, __LINE__)->AddTestPattern(\
//                      #test_case_name, \
//                      #test_name, \
//                      new ::testing::internal::TestMetaFactory< \
//                          GTEST_TEST_CLASS_NAME_(test_case_name, test_name)>()); \
//          return 0; \
//        } \
//        static int gtest_registering_dummy_; \
//        GTEST_DISALLOW_COPY_AND_ASSIGN_(\
//            GTEST_TEST_CLASS_NAME_(test_case_name, test_name)); \
//      }; \
//      int GTEST_TEST_CLASS_NAME_(test_case_name, \
//                                 test_name)::gtest_registering_dummy_ = \
//          GTEST_TEST_CLASS_NAME_(test_case_name, test_name)::AddToRegistry(); \
//      void GTEST_TEST_CLASS_NAME_(test_case_name, test_name)::TestBody() \
//      { \
//        try \
//        { \
//          UnsafeTestBody(); \
//        } \
//        catch (...) \
//        { \
//          cv::cuda::resetDevice(); \
//          throw; \
//        } \
//      } \
//      void GTEST_TEST_CLASS_NAME_(test_case_name, test_name)::UnsafeTestBody()

export const DIFFERENT_SIZES = [new _types.Size(128,128), new _types.Size(113,113)];
//    #define DIFFERENT_SIZES testing::Values(cv::Size(128, 128), cv::Size(113, 113))

//    // Depth

//    using perf::MatDepth;

//    #define ALL_DEPTH testing::Values(MatDepth(CV_8U), MatDepth(CV_8S), MatDepth(CV_16U), MatDepth(CV_16S), MatDepth(CV_32S), MatDepth(CV_32F), MatDepth(CV_64F))
export const ALL_DEPTH = [_cvdef.MatrixType.CV_8U, _cvdef.MatrixType.CV_8S, _cvdef.MatrixType.CV_16U, _cvdef.MatrixType.CV_16S, _cvdef.MatrixType.CV_32S, _cvdef.MatrixType.CV_32F, _cvdef.MatrixType.CV_64F];

export const DEPTH_PAIRS = [
    new _st.pair(_cvdef.MatrixType.CV_8U, _cvdef.MatrixType.CV_8U ),
    new _st.pair(_cvdef.MatrixType.CV_8U, _cvdef.MatrixType.CV_16U),
    new _st.pair(_cvdef.MatrixType.CV_8U, _cvdef.MatrixType.CV_16S),
    new _st.pair(_cvdef.MatrixType.CV_8U, _cvdef.MatrixType.CV_32S),
    new _st.pair(_cvdef.MatrixType.CV_8U, _cvdef.MatrixType.CV_32F),
    new _st.pair(_cvdef.MatrixType.CV_8U, _cvdef.MatrixType.CV_64F),

    new _st.pair(_cvdef.MatrixType.CV_16U, _cvdef.MatrixType.CV_16U),
    new _st.pair(_cvdef.MatrixType.CV_16U, _cvdef.MatrixType.CV_32S),
    new _st.pair(_cvdef.MatrixType.CV_16U, _cvdef.MatrixType.CV_32F),
    new _st.pair(_cvdef.MatrixType.CV_16U, _cvdef.MatrixType.CV_64F),

    new _st.pair(_cvdef.MatrixType.CV_16S, _cvdef.MatrixType.CV_16S),
    new _st.pair(_cvdef.MatrixType.CV_16S, _cvdef.MatrixType.CV_32S),
    new _st.pair(_cvdef.MatrixType.CV_16S, _cvdef.MatrixType.CV_32F),
    new _st.pair(_cvdef.MatrixType.CV_16S, _cvdef.MatrixType.CV_64F),

    new _st.pair(_cvdef.MatrixType.CV_32S, _cvdef.MatrixType.CV_32S),
    new _st.pair(_cvdef.MatrixType.CV_32S, _cvdef.MatrixType.CV_32F),
    new _st.pair(_cvdef.MatrixType.CV_32S, _cvdef.MatrixType.CV_64F),

    new _st.pair(_cvdef.MatrixType.CV_32F, _cvdef.MatrixType.CV_32F),
    new _st.pair(_cvdef.MatrixType.CV_32F, _cvdef.MatrixType.CV_64F),

    new _st.pair(_cvdef.MatrixType.CV_64F, _cvdef.MatrixType.CV_64F)
];
//    // Type

//    using perf::MatType;

//    //! return vector with types from specified range.
//    CV_EXPORTS std::vector<MatType> types(int depth_start, int depth_end, int cn_start, int cn_end);


function types(depth_start: _st.int, depth_end: _st.int, cn_start: _st.int, cn_end: _st.int): Array<_cvdef.MatrixType> {
    var v = new Array<_cvdef.MatrixType>((depth_end.valueOf() - depth_start.valueOf() + 1) * (cn_end.valueOf() - cn_start.valueOf() + 1));

    for (var depth = depth_start.valueOf(); depth <= depth_end; ++depth) {
        for (var cn = cn_start.valueOf(); cn <= cn_end; ++cn) {
            v.push(_cvdef.MatrixType.CV_MAKETYPE(depth, cn));
        }
    }

    return v;
}

function all_types(): Array<_cvdef.MatrixType> {
    return types(_cvdef.MatrixType.CV_8U, _cvdef.MatrixType.CV_64F, 1, 4);
}


//    //! return vector with all types (depth: CV_8U-CV_64F, channels: 1-4).
//    CV_EXPORTS const std::vector<MatType>& all_types();

//    #define ALL_TYPES testing::ValuesIn(all_types())
export const ALL_TYPES = all_types();
//    #define TYPES(depth_start, depth_end, cn_start, cn_end) testing::ValuesIn(types(depth_start, depth_end, cn_start, cn_end))

//    // ROI

export class UseRoi
{
    constructor(arg: boolean) {
        this.val_ = arg;
    }
    public val_: boolean;


    public toString(): string {
        return "UseRoi(" + this.val_ + ")";
    }
//    public:
//        inline UseRoi(bool val = false) : val_(val) {}

//        inline operator bool() const { return val_; }

//    private:
//        bool val_;
};

//    CV_EXPORTS void PrintTo(const UseRoi& useRoi, std::ostream* os);

export const WHOLE_SUBMAT = [false, true];// [new UseRoi(false), new UseRoi(true)];
//    #define WHOLE_SUBMAT testing::Values(UseRoi(false), UseRoi(true))

//    // Direct/Inverse

//    class Inverse
//    {
//    public:
//        inline Inverse(bool val = false) : val_(val) {}

//        inline operator bool() const { return val_; }

//    private:
//        bool val_;
//    };

//    CV_EXPORTS void PrintTo(const Inverse& useRoi, std::ostream* os);

export const DIRECT_INVERSE = [false, true];// testing::Values(Inverse(false), Inverse(true))

//    // Param class

//    #define IMPLEMENT_PARAM_CLASS(name, type) \
//        class name \
//        { \
//        public: \
//            name ( type arg = type ()) : val_(arg) {} \
//            operator type () const {return val_;} \
//        private: \
//            type val_; \
//        }; \
//        inline void PrintTo( name param, std::ostream* os) \
//        { \
//            *os << #name <<  "(" << testing::PrintToString(static_cast< type >(param)) << ")"; \
//        }

//    IMPLEMENT_PARAM_CLASS(Channels, int)

//    #define ALL_CHANNELS testing::Values(Channels(1), Channels(2), Channels(3), Channels(4))
export var ALL_CHANNELS = [new _ts.cvtest.Channels(1), new _ts.cvtest.Channels(2), new _ts.cvtest.Channels(3), new _ts.cvtest.Channels(4)];
export var IMAGE_CHANNELS = [new _ts.cvtest.Channels(1), new _ts.cvtest.Channels(3), new _ts.cvtest.Channels(4)];
//    #define IMAGE_CHANNELS testing::Values(Channels(1), Channels(3), Channels(4))

//    // Flags and enums

//    CV_ENUM(NormCode, NORM_INF, NORM_L1, NORM_L2, NORM_TYPE_MASK, NORM_RELATIVE, NORM_MINMAX)

//    CV_ENUM(Interpolation, INTER_NEAREST, INTER_LINEAR, INTER_CUBIC, INTER_AREA)

//    CV_ENUM(BorderType, BORDER_REFLECT101, BORDER_REPLICATE, BORDER_CONSTANT, BORDER_REFLECT, BORDER_WRAP)
//    #define ALL_BORDER_TYPES testing::Values(BorderType(cv::BORDER_REFLECT101), BorderType(cv::BORDER_REPLICATE), BorderType(cv::BORDER_CONSTANT), BorderType(cv::BORDER_REFLECT), BorderType(cv::BORDER_WRAP))
export var ALL_BORDER_TYPES = [_base.BorderTypes.BORDER_REFLECT101, _base.BorderTypes.BORDER_REPLICATE, _base.BorderTypes.BORDER_CONSTANT, _base.BorderTypes.BORDER_REFLECT, _base.BorderTypes. BORDER_WRAP];

//    CV_FLAGS(WarpFlags, INTER_NEAREST, INTER_LINEAR, INTER_CUBIC, WARP_INVERSE_MAP)

//    //////////////////////////////////////////////////////////////////////
//    // Features2D

//    CV_EXPORTS testing::AssertionResult assertKeyPointsEquals(const char* gold_expr, const char* actual_expr, std::vector<cv::KeyPoint>& gold, std::vector<cv::KeyPoint>& actual);

//    #define ASSERT_KEYPOINTS_EQ(gold, actual) EXPECT_PRED_FORMAT2(assertKeyPointsEquals, gold, actual)

//    CV_EXPORTS int getMatchedPointsCount(std::vector<cv::KeyPoint>& gold, std::vector<cv::KeyPoint>& actual);
//    CV_EXPORTS int getMatchedPointsCount(const std::vector<cv::KeyPoint>& keypoints1, const std::vector<cv::KeyPoint>& keypoints2, const std::vector<cv::DMatch>& matches);

//    //////////////////////////////////////////////////////////////////////
//    // Other

//    CV_EXPORTS void dumpImage(const std::string& fileName, const cv::Mat& image);
//    CV_EXPORTS void showDiff(cv::InputArray gold, cv::InputArray actual, double eps);

//    CV_EXPORTS void parseCudaDeviceOptions(int argc, char **argv);
//    CV_EXPORTS void printCudaInfo();
//}

//namespace cv { namespace cuda
//{
//    CV_EXPORTS void PrintTo(const DeviceInfo& info, std::ostream* os);
//}}

//#ifdef HAVE_CUDA

//#define CV_CUDA_TEST_MAIN(resourcesubdir) \
//    CV_TEST_MAIN(resourcesubdir, cvtest::parseCudaDeviceOptions(argc, argv), cvtest::printCudaInfo(), cv::setUseOptimized(false))

//#else // HAVE_CUDA

//#define CV_CUDA_TEST_MAIN(resourcesubdir) \
//    int main() \
//    { \
//        printf("OpenCV was built without CUDA support\n"); \
//        return 0; \
//    }

//#endif // HAVE_CUDA


//#endif // __OPENCV_CUDA_TEST_UTILITY_HPP__
