#include "AgastFeatureDetector.h"

namespace agastfeaturedetector_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("agastfeaturedetector_general_callback is empty");
		}
		return overload->execute("agastfeaturedetector", info);
	}
}

Nan::Persistent<FunctionTemplate> AgastFeatureDetector::constructor;

void
AgastFeatureDetector::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	agastfeaturedetector_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(agastfeaturedetector_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("AgastFeatureDetector").ToLocalChecked());
	ctor->Inherit(Nan::New(Feature2D::constructor));

	overload->register_type<AgastFeatureDetector>(ctor, "agastfeaturedetector", "AgastFeatureDetector");


	auto AgastFeatureDetectorTypes = CreateNamedObject(target, "AgastFeatureDetectorTypes");
	SetObjectProperty(AgastFeatureDetectorTypes, "AGAST_5_8"		 ,cv::AgastFeatureDetector::AGAST_5_8);
	SetObjectProperty(AgastFeatureDetectorTypes, "AGAST_7_12d" , cv::AgastFeatureDetector::AGAST_7_12d);
	SetObjectProperty(AgastFeatureDetectorTypes, "AGAST_7_12s" , cv::AgastFeatureDetector::AGAST_7_12s);
	SetObjectProperty(AgastFeatureDetectorTypes, "OAST_9_16",  cv::AgastFeatureDetector::OAST_9_16);
	SetObjectProperty(AgastFeatureDetectorTypes, "THRESHOLD",  cv::AgastFeatureDetector::THRESHOLD);
	SetObjectProperty(AgastFeatureDetectorTypes, "NONMAX_SUPPRESSION", cv::AgastFeatureDetector::NONMAX_SUPPRESSION);
	overload->add_type_alias("AgastFeatureDetectorTypes", "int");


//	//! @addtogroup features2d_main
//	//! @{
//	
//	/** @brief Wrapping class for feature detection using the AGAST method. :
//	*/
//	class CV_EXPORTS_W AgastFeatureDetector : public Feature2D
//	{
//	public:
//		enum
//		{
//			AGAST_5_8 = 0, AGAST_7_12d = 1, AGAST_7_12s = 2, OAST_9_16 = 3,
//			THRESHOLD = 10000, NONMAX_SUPPRESSION = 10001,
//		};
//	
//		CV_WRAP static Ptr<AgastFeatureDetector> create(int threshold = 10,
//			bool nonmaxSuppression = true,
//			int type = AgastFeatureDetector::OAST_9_16);
	overload->addStaticOverload("agastfeaturedetector", "AgastFeatureDetector", "create", {
		make_param<int>("threshold","int", 10),
		make_param<bool>("nonmaxSuppression","bool", true),
		make_param<int>("type","int",cv:: AgastFeatureDetector::OAST_9_16)
	}, create);
//	
//		CV_WRAP virtual void setThreshold(int threshold) = 0;
	overload->addOverload("agastfeaturedetector", "AgastFeatureDetector", "setThreshold", {make_param<int>("threshold","int")}, setThreshold);
//		CV_WRAP virtual int getThreshold() const = 0;
	overload->addOverload("agastfeaturedetector", "AgastFeatureDetector", "getThreshold", {}, getThreshold);
//	
//		CV_WRAP virtual void setNonmaxSuppression(bool f) = 0;
	overload->addOverload("agastfeaturedetector", "AgastFeatureDetector", "setNonmaxSuppression", {make_param<bool>("f","bool")}, setNonmaxSuppression);
//		CV_WRAP virtual bool getNonmaxSuppression() const = 0;
	overload->addOverload("agastfeaturedetector", "AgastFeatureDetector", "getNonmaxSuppression", {}, getNonmaxSuppression);
//	
//		CV_WRAP virtual void setType(int type) = 0;
	overload->addOverload("agastfeaturedetector", "AgastFeatureDetector", "setType", {make_param<int>("type","int")}, setType);
//		CV_WRAP virtual int getType() const = 0;
	overload->addOverload("agastfeaturedetector", "AgastFeatureDetector", "getType", {}, getType);
//	};




target->Set(Nan::New("AgastFeatureDetector").ToLocalChecked(), ctor->GetFunction());


}


v8::Local<v8::Function> AgastFeatureDetector::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}

POLY_METHOD(AgastFeatureDetector::create){throw std::exception("not implemented");}
POLY_METHOD(AgastFeatureDetector::setThreshold){throw std::exception("not implemented");}
POLY_METHOD(AgastFeatureDetector::getThreshold){throw std::exception("not implemented");}
POLY_METHOD(AgastFeatureDetector::setNonmaxSuppression){throw std::exception("not implemented");}
POLY_METHOD(AgastFeatureDetector::getNonmaxSuppression){throw std::exception("not implemented");}
POLY_METHOD(AgastFeatureDetector::setType){throw std::exception("not implemented");}
POLY_METHOD(AgastFeatureDetector::getType){throw std::exception("not implemented");}
