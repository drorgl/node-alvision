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

//#ifndef __OPENCV_TRACKING_HPP__
//#define __OPENCV_TRACKING_HPP__
//
//#include "opencv2/core.hpp"
//#include "opencv2/imgproc.hpp"
//
//namespace cv
//{

//! @addtogroup video_track
//! @{

export enum OPTFLOW{ OPTFLOW_USE_INITIAL_FLOW     = 4,
       OPTFLOW_LK_GET_MIN_EIGENVALS = 8,
       OPTFLOW_FARNEBACK_GAUSSIAN   = 256
     };

/** @brief Finds an object center, size, and orientation.

@param probImage Back projection of the object histogram. See calcBackProject.
@param window Initial search window.
@param criteria Stop criteria for the underlying meanShift.
returns
(in old interfaces) Number of iterations CAMSHIFT took to converge
The function implements the CAMSHIFT object tracking algorithm @cite Bradski98 . First, it finds an
object center using meanShift and then adjusts the window size and finds the optimal rotation. The
function returns the rotated rectangle structure that includes the object position, size, and
orientation. The next position of the search window can be obtained with RotatedRect::boundingRect()

See the OpenCV sample camshiftdemo.c that tracks colored objects.

@note
-   (Python) A sample explaining the camshift tracking algorithm can be found at
    opencv_source_code/samples/python/camshift.py
 */
     interface ICamShift {
         (probImage: _st.InputArray , window : _types.Rect, 
             criteria: _types.TermCriteria ): _types.RotatedRect;
     }

export var CamShift: ICamShift = alvision_module.CamShift;

//CV_EXPORTS_W RotatedRect CamShift( InputArray probImage, CV_IN_OUT Rect& window,
//                                   TermCriteria criteria );

/** @brief Finds an object on a back projection image.

@param probImage Back projection of the object histogram. See calcBackProject for details.
@param window Initial search window.
@param criteria Stop criteria for the iterative search algorithm.
returns
:   Number of iterations CAMSHIFT took to converge.
The function implements the iterative object search algorithm. It takes the input back projection of
an object and the initial position. The mass center in window of the back projection image is
computed and the search window center shifts to the mass center. The procedure is repeated until the
specified number of iterations criteria.maxCount is done or until the window center shifts by less
than criteria.epsilon. The algorithm is used inside CamShift and, unlike CamShift , the search
window size or orientation do not change during the search. You can simply pass the output of
calcBackProject to this function. But better results can be obtained if you pre-filter the back
projection and remove the noise. For example, you can do this by retrieving connected components
with findContours , throwing away contours with small area ( contourArea ), and rendering the
remaining contours with drawContours.

@note
-   A mean-shift tracking sample can be found at opencv_source_code/samples/cpp/camshiftdemo.cpp
 */
interface ImeanShift {
    (probImage: _st.InputArray, window: _types.Rect, criteria: _types.TermCriteria ): _st.int;
}

export var meanShift: ImeanShift = alvision_module.meanShift;

//CV_EXPORTS_W int meanShift( InputArray probImage, CV_IN_OUT Rect& window, TermCriteria criteria );

/** @brief Constructs the image pyramid which can be passed to calcOpticalFlowPyrLK.

@param img 8-bit input image.
@param pyramid output pyramid.
@param winSize window size of optical flow algorithm. Must be not less than winSize argument of
calcOpticalFlowPyrLK. It is needed to calculate required padding for pyramid levels.
@param maxLevel 0-based maximal pyramid level number.
@param withDerivatives set to precompute gradients for the every pyramid level. If pyramid is
constructed without the gradients then calcOpticalFlowPyrLK will calculate them internally.
@param pyrBorder the border mode for pyramid layers.
@param derivBorder the border mode for gradients.
@param tryReuseInputImage put ROI of input image into the pyramid if possible. You can pass false
to force data copying.
@return number of levels in constructed pyramid. Can be less than maxLevel.
 */
interface IbuildOpticalFlowPyramid {
    (img: _st.InputArray, pyramid: _st.OutputArrayOfArrays ,
        winSize: _types.Size, maxLevel: _st.int , withDerivatives?  : boolean /*= true*/,
        pyrBorder?: _base.BorderTypes |  _st.int /*= BORDER_REFLECT_101*/,
        derivBorder?: _base.BorderTypes |_st.int /*= BORDER_CONSTANT*/,
        tryReuseInputImage?  : boolean /*= true*/): _st.int;
}

export var buildOpticalFlowPyramid: IbuildOpticalFlowPyramid = alvision_module.buildOpticalFlowPyramid;

//CV_EXPORTS_W int buildOpticalFlowPyramid( InputArray img, OutputArrayOfArrays pyramid,
//                                          Size winSize, int maxLevel, bool withDerivatives = true,
//                                          int pyrBorder = BORDER_REFLECT_101,
//                                          int derivBorder = BORDER_CONSTANT,
//                                          bool tryReuseInputImage = true );

/** @brief Calculates an optical flow for a sparse feature set using the iterative Lucas-Kanade method with
pyramids.

@param prevImg first 8-bit input image or pyramid constructed by buildOpticalFlowPyramid.
@param nextImg second input image or pyramid of the same size and the same type as prevImg.
@param prevPts vector of 2D points for which the flow needs to be found; point coordinates must be
single-precision floating-point numbers.
@param nextPts output vector of 2D points (with single-precision floating-point coordinates)
containing the calculated new positions of input features in the second image; when
OPTFLOW_USE_INITIAL_FLOW flag is passed, the vector must have the same size as in the input.
@param status output status vector (of unsigned chars); each element of the vector is set to 1 if
the flow for the corresponding features has been found, otherwise, it is set to 0.
@param err output vector of errors; each element of the vector is set to an error for the
corresponding feature, type of the error measure can be set in flags parameter; if the flow wasn't
found then the error is not defined (use the status parameter to find such cases).
@param winSize size of the search window at each pyramid level.
@param maxLevel 0-based maximal pyramid level number; if set to 0, pyramids are not used (single
level), if set to 1, two levels are used, and so on; if pyramids are passed to input then
algorithm will use as many levels as pyramids have but no more than maxLevel.
@param criteria parameter, specifying the termination criteria of the iterative search algorithm
(after the specified maximum number of iterations criteria.maxCount or when the search window
moves by less than criteria.epsilon.
@param flags operation flags:
 -   **OPTFLOW_USE_INITIAL_FLOW** uses initial estimations, stored in nextPts; if the flag is
     not set, then prevPts is copied to nextPts and is considered the initial estimate.
 -   **OPTFLOW_LK_GET_MIN_EIGENVALS** use minimum eigen values as an error measure (see
     minEigThreshold description); if the flag is not set, then L1 distance between patches
     around the original and a moved point, divided by number of pixels in a window, is used as a
     error measure.
@param minEigThreshold the algorithm calculates the minimum eigen value of a 2x2 normal matrix of
optical flow equations (this matrix is called a spatial gradient matrix in @cite Bouguet00), divided
by number of pixels in a window; if this value is less than minEigThreshold, then a corresponding
feature is filtered out and its flow is not processed, so it allows to remove bad points and get a
performance boost.

The function implements a sparse iterative version of the Lucas-Kanade optical flow in pyramids. See
@cite Bouguet00 . The function is parallelized with the TBB library.

@note

-   An example using the Lucas-Kanade optical flow algorithm can be found at
    opencv_source_code/samples/cpp/lkdemo.cpp
-   (Python) An example using the Lucas-Kanade optical flow algorithm can be found at
    opencv_source_code/samples/python/lk_track.py
-   (Python) An example using the Lucas-Kanade tracker for homography matching can be found at
    opencv_source_code/samples/python/lk_homography.py
 */

interface IcalcOpticalFlowPyrLK {
    (prevImg: _st.InputArray, nextImg: _st.InputArray ,
        prevPts: _st.InputArray, nextPts: _st.InputOutputArray ,
        status: _st.OutputArray, err: _st.OutputArray ,
        winSize?: _types.Size /*= Size(21, 21)*/, maxLevel?: _st.int /*= 3*/,
        criteria?: _types.TermCriteria /*= TermCriteria(TermCriteria::COUNT + TermCriteria::EPS, 30, 0.01)*/,
        flags?: _st.int  /*= 0*/, minEigThreshold?: _st.double  /*= 1e-4*/): void;
}

export var calcOpticalFlowPyrLK: IcalcOpticalFlowPyrLK = alvision_module.calcOpticalFlowPyrLK;

//CV_EXPORTS_W void calcOpticalFlowPyrLK( InputArray prevImg, InputArray nextImg,
//                                        InputArray prevPts, InputOutputArray nextPts,
//                                        OutputArray status, OutputArray err,
//                                        Size winSize = Size(21,21), int maxLevel = 3,
//                                        TermCriteria criteria = TermCriteria(TermCriteria::COUNT+TermCriteria::EPS, 30, 0.01),
//                                        int flags = 0, double minEigThreshold = 1e-4 );

/** @brief Computes a dense optical flow using the Gunnar Farneback's algorithm.

@param prev first 8-bit single-channel input image.
@param next second input image of the same size and the same type as prev.
@param flow computed flow image that has the same size as prev and type CV_32FC2.
@param pyr_scale parameter, specifying the image scale (\<1) to build pyramids for each image;
pyr_scale=0.5 means a classical pyramid, where each next layer is twice smaller than the previous
one.
@param levels number of pyramid layers including the initial image; levels=1 means that no extra
layers are created and only the original images are used.
@param winsize averaging window size; larger values increase the algorithm robustness to image
noise and give more chances for fast motion detection, but yield more blurred motion field.
@param iterations number of iterations the algorithm does at each pyramid level.
@param poly_n size of the pixel neighborhood used to find polynomial expansion in each pixel;
larger values mean that the image will be approximated with smoother surfaces, yielding more
robust algorithm and more blurred motion field, typically poly_n =5 or 7.
@param poly_sigma standard deviation of the Gaussian that is used to smooth derivatives used as a
basis for the polynomial expansion; for poly_n=5, you can set poly_sigma=1.1, for poly_n=7, a
good value would be poly_sigma=1.5.
@param flags operation flags that can be a combination of the following:
 -   **OPTFLOW_USE_INITIAL_FLOW** uses the input flow as an initial flow approximation.
 -   **OPTFLOW_FARNEBACK_GAUSSIAN** uses the Gaussian \f$\texttt{winsize}\times\texttt{winsize}\f$
     filter instead of a box filter of the same size for optical flow estimation; usually, this
     option gives z more accurate flow than with a box filter, at the cost of lower speed;
     normally, winsize for a Gaussian window should be set to a larger value to achieve the same
     level of robustness.

The function finds an optical flow for each prev pixel using the @cite Farneback2003 algorithm so that

\f[\texttt{prev} (y,x)  \sim \texttt{next} ( y + \texttt{flow} (y,x)[1],  x + \texttt{flow} (y,x)[0])\f]

@note

-   An example using the optical flow algorithm described by Gunnar Farneback can be found at
    opencv_source_code/samples/cpp/fback.cpp
-   (Python) An example using the optical flow algorithm described by Gunnar Farneback can be
    found at opencv_source_code/samples/python/opt_flow.py
 */

interface IcalcOpticalFlowFarneback {
    (prev: _st.InputArray, next: _st.InputArray, flow: _st.InputOutputArray ,
        pyr_scale: _st.double, levels: _st.int, winsize: _st.int ,
        iterations: _st.int, poly_n: _st.int, poly_sigma: _st.double ,
        flags: _st.int ) : void
}

export var calcOpticalFlowFarneback: IcalcOpticalFlowFarneback = alvision_module.calcOpticalFlowFarneback;
//CV_EXPORTS_W void calcOpticalFlowFarneback( InputArray prev, InputArray next, InputOutputArray flow,
//                                            double pyr_scale, int levels, int winsize,
//                                            int iterations, int poly_n, double poly_sigma,
//                                            int flags );

/** @brief Computes an optimal affine transformation between two 2D point sets.

@param src First input 2D point set stored in std::vector or Mat, or an image stored in Mat.
@param dst Second input 2D point set of the same size and the same type as A, or another image.
@param fullAffine If true, the function finds an optimal affine transformation with no additional
restrictions (6 degrees of freedom). Otherwise, the class of transformations to choose from is
limited to combinations of translation, rotation, and uniform scaling (5 degrees of freedom).

The function finds an optimal affine transform *[A|b]* (a 2 x 3 floating-point matrix) that
approximates best the affine transformation between:

*   Two point sets
*   Two raster images. In this case, the function first finds some features in the src image and
    finds the corresponding features in dst image. After that, the problem is reduced to the first
    case.
In case of point sets, the problem is formulated as follows: you need to find a 2x2 matrix *A* and
2x1 vector *b* so that:

\f[[A^*|b^*] = arg  \min _{[A|b]}  \sum _i  \| \texttt{dst}[i] - A { \texttt{src}[i]}^T - b  \| ^2\f]
where src[i] and dst[i] are the i-th points in src and dst, respectively
\f$[A|b]\f$ can be either arbitrary (when fullAffine=true ) or have a form of
\f[\begin{bmatrix} a_{11} & a_{12} & b_1  \\ -a_{12} & a_{11} & b_2  \end{bmatrix}\f]
when fullAffine=false.

@sa
getAffineTransform, getPerspectiveTransform, findHomography
 */

interface IestimateRigidTransform {
    (src: _st.InputArray, dst: _st.InputArray, fullAffine: boolean): _mat.Mat;
}

export var estimateRigidTransform: IestimateRigidTransform = alvision_module.estimateRigidTransform;

//CV_EXPORTS_W Mat estimateRigidTransform( InputArray src, InputArray dst, bool fullAffine );


enum MOTION
{
    MOTION_TRANSLATION = 0,
    MOTION_EUCLIDEAN   = 1,
    MOTION_AFFINE      = 2,
    MOTION_HOMOGRAPHY  = 3
};

/** @brief Finds the geometric transform (warp) between two images in terms of the ECC criterion @cite EP08 .

@param templateImage single-channel template image; CV_8U or CV_32F array.
@param inputImage single-channel input image which should be warped with the final warpMatrix in
order to provide an image similar to templateImage, same type as temlateImage.
@param warpMatrix floating-point \f$2\times 3\f$ or \f$3\times 3\f$ mapping matrix (warp).
@param motionType parameter, specifying the type of motion:
 -   **MOTION_TRANSLATION** sets a translational motion model; warpMatrix is \f$2\times 3\f$ with
     the first \f$2\times 2\f$ part being the unity matrix and the rest two parameters being
     estimated.
 -   **MOTION_EUCLIDEAN** sets a Euclidean (rigid) transformation as motion model; three
     parameters are estimated; warpMatrix is \f$2\times 3\f$.
 -   **MOTION_AFFINE** sets an affine motion model (DEFAULT); six parameters are estimated;
     warpMatrix is \f$2\times 3\f$.
 -   **MOTION_HOMOGRAPHY** sets a homography as a motion model; eight parameters are
     estimated;\`warpMatrix\` is \f$3\times 3\f$.
@param criteria parameter, specifying the termination criteria of the ECC algorithm;
criteria.epsilon defines the threshold of the increment in the correlation coefficient between two
iterations (a negative criteria.epsilon makes criteria.maxcount the only termination criterion).
Default values are shown in the declaration above.
@param inputMask An optional mask to indicate valid values of inputImage.

The function estimates the optimum transformation (warpMatrix) with respect to ECC criterion
(@cite EP08), that is

\f[\texttt{warpMatrix} = \texttt{warpMatrix} = \arg\max_{W} \texttt{ECC}(\texttt{templateImage}(x,y),\texttt{inputImage}(x',y'))\f]

where

\f[\begin{bmatrix} x' \\ y' \end{bmatrix} = W \cdot \begin{bmatrix} x \\ y \\ 1 \end{bmatrix}\f]

(the equation holds with homogeneous coordinates for homography). It returns the final enhanced
correlation coefficient, that is the correlation coefficient between the template image and the
final warped input image. When a \f$3\times 3\f$ matrix is given with motionType =0, 1 or 2, the third
row is ignored.

Unlike findHomography and estimateRigidTransform, the function findTransformECC implements an
area-based alignment that builds on intensity similarities. In essence, the function updates the
initial transformation that roughly aligns the images. If this information is missing, the identity
warp (unity matrix) should be given as input. Note that if images undergo strong
displacements/rotations, an initial transformation that roughly aligns the images is necessary
(e.g., a simple euclidean/similarity transform that allows for the images showing the same image
content approximately). Use inverse warping in the second image to take an image close to the first
one, i.e. use the flag WARP_INVERSE_MAP with warpAffine or warpPerspective. See also the OpenCV
sample image_alignment.cpp that demonstrates the use of the function. Note that the function throws
an exception if algorithm does not converges.

@sa
estimateRigidTransform, findHomography
 */

interface IfindTransformECC {
    (templateImage: _st.InputArray, inputImage: _st.InputArray ,
        warpMatrix: _st.InputOutputArray, motionType?: MOTION | _st.int /*= MOTION_AFFINE*/,
        criteria?: _types.TermCriteria /*= TermCriteria(TermCriteria::COUNT + TermCriteria::EPS, 50, 0.001)*/,
        inputMask?: _st.InputArray /*= noArray()*/): _st.double;
}

export var findTransformECC: IfindTransformECC = alvision_module.findTransformECC;

//CV_EXPORTS_W double findTransformECC( InputArray templateImage, InputArray inputImage,
//                                      InputOutputArray warpMatrix, int motionType = MOTION_AFFINE,
//                                      TermCriteria criteria = TermCriteria(TermCriteria::COUNT+TermCriteria::EPS, 50, 0.001),
//                                      InputArray inputMask = noArray());

/** @brief Kalman filter class.

The class implements a standard Kalman filter <http://en.wikipedia.org/wiki/Kalman_filter>,
@cite Welch95 . However, you can modify transitionMatrix, controlMatrix, and measurementMatrix to get
an extended Kalman filter functionality. See the OpenCV sample kalman.cpp.

@note

-   An example using the standard Kalman filter can be found at
    opencv_source_code/samples/cpp/kalman.cpp
 */

interface KalmanFilterStatic {
   /** @brief The constructors.

    @note In C API when CvKalman\* kalmanFilter structure is not needed anymore, it should be released
    with cvReleaseKalman(&kalmanFilter)
     */
  new (): KalmanFilter;
    /** @overload
    @param dynamParams Dimensionality of the state.
    @param measureParams Dimensionality of the measurement.
    @param controlParams Dimensionality of the control vector.
    @param type Type of the created matrices that should be CV_32F or CV_64F.
    */
  new (dynamParams: _st.int, measureParams: _st.int, controlParams?: _st.int /*= 0*/, type?: _st.int /*= CV_32F*/): KalmanFilter;
}

export interface KalmanFilter
{
//public:


    /** @brief Re-initializes Kalman filter. The previous content is destroyed.

    @param dynamParams Dimensionality of the state.
    @param measureParams Dimensionality of the measurement.
    @param controlParams Dimensionality of the control vector.
    @param type Type of the created matrices that should be CV_32F or CV_64F.
     */
    init(dynamParams: _st.int, measureParams: _st.int, controlParams?: _st.int /*= 0*/, type?: _st.int /*= CV_32F*/): void;

    /** @brief Computes a predicted state.

    @param control The optional input control
     */
    predict( control?  : _mat.Mat /*= Mat()*/ ): _mat.Mat;

    /** @brief Updates the predicted state from the measurement.

    @param measurement The measured system parameters
     */
    correct(measurement : _mat.Mat): _mat.Mat;

    statePre: _mat.Mat;           //!< predicted state (x'(k)): x(k)=A*x(k-1)+B*u(k)
    statePost: _mat.Mat;          //!< corrected state (x(k)): x(k)=x'(k)+K(k)*(z(k)-H*x'(k))
    transitionMatrix: _mat.Mat;   //!< state transition matrix (A)
    controlMatrix: _mat.Mat;      //!< control matrix (B) (not used if there is no control)
    measurementMatrix: _mat.Mat;  //!< measurement matrix (H)
    processNoiseCov: _mat.Mat;    //!< process noise covariance matrix (Q)
    measurementNoiseCov: _mat.Mat;//!< measurement noise covariance matrix (R)
    errorCovPre: _mat.Mat;        //!< priori error estimate covariance matrix (P'(k)): P'(k)=A*P(k-1)*At + Q)*/
    gain: _mat.Mat;               //!< Kalman gain matrix (K(k)): K(k)=P'(k)*Ht*inv(H*P'(k)*Ht+R)
    errorCovPost: _mat.Mat;       //!< posteriori error estimate covariance matrix (P(k)): P(k)=(I-K(k)*H)*P'(k)

//    // temporary matrices
//    Mat temp1;
//    Mat temp2;
//    Mat temp3;
//    Mat temp4;
//    Mat temp5;
};

export var KalmanFilter: KalmanFilterStatic = alvision_module.KalmanFilter;


interface DenseOpticalFlow extends _core.Algorithm
{
//public:
/** @brief Calculates an optical flow.

@param I0 first 8-bit single-channel input image.
@param I1 second input image of the same size and the same type as prev.
@param flow computed flow image that has the same size as prev and type CV_32FC2.
 */

    calc(I0: _st.InputArray, I1: _st.InputArray, flow: _st.InputOutputArray ): void;
/** @brief Releases all inner buffers.
*/
//    CV_WRAP virtual void collectGarbage() = 0;
};

/** @brief "Dual TV L1" Optical Flow Algorithm.

The class implements the "Dual TV L1" optical flow algorithm described in @cite Zach2007 and
@cite Javier2012 .
Here are important members of the class that control the algorithm, which you can set after
constructing the class instance:

-   member double tau
    Time step of the numerical scheme.

-   member double lambda
    Weight parameter for the data term, attachment parameter. This is the most relevant
    parameter, which determines the smoothness of the output. The smaller this parameter is,
    the smoother the solutions we obtain. It depends on the range of motions of the images, so
    its value should be adapted to each image sequence.

-   member double theta
    Weight parameter for (u - v)\^2, tightness parameter. It serves as a link between the
    attachment and the regularization terms. In theory, it should have a small value in order
    to maintain both parts in correspondence. The method is stable for a large range of values
    of this parameter.

-   member int nscales
    Number of scales used to create the pyramid of images.

-   member int warps
    Number of warpings per scale. Represents the number of times that I1(x+u0) and grad(
    I1(x+u0) ) are computed per scale. This is a parameter that assures the stability of the
    method. It also affects the running time, so it is a compromise between speed and
    accuracy.

-   member double epsilon
    Stopping criterion threshold used in the numerical scheme, which is a trade-off between
    precision and running time. A small value will yield more accurate solutions at the
    expense of a slower convergence.

-   member int iterations
    Stopping criterion iterations number used in the numerical scheme.

C. Zach, T. Pock and H. Bischof, "A Duality Based Approach for Realtime TV-L1 Optical Flow".
Javier Sanchez, Enric Meinhardt-Llopis and Gabriele Facciolo. "TV-L1 Optical Flow Estimation".
*/
interface DualTVL1OpticalFlow extends DenseOpticalFlow
{
//public:
    //! @brief Time step of the numerical scheme
    /** @see setTau */
    getTau(): _st.double;
    /** @copybrief getTau @see getTau */
    setTau(val: _st.double): void;
    //! @brief Weight parameter for the data term, attachment parameter
    /** @see setLambda */
    getLambda(): _st.double;
    /** @copybrief getLambda @see getLambda */
    setLambda(val: _st.double ): void;
    //! @brief Weight parameter for (u - v)^2, tightness parameter
    /** @see setTheta */
    getTheta(): _st.double;
    /** @copybrief getTheta @see getTheta */
    setTheta(val: _st.double): void;
    //! @brief coefficient for additional illumination variation term
    /** @see setGamma */
    getGamma(): _st.double;
    /** @copybrief getGamma @see getGamma */
    setGamma(val: _st.double): void;
    //! @brief Number of scales used to create the pyramid of images
    /** @see setScalesNumber */
    getScalesNumber(): _st.int;
    /** @copybrief getScalesNumber @see getScalesNumber */
    setScalesNumber(val: _st.int): void;
    //! @brief Number of warpings per scale
    /** @see setWarpingsNumber */
    getWarpingsNumber(): _st.int;
    /** @copybrief getWarpingsNumber @see getWarpingsNumber */
    setWarpingsNumber(val: _st.int): void;
    //! @brief Stopping criterion threshold used in the numerical scheme, which is a trade-off between precision and running time
    /** @see setEpsilon */
    getEpsilon(): _st.double;
    /** @copybrief getEpsilon @see getEpsilon */
    setEpsilon(val: _st.double): void;
    //! @brief Inner iterations (between outlier filtering) used in the numerical scheme
    /** @see setInnerIterations */
    getInnerIterations(): _st.int;
    /** @copybrief getInnerIterations @see getInnerIterations */
    setInnerIterations(val: _st.int): void;
    //! @brief Outer iterations (number of inner loops) used in the numerical scheme
    /** @see setOuterIterations */
    getOuterIterations(): _st.int;
    /** @copybrief getOuterIterations @see getOuterIterations */
    setOuterIterations(val: _st.int): void;
    //! @brief Use initial flow
    /** @see setUseInitialFlow */
    getUseInitialFlow(): boolean;
    /** @copybrief getUseInitialFlow @see getUseInitialFlow */
    setUseInitialFlow( val : boolean): void;
    //! @brief Step between scales (<1)
    /** @see setScaleStep */
    getScaleStep(): _st.double;
    /** @copybrief getScaleStep @see getScaleStep */
    setScaleStep(val: _st.double): void;
    //! @brief Median filter kernel size (1 = no filter) (3 or 5)
    /** @see setMedianFiltering */
    getMedianFiltering(): _st.int;
    /** @copybrief getMedianFiltering @see getMedianFiltering */
    setMedianFiltering( val : _st.int): void;
};

/** @brief Creates instance of cv::DenseOpticalFlow
*/

interface IcreateOptFlow_DualTVL1 {
    ():DualTVL1OpticalFlow;
}

export var createOptFlow_DualTVL1: IcreateOptFlow_DualTVL1 = alvision_module.createOptFlow_DualTVL1;

//CV_EXPORTS_W Ptr<DualTVL1OpticalFlow> createOptFlow_DualTVL1();

//! @} video_track

//} // cv
//
//#endif
