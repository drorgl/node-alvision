////// <reference path="Matrix.ts" />
var alvision_module = require('../          ../lib/bindings.js');

import * as constants from './Constants'

//module alvision {
    export interface Matrix {
        row(y: number): Array<number>;
        col(x: number): Array<number>;
        pixelRow(y: number): Array<number>;
        pixelCol(x: number): Array<number>;

        width: number;
        height: number;
        type: constants.MatrixType;
    }

    export interface MatrixStatic {
        Zeros(width: number, height: number, type?: constants.MatrixType): Matrix;
        Ones(width: number, height: number, type?: constants.MatrixType): Matrix;
        Eye(width: number, height: number, type?: constants.MatrixType): Matrix;

        new (): Matrix
        new (rows: number, cols: number, type: constants.MatrixType): Matrix;
        new (rows: number, cols: number, type: number): Matrix;
    }

    export var Matrix: MatrixStatic = alvision_module.Matrix;
//}

