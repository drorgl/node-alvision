/// <reference path="../../typings/tsd.d.ts" />
var alvision_module = require('../../lib/bindings.js');

import * as _st from './static';
import * as _pers from './persistence';
import * as _core from './core';
import * as _base from './base';
import * as _types from './types';
import * as _mat from './mat';
import * as _cvdef from './cvdef';

import tape = require("tape");
import path = require("path");
import colors = require("colors");
import async = require("async");
import util = require('util');
import fs = require('fs');

//#ifndef __OPENCV_GTESTCV_HPP__
//#define __OPENCV_GTESTCV_HPP__
//
//#include "opencv2/core/cvdef.h"
//#include <stdarg.h> // for va_list
//
//#include "cvconfig.h"
//
//#ifdef WINRT
//    #pragma warning(disable:4447) // Disable warning 'main' signature found without threading model
//#endif
//
//#ifdef _MSC_VER
//#pragma warning( disable: 4127 ) // conditional expression is constant
//#pragma warning( disable: 4503 ) // decorated name length exceeded, name was truncated
//#endif
//
//#define GTEST_DONT_DEFINE_FAIL      0
//#define GTEST_DONT_DEFINE_SUCCEED   0
//#define GTEST_DONT_DEFINE_ASSERT_EQ 0
//#define GTEST_DONT_DEFINE_ASSERT_NE 0
//#define GTEST_DONT_DEFINE_ASSERT_LE 0
//#define GTEST_DONT_DEFINE_ASSERT_LT 0
//#define GTEST_DONT_DEFINE_ASSERT_GE 0
//#define GTEST_DONT_DEFINE_ASSERT_GT 0
//#define GTEST_DONT_DEFINE_TEST      0
//
//#include "opencv2/ts/ts_gtest.h"
//#include "opencv2/ts/ts_ext.hpp"
//
//#ifndef GTEST_USES_SIMPLE_RE
//#  define GTEST_USES_SIMPLE_RE 0
//#endif
//#ifndef GTEST_USES_POSIX_RE
//#  define GTEST_USES_POSIX_RE 0
//#endif
//
//#define PARAM_TEST_CASE(name, ...) struct name : testing::TestWithParam< std::tr1::tuple< __VA_ARGS__ > >
//#define GET_PARAM(k) std::tr1::get< k >(GetParam())
//
//#include "opencv2/core.hpp"
//#include "opencv2/core/utility.hpp"

export namespace cvtest {
    export function TEST(test_case_name: string, test_name: string, cb: () => void) {
        cb();
        //tape(
        //TODO:!!
    }

    export function CUDA_TEST_P(test_case_name: string, test_name: string, cb: () => void) {
        cb();
        //tape...
        //TODO:!!
    }


    //using std::vector;
    //using std::string;
    //using cv::RNG;
    //using cv::Mat;
    //using cv::Scalar;
    //using cv::Size;
    //using cv::Point;
    //using cv::Rect;
    //using cv::InputArray;
    //using cv::noArray;

    //class CV_EXPORTS TS;


    //CV_EXPORTS int64 readSeed(const char* str);
    //
    //CV_EXPORTS void randUni( RNG& rng, Mat& a, const Scalar& param1, const Scalar& param2 );
    //

    export function randInt(rng: _core.RNG): _st.int {
        return rng.int();
    }

    //inline unsigned randInt( RNG& rng )
    //{
    //    return (unsigned)rng;
    //}
    //

    export function randReal(rng: _core.RNG): _st.double {
        return rng.double();
    }

    //inline  double randReal( RNG& rng )
    //{
    //    return (double)rng;
    //}
    //
    //
    //CV_EXPORTS const char* getTypeName( int type );
    //CV_EXPORTS int typeByName( const char* type_name );
    //
    //CV_EXPORTS string vec2str(const string& sep, const int* v, size_t nelems);
    //
    export function clipInt(val : _st.int, min_val : _st.int, max_val : _st.int ): _st.int 
    {
        if( val < min_val )
            val = min_val;
        if( val > max_val )
            val = max_val;
        return val;
    }
    //
    interface IgetMinVal {
        (depth: _st.int): _st.double;
    }
    export var getMinVal: IgetMinVal = alvision_module.getMinVal;
    //CV_EXPORTS double getMinVal(int depth);

    interface IgetMaxVal {
        (depth: _st.int): _st.double;
    }
    export var getMaxVal: IgetMaxVal = alvision_module.getMaxVal;
    //CV_EXPORTS double getMaxVal(int depth);
    //

    interface IrandomSize {
        (rng: _core.RNG, maxSizeLog: _st.double): _types.Size;
        (rng: _core.RNG, minDims: _st.int, maxDims: _st.int, maxSizeLog: _st.double, sz: Array<_st.int>): void;
    }

    export var randomSize: IrandomSize = alvision_module.randomSize;

    
    //CV_EXPORTS int randomType(RNG& rng, int typeMask, int minChannels, int maxChannels);


    
    interface IrandomMat {
        (rng: _core.RNG, size: _types.Size, type: _st.int, minVal: _st.double, maxVal: _st.double, useRoi: boolean): _mat.Mat;
        (rng: _core.RNG, size: Array<_st.int>, type: _st.int, minVal: _st.double, maxVal: _st.double, useRoi: boolean): _mat.Mat;
    }

    export var randomMat: IrandomMat = alvision_module.randomMat;

    interface Iadd {
        (a: _mat.Mat, alpha: _st.double, b: _mat.Mat, beta: _st.double ,
            gamma: _types.Scalar, c: _mat.Mat, ctype: _st.int , calcAbs?  : boolean /*=false*/):void;
    }

    export var add: Iadd = alvision_module.add;

    //CV_EXPORTS void add(const Mat& a, double alpha, const Mat& b, double beta,
    //                      Scalar gamma, Mat& c, int ctype, bool calcAbs=false);

    interface Imultiply {
        (a: _mat.Mat, b: _mat.Mat, c: _mat.Mat, alpha?: _st.double  /*= 1*/): void;
    }

    export var multiply: Imultiply = alvision_module.multiply;

    //CV_EXPORTS void multiply(const Mat& a, const Mat& b, Mat& c, double alpha=1);
    //CV_EXPORTS void divide(const Mat& a, const Mat& b, Mat& c, double alpha=1);
    //

    interface Iconvert {
        (src: _mat.Mat, dst: _st.OutputArray, dtype: _st.int, alpha?: _st.double /*= 1*/, beta?: _st.double /*= 0*/): void;
    }

    export var convert: Iconvert = alvision_module.convert;

    //CV_EXPORTS void convert(const Mat& src, cv::OutputArray dst, int dtype, double alpha=1, double beta=0);

    interface Icopy {
        (src: _mat.Mat, dst: _mat.Mat, mask?: _mat.Mat /*=Mat()*/, invertMask?: boolean /*= false*/): void;
    }
    export var copy: Icopy = alvision_module.copy;

    //CV_EXPORTS void copy(const Mat& src, Mat& dst, const Mat& mask=Mat(), bool invertMask=false);
    //CV_EXPORTS void set(Mat& dst, const Scalar& gamma, const Mat& mask=Mat());
    //
    //// working with multi-channel arrays
    //CV_EXPORTS void extract( const Mat& a, Mat& plane, int coi );
    //CV_EXPORTS void insert( const Mat& plane, Mat& a, int coi );
    //
    //// checks that the array does not have NaNs and/or Infs and all the elements are
    //// within [min_val,max_val). idx is the index of the first "bad" element.
    //CV_EXPORTS int check( const Mat& data, double min_val, double max_val, vector<int>* idx );
    //
    //// modifies values that are close to zero
    //CV_EXPORTS void  patchZeros( Mat& mat, double level );
    //
    //CV_EXPORTS void transpose(const Mat& src, Mat& dst);
    //CV_EXPORTS void erode(const Mat& src, Mat& dst, const Mat& _kernel, Point anchor=Point(-1,-1),
    //                      int borderType=0, const Scalar& borderValue=Scalar());
    //CV_EXPORTS void dilate(const Mat& src, Mat& dst, const Mat& _kernel, Point anchor=Point(-1,-1),
    //                       int borderType=0, const Scalar& borderValue=Scalar());
    //CV_EXPORTS void filter2D(const Mat& src, Mat& dst, int ddepth, const Mat& kernel,
    //                         Point anchor, double delta, int borderType,
    //                         const Scalar& borderValue=Scalar());
    //CV_EXPORTS void copyMakeBorder(const Mat& src, Mat& dst, int top, int bottom, int left, int right,
    //                               int borderType, const Scalar& borderValue=Scalar());
    //CV_EXPORTS Mat calcSobelKernel2D( int dx, int dy, int apertureSize, int origin=0 );
    //CV_EXPORTS Mat calcLaplaceKernel2D( int aperture_size );
    //
    //CV_EXPORTS void initUndistortMap( const Mat& a, const Mat& k, Size sz, Mat& mapx, Mat& mapy );
    //
    //CV_EXPORTS void minMaxLoc(const Mat& src, double* minval, double* maxval,
    //                          vector<int>* minloc, vector<int>* maxloc, const Mat& mask=Mat());
    interface Inorm {
        (src: _st.InputArray, normType: _base.NormTypes, mask?: _st.InputArray  /*= noArray()*/): _st.double;
        (src1: _st.InputArray, src2: _st.InputArray, normType: _base.NormTypes, mask?: _st.InputArray /*= noArray()*/): _st.double;
    }

    export var norm: Inorm = alvision_module.norm;


    interface Imean {
        (src: _mat.Mat, mask?: _mat.Mat /*=Mat()*/): _types.Scalar;
    }
    export var mean: Imean = alvision_module.mean;
    //CV_EXPORTS Scalar mean(const Mat& src, const Mat& mask=Mat());

    interface IPSNR {
        (src1: _st.InputArray, src2: _st.InputArray): _st.double;
    }
    export var PSNR: IPSNR = alvision_module.PSNR;

    //CV_EXPORTS double PSNR(InputArray src1, InputArray src2);
    //
    //CV_EXPORTS bool cmpUlps(const Mat& data, const Mat& refdata, int expMaxDiff, double* realMaxDiff, vector<int>* idx);
    //
    //// compares two arrays. max_diff is the maximum actual difference,
    //// success_err_level is maximum allowed difference, idx is the index of the first
    //// element for which difference is >success_err_level
    //// (or index of element with the maximum difference)

    interface IcmpEps {
        (data: _mat.Mat, refdata: _mat.Mat, success_err_level: _st.double, element_wise_relative_error: boolean,
            cb: (idx: Array<_st.int>, max_diff: _st.double) => void): _st.int
    }

    export var cmpEps: IcmpEps = alvision_module.cmpEps;


    //CV_EXPORTS int cmpEps( const Mat& data, const Mat& refdata, double* max_diff,
    //                       double success_err_level, vector<int>* idx,
    //                       bool element_wise_relative_error );
    //
    //// a wrapper for the previous function. in case of error prints the message to log file.
    //CV_EXPORTS int cmpEps2( TS* ts, const Mat& data, const Mat& refdata, double success_err_level,
    //                        bool element_wise_relative_error, const char* desc );
    //
    //CV_EXPORTS int cmpEps2_64f( TS* ts, const double* val, const double* refval, int len,
    //                        double eps, const char* param_name );
    //
    //CV_EXPORTS void logicOp(const Mat& src1, const Mat& src2, Mat& dst, char c);
    //CV_EXPORTS void logicOp(const Mat& src, const Scalar& s, Mat& dst, char c);
    //CV_EXPORTS void min(const Mat& src1, const Mat& src2, Mat& dst);
    //CV_EXPORTS void min(const Mat& src, double s, Mat& dst);
    //CV_EXPORTS void max(const Mat& src1, const Mat& src2, Mat& dst);
    //CV_EXPORTS void max(const Mat& src, double s, Mat& dst);
    //
    //CV_EXPORTS void compare(const Mat& src1, const Mat& src2, Mat& dst, int cmpop);
    //CV_EXPORTS void compare(const Mat& src, double s, Mat& dst, int cmpop);

    interface Igemm {
        (src1 : _mat.Mat, src2 : _mat.Mat, alpha : _st.double,
                         src3 : _mat.Mat, beta : _st.double, dst : _mat.Mat, flags : _st.int): void;
    }
    export var gemm: Igemm = alvision_module.gemm;

    //CV_EXPORTS void gemm(const Mat& src1, const Mat& src2, double alpha,
    //                     const Mat& src3, double beta, Mat& dst, int flags);
    //CV_EXPORTS void transform( const Mat& src, Mat& dst, const Mat& transmat, const Mat& shift );

    interface IcrossCorr {
        (src1 : _mat.Mat, src2 : _mat.Mat): _st.double;
    }
    export var crossCorr: IcrossCorr = alvision_module.crossCorr;


    //CV_EXPORTS double crossCorr(const Mat& src1, const Mat& src2);
    //CV_EXPORTS void threshold( const Mat& src, Mat& dst, double thresh, double maxval, int thresh_type );
    //CV_EXPORTS void minMaxIdx( InputArray _img, double* minVal, double* maxVal,
    //                    Point* minLoc, Point* maxLoc, InputArray _mask );
    //
    //struct CV_EXPORTS MatInfo
    //{
    //    MatInfo(const Mat& _m) : m(&_m) {}
    //    const Mat* m;
    //};
    //
    //CV_EXPORTS std::ostream& operator << (std::ostream& out, const MatInfo& m);
    //
//    class MatComparator {
//        constructor(_maxdiff: _st.double, _context: _st.int) {
//            this.maxdiff = _maxdiff;
//            this.realmaxdiff = _st.DBL_MAX;
//            this.context = _context;
//        }

//        //AssertionResult
//        public run(expr1: string, expr2: string,
//            m1: _mat.Mat, m2: _mat.Mat): AssertionResult {
//            if (m1.type() != m2.type() || m1.size != m2.size)
//                return ::testing::AssertionFailure()
//                    << "The reference and the actual output arrays have different type or size:\n"
//                    << expr1 << " ~ " << MatInfo(m1) << "\n"
//                    << expr2 << " ~ " << MatInfo(m2) << "\n";

//            //bool ok = cvtest::cmpUlps(m1, m2, maxdiff, &realmaxdiff, &loc0);
//            var code = cmpEps(m1, m2,true, &realmaxdiff, maxdiff, &loc0, true);

//            if (code >= 0)
//                return ::testing::AssertionSuccess();

//            var m = [ m1.reshape(1, 0), m2.reshape(1, 0) ];
//            var dims = m[0].dims;
            
//            var loc = new Array<_st.int>();
//            var border = dims <= 2 ? context : 0;

//            var m1part = new _mat.Mat();
//            var m2part = new _mat.Mat();

//            if (border == 0) {
//                loc = loc0;
//                m1part = new _mat.Mat(1, 1, m[0].depth(), m[0].ptr(&loc[0]));
//                m2part = new _mat.Mat(1, 1, m[1].depth(), m[1].ptr(&loc[0]));
//            }
//            else {
//                m1part = getSubArray(m[0], border, loc0, loc);
//                m2part = getSubArray(m[1], border, loc0, loc);
//            }

//            return ::testing::AssertionFailure()
//                << "too big relative difference (" << realmaxdiff << " > "
//                << maxdiff << ") between "
//                << MatInfo(m1) << " '" << expr1 << "' and '" << expr2 << "' at " << Mat(loc0) << ".\n\n"
//                << "'" << expr1 << "': " << MatPart(m1part, border > 0 ? &loc : 0) << ".\n\n"
//                << "'" << expr2 << "': " << MatPart(m2part, border > 0 ? &loc : 0) << ".\n";
//        }

//    var maxdiff: _st.double;
//    var realmaxdiff: _st.double;
//    var loc0: Array<_st.int>;
//    var context: _st.int;
//}
    //
    //
    //
    //class BaseTest;
    //class TS;

    export abstract class BaseTest {
        //public:
        //    // constructor(s) and destructor
        constructor() {
            this.ts = new TS();
            this.test_case_count = -1;
        }
        //    
        //
        //    // the main procedure of the test
        run(start_from: _st.int): void {
            var test_case_idx: _st.int
            var count = this.get_test_case_count();
            //var t_start: _st.int64 = cvGetTickCount();
            //var freq: _st.double = cv::getTickFrequency();

            //var time = process.hrtime();
            //var diff[0] * 1e9 + diff[1]

            var ff: boolean = this.can_do_fast_forward();
            var progress: _st.int = 0;
            var code: _st.int;
            //var t1: _st.int64 = t_start;

            for (test_case_idx = ff && start_from >= 0 ? start_from : 0;
                count < 0 || test_case_idx < count; test_case_idx = test_case_idx.valueOf() + 1) {
                this.ts.update_context(this, test_case_idx, ff);

                //DROR: this doesn't make any sense, dt will always be 0...
                progress = this.update_progress(progress, test_case_idx, count, 0);// (t1.valueOf() - t_start.valueOf()) / (freq.valueOf() * 1000));

                code = this.prepare_test_case(test_case_idx);
                if (code < 0 || this.ts.get_err_code() < 0)
                    return;

                if (code == 0)
                    continue;

                this.run_func();

                if (this.ts.get_err_code() < 0)
                    return;

                if (this.validate_test_results(test_case_idx) < 0 || this.ts.get_err_code() < 0)
                    return;
            }
        }
        //
        //    // the wrapper for run that cares of exceptions
        safe_run(start_from?: _st.int /*= 0*/): void {
            this.read_params(this.ts.get_file_storage());
            this.ts.update_context(null, -1, true);
            this.ts.update_context(this, -1, true);

            try {
                this.run(start_from);
            }
            catch (exc) {
                //todo, check if correct!
                var errorStr = exc.message(); //+ cvErrorStr(exc.code);
                var buf = util.format("OpenCV Error:\n\t % s(%s) in %s, file % s, line % d",
                    errorStr, exc.err.c_str(), exc.func.size() > 0 ?
                        exc.func.c_str() : "unknown function", exc.file.c_str(), exc.line);
                console.log(buf);
                this.ts.printf(TSConstants.LOG, "%s\n", buf);
            }

            this.ts.set_failed_test_info(FailureCode.FAIL_ERROR_IN_CALLED_FUNC);
     
            //        catch (const TS::FailureCode& fc)
            //        {
            //            std::string errorStr = TS::str_from_code(fc);
            //    ts ->printf(TS::LOG, "General failure:\n\t%s (%d)\n", errorStr.c_str(), fc);

            //    ts ->set_failed_test_info(fc);
            //}
            //        catch (...)
            //{
            //    ts ->printf(TS::LOG, "Unknown failure\n");

            //    ts ->set_failed_test_info(TS::FAIL_EXCEPTION);
            //}
            //    }

            this.ts.set_gtest_status();
        }
        //
        get_name(): string { return this.name; }
        //
        //    // returns true if and only if the different test cases do not depend on each other
        //    // (so that test system could get right to a problematic test case)
        can_do_fast_forward(): boolean {
            return true;
        }

        //
        //    // deallocates all the memory.
        //    // called by init() (before initialization) and by the destructor
        clear(): void { }
        //
        //
        protected test_case_count: _st.int; // the total number of test cases
        //
        //    // read test params
        protected read_params(fs: _pers.CvFileStorage): _st.int {
            return 0;
        }
        //
        //    // returns the number of tests or -1 if it is unknown a-priori
        protected get_test_case_count(): _st.int {
            return this.test_case_count;
        }
        //
        //    // prepares data for the next test case. rng seed is updated by the function
        protected prepare_test_case(test_case_idx: _st.int): _st.int {
            return 0;
        }
        //
        //    // checks if the test output is valid and accurate
        protected validate_test_results(test_case_idx: _st.int): _st.int {
            return 0;
        }
        //
        //    // calls the tested function. the method is called from run_test_case()
        protected run_func(): void { // runs tested func(s)
            //assert(0);
            throw new Error("no override");
        }
        //
        //    // updates progress bar
        protected update_progress(progress: _st.int, test_case_idx: _st.int, count: _st.int, dt: _st.double): _st.int {
            var width: _st.int = 60 - this.get_name().length;
            if (count > 0) {
                var t = Math.round((test_case_idx.valueOf() * width.valueOf()) / count.valueOf() );
                if (t > progress) {
                    this.ts.printf(TSConstants.CONSOLE, ".");
                    progress = t;
                }
            }
            else if (Math.round(dt.valueOf()) > progress) {
                this.ts.printf(TSConstants.CONSOLE, ".");
                progress = Math.round(dt.valueOf());
            }

            return progress;
        }
        //
        //    // finds test parameter
        //    protected abstract  find_param(fs: _pers.CvFileStorage, param_name: string): _pers.CvFileNode {
        //CvFileNode* node = cvGetFileNodeByName(fs, 0, get_name().c_str());
        //return node ? cvGetFileNodeByName(fs, node, param_name) : 0;

        

        //protected CV_Assert(expr: boolean): void {
        //    if (!(expr)) {
        //         else cv::error(cv::Error::StsAssert, #expr, CV_Func, __FILE__, __LINE__)
        //    }
        //}

    
    
    // name of the test (it is possible to locate a test by its name)
    protected name: string;
    
    // pointer to the system that includes the test
    protected ts: TS;
};


/*****************************************************************************************\
*                               Information about a failed test                           *
\*****************************************************************************************/

interface TestInfo
{
    
    // pointer to the test
    test: BaseTest;

    // failure code (TS::FAIL_*)
    code : _st.int

    // seed value right before the data for the failed test case is prepared.
    rng_seed: _st.uint64;

    // seed value right before running the test
    rng_seed0: _st.uint64;

    // index of test case, can be then passed to BaseTest::proceed_to_test_case()
    test_case_idx: _st.int;
};

/*****************************************************************************************\
*                                 Base Class for test system                              *
\*****************************************************************************************/

// common parameters:
class TSParams
{
    constructor() { }

    // RNG seed, passed to and updated by every test executed.
    rng_seed: _st.uint64 

    // whether to use IPP, MKL etc. or not
    use_optimized: boolean;

    // extensivity of the tests, scale factor for test_case_count
    test_case_count_scale: _st.double;
};

// test error codes
export enum FailureCode {
    // everything is Ok
    OK = 0,

    // generic error: stub value to be used
    // temporarily if the error's cause is unknown
    FAIL_GENERIC = -1,

    // the test is missing some essential data to proceed further
    FAIL_MISSING_TEST_DATA = -2,

    // the tested function raised an error via cxcore error handler
    FAIL_ERROR_IN_CALLED_FUNC = -3,

    // an exception has been raised;
    // for memory and arithmetic exception
    // there are two specialized codes (see below...)
    FAIL_EXCEPTION = -4,

    // a memory exception
    // (access violation, access to missed page, stack overflow etc.)
    FAIL_MEMORY_EXCEPTION = -5,

    // arithmetic exception (overflow, division by zero etc.)
    FAIL_ARITHM_EXCEPTION = -6,

    // the tested function corrupted memory (no exception have been raised)
    FAIL_MEMORY_CORRUPTION_BEGIN = -7,
    FAIL_MEMORY_CORRUPTION_END = -8,

    // the tested function (or test ifself) do not deallocate some memory
    FAIL_MEMORY_LEAK = -9,

    // the tested function returned invalid object, e.g. matrix, containing NaNs,
    // structure with NULL or out-of-range fields (while it should not)
    FAIL_INVALID_OUTPUT = -10,

    // the tested function returned valid object, but it does not match to
    // the original (or produced by the test) object
    FAIL_MISMATCH = -11,

    // the tested function returned valid object (a single number or numerical array),
    // but it differs too much from the original (or produced by the test) object
    FAIL_BAD_ACCURACY = -12,

    // the tested function hung. Sometimes, can be determined by unexpectedly long
    // processing time (in this case there should be possibility to interrupt such a function
    FAIL_HANG = -13,

    // unexpected response on passing bad arguments to the tested function
    // (the function crashed, proceed successfully (while it should not), or returned
    // error code that is different from what is expected)
    FAIL_BAD_ARG_CHECK = -14,

    // the test data (in whole or for the particular test case) is invalid
    FAIL_INVALID_TEST_DATA = -15,

    // the test has been skipped because it is not in the selected subset of the tests to run,
    // because it has been run already within the same run with the same parameters, or because
    // of some other reason and this is not considered as an error.
    // Normally TS::run() (or overridden method in the derived class) takes care of what
    // needs to be run, so this code should not occur.
    SKIPPED = 1
};

export enum TSConstants
{
    NUL = 0,
    SUMMARY_IDX = 0,
    SUMMARY = 1 << SUMMARY_IDX,
    LOG_IDX = 1,
    LOG = 1 << LOG_IDX,
    CSV_IDX = 2,
    CSV = 1 << CSV_IDX,
    CONSOLE_IDX = 3,
    CONSOLE = 1 << CONSOLE_IDX,
    MAX_IDX = 4
};

var _tsSingleton = new TS();

export class TS
{
    //public:
    // constructor(s) and destructor
    constructor() {}
    //virtual ~TS();

    

    public static ptr(): TS{
        return _tsSingleton;
    }

//    // initialize test system before running the first test
//    virtual void init( const string& modulename );
//
//    // low-level printing functions that are used by individual tests and by the system itself

    vprintf(streams: _st.int, format: any, ...param: any[]): void {
        this.output_buf += util.format(format, param)

        //             char str[1 << 14];
        //            vsnprintf(str, sizeof(str) - 1, fmt, l);
        //
        //        for (int i = 0; i < MAX_IDX; i++ )
        //        if ((streams & (1 << i))) {
        //            output_buf[i] += std::string(str);
        //            // in the new GTest-based framework we do not use
        //            // any output files (except for the automatically generated xml report).
        //            // if a test fails, all the buffers are printed, so we do not want to duplicate the information and
        //            // thus only add the new information to a single buffer and return from the function.
        //            break;
        //        }
    }


    printf(streams: TSConstants, format: any, ...param: any[] ) : void
    {
        this.vprintf(streams, format, param);
    }

  
//
//    // updates the context: current test, test case, rng state
    update_context(test: BaseTest, test_case_idx: _st.int, update_ts_context: boolean): void{
        if (this.current_test_info.test != test) {
            for (var i = 0; i <= TSConstants.CONSOLE_IDX; i++ )
            this.output_buf = "";
            this.rng = new _core.RNG(this.params.rng_seed);
            this.current_test_info.rng_seed0 = this.current_test_info.rng_seed = this.rng.state;
        }

        this.current_test_info.test = test;
        this.current_test_info.test_case_idx = test_case_idx;
        this.current_test_info.code = 0;
        //cvSetErrStatus(CV_StsOk);
        if (update_ts_context)
            this.current_test_info.rng_seed = this.rng.state;
    }
//
    get_current_test_info() : TestInfo { return this.current_test_info; }
//
//    // sets information about a failed test
    set_failed_test_info(fail_code: FailureCode): void {
        if (this.current_test_info.code >= 0)
            this.current_test_info.code = fail_code;
    }
//
    set_gtest_status(): void {
        //TS::FailureCode code = get_err_code();
        //if (code >= 0)
        //    return SUCCEED();

        //char seedstr[32];
        //sprintf(seedstr, "%08x%08x", (unsigned)(current_test_info.rng_seed >> 32),
        //    (unsigned)(current_test_info.rng_seed));

        //string logs = "";
        //if (!output_buf[SUMMARY_IDX].empty())
        //    logs += "\n-----------------------------------\n\tSUM: " + output_buf[SUMMARY_IDX];
        //if (!output_buf[LOG_IDX].empty())
        //    logs += "\n-----------------------------------\n\tLOG:\n" + output_buf[LOG_IDX];
        //if (!output_buf[CONSOLE_IDX].empty())
        //    logs += "\n-----------------------------------\n\tCONSOLE: " + output_buf[CONSOLE_IDX];
        //logs += "\n-----------------------------------\n";

        //FAIL() << "\n\tfailure reason: " << str_from_code(code) <<
        //    "\n\ttest case #" << current_test_info.test_case_idx <<
        //    "\n\tseed: " << seedstr << logs;
    }
//

//
//    // get file storage
    get_file_storage(): _pers.CvFileStorage {
        return null;
    }
//
//    // get RNG to generate random input data for a test
    get_rng() : _core.RNG { return this.rng; }
//
//    // returns the current error code
    get_err_code(): FailureCode  { return this.current_test_info.code.valueOf(); }
//
//    // returns the test extensivity scale
//    double get_test_case_count_scale() { return params.test_case_count_scale; }
//
//    const string& get_data_path() const { return data_path; }
    get_data_path() : string { return this.data_path; }
//
//    // returns textual description of failure code
//    static string str_from_code( const TS::FailureCode code );
//
//protected:
//
  // these are allocated within a test to try keep them valid in case of stack corruption
  protected rng : _core.RNG ;

  // information about the current test
  protected current_test_info: TestInfo;

  // the path to data files used by tests
  protected data_path : string ;

  protected params: TSParams ;
  protected output_buf: string;// std::string output_buf[MAX_IDX];
};


/*****************************************************************************************\
*            Subclass of BaseTest for testing functions that process dense arrays           *
\*****************************************************************************************/

export enum _ArrayTestInternal { INPUT, INPUT_OUTPUT, OUTPUT, REF_INPUT_OUTPUT, REF_OUTPUT, TEMP, MASK, MAX_ARR };

export abstract class ArrayTest extends BaseTest
{
//public:
//    // constructor(s) and destructor
//    ArrayTest();
//    virtual ~ArrayTest();
//
//    virtual void clear();
//
//protected:
//
//    virtual int read_params( CvFileStorage* fs );
//    virtual int prepare_test_case( int test_case_idx );
//    virtual int validate_test_results( int test_case_idx );
//
//    virtual void prepare_to_validation( int test_case_idx );
    get_test_array_types_and_sizes(int /*test_case_idx*/, sizes : Array<Array<_types.Size>>, types : Array<Array<_st.int>>): void {
        var rng = this.ts.get_rng();
        //Size size;
        var size = new _types.Size();
        //double val;
        //size_t i, j;

        var val = randReal(rng).valueOf() * (this.max_log_array_size.valueOf() - this.min_log_array_size.valueOf()) + this.min_log_array_size.valueOf();
        size.width = Math.round(Math.exp(val * Math.LOG2E));
        val = randReal(rng).valueOf() * (this.max_log_array_size.valueOf() - this.min_log_array_size.valueOf()) + this.min_log_array_size.valueOf();
        size.height = Math.round(Math.exp(val * Math.LOG2E));

        for (var i = 0; i < this.test_array.length; i++) {
            var sizei = this.test_array[i].length;
            for (var j = 0; j < sizei; j++) {
                sizes[i][j] = size;
                types[i][j] = _cvdef.MatrixType.CV_8UC1;
            }
        }
    }
//    virtual void fill_array( int test_case_idx, int i, int j, Mat& arr );
//    virtual void get_minmax_bounds( int i, int j, int type, Scalar& low, Scalar& high );
    get_success_error_level(test_case_idx: _st.int, i: _st.int, j: _st.int): _st.double { return 0;}
//
//    bool cvmat_allowed;
//    bool iplimage_allowed;
    protected optional_mask: boolean;
    protected element_wise_relative_error: boolean;
//
    protected min_log_array_size: _st.int;
    protected max_log_array_size : _st.int;
//
    
//
    //vector<vector<void*> > test_array;
    protected test_array: Array<Array<any>>;
//    vector<vector<Mat> > test_mat;
    protected test_mat: Array<Array<_mat.Mat>>;
//    float buf[4];



    protected INPUT = _ArrayTestInternal.INPUT;
    protected INPUT_OUTPUT = _ArrayTestInternal.INPUT_OUTPUT;
    protected OUTPUT = _ArrayTestInternal.OUTPUT;
    protected REF_INPUT_OUTPUT = _ArrayTestInternal.REF_INPUT_OUTPUT;
    protected REF_OUTPUT = _ArrayTestInternal.REF_OUTPUT;
    protected TEMP = _ArrayTestInternal.TEMP;
    protected MASK = _ArrayTestInternal.MASK;
    protected MAX_ARR = _ArrayTestInternal.MAX_ARR;

};


export abstract class BadArgTest extends BaseTest
{
//public:
//    // constructor(s) and destructor
//    BadArgTest();
//    virtual ~BadArgTest();
//
//protected:
    //protected abstract run_test_case(expected_code : _st.int, descr : string ) : _st.int;
    protected abstract run_func() : void;
    public test_case_idx: _st.int;
//
//    template<class F>
    protected run_test_case(expected_code : _st.int, descr : string, f : ()=>void): _st.int
    {
        var errcount = 0;
        var thrown = false;
        //const char* descr = _descr.c_str() ? _descr.c_str() : "";


        try {
            f();
        }
        catch (e) {
            thrown = true;
            if (e.code != expected_code) {
                this.ts.printf(TSConstants.LOG, "%s (test case #%d): the error code %d is different from the expected %d\n",
                    descr, this.test_case_idx, e.code, expected_code);
                errcount = 1;
            }
        }
        //catch(const cv::Exception& e)
        //{
        //    thrown = true;
        //    if( e.code != expected_code )
        //    {
        //        ts->printf(TS::LOG, "%s (test case #%d): the error code %d is different from the expected %d\n",
        //            descr, test_case_idx, e.code, expected_code);
        //        errcount = 1;
        //    }
        //}
        //catch(...)
        //{
        //    thrown = true;
        //    ts->printf(TS::LOG, "%s  (test case #%d): unknown exception was thrown (the function has likely crashed)\n",
        //               descr, test_case_idx);
        //    errcount = 1;
        //}
        if(!thrown)
        {
            this.ts.printf(TSConstants.LOG, "%s  (test case #%d): no expected exception was thrown\n",
                       descr, this.test_case_idx);
            errcount = 1;
        }
        this.test_case_idx = this.test_case_idx.valueOf() + 1;

        return errcount;
    }
};

class DefaultRngAuto
{
//    const uint64 old_state;
//
//    DefaultRngAuto() : old_state(cv::theRNG().state) { cv::theRNG().state = (uint64)-1; }
//    ~DefaultRngAuto() { cv::theRNG().state = old_state; }
//
//    DefaultRngAuto& operator=(const DefaultRngAuto&);
};

}

export namespace cvtest
{

// test images generation functions
//CV_EXPORTS void fillGradient(Mat& img, int delta = 5);
//CV_EXPORTS void smoothBorder(Mat& img, const Scalar& color, int delta = 3);
//
//CV_EXPORTS void printVersionInfo(bool useStdOut = true);
//} //namespace cvtest
//
//#ifndef __CV_TEST_EXEC_ARGS
//#if defined(_MSC_VER) && (_MSC_VER <= 1400)
//#define __CV_TEST_EXEC_ARGS(...)    \
//    while (++argc >= (--argc,-1)) {__VA_ARGS__; break;} /*this ugly construction is needed for VS 2005*/
//#else
//#define __CV_TEST_EXEC_ARGS(...)    \
//    __VA_ARGS__;
//#endif
//#endif
//
//#ifdef HAVE_OPENCL
namespace cvtest { namespace ocl {
//function dumpOpenCLDevice() : void;
} }
//#define TEST_DUMP_OCL_INFO cvtest::ocl::dumpOpenCLDevice();
//#else
//#define TEST_DUMP_OCL_INFO
//#endif
//
//void parseCustomOptions(int argc, char **argv);
//
//#define CV_TEST_MAIN(resourcesubdir, ...) \
//int main(int argc, char **argv) \
//{ \
//    __CV_TEST_EXEC_ARGS(__VA_ARGS__) \
//    cvtest::TS::ptr()->init(resourcesubdir); \
//    ::testing::InitGoogleTest(&argc, argv); \
//    cvtest::printVersionInfo(); \
//    TEST_DUMP_OCL_INFO \
//    parseCustomOptions(argc, argv); \
//    return RUN_ALL_TESTS(); \
//}
//
//// This usually only makes sense in perf tests with several implementations,
//// some of which are not available.
//#define CV_TEST_FAIL_NO_IMPL() do { \
//    ::testing::Test::RecordProperty("custom_status", "noimpl"); \
//    FAIL() << "No equivalent implementation."; \
//} while (0)
//
//#endif
//
//#include "opencv2/ts/ts_perf.hpp"
//
//#ifdef WINRT
//#ifndef __FSTREAM_EMULATED__
//#define __FSTREAM_EMULATED__
//#include <stdlib.h>
//#include <fstream>
//#include <sstream>
//
//#undef ifstream
//#undef ofstream
//#define ifstream ifstream_emulated
//#define ofstream ofstream_emulated
//
//namespace std {
//
//class ifstream : public stringstream
//{
//    FILE* f;
//public:
//    ifstream(const char* filename, ios_base::openmode mode = ios_base::in)
//        : f(NULL)
//    {
//        string modeStr("r");
//        printf("Open file (read): %s\n", filename);
//        if (mode & ios_base::binary)
//            modeStr += "b";
//        f = fopen(filename, modeStr.c_str());
//
//        if (f == NULL)
//        {
//            printf("Can't open file: %s\n", filename);
//            return;
//        }
//        fseek(f, 0, SEEK_END);
//        size_t sz = ftell(f);
//        if (sz > 0)
//        {
//            char* buf = (char*) malloc(sz);
//            fseek(f, 0, SEEK_SET);
//            if (fread(buf, 1, sz, f) == sz)
//            {
//                this->str(std::string(buf, sz));
//            }
//            free(buf);
//        }
//    }
//
//    ~ifstream() { close(); }
//    bool is_open() const { return f != NULL; }
//    void close()
//    {
//        if (f)
//            fclose(f);
//        f = NULL;
//        this->str("");
//    }
//};

//class ofstream : public stringstream
//{
//    FILE* f;
//public:
//    ofstream(const char* filename, ios_base::openmode mode = ios_base::out)
//    : f(NULL)
//    {
//        open(filename, mode);
//    }
//    ~ofstream() { close(); }
//    void open(const char* filename, ios_base::openmode mode = ios_base::out)
//    {
//        string modeStr("w+");
//        if (mode & ios_base::trunc)
//            modeStr = "w";
//        if (mode & ios_base::binary)
//            modeStr += "b";
//        f = fopen(filename, modeStr.c_str());
//        printf("Open file (write): %s\n", filename);
//        if (f == NULL)
//        {
//            printf("Can't open file (write): %s\n", filename);
//            return;
//        }
//    }
//    bool is_open() const { return f != NULL; }
//    void close()
//    {
//        if (f)
//        {
//            fwrite(reinterpret_cast<const char *>(this->str().c_str()), this->str().size(), 1, f);
//            fclose(f);
//        }
//        f = NULL;
//        this->str("");
//    }
//};
//
//} // namespace std
//#endif // __FSTREAM_EMULATED__
//#endif // WINRT
//

interface IdumpImage {
    (fileName : string, image : _mat.Mat): void;
}
    export var dumpImage: IdumpImage = alvision_module.dumpImage;
    //CV_EXPORTS void dumpImage(const std::string& fileName, const cv::Mat& image);
}

export function remove(filename: string): void {
    fs.unlinkSync(filename);
}
