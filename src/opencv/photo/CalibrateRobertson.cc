#include "CalibrateRobertson.h"
#include "../IOArray.h"
#include "../Matrix.h"

namespace calibraterobertson_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("calibraterobertson_general_callback is empty");
		}
		return overload->execute("calibraterobertson", info);
	}
}

Nan::Persistent<FunctionTemplate> CalibrateRobertson::constructor;

void CalibrateRobertson::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	calibraterobertson_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(calibraterobertson_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("CalibrateRobertson").ToLocalChecked());
	ctor->Inherit(Nan::New(CalibrateCRF::constructor));

	overload->register_type<CalibrateRobertson>(ctor, "calibraterobertson", "CalibrateRobertson");

	overload->addOverloadConstructor("calibraterobertson", "CalibrateRobertson", {}, New);





//	/** @brief Inverse camera response function is extracted for each brightness value by minimizing an objective
//		function as linear system. This algorithm uses all image pixels.
//	
//		For more information see @cite RB99 .
//		*/
//		interface CalibrateRobertson extends CalibrateCRF
//		{
//			//public:
//			//CV_WRAP virtual int getMaxIter() const = 0;
	overload->addOverload("calibraterobertson", "CalibrateRobertson", "getMaxIter", {}, getMaxIter);
//			//CV_WRAP virtual void setMaxIter(int max_iter) = 0;
	overload->addOverload("calibraterobertson", "CalibrateRobertson", "setMaxIter", {make_param<int>("max_iter","int")}, setMaxIter);
//			//
//			//CV_WRAP virtual float getThreshold() const = 0;
	overload->addOverload("calibraterobertson", "CalibrateRobertson", "getThreshold", {}, getThreshold);
//			//CV_WRAP virtual void setThreshold(float threshold) = 0;
	overload->addOverload("calibraterobertson", "CalibrateRobertson", "setThreshold", {make_param<float>("threshold","float")}, setThreshold);
//			//
//			//CV_WRAP virtual Mat getRadiance() const = 0;
	overload->addOverload("calibraterobertson", "CalibrateRobertson", "getRadiance", {}, getRadiance);
//		};
//	
//		/** @brief Creates CalibrateRobertson object
//	
//		@param max_iter maximal number of Gauss-Seidel solver iterations.
//		@param threshold target difference between results of two successive steps of the minimization.
//		*/
//	
	overload->addOverload("calibraterobertson", "CalibrateRobertson", "createCalibrateRobertson", {
		make_param<int>("max_iter","int", 30),
		make_param<float>("threshold","float", 0.01f)
	}, createCalibrateRobertson);
//		interface IcreateCalibrateRobertson {
//			(max_iter ? : _st.int /*= 30*/, threshold ? : _st.float /* = 0.01f*/) : CalibrateRobertson;
//		}
//	
//		export var createCalibrateRobertson : IcreateCalibrateRobertson = alvision_module.createCalibrateRobertson;
//	
//		//    CV_EXPORTS_W Ptr< CalibrateRobertson > createCalibrateRobertson(int max_iter = 30, float threshold = 0.01f);
//	


	target->Set(Nan::New("CalibrateRobertson").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> CalibrateRobertson::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(CalibrateRobertson::New){throw std::runtime_error("not implemented");}
POLY_METHOD(CalibrateRobertson::getMaxIter){throw std::runtime_error("not implemented");}
POLY_METHOD(CalibrateRobertson::setMaxIter){throw std::runtime_error("not implemented");}
POLY_METHOD(CalibrateRobertson::getThreshold){throw std::runtime_error("not implemented");}
POLY_METHOD(CalibrateRobertson::setThreshold){throw std::runtime_error("not implemented");}
POLY_METHOD(CalibrateRobertson::getRadiance){throw std::runtime_error("not implemented");}
POLY_METHOD(CalibrateRobertson::createCalibrateRobertson){throw std::runtime_error("not implemented");}


