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

//////////////////////////////////////////////////////////////////////////
// StereoBM

class StereoBM extends alvision.cvtest.CUDA_TEST// : testing::TestWithParam<alvision.cuda.DeviceInfo>
{
    protected devInfo: alvision.cuda.DeviceInfo;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(StereoBM, Regression)
class StereoBM_Regression extends StereoBM
{
    public TestBody(): void {
        var left_image = alvision.readImage("stereobm/aloe-L.png", alvision.ImreadModes.IMREAD_GRAYSCALE);
        var right_image = alvision.readImage("stereobm/aloe-R.png", alvision.ImreadModes.IMREAD_GRAYSCALE);
        var disp_gold = alvision.readImage("stereobm/aloe-disp.png", alvision.ImreadModes.IMREAD_GRAYSCALE);

        alvision.ASSERT_FALSE(left_image.empty());
        alvision.ASSERT_FALSE(right_image.empty());
        alvision.ASSERT_FALSE(disp_gold.empty());

        var bm = alvision.cuda.createStereoBM(128, 19);
        var disp = new alvision.cuda.GpuMat();

        bm.compute(alvision.loadMat(left_image), alvision.loadMat(right_image), disp);

        alvision.EXPECT_MAT_NEAR(disp_gold, disp, 0.0);

    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Stereo', 'StereoBM', (test_case, test_name) => { return null; }, new alvision.cvtest.Combine([ alvision.ALL_DEVICES]));

//////////////////////////////////////////////////////////////////////////
// StereoBeliefPropagation

class StereoBeliefPropagation extends alvision.cvtest.CUDA_TEST //: testing::TestWithParam<alvision.cuda.DeviceInfo>
{
    protected devInfo: alvision.cuda.DeviceInfo;

    public SetUp(): void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);// GetParam();

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(StereoBeliefPropagation, Regression)
class StereoBeliefPropagation_Regression extends StereoBeliefPropagation
{
    public TestBody(): void {
        var left_image = alvision.readImage("stereobp/aloe-L.png");
        var right_image = alvision.readImage("stereobp/aloe-R.png");
        var disp_gold = alvision.readImage("stereobp/aloe-disp.png", alvision.ImreadModes.IMREAD_GRAYSCALE);

        alvision.ASSERT_FALSE(left_image.empty());
        alvision.ASSERT_FALSE(right_image.empty());
        alvision.ASSERT_FALSE(disp_gold.empty());

        var bp = alvision.cuda.createStereoBeliefPropagation(64, 8, 2, alvision.MatrixType.CV_16S);
        bp.setMaxDataTerm(25.0);
        bp.setDataWeight(0.1);
        bp.setMaxDiscTerm(15.0);
        bp.setDiscSingleJump(1.0);

        var disp = new alvision.cuda.GpuMat();

        bp.compute(alvision.loadMat(left_image), alvision.loadMat(right_image), disp);

        var h_disp = new alvision.Mat (disp);
        h_disp.convertTo(h_disp, disp_gold.depth());

        alvision.EXPECT_MAT_NEAR(disp_gold, h_disp, 0.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Stereo', 'StereoBeliefPropagation', (case_name, test_name) => { return null; },new alvision.cvtest.Combine([ alvision.ALL_DEVICES]));

//////////////////////////////////////////////////////////////////////////
// StereoConstantSpaceBP

class StereoConstantSpaceBP extends alvision.cvtest.CUDA_TEST// : testing::TestWithParam<alvision.cuda.DeviceInfo>
{
    protected devInfo: alvision.cuda.DeviceInfo;

    public SetUp(): void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);// GetParam();

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(StereoConstantSpaceBP, Regression)
class StereoConstantSpaceBP_Regression extends StereoConstantSpaceBP
{
    public TestBody(): void {
        var left_image  = alvision.readImage("csstereobp/aloe-L.png");
        var right_image = alvision.readImage("csstereobp/aloe-R.png");

        var disp_gold = new alvision.Mat();

        if (alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.FEATURE_SET_COMPUTE_20))
            disp_gold = alvision.readImage("csstereobp/aloe-disp.png", alvision.ImreadModes.IMREAD_GRAYSCALE);
        else
            disp_gold = alvision.readImage("csstereobp/aloe-disp_CC1X.png", alvision.ImreadModes.IMREAD_GRAYSCALE);

        alvision.ASSERT_FALSE(left_image.empty());
        alvision.ASSERT_FALSE(right_image.empty());
        alvision.ASSERT_FALSE(disp_gold.empty());

        var csbp = alvision.cuda.createStereoConstantSpaceBP(128, 16, 4, 4);
        var disp = new alvision.cuda.GpuMat();

        csbp.compute(alvision.loadMat(left_image), alvision.loadMat(right_image), disp);

        var h_disp = new alvision.Mat (disp);
        h_disp.convertTo(h_disp, disp_gold.depth());

        alvision.EXPECT_MAT_NEAR(disp_gold, h_disp, 1.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Stereo', 'StereoConstantSpaceBP', (case_name, test_name) => { return null; },new alvision.cvtest.Combine([ alvision.ALL_DEVICES]));

////////////////////////////////////////////////////////////////////////////////
// reprojectImageTo3D

//PARAM_TEST_CASE(ReprojectImageTo3D, alvision.cuda.DeviceInfo, alvision.Size, MatDepth, UseRoi)
class ReprojectImageTo3D extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected depth: alvision.int;
    protected useRoi: boolean;

    public SetUp(): void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.depth =   this.GET_PARAM<alvision.int>(2);
        this.useRoi =  this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(ReprojectImageTo3D, Accuracy)
class ReprojectImageTo3D_Accuracy extends ReprojectImageTo3D
{
    public TestBody(): void {
        var disp = alvision.randomMat(this.size, this.depth, 5.0, 30.0);
        var Q = alvision.randomMat(new alvision.Size(4, 4), alvision.MatrixType.CV_32FC1, 0.1, 1.0);

        var dst = new alvision.cuda.GpuMat();
        alvision.cuda.reprojectImageTo3D(alvision.loadMat(disp, this.useRoi), dst, Q, 3);

        var dst_gold = new alvision.Mat();
        alvision.reprojectImageTo3D(disp, dst_gold, Q, false);

        alvision.EXPECT_MAT_NEAR(dst_gold, dst, 1e-5);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Stereo', 'ReprojectImageTo3D', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8U,alvision.MatrixType.CV_16S],
    alvision.WHOLE_SUBMAT
]));

//#endif // HAVE_CUDA
