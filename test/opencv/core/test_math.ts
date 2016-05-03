//////////////////////////////////////////////////////////////////////////////////////////
/////////////////// tests for matrix operations and math functions ///////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

import tape = require("tape");
import path = require("path");
import colors = require("colors");
import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');

//#include "test_precomp.hpp"
//#include <float.h>
//#include <math.h>
//
//using namespace cv;
//using namespace std;

/// !!! NOTE !!! These tests happily avoid overflow cases & out-of-range arguments
/// so that output arrays contain neigher Inf's nor Nan's.
/// Handling such cases would require special modification of check function
/// (validate_test_results) => TBD.
/// Also, need some logarithmic-scale generation of input data. Right now it is done (in some tests)
/// by generating min/max boundaries for random data in logarimithic scale, but
/// within the same test case all the input array elements are of the same order.

class Core_MathTest extends alvision.cvtest.ArrayTest {
    //public:
    //typedef alvision.cvtest.ArrayTest Base;
    constructor() {
        super();

        this.optional_mask = false;

        this.test_array[this.INPUT].push(null);
        this.test_array[this.OUTPUT].push(null);
        this.test_array[this.REF_OUTPUT].push(null);

        this.test_nd = false;
    }


    //    protected:
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>,
        types: Array<Array<alvision.int>>): void {
        var rng = this.ts.get_rng();
        var depth = alvision.cvtest.randInt(rng).valueOf() % 2 + alvision.MatrixType.CV_32F;
        var cn = alvision.cvtest.randInt(rng).valueOf() % 4 + 1, type = alvision.MatrixType.CV_MAKETYPE(depth, cn);
        var i, j;
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);

        for (i = 0; i < this.test_array.length; i++) {
            var count = this.test_array[i].length;
            for (j = 0; j < count; j++)
                types[i][j] = type;
        }
        this.test_nd = alvision.cvtest.randInt(rng).valueOf() % 3 == 0;
    }
    get_success_error_level(test_case_idx: alvision.int /**/, i: alvision.int, j: alvision.int): alvision.double {
        return this.test_mat[i.valueOf()][j.valueOf()].depth() == alvision.MatrixType.CV_32F ? alvision.FLT_EPSILON * 128 : alvision.DBL_EPSILON * 1024;
    }

    protected test_nd: boolean;
}





////////// pow /////////////

class Core_PowTest extends Core_MathTest {
    constructor() {
        super();
        this.power = 0;
    }

    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        var rng = this.ts.get_rng();
        var depth = alvision.cvtest.randInt(rng).valueOf() % (alvision.MatrixType.CV_64F + 1);
        var cn = alvision.cvtest.randInt(rng).valueOf() % 4 + 1;
        var i, j;
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
        depth += (depth == alvision.MatrixType.CV_8S) ? 1 : 0; //DROR: could be wrong!

        if (depth < alvision.MatrixType.CV_32F || alvision.cvtest.randInt(rng).valueOf() % 8 == 0)
            // integer power
            this.power = (alvision.cvtest.randInt(rng).valueOf() % 21 - 10);
        else {
            i = alvision.cvtest.randInt(rng).valueOf() % 17;
            this.power = i == 16 ? 1. / 3 : i == 15 ? 0.5 : i == 14 ? -0.5 : alvision.cvtest.randReal(rng).valueOf() * 10 - 5;
        }

        for (i = 0; i < this.test_array.length; i++) {
            var count = this.test_array[i].length;
            var type = alvision.MatrixType.CV_MAKETYPE(depth, cn);
            for (j = 0; j < count; j++)
                types[i][j] = type;
        }
        this.test_nd = alvision.cvtest.randInt(rng).valueOf() % 3 == 0;
    }
    get_minmax_bounds(i: alvision.int, j: alvision.int, type: alvision.int, low: alvision.Scalar, high: alvision.Scalar): void {
        var l, u = alvision.cvtest.randInt(this.ts.get_rng()).valueOf() % 1000 + 1;
        if (this.power > 0) {
            var mval = alvision.cvtest.getMaxVal(type);
            var u1 = Math.pow(mval.valueOf(), 1. / this.power.valueOf()) * 2;
            u = Math.min(u, u1);
        }

        l = this.power == Math.round(this.power.valueOf()) ? -u : alvision.FLT_EPSILON;
        low = alvision.Scalar.all(l);
        high = alvision.Scalar.all(u);
    }
    run_func(): void {
        if (!this.test_nd) {
            if (Math.abs(this.power.valueOf() - 1. / 3) <= alvision.DBL_EPSILON && this.test_mat[this.INPUT][0].depth() == alvision.MatrixType.CV_32F) {
                var a = this.test_mat[this.INPUT][0], b = this.test_mat[this.OUTPUT][0];

                a = a.reshape(1);
                b = b.reshape(1);
                for (var i = 0; i < a.rows; i++) {
                    b.atSet<alvision.float>("float", Math.abs(alvision.cubeRoot(a.atGet<alvision.float>("float",i, 0)).valueOf()), i, 0);
                    for (var j = 1; j < a.cols; j++)
                        b.atSet<alvision.float>("float", Math.abs(alvision.cubeRoot(a.atGet<alvision.float>("float", i, j)).valueOf()), i, j);
                }
            }
            else
                alvision.pow(this.test_array[this.INPUT][0], this.test_array[this.OUTPUT][0], this.power);
        }
        else {
            var a = this.test_mat[this.INPUT][0];
            var b = this.test_mat[this.OUTPUT][0];
            if (this.power == 0.5)
                alvision.sqrt(a, b);
            else
                alvision.pow(a, this.power, b);
        }
    }
    prepare_to_validation(test_case_idx: alvision.int): void {

        var a = this.test_mat[this.INPUT][0];
        var b = this.test_mat[this.REF_OUTPUT][0];

        var depth = a.depth();
        var ncols = a.cols.valueOf() * a.channels().valueOf();
        var ipower = Math.round(this.power.valueOf()), apower = Math.abs(ipower);
        var i, j;

        for (i = 0; i < a.rows; i++) {
            
            //const uchar* a_data = a.ptr(i);
            //uchar * b_data = b.ptr(i);

            switch (depth) {
                case alvision.MatrixType.CV_8U:
                    {
                        var a_data = a.ptr<alvision.uchar>("uchar");
                        var b_data = b.ptr<alvision.uchar>("uchar");
                        if (ipower < 0)
                            for (j = 0; j < ncols; j++) {
                                var val = a_data[j];
                                b_data[j] = (val == 0 ? 255 : val == 1 ? 1 :
                                    val == 2 && ipower == -1 ? 1 : 0);
                            }
                        else
                            for (j = 0; j < ncols; j++) {
                                var val = a_data[j];
                                val = ipow(<number>val, ipower);
                                b_data[j] = (val);
                            }
                    }
                    break;
                case alvision.MatrixType.CV_8S:
                    {
                        var a_data = a.ptr<alvision.schar>("schar");
                        var b_data = b.ptr<alvision.schar>("schar");
                        if (ipower < 0)
                            for (j = 0; j < ncols; j++) {
                                var val = a_data[j];
                                b_data[j] = (val == 0 ? 127 : val == 1 ? 1 :
                                    val == -1 ? 1 - 2 * (ipower & 1) :
                                        val == 2 && ipower == -1 ? 1 : 0);
                            }
                        else
                            for (j = 0; j < ncols; j++) {
                                var val = a_data[j];
                                val = ipow(<number>val, ipower);
                                b_data[j] = val;
                            }
                    }
                    break;
                case alvision.MatrixType.CV_16U:
                    {
                        var a_data = a.ptr<alvision.ushort>("ushort");
                        var b_data = b.ptr<alvision.ushort>("ushort");
                        if (ipower < 0)
                            for (j = 0; j < ncols; j++) {
                                var val = a_data[j];
                                b_data[j] = (val == 0 ? 65535 : val == 1 ? 1 :
                                    val == -1 ? 1 - 2 * (ipower & 1) :
                                        val == 2 && ipower == -1 ? 1 : 0);
                            }
                        else
                            for (j = 0; j < ncols; j++) {
                                var val = a_data[j];
                                val = ipow(<number>val, ipower);
                                b_data[j] = (val);
                            }
                    }
                    break;
                case alvision.MatrixType.CV_16S:
                    {
                        var a_data = a.ptr<alvision.short>("short");
                        var b_data = b.ptr<alvision.short>("short");
                        if (ipower < 0)
                            for (j = 0; j < ncols; j++) {
                                var val = a_data[j];
                                b_data[j] = (val == 0 ? 32767 : val == 1 ? 1 :
                                    val == -1 ? 1 - 2 * (ipower & 1) :
                                        val == 2 && ipower == -1 ? 1 : 0);
                            }
                        else
                            for (j = 0; j < ncols; j++) {
                                var val = a_data[j];
                                val = ipow(<number>val, ipower);
                                b_data[j] = (val);
                            }
                    }
                    break;
                case alvision.MatrixType.CV_32S:
                    {
                        var a_data = a.ptr<alvision.int>("int");
                        var b_data = b.ptr<alvision.int>("int");
                        if (ipower < 0)
                            for (j = 0; j < ncols; j++) {
                                var val = (a_data)[j];
                                (b_data)[j] = val == 0 ? alvision.INT_MAX : val == 1 ? 1 :
                                    val == -1 ? 1 - 2 * (ipower & 1) :
                                        val == 2 && ipower == -1 ? 1 : 0;
                            }
                        else
                            for (j = 0; j < ncols; j++) {
                                var val = (a_data)[j];
                                val = ipow(<number>val, ipower);
                                b_data[j] = val;
                            }
                    }
                    break;
                case alvision.MatrixType.CV_32F:
                    {
                        var a_data = a.ptr<alvision.float>("float");
                        var b_data = b.ptr<alvision.float>("float");
                        if (this.power != ipower)
                            for (j = 0; j < ncols; j++) {
                                var val = (a_data)[j];
                                val = Math.pow(Math.abs(<number>val), this.power.valueOf());
                                (b_data)[j] = val;
                            }
                        else
                            for (j = 0; j < ncols; j++) {
                                var val = (a_data)[j];
                                if (ipower < 0)
                                    val = 1.0 / <number>val;
                                val = ipow(<number>val, apower);
                                (b_data)[j] = val;
                            }
                    }
                    break;
                case alvision.MatrixType.CV_64F:
                    {
                        var a_data = a.ptr<alvision.double>("double");
                        var b_data = b.ptr<alvision.double>("double");
                        if (this.power != ipower)
                            for (j = 0; j < ncols; j++) {
                                var val = (a_data)[j];
                                val = Math.pow(Math.abs(<number>val), this.power.valueOf());
                                (b_data)[j] = val;
                            }
                        else
                            for (j = 0; j < ncols; j++) {
                                var val = (a_data)[j];
                                if (ipower < 0)
                                    val = 1.0 / <number>val;
                                val = ipow(<number>val, apower);
                                (b_data)[j] = val;
                            }
                    }
                    break;
            }
        }

    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        var depth = this.test_mat[i.valueOf()][j.valueOf()].depth();
        if (depth < alvision.MatrixType.CV_32F)
            return this.power == Math.round(this.power.valueOf()) && this.power >= 0 ? 0 : 1;
        else
            return super.get_success_error_level(test_case_idx, i, j);
    }

    protected power: alvision.double;
}




function ipow( a : number, power : number ) : number
{
    var b = 1;
    while( power > 0 )
    {
        if( power & 1 )
            b *= a.valueOf(), power--;
        else
            a *= a, power >>= 1;
    }
    return b;
}


//inline static double ipow( double a, int power )
//{
//    double b = 1.;
//    while( power > 0 )
//    {
//        if( power&1 )
//            b *= a, power--;
//        else
//            a *= a, power >>= 1;
//    }
//    return b;
//}



///////////////////////////////////////// matrix tests ////////////////////////////////////////////

class Core_MatrixTest extends alvision.cvtest.ArrayTest {
    constructor(in_count: alvision.int, out_count: alvision.int,
        _allow_int: boolean, _scalar_output: boolean, _max_cn: alvision.int) {
        super();


        this.allow_int = _allow_int;
        this.scalar_output = _scalar_output;
        this.max_cn = _max_cn;


        for (var i = 0; i < in_count; i++)
            this.test_array[this.INPUT].push(null);

        for (var i = 0; i < out_count; i++) {
            this.test_array[this.OUTPUT].push(null);
            this.test_array[this.REF_OUTPUT].push(null);
        }

        this.element_wise_relative_error = false;
    }





    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>,
        types: Array<Array<alvision.int>>): void {
        var rng = this.ts.get_rng();
        var depth = alvision.cvtest.randInt(rng).valueOf() % (this.allow_int ? alvision.MatrixType.CV_64F + 1 : 2);
        var cn = alvision.cvtest.randInt(rng).valueOf() % this.max_cn.valueOf() + 1;
        var i, j;

        if (this.allow_int)
            depth += (depth == alvision.MatrixType.CV_8S) ? 1 : 0; //DROR: could be wrong!!
        else
            depth += alvision.MatrixType.CV_32F;

        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);

        for (i = 0; i < this.test_array.length; i++) {
            var count = this.test_array[i].length;
            var flag = (i == this.OUTPUT || i == this.REF_OUTPUT) && this.scalar_output;
            var type = !flag ? alvision.MatrixType.CV_MAKETYPE(depth, cn) : alvision.MatrixType.CV_64FC1;

            for (j = 0; j < count; j++) {
                types[i][j] = type;
                if (flag)
                    sizes[i][j] = new alvision.Size(4, 1);
            }
        }
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        var input_depth = this.test_mat[this.INPUT][0].depth();
        var input_precision = input_depth < alvision.MatrixType.CV_32F ? 0 : input_depth == alvision.MatrixType.CV_32F ? 5e-5 : 5e-10;
        var output_precision = super.get_success_error_level(test_case_idx, i, j);
        return Math.max(input_precision, output_precision.valueOf());
    }

    protected allow_int: boolean;
    protected scalar_output: boolean;
    protected max_cn: alvision.int;
}





///////////////// Trace /////////////////////

class Core_TraceTest extends Core_MatrixTest
{
    constructor() {
        super(1, 1, true, true, 4)
    }


    run_func(): void {
        this.test_mat[this.OUTPUT][0].atSet<alvision.Scalar>("Scalar", alvision.trace(this.test_array[this.INPUT][0]), 0, 0);
    }

    prepare_to_validation(test_case_idx: alvision.int): void {
        var mat = this.test_mat[this.INPUT][0];
        var count = Math.min(mat.rows.valueOf(), mat.cols.valueOf());
        var diag = new alvision.Mat(count, 1, mat.type(), mat.ptr(), mat.step + mat.elemSize());
        var r = alvision.cvtest.mean(diag);
        r *= count;

        this.test_mat[this.REF_OUTPUT][0].atSet<alvision.Scalar>("Scalar", r, 0, 0);
    }
};



///////// dotproduct //////////

class Core_DotProductTest extends Core_MatrixTest {
    constructor() {
        super(2, 1, true, true, 4)
    }
    run_func(): void {
        this.test_mat[this.OUTPUT][0].atSet<alvision.Scalar>("Scalar", new alvision.Scalar(this.test_array[this.INPUT][0].dot(this.test_array[this.INPUT][1]), 0, 0);//cvDotProduct(test_array[INPUT][0], test_array[INPUT][1]))
    }
    prepare_to_validation(test_case_idx: alvision.int): void {
        this.test_mat[this.REF_OUTPUT][0].atSet<alvision.Scalar>("Scalar", new alvision.Scalar(alvision.cvtest.crossCorr(this.test_mat[this.INPUT][0], this.test_mat[this.INPUT][1])), 0, 0);
    }

};

///////// crossproduct //////////

class Core_CrossProductTest extends Core_MatrixTest
{
    constructor() {
        super(2, 1, false, false, 1);

    }

    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>,
        types: Array<Array<alvision.int>>): void {
        var rng = this.ts.get_rng();
        var depth = alvision.cvtest.randInt(rng).valueOf() % 2 + alvision.MatrixType.CV_32F;
        var cn = alvision.cvtest.randInt(rng).valueOf() & 1 ? 3 : 1, type = alvision.MatrixType.CV_MAKETYPE(depth, cn);
        var sz = new alvision.Size();

        types[this.INPUT][0] = types[this.INPUT][1] = types[this.OUTPUT][0] = types[this.REF_OUTPUT][0] = type;

        if (cn == 3)
            sz = new alvision.Size(1, 1);
        else if (alvision.cvtest.randInt(rng).valueOf() & 1)
            sz = new alvision.Size(3, 1);
        else
            sz = new alvision.Size(1, 3);

        sizes[this.INPUT][0] = sizes[this.INPUT][1] = sizes[this.OUTPUT][0] = sizes[this.REF_OUTPUT][0] = sz;
    }
    run_func(): void{
        this.test_array[this.INPUT][0].cross(this.test_array[this.INPUT][1]).copyTo(this.test_array[this.OUTPUT][0]);
    //cvCrossProduct(, , );
}
    prepare_to_validation(test_case_idx: alvision.int): void{
        var a = new alvision.Scalar(0);
        var b = new alvision.Scalar(0);
        var c = new alvision.Scalar(0);
        
        
    //CvScalar a(0), b(0), c(0);

    if (this.test_mat[this.INPUT][0].rows > 1) {
        a.val[0] = cvGetReal2D(this.test_array[this.INPUT][0], 0, 0);
        a.val[1] = cvGetReal2D(this.test_array[this.INPUT][0], 1, 0);
        a.val[2] = cvGetReal2D(this.test_array[this.INPUT][0], 2, 0);

        b.val[0] = cvGetReal2D(this.test_array[this.INPUT][1], 0, 0);
        b.val[1] = cvGetReal2D(this.test_array[this.INPUT][1], 1, 0);
        b.val[2] = cvGetReal2D(this.test_array[this.INPUT][1], 2, 0);
    }
    else if (this.test_mat[INPUT][0].cols > 1) {
        a.val[0] = cvGetReal1D(this.test_array[this.INPUT][0], 0);
        a.val[1] = cvGetReal1D(this.test_array[this.INPUT][0], 1);
        a.val[2] = cvGetReal1D(this.test_array[this.INPUT][0], 2);

        b.val[0] = cvGetReal1D(this.test_array[this.INPUT][1], 0);
        b.val[1] = cvGetReal1D(this.test_array[this.INPUT][1], 1);
        b.val[2] = cvGetReal1D(this.test_array[this.INPUT][1], 2);
    }
    else {
        a = cvGet1D(this.test_array[this.INPUT][0], 0);
        b = cvGet1D(this.test_array[this.INPUT][1], 0);
    }

    c.val[2] = a.val[0] * b.val[1] - a.val[1] * b.val[0];
    c.val[1] = -a.val[0] * b.val[2] + a.val[2] * b.val[0];
    c.val[0] = a.val[1] * b.val[2] - a.val[2] * b.val[1];

    if (this.test_mat[this.REF_OUTPUT][0].rows > 1) {
        cvSetReal2D(this.test_array[this.REF_OUTPUT][0], 0, 0, c.val[0]);
        cvSetReal2D(this.test_array[this.REF_OUTPUT][0], 1, 0, c.val[1]);
        cvSetReal2D(this.test_array[this.REF_OUTPUT][0], 2, 0, c.val[2]);
    }
    else if (this.test_mat[this.REF_OUTPUT][0].cols > 1) {
        cvSetReal1D(this.test_array[this.REF_OUTPUT][0], 0, c.val[0]);
        cvSetReal1D(this.test_array[this.REF_OUTPUT][0], 1, c.val[1]);
        cvSetReal1D(this.test_array[this.REF_OUTPUT][0], 2, c.val[2]);
    }
    else {
        cvSet1D(this.test_array[this.REF_OUTPUT][0], 0, c);
    }
}
};



///////////////// gemm /////////////////////

class Core_GEMMTest extends Core_MatrixTest {
    constructor() {
        super(5, 1, false, false, 2);
        this.test_case_count = 100;
        this.max_log_array_size = 10;
        this.tabc_flag = 0;
        this.alpha = this.beta = 0;
    }
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>,
        types: Array<Array<alvision.int>>): void {
        var rng = this.ts.get_rng();
        var sizeA = new alvision.Size;
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
        sizeA = sizes[this.INPUT][0];
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
        sizes[this.INPUT][0] = sizeA;
        sizes[this.INPUT][2] = sizes[this.INPUT][3] = new alvision.Size(1, 1);
        types[this.INPUT][2] = types[this.INPUT][3] &= ~CV_MAT_CN_MASK;

        this.tabc_flag = alvision.cvtest.randInt(rng).valueOf() & 7;

        switch (this.tabc_flag & (alvision.GemmFlags.GEMM_1_T | alvision.GemmFlags.GEMM_2_T)) {
            case 0:
                sizes[this.INPUT][1].height = sizes[this.INPUT][0].width;
                sizes[this.OUTPUT][0].height = sizes[this.INPUT][0].height;
                sizes[this.OUTPUT][0].width = sizes[this.INPUT][1].width;
                break;
            case alvision.GemmFlags.GEMM_2_T:
                sizes[this.INPUT][1].width = sizes[this.INPUT][0].width;
                sizes[this.OUTPUT][0].height = sizes[this.INPUT][0].height;
                sizes[this.OUTPUT][0].width = sizes[this.INPUT][1].height;
                break;
            case alvision.GemmFlags.GEMM_1_T:
                sizes[this.INPUT][1].height = sizes[this.INPUT][0].height;
                sizes[this.OUTPUT][0].height = sizes[this.INPUT][0].width;
                sizes[this.OUTPUT][0].width = sizes[this.INPUT][1].width;
                break;
            case alvision.GemmFlags.GEMM_1_T | alvision.GemmFlags.GEMM_2_T:
                sizes[this.INPUT][1].width = sizes[this.INPUT][0].height;
                sizes[this.OUTPUT][0].height = sizes[this.INPUT][0].width;
                sizes[this.OUTPUT][0].width = sizes[this.INPUT][1].height;
                break;
        }

        sizes[this.REF_OUTPUT][0] = sizes[this.OUTPUT][0];

        if (alvision.cvtest.randInt(rng).valueOf() & 1)
            sizes[this.INPUT][4] = new alvision.Size(0, 0);
        else if (!(this.tabc_flag & alvision.GemmFlags.GEMM_3_T))
            sizes[this.INPUT][4] = sizes[this.OUTPUT][0];
        else {
            sizes[this.INPUT][4].width = sizes[this.OUTPUT][0].height;
            sizes[this.INPUT][4].height = sizes[this.OUTPUT][0].width;
        }
    }

    get_minmax_bounds(i : alvision.int, j: alvision.int, type : alvision.int,  low : alvision.Scalar, high : alvision.Scalar): void {
        low =  alvision.Scalar.all(-10.);//DROR: wrong, references do not propegate back
        high = alvision.Scalar.all(10.);
    }
    prepare_test_case(test_case_idx: alvision.int  ): alvision.int {
        var code = super.prepare_test_case(test_case_idx);
        if (code > 0) {
            this.alpha = cvGetReal2D(test_array[INPUT][2], 0, 0);
            this.beta = cvGetReal2D(test_array[INPUT][3], 0, 0);
        }
        return code;
    }
    run_func(): void {
        alvision.gemm(this.test_array[this.INPUT][0], this.test_array[this.INPUT][1], this.alpha,
            this.test_array[this.INPUT][4], this.beta, this.test_array[this.OUTPUT][0], this.tabc_flag);
        //cvGEMM(test_array[INPUT][0], test_array[INPUT][1], alpha,
        //    test_array[INPUT][4], beta, test_array[OUTPUT][0], tabc_flag);
    }
    prepare_to_validation(test_case_idx  : alvision.int): void {
        alvision.cvtest.gemm(this.test_mat[this.INPUT][0], this.test_mat[this.INPUT][1], this.alpha,
            this.test_array[this.INPUT][4] ? this.test_mat[this.INPUT][4] : new alvision.Mat(),
            this.beta, this.test_mat[this.REF_OUTPUT][0], this.tabc_flag);
    }
    protected tabc_flag: alvision.GemmFlags;
    protected alpha: alvision.double;
    protected beta: alvision.double;
}



///////////////// multransposed /////////////////////

class Core_MulTransposedTest extends Core_MatrixTest
{
    constructor() {
        super(2, 1, false, false, 1);
        this.test_case_count = 100;
        this.order = 0;
        this.test_array[this.TEMP].push(null);
    }
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>,
        types: Array<Array<alvision.int>>): void {
        var rng = this.ts.get_rng();
        var bits = alvision.cvtest.randInt(rng).valueOf();
        var src_type = alvision.cvtest.randInt(rng).valueOf() % 5;
        var dst_type = alvision.cvtest.randInt(rng).valueOf() % 2;

        src_type = src_type == 0 ? alvision.MatrixType.CV_8U : src_type == 1 ? alvision.MatrixType.CV_16U : src_type == 2 ? alvision.MatrixType.CV_16S :
            src_type == 3 ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_64F;
        dst_type = dst_type == 0 ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_64F;
        dst_type = Math.max(dst_type, src_type);

        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);

        if (bits & 1)
            sizes[this.INPUT][1] = new alvision.Size(0, 0);
        else {
            sizes[this.INPUT][1] = sizes[this.INPUT][0];
            if (bits & 2)
                sizes[this.INPUT][1].height = 1;
            if (bits & 4)
                sizes[this.INPUT][1].width = 1;
        }

        sizes[this.TEMP][0] = sizes[this.INPUT][0];
        types[this.INPUT][0] = src_type;
        types[this.OUTPUT][0] = types[this.REF_OUTPUT][0] = types[this.INPUT][1] = types[this.TEMP][0] = dst_type;

        this.order = ((bits & 8) != 0) ? 1 : 0; //DROR: not sure
        sizes[this.OUTPUT][0].width = sizes[this.OUTPUT][0].height = this.order == 0 ?
            sizes[this.INPUT][0].height : sizes[this.INPUT][0].width;
        sizes[this.REF_OUTPUT][0] = sizes[this.OUTPUT][0];
    }
    get_minmax_bounds(i: alvision.int, j: alvision.int, type: alvision.int, low: alvision.Scalar, high: alvision.Scalar): void {
        low =  alvision.Scalar.all(-10.);
        high = alvision.Scalar.all(10.);
    }
    run_func(): void {
        alvision.mulTransposed(this.test_array[this.INPUT][0], this.test_array[this.OUTPUT][0], this.order != 0, this.test_array[this.INPUT][1], 1, this.test_array[this.OUTPUT][0].type());
        //cvMulTransposed(this.test_array[this.INPUT][0], this.test_array[this.OUTPUT][0],
        //    this.order, this.test_array[this.INPUT][1]);
    }
    prepare_to_validation(test_case_idx: alvision.int): void {
        var src = this.test_mat[this.INPUT][0];
        var delta = this.test_mat[this.INPUT][1];
        var temp = this.test_mat[this.TEMP][0];
        if (!delta.empty()) {
            if (delta.rows < src.rows || delta.cols < src.cols) {
                alvision.repeat(delta, src.rows.valueOf() / delta.rows.valueOf(), src.cols.valueOf() / delta.cols.valueOf(), temp);
                delta = temp;
            }
            alvision.cvtest.add(src, 1, delta, -1, alvision.Scalar.all(0), temp, temp.type());
        }
        else
            src.convertTo(temp, temp.type());

        alvision.cvtest.gemm(temp, temp, 1., new alvision.Mat(), 0, this.test_mat[this.REF_OUTPUT][0], this.order == 0 ? alvision.GemmFlags.GEMM_2_T : alvision.GemmFlags.GEMM_1_T);
    }
    protected order: alvision.int;
};


///////////////// Transform /////////////////////

class Core_TransformTest extends Core_MatrixTest
{
    constructor() {
        super(3, 1, true, false, 4);
        this.scale = 1;
        this.diagMtx = false;
    }
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>,
        types: Array<Array<alvision.int>>): void {

       var  rng = this.ts.get_rng();
        var bits = alvision.cvtest.randInt(rng);
        var depth, dst_cn, mat_cols, mattype;
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);

        mat_cols = CV_MAT_CN(types[this.INPUT][0]);
        depth = CV_MAT_DEPTH(types[this.INPUT][0]);
        dst_cn = alvision.cvtest.randInt(rng) % 4 + 1;
        types[this.OUTPUT][0] = types[REF_OUTPUT][0] = CV_MAKETYPE(depth, dst_cn);

        mattype = depth < CV_32S ? CV_32F : depth == CV_64F ? CV_64F : bits & 1 ? CV_32F : CV_64F;
        types[this.INPUT][1] = mattype;
        types[this.INPUT][2] = alvision.MatrixType.CV_MAKETYPE(mattype, dst_cn);

        scale = 1. / ((alvision.cvtest.randInt(rng) % 4)*50 + 1);

        if (bits & 2) {
            sizes[INPUT][2] = Size(0, 0);
            mat_cols += (bits & 4) != 0;
        }
        else if (bits & 4)
            sizes[INPUT][2] = Size(1, 1);
        else {
            if (bits & 8)
                sizes[INPUT][2] = Size(dst_cn, 1);
            else
                sizes[INPUT][2] = Size(1, dst_cn);
            types[INPUT][2] &= ~CV_MAT_CN_MASK;
        }
        diagMtx = (bits & 16) != 0;

        sizes[INPUT][1] = Size(mat_cols, dst_cn);
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        int depth = test_mat[INPUT][0].depth();
        return depth <= CV_8S ? 1 : depth <= CV_32S ? 9 : Base::get_success_error_level(test_case_idx, i, j);
    }

    prepare_test_case(test_case_idx: alvision.int): alvision.int {

        var code = Base::prepare_test_case(test_case_idx);
        if (code > 0) {
            var m = this.test_mat[this.INPUT][1];
            alvision.cvtest.add(m, scale, m, 0, alvision.Scalar.all(0), m, m.type());
            if (diagMtx) {
                var mask = alvision.Mat.eye(m.rows, m.cols, alvision.MatrixType.CV_8U) * 255;
                mask = ~mask;
                m.setTo(alvision.Scalar.all(0), mask);
            }
        }
        return code;
    }
    run_func(): void {

        var _m = this.test_mat[this.INPUT][1], _shift = this.test_mat[this.INPUT][2];
        cvTransform(this.test_array[this.INPUT][0], this.test_array[this.OUTPUT][0], _m, _shift.data.ptr ? _shift : 0);
    }
    prepare_to_validation(test_case_idx : alvision.int ): void {
        var transmat = this.test_mat[this.INPUT][1];
        var shift = this.test_mat[this.INPUT][2];

        alvision.cvtest.transform(this.test_mat[this.INPUT][0], this.test_mat[this.REF_OUTPUT][0], transmat, shift);

    }

    protected  scale : alvision.double;
    protected  diagMtx : boolean;
};


///////////////// PerspectiveTransform /////////////////////

class Core_PerspectiveTransformTest extends Core_MatrixTest
{
    constructor() {
        super(2, 1, false, false, 2);

    }
public:
    Core_PerspectiveTransformTest();
    protected:
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>,
        types: Array<Array<alvision.int>>): void {
        RNG & rng = ts ->get_rng();
        int bits = alvision.cvtest.randInt(rng);
        int depth, cn, mattype;
        Core_MatrixTest::get_test_array_types_and_sizes(test_case_idx, sizes, types);

        cn = CV_MAT_CN(types[INPUT][0]) + 1;
        depth = CV_MAT_DEPTH(types[INPUT][0]);
        types[INPUT][0] = types[OUTPUT][0] = types[REF_OUTPUT][0] = CV_MAKETYPE(depth, cn);

        mattype = depth == CV_64F ? CV_64F : bits & 1 ? CV_32F : CV_64F;
        types[INPUT][1] = mattype;
        sizes[INPUT][1] = Size(cn + 1, cn + 1);
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        int depth = test_mat[INPUT][0].depth();
        return depth == CV_32F ? 1e-4 : depth == CV_64F ? 1e-8 :
            Core_MatrixTest::get_success_error_level(test_case_idx, i, j);
    }
    void run_func(){
    CvMat _m = test_mat[INPUT][1];
    cvPerspectiveTransform(test_array[INPUT][0], test_array[OUTPUT][0], &_m);
}
    void prepare_to_validation(int test_case_idx ){
    CvMat transmat = test_mat[INPUT][1];
    cvTsPerspectiveTransform(test_array[INPUT][0], test_array[REF_OUTPUT][0], &transmat);
    }
};


function cvTsPerspectiveTransform( const CvArr* _src, CvArr* _dst, const CvMat* transmat ) : void
{
    int i, j, cols;
    int cn, depth, mat_depth;
    CvMat astub, bstub, *a, *b;
    double mat[16];

    a = cvGetMat( _src, &astub, 0, 0 );
    b = cvGetMat( _dst, &bstub, 0, 0 );

    cn = CV_MAT_CN(a->type);
    depth = CV_MAT_DEPTH(a->type);
    mat_depth = CV_MAT_DEPTH(transmat->type);
    cols = transmat->cols;

    // prepare cn x (cn + 1) transform matrix
    if( mat_depth == CV_32F )
    {
        for( i = 0; i < transmat->rows; i++ )
            for( j = 0; j < cols; j++ )
                mat[i*cols + j] = ((float*)(transmat->data.ptr + transmat->step*i))[j];
    }
    else
    {
        assert( mat_depth == CV_64F );
        for( i = 0; i < transmat->rows; i++ )
            for( j = 0; j < cols; j++ )
                mat[i*cols + j] = ((double*)(transmat->data.ptr + transmat->step*i))[j];
    }

    // transform data
    cols = a->cols * cn;
    vector<double> buf(cols);

    for( i = 0; i < a->rows; i++ )
    {
        uchar* src = a->data.ptr + i*a->step;
        uchar* dst = b->data.ptr + i*b->step;

        switch( depth )
        {
            case CV_32F:
                for( j = 0; j < cols; j++ )
                    buf[j] = ((float*)src)[j];
                break;
            case CV_64F:
                for( j = 0; j < cols; j++ )
                    buf[j] = ((double*)src)[j];
                break;
            default:
                assert(0);
        }

        switch( cn )
        {
            case 2:
                for( j = 0; j < cols; j += 2 )
                {
                    double t0 = buf[j]*mat[0] + buf[j+1]*mat[1] + mat[2];
                    double t1 = buf[j]*mat[3] + buf[j+1]*mat[4] + mat[5];
                    double w = buf[j]*mat[6] + buf[j+1]*mat[7] + mat[8];
                    w = w ? 1./w : 0;
                    buf[j] = t0*w;
                    buf[j+1] = t1*w;
                }
                break;
            case 3:
                for( j = 0; j < cols; j += 3 )
                {
                    double t0 = buf[j]*mat[0] + buf[j+1]*mat[1] + buf[j+2]*mat[2] + mat[3];
                    double t1 = buf[j]*mat[4] + buf[j+1]*mat[5] + buf[j+2]*mat[6] + mat[7];
                    double t2 = buf[j]*mat[8] + buf[j+1]*mat[9] + buf[j+2]*mat[10] + mat[11];
                    double w = buf[j]*mat[12] + buf[j+1]*mat[13] + buf[j+2]*mat[14] + mat[15];
                    w = w ? 1./w : 0;
                    buf[j] = t0*w;
                    buf[j+1] = t1*w;
                    buf[j+2] = t2*w;
                }
                break;
            default:
                assert(0);
        }

        switch( depth )
        {
            case CV_32F:
                for( j = 0; j < cols; j++ )
                    ((float*)dst)[j] = (float)buf[j];
                break;
            case CV_64F:
                for( j = 0; j < cols; j++ )
                    ((double*)dst)[j] = buf[j];
                break;
            default:
                assert(0);
        }
    }
}


///////////////// Mahalanobis /////////////////////

class Core_MahalanobisTest extends Core_MatrixTest
{
    constructor() {
        super(3, 1, false, true, 1);
        this.test_case_count = 100;
        this.test_array[this.TEMP].push(null);
        this.test_array[this.TEMP].push(null);
        this.test_array[this.TEMP].push(null);
    }
public:
    typedef Core_MatrixTest Base;
    Core_MahalanobisTest();
    protected:
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>,
        types: Array<Array<alvision.int>>): void {
        RNG & rng = ts ->get_rng();
        Core_MatrixTest::get_test_array_types_and_sizes(test_case_idx, sizes, types);

        if (alvision.cvtest.randInt(rng) & 1 )
        sizes[INPUT][0].width = sizes[INPUT][1].width = 1;
    else
    sizes[INPUT][0].height = sizes[INPUT][1].height = 1;

    sizes[TEMP][0] = sizes[TEMP][1] = sizes[INPUT][0];
    sizes[INPUT][2].width = sizes[INPUT][2].height = sizes[INPUT][0].width + sizes[INPUT][0].height - 1;
    sizes[TEMP][2] = sizes[INPUT][2];
    types[TEMP][0] = types[TEMP][1] = types[TEMP][2] = types[INPUT][0];
    }

int prepare_test_case(int test_case_idx ){
    int code = Base::prepare_test_case(test_case_idx);
    if (code > 0) {
        // make sure that the inverted "covariation" matrix is symmetrix and positively defined.
        alvision.cvtest.gemm(test_mat[INPUT][2], test_mat[INPUT][2], 1., Mat(), 0., test_mat[TEMP][2], GEMM_2_T);
        alvision.cvtest.copy(test_mat[TEMP][2], test_mat[INPUT][2]);
    }

    return code;
}
void run_func(){
    test_mat[OUTPUT][0].at<Scalar>(0, 0) =
        cvRealScalar(cvMahalanobis(test_array[INPUT][0], test_array[INPUT][1], test_array[INPUT][2]));
}
void prepare_to_validation(int test_case_idx ){
    alvision.cvtest.add(test_mat[INPUT][0], 1., test_mat[INPUT][1], -1.,
        Scalar::all(0), test_mat[TEMP][0], test_mat[TEMP][0].type());
    if (test_mat[INPUT][0].rows == 1)
        alvision.cvtest.gemm(test_mat[TEMP][0], test_mat[INPUT][2], 1.,
            Mat(), 0., test_mat[TEMP][1], 0);
    else
        alvision.cvtest.gemm(test_mat[INPUT][2], test_mat[TEMP][0], 1.,
            Mat(), 0., test_mat[TEMP][1], 0);

    test_mat[REF_OUTPUT][0].at<Scalar>(0, 0) = cvRealScalar(sqrt(alvision.cvtest.crossCorr(test_mat[TEMP][0], test_mat[TEMP][1])));
}
};


///////////////// covarmatrix /////////////////////

class Core_CovarMatrixTest extends Core_MatrixTest
{
    constructor() {
        super(1, 1, true, false, 1);
        this.flags = (0);
        this.t_flag = 0;
        this.len = (0);
            this.count = (0);
        this.are_images = (false);
        
            this.test_case_count = 100;
            this.test_array[this .INPUT_OUTPUT].push(null);
            this.test_array[this . REF_INPUT_OUTPUT].push(null);
            this.test_array[this . TEMP].push(null);
            this.test_array[this . TEMP].push(null);
    }
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>,
        types: Array<Array<alvision.int>>): void {

        RNG & rng = ts ->get_rng();
        int bits = alvision.cvtest.randInt(rng);
        int i, single_matrix;
        Core_MatrixTest::get_test_array_types_and_sizes(test_case_idx, sizes, types);

        flags = bits & (CV_COVAR_NORMAL | CV_COVAR_USE_AVG | CV_COVAR_SCALE | CV_COVAR_ROWS);
        single_matrix = flags & CV_COVAR_ROWS;
        t_flag = (bits & 256) != 0;

        const int min_count = 2;

        if (!t_flag) {
            len = sizes[INPUT][0].width;
            count = sizes[INPUT][0].height;
            count = MAX(count, min_count);
            sizes[INPUT][0] = Size(len, count);
        }
        else {
            len = sizes[INPUT][0].height;
            count = sizes[INPUT][0].width;
            count = MAX(count, min_count);
            sizes[INPUT][0] = Size(count, len);
        }

        if (single_matrix && t_flag)
            flags = (flags & ~CV_COVAR_ROWS) | CV_COVAR_COLS;

        if (CV_MAT_DEPTH(types[INPUT][0]) == CV_32S)
            types[INPUT][0] = (types[INPUT][0] & ~CV_MAT_DEPTH_MASK) | CV_32F;

        sizes[OUTPUT][0] = sizes[REF_OUTPUT][0] = flags & CV_COVAR_NORMAL ? Size(len, len) : Size(count, count);
        sizes[INPUT_OUTPUT][0] = sizes[REF_INPUT_OUTPUT][0] = !t_flag ? Size(len, 1) : Size(1, len);
        sizes[TEMP][0] = sizes[INPUT][0];

        types[INPUT_OUTPUT][0] = types[REF_INPUT_OUTPUT][0] =
            types[OUTPUT][0] = types[REF_OUTPUT][0] = types[TEMP][0] =
            CV_MAT_DEPTH(types[INPUT][0]) == CV_64F || (bits & 512) ? CV_64F : CV_32F;

        are_images = (bits & 1024) != 0;
        for (i = 0; i < (single_matrix ? 1 : count); i++)
            temp_hdrs.push_back(NULL);
    }
    int prepare_test_case(int test_case_idx ){
    int code = Core_MatrixTest::prepare_test_case(test_case_idx);
    if (code > 0) {
        int i;
        int single_matrix = flags & (CV_COVAR_ROWS | CV_COVAR_COLS);
        int hdr_size = are_images ? sizeof(IplImage) : sizeof(CvMat);

        hdr_data.resize(count * hdr_size);
        uchar * _hdr_data = &hdr_data[0];
        if (single_matrix) {
            if (!are_images)
                *((CvMat *)_hdr_data) = test_mat[INPUT][0];
            else
                *((IplImage *)_hdr_data) = test_mat[INPUT][0];
            temp_hdrs[0] = _hdr_data;
        }
        else
            for (i = 0; i < count; i++) {
                Mat part;
                void* ptr = _hdr_data + i * hdr_size;

                if (!t_flag)
                    part = test_mat[INPUT][0].row(i);
                else
                    part = test_mat[INPUT][0].col(i);

                if (!are_images)
                    *((CvMat *)ptr) = part;
                else
                    *((IplImage *)ptr) = part;

                temp_hdrs[i] = ptr;
            }
    }

    return code;
}
    void run_func(){
    cvCalcCovarMatrix((const void**)&temp_hdrs[0], count,
        test_array[OUTPUT][0], test_array[INPUT_OUTPUT][0], flags );
    }
    void prepare_to_validation(int test_case_idx ){
    Mat & avg = test_mat[REF_INPUT_OUTPUT][0];
    double scale = 1.;

    if (!(flags & CV_COVAR_USE_AVG)) {
        Mat hdrs0 = cvarrToMat(temp_hdrs[0]);

        int i;
        avg = Scalar::all(0);

        for (i = 0; i < count; i++) {
            Mat vec;
            if (flags & CV_COVAR_ROWS)
                vec = hdrs0.row(i);
            else if (flags & CV_COVAR_COLS)
                vec = hdrs0.col(i);
            else
                vec = cvarrToMat(temp_hdrs[i]);

            alvision.cvtest.add(avg, 1, vec, 1, Scalar::all(0), avg, avg.type());
        }

        alvision.cvtest.add(avg, 1. / count, avg, 0., Scalar::all(0), avg, avg.type());
    }

    if (flags & CV_COVAR_SCALE) {
        scale = 1. / count;
    }

    Mat & temp0 = test_mat[TEMP][0];
    cv::repeat(avg, temp0.rows / avg.rows, temp0.cols / avg.cols, temp0);
    alvision.cvtest.add(test_mat[INPUT][0], 1, temp0, -1, Scalar::all(0), temp0, temp0.type());

    alvision.cvtest.gemm(temp0, temp0, scale, Mat(), 0., test_mat[REF_OUTPUT][0],
        t_flag ^ ((flags & CV_COVAR_NORMAL) != 0) ? CV_GEMM_A_T : CV_GEMM_B_T);
    temp_hdrs.clear();
    }


    vector<void*> temp_hdrs;
    vector<uchar> hdr_data;
    int flags, t_flag, len, count;
    bool are_images;
};


function cvTsFloodWithZeros( Mat& mat, RNG& rng ) : void
{
    int k, total = mat.rows*mat.cols, type = mat.type();
    int zero_total = alvision.cvtest.randInt(rng) % total;
    CV_Assert( type == CV_32FC1 || type == CV_64FC1 );

    for( k = 0; k < zero_total; k++ )
    {
        int i = alvision.cvtest.randInt(rng) % mat.rows;
        int j = alvision.cvtest.randInt(rng) % mat.cols;

        if( type == CV_32FC1 )
            mat.at<float>(i,j) = 0.f;
        else
            mat.at<double>(i,j) = 0.;
    }
}


///////////////// determinant /////////////////////

class Core_DetTest extends Core_MatrixTest
{
    constructor() {
        super(1, 1, false, true, 1);
        this.test_case_count = 100;
        this.max_log_array_size = 7;
        this.test_array[TEMP].push_back(NULL);
    }
public:
    typedef Core_MatrixTest Base;
    Core_DetTest();
    protected:
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>,
        types: Array<Array<alvision.int>>): void {

        Base::get_test_array_types_and_sizes(test_case_idx, sizes, types);

        sizes[INPUT][0].width = sizes[INPUT][0].height;
        sizes[TEMP][0] = sizes[INPUT][0];
        types[TEMP][0] = CV_64FC1;
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        return CV_MAT_DEPTH(cvGetElemType(test_array[INPUT][0])) == CV_32F ? 1e-2 : 1e-5;
    }
    void get_minmax_bounds(i : alvision.int, j: alvision.int, type : alvision.int,  low : alvision.Scalar, high : alvision.Scalar){

    low = cvScalarAll(-2.);
    high = cvScalarAll(2.);
}
    int prepare_test_case(int test_case_idx ){
    int code = Core_MatrixTest::prepare_test_case(test_case_idx);
    if (code > 0)
        cvTsFloodWithZeros(test_mat[INPUT][0], ts ->get_rng());

    return code;
    }
    void run_func(){
    test_mat[OUTPUT][0].at<Scalar>(0, 0) = cvRealScalar(cvDet(test_array[INPUT][0]));
    }
    void prepare_to_validation(int test_case_idx ){

    test_mat[INPUT][0].convertTo(test_mat[TEMP][0], test_mat[TEMP][0].type());
    CvMat temp0 = test_mat[TEMP][0];
    test_mat[REF_OUTPUT][0].at<Scalar>(0, 0) = cvRealScalar(cvTsLU(&temp0, 0, 0));
    }
};



// LU method that chooses the optimal in a column pivot element
function cvTsLU( CvMat* a, CvMat* b=NULL, CvMat* x=NULL, int* rank=0 ) : alvision.double
{
    int i, j, k, N = a->rows, N1 = a->cols, Nm = MIN(N, N1), step = a->step/sizeof(double);
    int M = b ? b->cols : 0, b_step = b ? b->step/sizeof(double) : 0;
    int x_step = x ? x->step/sizeof(double) : 0;
    double *a0 = a->data.db, *b0 = b ? b->data.db : 0;
    double *x0 = x ? x->data.db : 0;
    double t, det = 1.;
    assert( CV_MAT_TYPE(a->type) == CV_64FC1 &&
           (!b || CV_ARE_TYPES_EQ(a,b)) && (!x || CV_ARE_TYPES_EQ(a,x)));

    for( i = 0; i < Nm; i++ )
    {
        double max_val = fabs(a0[i*step + i]);
        double *a1, *a2, *b1 = 0, *b2 = 0;
        k = i;

        for( j = i+1; j < N; j++ )
        {
            t = fabs(a0[j*step + i]);
            if( max_val < t )
            {
                max_val = t;
                k = j;
            }
        }

        if( k != i )
        {
            for( j = i; j < N1; j++ )
                CV_SWAP( a0[i*step + j], a0[k*step + j], t );

            for( j = 0; j < M; j++ )
                CV_SWAP( b0[i*b_step + j], b0[k*b_step + j], t );
            det = -det;
        }

        if( max_val == 0 )
        {
            if( rank )
                *rank = i;
            return 0.;
        }

        a1 = a0 + i*step;
        a2 = a1 + step;
        b1 = b0 + i*b_step;
        b2 = b1 + b_step;

        for( j = i+1; j < N; j++, a2 += step, b2 += b_step )
        {
            t = a2[i]/a1[i];
            for( k = i+1; k < N1; k++ )
                a2[k] -= t*a1[k];

            for( k = 0; k < M; k++ )
                b2[k] -= t*b1[k];
        }

        det *= a1[i];
    }

    if( x )
    {
        assert( b );

        for( i = N-1; i >= 0; i-- )
        {
            double* a1 = a0 + i*step;
            double* b1 = b0 + i*b_step;
            for( j = 0; j < M; j++ )
            {
                t = b1[j];
                for( k = i+1; k < N1; k++ )
                    t -= a1[k]*x0[k*x_step + j];
                x0[i*x_step + j] = t/a1[i];
            }
        }
    }

    if( rank )
        *rank = i;
    return det;
}




///////////////// invert /////////////////////

class Core_InvertTest extends Core_MatrixTest
{
    constructor() {
        super(1, 1, false, false, 1);
        this.method = (0);
        this.rank = (0);
        this.result = (0.);
            this.test_case_count = 100;
            this.max_log_array_size = 7;
            this.test_array[TEMP].push_back(NULL);
            this.test_array[TEMP].push_back(NULL);
    }
public:
    typedef Core_MatrixTest Base;
    Core_InvertTest();
protected:
get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
    RNG & rng = ts ->get_rng();
    int bits = alvision.cvtest.randInt(rng);
    Base::get_test_array_types_and_sizes(test_case_idx, sizes, types);
    int min_size = MIN(sizes[INPUT][0].width, sizes[INPUT][0].height);

    if ((bits & 3) == 0) {
        method = CV_SVD;
        if (bits & 4) {
            sizes[INPUT][0] = Size(min_size, min_size);
            if (bits & 16)
                method = CV_CHOLESKY;
        }
    }
    else {
        method = CV_LU;
        sizes[INPUT][0] = Size(min_size, min_size);
    }

    sizes[TEMP][0].width = sizes[INPUT][0].height;
    sizes[TEMP][0].height = sizes[INPUT][0].width;
    sizes[TEMP][1] = sizes[INPUT][0];
    types[TEMP][0] = types[INPUT][0];
    types[TEMP][1] = CV_64FC1;
    sizes[OUTPUT][0] = sizes[REF_OUTPUT][0] = Size(min_size, min_size);
}
    void get_minmax_bounds(i : alvision.int, j: alvision.int, type : alvision.int,  low : alvision.Scalar, high : alvision.Scalar){
    low = cvScalarAll(-1.);
    high = cvScalarAll(1.);
}
    get_success_error_level(test_case_idx : alvision.int, i : alvision.int, j  : alvision.int) : alvision.double {

    return CV_MAT_DEPTH(cvGetElemType(test_array[OUTPUT][0])) == CV_32F ? 1e-2 : 1e-6;
}
    int prepare_test_case(int test_case_idx ){
    int code = Core_MatrixTest::prepare_test_case(test_case_idx);
    if (code > 0) {
        cvTsFloodWithZeros(test_mat[INPUT][0], ts ->get_rng());

        if (method == CV_CHOLESKY) {
            alvision.cvtest.gemm(test_mat[INPUT][0], test_mat[INPUT][0], 1.,
                Mat(), 0., test_mat[TEMP][0], CV_GEMM_B_T);
            alvision.cvtest.copy(test_mat[TEMP][0], test_mat[INPUT][0]);
        }
    }

    return code;
    }
    void run_func(){
    result = cvInvert(test_array[INPUT][0], test_array[TEMP][0], method);
    }
    void prepare_to_validation(int test_case_idx ){
    Mat & input = test_mat[INPUT][0];
    Mat & temp0 = test_mat[TEMP][0];
    Mat & temp1 = test_mat[TEMP][1];
    Mat & dst0 = test_mat[REF_OUTPUT][0];
    Mat & dst = test_mat[OUTPUT][0];
    CvMat _input = input;
    double ratio = 0, det = cvTsSVDet( &_input, &ratio);
    double threshold = (input.depth() == CV_32F ? FLT_EPSILON : DBL_EPSILON) * 1000;

    alvision.cvtest.convert(input, temp1, temp1.type());

    if (det < threshold ||
        ((method == CV_LU || method == CV_CHOLESKY) && (result == 0 || ratio < threshold)) ||
        ((method == CV_SVD || method == CV_SVD_SYM) && result < threshold)) {
        dst = Scalar::all(0);
        dst0 = Scalar::all(0);
        return;
    }

    if (input.rows >= input.cols)
        alvision.cvtest.gemm(temp0, input, 1., Mat(), 0., dst, 0);
    else
        alvision.cvtest.gemm(input, temp0, 1., Mat(), 0., dst, 0);

    cv::setIdentity(dst0, Scalar::all(1));
    }
    int method, rank;
    double result;
};


function cvTsSVDet( CvMat* mat, double* ratio ) : alvision.double
{
    int type = CV_MAT_TYPE(mat->type);
    int i, nm = MIN( mat->rows, mat->cols );
    CvMat* w = cvCreateMat( nm, 1, type );
    double det = 1.;

    cvSVD( mat, w, 0, 0, 0 );

    if( type == CV_32FC1 )
    {
        for( i = 0; i < nm; i++ )
            det *= w->data.fl[i];
        *ratio = w->data.fl[nm-1] < FLT_EPSILON ? 0 : w->data.fl[nm-1]/w->data.fl[0];
    }
    else
    {
        for( i = 0; i < nm; i++ )
            det *= w->data.db[i];
        *ratio = w->data.db[nm-1] < FLT_EPSILON ? 0 : w->data.db[nm-1]/w->data.db[0];
    }

    cvReleaseMat( &w );
    return det;
}


///////////////// solve /////////////////////

class Core_SolveTest extends Core_MatrixTest
{
    constructor() {
        super(2, 1, false, false, 1);
        this.method = (0);
        this.rank = (0);
        this.result = (0.);
            this.test_case_count = 100;
            this.max_log_array_size = 7;
            this.test_array[TEMP].push_back(NULL);
            this.test_array[TEMP].push_back(NULL);
    }

    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {

        RNG & rng = ts ->get_rng();
        int bits = alvision.cvtest.randInt(rng);
        Base::get_test_array_types_and_sizes(test_case_idx, sizes, types);
        CvSize in_sz = sizes[INPUT][0];
        if (in_sz.width > in_sz.height)
            in_sz = cvSize(in_sz.height, in_sz.width);
        Base::get_test_array_types_and_sizes(test_case_idx, sizes, types);
        sizes[INPUT][0] = in_sz;
        int min_size = MIN(sizes[INPUT][0].width, sizes[INPUT][0].height);

        if ((bits & 3) == 0) {
            method = CV_SVD;
            if (bits & 4) {
                sizes[INPUT][0] = Size(min_size, min_size);
                /*if( bits & 8 )
                 method = CV_SVD_SYM;*/
            }
        }
        else {
            method = CV_LU;
            sizes[INPUT][0] = Size(min_size, min_size);
        }

        sizes[INPUT][1].height = sizes[INPUT][0].height;
        sizes[TEMP][0].width = sizes[INPUT][1].width;
        sizes[TEMP][0].height = sizes[INPUT][0].width;
        sizes[TEMP][1] = sizes[INPUT][0];
        types[TEMP][0] = types[INPUT][0];
        types[TEMP][1] = CV_64FC1;
        sizes[OUTPUT][0] = sizes[REF_OUTPUT][0] = Size(sizes[INPUT][1].width, min_size);
    }
    void get_minmax_bounds(i : alvision.int, j: alvision.int, type : alvision.int,  low : alvision.Scalar, high : alvision.Scalar){
    low = cvScalarAll(-1.);
    high = cvScalarAll(1.);
}
    get_success_error_level(test_case_idx : alvision.int, i : alvision.int, j  : alvision.int) : alvision.double {
    return CV_MAT_DEPTH(cvGetElemType(test_array[OUTPUT][0])) == CV_32F ? 5e-2 : 1e-8;
}
    int prepare_test_case(int test_case_idx ){

    int code = Core_MatrixTest::prepare_test_case(test_case_idx);

    /*if( method == CV_SVD_SYM )
     {
     cvTsGEMM( test_array[INPUT][0], test_array[INPUT][0], 1.,
     0, 0., test_array[TEMP][0], CV_GEMM_B_T );
     cvTsCopy( test_array[TEMP][0], test_array[INPUT][0] );
     }*/

    return code;
}
    void run_func(){
    result = cvSolve(test_array[INPUT][0], test_array[INPUT][1], test_array[TEMP][0], method);
    }
    void prepare_to_validation(int test_case_idx ){
    //int rank = test_mat[REF_OUTPUT][0].rows;
    Mat & input = test_mat[INPUT][0];
    Mat & dst = test_mat[OUTPUT][0];
    Mat & dst0 = test_mat[REF_OUTPUT][0];

    if (method == CV_LU) {
        if (result == 0) {
            Mat & temp1 = test_mat[TEMP][1];
            alvision.cvtest.convert(input, temp1, temp1.type());
            dst = Scalar::all(0);
            CvMat _temp1 = temp1;
            double det = cvTsLU( &_temp1, 0, 0);
            dst0 = Scalar::all(det != 0);
            return;
        }

        double threshold = (input.type() == CV_32F ? FLT_EPSILON : DBL_EPSILON) * 1000;
        CvMat _input = input;
        double ratio = 0, det = cvTsSVDet( &_input, &ratio);
        if (det < threshold || ratio < threshold) {
            dst = Scalar::all(0);
            dst0 = Scalar::all(0);
            return;
        }
    }

    Mat * pdst = input.rows <= input.cols ? &test_mat[OUTPUT][0] : &test_mat[INPUT][1];

    alvision.cvtest.gemm(input, test_mat[TEMP][0], 1., test_mat[INPUT][1], -1., *pdst, 0);
    if (pdst != &dst)
        alvision.cvtest.gemm(input, *pdst, 1., Mat(), 0., dst, CV_GEMM_A_T);
    dst0 = Scalar::all(0);
    }
    protected int method, rank;
    protected double result;
};



///////////////// SVD /////////////////////

class Core_SVDTest extends Core_MatrixTest
{
public:
    typedef Core_MatrixTest Base;
    Core_SVDTest();
protected:
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>,types: Array<Array<alvision.int>>): void {}
    get_success_error_level(test_case_idx : alvision.int, i : alvision.int , j  : alvision.int) : alvision.double {}
    void get_minmax_bounds( int /*i*/, int /*j*/, int /*type*/, Scalar& low, Scalar& high );
    int prepare_test_case( int test_case_idx );
    void run_func();
    void prepare_to_validation( int test_case_idx );
    int flags;
    bool have_u, have_v, symmetric, compact, vector_w;
};


Core_SVDTest::Core_SVDTest() :
Core_MatrixTest( 1, 4, false, false, 1 ),
flags(0), have_u(false), have_v(false), symmetric(false), compact(false), vector_w(false)
{
    test_case_count = 100;
    max_log_array_size = 8;
    test_array[TEMP].push_back(NULL);
    test_array[TEMP].push_back(NULL);
    test_array[TEMP].push_back(NULL);
    test_array[TEMP].push_back(NULL);
}


void Core_SVDTest::get_test_array_types_and_sizes( int test_case_idx, vector<vector<Size> >& sizes, vector<vector<int> >& types )
{
    RNG& rng = ts->get_rng();
    int bits = alvision.cvtest.randInt(rng);
    Core_MatrixTest::get_test_array_types_and_sizes( test_case_idx, sizes, types );
    int min_size, i, m, n;

    min_size = MIN( sizes[INPUT][0].width, sizes[INPUT][0].height );

    flags = bits & (CV_SVD_MODIFY_A+CV_SVD_U_T+CV_SVD_V_T);
    have_u = (bits & 8) != 0;
    have_v = (bits & 16) != 0;
    symmetric = (bits & 32) != 0;
    compact = (bits & 64) != 0;
    vector_w = (bits & 128) != 0;

    if( symmetric )
        sizes[INPUT][0] = Size(min_size, min_size);

    m = sizes[INPUT][0].height;
    n = sizes[INPUT][0].width;

    if( compact )
        sizes[TEMP][0] = Size(min_size, min_size);
    else
        sizes[TEMP][0] = sizes[INPUT][0];
    sizes[TEMP][3] = Size(0,0);

    if( vector_w )
    {
        sizes[TEMP][3] = sizes[TEMP][0];
        if( bits & 256 )
            sizes[TEMP][0] = Size(1, min_size);
        else
            sizes[TEMP][0] = Size(min_size, 1);
    }

    if( have_u )
    {
        sizes[TEMP][1] = compact ? Size(min_size, m) : Size(m, m);

        if( flags & CV_SVD_U_T )
            CV_SWAP( sizes[TEMP][1].width, sizes[TEMP][1].height, i );
    }
    else
        sizes[TEMP][1] = Size(0,0);

    if( have_v )
    {
        sizes[TEMP][2] = compact ? Size(n, min_size) : Size(n, n);

        if( !(flags & CV_SVD_V_T) )
            CV_SWAP( sizes[TEMP][2].width, sizes[TEMP][2].height, i );
    }
    else
        sizes[TEMP][2] = Size(0,0);

    types[TEMP][0] = types[TEMP][1] = types[TEMP][2] = types[TEMP][3] = types[INPUT][0];
    types[OUTPUT][0] = types[OUTPUT][1] = types[OUTPUT][2] = types[INPUT][0];
    types[OUTPUT][3] = CV_8UC1;
    sizes[OUTPUT][0] = !have_u || !have_v ? Size(0,0) : sizes[INPUT][0];
    sizes[OUTPUT][1] = !have_u ? Size(0,0) : compact ? Size(min_size,min_size) : Size(m,m);
    sizes[OUTPUT][2] = !have_v ? Size(0,0) : compact ? Size(min_size,min_size) : Size(n,n);
    sizes[OUTPUT][3] = Size(min_size,1);

    for( i = 0; i < 4; i++ )
    {
        sizes[REF_OUTPUT][i] = sizes[OUTPUT][i];
        types[REF_OUTPUT][i] = types[OUTPUT][i];
    }
}


int Core_SVDTest::prepare_test_case( int test_case_idx )
{
    int code = Core_MatrixTest::prepare_test_case( test_case_idx );
    if( code > 0 )
    {
        Mat& input = test_mat[INPUT][0];
        cvTsFloodWithZeros( input, ts->get_rng() );

        if( symmetric && (have_u || have_v) )
        {
            Mat& temp = test_mat[TEMP][have_u ? 1 : 2];
            alvision.cvtest.gemm( input, input, 1., Mat(), 0., temp, CV_GEMM_B_T );
            alvision.cvtest.copy( temp, input );
        }

        if( (flags & CV_SVD_MODIFY_A) && test_array[OUTPUT][0] )
            alvision.cvtest.copy( input, test_mat[OUTPUT][0] );
    }

    return code;
}


void Core_SVDTest::get_minmax_bounds( int /*i*/, int /*j*/, int /*type*/, Scalar& low, Scalar& high )
{
    low = cvScalarAll(-2.);
    high = cvScalarAll(2.);
}

double Core_SVDTest::get_success_error_level( int test_case_idx, int i, int j )
{
    int input_depth = CV_MAT_DEPTH(cvGetElemType( test_array[INPUT][0] ));
    double input_precision = input_depth < CV_32F ? 0 : input_depth == CV_32F ? 1e-5 : 5e-11;
    double output_precision = Base::get_success_error_level( test_case_idx, i, j );
    return MAX(input_precision, output_precision);
}

void Core_SVDTest::run_func()
{
    CvArr* src = test_array[!(flags & CV_SVD_MODIFY_A) ? INPUT : OUTPUT][0];
    if( !src )
        src = test_array[INPUT][0];
    cvSVD( src, test_array[TEMP][0], test_array[TEMP][1], test_array[TEMP][2], flags );
}


void Core_SVDTest::prepare_to_validation( int /*test_case_idx*/ )
{
    Mat& input = test_mat[INPUT][0];
    int depth = input.depth();
    int i, m = input.rows, n = input.cols, min_size = MIN(m, n);
    Mat *src, *dst, *w;
    double prev = 0, threshold = depth == CV_32F ? FLT_EPSILON : DBL_EPSILON;

    if( have_u )
    {
        src = &test_mat[TEMP][1];
        dst = &test_mat[OUTPUT][1];
        alvision.cvtest.gemm( *src, *src, 1., Mat(), 0., *dst, src->rows == dst->rows ? CV_GEMM_B_T : CV_GEMM_A_T );
        cv::setIdentity( test_mat[REF_OUTPUT][1], Scalar::all(1.) );
    }

    if( have_v )
    {
        src = &test_mat[TEMP][2];
        dst = &test_mat[OUTPUT][2];
        alvision.cvtest.gemm( *src, *src, 1., Mat(), 0., *dst, src->rows == dst->rows ? CV_GEMM_B_T : CV_GEMM_A_T );
        cv::setIdentity( test_mat[REF_OUTPUT][2], Scalar::all(1.) );
    }

    w = &test_mat[TEMP][0];
    for( i = 0; i < min_size; i++ )
    {
        double normval = 0, aii;
        if( w->rows > 1 && w->cols > 1 )
        {
            normval = alvision.cvtest.norm( w->row(i), NORM_L1 );
            aii = depth == CV_32F ? w->at<float>(i,i) : w->at<double>(i,i);
        }
        else
        {
            normval = aii = depth == CV_32F ? w->at<float>(i) : w->at<double>(i);
        }

        normval = fabs(normval - aii);
        test_mat[OUTPUT][3].at<uchar>(i) = aii >= 0 && normval < threshold && (i == 0 || aii <= prev);
        prev = aii;
    }

    test_mat[REF_OUTPUT][3] = Scalar::all(1);

    if( have_u && have_v )
    {
        if( vector_w )
        {
            test_mat[TEMP][3] = Scalar::all(0);
            for( i = 0; i < min_size; i++ )
            {
                double val = depth == CV_32F ? w->at<float>(i) : w->at<double>(i);
                cvSetReal2D( test_array[TEMP][3], i, i, val );
            }
            w = &test_mat[TEMP][3];
        }

        if( m >= n )
        {
            alvision.cvtest.gemm( test_mat[TEMP][1], *w, 1., Mat(), 0., test_mat[REF_OUTPUT][0],
                     flags & CV_SVD_U_T ? CV_GEMM_A_T : 0 );
            alvision.cvtest.gemm( test_mat[REF_OUTPUT][0], test_mat[TEMP][2], 1., Mat(), 0.,
                     test_mat[OUTPUT][0], flags & CV_SVD_V_T ? 0 : CV_GEMM_B_T );
        }
        else
        {
            alvision.cvtest.gemm( *w, test_mat[TEMP][2], 1., Mat(), 0., test_mat[REF_OUTPUT][0],
                     flags & CV_SVD_V_T ? 0 : CV_GEMM_B_T );
            alvision.cvtest.gemm( test_mat[TEMP][1], test_mat[REF_OUTPUT][0], 1., Mat(), 0.,
                     test_mat[OUTPUT][0], flags & CV_SVD_U_T ? CV_GEMM_A_T : 0 );
        }

        alvision.cvtest.copy( test_mat[INPUT][0], test_mat[REF_OUTPUT][0] );
    }
}



///////////////// SVBkSb /////////////////////

class Core_SVBkSbTest extends Core_MatrixTest
{
public:
    typedef Core_MatrixTest Base;
    Core_SVBkSbTest();
protected:
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>,types: Array<Array<alvision.int>>): void {}
    get_success_error_level(test_case_idx : alvision.int, i : alvision.int , j  : alvision.int) : alvision.double {}
    void get_minmax_bounds( int /*i*/, int /*j*/, int /*type*/, Scalar& low, Scalar& high );
    int prepare_test_case( int test_case_idx );
    void run_func();
    void prepare_to_validation( int test_case_idx );
    int flags;
    bool have_b, symmetric, compact, vector_w;
};


Core_SVBkSbTest::Core_SVBkSbTest() : Core_MatrixTest( 2, 1, false, false, 1 ),
flags(0), have_b(false), symmetric(false), compact(false), vector_w(false)
{
    test_case_count = 100;
    test_array[TEMP].push_back(NULL);
    test_array[TEMP].push_back(NULL);
    test_array[TEMP].push_back(NULL);
}


void Core_SVBkSbTest::get_test_array_types_and_sizes( int test_case_idx, vector<vector<Size> >& sizes,
                                                      vector<vector<int> >& types )
{
    RNG& rng = ts->get_rng();
    int bits = alvision.cvtest.randInt(rng);
    Base::get_test_array_types_and_sizes( test_case_idx, sizes, types );
    int min_size, i, m, n;
    CvSize b_size;

    min_size = MIN( sizes[INPUT][0].width, sizes[INPUT][0].height );

    flags = bits & (CV_SVD_MODIFY_A+CV_SVD_U_T+CV_SVD_V_T);
    have_b = (bits & 16) != 0;
    symmetric = (bits & 32) != 0;
    compact = (bits & 64) != 0;
    vector_w = (bits & 128) != 0;

    if( symmetric )
        sizes[INPUT][0] = Size(min_size, min_size);

    m = sizes[INPUT][0].height;
    n = sizes[INPUT][0].width;

    sizes[INPUT][1] = Size(0,0);
    b_size = Size(m,m);
    if( have_b )
    {
        sizes[INPUT][1].height = sizes[INPUT][0].height;
        sizes[INPUT][1].width = alvision.cvtest.randInt(rng) % 100 + 1;
        b_size = sizes[INPUT][1];
    }

    if( compact )
        sizes[TEMP][0] = Size(min_size, min_size);
    else
        sizes[TEMP][0] = sizes[INPUT][0];

    if( vector_w )
    {
        if( bits & 256 )
            sizes[TEMP][0] = Size(1, min_size);
        else
            sizes[TEMP][0] = Size(min_size, 1);
    }

    sizes[TEMP][1] = compact ? Size(min_size, m) : Size(m, m);

    if( flags & CV_SVD_U_T )
        CV_SWAP( sizes[TEMP][1].width, sizes[TEMP][1].height, i );

    sizes[TEMP][2] = compact ? Size(n, min_size) : Size(n, n);

    if( !(flags & CV_SVD_V_T) )
        CV_SWAP( sizes[TEMP][2].width, sizes[TEMP][2].height, i );

    types[TEMP][0] = types[TEMP][1] = types[TEMP][2] = types[INPUT][0];
    types[OUTPUT][0] = types[REF_OUTPUT][0] = types[INPUT][0];
    sizes[OUTPUT][0] = sizes[REF_OUTPUT][0] = Size( b_size.width, n );
}


int Core_SVBkSbTest::prepare_test_case( int test_case_idx )
{
    int code = Base::prepare_test_case( test_case_idx );
    if( code > 0 )
    {
        Mat& input = test_mat[INPUT][0];
        cvTsFloodWithZeros( input, ts->get_rng() );

        if( symmetric )
        {
            Mat& temp = test_mat[TEMP][1];
            alvision.cvtest.gemm( input, input, 1., Mat(), 0., temp, CV_GEMM_B_T );
            alvision.cvtest.copy( temp, input );
        }

        CvMat _input = input;
        cvSVD( &_input, test_array[TEMP][0], test_array[TEMP][1], test_array[TEMP][2], flags );
    }

    return code;
}


void Core_SVBkSbTest::get_minmax_bounds( int /*i*/, int /*j*/, int /*type*/, Scalar& low, Scalar& high )
{
    low = cvScalarAll(-2.);
    high = cvScalarAll(2.);
}


double Core_SVBkSbTest::get_success_error_level( int /*test_case_idx*/, int /*i*/, int /*j*/ )
{
    return CV_MAT_DEPTH(cvGetElemType(test_array[INPUT][0])) == CV_32F ? 1e-3 : 1e-7;
}


void Core_SVBkSbTest::run_func()
{
    cvSVBkSb( test_array[TEMP][0], test_array[TEMP][1], test_array[TEMP][2],
             test_array[INPUT][1], test_array[OUTPUT][0], flags );
}


void Core_SVBkSbTest::prepare_to_validation( int )
{
    Mat& input = test_mat[INPUT][0];
    int i, m = input.rows, n = input.cols, min_size = MIN(m, n);
    bool is_float = input.type() == CV_32F;
    Size w_size = compact ? Size(min_size,min_size) : Size(m,n);
    Mat& w = test_mat[TEMP][0];
    Mat wdb( w_size.height, w_size.width, CV_64FC1 );
    CvMat _w = w, _wdb = wdb;
    // use exactly the same threshold as in icvSVD... ,
    // so the changes in the library and here should be synchronized.
    double threshold = cv::sum(w)[0]*(DBL_EPSILON*2);//(is_float ? FLT_EPSILON*10 : DBL_EPSILON*2);

    wdb = Scalar::all(0);
    for( i = 0; i < min_size; i++ )
    {
        double wii = vector_w ? cvGetReal1D(&_w,i) : cvGetReal2D(&_w,i,i);
        cvSetReal2D( &_wdb, i, i, wii > threshold ? 1./wii : 0. );
    }

    Mat u = test_mat[TEMP][1];
    Mat v = test_mat[TEMP][2];
    Mat b = test_mat[INPUT][1];

    if( is_float )
    {
        test_mat[TEMP][1].convertTo(u, CV_64F);
        test_mat[TEMP][2].convertTo(v, CV_64F);
        if( !b.empty() )
            test_mat[INPUT][1].convertTo(b, CV_64F);
    }

    Mat t0, t1;

    if( !b.empty() )
        alvision.cvtest.gemm( u, b, 1., Mat(), 0., t0, !(flags & CV_SVD_U_T) ? CV_GEMM_A_T : 0 );
    else if( flags & CV_SVD_U_T )
        alvision.cvtest.copy( u, t0 );
    else
        alvision.cvtest.transpose( u, t0 );

    alvision.cvtest.gemm( wdb, t0, 1, Mat(), 0, t1, 0 );

    alvision.cvtest.gemm( v, t1, 1, Mat(), 0, t0, flags & CV_SVD_V_T ? CV_GEMM_A_T : 0 );
    Mat& dst0 = test_mat[REF_OUTPUT][0];
    t0.convertTo(dst0, dst0.type() );
}


typedef std::complex<double> complex_type;

struct pred_complex
{
    bool operator() (const complex_type& lhs, const complex_type& rhs) const
    {
        return fabs(lhs.real() - rhs.real()) > fabs(rhs.real())*FLT_EPSILON ? lhs.real() < rhs.real() : lhs.imag() < rhs.imag();
    }
};

struct pred_double
{
    bool operator() (const double& lhs, const double& rhs) const
    {
        return lhs < rhs;
    }
};

class Core_SolvePolyTest extends alvision. cvtest.BaseTest
{
public:
    Core_SolvePolyTest();
    ~Core_SolvePolyTest();
protected:
    virtual void run( int start_from );
};

Core_SolvePolyTest::Core_SolvePolyTest() {}

Core_SolvePolyTest::~Core_SolvePolyTest() {}

void Core_SolvePolyTest::run( int )
{
    RNG& rng = ts->get_rng();
    int fig = 100;
    double range = 50;
    double err_eps = 1e-4;

    for (int idx = 0, max_idx = 1000, progress = 0; idx < max_idx; ++idx)
    {
        progress = update_progress(progress, idx-1, max_idx, 0);
        int n = alvision.cvtest.randInt(rng) % 13 + 1;
        std::vector<complex_type> r(n), ar(n), c(n + 1, 0);
        std::vector<double> a(n + 1), u(n * 2), ar1(n), ar2(n);

        int rr_odds = 3; // odds that we get a real root
        for (int j = 0; j < n;)
        {
            if (alvision.cvtest.randInt(rng) % rr_odds == 0 || j == n - 1)
                r[j++] = alvision.cvtest.randReal(rng) * range;
            else
            {
                r[j] = complex_type(alvision.cvtest.randReal(rng) * range,
                                    alvision.cvtest.randReal(rng) * range + 1);
                r[j + 1] = std::conj(r[j]);
                j += 2;
            }
        }

        for (int j = 0, k = 1 << n, jj, kk; j < k; ++j)
        {
            int p = 0;
            complex_type v(1);
            for (jj = 0, kk = 1; jj < n && !(j & kk); ++jj, ++p, kk <<= 1)
                ;
            for (; jj < n; ++jj, kk <<= 1)
            {
                if (j & kk)
                    v *= -r[jj];
                else
                    ++p;
            }
            c[p] += v;
        }

        bool pass = false;
        double div = 0, s = 0;
        int cubic_case = idx & 1;
        for (int maxiter = 100; !pass && maxiter < 10000; maxiter *= 2, cubic_case = (cubic_case + 1) % 2)
        {
            for (int j = 0; j < n + 1; ++j)
                a[j] = c[j].real();

            CvMat amat, umat;
            cvInitMatHeader(&amat, n + 1, 1, CV_64FC1, &a[0]);
            cvInitMatHeader(&umat, n, 1, CV_64FC2, &u[0]);
            cvSolvePoly(&amat, &umat, maxiter, fig);

            for (int j = 0; j < n; ++j)
                ar[j] = complex_type(u[j * 2], u[j * 2 + 1]);

            std::sort(r.begin(), r.end(), pred_complex());
            std::sort(ar.begin(), ar.end(), pred_complex());

            pass = true;
            if( n == 3 )
            {
                ar2.resize(n);
                cv::Mat _umat2(3, 1, CV_64F, &ar2[0]), umat2 = _umat2;
                cvFlip(&amat, &amat, 0);
                int nr2;
                if( cubic_case == 0 )
                    nr2 = cv::solveCubic(cv::cvarrToMat(&amat),umat2);
                else
                    nr2 = cv::solveCubic(cv::Mat_<float>(cv::cvarrToMat(&amat)), umat2);
                cvFlip(&amat, &amat, 0);
                if(nr2 > 0)
                    std::sort(ar2.begin(), ar2.begin()+nr2, pred_double());
                ar2.resize(nr2);

                int nr1 = 0;
                for(int j = 0; j < n; j++)
                    if( fabs(r[j].imag()) < DBL_EPSILON )
                        ar1[nr1++] = r[j].real();

                pass = pass && nr1 == nr2;
                if( nr2 > 0 )
                {
                    div = s = 0;
                    for(int j = 0; j < nr1; j++)
                    {
                        s += fabs(ar1[j]);
                        div += fabs(ar1[j] - ar2[j]);
                    }
                    div /= s;
                    pass = pass && div < err_eps;
                }
            }

            div = s = 0;
            for (int j = 0; j < n; ++j)
            {
                s += fabs(r[j].real()) + fabs(r[j].imag());
                div += sqrt(pow(r[j].real() - ar[j].real(), 2) + pow(r[j].imag() - ar[j].imag(), 2));
            }
            div /= s;
            pass = pass && div < err_eps;
        }

        if (!pass)
        {
            this.ts.set_failed_test_info(alvision.cvtest.TS::FAIL_INVALID_OUTPUT);
            ts->printf( alvision.cvtest.TS::LOG, "too big diff = %g\n", div );

            for (size_t j=0;j<ar2.size();++j)
                ts->printf( alvision.cvtest.TS::LOG, "ar2[%d]=%g\n", j, ar2[j]);
            ts->printf(alvision.cvtest.TS::LOG, "\n");

            for (size_t j=0;j<r.size();++j)
                ts->printf( alvision.cvtest.TS::LOG, "r[%d]=(%g, %g)\n", j, r[j].real(), r[j].imag());
            ts->printf( alvision.cvtest.TS::LOG, "\n" );
            for (size_t j=0;j<ar.size();++j)
                ts->printf( alvision.cvtest.TS::LOG, "ar[%d]=(%g, %g)\n", j, ar[j].real(), ar[j].imag());
            break;
        }
    }
}

class Core_PhaseTest extends alvision. cvtest.BaseTest
{
public:
    Core_PhaseTest() {}
    ~Core_PhaseTest() {}
protected:
    virtual void run(int)
    {
        const float maxAngleDiff = 0.5; //in degrees
        const int axisCount = 8;
        const int dim = theRNG().uniform(1,10);
        const float scale = theRNG().uniform(1.f, 100.f);
        Mat x(axisCount + 1, dim, CV_32FC1),
            y(axisCount + 1, dim, CV_32FC1);
        Mat anglesInDegrees(axisCount + 1, dim, CV_32FC1);

        // fill the data
        x.row(0).setTo(Scalar(0));
        y.row(0).setTo(Scalar(0));
        anglesInDegrees.row(0).setTo(Scalar(0));

        x.row(1).setTo(Scalar(scale));
        y.row(1).setTo(Scalar(0));
        anglesInDegrees.row(1).setTo(Scalar(0));

        x.row(2).setTo(Scalar(scale));
        y.row(2).setTo(Scalar(scale));
        anglesInDegrees.row(2).setTo(Scalar(45));

        x.row(3).setTo(Scalar(0));
        y.row(3).setTo(Scalar(scale));
        anglesInDegrees.row(3).setTo(Scalar(90));

        x.row(4).setTo(Scalar(-scale));
        y.row(4).setTo(Scalar(scale));
        anglesInDegrees.row(4).setTo(Scalar(135));

        x.row(5).setTo(Scalar(-scale));
        y.row(5).setTo(Scalar(0));
        anglesInDegrees.row(5).setTo(Scalar(180));

        x.row(6).setTo(Scalar(-scale));
        y.row(6).setTo(Scalar(-scale));
        anglesInDegrees.row(6).setTo(Scalar(225));

        x.row(7).setTo(Scalar(0));
        y.row(7).setTo(Scalar(-scale));
        anglesInDegrees.row(7).setTo(Scalar(270));

        x.row(8).setTo(Scalar(scale));
        y.row(8).setTo(Scalar(-scale));
        anglesInDegrees.row(8).setTo(Scalar(315));

        Mat resInRad, resInDeg;
        phase(x, y, resInRad, false);
        phase(x, y, resInDeg, true);

        CV_Assert(resInRad.size() == x.size());
        CV_Assert(resInRad.type() == x.type());

        CV_Assert(resInDeg.size() == x.size());
        CV_Assert(resInDeg.type() == x.type());

        // check the result
        int outOfRangeCount = countNonZero((resInDeg > 360) | (resInDeg < 0));
        if(outOfRangeCount > 0)
        {
            ts->printf(alvision.cvtest.TS::LOG, "There are result angles that are out of range [0, 360] (part of them is %f)\n",
                       static_cast<float>(outOfRangeCount)/resInDeg.total());
            this.ts.set_failed_test_info(alvision.cvtest.TS::FAIL_INVALID_OUTPUT);
        }

        Mat diff = abs(anglesInDegrees - resInDeg);
        size_t errDegCount = diff.total() - countNonZero((diff < maxAngleDiff) | ((360 - diff) < maxAngleDiff));
        if(errDegCount > 0)
        {
            ts->printf(alvision.cvtest.TS::LOG, "There are incorrect result angles (in degrees) (part of them is %f)\n",
                       static_cast<float>(errDegCount)/resInDeg.total());
            this.ts.set_failed_test_info(alvision.cvtest.TS::FAIL_INVALID_OUTPUT);
        }

        Mat convertedRes = resInRad * 180. / CV_PI;
        double normDiff = alvision.cvtest.norm(convertedRes - resInDeg, NORM_INF);
        if(normDiff > FLT_EPSILON * 180.)
        {
            ts->printf(alvision.cvtest.TS::LOG, "There are incorrect result angles (in radians)\n");
            this.ts.set_failed_test_info(alvision.cvtest.TS::FAIL_INVALID_OUTPUT);
        }

        this.ts.set_failed_test_info(alvision.cvtest.TS::OK);
    }
};

class Core_CheckRange_Empty extends alvision. cvtest.BaseTest
{
public:
    Core_CheckRange_Empty(){}
    ~Core_CheckRange_Empty(){}
protected:
    virtual void run( int start_from );
};

void Core_CheckRange_Empty::run( int )
{
    cv::Mat m;
    ASSERT_TRUE( cv::checkRange(m) );
}

alvision.cvtest.TEST(Core_CheckRange_Empty, accuracy) { Core_CheckRange_Empty test; test.safe_run(); }

class Core_CheckRange_INT_MAX  extends alvision.cvtest.BaseTest
{
public:
    Core_CheckRange_INT_MAX(){}
    ~Core_CheckRange_INT_MAX(){}
protected:
    virtual void run( int start_from );
};

void Core_CheckRange_INT_MAX::run( int )
{
    cv::Mat m(3, 3, CV_32SC1, cv::Scalar(INT_MAX));
    ASSERT_FALSE( cv::checkRange(m, true, 0, 0, INT_MAX) );
    ASSERT_TRUE( cv::checkRange(m) );
}

TEST(Core_CheckRange_INT_MAX, accuracy) { Core_CheckRange_INT_MAX test; test.safe_run(); }

template <typename T> class Core_CheckRange : public testing::Test {};

TYPED_TEST_CASE_P(Core_CheckRange);

TYPED_TEST_P(Core_CheckRange, Negative)
{
    double min_bound = 4.5;
    double max_bound = 16.0;

    TypeParam data[] = {5, 10, 15, 4, 10, 2, 8, 12, 14};
    cv::Mat src = cv::Mat(3,3, cv::DataDepth<TypeParam>::value, data);

    cv::Point bad_pt(0, 0);

    ASSERT_FALSE(checkRange(src, true, &bad_pt, min_bound, max_bound));
    ASSERT_EQ(bad_pt.x, 0);
    ASSERT_EQ(bad_pt.y, 1);
}

TYPED_TEST_P(Core_CheckRange, Positive)
{
    double min_bound = -1;
    double max_bound = 16.0;

    TypeParam data[] = {5, 10, 15, 4, 10, 2, 8, 12, 14};
    cv::Mat src = cv::Mat(3,3, cv::DataDepth<TypeParam>::value, data);

    cv::Point bad_pt(0, 0);

    ASSERT_TRUE(checkRange(src, true, &bad_pt, min_bound, max_bound));
    ASSERT_EQ(bad_pt.x, 0);
    ASSERT_EQ(bad_pt.y, 0);
}

TYPED_TEST_P(Core_CheckRange, Bounds)
{
    double min_bound = 24.5;
    double max_bound = 1.0;

    TypeParam data[] = {5, 10, 15, 4, 10, 2, 8, 12, 14};
    cv::Mat src = cv::Mat(3,3, cv::DataDepth<TypeParam>::value, data);

    cv::Point bad_pt(0, 0);

    ASSERT_FALSE(checkRange(src, true, &bad_pt, min_bound, max_bound));
    ASSERT_EQ(bad_pt.x, 0);
    ASSERT_EQ(bad_pt.y, 0);
}

TYPED_TEST_P(Core_CheckRange, Zero)
{
    double min_bound = 0.0;
    double max_bound = 0.1;

    cv::Mat src1 = cv::Mat::zeros(3, 3, cv::DataDepth<TypeParam>::value);

    int sizes[] = {5, 6, 7};
    cv::Mat src2 = cv::Mat::zeros(3, sizes, cv::DataDepth<TypeParam>::value);

    ASSERT_TRUE( checkRange(src1, true, NULL, min_bound, max_bound) );
    ASSERT_TRUE( checkRange(src2, true, NULL, min_bound, max_bound) );
}

TYPED_TEST_P(Core_CheckRange, One)
{
    double min_bound = 1.0;
    double max_bound = 1.1;

    cv::Mat src1 = cv::Mat::ones(3, 3, cv::DataDepth<TypeParam>::value);

    int sizes[] = {5, 6, 7};
    cv::Mat src2 = cv::Mat::ones(3, sizes, cv::DataDepth<TypeParam>::value);

    ASSERT_TRUE( checkRange(src1, true, NULL, min_bound, max_bound) );
    ASSERT_TRUE( checkRange(src2, true, NULL, min_bound, max_bound) );
}

REGISTER_TYPED_TEST_CASE_P(Core_CheckRange, Negative, Positive, Bounds, Zero, One);

typedef ::testing::Types<signed char,unsigned char, signed short, unsigned short, signed int> mat_data_types;
INSTANTIATE_TYPED_TEST_CASE_P(Negative_Test, Core_CheckRange, mat_data_types);

alvision.cvtest.TEST('Core_Invert', 'small',()=>
{
    cv::Mat a = (cv::Mat_<float>(3,3) << 2.42104644730331, 1.81444796521479, -3.98072565304758, 0, 7.08389214348967e-3, 5.55326770986007e-3, 0,0, 7.44556154284261e-3);
    //cv::randu(a, -1, 1);

    cv::Mat b = a.t()*a;
    cv::Mat c, i = Mat_<float>::eye(3, 3);
    cv::invert(b, c, cv::DECOMP_LU); //std::cout << b*c << std::endl;
    ASSERT_LT( alvision.cvtest.norm(b*c, i, CV_C), 0.1 );
    cv::invert(b, c, cv::DECOMP_SVD); //std::cout << b*c << std::endl;
    ASSERT_LT( alvision.cvtest.norm(b*c, i, CV_C), 0.1 );
    cv::invert(b, c, cv::DECOMP_CHOLESKY); //std::cout << b*c << std::endl;
    ASSERT_LT( alvision.cvtest.norm(b*c, i, CV_C), 0.1 );
});

/////////////////////////////////////////////////////////////////////////////////////////////////////

alvision.cvtest.TEST('Core_CovarMatrix', 'accuracy', () => { Core_CovarMatrixTest test; test.safe_run(); });
alvision.cvtest.TEST('Core_CrossProduct', 'accuracy', () => { Core_CrossProductTest test; test.safe_run(); });
alvision.cvtest.TEST('Core_Determinant', 'accuracy', () => { Core_DetTest test; test.safe_run(); });
alvision.cvtest.TEST('Core_DotProduct', 'accuracy', () => { Core_DotProductTest test; test.safe_run(); });
alvision.cvtest.TEST('Core_GEMM', 'accuracy', () => { Core_GEMMTest test; test.safe_run(); });
alvision.cvtest.TEST('Core_Invert', 'accuracy', () => { Core_InvertTest test; test.safe_run(); });
alvision.cvtest.TEST('Core_Mahalanobis', 'accuracy', () => { Core_MahalanobisTest test; test.safe_run(); });
alvision.cvtest.TEST('Core_MulTransposed', 'accuracy', () => { Core_MulTransposedTest test; test.safe_run(); });
alvision.cvtest.TEST('Core_Transform', 'accuracy', () => { Core_TransformTest test; test.safe_run(); });
alvision.cvtest.TEST('Core_PerspectiveTransform', 'accuracy', () => { Core_PerspectiveTransformTest test; test.safe_run(); });
alvision.cvtest.TEST('Core_Pow', 'accuracy', () => { Core_PowTest test; test.safe_run(); });
alvision.cvtest.TEST('Core_SolveLinearSystem', 'accuracy', () => { Core_SolveTest test; test.safe_run(); });
alvision.cvtest.TEST('Core_SVD', 'accuracy', () => { Core_SVDTest test; test.safe_run(); });
alvision.cvtest.TEST('Core_SVBkSb', 'accuracy', () => { Core_SVBkSbTest test; test.safe_run(); });
alvision.cvtest.TEST('Core_Trace', 'accuracy', () => { Core_TraceTest test; test.safe_run(); });
alvision.cvtest.TEST('Core_SolvePoly', 'accuracy', () => { Core_SolvePolyTest test; test.safe_run(); });
alvision.cvtest.TEST('Core_Phase', 'accuracy', () => { Core_PhaseTest test; test.safe_run(); });


alvision.cvtest.TEST('Core_SVD', 'flt',()=>
{
   var a = [
    1.23377746e+011, -7.05490125e+0100, -4.18380882e+010, -11693456.0,
    -39091328.0, 77492224.0, -7.05490125e+010, 2.36211143e+011,
    -3.51093473e+010, 70773408.0, -4.83386156e+005, -129560368.,
    -4.18380882e+010, -3.51093473e+010, 9.25311222e+010, -49052424.,
    43922752.0, 12176842.0, -11693456., 70773408., -49052424., 8.40836094e+004,
    5.17475293e+003, -1.16122949e+004, -39091328., -4.83386156e+005,
    43922752., 5.17475293e+003, 5.16047969e+004, 5.68887842e+003, 77492224.,
    -129560368., 12176842., -1.16122949e+004, 5.68887842e+003,
    1.28060578e+005
    ];

    var b = [
    283751232., 2.61604198e+009, -745033216., 2.31125625e+005,
    -4.52429188e+005, -1.37596525e+006
    ];

    var A = new alvision.Mat(6, 6, alvision.MatrixType.CV_32F, a);
    var B = new alvision.Mat(6, 1, alvision.MatrixType.CV_32F, b);
    var X = new alvision.Mat(), B1 = new alvision.Mat();
    alvision.solve(A, B, X,alvision.DecompTypes.DECOMP_SVD);
    B1 = alvision.MatExpr.op_Multiplication( A,X);
    alvision.EXPECT_LE(alvision.cvtest.norm(B1, B, alvision.NormTypes.NORM_L2 + alvision.NormTypes.NORM_RELATIVE).valueOf(), alvision.FLT_EPSILON*10);
});


// TODO: eigenvv, invsqrt, cbrt, fastarctan, (round, floor, ceil(?)),

enum
{
    MAT_N_DIM_C1,
    MAT_N_1_CDIM,
    MAT_1_N_CDIM,
    MAT_N_DIM_C1_NONCONT,
    MAT_N_1_CDIM_NONCONT,
    VECTOR
};

class CV_KMeansSingularTest extends alvision. cvtest.BaseTest
{
    run(int inVariant) : void
    {
        int i, iter = 0, N = 0, N0 = 0, K = 0, dims = 0;
        Mat labels;
        try
        {
            RNG& rng = theRNG();
            const int MAX_DIM=5;
            int MAX_POINTS = 100, maxIter = 100;
            for( iter = 0; iter < maxIter; iter++ )
            {
                ts->update_context(this, iter, true);
                dims = rng.uniform(inVariant == MAT_1_N_CDIM ? 2 : 1, MAX_DIM+1);
                N = rng.uniform(1, MAX_POINTS+1);
                N0 = rng.uniform(1, MAX(N/10, 2));
                K = rng.uniform(1, N+1);

                if (inVariant == VECTOR)
                {
                    dims = 2;

                    std::vector<cv::Point2f> data0(N0);
                    rng.fill(data0, RNG::UNIFORM, -1, 1);

                    std::vector<cv::Point2f> data(N);
                    for( i = 0; i < N; i++ )
                        data[i] = data0[rng.uniform(0, N0)];

                    kmeans(data, K, labels, TermCriteria(TermCriteria::MAX_ITER+TermCriteria::EPS, 30, 0),
                           5, KMEANS_PP_CENTERS);
                }
                else
                {
                    Mat data0(N0, dims, CV_32F);
                    rng.fill(data0, RNG::UNIFORM, -1, 1);

                    Mat data;

                    switch (inVariant)
                    {
                    case MAT_N_DIM_C1:
                        data.create(N, dims, CV_32F);
                        for( i = 0; i < N; i++ )
                            data0.row(rng.uniform(0, N0)).copyTo(data.row(i));
                        break;

                    case MAT_N_1_CDIM:
                        data.create(N, 1, CV_32FC(dims));
                        for( i = 0; i < N; i++ )
                            memcpy(data.ptr(i), data0.ptr(rng.uniform(0, N0)), dims * sizeof(float));
                        break;

                    case MAT_1_N_CDIM:
                        data.create(1, N, CV_32FC(dims));
                        for( i = 0; i < N; i++ )
                            memcpy(data.ptr() + i * dims * sizeof(float), data0.ptr(rng.uniform(0, N0)), dims * sizeof(float));
                        break;

                    case MAT_N_DIM_C1_NONCONT:
                        data.create(N, dims + 5, CV_32F);
                        data = data(Range(0, N), Range(0, dims));
                        for( i = 0; i < N; i++ )
                            data0.row(rng.uniform(0, N0)).copyTo(data.row(i));
                        break;

                    case MAT_N_1_CDIM_NONCONT:
                        data.create(N, 3, CV_32FC(dims));
                        data = data.colRange(0, 1);
                        for( i = 0; i < N; i++ )
                            memcpy(data.ptr(i), data0.ptr(rng.uniform(0, N0)), dims * sizeof(float));
                        break;
                    }

                    kmeans(data, K, labels, TermCriteria(TermCriteria::MAX_ITER+TermCriteria::EPS, 30, 0),
                           5, KMEANS_PP_CENTERS);
                }

                Mat hist(K, 1, CV_32S, Scalar(0));
                for( i = 0; i < N; i++ )
                {
                    int l = labels.at<int>(i);
                    CV_Assert(0 <= l && l < K);
                    hist.at<int>(l)++;
                }
                for( i = 0; i < K; i++ )
                    CV_Assert( hist.at<int>(i) != 0 );
            }
        }
        catch(...)
        {
            ts->printf(alvision.cvtest.TS::LOG,
                       "context: iteration=%d, N=%d, N0=%d, K=%d\n",
                       iter, N, N0, K);
            std::cout << labels << std::endl;
            this.ts.set_failed_test_info(alvision.cvtest.TS::FAIL_MISMATCH);
        }
    }
};

alvision.cvtest.TEST('Core_KMeans', 'singular', () => { var test = new CV_KMeansSingularTest(); test.safe_run(MAT_N_DIM_C1); });

CV_ENUM(KMeansInputVariant, MAT_N_DIM_C1, MAT_N_1_CDIM, MAT_1_N_CDIM, MAT_N_DIM_C1_NONCONT, MAT_N_1_CDIM_NONCONT, VECTOR)

typedef testing::TestWithParam<KMeansInputVariant> Core_KMeans_InputVariants;

TEST_P(Core_KMeans_InputVariants, singular)
{
    CV_KMeansSingularTest test;
    test.safe_run(GetParam());
}

INSTANTIATE_TEST_CASE_P(AllVariants, Core_KMeans_InputVariants, KMeansInputVariant::all());

alvision.cvtest.TEST('CovariationMatrixVectorOfMat', 'accuracy',()=>
{
    unsigned int col_problem_size = 8, row_problem_size = 8, vector_size = 16;
    cv::Mat src(vector_size, col_problem_size * row_problem_size, CV_32F);
    int singleMatFlags = CV_COVAR_ROWS;

    cv::Mat gold;
    cv::Mat goldMean;
    cv::randu(src,cv::Scalar(-128), cv::Scalar(128));
    cv::calcCovarMatrix(src,gold,goldMean,singleMatFlags,CV_32F);
    std::vector<cv::Mat> srcVec;
    for(size_t i = 0; i < vector_size; i++)
    {
        srcVec.push_back(src.row(static_cast<int>(i)).reshape(0,col_problem_size));
    }

    cv::Mat actual;
    cv::Mat actualMean;
    cv::calcCovarMatrix(srcVec, actual, actualMean,singleMatFlags,CV_32F);

    cv::Mat diff;
    cv::absdiff(gold, actual, diff);
    cv::Scalar s = cv::sum(diff);
    ASSERT_EQ(s.dot(s), 0.0);

    cv::Mat meanDiff;
    cv::absdiff(goldMean, actualMean.reshape(0,1), meanDiff);
    cv::Scalar sDiff = cv::sum(meanDiff);
    ASSERT_EQ(sDiff.dot(sDiff), 0.0);
});

alvision.cvtest.TEST('CovariationMatrixVectorOfMatWithMean', 'accuracy',()=>
{
    var col_problem_size = 8, row_problem_size = 8, vector_size = 16;
    cv::Mat src(vector_size, col_problem_size * row_problem_size, CV_32F);
    int singleMatFlags = CV_COVAR_ROWS | CV_COVAR_USE_AVG;

    cv::Mat gold;
    cv::randu(src,cv::Scalar(-128), cv::Scalar(128));
    cv::Mat goldMean;

    cv::reduce(src,goldMean,0 ,CV_REDUCE_AVG, CV_32F);

    cv::calcCovarMatrix(src,gold,goldMean,singleMatFlags,CV_32F);

    std::vector<cv::Mat> srcVec;
    for(size_t i = 0; i < vector_size; i++)
    {
        srcVec.push_back(src.row(static_cast<int>(i)).reshape(0,col_problem_size));
    }

    cv::Mat actual;
    cv::Mat actualMean = goldMean.reshape(0, row_problem_size);
    cv::calcCovarMatrix(srcVec, actual, actualMean,singleMatFlags,CV_32F);

    cv::Mat diff;
    cv::absdiff(gold, actual, diff);
    cv::Scalar s = cv::sum(diff);
    ASSERT_EQ(s.dot(s), 0.0);

    cv::Mat meanDiff;
    cv::absdiff(goldMean, actualMean.reshape(0,1), meanDiff);
    cv::Scalar sDiff = cv::sum(meanDiff);
    ASSERT_EQ(sDiff.dot(sDiff), 0.0);
});

alvision.cvtest.TEST('Core_Pow', 'special',()=>
{
    for( var i = 0; i < 100; i++ )
    {
        var n = alvision.theRNG().uniform(1, 30);
        var mtx0 = new alvision.Mat(1, n, alvision.MatrixType.CV_8S);
        var mtx = new alvision.Mat();
        var result = new alvision.Mat();

        alvision.randu(mtx0, -5, 5);

        var type = alvision.theRNG().uniform(0, 2) ? alvision.MatrixType.CV_64F : alvision.MatrixType.CV_32F;
        var eps = type == alvision.MatrixType.CV_32F ? 1e-3 : 1e-10;
        mtx0.convertTo(mtx, type);
        // generate power from [-n, n] interval with 1/8 step - enough to check various cases.
        const max_pf = 3;

        var pf = alvision.theRNG().uniform(0, max_pf*2+1);
        var power = ((1 << pf.valueOf()) - (1 << (max_pf*2-1)))/16.;
        var ipower = Math.round(power);
        var is_ipower = ipower == power;
        alvision.pow(mtx, power, result);
        for( var j = 0; j < n; j++ )
        {
            var val = type == alvision.MatrixType.CV_32F ? mtx.atGet<alvision.float>("float",j) : mtx.atGet<alvision.double>("double",j);
            var r = type == alvision.MatrixType.CV_32F ? result.atGet<alvision.float>("float",j) : result.atGet<alvision.double>("double",j);
            var r0;
            if( power == 0. )
                r0 = 1;
            else if( is_ipower )
            {
                r0 = 1;
                for( var k = 0; k < Math.abs(ipower); k++ )
                    r0 *= val;
                if( ipower < 0 )
                    r0 = 1./r0;
            }
            else
                r0 = Math.pow(val, power);
            if ( cvIsInf(r0) )
            {
                alvision.ASSERT_TRUE(cvIsInf(r) != 0);
            }
            else if( cvIsNaN(r0) )
            {
                alvision.ASSERT_TRUE(cvIsNaN(r) != 0);
            }
            else
            {
                alvision.ASSERT_TRUE(cvIsInf(r) == 0 && cvIsNaN(r) == 0);
                alvision.ASSERT_LT(fabs(r - r0), eps);
            }
        }
    }
});

/* End of file. */
