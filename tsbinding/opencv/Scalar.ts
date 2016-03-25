////// <reference path="Matrix.ts" />
var alvision_module = require('../../lib/bindings.js');

import * as _constants from './Constants'
import * as _st from './static'
import * as _vec from './Vec'


//module alvision {
export interface Scalar_<T> extends _vec.Vec<T> {
    //type: _constants.MatrixType;
}

export interface Scalar_Static<T> {
    All(v0: T): Scalar_<T>;

    new (): Scalar_<T>
    new (v0: T, v1: T, v2: T, v3: T): Scalar_<T>;
    new (v0: T): Scalar_<T>;
    new (v: _vec.Vec<T>): Scalar_<T>;
}

export interface Scalar extends Scalar_<_constants.double> { }

export var Scalar: Scalar_Static<_constants.double> = alvision_module.Scalar;


////! per-element product
//Scalar_ < _Tp > mul(const Scalar_<_Tp>& a, double scale= 1 ) const;

//// returns (v0, -v1, -v2, -v3)
//Scalar_ < _Tp > conj() const;

//// returns true iff v1 == v2 == v3 == 0
//bool isReal() const;