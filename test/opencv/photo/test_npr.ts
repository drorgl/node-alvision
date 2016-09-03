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

const numerical_precision = 100.;

alvision.cvtest.TEST('Photo_NPR_EdgePreserveSmoothing_RecursiveFilter', 'regression', () => {
    var folder = alvision.cvtest.TS.ptr().get_data_path() + "npr/";
    var original_path = folder + "test1.png";

    var source = alvision.imread(original_path,alvision.ImreadModes. IMREAD_COLOR);

    alvision.ASSERT_FALSE(source.empty(), "Could not load input image " + original_path);

    var result = new alvision.Mat();
    alvision.edgePreservingFilter(source, result, 1);

    var reference = alvision.imread(folder + "smoothened_RF_reference.png");
    var error = alvision.cvtest.norm(reference, result,alvision.NormTypes. NORM_L1);
    alvision.EXPECT_LE(error, numerical_precision);
});

alvision.cvtest.TEST('Photo_NPR_EdgePreserveSmoothing_NormConvFilter', 'regression', () => {
    var folder = alvision.cvtest.TS.ptr().get_data_path() + "npr/";
    var original_path = folder + "test1.png";

    var source = alvision.imread(original_path,alvision.ImreadModes. IMREAD_COLOR);

    alvision.ASSERT_FALSE(source.empty(), "Could not load input image " + original_path);

    var result = new alvision.Mat();
    alvision.edgePreservingFilter(source, result, 2);

    var reference = alvision.imread(folder + "smoothened_NCF_reference.png");
    var error = alvision.cvtest.norm(reference, result,alvision.NormTypes.NORM_L1);
    alvision.EXPECT_LE(error, numerical_precision);

});

alvision.cvtest.TEST('Photo_NPR_DetailEnhance', 'regression', () => {
    var folder = alvision.cvtest.TS.ptr().get_data_path() + "npr/";
    var original_path = folder + "test1.png";

    var source = alvision.imread(original_path,alvision.ImreadModes. IMREAD_COLOR);

    alvision.ASSERT_FALSE(source.empty(), "Could not load input image " + original_path);

    var result = new alvision.Mat();
    alvision.detailEnhance(source, result);

    var reference = alvision.imread(folder + "detail_enhanced_reference.png");
    var error = alvision.cvtest.norm(reference, result,alvision.NormTypes.NORM_L1);
    alvision.EXPECT_LE(error, numerical_precision);
});

alvision.cvtest.TEST('Photo_NPR_PencilSketch', 'regression', () => {
    var folder = alvision.cvtest.TS.ptr().get_data_path() + "npr/";
    var original_path = folder + "test1.png";

    var source = alvision.imread(original_path,alvision.ImreadModes. IMREAD_COLOR);

    alvision.ASSERT_FALSE(source.empty(), "Could not load input image " + original_path);

    var pencil_result = new alvision.Mat(), color_pencil_result = new alvision.Mat();

    alvision.pencilSketch(source, pencil_result, color_pencil_result, 10, 0.1, 0.03);

    var pencil_reference = alvision.imread(folder + "pencil_sketch_reference.png", 0 /* == grayscale*/);
    var pencil_error = alvision.norm(pencil_reference, pencil_result,alvision.NormTypes. NORM_L1);
    alvision.EXPECT_LE(pencil_error, numerical_precision);

    var color_pencil_reference = alvision.imread(folder + "color_pencil_sketch_reference.png");
    var color_pencil_error = alvision.cvtest.norm(color_pencil_reference, color_pencil_result,alvision.NormTypes. NORM_L1);
    alvision.EXPECT_LE(color_pencil_error, numerical_precision);
});

alvision.cvtest.TEST('Photo_NPR_Stylization', 'regression', () => {
    var folder = alvision.cvtest.TS.ptr().get_data_path() + "npr/";
    var original_path = folder + "test1.png";

    var source = alvision.imread(original_path, alvision.ImreadModes.IMREAD_COLOR);

    alvision.ASSERT_FALSE(source.empty(),"Could not load input image " + original_path);

    var result = new alvision.Mat();
    alvision.stylization(source, result);

    var stylized_reference = alvision.imread(folder + "stylized_reference.png");
    var stylized_error = alvision.cvtest.norm(stylized_reference, result,alvision.NormTypes. NORM_L1);
    alvision.EXPECT_LE(stylized_error, numerical_precision);

});
