////// <reference path="Matrix.ts" />
var alvision_module = require('../../lib/bindings.js');

import * as _constants from './Constants'
import * as _st from './static'
import * as _matx from './Matx'
import * as _matexpr from './MatExpr'
import * as _scalar from './Scalar'
import * as _size from './Size'



//module alvision {
export interface Matrix extends _st.IOArray {
        //row(y: number): Array<number>;
        //col(x: number): Array<number>;
        //pixelRow(y: number): Array<number>;
        //pixelCol(x: number): Array<number>;

        colRange(startcol: _st.int, endcol: _st.int): Matrix;
        rowRange(startrow: _st.int, endrow: _st.int): Matrix;

        reshape(new_cn : _st.int,new_rows : _st.int): Matrix;
     
        inv(method?: _st.DecompTypes /*= DECOMP_LU*/): _matexpr.MatExpr;
        //width: number;
        //height: number;
        size(i? : _st.int/* = -1*/): _size.Size;
         //sizend(int * sz, int i= -1)  : _st.int;
         sameSize(arr : _st.IOArray) : boolean;
        //size_t total(int i= -1) const;
         type(i?: _st.int/* = -1*/)  : _st.int;
         depth(i?: _st.int/* = -1*/)  : _st.int;
         channels(i?: _st.int/* = -1*/) : _st.int;

        //type: constants.MatrixType;

        at(pos: number): number;
         
    }

    export interface MatrixStatic {
        Zeros(width: number, height: number, type?: _constants.MatrixType): Matrix;
        Ones(width: number, height: number, type?: _constants.MatrixType): Matrix;
        Eye(width: number, height: number, type?: _constants.MatrixType): Matrix;

        new (): Matrix
        new (rows: number, cols: number, type: _constants.MatrixType): Matrix;
        new (rows: number, cols: number, type: number): Matrix;

        new (mat: _st.IOArray, copyData?: boolean): Matrix;
        new (mat: _matx.Matx<_constants.float>): Matrix;
        new (mat: _matx.Matx<_constants.double>): Matrix;

        new (mat : _matexpr.MatExpr): Matrix;

        op_Addition(a: Matrix, b: Matrix): _matexpr.MatExpr;
        op_Addition(a: Matrix, s: _scalar.Scalar): _matexpr.MatExpr;
        op_Addition(s: _scalar.Scalar, a: Matrix): _matexpr.MatExpr;
        op_Addition(e: _matexpr.MatExpr, m: Matrix): _matexpr.MatExpr;
        op_Addition(m: Matrix, e: _matexpr.MatExpr): _matexpr.MatExpr;
        op_Addition(e: _matexpr.MatExpr, s: _scalar.Scalar): _matexpr.MatExpr;
        op_Addition(s: _scalar.Scalar, e: _matexpr.MatExpr): _matexpr.MatExpr;
        op_Addition(e1: _matexpr.MatExpr, e2: _matexpr.MatExpr): _matexpr.MatExpr;

        op_Substraction(a: Matrix, b: Matrix): _matexpr.MatExpr;
        op_Substraction(a: Matrix, s: _scalar.Scalar): _matexpr.MatExpr;
        op_Substraction(s: _scalar.Scalar, a: Matrix): _matexpr.MatExpr;
        op_Substraction(e: _matexpr.MatExpr, m: Matrix): _matexpr.MatExpr;
        op_Substraction(m: Matrix, e: _matexpr.MatExpr): _matexpr.MatExpr;
        op_Substraction(e: _matexpr.MatExpr, s: _scalar.Scalar): _matexpr.MatExpr;
        op_Substraction(s: _scalar.Scalar, e: _matexpr.MatExpr): _matexpr.MatExpr;
        op_Substraction(e1: _matexpr.MatExpr, e2: _matexpr.MatExpr): _matexpr.MatExpr;

        op_Substraction(m: Matrix): _matexpr.MatExpr;
        op_Substraction(e: _matexpr.MatExpr): _matexpr.MatExpr;

        op_Multiplication(a: Matrix, b: Matrix): _matexpr.MatExpr;
        op_Multiplication(a: Matrix, s: _constants.double): _matexpr.MatExpr;
        op_Multiplication(s: _constants.double, a: Matrix): _matexpr.MatExpr;
        op_Multiplication(e: _matexpr.MatExpr, m: Matrix): _matexpr.MatExpr;
        op_Multiplication(m: Matrix, e: _matexpr.MatExpr): _matexpr.MatExpr;
        op_Multiplication(e: _matexpr.MatExpr, s: _constants.double): _matexpr.MatExpr;
        op_Multiplication(s: _constants.double, e: _matexpr.MatExpr): _matexpr.MatExpr;
        op_Multiplication(e1: _matexpr.MatExpr, e2: _matexpr.MatExpr): _matexpr.MatExpr;

        op_Division(a: Matrix, b: Matrix): _matexpr.MatExpr;
        op_Division(a: Matrix, s: _constants.double): _matexpr.MatExpr;
        op_Division(s: _constants.double, a: Matrix): _matexpr.MatExpr;
        op_Division(e: _matexpr.MatExpr, m: Matrix): _matexpr.MatExpr;
        op_Division(m: Matrix, e: _matexpr.MatExpr): _matexpr.MatExpr;
        op_Division(e: _matexpr.MatExpr, s: _constants.double): _matexpr.MatExpr;
        op_Division(s: _constants.double, e: _matexpr.MatExpr): _matexpr.MatExpr;
        op_Division(e1: _matexpr.MatExpr, e2: _matexpr.MatExpr): _matexpr.MatExpr;

        op_LessThan(a: Matrix, b: Matrix): _matexpr.MatExpr;
        op_LessThan(a: Matrix, s: _constants.double): _matexpr.MatExpr;
        op_LessThan(s: _constants.double, a: Matrix): _matexpr.MatExpr;

        op_LessThenOrEqual(a: Matrix, b: Matrix): _matexpr.MatExpr;
        op_LessThenOrEqual(a: Matrix, s: _constants.double): _matexpr.MatExpr;
        op_LessThenOrEqual(s: _constants.double, a: Matrix): _matexpr.MatExpr;

        op_Equals(a: Matrix, b: Matrix): _matexpr.MatExpr;
        op_Equals(a: Matrix, s: _constants.double): _matexpr.MatExpr;
        op_Equals(s: _constants.double, a: Matrix): _matexpr.MatExpr;

        op_NotEquals(a: Matrix, b: Matrix): _matexpr.MatExpr;
        op_NotEquals(a: Matrix, s: _constants.double): _matexpr.MatExpr;
        op_NotEquals(s: _constants.double, a: Matrix): _matexpr.MatExpr;

        op_GreaterThanOrEqual(a: Matrix, b: Matrix): _matexpr.MatExpr;
        op_GreaterThanOrEqual(a: Matrix, s: _constants.double): _matexpr.MatExpr;
        op_GreaterThanOrEqual(s: _constants.double, a: Matrix): _matexpr.MatExpr;

        op_GreaterThan(a: Matrix, b: Matrix): _matexpr.MatExpr;
        op_GreaterThan(a: Matrix, s: _constants.double): _matexpr.MatExpr;
        op_GreaterThan(s: _constants.double, a: Matrix): _matexpr.MatExpr;

        op_And(a: Matrix, b: Matrix): _matexpr.MatExpr;
        op_And(a: Matrix, s: _scalar.Scalar): _matexpr.MatExpr;
        op_And(s: _scalar.Scalar, a: Matrix): _matexpr.MatExpr;

        op_Or(a: Matrix, b: Matrix): _matexpr.MatExpr;
        op_Or(a: Matrix, s: _scalar.Scalar): _matexpr.MatExpr;
        op_Or(s: _scalar.Scalar, a: Matrix): _matexpr.MatExpr;

        op_Xor(a: Matrix, b: Matrix): _matexpr.MatExpr;
        op_Xor(a: Matrix, s: _scalar.Scalar): _matexpr.MatExpr;
        op_Xor(s: _scalar.Scalar, a: Matrix): _matexpr.MatExpr;

        op_Complement(m: Matrix): _matexpr.MatExpr;

        min(a: Matrix, b: Matrix): _matexpr.MatExpr;
        min(a: Matrix, s: _constants.double): _matexpr.MatExpr;
        min(s: _constants.double, a: Matrix): _matexpr.MatExpr;

        max(a: Matrix, b: Matrix): _matexpr.MatExpr;
        max(a: Matrix, s: _constants.double): _matexpr.MatExpr;
        max(s: _constants.double, a: Matrix): _matexpr.MatExpr;
    }

    export var Matrix: MatrixStatic = alvision_module.Matrix;
//}

