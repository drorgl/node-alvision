#include "features2d.h"
#include "IOArray.h"
#include "types/KeyPoint.h"
#include "types/DMatch.h"
#include "types/Scalar.h"
#include "types/Point.h"

#include "features2d/KeyPointsFilter.h"
#include "features2d/Feature2D.h"
#include "features2d/BRISK.h"
#include "features2d/ORB.h"
#include "features2d/MSER.h"
#include "features2d/FastFeatureDetector.h"
#include "features2d/AgastFeatureDetector.h"
#include "features2d/GFTTDetector.h"
#include "features2d/SimpleBlobDetector.h"
#include "features2d/KAZE.h"
#include "features2d/AKAZE.h"
#include "features2d/DescriptorMatcher.h"
#include "features2d/BFMatcher.h"
#include "features2d/FlannBasedMatcher.h"
#include "features2d/BOWTrainer.h"
#include "features2d/BOWKMeansTrainer.h"
#include "features2d/BOWImgDescriptorExtractor.h"

namespace features2d_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("features2d_general_callback is empty");
		}
		return overload->execute("features2d", info);
	}
}

void
features2d::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	KeyPointsFilter::Init(target, overload);
	Feature2D::Init(target, overload);
	BRISK::Init(target, overload);
	ORB::Init(target, overload);
	MSER::Init(target, overload);


/** @overload */
	overload->addOverload("features2d", "", "FAST", {
		make_param<IOArray*>("image","IOArray"),
		make_param<std::shared_ptr<or::Callback>>("cb","Function"),// : (keypoints : Array<_types.KeyPoint>) = > void,
		make_param<int>("threshold","int"),
		make_param<bool>("nonmaxSuppression","bool",true)
	}, FAST_a);


//CV_EXPORTS void FAST( InputArray image, CV_OUT std::vector<KeyPoint>& keypoints,
//                      int threshold, bool nonmaxSuppression=true );

//(image : _st.InputArray, cb : (keypoints : Array<_types.KeyPoint>) = > void,
//	threshold: _st.int, nonmaxSuppression ? : boolean/*= true*/) : void;



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

overload->addOverload("features2d", "", "FAST", {
	make_param<IOArray*>("image","IOArray"),
	make_param<std::shared_ptr< or ::Callback>>("cb","Function"),// : (keypoints : Array<_types.KeyPoint>) = >void,
	make_param<int>("threshold","int"),
	make_param<bool>("nonmaxSuppression","bool"),
	make_param<int>("type","int")
}, FAST_b);

//CV_EXPORTS void FAST( InputArray image, CV_OUT std::vector<KeyPoint>& keypoints,
//                      int threshold, bool nonmaxSuppression, int type );



//(image: _st.InputArray, cb : (keypoints : Array<_types.KeyPoint>) = >void,
//	threshold: _st.int, nonmaxSuppression : boolean, type : _st.int) : void;
FastFeatureDetector::Init(target, overload);

/** @overload */
overload->addOverload("features2d", "", "AGAST", {
	make_param<IOArray*>("image","IOArray"),
	make_param<std::shared_ptr<or::Callback>>("cb","Function"),// : (keypoints : Array<_types.KeyPoint>) = > void,
	make_param<int>("threshold","int"),
	make_param<bool>("nonmaxSuppression","bool", true)
}, AGAST_a);
//CV_EXPORTS void AGAST( InputArray image, CV_OUT std::vector<KeyPoint>& keypoints,
//                      int threshold, bool nonmaxSuppression=true );

//(image : _st.InputArray, cb : (keypoints : Array<_types.KeyPoint>) = > void,
//	threshold: _st.int, nonmaxSuppression : boolean /*= true*/) : void;

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
overload->addOverload("features2d", "", "AGAST", {
	make_param<IOArray*>("image","IOArray"),
	make_param<std::shared_ptr<or::Callback>>("cb","Function"),// : (keypoints : Array<_types.KeyPoint>) = >void,
	make_param<int>("threshold","int"),
	make_param<bool>("nonmaxSuppression","bool"),
	make_param<int>("type","AgastFeatureDetectorTypes")
}, AGAST_b);
//CV_EXPORTS void AGAST( InputArray image, CV_OUT std::vector<KeyPoint>& keypoints,
//                      int threshold, bool nonmaxSuppression, int type );
//(image: _st.InputArray, cb : (keypoints : Array<_types.KeyPoint>) = >void,
//	threshold: _st.int, nonmaxSuppression : boolean, type : AgastFeatureDetectorTypes) : void;

//! @} features2d_main
AgastFeatureDetector::Init(target, overload);
GFTTDetector::Init(target, overload);

SimpleBlobDetectorParams::Init(target, overload);
SimpleBlobDetector::Init(target, overload);
KAZE::Init(target, overload);

AKAZE::Init(target, overload);
//! @} features2d_main

/****************************************************************************************\
*                                      Distance                                          *
\****************************************************************************************/
//
//template<typename T>
//struct CV_EXPORTS Accumulator
//{
//    typedef T Type;
//};
//
//template<> struct Accumulator<unsigned char>  { typedef float Type; };
//template<> struct Accumulator<unsigned short> { typedef float Type; };
//template<> struct Accumulator<char>   { typedef float Type; };
//template<> struct Accumulator<short>  { typedef float Type; };
//
///*
// * Squared Euclidean distance functor
// */
//template<class T>
//struct CV_EXPORTS SL2
//{
//    enum { normType = NORM_L2SQR };
//    typedef T ValueType;
//    typedef typename Accumulator<T>::Type ResultType;
//
//    ResultType operator()( const T* a, const T* b, int size ) const
//    {
//        return normL2Sqr<ValueType, ResultType>(a, b, size);
//    }
//};
//
///*
// * Euclidean distance functor
// */
//template<class T>
//struct CV_EXPORTS L2
//{
//    enum { normType = NORM_L2 };
//    typedef T ValueType;
//    typedef typename Accumulator<T>::Type ResultType;
//
//    ResultType operator()( const T* a, const T* b, int size ) const
//    {
//        return (ResultType)std::sqrt((double)normL2Sqr<ValueType, ResultType>(a, b, size));
//    }
//};
//
///*
// * Manhattan distance (city block distance) functor
// */
//template<class T>
//struct CV_EXPORTS L1
//{
//    enum { normType = NORM_L1 };
//    typedef T ValueType;
//    typedef typename Accumulator<T>::Type ResultType;
//
//    ResultType operator()( const T* a, const T* b, int size ) const
//    {
//        return normL1<ValueType, ResultType>(a, b, size);
//    }
//};
DescriptorMatcher::Init(target, overload);

BFMatcher::Init(target, overload);

FlannBasedMatcher::Init(target, overload);

//! @} features2d_match

/****************************************************************************************\
*                                   Drawing functions                                    *
\****************************************************************************************/

//! @addtogroup features2d_draw
//! @{

auto DrawMatchesFlags = CreateNamedObject(target, "DrawMatchesFlags");
SetObjectProperty(DrawMatchesFlags, "DEFAULT",cv::DrawMatchesFlags::DEFAULT					);
SetObjectProperty(DrawMatchesFlags, "DRAW_OVER_OUTIMG",cv::DrawMatchesFlags::DRAW_OVER_OUTIMG		);
SetObjectProperty(DrawMatchesFlags, "NOT_DRAW_SINGLE_POINTS",cv::DrawMatchesFlags::NOT_DRAW_SINGLE_POINTS	);
SetObjectProperty(DrawMatchesFlags, "DRAW_RICH_KEYPOINTS",cv::DrawMatchesFlags::DRAW_RICH_KEYPOINTS		);
overload->add_type_alias("DrawMatchesFlags", "int");

//struct CV_EXPORTS DrawMatchesFlags
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
overload->addOverload("features2d", "", "drawKeypoints", {
	make_param<IOArray*>("image","IOArray"),
	make_param<std::shared_ptr<std::vector<KeyPoint*>>>("keypoints","Array<KeyPoint>"),
	make_param<IOArray*>("outImage","IOArray"),
	make_param<Scalar*>("color",Scalar::name,Scalar::all(-1)),
	make_param<int>("flags","DrawMatchesFlags",cv::DrawMatchesFlags::DEFAULT)
}, drawKeypoints);
//CV_EXPORTS_W void drawKeypoints( InputArray image, const std::vector<KeyPoint>& keypoints, InputOutputArray outImage,
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
overload->addOverload("features2d", "", "drawMatches", {
	make_param<IOArray*>("img1","IOArray"),
	make_param<std::shared_ptr<std::vector<KeyPoint*>>>("keypoints1","Array<KeyPoint>"),
	make_param<IOArray*>("img2","IOArray"),
	make_param<std::shared_ptr<std::vector<KeyPoint*>>>("keypoints2","Array<KeyPoint>"),
	make_param<std::shared_ptr<std::vector<DMatch*>>>("matches1to2","Array<DMatch>"),
	make_param<IOArray*>("outImg","IOArray"),
	make_param<Scalar*>("matchColor",Scalar::name, Scalar::all(-1)),
	make_param<Scalar*>("singlePointColor",Scalar::name, Scalar::all(-1)),
	make_param<std::shared_ptr<std::vector<char>>>("matchesMask","Array<char>",nullptr),
	make_param<int>("flags","int",cv:: DrawMatchesFlags::DEFAULT)
}, drawMatches);

//CV_EXPORTS_W void drawMatches( InputArray img1, const std::vector<KeyPoint>& keypoints1,
//                             InputArray img2, const std::vector<KeyPoint>& keypoints2,
//                             const std::vector<DMatch>& matches1to2, InputOutputArray outImg,
//                             const Scalar& matchColor=Scalar::all(-1), const Scalar& singlePointColor=Scalar::all(-1),
//                             const std::vector<char>& matchesMask=std::vector<char>(), int flags=DrawMatchesFlags::DEFAULT );

/** @overload */
overload->addOverload("features2d", "", "drawMatchesKnn", {
	make_param<IOArray*>("img1","IOArray"),
	make_param<std::shared_ptr<std::vector<KeyPoint*>>>("keypoints1","Array<KeyPoint>"),
	make_param<IOArray*>("img2","IOArray"),
	make_param<std::shared_ptr<std::vector<KeyPoint*>>>("keypoints2","Array<KeyPoint>"),
	make_param<std::shared_ptr<std::vector<DMatch*>>>("matches1to2","Array<DMatch>"),
	make_param<IOArray*>("outImg","IOArray"),
	make_param<Scalar*>("matchColor",Scalar::name, Scalar::all(-1)),
	make_param<Scalar*>("singlePointColor",Scalar::name, Scalar::all(-1)),
	make_param<std::shared_ptr<std::vector<char>>>("matchesMask","Array<char>",nullptr),
	make_param<int>("flags","int",cv::DrawMatchesFlags::DEFAULT)
}, drawMatchesKnn);

//CV_EXPORTS_AS(drawMatchesKnn) void drawMatches( InputArray img1, const std::vector<KeyPoint>& keypoints1,
//                             InputArray img2, const std::vector<KeyPoint>& keypoints2,
//                             const std::vector<std::vector<DMatch> >& matches1to2, InputOutputArray outImg,
//                             const Scalar& matchColor=Scalar::all(-1), const Scalar& singlePointColor=Scalar::all(-1),
//                             const std::vector<std::vector<char> >& matchesMask=std::vector<std::vector<char> >(), int flags=DrawMatchesFlags::DEFAULT );

//! @} features2d_draw

/****************************************************************************************\
*   Functions to evaluate the feature detectors and [generic] descriptor extractors      *
\****************************************************************************************/
overload->addOverload("features2d", "", "evaluateFeatureDetector", {
	make_param<Matrix*>("img1" ,Matrix::name),
	make_param<Matrix*>("img2" ,Matrix::name),
	make_param<Matrix*>("H1to2",Matrix::name),
	make_param<std::shared_ptr<std::vector<KeyPoint*>>>("keypoints1","Array<KeyPoint>"),
	make_param<std::shared_ptr<std::vector<KeyPoint*>>>("keypoints2","Array<KeyPoint>"),
	make_param<float>("repeatability","float"),
	make_param<int>("correspCount","int"),
	make_param<FeatureDetector*>("fdetector",FeatureDetector::name,FeatureDetector::New())
}, evaluateFeatureDetector);
//CV_EXPORTS void evaluateFeatureDetector( const Mat& img1, const Mat& img2, const Mat& H1to2,
//                                         std::vector<KeyPoint>* keypoints1, std::vector<KeyPoint>* keypoints2,
//                                         float& repeatability, int& correspCount,
//                                         const Ptr<FeatureDetector>& fdetector=Ptr<FeatureDetector>() );

overload->addOverload("features2d", "", "computeRecallPrecisionCurve", {
	make_param<std::shared_ptr<std::vector<std::shared_ptr<std::vector<DMatch*>>>>>( "matches1to2","Array<Array<DMatch>>"),
	make_param<std::shared_ptr<std::vector<std::shared_ptr<std::vector<uchar>>>>>(    "correctMatches1to2Mask","Array<Array<uchar>>"),
	make_param<std::shared_ptr<std::vector<Point2f*>>>("recallPrecisionCurve","Array<Point2f>")
}, computeRecallPrecisionCurve);
//CV_EXPORTS void computeRecallPrecisionCurve( const std::vector<std::vector<DMatch> >& matches1to2,
//                                             const std::vector<std::vector<uchar> >& correctMatches1to2Mask,
//                                             std::vector<Point2f>& recallPrecisionCurve );

overload->addOverload("features2d", "", "getRecall", {
	make_param<std::shared_ptr<std::vector<Point2f*>>>( "recallPrecisionCurve","Array<Point2f>"),
	make_param<float>("l_precision","float")
}, getRecall);
//CV_EXPORTS float getRecall( const std::vector<Point2f>& recallPrecisionCurve, float l_precision );
overload->addOverload("features2d", "", "getNearestPoint", {
	make_param<std::shared_ptr<std::vector<Point2f*>>>("recallPrecisionCurve","Array<Point2f>"),
	make_param<float>("l_precision","float")
}, getNearestPoint);
//CV_EXPORTS int getNearestPoint( const std::vector<Point2f>& recallPrecisionCurve, float l_precision );

BOWTrainer::Init(target, overload);
BOWKMeansTrainer::Init(target, overload);
BOWImgDescriptorExtractor::Init(target, overload);

}



POLY_METHOD(features2d::FAST_a){throw std::exception("not implemented");}
POLY_METHOD(features2d::FAST_b){throw std::exception("not implemented");}
POLY_METHOD(features2d::AGAST_a){throw std::exception("not implemented");}
POLY_METHOD(features2d::AGAST_b){throw std::exception("not implemented");}
POLY_METHOD(features2d::drawKeypoints){throw std::exception("not implemented");}
POLY_METHOD(features2d::drawMatches){throw std::exception("not implemented");}
POLY_METHOD(features2d::drawMatchesKnn){throw std::exception("not implemented");}
POLY_METHOD(features2d::evaluateFeatureDetector){throw std::exception("not implemented");}
POLY_METHOD(features2d::computeRecallPrecisionCurve){throw std::exception("not implemented");}
POLY_METHOD(features2d::getRecall){throw std::exception("not implemented");}
POLY_METHOD(features2d::getNearestPoint){throw std::exception("not implemented");}

