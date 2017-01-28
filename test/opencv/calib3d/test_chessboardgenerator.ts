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

import alvision = require("../../../tsbinding/alvision");


//#ifndef CV_CHESSBOARDGENERATOR_H143KJTVYM389YTNHKFDHJ89NYVMO3VLMEJNTBGUEIYVCM203P
//#define CV_CHESSBOARDGENERATOR_H143KJTVYM389YTNHKFDHJ89NYVMO3VLMEJNTBGUEIYVCM203P
//
//#include "opencv2/calib3d.hpp"

//namespace cv
//{

export class ChessBoardGenerator {
    public sensorWidth: alvision.double;
    public sensorHeight: alvision.double;
    public squareEdgePointsNum: alvision.size_t;
    public min_cos: alvision.double;
    public cov: alvision.double;
    public patternSize: alvision.Size;
    public rendererResolutionMultiplier: alvision.int;

    constructor(_patternSize: alvision.Size = new alvision.Size(8, 6)) {
        this.rvec = new alvision.Mat();
        this.sensorWidth = (32);
        this.sensorHeight = (24);
        this.squareEdgePointsNum = (200);
        this.min_cos = (Math.sqrt(2.) * 0.5);
        this.cov = (0.5);


        this.patternSize = (_patternSize);
        this.rendererResolutionMultiplier = (4);
        this.tvec = alvision.Mat.from (alvision.Mat.zeros(1, 3,alvision.MatrixType. CV_32F))
        alvision.Rodrigues(alvision.Mat.eye(3, 3, alvision.MatrixType.CV_32F), this.rvec);
    }
    run1(bg: alvision.Mat, camMat: alvision.Mat, distCoeffs: alvision.Mat, corners: Array<alvision.Point2f>): alvision.Mat {
        this.cov = Math.min(this.cov.valueOf(), 0.8);

        var fovx: alvision.double;
        var fovy: alvision.double;
        var focalLen: alvision.double;

        var principalPoint: alvision.Point2d;
        var aspect: alvision.double;
        alvision.calibrationMatrixValues(camMat, bg.size(), this.sensorWidth, this.sensorHeight,
            (outfovx, outfoxy, outfocalLength, outprincipalpoint, outaspectRatio) => { fovx = outfovx; fovy = outfoxy; focalLen = outfocalLength; principalPoint = outprincipalpoint; aspect = outaspectRatio; });

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

        var cbHalfWidth = (p.norm().valueOf() * Math.sin(Math.min(fovx.valueOf(), fovy.valueOf()).valueOf() * 0.5 * Math.PI / 180));
        var cbHalfHeight = cbHalfWidth * this.patternSize.height.valueOf() / this.patternSize.width.valueOf();

        var cbHalfWidthEx  = cbHalfWidth * (this.patternSize.width.valueOf() + 1) / this.patternSize.width.valueOf();
        var cbHalfHeightEx = cbHalfHeight * (this.patternSize.height.valueOf() + 1) / this.patternSize.height.valueOf();

        var pts3d = new Array<alvision.Point3f> (4);
        var pts2d = new Array<alvision.Point2f> (4);

        for (; ;) {
            pts3d[0] = p.op_Addition(pb1.op_Multiplication(cbHalfWidthEx)).op_Addition(         pb2.op_Multiplication(cbHalfHeightEx));
            pts3d[1] = p.op_Addition(pb1.op_Multiplication(cbHalfWidthEx))      .op_Substraction(      pb2.op_Multiplication(cbHalfHeightEx));
            pts3d[2] = p.op_Substraction(pb1.op_Multiplication(cbHalfWidthEx))  .op_Substraction( pb2.op_Multiplication(cbHalfHeightEx));
            pts3d[3] = p.op_Substraction(pb1.op_Multiplication(cbHalfWidthEx))  .op_Addition(     pb2.op_Multiplication(cbHalfHeightEx));

            /* can remake with better perf */
            alvision.projectPoints(new alvision.Mat(pts3d), this.rvec, this.tvec, camMat, distCoeffs, pts2d);

            var inrect1 = pts2d[0].x < bg.cols() && pts2d[0].y < bg.rows() && pts2d[0].x > 0 && pts2d[0].y > 0;
            var inrect2 = pts2d[1].x < bg.cols() && pts2d[1].y < bg.rows() && pts2d[1].x > 0 && pts2d[1].y > 0;
            var inrect3 = pts2d[2].x < bg.cols() && pts2d[2].y < bg.rows() && pts2d[2].x > 0 && pts2d[2].y > 0;
            var inrect4 = pts2d[3].x < bg.cols() && pts2d[3].y < bg.rows() && pts2d[3].x > 0 && pts2d[3].y > 0;

            if (inrect1 && inrect2 && inrect3 && inrect4)
                break;

            cbHalfWidth *= 0.8;
            cbHalfHeight = cbHalfWidth * this.patternSize.height.valueOf() / this.patternSize.width.valueOf();

            cbHalfWidthEx = cbHalfWidth * (this.patternSize.width.valueOf() + 1) / this.patternSize.width.valueOf();
            cbHalfHeightEx = cbHalfHeight * (this.patternSize.height.valueOf() + 1) / this.patternSize.height.valueOf();
        }

        var zero: alvision.Point3f = p.op_Substraction( pb1.op_Multiplication( cbHalfWidth)).op_Substraction( pb2.op_Multiplication( cbHalfHeight)  );
        var sqWidth  = 2 * cbHalfWidth / this.patternSize.width.valueOf();
        var sqHeight = 2 * cbHalfHeight / this.patternSize.height.valueOf();

        return this.generateChessBoard(bg, camMat, distCoeffs, zero, pb1, pb2, sqWidth, sqHeight, pts3d, corners);
    }
    run2(bg: alvision.Mat, camMat: alvision.Mat, distCoeffs: alvision.Mat, squareSize: alvision.Size2f, corners: Array<alvision.Point2f>): alvision.Mat {
        this.cov = Math.min(this.cov.valueOf(), 0.8);
        var fovx : alvision.double, fovy : alvision.double, focalLen: alvision.double;
        var principalPoint: alvision.Point2d;
        var aspect: alvision.double;
        alvision.calibrationMatrixValues(camMat, bg.size(), this.sensorWidth, this.sensorHeight,
            (outfovx, outfoxy, outfocalLength, outprincipalpoint, outaspectRatio) => { fovx = outfovx; fovy = outfoxy; focalLen = outfocalLength; principalPoint = outprincipalpoint; aspect = outaspectRatio; });

        var rng = alvision.theRNG();

        var d1 = (rng.uniform(0.1, 10.0));
        var ah = (rng.uniform(-fovx / 2 * this.cov.valueOf(), fovx.valueOf() / 2 * this.cov.valueOf()).valueOf() * Math.PI / 180);
        var av = (rng.uniform(-fovy / 2 * this.cov.valueOf(), fovy.valueOf() / 2 * this.cov.valueOf()).valueOf() * Math.PI / 180);

        var p = new alvision.Point3f();
        p.z = Math.cos(ah) * d1.valueOf();
        p.x = Math.sin(ah) * d1.valueOf();
        p.y = p.z.valueOf() * Math.tan(av);

        var pb1 = new alvision.Point3f();
        var pb2 = new alvision.Point3f();

        this.generateBasis(pb1, pb2);

        var cbHalfWidth  = squareSize.width.valueOf() * this.patternSize.width.valueOf() * 0.5;
        var cbHalfHeight = squareSize.height.valueOf() * this.patternSize.height.valueOf() * 0.5;

        var cbHalfWidthEx  = cbHalfWidth *  (this.patternSize.width.valueOf() + 1) / this.patternSize.width.valueOf();
        var cbHalfHeightEx = cbHalfHeight * (this.patternSize.height.valueOf() + 1) / this.patternSize.height.valueOf();

        var pts3d = new Array<alvision.Point3f> (4);
        var pts2d = alvision.NewArray(4, () => new alvision.Point2f());

        let i = 0;
        for (; ;) {
            //pts3d[0] = p + pb1 * cbHalfWidthEx + cbHalfHeightEx * pb2;
            //pts3d[1] = p + pb1 * cbHalfWidthEx - cbHalfHeightEx * pb2;
            //pts3d[2] = p - pb1 * cbHalfWidthEx - cbHalfHeightEx * pb2;
            //pts3d[3] = p - pb1 * cbHalfWidthEx + cbHalfHeightEx * pb2;
            pts3d[0] = p.op_Addition(pb1.op_Multiplication(cbHalfWidthEx)).op_Addition(pb2.op_Multiplication(cbHalfHeightEx));
            pts3d[1] = p.op_Addition(pb1.op_Multiplication(cbHalfWidthEx)).op_Substraction(pb2.op_Multiplication(cbHalfHeightEx));
            pts3d[2] = p.op_Substraction(pb1.op_Multiplication(cbHalfWidthEx)).op_Substraction(pb2.op_Multiplication(cbHalfHeightEx));
            pts3d[3] = p.op_Substraction(pb1.op_Multiplication(cbHalfWidthEx)).op_Addition(pb2.op_Multiplication(cbHalfHeightEx));


            /* can remake with better perf */
            alvision.projectPoints(pts3d, this.rvec, this.tvec, camMat, distCoeffs, pts2d);

            var inrect1 = pts2d[0].x < bg.cols() && pts2d[0].y < bg.rows() && pts2d[0].x > 0 && pts2d[0].y > 0;
            var inrect2 = pts2d[1].x < bg.cols() && pts2d[1].y < bg.rows() && pts2d[1].x > 0 && pts2d[1].y > 0;
            var inrect3 = pts2d[2].x < bg.cols() && pts2d[2].y < bg.rows() && pts2d[2].x > 0 && pts2d[2].y > 0;
            var inrect4 = pts2d[3].x < bg.cols() && pts2d[3].y < bg.rows() && pts2d[3].x > 0 && pts2d[3].y > 0;

            if (inrect1 && inrect2 && inrect3 && inrect4)
                break;

            p.z = p.z.valueOf() * 1.1;
        }

        //Point3f zero = p - pb1 * cbHalfWidth - cbHalfHeight * pb2;
        var zero: alvision.Point3f = p.op_Substraction(pb1.op_Multiplication(cbHalfWidth)).op_Substraction(pb2.op_Multiplication(cbHalfHeight));

        return this.generateChessBoard(bg, camMat, distCoeffs, zero, pb1, pb2,
            squareSize.width, squareSize.height, pts3d, corners);
    }
    run3(bg: alvision.Mat, camMat: alvision.Mat, distCoeffs: alvision.Mat, squareSize: alvision.Size2f, pos: alvision.Point3f, corners: Array<alvision.Point2f>): alvision.Mat {
        this.cov = Math.min(this.cov.valueOf(), 0.8);
        var p = pos;

        var pb1 = new alvision.Point3f();
        var pb2 = new alvision.Point3f();


        this.generateBasis(pb1, pb2);

        var cbHalfWidth  = squareSize.width.valueOf() * this.patternSize.width.valueOf() * 0.5;
        var cbHalfHeight = squareSize.height.valueOf() * this.patternSize.height.valueOf() * 0.5;

        var cbHalfWidthEx  = cbHalfWidth * (this.patternSize.width.valueOf() + 1) / this.patternSize.width.valueOf();
        var cbHalfHeightEx = cbHalfHeight * (this.patternSize.height.valueOf() + 1) / this.patternSize.height.valueOf();

        var pts3d = new Array<alvision.Point3f> (4);
        var pts2d = new Array<alvision.Point2f> (4);

        //pts3d[0] = p + pb1 * cbHalfWidthEx + cbHalfHeightEx * pb2;
        //pts3d[1] = p + pb1 * cbHalfWidthEx - cbHalfHeightEx * pb2;
        //pts3d[2] = p - pb1 * cbHalfWidthEx - cbHalfHeightEx * pb2;
        //pts3d[3] = p - pb1 * cbHalfWidthEx + cbHalfHeightEx * pb2;
        pts3d[0] = p.op_Addition(pb1.op_Multiplication(cbHalfWidthEx)).op_Addition(pb2.op_Multiplication(cbHalfHeightEx));
        pts3d[1] = p.op_Addition(pb1.op_Multiplication(cbHalfWidthEx)).op_Substraction(pb2.op_Multiplication(cbHalfHeightEx));
        pts3d[2] = p.op_Substraction(pb1.op_Multiplication(cbHalfWidthEx)).op_Substraction(pb2.op_Multiplication(cbHalfHeightEx));
        pts3d[3] = p.op_Substraction(pb1.op_Multiplication(cbHalfWidthEx)).op_Addition(pb2.op_Multiplication(cbHalfHeightEx));

        /* can remake with better perf */
        alvision.projectPoints(new alvision.Mat(pts3d), this.rvec, this.tvec, camMat, distCoeffs, pts2d);

        //Point3f zero = p - pb1 * cbHalfWidth - cbHalfHeight * pb2;
        var zero: alvision.Point3f = p.op_Substraction(pb1.op_Multiplication(cbHalfWidth)).op_Substraction(pb2.op_Multiplication(cbHalfHeight));

        return this.generateChessBoard(bg, camMat, distCoeffs, zero, pb1, pb2,
            squareSize.width, squareSize.height, pts3d, corners);
    }
    public cornersSize(): alvision.Size {
        return new alvision.Size(this.patternSize.width.valueOf() - 1, this.patternSize.height.valueOf() - 1);
    }

    public corners3d: Array<alvision.Point3f> = [];

    generateEdge(p1: alvision.Point3f, p2: alvision.Point3f, out: Array<alvision.Point3f>): void {
        var step = (p2.op_Substraction(p1)).op_Multiplication( (1. / this.squareEdgePointsNum.valueOf()));
        for (var n = 0; n < this.squareEdgePointsNum; ++n)
        out.push(new alvision.Point3f( p1.op_Addition( step.op_Multiplication( n))));
    }

    generateChessBoard(bg: alvision.Mat, camMat: alvision.Mat, distCoeffs: alvision.Mat,
        zero: alvision.Point3f, pb1: alvision.Point3f, pb2: alvision.Point3f,
        sqWidth: alvision.float, sqHeight: alvision.float, whole: Array<alvision.Point3f>, corners: Array<alvision.Point2f>): alvision.Mat {
        var squares_black = new Array<Array<alvision.Point2f>>();
        for (var i = 0; i < this.patternSize.width; ++i)
            for (var j = 0; j < this.patternSize.height; ++j)
                if ((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0)) {
                    var pts_square3d = new Array<alvision.Point3f>();
                    

                    var p1 = zero.op_Addition(pb1.op_Multiplication((i + 0) *       sqWidth.valueOf())).op_Addition (  pb2.op_Multiplication((j + 0) *   sqHeight.valueOf()));
                    var p2 = zero.op_Addition(   pb1.op_Multiplication   ((i + 1) * sqWidth.valueOf())) .op_Addition(   pb2.op_Multiplication((j + 0) *  sqHeight.valueOf()) );
                    var p3 = zero.op_Addition(   pb1.op_Multiplication   ((i + 1) * sqWidth.valueOf())) .op_Addition(   pb2.op_Multiplication( (j + 1) * sqHeight.valueOf()));
                    var p4 = zero.op_Addition(   pb1.op_Multiplication   ((i + 0) * sqWidth.valueOf())) .op_Addition(   pb2.op_Multiplication( (j + 1) * sqHeight.valueOf()));
                    this.generateEdge(p1, p2, pts_square3d);
                    this.generateEdge(p2, p3, pts_square3d);
                    this.generateEdge(p3, p4, pts_square3d);
                    this.generateEdge(p4, p1, pts_square3d);

                    var pts_square2d = alvision.NewArray(pts_square3d.length,()=>new alvision.Point2f());

                    alvision.projectPoints(pts_square3d, this.rvec, this.tvec, camMat, distCoeffs, pts_square2d);
                    squares_black.length = (squares_black.length + 1);
                    var temp = alvision.NewArray(pts_square2d.length,()=> new alvision.Point2f());
                    var tempMat = new alvision.Mat(temp);
                    alvision.approxPolyDP(new alvision.Mat(pts_square2d), tempMat, 1.0, true);
                    console.log(tempMat);

                    //copy back from tempMat to temp
                    let tptr = tempMat.ptr<alvision.Point2f>("Point2f");
                    for (let i = 0; i < tptr.length; i++) {
                        temp[i] = tptr[i];
                    }

                    if (!squares_black[0]) {
                        squares_black[0] = [];
                    }

                    alvision.transformOp<alvision.Point2f>(temp, squares_black[0],new Mult(this.rendererResolutionMultiplier));
                }

        /* calculate corners */
        this.corners3d.length = 0;
        for (var j = 0; j < this.patternSize.height.valueOf() - 1; ++j)
            for (var i = 0; i < this.patternSize.width.valueOf() - 1; ++i)
                this.corners3d.push(zero.op_Addition( pb1.op_Multiplication((i + 1) * sqWidth.valueOf())).op_Addition( pb2.op_Multiplication((j + 1) * sqHeight.valueOf()) ));

        corners.length = 0;
        this.corners3d.forEach((v, i, a) => {
            corners[i] = new alvision.Point2f();
        });

        alvision.projectPoints(this.corners3d, this.rvec, this.tvec, camMat, distCoeffs, corners);

        var whole3d = new Array<alvision.Point3f>();
        
        this.generateEdge(whole[0], whole[1], whole3d);
        this.generateEdge(whole[1], whole[2], whole3d);
        this.generateEdge(whole[2], whole[3], whole3d);
        this.generateEdge(whole[3], whole[0], whole3d);

        var whole2d = alvision.NewArray(whole3d.length, ()=> new alvision.Point2f());

        alvision.projectPoints(whole3d, this.rvec, this.tvec, camMat, distCoeffs, whole2d);
        
        var tempMat = new alvision.Mat(temp);
        alvision.approxPolyDP(new alvision.Mat(whole2d), tempMat, 1.0, true);

        var temp_whole2d = new Array<alvision.Point2f>();
        let tptr = tempMat.ptr<alvision.Point2f>("Point2f");
        for (let i = 0; i < tptr.length; i++) {
            temp_whole2d[i] = tptr[i];
        }


        var whole_contour = new Array<Array<alvision.Point2f>>(1);
        whole_contour[0] = [];
        alvision.transformOp(temp_whole2d,whole_contour[0],new Mult(this.rendererResolutionMultiplier));

        var result = new alvision.Mat();
        if (this.rendererResolutionMultiplier == 1) {
            result = bg.clone();
            alvision.drawContours(result, whole_contour, -1, alvision.Scalar.all(255),alvision.CV_FILLED,alvision.LineTypes. LINE_AA);
            alvision.drawContours(result, squares_black, -1, alvision.Scalar.all(0), alvision.CV_FILLED, alvision.LineTypes. LINE_AA);
        }
        else {
            var tmp = new alvision.Mat();
            alvision.resize(bg, tmp, alvision.Size.op_Multiplication( bg.size() , this.rendererResolutionMultiplier));
            alvision.drawContours(tmp, whole_contour, -1, alvision.Scalar.all(255), alvision.CV_FILLED,alvision.LineTypes. LINE_AA);
            alvision.drawContours(tmp, squares_black, -1, alvision.Scalar.all(0),   alvision.CV_FILLED,alvision.LineTypes. LINE_AA);
            alvision.resize(tmp, result, bg.size(), 0, 0, alvision.InterpolationFlags.INTER_AREA);
        }

        return result;
    }
    generateBasis(pb1: alvision.Point3f, pb2: alvision.Point3f): void {
        var rng = alvision.theRNG();

        var n = new alvision.Vec3f();
        for (; ;) {
            n.at(0).set( rng.uniform(-1., 1.).valueOf());
            n.at(1).set( rng.uniform(-1., 1.).valueOf());
            n.at(2).set( rng.uniform(-1., 1.).valueOf());
            var len = alvision.Vec3f.norm(n);
            n.at(0).set( n.at(0).get().valueOf() / len.valueOf());
            n.at(1).set( n.at(1).get().valueOf() / len.valueOf());
            n.at(2).set( n.at(2).get().valueOf() / len.valueOf());

            if (n.at(2).get() > this.min_cos)
                break;
        }

        var n_temp = new alvision.Vec3f(n); n_temp.at(0).set(n_temp.at(0).get().valueOf() + 100);

        var b1 = n.cross(n_temp);
        var b2 = n.cross(b1);
        var len_b1 = alvision.Vec3f.norm(b1);
        var len_b2 = alvision.Vec3f.norm(b2);


        pb1.setTo(new alvision.Point3f(b1.at(0).get().valueOf() / len_b1.valueOf(), b1.at(1).get().valueOf() / len_b1.valueOf(), b1.at(2).get().valueOf() / len_b1.valueOf()));
        pb2.setTo(new alvision.Point3f(b2.at(0).get().valueOf() / len_b1.valueOf(), b2.at(1).get().valueOf() / len_b2.valueOf(), b2.at(2).get().valueOf() / len_b2.valueOf()));
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




export class Mult implements alvision.ItransformOp<alvision.Point2f>
{
    protected m: alvision.float;
    constructor(mult: alvision.int) {
        this.m = mult;
    }


    run(p: alvision.Point2f): alvision.Point2f {
        return p.op_Multiplication(this.m);
    }
}



