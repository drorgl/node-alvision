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
        this.eps = [];
        this.eps[alvision.SOLVEPNP.SOLVEPNP_ITERATIVE] = 1.0e-2;
        this.eps[alvision.SOLVEPNP.SOLVEPNP_EPNP] = 1.0e-2;
        this.eps[alvision.SOLVEPNP.SOLVEPNP_P3P] = 1.0e-2;
        this.eps[alvision.SOLVEPNP.SOLVEPNP_DLS] = 1.0e-2;
        this.eps[alvision.SOLVEPNP.SOLVEPNP_UPNP] = 1.0e-2;
        this.totalTestsCount = 10;
    }
    generate3DPointCloud(points: Array<alvision.Point3f>, pmin: alvision.Point3f = new alvision.Point3f(-1,
        -1, 5), pmax: alvision.Point3f = new alvision.Point3f(1, 1, 10)) : void
    {
        const delta = pmax.op_Substraction(pmin);
        for (var i = 0; i < points.length; i++)
        {
            var p = new alvision.Point3f((alvision.theRNG().int().valueOf()) / 0x7fff, (alvision.theRNG().int().valueOf()) / 0x7fff,
                (alvision.theRNG().int().valueOf()) / 0x7fff);
            p.x =p.x.valueOf() * delta.x.valueOf();
            p.y =p.y.valueOf() * delta.y.valueOf();
            p.z =p.z.valueOf() * delta.z.valueOf();
            p = p.op_Addition( pmin);
            points[i] = p;
        }
    }

    generateCameraMatrix(cameraMatrix: alvision.Mat, rng: alvision.RNG) : void
    {
        const  fcMinVal = 1e-3;
        const  fcMaxVal = 100;
        cameraMatrix.create(3, 3, alvision.MatrixType.CV_64FC1);
        cameraMatrix.setTo(new alvision.Scalar(0));
        cameraMatrix.at<alvision.double>("double",0,0).set(  rng.uniform(fcMinVal, fcMaxVal));
        cameraMatrix.at<alvision.double>("double",1,1).set(  rng.uniform(fcMinVal, fcMaxVal));
        cameraMatrix.at<alvision.double>("double",0,2).set(  rng.uniform(fcMinVal, fcMaxVal));
        cameraMatrix.at<alvision.double>("double",1,2).set(  rng.uniform(fcMinVal, fcMaxVal));
        cameraMatrix.at<alvision.double>("double",2,2).set(  1);
    }

    generateDistCoeffs(distCoeffs: alvision.Mat, rng: alvision.RNG): void {
        alvision.Mat.zeros(4, 1, alvision.MatrixType.CV_64FC1).toMat().copyTo(distCoeffs);

        for (var i = 0; i < 3; i++)
            distCoeffs.at<alvision.double>("double", i, 0).set(rng.uniform(0.0, 1.0e-6));
    }

    generatePose(rvec: alvision.Mat, tvec: alvision.Mat, rng: alvision.RNG): void {
        const minVal = 1.0e-3;
        const maxVal = 1.0;
        rvec.create(3, 1, alvision.MatrixType.CV_64FC1);
        tvec.create(3, 1, alvision.MatrixType.CV_64FC1);
        for (var i = 0; i < 3; i++) {
            rvec.at<alvision.double>("double",i, 0).set( rng.uniform(minVal, maxVal));
            tvec.at<alvision.double>("double", i, 0).set(rng.uniform(minVal, maxVal / 10));
        }
    }

    runTest(rng: alvision.RNG, mode: alvision.int, method: alvision.int, points: Array<alvision.Point3f>  ,epsilon : Array<alvision.double>,  maxError : alvision.double, maxErrorChanged:(maxError)=>void) : boolean{
        var rvec = new alvision.Mat();
        var tvec = new alvision.Mat();
        var inliers = new Array<alvision.int>();

        var trueRvec = new alvision.Mat();
        var trueTvec = new alvision.Mat();

        var intrinsics = new alvision.Mat();
        var distCoeffs = new alvision.Mat();
        this.generateCameraMatrix(intrinsics, rng);

        if (method == 4) intrinsics.at<alvision.double>("double",1,1).set( intrinsics.at<alvision.double>("double", 0,0).get());
        if (mode == 0)
            distCoeffs = alvision.Mat.zeros(4, 1, alvision.MatrixType.CV_64FC1).toMat();
        else
            this.generateDistCoeffs(distCoeffs, rng);
        this.generatePose(trueRvec, trueTvec, rng);

        var projectedPoints = new Array<alvision.Point2f>();
        projectedPoints.length = (points.length);
        alvision.projectPoints(points, trueRvec, trueTvec, intrinsics, distCoeffs, projectedPoints, (ipt)=>projectedPoints = ipt);
        for (var i = 0; i < projectedPoints.length; i++)
        {
            if (i % 20 == 0)
            {
                projectedPoints[i] = projectedPoints[rng.uniform(0,points.length-1).valueOf()];
            }
        }

        alvision.solvePnPRansac(points, projectedPoints, intrinsics, distCoeffs, rvec, tvec,
            false, 500, 0.5, 0.99, inliers, method);

        var isTestSuccess = inliers.length >= points.length*0.95;

        var rvecDiff = alvision.norm(alvision.MatExpr.op_Substraction(rvec,trueRvec).toMat()), tvecDiff = alvision.norm(alvision.MatExpr.op_Substraction(tvec,trueTvec).toMat());
        isTestSuccess = isTestSuccess && rvecDiff < epsilon[method.valueOf()] && tvecDiff < epsilon[method.valueOf()];
        var error = rvecDiff > tvecDiff ? rvecDiff : tvecDiff;
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
        this.generate3DPointCloud(points);

        const methodsCount = 5;
        var rng = this.ts.get_rng();


        for (var mode = 0; mode < 2; mode++)
        {
            for (var method = 0; method < methodsCount; method++)
            {
                var maxError = 0;
                var successfulTestsCount = 0;
                for (var testIndex = 0; testIndex < this.totalTestsCount; testIndex++)
                {
                    if (this.runTest(rng, mode, method, points, this.eps, maxError, (cmax) => {maxError = cmax }))
                        successfulTestsCount++;
                }
                //cout <<  maxError << " " << successfulTestsCount << endl;
                if (successfulTestsCount < 0.7* this.totalTestsCount.valueOf())
                {
                    this.ts.printf( alvision.cvtest.TSConstants.LOG, "Invalid accuracy for method %d, failed %d tests from %d, maximum error equals %f, distortion mode equals %d\n",
                        method, this.totalTestsCount.valueOf() - successfulTestsCount, this.totalTestsCount, maxError, mode);
                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);

                }
                console.log("mode: " + mode + ", method: " + method + " . "
                    + (successfulTestsCount / this.totalTestsCount.valueOf()) * 100 + "%"
                    + " (err < " + maxError + ")");
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
        this.eps[alvision.SOLVEPNP.SOLVEPNP_ITERATIVE] = 1.0e-6;
        this.eps[alvision.SOLVEPNP.SOLVEPNP_EPNP] = 1.0e-6;
        this.eps[alvision.SOLVEPNP.SOLVEPNP_P3P] = 1.0e-4;
        this.eps[alvision.SOLVEPNP.SOLVEPNP_DLS] = 1.0e-4;
        this.eps[alvision.SOLVEPNP.SOLVEPNP_UPNP] = 1.0e-4;
        this.totalTestsCount = 1000;
    }

    runTest(rng: alvision.RNG, mode: alvision.int, method: alvision.int, points: Array<alvision.Point3f>, epsilon: Array<alvision.double>, maxError : alvision.double, maxErrorChanged:(maxError)=>void): boolean
    {
        var rvec = new alvision.Mat(), tvec = new alvision.Mat();
        var trueRvec = new alvision.Mat();
        var trueTvec = new alvision.Mat();


        var intrinsics = new alvision.Mat();
        var distCoeffs = new alvision.Mat();

        this.generateCameraMatrix(intrinsics, rng);
        if (method == 4) intrinsics.at<alvision.double>("double",1,1).set( intrinsics.at<alvision.double>("double",0,0).get());
        if (mode == 0)
            distCoeffs = alvision.Mat.zeros(4, 1,alvision.MatrixType. CV_64FC1).toMat();
        else
            this.generateDistCoeffs(distCoeffs, rng);
        this.generatePose(trueRvec, trueTvec, rng);

        var opoints = new Array<alvision.Point3f>();
        if (method == 2)
        {
            opoints = points.slice(0, 4);// Array<alvision.Point3f>(points.begin(), points.begin()+4);
        }
        else if(method == 3)
        {
            opoints = points.slice(0, 50);//Array<Point3f>(points.begin(), points.begin()+50);
        }
        else
            opoints = points;

        var projectedPoints = new Array<alvision.Point2f>() ;
        alvision.projectPoints(opoints, trueRvec, trueTvec, intrinsics, distCoeffs, projectedPoints, (ipt)=>projectedPoints = ipt);

        alvision.solvePnP(opoints, projectedPoints, intrinsics, distCoeffs, rvec, tvec,
            false, method);

        var rvecDiff = alvision.norm(alvision.MatExpr.op_Substraction( rvec,trueRvec).toMat()), tvecDiff = alvision. norm(alvision.MatExpr.op_Substraction(tvec,trueTvec).toMat());
        var isTestSuccess = rvecDiff < epsilon[method.valueOf()] && tvecDiff < epsilon[method.valueOf()];

        var error = rvecDiff > tvecDiff ? rvecDiff : tvecDiff;
        if (error > maxError)
            maxError = error;

        return isTestSuccess;
    }
};

alvision.cvtest.TEST('Calib3d_SolvePnPRansac', 'accuracy', () => { var test = new CV_solvePnPRansac_Test(); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_SolvePnP', 'accuracy', () => { var test = new CV_solvePnP_Test(); test.safe_run(); });


//#ifdef HAVE_TBB

alvision.cvtest.TEST('DISABLED_Calib3d_SolvePnPRansac', 'concurrency',()=>
{
    var count = 7*13;

    //TODO: possible bug, assign to object!!
    var object = new alvision.Mat(1, count, alvision.MatrixType. CV_32FC3);
    alvision.randu(object, -100, 100);

    var camera_mat = new alvision.Mat(3, 3, alvision.MatrixType. CV_32FC1);
    alvision.randu(camera_mat, 0.5, 1);
    camera_mat.at<alvision.float>("float", 0, 1).set( 0.);
    camera_mat.at<alvision.float>("float", 1, 0).set( 0.);
    camera_mat.at<alvision.float>("float", 2, 0).set( 0.);
    camera_mat.at<alvision.float>("float", 2, 1).set( 0.);

    var dist_coef = new alvision.Mat(1, 8, alvision.MatrixType. CV_32F, alvision.Scalar.all(0));

    var image_vec = new Array<alvision.Point2f>();
    var rvec_gold = new alvision.Mat(1, 3, alvision.MatrixType.CV_32FC1);
    alvision.randu(rvec_gold, 0, 1);
    var tvec_gold = new alvision.Mat(1, 3, alvision.MatrixType. CV_32FC1);
    alvision.randu(tvec_gold, 0, 1);
    alvision.projectPoints(object, rvec_gold, tvec_gold, camera_mat, dist_coef, image_vec);

    var image = new alvision.Mat(1, count, alvision.MatrixType. CV_32FC2, image_vec);

    var rvec1 = new alvision.Mat();
    var rvec2 = new alvision.Mat();

    var tvec1 = new alvision.Mat();
    var tvec2 = new alvision.Mat();

    {
        // limit concurrency to get deterministic result
        alvision.theRNG().state = 20121010;
        //tbb::task_scheduler_init one_thread(1);
        alvision.solvePnPRansac(object, image, camera_mat, dist_coef, rvec1, tvec1);
    }

    if(1)
    {
        var rvec = new alvision.Mat();
        var tvec = new alvision.Mat();
        // parallel executions
        for(var i = 0; i < 10; ++i)
        {
            alvision.theRNG().state = 20121010;
            alvision.solvePnPRansac(object, image, camera_mat, dist_coef, rvec, tvec);
        }
    }

    {
        // single thread again
        alvision.theRNG().state = 20121010;
        //tbb::task_scheduler_init one_thread(1);
        alvision.solvePnPRansac(object, image, camera_mat, dist_coef, rvec2, tvec2);
    }

    var rnorm = alvision.cvtest.norm(rvec1, rvec2,alvision.NormTypes. NORM_INF);
    var tnorm = alvision.cvtest.norm(tvec1, tvec2,alvision.NormTypes. NORM_INF);

    alvision.EXPECT_LT(rnorm, 1e-6);
    alvision.EXPECT_LT(tnorm, 1e-6);

});
//#endif
