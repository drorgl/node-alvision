/// <reference path="Matrix.ts" />

var alvision_module = require('../../lib/bindings.js');

import * as matrix from './Matrix'

//module alvision {
    export interface NamedWindow {
        show(mat: matrix.Matrix): NamedWindow;
        destroy(): NamedWindow;
        blockingWaitKey(time: number): number;
    }
//}

