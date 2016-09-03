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

//class CV_FilterBaseTest extends alvision.cvtest.ArrayTest
//{
//    constructor(_fp_kernel: boolean) {
//        super();
//        this.fp_kernel = _fp_kernel;
//        test_array[INPUT].push(null);
//        test_array[INPUT].push(null);
//        test_array[OUTPUT].push(null);
//        test_array[REF_OUTPUT].push(null);
//        max_aperture_size = 13;
//        inplace = false;
//        aperture_size = alvision.Size(0, 0);
//        anchor = cvPoint(0, 0);
//        element_wise_relative_error = false;
//    }

//    prepare_test_case(test_case_idx: alvision.int): alvision.int{
//        int code = super.prepare_test_case(test_case_idx);
//        if (code > 0) {
//            if (inplace && test_mat[INPUT][0].type() == test_mat[OUTPUT][0].type())
//                alvision.cvtest.copy(test_mat[INPUT][0], test_mat[OUTPUT][0]);
//            else
//                inplace = false;
//        }
//        return code;
//    }
//    read_params(fs: alvision.FileStorage): alvision.int{
//        int code = super.read_params(fs);
//        if (code < 0)
//            return code;

//        max_aperture_size = cvReadInt(find_param(fs, "max_aperture_size"), max_aperture_size);
//        max_aperture_size = alvision.cvtest.clipInt(max_aperture_size, 1, 100);

//        return code;
//    }
//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        var rng = this.ts.get_rng();
//        int depth = alvision.cvtest.randInt(rng) % alvision.MatrixType.CV_32F;
//        int cn = alvision.cvtest.randInt(rng) % 3 + 1;
//        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        depth += depth == CV_8S;
//        cn += cn == 2;

//        types[INPUT][0] = types[OUTPUT][0] = types[REF_OUTPUT][0] = alvision.MatrixType. CV_MAKETYPE(depth, cn);

//        aperture_size.width = alvision.cvtest.randInt(rng) % max_aperture_size + 1;
//        aperture_size.height = alvision.cvtest.randInt(rng) % max_aperture_size + 1;
//        anchor.x = alvision.cvtest.randInt(rng) % aperture_size.width;
//        anchor.y = alvision.cvtest.randInt(rng) % aperture_size.height;

//        types[INPUT][1] = fp_kernel ? alvision.MatrixType.CV_32FC1 : alvision.MatrixType.CV_8UC1;
//        sizes[INPUT][1] = aperture_size;

//        inplace = alvision.cvtest.randInt(rng) % 2 != 0;
//        border = BORDER_REPLICATE;
//    }
//    get_minmax_bounds(i: alvision.int, j: alvision.int, type: alvision.int, low: alvision.Scalar, high: alvision.Scalar): void{
//        super.get_minmax_bounds(i, j, type, low, high);
//        if (i == INPUT) {
//            if (j == 1) {
//                if (fp_kernel) {
//                    var rng = this.ts.get_rng();
//                    double val = exp(alvision.cvtest.randReal(rng).valueOf() * 10 - 4);
//                    low = Scalar.all(-val);
//                    high = Scalar.all(val);
//                }
//                else {
//                    low = alvision.Scalar.all(0);
//                    high = Scalar.all(2);
//                }
//            }
//            else if (CV_MAT_DEPTH(type) == alvision.MatrixType.CV_16U) {
//                low = Scalar.all(0.);
//                high = Scalar.all(40000.);
//            }
//            else if (CV_MAT_DEPTH(type) == alvision.MatrixType.CV_32F) {
//                low = Scalar.all(-10.);
//                high = Scalar.all(10.);
//            }
//        }
//    }
//    alvision.Size aperture_size;
//    CvPoint anchor;
//    int max_aperture_size;
//    bool fp_kernel;
//    bool inplace;
//    int border;
//};



///////////////////////////

//class CV_MorphologyBaseTest extends CV_FilterBaseTest
//{
//    constructor() {
//        super(false);
//        shape = -1;
//        element = 0;
//        optype = optype_min = optype_max = -1;
//    }
//    prepare_to_validation(test_case_idx: alvision.int): void {
//        Mat & src = test_mat[INPUT][0], &dst = test_mat[REF_OUTPUT][0];
//        Mat _ielement(element.nRows, element.nCols, alvision.MatrixType.CV_32S, element.values);
//        Mat _element;
//        _ielement.convertTo(_element, alvision.MatrixType.CV_8U);
//        Point _anchor(element.anchorX, element.anchorY);
//        int _border = BORDER_REPLICATE;

//        if (optype == CV_MOP_ERODE) {
//            alvision.cvtest.erode(src, dst, _element, _anchor, _border);
//        }
//        else if (optype == CV_MOP_DILATE) {
//            alvision.cvtest.dilate(src, dst, _element, _anchor, _border);
//        }
//        else {
//            Mat temp;
//            if (optype == CV_MOP_OPEN) {
//                alvision.cvtest.erode(src, temp, _element, _anchor, _border);
//                alvision.cvtest.dilate(temp, dst, _element, _anchor, _border);
//            }
//            else if (optype == CV_MOP_CLOSE) {
//                alvision.cvtest.dilate(src, temp, _element, _anchor, _border);
//                alvision.cvtest.erode(temp, dst, _element, _anchor, _border);
//            }
//            else if (optype == CV_MOP_GRADIENT) {
//                alvision.cvtest.erode(src, temp, _element, _anchor, _border);
//                alvision.cvtest.dilate(src, dst, _element, _anchor, _border);
//                alvision.cvtest.add(dst, 1, temp, -1, alvision.Scalar.all(0), dst, dst.type());
//            }
//            else if (optype == CV_MOP_TOPHAT) {
//                alvision.cvtest.erode(src, temp, _element, _anchor, _border);
//                alvision.cvtest.dilate(temp, dst, _element, _anchor, _border);
//                alvision.cvtest.add(src, 1, dst, -1, alvision.Scalar.all(0), dst, dst.type());
//            }
//            else if (optype == CV_MOP_BLACKHAT) {
//                alvision.cvtest.dilate(src, temp, _element, _anchor, _border);
//                alvision.cvtest.erode(temp, dst, _element, _anchor, _border);
//                alvision.cvtest.add(dst, 1, src, -1, alvision.Scalar.all(0), dst, dst.type());
//            }
//            else
//                CV_Error(alvision.cv.Error.Code.StsBadArg, "Unknown operation");
//        }

//        cvReleaseStructuringElement( &element);
//    }
//    prepare_test_case(test_case_idx: alvision.int): alvision.int{
//        int code = CV_FilterBaseTest::prepare_test_case(test_case_idx);
//        Array < int > eldata;

//        if (code <= 0)
//            return code;

//        if (shape == CV_SHAPE_CUSTOM) {
//            eldata.resize(aperture_size.width * aperture_size.height);
//            const uchar* src = test_mat[INPUT][1].ptr();
//            int srcstep = (int)test_mat[INPUT][1].step;
//            int i, j, nonzero = 0;

//            for (i = 0; i < aperture_size.height; i++) {
//                for (j = 0; j < aperture_size.width; j++) {
//                    eldata[i * aperture_size.width + j] = src[i * srcstep + j];
//                    nonzero += src[i * srcstep + j] != 0;
//                }
//            }

//            if (nonzero == 0)
//                eldata[anchor.y * aperture_size.width + anchor.x] = 1;
//        }

//        cvReleaseStructuringElement( &element);
//        element = cvCreateStructuringElementEx(aperture_size.width, aperture_size.height,
//            anchor.x, anchor.y, shape, eldata.empty() ? 0 : &eldata[0]);
//        return code;
//    }
//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {

//        var rng = this.ts.get_rng();
//        CV_FilterBaseTest::get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        int depth = alvision.cvtest.randInt(rng) % 4;
//        depth = depth == 0 ? alvision.MatrixType.CV_8U : depth == 1 ? alvision.MatrixType.CV_16U : depth == 2 ? alvision.MatrixType.CV_16S : alvision.MatrixType.CV_32F;
//        int cn = CV_MAT_CN(types[INPUT][0]);

//        types[INPUT][0] = types[OUTPUT][0] = types[REF_OUTPUT][0] = CV_MAKETYPE(depth, cn);
//        shape = alvision.cvtest.randInt(rng) % 4;
//        if (shape >= 3)
//            shape = CV_SHAPE_CUSTOM;
//        else
//            sizes[INPUT][1] = alvision.Size(0, 0);
//        optype = alvision.cvtest.randInt(rng) % (optype_max - optype_min + 1) + optype_min;}
//    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
//        return test_mat[INPUT][0].depth() < alvision.MatrixType.CV_32F ||
//            (optype == CV_MOP_ERODE || optype == CV_MOP_DILATE ||
//                optype == CV_MOP_OPEN || optype == CV_MOP_CLOSE) ? 0 : 1e-5;
//    }

//    protected optype: alvision.int;
//    protected optype_min: alvision.int;
//    protected optype_max: alvision.int;
//    protected shape: alvision.int;
//    protected element: IplConvKernel* ;
//};


///////////////// erode ///////////////

//class CV_ErodeTest extends CV_MorphologyBaseTest
//{
//    constructor() {
//        super();
//        optype_min = optype_max = CV_MOP_ERODE;

//    }
//    run_func(): void {
//        cvErode(inplace ? test_array[OUTPUT][0] : test_array[INPUT][0],
//            test_array[OUTPUT][0], element, 1);
//    }
//};




///////////////// dilate ///////////////

//class CV_DilateTest extends CV_MorphologyBaseTest
//{
//    constructor() {
//        super();
//        optype_min = optype_max = CV_MOP_DILATE;
//    }

//    run_func(): void {
//        cvDilate(inplace ? test_array[OUTPUT][0] : test_array[INPUT][0],
//            test_array[OUTPUT][0], element, 1);
//    }
//};


///////////////// morphEx ///////////////

//class CV_MorphExTest extends CV_MorphologyBaseTest
//{
//    constructor() {
//        optype_min = CV_MOP_ERODE;
//        optype_max = CV_MOP_BLACKHAT;
//    }
//    run_func(): void {
//        cvMorphologyEx(test_array[inplace ? OUTPUT : INPUT][0],
//            test_array[OUTPUT][0], 0, element, optype, 1);
//    }
//};



///////////////// generic filter ///////////////

//class CV_FilterTest extends CV_FilterBaseTest
//{
//    constructor() {
//        super(true);

//    }

//    prepare_to_validation(test_case_idx: alvision.int): void {
//        alvision.cvtest.filter2D(test_mat[INPUT][0], test_mat[REF_OUTPUT][0], test_mat[REF_OUTPUT][0].type(),
//            test_mat[INPUT][1], anchor, 0, BORDER_REPLICATE);
//    }
//    run_func(): void {
//        CvMat kernel = test_mat[INPUT][1];
//        cvFilter2D(test_array[inplace ? OUTPUT : INPUT][0],
//            test_array[OUTPUT][0], &kernel, anchor);
//    }
//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        CV_FilterBaseTest::get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        var rng = this.ts.get_rng();
//        int depth = alvision.cvtest.randInt(rng) % 3;
//        int cn = CV_MAT_CN(types[INPUT][0]);
//        depth = depth == 0 ? alvision.MatrixType.CV_8U : depth == 1 ? alvision.MatrixType. CV_16U : alvision.MatrixType.CV_32F;
//        types[INPUT][0] = types[OUTPUT][0] = types[REF_OUTPUT][0] = alvision.MatrixType.CV_MAKETYPE(depth, cn);
//    }
//    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
//        int depth = test_mat[INPUT][0].depth();
//        return depth <= alvision.MatrixType.CV_8S ? 2 : depth <= alvision.MatrixType.CV_32S ? 32 :
//            depth == alvision.MatrixType.CV_32F ? 1e-4 : 1e-10;
//    }
//};




//////////////////////////

//class CV_DerivBaseTest extends CV_FilterBaseTest
//{
//    constructor() {
//        super(true);
//        this.max_aperture_size = 7;
//    }

//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        var rng = this.ts.get_rng();
//        CV_FilterBaseTest::get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        int depth = alvision.cvtest.randInt(rng) % 2;
//        depth = depth == 0 ? alvision.MatrixType.CV_8U : alvision.MatrixType.CV_32F;
//        types[INPUT][0] = alvision.MatrixType.CV_MAKETYPE(depth, 1);
//        types[OUTPUT][0] = types[REF_OUTPUT][0] = alvision.MatrixType.CV_MAKETYPE(depth == alvision.MatrixType.CV_8U ? alvision.MatrixType.CV_16S : alvision.MatrixType.CV_32F, 1);
//        _aperture_size = (alvision.cvtest.randInt(rng) % 5) * 2 - 1;
//        sizes[INPUT][1] = aperture_size = alvision.Size(_aperture_size, _aperture_size);
//    }
//    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
//        int depth = test_mat[INPUT][0].depth();
//        return depth <= CV_8S ? 2 : 5e-4;
//    }
//    protected _aperture_size: alvision.int;
//};


///////////////// sobel ///////////////

//class CV_SobelTest extends CV_DerivBaseTest
//{
//    prepare_to_validation(test_case_idx: alvision.int): void {
//        Mat kernel = alvision.cvtest.calcSobelKernel2D(dx, dy, _aperture_size, 0);
//        alvision.cvtest.filter2D(test_mat[INPUT][0], test_mat[REF_OUTPUT][0], test_mat[REF_OUTPUT][0].depth(),
//            kernel, anchor, 0, BORDER_REPLICATE);
//    }
//    run_func(): void {
//        cvSobel(test_array[inplace ? OUTPUT : INPUT][0],
//            test_array[OUTPUT][0], dx, dy, _aperture_size);
//    /*alvision.Sobel( test_mat[inplace ? OUTPUT : INPUT][0],
//               test_mat[OUTPUT][0], test_mat[OUTPUT][0].depth(),
//               dx, dy, _aperture_size, 1, 0, border );*/
//    }

//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        var rng = this.ts.get_rng();
//        CV_DerivBaseTest::get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        int max_d = _aperture_size > 0 ? 2 : 1;
//        origin = alvision.cvtest.randInt(rng) % 2;
//        dx = alvision.cvtest.randInt(rng) % (max_d + 1);
//        dy = alvision.cvtest.randInt(rng) % (max_d + 1 - dx);
//        if (dx == 0 && dy == 0)
//            dx = 1;
//        if (alvision.cvtest.randInt(rng) % 2) {
//            int t;
//            CV_SWAP(dx, dy, t);
//        }

//        if (_aperture_size < 0)
//            aperture_size = alvision.Size(3, 3);
//        else if (_aperture_size == 1) {
//            if (dx == 0)
//                aperture_size = alvision.Size(1, 3);
//            else if (dy == 0)
//                aperture_size = alvision.Size(3, 1);
//            else {
//                _aperture_size = 3;
//                aperture_size = alvision.Size(3, 3);
//            }
//        }
//        else
//            aperture_size = alvision.Size(_aperture_size, _aperture_size);

//        sizes[INPUT][1] = aperture_size;
//        anchor.x = aperture_size.width / 2;
//        anchor.y = aperture_size.height / 2;
//    }

//    protected dx: alvision.int;
//    protected dy    : alvision.int;
//    protected origin: alvision.int;
//};




///////////////// laplace ///////////////

//class CV_LaplaceTest extends CV_DerivBaseTest
//{

//    prepare_test_case(test_case_idx: alvision.int): alvision.int{
//        int code = CV_DerivBaseTest::prepare_test_case(test_case_idx);
//        return _aperture_size < 0 ? 0 : code;
//    }
//    prepare_to_validation(test_case_idx: alvision.int): void {
//        Mat kernel = alvision.cvtest.calcLaplaceKernel2D(_aperture_size);
//        alvision.cvtest.filter2D(test_mat[INPUT][0], test_mat[REF_OUTPUT][0], test_mat[REF_OUTPUT][0].depth(),
//            kernel, anchor, 0, BORDER_REPLICATE);
//    }
//    run_func(): void {
//        cvLaplace(test_array[inplace ? OUTPUT : INPUT][0],
//            test_array[OUTPUT][0], _aperture_size);
//    }
//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        CV_DerivBaseTest::get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        if (_aperture_size <= 1) {
//            if (_aperture_size < 0)
//                _aperture_size = 1;
//            aperture_size = alvision.Size(3, 3);
//        }
//        else
//            aperture_size = alvision.Size(_aperture_size, _aperture_size);

//        sizes[INPUT][1] = aperture_size;
//        anchor.x = aperture_size.width / 2;
//        anchor.y = aperture_size.height / 2;
//    }
//};

//////////////////////////////////////////////////////////////

//class CV_SmoothBaseTest extends CV_FilterBaseTest
//{
//    constructor() {
//        super(true);
//        this.smooth_type = "";
//    }

//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        var rng = this.ts.get_rng();
//        CV_FilterBaseTest::get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        int depth = alvision.cvtest.randInt(rng) % 2;
//        int cn = CV_MAT_CN(types[INPUT][0]);
//        depth = depth == 0 ? alvision.MatrixType.CV_8U : alvision.MatrixType.CV_32F;
//        types[INPUT][0] = types[OUTPUT][0] = types[REF_OUTPUT][0] = CV_MAKETYPE(depth, cn);
//        anchor.x = alvision.cvtest.randInt(rng) % (max_aperture_size / 2 + 1);
//        anchor.y = alvision.cvtest.randInt(rng) % (max_aperture_size / 2 + 1);
//        aperture_size.width = anchor.x * 2 + 1;
//        aperture_size.height = anchor.y * 2 + 1;
//        sizes[INPUT][1] = aperture_size;
//    }
//    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
//        int depth = test_mat[INPUT][0].depth();
//        return depth <= CV_8S ? 1 : 1e-5;
//    }

//    protected smooth_type: string;
//};



///////////////// blur ///////////////

//class CV_BlurTest extends CV_SmoothBaseTest
//{
//    prepare_test_case(test_case_idx: alvision.int): alvision.int{
//        int code = CV_SmoothBaseTest::prepare_test_case(test_case_idx);
//        return code > 0 && !normalize && test_mat[INPUT][0].channels() > 1 ? 0 : code;
//    }
//    prepare_to_validation(test_case_idx: alvision.int): void {
//        Mat kernel(aperture_size, alvision.MatrixType.CV_64F);
//        kernel.setTo(Scalar.all(normalize ? 1. / (aperture_size.width * aperture_size.height) : 1.));
//        alvision.cvtest.filter2D(test_mat[INPUT][0], test_mat[REF_OUTPUT][0], test_mat[REF_OUTPUT][0].depth(),
//            kernel, anchor, 0, BORDER_REPLICATE);
//    }
//    run_func(): void {
//        cvSmooth(inplace ? test_array[OUTPUT][0] : test_array[INPUT][0],
//            test_array[OUTPUT][0], normalize ? CV_BLUR : CV_BLUR_NO_SCALE,
//            aperture_size.width, aperture_size.height);
//    }
//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        var rng = this.ts.get_rng();
//        CV_SmoothBaseTest::get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        int depth = alvision.cvtest.randInt(rng) % 4;
//        int cn = (alvision.cvtest.randInt(rng) % 4) + 1;
//        depth = depth == 0 ? alvision.MatrixType.CV_8U : depth == 1 ? alvision.MatrixType.CV_16U : depth == 2 ? alvision.MatrixType.CV_16S : alvision.MatrixType.CV_32F;
//        types[OUTPUT][0] = types[REF_OUTPUT][0] = types[INPUT][0] = alvision.MatrixType.CV_MAKETYPE(depth, cn);
//        normalize = alvision.cvtest.randInt(rng) % 2 != 0;
//        if (!normalize) {
//            types[INPUT][0] = alvision.MatrixType.CV_MAKETYPE(depth, 1);
//            types[OUTPUT][0] = types[REF_OUTPUT][0] = alvision.MatrixType.CV_MAKETYPE(depth == alvision.MatrixType.CV_8U ? alvision.MatrixType.CV_16S : alvision.MatrixType.CV_32F, 1);
//        }
//    }
//    protected normalize: boolean;
//};





///////////////// gaussian ///////////////

//class CV_GaussianBlurTest extends CV_SmoothBaseTest
//{
//    constructor() {
//        super();
//        this.sigma = 0.;
//        this.smooth_type = "Gaussian";
//    }

//    prepare_to_validation(test_case_idx: alvision.int): void {
//        Mat kernel = calcGaussianKernel2D(aperture_size, sigma);
//        alvision.cvtest.filter2D(test_mat[INPUT][0], test_mat[REF_OUTPUT][0], test_mat[REF_OUTPUT][0].depth(),
//            kernel, anchor, 0, border & ~BORDER_ISOLATED);
//    }
//    run_func(): void {
//        cvSmooth(test_array[inplace ? OUTPUT : INPUT][0],
//            test_array[OUTPUT][0], CV_GAUSSIAN,
//            param1, param2, sigma, sigma);
//    }
//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        var rng = this.ts.get_rng();
//        int kernel_case = alvision.cvtest.randInt(rng) % 2;
//        CV_SmoothBaseTest::get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        anchor = cvPoint(aperture_size.width / 2, aperture_size.height / 2);

//        sigma = exp(alvision.cvtest.randReal(rng).valueOf() * 5 - 2);
//        param1 = aperture_size.width;
//        param2 = aperture_size.height;

//        if (kernel_case == 0)
//            sigma = 0.;
//    }
//    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
//        var depth = test_mat[INPUT][0].depth();
//        return depth <= CV_8S ? 8 : 1e-5;
//    }

//    protected sigma: alvision.double;
//    protected param1 : alvision.int;
//    protected param2: alvision.int;
//};




//// !!! Copied from cvSmooth, if the code is changed in cvSmooth,
//// make sure to update this one too.
//const SMALL_GAUSSIAN_SIZE = 7;
//function calcGaussianKernel(n: alvision.int, sigma: alvision.double, kernel: Array<alvision.float> ) : void
//{
//    var small_gaussian_tab /*[][SMALL_GAUSSIAN_SIZE]*/ =
//    [
//        [1.],
//        [0.25, 0.5, 0.25],
//        [0.0625, 0.25, 0.375, 0.25, 0.0625],
//        [0.03125, 0.109375, 0.21875, 0.28125, 0.21875, 0.109375, 0.03125]
//    ];

//    kernel.resize(n);
//    if( n <= SMALL_GAUSSIAN_SIZE && sigma <= 0 )
//    {
//        assert( n%2 == 1 );
//        memcpy( &kernel[0], small_gaussian_tab[n>>1], n*sizeof(kernel[0]));
//    }
//    else
//    {
//        double sigmaX = sigma > 0 ? sigma : (n/2 - 1)*0.3 + 0.8;
//        double scale2X = -0.5/(sigmaX*sigmaX);
//        double sum = 1.;
//        int i;
//        sum = kernel[n/2] = 1.f;

//        for( i = 1; i <= n/2; i++ )
//        {
//            kernel[n/2+i] = kernel[n/2-i] = (float)exp(scale2X*i*i);
//            sum += kernel[n/2+i]*2;
//        }

//        sum = 1./sum;
//        for( i = 0; i <= n/2; i++ )
//            kernel[n/2+i] = kernel[n/2-i] = (float)(kernel[n/2+i]*sum);
//    }
//}


//function calcGaussianKernel2D(ksize: alvision.Size, sigma: alvision.double ) : alvision.Mat
//{
//    Array<float> kx, ky;
//    Mat kernel(ksize, CV_32F);

//    calcGaussianKernel( kernel.cols, sigma, kx );
//    calcGaussianKernel( kernel.rows, sigma, ky );

//    for( int i = 0; i < kernel.rows; i++ )
//        for( int j = 0; j < kernel.cols; j++ )
//            kernel.at<float>(i, j) = kx[j]*ky[i];
//    return kernel;
//}


///////////////// median ///////////////

//class CV_MedianBlurTest extends CV_SmoothBaseTest
//{
//    constructor() {
//        super();
//        this.smooth_type = "Median";
//    }

//    prepare_to_validation(test_case_idx: alvision.int): void {
//        // CV_SmoothBaseTest::prepare_to_validation( test_case_idx );
//        const Mat& src0 = test_mat[INPUT][0];
//        Mat & dst0 = test_mat[REF_OUTPUT][0];
//        int i, cn = src0.channels();
//        int m = aperture_size.width;
//        Mat src(src0.rows + m - 1, src0.cols + m - 1, src0.depth());
//        Mat dst;
//        if (cn == 1)
//            dst = dst0;
//        else
//            dst.create(src0.size(), src0.depth());

//        for (i = 0; i < cn; i++) {
//            Mat ptr = src0;
//            if (cn > 1) {
//                alvision.cvtest.extract(src0, dst, i);
//                ptr = dst;
//            }
//            alvision.cvtest.copyMakeBorder(ptr, src, m / 2, m / 2, m / 2, m / 2, border & ~BORDER_ISOLATED);
//            test_medianFilter(src, dst, m);
//            if (cn > 1)
//                alvision.cvtest.insert(dst, dst0, i);
//        }
//    }
//    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
//        return 0;
//    }
//    run_func(): void {
//        cvSmooth(test_array[INPUT][0], test_array[OUTPUT][0],
//            CV_MEDIAN, aperture_size.width);
//    }
//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        CV_SmoothBaseTest::get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        int depth = alvision.MatrixType.CV_8U;
//        int cn = CV_MAT_CN(types[INPUT][0]);
//        types[INPUT][0] = types[OUTPUT][0] = types[REF_OUTPUT][0] = CV_MAKETYPE(depth, cn);
//        types[INPUT][1] = CV_MAKETYPE(depth, 1);

//        aperture_size.height = aperture_size.width;
//        anchor.x = anchor.y = aperture_size.width / 2;
//        sizes[INPUT][1] = alvision.Size(aperture_size.width, aperture_size.height);

//        sizes[OUTPUT][0] = sizes[INPUT][0];
//        sizes[REF_OUTPUT][0] = sizes[INPUT][0];

//        inplace = false;
//        border = BORDER_REPLICATE | BORDER_ISOLATED;
//    }
//};




//class median_pair
//{
//    public int col;
//    public int val;
//    public median_pair() { }
//    public median_pair( int _col, int _val ) : col(_col), val(_val) { }
//};


//function test_medianFilter(src: alvision.Mat & , dst: alvision.Mat, m: alvision.int ) : void
//{
//    int i, j, k, l, m2 = m*m, n;
//    Array<int> col_buf(m+1);
//    Array<median_pair> _buf0(m*m+1), _buf1(m*m+1);
//    median_pair *buf0 = &_buf0[0], *buf1 = &_buf1[0];
//    int step = (int)(src.step/src.elemSize());

//    assert( src.rows == dst.rows + m - 1 && src.cols == dst.cols + m - 1 &&
//        src.type() == dst.type() && src.type() == alvision.MatrixType.CV_8UC1 );

//    for( i = 0; i < dst.rows; i++ )
//    {
//        uchar* dst1 = dst.ptr<uchar>(i);
//        for( k = 0; k < m; k++ )
//        {
//            const uchar* src1 = src.ptr<uchar>(i+k);
//            for( j = 0; j < m-1; j++ )
//                *buf0++ = median_pair(j, src1[j]);
//        }

//        n = m2 - m;
//        buf0 -= n;
//        for( k = n-1; k > 0; k-- )
//        {
//            int f = 0;
//            for( j = 0; j < k; j++ )
//            {
//                if( buf0[j].val > buf0[j+1].val )
//                {
//                    median_pair t;
//                    CV_SWAP( buf0[j], buf0[j+1], t );
//                    f = 1;
//                }
//            }
//            if( !f )
//                break;
//        }

//        for( j = 0; j < dst.cols; j++ )
//        {
//            int ins_col = j + m - 1;
//            int del_col = j - 1;
//            const uchar* src1 = src.ptr<uchar>(i) + ins_col;
//            for( k = 0; k < m; k++, src1 += step )
//            {
//                col_buf[k] = src1[0];
//                for( l = k-1; l >= 0; l-- )
//                {
//                    int t;
//                    if( col_buf[l] < col_buf[l+1] )
//                        break;
//                    CV_SWAP( col_buf[l], col_buf[l+1], t );
//                }
//            }

//            col_buf[m] = INT_MAX;

//            for( k = 0, l = 0; k < n; )
//            {
//                if( buf0[k].col == del_col )
//                    k++;
//                else if( buf0[k].val < col_buf[l] )
//                    *buf1++ = buf0[k++];
//                else
//                {
//                    assert( col_buf[l] < INT_MAX );
//                    *buf1++ = median_pair(ins_col,col_buf[l++]);
//                }
//            }

//            for( ; l < m; l++ )
//                *buf1++ = median_pair(ins_col,col_buf[l]);

//            if( del_col < 0 )
//                n += m;
//            buf1 -= n;
//            assert( n == m2 );
//            dst1[j] = (uchar)buf1[n/2].val;
//            median_pair* tbuf;
//            CV_SWAP( buf0, buf1, tbuf );
//        }
//    }
//}


///////////////// pyramid tests ///////////////

//class CV_PyramidBaseTest extends CV_FilterBaseTest {
//    constructor( _downsample  : boolean) {
//        super(true);
//        var kdata = [1., 4., 6., 4., 1. ];
//        downsample = _downsample;
//        Mat kernel1d(1, 5, alvision.MatrixType.CV_32F, kdata);
//        kernel = (kernel1d.t() * kernel1d) * ((downsample ? 1 : 4) / 256.);
//    }


//    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
//        var depth = this.test_mat[this.INPUT][0].depth();
//        return depth < alvision.MatrixType.CV_32F ? 1 : 1e-5;
//    }
//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        const channels = [ 1, 3, 4];
//        const depthes = [alvision.MatrixType.CV_8U, alvision.MatrixType.CV_16S, alvision.MatrixType.CV_16U, alvision.MatrixType.CV_32F];

//        var rng = this.ts.get_rng();
//        alvision.Size sz;
//        CV_FilterBaseTest::get_test_array_types_and_sizes(test_case_idx, sizes, types);

//        int depth = depthes[alvision.cvtest.randInt(rng) % (sizeof(depthes) / sizeof(depthes[0]))];
//        int cn = channels[alvision.cvtest.randInt(rng) % (sizeof(channels) / sizeof(channels[0]))];

//        aperture_size = alvision.Size(5, 5);
//        anchor = cvPoint(aperture_size.width / 2, aperture_size.height / 2);

//        types[INPUT][0] = types[OUTPUT][0] = types[REF_OUTPUT][0] = CV_MAKETYPE(depth, cn);

//        sz.width = MAX(sizes[INPUT][0].width / 2, 1);
//        sz.height = MAX(sizes[INPUT][0].height / 2, 1);

//        if (downsample) {
//            sizes[OUTPUT][0] = sizes[REF_OUTPUT][0] = sz;
//            sz.width *= 2;
//            sz.height *= 2;
//            sizes[INPUT][0] = sz;
//        }
//        else {
//            sizes[INPUT][0] = sz;
//            sz.width *= 2;
//            sz.height *= 2;
//            sizes[OUTPUT][0] = sizes[REF_OUTPUT][0] = sz;
//        }

//        sizes[INPUT][1] = aperture_size;
//        inplace = false;
//    }

//    protected bool downsample;
//    protected Mat kernel;
//};




///////// pyrdown ////////

//class CV_PyramidDownTest extends CV_PyramidBaseTest
//{
//    constructor() {
//        super(true);
//    }
//    run_func(): void {
//        cvPyrDown(test_array[INPUT][0], test_array[OUTPUT][0], CV_GAUSSIAN_5x5);
//    }
//    prepare_to_validation(test_case_idx: alvision.int): void {
//        Mat & src = test_mat[INPUT][0], &dst = test_mat[REF_OUTPUT][0];
//        Mat temp;
//        alvision.cvtest.filter2D(src, temp, src.depth(),
//            kernel, Point(kernel.cols / 2, kernel.rows / 2),
//            0, BORDER_REFLECT_101);

//        size_t elem_size = temp.elemSize();
//        size_t ncols = dst.cols * elem_size;

//        for (let i = 0; i < dst.rows; i++ )
//        {
//            const uchar* src_row = temp.ptr(i * 2);
//            uchar * dst_row = dst.ptr(i);

//            for (size_t j = 0; j < ncols; j += elem_size )
//            {
//                for (size_t k = 0; k < elem_size; k++ )
//                dst_row[j + k] = src_row[j * 2 + k];
//            }
//        }
//    }
//};



///////// pyrup ////////

//class CV_PyramidUpTest extends CV_PyramidBaseTest
//{
//    constructor() {
//        super(false);
//    }

//    run_func(): void {
//        cvPyrUp(test_array[INPUT][0], test_array[OUTPUT][0], CV_GAUSSIAN_5x5);
//    }
//    prepare_to_validation(test_case_idx: alvision.int): void {

//        Mat & src = test_mat[INPUT][0], &dst = test_mat[REF_OUTPUT][0];
//        Mat temp(dst.size(), dst.type());

//        size_t elem_size = src.elemSize();
//        size_t ncols = src.cols * elem_size;

//        for (let i = 0; i < src.rows; i++ )
//        {
//            const uchar* src_row = src.ptr(i);
//            uchar * dst_row = temp.ptr(i * 2);

//            if (i * 2 + 1 < temp.rows)
//                memset(temp.ptr(i * 2 + 1), 0, temp.cols * elem_size);
//            for (size_t j = 0; j < ncols; j += elem_size )
//            {
//                for (size_t k = 0; k < elem_size; k++ )
//                {
//                    dst_row[j * 2 + k] = src_row[j + k];
//                    dst_row[j * 2 + k + elem_size] = 0;
//                }
//            }
//        }

//        alvision.cvtest.filter2D(temp, dst, dst.depth(),
//            kernel, Point(kernel.cols / 2, kernel.rows / 2),
//            0, BORDER_REFLECT_101);
//    }
//};




////////////////////////// feature selection //////////////////////////

//class CV_FeatureSelBaseTest extends alvision.cvtest.ArrayTest
//{
//    constructor(_width_factor: alvision.int) {
//        super();
//        this.max_aperture_size = 7;
//        this.max_block_size = 21;
//        // 1 input, 1 output, temp arrays are allocated in the reference functions
//        this.test_array[INPUT].push(null);
//        this.test_array[OUTPUT].push(null);
//        this.test_array[REF_OUTPUT].push(null);
//        this.element_wise_relative_error = false;
//        this.width_factor = _width_factor;
//    }


//    read_params(fs: alvision.FileStorage): alvision.int{
//        int code = super.read_params(fs);
//        if (code < 0)
//            return code;

//        max_aperture_size = cvReadInt(find_param(fs, "max_aperture_size"), max_aperture_size);
//        max_aperture_size = alvision.cvtest.clipInt(max_aperture_size, 1, 9);
//        max_block_size = cvReadInt(find_param(fs, "max_block_size"), max_block_size);
//        max_block_size = alvision.cvtest.clipInt(max_aperture_size, 1, 100);

//        return code;
//    }
//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        var rng = this.ts.get_rng();
//        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        int depth = alvision.cvtest.randInt(rng) % 2, asz;

//        depth = depth == 0 ? alvision.MatrixType.CV_8U : alvision.MatrixType.CV_32F;
//        types[INPUT][0] = depth;
//        types[OUTPUT][0] = types[REF_OUTPUT][0] = CV_32FC1;

//        aperture_size = (alvision.cvtest.randInt(rng) % (max_aperture_size + 2) - 1) | 1;
//        if (aperture_size == 1)
//            aperture_size = 3;
//        if (depth == alvision.MatrixType.CV_8U)
//            aperture_size = MIN(aperture_size, 5);
//        block_size = (alvision.cvtest.randInt(rng) % max_block_size + 1) | 1;
//        if (block_size <= 3)
//            block_size = 3;
//        asz = aperture_size > 0 ? aperture_size : 3;

//        sizes[INPUT][0].width = MAX(sizes[INPUT][0].width, asz + block_size);
//        sizes[INPUT][0].height = MAX(sizes[INPUT][0].height, asz + block_size);
//        sizes[OUTPUT][0].height = sizes[REF_OUTPUT][0].height = sizes[INPUT][0].height;
//        sizes[OUTPUT][0].width = sizes[REF_OUTPUT][0].width = sizes[INPUT][0].width * width_factor;
//    }
//    get_minmax_bounds(i: alvision.int, j: alvision.int, type: alvision.int, low: alvision.Scalar, high: alvision.Scalar): void{
//        super.get_minmax_bounds(i, j, type, low, high);
//        if (i == INPUT && CV_MAT_DEPTH(type) == alvision.MatrixType.CV_32F) {
//            low = Scalar.all(-10.);
//            high = Scalar.all(10.);
//        }
//    }
//    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
//        int depth = test_mat[INPUT][0].depth();
//        return depth <= alvision.MatrixType.CV_8S ? 3e-2 : depth == alvision.MatrixType.CV_32F ? 1e-3 : 1e-10;
//    }

//    protected aperture_size: alvision.int;
//    protected block_size: alvision.int;
//    protected max_aperture_size: alvision.int;
//    protected max_block_size: alvision.int;
//    protected width_factor: alvision.int;
//};



//function test_cornerEigenValsVecs(src: alvision.Mat, eigenv: alvision.Mat, ocv_eigenv: alvision.Mat ,
//    block_size: alvision.int, _aperture_size: alvision.int, mode: alvision.int ) : void
//{
//    int i, j;
//    int aperture_size = _aperture_size < 0 ? 3 : _aperture_size;
//    Point anchor( aperture_size/2, aperture_size/2 );

//    alvision.CV_Assert(src.type() == alvision.MatrixType.CV_8UC1 || src.type() == alvision.MatrixType.CV_32FC1 );
//    alvision.CV_Assert(eigenv.type() == alvision.MatrixType.CV_32FC1 );
//    alvision.CV_Assert( src.rows == eigenv.rows &&
//              ((mode > 0 && src.cols == eigenv.cols) ||
//              (mode == 0 && src.cols*6 == eigenv.cols)) );

//    let type = src.type();
//    int ftype = alvision.MatrixType.CV_32FC1;
//    double kernel_scale = type != ftype ? 1./255 : 1;

//    Mat dx2, dy2, dxdy(src.size(), CV_32F), kernel;

//    kernel = alvision.cvtest.calcSobelKernel2D( 1, 0, _aperture_size );
//    alvision.cvtest.filter2D( src, dx2, ftype, kernel*kernel_scale, anchor, 0, BORDER_REPLICATE );
//    kernel = alvision.cvtest.calcSobelKernel2D( 0, 1, _aperture_size );
//    alvision.cvtest.filter2D( src, dy2, ftype, kernel*kernel_scale, anchor, 0, BORDER_REPLICATE );

//    double denom = (1 << (aperture_size-1))*block_size;
//    denom = denom * denom;
//    if( _aperture_size < 0 )
//        denom *= 4;
//    denom = 1./denom;

//    for( i = 0; i < src.rows; i++ )
//    {
//        float* dxdyp = dxdy.ptr<float>(i);
//        float* dx2p = dx2.ptr<float>(i);
//        float* dy2p = dy2.ptr<float>(i);

//        for( j = 0; j < src.cols; j++ )
//        {
//            double xval = dx2p[j], yval = dy2p[j];
//            dxdyp[j] = (float)(xval*yval*denom);
//            dx2p[j] = (float)(xval*xval*denom);
//            dy2p[j] = (float)(yval*yval*denom);
//        }
//    }

//    kernel = Mat::ones(block_size, block_size, alvision.MatrixType.CV_32F);
//    anchor = Point(block_size/2, block_size/2);

//    alvision.cvtest.filter2D( dx2, dx2, ftype, kernel, anchor, 0, BORDER_REPLICATE );
//    alvision.cvtest.filter2D( dy2, dy2, ftype, kernel, anchor, 0, BORDER_REPLICATE );
//    alvision.cvtest.filter2D( dxdy, dxdy, ftype, kernel, anchor, 0, BORDER_REPLICATE );

//    if( mode == 0 )
//    {
//        for( i = 0; i < src.rows; i++ )
//        {
//            float* eigenvp = eigenv.ptr<float>(i);
//            float* ocv_eigenvp = ocv_eigenv.ptr<float>(i);
//            const float* dxdyp = dxdy.ptr<float>(i);
//            const float* dx2p = dx2.ptr<float>(i);
//            const float* dy2p = dy2.ptr<float>(i);

//            for( j = 0; j < src.cols; j++ )
//            {
//                double a = dx2p[j], b = dxdyp[j], c = dy2p[j];
//                double d = sqrt((a-c)*(a-c) + 4*b*b);
//                double l1 = 0.5*(a + c + d);
//                double l2 = 0.5*(a + c - d);
//                double x1, y1, x2, y2, s;

//                if( Math.abs(a - l1) + Math.abs(b) >= 1e-3 )
//                    x1 = b, y1 = l1 - a;
//                else
//                    x1 = l1 - c, y1 = b;
//                s = 1./(sqrt(x1*x1+y1*y1)+DBL_EPSILON);
//                x1 *= s; y1 *= s;

//                if( Math.abs(a - l2) + Math.abs(b) >= 1e-3 )
//                    x2 = b, y2 = l2 - a;
//                else
//                    x2 = l2 - c, y2 = b;
//                s = 1./(sqrt(x2*x2+y2*y2)+DBL_EPSILON);
//                x2 *= s; y2 *= s;

//                /* the orientation of eigen vectors might be inversed relative to OpenCV function,
//                   which is normal */
//                if( (Math.abs(x1) >= Math.abs(y1) && ocv_eigenvp[j*6+2]*x1 < 0) ||
//                    (Math.abs(x1) < Math.abs(y1) && ocv_eigenvp[j*6+3]*y1 < 0) )
//                    x1 = -x1, y1 = -y1;

//                if( (Math.abs(x2) >= Math.abs(y2) && ocv_eigenvp[j*6+4]*x2 < 0) ||
//                    (Math.abs(x2) < Math.abs(y2) && ocv_eigenvp[j*6+5]*y2 < 0) )
//                    x2 = -x2, y2 = -y2;

//                eigenvp[j*6] = (float)l1;
//                eigenvp[j*6+1] = (float)l2;
//                eigenvp[j*6+2] = (float)x1;
//                eigenvp[j*6+3] = (float)y1;
//                eigenvp[j*6+4] = (float)x2;
//                eigenvp[j*6+5] = (float)y2;
//            }
//        }
//    }
//    else if( mode == 1 )
//    {
//        for( i = 0; i < src.rows; i++ )
//        {
//            float* eigenvp = eigenv.ptr<float>(i);
//            const float* dxdyp = dxdy.ptr<float>(i);
//            const float* dx2p = dx2.ptr<float>(i);
//            const float* dy2p = dy2.ptr<float>(i);

//            for( j = 0; j < src.cols; j++ )
//            {
//                double a = dx2p[j], b = dxdyp[j], c = dy2p[j];
//                double d = sqrt((a-c)*(a-c) + 4*b*b);
//                eigenvp[j] = (float)(0.5*(a + c - d));
//            }
//        }
//    }
//}


//// min eigenval
//class CV_MinEigenValTest extends CV_FeatureSelBaseTest
//{
//    constructor() {
//        super(1);
//    }


//    run_func(): void {
//        cvCornerMinEigenVal(test_array[INPUT][0], test_array[OUTPUT][0],
//            block_size, aperture_size);
//    }
    
//    prepare_to_validation(test_case_idx: alvision.int): void {
//        test_cornerEigenValsVecs(test_mat[INPUT][0], test_mat[REF_OUTPUT][0],
//            test_mat[OUTPUT][0], block_size, aperture_size, 1);
//    }
//};



//// eigenval's & vec's
//class CV_EigenValVecTest extends CV_FeatureSelBaseTest
//{
//    constructor() {
//        super(6);
//    }

//    run_func(): void {
//        cvCornerEigenValsAndVecs(test_array[INPUT][0], test_array[OUTPUT][0],
//            block_size, aperture_size);
//    }
//    prepare_to_validation(test_case_idx: alvision.int): void {
//        test_cornerEigenValsVecs(test_mat[INPUT][0], test_mat[REF_OUTPUT][0],
//            test_mat[OUTPUT][0], block_size, aperture_size, 0);
//    }
//};



//// precornerdetect
//class CV_PreCornerDetectTest extends CV_FeatureSelBaseTest
//{
//    constructor() {
//        super(1);
//    }

//    run_func(): void {
//        cvPreCornerDetect(test_array[INPUT][0], test_array[OUTPUT][0], aperture_size);
//    }
//    prepare_to_validation(test_case_idx: alvision.int): void {
//        /*cvTsCornerEigenValsVecs( test_mat[INPUT][0], test_mat[REF_OUTPUT][0],
//                             block_size, aperture_size, 0 );*/
//        const Mat& src = test_mat[INPUT][0];
//        Mat & dst = test_mat[REF_OUTPUT][0];

//        let type = src.type(), ftype = CV_32FC1;
//        Point anchor(aperture_size / 2, aperture_size / 2);

//        double kernel_scale = type != ftype ? 1. / 255 : 1.;

//        Mat dx, dy, d2x, d2y, dxy, kernel;

//        kernel = alvision.cvtest.calcSobelKernel2D(1, 0, aperture_size);
//        alvision.cvtest.filter2D(src, dx, ftype, kernel * kernel_scale, anchor, 0, BORDER_REPLICATE);
//        kernel = alvision.cvtest.calcSobelKernel2D(2, 0, aperture_size);
//        alvision.cvtest.filter2D(src, d2x, ftype, kernel * kernel_scale, anchor, 0, BORDER_REPLICATE);
//        kernel = alvision.cvtest.calcSobelKernel2D(0, 1, aperture_size);
//        alvision.cvtest.filter2D(src, dy, ftype, kernel * kernel_scale, anchor, 0, BORDER_REPLICATE);
//        kernel = alvision.cvtest.calcSobelKernel2D(0, 2, aperture_size);
//        alvision.cvtest.filter2D(src, d2y, ftype, kernel * kernel_scale, anchor, 0, BORDER_REPLICATE);
//        kernel = alvision.cvtest.calcSobelKernel2D(1, 1, aperture_size);
//        alvision.cvtest.filter2D(src, dxy, ftype, kernel * kernel_scale, anchor, 0, BORDER_REPLICATE);

//        double denom = 1 << (aperture_size - 1);
//        denom = denom * denom * denom;
//        denom = 1. / denom;

//        for (let i = 0; i < src.rows; i++ )
//        {
//            const float* _dx = dx.ptr<float>(i);
//            const float* _dy = dy.ptr<float>(i);
//            const float* _d2x = d2x.ptr<float>(i);
//            const float* _d2y = d2y.ptr<float>(i);
//            const float* _dxy = dxy.ptr<float>(i);
//            float * corner = dst.ptr<float>(i);

//            for (int j = 0; j < src.cols; j++ )
//            {
//                double x = _dx[j];
//                double y = _dy[j];

//                corner[j] = (float)(denom * (x * x * _d2y[j] + y * y * _d2x[j] - 2 * x * y * _dxy[j]));
//            }
//        }

//    }
//    prepare_test_case(test_case_idx: alvision.int): alvision.int {
//        int code = CV_FeatureSelBaseTest::prepare_test_case(test_case_idx);
//        if (aperture_size < 0)
//            aperture_size = 3;
//        return code;
//    }
//};




/////////// integral /////////

//class CV_IntegralTest extends alvision.cvtest.ArrayTest
//{
//    constructor() {
//        super();
//        this.test_array[this.INPUT].push(null);
//        this.test_array[this.OUTPUT].push(null);
//        this.test_array[this.OUTPUT].push(null);
//        this.test_array[this.OUTPUT].push(null);
//        this.test_array[this.REF_OUTPUT].push(null);
//        this.test_array[this.REF_OUTPUT].push(null);
//        this.test_array[this.REF_OUTPUT].push(null);
//        this.element_wise_relative_error = true;
//    }

//    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
//        var rng = this.ts.get_rng();
//        int depth = alvision.cvtest.randInt(rng) % 2, sum_depth;
//        int cn = alvision.cvtest.randInt(rng) % 3 + 1;
//        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
//        Size sum_size;

//        depth = depth == 0 ? alvision.MatrixType.CV_8U : alvision.MatrixType.CV_32F;
//        cn += cn == 2;
//        int b = (alvision.cvtest.randInt(rng) & 1) != 0;
//        sum_depth = depth == alvision.MatrixType.CV_8U && b ? alvision.MatrixType.CV_32S : b ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_64F;

//        types[INPUT][0] = CV_MAKETYPE(depth, cn);
//        types[OUTPUT][0] = types[REF_OUTPUT][0] =
//            types[OUTPUT][2] = types[REF_OUTPUT][2] = alvision.MatrixType.CV_MAKETYPE(sum_depth, cn);
//        types[OUTPUT][1] = types[REF_OUTPUT][1] = alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_64F, cn);

//        sum_size.width = sizes[INPUT][0].width + 1;
//        sum_size.height = sizes[INPUT][0].height + 1;

//        sizes[OUTPUT][0] = sizes[REF_OUTPUT][0] = sum_size;
//        sizes[OUTPUT][1] = sizes[REF_OUTPUT][1] =
//            sizes[OUTPUT][2] = sizes[REF_OUTPUT][2] = Size(0, 0);

//        if (alvision.cvtest.randInt(rng) % 3 > 0) {
//            sizes[OUTPUT][1] = sizes[REF_OUTPUT][1] = sum_size;
//            if (alvision.cvtest.randInt(rng) % 2 > 0)
//                sizes[REF_OUTPUT][2] = sizes[OUTPUT][2] = sum_size;
//        }
//    }
//    get_minmax_bounds(i: alvision.int, j: alvision.int, type: alvision.int, low: alvision.Scalar, high: alvision.Scalar): void{
//        super.get_minmax_bounds(i, j, type, low, high);
//        int depth = CV_MAT_DEPTH(type);
//        if (depth == alvision.MatrixType.CV_32F) {
//            low = Scalar.all(-10.);
//            high = Scalar.all(10.);
//        }
//    }
//    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
//        int depth = test_mat[i][j].depth();
//        return depth == alvision.MatrixType.CV_32S ? 0 : depth == alvision.MatrixType.CV_64F ? alvision.FLT_EPSILON : 5e-3;
//    }
//    run_func(): void {
//        cvIntegral(test_array[INPUT][0], test_array[OUTPUT][0],
//            test_array[OUTPUT][1], test_array[OUTPUT][2]);
//    }
//    prepare_to_validation(test_case_idx: alvision.int): void {
//        Mat & src = test_mat[INPUT][0];
//        int cn = src.channels();

//        Mat * sum0 = &test_mat[REF_OUTPUT][0];
//        Mat * sqsum0 = test_array[REF_OUTPUT][1] ? &test_mat[REF_OUTPUT][1] : 0;
//        Mat * tsum0 = test_array[REF_OUTPUT][2] ? &test_mat[REF_OUTPUT][2] : 0;

//        Mat plane, srcf, psum, psqsum, ptsum, psum2, psqsum2, ptsum2;
//        if (cn == 1) {
//            plane = src;
//            psum2 = *sum0;
//            psqsum2 = sqsum0 ? *sqsum0 : Mat();
//            ptsum2 = tsum0 ? *tsum0 : Mat();
//        }

//        for (let i = 0; i < cn; i++ )
//        {
//            if (cn > 1)
//                alvision.cvtest.extract(src, plane, i);
//            plane.convertTo(srcf, alvision.MatrixType.CV_32F);

//            test_integral(srcf, &psum, sqsum0 ? &psqsum : 0, tsum0 ? &ptsum : 0);
//            psum.convertTo(psum2, sum0.depth());
//            if (sqsum0)
//                psqsum.convertTo(psqsum2, sqsum0.depth());
//            if (tsum0)
//                ptsum.convertTo(ptsum2, tsum0.depth());

//            if (cn > 1) {
//                alvision.cvtest.insert(psum2, *sum0, i);
//                if (sqsum0)
//                    alvision.cvtest.insert(psqsum2, *sqsum0, i);
//                if (tsum0)
//                    alvision.cvtest.insert(ptsum2, *tsum0, i);
//            }
//        }
//    }

//    prepare_test_case(test_case_idx: alvision.int): alvision.int{
//        int code = super.prepare_test_case(test_case_idx);
//        return code > 0 && ((test_array[OUTPUT][2] && test_mat[OUTPUT][2].channels() > 1) ||
//            test_mat[OUTPUT][0].depth() < test_mat[INPUT][0].depth()) ? 0 : code;
//    }
//};



//function test_integral(img: alvision.Mat, sum: alvision.Mat, sqsum: alvision.Mat, tilted: alvision.Mat) : void
//{
//    alvision.CV_Assert(img.depth() == alvision.MatrixType.CV_32F );

//    sum.create(img.rows + 1, img.cols + 1, alvision.MatrixType.CV_64F);
//    if( sqsum )
//        sqsum.create(img.rows+1, img.cols+1, CV_64F);
//    if( tilted )
//        tilted.create(img.rows+1, img.cols+1, CV_64F);

//    const float* data = img.ptr<float>();
//    double* sdata = sum.ptr<double>();
//    double* sqdata = sqsum ? sqsum.ptr<double>() : 0;
//    double* tdata = tilted ? tilted.ptr<double>() : 0;
//    int step = (int)(img.step/sizeof(data[0]));
//    int sstep = (int)(sum.step/sizeof(sdata[0]));
//    int sqstep = sqsum ? (int)(sqsum.step/sizeof(sqdata[0])) : 0;
//    int tstep = tilted ? (int)(tilted.step/sizeof(tdata[0])) : 0;
//    Size size = img.size();

//    memset( sdata, 0, (size.width+1)*sizeof(sdata[0]) );
//    if( sqsum )
//        memset( sqdata, 0, (size.width+1)*sizeof(sqdata[0]) );
//    if( tilted )
//        memset( tdata, 0, (size.width+1)*sizeof(tdata[0]) );

//    for( ; size.height--; data += step )
//    {
//        double s = 0, sq = 0;
//        int x;
//        sdata += sstep;
//        sqdata += sqstep;
//        tdata += tstep;

//        for( x = 0; x <= size.width; x++ )
//        {
//            double t = x > 0 ? data[x-1] : 0, ts = t;
//            s += t;
//            sq += t*t;

//            sdata[x] = s + sdata[x - sstep];
//            if( sqdata )
//                sqdata[x] = sq + sqdata[x - sqstep];

//            if( !tdata )
//                continue;

//            if( x == 0 )
//                ts += tdata[-tstep+1];
//            else
//            {
//                ts += tdata[x-tstep-1];
//                if( data > img.ptr<float>() )
//                {
//                    ts += data[x-step-1];
//                    if( x < size.width )
//                        ts += tdata[x-tstep+1] - tdata[x-tstep*2];
//                }
//            }

//            tdata[x] = ts;
//        }
//    }
//}



/////////////////////////////////////////////////////////////////////////////////////

//alvision.cvtest.TEST('Imgproc_Erode', 'accuracy', () => { CV_ErodeTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_Dilate', 'accuracy', () => { CV_DilateTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_MorphologyEx', 'accuracy', () => { CV_MorphExTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_Filter2D', 'accuracy', () => { CV_FilterTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_Sobel', 'accuracy', () => { CV_SobelTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_Laplace', 'accuracy', () => { CV_LaplaceTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_Blur', 'accuracy', () => { CV_BlurTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_GaussianBlur', 'accuracy', () => { CV_GaussianBlurTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_MedianBlur', 'accuracy', () => { CV_MedianBlurTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_PyramidDown', 'accuracy', () => { CV_PyramidDownTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_PyramidUp', 'accuracy', () => { CV_PyramidUpTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_MinEigenVal', 'accuracy', () => { CV_MinEigenValTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_EigenValsVecs', 'accuracy', () => { CV_EigenValVecTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_PreCornerDetect', 'accuracy', () => { CV_PreCornerDetectTest test; test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_Integral', 'accuracy', () => { CV_IntegralTest test; test.safe_run(); });

////////////////////////////////////////////////////////////////////////////////////

//class CV_FilterSupportedFormatsTest  extends alvision.cvtest.BaseTest
//{
//    run(iii: alvision.int) : void
//    {
//        const depths/*[][2]*/ =
//        [
//            [alvision.MatrixType.CV_8U, alvision.MatrixType.CV_8U],
//            [alvision.MatrixType.CV_8U, alvision.MatrixType.CV_16U],
//            [alvision.MatrixType.CV_8U, alvision.MatrixType.CV_16S],
//            [alvision.MatrixType.CV_8U, alvision.MatrixType.CV_32F],
//            [alvision.MatrixType.CV_8U, alvision.MatrixType.CV_64F],
//            [alvision.MatrixType.CV_16U, alvision.MatrixType.CV_16U],
//            [alvision.MatrixType.CV_16U, alvision.MatrixType.CV_32F],
//            [alvision.MatrixType.CV_16U, alvision.MatrixType.CV_64F],
//            [alvision.MatrixType.CV_16S, alvision.MatrixType.CV_16S],
//            [alvision.MatrixType.CV_16S, alvision.MatrixType.CV_32F],
//            [alvision.MatrixType.CV_16S, alvision.MatrixType.CV_64F],
//            [alvision.MatrixType.CV_32F, alvision.MatrixType.CV_32F],
//            [alvision.MatrixType.CV_64F, alvision.MatrixType.CV_64F],
//            [-1, -1]
//        ];

//        int i = 0;
//        volatile int fidx = -1;
//        try
//        {
//            // use some "odd" size to do yet another smoke
//            // testing of the non-SIMD loop tails
//            Size sz(163, 117);
//            Mat small_kernel(5, 5, alvision.MatrixType.CV_32F), big_kernel(21, 21, alvision.MatrixType.CV_32F);
//            Mat kernelX(11, 1, alvision.MatrixType.CV_32F), kernelY(7, 1, alvision.MatrixType.CV_32F);
//            Mat symkernelX(11, 1, alvision.MatrixType.CV_32F), symkernelY(7, 1, alvision.MatrixType.CV_32F);
//            alvision.randu(small_kernel, -10, 10);
//            alvision.randu(big_kernel, -1, 1);
//            alvision.randu(kernelX, -1, 1);
//            alvision.randu(kernelY, -1, 1);
//            flip(kernelX, symkernelX, 0);
//            symkernelX += kernelX;
//            flip(kernelY, symkernelY, 0);
//            symkernelY += kernelY;

//            Mat elem_ellipse = getStructuringElement(MORPH_ELLIPSE, Size(7, 7));
//            Mat elem_rect = getStructuringElement(MORPH_RECT, Size(7, 7));

//            for( i = 0; depths[i][0] >= 0; i++ )
//            {
//                var sdepth = depths[i][0];
//                var ddepth = depths[i][1];
//                Mat src(sz, alvision.MatrixType.CV_MAKETYPE(sdepth, 5)), dst;
//                alvision.randu(src, 0, 100);
//                // non-separable filtering with a small kernel
//                fidx = 0;
//                alvision.filter2D(src, dst, ddepth, small_kernel);
//                fidx++;
//                alvision.filter2D(src, dst, ddepth, big_kernel);
//                fidx++;
//                alvision.sepFilter2D(src, dst, ddepth, kernelX, kernelY);
//                fidx++;
//                alvision.sepFilter2D(src, dst, ddepth, symkernelX, symkernelY);
//                fidx++;
//                alvision.Sobel(src, dst, ddepth, 2, 0, 5);
//                fidx++;
//                Scharr(src, dst, ddepth, 0, 1);
//                if( sdepth != ddepth )
//                    continue;
//                fidx++;
//                GaussianBlur(src, dst, Size(5, 5), 1.2, 1.2);
//                fidx++;
//                blur(src, dst, Size(11, 11));
//                fidx++;
//                morphologyEx(src, dst, MORPH_GRADIENT, elem_ellipse);
//                fidx++;
//                morphologyEx(src, dst, MORPH_GRADIENT, elem_rect);
//            }
//        }
//        catch(e)
//        {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Combination of depths %d => %d in %s is not supported (yet it should be)",
//                       depths[i][0], depths[i][1],
//                       fidx == 0 ? "filter2D (small kernel)" :
//                       fidx == 1 ? "filter2D (large kernel)" :
//                       fidx == 2 ? "sepFilter2D" :
//                       fidx == 3 ? "sepFilter2D (symmetrical/asymmetrical kernel)" :
//                       fidx == 4 ? "Sobel" :
//                       fidx == 5 ? "Scharr" :
//                       fidx == 6 ? "GaussianBlur" :
//                       fidx == 7 ? "blur" :
//                       fidx == 8 || fidx == 9 ? "morphologyEx" :
//                       "unknown???");

//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
//        }
//    }
//};

//alvision.cvtest.TEST('Imgproc_Filtering', 'supportedFormats', () => { CV_FilterSupportedFormatsTest test; test.safe_run(); });

//alvision.cvtest.TEST('Imgproc_Blur', 'borderTypes', () => {
//    Size kernelSize(3, 3);

//    /// ksize > src_roi.size()
//    Mat src(3, 3, alvision.MatrixType.CV_8UC1, alvision.Scalar.all(255)), dst;
//    Mat src_roi = src(Rect(1, 1, 1, 1));
//    src_roi.setTo(alvision.Scalar.all(0));

//    // should work like !BORDER_ISOLATED
//    blur(src_roi, dst, kernelSize, Point(-1, -1), BORDER_REPLICATE);
//    alvision.EXPECT_EQ(227, dst.at<uchar>(0, 0));

//    // should work like BORDER_ISOLATED
//    blur(src_roi, dst, kernelSize, Point(-1, -1), BORDER_REPLICATE | BORDER_ISOLATED);
//    alvision.EXPECT_EQ(0, dst.at<uchar>(0, 0));

//    /// ksize <= src_roi.size()
//    src = Mat(5, 5, alvision.MatrixType. CV_8UC1, alvision.Scalar(255));
//    src_roi = src(Rect(1, 1, 3, 3));
//    src_roi.setTo(0);
//    src.at<uchar>(2, 2) = 255;

//    // should work like !BORDER_ISOLATED
//    blur(src_roi, dst, kernelSize, Point(-1, -1), BORDER_REPLICATE);
//    Mat expected_dst =
//        (Mat_<uchar>(3, 3) << 170, 113, 170, 113, 28, 113, 170, 113, 170);
//    alvision.EXPECT_EQ(expected_dst.type(), dst.type());
//    alvision.EXPECT_EQ(expected_dst.size(), dst.size());
//    EXPECT_DOUBLE_EQ(0.0, alvision.cvtest.norm(expected_dst, dst, NORM_INF));
//});

//alvision.cvtest.TEST('Imgproc_Morphology', 'iterated',()=>
//{
//    var rng = alvision.theRNG();
//    for( int iter = 0; iter < 30; iter++ )
//    {
//        int width = rng.uniform(5, 33);
//        int height = rng.uniform(5, 33);
//        int cn = rng.uniform(1, 5);
//        int iterations = rng.uniform(1, 11);
//        int op = rng.uniform(0, 2);
//        Mat src(height, width, CV_8UC(cn)), dst0, dst1, dst2;

//        randu(src, 0, 256);
//        if( op == 0 )
//            dilate(src, dst0, Mat(), Point(-1,-1), iterations);
//        else
//            erode(src, dst0, Mat(), Point(-1,-1), iterations);

//        for( int i = 0; i < iterations; i++ )
//            if( op == 0 )
//                dilate(i == 0 ? src : dst1, dst1, Mat(), Point(-1,-1), 1);
//            else
//                erode(i == 0 ? src : dst1, dst1, Mat(), Point(-1,-1), 1);

//        Mat kern = getStructuringElement(MORPH_RECT, Size(3,3));
//        if( op == 0 )
//            dilate(src, dst2, kern, Point(-1,-1), iterations);
//        else
//            erode(src, dst2, kern, Point(-1,-1), iterations);
//        ASSERT_EQ(0.0, norm(dst0, dst1, NORM_INF));
//        ASSERT_EQ(0.0, norm(dst0, dst2, NORM_INF));
//    }
//});