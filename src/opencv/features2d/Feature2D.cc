#include "Feature2D.h"
#include "../IOArray.h"
#include "../types/KeyPoint.h"

namespace feature2d_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("feature2d_general_callback is empty");
		}
		return overload->execute("feature2d", info);
	}
}

Nan::Persistent<FunctionTemplate> Feature2D::constructor;
std::string Feature2D::name;

void Feature2D::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Feature2D::name = "Feature2D";
	feature2d_general_callback::overload = overload;

	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(feature2d_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New(Feature2D::name).ToLocalChecked());
	ctor->Inherit(Nan::New(Algorithm::constructor));

	overload->register_type<Feature2D>(ctor, "feature2d", Feature2D::name);
	overload->add_type_alias("FeatureDetector", Feature2D::name);
	overload->add_type_alias("DescriptorExtractor", Feature2D::name);

	

//	/************************************ Base Classes ************************************/
//
//	/** @brief Abstract base class for 2D image feature detectors and descriptor extractors
//	*/
//	class CV_EXPORTS_W Feature2D : public virtual Algorithm
//	{
//	public:
//		virtual ~Feature2D();
//
//		/** @brief Detects keypoints in an image (first variant) or image set (second variant).
//
//		@param image Image.
//		@param keypoints The detected keypoints. In the second variant of the method keypoints[i] is a set
//		of keypoints detected in images[i] .
//		@param mask Mask specifying where to look for keypoints (optional). It must be a 8-bit integer
//		matrix with non-zero values in the region of interest.
//		*/
//		CV_WRAP virtual void detect(InputArray image,
//			CV_OUT std::vector<KeyPoint>& keypoints,
//			InputArray mask = noArray());
//
//		/** @overload
//		@param images Image set.
//		@param keypoints The detected keypoints. In the second variant of the method keypoints[i] is a set
//		of keypoints detected in images[i] .
//		@param masks Masks for each input image specifying where to look for keypoints (optional).
//		masks[i] is a mask for images[i].
//		*/
//		virtual void detect(InputArrayOfArrays images,
//			std::vector<std::vector<KeyPoint> >& keypoints,
//			InputArrayOfArrays masks = noArray());
//
//		/** @brief Computes the descriptors for a set of keypoints detected in an image (first variant) or image set
//		(second variant).
//
//		@param image Image.
//		@param keypoints Input collection of keypoints. Keypoints for which a descriptor cannot be
//		computed are removed. Sometimes new keypoints can be added, for example: SIFT duplicates keypoint
//		with several dominant orientations (for each orientation).
//		@param descriptors Computed descriptors. In the second variant of the method descriptors[i] are
//		descriptors computed for a keypoints[i]. Row j is the keypoints (or keypoints[i]) is the
//		descriptor for keypoint j-th keypoint.
//		*/
//		CV_WRAP virtual void compute(InputArray image,
//			CV_OUT CV_IN_OUT std::vector<KeyPoint>& keypoints,
//			OutputArray descriptors);
//
//		/** @overload
//
//		@param images Image set.
//		@param keypoints Input collection of keypoints. Keypoints for which a descriptor cannot be
//		computed are removed. Sometimes new keypoints can be added, for example: SIFT duplicates keypoint
//		with several dominant orientations (for each orientation).
//		@param descriptors Computed descriptors. In the second variant of the method descriptors[i] are
//		descriptors computed for a keypoints[i]. Row j is the keypoints (or keypoints[i]) is the
//		descriptor for keypoint j-th keypoint.
//		*/
//		virtual void compute(InputArrayOfArrays images,
//			std::vector<std::vector<KeyPoint> >& keypoints,
//			OutputArrayOfArrays descriptors);
//
//		/** Detects keypoints and computes the descriptors */
//		CV_WRAP virtual void detectAndCompute(InputArray image, InputArray mask,
//			CV_OUT std::vector<KeyPoint>& keypoints,
//			OutputArray descriptors,
//			bool useProvidedKeypoints = false);
//
//		CV_WRAP virtual int descriptorSize() const;
//		CV_WRAP virtual int descriptorType() const;
//		CV_WRAP virtual int defaultNorm() const;
//
//		//! Return true if detector object is empty
//		CV_WRAP virtual bool empty() const;
//	};

	/** Feature detectors in OpenCV have wrappers with a common interface that enables you to easily switch
	between different algorithms solving the same problem. All objects that implement keypoint detectors
	inherit the FeatureDetector interface. */
//	typedef Feature2D FeatureDetector;

	/** Extractors of keypoint descriptors in OpenCV have wrappers with a common interface that enables you
	to easily switch between different algorithms solving the same problem. This section is devoted to
	computing descriptors represented as vectors in a multidimensional space. All objects that implement
	the vector descriptor extractors inherit the DescriptorExtractor interface.
	*/
//	typedef Feature2D DescriptorExtractor;





	overload->addOverloadConstructor("feature2d", Feature2D::name, {}, New);


	// CV_WRAP virtual void detect(InputArray image,
	//	CV_OUT std::vector<KeyPoint>& keypoints,
	//	InputArray mask = noArray());
	overload->addOverload("feature2d", Feature2D::name, "detect", {
		make_param<IOArray*>("image","IOArray"),
		make_param<std::shared_ptr<std::vector<std::shared_ptr<KeyPoint>>>>("keypoints","Array<KeyPoint>"),
		make_param<IOArray*>("mask","IOArray",IOArray::noArray())

	}, detect_a);




	//virtual void detect(InputArrayOfArrays images,
	//	std::vector<std::vector<KeyPoint> >& keypoints,
	//	InputArrayOfArrays masks = noArray());
	overload->addOverload("feature2d", Feature2D::name, "detect", {}, detect_b);
	//
	//
	//CV_WRAP virtual void compute(InputArray image,
	//	CV_OUT CV_IN_OUT std::vector<KeyPoint>& keypoints,
	//	OutputArray descriptors);
	overload->addOverload("feature2d", Feature2D::name, "compute", {}, compute_a);
	//
	//
	//virtual void compute(InputArrayOfArrays images,
	//	std::vector<std::vector<KeyPoint> >& keypoints,
	//	OutputArrayOfArrays descriptors);
	overload->addOverload("feature2d", Feature2D::name, "compute", {}, compute_b);
	//
	///** Detects keypoints and computes the descriptors */
	//CV_WRAP virtual void detectAndCompute(InputArray image, InputArray mask,
	//	CV_OUT std::vector<KeyPoint>& keypoints,
	//	OutputArray descriptors,
	//	bool useProvidedKeypoints = false);
	overload->addOverload("feature2d", Feature2D::name, "detectAndCompute", {}, detectAndCompute);
	//
	//CV_WRAP virtual int descriptorSize() const;
	overload->addOverload("feature2d", Feature2D::name, "descriptorSize", {}, descriptorSize);
	//CV_WRAP virtual int descriptorType() const;
	overload->addOverload("feature2d", Feature2D::name, "descriptorType", {}, descriptorType);
	//CV_WRAP virtual int defaultNorm() const;
	overload->addOverload("feature2d", Feature2D::name, "defaultNorm", {}, defaultNorm);
	//
	////! Return true if detector object is empty
	//CV_WRAP virtual bool empty() const;
	overload->addOverload("feature2d", Feature2D::name, "empty", {}, empty);


	target->Set(Nan::New(Feature2D::name).ToLocalChecked(), ctor->GetFunction());

}

v8::Local<v8::Function> Feature2D::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}

std::shared_ptr<Feature2D> Feature2D::New() {
	auto ret = std::make_shared<Feature2D>();
	ret->_algorithm = cv::makePtr<cv::Feature2D>();
	return ret;
}

POLY_METHOD(Feature2D::New) {
	auto ret = new Feature2D();
	ret->_algorithm = cv::makePtr<cv::Feature2D>();
	
	ret->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}


POLY_METHOD(Feature2D::detect_a) {throw std::exception("not implemented");}
POLY_METHOD(Feature2D::detect_b) {throw std::exception("not implemented");}
POLY_METHOD(Feature2D::compute_a) {throw std::exception("not implemented");}
POLY_METHOD(Feature2D::compute_b) {throw std::exception("not implemented");}
POLY_METHOD(Feature2D::detectAndCompute) {throw std::exception("not implemented");}
POLY_METHOD(Feature2D::descriptorSize) {throw std::exception("not implemented");}
POLY_METHOD(Feature2D::descriptorType) {throw std::exception("not implemented");}
POLY_METHOD(Feature2D::defaultNorm) {throw std::exception("not implemented");}
POLY_METHOD(Feature2D::empty) {throw std::exception("not implemented");}