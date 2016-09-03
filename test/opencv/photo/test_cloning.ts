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
//
//
//#define OUTPUT_SAVING 0
//#if OUTPUT_SAVING
function SAVE(folder: string, x: alvision.Mat): void {
    alvision.imwrite(folder + "output.png", x, new Array<alvision.IimwriteParameter>({ flag: alvision.ImwriteFlags.IMWRITE_PNG_COMPRESSION, value : 0 }));
}
//#define SAVE(x) Array<int> params;\
//                params.push(16);\
//                params.push(0);\
//                imwrite(folder + "output.png", x ,params);
//#else
//#define SAVE(x)
//#endif
//
//#include "test_precomp.hpp"
//#include "opencv2/photo.hpp"
//#include <string>
//
//using namespace cv;
//using namespace std;

const numerical_precision = 1000.;

alvision.cvtest.TEST('Photo_SeamlessClone_normal', 'regression', () => {
    var folder = alvision.cvtest.TS.ptr().get_data_path() + "cloning/Normal_Cloning/";
    var original_path1 = folder + "source1.png";
    var original_path2 = folder + "destination1.png";
    var original_path3 = folder + "mask.png";
    var reference_path = folder + "reference.png";

    var source = alvision.imread(original_path1, alvision.ImreadModes.IMREAD_COLOR);
    var destination = alvision.imread(original_path2, alvision.ImreadModes.IMREAD_COLOR);
    var mask = alvision.imread(original_path3, alvision.ImreadModes.IMREAD_COLOR);

    alvision.ASSERT_FALSE(source.empty(), "Could not load source image " + original_path1);
    alvision.ASSERT_FALSE(destination.empty(), "Could not load destination image " + original_path2);
    alvision.ASSERT_FALSE(mask.empty(), "Could not load mask image " + original_path3);

    var result = new alvision.Mat();
    var p = new alvision.Point();
    p.x = destination.size().width.valueOf() / 2;
    p.y = destination.size().height.valueOf() / 2;
    alvision.seamlessClone(source, destination, mask, p, result, 1);

    var reference = alvision.imread(reference_path);
    alvision.ASSERT_FALSE(reference.empty(), "Could not load reference image "+ reference_path);

    SAVE(folder,result);

    var error = alvision.cvtest.norm(reference, result, alvision.NormTypes. NORM_L1);
    alvision.EXPECT_LE(error, numerical_precision);
});

alvision.cvtest.TEST('Photo_SeamlessClone_mixed', 'regression', () => {
    var folder = alvision.cvtest.TS.ptr().get_data_path() + "cloning/Mixed_Cloning/";
    var original_path1 = folder + "source1.png";
    var original_path2 = folder + "destination1.png";
    var original_path3 = folder + "mask.png";
    var reference_path = folder + "reference.png";

    var source = alvision.imread(original_path1, alvision.ImreadModes.IMREAD_COLOR);
    var destination = alvision.imread(original_path2, alvision.ImreadModes.IMREAD_COLOR);
    var mask = alvision.imread(original_path3, alvision.ImreadModes.IMREAD_COLOR);

    alvision.ASSERT_FALSE(source.empty(), "Could not load source image " + original_path1);
    alvision.ASSERT_FALSE(destination.empty(), "Could not load destination image " + original_path2);
    alvision.ASSERT_FALSE(mask.empty(), "Could not load mask image " + original_path3);

    var result = new alvision.Mat();
    var p = new alvision.Point();
    p.x = destination.size().width.valueOf() / 2;
    p.y = destination.size().height.valueOf() / 2;
    alvision.seamlessClone(source, destination, mask, p, result, 2);

    SAVE(folder, result);

    var reference = alvision.imread(reference_path);
    alvision.ASSERT_FALSE(reference.empty(), "Could not load reference image " + reference_path);

    var error = alvision.cvtest.norm(reference, result,alvision.NormTypes. NORM_L1);
    alvision.EXPECT_LE(error, numerical_precision);

});

alvision.cvtest.TEST('Photo_SeamlessClone_featureExchange', 'regression', () => {
    var folder = alvision.cvtest.TS.ptr().get_data_path() + "cloning/Monochrome_Transfer/";
    var original_path1 = folder + "source1.png";
    var original_path2 = folder + "destination1.png";
    var original_path3 = folder + "mask.png";
    var reference_path = folder + "reference.png";

    var source = alvision.imread(original_path1, alvision.ImreadModes.IMREAD_COLOR);
    var destination = alvision.imread(original_path2, alvision.ImreadModes.IMREAD_COLOR);
    var mask = alvision.imread(original_path3, alvision.ImreadModes.IMREAD_COLOR);

    alvision.ASSERT_FALSE(source.empty(), "Could not load source image " + original_path1);
    alvision.ASSERT_FALSE(destination.empty(), "Could not load destination image " + original_path2);
    alvision.ASSERT_FALSE(mask.empty(), "Could not load mask image " + original_path3);

    var result = new alvision.Mat();
    var p = new alvision.Point();
    p.x = destination.size().width.valueOf() / 2;
    p.y = destination.size().height.valueOf() / 2;
    alvision.seamlessClone(source, destination, mask, p, result, 3);

    SAVE(folder,result);

    var reference = alvision.imread(reference_path);
    alvision.ASSERT_FALSE(reference.empty(), "Could not load reference image " + reference_path);

    var error = alvision.cvtest.norm(reference, result, alvision.NormTypes. NORM_L1);
    alvision.EXPECT_LE(error, numerical_precision);

});

alvision.cvtest.TEST('Photo_SeamlessClone_colorChange', 'regression', () => {
    var folder = alvision.cvtest.TS.ptr().get_data_path() + "cloning/color_change/";
    var original_path1 = folder + "source1.png";
    var original_path2 = folder + "mask.png";
    var reference_path = folder + "reference.png";

    var source = alvision.imread(original_path1, alvision.ImreadModes.IMREAD_COLOR);
    var mask = alvision.imread(original_path2, alvision.ImreadModes.IMREAD_COLOR);

    alvision.ASSERT_FALSE(source.empty(), "Could not load source image " + original_path1);
    alvision.ASSERT_FALSE(mask.empty(), "Could not load mask image " + original_path2);

    var result = new alvision.Mat();
    alvision.colorChange(source, mask, result, 1.5, .5, .5);

    SAVE(folder, result);

    var reference = alvision.imread(reference_path);
    alvision.ASSERT_FALSE(reference.empty(), "Could not load reference image " + reference_path);

    var error = alvision.cvtest.norm(reference, result, alvision.NormTypes. NORM_L1);
    alvision.EXPECT_LE(error, numerical_precision);

});

alvision.cvtest.TEST('Photo_SeamlessClone_illuminationChange', 'regression', () => {
    var folder = alvision.cvtest.TS.ptr().get_data_path() + "cloning/Illumination_Change/";
    var original_path1 = folder + "source1.png";
    var original_path2 = folder + "mask.png";
    var reference_path = folder + "reference.png";

    var source = alvision.imread(original_path1, alvision.ImreadModes.IMREAD_COLOR);
    var mask = alvision.imread(original_path2, alvision.ImreadModes.IMREAD_COLOR);

    alvision.ASSERT_FALSE(source.empty(), "Could not load source image " + original_path1);
    alvision.ASSERT_FALSE(mask.empty(), "Could not load mask image " + original_path2);

    var result = new alvision.Mat();
    alvision.illuminationChange(source, mask, result, 0.2, 0.4);

    SAVE(folder, result);

    var reference = alvision.imread(reference_path);
    var error = alvision.cvtest.norm(reference, result, alvision.NormTypes.NORM_L1);
    alvision.EXPECT_LE(error, numerical_precision);

});

alvision.cvtest.TEST('Photo_SeamlessClone_textureFlattening', 'regression', () => {
    var folder = alvision.cvtest.TS.ptr().get_data_path() + "cloning/Texture_Flattening/";
    var original_path1 = folder + "source1.png";
    var original_path2 = folder + "mask.png";
    var reference_path = folder + "reference.png";

    var source = alvision.imread(original_path1, alvision.ImreadModes.IMREAD_COLOR);
    var mask = alvision.imread(original_path2, alvision.ImreadModes.IMREAD_COLOR);

    alvision.ASSERT_FALSE(source.empty(), "Could not load source image " + original_path1);
    alvision.ASSERT_FALSE(mask.empty(), "Could not load mask image " + original_path2);

    var result = new alvision.Mat();
    alvision.textureFlattening(source, mask, result, 30, 45, 3);

    SAVE(folder,result);

    var reference = alvision.imread(reference_path);
    alvision.ASSERT_FALSE(reference.empty(), "Could not load reference image " + reference_path);

    var error = alvision.cvtest.norm(reference, result, alvision.NormTypes. NORM_L1);
    alvision.EXPECT_LE(error, numerical_precision);

});
