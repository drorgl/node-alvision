import tape = require("tape");
import path = require("path");
import colors = require("colors");
import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');


//#include "test_precomp.hpp"
//
//using namespace cv;
//using namespace std;

namespace cvtest
{

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

            db = new alvision.Mat(1, 1, alvision.MatrixType.CV_64F, this.alpha);
            db.convertTo(fl, alvision.MatrixType.CV_32F);
            fl.convertTo(db, alvision.MatrixType.CV_64F);

            db = new alvision.Mat(1, 1, alvision.MatrixType.CV_64F, this.beta);
            db.convertTo(fl, alvision.MatrixType.CV_32F);
            fl.convertTo(db, alvision.MatrixType.CV_64F);

            db = new alvision.Mat(1, 4, alvision.MatrixType.CV_64F, this.gamma[0]);
            db.convertTo(fl, alvision.MatrixType.CV_32F);
            fl.convertTo(db, alvision.MatrixType.CV_64F);
        }
    }

    protected ninputs: alvision.int;
    protected flags: alvision.int;
    protected alpha: alvision.double;
    protected beta: alvision.double;
    protected gamma: alvision.Scalar;
    protected context: alvision.int;
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
        alvision.add(src[0], 1,new alvision.Mat(), 0, -this.gamma, dst, src[0].type(), true);
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
    function inRangeS_<T, WT>(src: T, a: WT, b: WT, dst: string, total: alvision.size_t, cn: alvision.int): void {
        //size_t i;
        //int c;
        for (var i = 0; i < total; i++) {
            var val = src[i * cn.valueOf()];
            dst[i] = (a[0] <= val && val <= b[0]) ? uchar(255) : 0;
        }
        for (var c = 1; c < cn; c++) {
            for (i = 0; i < total; i++) {
                var val = src[i * cn + c];
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
        var val = src[i*cn];
        dst[i] = a[i*cn] <= val && val <= b[i*cn] ? 255 : 0;
    }
    for(var c = 1; c < cn; c++ )
    {
        for( i = 0; i < total; i++ )
        {
            _Tp val = src[i*cn + c];
            dst[i] = a[i*cn + c] <= val && val <= b[i*cn + c] ? dst[i] : 0;
        }
    }
}


function inRange(src: alvision.Mat, lb: alvision.Mat, rb: alvision.Mat, dst: alvision.Mat ) : void
{
    alvision.CV_Assert(()=> src.type() == lb.type() && src.type() == rb.type() &&
              src.size == lb.size && src.size == rb.size );
    dst.create( src.dims, &src.size[0],alvision.MatrixType. CV_8U );
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
    dst.create( src.dims, &src.size[0], alvision.MatrixType.CV_8U );
    const arrays =[src, dst, 0];
    Mat planes[2];

    NAryMatIterator it(arrays, planes);
    size_t total = planes[0].total();
    size_t i, nplanes = it.nplanes;
    int depth = src.depth(), cn = src.channels();
    union { double d[4]; float f[4]; int i[4];} lbuf, rbuf;
    int wtype = CV_MAKETYPE(depth <= CV_32S ? CV_32S : depth, cn);
    scalarToRawData(lb, lbuf.d, wtype, cn);
    scalarToRawData(rb, rbuf.d, wtype, cn);

    for(var i = 0; i < nplanes; i++, ++it )
    {
        const uchar* sptr = planes[0].ptr();
        uchar* dptr = planes[1].ptr();

        switch( depth )
        {
            case alvision.MatrixType.CV_8U:
            inRangeS_((const uchar*)sptr, lbuf.i, rbuf.i, dptr, total, cn);
            break;
            case alvision.MatrixType.CV_8S:
            inRangeS_((const schar*)sptr, lbuf.i, rbuf.i, dptr, total, cn);
            break;
            case alvision.MatrixType.CV_16U:
            inRangeS_((const ushort*)sptr, lbuf.i, rbuf.i, dptr, total, cn);
            break;
            case alvision.MatrixType.CV_16S:
            inRangeS_((const short*)sptr, lbuf.i, rbuf.i, dptr, total, cn);
            break;
            case alvision.MatrixType.CV_32S:
            inRangeS_((const int*)sptr, lbuf.i, rbuf.i, dptr, total, cn);
            break;
            case alvision.MatrixType.CV_32F:
            inRangeS_((const float*)sptr, lbuf.f, rbuf.f, dptr, total, cn);
            break;
            case alvision.MatrixType.CV_64F:
            inRangeS_((const double*)sptr, lbuf.d, rbuf.d, dptr, total, cn);
            break;
        default:
            CV_Error(alvision.cv.Error.Code.StsUnsupportedFormat, "");
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
        alvision.cvtest.add(src[0], this.alpha, new alvision.Mat(), 0, alvision.Scalar.all(gamma[0]), dst, CV_8UC(src[0].channels()), true);
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
    int i, j, k, esz = (int)src.elemSize(), width = src.cols*esz;

    for(var i = 0; i < dst.rows; i++ )
    {
        var sptr = src.ptr<alvision.uchar>("uchar",flipcode == 1 ? i : dst.rows - i - 1);
        var dptr = dst.ptr<alvision.uchar>("uchar",i);
        if( flipcode == 0 )
            memcpy(dptr, sptr, width);
        else
        {
            for(var j = 0; j < width; j += esz )
                for(var k = 0; k < esz; k++ )
                    dptr[j + k] = sptr[width - j - esz + k];
        }
    }
}


function setIdentity(dst: alvision.Mat, s: alvision.Scalar) : void
{
    alvision.CV_Assert(()=> dst.dims == 2 && dst.channels() <= 4 );
    double buf[4];
    scalarToRawData(s, buf, dst.type(), 0);
    int i, k, esz = (int)dst.elemSize(), width = dst.cols*esz;

    for(var i = 0; i < dst.rows; i++ )
    {
        var dptr = dst.ptr<alvision.uchar>("uchar",i);
        memset( dptr, 0, width );
        if( i < dst.cols )
            for(var k = 0; k < esz; k++ )
                dptr[i*esz + k] = ((uchar*)buf)[k];
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
        dst = alvision.Scalar.all(0);
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
    Mat planes[2];

    NAryMatIterator it(arrays, planes);
    size_t j, total = planes[0].total()*src.channels();
    size_t i, nplanes = it.nplanes;
    int depth = src.depth();

    for(var i = 0; i < nplanes; i++, ++it )
    {
        var sptr = planes[0].ptr<alvision.uchar>("uchar");
        var dptr = planes[1].ptr<alvision.uchar>("uchar");

        if( depth ==alvision.MatrixType. CV_32F )
        {
            for(var j = 0; j < total; j++ )
                ((float*)dptr)[j] = Math.exp(((const float*)sptr)[j]);
        }
        else if( depth ==alvision.MatrixType. CV_64F )
        {
            for( j = 0; j < total; j++ )
                ((double*)dptr)[j] = Math.exp(((const double*)sptr)[j]);
        }
    }
}

function log(src: alvision.Mat, dst: alvision.Mat) : void
{
    dst.create( src.dims, &src.size[0], src.type() );
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
    mmag.create( mx.dims, &mx.size[0], mx.type() );
    mangle.create( mx.dims, &mx.size[0], mx.type() );
    const arrays =[mx, my, mmag, mangle, 0]
    Mat planes[4];

    NAryMatIterator it(arrays, planes);
    size_t j, total = planes[0].total();
    size_t i, nplanes = it.nplanes;
    int depth = mx.depth();
    double scale = angleInDegrees ? 180/Math.PI : 1;

    for(var i = 0; i < nplanes; i++, ++it )
    {
        if( depth == CV_32F )
        {
            const  xptr = planes[0].ptr<alvision.float>("float");
            const  yptr = planes[1].ptr<alvision.float>("float");
            var mptr = planes[2].ptr<alvision.float>("float");
            var aptr = planes[3].ptr<alvision.float>("float");

            for(var j = 0; j < total; j++ )
            {
                mptr[j] = Math.sqrt(xptr[j]*xptr[j] + yptr[j]*yptr[j]);
                var a = Math.atan2((double)yptr[j], (double)xptr[j]);
                if( a < 0 ) a += Math.PI*2;
                aptr[j] = (float)(a*scale);
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
                mptr[j] = Math.sqrt(xptr[j]*xptr[j] + yptr[j]*yptr[j]);
                var a = Math.atan2(yptr[j], xptr[j]);
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
        dst.create(src[0].dims, src[0].size, alvision.MatrixType.CV_MAKETYPE(src[0].depth(), 4));
        alvision.mixChannels(msrc, 4, dst, 1, pairs, 4);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        var mag      = new alvision.Mat();
        var angle = new alvision.Mat();
        alvision.cartToPolar(src[0], src[1], mag, angle, this.angleInDegrees);
        var msrc = [mag, angle, src[0], src[1]];
        var pairs = [0, 0, 1, 1, 2, 2, 3, 3];
        dst.create(src[0].dims, src[0].size, alvision.MatrixType.CV_MAKETYPE(src[0].depth(), 4));
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
        dst.at<Scalar>(0, 0) = alvision.mean(src[0], mask);
    }
    reftop(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat): void {
        dst.create(1, 1, alvision.MatrixType.CV_64FC4);
        dst.at<Scalar>(0, 0) = alvision.cvtest.mean(src[0], mask);
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
        dst.at<Scalar>(0,0) = alvision.sum(src[0]);
    }
    refop(src: Array<alvision.Mat>, dst:alvision.Mat, mask: alvision.Mat) : void
    {
        dst.create(1, 1, alvision.MatrixType.CV_64FC4);
        dst.at<Scalar>(0,0) = alvision.cvtest.mean(src[0])*(double)src[0].total();
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
        dst.at<int>(0,0) = alvision.countNonZero(temp);
    }
    reftop(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        var temp = new alvision.Mat();
        alvision.compare(src[0], 0, temp, CMP_NE);
        if( !mask.empty() )
            alvision.cvtest.set(temp, alvision.Scalar.all(0), mask);
        dst.create(1, 1, alvision.MatrixType.CV_32S);
        dst.at<int>(0,0) = saturate_cast<int>(alvision.cvtest.mean(temp)[0]/255*temp.total());
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
        alvision.meanStdDev(src[0], dst.at<Scalar>(0,0), dst.at<Scalar>(0,1), mask);
    }
    reftop(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        var temp = new alvision.Mat();
        alvision.cvtest.convert(src[0], temp,alvision.MatrixType. CV_64F);
        alvision.cvtest.multiply(temp, temp, temp);
        var mean = alvision.cvtest.mean(src[0], mask);
        var sqmean = alvision.cvtest.mean(temp, mask);

        sqmeanRef = sqmean;
        cn = temp.channels();

        for( var c = 0; c < 4; c++ )
            sqmean[c] = Math.sqrt(Math.max(sqmean[c] - mean[c]*mean[c], 0.));

        dst.create(1, 2, alvision.MatrixType.CV_64FC4);
        dst.at<Scalar>(0,0) = mean;
        dst.at<Scalar>(0,1) = sqmean;
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        alvision.CV_Assert(()=>cn > 0);
        var err = sqmeanRef[0];
        for(var i = 1; i < cn; ++i)
            err = Math.max(err, sqmeanRef[i]);
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
            this.normType = rng.uniform(1, 8);
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
        dst.at<double>(0,0) = alvision.norm(src[0], this.normType, mask);
        dst.at<double>(0,1) = alvision.norm(src[0], src[1], this.normType, mask);
    }
    reftop(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        dst.create(1, 2, alvision.MatrixType.CV_64FC1);
        dst.at<double>(0,0) = alvision.cvtest.norm(src[0], this.normType, mask);
        dst.at<double>(0,1) = alvision.cvtest.norm(src[0], src[1], this.normType, mask);
    }
    generateScalars(depth:alvision.int, rng:alvision.RNG) : void
    {
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return 1e-6;
    }
    protected normType: alvision.int;
}


class MinMaxLocOp extends BaseElemWiseOp
{
    constructor() {

        super(1, BaseElemWiseOpType.FIX_ALPHA + BaseElemWiseOpType.FIX_BETA + BaseElemWiseOpType.FIX_GAMMA + BaseElemWiseOpType.SUPPORT_MASK + BaseElemWiseOpType. SCALAR_OUTPUT, 1, 1, alvision.Scalar.all(0));
        this.context = ARITHM_MAX_NDIMS * 2 + 2;
    }
    getRandomType(rng:alvision.RNG):alvision.int
    {
        return alvision.cvtest.randomType(rng, alvision._OutputArrayDepth.DEPTH_MASK_ALL_BUT_8S, 1, 1);
    }
    saveOutput(minidx: Array<alvision.int>, maxidx: Array<alvision.int>,
        minval: alvision.double, maxval: alvision.double, dst: alvision.Mat) : void
    {
        var ndims = (int)minidx.size();
        dst.create(1, ndims * 2 + 2, alvision.MatrixType.CV_64FC1);

        for(var i = 0; i < ndims; i++ )
        {
            dst.at<double>(0,i) = minidx[i];
            dst.at<double>(0,i+ndims) = maxidx[i];
        }
        dst.at<double>(0,ndims*2) = minval;
        dst.at<double>(0,ndims*2+1) = maxval;
    }
    op(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        var ndims = src[0].dims;
        Array<int> minidx(ndims), maxidx(ndims);
        double minval=0, maxval=0;
        alvision.minMaxIdx(src[0], &minval, &maxval, &minidx[0], &maxidx[0], mask);
        saveOutput(minidx, maxidx, minval, maxval, dst);
    }
    reftop(src: Array<alvision.Mat>, dst: alvision.Mat, mask: alvision.Mat) : void
    {
        int ndims=src[0].dims;
        Array<int> minidx(ndims), maxidx(ndims);
        double minval=0, maxval=0;
        alvision.cvtest.minMaxLoc(src[0], &minval, &maxval, &minidx, &maxidx, mask);
        saveOutput(minidx, maxidx, minval, maxval, dst);
    }
    getMaxErr(depth: alvision.int):alvision.double
    {
        return 0;
    }
};


}

typedef Ptr<alvision.cvtest.BaseElemWiseOp> ElemWiseOpPtr;
class ElemWiseTest  extends  ::testing::TestWithParam<ElemWiseOpPtr> {};

alvision.cvtest.TEST_P(ElemWiseTest, accuracy)
{
    ElemWiseOpPtr op = GetParam();

    int testIdx = 0;
    RNG rng((uint64)alvision.cvtest.ARITHM_RNG_SEED);
    for( testIdx = 0; testIdx < alvision.cvtest.ARITHM_NTESTS; testIdx++ )
    {
        Array<int> size;
        op.getRandomSize(rng, size);
        int type = op.getRandomType(rng);
        int depth = CV_MAT_DEPTH(type);
        bool haveMask = (op.flags & alvision.cvtest.BaseElemWiseOp::SUPPORT_MASK) != 0 && rng.uniform(0, 4) == 0;

        double minval=0, maxval=0;
        op.getValueRange(depth, minval, maxval);
        int i, ninputs = op.ninputs;
        Array<Mat> src(ninputs);
        for( i = 0; i < ninputs; i++ )
            src[i] = alvision.cvtest.randomMat(rng, size, type, minval, maxval, true);
        Mat dst0, dst, mask;
        if( haveMask )
            mask = alvision.cvtest.randomMat(rng, size, CV_8U, 0, 2, true);

        if( (haveMask || ninputs == 0) && !(op.flags & alvision.cvtest.BaseElemWiseOp::SCALAR_OUTPUT))
        {
            dst0 = alvision.cvtest.randomMat(rng, size, type, minval, maxval, false);
            dst = alvision.cvtest.randomMat(rng, size, type, minval, maxval, true);
            alvision.cvtest.copy(dst, dst0);
        }
        op.generateScalars(depth, rng);

        op.refop(src, dst0, mask);
        op.op(src, dst, mask);

        double maxErr = op.getMaxErr(depth);
        ASSERT_PRED_FORMAT2(alvision.cvtest.MatComparator(maxErr, op.context), dst0, dst) << "\nsrc[0] ~ " <<
            alvision.cvtest.MatInfo(!src.empty() ? src[0] : Mat()) << "\ntestCase #" << testIdx << "\n";
    }
}


alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_Copy, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.CopyOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_Set, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.SetOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_SetZero, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.SetZeroOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_ConvertScale, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.ConvertScaleOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_ConvertScaleAbs, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.ConvertScaleAbsOp)));

alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_Add, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.AddOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_Sub, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.SubOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_AddS, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.AddSOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_SubRS, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.SubRSOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_ScaleAdd, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.ScaleAddOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_AddWeighted, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.AddWeightedOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_AbsDiff, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.AbsDiffOp)));


alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_AbsDiffS, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.AbsDiffSOp)));

alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_And, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.LogicOp('&'))));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_AndS, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.LogicSOp('&'))));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_Or, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.LogicOp('|'))));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_OrS, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.LogicSOp('|'))));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_Xor, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.LogicOp('^'))));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_XorS, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.LogicSOp('^'))));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_Not, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.LogicSOp('~'))));

alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_Max, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.MaxOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_MaxS, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.MaxSOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_Min, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.MinOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_MinS, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.MinSOp)));

alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_Mul, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.MulOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_Div, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.DivOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_Recip, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.RecipOp)));

alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_Cmp, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.CmpOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_CmpS, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.CmpSOp)));

alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_InRangeS, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.InRangeSOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_InRange, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.InRangeOp)));

alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_Flip, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.FlipOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_Transpose, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.TransposeOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_SetIdentity, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.SetIdentityOp)));

alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_Exp, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.ExpOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_Log, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.LogOp)));

alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_CountNonZero, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.CountNonZeroOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_Mean, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.MeanOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_MeanStdDev, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.MeanStdDevOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_Sum, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.SumOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_Norm, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.NormOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_MinMaxLoc, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.MinMaxLocOp)));
alvision.cvtest.INSTANTIATE_TEST_CASE_P(Core_CartToPolarToCart, ElemWiseTest, ::testing::Values(ElemWiseOpPtr(new alvision.cvtest.CartToPolarToCartOp)));


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
            const int MAX_DIM=3;
            int sizes[MAX_DIM];
            for( int iter = 0; iter < 100; iter++ )
            {
                //ts.printf(alvision.cvtest.TSConstants.LOG, ".");

                ts.update_context(this, iter, true);
                int k, dims = rng.uniform(1, MAX_DIM+1), p = 1;
                int depth = rng.uniform(CV_8U, CV_64F+1);
                int cn = rng.uniform(1, 6);
                int type = CV_MAKETYPE(depth, cn);
                int op = rng.uniform(0, 5);
                int depth1 = op <= 1 ? CV_64F : depth;
                for( k = 0; k < dims; k++ )
                {
                    sizes[k] = rng.uniform(1, 30);
                    p *= sizes[k];
                }
                Mat a(dims, sizes, type), a1;
                Mat b(dims, sizes, type), b1;
                Mat mask(dims, sizes, CV_8U);
                Mat mask1;
                Mat c, d;

                rng.fill(a, RNG::UNIFORM, 0, 100);
                rng.fill(b, RNG::UNIFORM, 0, 100);

                // [-2,2) range means that the each generated random number
                // will be one of -2, -1, 0, 1. Saturated to [0,255], it will become
                // 0, 0, 0, 1 => the mask will be filled by ~25%.
                rng.fill(mask, RNG::UNIFORM, -2, 2);

                a.convertTo(a1, depth1);
                b.convertTo(b1, depth1);
                // invert the mask
                compare(mask, 0, mask1, CMP_EQ);
                a1.setTo(0, mask1);
                b1.setTo(0, mask1);

                if( op == 0 )
                {
                    add(a, b, c, mask);
                    add(a1, b1, d);
                }
                else if( op == 1 )
                {
                    subtract(a, b, c, mask);
                    subtract(a1, b1, d);
                }
                else if( op == 2 )
                {
                    bitwise_and(a, b, c, mask);
                    bitwise_and(a1, b1, d);
                }
                else if( op == 3 )
                {
                    bitwise_or(a, b, c, mask);
                    bitwise_or(a1, b1, d);
                }
                else if( op == 4 )
                {
                    bitwise_xor(a, b, c, mask);
                    bitwise_xor(a1, b1, d);
                }
                Mat d1;
                d.convertTo(d1, depth);
                CV_Assert( alvision.cvtest.norm(c, d1, CV_C) <= DBL_EPSILON );
            }

            Mat_<uchar> tmpSrc(100,100);
            tmpSrc = 124;
            Mat_<uchar> tmpMask(100,100);
            tmpMask = 255;
            Mat_<uchar> tmpDst(100,100);
            tmpDst = 2;
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
    alvision.ASSERT_EQ(dst.at<ushort>(0, 0), 16201);
});

alvision.cvtest.TEST('Core_Add', 'AddToColumnWhen3Rows', () => {
    var m1 = new alvision.Mat(alvision.Mat_<double>(3, 2) << 1, 2, 3, 4, 5, 6);
    m1.col(1) += 10;

    var m2 = new alvision.Mat  (alvision.Mat_<double>(3, 2) << 1, 12, 3, 14, 5, 16);

    alvision.ASSERT_EQ(0, countNonZero(m1 - m2));
});

alvision.cvtest.TEST('Core_Add', 'AddToColumnWhen4Rows', () => {
    var m1 = new alvision.Mat(alvision.Mat_<double>(4, 2) << 1, 2, 3, 4, 5, 6, 7, 8);
    m1.col(1) += 10;

    var m2 = new alvision.Mat (alvision.Mat_<double>(4, 2) << 1, 12, 3, 14, 5, 16, 7, 18);

    alvision.ASSERT_EQ(0, countNonZero(m1 - m2));
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


typedef testing::TestWithParam<Size> Mul1;

alvision.cvtest.TEST_P('Mul1', 'One', () => {
    Size size = GetParam();
    alvision.Mat src(size, CV_32FC1, alvision.Scalar::all(2)), dst,
        ref_dst(size, CV_32FC1, alvision.Scalar::all(6));

    alvision.multiply(3, src, dst);

    alvision.ASSERT_EQ(0, alvision.cvtest.norm(dst, ref_dst, alvision.NORM_INF));
});

alvision.cvtest.INSTANTIATE_TEST_CASE_P(Arithm, Mul1, testing::Values(Size(2, 2), Size(1, 1)));

class SubtractOutputMatNotEmpty  extends  testing::TestWithParam< std::tr1::tuple<alvision.Size, perf::MatType, perf::MatDepth, bool> >
{
public:
    alvision.Size size;
    int src_type;
    int dst_depth;
    bool fixed;

    void SetUp()
    {
        size = std::tr1::get<0>(GetParam());
        src_type = std::tr1::get<1>(GetParam());
        dst_depth = std::tr1::get<2>(GetParam());
        fixed = std::tr1::get<3>(GetParam());
    }
};

alvision.cvtest.TEST_P('SubtractOutputMatNotEmpty', 'Mat_Mat', () => {
    alvision.Mat src1(size, src_type, alvision.Scalar::all(16));
    alvision.Mat src2(size, src_type, alvision.Scalar::all(16));

    alvision.Mat dst;

    if (!fixed) {
        alvision.subtract(src1, src2, dst, alvision.noArray(), dst_depth);
    }
    else {
        const alvision.Mat fixed_dst(size, CV_MAKE_TYPE((dst_depth > 0 ? dst_depth : CV_16S), src1.channels()));
        alvision.subtract(src1, src2, fixed_dst, alvision.noArray(), dst_depth);
        dst = fixed_dst;
        dst_depth = fixed_dst.depth();
    }

    ASSERT_FALSE(dst.empty());
    ASSERT_EQ(src1.size(), dst.size());
    ASSERT_EQ(dst_depth > 0 ? dst_depth : src1.depth(), dst.depth());
    ASSERT_EQ(0, alvision.countNonZero(dst.reshape(1)));
});

alvision.cvtest.TEST_P(SubtractOutputMatNotEmpty, Mat_Mat_WithMask)
{
    alvision.Mat src1(size, src_type, alvision.Scalar::all(16));
    alvision.Mat src2(size, src_type, alvision.Scalar::all(16));
    alvision.Mat mask(size, CV_8UC1, alvision.Scalar::all(255));

    alvision.Mat dst;

    if (!fixed)
    {
        alvision.subtract(src1, src2, dst, mask, dst_depth);
    }
    else
    {
        const alvision.Mat fixed_dst(size, CV_MAKE_TYPE((dst_depth > 0 ? dst_depth : CV_16S), src1.channels()));
        alvision.subtract(src1, src2, fixed_dst, mask, dst_depth);
        dst = fixed_dst;
        dst_depth = fixed_dst.depth();
    }

    ASSERT_FALSE(dst.empty());
    ASSERT_EQ(src1.size(), dst.size());
    ASSERT_EQ(dst_depth > 0 ? dst_depth : src1.depth(), dst.depth());
    ASSERT_EQ(0, alvision.countNonZero(dst.reshape(1)));
}

alvision.cvtest.TEST_P(SubtractOutputMatNotEmpty, Mat_Mat_Expr)
{
    alvision.Mat src1(size, src_type, alvision.Scalar::all(16));
    alvision.Mat src2(size, src_type, alvision.Scalar::all(16));

    alvision.Mat dst = src1 - src2;

    ASSERT_FALSE(dst.empty());
    ASSERT_EQ(src1.size(), dst.size());
    ASSERT_EQ(src1.depth(), dst.depth());
    ASSERT_EQ(0, alvision.countNonZero(dst.reshape(1)));
}

alvision.cvtest.TEST_P(SubtractOutputMatNotEmpty, Mat_Scalar)
{
    alvision.Mat src(size, src_type, alvision.Scalar::all(16));

    alvision.Mat dst;

    if (!fixed)
    {
        alvision.subtract(src, alvision.Scalar::all(16), dst, alvision.noArray(), dst_depth);
    }
    else
    {
        const alvision.Mat fixed_dst(size, CV_MAKE_TYPE((dst_depth > 0 ? dst_depth : CV_16S), src.channels()));
        alvision.subtract(src, alvision.Scalar::all(16), fixed_dst, alvision.noArray(), dst_depth);
        dst = fixed_dst;
        dst_depth = fixed_dst.depth();
    }

    ASSERT_FALSE(dst.empty());
    ASSERT_EQ(src.size(), dst.size());
    ASSERT_EQ(dst_depth > 0 ? dst_depth : src.depth(), dst.depth());
    ASSERT_EQ(0, alvision.countNonZero(dst.reshape(1)));
}

alvision.cvtest.TEST_P(SubtractOutputMatNotEmpty, Mat_Scalar_WithMask)
{
    alvision.Mat src(size, src_type, alvision.Scalar::all(16));
    alvision.Mat mask(size, CV_8UC1, alvision.Scalar::all(255));

    alvision.Mat dst;

    if (!fixed)
    {
        alvision.subtract(src, alvision.Scalar::all(16), dst, mask, dst_depth);
    }
    else
    {
        const alvision.Mat fixed_dst(size, CV_MAKE_TYPE((dst_depth > 0 ? dst_depth : CV_16S), src.channels()));
        alvision.subtract(src, alvision.Scalar::all(16), fixed_dst, mask, dst_depth);
        dst = fixed_dst;
        dst_depth = fixed_dst.depth();
    }

    ASSERT_FALSE(dst.empty());
    ASSERT_EQ(src.size(), dst.size());
    ASSERT_EQ(dst_depth > 0 ? dst_depth : src.depth(), dst.depth());
    ASSERT_EQ(0, alvision.countNonZero(dst.reshape(1)));
}

alvision.cvtest.TEST_P(SubtractOutputMatNotEmpty, Scalar_Mat)
{
    alvision.Mat src(size, src_type, alvision.Scalar::all(16));

    alvision.Mat dst;

    if (!fixed)
    {
        alvision.subtract(alvision.Scalar::all(16), src, dst, alvision.noArray(), dst_depth);
    }
    else
    {
        const alvision.Mat fixed_dst(size, CV_MAKE_TYPE((dst_depth > 0 ? dst_depth : CV_16S), src.channels()));
        alvision.subtract(alvision.Scalar::all(16), src, fixed_dst, alvision.noArray(), dst_depth);
        dst = fixed_dst;
        dst_depth = fixed_dst.depth();
    }

    ASSERT_FALSE(dst.empty());
    ASSERT_EQ(src.size(), dst.size());
    ASSERT_EQ(dst_depth > 0 ? dst_depth : src.depth(), dst.depth());
    ASSERT_EQ(0, alvision.countNonZero(dst.reshape(1)));
}

alvision.cvtest.TEST_P(SubtractOutputMatNotEmpty, Scalar_Mat_WithMask)
{
    alvision.Mat src(size, src_type, alvision.Scalar::all(16));
    alvision.Mat mask(size, CV_8UC1, alvision.Scalar::all(255));

    alvision.Mat dst;

    if (!fixed)
    {
        alvision.subtract(alvision.Scalar::all(16), src, dst, mask, dst_depth);
    }
    else
    {
        const alvision.Mat fixed_dst(size, CV_MAKE_TYPE((dst_depth > 0 ? dst_depth : CV_16S), src.channels()));
        alvision.subtract(alvision.Scalar::all(16), src, fixed_dst, mask, dst_depth);
        dst = fixed_dst;
        dst_depth = fixed_dst.depth();
    }

    ASSERT_FALSE(dst.empty());
    ASSERT_EQ(src.size(), dst.size());
    ASSERT_EQ(dst_depth > 0 ? dst_depth : src.depth(), dst.depth());
    ASSERT_EQ(0, alvision.countNonZero(dst.reshape(1)));
}

alvision.cvtest.TEST_P(SubtractOutputMatNotEmpty, Mat_Mat_3d)
{
    int dims[] = {5, size.height, size.width};

    alvision.Mat src1(3, dims, src_type, alvision.Scalar::all(16));
    alvision.Mat src2(3, dims, src_type, alvision.Scalar::all(16));

    alvision.Mat dst;

    if (!fixed)
    {
        alvision.subtract(src1, src2, dst, alvision.noArray(), dst_depth);
    }
    else
    {
        const alvision.Mat fixed_dst(3, dims, CV_MAKE_TYPE((dst_depth > 0 ? dst_depth : CV_16S), src1.channels()));
        alvision.subtract(src1, src2, fixed_dst, alvision.noArray(), dst_depth);
        dst = fixed_dst;
        dst_depth = fixed_dst.depth();
    }

    ASSERT_FALSE(dst.empty());
    ASSERT_EQ(src1.dims, dst.dims);
    ASSERT_EQ(src1.size, dst.size);
    ASSERT_EQ(dst_depth > 0 ? dst_depth : src1.depth(), dst.depth());
    ASSERT_EQ(0, alvision.countNonZero(dst.reshape(1)));
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P(Arithm, SubtractOutputMatNotEmpty, testing::Combine(
    testing::Values(alvision.Size(16, 16), alvision.Size(13, 13), alvision.Size(16, 13), alvision.Size(13, 16)),
    testing::Values(perf::MatType(CV_8UC1), CV_8UC3, CV_8UC4, CV_16SC1, CV_16SC3),
    testing::Values(-1, CV_16S, CV_32S, CV_32F),
    testing::Bool()));


alvision.cvtest.TEST('Core_FindNonZero', 'singular', () => {
    var img = new alvision.Mat (10, 10, CV_8U, alvision.Scalar.all(0));
    Array < Point > pts, pts2(10);
    findNonZero(img, pts);
    findNonZero(img, pts2);
    ASSERT_TRUE(pts.empty() && pts2.empty());
});

alvision.cvtest.TEST('Core_BoolVector', 'support', () => {
    Array < bool > test;
    int i, n = 205;
    int nz = 0;
    test.resize(n);
    for (i = 0; i < n; i++) {
        test[i] = theRNG().uniform(0, 2) != 0;
        nz += (int)test[i];
    }
    ASSERT_EQ(nz, countNonZero(test));
    ASSERT_FLOAT_EQ((float)nz/ n, (float)(mean(test)[0]));
});
