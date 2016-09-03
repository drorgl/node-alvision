//do not implement, legacy

///*M///////////////////////////////////////////////////////////////////////////////////////
////
////  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
////
////  By downloading, copying, installing or using the software you agree to this license.
////  If you do not agree to this license, do not download, install,
////  copy or use the software.
////
////
////                           License Agreement
////                For Open Source Computer Vision Library
////
//// Copyright (C) 2000-2008, Intel Corporation, all rights reserved.
//// Copyright (C) 2009, Willow Garage Inc., all rights reserved.
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
////   * The name of the copyright holders may not be used to endorse or promote products
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
////#if defined HAVE_CUDA && defined HAVE_OPENCV_CALIB3D
////
////#include "opencv2/calib3d.hpp"
////
////using namespace cvtest;

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//// transformPoints

//class TransformPoints : testing::TestWithParam<alvision.cuda.DeviceInfo>
//{
//    alvision.cuda.DeviceInfo devInfo;

//    virtual void SetUp()
//    {
//        devInfo = GetParam();

//        alvision.cuda.setDevice(this.devInfo.deviceID());
//    }
//};

//CUDA_TEST_P(TransformPoints, Accuracy)
//{
//    let src = alvision.randomMat(alvision.Size(1000, 1), alvision.MatrixType.CV_32FC3, 0, 10);
//    alvision.Mat rvec = alvision.randomMat(alvision.Size(3, 1), alvision.MatrixType.CV_32F, 0, 1);
//    alvision.Mat tvec = alvision.randomMat(alvision.Size(3, 1), alvision.MatrixType.CV_32F, 0, 1);

//    let dst = new alvision.cuda.GpuMat ();
//    alvision.cuda::transformPoints(alvision.loadMat(src), rvec, tvec, dst);

//    ASSERT_EQ(src.size(), dst.size());
//    ASSERT_EQ(src.type(), dst.type());

//    let h_dst = new alvision.Mat (dst);

//    alvision.Mat rot;
//    alvision.Rodrigues(rvec, rot);

//    for (let i = 0; i < h_dst.cols; ++i)
//    {
//        alvision.Point3f res = h_dst.at<alvision.Point3f>(0, i);

//        alvision.Point3f p = src.at<alvision.Point3f>(0, i);
//        alvision.Point3f res_gold(
//                rot.at<float>(0, 0) * p.x + rot.at<float>(0, 1) * p.y + rot.at<float>(0, 2) * p.z + tvec.at<float>(0, 0),
//                rot.at<float>(1, 0) * p.x + rot.at<float>(1, 1) * p.y + rot.at<float>(1, 2) * p.z + tvec.at<float>(0, 1),
//                rot.at<float>(2, 0) * p.x + rot.at<float>(2, 1) * p.y + rot.at<float>(2, 2) * p.z + tvec.at<float>(0, 2));

//        ASSERT_POINT3_NEAR(res_gold, res, 1e-5);
//    }
//}

//INSTANTIATE_TEST_CASE_P(CUDA_Calib3D, TransformPoints, ALL_DEVICES);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//// ProjectPoints

//struct ProjectPoints : testing::TestWithParam<alvision.cuda.DeviceInfo>
//{
//    alvision.cuda.DeviceInfo devInfo;

//    virtual void SetUp()
//    {
//        devInfo = GetParam();

//        alvision.cuda.setDevice(this.devInfo.deviceID());
//    }
//};

//CUDA_TEST_P(ProjectPoints, Accuracy)
//{
//    let src = alvision.randomMat(alvision.Size(1000, 1), alvision.MatrixType.CV_32FC3, 0, 10);
//    alvision.Mat rvec = alvision.randomMat(alvision.Size(3, 1),   alvision.MatrixType.CV_32F, 0, 1);
//    alvision.Mat tvec = alvision.randomMat(alvision.Size(3, 1), alvision.MatrixType.CV_32F, 0, 1);
//    alvision.Mat camera_mat = alvision.randomMat(alvision.Size(3, 3), alvision.MatrixType.CV_32F, 0.5, 1);
//    camera_mat.at<float>(0, 1) = 0.;
//    camera_mat.at<float>(1, 0) = 0.;
//    camera_mat.at<float>(2, 0) = 0.;
//    camera_mat.at<float>(2, 1) = 0.;

//    let dst = new alvision.cuda.GpuMat ();
//    alvision.cuda::projectPoints(alvision.loadMat(src), rvec, tvec, camera_mat, alvision.Mat(), dst);

//    ASSERT_EQ(1, dst.rows);
//    ASSERT_EQ(MatType(alvision.MatrixType.CV_32FC2), MatType(dst.type()));

//    Array<alvision.Point2f> dst_gold;
//    alvision.projectPoints(src, rvec, tvec, camera_mat, alvision.Mat(1, 8, CV_32F, alvision.Scalar.all(0)), dst_gold);

//    ASSERT_EQ(dst_gold.size(), static_cast<size_t>(dst.cols));

//    let h_dst = new alvision.Mat (dst);

//    for (size_t i = 0; i < dst_gold.size(); ++i)
//    {
//        alvision.Point2f res = h_dst.at<alvision.Point2f>(0, (int)i);
//        alvision.Point2f res_gold = dst_gold[i];

//        alvision.ASSERT_LE(alvision.norm(res_gold - res) / alvision.norm(res_gold), 1e-3f);
//    }
//}

//INSTANTIATE_TEST_CASE_P(CUDA_Calib3D, ProjectPoints, ALL_DEVICES);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//// SolvePnPRansac

//struct SolvePnPRansac : testing::TestWithParam<alvision.cuda.DeviceInfo>
//{
//    alvision.cuda.DeviceInfo devInfo;

//    virtual void SetUp()
//    {
//        devInfo = GetParam();

//        alvision.cuda.setDevice(this.devInfo.deviceID());
//    }
//};

//CUDA_TEST_P(SolvePnPRansac, Accuracy)
//{
//    alvision.Mat object = alvision.randomMat(alvision.Size(5000, 1), alvision.MatrixType.CV_32FC3, 0, 100);
//    alvision.Mat camera_mat = alvision.randomMat(alvision.Size(3, 3), alvision.MatrixType.CV_32F, 0.5, 1);
//    camera_mat.at<float>(0, 1) = 0.f;
//    camera_mat.at<float>(1, 0) = 0.f;
//    camera_mat.at<float>(2, 0) = 0.f;
//    camera_mat.at<float>(2, 1) = 0.f;

//    Array<alvision.Point2f> image_vec;
//    alvision.Mat rvec_gold;
//    alvision.Mat tvec_gold;
//    rvec_gold = alvision.randomMat(alvision.Size(3, 1), alvision.MatrixType.CV_32F, 0, 1);
//    tvec_gold = alvision.randomMat(alvision.Size(3, 1), alvision.MatrixType.CV_32F, 0, 1);
//    alvision.projectPoints(object, rvec_gold, tvec_gold, camera_mat, alvision.Mat(1, 8, alvision.MatrixType.CV_32F, alvision.Scalar.all(0)), image_vec);

//    alvision.Mat rvec, tvec;
//    Array<int> inliers;
//    alvision.cuda::solvePnPRansac(object, alvision.Mat(1, (int)image_vec.size(), alvision.MatrixType.CV_32FC2, &image_vec[0]),
//        camera_mat, alvision.Mat(1, 8, alvision.MatrixType.CV_32F, alvision.Scalar.all(0)),
//                            rvec, tvec, false, 200, 2., 100, &inliers);

//    alvision.ASSERT_LE(alvision.norm(rvec - rvec_gold), 1e-3);
//    alvision.ASSERT_LE(alvision.norm(tvec - tvec_gold), 1e-3);
//}

//INSTANTIATE_TEST_CASE_P(CUDA_Calib3D, SolvePnPRansac, ALL_DEVICES);

////#endif // HAVE_CUDA
