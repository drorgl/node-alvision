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

//////////////////////////////////////////////////////
// BroxOpticalFlow

//#define BROX_DUMP

struct BroxOpticalFlow : testing::TestWithParam<alvision.cuda::DeviceInfo>
{
    alvision.cuda::DeviceInfo devInfo;

    virtual void SetUp()
    {
        devInfo = GetParam();

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(BroxOpticalFlow, Regression)
{
    alvision.Mat frame0 = readImageType("opticalflow/frame0.png", CV_32FC1);
    ASSERT_FALSE(frame0.empty());

    alvision.Mat frame1 = readImageType("opticalflow/frame1.png", CV_32FC1);
    ASSERT_FALSE(frame1.empty());

    alvision.Ptr<alvision.cuda::BroxOpticalFlow> brox =
            alvision.cuda::BroxOpticalFlow::create(0.197 /*alpha*/, 50.0 /*gamma*/, 0.8 /*scale_factor*/,
                                              10 /*inner_iterations*/, 77 /*outer_iterations*/, 10 /*solver_iterations*/);

    alvision.cuda::GpuMat flow;
    brox->calc(loadMat(frame0), loadMat(frame1), flow);

    alvision.cuda::GpuMat flows[2];
    alvision.cuda::split(flow, flows);

    alvision.cuda::GpuMat u = flows[0];
    alvision.cuda::GpuMat v = flows[1];

    std::string fname(alvision.cvtest.TS.ptr().get_data_path());
    if (devInfo.majorVersion() >= 2)
        fname += "opticalflow/brox_optical_flow_cc20.bin";
    else
        fname += "opticalflow/brox_optical_flow.bin";

#ifndef BROX_DUMP
    std::ifstream f(fname, std::ios_base::binary);

    int rows, cols;

    f.read((char*) &rows, sizeof(rows));
    f.read((char*) &cols, sizeof(cols));

    alvision.Mat u_gold(rows, cols, CV_32FC1);

    for (int i = 0; i < u_gold.rows; ++i)
        f.read(u_gold.ptr<char>(i), u_gold.cols * sizeof(float));

    alvision.Mat v_gold(rows, cols, CV_32FC1);

    for (int i = 0; i < v_gold.rows; ++i)
        f.read(v_gold.ptr<char>(i), v_gold.cols * sizeof(float));

    EXPECT_MAT_SIMILAR(u_gold, u, 1e-3);
    EXPECT_MAT_SIMILAR(v_gold, v, 1e-3);
#else
    std::ofstream f(fname, std::ios_base::binary);

    f.write((char*) &u.rows, sizeof(u.rows));
    f.write((char*) &u.cols, sizeof(u.cols));

    alvision.Mat h_u(u);
    alvision.Mat h_v(v);

    for (int i = 0; i < u.rows; ++i)
        f.write(h_u.ptr<char>(i), u.cols * sizeof(float));

    for (int i = 0; i < v.rows; ++i)
        f.write(h_v.ptr<char>(i), v.cols * sizeof(float));
#endif
}

CUDA_TEST_P(BroxOpticalFlow, OpticalFlowNan)
{
    alvision.Mat frame0 = readImageType("opticalflow/frame0.png", CV_32FC1);
    ASSERT_FALSE(frame0.empty());

    alvision.Mat frame1 = readImageType("opticalflow/frame1.png", CV_32FC1);
    ASSERT_FALSE(frame1.empty());

    alvision.Mat r_frame0, r_frame1;
    alvision.resize(frame0, r_frame0, alvision.Size(1380,1000));
    alvision.resize(frame1, r_frame1, alvision.Size(1380,1000));

    alvision.Ptr<alvision.cuda::BroxOpticalFlow> brox =
            alvision.cuda::BroxOpticalFlow::create(0.197 /*alpha*/, 50.0 /*gamma*/, 0.8 /*scale_factor*/,
                                              10 /*inner_iterations*/, 77 /*outer_iterations*/, 10 /*solver_iterations*/);

    alvision.cuda::GpuMat flow;
    brox->calc(loadMat(frame0), loadMat(frame1), flow);

    alvision.cuda::GpuMat flows[2];
    alvision.cuda::split(flow, flows);

    alvision.cuda::GpuMat u = flows[0];
    alvision.cuda::GpuMat v = flows[1];

    alvision.Mat h_u, h_v;
    u.download(h_u);
    v.download(h_v);

    EXPECT_TRUE(alvision.checkRange(h_u));
    EXPECT_TRUE(alvision.checkRange(h_v));
};

INSTANTIATE_TEST_CASE_P(CUDA_OptFlow, BroxOpticalFlow, ALL_DEVICES);

//////////////////////////////////////////////////////
// PyrLKOpticalFlow

namespace
{
    IMPLEMENT_PARAM_CLASS(UseGray, bool)
}

PARAM_TEST_CASE(PyrLKOpticalFlow, alvision.cuda::DeviceInfo, UseGray)
{
    alvision.cuda::DeviceInfo devInfo;
    bool useGray;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        useGray = GET_PARAM(1);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(PyrLKOpticalFlow, Sparse)
{
    alvision.Mat frame0 = readImage("opticalflow/frame0.png", useGray ? alvision.ImreadModes.IMREAD_GRAYSCALE : alvision.ImreadModes.IMREAD_COLOR);
    ASSERT_FALSE(frame0.empty());

    alvision.Mat frame1 = readImage("opticalflow/frame1.png", useGray ? alvision.ImreadModes.IMREAD_GRAYSCALE : alvision.ImreadModes.IMREAD_COLOR);
    ASSERT_FALSE(frame1.empty());

    alvision.Mat gray_frame;
    if (useGray)
        gray_frame = frame0;
    else
        alvision.cvtColor(frame0, gray_frame, alvision.COLOR_BGR2GRAY);

    std::Array<alvision.Point2f> pts;
    alvision.goodFeaturesToTrack(gray_frame, pts, 1000, 0.01, 0.0);

    alvision.cuda::GpuMat d_pts;
    alvision.Mat pts_mat(1, (int) pts.size(), CV_32FC2, (void*) &pts[0]);
    d_pts.upload(pts_mat);

    alvision.Ptr<alvision.cuda::SparsePyrLKOpticalFlow> pyrLK =
            alvision.cuda::SparsePyrLKOpticalFlow::create();

    alvision.cuda::GpuMat d_nextPts;
    alvision.cuda::GpuMat d_status;
    pyrLK->calc(loadMat(frame0), loadMat(frame1), d_pts, d_nextPts, d_status);

    std::Array<alvision.Point2f> nextPts(d_nextPts.cols);
    alvision.Mat nextPts_mat(1, d_nextPts.cols, CV_32FC2, (void*) &nextPts[0]);
    d_nextPts.download(nextPts_mat);

    std::Array<unsigned char> status(d_status.cols);
    alvision.Mat status_mat(1, d_status.cols, CV_8UC1, (void*) &status[0]);
    d_status.download(status_mat);

    std::Array<alvision.Point2f> nextPts_gold;
    std::Array<unsigned char> status_gold;
    alvision.calcOpticalFlowPyrLK(frame0, frame1, pts, nextPts_gold, status_gold, alvision.noArray());

    ASSERT_EQ(nextPts_gold.size(), nextPts.size());
    ASSERT_EQ(status_gold.size(), status.size());

    size_t mistmatch = 0;
    for (size_t i = 0; i < nextPts.size(); ++i)
    {
        alvision.Point2i a = nextPts[i];
        alvision.Point2i b = nextPts_gold[i];

        if (status[i] != status_gold[i])
        {
            ++mistmatch;
            continue;
        }

        if (status[i])
        {
            bool eq = std::abs(a.x - b.x) <= 1 && std::abs(a.y - b.y) <= 1;

            if (!eq)
                ++mistmatch;
        }
    }

    double bad_ratio = static_cast<double>(mistmatch) / nextPts.size();

    ASSERT_LE(bad_ratio, 0.01);
}

INSTANTIATE_TEST_CASE_P(CUDA_OptFlow, PyrLKOpticalFlow, testing::Combine(
    ALL_DEVICES,
    testing::Values(UseGray(true), UseGray(false))));

//////////////////////////////////////////////////////
// FarnebackOpticalFlow

namespace
{
    IMPLEMENT_PARAM_CLASS(PyrScale, double)
    IMPLEMENT_PARAM_CLASS(PolyN, int)
    CV_FLAGS(FarnebackOptFlowFlags, 0, OPTFLOW_FARNEBACK_GAUSSIAN)
    IMPLEMENT_PARAM_CLASS(UseInitFlow, bool)
}

PARAM_TEST_CASE(FarnebackOpticalFlow, alvision.cuda::DeviceInfo, PyrScale, PolyN, FarnebackOptFlowFlags, UseInitFlow)
{
    alvision.cuda::DeviceInfo devInfo;
    double pyrScale;
    int polyN;
    int flags;
    bool useInitFlow;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        pyrScale = GET_PARAM(1);
        polyN = GET_PARAM(2);
        flags = GET_PARAM(3);
        useInitFlow = GET_PARAM(4);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(FarnebackOpticalFlow, Accuracy)
{
    alvision.Mat frame0 = readImage("opticalflow/rubberwhale1.png", alvision.ImreadModes.IMREAD_GRAYSCALE);
    ASSERT_FALSE(frame0.empty());

    alvision.Mat frame1 = readImage("opticalflow/rubberwhale2.png", alvision.ImreadModes.IMREAD_GRAYSCALE);
    ASSERT_FALSE(frame1.empty());

    double polySigma = polyN <= 5 ? 1.1 : 1.5;

    alvision.Ptr<alvision.cuda::FarnebackOpticalFlow> farn =
            alvision.cuda::FarnebackOpticalFlow::create();
    farn->setPyrScale(pyrScale);
    farn->setPolyN(polyN);
    farn->setPolySigma(polySigma);
    farn->setFlags(flags);

    alvision.cuda::GpuMat d_flow;
    farn->calc(loadMat(frame0), loadMat(frame1), d_flow);

    alvision.Mat flow;
    if (useInitFlow)
    {
        d_flow.download(flow);

        farn->setFlags(farn->getFlags() | alvision.OPTFLOW_USE_INITIAL_FLOW);
        farn->calc(loadMat(frame0), loadMat(frame1), d_flow);
    }

    alvision.calcOpticalFlowFarneback(
        frame0, frame1, flow, farn->getPyrScale(), farn->getNumLevels(), farn->getWinSize(),
        farn->getNumIters(), farn->getPolyN(), farn->getPolySigma(), farn->getFlags());

    EXPECT_MAT_SIMILAR(flow, d_flow, 0.1);
}

INSTANTIATE_TEST_CASE_P(CUDA_OptFlow, FarnebackOpticalFlow, testing::Combine(
    ALL_DEVICES,
    testing::Values(PyrScale(0.3), PyrScale(0.5), PyrScale(0.8)),
    testing::Values(PolyN(5), PolyN(7)),
    testing::Values(FarnebackOptFlowFlags(0), FarnebackOptFlowFlags(alvision.OPTFLOW_FARNEBACK_GAUSSIAN)),
    testing::Values(UseInitFlow(false), UseInitFlow(true))));

//////////////////////////////////////////////////////
// OpticalFlowDual_TVL1

namespace
{
    IMPLEMENT_PARAM_CLASS(Gamma, double)
}

PARAM_TEST_CASE(OpticalFlowDual_TVL1, alvision.cuda::DeviceInfo, Gamma)
{
    alvision.cuda::DeviceInfo devInfo;
    double gamma;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        gamma = GET_PARAM(1);

        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(OpticalFlowDual_TVL1, Accuracy)
{
    alvision.Mat frame0 = readImage("opticalflow/rubberwhale1.png", alvision.ImreadModes.IMREAD_GRAYSCALE);
    ASSERT_FALSE(frame0.empty());

    alvision.Mat frame1 = readImage("opticalflow/rubberwhale2.png", alvision.ImreadModes.IMREAD_GRAYSCALE);
    ASSERT_FALSE(frame1.empty());

    alvision.Ptr<alvision.cuda::OpticalFlowDual_TVL1> d_alg =
            alvision.cuda::OpticalFlowDual_TVL1::create();
    d_alg->setNumIterations(10);
    d_alg->setGamma(gamma);

    alvision.cuda::GpuMat d_flow;
    d_alg->calc(loadMat(frame0), loadMat(frame1), d_flow);

    alvision.Ptr<alvision.DualTVL1OpticalFlow> alg = alvision.createOptFlow_DualTVL1();
    alg->setMedianFiltering(1);
    alg->setInnerIterations(1);
    alg->setOuterIterations(d_alg->getNumIterations());
    alg->setGamma(gamma);

    alvision.Mat flow;
    alg->calc(frame0, frame1, flow);

    EXPECT_MAT_SIMILAR(flow, d_flow, 4e-3);
}

INSTANTIATE_TEST_CASE_P(CUDA_OptFlow, OpticalFlowDual_TVL1, testing::Combine(
    ALL_DEVICES,
    testing::Values(Gamma(0.0), Gamma(1.0))));

#endif // HAVE_CUDA
