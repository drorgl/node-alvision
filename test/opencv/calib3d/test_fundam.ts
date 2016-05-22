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
    var matJ = new alvision.Mat(3, 9, alvision.MatrixType.CV_64F);//, J);

    var depth = src.type();// CV_MAT_DEPTH(src.type);

    if( jacobian )
    {
        alvision.assert(()=> (jacobian.rows == 9 && jacobian.cols == 3) ||
                (jacobian.rows == 3 && jacobian.cols == 9) );
    }

    if( src.cols == 1 || src.rows == 1 )
    {
        //double r[3], theta;
        var rtype = alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_64F, src.channels());
        var _r = new alvision.Mat(src.rows, src.cols,rtype);// CV_MAT_CN(src.type)), r);
        var r = _r.ptr<alvision.double>("double");

        alvision.assert(()=> dst.rows == 3 && dst.cols == 3 );

        src.convertTo(_r, rtype);
        //alvision.cvConvert( src, _r );

        var theta = Math.sqrt(r[0].valueOf() * r[0].valueOf() + r[1].valueOf() *r[1]. valueOf() + r[2].valueOf()*r[2].valueOf());
        if( theta < alvision.DBL_EPSILON )
        {
            alvision.setIdentity( dst );

            if( jacobian )
            {
                //memset( J, 0, sizeof(J) );
                var J = matJ.ptr<alvision.double>("double");
                J.forEach((v, i, a) => a[i] = 0);
                
                J[5] = J[15] = J[19] = 1;
                J[7] = J[11] = J[21] = -1;
            }
        }
        else
        {
            // omega = r/theta (~[w1, w2, w3])
            var itheta = 1./theta;
            var w1 = r[0].valueOf()*itheta, w2 = r[1].valueOf()*itheta, w3 = r[2].valueOf()*itheta;
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
            //double R[9];
            var _omegav = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F, omegav);
            var matA =    new alvision.Mat(3, 3, alvision.MatrixType.CV_64F, A);
            var matR = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);//, R);

            alvision.setIdentity(matR, new alvision.Scalar(alpha));
            alvision.scaleAdd( _omegav, (beta), matR, matR );
            alvision.scaleAdd( matA, (gamma),   matR, matR );
            matR.convertTo( dst,dst.type() );

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
                //double t0[9*4];
                //double dm1dm2[21*4];
                //double dRdm1[9*21];
                var _dm3din = new alvision.Mat(4, 3, alvision.MatrixType.CV_64FC1 , dm3din );
                var _dm2dm3 = new alvision.Mat(4, 4, alvision.MatrixType.CV_64FC1, dm2dm3 );
                var _dm1dm2 = new alvision.Mat(21, 4, alvision.MatrixType.CV_64FC1);//, dm1dm2 );
                var _dRdm1 =  new alvision.Mat(9, 21, alvision.MatrixType.CV_64FC1);//, dRdm1 );
                //var _dRdm1_part = new alvision.Mat();
                var _t0 = new alvision.Mat(9, 4, alvision.MatrixType.CV_64FC1);//, t0 );
                var _t1 = new alvision.Mat(9, 4, alvision.MatrixType.CV_64FC1);//, dRdm1 );

                var dm1dm2 = _dm1dm2.ptr<alvision.double>("double");
                var dRdm1 = _t1.ptr<alvision.double>("double");

                // m1 = [alpha, beta, gamma, omegav; A]
                //memset(dm1dm2, 0, sizeof(dm1dm2));
                dm1dm2.forEach((v, i, a) => a[i] = 0);
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


                var _dm1dm2_part = _dm1dm2.roi(new alvision.Rect(0, 12, 3, 9));
                alvision.transpose(_dm1dw, _dm1dm2_part);
                //cvGetSubRect( &_dm1dm2, &_dm1dm2_part, cvRect(0,12,3,9) );
                //alvision.transpose( &_dm1dw, &_dm1dm2_part );

                dRdm1.forEach((v, i, a) => a[i] = 0);
                //memset( dRdm1, 0, sizeof(dRdm1) );


                dRdm1[0*21] = dRdm1[4*21] = dRdm1[8*21] = 1;

                var _dRdm1_part  = _dRdm1.col(1)
                //cvGetCol( &_dRdm1, &_dRdm1_part, 1 );

                alvision.transpose(_omegav, _omegav);
                
                _omegav = _omegav.reshape(1,1)

                alvision.transpose( _omegav, _dRdm1_part );

                _dRdm1_part = _dRdm1.col(2);

                matA = matA.reshape(1, 1);

                alvision.transpose( matA, _dRdm1_part );

                _dRdm1_part = _dRdm1.roi(new alvision.Rect(3, 0, 9, 9));

                alvision.setIdentity( _dRdm1_part, alvision.Scalar.all(beta));

                _dRdm1_part = _dRdm1.roi(new alvision.Rect(12, 0, 9, 9));

                alvision.setIdentity( _dRdm1_part, alvision.Scalar.all(gamma));

                matJ = new alvision.Mat(9, 3, alvision.MatrixType.CV_64FC1, J );

                _t0 = alvision.MatExpr.op_Multiplication(_dRdm1, _dm1dm2).toMat();
                _t1 = alvision.MatExpr.op_Multiplication(_t0, _dm2dm3).toMat();
                matJ = alvision.MatExpr.op_Multiplication(_t1, _dm3din).toMat();


                _t0 = new alvision.Mat(3, 9, alvision.MatrixType.CV_64FC1, _t0.ptr<alvision.double>("double") );
                alvision.transpose( matJ, _t0 );

                for(var i = 0; i < 3; i++ )
                {
                    _t1 = new alvision.Mat(3, 3, alvision.MatrixType.CV_64FC1, (alvision.MatExpr.op_Addition( _t0 , i*9).toMat().ptr<alvision.double>("double")) );
                    alvision.transpose( _t1, _t1 );
                }

                alvision.transpose( _t0, matJ );
            }
        }
    }
    else if( src.cols == 3 && src.rows == 3 )
    {
        //double R[9], A[9], I[9], r[3], W[3], U[9], V[9];
        //double tr, alpha, beta, theta;
        var matR = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);//, R );
        var R = matR.ptr<alvision.double>("double");
        var matA = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);//, A );
        var matI = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);//, I );
        var _r = new alvision.Mat(dst.rows, dst.cols, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_64F,dst.channels()), r );
        var matW = new alvision.Mat(1, 3, alvision.MatrixType.CV_64F);//, W );
        var matU = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);//, U );
        var matV = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);//, V );

        src.convertTo(matR, matR.type());


        alvision.SVD.compute(matR, matW, matU, matV, alvision.SVDFlags.MODIFY_A + alvision.SVDFlags.NO_UV + alvision.SVDFlags.FULL_UV);
        alvision.gemm( matU, matV, 1, 0, 0, matR, alvision.GemmFlags.GEMM_1_T );

        alvision.mulTransposed(matR, matA, false );
        alvision.setIdentity(matI );

        if( alvision.norm(matA,matI,alvision.NormTypes.NORM_INF) > 1e-3 ||
            Math.abs(alvision.determinant(matR).valueOf() - 1 ) > 1e-3 )
            return 0;

        var tr = (alvision.trace(matR).Element(0).valueOf() - 1.)*0.5;
        tr = tr > 1. ? 1. : tr < -1. ? -1. : tr;
        theta = Math.acos(tr);
        alpha = Math.cos(theta);
        beta =  Math.sin(theta);

        if( beta >= 1e-5 )
        {
            var  dtheta_dtr = -1./Math.sqrt(1 - tr*tr);
            var vth = 1/(2*beta);

            // om1 = [R(3,2) - R(2,3), R(1,3) - R(3,1), R(2,1) - R(1,2)]'
            var om1 = [ R[7].valueOf() - R[5].valueOf(), R[2].valueOf() - R[6].valueOf(), R[3].valueOf() - R[1].valueOf() ];
            // om = om1*vth
            // r = om*theta
            var d3 = vth*theta;

            r[0] = om1[0] * d3; r[1] = om1[1] * d3; r[2] = om1[2] * d3;
            _r.convertTo(dst,dst.type());

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
                //double t0[3*5];
                var _t0 = new alvision.Mat(3, 5, alvision.MatrixType.CV_64FC1);//, t0 );

                _t0 = alvision.MatExpr.op_Multiplication(_domegadvar2, _dvar2dvar).toMat();
                //cvMatMul( &_domegadvar2, &_dvar2dvar, &_t0 );
                matJ = alvision.MatExpr.op_Multiplication(_t0, _dvardR).toMat();
                //cvMatMul( &_t0, &_dvardR, &matJ);
            }
        }
        else if( tr > 0 )
        {
            dst.setTo(new alvision.Scalar(0));
            if( jacobian )
            {
                J.forEach((v, i, a) => a[i] = 0);
                J[5] = J[15] = J[19] = 0.5;
                J[7] = J[11] = J[21] = -0.5;
            }
        }
        else
        {
            r[0] = theta*Math.sqrt((R[0].valueOf() + 1)*0.5);
            r[1] = theta*Math.sqrt((R[4].valueOf() + 1)*0.5)*(R[1] >= 0 ? 1 : -1);
            r[2] = theta * Math.sqrt((R[8].valueOf() + 1) * 0.5) * (R[2] >= 0 ? 1 : -1);
            _r.convertTo(dst, dst.type());

            if (jacobian)
                J.forEach((v, i, a) => a[i] = 0);
        }

        if( jacobian )
        {
            for( i = 0; i < 3; i++ )
            {
                var t = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F,J.slice( i*9) );
                alvision.transpose( t, t );
            }
        }
    }
    else
    {
        alvision.assert(()=>false);
        return 0;
    }

    if( jacobian )
    {
        if (depth == alvision.MatrixType.CV_32F) {
            if (jacobian.rows == matJ.rows)
                matJ.convertTo(jacobian, jacobian.type());
            //cvConvert( &matJ, jacobian );
            else {
                var _Jf = new alvision.Mat(matJ.rows, matJ.cols, alvision.MatrixType.CV_32FC1);//, Jf );
                matJ.convertTo(_Jf, _Jf.type());
                //cvConvert( &matJ, &_Jf );
                alvision.transpose(_Jf, jacobian);
            }
        }
        else if (jacobian.rows == matJ.rows)
            matJ.copyTo(jacobian);
            //cvCopy( &matJ, jacobian );
        else
            alvision.transpose( matJ, jacobian );
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
    var count, sdims, ddims;
    var sstep1 : number, sstep2 : number, dstep1 : number, dstep2 : number;

    if (src.depth() != alvision.MatrixType.CV_64F )
        _src.convertTo(src, alvision.MatrixType.CV_64F);

    if (dst.depth() != alvision.MatrixType. CV_64F )
        dst.create(dst.size(), alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_64F, _dst.channels()));

    if( src.rows > src.cols )
    {
        count = src.rows;
        sdims = src.channels().valueOf()*src.cols.valueOf();
        sstep1 = src.step;//(int)(src.step/sizeof(double));
        sstep2 = 1;
    }
    else
    {
        count = src.cols;
        sdims = src.channels().valueOf()*src.rows.valueOf();
        if( src.rows == 1 )
        {
            sstep1 = sdims;
            sstep2 = 1;
        }
        else
        {
            sstep1 = 1;
            sstep2 = src.step;//(int)(src.step/sizeof(double));
        }
    }

    if( dst.rows > dst.cols )
    {
        alvision.CV_Assert(()=> count == dst.rows );
        ddims = dst.channels().valueOf()*dst.cols.valueOf();
        dstep1 = dst.step;//(int)(dst.step/sizeof(double));
        dstep2 = 1;
    }
    else
    {
        alvision.assert(()=> count == dst.cols );
        ddims = dst.channels().valueOf()*dst.rows.valueOf();
        if( dst.rows == 1 )
        {
            dstep1 = ddims;
            dstep2 = 1;
        }
        else
        {
            dstep1 = 1;
            dstep2 = dst.step;//(int)(dst.step/sizeof(double));
        }
    }

    var s = src.ptr<alvision.double>("double");
    var d = dst.ptr<alvision.double>("double");
    var sstart = 0;
    var dstart = 0;

    if( sdims <= ddims )
    {
        var wstep = dstep2*(ddims - 1);

        for(var i = 0; i < count; i++, sstart += sstep1, dstart += dstep1 )
        {
            var x = s[sstart + 0];
            var y = s[sstart + sstep2];

            d[dstart + wstep] = 1;
            d[dstart + 0] = x;
            d[dstart + dstep2] = y;

            if( sdims >= 3 )
            {
                d[dstart + dstep2*2] = s[sstart + sstep2*2];
                if( sdims == 4 )
                    d[dstart + dstep2*3] = s[sstart + sstep2*3];
            }
        }
    }
    else
    {
        var wstep = sstep2*(sdims - 1);

        for(var i = 0; i < count; i++, sstart += sstep1, dstart += dstep1 )
        {
            var w = s[sstart + wstep];
            var x = s[sstart + 0];
            var y = s[sstart + sstep2];

            w = w ? 1./w.valueOf() : 1;

            d[dstart + 0] = x.valueOf()*w.valueOf();
            d[dstart + dstep2] = y.valueOf()*w.valueOf();

            if( ddims == 3 )
                d[dstart + dstep2*2] = s[sstart + sstep2*2].valueOf()*w.valueOf();
        }
    }

    if( dst.data != _dst.data )
        dst.convertTo(_dst, _dst.depth());
}


function test_projectPoints( _3d : alvision.Mat,  Rt : alvision.Mat,  A : alvision.Mat, _2d : alvision.Mat, rng : alvision.RNG, sigma : alvision.double ) : void
{
    alvision.CV_Assert(()=> _3d.isContinuous() );

    //double p[12];
    var P = new alvision.Mat(3, 4, alvision.MatrixType.CV_64F);//, p );
    var p = P.ptr<alvision.double>("double");
    alvision.gemm(A, Rt, 1,new alvision. Mat(), 0, P);

    var count = _3d.cols;

    var noise = new alvision.Mat();
    if( rng )
    {
        if( sigma == 0 )
            rng = null;
        else
        {
            noise.create(1, _3d.cols, alvision.MatrixType.CV_64FC2 );
            rng.fill(noise, alvision.DistType.NORMAL, alvision.Scalar.all(0), alvision.Scalar.all(sigma) );
        }
    }

    var temp = new alvision.Mat(1, count, alvision.MatrixType.CV_64FC3 );

    for(var i = 0; i < count; i++ )
    {
        var M = _3d.ptr<alvision.double>("double").slice( i*3);
        var m = temp.ptr<alvision.double>("double").slice(i * 3);
        var X = M[0], Y = M[1], Z = M[2];
        var u = p[0].valueOf()*X.valueOf() + p[1].valueOf()*Y.valueOf() + p[2].valueOf()*Z.valueOf() +  p[3].valueOf() ;
        var v = p[4].valueOf()*X.valueOf() + p[5].valueOf()*Y.valueOf() + p[6].valueOf()*Z.valueOf() +  p[7] .valueOf();
        var s = p[8].valueOf()*X.valueOf() + p[9].valueOf()*Y.valueOf() + p[10].valueOf()*Z.valueOf() + p[11].valueOf();

        if( !noise.empty() )
        {
            u += noise.at<alvision.Point2d>("Point2d",i).get().x.valueOf()*s;
            v += noise.at<alvision.Point2d>("Point2d",i).get().y.valueOf()*s;
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
             var _r = new alvision.Mat(arr.rows, arr.cols, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_64F, arr.channels()) );
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
            r[0] =r[0].valueOf() * f;
            r[1] =r[1].valueOf() * f;
            r[2] =r[2].valueOf() * f;

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
            var _input = this.test_mat[this.INPUT][0], _output = this.test_mat[this.OUTPUT][0], _output2 = this.test_mat[this.OUTPUT][2];
            alvision.Rodrigues(_input, _output, this.calc_jacobians ? v2m_jac : null);//Rodrigues2
            alvision.Rodrigues(_output, _output2, this.calc_jacobians ? m2v_jac : null);//Rodrigues2
        }
        else {
            var v = this.test_mat[this.INPUT][0], M = this.test_mat[this.OUTPUT][0], v2 = this.test_mat[this.OUTPUT][2];
            var M0 = M, v2_0 = v2;
            if (!this.calc_jacobians) {
                alvision.Rodrigues(v, M);
                alvision.Rodrigues(M, v2);
            }
            else {
                var J1 = this.test_mat[this.OUTPUT][1], J2 = this.test_mat[this.OUTPUT][3];
                var J1_0 = J1, J2_0 = J2;
                alvision.Rodrigues(v, M, J1);
                alvision.Rodrigues(M, v2, J2);
                if (J1.data != J1_0.data) {
                    if (J1.size() != J1_0.size())
                        J1 = J1.t().toMat();
                    J1.convertTo(J1_0, J1_0.type());
                }
                if (J2.data != J2_0.data) {
                    if (J2.size() != J2_0.size())
                        J2 = J2.t().toMat();
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


        alvision.Rodrigues(vec, m, v2m_jac);
        alvision.Rodrigues(m, vec2, m2v_jac);
        alvision.cvtest.copy(vec, vec2);

        var theta0 = alvision.norm(vec2, alvision.NormTypes.NORM_L2);
        var theta1 = (theta0.valueOf())%( Math.PI * 2);

        if (theta1 > Math.PI)
            theta1 = -(Math.PI * 2 - theta1);
        vec2 = alvision.MatExpr.op_Multiplication(vec2, theta1 / (theta0 ? theta0.valueOf() : 1)).toMat();

        if (this.calc_jacobians) {
            //cvInvert( v2m_jac, m2v_jac, alvision.DecompTypes.DECOMP_SVD );
            var nrm = alvision.cvtest.norm(this.test_mat[this.REF_OUTPUT][3],alvision.NormTypes.NORM_INF );
            if (alvision.FLT_EPSILON < nrm && nrm < 1000) {
                alvision.gemm(this.test_mat[this.OUTPUT][1], this.test_mat[this.OUTPUT][3],
                    1, new alvision.Mat(), 0, this.test_mat[this.OUTPUT][4],
                    v2m_jac.rows == 3 ? 0 : alvision.GemmFlags.GEMM_1_T + alvision.GemmFlags.GEMM_2_T);
            }
            else {
                alvision.setIdentity(this.test_mat[this.OUTPUT][4], alvision. Scalar.all(1.));
                alvision.cvtest.copy(this.test_mat[this.REF_OUTPUT][2], this.test_mat[this.OUTPUT][2]);
            }
            alvision.setIdentity(this.test_mat[this.REF_OUTPUT][4],  alvision.Scalar.all(1.));
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
        //double t[12] = { 0};
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
                    for (i = 0; i < arr.cols.valueOf() * 3; i = i.valueOf() + 3) {
                        p[i.valueOf()] = alvision.cvtest.randReal(rng).valueOf() * this.cube_size.valueOf();
                        p[i.valueOf() + 1] = alvision.cvtest.randReal(rng).valueOf() * this.cube_size.valueOf();
                        p[i.valueOf() + 2] = alvision.cvtest.randReal(rng).valueOf() * this.cube_size.valueOf() + this.cube_size.valueOf();
                    }
                }
                break;
            case 3:
                {
                    //double r[3];
                    var rot_vec = new alvision.Mat(3, 1, alvision.MatrixType.CV_64F);//, r);
                    var r = rot_vec.ptr<alvision.double>("double");
                    var rot_mat = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);//, t, 4 * sizeof(t[0]));
                    var t = rot_mat.ptr<alvision.double>("double");
                    r[0] = alvision.cvtest.randReal(rng).valueOf() * Math.PI * 2;
                    r[1] = alvision.cvtest.randReal(rng).valueOf() * Math.PI * 2;
                    r[2] = alvision.cvtest.randReal(rng).valueOf() * Math.PI * 2;

                    alvision.Rodrigues(rot_vec, rot_mat);
                    t[3] = alvision.cvtest.randReal(rng).valueOf() *  this.cube_size.valueOf();
                    t[7] = alvision.cvtest.randReal(rng).valueOf() *  this.cube_size.valueOf();
                    t[11] = alvision.cvtest.randReal(rng).valueOf() * this.cube_size.valueOf();
                    new alvision.Mat(3, 4, alvision.MatrixType.CV_64F, t).convertTo(arr, arr.type());
                }
                break;
            case 4:
            case 5:
                t[0] = t[4] = alvision.cvtest.randReal(rng).valueOf() * (this.max_f.valueOf() - this.min_f.valueOf()) + this.min_f.valueOf();
                t[2] = (this.img_size.valueOf() * 0.5 + alvision.cvtest.randReal(rng).valueOf() * 4. - 2.) * t[0].valueOf();
                t[5] = (this.img_size.valueOf() * 0.5 + alvision.cvtest.randReal(rng).valueOf() * 4. - 2.) * t[4].valueOf();
                t[8] = 1.;
                new alvision.Mat(3, 3, alvision.MatrixType.CV_64F, t).convertTo(arr, arr.type());
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

        this.dims = alvision.cvtest.randInt(rng).valueOf() % 2 + 2;
        this.method = 1 << (alvision.cvtest.randInt(rng).valueOf() % 4);

        if (this.method ==  alvision.FundMatrixAlgo.FM_7POINT)
            pt_count = 7;
        else {
            pt_count = Math.max(pt_count, 8 + ((this.method == alvision.FundMatrixAlgo.FM_8POINT) ? 1 : 0));
            if (pt_count >= 8 && alvision.cvtest.randInt(rng).valueOf() % 2)
                this.method = this.method.valueOf() | alvision.FundMatrixAlgo.FM_8POINT;
        }

        types[this.INPUT][0] = alvision.MatrixType.CV_MAKETYPE(pt_depth, 1);

        if (alvision.cvtest.randInt(rng).valueOf() % 2)
            sizes[this.INPUT][0] = new alvision.Size(pt_count, this.dims);
        else {
            sizes[this.INPUT][0] = new alvision.Size(this.dims, pt_count);
            if (alvision.cvtest.randInt(rng).valueOf() % 2) {
                types[this.INPUT][0] = alvision.MatrixType.CV_MAKETYPE(pt_depth, this.dims);
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
        //cvFindFundamentalMat



        var fm = alvision.findFundamentalMat(_input0, _input1, mask, <alvision.FundMatrixAlgo> this.method, Math.max(this.sigma.valueOf() * 3, 0.01), 0);
        if (fm.empty()) {
            this.f_result = 0;
        } else {
            var fm1 = fm.rowRange(0, Math.min(fm.rows.valueOf(), F.rows.valueOf()));
            fm.rowRange(0, fm1.rows).convertTo(fm1, fm1.type());
            this.f_result = fm1.rows.valueOf() / 3;
        }



    }
    prepare_to_validation(test_case_idx: alvision.int): void {
        var Rt = this.test_mat[this.INPUT][3];
        var A1 = this.test_mat[this.INPUT][4];
        var A2 = this.test_mat[this.INPUT][5];
        //double f0[9], f[9];
        var F0 = new alvision.Mat(3, 3, alvision.MatrixType.CV_64FC1);//, f0),
        var f0 = F0.ptr<alvision.double>("double");
        var F = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);//, f);
        var f = F.ptr<alvision.double>("double");

        var invA1 = new alvision.Mat();
        var invA2 = new alvision.Mat();
        var R = Rt.colRange(0, 3);
        var T = new alvision.Mat();

        alvision.invert(A1, invA1,alvision.DecompTypes.DECOMP_SVD);
        alvision.invert(A2, invA2, alvision.DecompTypes.DECOMP_SVD);

        var tx = Rt.at<alvision.double>("double", 0, 3).get();
        var ty = Rt.at<alvision.double>("double", 1, 3).get();
        var tz = Rt.at<alvision.double>("double", 2, 3).get();

        var _t_x = [0, -tz, ty, tz, 0, -tx, -ty, tx, 0];
    

        // F = (A2^-T)*[t]_x*R*(A1^-1)
        alvision.gemm(invA2, new alvision.Mat(3, 3, alvision.MatrixType.CV_64F, _t_x), 1, new alvision.Mat(), 0, T, alvision.GemmFlags.GEMM_1_T);
        alvision.gemm(R, invA1, 1, new alvision.Mat(), 0, invA2);
        alvision.gemm(T, invA2, 1, new alvision.Mat(), 0, F0);
        F0 = alvision.MatExpr.op_Multiplication(F0, 1. / f0[8].valueOf()).toMat();

        var status = this.test_mat[this.TEMP][1].ptr<alvision.uchar>("uchar");
        var err_level = this.get_success_error_level(test_case_idx, this.OUTPUT, 1);
        var mtfm1 = this.test_mat[this.REF_OUTPUT][1].ptr<alvision.uchar>("uchar");
        var mtfm2 = this.test_mat[this.OUTPUT][1].ptr<alvision.uchar>("uchar");
        var f_prop1 = this.test_mat[this.REF_OUTPUT][0].ptr<alvision.double>("double");
        var f_prop2 = this.test_mat[this.OUTPUT][0].ptr<alvision.double>("double");

            var pt_count = this.test_mat[this.INPUT][2].cols;
        var p1 = new alvision.Mat(1, pt_count, alvision.MatrixType.CV_64FC2);
        var p2 = new alvision.Mat(1, pt_count, alvision.MatrixType.CV_64FC2);

        test_convertHomogeneous(this.test_mat[this.INPUT][0], p1);
        test_convertHomogeneous(this.test_mat[this.INPUT][1], p2);

        alvision.cvtest.convert(this.test_mat[this.TEMP][0], F, F.type());

        if (this.method <= alvision.FundMatrixAlgo.FM_8POINT)
            status.forEach((v, i, a) => a[i] = 0);

        for (var i = 0; i < pt_count; i++) {
            var x1 = p1.at<alvision.Point2d>("Point2d", i).get().x.valueOf();
            var y1 = p1.at<alvision.Point2d>("Point2d", i).get().y.valueOf();
            var x2 = p2.at<alvision.Point2d>("Point2d", i).get().x.valueOf();
            var y2 = p2.at<alvision.Point2d>("Point2d", i).get().y.valueOf();
            var n1 = 1. / Math.sqrt(x1 * x1 + y1 * y1 + 1);
            var n2 = 1. / Math.sqrt(x2 * x2 + y2 * y2 + 1);
            var t0 = Math.abs(f0[0].valueOf() * x2 * x1 + f0[1].valueOf() * x2 * y1 + f0[2].valueOf() * x2 +
                f0[3].valueOf() * y2 * x1 + f0[4].valueOf() * y2 * y1 + f0[5].valueOf() * y2 +
                f0[6].valueOf() * x1 + f0[7].valueOf() * y1 + f0[8].valueOf()) * n1 * n2;
            var t = Math.abs(f[0].valueOf() * x2 * x1 + f[1].valueOf() * x2 * y1 + f[2].valueOf() * x2 +
                f[3].valueOf() * y2 * x1 + f[4].valueOf() * y2 * y1 + f[5].valueOf() * y2 +
                f[6].valueOf() * x1 + f[7].valueOf() * y1 + f[8].valueOf()) * n1 * n2;
            mtfm1[i] = 1;
            mtfm2[i] = !status[i] || t0 > err_level || t < err_level;
        }

        f_prop1[0] = 1;
        f_prop1[1] = 1;
        f_prop1[2] = 0;

        f_prop2[0] = (this.f_result != 0) ? 1 : 0;
        f_prop2[1] = f[8];
        f_prop2[2] = alvision.determinant(F);
    }

    protected  method: alvision.int;
    protected  img_size: alvision.int;
    protected  cube_size: alvision.int;
    protected  dims: alvision.int;
    protected  f_result: alvision.int;
    protected  min_f: alvision.double;
        protected max_f: alvision.double;
    protected sigma: alvision.double ;
    protected test_cpp: boolean;
};


/******************************* find essential matrix ***********************************/
class CV_EssentialMatTest extends alvision.cvtest.ArrayTest {
    constructor() {
        super();
        // input arrays:
        //   0, 1 - arrays of 2d points that are passed to %func%.
        //          Can have different data type, layout, be stored in homogeneous coordinates or not.
        //   2 - array of 3d points that are projected to both view planes
        //   3 - [R|t] matrix for the second view plane (for the first one it is [I|0]
        //   4 - intrinsic matrix for both camera
        this.test_array[this.INPUT].push(null);
        this.test_array[this.INPUT].push(null);
        this.test_array[this.INPUT].push(null);
        this.test_array[this.INPUT].push(null);
        this.test_array[this.INPUT].push(null);
        this.test_array[this.TEMP].push(null);
        this.test_array[this.TEMP].push(null);
        this.test_array[this.TEMP].push(null);
        this.test_array[this.TEMP].push(null);
        this.test_array[this.TEMP].push(null);
        this.test_array[this.OUTPUT].push(null); // Essential Matrix singularity
        this.test_array[this.OUTPUT].push(null); // Inliers mask
        this.test_array[this.OUTPUT].push(null); // Translation error
        this.test_array[this.OUTPUT].push(null); // Positive depth count
        this.test_array[this.REF_OUTPUT].push(null);
        this.test_array[this.REF_OUTPUT].push(null);
        this.test_array[this.REF_OUTPUT].push(null);
        this.test_array[this.REF_OUTPUT].push(null);

        this.element_wise_relative_error = false;

        this.method = 0;
        this.img_size = 10;
        this.cube_size = 10;
        this.dims = 0;
        this.min_f = 1;
        this.max_f = 3;
        this.sigma = 0;
    }

    read_params(fs: alvision.FileStorage): alvision.int {
        var code = super.read_params(fs);
        return code;
    }
    fill_array(test_case_idx: alvision.int, i: alvision.int, j: alvision.int, arr: alvision.Mat): void {
        //double t[12] = { 0};
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
                    for (i = 0; i < arr.cols.valueOf() * 3; i = i.valueOf() + 3) {
                        p[i.valueOf()] = alvision.cvtest.randReal(rng).valueOf() *     this.cube_size.valueOf();
                        p[i.valueOf() + 1] = alvision.cvtest.randReal(rng).valueOf() * this.cube_size.valueOf();
                        p[i.valueOf() + 2] = alvision.cvtest.randReal(rng).valueOf() * this.cube_size.valueOf() + this.cube_size.valueOf();
                    }
                }
                break;
            case 3:
                {
                    //double r[3];
                    var rot_vec = new alvision.Mat(3, 1, alvision.MatrixType.CV_64F);//, r);
                    var r = rot_vec.ptr<alvision.double>("double");
                    var rot_mat = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);//, t, 4 * sizeof(t[0]));
                    var t = rot_mat.ptr<alvision.double>("double");
                    r[0] = alvision.cvtest.randReal(rng).valueOf() * Math.PI * 2;
                    r[1] = alvision.cvtest.randReal(rng).valueOf() * Math.PI * 2;
                    r[2] = alvision.cvtest.randReal(rng).valueOf() * Math.PI * 2;

                    alvision.Rodrigues(rot_vec, rot_mat);
                    t[3] = alvision.cvtest.randReal(rng).valueOf() *  this.cube_size.valueOf();
                    t[7] = alvision.cvtest.randReal(rng).valueOf() *  this.cube_size.valueOf();
                    t[11] = alvision.cvtest.randReal(rng).valueOf() * this.cube_size.valueOf();
                    new alvision.Mat(3, 4, alvision.MatrixType.CV_64F, t).convertTo(arr, arr.type());
                }
                break;
            case 4:
                t[0] = t[4] = alvision.cvtest.randReal(rng).valueOf() * (this.max_f.valueOf() - this.min_f.valueOf()) + this.min_f.valueOf();
                t[2] = (this.img_size.valueOf() * 0.5 + alvision.cvtest.randReal(rng).valueOf() * 4. - 2.) * t[0].valueOf();
                t[5] = (this.img_size.valueOf() * 0.5 + alvision.cvtest.randReal(rng).valueOf() * 4. - 2.) * t[4].valueOf();
                t[8] = 1.;
                new alvision.Mat(3, 3, alvision.MatrixType.CV_64F, t).convertTo(arr, arr.type());
                break;
        }
    }
    prepare_test_case(test_case_idx: alvision.int): alvision.int {
        var code = super.prepare_test_case(test_case_idx);
        if (code > 0) {
            const _3d = this.test_mat[this.INPUT][2];
            var rng = this.ts.get_rng();
            var Idata = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0];
            var I = new alvision.Mat(3, 4, alvision.MatrixType.CV_64F, Idata);

            for (var k = 0; k < 2; k++) {
                const Rt = k == 0 ? I : this.test_mat[this.INPUT][3];
                const A = this.test_mat[this.INPUT][4];
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
        var pt_count = Math.max(5, Math.round(Math.exp(pt_count_exp)));

        this.dims = alvision.cvtest.randInt(rng).valueOf() % 2 + 2;
        this.dims = 2;
        this.method = alvision.RobustEstimationAlgo.LMEDS << (alvision.cvtest.randInt(rng).valueOf() % 2);

        types[this.INPUT][0] = alvision.MatrixType.CV_MAKETYPE(pt_depth, 1);

        if (0 && alvision.cvtest.randInt(rng).valueOf() % 2)
            sizes[this.INPUT][0] = new alvision.Size(pt_count, this.dims);
        else {
            sizes[this.INPUT][0] = new alvision.Size(this.dims, pt_count);
            if (alvision.cvtest.randInt(rng).valueOf() % 2) {
                types[this.INPUT][0] = alvision.MatrixType.CV_MAKETYPE(pt_depth, this.dims);
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

        sizes[this.INPUT][4] = new alvision.Size(3, 3);
        types[this.INPUT][4] = alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_64F, 1);

        sizes[this.TEMP][0] = new alvision.Size(3, 3);
        types[this.TEMP][0] = alvision.MatrixType.CV_64FC1;
        sizes[this.TEMP][1] = new alvision.Size(pt_count, 1);
        types[this.TEMP][1] = alvision.MatrixType.CV_8UC1;
        sizes[this.TEMP][2] = new alvision.Size(3, 3);
        types[this.TEMP][2] = alvision.MatrixType.CV_64FC1;
        sizes[this.TEMP][3] = new alvision.Size(3, 1);
        types[this.TEMP][3] = alvision.MatrixType.CV_64FC1;
        sizes[this.TEMP][4] = new alvision.Size(pt_count, 1);
        types[this.TEMP][4] = alvision.MatrixType.CV_8UC1;

        sizes[this.OUTPUT][0] = sizes[this.REF_OUTPUT][0] = new alvision.Size(3, 1);
        types[this.OUTPUT][0] = types[this.REF_OUTPUT][0] = alvision.MatrixType.CV_64FC1;
        sizes[this.OUTPUT][1] = sizes[this.REF_OUTPUT][1] = new alvision.Size(pt_count, 1);
        types[this.OUTPUT][1] = types[this.REF_OUTPUT][1] = alvision.MatrixType.CV_8UC1;
        sizes[this.OUTPUT][2] = sizes[this.REF_OUTPUT][2] = new alvision.Size(1, 1);
        types[this.OUTPUT][2] = types[this.REF_OUTPUT][2] = alvision.MatrixType.CV_64FC1;
        sizes[this.OUTPUT][3] = sizes[this.REF_OUTPUT][3] = new alvision.Size(1, 1);
        types[this.OUTPUT][3] = types[this.REF_OUTPUT][3] = alvision.MatrixType.CV_8UC1;
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        return 1e-2;
    }
    run_func(): void {
        var _input0 = new alvision.Mat(this.test_mat[this.INPUT][0]), _input1 = new alvision.Mat(this.test_mat[this.INPUT][1]);
        var K = new alvision.Mat(this.test_mat[this.INPUT][4]);
        var focal = (K.at<alvision.double>("double", 0, 0).get());
        var pp = new alvision.Point2d(K.at<alvision.double>("double", 0, 2).get(), K.at<alvision.double>("double", 1, 2).get());

        var rng = this.ts.get_rng();
        var E = new alvision.Mat(), mask1 = new alvision.Mat(this.test_mat[this.TEMP][1]);
        E = alvision.findEssentialMat(_input0, _input1, focal, pp, this.method, 0.99, Math.max(this.sigma.valueOf() * 3, 0.0001), mask1);
        if (E.rows > 3) {
            var count = E.rows.valueOf() / 3;
            var row = (alvision.cvtest.randInt(rng).valueOf() % count) * 3;
            E = alvision.MatExpr.op_Multiplication( E.rowRange(row, row + 3) , 1.0).toMat();
        }

        E.copyTo(this.test_mat[this.TEMP][0]);

        var R = new alvision.Mat(), t = new alvision.Mat(), mask2 = new alvision.Mat();
        alvision.recoverPose(E, _input0, _input1, R, t, focal, pp, mask2);
        R.copyTo(this.test_mat[this.TEMP][2]);
        t.copyTo(this.test_mat[this.TEMP][3]);
        mask2.copyTo(this.test_mat[this.TEMP][4]);
    }
    prepare_to_validation(test_case_idx: alvision.int): void {
        const Rt0 = this.test_mat[this.INPUT][3];
        const A = this.test_mat[this.INPUT][4];
        //double f0[9], f[9], e[9];
        var F0 = new alvision.Mat(3, 3, alvision.MatrixType.CV_64FC1);//, f0),
        var f0 = F0.ptr<alvision.double>("double");
        var F = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);//, f);
        var f = F.ptr<alvision.double>("double");
        var E = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);//, e);
        var e = E.ptr<alvision.double>("double");

        var invA = new alvision.Mat, R = Rt0.colRange(0, 3), T1 = new alvision.Mat(), T2 = new alvision.Mat();

        alvision.invert(A, invA, alvision.DecompTypes.DECOMP_SVD);

        var tx = Rt0.at<alvision.double>("double", 0, 3);
        var ty = Rt0.at<alvision.double>("double", 1, 3);
        var tz = Rt0.at<alvision.double>("double", 2, 3);

        var _t_x = [0, -tz, ty, tz, 0, -tx, -ty, tx, 0];
    

        // F = (A2^-T)*[t]_x*R*(A1^-1)
        alvision.gemm(invA, new alvision.Mat(3, 3, alvision.MatrixType.CV_64F, _t_x), 1, new alvision.Mat(), 0, T1, alvision.GemmFlags.GEMM_1_T);
        alvision.gemm(R, invA, 1, new alvision.Mat(), 0, T2);
        alvision.gemm(T1, T2, 1, new alvision.Mat(), 0, F0);
        F0 = alvision.MatExpr.op_Multiplication(F0, 1. / f0[8].valueOf()).toMat();

        var status = this.test_mat[this.TEMP][1].ptr<alvision.uchar>("uchar");
        var err_level = this.get_success_error_level(test_case_idx, this.OUTPUT, 1);
        var mtfm1 = this.test_mat[this.REF_OUTPUT][1].ptr<alvision.uchar>("uchar");
        var mtfm2 = this.test_mat[this.OUTPUT][1].ptr<alvision.uchar>("uchar");
        var e_prop1 = this.test_mat[this.REF_OUTPUT][0].ptr<alvision.double>("double");
        var e_prop2 = this.test_mat[this.OUTPUT][0].ptr<alvision.double>("double");
        var E_prop2 = new alvision.Mat(3, 1, alvision.MatrixType.CV_64F, e_prop2);

        var pt_count = this.test_mat[this.INPUT][2].cols;
        var p1 = new alvision.Mat(1, pt_count, alvision.MatrixType.CV_64FC2);
        var p2 = new alvision.Mat(1, pt_count, alvision.MatrixType.CV_64FC2);

        test_convertHomogeneous(this.test_mat[this.INPUT][0], p1);
        test_convertHomogeneous(this.test_mat[this.INPUT][1], p2);

        alvision.cvtest.convert(this.test_mat[this.TEMP][0], E, E.type());
        alvision.gemm(invA, E, 1,  new alvision.Mat(), 0, T1, alvision.GemmFlags.GEMM_1_T);
        alvision.gemm(T1, invA, 1, new alvision.Mat(), 0, F);

        for (var i = 0; i < pt_count; i++) {
            var x1 = p1.at<alvision.Point2d>("Point2d", i).get().x.valueOf();
            var y1 = p1.at<alvision.Point2d>("Point2d", i).get().y.valueOf();
            var x2 = p2.at<alvision.Point2d>("Point2d", i).get().x.valueOf();
            var y2 = p2.at<alvision.Point2d>("Point2d", i).get().y.valueOf();
            //        double t0 = sampson_error(f0, x1, y1, x2, y2);
            //        double t = sampson_error(f, x1, y1, x2, y2);
            var n1 = 1. / Math.sqrt(x1.valueOf() * x1.valueOf() + y1.valueOf() * y1.valueOf() + 1);
            var n2 = 1. / Math.sqrt(x2.valueOf() * x2.valueOf() + y2.valueOf() * y2.valueOf() + 1);
            var t0 = Math.abs(f0[0].valueOf() * x2 * x1 + f0[1].valueOf() * x2 * y1 + f0[2].valueOf() * x2 +
                f0[3].valueOf() * y2 * x1 + f0[4].valueOf() * y2 * y1 + f0[5].valueOf() * y2 +
                f0[6].valueOf() * x1 + f0[7].valueOf() * y1 + f0[8].valueOf()) * n1 * n2;
            var t = Math.abs(f[0].valueOf() * x2 * x1 + f[1].valueOf() * x2 * y1 + f[2].valueOf() * x2 +
                f[3].valueOf() * y2 * x1 + f[4].valueOf() * y2 * y1 + f[5].valueOf() * y2 +
                f[6].valueOf() * x1 + f[7].valueOf() * y1 + f[8].valueOf()) * n1 * n2;
            mtfm1[i] = 1;
            mtfm2[i] = !status[i] || t0 > err_level || t < err_level;
        }

        e_prop1[0] = Math.sqrt(0.5);
        e_prop1[1] = Math.sqrt(0.5);
        e_prop1[2] = 0;

        e_prop2[0] = 0;
        e_prop2[1] = 0;
        e_prop2[2] = 0;
        alvision.SVD.compute(E, E_prop2);



        var pose_prop1 = this.test_mat[this.REF_OUTPUT][2].ptr<alvision.double>("double");
        var pose_prop2 = this.test_mat[this.OUTPUT][2].ptr<alvision.double>("double");
        var terr1 = alvision.norm(alvision.MatExpr.op_Division(Rt0.col(3) , alvision.norm(Rt0.col(3))).op_Addition( this.test_mat[this.TEMP][3]).toMat(), alvision.NormTypes.NORM_L2);
        var terr2 = alvision.norm(alvision.MatExpr.op_Division(Rt0.col(3) , alvision.norm(Rt0.col(3))).op_Substraction( this.test_mat[this.TEMP][3]).toMat(), alvision.NormTypes.NORM_L2);
        var rvec = new alvision.Mat();
        alvision.Rodrigues(Rt0.colRange(0, 3), rvec);
        pose_prop1[0] = 0;
        // No check for CV_LMeDS on translation. Since it
        // involves with some degraded problem, when data is exact inliers.
        pose_prop2[0] = this.method == alvision.RobustEstimationAlgo.LMEDS || pt_count == 5 ? 0 : Math.min(terr1.valueOf(), terr2.valueOf());


        //    int inliers_count = countNonZero(test_mat[TEMP][1]);
        //    int good_count = countNonZero(test_mat[TEMP][4]);
        this.test_mat[this.OUTPUT][3].setTo( 1); //good_count >= inliers_count / 2;
        this.test_mat[this.REF_OUTPUT][3].setTo( 0);
    }


    sampson_error(f: Array<alvision.double>, x1: alvision.double, y1: alvision.double, x2: alvision.double, y2: alvision.double): alvision.double {
        var Fx1 = [
            f[0].valueOf() * x1.valueOf() + f[1].valueOf() * y1.valueOf() + f[2].valueOf(),
            f[3].valueOf() * x1.valueOf() + f[4].valueOf() * y1.valueOf() + f[5].valueOf(),
            f[6].valueOf() * x1.valueOf() + f[7].valueOf() * y1.valueOf() + f[8].valueOf()
        ]
        var Ftx2 = [
            f[0].valueOf() * x2.valueOf() + f[3].valueOf() * y2.valueOf() + f[6].valueOf(),
            f[1].valueOf() * x2.valueOf() + f[4].valueOf() * y2.valueOf() + f[7].valueOf(),
            f[2].valueOf() * x2.valueOf() + f[5].valueOf() * y2.valueOf() + f[8].valueOf()
        ]
        var x2tFx1 = Fx1[0] * x2.valueOf() + Fx1[1] * y2.valueOf() + Fx1[2];

        var error = x2tFx1 * x2tFx1 / (Fx1[0] * Fx1[0] + Fx1[1] * Fx1[1] + Ftx2[0] * Ftx2[0] + Ftx2[1] * Ftx2[1]);
        error = Math.sqrt(error);
        return error;
    }


    protected method: alvision.int;
    protected img_size: alvision.int;
    protected cube_size: alvision.int;
    protected dims: alvision.int;
    protected min_f: alvision.double;
    protected max_f: alvision.double;
    protected sigma: alvision.double;
}



/********************************** convert homogeneous *********************************/

class CV_ConvertHomogeneousTest extends alvision.cvtest.ArrayTest
{
    constructor() {
        super();
        this.test_array[this.INPUT].push(null);
        this.test_array[this.OUTPUT].push(null);
        this.test_array[this.REF_OUTPUT].push(null);
        this.element_wise_relative_error = false;

        this.pt_count = this.dims1 = this.dims2 = 0;

    }

    read_params(fs: alvision.FileStorage): alvision.int{
        var code = super.read_params(fs);
        return code;
    }
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        var rng = this.ts.get_rng();
        var pt_depth1 = alvision.cvtest.randInt(rng).valueOf() % 2 == 0 ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_64F;
        var pt_depth2 = alvision.cvtest.randInt(rng).valueOf() % 2 == 0 ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_64F;
        var pt_count_exp = alvision.cvtest.randReal(rng).valueOf() * 6 + 1;
        //int t;

        this.pt_count = Math.round(Math.exp(pt_count_exp));
        this.pt_count = Math.max(this.pt_count.valueOf(), 5);

        this.dims1 = 2 + (alvision.cvtest.randInt(rng).valueOf() % 3);
        this.dims2 = 2 + (alvision.cvtest.randInt(rng).valueOf() % 3);

        if (this.dims1 == this.dims2.valueOf() + 2)
            this.dims1 = this.dims1.valueOf() - 1;
        else if (this.dims1 == this.dims2.valueOf() - 2)
                this.dims1 = this.dims1.valueOf() + 1;

        if (alvision.cvtest.randInt(rng).valueOf() % 2) {
            var t = this.dims1;
            this.dims1 = this.dims2;
            this.dims2 = t;
            //CV_SWAP(dims1, dims2, t);
        }

        types[this.INPUT][0] = alvision.MatrixType.CV_MAKETYPE(pt_depth1, 1);

        if (alvision.cvtest.randInt(rng).valueOf() % 2)
            sizes[this.INPUT][0] = new alvision.Size(this.pt_count, this.dims1);
        else {
            sizes[this.INPUT][0] = new alvision.Size(this.dims1, this.pt_count);
            if (alvision.cvtest.randInt(rng).valueOf() % 2) {
                types[this.INPUT][0] = alvision.MatrixType.CV_MAKETYPE(pt_depth1, this.dims1);
                if (alvision.cvtest.randInt(rng).valueOf() % 2)
                    sizes[this.INPUT][0] = new alvision.Size(this.pt_count, 1);
                else
                    sizes[this.INPUT][0] = new alvision.Size(1, this.pt_count);
            }
        }

        types[this.OUTPUT][0] = alvision.MatrixType.CV_MAKETYPE(pt_depth2, 1);

        if (alvision.cvtest.randInt(rng).valueOf() % 2)
            sizes[this.OUTPUT][0] = new alvision.Size(this.pt_count, this.dims2);
        else {
            sizes[this.OUTPUT][0] = new alvision.Size(this.dims2, this.pt_count);
            if (alvision.cvtest.randInt(rng).valueOf() % 2) {
                types[this.OUTPUT][0] = alvision.MatrixType.CV_MAKETYPE(pt_depth2, this.dims2);
                if (alvision.cvtest.randInt(rng).valueOf() % 2)
                    sizes[this.OUTPUT][0] = new alvision.Size(this.pt_count, 1);
                else
                    sizes[this.OUTPUT][0] = new alvision.Size(1, this.pt_count);
            }
        }

        types[this.REF_OUTPUT][0] = types[this.OUTPUT][0];
        sizes[this.REF_OUTPUT][0] = sizes[this.OUTPUT][0];
    }
    fill_array(test_case_idx: alvision.int, i: alvision.int, j: alvision.int, arr: alvision.Mat): void {
        var temp = new alvision.Mat(1, this.pt_count, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_64FC1, this.dims1));
        var rng = this.ts.get_rng();
        var low = alvision.Scalar.all(0), high = alvision.Scalar.all(10);

        if (this.dims1 > this.dims2)
            low.val[this.dims1.valueOf() - 1] = 1.;

        alvision.cvtest.randUni(rng, temp, low, high);
        test_convertHomogeneous(temp, arr);
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        return 1e-5;
    }
    run_func(): void {
        var _input = this.test_mat[this.INPUT][0], _output = this.test_mat[this.OUTPUT][0];
        alvision.convertPointsToHomogeneous(_input, _output);
    }
    prepare_to_validation(test_case_idx: alvision.int): void {
        test_convertHomogeneous(this.test_mat[this.INPUT][0], this.test_mat[this.REF_OUTPUT][0]);
    }

    protected dims1: alvision.int;
    protected dims2: alvision.int;
    protected pt_count: alvision.int;
};

/************************** compute corresponding epipolar lines ************************/

class CV_ComputeEpilinesTest extends alvision.cvtest.ArrayTest
{
    constructor() {
        super()
        this.test_array[this.INPUT].push(null);
        this.test_array[this.INPUT].push(null);
        this.test_array[this.OUTPUT].push(null);
        this.test_array[this.REF_OUTPUT].push(null);
        this.element_wise_relative_error = false;

        this.pt_count = this.dims = this.which_image = 0;
    }

    read_params(fs: alvision.FileStorage): alvision.int {
        var code = super.read_params(fs);
        return code;
    }
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        var rng = this.ts.get_rng();
        var fm_depth = alvision.cvtest.randInt(rng).valueOf() % 2 == 0 ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_64F;
        var pt_depth = alvision.cvtest.randInt(rng).valueOf() % 2 == 0 ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_64F;
        var ln_depth = alvision.cvtest.randInt(rng).valueOf() % 2 == 0 ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_64F;
        var pt_count_exp = alvision.cvtest.randReal(rng).valueOf() * 6;

        this.which_image = 1 + (alvision.cvtest.randInt(rng).valueOf() % 2);

        this.pt_count = Math.round(Math.exp(pt_count_exp));
        this.pt_count = Math.max(this.pt_count.valueOf(), 1);
        var few_points = this.pt_count < 5;

        this.dims = 2 + (alvision.cvtest.randInt(rng).valueOf() % 2);

        types[this.INPUT][0] = alvision.MatrixType.CV_MAKETYPE(pt_depth, 1);

        if (alvision.cvtest.randInt(rng).valueOf() % 2 && !few_points)
            sizes[this.INPUT][0] = new alvision.Size(this.pt_count, this.dims);
        else {
            sizes[this.INPUT][0] = new alvision.Size(this.dims, this.pt_count);
            if (alvision.cvtest.randInt(rng).valueOf() % 2 || few_points) {
                types[this.INPUT][0] = alvision.MatrixType.CV_MAKETYPE(pt_depth, this.dims);
                if (alvision.cvtest.randInt(rng).valueOf() % 2)
                    sizes[this.INPUT][0] = new alvision.Size(this.pt_count, 1);
                else
                    sizes[this.INPUT][0] = new alvision.Size(1, this.pt_count);
            }
        }

        types[this.INPUT][1] = alvision.MatrixType.CV_MAKETYPE(fm_depth, 1);
        sizes[this.INPUT][1] = new alvision.Size(3, 3);

        types[this.OUTPUT][0] = alvision.MatrixType.CV_MAKETYPE(ln_depth, 1);

        if (alvision.cvtest.randInt(rng).valueOf() % 2 && !few_points)
            sizes[this.OUTPUT][0] = new alvision.Size(this.pt_count, 3);
        else {
            sizes[this.OUTPUT][0] = new alvision.Size(3, this.pt_count);
            if (alvision.cvtest.randInt(rng).valueOf() % 2 || few_points) {
                types[this.OUTPUT][0] = alvision.MatrixType.CV_MAKETYPE(ln_depth, 3);
                if (alvision.cvtest.randInt(rng).valueOf() % 2)
                    sizes[this.OUTPUT][0] = new alvision.Size(this.pt_count, 1);
                else
                    sizes[this.OUTPUT][0] = new alvision.Size(1, this.pt_count);
            }
        }

        types[this.REF_OUTPUT][0] = types[this.OUTPUT][0];
        sizes[this.REF_OUTPUT][0] = sizes[this.OUTPUT][0];
    }
    fill_array(test_case_idx: alvision.int, i: alvision.int, j: alvision.int, arr: alvision.Mat): void {
        var rng = this.ts.get_rng();

        if (i == this.INPUT && j == 0) {
            var temp = new alvision.Mat(1, this.pt_count, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_64FC1, this.dims));
            alvision.cvtest.randUni(rng, temp, new alvision.Scalar(0, 0, 1), alvision.Scalar.all(10));
            test_convertHomogeneous(temp, arr);
        }
        else if (i == this.INPUT && j == 1)
            alvision.cvtest.randUni(rng, arr, alvision.Scalar.all(0), alvision.Scalar.all(10));
        else
            super.fill_array(test_case_idx, i, j, arr);
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        return 1e-5;
    }
    run_func(): void {
        var _points = this.test_mat[this.INPUT][0], _F = this.test_mat[this.INPUT][1], _lines = this.test_mat[this.OUTPUT][0];
        alvision.computeCorrespondEpilines( _points, this.which_image, _F, _lines);
    }
    prepare_to_validation(test_case_idx: alvision.int): void {
        var pt = new alvision.Mat(1,    this.pt_count, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_64F, 3));
        var lines = new alvision.Mat(1, this.pt_count, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_64F, 3));
        //double f[9];
        var F = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);//, f);
        var f = F.ptr<alvision.double>("double");

        test_convertHomogeneous(this.test_mat[this.INPUT][0], pt);
        this.test_mat[this.INPUT][1].convertTo(F, alvision.MatrixType.CV_64F);
        if (this.which_image == 2)
            alvision.transpose(F, F);

        for (var i = 0; i < this.pt_count; i++ )
        {
            var p = pt.ptr<alvision.double>("double").slice(i * 3);
            var l = lines.ptr<alvision.double>("double").slice(i * 3);
            var t0 = f[0].valueOf() * p[0].valueOf() + f[1].valueOf() * p[1].valueOf() + f[2].valueOf() * p[2].valueOf();
            var t1 = f[3].valueOf() * p[0].valueOf() + f[4].valueOf() * p[1].valueOf() + f[5].valueOf() * p[2].valueOf();
            var t2 = f[6].valueOf() * p[0].valueOf() + f[7].valueOf() * p[1].valueOf() + f[8].valueOf() * p[2].valueOf();
            var d = Math.sqrt(t0 * t0 + t1 * t1);
            d = d ? 1. / d : 1.;
            l[0] = t0 * d; l[1] = t1 * d; l[2] = t2 * d;
        }

        test_convertHomogeneous(lines, this.test_mat[this.REF_OUTPUT][0]);
    }

    protected which_image: alvision.int;
    protected dims: alvision.int;   
    protected pt_count: alvision.int;
};




alvision.cvtest.TEST('Calib3d_Rodrigues', 'accuracy', () => { var test = new CV_RodriguesTest(); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_FindFundamentalMat', 'accuracy', () => { var test = new CV_FundamentalMatTest(); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_ConvertHomogeneoous', 'accuracy', () => { var test = new CV_ConvertHomogeneousTest(); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_ComputeEpilines', 'accuracy', () => { var test = new CV_ComputeEpilinesTest(); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_FindEssentialMat', 'accuracy', () => { var test = new CV_EssentialMatTest(); test.safe_run(); });

/* End of file. */
