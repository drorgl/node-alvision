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

//#include "test_precomp.hpp"
//
//#ifdef HAVE_TBB
//#include "tbb/task_scheduler_init.h"
//#endif
//
//using namespace cv;
//using namespace std;

class CV_solvePnPRansac_Test  extends alvision.cvtest.BaseTest
{
    constructor()
    {
        super();
        this.eps[this.SOLVEPNP_ITERATIVE] = 1.0e-2;
        this.eps[this.SOLVEPNP_EPNP] = 1.0e-2;
        this.eps[this.SOLVEPNP_P3P] = 1.0e-2;
        this.eps[this.SOLVEPNP_DLS] = 1.0e-2;
        this.eps[this.SOLVEPNP_UPNP] = 1.0e-2;
        this.totalTestsCount = 10;
    }
    generate3DPointCloud(points: Array<alvision.Point3f>, pmin: alvision.Point3f = new alvision.Point3f(-1,
        -1, 5), pmax: alvision.Point3f = new alvision.Point3f(1, 1, 10)) : void
    {
        const delta = pmax.op_Substraction(pmin);
        for (var i = 0; i < points.size(); i++)
        {
            var p = new alvision.Point3f ((rand()) / RAND_MAX, float(rand()) / RAND_MAX,
                (rand()) / RAND_MAX);
            p.x *= delta.x;
            p.y *= delta.y;
            p.z *= delta.z;
            p = p + pmin;
            points[i] = p;
        }
    }

    generateCameraMatrix(cameraMatrix: alvision.Mat, rng: alvision.RNG) : void
    {
        const  fcMinVal = 1e-3;
        const  fcMaxVal = 100;
        cameraMatrix.create(3, 3, alvision.MatrixType.CV_64FC1);
        cameraMatrix.setTo(new alvision.Scalar(0));
        cameraMatrix.at<double>(0,0) = rng.uniform(fcMinVal, fcMaxVal);
        cameraMatrix.at<double>(1,1) = rng.uniform(fcMinVal, fcMaxVal);
        cameraMatrix.at<double>(0,2) = rng.uniform(fcMinVal, fcMaxVal);
        cameraMatrix.at<double>(1,2) = rng.uniform(fcMinVal, fcMaxVal);
        cameraMatrix.at<double>(2,2) = 1;
    }

    generateDistCoeffs(distCoeffs: alvision.Mat, rng: alvision.RNG): void {
        distCoeffs = alvision.Mat.zeros(4, 1, alvision.MatrixType.CV_64FC1);
        for (var i = 0; i < 3; i++)
            distCoeffs.at<double>(i, 0) = rng.uniform(0.0, 1.0e-6);
    }

    generatePose(rvec: alvision.Mat, tvec: alvision.Mat, rng: alvision.RNG): void {
        const minVal = 1.0e-3;
        const maxVal = 1.0;
        rvec.create(3, 1, alvision.MatrixType.CV_64FC1);
        tvec.create(3, 1, alvision.MatrixType.CV_64FC1);
        for (var i = 0; i < 3; i++) {
            rvec.at<double>(i, 0) = rng.uniform(minVal, maxVal);
            tvec.at<double>(i, 0) = rng.uniform(minVal, maxVal / 10);
        }
    }

    runTest(rng: alvision.RNG, mode: alvision.int, method: alvision.int, points: Array<alvision.Point3f>  ,epsilon : Array<alvision.double>,  maxError : alvision.double, maxErrorChanged:(maxError)=>void) : boolean
    {
        Mat rvec, tvec;
        Array<int> inliers;
        Mat trueRvec, trueTvec;
        Mat intrinsics, distCoeffs;
        generateCameraMatrix(intrinsics, rng);
        if (method == 4) intrinsics.at<double>(1,1) = intrinsics.at<double>(0,0);
        if (mode == 0)
            distCoeffs = Mat::zeros(4, 1, CV_64FC1);
        else
            generateDistCoeffs(distCoeffs, rng);
        generatePose(trueRvec, trueTvec, rng);

        Array<Point2f> projectedPoints;
        projectedPoints.resize(points.size());
        projectPoints(Mat(points), trueRvec, trueTvec, intrinsics, distCoeffs, projectedPoints);
        for (size_t i = 0; i < projectedPoints.size(); i++)
        {
            if (i % 20 == 0)
            {
                projectedPoints[i] = projectedPoints[rng.uniform(0,(int)points.size()-1)];
            }
        }

        solvePnPRansac(points, projectedPoints, intrinsics, distCoeffs, rvec, tvec,
            false, 500, 0.5, 0.99, inliers, method);

        bool isTestSuccess = inliers.size() >= points.size()*0.95;

        double rvecDiff = norm(rvec-trueRvec), tvecDiff = norm(tvec-trueTvec);
        isTestSuccess = isTestSuccess && rvecDiff < epsilon[method] && tvecDiff < epsilon[method];
        double error = rvecDiff > tvecDiff ? rvecDiff : tvecDiff;
        //cout << error << " " << inliers.size() << " " << eps[method] << endl;
        if (error > maxError)
            maxError = error;

        return isTestSuccess;
    }

    run(iii: alvision.int) : void
    {
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);

        var points = new Array<alvision.Point3f>(), points_dls = new Array<alvision.Point3f>() ;
        const pointsCount = 500;
        points.length   = (pointsCount);
        generate3DPointCloud(points);

        const int methodsCount = 5;
        var rng = this.ts.get_rng();


        for (int mode = 0; mode < 2; mode++)
        {
            for (int method = 0; method < methodsCount; method++)
            {
                double maxError = 0;
                int successfulTestsCount = 0;
                for (int testIndex = 0; testIndex < totalTestsCount; testIndex++)
                {
                    if (runTest(rng, mode, method, points, eps, maxError))
                        successfulTestsCount++;
                }
                //cout <<  maxError << " " << successfulTestsCount << endl;
                if (successfulTestsCount < 0.7*totalTestsCount)
                {
                    ts.printf( alvision.cvtest.TSConstants.LOG, "Invalid accuracy for method %d, failed %d tests from %d, maximum error equals %f, distortion mode equals %d\n",
                        method, totalTestsCount - successfulTestsCount, totalTestsCount, maxError, mode);
                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                }
                cout << "mode: " << mode << ", method: " << method << " . "
                     << ((double)successfulTestsCount / totalTestsCount) * 100 << "%"
                     << " (err < " << maxError << ")" << endl;
            }
        }
    }
    protected eps : Array<alvision.double>;
    protected totalTestsCount : alvision.int;
};

class CV_solvePnP_Test extends CV_solvePnPRansac_Test
{
    constructor()
    {
        super();
        this.eps[this.SOLVEPNP_ITERATIVE] = 1.0e-6;
        this.eps[this.SOLVEPNP_EPNP] = 1.0e-6;
        this.eps[this.SOLVEPNP_P3P] = 1.0e-4;
        this.eps[this.SOLVEPNP_DLS] = 1.0e-4;
        this.eps[this.SOLVEPNP_UPNP] = 1.0e-4;
        this.totalTestsCount = 1000;
    }

    runTest(rng: alvision.RNG, mode: alvision.int, method: alvision.int, points: Array<alvision.Point3f>, epsilon: Array<alvision.double>, maxError : alvision.double, maxErrorChanged:(maxError)=>void): boolean
    {
        var rvec = new alvision.Mat(), tvec = new alvision.Mat();
        Mat trueRvec, trueTvec;
        Mat intrinsics, distCoeffs;
        generateCameraMatrix(intrinsics, rng);
        if (method == 4) intrinsics.at<double>(1,1) = intrinsics.at<double>(0,0);
        if (mode == 0)
            distCoeffs = Mat::zeros(4, 1, CV_64FC1);
        else
            generateDistCoeffs(distCoeffs, rng);
        generatePose(trueRvec, trueTvec, rng);

        Array<Point3f> opoints;
        if (method == 2)
        {
            opoints = Array<Point3f>(points.begin(), points.begin()+4);
        }
        else if(method == 3)
        {
            opoints = Array<Point3f>(points.begin(), points.begin()+50);
        }
        else
            opoints = points;

        Array<Point2f> projectedPoints;
        projectedPoints.resize(opoints.size());
        projectPoints(Mat(opoints), trueRvec, trueTvec, intrinsics, distCoeffs, projectedPoints);

        solvePnP(opoints, projectedPoints, intrinsics, distCoeffs, rvec, tvec,
            false, method);

        double rvecDiff = norm(rvec-trueRvec), tvecDiff = norm(tvec-trueTvec);
        bool isTestSuccess = rvecDiff < epsilon[method] && tvecDiff < epsilon[method];

        double error = rvecDiff > tvecDiff ? rvecDiff : tvecDiff;
        if (error > maxError)
            maxError = error;

        return isTestSuccess;
    }
};

alvision.cvtest.TEST('Calib3d_SolvePnPRansac', 'accuracy', () => { CV_solvePnPRansac_Test test; test.safe_run(); });
alvision.cvtest.TEST('Calib3d_SolvePnP', 'accuracy', () => { CV_solvePnP_Test test; test.safe_run(); });


//#ifdef HAVE_TBB

alvision.cvtest.TEST('DISABLED_Calib3d_SolvePnPRansac', 'concurrency',()=>
{
    int count = 7*13;

    Mat object(1, count, CV_32FC3);
    randu(object, -100, 100);

    Mat camera_mat(3, 3, CV_32FC1);
    randu(camera_mat, 0.5, 1);
    camera_mat.at<float>(0, 1) = 0.f;
    camera_mat.at<float>(1, 0) = 0.f;
    camera_mat.at<float>(2, 0) = 0.f;
    camera_mat.at<float>(2, 1) = 0.f;

    Mat dist_coef(1, 8, CV_32F, alvision.alvision.Scalar.all(0));

    Array<alvision.Point2f> image_vec;
    Mat rvec_gold(1, 3, CV_32FC1);
    randu(rvec_gold, 0, 1);
    Mat tvec_gold(1, 3, CV_32FC1);
    randu(tvec_gold, 0, 1);
    projectPoints(object, rvec_gold, tvec_gold, camera_mat, dist_coef, image_vec);

    Mat image(1, count, CV_32FC2, &image_vec[0]);

    Mat rvec1, rvec2;
    Mat tvec1, tvec2;

    {
        // limit concurrency to get deterministic result
        alvision.theRNG().state = 20121010;
        tbb::task_scheduler_init one_thread(1);
        solvePnPRansac(object, image, camera_mat, dist_coef, rvec1, tvec1);
    }

    if(1)
    {
        Mat rvec;
        Mat tvec;
        // parallel executions
        for(int i = 0; i < 10; ++i)
        {
            alvision.theRNG().state = 20121010;
            solvePnPRansac(object, image, camera_mat, dist_coef, rvec, tvec);
        }
    }

    {
        // single thread again
        alvision.theRNG().state = 20121010;
        tbb::task_scheduler_init one_thread(1);
        solvePnPRansac(object, image, camera_mat, dist_coef, rvec2, tvec2);
    }

    double rnorm = alvision.cvtest.norm(rvec1, rvec2, NORM_INF);
    double tnorm = alvision.cvtest.norm(tvec1, tvec2, NORM_INF);

    EXPECT_LT(rnorm, 1e-6);
    EXPECT_LT(tnorm, 1e-6);

});
//#endif
