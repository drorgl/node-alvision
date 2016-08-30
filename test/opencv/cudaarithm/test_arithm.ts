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
////////////////////////////////////////////////////////////////////////////////
//// GEMM
//
//#ifdef HAVE_CUBLAS

//CV_FLAGS(GemmFlags, 0, alvision.GEMM_1_T, alvision.GEMM_2_T, alvision.GEMM_3_T);
//#define ALL_GEMM_FLAGS testing::Values(GemmFlags(0), GemmFlags(alvision.GEMM_1_T), GemmFlags(alvision.GEMM_2_T), GemmFlags(alvision.GEMM_3_T), GemmFlags(alvision.GEMM_1_T | alvision.GEMM_2_T), GemmFlags(alvision.GEMM_1_T | alvision.GEMM_3_T), GemmFlags(alvision.GEMM_1_T | alvision.GEMM_2_T | alvision.GEMM_3_T))
const ALL_GEMM_FLAGS = [0,
    alvision.GemmFlags.GEMM_1_T,
    alvision.GemmFlags.GEMM_2_T,
    alvision.GemmFlags.GEMM_3_T,
    alvision.GemmFlags.GEMM_1_T | alvision.GemmFlags.GEMM_2_T,
    alvision.GemmFlags.GEMM_1_T | alvision.GemmFlags.GEMM_3_T,
    alvision.GemmFlags.GEMM_1_T | alvision.GemmFlags.GEMM_2_T | alvision.GemmFlags.GEMM_3_T];



//PARAM_TEST_CASE(GEMM, alvision.cuda.DeviceInfo, alvision.Size, MatType, GemmFlags, UseRoi)
class GEMM extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected type: alvision.int;
    protected flags: alvision.int;
    protected useRoi : boolean;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.type =    this.GET_PARAM<alvision.MatrixType>(2);
        this.flags =   this.GET_PARAM<alvision.GemmFlags>(3);
        this.useRoi =  this.GET_PARAM<boolean>(4);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(GEMM, Accuracy)
class GEMM_Accuracy extends GEMM
{
    TestBody(): void {
        var src1 = alvision.randomMat(this.size, this.type, -10.0, 10.0);
        var src2 = alvision.randomMat(this.size, this.type, -10.0, 10.0);
        var src3 = alvision.randomMat(this.size, this.type, -10.0, 10.0);
        var alpha = alvision.randomDouble(-10.0, 10.0);
        var beta = alvision.randomDouble(-10.0, 10.0);

        if (alvision.MatrixType.CV_MAT_DEPTH(this.type) == alvision.MatrixType.CV_64F && !alvision.supportFeature(this.devInfo, alvision.cuda.FeatureSet.NATIVE_DOUBLE)) {
            try {
                var dst = new alvision.cuda.GpuMat();
                alvision.cudaarithm.gemm(alvision.loadMat(src1), alvision.loadMat(src2), alpha, alvision.loadMat(src3), beta, dst, this.flags);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsUnsupportedFormat, e.code);
            }
        }
        else if (this.type == alvision.MatrixType.CV_64FC2 && this.flags != 0) {
            try {
                var dst = new alvision.cuda.GpuMat();
                alvision.cudaarithm.gemm(alvision.loadMat(src1), alvision.loadMat(src2), alpha, alvision.loadMat(src3), beta, dst, this.flags);
            }
            catch (e) {
                alvision.ASSERT_EQ(alvision.cv.Error.Code.StsNotImplemented, e.code);
            }
        }
        else {
            var dst = alvision.createMat(this.size, this.type, this.useRoi);
            alvision.cudaarithm.gemm(alvision.loadMat(src1, this.useRoi), alvision.loadMat(src2, this.useRoi), alpha, alvision.loadMat(src3, this.useRoi), beta, dst, this.flags);

            var dst_gold = new alvision.Mat();
            alvision.gemm(src1, src2, alpha, src3, beta, dst_gold, this.flags);

            alvision.EXPECT_MAT_NEAR(dst_gold, dst, alvision.MatrixType.CV_MAT_DEPTH(this.type) == alvision.MatrixType.CV_32F ? 1e-1 : 1e-10);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'GEMM', (case_name, test_name) => { return null;}, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_32FC1, alvision.MatrixType.CV_32FC2,alvision.MatrixType.CV_64FC1,alvision.MatrixType.CV_64FC2],
    ALL_GEMM_FLAGS,
    alvision.WHOLE_SUBMAT]));

////////////////////////////////////////////////////////////////////////////
// MulSpectrums

//CV_FLAGS(DftFlags, 0, alvision.DFT_INVERSE, alvision.DFT_SCALE, alvision.DFT_ROWS, alvision.DFT_COMPLEX_OUTPUT, alvision.DFT_REAL_OUTPUT)

//PARAM_TEST_CASE(MulSpectrums, alvision.cuda.DeviceInfo, alvision.Size, DftFlags)
class MulSpectrums extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected flag: alvision.int;

    protected a: alvision.Mat;
    protected b: alvision.Mat;

    public SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size =    this.GET_PARAM<alvision.Size>(1);
        this.flag =    this.GET_PARAM<alvision.int>(2);

        alvision.cuda.setDevice(this.devInfo.deviceID());

        this.a = alvision.randomMat(this.size, alvision.MatrixType.CV_32FC2);
        this.b = alvision.randomMat(this.size, alvision.MatrixType.CV_32FC2);
    }
};

//CUDA_TEST_P(MulSpectrums, Simple)
class MulSpectrums_Simple extends MulSpectrums
{
    public TestBody(): void {
        var c = new alvision.cuda.GpuMat();
        alvision.cudaarithm.mulSpectrums(alvision.loadMat(this.a), alvision.loadMat(this.b), c, this.flag, false);

        var c_gold = new alvision.Mat();
        alvision.mulSpectrums(this.a, this.b, c_gold, this.flag, false);

        alvision.EXPECT_MAT_NEAR(c_gold, c, 1e-2);
    }
}

//CUDA_TEST_P(MulSpectrums, Scaled)
class MulSpectrums_Scaled extends MulSpectrums
{
    public TestBody(): void {
        var scale = 1. / this.size.area().valueOf();

        var c = new alvision.cuda.GpuMat();
        alvision.cudaarithm.mulAndScaleSpectrums(alvision.loadMat(this.a), alvision.loadMat(this.b), c, this.flag, scale, false);

        var c_gold = new alvision.Mat();
        alvision.mulSpectrums(this.a, this.b, c_gold, this.flag, false);
        c_gold.convertTo(c_gold, c_gold.type(), scale);

        alvision.EXPECT_MAT_NEAR(c_gold, c, 1e-2);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'MulSpectrums', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [0, alvision.DftFlags.DFT_ROWS]]));

////////////////////////////////////////////////////////////////////////////
// Dft

class Dft extends alvision.cvtest.CUDA_TEST// : testing::TestWithParam<alvision.cuda.DeviceInfo>
{
    protected devInfo: alvision.cuda.DeviceInfo;

    public SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

function testC2C(hint: string, cols: alvision.int, rows: alvision.int, flags: alvision.int , inplace : boolean) : void
    {
        alvision.cvtest.SCOPED_TRACE(hint);

    var a = alvision.randomMat(new alvision.Size(cols, rows), alvision.MatrixType.CV_32FC2, 0.0, 10.0);

    var b_gold = new alvision.Mat();
        alvision.dft(a, b_gold, flags);

        var d_b = new alvision.cuda.GpuMat();
        var d_b_data = new alvision.cuda.GpuMat();
        if (inplace)
        {
            d_b_data.create(1, a.size().area(), alvision.MatrixType. CV_32FC2);
            d_b = new alvision.cuda.GpuMat(a.rows, a.cols, alvision.MatrixType.CV_32FC2, d_b_data.ptr<alvision.uchar>("uchar"), a.cols.valueOf() * d_b_data.elemSize().valueOf());
        }
        alvision.cudaarithm.dft(alvision.loadMat(a), d_b, new alvision.Size(cols, rows), flags);

        alvision.EXPECT_TRUE(!inplace || d_b.ptr<alvision.uchar>("uchar") == d_b_data.ptr<alvision.uchar>("uchar"));
        alvision.ASSERT_EQ(alvision.MatrixType.CV_32F, d_b.depth());
        alvision.ASSERT_EQ(2, d_b.channels());
        alvision.EXPECT_MAT_NEAR(b_gold, new alvision.Mat(d_b), rows.valueOf() * cols.valueOf() * 1e-4);
    }

//CUDA_TEST_P(Dft, C2C)
class Dft_C2C extends Dft {
    public TestBody(): void {
        var cols = alvision.randomInt(2, 100).valueOf();
        var rows = alvision.randomInt(2, 100).valueOf();

        for (var i = 0; i < 2; ++i) {
            var inplace = i != 0;

            testC2C("no flags", cols, rows, 0, inplace);
            testC2C("no flags 0 1", cols, rows + 1, 0, inplace);
            testC2C("no flags 1 0", cols, rows + 1, 0, inplace);
            testC2C("no flags 1 1", cols + 1, rows, 0, inplace);
            testC2C("DFT_INVERSE", cols, rows, alvision.DftFlags.DFT_INVERSE, inplace);
            testC2C("DFT_ROWS", cols, rows, alvision.DftFlags.DFT_ROWS, inplace);
            testC2C("single col", 1, rows, 0, inplace);
            testC2C("single row", cols, 1, 0, inplace);
            testC2C("single col inversed", 1, rows, alvision.DftFlags.DFT_INVERSE, inplace);
            testC2C("single row inversed", cols, 1, alvision.DftFlags.DFT_INVERSE, inplace);
            testC2C("single row DFT_ROWS", cols, 1, alvision.DftFlags.DFT_ROWS, inplace);
            testC2C("size 1 2", 1, 2, 0, inplace);
            testC2C("size 2 1", 2, 1, 0, inplace);
        }
    }
}

    function testR2CThenC2R(hint: string, cols: alvision.int, rows: alvision.int , inplace : boolean) : void
    {
        alvision.cvtest.SCOPED_TRACE(hint);

    var a = alvision.randomMat(new alvision.Size(cols, rows), alvision.MatrixType.CV_32FC1, 0.0, 10.0);

    var d_b = new alvision.cuda.GpuMat();
    var d_c = new alvision.cuda.GpuMat();
        var d_b_data = new alvision.cuda.GpuMat();
        var d_c_data = new alvision.cuda.GpuMat()
        if (inplace)
        {
            if (a.cols == 1)
            {
                d_b_data.create(1, (a.rows.valueOf() / 2 + 1) * a.cols.valueOf(), alvision.MatrixType.CV_32FC2);
                d_b = new alvision.cuda.GpuMat(a.rows.valueOf() / 2 + 1, a.cols, alvision.MatrixType.CV_32FC2, d_b_data.ptr<alvision.uchar>("uchar"), a.cols.valueOf() * d_b_data.elemSize().valueOf());
            }
            else
            {
                d_b_data.create(1, a.rows.valueOf() * (a.cols.valueOf() / 2 + 1), alvision.MatrixType.CV_32FC2);
                d_b = new alvision.cuda.GpuMat(a.rows, a.cols.valueOf() / 2 + 1, alvision.MatrixType.CV_32FC2, d_b_data.ptr<alvision.uchar>("uchar"), (a.cols.valueOf() / 2 + 1) * d_b_data.elemSize().valueOf());
            }
            d_c_data.create(1, a.size().area(), alvision.MatrixType.CV_32F);
            d_c = new alvision.cuda.GpuMat(a.rows, a.cols, alvision.MatrixType.CV_32F, d_c_data.ptr<alvision.uchar>("uchar"), a.cols.valueOf() * d_c_data.elemSize().valueOf());
        }

        alvision.cudaarithm.dft(alvision.loadMat(a), d_b, new alvision.Size(cols, rows), 0);
        alvision.cudaarithm.dft(d_b, d_c, new alvision.Size(cols, rows), alvision.DftFlags.DFT_REAL_OUTPUT | alvision.DftFlags.DFT_SCALE);

        alvision.EXPECT_TRUE(!inplace || d_b.ptr<alvision.uchar>("uchar") == d_b_data.ptr<alvision.uchar>("uchar"));
        alvision.EXPECT_TRUE(!inplace || d_c.ptr<alvision.uchar>("uchar") == d_c_data.ptr<alvision.uchar>("uchar"));
        alvision.ASSERT_EQ(alvision.MatrixType.CV_32F, d_c.depth());
        alvision.ASSERT_EQ(1, d_c.channels());

        var c = new alvision.Mat(d_c);
        alvision.EXPECT_MAT_NEAR(a, c, rows.valueOf() * cols.valueOf() * 1e-5);
    }

//    CUDA_TEST_P(Dft, R2CThenC2R)
class Dft_R2CThenC2R extends Dft {
    public TestBody(): void {
        var cols = alvision.randomInt(2, 100).valueOf();
        var rows = alvision.randomInt(2, 100).valueOf();

        testR2CThenC2R("sanity", cols, rows, false);
        testR2CThenC2R("sanity 0 1", cols, rows + 1, false);
        testR2CThenC2R("sanity 1 0", cols + 1, rows, false);
        testR2CThenC2R("sanity 1 1", cols + 1, rows + 1, false);
        testR2CThenC2R("single col", 1, rows, false);
        testR2CThenC2R("single col 1", 1, rows + 1, false);
        testR2CThenC2R("single row", cols, 1, false);
        testR2CThenC2R("single row 1", cols + 1, 1, false);

        testR2CThenC2R("sanity", cols, rows, true);
        testR2CThenC2R("sanity 0 1", cols, rows + 1, true);
        testR2CThenC2R("sanity 1 0", cols + 1, rows, true);
        testR2CThenC2R("sanity 1 1", cols + 1, rows + 1, true);
        testR2CThenC2R("single row", cols, 1, true);
        testR2CThenC2R("single row 1", cols + 1, 1, true);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Dft', (case_name, test_name) => { return null; },new alvision.cvtest.Combine( [alvision.ALL_DEVICES]));

////////////////////////////////////////////////////////
// Convolve

//namespace
//{
function convolveDFT(A: alvision.Mat, B: alvision.Mat, C: alvision.Mat , ccorr  : boolean= false) : void
    {
        // reallocate the output array if needed
        C.create(Math.abs(A.rows.valueOf() - B.rows.valueOf()) + 1, Math.abs(A.cols.valueOf() - B.cols.valueOf()) + 1, A.type());
        var dftSize = new alvision.Size();

        // compute the size of DFT transform
        dftSize.width = alvision.getOptimalDFTSize (A.cols.valueOf() + B.cols.valueOf() - 1);
        dftSize.height = alvision.getOptimalDFTSize(A.rows.valueOf() + B.rows.valueOf() - 1);

        // allocate temporary buffers and initialize them with 0s
        var tempA = new alvision.Mat(dftSize, A.type(), alvision.Scalar.all(0));
        var tempB = new alvision.Mat(dftSize, B.type(), alvision.Scalar.all(0));

        // copy A and B to the top-left corners of tempA and tempB, respectively
        var roiA = tempA.roi(new alvision.Rect(0, 0, A.cols, A.rows));
        A.copyTo(roiA);
        var roiB = tempB.roi(new alvision.Rect(0, 0, B.cols, B.rows));
        B.copyTo(roiB);

        // now transform the padded A & B in-place;
        // use "nonzeroRows" hint for faster processing
        alvision.dft(tempA, tempA, 0, A.rows);
        alvision.dft(tempB, tempB, 0, B.rows);

        // multiply the spectrums;
        // the function handles packed spectrum representations well
        alvision.mulSpectrums(tempA, tempB, tempA, 0, ccorr);

        // transform the product back from the frequency domain.
        // Even though all the result rows will be non-zero,
        // you need only the first C.rows of them, and thus you
        // pass nonzeroRows == C.rows
        alvision.dft(tempA, tempA, alvision.DftFlags.DFT_INVERSE + alvision.DftFlags.DFT_SCALE, C.rows);

        // now copy the result back to C.
        tempA.roi(new alvision.Rect(0, 0, C.cols, C.rows)).copyTo(C);
    }

//    IMPLEMENT_PARAM_CLASS(KSize, int)
//    IMPLEMENT_PARAM_CLASS(Ccorr, bool)
//}

    //    PARAM_TEST_CASE(Convolve, alvision.cuda.DeviceInfo, alvision.Size, KSize, Ccorr)
class Convolve extends alvision.cvtest.CUDA_TEST {
    protected devInfo: alvision.cuda.DeviceInfo;
    protected size: alvision.Size;
    protected ksize: alvision.int;
    protected ccorr: boolean;

    public SetUp(): void {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        this.size = this.GET_PARAM<alvision.Size>(1);
        this.ksize = this.GET_PARAM<alvision.int>(2);
        this.ccorr = this.GET_PARAM<boolean>(3);

        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
}

//CUDA_TEST_P(Convolve, Accuracy)
class Convolve_Accuracy extends Convolve {
    public TestBody(): void {
        var src = alvision.randomMat(this.size, alvision.MatrixType.CV_32FC1, 0.0, 100.0);
        var kernel = alvision.randomMat(new alvision.Size(this.ksize, this.ksize), alvision.MatrixType.CV_32FC1, 0.0, 1.0);

        var conv = alvision.cudaarithm.createConvolution();

        var dst = new alvision.cuda.GpuMat();
        conv.convolve(alvision.loadMat(src), alvision.loadMat(kernel), dst, this.ccorr);

        var dst_gold = new alvision.Mat();
        convolveDFT(src, kernel, dst_gold, this.ccorr);

        alvision.EXPECT_MAT_NEAR(dst, dst_gold, 1e-1);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_Arithm', 'Convolve', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    [3,7,11,17,19,23,45],
    [false,true]]));

//#endif // HAVE_CUBLAS
//
//#endif // HAVE_CUDA
