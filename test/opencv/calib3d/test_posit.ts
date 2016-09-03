//POSIT deprecated

///*M///////////////////////////////////////////////////////////////////////////////////////
////
////  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
////
////  By downloading, copying, installing or using the software you agree to this license.
////  If you do not agree to this license, do not download, install,
////  copy or use the software.
////
////
////                        Intel License Agreement
////                For Open Source Computer Vision Library
////
//// Copyright (C) 2000, Intel Corporation, all rights reserved.
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
////   * The name of Intel Corporation may not be used to endorse or promote products
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
//
//import async = require("async");
//import alvision = require("../../../tsbinding/alvision");
//import util = require('util');
//import fs = require('fs');

////#include "test_precomp.hpp"
////#include "opencv2/calib3d/calib3d_c.h"
////
////using namespace cv;
////using namespace std;

//class CV_POSITTest  extends alvision.cvtest.BaseTest
//{
//    constructor() {
//        super();
//        this.test_case_count = 20;
//    }
//    run(start_from: alvision.int): void {
//        var code = alvision.cvtest.FailureCode.OK;

//        /* fixed parameters output */
//        /*float rot[3][3]={  0.49010f,  0.85057f, 0.19063f,
//                          -0.56948f,  0.14671f, 0.80880f,
//                           0.65997f, -0.50495f, 0.55629f };
    
//        float trans[3] = { 0.0f, 0.0f, 40.02637f };
//        */

//        /* Some variables */
//        //int i, counter;

        
//        var obj_points = new Array<alvision.CvPoint3D32f>();
//        var img_points = new Array<alvision.CvPoint2D32f>();
        

//        //float angleX, angleY, angleZ;
//        var rng = this.ts.get_rng();
//        var progress = 0;

//        var true_rotationX =   new alvision.Mat(3, 3,alvision.MatrixType. CV_32F);
//        var true_rotationY =   new alvision.Mat(3, 3,alvision.MatrixType. CV_32F);
//        var true_rotationZ =   new alvision.Mat(3, 3,alvision.MatrixType. CV_32F);
//        //var tmp_matrix =       new alvision.Mat(3, 3,alvision.MatrixType. CV_32F);
//        var true_rotation =    new alvision.Mat(3, 3,alvision.MatrixType. CV_32F);
//        var rotation =         new alvision.Mat(3, 3,alvision.MatrixType. CV_32F);
//        var translation =      new alvision.Mat(3, 1,alvision.MatrixType. CV_32F);
//        var true_translation = new alvision.Mat(3, 1,alvision.MatrixType. CV_32F);

//        const  flFocalLength = 760.;
//        const  flEpsilon = 0.5;

//        /* Initilization */
//        var criteria = new alvision.TermCriteria(alvision.TermCriteriaType.EPS | alvision.TermCriteriaType.MAX_ITER, 10000, flEpsilon);

//        //criteria.type = alvision.TermCriteriaType.EPS | alvision.TermCriteriaType.MAX_ITER;
//        //criteria.epsilon = flEpsilon;
//        //criteria.max_iter = 10000;

//        /* Allocating source arrays; */
//        //obj_points = (CvPoint3D32f *)cvAlloc(8 * sizeof(CvPoint3D32f));
//        //img_points = (CvPoint2D32f *)cvAlloc(8 * sizeof(CvPoint2D32f));

//        /* Fill points arrays with values */

//        /* cube model with edge size 10 */
//        obj_points[0].x = 0; obj_points[0].y = 0; obj_points[0].z = 0;
//        obj_points[1].x = 10; obj_points[1].y = 0; obj_points[1].z = 0;
//        obj_points[2].x = 10; obj_points[2].y = 10; obj_points[2].z = 0;
//        obj_points[3].x = 0; obj_points[3].y = 10; obj_points[3].z = 0;
//        obj_points[4].x = 0; obj_points[4].y = 0; obj_points[4].z = 10;
//        obj_points[5].x = 10; obj_points[5].y = 0; obj_points[5].z = 10;
//        obj_points[6].x = 10; obj_points[6].y = 10; obj_points[6].z = 10;
//        obj_points[7].x = 0; obj_points[7].y = 10; obj_points[7].z = 10;

//        /* Loop for test some random object positions */
//        for (var counter = start_from.valueOf(); counter < this.test_case_count; counter++) {
//            this.ts.update_context(this, counter, true);
//            progress = this.update_progress(progress, counter, this.test_case_count, 0).valueOf();

//            /* set all rotation matrix to zero */
//            true_rotationX.setTo(new alvision.Scalar(0));
//            true_rotationY.setTo(new alvision.Scalar(0));
//            true_rotationZ.setTo(new alvision.Scalar(0));
//            //cvZero(true_rotationX);
//            //cvZero(true_rotationY);
//            //cvZero(true_rotationZ);

//            /* fill random rotation matrix */
//            var angleX = (alvision.cvtest.randReal(rng).valueOf() * 2 * Math.PI);
//            var angleY = (alvision.cvtest.randReal(rng).valueOf() * 2 * Math.PI);
//            var angleZ = (alvision.cvtest.randReal(rng).valueOf() * 2 * Math.PI);

//            var xptr = true_rotationX.ptr<alvision.float>("float");

//            xptr[0 * 3 + 0] = 1;
//            xptr[1 * 3 + 1] = Math.cos(angleX);
//            xptr[2 * 3 + 2] = xptr[1 * 3 + 1];
//            xptr[1 * 3 + 2] = -Math.sin(angleX);
//            xptr[2 * 3 + 1] = -xptr[1 * 3 + 2];


//            var yptr = true_rotationY.ptr<alvision.float>("float");

//            yptr[1 * 3 + 1] = 1;
//            yptr[0 * 3 + 0] = Math.cos(angleY);
//            yptr[2 * 3 + 2] = yptr[0 * 3 + 0];
//            yptr[0 * 3 + 2] = -Math.sin(angleY);
//            yptr[2 * 3 + 0] = -yptr[0 * 3 + 2];

//            var zptr = true_rotationZ.ptr<alvision.float>("float");

//            zptr[2 * 3 + 2] = 1;
//            zptr[0 * 3 + 0] = Math.cos(angleZ);
//            zptr[1 * 3 + 1] = zptr[0 * 3 + 0];
//            zptr[0 * 3 + 1] = -Math.sin(angleZ);
//            zptr[1 * 3 + 0] = -zptr[0 * 3 + 1];

//            var tmp_matrix = alvision.MatExpr.op_Multiplication(true_rotationX, true_rotationY);
//            //cvMatMul(true_rotationX, true_rotationY, tmp_matrix);
//            true_rotation = alvision.MatExpr.op_Multiplication(tmp_matrix, true_rotationZ).toMat();
//            //cvMatMul(tmp_matrix, true_rotationZ, true_rotation);

//            /* fill translation vector */

//            var ttptr = true_translation.ptr<alvision.float>("float");

//            ttptr[2] =  (alvision.cvtest.randReal(rng).valueOf() * (2 * flFocalLength - 40) + 60);
//            ttptr[0] = ((alvision.cvtest.randReal(rng).valueOf() * 2 - 1) * ttptr[2].valueOf());
//            ttptr[1] = ((alvision.cvtest.randReal(rng).valueOf() * 2 - 1) * ttptr[2].valueOf());

//            /* calculate perspective projection */
//            for (var i = 0; i < 8; i++) {
//                //float vec[3];
//                var Vec = new alvision.Mat(3, 1, alvision.MatrixType.CV_32F);//, vec);
//                var Obj_point = new alvision.Mat(3, 1,alvision.MatrixType. CV_32F, &obj_points[i].x);

//                cvMatMul(true_rotation, &Obj_point, &Vec);

//                vec[0] += true_translation.data.fl[0];
//                vec[1] += true_translation.data.fl[1];
//                vec[2] += true_translation.data.fl[2];

//                img_points[i].x = flFocalLength * vec[0] / vec[2];
//                img_points[i].y = flFocalLength * vec[1] / vec[2];
//            }

//            /*img_points[0].x = 0 ; img_points[0].y =   0;
//            img_points[1].x = 80; img_points[1].y = -93;
//            img_points[2].x = 245;img_points[2].y =  -77;
//            img_points[3].x = 185;img_points[3].y =  32;
//            img_points[4].x = 32; img_points[4].y = 135;
//            img_points[5].x = 99; img_points[5].y = 35;
//            img_points[6].x = 247; img_points[6].y = 62;
//            img_points[7].x = 195; img_points[7].y = 179;
//            */

//            CvPOSITObject * object;

//            object = cvCreatePOSITObject(obj_points, 8);
//            cvPOSIT(object, img_points, flFocalLength, criteria,
//                rotation.data.fl, translation.data.fl);
//            cvReleasePOSITObject( &object);

//            //Mat _rotation = cvarrToMat(rotation), _true_rotation = cvarrToMat(true_rotation);
//            //Mat _translation = cvarrToMat(translation), _true_translation = cvarrToMat(true_translation);
//            code = alvision.cvtest.cmpEps2(this.ts, rotation, true_rotation, flEpsilon, false, "rotation matrix");
//            if (code < 0)
//                break;

//            code = alvision.cvtest.cmpEps2(this.ts, translation, true_translation, flEpsilon, false, "translation vector");
//            if (code < 0)
//                break;
//        }

//        //cvFree( &obj_points);
//        //cvFree( &img_points);
//        //
//        //cvReleaseMat( &true_rotationX);
//        //cvReleaseMat( &true_rotationY);
//        //cvReleaseMat( &true_rotationZ);
//        //cvReleaseMat( &tmp_matrix);
//        //cvReleaseMat( &true_rotation);
//        //cvReleaseMat( &rotation);
//        //cvReleaseMat( &translation);
//        //cvReleaseMat( &true_translation);

//        if (code < 0)
//            this.ts.set_failed_test_info(code);
//    }
//};



//alvision.cvtest.TEST('Calib3d_POSIT', 'accuracy', () => { var test = new CV_POSITTest (); test.safe_run(); });

///* End of file. */
