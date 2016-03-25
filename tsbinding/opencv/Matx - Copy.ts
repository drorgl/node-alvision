////// <reference path="Matrix.ts" />
var alvision_module = require('../../lib/bindings.js');

import * as _constants from './Constants'
import * as _st from './static'


//module alvision {
export interface Matx<T> extends _st.IOArray{
    row(y: number): Array<number>;
    col(x: number): Array<number>;
    pixelRow(y: number): Array<number>;
    pixelCol(x: number): Array<number>;

    at(loc: _st.int): T;
    at(loc: _st.int, val: T) : T;

    colRange(startcol: _st.int, endcol: _st.int): Matx<T>;

    //width: number;
    //height: number;
    //type: _constants.MatrixType;

    //depth    = DataType<_Tp>::depth,
    //rows = m,
    //cols = n,
    //channels = rows * cols,
    //type = CV_MAKETYPE(depth, channels),
    //shortdim = (m < n ? m : n)
}

export interface MatxStatic<T> {
    //Zeros(width: number, height: number, type?: _constants.MatrixType): Matx<T>;
    //Ones(width: number, height: number, type?: _constants.MatrixType): Matx<T>;
    //Eye(width: number, height: number, type?: _constants.MatrixType): Matx<T>;

    new (): Matx<T>
    
    all(alpha : T) : Matx<T>;
    zeros() : Matx<T>;
    ones(): Matx<T>;
    Eye(width: number, height: number): Matx<T>;
    //diag(const diag_type& d): Matx<T>;
    randu(a : T, b : T): Matx<T>;
    randn(a : T, b : T): Matx<T>;

    //new (rows: number, cols: number, type: _constants.MatrixType): Matx<T>;
    //new (rows: number, cols: number, type: number): Matx<T>;

    //new (mat: Matx<T>, copyData?: boolean): Matx<T>;

    new (v0: T): Matx<T>; //!< 1x1 matrix
    new (v0: T, v1: T): Matx<T>; //!< 1x2 or 2x1 matrix
    new (v0: T, v1: T, v2: T): Matx<T>; //!< 1x3 or 3x1 matrix
    new (v0: T, v1: T, v2: T, v3: T): Matx<T>; //!< 1x4, 2x2 or 4x1 matrix
    new (v0: T, v1: T, v2: T, v3: T, v4: T): Matx<T>; //!< 1x5 or 5x1 matrix
    new (v0: T, v1: T, v2: T, v3: T, v4: T, v5: T): Matx<T>; //!< 1x6, 2x3, 3x2 or 6x1 matrix
    new (v0: T, v1: T, v2: T, v3: T, v4: T, v5: T, v6: T): Matx<T>; //!< 1x7 or 7x1 matrix
    new (v0: T, v1: T, v2: T, v3: T, v4: T, v5: T, v6: T, v7: T): Matx<T>; //!< 1x8, 2x4, 4x2 or 8x1 matrix
    new (v0: T, v1: T, v2: T, v3: T, v4: T, v5: T, v6: T, v7: T, v8: T): Matx<T>; //!< 1x9, 3x3 or 9x1 matrix
    new (v0: T, v1: T, v2: T, v3: T, v4: T, v5: T, v6: T, v7: T, v8: T, v9: T): Matx<T>; //!< 1x10, 2x5 or 5x2 or 10x1 matrix
    new (v0: T, v1: T, v2: T, v3: T, v4: T, v5: T, v6: T, v7: T, v8: T, v9: T, v10: T, v11: T): Matx<T>; //!< 1x12, 2x6, 3x4, 4x3, 6x2 or 12x1 matrix
    new (v0: T, v1: T, v2: T, v3: T, v4: T, v5: T, v6: T, v7: T, v8: T, v9: T, v10: T, v11: T, v12: T, v13: T): Matx<T>; //!< 1x14, 2x7, 7x2 or 14x1 matrix
    new (v0: T, v1: T, v2: T, v3: T, v4: T, v5: T, v6: T, v7: T, v8: T, v9: T, v10: T, v11: T, v12: T, v13: T, v14: T, v15: T): Matx<T>; //!< 1x16, 4x4 or 16x1 matrix
    new(vals: Array<T>) : Matx<T>; //!< initialize from a plain array

     
    op_Addition (a : Matx<T>, b : Matx<T>): Matx<T>;
     op_Substraction (a : Matx < T >, b : Matx<T>): Matx<T>;
     op_Multiplication (a : Matx<T>, alpha : _constants.int): Matx<T>;
     op_Multiplication (a : Matx<T>, alpha : _constants.float): Matx<T>;
     op_Multiplication (a : Matx<T>, alpha : _constants.double): Matx<T>;
     op_Multiplication(alpha: _constants.int, a: Matx<T>): Matx<T>;
     op_Multiplication(alpha: _constants.float, a: Matx<T>): Matx<T>;
     op_Multiplication(alpha: _constants.double, a: Matx<T>): Matx<T>;
     op_Multiplication(a: Matx<T>, b: Matx<T>): Matx<T>;


                
     op_Equals(a: Matx<T>, b: Matx<T>) : boolean;
     op_NotEquals(a: Matx<T>, b: Matx<T>) : boolean;

    //Vec < _Tp, m > operator * (const Matx<_Tp, m, n>& a, const Vec<_Tp, n>& b) 
}

export var Matxf: MatxStatic<_constants.float> = alvision_module.Matx;
export var Matxd: MatxStatic<_constants.double> = alvision_module.Matx;
//export var Matx: MatxStatic = alvision_module.Matx;
//}


//template < typename _Tp, int m, int n> class Matx {
//    public:
//    enum { depth = DataType<_Tp>::depth,
//    rows = m,
//    cols = n,
//    channels = rows * cols,
//    type = CV_MAKETYPE(depth, channels),
//    shortdim = (m < n ? m : n)
//         };

//typedef _Tp                           value_type;
//typedef Matx< _Tp, m, n > mat_type;
//typedef Matx< _Tp, shortdim, 1 > diag_type;


  

////! dot product computed with the default precision
//_Tp dot(const Matx<_Tp, m, n>& v) const;

////! dot product computed in double-precision arithmetics
//double ddot(const Matx<_Tp, m, n>& v) const;

////! conversion to another data type
//template < typename T2> operator Matx<T2, m, n>() const;

////! change the matrix shape
//template < int m1, int n1> Matx < _Tp, m1, n1 > reshape() const;

////! extract part of the matrix
//template < int m1, int n1> Matx < _Tp, m1, n1 > get_minor(int i, int j) const;

////! extract the matrix row
//Matx < _Tp, 1, n > row(int i) const;

////! extract the matrix column
//Matx < _Tp, m, 1 > col(int i) const;

////! extract the matrix diagonal
//diag_type diag() const;

////! transpose the matrix
//Matx < _Tp, n, m > t() const;

////! invert the matrix
//Matx < _Tp, n, m > inv(int method= DECOMP_LU, bool * p_is_ok = NULL) const;

////! solve linear system
//template < int l> Matx < _Tp, n, l > solve(const Matx<_Tp, m, l>& rhs, int flags= DECOMP_LU) const;
//Vec < _Tp, n > solve(const Vec<_Tp, m>& rhs, int method) const;

////! multiply two matrices element-wise
//Matx < _Tp, m, n > mul(const Matx<_Tp, m, n>& a) const;

////! divide two matrices element-wise
//Matx < _Tp, m, n > div(const Matx<_Tp, m, n>& a) const;

////! element access
//const _Tp& operator()(int i, int j) const;
//_Tp & operator()(int i, int j);

////! 1D element access
//const _Tp& operator()(int i) const;
//_Tp & operator()(int i);

//Matx(const Matx<_Tp, m, n>& a, const Matx<_Tp, m, n>& b, Matx_AddOp);
//Matx(const Matx<_Tp, m, n>& a, const Matx<_Tp, m, n>& b, Matx_SubOp);
//template < typename _T2> Matx(const Matx<_Tp, m, n>& a, _T2 alpha, Matx_ScaleOp);
//Matx(const Matx<_Tp, m, n>& a, const Matx<_Tp, m, n>& b, Matx_MulOp);
//Matx(const Matx<_Tp, m, n>& a, const Matx<_Tp, m, n>& b, Matx_DivOp);
//template < int l> Matx(const Matx<_Tp, m, l>& a, const Matx<_Tp, l, n>& b, Matx_MatMulOp);
//Matx(const Matx<_Tp, n, m>& a, Matx_TOp);

//_Tp val[m * n]; //< matrix elements
//};

