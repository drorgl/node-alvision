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

//#ifndef CV_CHESSBOARDGENERATOR_H143KJTVYM389YTNHKFDHJ89NYVMO3VLMEJNTBGUEIYVCM203P
//#define CV_CHESSBOARDGENERATOR_H143KJTVYM389YTNHKFDHJ89NYVMO3VLMEJNTBGUEIYVCM203P
//
//#include "opencv2/calib3d.hpp"

//namespace cv
//{

class ChessBoardGenerator {
    public sensorWidth: alvision.double;
    public sensorHeight: alvision.double;
    public squareEdgePointsNum: alvision.size_t;
    public min_cos: alvision.double;
    public cov: alvision.double;
    public patternSize: alvision.Size;
    public rendererResolutionMultiplier: alvision.int;

    constructor(_patternSize: alvision.Size = new alvision.Size(8, 6)) {
        this.sensorWidth = (32);
        this.sensorHeight = (24);
        this.squareEdgePointsNum = (200);
        this.min_cos = (Math.sqrt(2.) * 0.5);
        this.cov = (0.5);


        this.patternSize = (_patternSize);
        this.rendererResolutionMultiplier = (4);
        this.tvec = alvision.Mat.from (alvision.Mat.zeros(1, 3,alvision.MatrixType. CV_32F))
        Rodrigues(Mat::eye(3, 3, CV_32F), rvec);
    }
    run(bg: alvision.Mat, camMat: alvision.Mat, distCoeffs: alvision.Mat, corners: Array<alvision.Point2f>): alvision.Mat {
        this.cov = Math.min(this.cov.valueOf(), 0.8);

        var fovx: alvision.double;
        var fovy: alvision.double;
        var focalLen: alvision.double;

        var principalPoint: alvision.Point2d;
        var aspect: alvision.double;
        alvision.calibrationMatrixValues(camMat, bg.size(), this.sensorWidth, this.sensorHeight,
            fovx, fovy, focalLen, principalPoint, aspect);

        var rng = alvision.theRNG();

        var d1 = (rng.uniform(0.1, 10.0));
        var ah = (rng.uniform(-fovx / 2 * this.cov.valueOf(), fovx.valueOf() / 2 * this.cov.valueOf()).valueOf() * Math.PI / 180);
        var av = (rng.uniform(-fovy / 2 * this.cov.valueOf(), fovy.valueOf() / 2 * this.cov.valueOf()).valueOf() * Math.PI / 180);

        var p = new alvision.Point3f();
        p.z = Math.cos(ah) * d1.valueOf();
        p.x = Math.sin(ah) * d1.valueOf();
        p.y = p.z.valueOf() * Math.tan(av);

        var pb1 = new alvision.Point3f()
        var pb2 = new alvision.Point3f();

        this.generateBasis(pb1, pb2);

        var cbHalfWidth = (norm(p) * Math.sin(Math.min(fovx.valueOf(), fovy).valueOf() * 0.5 * Math.PI / 180));
        var cbHalfHeight = cbHalfWidth * this.patternSize.height.valueOf() / this.patternSize.width.valueOf();

        var cbHalfWidthEx  = cbHalfWidth * (this.patternSize.width.valueOf() + 1) / this.patternSize.width.valueOf();
        var cbHalfHeightEx = cbHalfHeight * (this.patternSize.height.valueOf() + 1) / this.patternSize.height.valueOf();

        var pts3d = new Array<alvision.Point3f> (4);
        var pts2d = new Array<alvision.Point2f> (4);

        for (; ;) {
            pts3d[0] = p + pb1 * cbHalfWidthEx + cbHalfHeightEx * pb2;
            pts3d[1] = p + pb1 * cbHalfWidthEx - cbHalfHeightEx * pb2;
            pts3d[2] = p - pb1 * cbHalfWidthEx - cbHalfHeightEx * pb2;
            pts3d[3] = p - pb1 * cbHalfWidthEx + cbHalfHeightEx * pb2;

            /* can remake with better perf */
            alvision.projectPoints(Mat(pts3d), rvec, tvec, camMat, distCoeffs, pts2d);

            var inrect1 = pts2d[0].x < bg.cols && pts2d[0].y < bg.rows && pts2d[0].x > 0 && pts2d[0].y > 0;
            var inrect2 = pts2d[1].x < bg.cols && pts2d[1].y < bg.rows && pts2d[1].x > 0 && pts2d[1].y > 0;
            var inrect3 = pts2d[2].x < bg.cols && pts2d[2].y < bg.rows && pts2d[2].x > 0 && pts2d[2].y > 0;
            var inrect4 = pts2d[3].x < bg.cols && pts2d[3].y < bg.rows && pts2d[3].x > 0 && pts2d[3].y > 0;

            if (inrect1 && inrect2 && inrect3 && inrect4)
                break;

            cbHalfWidth *= 0.8f;
            cbHalfHeight = cbHalfWidth * this.patternSize.height.valueOf() / this.patternSize.width.valueOf();

            cbHalfWidthEx = cbHalfWidth * (this.patternSize.width.valueOf() + 1) / this.patternSize.width.valueOf();
            cbHalfHeightEx = cbHalfHeight * (this.patternSize.height.valueOf() + 1) / this.patternSize.height.valueOf();
        }

        var zero: alvision.Point3f  = p - pb1 * cbHalfWidth - cbHalfHeight * pb2;
        var sqWidth  = 2 * cbHalfWidth / this.patternSize.width.valueOf();
        var sqHeight = 2 * cbHalfHeight / this.patternSize.height.valueOf();

        return this.generateChessBoard(bg, camMat, distCoeffs, zero, pb1, pb2, sqWidth, sqHeight, pts3d, corners);
    }
    run(bg: alvision.Mat, camMat: alvision.Mat, distCoeffs: alvision.Mat, squareSize: alvision.Size2f, corners: Array<alvision.Point2f>): alvision.Mat {
        this.cov = Math.min(this.cov.valueOf(), 0.8);
        double fovx, fovy, focalLen;
        Point2d principalPoint;
        double aspect;
        alvision.calibrationMatrixValues(camMat, bg.size(), sensorWidth, sensorHeight,
            fovx, fovy, focalLen, principalPoint, aspect);

        var rng = alvision.theRNG();

        var d1 = (rng.uniform(0.1, 10.0));
        var ah = (rng.uniform(-fovx / 2 * cov, fovx / 2 * cov).valueOf() * Math.PI / 180);
        var av = (rng.uniform(-fovy / 2 * cov, fovy / 2 * cov).valueOf() * Math.PI / 180);

        var p = new alvision.Point3f();
        p.z = Math.cos(ah) * d1.valueOf();
        p.x = Math.sin(ah) * d1.valueOf();
        p.y = p.z.valueOf() * Math.tan(av);

        Point3f pb1, pb2;
        this.generateBasis(pb1, pb2);

        var cbHalfWidth  = squareSize.width.valueOf() * this.patternSize.width.valueOf() * 0.5;
        var cbHalfHeight = squareSize.height.valueOf() * this.patternSize.height.valueOf() * 0.5;

        var cbHalfWidthEx  = cbHalfWidth * (thispatternSize.width + 1) / this.patternSize.width;
        var cbHalfHeightEx = cbHalfHeight * (this.patternSize.height + 1) / this.patternSize.height;

        var pts3d = new Array<alvision.Point3f> (4);
        var pts2d = new Array<alvision.Point2f> (4);
        for (; ;) {
            pts3d[0] = p + pb1 * cbHalfWidthEx + cbHalfHeightEx * pb2;
            pts3d[1] = p + pb1 * cbHalfWidthEx - cbHalfHeightEx * pb2;
            pts3d[2] = p - pb1 * cbHalfWidthEx - cbHalfHeightEx * pb2;
            pts3d[3] = p - pb1 * cbHalfWidthEx + cbHalfHeightEx * pb2;

            /* can remake with better perf */
            alvision.projectPoints(new alvision.Mat(pts3d), rvec, tvec, camMat, distCoeffs, pts2d);

            var inrect1 = pts2d[0].x < bg.cols && pts2d[0].y < bg.rows && pts2d[0].x > 0 && pts2d[0].y > 0;
            var inrect2 = pts2d[1].x < bg.cols && pts2d[1].y < bg.rows && pts2d[1].x > 0 && pts2d[1].y > 0;
            var inrect3 = pts2d[2].x < bg.cols && pts2d[2].y < bg.rows && pts2d[2].x > 0 && pts2d[2].y > 0;
            var inrect4 = pts2d[3].x < bg.cols && pts2d[3].y < bg.rows && pts2d[3].x > 0 && pts2d[3].y > 0;

            if (inrect1 && inrect2 && inrect3 && inrect4)
                break;

            p.z *= 1.1f;
        }

        Point3f zero = p - pb1 * cbHalfWidth - cbHalfHeight * pb2;

        return this.generateChessBoard(bg, camMat, distCoeffs, zero, pb1, pb2,
            squareSize.width, squareSize.height, pts3d, corners);
    }
    run(bg: alvision.Mat, camMat: alvision.Mat, distCoeffs: alvision.Mat, squareSize: alvision.Size2f, pos: alvision.Point3f, corners: Array<alvision.Point2f>): alvision.Mat {
        this.cov = Math.min(this.cov.valueOf(), 0.8);
        Point3f p = pos;
        Point3f pb1, pb2;
        this.generateBasis(pb1, pb2);

        var cbHalfWidth  = squareSize.width.valueOf() * this.patternSize.width.valueOf() * 0.5;
        var cbHalfHeight = squareSize.height.valueOf() * this.patternSize.height.valueOf() * 0.5;

        var cbHalfWidthEx  = cbHalfWidth * (this.patternSize.width.valueOf() + 1) / this.patternSize.width.valueOf();
        var cbHalfHeightEx = cbHalfHeight * (this.patternSize.height.valueOf() + 1) / this.patternSize.height.valueOf();

        var pts3d = new Array<alvision.Point3f> (4);
        var pts2d = new Array<alvision.Point2f> (4);

        pts3d[0] = p + pb1 * cbHalfWidthEx + cbHalfHeightEx * pb2;
        pts3d[1] = p + pb1 * cbHalfWidthEx - cbHalfHeightEx * pb2;
        pts3d[2] = p - pb1 * cbHalfWidthEx - cbHalfHeightEx * pb2;
        pts3d[3] = p - pb1 * cbHalfWidthEx + cbHalfHeightEx * pb2;

        /* can remake with better perf */
        alvision.projectPoints(Mat(pts3d), rvec, tvec, camMat, distCoeffs, pts2d);

        Point3f zero = p - pb1 * cbHalfWidth - cbHalfHeight * pb2;

        return this.generateChessBoard(bg, camMat, distCoeffs, zero, pb1, pb2,
            squareSize.width, squareSize.height, pts3d, corners);
    }
    public cornersSize(): alvision.Size {
        return new alvision.Size(this.patternSize.width.valueOf() - 1, this.patternSize.height.valueOf() - 1);
    }

    public corners3d: Array<alvision.Point3f>;

    generateEdge(p1: alvision.Point3f, p2: alvision.Point3f, out: Array<alvision.Point3f>): void {
        Point3f step = (p2 - p1) * (1.f/ this.squareEdgePointsNum);
        for (var n = 0; n < this.squareEdgePointsNum; ++n)
        out.push(new alvision.Point3f( p1 + step * n));
    }

    generateChessBoard(bg: alvision.Mat, camMat: alvision.Mat, distCoeffs: alvision.Mat,
        zero: alvision.Point3f, pb1: alvision.Point3f, pb2: alvision.Point3f,
        sqWidth: alvision.float, sqHeight: alvision.float, whole: Array<alvision.Point3f>, corners: Array<alvision.Point2f>): alvision.Mat {
        var squares_black = new Array<Array<alvision.Point>> ;
        for (var i = 0; i < this.patternSize.width; ++i)
            for (var j = 0; j < this.patternSize.height; ++j)
                if ((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0)) {
                    var pts_square3d = new Array<alvision.Point3f>();
                    var pts_square2d = new Array<alvision.Point2f>();

                    Point3f p1 = zero + (i + 0) * sqWidth * pb1 + (j + 0) * sqHeight * pb2;
                    Point3f p2 = zero + (i + 1) * sqWidth * pb1 + (j + 0) * sqHeight * pb2;
                    Point3f p3 = zero + (i + 1) * sqWidth * pb1 + (j + 1) * sqHeight * pb2;
                    Point3f p4 = zero + (i + 0) * sqWidth * pb1 + (j + 1) * sqHeight * pb2;
                    this.generateEdge(p1, p2, pts_square3d);
                    this.generateEdge(p2, p3, pts_square3d);
                    this.generateEdge(p3, p4, pts_square3d);
                    this.generateEdge(p4, p1, pts_square3d);

                    alvision.projectPoints(Mat(pts_square3d), rvec, tvec, camMat, distCoeffs, pts_square2d);
                    squares_black.resize(squares_black.size() + 1);
                    var temp = new Array<alvision.Point2f>();
                    alvision.approxPolyDP(Mat(pts_square2d), temp, 1.0, true);
                    alvision.transformOp(temp.begin(), temp.end(), back_inserter(squares_black.back()), Mult(rendererResolutionMultiplier));
                }

        /* calculate corners */
        corners3d.clear();
        for (var j = 0; j < this.patternSize.height - 1; ++j)
            for (var i = 0; i < this.patternSize.width - 1; ++i)
                corners3d.push(zero + (i + 1) * sqWidth * pb1 + (j + 1) * sqHeight * pb2);
        corners.clear();
        alvision.projectPoints(Mat(corners3d), rvec, tvec, camMat, distCoeffs, corners);

        var whole3d = new Array<alvision.Point3f>();
        var whole2d = new Array<alvision.Point2f>();
        this.generateEdge(whole[0], whole[1], whole3d);
        this.generateEdge(whole[1], whole[2], whole3d);
        this.generateEdge(whole[2], whole[3], whole3d);
        this.generateEdge(whole[3], whole[0], whole3d);
        alvision.projectPoints(Mat(whole3d), rvec, tvec, camMat, distCoeffs, whole2d);
        vector < Point2f > temp_whole2d;
        approxPolyDP(Mat(whole2d), temp_whole2d, 1.0, true);

        var whole_contour = new Array<Array<alvision.Point>>(1);
        alvision.transformOp(temp_whole2d.begin(), temp_whole2d.end(),
            back_inserter(whole_contour.front()), Mult(rendererResolutionMultiplier));

        var result = new alvision.Mat();
        if (rendererResolutionMultiplier == 1) {
            result = bg.clone();
            alvision.drawContours(result, whole_contour, -1, Scalar::all(255), FILLED, LINE_AA);
            alvision.drawContours(result, squares_black, -1, alvision.Scalar.all(0), FILLED, LINE_AA);
        }
        else {
            Mat tmp;
            alvision.resize(bg, tmp, bg.size() * rendererResolutionMultiplier);
            alvision.drawContours(tmp, whole_contour, -1, Scalar::all(255), FILLED, LINE_AA);
            alvision.drawContours(tmp, squares_black, -1, alvision.Scalar.all(0), FILLED, LINE_AA);
            alvision.resize(tmp, result, bg.size(), 0, 0, INTER_AREA);
        }

        return result;
    }
    generateBasis(pb1: alvision.Point3f, pb2: alvision.Point3f): void {
        var rng = alvision.theRNG();

        var n = new alvision.Vecf();
        for (; ;) {
            n[0] = rng.uniform(-1., 1.).valueOf();
            n[1] = rng.uniform(-1., 1.).valueOf();
            n[2] = rng.uniform(-1., 1.).valueOf();
            var len = norm(n);
            n[0] /= len;
            n[1] /= len;
            n[2] /= len;

            if (n[2] > min_cos)
                break;
        }

        Vec3f n_temp = n; n_temp[0] += 100;
        Vec3f b1 = n.cross(n_temp);
        Vec3f b2 = n.cross(b1);
        float len_b1 = (float)norm(b1);
        float len_b2 = (float)norm(b2);

        pb1 = new alvision.Point3f(b1[0] / len_b1, b1[1] / len_b1, b1[2] / len_b1);
        pb2 = new alvision.Point3f(b2[0] / len_b1, b2[1] / len_b2, b2[2] / len_b2);
    }

    private rvec: alvision.Mat;
    private tvec: alvision.Mat;
}

//}


//#endif
//
//
//
//
//#include "test_precomp.hpp"
//#include "test_chessboardgenerator.hpp"
//
//#include < vector >
//#include < iterator >
//#include < algorithm >
//
//    using namespace cv;
//using namespace std;




class Mult implements alvision.ItransformOp<alvision.Point2f>
{
    protected m: alvision.float;
    constructor(mult: alvision.int) {
        this.m = mult;
    }


    run(p: alvision.Point2f): alvision.Point2f {
        return p * this.m;
    }
}



