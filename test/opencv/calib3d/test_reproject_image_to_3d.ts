//TODO: Implement 2nd stage

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
//// Copyright (C) 2000-2008, Intel Corporation, all rights reserved.
//// Copyright (C) 2009, Willow Garage Inc., all rights reserved.
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
////M*/

//import tape = require("tape");
//import path = require("path");
//import colors = require("colors");
//import async = require("async");
//import alvision = require("../../../tsbinding/alvision");
//import util = require('util');
//import fs = require('fs');

////#include "test_precomp.hpp"
////#include "opencv2/calib3d/calib3d_c.h"
////#include <string>
////#include <limits>
////
////using namespace cv;
////using namespace std;
////
////template<class T> double thres() { return 1.0; }
////template<> double thres<float>() { return 1e-5; }

//class CV_ReprojectImageTo3DTest  extends alvision.cvtest.BaseTest
//{

//    run(iii: alvision.int) : void
//    {
//        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
//        var progress = 0;
//        var caseId = 0;


//        //var matfFactory = function () {
//        //    return new (Function.prototype.bind.apply(alvision.Matf, arguments));
//        //}

//        //var matiFactory = function () {
//        //    return new (Function.prototype.bind.apply(alvision.Mati, arguments));
//        //}

//        //var matsFactory = function () {
//        //    return new (Function.prototype.bind.apply(alvision.Mats, arguments));
//        //}

//        //var matbFactory = function () {
//        //    return new (Function.prototype.bind.apply(alvision.Matb, arguments));
//        //}

//        progress = this.update_progress( progress, 1, 14, 0 ).valueOf();
//        this.runCase<alvision.float, alvision.float>("float","float", ++caseId, -100., 100.);
//        progress = this.update_progress( progress, 2, 14, 0 ).valueOf();
//        this.runCase<alvision.int, alvision.float>("int","float", ++caseId, -100, 100);
//        progress = this.update_progress( progress, 3, 14, 0 ).valueOf();
//        this.runCase<alvision.short, alvision.float>("short","float", ++caseId, -100, 100);
//        progress = this.update_progress( progress, 4, 14, 0 ).valueOf();
//        this.runCase<alvision.uchar, alvision.float>("uchar","float", ++caseId, 10, 100);
//        progress = this.update_progress( progress, 5, 14, 0 ).valueOf();

//        this.runCase<alvision.float, alvision.int>("float","int", ++caseId, -100., 100.);
//        progress = this.update_progress( progress, 6, 14, 0 ).valueOf();
//        this.runCase<alvision.int, alvision.int>("int","int", ++caseId, -100, 100);
//        progress = this.update_progress(progress, 7, 14, 0).valueOf();
//        this.runCase<alvision.short, alvision.int>("short","int", ++caseId, -100, 100);
//        progress = this.update_progress( progress, 8, 14, 0 ).valueOf();
//        this.runCase<alvision.uchar, alvision.int>("uchar","int", ++caseId, 10, 100);
//        progress = this.update_progress( progress, 10, 14, 0 ).valueOf();

//        this.runCase<alvision.float, alvision.short>("float","short", ++caseId, -100., 100.);
//        progress = this.update_progress( progress, 11, 14, 0 ).valueOf();
//        this.runCase<alvision.int, alvision.short>("int","short", ++caseId, -100, 100);
//        progress = this.update_progress( progress, 12, 14, 0 ).valueOf();
//        this.runCase<alvision.short, alvision.short>("short","short", ++caseId, -100, 100);
//        progress = this.update_progress( progress, 13, 14, 0 ).valueOf();
//        this.runCase<alvision.uchar, alvision.short>("uchar","short", ++caseId, 10, 100);
//        progress = this.update_progress( progress, 14, 14, 0 ).valueOf();
//    }


//    //template<class U, class V> double error(const Vec<U, 3>& v1, const Vec<V, 3>& v2) const
//    error<U,V>(v1 : alvision.Vec<U>,v2 : alvision.Vec<V>) : alvision.double
//    {
//        var tmp, sum = 0;
//        var nsum = 0;
//        for(var i = 0; i < 3; ++i)
//        {
//            tmp = v1[i];
//            nsum +=  tmp * tmp;

//            tmp = tmp - v2[i];
//            sum += tmp * tmp;

//        }
//        return Math.sqrt(sum)/(Math.sqrt(nsum)+1.);
//    }

//    //template<class InT, class OutT> void runCase(int caseId, InT min, InT max)
//runCase<InT,OutT>(InT : string, OutT : string,caseId : alvision.int, min : InT, max : InT) : void
//    {
//        //typedef Vec<OutT, 3> out3d_t;

//        var handleMissingValues = alvision.theRNG().unsigned().valueOf() % 2 == 0;

//        switch (InT) {
//            case "int":
//                var disp = <alvision.Mat_<InT>><any>(new alvision.Mati(new alvision.Size(320, 240)));
//                var out3d_t = <alvision.Vec<OutT>><any>alvision.Veci;
//                break;
//            case "short":
//                var disp = <alvision.Mat_<InT>><any>new alvision.Mats(new alvision.Size(320, 240));
//                var out3d_t = <alvision.Vec<OutT>><any>alvision.Vecs;
//                break;
//            case "float":
//                var disp = <alvision.Mat_<InT>><any>new alvision.Matf(new alvision.Size(320, 240));
//                var out3d_t = <alvision.Vec<OutT>><any>alvision.Vecf;
//                break;
//            case "uchar":
//                var disp = <alvision.Mat_<InT>><any>new alvision.Matb(new alvision.Size(320, 240));
//                var out3d_t = <alvision.Vec<OutT>><any>alvision.Vecb;
//                break;
//            default:
//                throw new Error("not implemented!");
//        }

//        //Mat_<InT> disp(new alvision.Size(320, 240));
//        alvision.randu(disp, new alvision.Scalar(<any>min), new alvision.Scalar(<any>max));

//        if (handleMissingValues)
//            disp.at<InT>("InT", disp.rows.valueOf() / 2, disp.cols.valueOf() / 2).set(<any>(<any>min - 1));

//        var Q = new alvision.Matd(4, 4);
//        alvision.randu(Q, new alvision.Scalar(-5), new alvision.Scalar(5));

//        Mat_<out3d_t> _3dImg(disp.size());

//        var cvdisp = disp; var cv_3dImg = _3dImg; var cvQ = Q;
//        alvision.reprojectImageTo3D( cvdisp, cv_3dImg, cvQ, handleMissingValues );

//        if (numeric_limits<OutT>::max() == alvision.FLT_MAX /*alvision.FLT_MAX*/)
//            alvision.reprojectImageTo3D(disp, _3dImg, Q, handleMissingValues);

//        for(var y = 0; y < disp.rows; ++y)
//            for(var x = 0; x < disp.cols; ++x)
//            {
//                InT d = disp(y, x);

//                var from = [
//                    x,
//                    y,
//                    d,
//                    1.0,
//                ];
//                var  res = Q.op_Multiplication(new alvision.Matd(4, 1, from));
//                res = res.op_Division( res.Element(3, 0));

//                var pixel_exp = res.ptr<alvision.Vecd>("Vecd");
//                out3d_t pixel_out = _3dImg(y, x);

//                const largeZValue = 10000; /* see documentation */

//                if (handleMissingValues && y == disp.rows/2 && x == disp.cols/2)
//                {
//                    if (pixel_out[2] == largeZValue)
//                        continue;

//                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "Missing values are handled improperly\n");
//                    this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
//                    return;
//                }
//                else
//                {
//                    var err = this.error(pixel_out, pixel_exp), t = thres<OutT>();
//                    if ( err > t )
//                    {
//                        this.ts.printf(alvision.cvtest.TSConstants.LOG, "case %d. too big error at (%d, %d): %g vs expected %g: res = (%g, %g, %g, w=%g) vs pixel_out = (%g, %g, %g)\n",
//                            caseId, x, y, err, t, res(0,0), res(1,0), res(2,0), res(3,0),
//                            (double)pixel_out[0], (double)pixel_out[1], (double)pixel_out[2]);
//                        this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
//                        return;
//                    }
//                }
//            }
//    }
//};

//alvision.cvtest.TEST('Calib3d_ReprojectImageTo3D', 'accuracy', () => { var test = new CV_ReprojectImageTo3DTest(); test.safe_run(); });
