//TODO: implement!

///*M///////////////////////////////////////////////////////////////////////////////////////
////
////  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
////
////  By downloading, copying, installing or using the software you agree to this license.
////  If you do not agree to this license, do not download, install,
////  copy or use the software.
////
////
////                        Intel License Agreement
////                For Open Source Computer Vision Library
////
//// Copyright (C) 2000, Intel Corporation, all rights reserved.
//// Third party copyrights are property of their respective owners.
////
//// Redistribution and use in source and binary forms, with or without modification,
//// are permitted provided that the following conditions are met:
////
////   * Redistribution's of source code must retain the above copyright notice,
////     this list of conditions and the following disclaimer.
////
////   * Redistribution's in binary form must reproduce the above copyright notice,
////     this list of conditions and the following disclaimer in the documentation
////     and/or other materials provided with the distribution.
////
////   * The name of Intel Corporation may not be used to endorse or promote products
////     derived from this software without specific prior written permission.
////
//// This software is provided by the copyright holders and contributors "as is" and
//// any express or implied warranties, including, but not limited to, the implied
//// warranties of merchantability and fitness for a particular purpose are disclaimed.
//// In no event shall the Intel Corporation or contributors be liable for any direct,
//// indirect, incidental, special, exemplary, or consequential damages
//// (including, but not limited to, procurement of substitute goods or services;
//// loss of use, data, or profits; or business interruption) however caused
//// and on any theory of liability, whether in contract, strict liability,
//// or tort (including negligence or otherwise) arising in any way out of
//// the use of this software, even if advised of the possibility of such damage.
////
////M*/


//import tape = require("tape");
//import path = require("path");
//
//import async = require("async");
//import alvision = require("../../../tsbinding/alvision");
//import util = require('util');
//import fs = require('fs');

////#include "test_precomp.hpp"
////
////using namespace cv;
////using namespace std;

//class CV_ImgWarpBaseTest extends alvision.cvtest.ArrayTest
//{
//    constructor(warp_matrix: boolean) {
//        super();
//        this.test_array[this.INPUT].push(null);
//        if (warp_matrix)
//            this.test_array[this.INPUT].push(null);
//        this.test_array[this.INPUT_OUTPUT].push(null);
//        this.test_array[this.REF_INPUT_OUTPUT].push(null);
//        this.max_interpolation = 5;
//        this.interpolation = 0;
//        this.element_wise_relative_error = false;
//        this.spatial_scale_zoom = 0.01;
//        this.spatial_scale_decimate = 0.005;
//    }

//    read_params(fs: alvision.FileStorage): alvision.int {
//        var code = super.read_params(fs);
//        return code;
//    }
//    prepare_test_case(test_case_idx: alvision.int): alvision.int{
//        var code = super.prepare_test_case(test_case_idx);
//        var img = this.test_mat[this.INPUT][0];
//        int i, j, cols = img.cols;
//        let type = img.type(), depth = CV_MAT_DEPTH(type), cn = CV_MAT_CN(type);
//        double scale = depth == CV_16U ? 1000. : 255. * 0.5;
//        double space_scale = spatial_scale_decimate;
//        Array < float > buffer(img.cols * cn);

//        if (code <= 0)
//            return code;

//        if (test_mat[INPUT_OUTPUT][0].cols >= img.cols &&
//            test_mat[INPUT_OUTPUT][0].rows >= img.rows)
//            space_scale = spatial_scale_zoom;

//        for (i = 0; i < img.rows; i++) {
//            uchar * ptr = img.ptr(i);
//            switch (cn) {
//                case 1:
//                    for (j = 0; j < cols; j++)
//                        buffer[j] = (float)((sin((i + 1) * space_scale) * sin((j + 1) * space_scale) + 1.) * scale);
//                    break;
//                case 2:
//                    for (j = 0; j < cols; j++) {
//                        buffer[j * 2] = (float)((sin((i + 1) * space_scale) + 1.) * scale);
//                        buffer[j * 2 + 1] = (float)((sin((i + j) * space_scale) + 1.) * scale);
//                    }
//                    break;
//                case 3:
//                    for (j = 0; j < cols; j++) {
//                        buffer[j * 3] = (float)((sin((i + 1) * space_scale) + 1.) * scale);
//                        buffer[j * 3 + 1] = (float)((sin(j * space_scale) + 1.) * scale);
//                        buffer[j * 3 + 2] = (float)((sin((i + j) * space_scale) + 1.) * scale);
//                    }
//                    break;
//                case 4:
//                    for (j = 0; j < cols; j++) {
//                        buffer[j * 4] = (float)((sin((i + 1) * space_scale) + 1.) * scale);
//                        buffer[j * 4 + 1] = (float)((sin(j * space_scale) + 1.) * scale);
//                        buffer[j * 4 + 2] = (float)((sin((i + j) * space_scale) + 1.) * scale);
//                        buffer[j * 4 + 3] = (float)((sin((i - j) * space_scale) + 1.) * scale);
//                    }
//                    break;
//                default:
//                    assert(0);
//            }

//            /*switch( depth )
//            {
//            case CV_8U:
//                for( j = 0; j < cols*cn; j++ )
//                    ptr[j] = (uchar)Math.round(buffer[j]);
//                break;
//            case CV_16U:
//                for( j = 0; j < cols*cn; j++ )
//                    ((ushort*)ptr)[j] = (ushort)Math.round(buffer[j]);
//                break;
//            case CV_32F:
//                for( j = 0; j < cols*cn; j++ )
//                    ((float*)ptr)[j] = (float)buffer[j];
//                break;
//            default:
//                assert(0);
//            }*/
//            alvision.Mat src(1, cols * cn, alvision.MatrixType.CV_32F, &buffer[0]);
//            alvision.Mat dst(1, cols * cn, depth, ptr);
//            src.convertTo(dst, dst.type());
//        }

//        return code;
//    }
//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        var rng = this.ts.get_rng();
//        int depth = alvision.cvtest.randInt(rng) % 3;
//        int cn = alvision.cvtest.randInt(rng) % 3 + 1;
//        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        depth = depth == 0 ? alvision.MatrixType.CV_8U : depth == 1 ? alvision.MatrixType.CV_16U : alvision.MatrixType.CV_32F;
//        cn += cn == 2;

//        types[INPUT][0] = types[INPUT_OUTPUT][0] = types[REF_INPUT_OUTPUT][0] = alvision.MatrixType.CV_MAKETYPE(depth, cn);
//        if (test_array[INPUT].size() > 1)
//            types[INPUT][1] = alvision.cvtest.randInt(rng) & 1 ? alvision.MatrixType.CV_32FC1 : alvision.MatrixType.CV_64FC1;

//        interpolation = alvision.cvtest.randInt(rng) % max_interpolation;
//    }
//    get_minmax_bounds(i: alvision.int, j: alvision.int, type: alvision.int, low: alvision.Scalar, high: alvision.Scalar): void{
//        super.get_minmax_bounds(i, j, type, low, high);
//        if (CV_MAT_DEPTH(type) == alvision.MatrixType.CV_32F) {
//            low = Scalar.all(-10.);
//            high = Scalar.all(10);
//        }
//    }
//    fill_array(test_case_idx: alvision.int, i: alvision.int, j: alvision.int, arr: alvision.Mat ): void {
//        if (i != INPUT || j != 0)
//            super.fill_array(test_case_idx, i, j, arr);
//    }

//    protected interpolation: alvision.int;
//    protected  max_interpolation     : alvision.int;
//    protected spatial_scale_zoom     : alvision.double;
//    protected spatial_scale_decimate: alvision.double;
//};



///////////////////////////

//class CV_ResizeTest extends CV_ImgWarpBaseTest {

//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        var rng = this.ts.get_rng();
//        CV_ImgWarpBaseTest::get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        alvision.Size sz;

//        sz.width = (alvision.cvtest.randInt(rng) % sizes[INPUT][0].width) + 1;
//        sz.height = (alvision.cvtest.randInt(rng) % sizes[INPUT][0].height) + 1;

//        if (alvision.cvtest.randInt(rng) & 1) {
//            int xfactor = alvision.cvtest.randInt(rng) % 10 + 1;
//            int yfactor = alvision.cvtest.randInt(rng) % 10 + 1;

//            if (alvision.cvtest.randInt(rng) & 1)
//                yfactor = xfactor;

//            sz.width = sizes[INPUT][0].width / xfactor;
//            sz.width = MAX(sz.width, 1);
//            sz.height = sizes[INPUT][0].height / yfactor;
//            sz.height = MAX(sz.height, 1);
//            sizes[INPUT][0].width = sz.width * xfactor;
//            sizes[INPUT][0].height = sz.height * yfactor;
//        }

//        if (alvision.cvtest.randInt(rng) & 1)
//            sizes[INPUT_OUTPUT][0] = sizes[REF_INPUT_OUTPUT][0] = sz;
//        else {
//            sizes[INPUT_OUTPUT][0] = sizes[REF_INPUT_OUTPUT][0] = sizes[INPUT][0];
//            sizes[INPUT][0] = sz;
//        }
//        if (interpolation == 4 &&
//            (MIN(sizes[INPUT][0].width, sizes[INPUT_OUTPUT][0].width) < 4 ||
//                MIN(sizes[INPUT][0].height, sizes[INPUT_OUTPUT][0].height) < 4))
//            interpolation = 2;
//    }
//    run_func(): void {
//        cvResize(test_array[INPUT][0], test_array[INPUT_OUTPUT][0], interpolation);
//    }

//    prepare_to_validation(test_case_idx: alvision.int): void {
//        var _src = test_mat[INPUT][0], _dst = test_mat[REF_INPUT_OUTPUT][0];
//        var src = _src, dst = _dst;
//        int i, j, k;
//        CvMat * x_idx = cvCreateMat(1, dst.cols, alvision.MatrixType.CV_32SC1);
//        CvMat * y_idx = cvCreateMat(1, dst.rows, alvision.MatrixType.CV_32SC1);
//        int * x_tab = x_idx.data.i;
//        int elem_size = CV_ELEM_SIZE(src.type);
//        int drows = dst.rows, dcols = dst.cols;

//        if (interpolation == CV_INTER_NN) {
//            for (j = 0; j < dcols; j++) {
//                int t = (j * src.cols * 2 + MIN(src.cols, dcols) - 1) / (dcols * 2);
//                t -= t >= src.cols;
//                x_idx.data.i[j] = t * elem_size;
//            }

//            for (j = 0; j < drows; j++) {
//                int t = (j * src.rows * 2 + MIN(src.rows, drows) - 1) / (drows * 2);
//                t -= t >= src.rows;
//                y_idx.data.i[j] = t;
//            }
//        }
//        else {
//            double scale_x = (double)src.cols / dcols;
//            double scale_y = (double)src.rows / drows;

//            for (j = 0; j < dcols; j++) {
//                double f = ((j + 0.5) * scale_x - 0.5);
//                i = Math.round(f);
//                x_idx.data.i[j] = (i < 0 ? 0 : i >= src.cols ? src.cols - 1 : i) * elem_size;
//            }

//            for (j = 0; j < drows; j++) {
//                double f = ((j + 0.5) * scale_y - 0.5);
//                i = Math.round(f);
//                y_idx.data.i[j] = i < 0 ? 0 : i >= src.rows ? src.rows - 1 : i;
//            }
//        }

//        for (i = 0; i < drows; i++) {
//            uchar * dptr = dst.data.ptr + dst.step * i;
//            const uchar* sptr0 = src.data.ptr + src.step * y_idx.data.i[i];

//            for (j = 0; j < dcols; j++ , dptr += elem_size) {
//                const uchar* sptr = sptr0 + x_tab[j];
//                for (k = 0; k < elem_size; k++)
//                    dptr[k] = sptr[k];
//            }
//        }

//        cvReleaseMat( &x_idx);
//        cvReleaseMat( &y_idx);
//    }
//    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
//        var depth = this.test_mat[this.INPUT][0].depth();
//        return depth == alvision.MatrixType.CV_8U ? 16 : depth == CV_16U ? 1024 : 1e-1;
//    }
//}



///////////////////////////

//function test_remap(src: alvision.Mat, dst: alvision.Mat, mapx: alvision.Mat, mapy: alvision.Mat ,
//    mask: alvision.Mat = null, interpolation: alvision.int = alvision.InterpolationFlags.INTER_LINEAR ) : void
//{
//    int x, y, k;
//    int drows = dst.rows, dcols = dst.cols;
//    int srows = src.rows, scols = src.cols;
//    const uchar* sptr0 = src.ptr();
//    int depth = src.depth(), cn = src.channels();
//    int elem_size = (int)src.elemSize();
//    int step = (int)(src.step / CV_ELEM_SIZE(depth));
//    int delta;

//    if( interpolation != CV_INTER_CUBIC )
//    {
//        delta = 0;
//        scols -= 1; srows -= 1;
//    }
//    else
//    {
//        delta = 1;
//        scols = MAX(scols - 3, 0);
//        srows = MAX(srows - 3, 0);
//    }

//    int scols1 = MAX(scols - 2, 0);
//    int srows1 = MAX(srows - 2, 0);

//    if( mask )
//        *mask = alvision.Scalar.all(0);

//    for( y = 0; y < drows; y++ )
//    {
//        uchar* dptr = dst.ptr(y);
//        const float* mx = mapx.ptr<float>(y);
//        const float* my = mapy.ptr<float>(y);
//        uchar* m = mask ? mask.ptr(y) : 0;

//        for( x = 0; x < dcols; x++, dptr += elem_size )
//        {
//            float xs = mx[x];
//            float ys = my[x];
//            int ixs = Math.floor(xs);
//            int iys = Math.floor(ys);

//            if( (unsigned)(ixs - delta - 1) >= (unsigned)scols1 ||
//                (unsigned)(iys - delta - 1) >= (unsigned)srows1 )
//            {
//                if( m )
//                    m[x] = 1;
//                if( (unsigned)(ixs - delta) >= (unsigned)scols ||
//                    (unsigned)(iys - delta) >= (unsigned)srows )
//                    continue;
//            }

//            xs -= ixs;
//            ys -= iys;

//            switch( depth )
//            {
//                case alvision.MatrixType.CV_8U:
//                {
//                const uchar* sptr = sptr0 + iys*step + ixs*cn;
//                for( k = 0; k < cn; k++ )
//                {
//                    float v00 = sptr[k];
//                    float v01 = sptr[cn + k];
//                    float v10 = sptr[step + k];
//                    float v11 = sptr[step + cn + k];

//                    v00 = v00 + xs*(v01 - v00);
//                    v10 = v10 + xs*(v11 - v10);
//                    v00 = v00 + ys*(v10 - v00);
//                    dptr[k] = (uchar)Math.round(v00);
//                }
//                }
//                break;
//            case CV_16U:
//                {
//                const ushort* sptr = (const ushort*)sptr0 + iys*step + ixs*cn;
//                for( k = 0; k < cn; k++ )
//                {
//                    float v00 = sptr[k];
//                    float v01 = sptr[cn + k];
//                    float v10 = sptr[step + k];
//                    float v11 = sptr[step + cn + k];

//                    v00 = v00 + xs*(v01 - v00);
//                    v10 = v10 + xs*(v11 - v10);
//                    v00 = v00 + ys*(v10 - v00);
//                    ((ushort*)dptr)[k] = (ushort)Math.round(v00);
//                }
//                }
//                break;
//            case CV_32F:
//                {
//                const float* sptr = (const float*)sptr0 + iys*step + ixs*cn;
//                for( k = 0; k < cn; k++ )
//                {
//                    float v00 = sptr[k];
//                    float v01 = sptr[cn + k];
//                    float v10 = sptr[step + k];
//                    float v11 = sptr[step + cn + k];

//                    v00 = v00 + xs*(v01 - v00);
//                    v10 = v10 + xs*(v11 - v10);
//                    v00 = v00 + ys*(v10 - v00);
//                    ((float*)dptr)[k] = (float)v00;
//                }
//                }
//                break;
//            default:
//                assert(0);
//            }
//        }
//    }
//}

///////////////////////////

//class CV_WarpAffineTest extends CV_ImgWarpBaseTest {
//    constructor() {
//        super(true);
//        //spatial_scale_zoom = spatial_scale_decimate;
//        this.spatial_scale_decimate = this.spatial_scale_zoom;
//    }

//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        var sz = sizes[this.INPUT][0];
//        // run for the second time to get output of a different size
//        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        sizes[INPUT][0] = sz;
//        sizes[INPUT][1] = alvision.Size(3, 2);
//    }
//    run_func(): void {
//        var mtx = test_mat[INPUT][1];
//        cvWarpAffine(test_array[INPUT][0], test_array[INPUT_OUTPUT][0], &mtx, interpolation);
//    }
//    prepare_test_case(test_case_idx: alvision.int): alvision.int {
//        var rng = this.ts.get_rng();
//        var code = super.prepare_test_case(test_case_idx);
//        const src = this.test_mat[this.INPUT][0];
//        const dst = this.test_mat[this.INPUT_OUTPUT][0];
//        Mat & mat = test_mat[INPUT][1];
//        CvPoint2D32f center;
//        double scale, angle;

//        if (code <= 0)
//            return code;

//        double buffer[6];
//        Mat tmp(2, 3, mat.type(), buffer);

//        center.x = (float)((alvision.cvtest.randReal(rng).valueOf() * 1.2 - 0.1) * src.cols);
//        center.y = (float)((alvision.cvtest.randReal(rng).valueOf() * 1.2 - 0.1) * src.rows);
//        angle = alvision.cvtest.randReal(rng).valueOf() * 360;
//        scale = ((double)dst.rows / src.rows + (double)dst.cols / src.cols)*0.5;
//        getRotationMatrix2D(center, angle, scale).convertTo(mat, mat.depth());
//        rng.fill(tmp, alvision.DistType.NORMAL, Scalar.all(1.), Scalar.all(0.01));
//        alvision.max(tmp, 0.9, tmp);
//        alvision.min(tmp, 1.1, tmp);
//        alvision.multiply(tmp, mat, mat, 1.);

//        return code;
//    }
//    prepare_to_validation(test_case_idx: alvision.int): void {
//        const src = test_mat[INPUT][0];
//        Mat & dst = test_mat[REF_INPUT_OUTPUT][0];
//        Mat & dst0 = test_mat[INPUT_OUTPUT][0];
//        Mat mapx(dst.size(), alvision.MatrixType.CV_32F), mapy(dst.size(), alvision.MatrixType.CV_32F);
//        double m[6];
//        Mat srcAb, dstAb(2, 3, alvision.MatrixType.CV_64FC1, m);

//        //cvInvert( &tM, &M, CV_LU );
//        // [R|t] . [R^-1 | -(R^-1)*t]
//        test_mat[INPUT][1].convertTo(srcAb, CV_64F);
//        Mat A = srcAb.colRange(0, 2);
//        Mat b = srcAb.col(2);
//        Mat invA = dstAb.colRange(0, 2);
//        Mat invAb = dstAb.col(2);
//        alvision.invert(A, invA, alvision.DecompTypes.DECOMP_SVD);
//        alvision.gemm(invA, b, -1, Mat(), 0, invAb);

//        for (let y = 0; y < dst.rows; y++ )
//        for (let x = 0; x < dst.cols; x++ )
//        {
//            mapx.at<float>(y, x) = (float)(x * m[0] + y * m[1] + m[2]);
//            mapy.at<float>(y, x) = (float)(x * m[3] + y * m[4] + m[5]);
//        }

//        Mat mask(dst.size(), alvision.MatrixType.CV_8U);
//        test_remap(src, dst, mapx, mapy, &mask);
//        dst.setTo(alvision.Scalar.all(0), mask);
//        dst0.setTo(alvision.Scalar.all(0), mask);
//    }
//    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
//        var depth = test_mat[INPUT][0].depth();
//        return depth == alvision.MatrixType.CV_8U ? 16 : depth == CV_16U ? 1024 : 5e-2;
//    }
//}



///////////////////////////

//class CV_WarpPerspectiveTest extends CV_ImgWarpBaseTest {
//    constructor() {
//        super(true);
//        //spatial_scale_zoom = spatial_scale_decimate;
//        this.spatial_scale_decimate =this. spatial_scale_zoom;
//    }
//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        CV_ImgWarpBaseTest::get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        alvision.Size sz = sizes[INPUT][0];
//        // run for the second time to get output of a different size
//        CV_ImgWarpBaseTest::get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        sizes[INPUT][0] = sz;
//        sizes[INPUT][1] = alvision.Size(3, 3);
//    }
//    run_func(): void {
//        CvMat mtx = test_mat[INPUT][1];
//        cvWarpPerspective(test_array[INPUT][0], test_array[INPUT_OUTPUT][0], &mtx, interpolation);
//    }
//    prepare_test_case(test_case_idx: alvision.int): alvision.int {
//        var rng = this.ts.get_rng();
//        int code = CV_ImgWarpBaseTest::prepare_test_case(test_case_idx);
//        const CvMat& src = test_mat[INPUT][0];
//        const CvMat& dst = test_mat[INPUT_OUTPUT][0];
//        Mat & mat = test_mat[INPUT][1];
//        Point2f s[4], d[4];
//        int i;

//        if (code <= 0)
//            return code;

//        s[0] = Point2f(0, 0);
//        d[0] = Point2f(0, 0);
//        s[1] = Point2f(src.cols - 1.f, 0);
//        d[1] = Point2f(dst.cols - 1.f, 0);
//        s[2] = Point2f(src.cols - 1.f, src.rows - 1.f);
//        d[2] = Point2f(dst.cols - 1.f, dst.rows - 1.f);
//        s[3] = Point2f(0, src.rows - 1.f);
//        d[3] = Point2f(0, dst.rows - 1.f);

//        float bufer[16];
//        Mat tmp(1, 16, alvision.MatrixType.CV_32FC1, bufer);

//        rng.fill(tmp, alvision.DistType.NORMAL, Scalar.all(0.), Scalar.all(0.1));

//        for (i = 0; i < 4; i++) {
//            s[i].x += bufer[i * 4] * src.cols / 2;
//            s[i].y += bufer[i * 4 + 1] * src.rows / 2;
//            d[i].x += bufer[i * 4 + 2] * dst.cols / 2;
//            d[i].y += bufer[i * 4 + 3] * dst.rows / 2;
//        }

//        alvision.getPerspectiveTransform(s, d).convertTo(mat, mat.depth());
//        return code;
//    }
//    prepare_to_validation(test_case_idx: alvision.int): void {
//        var src = test_mat[INPUT][0];
//        var dst = test_mat[REF_INPUT_OUTPUT][0];
//        var dst0 = test_mat[INPUT_OUTPUT][0];
//        Mat mapx(dst.size(), alvision.MatrixType.CV_32F), mapy(dst.size(), alvision.MatrixType.CV_32F);
//        double m[9];
//        Mat srcM, dstM(3, 3, alvision.MatrixType.CV_64F, m);

//        //cvInvert( &tM, &M, CV_LU );
//        // [R|t] . [R^-1 | -(R^-1)*t]
//        test_mat[INPUT][1].convertTo(srcM, alvision.MatrixType.CV_64F);
//        alvision.invert(srcM, dstM, alvision.DecompTypes.DECOMP_SVD);

//        for (let y = 0; y < dst.rows; y++ )
//        {
//            for (let x = 0; x < dst.cols; x++ )
//            {
//                double xs = x * m[0] + y * m[1] + m[2];
//                double ys = x * m[3] + y * m[4] + m[5];
//                double ds = x * m[6] + y * m[7] + m[8];

//                ds = ds ? 1. / ds : 0;
//                xs *= ds;
//                ys *= ds;

//                mapx.at<float>(y, x) = (float)xs;
//                mapy.at<float>(y, x) = (float)ys;
//            }
//        }

//        Mat mask(dst.size(), alvision.MatrixType.CV_8U);
//        test_remap(src, dst, mapx, mapy, &mask);
//        dst.setTo(alvision.Scalar.all(0), mask);
//        dst0.setTo(alvision.Scalar.all(0), mask);
//    }
//    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
//        int depth = test_mat[INPUT][0].depth();
//        return depth == alvision.MatrixType.CV_8U ? 16 : depth == alvision.MatrixType.CV_16U ? 1024 : 5e-2;
//    }
//}



///////////////////////////

//class CV_RemapTest extends CV_ImgWarpBaseTest
//{
//    constructor() {
//        super(false);
//        //spatial_scale_zoom = spatial_scale_decimate;
//        this.test_array[this.INPUT].push(null);
//        this.test_array[this.INPUT].push(null);

//        this.spatial_scale_decimate = this.spatial_scale_zoom;
//    }

//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        types[INPUT][1] = types[INPUT][2] = alvision.MatrixType.CV_32FC1;
//        interpolation = CV_INTER_LINEAR;
//    }
//    run_func(): void {
//        cvRemap(test_array[INPUT][0], test_array[INPUT_OUTPUT][0],
//            test_array[INPUT][1], test_array[INPUT][2], interpolation);
//    }
//    prepare_test_case(test_case_idx: alvision.int): alvision.int{
//        var rng = this.ts.get_rng();
//        int code = CV_ImgWarpBaseTest::prepare_test_case(test_case_idx);
//        const Mat& src = test_mat[INPUT][0];
//        double a[9] = { 0,0,0,0,0,0,0,0,1}, k[4];
//        Mat _a(3, 3, alvision.MatrixType.CV_64F, a);
//        Mat _k(4, 1, alvision.MatrixType.CV_64F, k);
//        double sz = Math.max(src.rows, src.cols);

//        if (code <= 0)
//            return code;

//        double aspect_ratio = alvision.cvtest.randReal(rng).valueOf() * 0.6 + 0.7;
//        a[2] = (src.cols - 1) * 0.5 + alvision.cvtest.randReal(rng).valueOf() * 10 - 5;
//        a[5] = (src.rows - 1) * 0.5 + alvision.cvtest.randReal(rng).valueOf() * 10 - 5;
//        a[0] = sz / (0.9 - alvision.cvtest.randReal(rng).valueOf() * 0.6);
//        a[4] = aspect_ratio * a[0];
//        k[0] = alvision.cvtest.randReal(rng).valueOf() * 0.06 - 0.03;
//        k[1] = alvision.cvtest.randReal(rng).valueOf() * 0.06 - 0.03;
//        if (k[0] * k[1] > 0)
//            k[1] = -k[1];
//        k[2] = alvision.cvtest.randReal(rng).valueOf() * 0.004 - 0.002;
//        k[3] = alvision.cvtest.randReal(rng).valueOf() * 0.004 - 0.002;

//        alvision.cvtest.initUndistortMap(_a, _k, test_mat[INPUT][1].size(), test_mat[INPUT][1], test_mat[INPUT][2]);
//        return code;
//    }
//    prepare_to_validation(test_case_idx: alvision.int): void {
//        var dst = test_mat[REF_INPUT_OUTPUT][0];
//        var dst0 = test_mat[INPUT_OUTPUT][0];
//        Mat mask(dst.size(), alvision.MatrixType.CV_8U);
//        test_remap(test_mat[INPUT][0], dst, test_mat[INPUT][1],
//            test_mat[INPUT][2], &mask, interpolation);
//        dst.setTo(alvision.Scalar.all(0), mask);
//        dst0.setTo(alvision.Scalar.all(0), mask);
//    }
//    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
//        int depth = test_mat[INPUT][0].depth();
//        return depth == alvision.MatrixType.CV_8U ? 16 : depth == alvision.MatrixType.CV_16U ? 1024 : 5e-2;
//    }
//    fill_array(test_case_idx: alvision.int, i: alvision.int, j: alvision.int, arr: alvision.Mat): void {
//        if (i != INPUT)
//            CV_ImgWarpBaseTest::fill_array(test_case_idx, i, j, arr);
//    }
//};



//////////////////////////////// undistort /////////////////////////////////

//class CV_UndistortTest extends CV_ImgWarpBaseTest {
//    constructor() {
//        super(false);
//        //spatial_scale_zoom = spatial_scale_decimate;
//        this.test_array[this.INPUT].push(null);
//        this.test_array[this.INPUT].push(null);
//        this.test_array[this.INPUT].push(null);

//        this.spatial_scale_decimate = spatial_scale_zoom;
//    }

//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        var rng = this.ts.get_rng();
//        CV_ImgWarpBaseTest::get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        let type = types[INPUT][0];
//        type = alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_8U, CV_MAT_CN(type));
//        types[INPUT][0] = types[INPUT_OUTPUT][0] = types[REF_INPUT_OUTPUT][0] = type;
//        types[INPUT][1] = alvision.cvtest.randInt(rng) % 2 ? alvision.MatrixType.CV_64F : alvision.MatrixType.CV_32F;
//        types[INPUT][2] = alvision.cvtest.randInt(rng) % 2 ? alvision.MatrixType.CV_64F : alvision.MatrixType.CV_32F;
//        sizes[INPUT][1] = alvision.Size(3, 3);
//        sizes[INPUT][2] = alvision.cvtest.randInt(rng) % 2 ? alvision.Size(4, 1) : alvision.Size(1, 4);
//        types[INPUT][3] = types[INPUT][1];
//        sizes[INPUT][3] = sizes[INPUT][1];
//        interpolation = CV_INTER_LINEAR;
//    }
//    run_func(): void {
//        if (!useCPlus) {
//            CvMat a = test_mat[INPUT][1], k = test_mat[INPUT][2];
//            cvUndistort2(test_array[INPUT][0], test_array[INPUT_OUTPUT][0], &a, &k);
//        }
//        else {
//            if (zero_distortion) {
//                alvision.undistort(input0, input_output, input1, alvision.Mat());
//            }
//            else {
//                alvision.undistort(input0, input_output, input1, input2);
//            }
//        }
//    }
//    prepare_test_case(test_case_idx: alvision.int): alvision.int {
//        var rng = this.ts.get_rng();
//        int code = CV_ImgWarpBaseTest::prepare_test_case(test_case_idx);

//        const Mat& src = test_mat[INPUT][0];
//        double k[4], a[9] = { 0,0,0,0,0,0,0,0,1};
//        double new_cam[9] = { 0,0,0,0,0,0,0,0,1};
//        double sz = MAX(src.rows, src.cols);

//        Mat & _new_cam0 = test_mat[INPUT][3];
//        Mat _new_cam(test_mat[INPUT][3].rows, test_mat[INPUT][3].cols, alvision.MatrixType.CV_64F, new_cam);
//        Mat & _a0 = test_mat[INPUT][1];
//        Mat _a(3, 3, alvision.MatrixType.CV_64F, a);
//        Mat & _k0 = test_mat[INPUT][2];
//        Mat _k(_k0.rows, _k0.cols, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_64F, _k0.channels()), k);

//        if (code <= 0)
//            return code;

//        double aspect_ratio = alvision.cvtest.randReal(rng).valueOf() * 0.6 + 0.7;
//        a[2] = (src.cols - 1) * 0.5 + alvision.cvtest.randReal(rng).valueOf() * 10 - 5;
//        a[5] = (src.rows - 1) * 0.5 + alvision.cvtest.randReal(rng).valueOf() * 10 - 5;
//        a[0] = sz / (0.9 - alvision.cvtest.randReal(rng).valueOf() * 0.6);
//        a[4] = aspect_ratio * a[0];
//        k[0] = alvision.cvtest.randReal(rng).valueOf() * 0.06 - 0.03;
//        k[1] = alvision.cvtest.randReal(rng).valueOf() * 0.06 - 0.03;
//        if (k[0] * k[1] > 0)
//            k[1] = -k[1];
//        if (alvision.cvtest.randInt(rng) % 4 != 0) {
//            k[2] = alvision.cvtest.randReal(rng).valueOf() * 0.004 - 0.002;
//            k[3] = alvision.cvtest.randReal(rng).valueOf() * 0.004 - 0.002;
//        }
//        else
//            k[2] = k[3] = 0;

//        new_cam[0] = a[0] + (alvision.cvtest.randReal(rng).valueOf() - 0.5)*0.2 * a[0]; //10%
//        new_cam[4] = a[4] + (alvision.cvtest.randReal(rng).valueOf() - 0.5)*0.2 * a[4]; //10%
//        new_cam[2] = a[2] + (alvision.cvtest.randReal(rng).valueOf() - 0.5)*0.3 * test_mat[INPUT][0].rows; //15%
//        new_cam[5] = a[5] + (alvision.cvtest.randReal(rng).valueOf() - 0.5)*0.3 * test_mat[INPUT][0].cols; //15%

//        _a.convertTo(_a0, _a0.depth());

//        zero_distortion = (alvision.cvtest.randInt(rng) % 2) == 0 ? false : true;
//        _k.convertTo(_k0, _k0.depth());

//        zero_new_cam = (alvision.cvtest.randInt(rng) % 2) == 0 ? false : true;
//        _new_cam.convertTo(_new_cam0, _new_cam0.depth());

//        //Testing C++ code
//        useCPlus = ((alvision.cvtest.randInt(rng) % 2) != 0);
//        if (useCPlus) {
//            input0 = test_mat[this.INPUT][0];
//            input1 = test_mat[this.INPUT][1];
//            input2 = test_mat[this.INPUT][2];
//            input_new_cam = test_mat[INPUT][3];
//        }

//        return code;
//    }
//    prepare_to_validation(test_case_idx: alvision.int): void {
//        if (useCPlus) {
//            Mat & output = test_mat[INPUT_OUTPUT][0];
//            input_output.convertTo(output, output.type());
//        }
//        Mat & src = test_mat[INPUT][0];
//        Mat & dst = test_mat[REF_INPUT_OUTPUT][0];
//        Mat & dst0 = test_mat[INPUT_OUTPUT][0];
//        Mat mapx, mapy;
//        alvision.cvtest.initUndistortMap(test_mat[INPUT][1], test_mat[INPUT][2], dst.size(), mapx, mapy);
//        Mat mask(dst.size(), alvision.MatrixType.CV_8U);
//        test_remap(src, dst, mapx, mapy, &mask, interpolation);
//        dst.setTo(alvision.Scalar.all(0), mask);
//        dst0.setTo(alvision.Scalar.all(0), mask);
//    }
//    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
//        int depth = test_mat[INPUT][0].depth();
//        return depth == alvision.MatrixType.CV_8U ? 16 : depth == CV_16U ? 1024 : 5e-2;
//    }
//    fill_array(test_case_idx: alvision.int, i: alvision.int, j: alvision.int, arr: alvision.Mat): void {
//        if (i != INPUT)
//            CV_ImgWarpBaseTest::fill_array(test_case_idx, i, j, arr);
//    }

//    private useCPlus: boolean;
//    private input0: alvision.Mat;
//    private input1: alvision.Mat;
//    private input2: alvision.Mat;
//    private input_new_cam: alvision.Mat;
//    private input_output: alvision.Mat;

//    private zero_new_cam: boolean;
//    private zero_distortion: boolean;
//}





//class CV_UndistortMapTest extends alvision.cvtest.ArrayTest
//{
//    constructor() {
//        super();
//        this.test_array[this.INPUT].push(null);
//        this.test_array[this.INPUT].push(null);
//        this.test_array[this.OUTPUT].push(null);
//        this.test_array[this.OUTPUT].push(null);
//        this.test_array[this.REF_OUTPUT].push(null);
//        this.test_array[this.REF_OUTPUT].push(null);

//        this.element_wise_relative_error = false;
//    }

//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        var rng = this.ts.get_rng();
//        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        var depth = alvision.cvtest.randInt(rng) % 2 ? alvision.MatrixType.CV_64F : alvision.MatrixType.CV_32F;

//        alvision.Size sz = sizes[OUTPUT][0];
//        types[INPUT][0] = types[INPUT][1] = depth;
//        dualChannel = alvision.cvtest.randInt(rng) % 2 == 0;
//        types[OUTPUT][0] = types[OUTPUT][1] =
//            types[REF_OUTPUT][0] = types[REF_OUTPUT][1] = dualChannel ? alvision.MatrixType.CV_32FC2 : alvision.MatrixType.CV_32F;
//        sizes[INPUT][0] = alvision.Size(3, 3);
//        sizes[INPUT][1] = alvision.cvtest.randInt(rng) % 2 ? alvision.Size(4, 1) : alvision.Size(1, 4);

//        sz.width = MAX(sz.width, 16);
//        sz.height = MAX(sz.height, 16);
//        sizes[OUTPUT][0] = sizes[OUTPUT][1] =
//            sizes[REF_OUTPUT][0] = sizes[REF_OUTPUT][1] = sz;
//    }
//    run_func(): void {
//        CvMat a = test_mat[INPUT][0], k = test_mat[INPUT][1];

//        if (!dualChannel)
//            cvInitUndistortMap( &a, &k, test_array[OUTPUT][0], test_array[OUTPUT][1]);
//        else
//            cvInitUndistortMap( &a, &k, test_array[OUTPUT][0], 0);
//    }
//    prepare_test_case(test_case_idx: alvision.int): alvision.int{
//        var rng = this.ts.get_rng();
//        int code = super.prepare_test_case(test_case_idx);
//        const Mat& mapx = test_mat[OUTPUT][0];
//        double k[4], a[9] = { 0,0,0,0,0,0,0,0,1};
//        double sz = MAX(mapx.rows, mapx.cols);
//        Mat & _a0 = test_mat[INPUT][0], &_k0 = test_mat[INPUT][1];
//        Mat _a(3, 3, CV_64F, a);
//        Mat _k(_k0.rows, _k0.cols, CV_MAKETYPE(CV_64F, _k0.channels()), k);

//        if (code <= 0)
//            return code;

//        double aspect_ratio = alvision.cvtest.randReal(rng).valueOf() * 0.6 + 0.7;
//        a[2] = (mapx.cols - 1) * 0.5 + alvision.cvtest.randReal(rng).valueOf() * 10 - 5;
//        a[5] = (mapx.rows - 1) * 0.5 + alvision.cvtest.randReal(rng).valueOf() * 10 - 5;
//        a[0] = sz / (0.9 - alvision.cvtest.randReal(rng).valueOf() * 0.6);
//        a[4] = aspect_ratio * a[0];
//        k[0] = alvision.cvtest.randReal(rng).valueOf() * 0.06 - 0.03;
//        k[1] = alvision.cvtest.randReal(rng).valueOf() * 0.06 - 0.03;
//        if (k[0] * k[1] > 0)
//            k[1] = -k[1];
//        k[2] = alvision.cvtest.randReal(rng).valueOf() * 0.004 - 0.002;
//        k[3] = alvision.cvtest.randReal(rng).valueOf() * 0.004 - 0.002;

//        _a.convertTo(_a0, _a0.depth());
//        _k.convertTo(_k0, _k0.depth());

//        if (dualChannel) {
//            test_mat[REF_OUTPUT][1] = alvision.Scalar.all(0);
//            test_mat[OUTPUT][1] = alvision.Scalar.all(0);
//        }

//        return code;
//    }
//    prepare_to_validation(test_case_idx: alvision.int): void {
//        Mat mapx, mapy;
//        alvision.cvtest.initUndistortMap(test_mat[INPUT][0], test_mat[INPUT][1], test_mat[REF_OUTPUT][0].size(), mapx, mapy);
//        if (!dualChannel) {
//            mapx.copyTo(test_mat[REF_OUTPUT][0]);
//            mapy.copyTo(test_mat[REF_OUTPUT][1]);
//        }
//        else {
//            Mat p[2] = { mapx, mapy };
//            alvision.merge(p, 2, test_mat[REF_OUTPUT][0]);
//        }
//    }
//    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
//        return 1e-3;
//    }
//    fill_array(test_case_idx: alvision.int, i: alvision.int, j: alvision.int, arr: alvision.Mat): void {
//        if (i != INPUT)
//            super.fill_array(test_case_idx, i, j, arr);
//    }

//    private dualChannel: boolean;
//};



//////////////////////////////// GetRectSubPix /////////////////////////////////

//function test_getQuadrangeSubPix(src: alvision.Mat, dst: alvision.Mat ,a  : Array<alvision.double>) : void
//{
//    int sstep = (int)(src.step / sizeof(float));
//    int scols = src.cols, srows = src.rows;

//    CV_Assert( src.depth() == CV_32F && src.type() == dst.type() );

//    int cn = dst.channels();

//    for( int y = 0; y < dst.rows; y++ )
//        for( int x = 0; x < dst.cols; x++ )
//        {
//            float* d = dst.ptr<float>(y) + x*cn;
//            float sx = (float)(a[0]*x + a[1]*y + a[2]);
//            float sy = (float)(a[3]*x + a[4]*y + a[5]);
//            int ix = Math.floor(sx), iy = Math.floor(sy);
//            int dx = cn, dy = sstep;
//            const float* s;
//            sx -= ix; sy -= iy;

//            if( (unsigned)ix >= (unsigned)(scols-1) )
//                ix = ix < 0 ? 0 : scols - 1, sx = 0, dx = 0;
//            if( (unsigned)iy >= (unsigned)(srows-1) )
//                iy = iy < 0 ? 0 : srows - 1, sy = 0, dy = 0;

//            s = src.ptr<float>(iy) + ix*cn;
//            for( int k = 0; k < cn; k++, s++ )
//            {
//                float t0 = s[0] + sx*(s[dx] - s[0]);
//                float t1 = s[dy] + sx*(s[dy + dx] - s[dy]);
//                d[k] = t0 + sy*(t1 - t0);
//            }
//        }
//}


//class CV_GetRectSubPixTest extends CV_ImgWarpBaseTest
//{
//    constructor() {
//        super(false);
//        //spatial_scale_zoom = spatial_scale_decimate;
//        spatial_scale_decimate = spatial_scale_zoom;
//        test_cpp = false;
//    }

//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        var rng = this.ts.get_rng();
//        CV_ImgWarpBaseTest::get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        int src_depth = alvision.cvtest.randInt(rng) % 2, dst_depth;
//        int cn = alvision.cvtest.randInt(rng) % 2 ? 3 : 1;
//        alvision.Size src_size, dst_size;

//        dst_depth = src_depth = src_depth == 0 ? alvision.MatrixType.CV_8U : alvision.MatrixType.CV_32F;
//        if (src_depth < alvision.MatrixType.CV_32F && alvision.cvtest.randInt(rng) % 2)
//            dst_depth = alvision.MatrixType.CV_32F;

//        types[INPUT][0] = CV_MAKETYPE(src_depth, cn);
//        types[INPUT_OUTPUT][0] = types[REF_INPUT_OUTPUT][0] = CV_MAKETYPE(dst_depth, cn);

//        src_size = sizes[INPUT][0];
//        dst_size.width = Math.round(sqrt(alvision.cvtest.randReal(rng).valueOf() * src_size.width) + 1);
//        dst_size.height = Math.round(sqrt(alvision.cvtest.randReal(rng).valueOf() * src_size.height) + 1);
//        dst_size.width = MIN(dst_size.width, src_size.width);
//        dst_size.height = MIN(dst_size.width, src_size.height);
//        sizes[INPUT_OUTPUT][0] = sizes[REF_INPUT_OUTPUT][0] = dst_size;

//        center.x = (float)(alvision.cvtest.randReal(rng).valueOf() * src_size.width);
//        center.y = (float)(alvision.cvtest.randReal(rng).valueOf() * src_size.height);
//        interpolation = CV_INTER_LINEAR;

//        test_cpp = (alvision.cvtest.randInt(rng) & 256) == 0;
//    }
//    run_func(): void {
//        if (!test_cpp)
//            cvGetRectSubPix(test_array[INPUT][0], test_array[INPUT_OUTPUT][0], center);
//        else {
//            alvision.Mat _out = alvision.cvarrToMat(test_array[INPUT_OUTPUT][0]);
//            alvision.getRectSubPix(alvision.cvarrToMat(test_array[INPUT][0]), _out.size(), center, _out, _out.type());
//        }
//    }
//    prepare_test_case(test_case_idx: alvision.int): alvision.int{
//        return CV_ImgWarpBaseTest::prepare_test_case(test_case_idx);
//    }
//    prepare_to_validation(test_case_idx: alvision.int): void {
//        Mat & src0 = test_mat[INPUT][0];
//        Mat & dst0 = test_mat[REF_INPUT_OUTPUT][0];
//        Mat src = src0, dst = dst0;
//        int ftype = alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_32F, src0.channels());
//        double a[] = {
//            1, 0, center.x - dst.cols * 0.5 + 0.5,
//            0, 1, center.y - dst.rows * 0.5 + 0.5
//        };
//        if (src.depth() != alvision.MatrixType.CV_32F)
//            src0.convertTo(src, alvision.MatrixType.CV_32F);

//        if (dst.depth() != alvision.MatrixType.CV_32F)
//            dst.create(dst0.size(), ftype);

//        test_getQuadrangeSubPix(src, dst, a);

//        if (dst.data != dst0.data)
//            dst.convertTo(dst0, dst0.depth());
//    }
//    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
//        int in_depth = test_mat[INPUT][0].depth();
//        int out_depth = test_mat[INPUT_OUTPUT][0].depth();

//        return in_depth >= alvision.MatrixType.CV_32F ? 1e-3 : out_depth >= alvision.MatrixType.CV_32F ? 1e-2 : 1;
//    }
//    fill_array(test_case_idx: alvision.int, i: alvision.int, j: alvision.int, arr: alvision.Mat): void {
//        if (i != INPUT)
//            CV_ImgWarpBaseTest::fill_array(test_case_idx, i, j, arr);
//    }

//    protected CvPoint2D32f center;
//    protected bool test_cpp;
//};



//class CV_GetQuadSubPixTest extends CV_ImgWarpBaseTest
//{
//    constructor() {
//        super(true);
//        //spatial_scale_zoom = spatial_scale_decimate;
//        spatial_scale_decimate = spatial_scale_zoom;
//    }

//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        int min_size = 4;
//        CV_ImgWarpBaseTest::get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        alvision.Size sz = sizes[INPUT][0], dsz;
//        var rng = this.ts.get_rng();
//        int msz, src_depth = alvision.cvtest.randInt(rng) % 2, dst_depth;
//        int cn = alvision.cvtest.randInt(rng) % 2 ? 3 : 1;

//        dst_depth = src_depth = src_depth == 0 ? alvision.MatrixType.CV_8U : alvision.MatrixType.CV_32F;
//        if (src_depth < alvision.MatrixType.CV_32F && alvision.cvtest.randInt(rng) % 2)
//            dst_depth = alvision.MatrixType.CV_32F;

//        types[INPUT][0] = alvision.MatrixType.CV_MAKETYPE(src_depth, cn);
//        types[INPUT_OUTPUT][0] = types[REF_INPUT_OUTPUT][0] = CV_MAKETYPE(dst_depth, cn);

//        sz.width = MAX(sz.width, min_size);
//        sz.height = MAX(sz.height, min_size);
//        sizes[INPUT][0] = sz;
//        msz = MIN(sz.width, sz.height);

//        dsz.width = Math.round(sqrt(alvision.cvtest.randReal(rng).valueOf() * msz) + 1);
//        dsz.height = Math.round(sqrt(alvision.cvtest.randReal(rng).valueOf() * msz) + 1);
//        dsz.width = MIN(dsz.width, msz);
//        dsz.height = MIN(dsz.width, msz);
//        dsz.width = MAX(dsz.width, min_size);
//        dsz.height = MAX(dsz.height, min_size);
//        sizes[INPUT_OUTPUT][0] = sizes[REF_INPUT_OUTPUT][0] = dsz;
//        sizes[INPUT][1] = alvision.Size(3, 2);
//    }
//    run_func(): void {
//        CvMat mtx = test_mat[INPUT][1];
//        cvGetQuadrangleSubPix(test_array[INPUT][0], test_array[INPUT_OUTPUT][0], &mtx);
//    }
//    prepare_test_case(test_case_idx: alvision.int): alvision.int{
//        var rng = this.ts.get_rng();
//        int code = CV_ImgWarpBaseTest::prepare_test_case(test_case_idx);
//        const Mat& src = test_mat[INPUT][0];
//        Mat & mat = test_mat[INPUT][1];
//        CvPoint2D32f center;
//        double scale, angle;

//        if (code <= 0)
//            return code;

//        double a[6];
//        Mat A(2, 3, CV_64FC1, a);

//        center.x = (float)((alvision.cvtest.randReal(rng).valueOf() * 1.2 - 0.1) * src.cols);
//        center.y = (float)((alvision.cvtest.randReal(rng).valueOf() * 1.2 - 0.1) * src.rows);
//        angle = alvision.cvtest.randReal(rng).valueOf() * 360;
//        scale = alvision.cvtest.randReal(rng).valueOf() * 0.2 + 0.9;

//        // y = Ax + b . x = A^-1(y - b) = A^-1*y - A^-1*b
//        scale = 1. / scale;
//        angle = angle * (Math.PI / 180.);
//        a[0] = a[4] = cos(angle) * scale;
//        a[1] = sin(angle) * scale;
//        a[3] = -a[1];
//        a[2] = center.x - a[0] * center.x - a[1] * center.y;
//        a[5] = center.y - a[3] * center.x - a[4] * center.y;
//        A.convertTo(mat, mat.depth());

//        return code;
//    }
//    prepare_to_validation(test_case_idx: alvision.int): void {
//        Mat & src0 = test_mat[INPUT][0];
//        Mat & dst0 = test_mat[REF_INPUT_OUTPUT][0];
//        Mat src = src0, dst = dst0;
//        int ftype = CV_MAKETYPE(CV_32F, src0.channels());
//        double a[6], dx = (dst0.cols - 1) * 0.5, dy = (dst0.rows - 1) * 0.5;
//        Mat A(2, 3, CV_64F, a);

//        if (src.depth() != alvision.MatrixType.CV_32F)
//            src0.convertTo(src, alvision.MatrixType. CV_32F);

//        if (dst.depth() != alvision.MatrixType.CV_32F)
//            dst.create(dst0.size(), ftype);

//        test_mat[INPUT][1].convertTo(A, alvision.MatrixType.CV_64F);
//        a[2] -= a[0] * dx + a[1] * dy;
//        a[5] -= a[3] * dx + a[4] * dy;
//        test_getQuadrangeSubPix(src, dst, a);

//        if (dst.data != dst0.data)
//            dst.convertTo(dst0, dst0.depth());
//    }
//    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
//        int in_depth = test_mat[INPUT][0].depth();
//        //int out_depth = test_mat[INPUT_OUTPUT][0].depth();

//        return in_depth >= alvision.MatrixType.CV_32F ? 1e-2 : 4;
//    }
//};



//alvision.cvtest.TEST('Imgproc_cvWarpAffine', 'regression', () => {
//    IplImage * src = cvCreateImage(alvision.Size(100, 100), IPL_DEPTH_8U, 1);
//    IplImage * dst = cvCreateImage(alvision.Size(100, 100), IPL_DEPTH_8U, 1);

//    float m[6];
//    CvMat M = cvMat(2, 3, alvision.MatrixType.CV_32F, m);
//    int w = src .width;
//    int h = src .height;
//    cv2DRotationMatrix(cvPoint2D32f(w * 0.5, h * 0.5), 45.0, 1.0, &M);
//    cvWarpAffine(src, dst, &M);
//});

//alvision.cvtest.TEST('Imgproc_fitLine_vector_3d', 'regression', () => {
//    Array < Point3f > points_vector;

//    Point3f p21(4, 4, 4);
//    Point3f p22(8, 8, 8);

//    points_vector.push(p21);
//    points_vector.push(p22);

//    Array < float > line;

//    alvision.fitLine(points_vector, line, CV_DIST_L2, 0, 0, 0);

//    ASSERT_EQ(line.size(), (size_t)6);

//});

//alvision.cvtest.TEST('Imgproc_fitLine_vector_2d', 'regression', () => {
//    var points_vector = new Array <alvision. Point2f>();


//    var p21 = new alvision.Point2f(4, 4);
//    var p22 = new alvision.Point2f(8, 8);
//    var p23 = new alvision.Point2f(16, 16);

//    points_vector.push(p21);
//    points_vector.push(p22);
//    points_vector.push(p23);

//    var line = new Array < alvision.float > ;

//    alvision.fitLine(points_vector, line, CV_DIST_L2, 0, 0, 0);

//    ASSERT_EQ(line.size(), (size_t)4);
//});

//alvision.cvtest.TEST('Imgproc_fitLine_Mat_2dC2', 'regression', () => {
//    alvision.Mat mat1 = alvision.Mat.zeros(3, 1, alvision.MatrixType.CV_32SC2);
//    Array < float > line1;

//    alvision.fitLine(mat1, line1, CV_DIST_L2, 0, 0, 0);

//    ASSERT_EQ(line1.size(), (size_t)4);
//});

//alvision.cvtest.TEST('Imgproc_fitLine_Mat_2dC1', 'regression', () => {
//    alvision.Matx < int, 3, 2 > mat2;
//    Array < float > line2;

//    alvision.fitLine(mat2, line2, CV_DIST_L2, 0, 0, 0);

//    ASSERT_EQ(line2.size(), (size_t)4);
//});

//alvision.cvtest.TEST('Imgproc_fitLine_Mat_3dC3', 'regression', () => {
//    alvision.Mat mat1 = alvision.Mat.zeros(2, 1, alvision.MatrixType.CV_32SC3);
//    Array < float > line1;

//    alvision.fitLine(mat1, line1, CV_DIST_L2, 0, 0, 0);

//    ASSERT_EQ(line1.size(), (size_t)6);
//});

//alvision.cvtest.TEST('Imgproc_fitLine_Mat_3dC1', 'regression', () => {
//    alvision.Mat mat2 = alvision.Mat.zeros(2, 3, alvision.MatrixType.CV_32SC1);
//    Array < float > line2;

//    alvision.fitLine(mat2, line2, CV_DIST_L2, 0, 0, 0);

//    ASSERT_EQ(line2.size(), (size_t)6);
//});

//alvision.cvtest.TEST('Imgproc_resize_area', 'regression',()=>
//{
//    var input_data/*[16 * 16]*/ = [
//         90,  94,  80,   3, 231,   2, 186, 245, 188, 165,  10,  19, 201, 169,   8, 228,
//         86,   5, 203, 120, 136, 185,  24,  94,  81, 150, 163, 137,  88, 105, 132, 132,
//        236,  48, 250, 218,  19,  52,  54, 221, 159, 112,  45,  11, 152, 153, 112, 134,
//         78, 133, 136,  83,  65,  76,  82, 250,   9, 235, 148,  26, 236, 179, 200,  50,
//         99,  51, 103, 142, 201,  65, 176,  33,  49, 226, 177, 109,  46,  21,  67, 130,
//         54, 125, 107, 154, 145,  51, 199, 189, 161, 142, 231, 240, 139, 162, 240,  22,
//        231,  86,  79, 106,  92,  47, 146, 156,  36, 207,  71,  33,   2, 244, 221,  71,
//         44, 127,  71, 177,  75, 126,  68, 119, 200, 129, 191, 251,   6, 236, 247,  6,
//        133, 175,  56, 239, 147, 221, 243, 154, 242,  82, 106,  99,  77, 158,  60, 229,
//          2,  42,  24, 174,  27, 198,  14, 204, 246, 251, 141,  31, 114, 163,  29, 147,
//        121,  53,  74,  31, 147, 189,  42,  98, 202,  17, 228, 123, 209,  40,  77,  49,
//        112, 203,  30,  12, 205,  25,  19, 106, 145, 185, 163, 201, 237, 223, 247,  38,
//         33, 105, 243, 117,  92, 179, 204, 248, 160,  90,  73, 126,   2,  41, 213, 204,
//          6, 124, 195, 201, 230, 187, 210, 167,  48,  79, 123, 159, 145, 218, 105, 209,
//        240, 152, 136, 235, 235, 164, 157,  9,  152,  38,  27, 209, 120,  77, 238, 196,
//        240, 233,  10, 241,  90,  67,  12, 79,    0,  43,  58,  27,  83, 199, 190, 182];

//    var expected_data/*[5 * 5]*/ = [
//        120, 100, 151, 101, 130,
//        106, 115, 141, 130, 127,
//         91, 136, 170, 114, 140,
//        104, 122, 131, 147, 133,
//        161, 163,  70, 107, 182
//    ]

//    var src = new alvision.Mat(16, 16,    alvision.MatrixType.CV_16UC1, input_data);
//    var expected = new alvision.Mat(5, 5, alvision.MatrixType.CV_16UC1, expected_data);
//    var actual = new alvision.Mat(expected.size(), expected.type());

//    alvision.resize(src, actual, alvision.Size(), 0.3, 0.3, INTER_AREA);

//    alvision.ASSERT_EQ(actual.type(), expected.type());
//    alvision.ASSERT_EQ(actual.size(), expected.size());

//    Mat diff;
//    absdiff(actual, expected, diff);

//    Mat one_channel_diff = diff; //.reshape(1);

//    float elem_diff = 1.0f;
//    Size dsize = actual.size();
//    bool next = true;
//    for (var dy = 0; dy < dsize.height && next; ++dy)
//    {
//        ushort* eD = expected.ptr<ushort>(dy);
//        ushort* aD = actual.ptr<ushort>(dy);

//        for (int dx = 0; dx < dsize.width && next; ++dx)
//            if (Math.abs(static_cast<float>(aD[dx] - eD[dx])) > elem_diff)
//            {
//                alvision.cvtest.TS.ptr().printf(alvision.cvtest.TSConstants.SUMMARY, "Inf norm: %f\n", static_cast<float>(norm(actual, expected, NORM_INF)));
//                alvision.cvtest.TS.ptr().printf(alvision.cvtest.TSConstants.SUMMARY, "Error in : (%d, %d)\n", dx, dy);

//                const int radius = 3;
//                int rmin = MAX(dy - radius, 0), rmax = MIN(dy + radius, dsize.height);
//                int cmin = MAX(dx - radius, 0), cmax = MIN(dx + radius, dsize.width);

//                console.log("Abs diff:" << std::endl << diff << std::endl;
//                console.log("actual result:\n" << actual(Range(rmin, rmax), Range(cmin, cmax)) << std::endl;
//                console.log("expected result:\n" << expected(Range(rmin, rmax), Range(cmin, cmax)) << std::endl;

//                next = false;
//            }
//    }

//    ASSERT_EQ(alvision.cvtest.norm(one_channel_diff, alvision.NormTypes.NORM_INF), 0);
//});


////////////////////////////////////////////////////////////////////////////

//alvision.cvtest.TEST('Imgproc_Resize', 'accuracy', () => { CV_ResizeTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_WarpAffine', 'accuracy', () => { CV_WarpAffineTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_WarpPerspective', 'accuracy', () => { CV_WarpPerspectiveTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_Remap', 'accuracy', () => { CV_RemapTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_Undistort', 'accuracy', () => { CV_UndistortTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_InitUndistortMap', 'accuracy', () => { CV_UndistortMapTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_GetRectSubPix', 'accuracy',()=> { CV_GetRectSubPixTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_GetQuadSubPix', 'accuracy', () => { CV_GetQuadSubPixTest test; test.safe_run(); });

////////////////////////////////////////////////////////////////////////////

//template <typename T, typename WT>
//struct IntCast
//{
//    T operator() (WT val) const
//    {
//        return alvision.saturate_cast<T>(val >> 2);
//    }
//};

//template <typename T, typename WT>
//struct FltCast
//{
//    T operator() (WT val) const
//    {
//        return alvision.saturate_cast<T>(val * 0.25);
//    }
//};

//template <typename T, typename WT, int one, typename CastOp>
//void resizeArea(const alvision.Mat & src, alvision.Mat & dst)
//{
//    int cn = src.channels();
//    CastOp castOp;

//    for (let y = 0; y < dst.rows; ++y)
//    {
//        const T * sptr0 = src.ptr<T>(y << 1);
//        const T * sptr1 = src.ptr<T>((y << 1) + 1);
//        T * dptr = dst.ptr<T>(y);

//        for (let x = 0; x < dst.cols * cn; x += cn)
//        {
//            int x1 = x << 1;

//            for (int c = 0; c < cn; ++c)
//            {
//                WT sum = WT(sptr0[x1 + c]) + WT(sptr0[x1 + c + cn]);
//                sum += WT(sptr1[x1 + c]) + WT(sptr1[x1 + c + cn]) + (WT)(one);

//                dptr[x + c] = castOp(sum);
//            }
//        }
//    }
//}

//alvision.cvtest.TEST('Resize', 'Area_half',()=>
//{
//    const  size = 1000;
//    var types = [ alvision.MatrixType.CV_8UC1,  alvision.MatrixType.CV_8UC4,
//                    alvision.MatrixType.CV_16UC1, alvision.MatrixType.CV_16UC4,
//                    alvision.MatrixType.CV_16SC1, alvision.MatrixType.CV_16SC3, alvision.MatrixType.CV_16SC4,
//                    alvision.MatrixType.CV_32FC1, alvision.MatrixType.CV_32FC4 ];

//    alvision.RNG rng(17);

//    for (var i = 0, _size = sizeof(types) / sizeof(types[0]); i < _size; ++i)
//    {
//        var type = types[i], depth = CV_MAT_DEPTH(type), cn = CV_MAT_CN(type);
//        const  eps = depth <= alvision.MatrixType.CV_32S ? 0 : 7e-5f;

//        SCOPED_TRACE(depth);
//        SCOPED_TRACE(cn);

//        alvision.Mat src(size, size, type), dst_actual(size >> 1, size >> 1, type),
//            dst_reference(size >> 1, size >> 1, type);

//        rng.fill(src, alvision.DistType.UNIFORM, -1000, 1000, true);

//        if (depth == CV_8U)
//            resizeArea<uchar, ushort, 2, IntCast<uchar, ushort> >(src, dst_reference);
//        else if (depth == alvision.MatrixType.CV_16U)
//            resizeArea<ushort, uint, 2, IntCast<ushort, uint> >(src, dst_reference);
//        else if (depth == alvision.MatrixType.CV_16S)
//            resizeArea<short, int, 2, IntCast<short, int> >(src, dst_reference);
//        else if (depth == alvision.MatrixType.CV_32F)
//            resizeArea<float, float, 0, FltCast<float, float> >(src, dst_reference);
//        else
//            CV_Assert(0);

//        alvision.resize(src, dst_actual, dst_actual.size(), 0, 0, alvision.INTER_AREA);

//        ASSERT_GE(eps, alvision.cvtest.norm(dst_reference, dst_actual, alvision.NormTypes.NORM_INF));
//    }
//});

//alvision.cvtest.TEST('Imgproc_Warp', 'multichannel',()=>
//{
//    var rng = alvision.theRNG();
//    for( var iter = 0; iter < 30; iter++ )
//    {
//        int width = rng.uniform(3, 333);
//        int height = rng.uniform(3, 333);
//        int cn = rng.uniform(1, 10);
//        Mat src(height, width, CV_8UC(cn)), dst;
//        //randu(src, 0, 256);
//        src.setTo(0.);

//        Mat rot = getRotationMatrix2D(Point2f(0.f, 0.f), 1, 1);
//        warpAffine(src, dst, rot, src.size());
//        ASSERT_EQ(0.0, norm(dst, NORM_INF));
//        Mat rot2 = alvision.Mat.eye(3, 3, rot.type());
//        rot.copyTo(rot2.rowRange(0, 2));
//        warpPerspective(src, dst, rot2, src.size());
//        ASSERT_EQ(0.0, norm(dst, NORM_INF));
//    }
//});

//alvision.cvtest.TEST('Imgproc_GetAffineTransform', 'singularity', () => {
//    Point2f A_sample[3];
//    A_sample[0] = new alvision.Point2f(8., 9.);
//    A_sample[1] = new alvision.Point2f(40., 41.);
//    A_sample[2] = new alvision.Point2f(47., 48.);
//    Point2f B_sample[3];
//    B_sample[0] = new alvision.Point2f(7.37465, 11.8295);
//    B_sample[1] = new alvision.Point2f(15.0113, 12.8994);
//    B_sample[2] = new alvision.Point2f(38.9943, 9.56297);
//    Mat trans = getAffineTransform(A_sample, B_sample);
//    ASSERT_EQ(0.0, norm(trans, NORM_INF));
//});

//alvision.cvtest.TEST('Imgproc_Remap', 'DISABLED_memleak',()=>
//{
//    Mat src;
//    const int N = 400;
//    src.create(N, N, alvision.MatrixType.CV_8U);
//    randu(src, 0, 256);
//    Mat map_x, map_y, dst;
//    dst.create( src.size(), src.type() );
//    map_x.create( src.size(), alvision.MatrixType.CV_32FC1 );
//    map_y.create(src.size(), alvision.MatrixType.CV_32FC1 );
//    randu(map_x, 0., N+0.);
//    randu(map_y, 0., N+0.);

//    for( int iter = 0; iter < 10000; iter++ )
//    {
//        if(iter % 100 == 0)
//        {
//            putchar('.');
//            fflush(stdout);
//        }
//        remap(src, dst, map_x, map_y, CV_INTER_LINEAR);
//    }
//});

///* End of file. */
