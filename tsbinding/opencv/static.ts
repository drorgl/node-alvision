/// <reference path="../../typings/index.d.ts" />

import alvision_module from "../bindings";

import process = require("process");

import * as _types from './types';
import * as _cvdef from './cvdef';
import * as _cuda from './cuda';
import * as _mat from './mat';


export interface double extends Number { };
export interface char extends String { };
export interface uchar { };
export interface schar { };
export interface short extends Number { };
export interface ushort extends Number { };
export interface int extends Number { };
export interface uint extends Number { };
export interface float extends Number { };
export interface double extends Number { };
export interface int64 extends Number { };
export interface uint64 extends Number { };
export interface size_t extends Number { };

//import * as _matrix from './Matrix'
//import * as _constants from './Constants'
//import * as _scalar from './Scalar'

export enum IOArrayKind{
    KIND_SHIFT = 16,
    FIXED_TYPE = 0x8000 << KIND_SHIFT,
    FIXED_SIZE = 0x4000 << KIND_SHIFT,
    KIND_MASK = 31 << KIND_SHIFT,

    NONE = 0 << KIND_SHIFT,
    MAT = 1 << KIND_SHIFT,
    MATX = 2 << KIND_SHIFT,
    STD_VECTOR = 3 << KIND_SHIFT,
    STD_VECTOR_VECTOR = 4 << KIND_SHIFT,
    STD_VECTOR_MAT = 5 << KIND_SHIFT,
    EXPR = 6 << KIND_SHIFT,
    OPENGL_BUFFER = 7 << KIND_SHIFT,
    CUDA_HOST_MEM = 8 << KIND_SHIFT,
    CUDA_GPU_MAT = 9 << KIND_SHIFT,
    UMAT = 10 << KIND_SHIFT,
    STD_VECTOR_UMAT = 11 << KIND_SHIFT,
    STD_BOOL_VECTOR = 12 << KIND_SHIFT,
    STD_VECTOR_CUDA_GPU_MAT = 13 << KIND_SHIFT
};

export interface IOArrayStatic {
    new (): IOArray;
    //new <T>(arr: Array<T>): IOArray;
}

export interface IOArray {//extends Array<any> {
    kind?(): IOArrayKind;
    getGpuMat?(): _cuda.GpuMat;
    getMat?(idx?: int /*= -1*/): _mat.Mat; 

    //create?(sz: _types.Size, type: int, i?: int /*= -1*/, allowTransposed?: boolean /*= false*/, fixedDepthMask?: int /*= 0*/): void;
    //create?(rows: int, cols: int, type: int, i?: int /*= -1*/, allowTransposed?: boolean /*= false*/, fixedDepthMask?: int /*= 0*/): void;
    //create?(dims: int, size: Array<int>, type: int, i?: int /*= -1*/, allowTransposed?: boolean /*= false*/, fixedDepthMask?: int /*= 0*/): void;

    create?(rows: int, cols: int, type: int): void;
    create?(size: _types.Size, type: int): void;


    type?(): int;
    rows?(): int;
    cols?(): int;

    //channels?(): int;
    getGpuMatRef?(): _cuda.GpuMat;
    setTo?(value: InputArray | _types.Scalar | int, mask?: InputArray /*= noArray()*/): void;
}

export var IOArray: IOArrayStatic = alvision_module.IOArray;

export type InputArray = IOArray;
export type InputArrayOfArrays = IOArray;
export type OutputArray               = IOArray;
export type OutputArrayOfArrays       = IOArray;
export type InputOutputArray          = IOArray;
export type InputOutputArrayOfArrays  = IOArray;

//export interface InputArray extends IOArray { }
//export interface InputArrayOfArrays extends Array<InputArray> { }
//export interface OutputArray extends IOArray { }
//export interface OutputArrayOfArrays extends Array<InputArray> { }
//export interface InputOutputArray extends IOArray {}
//export interface InputOutputArrayOfArrays extends  Array<InputArray> { }

//-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
//
// Constants
//
//-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
export const DBL_DECIMAL_DIG = 17                      ;// # of decimal digits of rounding precision
export const DBL_DIG         = 15                      ;// # of decimal digits of precision
export const DBL_EPSILON     = 2.2204460492503131e-016 ;// smallest such that 1.0+DBL_EPSILON != 1.0
export const DBL_HAS_SUBNORM = 1                       ;// type does support subnormal numbers
export const DBL_MANT_DIG    = 53                      ;// # of bits in mantissa
export const DBL_MAX         = 1.7976931348623158e+308 ;// max value
export const DBL_MAX_10_EXP  = 308                     ;// max decimal exponent
export const DBL_MAX_EXP     = 1024                    ;// max binary exponent
export const DBL_MIN         = 2.2250738585072014e-308 ;// min positive value
export const DBL_MIN_10_EXP  = (-307)                  ;// min decimal exponent
export const DBL_MIN_EXP     = (-1021)                 ;// min binary exponent
export const _DBL_RADIX      = 2                       ;// exponent radix
export const DBL_TRUE_MIN = 4.9406564584124654e-324;    // min positive value

export const FLT_DECIMAL_DIG = 9                       ;// # of decimal digits of rounding precision
export const FLT_DIG         = 6                       ;// # of decimal digits of precision
export const FLT_EPSILON     = 1.192092896e-07        ;// smallest such that 1.0+FLT_EPSILON != 1.0
export const FLT_HAS_SUBNORM = 1                       ;// type does support subnormal numbers
export const FLT_GUARD       = 0
export const FLT_MANT_DIG    = 24                      ;// # of bits in mantissa
export const FLT_MAX         = 3.402823466e+38        ;// max value
export const FLT_MAX_10_EXP  = 38                      ;// max decimal exponent
export const FLT_MAX_EXP     = 128                     ;// max binary exponent
export const FLT_MIN         = 1.175494351e-38        ;// min normalized positive value
export const FLT_MIN_10_EXP  = (-37)                   ;// min decimal exponent
export const FLT_MIN_EXP     = (-125)                  ;// min binary exponent
export const FLT_NORMALIZE   = 0
export const FLT_RADIX       = 2                       ;// exponent radix
export const FLT_TRUE_MIN    = 1.401298464e-45        ;// min positive value

export const LDBL_DIG        = DBL_DIG                 ;// # of decimal digits of precision
export const LDBL_EPSILON    = DBL_EPSILON             ;// smallest such that 1.0+LDBL_EPSILON != 1.0
export const LDBL_HAS_SUBNORM= DBL_HAS_SUBNORM         ;// type does support subnormal numbers
export const LDBL_MANT_DIG   = DBL_MANT_DIG            ;// # of bits in mantissa
export const LDBL_MAX        = DBL_MAX                 ;// max value
export const LDBL_MAX_10_EXP = DBL_MAX_10_EXP          ;// max decimal exponent
export const LDBL_MAX_EXP    = DBL_MAX_EXP             ;// max binary exponent
export const LDBL_MIN        = DBL_MIN                 ;// min normalized positive value
export const LDBL_MIN_10_EXP = DBL_MIN_10_EXP          ;// min decimal exponent
export const LDBL_MIN_EXP    = DBL_MIN_EXP             ;// min binary exponent
export const _LDBL_RADIX     = _DBL_RADIX              ;// exponent radix
export const LDBL_TRUE_MIN   = DBL_TRUE_MIN            ;// min positive value

export const DECIMAL_DIG = DBL_DECIMAL_DIG;

export const INT_MIN   =  (-2147483647 - 1); // minimum (signed) int value
export const INT_MAX = 2147483647;// maximum (signed) int value

export const SHRT_MIN = (-32768);      // minimum (signed) short value
export const SHRT_MAX =     32767   ;      // maximum (signed) short value




//interface IRodrigues {
//    (_src: InputArray, _dst: OutputArray, _jacobian?: OutputArray): void;
//}

//export var Rodrigues: IRodrigues = alvision_module.Rodrigues;

//interface Iabsdiff {
//    (src1: InputArray, src2: InputArray, dst: OutputArray): void;
//}

//export var absdiff: Iabsdiff = alvision_module.absdiff;

//interface Irandu {
//    (dst: IOArray,low: InputArray,high : InputArray): void;
//}
//export var randu: Irandu = alvision_module.randu;

//interface Itransform {
//    (_src: InputArray, _dst: OutputArray, _mtx : InputArray ): void;
//}
//export var transform: Itransform = alvision_module.transform;

//interface IestimateAffine3D {
//    (src: InputArray, dst: InputArray, out: OutputArray, inliers: OutputArray, ransacThreshold?: _constants.double/* = 3*/, confidence?: _constants.double /* = 0.99*/): int;
//}
//export var estimateAffine3D: IestimateAffine3D = alvision_module.estimateAffine3D;

//interface Isum {
//    (src: InputArray): _scalar.Scalar;
//}

//export var sum: Isum = alvision_module.sum;

//interface Iimreadmulti {
//    (filename: string, mats: Array<_matrix.Matrix>, flags: ImreadModes /*= IMREAD_ANYCOLOR*/): boolean;
//}
////bool imreadmulti(const String& filename, std::vector<Mat>& mats, int flags = IMREAD_ANYCOLOR);
//export var imreadmulti: Iimreadmulti = alvision_module.imreadmulti;

//interface Iimread {
//    (filename: string, flags: ImreadModes): _matrix.Matrix;
//}
////Mat imread( const String& filename, int flags = IMREAD_COLOR );
//export var imread: Iimread = alvision_module.imread;


//void circle(InputOutputArray img, Point center, int radius,
//                       const Scalar& color, int thickness = 1,
//    int lineType = LINE_8, int shift = 0);

//export enum NormTypes {
//    NORM_INF = 1,
//    NORM_L1 = 2,
//    NORM_L2 = 4,
//    NORM_L2SQR = 5,
//    NORM_HAMMING = 6,
//    NORM_HAMMING2 = 7,
//    NORM_TYPE_MASK = 7,
//    NORM_RELATIVE = 8, //!< flag
//    NORM_MINMAX = 32 //!< flag
//};

//export //! matrix decomposition types
//    enum DecompTypes {
//    /** Gaussian elimination with the optimal pivot element chosen. */
//    DECOMP_LU = 0,
//    /** singular value decomposition (SVD) method; the system can be over-defined and/or the matrix
//    src1 can be singular */
//    DECOMP_SVD = 1,
//    /** eigenvalue decomposition; the matrix src1 must be symmetrical */
//    DECOMP_EIG = 2,
//    /** Cholesky \f$LL^T\f$ factorization; the matrix src1 must be symmetrical and positively
//    defined */
//    DECOMP_CHOLESKY = 3,
//    /** QR factorization; the system can be over-defined and/or the matrix src1 can be singular */
//    DECOMP_QR = 4,
//    /** while all the previous flags are mutually exclusive, this flag can be used together with
//    any of the previous; it means that the normal equations
//    \f$\texttt{src1}^T\cdot\texttt{src1}\cdot\texttt{dst}=\texttt{src1}^T\texttt{src2}\f$ are
//    solved instead of the original system
//    \f$\texttt{src1}\cdot\texttt{dst}=\texttt{src2}\f$ */
//    DECOMP_NORMAL = 16
//};

//export enum ImreadModes {
//    IMREAD_UNCHANGED = -1, //!< If set, return the loaded image as is (with alpha channel, otherwise it gets cropped).
//    IMREAD_GRAYSCALE = 0,  //!< If set, always convert image to the single channel grayscale image.
//    IMREAD_COLOR = 1,  //!< If set, always convert image to the 3 channel BGR color image.
//    IMREAD_ANYDEPTH = 2,  //!< If set, return 16-bit/32-bit image when the input has the corresponding depth, otherwise convert it to 8-bit.
//    IMREAD_ANYCOLOR = 4,  //!< If set, the image is read in any possible color format.
//    IMREAD_LOAD_GDAL = 8,  //!< If set, use the gdal driver for loading the image.
//    IMREAD_REDUCED_GRAYSCALE_2 = 16, //!< If set, always convert image to the single channel grayscale image and the image size reduced 1/2.
//    IMREAD_REDUCED_COLOR_2 = 17, //!< If set, always convert image to the 3 channel BGR color image and the image size reduced 1/2.
//    IMREAD_REDUCED_GRAYSCALE_4 = 32, //!< If set, always convert image to the single channel grayscale image and the image size reduced 1/4.
//    IMREAD_REDUCED_COLOR_4 = 33, //!< If set, always convert image to the 3 channel BGR color image and the image size reduced 1/4.
//    IMREAD_REDUCED_GRAYSCALE_8 = 64, //!< If set, always convert image to the single channel grayscale image and the image size reduced 1/8.
//    IMREAD_REDUCED_COLOR_8 = 65  //!< If set, always convert image to the 3 channel BGR color image and the image size reduced 1/8.
//};


interface Itempfile {
    (suffix: string): string;
}

export var tempfile: Itempfile = alvision_module.tempfile;

export interface ItransformOp<T> {
    run(val: T): T;
}

export function transformOp<T>(srcarr: Array<T>, dstarr: Array<T>, op: ItransformOp<T>) {
    if (!srcarr || (!srcarr.hasOwnProperty("length"))) {
        throw new Error("srcarr is not an initialized array");
    }

    if (!dstarr || (!dstarr.hasOwnProperty("length"))) {
        throw new Error("dstarr is not an initialized array");
    }
    for (var i = 0; i < srcarr.length; i++) {
        dstarr[i] = op.run(srcarr[i]);
    }
}

export function countOp<T>(arr: Array<T>, val: T): number {
    var c = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            c++;
        }
    }
    return c;
}

export function accumulateOp<T>(arr: Array<T>, init: T, cbSum? : (a : T, b : T)=>T): T {
    var sum: T = init;
    for (var i = 0; i < arr.length; i++) {
        if (cbSum != null) {
            sum = cbSum(sum, arr[i]);
        } else {
            sum = <any>sum + <any>arr[i];
        }
    }
    return sum;
}

///** Constants for color conversion */
//export enum ColorConversion
//{
//    CV_BGR2BGRA = 0,
//    CV_RGB2RGBA = CV_BGR2BGRA,

//    CV_BGRA2BGR = 1,
//    CV_RGBA2RGB = CV_BGRA2BGR,

//    CV_BGR2RGBA = 2,
//    CV_RGB2BGRA = CV_BGR2RGBA,

//    CV_RGBA2BGR = 3,
//    CV_BGRA2RGB = CV_RGBA2BGR,

//    CV_BGR2RGB = 4,
//    CV_RGB2BGR = CV_BGR2RGB,

//    CV_BGRA2RGBA = 5,
//    CV_RGBA2BGRA = CV_BGRA2RGBA,

//    CV_BGR2GRAY = 6,
//    CV_RGB2GRAY = 7,
//    CV_GRAY2BGR = 8,
//    CV_GRAY2RGB = CV_GRAY2BGR,
//    CV_GRAY2BGRA = 9,
//    CV_GRAY2RGBA = CV_GRAY2BGRA,
//    CV_BGRA2GRAY = 10,
//    CV_RGBA2GRAY = 11,

//    CV_BGR2BGR565 = 12,
//    CV_RGB2BGR565 = 13,
//    CV_BGR5652BGR = 14,
//    CV_BGR5652RGB = 15,
//    CV_BGRA2BGR565 = 16,
//    CV_RGBA2BGR565 = 17,
//    CV_BGR5652BGRA = 18,
//    CV_BGR5652RGBA = 19,

//    CV_GRAY2BGR565 = 20,
//    CV_BGR5652GRAY = 21,

//    CV_BGR2BGR555 = 22,
//    CV_RGB2BGR555 = 23,
//    CV_BGR5552BGR = 24,
//    CV_BGR5552RGB = 25,
//    CV_BGRA2BGR555 = 26,
//    CV_RGBA2BGR555 = 27,
//    CV_BGR5552BGRA = 28,
//    CV_BGR5552RGBA = 29,

//    CV_GRAY2BGR555 = 30,
//    CV_BGR5552GRAY = 31,

//    CV_BGR2XYZ = 32,
//    CV_RGB2XYZ = 33,
//    CV_XYZ2BGR = 34,
//    CV_XYZ2RGB = 35,

//    CV_BGR2YCrCb = 36,
//    CV_RGB2YCrCb = 37,
//    CV_YCrCb2BGR = 38,
//    CV_YCrCb2RGB = 39,

//    CV_BGR2HSV = 40,
//    CV_RGB2HSV = 41,

//    CV_BGR2Lab = 44,
//    CV_RGB2Lab = 45,

//    CV_BayerBG2BGR = 46,
//    CV_BayerGB2BGR = 47,
//    CV_BayerRG2BGR = 48,
//    CV_BayerGR2BGR = 49,

//    CV_BayerBG2RGB = CV_BayerRG2BGR,
//    CV_BayerGB2RGB = CV_BayerGR2BGR,
//    CV_BayerRG2RGB = CV_BayerBG2BGR,
//    CV_BayerGR2RGB = CV_BayerGB2BGR,

//    CV_BGR2Luv = 50,
//    CV_RGB2Luv = 51,
//    CV_BGR2HLS = 52,
//    CV_RGB2HLS = 53,

//    CV_HSV2BGR = 54,
//    CV_HSV2RGB = 55,

//    CV_Lab2BGR = 56,
//    CV_Lab2RGB = 57,
//    CV_Luv2BGR = 58,
//    CV_Luv2RGB = 59,
//    CV_HLS2BGR = 60,
//    CV_HLS2RGB = 61,

//    CV_BayerBG2BGR_VNG = 62,
//    CV_BayerGB2BGR_VNG = 63,
//    CV_BayerRG2BGR_VNG = 64,
//    CV_BayerGR2BGR_VNG = 65,

//    CV_BayerBG2RGB_VNG = CV_BayerRG2BGR_VNG,
//    CV_BayerGB2RGB_VNG = CV_BayerGR2BGR_VNG,
//    CV_BayerRG2RGB_VNG = CV_BayerBG2BGR_VNG,
//    CV_BayerGR2RGB_VNG = CV_BayerGB2BGR_VNG,

//    CV_BGR2HSV_FULL = 66,
//    CV_RGB2HSV_FULL = 67,
//    CV_BGR2HLS_FULL = 68,
//    CV_RGB2HLS_FULL = 69,

//    CV_HSV2BGR_FULL = 70,
//    CV_HSV2RGB_FULL = 71,
//    CV_HLS2BGR_FULL = 72,
//    CV_HLS2RGB_FULL = 73,

//    CV_LBGR2Lab = 74,
//    CV_LRGB2Lab = 75,
//    CV_LBGR2Luv = 76,
//    CV_LRGB2Luv = 77,

//    CV_Lab2LBGR = 78,
//    CV_Lab2LRGB = 79,
//    CV_Luv2LBGR = 80,
//    CV_Luv2LRGB = 81,

//    CV_BGR2YUV = 82,
//    CV_RGB2YUV = 83,
//    CV_YUV2BGR = 84,
//    CV_YUV2RGB = 85,

//    CV_BayerBG2GRAY = 86,
//    CV_BayerGB2GRAY = 87,
//    CV_BayerRG2GRAY = 88,
//    CV_BayerGR2GRAY = 89,

//    //YUV 4:2:0 formats family
//    CV_YUV2RGB_NV12 = 90,
//    CV_YUV2BGR_NV12 = 91,
//    CV_YUV2RGB_NV21 = 92,
//    CV_YUV2BGR_NV21 = 93,
//    CV_YUV420sp2RGB = CV_YUV2RGB_NV21,
//    CV_YUV420sp2BGR = CV_YUV2BGR_NV21,

//    CV_YUV2RGBA_NV12 = 94,
//    CV_YUV2BGRA_NV12 = 95,
//    CV_YUV2RGBA_NV21 = 96,
//    CV_YUV2BGRA_NV21 = 97,
//    CV_YUV420sp2RGBA = CV_YUV2RGBA_NV21,
//    CV_YUV420sp2BGRA = CV_YUV2BGRA_NV21,

//    CV_YUV2RGB_YV12 = 98,
//    CV_YUV2BGR_YV12 = 99,
//    CV_YUV2RGB_IYUV = 100,
//    CV_YUV2BGR_IYUV = 101,
//    CV_YUV2RGB_I420 = CV_YUV2RGB_IYUV,
//    CV_YUV2BGR_I420 = CV_YUV2BGR_IYUV,
//    CV_YUV420p2RGB = CV_YUV2RGB_YV12,
//    CV_YUV420p2BGR = CV_YUV2BGR_YV12,

//    CV_YUV2RGBA_YV12 = 102,
//    CV_YUV2BGRA_YV12 = 103,
//    CV_YUV2RGBA_IYUV = 104,
//    CV_YUV2BGRA_IYUV = 105,
//    CV_YUV2RGBA_I420 = CV_YUV2RGBA_IYUV,
//    CV_YUV2BGRA_I420 = CV_YUV2BGRA_IYUV,
//    CV_YUV420p2RGBA = CV_YUV2RGBA_YV12,
//    CV_YUV420p2BGRA = CV_YUV2BGRA_YV12,

//    CV_YUV2GRAY_420 = 106,
//    CV_YUV2GRAY_NV21 = CV_YUV2GRAY_420,
//    CV_YUV2GRAY_NV12 = CV_YUV2GRAY_420,
//    CV_YUV2GRAY_YV12 = CV_YUV2GRAY_420,
//    CV_YUV2GRAY_IYUV = CV_YUV2GRAY_420,
//    CV_YUV2GRAY_I420 = CV_YUV2GRAY_420,
//    CV_YUV420sp2GRAY = CV_YUV2GRAY_420,
//    CV_YUV420p2GRAY = CV_YUV2GRAY_420,

//    //YUV 4:2:2 formats family
//    CV_YUV2RGB_UYVY = 107,
//    CV_YUV2BGR_UYVY = 108,
//    //CV_YUV2RGB_VYUY = 109,
//    //CV_YUV2BGR_VYUY = 110,
//    CV_YUV2RGB_Y422 = CV_YUV2RGB_UYVY,
//    CV_YUV2BGR_Y422 = CV_YUV2BGR_UYVY,
//    CV_YUV2RGB_UYNV = CV_YUV2RGB_UYVY,
//    CV_YUV2BGR_UYNV = CV_YUV2BGR_UYVY,

//    CV_YUV2RGBA_UYVY = 111,
//    CV_YUV2BGRA_UYVY = 112,
//    //CV_YUV2RGBA_VYUY = 113,
//    //CV_YUV2BGRA_VYUY = 114,
//    CV_YUV2RGBA_Y422 = CV_YUV2RGBA_UYVY,
//    CV_YUV2BGRA_Y422 = CV_YUV2BGRA_UYVY,
//    CV_YUV2RGBA_UYNV = CV_YUV2RGBA_UYVY,
//    CV_YUV2BGRA_UYNV = CV_YUV2BGRA_UYVY,

//    CV_YUV2RGB_YUY2 = 115,
//    CV_YUV2BGR_YUY2 = 116,
//    CV_YUV2RGB_YVYU = 117,
//    CV_YUV2BGR_YVYU = 118,
//    CV_YUV2RGB_YUYV = CV_YUV2RGB_YUY2,
//    CV_YUV2BGR_YUYV = CV_YUV2BGR_YUY2,
//    CV_YUV2RGB_YUNV = CV_YUV2RGB_YUY2,
//    CV_YUV2BGR_YUNV = CV_YUV2BGR_YUY2,

//    CV_YUV2RGBA_YUY2 = 119,
//    CV_YUV2BGRA_YUY2 = 120,
//    CV_YUV2RGBA_YVYU = 121,
//    CV_YUV2BGRA_YVYU = 122,
//    CV_YUV2RGBA_YUYV = CV_YUV2RGBA_YUY2,
//    CV_YUV2BGRA_YUYV = CV_YUV2BGRA_YUY2,
//    CV_YUV2RGBA_YUNV = CV_YUV2RGBA_YUY2,
//    CV_YUV2BGRA_YUNV = CV_YUV2BGRA_YUY2,

//    CV_YUV2GRAY_UYVY = 123,
//    CV_YUV2GRAY_YUY2 = 124,
//    //CV_YUV2GRAY_VYUY = CV_YUV2GRAY_UYVY,
//    CV_YUV2GRAY_Y422 = CV_YUV2GRAY_UYVY,
//    CV_YUV2GRAY_UYNV = CV_YUV2GRAY_UYVY,
//    CV_YUV2GRAY_YVYU = CV_YUV2GRAY_YUY2,
//    CV_YUV2GRAY_YUYV = CV_YUV2GRAY_YUY2,
//    CV_YUV2GRAY_YUNV = CV_YUV2GRAY_YUY2,

//    // alpha premultiplication
//    CV_RGBA2mRGBA = 125,
//    CV_mRGBA2RGBA = 126,

//    CV_RGB2YUV_I420 = 127,
//    CV_BGR2YUV_I420 = 128,
//    CV_RGB2YUV_IYUV = CV_RGB2YUV_I420,
//    CV_BGR2YUV_IYUV = CV_BGR2YUV_I420,

//    CV_RGBA2YUV_I420 = 129,
//    CV_BGRA2YUV_I420 = 130,
//    CV_RGBA2YUV_IYUV = CV_RGBA2YUV_I420,
//    CV_BGRA2YUV_IYUV = CV_BGRA2YUV_I420,
//    CV_RGB2YUV_YV12 = 131,
//    CV_BGR2YUV_YV12 = 132,
//    CV_RGBA2YUV_YV12 = 133,
//    CV_BGRA2YUV_YV12 = 134,

//    // Edge-Aware Demosaicing
//    CV_BayerBG2BGR_EA = 135,
//    CV_BayerGB2BGR_EA = 136,
//    CV_BayerRG2BGR_EA = 137,
//    CV_BayerGR2BGR_EA = 138,

//    CV_BayerBG2RGB_EA = CV_BayerRG2BGR_EA,
//    CV_BayerGB2RGB_EA = CV_BayerGR2BGR_EA,
//    CV_BayerRG2RGB_EA = CV_BayerBG2BGR_EA,
//    CV_BayerGR2RGB_EA = CV_BayerGB2BGR_EA,

//    CV_COLORCVT_MAX = 139
//};

export function NewArray<T>(itemCount: number | Number, itemsFactory: () => T): Array<T> {
    var retval = new Array<T>(itemCount.valueOf());
    for (var i = 0; i < itemCount; i++) {
        retval[i] = itemsFactory();
    }
    return retval;
}



export function saturate_cast<T>(from: any, toType: string): T {
    return <T>alvision_module.saturate_cast(from, toType);
}

//export function saturate_cast<T>(from: any, toType : string): T
    

//    template <> inline uchar saturate_cast<uchar>(schar v)        { return (uchar)std::max((int)v, 0); }
//    template <> inline uchar saturate_cast<uchar>(ushort v)       { return (uchar)std::min((unsigned)v, (unsigned)UCHAR_MAX); }
//    template <> inline uchar saturate_cast<uchar>(int v)          { return (uchar)((unsigned)v <= UCHAR_MAX ? v : v > 0 ? UCHAR_MAX : 0); }
//    template <> inline uchar saturate_cast<uchar>(short v)        { return saturate_cast<uchar>((int)v); }
//    template <> inline uchar saturate_cast<uchar>(unsigned v)     { return (uchar)std::min(v, (unsigned)UCHAR_MAX); }
//    template <> inline uchar saturate_cast<uchar>(float v)        { int iv = cvRound(v); return saturate_cast<uchar>(iv); }
//    template <> inline uchar saturate_cast<uchar>(double v)       { int iv = cvRound(v); return saturate_cast<uchar>(iv); }
//    template <> inline uchar saturate_cast<uchar>(int64 v)        { return (uchar)((uint64)v <= (uint64)UCHAR_MAX ? v : v > 0 ? UCHAR_MAX : 0); }
//    template <> inline uchar saturate_cast<uchar>(uint64 v)       { return (uchar)std::min(v, (uint64)UCHAR_MAX); }
//
//    template <> inline schar saturate_cast<schar>(uchar v)        { return (schar)std::min((int)v, SCHAR_MAX); }
//    template <> inline schar saturate_cast<schar>(ushort v)       { return (schar)std::min((unsigned)v, (unsigned)SCHAR_MAX); }
//    template <> inline schar saturate_cast<schar>(int v)          { return (schar)((unsigned)(v - SCHAR_MIN) <= (unsigned)UCHAR_MAX ? v : v > 0 ? SCHAR_MAX : SCHAR_MIN); }
//    template <> inline schar saturate_cast<schar>(short v)        { return saturate_cast<schar>((int)v); }
//    template <> inline schar saturate_cast<schar>(unsigned v)     { return (schar)std::min(v, (unsigned)SCHAR_MAX); }
//    template <> inline schar saturate_cast<schar>(float v)        { int iv = cvRound(v); return saturate_cast<schar>(iv); }
//    template <> inline schar saturate_cast<schar>(double v)       { int iv = cvRound(v); return saturate_cast<schar>(iv); }
//    template <> inline schar saturate_cast<schar>(int64 v)        { return (schar)((uint64)((int64)v- SCHAR_MIN) <= (uint64)UCHAR_MAX ? v : v > 0 ? SCHAR_MAX : SCHAR_MIN); }
//    template <> inline schar saturate_cast<schar>(uint64 v)       { return (schar)std::min(v, (uint64)SCHAR_MAX); }
//
//    template <> inline ushort saturate_cast<ushort>(schar v)      { return (ushort)std::max((int)v, 0); }
//    template <> inline ushort saturate_cast<ushort>(short v)      { return (ushort)std::max((int)v, 0); }
//    template <> inline ushort saturate_cast<ushort>(int v)        { return (ushort)((unsigned)v <= (unsigned)USHRT_MAX ? v : v > 0 ? USHRT_MAX : 0); }
//    template <> inline ushort saturate_cast<ushort>(unsigned v)   { return (ushort)std::min(v, (unsigned)USHRT_MAX); }
//    template <> inline ushort saturate_cast<ushort>(float v)      { int iv = cvRound(v); return saturate_cast<ushort>(iv); }
//    template <> inline ushort saturate_cast<ushort>(double v)     { int iv = cvRound(v); return saturate_cast<ushort>(iv); }
//    template <> inline ushort saturate_cast<ushort>(int64 v)      { return (ushort)((uint64)v <= (uint64)USHRT_MAX ? v : v > 0 ? USHRT_MAX : 0); }
//    template <> inline ushort saturate_cast<ushort>(uint64 v)     { return (ushort)std::min(v, (uint64)USHRT_MAX); }
//
//    template <> inline short saturate_cast<short>(ushort v)       { return (short)std::min((int)v, SHRT_MAX); }
//    template <> inline short saturate_cast<short>(int v)          { return (short)((unsigned)(v - SHRT_MIN) <= (unsigned)USHRT_MAX ? v : v > 0 ? SHRT_MAX : SHRT_MIN); }
//    template <> inline short saturate_cast<short>(unsigned v)     { return (short)std::min(v, (unsigned)SHRT_MAX); }
//    template <> inline short saturate_cast<short>(float v)        { int iv = cvRound(v); return saturate_cast<short>(iv); }
//    template <> inline short saturate_cast<short>(double v)       { int iv = cvRound(v); return saturate_cast<short>(iv); }
//    template <> inline short saturate_cast<short>(int64 v)        { return (short)((uint64)((int64)v - SHRT_MIN) <= (uint64)USHRT_MAX ? v : v > 0 ? SHRT_MAX : SHRT_MIN); }
//    template <> inline short saturate_cast<short>(uint64 v)       { return (short)std::min(v, (uint64)SHRT_MAX); }
//
//    template <> inline int saturate_cast<int>(float v)            { return cvRound(v); }
//    template <> inline int saturate_cast<int>(double v)           { return cvRound(v); }
//
//    // we intentionally do not clip negative numbers, to make -1 become 0xffffffff etc.
//    template <> inline unsigned saturate_cast<unsigned>(float v)  { return cvRound(v); }
//    template <> inline unsigned saturate_cast<unsigned>(double v) { return cvRound(v); }
//}


export class pair<T1, T2>{
    constructor(first_: T1, second_ : T2) {
        this.first = first_;
        this.second = second_;
    }

    public first: T1;
    public second: T2;
}

export function cvGetTickCount()  : number {
    var time = process.hrtime();
    return time[0] * 1e9 + time[1]
}

export var getTickCount = cvGetTickCount;

export function cvGetTickFrequency(): number {
    return 1e9;
}

export var getTickFrequency = cvGetTickFrequency;

export function arrcopy<D, S>(dst: Array<D>, src: Array<S>, len: number): void {
    for (var i = 0; i < len; i++) {
        dst[i] = <any>(src[i]);
    }
}


export function scalarToRawData<T>(s: _types.Scalar, _buf : Array<T>,  type : int, unroll_to : int) : void
{
    var i = 0;
        //var depth = CV_MAT_DEPTH(type), cn = CV_MAT_CN(type);
    var cn = _cvdef.MatrixType.CV_MAT_CN(type);
    
    for (var i = 0; i < cn; i++) {
        _buf[i] = <any>s.val[i];
    }

    for (; i < unroll_to; i++) {
        _buf[i] = _buf[i - cn.valueOf()];
    }
    //
    ////CV_Assert(cn <= 4);
    //switch (depth) {
    //    case CV_8U:
    //        {
    //            uchar * buf = (uchar *)_buf;
    //            for (i = 0; i < cn; i++)
    //                buf[i] = saturate_cast<uchar>(s.val[i]);
    //            for (; i < unroll_to; i++)
    //                buf[i] = buf[i - cn];
    //        }
    //        break;
    //    case CV_8S:
    //        {
    //            schar * buf = (schar *)_buf;
    //            for (i = 0; i < cn; i++)
    //                buf[i] = saturate_cast<schar>(s.val[i]);
    //            for (; i < unroll_to; i++)
    //                buf[i] = buf[i - cn];
    //        }
    //        break;
    //    case CV_16U:
    //        {
    //            ushort * buf = (ushort *)_buf;
    //            for (i = 0; i < cn; i++)
    //                buf[i] = saturate_cast<ushort>(s.val[i]);
    //            for (; i < unroll_to; i++)
    //                buf[i] = buf[i - cn];
    //        }
    //        break;
    //    case CV_16S:
    //        {
    //            short * buf = (short *)_buf;
    //            for (i = 0; i < cn; i++)
    //                buf[i] = saturate_cast<short>(s.val[i]);
    //            for (; i < unroll_to; i++)
    //                buf[i] = buf[i - cn];
    //        }
    //        break;
    //    case CV_32S:
    //        {
    //            int * buf = (int *)_buf;
    //            for (i = 0; i < cn; i++)
    //                buf[i] = saturate_cast<int>(s.val[i]);
    //            for (; i < unroll_to; i++)
    //                buf[i] = buf[i - cn];
    //        }
    //        break;
    //    case CV_32F:
    //        {
    //            float * buf = (float *)_buf;
    //            for (i = 0; i < cn; i++)
    //                buf[i] = saturate_cast<float>(s.val[i]);
    //            for (; i < unroll_to; i++)
    //                buf[i] = buf[i - cn];
    //        }
    //        break;
    //    case CV_64F:
    //        {
    //            double * buf = (double *)_buf;
    //            for (i = 0; i < cn; i++)
    //                buf[i] = saturate_cast<double>(s.val[i]);
    //            for (; i < unroll_to; i++)
    //                buf[i] = buf[i - cn];
    //            break;
    //        }
    //    default:
    //        CV_Error(CV_StsUnsupportedFormat, "");
    //}
}


export var CV_MAX_DIM = alvision_module.CV_MAX_DIM;

/**
 * random shuffle array in place
 * @param array
 */
export function random_shuffle<T>(array: Array<T>): Array<T> {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

export function countkeys(o: any, key?: string | number) {
    if (key) {
        return Object.keys(o).filter((v) => (<Object>o).hasOwnProperty(v) && o[v] == key).length;
    } else {
        return Object.keys(o).filter((v) => (<Object>o).hasOwnProperty(v)).length;
    }
}

interface IDictionary<V> {
    [key: string]: V;
    [key: number]: V;
}

export class Dictionary<K,V> {
    public items: IDictionary<V> = {};

    public containsKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }

    public count(key?: K): number {
        if (key) {
            return Object.keys(this.items).filter((v) => (<Object>this.items).hasOwnProperty(v) && <any>this.items[v] == <any>key).length;
        } else {
            return Object.keys(this.items).filter((v) => (<Object>this.items).hasOwnProperty(v)).length;
        }
    }

    public clear(): void {
        this.items = {};
    }

    public add(key: K, value: V) {
        this.items[<any>key] = value;
    }

    public remove(key: K): V {
        var val = this.items[<any>key];
        delete this.items[<any>key];
        return val;
    }

    public keys(): K[] {
        var keySet: K[] = [];

        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(<any>prop);
            }
        }

        return keySet;
    }

    public values(): V[] {
        var values: V[] = [];

        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop]);
            }
        }

        return values;
    }
}



export function CheckAndAssign<T>(check: any, assignIfValid: () => T, assignOtherwise: () => T, invalidCallback?: () => void): T {
    //TODO: add debug logging
    if (check != null) {
        return assignIfValid();
    }

    if (invalidCallback) {
        invalidCallback();
    }

    return assignOtherwise();
}
