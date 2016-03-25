////// <reference path="Matrix.ts" />
var alvision_module = require('../../lib/bindings.js');

import * as _constants from './Constants'
import * as _st from './static'


//module alvision {
export interface MatExpr extends _st.IOArray {
//    MatExpr();
//    explicit MatExpr(const Mat& m);

//MatExpr(const MatOp* _op, int _flags, const Mat& _a = Mat(), const Mat& _b = Mat(),
//const Mat& _c = Mat(), double _alpha = 1, double _beta = 1, const Scalar& _s = Scalar());

//operator Mat() const;
//template < typename _Tp> operator Mat_<_Tp>() const;

//Size size() const;
//int type() const;

//MatExpr row(int y) const;
//MatExpr col(int x) const;
//MatExpr diag(int d = 0) const;
//MatExpr operator()( const Range& rowRange, const Range& colRange ) const;
//MatExpr operator()( const Rect& roi ) const;

//MatExpr t() const;
//MatExpr inv(int method = DECOMP_LU) const;
//MatExpr mul(const MatExpr& e, double scale= 1) const;
//MatExpr mul(const Mat& m, double scale= 1) const;

//Mat cross(const Mat& m) const;
//double dot(const Mat& m) const;

//const MatOp* op;
//int flags;

//Mat a, b, c;
//double alpha, beta;
//Scalar s;
}

export interface MatExprStatic {
    
    new (): MatExpr
    
}

export var MatExpr : MatExprStatic = alvision_module.MatExpr

