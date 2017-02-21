/*M///////////////////////////////////////////////////////////////////////////////////////
//
//  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
//
//  By downloading, copying, installing or using the software you agree to this license.
//  If you do not agree to this license, do not download, install,
//  copy or use the software.
//
//
//                          License Agreement
//                For Open Source Computer Vision Library
//
// Copyright (C) 2000-2008, Intel Corporation, all rights reserved.
// Copyright (C) 2009, Willow Garage Inc., all rights reserved.
// Copyright (C) 2013, OpenCV Foundation, all rights reserved.
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

//#ifndef __OPENCV_BACKGROUND_SEGM_HPP__
//#define __OPENCV_BACKGROUND_SEGM_HPP__
//
//#include "opencv2/core.hpp"
//
//namespace cv
//{

//! @addtogroup video_motion
//! @{

/** @brief Base class for background/foreground segmentation. :

The class is only used to define the common interface for the whole family of background/foreground
segmentation algorithms.
 */

export interface BackgroundSubtractorStatic {
    new (): BackgroundSubtractor;
}

export interface BackgroundSubtractor extends _core.Algorithm
{
//public:
    /** @brief Computes a foreground mask.

    @param image Next video frame.
    @param fgmask The output foreground mask as an 8-bit binary image.
    @param learningRate The value between 0 and 1 that indicates how fast the background model is
    learnt. Negative parameter value makes the algorithm to use some automatically chosen learning
    rate. 0 means that the background model is not updated at all, 1 means that the background model
    is completely reinitialized from the last frame.
     */
    apply(image: _st.InputArray, fgmask: _st.OutputArray, learningRate?: _st.double /*= -1*/): void;

    /** @brief Computes a background image.

    @param backgroundImage The output background image.

    @note Sometimes the background image can be very blurry, as it contain the average background
    statistics.
     */
    getBackgroundImage(backgroundImage: _st.OutputArray ): void;
};

export var BackgroundSubtractor: BackgroundSubtractorStatic = alvision_module.BackgroundSubtractor;


/** @brief Gaussian Mixture-based Background/Foreground Segmentation Algorithm.

The class implements the Gaussian mixture model background subtraction described in @cite Zivkovic2004
and @cite Zivkovic2006 .
 */

export interface BackgroundSubtractorMOG2Static {
    new (): BackgroundSubtractorMOG2;
}

export interface BackgroundSubtractorMOG2 extends BackgroundSubtractor
{
//public:
//    /** @brief Returns the number of last frames that affect the background model
//    */
    getHistory(): _st.int;
//    CV_WRAP virtual int getHistory() const = 0;
//    /** @brief Sets the number of last frames that affect the background model
//    */
    setHistory(history: _st.int ): void ;
//    CV_WRAP virtual void setHistory(int history) = 0;
//
//    /** @brief Returns the number of gaussian components in the background model
//    */
    getNMixtures(): _st.int;
//    CV_WRAP virtual int getNMixtures() const = 0;
//    /** @brief Sets the number of gaussian components in the background model.
//
//    The model needs to be reinitalized to reserve memory.
//    */
    setNMixtures(nmixtures: _st.int ): void;
//    CV_WRAP virtual void setNMixtures(int nmixtures) = 0;//needs reinitialization!
//
//    /** @brief Returns the "background ratio" parameter of the algorithm
//
//    If a foreground pixel keeps semi-constant value for about backgroundRatio\*history frames, it's
//    considered background and added to the model as a center of a new component. It corresponds to TB
//    parameter in the paper.
//     */
    getBackgroundRatio(): _st.double;
//    CV_WRAP virtual double getBackgroundRatio() const = 0;
//    /** @brief Sets the "background ratio" parameter of the algorithm
//    */
    setBackgroundRatio(ratio: _st.double ) : void;
//    CV_WRAP virtual void setBackgroundRatio(double ratio) = 0;
//
//    /** @brief Returns the variance threshold for the pixel-model match
//
//    The main threshold on the squared Mahalanobis distance to decide if the sample is well described by
//    the background model or not. Related to Cthr from the paper.
//     */
    getVarThreshold() : _st.double;
//    CV_WRAP virtual double getVarThreshold() const = 0;
//    /** @brief Sets the variance threshold for the pixel-model match
//    */
    setVarThreshold(varThreshold: _st.double ): void;
//    CV_WRAP virtual void setVarThreshold(double varThreshold) = 0;
//
//    /** @brief Returns the variance threshold for the pixel-model match used for new mixture component generation
//
//    Threshold for the squared Mahalanobis distance that helps decide when a sample is close to the
//    existing components (corresponds to Tg in the paper). If a pixel is not close to any component, it
//    is considered foreground or added as a new component. 3 sigma =\> Tg=3\*3=9 is default. A smaller Tg
//    value generates more components. A higher Tg value may result in a small number of components but
//    they can grow too large.
//     */
    getVarThresholdGen(): _st.double;
//    CV_WRAP virtual double getVarThresholdGen() const = 0;
//    /** @brief Sets the variance threshold for the pixel-model match used for new mixture component generation
//    */
    setVarThresholdGen(varThresholdGen: _st.double ): void;
//    CV_WRAP virtual void setVarThresholdGen(double varThresholdGen) = 0;
//
//    /** @brief Returns the initial variance of each gaussian component
//    */
    getVarInit(): _st.double;
//    CV_WRAP virtual double getVarInit() const = 0;
//    /** @brief Sets the initial variance of each gaussian component
//    */
    setVarInit(varInit: _st.double ): void;
//    CV_WRAP virtual void setVarInit(double varInit) = 0;
//
    getVarMin(): _st.double;
//    CV_WRAP virtual double getVarMin() const = 0;
    setVarMin(varMin: _st.double ): void;
//    CV_WRAP virtual void setVarMin(double varMin) = 0;
//
    getVarMax(): _st.double;
//    CV_WRAP virtual double getVarMax() const = 0;
    setVarMax(varMax: _st.double ): void;
//    CV_WRAP virtual void setVarMax(double varMax) = 0;
//
//    /** @brief Returns the complexity reduction threshold
//
//    This parameter defines the number of samples needed to accept to prove the component exists. CT=0.05
//    is a default value for all the samples. By setting CT=0 you get an algorithm very similar to the
//    standard Stauffer&Grimson algorithm.
//     */
    getComplexityReductionThreshold(): _st.double;
//    CV_WRAP virtual double getComplexityReductionThreshold() const = 0;
//    /** @brief Sets the complexity reduction threshold
//    */
    setComplexityReductionThreshold(ct: _st.double ): void;
//    CV_WRAP virtual void setComplexityReductionThreshold(double ct) = 0;
//
//    /** @brief Returns the shadow detection flag
//
//    If true, the algorithm detects shadows and marks them. See createBackgroundSubtractorMOG2 for
//    details.
//     */
    getDetectShadows(): boolean;
//    CV_WRAP virtual bool getDetectShadows() const = 0;
//    /** @brief Enables or disables shadow detection
//    */
    setDetectShadows(detectShadows : boolean): void;
//
//    /** @brief Returns the shadow value
//
//    Shadow value is the value used to mark shadows in the foreground mask. Default value is 127. Value 0
//    in the mask always means background, 255 means foreground.
//     */
    getShadowValue(): _st.int;
//    CV_WRAP virtual int getShadowValue() const = 0;
//    /** @brief Sets the shadow value
//    */
    setShadowValue(value: _st.int ): void;
//    CV_WRAP virtual void setShadowValue(int value) = 0;
//
//    /** @brief Returns the shadow threshold
//
//    A shadow is detected if pixel is a darker version of the background. The shadow threshold (Tau in
//    the paper) is a threshold defining how much darker the shadow can be. Tau= 0.5 means that if a pixel
//    is more than twice darker then it is not shadow. See Prati, Mikic, Trivedi and Cucchiarra,
//    *Detecting Moving Shadows...*, IEEE PAMI,2003.
//     */
    getShadowThreshold(): _st.double;
//    CV_WRAP virtual double getShadowThreshold() const = 0;
//    /** @brief Sets the shadow threshold
//    */
    setShadowThreshold(threshold: _st.double ): void;
//    CV_WRAP virtual void setShadowThreshold(double threshold) = 0;
};

export var BackgroundSubtractorMOG2: BackgroundSubtractorMOG2Static = alvision_module.BackgroundSubtractorMOG2;

/** @brief Creates MOG2 Background Subtractor

@param history Length of the history.
@param varThreshold Threshold on the squared Mahalanobis distance between the pixel and the model
to decide whether a pixel is well described by the background model. This parameter does not
affect the background update.
@param detectShadows If true, the algorithm will detect shadows and mark them. It decreases the
speed a bit, so if you do not need this feature, set the parameter to false.
 */

interface IcreateBackgroundSubtractorMOG2{
    (history?: _st.int/*= 500*/, varThreshold?: _st.double /*= 16*/,
        detectShadows? : boolean /*= true*/) : BackgroundSubtractorMOG2;
}

export var createBackgroundSubtractorMOG2: IcreateBackgroundSubtractorMOG2 = alvision_module.createBackgroundSubtractorMOG2;

//CV_EXPORTS_W Ptr<BackgroundSubtractorMOG2>
//    createBackgroundSubtractorMOG2(int history=500, double varThreshold=16,
//                                   bool detectShadows=true);

/** @brief K-nearest neigbours - based Background/Foreground Segmentation Algorithm.

The class implements the K-nearest neigbours background subtraction described in @cite Zivkovic2006 .
Very efficient if number of foreground pixels is low.
 */
export interface BackgroundSubtractorKNNStatic {
    new (): BackgroundSubtractorKNN;
}

export interface BackgroundSubtractorKNN extends BackgroundSubtractor
{
//public:
//    /** @brief Returns the number of last frames that affect the background model
//    */
    getHistory(): _st.int;
//    CV_WRAP virtual int getHistory() const = 0;
//    /** @brief Sets the number of last frames that affect the background model
//    */
    setHistory(history: _st.int ): void;
//    CV_WRAP virtual void setHistory(int history) = 0;
//
//    /** @brief Returns the number of data samples in the background model
//    */
    getNSamples(): _st.int;
//    CV_WRAP virtual int getNSamples() const = 0;
//    /** @brief Sets the number of data samples in the background model.
//
//    The model needs to be reinitalized to reserve memory.
//    */
    setNSamples(_nN: _st.int ): void;
//    CV_WRAP virtual void setNSamples(int _nN) = 0;//needs reinitialization!
//
//    /** @brief Returns the threshold on the squared distance between the pixel and the sample
//
//    The threshold on the squared distance between the pixel and the sample to decide whether a pixel is
//    close to a data sample.
//     */
    getDist2Threshold(): _st.double;
//    CV_WRAP virtual double getDist2Threshold() const = 0;
//    /** @brief Sets the threshold on the squared distance
//    */
    setDist2Threshold(_dist2Threshold: _st.double ): void;
//    CV_WRAP virtual void setDist2Threshold(double _dist2Threshold) = 0;
//
//    /** @brief Returns the number of neighbours, the k in the kNN.
//
//    K is the number of samples that need to be within dist2Threshold in order to decide that that
//    pixel is matching the kNN background model.
//     */
    getkNNSamples(): _st.int;
//    CV_WRAP virtual int getkNNSamples() const = 0;
//    /** @brief Sets the k in the kNN. How many nearest neigbours need to match.
//    */
    setkNNSamples(_nkNN: _st.int ): void;
//    CV_WRAP virtual void setkNNSamples(int _nkNN) = 0;
//
//    /** @brief Returns the shadow detection flag
//
//    If true, the algorithm detects shadows and marks them. See createBackgroundSubtractorKNN for
//    details.
//     */
    getDetectShadows(): boolean;
//    CV_WRAP virtual bool getDetectShadows() const = 0;
//    /** @brief Enables or disables shadow detection
//    */
    setDetectShadows(detectShadows : boolean): void;
//
//    /** @brief Returns the shadow value
//
//    Shadow value is the value used to mark shadows in the foreground mask. Default value is 127. Value 0
//    in the mask always means background, 255 means foreground.
//     */
    getShadowValue(): _st.int;
//    CV_WRAP virtual int getShadowValue() const = 0;
//    /** @brief Sets the shadow value
//    */
    setShadowValue(value: _st.int ): void;
//    CV_WRAP virtual void setShadowValue(int value) = 0;
//
//    /** @brief Returns the shadow threshold
//
//    A shadow is detected if pixel is a darker version of the background. The shadow threshold (Tau in
//    the paper) is a threshold defining how much darker the shadow can be. Tau= 0.5 means that if a pixel
//    is more than twice darker then it is not shadow. See Prati, Mikic, Trivedi and Cucchiarra,
//    *Detecting Moving Shadows...*, IEEE PAMI,2003.
//     */
    getShadowThreshold(): _st.double;
//    CV_WRAP virtual double getShadowThreshold() const = 0;
//    /** @brief Sets the shadow threshold
//     */
    setShadowThreshold(threshold: _st.double): void;
//    CV_WRAP virtual void setShadowThreshold(double threshold) = 0;
};

export var BackgroundSubtractorKNN: BackgroundSubtractorKNNStatic = alvision_module.BackgroundSubtractorKNN;

/** @brief Creates KNN Background Subtractor

@param history Length of the history.
@param dist2Threshold Threshold on the squared distance between the pixel and the sample to decide
whether a pixel is close to that sample. This parameter does not affect the background update.
@param detectShadows If true, the algorithm will detect shadows and mark them. It decreases the
speed a bit, so if you do not need this feature, set the parameter to false.
 */

export interface IcreateBackgroundSubtractorKNN {
    (history?: _st.int /*= 500*/, dist2Threshold?: _st.double /*= 400.0*/, detectShadows?: boolean /* =true*/): BackgroundSubtractorKNN;
}

export var createBackgroundSubtractorKNN: IcreateBackgroundSubtractorKNN = alvision_module.createBackgroundSubtractorKNN;

//CV_EXPORTS_W Ptr<BackgroundSubtractorKNN>
//    createBackgroundSubtractorKNN(int history=500, double dist2Threshold=400.0,
//                                   bool detectShadows=true);

//! @} video_motion

//} // cv
//
//#endif
//