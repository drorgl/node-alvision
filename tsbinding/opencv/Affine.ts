/// <reference path="../../typings/tsd.d.ts" />

////// <reference path="Matrix.ts" />
var alvision_module = require('../../lib/bindings.js');

import * as _constants from './Constants'
import * as _matrix from './Matrix'
import * as _st from './static'
import * as _matx from './Matx'
import * as _vec from './Vec'



export interface Affine<T> {
    row(y: number): Array<number>;
    col(x: number): Array<number>;
    pixelRow(y: number): Array<number>;
    pixelCol(x: number): Array<number>;

    width: number;
    height: number;

    matrix: _matrix.Matrix;

    linear(): _matx.Matx<T>
    inv(method?: _st.DecompTypes/* = _st.DecompTypes.DECOMP_SVD*/): Affine<T>;
    rvec(): _vec.Vec<T>;

    op_Multiplication(aff: Affine<T>): Affine<T>;
}


export interface AffineStatic<T> {
    Eye(width: number, height: number): Affine<T>;

    new (): Affine<T>;
    new (vec: _vec.Vec<T>): Affine<T>;
    new (vec: _vec.Vec<T>, vec2: _vec.Vec<T>): Affine<T>;
    new (matx: _matx.Matx<T>): Affine<T>;
    new (R: _matx.Matx<T>, vec: _vec.Vec<T>): Affine<T>;

    new (data : _matrix.Matrix,t : _vec.Vec<T> /* = Vec3::all(0)*/) : Affine<T>;
    new ( vals : Array<T>);
}

export var Affined: AffineStatic<_constants.double> = alvision_module.Affined;
export var Affinef: AffineStatic<_constants.float> = alvision_module.Affined;
