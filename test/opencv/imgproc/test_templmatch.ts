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
//import colors = require("colors");
//import async = require("async");
//import alvision = require("../../../tsbinding/alvision");
//import util = require('util');
//import fs = require('fs');

////#include "test_precomp.hpp"
////
////using namespace cv;
////using namespace std;

//class CV_TemplMatchTest extends alvision.cvtest.ArrayTest
//{
//    constructor() {
//        super();
//        this.test_array[this.INPUT].push(null);
//        this.test_array[this.INPUT].push(null);
//        this.test_array[this.OUTPUT].push(null);
//        this.test_array[this.REF_OUTPUT].push(null);
//        this.element_wise_relative_error = false;
//        this.max_template_size = 100;
//        this.method = 0;
//        this.test_cpp = false;
//    }

//    read_params(fs: alvision.FileStorage): alvision.int{
//        var code = super.read_params(fs);
//        if (code < 0)
//            return code;

//        this.max_template_size =  this.find_param(fs, "max_template_size").readInt(this.max_template_size);
//        this.max_template_size = alvision.cvtest.clipInt(this.max_template_size, 1, 100);

//        return code;
//    }
//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        var rng = this.ts.get_rng();
//        var depth = alvision.cvtest.randInt(rng).valueOf() % 2, cn = alvision.cvtest.randInt(rng).valueOf() & 1 ? 3 : 1;
//        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        depth = depth == 0 ? alvision.MatrixType.CV_8U : alvision.MatrixType.CV_32F;

//        types[this.INPUT][0] = types[this.INPUT][1] = alvision.MatrixType.CV_MAKETYPE(depth, cn);
//        types[this.OUTPUT][0] = types[this.REF_OUTPUT][0] = alvision.MatrixType.CV_32FC1;

//        sizes[this.INPUT][1].width = alvision.cvtest.randInt(rng).valueOf() % Math.min(sizes[this.INPUT][1].width.valueOf(), this.max_template_size) + 1;
//        sizes[this.INPUT][1].height = alvision.cvtest.randInt(rng).valueOf() % Math.min(sizes[this.INPUT][1].height.valueOf(), this.max_template_size) + 1;
//        sizes[this.OUTPUT][0].width = sizes[this.INPUT][0].width  .valueOf() - sizes[INPUT][1].width   .valueOf() + 1;
//        sizes[this.OUTPUT][0].height = sizes[this.INPUT][0].height.valueOf() - sizes[INPUT][1].height.valueOf() + 1;
//        sizes[this.REF_OUTPUT][0] = sizes[this.OUTPUT][0];

//        this.method = alvision.cvtest.randInt(rng).valueOf() % 6;
//        this.test_cpp = (alvision.cvtest.randInt(rng).valueOf() & 256) == 0;
//    }
//    get_minmax_bounds(i: alvision.int, j: alvision.int, type: alvision.int, low: alvision.Scalar, high: alvision.Scalar): void {
//        super.get_minmax_bounds(i, j, type, low, high);
//        var depth = CV_MAT_DEPTH(type);
//        if (depth == alvision.MatrixType.CV_32F) {
//            low = Scalar.all(-10.);
//            high = Scalar.all(10.);
//        }
//    }
//    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
//        if (this.test_mat[this.INPUT][1].depth() == CV_8U ||
//            (this.method >= CV_TM_CCOEFF && this.test_mat[this.INPUT][1].cols * this.test_mat[this.INPUT][1].rows <= 2))
//            return 1e-2;
//        else
//            return 1e-3;
//    }
//    run_func(): void {
//        if (!this.test_cpp)
//            cvMatchTemplate(test_array[INPUT][0], test_array[INPUT][1], test_array[OUTPUT][0], method);
//        else {
//            alvision.Mat _out = alvision.cvarrToMat(test_array[OUTPUT][0]);
//            alvision.matchTemplate(alvision.cvarrToMat(test_array[INPUT][0]), alvision.cvarrToMat(test_array[INPUT][1]), _out, method);
//        }
//    }
//    prepare_to_validation(test_case_idx: alvision.int): void {
//        CvMat _input = this.test_mat[this.INPUT][0], _templ = this.test_mat[this.INPUT][1];
//        CvMat _output = this.test_mat[this.REF_OUTPUT][0];
//        cvTsMatchTemplate( &_input, &_templ, &_output, method);

//        //if( ts.get_current_test_info().test_case_idx == 0 )
//        /*{
//            CvFileStorage* fs = cvOpenFileStorage( "_match_template.yml", 0, CV_STORAGE_WRITE );
//            cvWrite( fs, "image", &test_mat[INPUT][0] );
//            cvWrite( fs, "template", &test_mat[INPUT][1] );
//            cvWrite( fs, "ref", &test_mat[REF_OUTPUT][0] );
//            cvWrite( fs, "opencv", &test_mat[OUTPUT][0] );
//            cvWriteInt( fs, "method", method );
//            cvReleaseFileStorage( &fs );
//        }*/

//        if (method >= CV_TM_CCOEFF) {
//            // avoid numerical stability problems in singular cases (when the results are near to 0)
//            const delta = 10.;
//            this.test_mat[this.REF_OUTPUT][0] += alvision.Scalar.all(delta);
//            this.test_mat[this.OUTPUT][0] += alvision.Scalar.all(delta);
//        }
//    }

//    protected max_template_size: alvision.int;
//    protected method: alvision.int;
//    protected test_cpp: boolean;
//};



//function cvTsMatchTemplate(img: alvision.Mat, templ : alvision.Mat, result : alvision.Mat, method  :alvision.int) : void
//{
//    int i, j, k, l;
//    int depth = CV_MAT_DEPTH(img.type), cn = CV_MAT_CN(img.type);
//    int width_n = templ.cols*cn, height = templ.rows;
//    int a_step = img.step / CV_ELEM_SIZE(img.type & CV_MAT_DEPTH_MASK);
//    int b_step = templ.step / CV_ELEM_SIZE(templ.type & CV_MAT_DEPTH_MASK);
//    CvScalar b_mean, b_sdv;
//    double b_denom = 1., b_sum2 = 0;
//    int area = templ.rows*templ.cols;

//    cvAvgSdv(templ, &b_mean, &b_sdv);

//    for( i = 0; i < cn; i++ )
//        b_sum2 += (b_sdv.val[i]*b_sdv.val[i] + b_mean.val[i]*b_mean.val[i])*area;

//    if( b_sdv.val[0]*b_sdv.val[0] + b_sdv.val[1]*b_sdv.val[1] +
//        b_sdv.val[2]*b_sdv.val[2] + b_sdv.val[3]*b_sdv.val[3] < DBL_EPSILON &&
//        method == CV_TM_CCOEFF_NORMED )
//    {
//        cvSet( result, alvision.Scalar.all(1.) );
//        return;
//    }

//    if( method & 1 )
//    {
//        b_denom = 0;
//        if( method != CV_TM_CCOEFF_NORMED )
//        {
//            b_denom = b_sum2;
//        }
//        else
//        {
//            for( i = 0; i < cn; i++ )
//                b_denom += b_sdv.val[i]*b_sdv.val[i]*area;
//        }
//        b_denom = sqrt(b_denom);
//        if( b_denom == 0 )
//            b_denom = 1.;
//    }

//    assert( CV_TM_SQDIFF <= method && method <= CV_TM_CCOEFF_NORMED );

//    for( i = 0; i < result.rows; i++ )
//    {
//        for( j = 0; j < result.cols; j++ )
//        {
//            CvScalar a_sum(0), a_sum2(0);
//            CvScalar ccorr(0);
//            double value = 0.;

//            if( depth == CV_8U )
//            {
//                const uchar* a = img.data.ptr + i*img.step + j*cn;
//                const uchar* b = templ.data.ptr;

//                if( cn == 1 || method < CV_TM_CCOEFF )
//                {
//                    for( k = 0; k < height; k++, a += a_step, b += b_step )
//                        for( l = 0; l < width_n; l++ )
//                        {
//                            ccorr.val[0] += a[l]*b[l];
//                            a_sum.val[0] += a[l];
//                            a_sum2.val[0] += a[l]*a[l];
//                        }
//                }
//                else
//                {
//                    for( k = 0; k < height; k++, a += a_step, b += b_step )
//                        for( l = 0; l < width_n; l += 3 )
//                        {
//                            ccorr.val[0] += a[l]*b[l];
//                            ccorr.val[1] += a[l+1]*b[l+1];
//                            ccorr.val[2] += a[l+2]*b[l+2];
//                            a_sum.val[0] += a[l];
//                            a_sum.val[1] += a[l+1];
//                            a_sum.val[2] += a[l+2];
//                            a_sum2.val[0] += a[l]*a[l];
//                            a_sum2.val[1] += a[l+1]*a[l+1];
//                            a_sum2.val[2] += a[l+2]*a[l+2];
//                        }
//                }
//            }
//            else
//            {
//                const float* a = (const float*)(img.data.ptr + i*img.step) + j*cn;
//                const float* b = (const float*)templ.data.ptr;

//                if( cn == 1 || method < CV_TM_CCOEFF )
//                {
//                    for( k = 0; k < height; k++, a += a_step, b += b_step )
//                        for( l = 0; l < width_n; l++ )
//                        {
//                            ccorr.val[0] += a[l]*b[l];
//                            a_sum.val[0] += a[l];
//                            a_sum2.val[0] += a[l]*a[l];
//                        }
//                }
//                else
//                {
//                    for( k = 0; k < height; k++, a += a_step, b += b_step )
//                        for( l = 0; l < width_n; l += 3 )
//                        {
//                            ccorr.val[0] += a[l]*b[l];
//                            ccorr.val[1] += a[l+1]*b[l+1];
//                            ccorr.val[2] += a[l+2]*b[l+2];
//                            a_sum.val[0] += a[l];
//                            a_sum.val[1] += a[l+1];
//                            a_sum.val[2] += a[l+2];
//                            a_sum2.val[0] += a[l]*a[l];
//                            a_sum2.val[1] += a[l+1]*a[l+1];
//                            a_sum2.val[2] += a[l+2]*a[l+2];
//                        }
//                }
//            }

//            switch( method )
//            {
//            case CV_TM_CCORR:
//            case CV_TM_CCORR_NORMED:
//                value = ccorr.val[0];
//                break;
//            case CV_TM_SQDIFF:
//            case CV_TM_SQDIFF_NORMED:
//                value = (a_sum2.val[0] + b_sum2 - 2*ccorr.val[0]);
//                break;
//            default:
//                value = (ccorr.val[0] - a_sum.val[0]*b_mean.val[0]+
//                         ccorr.val[1] - a_sum.val[1]*b_mean.val[1]+
//                         ccorr.val[2] - a_sum.val[2]*b_mean.val[2]);
//            }

//            if( method & 1 )
//            {
//                double denom;

//                // calc denominator
//                if( method != CV_TM_CCOEFF_NORMED )
//                {
//                    denom = a_sum2.val[0] + a_sum2.val[1] + a_sum2.val[2];
//                }
//                else
//                {
//                    denom = a_sum2.val[0] - (a_sum.val[0]*a_sum.val[0])/area;
//                    denom += a_sum2.val[1] - (a_sum.val[1]*a_sum.val[1])/area;
//                    denom += a_sum2.val[2] - (a_sum.val[2]*a_sum.val[2])/area;
//                }
//                denom = sqrt(MAX(denom,0))*b_denom;
//                if( Math.abs(value) < denom )
//                    value /= denom;
//                else if( Math.abs(value) < denom*1.125 )
//                    value = value > 0 ? 1 : -1;
//                else
//                    value = method != CV_TM_SQDIFF_NORMED ? 0 : 1;
//            }

//            ((float*)(result.data.ptr + result.step*i))[j] = (float)value;
//        }
//    }
//}


//alvision.cvtest.TEST('Imgproc_MatchTemplate', 'accuracy', () => { var test = new CV_TemplMatchTest(); test.safe_run(); });
