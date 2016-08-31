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
//
//using namespace cv;
//using namespace std;

alvision.cvtest.TEST('MultiBandBlender', 'CanBlendTwoImages', () => {
    var image1 = alvision.imread(alvision.cvtest.TS.ptr().get_data_path() + "cv/shared/baboon.png");
    var image2 = alvision.imread(alvision.cvtest.TS.ptr().get_data_path() + "cv/shared/lena.png");
    alvision.ASSERT_EQ(image1.rows, image2.rows); alvision.ASSERT_EQ(image1.cols, image2.cols);

    var image1s = new alvision.Mat();
    var image2s = new alvision.Mat();
    image1.convertTo(image1s, alvision.MatrixType.CV_16S);
    image2.convertTo(image2s, alvision.MatrixType.CV_16S);

    var mask1 = new alvision.Mat(image1s.size(), alvision.MatrixType.CV_8U);
    mask1.roi(new alvision.Rect(0, 0, mask1.cols().valueOf() / 2, mask1.rows())).setTo(255);
    mask1.roi(new alvision.Rect(mask1.cols().valueOf() / 2, 0, mask1.cols().valueOf() - mask1.cols().valueOf() / 2, mask1.rows())).setTo(0);

    var mask2 = new alvision.Mat(image2s.size(), alvision.MatrixType.CV_8U);
    mask2.roi(new alvision.Rect(0, 0, mask2.cols().valueOf() / 2, mask2.rows())).setTo(0);
    mask2.roi(new alvision.Rect(mask2.cols().valueOf() / 2, 0, mask2.cols().valueOf() - mask2.cols().valueOf() / 2, mask2.rows())).setTo(255);

    var blender = new alvision.detail_blenders.MultiBandBlender(false, 5);
    //detail::MultiBandBlender blender(false, 5);

    blender.prepare(new alvision.Rect(0, 0, Math.max(image1s.cols().valueOf(), image2s.cols().valueOf()), Math.max(image1s.rows().valueOf(), image2s.rows().valueOf())));
    blender.feed(image1s, mask1,new alvision. Point(0, 0));
    blender.feed(image2s, mask2,new alvision. Point(0, 0));

    var result_s = new alvision.Mat();
    var result_mask = new alvision.Mat();
    blender.blend(result_s, result_mask);
    var result = new alvision.Mat();
    result_s.convertTo(result, alvision.MatrixType.CV_8U);

    var expected = alvision.imread(alvision.cvtest.TS.ptr().get_data_path() + "stitching/baboon_lena.png");
    var psnr = alvision.cvtest.PSNR(expected, result);
    alvision.EXPECT_GE(psnr.valueOf(), 50);
});
