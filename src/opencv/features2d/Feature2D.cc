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

void Feature2D::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	feature2d_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(feature2d_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("Feature2D").ToLocalChecked());
	ctor->Inherit(Nan::New(Algorithm::constructor));

	overload->register_type<Feature2D>(ctor, "feature2d", "Feature2D");
	overload->add_type_alias("FeatureDetector", "Feature2D");

	// CV_WRAP virtual void detect(InputArray image,
	//	CV_OUT std::vector<KeyPoint>& keypoints,
	//	InputArray mask = noArray());
	overload->addOverload("features2d", "Feature2D", "detect", {
		make_param<IOArray*>("image","IOArray"),
		make_param<std::shared_ptr<std::vector<std::shared_ptr<KeyPoint>>>>("keypoints","Array<KeyPoint>"),
		make_param<IOArray*>("mask","IOArray",IOArray::noArray())

	}, detect_a);




	//virtual void detect(InputArrayOfArrays images,
	//	std::vector<std::vector<KeyPoint> >& keypoints,
	//	InputArrayOfArrays masks = noArray());
	overload->addOverload("features2d", "Feature2D", "detect", {}, detect_b);
	//
	//
	//CV_WRAP virtual void compute(InputArray image,
	//	CV_OUT CV_IN_OUT std::vector<KeyPoint>& keypoints,
	//	OutputArray descriptors);
	overload->addOverload("features2d", "Feature2D", "compute", {}, compute_a);
	//
	//
	//virtual void compute(InputArrayOfArrays images,
	//	std::vector<std::vector<KeyPoint> >& keypoints,
	//	OutputArrayOfArrays descriptors);
	overload->addOverload("features2d", "Feature2D", "compute", {}, compute_b);
	//
	///** Detects keypoints and computes the descriptors */
	//CV_WRAP virtual void detectAndCompute(InputArray image, InputArray mask,
	//	CV_OUT std::vector<KeyPoint>& keypoints,
	//	OutputArray descriptors,
	//	bool useProvidedKeypoints = false);
	overload->addOverload("features2d", "Feature2D", "detectAndCompute", {}, detectAndCompute);
	//
	//CV_WRAP virtual int descriptorSize() const;
	overload->addOverload("features2d", "Feature2D", "descriptorSize", {}, descriptorSize);
	//CV_WRAP virtual int descriptorType() const;
	overload->addOverload("features2d", "Feature2D", "descriptorType", {}, descriptorType);
	//CV_WRAP virtual int defaultNorm() const;
	overload->addOverload("features2d", "Feature2D", "defaultNorm", {}, defaultNorm);
	//
	////! Return true if detector object is empty
	//CV_WRAP virtual bool empty() const;
	overload->addOverload("features2d", "Feature2D", "empty", {}, empty);

}

v8::Local<v8::Function> Feature2D::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(Feature2D::detect_a) {}
POLY_METHOD(Feature2D::detect_b) {}
POLY_METHOD(Feature2D::compute_a) {}
POLY_METHOD(Feature2D::compute_b) {}
POLY_METHOD(Feature2D::detectAndCompute) {}
POLY_METHOD(Feature2D::descriptorSize) {}
POLY_METHOD(Feature2D::descriptorType) {}
POLY_METHOD(Feature2D::defaultNorm) {}
POLY_METHOD(Feature2D::empty) {}