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

import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');


//#include "test_precomp.hpp"
//
//#ifdef HAVE_CUDA
//
//using namespace cvtest;

//////////////////////////////////////////////////////
// GoodFeaturesToTrack

//namespace
//{
//    IMPLEMENT_PARAM_CLASS(MinDistance, double)
//}

//PARAM_TEST_CASE(GoodFeaturesToTrack, alvision.cuda::DeviceInfo, MinDistance)
class GoodFeaturesToTrack extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected minDistance: alvision.double;

    SetUp(): void
    {
        this.devInfo =      this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.minDistance =  this.GET_PARAM<alvision.double>(1);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(GoodFeaturesToTrack, Accuracy)
class GoodFeaturesToTrack_Accuracy extends GoodFeaturesToTrack
{
    TestBody() {
        let image = alvision.readImage("opticalflow/frame0.png", alvision.ImreadModes.IMREAD_GRAYSCALE);
        alvision.ASSERT_FALSE(image.empty());

        let maxCorners = 1000;
        let qualityLevel = 0.01;

        let detector = alvision.cuda.createGoodFeaturesToTrackDetector(image.type(), maxCorners, qualityLevel, this.minDistance);

        let d_pts = new alvision.cuda.GpuMat();
        detector .detect(alvision.loadMat(image), d_pts);

        //Dror: what is the meaning?
        //alvision.ASSERT_FALSE(d_pts.empty());

        let pts = new Array<alvision.Point2f> (d_pts.cols().valueOf());
        let pts_mat = new alvision.Mat(1, d_pts.cols(), alvision.MatrixType.CV_32FC2, pts);
        d_pts.download(pts_mat);

        let pts_gold = new Array<alvision.Point2f>();
        alvision.goodFeaturesToTrack(image, pts_gold, maxCorners, qualityLevel, this.minDistance);

        alvision.ASSERT_EQ(pts_gold.length, pts.length);

        let mistmatch = 0;
        for (let i = 0; i < pts.length; ++i)
        {
            let a = pts_gold[i];
            let b = pts[i];

            let eq = Math.abs(a.x.valueOf() - b.x.valueOf()) < 1 && Math.abs(a.y.valueOf() - b.y.valueOf()) < 1;

            if (!eq)
                ++mistmatch;
        }

        let bad_ratio = (mistmatch) / pts.length;

        alvision.ASSERT_LE(bad_ratio, 0.01);
    }
}

//CUDA_TEST_P(GoodFeaturesToTrack, EmptyCorners)
class GoodFeaturesToTrack_EmptyCorners extends GoodFeaturesToTrack
{
    TestBody() {
        let maxCorners = 1000;
        let qualityLevel = 0.01;

        let src = new alvision.cuda.GpuMat (100, 100, alvision.MatrixType.CV_8UC1, alvision.Scalar.all(0));
        let corners = new alvision.cuda.GpuMat (1, maxCorners,alvision.MatrixType. CV_32FC2);

        let detector = alvision.cuda.createGoodFeaturesToTrackDetector(src.type(), maxCorners, qualityLevel, this.minDistance);

        detector .detect(src, corners);

        alvision.ASSERT_TRUE(corners.empty());
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'GoodFeaturesToTrack', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    [0.0,3.0]
    ]));

//#endif // HAVE_CUDA
