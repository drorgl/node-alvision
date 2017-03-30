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

/// <reference path="../../../typings/index.d.ts" />
/// <reference path="../../../tsbinding/alvision.d.ts" />
/// <reference path="../../../tsbinding/alvision.ts" />


//var mediatype: { attachment; audio; } = { attachment: "attachment", audio: "audio" };



import tape = require("tape");
import path = require("path");

import async = require("async");
import alvision = require("../../../tsbinding/alvision");


//#include "test_precomp.hpp"
//#include "opencv2/highgui.hpp"

//#if defined HAVE_GTK || defined HAVE_QT || defined HAVE_WIN32UI || defined HAVE_CARBON || defined HAVE_COCOA

//using namespace cv;
//using namespace std;

class CV_HighGuiOnlyGuiTest extends alvision. cvtest.BaseTest
{
   public run(int /*start_from */) : void
{
    //this.ts.printfts .LOG, "GUI 0\n");
    alvision.destroyAllWindows();

    //this.ts.printfts .LOG, "GUI 1\n");
    alvision.namedWindow("Win");

    //this.ts.printfts .LOG, "GUI 2\n");
    var m = new alvision.Mat(256, 256, alvision.MatrixType.CV_8U);
    //Mat m(256, 256, CV_8U);
    m.setTo(new alvision.Scalar(128));
    //m = Scalar(128);

    //this.ts.printfts .LOG, "GUI 3\n");
    alvision.imshow("Win", m);

    //this.ts.printfts .LOG, "GUI 4\n");
    var value: alvision.int = 50;
    //int value = 50;
    

    //this.ts.printfts .LOG, "GUI 5\n");
    alvision.createTrackbar("trackbar", "Win", 100, (x)=>true, value, value);

    //this.ts.printfts .LOG, "GUI 6\n");
    alvision.getTrackbarPos("trackbar", "Win");

    //this.ts.printfts .LOG, "GUI 7\n");
    alvision.waitKey(500);

    //this.ts.printfts .LOG, "GUI 8\n");
    alvision.destroyAllWindows();
    //this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
}

};

//void Foo(int /*k*/, void* /*z*/) {}


alvision.cvtest.TEST('Highgui_GUI', 'regression', () => { var test = new CV_HighGuiOnlyGuiTest(); test.safe_run(); });

