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



//DROR: WORKAROUND!:
const CV_DXT_MUL_CONJ = 8;

//namespace cvtest {

    function initDFTWave(n: alvision.int, inv: boolean): alvision.Mat {
        var angle = (inv ? 1 : -1) * Math.PI * 2 / n.valueOf();
        var wi = new alvision.Complexd(), w1 = new alvision.Complexd();
        var wave = new alvision.Mat(1, n, alvision.MatrixType.CV_64FC2);
        var w = wave.ptr<alvision.Complexd>("Complexd");

        w1.re = Math.cos(angle);
        w1.im = Math.sin(angle);
        w[0].re = wi.re = 1.;
        w[0].im = wi.im = 0.;

        for (var i = 1; i < n; i++) {
            var t = wi.re.valueOf() * w1.re.valueOf() - wi.im.valueOf() * w1.im.valueOf();
            wi.im = wi.re.valueOf() * w1.im.valueOf() + wi.im.valueOf() * w1.re.valueOf();
            wi.re = t;
            w[i] = wi;
        }

        return wave;
    }


    function DFT_1D(_src: alvision.Mat, _dst: alvision.Mat, flags: alvision.int, _wave: alvision.Mat = new alvision.Mat()): void {
        _dst.create(_src.size(), _src.type());
        //int i, j, k,
            var n = _dst.cols().valueOf() + _dst.rows().valueOf() - 1;
        var wave = _wave;
        var scale = (flags.valueOf() & alvision.DftFlags.DFT_SCALE) ? 1. / n : 1.;
        var esz = _src.elemSize();
        var srcstep = esz, dststep = esz;
        //const uchar* src0 = _src.ptr();
        //uchar * dst0 = _dst.ptr();

        alvision.CV_Assert(()=>_src.cols().valueOf() + _src.rows().valueOf() - 1 == n);

        if (wave.empty())
            wave = initDFTWave(n, (flags.valueOf() & alvision.DftFlags.DFT_INVERSE) != 0);

        var w = wave.ptr<alvision.Complexd>("Complexd");
        if (!_src.isContinuous())
            srcstep = _src.step;
        if (!_dst.isContinuous())
            dststep = _dst.step;

        var k = 0;

        if (_src.type() == alvision.MatrixType.CV_32FC2) {
            var dst0 = _dst.ptr<alvision.Complexf>("Complexf");
            for (var i = 0; i < n; i++) {
                var dst =  (dst0[ i * dststep.valueOf()]);
                var sum = new alvision.Complexd (0, 0);
                var delta = i;
                k = 0;

                for (var j = 0; j < n; j++) {
                    var src0 = _src.ptr<alvision.Complexf>("Complexf");
                    var src = (src0[ j * srcstep.valueOf()]);
                    sum.re = sum.re.valueOf() + src.re.valueOf() * w[k].re.valueOf() - src.im.valueOf() * w[k].im.valueOf();
                    sum.im = sum.im.valueOf() + src.re.valueOf() * w[k].im.valueOf() + src.im.valueOf() * w[k].re.valueOf();
                    k += delta;
                    k -= (k >= n ? n : 0);
                }

                dst.re = (sum.re.valueOf() * scale);
                dst.im = (sum.im.valueOf() * scale);
            }
        }
        else if (_src.type() == alvision.MatrixType.CV_64FC2) {
            for (var i = 0; i < n; i++) {
                var dst0 = _dst.ptr<alvision.Complexd>("Complexd");
                var dst = (dst0[ i * dststep.valueOf()]);
                var sum = new alvision.Complexd (0, 0);
                var delta = i;
                k = 0;

                for (var j = 0; j < n; j++) {
                    var src0 = _src.ptr<alvision.Complexd>("Complexd");
                    var src = (src0[ + j * srcstep.valueOf()]);
                    sum.re =sum.re.valueOf() + src.re.valueOf() * w[k].re.valueOf() - src.im.valueOf() * w[k].im.valueOf();
                    sum.im =sum.im.valueOf() + src.re.valueOf() * w[k].im.valueOf() + src.im.valueOf() * w[k].re.valueOf();
                    k += delta;
                    k -= (k >= n ? n : 0);
                }

                dst.re = sum.re.valueOf() * scale;
                dst.im = sum.im.valueOf() * scale;
            }
        }
        else
            alvision.CV_Error(alvision.cv.Error.Code.StsUnsupportedFormat, "");
    }


    function DFT_2D(src: alvision.Mat, dst: alvision.Mat, flags: alvision.int): void {
        const cn = 2;
        //int i;
        dst.create(src.size(), src.type());
        var tmp = new alvision.Mat(src.cols(), src.rows(), src.type());
        var wave = initDFTWave(dst.cols(), (flags.valueOf() & alvision.DftFlags. DFT_INVERSE) != 0);

        // 1. row-wise transform
        for (var i = 0; i < dst.rows(); i++) {
            var srci = src.row(i).reshape(cn, src.cols()), dsti = tmp.col(i);
            DFT_1D(srci, dsti, flags, wave);
        }

        if ((flags.valueOf() & alvision.DftFlags.DFT_ROWS) == 0) {
            if (dst.cols() != dst.rows())
                wave = initDFTWave(dst.rows(), (flags.valueOf() & alvision.DftFlags. DFT_INVERSE) != 0);

            // 2. column-wise transform
            for (i = 0; i < dst.cols(); i++) {
                var srci = tmp.row(i).reshape(cn, tmp.cols()), dsti = dst.col(i);
                DFT_1D(srci, dsti, flags, wave);
            }
        }
        else
            alvision.transpose(tmp, dst);
    }


    function initDCTWave(n: alvision.int, inv: boolean): alvision.Mat {
        //int i, k;
        var angle = Math.PI * 0.5 / n.valueOf();
        var wave = new alvision.Mat(n, n, alvision.MatrixType.CV_64F);

        var scale = Math.sqrt(1. / n.valueOf());
        for (var k = 0; k < n; k++)
            wave.at<alvision.double>("double", 0, k).set( scale);
        scale *= Math.sqrt(2.);
        for (var i = 1; i < n; i++)
            for (k = 0; k < n; k++)
                wave.at<alvision.double>("double",i, k).set( scale * Math.cos(angle * i * (2 * k + 1)));

        if (inv)
            alvision.transpose(wave, wave);

        return wave;
    }


    function DCT_1D(_src: alvision.Mat, _dst: alvision.Mat, flags: alvision.int, _wave: alvision.Mat = new alvision.Mat()): void {
        _dst.create(_src.size(), _src.type());
        //int i, j,
            var n = _dst.cols().valueOf() + _dst.rows().valueOf() - 1;
        var wave = _wave;
        var srcstep = 1, dststep = 1;
        //double * w;

        alvision.CV_Assert(()=>_src.cols().valueOf() + _src.rows().valueOf() - 1 == n);

        if (wave.empty())
            wave = initDCTWave(n, (flags.valueOf() & alvision.DftFlags. DFT_INVERSE) != 0);
        var w_ = wave.ptr<alvision.double>("double");
        var wloc_ = 0;

        if (!_src.isContinuous())
            srcstep = (_src.step / _src.elemSize().valueOf());
        if (!_dst.isContinuous())
            dststep = (_dst.step / _dst.elemSize().valueOf());

        if (_src.type() == alvision.MatrixType. CV_32FC1) {
            var dst_ = _dst.ptr<alvision.float>("float");
            var dstloc_ = 0;

            for (var i = 0; i < n; i++ , dstloc_ += dststep) {
                var src_ = _src.ptr<alvision.float>("float");
                var srcloc_ = 0;

                var sum = 0;

                for (var j = 0; j < n; j++ , srcloc_ += srcstep, src = src_.slice(srcloc_))
                    var w = w_.slice(wloc_);
                    sum += src[0].valueOf() * w[j].valueOf();
                wloc_ += n;
                
                var dst = dst_.slice(dstloc_);
                dst[0] = sum;
            }
        }
        else if (_src.type() == alvision.MatrixType. CV_64FC1) {
            var dst_ = _dst.ptr<alvision.double>("double");
            var dstloc_ = 0;

            for (i = 0; i < n; i++ , dstloc_ += dststep) {
                var src_ = _src.ptr<alvision.double>("double");
                var srcloc_ = 0;
                var sum = 0;

                for (var j = 0; j < n; j++ , srcloc_ += srcstep) {
                    var src = src_.slice(srcloc_);
                    var w = w_.slice(wloc_);
                        sum += src[0].valueOf() * w[j].valueOf();
                }
                wloc_ += n;

                var dst = dst_.slice(dstloc_);
                dst[0] = sum;
            }
        }
        else
            alvision.assert(()=>false);
    }


    function DCT_2D(src: alvision.Mat, dst: alvision.Mat, flags: alvision.int): void {
        const  cn = 1;
        //int i;
        dst.create(src.size(), src.type());
        var tmp = new alvision.Mat(dst.cols(), dst.rows(), dst.type());
        var wave = initDCTWave(dst.cols(), (flags.valueOf() & alvision.DftFlags. DCT_INVERSE) != 0);

        // 1. row-wise transform
        for (var i = 0; i < dst.rows(); i++) {
            var srci = src.row(i).reshape(cn, src.cols());
            var dsti = tmp.col(i);
            DCT_1D(srci, dsti, flags, wave);
        }

        if ((flags.valueOf() & alvision.DftFlags.DCT_ROWS) == 0) {
            if (dst.cols != dst.rows)
                wave = initDCTWave(dst.rows(), (flags.valueOf() &alvision.DftFlags. DCT_INVERSE) != 0);

            // 2. column-wise transform
            for (i = 0; i < dst.cols(); i++) {
                var srci = tmp.row(i).reshape(cn, tmp.cols());
                var dsti = dst.col(i);
                DCT_1D(srci, dsti, flags, wave);
            }
        }
        else
            alvision.transpose(tmp, dst);
    }


    function convertFromCCS(_src0: alvision.Mat, _src1: alvision.Mat, _dst: alvision.Mat, flags: alvision.int): void {
        if (_dst.rows() > 1 && (_dst.cols() > 1 || (flags.valueOf() & alvision.DftFlags.DFT_ROWS))) {
            //int i,
                var count = _dst.rows(), len = _dst.cols();
            var is2d = (flags.valueOf() &alvision.DftFlags. DFT_ROWS) == 0;
            var src0row = new alvision.Mat();
            var src1row = new alvision.Mat();
            var dstrow = new alvision.Mat();
            for (var i = 0; i < count; i++) {
                var j = !is2d || i == 0 ? i : count.valueOf() - i;
                src0row = _src0.row(i);
                src1row = _src1.row(j);
                dstrow = _dst.row(i);
                convertFromCCS(src0row, src1row, dstrow, 0);
            }

            if (is2d) {
                src0row = _src0.col(0);
                dstrow = _dst.col(0);
                convertFromCCS(src0row, src0row, dstrow, 0);
                if ((len.valueOf() & 1) == 0) {
                    src0row = _src0.col(_src0.cols().valueOf() - 1);
                    dstrow = _dst.col(len.valueOf() / 2);
                    convertFromCCS(src0row, src0row, dstrow, 0);
                }
            }
        }
        else {
            //int i,
                var n = _dst.cols().valueOf() + _dst.rows().valueOf() - 1, n2 = (n + 1) >> 1;
            var cn = _src0.channels().valueOf();
            var srcstep = cn, dststep = 1;

            if (!_dst.isContinuous())
                dststep = (_dst.step / _dst.elemSize().valueOf());

            if (!_src0.isContinuous())
                srcstep = (_src0.step / _src0.elemSize1().valueOf());

            if (_dst.depth() == alvision.MatrixType.CV_32F) {
                var dst = _dst.ptr<alvision.Complexf>("Complexf");
                var src0 = _src0.ptr<alvision.float>("float");
                var src1 = _src1.ptr<alvision.float>("float");
                //int delta0, delta1;

                dst[0].re = src0[0];
                dst[0].im = 0;

                if ((n & 1) == 0) {
                    dst[n2 * dststep].re = src0[(cn == 1 ? n - 1 : n2) * srcstep];
                    dst[n2 * dststep].im = 0;
                }

                var delta0 = srcstep.valueOf();
                var delta1 = delta0 + (cn == 1 ? srcstep : 1);
                if (cn == 1)
                    srcstep *= 2;

                for (var i = 1; i < n2; i++ , delta0 += srcstep, delta1 += srcstep) {
                    var t0 = src0[delta0];
                    var t1 = src0[delta1];

                    dst[i * dststep].re = t0;
                    dst[i * dststep].im = t1;

                    t0 = src1[delta0];
                    t1 = -src1[delta1];

                    dst[(n - i) * dststep].re = t0;
                    dst[(n - i) * dststep].im = t1;
                }
            }
            else {
                var dst = _dst.ptr<alvision.Complexd>("Complexd");
                var src0 = _src0.ptr<alvision.double>("double");
                var src1 = _src1.ptr<alvision.double>("double");
                //int delta0, delta1;

                dst[0].re = src0[0];
                dst[0].im = 0;

                if ((n & 1) == 0) {
                    dst[n2 * dststep].re = src0[(cn == 1 ? n - 1 : n2) * srcstep];
                    dst[n2 * dststep].im = 0;
                }

                delta0 = srcstep;
                delta1 = delta0 + (cn == 1 ? srcstep : 1);
                if (cn == 1)
                    srcstep *= 2;

                for (i = 1; i < n2; i++ , delta0 += srcstep, delta1 += srcstep) {
                    var t0 = src0[delta0];
                    var t1 = src0[delta1];

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
        //int i,
        var rows = mat.rows();
        var rows2 = (flags.valueOf() & alvision.DftFlags. DFT_ROWS) ? rows: rows.valueOf() / 2 + 1, cols2 = cols.valueOf() / 2 + 1;

        alvision.CV_Assert(()=>cols2 == mat.cols());

        if (mat.type() == alvision.MatrixType.CV_32FC2) {
            for (var i = 0; i < rows2; i++) {
                var row = mat.ptr<alvision.Complexf>("Complexf", i);
                if ((flags.valueOf() & alvision.DftFlags. DFT_ROWS) || i == 0 || (i == rows2.valueOf() - 1 && rows.valueOf() % 2 == 0)) {
                    row[0].im = 0;
                    if (cols.valueOf() % 2 == 0)
                        row[cols2 - 1].im = 0;
                }
                else {
                    var row2 = mat.ptr<alvision.Complexf>("Complexf", rows.valueOf() - i);
                    row2[0].re = row[0].re;
                    row2[0].im = -row[0].im;

                    if (cols.valueOf() % 2 == 0) {
                        row2[cols2 - 1].re = row[cols2 - 1].re;
                        row2[cols2 - 1].im = -row[cols2 - 1].im;
                    }
                }
            }
        }
        else if (mat.type() == alvision.MatrixType.CV_64FC2) {
            for (i = 0; i < rows2; i++) {
                var row = mat.ptr<alvision.Complexd>("Complexd", i);
                if ((flags.valueOf() & alvision.DftFlags. DFT_ROWS) || i == 0 || (i == rows2.valueOf() - 1 && rows.valueOf() % 2 == 0)) {
                    row[0].im = 0;
                    if (cols.valueOf() % 2 == 0)
                        row[cols2 - 1].im = 0;
                }
                else {
                    var row2 = mat.ptr<alvision.Complexd>("Complexd", rows.valueOf() - i);
                    row2[0].re = row[0].re;
                    row2[0].im = -row[0].im;

                    if (cols.valueOf() % 2 == 0) {
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
        dst.create(src1.rows(), src1.cols(), src1.type());
        //int i, j,
            var depth = src1.depth(), cols = src1.cols().valueOf() * 2;

        alvision.CV_Assert(()=>src1.size == src2.size && src1.type() == src2.type() &&
            (src1.type() == alvision.MatrixType.CV_32FC2 || src1.type() == alvision.MatrixType.CV_64FC2));

        for (var i = 0; i < dst.rows(); i++) {
            if (depth == alvision.MatrixType.CV_32F) {
                const a = src1.ptr<alvision.float>("float", i);
                const b = src2.ptr<alvision.float>("float",i);
                var c = dst.ptr<alvision.float>("float",i);

                if (!(flags.valueOf() & CV_DXT_MUL_CONJ))
                    for (var j = 0; j < cols; j += 2) {
                        var re = a[j].valueOf() * b[j].valueOf() - a[j + 1].valueOf() * b[j + 1].valueOf();
                        var im = a[j + 1].valueOf() * b[j].valueOf() + a[j].valueOf() * b[j + 1].valueOf();

                        c[j] = re;
                        c[j + 1] = im;
                    }
                else
                    for (var j = 0; j < cols; j += 2) {
                        var re = a[j].valueOf() * b[j].valueOf() + a[j + 1].valueOf() * b[j + 1].valueOf();
                        var im = a[j + 1].valueOf() * b[j].valueOf() - a[j].valueOf() * b[j + 1].valueOf();

                        c[j] = re;
                        c[j + 1] = im;
                    }
            }
            else {
                const  a = src1.ptr<alvision.double>("double",i);
                const  b = src2.ptr<alvision.double>("double",i);
                var c = dst.ptr<alvision.double>("double", i);

                if (!(flags.valueOf() & CV_DXT_MUL_CONJ))
                    for (var j = 0; j < cols; j += 2) {
                        var re = a[j].valueOf() * b[j].valueOf() - a[j + 1].valueOf() * b[j + 1].valueOf();
                        var im = a[j + 1].valueOf() * b[j].valueOf() + a[j].valueOf() * b[j + 1].valueOf();

                        c[j] = re;
                        c[j + 1] = im;
                    }
                else
                    for (var j = 0; j < cols; j += 2) {
                        var re = a[j].valueOf() * b[j].valueOf() + a[j + 1].valueOf() * b[j + 1].valueOf();
                        var im = a[j + 1].valueOf() * b[j].valueOf() - a[j].valueOf() * b[j + 1].valueOf();

                        c[j] = re;
                        c[j + 1] = im;
                    }
            }
        }
    }
    //#if defined _MSC_VER &&  _MSC_VER >= 1700
    //#pragma optimize("", on)
    //#endif

//}


class CxCore_DXTBaseTest extends alvision.cvtest.ArrayTest
{
    //typedef alvision.cvtest.ArrayTest Base;
    //CxCore_DXTBaseTest( bool _allow_complex=false, bool _allow_odd=false,
    //                    bool _spectrum_mode=false );
    constructor( _allow_complex : boolean, _allow_odd : boolean, _spectrum_mode  : boolean) {
        super();

        this.flags = (0);
        this.allow_complex = (_allow_complex);
        this.allow_odd = (_allow_odd);

        this.spectrum_mode = (_spectrum_mode);
        this.inplace = (false);
        this.temp_dst = (false);

        this.test_array[this.INPUT].push(null);
        if (this.spectrum_mode)
            this.test_array[this.INPUT].push(null);
        this.test_array[this.OUTPUT].push(null);
        this.test_array[this.REF_OUTPUT].push(null);
        this.test_array[this.TEMP].push(null);
        this.test_array[this.TEMP].push(null);

        this.max_log_array_size = 9;
        this.element_wise_relative_error = this.spectrum_mode;
    }


    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        let rng = this.ts.get_rng();
        let bits = alvision.cvtest.randInt(rng).valueOf();
        let depth = alvision.cvtest.randInt(rng).valueOf() % 2 + alvision.MatrixType.CV_32F;
        let cn = !this.allow_complex || !(bits & 256) ? 1 : 2;
        let size = new alvision.Size();
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);

        this.flags = bits & (alvision.DftFlags.DFT_INVERSE | alvision.DftFlags.DFT_SCALE | alvision.DftFlags.DFT_ROWS |  CV_DXT_MUL_CONJ);
        if (this.spectrum_mode)
            this.flags = this.flags.valueOf() &  ~alvision.DftFlags.DFT_INVERSE;
        types[this.TEMP][0] = types[this.TEMP][1] = types[this.INPUT][0] =
            types[this.OUTPUT][0] = alvision.MatrixType.CV_MAKETYPE(depth, cn);
        size = sizes[this.INPUT][0];

        this.temp_dst = false;

        if (this.flags.valueOf() &  alvision.DftFlags.DFT_ROWS && (bits & 1024)) {
            if (bits & 16)
                size.width = 1;
            else
                size.height = 1;
            this.flags = this.flags.valueOf() & ~alvision.DftFlags.DFT_ROWS;
        }

        const P2_MIN_SIZE = 32;
        if (((bits >> 10) & 1) == 0) {
            size.width = (size.width.valueOf() / P2_MIN_SIZE) * P2_MIN_SIZE;
            size.width = Math.max(size.width.valueOf(), 1);
            size.height = (size.height.valueOf() / P2_MIN_SIZE) * P2_MIN_SIZE;
            size.height = Math.max(size.height.valueOf(), 1);
        }

        if (!this.allow_odd) {
            if (size.width > 1 && (size.width.valueOf() & 1) != 0)
                size.width = (size.width.valueOf() + 1) & -2;

            if (size.height > 1 && (size.height.valueOf() & 1) != 0 && !(this.flags.valueOf() & alvision.DftFlags.DFT_ROWS))
                size.height = (size.height.valueOf() + 1) & -2;
        }

        sizes[this.INPUT][0] = sizes[this.OUTPUT][0] = size;
        sizes[this.TEMP][0] = sizes[this.TEMP][1] = new alvision.Size(0, 0);

        if (this.spectrum_mode) {
            if (cn == 1) {
                types[this.OUTPUT][0] = depth + 8;
                sizes[this.TEMP][0] = size;
            }
            sizes[this.INPUT][0] = sizes[this.INPUT][1] = size;
            types[this.INPUT][1] = types[this.INPUT][0];
        }
        else if ( /*(cn == 2 && (bits&32)) ||*/ (cn == 1 && this.allow_complex)) {
            types[this.TEMP][0] = depth + 8; // CV_??FC2
            sizes[this.TEMP][0] = size;
            size = new alvision.Size(size.width.valueOf() / 2 + 1, size.height);

            if (this.flags.valueOf() & alvision.DftFlags.DFT_INVERSE) {
                if (cn.valueOf() == 2) {
                    types[this.OUTPUT][0] = depth;
                    sizes[this.INPUT][0] = size;
                }
                types[this.TEMP][1] = types[this.TEMP][0];
                sizes[this.TEMP][1] = sizes[this.TEMP][0];
            }
            else {
                if (this.allow_complex)
                    types[this.OUTPUT][0] = depth + 8;

                if (cn.valueOf() == 2) {
                    types[this.INPUT][0] = depth;
                    types[this.TEMP][1] = types[this.TEMP][0];
                    sizes[this.TEMP][1] = size;
                }
                else {
                    types[this.TEMP][1] = depth;
                    sizes[this.TEMP][1] = sizes[this.TEMP][0];
                }
                this.temp_dst = true;
            }
        }

        this.inplace = false;
        if (this.spectrum_mode ||
            (!this.temp_dst && types[this.INPUT][0] == types[this.OUTPUT][0]) ||
            (this.temp_dst && types[this.INPUT][0] == types[this.TEMP][1]))
            this.inplace = (bits & 64) != 0;

        types[this.REF_OUTPUT][0] = types[this.OUTPUT][0];
        sizes[this.REF_OUTPUT][0] = sizes[this.OUTPUT][0];
    }
    prepare_test_case(test_case_idx: alvision.int): alvision.int{
        var code = super.prepare_test_case(test_case_idx);
        if (code > 0) {
            var in_type =  this.test_mat[this.INPUT][0].type();
            var out_type = this.test_mat[this.OUTPUT][0].type();

            if (alvision.MatrixType.CV_MAT_CN(in_type) == 2 && alvision.MatrixType.CV_MAT_CN(out_type) == 1)
                fixCCS(this.test_mat[this.INPUT][0], this.test_mat[this.OUTPUT][0].cols(), this.flags);

            if (this.inplace)
                alvision.cvtest.copy(this.test_mat[this.INPUT][test_case_idx.valueOf() & (this.spectrum_mode ? 1 : 0)],
                    this.temp_dst ? this.test_mat[this.TEMP][1] :
                        in_type == out_type ? this.test_mat[this.OUTPUT][0] :
                            this.test_mat[this.TEMP][0]);
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
        var dst = this.temp_dst ? this.test_mat[this.TEMP][1] : this.test_mat[this.OUTPUT][0];
        const src = this.inplace ? dst: this.test_mat[this.INPUT][0];

        if (!(this.flags.valueOf() & alvision.DftFlags.DFT_INVERSE))
            alvision.dft(src, dst, this.flags);
        else
            alvision.idft(src, dst, this.flags.valueOf() & ~alvision.DftFlags.DFT_INVERSE);
    }
    prepare_to_validation(test_case_idx: alvision.int): void {
        var src = this.test_mat[this.INPUT][0];
        var dst = this.test_mat[this.REF_OUTPUT][0];
        var tmp_src = src;
        var tmp_dst = dst;
        var src_cn = src.channels();
        var dst_cn = dst.channels();

        if (src_cn != 2 || dst_cn != 2) {
            tmp_src = this.test_mat[this.TEMP][0];

            if (!(this.flags.valueOf() & alvision.DftFlags.DFT_INVERSE)) {
                var cvdft_dst = this.test_mat[this.TEMP][1];
                convertFromCCS(cvdft_dst, cvdft_dst,
                    this.test_mat[this.OUTPUT][0], this.flags);
            tmp_src.setTo( alvision.Scalar.all(0));
                alvision.cvtest.insert(src, tmp_src, 0);
            }
            else {
                convertFromCCS(src, src, tmp_src, this.flags);
                tmp_dst = this.test_mat[this.TEMP][1];
            }
        }

        if (src.rows() == 1 || (src.cols() == 1 && !(this.flags.valueOf() & alvision.DftFlags.DFT_ROWS)))
            DFT_1D( tmp_src, tmp_dst, this.flags);
        else
            DFT_2D( tmp_src, tmp_dst, this.flags);

        if (tmp_dst != dst)
            alvision.cvtest.extract( tmp_dst, dst, 0);
    }
};


////////////////////// DCT ////////////////////////
class CxCore_DCTTest extends CxCore_DXTBaseTest
{
    constructor() {
        super(false, false, false);
    }

    run_func(): void {
        var dst = this.test_mat[this.OUTPUT][0];
        const src = this.inplace ? dst: this.test_mat[this.INPUT][0];

        if (!(this.flags.valueOf() & alvision.DftFlags.DFT_INVERSE))
            alvision.dct(src, dst, this.flags);
        else
            alvision.idct(src, dst, this.flags.valueOf() & ~alvision.DftFlags.DFT_INVERSE);
    }
    prepare_to_validation(test_case_idx: alvision.int): void {
        const  src = this.test_mat[this.INPUT][0];
        var dst = this.test_mat[this.REF_OUTPUT][0];

        if (src.rows() == 1 || (src.cols() == 1 && !(this.flags.valueOf() & alvision.DftFlags.DFT_ROWS)))
            DCT_1D(src, dst, this.flags);
        else
            DCT_2D(src, dst, this.flags);
    }
};



////////////////////// MulSpectrums ////////////////////////
class CxCore_MulSpectrumsTest extends CxCore_DXTBaseTest
{
    constructor() {
        super(true, true, true)
    }

    run_func(): void {
        var dst = !(this.test_mat[this.TEMP] == null) && !this.test_mat[this.TEMP][0].empty() ?
            this.test_mat[this.TEMP][0] : this.test_mat[this.OUTPUT][0];
        var src1 = this.test_mat[this.INPUT][0], src2 = this.test_mat[this.INPUT][1];

        if (this.inplace) {
            if (this.ts.get_current_test_info().test_case_idx.valueOf() & 1)
                src2 = dst;
            else
                src1 = dst;
        }

        alvision.mulSpectrums( src1, src2, dst, this.flags, (this.flags.valueOf() & CV_DXT_MUL_CONJ) != 0);
    }
    prepare_to_validation(test_case_idx: alvision.int): void {
        var src1 = this.test_mat[this.INPUT][0];
        var src2 = this.test_mat[this.INPUT][1];
        var dst =  this.test_mat[this.OUTPUT][0];
        var dst0 = this.test_mat[this.REF_OUTPUT][0];
        var cn = src1.channels();

        if (cn == 1) {
            convertFromCCS( src1, src1, dst,  this.flags);
            convertFromCCS( src2, src2, dst0, this.flags);
            src1 = dst;
            src2 = dst0;
        }

        mulComplex( src1, src2, dst0, this.flags);
        if (cn == 1) {
            var temp = this.test_mat[this.TEMP][0];
            convertFromCCS(temp, temp, dst, this.flags);
        }
    }
};



alvision.cvtest.TEST('Core_DCT', 'accuracy', () => { var test = new CxCore_DCTTest(); test.safe_run(); });
alvision.cvtest.TEST('Core_DFT', 'accuracy', () => { var test = new CxCore_DFTTest (); test.safe_run(); });
alvision.cvtest.TEST('Core_MulSpectrums', 'accuracy', () => { var test = new CxCore_MulSpectrumsTest(); test.safe_run(); });

class Core_DFTComplexOutputTest  extends alvision.cvtest.BaseTest
{

    run(iii: alvision.int) : void
    {
        var rng = alvision.theRNG();
        for( var i = 0; i < 10; i++ )
        {
            var m = rng.uniform(2, 11);
            var n = rng.uniform(2, 11);
            var depth = rng.uniform(0, 2).valueOf() + alvision.MatrixType.CV_32F;
            var src8u = new alvision.Mat(m, n, depth), src = new alvision.Mat(m, n, depth), dst = new alvision.Mat(m, n, alvision.MatrixType.CV_MAKETYPE(depth, 2));
            var z = alvision.Mat.zeros(m, n, depth).toMat(), dstz = new alvision.Mat();
            alvision.randu(src8u, alvision.Scalar.all(0), alvision.Scalar.all(10));
            src8u.convertTo(src, src.type());
            dst.setTo(alvision. Scalar.all(123));
            var mv = [src, z], srcz = new alvision.Mat();
            alvision.merge(mv,srcz);
            alvision.dft(srcz, dstz);
            alvision.dft(src, dst, alvision.DftFlags.DFT_COMPLEX_OUTPUT);
            if (alvision.cvtest.norm(dst, dstz,alvision.NormTypes. NORM_INF) > 1e-3)
            {
                console.log("actual:\n" + dst);
                console.log("reference:\n" + dstz);
                alvision.CV_Error(alvision.cv.Error.Code.StsError, "");
            }
        }
    }
};

alvision.cvtest.TEST('Core_DFT', 'complex_output', () => { var test = new Core_DFTComplexOutputTest(); test.safe_run(); });

alvision.cvtest.TEST('Core_DFT', 'complex_output2',()=>
{
    for( var i = 0; i < 100; i++ )
    {
        var type = alvision.theRNG().uniform(0, 2) ? alvision.MatrixType.CV_64F : alvision.MatrixType.CV_32F;
        var m =    alvision.theRNG().uniform(1, 10);
        var n =    alvision.theRNG().uniform(1, 10);
        var x = new alvision.Mat(m, n, type), out = new alvision.Mat();
        alvision.randu(x, -1., 1.);
        alvision.dft(x, out, alvision.DftFlags.DFT_ROWS | alvision.DftFlags. DFT_COMPLEX_OUTPUT);
        var nrm = alvision.norm(out,alvision.NormTypes. NORM_INF);
        var thresh = n.valueOf()*m.valueOf()*2;
        if( nrm > thresh )
        {
            console.log("x: " + x);
            console.log("out: " + out);
            alvision.ASSERT_LT(nrm, thresh);
        }
    }
});
