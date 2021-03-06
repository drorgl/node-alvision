import alvision_module from "../bindings";

import * as _st from './static';

//namespace alvision {


//export enum MatrixType {
//    "CV_8U",//       = <any>("CV_8U"),
//    "CV_8S",// = <any>"CV_8S",
//    "CV_16U",// = <any>"CV_16U",
//    "CV_16S",// = <any>"CV_16S",
//    "CV_32S",// = <any>"CV_32S",
//    "CV_32F",// = <any>"CV_32F",
//    "CV_64F",// = <any>"CV_64F",
//    "CV_USRTYPE1",// = <any>"CV_USRTYPE1",
//
//    "CV_8UC1",// = <any>"CV_8UC1",
//    "CV_8UC2",// = <any>"CV_8UC2",
//    "CV_8UC3",// = <any>"CV_8UC3",
//    "CV_8UC4",// = <any>"CV_8UC4",
//
//    "CV_8SC1",// = <any>"CV_8SC1",
//    "CV_8SC2",// = <any>"CV_8SC2",
//    "CV_8SC3",// = <any>"CV_8SC3",
//    "CV_8SC4",// = <any>"CV_8SC4",
//
//    "CV_16UC1",// = <any>"CV_16U1",
//    "CV_16UC2",// = <any>"CV_16U2",
//    "CV_16UC3",// = <any>"CV_16U3",
//    "CV_16UC4",// = <any>"CV_16U4",
//
//    "CV_16SC1",// = <any>"CV_16SC1",
//    "CV_16SC2",// = <any>"CV_16SC2",
//    "CV_16SC3",// = <any>"CV_16SC3",
//    "CV_16SC4",// = <any>"CV_16SC4",
//
//    "CV_32SC1",// = <any>"CV_32SC1",
//    "CV_32SC2",// = <any>"CV_32SC2",
//    "CV_32SC3",// = <any>"CV_32SC3",
//    "CV_32SC4",// = <any>"CV_32SC4",
//
//    "CV_32FC1",// = <any>"CV_32FC1",
//    "CV_32FC2",// = <any>"CV_32FC2",
//    "CV_32FC3",// = <any>"CV_32FC3",
//    "CV_32FC4",// = <any>"CV_32FC4",
//
//    "CV_64FC1",// = <any>"CV_64FC1",
//    "CV_64FC2",// = <any>"CV_64FC2",
//    "CV_64FC3",// = <any>"CV_64FC3",
//    "CV_64FC4"// = <any>"CV_64FC4"
//}

const CV_CN_MAX = 512;
const CV_CN_SHIFT = 3;
const CV_DEPTH_MAX = (1 << CV_CN_SHIFT);
export const CV_MAT_DEPTH_MASK = (CV_DEPTH_MAX - 1);

const CV_MAT_CN_MASK = ((CV_CN_MAX - 1) << CV_CN_SHIFT);
const CV_MAT_TYPE_MASK = (CV_DEPTH_MAX * CV_CN_MAX - 1);


interface ICV_MAKETYPE {
    (depth: number | _st.int | MatrixType, channels: number | _st.int): number;
    //(depth: MatrixType, channels: number | _st.int): number;
}

var _CV_MAKETYPE: ICV_MAKETYPE = alvision_module.MatrixType.CV_MAKETYPE;


export enum MatrixType {
    //const CV_8U = CV_MAKETYPE();

     CV_8U        = 0,
     CV_8S        = 1,
     CV_16U       = 2,
     CV_16S       = 3,
     CV_32S       = 4,
     CV_32F       = 5,
     CV_64F       = 6,
     CV_USRTYPE1  = 7,

    
    
    //
    //#define CV_MAKETYPE(depth, cn)(CV_MAT_DEPTH(depth) + (((cn) - 1) << CV_CN_SHIFT))
    //#define CV_MAKE_TYPE CV_MAKETYPE

     CV_8UC1 =  _CV_MAKETYPE(CV_8U, 1),
     CV_8UC2  = _CV_MAKETYPE(CV_8U, 2),
     CV_8UC3  = _CV_MAKETYPE(CV_8U, 3),
     CV_8UC4  = _CV_MAKETYPE(CV_8U, 4),
    //#define CV_8UC(n) CV_MAKETYPE(CV_8U, (n)),

    CV_8SC1  = _CV_MAKETYPE(CV_8S, 1),
    CV_8SC2  = _CV_MAKETYPE(CV_8S, 2),
    CV_8SC3  = _CV_MAKETYPE(CV_8S, 3),
    CV_8SC4  = _CV_MAKETYPE(CV_8S, 4),
    //#define CV_8SC(n) CV_MAKETYPE(CV_8S, (n)),

    CV_16UC1  = _CV_MAKETYPE(CV_16U, 1),
    CV_16UC2  = _CV_MAKETYPE(CV_16U, 2),
    CV_16UC3  = _CV_MAKETYPE(CV_16U, 3),
    CV_16UC4  = _CV_MAKETYPE(CV_16U, 4),
    //#define CV_16UC(n) CV_MAKETYPE(CV_16U, (n)),

    CV_16SC1 = _CV_MAKETYPE(CV_16S, 1),
    CV_16SC2 = _CV_MAKETYPE(CV_16S, 2),
    CV_16SC3 = _CV_MAKETYPE(CV_16S, 3),
    CV_16SC4 = _CV_MAKETYPE(CV_16S, 4),
    //#define CV_16SC(n) CV_MAKETYPE(CV_16S, (n)),

    CV_32SC1  = _CV_MAKETYPE(CV_32S, 1),
    CV_32SC2  = _CV_MAKETYPE(CV_32S, 2),
    CV_32SC3  = _CV_MAKETYPE(CV_32S, 3),
    CV_32SC4  = _CV_MAKETYPE(CV_32S, 4),
    //#define CV_32SC(n) CV_MAKETYPE(CV_32S, (n)),

    CV_32FC1  = _CV_MAKETYPE(CV_32F, 1),
    CV_32FC2  = _CV_MAKETYPE(CV_32F, 2),
    CV_32FC3  = _CV_MAKETYPE(CV_32F, 3),
    CV_32FC4  = _CV_MAKETYPE(CV_32F, 4),
    //#define CV_32FC(n) CV_MAKETYPE(CV_32F, (n)),

    CV_64FC1  = _CV_MAKETYPE(CV_64F, 1),
    CV_64FC2  = _CV_MAKETYPE(CV_64F, 2),
    CV_64FC3  = _CV_MAKETYPE(CV_64F, 3),
    CV_64FC4  = _CV_MAKETYPE(CV_64F, 4),
    //#define CV_64FC(n) CV_MAKETYPE(CV_64F, (n)),

}

export module MatrixType {
    

    export function CV_MAT_DEPTH(flags: _st.int): _st.int {
        return ((flags.valueOf()) & CV_MAT_DEPTH_MASK)
    }

    export function CV_MAT_CN(flags: _st.int) : _st.int{
        return ((((flags.valueOf()) & CV_MAT_CN_MASK) >> CV_CN_SHIFT) + 1)
    }

    export function CV_MAT_TYPE(flags: _st.int): _st.int {
        return ((flags.valueOf()) & CV_MAT_TYPE_MASK)
    }

    interface ICV_ELEM_SIZE {
        (type: _st.int): _st.int;
    }

    export var CV_ELEM_SIZE: ICV_ELEM_SIZE = alvision_module.MatrixType.CV_ELEM_SIZE;
    //export function CV_ELEM_SIZE(type: _st.int): _st.int {
    //    return (CV_MAT_CN(type).valueOf() << ((((sizeof(size_t) / 4 + 1) * 16384 | 0x3a50) >> CV_MAT_DEPTH(type).valueOf() * 2) & 3))
    //}


    //export declare function CV_MAKETYPE(depth: number, channels: number): number = alvision_module.MatrixType.CV_MAKETYPE;
    export var CV_MAKETYPE = _CV_MAKETYPE;

    export function ToString(type: _st.int | MatrixType) {
        var depth = type.valueOf() & CV_MAT_DEPTH_MASK;
        var chans = 1 + (type.valueOf() >> CV_CN_SHIFT);

        var r = "";

        switch (depth) {
            case MatrixType.CV_8U: r = "8U"; break;
            case MatrixType.CV_8S: r = "8S"; break;
            case MatrixType.CV_16U: r = "16U"; break;
            case MatrixType.CV_16S: r = "16S"; break;
            case MatrixType.CV_32S: r = "32S"; break;
            case MatrixType.CV_32F: r = "32F"; break;
            case MatrixType.CV_64F: r = "64F"; break;
            default: r = "User"; break;
        }

        r += "C";
        r += (chans + '0');

        return r;
    }
}
//}



