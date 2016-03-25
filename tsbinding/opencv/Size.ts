////// <reference path="Matrix.ts" />
var alvision_module = require('../../lib/bindings.js');

import * as _constants from './Constants'
import * as _st from './static'


//module alvision {
export interface Size_<T> {
    width: T;
    height: T;
    area(): T;
}

export interface Size_Static<T> {
    new (): Size_<T>
    new (width: T, height: T): Size_<T>;
    //Size_(const Point_<_Tp>& pt);
}

export interface Size2i extends Size_<_constants.int> { }
export interface Size2f extends Size_<_constants.float> { }
export interface Size2d extends Size_<_constants.double> { }


export var Size2i: Size_Static<_constants.int> = alvision_module.Size;
export var Size2f: Size_Static<_constants.float> = alvision_module.Size;
export var Size2d: Size_Static<_constants.double> = alvision_module.Size;

export interface Size extends Size_<_constants.int> { }
export var Size = Size2i;
