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

//#ifndef __OPENCV_SUPERRES_OPTICAL_FLOW_HPP__
//#define __OPENCV_SUPERRES_OPTICAL_FLOW_HPP__
//
//#include "opencv2/core.hpp"
////// <reference path="Matrix.ts" />
import alvision_module from "../../bindings";

//import * as _constants from './Constants'
import * as _st from './../static';
import * as _mat from './../mat';
import * as _types from './../types';
import * as _core from './../core';
import * as _base from './../base';
import * as _cuda from './../cuda';
import * as _persistence from './../persistence';

        //export namespace super_res_optical_flow{

//! @addtogroup superres
//! @{

        export interface  DenseOpticalFlowExt extends _core.Algorithm
        {
            calc(frame0: _st.InputArray, frame1: _st.InputArray, flow1: _st.OutputArray, flow2?: _st.OutputArray /* = noArray()*/): void;
            collectGarbage(): void;
        };

        export interface FarnebackOpticalFlow extends DenseOpticalFlowExt
        {
            /** @see setPyrScale */
            getPyrScale(): _st.double;
            /** @copybrief getPyrScale @see getPyrScale */
            setPyrScale(val: _st.double): void;
            /** @see setLevelsNumber */
            getLevelsNumber(): _st.int;
            /** @copybrief getLevelsNumber @see getLevelsNumber */
            setLevelsNumber(val: _st.int ): void;
            /** @see setWindowSize */
            getWindowSize(): _st.int;
            /** @copybrief getWindowSize @see getWindowSize */
            setWindowSize(val: _st.int ): void;
            /** @see setIterations */
            getIterations(): _st.int;
            /** @copybrief getIterations @see getIterations */
            setIterations(val: _st.int ): void;
            /** @see setPolyN */
            getPolyN(): _st.int;
            /** @copybrief getPolyN @see getPolyN */
            setPolyN(val: _st.int ): void;
            /** @see setPolySigma */
            getPolySigma(): _st.double;
            /** @copybrief getPolySigma @see getPolySigma */
            setPolySigma(val: _st.double ): void;
            /** @see setFlags */
            getFlags(): _st.int;
            /** @copybrief getFlags @see getFlags */
            setFlags(val: _st.int ): void;
        };

        interface IcreateOptFlow_Farneback {
            (): FarnebackOpticalFlow
        }
         //Ptr<FarnebackOpticalFlow> createOptFlow_Farneback();
        export var createOptFlow_Farneback: IcreateOptFlow_Farneback = alvision_module.superres.optical_flow;

        interface IcreateOptFlow_Farneback_CUDA {
            (): FarnebackOpticalFlow;
        }
         //Ptr<FarnebackOpticalFlow> createOptFlow_Farneback_CUDA();


//         Ptr<DenseOpticalFlowExt> createOptFlow_Simple();


        export interface DualTVL1OpticalFlow extends DenseOpticalFlowExt
        {
            /** @see setTau */
            getTau(): _st.double;
            /** @copybrief getTau @see getTau */
            setTau(val: _st.double): void;
            /** @see setLambda */
            getLambda(): _st.double;
            /** @copybrief getLambda @see getLambda */
            setLambda(val: _st.double ): void;
            /** @see setTheta */
            getTheta(): _st.double;
            /** @copybrief getTheta @see getTheta */
            setTheta(val: _st.double): void;
            /** @see setScalesNumber */
            getScalesNumber(): _st.int;
            /** @copybrief getScalesNumber @see getScalesNumber */
            setScalesNumber(val: _st.int ): void;
            /** @see setWarpingsNumber */
            getWarpingsNumber(): _st.int 
            /** @copybrief getWarpingsNumber @see getWarpingsNumber */
            setWarpingsNumber(val: _st.int): void;
            /** @see setEpsilon */
            getEpsilon(): _st.double;
            /** @copybrief getEpsilon @see getEpsilon */
            setEpsilon(val: _st.double): void;
            /** @see setIterations */
            getIterations(): _st.int;
            /** @copybrief getIterations @see getIterations */
            setIterations(val: _st.int)
            /** @see setUseInitialFlow */
             getUseInitialFlow(): boolean;
            /** @copybrief getUseInitialFlow @see getUseInitialFlow */
             setUseInitialFlow(val : boolean): void;
        };
        interface IcreateOptFlow_DualTVL1 {
            (): DualTVL1OpticalFlow;
        }

        export var createOptFlow_DualTVL1: IcreateOptFlow_DualTVL1 = alvision_module.superres.optical_flow.createOptFlow_DualTVL1;

         //Ptr<DualTVL1OpticalFlow> createOptFlow_DualTVL1();

        interface IcreateOptFlow_DualTVL1_CUDA {
            (): DualTVL1OpticalFlow;
        }
         //Ptr<DualTVL1OpticalFlow> createOptFlow_DualTVL1_CUDA();
        export var createOptFlow_DualTVL1_CUDA: IcreateOptFlow_DualTVL1_CUDA = alvision_module.superres.optical_flow.createOptFlow_DualTVL1_CUDA;


        export interface BroxOpticalFlowStatic {
            new (): BroxOpticalFlow;
        }
        export interface  BroxOpticalFlow extends DenseOpticalFlowExt
        {
            //! @brief Flow smoothness
            /** @see setAlpha */
            getAlpha(): _st.double;
            /** @copybrief getAlpha @see getAlpha */
            setAlpha(val: _st.double): void;
            //! @brief Gradient constancy importance
            /** @see setGamma */
            getGamma(): _st.double;
            /** @copybrief getGamma @see getGamma */
            setGamma(val: _st.double): void;
            //! @brief Pyramid scale factor
            /** @see setScaleFactor */
            getScaleFactor(): _st.double;
            /** @copybrief getScaleFactor @see getScaleFactor */
            setScaleFactor(val: _st.double): void;
            //! @brief Number of lagged non-linearity iterations (inner loop)
            /** @see setInnerIterations */
            getInnerIterations(): _st.int;
            /** @copybrief getInnerIterations @see getInnerIterations */
            setInnerIterations(val: _st.int): void;
            //! @brief Number of warping iterations (number of pyramid levels)
            /** @see setOuterIterations */
            getOuterIterations(): _st.int;
            /** @copybrief getOuterIterations @see getOuterIterations */
            setOuterIterations(val: _st.int): void;
            //! @brief Number of linear system solver iterations
            /** @see setSolverIterations */
            getSolverIterations(): _st.int;
            /** @copybrief getSolverIterations @see getSolverIterations */
            setSolverIterations(val: _st.int): void;
        };

        export var BroxOpticalFlow: BroxOpticalFlowStatic = alvision_module.superres.BroxOpticalFlow;

        interface IcreateOptFlow_Brox_CUDA {
            (): BroxOpticalFlow;
        }
         //Ptr<BroxOpticalFlow> createOptFlow_Brox_CUDA();
export var createOptFlow_Brox_CUDA: IcreateOptFlow_Brox_CUDA = alvision_module.superres.optical_flow.createOptFlow_Brox_CUDA;


        export interface PyrLKOpticalFlow extends DenseOpticalFlowExt
        {
            /** @see setWindowSize */
            getWindowSize(): _st.int;
            /** @copybrief getWindowSize @see getWindowSize */
            setWindowSize(val: _st.int ): void;
            /** @see setMaxLevel */
            getMaxLevel(): _st.int;
            /** @copybrief getMaxLevel @see getMaxLevel */
            setMaxLevel(val: _st.int): void;
            /** @see setIterations */
            getIterations(): _st.int;
            /** @copybrief getIterations @see getIterations */
            setIterations(val: _st.int): void;
        };
interface IcreateOptFlow_PyrLK_CUDA {
    (): PyrLKOpticalFlow;
}
         //Ptr<PyrLKOpticalFlow> createOptFlow_PyrLK_CUDA();
export var createOptFlow_PyrLK_CUDA: IcreateOptFlow_PyrLK_CUDA = alvision_module.superres.optical_flow.createOptFlow_PyrLK_CUDA;

//! @}

//    }
//}

//#endif // __OPENCV_SUPERRES_OPTICAL_FLOW_HPP__
