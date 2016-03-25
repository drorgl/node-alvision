/// <reference path="../../typings/tsd.d.ts" />

var alvision_module = require('../../lib/bindings.js');


import * as _constants from './Constants'
import * as _st from './static'
import * as _vec from './Vec'

export enum DistType {
    UNIFORM = 0,
    NORMAL = 1
}

//module alvision {
export interface RNG {
    next(): number;
    uniform(a : number, b : number) : number;
    //row(y: number): Array<number>;

    fill(mat: _st.IOArray, distType: DistType, a: _st.InputArray, b: _st.InputArray, saturateRange: boolean /*= false*/);

    gaussian(sigma: _constants.double): _constants.double;

    //var state: _constants.uint64;
}

export interface RNGStatic {
    //Zeros(width: number, height: number, type?: _constants.MatrixType): Scalar_<T>;
    new (): RNG;
    new (state: _constants.uint64): RNG;
}

export var RNG: RNGStatic = alvision_module.RNG;





export interface ItheRNG {
    (): RNG;
}
export var theRNG: ItheRNG = alvision_module.theRNG;
