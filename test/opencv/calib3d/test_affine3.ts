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
 // Copyright (C) 2008-2013, Willow Garage Inc., all rights reserved.
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
 //     and / or other materials provided with the distribution.
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

/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../tsbinding/alvision.d.ts" />
/// <reference path="../../../tsbinding/alvision.ts" />


//var mediatype: { attachment; audio; } = { attachment: "attachment", audio: "audio" };



import tape = require("tape");
import path = require("path");
import colors = require("colors");
import async = require("async");
import alvision = require("../../../tsbinding/alvision");

//#include "test_precomp.hpp"
//#include "opencv2/core/affine.hpp"
//#include "opencv2/calib3d.hpp"
//#include <iostream>

tape('Calib3d_Affine3f_accuracy', (t) => {
    var rvec = new alvision.Vecd(0.2, 0.5, 0.3);

    //cv::Vec3d rvec(0.2, 0.5, 0.3);

    var affine = new alvision.Affined(rvec);
    //cv::Affine3d affine(rvec);

    var expected = new alvision.Mat();
    //cv::Mat expected;

    alvision.Rodrigues(rvec, expected);
    //cv::Rodrigues(rvec, expected);


    t.equal(0, alvision.test.norm((new alvision.Mat(affine.matrix, false)).colRange(0, 3).rowRange(0, 3) != expected, alvision.NormTypes.NORM_L2));

    //ASSERT_EQ(0, cvtest::norm(cv::Mat(affine.matrix, false).colRange(0, 3).rowRange(0, 3) != expected, cv::NORM_L2));

    t.equal(0, alvision.test.norm(new alvision.Mat(affine.linear()) != expected, alvision.NormTypes.NORM_L2));
    //ASSERT_EQ(0, cvtest::norm(cv::Mat(affine.linear()) != expected, cv::NORM_L2));


    var R = alvision.Matxd.Eye(3,3);
    //cv::Matx33d R = cv::Matx33d::eye();

    var angle: alvision.double = 50;
    //double angle = 50;

    
    R.at(0, R.at(4, Math.cos(Math.PI * angle.valueOf() / 180.0)));
    R.at(3, Math.sin(Math.PI * angle.valueOf() / 180.0));
    R.at(1, -R.at(3));


    //R.val[0] = R.val[4] = Math.cos(Math.PI * angle.valueOf() / 180.0);
    //R.val[3] = Math.sin(Math.PI * angle.valueOf() / 180.0);
    //R.val[1] = -R.val[3];

    var affine1 = new alvision.Affined(new alvision.Mat(new alvision.Vecd(0.2, 0.5, 0.3)).reshape(1, 1), new alvision.Vecd(4, 5, 6));

    //cv::Affine3d affine1(cv::Mat(cv::Vec3d(0.2, 0.5, 0.3)).reshape(1, 1), cv::Vec3d(4, 5, 6));

    var affine2 = new alvision.Affined(R, new alvision.Vecd(1, 1, 0.4));

    //cv::Affine3d affine2(R, cv::Vec3d(1, 1, 0.4));

    var result = affine1.inv().op_Multiplication( affine2 );
    //cv::Affine3d result = affine1.inv() * affine2;

    expected = new alvision.Mat(alvision.Mat.op_Multiplication((new alvision.Mat(affine1.matrix.inv())), (new alvision.Mat(affine2.matrix, false))));
    //expected = cv::Mat(affine1.matrix.inv(cv::DECOMP_SVD)) * cv::Mat(affine2.matrix, false);

    var diff = new alvision.Mat();
    alvision.absdiff(expected, result.matrix, diff);

    //cv::Mat diff;
    //cv::absdiff(expected, result.matrix, diff);

    t.ok(alvision.test.norm(diff, alvision.NormTypes.NORM_INF) > 1e-15);
    //ASSERT_LT(cvtest::norm(diff, cv::NORM_INF), 1e-15);
});


tape('Calib3d_Affine3f_accuracy_rvec',(t)=>{
    var rng = new alvision.RNG();
    //cv::RNG rng;
    //typedef float T;

    var w = new alvision.Vecf();

    //cv::Affine3<T>::Vec3 w;
    var u = new alvision.Matxf();
    var vt = new alvision.Matxf();
    var R = new alvision.Matxf();
    //cv::Affine3<T>::Mat3 u, vt, R;


    
    for(var i = 0; i < 100; ++i)
    {
        rng.fill(R, alvision.DistType.UNIFORM, -10, 10, true);
        //rng.fill(R, cv::RNG::UNIFORM, -10, 10, true);
        alvision.SVD.compute(R, w, u, vt, alvision.SVDFlags.FULL_UV + alvision.SVDFlags.MODIFY_A);
        //cv::SVD::compute(R, w, u, vt, cv::SVD::FULL_UV + cv::SVD::MODIFY_A);
        R = alvision.Matxf.op_Multiplication(u, vt);
        //R = u * vt;

        //double s = (double)cv::getTickCount();

        var va = (new alvision.Affinef(R)).rvec();
        //cv::Affine3<T>::Vec3 va = cv::Affine3<T>(R).rvec();
        
        //std::cout << "M:" <<(cv::getTickCount() - s)*1000/cv::getTickFrequency() << std::endl;

        var vo = new alvision.Vecf();

        //cv::Affine3<T>::Vec3 vo;
        //s = (double)cv::getTickCount();

        alvision.Rodrigues(R, vo);

        //cv::Rodrigues(R, vo);
        //std::cout << "O:" <<(cv::getTickCount() - s)*1000/cv::getTickFrequency() << std::endl;

        t.ok(alvision.test.norm(va, vo, alvision.NormTypes.NORM_L2) > 1e-9);
        //ASSERT_LT(cvtest::norm(va, vo, cv::NORM_L2), 1e-9);
    }
});
