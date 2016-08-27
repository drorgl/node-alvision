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
// Copyright (C) 2008-2012, Willow Garage Inc., all rights reserved.
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

var alvision_module = require('../../../lib/bindings.js');

import * as _mat from './../mat'
import * as _matx from './../matx'
//import * as _st from './Constants'
import * as _st from './../static'
import * as _types from './../types'
import * as _core from './../core'
import * as _base from './../base'
import * as _affine from './../Affine'
import * as _features2d from './../features2d'

//#ifndef __OPENCV_PHOTO_CUDA_HPP__
//#define __OPENCV_PHOTO_CUDA_HPP__
//
//#include "opencv2/core/cuda.hpp"

//namespace cv {
export namespace cudaphoto {

    //! @addtogroup photo_denoise
    //! @{

    /** @brief Performs pure non local means denoising without any simplification, and thus it is not fast.
    
    @param src Source image. Supports only CV_8UC1, CV_8UC2 and CV_8UC3.
    @param dst Destination image.
    @param h Filter sigma regulating filter strength for color.
    @param search_window Size of search window.
    @param block_size Size of block used for computing weights.
    @param borderMode Border type. See borderInterpolate for details. BORDER_REFLECT101 ,
    BORDER_REPLICATE , BORDER_CONSTANT , BORDER_REFLECT and BORDER_WRAP are supported for now.
    @param stream Stream for the asynchronous version.
    
    @sa
       fastNlMeansDenoising
     */
    interface InonLocalMeans {
        (src: _st.InputArray, dst: _st.OutputArray,
            h: _st.float,
            search_window?: _st.int /*= 21*/,
            block_size?: _st.int /*= 7*/,
            borderMode?: _base.BorderTypes /*= BORDER_DEFAULT*/
            /*, Stream & stream = Stream::Null()*/): void;
    }

    export var nonLocalMeans: InonLocalMeans = alvision_module.nonLocalMeans;

    //CV_EXPORTS void nonLocalMeans(InputArray src, OutputArray dst,
    //                              float h,
    //                              int search_window = 21,
    //                              int block_size = 7,
    //                              int borderMode = BORDER_DEFAULT,
    //                              Stream& stream = Stream::Null());

    /** @brief Perform image denoising using Non-local Means Denoising algorithm
    <http://www.ipol.im/pub/algo/bcm_non_local_means_denoising> with several computational
    optimizations. Noise expected to be a gaussian white noise
    
    @param src Input 8-bit 1-channel, 2-channel or 3-channel image.
    @param dst Output image with the same size and type as src .
    @param h Parameter regulating filter strength. Big h value perfectly removes noise but also
    removes image details, smaller h value preserves details but also preserves some noise
    @param search_window Size in pixels of the window that is used to compute weighted average for
    given pixel. Should be odd. Affect performance linearly: greater search_window - greater
    denoising time. Recommended value 21 pixels
    @param block_size Size in pixels of the template patch that is used to compute weights. Should be
    odd. Recommended value 7 pixels
    @param stream Stream for the asynchronous invocations.
    
    This function expected to be applied to grayscale images. For colored images look at
    FastNonLocalMeansDenoising::labMethod.
    
    @sa
       fastNlMeansDenoising
     */
    interface IfastNlMeansDenoising {
        (src: _st.InputArray, dst: _st.OutputArray,
            h: _st.float,
            search_window?: _st.int /* = 21*/,
            block_size?: _st.int /* = 7*/
            /*,Stream & stream = Stream::Null()*/): void;
    }
    export var fastNlMeansDenoising: IfastNlMeansDenoising = alvision_module.fastNlMeansDenoising;

    //CV_EXPORTS void fastNlMeansDenoising(InputArray src, OutputArray dst,
    //                                     float h,
    //                                     int search_window = 21,
    //                                     int block_size = 7,
    //                                     Stream& stream = Stream::Null());

    /** @brief Modification of fastNlMeansDenoising function for colored images
    
    @param src Input 8-bit 3-channel image.
    @param dst Output image with the same size and type as src .
    @param h_luminance Parameter regulating filter strength. Big h value perfectly removes noise but
    also removes image details, smaller h value preserves details but also preserves some noise
    @param photo_render float The same as h but for color components. For most images value equals 10 will be
    enough to remove colored noise and do not distort colors
    @param search_window Size in pixels of the window that is used to compute weighted average for
    given pixel. Should be odd. Affect performance linearly: greater search_window - greater
    denoising time. Recommended value 21 pixels
    @param block_size Size in pixels of the template patch that is used to compute weights. Should be
    odd. Recommended value 7 pixels
    @param stream Stream for the asynchronous invocations.
    
    The function converts image to CIELAB colorspace and then separately denoise L and AB components
    with given h parameters using FastNonLocalMeansDenoising::simpleMethod function.
    
    @sa
       fastNlMeansDenoisingColored
     */
    interface IfastNlMeansDenoisingColored {
        (src: _st.InputArray, dst: _st.OutputArray,
            h_luminance: _st.float, photo_render: _st.float,
            search_window?: _st.int /*= 21*/,
            block_size?: _st.int /*= 7*/
            /*,Stream & stream = Stream::Null()*/): void;
    }
    export var fastNlMeansDenoisingColored: IfastNlMeansDenoisingColored = alvision_module.fastNlMeansDenoisingColored;

    //CV_EXPORTS void fastNlMeansDenoisingColored(InputArray src, OutputArray dst,
    //                                            float h_luminance, float photo_render,
    //                                            int search_window = 21,
    //                                            int block_size = 7,
    //                                            Stream& stream = Stream::Null());

    //! @} photo

    //}
    //} // namespace cv { namespace cuda {

    //#endif /* __OPENCV_PHOTO_CUDA_HPP__ */
}