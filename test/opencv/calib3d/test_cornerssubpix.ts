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

import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');

import * as _cbgen from './test_chessboardgenerator';

//#include "test_precomp.hpp"
//#include "opencv2/imgproc/imgproc_c.h"
//#include <limits>
//#include "test_chessboardgenerator.hpp"
//
//using namespace std;
//using namespace cv;

class CV_ChessboardSubpixelTest extends alvision.cvtest.BaseTest {
    constructor() {
        super();
        this.intrinsic_matrix_ = new alvision.Mat( new alvision.Size(3, 3), alvision.MatrixType.CV_64FC1);
        this.distortion_coeffs_ = new alvision.Mat(new alvision.Size(1, 4), alvision.MatrixType.CV_64FC1);
        this.image_size_ = new alvision.Size(640, 480);
    }

    protected intrinsic_matrix_: alvision.Mat;
    protected distortion_coeffs_: alvision.Mat;
    protected image_size_: alvision.Size;

    run(iii: alvision.int): void {
        var code = alvision.cvtest.FailureCode.OK;
        var progress = 0;

        var rng = this.ts.get_rng();

        const runs_count = 20;
        const max_pattern_size = 8;
        const min_pattern_size = 5;
        var bg = new alvision.Mat(this.image_size_, alvision.MatrixType.CV_8UC1, new alvision.Scalar(0));

        var sum_dist = 0.0;
        var count = 0;
        for (var i = 0; i < runs_count; i++) {
            const pattern_width = min_pattern_size + alvision.cvtest.randInt(rng).valueOf() % (max_pattern_size - min_pattern_size);
            const pattern_height = min_pattern_size + alvision.cvtest.randInt(rng).valueOf() % (max_pattern_size - min_pattern_size);
            var pattern_size: alvision.Size;
            if (pattern_width > pattern_height) {
                pattern_size = new alvision.Size(pattern_height, pattern_width);
            }
            else {
                pattern_size = new alvision.Size(pattern_width, pattern_height);
            }
            var gen_chessboard = new _cbgen.ChessBoardGenerator(new alvision.Size(pattern_size.width.valueOf()+ 1, pattern_size.height.valueOf() + 1));

            // generates intrinsic camera and distortion matrices
            this.generateIntrinsicParams();

            var corners = new Array<alvision.Point2f>();
            var chessboard_image = gen_chessboard.run1(bg, this.intrinsic_matrix_, this.distortion_coeffs_, corners);

            var test_corners = new Array<alvision.Point2f>();
            var result = alvision.findChessboardCorners(chessboard_image, pattern_size, test_corners, 15);
            if (!result) {
//                //#if 0
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Warning: chessboard was not detected! Writing image to test.png\n");
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Size = %d, %d\n", pattern_size.width, pattern_size.height);
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Intrinsic params: fx = %f, fy = %f, cx = %f, cy = %f\n",
//                    this.intrinsic_matrix_.at<double>(0, 0), this.intrinsic_matrix_.at<double>(1, 1),
//                    this.intrinsic_matrix_.at<double>(0, 2), this.intrinsic_matrix_.at<double>(1, 2));
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Distortion matrix: %f, %f, %f, %f, %f\n",
//                    this.distortion_coeffs_.at<double>(0, 0), this.distortion_coeffs_.at<double>(0, 1),
//                    this.distortion_coeffs_.at<double>(0, 2), this.distortion_coeffs_.at<double>(0, 3),
//                    this.distortion_coeffs_.at<double>(0, 4));
//
//                alvision.imwrite("test.png", chessboard_image);
//                //#endif
                continue;
            }

            var dist1 = 0.0;
            var ret = calcDistance(corners, test_corners, dist1);
            if (ret == 0) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "findChessboardCorners returns invalid corner coordinates!\n");
                code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
                break;
            }

            var chessboard_image_header = chessboard_image;
            alvision.cornerSubPix(chessboard_image_header, test_corners,
                new alvision.Size(3, 3), new alvision.Size(1, 1), new alvision.TermCriteria(alvision.TermCriteriaType.EPS | alvision.TermCriteriaType.MAX_ITER, 300, 0.1));
            alvision.find4QuadCornerSubpix(chessboard_image, test_corners,new alvision.Size(5, 5));

            var dist2 = 0.0;
            ret = calcDistance(corners, test_corners, dist2);
            if (ret == 0) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "findCornerSubpix returns invalid corner coordinates!\n");
                code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
                break;
            }

            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Error after findChessboardCorners: %f, after findCornerSubPix: %f\n",
                dist1, dist2);
            sum_dist += dist2;
            count++;

            const max_reduce_factor = 0.8;
            if (dist1 < dist2 * max_reduce_factor) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "findCornerSubPix increases average error!\n");
                code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
                break;
            }

            progress = this.update_progress(progress, i - 1, runs_count, 0).valueOf();
        }
        alvision.ASSERT_NE(0, count);
        sum_dist /= count;
        this.ts.printf(alvision.cvtest.TSConstants.LOG, "Average error after findCornerSubpix: %f\n", sum_dist);

        if (code < 0)
            this.ts.set_failed_test_info(code);
    }
    generateIntrinsicParams(): void {
        var rng = this.ts.get_rng();
        const max_focus_length = 1000.0;
        const max_focus_diff = 5.0;

        var fx = alvision.cvtest.randReal(rng).valueOf() * max_focus_length;
        var fy = fx + alvision.cvtest.randReal(rng).valueOf() * max_focus_diff;
        var cx = this.image_size_.width .valueOf()/ 2;
        var cy = this.image_size_.height.valueOf() / 2;

        var k1 = 0.5 *  alvision.cvtest.randReal(rng).valueOf();
        var k2 = 0.05 * alvision.cvtest.randReal(rng).valueOf();
        var p1 = 0.05 * alvision.cvtest.randReal(rng).valueOf();
        var p2 = 0.05 * alvision.cvtest.randReal(rng).valueOf();
        var k3 = 0.0;

        this.intrinsic_matrix_ = new alvision.Mat(new alvision.Mat1d(3, 3,[ fx, 0.0, cx, 0.0, fy, cy, 0.0, 0.0, 1.0]));
        this.distortion_coeffs_ = new alvision.Mat(new alvision.Mat1d(1, 5,[ k1, k2, p1, p2, k3]));
    }
}



function calcDistance(set1: Array<alvision.Point2f>, set2: Array<alvision.Point2f>, mean_dist: alvision.double) : alvision.int
{
    if(set1.length != set2.length)
    {
        return 0;
    }

    var indices = new Array<alvision.int>() ;
    var sum_dist = 0.0;
    for(var i = 0; i < set1.length; i++)
    {
        var min_dist = alvision.DBL_MAX;// std::alvision.DBL_MAX;
        var min_idx = -1;

        for(var j = 0; j < set2.length; j++)
        {
            var dist = alvision.Point2f.norm(alvision.Point2f.op_Substraction( set1[i] , set2[j]));
            if(dist < min_dist)
            {
                min_idx = j;
                min_dist = dist.valueOf();
            }
        }

        // check validity of min_idx
        if(min_idx == -1)
        {
            return 0;
        }

        
        //Array<int>::iterator it = std::find(indices.begin(), indices.end(), min_idx);
        //if(it != indices.end())
        if (alvision.countOp(indices, min_idx) > 1)
        {
            // there are two points in set1 corresponding to the same point in set2
            return 0;
        }
        indices.push(min_idx);

//        console.log(util.format("dist %d = %f\n", (int)i, min_dist);

        sum_dist += min_dist*min_dist;
    }

    mean_dist = Math.sqrt(sum_dist/set1.length);
//    console.log(util.format("sum_dist = %f, set1.size() = %d, mean_dist = %f\n", sum_dist, (int)set1.size(), mean_dist);

    return 1;
}

/* ///////////////////// chess_corner_test ///////////////////////// */



alvision.cvtest.TEST('Calib3d_ChessboardSubPixDetector', 'accuracy', () => { var test = new CV_ChessboardSubpixelTest(); test.safe_run(); });

/* End of file. */
