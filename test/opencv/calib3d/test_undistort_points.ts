import tape = require("tape");
import path = require("path");
import colors = require("colors");
import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');

//#include "test_precomp.hpp"
//#include <string>
//
//using namespace cv;
//using namespace std;

class CV_UndistortTest extends alvision.cvtest.BaseTest {
    constructor() {
        super();
        this.thresh = 1.0e-2;
    }
    //protected:
    public run(iii : alvision.int): void {
        var intrinsics = new alvision.Mat();
        var distCoeffs = new alvision.Mat();

        this.generateCameraMatrix(intrinsics);
        var points = new Array<alvision.Point3f>();
        points.length = 500;
        this.generate3DPointCloud(points);
        var projectedPoints = new Array<alvision.Point2f>();
        projectedPoints.length = points.length;

        var modelMembersCount = [4, 5, 8];
        for (var idx = 0; idx < 3; idx++)
        {
            this.generateDistCoeffs(distCoeffs, modelMembersCount[idx]);
            alvision.projectPoints(new alvision.Mat(points), alvision.Mat.zeros(3, 1, alvision.MatrixType.CV_64FC1), alvision.Mat.zeros(3, 1, alvision.MatrixType.CV_64FC1),
                intrinsics, distCoeffs, projectedPoints);

            //vector < Point2f > realUndistortedPoints;
            var realUndistortedPoints = new Array<alvision.Point2f>();
            alvision.projectPoints(new alvision.Mat(points), alvision.Mat.zeros(3, 1, alvision.MatrixType.CV_64FC1), alvision.Mat.zeros(3, 1, alvision.MatrixType.CV_64FC1),
                intrinsics, alvision.Mat.zeros(4, 1, alvision.MatrixType.CV_64FC1), realUndistortedPoints);


            var undistortedPoints = new alvision.Mat();
            alvision.undistortPoints(new alvision.Mat(projectedPoints), undistortedPoints, intrinsics, distCoeffs);

            var p = new alvision.Mat();
            alvision.perspectiveTransform(undistortedPoints, p, intrinsics);
            undistortedPoints = p;
            var diff = alvision.cvtest.norm(new alvision.Mat(realUndistortedPoints), undistortedPoints, alvision.NormTypes.NORM_L2);
            if (diff > this.thresh) {
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                return;
            }
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
        }
    }
    //private:
    private generate3DPointCloud(points: Array<alvision.Point3f>, pmin: alvision.Point3f = new alvision.Point3f(-1, -1, 5), pmax: alvision.Point3f = new alvision.Point3f(1, 1, 10)): void {
        const delta = alvision.Point3f.op_Substraction(pmax, pmin);
        
        

        for (var i = 0; i < points.length; i++)
        {
            var p = new alvision.Point3f(
                this.rng.float().valueOf() / 0x7fff,
                this.rng.float().valueOf() / 0x7fff,
                this.rng.float().valueOf()/ 0x7fff);
            p.x =p.x.valueOf()  * delta.x.valueOf();
            p.y =p.y.valueOf()  * delta.y.valueOf();
            p.z =p.z.valueOf()  * delta.z.valueOf();
            p = p.op_Addition( pmin);
            points[i] = p;
        }
    }
    private generateCameraMatrix( cameraMatrix : alvision.Mat): void {
        const fcMinVal = 1e-3;
        const fcMaxVal = 100;
        cameraMatrix.create(3, 3, alvision.MatrixType.CV_64FC1);
        cameraMatrix.setTo(new alvision.Scalar(0));
        cameraMatrix.at<alvision.double>("double",0, 0).set( this.rng.uniform(fcMinVal, fcMaxVal));
        cameraMatrix.at<alvision.double>("double",1, 1).set( this.rng.uniform(fcMinVal, fcMaxVal));
        cameraMatrix.at<alvision.double>("double",0, 2).set( this.rng.uniform(fcMinVal, fcMaxVal));
        cameraMatrix.at<alvision.double>("double",1, 2).set( this.rng.uniform(fcMinVal, fcMaxVal));
        cameraMatrix.at<alvision.double>("double", 2, 2).set(1);
    }
    private generateDistCoeffs(distCoeffs : alvision.Mat, count : alvision.int): void {
        //DROR: should not work, overriding reference?
        distCoeffs = alvision.Mat.zeros(count, 1, alvision.MatrixType.CV_64FC1).toMat();
        for (var i = 0; i < count; i++)
            distCoeffs.at<alvision.double>("double", i, 0).set(this.rng.uniform(0.0, 1.0e-3));
    }

    private  thresh: alvision.double;
    private  rng: alvision.RNG;
}




alvision.cvtest.TEST('Calib3d_Undistort', 'accuracy', () => { var test = new CV_UndistortTest(); test.safe_run(); });
