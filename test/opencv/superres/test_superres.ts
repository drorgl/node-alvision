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

//
//#include "test_precomp.hpp"
//#include "opencv2/ts/ocl_test.hpp"

class AllignedFrameSource implements alvision.superres.FrameSource
{
    constructor(base: alvision.superres.FrameSource, scale: alvision.int) {
        this.base_ = (base);
        this.scale_ = (scale);

        alvision.CV_Assert(() => this.base_  != null);
    }

    nextFrame(frame: alvision.OutputArray): void {
        this.base_.nextFrame(this.origFrame_);

        if (this.origFrame_.rows().valueOf() % this.scale_.valueOf() == 0 && this.origFrame_.cols().valueOf() % this.scale_.valueOf() == 0)
            this.origFrame_.copyTo(frame);
            //alvision.superres.arrCopy(this.origFrame_, frame);
        else {
            var ROI = new alvision.Rect(0, 0, (this.origFrame_.cols().valueOf() / this.scale_.valueOf()) * this.scale_.valueOf(), (this.origFrame_.rows().valueOf() / this.scale_.valueOf()) * this.scale_.valueOf());
            //alvision.superres.arrCopy(this.origFrame_.roi(ROI), frame);
            this.origFrame_.roi(ROI).copyTo(frame);
        }
    }
    reset(): void {
        this.base_.reset();
    }


    private base_: alvision.superres.FrameSource ;

    private origFrame_: alvision.Mat ;
    private scale_: alvision.int ;
};

class DegradeFrameSource implements alvision.superres.FrameSource
{
    constructor(base: alvision.superres.FrameSource, scale: alvision.int) {
        this.base_ = (base);
        this.iscale_ = (1.0 / scale.valueOf());
        alvision.CV_Assert(()=>this.base_ != null);
    }

    nextFrame(frame: alvision.OutputArray): void {
        this.base_.nextFrame(this.origFrame_);

        alvision.GaussianBlur(this.origFrame_, this.blurred_, new alvision.Size(5, 5), 0);
        alvision.resize(this.blurred_, this.deg_,new  alvision.Size(), this.iscale_, this.iscale_, alvision.InterpolationFlags.INTER_NEAREST);

        addGaussNoise(this.deg_, 10.0);
        addSpikeNoise(this.deg_, 500);

        alvision.superres.arrCopy(this.deg_, frame);
    }
    reset(): void {
        this.base_.reset();
    };


    private base_: alvision.superres.FrameSource;

    private  origFrame_: alvision.Mat;
    private  blurred_  : alvision.Mat;
    private deg_: alvision.Mat;
    private iscale_: alvision.double ;
};


function addGaussNoise(_image: alvision.Mat, sigma: alvision.double ) : void
{
    var type = _image.type(), depth = alvision.MatrixType.CV_MAT_DEPTH(type), cn =alvision.MatrixType. CV_MAT_CN(type);
    var noise = new alvision.Mat ( _image.size(), (cn));
    alvision.cvtest.TS.ptr().get_rng().fill(noise, alvision.DistType.NORMAL, 0.0, sigma);

    alvision.addWeighted(_image, 1.0, noise, 1.0, 0.0, _image, depth);
}

function addSpikeNoise(_image: alvision.Mat, frequency: alvision.int )
{
    let imgSize = _image.size();
    let mask = new alvision.Mat1b(imgSize.height, imgSize.width, 0);

    for (let y = 0; y < mask.rows(); ++y)
        for (let x = 0; x < mask.cols(); ++x)
            if (alvision.cvtest.TS.ptr().get_rng().uniform(0, frequency) < 1)
                mask.at("uchar", y, x).set(255);

    _image.setTo(alvision.Scalar.all(255), mask);
}


function MSSIM(_i1:alvision.Mat, _i2: alvision.InputArray ): alvision.double 
{
    const C1 = 6.5025;
    const C2 = 58.5225;

    const depth =alvision.MatrixType.CV_32F;

    let I1 = new alvision.Mat(), I2 = new alvision.Mat ();
    _i1.getMat().convertTo(I1, depth);
    _i2.getMat().convertTo(I2, depth);

    let I2_2  = I2.mul(I2); // I2^2
    let I1_2  = I1.mul(I1); // I1^2
    let I1_I2 = I1.mul(I2); // I1 * I2

    let mu1 = new alvision.Mat(), mu2 = new alvision.Mat ();
    alvision.GaussianBlur(I1, mu1, new alvision.Size(11, 11), 1.5);
    alvision.GaussianBlur(I2, mu2, new alvision.Size(11, 11), 1.5);

    let mu1_2   = mu1.mul(mu1);
    let mu2_2   = mu2.mul(mu2);
    let mu1_mu2 = mu1.mul(mu2);

    let sigma1_2 = new alvision.Mat(), sigma2_2 = new alvision.Mat(), sigma12 = new alvision.Mat ();

    alvision.GaussianBlur(I1_2, sigma1_2, new alvision.Size(11, 11), 1.5);
    sigma1_2 = alvision.MatExpr.op_Substraction(sigma1_2, mu1_2).toMat();

    alvision.GaussianBlur(I2_2, sigma2_2, new alvision.Size(11, 11), 1.5);
    sigma2_2 = alvision.MatExpr.op_Substraction(sigma2_2, mu2_2).toMat();

    alvision.GaussianBlur(I1_I2, sigma12, new alvision.Size(11, 11), 1.5);
    sigma12 = alvision.MatExpr.op_Substraction(sigma12, mu1_mu2).toMat();

    let t1 = new alvision.Mat(), t2 = new alvision.Mat ();
    let numerator = new alvision.Mat ();
    let denominator = new alvision.Mat ();

    // t3 = ((2*mu1_mu2 + C1).*(2*sigma12 + C2))
    t1 = alvision.MatExpr.op_Multiplication(2, mu1_mu2).op_Addition(C1).toMat();
    t2 = alvision.MatExpr.op_Multiplication(2, sigma12).op_Addition(C2).toMat();
    numerator = t1.mul(t2).toMat();

    // t1 =((mu1_2 + mu2_2 + C1).*(sigma1_2 + sigma2_2 + C2))
    t1 = alvision.MatExpr.op_Addition(mu1_2, mu2_2).op_Addition(C1).toMat()
    t2 = alvision.MatExpr.op_Addition(sigma1_2, sigma2_2).op_Addition(C2).toMat();
    denominator = t1.mul(t2).toMat();

    // ssim_map =  numerator./denominator;
    let ssim_map = new alvision.Mat ();
    alvision.divide(numerator, denominator, ssim_map);

    // mssim = average of ssim map
    let mssim = alvision.mean(ssim_map);

    if (_i1.channels() == 1)
        return mssim[0];

    return (mssim[0] + mssim[1] + mssim[3]) / 3;
}

class SuperResolution extends alvision.cvtest.BaseTest// testing::Test
{
    RunTest<T extends alvision.Mat>(superRes: alvision.superres.SuperResolution): void {
        const inputVideoName = alvision.cvtest.TS.ptr().get_data_path() + "car.avi";
        const scale = 2;
        const iterations = 100;
        const temporalAreaRadius = 2;

        alvision.ASSERT_FALSE(superRes.empty());

        const btvKernelSize = superRes.getKernelSize();

        superRes.setScale(scale);
        superRes.setIterations(iterations);
        superRes.setTemporalAreaRadius(temporalAreaRadius);

        let goldSource = new AllignedFrameSource(alvision.superres.createFrameSource_Video(inputVideoName), scale);
        let lowResSource = new DegradeFrameSource(new AllignedFrameSource(alvision.superres.createFrameSource_Video(inputVideoName), scale), scale);

        // skip first frame
        let frame = new alvision.Mat();

        lowResSource.nextFrame(frame);
        goldSource.nextFrame(frame);

        let inner = new alvision.Rect (btvKernelSize, btvKernelSize, frame.cols().valueOf() - 2 * btvKernelSize.valueOf(), frame.rows().valueOf() - 2 * btvKernelSize.valueOf());

        superRes.setInput(lowResSource);

        let srAvgMSSIM = 0.0;
        const count = 10;

        let goldFrame = new alvision.Mat();
        let superResFrame : T ;
        for (let i = 0; i < count; ++i) {
            goldSource.nextFrame(goldFrame);
            alvision.ASSERT_FALSE(goldFrame.empty());

            superRes.nextFrame(superResFrame);
            alvision.ASSERT_FALSE(superResFrame.empty());

            const srMSSIM = MSSIM(goldFrame.roi(inner), superResFrame);

            srAvgMSSIM += srMSSIM.valueOf();
        }

        srAvgMSSIM /= count;

        alvision.EXPECT_GE(srAvgMSSIM, 0.5);
    }
};

alvision.cvtest.TEST_F('SuperResolution', 'BTVL1', () => {
    let sr = new SuperResolution();
    sr.RunTest<alvision.Mat>(alvision.superres.createSuperResolution_BTVL1());
});

//#if defined(HAVE_CUDA) && defined(HAVE_OPENCV_CUDAARITHM) && defined(HAVE_OPENCV_CUDAWARPING) && defined(HAVE_OPENCV_CUDAFILTERS)

alvision.cvtest.TEST_F('SuperResolution', 'BTVL1_CUDA', () => {
    let sr = new SuperResolution();
    sr.RunTest<alvision.Mat>(alvision.superres.createSuperResolution_BTVL1_CUDA());
});

//#endif
//
//#ifdef HAVE_OPENCL

//namespace cvtest {
//namespace ocl {
//
//OCL_TEST_F(SuperResolution, BTVL1)
//{
//    RunTest<alvision.UMat>(alvision.superres.createSuperResolution_BTVL1());
//}
//
//} } // namespace alvision.cvtest.ocl
//
//#endif
