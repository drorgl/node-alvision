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
import colors = require("colors");
import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');

#include "test_precomp.hpp"
#include <opencv2/ts/cuda_test.hpp>
#include "../src/fisheye.hpp"

class fisheyeTest : public ::testing::Test {

protected:
    const static alvision.Size imageSize;
    const static alvision.Matx33d K;
    const static alvision.Vec4d D;
    const static alvision.Matx33d R;
    const static alvision.Vec3d T;
    std::string datasets_repository_path;

    virtual void SetUp() {
        datasets_repository_path = combine(alvision.cvtest.TS.ptr().get_data_path(), "cv/cameracalibration/fisheye");
    }

protected:
    std::string combine(const std::string& _item1, const std::string& _item2);
    alvision.Mat mergeRectification(const alvision.Mat& l, const alvision.Mat& r);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///  TESTS::

TEST_F(fisheyeTest, projectPoints)
{
    double cols = this.imageSize.width,
           rows = this.imageSize.height;

    const int N = 20;
    alvision.Mat distorted0(1, N*N, CV_64FC2), undist1, undist2, distorted1, distorted2;
    undist2.create(distorted0.size(), CV_MAKETYPE(distorted0.depth(), 3));
    alvision.Vec2d* pts = distorted0.ptr<alvision.Vec2d>();

    alvision.Vec2d c(this.K(0, 2), this.K(1, 2));
    for(int y = 0, k = 0; y < N; ++y)
        for(int x = 0; x < N; ++x)
        {
            alvision.Vec2d point(x*cols/(N-1.f), y*rows/(N-1.f));
            pts[k++] = (point - c) * 0.85 + c;
        }

    alvision.fisheye::undistortPoints(distorted0, undist1, this.K, this.D);

    alvision.Vec2d* u1 = undist1.ptr<alvision.Vec2d>();
    alvision.Vec3d* u2 = undist2.ptr<alvision.Vec3d>();
    for(int i = 0; i  < (int)distorted0.total(); ++i)
        u2[i] = alvision.Vec3d(u1[i][0], u1[i][1], 1.0);

    alvision.fisheye::distortPoints(undist1, distorted1, this.K, this.D);
    alvision.fisheye::projectPoints(undist2, distorted2, alvision.Vec3d::all(0), alvision.Vec3d::all(0), this.K, this.D);

    EXPECT_MAT_NEAR(distorted0, distorted1, 1e-10);
    EXPECT_MAT_NEAR(distorted0, distorted2, 1e-10);
}

TEST_F(fisheyeTest, DISABLED_undistortImage)
{
    alvision.Matx33d K = this.K;
    alvision.Mat D = alvision.Mat(this.D);
    std::string file = combine(datasets_repository_path, "/calib-3_stereo_from_JY/left/stereo_pair_014.jpg");
    alvision.Matx33d newK = K;
    alvision.Mat distorted = alvision.imread(file), undistorted;
    {
        newK(0, 0) = 100;
        newK(1, 1) = 100;
        alvision.fisheye::undistortImage(distorted, undistorted, K, D, newK);
        alvision.Mat correct = alvision.imread(combine(datasets_repository_path, "new_f_100.png"));
        if (correct.empty())
            CV_Assert(alvision.imwrite(combine(datasets_repository_path, "new_f_100.png"), undistorted));
        else
            EXPECT_MAT_NEAR(correct, undistorted, 1e-10);
    }
    {
        double balance = 1.0;
        alvision.fisheye::estimateNewCameraMatrixForUndistortRectify(K, D, distorted.size(), alvision.noArray(), newK, balance);
        alvision.fisheye::undistortImage(distorted, undistorted, K, D, newK);
        alvision.Mat correct = alvision.imread(combine(datasets_repository_path, "balance_1.0.png"));
        if (correct.empty())
            CV_Assert(alvision.imwrite(combine(datasets_repository_path, "balance_1.0.png"), undistorted));
        else
            EXPECT_MAT_NEAR(correct, undistorted, 1e-10);
    }

    {
        double balance = 0.0;
        alvision.fisheye::estimateNewCameraMatrixForUndistortRectify(K, D, distorted.size(), alvision.noArray(), newK, balance);
        alvision.fisheye::undistortImage(distorted, undistorted, K, D, newK);
        alvision.Mat correct = alvision.imread(combine(datasets_repository_path, "balance_0.0.png"));
        if (correct.empty())
            CV_Assert(alvision.imwrite(combine(datasets_repository_path, "balance_0.0.png"), undistorted));
        else
            EXPECT_MAT_NEAR(correct, undistorted, 1e-10);
    }
}

TEST_F(fisheyeTest, jacobians)
{
    int n = 10;
    alvision.Mat X(1, n, CV_64FC3);
    alvision.Mat om(3, 1, CV_64F), T(3, 1, CV_64F);
    alvision.Mat f(2, 1, CV_64F), c(2, 1, CV_64F);
    alvision.Mat k(4, 1, CV_64F);
    double alpha;

    alvision.RNG r;

    r.fill(X, alvision.RNG::NORMAL, 2, 1);
    X = alvision.abs(X) * 10;

    r.fill(om, alvision.RNG::NORMAL, 0, 1);
    om = alvision.abs(om);

    r.fill(T, alvision.RNG::NORMAL, 0, 1);
    T = alvision.abs(T); T.at<double>(2) = 4; T *= 10;

    r.fill(f, alvision.RNG::NORMAL, 0, 1);
    f = alvision.abs(f) * 1000;

    r.fill(c, alvision.RNG::NORMAL, 0, 1);
    c = alvision.abs(c) * 1000;

    r.fill(k, alvision.RNG::NORMAL, 0, 1);
    k*= 0.5;

    alpha = 0.01*r.gaussian(1);

    alvision.Mat x1, x2, xpred;
    alvision.Matx33d K(f.at<double>(0), alpha * f.at<double>(0), c.at<double>(0),
                     0,            f.at<double>(1), c.at<double>(1),
                     0,            0,    1);

    alvision.Mat jacobians;
    alvision.fisheye::projectPoints(X, x1, om, T, K, k, alpha, jacobians);

    //test on T:
    alvision.Mat dT(3, 1, CV_64FC1);
    r.fill(dT, alvision.RNG::NORMAL, 0, 1);
    dT *= 1e-9*alvision.norm(T);
    alvision.Mat T2 = T + dT;
    alvision.fisheye::projectPoints(X, x2, om, T2, K, k, alpha, alvision.noArray());
    xpred = x1 + alvision.Mat(jacobians.colRange(11,14) * dT).reshape(2, 1);
    CV_Assert (alvision.norm(x2 - xpred) < 1e-10);

    //test on om:
    alvision.Mat dom(3, 1, CV_64FC1);
    r.fill(dom, alvision.RNG::NORMAL, 0, 1);
    dom *= 1e-9*alvision.norm(om);
    alvision.Mat om2 = om + dom;
    alvision.fisheye::projectPoints(X, x2, om2, T, K, k, alpha, alvision.noArray());
    xpred = x1 + alvision.Mat(jacobians.colRange(8,11) * dom).reshape(2, 1);
    CV_Assert (alvision.norm(x2 - xpred) < 1e-10);

    //test on f:
    alvision.Mat df(2, 1, CV_64FC1);
    r.fill(df, alvision.RNG::NORMAL, 0, 1);
    df *= 1e-9*alvision.norm(f);
    alvision.Matx33d K2 = K + alvision.Matx33d(df.at<double>(0), df.at<double>(0) * alpha, 0, 0, df.at<double>(1), 0, 0, 0, 0);
    alvision.fisheye::projectPoints(X, x2, om, T, K2, k, alpha, alvision.noArray());
    xpred = x1 + alvision.Mat(jacobians.colRange(0,2) * df).reshape(2, 1);
    CV_Assert (alvision.norm(x2 - xpred) < 1e-10);

    //test on c:
    alvision.Mat dc(2, 1, CV_64FC1);
    r.fill(dc, alvision.RNG::NORMAL, 0, 1);
    dc *= 1e-9*alvision.norm(c);
    K2 = K + alvision.Matx33d(0, 0, dc.at<double>(0), 0, 0, dc.at<double>(1), 0, 0, 0);
    alvision.fisheye::projectPoints(X, x2, om, T, K2, k, alpha, alvision.noArray());
    xpred = x1 + alvision.Mat(jacobians.colRange(2,4) * dc).reshape(2, 1);
    CV_Assert (alvision.norm(x2 - xpred) < 1e-10);

    //test on k:
    alvision.Mat dk(4, 1, CV_64FC1);
    r.fill(dk, alvision.RNG::NORMAL, 0, 1);
    dk *= 1e-9*alvision.norm(k);
    alvision.Mat k2 = k + dk;
    alvision.fisheye::projectPoints(X, x2, om, T, K, k2, alpha, alvision.noArray());
    xpred = x1 + alvision.Mat(jacobians.colRange(4,8) * dk).reshape(2, 1);
    CV_Assert (alvision.norm(x2 - xpred) < 1e-10);

    //test on alpha:
    alvision.Mat dalpha(1, 1, CV_64FC1);
    r.fill(dalpha, alvision.RNG::NORMAL, 0, 1);
    dalpha *= 1e-9*alvision.norm(f);
    double alpha2 = alpha + dalpha.at<double>(0);
    K2 = K + alvision.Matx33d(0, f.at<double>(0) * dalpha.at<double>(0), 0, 0, 0, 0, 0, 0, 0);
    alvision.fisheye::projectPoints(X, x2, om, T, K, k, alpha2, alvision.noArray());
    xpred = x1 + alvision.Mat(jacobians.col(14) * dalpha).reshape(2, 1);
    CV_Assert (alvision.norm(x2 - xpred) < 1e-10);
}

TEST_F(fisheyeTest, Calibration)
{
    const int n_images = 34;

    Array<Array<alvision.Point2d> > imagePoints(n_images);
    Array<Array<alvision.Point3d> > objectPoints(n_images);

    const std::string folder =combine(datasets_repository_path, "calib-3_stereo_from_JY");
    alvision.FileStorage fs_left(combine(folder, "left.xml"), alvision.FileStorage::READ);
    CV_Assert(fs_left.isOpened());
    for(int i = 0; i < n_images; ++i)
    fs_left[alvision.format("image_%d", i )] >> imagePoints[i];
    fs_left.release();

    alvision.FileStorage fs_object(combine(folder, "object.xml"), alvision.FileStorage::READ);
    CV_Assert(fs_object.isOpened());
    for(int i = 0; i < n_images; ++i)
    fs_object[alvision.format("image_%d", i )] >> objectPoints[i];
    fs_object.release();

    int flag = 0;
    flag |= alvision.fisheye::CALIB_RECOMPUTE_EXTRINSIC;
    flag |= alvision.fisheye::CALIB_CHECK_COND;
    flag |= alvision.fisheye::CALIB_FIX_SKEW;

    alvision.Matx33d K;
    alvision.Vec4d D;

    alvision.fisheye::calibrate(objectPoints, imagePoints, imageSize, K, D,
                           alvision.noArray(), alvision.noArray(), flag, alvision.TermCriteria(3, 20, 1e-6));

    EXPECT_MAT_NEAR(K, this.K, 1e-10);
    EXPECT_MAT_NEAR(D, this.D, 1e-10);
}

TEST_F(fisheyeTest, Homography)
{
    const int n_images = 1;

    Array<Array<alvision.Point2d> > imagePoints(n_images);
    Array<Array<alvision.Point3d> > objectPoints(n_images);

    const std::string folder =combine(datasets_repository_path, "calib-3_stereo_from_JY");
    alvision.FileStorage fs_left(combine(folder, "left.xml"), alvision.FileStorage::READ);
    CV_Assert(fs_left.isOpened());
    for(int i = 0; i < n_images; ++i)
    fs_left[alvision.format("image_%d", i )] >> imagePoints[i];
    fs_left.release();

    alvision.FileStorage fs_object(combine(folder, "object.xml"), alvision.FileStorage::READ);
    CV_Assert(fs_object.isOpened());
    for(int i = 0; i < n_images; ++i)
    fs_object[alvision.format("image_%d", i )] >> objectPoints[i];
    fs_object.release();

    alvision.internal::IntrinsicParams param;
    param.Init(alvision.Vec2d(alvision.max(imageSize.width, imageSize.height) / Math.PI, alvision.max(imageSize.width, imageSize.height) / Math.PI),
               alvision.Vec2d(imageSize.width  / 2.0 - 0.5, imageSize.height / 2.0 - 0.5));

    alvision.Mat _imagePoints (imagePoints[0]);
    alvision.Mat _objectPoints(objectPoints[0]);

    alvision.Mat imagePointsNormalized = NormalizePixels(_imagePoints, param).reshape(1).t();
    _objectPoints = _objectPoints.reshape(1).t();
    alvision.Mat objectPointsMean, covObjectPoints;

    int Np = imagePointsNormalized.cols;
    alvision.calcCovarMatrix(_objectPoints, covObjectPoints, objectPointsMean, alvision.COVAR_NORMAL | alvision.COVAR_COLS);
    alvision.SVD svd(covObjectPoints);
    alvision.Mat R(svd.vt);

    if (alvision.norm(R(alvision.Rect(2, 0, 1, 2))) < 1e-6)
        R = alvision.Mat::eye(3,3, CV_64FC1);
    if (alvision.determinant(R) < 0)
        R = -R;

    alvision.Mat T = -R * objectPointsMean;
    alvision.Mat X_new = R * _objectPoints + T * alvision.Mat::ones(1, Np, CV_64FC1);
    alvision.Mat H = alvision.internal::ComputeHomography(imagePointsNormalized, X_new.rowRange(0, 2));

    alvision.Mat M = alvision.Mat::ones(3, X_new.cols, CV_64FC1);
    X_new.rowRange(0, 2).copyTo(M.rowRange(0, 2));
    alvision.Mat mrep = H * M;

    alvision.divide(mrep, alvision.Mat::ones(3,1, CV_64FC1) * mrep.row(2).clone(), mrep);

    alvision.Mat merr = (mrep.rowRange(0, 2) - imagePointsNormalized).t();

    alvision.Vec2d std_err;
    alvision.meanStdDev(merr.reshape(2), alvision.noArray(), std_err);
    std_err *= sqrt((double)merr.reshape(2).total() / (merr.reshape(2).total() - 1));

    alvision.Vec2d correct_std_err(0.00516740156010384, 0.00644205331553901);
    EXPECT_MAT_NEAR(std_err, correct_std_err, 1e-12);
}

TEST_F(fisheyeTest, EtimateUncertainties)
{
    const int n_images = 34;

    Array<Array<alvision.Point2d> > imagePoints(n_images);
    Array<Array<alvision.Point3d> > objectPoints(n_images);

    const std::string folder =combine(datasets_repository_path, "calib-3_stereo_from_JY");
    alvision.FileStorage fs_left(combine(folder, "left.xml"), alvision.FileStorage::READ);
    CV_Assert(fs_left.isOpened());
    for(int i = 0; i < n_images; ++i)
    fs_left[alvision.format("image_%d", i )] >> imagePoints[i];
    fs_left.release();

    alvision.FileStorage fs_object(combine(folder, "object.xml"), alvision.FileStorage::READ);
    CV_Assert(fs_object.isOpened());
    for(int i = 0; i < n_images; ++i)
    fs_object[alvision.format("image_%d", i )] >> objectPoints[i];
    fs_object.release();

    int flag = 0;
    flag |= alvision.fisheye::CALIB_RECOMPUTE_EXTRINSIC;
    flag |= alvision.fisheye::CALIB_CHECK_COND;
    flag |= alvision.fisheye::CALIB_FIX_SKEW;

    alvision.Matx33d K;
    alvision.Vec4d D;
    Array<alvision.Vec3d> rvec;
    Array<alvision.Vec3d> tvec;

    alvision.fisheye::calibrate(objectPoints, imagePoints, imageSize, K, D,
                           rvec, tvec, flag, alvision.TermCriteria(3, 20, 1e-6));

    alvision.internal::IntrinsicParams param, errors;
    alvision.Vec2d err_std;
    double thresh_cond = 1e6;
    int check_cond = 1;
    param.Init(alvision.Vec2d(K(0,0), K(1,1)), alvision.Vec2d(K(0,2), K(1, 2)), D);
    param.isEstimate = Array<int>(9, 1);
    param.isEstimate[4] = 0;

    errors.isEstimate = param.isEstimate;

    double rms;

    alvision.internal::EstimateUncertainties(objectPoints, imagePoints, param,  rvec, tvec,
                                        errors, err_std, thresh_cond, check_cond, rms);

    EXPECT_MAT_NEAR(errors.f, alvision.Vec2d(1.29837104202046,  1.31565641071524), 1e-10);
    EXPECT_MAT_NEAR(errors.c, alvision.Vec2d(0.890439368129246, 0.816096854937896), 1e-10);
    EXPECT_MAT_NEAR(errors.k, alvision.Vec4d(0.00516248605191506, 0.0168181467500934, 0.0213118690274604, 0.00916010877545648), 1e-10);
    EXPECT_MAT_NEAR(err_std, alvision.Vec2d(0.187475975266883, 0.185678953263995), 1e-10);
    CV_Assert(fabs(rms - 0.263782587133546) < 1e-10);
    CV_Assert(errors.alpha == 0);
}

TEST_F(fisheyeTest, rectify)
{
    const std::string folder =combine(datasets_repository_path, "calib-3_stereo_from_JY");

    alvision.Size calibration_size = this.imageSize, requested_size = calibration_size;
    alvision.Matx33d K1 = this.K, K2 = K1;
    alvision.Mat D1 = alvision.Mat(this.D), D2 = D1;

    alvision.Vec3d T = this.T;
    alvision.Matx33d R = this.R;

    double balance = 0.0, fov_scale = 1.1;
    alvision.Mat R1, R2, P1, P2, Q;
    alvision.fisheye::stereoRectify(K1, D1, K2, D2, calibration_size, R, T, R1, R2, P1, P2, Q,
                      alvision.CALIB_ZERO_DISPARITY, requested_size, balance, fov_scale);

    alvision.Mat lmapx, lmapy, rmapx, rmapy;
    //rewrite for fisheye
    alvision.fisheye::initUndistortRectifyMap(K1, D1, R1, P1, requested_size, CV_32F, lmapx, lmapy);
    alvision.fisheye::initUndistortRectifyMap(K2, D2, R2, P2, requested_size, CV_32F, rmapx, rmapy);

    alvision.Mat l, r, lundist, rundist;
    alvision.VideoCapture lcap(combine(folder, "left/stereo_pair_%03d.jpg")),
                     rcap(combine(folder, "right/stereo_pair_%03d.jpg"));

    for(int i = 0;; ++i)
    {
        lcap >> l; rcap >> r;
        if (l.empty() || r.empty())
            break;

        int ndisp = 128;
        alvision.rectangle(l, alvision.Rect(255,       0, 829,       l.rows-1), alvision.Scalar(0, 0, 255));
        alvision.rectangle(r, alvision.Rect(255,       0, 829,       l.rows-1), alvision.Scalar(0, 0, 255));
        alvision.rectangle(r, alvision.Rect(255-ndisp, 0, 829+ndisp ,l.rows-1), alvision.Scalar(0, 0, 255));
        alvision.remap(l, lundist, lmapx, lmapy, alvision.INTER_LINEAR);
        alvision.remap(r, rundist, rmapx, rmapy, alvision.INTER_LINEAR);

        alvision.Mat rectification = mergeRectification(lundist, rundist);

        alvision.Mat correct = alvision.imread(combine(datasets_repository_path, alvision.format("rectification_AB_%03d.png", i)));

        if (correct.empty())
            alvision.imwrite(combine(datasets_repository_path, alvision.format("rectification_AB_%03d.png", i)), rectification);
         else
             EXPECT_MAT_NEAR(correct, rectification, 1e-10);
     }
}

TEST_F(fisheyeTest, stereoCalibrate)
{
    const int n_images = 34;

    const std::string folder =combine(datasets_repository_path, "calib-3_stereo_from_JY");

    Array<Array<alvision.Point2d> > leftPoints(n_images);
    Array<Array<alvision.Point2d> > rightPoints(n_images);
    Array<Array<alvision.Point3d> > objectPoints(n_images);

    alvision.FileStorage fs_left(combine(folder, "left.xml"), alvision.FileStorage::READ);
    CV_Assert(fs_left.isOpened());
    for(int i = 0; i < n_images; ++i)
    fs_left[alvision.format("image_%d", i )] >> leftPoints[i];
    fs_left.release();

    alvision.FileStorage fs_right(combine(folder, "right.xml"), alvision.FileStorage::READ);
    CV_Assert(fs_right.isOpened());
    for(int i = 0; i < n_images; ++i)
    fs_right[alvision.format("image_%d", i )] >> rightPoints[i];
    fs_right.release();

    alvision.FileStorage fs_object(combine(folder, "object.xml"), alvision.FileStorage::READ);
    CV_Assert(fs_object.isOpened());
    for(int i = 0; i < n_images; ++i)
    fs_object[alvision.format("image_%d", i )] >> objectPoints[i];
    fs_object.release();

    alvision.Matx33d K1, K2, R;
    alvision.Vec3d T;
    alvision.Vec4d D1, D2;

    int flag = 0;
    flag |= alvision.fisheye::CALIB_RECOMPUTE_EXTRINSIC;
    flag |= alvision.fisheye::CALIB_CHECK_COND;
    flag |= alvision.fisheye::CALIB_FIX_SKEW;
   // flag |= alvision.fisheye::CALIB_FIX_INTRINSIC;

    alvision.fisheye::stereoCalibrate(objectPoints, leftPoints, rightPoints,
                    K1, D1, K2, D2, imageSize, R, T, flag,
                    alvision.TermCriteria(3, 12, 0));

    alvision.Matx33d R_correct(   0.9975587205950972,   0.06953016383322372, 0.006492709911733523,
                           -0.06956823121068059,    0.9975601387249519, 0.005833595226966235,
                          -0.006071257768382089, -0.006271040135405457, 0.9999619062167968);
    alvision.Vec3d T_correct(-0.099402724724121, 0.00270812139265413, 0.00129330292472699);
    alvision.Matx33d K1_correct (561.195925927249,                0, 621.282400272412,
                                   0, 562.849402029712, 380.555455380889,
                                   0,                0,                1);

    alvision.Matx33d K2_correct (560.395452535348,                0, 678.971652040359,
                                   0,  561.90171021422, 380.401340535339,
                                   0,                0,                1);

    alvision.Vec4d D1_correct (-7.44253716539556e-05, -0.00702662033932424, 0.00737569823650885, -0.00342230256441771);
    alvision.Vec4d D2_correct (-0.0130785435677431, 0.0284434505383497, -0.0360333869900506, 0.0144724062347222);

    EXPECT_MAT_NEAR(R, R_correct, 1e-10);
    EXPECT_MAT_NEAR(T, T_correct, 1e-10);

    EXPECT_MAT_NEAR(K1, K1_correct, 1e-10);
    EXPECT_MAT_NEAR(K2, K2_correct, 1e-10);

    EXPECT_MAT_NEAR(D1, D1_correct, 1e-10);
    EXPECT_MAT_NEAR(D2, D2_correct, 1e-10);

}

TEST_F(fisheyeTest, stereoCalibrateFixIntrinsic)
{
    const int n_images = 34;

    const std::string folder =combine(datasets_repository_path, "calib-3_stereo_from_JY");

    Array<Array<alvision.Point2d> > leftPoints(n_images);
    Array<Array<alvision.Point2d> > rightPoints(n_images);
    Array<Array<alvision.Point3d> > objectPoints(n_images);

    alvision.FileStorage fs_left(combine(folder, "left.xml"), alvision.FileStorage::READ);
    CV_Assert(fs_left.isOpened());
    for(int i = 0; i < n_images; ++i)
    fs_left[alvision.format("image_%d", i )] >> leftPoints[i];
    fs_left.release();

    alvision.FileStorage fs_right(combine(folder, "right.xml"), alvision.FileStorage::READ);
    CV_Assert(fs_right.isOpened());
    for(int i = 0; i < n_images; ++i)
    fs_right[alvision.format("image_%d", i )] >> rightPoints[i];
    fs_right.release();

    alvision.FileStorage fs_object(combine(folder, "object.xml"), alvision.FileStorage::READ);
    CV_Assert(fs_object.isOpened());
    for(int i = 0; i < n_images; ++i)
    fs_object[alvision.format("image_%d", i )] >> objectPoints[i];
    fs_object.release();

    alvision.Matx33d R;
    alvision.Vec3d T;

    int flag = 0;
    flag |= alvision.fisheye::CALIB_RECOMPUTE_EXTRINSIC;
    flag |= alvision.fisheye::CALIB_CHECK_COND;
    flag |= alvision.fisheye::CALIB_FIX_SKEW;
    flag |= alvision.fisheye::CALIB_FIX_INTRINSIC;

    alvision.Matx33d K1 (561.195925927249,                0, 621.282400272412,
                                   0, 562.849402029712, 380.555455380889,
                                   0,                0,                1);

    alvision.Matx33d K2 (560.395452535348,                0, 678.971652040359,
                                   0,  561.90171021422, 380.401340535339,
                                   0,                0,                1);

    alvision.Vec4d D1 (-7.44253716539556e-05, -0.00702662033932424, 0.00737569823650885, -0.00342230256441771);
    alvision.Vec4d D2 (-0.0130785435677431, 0.0284434505383497, -0.0360333869900506, 0.0144724062347222);

    alvision.fisheye::stereoCalibrate(objectPoints, leftPoints, rightPoints,
                    K1, D1, K2, D2, imageSize, R, T, flag,
                    alvision.TermCriteria(3, 12, 0));

    alvision.Matx33d R_correct(   0.9975587205950972,   0.06953016383322372, 0.006492709911733523,
                           -0.06956823121068059,    0.9975601387249519, 0.005833595226966235,
                          -0.006071257768382089, -0.006271040135405457, 0.9999619062167968);
    alvision.Vec3d T_correct(-0.099402724724121, 0.00270812139265413, 0.00129330292472699);


    EXPECT_MAT_NEAR(R, R_correct, 1e-10);
    EXPECT_MAT_NEAR(T, T_correct, 1e-10);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///  fisheyeTest::

const alvision.Size fisheyeTest::imageSize(1280, 800);

const alvision.Matx33d fisheyeTest::K(558.478087865323,               0, 620.458515360843,
                              0, 560.506767351568, 381.939424848348,
                              0,               0,                1);

const alvision.Vec4d fisheyeTest::D(-0.0014613319981768, -0.00329861110580401, 0.00605760088590183, -0.00374209380722371);

const alvision.Matx33d fisheyeTest::R ( 9.9756700084424932e-01, 6.9698277640183867e-02, 1.4929569991321144e-03,
                            -6.9711825162322980e-02, 9.9748249845531767e-01, 1.2997180766418455e-02,
                            -5.8331736398316541e-04,-1.3069635393884985e-02, 9.9991441852366736e-01);

const alvision.Vec3d fisheyeTest::T(-9.9217369356044638e-02, 3.1741831972356663e-03, 1.8551007952921010e-04);

std::string fisheyeTest::combine(const std::string& _item1, const std::string& _item2)
{
    std::string item1 = _item1, item2 = _item2;
    std::replace(item1.begin(), item1.end(), '\\', '/');
    std::replace(item2.begin(), item2.end(), '\\', '/');

    if (item1.empty())
        return item2;

    if (item2.empty())
        return item1;

    char last = item1[item1.size()-1];
    return item1 + (last != '/' ? "/" : "") + item2;
}

alvision.Mat fisheyeTest::mergeRectification(const alvision.Mat& l, const alvision.Mat& r)
{
    CV_Assert(l.type() == r.type() && l.size() == r.size());
    alvision.Mat merged(l.rows, l.cols * 2, l.type());
    alvision.Mat lpart = merged.colRange(0, l.cols);
    alvision.Mat rpart = merged.colRange(l.cols, merged.cols);
    l.copyTo(lpart);
    r.copyTo(rpart);

    for(int i = 0; i < l.rows; i+=20)
        alvision.line(merged, alvision.Point(0, i), alvision.Point(merged.cols, i), alvision.Scalar(0, 255, 0));

    return merged;
}
