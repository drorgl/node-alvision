import tape = require("tape");
import path = require("path");
import colors = require("colors");
import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');
//
//#include "test_precomp.hpp"
//
//using namespace cv;
//using namespace std;

namespace cvtest {

    function initDFTWave(n: alvision.int, inv: boolean): alvision.Mat {
        var i;
        var angle = (inv ? 1 : -1) * Math.PI * 2 / n;
        Complexd wi, w1;
        Mat wave(1, n, CV_64FC2);
        Complexd * w = wave.ptr<Complexd>();

        w1.re = cos(angle);
        w1.im = sin(angle);
        w[0].re = wi.re = 1.;
        w[0].im = wi.im = 0.;

        for (i = 1; i < n; i++) {
            double t = wi.re * w1.re - wi.im * w1.im;
            wi.im = wi.re * w1.im + wi.im * w1.re;
            wi.re = t;
            w[i] = wi;
        }

        return wave;
    }


    function DFT_1D(_src: alvision.Mat, _dst: alvision.Mat, flags: alvision.int, _wave: alvision.Mat = new alvision.Mat()): void {
        _dst.create(_src.size(), _src.type());
        int i, j, k, n = _dst.cols + _dst.rows - 1;
        Mat wave = _wave;
        double scale = (flags & DFT_SCALE) ? 1. / n : 1.;
        size_t esz = _src.elemSize();
        size_t srcstep = esz, dststep = esz;
        const uchar* src0 = _src.ptr();
        uchar * dst0 = _dst.ptr();

        CV_Assert(_src.cols + _src.rows - 1 == n);

        if (wave.empty())
            wave = initDFTWave(n, (flags & DFT_INVERSE) != 0);

        const Complexd* w = wave.ptr<Complexd>();
        if (!_src.isContinuous())
            srcstep = _src.step;
        if (!_dst.isContinuous())
            dststep = _dst.step;

        if (_src.type() == CV_32FC2) {
            for (i = 0; i < n; i++) {
                Complexf * dst = (Complexf *)(dst0 + i * dststep);
                Complexd sum(0, 0);
                int delta = i;
                k = 0;

                for (j = 0; j < n; j++) {
                    const Complexf* src = (const Complexf*)(src0 + j * srcstep);
                    sum.re += src.re * w[k].re - src.im * w[k].im;
                    sum.im += src.re * w[k].im + src.im * w[k].re;
                    k += delta;
                    k -= (k >= n ? n : 0);
                }

                dst.re = (float)(sum.re * scale);
                dst.im = (float)(sum.im * scale);
            }
        }
        else if (_src.type() == CV_64FC2) {
            for (i = 0; i < n; i++) {
                Complexd * dst = (Complexd *)(dst0 + i * dststep);
                Complexd sum(0, 0);
                int delta = i;
                k = 0;

                for (j = 0; j < n; j++) {
                    const Complexd* src = (const Complexd*)(src0 + j * srcstep);
                    sum.re += src.re * w[k].re - src.im * w[k].im;
                    sum.im += src.re * w[k].im + src.im * w[k].re;
                    k += delta;
                    k -= (k >= n ? n : 0);
                }

                dst.re = sum.re * scale;
                dst.im = sum.im * scale;
            }
        }
        else
            CV_Error(alvision.cv.Error.Code.StsUnsupportedFormat, "");
    }


    function DFT_2D(src: alvision.Mat, dst: alvision.Mat, flags: alvision.int): void {
        const cn = 2;
        int i;
        dst.create(src.size(), src.type());
        Mat tmp(src.cols, src.rows, src.type());
        Mat wave = initDFTWave(dst.cols, (flags & DFT_INVERSE) != 0);

        // 1. row-wise transform
        for (i = 0; i < dst.rows; i++) {
            Mat srci = src.row(i).reshape(cn, src.cols), dsti = tmp.col(i);
            DFT_1D(srci, dsti, flags, wave);
        }

        if ((flags & DFT_ROWS) == 0) {
            if (dst.cols != dst.rows)
                wave = initDFTWave(dst.rows, (flags & DFT_INVERSE) != 0);

            // 2. column-wise transform
            for (i = 0; i < dst.cols; i++) {
                Mat srci = tmp.row(i).reshape(cn, tmp.cols), dsti = dst.col(i);
                DFT_1D(srci, dsti, flags, wave);
            }
        }
        else
            alvision.cvtest.transpose(tmp, dst);
    }


    function initDCTWave(n: alvision.int, inv: boolean): alvision.Mat {
        int i, k;
        double angle = Math.PI * 0.5 / n;
        Mat wave(n, n, CV_64F);

        double scale = sqrt(1. / n);
        for (k = 0; k < n; k++)
            wave.at<double>(0, k) = scale;
        scale *= sqrt(2.);
        for (i = 1; i < n; i++)
            for (k = 0; k < n; k++)
                wave.at<double>(i, k) = scale * cos(angle * i * (2 * k + 1));

        if (inv)
            alvision.transpose(wave, wave);

        return wave;
    }


    function DCT_1D(_src: alvision.Mat, _dst: alvision.Mat, flags: alvision.int, _wave: alvision.Mat = new alvision.Mat()): void {
        _dst.create(_src.size(), _src.type());
        int i, j, n = _dst.cols + _dst.rows - 1;
        Mat wave = _wave;
        int srcstep = 1, dststep = 1;
        double * w;

        CV_Assert(_src.cols + _src.rows - 1 == n);

        if (wave.empty())
            wave = initDCTWave(n, (flags & DFT_INVERSE) != 0);
        w = wave.ptr<double>();

        if (!_src.isContinuous())
            srcstep = (int)(_src.step / _src.elemSize());
        if (!_dst.isContinuous())
            dststep = (int)(_dst.step / _dst.elemSize());

        if (_src.type() == CV_32FC1) {
            float * dst = _dst.ptr<float>();

            for (i = 0; i < n; i++ , dst += dststep) {
                const float* src = _src.ptr<float>();
                double sum = 0;

                for (j = 0; j < n; j++ , src += srcstep)
                    sum += src[0] * w[j];
                w += n;
                dst[0] = (float)sum;
            }
        }
        else if (_src.type() == CV_64FC1) {
            double * dst = _dst.ptr<double>();

            for (i = 0; i < n; i++ , dst += dststep) {
                const double* src = _src.ptr<double>();
                double sum = 0;

                for (j = 0; j < n; j++ , src += srcstep)
                    sum += src[0] * w[j];
                w += n;
                dst[0] = sum;
            }
        }
        else
            assert(0);
    }


    function DCT_2D(src: alvision.Mat, dst: alvision.Mat, flags: alvision.int): void {
        const int cn = 1;
        int i;
        dst.create(src.size(), src.type());
        Mat tmp(dst.cols, dst.rows, dst.type());
        Mat wave = initDCTWave(dst.cols, (flags & DCT_INVERSE) != 0);

        // 1. row-wise transform
        for (i = 0; i < dst.rows; i++) {
            Mat srci = src.row(i).reshape(cn, src.cols);
            Mat dsti = tmp.col(i);
            DCT_1D(srci, dsti, flags, wave);
        }

        if ((flags & DCT_ROWS) == 0) {
            if (dst.cols != dst.rows)
                wave = initDCTWave(dst.rows, (flags & DCT_INVERSE) != 0);

            // 2. column-wise transform
            for (i = 0; i < dst.cols; i++) {
                Mat srci = tmp.row(i).reshape(cn, tmp.cols);
                Mat dsti = dst.col(i);
                DCT_1D(srci, dsti, flags, wave);
            }
        }
        else
            alvision.cvtest.transpose(tmp, dst);
    }


    function convertFromCCS(_src0: alvision.Mat, _src1: alvision.Mat, _dst: alvision.Mat, flags: alvision.int): void {
        if (_dst.rows > 1 && (_dst.cols > 1 || (flags & DFT_ROWS))) {
            int i, count = _dst.rows, len = _dst.cols;
            bool is2d = (flags & DFT_ROWS) == 0;
            Mat src0row, src1row, dstrow;
            for (i = 0; i < count; i++) {
                int j = !is2d || i == 0 ? i : count - i;
                src0row = _src0.row(i);
                src1row = _src1.row(j);
                dstrow = _dst.row(i);
                convertFromCCS(src0row, src1row, dstrow, 0);
            }

            if (is2d) {
                src0row = _src0.col(0);
                dstrow = _dst.col(0);
                convertFromCCS(src0row, src0row, dstrow, 0);
                if ((len & 1) == 0) {
                    src0row = _src0.col(_src0.cols - 1);
                    dstrow = _dst.col(len / 2);
                    convertFromCCS(src0row, src0row, dstrow, 0);
                }
            }
        }
        else {
            int i, n = _dst.cols + _dst.rows - 1, n2 = (n + 1) >> 1;
            int cn = _src0.channels();
            int srcstep = cn, dststep = 1;

            if (!_dst.isContinuous())
                dststep = (int)(_dst.step / _dst.elemSize());

            if (!_src0.isContinuous())
                srcstep = (int)(_src0.step / _src0.elemSize1());

            if (_dst.depth() == CV_32F) {
                Complexf * dst = _dst.ptr<Complexf>();
                const float* src0 = _src0.ptr<float>();
                const float* src1 = _src1.ptr<float>();
                int delta0, delta1;

                dst.re = src0[0];
                dst.im = 0;

                if ((n & 1) == 0) {
                    dst[n2 * dststep].re = src0[(cn == 1 ? n - 1 : n2) * srcstep];
                    dst[n2 * dststep].im = 0;
                }

                delta0 = srcstep;
                delta1 = delta0 + (cn == 1 ? srcstep : 1);
                if (cn == 1)
                    srcstep *= 2;

                for (i = 1; i < n2; i++ , delta0 += srcstep, delta1 += srcstep) {
                    float t0 = src0[delta0];
                    float t1 = src0[delta1];

                    dst[i * dststep].re = t0;
                    dst[i * dststep].im = t1;

                    t0 = src1[delta0];
                    t1 = -src1[delta1];

                    dst[(n - i) * dststep].re = t0;
                    dst[(n - i) * dststep].im = t1;
                }
            }
            else {
                Complexd * dst = _dst.ptr<Complexd>();
                const double* src0 = _src0.ptr<double>();
                const double* src1 = _src1.ptr<double>();
                int delta0, delta1;

                dst.re = src0[0];
                dst.im = 0;

                if ((n & 1) == 0) {
                    dst[n2 * dststep].re = src0[(cn == 1 ? n - 1 : n2) * srcstep];
                    dst[n2 * dststep].im = 0;
                }

                delta0 = srcstep;
                delta1 = delta0 + (cn == 1 ? srcstep : 1);
                if (cn == 1)
                    srcstep *= 2;

                for (i = 1; i < n2; i++ , delta0 += srcstep, delta1 += srcstep) {
                    double t0 = src0[delta0];
                    double t1 = src0[delta1];

                    dst[i * dststep].re = t0;
                    dst[i * dststep].im = t1;

                    t0 = src1[delta0];
                    t1 = -src1[delta1];

                    dst[(n - i) * dststep].re = t0;
                    dst[(n - i) * dststep].im = t1;
                }
            }
        }
    }


    function fixCCS(mat: alvision.Mat, cols: alvision.int, flags: alvision.int): void {
        int i, rows = mat.rows;
        int rows2 = (flags & DFT_ROWS) ? rows : rows / 2 + 1, cols2 = cols / 2 + 1;

        CV_Assert(cols2 == mat.cols);

        if (mat.type() == CV_32FC2) {
            for (i = 0; i < rows2; i++) {
                Complexf * row = mat.ptr<Complexf>(i);
                if ((flags & DFT_ROWS) || i == 0 || (i == rows2 - 1 && rows % 2 == 0)) {
                    row[0].im = 0;
                    if (cols % 2 == 0)
                        row[cols2 - 1].im = 0;
                }
                else {
                    Complexf * row2 = mat.ptr<Complexf>(rows - i);
                    row2[0].re = row[0].re;
                    row2[0].im = -row[0].im;

                    if (cols % 2 == 0) {
                        row2[cols2 - 1].re = row[cols2 - 1].re;
                        row2[cols2 - 1].im = -row[cols2 - 1].im;
                    }
                }
            }
        }
        else if (mat.type() == CV_64FC2) {
            for (i = 0; i < rows2; i++) {
                Complexd * row = mat.ptr<Complexd>(i);
                if ((flags & DFT_ROWS) || i == 0 || (i == rows2 - 1 && rows % 2 == 0)) {
                    row[0].im = 0;
                    if (cols % 2 == 0)
                        row[cols2 - 1].im = 0;
                }
                else {
                    Complexd * row2 = mat.ptr<Complexd>(rows - i);
                    row2[0].re = row[0].re;
                    row2[0].im = -row[0].im;

                    if (cols % 2 == 0) {
                        row2[cols2 - 1].re = row[cols2 - 1].re;
                        row2[cols2 - 1].im = -row[cols2 - 1].im;
                    }
                }
            }
        }
    }

    //#if defined _MSC_VER &&  _MSC_VER >= 1700
    //#pragma optimize("", off)
    //#endif
    function mulComplex(src1: alvision.Mat, src2: alvision.Mat, dst: alvision.Mat, flags: alvision.int): void {
        dst.create(src1.rows, src1.cols, src1.type());
        int i, j, depth = src1.depth(), cols = src1.cols * 2;

        CV_Assert(src1.size == src2.size && src1.type() == src2.type() &&
            (src1.type() == CV_32FC2 || src1.type() == CV_64FC2));

        for (i = 0; i < dst.rows; i++) {
            if (depth == CV_32F) {
                const float* a = src1.ptr<float>(i);
                const float* b = src2.ptr<float>(i);
                float * c = dst.ptr<float>(i);

                if (!(flags & CV_DXT_MUL_CONJ))
                    for (j = 0; j < cols; j += 2) {
                        double re = (double)a[j] * (double)b[j] - (double)a[j + 1] * (double)b[j + 1];
                        double im = (double)a[j + 1] * (double)b[j] + (double)a[j] * (double)b[j + 1];

                        c[j] = (float)re;
                        c[j + 1] = (float)im;
                    }
                else
                    for (j = 0; j < cols; j += 2) {
                        double re = (double)a[j] * (double)b[j] + (double)a[j + 1] * (double)b[j + 1];
                        double im = (double)a[j + 1] * (double)b[j] - (double)a[j] * (double)b[j + 1];

                        c[j] = (float)re;
                        c[j + 1] = (float)im;
                    }
            }
            else {
                const double* a = src1.ptr<double>(i);
                const double* b = src2.ptr<double>(i);
                double * c = dst.ptr<double>(i);

                if (!(flags & CV_DXT_MUL_CONJ))
                    for (j = 0; j < cols; j += 2) {
                        double re = a[j] * b[j] - a[j + 1] * b[j + 1];
                        double im = a[j + 1] * b[j] + a[j] * b[j + 1];

                        c[j] = re;
                        c[j + 1] = im;
                    }
                else
                    for (j = 0; j < cols; j += 2) {
                        double re = a[j] * b[j] + a[j + 1] * b[j + 1];
                        double im = a[j + 1] * b[j] - a[j] * b[j + 1];

                        c[j] = re;
                        c[j + 1] = im;
                    }
            }
        }
    }
    //#if defined _MSC_VER &&  _MSC_VER >= 1700
    //#pragma optimize("", on)
    //#endif

}


class CxCore_DXTBaseTest extends alvision.cvtest.ArrayTest
{
    //typedef alvision.cvtest.ArrayTest Base;
    //CxCore_DXTBaseTest( bool _allow_complex=false, bool _allow_odd=false,
    //                    bool _spectrum_mode=false );
    constructor( _allow_complex : boolean, _allow_odd : boolean, _spectrum_mode  : boolean) {
        super();

        this.Base = ();
        this.flags = (0);
        this.allow_complex = (_allow_complex);
        this.allow_odd = (_allow_odd);

        this.spectrum_mode = (_spectrum_mode);
        this.inplace = (false);
        this.temp_dst = (false);

        this.test_array[INPUT].push(null);
        if (this.spectrum_mode)
            this.test_array[INPUT].push(null);
        this.test_array[OUTPUT].push(null);
        this.test_array[REF_OUTPUT].push(null);
        this.test_array[TEMP].push(null);
        this.test_array[TEMP].push(null);

        this.max_log_array_size = 9;
        this.element_wise_relative_error = spectrum_mode;
    }


    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        var rng = this.ts.get_rng();
        int bits = alvision.cvtest.randInt(rng);
        int depth = alvision.cvtest.randInt(rng) % 2 + CV_32F;
        int cn = !allow_complex || !(bits & 256) ? 1 : 2;
        Size size;
        Base::get_test_array_types_and_sizes(test_case_idx, sizes, types);

        flags = bits & (CV_DXT_INVERSE | CV_DXT_SCALE | CV_DXT_ROWS | CV_DXT_MUL_CONJ);
        if (spectrum_mode)
            flags &= ~CV_DXT_INVERSE;
        types[TEMP][0] = types[TEMP][1] = types[INPUT][0] =
            types[OUTPUT][0] = CV_MAKETYPE(depth, cn);
        size = sizes[INPUT][0];

        temp_dst = false;

        if (flags & CV_DXT_ROWS && (bits & 1024)) {
            if (bits & 16)
                size.width = 1;
            else
                size.height = 1;
            flags &= ~CV_DXT_ROWS;
        }

        const int P2_MIN_SIZE = 32;
        if (((bits >> 10) & 1) == 0) {
            size.width = (size.width / P2_MIN_SIZE) * P2_MIN_SIZE;
            size.width = MAX(size.width, 1);
            size.height = (size.height / P2_MIN_SIZE) * P2_MIN_SIZE;
            size.height = MAX(size.height, 1);
        }

        if (!allow_odd) {
            if (size.width > 1 && (size.width & 1) != 0)
                size.width = (size.width + 1) & -2;

            if (size.height > 1 && (size.height & 1) != 0 && !(flags & CV_DXT_ROWS))
                size.height = (size.height + 1) & -2;
        }

        sizes[INPUT][0] = sizes[OUTPUT][0] = size;
        sizes[TEMP][0] = sizes[TEMP][1] = cvSize(0, 0);

        if (spectrum_mode) {
            if (cn == 1) {
                types[OUTPUT][0] = depth + 8;
                sizes[TEMP][0] = size;
            }
            sizes[INPUT][0] = sizes[INPUT][1] = size;
            types[INPUT][1] = types[INPUT][0];
        }
        else if ( /*(cn == 2 && (bits&32)) ||*/ (cn == 1 && allow_complex)) {
            types[TEMP][0] = depth + 8; // CV_??FC2
            sizes[TEMP][0] = size;
            size = cvSize(size.width / 2 + 1, size.height);

            if (flags & CV_DXT_INVERSE) {
                if (cn == 2) {
                    types[OUTPUT][0] = depth;
                    sizes[INPUT][0] = size;
                }
                types[TEMP][1] = types[TEMP][0];
                sizes[TEMP][1] = sizes[TEMP][0];
            }
            else {
                if (allow_complex)
                    types[OUTPUT][0] = depth + 8;

                if (cn == 2) {
                    types[INPUT][0] = depth;
                    types[TEMP][1] = types[TEMP][0];
                    sizes[TEMP][1] = size;
                }
                else {
                    types[TEMP][1] = depth;
                    sizes[TEMP][1] = sizes[TEMP][0];
                }
                temp_dst = true;
            }
        }

        inplace = false;
        if (spectrum_mode ||
            (!temp_dst && types[INPUT][0] == types[OUTPUT][0]) ||
            (temp_dst && types[INPUT][0] == types[TEMP][1]))
            inplace = (bits & 64) != 0;

        types[REF_OUTPUT][0] = types[OUTPUT][0];
        sizes[REF_OUTPUT][0] = sizes[OUTPUT][0];
    }
    prepare_test_case(test_case_idx: alvision.int): alvision.int{
        int code = Base::prepare_test_case(test_case_idx);
        if (code > 0) {
            int in_type = test_mat[INPUT][0].type();
            int out_type = test_mat[OUTPUT][0].type();

            if (CV_MAT_CN(in_type) == 2 && CV_MAT_CN(out_type) == 1)
                alvision.cvtest.fixCCS(test_mat[INPUT][0], test_mat[OUTPUT][0].cols, flags);

            if (inplace)
                alvision.cvtest.copy(test_mat[INPUT][test_case_idx & (int)spectrum_mode],
                    temp_dst ? test_mat[TEMP][1] :
                        in_type == out_type ? test_mat[OUTPUT][0] :
                            test_mat[TEMP][0]);
        }

        return code;
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        return super.get_success_error_level(test_case_idx, i, j);
    }

    protected flags : alvision.int; // transformation flags
    protected  allow_complex : boolean; // whether input/output may be complex or not:
                        // true for DFT and MulSpectrums, false for DCT
    protected allow_odd : boolean;     // whether input/output may be have odd (!=1) dimensions:
                        // true for DFT and MulSpectrums, false for DCT
    protected spectrum_mode : boolean; // (2 complex/ccs inputs, 1 complex/ccs output):
                        // true for MulSpectrums, false for DFT and DCT
    protected  inplace  : boolean;       // inplace operation (set for each individual test case)
    protected  temp_dst : boolean;      // use temporary destination (for real.ccs DFT and ccs MulSpectrums)
};




////////////////////// FFT ////////////////////////
class CxCore_DFTTest extends CxCore_DXTBaseTest
{
    constructor() {
        super(true, true, false);

    }

    run_func(): void {
        Mat & dst = temp_dst ? test_mat[TEMP][1] : test_mat[OUTPUT][0];
        const Mat& src = inplace ? dst: test_mat[INPUT][0];

        if (!(flags & CV_DXT_INVERSE))
            alvision.dft(src, dst, flags);
        else
            alvision.idft(src, dst, flags & ~CV_DXT_INVERSE);
    }
    prepare_to_validation(test_case_idx: alvision.int): void {
        Mat & src = test_mat[INPUT][0];
        Mat & dst = test_mat[REF_OUTPUT][0];
        Mat * tmp_src = &src;
        Mat * tmp_dst = &dst;
        int src_cn = src.channels();
        int dst_cn = dst.channels();

        if (src_cn != 2 || dst_cn != 2) {
            tmp_src = &test_mat[TEMP][0];

            if (!(flags & CV_DXT_INVERSE)) {
                Mat & cvdft_dst = test_mat[TEMP][1];
                alvision.cvtest.convertFromCCS(cvdft_dst, cvdft_dst,
                    test_mat[OUTPUT][0], flags);
            *tmp_src = alvision.Scalar.all(0);
                alvision.cvtest.insert(src, *tmp_src, 0);
            }
            else {
                alvision.cvtest.convertFromCCS(src, src, *tmp_src, flags);
                tmp_dst = &test_mat[TEMP][1];
            }
        }

        if (src.rows == 1 || (src.cols == 1 && !(flags & CV_DXT_ROWS)))
            alvision.cvtest.DFT_1D( *tmp_src, *tmp_dst, flags);
        else
            alvision.cvtest.DFT_2D( *tmp_src, *tmp_dst, flags);

        if (tmp_dst != &dst)
            alvision.cvtest.extract( *tmp_dst, dst, 0);
    }
};


////////////////////// DCT ////////////////////////
class CxCore_DCTTest extends CxCore_DXTBaseTest
{
    constructor() {
        super(false, false, false);
    }

    run_func(): void {
        Mat & dst = test_mat[OUTPUT][0];
        const Mat& src = inplace ? dst: test_mat[INPUT][0];

        if (!(flags & CV_DXT_INVERSE))
            alvision.dct(src, dst, flags);
        else
            alvision.idct(src, dst, flags & ~CV_DXT_INVERSE);
    }
    prepare_to_validation(test_case_idx: alvision.int): void {
        const Mat& src = test_mat[INPUT][0];
        Mat & dst = test_mat[REF_OUTPUT][0];

        if (src.rows == 1 || (src.cols == 1 && !(flags & CV_DXT_ROWS)))
            alvision.cvtest.DCT_1D(src, dst, flags);
        else
            alvision.cvtest.DCT_2D(src, dst, flags);
    }
};



////////////////////// MulSpectrums ////////////////////////
class CxCore_MulSpectrumsTest extends CxCore_DXTBaseTest
{
    constructor() {
        super(true, true, true)
    }

    run_func(): void {
        Mat & dst = !test_mat[TEMP].empty() && !test_mat[TEMP][0].empty() ?
            test_mat[TEMP][0] : test_mat[OUTPUT][0];
        const Mat* src1 = &test_mat[INPUT][0], *src2 = &test_mat[INPUT][1];

        if (inplace) {
            if (ts.get_current_test_info().test_case_idx & 1)
                src2 = &dst;
            else
                src1 = &dst;
        }

        alvision.mulSpectrums( *src1, *src2, dst, flags, (flags & CV_DXT_MUL_CONJ) != 0);
    }
    prepare_to_validation(test_case_idx: alvision.int): void {
        Mat * src1 = &test_mat[INPUT][0];
        Mat * src2 = &test_mat[INPUT][1];
        Mat & dst = test_mat[OUTPUT][0];
        Mat & dst0 = test_mat[REF_OUTPUT][0];
        int cn = src1.channels();

        if (cn == 1) {
            alvision.cvtest.convertFromCCS( *src1, *src1, dst, flags);
            alvision.cvtest.convertFromCCS( *src2, *src2, dst0, flags);
            src1 = &dst;
            src2 = &dst0;
        }

        alvision.cvtest.mulComplex( *src1, *src2, dst0, flags);
        if (cn == 1) {
            Mat & temp = test_mat[TEMP][0];
            alvision.cvtest.convertFromCCS(temp, temp, dst, flags);
        }
    }
};



alvision.cvtest.TEST('Core_DCT', 'accuracy', () => { CxCore_DCTTest test; test.safe_run(); });
alvision.cvtest.TEST('Core_DFT', 'accuracy', () => { CxCore_DFTTest test; test.safe_run(); });
alvision.cvtest.TEST('Core_MulSpectrums', 'accuracy', () => { CxCore_MulSpectrumsTest test; test.safe_run(); });

class Core_DFTComplexOutputTest  extends alvision.cvtest.BaseTest
{

    run(iii: alvision.int) : void
    {
        var rng = alvision.theRNG();
        for( var i = 0; i < 10; i++ )
        {
            var m = rng.uniform(2, 11);
            var n = rng.uniform(2, 11);
            var depth = rng.uniform(0, 2) + CV_32F;
            Mat src8u(m, n, depth), src(m, n, depth), dst(m, n, CV_MAKETYPE(depth, 2));
            Mat z = Mat::zeros(m, n, depth), dstz;
            randu(src8u, alvision.Scalar.all(0), Scalar::all(10));
            src8u.convertTo(src, src.type());
            dst = Scalar::all(123);
            Mat mv[] = {src, z}, srcz;
            merge(mv, 2, srcz);
            dft(srcz, dstz);
            dft(src, dst, DFT_COMPLEX_OUTPUT);
            if (alvision.cvtest.norm(dst, dstz, NORM_INF) > 1e-3)
            {
                cout << "actual:\n" << dst << endl << endl;
                cout << "reference:\n" << dstz << endl << endl;
                CV_Error(CV_StsError, "");
            }
        }
    }
};

alvision.cvtest.TEST('Core_DFT', 'complex_output', () => { Core_DFTComplexOutputTest test; test.safe_run(); });

alvision.cvtest.TEST('Core_DFT', 'complex_output2',()=>
{
    for( var i = 0; i < 100; i++ )
    {
        var type = alvision.theRNG().uniform(0, 2) ? CV_64F : CV_32F;
        var m =    alvision.theRNG().uniform(1, 10);
        var n =    alvision.theRNG().uniform(1, 10);
        Mat x(m, n, type), out;
        randu(x, -1., 1.);
        dft(x, out, DFT_ROWS | DFT_COMPLEX_OUTPUT);
        double nrm = norm(out, NORM_INF);
        double thresh = n*m*2;
        if( nrm > thresh )
        {
            cout << "x: " << x << endl;
            cout << "out: " << out << endl;
            ASSERT_LT(nrm, thresh);
        }
    }
});
