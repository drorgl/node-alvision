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
    alvision.merge(Array<alvision.Mat>(3, gray), rgb);

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
        switch (pattern) {
            case CHESSBOARD:
                folder = this.ts.get_data_path() + "cv/cameracalibration/";
                break;
            case CIRCLES_GRID:
                folder = this.ts.get_data_path() + "cv/cameracalibration/circles/";
                break;
            case ASYMMETRIC_CIRCLES_GRID:
                folder = this.ts.get_data_path() + "cv/cameracalibration/asymmetric_circles/";
                break;
        }

        FileStorage fs(folder + filename, FileStorage::READ);
        FileNode board_list = fs["boards"];

        if (!fs.isOpened() || board_list.empty() || !board_list.isSeq() || board_list.size() % 2 != 0) {
            ts.printf(alvision.cvtest.TSConstants.LOG, "%s can not be readed or is not valid\n", (folder + filename));
            ts.printf(alvision.cvtest.TSConstants.LOG, "fs.isOpened=%d, board_list.empty=%d, board_list.isSeq=%d,board_list.size()%2=%d\n",
                fs.isOpened(), (int)board_list.empty(), board_list.isSeq(), board_list.size() % 2);
            this.ts.set_failed_test_info(alvision.cvtest.TS::FAIL_MISSING_TEST_DATA);
            return;
        }

        int progress = 0;
        int max_idx = (int)board_list.size() / 2;
        double sum_error = 0.0;
        int count = 0;

        for (int idx = 0; idx < max_idx; ++idx )
        {
            ts.update_context(this, idx, true);

            /* read the image */
            String img_file = board_list[idx * 2];
            Mat gray = imread(folder + img_file, 0);

            if (gray.empty()) {
                ts.printf(alvision.cvtest.TSConstants.LOG, "one of chessboard images can't be read: %s\n", img_file);
                this.ts.set_failed_test_info(alvision.cvtest.TS::FAIL_MISSING_TEST_DATA);
                return;
            }

            String _filename = folder + (String)board_list[idx * 2 + 1];
            bool doesContatinChessboard;
            Mat expected;
            {
                FileStorage fs1(_filename, FileStorage::READ);
                fs1["corners"] >> expected;
                fs1["isFound"] >> doesContatinChessboard;
                fs1.release();
            }
            size_t count_exp = static_cast<size_t>(expected.cols * expected.rows);
            Size pattern_size = expected.size();

            Array < Point2f > v;
            bool result = false;
            switch (pattern) {
                case CHESSBOARD:
                    result = findChessboardCorners(gray, pattern_size, v, CALIB_CB_ADAPTIVE_THRESH | CALIB_CB_NORMALIZE_IMAGE);
                    break;
                case CIRCLES_GRID:
                    result = findCirclesGrid(gray, pattern_size, v);
                    break;
                case ASYMMETRIC_CIRCLES_GRID:
                    result = findCirclesGrid(gray, pattern_size, v, CALIB_CB_ASYMMETRIC_GRID | algorithmFlags);
                    break;
            }
            show_points(gray, Mat(), v, pattern_size, result);

            if (result ^ doesContatinChessboard || v.size() != count_exp) {
                ts.printf(alvision.cvtest.TSConstants.LOG, "chessboard is detected incorrectly in %s\n", img_file);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                return;
            }

            if (result) {

                #ifndef WRITE_POINTS
                double err = calcError(v, expected);
                #if 0
            if(err > rough_success_error_level) {
                        ts.printf(alvision.cvtest.TSConstants.LOG, "bad accuracy of corner guesses\n");
                        ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                        continue;
                    }
                #endif
                max_rough_error = MAX(max_rough_error, err);
                #endif
                if (pattern == CHESSBOARD)
                    cornerSubPix(gray, v, Size(5, 5), Size(-1, -1), TermCriteria(TermCriteria::EPS | TermCriteria::MAX_ITER, 30, 0.1));
                //find4QuadCornerSubpix(gray, v, Size(5, 5));
                show_points(gray, expected, v, pattern_size, result);
                #ifndef WRITE_POINTS
                //        printf("called find4QuadCornerSubpix\n");
                err = calcError(v, expected);
                sum_error += err;
                count++;
                #if 1
            if(err > precise_success_error_level) {
                        ts.printf(alvision.cvtest.TSConstants.LOG, "Image %s: bad accuracy of adjusted corners %f\n", img_file, err);
                        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                        return;
                    }
                #endif
                ts.printf(alvision.cvtest.TSConstants.LOG, "Error on %s is %f\n", img_file, err);
                max_precise_error = MAX(max_precise_error, err);
                #endif
            }

            #ifdef WRITE_POINTS
            Mat mat_v(pattern_size, CV_32FC2, (void*)& v[0]);
            FileStorage fs(_filename, FileStorage::WRITE);
            fs << "isFound" << result;
            fs << "corners" << mat_v;
            fs.release();
            #endif
            progress = update_progress(progress, idx, max_idx, 0);
        }

        if (count != 0)
            sum_error /= count;
        ts.printf(alvision.cvtest.TSConstants.LOG, "Average error is %f (%d patterns have been found)\n", sum_error, count);
    }
    checkByGenerator(): boolean {
        bool res = true;

        // for some reason, this test sometimes fails on Ubuntu
        #if (defined __APPLE__ && defined __x86_64__) || defined _MSC_VER
        //theRNG() = 0x58e6e895b9913160;
        //alvision.DefaultRngAuto dra;
        //theRNG() = *ts.get_rng();

        Mat bg(Size(800, 600), CV_8UC3, Scalar::all(255));
        randu(bg, alvision.Scalar.all(0), Scalar::all(255));
        GaussianBlur(bg, bg, Size(7, 7), 3.0);

        Mat_ < float > camMat(3, 3);
        camMat << 300.f, 0.f, bg.cols / 2.f, 0, 300.f, bg.rows / 2.f, 0.f, 0.f, 1.f;

        Mat_ < float > distCoeffs(1, 5);
        distCoeffs << 1.2f, 0.2f, 0.f, 0.f, 0.f;

        const Size sizes[] = { Size(6, 6), Size(8, 6), Size(11, 12),  Size(5, 4) };
        const size_t sizes_num = sizeof(sizes) / sizeof(sizes[0]);
        const int test_num = 16;
        int progress = 0;
        for (int i = 0; i < test_num; ++i)
        {
            progress = update_progress(progress, i, test_num, 0);
            ChessBoardGenerator cbg(sizes[i % sizes_num]);

            Array < Point2f > corners_generated;

            Mat cb = cbg(bg, camMat, distCoeffs, corners_generated);

            if (!validateData(cbg, cb.size(), corners_generated)) {
                ts.printf(alvision.cvtest.TSConstants.LOG, "Chess board skipped - too small");
                continue;
            }

            /*cb = cb * 0.8 + Scalar::all(30);
            GaussianBlur(cb, cb, Size(3, 3), 0.8);     */
            //alvision.addWeighted(cb, 0.8, bg, 0.2, 20, cb);
            //alvision.namedWindow("CB"); alvision.imshow("CB", cb); alvision.waitKey();

            Array < Point2f > corners_found;
            int flags = i % 8; // need to check branches for all flags
            bool found = findChessboardCorners(cb, cbg.cornersSize(), corners_found, flags);
            if (!found) {
                ts.printf(alvision.cvtest.TSConstants.LOG, "Chess board corners not found\n");
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                res = false;
                return res;
            }

            double err = calcErrorMinError(cbg.cornersSize(), corners_found, corners_generated);
            if (err > rough_success_error_level) {
                ts.printf(alvision.cvtest.TSConstants.LOG, "bad accuracy of corner guesses");
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                res = false;
                return res;
            }
        }

        /* ***** negative ***** */
        {
            Array < Point2f > corners_found;
            bool found = findChessboardCorners(bg, Size(8, 7), corners_found);
            if (found)
                res = false;

            ChessBoardGenerator cbg(Size(8, 7));

            Array < Point2f > cg;
            Mat cb = cbg(bg, camMat, distCoeffs, cg);

            found = findChessboardCorners(cb, Size(3, 4), corners_found);
            if (found)
                res = false;

            Point2f c = std::accumulate(cg.begin(), cg.end(), Point2f(), plus<Point2f>()) * (1.f/ cg.size());

            Mat_ < double > aff(2, 3);
            aff << 1.0, 0.0, -(double)c.x, 0.0, 1.0, 0.0;
            Mat sh;
            warpAffine(cb, sh, aff, cb.size());

            found = findChessboardCorners(sh, cbg.cornersSize(), corners_found);
            if (found)
                res = false;

            Array < Array < Point > > cnts(1);
            Array<Point>& cnt = cnts[0];
            cnt.push(cg[0]); cnt.push(cg[0 + 2]);
            cnt.push(cg[7 + 0]); cnt.push(cg[7 + 2]);
            alvision.drawContours(cb, cnts, -1, Scalar::all(128), FILLED);

            found = findChessboardCorners(cb, cbg.cornersSize(), corners_found);
            if (found)
                res = false;

            alvision.drawChessboardCorners(cb, cbg.cornersSize(), Mat(corners_found), found);
        }
        #endif

        return res;
    }

    protected pattern: Pattern;
    protected algorithmFlags: alvision.int;
}


function calcError(v: Array<alvision.Point2f>, u: alvision.Mat): alvision.double
{
    var count_exp = u.cols * u.rows;
    const Point2f* u_data = u.ptr<Point2f>();

    double err = numeric_limits<double>::max();
    for( int k = 0; k < 2; ++k )
    {
        double err1 = 0;
        for( int j = 0; j < count_exp; ++j )
        {
            int j1 = k == 0 ? j : count_exp - j - 1;
            double dx = fabs( v[j].x - u_data[j1].x );
            double dy = fabs( v[j].y - u_data[j1].y );

#if defined(_L2_ERR)
            err1 += dx*dx + dy*dy;
#else
            dx = MAX( dx, dy );
            if( dx > err1 )
                err1 = dx;
#endif //_L2_ERR
            //printf("dx = %f\n", dx);
        }
        //printf("\n");
        err = min(err, err1);
    }

#if defined(_L2_ERR)
    err = sqrt(err/count_exp);
#endif //_L2_ERR

    return err;
}

const rough_success_error_level = 2.5;
const precise_success_error_level = 2;


/* ///////////////////// chess_corner_test ///////////////////////// */


function calcErrorMinError(cornSz: alvision.Size, corners_found: Array<alvision.Point2f>, corners_generated: Array<alvision.Point2f> ) : alvision.double
{
    var m1 = new alvision.Mat (cornSz, CV_32FC2, (Point2f*)&corners_generated[0]);
    Mat m2; flip(m1, m2, 0);

    Mat m3; flip(m1, m3, 1); m3 = m3.t(); flip(m3, m3, 1);

    Mat m4 = m1.t(); flip(m4, m4, 1);

    var min1 =  Math.min(calcError(corners_found, m1), calcError(corners_found, m2));
    var min2 =  Math.min(calcError(corners_found, m3), calcError(corners_found, m4));
    return Math.min(min1, min2);
}

function validateData(cbg: ChessBoardGenerator, imgSz: alvision.Size,
    corners_generated: Array<alvision.Point2f>) : boolean
{
    var cornersSize = cbg.cornersSize();
    Mat_<Point2f> mat(cornersSize.height, cornersSize.width, (Point2f*)&corners_generated[0]);

    var minNeibDist = std::numeric_limits<double>::max();
    var tmp = 0;
    for(var i = 1; i < mat.rows - 2; ++i)
        for(var j = 1; j < mat.cols - 2; ++j)
        {
            const Point2f& cur = mat(i, j);

            tmp = norm( cur - mat(i + 1, j + 1) );
            if (tmp < minNeibDist)
                tmp = minNeibDist;

            tmp = norm( cur - mat(i - 1, j + 1 ) );
            if (tmp < minNeibDist)
                tmp = minNeibDist;

            tmp = norm( cur - mat(i + 1, j - 1) );
            if (tmp < minNeibDist)
                tmp = minNeibDist;

            tmp = norm( cur - mat(i - 1, j - 1) );
            if (tmp < minNeibDist)
                tmp = minNeibDist;
        }

    const  threshold = 0.25;
    var cbsize = (max(cornersSize.width, cornersSize.height) + 1) * minNeibDist;
    var imgsize =  Math.min(imgSz.height, imgSz.width);
    return imgsize * threshold < cbsize;
}


alvision.cvtest.TEST('Calib3d_ChessboardDetector', 'accuracy', () => { CV_ChessboardDetectorTest test(CHESSBOARD); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_CirclesPatternDetector', 'accuracy', () => { CV_ChessboardDetectorTest test(CIRCLES_GRID); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_AsymmetricCirclesPatternDetector', 'accuracy', () => { CV_ChessboardDetectorTest test(ASYMMETRIC_CIRCLES_GRID); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_AsymmetricCirclesPatternDetectorWithClustering', 'accuracy', () => { CV_ChessboardDetectorTest test(ASYMMETRIC_CIRCLES_GRID, CALIB_CB_CLUSTERING); test.safe_run(); });

/* End of file. */
