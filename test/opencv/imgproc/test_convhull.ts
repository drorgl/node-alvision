//TODO: 2nd stage
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

///*static int
//cvTsPointConvexPolygon( CvPoint2D32f pt, CvPoint2D32f* v, int n )
//{
//    CvPoint2D32f v0 = v[n-1];
//    int i, sign = 0;

//    for( i = 0; i < n; i++ )
//    {
//        CvPoint2D32f v1 = v[i];
//        float dx = pt.x - v0.x, dy = pt.y - v0.y;
//        float dx1 = v1.x - v0.x, dy1 = v1.y - v0.y;
//        double t = dx*dy1 - dx1*dy;
//        if( Math.abs(t) > DBL_EPSILON )
//        {
//            if( t*sign < 0 )
//                break;
//            if( sign == 0 )
//                sign = t < 0 ? -1 : 1;
//        }
//        else if( Math.abs(dx) + Math.abs(dy) < DBL_EPSILON )
//            return i+1;
//        v0 = v1;
//    }

//    return i < n ? -1 : 0;
//}*/

//function cvTsDist(a: alvision.Point2f, b: alvision.Point2f) : alvision.double
//{
//    var dx = a.x.valueOf() - b.x.valueOf();
//    var dy = a.y.valueOf() - b.y.valueOf();
//    return Math.sqrt(dx*dx + dy*dy);
//}

//function cvTsPtLineDist(pt: alvision.Point2f, a: alvision.Point2f, b: alvision.Point2f) :  alvision.double
//{
//    var d0 = cvTsDist( pt, a ), d1;
//    var dd = cvTsDist( a, b );
//    if( dd < alvision.FLT_EPSILON )
//        return d0;
//    d1 = cvTsDist( pt, b );
//    dd = Math.abs((pt.x.valueOf() - a.x.valueOf())*(b.y.valueOf() - a.y.valueOf()) - (pt.y.valueOf() - a.y.valueOf())*(b.x.valueOf() - a.x.valueOf()))/dd.valueOf();
//    d0 = Math.min( d0.valueOf(), d1 );
//    return Math.min( d0.valueOf(), dd.valueOf() );
//}

//function cvTsPointPolygonTest(pt: alvision.Point2f, vv: Array<alvision.Point2f>, n: alvision.int, cb: (_idx: alvision.int, _on_edge: alvision.int)=>void ) : alvision.double
//{
//    var i;
//    let v = vv[n.valueOf() - 1];
//    var min_dist_num = alvision.FLT_MAX, min_dist_denom = 1;
//    var min_dist_idx = -1, min_on_edge = 0;
//    var counter = 0;
//    var result;

//    for( i = 0; i < n.valueOf(); i++ )
//    {
//        var dx, dy, dx1, dy1, dx2, dy2, dist_num, dist_denom = 1;
//        var on_edge = 0, idx = i;

//        let v0 = v; v = vv[i];
//        dx = v.x.valueOf() - v0.x.valueOf(); dy = v.y.valueOf() - v0.y.valueOf();
//        dx1 = pt.x.valueOf() - v0.x.valueOf(); dy1 = pt.y.valueOf() - v0.y.valueOf();
//        dx2 = pt.x.valueOf() - v.x.valueOf(); dy2 = pt.y.valueOf() - v.y.valueOf();

//        if( dx2*dx + dy2*dy >= 0 )
//            dist_num = dx2*dx2 + dy2*dy2;
//        else if( dx1*dx + dy1*dy <= 0 )
//        {
//            dist_num = dx1*dx1 + dy1*dy1;
//            idx = i - 1;
//            if( idx < 0 ) idx = n.valueOf()-1;
//        }
//        else
//        {
//            dist_num = (dy1*dx - dx1*dy);
//            dist_num *= dist_num;
//            dist_denom = dx*dx + dy*dy;
//            on_edge = 1;
//        }

//        if( dist_num*min_dist_denom < min_dist_num*dist_denom )
//        {
//            min_dist_num = dist_num;
//            min_dist_denom = dist_denom;
//            min_dist_idx = idx;
//            min_on_edge = on_edge;
//            if( min_dist_num == 0 )
//                break;
//        }

//        if( (v0.y <= pt.y && v.y <= pt.y) ||
//            (v0.y > pt.y && v.y > pt.y) ||
//            (v0.x < pt.x && v.x < pt.x) )
//            continue;

//        dist_num = dy1*dx - dx1*dy;
//        if( dy < 0 )
//            dist_num = -dist_num;
//        counter += (dist_num > 0) ? 1 : 0;
//    }

//    result = Math.sqrt(min_dist_num/min_dist_denom);
//    if( counter % 2 == 0 )
//        result = -result;

//    cb(min_dist_idx, min_on_edge);

//    return result;
//}

//function cvTsMiddlePoint(a: alvision.Point2f, b: alvision.Point2f ) : alvision.Point2f
//{
//    return new alvision.Point2f((a.x.valueOf() + b.x.valueOf()) / 2, (a.y.valueOf() + b.y.valueOf()) / 2);
//}

//function cvTsIsPointOnLineSegment(x: alvision.Point2f, a: alvision.Point2f, b: alvision.Point2f ) : boolean
//{
//    var d1 = cvTsDist(new alvision.Point( x.x,  x.y),new alvision.Point( a.x,  a.y));
//    var d2 = cvTsDist(new alvision.Point( x.x,  x.y),new alvision.Point( b.x,  b.y));
//    var d3 = cvTsDist(new alvision.Point( a.x,  a.y),new alvision.Point( b.x,  b.y));

//    return (Math.abs(d1.valueOf() + d2.valueOf() - d3.valueOf()) <= (1E-5));
//}


///****************************************************************************************\
//*                              Base class for shape descriptor tests                     *
//\****************************************************************************************/

//class CV_BaseShapeDescrTest  extends alvision.cvtest.BaseTest
//{
//    constructor() {
//        super();
//        this.points1 = null;
//        this.points2 = null;
//        this.points = null;
//        //this.storage = null;
//        this.test_case_count = 500;
//        this.min_log_size = 0;
//        this.max_log_size = 10;
//        this.low = this.high = alvision.Scalar.all(0);
//        this.low_high_range = 50;
//        this.dims = 2;
//        this.enable_flt_points = true;

//        //this.test_cpp = false;
//    }

//    clear(): void {
//        super.clear();
//        //cvReleaseMemStorage( &storage);
//        //cvReleaseMat( &points2);
//        this.points2 = null;
//        //points1 = 0;
//        this.points1 = null;
//        //points = 0;
//        this.points = null;
//    }

//    read_params(fs: alvision.FileStorage): alvision.int {
//        var code = super.read_params(fs);
//        if (code < 0)
//            return code;

//        this.test_case_count = alvision.cvReadInt(this.find_param(fs, "struct_count"), this.test_case_count);
//        this.min_log_size =    alvision.cvReadInt(this.find_param(fs, "min_log_size"), this.min_log_size);
//        this.max_log_size =    alvision.cvReadInt(this.find_param(fs, "max_log_size"), this.max_log_size);

//        this.min_log_size = alvision.cvtest.clipInt(this.min_log_size, 0, 8);
//        this.max_log_size = alvision.cvtest.clipInt(this.max_log_size, 0, 10);
//        if (this.min_log_size > this.max_log_size) {
//            let t = this.min_log_size; this.min_log_size = this.max_log_size; this.max_log_size = t;
//            //CV_SWAP(this.min_log_size, this.max_log_size, t);
//        }

//        return 0;
//    }

//    run_func() : void {}
//    prepare_test_case(test_case_idx: alvision.int): alvision.int{
//        //int size;
//        //int use_storage = 0;
//        //int point_type;
//        //int i;
//        var rng = this.ts.get_rng();

//        super.prepare_test_case(test_case_idx);

//        this.clear();
//        let size = Math.round(Math.exp((alvision.cvtest.randReal(rng).valueOf() * (this.max_log_size.valueOf() - this.min_log_size.valueOf()) + this.min_log_size.valueOf()) * Math.LOG2E));
//        let use_storage = alvision.cvtest.randInt(rng).valueOf() % 2;
//        let point_type = alvision.MatrixType.CV_MAKETYPE(alvision.cvtest.randInt(rng).valueOf() %
//            (this.enable_flt_points ? 2 : 1) ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_32S,this. dims);

//        if (use_storage) {
//            //storage = cvCreateMemStorage((alvision.cvtest.randInt(rng).valueOf() % 10 + 1) * 1024);
//            this.points1 = new Array<Array<alvision.Point>>();
//            //points1 = cvCreateSeq(point_type, sizeof(CvSeq), CV_ELEM_SIZE(point_type), storage);
//            //cvSeqPushMulti(points1, 0, size);
//            this.points = this.points1;
//        }
//        else {
//            let rows = 1, cols = size;
//            if (alvision.cvtest.randInt(rng).valueOf() % 2)
//                rows = size, cols = 1;

//            this.points2 = new alvision.Mat(rows, cols, point_type);
//            this.points = this.points2;
//        }

//        for (let i = 0; i < 4; i++) { 
//            this.low.val[i] = (alvision.cvtest.randReal(rng).valueOf() - 0.5) *  this.low_high_range.valueOf() * 2;
//            this.high.val[i] = (alvision.cvtest.randReal(rng).valueOf() - 0.5) * this.low_high_range.valueOf() * 2;
//            if (this.low.val[i] > this.high.val[i]) {
//                //double t;
//                let t = this.low.val[i]; this.low.val[i] = this.high.val[i]; this.high.val[i] = t;
//                //CV_SWAP(low.val[i], high.val[i], t);
//            }
//            if (this.high.val[i] < this.low.val[i].valueOf() + 1)
//                this.high.val[i] = this.high.val[i].valueOf() + 1;
//        }

//        this.generate_point_set(this.points);

//        //this.test_cpp = (alvision.cvtest.randInt(rng).valueOf() & 16) == 0;
//        return 1;
//    }
//    validate_test_results(test_case_idx: alvision.int): alvision.int {
//        this.extract_points();
//        return 0;
//    }
//    generate_point_set(  points ) : void {
//        var rng = this.ts.get_rng();
//        //int i, k, n, total, point_type;
//        //CvSeqReader reader;
//        //uchar* data = 0;
//        //double a[4], b[4];
//        let a = new Array<alvision.double>();
//        let b = new Array<alvision.double>();

//        for(let k = 0; k < 4; k++ )
//        {
//            a[k] = this.high.val[k].valueOf() - this.low.val[k].valueOf();
//            b[k] = this.low.val[k];
//        }
//    //memset( &reader, 0, sizeof(reader) );

//    //if (CV_IS_SEQ(pointsSet)) {
//    //    CvSeq * ptseq = (CvSeq *)pointsSet;
//    //    total = ptseq.total;
//    //    point_type = CV_SEQ_ELTYPE(ptseq);
//    //    cvStartReadSeq(ptseq, &reader);
//    //}
//    //else {
//        //CvMat * ptm = (CvMat *)pointsSet;
//        let ptm = this.pointsSet;
//        alvision.assert(()=>alvision.MatrixType.CV_IS_MAT(ptm) && alvision.MatrixType.CV_IS_MAT_CONT(ptm.type));
//        let total = ptm.rows + ptm.cols - 1;
//        let point_type = alvision.MatrixType.CV_MAT_TYPE(ptm.type);
//        let data = ptm.data.ptr;
//    //}

//    let n = alvision.MatrixType.CV_MAT_CN(point_type);
//    point_type = alvision.MatrixType. CV_MAT_DEPTH(point_type);

//    alvision.assert(()=>(point_type == alvision.MatrixType.CV_32S || point_type == alvision.MatrixType.CV_32F) && n <= 4);

//    for (let i = 0; i < total; i++) {
//        int * pi;
//        float * pf;
//        if (reader.ptr) {
//            pi = (int *)reader.ptr;
//            pf = (float *)reader.ptr;
//            CV_NEXT_SEQ_ELEM(reader.seq.elem_size, reader);
//        }
//        else {
//            pi = (int *)data + i * n;
//            pf = (float *)data + i * n;
//        }
//        if (point_type == alvision.MatrixType.CV_32S)
//            for (let k = 0; k < n; k++)
//                pi[k] = Math.round(alvision.cvtest.randReal(rng).valueOf() * a[k] + b[k]);
//        else
//            for (let k = 0; k < n; k++)
//                pf[k] = (alvision.cvtest.randReal(rng).valueOf() * a[k] + b[k]);
//    }
//    }
//    extract_points(): void {
//        if (this.points1) {
//            this.points2 = new alvision.Mat(1, this.points1.total, CV_SEQ_ELTYPE(points1));
//            cvCvtSeqToArray(this.points1, this.points2.data.ptr);
//        }

//        if (alvision.MatrixType.CV_MAT_DEPTH(this.points2.type) != alvision.MatrixType.CV_32F && this.enable_flt_points) {
//            let tmp = new alvision.Mat(this.points2.rows, this.points2.cols,
//                (this.points2.type & ~CV_MAT_DEPTH_MASK) | alvision.MatrixType.CV_32F, this.points2.data.ptr);

//            alvision.convertScaleAbs(this.points2, tmp);
//            //cvConvert(points2, &tmp);
//        }
//    }

//    protected min_log_size: alvision.int;
//    protected max_log_size: alvision.int;
//    protected dims: alvision.int;
//    protected enable_flt_points: boolean;

//    //protected CvMemStorage* storage;
//    protected points1: Array<Array<alvision.Point>>;
//    protected points2: alvision.Mat//CvMat* 
//    protected points: Array<Array<alvision.Point>>;
//    //protected void* result;
//    protected low_high_range: alvision.double;
//    protected low: alvision.Scalar;
//    protected high: alvision.Scalar;

//    protected test_cpp: boolean;
//};





///****************************************************************************************\
//*                                     Convex Hull Test                                   *
//\****************************************************************************************/

//class CV_ConvHullTest extends CV_BaseShapeDescrTest
//{
//    constructor() {
//        super();
//        this.hull1 = null;
//        this.hull2 = null;
//        this.hull_storage = 0;
//        this.orientation = this.return_points = 0;
//    }

//    clear(): void {
//        super.clear();
//        this.hull2 = null;
//        this.hull1 = null;
//        this.hull_storage = 0;
//    }

//    run_func(): void {
//        //if (!this.test_cpp)
//        //    this.hull1 = alvision.convexHull/* cvConvexHull2*/(this.points, this.hull_storage, orientation, this.return_points);
//        //else {
//            let _points = this.points;
//            let clockwise = orientation == alvision.ShapeOrientation.CLOCKWISE;
//            let n = 0;
//            if (!this.return_points) {
//                let _hull = new Array<alvision.int>();
//                alvision.convexHull(_points, _hull, clockwise);
//                n = _hull.length;
//                memcpy(this.hull2.data.ptr, _hull[0], n * sizeof(_hull[0]));
//            }
//            else if (_points.type() == alvision.MatrixType.CV_32SC2) {
//                let _hull = new Array<alvision.Point>();
//                alvision.convexHull(_points, _hull, clockwise);
//                n = _hull.length;
//                memcpy(hull2.data.ptr, &_hull[0], n * sizeof(_hull[0]));
//            }
//            else if (_points.type() == alvision.MatrixType.CV_32FC2) {
//                let _hull = new Array<alvision.Point2f>();
//                alvision.convexHull(_points, _hull, clockwise);
//                n = _hull.length;
//                memcpy(hull2.data.ptr, &_hull[0], n * sizeof(_hull[0]));
//            }
//            if (this.hull2.rows > this.hull2.cols)
//                this.hull2.rows = n;
//        else
//    hull2.cols = n;
////}
//    }
//    prepare_test_case(test_case_idx: alvision.int): alvision.int{
//        let code = super.prepare_test_case(test_case_idx);
//        let use_storage_for_hull = 0;
//        var rng = this.ts.get_rng();

//        if (code <= 0)
//            return code;

//        this.orientation = alvision.cvtest.randInt(rng).valueOf() % 2 ? alvision.ShapeOrientation.CLOCKWISE : alvision.ShapeOrientation.COUNTER_CLOCKWISE;
//        this.return_points = alvision.cvtest.randInt(rng).valueOf() % 2;

//        use_storage_for_hull = (alvision.cvtest.randInt(rng).valueOf() % 2) && !test_cpp;
//        if (use_storage_for_hull) {
//            if (!storage)
//                storage = cvCreateMemStorage((alvision.cvtest.randInt(rng).valueOf() % 10 + 1) * 1024);
//            hull_storage = storage;
//        }
//        else {
//            //int rows, cols;
//            let sz = points1 ? points1.total : points2.cols + points2.rows - 1;
//            let point_type = points1 ? CV_SEQ_ELTYPE(points1) : CV_MAT_TYPE(points2.type);

//            if (alvision.cvtest.randInt(rng).valueOf() % 2)
//                rows = sz, cols = 1;
//            else
//                rows = 1, cols = sz;

//            hull2 = cvCreateMat(rows, cols, return_points ? point_type : CV_32SC1);
//            hull_storage = hull2;
//        }

//        return code;
//    }
//    validate_test_results(test_case_idx : alvision.int) : alvision.int {
//        let code = super.validate_test_results(test_case_idx);
//        let hull: alvision.Mat = null;
//        let mask: alvision.Mat = null;
//        //int i, point_count, hull_count;
//        //CvPoint2D32f * p, *h;
//        //CvSeq header, hheader, *ptseq, *hseq;
//        //CvSeqBlock block, hblock;

//        if (this.points1)
//            ptseq = points1;
//        else
//            ptseq = cvMakeSeqHeaderForArray(CV_MAT_TYPE(points2.type),
//                sizeof(CvSeq), CV_ELEM_SIZE(points2.type), points2.data.ptr,
//                points2.rows + points2.cols - 1, &header, &block);
//        point_count = ptseq.total;
//        p = (CvPoint2D32f *)(points2.data.ptr);

//        if (hull1)
//            hseq = hull1;
//        else
//            hseq = cvMakeSeqHeaderForArray(CV_MAT_TYPE(hull2.type),
//                sizeof(CvSeq), CV_ELEM_SIZE(hull2.type), hull2.data.ptr,
//                hull2.rows + hull2.cols - 1, &hheader, &hblock);
//        let hull_count = hseq.total;
//        hull = new alvision.Mat(1, hull_count, alvision.MatrixType.CV_32FC2);
//        mask = new alvision.Mat(1, hull_count, alvision.MatrixType.CV_8UC1);
//        mask.setTo(0);
//        let _mask = mask;

//        h = (CvPoint2D32f *)(hull.data.ptr);

//        // extract convex hull points
//        if (this.return_points) {
//            cvCvtSeqToArray(hseq, hull.data.ptr);
//            if (CV_SEQ_ELTYPE(hseq) != alvision.MatrixType.CV_32FC2) {
//                let tmp = new alvision.Mat(hull.rows, hull.cols, alvision.MatrixType.CV_32SC2, hull.data.ptr);
//                cvConvert( &tmp, hull);
//            }
//        }
//        else {
//            CvSeqReader reader;
//            cvStartReadSeq(hseq, &reader);

//            for (let i = 0; i < hull_count; i++) {
//                schar * ptr = reader.ptr;
//                int idx;
//                CV_NEXT_SEQ_ELEM(hseq.elem_size, reader);

//                if (hull1)
//                    idx = cvSeqElemIdx(ptseq, *(uchar **)ptr );
//                else
//                    idx = *(int *)ptr;

//                if (idx < 0 || idx >= point_count) {
//                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "Invalid convex hull point #%d\n", i);
//                    code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
//                    goto _exit_;
//                }
//                h[i] = p[idx];
//            }
//        }

//        // check that the convex hull is a convex polygon
//        if (hull_count >= 3) {
//            let pt0 = h[hull_count - 1];
//            for (let i = 0; i < hull_count; i++) {
//                let j = i + 1;
//                let pt1 = h[i], pt2 = h[j < hull_count ? j : 0];
//                let dx0 = pt1.x - pt0.x, dy0 = pt1.y - pt0.y;
//                let dx1 = pt2.x - pt1.x, dy1 = pt2.y - pt1.y;
//                let t = dx0* dy1 - dx1* dy0;
//                if ((t < 0) ^ (this.orientation != alvision.ShapeOrientation.COUNTER_CLOCKWISE)) {
//                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "The convex hull is not convex or has a wrong orientation (vtx %d)\n", i);
//                    code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
//                    goto _exit_;
//                }
//                pt0 = pt1;
//            }
//        }

//        // check that all the points are inside the hull or on the hull edge
//        // and at least hull_point points are at the hull vertices
//        for (let i = 0; i < point_count; i++) {
//            let idx = 0, on_edge = 0;
//            let pptresult = cvTsPointPolygonTest(p[i], h, hull_count, (idx_, on_edge_) => { idx = idx_; on_edge = on_edge_; });

//            if (pptresult < 0) {
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, "The point #%d is outside of the convex hull\n", i);
//                code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//                goto _exit_;
//            }

//            if (pptresult < alvision.FLT_EPSILON && !on_edge)
//                mask.data.ptr[idx] = 1;
//        }

//        if (alvision.cvtest.norm(_mask, alvision.Mat.zeros(_mask.dims, _mask.size, _mask.type()), NORM_L1) != hull_count) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Not every convex hull vertex coincides with some input point\n");
//            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//            goto _exit_;
//        }

//        _exit_:

//        //cvReleaseMat( &hull);
//        this.hull = null;
//        //cvReleaseMat( &mask);
//        this.mask = null;
//        if (code < 0)
//            this.ts.set_failed_test_info(code);
//        return code;
//    }

//    protected  hull1: Array<Array<alvision.Point>>;
//    protected hull2: Array<Array<alvision.Point>>;
//    protected hull_storage: any ;
//    protected orientation: alvision.int;
//    protected return_points: alvision.int;
//};


///****************************************************************************************\
//*                                     MinAreaRect Test                                   *
//\****************************************************************************************/

//class CV_MinAreaRectTest extends CV_BaseShapeDescrTest
//{
//    run_func(): void {
//        if (!this.test_cpp) {
//            this.box = alvision.minAreaRect(this.points);// cvMinAreaRect2(points, storage);
//            this.box.points(this.box_pt);
//        }
//        else {
//            let r = alvision.minAreaRect(this.points);
//            this.box = r;
//            r.points(this.box_pt);
//        }
//    }
//    validate_test_results(test_case_idx: alvision.int): alvision.int {
//        let eps = 1e-1;
//        let code = super.validate_test_results(test_case_idx);
//        //int i, j,
//            let point_count = this.points2.rows.valueOf() + this.points2.cols.valueOf() - 1;
//        //CvPoint2D32f * p = (CvPoint2D32f *)(points2.data.ptr);
//        let mask = [ 0,0,0,0];

//        // check that the bounding box is a rotated rectangle:
//        //  1. diagonals should be equal
//        //  2. they must intersect in their middle points
//        {
//            let d0 = cvTsDist(this.box_pt[0], this.box_pt[2]);
//            let d1 = cvTsDist(this.box_pt[1], this.box_pt[3]);

//            let x0 = (this.box_pt[0].x + this.box_pt[2].x) * 0.5;
//            let y0 = (this.box_pt[0].y + this.box_pt[2].y) * 0.5;
//            let x1 = (this.box_pt[1].x + this.box_pt[3].x) * 0.5;
//            let y1 = (this.box_pt[1].y + this.box_pt[3].y) * 0.5;

//            if (Math.abs(d0.valueOf() - d1.valueOf()) + Math.abs(x0 - x1) + Math.abs(y0 - y1) > eps * Math.max(d0.valueOf(), d1.valueOf())) {
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, "The bounding box is not a rectangle\n");
//                code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
//                goto _exit_;
//            }
//        }

//        //#if 0
//        //    {
//        //    int n = 4;
//        //    double a = 8, c = 8, b = 100, d = 150;
//        //    CvPoint bp[4], *bpp = bp;
//        //    cvNamedWindow( "test", 1 );
//        //    IplImage* img = cvCreateImage( alvision.Size(500,500), 8, 3 );
//        //    cvZero(img);
//        //    for( i = 0; i < point_count; i++ )
//        //        cvCircle(img,cvPoint(Math.round(p[i].x*a+b),Math.round(p[i].y*c+d)), 3, CV_RGB(0,255,0), -1 );
//        //    for( i = 0; i < n; i++ )
//        //        bp[i] = cvPoint(Math.round(box_pt[i].x*a+b),Math.round(box_pt[i].y*c+d));
//        //    cvPolyLine( img, &bpp, &n, 1, 1, CV_RGB(255,255,0), 1, CV_AA, 0 );
//        //    cvShowImage( "test", img );
//        //    cvWaitKey();
//        //    cvReleaseImage(&img);
//        //    }
//        //#endif

//        // check that the box includes all the points
//        // and there is at least one point at (or very close to) every box side
//        for (let i = 0; i < point_count; i++) {
//            let idx = 0, on_edge = 0;
//            let pptresult = cvTsPointPolygonTest(p[i], this.box_pt, 4, (idx_, on_edge_) => { idx = idx_.valueOf(); on_edge = on_edge_.valueOf(); });
//            if (pptresult < -eps) {
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, "The point #%d is outside of the box\n", i);
//                code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//                goto _exit_;
//            }

//            if (pptresult < eps) {
//                for (let j = 0; j < 4; j++) {
//                    let d = cvTsPtLineDist(p[i], this.box_pt[(j - 1) & 3], this.box_pt[j]);
//                    if (d < eps)
//                        mask[j] = 1;
//                }
//            }
//        }

//        if (mask[0] + mask[1] + mask[2] + mask[3] != 4) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Not every box side has a point nearby\n");
//            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//            goto _exit_;
//        }

//        _exit_:

//        if (code < 0)
//            this.ts.set_failed_test_info(code);
//        return code;
//    }

//    protected box: alvision.RotatedRect;// CvBox2D;
//    protected box_pt/*[4]*/: alvision.Point2f;// CvPoint2D32f;
//};



///****************************************************************************************\
//*                                   MinEnclosingTriangle Test                            *
//\****************************************************************************************/

//class CV_MinTriangleTest extends CV_BaseShapeDescrTest
//{
//    run_func(): void {
//        let pointsAsVector = new Array<alvision.Point2f>();

//        this.points.convertTo(pointsAsVector,alvision.MatrixType. CV_32F);

//        alvision.minEnclosingTriangle(pointsAsVector, this.triangle);
//        alvision.convexHull(pointsAsVector, this.convexPolygon, true, true);
//    }
//    validate_test_results(test_case_idx: alvision.int): alvision.int {
//        let errorEnclosed = false, errorMiddlePoints = false, errorFlush = true;
//        let eps = 1e-4;
//        let code = super.validate_test_results(test_case_idx);

//        //#if 0
//        //    {
//        //    int n = 3;
//        //    double a = 8, c = 8, b = 100, d = 150;
//        //    CvPoint bp[4], *bpp = bp;
//        //    cvNamedWindow( "test", 1 );
//        //    IplImage* img = cvCreateImage( alvision.Size(500,500), 8, 3 );
//        //    cvZero(img);
//        //    for( i = 0; i < point_count; i++ )
//        //        cvCircle(img,cvPoint(Math.round(p[i].x*a+b),Math.round(p[i].y*c+d)), 3, CV_RGB(0,255,0), -1 );
//        //    for( i = 0; i < n; i++ )
//        //        bp[i] = cvPoint(Math.round(triangle[i].x*a+b),Math.round(triangle[i].y*c+d));
//        //    cvPolyLine( img, &bpp, &n, 1, 1, CV_RGB(255,255,0), 1, CV_AA, 0 );
//        //    cvShowImage( "test", img );
//        //    cvWaitKey();
//        //    cvReleaseImage(&img);
//        //    }
//        //#endif

//        let polygonVertices = this.convexPolygon.length;

//        if (polygonVertices > 2) {
//            // Check if all points are enclosed by the triangle
//            for (let i = 0; (i < polygonVertices) && (!errorEnclosed); i++) {
//                if (alvision.pointPolygonTest(this.triangle, new alvision.Point2f(this.convexPolygon[i].x, this.convexPolygon[i].y), true) < (-eps))
//                    errorEnclosed = true;
//            }

//            // Check if triangle edges middle points touch the polygon
//            let middlePoints = this.getTriangleMiddlePoints();

//            for (let i = 0; (i < 3) && (!errorMiddlePoints); i++) {
//                let isTouching = false;

//                for (let j = 0; (j < polygonVertices) && (!isTouching); j++)
//                {
//                    if (cvTsIsPointOnLineSegment(middlePoints[i], this.convexPolygon[j],
//                        this.convexPolygon[(j + 1) % polygonVertices]))
//                        isTouching = true;
//                }

//                errorMiddlePoints = (isTouching) ? false : true;
//            }

//            // Check if at least one of the edges is flush
//            for (let i = 0; (i < 3) && (errorFlush); i++) {
//                for (let j = 0; (j < polygonVertices) && (errorFlush); j++)
//                {
//                    if ((cvTsIsPointOnLineSegment(this.convexPolygon[j], this.triangle[i],
//                        this.triangle[(i + 1) % 3])) &&
//                        (cvTsIsPointOnLineSegment(this.convexPolygon[(j + 1) % polygonVertices], this.triangle[i],
//                            this.triangle[(i + 1) % 3])))
//                        errorFlush = false;
//                }
//            }

//            // Report any found errors
//            if (errorEnclosed) {
//                this.ts.printf(alvision.cvtest.TSConstants.LOG,
//                    "All points should be enclosed by the triangle.\n");
//                code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//            }
//            else if (errorMiddlePoints) {
//                this.ts.printf(alvision.cvtest.TSConstants.LOG,
//                    "All triangle edges middle points should touch the convex hull of the points.\n");
//                code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
//            }
//            else if (errorFlush) {
//                this.ts.printf(alvision.cvtest.TSConstants.LOG,
//                    "At least one edge of the enclosing triangle should be flush with one edge of the polygon.\n");
//                code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
//            }
//        }

//        if (code < 0)
//            this.ts.set_failed_test_info(code);

//        return code;
//    }
//    getTriangleMiddlePoints(): Array<alvision.Point2f>  {
//        let triangleMiddlePoints = new Array<alvision.Point2f>();

//        for (let i = 0; i < 3; i++) {
//            triangleMiddlePoints.push(cvTsMiddlePoint(this.triangle[i], this.triangle[(i + 1) % 3]));
//        }

//        return triangleMiddlePoints;
//    }

//    protected convexPolygon: Array<alvision.Point2f>; 
//    protected triangle: Array<alvision.Point2f>;
//};


///****************************************************************************************\
//*                                     MinEnclosingCircle Test                            *
//\****************************************************************************************/

//class CV_MinCircleTest extends CV_BaseShapeDescrTest
//{
//    run_func(): void {
//        if (!this.test_cpp)
//            alvision.minEnclosingCircle(this.points, (center_, radius_) => { this.center = center_; this.radius = radius_ });
//        else {
//            let tmpcenter = new alvision.Point2f();
//            alvision.minEnclosingCircle(this.points, (center_, radius_) => { tmpcenter = center_; this.radius = radius_; });
//            this.center = tmpcenter;
//        }
//    }
//    validate_test_results(test_case_idx: alvision.int): alvision.int {
//        let eps = 1.03;
//        let code = super.validate_test_results(test_case_idx);
//        let i, j = 0, point_count = this.points2.rows.valueOf() + this.points2.cols.valueOf() - 1;
//        let p = this.points2.ptr<alvision.Point2f>("Point2f");
//        let v = new Array<alvision.Point2f>(3);

//        //#if 0
//        //    {
//        //    double a = 2, b = 200, d = 400;
//        //    cvNamedWindow( "test", 1 );
//        //    IplImage* img = cvCreateImage( alvision.Size(500,500), 8, 3 );
//        //    cvZero(img);
//        //    for( i = 0; i < point_count; i++ )
//        //        cvCircle(img,cvPoint(Math.round(p[i].x*a+b),Math.round(p[i].y*a+d)), 3, CV_RGB(0,255,0), -1 );
//        //    cvCircle( img, cvPoint(Math.round(center.x*a+b),Math.round(center.y*a+d)),
//        //              Math.round(radius*a), CV_RGB(255,255,0), 1 );
//        //    cvShowImage( "test", img );
//        //    cvWaitKey();
//        //    cvReleaseImage(&img);
//        //    }
//        //#endif

//        // check that the circle contains all the points inside and
//        // remember at most 3 points that are close to the boundary
//        for (i = 0; i < point_count; i++) {
//            let d = cvTsDist(p[i], this.center);
//            if (d > this.radius) {
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, "The point #%d is outside of the circle\n", i);
//                code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//                //goto _exit_;
//                if (code < 0) { this.ts.set_failed_test_info(code); } return code;
//            }

//            if (this.radius.valueOf() - d.valueOf() < eps * this.radius.valueOf() && j < 3)
//                v[j++] = p[i];
//        }

//        if (point_count >= 2 && (j < 2 || (j == 2 && cvTsDist(v[0], v[1]) < (this.radius.valueOf() - 1) * 2 / eps))) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG,
//                "There should be at at least 3 points near the circle boundary or 2 points on the diameter\n");
//            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//            //goto _exit_;
//            if (code < 0) {this.ts.set_failed_test_info(code);}return code;
//        }

//        //_exit_:

//        if (code < 0)
//            this.ts.set_failed_test_info(code);
//        return code;
//    }

//    protected center: alvision.Point2f;//.CvPoint2D32f;
//    protected radius: alvision.float;
//};



///****************************************************************************************\
//*                                   Perimeter Test                                     *
//\****************************************************************************************/

//class CV_PerimeterTest extends CV_BaseShapeDescrTest
//{

//    prepare_test_case(test_case_idx: alvision.int): alvision.int{
//        let code = super.prepare_test_case(test_case_idx);
//        var rng = this.ts.get_rng();
//        let total: alvision.int;

//        if (code < 0)
//            return code;

//        this.is_closed = alvision.cvtest.randInt(rng).valueOf() % 2;

//        if (this.points1) {
//            this.points1.flags |= CV_SEQ_KIND_CURVE;
//            if (this.is_closed)
//                this.points1.flags |= CV_SEQ_FLAG_CLOSED;
//            total = this.points1.total;
//        }
//        else
//            total = this.points2.cols.valueOf() + this.points2.rows.valueOf() - 1;

//        if ((alvision.cvtest.randInt(rng).valueOf() % 3) && !this.test_cpp) {
//            this.slice.start_index = alvision.cvtest.randInt(rng).valueOf() % total.valueOf();
//            this.slice.end_index =   alvision.cvtest.randInt(rng).valueOf() % total.valueOf();
//        }
//        else
//            this.slice = CV_WHOLE_SEQ;

//        return 1;
//    }
//    run_func(): void {
//        if (!this.test_cpp)
//            this.result = alvision.arcLength(this.points, this.slice, this.points1 ? -1 : this.is_closed);
//        else
//            this.result = alvision.arcLength(alvision.cvarrToMat(this.points),
//                !this.points1 ? this.is_closed != 0 : (this.points1.flags & CV_SEQ_FLAG_CLOSED) != 0);
//    }
//    validate_test_results(test_case_idx: alvision.int): alvision.int {
//        let code = super.validate_test_results(test_case_idx);
//        let len = this.slice.end_index - this.slice.start_index, total = this.points2.cols.valueOf() + this.points2.rows.valueOf() - 1;
//        let result0 = 0;
//        //CvPoint2D32f prev_pt, pt, *ptr;

//        if (len < 0)
//            len += total;

//        len = Math.min(len, total);
//        //len -= !is_closed && len == total;

//        //ptr = (CvPoint2D32f *)points2.data.fl;
//        let ptr = this.points2.ptr<alvision.Point2f>("Point2f");
//        let prev_pt = ptr[(this.is_closed ? this.slice.start_index + len - 1 : this.slice.start_index) % total];

//        for (let i = 0; i < len + (len < total && (!this.is_closed || len == 1)); i++) {
//            let pt = ptr[(i + this.slice.start_index) % total];
//            let dx = pt.x.valueOf() - prev_pt.x.valueOf(), dy = pt.y.valueOf() - prev_pt.y.valueOf();
//            result0 += Math.sqrt(dx * dx + dy * dy);
//            prev_pt = pt;
//        }

//        if (isNaN(this.result.valueOf()) || !isFinite(this.result.valueOf())) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "cvArcLength() returned invalid value (%g)\n", this.result);
//            code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
//        }
//        else if (Math.abs(this.result.valueOf() - result0) > alvision.FLT_EPSILON * 100 * result0) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "The function returned %g, while the correct result is %g\n", this.result, result0);
//            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//        }

//        if (code < 0)
//            this.ts.set_failed_test_info(code);
//        return code;
//    }
//    protected slice: alvision.CvSlice;
//    protected is_closed: alvision.int;
//    protected result: alvision.double;
//};



///****************************************************************************************\
//*                                   FitEllipse Test                                      *
//\****************************************************************************************/

//class CV_FitEllipseTest extends CV_BaseShapeDescrTest
//{
//    constructor() {
//        super();
//        this.min_log_size = 5; // for robust ellipse fitting a dozen of points is needed at least
//        this.max_log_size = 10;
//        this.min_ellipse_size = 10;
//        this.max_noise = 0.05;
//    }

//    prepare_test_case(test_case_idx: alvision.int): alvision.int{
//        this.min_log_size = Math.max(this.min_log_size.valueOf(), 4);
//        this.max_log_size = Math.max(this.min_log_size.valueOf(), this.max_log_size);
//        return super.prepare_test_case(test_case_idx);
//    }
//    generate_point_set(points: any) : void{
//    let rng = this.ts.get_rng();
//    //int total, point_type;
//    //CvSeqReader reader;
//    //uchar * data = 0;
//    //double a, b;

//    this.box0.center.x = ((this.low.val[0].valueOf() + this.high.val[0].valueOf()) * 0.5);
//    this.box0.center.y = ((this.low.val[1].valueOf() + this.high.val[1].valueOf()) * 0.5);
//    this.box0.size.width =  (Math.max(this.high.val[0].valueOf() - this.low.val[0].valueOf(), this.min_ellipse_size.valueOf()) * 2);
//    this.box0.size.height = (Math.max(this.high.val[1].valueOf() - this.low.val[1].valueOf(), this.min_ellipse_size.valueOf()) * 2);
//    this.box0.angle = (alvision.cvtest.randReal(rng).valueOf() * 180);
//    let a = Math.cos(this.box0.angle.valueOf() * Math.PI / 180.);
//    let b = Math.sin(this.box0.angle.valueOf() * Math.PI / 180.);

//    if (this.box0.size.width > this.box0.size.height) {
//        let t = this.box0.size.width; this.box0.size.width = this.box0.size.height; this.box0.size.height = t;
//        //CV_SWAP(box0.size.width, box0.size.height, t);
//    }
//    memset( &reader, 0, sizeof(reader));

//    if (CV_IS_SEQ(pointsSet)) {
//        CvSeq * ptseq = (CvSeq *)pointsSet;
//        total = ptseq.total;
//        point_type = CV_SEQ_ELTYPE(ptseq);
//        cvStartReadSeq(ptseq, &reader);
//    }
//    else {
//        CvMat * ptm = (CvMat *)pointsSet;
//        assert(CV_IS_MAT(ptm) && CV_IS_MAT_CONT(ptm.type));
//        total = ptm.rows + ptm.cols - 1;
//        point_type = CV_MAT_TYPE(ptm.type);
//        data = ptm.data.ptr;
//    }

//    alvision.assert(()=>point_type == alvision.MatrixType. CV_32SC2 || point_type == alvision.MatrixType.CV_32FC2);

//    for (let i = 0; i < total; i++) {
//        CvPoint * pp;
//        let p = new alvision.Point2f();
//        let angle = alvision.cvtest.randReal(rng).valueOf() * Math.PI * 2;
//        let x = this.box0.size.height.valueOf() * 0.5 * (Math.cos(angle) + (alvision.cvtest.randReal(rng).valueOf() - 0.5) * 2 * this.max_noise.valueOf());
//        let y = this.box0.size.width.valueOf() * 0.5 *  (Math.sin(angle) + (alvision.cvtest.randReal(rng).valueOf() - 0.5) * 2 * this.max_noise.valueOf());
//        p.x =  (this.box0.center.x.valueOf() + a * x + b * y);
//        p.y =  (this.box0.center.y.valueOf() - b * x + a * y);

//        if (reader.ptr) {
//            pp = (CvPoint *)reader.ptr;
//            CV_NEXT_SEQ_ELEM(sizeof(*pp), reader);
//        }
//        else
//            pp = ((CvPoint *)data) + i;
//        if (point_type == alvision.MatrixType.CV_32SC2) {
//            pp.x = Math.round(p.x.valueOf());
//            pp.y = Math.round(p.y.valueOf());
//        }
//        else
//            *(CvPoint2D32f *)pp = p;
//    }
//}
//    run_func() : void {
//        if(!this.test_cpp)
//    this.box = alvision.fitEllipse(this.points);
//    else
//    this.box = alvision.fitEllipse(this.points);
//    }
//    validate_test_results(test_case_idx : alvision.int) : alvision.int {
//    let code = super.validate_test_results(test_case_idx);
//    //let diff_angle;

//    if (isNaN(this.box.center.x.valueOf()) ||    !isFinite(this.box.center.x.valueOf()) ||
//        isNaN(this.box.center.y.valueOf()) ||    !isFinite(this.box.center.y.valueOf()) ||
//        isNaN(this.box.size.width.valueOf()) ||  !isFinite(this.box.size.width.valueOf()) ||
//        isNaN(this.box.size.height.valueOf()) || !isFinite(this.box.size.height.valueOf()) ||
//        isNaN(this.box.angle.valueOf()) || !isFinite(this.box.angle.valueOf())) {
//        this.ts.printf(alvision.cvtest.TSConstants.LOG, "Some of the computed ellipse parameters are invalid (x=%g,y=%g,w=%g,h=%g,angle=%g)\n",
//            this.box.center.x, this.box.center.y, this.box.size.width, this.box.size.height, this.box.angle);
//        code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
//        goto _exit_;
//    }

//    this.box.angle = (90 - this.box.angle.valueOf());
//    if (this.box.angle < 0)
//        this.box.angle = this.box.angle.valueOf() + 360;
//    if (this.box.angle > 360)
//        this.box.angle = this.box.angle.valueOf()  - 360;

//    if (Math.abs(this.box.center.x.valueOf() -    this.box0.center.x.valueOf()) > 3 ||
//        Math.abs(this.box.center.y.valueOf() -    this.box0.center.y.valueOf()) > 3 ||
//        Math.abs(this.box.size.width.valueOf() -  this.box0.size.width.valueOf()) > 0.1 *  Math.abs(this.box0.size.width.valueOf()) ||
//        Math.abs(this.box.size.height.valueOf() - this.box0.size.height.valueOf()) > 0.1 * Math.abs(this.box0.size.height.valueOf())) {
//        this.ts.printf(alvision.cvtest.TSConstants.LOG, "The computed ellipse center and/or size are incorrect:\n\t" +
//            "(x=%.1f,y=%.1f,w=%.1f,h=%.1f), while it should be (x=%.1f,y=%.1f,w=%.1f,h=%.1f)\n",
//            this.box.center.x,  this.box.center.y,  this.box.size.width,  this.box.size.height,
//            this.box0.center.x, this.box0.center.y, this.box0.size.width, this.box0.size.height);
//        code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//        goto _exit_;
//    }

//    let diff_angle = Math.abs(this.box0.angle.valueOf() - this.box.angle.valueOf());
//    diff_angle = Math.min(diff_angle, Math.abs(diff_angle - 360));
//    diff_angle = Math.min(diff_angle, Math.abs(diff_angle - 180));

//    if (this.box0.size.height >= 1.3 * this.box0.size.width.valueOf() && diff_angle > 30) {
//        this.ts.printf(alvision.cvtest.TSConstants.LOG, "Incorrect ellipse angle (=%1.f, should be %1.f)\n",
//            this.box.angle, this.box0.angle);
//        code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//        goto _exit_;
//    }

//    _exit_:

//    //#if 0
//    //    if( code < 0 )
//    //    {
//    //    cvNamedWindow( "test", 0 );
//    //    IplImage* img = cvCreateImage( alvision.Size(Math.round(low_high_range*4),
//    //        Math.round(low_high_range*4)), 8, 3 );
//    //    cvZero( img );
//    //
//    //    box.center.x += low_high_range*2;
//    //    box.center.y += low_high_range*2;
//    //    cvEllipseBox( img, box, CV_RGB(255,0,0), 3, 8 );
//    //
//    //    for( int i = 0; i < points2.rows + points2.cols - 1; i++ )
//    //    {
//    //        CvPoint pt;
//    //        pt.x = Math.round(points2.data.fl[i*2] + low_high_range*2);
//    //        pt.y = Math.round(points2.data.fl[i*2+1] + low_high_range*2);
//    //        cvCircle( img, pt, 1, CV_RGB(255,255,255), -1, 8 );
//    //    }
//    //
//    //    cvShowImage( "test", img );
//    //    cvReleaseImage( &img );
//    //    cvWaitKey(0);
//    //    }
//    //#endif

//    if (code < 0) {
//        this.ts.set_failed_test_info(code);
//    }
//    return code;
//}
    
//    protected box0: alvision.RotatedRect;// CvBox2D;
//    protected box: alvision.RotatedRect;// CvBox2D;
//    protected min_ellipse_size: alvision.double;
//        protected max_noise : alvision.double;
//};


//class CV_FitEllipseSmallTest  extends alvision.cvtest.BaseTest
//{
//    run(iii: alvision.int) : void
//    {
//        let sz = new alvision.Size (50, 50);
//        let c = new Array<Array<alvision.Point>>();
//        c.push(new Array<alvision.Point>());
//        let scale = 1;
//        let ofs = new alvision.Point(0, 0);//sz.width/2, sz.height/2) - Point(4,4)*scale;
//        c[0].push(new alvision.Point(2, 0).op_Multiplication(scale).op_Addition(ofs));
//        c[0].push(new alvision.Point(0, 2).op_Multiplication(scale).op_Addition(ofs));
//        c[0].push(new alvision.Point(0, 6).op_Multiplication(scale).op_Addition(ofs));
//        c[0].push(new alvision.Point(2, 8).op_Multiplication(scale).op_Addition(ofs));
//        c[0].push(new alvision.Point(6, 8).op_Multiplication(scale).op_Addition(ofs));
//        c[0].push(new alvision.Point(8, 6).op_Multiplication(scale).op_Addition(ofs));
//        c[0].push(new alvision.Point(8, 2).op_Multiplication(scale).op_Addition(ofs));
//        c[0].push(new alvision.Point(6, 0).op_Multiplication(scale).op_Addition(ofs));

//        let e = alvision.fitEllipse(c[0]);
//        alvision.CV_Assert(()=> Math.abs(e.center.x.valueOf() - 4) <= 1. &&
//                   Math.abs(e.center.y.valueOf() - 4) <= 1. &&
//                   Math.abs(e.size.width.valueOf() - 9) <= 1. &&
//                   Math.abs(e.size.height.valueOf() - 9) <= 1. );
//    }
//};


//// Regression test for incorrect fitEllipse result reported in Bug #3989
//// Check edge cases for rotation angles of ellipse ([-180, 90, 0, 90, 180] degrees)
//class CV_FitEllipseParallelTest extends CV_FitEllipseTest
//{
//    constructor() {
//        super();
//        this.min_ellipse_size = 5;
//    }

//    generate_point_set(points : any) : void {
//        let rng = this.ts.get_rng();
//        let height = (Math.max(this.high.val[0].valueOf() - this.low.val[0].valueOf(), this.min_ellipse_size.valueOf()));
//        let width =  (Math.max(this.high.val[1].valueOf() - this.low.val[1].valueOf(), this.min_ellipse_size.valueOf()));
//        const angle = ((alvision.cvtest.randInt(rng).valueOf() % 5) - 2) * 90;
//        const dim = Math.max(height, width);
//        const center = new alvision.Point(dim * 2, dim * 2);

//        if (width > height) {
//            let t = width; width = height; height = t;
//            //CV_SWAP(width, height, t);
//        }

//    let image = alvision.Mat.zeros(dim * 4, dim * 4, alvision.MatrixType.CV_8UC1).toMat();
//        alvision.ellipse(image, center, new alvision.Size(height, width), angle,
//            0, 360, new alvision.Scalar(255, 0, 0), 1, 8);

//        this.box0.center.x =    center.x;
//        this.box0.center.y =    center.y;
//        this.box0.size.width =  width*2;
//        this.box0.size.height = height*2;
//        this.box0.angle =       angle;

//        let contours = new Array<Array<alvision.Point>>();
//        alvision.findContours(image, contours, alvision.RetrievalModes.RETR_EXTERNAL, alvision.ContourApproximationModes.CHAIN_APPROX_NONE);

//        new alvision.Mat(contours[0]).convertTo(this.pointsMat, alvision.MatrixType.CV_32F);

//    }

//    run_func() : void {
//        this.box = alvision.fitEllipse(this.pointsMat);
//    }
//    protected pointsMat: alvision.Mat;
//};


///****************************************************************************************\
//*                                   FitLine Test                                         *
//\****************************************************************************************/

//class CV_FitLineTest extends CV_BaseShapeDescrTest
//{
//    constructor() {
//        super();
//        this.min_log_size = 5; // for robust line fitting a dozen of points is needed at least
//        this.max_log_size = 10;
//        this.max_noise = 0.05;
//    }

//    prepare_test_case(test_case_idx: alvision.int): alvision.int{
//        var rng = this.ts.get_rng();
//        this.dims = alvision.cvtest.randInt(rng).valueOf() % 2 + 2;
//        this.min_log_size = Math.max(this.min_log_size.valueOf(), 5);
//        this.max_log_size = Math.max(this.min_log_size.valueOf(), this.max_log_size.valueOf());
//        let code = super.prepare_test_case(test_case_idx);
//        this.dist_type = alvision.cvtest.randInt(rng).valueOf() % 6 + 1;
//        this.dist_type += dist_type == CV_DIST_C;
//        this.reps = 0.1; this.aeps = 0.01;
//        return code;
//    }
//    generate_point_set(points : any) : void {
//        let  rng = this.ts.get_rng();
////        int i, k, n, total, point_type;
//        CvSeqReader reader;
//        uchar* data = 0;
//        let s = 0;

//        let n = this.dims;
//        for(let k = 0; k < n; k++ )
//        {
//            this.line0[k + n.valueOf()] = ((this.low.val[k].valueOf() +  this.high.val[k].valueOf()) * 0.5);
//            this.line0[k] =      (this.high.val[k].valueOf() - this.low.val[k].valueOf());
//            if (alvision.cvtest.randInt(rng).valueOf() % 2)
//                this.line0[k] = -this.line0[k];
//            s += this.line0[k].valueOf() * this.line0[k].valueOf();
//        }

//    s = 1. / Math.sqrt(s);
//        for(k = 0; k < n; k++ )
//        line0[k] = (line0[k] * s);

//        memset( &reader, 0, sizeof(reader) );

//    if (CV_IS_SEQ(pointsSet)) {
//        CvSeq * ptseq = (CvSeq *)pointsSet;
//        total = ptseq.total;
//        point_type = CV_MAT_DEPTH(CV_SEQ_ELTYPE(ptseq));
//        cvStartReadSeq(ptseq, &reader);
//    }
//    else {
//        CvMat * ptm = (CvMat *)pointsSet;
//        alvision.assert(CV_IS_MAT(ptm) && CV_IS_MAT_CONT(ptm.type));
//        total = ptm.rows + ptm.cols - 1;
//        point_type = CV_MAT_DEPTH(CV_MAT_TYPE(ptm.type));
//        data = ptm.data.ptr;
//    }

//    for (let i = 0; i < total; i++) {
//        int * pi;
//        float * pf;
//        float p[4], t;
//        if (reader.ptr) {
//            pi = (int *)reader.ptr;
//            pf = (float *)reader.ptr;
//            CV_NEXT_SEQ_ELEM(reader.seq.elem_size, reader);
//        }
//        else {
//            pi = (int *)data + i * n;
//            pf = (float *)data + i * n;
//        }

//        t = ((alvision.cvtest.randReal(rng).valueOf() - 0.5) * low_high_range * 2);

//        for (k = 0; k < n; k++) {
//            p[k] = ((alvision.cvtest.randReal(rng) - 0.5) * max_noise * 2 + t * line0[k] + line0[k + n]);

//            if (point_type == CV_32S)
//                pi[k] = Math.round(p[k]);
//            else
//                pf[k] = p[k];
//        }
//    }
//    }
//    run_func() : void {
//        if (!this.test_cpp)
//            alvision.fitLine(this.points, this.dist_type, 0, this.reps, this.aeps, this.line);
//    else if (this.dims == 2)
//        alvision.fitLine(alvision.cvarrToMat(this.points), (alvision.Vec4f &)line[0], dist_type, 0, reps, aeps);
//    else
//        alvision.fitLine(alvision.cvarrToMat(this.points), (alvision.Vec6f &)line[0], dist_type, 0, reps, aeps);
//    }
//    validate_test_results(test_case_idx : alvision.int) : alvision.int {
//    let code = super.validate_test_results(test_case_idx);
//    let max_k = 0;
//    let vec_diff = 0;//, t;

//    for (let k = 0; k < this.dims.valueOf() * 2; k++) {
//        if (isNaN(this.line[k].valueOf()) || !isFinite(this.line[k].valueOf())) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Some of the computed line parameters are invalid (line[%d]=%g)\n",
//                k, this.line[k]);
//            code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
//            goto _exit_;
//        }
//    }

//    if (Math.abs(this.line0[1].valueOf()) > Math.abs(this.line0[0].valueOf()))
//        max_k = 1;
//    if (Math.abs(this.line0[this.dims.valueOf() - 1].valueOf()) > Math.abs(this.line0[max_k].valueOf()))
//        max_k = this.dims.valueOf() - 1;
//    if (this.line0[max_k] < 0)
//        for (let k = 0; k < this.dims; k++)
//            this.line0[k] = -this.line0[k];
//    if (this.line[max_k] < 0)
//        for (let k = 0; k < this.dims; k++)
//            this.line[k] = -this.line[k];

//    for (let k = 0; k < this.dims; k++) {
//        let  dt = this.line[k].valueOf() - this.line0[k].valueOf();
//        vec_diff += dt * dt;
//    }

//    if (Math.sqrt(vec_diff) > 0.05) {
//        if (this.dims == 2)
//            this.ts.printf(alvision.cvtest.TSConstants.LOG,
//                "The computed line vector (%.2f,%.2f) is different from the actual (%.2f,%.2f)\n",
//                this.line[0], this.line[1], this.line0[0], this.line0[1]);
//        else
//            this.ts.printf(alvision.cvtest.TSConstants.LOG,
//                "The computed line vector (%.2f,%.2f,%.2f) is different from the actual (%.2f,%.2f,%.2f)\n",
//                this.line[0], this.line[1], this.line[2], this.line0[0], this.line0[1], this.line0[2]);
//        code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//        goto _exit_;
//    }

//    let t = (this.line[max_k + this.dims.valueOf()].valueOf() - this.line0[max_k + this.dims.valueOf()].valueOf()) / this.line0[max_k].valueOf();
//    for (let k = 0; k < this.dims; k++) {
//        let p = this.line0[k + this.dims.valueOf()].valueOf() + t * this.line0[k].valueOf() - this.line[k + this.dims.valueOf()].valueOf();
//        vec_diff += p * p;
//    }

//    if (Math.sqrt(vec_diff) > 1 * Math.max(Math.abs(t), 1)) {
//        if (this.dims == 2)
//            this.ts.printf(alvision.cvtest.TSConstants.LOG,
//                "The computed line point (%.2f,%.2f) is too far from the actual line\n",
//                this.line[2].valueOf() + this.line0[2].valueOf(), this.line[3].valueOf() + this.line0[3].valueOf());
//        else
//            this.ts.printf(alvision.cvtest.TSConstants.LOG,
//                "The computed line point (%.2f,%.2f,%.2f) is too far from the actual line\n",
//                this.line[3].valueOf() + this.line0[3].valueOf(), this.line[4].valueOf() + this.line0[4].valueOf(), this.line[5].valueOf() + this.line0[5].valueOf());
//        code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//        goto _exit_;
//    }

//    _exit_:

//    if (code < 0) {
//        this.ts.set_failed_test_info(code);
//    }
//    return code;
//}

//    protected max_noise: alvision.double;
//    protected line: Array<alvision.float>/*[6]*/;
//    protected line0 : Array<alvision.float>/*[6]*/;
//    protected dist_type: alvision.int;
//    protected reps : alvision.double;
//    protected aeps: alvision.double;
//};

////#if defined(__GNUC__) && (__GNUC__ == 4) && (__GNUC_MINOR__ == 8)
////# pragma GCC diagnostic push
////# pragma GCC diagnostic ignored "-Warray-bounds"
////#endif


////#if defined(__GNUC__) && (__GNUC__ == 4) && (__GNUC_MINOR__ == 8)
////# pragma GCC diagnostic pop
////#endif



////#if defined(__GNUC__) && (__GNUC__ == 4) && (__GNUC_MINOR__ == 8)
////# pragma GCC diagnostic push
////# pragma GCC diagnostic ignored "-Warray-bounds"
////#endif


////#if defined(__GNUC__) && (__GNUC__ == 4) && (__GNUC_MINOR__ == 8)
////# pragma GCC diagnostic pop
////#endif

///****************************************************************************************\
//*                                   ContourMoments Test                                  *
//\****************************************************************************************/


//function 
//cvTsGenerateTousledBlob( center : alvision.Point2f, axes : alvision.Point2f,
//max_r_scale: alvision.double, angle: alvision.double, points: CvArr* , rng: alvision.RNG ) : void
//{
//    //int total, point_type;
//    //uchar* data = 0;
//    //CvSeqReader reader;
//    //memset( &reader, 0, sizeof(reader) );

//    if( CV_IS_SEQ(points) )
//    {
//        CvSeq* ptseq = (CvSeq*)points;
//        total = ptseq.total;
//        point_type = CV_SEQ_ELTYPE(ptseq);
//        cvStartReadSeq( ptseq, &reader );
//    }
//    else
//    {
//        CvMat* ptm = (CvMat*)points;
//        assert( CV_IS_MAT(ptm) && CV_IS_MAT_CONT(ptm.type) );
//        total = ptm.rows + ptm.cols - 1;
//        point_type = CV_MAT_TYPE(ptm.type);
//        data = ptm.data.ptr;
//    }

//    alvision.assert( point_type == alvision.MatrixType.CV_32SC2 || point_type == alvision.MatrixType.CV_32FC2 );

//    for(let i = 0; i < total; i++ )
//    {
//        CvPoint* pp;
//        let p = new alvision.Point2f();

//        let phi0 = 2*Math.PI*i/total;
//        let phi = Math.PI*angle/180.;
//        let t = alvision.cvtest.randReal(rng).valueOf()*max_r_scale + (1 - max_r_scale);
//        let ta = axes.height*t;
//        let tb = axes.width*t;
//        let c0 = Math.cos(phi0)*ta, s0 = Math.sin(phi0)*tb;
//        let c =  Math.cos(phi), s =      Math.sin(phi);
//        p.x = (c0*c - s0*s + center.x);
//        p.y = (c0*s + s0*c + center.y);

//        if( reader.ptr )
//        {
//            pp = (CvPoint*)reader.ptr;
//            CV_NEXT_SEQ_ELEM( sizeof(*pp), reader );
//        }
//        else
//            pp = ((CvPoint*)data) + i;

//        if( point_type ==alvision.MatrixType. CV_32SC2 )
//        {
//            pp.x = Math.round(p.x.valueOf());
//            pp.y = Math.round(p.y.valueOf());
//        }
//        else
//            *(CvPoint2D32f*)pp = p;
//    }
//}


//class CV_ContourMomentsTest extends CV_BaseShapeDescrTest {
//    constructor() {
//        super();
//        this.min_log_size = 3;
//        this.max_log_size = 8;
//        this.max_max_r_scale = 15;
//        this.low_high_range = 200;
//        this.enable_flt_points = false;
//    }

//    prepare_test_case(test_case_idx: alvision.int): alvision.int {
//        this.min_log_size = Math.max(this.min_log_size.valueOf(), 3);
//        this.max_log_size = Math.min(this.max_log_size.valueOf(), 8);
//        this.max_log_size = Math.max(this.min_log_size.valueOf(), this.max_log_size.valueOf());
//        let code = super.prepare_test_case(test_case_idx);
//        return code;
//    }
//    generate_point_set(points: any): void {
//        let rng = this.ts.get_rng();
//        //float max_sz;

//        this.axes.width = ((alvision.cvtest.randReal(rng).valueOf() * 0.9 + 0.1) * this.low_high_range.valueOf());
//        this.axes.height = ((alvision.cvtest.randReal(rng).valueOf() * 0.9 + 0.1) * this.low_high_range.valueOf());
//        max_sz = Math.max(this.axes.width, this.axes.height);

//        this.img_size.width = this.img_size.height = Math.round(low_high_range * 2.2);

//        this.center.x = (this.img_size.width.valueOf() * 0.5 + (alvision.cvtest.randReal(rng).valueOf() - 0.5) *  (this.img_size.width.valueOf() - max_sz * 2) * 0.8);
//        this.center.y = (this.img_size.height.valueOf() * 0.5 + (alvision.cvtest.randReal(rng).valueOf() - 0.5) * (this.img_size.height.valueOf() - max_sz * 2) * 0.8);

//        alvision.assert(() => 0 < this.center.x - max_sz && this.center.x + max_sz < this.img_size.width &&
//            0 < this.center.y - max_sz && this.center.y + max_sz < this.img_size.height);

//        max_r_scale = alvision.cvtest.randReal(rng).valueOf() * this.max_max_r_scale.valueOf() * 0.01;
//        angle = alvision.cvtest.randReal(rng).valueOf() * 360;

//        cvTsGenerateTousledBlob(this.center, axes, max_r_scale, angle, pointsSet, rng);

//        if (this.points1)
//            this.points1.flags = CV_SEQ_MAGIC_VAL + CV_SEQ_POLYGON;
//    }
//    run_func(): void {
//        if (!this.test_cpp) {
//            this.moments = alvision.moments(this.points);
//            this.area = alvision.contourArea(this.points);
//        }
//        else {
//            this.moments = alvision.moments(this.points);
//            this.area = alvision.contourArea(this.points);
//        }
//    }
//    validate_test_results(test_case_idx: alvision.int): alvision.int {

//        let code = super.validate_test_results(test_case_idx);
//        let n = (sizeof(moments) / sizeof(moments.inv_sqrt_m00));
//        let img = new alvision.Mat(this.img_size.height, this.img_size.width, alvision.MatrixType.CV_8UC1);
//        //CvPoint * pt = (CvPoint *)points2.data.i;
//        let pt = this.points2.ptr<alvision.Point>("Point");
//        let count = this.points2.cols.valueOf() + this.points2.rows.valueOf() - 1;
//        let max_v0 = 0;

//        img.setTo(0);
//        cvFillPoly(img, &pt, &count, 1, alvision.Scalar.all(1));
//        this.moments0 = alvision.moments(img);

//        for (let i = 0; i < n; i++) {
//            let t = Math.abs((this.moments0.m00)[i]);
//            max_v0 = Math.max(max_v0, t);
//        }

//        for (let i = 0; i <= n; i++) {
//            let v = i < n ? (this.moments.m00)[i] : this.area;
//            let v0 = i < n ? (this.moments0.m00)[i] : this.moments0.m00;

//            if (isNaN(v) || !isFinite(v)) {
//                this.ts.printf(alvision.cvtest.TSConstants.LOG,
//                    "The contour %s is invalid (=%g)\n", i < n ? "moment" : "area", v);
//                code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
//                break;
//            }

//            if (Math.abs(v - v0) > 0.1 * max_v0) {
//                this.ts.printf(alvision.cvtest.TSConstants.LOG,
//                    "The computed contour %s is %g, while it should be %g\n",
//                    i < n ? "moment" : "area", v, v0);
//                code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
//                break;
//            }
//        }

//        if (code < 0) {
//            //#if 0
//            //        cvCmpS( img, 0, img, CV_CMP_GT );
//            //        cvNamedWindow( "test", 1 );
//            //        cvShowImage( "test", img );
//            //        cvWaitKey();
//            //#endif
//            this.ts.set_failed_test_info(code);
//        }

//        img = null;
//        return code;

//    }
//    protected moments0: alvision.Moments;
//    protected moments: alvision.Moments;
//    protected area0: alvision.double;
//    protected area: alvision.double;
//    protected axes: alvision.Point2f;
//    protected center: alvision.Point2f;
//    protected max_max_r_scale: alvision.int;
//    protected max_r_scale: alvision.double;
//    protected angle: alvision.double;
//    protected img_size: alvision.Size
//}




//////////////////////////////////////// Perimeter/Area/Slice test ///////////////////////////////////

//class CV_PerimeterAreaSliceTest  extends alvision.cvtest.BaseTest
//{
//    run(iii: alvision.int): void {
        
//        Ptr < CvMemStorage > storage(cvCreateMemStorage());
//        var rng = alvision.theRNG();
//        const min_r = 90, max_r = 120;

//        for (let i = 0; i < 100; i++ )
//        {
//           this.ts.update_context(this, i, true);
//            let n = rng.uniform(3, 30);
//            cvClearMemStorage(storage);
//            CvSeq * contour = cvCreateSeq(CV_SEQ_POLYGON, sizeof(CvSeq), sizeof(CvPoint), storage);
//            let dphi = Math.PI * 2 / n;
//            let center = new alvision.Point();
//            center.x = rng.uniform(Math.ceil(max_r), Math.floor(640 - max_r));
//            center.y = rng.uniform(Math.ceil(max_r), Math.floor(480 - max_r));

//            for (let j = 0; j < n; j++ )
//            {
//                let pt = new alvision.Point();
//                let r = rng.uniform(min_r, max_r);
//                let phi = j * dphi;
//                pt.x = Math.round(this.center.x.valueOf() + r.valueOf() * Math.cos(phi));
//                pt.y = Math.round(this.center.y.valueOf() - r.valueOf() * Math.sin(phi));
//                cvSeqPush(contour, &pt);
//            }

//            CvSlice slice;
//            for (; ;) {
//                slice.start_index = rng.uniform(-n / 2, 3 * n / 2);
//                slice.end_index = rng.uniform(-n / 2, 3 * n / 2);
//                int len = cvSliceLength(slice, contour);
//                if (len > 2)
//                    break;
//            }
//            CvSeq * cslice = cvSeqSlice(contour, slice);
//            /*console.log(util.format( "%d. (%d, %d) of %d, length = %d, length1 = %d\n",
//                   i, slice.start_index, slice.end_index,
//                   contour.total, cvSliceLength(slice, contour), cslice.total );
    
//            double area0 = cvContourArea(cslice);
//            double area1 = cvContourArea(contour, slice);
//            if( area0 != area1 )
//            {
//                ts.printf(alvision.cvtest.TSConstants.LOG,
//                           "The contour area slice is computed differently (%g vs %g)\n", area0, area1 );
//                this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
//                return;
//            }*/

//            let len0 = cvArcLength(cslice, CV_WHOLE_SEQ, 1);
//            let len1 = cvArcLength(contour, slice, 1);
//            if (len0 != len1) {
//                this.ts.printf(alvision.cvtest.TSConstants.LOG,
//                    "The contour arc length is computed differently (%g vs %g)\n", len0, len1);
//                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
//                return;
//            }
//        }
//        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
//    }
//};


//alvision.cvtest.TEST('Imgproc_ConvexHull', 'accuracy', () => { let test = new CV_ConvHullTest(); test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_MinAreaRect', 'accuracy', () => { let test = new CV_MinAreaRectTest (); test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_MinTriangle', 'accuracy', () => { let test = new CV_MinTriangleTest (); test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_MinCircle', 'accuracy', () => { let test = new CV_MinCircleTest (); test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_ContourPerimeter', 'accuracy', () => { let test = new CV_PerimeterTest (); test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_FitEllipse', 'accuracy', () => { let test = new CV_FitEllipseTest (); test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_FitEllipse', 'parallel', () => { let test = new CV_FitEllipseParallelTest (); test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_FitLine', 'accuracy', () => { let test = new CV_FitLineTest (); test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_ContourMoments', 'accuracy', () => { let test = new CV_ContourMomentsTest (); test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_ContourPerimeterSlice', 'accuracy', () => { let test = new CV_PerimeterAreaSliceTest(); test.safe_run(); });
//alvision.cvtest.TEST('Imgproc_FitEllipse', 'small', () => { let test = new CV_FitEllipseSmallTest(); test.safe_run(); });

///* End of file. */
