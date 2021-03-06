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
// Copyright (C) 2013, OpenCV Foundation, all rights reserved.
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

import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');


//#include "test_precomp.hpp"
//#include "opencv2/photo.hpp"
//#include <string>
//
//using namespace cv;
//using namespace std;

const numerical_precision = 10.;

alvision.cvtest.TEST('Photo_Decolor', 'regression', () => {
    var folder = alvision.cvtest.TS.ptr().get_data_path() + "decolor/";
    var original_path = folder + "color_image_1.png";

    var original = alvision.imread(original_path, alvision.ImreadModes.IMREAD_COLOR);

    alvision.ASSERT_FALSE(original == null , "Could not load input image " + original_path);
    alvision.ASSERT_FALSE(original.channels() != 3, "Load color input image " + original_path);

    var grayscale = new alvision.Mat();
    var color_boost = new alvision.Mat();

    alvision.decolor(original, grayscale, color_boost);

    var reference_grayscale = alvision.imread(folder + "grayscale_reference.png", 0 /* == grayscale image*/);
    var error_grayscale = alvision.cvtest.norm(reference_grayscale, grayscale, alvision.NormTypes. NORM_L1);
    alvision.EXPECT_LE(error_grayscale.valueOf(), numerical_precision);

    var reference_boost = alvision.imread(folder + "boost_reference.png");
    var error_boost = alvision.cvtest.norm(reference_boost, color_boost, alvision.NormTypes. NORM_L1);
    alvision.EXPECT_LE(error_boost.valueOf(), numerical_precision);
});
