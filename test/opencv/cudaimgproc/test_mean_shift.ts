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

////////////////////////////////////////////////////////////////////////////////
// MeanShift

class MeanShift extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;

    protected img: alvision.Mat;

    protected spatialRad: alvision.int;
    protected colorRad: alvision.int;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);

        alvision.cuda.setDevice(this.devInfo.deviceID());

        this.img = alvision.readImageType("meanshift/cones.png",alvision.MatrixType.CV_8UC4);
        alvision.ASSERT_FALSE(this.img.empty());

        this.spatialRad = 30;
        this.colorRad = 30;
    }
};

//CUDA_TEST_P(MeanShift, Filtering)
class MeanShift_Filtering extends MeanShift
{
    TestBody() {
        let img_template = new alvision.Mat();
        if (alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.FEATURE_SET_COMPUTE_20))
            img_template = alvision.readImage("meanshift/con_result.png");
        else
            img_template = alvision.readImage("meanshift/con_result_CC1X.png");
        alvision.ASSERT_FALSE(img_template.empty());

        let d_dst = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.meanShiftFiltering(alvision.loadMat(this.img), d_dst, this.spatialRad,this. colorRad);

        alvision.ASSERT_EQ(alvision.MatrixType.CV_8UC4, d_dst.type());

        let dst = new alvision.Mat (d_dst);

        let result = new alvision.Mat();
        alvision.cvtColor(dst, result, alvision.ColorConversionCodes.COLOR_BGRA2BGR);

        alvision.EXPECT_MAT_NEAR(img_template, result, 0.0);
    }
}

//CUDA_TEST_P(MeanShift, Proc)
class MeanShift_Proc extends MeanShift
{
    TestBody(){
        let fs = new alvision.FileStorage();
        if (alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.FEATURE_SET_COMPUTE_20))
            fs.open(alvision.cvtest.TS.ptr().get_data_path() + "meanshift/spmap.yaml", alvision.FileStorageMode.READ);
        else
            fs.open(alvision.cvtest.TS.ptr().get_data_path() + "meanshift/spmap_CC1X.yaml", alvision.FileStorageMode.READ);
        alvision.ASSERT_TRUE(fs.isOpened());

        let spmap_template = new alvision.Mat();
        fs.nodes["spmap"].readMat(spmap_template);
        alvision.ASSERT_FALSE(spmap_template.empty());

        let rmap_filtered = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.meanShiftFiltering(alvision.loadMat(this.img), rmap_filtered, this.spatialRad, this.colorRad);

        let rmap = new alvision.cuda.GpuMat();
        let spmap = new alvision.cuda.GpuMat();
        alvision.cudaimgproc.meanShiftProc(alvision.loadMat(this.img), rmap, spmap, this.spatialRad, this.colorRad);

        alvision.ASSERT_EQ(alvision.MatrixType.CV_8UC4, rmap.type());

        alvision.EXPECT_MAT_NEAR(rmap_filtered, rmap, 0.0);
        alvision.EXPECT_MAT_NEAR(spmap_template, spmap, 0.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'MeanShift', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES
]));

////////////////////////////////////////////////////////////////////////////////
// MeanShiftSegmentation

//namespace
//{
//    IMPLEMENT_PARAM_CLASS(MinSize, int);
//}

//PARAM_TEST_CASE(MeanShiftSegmentation, alvision.cuda.DeviceInfo, MinSize)
class MeanShiftSegmentation extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected minsize: alvision.int;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.minsize = this.GET_PARAM<alvision.int>(1);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(MeanShiftSegmentation, Regression)
class MeanShiftSegmentation_Regression extends MeanShiftSegmentation
{
    TestBody() {
        let img = alvision.readImageType("meanshift/cones.png",alvision.MatrixType. CV_8UC4);
        alvision.ASSERT_FALSE(img.empty());

        let path = "";
        path += "meanshift/cones_segmented_sp10_sr10_minsize" + this.minsize;
        if (alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.FEATURE_SET_COMPUTE_20))
            path += ".png";
        else
            path += "_CC1X.png";
        let dst_gold = alvision.readImage(path);
        alvision.ASSERT_FALSE(dst_gold.empty());

        let dst = new alvision.Mat();
        alvision.cudaimgproc.meanShiftSegmentation(alvision.loadMat(img), dst, 10, 10, this.minsize);

        let dst_rgb = new alvision.Mat();
        alvision.cvtColor(dst, dst_rgb, alvision.ColorConversionCodes.COLOR_BGRA2BGR);

        alvision.EXPECT_MAT_SIMILAR(dst_gold, dst_rgb, 1e-3);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'MeanShiftSegmentation', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    [0,4,20,84,340,1364]
    ]));

//#endif // HAVE_CUDA
