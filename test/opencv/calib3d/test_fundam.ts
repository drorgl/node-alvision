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
//#include "opencv2/calib3d/calib3d_c.h"
//
//using namespace cv;
//using namespace std;

function cvTsRodrigues(src : alvision.Mat, dst : alvision.Mat, jacobian  : alvision.Mat) : alvision.int
{
    //int i;
    //float Jf[27];
    //double J[27];
    //CvMat _Jf;
    var matJ = new alvision.Mat(3, 9, alvision.MatrixType.CV_64F, J);

    //var depth = CV_MAT_DEPTH(src.type);

    if( jacobian )
    {
        alvision.assert( (jacobian.rows == 9 && jacobian.cols == 3) ||
                (jacobian.rows == 3 && jacobian.cols == 9) );
    }

    if( src.cols == 1 || src.rows == 1 )
    {
        //double r[3], theta;
        var _r = new alvision.Mat(src.rows, src.cols, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_64F, src.channels()));// CV_MAT_CN(src.type)), r);
        var r = _r.ptr<alvision.double>("double");

        alvision.assert( dst.rows == 3 && dst.cols == 3 );

        alvision.cvConvert( src, _r );

        var theta = Math.sqrt(r[0]*r[0] + r[1]*r[1] + r[2]*r[2]);
        if( theta < alvision.DBL_EPSILON )
        {
            cvSetIdentity( dst );

            if( jacobian )
            {
                memset( J, 0, sizeof(J) );
                J[5] = J[15] = J[19] = 1;
                J[7] = J[11] = J[21] = -1;
            }
        }
        else
        {
            // omega = r/theta (~[w1, w2, w3])
            var itheta = 1./theta;
            var w1 = r[0]*itheta, w2 = r[1]*itheta, w3 = r[2]*itheta;
            var alpha = Math.cos(theta);
            var beta =  Math.sin(theta);
            var gamma = 1 - alpha;
            var omegav =
            [
                0, -w3, w2,
                w3, 0, -w1,
                -w2, w1, 0
            ];
            var A =
            [
                w1*w1, w1*w2, w1*w3,
                w2*w1, w2*w2, w2*w3,
                w3*w1, w3*w2, w3*w3
            ];
            double R[9];
            var _omegav = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F, omegav);
            var matA =    new alvision.Mat(3, 3, alvision.MatrixType.CV_64F, A);
            var matR =    new alvision.Mat(3, 3, alvision.MatrixType.CV_64F, R);

            cvSetIdentity( &matR, cvRealScalar(alpha) );
            cvScaleAdd( &_omegav, cvRealScalar(beta), &matR, &matR );
            cvScaleAdd( &matA, cvRealScalar(gamma), &matR, &matR );
            cvConvert( &matR, dst );

            if( jacobian )
            {
                // m3 = [r, theta]
                var dm3din =
                [
                    1, 0, 0,
                    0, 1, 0,
                    0, 0, 1,
                    w1, w2, w3
                ];
                // m2 = [omega, theta]
                var dm2dm3 =
                [
                    itheta, 0, 0, -w1*itheta,
                    0, itheta, 0, -w2*itheta,
                    0, 0, itheta, -w3*itheta,
                    0, 0, 0, 1
                ];
                double t0[9*4];
                double dm1dm2[21*4];
                double dRdm1[9*21];
                var _dm3din = new alvision.Mat(4, 3, alvision.MatrixType.CV_64FC1, dm3din );
                var _dm2dm3 = new alvision.Mat(4, 4, alvision.MatrixType.CV_64FC1, dm2dm3 );
                var _dm1dm2 = new alvision.Mat(21, 4, alvision.MatrixType.CV_64FC1, dm1dm2 );
                var _dRdm1 =  new alvision.Mat(9, 21, alvision.MatrixType.CV_64FC1, dRdm1 );
                var _dRdm1_part = new alvision.Mat();
                var _t0 = new alvision.Mat(9, 4, alvision.MatrixType.CV_64FC1, t0 );
                var _t1 = new alvision.Mat(9, 4, alvision.MatrixType.CV_64FC1, dRdm1 );

                // m1 = [alpha, beta, gamma, omegav; A]
                memset( dm1dm2, 0, sizeof(dm1dm2) );
                dm1dm2[3] = -beta;
                dm1dm2[7] = alpha;
                dm1dm2[11] = beta;

                // dm1dm2(4:12,1:3) = [0 0 0 0 0 1 0 -1 0;
                //                     0 0 -1 0 0 0 1 0 0;
                //                     0 1 0 -1 0 0 0 0 0]'
                //                     -------------------
                //                     0 0 0  0 0 0 0 0 0
                dm1dm2[12 + 6] = dm1dm2[12 + 20] = dm1dm2[12 + 25] = 1;
                dm1dm2[12 + 9] = dm1dm2[12 + 14] = dm1dm2[12 + 28] = -1;

                var dm1dw =
                [
                    2*w1, w2, w3, w2, 0, 0, w3, 0, 0,
                    0, w1, 0, w1, 2*w2, w3, 0, w3, 0,
                    0, 0, w1, 0, 0, w2, w1, w2, 2*w3
                ];

                var _dm1dw = new alvision.Mat(3, 9, alvision.MatrixType.CV_64FC1, dm1dw );
                CvMat _dm1dm2_part;

                cvGetSubRect( &_dm1dm2, &_dm1dm2_part, cvRect(0,12,3,9) );
                cvTranspose( &_dm1dw, &_dm1dm2_part );

                memset( dRdm1, 0, sizeof(dRdm1) );
                dRdm1[0*21] = dRdm1[4*21] = dRdm1[8*21] = 1;

                cvGetCol( &_dRdm1, &_dRdm1_part, 1 );
                cvTranspose( &_omegav, &_omegav );
                cvReshape( &_omegav, &_omegav, 1, 1 );
                cvTranspose( &_omegav, &_dRdm1_part );

                cvGetCol( &_dRdm1, &_dRdm1_part, 2 );
                cvReshape( &matA, &matA, 1, 1 );
                cvTranspose( &matA, &_dRdm1_part );

                cvGetSubRect( &_dRdm1, &_dRdm1_part, cvRect(3,0,9,9) );
                cvSetIdentity( &_dRdm1_part, cvScalarAll(beta) );

                cvGetSubRect( &_dRdm1, &_dRdm1_part, cvRect(12,0,9,9) );
                cvSetIdentity( &_dRdm1_part, cvScalarAll(gamma) );

                matJ = cvMat(9, 3, alvision.MatrixType.CV_64FC1, J );

                cvMatMul( &_dRdm1, &_dm1dm2, &_t0 );
                cvMatMul( &_t0, &_dm2dm3, &_t1 );
                cvMatMul( &_t1, &_dm3din, &matJ );

                _t0 = cvMat(3, 9, alvision.MatrixType.CV_64FC1, t0 );
                cvTranspose( &matJ, &_t0 );

                for( i = 0; i < 3; i++ )
                {
                    _t1 = cvMat(3, 3, alvision.MatrixType.CV_64FC1, t0 + i*9 );
                    cvTranspose( &_t1, &_t1 );
                }

                cvTranspose( &_t0, &matJ );
            }
        }
    }
    else if( src.cols == 3 && src.rows == 3 )
    {
        double R[9], A[9], I[9], r[3], W[3], U[9], V[9];
        double tr, alpha, beta, theta;
        var matR = new alvision.Mat( 3, 3, alvision.MatrixType.CV_64F, R );
        var matA = new alvision.Mat( 3, 3, alvision.MatrixType.CV_64F, A );
        var matI = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F, I );
        var _r = new alvision.Mat(dst .rows, dst .cols, CV_MAKETYPE(alvision.MatrixType.CV_64F, CV_MAT_CN(dst.type)), r );
        var matW = alvision.Mat( 1, 3, alvision.MatrixType.CV_64F, W );
        var matU = alvision.Mat( 3, 3, alvision.MatrixType.CV_64F, U );
        var matV = alvision.Mat(3, 3, alvision.MatrixType.CV_64F, V );

        cvConvert( src, &matR );
        cvSVD( &matR, &matW, &matU, &matV, CV_SVD_MODIFY_A + CV_SVD_U_T + CV_SVD_V_T );
        cvGEMM( &matU, &matV, 1, 0, 0, &matR, CV_GEMM_A_T );

        cvMulTransposed( &matR, &matA, 0 );
        cvSetIdentity( &matI );

        if( cvNorm( &matA, &matI, CV_C ) > 1e-3 ||
            fabs( cvDet(&matR) - 1 ) > 1e-3 )
            return 0;

        tr = (cvTrace(&matR).val[0] - 1.)*0.5;
        tr = tr > 1. ? 1. : tr < -1. ? -1. : tr;
        theta = Math.acos(tr);
        alpha = Math.cos(theta);
        beta =  Math.sin(theta);

        if( beta >= 1e-5 )
        {
            var  dtheta_dtr = -1./Math.sqrt(1 - tr*tr);
            var vth = 1/(2*beta);

            // om1 = [R(3,2) - R(2,3), R(1,3) - R(3,1), R(2,1) - R(1,2)]'
            var om1 = [ R[7] - R[5], R[2] - R[6], R[3] - R[1] ];
            // om = om1*vth
            // r = om*theta
            var d3 = vth*theta;

            r[0] = om1[0]*d3; r[1] = om1[1]*d3; r[2] = om1[2]*d3;
            cvConvert( &_r, dst );

            if( jacobian )
            {
                // var1 = [vth;theta]
                // var = [om1;var1] = [om1;vth;theta]
                var dvth_dtheta = -vth*alpha/beta;
                var d1 = 0.5*dvth_dtheta*dtheta_dtr;
                var d2 = 0.5*dtheta_dtr;
                // dvar1/dR = dvar1/dtheta*dtheta/dR = [dvth/dtheta; 1] * dtheta/dtr * dtr/dR
                var dvardR =
                [
                    0, 0, 0, 0, 0, 1, 0, -1, 0,
                    0, 0, -1, 0, 0, 0, 1, 0, 0,
                    0, 1, 0, -1, 0, 0, 0, 0, 0,
                    d1, 0, 0, 0, d1, 0, 0, 0, d1,
                    d2, 0, 0, 0, d2, 0, 0, 0, d2
                ];
                // var2 = [om;theta]
                var dvar2dvar =
                [
                    vth, 0, 0, om1[0], 0,
                    0, vth, 0, om1[1], 0,
                    0, 0, vth, om1[2], 0,
                    0, 0, 0, 0, 1
                ];
                var domegadvar2 =
                [
                    theta, 0, 0, om1[0]*vth,
                    0, theta, 0, om1[1]*vth,
                    0, 0, theta, om1[2]*vth
                ];

                var _dvardR =      new alvision.Mat(5, 9, alvision.MatrixType.CV_64FC1, dvardR );
                var _dvar2dvar =   new alvision.Mat(4, 5, alvision.MatrixType.CV_64FC1, dvar2dvar );
                var _domegadvar2 = new alvision.Mat(3, 4, alvision.MatrixType.CV_64FC1, domegadvar2 );
                double t0[3*5];
                var _t0 = new alvision.Mat(3, 5, alvision.MatrixType.CV_64FC1, t0 );

                cvMatMul( &_domegadvar2, &_dvar2dvar, &_t0 );
                cvMatMul( &_t0, &_dvardR, &matJ );
            }
        }
        else if( tr > 0 )
        {
            cvZero( dst );
            if( jacobian )
            {
                memset( J, 0, sizeof(J) );
                J[5] = J[15] = J[19] = 0.5;
                J[7] = J[11] = J[21] = -0.5;
            }
        }
        else
        {
            r[0] = theta*sqrt((R[0] + 1)*0.5);
            r[1] = theta*sqrt((R[4] + 1)*0.5)*(R[1] >= 0 ? 1 : -1);
            r[2] = theta*sqrt((R[8] + 1)*0.5)*(R[2] >= 0 ? 1 : -1);
            cvConvert( &_r, dst );

            if( jacobian )
                memset( J, 0, sizeof(J) );
        }

        if( jacobian )
        {
            for( i = 0; i < 3; i++ )
            {
                CvMat t = cvMat(3, 3, alvision.MatrixType.CV_64F, J + i*9 );
                cvTranspose( &t, &t );
            }
        }
    }
    else
    {
        assert(0);
        return 0;
    }

    if( jacobian )
    {
        if( depth == CV_32F )
        {
            if( jacobian.rows == matJ.rows )
                cvConvert( &matJ, jacobian );
            else
            {
                _Jf = cvMat( matJ.rows, matJ.cols, CV_32FC1, Jf );
                cvConvert( &matJ, &_Jf );
                cvTranspose( &_Jf, jacobian );
            }
        }
        else if( jacobian.rows == matJ.rows )
            cvCopy( &matJ, jacobian );
        else
            cvTranspose( &matJ, jacobian );
    }

    return 1;
}


function Rodrigues(src : alvision.Mat, dst : alvision.Mat, jac : alvision.Mat) : void
{
    //CvMat _src = src, _dst = dst, _jac;
    //if( jac )
    //    _jac = *jac;
    cvTsRodrigues(src, dst, jac );
}


function test_convertHomogeneous(_src: alvision.Mat, _dst: alvision.Mat ) : void
{
    var src = _src, dst = _dst;
    int i, count, sdims, ddims;
    int sstep1, sstep2, dstep1, dstep2;

    if (src.depth() != alvision.MatrixType.CV_64F )
        _src.convertTo(src, alvision.MatrixType.CV_64F);

    if (dst.depth() != alvision.MatrixType. CV_64F )
        dst.create(dst.size(), alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_64F, _dst.channels()));

    if( src.rows > src.cols )
    {
        count = src.rows;
        sdims = src.channels()*src.cols;
        sstep1 = (int)(src.step/sizeof(double));
        sstep2 = 1;
    }
    else
    {
        count = src.cols;
        sdims = src.channels()*src.rows;
        if( src.rows == 1 )
        {
            sstep1 = sdims;
            sstep2 = 1;
        }
        else
        {
            sstep1 = 1;
            sstep2 = (int)(src.step/sizeof(double));
        }
    }

    if( dst.rows > dst.cols )
    {
        alvision.CV_Assert( count == dst.rows );
        ddims = dst.channels()*dst.cols;
        dstep1 = (int)(dst.step/sizeof(double));
        dstep2 = 1;
    }
    else
    {
        assert( count == dst.cols );
        ddims = dst.channels()*dst.rows;
        if( dst.rows == 1 )
        {
            dstep1 = ddims;
            dstep2 = 1;
        }
        else
        {
            dstep1 = 1;
            dstep2 = (int)(dst.step/sizeof(double));
        }
    }

    var s = src.ptr<alvision.double>("double");
    var d = dst.ptr<alvision.double>("double");

    if( sdims <= ddims )
    {
        int wstep = dstep2*(ddims - 1);

        for( i = 0; i < count; i++, s += sstep1, d += dstep1 )
        {
            double x = s[0];
            double y = s[sstep2];

            d[wstep] = 1;
            d[0] = x;
            d[dstep2] = y;

            if( sdims >= 3 )
            {
                d[dstep2*2] = s[sstep2*2];
                if( sdims == 4 )
                    d[dstep2*3] = s[sstep2*3];
            }
        }
    }
    else
    {
        int wstep = sstep2*(sdims - 1);

        for( i = 0; i < count; i++, s += sstep1, d += dstep1 )
        {
            double w = s[wstep];
            double x = s[0];
            double y = s[sstep2];

            w = w ? 1./w : 1;

            d[0] = x*w;
            d[dstep2] = y*w;

            if( ddims == 3 )
                d[dstep2*2] = s[sstep2*2]*w;
        }
    }

    if( dst.data != _dst.data )
        dst.convertTo(_dst, _dst.depth());
}


function test_projectPoints( _3d : alvision.Mat,  Rt : alvision.Mat,  A : alvision.Mat, _2d : alvision.Mat, rng : alvision.RNG, sigma : alvision.double ) : void
{
    alvision.CV_Assert( _3d.isContinuous() );

    double p[12];
    var P  = new alvision.Mat(3, 4, alvision.MatrixType. CV_64F, p );
    alvision.gemm(A, Rt, 1,new alvision. Mat(), 0, P);

    var count = _3d.cols;

    var noise = new alvision.Mat();
    if( rng )
    {
        if( sigma == 0 )
            rng = 0;
        else
        {
            noise.create(1, _3d.cols, alvision.MatrixType.CV_64FC2 );
            rng.fill(noise, RNG::NORMAL, alvision.Scalar.all(0), alvision.Scalar.all(sigma) );
        }
    }

    var temp = new alvision.Mat(1, count, alvision.MatrixType.CV_64FC3 );

    for(var i = 0; i < count; i++ )
    {
        var M = _3d.ptr<alvision.double>("double").slice( i*3);
        var m = temp.ptr<alvision.double>("double").slice(i * 3);
        var X = M[0], Y = M[1], Z = M[2];
        var u = p[0]*X + p[1]*Y + p[2]*Z + p[3];
        var v = p[4]*X + p[5]*Y + p[6]*Z + p[7];
        var s = p[8]*X + p[9]*Y + p[10]*Z + p[11];

        if( !noise.empty() )
        {
            u += noise.atGet<alvision.Point2d>("Point2d",i).x.valueOf()*s;
            v += noise.atGet<alvision.Point2d>("Point2d",i).y.valueOf()*s;
        }

        m[0] = u;
        m[1] = v;
        m[2] = s;
    }

    test_convertHomogeneous( temp, _2d );
}


/********************************** Rodrigues transform ********************************/

class CV_RodriguesTest extends alvision.cvtest.ArrayTest
{
    constructor() {
        super();
        this.test_array[this.INPUT].push(null);  // rotation vector
        this.test_array[this.OUTPUT].push(null); // rotation matrix
        this.test_array[this.OUTPUT].push(null); // jacobian (J)
        this.test_array[this.OUTPUT].push(null); // rotation vector (backward transform result)
        this.test_array[this.OUTPUT].push(null); // inverse transform jacobian (J1)
        this.test_array[this.OUTPUT].push(null); // J*J1 (or J1*J) == I(3x3)
        this.test_array[this.REF_OUTPUT].push(null);
        this.test_array[this.REF_OUTPUT].push(null);
        this.test_array[this.REF_OUTPUT].push(null);
        this.test_array[this.REF_OUTPUT].push(null);
        this.test_array[this.REF_OUTPUT].push(null);

        this.element_wise_relative_error = false;
        this.calc_jacobians = false;

        this.test_cpp = false;
    }

    read_params(fs: alvision.FileStorage): alvision.int {
        var code = super.read_params(fs);
        return code;
    }
    fill_array(test_case_idx: alvision.int, i: alvision.int, j: alvision.int, arr: alvision.Mat): void {
        if (i == this.INPUT && j == 0) {
            //double //r[3],
            //theta0, theta1,
             var   f;
             var _r = new alvision.Mat(arr.rows, arr.cols, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_64F, arr.channels()), );
             var r = _r.ptr<alvision.double>("double");
            var rng = this.ts.get_rng();

            r[0] = alvision.cvtest.randReal(rng).valueOf() * Math.PI * 2;
            r[1] = alvision.cvtest.randReal(rng).valueOf() * Math.PI * 2;
            r[2] = alvision.cvtest.randReal(rng).valueOf() * Math.PI * 2;

            var theta0 = Math.sqrt(r[0].valueOf() * r[0].valueOf() + r[1].valueOf() * r[1].valueOf() + r[2].valueOf() * r[2].valueOf());
            var theta1 = (theta0)%( Math.PI * 2);

            if (theta1 > Math.PI)
                theta1 = -(Math.PI * 2 - theta1);

            f = theta1 / (theta0 ? theta0 : 1);
            r[0] =r[0] * f;
            r[1] =r[1] * f;
            r[2] =r[2] * f;

            alvision.cvtest.convert(_r, arr, arr.type());
        }
        else
            super.fill_array(test_case_idx, i, j, arr);
    }
    prepare_test_case(test_case_idx: alvision.int): alvision.int{
        var code = super.prepare_test_case(test_case_idx);
        return code;
    }
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        var rng = this.ts.get_rng();
        var depth = alvision.cvtest.randInt(rng).valueOf() % 2 == 0 ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_64F;
        //int i;

        var code = alvision.cvtest.randInt(rng).valueOf() % 3;
        types[this.INPUT][0] = alvision.MatrixType.CV_MAKETYPE(depth, 1);

        if (code == 0) {
            sizes[this.INPUT][0] = new alvision.Size(1, 1);
            types[this.INPUT][0] = alvision.MatrixType.CV_MAKETYPE(depth, 3);
        }
        else if (code == 1)
            sizes[this.INPUT][0] = new alvision.Size(3, 1);
        else
            sizes[this.INPUT][0] = new alvision.Size(1, 3);

        sizes[this.OUTPUT][0] = new alvision.Size(3, 3);
        types[this.OUTPUT][0] = alvision.MatrixType.CV_MAKETYPE(depth, 1);

        types[this.OUTPUT][1] = alvision.MatrixType.CV_MAKETYPE(depth, 1);

        if (alvision.cvtest.randInt(rng).valueOf() % 2)
            sizes[this.OUTPUT][1] = new alvision.Size(3, 9);
        else
            sizes[this.OUTPUT][1] = new alvision.Size(9, 3);

        types[this.OUTPUT][2] = types[this.INPUT][0];
        sizes[this.OUTPUT][2] = sizes[this.INPUT][0];

        types[this.OUTPUT][3] = types[this.OUTPUT][1];
        sizes[this.OUTPUT][3] = new alvision.Size(sizes[this.OUTPUT][1].height, sizes[this.OUTPUT][1].width);

        types[this.OUTPUT][4] = types[this.OUTPUT][1];
        sizes[this.OUTPUT][4] = new alvision.Size(3, 3);

        this.calc_jacobians = alvision.cvtest.randInt(rng).valueOf() % 3 != 0;
        if (!this.calc_jacobians)
            sizes[this.OUTPUT][1] = sizes[this.OUTPUT][3] = sizes[this.OUTPUT][4] = new alvision.Size(0, 0);

        for (var i = 0; i < 5; i++) {
            types[this.REF_OUTPUT][i] = types[this.OUTPUT][i];
            sizes[this.REF_OUTPUT][i] = sizes[this.OUTPUT][i];
        }
        this.test_cpp = (alvision.cvtest.randInt(rng).valueOf() & 256) == 0;
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        return j == 4 ? 1e-2 : 1e-2;
    }
    run_func(): void {
        var v2m_jac: alvision.Mat;
        var m2v_jac : alvision.Mat;

        if (this.calc_jacobians) {
            v2m_jac = this.test_mat[this.OUTPUT][1];
            m2v_jac = this.test_mat[this.OUTPUT][3];
        }

        if (!this.test_cpp) {
            CvMat _input = test_mat[INPUT][0], _output = test_mat[OUTPUT][0], _output2 = this.test_mat[this.OUTPUT][2];
            cvRodrigues2( &_input, &_output, calc_jacobians ? &v2m_jac : 0);
            cvRodrigues2( &_output, &_output2, calc_jacobians ? &m2v_jac : 0);
        }
        else {
            var v = this.test_mat[this.INPUT][0], M = this.test_mat[this.OUTPUT][0], v2 = this.test_mat[this.OUTPUT][2];
            alvision.Mat M0 = M, v2_0 = v2;
            if (!this.calc_jacobians) {
                alvision.Rodrigues(v, M);
                alvision.Rodrigues(M, v2);
            }
            else {
                alvision.Mat J1 = test_mat[OUTPUT][1], J2 = test_mat[OUTPUT][3];
                alvision.Mat J1_0 = J1, J2_0 = J2;
                alvision.Rodrigues(v, M, J1);
                alvision.Rodrigues(M, v2, J2);
                if (J1.data != J1_0.data) {
                    if (J1.size() != J1_0.size())
                        J1 = J1.t();
                    J1.convertTo(J1_0, J1_0.type());
                }
                if (J2.data != J2_0.data) {
                    if (J2.size() != J2_0.size())
                        J2 = J2.t();
                    J2.convertTo(J2_0, J2_0.type());
                }
            }
            if (M.data != M0.data)
                M.reshape(M0.channels(), M0.rows).convertTo(M0, M0.type());
            if (v2.data != v2_0.data)
                v2.reshape(v2_0.channels(), v2_0.rows).convertTo(v2_0, v2_0.type());
        }
    }
    prepare_to_validation(test_case_idx: alvision.int): void {
        var vec = this.test_mat[this.INPUT][0];
        var m = this.test_mat[this.REF_OUTPUT][0];
        var vec2 = this.test_mat[this.REF_OUTPUT][2];
            var     v2m_jac : alvision.Mat;
            var m2v_jac: alvision.Mat;
        //double theta0, theta1;

        if (this.calc_jacobians) {
            v2m_jac = this.test_mat[this.REF_OUTPUT][1];
            m2v_jac = this.test_mat[this.REF_OUTPUT][3];
        }


        alvision.cvtest.Rodrigues(vec, m, v2m_jac);
        alvision.cvtest.Rodrigues(m, vec2, m2v_jac);
        alvision.cvtest.copy(vec, vec2);

        var theta0 = norm(vec2, CV_L2);
        var theta1 = (theta0)%( Math.PI * 2);

        if (theta1 > Math.PI)
            theta1 = -(Math.PI * 2 - theta1);
        vec2 *= theta1 / (theta0 ? theta0 : 1);

        if (this.calc_jacobians) {
            //cvInvert( v2m_jac, m2v_jac, CV_SVD );
            var nrm = alvision.cvtest.norm(this.test_mat[this.REF_OUTPUT][3], CV_C);
            if (alvision.FLT_EPSILON < nrm && nrm < 1000) {
                alvision.gemm(this.test_mat[this.OUTPUT][1], this.test_mat[this.OUTPUT][3],
                    1, new alvision.Mat(), 0, this.test_mat[this.OUTPUT][4],
                    v2m_jac .rows == 3 ? 0 : CV_GEMM_A_T + CV_GEMM_B_T);
            }
            else {
                setIdentity(test_mat[OUTPUT][4], Scalar::all(1.));
                alvision.cvtest.copy(test_mat[REF_OUTPUT][2], test_mat[OUTPUT][2]);
            }
            setIdentity(test_mat[REF_OUTPUT][4], Scalar::all(1.));
        }
    }

    protected calc_jacobians: boolean;
    protected test_cpp: boolean;
};


/********************************** fundamental matrix *********************************/

class CV_FundamentalMatTest extends alvision.cvtest.ArrayTest
{
    constructor() {
        super();
        // input arrays:
        //   0, 1 - arrays of 2d points that are passed to %func%.
        //          Can have different data type, layout, be stored in homogeneous coordinates or not.
        //   2 - array of 3d points that are projected to both view planes
        //   3 - [R|t] matrix for the second view plane (for the first one it is [I|0]
        //   4, 5 - intrinsic matrices
        this.test_array[this.INPUT].push(null);
        this.test_array[this.INPUT].push(null);
        this.test_array[this.INPUT].push(null);
        this.test_array[this.INPUT].push(null);
        this.test_array[this.INPUT].push(null);
        this.test_array[this.INPUT].push(null);
        this.test_array[this.TEMP].push(null);
        this.test_array[this.TEMP].push(null);
        this.test_array[this.OUTPUT].push(null);
        this.test_array[this.OUTPUT].push(null);
        this.test_array[this.REF_OUTPUT].push(null);
        this.test_array[this.REF_OUTPUT].push(null);

        this.element_wise_relative_error = false;

        this.method = 0;
        this.img_size = 10;
        this.cube_size = 10;
        this.dims = 0;
        this.min_f = 1;
        this.max_f = 3;
        this.sigma = 0;//0.1;
        this.f_result = 0;

        this.test_cpp = false;
    }
    read_params(fs: alvision.FileStorage): alvision.int {
        var code = super.read_params(fs);
        return code;
    }
    fill_array(test_case_idx: alvision.int, i: alvision.int, j: alvision.int, arr: alvision.Mat): void {
        double t[12] = { 0};
        var rng = this.ts.get_rng();

        if (i != this.INPUT) {
            super.fill_array(test_case_idx, i, j, arr);
            return;
        }

        switch (j) {
            case 0:
            case 1:
                return; // fill them later in prepare_test_case
            case 2:
                {
                    var p = arr.ptr<alvision.double>("double");
                    for (i = 0; i < arr.cols * 3; i += 3) {
                        p[i] = alvision.cvtest.randReal(rng) * cube_size;
                        p[i + 1] = alvision.cvtest.randReal(rng) * cube_size;
                        p[i + 2] = alvision.cvtest.randReal(rng) * cube_size + cube_size;
                    }
                }
                break;
            case 3:
                {
                    double r[3];
                    var rot_vec = new alvision.Mat(3, 1, alvision.MatrixType.CV_64F, r);
                    var rot_mat = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F, t, 4 * sizeof(t[0]));
                    r[0] = alvision.cvtest.randReal(rng).valueOf() * Math.PI * 2;
                    r[1] = alvision.cvtest.randReal(rng).valueOf() * Math.PI * 2;
                    r[2] = alvision.cvtest.randReal(rng).valueOf() * Math.PI * 2;

                    alvision.cvtest.Rodrigues(rot_vec, rot_mat);
                    t[3] = alvision.cvtest.randReal(rng).valueOf() * cube_size;
                    t[7] = alvision.cvtest.randReal(rng).valueOf() * cube_size;
                    t[11] = alvision.cvtest.randReal(rng).valueOf() * cube_size;
                    Mat(3, 4, alvision.MatrixType.CV_64F, t).convertTo(arr, arr.type());
                }
                break;
            case 4:
            case 5:
                t[0] = t[4] = alvision.cvtest.randReal(rng) * (max_f - min_f) + min_f;
                t[2] = (img_size * 0.5 + alvision.cvtest.randReal(rng) * 4. - 2.) * t[0];
                t[5] = (img_size * 0.5 + alvision.cvtest.randReal(rng) * 4. - 2.) * t[4];
                t[8] = 1.;
                Mat(3, 3, alvision.MatrixType.CV_64F, t).convertTo(arr, arr.type());
                break;
        }
    }
    prepare_test_case(test_case_idx: alvision.int): alvision.int{
        var code = super.prepare_test_case(test_case_idx);
        if (code > 0) {
            var _3d = this.test_mat[this.INPUT][2];
            var rng = this.ts.get_rng();
            var Idata = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0 ]
            var I = new alvision.Mat(3, 4, alvision.MatrixType.CV_64F, Idata);

            for (var k = 0; k < 2; k++) {
                var Rt = k == 0 ? I : this.test_mat[this.INPUT][3];
                var A = this.test_mat[this.INPUT][k == 0 ? 4 : 5];
                var _2d = this.test_mat[this.INPUT][k];

                test_projectPoints(_3d, Rt, A, _2d, rng, this.sigma);
            }
        }

        return code;
    }
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        var rng = this.ts.get_rng();
        var pt_depth = alvision.cvtest.randInt(rng).valueOf() % 2 == 0 ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_64F;
        var pt_count_exp = alvision.cvtest.randReal(rng).valueOf() * 6 + 1;
        var pt_count = Math.round(Math.exp(pt_count_exp));

        dims = alvision.cvtest.randInt(rng).valueOf() % 2 + 2;
        method = 1 << (alvision.cvtest.randInt(rng).valueOf() % 4);

        if (method == CV_FM_7POINT)
            pt_count = 7;
        else {
            pt_count = Math.max(pt_count, 8 + (method == CV_FM_8POINT));
            if (pt_count >= 8 && alvision.cvtest.randInt(rng).valueOf() % 2)
                method |= CV_FM_8POINT;
        }

        types[this.INPUT][0] = alvision.MatrixType.CV_MAKETYPE(pt_depth, 1);

        if (alvision.cvtest.randInt(rng).valueOf() % 2)
            sizes[this.INPUT][0] = new alvision.Size(pt_count, dims);
        else {
            sizes[this.INPUT][0] = new alvision.Size(dims, pt_count);
            if (alvision.cvtest.randInt(rng).valueOf() % 2) {
                types[this.INPUT][0] = alvision.MatrixType.CV_MAKETYPE(pt_depth, dims);
                if (alvision.cvtest.randInt(rng).valueOf() % 2)
                    sizes[this.INPUT][0] = new alvision.Size(pt_count, 1);
                else
                    sizes[this.INPUT][0] = new alvision.Size(1, pt_count);
            }
        }

        sizes[this.INPUT][1] = sizes[this.INPUT][0];
        types[this.INPUT][1] = types[this.INPUT][0];

        sizes[this.INPUT][2] = new alvision.Size(pt_count, 1);
        types[this.INPUT][2] = alvision.MatrixType.CV_64FC3;

        sizes[this.INPUT][3] = new alvision.Size(4, 3);
        types[this.INPUT][3] = alvision.MatrixType.CV_64FC1;

        sizes[this.INPUT][4] = sizes[this.INPUT][5] = new alvision.Size(3, 3);
        types[this.INPUT][4] = types[this.INPUT][5] = alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_64F, 1);

        sizes[this.TEMP][0] = new alvision.Size(3, 3);
        types[this.TEMP][0] = alvision.MatrixType.CV_64FC1;
        sizes[this.TEMP][1] = new alvision.Size(pt_count, 1);
        types[this.TEMP][1] = alvision.MatrixType.CV_8UC1;

        sizes[this.OUTPUT][0] = sizes[this.REF_OUTPUT][0] = new alvision.Size(3, 1);
        types[this.OUTPUT][0] = types[this.REF_OUTPUT][0] = alvision.MatrixType.CV_64FC1;
        sizes[this.OUTPUT][1] = sizes[this.REF_OUTPUT][1] = new alvision.Size(pt_count, 1);
        types[this.OUTPUT][1] = types[this.REF_OUTPUT][1] = alvision.MatrixType.CV_8UC1;

        this.test_cpp = (alvision.cvtest.randInt(rng).valueOf() & 256) == 0;
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        return 1e-2;
    }
    run_func(): void {
        // cvFindFundamentalMat calls alvision.findFundamentalMat
        var _input0 = this.test_mat[this.INPUT][0], _input1 = this.test_mat[this.INPUT][1];
        var F = this.test_mat[this.TEMP][0], mask = this.test_mat[this.TEMP][1];
        f_result = cvFindFundamentalMat( &_input0, &_input1, &F, method, MAX(sigma * 3, 0.01), 0, &mask);
    }
    prepare_to_validation(test_case_idx: alvision.int): void {
        var Rt = this.test_mat[this.INPUT][3];
        var A1 = this.test_mat[this.INPUT][4];
        var A2 = this.test_mat[this.INPUT][5];
        double f0[9], f[9];
        var F0 = new alvision.Mat (3, 3, alvision.MatrixType.CV_64FC1, f0), F = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F, f);

        Mat invA1, invA2, R = Rt.colRange(0, 3), T;

        alvision.invert(A1, invA1, CV_SVD);
        alvision.invert(A2, invA2, CV_SVD);

        var tx = Rt.atGet<alvision.double>("double",0, 3);
        var ty = Rt.atGet<alvision.double>("double",1, 3);
        var tz = Rt.atGet<alvision.double>("double",2, 3);

        var _t_x = [0, -tz, ty, tz, 0, -tx, -ty, tx, 0];
    };

    // F = (A2^-T)*[t]_x*R*(A1^-1)
    alvision.gemm(invA2, new alvision.Mat(3, 3, alvision.MatrixType.CV_64F, _t_x), 1, new alvision.Mat(), 0, T, CV_GEMM_A_T );
    alvision.gemm(R, invA1, 1, new alvision.Mat(), 0, invA2 );
    alvision.gemm(T, invA2, 1, new alvision.Mat(), 0, F0 );
    F0 *= 1./f0[8];

    uchar* status = test_mat[TEMP][1].ptr();
    double err_level = get_success_error_level(test_case_idx, OUTPUT, 1);
    uchar* mtfm1 = test_mat[REF_OUTPUT][1].ptr();
    uchar* mtfm2 = test_mat[OUTPUT][1].ptr();
    double* f_prop1 = test_mat[REF_OUTPUT][0].ptr<double>();
    double* f_prop2 = test_mat[OUTPUT][0].ptr<double>();

    int i, pt_count = test_mat[INPUT][2].cols;
    Mat p1(1, pt_count, alvision.MatrixType.CV_64FC2);
    Mat p2(1, pt_count, alvision.MatrixType.CV_64FC2);

    test_convertHomogeneous(this.test_mat[this.INPUT][0], p1);
    test_convertHomogeneous(this.test_mat[this.INPUT][1], p2);

    alvision.cvtest.convert(this.test_mat[this.TEMP][0], F, F.type());

    if(method <= CV_FM_8POINT)
    memset(status, 1, pt_count );

    for(i = 0; i < pt_count; i++ )
    {
        var x1 = p1.at<Point2d>(i).x;
        var y1 = p1.at<Point2d>(i).y;
        var x2 = p2.at<Point2d>(i).x;
        var y2 = p2.at<Point2d>(i).y;
        double n1 = 1. / sqrt(x1 * x1 + y1 * y1 + 1);
        double n2 = 1. / sqrt(x2 * x2 + y2 * y2 + 1);
        double t0 = fabs(f0[0] * x2 * x1 + f0[1] * x2 * y1 + f0[2] * x2 +
            f0[3] * y2 * x1 + f0[4] * y2 * y1 + f0[5] * y2 +
            f0[6] * x1 + f0[7] * y1 + f0[8]) * n1 * n2;
        double t = fabs(f[0] * x2 * x1 + f[1] * x2 * y1 + f[2] * x2 +
            f[3] * y2 * x1 + f[4] * y2 * y1 + f[5] * y2 +
            f[6] * x1 + f[7] * y1 + f[8]) * n1 * n2;
        mtfm1[i] = 1;
        mtfm2[i] = !status[i] || t0 > err_level || t < err_level;
    }

    f_prop1[0] = 1;
    f_prop1[1] = 1;
    f_prop1[2] = 0;

    f_prop2[0] = f_result != 0;
    f_prop2[1] = f[8];
    f_prop2[2] = alvision.determinant(F);
    }

    int method;
    int img_size;
    int cube_size;
    int dims;
    int f_result;
    double min_f, max_f;
    double sigma;
    bool test_cpp;
};


/******************************* find essential matrix ***********************************/
class CV_EssentialMatTest extends alvision.cvtest.ArrayTest
{
    constructor() {
        // input arrays:
        //   0, 1 - arrays of 2d points that are passed to %func%.
        //          Can have different data type, layout, be stored in homogeneous coordinates or not.
        //   2 - array of 3d points that are projected to both view planes
        //   3 - [R|t] matrix for the second view plane (for the first one it is [I|0]
        //   4 - intrinsic matrix for both camera
        test_array[INPUT].push(null);
        test_array[INPUT].push(null);
        test_array[INPUT].push(null);
        test_array[INPUT].push(null);
        test_array[INPUT].push(null);
        test_array[TEMP].push(null);
        test_array[TEMP].push(null);
        test_array[TEMP].push(null);
        test_array[TEMP].push(null);
        test_array[TEMP].push(null);
        test_array[OUTPUT].push(null); // Essential Matrix singularity
        test_array[OUTPUT].push(null); // Inliers mask
        test_array[OUTPUT].push(null); // Translation error
        test_array[OUTPUT].push(null); // Positive depth count
        test_array[REF_OUTPUT].push(null);
        test_array[REF_OUTPUT].push(null);
        test_array[REF_OUTPUT].push(null);
        test_array[REF_OUTPUT].push(null);

        element_wise_relative_error = false;

        method = 0;
        img_size = 10;
        cube_size = 10;
        dims = 0;
        min_f = 1;
        max_f = 3;
        sigma = 0;
    }

    read_params(fs: alvision.FileStorage): alvision.int{
        var code = super.read_params(fs);
        return code;
    }
    fill_array(test_case_idx: alvision.int, i: alvision.int, j: alvision.int, arr: alvision.Mat): void {
        double t[12] = { 0};
        var rng = this.ts.get_rng();

        if (i != INPUT) {
            super.fill_array(test_case_idx, i, j, arr);
            return;
        }

        switch (j) {
            case 0:
            case 1:
                return; // fill them later in prepare_test_case
            case 2:
                {
                    double * p = arr.ptr<double>();
                    for (i = 0; i < arr.cols * 3; i += 3) {
                        p[i] = alvision.cvtest.randReal(rng) * cube_size;
                        p[i + 1] = alvision.cvtest.randReal(rng) * cube_size;
                        p[i + 2] = alvision.cvtest.randReal(rng) * cube_size + cube_size;
                    }
                }
                break;
            case 3:
                {
                    double r[3];
                    Mat rot_vec(3, 1, alvision.MatrixType.CV_64F, r);
                    Mat rot_mat(3, 3, alvision.MatrixType.CV_64F, t, 4 * sizeof(t[0]));
                    r[0] = alvision.cvtest.randReal(rng) * Math.PI * 2;
                    r[1] = alvision.cvtest.randReal(rng) * Math.PI * 2;
                    r[2] = alvision.cvtest.randReal(rng) * Math.PI * 2;

                    alvision.cvtest.Rodrigues(rot_vec, rot_mat);
                    t[3] = alvision.cvtest.randReal(rng) * cube_size;
                    t[7] = alvision.cvtest.randReal(rng) * cube_size;
                    t[11] = alvision.cvtest.randReal(rng) * cube_size;
                    Mat(3, 4, alvision.MatrixType.CV_64F, t).convertTo(arr, arr.type());
                }
                break;
            case 4:
                t[0] = t[4] = alvision.cvtest.randReal(rng) * (max_f - min_f) + min_f;
                t[2] = (img_size * 0.5 + alvision.cvtest.randReal(rng) * 4. - 2.) * t[0];
                t[5] = (img_size * 0.5 + alvision.cvtest.randReal(rng) * 4. - 2.) * t[4];
                t[8] = 1.;
                Mat(3, 3, alvision.MatrixType.CV_64F, t).convertTo(arr, arr.type());
                break;
        }
    }
    prepare_test_case(test_case_idx: alvision.int): alvision.int{
        int code = super.prepare_test_case(test_case_idx);
        if (code > 0) {
            const Mat& _3d = test_mat[INPUT][2];
            var rng = this.ts.get_rng();
            double Idata[] = { 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0 };
            Mat I(3, 4, alvision.MatrixType.CV_64F, Idata);
            int k;

            for (k = 0; k < 2; k++) {
                const Mat& Rt = k == 0 ? I : test_mat[INPUT][3];
                const Mat& A = test_mat[INPUT][4];
                Mat & _2d = test_mat[INPUT][k];

                test_projectPoints(_3d, Rt, A, _2d, &rng, sigma);
            }
        }

        return code;
    }
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        var rng = this.ts.get_rng();
        int pt_depth = alvision.cvtest.randInt(rng) % 2 == 0 ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_64F;
        double pt_count_exp = alvision.cvtest.randReal(rng) * 6 + 1;
        int pt_count = MAX(5, Math.round(exp(pt_count_exp)));

        dims = alvision.cvtest.randInt(rng) % 2 + 2;
        dims = 2;
        method = CV_LMEDS << (alvision.cvtest.randInt(rng) % 2);

        types[INPUT][0] = alvision.MatrixType.CV_MAKETYPE(pt_depth, 1);

        if (0 && alvision.cvtest.randInt(rng) % 2)
            sizes[INPUT][0] = alvision.Size(pt_count, dims);
        else {
            sizes[INPUT][0] = alvision.Size(dims, pt_count);
            if (alvision.cvtest.randInt(rng) % 2) {
                types[INPUT][0] = CV_MAKETYPE(pt_depth, dims);
                if (alvision.cvtest.randInt(rng) % 2)
                    sizes[INPUT][0] = alvision.Size(pt_count, 1);
                else
                    sizes[INPUT][0] = alvision.Size(1, pt_count);
            }
        }

        sizes[INPUT][1] = sizes[INPUT][0];
        types[INPUT][1] = types[INPUT][0];

        sizes[INPUT][2] = alvision.Size(pt_count, 1);
        types[INPUT][2] = alvision.MatrixType.CV_64FC3;

        sizes[INPUT][3] = alvision.Size(4, 3);
        types[INPUT][3] = alvision.MatrixType.CV_64FC1;

        sizes[INPUT][4] = alvision.Size(3, 3);
        types[INPUT][4] = alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_64F, 1);

        sizes[TEMP][0] = alvision.Size(3, 3);
        types[TEMP][0] = alvision.MatrixType.CV_64FC1;
        sizes[TEMP][1] = alvision.Size(pt_count, 1);
        types[TEMP][1] = CV_8UC1;
        sizes[TEMP][2] = alvision.Size(3, 3);
        types[TEMP][2] = alvision.MatrixType.CV_64FC1;
        sizes[TEMP][3] = alvision.Size(3, 1);
        types[TEMP][3] = alvision.MatrixType.CV_64FC1;
        sizes[TEMP][4] = alvision.Size(pt_count, 1);
        types[TEMP][4] = CV_8UC1;

        sizes[OUTPUT][0] = sizes[REF_OUTPUT][0] = alvision.Size(3, 1);
        types[OUTPUT][0] = types[REF_OUTPUT][0] = alvision.MatrixType.CV_64FC1;
        sizes[OUTPUT][1] = sizes[REF_OUTPUT][1] = alvision.Size(pt_count, 1);
        types[OUTPUT][1] = types[REF_OUTPUT][1] = CV_8UC1;
        sizes[OUTPUT][2] = sizes[REF_OUTPUT][2] = alvision.Size(1, 1);
        types[OUTPUT][2] = types[REF_OUTPUT][2] = alvision.MatrixType.CV_64FC1;
        sizes[OUTPUT][3] = sizes[REF_OUTPUT][3] = alvision.Size(1, 1);
        types[OUTPUT][3] = types[REF_OUTPUT][3] = CV_8UC1;
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        return 1e-2;
    }
    run_func(): void {
        Mat _input0(test_mat[INPUT][0]), _input1(test_mat[INPUT][1]);
        Mat K(test_mat[INPUT][4]);
        double focal(K.at<double>(0, 0));
        alvision.Point2d pp(K.at<double>(0, 2), K.at<double>(1, 2));

        var rng = this.ts.get_rng();
        Mat E, mask1(test_mat[TEMP][1]);
        E = alvision.findEssentialMat(_input0, _input1, focal, pp, method, 0.99, MAX(sigma * 3, 0.0001), mask1);
        if (E.rows > 3) {
            int count = E.rows / 3;
            int row = (alvision.cvtest.randInt(rng) % count) * 3;
            E = E.rowRange(row, row + 3) * 1.0;
        }

        E.copyTo(test_mat[TEMP][0]);

        Mat R, t, mask2;
        recoverPose(E, _input0, _input1, R, t, focal, pp, mask2);
        R.copyTo(test_mat[TEMP][2]);
        t.copyTo(test_mat[TEMP][3]);
        mask2.copyTo(test_mat[TEMP][4]);
    }
    prepare_to_validation(test_case_idx: alvision.int): void {
        const Mat& Rt0 = test_mat[INPUT][3];
        const Mat& A = test_mat[INPUT][4];
        double f0[9], f[9], e[9];
        Mat F0(3, 3, alvision.MatrixType.CV_64FC1, f0), F(3, 3, alvision.MatrixType.CV_64F, f);
        Mat E(3, 3, alvision.MatrixType.CV_64F, e);

        Mat invA, R = Rt0.colRange(0, 3), T1, T2;

        alvision.invert(A, invA, CV_SVD);

        double tx = Rt0.at<double>(0, 3);
        double ty = Rt0.at<double>(1, 3);
        double tz = Rt0.at<double>(2, 3);

        double _t_x[] = { 0, -tz, ty, tz, 0, -tx, -ty, tx, 0
    };

    // F = (A2^-T)*[t]_x*R*(A1^-1)
    alvision.gemm(invA, Mat(3, 3, alvision.MatrixType.CV_64F, _t_x), 1, Mat(), 0, T1, CV_GEMM_A_T );
    alvision.gemm(R, invA, 1, Mat(), 0, T2 );
    alvision.gemm(T1, T2, 1, Mat(), 0, F0 );
    F0 *= 1./f0[8];

    uchar* status = test_mat[TEMP][1].ptr();
    double err_level = get_success_error_level(test_case_idx, OUTPUT, 1);
    uchar* mtfm1 = test_mat[REF_OUTPUT][1].ptr();
    uchar* mtfm2 = test_mat[OUTPUT][1].ptr();
    double* e_prop1 = test_mat[REF_OUTPUT][0].ptr<double>();
    double* e_prop2 = test_mat[OUTPUT][0].ptr<double>();
    Mat E_prop2 = Mat(3, 1, alvision.MatrixType.CV_64F, e_prop2);

    int i, pt_count = test_mat[INPUT][2].cols;
    Mat p1(1, pt_count, alvision.MatrixType.CV_64FC2);
    Mat p2(1, pt_count, alvision.MatrixType.CV_64FC2);

    test_convertHomogeneous(test_mat[INPUT][0], p1);
    test_convertHomogeneous(test_mat[INPUT][1], p2);

    alvision.cvtest.convert(test_mat[TEMP][0], E, E.type());
    alvision.gemm(invA, E, 1, Mat(), 0, T1, CV_GEMM_A_T );
    alvision.gemm(T1, invA, 1, Mat(), 0, F );

    for(i = 0; i < pt_count; i++ )
    {
        double x1 = p1.at<Point2d>(i).x;
        double y1 = p1.at<Point2d>(i).y;
        double x2 = p2.at<Point2d>(i).x;
        double y2 = p2.at<Point2d>(i).y;
        //        double t0 = sampson_error(f0, x1, y1, x2, y2);
        //        double t = sampson_error(f, x1, y1, x2, y2);
        double n1 = 1. / sqrt(x1 * x1 + y1 * y1 + 1);
        double n2 = 1. / sqrt(x2 * x2 + y2 * y2 + 1);
        double t0 = fabs(f0[0] * x2 * x1 + f0[1] * x2 * y1 + f0[2] * x2 +
            f0[3] * y2 * x1 + f0[4] * y2 * y1 + f0[5] * y2 +
            f0[6] * x1 + f0[7] * y1 + f0[8]) * n1 * n2;
        double t = fabs(f[0] * x2 * x1 + f[1] * x2 * y1 + f[2] * x2 +
            f[3] * y2 * x1 + f[4] * y2 * y1 + f[5] * y2 +
            f[6] * x1 + f[7] * y1 + f[8]) * n1 * n2;
        mtfm1[i] = 1;
        mtfm2[i] = !status[i] || t0 > err_level || t < err_level;
    }

    e_prop1[0] = sqrt(0.5);
    e_prop1[1] = sqrt(0.5);
    e_prop1[2] = 0;

    e_prop2[0] = 0;
    e_prop2[1] = 0;
    e_prop2[2] = 0;
    SVD::compute(E, E_prop2);



    double* pose_prop1 = this.test_mat[this.REF_OUTPUT][2].ptr<double>();
    double* pose_prop2 = this.test_mat[this.OUTPUT][2].ptr<double>();
    double terr1 = alvision.cvtest.norm(Rt0.col(3) / norm(Rt0.col(3)) + this.test_mat[this.TEMP][3], alvision.NormTypes.NORM_L2);
    double terr2 = alvision.cvtest.norm(Rt0.col(3) / norm(Rt0.col(3)) - this.test_mat[this.TEMP][3], alvision.NormTypes.NORM_L2);
    Mat rvec;
    alvision.Rodrigues(Rt0.colRange(0, 3), rvec);
    pose_prop1[0] = 0;
    // No check for CV_LMeDS on translation. Since it
    // involves with some degraded problem, when data is exact inliers.
    pose_prop2[0] = method == CV_LMEDS || pt_count == 5 ? 0 : MIN(terr1, terr2);


    //    int inliers_count = countNonZero(test_mat[TEMP][1]);
    //    int good_count = countNonZero(test_mat[TEMP][4]);
    this.test_mat[this.OUTPUT][3] = true; //good_count >= inliers_count / 2;
    this.test_mat[this.REF_OUTPUT][3] = true;
    }

sampson_error(f : Array < alvision.double >, x1 :alvision.double, y1 : alvision.double, x2 : alvision.double, y2 : alvision.double): alvision.double {
    var Fx1 = [
        f[0] * x1 + f[1] * y1 + f[2],
        f[3] * x1 + f[4] * y1 + f[5],
        f[6] * x1 + f[7] * y1 + f[8]
    ]
    var Ftx2 = [
        f[0] * x2 + f[3] * y2 + f[6],
        f[1] * x2 + f[4] * y2 + f[7],
        f[2] * x2 + f[5] * y2 + f[8]
    ]
    var x2tFx1 = Fx1[0] * x2 + Fx1[1] * y2 + Fx1[2];

    var error = x2tFx1 * x2tFx1 / (Fx1[0] * Fx1[0] + Fx1[1] * Fx1[1] + Ftx2[0] * Ftx2[0] + Ftx2[1] * Ftx2[1]);
    error = Math.sqrt(error);
    return error;
}


    protected  method       : alvision.int;
    protected  img_size     : alvision.int;
    protected  cube_size    : alvision.int;
    protected  dims: alvision.int;
    protected min_f: alvision.double;
    protected max_f: alvision.double;
    protected sigma: alvision.double;
};



/********************************** convert homogeneous *********************************/

class CV_ConvertHomogeneousTest extends alvision.cvtest.ArrayTest
{
    constructor() {
        test_array[INPUT].push(null);
        test_array[OUTPUT].push(null);
        test_array[REF_OUTPUT].push(null);
        element_wise_relative_error = false;

        pt_count = dims1 = dims2 = 0;

    }

    read_params(fs: alvision.FileStorage): alvision.int{
        int code = super.read_params(fs);
        return code;
    }
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        var rng = this.ts.get_rng();
        int pt_depth1 = alvision.cvtest.randInt(rng) % 2 == 0 ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_64F;
        int pt_depth2 = alvision.cvtest.randInt(rng) % 2 == 0 ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_64F;
        double pt_count_exp = alvision.cvtest.randReal(rng) * 6 + 1;
        int t;

        pt_count = Math.round(exp(pt_count_exp));
        pt_count = MAX(pt_count, 5);

        dims1 = 2 + (alvision.cvtest.randInt(rng) % 3);
        dims2 = 2 + (alvision.cvtest.randInt(rng) % 3);

        if (dims1 == dims2 + 2)
            dims1--;
        else if (dims1 == dims2 - 2)
            dims1++;

        if (alvision.cvtest.randInt(rng) % 2)
            CV_SWAP(dims1, dims2, t);

        types[INPUT][0] = alvision.MatrixType.CV_MAKETYPE(pt_depth1, 1);

        if (alvision.cvtest.randInt(rng) % 2)
            sizes[INPUT][0] = alvision.Size(pt_count, dims1);
        else {
            sizes[INPUT][0] = alvision.Size(dims1, pt_count);
            if (alvision.cvtest.randInt(rng) % 2) {
                types[INPUT][0] = alvision.MatrixType.CV_MAKETYPE(pt_depth1, dims1);
                if (alvision.cvtest.randInt(rng) % 2)
                    sizes[INPUT][0] = alvision.Size(pt_count, 1);
                else
                    sizes[INPUT][0] = alvision.Size(1, pt_count);
            }
        }

        types[OUTPUT][0] = alvision.MatrixType.CV_MAKETYPE(pt_depth2, 1);

        if (alvision.cvtest.randInt(rng) % 2)
            sizes[OUTPUT][0] = alvision.Size(pt_count, dims2);
        else {
            sizes[OUTPUT][0] = alvision.Size(dims2, pt_count);
            if (alvision.cvtest.randInt(rng) % 2) {
                types[OUTPUT][0] = alvision.MatrixType.CV_MAKETYPE(pt_depth2, dims2);
                if (alvision.cvtest.randInt(rng) % 2)
                    sizes[OUTPUT][0] = alvision.Size(pt_count, 1);
                else
                    sizes[OUTPUT][0] = alvision.Size(1, pt_count);
            }
        }

        types[REF_OUTPUT][0] = types[OUTPUT][0];
        sizes[REF_OUTPUT][0] = sizes[OUTPUT][0];
    }
    fill_array(test_case_idx: alvision.int, i: alvision.int, j: alvision.int, arr: alvision.Mat): void {
        Mat temp(1, pt_count, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_64FC1, dims1));
        var rng = this.ts.get_rng();
        CvScalar low = cvScalarAll(0), high = cvScalarAll(10);

        if (dims1 > dims2)
            low.val[dims1 - 1] = 1.;

        alvision.cvtest.randUni(rng, temp, low, high);
        test_convertHomogeneous(temp, arr);
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        return 1e-5;
    }
    run_func(): void {
        CvMat _input = test_mat[INPUT][0], _output = test_mat[OUTPUT][0];
        cvConvertPointsHomogeneous( &_input, &_output);
    }
    prepare_to_validation(test_case_idx: alvision.int): void {
        test_convertHomogeneous(test_mat[INPUT][0], test_mat[REF_OUTPUT][0]);
    }

    int dims1, dims2;
    int pt_count;
};

/************************** compute corresponding epipolar lines ************************/

class CV_ComputeEpilinesTest extends alvision.cvtest.ArrayTest
{
    constructor() {
        test_array[INPUT].push(null);
        test_array[INPUT].push(null);
        test_array[OUTPUT].push(null);
        test_array[REF_OUTPUT].push(null);
        element_wise_relative_error = false;

        pt_count = dims = which_image = 0;
    }

    read_params(fs: alvision.FileStorage): alvision.int{
    int code = super.read_params(fs);
    return code;
}
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        var rng = this.ts.get_rng();
        int fm_depth = alvision.cvtest.randInt(rng) % 2 == 0 ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_64F;
        int pt_depth = alvision.cvtest.randInt(rng) % 2 == 0 ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_64F;
        int ln_depth = alvision.cvtest.randInt(rng) % 2 == 0 ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_64F;
        double pt_count_exp = alvision.cvtest.randReal(rng) * 6;

        which_image = 1 + (alvision.cvtest.randInt(rng) % 2);

        pt_count = Math.round(exp(pt_count_exp));
        pt_count = MAX(pt_count, 1);
        bool few_points = pt_count < 5;

        dims = 2 + (alvision.cvtest.randInt(rng) % 2);

        types[INPUT][0] = alvision.MatrixType.CV_MAKETYPE(pt_depth, 1);

        if (alvision.cvtest.randInt(rng) % 2 && !few_points)
            sizes[INPUT][0] = alvision.Size(pt_count, dims);
        else {
            sizes[INPUT][0] = alvision.Size(dims, pt_count);
            if (alvision.cvtest.randInt(rng) % 2 || few_points) {
                types[INPUT][0] = alvision.MatrixType.CV_MAKETYPE(pt_depth, dims);
                if (alvision.cvtest.randInt(rng) % 2)
                    sizes[INPUT][0] = alvision.Size(pt_count, 1);
                else
                    sizes[INPUT][0] = alvision.Size(1, pt_count);
            }
        }

        types[INPUT][1] = alvision.MatrixType.CV_MAKETYPE(fm_depth, 1);
        sizes[INPUT][1] = alvision.Size(3, 3);

        types[OUTPUT][0] = alvision.MatrixType.CV_MAKETYPE(ln_depth, 1);

        if (alvision.cvtest.randInt(rng) % 2 && !few_points)
            sizes[OUTPUT][0] = alvision.Size(pt_count, 3);
        else {
            sizes[OUTPUT][0] = alvision.Size(3, pt_count);
            if (alvision.cvtest.randInt(rng) % 2 || few_points) {
                types[OUTPUT][0] = alvision.MatrixType.CV_MAKETYPE(ln_depth, 3);
                if (alvision.cvtest.randInt(rng) % 2)
                    sizes[OUTPUT][0] = alvision.Size(pt_count, 1);
                else
                    sizes[OUTPUT][0] = alvision.Size(1, pt_count);
            }
        }

        types[REF_OUTPUT][0] = types[OUTPUT][0];
        sizes[REF_OUTPUT][0] = sizes[OUTPUT][0];
    }
    fill_array(test_case_idx: alvision.int, i: alvision.int, j: alvision.int, arr: alvision.Mat): void {
        var rng = this.ts.get_rng();

        if (i == INPUT && j == 0) {
            Mat temp(1, pt_count, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_64FC1, dims));
            alvision.cvtest.randUni(rng, temp, cvScalar(0, 0, 1), cvScalarAll(10));
            test_convertHomogeneous(temp, arr);
        }
        else if (i == INPUT && j == 1)
            alvision.cvtest.randUni(rng, arr, cvScalarAll(0), cvScalarAll(10));
        else
            super.fill_array(test_case_idx, i, j, arr);
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        return 1e-5;
    }
    run_func(): void {
        CvMat _points = test_mat[INPUT][0], _F = test_mat[INPUT][1], _lines = test_mat[OUTPUT][0];
        cvComputeCorrespondEpilines( &_points, which_image, &_F, &_lines);
    }
    prepare_to_validation(test_case_idx: alvision.int): void {
        Mat pt(1, pt_count, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_64F, 3));
        Mat lines(1, pt_count, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_64F, 3));
        double f[9];
        Mat F(3, 3, alvision.MatrixType.CV_64F, f);

        test_convertHomogeneous(test_mat[INPUT][0], pt);
        test_mat[INPUT][1].convertTo(F, alvision.MatrixType.CV_64F);
        if (which_image == 2)
            alvision.transpose(F, F);

        for (int i = 0; i < pt_count; i++ )
        {
            double * p = pt.ptr<double>() + i * 3;
            double * l = lines.ptr<double>() + i * 3;
            double t0 = f[0] * p[0] + f[1] * p[1] + f[2] * p[2];
            double t1 = f[3] * p[0] + f[4] * p[1] + f[5] * p[2];
            double t2 = f[6] * p[0] + f[7] * p[1] + f[8] * p[2];
            double d = sqrt(t0 * t0 + t1 * t1);
            d = d ? 1. / d : 1.;
            l[0] = t0 * d; l[1] = t1 * d; l[2] = t2 * d;
        }

        test_convertHomogeneous(lines, test_mat[REF_OUTPUT][0]);
    }

    int which_image;
    int dims;
    int pt_count;
};




alvision.cvtest.TEST('Calib3d_Rodrigues', 'accuracy', () => { var test = new CV_RodriguesTest(); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_FindFundamentalMat', 'accuracy', () => { var test = new CV_FundamentalMatTest(); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_ConvertHomogeneoous', 'accuracy', () => { var test = new CV_ConvertHomogeneousTest(); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_ComputeEpilines', 'accuracy', () => { var test = new CV_ComputeEpilinesTest(); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_FindEssentialMat', 'accuracy', () => { var test = new CV_EssentialMatTest(); test.safe_run(); });

/* End of file. */
