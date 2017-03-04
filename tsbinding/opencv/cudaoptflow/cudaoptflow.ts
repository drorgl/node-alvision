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
import * as _mat from './../mat';
import * as _types from './../types';
import * as _core from './../core';
import * as _base from './../base';
import * as _cuda from './../cuda';
//import * as _scalar from './Scalar'

//#ifndef __OPENCV_CUDAOPTFLOW_HPP__
//#define __OPENCV_CUDAOPTFLOW_HPP__
//
//#ifndef __cplusplus
//#  error cudaoptflow.hpp header must be compiled as C++
//#endif
//
//#include "opencv2/core/cuda.hpp"

/**
  @addtogroup cuda
  @{
    @defgroup cudaoptflow Optical Flow
  @}
 */

//namespace cv {
//export namespace cudaoptflow {

    //! @addtogroup cudaoptflow
    //! @{

    //
    // Interface
    //

    /** @brief Base interface for dense optical flow algorithms.
     */
    interface DenseOpticalFlow extends _core.Algorithm {
        //public:
        /** @brief Calculates a dense optical flow.
    
        @param I0 first input image.
        @param I1 second input image of the same size and the same type as I0.
        @param flow computed flow image that has the same size as I0 and type CV_32FC2.
        @param stream Stream for the asynchronous version.
         */
        calc(I0: _st.InputArray, I1: _st.InputArray, flow: _st.InputOutputArray, stream?: _cuda.Stream /*= Stream::Null()*/): void;
    };

    /** @brief Base interface for sparse optical flow algorithms.
     */
    interface SparseOpticalFlow extends _core.Algorithm {
        //public:
        /** @brief Calculates a sparse optical flow.
    
        @param prevImg First input image.
        @param nextImg Second input image of the same size and the same type as prevImg.
        @param prevPts Vector of 2D points for which the flow needs to be found.
        @param nextPts Output vector of 2D points containing the calculated new positions of input features in the second image.
        @param status Output status vector. Each element of the vector is set to 1 if the
                      flow for the corresponding features has been found. Otherwise, it is set to 0.
        @param err Optional output vector that contains error response for each point (inverse confidence).
        @param stream Stream for the asynchronous version.
         */
        calc(prevImg: _st.InputArray, nextImg: _st.InputArray,
            prevPts: _st.InputArray, nextPts: _st.InputOutputArray,
            status: _st.OutputArray,
            err?: _st.OutputArray /*= cv::noArray()*/,
            stream?: _cuda.Stream /*= Stream::Null()*/): void;
    };

    //
    // BroxOpticalFlow
    //

    /** @brief Class computing the optical flow for two images using Brox et al Optical Flow algorithm (@cite Brox2004).
     */
    interface BroxOpticalFlowStatic {
        create(
            alpha?: _st.double /*= 0.197*/,
            gamma?: _st.double /*= 50.0*/,
            scale_factor?: _st.double /*= 0.8*/,
            inner_iterations?: _st.int /*= 5*/,
            outer_iterations?: _st.int /*= 150*/,
            solver_iterations?: _st.int /*= 10*/): BroxOpticalFlow;

    }

    export interface BroxOpticalFlow extends DenseOpticalFlow {
        //public:
        //    virtual double getFlowSmoothness() const = 0;
        //    virtual void setFlowSmoothness(double alpha) = 0;
        //
        //    virtual double getGradientConstancyImportance() const = 0;
        //    virtual void setGradientConstancyImportance(double gamma) = 0;
        //
        //    virtual double getPyramidScaleFactor() const = 0;
        //    virtual void setPyramidScaleFactor(double scale_factor) = 0;
        //
        //    //! number of lagged non-linearity iterations (inner loop)
        //    virtual int getInnerIterations() const = 0;
        //    virtual void setInnerIterations(int inner_iterations) = 0;
        //
        //    //! number of warping iterations (number of pyramid levels)
        //    virtual int getOuterIterations() const = 0;
        //    virtual void setOuterIterations(int outer_iterations) = 0;
        //
        //    //! number of linear system solver iterations
        //    virtual int getSolverIterations() const = 0;
        //    virtual void setSolverIterations(int solver_iterations) = 0;
        //
    };

    export var BroxOpticalFlow: BroxOpticalFlowStatic = alvision_module.cuda.BroxOpticalFlow;

    //
    // PyrLKOpticalFlow
    //

    /** @brief Class used for calculating a sparse optical flow.
    
    The class can calculate an optical flow for a sparse feature set using the
    iterative Lucas-Kanade method with pyramids.
    
    @sa calcOpticalFlowPyrLK
    
    @note
       -   An example of the Lucas Kanade optical flow algorithm can be found at
            opencv_source_code/samples/gpu/pyrlk_optical_flow.cpp
     */

    interface SparsePyrLKOpticalFlowStatic {
        create(
            winSize?: _types.Size/* = Size(21, 21)*/,
            maxLevel?: _st.int /*= 3*/,
            iters?: _st.int /*= 30*/,
            useInitialFlow?: boolean/*= false*/): SparsePyrLKOpticalFlow

    }
    export interface SparsePyrLKOpticalFlow extends SparseOpticalFlow {
        //public:
        //    virtual Size getWinSize() const = 0;
        //    virtual void setWinSize(Size winSize) = 0;
        //
        //    virtual int getMaxLevel() const = 0;
        //    virtual void setMaxLevel(int maxLevel) = 0;
        //
        //    virtual int getNumIters() const = 0;
        //    virtual void setNumIters(int iters) = 0;
        //
        //    virtual bool getUseInitialFlow() const = 0;
        //    virtual void setUseInitialFlow(bool useInitialFlow) = 0;
        //
    };

    export var SparsePyrLKOpticalFlow: SparsePyrLKOpticalFlowStatic = alvision_module.cuda.SparsePyrLKOpticalFlow;

    /** @brief Class used for calculating a dense optical flow.
    
    The class can calculate an optical flow for a dense optical flow using the
    iterative Lucas-Kanade method with pyramids.
     */

    interface DensePyrLKOpticalFlowStatic {
        create(
            winSize?: _types.Size /*= Size(13, 13)*/,
            maxLevel?: _st.int /*  = 3*/,
            iters?: _st.int /* = 30*/,
            useInitialFlow?: boolean /*  = false*/
        ): DensePyrLKOpticalFlow;
        //    static Ptr<DensePyrLKOpticalFlow> create(
        //            Size winSize = Size(13, 13),
        //            int maxLevel = 3,
        //            int iters = 30,
        //            bool useInitialFlow = false);
    }
    export interface DensePyrLKOpticalFlow extends DenseOpticalFlow {
        //public:
        //    virtual Size getWinSize() const = 0;
        //    virtual void setWinSize(Size winSize) = 0;
        //
        //    virtual int getMaxLevel() const = 0;
        //    virtual void setMaxLevel(int maxLevel) = 0;
        //
        //    virtual int getNumIters() const = 0;
        //    virtual void setNumIters(int iters) = 0;
        //
        //    virtual bool getUseInitialFlow() const = 0;
        //    virtual void setUseInitialFlow(bool useInitialFlow) = 0;
        //
        
    };

export var DensePyrLKOpticalFlow: DensePyrLKOpticalFlowStatic = alvision_module.cuda.DensePyrLKOpticalFlow;

    //
    // FarnebackOpticalFlow
    //

    /** @brief Class computing a dense optical flow using the Gunnar Farneback’s algorithm.
     */
    interface FarnebackOpticalFlowStatic {
        create(
            numLevels?: _st.int/*= 5*/,
            pyrScale?: _st.double /*= 0.5*/,
            fastPyramids?: boolean/*= false*/,
            winSize?: _st.int /*= 13*/,
            numIters?: _st.int  /*= 10*/,
            polyN?: _st.int /*= 5*/,
            polySigma?: _st.double /*= 1.1*/,
            flags?: _st.int /*= 0*/): FarnebackOpticalFlow;

    }
    export interface FarnebackOpticalFlow extends DenseOpticalFlow {
        //public:
        getNumLevels(): _st.int;
        setNumLevels(numLevels: _st.int): void;
        //
        getPyrScale(): _st.double;
        setPyrScale(pyrScale: _st.double): void;
        //
        //    virtual bool getFastPyramids() const = 0;
        //    virtual void setFastPyramids(bool fastPyramids) = 0;
        //
        getWinSize(): _st.int;
        setWinSize(winSize: _st.int): void;
        //
        getNumIters(): _st.int;
        setNumIters(numIters: _st.int): void;
        //
        getPolyN(): _st.int;
        setPolyN(polyN: _st.int): void;
        //
        getPolySigma(): _st.double;
        setPolySigma(polySigma: _st.double): void;
        //
        getFlags(): _st.int;
        setFlags(flags: _st.int): void;
        //
    };

    export var FarnebackOpticalFlow: FarnebackOpticalFlowStatic = alvision_module.cuda.FarnebackOpticalFlow;

    //
    // OpticalFlowDual_TVL1
    //

    /** @brief Implementation of the Zach, Pock and Bischof Dual TV-L1 Optical Flow method.
     *
     * @sa C. Zach, T. Pock and H. Bischof, "A Duality Based Approach for Realtime TV-L1 Optical Flow".
     * @sa Javier Sanchez, Enric Meinhardt-Llopis and Gabriele Facciolo. "TV-L1 Optical Flow Estimation".
     */

    interface OpticalFlowDual_TVL1Static {
        create(
            tau?: _st.double /*= 0.25*/,
            lambda?: _st.double /*= 0.15*/,
            theta?: _st.double /*= 0.3*/,
            nscales?: _st.int /*= 5*/,
            warps?: _st.int /*= 5*/,
            epsilon?: _st.double /*= 0.01*/,
            iterations?: _st.int /*= 300*/,
            scaleStep?: _st.double /*= 0.8*/,
            gamma?: _st.double /*= 0.0*/,
            useInitialFlow?: boolean /*= false*/): OpticalFlowDual_TVL1;
    }
    export interface OpticalFlowDual_TVL1 extends DenseOpticalFlow {
        //public:
        /**
         * Time step of the numerical scheme.
         */
        getTau(): _st.double;
        setTau(tau: _st.double): void;

        /**
         * Weight parameter for the data term, attachment parameter.
         * This is the most relevant parameter, which determines the smoothness of the output.
         * The smaller this parameter is, the smoother the solutions we obtain.
         * It depends on the range of motions of the images, so its value should be adapted to each image sequence.
         */
        getLambda(): _st.double;
        setLambda(lambda: _st.double): void;

        /**
         * Weight parameter for (u - v)^2, tightness parameter.
         * It serves as a link between the attachment and the regularization terms.
         * In theory, it should have a small value in order to maintain both parts in correspondence.
         * The method is stable for a large range of values of this parameter.
         */
        getGamma(): _st.double;
        setGamma(gamma: _st.double): void;

        /**
         * parameter used for motion estimation. It adds a variable allowing for illumination variations
         * Set this parameter to 1. if you have varying illumination.
         * See: Chambolle et al, A First-Order Primal-Dual Algorithm for Convex Problems with Applications to Imaging
         * Journal of Mathematical imaging and vision, may 2011 Vol 40 issue 1, pp 120-145
         */
        getTheta(): _st.double;
        setTheta(theta: _st.double): void;

        /**
         * Number of scales used to create the pyramid of images.
         */
        getNumScales(): _st.int;
        setNumScales(nscales: _st.int): void;

        /**
         * Number of warpings per scale.
         * Represents the number of times that I1(x+u0) and grad( I1(x+u0) ) are computed per scale.
         * This is a parameter that assures the stability of the method.
         * It also affects the running time, so it is a compromise between speed and accuracy.
         */
        getNumWarps(): _st.int;
        setNumWarps(warps: _st.int): void;

        /**
         * Stopping criterion threshold used in the numerical scheme, which is a trade-off between precision and running time.
         * A small value will yield more accurate solutions at the expense of a slower convergence.
         */
        getEpsilon(): _st.double;
        setEpsilon(epsilon: _st.double): void;

        /**
         * Stopping criterion iterations number used in the numerical scheme.
         */
        getNumIterations(): _st.int;
        setNumIterations(iterations: _st.int): void;

        getScaleStep(): _st.double;
        setScaleStep(scaleStep: _st.double): void;

        getUseInitialFlow(): boolean;
        setUseInitialFlow(useInitialFlow: boolean): void;


    };
    export var OpticalFlowDual_TVL1: OpticalFlowDual_TVL1Static = alvision_module.cuda.OpticalFlowDual_TVL1;
    //! @}


    //} // namespace cv { namespace cuda {

    //#endif /* __OPENCV_CUDAOPTFLOW_HPP__ */


    interface IinterpolateFrames {
        (frame0: _cuda.GpuMat, frame1: _cuda.GpuMat,
            fu: _cuda.GpuMat, fv: _cuda.GpuMat,
            bu: _cuda.GpuMat, bv: _cuda.GpuMat,
            pos: _st.float, newFrame: _cuda.GpuMat, buf: _cuda.GpuMat,
            stream?: _cuda.Stream/*= Stream::Null()*/): void;
    }

    export var interpolateFrames: IinterpolateFrames = alvision_module.cuda.interpolateFrames;

    //CV_EXPORTS void interpolateFrames(const GpuMat& frame0, const GpuMat& frame1,
    //const GpuMat& fu, const GpuMat& fv,
    //const GpuMat& bu, const GpuMat& bv,
    //    float pos, GpuMat& newFrame, GpuMat& buf,
    //    Stream& stream = Stream::Null());


//}
