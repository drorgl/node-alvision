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
var alvision_module = require('../../lib/bindings.js');

//import * as _constants from './Constants'
import * as _st from './../static';
import * as _mat from './../Mat';
import * as _types from './../Types';
import * as _core from './../Core';
import * as _base from './../Base';
import * as _cuda from './../cuda';
import * as _imgproc from './../imgproc';
import * as _persistence from './../persistence';


//#ifndef __OPENCV_CUDAIMGPROC_HPP__
//#define __OPENCV_CUDAIMGPROC_HPP__
//
//#ifndef __cplusplus
//#  error cudaimgproc.hpp header must be compiled as C++
//#endif
//
//#include "opencv2/core/cuda.hpp"
//#include "opencv2/imgproc.hpp"

/**
  @addtogroup cuda
  @{
    @defgroup cudaimgproc Image Processing
    @{
      @defgroup cudaimgproc_color Color space processing
      @defgroup cudaimgproc_hist Histogram Calculation
      @defgroup cudaimgproc_hough Hough Transform
      @defgroup cudaimgproc_feature Feature Detection
    @}
  @}
*/

//namespace cv {
export namespace cudaimgproc {

    //! @addtogroup cudaimgproc
    //! @{

    /////////////////////////// Color Processing ///////////////////////////

    //! @addtogroup cudaimgproc_color
    //! @{

    /** @brief Converts an image from one color space to another.
    
    @param src Source image with CV_8U , CV_16U , or CV_32F depth and 1, 3, or 4 channels.
    @param dst Destination image.
    @param code Color space conversion code. For details, see cvtColor .
    @param dcn Number of channels in the destination image. If the parameter is 0, the number of the
    channels is derived automatically from src and the code .
    @param stream Stream for the asynchronous version.
    
    3-channel color spaces (like HSV, XYZ, and so on) can be stored in a 4-channel image for better
    performance.
    
    @sa cvtColor
     */
    interface IcvtColor {
        (src: _st.InputArray, dst: _st.OutputArray, code: _imgproc.ColorConversionCodes | _st.int, dcn?: _st.int /* = 0*/, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
    }
    export var cvtColor: IcvtColor = alvision_module.cvtColor;
    //CV_EXPORTS void cvtColor(InputArray src, OutputArray dst, int code, int dcn = 0, Stream& stream = Stream::Null());

    export enum DemosaicTypes {
        //! Bayer Demosaicing (Malvar, He, and Cutler)
        COLOR_BayerBG2BGR_MHT = 256,
        COLOR_BayerGB2BGR_MHT = 257,
        COLOR_BayerRG2BGR_MHT = 258,
        COLOR_BayerGR2BGR_MHT = 259,

        COLOR_BayerBG2RGB_MHT = COLOR_BayerRG2BGR_MHT,
        COLOR_BayerGB2RGB_MHT = COLOR_BayerGR2BGR_MHT,
        COLOR_BayerRG2RGB_MHT = COLOR_BayerBG2BGR_MHT,
        COLOR_BayerGR2RGB_MHT = COLOR_BayerGB2BGR_MHT,

        COLOR_BayerBG2GRAY_MHT = 260,
        COLOR_BayerGB2GRAY_MHT = 261,
        COLOR_BayerRG2GRAY_MHT = 262,
        COLOR_BayerGR2GRAY_MHT = 263
    };

    /** @brief Converts an image from Bayer pattern to RGB or grayscale.
    
    @param src Source image (8-bit or 16-bit single channel).
    @param dst Destination image.
    @param code Color space conversion code (see the description below).
    @param dcn Number of channels in the destination image. If the parameter is 0, the number of the
    channels is derived automatically from src and the code .
    @param stream Stream for the asynchronous version.
    
    The function can do the following transformations:
    
    -   Demosaicing using bilinear interpolation
    
        > -   COLOR_BayerBG2GRAY , COLOR_BayerGB2GRAY , COLOR_BayerRG2GRAY , COLOR_BayerGR2GRAY
        > -   COLOR_BayerBG2BGR , COLOR_BayerGB2BGR , COLOR_BayerRG2BGR , COLOR_BayerGR2BGR
    
    -   Demosaicing using Malvar-He-Cutler algorithm (@cite MHT2011)
    
        > -   COLOR_BayerBG2GRAY_MHT , COLOR_BayerGB2GRAY_MHT , COLOR_BayerRG2GRAY_MHT ,
        >     COLOR_BayerGR2GRAY_MHT
        > -   COLOR_BayerBG2BGR_MHT , COLOR_BayerGB2BGR_MHT , COLOR_BayerRG2BGR_MHT ,
        >     COLOR_BayerGR2BGR_MHT
    
    @sa cvtColor
     */

    interface Idemosaicing {
        (src: _st.InputArray, dst: _st.OutputArray, code: _st.int, dcn?: _st.int /* = -1*//*, Stream & stream = Stream::Null()*/): void;
    }

    export var demosaicing: Idemosaicing = alvision_module.demosaicing;

    //CV_EXPORTS void demosaicing(InputArray src, OutputArray dst, int code, int dcn = -1, Stream& stream = Stream::Null());

    /** @brief Exchanges the color channels of an image in-place.
    
    @param image Source image. Supports only CV_8UC4 type.
    @param dstOrder Integer array describing how channel values are permutated. The n-th entry of the
    array contains the number of the channel that is stored in the n-th channel of the output image.
    E.g. Given an RGBA image, aDstOrder = [3,2,1,0] converts this to ABGR channel order.
    @param stream Stream for the asynchronous version.
    
    The methods support arbitrary permutations of the original channels, including replication.
     */

    interface IswapChannels {
        (image: _st.InputOutputArray, dstOrder: Array<_st.int>, stream?: _cuda.cuda.Stream  /* = Stream::Null()*/): void;
    }

    export var swapChannels: IswapChannels = alvision_module.swapChannels;
    //CV_EXPORTS void swapChannels(InputOutputArray image, const int dstOrder[4], Stream& stream = Stream::Null());

    /** @brief Routines for correcting image color gamma.
    
    @param src Source image (3- or 4-channel 8 bit).
    @param dst Destination image.
    @param forward true for forward gamma correction or false for inverse gamma correction.
    @param stream Stream for the asynchronous version.
     */
    //CV_EXPORTS void gammaCorrection(InputArray src, OutputArray dst, bool forward = true, Stream& stream = Stream::Null());

    enum AlphaCompTypes {
        ALPHA_OVER, ALPHA_IN, ALPHA_OUT, ALPHA_ATOP, ALPHA_XOR, ALPHA_PLUS, ALPHA_OVER_PREMUL, ALPHA_IN_PREMUL, ALPHA_OUT_PREMUL,
        ALPHA_ATOP_PREMUL, ALPHA_XOR_PREMUL, ALPHA_PLUS_PREMUL, ALPHA_PREMUL
    };

    /** @brief Composites two images using alpha opacity values contained in each image.
    
    @param img1 First image. Supports CV_8UC4 , CV_16UC4 , CV_32SC4 and CV_32FC4 types.
    @param img2 Second image. Must have the same size and the same type as img1 .
    @param dst Destination image.
    @param alpha_op Flag specifying the alpha-blending operation:
    -   **ALPHA_OVER**
    -   **ALPHA_IN**
    -   **ALPHA_OUT**
    -   **ALPHA_ATOP**
    -   **ALPHA_XOR**
    -   **ALPHA_PLUS**
    -   **ALPHA_OVER_PREMUL**
    -   **ALPHA_IN_PREMUL**
    -   **ALPHA_OUT_PREMUL**
    -   **ALPHA_ATOP_PREMUL**
    -   **ALPHA_XOR_PREMUL**
    -   **ALPHA_PLUS_PREMUL**
    -   **ALPHA_PREMUL**
    @param stream Stream for the asynchronous version.
    
    @note
       -   An example demonstrating the use of alphaComp can be found at
            opencv_source_code/samples/gpu/alpha_comp.cpp
     */
    //CV_EXPORTS void alphaComp(InputArray img1, InputArray img2, OutputArray dst, int alpha_op, Stream& stream = Stream::Null());

    //! @} cudaimgproc_color

    ////////////////////////////// Histogram ///////////////////////////////

    //! @addtogroup cudaimgproc_hist
    //! @{

    /** @brief Calculates histogram for one channel 8-bit image.
    
    @param src Source image with CV_8UC1 type.
    @param hist Destination histogram with one row, 256 columns, and the CV_32SC1 type.
    @param stream Stream for the asynchronous version.
     */
    interface IcalcHist {
        (src: _st.InputArray, hist: _st.OutputArray, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
    }
    export var calcHist: IcalcHist = alvision_module.cuda.calcHist;
    //CV_EXPORTS void calcHist(InputArray src, OutputArray hist, Stream& stream = Stream::Null());

    /** @brief Equalizes the histogram of a grayscale image.
    
    @param src Source image with CV_8UC1 type.
    @param dst Destination image.
    @param stream Stream for the asynchronous version.
    
    @sa equalizeHist
     */
    interface IequalizeHist {
        (src: _st.InputArray, dst: _st.OutputArray, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
    }
    export var equalizeHist: IequalizeHist = alvision_module.cuda.equalizeHist;
    //CV_EXPORTS void equalizeHist(InputArray src, OutputArray dst, Stream& stream = Stream::Null());

    /** @brief Base class for Contrast Limited Adaptive Histogram Equalization. :
     */
    interface CLAHE extends _imgproc.CLAHE {
        //public:
        //  using cv::CLAHE::apply;
        /** @brief Equalizes the histogram of a grayscale image using Contrast Limited Adaptive Histogram Equalization.
    
        @param src Source image with CV_8UC1 type.
        @param dst Destination image.
        @param stream Stream for the asynchronous version.
         */
        apply(src: _st.InputArray, dst: _st.OutputArray): void;
        apply(src: _st.InputArray, dst: _st.OutputArray, stream: _cuda.cuda.Stream): void;
    };

    /** @brief Creates implementation for cuda::CLAHE .
    
    @param clipLimit Threshold for contrast limiting.
    @param tileGridSize Size of grid for histogram equalization. Input image will be divided into
    equally sized rectangular tiles. tileGridSize defines the number of tiles in row and column.
     */
    interface IcreateCLAHE {
        (clipLimit?: _st.double /* = 40.0*/, tileGridSize?: _types.Size /* = Size(8, 8)*/): CLAHE;
    }
    export var createCLAHE: IcreateCLAHE = alvision_module.cuda.createCLAHE;
    //CV_EXPORTS Ptr<cuda::CLAHE> createCLAHE(double clipLimit = 40.0, Size tileGridSize = Size(8, 8));

    /** @brief Computes levels with even distribution.
    
    @param levels Destination array. levels has 1 row, nLevels columns, and the CV_32SC1 type.
    @param nLevels Number of computed levels. nLevels must be at least 2.
    @param lowerLevel Lower boundary value of the lowest level.
    @param upperLevel Upper boundary value of the greatest level.
    @param stream Stream for the asynchronous version.
     */
    //CV_EXPORTS void evenLevels(OutputArray levels, int nLevels, int lowerLevel, int upperLevel, Stream& stream = Stream::Null());

    /** @brief Calculates a histogram with evenly distributed bins.
    
    @param src Source image. CV_8U, CV_16U, or CV_16S depth and 1 or 4 channels are supported. For
    a four-channel image, all channels are processed separately.
    @param hist Destination histogram with one row, histSize columns, and the CV_32S type.
    @param histSize Size of the histogram.
    @param lowerLevel Lower boundary of lowest-level bin.
    @param upperLevel Upper boundary of highest-level bin.
    @param stream Stream for the asynchronous version.
     */

    interface IhistEven {
        (src: _st.InputArray, hist: _st.OutputArray, histSize: _st.int, lowerLevel: _st.int, upperLevel: _st.int, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
        (src: _st.InputArray, hist: Array<_cuda.cuda.GpuMat>, histSize: Array<_st.int>, lowerLevel: Array<_st.int>, upperLevel: Array<_st.int>, stream?: _cuda.cuda.Stream /* = Stream::Null()*/);
    }

    export var histEven: IhistEven = alvision_module.cuda.histEven;
    //CV_EXPORTS void histEven(InputArray src, OutputArray hist, int histSize, int lowerLevel, int upperLevel, Stream& stream = Stream::Null());
    /** @overload */
    //CV_EXPORTS void histEven(InputArray src, GpuMat hist[4], int histSize[4], int lowerLevel[4], int upperLevel[4], Stream& stream = Stream::Null());

    /** @brief Calculates a histogram with bins determined by the levels array.
    
    @param src Source image. CV_8U , CV_16U , or CV_16S depth and 1 or 4 channels are supported.
    For a four-channel image, all channels are processed separately.
    @param hist Destination histogram with one row, (levels.cols-1) columns, and the CV_32SC1 type.
    @param levels Number of levels in the histogram.
    @param stream Stream for the asynchronous version.
     */
    //CV_EXPORTS void histRange(InputArray src, OutputArray hist, InputArray levels, Stream& stream = Stream::Null());
    /** @overload */
    //CV_EXPORTS void histRange(InputArray src, GpuMat hist[4], const GpuMat levels[4], Stream& stream = Stream::Null());

    //! @} cudaimgproc_hist

    //////////////////////////////// Canny ////////////////////////////////

    /** @brief Base class for Canny Edge Detector. :
     */
    interface CannyEdgeDetector extends _core.Algorithm {
        //public:
        /** @brief Finds edges in an image using the @cite Canny86 algorithm.
    
        @param image Single-channel 8-bit input image.
        @param edges Output edge map. It has the same size and type as image.
        @param stream Stream for the asynchronous version.
         */
        detect(image: _st.InputArray, edges: _st.OutputArray, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
        /** @overload
        @param dx First derivative of image in the vertical direction. Support only CV_32S type.
        @param dy First derivative of image in the horizontal direction. Support only CV_32S type.
        @param edges Output edge map. It has the same size and type as image.
        @param stream Stream for the asynchronous version.
        */
        detect(dx: _st.InputArray, dy: _st.InputArray, edges: _st.OutputArray, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;

        setLowThreshold(low_thresh: _st.double): void;
        getLowThreshold(): _st.double;

        setHighThreshold(high_thresh: _st.double): void;
        getHighThreshold(): _st.double;

        setAppertureSize(apperture_size: _st.int): void;
        getAppertureSize(): _st.int;

        setL2Gradient(L2gradient: boolean): void;
        getL2Gradient(): boolean;
    };

    /** @brief Creates implementation for cuda::CannyEdgeDetector .
    
    @param low_thresh First threshold for the hysteresis procedure.
    @param high_thresh Second threshold for the hysteresis procedure.
    @param apperture_size Aperture size for the Sobel operator.
    @param L2gradient Flag indicating whether a more accurate \f$L_2\f$ norm
    \f$=\sqrt{(dI/dx)^2 + (dI/dy)^2}\f$ should be used to compute the image gradient magnitude (
    L2gradient=true ), or a faster default \f$L_1\f$ norm \f$=|dI/dx|+|dI/dy|\f$ is enough ( L2gradient=false
    ).
     */
    interface IcreateCannyEdgeDetector {
        (low_thresh: _st.double, high_thresh: _st.double, apperture_size?: _st.int /* = 3*/, L2gradient?: boolean /* = false*/): CannyEdgeDetector;
    }
    export var createCannyEdgeDetector: IcreateCannyEdgeDetector = alvision_module.cuda.createCannyEdgeDetector;

    //CV_EXPORTS Ptr<CannyEdgeDetector> createCannyEdgeDetector(double low_thresh, double high_thresh, int apperture_size = 3, bool L2gradient = false);

    /////////////////////////// Hough Transform ////////////////////////////

    //////////////////////////////////////
    // HoughLines

    //! @addtogroup cudaimgproc_hough
    //! @{

    /** @brief Base class for lines detector algorithm. :
     */
    interface HoughLinesDetector extends _core.Algorithm {
        //public:
        /** @brief Finds lines in a binary image using the classical Hough transform.
    
        @param src 8-bit, single-channel binary source image.
        @param lines Output vector of lines. Each line is represented by a two-element vector
        \f$(\rho, \theta)\f$ . \f$\rho\f$ is the distance from the coordinate origin \f$(0,0)\f$ (top-left corner of
        the image). \f$\theta\f$ is the line rotation angle in radians (
        \f$0 \sim \textrm{vertical line}, \pi/2 \sim \textrm{horizontal line}\f$ ).
        @param stream Stream for the asynchronous version.
    
        @sa HoughLines
         */
        detect(src: _st.InputArray, lines: _st.OutputArray, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
    
        /** @brief Downloads results from cuda::HoughLinesDetector::detect to host memory.
    
        @param d_lines Result of cuda::HoughLinesDetector::detect .
        @param h_lines Output host array.
        @param h_votes Optional output array for line's votes.
        @param stream Stream for the asynchronous version.
         */
        downloadResults(d_lines: _st.InputArray, h_lines: _st.OutputArray, h_votes?: _st.OutputArray /*= noArray()*/, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;

        setRho(rho: _st.float): void;
        getRho(): _st.float;

        setTheta(theta: _st.float): void;
        getTheta(): _st.float

        setThreshold(threshold: _st.int): void;
        getThreshold(): _st.int;

        setDoSort(doSort: boolean): void;
        getDoSort(): boolean;

        setMaxLines(maxLines: _st.int): void;
        getMaxLines(): _st.int;
    };

    /** @brief Creates implementation for cuda::HoughLinesDetector .
    
    @param rho Distance resolution of the accumulator in pixels.
    @param theta Angle resolution of the accumulator in radians.
    @param threshold Accumulator threshold parameter. Only those lines are returned that get enough
    votes ( \f$>\texttt{threshold}\f$ ).
    @param doSort Performs lines sort by votes.
    @param maxLines Maximum number of output lines.
     */
    interface IcreateHoughLinesDetector {
        (rho: _st.float, theta: _st.float, threshold: _st.int, doSort?: boolean/* = false*/, maxLines?: _st.int /* = 4096*/): HoughLinesDetector;
    }
    export var createHoughLinesDetector: IcreateHoughLinesDetector = alvision_module.cuda.createHoughLinesDetector;
    //CV_EXPORTS Ptr<HoughLinesDetector> createHoughLinesDetector(float rho, float theta, int threshold, bool doSort = false, int maxLines = 4096);


    //////////////////////////////////////
    // HoughLinesP

    /** @brief Base class for line segments detector algorithm. :
     */
    //class CV_EXPORTS HoughSegmentDetector : public Algorithm
    //{
    //public:
    //    /** @brief Finds line segments in a binary image using the probabilistic Hough transform.
    //
    //    @param src 8-bit, single-channel binary source image.
    //    @param lines Output vector of lines. Each line is represented by a 4-element vector
    //    \f$(x_1, y_1, x_2, y_2)\f$ , where \f$(x_1,y_1)\f$ and \f$(x_2, y_2)\f$ are the ending points of each detected
    //    line segment.
    //    @param stream Stream for the asynchronous version.
    //
    //    @sa HoughLinesP
    //     */
    //    virtual void detect(InputArray src, OutputArray lines, Stream& stream = Stream::Null()) = 0;
    //
    //    virtual void setRho(float rho) = 0;
    //    virtual float getRho() const = 0;
    //
    //    virtual void setTheta(float theta) = 0;
    //    virtual float getTheta() const = 0;
    //
    //    virtual void setMinLineLength(int minLineLength) = 0;
    //    virtual int getMinLineLength() const = 0;
    //
    //    virtual void setMaxLineGap(int maxLineGap) = 0;
    //    virtual int getMaxLineGap() const = 0;
    //
    //    virtual void setMaxLines(int maxLines) = 0;
    //    virtual int getMaxLines() const = 0;
    //};

    /** @brief Creates implementation for cuda::HoughSegmentDetector .
    
    @param rho Distance resolution of the accumulator in pixels.
    @param theta Angle resolution of the accumulator in radians.
    @param minLineLength Minimum line length. Line segments shorter than that are rejected.
    @param maxLineGap Maximum allowed gap between points on the same line to link them.
    @param maxLines Maximum number of output lines.
     */
    //CV_EXPORTS Ptr<HoughSegmentDetector> createHoughSegmentDetector(float rho, float theta, int minLineLength, int maxLineGap, int maxLines = 4096);

    //////////////////////////////////////
    // HoughCircles

    /** @brief Base class for circles detector algorithm. :
     */
    interface HoughCirclesDetector extends _core.Algorithm {
        //public:
        /** @brief Finds circles in a grayscale image using the Hough transform.
    
        @param src 8-bit, single-channel grayscale input image.
        @param circles Output vector of found circles. Each vector is encoded as a 3-element
        floating-point vector \f$(x, y, radius)\f$ .
        @param stream Stream for the asynchronous version.
    
        @sa HoughCircles
         */
        detect(src: _st.InputArray, circles: _st.OutputArray, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;

        setDp(dp: _st.float): void;
        getDp(): _st.float;

        setMinDist(minDist: _st.float): void;
        getMinDist(): _st.float;

        setCannyThreshold(cannyThreshold: _st.int): void;
        getCannyThreshold(): _st.int;

        setVotesThreshold(votesThreshold: _st.int): void;
        getVotesThreshold(): _st.int;

        setMinRadius(minRadius: _st.int): void;
        getMinRadius(): _st.int;

        setMaxRadius(maxRadius: _st.int): void;
        getMaxRadius(): _st.int;

        setMaxCircles(maxCircles: _st.int): void;
        getMaxCircles(): _st.int;
    };

    /** @brief Creates implementation for cuda::HoughCirclesDetector .
    
    @param dp Inverse ratio of the accumulator resolution to the image resolution. For example, if
    dp=1 , the accumulator has the same resolution as the input image. If dp=2 , the accumulator has
    half as big width and height.
    @param minDist Minimum distance between the centers of the detected circles. If the parameter is
    too small, multiple neighbor circles may be falsely detected in addition to a true one. If it is
    too large, some circles may be missed.
    @param cannyThreshold The higher threshold of the two passed to Canny edge detector (the lower one
    is twice smaller).
    @param votesThreshold The accumulator threshold for the circle centers at the detection stage. The
    smaller it is, the more false circles may be detected.
    @param minRadius Minimum circle radius.
    @param maxRadius Maximum circle radius.
    @param maxCircles Maximum number of output circles.
     */
    interface IcreateHoughCirclesDetector {
        (dp: _st.float, minDist: _st.float, cannyThreshold: _st.int, votesThreshold: _st.int, minRadius: _st.int, maxRadius: _st.int, maxCircles?: _st.int /* = 4096*/): HoughCirclesDetector;
    }
    export var createHoughCirclesDetector: IcreateHoughCirclesDetector = alvision_module.cuda.createHoughCirclesDetector;
    //CV_EXPORTS Ptr<HoughCirclesDetector> createHoughCirclesDetector(float dp, float minDist, int cannyThreshold, int votesThreshold, int minRadius, int maxRadius, int maxCircles = 4096);

    //////////////////////////////////////
    // GeneralizedHough

    /** @brief Creates implementation for generalized hough transform from @cite Ballard1981 .
     */
    interface IcreateGeneralizedHoughBallard {
        (): _imgproc.GeneralizedHoughBallard
    }
    export var createGeneralizedHoughBallard: IcreateGeneralizedHoughBallard = alvision_module.cuda.createGeneralizedHoughBallard;
    //CV_EXPORTS Ptr<GeneralizedHoughBallard> createGeneralizedHoughBallard();

    /** @brief Creates implementation for generalized hough transform from @cite Guil1999 .
     */
    //CV_EXPORTS Ptr<GeneralizedHoughGuil> createGeneralizedHoughGuil();

    //! @} cudaimgproc_hough

    ////////////////////////// Corners Detection ///////////////////////////

    //! @addtogroup cudaimgproc_feature
    //! @{

    /** @brief Base class for Cornerness Criteria computation. :
     */
    interface CornernessCriteria extends _core.Algorithm {
        //public:
        /** @brief Computes the cornerness criteria at each image pixel.
    
        @param src Source image.
        @param dst Destination image containing cornerness values. It will have the same size as src and
        CV_32FC1 type.
        @param stream Stream for the asynchronous version.
         */
        compute(src: _st.InputArray, dst: _st.OutputArray, stream?: _cuda.cuda.Stream  /*= Stream::Null()*/): void;
    };

    /** @brief Creates implementation for Harris cornerness criteria.
    
    @param srcType Input source type. Only CV_8UC1 and CV_32FC1 are supported for now.
    @param blockSize Neighborhood size.
    @param ksize Aperture parameter for the Sobel operator.
    @param k Harris detector free parameter.
    @param borderType Pixel extrapolation method. Only BORDER_REFLECT101 and BORDER_REPLICATE are
    supported for now.
    
    @sa cornerHarris
     */
    interface IcreateHarrisCorner {
        (srcType: _st.int, blockSize: _st.int, ksize: _st.int, k: _st.double, borderType?: _st.int /* = BORDER_REFLECT101*/): CornernessCriteria;
    }
    export var createHarrisCorner: IcreateHarrisCorner = alvision_module.cuda.createHarrisCorner;
    //CV_EXPORTS Ptr<CornernessCriteria> createHarrisCorner(int srcType, int blockSize, int ksize, double k, int borderType = BORDER_REFLECT101);

    /** @brief Creates implementation for the minimum eigen value of a 2x2 derivative covariation matrix (the
    cornerness criteria).
    
    @param srcType Input source type. Only CV_8UC1 and CV_32FC1 are supported for now.
    @param blockSize Neighborhood size.
    @param ksize Aperture parameter for the Sobel operator.
    @param borderType Pixel extrapolation method. Only BORDER_REFLECT101 and BORDER_REPLICATE are
    supported for now.
    
    @sa cornerMinEigenVal
     */
    interface IcreateMinEigenValCorner {
        (srcType: _st.int, blockSize: _st.int, ksize: _st.int, borderType?: _st.int /* = BORDER_REFLECT101*/): CornernessCriteria;
    }
    export var createMinEigenValCorner: IcreateMinEigenValCorner = alvision_module.cuda.createMinEigenValCorner;
    //CV_EXPORTS Ptr<CornernessCriteria> createMinEigenValCorner(int srcType, int blockSize, int ksize, int borderType = BORDER_REFLECT101);

    ////////////////////////// Corners Detection ///////////////////////////

    /** @brief Base class for Corners Detector. :
     */
    interface CornersDetector extends _core.Algorithm {
        //public:
        /** @brief Determines strong corners on an image.
    
        @param image Input 8-bit or floating-point 32-bit, single-channel image.
        @param corners Output vector of detected corners (1-row matrix with CV_32FC2 type with corners
        positions).
        @param mask Optional region of interest. If the image is not empty (it needs to have the type
        CV_8UC1 and the same size as image ), it specifies the region in which the corners are detected.
        @param stream Stream for the asynchronous version.
         */
        detect(image: _st.InputArray, corners: _st.OutputArray, mask?: _st.InputArray /* = noArray()*/, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
    };

    /** @brief Creates implementation for cuda::CornersDetector .
    
    @param srcType Input source type. Only CV_8UC1 and CV_32FC1 are supported for now.
    @param maxCorners Maximum number of corners to return. If there are more corners than are found,
    the strongest of them is returned.
    @param qualityLevel Parameter characterizing the minimal accepted quality of image corners. The
    parameter value is multiplied by the best corner quality measure, which is the minimal eigenvalue
    (see cornerMinEigenVal ) or the Harris function response (see cornerHarris ). The corners with the
    quality measure less than the product are rejected. For example, if the best corner has the
    quality measure = 1500, and the qualityLevel=0.01 , then all the corners with the quality measure
    less than 15 are rejected.
    @param minDistance Minimum possible Euclidean distance between the returned corners.
    @param blockSize Size of an average block for computing a derivative covariation matrix over each
    pixel neighborhood. See cornerEigenValsAndVecs .
    @param useHarrisDetector Parameter indicating whether to use a Harris detector (see cornerHarris)
    or cornerMinEigenVal.
    @param harrisK Free parameter of the Harris detector.
     */
    interface IcreateGoodFeaturesToTrackDetector {
        (srcType: _st.int, maxCorners?: _st.int /* = 1000*/, qualityLevel?: _st.double /* = 0.01*/, minDistance?: _st.double /* = 0.0*/,
            blockSize?: _st.int /* = 3*/, useHarrisDetector?: boolean /* = false*/, harrisK?: _st.double /* = 0.04*/): CornersDetector;
    }
    export var createGoodFeaturesToTrackDetector: IcreateGoodFeaturesToTrackDetector = alvision_module.cuda.createGoodFeaturesToTrackDetector;

    //CV_EXPORTS Ptr<CornersDetector> createGoodFeaturesToTrackDetector(int srcType, int maxCorners = 1000, double qualityLevel = 0.01, double minDistance = 0.0,
    //                                                                  int blockSize = 3, bool useHarrisDetector = false, double harrisK = 0.04);

    //! @} cudaimgproc_feature


    ///////////////////////////// Mean Shift //////////////////////////////

    /** @brief Performs mean-shift filtering for each point of the source image.
    
    @param src Source image. Only CV_8UC4 images are supported for now.
    @param dst Destination image containing the color of mapped points. It has the same size and type
    as src .
    @param sp Spatial window radius.
    @param sr Color window radius.
    @param criteria Termination criteria. See TermCriteria.
    @param stream Stream for the asynchronous version.
    
    It maps each point of the source image into another point. As a result, you have a new color and new
    position of each point.
     */
    interface ImeanShiftFiltering {
        (src: _st.InputArray, dst: _st.OutputArray, sp: _st.int, sr: _st.int ,
            criteria?: _types.TermCriteria /* = TermCriteria(TermCriteria::MAX_ITER + TermCriteria::EPS, 5, 1)*/,
            stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
    }
    export var meanShiftFiltering: ImeanShiftFiltering = alvision_module.cuda.meanShiftFiltering;
    //CV_EXPORTS void meanShiftFiltering(InputArray src, OutputArray dst, int sp, int sr,
    //                                   TermCriteria criteria = TermCriteria(TermCriteria::MAX_ITER + TermCriteria::EPS, 5, 1),
    //                                   Stream& stream = Stream::Null());

    /** @brief Performs a mean-shift procedure and stores information about processed points (their colors and
    positions) in two images.
    
    @param src Source image. Only CV_8UC4 images are supported for now.
    @param dstr Destination image containing the color of mapped points. The size and type is the same
    as src .
    @param dstsp Destination image containing the position of mapped points. The size is the same as
    src size. The type is CV_16SC2 .
    @param sp Spatial window radius.
    @param sr Color window radius.
    @param criteria Termination criteria. See TermCriteria.
    @param stream Stream for the asynchronous version.
    
    @sa cuda::meanShiftFiltering
     */
    interface ImeanShiftProc {
        (src: _st.InputArray, dstr: _st.OutputArray, dstsp: _st.OutputArray, sp: _st.int, sr: _st.int ,
            criteria?: _types.TermCriteria /* = TermCriteria(TermCriteria::MAX_ITER + TermCriteria::EPS, 5, 1)*/,
            stream?: _cuda.cuda.Stream /*  = Stream::Null()*/) : void;
    }
    export var meanShiftProc: ImeanShiftProc = alvision_module.cuda.meanShiftProc;
    //CV_EXPORTS void meanShiftProc(InputArray src, OutputArray dstr, OutputArray dstsp, int sp, int sr,
    //                              TermCriteria criteria = TermCriteria(TermCriteria::MAX_ITER + TermCriteria::EPS, 5, 1),
    //                              Stream& stream = Stream::Null());

    /** @brief Performs a mean-shift segmentation of the source image and eliminates small segments.
    
    @param src Source image. Only CV_8UC4 images are supported for now.
    @param dst Segmented image with the same size and type as src (host memory).
    @param sp Spatial window radius.
    @param sr Color window radius.
    @param minsize Minimum segment size. Smaller segments are merged.
    @param criteria Termination criteria. See TermCriteria.
    @param stream Stream for the asynchronous version.
     */
    interface ImeanShiftSegmentation {
        (src: _st.InputArray, dst: _st.OutputArray, sp: _st.int, sr: _st.int, minsize: _st.int ,
            criteria?: _types.TermCriteria /* = TermCriteria(TermCriteria::MAX_ITER + TermCriteria::EPS, 5, 1)*/,
            stream?: _cuda.cuda.Stream /* = Stream::Null()*/) : void;
    }
    export var meanShiftSegmentation: ImeanShiftSegmentation = alvision_module.cuda.meanShiftSegmentation;
    //CV_EXPORTS void meanShiftSegmentation(InputArray src, OutputArray dst, int sp, int sr, int minsize,
    //                                      TermCriteria criteria = TermCriteria(TermCriteria::MAX_ITER + TermCriteria::EPS, 5, 1),
    //                                      Stream& stream = Stream::Null());

    /////////////////////////// Match Template ////////////////////////////

    /** @brief Base class for Template Matching. :
     */
    interface TemplateMatching  extends _core.Algorithm
    {
    //public:
        /** @brief Computes a proximity map for a raster template and an image where the template is searched for.
    
        @param image Source image.
        @param templ Template image with the size and type the same as image .
        @param result Map containing comparison results ( CV_32FC1 ). If image is *W x H* and templ is *w
        x h*, then result must be *W-w+1 x H-h+1*.
        @param stream Stream for the asynchronous version.
         */
        match(image: _st.InputArray, templ: _st.InputArray, result: _st.OutputArray, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
    };

    /** @brief Creates implementation for cuda::TemplateMatching .
    
    @param srcType Input source type. CV_32F and CV_8U depth images (1..4 channels) are supported
    for now.
    @param method Specifies the way to compare the template with the image.
    @param user_block_size You can use field user_block_size to set specific block size. If you
    leave its default value Size(0,0) then automatic estimation of block size will be used (which is
    optimized for speed). By varying user_block_size you can reduce memory requirements at the cost
    of speed.
    
    The following methods are supported for the CV_8U depth images for now:
    
    -   CV_TM_SQDIFF
    -   CV_TM_SQDIFF_NORMED
    -   CV_TM_CCORR
    -   CV_TM_CCORR_NORMED
    -   CV_TM_CCOEFF
    -   CV_TM_CCOEFF_NORMED
    
    The following methods are supported for the CV_32F images for now:
    
    -   CV_TM_SQDIFF
    -   CV_TM_CCORR
    
    @sa matchTemplate
     */
    interface IcreateTemplateMatching {
        (srcType: _st.int, method: _st.int, user_block_size?: _types.Size /* = Size()*/): TemplateMatching;
    }
    export var createTemplateMatching: IcreateTemplateMatching = alvision_module.cuda.createTemplateMatching;
    //CV_EXPORTS Ptr<TemplateMatching> createTemplateMatching(int srcType, int method, Size user_block_size = Size());

    ////////////////////////// Bilateral Filter ///////////////////////////

    /** @brief Performs bilateral filtering of passed image
    
    @param src Source image. Supports only (channles != 2 && depth() != CV_8S && depth() != CV_32S
    && depth() != CV_64F).
    @param dst Destination imagwe.
    @param kernel_size Kernel window size.
    @param sigma_color Filter sigma in the color space.
    @param sigma_spatial Filter sigma in the coordinate space.
    @param borderMode Border type. See borderInterpolate for details. BORDER_REFLECT101 ,
    BORDER_REPLICATE , BORDER_CONSTANT , BORDER_REFLECT and BORDER_WRAP are supported for now.
    @param stream Stream for the asynchronous version.
    
    @sa bilateralFilter
     */
    interface IbilateralFilter {
        (src: _st.InputArray, dst: _st.OutputArray, kernel_size: _st.int, sigma_color: _st.float, sigma_spatial: _st.float,
            borderMode?: _base.BorderTypes | _st.int /* = BORDER_DEFAULT*/, stream?: _cuda.cuda.Stream /* = Stream::Null()*/): void;
    }
    export var bilateralFilter: IbilateralFilter = alvision_module.cuda.bilateralFilter;

    //CV_EXPORTS void bilateralFilter(InputArray src, OutputArray dst, int kernel_size, float sigma_color, float sigma_spatial,
    //                                int borderMode = BORDER_DEFAULT, Stream& stream = Stream::Null());

    ///////////////////////////// Blending ////////////////////////////////

    /** @brief Performs linear blending of two images.
    
    @param img1 First image. Supports only CV_8U and CV_32F depth.
    @param img2 Second image. Must have the same size and the same type as img1 .
    @param weights1 Weights for first image. Must have tha same size as img1 . Supports only CV_32F
    type.
    @param weights2 Weights for second image. Must have tha same size as img2 . Supports only CV_32F
    type.
    @param result Destination image.
    @param stream Stream for the asynchronous version.
     */
    interface IblendLinear {
        (img1: _st.InputArray, img2: _st.InputArray, weights1: _st.InputArray, weights2: _st.InputArray ,
            result: _st.OutputArray, stream?: _cuda.cuda.Stream /*= Stream::Null()*/): void;
    }

    export var blendLinear: IblendLinear = alvision_module.cuda.blendLinear;

//CV_EXPORTS void blendLinear(InputArray img1, InputArray img2, InputArray weights1, InputArray weights2,
//                            OutputArray result, Stream& stream = Stream::Null());

//! @}

}
//} // namespace cv { namespace cuda {

//#endif /* __OPENCV_CUDAIMGPROC_HPP__ */
