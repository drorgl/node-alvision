//////// <reference path="Matrix.ts" />
var alvision_module = require('../../lib/bindings.js');

export interface double extends Number { };
export interface uchar { };
export interface short { };
export interface ushort { };
export interface int extends Number { };
export interface float extends Number { };
export interface double extends Number { };
export interface uint64 extends Number { };
export interface size_t extends Number { };

//import * as _matrix from './Matrix'
//import * as _constants from './Constants'
//import * as _scalar from './Scalar'

export interface IOArray {}

export interface InputArray extends IOArray {}
export interface InputArrayOfArrays extends InputArray { }
export interface OutputArray extends IOArray { }
export interface OutputArrayOfArrays extends OutputArray { }
export interface InputOutputArray extends IOArray {}
export interface InputOutputArrayOfArrays extends InputOutputArray { }

export var DBL_MAX = 1.7976931348623158e+308; // max value
export var DBL_MIN = 2.2250738585072014e-308; // min positive value


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