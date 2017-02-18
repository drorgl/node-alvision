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

////// <reference path="Matrix.ts" />
import alvision_module from "../bindings";

//import * as _constants from './Constants'
import * as _st from './static';
import * as _mat from './Mat';
import * as _types from './Types';
import * as _core from './Core';
import * as _base from './Base';
import * as _persistence from './persistence';
//import * as _scalar from './Scalar'

//#ifndef __OPENCV_OBJDETECT_HPP__
//#define __OPENCV_OBJDETECT_HPP__
//
//#include "opencv2/core.hpp"

/**
@defgroup objdetect Object Detection

Haar Feature-based Cascade Classifier for Object Detection
----------------------------------------------------------

The object detector described below has been initially proposed by Paul Viola @cite Viola01 and
improved by Rainer Lienhart @cite Lienhart02 .

First, a classifier (namely a *cascade of boosted classifiers working with haar-like features*) is
trained with a few hundred sample views of a particular object (i.e., a face or a car), called
positive examples, that are scaled to the same size (say, 20x20), and negative examples - arbitrary
images of the same size.

After a classifier is trained, it can be applied to a region of interest (of the same size as used
during the training) in an input image. The classifier outputs a "1" if the region is likely to show
the object (i.e., face/car), and "0" otherwise. To search for the object in the whole image one can
move the search window across the image and check every location using the classifier. The
classifier is designed so that it can be easily "resized" in order to be able to find the objects of
interest at different sizes, which is more efficient than resizing the image itself. So, to find an
object of an unknown size in the image the scan procedure should be done several times at different
scales.

The word "cascade" in the classifier name means that the resultant classifier consists of several
simpler classifiers (*stages*) that are applied subsequently to a region of interest until at some
stage the candidate is rejected or all the stages are passed. The word "boosted" means that the
classifiers at every stage of the cascade are complex themselves and they are built out of basic
classifiers using one of four different boosting techniques (weighted voting). Currently Discrete
Adaboost, Real Adaboost, Gentle Adaboost and Logitboost are supported. The basic classifiers are
decision-tree classifiers with at least 2 leaves. Haar-like features are the input to the basic
classifiers, and are calculated as described below. The current algorithm uses the following
Haar-like features:

![image](pics/haarfeatures.png)

The feature used in a particular classifier is specified by its shape (1a, 2b etc.), position within
the region of interest and the scale (this scale is not the same as the scale used at the detection
stage, though these two scales are multiplied). For example, in the case of the third line feature
(2c) the response is calculated as the difference between the sum of image pixels under the
rectangle covering the whole feature (including the two white stripes and the black stripe in the
middle) and the sum of the image pixels under the black stripe multiplied by 3 in order to
compensate for the differences in the size of areas. The sums of pixel values over a rectangular
regions are calculated rapidly using integral images (see below and the integral description).

To see the object detector at work, have a look at the facedetect demo:
<https://github.com/Itseez/opencv/tree/master/samples/cpp/dbt_face_detection.cpp>

The following reference is for the detection part only. There is a separate application called
opencv_traincascade that can train a cascade of boosted classifiers from a set of samples.

@note In the new C++ interface it is also possible to use LBP (local binary pattern) features in
addition to Haar-like features. .. [Viola01] Paul Viola and Michael J. Jones. Rapid Object Detection
using a Boosted Cascade of Simple Features. IEEE CVPR, 2001. The paper is available online at
<http://research.microsoft.com/en-us/um/people/viola/Pubs/Detect/violaJones_CVPR2001.pdf>

@{
    @defgroup objdetect_c C API
@}
 */

//typedef struct CvHaarClassifierCascade CvHaarClassifierCascade;

//namespace cv
//{

//! @addtogroup objdetect
//! @{

///////////////////////////// Object Detection ////////////////////////////

//! class for grouping object candidates, detected by Cascade Classifier, HOG etc.
//! instance of the class is to be passed to cv::partition (see cxoperations.hpp)
class SimilarRects
{

//public:
    constructor(_eps: _st.double) {
        this.eps = _eps;
}
//    inline bool operator()(const Rect& r1, const Rect& r2) const
//    {
//        double delta = eps*(std::min(r1.width, r2.width) + std::min(r1.height, r2.height))*0.5;
//        return std::abs(r1.x - r2.x) <= delta &&
//            std::abs(r1.y - r2.y) <= delta &&
//            std::abs(r1.x + r1.width - r2.x - r2.width) <= delta &&
//            std::abs(r1.y + r1.height - r2.y - r2.height) <= delta;
//    }
    public eps: _st.double;
};

/** @brief Groups the object candidate rectangles.

@param rectList Input/output vector of rectangles. Output vector includes retained and grouped
rectangles. (The Python list is not modified in place.)
@param groupThreshold Minimum possible number of rectangles minus 1. The threshold is used in a
group of rectangles to retain it.
@param eps Relative difference between sides of the rectangles to merge them into a group.

The function is a wrapper for the generic function partition . It clusters all the input rectangles
using the rectangle equivalence criteria that combines rectangles with similar sizes and similar
locations. The similarity is defined by eps. When eps=0 , no clustering is done at all. If
\f$\texttt{eps}\rightarrow +\inf\f$ , all the rectangles are put in one cluster. Then, the small
clusters containing less than or equal to groupThreshold rectangles are rejected. In each other
cluster, the average rectangle is computed and put into the output rectangle list.
 */
interface IgroupRectangles {
    (rectList: Array<_types.Rect>, groupThreshold: _st.int, eps?: _st.double /* = 0.2*/): void;
    (rectList: Array<_types.Rect>, cb: (rectList: Array<_types.Rect>, weights: Array<_st.int>) => void, groupThreshold: _st.int, eps?: _st.double /* = 0.2*/): void;
    (rectList: Array<_types.Rect>, groupThreshold: _st.int, eps: _st.double, cb: (weights: Array<_st.int>, levelWeights: Array<_st.double>)=>void): void;
}

export var groupRectangles: IgroupRectangles = alvision_module.groupRectangles;

//CV_EXPORTS   void groupRectangles(std::vector<Rect>& rectList, int groupThreshold, double eps = 0.2);
///** @overload */


//CV_EXPORTS_W void groupRectangles(CV_IN_OUT std::vector<Rect>& rectList, CV_OUT std::vector<int>& weights,
//                                  int groupThreshold, double eps = 0.2);
///** @overload */
//CV_EXPORTS   void groupRectangles(std::vector<Rect>& rectList, int groupThreshold,
//                                  double eps, std::vector<int>* weights, std::vector<double>* levelWeights );
///** @overload */
//CV_EXPORTS   void groupRectangles(std::vector<Rect>& rectList, std::vector<int>& rejectLevels,
//                                  std::vector<double>& levelWeights, int groupThreshold, double eps = 0.2);
///** @overload */
interface IgroupRectangles_meanshift {
    (rectList: Array<_types.Rect>, foundWeights: Array<_st.double> ,
        foundScales: Array<_st.double> ,
        detectThreshold?: _st.double /*= 0.0*/, winDetSize?: _types.Size /*  = Size(64, 128)*/): void;
}

export var groupRectangles_meanshift: IgroupRectangles_meanshift = alvision_module.groupRectangles_meanshift;
//CV_EXPORTS   void groupRectangles_meanshift(std::vector<Rect>& rectList, std::vector<double>& foundWeights,
//                                            std::vector<double>& foundScales,
//                                            double detectThreshold = 0.0, Size winDetSize = Size(64, 128));
//
//template<> CV_EXPORTS void DefaultDeleter<CvHaarClassifierCascade>::operator ()(CvHaarClassifierCascade* obj) const;

export enum CASCADE { CASCADE_DO_CANNY_PRUNING    = 1,
       CASCADE_SCALE_IMAGE         = 2,
       CASCADE_FIND_BIGGEST_OBJECT = 4,
       CASCADE_DO_ROUGH_SEARCH     = 8
     };

interface BaseCascadeClassifier extends _core.Algorithm
{
//public:
//    virtual ~BaseCascadeClassifier();
    empty(): boolean;
//    virtual bool empty() const = 0;
    load(filename: string): boolean;
//    virtual bool load( const String& filename ) = 0;
    detectMultiScale(image: _st.InputArray, cb: (objects: Array<_types.Rect>, numDetections: Array<_st.int>, levelWeights: Array<_st.double>) => void, scaleFactor: _st.double, minNeighbors: _st.int, flags: _st.int, minSize: _types.Size, maxSize: _types.Size): void;
//    virtual void detectMultiScale( InputArray image,
//                           CV_OUT std::vector<Rect>& objects,
//                           double scaleFactor,
//                           int minNeighbors, int flags,
//                           Size minSize, Size maxSize ) = 0;
//

//    virtual void detectMultiScale( InputArray image,
//                           CV_OUT std::vector<Rect>& objects,
//                           CV_OUT std::vector<int>& numDetections,
//                           double scaleFactor,
//                           int minNeighbors, int flags,
//                           Size minSize, Size maxSize ) = 0;
//
//    virtual void detectMultiScale( InputArray image,
//                                   CV_OUT std::vector<Rect>& objects,
//                                   CV_OUT std::vector<int>& rejectLevels,
//                                   CV_OUT std::vector<double>& levelWeights,
//                                   double scaleFactor,
//                                   int minNeighbors, int flags,
//                                   Size minSize, Size maxSize,
//                                   bool outputRejectLevels ) = 0;
//

    isOldFormatCascade(): boolean;
    getOriginalWindowSize(): _types.Size;
    getFeatureType(): _st.int;
    getOldCascade(): void;
//
//    class CV_EXPORTS MaskGenerator
//    {
//    public:
//        virtual ~MaskGenerator() {}
//        virtual Mat generateMask(const Mat& src)=0;
//        virtual void initializeMask(const Mat& /*src*/) { }
//    };
//    virtual void setMaskGenerator(const Ptr<MaskGenerator>& maskGenerator) = 0;
//    virtual Ptr<MaskGenerator> getMaskGenerator() = 0;
};

/** @brief Cascade classifier class for object detection.
 */
interface CascadeClassifierStatic {
    new (): CascadeClassifier;
    /** @brief Loads a classifier from a file.

    @param filename Name of the file from which the classifier is loaded.
     */
    new (filename : string): CascadeClassifier;
//    ~CascadeClassifier();

}

interface CascadeClassifier
{
//public:
    /** @brief Checks whether the classifier has been loaded.
    */
    empty(): boolean;
    /** @brief Loads a classifier from a file.

    @param filename Name of the file from which the classifier is loaded. The file may contain an old
    HAAR classifier trained by the haartraining application or a new cascade classifier trained by the
    traincascade application.
     */
    load( filename : string): boolean;
    /** @brief Reads a classifier from a FileStorage node.

    @note The file may contain a new cascade classifier (trained traincascade application) only.
     */
    read(node: _persistence.FileNode): boolean;

    /** @brief Detects objects of different sizes in the input image. The detected objects are returned as a list
    of rectangles.

    @param image Matrix of the type CV_8U containing an image where objects are detected.
    @param objects Vector of rectangles where each rectangle contains the detected object, the
    rectangles may be partially outside the original image.
    @param scaleFactor Parameter specifying how much the image size is reduced at each image scale.
    @param minNeighbors Parameter specifying how many neighbors each candidate rectangle should have
    to retain it.
    @param flags Parameter with the same meaning for an old cascade as in the function
    cvHaarDetectObjects. It is not used for a new cascade.
    @param minSize Minimum possible object size. Objects smaller than that are ignored.
    @param maxSize Maximum possible object size. Objects larger than that are ignored.

    The function is parallelized with the TBB library.

    @note
       -   (Python) A face detection example using cascade classifiers can be found at
            opencv_source_code/samples/python/facedetect.py
    */
    detectMultiScale(image: _st.InputArray,
                          cb : (objects : Array<_types.Rect>)=>void,
                          scaleFactor?: _st.double /*= 1.1*/,
                          minNeighbors?: _st.int /*= 3*/, flags?: _st.int /* = 0*/,
                          minSize?: _types.Size /*= Size()*/,
                          maxSize?: _types.Size /*= Size()*/): void;

    /** @overload
    @param image Matrix of the type CV_8U containing an image where objects are detected.
    @param objects Vector of rectangles where each rectangle contains the detected object, the
    rectangles may be partially outside the original image.
    @param numDetections Vector of detection numbers for the corresponding objects. An object's number
    of detections is the number of neighboring positively classified rectangles that were joined
    together to form the object.
    @param scaleFactor Parameter specifying how much the image size is reduced at each image scale.
    @param minNeighbors Parameter specifying how many neighbors each candidate rectangle should have
    to retain it.
    @param flags Parameter with the same meaning for an old cascade as in the function
    cvHaarDetectObjects. It is not used for a new cascade.
    @param minSize Minimum possible object size. Objects smaller than that are ignored.
    @param maxSize Maximum possible object size. Objects larger than that are ignored.
    */
    detectMultiScale(image: _st.InputArray,
                        cb : (objects : Array<_types.Rect>, numDetections : Array<_st.int>)=>void,
                        scaleFactor?: _st.double /*=1.1*/,
                        minNeighbors?: _st.int /*=3*/, flags?: _st.int /*=0*/,
                        minSize?: _types.Size /*=Size()*/,
                        maxSize?: _types.Size /*= Size()*/): void;

    /** @overload
    if `outputRejectLevels` is `true` returns `rejectLevels` and `levelWeights`
    */
    detectMultiScale(image: _st.InputArray,
                        cb : (objects : Array<_types.Rect>,
                              rejectLevels : Array<_st.int>,
                              levelWeights : Array<_st.double>)=>void,
                        scaleFactor?: _st.double /* = 1.1*/,
                        minNeighbors?: _st.int /*= 3*/, flags?: _st.int /*= 0*/,
                        minSize?: _types.Size /*= Size()*/,
                        maxSize?: _types.Size /*= Size()*/,
                                  outputRejectLevels  ?: boolean /*= false*/ ) : void;

     isOldFormatCascade(): boolean;
     getOriginalWindowSize(): _types.Size;
     getFeatureType(): _st.int;

     //getOldCascade(): any; //??????

     convert(oldcascade: string, newcascade: string): boolean;

     //setMaskGenerator(const Ptr<BaseCascadeClassifier::MaskGenerator>& maskGenerator) : void;
    //Ptr<BaseCascadeClassifier::MaskGenerator> getMaskGenerator();

    //Ptr<BaseCascadeClassifier> cc;
};

export var CascadeClassifier: CascadeClassifierStatic = alvision_module.CascadeClassifier;

//interface IcreateFaceDetectionMaskGenerator{
    //() : BaseCascadeClassifier::MaskGenerator
//}
//CV_EXPORTS Ptr<BaseCascadeClassifier::MaskGenerator> createFaceDetectionMaskGenerator();

//////////////// HOG (Histogram-of-Oriented-Gradients) Descriptor and Object Detector //////////////

//! struct for detection region of interest (ROI)
class DetectionROI {
    //! scale(size) of the bounding box
    public scale: _st.double;
    //! set of requrested locations to be evaluated
    public locations: Array<_types.Point>;
    //! vector that will contain confidence values for each location
    public confidences: Array<_st.double>;
}

interface HOGDescriptorStatic {
    new (): HOGDescriptor;
    //    CV_WRAP HOGDescriptor() : winSize(64,128), blockSize(16,16), blockStride(8,8),
    //        cellSize(8,8), nbins(9), derivAperture(1), winSigma(-1),
    //        histogramNormType(HOGDescriptor::L2Hys), L2HysThreshold(0.2), gammaCorrection(true),
    //        free_coef(-1.f), nlevels(HOGDescriptor::DEFAULT_NLEVELS), signedGradient(false)
    //    {}
    //
    new (_winSize: _types.Size, _blockSize: _types.Size, _blockStride: _types.Size,
        _cellSize: _types.Size, _nbins: _st.int, _derivAperture?: _st.int /*= 1*/, _winSigma?: _st.double /*= -1*/,
        _histogramNormType?: _st.int /*= HOGDescriptor::L2Hys*/,
        _L2HysThreshold?: _st.double /*= 0.2*/, _gammaCorrection?: boolean /*= false*/,
        _nlevels?: _st.int /*= HOGDescriptor::DEFAULT_NLEVELS*/, _signedGradient?: boolean/*= false*/): HOGDescriptor;
    //    CV_WRAP HOGDescriptor(Size _winSize, Size _blockSize, Size _blockStride,
    //                  Size _cellSize, int _nbins, int _derivAperture=1, double _winSigma=-1,
    //                  int _histogramNormType=HOGDescriptor::L2Hys,
    //                  double _L2HysThreshold=0.2, bool _gammaCorrection=false,
    //                  int _nlevels=HOGDescriptor::DEFAULT_NLEVELS, bool _signedGradient=false)
    //    : winSize(_winSize), blockSize(_blockSize), blockStride(_blockStride), cellSize(_cellSize),
    //    nbins(_nbins), derivAperture(_derivAperture), winSigma(_winSigma),
    //    histogramNormType(_histogramNormType), L2HysThreshold(_L2HysThreshold),
    //    gammaCorrection(_gammaCorrection), free_coef(-1.f), nlevels(_nlevels), signedGradient(_signedGradient)
    //    {}
    //
    new (filename: string): HOGDescriptor;
    //    CV_WRAP HOGDescriptor(const String& filename)
    //    {
    //        load(filename);
    //    }
    //
    //    HOGDescriptor(const HOGDescriptor& d)
    //    {
    //        d.copyTo(*this);
    //    }
    //
    //    virtual ~HOGDescriptor() {}
    //
    getDefaultPeopleDetector(): Array<_st.float>;
    getDaimlerPeopleDetector(): Array<_st.float>;

    L2Hys: number;
    DEFAULT_NLEVELS: number;
}


export interface HOGDescriptor
{
    
//public:
//    enum { L2Hys = 0
//         };
//    enum { DEFAULT_NLEVELS = 64
//         };
//

    getDescriptorSize(): _st.size_t;
    checkDetectorSize(): boolean;
    getWinSigma(): _st.double;

    setSVMDetector( _svmdetector : _st.InputArray): void;

    read(fn: _persistence.FileNode): boolean;
    write(fs: _persistence.FileStorage, objname: string ): void;

    load(filename :string , objname? : string /* = String()*/): boolean;
    save(filename :string , objname? : string /* = String()*/): void;
    copyTo(c: HOGDescriptor): void;

    compute(img: _st.InputArray,
        cb: (descriptors: Array<_st.float>)=>void,
        winStride?: _types.Size /*  = Size()*/, padding?: _types.Size /*  = Size()*/,
        locations?: Array<_types.Point> /*= std::vector<Point>()*/) : void;
            
//    //! with found weights output
    detect(img: _mat.Mat, cb: (foundLocations: Array<_types.Point> ,
        weights: Array<_st.double> ) =>void,
        hitThreshold?: _st.double /*= 0*/, winStride?: _types.Size /* = Size()*/,
        padding?: _types.Size /* = Size()*/,
        searchLocations?: Array<_types.Point> /*= std::vector<Point>()*/): void;

//    //! without found weights output
//    virtual void detect(const Mat& img, CV_OUT std::vector<Point>& foundLocations,
//                        double hitThreshold = 0, Size winStride = Size(),
//                        Size padding = Size(),
//                        const std::vector<Point>& searchLocations=std::vector<Point>()) const;
//
//    //! with result weights output
    detectMultiScale(img: _st.InputArray, cb: (foundLocations: Array<_types.Rect>,
        foundWeights: Array<_st.double>) => void, hitThreshold?: _st.double /*= 0*/,
        winStride?: _types.Size /* = Size()*/, padding?: _types.Size /* = Size()*/, scale?: _st.double /* = 1.05*/,
        finalThreshold?: _st.double /* = 2.0*/, useMeanshiftGrouping?: boolean  /*= false*/): void;
//    //! without found weights output
//    virtual void detectMultiScale(InputArray img, CV_OUT std::vector<Rect>& foundLocations,
//                                  double hitThreshold = 0, Size winStride = Size(),
//                                  Size padding = Size(), double scale = 1.05,
//                                  double finalThreshold = 2.0, bool useMeanshiftGrouping = false) const;
//
    computeGradient(img: _mat.Mat, cb: (grad: _mat.Mat, angleOfs: _mat.Mat )=>void,
        paddingTL?: _types.Size /* = Size()*/, paddingBR?: _types.Size /* = Size()*/): void;


//
    winSize: _types.Size;
    blockSize: _types.Size;
    blockStride: _types.Size;
    cellSize: _types.Size;
    nbins: _st.int;
    derivAperture: _st.int;
    winSigma: _st.double;
    histogramNormType: _st.int;
    L2HysThreshold: _st.double;
    gammaCorrection: boolean;
    svmDetector: Array<_st.float> ;
    oclSvmDetector: _mat.UMat;
    free_coef: _st.float;
    nlevels: _st.int;
    signedGradient: boolean;
//
//
//    //! evaluate specified ROI and return confidence value for each location
    detectROI(img: _mat.Mat, locations: Array<_types.Point>,
        cb: (foundLocations: Array<_types.Point>, confidences: Array<_st.double>)=>void,
        hitThreshold?: _st.double /*= 0*/, winStride?: _types.Size /*= Size()*/,
        padding?: _types.Size /*= Size()*/): void;

//    //! evaluate specified ROI and return confidence value for each location in multiple scales

    detectMultiScaleROI(img: _mat.Mat,
        cb: (foundLocations: Array<_types.Rect>)=>void ,
            locations: Array<DetectionROI>,
            hitThreshold?: _st.double /*= 0*/,
            groupThreshold?: _st.int /*  = 0*/): void ;

//    //! read/parse Dalal's alt model file
    readALTModel(modelfile : string): void ;
    groupRectangles(rectList: Array<_types.Rect>, weights: Array<_st.double>, groupThreshold: _st.int, eps: _st.double): void;
};

export var HOGDescriptor: HOGDescriptorStatic = alvision_module.HOGDescriptor;
HOGDescriptor.L2Hys = 0;
HOGDescriptor.DEFAULT_NLEVELS = 64;
//! @} objdetect

//}
//
//#include "opencv2/objdetect/detection_based_tracker.hpp"
//
//
//#endif
