#include "FastFeatureDetector.h"

namespace fastfeaturedetector_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("fastfeaturedetector_general_callback is empty");
		}
		return overload->execute("fastfeaturedetector", info);
	}
}

Nan::Persistent<FunctionTemplate> FastFeatureDetector::constructor;

void
FastFeatureDetector::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	fastfeaturedetector_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(fastfeaturedetector_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("FastFeatureDetector").ToLocalChecked());
	ctor->Inherit(Nan::New(Feature2D::constructor));

	overload->register_type<FastFeatureDetector>(ctor, "fastfeaturedetector", "FastFeatureDetector");

	auto FastFeatureDetectorType = CreateNamedObject(target, "FastFeatureDetectorType");
	SetObjectProperty(FastFeatureDetectorType, "TYPE_5_8",cv::FastFeatureDetector::TYPE_5_8				);
	SetObjectProperty(FastFeatureDetectorType, "TYPE_7_12",cv::FastFeatureDetector::TYPE_7_12			);
	SetObjectProperty(FastFeatureDetectorType, "TYPE_9_16",cv::FastFeatureDetector::TYPE_9_16			);
	SetObjectProperty(FastFeatureDetectorType, "THRESHOLD",cv::FastFeatureDetector::THRESHOLD			);
	SetObjectProperty(FastFeatureDetectorType, "NONMAX_SUPPRESSION",cv::FastFeatureDetector::NONMAX_SUPPRESSION	);
	SetObjectProperty(FastFeatureDetectorType, "FAST_N",cv::FastFeatureDetector::FAST_N				);
	overload->add_type_alias("FastFeatureDetectorType", "int");









//	//! @} features2d_main
//	
//	//! @addtogroup features2d_main
//	//! @{
//	
//	/** @brief Wrapping class for feature detection using the FAST method. :
//	*/
//	class CV_EXPORTS_W FastFeatureDetector : public Feature2D
//	{
//	public:
//		enum FastFeatureDetectorType
//		{
//			TYPE_5_8 = 0, TYPE_7_12 = 1, TYPE_9_16 = 2,
//			THRESHOLD = 10000, NONMAX_SUPPRESSION = 10001, FAST_N = 10002,
//		};
//	
//		CV_WRAP static Ptr<FastFeatureDetector> create(int threshold = 10,
//			bool nonmaxSuppression = true,
//			int type = FastFeatureDetector::TYPE_9_16);
	overload->addStaticOverload("fastfeaturedetector", "FastFeatureDetector", "create", {
		make_param<int>("threshold","int", 10),
		make_param<bool>("nonmaxSuppression","bool", true),
		make_param<int>("type","int",cv:: FastFeatureDetector::TYPE_9_16)
	}, create);
//	
//		CV_WRAP virtual void setThreshold(int threshold) = 0;
	overload->addOverload("fastfeaturedetector", "FastFeatureDetector", "setThreshold", {make_param<int>("threashold","int")}, setThreshold);
//		CV_WRAP virtual int getThreshold() const = 0;
	overload->addOverload("fastfeaturedetector", "FastFeatureDetector", "getThreshold", {}, getThreshold);
//	
//		CV_WRAP virtual void setNonmaxSuppression(bool f) = 0;
	overload->addOverload("fastfeaturedetector", "FastFeatureDetector", "setNonmaxSuppression", {make_param<bool>("f","bool")}, setNonmaxSuppression);
//		CV_WRAP virtual bool getNonmaxSuppression() const = 0;
	overload->addOverload("fastfeaturedetector", "FastFeatureDetector", "getNonmaxSuppression", {}, getNonmaxSuppression);
//	
//		CV_WRAP virtual void setType(int type) = 0;
	overload->addOverload("fastfeaturedetector", "FastFeatureDetector", "setType", {make_param<int>("type","int")}, setType);
//		CV_WRAP virtual int getType() const = 0;
	overload->addOverload("fastfeaturedetector", "FastFeatureDetector", "getType", {}, getType);
//	};
//	
//	




target->Set(Nan::New("FastFeatureDetector").ToLocalChecked(), ctor->GetFunction());


}


v8::Local<v8::Function> FastFeatureDetector::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(FastFeatureDetector::create){throw std::exception("not implemented");}
POLY_METHOD(FastFeatureDetector::setThreshold){throw std::exception("not implemented");}
POLY_METHOD(FastFeatureDetector::getThreshold){throw std::exception("not implemented");}
POLY_METHOD(FastFeatureDetector::setNonmaxSuppression){throw std::exception("not implemented");}
POLY_METHOD(FastFeatureDetector::getNonmaxSuppression){throw std::exception("not implemented");}
POLY_METHOD(FastFeatureDetector::setType){throw std::exception("not implemented");}
POLY_METHOD(FastFeatureDetector::getType){throw std::exception("not implemented");}
