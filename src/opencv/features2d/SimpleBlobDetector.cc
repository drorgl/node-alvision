#include "SimpleBlobDetector.h"

namespace simpleblobdetector_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("simpleblobdetector_general_callback is empty");
		}
		return overload->execute("simpleblobdetector", info);
	}
}

Nan::Persistent<FunctionTemplate> SimpleBlobDetector::constructor;

void SimpleBlobDetector::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	simpleblobdetector_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(simpleblobdetector_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("SimpleBlobDetector").ToLocalChecked());
	ctor->Inherit(Nan::New(Feature2D::constructor));

	overload->register_type<SimpleBlobDetector>(ctor, "simpleblobdetector", "SimpleBlobDetector");


//	/** @brief Class for extracting blobs from an image. :
//
//	The class implements a simple algorithm for extracting blobs from an image:
//
//	1.  Convert the source image to binary images by applying thresholding with several thresholds from
//	minThreshold (inclusive) to maxThreshold (exclusive) with distance thresholdStep between
//	neighboring thresholds.
//	2.  Extract connected components from every binary image by findContours and calculate their
//	centers.
//	3.  Group centers from several binary images by their coordinates. Close centers form one group that
//	corresponds to one blob, which is controlled by the minDistBetweenBlobs parameter.
//	4.  From the groups, estimate final centers of blobs and their radiuses and return as locations and
//	sizes of keypoints.
//
//	This class performs several filtrations of returned blobs. You should set filterBy\* to true/false
//	to turn on/off corresponding filtration. Available filtrations:
//
//	-   **By color**. This filter compares the intensity of a binary image at the center of a blob to
//	blobColor. If they differ, the blob is filtered out. Use blobColor = 0 to extract dark blobs
//	and blobColor = 255 to extract light blobs.
//	-   **By area**. Extracted blobs have an area between minArea (inclusive) and maxArea (exclusive).
//	-   **By circularity**. Extracted blobs have circularity
//	(\f$\frac{4*\pi*Area}{perimeter * perimeter}\f$) between minCircularity (inclusive) and
//	maxCircularity (exclusive).
//	-   **By ratio of the minimum inertia to maximum inertia**. Extracted blobs have this ratio
//	between minInertiaRatio (inclusive) and maxInertiaRatio (exclusive).
//	-   **By convexity**. Extracted blobs have convexity (area / area of blob convex hull) between
//	minConvexity (inclusive) and maxConvexity (exclusive).
//
//	Default values of parameters are tuned to extract dark circular blobs.
//	*/
//	class CV_EXPORTS_W SimpleBlobDetector : public Feature2D
//	{
//	public:
//		struct CV_EXPORTS_W_SIMPLE Params
//		{
//			CV_WRAP Params();
//			CV_PROP_RW float thresholdStep;
//			CV_PROP_RW float minThreshold;
//			CV_PROP_RW float maxThreshold;
//			CV_PROP_RW size_t minRepeatability;
//			CV_PROP_RW float minDistBetweenBlobs;
//
//			CV_PROP_RW bool filterByColor;
//			CV_PROP_RW uchar blobColor;
//
//			CV_PROP_RW bool filterByArea;
//			CV_PROP_RW float minArea, maxArea;
//
//			CV_PROP_RW bool filterByCircularity;
//			CV_PROP_RW float minCircularity, maxCircularity;
//
//			CV_PROP_RW bool filterByInertia;
//			CV_PROP_RW float minInertiaRatio, maxInertiaRatio;
//
//			CV_PROP_RW bool filterByConvexity;
//			CV_PROP_RW float minConvexity, maxConvexity;
//
//			void read(const FileNode& fn);
//			void write(FileStorage& fs) const;
//		};
//
//		CV_WRAP static Ptr<SimpleBlobDetector>
//			create(const SimpleBlobDetector::Params &parameters = SimpleBlobDetector::Params());
//	};
















	overload->addOverloadConstructor("simpleblobdetector", "SimpleBlobDetector", {}, New);
//	CV_WRAP static Ptr<SimpleBlobDetector>
//		create(const SimpleBlobDetector::Params &parameters = SimpleBlobDetector::Params());
	overload->addStaticOverload("simpleblobdetector", "SimpleBlobDetector", "create", {make_param<SimpleBlobDetectorParams*>("parameters","SimpleBlobDetectorParams")}, create);


}

v8::Local<v8::Function> SimpleBlobDetector::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


std::shared_ptr<SimpleBlobDetector> SimpleBlobDetector::create(std::shared_ptr<SimpleBlobDetectorParams> params) {
	auto ret = std::make_shared<SimpleBlobDetector>();
	ret->_algorithm = cv::SimpleBlobDetector::create(*params->_params);
	return ret;
}

POLY_METHOD(SimpleBlobDetector::New) {
	auto inst = new SimpleBlobDetector();
	inst->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(SimpleBlobDetector::create) { throw std::runtime_error("not implemented"); }