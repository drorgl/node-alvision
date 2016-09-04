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
// Copyright (C) 2009-2011, Willow Garage Inc., all rights reserved.
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

import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');


//#include "test_precomp.hpp"
//#include < opencv2 / ts / cuda_test.hpp >
//#include "../src/fisheye.hpp"

class fisheyeTest extends alvision.cvtest.CUDA_TEST{// : public::testing::Test {

    //protected:
    protected  imageSize : alvision.Size;
    protected K: alvision.Matxd;
    protected D: alvision.Vec4d;
    protected R: alvision.Matxd;
    protected T: alvision.Vec4d;
    protected datasets_repository_path: string;

    constructor(case_name : string, test_name : string) {
        super(case_name,test_name)
        this.imageSize = new alvision.Size(1280, 800);
        this.K = new alvision.Matxd([558.478087865323, 0, 620.458515360843,
            0, 560.506767351568, 381.939424848348,
            0, 0, 1]);

        this.D = new alvision.Vec4d([-0.0014613319981768, -0.00329861110580401, 0.00605760088590183, -0.00374209380722371]);

        this.R = new alvision.Matxd([9.9756700084424932e-01, 6.9698277640183867e-02, 1.4929569991321144e-03,
            -6.9711825162322980e-02, 9.9748249845531767e-01, 1.2997180766418455e-02,
            -5.8331736398316541e-04, -1.3069635393884985e-02, 9.9991441852366736e-01]);

        this.T = new alvision.Vec4d([-9.9217369356044638e-02, 3.1741831972356663e-03, 1.8551007952921010e-04]);





    }

     SetUp(): void {
        this.datasets_repository_path = this.combine(alvision.cvtest.TS.ptr().get_data_path(), "cv/cameracalibration/fisheye");
    }

    //protected:
     combine(_item1: string, _item2: string): string {
         let item1 = _item1, item2 = _item2;
         item1 = item1.replace(/[\\]/g, "/");
         item2 = item2.replace(/[\\]/g, "/");
         //std::replace(item1.begin(), item1.end(), '\\', '/');
         //std::replace(item2.begin(), item2.end(), '\\', '/');

         if (item1 == "")
             return item2;

         if (item2 == "")
             return item1;

         let last = item1[item1.length - 1];
         return item1 + (last != '/' ? "/" : "") + item2;
     };
     mergeRectification(l: alvision.Mat, r: alvision.Mat): alvision.Mat {
         alvision.CV_Assert(()=>l.type() == r.type() && l.size() == r.size());
         let merged = new alvision.Mat (l.rows(), l.cols().valueOf() * 2, l.type());
         let lpart = merged.colRange(0, l.cols());
         let rpart = merged.colRange(l.cols(), merged.cols());
         l.copyTo(lpart);
         r.copyTo(rpart);

         for (let i = 0; i < l.rows(); i += 20)
         alvision.line(merged, new alvision.Point(0, i), new alvision.Point(merged.cols(), i), new alvision.Scalar(0, 255, 0));

         return merged;

     }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///  TESTS::

class fisheyeTest_projectPoints extends fisheyeTest
 //TEST_F(fisheyeTest, projectPoints)
{
    TestBody(): void {
        let cols = this.imageSize.width,
            rows = this.imageSize.height;

        const N = 20;
        let distorted0 = new alvision.Mat(1, N * N, alvision.MatrixType.CV_64FC2), undist1 = new alvision.Mat(), undist2 = new alvision.Mat(), distorted1 = new alvision.Mat(), distorted2 = new alvision.Mat ();

        undist2.create(distorted0.size(), alvision.MatrixType.CV_MAKETYPE(distorted0.depth(), 3));
        let pts = distorted0.ptr<alvision.Vec2d>("Vec2d");

        let c = new alvision.Vec2d(this.K.at(0, 2).get(), this.K.at(1, 2).get());
        for (let y = 0, k = 0; y < N; ++y)
        for (let x = 0; x < N; ++x)
        {
            let point = new alvision.Vec2d(x * cols.valueOf() / (N - 1.), y * rows.valueOf() / (N - 1.));
            pts[k++] = <alvision.Vec2d>(point.op_Substraction(c)).op_Multiplication(0.85).op_Addition( c);
        }

        alvision.fisheye.undistortPoints(distorted0, undist1, this.K, this.D);

        let u1 = undist1.ptr<alvision.Vec2d>("Vec2d");
        let u2 = undist2.ptr<alvision.Vec3d>("Vec3d");
        for (let i = 0; i < distorted0.total(); ++i)
        u2[i] = new alvision.Vec3d(u1[i][0], u1[i][1], 1.0);

        alvision.fisheye.distortPoints(undist1, distorted1, this.K, this.D);
        alvision.fisheye.projectPoints(undist2, distorted2, alvision.Vec3d.all(0), alvision.Vec3d.all(0), this.K, this.D);

        alvision.EXPECT_MAT_NEAR(distorted0, distorted1, 1e-10);
        alvision.EXPECT_MAT_NEAR(distorted0, distorted2, 1e-10);
    }
}

class fisheyeTest_DISABLED_undistortImage extends fisheyeTest
//TEST_F(fisheyeTest, DISABLED_undistortImage)
{
    TestBody(): void {
        let K = this.K;
        let D = new alvision.Mat(this.D);
        let file = this.combine(this.datasets_repository_path, "/calib-3_stereo_from_JY/left/stereo_pair_014.jpg");
        let newK = K;
        let distorted = alvision.imread(file), undistorted = new alvision.Mat();
        {
            newK.at(0, 0).set(100);
            newK.at(1, 1).set(100);
            alvision.fisheye.undistortImage(distorted, undistorted, K, D, newK);
            let correct = alvision.imread(this.combine(this.datasets_repository_path, "new_f_100.png"));
            if (correct.empty())
                alvision.CV_Assert(()=>alvision.imwrite(this.combine(this.datasets_repository_path, "new_f_100.png"), undistorted));
            else
                alvision.EXPECT_MAT_NEAR(correct, undistorted, 1e-10);
        }
        {
            let balance = 1.0;
            alvision.fisheye.estimateNewCameraMatrixForUndistortRectify(K, D, distorted.size(), null, newK, balance);
            alvision.fisheye.undistortImage(distorted, undistorted, K, D, newK);
            let correct = alvision.imread(this.combine(this.datasets_repository_path, "balance_1.0.png"));
            if (correct.empty())
                alvision.CV_Assert(()=>alvision.imwrite(this.combine(this.datasets_repository_path, "balance_1.0.png"), undistorted));
            else
                alvision.EXPECT_MAT_NEAR(correct, undistorted, 1e-10);
        }

        {
            let balance = 0.0;
            alvision.fisheye.estimateNewCameraMatrixForUndistortRectify(K, D, distorted.size(), null, newK, balance);
            alvision.fisheye.undistortImage(distorted, undistorted, K, D, newK);
            let correct = alvision.imread(this.combine(this.datasets_repository_path, "balance_0.0.png"));
            if (correct.empty())
                alvision.CV_Assert(()=>alvision.imwrite(this.combine(this.datasets_repository_path, "balance_0.0.png"), undistorted));
            else
                alvision.EXPECT_MAT_NEAR(correct, undistorted, 1e-10);
        }
    }
}

class fisheyeTest_jacobians extends fisheyeTest
//TEST_F(fisheyeTest, jacobians)
{
    TestBody(): void {
        let n = 10;
        let X  = new alvision.Mat(1, n, alvision.MatrixType.CV_64FC3);
        let om = new alvision.Mat(3, 1, alvision.MatrixType.CV_64F), T = new alvision.Mat(3, 1, alvision.MatrixType.CV_64F);
        let f  = new alvision.Mat(2, 1, alvision.MatrixType.CV_64F), c = new alvision.Mat(2, 1, alvision.MatrixType.CV_64F);
        let k  = new alvision.Mat(4, 1, alvision.MatrixType.CV_64F);
        //double alpha;

        let r = new alvision.RNG();

        r.fill(X,  alvision.DistType.NORMAL, 2, 1);
        X = alvision.MatExpr.abs(X).op_Multiplication(10).toMat();

        r.fill(om, alvision.DistType.NORMAL, 0, 1);
        om = alvision.MatExpr.abs(om).toMat();

        r.fill(T, alvision.DistType.NORMAL, 0, 1);
        T = alvision.MatExpr.abs(T).toMat(); T.at<alvision.double>("double", 2).set(4); T = alvision.MatExpr.op_Multiplication(T, 10).toMat();

        r.fill(f, alvision.DistType.NORMAL, 0, 1);
        f = alvision.MatExpr.abs(f).op_Multiplication(1000).toMat();

        r.fill(c, alvision.DistType.NORMAL, 0, 1);
        c = alvision.MatExpr.abs(c).op_Multiplication(1000).toMat();

        r.fill(k, alvision.DistType.NORMAL, 0, 1);
        k = alvision.MatExpr.op_Multiplication(k, 0.5).toMat();

        let alpha = 0.01 * r.gaussian(1).valueOf();

        let x1 = new alvision.Mat(), x2 = new alvision.Mat(), xpred = new alvision.Mat ();
        let K = new alvision.Matxd(f.at<alvision.double>("double",0).get(), alpha * f.at<alvision.double>("double",0).get().valueOf(), c.at<alvision.double>("double",0).get(),
        0, f.at<alvision.double>("double",1).get(), c.at<alvision.double>("double",1).get(),
        0, 0, 1);

        let jacobians = new alvision.Mat();
        alvision.fisheye.projectPoints(X, x1, om, T, K, k, alpha, jacobians);

    //test on T:
        let dT = new alvision.Mat (3, 1,alvision.MatrixType. CV_64FC1);
        r.fill(dT, alvision.DistType.NORMAL, 0, 1);
        dT = alvision.MatExpr.op_Multiplication(dT, 1e-9).op_Multiplication(alvision.norm(T)).toMat();
        let T2 = alvision.MatExpr.op_Addition( T , dT).toMat();
        alvision.fisheye.projectPoints(X, x2, om, T2, K, k, alpha, null);
        xpred = alvision.MatExpr.op_Addition(x1, new alvision.Mat(alvision.MatExpr.op_Multiplication(jacobians.colRange(11, 14), dT)).reshape(2, 1)).toMat();
        alvision.CV_Assert(()=>alvision.norm(alvision.MatExpr.op_Substraction( x2 , xpred)) < 1e-10);

    //test on om:
        let dom = new alvision.Mat(3, 1,alvision.MatrixType. CV_64FC1);
        r.fill(dom, alvision.DistType.NORMAL, 0, 1);
        dom = alvision.MatExpr.op_Multiplication(dom, 1e-9).op_Multiplication(alvision.norm(om)).toMat();
        let om2 = alvision.MatExpr.op_Addition(om, dom);
        alvision.fisheye.projectPoints(X, x2, om2, T, K, k, alpha, null);
        xpred = alvision.MatExpr.op_Addition(x1, new alvision.Mat(alvision.MatExpr.op_Multiplication(jacobians.colRange(8, 11), dom).toMat()).reshape(2, 1)).toMat();
        alvision.CV_Assert(()=>alvision.norm(alvision.MatExpr.op_Substraction( x2 ,xpred).toMat()) < 1e-10);

    //test on f:
        let df = new alvision.Mat (2, 1,alvision.MatrixType. CV_64FC1);
        r.fill(df, alvision.DistType.NORMAL, 0, 1);
        df = alvision.MatExpr.op_Multiplication(df, 1e-9).op_Multiplication(alvision.norm(f)).toMat();
        let K2 = K.op_Addition(new alvision.Matxd(df.at<alvision.double>("double",0).get(), df.at<alvision.double>("double",0).get().valueOf() * alpha, 0, 0, df.at<alvision.double>("double",1).get(), 0, 0, 0, 0));
        alvision.fisheye.projectPoints(X, x2, om, T, K2, k, alpha, null);
        xpred = alvision.MatExpr.op_Addition(x1, new alvision.Mat(alvision.MatExpr.op_Multiplication(jacobians.colRange(0, 2), df).toMat()).reshape(2, 1)).toMat();
        alvision.CV_Assert(()=>alvision.norm(alvision.MatExpr.op_Substraction( x2 , xpred).toMat()) < 1e-10);

    //test on c:
        let dc = new alvision.Mat(2, 1,alvision.MatrixType. CV_64FC1);
        r.fill(dc, alvision.DistType.NORMAL, 0, 1);
        dc = alvision.MatExpr.op_Multiplication(dc, 1e-9).op_Multiplication(alvision.norm(c).valueOf()).toMat();
        K2 = K.op_Addition( new alvision.Matxd(0, 0, dc.at<alvision.double>("double", 0).get(), 0, 0, dc.at<alvision.double>("double", 1).get(), 0, 0, 0))
        alvision.fisheye.projectPoints(X, x2, om, T, K2, k, alpha, null);
        xpred = alvision.MatExpr.op_Addition(x1, new alvision.Mat(alvision.MatExpr.op_Multiplication(jacobians.colRange(2, 4), dc).toMat()).reshape(2, 1)).toMat();
        alvision.CV_Assert(()=>alvision.norm(alvision.MatExpr.op_Substraction( x2 , xpred).toMat()) < 1e-10);

    //test on k:
        let dk = new alvision.Mat(4, 1,alvision.MatrixType. CV_64FC1);
        r.fill(dk, alvision.DistType.NORMAL, 0, 1);
        dk = alvision.MatExpr.op_Multiplication(dk, 1e-9).op_Multiplication(alvision.norm(k)).toMat();
        let k2 = alvision.MatExpr.op_Addition(k, dk).toMat();
        alvision.fisheye.projectPoints(X, x2, om, T, K, k2, alpha, null);
        xpred = alvision.MatExpr.op_Addition(x1, alvision.MatExpr.op_Multiplication(jacobians.colRange(4, 8), dk).toMat().reshape(2, 1)).toMat();
        alvision.CV_Assert(()=>alvision.norm(alvision.MatExpr.op_Substraction( x2 , xpred).toMat()) < 1e-10);

    //test on alpha:
        let dalpha = new alvision.Mat (1, 1,alvision.MatrixType. CV_64FC1);
        r.fill(dalpha, alvision.DistType.NORMAL, 0, 1);
        dalpha = alvision.MatExpr.op_Multiplication(dalpha, 1e-9).op_Multiplication(alvision.norm(f)).toMat();
        let alpha2 = alpha + dalpha.at<alvision.double>("double",0).get().valueOf();
        K2 = K.op_Addition( new alvision.Matxd(0, f.at<alvision.double>("double",0).get().valueOf() * dalpha.at<alvision.double>("double", 0).get().valueOf(), 0, 0, 0, 0, 0, 0, 0));
        alvision.fisheye.projectPoints(X, x2, om, T, K, k, alpha2, null);
        xpred = alvision.MatExpr.op_Addition(x1, alvision.MatExpr.op_Multiplication(jacobians.col(14), dalpha).toMat().reshape(2, 1)).toMat();
        alvision.CV_Assert(()=>alvision.norm(alvision.MatExpr.op_Substraction(x2 , xpred).toMat()) < 1e-10);
    }
}

class fisheyeTest_Calibration extends fisheyeTest
//TEST_F(fisheyeTest, Calibration)
{
    TestBody(): void {
        const n_images = 34;

        let  imagePoints  = new Array < Array < alvision.Point2d > >(n_images);
        let objectPoints = new Array<Array<alvision.Point3d>>(n_images);

        const folder = this.combine(this.datasets_repository_path, "calib-3_stereo_from_JY");
        let fs_left = new alvision.FileStorage(this.combine(folder, "left.xml"), alvision.FileStorageMode.READ);
        alvision.CV_Assert(()=>fs_left.isOpened());
        for (let i = 0; i < n_images; ++i)
            fs_left.nodes[util.format("image_%d", i)].readPoint2d(imagePoints[i]);
        fs_left.release();

        let fs_object = new alvision.FileStorage (this.combine(folder, "object.xml"), alvision.FileStorageMode.READ);
        alvision.CV_Assert(()=>fs_object.isOpened());
        for (let i = 0; i < n_images; ++i)
            fs_object.nodes[util.format("image_%d", i)].readPoint3d(objectPoints[i]);
        fs_object.release();

        let flag = 0;
        flag |= alvision.fisheye.FISHEYE_CALIB.CALIB_RECOMPUTE_EXTRINSIC;
        flag |= alvision.fisheye.FISHEYE_CALIB.CALIB_CHECK_COND;
        flag |= alvision.fisheye.FISHEYE_CALIB.CALIB_FIX_SKEW;

        let K = new alvision.Matxd();
        let D = new alvision.Vec4d();

        alvision.fisheye.calibrate(objectPoints, imagePoints, this.imageSize, K, D,
            null, null, flag,new alvision.TermCriteria(3, 20, 1e-6));

        alvision.EXPECT_MAT_NEAR(K, this.K, 1e-10);
        alvision.EXPECT_MAT_NEAR(D, this.D, 1e-10);
    }
}

class fisheyeTest_Homography extends fisheyeTest
//TEST_F(fisheyeTest, Homography)
{
    TestBody(): void {
        const  n_images = 1;

        let imagePoints  = new Array < Array < alvision.Point2d > >(n_images);
        let objectPoints = new Array<Array<alvision.Point3d>>(n_images);

        const folder = this.combine(this.datasets_repository_path, "calib-3_stereo_from_JY");
        let fs_left = new alvision.FileStorage (this.combine(folder, "left.xml"), alvision.FileStorageMode.READ);
        alvision.CV_Assert(()=>fs_left.isOpened());
        for (let i = 0; i < n_images; ++i)
            fs_left.nodes[util.format("image_%d", i)].readPoint2d(imagePoints[i]);
        fs_left.release();

        let fs_object = new alvision.FileStorage (this.combine(folder, "object.xml"), alvision.FileStorageMode.READ);
        alvision.CV_Assert(()=>fs_object.isOpened());
        for (let i = 0; i < n_images; ++i)
            fs_object.nodes[util.format("image_%d", i)].readPoint3d(objectPoints[i]);
        fs_object.release();

        let param = new alvision.IntrinsicParams();
        param.Init(new alvision.Vec2d(Math.max(this.imageSize.width.valueOf(), this.imageSize.height.valueOf()) / Math.PI, Math.max(this.imageSize.width.valueOf(), this.imageSize.height.valueOf()) / Math.PI),
            new alvision.Vec2d(this.imageSize.width.valueOf() / 2.0 - 0.5, this.imageSize.height.valueOf() / 2.0 - 0.5));

        let _imagePoints  = new alvision.Mat(imagePoints[0]);
        let _objectPoints = new alvision.Mat(objectPoints[0]);

        let imagePointsNormalized = alvision.NormalizePixels(_imagePoints, param).reshape(1).t().toMat();
        _objectPoints = _objectPoints.reshape(1).t().toMat();
        let objectPointsMean = new alvision.Mat();
        let covObjectPoints = new alvision.Mat();

        let Np = imagePointsNormalized.cols();
        alvision.calcCovarMatrix(_objectPoints, covObjectPoints, objectPointsMean, alvision.CovarFlags.COVAR_NORMAL | alvision.CovarFlags.COVAR_COLS);
        let svd = new alvision.SVD (covObjectPoints);
        let R = new alvision.Mat (svd.vt);

        if (alvision.norm(R.roi(new alvision.Rect(2, 0, 1, 2))) < 1e-6)
            R = alvision.Mat.eye(3, 3, alvision.MatrixType.CV_64FC1).toMat();
        if (alvision.determinant(R) < 0)
            R = alvision.MatExpr.op_Substraction(R).toMat();

        let T = alvision.MatExpr.op_Substraction(R).op_Multiplication(objectPointsMean).toMat();
        let X_new = alvision.MatExpr.op_Multiplication(R, _objectPoints).op_Addition(alvision.MatExpr.op_Multiplication(T, alvision.Mat.ones(1, Np, alvision.MatrixType.CV_64FC1))).toMat();
        let H = alvision.ComputeHomography(imagePointsNormalized, X_new.rowRange(0, 2));

        let M = alvision.Mat.ones(3, X_new.cols(),alvision.MatrixType. CV_64FC1).toMat();
        X_new.rowRange(0, 2).copyTo(M.rowRange(0, 2));
        let mrep = alvision.MatExpr.op_Multiplication(H, M).toMat();

        alvision.divide(mrep, alvision.Mat.ones(3, 1,alvision.MatrixType. CV_64FC1).op_Multiplication( mrep.row(2).clone()).toMat(), mrep);

        let merr = alvision.MatExpr.op_Substraction(mrep.rowRange(0, 2), imagePointsNormalized).toMat().t().toMat();

        let std_err = new alvision.Vec2d();
        alvision.meanStdDev(merr.reshape(2), null, std_err);
        std_err = <alvision.Vec2d>std_err.op_Multiplication(Math.sqrt(merr.reshape(2).total().valueOf() / (merr.reshape(2).total().valueOf() - 1)));

        let correct_std_err = new alvision.Vec2d (0.00516740156010384, 0.00644205331553901);
        alvision.EXPECT_MAT_NEAR(std_err, correct_std_err, 1e-12);
    }
}

class fisheyeTest_EtimateUncertainties extends fisheyeTest
//TEST_F(fisheyeTest, EtimateUncertainties)
{
    TestBody(): void {
        const n_images = 34;

    let imagePoints  = new Array<Array < alvision.Point2d > >   (n_images);
    let objectPoints = new Array<Array<alvision.Point3d>> (n_images);

    const folder = this.combine(this.datasets_repository_path, "calib-3_stereo_from_JY");
    let fs_left = new alvision.FileStorage (this.combine(folder, "left.xml"), alvision.FileStorageMode.READ);
    alvision.CV_Assert(()=>fs_left.isOpened());
    for (let i = 0; i < n_images; ++i)
        fs_left.nodes[util.format("image_%d", i)].readPoint2d(imagePoints[i]);
    fs_left.release();

    let fs_object = new alvision.FileStorage (this.combine(folder, "object.xml"), alvision.FileStorageMode.READ);
    alvision.CV_Assert(()=>fs_object.isOpened());
    for (let i = 0; i < n_images; ++i)
        fs_object.nodes[util.format("image_%d", i)].readPoint3d(objectPoints[i]);
    fs_object.release();

    let flag = 0;
    flag |= alvision.fisheye.FISHEYE_CALIB.CALIB_RECOMPUTE_EXTRINSIC;
    flag |= alvision.fisheye.FISHEYE_CALIB.CALIB_CHECK_COND;
    flag |= alvision.fisheye.FISHEYE_CALIB.CALIB_FIX_SKEW;

    let K = new alvision.Matxd();
    let D = new alvision.Vec4d();
    let rvec = new Array < alvision.Vec3d > ();
    let tvec = new Array < alvision.Vec3d > ();

    alvision.fisheye.calibrate(objectPoints, imagePoints, this.imageSize, K, D,
        rvec, tvec, flag, new alvision.TermCriteria(3, 20, 1e-6));

    let param = new alvision.IntrinsicParams(), errors = new alvision.IntrinsicParams (); 
    let err_std = new alvision.Vec2d();
    let thresh_cond = 1e6;
    let check_cond = 1;
    param.Init(new alvision.Vec2d(K.at(0, 0).get(), K.at(1, 1).get()),new alvision.Vec2d(K.at(0, 2).get(), K.at(1, 2).get()), D);
    param.isEstimate = Array<alvision.int>(9, 1);
    param.isEstimate[4] = 0;

    errors.isEstimate = param.isEstimate;

    //double rms;
    let rms: alvision.double;

    alvision.EstimateUncertainties(objectPoints, imagePoints, param, rvec, tvec,
        errors, err_std, thresh_cond, check_cond, (rms_) => { rms = rms_; });

    alvision.EXPECT_MAT_NEAR(errors.f, new alvision.Vec2d(1.29837104202046, 1.31565641071524), 1e-10);
    alvision.EXPECT_MAT_NEAR(errors.c, new alvision.Vec2d(0.890439368129246, 0.816096854937896), 1e-10);
    alvision.EXPECT_MAT_NEAR(errors.k, new alvision.Vec4d(0.00516248605191506, 0.0168181467500934, 0.0213118690274604, 0.00916010877545648), 1e-10);
    alvision.EXPECT_MAT_NEAR(err_std,  new alvision.Vec2d(0.187475975266883, 0.185678953263995), 1e-10);
    alvision.CV_Assert(()=>Math.abs(rms.valueOf() - 0.263782587133546) < 1e-10);
    alvision.CV_Assert(()=>errors.alpha == 0);
}
}

class fisheyeTest_rectify extends fisheyeTest
//TEST_F(fisheyeTest, rectify)
{
    TestBody(): void {
        const  folder = this.combine(this.datasets_repository_path, "calib-3_stereo_from_JY");

        let calibration_size = this.imageSize, requested_size = calibration_size;
        let K1 = this.K, K2 = K1;
        let D1 = new alvision.Mat(this.D), D2 = D1;

        let T = this.T;
        let R = this.R;

        let balance = 0.0, fov_scale = 1.1;
        
        let R1 = new alvision.Mat();
        let R2 = new alvision.Mat();
        let P1 = new alvision.Mat();
        let P2 = new alvision.Mat();
        let Q = new alvision.Mat();
        alvision.fisheye.stereoRectify(K1, D1, K2, D2, calibration_size, R, T, R1, R2, P1, P2, Q,
            alvision.CALIB.CALIB_ZERO_DISPARITY, requested_size, balance, fov_scale);

        let lmapx = new alvision.Mat();
        let     lmapy = new alvision.Mat();
        let     rmapx = new alvision.Mat();
        let     rmapy = new alvision.Mat();
        //rewrite for fisheye
        alvision.fisheye.initUndistortRectifyMap(K1, D1, R1, P1, requested_size,alvision.MatrixType. CV_32F, lmapx, lmapy);
    alvision.fisheye.initUndistortRectifyMap(K2, D2, R2, P2, requested_size,alvision.MatrixType. CV_32F, rmapx, rmapy);

    let l = new alvision.Mat();
        let r        = new alvision.Mat();
        let lundist  = new alvision.Mat();
        let rundist  = new alvision.Mat();
    let lcap = new alvision.VideoCapture (this.combine(folder, "left/stereo_pair_%03d.jpg")),
        rcap = new alvision.VideoCapture (this.combine(folder, "right/stereo_pair_%03d.jpg"));

    for (let i = 0;; ++i)
    {

        //lcap >> l; rcap >> r;
        if (lcap.grab()) {
            lcap.read(l);
        }

        if (rcap.grab()) {
            rcap.read(r);
        }


        if (l.empty() || r.empty())
            break;

        let ndisp = 128;
        alvision.rectangle(l, new alvision.Rect(255, 0, 829, l.rows().valueOf() - 1), new alvision.Scalar(0, 0, 255));
        alvision.rectangle(r, new alvision.Rect(255, 0, 829, l.rows().valueOf() - 1), new alvision.Scalar(0, 0, 255));
        alvision.rectangle(r, new alvision.Rect(255 - ndisp, 0, 829 + ndisp, l.rows().valueOf() - 1), new alvision.Scalar(0, 0, 255));
        alvision.remap(l, lundist, lmapx, lmapy, alvision.InterpolationFlags.INTER_LINEAR);
        alvision.remap(r, rundist, rmapx, rmapy, alvision.InterpolationFlags.INTER_LINEAR);

        let rectification = this.mergeRectification(lundist, rundist);

        let correct = alvision.imread(this.combine(this.datasets_repository_path, util.format("rectification_AB_%03d.png", i)));

        if (correct.empty())
            alvision.imwrite(this.combine(this.datasets_repository_path, util.format("rectification_AB_%03d.png", i)), rectification);
        else
            alvision.EXPECT_MAT_NEAR(correct, rectification, 1e-10);
    }
}
}

class fisheyeTest_stereoCalibrate extends fisheyeTest
//TEST_F(fisheyeTest, stereoCalibrate)
{
    TestBody(): void {
        const n_images = 34;

        const folder = this.combine(this.datasets_repository_path, "calib-3_stereo_from_JY");

    let leftPoints   = new Array<Array < alvision.Point2d > >   (n_images);
    let rightPoints  = new Array < Array < alvision.Point2d > > (n_images);
    let objectPoints = new Array<Array<alvision.Point3d>> (n_images);

    let fs_left = new alvision.FileStorage (this.combine(folder, "left.xml"), alvision.FileStorageMode.READ);
    alvision.CV_Assert(()=>fs_left.isOpened());
    for (let i = 0; i < n_images; ++i)
        fs_left.nodes[util.format("image_%d", i)].readPoint2d(leftPoints[i]);
    fs_left.release();

    let fs_right = new alvision.FileStorage (this.combine(folder, "right.xml"), alvision.FileStorageMode.READ);
    alvision.CV_Assert(()=>fs_right.isOpened());
    for (let i = 0; i < n_images; ++i)
        fs_right.nodes[util.format("image_%d", i)].readPoint2d(rightPoints[i]);
    fs_right.release();

    let fs_object = new alvision.FileStorage (this.combine(folder, "object.xml"), alvision.FileStorageMode.READ);
    alvision.CV_Assert(()=>fs_object.isOpened());
    for (let i = 0; i < n_images; ++i)
        fs_object.nodes[util.format("image_%d", i)].readPoint3d(objectPoints[i]);
    fs_object.release();

    let K1 = new alvision.Matxd(), K2 = new alvision.Matxd(), R = new alvision.Matxd ();
    let T = new alvision.Vec3d ();
    let D1 = new alvision.Vec4d(), D2 = new alvision.Vec4d ();

    let flag = 0;
    flag |= alvision.fisheye.FISHEYE_CALIB.CALIB_RECOMPUTE_EXTRINSIC;
    flag |= alvision.fisheye.FISHEYE_CALIB.CALIB_CHECK_COND;
    flag |= alvision.fisheye.FISHEYE_CALIB.CALIB_FIX_SKEW;
    // flag |= alvision.fisheye.FISHEYE_CALIB.CALIB_FIX_INTRINSIC;

    alvision.fisheye.stereoCalibrate(objectPoints, leftPoints, rightPoints,
        K1, D1, K2, D2, this.imageSize, R, T, flag,
        new alvision.TermCriteria(3, 12, 0));

    let R_correct = new alvision.Matxd (0.9975587205950972, 0.06953016383322372, 0.006492709911733523,
        -0.06956823121068059, 0.9975601387249519, 0.005833595226966235,
        -0.006071257768382089, -0.006271040135405457, 0.9999619062167968);
    let T_correct = new alvision.Vec3d (-0.099402724724121, 0.00270812139265413, 0.00129330292472699);
    let K1_correct = new alvision.Matxd (561.195925927249, 0, 621.282400272412,
        0, 562.849402029712, 380.555455380889,
        0, 0, 1);

    let K2_correct = new alvision.Matxd (560.395452535348, 0, 678.971652040359,
        0, 561.90171021422, 380.401340535339,
        0, 0, 1);

    let D1_correct = new alvision.Vec4d (-7.44253716539556e-05, -0.00702662033932424, 0.00737569823650885, -0.00342230256441771);
    let D2_correct = new alvision.Vec4d (-0.0130785435677431, 0.0284434505383497, -0.0360333869900506, 0.0144724062347222);

    alvision.EXPECT_MAT_NEAR(R, R_correct, 1e-10);
    alvision.EXPECT_MAT_NEAR(T, T_correct, 1e-10);

    alvision.EXPECT_MAT_NEAR(K1, K1_correct, 1e-10);
    alvision.EXPECT_MAT_NEAR(K2, K2_correct, 1e-10);

    alvision.EXPECT_MAT_NEAR(D1, D1_correct, 1e-10);
    alvision.EXPECT_MAT_NEAR(D2, D2_correct, 1e-10);
}
}

class fisheyeTest_stereoCalibrateFixIntrinsic extends fisheyeTest
//TEST_F(fisheyeTest, stereoCalibrateFixIntrinsic)
{
    TestBody(): void {
        const n_images = 34;

        const folder = this.combine(this.datasets_repository_path, "calib-3_stereo_from_JY");

        let leftPoints   = new Array < Array < alvision.Point2d > > (n_images);
        let rightPoints  = new Array < Array < alvision.Point2d > > (n_images);
        let objectPoints = new Array < Array < alvision.Point3d > > (n_images);

        let fs_left = new alvision.FileStorage (this.combine(folder, "left.xml"), alvision.FileStorageMode.READ);
        alvision.CV_Assert(()=>fs_left.isOpened());
        for (let i = 0; i < n_images; ++i)
            fs_left.nodes[util.format("image_%d", i)].readPoint2d(leftPoints[i]);
        fs_left.release();

        let fs_right = new alvision.FileStorage (this.combine(folder, "right.xml"), alvision.FileStorageMode.READ);
        alvision.CV_Assert(()=>fs_right.isOpened());
        for (let i = 0; i < n_images; ++i)
            fs_right.nodes[util.format("image_%d", i)].readPoint2d(rightPoints[i]);
        fs_right.release();

        let fs_object = new alvision.FileStorage (this.combine(folder, "object.xml"), alvision.FileStorageMode.READ);
        alvision.CV_Assert(()=>fs_object.isOpened());
        for (let i = 0; i < n_images; ++i)
            fs_object.nodes[util.format("image_%d", i)].readPoint3d(objectPoints[i]);
        fs_object.release();

        let R = new alvision.Matxd();
        let T = new alvision.Vec3d();

        let flag = 0; 
        flag |= alvision.fisheye.FISHEYE_CALIB.CALIB_RECOMPUTE_EXTRINSIC;
        flag |= alvision.fisheye.FISHEYE_CALIB.CALIB_CHECK_COND;
        flag |= alvision.fisheye.FISHEYE_CALIB.CALIB_FIX_SKEW;
        flag |= alvision.fisheye.FISHEYE_CALIB.CALIB_FIX_INTRINSIC;

        let K1 = new alvision.Matxd  (561.195925927249, 0, 621.282400272412,
            0, 562.849402029712, 380.555455380889,
            0, 0, 1);

        let K2 = new alvision.Matxd  (560.395452535348, 0, 678.971652040359,
            0, 561.90171021422, 380.401340535339,
            0, 0, 1);

        let D1 = new alvision.Vec4d  (-7.44253716539556e-05, -0.00702662033932424, 0.00737569823650885, -0.00342230256441771);
        let D2 = new alvision.Vec4d  (-0.0130785435677431, 0.0284434505383497, -0.0360333869900506, 0.0144724062347222);

        alvision.fisheye.stereoCalibrate(objectPoints, leftPoints, rightPoints,
            K1, D1, K2, D2, this.imageSize, R, T, flag,
            new alvision.TermCriteria(3, 12, 0));

        let R_correct = new alvision.Matxd(0.9975587205950972, 0.06953016383322372, 0.006492709911733523,
            -0.06956823121068059, 0.9975601387249519, 0.005833595226966235,
            -0.006071257768382089, -0.006271040135405457, 0.9999619062167968);
        let T_correct = new alvision.Vec3d (-0.099402724724121, 0.00270812139265413, 0.00129330292472699);


        alvision.EXPECT_MAT_NEAR(R, R_correct, 1e-10);
        alvision.EXPECT_MAT_NEAR(T, T_correct, 1e-10);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///  fisheyeTest::

//const alvision.Size fisheyeTest::imageSize(1280, 800);

//const alvision.Matx33d fisheyeTest::K(558.478087865323, 0, 620.458515360843,
//    0, 560.506767351568, 381.939424848348,
//    0, 0, 1);

//const alvision.Vec4d fisheyeTest::D(-0.0014613319981768, -0.00329861110580401, 0.00605760088590183, -0.00374209380722371);

//const alvision.Matx33d fisheyeTest::R ( 9.9756700084424932e-01, 6.9698277640183867e-02, 1.4929569991321144e-03,
//    -6.9711825162322980e-02, 9.9748249845531767e-01, 1.2997180766418455e-02,
//    -5.8331736398316541e-04, -1.3069635393884985e-02, 9.9991441852366736e-01);

//const alvision.Vec3d fisheyeTest::T(-9.9217369356044638e-02, 3.1741831972356663e-03, 1.8551007952921010e-04);


