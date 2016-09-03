/*M///////////////////////////////////////////////////////////////////////////////////////
//
//  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
//
//  By downloading, copying, installing or using the software you agree to this license.
//  If you do not agree to this license, do not download, install,
//  copy or use the software.
//
//
//                        Intel License Agreement
//                For Open Source Computer Vision Library
//
// Copyright (C) 2000, Intel Corporation, all rights reserved.
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
//   * The name of Intel Corporation may not be used to endorse or promote products
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

import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');


//#include "test_precomp.hpp"
//#include "opencv2/video/tracking_c.h"
//
//using namespace cv;

class CV_KalmanTest extends alvision. cvtest.BaseTest
{
    run(iii: alvision.int): void {
        var code = alvision.cvtest.FailureCode.OK;
        const  Dim = 7;
        const  Steps = 100;
        const  max_init = 1;
        const  max_noise = 0.1;

        const EPSILON = 1.000;
        var rng = this.ts.get_rng();
        //CvKalman * Kalm;
        var Kalm: alvision.KalmanFilter;
        

        var Sample = new alvision.Mat(Dim, 1, alvision.MatrixType.CV_32F);

        var Temp = new alvision.Mat(Dim, 1, alvision.MatrixType.CV_32F);

        Kalm = new alvision.KalmanFilter(Dim, Dim);
        //Kalm = cvCreateKalman(Dim, Dim);
        
        //CvMat Dyn = cvMat(Dim, Dim, alvision.MatrixType.CV_32F, Kalm .DynamMatr);
        //CvMat Mes = cvMat(Dim, Dim, alvision.MatrixType.CV_32F, Kalm .MeasurementMatr);
        //CvMat PNC = cvMat(Dim, Dim, alvision.MatrixType.CV_32F, Kalm .PNCovariance);
        //CvMat MNC = cvMat(Dim, Dim, alvision.MatrixType.CV_32F, Kalm .MNCovariance);
        //CvMat PriErr = cvMat(Dim, Dim,  alvision.MatrixType.CV_32F, Kalm .PriorErrorCovariance);
        //CvMat PostErr = cvMat(Dim, Dim, alvision.MatrixType.CV_32F, Kalm .PosterErrorCovariance);
        //CvMat PriState = cvMat(Dim, 1,  alvision.MatrixType.CV_32F, Kalm .PriorState);
        //CvMat PostState = cvMat(Dim, 1, alvision.MatrixType.CV_32F, Kalm .PosterState);
        alvision.setIdentity(Kalm.processNoiseCov);
        alvision.setIdentity(Kalm.errorCovPre);
        alvision.setIdentity(Kalm.errorCovPost);

        Kalm.measurementNoiseCov.setTo(new alvision.Scalar(0));
        //cvSetZero(&MNC);
        Kalm.statePost.setTo(new alvision.Scalar(0));
        //cvSetZero(&PriState);
        Kalm.statePre.setTo(new alvision.Scalar(0));
        //cvSetZero(&PostState);


        alvision.setIdentity(Kalm.measurementMatrix);
        alvision.setIdentity(Kalm.transitionMatrix);
        //Mat _Sample = cvarrToMat(Sample);
        alvision.cvtest.randUni(rng, Sample, alvision.Scalar.all(-max_init), alvision.Scalar.all(max_init));
        Kalm.correct(Sample);
        //cvKalmanCorrect(Kalm, Sample);

            
        var DynData = Kalm.transitionMatrix.ptr<alvision.float>("float");
        var SampleData = Sample.ptr<alvision.float>("float");
        var TempData = Temp.ptr<alvision.float>("float");

        for (var i = 0; i < Steps; i++) {
            //cvKalmanPredict(Kalm);
            Kalm.predict();
            for (var j = 0; j < Dim; j++) {
                var t = 0;
                for (var k= 0; k < Dim; k++)
                {
                    
                    t += DynData[j * Dim + k].valueOf() * SampleData[k].valueOf();
                }
                TempData[j]= (t + (alvision.cvtest.randReal(rng).valueOf() * 2 - 1) * max_noise);
            }
            Temp.copyTo(Sample);
            //cvCopy(Temp, Sample);
            Kalm.correct(Temp);
            //cvKalmanCorrect(Kalm, Temp);
        }

        
        //Mat _state_post = cvarrToMat(Kalm .state_post);
        code = alvision.cvtest.cmpEps2(this.ts, Sample, Kalm.statePost, EPSILON, false, "The final estimated state");

        //cvReleaseMat(&Sample);
        //cvReleaseMat(&Temp);
        //cvReleaseKalman(&Kalm);

        if (code < 0)
            this.ts.set_failed_test_info(code);
    }
};


alvision.cvtest.TEST('Video_Kalman', 'accuracy', () => { var test = new CV_KalmanTest (); test.safe_run(); });

/* End of file. */
