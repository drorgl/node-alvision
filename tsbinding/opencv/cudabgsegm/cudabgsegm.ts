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
//import * as _core from './Core';
import * as _base from './../Base';
//import * as _scalar from './Scalar'
import * as _bgsegm from './../video/background_segm';


//#ifndef __OPENCV_CUDABGSEGM_HPP__
//#define __OPENCV_CUDABGSEGM_HPP__
//
//#ifndef __cplusplus
//#  error cudabgsegm.hpp header must be compiled as C++
//#endif
//
//#include "opencv2/core/cuda.hpp"
//#include "opencv2/video/background_segm.hpp"
//
/**
  @addtogroup cuda
  @{
    @defgroup cudabgsegm Background Segmentation
  @}
 */

//namespace cv {
export namespace cudabgsegm {

    //! @addtogroup cudabgsegm
    //! @{

    ////////////////////////////////////////////////////
    // MOG

    /** @brief Gaussian Mixture-based Background/Foreground Segmentation Algorithm.
    
    The class discriminates between foreground and background pixels by building and maintaining a model
    of the background. Any pixel which does not fit this model is then deemed to be foreground. The
    class implements algorithm described in @cite MOG2001 .
    
    @sa BackgroundSubtractorMOG
    
    @note
       -   An example on gaussian mixture based background/foreground segmantation can be found at
            opencv_source_code/samples/gpu/bgfg_segm.cpp
     */
    interface BackgroundSubtractorMOG extends _bgsegm.BackgroundSubtractor {
        //public:

        //    using cv::BackgroundSubtractor::apply;
        //    virtual void apply(InputArray image, OutputArray fgmask, double learningRate, Stream& stream) = 0;
        //
        //    using cv::BackgroundSubtractor::getBackgroundImage;
        //    virtual void getBackgroundImage(OutputArray backgroundImage, Stream& stream) const = 0;
        //
        //    virtual int getHistory() const = 0;
        //    virtual void setHistory(int nframes) = 0;
        //
        //    virtual int getNMixtures() const = 0;
        //    virtual void setNMixtures(int nmix) = 0;
        //
        //    virtual double getBackgroundRatio() const = 0;
        //    virtual void setBackgroundRatio(double backgroundRatio) = 0;
        //
        //    virtual double getNoiseSigma() const = 0;
        //    virtual void setNoiseSigma(double noiseSigma) = 0;
    };

    /** @brief Creates mixture-of-gaussian background subtractor
    
    @param history Length of the history.
    @param nmixtures Number of Gaussian mixtures.
    @param backgroundRatio Background ratio.
    @param noiseSigma Noise strength (standard deviation of the brightness or each color channel). 0
    means some automatic value.
     */

    interface IcreateBackgroundSubtractorMOG {
        (history?: _st.int/*= 200*/, nmixtures?: _st.int /*= 5*/,
            backgroundRatio?: _st.double/*= 0.7*/, noiseSigma?: _st.double /*= 0*/): BackgroundSubtractorMOG
    }

    export var createBackgroundSubtractorMOG: IcreateBackgroundSubtractorMOG = alvision_module.cuda.createBackgroundSubtractorMOG;
    //CV_EXPORTS Ptr<cuda::BackgroundSubtractorMOG>
    //    createBackgroundSubtractorMOG(int history = 200, int nmixtures = 5,
    //                                  double backgroundRatio = 0.7, double noiseSigma = 0);

    ////////////////////////////////////////////////////
    // MOG2

    /** @brief Gaussian Mixture-based Background/Foreground Segmentation Algorithm.
    
    The class discriminates between foreground and background pixels by building and maintaining a model
    of the background. Any pixel which does not fit this model is then deemed to be foreground. The
    class implements algorithm described in @cite Zivkovic2004 .
    
    @sa BackgroundSubtractorMOG2
     */
    interface BackgroundSubtractorMOG2 extends _bgsegm.BackgroundSubtractorMOG2 {
        //public:
        //    using cv::BackgroundSubtractorMOG2::apply;
        //    using cv::BackgroundSubtractorMOG2::getBackgroundImage;
        //
        //    virtual void apply(InputArray image, OutputArray fgmask, double learningRate, Stream& stream) = 0;
        //
        //    virtual void getBackgroundImage(OutputArray backgroundImage, Stream& stream) const = 0;
    };

    /** @brief Creates MOG2 Background Subtractor
    
    @param history Length of the history.
    @param varThreshold Threshold on the squared Mahalanobis distance between the pixel and the model
    to decide whether a pixel is well described by the background model. This parameter does not
    affect the background update.
    @param detectShadows If true, the algorithm will detect shadows and mark them. It decreases the
    speed a bit, so if you do not need this feature, set the parameter to false.
     */

    interface IcreateBackgroundSubtractorMOG2 {
        (history?: _st.int/*= 500*/, varThreshold?: _st.double /*= 16*/,
            detectShadows ? : boolean /*= true*/): BackgroundSubtractorMOG2
    }

    export var createBackgroundSubtractorMOG2: IcreateBackgroundSubtractorMOG2 = alvision_module.cuda.createBackgroundSubtractorMOG2;
//CV_EXPORTS Ptr<cuda::BackgroundSubtractorMOG2>
//    createBackgroundSubtractorMOG2(int history = 500, double varThreshold = 16,
//                                   bool detectShadows = true);

//! @}

}
//} // namespace cv { namespace cuda {

//#endif /* __OPENCV_CUDABGSEGM_HPP__ */
