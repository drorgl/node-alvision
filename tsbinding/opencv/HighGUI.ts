/// <reference path="Matrix.ts" />

var alvision_module = require('../../lib/bindings.js');

import * as matrix from './Matrix'
import * as _st from './static'

interface IdestroyAllWindows {
    (): void;
}

export var destroyAllWindows: IdestroyAllWindows = alvision_module.destroyAllWindows;


export enum WindowFlags {
    WINDOW_NORMAL = 0x00000000, //!< the user can resize the window (no constraint) / also use to switch a fullscreen window to a normal size.
    WINDOW_AUTOSIZE = 0x00000001, //!< the user cannot resize the window, the size is constrainted by the image displayed.
    WINDOW_OPENGL = 0x00001000, //!< window with opengl support.

    WINDOW_FULLSCREEN = 1,          //!< change the window to fullscreen.
    WINDOW_FREERATIO = 0x00000100, //!< the image expends as much as it can (no ratio constraint).
    WINDOW_KEEPRATIO = 0x00000000  //!< the ratio of the image is respected.
};


interface InamedWindow {
    (winname: string, flags?: WindowFlags /*= WINDOW_AUTOSIZE*/): void;
}

export var namedWindow: InamedWindow = alvision_module.namedWindow;

interface Iimshow {
    (winname: string, mat: _st.InputArray): void;
}

export var imshow: Iimshow = alvision_module.imshow;

interface TrackbarCallback {
    (pos: _st.int, userdata: any): void;
}
//void (*TrackbarCallback)(int pos, void* userdata);

interface IcreateTrackbar {
    (trackbarname: string, winname: string, value: _st.int, count: _st.int, onChange: TrackbarCallback, userdata: any): _st.int;
}

export var createTrackbar: IcreateTrackbar = alvision.createTrackbar;

interface IgetTrackbarPos {
    (trackbarname: string, winname: string): _st.int;
}

export var getTrackbarPos: IgetTrackbarPos = alvision_module.getTrackbarPos;
//int getTrackbarPos(const String& trackbarname, const String& winname);

//TODO: convert to callback
interface IwaitKey {
    (delay: _st.int): _st.int;
}

export var waitKey: IwaitKey = alvision_module.waitKey;


////module alvision {
//    export interface NamedWindow {
//        show(mat: matrix.Matrix): NamedWindow;
//        destroy(): NamedWindow;
//        blockingWaitKey(time: number): number;
//    }
////}

