import tape = require("tape");
import path = require("path");
import colors = require("colors");
import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');

//#include "test_precomp.hpp"
//
//#include <map>
//
//using namespace cv;
//using namespace std;


class Core_ReduceTest  extends alvision.cvtest.BaseTest
{
 run(iii : alvision.int) : void{
     let code = alvision.cvtest.FailureCode.OK;//, tempCode;

    let tempCode = this.checkSize(new alvision.Size(1, 1));
    code = tempCode != alvision.cvtest.FailureCode.OK ? <any>tempCode : code;

    tempCode = this.checkSize(new alvision.Size(1, 100));
    code = tempCode != alvision.cvtest.FailureCode.OK ? <any>tempCode : code;

    tempCode =this. checkSize(new alvision.Size(100, 1));
    code = tempCode != alvision.cvtest.FailureCode.OK ? <any>tempCode : code;

    tempCode = this. checkSize(new alvision.Size(1000, 500));
    code = tempCode != alvision.cvtest.FailureCode.OK ? <any>tempCode : code;

    this.ts.set_failed_test_info(code);
}
 checkOp(src: alvision.Mat, dstType: alvision.int, opType: alvision.int, opRes: alvision.Mat, dim: alvision.int ) : alvision.int{
    let srcType = src.type();
    let support = false;
    if (opType == alvision.ReduceTypes.REDUCE_SUM|| opType == alvision.ReduceTypes.REDUCE_AVG) {
        if (srcType == alvision.MatrixType.CV_8U && (dstType == alvision.MatrixType.CV_32S || dstType == alvision.MatrixType.CV_32F || dstType == alvision.MatrixType.CV_64F))
            support = true;
        if (srcType == alvision.MatrixType.CV_16U && (dstType == alvision.MatrixType.CV_32F || dstType == alvision.MatrixType.CV_64F))
            support = true;
        if (srcType == alvision.MatrixType.CV_16S && (dstType == alvision.MatrixType.CV_32F || dstType == alvision.MatrixType.CV_64F))
            support = true;
        if (srcType == alvision.MatrixType.CV_32F && (dstType == alvision.MatrixType.CV_32F || dstType == alvision.MatrixType.CV_64F))
            support = true;
        if (srcType == alvision.MatrixType.CV_64F && dstType == alvision.MatrixType.CV_64F)
            support = true;
    }
    else if (opType == alvision.ReduceTypes.REDUCE_MAX) {
        if (srcType == alvision.MatrixType.CV_8U && dstType == alvision.MatrixType.CV_8U)
            support = true;
        if (srcType == alvision.MatrixType.CV_32F && dstType == alvision.MatrixType.CV_32F)
            support = true;
        if (srcType == alvision.MatrixType.CV_64F && dstType == alvision.MatrixType.CV_64F)
            support = true;
    }
    else if (opType == alvision.ReduceTypes.REDUCE_MIN) {
        if (srcType == alvision.MatrixType.CV_8U && dstType == alvision.MatrixType.CV_8U)
            support = true;
        if (srcType == alvision.MatrixType.CV_32F && dstType == alvision.MatrixType.CV_32F)
            support = true;
        if (srcType == alvision.MatrixType.CV_64F && dstType == alvision.MatrixType.CV_64F)
            support = true;
    }
    if (!support)
        return alvision.cvtest.FailureCode.OK;

    var eps = 0.0;
    if (opType == alvision.ReduceTypes.REDUCE_SUM  || opType == alvision.ReduceTypes.REDUCE_AVG ) {
        if (dstType == alvision.MatrixType.CV_32F)
            eps = 1.e-5;
        else if (dstType == alvision.MatrixType.CV_64F)
            eps = 1.e-8;
        else if (dstType == alvision.MatrixType.CV_32S)
            eps = 0.6;
    }

    alvision.assert(()=>opRes.type() == alvision.MatrixType.CV_64FC1);
    //Mat _dst, dst, diff;
    let _dst = new alvision.Mat();
    let dst = new alvision.Mat();
    let diff = new alvision.Mat();

    alvision.reduce(src, _dst, dim, opType, dstType);
    _dst.convertTo(dst, alvision.MatrixType.CV_64FC1);

    alvision.absdiff(opRes, dst, diff);
    let check = false;
    if (dstType == alvision.MatrixType.CV_32F || dstType == alvision.MatrixType.CV_64F)
        check = alvision.countNonZero(alvision.MatExpr.op_GreaterThan(diff, alvision.MatExpr.op_Multiplication(eps, dst))) > 0;
    else
        check = alvision.countNonZero(alvision.MatExpr.op_GreaterThan( diff , eps)) > 0;
    if (check) {
        //char msg[100];
        let msg = "";
        const opTypeStr = opType == alvision.ReduceTypes.REDUCE_SUM ? "alvision.ReduceTypes.REDUCE_SUM" :
            opType == alvision.ReduceTypes.REDUCE_AVG ? "alvision.ReduceTypes.REDUCE_AVG" :
                opType == alvision.ReduceTypes.REDUCE_MAX ? "alvision.ReduceTypes.REDUCE_MAX" :
                    opType == alvision.ReduceTypes.REDUCE_MIN ? "alvision.ReduceTypes.REDUCE_MIN" : "unknown operation type";
        //string srcTypeStr, dstTypeStr;
        let srcTypeStr = getMatTypeStr(src.type());
        let dstTypeStr = getMatTypeStr(dstType);
        const dimStr = dim == 0 ? "ROWS" : "COLS";

        msg += util.format( "bad accuracy with srcType = %s, dstType = %s, opType = %s, dim = %s",
            srcTypeStr, dstTypeStr, opTypeStr, dimStr);
        this.ts.printf(alvision.cvtest.TSConstants.LOG, msg);
        return alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
    }
    return alvision.cvtest.FailureCode.OK;
}
 checkCase(srcType: alvision.int, dstType: alvision.int, dim: alvision.int, sz: alvision.Size ): alvision.int{
     let code = alvision.cvtest.FailureCode.OK;//, tempCode;

     let src = new alvision.Mat();
         let sum = new alvision.Mat();
         let avg = new alvision.Mat();
         let max = new alvision.Mat();
         let min = new alvision.Mat();

    src.create(sz, srcType);
    alvision.randu(src,new alvision. Scalar(0),new alvision. Scalar(100));

    if (srcType == alvision.MatrixType.CV_8UC1)
        testReduce<alvision.uchar>("uchar",src, sum, avg, max, min, dim);
    else if (srcType == alvision.MatrixType.CV_8SC1)
        testReduce<alvision.char>("char",src, sum, avg, max, min, dim);
    else if (srcType == alvision.MatrixType.CV_16UC1)
        testReduce<alvision.ushort>("ushort",src, sum, avg, max, min, dim);
    else if (srcType == alvision.MatrixType.CV_16SC1)
        testReduce<alvision.short>("short",src, sum, avg, max, min, dim);
    else if (srcType == alvision.MatrixType.CV_32SC1)
        testReduce<alvision.int>("int",src, sum, avg, max, min, dim);
    else if (srcType == alvision.MatrixType.CV_32FC1)
        testReduce<alvision.float>("float",src, sum, avg, max, min, dim);
    else if (srcType == alvision.MatrixType.CV_64FC1)
        testReduce<alvision.double>("double",src, sum, avg, max, min, dim);
    else
        alvision.assert(() => false);//0);

    // 1. sum
    let tempCode : any = this.checkOp(src, dstType, alvision.ReduceTypes.REDUCE_SUM, sum, dim);
    code = tempCode != alvision.cvtest.FailureCode.OK ? tempCode : code;

    // 2. avg
    tempCode = this.checkOp(src, dstType, alvision.ReduceTypes.REDUCE_AVG, avg, dim);
    code = tempCode != alvision.cvtest.FailureCode.OK ? tempCode : code;

    // 3. max
    tempCode = this.checkOp(src, dstType, alvision.ReduceTypes.REDUCE_MAX, max, dim);
    code = tempCode != alvision.cvtest.FailureCode.OK ? tempCode : code;

    // 4. min
    tempCode = this.checkOp(src, dstType, alvision.ReduceTypes.REDUCE_MIN, min, dim);
    code = tempCode != alvision.cvtest.FailureCode.OK ? tempCode : code;

    return code;
}
 checkDim(dim: alvision.int, sz: alvision.Size ): alvision.int{
    let code = alvision.cvtest.FailureCode.OK, tempCode;

    // CV_8UC1
    tempCode = this.checkCase(alvision.MatrixType.CV_8UC1, alvision.MatrixType.CV_8UC1, dim, sz);
    code = tempCode != alvision.cvtest.FailureCode.OK ? tempCode : code;

    tempCode = this.checkCase(alvision.MatrixType.CV_8UC1, alvision.MatrixType.CV_32SC1, dim, sz);
    code = tempCode != alvision.cvtest.FailureCode.OK ? tempCode : code;

    tempCode = this.checkCase(alvision.MatrixType.CV_8UC1, alvision.MatrixType.CV_32FC1, dim, sz);
    code = tempCode != alvision.cvtest.FailureCode.OK ? tempCode : code;

    tempCode = this.checkCase(alvision.MatrixType.CV_8UC1, alvision.MatrixType.CV_64FC1, dim, sz);
    code = tempCode != alvision.cvtest.FailureCode.OK ? tempCode : code;

    // CV_16UC1
    tempCode = this.checkCase(alvision.MatrixType.CV_16UC1, alvision.MatrixType.CV_32FC1, dim, sz);
    code = tempCode != alvision.cvtest.FailureCode.OK ? tempCode : code;

    tempCode = this.checkCase(alvision.MatrixType.CV_16UC1, alvision.MatrixType.CV_64FC1, dim, sz);
    code = tempCode != alvision.cvtest.FailureCode.OK ? tempCode : code;

    // CV_16SC1
    tempCode = this.checkCase(alvision.MatrixType.CV_16SC1, alvision.MatrixType.CV_32FC1, dim, sz);
    code = tempCode != alvision.cvtest.FailureCode.OK ? tempCode : code;

    tempCode = this.checkCase(alvision.MatrixType.CV_16SC1, alvision.MatrixType.CV_64FC1, dim, sz);
    code = tempCode != alvision.cvtest.FailureCode.OK ? tempCode : code;

    // CV_32FC1
    tempCode = this.checkCase(alvision.MatrixType.CV_32FC1, alvision.MatrixType.CV_32FC1, dim, sz);
    code = tempCode != alvision.cvtest.FailureCode.OK ? tempCode : code;

    tempCode = this.checkCase(alvision.MatrixType.CV_32FC1, alvision.MatrixType.CV_64FC1, dim, sz);
    code = tempCode != alvision.cvtest.FailureCode.OK ? tempCode : code;

    // CV_64FC1
    tempCode = this.checkCase(alvision.MatrixType.CV_64FC1, alvision.MatrixType.CV_64FC1, dim, sz);
    code = tempCode != alvision.cvtest.FailureCode.OK ? tempCode : code;

    return code;
}
 checkSize(sz: alvision.Size): alvision.int{
     let code = alvision.cvtest.FailureCode.OK, tempCode;

    tempCode = this.checkDim(0, sz); // rows
    code = tempCode != alvision.cvtest.FailureCode.OK ? tempCode : code;

    tempCode = this.checkDim(1, sz); // cols
    code = tempCode != alvision.cvtest.FailureCode.OK ? tempCode : code;

    return code;
}
};

//template<class Type>
function testReduce<T>(Ttype:string, src: alvision.Mat, sum: alvision.Mat, avg: alvision.Mat, max: alvision.Mat, min: alvision.Mat, dim: alvision.int ) : void
{
    alvision.assert(()=> src.channels() == 1 );
    if( dim == 0 ) // row
    {
        sum.create( 1, src.cols, alvision.MatrixType.CV_64FC1 );
        max.create( 1, src.cols, alvision.MatrixType.CV_64FC1 );
        min.create(1, src.cols, alvision.MatrixType.CV_64FC1 );
    }
    else
    {
        sum.create( src.rows, 1, alvision.MatrixType.CV_64FC1 );
        max.create( src.rows, 1, alvision.MatrixType.CV_64FC1 );
        min.create(src.rows, 1, alvision.MatrixType.CV_64FC1 );
    }
    sum.setTo(new alvision.Scalar(0));
    max.setTo(new alvision.Scalar(-alvision.DBL_MAX));
    min.setTo(new alvision.Scalar( alvision.DBL_MAX));

    //const Mat_<T>& src_ = src;
    let sum_ = sum;
    let min_ = min;
    let max_ = max;

    if( dim == 0 )
    {
        for( let ri = 0; ri < src.rows; ri++ )
        {
            for( let ci = 0; ci < src.cols; ci++ )
            {
                sum_.at<alvision.float>("float", 0, ci).set(sum_.at<alvision.float>("float", 0, ci) + <any>src.at<T>(Ttype, ri, ci).get());
                max_.at<alvision.float>("float", 0, ci).set(Math.max(max_.at<alvision.float>("float",0, ci).get().valueOf(), <any>src.at<T>(Ttype,ri, ci).get()));
                min_.at<alvision.float>("float",0, ci).set( Math.min(min_.at<alvision.float>("float",0, ci).get().valueOf(), <any>src.at<T>(Ttype,ri, ci).get()));
            }
        }
    }
    else
    {
        for( let ci = 0; ci < src.cols; ci++ )
        {
            for (let ri = 0; ri < src.rows; ri++) {
                sum_.at<alvision.float>("float", ri, 0).set(sum_.at<alvision.float>("float", ri, 0).get() + <any>src.at<T>(Ttype, ri, ci).get());
                max_.at<alvision.float>("float", ri, 0).set(Math.max(max_.at<alvision.float>("float", ri, 0).get().valueOf(), <any>src.at<T>(Ttype, ri, ci).get()));
                min_.at<alvision.float>("float", ri, 0).set(Math.min(min_.at<alvision.float>("float", ri, 0).get().valueOf(), <any>src.at<T>(Ttype, ri, ci).get()));
            }
        }
    }
    sum.convertTo(avg, alvision.MatrixType.CV_64FC1 );
    avg = alvision.MatExpr.op_Multiplication(avg, (1.0 / (dim == 0 ? src.rows.valueOf() : src.cols.valueOf()))).toMat();
}

function getMatTypeStr(type: alvision.int): string {
    return type == alvision.MatrixType.CV_8UC1 ? "CV_8UC1" :
        type == alvision.MatrixType.CV_8SC1 ? "CV_8SC1" :
            type == alvision.MatrixType.CV_16UC1 ? "CV_16UC1" :
                type == alvision.MatrixType.CV_16SC1 ? "CV_16SC1" :
                    type == alvision.MatrixType.CV_32SC1 ? "CV_32SC1" :
                        type == alvision.MatrixType.CV_32FC1 ? "CV_32FC1" :
                            type == alvision.MatrixType.CV_64FC1 ? "CV_64FC1" : "unsupported matrix type";
}



//#define CHECK_C

class Core_PCATest  extends alvision.cvtest.BaseTest
{
    run(iii: alvision.int) : void
    {
        const  sz = new alvision.Size(200, 500);

        //double diffPrjEps, diffBackPrjEps,
        //prjEps, backPrjEps,
        //evalEps, evecEps;
        let maxComponents = 100;
        let retainedVariance = 0.95;
        var rPoints = new alvision.Mat(sz, alvision.MatrixType.CV_32FC1), rTestPoints = new alvision.Mat(sz, alvision.MatrixType.CV_32FC1);
        var rng = this.ts.get_rng();

        rng.fill(rPoints, alvision.DistType.UNIFORM, alvision.Scalar.all(0.0), alvision.Scalar.all(1.0));
        rng.fill(rTestPoints, alvision.DistType.UNIFORM, alvision.Scalar.all(0.0), alvision. Scalar.all(1.0));

        var rPCA = new alvision.PCA(rPoints, new alvision.Mat(), alvision.PCAFlags.DATA_AS_ROW, maxComponents);
        let cPCA = new alvision.PCA();

        // 1. check C++ PCA & ROW
        let rPrjTestPoints = rPCA.project( rTestPoints );
        let rBackPrjTestPoints = rPCA.backProject( rPrjTestPoints );

        let avg = new alvision.Mat(1, sz.width, alvision.MatrixType.CV_32FC1 );
        alvision.reduce( rPoints, avg, 0, alvision.ReduceTypes.REDUCE_AVG );
        var Q = alvision.MatExpr.op_Substraction(rPoints, alvision.repeat(avg, rPoints.rows, 1)).toMat(), Qt = Q.t();
        
        let evalm = new alvision.Mat();
        let evecm = new alvision.Mat();
        Q = alvision.MatExpr.op_Multiplication(Qt, Q).toMat();
        Q = alvision.MatExpr.op_Division(Q, rPoints.rows).toMat();

        alvision.eigen( Q, evalm, evecm );
        /*SVD svd(Q);
         evec = svd.vt;
         eval = svd.w;*/

        let subEval = new alvision.Mat(maxComponents, 1, evalm.type(), evalm.ptr<alvision.uchar>("uchar"));
        let subEvec = new alvision.Mat( maxComponents, evecm.cols, evecm.type(), evecm.ptr<alvision.uchar>("uchar") );

    //#ifdef CHECK_C
    //    Mat prjTestPoints, backPrjTestPoints, cPoints = rPoints.t(), cTestPoints = rTestPoints.t();
    //    CvMat _points, _testPoints, _avg, _eval, _evec, _prjTestPoints, _backPrjTestPoints;
    //#endif

        // check eigen()
        let eigenEps = 1e-6;
        let err;
        for(let i = 0; i < Q.rows; i++ )
        {
            let v = evecm.row(i).t();
            let Qv = alvision.MatExpr.op_Multiplication(Q, v);

            let lv = alvision.MatExpr.op_Multiplication(evalm.at<alvision.float>("float", i, 0).get(), v);
            err = alvision.cvtest.norm( Qv, lv,alvision.NormTypes. NORM_L2 );
            if( err > eigenEps )
            {
                this.ts.printf( alvision.cvtest.TSConstants.LOG, "bad accuracy of eigen(); err = %f\n", err );
                this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
                return;
            }
        }
        // check pca eigenvalues
        let evalEps = 1e-6, evecEps = 1e-3;
        err = alvision.cvtest.norm( rPCA.eigenvalues, subEval,alvision.NormTypes. NORM_L2 );
        if( err > evalEps )
        {
            this.ts.printf( alvision.cvtest.TSConstants.LOG, "pca.eigenvalues is incorrect (CV_PCA_DATA_AS_ROW); err = %f\n", err );
            this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
            return;
        }
        // check pca eigenvectors
        for(let i = 0; i < subEvec.rows; i++)
        {
            var r0 = rPCA.eigenvectors.row(i);
            var r1 = subEvec.row(i);
            err = alvision.cvtest.norm(r0, r1, alvision.NormTypes.NORM_L2);
            if( err > evecEps )
            {
                r1 = alvision.MatExpr.op_Multiplication(r1, -1).toMat();
                let err2 = alvision.cvtest.norm(r0, r1,alvision.NormTypes.NORM_L2);
                if( err2 > evecEps )
                {
                    let tmp = new alvision.Mat();
                    alvision.absdiff(rPCA.eigenvectors, subEvec, tmp);
                    var mval = 0;
                    var mloc = new Array<alvision.Point>();
                    alvision.minMaxLoc(tmp, (minVal_, maxVal_, minIdx_, maxIdx_) => { mval = maxVal_.valueOf(); mloc = maxIdx_; });

                    this.ts.printf( alvision.cvtest.TSConstants.LOG, "pca.eigenvectors is incorrect (CV_PCA_DATA_AS_ROW); err = %f\n", err );
                    this.ts.printf( alvision.cvtest.TSConstants.LOG, "max diff is %g at (i=%d, j=%d) (%g vs %g)\n",
                               mval, mloc[0].y, mloc[0].x, rPCA.eigenvectors.at<alvision.float>("float",mloc[0].y, mloc[0].x),
                               subEvec.at<alvision.float>("float", mloc[0].y, mloc[0].x));
                    this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
                    return;
                }
            }
        }

        let prjEps = 1.265, backPrjEps = 1.265;
        for( let i = 0; i < rTestPoints.rows; i++ )
        {
            // check pca project
            let subEvec_t = subEvec.t();
            let prj = alvision.MatExpr.op_Substraction(rTestPoints.row(i), avg).toMat(); prj = alvision.MatExpr.op_Multiplication(prj, subEvec_t).toMat();
            err = alvision.cvtest.norm(rPrjTestPoints.row(i), prj, alvision.NormTypes.NORM_RELATIVE_L2);
            if( err > prjEps )
            {
                this.ts.printf( alvision.cvtest.TSConstants.LOG, "bad accuracy of project() (CV_PCA_DATA_AS_ROW); err = %f\n", err );
                this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
                return;
            }
            // check pca backProject
            let backPrj = alvision.MatExpr.op_Multiplication( rPrjTestPoints.row(i) , subEvec).op_Addition( + avg).toMat()
            err = alvision.cvtest.norm(rBackPrjTestPoints.row(i), backPrj, alvision.NormTypes.NORM_RELATIVE_L2);
            if( err > backPrjEps )
            {
                this.ts.printf( alvision.cvtest.TSConstants.LOG, "bad accuracy of backProject() (CV_PCA_DATA_AS_ROW); err = %f\n", err );
                this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
                return;
            }
        }

        // 2. check C++ PCA & COL
        cPCA.pca( rPoints.t(), new alvision.Mat(),alvision.PCAFlags.DATA_AS_COL , maxComponents );
        let diffPrjEps = 1, diffBackPrjEps = 1;
        let ocvPrjTestPoints = cPCA.project(rTestPoints.t());
        err = alvision.cvtest.norm(alvision.MatExpr.abs(ocvPrjTestPoints), alvision.MatExpr.abs(rPrjTestPoints.t()),alvision.NormTypes.NORM_RELATIVE_L2);
        if( err > diffPrjEps )
        {
            this.ts.printf( alvision.cvtest.TSConstants.LOG, "bad accuracy of project() (alvision.PCAFlags.DATA_AS_COL); err = %f\n", err );
            this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
            return;
        }
        err = alvision.cvtest.norm(cPCA.backProject(ocvPrjTestPoints), rBackPrjTestPoints.t(), alvision.NormTypes.NORM_RELATIVE_L2 );
        if( err > diffBackPrjEps )
        {
            this.ts.printf( alvision.cvtest.TSConstants.LOG, "bad accuracy of backProject() (alvision.PCAFlags.DATA_AS_COL); err = %f\n", err );
            this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
            return;
        }

        // 3. check C++ PCA w/retainedVariance
        cPCA.pca( rPoints.t(), new alvision.Mat(), alvision.PCAFlags.DATA_AS_COL, retainedVariance );
        diffPrjEps = 1, diffBackPrjEps = 1;
        let rvPrjTestPoints = cPCA.project(rTestPoints.t());

        if( cPCA.eigenvectors.rows > maxComponents)
            err = alvision.cvtest.norm(alvision.MatExpr.abs(rvPrjTestPoints.rowRange(0, maxComponents)), alvision.MatExpr.abs(rPrjTestPoints.t()), alvision.NormTypes.NORM_RELATIVE_L2 );
        else
            err = alvision.cvtest.norm(alvision.MatExpr.abs(rvPrjTestPoints), alvision.MatExpr.abs(rPrjTestPoints.colRange(0, cPCA.eigenvectors.rows).t()), alvision.NormTypes.NORM_RELATIVE_L2 );

        if( err > diffPrjEps )
        {
            this.ts.printf( alvision.cvtest.TSConstants.LOG, "bad accuracy of project() (alvision.PCAFlags.DATA_AS_COL); retainedVariance=0.95; err = %f\n", err );
            this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
            return;
        }
        err = alvision.cvtest.norm(cPCA.backProject(rvPrjTestPoints), rBackPrjTestPoints.t(), alvision.NormTypes.NORM_RELATIVE_L2 );
        if( err > diffBackPrjEps )
        {
            this.ts.printf( alvision.cvtest.TSConstants.LOG, "bad accuracy of backProject() (alvision.PCAFlags.DATA_AS_COL); retainedVariance=0.95; err = %f\n", err );
            this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
            return;
        }

    //#ifdef CHECK_C
    //    // 4. check C PCA & ROW
    //    _points = rPoints;
    //    _testPoints = rTestPoints;
    //    _avg = avg;
    //    _eval = eval;
    //    _evec = evec;
    //    prjTestPoints.create(rTestPoints.rows, maxComponents, rTestPoints.type() );
    //    backPrjTestPoints.create(rPoints.size(), rPoints.type() );
    //    _prjTestPoints = prjTestPoints;
    //    _backPrjTestPoints = backPrjTestPoints;
    //
    //    cvCalcPCA( &_points, &_avg, &_eval, &_evec, CV_PCA_DATA_AS_ROW );
    //    cvProjectPCA( &_testPoints, &_avg, &_evec, &_prjTestPoints );
    //    cvBackProjectPCA( &_prjTestPoints, &_avg, &_evec, &_backPrjTestPoints );
    //
    //    err = alvision.cvtest.norm(prjTestPoints, rPrjTestPoints, CV_RELATIVE_L2);
    //    if( err > diffPrjEps )
    //    {
    //        ts.printf( alvision.cvtest.TSConstants.LOG, "bad accuracy of cvProjectPCA() (CV_PCA_DATA_AS_ROW); err = %f\n", err );
    //        this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
    //        return;
    //    }
    //    err = alvision.cvtest.norm(backPrjTestPoints, rBackPrjTestPoints, CV_RELATIVE_L2);
    //    if( err > diffBackPrjEps )
    //    {
    //        ts.printf( alvision.cvtest.TSConstants.LOG, "bad accuracy of cvBackProjectPCA() (CV_PCA_DATA_AS_ROW); err = %f\n", err );
    //        this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
    //        return;
    //    }
    //
    //    // 5. check C PCA & COL
    //    _points = cPoints;
    //    _testPoints = cTestPoints;
    //    avg = avg.t(); _avg = avg;
    //    eval = eval.t(); _eval = eval;
    //    evec = evec.t(); _evec = evec;
    //    prjTestPoints = prjTestPoints.t(); _prjTestPoints = prjTestPoints;
    //    backPrjTestPoints = backPrjTestPoints.t(); _backPrjTestPoints = backPrjTestPoints;
    //
    //    cvCalcPCA( &_points, &_avg, &_eval, &_evec, alvision.PCAFlags.DATA_AS_COL );
    //    cvProjectPCA( &_testPoints, &_avg, &_evec, &_prjTestPoints );
    //    cvBackProjectPCA( &_prjTestPoints, &_avg, &_evec, &_backPrjTestPoints );
    //
    //    err = alvision.cvtest.norm(alvision.MatExpr.abs(prjTestPoints), alvision.MatExpr.abs(rPrjTestPoints.t()), CV_RELATIVE_L2 );
    //    if( err > diffPrjEps )
    //    {
    //        ts.printf( alvision.cvtest.TSConstants.LOG, "bad accuracy of cvProjectPCA() (alvision.PCAFlags.DATA_AS_COL); err = %f\n", err );
    //        this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
    //        return;
    //    }
    //    err = alvision.cvtest.norm(backPrjTestPoints, rBackPrjTestPoints.t(), CV_RELATIVE_L2);
    //    if( err > diffBackPrjEps )
    //    {
    //        ts.printf( alvision.cvtest.TSConstants.LOG, "bad accuracy of cvBackProjectPCA() (alvision.PCAFlags.DATA_AS_COL); err = %f\n", err );
    //        this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
    //        return;
    //    }
    //#endif
        // Test read and write
        let fs = new alvision.FileStorage( "PCA_store.yml", alvision.FileStorageMode.WRITE );
        rPCA.write( fs );
        fs.release();

        let lPCA = new alvision.PCA();
        fs.open( "PCA_store.yml", alvision.FileStorageMode.READ );
        lPCA.read( fs.root() );
        err = alvision.cvtest.norm(rPCA.eigenvectors, lPCA.eigenvectors, alvision.NormTypes.NORM_RELATIVE_L2 );
        if( err > 0 )
        {
            this.ts.printf( alvision.cvtest.TSConstants.LOG, "bad accuracy of write/load functions (YML); err = %f\n", err );
            this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
        }
        err = alvision.cvtest.norm(rPCA.eigenvalues, lPCA.eigenvalues, alvision.NormTypes.NORM_RELATIVE_L2 );
        if( err > 0 )
        {
            this.ts.printf( alvision.cvtest.TSConstants.LOG, "bad accuracy of write/load functions (YML); err = %f\n", err );
            this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
        }
        err = alvision.cvtest.norm(rPCA.mean, lPCA.mean, alvision.NormTypes.NORM_RELATIVE_L2 );
        if( err > 0 )
        {
            this.ts.printf( alvision.cvtest.TSConstants.LOG, "bad accuracy of write/load functions (YML); err = %f\n", err );
            this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
        }
    }
};

class Core_ArrayOpTest extends alvision.cvtest.BaseTest {
    run(iii: alvision.int): void {
        let errcount = 0;

        // dense matrix operations
        {
            let sz3 = [5, 10, 15];
            let A = new alvision.MatND(3, sz3, alvision.MatrixType.CV_32F), B = new alvision.MatND(3, sz3, alvision.MatrixType.CV_16SC4);
            let matA = A, matB = B;
            let rng = new alvision.RNG();
            rng.fill(A, alvision.DistType.UNIFORM, alvision.Scalar.all(-10), alvision.Scalar.all(10));
            rng.fill(B, alvision.DistType.UNIFORM, alvision.Scalar.all(-10), alvision.Scalar.all(10));

            let idx0 = [3, 4, 5], idx1 = [0, 9, 7];
            let val0 = 130;
            let val1 = new alvision.Scalar(-1000, 30, 3, 8);
            idx0.forEach((i) => {
                matA.at<alvision.float>("float", i).set(val0);
            });
        
            //cvSetRealND(&matA, idx0, val0);
            matA.at<alvision.float>("float", idx1[0], idx1[1], idx1[2]).set(-val0);
            //cvSetReal3D(&matA, idx1[0], idx1[1], idx1[2], -val0);
            idx0.forEach((i) => {
                matB.at<alvision.short>("short", i).set(val1.val[0]);
                matB.at<alvision.short>("short", i + 1).set(val1.val[1]);
                matB.at<alvision.short>("short", i + 2).set(val1.val[2]);
                matB.at<alvision.short>("short", i + 3).set(val1.val[3]);
            });
            //cvSetND(&matB, idx0, val1);

            matB.at<alvision.short>("short", idx1[0], idx1[1], idx1[2]).set(-val1.val[0]);
            matB.at<alvision.short>("short", idx1[0], idx1[1], idx1[2 + 1]).set(-val1.val[1]);
            matB.at<alvision.short>("short", idx1[0], idx1[1], idx1[2 + 2]).set(-val1.val[2]);
            matB.at<alvision.short>("short", idx1[0], idx1[1], idx1[2 + 3]).set(-val1.val[3]);
            //cvSet3D(&matB, idx1[0], idx1[1], idx1[2], -val1);
            let matC = new alvision.MatND(matB);

            if (A.at<alvision.float>("float", idx0[0], idx0[1], idx0[2]).get() != val0 ||
                A.at<alvision.float>("float", idx1[0], idx1[1], idx1[2]).get() != -val0 ||
                matA.at<alvision.float>("float", idx0[0], idx0[1], idx0[2]).get() != val0 ||
                matA.at<alvision.float>("float", idx1[0]).get() != -val0 ||
                //cvGetReal3D(&matA, idx0[0], idx0[1], idx0[2]) != val0 ||
                //cvGetRealND(&matA, idx1) != -val0 ||

                new alvision.Scalar(B.at<alvision.Vecs>("Vec4s", idx0[0], idx0[1], idx0[2]).get()) != val1 ||
                new alvision.Scalar(B.at<alvision.Vecs>("Vec4s", idx1[0], idx1[1], idx1[2]).get()).val[0] != -val1 ||
                new alvision.Scalar(matC.at<alvision.Vecs>("Vec4s", idx0[0], idx0[1], idx0[2]).get()) != val1 ||
                new alvision.Scalar(matC.at<alvision.Vecs>("Vec4s", idx1[0]).get()).val[0] != -val1.val[0]) {
                //new alvision.Scalar(cvGet3D(matC, idx0[0], idx0[1], idx0[2])) != val1 ||
                //new alvision.Scalar(cvGetND(matC, idx1)) != -val1) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "one of cvSetReal3D, cvSetRealND, cvSet3D, cvSetND " +
                    "or the corresponding *Get* functions is not correct\n");
                errcount++;
            }
        }
        // test alvision.Mat::forEach
        {
            const dims = [101, 107, 7];
            //typedef alvision.Point3i Pixel;

            let a = alvision.Mat.zeros(3, dims, alvision.MatrixType.CV_32SC3).toMat();
            //InitializerFunctor < Pixel > initializer;
            //a.ptr<alvision.Point3i>("Point3i").forEach<alvision.Point3i>(initializer);

            let total = 0;
            let error_reported = false;
            for (let i0 = 0; i0 < dims[0]; ++i0) {
                for (let i1 = 0; i1 < dims[1]; ++i1) {
                    for (let i2 = 0; i2 < dims[2]; ++i2) {
                        let pixel = a.at<alvision.Point3i>("Point3i", i0, i1, i2).get();
                        if (pixel.x != i0 || pixel.y != i1 || pixel.z != i2) {
                            if (!error_reported) {
                                this.ts.printf(alvision.cvtest.TSConstants.LOG, "forEach is not correct.\n" +
                                    "First error detected at (%d, %d, %d).\n", pixel.x, pixel.y, pixel.z);
                                error_reported = true;
                            }
                            errcount++;
                        }
                        total += pixel.x.valueOf();
                        total += pixel.y.valueOf();
                        total += pixel.z.valueOf();
                    }
                }
            }
            let total2 = 0;
            for (let i = 0; i < dims.length; ++i) {
                total2 += ((dims[i] - 1) * dims[i] / 2) * dims[0] * dims[1] * dims[2] / dims[i];
            }
            if (total != total2) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "forEach is not correct because total is invalid.\n");
                errcount++;
            }
        }

        let rng = new alvision.RNG();

        const MAX_DIM = 5, MAX_DIM_SZ = 10;
        // sparse matrix operations
        for (let si = 0; si < 10; si++) {
            var depth = rng.unsigned().valueOf() % 2 == 0 ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_64F;
            var dims = (rng.unsigned().valueOf() % MAX_DIM) + 1;
            //int i, k, size[MAX_DIM] = { 0}, idx[MAX_DIM] = { 0};
            var size = alvision.NewArray(MAX_DIM, () => 0);
            var idx = alvision.NewArray(MAX_DIM, () => 0);
            var all_idxs = new Array<string>()
            var all_vals = new Array<alvision.double>()
            var all_vals2 = new Array<alvision.double>()
            var min_sidx: string, max_sidx: string;
            var sidx: string;

            var min_val = 0, max_val = 0;

            var p = 1;
            for (let k = 0; k < dims; k++) {
                size[k] = (rng.unsigned().valueOf() % MAX_DIM_SZ) + 1;
                p *= size[k];
            }
            var M = new alvision.SparseMat(dims, size, depth);
            var M0: { [id: string]: alvision.double; } = {};

            var nz0 = rng.unsigned().valueOf() % Math.max(p / 5, 10);
            nz0 = Math.min(Math.max(nz0, 1), p);
            all_vals.length = (nz0);
            all_vals2.length = (nz0);
            var _all_vals = new alvision.Matd(all_vals), _all_vals2 = new alvision.Matd(all_vals2);
            rng.fill(_all_vals, alvision.DistType.UNIFORM, new alvision.Scalar(-1000), new alvision.Scalar(1000));
            if (depth == alvision.MatrixType.CV_32F) {
                let _all_vals_f = new alvision.Mat();
                _all_vals.convertTo(_all_vals_f, alvision.MatrixType.CV_32F);
                _all_vals_f.convertTo(_all_vals, alvision.MatrixType.CV_64F);
            }
            _all_vals.convertTo(_all_vals2, _all_vals2.type(), 2);
            if (depth == alvision.MatrixType.CV_32F) {
                var _all_vals2_f = new alvision.Mat();
                _all_vals2.convertTo(_all_vals2_f, alvision.MatrixType.CV_32F);
                _all_vals2_f.convertTo(_all_vals2, alvision.MatrixType.CV_64F);
            }

            alvision.minMaxLoc(_all_vals, (minVal_, maxVal_, minIdx_, maxIdx_) => { min_val = minVal_.valueOf(); max_val = maxVal_.valueOf(); });
            var _norm0 = alvision.cvtest.norm(_all_vals, alvision.NormTypes.NORM_INF);
            var _norm1 = alvision.cvtest.norm(_all_vals, alvision.NormTypes.NORM_L1);
            var _norm2 = alvision.cvtest.norm(_all_vals, alvision.NormTypes.NORM_L2);

            for (let i = 0; i < nz0; i++) {
                for (; ;) {
                    for (let k = 0; k < dims; k++)
                        idx[k] = rng.unsigned().valueOf() % size[k];
                    sidx = idx2string(idx, dims);
                    if (alvision.countkeys(M0, sidx) == 0)
                        break;
                }
                all_idxs.push(sidx);
                M0[sidx] = all_vals[i];
                if (all_vals[i] == min_val)
                    min_sidx = sidx;
                if (all_vals[i] == max_val)
                    max_sidx = sidx;
                setValue(M, idx, all_vals[i], rng);
                let v = getValue1(M, idx, rng);
                if (v != all_vals[i]) {
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "%d. immediately after SparseMat[%s]=%.20g the current value is %.20g\n",
                        i, sidx, all_vals[i], v);
                    errcount++;
                    break;
                }
            }

            var M2 = new alvision.SparseMat(M);
            let Md = new alvision.MatND();
            M.copyTo(Md);
            let M3 = new alvision.SparseMat(); new alvision.SparseMat(Md).convertTo(M3, Md.type(), 2);

            let nz1 = M.nzcount(), nz2 = M3.nzcount();
            let norm0 = alvision.norm(M, alvision.NormTypes.NORM_INF);
            let norm1 = alvision.norm(M, alvision.NormTypes.NORM_L1);
            let norm2 = alvision.norm(M, alvision.NormTypes.NORM_L2);
            let eps = depth == alvision.MatrixType.CV_32F ? alvision.FLT_EPSILON * 100 : alvision.DBL_EPSILON * 1000;

            if (nz1 != nz0 || nz2 != nz0) {
                errcount++;
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "%d: The number of non-zero elements before/after converting to/from dense matrix is not correct: %d/%d (while it should be %d)\n",
                    si, nz1, nz2, nz0);
                break;
            }

            if (Math.abs(norm0.valueOf() - _norm0.valueOf()) > Math.abs(_norm0.valueOf()) * eps ||
                Math.abs(norm1.valueOf() - _norm1.valueOf()) > Math.abs(_norm1.valueOf()) * eps ||
                Math.abs(norm2.valueOf() - _norm2.valueOf()) > Math.abs(_norm2.valueOf()) * eps) {
                errcount++;
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "%d: The norms are different: %.20g/%.20g/%.20g vs %.20g/%.20g/%.20g\n",
                    si, norm0, norm1, norm2, _norm0, _norm1, _norm2);
                break;
            }

            let n = rng.unsigned().valueOf() % Math.max(p / 5, 10);
            n = Math.min(Math.max(n, 1), p) + nz0;

            for (let i = 0; i < n; i++) {
                let val1: alvision.double, val2: alvision.double, val3: alvision.double, val0: alvision.double;
                if (i < nz0) {
                    sidx = all_idxs[i];
                    string2idx(sidx, idx, dims);
                    val0 = all_vals[i];
                }
                else {
                    for (let k = 0; k < dims; k++)
                        idx[k] = rng.unsigned().valueOf() % size[k];
                    sidx = idx2string(idx, dims);
                    val0 = M0[sidx];
                }
                val1 = getValue1(M, idx, rng);
                val2 = getValue2(M2, idx);
                val3 = getValue1(M3, idx, rng);

                if (val1 != val0 || val2 != val0 || Math.abs(val3.valueOf() - val0.valueOf() * 2) > Math.abs(val0.valueOf() * 2) * alvision.FLT_EPSILON) {
                    errcount++;
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "SparseMat M[%s] = %g/%g/%g (while it should be %g)\n", sidx, val1, val2, val3, val0);
                    break;
                }
            }

            for (let i = 0; i < n; i++) {
                //double val1, val2;
                if (i < nz0) {
                    sidx = all_idxs[i];
                    string2idx(sidx, idx, dims);
                }
                else {
                    for (let k = 0; k < dims; k++)
                        idx[k] = rng.unsigned().valueOf() % size[k];
                    sidx = idx2string(idx, dims);
                }
                eraseValue1(M, idx, rng);
                eraseValue2(M2, idx);
                let val1 = getValue1(M, idx, rng);
                let val2 = getValue2(M2, idx);
                if (val1 != 0 || val2 != 0) {
                    errcount++;
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "SparseMat: after deleting M[%s], it is =%g/%g (while it should be 0)\n", sidx, val1, val2);
                    break;
                }
            }

            let nz = M.nzcount();
            if (nz != 0) {
                errcount++;
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "The number of non-zero elements after removing all the elements = %d (while it should be 0)\n", nz);
                break;
            }

            //int idx1[MAX_DIM], idx2[MAX_DIM];
            var idx1 = new Array<alvision.int>(MAX_DIM);
            var idx2 = new Array<alvision.int>(MAX_DIM);
            var val1 = 0, val2 = 0;
            M3 = new alvision.SparseMat(Md);
            alvision.minMaxLoc(M3, (minVal_, maxVal_, minIdx_, maxIdx_) => { val1 = minVal_.valueOf(); val2 = maxVal_.valueOf(); idx1 = minIdx_; idx2 = maxIdx_ });
            let s1 = idx2string(idx1, dims), s2 = idx2string(idx2, dims);
            if (val1 != min_val || val2 != max_val || s1 != min_sidx || s2 != max_sidx) {
                errcount++;
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "%d. Sparse: The value and positions of minimum/maximum elements are different from the reference values and positions:\n\t" +
                    "(%g, %g, %s, %s) vs (%g, %g, %s, %s)\n", si, val1, val2, s1, s2,
                    min_val, max_val, min_sidx, max_sidx);
                break;
            }

            alvision.minMaxIdx(Md, (minVal_, maxVal_, minIdx_, maxIdx_) => { val1 = minVal_.valueOf(); val2 = maxVal_.valueOf(); idx1 = minIdx_; idx2 = maxIdx_; });
            s1 = idx2string(idx1, dims), s2 = idx2string(idx2, dims);
            if ((min_val < 0 && (val1 != min_val || s1 != min_sidx)) ||
                (max_val > 0 && (val2 != max_val || s2 != max_sidx))) {
                errcount++;
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "%d. Dense: The value and positions of minimum/maximum elements are different from the reference values and positions:\n\t" +
                    "(%g, %g, %s, %s) vs (%g, %g, %s, %s)\n", si, val1, val2, s1, s2,
                    min_val, max_val, min_sidx, max_sidx);
                break;
            }
        }

        this.ts.set_failed_test_info(errcount == 0 ? alvision.cvtest.FailureCode.OK : alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
    }
}





function idx2string(idx: Array<alvision.int>, dims: alvision.int) : string
{
    //char buf[256];
    //char* ptr = buf;
    var buf = "";
    for( let k = 0; k < dims; k++ )
    {
        buf += util.format("%4d ", idx[k]);
        //ptr += strlen(ptr);
    }
    //ptr[-1] = '\0';
    return buf;// string(buf);
}

function string2idx(s: string, idx: Array<alvision.int>, dims: alvision.int ): Array<alvision.int>
{
    let sparts = s.split(' ').filter(function (el) { return el.length != 0 });
    for (let k = 0; k < dims; k++) {
        idx[k] = parseInt( sparts[k]);
    }
    return idx;
}

function getValue1(M: alvision.SparseMat, idx : Array<alvision.int>, rng: alvision.RNG) : alvision.double
{
    let d = M.dims();
    //size_t hv = 0, *
    var phv = 0;
    if(rng.unsigned().valueOf() % 2 )
    {
        let hv = d == 2 ? M.hash(idx[0], idx[1]) :
        d == 3 ? M.hash(idx[0], idx[1], idx[2]) : M.hash(idx);
        phv = hv.valueOf();
    }

    if (M.type() == alvision.MatrixType.CV_32F) {
        let pf = d == 2 ? M.ptr<alvision.float>("float", idx[0], idx[1], false, phv) :
            d == 3 ? M.ptr<alvision.float>("float", idx[0], idx[1], idx[2], false, phv) :
                M.ptr<alvision.float>("float", idx, false, phv);
        return pf.get();
    } else if (M.type() == alvision.MatrixType.CV_64F) {
        let pd = d == 2 ? M.ptr<alvision.double>("double", idx[0], idx[1], false, phv) :
            d == 3 ? M.ptr<alvision.double>("double", idx[0], idx[1], idx[2], false, phv) :
                M.ptr<alvision.double>("double", idx, false, phv);
        return pd.get();
    }
    else {
        throw new Error("not implemented");
    }

}

function getValue2(M: alvision.SparseMat, idx: Array<alvision.int>) : alvision.double
{
    let type = 0;
    if (M.type() == alvision.MatrixType.CV_32F) {
        return M.ref<alvision.float>("float", idx).get();
    } else if (M.type() == alvision.MatrixType.CV_64F) {
        return M.ref<alvision.double>("double", idx).get();
    }
    else {
        throw new Error("not implemented");
    }
}

function eraseValue1(M: alvision.SparseMat, idx: Array<alvision.int>, rng: alvision.RNG) : void
{
    let d = M.dims();
    //size_t hv = 0, *
    let phv = 0;
    if( rng.unsigned().valueOf() % 2 )
    {
        let hv = d == 2 ? M.hash(idx[0], idx[1]) :
        d == 3 ? M.hash(idx[0], idx[1], idx[2]) : M.hash(idx);
        phv = hv.valueOf();
    }

    if( d == 2 )
        M.erase(idx[0], idx[1], phv);
    else if( d == 3 )
        M.erase(idx[0], idx[1], idx[2], phv);
    else
        M.erase(idx, phv);
}

function eraseValue2(M: alvision.SparseMat, idx: Array<alvision.int>) : void
{
    M.erase(idx);
    //cvClearND(M, idx);
}

function setValue(M: alvision.SparseMat, idx: Array<alvision.int>, value: alvision.double, rng: alvision.RNG ) : void
{
    let d = M.dims();
    //size_t hv = 0, *
    let phv = 0;
    if( rng.unsigned().valueOf() % 2 )
    {
        let hv = d == 2 ? M.hash(idx[0], idx[1]) :
        d == 3 ? M.hash(idx[0], idx[1], idx[2]) : M.hash(idx);
        phv = hv.valueOf();
    }

    //let p = d == 2 ? M.ptr(idx[0], idx[1], true, phv) :
    //    d == 3 ? M.ptr(idx[0], idx[1], idx[2], true, phv) :
    //        M.ptr(idx, true, phv);


    //uchar* ptr = d == 2 ? M.ptr(idx[0], idx[1], true, phv) :
    //d == 3 ? M.ptr(idx[0], idx[1], idx[2], true, phv) :
    //M.ptr(idx, true, phv);
    //if (M.type() == alvision.MatrixType.CV_32F )
    //    *(float*)ptr = (float)value;
    //else if (M.type() == alvision.MatrixType.CV_64F )
    //    *(double*)ptr = value;
    //else
    if (M.type() == alvision.MatrixType.CV_32F) {
        M.ptr<alvision.float>("float", idx, true).set(value);
    } else if (M.type() == alvision.MatrixType.CV_64F){
        M.ptr<alvision.double>("double", idx, true).set(value);
    }else{
        alvision.CV_Error(alvision.cv.Error.Code.StsUnsupportedFormat, "");
    }
}

//template<typename Pixel>
class InitializerFunctor{
    /// Initializer for alvision.Mat::forEach test
    run(pixel: alvision.Point3i, idx: Array<alvision.int>): void  {
        pixel.x = idx[0];
        pixel.y = idx[1];
        pixel.z = idx[2];
    }
};


//template <class ElemType>
function calcDiffElemCountImpl<ElemType>(ElemTypename : string, mv: Array<alvision.Mat>, m: alvision.Mat ): alvision.int 
{
    let diffElemCount = 0;
    const  mChannels = m.channels();
    for(let y = 0; y < m.rows; y++)
    {
        for(let x = 0; x < m.cols; x++)
        {
            const mElem = m.at<ElemType>(ElemTypename, y,x*mChannels.valueOf());
            var loc = 0;
            for(let i = 0; i < mv.length; i++)
            {
                const mvChannel = mv[i].channels();
                const mvElem = mv[i].at<ElemType>(ElemTypename, y,x*mvChannel.valueOf());
                for(let li = 0; li < mvChannel; li++)
                    if(mElem[loc + li] != mvElem[li])
                        diffElemCount++;
                loc += mvChannel.valueOf();
            }
            alvision.CV_Assert(()=>loc == mChannels);
        }
    }
    return diffElemCount;
}

//static
function calcDiffElemCount(mv: Array<alvision.Mat>, m: alvision.Mat ): alvision.int 
{
    var depth = m.depth();
    switch (depth)
    {
        case alvision.MatrixType.CV_8U:
        return calcDiffElemCountImpl<alvision.uchar>("uchar",mv, m);
        case alvision.MatrixType.CV_8S:
        return calcDiffElemCountImpl<alvision.char>("char",mv, m);
        case alvision.MatrixType.CV_16U:
        return calcDiffElemCountImpl<alvision.ushort>("ushort", mv, m);
        case alvision.MatrixType.CV_16S:
        return calcDiffElemCountImpl<alvision.short>("short", mv, m);
        case alvision.MatrixType.CV_32S:
        return calcDiffElemCountImpl<alvision.int>("int", mv, m);
        case alvision.MatrixType.CV_32F:
        return calcDiffElemCountImpl<alvision.float>("float", mv, m);
        case alvision.MatrixType.CV_64F:
        return calcDiffElemCountImpl<alvision.double>("double", mv, m);
    }

    return alvision.INT_MAX;
}

class Core_MergeSplitBaseTest  extends alvision.cvtest.BaseTest
{
    run_case(depth: alvision.int, channels: alvision.size_t, size: alvision.Size, rng: alvision.RNG): alvision.int {
        throw new Error("not implemented");
    }

    run(iii: alvision. int) : void
    {
        // m is Mat
        // mv is Array<Mat>
        const  minMSize = 1;
        const  maxMSize = 100;
        const maxMvSize = 10;

        var rng = alvision.theRNG();
        var mSize = new alvision.Size (rng.uniform(minMSize, maxMSize), rng.uniform(minMSize, maxMSize));
        var mvSize = rng.uniform(1, maxMvSize);

        var res = alvision.cvtest.FailureCode.OK, curRes = <any>res;
        curRes = this.run_case(alvision.MatrixType.CV_8U, mvSize, mSize, rng);
        res = curRes != alvision.cvtest.FailureCode.OK ? curRes : res;

        curRes = this.run_case(alvision.MatrixType.CV_8S, mvSize, mSize, rng);
        res = curRes != alvision.cvtest.FailureCode.OK ? curRes : res;

        curRes = this.run_case(alvision.MatrixType.CV_16U, mvSize, mSize, rng);
        res = curRes != alvision.cvtest.FailureCode.OK ? curRes : res;

        curRes = this.run_case(alvision.MatrixType.CV_16S, mvSize, mSize, rng);
        res = curRes != alvision.cvtest.FailureCode.OK ? curRes : res;

        curRes = this.run_case(alvision.MatrixType.CV_32S, mvSize, mSize, rng);
        res = curRes != alvision.cvtest.FailureCode.OK ? curRes : res;

        curRes = this.run_case(alvision.MatrixType.CV_32F, mvSize, mSize, rng);
        res = curRes != alvision.cvtest.FailureCode.OK ? curRes : res;

        curRes = this.run_case(alvision.MatrixType.CV_64F, mvSize, mSize, rng);
        res = curRes != alvision.cvtest.FailureCode.OK ? curRes : res;

        this.ts.set_failed_test_info(res);
    }
};

class Core_MergeTest extends Core_MergeSplitBaseTest
{
    run_case(depth : alvision.int, matCount : alvision.size_t, size : alvision.Size, rng : alvision.RNG) : alvision.int 
    {
        const maxMatChannels = 10;

        var src = new Array<alvision.Mat>(matCount.valueOf());
        var channels = 0;
        for (let i = 0; i < src.length; i++)
        {
            let m = new alvision.Mat(size, alvision.MatrixType.CV_MAKETYPE(depth, rng.uniform(1,maxMatChannels)));
            rng.fill(m, alvision.DistType.UNIFORM, 0, 100, true);
            channels = channels +  m.channels().valueOf();
            src[i] = m;
        }

        let dst = new alvision.Mat();
        alvision.merge(src, dst);

        // check result
        let commonLog = "";
        commonLog  += "Depth " + depth + " :";
        if(dst.depth() != depth)
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "%s incorrect depth of dst (%d instead of %d)\n",
                       commonLog, dst.depth(), depth);
            return alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
        }
        if(dst.size() != size)
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "%s incorrect size of dst (%d x %d instead of %d x %d)\n",
                       commonLog, dst.rows, dst.cols, size.height, size.width);
            return alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
        }
        if(dst.channels() != channels)
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "%s: incorrect channels count of dst (%d instead of %d)\n",
                       commonLog, dst.channels(), channels);
            return alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
        }

        let diffElemCount = calcDiffElemCount(src, dst);
        if(diffElemCount > 0)
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "%s: there are incorrect elements in dst (part of them is %f)\n",
                       commonLog,(diffElemCount.valueOf())/(channels*size.area().valueOf()));
            return alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
        }

        return alvision.cvtest.FailureCode.OK;
    }
};

class Core_SplitTest extends Core_MergeSplitBaseTest
{
    run_case(depth: alvision.int, channels: alvision.size_t, size: alvision.Size, rng: alvision.RNG ) : alvision.int
    {
        let src = new alvision.Mat(size, alvision.MatrixType.CV_MAKETYPE(depth, channels));
        rng.fill(src, alvision.DistType.UNIFORM, 0, 100, true);

        let dst = new Array<alvision.Mat>();
        alvision.split(src, dst);

        // check result
        let commonLog = "";
        commonLog += "Depth " + depth + " :";
        if(dst.length != channels)
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "%s incorrect count of matrices in dst (%d instead of %d)\n",
                       commonLog, dst.length, channels);
            return alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
        }
        for (let i = 0; i < dst.length; i++)
        {
            if(dst[i].size() != size)
            {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "%s incorrect size of dst[%d] (%d x %d instead of %d x %d)\n",
                           commonLog, i, dst[i].rows, dst[i].cols, size.height, size.width);
                return alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
            }
            if(dst[i].depth() != depth)
            {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "%s: incorrect depth of dst[%d] (%d instead of %d)\n",
                           commonLog, i, dst[i].depth(), depth);
                return alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
            }
            if(dst[i].channels() != 1)
            {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "%s: incorrect channels count of dst[%d] (%d instead of %d)\n",
                           commonLog, i, dst[i].channels(), 1);
                return alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
            }
        }

        let diffElemCount = calcDiffElemCount(dst, src);
        if(diffElemCount > 0)
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "%s: there are incorrect elements in dst (part of them is %f)\n",
                       commonLog, (diffElemCount.valueOf())/(channels.valueOf()*size.area().valueOf()));
            return alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
        }

        return alvision.cvtest.FailureCode.OK;
    }
};

alvision.cvtest.TEST('Core_PCA', 'accuracy', () => { var test = new Core_PCATest(); test.safe_run(); });
alvision.cvtest.TEST('Core_Reduce', 'accuracy', () => { var test = new Core_ReduceTest(); test.safe_run(); });
alvision.cvtest.TEST('Core_Array', 'basic_operations', () => { var test = new Core_ArrayOpTest(); test.safe_run(); });

alvision.cvtest.TEST('Core_Merge', 'shape_operations', () => { var test = new Core_MergeTest(); test.safe_run(); });
alvision.cvtest.TEST('Core_Split', 'shape_operations', () => { var test = new Core_SplitTest(); test.safe_run(); });


alvision.cvtest.TEST('Core_IOArray', 'submat_assignment', () => {
    let A = new alvision.Matf(alvision.Matf.zeros(2, 2));
    let B = new alvision.Matf(alvision.Matf.ones(1, 3));

    alvision.EXPECT_THROW(()=>B.colRange(0, 3).copyTo(A.row(0)));

    alvision.EXPECT_NO_THROW(()=>B.colRange(0, 2).copyTo(A.row(0)));

    alvision.EXPECT_EQ(1.0, A.Element(0, 0));
    alvision.EXPECT_EQ(1.0, A.Element(0, 1));
});

function OutputArray_create1(m: alvision.OutputArray) : void{ m.create(1, 2,   alvision.MatrixType.CV_32S); }
function OutputArray_create2( m : alvision.OutputArray) : void{ m.create(1, 3, alvision.MatrixType.CV_32F); }

alvision.cvtest.TEST('Core_IOArray', 'submat_create', () => {
    let A = new alvision.Matf(alvision.Matf.zeros(2, 2));

    alvision.EXPECT_THROW(()=>OutputArray_create1(A.row(0)));
    alvision.EXPECT_THROW(()=>OutputArray_create2(A.row(0)));
});

alvision.cvtest.TEST('Core_Mat', 'reshape_1942',()=>
{
    let A = (new alvision.Matf(2, 3, [3.4884074, 1.4159607, 0.78737736, 2.3456569, -0.88010466, 0.3009364]));
    let cn = 0;
    alvision.ASSERT_NO_THROW(() => {
        let M = A.reshape(3);
        cn = M.channels().valueOf();
    }
    );
    alvision.ASSERT_EQ(1, cn);
});

alvision.cvtest.TEST('Core_Mat', 'copyNx1ToVector', () => {
    let src = new alvision.Matb(5, 1, [1, 2, 3, 4, 5]);
    let ref_dst8 = new alvision.Matb();
    let ref_dst16 = new alvision.Matw();
    let dst8 = new Array<alvision.uchar>();
    let dst16 = new Array<alvision.ushort>();

    src.copyTo(ref_dst8);
    src.copyTo(dst8);

    alvision.cvtest.ASSERT_PRED_FORMAT2(new alvision.cvtest.MatComparator(0, 0).run(ref_dst8, new alvision.Matb(dst8)));

    src.convertTo(ref_dst16, alvision.MatrixType.CV_16U);
    src.convertTo(dst16, alvision.MatrixType.CV_16U);

    alvision.cvtest.ASSERT_PRED_FORMAT2(new alvision.cvtest.MatComparator(0, 0).run(ref_dst16, new alvision.Matw(dst16)));
});

alvision.cvtest.TEST('Core_Matx', 'fromMat_', () => {
    let a = new alvision.Matd(2, 2, [10, 11, 12, 13]);
    let b = (a);
    alvision.ASSERT_EQ(alvision.norm(a, b,alvision.NormTypes. NORM_INF), 0.);
});

alvision.cvtest.TEST('Core_InputArray', 'empty', () => {
    let data = new Array<Array<alvision.Point>>();
    alvision.ASSERT_TRUE(data.length > 0);
});

alvision.cvtest.TEST('Core_CopyMask', 'bug1918', () => {
    let tmpSrc = new alvision.Matb(100, 100);
    tmpSrc.setTo(124);
    let tmpMask = new alvision.Matb(100, 100);
    tmpMask.setTo(255);
    let  tmpDst = new alvision.Matb(100, 100);
    tmpDst.setTo(2);
    tmpSrc.copyTo(tmpDst, tmpMask);
    alvision.ASSERT_EQ(alvision.sum(tmpDst).val[0], 124 * 100 * 100);
});

alvision.cvtest.TEST('Core_SVD', 'orthogonality',()=>
{
    for( let i = 0; i < 2; i++ )
    {
    let type = i == 0 ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_64F;
    let mat_D = new alvision.Mat(2, 2, type);
        mat_D.setTo(88.);
        let mat_U = new alvision.Mat(), mat_W = new alvision.Mat();
        alvision.SVD.compute(mat_D, mat_W, mat_U, null,alvision.SVDFlags.FULL_UV);
        mat_U = alvision.MatExpr.op_Multiplication(mat_U, mat_U.t()).toMat();
        alvision.ASSERT_LT(alvision.norm(mat_U, alvision.Mat.eye(2, 2, type),alvision.NormTypes. NORM_INF), 1e-5);
    }
});


alvision.cvtest.TEST('Core_SparseMat', 'footprint',()=>
{
    let n = 1000000;
    let sz = [n, n];
    let m = new alvision.SparseMat(2, sz, alvision.MatrixType.CV_64F);

    let nodeSize0 = m.hdr.nodeSize;
    let dataSize0 = (m.hdr.pool.length + m.hdr.hashtab.length * 1e-6);
    console.log(util.format("before: node size=%d bytes, data size=%.0f Mbytes\n", nodeSize0, dataSize0));

    for (let i = 0; i < n; i++)
    {
        m.ref<alvision.double>("double", i, i).set(1);
    }

    let dataSize1 = (m.hdr.pool.length + m.hdr.hashtab.length*1e-6);
    let threshold = (n*nodeSize0.valueOf() *1.6 + n*2.*1e-6);
    console.log(util.format("after: data size=%.0f Mbytes, threshold=%.0f MBytes\n", dataSize1, threshold));

    alvision.ASSERT_LE(m.hdr.nodeSize, 32);
    alvision.ASSERT_LE(dataSize1, threshold);
});