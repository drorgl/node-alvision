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
import colors = require("colors");
import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');

import * as chessgen from './test_chessboardgenerator';

//#include "test_precomp.hpp"
//#include "test_chessboardgenerator.hpp"
//
//#include <functional>
//#include <limits>
//#include <numeric>
//
//using namespace std;
//using namespace cv;

//#define _L2_ERR

function show_points(gray: alvision.Mat, u: alvision.Mat, v: Array<alvision.Point2f>, pattern_size: alvision.Size , was_found  : boolean) : void
{
    var rgb = new alvision.Mat ( gray.size(), alvision.MatrixType.CV_8U);
    alvision.merge(alvision.NewArray<alvision.Mat>(3, () =>gray ), rgb);

    for(var i = 0; i < v.length; i++ )
        alvision.circle( rgb, v[i], 3, new alvision.Scalar(255, 0, 0), alvision.CV_FILLED);

    if( !u.empty() )
    {
        var u_data = u.ptr<alvision.Point2f>("Point2f");
        var count = u.cols.valueOf() * u.rows.valueOf();
        for(var i = 0; i < count; i++ )
            alvision.circle( rgb, u_data[i], 3, new alvision.Scalar(0, 255, 0), alvision.CV_FILLED);
    }
    if (!v.length)
    {
        var corners = new alvision.Mat (v.length, 1, alvision.MatrixType.CV_32FC2, v);
        alvision.drawChessboardCorners( rgb, pattern_size, corners, was_found );
    }
    //namedWindow( "test", 0 ); imshow( "test", rgb ); waitKey(0);
}


enum Pattern { CHESSBOARD, CIRCLES_GRID, ASYMMETRIC_CIRCLES_GRID };

class CV_ChessboardDetectorTest extends alvision.cvtest.BaseTest {
    constructor(_pattern: Pattern, _algorithmFlags: alvision.int = 0) {
        super();
        this.pattern = _pattern;
        this.algorithmFlags = _algorithmFlags;
    }

    run(iii: alvision.int): void {
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);

        /*if (!checkByGenerator())
            return;*/
        switch (this.pattern) {
            case Pattern.CHESSBOARD:
                this.checkByGenerator();
                if (this.ts.get_err_code() != alvision.cvtest.FailureCode.OK) {
                    break;
                }

                this.run_batch("negative_list.dat");
                if (this.ts.get_err_code() != alvision.cvtest.FailureCode.OK) {
                    break;
                }

                this.run_batch("chessboard_list.dat");
                if (this.ts.get_err_code() != alvision.cvtest.FailureCode.OK) {
                    break;
                }

                this.run_batch("chessboard_list_subpixel.dat");
                break;
            case Pattern.CIRCLES_GRID:
                this.run_batch("circles_list.dat");
                break;
            case Pattern.ASYMMETRIC_CIRCLES_GRID:
                this.run_batch("acircles_list.dat");
                break;
        }
    }
    run_batch(filename: string): void {
        this.ts.printf(alvision.cvtest.TSConstants.LOG, "\nRunning batch %s\n", filename);
        //#define WRITE_POINTS 1
        //#ifndef WRITE_POINTS
        var max_rough_error = 0, max_precise_error = 0;
        //#endif
        var folder = "";
        switch (this.pattern) {
            case Pattern.CHESSBOARD:
                folder = this.ts.get_data_path() + "cv/cameracalibration/";
                break;
            case Pattern.CIRCLES_GRID:
                folder = this.ts.get_data_path() + "cv/cameracalibration/circles/";
                break;
            case Pattern.ASYMMETRIC_CIRCLES_GRID:
                folder = this.ts.get_data_path() + "cv/cameracalibration/asymmetric_circles/";
                break;
        }

        var fs = new alvision.FileStorage(folder + filename, alvision.FileStorageMode.READ);
        var board_list = fs["boards"];

        if (!fs.isOpened() || board_list == null || !board_list.isSeq() || board_list.size().valueOf() % 2 != 0) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "%s can not be readed or is not valid\n", (folder + filename));
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "fs.isOpened=%d, board_list.empty=%d, board_list.isSeq=%d,board_list.size()%2=%d\n",
                fs.isOpened(), board_list == null, board_list.isSeq(), board_list.size().valueOf() % 2);
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA);
            return;
        }

        var progress = 0;
        var max_idx = board_list.size().valueOf() / 2;
        var sum_error = 0.0;
        var count = 0;

        for (var idx = 0; idx < max_idx; ++idx )
        {
            this.ts.update_context(this, idx, true);

            /* read the image */
            var img_file = board_list[idx * 2];
            var gray = alvision.imread(folder + img_file, 0);

            if (gray == null) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "one of chessboard images can't be read: %s\n", img_file);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA);
                return;
            }

            var _filename = folder + board_list[idx * 2 + 1];
            var doesContatinChessboard: boolean;
            var expected = new alvision.Mat();
            {
                var fs1 = new alvision.FileStorage (_filename,alvision.FileStorageMode.READ);
                expected = fs1.nodes["corners"].readMat();
                doesContatinChessboard = fs1.nodes["isFound"].readInt() != 0;
                fs1.release();
            }
            var count_exp = (expected.cols.valueOf() * expected.rows.valueOf());
            var pattern_size = expected.size();

            var v = new Array<alvision.Point2f>();
            var result = false;
            switch (this.pattern) {
                case Pattern.CHESSBOARD:
                    result = alvision.findChessboardCorners(gray, pattern_size, v, alvision.CALIB_CB.CALIB_CB_ADAPTIVE_THRESH | alvision.CALIB_CB.CALIB_CB_NORMALIZE_IMAGE);
                    break;
                case Pattern.CIRCLES_GRID:
                    result = alvision.findCirclesGrid(gray, pattern_size, v);
                    break;
                case Pattern.ASYMMETRIC_CIRCLES_GRID:
                    result = alvision.findCirclesGrid(gray, pattern_size, v, alvision.CALIB_CB_SYM.CALIB_CB_ASYMMETRIC_GRID | this.algorithmFlags.valueOf());
                    break;
            }
            show_points(gray,new alvision. Mat(), v, pattern_size, result);

            if (result ^ doesContatinChessboard || v.length != count_exp) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "chessboard is detected incorrectly in %s\n", img_file);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                return;
            }

            if (result) {

                //#ifndef WRITE_POINTS
                var err = calcError(v, expected);
//                #if 0
//            if(err > rough_success_error_level) {
//                        ts.printf(alvision.cvtest.TSConstants.LOG, "bad accuracy of corner guesses\n");
//                        ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
//                        continue;
//                    }
//                #endif
                max_rough_error = Math.max(max_rough_error, err.valueOf());
                //#endif
                if (this.pattern == Pattern.CHESSBOARD)
                    alvision.cornerSubPix(gray, v, new alvision.Size(5, 5), new alvision.Size(-1, -1), new alvision.TermCriteria(alvision.TermCriteriaType.EPS | alvision.TermCriteriaType.MAX_ITER, 30, 0.1));
                //find4QuadCornerSubpix(gray, v, Size(5, 5));
                show_points(gray, expected, v, pattern_size, result);
                //#ifndef WRITE_POINTS
                //        printf("called find4QuadCornerSubpix\n");
                err = calcError(v, expected);
                sum_error += err.valueOf();
                count++;
                //#if 1
                if(err > precise_success_error_level) {
                        this.ts.printf(alvision.cvtest.TSConstants.LOG, "Image %s: bad accuracy of adjusted corners %f\n", img_file, err);
                        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                        return;
                    }
                //#endif
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Error on %s is %f\n", img_file, err);
                max_precise_error = Math.max(max_precise_error, err.valueOf());
                //#endif
            }

            //#ifdef WRITE_POINTS
            var mat_v = new alvision.Mat (pattern_size,alvision.MatrixType. CV_32FC2, v);
            var fs = new alvision.FileStorage (_filename,alvision.FileStorageMode.WRITE);
            fs.write("isFound", result);
            fs.write("corners", mat_v);
            fs.release();
            //#endif
            progress = this.update_progress(progress, idx, max_idx, 0).valueOf();
        }

        if (count != 0)
            sum_error /= count;
        this.ts.printf(alvision.cvtest.TSConstants.LOG, "Average error is %f (%d patterns have been found)\n", sum_error, count);
    }
    checkByGenerator(): boolean {
        var res = true;

        // for some reason, this test sometimes fails on Ubuntu
        //#if (defined __APPLE__ && defined __x86_64__) || defined _MSC_VER
        //theRNG() = 0x58e6e895b9913160;
        //alvision.DefaultRngAuto dra;
        //theRNG() = *ts.get_rng();

        var bg = new alvision.Mat (new alvision.Size(800, 600),alvision.MatrixType. CV_8UC3,alvision. Scalar.all(255));
        alvision.randu(bg, alvision.Scalar.all(0),alvision. Scalar.all(255));
        alvision.GaussianBlur(bg, bg,new alvision. Size(7, 7), 3.0);

        var camMat = new alvision.Matf(3, 3, [300., 0., bg.cols.valueOf() / 2., 0, 300., bg.rows.valueOf() / 2., 0., 0., 1.]);
        //camMat << 300., 0., bg.cols / 2., 0, 300., bg.rows / 2., 0., 0., 1.;

        var distCoeffs = new alvision.Matf(1, 5, [1.2, 0.2, 0., 0., 0.]);
        //distCoeffs << 1.2, 0.2, 0., 0., 0.;

        const sizes = [new alvision. Size(6, 6),new alvision. Size(8, 6),new alvision. Size(11, 12),new alvision.  Size(5, 4) ];
        const sizes_num = sizes.length;// sizeof(sizes) / sizeof(sizes[0]);
        const test_num = 16;
        var progress = 0;
        for (var i = 0; i < test_num; ++i)
        {
            progress = this.update_progress(progress, i, test_num, 0).valueOf();
            var cbg = new chessgen.ChessBoardGenerator (sizes[i % sizes_num]);

            var corners_generated = new Array<alvision.Point2f>();

            var cb = cbg.run1(bg, new alvision.Mat( camMat),new alvision.Mat( distCoeffs), corners_generated);

            if (!validateData(cbg, cb.size(), corners_generated)) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Chess board skipped - too small");
                continue;
            }

            /*cb = cb * 0.8 + Scalar::all(30);
            GaussianBlur(cb, cb, Size(3, 3), 0.8);     */
            //alvision.addWeighted(cb, 0.8, bg, 0.2, 20, cb);
            //alvision.namedWindow("CB"); alvision.imshow("CB", cb); alvision.waitKey();

            var corners_found = new Array<alvision.Point2f>();
            var flags = i % 8; // need to check branches for all flags
            var found = alvision.findChessboardCorners(cb, cbg.cornersSize(), corners_found, flags);
            if (!found) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Chess board corners not found\n");
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                res = false;
                return res;
            }

            var err = calcErrorMinError(cbg.cornersSize(), corners_found, corners_generated);
            if (err > rough_success_error_level) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "bad accuracy of corner guesses");
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                res = false;
                return res;
            }
        }

        /* ***** negative ***** */
        {
            var corners_found = new Array<alvision.Point2f>();
            var found = alvision.findChessboardCorners(bg, new alvision.Size(8, 7), corners_found);
            if (found)
                res = false;

            var cbg = new chessgen.ChessBoardGenerator (new alvision.Size(8, 7));

            var cg = new Array<alvision.Point2f>();
            var cb = cbg.run1(bg,new alvision.Mat( camMat),new alvision.Mat( distCoeffs), cg);

            found = alvision.findChessboardCorners(cb,new alvision.Size(3, 4), corners_found);
            if (found)
                res = false;

            Point2f c =  std::accumulate(cg.begin(), cg.end(), Point2f(), plus<Point2f>()) * (1.f/ cg.size());

            var aff = new alvision.Matd(2, 3, [1.0, 0.0, -c.x, 0.0, 1.0, 0.0]);
            //aff << 1.0, 0.0, -(double)c.x, 0.0, 1.0, 0.0;
            var sh = new alvision.Mat();
            alvision.warpAffine(cb, sh, new alvision.Mat(aff), cb.size());

            found = alvision.findChessboardCorners(sh, cbg.cornersSize(), corners_found);
            if (found)
                res = false;

            var cnts = new Array<Array<alvision.Point>> (1);
            var cnt = cnts[0];
            cnt.push(cg[0]); cnt.push(cg[0 + 2]);
            cnt.push(cg[7 + 0]); cnt.push(cg[7 + 2]);
            alvision.drawContours(cb, cnts, -1, alvision.Scalar.all(128),alvision.CV_FILLED);

            found = alvision.findChessboardCorners(cb, cbg.cornersSize(), corners_found);
            if (found)
                res = false;

            alvision.drawChessboardCorners(cb, cbg.cornersSize(), Mat(corners_found), found);
        }
        //#endif

        return res;
    }

    protected pattern: Pattern;
    protected algorithmFlags: alvision.int;
}


function calcError(v: Array<alvision.Point2f>, u: alvision.Mat): alvision.double {
    var count_exp = u.cols.valueOf() * u.rows.valueOf();
    const u_data = u.ptr<alvision.Point2f>("Point2f");

    var err = alvision.DBL_MAX;// alvision.DBL_MAX;
    for (var k = 0; k < 2; ++k) {
        var err1 = 0;
        for (var j = 0; j < count_exp; ++j) {
            var j1 = k == 0 ? j : count_exp - j - 1;
            var dx = Math.abs(v[j].x.valueOf() - u_data[j1].x.valueOf());
            var dy = Math.abs(v[j].y.valueOf() - u_data[j1].y.valueOf());

            //#if defined(_L2_ERR)
            err1 += dx * dx + dy * dy;
            //#else
            dx = Math.max(dx, dy);
            if (dx > err1)
                err1 = dx;
            //#endif //_L2_ERR
            //printf("dx = %f\n", dx);
        }
        //printf("\n");
        err = Math.min(err, err1);
    }

    //#if defined(_L2_ERR)
    err = Math.sqrt(err / count_exp);
    //#endif //_L2_ERR

    return err;
}

const rough_success_error_level = 2.5;
const precise_success_error_level = 2;


/* ///////////////////// chess_corner_test ///////////////////////// */


function calcErrorMinError(cornSz: alvision.Size, corners_found: Array<alvision.Point2f>, corners_generated: Array<alvision.Point2f> ) : alvision.double
{
    var m1 = new alvision.Mat (cornSz,alvision.MatrixType. CV_32FC2, corners_generated);
    Mat m2; flip(m1, m2, 0);

    Mat m3; flip(m1, m3, 1); m3 = m3.t(); flip(m3, m3, 1);

    var m4 = m1.t(); flip(m4, m4, 1);

    var min1 =  Math.min(calcError(corners_found, m1), calcError(corners_found, m2));
    var min2 =  Math.min(calcError(corners_found, m3), calcError(corners_found, m4));
    return Math.min(min1, min2);
}

function validateData(cbg: chessgen. ChessBoardGenerator, imgSz: alvision.Size,
    corners_generated: Array<alvision.Point2f>) : boolean
{
    var cornersSize = cbg.cornersSize();
    var mat = new alvision.MatPoint2f(cornersSize.height, cornersSize.width, corners_generated);

    var minNeibDist = alvision.DBL_MAX;// std::alvision.DBL_MAX;
    var tmp = 0;
    for(var i = 1; i < mat.rows.valueOf() - 2; ++i)
        for(var j = 1; j < mat.cols.valueOf() - 2; ++j)
        {
            const cur = mat.Element(i, j);

            tmp = norm( cur.op_Substraction( mat.Element(i + 1, j + 1)) );
            if (tmp < minNeibDist)
                tmp = minNeibDist;

            tmp = norm(cur.op_Substraction( mat.Element(i - 1, j + 1)));
            if (tmp < minNeibDist)
                tmp = minNeibDist;

            tmp = norm( cur.op_Substraction( mat.Element(i + 1, j - 1) ));
            if (tmp < minNeibDist)
                tmp = minNeibDist;

            tmp = norm(cur.op_Substraction (mat.Element(i - 1, j - 1)));
            if (tmp < minNeibDist)
                tmp = minNeibDist;
        }

    const  threshold = 0.25;
    var cbsize = (Math.max(cornersSize.width.valueOf(), cornersSize.height.valueOf()) + 1) * minNeibDist;
    var imgsize =  Math.min(imgSz.height.valueOf(), imgSz.width.valueOf());
    return imgsize * threshold < cbsize;
}


alvision.cvtest.TEST('Calib3d_ChessboardDetector', 'accuracy', () => { var test = new CV_ChessboardDetectorTest(Pattern.CHESSBOARD); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_CirclesPatternDetector', 'accuracy', () => { var test = new CV_ChessboardDetectorTest(Pattern.CIRCLES_GRID); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_AsymmetricCirclesPatternDetector', 'accuracy', () => { var test = new CV_ChessboardDetectorTest(Pattern.ASYMMETRIC_CIRCLES_GRID); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_AsymmetricCirclesPatternDetectorWithClustering', 'accuracy', () => { var test = new CV_ChessboardDetectorTest(Pattern.ASYMMETRIC_CIRCLES_GRID, alvision.CALIB_CB_SYM.CALIB_CB_CLUSTERING); test.safe_run(); });

/* End of file. */
