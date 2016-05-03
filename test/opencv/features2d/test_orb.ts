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
//#include "opencv2/highgui.hpp"
//
//using namespace std;
//using namespace cv;

alvision.cvtest.TEST('Features2D_ORB', '_1996',()=>
{
    
    var fd = alvision.ORB.create(10000, 1.2, 8, 31, 0, 2, alvision.ORBEnum.HARRIS_SCORE, 31, 20);
    //Ptr<DescriptorExtractor> de = fd;

    var image = alvision.imread(alvision.cvtest.TS.ptr().get_data_path() + "shared/lena.png");
    alvision.ASSERT_FALSE(image == null);

    var roi = new alvision.Mat(image.size(),alvision.MatrixType.CV_8UC1, new alvision.Scalar(0));

    var poly = [new alvision.Point(100, 20), new alvision.Point(300, 50), new alvision.Point(400, 200), new alvision.Point(10, 500)]
    alvision.fillConvexPoly(roi, poly, new alvision.Scalar(255));

    var keypoints = new Array<alvision.KeyPoint>();
    fd.detect(image,(kp)=> keypoints = kp, roi);
    var descriptors = new alvision.Mat();
    fd.compute(image, keypoints,(kp)=>keypoints=kp, descriptors);

    //image.setTo(Scalar(255,255,255), roi);

    var roiViolations = 0;
    keypoints.forEach((kp) => {

        var x = Math.round(kp.pt.x.valueOf());
        var y = Math.round(kp.pt.y.valueOf());

        alvision.ASSERT_LE(0, x);
        alvision.ASSERT_LE(0, y);
        alvision.ASSERT_GT(image.cols.valueOf(), x);
        alvision.ASSERT_GT(image.rows.valueOf(), y);

        // if (!roi.at<uchar>(y,x))
        // {
        //     roiViolations++;
        //     circle(image, kp->pt, 3, Scalar(0,0,255));
        // }
    });

    // if(roiViolations)
    // {
    //     imshow("img", image);
    //     waitKey();
    // }

    alvision.ASSERT_EQ(0, roiViolations);
});
