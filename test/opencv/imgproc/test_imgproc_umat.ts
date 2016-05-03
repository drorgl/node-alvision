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
//#include <string>
//
//using namespace cv;
//using namespace std;

class CV_ImgprocUMatTest extends alvision.cvtest.BaseTest
{
    run(int): void
    {
        var imgpath = this.ts.get_data_path() + "shared/lena.png";
        var img = alvision.imread(imgpath, 1), gray, smallimg, result;
        var uimg = img.getUMat(alvision.ACCESS.ACCESS_READ);
        var ugray = new alvision.UMat();
        var usmallimg = new alvision.UMat();
        var uresult = new alvision.UMat();

        alvision.cvtColor(img, gray, alvision.ColorConversionCodes.COLOR_BGR2GRAY);
        alvision.resize(gray, smallimg, new alvision.Size(), 0.75, 0.75,alvision.InterpolationFlags.INTER_LINEAR);
        alvision.equalizeHist(smallimg, result);

        alvision.cvtColor(uimg, ugray, alvision.ColorConversionCodes. COLOR_BGR2GRAY);
        alvision.resize(ugray, usmallimg,new alvision. Size(), 0.75, 0.75,alvision.InterpolationFlags. INTER_LINEAR);
        alvision.equalizeHist(usmallimg, uresult);

//#if 0
        alvision.imshow("orig", uimg);
        alvision.imshow("small", usmallimg);
        alvision.imshow("equalized gray", uresult);
        alvision.waitKey();
        alvision.destroyWindow("orig");
        alvision.destroyWindow("small");
        alvision.destroyWindow("equalized gray");
        //#endif
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);

        uresult.getMat(alvision.ACCESS.ACCESS_READ);
    }
};

alvision.cvtest.TEST('Imgproc_UMat', 'regression', () => { var test = new CV_ImgprocUMatTest(); test.safe_run(); });
