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
////                        Intel License Agreement
////                For Open Source Computer Vision Library
////
//// Copyright (C) 2000, Intel Corporation, all rights reserved.
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
////   * The name of Intel Corporation may not be used to endorse or promote products
////     derived from this software without specific prior written permission.
////
//// This software is provided by the copyright holders and contributors "as is" and
//// any express or implied warranties, including, but not limited to, the implied
//// warranties of merchantability and fitness for a particular purpose are disclaimed.
//// In no event shall the Intel Corporation or contributors be liable for any direct,
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
////
////using namespace cv;
////using namespace std;

//class CV_BaseHistTest  extends alvision.cvtest.BaseTest
//{
//    constructor() {
//        super();
//        this.test_case_count = 100;
//        this.max_log_size = 20;
//        this.img_max_log_size = 8;
//        this.max_cdims = 6;
//        this.hist_count = 1;
//        this.init_ranges = 0;
//        this.gen_random_hist = 0;
//        this.gen_hist_max_val = 100;

//        this.test_cpp = false;
//    }

//    protected MAX_HIST = 12;

//    clear(): void {
//        super.clear();
//        for (var  i = 0; i <this.hist.size(); i++ )
//        cvReleaseHist( &hist[i]);
//    }

//    read_params(fs: alvision.FileStorage): alvision.int{
//        var code = super.read_params(fs);
//        if (code < 0)
//            return code;

//        this.test_case_count = cvReadInt(find_param(fs, "struct_count"), test_case_count);
//        this.max_log_size = cvReadInt(find_param(fs, "max_log_size"), max_log_size);
//        this.max_log_size = alvision.cvtest.clipInt(max_log_size, 1, 20);
//        this.img_max_log_size = cvReadInt(find_param(fs, "max_log_array_size"), img_max_log_size);
//        this.img_max_log_size = alvision.cvtest.clipInt(img_max_log_size, 1, 9);

//        this.max_cdims = cvReadInt(find_param(fs, "max_cdims"), max_cdims);
//        this.max_cdims = alvision.cvtest.clipInt(max_cdims, 1, 6);

//        return 0;
//    }
//    run_func() : void {}
//    prepare_test_case(test_case_idx: alvision.int): alvision.int{
//        int i;
//        float ** r;

//        this.clear();

//        super.prepare_test_case(test_case_idx);
//        this.get_hist_params(test_case_idx);
//        r = this.get_hist_ranges(test_case_idx);
//        this.hist.resize(hist_count);

//        for (var i = 0; i < hist_count; i++) {
//            hist[i] = cvCreateHist(cdims, dims, hist_type, r, uniform);
//            this.init_hist(test_case_idx, i);
//        }
//        this.test_cpp = (alvision.cvtest.randInt(this.ts.get_rng()) % 2) != 0;

//        return 1;
//    }
//    validate_test_results(test_case_idx: alvision.int): alvision.int {
//        return 0;
//    }
//    init_hist(test_case_idx: alvision.int, i: alvision.int): void {
//        if (this.gen_random_hist) {
//            var rng = this.ts.get_rng();

//            if (this.hist_type == CV_HIST_ARRAY) {
//                Mat h = cvarrToMat(hist[hist_i].bins);
//                alvision.cvtest.randUni(rng, h, alvision.Scalar.all(0), Scalar.all(gen_hist_max_val));
//            }
//            else {
//                CvArr * arr = hist[hist_i].bins;
//                int i, j, totalSize = 1, nz_count;
//                int idx[CV_MAX_DIM];
//                for (i = 0; i < cdims; i++)
//                    totalSize *= dims[i];

//                nz_count = alvision.cvtest.randInt(rng) % MAX(totalSize / 4, 100);
//                nz_count = MIN(nz_count, totalSize);

//                // a zero number of non-zero elements should be allowed
//                for (i = 0; i < nz_count; i++) {
//                    for (j = 0; j < cdims; j++)
//                        idx[j] = alvision.cvtest.randInt(rng) % dims[j];
//                    cvSetRealND(arr, idx, alvision.cvtest.randReal(rng).valueOf() * gen_hist_max_val);
//                }
//            }
//        }
//    }

//    get_hist_params(test_case_idx: alvision.int): void {
//        var rng = this.ts.get_rng();
//        int i, max_dim_size, max_ni_dim_size = 31;
//        double hist_size;

//        cdims = alvision.cvtest.randInt(rng) % max_cdims + 1;
//        hist_size = exp(alvision.cvtest.randReal(rng).valueOf() * max_log_size * Math.LOG2E);
//        max_dim_size = Math.round(pow(hist_size, 1. / cdims));
//        total_size = 1;
//        uniform = alvision.cvtest.randInt(rng) % 2;
//        hist_type = alvision.cvtest.randInt(rng) % 2 ? CV_HIST_SPARSE : CV_HIST_ARRAY;

//        for (var i = 0; i < cdims; i++) {
//            dims[i] = alvision.cvtest.randInt(rng) % (max_dim_size + 2) + 2;
//            if (!uniform)
//                dims[i] = MIN(dims[i], max_ni_dim_size);
//            total_size *= dims[i];
//        }

//        img_type = alvision.cvtest.randInt(rng) % 2 ? CV_32F : CV_8U;
//        img_size.width = Math.round(exp(alvision.cvtest.randReal(rng).valueOf() * img_max_log_size * Math.LOG2E));
//        img_size.height = Math.round(exp(alvision.cvtest.randReal(rng).valueOf() * img_max_log_size * Math.LOG2E));

//        if (img_type < CV_32F) {
//            low = alvision.cvtest.getMinVal(img_type);
//            high = alvision.cvtest.getMaxVal(img_type);
//        }
//        else {
//            high = 1000;
//            low = -high;
//        }

//        range_delta = (alvision.cvtest.randInt(rng) % 2) * (high - low) * 0.05;
//    }
//    get_hist_ranges(test_case_idx: alvision.int): Array<alvision.float> {
//        var _low = low + range_delta, _high = high - range_delta;

//        if (!this.init_ranges)
//            return 0;

//        this.ranges.resize(cdims);

//        if (uniform) {
//            _ranges.resize(cdims * 2);
//            for (let i = 0; i < cdims; i++ )
//            {
//                _ranges[i * 2] = (float)_low;
//                _ranges[i * 2 + 1] = (float)_high;
//                ranges[i] = &_ranges[i * 2];
//            }
//        }
//        else {
//            int i, dims_sum = 0, ofs = 0;
//            for (i = 0; i < cdims; i++)
//                dims_sum += dims[i] + 1;
//            _ranges.resize(dims_sum);

//            for (i = 0; i < cdims; i++) {
//                int j, n = dims[i];
//                // generate logarithmic scale
//                double delta, q, val;
//                for (j = 0; j < 10; j++) {
//                    q = 1. + (j + 1) * 0.1;
//                    if ((pow(q, (double)n) - 1) / (q - 1.) >= _high - _low)
//                        break;
//                }

//                if (j == 0) {
//                    delta = (_high - _low) / n;
//                    q = 1.;
//                }
//                else {
//                    q = 1 + j * 0.1;
//                    delta = Math.floor((_high - _low) * (q - 1) / (pow(q, (double)n) - 1));
//                    delta = MAX(delta, 1.);
//                }
//                val = _low;

//                for (j = 0; j <= n; j++) {
//                    _ranges[j + ofs] = (float)MIN(val, _high);
//                    val += delta;
//                    delta *= q;
//                }
//                ranges[i] = &_ranges[ofs];
//                ofs += n + 1;
//            }
//        }

//        return &ranges[0];
//    }

//    protected max_log_size: alvision.int;
//    protected max_cdims: alvision.int;
//    protected cdims: alvision.int;
//    protected dims: Array<alvision.int>;//[CV_MAX_DIM];
//    protected total_size: alvision.int;
//    protected hist_type: alvision.int;
//    protected hist_count: alvision.int;
//    protected uniform: alvision.int;
//    protected gen_random_hist: alvision.int;
//    protected gen_hist_max_val: alvision.double;
//    protected gen_hist_sparse_nz_ratio: alvision.double;

//    protected init_ranges: alvision.int;
//    protected img_type: alvision.int;
//    protected img_max_log_size: alvision.int;
//    protected double
//    protected low: alvision.double;
//    protected high: alvision.double;
//    protected range_delta: alvision.double;
//    protected img_size: alvision.Size;

//    protected hist: Array<CvHistogram*> ;
//    protected  _ranges: Array<alvision.float>;
//    protected ranges: Array<float*> ;
//    protected test_cpp: boolean;
//};




//////////////// testing operation for reading/writing individual histogram bins //////////////

//class CV_QueryHistTest extends CV_BaseHistTest
//{
//    constructor() {
//        super();
//        this.hist_count = 1;
//        this.indices = 0;
//        this.values = 0;
//        this.values0 = 0;
//    }

//    clear(): void {
//        cvReleaseMat( &indices);
//        cvReleaseMat( &values);
//        cvReleaseMat( &values0);
//        super.clear();

//    }

//    run_func(): void {
//        int i, iters = values.cols;
//        CvArr * h = hist[0].bins;
//        const int* idx = indices.data.i;
//        float * val = values.data.fl;
//        float default_value = 0.f;

//        // stage 1: write bins
//        if (cdims == 1)
//            for (i = 0; i < iters; i++) {
//                float v0 = values0.data.fl[i];
//                if (Math.abs(v0 - default_value) < FLT_EPSILON)
//                    continue;
//                if (!(i % 2)) {
//                    if (!(i % 4))
//                        cvSetReal1D(h, idx[i], v0);
//                    else
//                    *(float *)cvPtr1D(h, idx[i]) = v0;
//                }
//                else
//                    cvSetRealND(h, idx + i, v0);
//            }
//        else if (cdims == 2)
//            for (i = 0; i < iters; i++) {
//                float v0 = values0.data.fl[i];
//                if (Math.abs(v0 - default_value) < FLT_EPSILON)
//                    continue;
//                if (!(i % 2)) {
//                    if (!(i % 4))
//                        cvSetReal2D(h, idx[i * 2], idx[i * 2 + 1], v0);
//                    else
//                    *(float *)cvPtr2D(h, idx[i * 2], idx[i * 2 + 1]) = v0;
//                }
//                else
//                    cvSetRealND(h, idx + i * 2, v0);
//            }
//        else if (cdims == 3)
//            for (i = 0; i < iters; i++) {
//                float v0 = values0.data.fl[i];
//                if (Math.abs(v0 - default_value) < FLT_EPSILON)
//                    continue;
//                if (!(i % 2)) {
//                    if (!(i % 4))
//                        cvSetReal3D(h, idx[i * 3], idx[i * 3 + 1], idx[i * 3 + 2], v0);
//                    else
//                    *(float *)cvPtr3D(h, idx[i * 3], idx[i * 3 + 1], idx[i * 3 + 2]) = v0;
//                }
//                else
//                    cvSetRealND(h, idx + i * 3, v0);
//            }
//        else
//            for (i = 0; i < iters; i++) {
//                float v0 = values0.data.fl[i];
//                if (Math.abs(v0 - default_value) < FLT_EPSILON)
//                    continue;
//                if (!(i % 2))
//                    cvSetRealND(h, idx + i * cdims, v0);
//                else
//                *(float *)cvPtrND(h, idx + i * cdims) = v0;
//            }

//        // stage 2: read bins
//        if (cdims == 1)
//            for (i = 0; i < iters; i++) {
//                if (!(i % 2))
//                    val[i] = *(float *)cvPtr1D(h, idx[i]);
//            else
//            val[i] = (float)cvGetReal1D(h, idx[i]);
//    }
//    else if(cdims == 2)
//    for(i = 0; i < iters; i++ )
//    {
//        if (!(i % 2))
//            val[i] = *(float *)cvPtr2D(h, idx[i * 2], idx[i * 2 + 1]);
//            else
//    val[i] = (float)cvGetReal2D(h, idx[i * 2], idx[i * 2 + 1]);
//}
//    else if (cdims == 3)
//    for (i = 0; i < iters; i++) {
//        if (!(i % 2))
//            val[i] = *(float *)cvPtr3D(h, idx[i * 3], idx[i * 3 + 1], idx[i * 3 + 2]);
//            else
//        val[i] = (float)cvGetReal3D(h, idx[i * 3], idx[i * 3 + 1], idx[i * 3 + 2]);
//    }
//else
//    for (i = 0; i < iters; i++) {
//        if (!(i % 2))
//            val[i] = *(float *)cvPtrND(h, idx + i * cdims);
//            else
//        val[i] = (float)cvGetRealND(h, idx + i * cdims);
//    }
//    }
//    prepare_test_case(test_case_idx: alvision.int): alvision.int{
//        int code = CV_BaseHistTest::prepare_test_case(test_case_idx);

//        if (code > 0) {
//            int i, j, iters;
//            float default_value = 0.f;
//            var rng = this.ts.get_rng();
//            CvMat * bit_mask = 0;
//            int * idx;

//            iters = (alvision.cvtest.randInt(rng) % MAX(total_size / 10, 100)) + 1;
//            iters = MIN(iters, total_size * 9 / 10 + 1);

//            indices = cvCreateMat(1, iters * cdims, alvision.MatrixType.CV_32S);
//            values = cvCreateMat(1, iters, alvision.MatrixType.CV_32F);
//            values0 = cvCreateMat(1, iters, alvision.MatrixType.CV_32F);
//            idx = indices.data.i;

//            //console.log(util.format( "total_size = %d, cdims = %d, iters = %d\n", total_size, cdims, iters );

//            bit_mask = cvCreateMat(1, (total_size + 7) / 8, alvision.MatrixType.CV_8U);
//            cvZero(bit_mask);

//            #define GET_BIT(n)(bit_mask.data.ptr[(n) / 8] & (1 << ((n) & 7)))
//            #define SET_BIT(n) bit_mask.data.ptr[(n) / 8] |= (1 << ((n) & 7))

//            // set random histogram bins' values to the linear indices of the bins
//            for (i = 0; i < iters; i++) {
//                int lin_idx = 0;
//                for (j = 0; j < cdims; j++) {
//                    int t = alvision.cvtest.randInt(rng) % dims[j];
//                    idx[i * cdims + j] = t;
//                    lin_idx = lin_idx * dims[j] + t;
//                }

//                if (alvision.cvtest.randInt(rng) % 8 || GET_BIT(lin_idx)) {
//                    values0.data.fl[i] = (float)(lin_idx + 1);
//                    SET_BIT(lin_idx);
//                }
//                else
//                    // some histogram bins will not be initialized intentionally,
//                    // they should be equal to the default value
//                    values0.data.fl[i] = default_value;
//            }

//            // do the second pass to make values0 consistent with bit_mask
//            for (i = 0; i < iters; i++) {
//                int lin_idx = 0;
//                for (j = 0; j < cdims; j++)
//                    lin_idx = lin_idx * dims[j] + idx[i * cdims + j];

//                if (GET_BIT(lin_idx))
//                    values0.data.fl[i] = (float)(lin_idx + 1);
//            }

//            cvReleaseMat( &bit_mask);
//        }

//        return code;
//    }
//    validate_test_results(test_case_idx : alvision.int) : alvision.int {}
//    init_hist(test_case_idx: alvision.int, i: alvision.int): void {
//        if (this.hist_type == CV_HIST_ARRAY)
//            cvZero(hist[i].bins);

//    }

//    protected indices: alvision.Mat;
//    protected values  : alvision.Mat;
//    protected values0 : alvision.Mat;
//};




//int CV_QueryHistTest::validate_test_results( int /*test_case_idx*/ )
//{
//    int code = alvision.cvtest.FailureCode.OK;
//    int i, j, iters = values.cols;

//    for( i = 0; i < iters; i++ )
//    {
//        float v = values.data.fl[i], v0 = values0.data.fl[i];

//        if( isNaN(v) || !isFinite(v) )
//        {
//            ts.printf( alvision.cvtest.TSConstants.LOG, "The bin #%d has invalid value\n", i );
//            code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
//        }
//        else if( Math.abs(v - v0) > FLT_EPSILON )
//        {
//            ts.printf( alvision.cvtest.TSConstants.LOG, "The bin #%d = %g, while it should be %g\n", i, v, v0 );
//            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//        }

//        if( code < 0 )
//        {
//            ts.printf( alvision.cvtest.TSConstants.LOG, "The bin index = (" );
//            for( j = 0; j < cdims; j++ )
//                ts.printf( alvision.cvtest.TSConstants.LOG, "%d%s", indices.data.i[i*cdims + j],
//                                        j < cdims-1 ? ", " : ")\n" );
//            break;
//        }
//    }

//    if( code < 0 )
//        this.ts.set_failed_test_info( code );
//    return code;
//}


//////////////// cvGetMinMaxHistValue //////////////

//class CV_MinMaxHistTest extends CV_BaseHistTest
//{
//    constructor() {
//        super();
//        this.hist_count = 1;
//        this.gen_random_hist = 1;
//    }
//    run_func() : void {}
//    void init_hist(int, int);
//    validate_test_results(test_case_idx : alvision.int) : alvision.int {}
//    int min_idx[CV_MAX_DIM], max_idx[CV_MAX_DIM];
//    float min_val, max_val;
//    int min_idx0[CV_MAX_DIM], max_idx0[CV_MAX_DIM];
//    float min_val0, max_val0;
//};


//void CV_MinMaxHistTest::init_hist(int test_case_idx, int hist_i)
//{
//    int i, eq = 1;
//    var rng = this.ts.get_rng();
//    CV_BaseHistTest::init_hist( test_case_idx, hist_i );

//    for(;;)
//    {
//        for( i = 0; i < cdims; i++ )
//        {
//            min_idx0[i] = alvision.cvtest.randInt(rng) % dims[i];
//            max_idx0[i] = alvision.cvtest.randInt(rng) % dims[i];
//            eq &= min_idx0[i] == max_idx0[i];
//        }
//        if( !eq || total_size == 1 )
//            break;
//    }

//    min_val0 = (float)(-alvision.cvtest.randReal(rng)*10 - FLT_EPSILON);
//    max_val0 = (float)(alvision.cvtest.randReal(rng)*10 + FLT_EPSILON + gen_hist_max_val);

//    if( total_size == 1 )
//        min_val0 = max_val0;

//    cvSetRealND( hist[0].bins, min_idx0, min_val0 );
//    cvSetRealND( hist[0].bins, max_idx0, max_val0 );
//}


//void CV_MinMaxHistTest::run_func(void)
//{
//    if( hist_type != CV_HIST_ARRAY && test_cpp )
//    {
//        alvision.SparseMat h;
//        ((CvSparseMat*)hist[0].bins).copyToSparseMat(h);
//        double _min_val = 0, _max_val = 0;
//        alvision.minMaxLoc(h, &_min_val, &_max_val, min_idx, max_idx );
//        min_val = (float)_min_val;
//        max_val = (float)_max_val;
//    }
//    else
//        cvGetMinMaxHistValue( hist[0], &min_val, &max_val, min_idx, max_idx );
//}


//int CV_MinMaxHistTest::validate_test_results( int /*test_case_idx*/ )
//{
//    int code = alvision.cvtest.FailureCode.OK;

//    if( isNaN(min_val) || !isFinite(min_val) ||
//        isNaN(max_val) || !isFinite(max_val) )
//    {
//        ts.printf( alvision.cvtest.TSConstants.LOG,
//            "The extrema histogram bin values are invalid (min = %g, max = %g)\n", min_val, max_val );
//        code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
//    }
//    else if( Math.abs(min_val - min_val0) > FLT_EPSILON ||
//             Math.abs(max_val - max_val0) > FLT_EPSILON )
//    {
//        ts.printf( alvision.cvtest.TSConstants.LOG,
//            "The extrema histogram bin values are incorrect: (min = %g, should be = %g), (max = %g, should be = %g)\n",
//            min_val, min_val0, max_val, max_val0 );
//        code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//    }
//    else
//    {
//        int i;
//        for( i = 0; i < cdims; i++ )
//        {
//            if( min_idx[i] != min_idx0[i] || max_idx[i] != max_idx0[i] )
//            {
//                ts.printf( alvision.cvtest.TSConstants.LOG,
//                    "The %d-th coordinates of extrema histogram bin values are incorrect: "
//                    "(min = %d, should be = %d), (max = %d, should be = %d)\n",
//                    i, min_idx[i], min_idx0[i], max_idx[i], max_idx0[i] );
//                code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//            }
//        }
//    }

//    if( code < 0 )
//        this.ts.set_failed_test_info( code );
//    return code;
//}


//////////////// cvNormalizeHist //////////////

//class CV_NormHistTest extends CV_BaseHistTest
//{
//public:
//    CV_NormHistTest();

//protected:
//    prepare_test_case(test_case_idx : alvision.int) : alvision.int{}
//    run_func() : void {}
//    validate_test_results(test_case_idx : alvision.int) : alvision.int {}
//    double factor;
//};



//CV_NormHistTest::CV_NormHistTest()
//{
//    hist_count = 1;
//    gen_random_hist = 1;
//    factor = 0;
//}


//int CV_NormHistTest::prepare_test_case( int test_case_idx )
//{
//    int code = CV_BaseHistTest::prepare_test_case( test_case_idx );

//    if( code > 0 )
//    {
//        var rng = this.ts.get_rng();
//        factor = alvision.cvtest.randReal(rng)*10 + 0.1;
//        if( hist_type == CV_HIST_SPARSE &&
//            ((CvSparseMat*)hist[0].bins).heap.active_count == 0 )
//            factor = 0;
//    }

//    return code;
//}


//void CV_NormHistTest::run_func(void)
//{
//    if( hist_type != CV_HIST_ARRAY && test_cpp )
//    {
//        alvision.SparseMat h;
//        ((CvSparseMat*)hist[0].bins).copyToSparseMat(h);
//        alvision.normalize(h, h, factor, CV_L1);
//        cvReleaseSparseMat((CvSparseMat**)&hist[0].bins);
//        hist[0].bins = cvCreateSparseMat(h);
//    }
//    else
//        cvNormalizeHist( hist[0], factor );
//}


//int CV_NormHistTest::validate_test_results( int /*test_case_idx*/ )
//{
//    int code = alvision.cvtest.FailureCode.OK;
//    double sum = 0;

//    if( hist_type == CV_HIST_ARRAY )
//    {
//        int i;
//        const float* ptr = (float*)cvPtr1D( hist[0].bins, 0 );

//        for( i = 0; i < total_size; i++ )
//            sum += ptr[i];
//    }
//    else
//    {
//        CvSparseMat* sparse = (CvSparseMat*)hist[0].bins;
//        CvSparseMatIterator iterator;
//        CvSparseNode *node;

//        for( node = cvInitSparseMatIterator( sparse, &iterator );
//             node != 0; node = cvGetNextSparseNode( &iterator ))
//        {
//            sum += *(float*)CV_NODE_VAL(sparse,node);
//        }
//    }

//    if( isNaN(sum) || !isFinite(sum) )
//    {
//        ts.printf( alvision.cvtest.TSConstants.LOG,
//            "The normalized histogram has invalid sum =%g\n", sum );
//        code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
//    }
//    else if( Math.abs(sum - factor) > FLT_EPSILON*10*Math.abs(factor) )
//    {
//        ts.printf( alvision.cvtest.TSConstants.LOG,
//            "The normalized histogram has incorrect sum =%g, while it should be =%g\n", sum, factor );
//        code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//    }

//    if( code < 0 )
//        this.ts.set_failed_test_info( code );
//    return code;
//}


//////////////// cvThreshHist //////////////

//class CV_ThreshHistTest extends CV_BaseHistTest
//{
//public:
//    CV_ThreshHistTest();
//    ~CV_ThreshHistTest();
//    clear() : void {}

//protected:
//    prepare_test_case(test_case_idx : alvision.int) : alvision.int{}
//    run_func() : void {}
//    validate_test_results(test_case_idx : alvision.int) : alvision.int {}
//    CvMat* indices;
//    CvMat* values;
//    int orig_nz_count;

//    double threshold;
//};



//CV_ThreshHistTest::CV_ThreshHistTest()
//{
//    hist_count = 1;
//    gen_random_hist = 1;
//    threshold = 0;
//    indices = values = 0;
//}


//CV_ThreshHistTest::~CV_ThreshHistTest()
//{
//    clear();
//}


//void CV_ThreshHistTest::clear()
//{
//    cvReleaseMat( &indices );
//    cvReleaseMat( &values );
//    CV_BaseHistTest::clear();
//}


//int CV_ThreshHistTest::prepare_test_case( int test_case_idx )
//{
//    int code = CV_BaseHistTest::prepare_test_case( test_case_idx );

//    if( code > 0 )
//    {
//        var rng = this.ts.get_rng();
//        threshold = alvision.cvtest.randReal(rng)*gen_hist_max_val;

//        if( hist_type == CV_HIST_ARRAY )
//        {
//            orig_nz_count = total_size;

//            values = cvCreateMat(1, total_size, alvision.MatrixType.CV_32F );
//            memcpy( values.data.fl, cvPtr1D( hist[0].bins, 0 ), total_size*sizeof(float) );
//        }
//        else
//        {
//            CvSparseMat* sparse = (CvSparseMat*)hist[0].bins;
//            CvSparseMatIterator iterator;
//            CvSparseNode* node;
//            int i, k;

//            orig_nz_count = sparse.heap.active_count;

//            values = cvCreateMat(1, orig_nz_count + 1, alvision.MatrixType.CV_32F );
//            indices = cvCreateMat( 1, (orig_nz_count+1)*cdims, CV_32S );

//            for( node = cvInitSparseMatIterator( sparse, &iterator ), i = 0;
//                 node != 0; node = cvGetNextSparseNode( &iterator ), i++ )
//            {
//                 const int* idx = CV_NODE_IDX(sparse,node);

//                 OPENCV_ASSERT( i < orig_nz_count, "CV_ThreshHistTest::prepare_test_case", "Buffer overflow" );

//                 values.data.fl[i] = *(float*)CV_NODE_VAL(sparse,node);
//                 for( k = 0; k < cdims; k++ )
//                     indices.data.i[i*cdims + k] = idx[k];
//            }

//            OPENCV_ASSERT( i == orig_nz_count, "Unmatched buffer size",
//                "CV_ThreshHistTest::prepare_test_case" );
//        }
//    }

//    return code;
//}


//void CV_ThreshHistTest::run_func(void)
//{
//    cvThreshHist( hist[0], threshold );
//}


//int CV_ThreshHistTest::validate_test_results( int /*test_case_idx*/ )
//{
//    int code = alvision.cvtest.FailureCode.OK;
//    int i;
//    float* ptr0 = values.data.fl;
//    float* ptr = 0;
//    CvSparseMat* sparse = 0;

//    if( hist_type == CV_HIST_ARRAY )
//        ptr = (float*)cvPtr1D( hist[0].bins, 0 );
//    else
//        sparse = (CvSparseMat*)hist[0].bins;

//    if( code > 0 )
//    {
//        for( i = 0; i < orig_nz_count; i++ )
//        {
//            float v0 = ptr0[i], v;

//            if( hist_type == CV_HIST_ARRAY )
//                v = ptr[i];
//            else
//            {
//                v = (float)cvGetRealND( sparse, indices.data.i + i*cdims );
//                cvClearND( sparse, indices.data.i + i*cdims );
//            }

//            if( v0 <= threshold ) v0 = 0.f;
//            if( isNaN(v) || !isFinite(v) )
//            {
//                ts.printf( alvision.cvtest.TSConstants.LOG, "The %d-th bin is invalid (=%g)\n", i, v );
//                code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
//                break;
//            }
//            else if( Math.abs(v0 - v) > FLT_EPSILON*10*Math.abs(v0) )
//            {
//                ts.printf( alvision.cvtest.TSConstants.LOG, "The %d-th bin is incorrect (=%g, should be =%g)\n", i, v, v0 );
//                code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//                break;
//            }
//        }
//    }

//    if( code > 0 && hist_type == CV_HIST_SPARSE )
//    {
//        if( sparse.heap.active_count > 0 )
//        {
//            ts.printf( alvision.cvtest.TSConstants.LOG,
//                "There some extra histogram bins in the sparse histogram after the thresholding\n" );
//            code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
//        }
//    }

//    if( code < 0 )
//        this.ts.set_failed_test_info( code );
//    return code;
//}


//////////////// cvCompareHist //////////////

//class CV_CompareHistTest extends CV_BaseHistTest
//{
//    protected MAX_METHOD = 6;

//    constructor() {
//        super();
//        this.hist_count = 2;
//        this.gen_random_hist = 1;
//    }

//    prepare_test_case(test_case_idx: alvision.int): alvision.int{
//        int code = CV_BaseHistTest::prepare_test_case(test_case_idx);

//        return code;
//    }
//    run_func(): void {
//        int k;
//        if (hist_type != CV_HIST_ARRAY && test_cpp) {
//            alvision.SparseMat h0, h1;
//            ((CvSparseMat *)hist[0].bins).copyToSparseMat(h0);
//            ((CvSparseMat *)hist[1].bins).copyToSparseMat(h1);
//            for (k = 0; k < MAX_METHOD; k++)
//                result[k] = alvision.compareHist(h0, h1, k);
//        }
//        else
//            for (k = 0; k < MAX_METHOD; k++)
//                result[k] = cvCompareHist(hist[0], hist[1], k);
//    }
//    validate_test_results(test_case_idx: alvision.int): alvision.int {
//        int code = alvision.cvtest.FailureCode.OK;
//        int i;
//        double result0[MAX_METHOD + 1];
//        double s0 = 0, s1 = 0, sq0 = 0, sq1 = 0, t;

//        for (i = 0; i < MAX_METHOD; i++)
//            result0[i] = 0;

//        if (hist_type == CV_HIST_ARRAY) {
//            float * ptr0 = (float *)cvPtr1D(hist[0].bins, 0);
//            float * ptr1 = (float *)cvPtr1D(hist[1].bins, 0);

//            for (i = 0; i < total_size; i++) {
//                double v0 = ptr0[i], v1 = ptr1[i];
//                result0[CV_COMP_CORREL] += v0 * v1;
//                result0[CV_COMP_INTERSECT] += MIN(v0, v1);
//                if (Math.abs(v0) > DBL_EPSILON)
//                    result0[CV_COMP_CHISQR] += (v0 - v1) * (v0 - v1) / v0;
//                if (Math.abs(v0 + v1) > DBL_EPSILON)
//                    result0[CV_COMP_CHISQR_ALT] += (v0 - v1) * (v0 - v1) / (v0 + v1);
//                s0 += v0;
//                s1 += v1;
//                sq0 += v0 * v0;
//                sq1 += v1 * v1;
//                result0[CV_COMP_BHATTACHARYYA] += sqrt(v0 * v1);
//                {
//                    if (Math.abs(v0) <= DBL_EPSILON)
//                        continue;
//                    if (Math.abs(v1) <= DBL_EPSILON)
//                        v1 = 1e-10;
//                    result0[CV_COMP_KL_DIV] += v0 * Math.log(v0 / v1);
//                }
//            }
//        }
//        else {
//            CvSparseMat * sparse0 = (CvSparseMat *)hist[0].bins;
//            CvSparseMat * sparse1 = (CvSparseMat *)hist[1].bins;
//            CvSparseMatIterator iterator;
//            CvSparseNode * node;

//            for (node = cvInitSparseMatIterator(sparse0, &iterator);
//                node != 0; node = cvGetNextSparseNode( &iterator)) {
//                const int* idx = CV_NODE_IDX(sparse0, node);
//                double v0 = *(float *)CV_NODE_VAL(sparse0, node);
//                double v1 = (float)cvGetRealND(sparse1, idx);

//                result0[CV_COMP_CORREL] += v0 * v1;
//                result0[CV_COMP_INTERSECT] += MIN(v0, v1);
//                if (Math.abs(v0) > DBL_EPSILON)
//                    result0[CV_COMP_CHISQR] += (v0 - v1) * (v0 - v1) / v0;
//                if (Math.abs(v0 + v1) > DBL_EPSILON)
//                    result0[CV_COMP_CHISQR_ALT] += (v0 - v1) * (v0 - v1) / (v0 + v1);
//                s0 += v0;
//                sq0 += v0 * v0;
//                result0[CV_COMP_BHATTACHARYYA] += sqrt(v0 * v1);
//                {
//                    if (v0 <= DBL_EPSILON)
//                        continue;
//                    if (!v1)
//                        v1 = 1e-10;
//                    result0[CV_COMP_KL_DIV] += v0 * Math.log(v0 / v1);
//                }
//            }

//            for (node = cvInitSparseMatIterator(sparse1, &iterator);
//                node != 0; node = cvGetNextSparseNode( &iterator)) {
//                double v1 = *(float *)CV_NODE_VAL(sparse1, node);
//                s1 += v1;
//                sq1 += v1 * v1;
//            }
//        }

//        result0[CV_COMP_CHISQR_ALT] *= 2;

//        t = (sq0 - s0 * s0 / total_size) * (sq1 - s1 * s1 / total_size);
//        result0[CV_COMP_CORREL] = Math.abs(t) > DBL_EPSILON ?
//            (result0[CV_COMP_CORREL] - s0 * s1 / total_size) / sqrt(t) : 1;

//        s1 *= s0;
//        s0 = result0[CV_COMP_BHATTACHARYYA];
//        s0 = 1. - s0 * (s1 > FLT_EPSILON ? 1. / sqrt(s1) : 1.);
//        result0[CV_COMP_BHATTACHARYYA] = sqrt(MAX(s0, 0.));

//        for (i = 0; i < MAX_METHOD; i++) {
//            double v = result[i], v0 = result0[i];
//            const char* method_name =
//                i == CV_COMP_CHISQR ? "Chi-Square" :
//                    i == CV_COMP_CHISQR_ALT ? "Alternative Chi-Square" :
//                        i == CV_COMP_CORREL ? "Correlation" :
//                            i == CV_COMP_INTERSECT ? "Intersection" :
//                                i == CV_COMP_BHATTACHARYYA ? "Bhattacharyya" :
//                                    i == CV_COMP_KL_DIV ? "Kullback-Leibler" : "Unknown";

//            if (isNaN(v) || !isFinite(v)) {
//                ts.printf(alvision.cvtest.TSConstants.LOG, "The comparison result using the method #%d (%s) is invalid (=%g)\n",
//                    i, method_name, v);
//                code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
//                break;
//            }
//            else if (Math.abs(v0 - v) > FLT_EPSILON * 14 * MAX(Math.abs(v0), 0.1)) {
//                ts.printf(alvision.cvtest.TSConstants.LOG, "The comparison result using the method #%d (%s)\n\tis inaccurate (=%g, should be =%g)\n",
//                    i, method_name, v, v0);
//                code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//                break;
//            }
//        }

//        if (code < 0)
//            this.ts.set_failed_test_info(code);
//        return code;
//    }
//    double result[MAX_METHOD+1];
//};



//////////////// cvCalcHist //////////////

//class CV_CalcHistTest extends CV_BaseHistTest
//{
//public:
//    CV_CalcHistTest();
//    ~CV_CalcHistTest();
//    clear() : void {}

//protected:
//    prepare_test_case(test_case_idx : alvision.int) : alvision.int{}
//    run_func() : void {}
//    validate_test_results(test_case_idx : alvision.int) : alvision.int {}
//    IplImage* images[CV_MAX_DIM+1];
//    int channels[CV_MAX_DIM+1];
//};



//CV_CalcHistTest::CV_CalcHistTest()
//{
//    int i;

//    hist_count = 2;
//    gen_random_hist = 0;
//    init_ranges = 1;

//    for( i = 0; i <= CV_MAX_DIM; i++ )
//    {
//        images[i] = 0;
//        channels[i] = 0;
//    }
//}


//CV_CalcHistTest::~CV_CalcHistTest()
//{
//    clear();
//}


//void CV_CalcHistTest::clear()
//{
//    int i;

//    for( i = 0; i <= CV_MAX_DIM; i++ )
//        cvReleaseImage( &images[i] );

//    CV_BaseHistTest::clear();
//}


//int CV_CalcHistTest::prepare_test_case( int test_case_idx )
//{
//    int code = CV_BaseHistTest::prepare_test_case( test_case_idx );

//    if( code > 0 )
//    {
//        var rng = this.ts.get_rng();
//        int i;

//        for( i = 0; i <= CV_MAX_DIM; i++ )
//        {
//            if( i < cdims )
//            {
//                int nch = 1; //alvision.cvtest.randInt(rng) % 3 + 1;
//                images[i] = cvCreateImage( img_size,
//                    img_type == alvision.MatrixType.CV_8U ? IPL_DEPTH_8U : IPL_DEPTH_32F, nch );
//                channels[i] = alvision.cvtest.randInt(rng) % nch;
//                Mat images_i = cvarrToMat(images[i]);

//                alvision.cvtest.randUni( rng, images_i, Scalar.all(low), Scalar.all(high) );
//            }
//            else if( i == CV_MAX_DIM && alvision.cvtest.randInt(rng) % 2 )
//            {
//                // create mask
//                images[i] = cvCreateImage( img_size, IPL_DEPTH_8U, 1 );
//                Mat images_i = cvarrToMat(images[i]);

//                // make ~25% pixels in the mask non-zero
//                alvision.cvtest.randUni( rng, images_i, Scalar.all(-2), Scalar.all(2) );
//            }
//        }
//    }

//    return code;
//}


//void CV_CalcHistTest::run_func(void)
//{
//    cvCalcHist( images, hist[0], 0, images[CV_MAX_DIM] );
//}


//static void
//cvTsCalcHist( IplImage** _images, CvHistogram* hist, IplImage* _mask, int* channels )
//{
//    int x, y, k, cdims;
//    union
//    {
//        float* fl;
//        uchar* ptr;
//    }
//    plane[CV_MAX_DIM];
//    int nch[CV_MAX_DIM];
//    int dims[CV_MAX_DIM];
//    int uniform = CV_IS_UNIFORM_HIST(hist);
//    alvision.Size img_size = cvGetSize(_images[0]);
//    CvMat images[CV_MAX_DIM], mask = cvMat(1, 1, alvision.MatrixType.CV_8U);
//    int img_depth = _images[0].depth;

//    cdims = cvGetDims( hist.bins, dims );

//    cvZero( hist.bins );

//    for( k = 0; k < cdims; k++ )
//    {
//        cvGetMat( _images[k], &images[k] );
//        nch[k] = _images[k].nChannels;
//    }

//    if( _mask )
//        cvGetMat( _mask, &mask );

//    for( y = 0; y < img_size.height; y++ )
//    {
//        const uchar* mptr = _mask ? &CV_MAT_ELEM(mask, uchar, y, 0 ) : 0;

//        if( img_depth == IPL_DEPTH_8U )
//            for( k = 0; k < cdims; k++ )
//                plane[k].ptr = &CV_MAT_ELEM(images[k], uchar, y, 0 ) + channels[k];
//        else
//            for( k = 0; k < cdims; k++ )
//                plane[k].fl = &CV_MAT_ELEM(images[k], float, y, 0 ) + channels[k];

//        for( x = 0; x < img_size.width; x++ )
//        {
//            float val[CV_MAX_DIM];
//            int idx[CV_MAX_DIM];

//            if( mptr && !mptr[x] )
//                continue;
//            if( img_depth == IPL_DEPTH_8U )
//                for( k = 0; k < cdims; k++ )
//                    val[k] = plane[k].ptr[x*nch[k]];
//            else
//                for( k = 0; k < cdims; k++ )
//                    val[k] = plane[k].fl[x*nch[k]];

//            idx[cdims-1] = -1;

//            if( uniform )
//            {
//                for( k = 0; k < cdims; k++ )
//                {
//                    double v = val[k], lo = hist.thresh[k][0], hi = hist.thresh[k][1];
//                    idx[k] = Math.floor((v - lo)*dims[k]/(hi - lo));
//                    if( idx[k] < 0 || idx[k] >= dims[k] )
//                        break;
//                }
//            }
//            else
//            {
//                for( k = 0; k < cdims; k++ )
//                {
//                    float v = val[k];
//                    float* t = hist.thresh2[k];
//                    int j, n = dims[k];

//                    for( j = 0; j <= n; j++ )
//                        if( v < t[j] )
//                            break;
//                    if( j <= 0 || j > n )
//                        break;
//                    idx[k] = j-1;
//                }
//            }

//            if( k < cdims )
//                continue;

//            (*(float*)cvPtrND( hist.bins, idx ))++;
//        }
//    }
//}


//int CV_CalcHistTest::validate_test_results( int /*test_case_idx*/ )
//{
//    int code = alvision.cvtest.FailureCode.OK;
//    double diff;
//    cvTsCalcHist( images, hist[1], images[CV_MAX_DIM], channels );
//    diff = cvCompareHist( hist[0], hist[1], CV_COMP_CHISQR );
//    if( diff > DBL_EPSILON )
//    {
//        ts.printf( alvision.cvtest.TSConstants.LOG, "The histogram does not match to the reference one\n" );
//        code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;

//    }

//    if( code < 0 )
//        this.ts.set_failed_test_info( code );
//    return code;
//}


//CV_CalcHistTest hist_calc_test;



//////////////// cvCalcBackProject //////////////

//class CV_CalcBackProjectTest extends CV_BaseHistTest
//{
//public:
//    CV_CalcBackProjectTest();
//    ~CV_CalcBackProjectTest();
//    clear() : void {}

//protected:
//    prepare_test_case(test_case_idx : alvision.int) : alvision.int{}
//    run_func() : void {}
//    validate_test_results(test_case_idx : alvision.int) : alvision.int {}
//    IplImage* images[CV_MAX_DIM+3];
//    int channels[CV_MAX_DIM+3];
//};



//CV_CalcBackProjectTest::CV_CalcBackProjectTest()
//{
//    int i;

//    hist_count = 1;
//    gen_random_hist = 0;
//    init_ranges = 1;

//    for( i = 0; i < CV_MAX_DIM+3; i++ )
//    {
//        images[i] = 0;
//        channels[i] = 0;
//    }
//}


//CV_CalcBackProjectTest::~CV_CalcBackProjectTest()
//{
//    clear();
//}


//void CV_CalcBackProjectTest::clear()
//{
//    int i;

//    for( i = 0; i < CV_MAX_DIM+3; i++ )
//        cvReleaseImage( &images[i] );

//    CV_BaseHistTest::clear();
//}


//int CV_CalcBackProjectTest::prepare_test_case( int test_case_idx )
//{
//    int code = CV_BaseHistTest::prepare_test_case( test_case_idx );

//    if( code > 0 )
//    {
//        var rng = this.ts.get_rng();
//        int i, j, n, img_len = img_size.width*img_size.height;

//        for( i = 0; i < CV_MAX_DIM + 3; i++ )
//        {
//            if( i < cdims )
//            {
//                int nch = 1; //alvision.cvtest.randInt(rng) % 3 + 1;
//                images[i] = cvCreateImage( img_size,
//                    img_type == alvision.MatrixType.CV_8U ? IPL_DEPTH_8U : IPL_DEPTH_32F, nch );
//                channels[i] = alvision.cvtest.randInt(rng) % nch;

//                Mat images_i = cvarrToMat(images[i]);
//                alvision.cvtest.randUni( rng, images_i, Scalar.all(low), Scalar.all(high) );
//            }
//            else if( i == CV_MAX_DIM && alvision.cvtest.randInt(rng) % 2 )
//            {
//                // create mask
//                images[i] = cvCreateImage( img_size, IPL_DEPTH_8U, 1 );
//                Mat images_i = cvarrToMat(images[i]);
//                // make ~25% pixels in the mask non-zero
//                alvision.cvtest.randUni( rng, images_i, Scalar.all(-2), Scalar.all(2) );
//            }
//            else if( i > CV_MAX_DIM )
//            {
//                images[i] = cvCreateImage( img_size, images[0].depth, 1 );
//            }
//        }

//        cvTsCalcHist( images, hist[0], images[CV_MAX_DIM], channels );

//        // now modify the images a bit to add some zeros go to the backprojection
//        n = alvision.cvtest.randInt(rng) % (img_len/20+1);
//        for( i = 0; i < cdims; i++ )
//        {
//            char* data = images[i].imageData;
//            for( j = 0; j < n; j++ )
//            {
//                int idx = alvision.cvtest.randInt(rng) % img_len;
//                double val = alvision.cvtest.randReal(rng)*(high - low) + low;

//                if (img_type == alvision.MatrixType.CV_8U )
//                    ((uchar*)data)[idx] = (uchar)Math.round(val);
//                else
//                    ((float*)data)[idx] = (float)val;
//            }
//        }
//    }

//    return code;
//}


//void CV_CalcBackProjectTest::run_func(void)
//{
//    cvCalcBackProject( images, images[CV_MAX_DIM+1], hist[0] );
//}


//static void
//cvTsCalcBackProject( IplImage** images, IplImage* dst, CvHistogram* hist, int* channels )
//{
//    int x, y, k, cdims;
//    union
//    {
//        float* fl;
//        uchar* ptr;
//    }
//    plane[CV_MAX_DIM];
//    int nch[CV_MAX_DIM];
//    int dims[CV_MAX_DIM];
//    int uniform = CV_IS_UNIFORM_HIST(hist);
//    alvision.Size img_size = cvGetSize(images[0]);
//    int img_depth = images[0].depth;

//    cdims = cvGetDims( hist.bins, dims );

//    for( k = 0; k < cdims; k++ )
//        nch[k] = images[k].nChannels;

//    for( y = 0; y < img_size.height; y++ )
//    {
//        if( img_depth == IPL_DEPTH_8U )
//            for( k = 0; k < cdims; k++ )
//                plane[k].ptr = &CV_IMAGE_ELEM(images[k], uchar, y, 0 ) + channels[k];
//        else
//            for( k = 0; k < cdims; k++ )
//                plane[k].fl = &CV_IMAGE_ELEM(images[k], float, y, 0 ) + channels[k];

//        for( x = 0; x < img_size.width; x++ )
//        {
//            float val[CV_MAX_DIM];
//            float bin_val = 0;
//            int idx[CV_MAX_DIM];

//            if( img_depth == IPL_DEPTH_8U )
//                for( k = 0; k < cdims; k++ )
//                    val[k] = plane[k].ptr[x*nch[k]];
//            else
//                for( k = 0; k < cdims; k++ )
//                    val[k] = plane[k].fl[x*nch[k]];
//            idx[cdims-1] = -1;

//            if( uniform )
//            {
//                for( k = 0; k < cdims; k++ )
//                {
//                    double v = val[k], lo = hist.thresh[k][0], hi = hist.thresh[k][1];
//                    idx[k] = Math.floor((v - lo)*dims[k]/(hi - lo));
//                    if( idx[k] < 0 || idx[k] >= dims[k] )
//                        break;
//                }
//            }
//            else
//            {
//                for( k = 0; k < cdims; k++ )
//                {
//                    float v = val[k];
//                    float* t = hist.thresh2[k];
//                    int j, n = dims[k];

//                    for( j = 0; j <= n; j++ )
//                        if( v < t[j] )
//                            break;
//                    if( j <= 0 || j > n )
//                        break;
//                    idx[k] = j-1;
//                }
//            }

//            if( k == cdims )
//                bin_val = (float)cvGetRealND( hist.bins, idx );

//            if( img_depth == IPL_DEPTH_8U )
//            {
//                int t = Math.round(bin_val);
//                CV_IMAGE_ELEM( dst, uchar, y, x ) = alvision.saturate_cast<uchar>(t);
//            }
//            else
//                CV_IMAGE_ELEM( dst, float, y, x ) = bin_val;
//        }
//    }
//}


//int CV_CalcBackProjectTest::validate_test_results( int /*test_case_idx*/ )
//{
//    int code = alvision.cvtest.FailureCode.OK;

//    cvTsCalcBackProject( images, images[CV_MAX_DIM+2], hist[0], channels );
//    Mat a = cvarrToMat(images[CV_MAX_DIM+1]), b = cvarrToMat(images[CV_MAX_DIM+2]);
//    double threshold = a.depth() == alvision.MatrixType.CV_8U ? 2 : FLT_EPSILON;
//    code = alvision.cvtest.cmpEps2( ts, a, b, threshold, true, "Back project image" );

//    if( code < 0 )
//        this.ts.set_failed_test_info( code );

//    return code;
//}


//////////////// cvCalcBackProjectPatch //////////////

//class CV_CalcBackProjectPatchTest extends CV_BaseHistTest
//{
//public:
//    CV_CalcBackProjectPatchTest();
//    ~CV_CalcBackProjectPatchTest();
//    clear() : void {}

//protected:
//    prepare_test_case(test_case_idx : alvision.int) : alvision.int{}
//    run_func() : void {}
//    validate_test_results(test_case_idx : alvision.int) : alvision.int {}
//    IplImage* images[CV_MAX_DIM+2];
//    int channels[CV_MAX_DIM+2];

//    alvision.Size patch_size;
//    double factor;
//    int method;
//};



//CV_CalcBackProjectPatchTest::CV_CalcBackProjectPatchTest()
//{
//    int i;

//    hist_count = 1;
//    gen_random_hist = 0;
//    init_ranges = 1;
//    img_max_log_size = 6;

//    for( i = 0; i < CV_MAX_DIM+2; i++ )
//    {
//        images[i] = 0;
//        channels[i] = 0;
//    }
//}


//CV_CalcBackProjectPatchTest::~CV_CalcBackProjectPatchTest()
//{
//    clear();
//}


//void CV_CalcBackProjectPatchTest::clear()
//{
//    int i;

//    for( i = 0; i < CV_MAX_DIM+2; i++ )
//        cvReleaseImage( &images[i] );

//    CV_BaseHistTest::clear();
//}


//int CV_CalcBackProjectPatchTest::prepare_test_case( int test_case_idx )
//{
//    int code = CV_BaseHistTest::prepare_test_case( test_case_idx );

//    if( code > 0 )
//    {
//        var rng = this.ts.get_rng();
//        int i, j, n, img_len = img_size.width*img_size.height;

//        patch_size.width = alvision.cvtest.randInt(rng) % img_size.width + 1;
//        patch_size.height = alvision.cvtest.randInt(rng) % img_size.height + 1;
//        patch_size.width = MIN( patch_size.width, 30 );
//        patch_size.height = MIN( patch_size.height, 30 );

//        factor = 1.;
//        method = alvision.cvtest.randInt(rng) % CV_CompareHistTest::MAX_METHOD;

//        for( i = 0; i < CV_MAX_DIM + 2; i++ )
//        {
//            if( i < cdims )
//            {
//                int nch = 1; //alvision.cvtest.randInt(rng) % 3 + 1;
//                images[i] = cvCreateImage( img_size,
//                    img_type == alvision.MatrixType.CV_8U ? IPL_DEPTH_8U : IPL_DEPTH_32F, nch );
//                channels[i] = alvision.cvtest.randInt(rng) % nch;

//                Mat images_i = cvarrToMat(images[i]);
//                alvision.cvtest.randUni( rng, images_i, Scalar.all(low), Scalar.all(high) );
//            }
//            else if( i >= CV_MAX_DIM )
//            {
//                images[i] = cvCreateImage(
//                    alvision.Size(img_size.width - patch_size.width + 1,
//                           img_size.height - patch_size.height + 1),
//                    IPL_DEPTH_32F, 1 );
//            }
//        }

//        cvTsCalcHist( images, hist[0], 0, channels );
//        cvNormalizeHist( hist[0], factor );

//        // now modify the images a bit
//        n = alvision.cvtest.randInt(rng) % (img_len/10+1);
//        for( i = 0; i < cdims; i++ )
//        {
//            char* data = images[i].imageData;
//            for( j = 0; j < n; j++ )
//            {
//                int idx = alvision.cvtest.randInt(rng) % img_len;
//                double val = alvision.cvtest.randReal(rng)*(high - low) + low;

//                if (img_type == alvision.MatrixType.CV_8U )
//                    ((uchar*)data)[idx] = (uchar)Math.round(val);
//                else
//                    ((float*)data)[idx] = (float)val;
//            }
//        }
//    }

//    return code;
//}


//void CV_CalcBackProjectPatchTest::run_func(void)
//{
//    cvCalcBackProjectPatch( images, images[CV_MAX_DIM], patch_size, hist[0], method, factor );
//}


//static void
//cvTsCalcBackProjectPatch( IplImage** images, IplImage* dst, alvision.Size patch_size,
//                          CvHistogram* hist, int method,
//                          double factor, int* channels )
//{
//    CvHistogram* model = 0;

//    IplImage imgstub[CV_MAX_DIM], *img[CV_MAX_DIM];
//    IplROI roi;
//    int i, dims;
//    int x, y;
//    alvision.Size size = cvGetSize(dst);

//    dims = cvGetDims( hist.bins );
//    cvCopyHist( hist, &model );
//    cvNormalizeHist( hist, factor );
//    cvZero( dst );

//    for( i = 0; i < dims; i++ )
//    {
//        CvMat stub, *mat;
//        mat = cvGetMat( images[i], &stub, 0, 0 );
//        img[i] = cvGetImage( mat, &imgstub[i] );
//        img[i].roi = &roi;
//    }

//    roi.coi = 0;

//    for( y = 0; y < size.height; y++ )
//    {
//        for( x = 0; x < size.width; x++ )
//        {
//            double result;

//            roi.xOffset = x;
//            roi.yOffset = y;
//            roi.width = patch_size.width;
//            roi.height = patch_size.height;

//            cvTsCalcHist( img, model, 0, channels );
//            cvNormalizeHist( model, factor );
//            result = cvCompareHist( model, hist, method );
//            CV_IMAGE_ELEM( dst, float, y, x ) = (float)result;
//        }
//    }

//    cvReleaseHist( &model );
//}


//int CV_CalcBackProjectPatchTest::validate_test_results( int /*test_case_idx*/ )
//{
//    int code = alvision.cvtest.FailureCode.OK;
//    double err_level = 5e-3;

//    cvTsCalcBackProjectPatch( images, images[CV_MAX_DIM+1],
//        patch_size, hist[0], method, factor, channels );

//    Mat a = cvarrToMat(images[CV_MAX_DIM]), b = cvarrToMat(images[CV_MAX_DIM+1]);
//    code = alvision.cvtest.cmpEps2( ts, a, b, err_level, true, "BackProjectPatch result" );

//    if( code < 0 )
//        this.ts.set_failed_test_info( code );

//    return code;
//}


//////////////// cvCalcBayesianProb //////////////

//class CV_BayesianProbTest extends CV_BaseHistTest
//{
//public:
//    enum { MAX_METHOD = 4 };

//    CV_BayesianProbTest();
//protected:
//    prepare_test_case(test_case_idx : alvision.int) : alvision.int{}
//    run_func() : void {}
//    validate_test_results(test_case_idx : alvision.int) : alvision.int {}
//    init_hist(test_case_idx : alvision.int, i : alvision.int) : void {}
//    get_hist_params(test_case_idx : alvision.int) : void {}
//};



//CV_BayesianProbTest::CV_BayesianProbTest()
//{
//    hist_count = CV_MAX_DIM;
//    gen_random_hist = 1;
//}


//void CV_BayesianProbTest::get_hist_params( int test_case_idx )
//{
//    CV_BaseHistTest::get_hist_params( test_case_idx );
//    hist_type = CV_HIST_ARRAY;
//}


//void CV_BayesianProbTest::init_hist( int test_case_idx, int hist_i )
//{
//    if( hist_i < hist_count/2 )
//        CV_BaseHistTest::init_hist( test_case_idx, hist_i );
//}


//int CV_BayesianProbTest::prepare_test_case( int test_case_idx )
//{
//    var rng = this.ts.get_rng();

//    hist_count = (alvision.cvtest.randInt(rng) % (MAX_HIST/2-1) + 2)*2;
//    hist_count = MIN( hist_count, MAX_HIST );
//    int code = CV_BaseHistTest::prepare_test_case( test_case_idx );

//    return code;
//}


//void CV_BayesianProbTest::run_func(void)
//{
//    cvCalcBayesianProb( &hist[0], hist_count/2, &hist[hist_count/2] );
//}


//int CV_BayesianProbTest::validate_test_results( int /*test_case_idx*/ )
//{
//    int code = alvision.cvtest.FailureCode.OK;
//    int i, j, n = hist_count/2;
//    double s[CV_MAX_DIM];
//    const double err_level = 1e-5;

//    for( i = 0; i < total_size; i++ )
//    {
//        double sum = 0;
//        for( j = 0; j < n; j++ )
//        {
//            double v = hist[j].mat.data.fl[i];
//            sum += v;
//            s[j] = v;
//        }
//        sum = sum > DBL_EPSILON ? 1./sum : 0;

//        for( j = 0; j < n; j++ )
//        {
//            double v0 = s[j]*sum;
//            double v = hist[j+n].mat.data.fl[i];

//            if( isNaN(v) || !isFinite(v) )
//            {
//                ts.printf( alvision.cvtest.TSConstants.LOG,
//                    "The element #%d in the destination histogram #%d is invalid (=%g)\n",
//                    i, j, v );
//                code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
//                break;
//            }
//            else if( Math.abs(v0 - v) > err_level*Math.abs(v0) )
//            {
//                ts.printf( alvision.cvtest.TSConstants.LOG,
//                    "The element #%d in the destination histogram #%d is inaccurate (=%g, should be =%g)\n",
//                    i, j, v, v0 );
//                code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//                break;
//            }
//        }
//        if( j < n )
//            break;
//    }

//    if( code < 0 )
//        this.ts.set_failed_test_info( code );
//    return code;
//}

////////////////////////////////////////////////////////////////////////////////////////////////////////

//alvision.cvtest.TEST('Imgproc_Hist_Calc', 'accuracy', () => { CV_CalcHistTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_Hist_Query', 'accuracy', () => { CV_QueryHistTest test; test.safe_run(); });

//alvision.cvtest.TEST('Imgproc_Hist_Compare', 'accuracy', () => { CV_CompareHistTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_Hist_Threshold', 'accuracy', () => { CV_ThreshHistTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_Hist_Normalize', 'accuracy', () => { CV_NormHistTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_Hist_MinMaxVal', 'accuracy', () => { CV_MinMaxHistTest test; test.safe_run(); });

//alvision.cvtest.TEST('Imgproc_Hist_CalcBackProject', 'accuracy', () => { CV_CalcBackProjectTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_Hist_CalcBackProjectPatch', 'accuracy', () => { CV_CalcBackProjectPatchTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_Hist_BayesianProb', 'accuracy', () => { CV_BayesianProbTest test; test.safe_run(); });

///* End Of File */
