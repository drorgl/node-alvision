/*M///////////////////////////////////////////////////////////////////////////////////////
//
//  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
//
//  By downloading, copying, installing or using the software you agree to this license.
//  If you do not agree to this license, do not download, install,
//  copy or use the software.
//
//
//                        Intel License Agreement
//                For Open Source Computer Vision Library
//
// Copyright (C) 2000, Intel Corporation, all rights reserved.
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
//   * The name of Intel Corporation may not be used to endorse or promote products
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
//
//using namespace cv;
//using namespace std;

/////////////////////////// base test class for color transformations /////////////////////////

class CV_ColorCvtBaseTest extends alvision.cvtest.ArrayTest {
    constructor(_custom_inv_transform: boolean, _allow_32f: boolean, _allow_16u: boolean) {
        super();

        this.test_array[this.INPUT].push(null);
        this.test_array[this.OUTPUT].push(null);
        this.test_array[this.OUTPUT].push(null);
        this.test_array[this.REF_OUTPUT].push(null);
        this.test_array[this.REF_OUTPUT].push(null);
        this.allow_16u = _allow_16u;
        this.allow_32f = _allow_32f;
        this.custom_inv_transform = _custom_inv_transform;
        this.fwd_code = this.inv_code = -1;
        this.element_wise_relative_error = false;

        this.fwd_code_str = this.inv_code_str = "";

        this.test_cpp = false;
        this.hue_range = 0;
        this.blue_idx = 0;
        this.inplace = false;
    }

    prepare_test_case(test_case_idx: alvision.int): alvision.int {
        var code = super.prepare_test_case(test_case_idx);
        if (code > 0 && this.inplace)
            alvision.cvtest.copy(this.test_mat[this.INPUT][0], this.test_mat[this.OUTPUT][0]);
        return code;
    }
    prepare_to_validation(test_case_idx: alvision.int): void {

        this.convert_forward(this.test_mat[this.INPUT][0], this.test_mat[this.REF_OUTPUT][0]);
        this.convert_backward(this.test_mat[this.INPUT][0], this.test_mat[this.REF_OUTPUT][0],
            this.test_mat[this.REF_OUTPUT][1]);
        var depth = this.test_mat[this.REF_OUTPUT][0].depth();
        if (depth == alvision.MatrixType.CV_8U && this.hue_range) {
            for (var y = 0; y < this.test_mat[this.REF_OUTPUT][0].rows(); y++ )
            {
                var h0 = this.test_mat[this.REF_OUTPUT][0].ptr<alvision.uchar>("uchar",y);
                var h =  this.test_mat[this.OUTPUT][0].ptr<alvision.uchar>("uchar",y);
                var h0pos = 0;
                var hpos = 0;
                for (var x = 0; x < this.test_mat[this.REF_OUTPUT][0].cols(); x++ , h0pos += 3, hpos += 3) {
                    if (Math.abs(<any>h[hpos] - <any>h0[h0pos]) >= this.hue_range.valueOf() - 1 && (h[hpos] <= 1 || h0[h0pos] <= 1))
                    h[hpos] = h0[h0pos] = 0;
                }
            }
        }
    }
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        var rng = this.ts.get_rng();
        //int depth, cn;
        var depth : number;
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);

        if (this.allow_16u && this.allow_32f) {
            depth = alvision.cvtest.randInt(rng).valueOf() % 3;
            depth = depth == 0 ? alvision.MatrixType.CV_8U : depth == 1 ? alvision.MatrixType.CV_16U : alvision.MatrixType.CV_32F;
        }
        else if (this.allow_16u || this.allow_32f) {
            depth = alvision.cvtest.randInt(rng).valueOf() % 2;
            depth = depth == 0 ? alvision.MatrixType.CV_8U : this.allow_16u ? alvision.MatrixType.CV_16U : alvision.MatrixType.CV_32F;
        }
        else
            depth = alvision.MatrixType.CV_8U;

        var cn = (alvision.cvtest.randInt(rng).valueOf() & 1) + 3;
        this.blue_idx = alvision.cvtest.randInt(rng).valueOf() & 1 ? 2 : 0;

        types[this.INPUT][0] = alvision.MatrixType.CV_MAKETYPE(depth, cn);
        types[this.OUTPUT][0] = types[this.REF_OUTPUT][0] = alvision.MatrixType.CV_MAKETYPE(depth, 3);
        if (this.test_array[this.OUTPUT].length > 1)
            types[this.OUTPUT][1] = types[this.REF_OUTPUT][1] = alvision.MatrixType.CV_MAKETYPE(depth, cn);

        this.inplace = cn == 3 && alvision.cvtest.randInt(rng).valueOf() % 2 != 0;
        this.test_cpp = (alvision.cvtest.randInt(rng).valueOf() & 256) == 0;
    }
    get_minmax_bounds(i: alvision.int, j: alvision.int, type: alvision.int, low: alvision.Scalar, high: alvision.Scalar ): void {
        super.get_minmax_bounds(i, j, type, low, high);
        if (i == this.INPUT) {
            var depth = alvision.MatrixType.CV_MAT_DEPTH(type);
            low = alvision.Scalar.all(0.);
            high = alvision.Scalar.all(depth == alvision.MatrixType.CV_8U ? 256 : depth == alvision.MatrixType.CV_16U ? 65536 : 1.);
        }
    }

    // input --- fwd_transform . ref_output[0]
    convert_forward(src: alvision.Mat, dst: alvision.Mat): void {
        const c8u = 0.0039215686274509803; // 1./255
        const c16u = 1.5259021896696422e-005; // 1./65535
        var depth = src.depth();
        var cn = src.channels(), dst_cn = dst.channels();
        var cols = src.cols(), dst_cols_n = dst.cols().valueOf() * dst_cn.valueOf();
        var _src_buf = new Array<alvision.float>(src.cols().valueOf() * 3);
        var _dst_buf = new Array<alvision.float>(dst.cols().valueOf() * 3);
        var src_buf = _src_buf;
        var dst_buf = _dst_buf;
        //int j;

        alvision.assert(()=>(cn == 3 || cn == 4) && (dst_cn == 3 || dst_cn == 1));

        for (var i = 0; i < src.rows(); i++) {
            switch (depth) {
                case alvision.MatrixType.CV_8U:
                    {
                        const src_row = src.ptr<alvision.uchar>("uchar",i);
                        let dst_row = dst.ptr<alvision.uchar>("uchar",i);

                        for (let j = 0; j < cols; j++) {
                            src_buf[j * 3] =     <any>src_row[j * cn.valueOf() + this.blue_idx.valueOf()] * c8u;
                            src_buf[j * 3 + 1] = <any>src_row[j * cn.valueOf() + 1] * c8u;
                            src_buf[j * 3 + 2] = <any>src_row[j * cn.valueOf() + (this.blue_idx.valueOf() ^ 2)] * c8u;
                        }

                        this.convert_row_bgr2abc_32f_c3(src_buf, dst_buf, cols);

                        for (let j = 0; j < dst_cols_n; j++) {
                            var t = Math.round(dst_buf[j].valueOf());
                            dst_row[j] = alvision.saturate_cast<alvision.uchar>(t,"uchar");
                        }
                    }
                    break;
                case alvision.MatrixType.CV_16U:
                    {
                        const src_row = src.ptr<alvision.ushort>("ushort",i);
                        let dst_row = dst.ptr<alvision.ushort>("ushort",i);

                        for (let j = 0; j < cols; j++) {
                            src_buf[j * 3] = src_row[j * cn.valueOf() + this.blue_idx.valueOf()].valueOf() * c16u;
                            src_buf[j * 3 + 1] = src_row[j * cn.valueOf() + 1].valueOf() * c16u;
                            src_buf[j * 3 + 2] = src_row[j * cn.valueOf() + (this.blue_idx.valueOf() ^ 2)].valueOf() * c16u;
                        }

                        this.convert_row_bgr2abc_32f_c3(src_buf, dst_buf, cols);

                        for (let j = 0; j < dst_cols_n; j++) {
                            let t = Math.round(dst_buf[j].valueOf());
                            dst_row[j] = alvision.saturate_cast<alvision.ushort>(t,"ushort");
                        }
                    }
                    break;
                case alvision.MatrixType.CV_32F:
                    {
                        const src_row = src.ptr<alvision.float>("float",i);
                        let dst_row = dst.ptr<alvision.float>("float",i);

                        for (let j = 0; j < cols; j++) {
                            src_buf[j * 3] = src_row[j *     cn.valueOf() + this.blue_idx.valueOf()].valueOf();
                            src_buf[j * 3 + 1] = src_row[j * cn.valueOf() + 1].valueOf();
                            src_buf[j * 3 + 2] = src_row[j * cn.valueOf() + (this.blue_idx.valueOf() ^ 2)].valueOf();
                        }

                        this.convert_row_bgr2abc_32f_c3(src_buf, dst_row, cols);
                    }
                    break;
                default:
                    alvision.assert(() => false);
            }
        }
    }
    // ref_output[0] --- inv_transform --. ref_output[1] (or input -- copy -. ref_output[1])
    convert_backward(src: alvision.Mat, dst: alvision.Mat, dst2: alvision.Mat): void {
        if (this.custom_inv_transform) {
            var depth = src.depth();
            var src_cn = dst.channels(), cn = dst2.channels();
            var cols_n = src.cols().valueOf() * src_cn.valueOf(), dst_cols = dst.cols();
            var _src_buf = new Array<alvision.float> (src.cols().valueOf() * 3);
            var _dst_buf = new Array<alvision.float> (dst.cols().valueOf() * 3);
            var src_buf = _src_buf;
            var dst_buf = _dst_buf;
            //int j;

            alvision.assert(()=>cn == 3 || cn == 4);

            for (let i = 0; i < src.rows(); i++) {
                switch (depth) {
                    case alvision.MatrixType.CV_8U:
                        {
                            const src_row = dst.ptr<alvision.uchar>("uchar",i);
                            let dst_row = dst2.ptr<alvision.uchar>("uchar",i);

                            for (let j = 0; j < cols_n; j++)
                                src_buf[j] = <any>src_row[j];

                            this.convert_row_abc2bgr_32f_c3(src_buf, dst_buf, dst_cols);

                            for (let j = 0; j < dst_cols; j++) {
                                var b = Math.round(dst_buf[j * 3].valueOf() * 255.);
                                var g = Math.round(dst_buf[j * 3 + 1].valueOf() * 255.);
                                var r = Math.round(dst_buf[j * 3 + 2].valueOf() * 255.);
                                dst_row[j * cn.valueOf() + this.blue_idx.valueOf()] = alvision.saturate_cast<alvision.uchar>(b,"uchar");
                                dst_row[j * cn.valueOf() + 1] = alvision.saturate_cast<alvision.uchar>(g,"uchar");
                                dst_row[j * cn.valueOf() + (this.blue_idx.valueOf() ^ 2)] = alvision.saturate_cast<alvision.uchar>(r,"uchar");
                                if (cn == 4)
                                    dst_row[j * cn.valueOf() + 3] = 255;
                            }
                        }
                        break;
                    case alvision.MatrixType.CV_16U:
                        {
                            const src_row = dst.ptr<alvision.ushort>("ushort",i);
                            let dst_row = dst2.ptr<alvision.ushort>("ushort",i);

                            for (let j = 0; j < cols_n; j++)
                                src_buf[j] = src_row[j];

                            this.convert_row_abc2bgr_32f_c3(src_buf, dst_buf, dst_cols);

                            for (let j = 0; j < dst_cols; j++) {
                                var b = Math.round(dst_buf[j * 3].valueOf() * 65535.);
                                var g = Math.round(dst_buf[j * 3 + 1].valueOf() * 65535.);
                                var r = Math.round(dst_buf[j * 3 + 2].valueOf() * 65535.);
                                dst_row[j * cn.valueOf() + this.blue_idx.valueOf()] = alvision.saturate_cast<alvision.ushort>(b,"ushort");
                                dst_row[j * cn.valueOf() + 1] = alvision.saturate_cast<alvision.ushort>(g,"ushort");
                                dst_row[j * cn.valueOf() + (this.blue_idx.valueOf() ^ 2)] = alvision.saturate_cast<alvision.ushort>(r,"ushort");
                                if (cn == 4)
                                    dst_row[j * cn.valueOf() + 3] = 65535;
                            }
                        }
                        break;
                    case alvision.MatrixType.CV_32F:
                        {
                            const src_row = dst.ptr<alvision.float>("float",i);
                            let dst_row = dst2.ptr<alvision.float>("float",i);

                            this.convert_row_abc2bgr_32f_c3(src_row, dst_buf, dst_cols);

                            for (let j = 0; j < dst_cols; j++) {
                                let b = dst_buf[j * 3];
                                let g = dst_buf[j * 3 + 1];
                                let r = dst_buf[j * 3 + 2];
                                dst_row[j * cn.valueOf() + this.blue_idx.valueOf()] = b;
                                dst_row[j * cn.valueOf() + 1] = g;
                                dst_row[j * cn.valueOf() + (this.blue_idx.valueOf() ^ 2)] = r;
                                if (cn == 4)
                                    dst_row[j * cn.valueOf() + 3] = 1.;
                            }
                        }
                        break;
                    default:
                        alvision.assert(() => false);
                }
            }
        }
        else {
            //int j, k;
            var elem_size = src.elemSize(), elem_size1 = src.elemSize1();
            var width_n = src.cols().valueOf() * elem_size.valueOf();

            for (var i = 0; i < src.rows(); i++) {
                let dptr = dst2.ptr<alvision.uchar>("uchar", i);
                let sptr = src.ptr<alvision.uchar>("uchar", i);
                for (let n = 0; n < width_n; n++) {
                    dptr[n] = sptr[n];
                }

                //memcpy(dst2.ptr(i), src.ptr(i), width_n);
                if (src.channels() == 4) {
                    // clear the alpha channel
                    let ptr = <any>dst2.ptr<alvision.uchar>("uchar",i) + elem_size1.valueOf() * 3;
                    for (let j = 0; j < width_n; j += elem_size.valueOf()) {
                        for (var k = 0; k < elem_size1; k++)
                            ptr[j + k] = 0;
                    }
                }
            }
        }
    }

    // called from default implementation of convert_forward
    convert_row_bgr2abc_32f_c3(src_row: Array<alvision.float>, dst_row : Array<alvision.float>, n  : alvision.int ): void {

    }

    // called from default implementation of convert_backward
    convert_row_abc2bgr_32f_c3(src_row: Array<alvision.float>, dst_row: Array<alvision.float>, n: alvision.int): void {
    }

    protected fwd_code_str: string;
    protected inv_code_str: string;

    run_func(): void {
        var out0 = this.test_array[this.OUTPUT][0];
        var _out0 = out0, _out1 = this.test_array[this.OUTPUT][1];

        //if (!test_cpp)
        //    alvision.cvtColor(inplace ? out0 : test_array[INPUT][0], out0, fwd_code);
        //else
        alvision.cvtColor(this.inplace ? out0 : this.test_array[this.INPUT][0], _out0, <alvision.ColorConversionCodes>this.fwd_code, _out0.channels());

        if (this.inplace) {
            (<alvision.Mat>out0).copyTo(this.test_array[this.OUTPUT][1]);
            out0 = this.test_array[this.OUTPUT][1];
        }
        //if (!test_cpp)
        //    cvCvtColor(out0, test_array[OUTPUT][1], inv_code);
        //else
        alvision.cvtColor(out0, _out1, <alvision.ColorConversionCodes>this.inv_code, _out1.channels());

    }

    protected allow_16u: boolean;
    protected allow_32f: boolean;
    protected blue_idx: alvision.int;
    protected inplace: boolean;
    protected custom_inv_transform: boolean;
    protected fwd_code: alvision.int
    protected inv_code: alvision.int;
    protected test_cpp: boolean;
    protected hue_range: alvision.int;
}


    
//}




//#undef INIT_FWD_INV_CODES
//#define INIT_FWD_INV_CODES( fwd, inv )          \
//    fwd_code = CV_##fwd; inv_code = CV_##inv;   \
//    fwd_code_str = #fwd; inv_code_str = #inv

//// rgb <=> gray
class CV_ColorGrayTest extends CV_ColorCvtBaseTest {
    constructor() {
        super(true, true, true);
        //INIT_FWD_INV_CODES(BGR2GRAY, GRAY2BGR);
        this.fwd_code = alvision.ColorConversionCodes.COLOR_BGR2GRAY;
        this.inv_code = alvision.ColorConversionCodes.COLOR_GRAY2BGR;
        this.fwd_code_str = "BGR2GRAY";
        this.inv_code_str = "GRAY2BGR";

    }
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
        var cn = alvision.MatrixType.CV_MAT_CN(types[this.INPUT][0]);
        types[this.OUTPUT][0] = types[this.REF_OUTPUT][0] = types[this.INPUT][0].valueOf() & alvision.CV_MAT_DEPTH_MASK;
        this.inplace = false;

        if (cn == 3) {
            if (this.blue_idx == 0)
                this.fwd_code = alvision.ColorConversionCodes.COLOR_BGR2GRAY, this.inv_code = alvision.ColorConversionCodes.COLOR_GRAY2BGR;
            else
                this.fwd_code =alvision.ColorConversionCodes.COLOR_RGB2GRAY  , this.inv_code = alvision.ColorConversionCodes.COLOR_GRAY2BGR;
        }
        else {
            if (this.blue_idx == 0)
                this.fwd_code = alvision.ColorConversionCodes.COLOR_BGRA2GRAY, this.inv_code = alvision.ColorConversionCodes.COLOR_GRAY2BGRA ;
            else
                this.fwd_code = alvision.ColorConversionCodes.COLOR_RGBA2GRAY, this.inv_code = alvision.ColorConversionCodes.COLOR_GRAY2BGRA;
        }
    }
    convert_row_bgr2abc_32f_c3(src_row: Array<alvision.float>, dst_row : Array<alvision.float>, n  : alvision.int ): void {
        var depth = this.test_mat[this.INPUT][0].depth();
        var scale = depth == alvision.MatrixType.CV_8U ? 255 : depth == alvision.MatrixType.CV_16U ? 65535 : 1;
        var cr = 0.299 * scale;
        var cg = 0.587 * scale;
        var cb = 0.114 * scale;

        for (let j = 0; j < n; j++)
            dst_row[j] = (src_row[j * 3].valueOf() * cb + src_row[j * 3 + 1].valueOf() * cg + src_row[j * 3 + 2].valueOf() * cr);
    }
    convert_row_abc2bgr_32f_c3(src_row: Array<alvision.float>, dst_row : Array<alvision.float>, n  : alvision.int): void {
        var depth = this.test_mat[this.INPUT][0].depth();
        var scale = depth == alvision.MatrixType.CV_8U ? (1. / 255) : depth == alvision.MatrixType.CV_16U ? 1. / 65535 : 1.;
        for (var j = 0; j < n; j++)
            dst_row[j * 3] = dst_row[j * 3 + 1] = dst_row[j * 3 + 2] = src_row[j].valueOf() * scale;
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        var depth = this.test_mat[i.valueOf()][j.valueOf()].depth();
        return depth == alvision.MatrixType.CV_8U ? 2 : depth == alvision.MatrixType.CV_16U ? 16 : 1e-5;
    }
};



//// rgb <=> ycrcb
class CV_ColorYCrCbTest extends CV_ColorCvtBaseTest {
    constructor() {
        super(true, true, true);
        //INIT_FWD_INV_CODES(BGR2YCrCb, YCrCb2BGR);
        this.fwd_code = alvision.ColorConversionCodes.COLOR_BGR2YCrCb;
        this.inv_code = alvision.ColorConversionCodes.COLOR_YCrCb2BGR;
        this.fwd_code_str = "BGR2YCrCb";
        this.inv_code_str = "YCrCb2BGR";
    }

    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);

        if (this.blue_idx == 0)
            this.fwd_code = alvision.ColorConversionCodes.COLOR_BGR2YCrCb, this.inv_code = alvision.ColorConversionCodes.COLOR_YCrCb2BGR;
        else
            this.fwd_code = alvision.ColorConversionCodes.COLOR_RGB2YCrCb, this.inv_code = alvision.ColorConversionCodes.COLOR_YCrCb2RGB;
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        var depth = this.test_mat[i.valueOf()][j.valueOf()].depth();
        return depth == alvision.MatrixType.CV_8U ? 2 : depth == alvision.MatrixType.CV_16U ? 32 : 1e-3;

    }
    convert_row_bgr2abc_32f_c3(src_row: Array<alvision.float>, dst_row: Array<alvision.float>, n: alvision.int): void {
        var depth = this.test_mat[this.INPUT][0].depth();
        var scale = depth == alvision.MatrixType.CV_8U ? 255 : depth == alvision.MatrixType.CV_16U ? 65535 : 1;
        var bias = depth == alvision.MatrixType.CV_8U ? 128 : depth == alvision.MatrixType.CV_16U ? 32768 : 0.5;

        var M = [
            0.299, 0.587, 0.114,
            0.49981, -0.41853, -0.08128,
            -0.16864, -0.33107, 0.49970
        ];
        //int j;
        for (let j = 0; j < 9; j++)
            M[j] *= scale;

        for (let j = 0; j < n.valueOf() * 3; j += 3) {
            var r = src_row[j + 2];
            var g = src_row[j + 1];
            var b = src_row[j];
            var y = M[0] *  r.valueOf() + M[1] * g.valueOf() + M[2] * b.valueOf();
            var cr = M[3] * r.valueOf() + M[4] * g.valueOf() + M[5] * b.valueOf() + bias;
            var cb = M[6] * r.valueOf() + M[7] * g.valueOf() + M[8] * b.valueOf() + bias;
            dst_row[j] =     y;
            dst_row[j + 1] = cr;
            dst_row[j + 2] = cb;
        }
    }
    convert_row_abc2bgr_32f_c3(src_row: Array<alvision.float>, dst_row: Array<alvision.float>, n: alvision.int): void {
        var depth = this.test_mat[this.INPUT][0].depth();
        var bias = depth == alvision.MatrixType.CV_8U ? 128 : depth == alvision.MatrixType.CV_16U ? 32768 : 0.5;
        var scale = depth == alvision.MatrixType.CV_8U ? 1. / 255 : depth == alvision.MatrixType.CV_16U ? 1. / 65535 : 1;
        var M = [
            1, 1.40252, 0,
            1, -0.71440, -0.34434,
            1, 0, 1.77305];
        //int j;
        for (var j = 0; j < 9; j++)
            M[j] *= scale;

        for (var j = 0; j < n.valueOf() * 3; j += 3) {
            var y = src_row[j];
            var cr = src_row[j + 1].valueOf() - bias;
            var cb = src_row[j + 2].valueOf() - bias;
            var r = M[0] * y.valueOf() + M[1] * cr + M[2] * cb;
            var g = M[3] * y.valueOf() + M[4] * cr + M[5] * cb;
            var b = M[6] * y.valueOf() + M[7] * cr + M[8] * cb;
            dst_row[j] =     b;
            dst_row[j + 1] = g;
            dst_row[j + 2] = r;
        }
    }
}

//// rgb <=> hsv
class CV_ColorHSVTest extends CV_ColorCvtBaseTest {
    constructor() {
        super(true, true, false);
        //INIT_FWD_INV_CODES(BGR2HSV, HSV2BGR);
        this.fwd_code = alvision.ColorConversionCodes.COLOR_BGR2HSV;
        this.inv_code = alvision.ColorConversionCodes.COLOR_HSV2BGR;
        this.fwd_code_str = "BGR2HSV";
        this.inv_code_str = "HSV2BGR";

        this.hue_range = 180;

    }
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
        var rng = this.ts.get_rng();

        var full_hrange = (rng.next().valueOf() & 256) != 0;
        if (full_hrange) {
            if (this.blue_idx == 0)
                this.fwd_code = alvision.ColorConversionCodes.COLOR_BGR2HSV_FULL, this.inv_code = alvision.ColorConversionCodes.COLOR_HSV2BGR_FULL;
            else
                this.fwd_code = alvision.ColorConversionCodes.COLOR_RGB2HSV_FULL, this.inv_code = alvision.ColorConversionCodes.COLOR_HSV2RGB_FULL;
            this.hue_range = 256;
        }
        else {
            if (this.blue_idx == 0)
                this.fwd_code = alvision.ColorConversionCodes.COLOR_BGR2HSV, this.inv_code = alvision.ColorConversionCodes.COLOR_HSV2BGR;
            else
                this.fwd_code = alvision.ColorConversionCodes.COLOR_RGB2HSV, this.inv_code = alvision.ColorConversionCodes.COLOR_HSV2RGB;
            this.hue_range = 180;
        }
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        var depth = this.test_mat[i.valueOf()][j.valueOf()].depth();
        return depth == alvision.MatrixType.CV_8U ? (j == 0 ? 4 : 16) : depth == alvision.MatrixType.CV_16U ? 32 : 1e-3;
    }
    convert_row_bgr2abc_32f_c3(src_row: Array<alvision.float>, dst_row: Array<alvision.float>, n: alvision.int): void {
        var depth = this.test_mat[this.INPUT][0].depth();
        var h_scale = depth == alvision.MatrixType.CV_8U ? this.hue_range.valueOf() * 30./ 180 : 60.;
        var scale = depth == alvision.MatrixType.CV_8U ? 255. : depth == alvision.MatrixType.CV_16U ? 65535. : 1.;
        //int j;

        for (var j = 0; j < n.valueOf() * 3; j += 3) {
            var r = src_row[j + 2];
            var g = src_row[j + 1];
            var b = src_row[j];
            var vmin = Math.min(r.valueOf(), g.valueOf());
            var v = Math.max(r.valueOf(), g.valueOf());
            var s, h, diff;
            vmin = Math.min(vmin, b.valueOf());
            v = Math.max(v, b.valueOf());
            diff = v - vmin;
            if (diff == 0)
                s = h = 0;
            else {
                s = diff / (v + alvision.FLT_EPSILON);
                diff = 1./ diff;

                h = r == v ? (g.valueOf() - b.valueOf()) * diff :
                    g == v ? 2 + (b.valueOf() - r.valueOf()) * diff : 4 + (r.valueOf() - g.valueOf()) * diff;

                if (h < 0)
                    h += 6;
            }

            dst_row[j] = h * h_scale;
            dst_row[j + 1] = s * scale;
            dst_row[j + 2] = v * scale;
        }
    }

    // taken from http://www.cs.rit.edu/~ncs/color/t_convert.html
    convert_row_abc2bgr_32f_c3(src_row: Array<alvision.float>, dst_row: Array<alvision.float>, n: alvision.int): void {
        var depth = this.test_mat[this.INPUT][0].depth();
        var h_scale = depth == alvision.MatrixType.CV_8U ? 180 / (this.hue_range.valueOf() * 30.) : 1./ 60;
        var scale = depth == alvision.MatrixType.CV_8U ? 1. / 255 : depth == alvision.MatrixType.CV_16U ? 1./ 65535 : 1;
        //int j;

        for (let j = 0; j < n.valueOf() * 3; j += 3) {
            var h = src_row[j].valueOf() * h_scale;
            var s = src_row[j + 1].valueOf() * scale;
            var v = src_row[j + 2].valueOf() * scale;
            var r = v, g = v, b = v;

            if (h < 0)
                h += 6;
            else if (h >= 6)
                h -= 6;

            if (s != 0) {
                var i = Math.floor(h);
                var f = h - i;
                var p = v * (1 - s);
                var q = v * (1 - s * f);
                var t = v * (1 - s * (1 - f));

                if (i == 0)
                    r = v, g = t, b = p;
                else if (i == 1)
                    r = q, g = v, b = p;
                else if (i == 2)
                    r = p, g = v, b = t;
                else if (i == 3)
                    r = p, g = q, b = v;
                else if (i == 4)
                    r = t, g = p, b = v;
                else
                    r = v, g = p, b = q;
            }

            dst_row[j] = b;
            dst_row[j + 1] = g;
            dst_row[j + 2] = r;
        }
    }
}





//// rgb <=> hls
class CV_ColorHLSTest extends CV_ColorCvtBaseTest
{
    constructor() {
        super(true, true, false);
        //INIT_FWD_INV_CODES(BGR2HLS, HLS2BGR);
        this.fwd_code = alvision.ColorConversionCodes.COLOR_BGR2HLS;
        this.inv_code = alvision.ColorConversionCodes.COLOR_HLS2BGR;
        this.fwd_code_str = "BGR2HLS";
        this.inv_code_str = "HLS2BGR";

        this.hue_range = 180;
    }

    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);

        if (this.blue_idx == 0)
            this.fwd_code = alvision.ColorConversionCodes.COLOR_BGR2HLS, this.inv_code = alvision.ColorConversionCodes.COLOR_HLS2BGR;
        else
            this.fwd_code = alvision.ColorConversionCodes.COLOR_RGB2HLS, this.inv_code = alvision.ColorConversionCodes.COLOR_HLS2RGB;

    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        var depth = this.test_mat[i.valueOf()][j.valueOf()].depth();
        return depth == alvision.MatrixType.CV_8U ? (j == 0 ? 4 : 16) : depth == alvision.MatrixType.CV_16U ? 32 : 1e-4;
    }
    convert_row_bgr2abc_32f_c3(src_row: Array<alvision.float>, dst_row : Array<alvision.float>, n  : alvision.int ) : void {
        var depth = this.test_mat[this.INPUT][0].depth();
        var h_scale = depth == alvision.MatrixType.CV_8U ? 30. : 60.;
        var scale = depth == alvision.MatrixType.CV_8U ? 255. : depth == alvision.MatrixType.CV_16U ? 65535. : 1.;
        //int j;

        for (var j = 0; j < n.valueOf() * 3; j += 3) {
            var r = src_row[j + 2].valueOf();
            var g = src_row[j + 1].valueOf();
            var b = src_row[j].valueOf();
            var vmin = Math.min(r, g);
            var v = Math.max(r, g);
            var s, h, l, diff;
            vmin = Math.min(vmin, b);
            v = Math.max(v, b);
            diff = v - vmin;

            if (diff == 0)
                s = h = 0, l = v;
            else {
                l = (v + vmin) * 0.5;
                s = l <= 0.5 ? diff / (v + vmin) : diff / (2 - v - vmin);
                diff = 1./ diff;

                h = r == v ? (g - b) * diff :
                    g == v ? 2 + (b - r) * diff : 4 + (r - g) * diff;

                if (h < 0)
                    h += 6;
            }

            dst_row[j] = h * h_scale;
            dst_row[j + 1] = l * scale;
            dst_row[j + 2] = s * scale;
        }
    }
    convert_row_abc2bgr_32f_c3(src_row: Array<alvision.float>, dst_row : Array<alvision.float>, n  : alvision.int ) : void{
        let depth = this.test_mat[this.INPUT][0].depth();
        let h_scale = depth == alvision.MatrixType.CV_8U ? 1./ 30 : 1./ 60;
        let scale = depth == alvision.MatrixType.CV_8U ? 1. / 255 : depth == alvision.MatrixType.CV_16U ? 1./ 65535 : 1;
        //int j;

        for (let j = 0; j < n.valueOf() * 3; j += 3) {
            let h = src_row[j].valueOf() * h_scale;
            let l = src_row[j + 1].valueOf() * scale;
            let s = src_row[j + 2].valueOf() * scale;
            let r = l, g = l, b = l;

            if (h < 0)
                h += 6;
            else if (h >= 6)
                h -= 6;

            if (s != 0) {
                var m2 = l <= 0.5 ? l * (1. + s) : l + s - l * s;
                var m1 = 2 * l - m2;
                var h1 = h + 2;

                if (h1 >= 6)
                    h1 -= 6;
                if (h1 < 1)
                    r = m1 + (m2 - m1) * h1;
                else if (h1 < 3)
                    r = m2;
                else if (h1 < 4)
                    r = m1 + (m2 - m1) * (4 - h1);
                else
                    r = m1;

                h1 = h;

                if (h1 < 1)
                    g = m1 + (m2 - m1) * h1;
                else if (h1 < 3)
                    g = m2;
                else if (h1 < 4)
                    g = m1 + (m2 - m1) * (4 - h1);
                else
                    g = m1;

                h1 = h - 2;
                if (h1 < 0)
                    h1 += 6;

                if (h1 < 1)
                    b = m1 + (m2 - m1) * h1;
                else if (h1 < 3)
                    b = m2;
                else if (h1 < 4)
                    b = m1 + (m2 - m1) * (4 - h1);
                else
                    b = m1;
            }

            dst_row[j] = b;
            dst_row[j + 1] = g;
            dst_row[j + 2] = r;
        }
    }
};


const RGB2XYZ =
[
     0.412453, 0.357580, 0.180423,
     0.212671, 0.715160, 0.072169,
     0.019334, 0.119193, 0.950227
];


const XYZ2RGB =
[
    3.240479, -1.53715, -0.498535,
   -0.969256, 1.875991, 0.041556,
    0.055648, -0.204043, 1.057311
];

 const  Xn = 0.950456;
 const  Zn = 1.088754;


//// rgb <=> xyz
class CV_ColorXYZTest extends CV_ColorCvtBaseTest
{
    constructor() {
        super(true, true, true);
        //INIT_FWD_INV_CODES(BGR2XYZ, XYZ2BGR);
        this.fwd_code = alvision.ColorConversionCodes.COLOR_BGR2XYZ;
        this.inv_code = alvision.ColorConversionCodes.COLOR_XYZ2BGR;
        this.fwd_code_str = "BGR2XYZ";
        this.inv_code_str = "XYZ2BGR";

    }
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);

        if (this.blue_idx == 0)
            this.fwd_code = alvision.ColorConversionCodes.COLOR_BGR2XYZ, this.inv_code = alvision.ColorConversionCodes.COLOR_XYZ2BGR;
        else
            this.fwd_code = alvision.ColorConversionCodes.COLOR_RGB2XYZ, this.inv_code = alvision.ColorConversionCodes.COLOR_XYZ2RGB;

    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        var depth = this.test_mat[i.valueOf()][j.valueOf()].depth();
        return depth == alvision.MatrixType.CV_8U ? (j == 0 ? 2 : 8) : depth == alvision.MatrixType.CV_16U ? (j == 0 ? 64 : 128) : 1e-1;

    }
    convert_row_bgr2abc_32f_c3(src_row: Array<alvision.float>, dst_row: Array<alvision.float>, n: alvision.int): void {
        var depth = this.test_mat[this.INPUT][0].depth();
        var scale = depth == alvision.MatrixType.CV_8U ? 255 : depth == alvision.MatrixType.CV_16U ? 65535 : 1;

        var M = new Array<alvision.double>(9);
        //int j;
        for (var j = 0; j < 9; j++)
            M[j] = RGB2XYZ[j] * scale;

        for (j = 0; j < n.valueOf() * 3; j += 3) {
            var r = src_row[j + 2];
            var g = src_row[j + 1];
            var b = src_row[j];
            var x = M[0].valueOf() * r.valueOf() + M[1].valueOf() * g.valueOf() + M[2].valueOf() * b.valueOf();
            var y = M[3].valueOf() * r.valueOf() + M[4].valueOf() * g.valueOf() + M[5].valueOf() * b.valueOf();
            var z = M[6].valueOf() * r.valueOf() + M[7].valueOf() * g.valueOf() + M[8].valueOf() * b.valueOf();
            dst_row[j] =     x;
            dst_row[j + 1] = y;
            dst_row[j + 2] = z;
        }

    }
    convert_row_abc2bgr_32f_c3(src_row: Array<alvision.float>, dst_row : Array<alvision.float>, n  : alvision.int ) : void {
        var depth = this.test_mat[this.INPUT][0].depth();
        var scale = depth == alvision.MatrixType.CV_8U ? 1. / 255 : depth == alvision.MatrixType.CV_16U ? 1. / 65535 : 1;

        var M = new Array<alvision.double>(9);
        //int j;
        for (let j = 0; j < 9; j++)
            M[j] = XYZ2RGB[j] * scale;

        for(let j = 0; j < n.valueOf() * 3; j += 3) {
            let x = src_row[j];
            let y = src_row[j + 1];
            let z = src_row[j + 2];
            let r = M[0].valueOf() * x.valueOf() + M[1].valueOf() * y.valueOf() + M[2].valueOf() * z.valueOf();
            let g = M[3].valueOf() * x.valueOf() + M[4].valueOf() * y.valueOf() + M[5].valueOf() * z.valueOf();
            let b = M[6].valueOf() * x.valueOf() + M[7].valueOf() * y.valueOf() + M[8].valueOf() * z.valueOf();
            dst_row[j] =     b;
            dst_row[j + 1] = g;
            dst_row[j + 2] = r;
        }

    }
};



//// rgb <=> L*a*b*
class CV_ColorLabTest extends CV_ColorCvtBaseTest {
    constructor() {
        super(true, true, false);
        //INIT_FWD_INV_CODES(BGR2Lab, Lab2BGR);
        this.fwd_code = alvision.ColorConversionCodes.COLOR_BGR2Lab;
        this.inv_code = alvision.ColorConversionCodes.COLOR_Lab2BGR;
        this.fwd_code_str = "BGR2Lab";
        this.inv_code_str = "Lab2BGR";
    }

    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);

        if (this.blue_idx == 0)
            this.fwd_code = alvision.ColorConversionCodes.COLOR_LBGR2Lab, this.inv_code = alvision.ColorConversionCodes.COLOR_Lab2LBGR;
        else
            this.fwd_code = alvision.ColorConversionCodes.COLOR_LRGB2Lab, this.inv_code = alvision.ColorConversionCodes.COLOR_Lab2LRGB;
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        var depth = this.test_mat[i.valueOf()][j.valueOf()].depth();
        return depth == alvision.MatrixType.CV_8U ? 16 : depth == alvision.MatrixType.CV_16U ? 32 : 1e-3;
    }
    convert_row_bgr2abc_32f_c3(src_row: Array<alvision.float>, dst_row: Array<alvision.float>, n: alvision.int): void {
        var depth = this.test_mat[this.INPUT][0].depth();
        var Lscale = depth == alvision.MatrixType.CV_8U ? 255./ 100. : depth == alvision.MatrixType.CV_16U ? 65535./ 100. : 1.;
        var ab_bias = depth == alvision.MatrixType.CV_8U ? 128. : depth == alvision.MatrixType.CV_16U ? 32768. : 0.;
        var M = new Array < alvision.float >(9);

        for (let j = 0; j < 9; j++)
            M[j] = RGB2XYZ[j];

        for (let x = 0; x < n.valueOf() * 3; x += 3) {
            var R = src_row[x + 2];
            var G = src_row[x + 1];
            var B = src_row[x];

            var X = (R.valueOf() * M[0].valueOf() + G.valueOf() * M[1].valueOf() + B.valueOf() * M[2].valueOf()) / Xn;
            var Y =  R.valueOf() * M[3].valueOf() + G.valueOf() * M[4].valueOf() + B.valueOf() * M[5].valueOf();
            var Z = (R.valueOf() * M[6].valueOf() + G.valueOf() * M[7].valueOf() + B.valueOf() * M[8].valueOf()) / Zn;
            var fX = X > 0.008856 ? Math.pow(X, _1_3f) :
            (7.787 * X + 16. / 116.);
            var fZ = Z > 0.008856 ? Math.pow(Z, _1_3f) :
            (7.787 * Z + 16. / 116.);

            let L = 0.0, fY = 0.0;
            if (Y > 0.008856) {
                fY = Math.pow(Y, _1_3f);
                L = 116. * fY - 16.;
            }
            else {
                fY = 7.787 * Y + 16. / 116.;
                L = 903.3 * Y;
            }

            let a = 500. * (fX - fY);
            let b = 200. * (fY - fZ);

            dst_row[x] = L * Lscale;
            dst_row[x + 1] = a + ab_bias;
            dst_row[x + 2] = b + ab_bias;
        }
    }
    convert_row_abc2bgr_32f_c3(src_row: Array<alvision.float>, dst_row: Array<alvision.float>, n: alvision.int): void {
        var depth = this.test_mat[this.INPUT][0].depth();
        var Lscale = depth == alvision.MatrixType.CV_8U ? 100. / 255. : depth == alvision.MatrixType.CV_16U ? 100./ 65535. : 1.;
        var ab_bias = depth == alvision.MatrixType.CV_8U ? 128. : depth == alvision.MatrixType.CV_16U ? 32768. : 0.;
        var M = new Array<alvision.float>(9);

        for (var j = 0; j < 9; j++)
            M[j] = XYZ2RGB[j];

        const lthresh = 903.3 * 0.008856;
        const thresh = 7.787 * 0.008856 + 16.0 / 116.0;
        for (var x = 0, end = n.valueOf() * 3; x < end; x += 3) {
            var L = src_row[x].valueOf() * Lscale;
            var a = src_row[x + 1].valueOf() - ab_bias;
            var b = src_row[x + 2].valueOf() - ab_bias;

            var FY = 0.0, Y = 0.0;
            if (L <= lthresh) {
                Y = L / 903.3;
                FY = 7.787 * Y + 16.0 / 116.0;
            }
            else {
                FY = (L + 16.0) / 116.0;
                Y = FY * FY * FY;
            }

            var FX = a / 500.0 + FY;
            var FZ = FY - b / 200.0;

            var FXZ = [FX, FZ];
            for (var k = 0; k < 2; ++k) {
                if (FXZ[k] <= thresh)
                    FXZ[k] = (FXZ[k] - 16.0 / 116.0) / 7.787;
                else
                    FXZ[k] = FXZ[k] * FXZ[k] * FXZ[k];
            }
            var X = FXZ[0] * Xn;
            var Z = FXZ[1] * Zn;

            var R = M[0].valueOf() * X + M[1].valueOf() * Y + M[2].valueOf() * Z;
            var G = M[3].valueOf() * X + M[4].valueOf() * Y + M[5].valueOf() * Z;
            var B = M[6].valueOf() * X + M[7].valueOf() * Y + M[8].valueOf() * Z;

            dst_row[x] = B;
            dst_row[x + 1] = G;
            dst_row[x + 2] = R;
        }
    }
}



const _1_3 = 0.333333333333;
const _1_3f = _1_3;



//// rgb <=> L*u*v*
class CV_ColorLuvTest extends CV_ColorCvtBaseTest {
    constructor() {
        super(true, true, false);
        //INIT_FWD_INV_CODES(BGR2Luv, Luv2BGR);
        this.fwd_code = alvision.ColorConversionCodes.COLOR_BGR2Luv;
        this.inv_code = alvision.ColorConversionCodes.COLOR_Luv2BGR;
        this.fwd_code_str = "BGR2Luv";
        this.inv_code_str = "Luv2BGR";
    }

    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);

        if (this.blue_idx == 0)
            this.fwd_code = alvision.ColorConversionCodes.COLOR_LBGR2Luv, this.inv_code = alvision.ColorConversionCodes.COLOR_Luv2LBGR;
        else
            this.fwd_code = alvision.ColorConversionCodes.COLOR_LRGB2Luv, this.inv_code = alvision.ColorConversionCodes.COLOR_Luv2LRGB;
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        var depth = this.test_mat[i.valueOf()][j.valueOf()].depth();
        return depth == alvision.MatrixType.CV_8U ? 48 : depth == alvision.MatrixType.CV_16U ? 32 : 5e-2;
    }
    convert_row_bgr2abc_32f_c3(src_row: Array<alvision.float>, dst_row: Array<alvision.float>, n: alvision.int): void {
        var depth = this.test_mat[this.INPUT][0].depth();
        var Lscale = depth == alvision.MatrixType.CV_8U ? 255. / 100. : depth == alvision.MatrixType.CV_16U ? 65535. / 100. : 1.;
        //int j;

        var M = new Array < alvision.float>(9);
        var un = 4. * Xn / (Xn + 15. * 1. + 3 * Zn);
        var vn = 9. * 1. / (Xn + 15. * 1. + 3 * Zn);
        var u_scale = 1., u_bias = 0.;
        var v_scale = 1., v_bias = 0.;

        for (let j = 0; j < 9; j++)
            M[j] = RGB2XYZ[j];

        if (depth == alvision.MatrixType.CV_8U) {
            u_scale = 0.720338983;
            u_bias = 96.5254237;
            v_scale = 0.973282442;
            v_bias = 136.2595419;
        }

        for (let j = 0; j < n.valueOf() * 3; j += 3) {
            let r = src_row[j + 2];
            let g = src_row[j + 1];
            let b = src_row[j];

            let X = r.valueOf() * M[0].valueOf() + g.valueOf() * M[1].valueOf() + b.valueOf() * M[2].valueOf();
            let Y = r.valueOf() * M[3].valueOf() + g.valueOf() * M[4].valueOf() + b.valueOf() * M[5].valueOf();
            let Z = r.valueOf() * M[6].valueOf() + g.valueOf() * M[7].valueOf() + b.valueOf() * M[8].valueOf();
            let d = X + 15 * Y + 3 * Z, L, u, v;

            if (d == 0)
                L = u = v = 0;
            else {
                if (Y > 0.008856)
                    L = (116. * Math.pow(Y, _1_3) - 16.);
                else
                    L = 903.3 * Y;

                d = 1. / d;
                u = 13 * L * (4 * X * d - un);
                v = 13 * L * (9 * Y * d - vn);
            }
            dst_row[j] = L * Lscale;
            dst_row[j + 1] = u * u_scale + u_bias;
            dst_row[j + 2] = v * v_scale + v_bias;
        }
    }
    convert_row_abc2bgr_32f_c3(src_row: Array<alvision.float>, dst_row: Array<alvision.float>, n: alvision.int): void {

        var depth = this.test_mat[this.INPUT][0].depth();
        var Lscale = depth == alvision.MatrixType.CV_8U ? 100./ 255. : depth == alvision.MatrixType.CV_16U ? 100./ 65535. : 1.;
        //int j;
        var M = new Array < alvision.float>(9);
        var un = 4. * Xn / (Xn + 15. * 1. + 3 * Zn);
        var vn = 9. * 1. / (Xn + 15. * 1. + 3 * Zn);
        var u_scale = 1., u_bias = 0.;
        var v_scale = 1., v_bias = 0.;

        for (var j = 0; j < 9; j++)
            M[j] = XYZ2RGB[j];

            if (depth == alvision.MatrixType.CV_8U) {
            u_scale = 1./ 0.720338983;
            u_bias = 96.5254237;
            v_scale = 1./ 0.973282442;
            v_bias = 136.2595419;
        }

        for (var j = 0; j < n.valueOf() * 3; j += 3) {
            var L = src_row[j].valueOf() * Lscale;
            var u = (src_row[j + 1].valueOf() - u_bias) * u_scale;
            var v = (src_row[j + 2].valueOf() - v_bias) * v_scale;
            var X, Y, Z;

            if (L >= 8) {
                Y = (L + 16.) * (1. / 116.);
                Y = Y * Y * Y;
            }
            else {
                Y = L * (1. / 903.3);
                if (L == 0)
                    L = 0.001;
            }

            u = u / (13 * L) + un;
            v = v / (13 * L) + vn;

            X = -9 * Y * u / ((u - 4) * v - u * v);
            Z = (9 * Y - 15 * v * Y - v * X) / (3 * v);

            var r = M[0].valueOf() * X + M[1].valueOf() * Y + M[2].valueOf() * Z;
            var g = M[3].valueOf() * X + M[4].valueOf() * Y + M[5].valueOf() * Z;
            var b = M[6].valueOf() * X + M[7].valueOf() * Y + M[8].valueOf() * Z;

            dst_row[j] = b;
            dst_row[j + 1] = g;
            dst_row[j + 2] = r;
        }
    }
}



//// rgb <=> another rgb
class CV_ColorRGBTest extends CV_ColorCvtBaseTest
{
    constructor() {
        super(true, true, true);
        this.dst_bits = 0;
    }

    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        var rng = this.ts.get_rng();
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
        var cn = alvision.MatrixType. CV_MAT_CN(types[this.INPUT][0]);

        this.dst_bits = 24;

        if (alvision.cvtest.randInt(rng).valueOf() % 3 == 0) {
            types[this.INPUT][0] =  types[this.OUTPUT][1] = types[this.REF_OUTPUT][1] = alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_8U, cn);
            types[this.OUTPUT][0] = types[this.REF_OUTPUT][0] = alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_8U, 2);
            if (alvision.cvtest.randInt(rng).valueOf() & 1) {
                if (this.blue_idx == 0)
                    this.fwd_code = alvision.ColorConversionCodes.COLOR_BGR2BGR565, this.inv_code = alvision.ColorConversionCodes.COLOR_BGR5652BGR;
                else
                    this.fwd_code = alvision.ColorConversionCodes.COLOR_RGB2BGR565, this.inv_code = alvision.ColorConversionCodes.COLOR_BGR5652RGB;
                this.dst_bits = 16;
            }
            else {
                if (this.blue_idx == 0)
                    this.fwd_code = alvision.ColorConversionCodes.COLOR_BGR2BGR555, this.inv_code = alvision.ColorConversionCodes.COLOR_BGR5552BGR;
                else
                    this.fwd_code = alvision.ColorConversionCodes.COLOR_RGB2BGR555, this.inv_code = alvision.ColorConversionCodes.COLOR_BGR5552RGB;
                this.dst_bits = 15;
            }
        }
        else {
            if (cn == 3) {
                this.fwd_code = alvision.ColorConversionCodes.COLOR_RGB2BGR, this.inv_code = alvision.ColorConversionCodes.COLOR_BGR2RGB;
                this.blue_idx = 2;
            }
            else if (this.blue_idx == 0)
                this.fwd_code = alvision.ColorConversionCodes.COLOR_BGRA2BGR, this.inv_code = alvision.ColorConversionCodes.COLOR_BGR2BGRA;
            else
                this.fwd_code = alvision.ColorConversionCodes.COLOR_RGBA2BGR, this.inv_code = alvision.ColorConversionCodes.COLOR_BGR2RGBA;
        }

        if (alvision.MatrixType.CV_MAT_CN(types[this.INPUT][0]) != alvision.MatrixType.CV_MAT_CN(types[this.OUTPUT][0]))
            this.inplace = false;
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        return 0;
    }
    convert_forward(src: alvision.Mat, dst: alvision.Mat): void{
        var depth = src.depth(), cn = src.channels();
        /*#if defined _DEBUG || defined DEBUG
            int dst_cn = CV_MAT_CN(dst.type);
        #endif*/
        //int i, j,
            let cols = src.cols();
        var g_rshift = this.dst_bits == 16 ? 2 : 3;
        var r_lshift = this.dst_bits == 16 ? 11 : 10;

        //assert( (cn == 3 || cn == 4) && (dst_cn == 3 || (dst_cn == 2 && depth == alvision.MatrixType.CV_8U)) );

        for (var i = 0; i < src.rows(); i++) {
            switch (depth) {
                case alvision.MatrixType.CV_8U:
                    {
                        const  src_row = src.ptr<alvision.uchar>("uchar",i);
                        let dst_row = dst.ptr<alvision.uchar>("uchar",i);

                        if (this.dst_bits == 24) {
                            for (let j = 0; j < cols; j++) {
                                var b = src_row[j * cn.valueOf() + this.blue_idx.valueOf()];
                                var g = src_row[j * cn.valueOf() + 1];
                                var r = src_row[j * cn.valueOf() + (this.blue_idx.valueOf() ^ 2)];
                                dst_row[j * 3] = b;
                                dst_row[j * 3 + 1] = g;
                                dst_row[j * 3 + 2] = r;
                            }
                        }
                        else {
                            for (let j = 0; j < cols; j++) {
                                let b = <any>src_row[j * cn.valueOf() + this.blue_idx.valueOf()] >> 3;
                                let g = <any>src_row[j * cn.valueOf() + 1] >> g_rshift;
                                let r = <any>src_row[j * cn.valueOf() + (this.blue_idx.valueOf() ^ 2)] >> 3;
                                let usdst_row = dst.ptr<alvision.ushort>("ushort", i);
                                usdst_row[j] = (b | (g << 5) | (r << r_lshift));
                                if (cn == 4 && src_row[j * 4 + 3])
                                    usdst_row[j] = usdst_row[j].valueOf() | 1 << (r_lshift + 5);
                            }
                        }
                    }
                    break;
                case alvision.MatrixType.CV_16U:
                    {
                        const  src_row = src.ptr<alvision.ushort>("ushort",i);
                        let dst_row = dst.ptr<alvision.ushort>("ushort",i);

                        for (let j = 0; j < cols; j++) {
                            let b = src_row[j * cn.valueOf() + this.blue_idx.valueOf()];
                            let g = src_row[j * cn.valueOf() + 1];
                            let r = src_row[j * cn.valueOf() + (this.blue_idx.valueOf() ^ 2)];
                            dst_row[j * 3] = b;
                            dst_row[j * 3 + 1] = g;
                            dst_row[j * 3 + 2] = r;
                        }
                    }
                    break;
                case alvision.MatrixType.CV_32F:
                    {
                        const src_row = src.ptr<alvision.float>("float",i);
                        let dst_row =   dst.ptr<alvision.float>("float",i);

                        for (let j = 0; j < cols; j++) {
                            let b = src_row[j * cn.valueOf() + this.blue_idx.valueOf()];
                            let g = src_row[j * cn.valueOf() + 1];
                            let r = src_row[j * cn.valueOf() + (this.blue_idx.valueOf() ^ 2)];
                            dst_row[j * 3] = b;
                            dst_row[j * 3 + 1] = g;
                            dst_row[j * 3 + 2] = r;
                        }
                    }
                    break;
                default:
                    alvision.assert(()=>false);
            }
        }
    }
    convert_backward(src: alvision.Mat, dst: alvision.Mat, dst2: alvision.Mat): void {
        var depth = src.depth(), cn = dst.channels();
        /*#if defined _DEBUG || defined DEBUG
            int src_cn = CV_MAT_CN(src.type);
        #endif*/
        //int  j,
            let cols = src.cols();
        let g_lshift = this.dst_bits == 16 ? 2 : 3;
        let r_rshift = this.dst_bits == 16 ? 11 : 10;

        //assert( (cn == 3 || cn == 4) && (src_cn == 3 || (src_cn == 2 && depth == CV_8U)) );

        for (var i = 0; i < src.rows(); i++) {
            switch (depth) {
                case alvision.MatrixType.CV_8U:
                    {
                        const src_row = src.ptr<alvision.uchar>("uchar",i);
                        let dst_row = dst.ptr<alvision.uchar>("uchar",i);

                        if (this.dst_bits == 24) {
                            for (let j = 0; j < cols; j++) {
                                let b = src_row[j * 3];
                                let g = src_row[j * 3 + 1];
                                let r = src_row[j * 3 + 2];

                                dst_row[j * cn.valueOf() + this.blue_idx.valueOf()] = b;
                                dst_row[j * cn.valueOf() + 1] = g;
                                dst_row[j * cn.valueOf() + (this.blue_idx.valueOf() ^ 2)] = r;

                                if (cn == 4)
                                    dst_row[j * cn.valueOf() + 3] = 255;
                            }
                        }
                        else {
                            for (let j = 0; j < cols; j++) {
                                let ussrc_row = src.ptr<alvision.ushort>("ushort", i);
                                let val = ussrc_row[j].valueOf();
                                let b = (val << 3);
                                let g = ((val >> 5) << g_lshift);
                                let r = ((val >> r_rshift) << 3);

                                dst_row[j * cn.valueOf() + this.blue_idx.valueOf()] = b;
                                dst_row[j * cn.valueOf() + 1] = g;
                                dst_row[j * cn.valueOf() + (this.blue_idx.valueOf() ^ 2)] = r;

                                if (cn == 4) {
                                    let alpha = r_rshift == 11 || (val & 0x8000) != 0 ? 255 : 0;
                                    dst_row[j * cn.valueOf() + 3] = alpha;
                                }
                            }
                        }
                    }
                    break;
                case alvision.MatrixType.CV_16U:
                    {
                        const src_row = src.ptr<alvision.ushort>("ushort",i);
                        let dst_row = dst.ptr<alvision.ushort>("ushort",i);

                        for (let j = 0; j < cols; j++) {
                            let b = src_row[j * 3];
                            let g = src_row[j * 3 + 1];
                            let r = src_row[j * 3 + 2];

                            dst_row[j * cn.valueOf() + this.blue_idx.valueOf()] = b;
                            dst_row[j * cn.valueOf() + 1] = g;
                            dst_row[j * cn.valueOf() + (this.blue_idx.valueOf() ^ 2)] = r;

                            if (cn == 4)
                                dst_row[j * cn.valueOf() + 3] = 65535;
                        }
                    }
                    break;
                case alvision.MatrixType.CV_32F:
                    {
                        const src_row = src.ptr<alvision.float>("float",i);
                        let dst_row = dst.ptr<alvision.float>("float",i);

                        for (let j = 0; j < cols; j++) {
                            let b = src_row[j * 3];
                            let g = src_row[j * 3 + 1];
                            let r = src_row[j * 3 + 2];

                            dst_row[j * cn.valueOf() + this.blue_idx.valueOf()] = b;
                            dst_row[j * cn.valueOf() + 1] = g;
                            dst_row[j * cn.valueOf() + (this.blue_idx.valueOf() ^ 2)] = r;

                            if (cn == 4)
                                dst_row[j * cn.valueOf() + 3] = 1.;
                        }
                    }
                    break;
                default:
                    alvision.assert(() => false);
            }
        }
    }
    protected dst_bits: alvision.int;
};



//// rgb <=> bayer

class CV_ColorBayerTest extends CV_ColorCvtBaseTest
{
    constructor() {
        super(false, false, true);
        this.test_array[this.OUTPUT].length = 0;
        this.test_array[this.REF_OUTPUT].length = 0;

        this.fwd_code_str = "BayerBG2BGR";
        this.inv_code_str = "";
        this.fwd_code = alvision.ColorConversionCodes.COLOR_BayerBG2BGR;
        this.inv_code = -1;

    }

    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        var rng = this.ts.get_rng();
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);

        types[this.INPUT][0] =alvision.MatrixType. CV_MAT_DEPTH(types[this.INPUT][0]);
        types[this.OUTPUT][0] = types[this.REF_OUTPUT][0] = alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_MAT_DEPTH(types[this.INPUT][0]), 3);
        this.inplace = false;

        this.fwd_code = alvision.cvtest.randInt(rng).valueOf() % 4 + alvision.ColorConversionCodes.COLOR_BayerBG2BGR;
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {

        return 1;
    }
    run_func(): void {
        if (!this.test_cpp)
            alvision.cvtColor(this.test_array[this.INPUT][0], this.test_array[this.OUTPUT][0], this.fwd_code);
        else {
            var _out = this.test_array[this.OUTPUT][0];
            alvision.cvtColor(this.test_array[this.INPUT][0], _out, this.fwd_code, _out.channels());
        }

    }
    prepare_to_validation(test_case_idx: alvision.int): void {
        const  src = this.test_mat[this.INPUT][0];
        var dst = this.test_mat[this.REF_OUTPUT][0];
        var depth = src.depth();
        if (depth == alvision.MatrixType.CV_8U)
            bayer2BGR_<alvision.uchar>("uchar",src, dst, this.fwd_code);
        else if (depth == alvision.MatrixType.CV_16U)
            bayer2BGR_<alvision.ushort>("ushort", src, dst, this.fwd_code);
        else
            alvision.CV_Error(alvision.cv.Error.Code.StsUnsupportedFormat, "");
    }
};



//template<typename T>
function bayer2BGR_<T>(Ttype : string, src: alvision.Mat, dst: alvision.Mat, code: alvision.int ) : void
{
    //int i, j,
        var cols = src.cols().valueOf() - 2;
    let bi = 0;
    let step = (src.step);///sizeof(T));

    if (code == alvision.ColorConversionCodes.COLOR_BayerRG2BGR || code == alvision.ColorConversionCodes.COLOR_BayerGR2BGR )
        bi ^= 2;

    for(let i = 1; i < src.rows().valueOf() - 1; i++ )
    {
        const ptr = src.ptr<T>(Ttype, i).slice(+ 1);
        var dst_row = dst.ptr<T>(Ttype, i).slice(+ 3);
        var save_code = code;
        if( cols <= 0 )
        {
            dst_row[-3] = dst_row[-2] = dst_row[-1] = <any>0;
            dst_row[cols*3] = dst_row[cols*3+1] = dst_row[cols*3+2] = <any>0;
            continue;
        }

        for(let j = 0; j < cols; j++ )
        {
            //int b, g, r;
            var b, g, r;
            if( !(code.valueOf() & 1) )
            {
                b = ptr[j];
                g = (<any>ptr[j-1] + ptr[j+1] + ptr[j-step] + ptr[j+step])>>2;
                r = (<any>ptr[j-step-1] + ptr[j-step+1] + ptr[j+step-1] + ptr[j+step+1]) >> 2;
            }
            else
            {
                b = (<any>ptr[j-1] + ptr[j+1]) >> 1;
                g = ptr[j];
                r = (<any>ptr[j-step] + ptr[j+step]) >> 1;
            }
            code =code.valueOf() ^ 1;
            dst_row[j*3 + bi] = b;
            dst_row[j*3 + 1] = g;
            dst_row[j*3 + (bi^2)] = r;
        }

        dst_row[-3] = dst_row[0];
        dst_row[-2] = dst_row[1];
        dst_row[-1] = dst_row[2];
        dst_row[cols*3] = dst_row[cols*3-3];
        dst_row[cols*3+1] = dst_row[cols*3-2];
        dst_row[cols*3+2] = dst_row[cols*3-1];

        code = save_code.valueOf() ^ 1;
        bi ^= 2;
    }

    if( src.rows() <= 2 )
    {
        dst.ptr<T>(Ttype).slice(0, (cols + 2) * 3).forEach((v, i, a) => a[i] = <any>0);
        //memset( dst.ptr(), 0, (cols+2)*3*sizeof(T) );
        dst.ptr<T>(Ttype).slice(dst.rows().valueOf() - 1).slice(0, (cols + 2) * 3).forEach((v, i, a) => a[i] = <any>0);
        //memset( dst.ptr(dst.rows-1), 0, (cols+2)*3*sizeof(T) );
    }
    else
    {
        let top_row = dst.ptr<T>(Ttype);
        let bottom_row = dst.ptr<T>(Ttype, dst.rows().valueOf()-1);
        let dstep = (dst.step);///sizeof(T));

        for( let j = 0; j < (cols+2)*3; j++ )
        {
            top_row[j] = top_row[j + dstep];
            bottom_row[j] = bottom_row[j - dstep];
        }
    }
}



/////////////////////////////////////////////////////////////////////////////////////////////////

alvision.cvtest.TEST('Imgproc_ColorGray', 'accuracy', () => { var test = new CV_ColorGrayTest(); test.safe_run(); });
alvision.cvtest.TEST('Imgproc_ColorYCrCb', 'accuracy', () => { var test = new CV_ColorYCrCbTest (); test.safe_run(); });
alvision.cvtest.TEST('Imgproc_ColorHSV', 'accuracy', () => { var test = new CV_ColorHSVTest (); test.safe_run(); });
alvision.cvtest.TEST('Imgproc_ColorHLS', 'accuracy', () => { var test = new CV_ColorHLSTest (); test.safe_run(); });
alvision.cvtest.TEST('Imgproc_ColorXYZ', 'accuracy', () => { var test = new CV_ColorXYZTest(); test.safe_run(); });
alvision.cvtest.TEST('Imgproc_ColorLab', 'accuracy', () => { var test = new CV_ColorLabTest (); test.safe_run(); });
alvision.cvtest.TEST('Imgproc_ColorLuv', 'accuracy', () => { var test = new CV_ColorLuvTest(); test.safe_run(); });
alvision.cvtest.TEST('Imgproc_ColorRGB', 'accuracy', () => { var test = new CV_ColorRGBTest(); test.safe_run(); });
alvision.cvtest.TEST('Imgproc_ColorBayer', 'accuracy', () => { var test = new CV_ColorBayerTest(); test.safe_run(); });

alvision.cvtest.TEST('Imgproc_ColorBayer', 'regression', () => {
    var ts = alvision.cvtest.TS.ptr();

    var given = alvision.imread(this.ts.get_data_path() + "/cvtcolor/bayer_input.png",alvision.ImreadModes. IMREAD_GRAYSCALE);
    var gold = alvision.imread(this.ts.get_data_path() + "/cvtcolor/bayer_gold.png", alvision.ImreadModes. IMREAD_UNCHANGED);
    var result = new alvision.Mat();

    alvision.CV_Assert(()=>!given.empty() && !gold.empty());

    alvision.cvtColor(given, result, alvision.ColorConversionCodes.COLOR_BayerBG2GRAY);

    alvision.EXPECT_EQ(gold.type(), result.type());
    alvision.EXPECT_EQ(gold.cols, result.cols);
    alvision.EXPECT_EQ(gold.rows, result.rows);

    var diff = new alvision.Mat();
    alvision.absdiff(gold, result, diff);

    alvision.EXPECT_EQ(0,alvision. countNonZero(alvision.MatExpr.op_GreaterThan( diff.reshape(1) , 1)));
});

alvision.cvtest.TEST('Imgproc_ColorBayerVNG', 'regression', () => {
    var ts = alvision.cvtest.TS.ptr();

    var given = alvision.imread(this.ts.get_data_path() + "/cvtcolor/bayer_input.png", alvision.ImreadModes. IMREAD_GRAYSCALE);
    var goldfname = this.ts.get_data_path() + "/cvtcolor/bayerVNG_gold.png";
    var gold = alvision.imread(goldfname, alvision.ImreadModes. IMREAD_UNCHANGED);
    var result = new alvision.Mat();

    alvision.CV_Assert(()=>!given.empty());

    alvision.cvtColor(given, result, alvision.ColorConversionCodes.COLOR_BayerBG2BGR_VNG, 3);

    if (gold.empty())
        alvision.imwrite(goldfname, result);
    else {
        alvision.EXPECT_EQ(gold.type(), result.type());
        alvision.EXPECT_EQ(gold.cols, result.cols);
        alvision.EXPECT_EQ(gold.rows, result.rows);

        var diff = new alvision.Mat();
        alvision.absdiff(gold, result, diff);

        alvision.EXPECT_EQ(0,alvision. countNonZero(alvision.MatExpr.op_GreaterThan( diff.reshape(1) , 1).toMat()));
    }
});

// creating Bayer pattern
//template <typename T, int depth>
function calculateBayerPattern<T>(Ttype: string, src: alvision.Mat, bayer: alvision.Mat,  pattern : string, depth : alvision.int) : void
{
    var ssize = src.size();
    const  scn = 1;
    bayer.create(ssize, alvision.MatrixType.CV_MAKETYPE(depth, scn));

    if (pattern == "bg")
    {
        for (let y = 0; y < ssize.height; ++y)
            for (let x = 0; x < ssize.width; ++x)
            {
                if ((x + y) % 2)
                    bayer.at<T>(Ttype, y, x).set((src.at<alvision.Vecb>("Vec3b", y, x)[1]));
                else if (x % 2)
                    bayer.at<T>(Ttype, y, x).set((src.at<alvision.Vecb>("Vec3b", y, x)[0]));
                else
                    bayer.at<T>(Ttype, y, x).set((src.at<alvision.Vecb>("Vec3b", y, x)[2]));
            }
    }
    else if (pattern == "gb")
    {
        for (let y = 0; y < ssize.height; ++y)
            for (let x = 0; x < ssize.width; ++x)
            {
                if ((x + y) % 2 == 0)
                    bayer.at<T>(Ttype, y, x).set((src.at<alvision.Vecb>("Vec3b", y, x)[1]));
                else if (x % 2 == 0)
                    bayer.at<T>(Ttype, y, x).set((src.at<alvision.Vecb>("Vec3b", y, x)[0]));
                else
                    bayer.at<T>(Ttype, y, x).set((src.at<alvision.Vecb>("Vec3b", y, x)[2]));
            }
    }
    else if (pattern ==  "rg")
    {
        for (let y = 0; y < ssize.height; ++y)
            for (let x = 0; x < ssize.width; ++x)
            {
                if ((x + y) % 2)
                    bayer.at<T>(Ttype, y, x).set((src.at<alvision.Vecb>("Vec3b", y, x)[1]));
                else if (x % 2 == 0)
                    bayer.at<T>(Ttype, y, x).set((src.at<alvision.Vecb>("Vec3b", y, x)[0]));
                else
                    bayer.at<T>(Ttype, y, x).set((src.at<alvision.Vecb>("Vec3b", y, x)[2]));
            }
    }
    else
    {
        for (let y = 0; y < ssize.height; ++y)
            for (let x = 0; x < ssize.width; ++x)
            {
                if ((x + y) % 2 == 0)
                    bayer.at<T>(Ttype, y, x).set((src.at<alvision.Vecb>("Vec3b", y, x)[1]));
                else if (x % 2)
                    bayer.at<T>(Ttype, y, x).set((src.at<alvision.Vecb>("Vec3b", y, x)[0]));
                else
                    bayer.at<T>(Ttype, y, x).set((src.at<alvision.Vecb>("Vec3b", y, x)[2]));
            }
    }
}

alvision.cvtest.TEST('Imgproc_ColorBayerVNG_Strict', 'regression',()=>
{
    var ts = alvision.cvtest.TS.ptr();
    const pattern = ["bg", "gb", "rg", "gr"];
    const image_name = "lena.png";
    const parent_path = this.ts.get_data_path() + "/cvtcolor_strict/";

    //Mat src, dst, bayer, reference;
    var bayer = new alvision.Mat();
    var dst = new alvision.Mat();
    var reference = new alvision.Mat();
    var full_path = parent_path + image_name;
    var src = alvision.imread(full_path, alvision.ImreadModes. IMREAD_UNCHANGED);

    if ( src.empty() )
    {
        ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA);
        ts.printf(alvision.cvtest.TSConstants.SUMMARY, "No input image\n");
        ts.set_gtest_status();
        return;
    }

    for (let i = 0; i < 4; ++i)
    {
        calculateBayerPattern<alvision.uchar>("uchar", src, bayer, pattern[i], alvision.MatrixType.CV_8U);
    alvision.CV_Assert(()=>!bayer.empty() && bayer.type() == alvision.MatrixType.CV_8UC1);

        // calculating a dst image
        alvision.cvtColor(bayer, dst, alvision.ColorConversionCodes.COLOR_BayerBG2BGR_VNG + i);

        // reading a reference image
        full_path = parent_path + pattern[i] + image_name;
        let reference = alvision.imread(full_path, alvision.ImreadModes. IMREAD_UNCHANGED);
        if ( reference.empty() )
        {
            alvision.imwrite(full_path, dst);
            continue;
        }

        if (reference.depth() != dst.depth() || reference.channels() != dst.channels() ||
            reference.size() != dst.size())
        {
            console.log(reference.roi(new alvision.Rect(0, 0, 5, 5)));
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
            ts.printf(alvision.cvtest.TSConstants.SUMMARY, "\nReference channels: %d\n" + 
                "Actual channels: %d\n", reference.channels(), dst.channels());
            ts.printf(alvision.cvtest.TSConstants.SUMMARY, "\nReference depth: %d\n" + 
                "Actual depth: %d\n", reference.depth(), dst.depth());
            ts.printf(alvision.cvtest.TSConstants.SUMMARY, "\nReference rows: %d\n" + 
                "Actual rows: %d\n", reference.rows, dst.rows);
            ts.printf(alvision.cvtest.TSConstants.SUMMARY, "\nReference cols: %d\n" + 
                "Actual cols: %d\n", reference.cols, dst.cols);
            ts.set_gtest_status();

            return;
        }

        var diff = new alvision.Mat();
        alvision.absdiff(reference, dst, diff);

        let nonZero = alvision.countNonZero(alvision.MatExpr.op_GreaterThan( diff.reshape(1) , 1).toMat());
        if (nonZero != 0)
        {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
            ts.printf(alvision.cvtest.TSConstants.SUMMARY, "\nCount non zero in absdiff: %d\n", nonZero);
            ts.set_gtest_status();
            return;
        }
    }
});

function getTestMatrix(src : alvision.Mat) : void
{
    var ssize = new alvision.Size(1000, 1000);
    src.create(ssize, alvision.MatrixType.CV_32FC3);
    var szm = ssize.width.valueOf() - 1;
    var pi2 = 2 * 3.1415;
    // Generate a pretty test image
    for (var i = 0; i < ssize.height; i++)
    {
        for (let j = 0; j < ssize.width; j++)
        {
            let b = (1 + Math.cos((szm - i) * (szm - j) * pi2 / (10 * szm))) / 2;
            let g = (1 + Math.cos((szm - i) * j * pi2 / (10 * szm))) / 2;
            let r = (1 + Math.sin(i * j * pi2 / (10 * szm))) / 2;

            // The following lines aren't necessary, but just to prove that
            // the BGR values all lie in [0,1]...
            if (b < 0) b = 0; else if (b > 1) b = 1;
            if (g < 0) g = 0; else if (g > 1) g = 1;
            if (r < 0) r = 0; else if (r > 1) r = 1;
            src.at<alvision.Vecf>("Vec3f", i, j).set(new alvision.Vecf(b, g, r));
        }
    }
}

function validateResult(reference: alvision.Mat, actual: alvision.Mat, src: alvision.Mat = new alvision.Mat(), mode: alvision.int = -1) : void
{
    var ts = alvision.cvtest.TS.ptr();
    var ssize = reference.size();

    var cn = reference.channels();
    ssize.width = ssize.width.valueOf() * cn.valueOf();
    var next = true;

    for (let y = 0; y < ssize.height && next; ++y)
    {
        const rD = reference.ptr<alvision.float>("float",y);
        const D =     actual.ptr<alvision.float>("float",y);
        for (let x = 0; x < ssize.width && next; ++x)
            if (Math.abs(rD[x].valueOf() - D[x].valueOf()) > 0.0001)
            {
                next = false;
                ts.printf(alvision.cvtest.TSConstants.SUMMARY, "Error in: (%d, %d)\n", x / cn.valueOf(),  y);
                ts.printf(alvision.cvtest.TSConstants.SUMMARY, "Reference value: %f\n", rD[x]);
                ts.printf(alvision.cvtest.TSConstants.SUMMARY, "Actual value: %f\n", D[x]);
                if (!src.empty())
                    ts.printf(alvision.cvtest.TSConstants.SUMMARY, "Src value: %f\n", src.ptr<alvision.float>("float", y)[x]);
                ts.printf(alvision.cvtest.TSConstants.SUMMARY, "Size: (%d, %d)\n", reference.rows, reference.cols);

                if (mode >= 0)
                {
                    var lab = new alvision.Mat();
                    alvision.cvtColor(src, lab, mode);
                    console.log("lab: ", lab.roi(new alvision.Rect(y, x / cn.valueOf(), 1, 1)));
                }
                console.log("src: ", src.roi(new alvision.Rect(y, x / cn.valueOf(), 1, 1)));

                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                ts.set_gtest_status();
            }
    }
}

alvision.cvtest.TEST('Imgproc_ColorLab_Full', 'accuracy', () => {
    var src = new alvision.Mat();
    getTestMatrix(src);
    var ssize = src.size();
    alvision.CV_Assert(()=>ssize.width == ssize.height);

    var rng = alvision.cvtest.TS.ptr().get_rng();
    var blueInd = rng.uniform(0., 1.) > 0.5 ? 0 : 2;
    var srgb = rng.uniform(0., 1.) > 0.5;

    // Convert test image to LAB
    var lab = new alvision.Mat();
    var forward_code = blueInd ? srgb ? alvision.ColorConversionCodes.COLOR_BGR2Lab : alvision.ColorConversionCodes.COLOR_LBGR2Lab : srgb ? alvision.ColorConversionCodes.COLOR_LRGB2Lab:alvision.ColorConversionCodes.COLOR_LRGB2Lab;
    var inverse_code = blueInd ? srgb ? alvision.ColorConversionCodes.COLOR_Lab2BGR: alvision.ColorConversionCodes.COLOR_Lab2LBGR: srgb ?alvision.ColorConversionCodes.COLOR_Lab2RGB:alvision.ColorConversionCodes.COLOR_Lab2LRGB;
    alvision.cvtColor(src, lab, forward_code);
    // Convert LAB image back to BGR(RGB)
    var recons = new alvision.Mat();
    alvision.cvtColor(lab, recons, inverse_code);

    validateResult(src, recons, src, forward_code);
});

function test_Bayer2RGB_EdgeAware_8u(src: alvision.Mat, dst: alvision.Mat, code: alvision.int ) : void
{
    if (dst.empty())
        dst.create(src.size(),alvision.MatrixType.CV_MAKETYPE(src.depth(), 3));
    let size = src.size();
    size.width = size.width.valueOf() - 1;
    size.height = size.height.valueOf() - 1;

    let dcn = dst.channels();
    alvision.CV_Assert(()=>dcn == 3);

    let step = src.step;
    let S = src.ptr<alvision.uchar>("uchar", 1);
    let Sloc = +1;
    let D = dst.ptr<alvision.uchar>("uchar", 1);
    let Dloc = dcn;

    let start_with_green = code == alvision.ColorConversionCodes.COLOR_BayerGB2BGR_EA || code == alvision.ColorConversionCodes.COLOR_BayerGR2BGR_EA ? 1 : 0;
    let blue = code == alvision.ColorConversionCodes.COLOR_BayerGB2BGR_EA || code == alvision.ColorConversionCodes.COLOR_BayerBG2BGR_EA ? 1 : 0;

    for (let y = 1; y < size.height; ++y)
    {
        let S = src.ptr<alvision.uchar>("uchar", y);
        let Sloc = 1;
        let D = dst.ptr<alvision.uchar>("uchar", y);
        let Dloc = dcn.valueOf();


        if (start_with_green) {
            for (let x = 1; x < size.width; x += 2, Sloc += 2, Dloc += 2 * dcn.valueOf()) {
                // red
                D[Dloc + 0] = (<any>S[Sloc - 1] + <any>S[Sloc + 1]) / 2;
                D[Dloc + 1] = S[Sloc + 0];
                D[Dloc + 2] = (<any>S[Sloc - step] + S[Sloc + step]) / 2;
                if (!blue) {
                    let dtmp = D[Dloc + 0]; D[Dloc + 0] = D[Dloc + 2]; D[Dloc + 2] = dtmp;//std::swap(D[0], D[2]);
                }
            }

            {
                S = src.ptr<alvision.uchar>("uchar", y);
                let Sloc = + 2;
                D = dst.ptr<alvision.uchar>("uchar", y);
                let Dloc = + 2 * dcn.valueOf();

                for (let x = 2; x < size.width; x += 2, Sloc += 2, Dloc += 2 * dcn.valueOf()) {
                    // red
                    D[Dloc + 0] = S[Sloc + 0];
                    D[Dloc + 1] = (Math.abs(<any>S[Sloc - 1] - <any>S[Sloc + 1]) > Math.abs(<any>S[Sloc + step] - <any>S[Sloc - step]) ? (<any>S[Sloc + step] + <any>S[Sloc - step] + 1) : (<any>S[Sloc - 1] + <any>S[Sloc + 1] + 1)) / 2;
                    D[Dloc + 2] = ((<any>S[Sloc - step - 1] + <any>S[Sloc - step + 1] + S[Sloc + step - 1] + S[Sloc + step + 1] + 2) / 4);
                    if (!blue) {
                        let dtmp = D[Dloc + 0]; D[Dloc + 0] = D[Dloc + 2]; D[Dloc + 2] = dtmp;//std::swap(D[0], D[2]);
                    }
                }
            }
        }
        else {

            for (let x = 1; x < size.width; x += 2, Sloc += 2, Dloc += 2 * dcn.valueOf()) {
                D[Dloc + 0] = S[Sloc + 0];
                D[Dloc + 1] = (Math.abs(<any>S[Sloc - 1] - <any>S[Sloc + 1]) > Math.abs(<any>S[Sloc + step] - <any>S[Sloc - step]) ? (<any>S[Sloc + step] + S[Sloc - step] + 1) : (<any>S[Sloc - 1] + S[Sloc + 1] + 1)) / 2;
                D[Dloc + 2] = ((<any>S[Sloc - step - 1] + S[Sloc - step + 1] + S[Sloc + step - 1] + S[Sloc + step + 1] + 2) / 4);
                if (!blue) {
                    let dtmp = D[Dloc + 0]; D[Dloc + 0] = D[Dloc + 2]; D[Dloc + 2] = dtmp;//std::swap(D[0], D[2]);
                }
            }

            {
                let S = src.ptr<alvision.uchar>("uchar", y);
                let Sloc = +2;
                let D = dst.ptr<alvision.uchar>("uchar", y);
                let Dloc = + 2 * dcn.valueOf();

                for (let x = 2; x < size.width; x += 2, Sloc += 2, Dloc += 2 * dcn.valueOf()) {
                    D[Dloc + 0] = (<any>S[Sloc - 1] + S[Sloc + 1] + 1) / 2;
                    D[Dloc + 1] = S[Sloc + 0];
                    D[Dloc + 2] = (<any>S[Sloc - step] + S[Sloc + step] + 1) / 2;
                    if (!blue) {
                        let dtmp = D[Dloc + 0]; D[Dloc + 0] = D[Dloc + 2]; D[Dloc + 2] = dtmp;//std::swap(D[0], D[2]);
                    }

                }
            }
        }
        {
            let D = dst.ptr<alvision.uchar>("uchar", y + 1);
            let Dloc = - dcn;
            for (let i = 0; i < dcn; ++i) {
                D[Dloc + i] = D[Dloc -dcn.valueOf() + i];
                D[Dloc -(dst.step) + dcn.valueOf() + i] = D[Dloc -(dst.step) + (dcn.valueOf() << 1) + i];
            }
        }

        start_with_green ^= 1;
        blue ^= 1;
    }

    size.width = size.width.valueOf() + 1;
    var firstRow = dst.ptr<alvision.uchar>("uchar"), lastRow = dst.ptr<alvision.uchar>("uchar",size.height);
    size.width = size.width.valueOf() * dcn.valueOf();
    for (let x = 0; x < size.width; ++x)
    {
        firstRow[x] = firstRow[dst.step + x];
        lastRow[x] = lastRow[-(dst.step)+x];
    }
}

//template <typename T>
function checkData<T>(Ttype: string, actual: alvision.Mat, reference: alvision.Mat, ts: alvision.cvtest.TS, type : string,
    next : boolean, bayer_type : string) : void
{
    alvision.EXPECT_EQ(actual.size(), reference.size());
    alvision.EXPECT_EQ(actual.channels(), reference.channels());
    alvision.EXPECT_EQ(actual.depth(), reference.depth());

    let size = reference.size();
    let dcn = reference.channels();
    size.width = size.width.valueOf() * dcn.valueOf();

    for (let y = 0; y < size.height && next; ++y)
    {
        const  A = actual.ptr<T>(Ttype, y);
        const  R = reference.ptr<T>(Ttype, y);

        for (let x = 0; x < size.width && next; ++x)
            if (Math.abs(<any>A[x] - <any>R[x]) > 1)
            {
                //#define SUM alvision.cvtest.TSConstants.SUMMARY
                ts.printf(alvision.cvtest.TSConstants.SUMMARY, "\nReference value: %d\n", (R[x]));
                ts.printf(alvision.cvtest.TSConstants.SUMMARY, "Actual value: %d\n", (A[x]));
                ts.printf(alvision.cvtest.TSConstants.SUMMARY, "(y, x): (%d, %d)\n", y, x / reference.channels().valueOf());
                ts.printf(alvision.cvtest.TSConstants.SUMMARY, "Channel pos: %d\n", x % reference.channels().valueOf());
                ts.printf(alvision.cvtest.TSConstants.SUMMARY, "Pattern: %s\n", type);
                ts.printf(alvision.cvtest.TSConstants.SUMMARY, "Bayer image type: %s", bayer_type);
                //#undef SUM

                var diff = new alvision.Mat();
                alvision.absdiff(actual, reference, diff);
                alvision.EXPECT_EQ(alvision.countNonZero(alvision.MatExpr.op_GreaterThan( diff.reshape(1) , 1)), 0);

                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                ts.set_gtest_status();

                next = false;
            }
    }
}

alvision.cvtest.TEST('ImgProc_BayerEdgeAwareDemosaicing', 'accuracy',()=>
{
    var ts = alvision.cvtest.TS.ptr();
    const image_name = "lena.png";
    const parent_path = this.ts.get_data_path() + "/cvtcolor_strict/";

    var bayer = new alvision.Mat();
    let full_path = parent_path + image_name;
    var src = alvision.imread(full_path, alvision.ImreadModes. IMREAD_UNCHANGED);

    if (src.empty())
    {
        ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA);
        ts.printf(alvision.cvtest.TSConstants.SUMMARY, "No input image\n");
        ts.set_gtest_status();
        return;
    }

    /*
    COLOR_BayerBG2BGR_EA = 127,
    COLOR_BayerGB2BGR_EA = 128,
    COLOR_BayerRG2BGR_EA = 129,
    COLOR_BayerGR2BGR_EA = 130,
    */

    var next = true;
    const  types = [ "bg", "gb", "rg", "gr" ];
    for (let i = 0; i < 4 && next; ++i)
    {
        calculateBayerPattern<alvision.uchar>("uchar", src, bayer, types[i], alvision.MatrixType.CV_8U);
        var reference = new alvision.Mat();
        test_Bayer2RGB_EdgeAware_8u(bayer, reference, alvision.ColorConversionCodes.COLOR_BayerBG2BGR_EA + i);

        for (let t = 0; t <= 1; ++t)
        {
            if (t == 1)
                calculateBayerPattern<alvision.ushort>("ushort", src, bayer, types[i], alvision.MatrixType.CV_16U);

            alvision.CV_Assert(()=>!bayer.empty() && (bayer.type() == alvision.MatrixType.CV_8UC1 || bayer.type() == alvision.MatrixType. CV_16UC1));

            var actual = new alvision.Mat();
            alvision.demosaicing(bayer, actual, alvision.ColorConversionCodes.COLOR_BayerBG2BGR_EA + i);

            if (t == 0)
                checkData<alvision.uchar>("uchar", actual, reference, ts, types[i], next, "CV_8U");
            else
            {
                var tmp = new alvision.Mat();
                reference.convertTo(tmp,alvision.MatrixType. CV_16U);
                checkData<alvision.ushort>("ushort", actual, tmp, ts, types[i], next, "CV_16U");
            }
        }
    }
});

alvision.cvtest.TEST('ImgProc_Bayer2RGBA', 'accuracy',()=>
{
    var ts = alvision.cvtest.TS.ptr();
    var raw = alvision.imread(this.ts.get_data_path() + "/cvtcolor/bayer_input.png",alvision.ImreadModes. IMREAD_GRAYSCALE);
    var rgb = new alvision.Mat(), reference = new alvision.Mat();

    alvision.CV_Assert(()=>raw.channels() == 1);
    alvision.CV_Assert(()=>raw.depth() == alvision.MatrixType.CV_8U);
    alvision.CV_Assert(()=>!raw.empty());

    for (var code = alvision.ColorConversionCodes.COLOR_BayerBG2BGR; code <= alvision.ColorConversionCodes.COLOR_BayerGR2BGR; ++code)
    {
        alvision.cvtColor(raw, rgb, code);
        alvision.cvtColor(rgb, reference,alvision.ColorConversionCodes.COLOR_BGR2BGRA);

        var actual = new alvision.Mat();
        alvision.cvtColor(raw, actual, code, 4);

        alvision.EXPECT_EQ(reference.size(), actual.size());
        alvision.EXPECT_EQ(reference.depth(), actual.depth());
        alvision.EXPECT_EQ(reference.channels(), actual.channels());

        var ssize = raw.size();
        var cn = reference.channels();
        ssize.width =ssize.width.valueOf() * cn.valueOf();
        var next = true;
        for (let y = 0; y < ssize.height && next; ++y)
        {
            const rD = reference.ptr<alvision.uchar>("uchar", y);
            const D =     actual.ptr<alvision.uchar>("uchar", y);
            for (let x = 0; x < ssize.width && next; ++x)
                if (Math.abs(<any>rD[x] - <any>D[x]) >= 1)
                {
                    next = false;
                    this.ts.printf(alvision.cvtest.TSConstants.SUMMARY, "Error in: (%d, %d)\n", x / cn.valueOf(),  y);
                    this.ts.printf(alvision.cvtest.TSConstants.SUMMARY, "Reference value: %d\n", rD[x]);
                    this.ts.printf(alvision.cvtest.TSConstants.SUMMARY, "Actual value: %d\n", D[x]);
                    this.ts.printf(alvision.cvtest.TSConstants.SUMMARY, "Src value: %d\n", raw.ptr<alvision.uchar>("uchar", y)[x]);
                    this.ts.printf(alvision.cvtest.TSConstants.SUMMARY, "Size: (%d, %d)\n", reference.rows, reference.cols);

                    var diff = new alvision.Mat();
                    alvision.absdiff(actual, reference, diff);
                    alvision.EXPECT_EQ(alvision.countNonZero(alvision.MatExpr.op_GreaterThan( diff.reshape(1) , 1)), 0);

                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                    this.ts.set_gtest_status();
                }
        }
    }
});
