var alvision_module = require('../../lib/bindings.js');

//namespace alvision {

    export enum MatrixType {
        "CV_8U",//       = <any>("CV_8U"),
        "CV_8S",// = <any>"CV_8S",
        "CV_16U",// = <any>"CV_16U",
        "CV_16S",// = <any>"CV_16S",
        "CV_32S",// = <any>"CV_32S",
        "CV_32F",// = <any>"CV_32F",
        "CV_64F",// = <any>"CV_64F",
        "CV_USRTYPE1",// = <any>"CV_USRTYPE1",

        "CV_8UC1",// = <any>"CV_8UC1",
        "CV_8UC2",// = <any>"CV_8UC2",
        "CV_8UC3",// = <any>"CV_8UC3",
        "CV_8UC4",// = <any>"CV_8UC4",

        "CV_8SC1",// = <any>"CV_8SC1",
        "CV_8SC2",// = <any>"CV_8SC2",
        "CV_8SC3",// = <any>"CV_8SC3",
        "CV_8SC4",// = <any>"CV_8SC4",

        "CV_16UC1",// = <any>"CV_16U1",
        "CV_16UC2",// = <any>"CV_16U2",
        "CV_16UC3",// = <any>"CV_16U3",
        "CV_16UC4",// = <any>"CV_16U4",

        "CV_16SC1",// = <any>"CV_16SC1",
        "CV_16SC2",// = <any>"CV_16SC2",
        "CV_16SC3",// = <any>"CV_16SC3",
        "CV_16SC4",// = <any>"CV_16SC4",

        "CV_32SC1",// = <any>"CV_32SC1",
        "CV_32SC2",// = <any>"CV_32SC2",
        "CV_32SC3",// = <any>"CV_32SC3",
        "CV_32SC4",// = <any>"CV_32SC4",

        "CV_32FC1",// = <any>"CV_32FC1",
        "CV_32FC2",// = <any>"CV_32FC2",
        "CV_32FC3",// = <any>"CV_32FC3",
        "CV_32FC4",// = <any>"CV_32FC4",

        "CV_64FC1",// = <any>"CV_64FC1",
        "CV_64FC2",// = <any>"CV_64FC2",
        "CV_64FC3",// = <any>"CV_64FC3",
        "CV_64FC4"// = <any>"CV_64FC4"
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

    export interface double extends Number { };
    export interface uchar { };
    export interface short { };
    export interface ushort { };
    export interface int extends Number { };
    export interface float extends Number { };
    export interface double extends Number { };
    export interface uint64 extends Number { };

    

