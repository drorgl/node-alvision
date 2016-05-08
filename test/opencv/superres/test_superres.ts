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

//
//#include "test_precomp.hpp"
//#include "opencv2/ts/ocl_test.hpp"

class AllignedFrameSource : public alvision.superres::FrameSource
{
public:
    AllignedFrameSource(const alvision.Ptr<alvision.superres::FrameSource>& base, int scale);

    void nextFrame(alvision.OutputArray frame);
    void reset();

private:
    alvision.Ptr<alvision.superres::FrameSource> base_;

    alvision.Mat origFrame_;
    int scale_;
};

AllignedFrameSource::AllignedFrameSource(const alvision.Ptr<alvision.superres::FrameSource>& base, int scale) :
    base_(base), scale_(scale)
{
    CV_Assert( base_ );
}

void AllignedFrameSource::nextFrame(alvision.OutputArray frame)
{
    base_.nextFrame(origFrame_);

    if (origFrame_.rows % scale_ == 0 && origFrame_.cols % scale_ == 0)
        alvision.superres::arrCopy(origFrame_, frame);
    else
    {
        alvision.Rect ROI(0, 0, (origFrame_.cols / scale_) * scale_, (origFrame_.rows / scale_) * scale_);
        alvision.superres::arrCopy(origFrame_(ROI), frame);
    }
}

void AllignedFrameSource::reset()
{
    base_.reset();
}

class DegradeFrameSource : public alvision.superres::FrameSource
{
public:
    DegradeFrameSource(const alvision.Ptr<alvision.superres::FrameSource>& base, int scale);

    void nextFrame(alvision.OutputArray frame);
    void reset();

private:
    alvision.Ptr<alvision.superres::FrameSource> base_;

    alvision.Mat origFrame_;
    alvision.Mat blurred_;
    alvision.Mat deg_;
    double iscale_;
};

DegradeFrameSource::DegradeFrameSource(const alvision.Ptr<alvision.superres::FrameSource>& base, int scale) :
    base_(base), iscale_(1.0 / scale)
{
    CV_Assert( base_ );
}

static void addGaussNoise(alvision.OutputArray _image, double sigma)
{
    int type = _image.type(), depth = CV_MAT_DEPTH(type), cn = CV_MAT_CN(type);
    alvision.Mat noise(_image.size(), CV_32FC(cn));
    alvision.cvtest.TS::ptr().get_rng().fill(noise, alvision.RNG::NORMAL, 0.0, sigma);

    alvision.addWeighted(_image, 1.0, noise, 1.0, 0.0, _image, depth);
}

static void addSpikeNoise(alvision.OutputArray _image, int frequency)
{
    alvision.Mat_<uchar> mask(_image.size(), 0);

    for (int y = 0; y < mask.rows; ++y)
        for (int x = 0; x < mask.cols; ++x)
            if (alvision.cvtest.TS::ptr().get_rng().uniform(0, frequency) < 1)
                mask(y, x) = 255;

    _image.setTo(alvision.Scalar::all(255), mask);
}

void DegradeFrameSource::nextFrame(alvision.OutputArray frame)
{
    base_.nextFrame(origFrame_);

    alvision.GaussianBlur(origFrame_, blurred_, alvision.Size(5, 5), 0);
    alvision.resize(blurred_, deg_, alvision.Size(), iscale_, iscale_, alvision.INTER_NEAREST);

    addGaussNoise(deg_, 10.0);
    addSpikeNoise(deg_, 500);

    alvision.superres::arrCopy(deg_, frame);
}

void DegradeFrameSource::reset()
{
    base_.reset();
}

double MSSIM(alvision.InputArray _i1, alvision.InputArray _i2)
{
    const double C1 = 6.5025;
    const double C2 = 58.5225;

    const int depth = CV_32F;

    alvision.Mat I1, I2;
    _i1.getMat().convertTo(I1, depth);
    _i2.getMat().convertTo(I2, depth);

    alvision.Mat I2_2  = I2.mul(I2); // I2^2
    alvision.Mat I1_2  = I1.mul(I1); // I1^2
    alvision.Mat I1_I2 = I1.mul(I2); // I1 * I2

    alvision.Mat mu1, mu2;
    alvision.GaussianBlur(I1, mu1, alvision.Size(11, 11), 1.5);
    alvision.GaussianBlur(I2, mu2, alvision.Size(11, 11), 1.5);

    alvision.Mat mu1_2   = mu1.mul(mu1);
    alvision.Mat mu2_2   = mu2.mul(mu2);
    alvision.Mat mu1_mu2 = mu1.mul(mu2);

    alvision.Mat sigma1_2, sigma2_2, sigma12;

    alvision.GaussianBlur(I1_2, sigma1_2, alvision.Size(11, 11), 1.5);
    sigma1_2 -= mu1_2;

    alvision.GaussianBlur(I2_2, sigma2_2, alvision.Size(11, 11), 1.5);
    sigma2_2 -= mu2_2;

    alvision.GaussianBlur(I1_I2, sigma12, alvision.Size(11, 11), 1.5);
    sigma12 -= mu1_mu2;

    alvision.Mat t1, t2;
    alvision.Mat numerator;
    alvision.Mat denominator;

    // t3 = ((2*mu1_mu2 + C1).*(2*sigma12 + C2))
    t1 = 2 * mu1_mu2 + C1;
    t2 = 2 * sigma12 + C2;
    numerator = t1.mul(t2);

    // t1 =((mu1_2 + mu2_2 + C1).*(sigma1_2 + sigma2_2 + C2))
    t1 = mu1_2 + mu2_2 + C1;
    t2 = sigma1_2 + sigma2_2 + C2;
    denominator = t1.mul(t2);

    // ssim_map =  numerator./denominator;
    alvision.Mat ssim_map;
    alvision.divide(numerator, denominator, ssim_map);

    // mssim = average of ssim map
    alvision.Scalar mssim = alvision.mean(ssim_map);

    if (_i1.channels() == 1)
        return mssim[0];

    return (mssim[0] + mssim[1] + mssim[3]) / 3;
}

class SuperResolution : public testing::Test
{
public:
    template <typename T>
    void RunTest(alvision.Ptr<alvision.superres::SuperResolution> superRes);
};

template <typename T>
void SuperResolution::RunTest(alvision.Ptr<alvision.superres::SuperResolution> superRes)
{
    const std::string inputVideoName = alvision.cvtest.TS.ptr().get_data_path() + "car.avi";
    const int scale = 2;
    const int iterations = 100;
    const int temporalAreaRadius = 2;

    ASSERT_FALSE( superRes.empty() );

    const int btvKernelSize = superRes.getKernelSize();

    superRes.setScale(scale);
    superRes.setIterations(iterations);
    superRes.setTemporalAreaRadius(temporalAreaRadius);

    alvision.Ptr<alvision.superres::FrameSource> goldSource(new AllignedFrameSource(alvision.superres::createFrameSource_Video(inputVideoName), scale));
    alvision.Ptr<alvision.superres::FrameSource> lowResSource(new DegradeFrameSource(
        alvision.makePtr<AllignedFrameSource>(alvision.superres::createFrameSource_Video(inputVideoName), scale), scale));

    // skip first frame
    alvision.Mat frame;

    lowResSource.nextFrame(frame);
    goldSource.nextFrame(frame);

    alvision.Rect inner(btvKernelSize, btvKernelSize, frame.cols - 2 * btvKernelSize, frame.rows - 2 * btvKernelSize);

    superRes.setInput(lowResSource);

    double srAvgMSSIM = 0.0;
    const int count = 10;

    alvision.Mat goldFrame;
    T superResFrame;
    for (int i = 0; i < count; ++i)
    {
        goldSource.nextFrame(goldFrame);
        ASSERT_FALSE( goldFrame.empty() );

        superRes.nextFrame(superResFrame);
        ASSERT_FALSE( superResFrame.empty() );

        const double srMSSIM = MSSIM(goldFrame(inner), superResFrame);

        srAvgMSSIM += srMSSIM;
    }

    srAvgMSSIM /= count;

    EXPECT_GE( srAvgMSSIM, 0.5 );
}

TEST_F(SuperResolution, BTVL1)
{
    RunTest<alvision.Mat>(alvision.superres::createSuperResolution_BTVL1());
}

#if defined(HAVE_CUDA) && defined(HAVE_OPENCV_CUDAARITHM) && defined(HAVE_OPENCV_CUDAWARPING) && defined(HAVE_OPENCV_CUDAFILTERS)

TEST_F(SuperResolution, BTVL1_CUDA)
{
    RunTest<alvision.Mat>(alvision.superres::createSuperResolution_BTVL1_CUDA());
}

#endif

#ifdef HAVE_OPENCL

namespace cvtest {
namespace ocl {

OCL_TEST_F(SuperResolution, BTVL1)
{
    RunTest<alvision.UMat>(alvision.superres::createSuperResolution_BTVL1());
}

} } // namespace alvision.cvtest.ocl

#endif
