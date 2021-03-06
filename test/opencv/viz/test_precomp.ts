//TODO: implement!


///*M///////////////////////////////////////////////////////////////////////////////////////
////
////  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
////
////  By downloading, copying, installing or using the software you agree to this license.
////  If you do not agree to this license, do not download, install,
////  copy or use the software.
////
////
////                           License Agreement
////                For Open Source Computer Vision Library
////
//// Copyright (C) 2013, OpenCV Foundation, all rights reserved.
//// Third party copyrights are property of their respective owners.
////
//// Redistribution and use in source and binary forms, with or without modification,
//// are permitted provided that the following conditions are met:
////
////   * Redistribution's of source code must retain the above copyright notice,
////     this list of conditions and the following disclaimer.
////
////   * Redistribution's in binary form must reproduce the above copyright notice,
////     this list of conditions and the following disclaimer in the documentation
////     and/or other materials provided with the distribution.
////
////   * The name of the copyright holders may not be used to endorse or promote products
////     derived from this software without specific prior written permission.
////
//// This software is provided by the copyright holders and contributors "as is" and
//// any express or implied warranties, including, but not limited to, the implied
//// warranties of merchantability and fitness for a particular purpose are disclaimed.
//// In no event shall the Intel Corporation or contributors be liable for any direct,
//// indirect, incidental, special, exemplary, or consequential damages
//// (including, but not limited to, procurement of substitute goods or services;
//// loss of use, data, or profits; or business interruption) however caused
//// and on any theory of liability, whether in contract, strict liability,
//// or tort (including negligence or otherwise) arising in any way out of
//// the use of this software, even if advised of the possibility of such damage.
////
//// Authors:
////  * Ozan Tonkal, ozantonkal@gmail.com
////  * Anatoly Baksheev, Itseez Inc.  myname.mysurname <> mycompany.com
////
////M*/

//import tape = require("tape");
//import path = require("path");
//
//import async = require("async");
//import alvision = require("../../../tsbinding/alvision");
//import util = require('util');
//import fs = require('fs');

////#ifdef __GNUC__
////#  pragma GCC diagnostic ignored "-Wmissing-declarations"
////#  if defined __clang__ || defined __APPLE__
////#    pragma GCC diagnostic ignored "-Wmissing-prototypes"
////#    pragma GCC diagnostic ignored "-Wextra"
////#  endif
////#endif
////
////#ifndef __OPENCV_TEST_PRECOMP_HPP__
////#define __OPENCV_TEST_PRECOMP_HPP__
////
////#include <opencv2/core/version.hpp>
////#include <opencv2/viz/vizcore.hpp>
////
////namespace cv
////{
////    Mat imread(const String& filename, int flags = 1);
////}
////
////#if CV_MAJOR_VERSION < 3
////    #include "opencv2/ts/ts.hpp"
////#else
////    #include "opencv2/ts.hpp"
////#endif

////#include <iostream>
////#include <fstream>
////#include <string>
////#include <limits>

////namespace cv
////{
//class Path {
//    private static combine2(item1: string, item2: string): string {
//        if (item1 == null || item1 == "")
//            return item2;

//        if (item2 == null || item2 == "")
//            return item1;

//        var last = item1[item1.length - 1];

//        var need_append = last != '/' && last != '\\';
//        return item1 + (need_append ? "/" : "") + item2;
//    }
//    public static combine(item1: string, item2: string, item3?: string): string {
//        if (item3 == null || item3 == "") {
//            return Path.combine2(item1, item2);
//        } else {
//            return combine(combine(item1, item2), item3);
//        }
//    }
//    static change_extension(file: string, ext: string): string {
//        var pos = file.lastIndexOf('.');
//        return (pos == -1) ? file : file.substr(0, pos + 1) + ext;
//    }
//};

//function get_dragon_ply_file_path(): string {
//    return Path.combine(alvision.cvtest.TS.ptr().get_data_path(), "dragon.ply");
//}

////    template<typename _Tp>
////    inline Array< Affine3<_Tp> > generate_test_trajectory()
////    {
////        Array< Affine3<_Tp> > result;
////
////        for (let i = 0, j = 0; i <= 270; i += 3, j += 10)
////        {
////            double x = 2 * cos(i * 3 * Math.PI/180.0) * (1.0 + 0.5 * cos(1.2 + i * 1.2 * Math.PI/180.0));
////            double y = 0.25 + i/270.0 + sin(j * Math.PI/180.0) * 0.2 * sin(0.6 + j * 1.5 * Math.PI/180.0);
////            double z = 2 * sin(i * 3 * Math.PI/180.0) * (1.0 + 0.5 * cos(1.2 + i * Math.PI/180.0));
////            result.push(viz::makeCameraPose(Vec3d(x, y, z), Vec3d::all(0.0), Vec3d(0.0, 1.0, 0.0)));
////        }
////        return result;
////    }

//    function make_gray(image: alvision.Mat): alvision.Mat {
//        //Mat chs[3]; split(image, chs);
//        var chs = new Array<alvision.Mat>();
//        alvision.split(image, chs);
//        return alvision.Mat.from(
//            alvision.MatExpr.op_Addition(
//                alvision.MatExpr.op_Addition(
//                    alvision.MatExpr.op_Multiplication(0.114, chs[0]),
//                    alvision.MatExpr.op_Multiplication(0.58, chs[1])),
//                alvision.MatExpr.op_Multiplication(0.3, chs[2])));
//    }
////}
////
////#endif


////#include "test_precomp.hpp"

////alvision.String alvision.Path::combine(const String& item1, const String& item2)
////{
////    if (item1.empty())
////        return item2;

////    if (item2.empty())
////        return item1;

////    char last = item1[item1.size()-1];

////    bool need_append = last != '/' && last != '\\';
////    return item1 + (need_append ? "/" : "") + item2;
////}

////alvision.String alvision.Path::combine(const String& item1, const String& item2, const String& item3)
////{ return combine(combine(item1, item2), item3); }

////alvision.String alvision.Path::change_extension(const String& file, const String& ext)
////{
////    String::size_type pos = file.find_last_of('.');
////    return pos == String::npos ? file : file.substr(0, pos+1) + ext;
////}
