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

#include "test_precomp.hpp"

#ifdef HAVE_CUDA

using namespace cvtest;

////////////////////////////////////////////////////////////////////////////////
// MatchTemplate8U

CV_ENUM(TemplateMethod, alvision.TM_SQDIFF, alvision.TM_SQDIFF_NORMED, alvision.TM_CCORR, alvision.TM_CCORR_NORMED, alvision.TM_CCOEFF, alvision.TM_CCOEFF_NORMED)
#define ALL_TEMPLATE_METHODS testing::Values(TemplateMethod(alvision.TM_SQDIFF), TemplateMethod(alvision.TM_SQDIFF_NORMED), TemplateMethod(alvision.TM_CCORR), TemplateMethod(alvision.TM_CCORR_NORMED), TemplateMethod(alvision.TM_CCOEFF), TemplateMethod(alvision.TM_CCOEFF_NORMED))

namespace
{
    IMPLEMENT_PARAM_CLASS(TemplateSize, alvision.Size);
}

PARAM_TEST_CASE(MatchTemplate8U, alvision.cuda::DeviceInfo, alvision.Size, TemplateSize, Channels, TemplateMethod)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    alvision.Size templ_size;
    int cn;
    int method;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        templ_size = GET_PARAM(2);
        cn = GET_PARAM(3);
        method = GET_PARAM(4);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(MatchTemplate8U, Accuracy)
{
    alvision.Mat image = randomMat(size, CV_MAKETYPE(CV_8U, cn));
    alvision.Mat templ = randomMat(templ_size, CV_MAKETYPE(CV_8U, cn));

    alvision.Ptr<alvision.cuda::TemplateMatching> alg = alvision.cuda::createTemplateMatching(image.type(), method);

    alvision.cuda::GpuMat dst;
    alg.match(loadMat(image), loadMat(templ), dst);

    alvision.Mat dst_gold;
    alvision.matchTemplate(image, templ, dst_gold, method);

    alvision.Mat h_dst(dst);
    ASSERT_EQ(dst_gold.size(), h_dst.size());
    ASSERT_EQ(dst_gold.type(), h_dst.type());
    for (int y = 0; y < h_dst.rows; ++y)
    {
        for (int x = 0; x < h_dst.cols; ++x)
        {
            float gold_val = dst_gold.at<float>(y, x);
            float actual_val = dst_gold.at<float>(y, x);
            ASSERT_FLOAT_EQ(gold_val, actual_val) << y << ", " << x;
        }
    }
}

INSTANTIATE_TEST_CASE_P(CUDA_ImgProc, MatchTemplate8U, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    testing::Values(TemplateSize(alvision.Size(5, 5)), TemplateSize(alvision.Size(16, 16)), TemplateSize(alvision.Size(30, 30))),
    testing::Values(Channels(1), Channels(3), Channels(4)),
    ALL_TEMPLATE_METHODS));

////////////////////////////////////////////////////////////////////////////////
// MatchTemplate32F

PARAM_TEST_CASE(MatchTemplate32F, alvision.cuda::DeviceInfo, alvision.Size, TemplateSize, Channels, TemplateMethod)
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Size size;
    alvision.Size templ_size;
    int cn;
    int method;

    int n, m, h, w;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        size = GET_PARAM(1);
        templ_size = GET_PARAM(2);
        cn = GET_PARAM(3);
        method = GET_PARAM(4);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(MatchTemplate32F, Regression)
{
    alvision.Mat image = randomMat(size, CV_MAKETYPE(CV_32F, cn));
    alvision.Mat templ = randomMat(templ_size, CV_MAKETYPE(CV_32F, cn));

    alvision.Ptr<alvision.cuda::TemplateMatching> alg = alvision.cuda::createTemplateMatching(image.type(), method);

    alvision.cuda::GpuMat dst;
    alg.match(loadMat(image), loadMat(templ), dst);

    alvision.Mat dst_gold;
    alvision.matchTemplate(image, templ, dst_gold, method);

    alvision.Mat h_dst(dst);
    ASSERT_EQ(dst_gold.size(), h_dst.size());
    ASSERT_EQ(dst_gold.type(), h_dst.type());
    for (int y = 0; y < h_dst.rows; ++y)
    {
        for (int x = 0; x < h_dst.cols; ++x)
        {
            float gold_val = dst_gold.at<float>(y, x);
            float actual_val = dst_gold.at<float>(y, x);
            ASSERT_FLOAT_EQ(gold_val, actual_val) << y << ", " << x;
        }
    }
}

INSTANTIATE_TEST_CASE_P(CUDA_ImgProc, MatchTemplate32F, testing::Combine(
    ALL_DEVICES,
    DIFFERENT_SIZES,
    testing::Values(TemplateSize(alvision.Size(5, 5)), TemplateSize(alvision.Size(16, 16)), TemplateSize(alvision.Size(30, 30))),
    testing::Values(Channels(1), Channels(3), Channels(4)),
    testing::Values(TemplateMethod(alvision.TM_SQDIFF), TemplateMethod(alvision.TM_CCORR))));

////////////////////////////////////////////////////////////////////////////////
// MatchTemplateBlackSource

PARAM_TEST_CASE(MatchTemplateBlackSource, alvision.cuda::DeviceInfo, TemplateMethod)
{
    alvision.cuda::DeviceInfo devInfo;
    int method;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        method = GET_PARAM(1);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(MatchTemplateBlackSource, Accuracy)
{
    alvision.Mat image = readImage("matchtemplate/black.png");
    ASSERT_FALSE(image.empty());

    alvision.Mat pattern = readImage("matchtemplate/cat.png");
    ASSERT_FALSE(pattern.empty());

    alvision.Ptr<alvision.cuda::TemplateMatching> alg = alvision.cuda::createTemplateMatching(image.type(), method);

    alvision.cuda::GpuMat d_dst;
    alg.match(loadMat(image), loadMat(pattern), d_dst);

    alvision.Mat dst(d_dst);

    double maxValue;
    alvision.Point maxLoc;
    alvision.minMaxLoc(dst, NULL, &maxValue, NULL, &maxLoc);

    alvision.Point maxLocGold = alvision.Point(284, 12);

    ASSERT_EQ(maxLocGold, maxLoc);
}

INSTANTIATE_TEST_CASE_P(CUDA_ImgProc, MatchTemplateBlackSource, testing::Combine(
    ALL_DEVICES,
    testing::Values(TemplateMethod(alvision.TM_CCOEFF_NORMED), TemplateMethod(alvision.TM_CCORR_NORMED))));

////////////////////////////////////////////////////////////////////////////////
// MatchTemplate_CCOEF_NORMED

PARAM_TEST_CASE(MatchTemplate_CCOEF_NORMED, alvision.cuda::DeviceInfo, std::pair<std::string, std::string>)
{
    alvision.cuda::DeviceInfo devInfo;
    std::string imageName;
    std::string patternName;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        imageName = GET_PARAM(1).first;
        patternName = GET_PARAM(1).second;

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(MatchTemplate_CCOEF_NORMED, Accuracy)
{
    alvision.Mat image = readImage(imageName);
    ASSERT_FALSE(image.empty());

    alvision.Mat pattern = readImage(patternName);
    ASSERT_FALSE(pattern.empty());

    alvision.Ptr<alvision.cuda::TemplateMatching> alg = alvision.cuda::createTemplateMatching(image.type(), alvision.TM_CCOEFF_NORMED);

    alvision.cuda::GpuMat d_dst;
    alg.match(loadMat(image), loadMat(pattern), d_dst);

    alvision.Mat dst(d_dst);

    alvision.Point minLoc, maxLoc;
    double minVal, maxVal;
    alvision.minMaxLoc(dst, &minVal, &maxVal, &minLoc, &maxLoc);

    alvision.Mat dstGold;
    alvision.matchTemplate(image, pattern, dstGold, alvision.TM_CCOEFF_NORMED);

    double minValGold, maxValGold;
    alvision.Point minLocGold, maxLocGold;
    alvision.minMaxLoc(dstGold, &minValGold, &maxValGold, &minLocGold, &maxLocGold);

    ASSERT_EQ(minLocGold, minLoc);
    ASSERT_EQ(maxLocGold, maxLoc);
    ASSERT_LE(maxVal, 1.0);
    ASSERT_GE(minVal, -1.0);
}

INSTANTIATE_TEST_CASE_P(CUDA_ImgProc, MatchTemplate_CCOEF_NORMED, testing::Combine(
    ALL_DEVICES,
    testing::Values(std::make_pair(std::string("matchtemplate/source-0.png"), std::string("matchtemplate/target-0.png")))));

////////////////////////////////////////////////////////////////////////////////
// MatchTemplate_CanFindBigTemplate

struct MatchTemplate_CanFindBigTemplate : testing::TestWithParam<alvision.cuda::DeviceInfo>
{
    alvision.cuda::DeviceInfo devInfo;

    virtual void SetUp()
    {
        devInfo = GetParam();

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(MatchTemplate_CanFindBigTemplate, SQDIFF_NORMED)
{
    alvision.Mat scene = readImage("matchtemplate/scene.png");
    ASSERT_FALSE(scene.empty());

    alvision.Mat templ = readImage("matchtemplate/template.png");
    ASSERT_FALSE(templ.empty());

    alvision.Ptr<alvision.cuda::TemplateMatching> alg = alvision.cuda::createTemplateMatching(scene.type(), alvision.TM_SQDIFF_NORMED);

    alvision.cuda::GpuMat d_result;
    alg.match(loadMat(scene), loadMat(templ), d_result);

    alvision.Mat result(d_result);

    double minVal;
    alvision.Point minLoc;
    alvision.minMaxLoc(result, &minVal, 0, &minLoc, 0);

    ASSERT_GE(minVal, 0);
    ASSERT_LT(minVal, 1e-3);
    ASSERT_EQ(344, minLoc.x);
    ASSERT_EQ(0, minLoc.y);
}

CUDA_TEST_P(MatchTemplate_CanFindBigTemplate, SQDIFF)
{
    alvision.Mat scene = readImage("matchtemplate/scene.png");
    ASSERT_FALSE(scene.empty());

    alvision.Mat templ = readImage("matchtemplate/template.png");
    ASSERT_FALSE(templ.empty());

    alvision.Ptr<alvision.cuda::TemplateMatching> alg = alvision.cuda::createTemplateMatching(scene.type(), alvision.TM_SQDIFF);

    alvision.cuda::GpuMat d_result;
    alg.match(loadMat(scene), loadMat(templ), d_result);

    alvision.Mat result(d_result);

    double minVal;
    alvision.Point minLoc;
    alvision.minMaxLoc(result, &minVal, 0, &minLoc, 0);

    ASSERT_GE(minVal, 0);
    ASSERT_EQ(344, minLoc.x);
    ASSERT_EQ(0, minLoc.y);
}

INSTANTIATE_TEST_CASE_P(CUDA_ImgProc, MatchTemplate_CanFindBigTemplate, ALL_DEVICES);

#endif // HAVE_CUDA
