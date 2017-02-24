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

////// <reference path="Matrix.ts" />
import alvision_module from "../../bindings";

//import * as _constants from './Constants'
import * as _st from './../static';
import * as _mat from './../Mat';
import * as _types from './../Types';
import * as _core from './../Core';
import * as _base from './../Base';
import * as _cuda from './../cuda';
import * as _persistence from './../persistence';
//import * as _scalar from './Scalar'

//#ifndef __OPENCV_CUDAWARPING_HPP__
//#define __OPENCV_CUDAWARPING_HPP__
//
//#ifndef __cplusplus
//#  error cudawarping.hpp header must be compiled as C++
//#endif
//
//#include "opencv2/core/cuda.hpp"
//#include "opencv2/imgproc.hpp"

/**
  @addtogroup cuda
  @{
    @defgroup cudawarping Image Warping
  @}
 */

//namespace cv {
//export namespace cudawarping {
    //! @addtogroup cudawarping
    //! @{

    /** @brief Applies a generic geometrical transformation to an image.
    
    @param src Source image.
    @param dst Destination image with the size the same as xmap and the type the same as src .
    @param xmap X values. Only CV_32FC1 type is supported.
    @param ymap Y values. Only CV_32FC1 type is supported.
    @param interpolation Interpolation method (see resize ). INTER_NEAREST , INTER_LINEAR and
    INTER_CUBIC are supported for now.
    @param borderMode Pixel extrapolation method (see borderInterpolate ). BORDER_REFLECT101 ,
    BORDER_REPLICATE , BORDER_CONSTANT , BORDER_REFLECT and BORDER_WRAP are supported for now.
    @param borderValue Value used in case of a constant border. By default, it is 0.
    @param stream Stream for the asynchronous version.
    
    The function transforms the source image using the specified map:
    
    \f[\texttt{dst} (x,y) =  \texttt{src} (xmap(x,y), ymap(x,y))\f]
    
    Values of pixels with non-integer coordinates are computed using the bilinear interpolation.
    
    @sa remap
     */
    interface Iremap {
        (src: _st.InputArray, dst: _st.OutputArray, xmap: _st.InputArray, ymap: _st.InputArray,
            interpolation: _st.int, borderMode?: _st.int /*= BORDER_CONSTANT*/, borderValue?: _types.Scalar /*= Scalar()*/,
            stream?: _cuda.Stream /*= Stream::Null()*/): void;
    }
    export var remap: Iremap = alvision_module.cuda.remap;

    //CV_EXPORTS void remap(InputArray src, OutputArray dst, InputArray xmap, InputArray ymap,
    //                      int interpolation, int borderMode = BORDER_CONSTANT, Scalar borderValue = Scalar(),
    //                      Stream& stream = Stream::Null());

    /** @brief Resizes an image.
    
    @param src Source image.
    @param dst Destination image with the same type as src . The size is dsize (when it is non-zero)
    or the size is computed from src.size() , fx , and fy .
    @param dsize Destination image size. If it is zero, it is computed as:
    \f[\texttt{dsize = Size(round(fx*src.cols), round(fy*src.rows))}\f]
    Either dsize or both fx and fy must be non-zero.
    @param fx Scale factor along the horizontal axis. If it is zero, it is computed as:
    \f[\texttt{(double)dsize.width/src.cols}\f]
    @param fy Scale factor along the vertical axis. If it is zero, it is computed as:
    \f[\texttt{(double)dsize.height/src.rows}\f]
    @param interpolation Interpolation method. INTER_NEAREST , INTER_LINEAR and INTER_CUBIC are
    supported for now.
    @param stream Stream for the asynchronous version.
    
    @sa resize
     */

    interface Iresize {
        (src: _st.InputArray, dst: _st.OutputArray, dsize: _types.Size, fx?: _st.double /*= 0*/, fy?: _st.double /*= 0*/, interpolation?: _st.int /*= INTER_LINEAR*/,
            stream?: _cuda.Stream /*= Stream::Null()*/): void;
    }
    export var resize: Iresize = alvision_module.cuda.resize;
    //CV_EXPORTS void resize(InputArray src, OutputArray dst, Size dsize, double fx=0, double fy=0, int interpolation = INTER_LINEAR, Stream& stream = Stream::Null());

    /** @brief Applies an affine transformation to an image.
    
    @param src Source image. CV_8U , CV_16U , CV_32S , or CV_32F depth and 1, 3, or 4 channels are
    supported.
    @param dst Destination image with the same type as src . The size is dsize .
    @param M *2x3* transformation matrix.
    @param dsize Size of the destination image.
    @param flags Combination of interpolation methods (see resize) and the optional flag
    WARP_INVERSE_MAP specifying that M is an inverse transformation ( dst=\>src ). Only
    INTER_NEAREST , INTER_LINEAR , and INTER_CUBIC interpolation methods are supported.
    @param borderMode
    @param borderValue
    @param stream Stream for the asynchronous version.
    
    @sa warpAffine
     */
    interface IwarpAffine {
        (src: _st.InputArray, dst: _st.OutputArray, M: _st.InputArray, dsize: _types.Size, flags?: _st.int /*= INTER_LINEAR*/,
            borderMode?: _st.int /*= BORDER_CONSTANT*/, borderValue?: _types.Scalar /*= Scalar()*/, stream?: _cuda.Stream /*= Stream::Null()*/): void;
    }
    export var warpAffine: IwarpAffine = alvision_module.cuda.warpAffine;

    //CV_EXPORTS void warpAffine(InputArray src, OutputArray dst, InputArray M, Size dsize, int flags = INTER_LINEAR,
    //    int borderMode = BORDER_CONSTANT, Scalar borderValue = Scalar(), Stream& stream = Stream::Null());

    /** @brief Builds transformation maps for affine transformation.
    
    @param M *2x3* transformation matrix.
    @param inverse Flag specifying that M is an inverse transformation ( dst=\>src ).
    @param dsize Size of the destination image.
    @param xmap X values with CV_32FC1 type.
    @param ymap Y values with CV_32FC1 type.
    @param stream Stream for the asynchronous version.
    
    @sa cuda::warpAffine , cuda::remap
     */
    interface IbuildWarpAffineMaps {
        (M: _st.InputArray, inverse: boolean, dsize: _types.Size, xmap: _st.OutputArray, ymap: _st.OutputArray, stream?: _cuda.Stream /* = Stream::Null()*/): void;
    }
    export var buildWarpAffineMaps: IbuildWarpAffineMaps = alvision_module.cuda.buildWarpAffineMaps;

    //CV_EXPORTS void buildWarpAffineMaps(InputArray M, bool inverse, Size dsize, OutputArray xmap, OutputArray ymap, Stream& stream = Stream::Null());

    /** @brief Applies a perspective transformation to an image.
    
    @param src Source image. CV_8U , CV_16U , CV_32S , or CV_32F depth and 1, 3, or 4 channels are
    supported.
    @param dst Destination image with the same type as src . The size is dsize .
    @param M *3x3* transformation matrix.
    @param dsize Size of the destination image.
    @param flags Combination of interpolation methods (see resize ) and the optional flag
    WARP_INVERSE_MAP specifying that M is the inverse transformation ( dst =\> src ). Only
    INTER_NEAREST , INTER_LINEAR , and INTER_CUBIC interpolation methods are supported.
    @param borderMode
    @param borderValue
    @param stream Stream for the asynchronous version.
    
    @sa warpPerspective
     */
    interface IwarpPerspective {
        (src: _st.InputArray, dst: _st.OutputArray, M: _st.InputArray, dsize: _types.Size, flags?: _st.int /*= INTER_LINEAR*/,
            borderMode?: _st.int /*= BORDER_CONSTANT*/, borderValue?: _types.Scalar /*= Scalar()*/, stream?: _cuda.Stream /*= Stream::Null()*/): void;
    }
    export var warpPerspective: IwarpPerspective = alvision_module.cuda.warpPerspective;
    //CV_EXPORTS void warpPerspective(InputArray src, OutputArray dst, InputArray M, Size dsize, int flags = INTER_LINEAR,
    //    int borderMode = BORDER_CONSTANT, Scalar borderValue = Scalar(), Stream& stream = Stream::Null());

    /** @brief Builds transformation maps for perspective transformation.
    
    @param M *3x3* transformation matrix.
    @param inverse Flag specifying that M is an inverse transformation ( dst=\>src ).
    @param dsize Size of the destination image.
    @param xmap X values with CV_32FC1 type.
    @param ymap Y values with CV_32FC1 type.
    @param stream Stream for the asynchronous version.
    
    @sa cuda::warpPerspective , cuda::remap
     */
    interface IbuildWarpPerspectiveMaps {
        (M: _st.InputArray, inverse: boolean, dsize: _types.Size, xmap: _st.OutputArray, ymap: _st.OutputArray, stream?: _cuda.Stream /* = Stream::Null()*/): void;
    }
    export var buildWarpPerspectiveMaps: IbuildWarpPerspectiveMaps = alvision_module.cuda.buildWarpPerspectiveMaps;
    //CV_EXPORTS void buildWarpPerspectiveMaps(InputArray M, bool inverse, Size dsize, OutputArray xmap, OutputArray ymap, Stream& stream = Stream::Null());

    /** @brief Rotates an image around the origin (0,0) and then shifts it.
    
    @param src Source image. Supports 1, 3 or 4 channels images with CV_8U , CV_16U or CV_32F
    depth.
    @param dst Destination image with the same type as src . The size is dsize .
    @param dsize Size of the destination image.
    @param angle Angle of rotation in degrees.
    @param xShift Shift along the horizontal axis.
    @param yShift Shift along the vertical axis.
    @param interpolation Interpolation method. Only INTER_NEAREST , INTER_LINEAR , and INTER_CUBIC
    are supported.
    @param stream Stream for the asynchronous version.
    
    @sa cuda::warpAffine
     */
    interface Irotate {
        (src: _st.InputArray, dst: _st.OutputArray, dsize: _types.Size, angle: _st.double, xShift?: _st.double /*= 0*/, yShift?: _st.double /*= 0*/,
            interpolation?: _st.int /*= INTER_LINEAR*/, stream?: _cuda.Stream /*= Stream::Null()*/): void;
    }
    export var rotate: Irotate = alvision_module.cuda.rotate;

    //CV_EXPORTS void rotate(InputArray src, OutputArray dst, Size dsize, double angle, double xShift = 0, double yShift = 0,
    //                       int interpolation = INTER_LINEAR, Stream& stream = Stream::Null());

    /** @brief Smoothes an image and downsamples it.
    
    @param src Source image.
    @param dst Destination image. Will have Size((src.cols+1)/2, (src.rows+1)/2) size and the same
    type as src .
    @param stream Stream for the asynchronous version.
    
    @sa pyrDown
     */
    interface IpyrDown {
        (src: _st.InputArray, dst: _st.OutputArray, stream?: _cuda.Stream /*= Stream::Null()*/): void;
    }
    export var pyrDown: IpyrDown = alvision_module.cuda.pyrDown;

    //CV_EXPORTS void pyrDown(InputArray src, OutputArray dst, Stream& stream = Stream::Null());

    /** @brief Upsamples an image and then smoothes it.
    
    @param src Source image.
    @param dst Destination image. Will have Size(src.cols\*2, src.rows\*2) size and the same type as
    src .
    @param stream Stream for the asynchronous version.
     */
    interface IpyrUp {
        (src: _st.InputArray, dst: _st.OutputArray, stream?: _cuda.Stream/*= Stream::Null()*/): void;
    }
    export var pyrUp: IpyrUp = alvision_module.cuda.pyrUp;
//CV_EXPORTS void pyrUp(InputArray src, OutputArray dst, Stream& stream = Stream::Null());

//! @}

//}
//} // namespace cv { namespace cuda {

//#endif /* __OPENCV_CUDAWARPING_HPP__ */
