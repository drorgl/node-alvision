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
//import colors = require("colors");
//import async = require("async");
//import alvision = require("../../../tsbinding/alvision");
//import util = require('util');
//import fs = require('fs');

////#include "test_precomp.hpp"
////
////#include <cmath>
////#include <vector>
////#include <iostream>
////
////using namespace cv;

////namespace
////{
//function __wrap_printf_func(format: any, ...param: any[]): void {
//    alvision.cvtest.TS.ptr().printf(alvision.cvtest.TSConstants.SUMMARY, util.format(format, param));
//}

//var PRINT_TO_LOG = __wrap_printf_func;

//    //#define PRINT_TO_LOG __wrap_printf_func
////}
////
////#define SHOW_IMAGE
////#undef SHOW_IMAGE

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//// ImageWarpBaseTest
//////////////////////////////////////////////////////////////////////////////////////////////////////////

//class CV_ImageWarpBaseTest extends alvision.cvtest.BaseTest {
//    private cell_size = 10;

//    constructor() {
//        super();
//        this.interpolation = (-1);
//        this.src = new alvision.Mat();
//        this.dst = new alvision.Mat();
//        this.reference_dst = new alvision.Mat();
//        this.test_case_count = 40;
//        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
//    }

//    run(iii: alvision.int): void {
//        for (var i = 0; i < this.test_case_count; ++i) {
//            this.generate_test_data();
//            this.run_func();
//            this.run_reference_func();
//            if (this.ts.get_err_code() < 0)
//                break;
//            this.validate_results();
//            if (this.ts.get_err_code() < 0)
//                break;
//            this.ts.update_context(this, i, true);
//        }
//        this.ts.set_gtest_status();
//    }

//    generate_test_data(): void {
//        var rng = this.ts.get_rng();

//        // generating the src matrix structure
//        var ssize = this.randSize(rng), dsize: alvision.Size;

//        var depth = rng.uniform(0, alvision.MatrixType.CV_64F);
//        while (depth == alvision.MatrixType.CV_8S || depth == alvision.MatrixType.CV_32S)
//            depth = rng.uniform(0, alvision.MatrixType.CV_64F);

//        var cn = rng.uniform(1, 4);
//        while (cn == 2)
//            cn = rng.uniform(1, 4);

//        this.src.create(ssize, alvision.MatrixType.CV_MAKETYPE(depth, cn));

//        // generating the src matrix
//        //int x, y;
//        if (alvision.cvtest.randInt(rng).valueOf() % 2) {
//            for (var y = 0; y < ssize.height; y += this.cell_size)
//                for (var x = 0; x < ssize.width; x += this.cell_size)
//                    alvision.rectangle(this.src, new alvision.Point(x, y), new alvision.Point(x + Math.min(this.cell_size, ssize.width.valueOf() - x), y +
//                        Math.min(this.cell_size, ssize.height.valueOf() - y)), alvision.Scalar.all((x + y) % 2 ? 255 : 0), alvision.CV_FILLED);
//        }
//        else {
//            this.src.setTo(alvision.Scalar.all(255));
//            for (var y = this.cell_size; y < this.src.rows; y += this.cell_size)
//                alvision.line(this.src, new alvision.Point2i(0, y), new alvision.Point2i(this.src.cols, y), alvision.Scalar.all(0), 1);
//            for (var x = this.cell_size; x < this.src.cols; x += this.cell_size)
//                alvision.line(this.src, new alvision.Point2i(x, 0), new alvision.Point2i(x, this.src.rows), alvision.Scalar.all(0), 1);
//        }

//        // generating an interpolation type
//        this.interpolation = rng.uniform(0, alvision.InterpolationFlags.INTER_LANCZOS4 + 1);

//        // generating the dst matrix structure
//        var scale_x: alvision.double, scale_y: alvision.double;
//        if (interpolation == alvision.InterpolationFlags.INTER_AREA) {
//            var area_fast = rng.uniform(0., 1.) > 0.5;
//            if (area_fast) {
//                scale_x = rng.uniform(2, 5);
//                scale_y = rng.uniform(2, 5);
//            }
//            else {
//                scale_x = rng.uniform(1.0, 3.0);
//                scale_y = rng.uniform(1.0, 3.0);
//            }
//        }
//        else {
//            scale_x = rng.uniform(0.4, 4.0);
//            scale_y = rng.uniform(0.4, 4.0);
//        }
//        alvision.CV_Assert(()=>scale_x.valueOf() > 0.0 && scale_y.valueOf() > 0.0);

//        dsize.width =  alvision.saturate_cast<alvision.int>((ssize.width.valueOf() +  scale_x.valueOf() - 1) / scale_x.valueOf() ,"int");
//        dsize.height = alvision.saturate_cast<alvision.int>((ssize.height.valueOf() + scale_y.valueOf() - 1) / scale_y.valueOf(),"int");

//        this.dst = alvision.Mat.zeros(dsize, this.src.type()).toMat();
//        reference_dst = alvision.Mat.zeros(dst.size(), alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_32F, dst.channels()));

//        scale_x = src.cols / static_cast<double>(dst.cols);
//        scale_y = src.rows / static_cast<double>(dst.rows);

//        if (interpolation == INTER_AREA && (scale_x < 1.0 || scale_y < 1.0))
//            interpolation = INTER_LINEAR;
//    }

//    run_func(): void { }
//    run_reference_func(): void { }
//    validate_results(): void {
//        var _dst = new alvision.Mat();
//        this.dst.convertTo(_dst, reference_dst.depth());

//        var dsize = dst.size(), ssize = src.size();
//        var cn = _dst.channels();
//        dsize.width *= cn;
//        var t = 1.0;
//        if (interpolation == INTER_CUBIC)
//            t = 1.0;
//        else if (interpolation == INTER_LANCZOS4)
//            t = 1.0;
//        else if (interpolation == INTER_NEAREST)
//            t = 1.0;
//        else if (interpolation == INTER_AREA)
//            t = 2.0;

//        for (var dy = 0; dy < dsize.height; ++dy) {
//            const rD = reference_dst.ptr<alvision.float>("float", dy);
//            const D = _dst.ptr<alvision.float>("float", dy);

//            for (var dx = 0; dx < dsize.width; ++dx)
//                if (Math.abs(rD[dx] - D[dx]) > t &&
//                    //                Math.abs(rD[dx] - D[dx]) < 250.0f &&
//                    rD[dx] <= 255.0 && D[dx] <= 255.0 && rD[dx] >= 0.0 && D[dx] >= 0.0) {
//                    PRINT_TO_LOG("\nNorm of the difference: %lf\n", alvision.cvtest.norm(reference_dst, _dst, alvision.NormTypes.NORM_INF));
//                    PRINT_TO_LOG("Error in (dx, dy): (%d, %d)\n", dx / cn + 1, dy + 1);
//                    PRINT_TO_LOG("Tuple (rD, D): (%f, %f)\n", rD[dx], D[dx]);
//                    PRINT_TO_LOG("Dsize: (%d, %d)\n", dsize.width / cn, dsize.height);
//                    PRINT_TO_LOG("Ssize: (%d, %d)\n", src.cols, src.rows);

//                    double scale_x = static_cast<double>(ssize.width) / dsize.width;
//                    double scale_y = static_cast<double>(ssize.height) / dsize.height;
//                    bool area_fast = interpolation == INTER_AREA &&
//                        Math.abs(scale_x - Math.round(scale_x)) < FLT_EPSILON &&
//                        Math.abs(scale_y - Math.round(scale_y)) < FLT_EPSILON;
//                    if (area_fast) {
//                        scale_y = Math.round(scale_y);
//                        scale_x = Math.round(scale_x);
//                    }

//                    PRINT_TO_LOG("Interpolation: %s\n", interpolation_to_string(area_fast ? INTER_LANCZOS4 + 1 : interpolation));
//                    PRINT_TO_LOG("Scale (x, y): (%lf, %lf)\n", scale_x, scale_y);
//                    PRINT_TO_LOG("Elemsize: %d\n", src.elemSize1());
//                    PRINT_TO_LOG("Channels: %d\n", cn);

//                    //#ifdef SHOW_IMAGE
//                    var w1 = "OpenCV impl (run func)", w2 = "Reference func", w3 = "Src image", w4 = "Diff";
//                    alvision.namedWindow(w1, alvision.WindowFlags.WINDOW_KEEPRATIO);
//                    alvision.namedWindow(w2, alvision.WindowFlags.WINDOW_KEEPRATIO);
//                    alvision.namedWindow(w3, alvision.WindowFlags.WINDOW_KEEPRATIO);
//                    alvision.namedWindow(w4, alvision.WindowFlags.WINDOW_KEEPRATIO);

//                    var diff = new alvision.Mat();
//                    alvision.absdiff(reference_dst, _dst, diff);

//                    alvision.imshow(w1, this.dst);
//                    alvision.imshow(w2, this.reference_dst);
//                    alvision.imshow(w3, this.src);
//                    alvision.imshow(w4, diff);

//                    alvision.waitKey();
//                    //#endif

//                    const radius = 3;
//                    var rmin = Math.max(dy - radius, 0), rmax = Math.min(dy + radius, dsize.height);
//                    var cmin = Math.max(dx / cn - radius, 0), cmax = Math.min(dx / cn + radius, dsize.width);

//                    PRINT_TO_LOG("opencv result:\n" + dst(new alvision.Range(rmin, rmax), new alvision.Range(cmin, cmax)));
//                    PRINT_TO_LOG("reference result:\n" + reference_dst(new alvision.Range(rmin, rmax), new alvision.Range(cmin, cmax)));

//                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
//                    return;
//                }
//        }
//    }
//    prepare_test_data_for_reference_func(): void {
//        if (src.depth() != alvision.MatrixType.CV_32F) {
//            Mat tmp;
//            src.convertTo(tmp, alvision.MatrixType.CV_32F);
//            src = tmp;
//        }

//    }

//    randSize(rng: alvision.RNG): alvision.Size {
//        var size = new alvision.Size();
//        size.width = static_cast<int>(Math.exp(rng.uniform(1.0, 7.0).valueOf()));
//        size.height = static_cast<int>(Math.exp(rng.uniform(1.0, 7.0).valueOf()));

//        return size;
//    }

//    interpolation_to_string(inter_type: alvision.int): string {
//        var inverse = (inter & WARP_INVERSE_MAP) != 0;
//        inter &= ~WARP_INVERSE_MAP;

//        var str: string = "";

//        if (inter == INTER_NEAREST)
//            str = "INTER_NEAREST";
//        else if (inter == INTER_LINEAR)
//            str = "INTER_LINEAR";
//        else if (inter == INTER_AREA)
//            str = "INTER_AREA";
//        else if (inter == INTER_CUBIC)
//            str = "INTER_CUBIC";
//        else if (inter == INTER_LANCZOS4)
//            str = "INTER_LANCZOS4";
//        else if (inter == INTER_LANCZOS4 + 1)
//            str = "INTER_AREA_FAST";

//        if (inverse)
//            str += " | WARP_INVERSE_MAP";

//        return str =="" ? "Unsupported/Unkown interpolation type" : str;
//    }

//    protected interpolation: alvision.int;
//    protected src: alvision.Mat;
//    protected dst: alvision.Mat;
//    protected reference_dst: alvision.Mat;
//}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
//// Resize
//////////////////////////////////////////////////////////////////////////////////////////////////////////

//class CV_Resize_Test extends CV_ImageWarpBaseTest
//{
//    constructor() {
//        super();
//        this.scale_x = ();
//        this.scale_y = ();
//        this.area_fast = (false);
//    }

//    generate_test_data(): void{
//        super.generate_test_data();

//        this.scale_x = this.src.cols.valueOf() / (this.dst.cols.valueOf());
//        this.scale_y = this.src.rows.valueOf() / (this.dst.rows.valueOf());

//        this.area_fast = this.interpolation == INTER_AREA &&
//            Math.abs(this.scale_x.valueOf() - Math.round(this.scale_x.valueOf())) < alvision.FLT_EPSILON &&
//            Math.abs(this.scale_y.valueOf() - Math.round(this.scale_y.valueOf())) < alvision.FLT_EPSILON;
//        if (this.area_fast) {
//            this.scale_x = Math.round(this.scale_x.valueOf());
//            this.scale_y = Math.round(this.scale_y.valueOf());
//        }
//    }

//    run_func() : void {}
//    run_reference_func: void(){}

//    private scale_x : alvision.double;
//    private scale_y: alvision.double ;
//    private area_fast : boolean;

//    resize_generic(): void { }
//    resize_area(): void { }
//    getWeight(a: alvision.double, b: alvision.double, x: alvision.int ): alvision.double { }

//    typedef Array<alvision.pair<int, double> > dim;
//    void generate_buffer(double scale, dim& _dim);
//    void resize_1d(const Mat& _src, Mat& _dst, int dy, const dim& _dim);
//};


//    function interpolateLinear(x : alvision.float, coeffs : Array<alvision.float>) : void
//    {
//        coeffs[0] = 1. - x.valueOf();
//        coeffs[1] = x.valueOf();
//    }

//    function interpolateCubic(x: alvision.float , coeffs : Array<alvision.float>) : void
//    {
//        const A = -0.75;

//        coeffs[0] = ((A*(x.valueOf() + 1) - 5*A)*(x.valueOf() + 1) + 8*A)*(x.valueOf() + 1) - 4*A;
//        coeffs[1] = ((A + 2)*x.valueOf() - (A + 3))*x.valueOf()*x.valueOf() + 1;
//        coeffs[2] = ((A + 2)*(1 - x.valueOf()) - (A + 3))*(1 - x.valueOf())*(1 - x.valueOf()) + 1;
//        coeffs[3] = 1. - coeffs[0].valueOf() - coeffs[1].valueOf() - coeffs[2].valueOf();
//    }

//    function interpolateLanczos4(x : alvision.float, coeffs : Array<alvision.float>) : void
//    {
//        static const  s45 = 0.70710678118654752440084436210485;
//        static const  cs=
//        [[1, 0], [-s45, -s45], [0, 1], [s45, -s45], [-1, 0], [s45, s45], [0, -1], [-s45, s45]];

//        if( x < alvision.FLT_EPSILON )
//        {
//            for( var i = 0; i < 8; i++ )
//                coeffs[i] = 0;
//            coeffs[3] = 1;
//            return;
//        }

//        var sum = 0;
//        var y0=-(x.valueOf()+3)*Math.PI*0.25, s0 = Math.sin(y0), c0=Math.cos(y0);
//        for(var i = 0; i < 8; i++ )
//        {
//            var y = -(x.valueOf()+3-i)*Math.PI*0.25;
//            coeffs[i] = ((cs[i][0]*s0 + cs[i][1]*c0)/(y*y));
//            sum += coeffs[i].valueOf();
//        }

//        sum = 1./sum;
//        for (var i = 0; i < 8; i++)
//            coeffs[i] = coeffs[i].valueOf() * sum;
//    }

//    //typedef void (*interpolate_method)(float x, float* coeffs);
//    var inter_array: Array<interpolate_method>  = [ interpolateLinear, interpolateCubic, interpolateLanczos4 ];
////}
//    interface interpolate_method {
//        (x: alvision.float , coeffs : Array<alvision.float>): void;
//    }



//void CV_Resize_Test::run_func()
//{
//    alvision.resize(src, dst, dst.size(), 0, 0, interpolation);
//}

//void CV_Resize_Test::run_reference_func()
//{
//    CV_ImageWarpBaseTest::prepare_test_data_for_reference_func();

//    if (interpolation == INTER_AREA)
//        resize_area();
//    else
//        resize_generic();
//}

//double CV_Resize_Test::getWeight(double a, double b, int x)
//{
//    double w = Math.min(static_cast<double>(x + 1), b) - Math.max(static_cast<double>(x), a);
//    alvision.CV_Assert(w >= 0);
//    return w;
//}

//void CV_Resize_Test::resize_area()
//{
//    Size ssize = src.size(), dsize = reference_dst.size();
//    alvision.CV_Assert(ssize.area() > 0 && dsize.area() > 0);
//    var cn = src.channels();

//    alvision.CV_Assert(scale_x >= 1.0 && scale_y >= 1.0);

//    double fsy0 = 0, fsy1 = scale_y;
//    for (int dy = 0; dy < dsize.height; ++dy)
//    {
//        float* yD = reference_dst.ptr<float>(dy);
//        int isy0 = Math.floor(fsy0), isy1 = Math.min(Math.floor(fsy1), ssize.height - 1);
//        alvision.CV_Assert(isy1 <= ssize.height && isy0 < ssize.height);

//        double fsx0 = 0, fsx1 = scale_x;

//        for (var dx = 0; dx < dsize.width; ++dx)
//        {
//            float* xyD = yD + cn * dx;
//            int isx0 = Math.floor(fsx0), isx1 = Math.min(ssize.width - 1, Math.floor(fsx1));

//            alvision.CV_Assert(isx1 <= ssize.width);
//            alvision.CV_Assert(isx0 < ssize.width);

//            // for each pixel of dst
//            for (var r = 0; r < cn; ++r)
//            {
//                xyD[r] = 0.0f;
//                double area = 0.0;
//                for (var sy = isy0; sy <= isy1; ++sy)
//                {
//                    const float* yS = src.ptr<float>(sy);
//                    for (int sx = isx0; sx <= isx1; ++sx)
//                    {
//                        double wy = getWeight(fsy0, fsy1, sy);
//                        double wx = getWeight(fsx0, fsx1, sx);
//                        double w = wx * wy;
//                        xyD[r] += static_cast<float>(yS[sx * cn + r] * w);
//                        area += w;
//                    }
//                }

//                alvision.CV_Assert(area != 0);
//                // norming pixel
//                xyD[r] = static_cast<float>(xyD[r] / area);
//            }
//            fsx1 = Math.min((fsx0 = fsx1) + scale_x, static_cast<double>(ssize.width));
//        }
//        fsy1 = Math.min((fsy0 = fsy1) + scale_y, static_cast<double>(ssize.height));
//    }
//}

//// for interpolation type : INTER_LINEAR, INTER_LINEAR, INTER_CUBIC, INTER_LANCZOS4
//void CV_Resize_Test::resize_1d(const Mat& _src, Mat& _dst, int dy, const dim& _dim)
//{
//    Size dsize = _dst.size();
//    int cn = _dst.channels();
//    float* yD = _dst.ptr<float>(dy);

//    if (interpolation == INTER_NEAREST) {
//        const float* yS = _src.ptr<float>(dy);
//        for (var dx = 0; dx < dsize.width; ++dx) {
//            int isx = _dim[dx].first;
//            const float* xyS = yS + isx * cn;
//            float * xyD = yD + dx * cn;

//            for (int r = 0; r < cn; ++r)
//            xyD[r] = xyS[r];
//        }
//    }
//    else if (interpolation == INTER_LINEAR || interpolation == INTER_CUBIC || interpolation == INTER_LANCZOS4) {
//        interpolate_method inter_func = inter_array[interpolation - (interpolation == INTER_LANCZOS4 ? 2 : 1)];
//        size_t elemsize = _src.elemSize();

//        int ofs = 0, ksize = 2;
//        if (interpolation == INTER_CUBIC)
//            ofs = 1, ksize = 4;
//        else if (interpolation == INTER_LANCZOS4)
//            ofs = 3, ksize = 8;

//        Mat _extended_src_row(1, _src.cols + ksize * 2, _src.type());
//        const uchar* srow = _src.ptr(dy);
//        memcpy(_extended_src_row.ptr() + elemsize * ksize, srow, _src.step);
//        for (int k = 0; k < ksize; ++k)
//        {
//            memcpy(_extended_src_row.ptr() + k * elemsize, srow, elemsize);
//            memcpy(_extended_src_row.ptr() + (ksize + k) * elemsize + _src.step, srow + _src.step - elemsize, elemsize);
//        }

//        for (int dx = 0; dx < dsize.width; ++dx)
//        {
//            int isx = _dim[dx].first;
//            double fsx = _dim[dx].second;

//            float * xyD = yD + dx * cn;
//            const float* xyS = _extended_src_row.ptr<float>(0) + (isx + ksize - ofs) * cn;

//            float w[8];
//            inter_func(static_cast<float>(fsx), w);

//            for (int r = 0; r < cn; ++r)
//            {
//                xyD[r] = 0;
//                for (int k = 0; k < ksize; ++k)
//                xyD[r] += w[k] * xyS[k * cn + r];
//            }
//        }
//    }
//    else
//        alvision.CV_Assert(0);
//}

//void CV_Resize_Test::generate_buffer(double scale, dim& _dim)
//{
//    size_t length = _dim.size();
//    for (size_t dx = 0; dx < length; ++dx)
//    {
//        double fsx = scale * (dx + 0.5) - 0.5;
//        int isx = Math.floor(fsx);
//        _dim[dx] = std::make_pair(isx, fsx - isx);
//    }
//}

//void CV_Resize_Test::resize_generic()
//{
//    Size dsize = reference_dst.size(), ssize = src.size();
//    alvision.CV_Assert(dsize.area() > 0 && ssize.area() > 0);

//    dim dims[] = { dim(dsize.width), dim(dsize.height) };
//    if (interpolation == INTER_NEAREST)
//    {
//        for (int dx = 0; dx < dsize.width; ++dx)
//            dims[0][dx].first = Math.min(Math.floor(dx * scale_x), ssize.width - 1);
//        for (int dy = 0; dy < dsize.height; ++dy)
//            dims[1][dy].first = Math.min(Math.floor(dy * scale_y), ssize.height - 1);
//    }
//    else
//    {
//        generate_buffer(scale_x, dims[0]);
//        generate_buffer(scale_y, dims[1]);
//    }

//    Mat tmp(ssize.height, dsize.width, reference_dst.type());
//    for (int dy = 0; dy < tmp.rows; ++dy)
//        resize_1d(src, tmp, dy, dims[0]);

//    transpose(tmp, tmp);
//    transpose(reference_dst, reference_dst);

//    for (int dy = 0; dy < tmp.rows; ++dy)
//        resize_1d(tmp, reference_dst, dy, dims[1]);
//    transpose(reference_dst, reference_dst);
//}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//// remap
//////////////////////////////////////////////////////////////////////////////////////////////////////////

//class CV_Remap_Test :
//    public CV_ImageWarpBaseTest
//{
//public:
//    CV_Remap_Test();

//    virtual ~CV_Remap_Test();

//private:
//    typedef void (CV_Remap_Test::*remap_func)(const Mat&, Mat&);

//protected:
//    virtual void generate_test_data();
//    virtual void prepare_test_data_for_reference_func();

//    virtual run_func() : void {}
//    virtual void run_reference_func();

//    Mat mapx, mapy;
//    int borderType;
//    Scalar borderValue;

//    remap_func funcs[2];

//private:
//    void remap_nearest(const Mat&, Mat&);
//    void remap_generic(const Mat&, Mat&);

//    void convert_maps();
//    const char* borderType_to_string() const;
//    virtual void validate_results() const;
//};

//CV_Remap_Test::CV_Remap_Test() :
//    CV_ImageWarpBaseTest(), mapx(), mapy(),
//    borderType(-1), borderValue()
//{
//    funcs[0] = &CV_Remap_Test::remap_nearest;
//    funcs[1] = &CV_Remap_Test::remap_generic;
//}

//CV_Remap_Test::~CV_Remap_Test()
//{
//}

//void CV_Remap_Test::generate_test_data()
//{
//    CV_ImageWarpBaseTest::generate_test_data();

//    var rng = this.ts.get_rng();
//    borderType = rng.uniform(1, BORDER_WRAP);
//    borderValue = Scalar.all(rng.uniform(0, 255));

//    // generating the mapx, mapy matrices
//    const  mapx_types = [ alvision.MatrixType.CV_16SC2, alvision.MatrixType.CV_32FC1, alvision.MatrixType.CV_32FC2 ];
//    mapx.create(dst.size(), mapx_types[rng.uniform(0, sizeof(mapx_types) / sizeof(int))]);
//    mapy = Mat();

//    const int n = Math.min(Math.min(src.cols, src.rows) / 10 + 1, 2);
//    float _n = 0; //static_cast<float>(-n);

//    switch (mapx.type())
//    {
//        case alvision.MatrixType.CV_16SC2:
//        {
//            MatIterator_<Vec2s> begin_x = mapx.begin<Vec2s>(), end_x = mapx.end<Vec2s>();
//            for ( ; begin_x != end_x; ++begin_x)
//            {
//                (*begin_x)[0] = static_cast<short>(rng.uniform(static_cast<int>(_n), Math.max(src.cols + n - 1, 0)));
//                (*begin_x)[1] = static_cast<short>(rng.uniform(static_cast<int>(_n), Math.max(src.rows + n - 1, 0)));
//            }

//            if (interpolation != INTER_NEAREST)
//            {
//                const  mapy_types = [ alvision.MatrixType.CV_16UC1, alvision.MatrixType.CV_16SC1 ];
//                mapy.create(dst.size(), mapy_types[rng.uniform(0, sizeof(mapy_types) / sizeof(int))]);

//                switch (mapy.type())
//                {
//                    case alvision.MatrixType.CV_16UC1:
//                    {
//                        MatIterator_<ushort> begin_y = mapy.begin<ushort>(), end_y = mapy.end<ushort>();
//                        for ( ; begin_y != end_y; ++begin_y)
//                            begin_y[0] = static_cast<short>(rng.uniform(0, 1024));
//                    }
//                    break;

//                    case alvision.MatrixType.CV_16SC1:
//                    {
//                        MatIterator_<short> begin_y = mapy.begin<short>(), end_y = mapy.end<short>();
//                        for ( ; begin_y != end_y; ++begin_y)
//                            begin_y[0] = static_cast<short>(rng.uniform(0, 1024));
//                    }
//                    break;
//                }
//            }
//        }
//        break;

//        case alvision.MatrixType.CV_32FC1:
//        {
//                mapy.create(dst.size(), alvision.MatrixType.CV_32FC1);
//            float fscols = static_cast<float>(Math.max(src.cols - 1 + n, 0)),
//                    fsrows = static_cast<float>(Math.max(src.rows - 1 + n, 0));
//            MatIterator_<float> begin_x = mapx.begin<float>(), end_x = mapx.end<float>();
//            MatIterator_<float> begin_y = mapy.begin<float>();
//            for ( ; begin_x != end_x; ++begin_x, ++begin_y)
//            {
//                begin_x[0] = rng.uniform(_n, fscols);
//                begin_y[0] = rng.uniform(_n, fsrows);
//            }
//        }
//        break;

//        case alvision.MatrixType.CV_32FC2:
//        {
//            float fscols = static_cast<float>(Math.max(src.cols - 1 + n, 0)),
//                    fsrows = static_cast<float>(Math.max(src.rows - 1 + n, 0));
//            int width = mapx.cols << 1;

//            for (let y = 0; y < mapx.rows; ++y)
//            {
//                float * ptr = mapx.ptr<float>(y);

//                for (let x = 0; x < width; x += 2)
//                {
//                    ptr[x] = rng.uniform(_n, fscols);
//                    ptr[x + 1] = rng.uniform(_n, fsrows);
//                }
//            }
//        }
//        break;

//        default:
//            alvision.CV_Assert(0);
//        break;
//    }
//}

//void CV_Remap_Test::run_func()
//{
//    remap(src, dst, mapx, mapy, interpolation, borderType, borderValue);
//}

//void CV_Remap_Test::convert_maps()
//{
//    if (mapx.type() != alvision.MatrixType.CV_16SC2)
//        convertMaps(mapx.clone(), mapy.clone(), mapx, mapy, alvision.MatrixType.CV_16SC2, interpolation == INTER_NEAREST);
//    else if (interpolation != INTER_NEAREST)
//        if (mapy.type() != alvision.MatrixType.CV_16UC1)
//            mapy.clone().convertTo(mapy, alvision.MatrixType.CV_16UC1);

//    if (interpolation == INTER_NEAREST)
//        mapy = Mat();
//    alvision.CV_Assert(((interpolation == INTER_NEAREST && mapy.empty()) || mapy.type() == alvision.MatrixType.CV_16UC1 ||
//        mapy.type() == alvision.MatrixType.CV_16SC1) && mapx.type() == alvision.MatrixType.CV_16SC2);
//}

//const char* CV_Remap_Test::borderType_to_string() const
//{
//    if (borderType == BORDER_CONSTANT)
//        return "BORDER_CONSTANT";
//    if (borderType == BORDER_REPLICATE)
//        return "BORDER_REPLICATE";
//    if (borderType == BORDER_REFLECT)
//        return "BORDER_REFLECT";
//    if (borderType == BORDER_WRAP)
//        return "BORDER_WRAP";
//    if (borderType == BORDER_REFLECT_101)
//        return "BORDER_REFLECT_101";
//    return "Unsupported/Unkown border type";
//}

//void CV_Remap_Test::prepare_test_data_for_reference_func()
//{
//    CV_ImageWarpBaseTest::prepare_test_data_for_reference_func();
//    convert_maps();
///*
//    const int ksize = 3;
//    Mat kernel = getStructuringElement(CV_MOP_ERODE, Size(ksize, ksize));
//    Mat mask(src.size(), CV_8UC1, Scalar.all(255)), dst_mask;
//    alvision.erode(src, erode_src, kernel);
//    alvision.erode(mask, dst_mask, kernel, Point(-1, -1), 1, BORDER_CONSTANT, alvision.Scalar.all(0));
//    bitwise_not(dst_mask, mask);
//    src.copyTo(erode_src, mask);
//    dst_mask.release();

//    mask = alvision.Scalar.all(0);
//    kernel = getStructuringElement(CV_MOP_DILATE, kernel.size());
//    alvision.dilate(src, dilate_src, kernel);
//    alvision.dilate(mask, dst_mask, kernel, Point(-1, -1), 1, BORDER_CONSTANT, Scalar.all(255));
//    src.copyTo(dilate_src, dst_mask);
//    dst_mask.release();
//*/
//}

//void CV_Remap_Test::run_reference_func()
//{
//    prepare_test_data_for_reference_func();

//    if (interpolation == INTER_AREA)
//        interpolation = INTER_LINEAR;

//    int index = interpolation == INTER_NEAREST ? 0 : 1;
//    (this.*funcs[index])(src, reference_dst);
//}

//void CV_Remap_Test::remap_nearest(const Mat& _src, Mat& _dst)
//{
//    CV_Assert(_src.depth() == alvision.MatrixType.CV_32F && _dst.type() == _src.type());
//CV_Assert(mapx.type() == alvision.MatrixType.CV_16SC2 && mapy.empty());

//    Size ssize = _src.size(), dsize = _dst.size();
//    CV_Assert(ssize.area() > 0 && dsize.area() > 0);
//    int cn = _src.channels();

//    for (int dy = 0; dy < dsize.height; ++dy)
//    {
//        const short* yM = mapx.ptr<short>(dy);
//        float* yD = _dst.ptr<float>(dy);

//        for (int dx = 0; dx < dsize.width; ++dx)
//        {
//            float* xyD = yD + cn * dx;
//            int sx = yM[dx * 2], sy = yM[dx * 2 + 1];

//            if (sx >= 0 && sx < ssize.width && sy >= 0 && sy < ssize.height)
//            {
//                const float *xyS = _src.ptr<float>(sy) + sx * cn;

//                for (int r = 0; r < cn; ++r)
//                    xyD[r] = xyS[r];
//            }
//            else if (borderType != BORDER_TRANSPARENT)
//            {
//                if (borderType == BORDER_CONSTANT)
//                    for (int r = 0; r < cn; ++r)
//                        xyD[r] = alvision.saturate_cast<float>(borderValue[r]);
//                else
//                {
//                    sx = borderInterpolate(sx, ssize.width, borderType);
//                    sy = borderInterpolate(sy, ssize.height, borderType);
//                    CV_Assert(sx >= 0 && sy >= 0 && sx < ssize.width && sy < ssize.height);

//                    const float *xyS = _src.ptr<float>(sy) + sx * cn;

//                    for (int r = 0; r < cn; ++r)
//                        xyD[r] = xyS[r];
//                }
//            }
//        }
//    }
//}

//void CV_Remap_Test::remap_generic(const Mat& _src, Mat& _dst)
//{
//    CV_Assert(mapx.type() == alvision.MatrixType.CV_16SC2 && mapy.type() == alvision.MatrixType.CV_16UC1);

//    int ksize = 2;
//    if (interpolation == INTER_CUBIC)
//        ksize = 4;
//    else if (interpolation == INTER_LANCZOS4)
//        ksize = 8;
//    else if (interpolation != INTER_LINEAR)
//        assert(0);
//    int ofs = (ksize / 2) - 1;

//    CV_Assert(_src.depth() == alvision.MatrixType.CV_32F && _dst.type() == _src.type());
//    Size ssize = _src.size(), dsize = _dst.size();
//    int cn = _src.channels(), width1 = Math.max(ssize.width - ksize + 1, 0),
//        height1 = Math.max(ssize.height - ksize + 1, 0);

//    float ix[8], w[16];
//    interpolate_method inter_func = inter_array[interpolation - (interpolation == INTER_LANCZOS4 ? 2 : 1)];

//    for (int dy = 0; dy < dsize.height; ++dy)
//    {
//        const short* yMx = mapx.ptr<short>(dy);
//        const ushort* yMy = mapy.ptr<ushort>(dy);

//        float* yD = _dst.ptr<float>(dy);

//        for (int dx = 0; dx < dsize.width; ++dx)
//        {
//            float* xyD = yD + dx * cn;
//            float sx = yMx[dx * 2], sy = yMx[dx * 2 + 1];
//            int isx = Math.floor(sx), isy = Math.floor(sy);

//            inter_func((yMy[dx] & (INTER_TAB_SIZE - 1)) / static_cast<float>(INTER_TAB_SIZE), w);
//            inter_func(((yMy[dx] >> INTER_BITS) & (INTER_TAB_SIZE - 1)) / static_cast<float>(INTER_TAB_SIZE), w + ksize);

//            isx -= ofs;
//            isy -= ofs;

//            if (isx >= 0 && isx < width1 && isy >= 0 && isy < height1)
//            {
//                for (int r = 0; r < cn; ++r)
//                {
//                    for (let y = 0; y < ksize; ++y)
//                    {
//                        const float* xyS = _src.ptr<float>(isy + y) + isx * cn;

//                        ix[y] = 0;
//                        for (let i = 0; i < ksize; ++i)
//                            ix[y] += w[i] * xyS[i * cn + r];
//                    }
//                    xyD[r] = 0;
//                    for (let i = 0; i < ksize; ++i)
//                        xyD[r] += w[ksize + i] * ix[i];
//                }
//            }
//            else if (borderType != BORDER_TRANSPARENT)
//            {
//                int ar_x[8], ar_y[8];

//                for (int k = 0; k < ksize; k++)
//                {
//                    ar_x[k] = borderInterpolate(isx + k, ssize.width, borderType) * cn;
//                    ar_y[k] = borderInterpolate(isy + k, ssize.height, borderType);
//                }

//                for (int r = 0; r < cn; r++)
//                {
//                    xyD[r] = 0;
//                    for (let i = 0; i < ksize; ++i)
//                    {
//                        ix[i] = 0;
//                        if (ar_y[i] >= 0)
//                        {
//                            const float* yS = _src.ptr<float>(ar_y[i]);
//                            for (int j = 0; j < ksize; ++j)
//                                ix[i] += alvision.saturate_cast<float>((ar_x[j] >= 0 ? yS[ar_x[j] + r] : borderValue[r]) * w[j]);
//                        }
//                        else
//                            for (int j = 0; j < ksize; ++j)
//                                ix[i] += alvision.saturate_cast<float>(borderValue[r] * w[j]);
//                    }
//                    for (let i = 0; i < ksize; ++i)
//                        xyD[r] += alvision.saturate_cast<float>(w[ksize + i] * ix[i]);
//                }
//            }
//        }
//    }
//}

//void CV_Remap_Test::validate_results() const
//{
//    CV_ImageWarpBaseTest::validate_results();
//    if (alvision.cvtest.TS.ptr().get_err_code() == alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY)
//    {
//        PRINT_TO_LOG("BorderType: %s\n", borderType_to_string());
//        PRINT_TO_LOG("BorderValue: (%f, %f, %f, %f)\n",
//                     borderValue[0], borderValue[1], borderValue[2], borderValue[3]);
//    }
//}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//// warpAffine
//////////////////////////////////////////////////////////////////////////////////////////////////////////

//class CV_WarpAffine_Test :
//    public CV_Remap_Test
//{
//public:
//    CV_WarpAffine_Test();

//    virtual ~CV_WarpAffine_Test();

//protected:
//    virtual void generate_test_data();
//    virtual void prepare_test_data_for_reference_func();

//    virtual run_func() : void {}
//    virtual void run_reference_func();

//    Mat M;
//private:
//    void warpAffine(const Mat&, Mat&);
//};

//CV_WarpAffine_Test::CV_WarpAffine_Test() :
//    CV_Remap_Test()
//{
//}

//CV_WarpAffine_Test::~CV_WarpAffine_Test()
//{
//}

//void CV_WarpAffine_Test::generate_test_data()
//{
//    CV_Remap_Test::generate_test_data();

//    var rng = this.ts.get_rng();

//    // generating the M 2x3 matrix
//    const  depths = [ alvision.MatrixType.CV_32FC1, alvision.MatrixType.CV_64FC1 ];

//    // generating 2d matrix
//    M = getRotationMatrix2D(Point2f(src.cols / 2., src.rows / 2.),
//        rng.uniform(-180., 180.), rng.uniform(0.4, 2.0));
//    int depth = depths[rng.uniform(0, sizeof(depths) / sizeof(depths[0]))];
//    if (M.depth() != depth)
//    {
//        Mat tmp;
//        M.convertTo(tmp, depth);
//        M = tmp;
//    }

//    // warp_matrix is inverse
//    if (rng.uniform(0., 1.) > 0)
//        interpolation |= CV_WARP_INVERSE_MAP;
//}

//void CV_WarpAffine_Test::run_func()
//{
//    alvision.warpAffine(src, dst, M, dst.size(), interpolation, borderType, borderValue);
//}

//void CV_WarpAffine_Test::prepare_test_data_for_reference_func()
//{
//    CV_ImageWarpBaseTest::prepare_test_data_for_reference_func();
//}

//void CV_WarpAffine_Test::run_reference_func()
//{
//    prepare_test_data_for_reference_func();

//    warpAffine(src, reference_dst);
//}

//void CV_WarpAffine_Test::warpAffine(const Mat& _src, Mat& _dst)
//{
//    Size dsize = _dst.size();

//    CV_Assert(_src.size().area() > 0);
//    CV_Assert(dsize.area() > 0);
//    CV_Assert(_src.type() == _dst.type());

//    Mat tM;
//    M.convertTo(tM, alvision.MatrixType.CV_64F);

//    int inter = interpolation & INTER_MAX;
//    if (inter == INTER_AREA)
//        inter = INTER_LINEAR;

//    mapx.create(dsize, alvision.MatrixType.CV_16SC2);
//    if (inter != INTER_NEAREST)
//        mapy.create(dsize, alvision.MatrixType.CV_16SC1);
//    else
//        mapy = Mat();

//    if (!(interpolation & CV_WARP_INVERSE_MAP))
//        invertAffineTransform(tM.clone(), tM);

//    const int AB_BITS = MAX(10, (int)INTER_BITS);
//    const int AB_SCALE = 1 << AB_BITS;
//    int round_delta = (inter == INTER_NEAREST) ? AB_SCALE / 2 : (AB_SCALE / INTER_TAB_SIZE / 2);

//    const double* data_tM = tM.ptr<double>(0);
//    for (int dy = 0; dy < dsize.height; ++dy)
//    {
//        short* yM = mapx.ptr<short>(dy);
//        for (int dx = 0; dx < dsize.width; ++dx, yM += 2)
//        {
//            int v1 = alvision.saturate_cast<int>(alvision.saturate_cast<int>(data_tM[0] * dx * AB_SCALE) +
//                    alvision.saturate_cast<int>((data_tM[1] * dy + data_tM[2]) * AB_SCALE) + round_delta),
//                   v2 = alvision.saturate_cast<int>(alvision.saturate_cast<int>(data_tM[3] * dx * AB_SCALE) +
//                    alvision.saturate_cast<int>((data_tM[4] * dy + data_tM[5]) * AB_SCALE) + round_delta);
//            v1 >>= AB_BITS - INTER_BITS;
//            v2 >>= AB_BITS - INTER_BITS;

//            yM[0] = alvision.saturate_cast<short>(v1 >> INTER_BITS);
//            yM[1] = alvision.saturate_cast<short>(v2 >> INTER_BITS);

//            if (inter != INTER_NEAREST)
//                mapy.ptr<short>(dy)[dx] = ((v2 & (INTER_TAB_SIZE - 1)) * INTER_TAB_SIZE + (v1 & (INTER_TAB_SIZE - 1)));
//        }
//    }

//    CV_Assert(mapx.type() == alvision.MatrixType.CV_16SC2 && ((inter == INTER_NEAREST && mapy.empty()) || mapy.type() == alvision.MatrixType.CV_16SC1));
//    alvision.remap(_src, _dst, mapx, mapy, inter, borderType, borderValue);
//}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//// warpPerspective
//////////////////////////////////////////////////////////////////////////////////////////////////////////

//class CV_WarpPerspective_Test extends CV_WarpAffine_Test
//{
//public:
//    CV_WarpPerspective_Test();

//    virtual ~CV_WarpPerspective_Test();

//protected:
//    virtual void generate_test_data();

//    virtual run_func() : void {}
//    virtual void run_reference_func();

//private:
//    void warpPerspective(const Mat&, Mat&);
//};

//CV_WarpPerspective_Test::CV_WarpPerspective_Test() :
//    CV_WarpAffine_Test()
//{
//}

//CV_WarpPerspective_Test::~CV_WarpPerspective_Test()
//{
//}

//void CV_WarpPerspective_Test::generate_test_data()
//{
//    CV_Remap_Test::generate_test_data();

//    // generating the M 3x3 matrix
//    var rng = this.ts.get_rng();

//    float cols = static_cast<float>(src.cols), rows = static_cast<float>(src.rows);
//    Point2f sp[] = { Point2f(0.0f, 0.0f), Point2f(cols, 0.0f), Point2f(0.0f, rows), Point2f(cols, rows) };
//    Point2f dp[] = { Point2f(rng.uniform(0.0f, cols), rng.uniform(0.0f, rows)),
//        Point2f(rng.uniform(0.0f, cols), rng.uniform(0.0f, rows)),
//        Point2f(rng.uniform(0.0f, cols), rng.uniform(0.0f, rows)),
//        Point2f(rng.uniform(0.0f, cols), rng.uniform(0.0f, rows)) };
//    M = getPerspectiveTransform(sp, dp);

//    const depths = [ alvision.MatrixType.CV_32F, alvision.MatrixType. CV_64F ];
//    int depth = depths[rng.uniform(0, 2)];
//    M.clone().convertTo(M, depth);
//}

//void CV_WarpPerspective_Test::run_func()
//{
//    alvision.warpPerspective(src, dst, M, dst.size(), interpolation, borderType, borderValue);
//}

//void CV_WarpPerspective_Test::run_reference_func()
//{
//    prepare_test_data_for_reference_func();

//    warpPerspective(src, reference_dst);
//}

//void CV_WarpPerspective_Test::warpPerspective(const Mat& _src, Mat& _dst)
//{
//    Size ssize = _src.size(), dsize = _dst.size();

//    CV_Assert(ssize.area() > 0);
//    CV_Assert(dsize.area() > 0);
//    CV_Assert(_src.type() == _dst.type());

//    if (M.depth() != alvision.MatrixType.CV_64F)
//    {
//        Mat tmp;
//        M.convertTo(tmp, alvision.MatrixType.CV_64F);
//        M = tmp;
//    }

//    if (!(interpolation & CV_WARP_INVERSE_MAP))
//    {
//        Mat tmp;
//        invert(M, tmp);
//        M = tmp;
//    }

//    int inter = interpolation & INTER_MAX;
//    if (inter == INTER_AREA)
//        inter = INTER_LINEAR;

//    mapx.create(dsize, alvision.MatrixType.CV_16SC2);
//    if (inter != INTER_NEAREST)
//        mapy.create(dsize, alvision.MatrixType.CV_16SC1);
//    else
//        mapy = Mat();

//    double* tM = M.ptr<double>(0);
//    for (int dy = 0; dy < dsize.height; ++dy)
//    {
//        short* yMx = mapx.ptr<short>(dy);

//        for (int dx = 0; dx < dsize.width; ++dx, yMx += 2)
//        {
//            double den = tM[6] * dx + tM[7] * dy + tM[8];
//            den = den ? 1.0 / den : 0.0;

//            if (inter == INTER_NEAREST)
//            {
//                yMx[0] = alvision.saturate_cast<short>((tM[0] * dx + tM[1] * dy + tM[2]) * den);
//                yMx[1] = alvision.saturate_cast<short>((tM[3] * dx + tM[4] * dy + tM[5]) * den);
//                continue;
//            }

//            den *= INTER_TAB_SIZE;
//            int v0 = alvision.saturate_cast<int>((tM[0] * dx + tM[1] * dy + tM[2]) * den);
//            int v1 = alvision.saturate_cast<int>((tM[3] * dx + tM[4] * dy + tM[5]) * den);

//            yMx[0] = alvision.saturate_cast<short>(v0 >> INTER_BITS);
//            yMx[1] = alvision.saturate_cast<short>(v1 >> INTER_BITS);
//            mapy.ptr<short>(dy)[dx] = alvision.saturate_cast<short>((v1 & (INTER_TAB_SIZE - 1)) *
//                    INTER_TAB_SIZE + (v0 & (INTER_TAB_SIZE - 1)));
//        }
//    }

//    CV_Assert(mapx.type() == alvision.MatrixType.CV_16SC2 && ((inter == INTER_NEAREST && mapy.empty()) || mapy.type() == alvision.MatrixType.CV_16SC1));
//    alvision.remap(_src, _dst, mapx, mapy, inter, borderType, borderValue);
//}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//// Tests
//////////////////////////////////////////////////////////////////////////////////////////////////////////

//alvision.cvtest.TEST('Imgproc_Resize_Test', 'accuracy', () => { CV_Resize_Test test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_Remap_Test', 'accuracy', () => { CV_Remap_Test test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_WarpAffine_Test', 'accuracy', () => { CV_WarpAffine_Test test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_WarpPerspective_Test', 'accuracy', () => { CV_WarpPerspective_Test test; test.safe_run(); });
