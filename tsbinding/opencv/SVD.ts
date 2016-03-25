/// <reference path="../../typings/tsd.d.ts" />

var alvision_module = require('../../lib/bindings.js');


import * as _constants from './Constants'
import * as _st from './static'
import * as _vec from './Vec'
import * as _matrix from './Matrix'
import * as _matx from './Matx'

export enum SVDFlags {
    /** allow the algorithm to modify the decomposed matrix; it can save space and speed up
        processing. currently ignored. */
    MODIFY_A = 1,
    /** indicates that only a vector of singular values `w` is to be processed, while u and vt
        will be set to empty matrices */
    NO_UV = 2,
    /** when the matrix is not square, by default the algorithm produces u and vt matrices of
        sufficiently large size for the further A reconstruction; if, however, FULL_UV flag is
        specified, u and vt will be full-size square orthogonal matrices.*/
    FULL_UV = 4
};

//module alvision {
export interface SVD {
    run(src: _st.InputArray, flags: SVDFlags /* = 0 */): SVD;
    backSubst(rhs: _st.InputArray, dst : _st.OutputArray): void;

    u: _matrix.Matrix;
    w: _matrix.Matrix;
    vt: _matrix.Matrix;
}

export interface SVDStatic {
    new (): SVD;
    new (src: _st.InputArray, flags: SVDFlags /*= 0*/): SVD
    compute(src: _st.InputArray, w: _st.OutputArray, u: _st.OutputArray, vt: _st.OutputArray, flags: SVDFlags /*= 0*/): void;
    compute(src: _st.InputArray, w: _st.OutputArray, flags: SVDFlags/* = 0*/): void;
    backSubst(w: _st.InputArray, u: _st.InputArray, vt: _st.InputArray, rhs: _st.InputArray, dst: _st.OutputArray): void;
    solveZ(src: _st.InputArray, dst: _st.OutputArray): void;


    compute<T>(a: _matx.Matx<T>, w: _matx.Matx<T>, u: _matx.Matx<T>, vt: _matx.Matx<T>): void;
    compute<T>(a: _matx.Matx<T>, w: _matx.Matx<T>): void;

    backSubst<T>(w: _matx.Matx<T>, u: _matx.Matx<T>, vt: _matx.Matx<T>, rhs: _matx.Matx<T>, dst: _matx.Matx<T>): void;
}
export var SVD: SVDStatic = alvision_module.SVD;
