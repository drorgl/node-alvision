
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

//#define DUMP_RESULTS

//#ifdef DUMP_RESULTS
//#  define DUMP(image, path) imwrite(path, image)
//#else
//#  define DUMP(image, path)
//#endif

function DUMP(image: alvision.Mat, path: string) {
    alvision.imwrite(path, image);
}


alvision.cvtest.TEST('Photo_DenoisingGrayscale', 'regression', () => {
    var folder = alvision.cvtest.TS.ptr().get_data_path() + "denoising/";
    var original_path = folder + "lena_noised_gaussian_sigma=10.png";
    var expected_path = folder + "lena_noised_denoised_grayscale_tw=7_sw=21_h=10.png";

    var original = alvision.imread(original_path, alvision.ImreadModes. IMREAD_GRAYSCALE);
    var expected = alvision.imread(expected_path, alvision.ImreadModes.IMREAD_GRAYSCALE);

    alvision.ASSERT_FALSE(original.empty(), "Could not load input image " + original_path);
    alvision.ASSERT_FALSE(expected.empty(), "Could not load reference image " + expected_path);

    var result = new alvision.Mat();
    alvision.fastNlMeansDenoising(original, result, 10);

    DUMP(result, expected_path + ".res.png");

    alvision.ASSERT_EQ(0, alvision.cvtest.norm(result, expected,alvision.NormTypes. NORM_L2));
});

alvision.cvtest.TEST('Photo_DenoisingColored', 'regression', () => {
    var folder = alvision.cvtest.TS.ptr().get_data_path() + "denoising/";
    var original_path = folder + "lena_noised_gaussian_sigma=10.png";
    var expected_path = folder + "lena_noised_denoised_lab12_tw=7_sw=21_h=10_h2=10.png";

    var original = alvision.imread(original_path, alvision.ImreadModes.IMREAD_COLOR);
    var expected = alvision.imread(expected_path, alvision.ImreadModes.IMREAD_COLOR);

    alvision.ASSERT_FALSE(original.empty(), "Could not load input image " + original_path);
    alvision.ASSERT_FALSE(expected.empty(), "Could not load reference image " + expected_path);

    var result = new alvision.Mat();
    alvision.fastNlMeansDenoisingColored(original, result, 10, 10);

    DUMP(result, expected_path + ".res.png");

    alvision.ASSERT_EQ(0, alvision.cvtest.norm(result, expected,alvision.NormTypes. NORM_L2));
});

alvision.cvtest.TEST('Photo_DenoisingGrayscaleMulti', 'regression',()=>
{
    const imgs_count = 3;
    var folder = alvision.cvtest.TS.ptr().get_data_path() + "denoising/";

    var expected_path = folder + "lena_noised_denoised_multi_tw=7_sw=21_h=15.png";
    var expected = alvision.imread(expected_path, alvision.ImreadModes.IMREAD_GRAYSCALE);
    alvision.ASSERT_FALSE(expected.empty(), "Could not load reference image "+ expected_path);

    var original = new Array<alvision.Mat>(imgs_count);
    for (var i = 0; i < imgs_count; i++)
    {
        var original_path = util.format("%slena_noised_gaussian_sigma=20_multi_%d.png", folder, i);
        original[i] = alvision.imread(original_path, alvision.ImreadModes.IMREAD_GRAYSCALE);
        alvision.ASSERT_FALSE(original[i].empty(), "Could not load input image " + original_path);
    }

    var result = new alvision.Mat();
    alvision.fastNlMeansDenoisingMulti(original, result, imgs_count / 2, imgs_count, 15);

    DUMP(result, expected_path + ".res.png");

    alvision.ASSERT_EQ(0, alvision.cvtest.norm(result, expected,alvision.NormTypes. NORM_L2));
});

alvision.cvtest.TEST('Photo_DenoisingColoredMulti', 'regression',()=>
{
    const imgs_count = 3;
    var folder = alvision.cvtest.TS.ptr().get_data_path() + "denoising/";

    var expected_path = folder + "lena_noised_denoised_multi_lab12_tw=7_sw=21_h=10_h2=15.png";
    var expected = alvision.imread(expected_path, alvision.ImreadModes. IMREAD_COLOR);
    alvision.ASSERT_FALSE(expected.empty(), "Could not load reference image " + expected_path);

    var original = new Array<alvision.Mat>(imgs_count);
    for (var i = 0; i < imgs_count; i++)
    {
        var original_path = util.format("%slena_noised_gaussian_sigma=20_multi_%d.png", folder, i);
        original[i] = alvision.imread(original_path,alvision.ImreadModes. IMREAD_COLOR);
        alvision.ASSERT_FALSE(original[i].empty(), "Could not load input image " + original_path);
    }

    var result = new alvision.Mat();
    alvision.fastNlMeansDenoisingColoredMulti(original, result, imgs_count / 2, imgs_count, 10, 15);

    DUMP(result, expected_path + ".res.png");

    alvision.ASSERT_EQ(0, alvision.cvtest.norm(result, expected,alvision.NormTypes. NORM_L2));
});

alvision.cvtest.TEST('Photo_White', 'issue_2646', () => {
    var img = new alvision.Mat(50, 50, alvision.MatrixType.CV_8UC1, alvision.Scalar.all(255));
    var filtered = new alvision.Mat();
   alvision.fastNlMeansDenoising(img, filtered);

    var nonWhitePixelsCount = img.total().valueOf() - alvision.countNonZero(alvision.MatExpr.op_Equals( filtered , img)).valueOf();

    alvision.ASSERT_EQ(0, nonWhitePixelsCount);
});

alvision.cvtest.TEST('Photo_Denoising', 'speed', () => {
    var imgname = alvision.cvtest.TS.ptr().get_data_path() + "shared/5MP.png";
    var src = alvision.imread(imgname, 0), dst = new alvision.Mat();;

    
    let t = alvision.cvGetTickCount();
    alvision.fastNlMeansDenoising(src, dst, 5, 7, 21);
    t = alvision.cvGetTickCount() - t;
    console.log(util.format("execution time: %gms\n", t * 1000. / alvision.cvGetTickFrequency()));
});
