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
import colors = require("colors");
import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');


//#include "test_precomp.hpp"
//
//using namespace cv;
//using namespace std;

function loadImage(path : string): alvision.Mat
{
    var img = alvision.imread(path, -1);
    alvision.ASSERT_FALSE(img.empty(), "Could not load input image " + path);
    return img;
}

function checkEqual(img0 : alvision.Mat, img1 : alvision.Mat, threshold : alvision.double , name : string): void
{
    var max = 1.0;
    alvision.minMaxLoc(alvision.Mat.from(alvision.MatExpr.abs(alvision.MatExpr.op_Substraction(img0, img1))), (minVal, maxVal, minIdx, maxIdx) => { max = maxVal });
    alvision.ASSERT_FALSE(max > threshold, "max=" + max + " threshold=" + threshold + " method=" + name);
}

//static Array < float > DEFAULT_VECTOR;
var DEFAULT_VECTOR = new Array<alvision.float>();

function loadExposureSeq(path: string, images: Array<alvision.Mat>, times?: Array<alvision.float>  = DEFAULT_VECTOR): void
{
    ifstream list_file((path + "list.txt"));
    ASSERT_TRUE(list_file.is_open());
    string name;
    float val;
    while(list_file >> name >> val) {
        Mat img = imread(path + name);
        ASSERT_FALSE(img.empty()) << "Could not load input image " << path + name;
        images.push(img);
        times.push(1 / val);
    }
    list_file.close();
}

function loadResponseCSV(path: string, response: alvision.Mat): void {
    response = alvision.Mat(256, 1, alvision.MatrixType.CV_32FC3); //DROR: might not work
    ifstream resp_file(path);
    for (int i = 0; i < 256; i++) {
        for (int c = 0; c < 3; c++) {
            resp_file >> response.at<Vec3f>(i)[c];
            resp_file.ignore(1);
        }
    }
    resp_file.close();
}

alvision.cvtest.TEST('Photo_Tonemap', 'regression', () => {
    var test_path = alvision.cvtest.TS.ptr().get_data_path() + "hdr/tonemap/";

    var result = new alvision.Mat();
    var img = loadImage(test_path + "image.hdr");
    var gamma = 2.2;

    var linear = alvision.createTonemap(gamma);

    linear.process(img, result);
    var expected = loadImage(test_path + "linear.png");
    result.convertTo(result, alvision.MatrixType.CV_8UC3, 255);
    checkEqual(result, expected, 3, "Simple");

    var drago = alvision.createTonemapDrago(gamma);

    drago.process(img, result);
    expected = loadImage(test_path + "drago.png");
    result.convertTo(result, alvision.MatrixType.CV_8UC3, 255);
    checkEqual(result, expected, 3, "Drago");

    var durand = alvision.createTonemapDurand(gamma);
    durand.process(img, result);
    expected = loadImage(test_path + "durand.png");
    result.convertTo(result, alvision.MatrixType.CV_8UC3, 255);
    checkEqual(result, expected, 3, "Durand");

    var reinhard = alvision.createTonemapReinhard(gamma);
    reinhard.process(img, result);
    expected = loadImage(test_path + "reinhard.png");
    result.convertTo(result,alvision.MatrixType. CV_8UC3, 255);
    checkEqual(result, expected, 3, "Reinhard");

    var mantiuk = alvision.createTonemapMantiuk(gamma);
    mantiuk.process(img, result);
    expected = loadImage(test_path + "mantiuk.png");
    result.convertTo(result, alvision.MatrixType.CV_8UC3, 255);
    checkEqual(result, expected, 3, "Mantiuk");
});

alvision.cvtest.TEST('Photo_AlignMTB', 'regression',()=>
{
    const TESTS_COUNT = 100;
    var folder = alvision.cvtest.TS.ptr().get_data_path() + "shared/";

    var file_name = folder + "lena.png";
    var img = loadImage(file_name);
    alvision.cvtColor(img, img,alvision.ColorConversionCodes. COLOR_RGB2GRAY);

    var max_bits = 5;
    var max_shift = 32;
    srand(static_cast<unsigned>(time(0)));
    var errors = 0;

    var align = alvision.createAlignMTB(max_bits);

    for(var i = 0; i < TESTS_COUNT; i++) {
        var shift = new alvision.Point(rand() % max_shift, rand() % max_shift);
        var res = new alvision.Mat();
        align.shiftMat(img, res, shift);
        var calc = align.calculateShift(img, res);
        errors += (calc != -shift);
    }
    alvision.ASSERT_TRUE(errors < 5, errors+ " errors");
});

alvision.cvtest.TEST('Photo_MergeMertens', 'regression', () => {
    var test_path = alvision.cvtest.TS.ptr().get_data_path() + "hdr/";

    var images = new Array<alvision.Mat>();

    loadExposureSeq((test_path + "exposures/"), images);

    var merge = alvision.createMergeMertens();

    var result = new alvision.Mat();

    var expected = loadImage(test_path + "merge/mertens.png");
    merge.process(images, result);
    result.convertTo(result, alvision.MatrixType.CV_8UC3, 255);
    checkEqual(expected, result, 3, "Mertens");

    var uniform = new alvision.Mat(100, 100, alvision.MatrixType.CV_8UC3, new alvision.Scalar(0, 255, 0));

    images = new Array<alvision.Mat>();
    images.push(uniform);

    merge.process(images, result);
    result.convertTo(result, alvision.MatrixType.CV_8UC3, 255);
    checkEqual(uniform, result, 1e-2, "Mertens");
});

alvision.cvtest.TEST('Photo_MergeDebevec', 'regression', () => {
    var test_path = alvision.cvtest.TS.ptr().get_data_path() + "hdr/";

    var images = new Array<alvision.Mat>();
    var times = new Array<alvision.float>();

    var response = new alvision.Mat();
    loadExposureSeq(test_path + "exposures/", images, times);
    loadResponseCSV(test_path + "exposures/response.csv", response);

    var merge = alvision.createMergeDebevec();

    var result = new alvision.Mat();

    var expected = loadImage(test_path + "merge/debevec.hdr");
    merge.process(images, result, times, response);

    var map = alvision.createTonemap();
    map.process(result, result);
    map.process(expected, expected);

    checkEqual(expected, result, 1e-2, "Debevec");
});

alvision.cvtest.TEST('Photo_MergeRobertson', 'regression', () => {
    var test_path = alvision.cvtest.TS.ptr().get_data_path() + "hdr/";

    var images = new Array<alvision.Mat>();
    var times = new Array<alvision.float>();

    loadExposureSeq(test_path + "exposures/", images, times);

    var merge = alvision.createMergeRobertson();

    var response = new alvision.Mat()

    var expected = loadImage(test_path + "merge/robertson.hdr");

    merge.process(images, response, times);
    var map = alvision.createTonemap();
    map.process(response, response);
    map.process(expected, expected);

    checkEqual(expected, response, 1e-2, "MergeRobertson");
});

alvision.cvtest.TEST('Photo_CalibrateDebevec', 'regression', () => {
    var test_path = alvision.cvtest.TS.ptr().get_data_path() + "hdr/";

    var images = new Array<alvision.Mat>();
    var times = new Array<alvision.float>();

    var response = new alvision.Mat(), expected = new alvision.Mat();

    loadExposureSeq(test_path + "exposures/", images, times);
    loadResponseCSV(test_path + "calibrate/debevec.csv", expected);

    var calibrate = alvision.createCalibrateDebevec();

    calibrate.process(images, response, times);
    var diff = alvision.Mat.from(alvision.MatExpr.abs(alvision.MatExpr.op_Substraction(response, expected)));
    diff = diff.mul(1.0 / response);
    var max: alvision.double;
    alvision.minMaxLoc(diff, null, &max);
    alvision.ASSERT_FALSE(max > 0.1);
});

alvision.cvtest.TEST('Photo_CalibrateRobertson', 'regression', () => {
    var test_path = alvision.cvtest.TS.ptr().get_data_path() + "hdr/";

    var images = new Array<alvision.Mat>();
    var times= new Array < alvision.float > ();
    var response = new alvision.Mat(), expected = new alvision.Mat();
    loadExposureSeq(test_path + "exposures/", images, times);
    loadResponseCSV(test_path + "calibrate/robertson.csv", expected);

    var calibrate = alvision.createCalibrateRobertson();
    calibrate.process(images, response, times);
    checkEqual(expected, response, 1e-3, "CalibrateRobertson");
});
