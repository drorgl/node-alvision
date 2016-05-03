/*M///////////////////////////////////////////////////////////////////////////////////////
//
//  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
//
//  By downloading, copying, installing or using the software you agree to this license.
//  If you do not agree to this license, do not download, install,
//  copy or use the software.
//
//
//                        Intel License Agreement
//                For Open Source Computer Vision Library
//
// Copyright (C) 2000, Intel Corporation, all rights reserved.
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
//   * The name of Intel Corporation may not be used to endorse or promote products
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

import tape = require("tape");
import path = require("path");
import colors = require("colors");
import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');


//#include "test_precomp.hpp"
//
//using namespace cv;
//using namespace std;

class CV_CannyTest extends alvision.cvtest.ArrayTest
{
    constructor() {
        super();

        this.test_array[alvision.cvtest._ArrayTestInternal.INPUT].push(null);
        this.test_array[alvision.cvtest._ArrayTestInternal.OUTPUT].push(null);
        this.test_array[alvision.cvtest._ArrayTestInternal.REF_OUTPUT].push(null);
        this.element_wise_relative_error = true;
        this.aperture_size = 0;
        this.use_true_gradient = false;
        this.threshold1 = this.threshold2 = 0;

        this.test_cpp = false;
    }

//protected:
    get_test_array_types_and_sizes(test_case_idx: alvision.int,
        sizes: Array<Array<alvision.Size>>,
        types: Array<Array<alvision.int>>): void {
        var rng = this.ts.get_rng();
        var thresh_range: alvision.double;

        
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
        types[alvision.cvtest._ArrayTestInternal.INPUT][0] = types[alvision.cvtest._ArrayTestInternal.OUTPUT][0] = types[alvision.cvtest._ArrayTestInternal.REF_OUTPUT][0] = alvision.MatrixType.CV_8U;

        this.aperture_size = alvision.cvtest.randInt(rng).valueOf() % 2 ? 5 : 3;
        thresh_range = this.aperture_size == 3 ? 300 : 1000;

        this.threshold1 = alvision.cvtest.randReal(rng).valueOf() * thresh_range.valueOf();
        this.threshold2 = alvision.cvtest.randReal(rng).valueOf() * thresh_range.valueOf() * 0.3;

        if (alvision.cvtest.randInt(rng).valueOf() % 2 )
        CV_SWAP(threshold1, threshold2, thresh_range);

        this.use_true_gradient = alvision.cvtest.randInt(rng).valueOf() % 2 != 0;
        this.test_cpp = (alvision.cvtest.randInt(rng).valueOf() & 256) == 0;
    }

    get_success_error_level(test_case_idx : alvision.int , i : alvision.int , j : alvision.int) : alvision.double {
        return 0;
    }


    prepare_test_case(test_case_idx: alvision.int ) : alvision.int {
        var code = super.prepare_test_case(test_case_idx);
        if (code > 0) {
            var src = this.test_mat[alvision.cvtest._ArrayTestInternal.INPUT][0];
            alvision.GaussianBlur(src, src, new alvision.Size(11, 11), 5, 5);
        }

        return code;
    }
    run_func() : void
{
    if (!this.test_cpp)
        alvision.cvCanny(test_array[INPUT][0], test_array[OUTPUT][0], threshold1, threshold2,
            aperture_size + (use_true_gradient ? CV_CANNY_L2_GRADIENT : 0));
    else {
        cv::Mat _out = cv::cvarrToMat(test_array[OUTPUT][0]);
        cv::Canny(cv::cvarrToMat(test_array[INPUT][0]), _out, threshold1, threshold2,
            aperture_size + (use_true_gradient ? CV_CANNY_L2_GRADIENT : 0));
    }
    }

    prepare_to_validation(int) : void
{
    Mat src = test_mat[INPUT][0], dst = test_mat[REF_OUTPUT][0];
    test_Canny(src, dst, threshold1, threshold2, aperture_size, use_true_gradient);
}


    validate_test_results(int test_case_idx ) : alvision.int {
        int code = alvision.cvtest.TS::OK, nz0;
        prepare_to_validation(test_case_idx);

        double err = alvision.cvtest.norm(test_mat[OUTPUT][0], test_mat[REF_OUTPUT][0], CV_L1);
        if (err == 0)
            return code;

        if (err != cvRound(err) || cvRound(err) % 255 != 0) {
            ts ->printf(alvision.cvtest.TS::LOG, "Some of the pixels, produced by Canny, are not 0's or 255's; the difference is %g\n", err);
            ts ->set_failed_test_info(alvision.cvtest.TS::FAIL_INVALID_OUTPUT);
            return code;
        }

        nz0 = cvRound(alvision.cvtest.norm(test_mat[REF_OUTPUT][0], CV_L1) / 255);
        err = (err / 255 / MAX(nz0, 100)) * 100;
        if (err > 1) {
            ts ->printf(alvision.cvtest.TS::LOG, "Too high percentage of non-matching edge pixels = %g%%\n", err);
            ts ->set_failed_test_info(alvision.cvtest.TS::FAIL_BAD_ACCURACY);
        }

        return code;
    }

    private aperture_size: alvision.int;
    private use_true_gradient: boolean;
    private threshold1: alvision.double;
    private threshold2: alvision.double;
    private test_cpp: boolean;
};









function cannyFollow(x : alvision.int, y : alvision.int, lowThreshold : alvision.float, mag : alvision.Mat, dst : alvision.Mat): void
{
    static const int ofs[][2] = {{1,0},{1,-1},{0,-1},{-1,-1},{-1,0},{-1,1},{0,1},{1,1}};
    int i;

    dst.at<uchar>(y, x) = (uchar)255;

    for( i = 0; i < 8; i++ )
    {
        int x1 = x + ofs[i][0];
        int y1 = y + ofs[i][1];
        if( (unsigned)x1 < (unsigned)mag.cols &&
            (unsigned)y1 < (unsigned)mag.rows &&
            mag.at<float>(y1, x1) > lowThreshold &&
            !dst.at<uchar>(y1, x1) )
            cannyFollow( x1, y1, lowThreshold, mag, dst );
    }
}



function test_Canny(  src : alvision.Mat, dst : alvision.Mat,
        double threshold1, double threshold2,
        int aperture_size, bool use_true_gradient ) : void
{
    int m = aperture_size;
    Point anchor(m/2, m/2);
    const double tan_pi_8 = tan(CV_PI/8.);
    const double tan_3pi_8 = tan(CV_PI*3/8);
    float lowThreshold = (float)MIN(threshold1, threshold2);
    float highThreshold = (float)MAX(threshold1, threshold2);

    int x, y, width = src.cols, height = src.rows;

    Mat dxkernel = alvision.cvtest.calcSobelKernel2D( 1, 0, m, 0 );
    Mat dykernel = alvision.cvtest.calcSobelKernel2D( 0, 1, m, 0 );
    Mat dx, dy, mag(height, width, CV_32F);
    alvision.cvtest.filter2D(src, dx, CV_16S, dxkernel, anchor, 0, BORDER_REPLICATE);
    alvision.cvtest.filter2D(src, dy, CV_16S, dykernel, anchor, 0, BORDER_REPLICATE);

    // calc gradient magnitude
    for( y = 0; y < height; y++ )
    {
        for( x = 0; x < width; x++ )
        {
            int dxval = dx.at<short>(y, x), dyval = dy.at<short>(y, x);
            mag.at<float>(y, x) = use_true_gradient ?
                (float)sqrt((double)(dxval*dxval + dyval*dyval)) :
                (float)(fabs((double)dxval) + fabs((double)dyval));
        }
    }

    // calc gradient direction, do nonmaxima suppression
    for( y = 0; y < height; y++ )
    {
        for( x = 0; x < width; x++ )
        {

            float a = mag.at<float>(y, x), b = 0, c = 0;
            int y1 = 0, y2 = 0, x1 = 0, x2 = 0;

            if( a <= lowThreshold )
                continue;

            int dxval = dx.at<short>(y, x);
            int dyval = dy.at<short>(y, x);

            double tg = dxval ? (double)dyval/dxval : DBL_MAX*CV_SIGN(dyval);

            if( fabs(tg) < tan_pi_8 )
            {
                y1 = y2 = y; x1 = x + 1; x2 = x - 1;
            }
            else if( tan_pi_8 <= tg && tg <= tan_3pi_8 )
            {
                y1 = y + 1; y2 = y - 1; x1 = x + 1; x2 = x - 1;
            }
            else if( -tan_3pi_8 <= tg && tg <= -tan_pi_8 )
            {
                y1 = y - 1; y2 = y + 1; x1 = x + 1; x2 = x - 1;
            }
            else
            {
                assert( fabs(tg) > tan_3pi_8 );
                x1 = x2 = x; y1 = y + 1; y2 = y - 1;
            }

            if( (unsigned)y1 < (unsigned)height && (unsigned)x1 < (unsigned)width )
                b = (float)fabs(mag.at<float>(y1, x1));

            if( (unsigned)y2 < (unsigned)height && (unsigned)x2 < (unsigned)width )
                c = (float)fabs(mag.at<float>(y2, x2));

            if( (a > b || (a == b && ((x1 == x+1 && y1 == y) || (x1 == x && y1 == y+1)))) && a > c )
                ;
            else
                mag.at<float>(y, x) = -a;
        }
    }

    dst = Scalar::all(0);

    // hysteresis threshold
    for( y = 0; y < height; y++ )
    {
        for( x = 0; x < width; x++ )
            if( mag.at<float>(y, x) > highThreshold && !dst.at<uchar>(y, x) )
                cannyFollow( x, y, lowThreshold, mag, dst );
    }
}






alvision.cvtest.TEST('Imgproc_Canny', 'accuracy', () => { var test = new CV_CannyTest(); test.safe_run(); });

/* End of file. */
