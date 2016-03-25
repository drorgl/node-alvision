////// <reference path="Matrix.ts" />
var alvision_module = require('../../lib/bindings.js');

import * as constants from './Constants'
import * as _matx from './Matx'

export interface Vec<T> extends _matx.Matx<T> {
    row(y: number): Array<number>;
    col(x: number): Array<number>;
    pixelRow(y: number): Array<number>;
    pixelCol(x: number): Array<number>;

    width: number;
    height: number;
}

export interface VecStatic<T> {
    Eye(width: number, height: number): Vec<T>;

    new (): Vec<T>;
    new (rows: number, cols: number, type: number): Vec<T>;
}

export var Vecd: VecStatic<constants.double> = alvision_module.Vecd;
export var Vecf: VecStatic<constants.float> = alvision_module.Vecf;