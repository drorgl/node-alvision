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
import * as _features2d from './../features2d';

//#ifndef __OPENCV_CUDAFEATURES2D_HPP__
//#define __OPENCV_CUDAFEATURES2D_HPP__
//
//#ifndef __cplusplus
//#  error cudafeatures2d.hpp header must be compiled as C++
//#endif
//
//#include "opencv2/core/cuda.hpp"
//#include "opencv2/features2d.hpp"
//#include "opencv2/cudafilters.hpp"

/**
  @addtogroup cuda
  @{
    @defgroup cudafeatures2d Feature Detection and Description
  @}
 */

//namespace cv {

//export namespace cudafeatures2d {

    //! @addtogroup cudafeatures2d
    //! @{

    //
    // DescriptorMatcher
    //

    /** @brief Abstract base class for matching keypoint descriptors.
    
    It has two groups of match methods: for matching descriptors of an image with another image or with
    an image set.
     */
    interface DescriptorMatcherStatic {
        /** @brief Brute-force descriptor matcher.

For each descriptor in the first set, this matcher finds the closest descriptor in the second set
by trying each one. This descriptor matcher supports masking permissible matches of descriptor
sets.

@param normType One of NORM_L1, NORM_L2, NORM_HAMMING. L1 and L2 norms are
preferable choices for SIFT and SURF descriptors, NORM_HAMMING should be used with ORB, BRISK and
BRIEF).
*/
        createBFMatcher(normType?: _st.int  /*= cv::NORM_L2*/): DescriptorMatcher;
    }

    interface DescriptorMatcher extends _core.Algorithm {
        //public:
        //
        // Factories
        //

   

        //
        // Utility
        //

        /** @brief Returns true if the descriptor matcher supports masking permissible matches.
         */
        isMaskSupported(): boolean;

        //
        // Descriptor collection
        //

        /** @brief Adds descriptors to train a descriptor collection.
    
        If the collection is not empty, the new descriptors are added to existing train descriptors.
    
        @param descriptors Descriptors to add. Each descriptors[i] is a set of descriptors from the same
        train image.
         */
        add(descriptors: Array<_cuda.GpuMat>): void;

        /** @brief Returns a constant link to the train descriptor collection.
         */
        getTrainDescriptors(): Array<_cuda.GpuMat>;

        /** @brief Clears the train descriptor collection.
         */
        clear(): void;

        /** @brief Returns true if there are no train descriptors in the collection.
         */
        empty(): boolean;

        /** @brief Trains a descriptor matcher.
    
        Trains a descriptor matcher (for example, the flann index). In all methods to match, the method
        train() is run every time before matching.
         */
        train(): void;

        //
        // 1 to 1 match
        //

        /** @brief Finds the best match for each descriptor from a query set (blocking version).
    
        @param queryDescriptors Query set of descriptors.
        @param trainDescriptors Train set of descriptors. This set is not added to the train descriptors
        collection stored in the class object.
        @param matches Matches. If a query descriptor is masked out in mask , no match is added for this
        descriptor. So, matches size may be smaller than the query descriptors count.
        @param mask Mask specifying permissible matches between an input query and train matrices of
        descriptors.
    
        In the first variant of this method, the train descriptors are passed as an input argument. In the
        second variant of the method, train descriptors collection that was set by DescriptorMatcher::add is
        used. Optional mask (or masks) can be passed to specify which query and training descriptors can be
        matched. Namely, queryDescriptors[i] can be matched with trainDescriptors[j] only if
        mask.at\<uchar\>(i,j) is non-zero.
         */
        match(queryDescriptors: _st.InputArray, trainDescriptors: _st.InputArray,
            matches: Array<_types.DMatch>,
            mask?: _st.InputArray /* = noArray()*/): void;

        /** @overload
         */
        match(queryDescriptors: _st.InputArray,
            matches: Array<_types.DMatch>,
            masks?: Array<_cuda.GpuMat> /*= Array<GpuMat>()*/): void;

        /** @brief Finds the best match for each descriptor from a query set (asynchronous version).
    
        @param queryDescriptors Query set of descriptors.
        @param trainDescriptors Train set of descriptors. This set is not added to the train descriptors
        collection stored in the class object.
        @param matches Matches array stored in GPU memory. Internal representation is not defined.
        Use DescriptorMatcher::matchConvert method to retrieve results in standard representation.
        @param mask Mask specifying permissible matches between an input query and train matrices of
        descriptors.
        @param stream CUDA stream.
    
        In the first variant of this method, the train descriptors are passed as an input argument. In the
        second variant of the method, train descriptors collection that was set by DescriptorMatcher::add is
        used. Optional mask (or masks) can be passed to specify which query and training descriptors can be
        matched. Namely, queryDescriptors[i] can be matched with trainDescriptors[j] only if
        mask.at\<uchar\>(i,j) is non-zero.
         */
        matchAsync(queryDescriptors: _st.InputArray, trainDescriptors: _st.InputArray,
            matches: _st.OutputArray,
            mask?: _st.InputArray /* = noArray()*/,
            stream?: _cuda.Stream /* = Stream::Null()*/): void;

        /** @overload
         */
        matchAsync(queryDescriptors: _st.InputArray,
            matches: _st.OutputArray,
            masks?: Array<_cuda.GpuMat> /*= Array<GpuMat>()*/,
            stream?: _cuda.Stream /*= Stream::Null()*/): void;

        /** @brief Converts matches array from internal representation to standard matches vector.
    
        The method is supposed to be used with DescriptorMatcher::matchAsync to get final result.
        Call this method only after DescriptorMatcher::matchAsync is completed (ie. after synchronization).
    
        @param gpu_matches Matches, returned from DescriptorMatcher::matchAsync.
        @param matches Vector of DMatch objects.
         */
        matchConvert(gpu_matches: _st.InputArray,
            matches: Array<_types.DMatch>): void;

        //
        // knn match
        //

        /** @brief Finds the k best matches for each descriptor from a query set (blocking version).
    
        @param queryDescriptors Query set of descriptors.
        @param trainDescriptors Train set of descriptors. This set is not added to the train descriptors
        collection stored in the class object.
        @param matches Matches. Each matches[i] is k or less matches for the same query descriptor.
        @param k Count of best matches found per each query descriptor or less if a query descriptor has
        less than k possible matches in total.
        @param mask Mask specifying permissible matches between an input query and train matrices of
        descriptors.
        @param compactResult Parameter used when the mask (or masks) is not empty. If compactResult is
        false, the matches vector has the same size as queryDescriptors rows. If compactResult is true,
        the matches vector does not contain matches for fully masked-out query descriptors.
    
        These extended variants of DescriptorMatcher::match methods find several best matches for each query
        descriptor. The matches are returned in the distance increasing order. See DescriptorMatcher::match
        for the details about query and train descriptors.
         */
        knnMatch(queryDescriptors: _st.InputArray, trainDescriptors: _st.InputArray,
            matches: Array<Array<_types.DMatch>>,
            k: _st.int,
            mask?: _st.InputArray /*= noArray()*/,
            compactResult?: boolean /*= false*/): void;

        /** @overload
         */
        knnMatch(queryDescriptors: _st.InputArray,
            matches: Array<Array<_types.DMatch>>,
            k: _st.int,
            masks?: Array<_cuda.GpuMat> /* = Array<GpuMat>()*/,
            compactResult?: boolean /*= false*/): void;

        /** @brief Finds the k best matches for each descriptor from a query set (asynchronous version).
    
        @param queryDescriptors Query set of descriptors.
        @param trainDescriptors Train set of descriptors. This set is not added to the train descriptors
        collection stored in the class object.
        @param matches Matches array stored in GPU memory. Internal representation is not defined.
        Use DescriptorMatcher::knnMatchConvert method to retrieve results in standard representation.
        @param k Count of best matches found per each query descriptor or less if a query descriptor has
        less than k possible matches in total.
        @param mask Mask specifying permissible matches between an input query and train matrices of
        descriptors.
        @param stream CUDA stream.
    
        These extended variants of DescriptorMatcher::matchAsync methods find several best matches for each query
        descriptor. The matches are returned in the distance increasing order. See DescriptorMatcher::matchAsync
        for the details about query and train descriptors.
         */
        knnMatchAsync(queryDescriptors: _st.InputArray, trainDescriptors: _st.InputArray,
            matches: _st.OutputArray,
            k: _st.int,
            mask?: _st.InputArray /*= noArray()*/,
            stream?: _cuda.Stream /*= Stream::Null()*/): void;

        /** @overload
         */
        knnMatchAsync(queryDescriptors: _st.InputArray,
            matches: _st.OutputArray,
            k: _st.int,
            masks?: Array<_cuda.GpuMat> /*= Array<GpuMat>()*/,
            stream?: _cuda.Stream /*= Stream::Null()*/): void;

        /** @brief Converts matches array from internal representation to standard matches vector.
    
        The method is supposed to be used with DescriptorMatcher::knnMatchAsync to get final result.
        Call this method only after DescriptorMatcher::knnMatchAsync is completed (ie. after synchronization).
    
        @param gpu_matches Matches, returned from DescriptorMatcher::knnMatchAsync.
        @param matches Vector of DMatch objects.
        @param compactResult Parameter used when the mask (or masks) is not empty. If compactResult is
        false, the matches vector has the same size as queryDescriptors rows. If compactResult is true,
        the matches vector does not contain matches for fully masked-out query descriptors.
         */
        knnMatchConvert(gpu_matches: _st.InputArray,
            matches: Array<Array<_types.DMatch>>,
            compactResult?: boolean /*= false*/): void;

        //
        // radius match
        //

        /** @brief For each query descriptor, finds the training descriptors not farther than the specified distance (blocking version).
    
        @param queryDescriptors Query set of descriptors.
        @param trainDescriptors Train set of descriptors. This set is not added to the train descriptors
        collection stored in the class object.
        @param matches Found matches.
        @param maxDistance Threshold for the distance between matched descriptors. Distance means here
        metric distance (e.g. Hamming distance), not the distance between coordinates (which is measured
        in Pixels)!
        @param mask Mask specifying permissible matches between an input query and train matrices of
        descriptors.
        @param compactResult Parameter used when the mask (or masks) is not empty. If compactResult is
        false, the matches vector has the same size as queryDescriptors rows. If compactResult is true,
        the matches vector does not contain matches for fully masked-out query descriptors.
    
        For each query descriptor, the methods find such training descriptors that the distance between the
        query descriptor and the training descriptor is equal or smaller than maxDistance. Found matches are
        returned in the distance increasing order.
         */
        radiusMatch(queryDescriptors: _st.InputArray, trainDescriptors: _st.InputArray,
            matches: Array<Array<_types.DMatch>>,
            maxDistance: _st.float,
            mask?: _st.InputArray /*= noArray()*/,
            compactResult?: boolean /*= false*/): void;

        /** @overload
         */
        radiusMatch(queryDescriptors: _st.InputArray,
            matches: Array<Array<_types.DMatch>>,
            maxDistance: _st.float,
            masks?: Array<_cuda.GpuMat> /*= Array<GpuMat>()*/,
            compactResult?: boolean /*= false*/): void;

        /** @brief For each query descriptor, finds the training descriptors not farther than the specified distance (asynchronous version).
    
        @param queryDescriptors Query set of descriptors.
        @param trainDescriptors Train set of descriptors. This set is not added to the train descriptors
        collection stored in the class object.
        @param matches Matches array stored in GPU memory. Internal representation is not defined.
        Use DescriptorMatcher::radiusMatchConvert method to retrieve results in standard representation.
        @param maxDistance Threshold for the distance between matched descriptors. Distance means here
        metric distance (e.g. Hamming distance), not the distance between coordinates (which is measured
        in Pixels)!
        @param mask Mask specifying permissible matches between an input query and train matrices of
        descriptors.
        @param stream CUDA stream.
    
        For each query descriptor, the methods find such training descriptors that the distance between the
        query descriptor and the training descriptor is equal or smaller than maxDistance. Found matches are
        returned in the distance increasing order.
         */
        radiusMatchAsync(queryDescriptors: _st.InputArray, trainDescriptors: _st.InputArray,
            matches: _st.OutputArray,
            maxDistance: _st.float,
            mask?: _st.InputArray /* = noArray()*/,
            stream?: _cuda.Stream /*= Stream::Null()*/): void;

        /** @overload
         */
        radiusMatchAsync(queryDescriptors: _st.InputArray,
            matches: _st.OutputArray,
            maxDistance: _st.float,
            masks?: Array<_cuda.GpuMat> /* = Array<GpuMat>()*/,
            stream?: _cuda.Stream /* = Stream::Null()*/): void;

        /** @brief Converts matches array from internal representation to standard matches vector.
    
        The method is supposed to be used with DescriptorMatcher::radiusMatchAsync to get final result.
        Call this method only after DescriptorMatcher::radiusMatchAsync is completed (ie. after synchronization).
    
        @param gpu_matches Matches, returned from DescriptorMatcher::radiusMatchAsync.
        @param matches Vector of DMatch objects.
        @param compactResult Parameter used when the mask (or masks) is not empty. If compactResult is
        false, the matches vector has the same size as queryDescriptors rows. If compactResult is true,
        the matches vector does not contain matches for fully masked-out query descriptors.
         */
        radiusMatchConvert(gpu_matches: _st.InputArray,
            matches: Array<Array<_types.DMatch>>,
            compactResult?: boolean /*= false*/): void;
    };

    export var DescriptorMatcher: DescriptorMatcherStatic = alvision_module.cuda.DescriptorMatcher;

    //
    // Feature2DAsync
    //

    /** @brief Abstract base class for CUDA asynchronous 2D image feature detectors and descriptor extractors.
     */
    interface Feature2DAsync {
        //public:
        //virtual ~Feature2DAsync();

        /** @brief Detects keypoints in an image.
    
        @param image Image.
        @param keypoints The detected keypoints.
        @param mask Mask specifying where to look for keypoints (optional). It must be a 8-bit integer
        matrix with non-zero values in the region of interest.
        @param stream CUDA stream.
         */
        detectAsync(image: _st.InputArray,
            keypoints: _st.OutputArray,
            mask?: _st.InputArray /* = noArray()*/,
            stream?: _cuda.Stream /* = Stream::Null()*/): void;

        /** @brief Computes the descriptors for a set of keypoints detected in an image.
    
        @param image Image.
        @param keypoints Input collection of keypoints.
        @param descriptors Computed descriptors. Row j is the descriptor for j-th keypoint.
        @param stream CUDA stream.
         */
        computeAsync(image: _st.InputArray,
            keypoints: _st.OutputArray,
            descriptors: _st.OutputArray,
            stream?: _cuda.Stream /* = Stream::Null()*/): void;

        /** Detects keypoints and computes the descriptors. */
        detectAndComputeAsync(image: _st.InputArray,
            mask: _st.InputArray,
            keypoints: _st.OutputArray,
            descriptors: _st.OutputArray,
            useProvidedKeypoints?: boolean/* = false*/,
            stream?: _cuda.Stream /* = Stream::Null()*/): void;

        /** Converts keypoints array from internal representation to standard vector. */
        convert(gpu_keypoints: _st.InputArray,
            keypoints: Array<_types.KeyPoint>): void;
    };

    //
    // FastFeatureDetector
    //

    /** @brief Wrapping class for feature detection using the FAST method.
     */
    //enum 
    //    {
    //    LOCATION_ROW = 0,
    //    RESPONSE_ROW,
    //    ROWS_COUNT,
    //
    //    FEATURE_SIZE = 7
    //};
    interface FastFeatureDetectorStatic {
        create(threshold?: _st.int/*= 10*/,
            nonmaxSuppression?: boolean /*= true*/,
            type?: _st.int  /*= FastFeatureDetector::TYPE_9_16*/,
            max_npoints?: _st.int /*= 5000*/): FastFeatureDetector;
    }

    interface FastFeatureDetector extends _features2d.FastFeatureDetector, Feature2DAsync {
        //public:
        setMaxNumPoints(max_npoints: _st.int): void;
        getMaxNumPoints(): _st.int;
    };

    export var FastFeatureDetector: FastFeatureDetectorStatic = alvision_module.cuda.FastFeatureDetector;

    //
    // ORB
    //

    /** @brief Class implementing the ORB (*oriented BRIEF*) keypoint detector and descriptor extractor
     *
     * @sa cv::ORB
     */
    interface ORBStatic {
        create(nfeatures?: _st.int /*= 500*/,
            scaleFactor?: _st.float /*= 1.2f*/,
            nlevels?: _st.int /*= 8*/,
            edgeThreshold?: _st.int /*= 31*/,
            firstLevel?: _st.int /*= 0*/,
            WTA_K?: _st.int /*= 2*/,
            scoreType?: _features2d.ORBEnum | _st.int /*= ORB::HARRIS_SCORE*/,
            patchSize?: _st.int /*= 31*/,
            fastThreshold?: _st.int /*= 20*/,
            blurForDescriptor?: boolean /*= false*/): ORB;

    }

    interface ORB extends _features2d.ORB, Feature2DAsync {
        //public:
        //  enum
        //  {
        //      X_ROW = 0,
        //      Y_ROW,
        //      RESPONSE_ROW,
        //      ANGLE_ROW,
        //      OCTAVE_ROW,
        //      SIZE_ROW,
        //      ROWS_COUNT
        //  };

   
        //! if true, image will be blurred before descriptors calculation
        setBlurForDescriptor(blurForDescriptor: boolean): void;
        getBlurForDescriptor(): boolean;
    };

    export var ORB: ORBStatic = alvision_module.cuda.ORB;

    //! @}

//}
//} // namespace cv { namespace cuda {

//#endif /* __OPENCV_CUDAFEATURES2D_HPP__ */
