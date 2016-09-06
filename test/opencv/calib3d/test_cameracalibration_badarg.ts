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

import * as _cbgen from './test_chessboardgenerator';

//#include "test_precomp.hpp"
//#include "test_chessboardgenerator.hpp"
//#include "opencv2/calib3d/calib3d_c.h"
//
//#include <iostream>
//
//using namespace cv;
//using namespace std;

class C_CallerCalibrateCamera {
    public objPts: alvision.Mat;
    public imgPts: alvision.Mat;
    public npoints: alvision.Mat;
    public imageSize: alvision.Size;
    public cameraMatrix: alvision.Mat;
    public distCoeffs: alvision.Mat;
    public rvecs: alvision.Mat;
    public tvecs: alvision.Mat;
    public flags: alvision.int;

    run(): void {
        alvision.calibrateCamera(this.objPts, this.imgPts, this.imageSize,
            this.cameraMatrix, this.distCoeffs, this.rvecs, this.tvecs, this.flags);
    }
}

class CV_CameraCalibrationBadArgTest extends alvision.cvtest.BadArgTest {
    constructor() {
        super();
        this.imgSize = new alvision.Size(800, 600);
    }
    run(iii: alvision.int): void {
        var camMat = new alvision.Mat1f(3, 3, [300., 0., this.imgSize.width.valueOf() / 2., 0, 300., this.imgSize.height.valueOf() / 2., 0., 0., 1.]);
        var distCoeffs0 = new alvision.Mat1f(1, 5, [1.2, 0.2, 0., 0., 0.]);

        //camMat << 300., 0., this.imgSize.width / 2.f, 0, 300., this.imgSize.height / 2., 0., 0., 1.;
        //distCoeffs0 << 1.2, 0.2, 0., 0., 0.;

        var cbg = new _cbgen.ChessBoardGenerator (new alvision.Size(8, 6));
        this.corSize = cbg.cornersSize();
        var exp_corn = new Array<alvision.Point2f>();
        this.chessBoard = cbg.run1(new alvision.Mat(this.imgSize, alvision.MatrixType.CV_8U, new alvision.Scalar(0)), camMat, distCoeffs0, exp_corn);

        (new alvision.MatPoint2f(this.corSize.height, this.corSize.width, exp_corn)).copyTo(this.corners);

        var objPts = new alvision.Mat();
        var imgPts = new alvision.Mat();
        var npoints = new alvision.Mat();
        var cameraMatrix = new alvision.Mat();
        var distCoeffs = new alvision.Mat();
        var rvecs = new alvision.Mat();
        var tvecs = new alvision.Mat();




        var zeros = new alvision.Mat(1, 10*10 /*sizeof(CvMat)*/, alvision.MatrixType.CV_8U,new alvision.Scalar(0));

        var caller = new C_CallerCalibrateCamera (), bad_caller= new C_CallerCalibrateCamera();
        caller.imageSize = this.imgSize;
        caller.objPts = objPts;
        caller.imgPts = imgPts;
        caller.npoints = npoints;
        caller.cameraMatrix = cameraMatrix;
        caller.distCoeffs = distCoeffs;
        caller.rvecs = rvecs;
        caller.tvecs = tvecs;

        /////////////////////////////
        var objPts_cpp = new alvision.Mat();
        var imgPts_cpp = new alvision.Mat();
        var npoints_cpp = new alvision.Mat();
        var cameraMatrix_cpp = new alvision.Mat();
        var distCoeffs_cpp = new alvision.Mat();
        var rvecs_cpp = new alvision.Mat();
        var tvecs_cpp = new alvision.Mat();

        objPts_cpp.create(this.corSize, alvision.MatrixType.CV_32FC3);
        for (var j = 0; j < this.corSize.height.valueOf(); ++j)
            for (var i = 0; i < this.corSize.width.valueOf(); ++i)
                objPts_cpp.at<alvision.Point3f>("Point2f", j, i).set(new alvision.Point3i(i, j, 0));
        objPts_cpp = objPts_cpp.reshape(3, 1);

        imgPts_cpp = this.corners.clone().reshape(2, 1);
        npoints_cpp = new alvision.Mat1i(this.M, 1, this.corSize.width.valueOf() * this.corSize.height.valueOf());
        cameraMatrix_cpp.create(3, 3, alvision.MatrixType.CV_32F);
        distCoeffs_cpp.create(5, 1, alvision.MatrixType.CV_32F);
        rvecs_cpp.create(this.M, 1, alvision.MatrixType.CV_32FC3);
        tvecs_cpp.create(this.M, 1, alvision.MatrixType.CV_32FC3);

        caller.flags = 0;
        //alvision.CALIB.CALIB_USE_INTRINSIC_GUESS;    //CV_CALIB_FIX_ASPECT_RATIO
        //alvision.CALIB.CALIB_USE_INTRINSIC_GUESS    //CV_CALIB_FIX_ASPECT_RATIO
        //CV_CALIB_FIX_PRINCIPAL_POINT    //alvision.CALIB.CALIB_ZERO_TANGENT_DIST
        //CV_CALIB_FIX_FOCAL_LENGTH    //CV_CALIB_FIX_K1    //CV_CALIB_FIX_K2    //alvision.CALIB.CALIB_FIX_K3

        objPts = objPts_cpp;
        imgPts = imgPts_cpp;
        npoints = npoints_cpp;
        cameraMatrix = cameraMatrix_cpp;
        distCoeffs = distCoeffs_cpp;
        rvecs = rvecs_cpp;
        tvecs = tvecs_cpp;

        /* /*//*/ */
        var errors = 0;

        bad_caller= caller;
        bad_caller.objPts = null;
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "Zero passed in objPts", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.imgPts = null;
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "Zero passed in imgPts", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.npoints = null;
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "Zero passed in npoints", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.cameraMatrix = null;
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "Zero passed in cameraMatrix", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.distCoeffs = null;
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "Zero passed in distCoeffs", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.imageSize.width = -1;
        errors += this.run_test_case(alvision.cv.Error.Code.StsOutOfRange, "Bad image width", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.imageSize.height = -1;
        errors += this.run_test_case(alvision.cv.Error.Code.StsOutOfRange, "Bad image height", bad_caller.run).valueOf();

        var bad_nts_cpp1 = new alvision.Mat1f(this.M, 1, 1.);
        var bad_nts_cpp2 = new alvision.Mat1i(3, 3, this.corSize.width.valueOf() * this.corSize.height.valueOf());
        var bad_npts_c1 = bad_nts_cpp1;
        var bad_npts_c2 = bad_nts_cpp2;

        bad_caller= caller;
        bad_caller.npoints = bad_npts_c1;
        errors += this.run_test_case(alvision.cv.Error.Code.StsUnsupportedFormat, "Bad npoints format", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.npoints = bad_npts_c2;
        errors += this.run_test_case(alvision.cv.Error.Code.StsUnsupportedFormat, "Bad npoints size", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.rvecs = zeros;//.ptr();
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "Bad rvecs header", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.tvecs = zeros;//.ptr();
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "Bad tvecs header", bad_caller.run).valueOf();

        var bad_rvecs_cpp1 = new alvision.Mat(this.M + 1, 1, alvision.MatrixType.CV_32FC3); var bad_rvecs_c1 = bad_rvecs_cpp1;
        var bad_tvecs_cpp1 = new alvision.Mat(this.M + 1, 1, alvision.MatrixType.CV_32FC3); var bad_tvecs_c1 = bad_tvecs_cpp1;



        var bad_rvecs_cpp2 = new alvision.Mat(this.M, 2, alvision.MatrixType.CV_32FC3); var bad_rvecs_c2 = bad_rvecs_cpp2;
        var bad_tvecs_cpp2 = new alvision.Mat(this.M, 2, alvision.MatrixType.CV_32FC3); var bad_tvecs_c2 = bad_tvecs_cpp2;

        bad_caller= caller;
        bad_caller.rvecs = bad_rvecs_c1;
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "Bad tvecs header", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.rvecs = bad_rvecs_c2;
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "Bad tvecs header", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.tvecs = bad_tvecs_c1;
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "Bad tvecs header", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.tvecs = bad_tvecs_c2;
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "Bad tvecs header", bad_caller.run).valueOf();

        var bad_cameraMatrix_cpp1 = new alvision.Mat(3, 3, alvision.MatrixType.CV_32S); var bad_cameraMatrix_c1 = bad_cameraMatrix_cpp1;
        var bad_cameraMatrix_cpp2 = new alvision.Mat(2, 3, alvision.MatrixType.CV_32F); var bad_cameraMatrix_c2 = bad_cameraMatrix_cpp2;
        var bad_cameraMatrix_cpp3 = new alvision.Mat(3, 2, alvision.MatrixType.CV_64F); var bad_cameraMatrix_c3 = bad_cameraMatrix_cpp3;



        bad_caller= caller;
        bad_caller.cameraMatrix = bad_cameraMatrix_c1;
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "Bad camearaMatrix header", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.cameraMatrix = bad_cameraMatrix_c2;
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "Bad camearaMatrix header", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.cameraMatrix = bad_cameraMatrix_c3;
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "Bad camearaMatrix header", bad_caller.run).valueOf();

        var bad_distCoeffs_cpp1 = new alvision.Mat(1, 5,alvision.MatrixType. CV_32S); var bad_distCoeffs_c1 = bad_distCoeffs_cpp1;
        var bad_distCoeffs_cpp2 = new alvision.Mat(2, 2,alvision.MatrixType. CV_64F); var bad_distCoeffs_c2 = bad_distCoeffs_cpp2;
        var bad_distCoeffs_cpp3 = new alvision.Mat(1, 6,alvision.MatrixType. CV_64F); var bad_distCoeffs_c3 = bad_distCoeffs_cpp3;



        bad_caller= caller;
        bad_caller.distCoeffs = bad_distCoeffs_c1;
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "Bad distCoeffs header", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.distCoeffs = bad_distCoeffs_c2;
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "Bad distCoeffs header", bad_caller.run).valueOf();


        bad_caller= caller;
        bad_caller.distCoeffs = bad_distCoeffs_c3;
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "Bad distCoeffs header", bad_caller.run).valueOf();

        var CM = [ 0, 0, 0, /**/0, 0, 0, /**/0, 0, 0];
        var bad_cameraMatrix_cpp4 = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F, CM); var bad_cameraMatrix_c4 = bad_cameraMatrix_cpp4;

        bad_caller = caller;
        bad_caller.flags = bad_caller.flags.valueOf() | alvision.CALIB.CALIB_USE_INTRINSIC_GUESS ;
        bad_caller.cameraMatrix = bad_cameraMatrix_c4;
        CM[0] = 0; //bad fx
        errors += this.run_test_case(alvision.cv.Error.Code.StsOutOfRange, "Bad camearaMatrix data", bad_caller.run).valueOf();

        CM[0] = 500; CM[4] = 0;  //bad fy
        errors += this.run_test_case(alvision.cv.Error.Code.StsOutOfRange, "Bad camearaMatrix data", bad_caller.run).valueOf();

        CM[0] = 500; CM[4] = 500; CM[2] = -1; //bad cx
        errors += this.run_test_case(alvision.cv.Error.Code.StsOutOfRange, "Bad camearaMatrix data", bad_caller.run).valueOf();

        CM[0] = 500; CM[4] = 500; CM[2] = this.imgSize.width.valueOf() * 2; //bad cx
        errors += this.run_test_case(alvision.cv.Error.Code.StsOutOfRange, "Bad camearaMatrix data", bad_caller.run).valueOf();

        CM[0] = 500; CM[4] = 500; CM[2] = this.imgSize.width.valueOf() / 2; CM[5] = -1; //bad cy
        errors += this.run_test_case(alvision.cv.Error.Code.StsOutOfRange, "Bad camearaMatrix data", bad_caller.run).valueOf();

        CM[0] = 500; CM[4] = 500; CM[2] = this.imgSize.width.valueOf() / 2; CM[5] = this.imgSize.height.valueOf() * 2; //bad cy
        errors += this.run_test_case(alvision.cv.Error.Code.StsOutOfRange, "Bad camearaMatrix data", bad_caller.run).valueOf();

        CM[0] = 500; CM[4] = 500; CM[2] = this.imgSize.width.valueOf() / 2; CM[5] = this.imgSize.height.valueOf() / 2;
        CM[1] = 0.1; //Non-zero skew
        errors += this.run_test_case(alvision.cv.Error.Code.StsOutOfRange, "Bad camearaMatrix data", bad_caller.run).valueOf();

        CM[1] = 0;
        CM[3] = 0.1; /* mad matrix shape */
        errors += this.run_test_case(alvision.cv.Error.Code.StsOutOfRange, "Bad camearaMatrix data", bad_caller.run).valueOf();

        CM[3] = 0; CM[6] = 0.1; /* mad matrix shape */
        errors += this.run_test_case(alvision.cv.Error.Code.StsOutOfRange, "Bad camearaMatrix data", bad_caller.run).valueOf();

        CM[3] = 0; CM[6] = 0; CM[7] = 0.1; /* mad matrix shape */
        errors += this.run_test_case(alvision.cv.Error.Code.StsOutOfRange, "Bad camearaMatrix data", bad_caller.run).valueOf();

        CM[3] = 0; CM[6] = 0; CM[7] = 0; CM[8] = 1.1; /* mad matrix shape */
        errors += this.run_test_case(alvision.cv.Error.Code.StsOutOfRange, "Bad camearaMatrix data", bad_caller.run).valueOf();
        CM[8] = 1.0;

        /////////////////////////////////////////////////////////////////////////////////////
        bad_caller= caller;
        var bad_objPts_cpp5 = objPts_cpp.clone(); var bad_objPts_c5 = bad_objPts_cpp5;
        bad_caller.objPts = bad_objPts_c5;

        var rng = alvision.theRNG();
        for (var i = 0; i < bad_objPts_cpp5.rows(); ++i) {
            var zptr = bad_objPts_cpp5.at<alvision.Point3f>("Poin3f", 0, i);
            var zPoint = zptr.get();
            zPoint.z = zPoint.z.valueOf() + (rng.float().valueOf() - 0.5);
            zptr.set(zPoint);
            //zptr.z += (rng.float().valueOf() - 0.5);
        }

        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "Bad objPts data", bad_caller.run).valueOf();

        if (errors)
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
        else
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);

        //try { caller(); }
        //catch(e)
        //{
        //    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
        //    console.log(util.format("+!");
        //}
    }
    run_func(): void { }

    private M = 1;

    protected imgSize: alvision.Size;
    protected corSize: alvision.Size;
    protected chessBoard: alvision.Mat;
    protected corners: alvision.Mat;

}

class C_CallerRodrigues2
{
    public src: alvision.Mat;
    public dst      : alvision.Mat;
    public jacobian : alvision.Mat;

    run(): void {
        alvision.Rodrigues(this.src, this.dst, this.jacobian
        );
    }
};

class CV_Rodrigues2BadArgTest extends alvision.cvtest.BadArgTest
{
    run_func(): void { }

    run(start_from: alvision.int  ) : void
    {
        var zeros = new alvision.Mat (1, 10*10 /*sizeof(CvMat)*/, alvision.MatrixType.CV_8U, new alvision.Scalar(0));
        var src_c = new alvision.Mat();
        var dst_c      = new alvision.Mat();
        var jacobian_c = new alvision.Mat();

        var src_cpp      = new alvision.Mat(3, 1,alvision.MatrixType. CV_32F); src_c = src_cpp;
        var dst_cpp      = new alvision.Mat(3, 3,alvision.MatrixType. CV_32F); dst_c = dst_cpp;
        var jacobian_cpp = new alvision.Mat(3, 9,alvision.MatrixType. CV_32F); jacobian_c = jacobian_cpp;

        var caller = new C_CallerRodrigues2(), bad_caller= new C_CallerRodrigues2();
        caller.src = src_c;
        caller.dst = dst_c;
        caller.jacobian = jacobian_c;

       /* try { caller(); }
        catch(e)
        {
            console.log(util.format("badasfas");
        }*/

        /*/*//*/*/
        var errors = 0;

        bad_caller= caller;
        bad_caller.src = null;
        errors += this.run_test_case(alvision.cv.Error.Code.StsNullPtr, "Src is zero pointer", bad_caller.run ).valueOf();

        bad_caller= caller;
        bad_caller.dst = null;
        errors += this.run_test_case(alvision.cv.Error.Code.StsNullPtr, "Dst is zero pointer", bad_caller.run ).valueOf();

        var bad_src_cpp1 = new alvision.Mat(3, 1,alvision.MatrixType. CV_8U);    var bad_src_c1 = bad_src_cpp1;
        var bad_dst_cpp1 = new alvision.Mat(3, 1,alvision.MatrixType. CV_8U);    var bad_dst_c1 = bad_dst_cpp1;
        var bad_jac_cpp1 = new alvision.Mat(3, 1,alvision.MatrixType. CV_8U);    var bad_jac_c1 = bad_jac_cpp1;
        var bad_jac_cpp2 = new alvision.Mat(3, 1,alvision.MatrixType. CV_32FC2); var bad_jac_c2 = bad_jac_cpp2;
        var bad_jac_cpp3 = new alvision.Mat(3, 1,alvision.MatrixType. CV_32F);   var bad_jac_c3 = bad_jac_cpp3;

        bad_caller= caller;
        bad_caller.src = bad_src_c1;
        errors += this.run_test_case(alvision.cv.Error.Code.StsUnsupportedFormat, "Bad src formart", bad_caller.run ).valueOf();

        bad_caller= caller;
        bad_caller.dst = bad_dst_c1;
        errors += this.run_test_case(alvision.cv.Error.Code.StsUnmatchedFormats, "Bad dst formart", bad_caller.run ).valueOf();

        bad_caller= caller;
        bad_caller.jacobian = zeros;//.ptr();
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadArg, "Bad jacobian ", bad_caller.run ).valueOf();

        bad_caller= caller;
        bad_caller.jacobian = bad_jac_c1;
        errors += this.run_test_case(alvision.cv.Error.Code.StsUnmatchedFormats, "Bad jacobian format", bad_caller.run ).valueOf();

        bad_caller= caller;
        bad_caller.jacobian = bad_jac_c2;
        errors += this.run_test_case(alvision.cv.Error.Code.StsUnmatchedFormats, "Bad jacobian format", bad_caller.run ).valueOf();

        bad_caller= caller;
        bad_caller.jacobian = bad_jac_c3;
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadSize, "Bad jacobian format", bad_caller.run ).valueOf();

        var bad_src_cpp2 = new alvision.Mat(1, 1, alvision.MatrixType.CV_32F); var bad_src_c2 = bad_src_cpp2;

        bad_caller= caller;
        bad_caller.src = bad_src_c2;
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadSize, "Bad src format", bad_caller.run ).valueOf();

        var bad_dst_cpp2 = new alvision.Mat(2, 1, alvision.MatrixType. CV_32F);   var bad_dst_c2 = bad_dst_cpp2;
        var bad_dst_cpp3 = new alvision.Mat(3, 2,alvision.MatrixType. CV_32F);   var bad_dst_c3 = bad_dst_cpp3;
        var bad_dst_cpp4 = new alvision.Mat(3, 3,alvision.MatrixType. CV_32FC2); var bad_dst_c4 = bad_dst_cpp4;

        bad_caller= caller;
        bad_caller.dst = bad_dst_c2;
        errors += this.run_test_case(alvision.cv.Error.Code.StsBadSize, "Bad dst format", bad_caller.run ).valueOf();

        bad_caller= caller;
        bad_caller.dst = bad_dst_c3;
        errors += this.run_test_case( alvision.cv.Error.Code.StsBadSize, "Bad dst format", bad_caller.run ).valueOf();

        bad_caller= caller;
        bad_caller.dst = bad_dst_c4;
        errors += this.run_test_case( alvision.cv.Error.Code.StsBadSize, "Bad dst format", bad_caller.run ).valueOf();


        /********/
        src_cpp.create(3, 3, alvision.MatrixType. CV_32F); src_c = src_cpp;
        dst_cpp.create(3, 1,alvision.MatrixType. CV_32F); dst_c = dst_cpp;


        var bad_dst_cpp5 = new alvision.Mat(5, 5, alvision.MatrixType. CV_32F); var bad_dst_c5 = bad_dst_cpp5;

        bad_caller= caller;
        bad_caller.dst = bad_dst_c5;
        errors += this.run_test_case( alvision.cv.Error.Code.StsBadSize, "Bad dst format", bad_caller.run ).valueOf();


        if (errors)
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
        else
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }
};


//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

class C_CallerProjectPoints2
{
    public  objectPoints : alvision.Mat;
    public  r_vec        : alvision.Mat;
    public  t_vec        : alvision.Mat;
    public  A            : alvision.Mat;
    public  distCoeffs   : alvision.Mat;
    public  imagePoints  : alvision.Mat;
    //protected  dpdr         : alvision.Mat;
    //protected  dpdt         : alvision.Mat;
    //protected  dpdf         : alvision.Mat;
    //protected  dpdc         : alvision.Mat;
    //protected dpdk: alvision.Mat;
    public aspectRatio: alvision.double;

    run() : void
    {
        alvision.projectPoints(this.objectPoints, this.r_vec, this.t_vec,this. A,this. distCoeffs, this.imagePoints,
            /*this.dpdr, this.dpdt,this. dpdf,this. dpdc,this. dpdk, */null,this.aspectRatio);
    }
};

class CV_ProjectPoints2BadArgTest extends alvision.cvtest.BadArgTest
{
    constructor() 
    {
        super();
        this.camMat = new alvision.Mat1f(3, 3, [300., 0., imsSize.width.valueOf() / 2., 0, 300., imsSize.height.valueOf() / 2., 0., 0., 1.]);
        this.distCoeffs = new alvision.Mat1f(1, 5, [1.2, 0.2, 0., 0., 0.]);
        var imsSize = new alvision.Size (800, 600);
        //camMat << 300., 0., imsSize.width/2., 0, 300., imsSize.height/2., 0., 0., 1.;
        //distCoeffs << 1.2, 0.2, 0., 0., 0.;
    }

    protected camMat: alvision.Mat_<alvision.float>;
    protected distCoeffs: alvision.Mat_<alvision.float>;

    run_func(): void { }

    run(start_from: alvision.int  ) : void
    {
        var zeros = new alvision.Mat();
        //memset(&zeros, 0, sizeof(zeros));

        var caller = new C_CallerProjectPoints2(), bad_caller = new C_CallerProjectPoints2();
        //CvMat
        var objectPoints_c = new alvision.Mat();
        var r_vec_c        = new alvision.Mat();
        var t_vec_c        = new alvision.Mat();
        var A_c            = new alvision.Mat();
        var distCoeffs_c   = new alvision.Mat();
        var imagePoints_c = new alvision.Mat();
            //dpdr_c, dpdt_c, dpdf_c, dpdc_c, dpdk_c;

        const n = 10;

        var imagePoints_cpp = new alvision.Mat (1, n, alvision.MatrixType.CV_32FC2); imagePoints_c = imagePoints_cpp;

        var objectPoints_cpp = new alvision.Mat(1, n, alvision.MatrixType.CV_32FC3);
        alvision.randu(objectPoints_cpp, alvision.Scalar.all(1), alvision.Scalar.all(10));
        objectPoints_c = objectPoints_cpp;

        var t_vec_cpp = alvision.Mat.zeros(1, 3, alvision.MatrixType.CV_32F).toMat(); t_vec_c = t_vec_cpp;
        var r_vec_cpp = new alvision.Mat();
        alvision.Rodrigues(alvision.Mat.eye(3, 3,alvision.MatrixType. CV_32F).toMat(), r_vec_cpp); r_vec_c = r_vec_cpp;

        var A_cpp = this.camMat.clone(); A_c = A_cpp;
        var distCoeffs_cpp = this.distCoeffs.clone(); distCoeffs_c = distCoeffs_cpp;

        //Mat dpdr_cpp(2*n, 3, CV_32F); dpdr_c = dpdr_cpp;
        //Mat dpdt_cpp(2*n, 3, CV_32F); dpdt_c = dpdt_cpp;
        //Mat dpdf_cpp(2*n, 2, CV_32F); dpdf_c = dpdf_cpp;
        //Mat dpdc_cpp(2*n, 2, CV_32F); dpdc_c = dpdc_cpp;
        //Mat dpdk_cpp(2*n, 4, CV_32F); dpdk_c = dpdk_cpp;

        caller.aspectRatio = 1.0;
        caller.objectPoints = objectPoints_c;
        caller.r_vec = r_vec_c;
        caller.t_vec = t_vec_c;
        caller.A = A_c;
        caller.distCoeffs = distCoeffs_c;
        caller.imagePoints = imagePoints_c;
        //caller.dpdr = &dpdr_c;
        //caller.dpdt = &dpdt_c;
        //caller.dpdf = &dpdf_c;
        //caller.dpdc = &dpdc_c;
        //caller.dpdk = &dpdk_c;

        /********************/
        var errors = 0;


        bad_caller= caller;
        bad_caller.objectPoints = null;
        errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Zero objectPoints", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.r_vec = null;
        errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Zero r_vec", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.t_vec = null;
        errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Zero t_vec", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.A = null;
        errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Zero camMat", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.imagePoints = null;
        errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Zero imagePoints", bad_caller.run).valueOf();

        /****************************/
        var bad_r_vec_cpp1 = new alvision.Mat(r_vec_cpp.size(), alvision.MatrixType.CV_32S); var  bad_r_vec_c1 = bad_r_vec_cpp1;
        var bad_r_vec_cpp2 = new alvision.Mat(2, 2, alvision.MatrixType.CV_32F); var bad_r_vec_c2 = bad_r_vec_cpp2;
        var bad_r_vec_cpp3 = new alvision.Mat(r_vec_cpp.size(), alvision.MatrixType. CV_32FC2); var bad_r_vec_c3 = bad_r_vec_cpp3;

        bad_caller= caller;
        bad_caller.r_vec = bad_r_vec_c1;
        errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad rvec format", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.r_vec = bad_r_vec_c2;
        errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad rvec format", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.r_vec = bad_r_vec_c3;
        errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad rvec format", bad_caller.run).valueOf();

        /****************************/
        var bad_t_vec_cpp1 = new alvision.Mat(t_vec_cpp.size(), alvision.MatrixType. CV_32S); var bad_t_vec_c1 = bad_t_vec_cpp1;
        var bad_t_vec_cpp2 = new alvision.Mat(2, 2, alvision.MatrixType.CV_32F); var bad_t_vec_c2 = bad_t_vec_cpp2;
        var bad_t_vec_cpp3 = new alvision.Mat(1, 1, alvision.MatrixType.CV_32FC2); var bad_t_vec_c3 = bad_t_vec_cpp3;

        bad_caller= caller;
        bad_caller.t_vec = bad_t_vec_c1;
        errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad tvec format", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.t_vec = bad_t_vec_c2;
        errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad tvec format", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.t_vec = bad_t_vec_c3;
        errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad tvec format", bad_caller.run).valueOf();

        /****************************/
        var bad_A_cpp1 = new alvision.Mat(A_cpp.size(), alvision.MatrixType.CV_32S); var bad_A_c1 = bad_A_cpp1;
        var bad_A_cpp2 = new alvision.Mat(2, 2, alvision.MatrixType.CV_32F); var bad_A_c2 = bad_A_cpp2;

        bad_caller= caller;
        bad_caller.A = bad_A_c1;
        errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad A format", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.A = bad_A_c2;
        errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad A format", bad_caller.run).valueOf();

        /****************************/
        var bad_distCoeffs_cpp1 = new alvision.Mat(distCoeffs_cpp.size(), alvision.MatrixType.CV_32S); var bad_distCoeffs_c1 = bad_distCoeffs_cpp1;
        var bad_distCoeffs_cpp2 = new alvision.Mat(2, 2,alvision.MatrixType. CV_32F); var bad_distCoeffs_c2 = bad_distCoeffs_cpp2;
        var bad_distCoeffs_cpp3 = new alvision.Mat(1, 7,alvision.MatrixType. CV_32F); var bad_distCoeffs_c3 = bad_distCoeffs_cpp3;

        bad_caller= caller;
        bad_caller.distCoeffs = zeros;
        errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad distCoeffs format", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.distCoeffs = bad_distCoeffs_c1;
        errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad distCoeffs format", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.distCoeffs = bad_distCoeffs_c2;
        errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad distCoeffs format", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.distCoeffs = bad_distCoeffs_c3;
        errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad distCoeffs format", bad_caller.run).valueOf();


        /****************************/
        //Mat bad_dpdr_cpp1(dpdr_cpp.size(), CV_32S); CvMat bad_dpdr_c1 = bad_dpdr_cpp1;
        //Mat bad_dpdr_cpp2(dpdr_cpp.cols+1, 3, CV_32F); CvMat bad_dpdr_c2 = bad_dpdr_cpp2;
        //Mat bad_dpdr_cpp3(dpdr_cpp.cols, 7, CV_32F); CvMat bad_dpdr_c3 = bad_dpdr_cpp3;
        //
        //bad_caller= caller;
        //bad_caller.dpdr = &zeros;
        //errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad dpdr format", bad_caller.run).valueOf();
        //
        //bad_caller= caller;
        //bad_caller.dpdr = &bad_dpdr_c1;
        //errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad dpdr format", bad_caller.run).valueOf();
        //
        //bad_caller= caller;
        //bad_caller.dpdr = &bad_dpdr_c2;
        //errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad dpdr format", bad_caller.run).valueOf();
        //
        //bad_caller= caller;
        //bad_caller.dpdr = &bad_dpdr_c3;
        //errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad dpdr format", bad_caller.run).valueOf();

        /****************************/

        //bad_caller= caller;
        //bad_caller.dpdt = &zeros;
        //errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad dpdt format", bad_caller.run).valueOf();
        //
        //bad_caller= caller;
        //bad_caller.dpdt = &bad_dpdr_c1;
        //errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad dpdt format", bad_caller.run).valueOf();
        //
        //bad_caller= caller;
        //bad_caller.dpdt = &bad_dpdr_c2;
        //errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad dpdt format", bad_caller.run).valueOf();
        //
        //bad_caller= caller;
        //bad_caller.dpdt = &bad_dpdr_c3;
        //errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad dpdt format", bad_caller.run).valueOf();

        /****************************/

        //Mat bad_dpdf_cpp2(dpdr_cpp.cols+1, 2, CV_32F); CvMat bad_dpdf_c2 = bad_dpdf_cpp2;
        //
        //bad_caller= caller;
        //bad_caller.dpdf = &zeros;
        //errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad dpdf format", bad_caller.run).valueOf();
        //
        //bad_caller= caller;
        //bad_caller.dpdf = &bad_dpdr_c1;
        //errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad dpdf format", bad_caller.run).valueOf();
        //
        //bad_caller= caller;
        //bad_caller.dpdf = &bad_dpdf_c2;
        //errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad dpdf format", bad_caller.run).valueOf();
        //
        //bad_caller= caller;
        //bad_caller.dpdf = &bad_dpdr_c3;
        //errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad dpdf format", bad_caller.run).valueOf();

        /****************************/

        //bad_caller= caller;
        //bad_caller.dpdc = &zeros;
        //errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad dpdc format", bad_caller.run).valueOf();
        //
        //bad_caller= caller;
        //bad_caller.dpdc = &bad_dpdr_c1;
        //errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad dpdc format", bad_caller.run).valueOf();
        //
        //bad_caller= caller;
        //bad_caller.dpdc = &bad_dpdf_c2;
        //errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad dpdc format", bad_caller.run).valueOf();
        //
        //bad_caller= caller;
        //bad_caller.dpdc = &bad_dpdr_c3;
        //errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad dpdc format", bad_caller.run).valueOf();

        /****************************/

        //bad_caller= caller;
        //bad_caller.dpdk = &zeros;
        //errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad dpdk format", bad_caller.run).valueOf();
        //
        //bad_caller= caller;
        //bad_caller.dpdk = &bad_dpdr_c1;
        //errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad dpdk format", bad_caller.run).valueOf();
        //
        //bad_caller= caller;
        //bad_caller.dpdk = &bad_dpdf_c2;
        //errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad dpdk format", bad_caller.run).valueOf();
        //
        //bad_caller= caller;
        //bad_caller.dpdk = &bad_dpdr_c3;
        //errors += this.run_test_case( alvision.cv.Error.Code.StsBadArg, "Bad dpdk format", bad_caller.run).valueOf();

        bad_caller= caller;
        bad_caller.distCoeffs = null;
        errors += this.run_test_case( alvision.cv.Error.Code.StsNullPtr, "distCoeffs is NULL while dpdk is not", bad_caller.run).valueOf();


        if (errors)
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
        else
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }
};


alvision.cvtest.TEST('Calib3d_CalibrateCamera_C', 'badarg', () => { var test = new CV_CameraCalibrationBadArgTest(); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_Rodrigues_C', 'badarg', () => { var test = new CV_Rodrigues2BadArgTest(); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_ProjectPoints_C', 'badarg', () => { var test = new CV_ProjectPoints2BadArgTest(); test.safe_run(); });
