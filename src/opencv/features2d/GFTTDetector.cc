#include "GFTTDetector.h"


namespace gfttdetector_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("gfttdetector_general_callback is empty");
		}
		return overload->execute("gfttdetector", info);
	}
}

Nan::Persistent<FunctionTemplate> GFTTDetector::constructor;

void
GFTTDetector::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	gfttdetector_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(gfttdetector_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("GFTTDetector").ToLocalChecked());
	ctor->Inherit(Nan::New(Feature2D::constructor));

	overload->register_type<GFTTDetector>(ctor, "flannbasedmatcher", "GFTTDetector");




//	/** @brief Wrapping class for feature detection using the goodFeaturesToTrack function. :
//	*/
//	class CV_EXPORTS_W GFTTDetector : public Feature2D
//	{
//	public:
//		CV_WRAP static Ptr<GFTTDetector> create(int maxCorners = 1000, double qualityLevel = 0.01, double minDistance = 1,
//			int blockSize = 3, bool useHarrisDetector = false, double k = 0.04);
	overload->addStaticOverload("flannbasedmatcher", "GFTTDetector", "create", {
		make_param<int		>("maxCorners","int", 1000),
		make_param<double	>("qualityLevel","double", 0.01),
		make_param<double	>("minDistance","double", 1),
		make_param<int		>("blockSize","int", 3),
		make_param<bool		>("useHarrisDetector","bool", false),
		make_param<double	>("k","double", 0.04)
	}, create);


//		CV_WRAP virtual void setMaxFeatures(int maxFeatures) = 0;
	overload->addOverload("flannbasedmatcher", "GFTTDetector", "setMaxFeatures", {make_param<int>("maxFeatures","int")}, setMaxFeatures);
//		CV_WRAP virtual int getMaxFeatures() const = 0;
	overload->addOverload("flannbasedmatcher", "GFTTDetector", "getMaxFeatures", {}, getMaxFeatures);
//	
//		CV_WRAP virtual void setQualityLevel(double qlevel) = 0;
	overload->addOverload("flannbasedmatcher", "GFTTDetector", "setQualityLevel", {make_param<double>("qlevel","double")}, setQualityLevel);
//		CV_WRAP virtual double getQualityLevel() const = 0;
	overload->addOverload("flannbasedmatcher", "GFTTDetector", "getQualityLevel", {}, getQualityLevel);
//	
//		CV_WRAP virtual void setMinDistance(double minDistance) = 0;
	overload->addOverload("flannbasedmatcher", "GFTTDetector", "setMinDistance", {make_param<double>("minDistance","double")}, setMinDistance);
//		CV_WRAP virtual double getMinDistance() const = 0;
	overload->addOverload("flannbasedmatcher", "GFTTDetector", "getMinDistance", {}, getMinDistance);
//	
//		CV_WRAP virtual void setBlockSize(int blockSize) = 0;
	overload->addOverload("flannbasedmatcher", "GFTTDetector", "setBlockSize", {make_param<int>("blockSize","int")}, setBlockSize);
//		CV_WRAP virtual int getBlockSize() const = 0;
	overload->addOverload("flannbasedmatcher", "GFTTDetector", "getBlockSize", {}, getBlockSize);
//	
//		CV_WRAP virtual void setHarrisDetector(bool val) = 0;
	overload->addOverload("flannbasedmatcher", "GFTTDetector", "setHarrisDetector", {make_param<bool>("val","bool")}, setHarrisDetector);
//		CV_WRAP virtual bool getHarrisDetector() const = 0;
	overload->addOverload("flannbasedmatcher", "GFTTDetector", "getHarrisDetector", {}, getHarrisDetector);
//	
//		CV_WRAP virtual void setK(double k) = 0;
	overload->addOverload("flannbasedmatcher", "GFTTDetector", "setK", {make_param<double>("k","double")}, setK);
//		CV_WRAP virtual double getK() const = 0;
	overload->addOverload("flannbasedmatcher", "GFTTDetector", "getK", {}, getK);
//	};
//	



target->Set(Nan::New("GFTTDetector").ToLocalChecked(), ctor->GetFunction());


}


v8::Local<v8::Function> GFTTDetector::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}

POLY_METHOD(GFTTDetector::create){throw std::exception("not implemented");}
POLY_METHOD(GFTTDetector::setMaxFeatures){throw std::exception("not implemented");}
POLY_METHOD(GFTTDetector::getMaxFeatures){throw std::exception("not implemented");}
POLY_METHOD(GFTTDetector::setQualityLevel){throw std::exception("not implemented");}
POLY_METHOD(GFTTDetector::getQualityLevel){throw std::exception("not implemented");}
POLY_METHOD(GFTTDetector::setMinDistance){throw std::exception("not implemented");}
POLY_METHOD(GFTTDetector::getMinDistance){throw std::exception("not implemented");}
POLY_METHOD(GFTTDetector::setBlockSize){throw std::exception("not implemented");}
POLY_METHOD(GFTTDetector::getBlockSize){throw std::exception("not implemented");}
POLY_METHOD(GFTTDetector::setHarrisDetector){throw std::exception("not implemented");}
POLY_METHOD(GFTTDetector::getHarrisDetector){throw std::exception("not implemented");}
POLY_METHOD(GFTTDetector::setK){throw std::exception("not implemented");}
POLY_METHOD(GFTTDetector::getK){throw std::exception("not implemented");}
