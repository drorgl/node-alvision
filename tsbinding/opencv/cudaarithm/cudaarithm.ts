/*M///////////////////////////////////////////////////////////////////////////////////////
//
//  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
//
//  By downloading, copying, installing or using the software you agree to this license.
//  If you do not agree to this license, do not download, install,
//  copy or use the software.
//
//
//                           License Agreement
//                For Open Source Computer Vision Library
//
// Copyright (C) 2000-2008, Intel Corporation, all rights reserved.
// Copyright (C) 2009, Willow Garage Inc., all rights reserved.
// Third party copyrights are property of their respective owners.
//
// Redistribution and use in source and binary forms, with or without modification,
// are permitted provided that the following conditions are met:
//
//   * Redistribution's of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//
//   * Redistribution's in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//
//   * The name of the copyright holders may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
//
// This software is provided by the copyright holders and contributors "as is" and
// any express or implied warranties, including, but not limited to, the implied
// warranties of merchantability and fitness for a particular purpose are disclaimed.
// In no event shall the Intel Corporation or contributors be liable for any direct,
// indirect, incidental, special, exemplary, or consequential damages
// (including, but not limited to, procurement of substitute goods or services;
// loss of use, data, or profits; or business interruption) however caused
// and on any theory of liability, whether in contract, strict liability,
// or tort (including negligence or otherwise) arising in any way out of
// the use of this software, even if advised of the possibility of such damage.
//
//M*/

import alvision_module from "../../bindings";

import * as _mat from './../mat'
import * as _matx from './../matx'
//import * as _st from './Constants'
import * as _st from './../static'
import * as _types from './../types'
import * as _core from './../core'
import * as _base from './../base'
import * as _affine from './../Affine'
import * as _features2d from './../features2d'
import * as _cuda from './../cuda';

//#ifndef __OPENCV_CUDAARITHM_HPP__
//#define __OPENCV_CUDAARITHM_HPP__
//
//#ifndef __cplusplus
//#  error cudaarithm.hpp header must be compiled as C++
//#endif
//
//#include "opencv2/core/cuda.hpp"

/**
  @addtogroup cuda
  @{
    @defgroup cudaarithm Operations on Matrices
    @{
        @defgroup cudaarithm_core Core Operations on Matrices
        @defgroup cudaarithm_elem Per-element Operations
        @defgroup cudaarithm_reduce Matrix Reductions
        @defgroup cudaarithm_arithm Arithm Operations on Matrices
    @}
  @}
 */

//namespace cv {
export namespace cudaarithm {

    //! @addtogroup cudaarithm
    //! @{

    //! @addtogroup cudaarithm_elem
    //! @{

    /** @brief Computes a matrix-matrix or matrix-scalar sum.
    
    @param src1 First source matrix or scalar.
    @param src2 Second source matrix or scalar. Matrix should have the same size and type as src1 .
    @param dst Destination matrix that has the same size and number of channels as the input array(s).
    The depth is defined by dtype or src1 depth.
    @param mask Optional operation mask, 8-bit single channel array, that specifies elements of the
    destination array to be changed.
    @param dtype Optional depth of the output array.
    @param stream Stream for the asynchronous version.
    
    @sa add
     */

    interface Iadd {
        (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray, mask?: _st.InputArray /*= noArray()*/, dtype?: _st.int /*= -1*/, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var add: Iadd = alvision_module.cuda.add;

    //CV_EXPORTS void add(InputArray src1, InputArray src2, OutputArray dst, InputArray mask = noArray(), int dtype = -1, Stream& stream = Stream::Null());

    /** @brief Computes a matrix-matrix or matrix-scalar difference.
    
    @param src1 First source matrix or scalar.
    @param src2 Second source matrix or scalar. Matrix should have the same size and type as src1 .
    @param dst Destination matrix that has the same size and number of channels as the input array(s).
    The depth is defined by dtype or src1 depth.
    @param mask Optional operation mask, 8-bit single channel array, that specifies elements of the
    destination array to be changed.
    @param dtype Optional depth of the output array.
    @param stream Stream for the asynchronous version.
    
    @sa subtract
     */

    interface Isubtract {
        (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray, mask?: _st.InputArray /*= noArray()*/, dtype?: _st.int /*= -1*/, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
    }

    export var subtract: Isubtract = alvision_module.cuda.subtract;
    //CV_EXPORTS void subtract(InputArray src1, InputArray src2, OutputArray dst, InputArray mask = noArray(), int dtype = -1, Stream& stream = Stream::Null());

    /** @brief Computes a matrix-matrix or matrix-scalar per-element product.
    
    @param src1 First source matrix or scalar.
    @param src2 Second source matrix or scalar.
    @param dst Destination matrix that has the same size and number of channels as the input array(s).
    The depth is defined by dtype or src1 depth.
    @param scale Optional scale factor.
    @param dtype Optional depth of the output array.
    @param stream Stream for the asynchronous version.
    
    @sa multiply
     */

    interface Imultiply {
        (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray, scale?: _st.double /*= 1*/, dtype?: _st.int /*= -1*/, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var multiply: Imultiply = alvision_module.cuda.multiply;
    //CV_EXPORTS void multiply(InputArray src1, InputArray src2, OutputArray dst, double scale = 1, int dtype = -1, Stream& stream = Stream::Null());

    /** @brief Computes a matrix-matrix or matrix-scalar division.
    
    @param src1 First source matrix or a scalar.
    @param src2 Second source matrix or scalar.
    @param dst Destination matrix that has the same size and number of channels as the input array(s).
    The depth is defined by dtype or src1 depth.
    @param scale Optional scale factor.
    @param dtype Optional depth of the output array.
    @param stream Stream for the asynchronous version.
    
    This function, in contrast to divide, uses a round-down rounding mode.
    
    @sa divide
     */

    interface Idivide {
        (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray, scale?: _st.double /* = 1*/, dtype?: _st.int /*= -1*/, stream?: _cuda.cuda.Stream/*  = Stream::Null()*/): void;
    }
    export var divide: Idivide = alvision_module.cuda.divide;
    //CV_EXPORTS void divide(InputArray src1, InputArray src2, OutputArray dst, double scale = 1, int dtype = -1, Stream& stream = Stream::Null());

    /** @brief Computes per-element absolute difference of two matrices (or of a matrix and scalar).
    
    @param src1 First source matrix or scalar.
    @param src2 Second source matrix or scalar.
    @param dst Destination matrix that has the same size and type as the input array(s).
    @param stream Stream for the asynchronous version.
    
    @sa absdiff
     */
    interface Iabsdiff {
        (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }
    export var absdiff: Iabsdiff = alvision_module.cuda.absdiff;

    //CV_EXPORTS void absdiff(InputArray src1, InputArray src2, OutputArray dst, Stream& stream = Stream::Null());

    /** @brief Computes an absolute value of each matrix element.
    
    @param src Source matrix.
    @param dst Destination matrix with the same size and type as src .
    @param stream Stream for the asynchronous version.
    
    @sa abs
     */

    interface Iabs {
        (src: _st.InputArray, dst: _st.OutputArray, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
    }

    export var abs: Iabs = alvision_module.cuda.abs;
    //CV_EXPORTS void abs(InputArray src, OutputArray dst, Stream& stream = Stream::Null());

    /** @brief Computes a square value of each matrix element.
    
    @param src Source matrix.
    @param dst Destination matrix with the same size and type as src .
    @param stream Stream for the asynchronous version.
     */

    interface Isqr {
        (src: _st.InputArray, dst: _st.OutputArray, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
    }

    export var sqr: Isqr = alvision_module.sqr;
    //CV_EXPORTS void sqr(InputArray src, OutputArray dst, Stream& stream = Stream::Null());

    /** @brief Computes a square root of each matrix element.
    
    @param src Source matrix.
    @param dst Destination matrix with the same size and type as src .
    @param stream Stream for the asynchronous version.
    
    @sa sqrt
     */

    interface Isqrt {
        (src: _st.InputArray, dst: _st.OutputArray, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
    }

    export var sqrt: Isqrt = alvision_module.cuda.sqrt;
    //CV_EXPORTS void sqrt(InputArray src, OutputArray dst, Stream& stream = Stream::Null());

    /** @brief Computes an exponent of each matrix element.
    
    @param src Source matrix.
    @param dst Destination matrix with the same size and type as src .
    @param stream Stream for the asynchronous version.
    
    @sa exp
     */
    interface Iexp {
        (src: _st.InputArray, dst: _st.OutputArray, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
    }

    export var exp: Iexp = alvision_module.cuda.exp;

    //CV_EXPORTS void exp(InputArray src, OutputArray dst, Stream& stream = Stream::Null());

    /** @brief Computes a natural logarithm of absolute value of each matrix element.
    
    @param src Source matrix.
    @param dst Destination matrix with the same size and type as src .
    @param stream Stream for the asynchronous version.
    
    @sa log
     */
    interface Ilog {
        (src: _st.InputArray, dst: _st.OutputArray, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }
    export var log: Ilog = alvision_module.cuda.log;

    //CV_EXPORTS void log(InputArray src, OutputArray dst, Stream& stream = Stream::Null());

    /** @brief Raises every matrix element to a power.
    
    @param src Source matrix.
    @param power Exponent of power.
    @param dst Destination matrix with the same size and type as src .
    @param stream Stream for the asynchronous version.
    
    The function pow raises every element of the input matrix to power :
    
    \f[\texttt{dst} (I) =  \fork{\texttt{src}(I)^power}{if \texttt{power} is integer}{|\texttt{src}(I)|^power}{otherwise}\f]
    
    @sa pow
     */

    interface Ipow {
        (src: _st.InputArray, power: _st.double, dst: _st.OutputArray, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
    }
    export var pow: Ipow = alvision_module.cuda.pow;
    //CV_EXPORTS void pow(InputArray src, double power, OutputArray dst, Stream& stream = Stream::Null());

    /** @brief Compares elements of two matrices (or of a matrix and scalar).
    
    @param src1 First source matrix or scalar.
    @param src2 Second source matrix or scalar.
    @param dst Destination matrix that has the same size and type as the input array(s).
    @param cmpop Flag specifying the relation between the elements to be checked:
    -   **CMP_EQ:** a(.) == b(.)
    -   **CMP_GT:** a(.) \> b(.)
    -   **CMP_GE:** a(.) \>= b(.)
    -   **CMP_LT:** a(.) \< b(.)
    -   **CMP_LE:** a(.) \<= b(.)
    -   **CMP_NE:** a(.) != b(.)
    @param stream Stream for the asynchronous version.
    
    @sa compare
     */
    interface Icompare {
        (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray, cmpop: _st.int, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
    }
    export var compare: Icompare = alvision_module.cuda.compare;

    //CV_EXPORTS void compare(InputArray src1, InputArray src2, OutputArray dst, int cmpop, Stream& stream = Stream::Null());

    /** @brief Performs a per-element bitwise inversion.
    
    @param src Source matrix.
    @param dst Destination matrix with the same size and type as src .
    @param mask Optional operation mask. 8-bit single channel image.
    @param stream Stream for the asynchronous version.
     */
    interface Ibitwise_not {
        (src: _st.InputArray, dst: _st.OutputArray, mask?: _st.InputArray /*  = noArray()*/, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }
    export var bitwise_not: Ibitwise_not = alvision_module.cuda.bitwise_not;

    //CV_EXPORTS void bitwise_not(InputArray src, OutputArray dst, InputArray mask = noArray(), Stream& stream = Stream::Null());

    /** @brief Performs a per-element bitwise disjunction of two matrices (or of matrix and scalar).
    
    @param src1 First source matrix or scalar.
    @param src2 Second source matrix or scalar.
    @param dst Destination matrix that has the same size and type as the input array(s).
    @param mask Optional operation mask. 8-bit single channel image.
    @param stream Stream for the asynchronous version.
     */

    interface Ibitwise_or {
        (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray, mask?: _st.InputArray /*= noArray()*/, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var bitwise_or: Ibitwise_or = alvision_module.cuda.bitwise_or;
    //CV_EXPORTS void bitwise_or(InputArray src1, InputArray src2, OutputArray dst, InputArray mask = noArray(), Stream& stream = Stream::Null());

    /** @brief Performs a per-element bitwise conjunction of two matrices (or of matrix and scalar).
    
    @param src1 First source matrix or scalar.
    @param src2 Second source matrix or scalar.
    @param dst Destination matrix that has the same size and type as the input array(s).
    @param mask Optional operation mask. 8-bit single channel image.
    @param stream Stream for the asynchronous version.
     */
    interface Ibitwise_and {
        (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray, mask?: _st.InputArray /*= noArray()*/, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var bitwise_and: Ibitwise_and = alvision_module.cuda.bitwise_and;

    //CV_EXPORTS void bitwise_and(InputArray src1, InputArray src2, OutputArray dst, InputArray mask = noArray(), Stream& stream = Stream::Null());

    /** @brief Performs a per-element bitwise exclusive or operation of two matrices (or of matrix and scalar).
    
    @param src1 First source matrix or scalar.
    @param src2 Second source matrix or scalar.
    @param dst Destination matrix that has the same size and type as the input array(s).
    @param mask Optional operation mask. 8-bit single channel image.
    @param stream Stream for the asynchronous version.
     */

    interface Ibitwise_xor {
        (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray, mask?: _st.InputArray /*= noArray()*/, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }
    export var bitwise_xor: Ibitwise_xor = alvision_module.cuda.bitwise_xor;
    //CV_EXPORTS void bitwise_xor(InputArray src1, InputArray src2, OutputArray dst, InputArray mask = noArray(), Stream & stream = Stream::Null());

    /** @brief Performs pixel by pixel right shift of an image by a constant value.
    
    @param src Source matrix. Supports 1, 3 and 4 channels images with integers elements.
    @param val Constant values, one per channel.
    @param dst Destination matrix with the same size and type as src .
    @param stream Stream for the asynchronous version.
     */

    interface Irshift {
        (src: _st.InputArray, val: _types.Scalar_<_st.int>, dst: _st.OutputArray, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var rshift: Irshift = alvision_module.cuda.rshift;

    //CV_EXPORTS void rshift(InputArray src, Scalar_ < int > val, OutputArray dst, Stream & stream = Stream::Null());

    /** @brief Performs pixel by pixel right left of an image by a constant value.
    
    @param src Source matrix. Supports 1, 3 and 4 channels images with CV_8U , CV_16U or CV_32S
    depth.
    @param val Constant values, one per channel.
    @param dst Destination matrix with the same size and type as src .
    @param stream Stream for the asynchronous version.
     */
    interface Ilshift {
        (src: _st.InputArray, val: _types.Scalar_<_st.int>, dst: _st.OutputArray, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var lshift: Ilshift = alvision_module.cuda.lshift;
    //CV_EXPORTS void lshift(InputArray src, Scalar_ < int > val, OutputArray dst, Stream & stream = Stream::Null());

    /** @brief Computes the per-element minimum of two matrices (or a matrix and a scalar).
    
    @param src1 First source matrix or scalar.
    @param src2 Second source matrix or scalar.
    @param dst Destination matrix that has the same size and type as the input array(s).
    @param stream Stream for the asynchronous version.
    
    @sa min
     */

    interface Imin {
        (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var min: Imin = alvision_module.cuda.min;

    //CV_EXPORTS void min(InputArray src1, InputArray src2, OutputArray dst, Stream & stream = Stream::Null());

    /** @brief Computes the per-element maximum of two matrices (or a matrix and a scalar).
    
    @param src1 First source matrix or scalar.
    @param src2 Second source matrix or scalar.
    @param dst Destination matrix that has the same size and type as the input array(s).
    @param stream Stream for the asynchronous version.
    
    @sa max
     */

    interface Imax {
        (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var max: Imax = alvision_module.cuda.max;

    //CV_EXPORTS void max(InputArray src1, InputArray src2, OutputArray dst, Stream & stream = Stream::Null());

    /** @brief Computes the weighted sum of two arrays.
    
    @param src1 First source array.
    @param alpha Weight for the first array elements.
    @param src2 Second source array of the same size and channel number as src1 .
    @param beta Weight for the second array elements.
    @param dst Destination array that has the same size and number of channels as the input arrays.
    @param gamma Scalar added to each sum.
    @param dtype Optional depth of the destination array. When both input arrays have the same depth,
    dtype can be set to -1, which will be equivalent to src1.depth().
    @param stream Stream for the asynchronous version.
    
    The function addWeighted calculates the weighted sum of two arrays as follows:
    
    \f[\texttt{dst} (I)= \texttt{saturate} ( \texttt{src1} (I)* \texttt{alpha} +  \texttt{src2} (I)* \texttt{beta} +  \texttt{gamma} )\f]
    
    where I is a multi-dimensional index of array elements. In case of multi-channel arrays, each
    channel is processed independently.
    
    @sa addWeighted
     */

    interface IaddWeighted {
        (src1: _st.InputArray, alpha: _st.double, src2: _st.InputArray, beta: _st.double, gamma: _st.double, dst: _st.OutputArray,
            dtype?: _st.int /*= -1*/, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var addWeighted: IaddWeighted = alvision_module.cuda.addWeighted;
    //    CV_EXPORTS void addWeighted(InputArray src1, double alpha, InputArray src2, double beta, double gamma, OutputArray dst,
    //        int dtype = -1, Stream & stream = Stream::Null());

    //! adds scaled array to another one (dst = alpha*src1 + src2)

    export function scaleAdd(src1: _st.InputArray, alpha: _st.double, src2: _st.InputArray, dst: _st.OutputArray, stream?: _cuda.cuda.Stream /*= Stream::Null()*/) {
        addWeighted(src1, alpha, src2, 1.0, 0.0, dst, -1, stream);
    } 
    //static inline void scaleAdd(InputArray src1, double alpha, InputArray src2, OutputArray dst, Stream & stream = Stream::Null())
    //    {
    //        addWeighted(src1, alpha, src2, 1.0, 0.0, dst, -1, stream);
    //    }

    /** @brief Applies a fixed-level threshold to each array element.
    
    @param src Source array (single-channel).
    @param dst Destination array with the same size and type as src .
    @param thresh Threshold value.
    @param maxval Maximum value to use with THRESH_BINARY and THRESH_BINARY_INV threshold types.
    @param type Threshold type. For details, see threshold . The THRESH_OTSU and THRESH_TRIANGLE
    threshold types are not supported.
    @param stream Stream for the asynchronous version.
    
    @sa threshold
     */

    interface Ithreshold {
        (src: _st.InputArray, dst: _st.OutputArray, thresh: _st.double, maxval: _st.double, type: _st.int, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): _st.double;
    }

    export var threshold: Ithreshold = alvision_module.cuda.threshold;
    //CV_EXPORTS double threshold(InputArray src, OutputArray dst, double thresh, double maxval, int type, Stream & stream = Stream::Null());

    /** @brief Computes magnitudes of complex matrix elements.
    
    @param xy Source complex matrix in the interleaved format ( CV_32FC2 ).
    @param magnitude Destination matrix of float magnitudes ( CV_32FC1 ).
    @param stream Stream for the asynchronous version.
    
    @sa magnitude
     */

    interface Imagnitude {
        (xy: _st.InputArray, magnitude: _st.OutputArray, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }
    export var magnitude: Imagnitude = alvision_module.cuda.magnitude;

    //CV_EXPORTS void magnitude(InputArray xy, OutputArray magnitude, Stream & stream = Stream::Null());

    /** @brief Computes squared magnitudes of complex matrix elements.
    
    @param xy Source complex matrix in the interleaved format ( CV_32FC2 ).
    @param magnitude Destination matrix of float magnitude squares ( CV_32FC1 ).
    @param stream Stream for the asynchronous version.
     */

    interface ImagnitudeSqr {
        (xy: _st.InputArray, magnitude: _st.OutputArray, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var magnitudeSqr: ImagnitudeSqr = alvision_module.cuda.magnitudeSqr;
    //CV_EXPORTS void magnitudeSqr(InputArray xy, OutputArray magnitude, Stream & stream = Stream::Null());

    /** @overload
     computes magnitude of each (x(i), y(i)) vector
     supports only floating-point source
    @param x Source matrix containing real components ( CV_32FC1 ).
    @param y Source matrix containing imaginary components ( CV_32FC1 ).
    @param magnitude Destination matrix of float magnitudes ( CV_32FC1 ).
    @param stream Stream for the asynchronous version.
     */

    interface Imagnitude {
        (x: _st.InputArray, y: _st.InputArray, magnitude: _st.OutputArray, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }
    export var magnitude: Imagnitude = alvision_module.cuda.magnitude;

    //CV_EXPORTS void magnitude(InputArray x, InputArray y, OutputArray magnitude, Stream & stream = Stream::Null());

    /** @overload
     computes squared magnitude of each (x(i), y(i)) vector
     supports only floating-point source
    @param x Source matrix containing real components ( CV_32FC1 ).
    @param y Source matrix containing imaginary components ( CV_32FC1 ).
    @param magnitude Destination matrix of float magnitude squares ( CV_32FC1 ).
    @param stream Stream for the asynchronous version.
    */

    interface ImagnitudeSqr {
        (x: _st.InputArray, y: _st.InputArray, magnitude: _st.OutputArray, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var magnitudeSqr: ImagnitudeSqr = alvision_module.cuda.magnitudeSqr;

    //CV_EXPORTS void magnitudeSqr(InputArray x, InputArray y, OutputArray magnitude, Stream & stream = Stream::Null());

    /** @brief Computes polar angles of complex matrix elements.
    
    @param x Source matrix containing real components ( CV_32FC1 ).
    @param y Source matrix containing imaginary components ( CV_32FC1 ).
    @param angle Destination matrix of angles ( CV_32FC1 ).
    @param angleInDegrees Flag for angles that must be evaluated in degrees.
    @param stream Stream for the asynchronous version.
    
    @sa phase
     */

    interface Iphase {
        (x: _st.InputArray, y: _st.InputArray, angle: _st.OutputArray, angleInDegrees?: boolean /*= false*/, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var phase: Iphase = alvision_module.cuda.phase;
    //CV_EXPORTS void phase(InputArray x, InputArray y, OutputArray angle, bool angleInDegrees = false, Stream & stream = Stream::Null());

    /** @brief Converts Cartesian coordinates into polar.
    
    @param x Source matrix containing real components ( CV_32FC1 ).
    @param y Source matrix containing imaginary components ( CV_32FC1 ).
    @param magnitude Destination matrix of float magnitudes ( CV_32FC1 ).
    @param angle Destination matrix of angles ( CV_32FC1 ).
    @param angleInDegrees Flag for angles that must be evaluated in degrees.
    @param stream Stream for the asynchronous version.
    
    @sa cartToPolar
     */

    interface IcartToPolar {
        (x: _st.InputArray, y: _st.InputArray, magnitude: _st.OutputArray, angle: _st.OutputArray, angleInDegrees?: boolean /*= false*/, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var cartToPolar: IcartToPolar = alvision_module.cuda.cartToPolar;

    //CV_EXPORTS void cartToPolar(InputArray x, InputArray y, OutputArray magnitude, OutputArray angle, bool angleInDegrees = false, Stream & stream = Stream::Null());

    /** @brief Converts polar coordinates into Cartesian.
    
    @param magnitude Source matrix containing magnitudes ( CV_32FC1 ).
    @param angle Source matrix containing angles ( CV_32FC1 ).
    @param x Destination matrix of real components ( CV_32FC1 ).
    @param y Destination matrix of imaginary components ( CV_32FC1 ).
    @param angleInDegrees Flag that indicates angles in degrees.
    @param stream Stream for the asynchronous version.
     */

    interface IpolarToCart {
        (magnitude: _st.InputArray, angle: _st.InputArray, x: _st.OutputArray, y: _st.OutputArray, angleInDegrees?: boolean /*= false*/, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }
    export var polarToCart: IpolarToCart = alvision_module.cuda.polarToCart;

    //CV_EXPORTS void polarToCart(InputArray magnitude, InputArray angle, OutputArray x, OutputArray y, bool angleInDegrees = false, Stream & stream = Stream::Null());

    //! @} cudaarithm_elem

    //! @addtogroup cudaarithm_core
    //! @{

    /** @brief Makes a multi-channel matrix out of several single-channel matrices.
    
    @param src Array/vector of source matrices.
    @param n Number of source matrices.
    @param dst Destination matrix.
    @param stream Stream for the asynchronous version.
    
    @sa merge
     */

    interface Imerge {
        (src: Array<_cuda.cuda.GpuMat>, n: _st.size_t, dst: _st.OutputArray, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }
    export var merge: Imerge = alvision_module.cuda.merge;

    //CV_EXPORTS void merge(const GpuMat* src, size_t n, OutputArray dst, Stream& stream = Stream::Null());
    /** @overload */

    interface Imerge {
        (src: Array<_cuda.cuda.GpuMat>, dst: _st.OutputArray, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var merge: Imerge = alvision_module.cuda.merge;

    //CV_EXPORTS void merge(const std::vector<GpuMat>& src, OutputArray dst, Stream& stream = Stream::Null());

    /** @brief Copies each plane of a multi-channel matrix into an array.
    
    @param src Source matrix.
    @param dst Destination array/vector of single-channel matrices.
    @param stream Stream for the asynchronous version.
    
    @sa split
     */

    interface Isplit {
        (src: _st.InputArray, dst: Array<_cuda.cuda.GpuMat>, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }
    export var split: Isplit = alvision_module.cuda.split;

    //CV_EXPORTS void split(InputArray src, GpuMat * dst, Stream & stream = Stream::Null());
    /** @overload */
    interface Isplit {
        (src: _st.InputArray, dst: Array<_cuda.cuda.GpuMat>, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var split: Isplit = alvision_module.cuda.split;

    //CV_EXPORTS void split(InputArray src, std::vector<GpuMat>& dst, Stream & stream = Stream::Null());

    /** @brief Transposes a matrix.
    
    @param src1 Source matrix. 1-, 4-, 8-byte element sizes are supported for now.
    @param dst Destination matrix.
    @param stream Stream for the asynchronous version.
    
    @sa transpose
     */

    interface Itranspose {
        (src1: _st.InputArray, dst: _st.OutputArray, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }
    export var transpose: Itranspose = alvision_module.cuda.transpose;

    //CV_EXPORTS void transpose(InputArray src1, OutputArray dst, Stream & stream = Stream::Null());

    /** @brief Flips a 2D matrix around vertical, horizontal, or both axes.
    
    @param src Source matrix. Supports 1, 3 and 4 channels images with CV_8U, CV_16U, CV_32S or
    CV_32F depth.
    @param dst Destination matrix.
    @param flipCode Flip mode for the source:
    -   0 Flips around x-axis.
    -   \> 0 Flips around y-axis.
    -   \< 0 Flips around both axes.
    @param stream Stream for the asynchronous version.
    
    @sa flip
     */

    interface Iflip {
        (src: _st.InputArray, dst: _st.OutputArray, flipCode: _st.int, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var flip: Iflip = alvision_module.cuda.flip;
    //CV_EXPORTS void flip(InputArray src, OutputArray dst, int flipCode, Stream & stream = Stream::Null());

    /** @brief Base class for transform using lookup table.
     */
    interface LookUpTable extends _core.Algorithm {
        //public:
        /** @brief Transforms the source matrix into the destination matrix using the given look-up table:
        dst(I) = lut(src(I)) .
    
        @param src Source matrix. CV_8UC1 and CV_8UC3 matrices are supported for now.
        @param dst Destination matrix.
        @param stream Stream for the asynchronous version.
         */
        transform(src: _st.InputArray, dst: _st.OutputArray, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    };

    /** @brief Creates implementation for cuda::LookUpTable .
    
    @param lut Look-up table of 256 elements. It is a continuous CV_8U matrix.
     */

    interface IcreateLookUpTable {
        (lut: _st.InputArray): LookUpTable;
    }

    export var createLookUpTable: IcreateLookUpTable = alvision_module.cuda.createLookUpTable;

    //CV_EXPORTS Ptr< LookUpTable > createLookUpTable(InputArray lut);

    /** @brief Forms a border around an image.
    
    @param src Source image. CV_8UC1 , CV_8UC4 , CV_32SC1 , and CV_32FC1 types are supported.
    @param dst Destination image with the same type as src. The size is
    Size(src.cols+left+right, src.rows+top+bottom) .
    @param top
    @param bottom
    @param left
    @param right Number of pixels in each direction from the source image rectangle to extrapolate.
    For example: top=1, bottom=1, left=1, right=1 mean that 1 pixel-wide border needs to be built.
    @param borderType Border type. See borderInterpolate for details. BORDER_REFLECT101 ,
    BORDER_REPLICATE , BORDER_CONSTANT , BORDER_REFLECT and BORDER_WRAP are supported for now.
    @param value Border value.
    @param stream Stream for the asynchronous version.
     */

    interface IcopyMakeBorder {
        (src: _st.InputArray, dst: _st.OutputArray, top: _st.int, bottom: _st.int, left: _st.int, right: _st.int, borderType: _st.int,
            value?: _types.Scalar /*= Scalar()*/, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var copyMakeBorder: IcopyMakeBorder = alvision_module.cuda.copyMakeBorder;

    //CV_EXPORTS void copyMakeBorder(InputArray src, OutputArray dst, int top, int bottom, int left, int right, int borderType,
    //    Scalar value = Scalar(), Stream & stream = Stream::Null());

    //! @} cudaarithm_core

    //! @addtogroup cudaarithm_reduce
    //! @{

    /** @brief Returns the norm of a matrix (or difference of two matrices).
    
    @param src1 Source matrix. Any matrices except 64F are supported.
    @param normType Norm type. NORM_L1 , NORM_L2 , and NORM_INF are supported for now.
    @param mask optional operation mask; it must have the same size as src1 and CV_8UC1 type.
    
    @sa norm
     */

    interface Inorm {
        (src1: _st.InputArray, normType: _st.int, mask?: _st.InputArray /*= noArray()*/): _st.double;
    }

    export var norm: Inorm = alvision_module.cuda.norm;

    //CV_EXPORTS double norm(InputArray src1, int normType, InputArray mask = noArray());
    /** @overload */

    interface IcalcNorm {
        (src: _st.InputArray, dst: _st.OutputArray, normType: _st.int, mask?: _st.InputArray /*= noArray()*/, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var calcNorm: IcalcNorm = alvision_module.cuda.calcNorm;
    //CV_EXPORTS void calcNorm(InputArray src, OutputArray dst, int normType, InputArray mask = noArray(), Stream & stream = Stream::Null());

    /** @brief Returns the difference of two matrices.
    
    @param src1 Source matrix. Any matrices except 64F are supported.
    @param src2 Second source matrix (if any) with the same size and type as src1.
    @param normType Norm type. NORM_L1 , NORM_L2 , and NORM_INF are supported for now.
    
    @sa norm
     */

    interface Inorm {
        (src1: _st.InputArray, src2: _st.InputArray, normType?: _st.int /*= NORM_L2*/): _st.double;
    }

    export var norm: Inorm = alvision_module.cuda.norm;

    //CV_EXPORTS double norm(InputArray src1, InputArray src2, int normType= NORM_L2);
    /** @overload */

    interface IcalcNormDiff {
        (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray, normType?: _st.int /*= NORM_L2*/, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var calcNormDiff: IcalcNormDiff = alvision_module.cuda.calcNormDiff;

    //CV_EXPORTS void calcNormDiff(InputArray src1, InputArray src2, OutputArray dst, int normType= NORM_L2, Stream & stream = Stream::Null());

    /** @brief Returns the sum of matrix elements.
    
    @param src Source image of any depth except for CV_64F .
    @param mask optional operation mask; it must have the same size as src1 and CV_8UC1 type.
    
    @sa sum
     */

    interface Isum {
        (src: _st.InputArray, mask?: _st.InputArray /*= noArray()*/): _types.Scalar;
    }

    export var sum: Isum = alvision_module.cuda.sum;

    //CV_EXPORTS Scalar sum(InputArray src, InputArray mask = noArray());
    /** @overload */

    interface IcalcSum {
        (src: _st.InputArray, dst: _st.OutputArray, mask?: _st.InputArray /* = noArray()*/, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
    }

    export var calcSum: IcalcSum = alvision_module.cuda.calcSum;

    //CV_EXPORTS void calcSum(InputArray src, OutputArray dst, InputArray mask = noArray(), Stream & stream = Stream::Null());

    /** @brief Returns the sum of absolute values for matrix elements.
    
    @param src Source image of any depth except for CV_64F .
    @param mask optional operation mask; it must have the same size as src1 and CV_8UC1 type.
     */

    interface IabsSum {
        (src: _st.InputArray, mask?: _st.InputArray /*= noArray()*/): _types.Scalar;
    }

    export var absSum: IabsSum = alvision_module.cuda.absSum;

    //CV_EXPORTS Scalar absSum(InputArray src, InputArray mask = noArray());
    /** @overload */

    interface IcalcAbsSum {
        (src: _st.InputArray, dst: _st.OutputArray, mask?: _st.InputArray /*= noArray()*/, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
    }

    export var calcAbsSum: IcalcAbsSum = alvision_module.cuda.calcAbsSum;

    //CV_EXPORTS void calcAbsSum(InputArray src, OutputArray dst, InputArray mask = noArray(), Stream & stream = Stream::Null());

    /** @brief Returns the squared sum of matrix elements.
    
    @param src Source image of any depth except for CV_64F .
    @param mask optional operation mask; it must have the same size as src1 and CV_8UC1 type.
     */

    interface IsqrSum {
        (src: _st.InputArray, mask?: _st.InputArray /*= noArray()*/): _types.Scalar;
    }

    export var sqrSum: IsqrSum = alvision_module.cuda.sqrSum;

    //CV_EXPORTS Scalar sqrSum(InputArray src, InputArray mask = noArray());
    /** @overload */

    interface IcalcSqrSum {
        (src: _st.InputArray, dst: _st.OutputArray, mask?: _st.InputArray /* = noArray()*/, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
    }

    export var calcSqrSum: IcalcSqrSum = alvision_module.cuda.calcSqrSum;

    //CV_EXPORTS void calcSqrSum(InputArray src, OutputArray dst, InputArray mask = noArray(), Stream & stream = Stream::Null());

    /** @brief Finds global minimum and maximum matrix elements and returns their values.
    
    @param src Single-channel source image.
    @param minVal Pointer to the returned minimum value. Use NULL if not required.
    @param maxVal Pointer to the returned maximum value. Use NULL if not required.
    @param mask Optional mask to select a sub-matrix.
    
    The function does not work with CV_64F images on GPUs with the compute capability \< 1.3.
    
    @sa minMaxLoc
     */

    interface IminMax {
        (src: _st.InputArray, cb: (minVal: _st.double, maxVal: _st.double) => void, mask?: _st.InputArray /* = noArray()*/): void;
    }

    export var minMax: IminMax = alvision_module.cuda.minMax;

    //CV_EXPORTS void minMax(InputArray src, double * minVal, double * maxVal, InputArray mask = noArray());
    /** @overload */
    interface IfindMinMax {
        (src: _st.InputArray, dst: _st.OutputArray, mask?: _st.InputArray /* = noArray()*/, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
    }
    export var findMinMax: IfindMinMax = alvision_module.cuda.findMinMax;

    //CV_EXPORTS void findMinMax(InputArray src, OutputArray dst, InputArray mask = noArray(), Stream & stream = Stream::Null());

    /** @brief Finds global minimum and maximum matrix elements and returns their values with locations.
    
    @param src Single-channel source image.
    @param minVal Pointer to the returned minimum value. Use NULL if not required.
    @param maxVal Pointer to the returned maximum value. Use NULL if not required.
    @param minLoc Pointer to the returned minimum location. Use NULL if not required.
    @param maxLoc Pointer to the returned maximum location. Use NULL if not required.
    @param mask Optional mask to select a sub-matrix.
    
    The function does not work with CV_64F images on GPU with the compute capability \< 1.3.
    
    @sa minMaxLoc
     */

    interface IminMaxLoc {
        (src: _st.InputArray, cb: (minVal: _st.double, maxVal: _st.double, minLoc: _types.Point, maxLoc: _types.Point) => void,
            mask?: _st.InputArray /*= noArray()*/): void;
    }

    export var minMaxLoc: IminMaxLoc = alvision_module.cuda.minMaxLoc;

    //CV_EXPORTS void minMaxLoc(InputArray src, double * minVal, double * maxVal, Point * minLoc, Point * maxLoc,
    //    InputArray mask = noArray());
    /** @overload */

    interface IfindMinMaxLoc {
        (src: _st.InputArray, minMaxVals: _st.OutputArray, loc: _st.OutputArray,
            mask?: _st.InputArray /*= noArray()*/, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var findMinMaxLoc: IfindMinMaxLoc = alvision_module.cuda.findMinMaxLoc;

    //CV_EXPORTS void findMinMaxLoc(InputArray src, OutputArray minMaxVals, OutputArray loc,
    //    InputArray mask = noArray(), Stream & stream = Stream::Null());

    /** @brief Counts non-zero matrix elements.
    
    @param src Single-channel source image.
    
    The function does not work with CV_64F images on GPUs with the compute capability \< 1.3.
    
    @sa countNonZero
     */

    interface IcountNonZero {
        (src: _st.InputArray): _st.int;
    }

    export var countNonZero: IcountNonZero = alvision_module.cuda.countNonZero;

    //CV_EXPORTS int countNonZero(InputArray src);
    /** @overload */

    interface IcountNonZero {
        (src: _st.InputArray, dst: _st.OutputArray, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
    }

    export var countNonZero: IcountNonZero = alvision_module.cuda.countNonZero;

    //CV_EXPORTS void countNonZero(InputArray src, OutputArray dst, Stream & stream = Stream::Null());

    /** @brief Reduces a matrix to a vector.
    
    @param mtx Source 2D matrix.
    @param vec Destination vector. Its size and type is defined by dim and dtype parameters.
    @param dim Dimension index along which the matrix is reduced. 0 means that the matrix is reduced
    to a single row. 1 means that the matrix is reduced to a single column.
    @param reduceOp Reduction operation that could be one of the following:
    -   **CV_REDUCE_SUM** The output is the sum of all rows/columns of the matrix.
    -   **CV_REDUCE_AVG** The output is the mean vector of all rows/columns of the matrix.
    -   **CV_REDUCE_MAX** The output is the maximum (column/row-wise) of all rows/columns of the
    matrix.
    -   **CV_REDUCE_MIN** The output is the minimum (column/row-wise) of all rows/columns of the
    matrix.
    @param dtype When it is negative, the destination vector will have the same type as the source
    matrix. Otherwise, its type will be CV_MAKE_TYPE(CV_MAT_DEPTH(dtype), mtx.channels()) .
    @param stream Stream for the asynchronous version.
    
    The function reduce reduces the matrix to a vector by treating the matrix rows/columns as a set of
    1D vectors and performing the specified operation on the vectors until a single row/column is
    obtained. For example, the function can be used to compute horizontal and vertical projections of a
    raster image. In case of CV_REDUCE_SUM and CV_REDUCE_AVG , the output may have a larger element
    bit-depth to preserve accuracy. And multi-channel arrays are also supported in these two reduction
    modes.
    
    @sa reduce
     */

    interface Ireduce {
        (mtx: _st.InputArray, vec: _st.OutputArray, dim: _st.int, reduceOp: _st.int, dtype?: _st.int /*= -1*/, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var reduce: Ireduce = alvision_module.cuda.reduce;

    //CV_EXPORTS void reduce(InputArray mtx, OutputArray vec, int dim, int reduceOp, int dtype = -1, Stream & stream = Stream::Null());

    /** @brief Computes a mean value and a standard deviation of matrix elements.
    
    @param mtx Source matrix. CV_8UC1 matrices are supported for now.
    @param mean Mean value.
    @param stddev Standard deviation value.
    
    @sa meanStdDev
     */

    interface ImeanStdDev {
        (mtx: _st.InputArray, mean: _types.Scalar, stddev: _types.Scalar): void;
    }

    export var meanStdDev: ImeanStdDev = alvision_module.cuda.meanStdDev;

    //CV_EXPORTS void meanStdDev(InputArray mtx, Scalar & mean, Scalar & stddev);
    /** @overload */

    interface ImeanStdDev {
        (mtx: _st.InputArray, dst: _st.OutputArray, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var meanStdDev: ImeanStdDev = alvision_module.cuda.meanStdDev;

    //CV_EXPORTS void meanStdDev(InputArray mtx, OutputArray dst, Stream & stream = Stream::Null());

    /** @brief Computes a standard deviation of integral images.
    
    @param src Source image. Only the CV_32SC1 type is supported.
    @param sqr Squared source image. Only the CV_32FC1 type is supported.
    @param dst Destination image with the same type and size as src .
    @param rect Rectangular window.
    @param stream Stream for the asynchronous version.
     */

    interface IrectStdDev {
        (src: _st.InputArray, sqr: _st.InputArray, dst: _st.OutputArray, rect: _types.Rect, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var rectStdDev: IrectStdDev = alvision_module.cuda.rectStdDev;

    //CV_EXPORTS void rectStdDev(InputArray src, InputArray sqr, OutputArray dst, Rect rect, Stream & stream = Stream::Null());

    /** @brief Normalizes the norm or value range of an array.
    
    @param src Input array.
    @param dst Output array of the same size as src .
    @param alpha Norm value to normalize to or the lower range boundary in case of the range
    normalization.
    @param beta Upper range boundary in case of the range normalization; it is not used for the norm
    normalization.
    @param norm_type Normalization type ( NORM_MINMAX , NORM_L2 , NORM_L1 or NORM_INF ).
    @param dtype When negative, the output array has the same type as src; otherwise, it has the same
    number of channels as src and the depth =CV_MAT_DEPTH(dtype).
    @param mask Optional operation mask.
    @param stream Stream for the asynchronous version.
    
    @sa normalize
     */

    interface Inormalize {
        (src: _st.InputArray, dst: _st.OutputArray, alpha: _st.double, beta: _st.double,
            norm_type: _st.int, dtype: _st.int, mask?: _st.InputArray /* = noArray()*/,
            stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var normalize: Inormalize = alvision_module.cuda.normalize;

    //CV_EXPORTS void normalize(InputArray src, OutputArray dst, double alpha, double beta,
    //    int norm_type, int dtype, InputArray mask = noArray(),
    //    Stream & stream = Stream::Null());

    /** @brief Computes an integral image.
    
    @param src Source image. Only CV_8UC1 images are supported for now.
    @param sum Integral image containing 32-bit unsigned integer values packed into CV_32SC1 .
    @param stream Stream for the asynchronous version.
    
    @sa integral
     */

    interface Iintegral {
        (src: _st.InputArray, sum: _st.OutputArray, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var integral: Iintegral = alvision_module.cuda.integral;

    //CV_EXPORTS void integral(InputArray src, OutputArray sum, Stream & stream = Stream::Null());

    /** @brief Computes a squared integral image.
    
    @param src Source image. Only CV_8UC1 images are supported for now.
    @param sqsum Squared integral image containing 64-bit unsigned integer values packed into
    CV_64FC1 .
    @param stream Stream for the asynchronous version.
     */

    interface IsqrIntegral {
        (src: _st.InputArray, sqsum: _st.OutputArray, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var sqrIntegral: IsqrIntegral = alvision_module.cuda.sqrIntegral;

    //CV_EXPORTS void sqrIntegral(InputArray src, OutputArray sqsum, Stream & stream = Stream::Null());

    //! @} cudaarithm_reduce

    //! @addtogroup cudaarithm_arithm
    //! @{

    /** @brief Performs generalized matrix multiplication.
    
    @param src1 First multiplied input matrix that should have CV_32FC1 , CV_64FC1 , CV_32FC2 , or
    CV_64FC2 type.
    @param src2 Second multiplied input matrix of the same type as src1 .
    @param alpha Weight of the matrix product.
    @param src3 Third optional delta matrix added to the matrix product. It should have the same type
    as src1 and src2 .
    @param beta Weight of src3 .
    @param dst Destination matrix. It has the proper size and the same type as input matrices.
    @param flags Operation flags:
    -   **GEMM_1_T** transpose src1
    -   **GEMM_2_T** transpose src2
    -   **GEMM_3_T** transpose src3
    @param stream Stream for the asynchronous version.
    
    The function performs generalized matrix multiplication similar to the gemm functions in BLAS level
    3. For example, gemm(src1, src2, alpha, src3, beta, dst, GEMM_1_T + GEMM_3_T) corresponds to
    
    \f[\texttt{dst} =  \texttt{alpha} \cdot \texttt{src1} ^T  \cdot \texttt{src2} +  \texttt{beta} \cdot \texttt{src3} ^T\f]
    
    @note Transposition operation doesn't support CV_64FC2 input type.
    
    @sa gemm
     */
    interface Igemm {
        (src1: _st.InputArray, src2: _st.InputArray, alpha: _st.double,
            src3: _st.InputArray, beta: _st.double, dst: _st.OutputArray, flags?: _st.int /*= 0*/, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }
    export var gemm: Igemm = alvision_module.cuda.gemm;

    //CV_EXPORTS void gemm(InputArray src1, InputArray src2, double alpha,
    //                     InputArray src3, double beta, OutputArray dst, int flags = 0, Stream& stream = Stream::Null());

    /** @brief Performs a per-element multiplication of two Fourier spectrums.
    
    @param src1 First spectrum.
    @param src2 Second spectrum with the same size and type as a .
    @param dst Destination spectrum.
    @param flags Mock parameter used for CPU/CUDA interfaces similarity.
    @param conjB Optional flag to specify if the second spectrum needs to be conjugated before the
    multiplication.
    @param stream Stream for the asynchronous version.
    
    Only full (not packed) CV_32FC2 complex spectrums in the interleaved format are supported for now.
    
    @sa mulSpectrums
     */
    interface ImulSpectrums {
        (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray, flags: _st.int, conjB?: boolean /*= false*/, stream?: _cuda.cuda.Stream  /*= Stream::Null()*/): void;
    }
    export var mulSpectrums: ImulSpectrums = alvision_module.mulSpectrums;
    //CV_EXPORTS void mulSpectrums(InputArray src1, InputArray src2, OutputArray dst, int flags, bool conjB=false, Stream& stream = Stream::Null());

    /** @brief Performs a per-element multiplication of two Fourier spectrums and scales the result.
    
    @param src1 First spectrum.
    @param src2 Second spectrum with the same size and type as a .
    @param dst Destination spectrum.
    @param flags Mock parameter used for CPU/CUDA interfaces similarity, simply add a `0` value.
    @param scale Scale constant.
    @param conjB Optional flag to specify if the second spectrum needs to be conjugated before the
    multiplication.
    @param stream Stream for the asynchronous version.
    
    Only full (not packed) CV_32FC2 complex spectrums in the interleaved format are supported for now.
    
    @sa mulSpectrums
     */

    interface ImulAndScaleSpectrums {
        (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray, flags: _st.int, scale: _st.float, conjB?: boolean/*= false*/, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var mulAndScaleSpectrums: ImulAndScaleSpectrums = alvision_module.cuda.mulAndScaleSpectrums;

    //CV_EXPORTS void mulAndScaleSpectrums(InputArray src1, InputArray src2, OutputArray dst, int flags, float scale, bool conjB=false, Stream& stream = Stream::Null());

    /** @brief Performs a forward or inverse discrete Fourier transform (1D or 2D) of the floating point matrix.
    
    @param src Source matrix (real or complex).
    @param dst Destination matrix (real or complex).
    @param dft_size Size of a discrete Fourier transform.
    @param flags Optional flags:
    -   **DFT_ROWS** transforms each individual row of the source matrix.
    -   **DFT_SCALE** scales the result: divide it by the number of elements in the transform
    (obtained from dft_size ).
    -   **DFT_INVERSE** inverts DFT. Use for complex-complex cases (real-complex and complex-real
    cases are always forward and inverse, respectively).
    -   **DFT_REAL_OUTPUT** specifies the output as real. The source matrix is the result of
    real-complex transform, so the destination matrix must be real.
    @param stream Stream for the asynchronous version.
    
    Use to handle real matrices ( CV32FC1 ) and complex matrices in the interleaved format ( CV32FC2 ).
    
    The source matrix should be continuous, otherwise reallocation and data copying is performed. The
    function chooses an operation mode depending on the flags, size, and channel count of the source
    matrix:
    
    -   If the source matrix is complex and the output is not specified as real, the destination
    matrix is complex and has the dft_size size and CV_32FC2 type. The destination matrix
    contains a full result of the DFT (forward or inverse).
    -   If the source matrix is complex and the output is specified as real, the function assumes that
    its input is the result of the forward transform (see the next item). The destination matrix
    has the dft_size size and CV_32FC1 type. It contains the result of the inverse DFT.
    -   If the source matrix is real (its type is CV_32FC1 ), forward DFT is performed. The result of
    the DFT is packed into complex ( CV_32FC2 ) matrix. So, the width of the destination matrix
    is dft_size.width / 2 + 1 . But if the source is a single column, the height is reduced
    instead of the width.
    
    @sa dft
     */
    interface Idft {
        (src: _st.InputArray, dst: _st.OutputArray, dft_size: _types.Size, flags?: _st.int /*= 0*/, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
    }
    export var dft: Idft = alvision_module.cuda.dft;

    //CV_EXPORTS void dft(InputArray src, OutputArray dst, Size dft_size, int flags=0, Stream& stream = Stream::Null());

    /** @brief Base class for convolution (or cross-correlation) operator. :
     */
    interface Convolution extends _core.Algorithm {
        /** @brief Computes a convolution (or cross-correlation) of two images.
    
        @param image Source image. Only CV_32FC1 images are supported for now.
        @param templ Template image. The size is not greater than the image size. The type is the same as
        image .
        @param result Result image. If image is *W x H* and templ is *w x h*, then result must be *W-w+1 x
        H-h+1*.
        @param ccorr Flags to evaluate cross-correlation instead of convolution.
        @param stream Stream for the asynchronous version.
         */
        convolve(image: _st.InputArray, templ: _st.InputArray, result: _st.OutputArray, ccorr?: boolean/*= false*/, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    };

    /** @brief Creates implementation for cuda::Convolution .
    
    @param user_block_size Block size. If you leave default value Size(0,0) then automatic
    estimation of block size will be used (which is optimized for speed). By varying user_block_size
    you can reduce memory requirements at the cost of speed.
     */

    interface IcreateConvolution {
        (user_block_size?: _types.Size /*= Size()*/): Convolution;
    }
    export var createConvolution: IcreateConvolution = alvision_module.cuda.createConvolution;

//CV_EXPORTS Ptr<Convolution> createConvolution(Size user_block_size = Size());

//! @} cudaarithm_arithm

//! @} cudaarithm

} //namespace cudaarithm
//} // namespace cv { namespace cuda {

//#endif /* __OPENCV_CUDAARITHM_HPP__ */
