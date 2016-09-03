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
// BroxOpticalFlow

//#define BROX_DUMP

class BroxOpticalFlow extends alvision.cvtest.CUDA_TEST// : testing::TestWithParam<alvision.cuda.DeviceInfo>
{
    protected devInfo: alvision.cuda.DeviceInfo;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(BroxOpticalFlow, Regression)
class BroxOpticalFlow_Regression extends BroxOpticalFlow {
    TestBody(): void {
        var frame0 = alvision.readImageType("opticalflow/frame0.png", alvision.MatrixType.CV_32FC1);
        alvision.ASSERT_FALSE(frame0.empty());

        var frame1 = alvision.readImageType("opticalflow/frame1.png", alvision.MatrixType.CV_32FC1);
        alvision.ASSERT_FALSE(frame1.empty());

        var brox =
        alvision.cudaoptflow.BroxOpticalFlow.create(0.197 /*alpha*/, 50.0 /*gamma*/, 0.8 /*scale_factor*/,
            10 /*inner_iterations*/, 77 /*outer_iterations*/, 10 /*solver_iterations*/);

        var flow = new alvision.cuda.GpuMat();
        brox.calc(alvision.loadMat(frame0), alvision.loadMat(frame1), flow);

        var flows = new Array < alvision.cuda.GpuMat >(2);
        alvision.cudaarithm.split(flow, flows);

        var u = flows[0];
        var v = flows[1];

        var fname = alvision.cvtest.TS.ptr().get_data_path();
        if (this.devInfo.majorVersion() >= 2)
            fname += "opticalflow/brox_optical_flow_cc20.bin";
        else
            fname += "opticalflow/brox_optical_flow.bin";

        //#ifndef BROX_DUMP
        //    std::ifstream f(fname, std::ios_base::binary);
        //
        //    int rows, cols;
        //
        //    f.read((char*) &rows, sizeof(rows));
        //    f.read((char*) &cols, sizeof(cols));
        //
        //    alvision.Mat u_gold(rows, cols, alvision.MatrixType.CV_32FC1);
        //
        //    for (let i = 0; i < u_gold.rows; ++i)
        //        f.read(u_gold.ptr<char>(i), u_gold.cols * sizeof(float));
        //
        //        alvision.Mat v_gold(rows, cols, alvision.MatrixType.CV_32FC1);
        //
        //    for (let i = 0; i < v_gold.rows; ++i)
        //        f.read(v_gold.ptr<char>(i), v_gold.cols * sizeof(float));
        //
        //    EXPECT_MAT_SIMILAR(u_gold, u, 1e-3);
        //    EXPECT_MAT_SIMILAR(v_gold, v, 1e-3);
        //#else
        let f = fs.openSync(fname, "w");
        let fpos = 0;

        let buf = new Buffer(4); buf.writeInt32BE(u.rows().valueOf(), 0); fpos += fs.writeSync(f, buf, 0, buf.length, fpos);
        buf = new Buffer(4); buf.writeInt32BE(u.cols().valueOf(), 0); fpos += fs.writeSync(f, buf, 0, buf.length, fpos);

        var h_u = new alvision.Mat(u);
        var h_v = new alvision.Mat(v);

        for (var i = 0; i < u.rows(); ++i) {
            let p = h_u.ptr<alvision.char>("char", i);
            buf = new Buffer(p.length);
            p.forEach((v, i, a) => { buf.writeInt8(<any>v, i); });
            fpos += fs.writeSync(f, buf, 0, buf.length, fpos);
            //f.write(h_u.ptr<alvision.char>("char", i), u.cols * sizeof(float));
        }

        for (var i = 0; i < v.rows(); ++i) {
            let p = h_v.ptr<alvision.char>("char", i);
            buf = new Buffer(p.length);
            p.forEach((v, i, a) => { buf.writeInt8(<any>v, i); });
            fpos += fs.writeSync(f, buf, 0, buf.length, fpos);
        }
        //#endif
    }
}

//CUDA_TEST_P(BroxOpticalFlow, OpticalFlowNan)
class BroxOpticalFlow_OpticalFlowNan extends BroxOpticalFlow
{
    public TestBodu(): void {
        var frame0 = alvision.readImageType("opticalflow/frame0.png", alvision.MatrixType.CV_32FC1);
        alvision.ASSERT_FALSE(frame0.empty());

        var frame1 = alvision.readImageType("opticalflow/frame1.png", alvision.MatrixType.CV_32FC1);
        alvision.ASSERT_FALSE(frame1.empty());

        var r_frame0 = new alvision.Mat();
        var r_frame1 = new alvision.Mat();
        alvision.resize(frame0, r_frame0, new alvision.Size(1380, 1000));
        alvision.resize(frame1, r_frame1, new alvision.Size(1380, 1000));

        var  brox =
        alvision.cudaoptflow.BroxOpticalFlow.create(0.197 /*alpha*/, 50.0 /*gamma*/, 0.8 /*scale_factor*/,
            10 /*inner_iterations*/, 77 /*outer_iterations*/, 10 /*solver_iterations*/);

        var flow = new alvision.cuda.GpuMat();
        brox.calc(alvision.loadMat(frame0), alvision.loadMat(frame1), flow);

        var flows = new Array < alvision.cuda.GpuMat >(2);
        alvision.cudaarithm.split(flow, flows);

        var u = flows[0];
        var v = flows[1];

        
        var h_u = new alvision.Mat();
        var h_v = new alvision.Mat();
        u.download(h_u);
        v.download(h_v);

        alvision.EXPECT_TRUE(alvision.checkRange(h_u));
        alvision.EXPECT_TRUE(alvision.checkRange(h_v));
    }
};

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_OptFlow', 'BroxOpticalFlow', (case_name, test_name) => { return null;},new alvision.cvtest.Combine([alvision. ALL_DEVICES]));

//////////////////////////////////////////////////////
// PyrLKOpticalFlow

//namespace
//{
//    IMPLEMENT_PARAM_CLASS(UseGray, bool)
//}

//PARAM_TEST_CASE(PyrLKOpticalFlow, alvision.cuda.DeviceInfo, UseGray)
class PyrLKOpticalFlow extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected useGray: boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.useGray = this.GET_PARAM<boolean>(1);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(PyrLKOpticalFlow, Sparse)
class PyrLKOpticalFlow_Sparse extends PyrLKOpticalFlow
{
    public TestBody(): void {
        var frame0 = alvision.readImage("opticalflow/frame0.png", this.useGray ? alvision.ImreadModes.IMREAD_GRAYSCALE : alvision.ImreadModes.IMREAD_COLOR);
        alvision.ASSERT_FALSE(frame0.empty());

        var frame1 = alvision.readImage("opticalflow/frame1.png", this.useGray ? alvision.ImreadModes.IMREAD_GRAYSCALE : alvision.ImreadModes.IMREAD_COLOR);
        alvision.ASSERT_FALSE(frame1.empty());

        var gray_frame = new alvision.Mat();
        if (this.useGray)
            gray_frame = frame0;
        else
            alvision.cvtColor(frame0, gray_frame, alvision.ColorConversionCodes.COLOR_BGR2GRAY);

        var pts = new Array<alvision.Point2f>();
        alvision.goodFeaturesToTrack(gray_frame, pts, 1000, 0.01, 0.0);

        var d_pts = new alvision.cuda.GpuMat();
        var pts_mat = new alvision.Mat (1, pts.length, alvision.MatrixType.CV_32FC2, pts);
        d_pts.upload(pts_mat);

        var pyrLK =
            alvision.cudaoptflow.SparsePyrLKOpticalFlow.create();

        var d_nextPts = new alvision.cuda.GpuMat();
        var d_status = new alvision.cuda.GpuMat();
        pyrLK.calc(alvision.loadMat(frame0), alvision.loadMat(frame1), d_pts, d_nextPts, d_status);

        var nextPts = new Array<alvision.Point2f> (d_nextPts.cols().valueOf());
        var nextPts_mat = new alvision.Mat (1, d_nextPts.cols(),alvision.MatrixType. CV_32FC2,  nextPts);
        d_nextPts.download(nextPts_mat);

        var status = new Array<alvision.uchar> (d_status.cols().valueOf());
        var status_mat = new alvision.Mat (1, d_status.cols(),alvision.MatrixType. CV_8UC1, status);
        d_status.download(status_mat);

        var nextPts_gold = new Array<alvision.Point2f>();
        var status_gold = new Array<alvision.uchar>();
        alvision.calcOpticalFlowPyrLK(frame0, frame1, pts, nextPts_gold, status_gold,null);

        alvision.ASSERT_EQ(nextPts_gold.length, nextPts.length);
        alvision.ASSERT_EQ(status_gold.length, status.length);

        var mistmatch = 0;
        for (var i = 0; i < nextPts.length; ++i)
        {
            var a = nextPts[i];
            var b = nextPts_gold[i];

            if (status[i] != status_gold[i]) {
                ++mistmatch;
                continue;
            }

            if (status[i]) {
                var eq = Math.abs(a.x.valueOf() - b.x.valueOf()) <= 1 && Math.abs(a.y.valueOf() - b.y.valueOf()) <= 1;

                if (!eq)
                    ++mistmatch;
            }
        }

        var bad_ratio = (mistmatch) / nextPts.length;

        alvision.ASSERT_LE(bad_ratio, 0.01);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_OptFlow', 'PyrLKOpticalFlow', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    [true,false]]));

//////////////////////////////////////////////////////
// FarnebackOpticalFlow

//namespace
//{
//    IMPLEMENT_PARAM_CLASS(PyrScale, double)
//    IMPLEMENT_PARAM_CLASS(PolyN, int)
//    CV_FLAGS(FarnebackOptFlowFlags, 0, OPTFLOW_FARNEBACK_GAUSSIAN)
//    IMPLEMENT_PARAM_CLASS(UseInitFlow, bool)
//}

//PARAM_TEST_CASE(FarnebackOpticalFlow, alvision.cuda.DeviceInfo, PyrScale, PolyN, FarnebackOptFlowFlags, UseInitFlow)
class FarnebackOpticalFlow extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected pyrScale: alvision.double;
    protected polyN: alvision.int;
    protected flags: alvision.int ;
    protected useInitFlow: boolean;

    SetUp() : void
    {
        this.devInfo =     this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.pyrScale =    this.GET_PARAM<alvision.double>(1);
        this.polyN =       this.GET_PARAM<alvision.int>(2);
        this.flags =       this.GET_PARAM<alvision.int>(3);
        this.useInitFlow = this.GET_PARAM<boolean>(4);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(FarnebackOpticalFlow, Accuracy)
class FarnebackOpticalFlow_Accuracy extends FarnebackOpticalFlow
{
    public TestBody(): void {
        var frame0 = alvision.readImage("opticalflow/rubberwhale1.png", alvision.ImreadModes.IMREAD_GRAYSCALE);
        alvision.ASSERT_FALSE(frame0.empty());

        var frame1 = alvision.readImage("opticalflow/rubberwhale2.png", alvision.ImreadModes.IMREAD_GRAYSCALE);
        alvision.ASSERT_FALSE(frame1.empty());

        var polySigma = (this.polyN <= 5) ? 1.1 : 1.5;

        var farn =
        alvision.cudaoptflow.FarnebackOpticalFlow.create();
        farn.setPyrScale(this.pyrScale);
        farn.setPolyN(this.polyN);
        farn.setPolySigma(polySigma);
        farn.setFlags(this.flags);

        var d_flow = new alvision.cuda.GpuMat();
        farn.calc(alvision.loadMat(frame0), alvision.loadMat(frame1), d_flow);

        var flow = new alvision.Mat();
        if (this.useInitFlow) {
            d_flow.download(flow);

            farn.setFlags(farn.getFlags().valueOf() | alvision.OPTFLOW.OPTFLOW_USE_INITIAL_FLOW);
            farn.calc(alvision.loadMat(frame0),alvision.loadMat(frame1), d_flow);
        }

        alvision.calcOpticalFlowFarneback(
            frame0, frame1, flow, farn.getPyrScale(), farn.getNumLevels(), farn.getWinSize(),
            farn.getNumIters(), farn.getPolyN(), farn.getPolySigma(), farn.getFlags());

        alvision.EXPECT_MAT_SIMILAR(flow, d_flow.getMat(), 0.1);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_OptFlow', 'FarnebackOpticalFlow', (case_name, test_name) => { return null;}, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    [0.3,0.5,0.8],
    [5,7],
    [0,alvision.OPTFLOW.OPTFLOW_FARNEBACK_GAUSSIAN],
    [false,true]
    ]));

//////////////////////////////////////////////////////
// OpticalFlowDual_TVL1

//namespace
//{
//    IMPLEMENT_PARAM_CLASS(Gamma, double)
//}

//PARAM_TEST_CASE(OpticalFlowDual_TVL1, alvision.cuda.DeviceInfo, Gamma)
class OpticalFlowDual_TVL1 extends alvision.cvtest.CUDA_TEST
{
    public devInfo: alvision.cuda.DeviceInfo;
    public gamma: alvision.double;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.gamma =   this.GET_PARAM<alvision.double>(1);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(OpticalFlowDual_TVL1, Accuracy)
class OpticalFlowDual_TVL1_Accuracy extends OpticalFlowDual_TVL1
{
    public TestBody(): void {
        var frame0 = alvision.readImage("opticalflow/rubberwhale1.png", alvision.ImreadModes.IMREAD_GRAYSCALE);
        alvision.ASSERT_FALSE(frame0.empty());

        var frame1 = alvision.readImage("opticalflow/rubberwhale2.png", alvision.ImreadModes.IMREAD_GRAYSCALE);
        alvision.ASSERT_FALSE(frame1.empty());

        var d_alg =
            alvision.cudaoptflow.OpticalFlowDual_TVL1.create();
        d_alg.setNumIterations(10);
        d_alg.setGamma(this.gamma);

        var d_flow = new alvision.cuda.GpuMat ()
        d_alg.calc(alvision.loadMat(frame0), alvision.loadMat(frame1), d_flow);

        var alg = alvision.createOptFlow_DualTVL1();
        alg.setMedianFiltering(1);
        alg.setInnerIterations(1);
        alg.setOuterIterations(d_alg.getNumIterations());
        alg.setGamma(this.gamma);

        var flow = new alvision.Mat();
        alg.calc(frame0, frame1, flow);

        alvision.EXPECT_MAT_SIMILAR(flow, d_flow.getMat(), 4e-3);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_OptFlow', 'OpticalFlowDual_TVL1', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    [0.0,1.0]
    ]));

//#endif // HAVE_CUDA
