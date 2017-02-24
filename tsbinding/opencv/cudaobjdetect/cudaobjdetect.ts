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

//#ifndef __OPENCV_CUDAOBJDETECT_HPP__
//#define __OPENCV_CUDAOBJDETECT_HPP__
//
//#ifndef __cplusplus
//#  error cudaobjdetect.hpp header must be compiled as C++
//#endif
//
//#include "opencv2/core/cuda.hpp"

/**
  @addtogroup cuda
  @{
      @defgroup cudaobjdetect Object Detection
  @}
 */

//namespace cv {
//export    namespace cudaobjdetect {

//! @addtogroup cudaobjdetect
//! @{

//
// HOG (Histogram-of-Oriented-Gradients) Descriptor and Object Detector
//

/** @brief The class implements Histogram of Oriented Gradients (@cite Dalal2005) object detector.

@note
    -   An example applying the HOG descriptor for people detection can be found at
        opencv_source_code/samples/cpp/peopledetect.cpp
    -   A CUDA example applying the HOG descriptor for people detection can be found at
        opencv_source_code/samples/gpu/hog.cpp
    -   (Python) An example applying the HOG descriptor for people detection can be found at
        opencv_source_code/samples/python/peopledetect.py
 */

    interface HOGStatic {
        /** @brief Creates the HOG descriptor and detector.
    
        @param win_size Detection window size. Align to block size and block stride.
        @param block_size Block size in pixels. Align to cell size. Only (16,16) is supported for now.
        @param block_stride Block stride. It must be a multiple of cell size.
        @param cell_size Cell size. Only (8, 8) is supported for now.
        @param nbins Number of bins. Only 9 bins per cell are supported for now.
         */
        create(win_size?: _types.Size /*= Size(64, 128)*/,
            block_size?: _types.Size /*= Size(16, 16)*/,
            block_stride?: _types.Size /*= Size(8, 8)*/,
            cell_size?: _types.Size /*= Size(8, 8)*/,
            nbins?: _st.int /*= 9*/): HOG;

    }


export    enum DescriptorStorage
    {
        DESCR_FORMAT_ROW_BY_ROW,
        DESCR_FORMAT_COL_BY_COL
    };
    

export interface HOG extends _core.Algorithm
{
//public:
//


    //! Gaussian smoothing window parameter.
    setWinSigma(win_sigma: _st.double ): void;
    getWinSigma(): _st.double;

    //! L2-Hys normalization method shrinkage.
    setL2HysThreshold(threshold_L2hys: _st.double ): void;
    getL2HysThreshold(): _st.double;

    //! Flag to specify whether the gamma correction preprocessing is required or not.
    setGammaCorrection(gamma_correction : boolean): void;
    getGammaCorrection(): boolean;

    //! Maximum number of detection window increases.
    setNumLevels(nlevels: _st.int ): void;
    getNumLevels(): _st.int;

    //! Threshold for the distance between features and SVM classifying plane.
    //! Usually it is 0 and should be specfied in the detector coefficients (as the last free
    //! coefficient). But if the free coefficient is omitted (which is allowed), you can specify it
    //! manually here.
    setHitThreshold(hit_threshold: _st.double ): void;
    getHitThreshold(): _st.double;

    //! Window stride. It must be a multiple of block stride.
    setWinStride(win_stride: _types.Size ): void;
    getWinStride(): _types.Size;

    //! Coefficient of the detection window increase.
    setScaleFactor(scale0: _st.double ): void;
    getScaleFactor(): _st.double;

    //! Coefficient to regulate the similarity threshold. When detected, some
    //! objects can be covered by many rectangles. 0 means not to perform grouping.
    //! See groupRectangles.
    setGroupThreshold(group_threshold: _st.int ): void;
    getGroupThreshold(): _st.int;

    //! Descriptor storage format:
    //!   - **DESCR_FORMAT_ROW_BY_ROW** - Row-major order.
    //!   - **DESCR_FORMAT_COL_BY_COL** - Column-major order.
    setDescriptorFormat(descr_format: DescriptorStorage| _st.int ): void;
    getDescriptorFormat(): DescriptorStorage ;

    /** @brief Returns the number of coefficients required for the classification.
     */
    getDescriptorSize(): _st.size_t;

    /** @brief Returns the block histogram size.
     */
    getBlockHistogramSize(): _st.size_t;

    /** @brief Sets coefficients for the linear SVM classifier.
     */
    setSVMDetector(detector: _st.InputArray ): void;

    /** @brief Returns coefficients of the classifier trained for people detection.
     */
    getDefaultPeopleDetector(): _mat.Mat;

    /** @brief Performs object detection without a multi-scale window.

    @param img Source image. CV_8UC1 and CV_8UC4 types are supported for now.
    @param found_locations Left-top corner points of detected objects boundaries.
    @param confidences Optional output array for confidences.
     */
    detect(img: _st.InputArray,
        found_locations: Array<_types.Point> ,
        confidences?: Array<_st.double> /*= NULL*/): void;

    /** @brief Performs object detection with a multi-scale window.

    @param img Source image. See cuda::HOGDescriptor::detect for type limitations.
    @param found_locations Detected objects boundaries.
    @param confidences Optional output array for confidences.
     */
    detectMultiScale(img : _st.InputArray,
        cb:(found_locations: Array<_types.Rect>,
        confidences?: Array<_st.double>/*= NULL*/)=>void): void;

    /** @brief Returns block descriptors computed for the whole image.

    @param img Source image. See cuda::HOGDescriptor::detect for type limitations.
    @param descriptors 2D array of descriptors.
    @param stream CUDA stream.
     */
    compute(img: _st.InputArray ,
        descriptors: _st.OutputArray ,
        stream?: _cuda.Stream /*= Stream::Null()*/): void;
};
export var HOG: HOGStatic = alvision_module.cuda.HOG;
//
// CascadeClassifier
//

/** @brief Cascade classifier class used for object detection. Supports HAAR and LBP cascades. :

@note
   -   A cascade classifier example can be found at
        opencv_source_code/samples/gpu/cascadeclassifier.cpp
    -   A Nvidea API specific cascade classifier example can be found at
        opencv_source_code/samples/gpu/cascadeclassifier_nvidia_api.cpp
 */

interface CascadeClassifierStatic {
    /** @brief Loads the classifier from a file. Cascade type is detected automatically by constructor parameter.

    @param filename Name of the file from which the classifier is loaded. Only the old haar classifier
    (trained by the haar training application) and NVIDIA's nvbin are supported for HAAR and only new
    type of OpenCV XML cascade supported for LBP. The working haar models can be found at opencv_folder/data/haarcascades_cuda/
     */
    create(filename : string): CascadeClassifier;
    /** @overload
     */
    create(file: _persistence.FileStorage): CascadeClassifier;
    }
interface CascadeClassifier extends _core.Algorithm
{
    //! Maximum possible object size. Objects larger than that are ignored. Used for
    //! second signature and supported only for LBP cascades.
    setMaxObjectSize(maxObjectSize: _types.Size ): void;
    getMaxObjectSize(): _types.Size; 

    //! Minimum possible object size. Objects smaller than that are ignored.
    setMinObjectSize(minSize: _types.Size ): void;
    getMinObjectSize(): _types.Size;

    //! Parameter specifying how much the image size is reduced at each image scale.
    setScaleFactor(scaleFactor: _st.double ): void;
    getScaleFactor(): _st.double;

    //! Parameter specifying how many neighbors each candidate rectangle should have
    //! to retain it.
    setMinNeighbors(minNeighbors: _st.int ): void;
    getMinNeighbors(): _st.int;

    setFindLargestObject( findLargestObject : boolean): void;
    getFindLargestObject(): boolean;

    setMaxNumObjects(maxNumObjects: _st.int): void;
    getMaxNumObjects(): _st.int;

    getClassifierSize(): _types.Size;

    /** @brief Detects objects of different sizes in the input image.

    @param image Matrix of type CV_8U containing an image where objects should be detected.
    @param objects Buffer to store detected objects (rectangles).
    @param stream CUDA stream.

    To get final array of detected objects use CascadeClassifier::convert method.

    @code
        Ptr<cuda::CascadeClassifier> cascade_gpu = cuda::CascadeClassifier::create(...);

        Mat image_cpu = imread(...)
        GpuMat image_gpu(image_cpu);

        GpuMat objbuf;
        cascade_gpu->detectMultiScale(image_gpu, objbuf);

        std::vector<Rect> faces;
        cascade_gpu->convert(objbuf, faces);

        for(int i = 0; i < detections_num; ++i)
           cv::rectangle(image_cpu, faces[i], Scalar(255));

        imshow("Faces", image_cpu);
    @endcode

    @sa CascadeClassifier::detectMultiScale
     */
    detectMultiScale(image: _st.InputArray ,
        objects: _st.OutputArray ,
        stream?: _cuda.Stream /*= Stream::Null()*/): void;

    /** @brief Converts objects array from internal representation to standard vector.

    @param gpu_objects Objects array in internal representation.
    @param objects Resulting array.
     */
    convert(gpu_objects: _st.OutputArray ,
        objects: Array<_types.Rect>): void;
};

    export var CascadeClassifier: CascadeClassifierStatic = alvision_module.cuda.CascadeClassifier;

//! @}

//}
//} // namespace cv { namespace cuda {

//#endif /* __OPENCV_CUDAOBJDETECT_HPP__ */
