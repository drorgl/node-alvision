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


export function readVal<T>(Ttype : string, src: alvision.Mat, y: alvision.int, x: alvision.int, c: alvision.int, border_type: alvision.int, borderVal: alvision.Scalar = new alvision.Scalar()) : T
{
    if (border_type == alvision.BorderTypes.BORDER_CONSTANT)
        return (y >= 0 && y < src.rows() && x >= 0 && x < src.cols()) ? src.at<T>(Ttype, y.valueOf(), x.valueOf() * src.channels().valueOf() + c.valueOf()).get() : alvision.saturate_cast<T>(borderVal.val[c.valueOf()],Ttype);

    return src.at<T>(Ttype, alvision.borderInterpolate(y, src.rows(), border_type), alvision.borderInterpolate(x, src.cols(), border_type).valueOf() * src.channels().valueOf() + c.valueOf()).get();
}

export interface Interpolator {
    getValue<T>(Ttype: string, src: alvision.Mat, y: alvision.float, x: alvision.float, c: alvision.int, border_type: alvision.int, borderVal?: alvision.Scalar): T;
}

//template < typename T>
export class NearestInterpolator implements Interpolator {
    public getValue<T>(Ttype: string, src: alvision.Mat, y: alvision.float, x: alvision.float, c: alvision.int, border_type: alvision.int, borderVal?: alvision.Scalar): T {
        return readVal<T>(Ttype, src, y, x, c, border_type, borderVal);
    }
}

//template < typename T>
export class LinearInterpolator implements Interpolator {
    public getValue<T extends Number>(Ttype: string, src: alvision.Mat, y: alvision.float, x: alvision.float, c: alvision.int, border_type: alvision.int, borderVal?: alvision.Scalar): T {
        var x1 = Math.floor(x.valueOf());
        var y1 = Math.floor(y.valueOf());
        var x2 = x1 + 1;
        var y2 = y1 + 1;

        var res = 0;

        res += readVal<T>(Ttype, src, y1, x1, c, border_type, borderVal).valueOf() * ((x2 - x.valueOf()) * (y2 - y.valueOf()));
        res += readVal<T>(Ttype, src, y1, x2, c, border_type, borderVal).valueOf() * ((x.valueOf() - x1) * (y2 - y.valueOf()));
        res += readVal<T>(Ttype, src, y2, x1, c, border_type, borderVal).valueOf() * ((x2 - x.valueOf()) * (y.valueOf() - y1));
        res += readVal<T>(Ttype, src, y2, x2, c, border_type, borderVal).valueOf() * ((x.valueOf() - x1) * (y.valueOf() - y1));

        return alvision.saturate_cast<T>(res, Ttype);
    }
}

export class CubicInterpolator implements Interpolator
{
    static bicubicCoeff(x_: alvision.float): alvision.float {
        var x = Math.abs(x_.valueOf());
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

    public getValue<T extends Number>(Ttype: string, src: alvision.Mat, y: alvision.float, x: alvision.float, c: alvision.int, border_type: alvision.int, borderVal?: alvision.Scalar): T {
        const xmin = Math.ceil(x.valueOf() - 2.0);
        const xmax = Math.floor(x.valueOf() + 2.0);

        const ymin = Math.ceil(y.valueOf() - 2.0);
        const ymax = Math.floor(y.valueOf() + 2.0);

        var sum  = 0.0;
        var wsum = 0.0;

        for (var cy = ymin; cy <= ymax; cy += 1.0)
        {
            for (var cx = xmin; cx <= xmax; cx += 1.0)
            {
                const w = CubicInterpolator.bicubicCoeff(x.valueOf() - cx).valueOf() * CubicInterpolator.bicubicCoeff(y.valueOf() - cy).valueOf();
                sum += w * readVal<T>(Ttype, src, Math.floor(cy), Math.floor(cx), c, border_type, borderVal).valueOf();
                wsum += w;
            }
        }

        var res = (!wsum)? 0 : sum / wsum;

        return <any>res;
    }
};

//#endif // __OPENCV_TEST_INTERPOLATION_HPP__
