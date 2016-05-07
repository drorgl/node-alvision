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
//#include <time.h>
//
//#define IMGPROC_BOUNDINGRECT_ERROR_DIFF 1
//
//#define MESSAGE_ERROR_DIFF "Bounding rectangle found by boundingRect function is incorrect."
//
//using namespace cv;
//using namespace std;

class CV_BoundingRectTest extends alvision.cvtest.ArrayTest {
    run(iii: alvision.int): void {
        var src_veci = new Array<alvision.Point>() ;
        if (!this.checking_function_work(src_veci, 0)) return;
        var src_vecf = new Array<alvision.Point2f>();
        this.checking_function_work(src_vecf, 1);

    }

    generate_src_points<T>(src: Array<alvision.Point_<T>>, n: alvision.int): void {
        src.length = 0;
        for (var i = 0; i < n; ++i)
        src.push(new alvision.Point_<T>(alvision.randu<T>(), alvision.randu<T>()));
    }
    get_bounding_rect<T>(src: Array<alvision.Point_<T>>): alvision.Rect {
        var n = src.length;//(int)src.size();
        var min_w = std::numeric_limits<T>::max(), max_w = std::numeric_limits<T>::min();
        var min_h = min_w, max_h = max_w;

        for (var i = 0; i < n; ++i)
        {
            min_w = Math.min(src.atGet(i).x, min_w);
            max_w = Math.max(src.atGet(i).x, max_w);
            min_h = Math.min(src.atGet(i).y, min_h);
            max_h = Math.max(src.atGet(i).y, max_h);
        }

        return new alvision.Rect(min_w, min_h, max_w- min_w + 1, max_h- min_h + 1);

    }
    checking_function_work<T>(src: Array<alvision.Point_<T>>, type: alvision.int): boolean {
        const  MAX_COUNT_OF_POINTS = 1000;
        const  N = 10000;

        for (var k = 0; k < N; ++k)
        {

            var rng = this.ts.get_rng();

            var n = rng.next() % MAX_COUNT_OF_POINTS + 1;

            this.generate_src_points(src, n);

            var right = this.get_bounding_rect<T>(src);

            var rect = [ alvision.boundingRect(src), alvision.boundingRect(new alvision.Mat(src)) ];

            for (var i = 0; i < 2; ++i) if (rect[i] != right) {
                console.log("Checking for the work of boundingRect function...");
                console.log("Type of src points: ");
                switch (type) {
                    case 0: { console.log( "INT"  ); break; }
                    case 1: { console.log( "FLOAT"); break; }
                    default: break;
                }
                console.log("Src points are stored as " + (i == 0) ? "VECTOR" : "MAT");
                console.log("Number of points: " + n);
                console.log("Right rect (x, y, w, h): [" + right.x + ", " + right.y + ", " + right.width + ", " + right.height + "]");
                console.log("Result rect (x, y, w, h): [" + rect[i].x + ", " + rect[i].y + ", " + rect[i].width + ", " + rect[i].height + "]");
                
                alvision.CV_Error(IMGPROC_BOUNDINGRECT_ERROR_DIFF, MESSAGE_ERROR_DIFF);
                return false;
            }

        }

        return true;

    }
}



alvision.cvtest.TEST('Imgproc_BoundingRect', 'accuracy', () => { var test = new CV_BoundingRectTest(); test.safe_run(); });
