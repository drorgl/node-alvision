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
////
////#define OCL_TUNING_MODE 0
////#if OCL_TUNING_MODE
////#define OCL_TUNING_MODE_ONLY(code) code
////#else
////#define OCL_TUNING_MODE_ONLY(code)
////#endif

//// image moments
//class CV_MomentsTest extends alvision.cvtest.ArrayTest
//{
//    constructor() {
//        super();
//        this.test_array[this.INPUT].push(null);
//        this.test_array[this.OUTPUT].push(null);
//        this.test_array[this.REF_OUTPUT].push(null);
//        this.coi = -1;
//        this.is_binary = false;
//        OCL_TUNING_MODE_ONLY(test_case_count = 10);
//        //element_wise_relative_error = false;
//    }


//    //enum { MOMENT_COUNT = 25 };
//    prepare_test_case(test_case_idx: alvision.int): alvision.int {
//        var code = super.prepare_test_case(test_case_idx);
//        if (code > 0) {
//            var cn = this.test_mat[this.INPUT][0].channels();
//            if (cn > 1)
//                cvSetImageCOI((IplImage *)this.test_array[INPUT][0], coi + 1);
//        }

//        return code;
//    }
//    prepare_to_validation(test_case_idx : alvision.int ) : void{
//        var src = this.test_mat[this.INPUT][0];

//        var m = new alvision.Moments();
//    var mdata = this.test_mat[this.REF_OUTPUT][0].ptr<alvision.double>("double");
//    var depth = src.depth();
//    var cn = src.channels();
//    var i, cols = src.cols;
//    var xc = 0., yc = 0.;

//    memset( &m, 0, sizeof(m));

//    for (var y = 0; y < src.rows; y++) {
//        var s0 = 0, s1 = 0, s2 = 0, s3 = 0;
//        uchar * ptr = src.ptr(y);
//        for (var x = 0; x < cols; x++) {
//            double val;
//            if (depth == alvision.MatrixType.CV_8U)
//                val = ptr[x * cn + coi];
//            else if (depth == CV_16U)
//                val = ((ushort *)ptr)[x * cn + coi];
//            else if (depth == CV_16S)
//                val = ((short *)ptr)[x * cn + coi];
//            else
//            val = ((float *)ptr)[x * cn + coi];

//            if (is_binary)
//                val = val != 0;

//            s0 += val;
//            s1 += val * x;
//            s2 += val * x * x;
//            s3 += ((val * x) * x) * x;
//        }

//        m.m00 += s0;
//        m.m01 += s0 * y;
//        m.m02 += (s0 * y) * y;
//        m.m03 += ((s0 * y) * y) * y;

//        m.m10 += s1;
//        m.m11 += s1 * y;
//        m.m12 += (s1 * y) * y;

//        m.m20 += s2;
//        m.m21 += s2 * y;

//        m.m30 += s3;
//    }

//    if (m.m00 != 0) {
//        xc = m.m10 / m.m00, yc = m.m01 / m.m00;
//        m.inv_sqrt_m00 = 1. / sqrt(Math.abs(m.m00));
//    }

//    for (y = 0; y < src.rows; y++) {
//        double s0 = 0, s1 = 0, s2 = 0, s3 = 0, y1 = y - yc;
//        uchar * ptr = src.ptr(y);
//        for (x = 0; x < cols; x++) {
//            double val, x1 = x - xc;
//            if (depth == alvision.MatrixType.CV_8U)
//                val = ptr[x * cn + coi];
//            else if (depth == CV_16U)
//                val = ((ushort *)ptr)[x * cn + coi];
//            else if (depth == CV_16S)
//                val = ((short *)ptr)[x * cn + coi];
//            else
//            val = ((float *)ptr)[x * cn + coi];

//            if (is_binary)
//                val = val != 0;

//            s0 += val;
//            s1 += val * x1;
//            s2 += val * x1 * x1;
//            s3 += ((val * x1) * x1) * x1;
//        }

//        m.mu02 += s0 * y1 * y1;
//        m.mu03 += ((s0 * y1) * y1) * y1;

//        m.mu11 += s1 * y1;
//        m.mu12 += (s1 * y1) * y1;

//        m.mu20 += s2;
//        m.mu21 += s2 * y1;

//        m.mu30 += s3;
//    }

//    memcpy(mdata, &m, sizeof(m));
//    mdata += sizeof(m) / sizeof(m.m00);

//    /* calc normalized moments */
//    {
//        double inv_m00 = m.inv_sqrt_m00 * m.inv_sqrt_m00;
//        double s2 = inv_m00 * inv_m00; /* 1./(m00 ^ (2/2 + 1)) */
//        double s3 = s2 * m.inv_sqrt_m00; /* 1./(m00 ^ (3/2 + 1)) */

//        mdata[0] = m.mu20 * s2;
//        mdata[1] = m.mu11 * s2;
//        mdata[2] = m.mu02 * s2;

//        mdata[3] = m.mu30 * s3;
//        mdata[4] = m.mu21 * s3;
//        mdata[5] = m.mu12 * s3;
//        mdata[6] = m.mu03 * s3;
//    }

//    double * a = test_mat[REF_OUTPUT][0].ptr<double>();
//    double * b = test_mat[OUTPUT][0].ptr<double>();
//    for (i = 0; i < MOMENT_COUNT; i++) {
//        if (Math.abs(a[i]) < 1e-3)
//            a[i] = 0;
//        if (Math.abs(b[i]) < 1e-3)
//            b[i] = 0;
//    }
//    }
//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array < Array < alvision.Size >>,types: Array<Array<alvision.int>>): void {
//        var rng = this.ts.get_rng();
//        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
//    var cn = (alvision.cvtest.randInt(rng) % 4) + 1;
//        var depth = alvision.cvtest.randInt(rng) % 4;
//        depth = depth == 0 ? CV_8U : depth == 1 ? CV_16U : depth == 2 ? CV_16S : CV_32F;

//        is_binary = alvision.cvtest.randInt(rng) % 2 != 0;
//        if(depth == 0 && !is_binary)
//        try_umat = alvision.cvtest.randInt(rng) % 5 != 0;
//        else
//        try_umat = alvision.cvtest.randInt(rng) % 2 != 0;

//        if(cn == 2 || try_umat)
//        cn = 1;

//        OCL_TUNING_MODE_ONLY(
//            cn = 1;
//    depth = CV_8U;
//        try_umat = true;
//        is_binary = false;
//        sizes[INPUT][0] = Size(1024, 768)
//    );

//    types[INPUT][0] = CV_MAKETYPE(depth, cn);
//    types[OUTPUT][0] = types[REF_OUTPUT][0] = CV_64FC1;
//    sizes[OUTPUT][0] = sizes[REF_OUTPUT][0] = alvision.Size(MOMENT_COUNT, 1);
//    if (CV_MAT_DEPTH(types[INPUT][0]) >= CV_32S)
//        sizes[INPUT][0].width = MAX(sizes[INPUT][0].width, 3);

//    coi = 0;
//    cvmat_allowed = true;
//    if (cn > 1) {
//        coi = alvision.cvtest.randInt(rng) % cn;
//        cvmat_allowed = false;
//    }
//    }
//    get_minmax_bounds(i : alvision.int, j : alvision.int, type : alvision.int, low : alvision.Scalar, high : alvision.Scalar) : void {
//        super.get_minmax_bounds(i, j, type, low, high);
//        var depth = CV_MAT_DEPTH(type);

//        if(depth == alvision.MatrixType.CV_16U) {
//            low = alvision.Scalar.all(0);
//            high = Scalar.all(1000);
//        }
//    else if(depth == alvision.MatrixType.CV_16S) {
//            low = Scalar.all(-1000);
//            high = Scalar.all(1000);
//        }
//    else if(depth == alvision.MatrixType.CV_32F) {
//            low = Scalar.all(-1);
//            high = Scalar.all(1);
//        }
//    }
//    get_success_error_level(test_case_idx : alvision.int, i : alvision.int, j  : alvision.int) : alvision.double {
//        var depth = this.test_mat[this.INPUT][0].depth();
//        return depth != CV_32F ? FLT_EPSILON * 10 : FLT_EPSILON * 100;
//    }
//    run_func() : void{
//    CvMoments * m = (CvMoments *)test_mat[OUTPUT][0].ptr<double>();
//    double * others = (double *)(m + 1);
//    if (try_umat) {
//        UMat u;
//        test_mat[INPUT][0].clone().copyTo(u);
//        OCL_TUNING_MODE_ONLY(
//            static double ttime = 0;
//            static int ncalls = 0;
//        moments(u, is_binary != 0);
//        double t = (double)getTickCount());
//        Moments new_m = moments(u, is_binary != 0);
//        OCL_TUNING_MODE_ONLY(
//            ttime += (double)getTickCount() - t;
//        ncalls++;
//        console.log(util.format("%g\n", ttime / ncalls / u.total()));
//        *m = new_m;
//    }
//    else
//        cvMoments(test_array[INPUT][0], m, is_binary);

//    others[0] = cvGetNormalizedCentralMoment(m, 2, 0);
//    others[1] = cvGetNormalizedCentralMoment(m, 1, 1);
//    others[2] = cvGetNormalizedCentralMoment(m, 0, 2);
//    others[3] = cvGetNormalizedCentralMoment(m, 3, 0);
//    others[4] = cvGetNormalizedCentralMoment(m, 2, 1);
//    others[5] = cvGetNormalizedCentralMoment(m, 1, 2);
//    others[6] = cvGetNormalizedCentralMoment(m, 0, 3);
//    }
//    protected coi : alvision.int;
//    protected  is_binary: boolean;
//    protected  try_umat: boolean;
//}

//function sqr(x: number): number {
//    return x * x;
//}

//// Hu invariants
//class CV_HuMomentsTest extends alvision.cvtest.ArrayTest {
//    constructor() {
//        super();
//        this.test_array[this.INPUT].push(null);
//        this.test_array[this.OUTPUT].push(null);
//        this.test_array[this.REF_OUTPUT].push(null);
//    }

//    const MOMENT_COUNT = 18;
//    const HU_MOMENT_COUNT = 7;

//    prepare_test_case(test_case_idx: alvision.int): alvision.int {
//        var code = super.prepare_test_case(test_case_idx);
//        if (code > 0) {
//            // ...
//        }

//        return code;
//    }
//    prepare_to_validation(test_case_idx: alvision.int): void {
//        CvMoments * m = this.test_mat[this.INPUT][0].ptr<CvMoments>();
//        CvHuMoments * hu = this.test_mat[this.REF_OUTPUT][0].ptr<CvHuMoments>();

//        var inv_m00 = m.inv_sqrt_m00 * m.inv_sqrt_m00;
//        var s2 = inv_m00 * inv_m00; /* 1./(m00 ^ (2/2 + 1)) */
//        var s3 = s2 * m .inv_sqrt_m00; /* 1./(m00 ^ (3/2 + 1)) */

//        var nu20 = m.mu20 * s2;
//        var nu11 = m.mu11 * s2;
//        var nu02 = m.mu02 * s2;

//        var nu30 = m.mu30 * s3;
//        var nu21 = m.mu21 * s3;
//        var nu12 = m.mu12 * s3;
//        var nu03 = m.mu03 * s3;

//        //#undef sqr
//        //#define sqr(a)((a) * (a))

//        hu.hu1 = nu20 + nu02;
//        hu.hu2 = sqr(nu20 - nu02) + 4 * sqr(nu11);
//        hu.hu3 = sqr(nu30 - 3 * nu12) + sqr(3 * nu21 - nu03);
//        hu.hu4 = sqr(nu30 + nu12) + sqr(nu21 + nu03);
//        hu.hu5 = (nu30 - 3 * nu12) * (nu30 + nu12) * (sqr(nu30 + nu12) - 3 * sqr(nu21 + nu03)) +
//            (3 * nu21 - nu03) * (nu21 + nu03) * (3 * sqr(nu30 + nu12) - sqr(nu21 + nu03));
//        hu.hu6 = (nu20 - nu02) * (sqr(nu30 + nu12) - sqr(nu21 + nu03)) +
//            4 * nu11 * (nu30 + nu12) * (nu21 + nu03);
//        hu.hu7 = (3 * nu21 - nu03) * (nu30 + nu12) * (sqr(nu30 + nu12) - 3 * sqr(nu21 + nu03)) +
//            (3 * nu12 - nu30) * (nu21 + nu03) * (3 * sqr(nu30 + nu12) - sqr(nu21 + nu03));
//    }
//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        types[this.INPUT][0] = types[this.OUTPUT][0] = types[this.REF_OUTPUT][0] = CV_64FC1;
//        sizes[this.INPUT][0] = alvision.Size(MOMENT_COUNT, 1);
//        sizes[this.OUTPUT][0] = sizes[this.REF_OUTPUT][0] = alvision.Size(HU_MOMENT_COUNT, 1);
//    }
//    get_minmax_bounds(i: alvision.int, j: alvision.int, type: alvision.int, low: alvision.Scalar, high: alvision.Scalar): void {
//        super.get_minmax_bounds(i, j, type, low, high);
//        low = alvision.Scalar.all(-10000);//DROR: will not work!
//        high = alvision.Scalar.all(10000);
//    }
//    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
//        return alvision.FLT_EPSILON;
//    }
//    run_func(): void {
//        cvGetHuMoments(test_mat[INPUT][0].ptr<CvMoments>(),
//            test_mat[OUTPUT][0].ptr<CvHuMoments>());
//    }
//}




//alvision.cvtest.TEST('Imgproc_Moments', 'accuracy', () => { var test = new CV_MomentsTest(); test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_HuMoments', 'accuracy', () => { var test = new CV_HuMomentsTest(); test.safe_run(); });

//class CV_SmallContourMomentTest extends alvision.cvtest.BaseTest {

//    run(iii: alvision.int): void {
//        try {
//            var points  = Array < alvision.Point > ();
//            points.push(new alvision.Point(50, 56));
//            points.push(new alvision.Point(53, 53));
//            points.push(new alvision.Point(46, 54));
//            points.push(new alvision.Point(49, 51));

//            Moments m = moments(points, false);
//            var area = alvision.contourArea(points);

//            alvision.CV_Assert(m.m00 == 0 && m.m01 == 0 && m.m10 == 0 && area == 0);
//        }
//        catch (e)
//        {
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
//        }
//    }
//}

//alvision.cvtest.TEST('Imgproc_ContourMoment', 'small', () => { var test = new CV_SmallContourMomentTest(); test.safe_run(); });
