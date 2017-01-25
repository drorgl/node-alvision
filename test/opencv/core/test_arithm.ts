import tape = require("tape");
import path = require("path");

import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');


//#include "test_precomp.hpp"
//
//using namespace cv;
//using namespace std;

//namespace cvtest
//{

const  ARITHM_NTESTS = 1000;
const  ARITHM_RNG_SEED = -1;
const  ARITHM_MAX_CHANNELS = 4;
const  ARITHM_MAX_NDIMS = 4;
const  ARITHM_MAX_SIZE_LOG = 10;
    enum BaseElemWiseOpType{ FIX_ALPHA = 1, FIX_BETA = 2, FIX_GAMMA = 4, REAL_GAMMA = 8, SUPPORT_MASK = 16, SCALAR_OUTPUT = 32 };

class BaseElemWiseOp
{
    
    constructor(_ninputs: alvision.int, _flags: alvision.int, _alpha: alvision.double, _beta: alvision.double,
        _gamma: alvision.Scalar = alvision.Scalar.all(0), _context: alvision.int = 1) {
        this.ninputs = (_ninputs);
        this.flags = (_flags);
        this.alpha = (_alpha);
        this.beta = (_beta);
        this.gamma = (_gamma);
        this.context = (_context);
    }
    //conclassor() {
    //    this.flags = 0;
    //    this.alpha = this.beta = 0;
    //    this.gamma = alvision.Scalar.all(0);
    //    this.ninputs = 0;
    //    this.context = 1;
    //}

    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask : alvision.Mat) : void {}
    refop(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void {}
    getValueRange(depth: alvision.int, minval: alvision.double, maxval: alvision.double) : void
    {
        minval = depth < alvision.MatrixType.CV_32S ? alvision.cvtest.getMinVal(depth) : depth == alvision.MatrixType.CV_32S ? -1000000 : -1000.;
        maxval = depth < alvision.MatrixType.CV_32S ? alvision.cvtest.getMaxVal(depth) : depth == alvision.MatrixType.CV_32S ? 1000000 : 1000.;
    }

    getRandomSize(rng: alvision.RNG, size: Array<alvision.int>) : void
    {
        alvision.cvtest.randomSize(rng, 2, ARITHM_MAX_NDIMS, ARITHM_MAX_SIZE_LOG, size);
    }

    getRandomType(rng: alvision.RNG ) : alvision.int
    {
        return alvision.cvtest.randomType(rng, alvision._OutputArrayDepth.DEPTH_MASK_ALL_BUT_8S, 1,
                                  this.ninputs > 1 ? ARITHM_MAX_CHANNELS : 4);
    }

    getMaxErr(depth : alvision.int )  :alvision.double{
        return depth < alvision.MatrixType.CV_32F ? 1 : depth == alvision.MatrixType.CV_32F ? 1e-5 : 1e-12; 
    }
    generateScalars(depth: alvision.int, rng: alvision.RNG): void {
        const m = 3.;

        if (!(this.flags.valueOf() & BaseElemWiseOpType.FIX_ALPHA)) {
            this.alpha = Math.exp(rng.uniform(-0.5, 0.1).valueOf() * m * 2 * Math.LOG2E);
            this.alpha = this.alpha.valueOf() * rng.uniform(0, 2).valueOf() ? 1 : -1;
        }
        if (!(this.flags.valueOf() & BaseElemWiseOpType.FIX_BETA)) {
            this.beta = Math.exp(rng.uniform(-0.5, 0.1).valueOf() * m * 2 * Math.LOG2E);
            this.beta = this.beta.valueOf() * rng.uniform(0, 2).valueOf() ? 1 : -1;
        }

        if (!(this.flags.valueOf() & BaseElemWiseOpType.FIX_GAMMA)) {
            for (var i = 0; i < 4; i++) {
                this.gamma[i] = Math.exp(rng.uniform(-1, 6).valueOf() * m * Math.LOG2E);
                this.gamma[i] *= rng.uniform(0, 2) ? 1 : -1;
            }
            if (this.flags.valueOf() & BaseElemWiseOpType.REAL_GAMMA)
                this.gamma = alvision.Scalar.all(this.gamma[0]);
        }

        if (depth == alvision.MatrixType.CV_32F) {
            var fl = new alvision.Mat(), db = new alvision.Mat();

            db = new alvision.Mat(1, 1, alvision.MatrixType.CV_64F, [this.alpha]);
            db.convertTo(fl, alvision.MatrixType.CV_32F);
            fl.convertTo(db, alvision.MatrixType.CV_64F);

            db = new alvision.Mat(1, 1, alvision.MatrixType.CV_64F, [this.beta]);
            db.convertTo(fl, alvision.MatrixType.CV_32F);
            fl.convertTo(db, alvision.MatrixType.CV_64F);

            db = new alvision.Mat(1, 4, alvision.MatrixType.CV_64F, [this.gamma.val[0]]);
            db.convertTo(fl, alvision.MatrixType.CV_32F);
            fl.convertTo(db, alvision.MatrixType.CV_64F);
        }
    }

    public ninputs: alvision.int;
    public flags: alvision.int;
    protected alpha: alvision.double;
    protected beta: alvision.double;
    protected gamma: alvision.Scalar;
    public context: alvision.int;
};


class BaseAddOp extends BaseElemWiseOp
{
    constructor(_ninputs: alvision.int, _flags: alvision.int, _alpha: alvision.double, _beta: alvision.double, _gamma: alvision.Scalar = alvision.Scalar.all(0)) {
        super(_ninputs, _flags, _alpha, _beta, _gamma);
    }

    reftop(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        var temp = new alvision.Mat();
        if( !mask.empty() )
        {
            alvision.cvtest.add(src[0], this.alpha, src.length > 1 ? src[1] :new alvision. Mat(),this. beta,this. gamma, temp, src[0].type());
            alvision.cvtest.copy(temp, dst, mask);
        }
        else
            alvision.cvtest.add(src[0], this.alpha, src.length > 1 ? src[1] :new alvision. Mat(), this.beta,this. gamma, dst, src[0].type());
    }
};


class AddOp extends BaseAddOp
{
    constructor() {
        super(2, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA + BaseElemWiseOpType.SUPPORT_MASK, 1, 1, alvision.Scalar.all(0))
    }
    
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat ) : void
    {
        if( mask.empty() )
            alvision.add(src[0], src[1], dst);
        else
            alvision.add(src[0], src[1], dst, mask);
    }
};


class SubOp extends BaseAddOp
{
    constructor() {
        super(2, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA + BaseElemWiseOpType.SUPPORT_MASK, 1, -1, alvision.Scalar.all(0)) 
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        if( mask.empty() )
            alvision.subtract(src[0], src[1], dst);
        else
            alvision.subtract(src[0], src[1], dst, mask);
    }
};


class AddSOp extends BaseAddOp
{
    constructor() {
        super(1, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.SUPPORT_MASK, 1, 0, alvision.Scalar.all(0));
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        if( mask.empty() )
            alvision.add(src[0], this.gamma, dst);
        else
            alvision.add(src[0], this.gamma, dst, mask);
    }
};


class SubRSOp extends BaseAddOp
{
    constructor() {
        super(1, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.SUPPORT_MASK, -1, 0, alvision.Scalar.all(0));
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        if( mask.empty() )
            alvision.subtract(this.gamma, src[0], dst);
        else
            alvision.subtract(this.gamma, src[0], dst, mask);
    }
};


class ScaleAddOp extends BaseAddOp
{
    constructor() {
        super(2, BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA, 1, 1, alvision.Scalar.all(0))
    }
    op(src: Array < alvision.Mat >, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.scaleAdd(src[0], this.alpha, src[1], dst);
    }
    getMaxErr(depth: alvision.int ) : alvision.double
    {
        return depth <= alvision.MatrixType.CV_32S ? 2 : depth < alvision.MatrixType. CV_64F ? 1e-4 : 1e-12;
    }
};


class AddWeightedOp extends BaseAddOp
{
    constructor() {
      super(2, BaseElemWiseOpType.REAL_GAMMA, 1, 1, alvision.Scalar.all(0))
    }
    op(src: Array < alvision.Mat >, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.addWeighted(src[0], this.alpha, src[1], this.beta, this.gamma[0], dst);
    }
    getMaxErr(depth: alvision.int) : alvision.double
    {
        return depth <= alvision.MatrixType.CV_32S ? 2 : depth < alvision.MatrixType. CV_64F ? 1e-5 : 1e-10;
    }
};

class MulOp  extends  BaseElemWiseOp
{
    constructor() {
        super(2, BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA, 1, 1, alvision.Scalar.all(0))
    }
    getValueRange(depth : alvision.int, minval:alvision.double, maxval:alvision.double):void
    {
        minval = depth < alvision.MatrixType.CV_32S ? alvision.cvtest.getMinVal(depth) : depth == alvision.MatrixType.CV_32S ? -1000000 : -1000.;
        maxval = depth < alvision.MatrixType.CV_32S ? alvision.cvtest.getMaxVal(depth) : depth == alvision.MatrixType.CV_32S ? 1000000 : 1000.;
        minval = Math.max(minval.valueOf(), -30000.);
        maxval = Math.min(maxval.valueOf(), 30000.);
    }
    op(src: Array < alvision.Mat >, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.multiply(src[0], src[1], dst, this.alpha);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.cvtest.multiply(src[0], src[1], dst, this.alpha);
    }
    getMaxErr(depth: alvision.int) : alvision.double
    {
        return depth <= alvision.MatrixType.CV_32S ? 2 : depth < alvision.MatrixType.CV_64F ? 1e-5 : 1e-12;
    }
};

class DivOp  extends  BaseElemWiseOp
{
    constructor() {
        super(2, BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA, 1, 1, alvision.Scalar.all(0))
    }
    op(src: Array < alvision.Mat >, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.divide(src[0], src[1], dst, this.alpha);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.divide(src[0], src[1], dst, this.alpha);
    }
    getMaxErr(depth: alvision.int) : alvision.double
    {
        return depth <= alvision.MatrixType.CV_32S ? 2 : depth < alvision.MatrixType.CV_64F ? 1e-5 : 1e-12;
    }
};

class RecipOp  extends  BaseElemWiseOp
{
    constructor() {
        super(1, BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA, 1, 1, alvision.Scalar.all(0))
    }

    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.divide(this.alpha, src[0], dst);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.divide(new alvision.Mat(), src[0], dst, this.alpha);
    }
    getMaxErr(depth: alvision.int) : alvision.double
    {
        return depth <= alvision.MatrixType.CV_32S ? 2 : depth < alvision.MatrixType.CV_64F ? 1e-5 : 1e-12;
    }
};

class AbsDiffOp extends BaseAddOp
{
    constructor() {
        super(2, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA, 1, -1, alvision.Scalar.all(0))
    }

    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.absdiff(src[0], src[1], dst);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.cvtest.add(src[0], 1, src[1], -1, alvision.Scalar.all(0), dst, src[0].type(), true);
    }
};

class AbsDiffSOp extends BaseAddOp
{
    constructor() {
        super(1, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA, 1, 0, alvision.Scalar.all(0))
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.absdiff(src[0], this.gamma, dst);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.cvtest.add(src[0], 1, new alvision.Mat(), 0, alvision.Scalar.op_Substraction( this.gamma), dst, src[0].type(), true);
    }
};

class LogicOp  extends  BaseElemWiseOp
{
    constructor(_opcode: alvision.char)
    {
        super(2, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA + BaseElemWiseOpType.SUPPORT_MASK, 1, 1, alvision.Scalar.all(0));
        this.opcode = (_opcode);
    }

    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        if(this. opcode == '&' )
            alvision.bitwise_and(src[0], src[1], dst, mask);
        else if(this. opcode == '|' )
            alvision.bitwise_or(src[0], src[1], dst, mask);
        else
            alvision.bitwise_xor(src[0], src[1], dst, mask);
    }
    reftop(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        var temp = new alvision.Mat();
        if( !mask.empty() )
        {
            alvision.cvtest.logicOp(src[0], src[1], temp, this.opcode);
            alvision.cvtest.copy(temp, dst, mask);
        }
        else
            alvision.cvtest.logicOp(src[0], src[1], dst, this.opcode);
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return 0;
    }
    protected opcode: alvision.char;
};

class LogicSOp  extends  BaseElemWiseOp
{
    constructor(_opcode: alvision.char) {
        super(1, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + (_opcode != '~' ? BaseElemWiseOpType.SUPPORT_MASK : 0), 1, 1, alvision.Scalar.all(0));
        this.opcode = (_opcode);
    }

    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        if( this.opcode == '&' )
            alvision.bitwise_and(src[0], this.gamma, dst, mask);
        else if( this.opcode == '|' )
            alvision.bitwise_or(src[0], this.gamma, dst, mask);
        else if( this.opcode == '^' )
            alvision.bitwise_xor(src[0], this.gamma, dst, mask);
        else
            alvision.bitwise_not(src[0], dst);
    }
    reftop(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        var temp = new alvision.Mat();
        if( !mask.empty() )
        {
            alvision.cvtest.logicOp(src[0], this.gamma, temp, this.opcode);
            alvision.cvtest.copy(temp, dst, mask);
        }
        else
            alvision.cvtest.logicOp(src[0], this.gamma, dst, this.opcode);
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return 0;
    }
    protected opcode: alvision.char;
};

class MinOp  extends  BaseElemWiseOp
{
    constructor() {
        super(2, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA, 1, 1, alvision.Scalar.all(0))
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.min(src[0], src[1], dst);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.min(src[0], src[1], dst);
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return 0;
    }
};

class MaxOp  extends  BaseElemWiseOp
{
    constructor() {
        super(2, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA, 1, 1, alvision.Scalar.all(0))
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.max(src[0], src[1], dst);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.max(src[0], src[1], dst);
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return 0;
    }
};

class MinSOp  extends  BaseElemWiseOp
{
    constructor() {
        super(1, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.REAL_GAMMA, 1, 1, alvision.Scalar.all(0))
    }

    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.min(src[0], this.gamma[0], dst);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.min(src[0], this.gamma[0], dst);
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return 0;
    }
};

class MaxSOp  extends  BaseElemWiseOp
{
    constructor() {
        super(1, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.REAL_GAMMA, 1, 1, alvision.Scalar.all(0))
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.max(src[0], this.gamma[0], dst);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.max(src[0], this.gamma[0], dst);
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return 0;
    }
};

class CmpOp  extends  BaseElemWiseOp
{
    constructor() {
        super(2, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA, 1, 1, alvision.Scalar.all(0));
        this.cmpop = 0;
    }
    generateScalars(depth:alvision.int, rng:alvision.RNG) : void
    {
        super.generateScalars(depth, rng);
        this.cmpop = rng.uniform(0, 6);
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.compare(src[0], src[1], dst,this. cmpop);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.compare(src[0], src[1], dst,this. cmpop);
    }
    getRandomType(rng:alvision.RNG):alvision.int
    {
        return alvision.cvtest.randomType(rng, alvision._OutputArrayDepth.DEPTH_MASK_ALL_BUT_8S, 1, 1);
    }

    getMaxErr(depth: alvision.int):alvision.double
    {
        return 0;
    }
    protected cmpop: alvision.int;
};

class CmpSOp  extends  BaseElemWiseOp
{
    constructor() {
        super(1, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType. REAL_GAMMA, 1, 1, alvision.Scalar.all(0));
        this.cmpop = 0;
    }
    generateScalars(depth:alvision.int, rng:alvision.RNG) : void
    {
        super.generateScalars(depth, rng);
        this.cmpop = rng.uniform(0, 6);
        if( depth < alvision.MatrixType. CV_32F )
            this.gamma[0] = Math.round(this.gamma[0]);
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.compare(src[0], this.gamma[0], dst, this.cmpop);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.compare(src[0], this.gamma[0], dst, this.cmpop);
    }
    getRandomType(rng:alvision.RNG):alvision.int
    {
        return alvision.cvtest.randomType(rng, alvision._OutputArrayDepth.DEPTH_MASK_ALL_BUT_8S, 1, 1);
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return 0;
    }
    protected cmpop: alvision.int;
};


class CopyOp  extends  BaseElemWiseOp
{
    constructor() {
        super(1, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA + BaseElemWiseOpType. SUPPORT_MASK, 1, 1, alvision.Scalar.all(0))
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        src[0].copyTo(dst, mask);
    }
    reftop(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.cvtest.copy(src[0], dst, mask);
    }
    getRandomType(rng:alvision.RNG):alvision.int
    {
        return alvision.cvtest.randomType(rng, alvision._OutputArrayDepth.DEPTH_MASK_ALL, 1, ARITHM_MAX_CHANNELS);
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return 0;
    }
};


class SetOp  extends  BaseElemWiseOp
{
    constructor() {
        super(0, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType. SUPPORT_MASK, 1, 1, alvision.Scalar.all(0));
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        dst.setTo(this.gamma, mask);
    }
    reftop(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.cvtest.set(dst,this. gamma, mask);
    }
    getRandomType(rng:alvision.RNG):alvision.int
    {
        return alvision.cvtest.randomType(rng, alvision._OutputArrayDepth.DEPTH_MASK_ALL, 1, ARITHM_MAX_CHANNELS);
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return 0;
    }
};

//template<typename _Tp, typename _WTp> static void
//    inRangeS_(const _Tp* src, const _WTp* a, const _WTp* b, uchar* dst, size_t total, int cn)
function inRangeS_<T, WT>(src: T, a: WT, b: WT, dst: Array<alvision.uchar>, total: alvision.size_t, cn: alvision.int): void {
        //size_t i;
        //int c;
        for (var i = 0; i < total; i++) {
            var val = src[i * cn.valueOf()];
            dst[i] = (a[0] <= val && val <= b[0]) ? /*uchar*/(255) : 0;
        }
        for (var c = 1; c < cn; c++) {
            for (i = 0; i < total; i++) {
                var val = src[i * cn.valueOf() + c];
                dst[i] = a[c] <= val && val <= b[c] ? dst[i] : 0;
            }
        }
    }

//    template < typename _Tp> static void inRange_(const _Tp* src, const _Tp* a, const _Tp* b, uchar* dst, size_t total, int cn)
function inRange_<T>(src:Array<T>, a : Array<T>, b: Array<T>, dst:Array<T>, total:alvision.size_t, cn : alvision.int) : void
{
    //size_t i;
    //int c;
    for(var i = 0; i < total; i++ )
    {
        var val = src[i*cn.valueOf()];
        dst[i] = <any>(a[i*cn.valueOf()] <= val && val <= b[i*cn.valueOf()] ? 255 : 0);
    }
    for(var c = 1; c < cn; c++ )
    {
        for( i = 0; i < total; i++ )
        {
            var val = src[i*cn.valueOf() + c];
            dst[i] = <T>(a[i*cn.valueOf() + c] <= val && val <= b[i*cn.valueOf() + c] ? dst[i] : 0);
        }
    }
}


function inRange(src: alvision.Mat, lb: alvision.Mat, rb: alvision.Mat, dst: alvision.Mat ) : void
{
    alvision.CV_Assert(()=> src.type() == lb.type() && src.type() == rb.type() &&
              src.size == lb.size && src.size == rb.size );
    dst.create( src.dims, src.size[0],alvision.MatrixType. CV_8U );
    const arrays = [src, lb, rb, dst, 0];
    var planes = new Array < alvision.Mat>(4);

    //NAryMatIterator it(arrays, planes);
    var total = planes[0].total();
    var nplanes = planes.length;
    var depth = src.depth(), cn = src.channels();

    for(var i = 0; i < nplanes; i++ )
    {
        const  sptr = planes[0].ptr<alvision.uchar>("uchar");
        const  aptr = planes[1].ptr<alvision.uchar>("uchar");
        const  bptr = planes[2].ptr<alvision.uchar>("uchar");
        var dptr = planes[3].ptr<alvision.uchar>("uchar");

        switch( depth )
        {
            case alvision.MatrixType.CV_8U:
                inRange_(
                    planes[0].ptr<alvision.uchar>("uchar"),
                    planes[1].ptr<alvision.uchar>("uchar"),
                    planes[2].ptr<alvision.uchar>("uchar"),
                    planes[3].ptr<alvision.uchar>("uchar"), total, cn);
            break;
            case alvision.MatrixType.CV_8S:
                inRange_(
                    planes[0].ptr<alvision.schar>("schar"),
                    planes[1].ptr<alvision.schar>("schar"),
                    planes[2].ptr<alvision.schar>("schar"),
                    planes[3].ptr<alvision.schar>("schar"), total, cn);
            break;
            case alvision.MatrixType.CV_16U:
                inRange_(
                    planes[0].ptr<alvision.ushort>("ushort"),
                    planes[1].ptr<alvision.ushort>("ushort"),
                    planes[2].ptr<alvision.ushort>("ushort"),
                    planes[3].ptr<alvision.ushort>("ushort"), total, cn);
            break;
            case alvision.MatrixType.CV_16S:
                inRange_(
                    planes[0].ptr<alvision.short>("short"),
                    planes[1].ptr<alvision.short>("short"),
                    planes[2].ptr<alvision.short>("short"),
                    planes[3].ptr<alvision.short>("short"), total, cn);
            break;
            case alvision.MatrixType. CV_32S:
                inRange_(
                    planes[0].ptr<alvision.int>("int"),
                    planes[1].ptr<alvision.int>("int"),
                    planes[2].ptr<alvision.int>("int"),
                    planes[3].ptr<alvision.int>("int"), total, cn);
            break;
            case alvision.MatrixType.CV_32F:
                inRange_(
                    planes[0].ptr<alvision.float>("float"),
                    planes[1].ptr<alvision.float>("float"),
                    planes[2].ptr<alvision.float>("float"),
                    planes[3].ptr<alvision.float>("float"), total, cn);
            break;
            case alvision.MatrixType.CV_64F:
                inRange_(
                    planes[0].ptr<alvision.double>("double"),
                    planes[1].ptr<alvision.double>("double"),
                    planes[2].ptr<alvision.double>("double"),
                    planes[3].ptr<alvision.double>("double"), total, cn);
            break;
        default:
            alvision.CV_Error(alvision.cv.Error.Code.StsUnsupportedFormat , "");
        }
    }
}


function inRangeS(src: alvision.Mat, lb: alvision.Scalar, rb: alvision.Scalar, dst: alvision.Mat) : void
{
    dst.create( src.dims, src.size[0], alvision.MatrixType.CV_8U );
    const arrays =[src, dst, 0];
    var planes = new Array<alvision.Mat>(2);

    //TODO: nothing copies the arrays to planes!!
    //NAryMatIterator it(arrays, planes);
    var total = planes[0].total();
    var  nplanes = planes.length//it.nplanes;
    var depth = src.depth(), cn = src.channels();
    //union { double d[4]; float f[4]; int i[4];} lbuf, rbuf;
    var lbuf = new Array<number>();
    var rbuf = new Array<number>();


    var wtype = alvision.MatrixType.CV_MAKETYPE(depth <= alvision.MatrixType.CV_32S ? alvision.MatrixType.CV_32S : depth, cn);
    //alvision.scalarToRawData(lb, lbuf.d, wtype, cn);
    //alvision.scalarToRawData(rb, rbuf.d, wtype, cn);
    alvision.scalarToRawData(lb, lbuf, wtype, cn);
    alvision.scalarToRawData(rb, rbuf, wtype, cn);


    for(var i = 0; i < nplanes; i++)//, ++it )
    {
        //const uchar* sptr = planes[0].ptr();
        //uchar* dptr = planes[1].ptr<alvision.uchar>("uchar");

        switch( depth )
        {
            case alvision.MatrixType.CV_8U:
                inRangeS_(planes[0].ptr<alvision.uchar>("uchar"), lbuf, rbuf, planes[1].ptr<alvision.uchar>("uchar"), total, cn);
            break;
            case alvision.MatrixType.CV_8S:
                inRangeS_(planes[0].ptr<alvision.schar>("schar"), lbuf, rbuf, planes[1].ptr<alvision.schar>("schar"), total, cn);
            break;
            case alvision.MatrixType.CV_16U:
                inRangeS_(planes[0].ptr<alvision.ushort>("ushort"), lbuf, rbuf, planes[1].ptr<alvision.ushort>("ushort"), total, cn);
            break;
            case alvision.MatrixType.CV_16S:
                inRangeS_(planes[0].ptr<alvision.short>("short"), lbuf, rbuf, planes[1].ptr<alvision.short>("short"), total, cn);
            break;
            case alvision.MatrixType.CV_32S:
                inRangeS_(planes[0].ptr<alvision.float>("float"), lbuf, rbuf, planes[1].ptr<alvision.float>("float"), total, cn);
            break;
            case alvision.MatrixType.CV_32F:
                inRangeS_(planes[0].ptr<alvision.float>("float"), lbuf, rbuf, planes[1].ptr<alvision.float>("float"), total, cn);
            break;
            case alvision.MatrixType.CV_64F:
                inRangeS_(planes[0].ptr<alvision.double>("double"), lbuf, rbuf, planes[1].ptr<alvision.double>("double"), total, cn);
            break;
        default:
            alvision.CV_Error(alvision.cv.Error.Code.StsUnsupportedFormat, "");
        }
    }
}


class InRangeSOp extends BaseElemWiseOp {
    constructor() {
        super(1, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA, 1, 1, alvision.Scalar.all(0))
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat): void {
        alvision.inRange(src[0], this.gamma, this.gamma1, dst);
    }
    refop(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat): void {
        inRangeS(src[0], this.gamma, this.gamma1, dst);
    }
    getMaxErr(depth: alvision.int): alvision.double {
        return 0;
    }
    generateScalars(depth: alvision.int, rng: alvision.RNG): void {
        super.generateScalars(depth, rng);
        var temp = this.gamma;
        super.generateScalars(depth, rng);
        for (var i = 0; i < 4; i++) {
            this.gamma1[i] = Math.max(this.gamma[i], temp[i]);
            this.gamma[i] = Math.min(this.gamma[i], temp[i]);
        }
    }

    protected gamma1: alvision.Scalar;
}


class InRangeOp  extends  BaseElemWiseOp
{
    constructor() {
        super(3, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA, 1, 1, alvision.Scalar.all(0))
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        var lb = new alvision.Mat();
        var rb = new alvision.Mat();
        

        alvision.min(src[1], src[2], lb);
        alvision.max(src[1], src[2], rb);

        alvision.inRange(src[0], lb, rb, dst);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        var lb = new alvision.Mat();
        var rb = new alvision.Mat();
        

        alvision.min(src[1], src[2], lb);
        alvision.max(src[1], src[2], rb);

        inRange(src[0], lb, rb, dst);
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return 0;
    }
};


class ConvertScaleOp  extends  BaseElemWiseOp
{
    constructor() {
        super(1, BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType. REAL_GAMMA, 1, 1, alvision.Scalar.all(0));
        this.ddepth = (0);
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        src[0].convertTo(dst, this.ddepth, this.alpha, this.gamma[0]);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.cvtest.convert(src[0], dst,alvision.MatrixType. CV_MAKETYPE(this.ddepth, src[0].channels()), this.alpha, this.gamma[0]);
    }
    getRandomType(rng:alvision.RNG):alvision.int
    {
        var srctype = alvision.cvtest.randomType(rng, alvision._OutputArrayDepth.DEPTH_MASK_ALL, 1, ARITHM_MAX_CHANNELS);
        this.ddepth = alvision.cvtest.randomType(rng, alvision._OutputArrayDepth.DEPTH_MASK_ALL, 1, 1);
        return srctype;
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return this.ddepth <= alvision.MatrixType.CV_32S ? 2 : this.ddepth < alvision.MatrixType.CV_64F ? 1e-3 : 1e-12;
    }
    generateScalars(depth:alvision.int, rng:alvision.RNG) : void
    {
        if( rng.uniform(0, 2) )
            super.generateScalars(depth, rng);
        else
        {
            this.alpha = 1;
            this.gamma = alvision.Scalar.all(0);
        }
    }
    protected ddepth: alvision.int;
};


class ConvertScaleAbsOp  extends  BaseElemWiseOp
{
    constructor() {
        super(1, BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.REAL_GAMMA, 1, 1, alvision.Scalar.all(0))
    }

    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.convertScaleAbs(src[0], dst, this.alpha, this.gamma[0]);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.cvtest.add(src[0], this.alpha, new alvision.Mat(), 0, alvision.Scalar.all(this.gamma[0]), dst, /*CV_8UC*/(src[0].channels()), true);
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return 1;
    }
    generateScalars(depth:alvision.int, rng:alvision.RNG) : void
    {
        if( rng.uniform(0, 2) )
            super.generateScalars(depth, rng);
        else
        {
            this.alpha = 1;
            this.gamma = alvision.Scalar.all(0);
        }
    }
};


function flip(src: alvision.Mat , dst: alvision.Mat, flipcode: alvision.int):void
{
    alvision.CV_Assert(()=>src.dims == 2);
    dst.create(src.size(), src.type());
    //int i, j, k, 
    var esz = src.elemSize();
    var width = src.cols().valueOf() * esz.valueOf();

    for(var i = 0; i < dst.rows(); i++ )
    {
        var sptr = src.ptr<alvision.uchar>("uchar",flipcode == 1 ? i : dst.rows().valueOf() - i - 1);
        var dptr = dst.ptr<alvision.uchar>("uchar",i);
        if (flipcode == 0)
            alvision.arrcopy(dptr, sptr, width);
            //memcpy(dptr, sptr, width);
        else
        {
            for(var j = 0; j < width; j += esz.valueOf() )
                for(var k = 0; k < esz; k++ )
                    dptr[j + k] = sptr[width - j - esz.valueOf() + k];
        }
    }
}


function setIdentity(dst: alvision.Mat, s: alvision.Scalar) : void
{
    alvision.CV_Assert(()=> dst.dims == 2 && dst.channels() <= 4 );
    //double buf[4];
    var buf = new Array<alvision.double>();
    alvision.scalarToRawData(s, buf, dst.type(), 0);
    var esz = dst.elemSize(), width = dst.cols().valueOf()*esz.valueOf();

    for(var i = 0; i < dst.rows(); i++ )
    {
        var dptr = dst.ptr<alvision.uchar>("uchar",i);
        //memset(dptr, 0, width);
        dptr.forEach((v, i, a) => a[i] = 0);
        if( i < dst.cols() )
            for(var k = 0; k < esz; k++ )
                dptr[i*esz.valueOf() + k] = (/*(uchar*)*/buf)[k];
    }
}


class FlipOp  extends  BaseElemWiseOp
{
    constructor() {
        super(1, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType. FIX_GAMMA, 1, 1, alvision.Scalar.all(0));
        this.flipcode = 0;
    }
    getRandomSize(rng:alvision.RNG, size:Array<alvision.int>) : void
    {
        alvision.cvtest.randomSize(rng, 2, 2, ARITHM_MAX_SIZE_LOG, size);
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.flip(src[0], dst, this.flipcode);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        flip(src[0], dst, this.flipcode);
    }
     generateScalars(depth:alvision.int, rng:alvision.RNG) : void
    {
        this.flipcode = rng.uniform(0, 3).valueOf() - 1;
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return 0;
    }
    protected flipcode: alvision.int;
};

class TransposeOp  extends  BaseElemWiseOp
{
    constructor() {
        super(1, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType. FIX_GAMMA, 1, 1, alvision.Scalar.all(0))
    }
    getRandomSize(rng:alvision.RNG, size:Array<alvision.int>) : void
    {
        alvision.cvtest.randomSize(rng, 2, 2, ARITHM_MAX_SIZE_LOG, size);
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.transpose(src[0], dst);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.transpose(src[0], dst);
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return 0;
    }
};

class SetIdentityOp  extends  BaseElemWiseOp
{
    constructor() {
        super(0, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA, 1, 1, alvision.Scalar.all(0))
    }
    getRandomSize(rng:alvision.RNG, size:Array<alvision.int>) : void
    {
        alvision.cvtest.randomSize(rng, 2, 2, ARITHM_MAX_SIZE_LOG, size);
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.setIdentity(dst, this.gamma);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        setIdentity(dst, this.gamma);
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return 0;
    }
};

class SetZeroOp  extends  BaseElemWiseOp
{
    constructor() {
        super(0, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA, 1, 1, alvision.Scalar.all(0))
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        dst.setTo(alvision.Scalar.all(0));
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.cvtest.set(dst, alvision.Scalar.all(0));
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return 0;
    }
};


function exp(src: alvision.Mat, dst: alvision.Mat ) : void
{
    dst.create( src.dims, src.size[0], src.type() );
    const arrays = [src, dst, 0];
    var planes = new Array<alvision.Mat>(2);

    //TODO, nothing copies arrays to planes!!
    //NAryMatIterator it(arrays, planes);
    var  total = planes[0].total().valueOf() *src.channels().valueOf();
    var nplanes = planes.length;//.nplanes;
    var depth = src.depth();

    for (var i = 0; i < nplanes; i++)//, ++it )
    {
        
        

        if( depth ==alvision.MatrixType. CV_32F )
        {
            var dptr = planes[1].ptr<alvision.float>("float");   
            var sptr = planes[0].ptr<alvision.float>("float");
            for(var j = 0; j < total; j++ )
                dptr[j] = Math.exp(sptr[j].valueOf());
        }
        else if( depth ==alvision.MatrixType. CV_64F )
        {
            var dptr = planes[1].ptr<alvision.double>("double");
            var sptr = planes[0].ptr<alvision.double>("double");
            for( j = 0; j < total; j++ )
                dptr[j] = Math.exp(sptr[j].valueOf());
        }
    }
}

function log(src: alvision.Mat, dst: alvision.Mat) : void
{
    dst.create( src.dims, src.size[0], src.type() );
    //const arrays [src, dst, 0];
    var planes = new Array<alvision.Mat>(2);

    //TODO: possible bug, arrays are not copied to planes

    //NAryMatIterator it(arrays, planes);
    //size_t j, 
    var total = planes[0].total().valueOf() * src.channels().valueOf();
    //size_t i, nplanes = it.nplanes;
    var nplanes = planes.length;
    var depth = src.depth();

    for(var i = 0; i < nplanes; i++)
    {
        var sptr = planes[0].ptr<alvision.uchar>("uchar");
        var dptr = planes[1].ptr<alvision.uchar>("uchar");

        if( depth == alvision.MatrixType.CV_32F )
        {
            for(var j = 0; j < total; j++ )
                planes[1].ptr<alvision.float>("float")[j] = Math.log(Math.abs(planes[0].ptr<alvision.float>("float")[j].valueOf()));
        }
        else if( depth == alvision.MatrixType.CV_64F )
        {
            for(var j = 0; j < total; j++ )
                planes[1].ptr<alvision.double>("double")[j] = Math.log(Math.abs(planes[0].ptr<alvision.double>("double")[j].valueOf()));
        }
    }
}

class ExpOp  extends  BaseElemWiseOp
{
    constructor() {
        super(1, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA, 1, 1, alvision.Scalar.all(0))
    }
    getRandomType(rng:alvision.RNG):alvision.int
    {
        return alvision.cvtest.randomType(rng, alvision._OutputArrayDepth.DEPTH_MASK_FLT, 1, ARITHM_MAX_CHANNELS);
    }
    getValueRange(depth : alvision.int, minval:alvision.double, maxval:alvision.double):void
    {
        maxval = depth == alvision.MatrixType.CV_32F ? 50 : 100;
        minval = -maxval;
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.exp(src[0], dst);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        alvision.exp(src[0], dst);
    }
    getMaxErr(depth: alvision.int) : alvision.double
    {
        return depth == alvision.MatrixType.CV_32F ? 1e-5 : 1e-12;
    }
};


class LogOp  extends  BaseElemWiseOp
{
    constructor() {
        super(1, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType. FIX_GAMMA, 1, 1, alvision.Scalar.all(0))

    }
    getRandomType(rng:alvision.RNG):alvision.int
    {
        return alvision.cvtest.randomType(rng, alvision._OutputArrayDepth.DEPTH_MASK_FLT, 1, ARITHM_MAX_CHANNELS);
    }
    getValueRange(depth : alvision.int, minval:alvision.double, maxval:alvision.double):void
    {
        maxval = depth == alvision.MatrixType.CV_32F ? 50 : 100;
        minval = -maxval;
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        var temp = new alvision.Mat();
        alvision.exp(src[0], temp);
        alvision.log(temp, dst);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        var temp = new alvision.Mat();
        alvision.exp(src[0], temp);
        alvision.log(temp, dst);
    }
    getMaxErr(depth: alvision.int) : alvision.double
    {
        return depth == alvision.MatrixType.CV_32F ? 1e-5 : 1e-12;
    }
};


function cartToPolar(mx: alvision.Mat, my: alvision.Mat, mmag: alvision.Mat, mangle: alvision.Mat, angleInDegrees : boolean) : void
{
    alvision.CV_Assert(() => (mx.type() == alvision.MatrixType.CV_32F || mx.type() == alvision.MatrixType.CV_64F) &&
              mx.type() == my.type() && mx.size == my.size );
    mmag.create( mx.dims, mx.size[0], mx.type() );
    mangle.create( mx.dims, mx.size[0], mx.type() );
    const arrays =[mx, my, mmag, mangle, 0]
    var planes = new Array<alvision.Mat>(4);

    //TODO: nothing copies arrays to planes!!
    //NAryMatIterator it(arrays, planes);
    var total = planes[0].total();
    var nplanes = planes.length;//.nplanes;
    var depth = mx.depth();
    var scale = angleInDegrees ? 180/Math.PI : 1;

    for(var i = 0; i < nplanes; i++ )
    {
        if (depth == alvision.MatrixType.CV_32F )
        {
            const  xptr = planes[0].ptr<alvision.float>("float");
            const  yptr = planes[1].ptr<alvision.float>("float");
            var mptr = planes[2].ptr<alvision.float>("float");
            var aptr = planes[3].ptr<alvision.float>("float");

            for(var j = 0; j < total; j++ )
            {
                mptr[j] = Math.sqrt(xptr[j].valueOf() *xptr[j].valueOf() + yptr[j].valueOf() * yptr[j].valueOf());
                var a = Math.atan2(yptr[j].valueOf(), xptr[j].valueOf());
                if( a < 0 ) a += Math.PI*2;
                aptr[j] = (a*scale);
            }
        }
        else
        {
            const  xptr = planes[0].ptr<alvision.double>("double");
            const  yptr = planes[1].ptr<alvision.double>("double");
            var mptr = planes[2].ptr<alvision.double>("double");
            var aptr = planes[3].ptr<alvision.double>("double");

            for(var j = 0; j < total; j++ )
            {
                mptr[j] = Math.sqrt(xptr[j].valueOf() * xptr[j].valueOf() + yptr[j].valueOf() * yptr[j].valueOf());
                var a = Math.atan2(yptr[j].valueOf(), xptr[j].valueOf());
                if( a < 0 ) a += Math.PI*2;
                aptr[j] = a*scale;
            }
        }
    }
}


class CartToPolarToCartOp  extends  BaseElemWiseOp
{
    constructor() {
        super(2, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA, 1, 1, alvision.Scalar.all(0))

        this.context = 3;
        this.angleInDegrees = true;
    }
    getRandomType(rng:alvision.RNG):alvision.int
    {
        return alvision.cvtest.randomType(rng, alvision._OutputArrayDepth.DEPTH_MASK_FLT, 1, 1);
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        var mag     = new alvision.Mat();
        var angle   = new alvision.Mat();
        var x       = new alvision.Mat();
        var y = new alvision.Mat();

        alvision.cartToPolar(src[0], src[1], mag, angle,this. angleInDegrees);
        alvision.polarToCart(mag, angle, x, y,this. angleInDegrees);

        var msrc  = [mag, angle, x, y];
        var pairs = [0, 0, 1, 1, 2, 2, 3, 3];
        dst.create(src[0].dims, src[0].size(), alvision.MatrixType.CV_MAKETYPE(src[0].depth(), 4));
        alvision.mixChannels(msrc, 4, dst, 1, pairs, 4);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        var mag      = new alvision.Mat();
        var angle = new alvision.Mat();
        alvision.cartToPolar(src[0], src[1], mag, angle, this.angleInDegrees);
        var msrc = [mag, angle, src[0], src[1]];
        var pairs = [0, 0, 1, 1, 2, 2, 3, 3];
        dst.create(src[0].dims, src[0].size(), alvision.MatrixType.CV_MAKETYPE(src[0].depth(), 4));
        alvision.mixChannels(msrc, 4, dst, 1, pairs, 4);
    }
     generateScalars(depth:alvision.int, rng:alvision.RNG) : void
    {
        this.angleInDegrees = rng.uniform(0, 2) != 0;
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return 1e-3;
    }
    protected angleInDegrees: boolean;
};


class MeanOp extends BaseElemWiseOp {
    constructor() {
        super(1, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA + BaseElemWiseOpType.SUPPORT_MASK + BaseElemWiseOpType. SCALAR_OUTPUT, 1, 1, alvision.Scalar.all(0))
        this.context = 3;
    };
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat): void {
        dst.create(1, 1, alvision.MatrixType.CV_64FC4);
        dst.at<alvision.Scalar>("Scalar", 0, 0).set(alvision.mean(src[0], mask));
    }
    reftop(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat): void {
        dst.create(1, 1, alvision.MatrixType.CV_64FC4);
        dst.at<alvision.Scalar>("Scalar", 0, 0).set(alvision.cvtest.mean(src[0], mask));
    }
    getMaxErr(depth: alvision.int): alvision.double {
        return 1e-5;
    }
}


class SumOp  extends  BaseElemWiseOp
{
    constructor() {
        super(1, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA + BaseElemWiseOpType. SCALAR_OUTPUT, 1, 1, alvision.Scalar.all(0))
        this.context = 3;
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        dst.create(1, 1, alvision.MatrixType.CV_64FC4);
        dst.at<alvision.Scalar>("Scalar", 0, 0).set(alvision.sum(src[0]));
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        dst.create(1, 1, alvision.MatrixType.CV_64FC4);
        dst.at<alvision.Scalar>("Scalar", 0, 0).set(alvision.Scalar.op_Multiplication(alvision.cvtest.mean(src[0]), src[0].total()));;
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return 1e-5;
    }
};


class CountNonZeroOp  extends  BaseElemWiseOp
{
    constructor() {
        super(1, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA + BaseElemWiseOpType.SCALAR_OUTPUT + BaseElemWiseOpType.SUPPORT_MASK, 1, 1, alvision.Scalar.all(0))
    }
    getRandomType(rng:alvision.RNG):alvision.int
    {
        return alvision.cvtest.randomType(rng, alvision._OutputArrayDepth.DEPTH_MASK_ALL, 1, 1);
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        var temp = new alvision.Mat();
        src[0].copyTo(temp);
        if( !mask.empty() )
            temp.setTo(alvision.Scalar.all(0), mask);
        dst.create(1, 1, alvision.MatrixType.CV_32S);
        dst.at<alvision.int>("int", 0, 0).set(alvision.countNonZero(temp));
    }
    reftop(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        var temp = new alvision.Mat();
        alvision.compare(src[0], 0, temp,alvision.CmpTypes.CMP_NE);
        if( !mask.empty() )
            alvision.cvtest.set(temp, alvision.Scalar.all(0), mask);
        dst.create(1, 1, alvision.MatrixType.CV_32S);
        dst.at<alvision.int>("int", 0,0).set( alvision.saturate_cast<alvision.int>(alvision.cvtest.mean(temp)[0]/255*temp.total().valueOf(),"int"));
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return 0;
    }
};


class MeanStdDevOp  extends  BaseElemWiseOp
{
    protected sqmeanRef: alvision.Scalar;
    protected cn: alvision.int;

    constructor() {
        super(1, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA + BaseElemWiseOpType.SUPPORT_MASK + BaseElemWiseOpType. SCALAR_OUTPUT, 1, 1, alvision.Scalar.all(0))
        this.cn = 0;
        this.context = 7;
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        dst.create(1, 2, alvision.MatrixType. CV_64FC4);
        alvision.meanStdDev(src[0], dst.at<alvision.Scalar>("Scalar",0,0).get(), dst.at<alvision.Scalar>("Scalar",0,1).get(), mask);
    }
    reftop(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        var temp = new alvision.Mat();
        alvision.cvtest.convert(src[0], temp,alvision.MatrixType. CV_64F);
        alvision.cvtest.multiply(temp, temp, temp);
        var mean = alvision.cvtest.mean(src[0], mask);
        var sqmean = alvision.cvtest.mean(temp, mask);

        this.sqmeanRef = sqmean;
        this.cn = temp.channels();

        for( var c = 0; c < 4; c++ )
            sqmean[c] = Math.sqrt(Math.max(sqmean[c] - mean[c]*mean[c], 0.));

        dst.create(1, 2, alvision.MatrixType.CV_64FC4);
        dst.at<alvision.Scalar>("Scalar", 0, 0).set(mean);
        dst.at<alvision.Scalar>("Scalar", 0, 1).set(sqmean);
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        alvision.CV_Assert(()=>this.cn > 0);
        var err = this.sqmeanRef[0];
        for(var i = 1; i < this.cn; ++i)
            err = Math.max(err, this.sqmeanRef[i]);
        return 3e-7 * err;
    }
};


class NormOp  extends  BaseElemWiseOp
{
    constructor() {
        super(2, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA + BaseElemWiseOpType.SUPPORT_MASK + BaseElemWiseOpType.SCALAR_OUTPUT, 1, 1, alvision.Scalar.all(0))
        this.context = 1;
        this.normType = 0;
    }
    getRandomType(rng:alvision.RNG):alvision.int
    {
        var type = alvision.cvtest.randomType(rng, alvision._OutputArrayDepth.DEPTH_MASK_ALL_BUT_8S, 1, 4);
        for(;;)
        {
            this.normType = <alvision.NormTypes>rng.uniform(1, 8);
            if( this.normType == alvision.NormTypes.NORM_INF ||     this.normType == alvision.NormTypes.NORM_L1 ||
                this.normType == alvision.NormTypes.NORM_L2 ||      this.normType == alvision.NormTypes.NORM_L2SQR ||
                this.normType == alvision.NormTypes.NORM_HAMMING || this.normType == alvision.NormTypes.NORM_HAMMING2 )
                break;
        }
        if( this.normType == alvision.NormTypes.NORM_HAMMING || this.normType == alvision.NormTypes.NORM_HAMMING2 )
        {
            type = alvision.MatrixType.CV_8U;
        }
        return type;
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        dst.create(1, 2, alvision.MatrixType.CV_64FC1);
        dst.at<alvision.double>("double",0,0).set( alvision.norm(src[0], this.normType, mask));
        dst.at<alvision.double>("double",0,1).set( alvision.norm(src[0], src[1], this.normType, mask));
    }
    reftop(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        dst.create(1, 2, alvision.MatrixType.CV_64FC1);
        dst.at<alvision.double>("double", 0, 0).set(alvision.cvtest.norm(src[0], this.normType, mask));
        dst.at<alvision.double>("double", 0, 1).set(alvision.cvtest.norm(src[0], src[1], this.normType, mask));
    }
    generateScalars(depth:alvision.int, rng:alvision.RNG) : void
    {
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return 1e-6;
    }
    protected normType: alvision.NormTypes;
}


class MinMaxLocOp extends BaseElemWiseOp {
    constructor() {

        super(1, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA + BaseElemWiseOpType.SUPPORT_MASK + BaseElemWiseOpType.SCALAR_OUTPUT, 1, 1, alvision.Scalar.all(0));
        this.context = ARITHM_MAX_NDIMS * 2 + 2;
    }
    getRandomType(rng: alvision.RNG): alvision.int {
        return alvision.cvtest.randomType(rng, alvision._OutputArrayDepth.DEPTH_MASK_ALL_BUT_8S, 1, 1);
    }
    saveOutput(minidx: Array<alvision.int>, maxidx: Array<alvision.int>,
        minval: alvision.double, maxval: alvision.double, dst: alvision.Mat): void {
        var ndims = minidx.length;
        dst.create(1, ndims * 2 + 2, alvision.MatrixType.CV_64FC1);

        for (var i = 0; i < ndims; i++) {
            dst.at<alvision.double>("double", 0, i).set(minidx[i]);
            dst.at<alvision.double>("double", 0, i + ndims).set(maxidx[i]);
        }
        dst.at<alvision.double>("double", 0, ndims * 2).set(minval);
        dst.at<alvision.double>("double", 0, ndims * 2 + 1).set(maxval);
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat): void {
        var ndims = src[0].dims;
        var minidx = new Array<alvision.int>(ndims), maxidx = new Array<alvision.int>(ndims);
        var minval = 0, maxval = 0;
        alvision.minMaxIdx(src[0], (minVal_, maxVal_, minIdx_, maxIdx_) => { minval = minVal_.valueOf(); maxval = maxVal_.valueOf(); minidx = minIdx_; maxidx = maxIdx_; }, mask);
        this.saveOutput(minidx, maxidx, minval, maxval, dst);
    }
    reftop(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat): void {
        var ndims = src[0].dims;
        var minidx = new Array<alvision.int>(ndims), maxidx = new Array<alvision.int>(ndims);
        var minval = 0, maxval = 0;
        alvision.minMaxLoc(src[0], (minVal_, maxVal_, minIdx_, maxIdx_) => { minval = minVal_.valueOf(); maxval = maxVal_.valueOf(); minidx = [minIdx_[0].x, minIdx_[1].y]; maxidx = [maxIdx_[0].x, maxIdx_[1].y]; }, mask);
        this.saveOutput(minidx, maxidx, minval, maxval, dst);
    }
    getMaxErr(depth: alvision.int): alvision.double {
        return 0;
    }
}


//}

//typedef Ptr<alvision.cvtest.BaseElemWiseOp> ElemWiseOpPtr;
class ElemWiseTest_accuracy extends alvision.cvtest.TestWithParam// ::testing::TestWithParam<ElemWiseOpPtr> { };
{
    public TestBody(): void {
        var op = this.GET_PARAM<BaseElemWiseOp>(0);// GetParam();

        var testIdx = 0;
        var rng = new alvision.RNG(ARITHM_RNG_SEED);
        for (testIdx = 0; testIdx < ARITHM_NTESTS; testIdx++) {
            var size = new Array<alvision.int>();
            op.getRandomSize(rng, size);
            var type = op.getRandomType(rng);
            var depth = alvision.MatrixType.CV_MAT_DEPTH(type);
            var haveMask = (op.flags.valueOf() & BaseElemWiseOpType.SUPPORT_MASK) != 0 && rng.uniform(0, 4) == 0;

            var minval= 0, maxval = 0;
            op.getValueRange(depth, minval, maxval);
            var ninputs = op.ninputs;
            var src = new Array<alvision.Mat>(ninputs.valueOf());
            for (var i = 0; i < ninputs; i++)
                src[i] = alvision.cvtest.randomMat(rng, size, type, minval, maxval, true);
            var dst0 = new alvision.Mat();
            var dst  = new alvision.Mat();
            var mask = new alvision.Mat();
            if (haveMask)
                mask = alvision.cvtest.randomMat(rng, size, alvision.MatrixType.CV_8U, 0, 2, true);

            if ((haveMask || ninputs == 0) && !(op.flags.valueOf() & BaseElemWiseOpType.SCALAR_OUTPUT))
            {
                dst0 = alvision.cvtest.randomMat(rng, size, type, minval, maxval, false);
                dst = alvision.cvtest.randomMat(rng, size, type, minval, maxval, true);
                alvision.cvtest.copy(dst, dst0);
            }
            op.generateScalars(depth, rng);

            op.refop(src, dst0, mask);
            op.op(src, dst, mask);

            var maxErr = op.getMaxErr(depth);
            alvision.cvtest.ASSERT_PRED_FORMAT2((new alvision.cvtest.MatComparator(maxErr, op.context)).run( dst0, dst),  "\nsrc[0] ~ " +
                alvision.cvtest.MatInfo(!src.length ? src[0] : new alvision.Mat()) + "\ntestCase #" + testIdx  + "\n");
        }
    }
}



alvision.cvtest.TEST_P('ElemWiseTest', 'accuracy', () => { var test = new ElemWiseTest_accuracy(); test.TestBody();});


alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_Copy', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new CopyOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_Set', 'ElemWiseTest', (caseName, testName) => { return null; },new alvision.cvtest.Combine([[new SetOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_SetZero', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new SetZeroOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_ConvertScale', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new ConvertScaleOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_ConvertScaleAbs', 'ElemWiseTest', (caseName, testName) => { return null;}, new alvision.cvtest.Combine([[new ConvertScaleAbsOp()]]));

alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_Add',         'ElemWiseTest',(caseName, testName) => {return null; },new alvision.cvtest.Combine([[new AddOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_Sub',         'ElemWiseTest',(caseName, testName) => {return null; },new alvision.cvtest.Combine([[new SubOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_AddS',        'ElemWiseTest',(caseName, testName) => {return null; },new alvision.cvtest.Combine([[new AddSOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_SubRS',       'ElemWiseTest',(caseName, testName) => {return null; },new alvision.cvtest.Combine([[new SubRSOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_ScaleAdd',    'ElemWiseTest',(caseName, testName) => {return null; },new alvision.cvtest.Combine([[new ScaleAddOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_AddWeighted', 'ElemWiseTest',(caseName, testName) => {return null; },new alvision.cvtest.Combine([[new AddWeightedOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_AbsDiff', 'ElemWiseTest', (caseName, testName) => { return null; },new alvision.cvtest.Combine([[new AbsDiffOp()]]));


alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_AbsDiffS', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new AbsDiffSOp()]]));

alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_And', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new LogicOp('&')]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_AndS', 'ElemWiseTest', (caseName, testName) => { return null;}, new alvision.cvtest.Combine([[new LogicSOp('&')]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_Or', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new LogicOp('|')]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_OrS', 'ElemWiseTest', (caseName, testName) => { return null;}, new alvision.cvtest.Combine([[new LogicSOp('|')]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_Xor', 'ElemWiseTest', (caseName, testName) => { return null;}, new alvision.cvtest.Combine([[new LogicOp('^')]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_XorS', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new LogicSOp('^')]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_Not', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new LogicSOp('~')]]));

alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_Max', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new MaxOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_MaxS', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new MaxSOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_Min', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new MinOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_MinS', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new MinSOp()]]));

alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_Mul', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new MulOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_Div', 'ElemWiseTest', (caseName, testName) => { return null;}, new alvision.cvtest.Combine([[new DivOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_Recip', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new RecipOp()]]));

alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_Cmp', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new CmpOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_CmpS', 'ElemWiseTest', (caseName, testName) => { return null;}, new alvision.cvtest.Combine([[new CmpSOp()]]));

alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_InRangeS', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new InRangeSOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_InRange', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new InRangeOp()]]));

alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_Flip', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new FlipOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_Transpose', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new TransposeOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_SetIdentity', 'ElemWiseTest', (caseName, testName) => { return null;}, new alvision.cvtest.Combine([[new SetIdentityOp()]]));

alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_Exp', 'ElemWiseTest', (caseName, testName) => { return null;}, new alvision.cvtest.Combine([[new ExpOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_Log', 'ElemWiseTest', (caseName, testName) => { return null;}, new alvision.cvtest.Combine([[new LogOp()]]));

alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_CountNonZero', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new CountNonZeroOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_Mean', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new MeanOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_MeanStdDev', 'ElemWiseTest', (caseName, testName) => { return null;}, new alvision.cvtest.Combine([[new MeanStdDevOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_Sum', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new SumOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_Norm', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new NormOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_MinMaxLoc', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new MinMaxLocOp()]]));
alvision.cvtest.INSTANTIATE_TEST_CASE_P('Core_CartToPolarToCart', 'ElemWiseTest', (caseName, testName) => { return null; }, new alvision.cvtest.Combine([[new CartToPolarToCartOp()]]));


class CV_ArithmMaskTest  extends alvision.cvtest.BaseTest
{
    constructor() {
        super();
    }
    run(iii: alvision.int) : void
    {
        try
        {
            var rng = alvision.theRNG();
            const  MAX_DIM=3;
            var sizes = new Array<alvision.int>(MAX_DIM);
            for( var iter = 0; iter < 100; iter++ )
            {
                //ts.printf(alvision.cvtest.TSConstants.LOG, ".");

                this.ts.update_context(this, iter, true);
                var  dims = rng.uniform(1, MAX_DIM+1), p = 1;
                var depth = rng.uniform(alvision.MatrixType.CV_8U, alvision.MatrixType.CV_64F+1);
                var cn = rng.uniform(1, 6);
                var type = alvision.MatrixType.CV_MAKETYPE(depth, cn);
                var op = rng.uniform(0, 5);
                var depth1 = op <= 1 ? alvision.MatrixType.CV_64F : depth;
                for(var k = 0; k < dims; k++ )
                {
                    sizes[k] = rng.uniform(1, 30);
                    p *= sizes[k].valueOf();
                }
                var a = new alvision.Mat(dims, sizes, type), a1 = new alvision.Mat();
                var b = new alvision.Mat(dims, sizes, type), b1 = new alvision.Mat();
                var mask = new alvision.Mat(dims, sizes, alvision.MatrixType.CV_8U);
                var mask1 = new alvision.Mat ();
                var c = new alvision.Mat (), d = new alvision.Mat();

                rng.fill(a, alvision.DistType.UNIFORM, 0, 100);
                rng.fill(b, alvision.DistType.UNIFORM, 0, 100);

                // [-2,2) range means that the each generated random number
                // will be one of -2, -1, 0, 1. Saturated to [0,255], it will become
                // 0, 0, 0, 1 => the mask will be filled by ~25%.
                rng.fill(mask, alvision.DistType.UNIFORM, -2, 2);

                a.convertTo(a1, depth1);
                b.convertTo(b1, depth1);
                // invert the mask
                alvision.compare(mask, 0, mask1,alvision.CmpTypes. CMP_EQ);
                a1.setTo(0, mask1);
                b1.setTo(0, mask1);

                if( op == 0 )
                {
                    alvision.add(a, b, c, mask);
                    alvision.add(a1, b1, d);
                }
                else if( op == 1 )
                {
                    alvision.subtract(a, b, c, mask);
                    alvision.subtract(a1, b1, d);
                }
                else if( op == 2 )
                {
                    alvision.bitwise_and(a, b, c, mask);
                    alvision.bitwise_and(a1, b1, d);
                }
                else if( op == 3 )
                {
                    alvision.bitwise_or(a, b, c, mask);
                    alvision.bitwise_or(a1, b1, d);
                }
                else if( op == 4 )
                {
                    alvision.bitwise_xor(a, b, c, mask);
                    alvision.bitwise_xor(a1, b1, d);
                }
                var d1 = new alvision.Mat();
                d.convertTo(d1, depth);
                alvision.CV_Assert(()=> alvision.cvtest.norm(c, d1,alvision.NormTypes.NORM_INF) <= alvision.DBL_EPSILON );
            }

            var tmpSrc = new alvision.Mat1b (100,100);
            tmpSrc.setTo( 124);
            var tmpMask = new alvision.Mat1b(100,100);
            tmpMask.setTo(255);
            var tmpDst = new alvision.Mat1b(100,100);
            tmpDst.setTo(2);
            tmpSrc.copyTo(tmpDst,tmpMask);
        }
        catch(e)
        {
           this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
        }
    }
};

alvision.cvtest.TEST('Core_ArithmMask', 'uninitialized', () => { var test = new CV_ArithmMaskTest(); test.safe_run(); });

alvision.cvtest.TEST('Multiply', 'FloatingPointRounding', () => {
    var src = new alvision.Mat(1, 1, alvision.MatrixType.CV_8UC1, alvision.Scalar.all(110)), dst = new alvision.Mat();
    var s = new alvision.Scalar(147.286359696927, 1, 1, 1);

    alvision.multiply(src, s, dst, 1, alvision.MatrixType.CV_16U);
    // with CV_32F this produce result 16202
    alvision.ASSERT_EQ(dst.at<alvision.ushort>("ushort", 0, 0), 16201);
});

alvision.cvtest.TEST('Core_Add', 'AddToColumnWhen3Rows', () => {
    var m1 = new alvision.Mat(new alvision.Mat1d(3, 2,[ 1, 2, 3, 4, 5, 6]));
    // m1.col(1) += 10;
    alvision.MatExpr.op_Addition(m1.col(1), 10).toMat().copyTo(m1.col(1));

    var m2 = new alvision.Mat(new alvision.Mat1d(3, 2,[ 1, 12, 3, 14, 5, 16]));

    alvision.ASSERT_EQ(0, alvision.countNonZero(alvision.MatExpr.op_Substraction( m1 , m2).toMat()));
});

alvision.cvtest.TEST('Core_Add', 'AddToColumnWhen4Rows', () => {
    var m1 = new alvision.Mat(new alvision.Mat1d(4, 2,[ 1, 2, 3, 4, 5, 6, 7, 8]));
    //m1.col(1) += 10;
    alvision.MatExpr.op_Addition(m1.col(1), 10).toMat().copyTo(m1.col(1));

    var m2 = new alvision.Mat (new alvision.Mat1d(4, 2,[ 1, 12, 3, 14, 5, 16, 7, 18]));

    alvision.ASSERT_EQ(0, alvision.countNonZero(alvision.MatExpr.op_Substraction( m1 , m2).toMat()));
});

alvision.cvtest.TEST('Core_round', 'Math.round', () => {
    alvision.ASSERT_EQ(2, Math.round(2.0));
    alvision.ASSERT_EQ(2, Math.round(2.1));
    alvision.ASSERT_EQ(-2, Math.round(-2.1));
    alvision.ASSERT_EQ(3, Math.round(2.8));
    alvision.ASSERT_EQ(-3, Math.round(-2.8));
    alvision.ASSERT_EQ(2, Math.round(2.5));
    alvision.ASSERT_EQ(4, Math.round(3.5));
    alvision.ASSERT_EQ(-2, Math.round(-2.5));
    alvision.ASSERT_EQ(-4, Math.round(-3.5));
});


//typedef testing::TestWithParam<Size> Mul1;

class Mul1 extends alvision.cvtest.TestWithParam {
    public TestBody(): void {
        var size = this.GET_PARAM<alvision.Size>(0);
        var src = new alvision.Mat(size, alvision.MatrixType.CV_32FC1, alvision.Scalar.all(2)), dst = new alvision.Mat (),
            ref_dst = new alvision.Mat (size, alvision.MatrixType.CV_32FC1, alvision.Scalar.all(6));

        alvision.multiply(3, src, dst);

        alvision.ASSERT_EQ(0, alvision.cvtest.norm(dst, ref_dst, alvision.NormTypes.NORM_INF));
    }
}

alvision.cvtest.TEST_P('Mul1', 'One', () => { var test = new Mul1(); test.TestBody();});

alvision.cvtest.INSTANTIATE_TEST_CASE_P('Arithm','Mul1',(caseName,name)=>new Mul1(),new alvision.cvtest.Combine([ [new alvision.Size(2, 2), new alvision.Size(1, 1)]]));

class SubtractOutputMatNotEmpty  extends alvision.cvtest.TestWithParam// testing::TestWithParam< std::tr1::tuple<alvision.Size, perf::MatType, perf::MatDepth, bool> >
{
    public size: alvision.Size;
    public src_type: alvision.int;
    public dst_depth: alvision.int ;
    public fixed: boolean;

    SetUp() : void
    {
        this.size = this.GET_PARAM<alvision.Size>(0);//std::tr1::get<0>(GetParam());
        this.src_type   = this.GET_PARAM<alvision.int>(1);//std::tr1::get<1>(GetParam());
        this.dst_depth  = this.GET_PARAM<alvision.int>(2);//std::tr1::get<2>(GetParam());
        this.fixed      = this.GET_PARAM<boolean>(3);//std::tr1::get<3>(GetParam());
    }
};

class SubtractOutputMatNotEmpty_Mat_Mat extends SubtractOutputMatNotEmpty {
    
    public TestBody(): void {
        var src1 = new alvision.Mat(this.size, this.src_type, alvision.Scalar.all(16));
        var src2 = new alvision.Mat(this.size, this.src_type, alvision.Scalar.all(16));

        var dst = new alvision.Mat();

        if (!this.fixed) {
            alvision.subtract(src1, src2, dst, null, this.dst_depth);
        }
        else {
            const fixed_dst = new alvision.Mat(this.size, alvision.MatrixType.CV_MAKETYPE((this.dst_depth > 0 ? this.dst_depth : alvision.MatrixType.CV_16S), src1.channels()));
            alvision.subtract(src1, src2, fixed_dst, null, this.dst_depth);
            dst = fixed_dst;
            this.dst_depth = fixed_dst.depth();
        }

        alvision.ASSERT_FALSE(dst.empty());
        alvision.ASSERT_EQ(src1.size(), dst.size());
        alvision.ASSERT_EQ(this.dst_depth > 0 ? this.dst_depth : src1.depth(), dst.depth());
        alvision.ASSERT_EQ(0, alvision.countNonZero(dst.reshape(1)));
    }
}


alvision.cvtest.TEST_P('SubtractOutputMatNotEmpty', 'Mat_Mat', () => {var test = new SubtractOutputMatNotEmpty_Mat_Mat(); test.TestBody()});

class SubtractOutputMatNotEmpty_Mat_Mat_WithMask extends SubtractOutputMatNotEmpty {
    public TestBody(): void {
        var src1 = new alvision.Mat(this.size, this.src_type, alvision.Scalar.all(16));
        var src2 = new alvision.Mat(this.size, this.src_type, alvision.Scalar.all(16));
        var mask = new alvision.Mat(this.size, alvision.MatrixType.CV_8UC1, alvision.Scalar.all(255));

        var dst = new alvision.Mat();

        if (!this.fixed) {
            alvision.subtract(src1, src2, dst, mask,this. dst_depth);
        }
        else {
            const fixed_dst = new alvision.Mat (this.size, alvision.MatrixType.CV_MAKETYPE((this.dst_depth > 0 ? this.dst_depth : alvision.MatrixType.CV_16S), src1.channels()));
            alvision.subtract(src1, src2, fixed_dst, mask, this.dst_depth);
            dst = fixed_dst;
            this.dst_depth = fixed_dst.depth();
        }

        alvision.ASSERT_FALSE(dst.empty());
        alvision.ASSERT_EQ(src1.size(), dst.size());
        alvision.ASSERT_EQ(this.dst_depth > 0 ? this.dst_depth : src1.depth(), dst.depth());
        alvision.ASSERT_EQ(0, alvision.countNonZero(dst.reshape(1)));
    }
}
alvision.cvtest.TEST_P('SubtractOutputMatNotEmpty', 'Mat_Mat_WithMask', () => { var test = new SubtractOutputMatNotEmpty_Mat_Mat_WithMask(); test.TestBody(); });


class SubtractOutputMatNotEmpty_Mat_Mat_Expr extends SubtractOutputMatNotEmpty {
    public TestBody(): void {
        var src1 = new alvision.Mat(this.size, this.src_type, alvision.Scalar.all(16));
        var src2 = new alvision.Mat(this.size, this.src_type, alvision.Scalar.all(16));

        var dst = alvision.MatExpr.op_Substraction(src1, src2).toMat();

        alvision.ASSERT_FALSE(dst.empty());
        alvision.ASSERT_EQ(src1.size(), dst.size());
        alvision.ASSERT_EQ(src1.depth(), dst.depth());
        alvision.ASSERT_EQ(0, alvision.countNonZero(dst.reshape(1)));
    }
}
alvision.cvtest.TEST_P('SubtractOutputMatNotEmpty', 'Mat_Mat_Expr', () => { var test = new SubtractOutputMatNotEmpty_Mat_Mat_Expr(); test.TestBody();});


class SubtractOutputMatNotEmpty_Mat_Scalar extends SubtractOutputMatNotEmpty {
    public TestBody(): void {
        var src = new alvision.Mat(this.size, this.src_type, alvision.Scalar.all(16));

        var dst = new alvision.Mat();

        if (!this.fixed) {
            alvision.subtract(src, alvision.Scalar.all(16), dst, null, this.dst_depth);
        }
        else {
            const fixed_dst = new alvision.Mat(this.size, alvision.MatrixType.CV_MAKETYPE((this.dst_depth > 0 ? this.dst_depth : alvision.MatrixType.CV_16S), src.channels()));
            alvision.subtract(src, alvision.Scalar.all(16), fixed_dst, null, this.dst_depth);
            dst = fixed_dst;
            this.dst_depth = fixed_dst.depth();
        }

        alvision.ASSERT_FALSE(dst.empty());
        alvision.ASSERT_EQ(src.size(), dst.size());
        alvision.ASSERT_EQ(this.dst_depth > 0 ? this.dst_depth : src.depth(), dst.depth());
        alvision.ASSERT_EQ(0, alvision.countNonZero(dst.reshape(1)));
    }
}

alvision.cvtest.TEST_P('SubtractOutputMatNotEmpty', 'Mat_Scalar', () => { var test = new SubtractOutputMatNotEmpty_Mat_Scalar(); test.TestBody();});


class SubtractOutputMatNotEmpty_Mat_Scalar_WithMask extends SubtractOutputMatNotEmpty {
    public TestBody(): void {
        var src  = new alvision.Mat(this.size, this.src_type, alvision.Scalar.all(16));
        var mask = new alvision.Mat(this.size,alvision.MatrixType. CV_8UC1, alvision.Scalar.all(255));

        var dst = new alvision.Mat();

        if (!this.fixed) {
            alvision.subtract(src, alvision.Scalar.all(16), dst, mask,this. dst_depth);
        }
        else {
            const fixed_dst = new alvision.Mat (this.size, alvision.MatrixType.CV_MAKETYPE((this.dst_depth > 0 ? this.dst_depth : alvision.MatrixType.CV_16S), src.channels()));
            alvision.subtract(src, alvision.Scalar.all(16), fixed_dst, mask, this.dst_depth);
            dst = fixed_dst;
            this.dst_depth = fixed_dst.depth();
        }

        alvision.ASSERT_FALSE(dst.empty());
        alvision.ASSERT_EQ(src.size(), dst.size());
        alvision.ASSERT_EQ(this.dst_depth > 0 ? this.dst_depth : src.depth(), dst.depth());
        alvision.ASSERT_EQ(0, alvision.countNonZero(dst.reshape(1)));
    }
}

alvision.cvtest.TEST_P('SubtractOutputMatNotEmpty', 'Mat_Scalar_WithMask', () => { var test = new SubtractOutputMatNotEmpty_Mat_Scalar_WithMask(); test.TestBody(); });

class SubtractOutputMatNotEmpty_Scalar_Mat extends SubtractOutputMatNotEmpty {
    public TestBody(): void {
        var src = new alvision.Mat(this.size, this.src_type, alvision.Scalar.all(16));

        var dst = new alvision.Mat();

        if (!this.fixed) {
            alvision.subtract(alvision.Scalar.all(16), src, dst, null, this.dst_depth);
        }
        else {
            const fixed_dst = new alvision.Mat (this.size, alvision.MatrixType.CV_MAKETYPE((this.dst_depth > 0 ? this.dst_depth : alvision.MatrixType.CV_16S), src.channels()));
            alvision.subtract(alvision.Scalar.all(16), src, fixed_dst, null, this.dst_depth);
            dst = fixed_dst;
            this.dst_depth = fixed_dst.depth();
        }

        alvision.ASSERT_FALSE(dst.empty());
        alvision.ASSERT_EQ(src.size(), dst.size());
        alvision.ASSERT_EQ(this.dst_depth > 0 ? this.dst_depth : src.depth(), dst.depth());
        alvision.ASSERT_EQ(0, alvision.countNonZero(dst.reshape(1)));
    }
}

alvision.cvtest.TEST_P('SubtractOutputMatNotEmpty', 'Scalar_Mat', () => { var test = new SubtractOutputMatNotEmpty_Scalar_Mat(); test.TestBody(); });

class SubtractOutputMatNotEmpty_Scalar_Mat_WithMask extends SubtractOutputMatNotEmpty {
    public TestBody(): void {
        var src  = new alvision.Mat(this.size, this.src_type, alvision.Scalar.all(16));
        var mask = new alvision.Mat(this.size, alvision.MatrixType.CV_8UC1, alvision.Scalar.all(255));

        var dst = new alvision.Mat();

        if (!this.fixed) {
            alvision.subtract(alvision.Scalar.all(16), src, dst, mask, this.dst_depth);
        }
        else {
            const fixed_dst = new alvision.Mat (this.size, alvision.MatrixType.CV_MAKETYPE((this.dst_depth > 0 ? this.dst_depth : alvision.MatrixType.CV_16S), src.channels()));
            alvision.subtract(alvision.Scalar.all(16), src, fixed_dst, mask, this.dst_depth);
            dst = fixed_dst;
            this.dst_depth = fixed_dst.depth();
        }

        alvision.ASSERT_FALSE(dst.empty());
        alvision.ASSERT_EQ(src.size(), dst.size());
        alvision.ASSERT_EQ(this.dst_depth > 0 ? this.dst_depth : src.depth(), dst.depth());
        alvision.ASSERT_EQ(0, alvision.countNonZero(dst.reshape(1)));
    }
}

alvision.cvtest.TEST_P('SubtractOutputMatNotEmpty', 'Scalar_Mat_WithMask', () => { var test = new SubtractOutputMatNotEmpty_Scalar_Mat_WithMask(); test.TestBody(); });

class SubtractOutputMatNotEmpty_Mat_Mat_3d extends SubtractOutputMatNotEmpty {
    public TestBody(): void {
        var dims : Array<alvision.int> = [5, this.size.height, this.size.width];

        var src1 = new alvision.Mat(3, dims, this.src_type, alvision.Scalar.all(16));
        var src2 = new alvision.Mat(3, dims, this.src_type, alvision.Scalar.all(16));

        var dst = new alvision.Mat();

        if (!this.fixed) {
            alvision.subtract(src1, src2, dst, null, this.dst_depth);
        }
        else {
            const fixed_dst =new alvision.Mat (3, dims, alvision.MatrixType.CV_MAKETYPE((this.dst_depth > 0 ? this.dst_depth : alvision.MatrixType.CV_16S), src1.channels()));
            alvision.subtract(src1, src2, fixed_dst, null, this.dst_depth);
            dst = fixed_dst;
            this.dst_depth = fixed_dst.depth();
        }

        alvision.ASSERT_FALSE(dst.empty());
        alvision.ASSERT_EQ(src1.dims, dst.dims);
        alvision.ASSERT_EQ(src1.size, dst.size);
        alvision.ASSERT_EQ(this.dst_depth > 0 ? this.dst_depth : src1.depth(), dst.depth());
        alvision.ASSERT_EQ(0, alvision.countNonZero(dst.reshape(1)));
    }
}

alvision.cvtest.TEST_P('SubtractOutputMatNotEmpty', 'Mat_Mat_3d', () => { var test = new SubtractOutputMatNotEmpty_Mat_Mat_3d(); test.TestBody();});



alvision.cvtest.INSTANTIATE_TEST_CASE_P('Arithm', 'SubtractOutputMatNotEmpty', (caseName, testName) => { return null; },
    new alvision.cvtest.Combine([
    [new alvision.Size(16, 16), new alvision.Size(13, 13), new alvision.Size(16, 13), new alvision.Size(13, 16)],
    [alvision.MatrixType.CV_8UC1, alvision.MatrixType.CV_8UC3, alvision.MatrixType.CV_8UC4, alvision.MatrixType.CV_16SC1, alvision.MatrixType.CV_16SC3],
    [-1, alvision.MatrixType.CV_16S, alvision.MatrixType.CV_32S, alvision.MatrixType.CV_32F],
    [true,false]
])
);


alvision.cvtest.TEST('Core_FindNonZero', 'singular', () => {
    var img = new alvision.Mat(10, 10, alvision.MatrixType.CV_8U, alvision.Scalar.all(0));
    var pts = new Array < alvision.Point >(), pts2 = new Array<alvision.Point>(10);
    alvision.findNonZero(img, pts2);
    alvision.findNonZero(img, pts);
    alvision.ASSERT_TRUE(pts.length == 0 && pts2.length == 0);
});

alvision.cvtest.TEST('Core_BoolVector', 'support', () => {
    var test = new Array<boolean>();
    var n = 205;
    var nz = 0;
    test.length = (n);
    for (var i = 0; i < n; i++) {
        test[i] = alvision.theRNG().uniform(0, 2) != 0;
        nz += test[i] ? 1 : 0;
    }
    alvision.ASSERT_EQ(nz, alvision.countNonZero(test));
    alvision.ASSERT_EQ(nz/ n, (alvision.mean(test)[0]));
});
