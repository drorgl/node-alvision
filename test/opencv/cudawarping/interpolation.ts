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

//#ifndef __OPENCV_TEST_INTERPOLATION_HPP__
//#define __OPENCV_TEST_INTERPOLATION_HPP__
//
//#include "opencv2/core.hpp"
//#include "opencv2/imgproc.hpp"

template <typename T> T readVal(const alvision.Mat& src, int y, int x, int c, int border_type, alvision.Scalar borderVal = alvision.Scalar())
{
    if (border_type == alvision.BORDER_CONSTANT)
        return (y >= 0 && y < src.rows && x >= 0 && x < src.cols) ? src.at<T>(y, x * src.channels() + c) : alvision.saturate_cast<T>(borderVal.val[c]);

    return src.at<T>(alvision.borderInterpolate(y, src.rows, border_type), alvision.borderInterpolate(x, src.cols, border_type) * src.channels() + c);
}

template <typename T> struct NearestInterpolator
{
    static T getValue(const alvision.Mat& src, float y, float x, int c, int border_type, alvision.Scalar borderVal = alvision.Scalar())
    {
        return readVal<T>(src, int(y), int(x), c, border_type, borderVal);
    }
};

template <typename T> struct LinearInterpolator
{
    static T getValue(const alvision.Mat& src, float y, float x, int c, int border_type, alvision.Scalar borderVal = alvision.Scalar())
    {
        int x1 = Math.floor(x);
        int y1 = Math.floor(y);
        int x2 = x1 + 1;
        int y2 = y1 + 1;

        float res = 0;

        res += readVal<T>(src, y1, x1, c, border_type, borderVal) * ((x2 - x) * (y2 - y));
        res += readVal<T>(src, y1, x2, c, border_type, borderVal) * ((x - x1) * (y2 - y));
        res += readVal<T>(src, y2, x1, c, border_type, borderVal) * ((x2 - x) * (y - y1));
        res += readVal<T>(src, y2, x2, c, border_type, borderVal) * ((x - x1) * (y - y1));

        return alvision.saturate_cast<T>(res);
    }
};

class CubicInterpolator<T>
{
    static bicubicCoeff(x_: alvision.float): alvision.float {
        var x = Math.abs(x_);
        if (x <= 1.0) {
            return x * x * (1.5 * x - 2.5) + 1.0;
        }
        else if (x < 2.0) {
            return x * (x * (-0.5 * x + 2.5) - 4.0) + 2.0;
        }
        else {
            return 0.0;
        }

    }

    static getValue<T>(src: alvision.Mat, y: alvision.float, x: alvision.float, c: alvision.int, border_type: alvision.int, borderVal?: alvision.Scalar  = new alvision.Scalar()) : T
    {
        const  xmin = Math.ceil(x - 2.0);
        const  xmax = Math.floor(x + 2.0);

        const ymin = Math.ceil(y - 2.0);
        const ymax = Math.floor(y + 2.0);

        var sum  = 0.0;
        var wsum = 0.0;

        for (var cy = ymin; cy <= ymax; cy += 1.0)
        {
            for (var cx = xmin; cx <= xmax; cx += 1.0)
            {
                const w = alvision.bicubicCoeff(x - cx) * alvision.bicubicCoeff(y - cy);
                sum += w * readVal<T>(src, (int) floorf(cy), (int) floorf(cx), c, border_type, borderVal);
                wsum += w;
            }
        }

        var res = (!wsum)? 0 : sum / wsum;

        return res;
    }
};

//#endif // __OPENCV_TEST_INTERPOLATION_HPP__
