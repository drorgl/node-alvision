#include "objdetect.h"
#include "objdetect/BaseCascadeClassifier.h"
#include "objdetect/CascadeClassifier.h"
#include "objdetect/HOGDescriptor.h"
#include "objdetect/DetectionROI.h"

namespace objdetect_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("objdetect_general_callback is empty");
		}
		return overload->execute("objdetect", info);
	}
}

void
objdetect::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	objdetect_general_callback::overload = overload;




	//! @addtogroup objdetect
	//! @{

	///////////////////////////// Object Detection ////////////////////////////

	//! class for grouping object candidates, detected by Cascade Classifier, HOG etc.
	//! instance of the class is to be passed to cv::partition (see cxoperations.hpp)
	//interface SimilarRects
	//{
	//	//public:
	//	//    SimilarRects(double _eps) : eps(_eps) {}
	//	//    inline bool operator()(const Rect& r1, const Rect& r2) const
	//	//    {
	//	//        double delta = eps*(std::min(r1.width, r2.width) + std::min(r1.height, r2.height))*0.5;
	//	//        return std::abs(r1.x - r2.x) <= delta &&
	//	//            std::abs(r1.y - r2.y) <= delta &&
	//	//            std::abs(r1.x + r1.width - r2.x - r2.width) <= delta &&
	//	//            std::abs(r1.y + r1.height - r2.y - r2.height) <= delta;
	//	//    }
	//	//    double eps;
	//};

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
	//CV_EXPORTS   void groupRectangles_meanshift(std::vector<Rect>& rectList, std::vector<double>& foundWeights,
	//                                            std::vector<double>& foundScales,
	//                                            double detectThreshold = 0.0, Size winDetSize = Size(64, 128));
	//
	//template<> CV_EXPORTS void DefaultDeleter<CvHaarClassifierCascade>::operator ()(CvHaarClassifierCascade* obj) const;

	auto CASCADE = CreateNamedObject(target, "CASCADE");
	SetObjectProperty(CASCADE, "CASCADE_DO_CANNY_PRUNING", cv::CASCADE_DO_CANNY_PRUNING);
	SetObjectProperty(CASCADE, "CASCADE_SCALE_IMAGE", cv::CASCADE_SCALE_IMAGE);
	SetObjectProperty(CASCADE, "CASCADE_FIND_BIGGEST_OBJECT", cv::CASCADE_FIND_BIGGEST_OBJECT);
	SetObjectProperty(CASCADE, "CASCADE_DO_ROUGH_SEARCH", cv::CASCADE_DO_ROUGH_SEARCH);

	BaseCascadeClassifier::Init(target, overload);
	CascadeClassifier::Init(target, overload);

	//interface IcreateFaceDetectionMaskGenerator{
	//() : BaseCascadeClassifier::MaskGenerator
	//}
	//CV_EXPORTS Ptr<BaseCascadeClassifier::MaskGenerator> createFaceDetectionMaskGenerator();

	//////////////// HOG (Histogram-of-Oriented-Gradients) Descriptor and Object Detector //////////////

	DetectionROI::Init(target, overload);

	HOGDescriptor::Init(target, overload);

	//! @} objdetect

	//}
	//
	//#include "opencv2/objdetect/detection_based_tracker.hpp"
	//
	//#ifndef DISABLE_OPENCV_24_COMPATIBILITY
	//#include "opencv2/objdetect/objdetect_c.h"
	//#endif
	//
	//#endif

}