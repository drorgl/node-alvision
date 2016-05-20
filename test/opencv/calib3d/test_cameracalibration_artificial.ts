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

import tape = require("tape");
import path = require("path");
import colors = require("colors");
import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');

import * as cbgenerator from './test_chessboardgenerator';


//#include "test_precomp.hpp"
//
//#include <string>
//#include <limits>
//#include <vector>
//#include <iostream>
//#include <sstream>
//#include <iomanip>
//
//#include "test_chessboardgenerator.hpp"
//
//using namespace cv;
//using namespace std;

//template<class T> ostream& operator<<(ostream& out, const Mat_<T>& mat)
//{
//    for(Mat_<T>::const_iterator pos = mat.begin(), end = mat.end(); pos != end; ++pos)
//        out << *pos << " ";
//    return out;
//}
//ostream& operator<<(ostream& out, const Mat& mat) { return out << Mat_<double>(mat); }

function calcRvec(points: Array<alvision.Point3f>, cornerSize: alvision.Size ) : alvision.Mat
{
    var p00 = points[0];
    var p10 = points[1];
    var p01 = points[cornerSize.width.valueOf()];

    var ex = new alvision.Vecd(p10.x.valueOf() - p00.x.valueOf(), p10.y.valueOf() - p00.y.valueOf(), p10.z.valueOf() - p00.z.valueOf());
    var ey = new alvision.Vecd(p01.x.valueOf() - p00.x.valueOf(), p01.y.valueOf() - p00.y.valueOf(), p01.z.valueOf() - p00.z.valueOf());
    var ez = ex.cross(ey);

    var rot = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);
    rot.ptr<alvision.Vecd>("Vecd")[0] = ex;
    rot.ptr<alvision.Vecd>("Vecd")[1] = ey;
    rot.ptr<alvision.Vecd>("Vecd")[2] = alvision.Vecd.op_Multiplication(ez, (1.0 / alvision.Vecd.norm(ez).valueOf()));

    var res = new alvision.Mat();
    alvision.Rodrigues(rot.t(), res);
    return res.reshape(1, 1);
}

     const  JUST_FIND_CORNERS = 0;
     const  USE_CORNERS_SUBPIX = 1;
     const  USE_4QUAD_CORNERS = 2;
     const  ARTIFICIAL_CORNERS = 4;


class CV_CalibrateCameraArtificialTest extends alvision.cvtest.BaseTest
{
    constructor() {
        super();
        this.r = 0;(0)
    }
    protected r: alvision.int;



     checkErr(a: alvision.double, a0: alvision.double, eps: alvision.double, delta: alvision.double): boolean {
         return Math.abs(a.valueOf() - a0.valueOf()) > eps.valueOf() * (Math.abs(a0.valueOf()) + delta.valueOf());
     }

    compareCameraMatrs(camMat : alvision.Mat_ < alvision.double >, camMat_est : alvision.Mat) : void
    {
        if ( camMat_est.at<alvision.double>("double",0, 1).get() != 0 ||  camMat_est.at<alvision.double>("double",1, 0).get() != 0 ||
            camMat_est.at<alvision.double>("double",2, 0).get() != 0 ||   camMat_est.at<alvision.double>("double",2, 1).get() != 0 ||
            camMat_est.at<alvision.double>("double",2, 2).get() != 1)
        {
            this.ts.printf( alvision.cvtest.TSConstants.LOG, "Bad shape of camera matrix returned \n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
        }

        var fx_e = camMat_est.at<alvision.double>("double",0, 0), fy_e = camMat_est.at<alvision.double>("double",1, 1);
        var cx_e = camMat_est.at<alvision.double>("double",0, 2), cy_e = camMat_est.at<alvision.double>("double",1, 2);

        var fx = camMat.Element(0, 0), fy = camMat.Element(1, 1), cx = camMat.Element(0, 2), cy = camMat.Element(1, 2);

        const  eps = 1e-2;
        const  dlt = 1e-5;

        var fail = this.checkErr(fx_e.get(), fx, eps, dlt) || this.checkErr(fy_e.get(), fy, eps, dlt) ||
            this.checkErr(cx_e.get(), cx, eps, dlt) || this.checkErr(cy_e.get(), cy, eps, dlt);

        if (fail)
        {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
        }
        this.ts.printf( alvision.cvtest.TSConstants.LOG, "%d) Expected  [Fx Fy Cx Cy] = [%.3f %.3f %.3f %.3f]\n", this.r, fx, fy, cx, cy);
        this.ts.printf( alvision.cvtest.TSConstants.LOG, "%d) Estimated [Fx Fy Cx Cy] = [%.3f %.3f %.3f %.3f]\n", this.r, fx_e, fy_e, cx_e, cy_e);
    }

    compareDistCoeffs(distCoeffs: alvision.Mat_<alvision.double>, distCoeffs_est: alvision.Mat) : void
    {
        var dt_e = distCoeffs_est.ptr<alvision.double>("double");

        var k1_e = dt_e[0], k2_e = dt_e[1], k3_e = dt_e[4];
        var p1_e = dt_e[2], p2_e = dt_e[3];

        var k1 = distCoeffs.Element(0, 0), k2 = distCoeffs.Element(0, 1), k3 = distCoeffs.Element(0, 4);
        var p1 = distCoeffs.Element(0, 2), p2 = distCoeffs.Element(0, 3);

        const  eps = 5e-2;
        const  dlt = 1e-3;

        const  eps_k3 = 5;
        const  dlt_k3 = 1e-3;

        var fail = this.checkErr(k1_e, k1, eps, dlt) || this.checkErr(k2_e, k2, eps, dlt) || this.checkErr(k3_e, k3, eps_k3, dlt_k3) ||
            this.checkErr(p1_e, p1, eps, dlt) || this.checkErr(p2_e, p2, eps, dlt);

        if (fail)
        {
            // commented according to vp123's recomendation. TODO - improve accuaracy
            //this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY); ss
        }
        this.ts.printf( alvision.cvtest.TSConstants.LOG, "%d) DistCoeff exp=(%.2f, %.2f, %.4f, %.4f %.2f)\n",this. r, k1, k2, p1, p2, k3);
        this.ts.printf( alvision.cvtest.TSConstants.LOG, "%d) DistCoeff est=(%.2f, %.2f, %.4f, %.4f %.2f)\n",this. r, k1_e, k2_e, p1_e, p2_e, k3_e);
        this.ts.printf(alvision.cvtest.TSConstants.LOG, "%d) AbsError = [%.5f %.5f %.5f %.5f %.5f]\n", this.r,
            Math.abs(k1.valueOf() - k1_e.valueOf()),
            Math.abs(k2.valueOf() - k2_e.valueOf()),
            Math.abs(p1.valueOf() - p1_e.valueOf()),
            Math.abs(p2.valueOf() - p2_e.valueOf()),
            Math.abs(k3.valueOf() - k3_e.valueOf()));
    }

    compareShiftVecs(tvecs: Array<alvision.Mat>, tvecs_est: Array<alvision.Mat>) : void
    {
        const  eps = 1e-2;
        const  dlt = 1e-4;

        var err_count = 0;
        const errMsgNum = 4;
        for(var i = 0; i < tvecs.length; ++i)
        {
            const  tvec = tvecs[i].ptr<alvision.Point3d>("Point3d")[0];
            const  tvec_est = tvecs_est[i].ptr<alvision.Point3d>("Point3d")[0];

            if (alvision.Point3d.norm(alvision.Point3d.op_Substraction(tvec_est, tvec)) > eps * (alvision.Point3d.norm(tvec).valueOf() + dlt))
            {
                if (err_count++ < errMsgNum)
                {
                    if (err_count == errMsgNum)
                        this.ts.printf( alvision.cvtest.TSConstants.LOG, "%d) ...\n", this.r);
                    else
                    {
                        this.ts.printf( alvision.cvtest.TSConstants.LOG, "%d) Bad accuracy in returned tvecs. Index = %d\n", this.r, i);
                        this.ts.printf(alvision.cvtest.TSConstants.LOG, "%d) norm(tvec_est - tvec) = %f, norm(tvec_exp) = %f \n", this.r, alvision.Point3d.norm(alvision.Point3d.op_Substraction(tvec_est, tvec)), alvision.Point3d.norm(tvec));
                    }
                }
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
            }
        }
    }

    compareRotationVecs(rvecs: Array<alvision.Mat>, rvecs_est: Array<alvision.Mat>) : void
    {
        const  eps = 2e-2;
        const  dlt = 1e-4;

        var rmat = new alvision.Mat();
        var rmat_est = new alvision.Mat();
        var err_count = 0;
        const errMsgNum = 4;
        for(var i = 0; i < rvecs.length; ++i)
        {
            alvision.Rodrigues(rvecs[i], rmat);
            alvision.Rodrigues(rvecs_est[i], rmat_est);

            if (alvision.cvtest.norm(rmat_est, rmat,alvision.NormTypes. NORM_L2) > eps* (alvision.cvtest.norm(rmat,alvision.NormTypes. NORM_L2).valueOf() + dlt))
            {
                if (err_count++ < errMsgNum)
                {
                    if (err_count == errMsgNum)
                        this.ts.printf( alvision.cvtest.TSConstants.LOG, "%d) ...\n", this.r);
                    else
                    {
                        this.ts.printf( alvision.cvtest.TSConstants.LOG, "%d) Bad accuracy in returned rvecs (rotation matrs). Index = %d\n", this.r, i);
                        this.ts.printf( alvision.cvtest.TSConstants.LOG, "%d) norm(rot_mat_est - rot_mat_exp) = %f, norm(rot_mat_exp) = %f \n", this.r,
                                   alvision.cvtest.norm(rmat_est, rmat,alvision.NormTypes. NORM_L2), alvision.cvtest.norm(rmat,alvision.NormTypes. NORM_L2));

                    }
                }
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
            }
        }
    }

    reprojectErrorWithoutIntrinsics(cb3d: Array<alvision.Point3f>, _rvecs_exp: Array<alvision.Mat>, _tvecs_exp: Array<alvision.Mat> ,
        rvecs_est: Array<alvision.Mat>, tvecs_est: Array<alvision.Mat> ) : alvision.double
    {
        const  eye33 =  alvision.Mat.eye(3, 3, alvision.MatrixType.CV_64F);
        const  zero15 = alvision.Mat.zeros(1, 5,alvision.MatrixType. CV_64F);
        var _chessboard3D = new alvision.Mat(cb3d);
        
            var uv_est = new Array < alvision.Point2f >();
            var uv_exp = new Array<alvision.Point2f>();
        var res = 0;

        for(var i = 0; i < this.rvecs_exp.length; ++i)
        {
            alvision.projectPoints(_chessboard3D, _rvecs_exp[i], _tvecs_exp[i], eye33, zero15, uv_exp);
            alvision.projectPoints(_chessboard3D, rvecs_est[i], tvecs_est[i], eye33, zero15, uv_est);
            for(var j = 0; j < cb3d.length; ++j)
                res += alvision.Point.norm(alvision.Point.op_Substraction( uv_exp[i] , uv_est[i])).valueOf();
        }
        return res;
    }

    protected sqSile : alvision.Size2f;

    protected chessboard3D : Array<alvision.Point3f>;
    protected  boards : Array<alvision.Mat>;  
    protected  rvecs_exp  : Array<alvision.Mat>;
    protected  tvecs_exp  : Array<alvision.Mat>;
    protected  rvecs_spnp : Array<alvision.Mat>;
    protected  tvecs_spnp : Array<alvision.Mat>;
    protected objectPoints: Array<Array<alvision.Point3f>>;
    protected imagePoints_art: Array<Array<alvision.Point2f>>;
    protected imagePoints_findCb: Array<Array<alvision.Point2f>>;


    prepareForTest(bg: alvision.Mat, camMat: alvision.Mat, distCoeffs: alvision.Mat, brdsNum: alvision.size_t, cbg: cbgenerator.ChessBoardGenerator) : void
    {
        this.sqSile = new alvision.Size2f(1., 1.);
        var cornersSize = cbg.cornersSize();

        this.chessboard3D.length = 0;
        for(var j = 0; j < cornersSize.height; ++j)
            for(var i = 0; i < cornersSize.width; ++i)
                this.chessboard3D.push(new alvision.Point3f(this.sqSile.width.valueOf() * i, this.sqSile.height.valueOf() * j, 0));

        this.boards.length = (brdsNum).valueOf();
        this.rvecs_exp.length = (brdsNum).valueOf();
        this.tvecs_exp.length = (brdsNum).valueOf();
        this.objectPoints = alvision.NewArray(brdsNum, () => this.chessboard3D);
        //this.objectPoints.resize(brdsNum, this.chessboard3D);
        this.imagePoints_art.length = 0;
        this.imagePoints_findCb.length = 0;;

        
            var corners_art = new Array < alvision.Point2f >();
            var corners_fcb = new Array<  alvision.Point2f>();
        for(var i = 0; i < brdsNum; ++i)
        {
            for(;;)
            {
                this.boards[i] = cbg.run2(bg, camMat, distCoeffs, this.sqSile, corners_art);
                if(alvision.findChessboardCorners(this.boards[i], cornersSize, corners_fcb))
                    break;
            }

            //alvision.namedWindow("CB"); imshow("CB", boards[i]); alvision.waitKey();

            this.imagePoints_art.push(corners_art);
            this.imagePoints_findCb.push(corners_fcb);

            this.tvecs_exp[i].create(1, 3,alvision.MatrixType. CV_64F);
            this.tvecs_exp[i].ptr<alvision.Point3d>("Point3d")[0] = cbg.corners3d[0];
            this.rvecs_exp[i] = calcRvec(cbg.corners3d, cbg.cornersSize());
        }

    }

    runTest(imgSize: alvision.Size, camMat: alvision.Mat_<alvision.double>, distCoeffs: alvision.Mat_<alvision.double>, brdsNum: alvision.size_t, cornersSize: alvision.Size, flag: alvision.int  = 0) : void
    {
        var tc = new alvision.TermCriteria (alvision.TermCriteriaType.EPS|alvision.TermCriteriaType.MAX_ITER, 30, 0.1);

        var imagePoints = new Array<Array<alvision.Point2f>>();

        switch(flag)
        {
        case JUST_FIND_CORNERS: imagePoints =  this.imagePoints_findCb; break;
        case ARTIFICIAL_CORNERS: imagePoints = this.imagePoints_art; break;

        case USE_CORNERS_SUBPIX:
            for(var i = 0; i < brdsNum; ++i)
            {
                var gray = new alvision.Mat();
                alvision.cvtColor(this.boards[i], gray,alvision.ColorConversionCodes. COLOR_BGR2GRAY);
                var tmp = this.imagePoints_findCb[i];
                alvision.cornerSubPix(gray, tmp, new alvision.Size(5, 5),new alvision.Size(-1,-1), tc);
                imagePoints.push(tmp);
            }
            break;
        case USE_4QUAD_CORNERS:
            for(var i = 0; i < brdsNum; ++i)
            {
                var gray = new alvision.Mat();
                alvision.cvtColor(this.boards[i], gray,alvision.ColorConversionCodes. COLOR_BGR2GRAY);
                var tmp = this.imagePoints_findCb[i];
                alvision.find4QuadCornerSubpix(gray, tmp, new alvision.Size(5, 5));
                imagePoints.push(tmp);
            }
            break;
        default:
            throw new Error("flag is not implemented");
        }

        var camMat_est = alvision.Mat.from(alvision.Mat.eye(3, 3, alvision.MatrixType.CV_64F));
        var distCoeffs_est = alvision.Mat.from(alvision.Mat.zeros(1, 5, alvision.MatrixType.CV_64F));
        var rvecs_est = new Array<alvision.Mat>();
        var tvecs_est = new Array<alvision.Mat>();

        var flags = /*CALIB_FIX_K3|*/alvision.CALIB.CALIB_FIX_K4 | alvision.CALIB.CALIB_FIX_K5 | alvision.CALIB.CALIB_FIX_K6; //CALIB_FIX_K3; //CALIB_FIX_ASPECT_RATIO |  | CALIB_ZERO_TANGENT_DIST;
        var criteria = new alvision.TermCriteria(alvision.TermCriteriaType.COUNT+alvision.TermCriteriaType.EPS, 100, alvision.DBL_EPSILON);
        var rep_error = alvision.calibrateCamera(this.objectPoints, imagePoints, imgSize, camMat_est, distCoeffs_est, rvecs_est, tvecs_est, flags, criteria);
        rep_error = rep_error.valueOf() /  brdsNum.valueOf() * cornersSize.area().valueOf();

        const thres = 1;
        if (rep_error > thres)
        {
            this.ts.printf( alvision.cvtest.TSConstants.LOG, "%d) Too big reproject error = %f\n", this.r, rep_error);
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
        }

        this.compareCameraMatrs(camMat, camMat_est);
        this.compareDistCoeffs(distCoeffs, distCoeffs_est);
        this.compareShiftVecs(this.tvecs_exp, tvecs_est);
        this.compareRotationVecs(this.rvecs_exp, rvecs_est);

        var rep_errorWOI = this.reprojectErrorWithoutIntrinsics(this.chessboard3D, this.rvecs_exp, this.tvecs_exp, rvecs_est, tvecs_est);
        rep_errorWOI = rep_errorWOI.valueOf()  / brdsNum.valueOf() * cornersSize.area().valueOf();

        const thres2 = 0.01;
        if (rep_errorWOI > thres2)
        {
            this.ts.printf( alvision.cvtest.TSConstants.LOG, "%d) Too big reproject error without intrinsics = %f\n", this.r, rep_errorWOI);
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
        }

        this.ts.printf( alvision.cvtest.TSConstants.LOG, "%d) Testing solvePnP...\n", this.r);
        this.rvecs_spnp.length = (brdsNum).valueOf();
        this.tvecs_spnp.length = (brdsNum).valueOf();
        for(var i = 0; i < brdsNum; ++i)
            alvision.solvePnP(new alvision.Mat(this.objectPoints[i]), new alvision.Mat(imagePoints[i]), camMat, distCoeffs, this.rvecs_spnp[i], this.tvecs_spnp[i]);

        this.compareShiftVecs(this.tvecs_exp, this.tvecs_spnp);
        this.compareRotationVecs(this.rvecs_exp, this.rvecs_spnp);
    }

    run(iii: alvision.int) : void
    {

        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
        var rng = alvision.theRNG();

        var progress = 0;
        var repeat_num = 3;
        for (this.r = 0; this.r < repeat_num; this.r = this.r.valueOf() + 1)
        {
            const brds_num = 20;

            var bg = new alvision.Mat(new alvision.Size(640, 480),alvision.MatrixType. CV_8UC3);
            alvision.randu(bg, alvision.Scalar.all(32),alvision. Scalar.all(255));
            alvision.GaussianBlur(bg, bg, new alvision.Size(5, 5), 2);

            var fx = 300 + (20 * rng.double().valueOf() - 10);
            var fy = 300 + (20 * rng.double().valueOf() - 10);

            var cx = bg.cols.valueOf()/2 + (40 * rng.double().valueOf() - 20);
            var cy = bg.rows.valueOf()/2 + (40 * rng.double().valueOf() - 20);

            var camMat = new alvision.Matd(3, 3, [fx, 0., cx, 0, fy, cy, 0., 0., 1.]);
            //camMat << fx, 0., cx, 0, fy, cy, 0., 0., 1.;

            var k1 = 0.5 + rng.double().valueOf()/5;
            var k2 = rng.double().valueOf()/5;
            var k3 = rng.double().valueOf()/5;

            var p1 = 0.001 + rng.double().valueOf()/10;
            var p2 = 0.001 + rng.double().valueOf()/10;

            var distCoeffs = new alvision.Matd(1, 5, [k1, k2, p1, p2, k3]);
            //distCoeffs << k1, k2, p1, p2, k3;

            var cbg = new cbgenerator.ChessBoardGenerator (new alvision.Size(9, 8));
            cbg.min_cos = 0.9;
            cbg.cov = 0.8;

            progress = this.update_progress(progress, this.r, repeat_num, 0).valueOf();
            this.ts.printf( alvision.cvtest.TSConstants.LOG, "\n");
            this.prepareForTest(bg, camMat, distCoeffs, brds_num, cbg);

            this.ts.printf( alvision.cvtest.TSConstants.LOG, "artificial corners\n");
            this.runTest(bg.size(), camMat, distCoeffs, brds_num, cbg.cornersSize(), ARTIFICIAL_CORNERS);
            progress = this.update_progress(progress, this.r, repeat_num, 0).valueOf();

            this.ts.printf( alvision.cvtest.TSConstants.LOG, "findChessboard corners\n");
            this.runTest(bg.size(), camMat, distCoeffs, brds_num, cbg.cornersSize(), JUST_FIND_CORNERS);
            progress = this.update_progress(progress, this.r, repeat_num, 0).valueOf();

            this.ts.printf( alvision.cvtest.TSConstants.LOG, "cornersSubPix corners\n");
            this.runTest(bg.size(), camMat, distCoeffs, brds_num, cbg.cornersSize(), USE_CORNERS_SUBPIX);
            progress = this.update_progress(progress, this.r, repeat_num, 0).valueOf();

            this.ts.printf( alvision.cvtest.TSConstants.LOG, "4quad corners\n");
            this.runTest(bg.size(), camMat, distCoeffs, brds_num, cbg.cornersSize(), USE_4QUAD_CORNERS);
            progress = this.update_progress(progress, this.r, repeat_num, 0).valueOf();
        }
    }
};

alvision.cvtest.TEST('Calib3d_CalibrateCamera_CPP', 'DISABLED_accuracy_on_artificial_data', () => { var test = new CV_CalibrateCameraArtificialTest(); test.safe_run(); });
