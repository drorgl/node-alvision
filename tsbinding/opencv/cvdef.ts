var alvision_module = require('../../lib/bindings.js');

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

    //#define CV_MAT_DEPTH_MASK       (CV_DEPTH_MAX - 1)
    //#define CV_MAT_DEPTH(flags)((flags) & CV_MAT_DEPTH_MASK)
    //
    //#define CV_MAKETYPE(depth, cn)(CV_MAT_DEPTH(depth) + (((cn) - 1) << CV_CN_SHIFT))
    //#define CV_MAKE_TYPE CV_MAKETYPE

     CV_8UC1 = MatrixType.CV_MAKETYPE(CV_8U, 1),
     CV_8UC2  = MatrixType.CV_MAKETYPE(CV_8U, 2),
     CV_8UC3  = MatrixType.CV_MAKETYPE(CV_8U, 3),
     CV_8UC4  = MatrixType.CV_MAKETYPE(CV_8U, 4),
    //#define CV_8UC(n) CV_MAKETYPE(CV_8U, (n)),

    CV_8SC1  = MatrixType.CV_MAKETYPE(CV_8S, 1),
    CV_8SC2  = MatrixType.CV_MAKETYPE(CV_8S, 2),
    CV_8SC3  = MatrixType.CV_MAKETYPE(CV_8S, 3),
    CV_8SC4  = MatrixType.CV_MAKETYPE(CV_8S, 4),
    //#define CV_8SC(n) CV_MAKETYPE(CV_8S, (n)),

    CV_16UC1  = MatrixType.CV_MAKETYPE(CV_16U, 1),
    CV_16UC2  = MatrixType.CV_MAKETYPE(CV_16U, 2),
    CV_16UC3  = MatrixType.CV_MAKETYPE(CV_16U, 3),
    CV_16UC4  = MatrixType.CV_MAKETYPE(CV_16U, 4),
    //#define CV_16UC(n) CV_MAKETYPE(CV_16U, (n)),

    CV_16SC1 = MatrixType.CV_MAKETYPE(CV_16S, 1),
    CV_16SC2 = MatrixType.CV_MAKETYPE(CV_16S, 2),
    CV_16SC3 = MatrixType.CV_MAKETYPE(CV_16S, 3),
    CV_16SC4 = MatrixType.CV_MAKETYPE(CV_16S, 4),
    //#define CV_16SC(n) CV_MAKETYPE(CV_16S, (n)),

    CV_32SC1  = MatrixType.CV_MAKETYPE(CV_32S, 1),
    CV_32SC2  = MatrixType.CV_MAKETYPE(CV_32S, 2),
    CV_32SC3  = MatrixType.CV_MAKETYPE(CV_32S, 3),
    CV_32SC4  = MatrixType.CV_MAKETYPE(CV_32S, 4),
    //#define CV_32SC(n) CV_MAKETYPE(CV_32S, (n)),

    CV_32FC1  = MatrixType.CV_MAKETYPE(CV_32F, 1),
    CV_32FC2  = MatrixType.CV_MAKETYPE(CV_32F, 2),
    CV_32FC3  = MatrixType.CV_MAKETYPE(CV_32F, 3),
    CV_32FC4  = MatrixType.CV_MAKETYPE(CV_32F, 4),
    //#define CV_32FC(n) CV_MAKETYPE(CV_32F, (n)),

    CV_64FC1  = MatrixType.CV_MAKETYPE(CV_64F, 1),
    CV_64FC2  = MatrixType.CV_MAKETYPE(CV_64F, 2),
    CV_64FC3  = MatrixType.CV_MAKETYPE(CV_64F, 3),
    CV_64FC4  = MatrixType.CV_MAKETYPE(CV_64F, 4),
    //#define CV_64FC(n) CV_MAKETYPE(CV_64F, (n)),

}

export module MatrixType {
    export interface ICV_MAKETYPE {
        (depth: number, channels: number): number;
        (depth: MatrixType, channels: number): number;
    }

    //export declare function CV_MAKETYPE(depth: number, channels: number): number = alvision_module.MatrixType.CV_MAKETYPE;
    export var CV_MAKETYPE: ICV_MAKETYPE = alvision_module.MatrixType.CV_MAKETYPE;
}
//}


