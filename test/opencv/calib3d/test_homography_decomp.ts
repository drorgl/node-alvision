/*M///////////////////////////////////////////////////////////////////////////////////////
 //
 // This is a test file for the function decomposeHomography contributed to OpenCV
 // by Samson Yilma.
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
 // Copyright (C) 2014, Samson Yilma¸ (samson_yilma@yahoo.com), all rights reserved.
 //
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

import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');

//#include "test_precomp.hpp"
//#include "opencv2/calib3d.hpp"
//#include <vector>
//
//using namespace cv;
//using namespace std;

class CV_HomographyDecompTest extends alvision.cvtest.BaseTest {

    constructor()
    {
        super();
        this.buildTestDataSet();
    }

    run(iii: alvision.int) : void
    {
        var rotations = new Array<alvision.Mat>();
        var translations =new  Array<alvision.Mat> ();
        var normals =new  Array<alvision.Mat>() ;

        alvision.decomposeHomographyMat(this._H, this._K, rotations, translations, normals);

        //there should be at least 1 solution
        alvision.ASSERT_GT((rotations.length), 0);
        alvision.ASSERT_GT((translations.length), 0);
        alvision.ASSERT_GT((normals.length), 0);

        alvision.ASSERT_EQ(rotations.length, normals.length);
        alvision.ASSERT_EQ(translations.length, normals.length);

        alvision.ASSERT_TRUE(this.containsValidMotion(rotations, translations, normals));

        alvision.decomposeHomographyMat(this._H, this._K, rotations, null, null);
        alvision.ASSERT_GT((rotations.length), 0);
    }

    buildTestDataSet() : void
    {
        this._K = new alvision.Matx33d(640, 0.0,  320,
                      0,    640, 240,
                      0,    0,   1);

         this._H = new alvision.Matx33d(2.649157564634028,  4.583875997496426,  70.694447785121326,
                     -1.072756858861583,  3.533262150437228,  1513.656999614321649,
                      0.001303887589576,  0.003042206876298,  1.000000000000000
                      );

        //expected solution for the given homography and intrinsic matrices
         this._R = new alvision.Matx33d(0.43307983549125, 0.545749113549648, -0.717356090899523,
                     -0.85630229674426, 0.497582023798831, -0.138414255706431,
                      0.281404038139784, 0.67421809131173, 0.682818960388909);

         this._t = new alvision.Vec3d(1.826751712278038,  1.264718492450820,  0.195080809998819);
         this._n = new alvision.Vec3d(0.244875830334816, 0.480857890778889, 0.841909446789566);
    }

    containsValidMotion(rotations: Array<alvision.Mat>,
        translations: Array<alvision.Mat> , 
        normals: Array<alvision.Mat> 
    ): boolean
    {
        var max_error = 1.0e-3;

        for (var i = 0; i < Math.max(Math.max(rotations.length, translations.length), normals.length); i++){
            var riter = rotations[i];
            var titer = translations[i];
            var niter = normals[i];

            var rdist = alvision.norm(riter,this. _R, alvision.NormTypes.NORM_INF);
            var tdist = alvision.norm(titer,this. _t, alvision.NormTypes.NORM_INF);
            var ndist = alvision.norm(niter,this. _n, alvision.NormTypes.NORM_INF);

            if (   rdist < max_error
                && tdist < max_error
                && ndist < max_error )
                return true;
        }

        return false;
    }

    protected _R: alvision.Matx33d;
    protected _K: alvision.Matx33d;
    protected _H: alvision.Matx33d;
    protected _t: alvision.Vec3d;
    protected _n: alvision.Vec3d;
};

alvision.cvtest.TEST('Calib3d_DecomposeHomography', 'regression', () => { var test = new CV_HomographyDecompTest(); test.safe_run(); });
