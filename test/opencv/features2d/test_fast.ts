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

#include "test_precomp.hpp"

using namespace std;
using namespace cv;

class CV_FastTest  extends alvision.cvtest.BaseTest
{
public:
    CV_FastTest();
    ~CV_FastTest();
protected:
    void run(int);
};

CV_FastTest::CV_FastTest() {}
CV_FastTest::~CV_FastTest() {}

void CV_FastTest::run( int )
{
  for(int type=0; type <= 2; ++type) {
    Mat image1 = imread(this.ts.get_data_path() + "inpaint/orig.png");
    Mat image2 = imread(this.ts.get_data_path() + "cameracalibration/chess9.png");
    string xml = this.ts.get_data_path() + format("fast/result%d.xml", type);

    if (image1.empty() || image2.empty())
    {
        this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA );
        return;
    }

    Mat gray1, gray2;
    cvtColor(image1, gray1, COLOR_BGR2GRAY);
    cvtColor(image2, gray2, COLOR_BGR2GRAY);

    Array<KeyPoint> keypoints1;
    Array<KeyPoint> keypoints2;
    FAST(gray1, keypoints1, 30, true, type);
    FAST(gray2, keypoints2, (type > 0 ? 30 : 20), true, type);

    for(size_t i = 0; i < keypoints1.size(); ++i)
    {
        const KeyPoint& kp = keypoints1[i];
        alvision.circle(image1, kp.pt, Math.round(kp.size/2), Scalar(255, 0, 0));
    }

    for(size_t i = 0; i < keypoints2.size(); ++i)
    {
        const KeyPoint& kp = keypoints2[i];
        alvision.circle(image2, kp.pt, Math.round(kp.size/2), Scalar(255, 0, 0));
    }

    Mat kps1(1, (int)(keypoints1.size() * sizeof(KeyPoint)), CV_8U, &keypoints1[0]);
    Mat kps2(1, (int)(keypoints2.size() * sizeof(KeyPoint)), CV_8U, &keypoints2[0]);

    FileStorage fs(xml, FileStorage::READ);
    if (!fs.isOpened())
    {
        fs.open(xml, FileStorage::WRITE);
        if (!fs.isOpened())
        {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            return;
        }
        fs << "exp_kps1" << kps1;
        fs << "exp_kps2" << kps2;
        fs.release();
        fs.open(xml, FileStorage::READ);
        if (!fs.isOpened())
        {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            return;
        }
    }

    Mat exp_kps1, exp_kps2;
    read( fs["exp_kps1"], exp_kps1, Mat() );
    read( fs["exp_kps2"], exp_kps2, Mat() );
    fs.release();

     if ( exp_kps1.size != kps1.size || 0 != alvision.cvtest.norm(exp_kps1, kps1,alvision.NormTypes. NORM_L2) ||
          exp_kps2.size != kps2.size || 0 != alvision.cvtest.norm(exp_kps2, kps2,alvision.NormTypes. NORM_L2))
    {
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
        return;
    }

    /*alvision.namedWindow("Img1"); alvision.imshow("Img1", image1);
    alvision.namedWindow("Img2"); alvision.imshow("Img2", image2);
    alvision.waitKey(0);*/
  }

  this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
}

TEST(Features2d_FAST, regression) { CV_FastTest test; test.safe_run(); }
