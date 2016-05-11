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
// In no event shall the OpenCV Foundation or contributors be liable for any direct,
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

function make_noisy(img : alvision.Mat, noisy : alvision.Mat, sigma : alvision.double, pepper_salt_ratio : alvision.double ,  rng : alvision.RNG) : void
{
    noisy.create(img.size(), img.type());
    var noise = new alvision.Mat(img.size(), img.type()), mask(img.size(), CV_8U);
    rng.fill(noise,alvision.RNG::NORMAL,128.0,sigma);
    alvision.addWeighted(img, 1, noise, 1, -128, noisy);
    alvision.randn(noise, alvision.alvision.Scalar.all(0), alvision.Scalar::all(2));
    noise *= 255;
    alvision.randu(mask, 0, Math.round(1./pepper_salt_ratio));
    alvision.Mat half = mask.colRange(0, img.cols/2);
    half = alvision.Scalar::all(1);
    noise.setTo(128, mask);
    alvision.addWeighted(noisy, 1, noise, 1, -128, noisy);
}

function make_spotty(img: alvision.Mat, rng: alvision.RNG, r: alvision.int = 3, n: alvision.int = 1000): void
{
    for(var i=0;i<n;i++)
    {
        var x=rng(img.cols-r),y=rng(img.rows-r);
        if(rng(2)==0)
            img(alvision.Range(y,y+r),alvision.Range(x,x+r))=(uchar)0;
        else
            img(alvision.Range(y,y+r),alvision.Range(x,x+r))=(uchar)255;
    }
}

function validate_pixel(image: alvision.Mat, x: alvision.int, y: alvision.int, val: alvision.uchar ): boolean
{
    var ok = Math.abs(image.atGet<alvision.uchar>("uchar",x,y) - val) < 10;
    console.log(util.format("test: image(%d,%d)=%d vs %d - %s\n",x,y,image.atGet<alvision.uchar>("uchar",x,y),val,ok?"ok":"bad");
    return ok;
}

alvision.cvtest.TEST('Optim_denoise_tvl1', 'regression_basic',()=>
{
    var rng = new alvision.RNG (42);
    var img = alvision.imread(alvision.cvtest.TS.ptr().get_data_path() + "shared/lena.png", 0), noisy = new alvision.Mat(), res = new alvision.Mat();

    alvision.ASSERT_FALSE(img.empty(),  "Error: can't open 'lena.png'";

    const obs_num=5;
    var images = new Array<alvision.Mat>(obs_num, new alvision.Mat());
    for(var i=0;i<images.length;i++)
    {
        make_noisy(img,images[i], 20, 0.02,rng);
        //make_spotty(images[i],rng);
    }

    //alvision.imshow("test", images[0]);
    alvision.denoise_TVL1(images, res);
    //alvision.imshow("denoised", res);
    //alvision.waitKey();

////#if 0
//    alvision.ASSERT_TRUE(validate_pixel(res,248,334,179));
//    alvision.ASSERT_TRUE(validate_pixel(res,489,333,172));
//    alvision.ASSERT_TRUE(validate_pixel(res,425,507,104));
//    alvision.ASSERT_TRUE(validate_pixel(res,489,486,105));
//    alvision.ASSERT_TRUE(validate_pixel(res,223,208,64));
//    alvision.ASSERT_TRUE(validate_pixel(res,418,3,78));
//    alvision.ASSERT_TRUE(validate_pixel(res,63,76,97));
//    alvision.ASSERT_TRUE(validate_pixel(res,29,134,126));
//    alvision.ASSERT_TRUE(validate_pixel(res,219,291,174));
//    alvision.ASSERT_TRUE(validate_pixel(res,384,124,76));
////#endif
//
//#if 1
    alvision.ASSERT_TRUE(validate_pixel(res,248,334,194));
    alvision.ASSERT_TRUE(validate_pixel(res,489,333,171));
    alvision.ASSERT_TRUE(validate_pixel(res,425,507,103));
    alvision.ASSERT_TRUE(validate_pixel(res,489,486,109));
    alvision.ASSERT_TRUE(validate_pixel(res,223,208,72));
    alvision.ASSERT_TRUE(validate_pixel(res,418,3,58));
    alvision.ASSERT_TRUE(validate_pixel(res,63,76,93));
    alvision.ASSERT_TRUE(validate_pixel(res,29,134,127));
    alvision.ASSERT_TRUE(validate_pixel(res,219,291,180));
    alvision.ASSERT_TRUE(validate_pixel(res,384,124,80));
//#endif

});
