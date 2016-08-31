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
//#include "opencv2/highgui.hpp"
//
//#include <vector>
//#include <string>
//using namespace std;
//using namespace cv;
//
//#undef RENDER_MSERS
//#define RENDER_MSERS 0
//
//#if defined RENDER_MSERS && RENDER_MSERS
function renderMSERs(gray: alvision.Mat, img: alvision.Mat, msers: Array<Array<alvision.Point>> ) : void
{
    alvision.cvtColor(gray, img,alvision.ColorConversionCodes. COLOR_GRAY2BGR);
    let rng = new alvision.RNG (1749583);
    for(let i = 0; i < msers.length; i++ )
    {
        let b = rng.uniform(0, 256);
        let g = rng.uniform(0, 256);
        let r = rng.uniform(0, 256);
        let color = new alvision.Vecb(b, g, r);

        const  pt = msers[i][0];
        let n = msers[i].length;
        for (let j = 0; j < n; j++)
            img.at<alvision.Vecb>("Vec3b", pt[j]).set(color);
    }
}
//#endif

//TEST(Features2d_MSER, cases)
alvision.cvtest.TEST('Features2d_MSER', 'cases', () => {
    let buf =
        [
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 0, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 0, 0, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 0, 0, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 0, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255
        ];
    let big_image = alvision.imread(alvision.cvtest.TS.ptr().get_data_path() + "mser/puzzle.png", 0);
    let small_image = new alvision.Mat(14, 26, alvision.MatrixType.CV_8U, buf);
    const thresharr = [0, 70, 120, 180, 255];

    const kDelta = 5;
    let mserExtractor = alvision.MSER.create(kDelta);
    let msers = new Array<Array<alvision.Point>>();
    let boxes = new Array<alvision.Rect>();

    let rng = new alvision.RNG(123456);

    for (let i = 0; i < 100; i++) {
        let use_big_image = rng.uniform(0, 7) != 0;
        let invert = rng.uniform(0, 2) != 0;
        let binarize = use_big_image ? rng.uniform(0, 5) != 0 : false;
        let blur = rng.uniform(0, 2) != 0;
        let thresh = thresharr[rng.uniform(0, 5).valueOf()];

        /*if( i == 0 )
        {
            use_big_image = true;
            invert = binarize = blur = false;
        }*/

        const src0 = use_big_image ? big_image : small_image;
        let src = src0.clone();

        let kMinArea = use_big_image ? 256 : 10;
        let kMaxArea = src.total().valueOf() / 4;

        mserExtractor.setMinArea(kMinArea);
        mserExtractor.setMaxArea(kMaxArea);

        if (invert)
            alvision.bitwise_not(src, src);
        if (binarize)
            alvision.threshold(src, src, thresh, 255, alvision.ThresholdTypes.THRESH_BINARY);
        if (blur)
            alvision.GaussianBlur(src, src, new alvision.Size(5, 5), 1.5, 1.5);

        let minRegs = use_big_image ? 7 : 2;
        let maxRegs = use_big_image ? 1000 : 15;
        if (binarize && (thresh == 0 || thresh == 255))
            minRegs = maxRegs = 0;

        mserExtractor.detectRegions(src, (msers_) => { msers = msers_; }, boxes);
        let nmsers = msers.length;
        alvision.ASSERT_EQ(nmsers, boxes.length);

        if (maxRegs < nmsers || minRegs > nmsers) {
            console.log(util.format("%d. minArea=%d, maxArea=%d, nmsers=%d, minRegs=%d, maxRegs=%d, " +
                "image=%s, invert=%d, binarize=%d, thresh=%d, blur=%d\n",
                i, kMinArea, kMaxArea, nmsers, minRegs, maxRegs, use_big_image ? "big" : "small",
                invert, binarize, thresh, blur));
            //#if defined RENDER_MSERS && RENDER_MSERS
            let image = new alvision.Mat();
            alvision.imshow("source", src);
            renderMSERs(src, image, msers);
            alvision.imshow("result", image);
            alvision.waitKey();
            //#endif
        }

        alvision.ASSERT_LE(minRegs, nmsers);
        alvision.ASSERT_GE(maxRegs, nmsers);
    }
});
