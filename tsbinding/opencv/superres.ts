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

import alvision_module from "../bindings";

import * as _mat from './mat'
import * as _matx from './matx'
//import * as _st from './Constants'
import * as _st from './static'
import * as _types from './types'
import * as _core from './core'
import * as _base from './base'
import * as _affine from './Affine'
import * as _features2d from './features2d'
import * as _superres_opticalflow from './superres/optical_flow';

export * from './superres/optical_flow';
export * from "./superres/input_array_utility";


//#ifndef __OPENCV_SUPERRES_HPP__
//#define __OPENCV_SUPERRES_HPP__
//
//#include "opencv2/core.hpp"
//#include "opencv2/superres/optical_flow.hpp"

/**
  @defgroup superres Super Resolution

The Super Resolution module contains a set of functions and classes that can be used to solve the
problem of resolution enhancement. There are a few methods implemented, most of them are descibed in
the papers @cite Farsiu03 and @cite Mitzel09 .

 */

//namespace cv
//{
//export namespace superres {

    //! @addtogroup superres
    //! @{

    export interface FrameSource {
        //public:
        //    virtual ~FrameSource();
        //
        nextFrame(frame: _st.OutputArray ): void;
        reset(): void;
    };

    interface IcreateFrameSource_Empty {
        (): FrameSource;
    }

    export var createFrameSource_Empty: IcreateFrameSource_Empty = alvision_module.createFrameSource_Empty;

    //CV_EXPORTS Ptr<FrameSource> createFrameSource_Empty();

    interface IcreateFrameSource_Video {
        (fileName: string): FrameSource;
    }

    export var createFrameSource_Video: IcreateFrameSource_Video = alvision_module.createFrameSource_Video;
    //CV_EXPORTS Ptr<FrameSource> createFrameSource_Video(const String& fileName);

    interface IcreateFrameSource_Video_CUDA {
        (fileName: string): FrameSource;
    }

    export var createFrameSource_Video_CUDA: IcreateFrameSource_Video_CUDA = alvision_module.createFrameSource_Video_CUDA;

    //CV_EXPORTS Ptr<FrameSource> createFrameSource_Video_CUDA(const String& fileName);

    interface IcreateFrameSource_Camera {
        (deviceId: _st.int): FrameSource;
    }

    export var createFrameSource_Camera: IcreateFrameSource_Camera = alvision_module.createFrameSource_Camera;

    //CV_EXPORTS Ptr<FrameSource> createFrameSource_Camera(int deviceId = 0);

    /** @brief Base class for Super Resolution algorithms.

    The class is only used to define the common interface for the whole family of Super Resolution
    algorithms.
     */
    export interface SuperResolution extends _core.Algorithm, FrameSource {
        //        public:
                    /** @brief Set input frame source for Super Resolution algorithm.
        
                    @param frameSource Input frame source
                     */
        setInput(frameSource: FrameSource) : void;
        
                    /** @brief Process next frame from input and return output result.
        
                    @param frame Output result
                     */
        nextFrame(frame: _st.OutputArray): void;
        reset(): void;
        
                    /** @brief Clear all inner buffers.
                    */
        collectGarbage(): void;
        
                    //! @brief Scale factor
                    /** @see setScale */
        getScale(): _st.int;
                    /** @copybrief getScale @see getScale */
        setScale(val: _st.int): void;
        
                    //! @brief Iterations count
                    /** @see setIterations */
        getIterations(): _st.int;
                    /** @copybrief getIterations @see getIterations */
        setIterations(val: _st.int): void;
        
                    //! @brief Asymptotic value of steepest descent method
                    /** @see setTau */
        getTau(): _st.double;
                    /** @copybrief getTau @see getTau */
        setTau(val: _st.double): void;
        
                    //! @brief Weight parameter to balance data term and smoothness term
                    /** @see setLabmda */
        getLabmda(): _st.double;
                    /** @copybrief getLabmda @see getLabmda */
        setLabmda(val: _st.double): void;
        
                    //! @brief Parameter of spacial distribution in Bilateral-TV
                    /** @see setAlpha */
        getAlpha():_st.double;
                    /** @copybrief getAlpha @see getAlpha */
        setAlpha(val: _st.double): void;
        
                    //! @brief Kernel size of Bilateral-TV filter
                    /** @see setKernelSize */
        getKernelSize(): _st.int;
                    /** @copybrief getKernelSize @see getKernelSize */
        setKernelSize(val: _st.int): void;
        
                    //! @brief Gaussian blur kernel size
                    /** @see setBlurKernelSize */
        getBlurKernelSize(): _st.int;
                    /** @copybrief getBlurKernelSize @see getBlurKernelSize */
        setBlurKernelSize(val: _st.int): void;
        
                    //! @brief Gaussian blur sigma
                    /** @see setBlurSigma */
        getBlurSigma(): _st.double;
                    /** @copybrief getBlurSigma @see getBlurSigma */
        setBlurSigma(val: _st.double ): void;
        
                    //! @brief Radius of the temporal search area
                    /** @see setTemporalAreaRadius */
        getTemporalAreaRadius(): _st.int;
                    /** @copybrief getTemporalAreaRadius @see getTemporalAreaRadius */
        setTemporalAreaRadius(val: _st.int ): void;
        
                    //! @brief Dense optical flow algorithm
        /** @see setOpticalFlow */
        getOpticalFlow(): _superres_opticalflow.DenseOpticalFlowExt;
                    /** @copybrief getOpticalFlow @see getOpticalFlow */
        setOpticalFlow(val: _superres_opticalflow.DenseOpticalFlowExt) : void;
        //
        //        protected:
        //            SuperResolution();
        //
        //            virtual void initImpl(Ptr<FrameSource>& frameSource) = 0;
        //            virtual void processImpl(Ptr<FrameSource>& frameSource, OutputArray output) = 0;
        //
        //            bool isUmat_;
        //
        //        private:
        //            Ptr<FrameSource> frameSource_;
        //            bool firstCall_;
    };

    /** @brief Create Bilateral TV-L1 Super Resolution.

    This class implements Super Resolution algorithm described in the papers @cite Farsiu03 and
    @cite Mitzel09 .

    Here are important members of the class that control the algorithm, which you can set after
    constructing the class instance:

    -   **int scale** Scale factor.
    -   **int iterations** Iteration count.
    -   **double tau** Asymptotic value of steepest descent method.
    -   **double lambda** Weight parameter to balance data term and smoothness term.
    -   **double alpha** Parameter of spacial distribution in Bilateral-TV.
    -   **int btvKernelSize** Kernel size of Bilateral-TV filter.
    -   **int blurKernelSize** Gaussian blur kernel size.
    -   **double blurSigma** Gaussian blur sigma.
    -   **int temporalAreaRadius** Radius of the temporal search area.
    -   **Ptr\<DenseOpticalFlowExt\> opticalFlow** Dense optical flow algorithm.
     */
    interface IcreateSuperResolution_BTVL1 {
        () :  SuperResolution;
    }

    export var createSuperResolution_BTVL1: IcreateSuperResolution_BTVL1 = alvision_module.superres.createSuperResolution_BTVL1;
    //        CV_EXPORTS Ptr<SuperResolution> createSuperResolution_BTVL1();

    interface IcreateSuperResolution_BTVL1_CUDA {
        (): SuperResolution;
    }

    export var createSuperResolution_BTVL1_CUDA: IcreateSuperResolution_BTVL1_CUDA = alvision_module.superres.createSuperResolution_BTVL1_CUDA;
    //        CV_EXPORTS Ptr<SuperResolution> createSuperResolution_BTVL1_CUDA();

    //! @} superres

//}
//}

//#endif // __OPENCV_SUPERRES_HPP__
