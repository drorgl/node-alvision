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
import * as _persistence from './persistence'
//import * as _vec from './Vec'
//import * as _point from './Point'
//import * as _algorithm from './Algorithm'
//import * as _size from './Size'
//import * as _scalar from './Scalar'

//#ifndef __OPENCV_FEATURES_2D_HPP__
//#define __OPENCV_FEATURES_2D_HPP__
//
//#include "opencv2/core.hpp"
//#include "opencv2/flann/miniflann.hpp"

/**
  @defgroup features2d 2D Features Framework
  @{
    @defgroup features2d_main Feature Detection and Description
    @defgroup features2d_match Descriptor Matchers

Matchers of keypoint descriptors in OpenCV have wrappers with a common interface that enables you to
easily switch between different algorithms solving the same problem. This section is devoted to
matching descriptors that are represented as vectors in a multidimensional space. All objects that
implement vector descriptor matchers inherit the DescriptorMatcher interface.

@note
   -   An example explaining keypoint matching can be found at
        opencv_source_code/samples/cpp/descriptor_extractor_matcher.cpp
    -   An example on descriptor matching evaluation can be found at
        opencv_source_code/samples/cpp/detector_descriptor_matcher_evaluation.cpp
    -   An example on one to many image matching can be found at
        opencv_source_code/samples/cpp/matching_to_many_images.cpp

    @defgroup features2d_draw Drawing Function of Keypoints and Matches
    @defgroup features2d_category Object Categorization

This section describes approaches based on local 2D features and used to categorize objects.

@note
   -   A complete Bag-Of-Words sample can be found at
        opencv_source_code/samples/cpp/bagofwords_classification.cpp
    -   (Python) An example using the features2D framework to perform object categorization can be
        found at opencv_source_code/samples/python/find_obj.py

  @}
 */

//namespace cv
//{

//! @addtogroup features2d
//! @{

// //! writes vector of keypoints to the file storage
// CV_EXPORTS void write(FileStorage& fs, const String& name, const Array<KeyPoint>& keypoints);
// //! reads vector of keypoints from the specified file storage node
// CV_EXPORTS void read(const FileNode& node, CV_OUT Array<KeyPoint>& keypoints);

/** @brief A class filters a vector of keypoints.

 Because now it is difficult to provide a convenient interface for all usage scenarios of the
 keypoints filter class, it has only several needed by now static methods.
 */

interface KeyPointsFilterStatic {
    (): KeyPointsFilter;

    /*
     * Remove keypoints within borderPixels of an image edge.
     */
    runByImageBorder(keypoints : Array<_types.KeyPoint>,imageSize : _types.Size, borderSize : _st.int ) : void;
    /*
     * Remove keypoints of sizes out of range.
     */
    runByKeypointSize(keypoints: Array<_types.KeyPoint>, minSize: _st.float ,
        maxSize: _st.float/*= _st.FLT_MAX*/) : void;
    /*
     * Remove keypoints from some image by mask for pixels of this image.
     */
    runByPixelsMask(keypoints: Array<_types.KeyPoint>, mask: _mat.Mat): void;
    /*
     * Remove duplicated keypoints.
     */
    removeDuplicated(keypoints: Array<_types.KeyPoint>): void;

    /*
     * Retain the specified number of the best keypoints (according to the response)
     */
    retainBest(keypoints: Array<_types.KeyPoint>, npoints: _st.int  ): void;
}

interface KeyPointsFilter
{
    
};


/************************************ Base Classes ************************************/

/** @brief Abstract base class for 2D image feature detectors and descriptor extractors
*/
interface Feature2D extends _core.Algorithm
{
    /** @brief Detects keypoints in an image (first variant) or image set (second variant).

    @param image Image.
    @param keypoints The detected keypoints. In the second variant of the method keypoints[i] is a set
    of keypoints detected in images[i] .
    @param mask Mask specifying where to look for keypoints (optional). It must be a 8-bit integer
    matrix with non-zero values in the region of interest.
     */
    detect(image: _st.InputArray,
        cb: (keypoints: Array<_types.KeyPoint>) => void,
        mask?: _st.InputArray /*= noArray()*/): void;

    /** @overload
    @param images Image set.
    @param keypoints The detected keypoints. In the second variant of the method keypoints[i] is a set
    of keypoints detected in images[i] .
    @param masks Masks for each input image specifying where to look for keypoints (optional).
    masks[i] is a mask for images[i].
    */
    detect(images: _st.InputArrayOfArrays,
        keypoints : Array<Array<_types.KeyPoint>>,
        masks?: _st.InputArrayOfArrays /*= noArray()*/): void;

    /** @brief Computes the descriptors for a set of keypoints detected in an image (first variant) or image set
    (second variant).

    @param image Image.
    @param keypoints Input collection of keypoints. Keypoints for which a descriptor cannot be
    computed are removed. Sometimes new keypoints can be added, for example: SIFT duplicates keypoint
    with several dominant orientations (for each orientation).
    @param descriptors Computed descriptors. In the second variant of the method descriptors[i] are
    descriptors computed for a keypoints[i]. Row j is the keypoints (or keypoints[i]) is the
    descriptor for keypoint j-th keypoint.
     */
    compute(image: _st.InputArray,
        keypoints: Array<_types.KeyPoint>,
        //cb: (keypoints: Array<_types.KeyPoint>)=>void,
        descriptors: _st.OutputArray ): void;

    /** @overload

    @param images Image set.
    @param keypoints Input collection of keypoints. Keypoints for which a descriptor cannot be
    computed are removed. Sometimes new keypoints can be added, for example: SIFT duplicates keypoint
    with several dominant orientations (for each orientation).
    @param descriptors Computed descriptors. In the second variant of the method descriptors[i] are
    descriptors computed for a keypoints[i]. Row j is the keypoints (or keypoints[i]) is the
    descriptor for keypoint j-th keypoint.
    */
    compute(images: _st.InputArrayOfArrays ,
         keypoints : Array<Array<_types.KeyPoint>>,
         descriptors: _st.OutputArrayOfArrays  ): void;

    /** Detects keypoints and computes the descriptors */
    detectAndCompute(image: _st.InputArray, mask: _st.InputArray,
        cb:(keypoints : Array<_types.KeyPoint>)=>void,
        descriptors: _st.OutputArray ,
        useProvidedKeypoints?: boolean /*= false*/): void;

    descriptorSize() : _st.int;
    descriptorType() : _st.int;
    defaultNorm() : _st.int;

    //! Return true if detector object is empty
    empty() : boolean;
};

/** Feature detectors in OpenCV have wrappers with a common interface that enables you to easily switch
between different algorithms solving the same problem. All objects that implement keypoint detectors
inherit the FeatureDetector interface. */
//typedef Feature2D FeatureDetector;
export interface FeatureDetector extends Feature2D { }

/** Extractors of keypoint descriptors in OpenCV have wrappers with a common interface that enables you
to easily switch between different algorithms solving the same problem. This section is devoted to
computing descriptors represented as vectors in a multidimensional space. All objects that implement
the vector descriptor extractors inherit the DescriptorExtractor interface.
 */
export interface DescriptorExtractor extends Feature2D { }
//typedef Feature2D DescriptorExtractor;

//! @addtogroup features2d_main
//! @{

/** @brief Class implementing the BRISK keypoint detector and descriptor extractor, described in @cite LCS11 .
 */

interface BRISKStatic {
//public:
    /** @brief The BRISK constructor

    @param thresh AGAST detection threshold score.
    @param octaves detection octaves. Use 0 to do single scale.
    @param patternScale apply this scale to the pattern used for sampling the neighbourhood of a
    keypoint.
     */
    create(thresh? : _st.int /*= 30*/, octaves? : _st.int /*= 3*/, patternScale? : _st.float /*= 1.0f*/) : BRISK;

/** @brief The BRISK constructor for a custom pattern

@param radiusList defines the radii (in pixels) where the samples around a keypoint are taken (for
keypoint scale 1).
@param numberList defines the number of sampling points on the sampling circle. Must be the same
size as radiusList..
@param dMax threshold for the short pairings used for descriptor formation (in pixels for keypoint
scale 1).
@param dMin threshold for the long pairings used for orientation determination (in pixels for
keypoint scale 1).
@param indexChange index remapping of the bits. */
   create(radiusList : Array<_st.float>, numberList : Array<_st.int>,
       dMax?: _st.float /*= 5.85f*/, dMin?: _st.float /*= 8.2f*/, indexChange? : Array<_st.int> /*=Array<int>()*/) : BRISK;

}

interface BRISK extends Feature2D
{
};

export var BRISK: BRISKStatic = alvision_module.BRISK;

export enum ORBEnum { kBytes = 32, HARRIS_SCORE = 0, FAST_SCORE = 1 };

/** @brief Class implementing the ORB (*oriented BRIEF*) keypoint detector and descriptor extractor

described in @cite RRKB11 . The algorithm uses FAST in pyramids to detect stable keypoints, selects
the strongest features using FAST or Harris response, finds their orientation using first-order
moments and computes the descriptors using BRIEF (where the coordinates of random point pairs (or
k-tuples) are rotated according to the measured orientation).
 */

interface ORBStatic {
    /** @brief The ORB constructor

    @param nfeatures The maximum number of features to retain.
    @param scaleFactor Pyramid decimation ratio, greater than 1. scaleFactor==2 means the classical
    pyramid, where each next level has 4x less pixels than the previous, but such a big scale factor
    will degrade feature matching scores dramatically. On the other hand, too close to 1 scale factor
    will mean that to cover certain scale range you will need more pyramid levels and so the speed
    will suffer.
    @param nlevels The number of pyramid levels. The smallest level will have linear size equal to
    input_image_linear_size/pow(scaleFactor, nlevels).
    @param edgeThreshold This is size of the border where the features are not detected. It should
    roughly match the patchSize parameter.
    @param firstLevel It should be 0 in the current implementation.
    @param WTA_K The number of points that produce each element of the oriented BRIEF descriptor. The
    default value 2 means the BRIEF where we take a random point pair and compare their brightnesses,
    so we get 0/1 response. Other possible values are 3 and 4. For example, 3 means that we take 3
    random points (of course, those point coordinates are random, but they are generated from the
    pre-defined seed, so each element of BRIEF descriptor is computed deterministically from the pixel
    rectangle), find point of maximum brightness and output index of the winner (0, 1 or 2). Such
    output will occupy 2 bits, and therefore it will need a special variant of Hamming distance,
    denoted as NORM_HAMMING2 (2 bits per bin). When WTA_K=4, we take 4 random points to compute each
    bin (that will also occupy 2 bits with possible values 0, 1, 2 or 3).
    @param scoreType The default HARRIS_SCORE means that Harris algorithm is used to rank features
    (the score is written to KeyPoint::score and is used to retain best nfeatures features);
    FAST_SCORE is alternative value of the parameter that produces slightly less stable keypoints,
    but it is a little faster to compute.
    @param patchSize size of the patch used by the oriented BRIEF descriptor. Of course, on smaller
    pyramid layers the perceived image area covered by a feature will be larger.
    @param fastThreshold
     */
    create(nfeatures?: _st.int /*= 500*/, scaleFactor?: _st.float /*= 1.2f*/, nlevels?: _st.int /*= 8*/, edgeThreshold?: _st.int /*= 31*/,
        firstLevel?: _st.int /* = 0*/, WTA_K?: _st.int /*= 2*/, scoreType?: ORBEnum | _st.int /*= HARRIS_SCORE*/, patchSize?: _st.int /*= 31*/, fastThreshold?: _st.int /*= 20*/): ORB;
}

export interface ORB extends Feature2D
{
//public:
    

    

    setMaxFeatures(maxFeatures: _st.int ): void;
    getMaxFeatures(): _st.int;

    setScaleFactor(scaleFactor: _st.double ): void;
    getScaleFactor(): _st.double;

    setNLevels(nlevels: _st.int ): void;
    getNLevels(): _st.int;

    setEdgeThreshold(edgeThreshold: _st.int ): void;
    getEdgeThreshold(): _st.int;

    setFirstLevel(firstLevel: _st.int): void;
    getFirstLevel(): _st.int;

    setWTA_K(wta_k: _st.int ): void;
    getWTA_K(): _st.int;

    setScoreType(scoreType: _st.int ): void;
    getScoreType(): _st.int;

    setPatchSize(patchSize: _st.int ): void;
    getPatchSize(): _st.int;

    setFastThreshold(fastThreshold: _st.int ): void;
    getFastThreshold(): _st.int;
};

export var ORB: ORBStatic = alvision_module.ORB;

/** @brief Maximally stable extremal region extractor

The class encapsulates all the parameters of the %MSER extraction algorithm (see [wiki
article](http://en.wikipedia.org/wiki/Maximally_stable_extremal_regions)).

- there are two different implementation of %MSER: one for grey image, one for color image

- the grey image algorithm is taken from: @cite nister2008linear ;  the paper claims to be faster
than union-find method; it actually get 1.5~2m/s on my centrino L7200 1.2GHz laptop.

- the color image algorithm is taken from: @cite forssen2007maximally ; it should be much slower
than grey image method ( 3~4 times ); the chi_table.h file is taken directly from paper's source
code which is distributed under GPL.

- (Python) A complete example showing the use of the %MSER detector can be found at samples/python/mser.py
*/

interface MSERStatic {
    /** @brief Full consturctor for %MSER detector

    @param _delta it compares \f$(size_{i}-size_{i-delta})/size_{i-delta}\f$
    @param _min_area prune the area which smaller than minArea
    @param _max_area prune the area which bigger than maxArea
    @param _max_variation prune the area have simliar size to its children
    @param _min_diversity for color image, trace back to cut off mser with diversity less than min_diversity
    @param _max_evolution  for color image, the evolution steps
    @param _area_threshold for color image, the area threshold to cause re-initialize
    @param _min_margin for color image, ignore too small margin
    @param _edge_blur_size for color image, the aperture size for edge blur
     */
    create(_delta?: _st.int /*= 5*/, _min_area?: _st.int /*= 60*/, _max_area?: _st.int /*= 14400*/,
        _max_variation?: _st.double /*= 0.25*/, _min_diversity?: _st.double /*= .2*/,
        _max_evolution?: _st.int/*= 200*/, _area_threshold?: _st.double /*= 1.01*/,
        _min_margin?: _st.double /*= 0.003*/, _edge_blur_size?: _st.int /*= 5*/): MSER;
}

interface MSER extends Feature2D
{
//public:
    

    /** @brief Detect %MSER regions

    @param image input image (8UC1, 8UC3 or 8UC4)
    @param msers resulting list of point sets
    @param bboxes resulting bounding boxes
    */
    detectRegions(image: _st.InputArray,
        cb : (msers : Array<Array<_types.Point>>)=> void,
        bboxes: Array<_types.Rect>): void;

    setDelta(delta: _st.int ): void;
    getDelta(): _st.int;

    setMinArea(minArea: _st.int ): void;
    getMinArea(): _st.int;

    setMaxArea(maxArea: _st.int): void;
    getMaxArea(): _st.int;

    setPass2Only(f: boolean): void;
    getPass2Only(): boolean;
};

export var MSER: MSERStatic = alvision_module.MSER;

/** @overload */

//interface IFAST {
//    (image: _st.InputArray, cb: (keypoints: Array<_types.KeyPoint>) => void,
//        threshold: _st.int , nonmaxSuppression : boolean/*= true*/): void;
//}

//export var FAST: IFAST = alvision_module.FAST;

//CV_EXPORTS void FAST( InputArray image, CV_OUT Array<KeyPoint>& keypoints,
//                      int threshold, bool nonmaxSuppression=true );

/** @brief Detects corners using the FAST algorithm

@param image grayscale image where keypoints (corners) are detected.
@param keypoints keypoints detected on the image.
@param threshold threshold on difference between intensity of the central pixel and pixels of a
circle around this pixel.
@param nonmaxSuppression if true, non-maximum suppression is applied to detected corners
(keypoints).
@param type one of the three neighborhoods as defined in the paper:
FastFeatureDetector::TYPE_9_16, FastFeatureDetector::TYPE_7_12,
FastFeatureDetector::TYPE_5_8

Detects corners using the FAST algorithm by @cite Rosten06 .

@note In Python API, types are given as cv2.FAST_FEATURE_DETECTOR_TYPE_5_8,
cv2.FAST_FEATURE_DETECTOR_TYPE_7_12 and cv2.FAST_FEATURE_DETECTOR_TYPE_9_16. For corner
detection, use cv2.FAST.detect() method.
 */

interface IFAST {
    (image: _st.InputArray, cb: (keypoints: Array<_types.KeyPoint> )=>void,
        threshold: _st.int, nonmaxSuppression: boolean, type: _st.int): void;
    (image: _st.InputArray, cb: (keypoints: Array<_types.KeyPoint>) => void,
        threshold: _st.int, nonmaxSuppression?: boolean/*= true*/): void;
}

export var FAST: IFAST = alvision_module.FAST;

//CV_EXPORTS void FAST( InputArray image, CV_OUT Array<KeyPoint>& keypoints,
//                      int threshold, bool nonmaxSuppression, int type );

//! @} features2d_main

//! @addtogroup features2d_main
//! @{

/** @brief Wrapping class for feature detection using the FAST method. :
 */

    enum FastFeatureDetectorType
    {
        TYPE_5_8 = 0, TYPE_7_12 = 1, TYPE_9_16 = 2,
        THRESHOLD = 10000, NONMAX_SUPPRESSION=10001, FAST_N=10002,
    };


interface FastFeatureDetectorStatic {
    create(threshold?: _st.int/*= 10*/,
        nonmaxSuppression? : boolean /*= true*/,
        type?: _st.int /*= FastFeatureDetector::TYPE_9_16*/):FastFeatureDetector;

}

export interface FastFeatureDetector extends Feature2D
{
//public:
//
//
    setThreshold(threshold: _st.int ): void;
    getThreshold(): _st.int;

    setNonmaxSuppression(f : boolean): void;
    getNonmaxSuppression(): boolean;

    setType(type: _st.int ): void;
    getType(): _st.int;
};

export var FastFeatureDetector: FastFeatureDetectorStatic = alvision_module.FastFeatureDetector;

//interface IAGAST {
//    (image: _st.InputArray ,cb : (keypoints : Array<_types.KeyPoint>) => void,
//        threshold : _st.int , nonmaxSuppression : boolean /*= true*/): void;
//}

//export var AGAST: IAGAST = alvision_module.AGAST;

/** @overload */
//CV_EXPORTS void AGAST( InputArray image, CV_OUT Array<KeyPoint>& keypoints,
//                      int threshold, bool nonmaxSuppression=true );

/** @brief Detects corners using the AGAST algorithm

@param image grayscale image where keypoints (corners) are detected.
@param keypoints keypoints detected on the image.
@param threshold threshold on difference between intensity of the central pixel and pixels of a
circle around this pixel.
@param nonmaxSuppression if true, non-maximum suppression is applied to detected corners
(keypoints).
@param type one of the four neighborhoods as defined in the paper:
AgastFeatureDetector::AGAST_5_8, AgastFeatureDetector::AGAST_7_12d,
AgastFeatureDetector::AGAST_7_12s, AgastFeatureDetector::OAST_9_16

For non-Intel platforms, there is a tree optimised variant of AGAST with same numerical results.
The 32-bit binary tree tables were generated automatically from original code using perl script.
The perl script and examples of tree generation are placed in features2d/doc folder.
Detects corners using the AGAST algorithm by @cite mair2010_agast .

 */

interface IAGAST {
    (image: _st.InputArray ,cb:(keypoints : Array<_types.KeyPoint>)=>void,
        threshold: _st.int, nonmaxSuppression: boolean, type: AgastFeatureDetectorTypes): void;
    (image: _st.InputArray, cb: (keypoints: Array<_types.KeyPoint>) => void,
        threshold: _st.int, nonmaxSuppression: boolean /*= true*/): void;
}

export var AGAST: IAGAST = alvision_module.AGAST;

//CV_EXPORTS void AGAST( InputArray image, CV_OUT Array<KeyPoint>& keypoints,
//                      int threshold, bool nonmaxSuppression, int type );


export enum AgastFeatureDetectorTypes
    {
        AGAST_5_8 = 0, AGAST_7_12d = 1, AGAST_7_12s = 2, OAST_9_16 = 3,
        THRESHOLD = 10000, NONMAX_SUPPRESSION = 10001,
    };


//! @} features2d_main

//! @addtogroup features2d_main
//! @{

/** @brief Wrapping class for feature detection using the AGAST method. :
 */

    interface AgastFeatureDetectorStatic {
        create(threshold?: _st.int/*= 10*/,
            nonmaxSuppression? : boolean /*= true*/,
            type?: AgastFeatureDetectorTypes | _st.int /*= AgastFeatureDetector::OAST_9_16*/): AgastFeatureDetector;

    }

interface AgastFeatureDetector extends Feature2D
{
//public:
//
//
    setThreshold( threshold : _st.int): void;
    getThreshold(): _st.int;

    setNonmaxSuppression(f : boolean): void;
    getNonmaxSuppression(): boolean;

    setType(type: AgastFeatureDetectorTypes | _st.int ): void;
    getType(): _st.int;
};

export var AgastFeatureDetector: AgastFeatureDetectorStatic = alvision_module.AgastFeatureDetector;

/** @brief Wrapping class for feature detection using the goodFeaturesToTrack function. :
 */

interface GFTTDetectorStatic {
    create(maxCorners?: _st.int /*= 1000*/, qualityLevel?: _st.double /*= 0.01*/, minDistance?: _st.double /*= 1*/,
        blockSize?: _st.int /*= 3*/, useHarrisDetector?: boolean /*= false*/, k?: _st.double /*= 0.04*/): GFTTDetector;

}

interface GFTTDetector extends Feature2D
{
//public:
    setMaxFeatures(maxFeatures: _st.int ): void;
    getMaxFeatures(): _st.int 

    setQualityLevel(qlevel: _st.double ): void;
    getQualityLevel(): _st.double;

    setMinDistance(minDistance: _st.double ) : void ;
    getMinDistance(): _st.double;

    setBlockSize(blockSize: _st.int): void;
    getBlockSize(): _st.int;

    setHarrisDetector(val : boolean): void 
    getHarrisDetector(): boolean;

    setK(k : _st.double ): void;
    getK(): _st.double;
};

export var GFTTDetector: GFTTDetectorStatic = alvision_module.GFTTDetector;

/** @brief Class for extracting blobs from an image. :

The class implements a simple algorithm for extracting blobs from an image:

1.  Convert the source image to binary images by applying thresholding with several thresholds from
    minThreshold (inclusive) to maxThreshold (exclusive) with distance thresholdStep between
    neighboring thresholds.
2.  Extract connected components from every binary image by findContours and calculate their
    centers.
3.  Group centers from several binary images by their coordinates. Close centers form one group that
    corresponds to one blob, which is controlled by the minDistBetweenBlobs parameter.
4.  From the groups, estimate final centers of blobs and their radiuses and return as locations and
    sizes of keypoints.

This class performs several filtrations of returned blobs. You should set filterBy\* to true/false
to turn on/off corresponding filtration. Available filtrations:

-   **By color**. This filter compares the intensity of a binary image at the center of a blob to
blobColor. If they differ, the blob is filtered out. Use blobColor = 0 to extract dark blobs
and blobColor = 255 to extract light blobs.
-   **By area**. Extracted blobs have an area between minArea (inclusive) and maxArea (exclusive).
-   **By circularity**. Extracted blobs have circularity
(\f$\frac{4*\pi*Area}{perimeter * perimeter}\f$) between minCircularity (inclusive) and
maxCircularity (exclusive).
-   **By ratio of the minimum inertia to maximum inertia**. Extracted blobs have this ratio
between minInertiaRatio (inclusive) and maxInertiaRatio (exclusive).
-   **By convexity**. Extracted blobs have convexity (area / area of blob convex hull) between
minConvexity (inclusive) and maxConvexity (exclusive).

Default values of parameters are tuned to extract dark circular blobs.
 */

interface SimpleBlobDetectorParams {
    //CV_WRAP Params();
    thresholdStep: _st.float;
    minThreshold: _st.float;
    maxThreshold: _st.float;
    minRepeatability: _st.size_t
    minDistBetweenBlobs: _st.float

    filterByColor: boolean;
    blobColor: _st.uchar;

    filterByArea: boolean;
    minArea: _st.float;
    maxArea: _st.float;

    filterByCircularity: boolean;
    minCircularity: _st.float;
    maxCircularity: _st.float;

    filterByInertia: boolean;
    minInertiaRatio: _st.float;
    maxInertiaRatio: _st.float;

    filterByConvexity: boolean;
    minConvexity: _st.float;
    maxConvexity: _st.float;

    read(fn: _persistence.FileNode): void;
    write(fs: _persistence.FileStorage): void;
}


  interface SimpleBlobDetectorStatic {

      create(parameters?: SimpleBlobDetectorParams /*= new SimpleBlobDetectorParams()*/): SimpleBlobDetector;

  }

interface SimpleBlobDetector extends Feature2D
{
//public:

  };

export var SimpleBlobDetector: SimpleBlobDetectorStatic = alvision_module.SimpleBlobDetector;

//! @} features2d_main

//! @addtogroup features2d_main
//! @{

/** @brief Class implementing the KAZE keypoint detector and descriptor extractor, described in @cite ABD12 .

@note AKAZE descriptor can only be used with KAZE or AKAZE keypoints .. [ABD12] KAZE Features. Pablo
F. Alcantarilla, Adrien Bartoli and Andrew J. Davison. In European Conference on Computer Vision
(ECCV), Fiorenze, Italy, October 2012.
*/

enum Diffusivity
    {
        DIFF_PM_G1 = 0,
        DIFF_PM_G2 = 1,
        DIFF_WEICKERT = 2,
        DIFF_CHARBONNIER = 3
    };


interface KAZEStatic {
        /** @brief The KAZE constructor

    @param extended Set to enable extraction of extended (128-byte) descriptor.
    @param upright Set to enable use of upright descriptors (non rotation-invariant).
    @param threshold Detector response threshold to accept point
    @param nOctaves Maximum octave evolution of the image
    @param nOctaveLayers Default number of sublevels per scale level
    @param diffusivity Diffusivity type. DIFF_PM_G1, DIFF_PM_G2, DIFF_WEICKERT or
    DIFF_CHARBONNIER
     */
    create(extended ? : boolean /*= false*/, upright ? : boolean /*= false*/,
        threshold?: _st.float /*= 0.001f*/,
        nOctaves?: _st.int /*= 4*/, nOctaveLayers?: _st.int /*= 4*/,
        diffusivity?: Diffusivity | _st.int /*= KAZE::DIFF_PM_G2*/): KAZE;

}

interface KAZE extends Feature2D
{
//public:


    setExtended(extended : boolean): void;
    getExtended(): boolean;

    setUpright(upright : boolean): void;
    getUpright(): boolean;

    setThreshold(threshold : _st.double): void;
    getThreshold(): _st.double;

    setNOctaves(octaves: _st.int ): void;
    getNOctaves(): _st.int;

    setNOctaveLayers(octaveLayers: _st.int ): void;
    getNOctaveLayers(): _st.int;

    setDiffusivity(diff: _st.int ): void;
    getDiffusivity(): _st.int;
};

export var KAZE: KAZEStatic = alvision_module.KAZE;

/** @brief Class implementing the AKAZE keypoint detector and descriptor extractor, described in @cite ANB13 . :

@note AKAZE descriptors can only be used with KAZE or AKAZE keypoints. Try to avoid using *extract*
and *detect* instead of *operator()* due to performance reasons. .. [ANB13] Fast Explicit Diffusion
for Accelerated Features in Nonlinear Scale Spaces. Pablo F. Alcantarilla, Jesús Nuevo and Adrien
Bartoli. In British Machine Vision Conference (BMVC), Bristol, UK, September 2013.
 */

    export enum DescriptorType
    {
        DESCRIPTOR_KAZE_UPRIGHT = 2, ///< Upright descriptors, not invariant to rotation
        DESCRIPTOR_KAZE = 3,
        DESCRIPTOR_MLDB_UPRIGHT = 4, ///< Upright descriptors, not invariant to rotation
        DESCRIPTOR_MLDB = 5
    };


interface AKAZEStatic {
        /** @brief The AKAZE constructor

    @param descriptor_type Type of the extracted descriptor: DESCRIPTOR_KAZE,
    DESCRIPTOR_KAZE_UPRIGHT, DESCRIPTOR_MLDB or DESCRIPTOR_MLDB_UPRIGHT.
    @param descriptor_size Size of the descriptor in bits. 0 -\> Full size
    @param descriptor_channels Number of channels in the descriptor (1, 2, 3)
    @param threshold Detector response threshold to accept point
    @param nOctaves Maximum octave evolution of the image
    @param nOctaveLayers Default number of sublevels per scale level
    @param diffusivity Diffusivity type. DIFF_PM_G1, DIFF_PM_G2, DIFF_WEICKERT or
    DIFF_CHARBONNIER
     */
    create(descriptor_type?: DescriptorType | _st.int /*= AKAZE::DESCRIPTOR_MLDB*/,
        descriptor_size?: _st.int /*= 0*/, descriptor_channels?: _st.int /*= 3*/,
        threshold?: _st.float /*= 0.001f*/, nOctaves?: _st.int /*= 4*/,
        nOctaveLayers?: _st.int /*= 4*/, diffusivity?: _st.int /*= KAZE::DIFF_PM_G2*/): AKAZE;

}

interface AKAZE extends Feature2D
{
//public:
//    // AKAZE descriptor type


    setDescriptorType(dtype: _st.int): void;
    getDescriptorType(): _st.int;

    setDescriptorSize(dsize: _st.int ): void;
    getDescriptorSize(): _st.int;

    setDescriptorChannels(dch: _st.int ): void;
    getDescriptorChannels(): _st.int;

    setThreshold(threshold: _st.double ): void;
    getThreshold(): _st.double;

    setNOctaves(octaves: _st.int ): void;
    getNOctaves(): _st.int;

    setNOctaveLayers(octaveLayers: _st.int ): void;
    getNOctaveLayers(): _st.int;

    setDiffusivity(diff : _st.int ): void ;
    getDiffusivity(): _st.int;
};

export var AKAZE: AKAZEStatic = alvision_module.AKAZE;

//! @} features2d_main

/****************************************************************************************\
*                                      Distance                                          *
\****************************************************************************************/

//template<typename T>
interface Accumulator<T>
{
//    typedef T Type;
};
//
//template<> struct Accumulator<unsigned char>  { typedef float Type; };
//template<> struct Accumulator<unsigned short> { typedef float Type; };
//template<> struct Accumulator<char>   { typedef float Type; };
//template<> struct Accumulator<short>  { typedef float Type; };

/*
 * Squared Euclidean distance functor
 */
//template<class T>
export interface SL2<T>
{
//    enum { normType = NORM_L2SQR };
//    typedef T ValueType;
//    typedef typename Accumulator<T>::Type ResultType;
//
//    ResultType operator()( const T* a, const T* b, int size ) const
//    {
//        return normL2Sqr<ValueType, ResultType>(a, b, size);
//    }
};

/*
 * Euclidean distance functor
 */
//template<class T>
export interface L2<T>
{
//    enum { normType = NORM_L2 };
//    typedef T ValueType;
//    typedef typename Accumulator<T>::Type ResultType;
//
//    ResultType operator()( const T* a, const T* b, int size ) const
//    {
//        return (ResultType)std::sqrt((double)normL2Sqr<ValueType, ResultType>(a, b, size));
//    }
};

/*
 * Manhattan distance (city block distance) functor
 */
//template<class T>
export interface L1<T>
{
//    enum { normType = NORM_L1 };
//    typedef T ValueType;
//    typedef typename Accumulator<T>::Type ResultType;
//
//    ResultType operator()( const T* a, const T* b, int size ) const
//    {
//        return normL1<ValueType, ResultType>(a, b, size);
//    }
};

/****************************************************************************************\
*                                  DescriptorMatcher                                     *
\****************************************************************************************/

/**
   * Class to work with descriptors from several images as with one merged matrix.
   * It is used e.g. in FlannBasedMatcher.
   */
interface DescriptorCollection {
    //    public:
    //        DescriptorCollection();
    //        DescriptorCollection( const DescriptorCollection& collection );
    //        virtual ~DescriptorCollection();
    //
    //        // Vector of matrices "descriptors" will be merged to one matrix "mergedDescriptors" here.
    //        void set( const Array<Mat>& descriptors );
    //        virtual void clear();
    //
    //        const Mat& getDescriptors() const;
    //        const Mat getDescriptor( int imgIdx, int localDescIdx ) const;
    //        const Mat getDescriptor( int globalDescIdx ) const;
    //        void getLocalIdx( int globalDescIdx, int& imgIdx, int& localDescIdx ) const;
    //
    //        int size() const;
    //
    //    protected:
    //        Mat mergedDescriptors;
    //        Array<int> startIdxs;
};

//! @addtogroup features2d_match
//! @{

/** @brief Abstract base class for matching keypoint descriptors.

It has two groups of match methods: for matching descriptors of an image with another image or with
an image set.
 */
export interface DescriptorMatcherStatic {
         /** @brief Creates a descriptor matcher of a given type with the default parameters (using default
    constructor).

    @param descriptorMatcherType Descriptor matcher type. Now the following matcher types are
    supported:
    -   `BruteForce` (it uses L2 )
    -   `BruteForce-L1`
    -   `BruteForce-Hamming`
    -   `BruteForce-Hamming(2)`
    -   `FlannBased`
     */
    create(descriptorMatcherType : string): DescriptorMatcher;

    isPossibleMatch(mask: _st.InputArray, queryIdx: _st.int, trainIdx: _st.int ): boolean;
    isMaskedOut(masks: _st.InputArrayOfArrays, queryIdx: _st.int ) : boolean;

    //static Mat clone_op( Mat m ) { return m.clone(); }
}

export interface DescriptorMatcher extends Algorithm
{
//public:
//    virtual ~DescriptorMatcher();

    /** @brief Adds descriptors to train a CPU(trainDescCollectionis) or GPU(utrainDescCollectionis) descriptor
    collection.

    If the collection is not empty, the new descriptors are added to existing train descriptors.

    @param descriptors Descriptors to add. Each descriptors[i] is a set of descriptors from the same
    train image.
     */
    add(descriptors: _st.InputArrayOfArrays): void;

    /** @brief Returns a constant link to the train descriptor collection trainDescCollection .
     */
    getTrainDescriptors(): Array<_mat.Mat>;

    /** @brief Clears the train descriptor collections.
     */
    clear(): void;

    /** @brief Returns true if there are no train descriptors in the both collections.
     */
    empty(): boolean;

    /** @brief Returns true if the descriptor matcher supports masking permissible matches.
     */
    isMaskSupported(): boolean;

    /** @brief Trains a descriptor matcher

    Trains a descriptor matcher (for example, the flann index). In all methods to match, the method
    train() is run every time before matching. Some descriptor matchers (for example, BruteForceMatcher)
    have an empty implementation of this method. Other matchers really train their inner structures (for
    example, FlannBasedMatcher trains flann::Index ).
     */
    train(): void;

    /** @brief Finds the best match for each descriptor from a query set.

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
    match(queryDescriptors: _st.InputArray, trainDescriptors: _st.InputArray ,
        cb: (matches: Array<_types.DMatch> )=>void, mask ? : _st.InputArray /*= noArray()*/) : void;

    /** @brief Finds the k best matches for each descriptor from a query set.

    @param queryDescriptors Query set of descriptors.
    @param trainDescriptors Train set of descriptors. This set is not added to the train descriptors
    collection stored in the class object.
    @param mask Mask specifying permissible matches between an input query and train matrices of
    descriptors.
    @param matches Matches. Each matches[i] is k or less matches for the same query descriptor.
    @param k Count of best matches found per each query descriptor or less if a query descriptor has
    less than k possible matches in total.
    @param compactResult Parameter used when the mask (or masks) is not empty. If compactResult is
    false, the matches vector has the same size as queryDescriptors rows. If compactResult is true,
    the matches vector does not contain matches for fully masked-out query descriptors.

    These extended variants of DescriptorMatcher::match methods find several best matches for each query
    descriptor. The matches are returned in the distance increasing order. See DescriptorMatcher::match
    for the details about query and train descriptors.
     */
    knnMatch(queryDescriptors: _st.InputArray, trainDescriptors: _st.InputArray ,
        cb: (matches: Array<Array<_types.DMatch>>) => void, k: _st.int ,
        mask?: _st.InputArray /*= noArray()*/, compactResult ? : boolean /*= false*/) : void;

    /** @brief For each query descriptor, finds the training descriptors not farther than the specified distance.

    @param queryDescriptors Query set of descriptors.
    @param trainDescriptors Train set of descriptors. This set is not added to the train descriptors
    collection stored in the class object.
    @param matches Found matches.
    @param compactResult Parameter used when the mask (or masks) is not empty. If compactResult is
    false, the matches vector has the same size as queryDescriptors rows. If compactResult is true,
    the matches vector does not contain matches for fully masked-out query descriptors.
    @param maxDistance Threshold for the distance between matched descriptors. Distance means here
    metric distance (e.g. Hamming distance), not the distance between coordinates (which is measured
    in Pixels)!
    @param mask Mask specifying permissible matches between an input query and train matrices of
    descriptors.

    For each query descriptor, the methods find such training descriptors that the distance between the
    query descriptor and the training descriptor is equal or smaller than maxDistance. Found matches are
    returned in the distance increasing order.
     */
    radiusMatch(queryDescriptors: _st.InputArray, trainDescriptors: _st.InputArray ,
        matches: Array<Array<_types.DMatch>>, maxDistance: _st.float ,
        mask?: _st.InputArray /*= noArray()*/, compactResult ? : boolean /*= false*/): void;

    /** @overload
    @param queryDescriptors Query set of descriptors.
    @param matches Matches. If a query descriptor is masked out in mask , no match is added for this
    descriptor. So, matches size may be smaller than the query descriptors count.
    @param masks Set of masks. Each masks[i] specifies permissible matches between the input query
    descriptors and stored train descriptors from the i-th image trainDescCollection[i].
    */
    match(queryDescriptors: _st.InputArray, cb: (matches: Array<_types.DMatch>)=>void,
        masks?: _st.InputArrayOfArrays /*= noArray()*/) : void ;
    /** @overload
    @param queryDescriptors Query set of descriptors.
    @param matches Matches. Each matches[i] is k or less matches for the same query descriptor.
    @param k Count of best matches found per each query descriptor or less if a query descriptor has
    less than k possible matches in total.
    @param masks Set of masks. Each masks[i] specifies permissible matches between the input query
    descriptors and stored train descriptors from the i-th image trainDescCollection[i].
    @param compactResult Parameter used when the mask (or masks) is not empty. If compactResult is
    false, the matches vector has the same size as queryDescriptors rows. If compactResult is true,
    the matches vector does not contain matches for fully masked-out query descriptors.
    */
    knnMatch(queryDescriptors: _st.InputArray, cb: (matches: Array<Array<_types.DMatch>>) => void, k: _st.int ,
        masks?: _st.InputArrayOfArrays /*= noArray()*/, compactResult?: boolean/*= false*/) : void;
    /** @overload
    @param queryDescriptors Query set of descriptors.
    @param matches Found matches.
    @param maxDistance Threshold for the distance between matched descriptors. Distance means here
    metric distance (e.g. Hamming distance), not the distance between coordinates (which is measured
    in Pixels)!
    @param masks Set of masks. Each masks[i] specifies permissible matches between the input query
    descriptors and stored train descriptors from the i-th image trainDescCollection[i].
    @param compactResult Parameter used when the mask (or masks) is not empty. If compactResult is
    false, the matches vector has the same size as queryDescriptors rows. If compactResult is true,
    the matches vector does not contain matches for fully masked-out query descriptors.
    */
    radiusMatch(queryDescriptors: _st.InputArray, cb: (matches: Array<Array<_types.DMatch>>) => void, maxDistance: _st.float ,
        masks?: _st.InputArrayOfArrays /*= noArray()*/, compactResult? : boolean/* = false*/): void;

    // Reads matcher object from a file node
    read( fn : _persistence.FileNode ) : void;
    // Writes matcher object to a file storage
    write(fs : _persistence.FileStorage ) : void;

    /** @brief Clones the matcher.

    @param emptyTrainData If emptyTrainData is false, the method creates a deep copy of the object,
    that is, copies both parameters and train data. If emptyTrainData is true, the method creates an
    object copy with the current parameters but with empty train data.
     */
    clone(emptyTrainData? : boolean/*= false*/): DescriptorMatcher;

   
//protected:
  

    //! In fact the matching is implemented only by the following two methods. These methods suppose
    //! that the class object has been trained already. Public match methods call these methods
    //! after calling train().
//    virtual void knnMatchImpl( InputArray queryDescriptors, Array<Array<DMatch> >& matches, int k,
//        InputArrayOfArrays masks=noArray(), bool compactResult=false ) = 0;
//    virtual void radiusMatchImpl( InputArray queryDescriptors, Array<Array<DMatch> >& matches, float maxDistance,
//        InputArrayOfArrays masks=noArray(), bool compactResult=false ) = 0;
//
//    void checkMasks( InputArrayOfArrays masks, int queryDescriptorsCount ) const;

    //! Collection of descriptors from train images.
//    Array<Mat> trainDescCollection;
//    Array<UMat> utrainDescCollection;
};

export var DescriptorMatcher: DescriptorMatcherStatic = alvision_module.DescriptorMatcher;

/** @brief Brute-force descriptor matcher.

For each descriptor in the first set, this matcher finds the closest descriptor in the second set
by trying each one. This descriptor matcher supports masking permissible matches of descriptor
sets.
 */

interface BFMatcherStatic {
    /** @brief Brute-force matcher constructor.

    @param normType One of NORM_L1, NORM_L2, NORM_HAMMING, NORM_HAMMING2. L1 and L2 norms are
    preferable choices for SIFT and SURF descriptors, NORM_HAMMING should be used with ORB, BRISK and
    BRIEF, NORM_HAMMING2 should be used with ORB when WTA_K==3 or 4 (see ORB::ORB constructor
    description).
    @param crossCheck If it is false, this is will be default BFMatcher behaviour when it finds the k
    nearest neighbors for each query descriptor. If crossCheck==true, then the knnMatch() method with
    k=1 will only return pairs (i,j) such that for i-th query descriptor the j-th descriptor in the
    matcher's collection is the nearest and vice versa, i.e. the BFMatcher will only return consistent
    pairs. Such technique usually produces best results with minimal number of outliers when there are
    enough matches. This is alternative to the ratio test, used by D. Lowe in SIFT paper.
     */
    new (normType?: _base.NormTypes | _st.int /*= NORM_L2*/, crossCheck ? : boolean /*= false*/): BFMatcher;
//    virtual ~BFMatcher() {}

}

interface BFMatcher extends DescriptorMatcher {
    //public:
    //
    isMaskSupported(): boolean;
    //
    clone(emptyTrainData?: boolean /*= false*/): DescriptorMatcher
    //protected:
    knnMatchImpl(queryDescriptors: _st.InputArray, matches: Array<Array<_types.DMatch>>, k: _st.int, masks?: _st.InputArrayOfArrays /*=noArray()*/, compactResult?: boolean /*=false */): void;
    radiusMatchImpl(queryDescriptors: _st.InputArray, matches: Array<Array<_types.DMatch>>, maxDistance: _st.float,
        masks?: _st.InputArrayOfArrays /*=noArray()*/, compactResult?: boolean /*=false */): void;

    normType: _st.int;
    crossCheck: boolean;
}

export var BFMatcher: BFMatcherStatic = alvision_module.BFMatcher;


/** @brief Flann-based descriptor matcher.

This matcher trains flann::Index_ on a train descriptor collection and calls its nearest search
methods to find the best matches. So, this matcher may be faster when matching a large train
collection than the brute force matcher. FlannBasedMatcher does not support masking permissible
matches of descriptor sets because flann::Index does not support this. :
 */
interface FlannBasedMatcher extends DescriptorMatcher
{
//public:
//    CV_WRAP FlannBasedMatcher( const Ptr<flann::IndexParams>& indexParams=makePtr<flann::KDTreeIndexParams>(),
//                       const Ptr<flann::SearchParams>& searchParams=makePtr<flann::SearchParams>() );
//
//    virtual void add( InputArrayOfArrays descriptors );
//    virtual void clear();
//
//    // Reads matcher object from a file node
//    virtual void read( const FileNode& );
//    // Writes matcher object to a file storage
//    virtual void write( FileStorage& ) const;
//
//    virtual void train();
//    virtual bool isMaskSupported() const;
//
//    virtual Ptr<DescriptorMatcher> clone( bool emptyTrainData=false ) const;
//protected:
//    static void convertToDMatches( const DescriptorCollection& descriptors,
//                                   const Mat& indices, const Mat& distances,
//                                   Array<Array<DMatch> >& matches );
//
//    virtual void knnMatchImpl( InputArray queryDescriptors, Array<Array<DMatch> >& matches, int k,
//        InputArrayOfArrays masks=noArray(), bool compactResult=false );
//    virtual void radiusMatchImpl( InputArray queryDescriptors, Array<Array<DMatch> >& matches, float maxDistance,
//        InputArrayOfArrays masks=noArray(), bool compactResult=false );
//
//    Ptr<flann::IndexParams> indexParams;
//    Ptr<flann::SearchParams> searchParams;
//    Ptr<flann::Index> flannIndex;
//
//    DescriptorCollection mergedDescriptors;
//    int addedDescCount;
};

//! @} features2d_match

/****************************************************************************************\
*                                   Drawing functions                                    *
\****************************************************************************************/

//! @addtogroup features2d_draw
//! @{

//struct DrawMatchesFlags
//{
//    enum{ DEFAULT = 0, //!< Output image matrix will be created (Mat::create),
//                       //!< i.e. existing memory of output image may be reused.
//                       //!< Two source image, matches and single keypoints will be drawn.
//                       //!< For each keypoint only the center point will be drawn (without
//                       //!< the circle around keypoint with keypoint size and orientation).
//          DRAW_OVER_OUTIMG = 1, //!< Output image matrix will not be created (Mat::create).
//                                //!< Matches will be drawn on existing content of output image.
//          NOT_DRAW_SINGLE_POINTS = 2, //!< Single keypoints will not be drawn.
//          DRAW_RICH_KEYPOINTS = 4 //!< For each keypoint the circle around keypoint with keypoint size and
//                                  //!< orientation will be drawn.
//        };
//};

/** @brief Draws keypoints.

@param image Source image.
@param keypoints Keypoints from the source image.
@param outImage Output image. Its content depends on the flags value defining what is drawn in the
output image. See possible flags bit values below.
@param color Color of keypoints.
@param flags Flags setting drawing features. Possible flags bit values are defined by
DrawMatchesFlags. See details above in drawMatches .

@note
For Python API, flags are modified as cv2.DRAW_MATCHES_FLAGS_DEFAULT,
cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS, cv2.DRAW_MATCHES_FLAGS_DRAW_OVER_OUTIMG,
cv2.DRAW_MATCHES_FLAGS_NOT_DRAW_SINGLE_POINTS
 */

interface IdrawKeypoints {
//    (InputArray image, const Array<KeyPoint>& keypoints, InputOutputArray outImage,
//                               const Scalar& color=Scalar::all(-1), int flags= DrawMatchesFlags::DEFAULT): void;
}

export var drawKeypoints: IdrawKeypoints = alvision_module.drawKeypoints;

//CV_EXPORTS_W void drawKeypoints( InputArray image, const Array<KeyPoint>& keypoints, InputOutputArray outImage,
//                               const Scalar& color=Scalar::all(-1), int flags=DrawMatchesFlags::DEFAULT );

/** @brief Draws the found matches of keypoints from two images.

@param img1 First source image.
@param keypoints1 Keypoints from the first source image.
@param img2 Second source image.
@param keypoints2 Keypoints from the second source image.
@param matches1to2 Matches from the first image to the second one, which means that keypoints1[i]
has a corresponding point in keypoints2[matches[i]] .
@param outImg Output image. Its content depends on the flags value defining what is drawn in the
output image. See possible flags bit values below.
@param matchColor Color of matches (lines and connected keypoints). If matchColor==Scalar::all(-1)
, the color is generated randomly.
@param singlePointColor Color of single keypoints (circles), which means that keypoints do not
have the matches. If singlePointColor==Scalar::all(-1) , the color is generated randomly.
@param matchesMask Mask determining which matches are drawn. If the mask is empty, all matches are
drawn.
@param flags Flags setting drawing features. Possible flags bit values are defined by
DrawMatchesFlags.

This function draws matches of keypoints from two images in the output image. Match is a line
connecting two keypoints (circles). See cv::DrawMatchesFlags.
 */
//CV_EXPORTS_W void drawMatches( InputArray img1, const Array<KeyPoint>& keypoints1,
//                             InputArray img2, const Array<KeyPoint>& keypoints2,
//                             const Array<DMatch>& matches1to2, InputOutputArray outImg,
//                             const Scalar& matchColor=Scalar::all(-1), const Scalar& singlePointColor=Scalar::all(-1),
//                             const Array<char>& matchesMask=Array<char>(), int flags=DrawMatchesFlags::DEFAULT );
//
///** @overload */
//CV_EXPORTS_AS(drawMatchesKnn) void drawMatches( InputArray img1, const Array<KeyPoint>& keypoints1,
//                             InputArray img2, const Array<KeyPoint>& keypoints2,
//                             const Array<Array<DMatch> >& matches1to2, InputOutputArray outImg,
//                             const Scalar& matchColor=Scalar::all(-1), const Scalar& singlePointColor=Scalar::all(-1),
//                             const Array<Array<char> >& matchesMask=Array<Array<char> >(), int flags=DrawMatchesFlags::DEFAULT );
//
////! @} features2d_draw
//
///****************************************************************************************\
//*   Functions to evaluate the feature detectors and [generic] descriptor extractors      *
//\****************************************************************************************/
//
//CV_EXPORTS void evaluateFeatureDetector( const Mat& img1, const Mat& img2, const Mat& H1to2,
//                                         Array<KeyPoint>* keypoints1, Array<KeyPoint>* keypoints2,
//                                         float& repeatability, int& correspCount,
//                                         const Ptr<FeatureDetector>& fdetector=Ptr<FeatureDetector>() );
//
//CV_EXPORTS void computeRecallPrecisionCurve( const Array<Array<DMatch> >& matches1to2,
//                                             const Array<Array<uchar> >& correctMatches1to2Mask,
//                                             Array<Point2f>& recallPrecisionCurve );
//
//CV_EXPORTS float getRecall( const Array<Point2f>& recallPrecisionCurve, float l_precision );
//CV_EXPORTS int getNearestPoint( const Array<Point2f>& recallPrecisionCurve, float l_precision );

/****************************************************************************************\
*                                     Bag of visual words                                *
\****************************************************************************************/

//! @addtogroup features2d_category
//! @{

/** @brief Abstract base class for training the *bag of visual words* vocabulary from a set of descriptors.

For details, see, for example, *Visual Categorization with Bags of Keypoints* by Gabriella Csurka,
Christopher R. Dance, Lixin Fan, Jutta Willamowski, Cedric Bray, 2004. :
 */
interface BOWTrainer
{
//public:
//    BOWTrainer();
//    virtual ~BOWTrainer();
//
//    /** @brief Adds descriptors to a training set.
//
//    @param descriptors Descriptors to add to a training set. Each row of the descriptors matrix is a
//    descriptor.
//
//    The training set is clustered using clustermethod to construct the vocabulary.
//     */
//    CV_WRAP void add( const Mat& descriptors );
//
//    /** @brief Returns a training set of descriptors.
//    */
//    CV_WRAP const Array<Mat>& getDescriptors() const;
//
//    /** @brief Returns the count of all descriptors stored in the training set.
//    */
//    CV_WRAP int descriptorsCount() const;
//
//    CV_WRAP virtual void clear();
//
//    /** @overload */
//    CV_WRAP virtual Mat cluster() 
//
//    /** @brief Clusters train descriptors.
//
//    @param descriptors Descriptors to cluster. Each row of the descriptors matrix is a descriptor.
//    Descriptors are not added to the inner train descriptor set.
//
//    The vocabulary consists of cluster centers. So, this method returns the vocabulary. In the first
//    variant of the method, train descriptors stored in the object are clustered. In the second variant,
//    input descriptors are clustered.
//     */
//    CV_WRAP virtual Mat cluster( const Mat& descriptors ) 
//
//protected:
//    Array<Mat> descriptors;
//    int size;
};

/** @brief kmeans -based class to train visual vocabulary using the *bag of visual words* approach. :
 */
interface BOWKMeansTrainer extends BOWTrainer
{
//public:
//    /** @brief The constructor.
//
//    @see cv::kmeans
//    */
//    CV_WRAP BOWKMeansTrainer( int clusterCount, const TermCriteria& termcrit=TermCriteria(),
//                      int attempts=3, int flags=KMEANS_PP_CENTERS );
//    virtual ~BOWKMeansTrainer();
//
//    // Returns trained vocabulary (i.e. cluster centers).
//    CV_WRAP virtual Mat cluster() const;
//    CV_WRAP virtual Mat cluster( const Mat& descriptors ) const;
//
//protected:
//
//    int clusterCount;
//    TermCriteria termcrit;
//    int attempts;
//    int flags;
};

/** @brief Class to compute an image descriptor using the *bag of visual words*.

Such a computation consists of the following steps:

1.  Compute descriptors for a given image and its keypoints set.
2.  Find the nearest visual words from the vocabulary for each keypoint descriptor.
3.  Compute the bag-of-words image descriptor as is a normalized histogram of vocabulary words
encountered in the image. The i-th bin of the histogram is a frequency of i-th word of the
vocabulary in the given image.
 */
interface BOWImgDescriptorExtractor
{
//public:
//    /** @brief The constructor.
//
//    @param dextractor Descriptor extractor that is used to compute descriptors for an input image and
//    its keypoints.
//    @param dmatcher Descriptor matcher that is used to find the nearest word of the trained vocabulary
//    for each keypoint descriptor of the image.
//     */
//    CV_WRAP BOWImgDescriptorExtractor( const Ptr<DescriptorExtractor>& dextractor,
//                               const Ptr<DescriptorMatcher>& dmatcher );
//    /** @overload */
//    BOWImgDescriptorExtractor( const Ptr<DescriptorMatcher>& dmatcher );
//    virtual ~BOWImgDescriptorExtractor();
//
//    /** @brief Sets a visual vocabulary.
//
//    @param vocabulary Vocabulary (can be trained using the inheritor of BOWTrainer ). Each row of the
//    vocabulary is a visual word (cluster center).
//     */
//    CV_WRAP void setVocabulary( const Mat& vocabulary );
//
//    /** @brief Returns the set vocabulary.
//    */
//    CV_WRAP const Mat& getVocabulary() const;
//
//    /** @brief Computes an image descriptor using the set visual vocabulary.
//
//    @param image Image, for which the descriptor is computed.
//    @param keypoints Keypoints detected in the input image.
//    @param imgDescriptor Computed output image descriptor.
//    @param pointIdxsOfClusters Indices of keypoints that belong to the cluster. This means that
//    pointIdxsOfClusters[i] are keypoint indices that belong to the i -th cluster (word of vocabulary)
//    returned if it is non-zero.
//    @param descriptors Descriptors of the image keypoints that are returned if they are non-zero.
//     */
//    void compute( InputArray image, Array<KeyPoint>& keypoints, OutputArray imgDescriptor,
//                  Array<Array<int> >* pointIdxsOfClusters=0, Mat* descriptors=0 );
//    /** @overload
//    @param keypointDescriptors Computed descriptors to match with vocabulary.
//    @param imgDescriptor Computed output image descriptor.
//    @param pointIdxsOfClusters Indices of keypoints that belong to the cluster. This means that
//    pointIdxsOfClusters[i] are keypoint indices that belong to the i -th cluster (word of vocabulary)
//    returned if it is non-zero.
//    */
//    void compute( InputArray keypointDescriptors, OutputArray imgDescriptor,
//                  Array<Array<int> >* pointIdxsOfClusters=0 );
//    // compute() is not constant because DescriptorMatcher::match is not constant
//
//    CV_WRAP_AS(compute) void compute2( const Mat& image, Array<KeyPoint>& keypoints, CV_OUT Mat& imgDescriptor )
//    { compute(image,keypoints,imgDescriptor); }
//
//    /** @brief Returns an image descriptor size if the vocabulary is set. Otherwise, it returns 0.
//    */
//    CV_WRAP int descriptorSize() const;
//
//    /** @brief Returns an image descriptor type.
//     */
//    CV_WRAP int descriptorType() const;
//
//protected:
//    Mat vocabulary;
//    Ptr<DescriptorExtractor> dextractor;
//    Ptr<DescriptorMatcher> dmatcher;
};

//! @} features2d_category

//! @} features2d

//} /* namespace cv */

//#endif
