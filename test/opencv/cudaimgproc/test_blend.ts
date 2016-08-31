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

//#include "test_precomp.hpp"
//
//#ifdef HAVE_CUDA
//
//using namespace cvtest;
//
//////////////////////////////////////////////////////////////////////////////
//// Blend
//
//namespace
//{
    //template <typename T>
function blendLinearGold<T>(Ttype:string, img1: alvision.Mat, img2: alvision.Mat, weights1: alvision.Mat, weights2: alvision.Mat, result_gold: alvision.Mat ): void 
    {
        result_gold.create(img1.size(), img1.type());

        let cn = img1.channels();

        for (let y = 0; y < img1.rows(); ++y)
        {
            const  weights1_row = weights1.ptr<alvision.float>("float",y);
            const  weights2_row = weights2.ptr<alvision.float>("float",y);
            const img1_row = img1.ptr<T>(Ttype,y);
            const img2_row = img2.ptr<T>(Ttype,y);
            let  result_gold_row = result_gold.ptr<T>(Ttype, y);

            for (let x = 0; x < img1.cols().valueOf() * cn.valueOf(); ++x)
            {
                let w1 = weights1_row[x / cn.valueOf()].valueOf();
                let w2 = weights2_row[x / cn.valueOf()].valueOf();
                result_gold_row[x] = <any> ((<any>img1_row[x] * w1 + <any>img2_row[x] * w2) / (w1 + w2 + 1e-5));
            }
        }
    }
//}

//PARAM_TEST_CASE(Blend, alvision.cuda.DeviceInfo, alvision.Size, MatType, UseRoi)
class Blend extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected type: alvision.int;
    protected useRoi: boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.type =    this.GET_PARAM<alvision.int>(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(Blend, Accuracy)
class Blend_Accuracy extends Blend
{
    TestBody() {
        let depth = alvision.MatrixType.CV_MAT_DEPTH(this.type);

        let img1 = alvision.randomMat(this.size, this.type, 0.0, depth == alvision.MatrixType.CV_8U ? 255.0 : 1.0);
        let img2 = alvision.randomMat(this.size, this.type, 0.0, depth == alvision.MatrixType.CV_8U ? 255.0 : 1.0);
        let weights1 = alvision.randomMat(this.size, alvision.MatrixType.CV_32F, 0, 1);
        let weights2 = alvision.randomMat(this.size, alvision.MatrixType.CV_32F, 0, 1);

        let result = new alvision.Mat();
        alvision.cudaimgproc.blendLinear(alvision.loadMat(img1, this.useRoi), alvision.loadMat(img2, this.useRoi), alvision.loadMat(weights1, this.useRoi), alvision.loadMat(weights2, this.useRoi), result);

        let result_gold = new alvision.Mat();
        if (depth == alvision.MatrixType.CV_8U)
            blendLinearGold<alvision.uchar>("uchar",img1, img2, weights1, weights2, result_gold);
        else
            blendLinearGold<alvision.float>("float",img1, img2, weights1, weights2, result_gold);

        alvision.EXPECT_MAT_NEAR(result_gold, result, alvision.MatrixType.CV_MAT_DEPTH(this.type) == alvision.MatrixType.CV_8U ? 1.0 : 1e-5);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'Blend', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8UC1,alvision.MatrixType.CV_8UC3,alvision.MatrixType.CV_8UC4,alvision.MatrixType.CV_32FC1,alvision.MatrixType.CV_32FC3,alvision.MatrixType.CV_32FC4],
    alvision.WHOLE_SUBMAT
    ]));

//#endif // HAVE_CUDA
