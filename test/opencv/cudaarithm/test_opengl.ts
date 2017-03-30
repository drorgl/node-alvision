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
//#if defined(HAVE_CUDA) && defined(HAVE_OPENGL)
//
//#include "opencv2/core/cuda.hpp"
//#include "opencv2/core/opengl.hpp"
//#include "opencv2/ts/cuda_test.hpp"
//
//using namespace cvtest;

/////////////////////////////////////////////
// Buffer

//PARAM_TEST_CASE(Buffer, alvision.Size, MatType)
class Buffer extends alvision.cvtest.CUDA_TEST
{
    SetUpTestCase() : void
    {
        alvision.namedWindow("test", alvision.WindowFlags.WINDOW_OPENGL);
    }

    TearDownTestCase() : void
    {
        alvision.destroyAllWindows();
    }

    protected size: alvision.Size;
    protected type: alvision.int;

    SetUp(): void
    {
        this.size = this.GET_PARAM<alvision.Size>(0);
        this.type = this.GET_PARAM<alvision.int>(1);
    }
};

//CUDA_TEST_P(Buffer, Constructor1)
class Buffer_Constructor1 extends Buffer
{
    TestBody() {
        let buf = new alvision.ogl.Buffer(this.size.height, this.size.width, this.type, alvision.ogl.BufferTarget.ARRAY_BUFFER, true);

        alvision.EXPECT_EQ(this.size.height, buf.rows());
        alvision.EXPECT_EQ(this.size.width, buf.cols());
        alvision.EXPECT_EQ(this.type, buf.type());
    }
}

//CUDA_TEST_P(Buffer, Constructor2)
class Buffer_Constructor2 extends Buffer
{
    TestBody() {
        let buf = new alvision.ogl.Buffer (this.size, this.type, alvision.ogl.BufferTarget.ARRAY_BUFFER, true);

        alvision.EXPECT_EQ(this.size.height, buf.rows());
        alvision.EXPECT_EQ(this.size.width, buf.cols());
        alvision.EXPECT_EQ(this.type, buf.type());
    }
}

//CUDA_TEST_P(Buffer, ConstructorFromMat)
class Buffer_ConstructorFromMat extends Buffer
{
    TestBody() {
        let gold = alvision.randomMat(this.size, this.type);

        let buf = new alvision.ogl.Buffer(gold, alvision.ogl.BufferTarget.ARRAY_BUFFER, true);

        let bufData = new alvision.Mat ();
        buf.copyTo(bufData);

        alvision.EXPECT_MAT_NEAR(gold, bufData, 0);
    }
}

//CUDA_TEST_P(Buffer, ConstructorFromGpuMat)
class Buffer_ConstructorFromGpuMat extends Buffer
{
    TestBody() {
        let gold = alvision.randomMat(this.size, this.type);
        let d_gold = new alvision.cuda.GpuMat (gold);

        let buf = new alvision.ogl.Buffer(d_gold, alvision.ogl.BufferTarget.ARRAY_BUFFER);

        let bufData = new alvision.Mat();
        buf.copyTo(bufData);

        alvision.EXPECT_MAT_NEAR(gold, bufData, 0);
    }
}

//CUDA_TEST_P(Buffer, ConstructorFromBuffer)
class Buffer_ConstructorFromBuffer extends Buffer
{
    TestBody() {
        let buf_gold = new alvision.ogl.Buffer (this.size, this.type, alvision.ogl.BufferTarget.ARRAY_BUFFER, true);

        let buf = new alvision.ogl.Buffer(buf_gold);

        alvision.EXPECT_EQ(buf_gold.bufId(), buf.bufId());
        alvision.EXPECT_EQ(buf_gold.rows(), buf.rows());
        alvision.EXPECT_EQ(buf_gold.cols(), buf.cols());
        alvision.EXPECT_EQ(buf_gold.type(), buf.type());
    }
}

//CUDA_TEST_P(Buffer, Create)
class Buffer_Create extends Buffer
{
    TestBody() {
        let buf = new alvision.ogl.Buffer();
        buf.create(this.size.height, this.size.width, this.type, alvision.ogl.BufferTarget.ARRAY_BUFFER, true);

        alvision.EXPECT_EQ(this.size.height, buf.rows());
        alvision.EXPECT_EQ(this.size.width, buf.cols());
        alvision.EXPECT_EQ(this.type, buf.type());
    }
}

//CUDA_TEST_P(Buffer, CopyFromMat)
class Buffer_CopyFromMat extends Buffer
{
    TestBody() {
        let gold = alvision.randomMat(this.size, this.type);

        let buf = new alvision.ogl.Buffer ();
        buf.copyFrom(gold, alvision.ogl.BufferTarget.ARRAY_BUFFER, true);

        let bufData = new alvision.Mat();
        buf.copyTo(bufData);

        alvision.EXPECT_MAT_NEAR(gold, bufData, 0);
    }
}

//CUDA_TEST_P(Buffer, CopyFromGpuMat)
class Buffer_CopyFromGpuMat extends Buffer
{
    TestBody() {
        let gold = alvision.randomMat(this.size, this.type);
        let d_gold = new alvision.cuda.GpuMat(gold);

        let buf = new alvision.ogl.Buffer();
        buf.copyFrom(d_gold, alvision.ogl.BufferTarget.ARRAY_BUFFER, true);

        let bufData = new alvision.Mat();
        buf.copyTo(bufData);

        alvision.EXPECT_MAT_NEAR(gold, bufData, 0);
    }
}

//CUDA_TEST_P(Buffer, CopyFromBuffer)
    class Buffer_CopyFromBuffer extends Buffer
    {
        TestBody() {
            let gold = alvision.randomMat(this.size, this.type);
            let buf_gold = new alvision.ogl.Buffer(gold, alvision.ogl.BufferTarget.ARRAY_BUFFER, true);

            let buf = new alvision.ogl.Buffer();
            buf.copyFrom(buf_gold, alvision.ogl.BufferTarget.ARRAY_BUFFER, true);

            alvision.EXPECT_NE(buf_gold.bufId(), buf.bufId());

            let bufData = new alvision.Mat();
            buf.copyTo(bufData);

            alvision.EXPECT_MAT_NEAR(gold, bufData, 0);
        }
}

//CUDA_TEST_P(Buffer, CopyToGpuMat)
    class Buffer_CopyToGpuMat extends Buffer
    {
        TestBody() {
            let gold = alvision.randomMat(this.size, this.type);

            let buf = new alvision.ogl.Buffer(gold, alvision.ogl.BufferTarget.ARRAY_BUFFER, true);

            let dst = new alvision.cuda.GpuMat();
            buf.copyTo(dst);

            alvision.EXPECT_MAT_NEAR(gold, dst, 0);
        }
}

//CUDA_TEST_P(Buffer, CopyToBuffer)
    class Buffer_CopyToBuffer extends Buffer
    {
        TestBody() {
            let gold = alvision.randomMat(this.size, this.type);

            let buf = new alvision.ogl.Buffer(gold, alvision.ogl.BufferTarget.ARRAY_BUFFER, true);

            let dst = new alvision.ogl.Buffer ();
            buf.copyTo(dst);
            dst.setAutoRelease(true);

            alvision.EXPECT_NE(buf.bufId(), dst.bufId());

            let bufData = new alvision.Mat();
            dst.copyTo(bufData);

            alvision.EXPECT_MAT_NEAR(gold, bufData, 0);
        }
}

//CUDA_TEST_P(Buffer, Clone)
    class Buffer_Clone extends Buffer
    {
        TestBody() {
            let gold = alvision.randomMat(this.size, this.type);

            let buf = new alvision.ogl.Buffer(gold, alvision.ogl.BufferTarget.ARRAY_BUFFER, true);

            let dst = buf.clone(alvision.ogl.BufferTarget.ARRAY_BUFFER, true);

            alvision.EXPECT_NE(buf.bufId(), dst.bufId());

            let bufData = new alvision.Mat();
            dst.copyTo(bufData);

            alvision.EXPECT_MAT_NEAR(gold, bufData, 0);
        }
}

//CUDA_TEST_P(Buffer, MapHostRead)
    class Buffer_MapHostRead extends Buffer {
        TestBody() {
            let gold = alvision.randomMat(this.size, this.type);

            let buf = new alvision.ogl.Buffer(gold, alvision.ogl.BufferTarget.ARRAY_BUFFER, true);

            let dst = buf.mapHost(alvision.ogl.BufferAccess.READ_ONLY);

            alvision.EXPECT_MAT_NEAR(gold, dst, 0);

            buf.unmapHost();
        }
    }


//CUDA_TEST_P(Buffer, MapHostWrite)
    class Buffer_MapHostWrite extends Buffer
    {
        TestBody() {
            let gold = alvision.randomMat(this.size, this.type);

            let buf = new alvision.ogl.Buffer(this.size, this.type, alvision.ogl.BufferTarget.ARRAY_BUFFER, true);

            let dst = buf.mapHost(alvision.ogl.BufferAccess.WRITE_ONLY);
            gold.copyTo(dst);
            buf.unmapHost();
            dst = null;//dst.release();

            let bufData = new alvision.Mat();
            buf.copyTo(bufData);

            alvision.EXPECT_MAT_NEAR(gold, bufData, 0);
        }
}

//CUDA_TEST_P(Buffer, MapDevice)
    class Buffer_MapDevice extends Buffer
    {
        TestBody() {
            let gold = alvision.randomMat(this.size, this.type);

            let buf = new alvision.ogl.Buffer(gold, alvision.ogl.BufferTarget.ARRAY_BUFFER, true);

            let dst = buf.mapDevice();

            alvision.EXPECT_MAT_NEAR(gold, dst, 0);

            buf.unmapDevice();
        }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('OpenGL', 'Buffer', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.DIFFERENT_SIZES,
    alvision.ALL_TYPES
    ]));

/////////////////////////////////////////////
// Texture2D

//PARAM_TEST_CASE(Texture2D, alvision.Size, MatType)
class Texture2D extends alvision.cvtest.CUDA_TEST
{
    SetUpTestCase() : void
    {
        alvision.namedWindow("test", alvision.WindowFlags.WINDOW_OPENGL);
    }

    TearDownTestCase() : void
    {
        alvision.destroyAllWindows();
    }

    protected size: alvision.Size;
    protected type: alvision.int;
    protected depth: alvision.int;
    protected cn: alvision.int;
    protected format: alvision.ogl.Texture2DFormat;

    SetUp() : void
    {
        this.size = this.GET_PARAM<alvision.Size>(0);
        this.type = this.GET_PARAM<alvision.int>(1);

        this.depth = alvision.MatrixType.CV_MAT_DEPTH(this.type);
        this.cn = alvision.MatrixType.CV_MAT_CN(this.type);
        this.format = this.cn == 1 ? alvision.ogl.Texture2DFormat.DEPTH_COMPONENT : this.cn == 3 ? alvision.ogl.Texture2DFormat.RGB : this.cn == 4 ? alvision.ogl.Texture2DFormat.RGBA : alvision.ogl.Texture2DFormat.NONE;
    }
};

//CUDA_TEST_P(Texture2D, Constructor1)
class Texture2D_Constructor1 extends Texture2D
{
    TestBody() {
        let tex = new alvision.ogl.Texture2D (this.size.height, this.size.width, this.format, true);

        alvision.EXPECT_EQ(this.size.height, tex.rows());
        alvision.EXPECT_EQ(this.size.width, tex.cols());
        alvision.EXPECT_EQ(this.format, tex.format());
    }
}

//CUDA_TEST_P(Texture2D, Constructor2)
class Texture2D_Constructor2 extends Texture2D
{
    TestBody() {
        let tex = new alvision.ogl.Texture2D (this.size, this.format, true);

        alvision.EXPECT_EQ(this.size.height, tex.rows());
        alvision.EXPECT_EQ(this.size.width, tex.cols());
        alvision.EXPECT_EQ(this.format, tex.format());
    }
}

//CUDA_TEST_P(Texture2D, ConstructorFromMat)
class Texture2D_ConstructorFromMat extends Texture2D
{
    TestBody() {
        let gold = alvision.randomMat(this.size, this.type, 0, this.depth == alvision.MatrixType.CV_8U ? 255 : 1);

        let tex = new alvision.ogl.Texture2D (gold, true);

        let texData = new alvision.Mat();
        tex.copyTo(texData, this.depth);

        alvision.EXPECT_MAT_NEAR(gold, texData, 1e-2);
    }
}

//CUDA_TEST_P(Texture2D, ConstructorFromGpuMat)
class Texture2D_ConstructorFromGpuMat extends Texture2D
{
    TestBody() {
        let gold = alvision.randomMat(this.size, this.type, 0, this.depth == alvision.MatrixType.CV_8U ? 255 : 1);
        let d_gold = new alvision.cuda.GpuMat(gold);

        let tex = new alvision.ogl.Texture2D (d_gold, true);

        let texData = new alvision.Mat();
        tex.copyTo(texData, this.depth);

        alvision.EXPECT_MAT_NEAR(gold, texData, 1e-2);
    }
}

//CUDA_TEST_P(Texture2D, ConstructorFromBuffer)
class Texture2D_ConstructorFromBuffer extends Texture2D
{
    TestBody() {
        let gold = alvision.randomMat(this.size, this.type, 0, this.depth == alvision.MatrixType.CV_8U ? 255 : 1);
        let buf_gold = new alvision.ogl.Buffer(gold, alvision.ogl.BufferTarget.PIXEL_UNPACK_BUFFER, true);

        let tex = new alvision.ogl.Texture2D (buf_gold, true);

        let texData = new alvision.Mat();
        tex.copyTo(texData, this.depth);

        alvision.EXPECT_MAT_NEAR(gold, texData, 1e-2);
    }
}

//CUDA_TEST_P(Texture2D, ConstructorFromTexture2D)
class Texture2D_ConstructorFromTexture2D extends Texture2D
{
    TestBody() {
        let tex_gold = new alvision.ogl.Texture2D (this.size, this.format, true);
        let tex = new alvision.ogl.Texture2D (tex_gold);

        alvision.EXPECT_EQ(tex_gold.texId(), tex.texId());
        alvision.EXPECT_EQ(tex_gold.rows(), tex.rows());
        alvision.EXPECT_EQ(tex_gold.cols(), tex.cols());
        alvision.EXPECT_EQ(tex_gold.format(), tex.format());
    }
}

//CUDA_TEST_P(Texture2D, Create)
class Texture2D_Create extends Texture2D
{
    TestBody() {
        let tex = new alvision.ogl.Texture2D();
        tex.create(this.size.height, this.size.width, this.format, true);

        alvision.EXPECT_EQ(this.size.height, tex.rows());
        alvision.EXPECT_EQ(this.size.width, tex.cols());
        alvision.EXPECT_EQ(this.format, tex.format());
    }
}

//CUDA_TEST_P(Texture2D, CopyFromMat)
class Texture2D_CopyFromMat extends Texture2D
{
    TestBody() {
        let gold = alvision.randomMat(this.size, this.type, 0, this.depth == alvision.MatrixType.CV_8U ? 255 : 1);

        let tex = new alvision.ogl.Texture2D();
        tex.copyFrom(gold, true);

        let texData = new alvision.Mat();
        tex.copyTo(texData, this.depth);

        alvision.EXPECT_MAT_NEAR(gold, texData, 1e-2);
    }
}

//CUDA_TEST_P(Texture2D, CopyFromGpuMat)
class Texture2D_CopyFromGpuMat extends Texture2D
{
    TestBody() {
        let gold = alvision.randomMat(this.size, this.type, 0, this.depth == alvision.MatrixType.CV_8U ? 255 : 1);
        let d_gold = new alvision.cuda.GpuMat(gold);

        let tex = new alvision.ogl.Texture2D();
        tex.copyFrom(d_gold, true);

        let texData = new alvision.Mat();
        tex.copyTo(texData, this.depth);

        alvision.EXPECT_MAT_NEAR(gold, texData, 1e-2);
    }
}

//CUDA_TEST_P(Texture2D, CopyFromBuffer)
class Texture2D_CopyFromBuffer extends Texture2D
{
    TestBody() {
        let gold = alvision.randomMat(this.size, this.type, 0, this.depth == alvision.MatrixType.CV_8U ? 255 : 1);
        let buf_gold = new alvision.ogl.Buffer(gold, alvision.ogl.BufferTarget.PIXEL_UNPACK_BUFFER, true);

        let tex = new alvision.ogl.Texture2D();
        tex.copyFrom(buf_gold, true);

        let texData = new alvision.Mat();
        tex.copyTo(texData, this.depth);

        alvision.EXPECT_MAT_NEAR(gold, texData, 1e-2);
    }
}

//CUDA_TEST_P(Texture2D, CopyToGpuMat)
class Texture2D_CopyToGpuMat extends Texture2D
{
    TestBody() {
        let gold = alvision.randomMat(this.size, this.type, 0, this.depth == alvision.MatrixType.CV_8U ? 255 : 1);

        let tex = new alvision.ogl.Texture2D (gold, true);

        let dst = new alvision.cuda.GpuMat();
        tex.copyTo(dst, this.depth);

        alvision.EXPECT_MAT_NEAR(gold, dst, 1e-2);
    }
}

//CUDA_TEST_P(Texture2D, CopyToBuffer)
class Texture2D_CopyToBuffer extends Texture2D
{
    TestBody() {
        let gold = alvision.randomMat(this.size, this.type, 0, this.depth == alvision.MatrixType.CV_8U ? 255 : 1);

        let tex = new alvision.ogl.Texture2D (gold, true);

        let dst = new alvision.ogl.Buffer ();
        tex.copyTo(dst, this.depth, true);

        let bufData = new alvision.Mat();
        dst.copyTo(bufData);

        alvision.EXPECT_MAT_NEAR(gold, bufData, 1e-2);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('OpenGL', 'Texture2D', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.DIFFERENT_SIZES,
    [alvision.MatrixType.CV_8UC1, alvision.MatrixType.CV_8UC3, alvision.MatrixType.CV_8UC4, alvision.MatrixType.CV_32FC1, alvision.MatrixType.CV_32FC3, alvision.MatrixType.CV_32FC4]
]));

//#endif
