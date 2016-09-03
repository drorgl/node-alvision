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

        if (alvision.cvtest.randInt(rng).valueOf() % 2)
            thresh_range = this.threshold1; this.threshold1 = this.threshold2; this.threshold2 = thresh_range;//  CV_SWAP(threshold1, threshold2, thresh_range);

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
    run_func(): void {
        if (!this.test_cpp)
            alvision.Canny(this.test_array[this.INPUT][0], this.test_array[this.OUTPUT][0], this.threshold1, this.threshold2,
                this.aperture_size.valueOf() + (this.use_true_gradient ? alvision.CV_CANNY_L2_GRADIENT : 0));
        else {
            var _out = this.test_array[this.OUTPUT][0];
            alvision.Canny(this.test_array[this.INPUT][0], _out, this.threshold1, this.threshold2,
                this.aperture_size.valueOf() + (this.use_true_gradient ? alvision.CV_CANNY_L2_GRADIENT : 0));
        }
    }

    prepare_to_validation(int): void {
        var src = this.test_mat[this.INPUT][0], dst = this.test_mat[this.REF_OUTPUT][0];
        test_Canny(src, dst, this.threshold1, this.threshold2, this.aperture_size, this.use_true_gradient);
    }


    validate_test_results( test_case_idx : alvision.int ) : alvision.int {
        var code = alvision.cvtest.FailureCode.OK;
        var nz0;
        this.prepare_to_validation(test_case_idx);

        var err = alvision.cvtest.norm(this.test_mat[this.OUTPUT][0], this.test_mat[this.REF_OUTPUT][0], alvision.NormTypes.NORM_L1);
        if (err == 0)
            return code;

        if (err != Math.round(err.valueOf()) || Math.round(err.valueOf()) % 255 != 0) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Some of the pixels, produced by Canny, are not 0's or 255's; the difference is %g\n", err);
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
            return code;
        }

        nz0 = Math.round(alvision.cvtest.norm(this.test_mat[this.REF_OUTPUT][0], alvision.NormTypes.NORM_L1).valueOf() / 255);
        err = (err.valueOf() / 255 / Math.max(nz0, 100)) * 100;
        if (err > 1) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Too high percentage of non-matching edge pixels = %g%%\n", err);
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
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
    const ofs = [[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1],[1,1]];
    //int i;

    dst.at<alvision.uchar>("uchar", y, x).set(255);

    for(var i = 0; i < 8; i++ )
    {
        var x1 = x.valueOf() + ofs[i][0];
        var y1 = y.valueOf() + ofs[i][1];
        if( x1 < mag.cols() &&
            y1 < mag.rows() &&
            mag.at<alvision.float>("float",y1, x1).get() > lowThreshold &&
            !dst.at<alvision.uchar>("uchar",y1, x1).get() )
            cannyFollow( x1, y1, lowThreshold, mag, dst );
    }
}



function test_Canny(  src : alvision.Mat, dst : alvision.Mat,
    threshold1: alvision.double, threshold2: alvision.double ,
    aperture_size: alvision.int , use_true_gradient  : boolean) : void
{
    var m = aperture_size.valueOf();
    var anchor = new alvision.Point (m/2, m/2);
    const tan_pi_8 =  Math.tan(Math.PI/8.);
    const tan_3pi_8 = Math.tan(Math.PI*3/8);
    var lowThreshold =  Math.min(threshold1.valueOf(), threshold2.valueOf());
    var highThreshold = Math.max(threshold1.valueOf(), threshold2.valueOf());

    //int x, y, 
    var width = src.cols(), height = src.rows();

    var dxkernel = alvision.cvtest.calcSobelKernel2D( 1, 0, m, 0 );
    var dykernel = alvision.cvtest.calcSobelKernel2D( 0, 1, m, 0 );
    //Mat 
    var dx = new alvision.Mat();
    var dy = new alvision.Mat();
    var mag = new alvision.Mat(height, width, alvision.MatrixType.CV_32F);
    alvision.cvtest.filter2D(src, dx, alvision.MatrixType.CV_16S, dxkernel, anchor, 0, alvision.BorderTypes. BORDER_REPLICATE);
    alvision.cvtest.filter2D(src, dy, alvision.MatrixType.CV_16S, dykernel, anchor, 0,alvision.BorderTypes. BORDER_REPLICATE);

    // calc gradient magnitude
    for(var y = 0; y < height; y++ )
    {
        for(var x = 0; x < width; x++ )
        {
            (() => {
                var dxval = dx.at<alvision.short>("ushort", y, x).get().valueOf(), dyval = dy.at<alvision.short>("short", y, x).get().valueOf();
                mag.at<alvision.float>("float", y, x).set(use_true_gradient ?
                    Math.sqrt((dxval * dxval + dyval * dyval)) :
                    (Math.abs(dxval) + Math.abs(dyval)));
            })();
        }
    }

    // calc gradient direction, do nonmaxima suppression
    for(var y = 0; y < height; y++ )
    {
        for(var x = 0; x < width; x++ )
        {

            var a = mag.at<alvision.float>("float", y, x).get(), b = 0, c = 0;
            var y1 = 0, y2 = 0, x1 = 0, x2 = 0;

            if( a <= lowThreshold )
                continue;

            var dxval = dx.at<alvision.short>("short",y, x).get();
            var dyval = dy.at<alvision.short>("short",y, x).get();

            var tg = dxval ? dyval.valueOf()/dxval.valueOf() : alvision.DBL_MAX*alvision.sign(dyval);

            if( Math.abs(tg) < tan_pi_8 )
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
                alvision.assert(()=> Math.abs(tg) > tan_3pi_8 );
                x1 = x2 = x; y1 = y + 1; y2 = y - 1;
            }

            if(y1 < height && x1 < width )
                b = Math.abs(mag.at<alvision.float>("float", y1, x1).get().valueOf());

            if(y2 < height && x2 < width )
                c = Math.abs(mag.at<alvision.float>("float",y2, x2).get().valueOf());

            if ((a > b || (a == b && ((x1 == x + 1 && y1 == y) || (x1 == x && y1 == y + 1)))) && a > c)
                var dummy = 1; //nop
            else
                mag.at<alvision.float>("float", y, x).set(-a);
        }
    }

    dst.setTo(alvision.Scalar.all(0));

    // hysteresis threshold
    for( y = 0; y < height; y++ )
    {
        for( x = 0; x < width; x++ )
            if( mag.at<alvision.float>("float", y, x).get() > highThreshold && !dst.at<alvision.uchar>("uchar", y, x).get() )
                cannyFollow( x, y, lowThreshold, mag, dst );
    }
}






alvision.cvtest.TEST('Imgproc_Canny', 'accuracy', () => { var test = new CV_CannyTest(); test.safe_run(); });

/* End of file. */
