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

import tape = require("tape");
import path = require("path");

import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');

//#include "test_precomp.hpp"
//#include "opencv2/core/affine.hpp"
//#include "opencv2/calib3d.hpp"
//#include < iostream >

alvision.cvtest.TEST('Calib3d_Affine3f', 'accuracy', () => {
    var rvec = new alvision.Vec3d(0.2, 0.5, 0.3);
    var affine = new alvision.Affine3d(rvec);

    var expected = new alvision.Mat();
    alvision.Rodrigues(rvec, expected);


    alvision.ASSERT_EQ(0, alvision.cvtest.norm(alvision.MatExpr.op_NotEquals( new alvision.Mat(affine.matrix, false).colRange(0, 3).rowRange(0, 3),  expected).toMat(), alvision.NormTypes.NORM_L2));
    alvision.ASSERT_EQ(0, alvision.cvtest.norm(alvision.MatExpr.op_NotEquals(new alvision.Mat(affine.linear()) , expected).toMat(), alvision.NormTypes.NORM_L2));


    var R = alvision.Matx33d.eye(); //33

    var angle = 50;
    R.val[0] = R.val[4] = Math.cos(Math.PI * angle / 180.0);
    R.val[3] = Math.sin(Math.PI * angle / 180.0);
    R.val[1] = -R.val[3];


    var affine1 = new alvision.Affine3d(new alvision.Mat(new alvision.Vec3d(0.2, 0.5, 0.3)).reshape(1, 1), new alvision.Vec3d(4, 5, 6));
    var affine2 = new alvision.Affine3d(R, new alvision.Vec3d(1, 1, 0.4));

    var result = alvision.Affine3d.op_Multiplication( affine1.inv() , affine2);

    expected = alvision.Mat.from(alvision.MatExpr.op_Multiplication(new alvision.Mat(affine1.matrix.inv(alvision.DecompTypes.DECOMP_SVD)), new alvision.Mat(affine2.matrix, false)));


    var diff = new alvision.Mat();
    alvision.absdiff(expected, result.matrix, diff);

    alvision.ASSERT_LT(alvision.cvtest.norm(diff, alvision.NormTypes.NORM_INF).valueOf(), 1e-15);
});

alvision.cvtest.TEST('Calib3d_Affine3f', 'accuracy_rvec',()=>
{
    var rng = new alvision.RNG();
    //typedef float T;

    //alvision.Affine3<T>::Vec3 w;
    var w = new alvision.Vec3f();
    //alvision.Affine3<T>::Mat3 u, vt, R;
    var u = new alvision.Matx33f();
    var vt = new alvision.Matx33f();
    var R = new alvision.Matx33f();

    for (var i = 0; i < 100; ++i)
    {
        rng.fill(R, alvision.DistType.UNIFORM, -10, 10, true);
        alvision.SVD.compute(R, w, u, vt, alvision.SVDFlags.FULL_UV + alvision.SVDFlags.MODIFY_A);
        R = alvision.Matx33f.op_Multiplication(u, vt);

        //double s = (double)alvision.getTickCount();
        //alvision.Affine3<T>::Vec3 va = alvision.Affine3<T>(R).rvec();
        var va = (new alvision.Affine3f(R)).rvec();
        //console.log("M:" <<(alvision.getTickCount() - s)*1000/alvision.getTickFrequency() << std::endl;

        //alvision.Affine3<T>::Vec3 vo;
        var vo = new alvision.Vec3f();
        //s = (double)alvision.getTickCount();
        alvision.Rodrigues(R, vo);
        //console.log("O:" <<(alvision.getTickCount() - s)*1000/alvision.getTickFrequency() << std::endl;

        alvision.ASSERT_LT(alvision.cvtest.norm(va, vo, alvision.NormTypes.NORM_L2).valueOf(), 1e-9);
    }
});
