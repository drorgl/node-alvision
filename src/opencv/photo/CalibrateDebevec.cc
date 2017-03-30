#include "CalibrateDebevec.h"
#include "../IOArray.h"
#include "../Matrix.h"

namespace calibratedebevec_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("calibratedebevec_general_callback is empty");
		}
		return overload->execute("calibratedebevec", info);
	}
}

Nan::Persistent<FunctionTemplate> CalibrateDebevec::constructor;

void CalibrateDebevec::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	calibratedebevec_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(calibratedebevec_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("CalibrateDebevec").ToLocalChecked());
	ctor->Inherit(Nan::New(CalibrateCRF::constructor));

	overload->register_type<CalibrateDebevec>(ctor, "calibratedebevec", "CalibrateDebevec");

	overload->addOverloadConstructor("calibratedebevec", "CalibrateDebevec", {}, New);



//	
//	/** @brief Inverse camera response function is extracted for each brightness value by minimizing an objective
//		function as linear system. Objective function is constructed using pixel values on the same position
//		in all images, extra term is added to make the result smoother.
//	
//		For more information see @cite DM97 .
//		*/
//		interface CalibrateDebevec extends CalibrateCRF
//		{
//			//public:
//			//CV_WRAP virtual float getLambda() const = 0;
	overload->addOverload("calibratedebevec", "CalibrateDebevec", "getLambda", {}, getLambda);
//			//CV_WRAP virtual void setLambda(float lambda) = 0;
	overload->addOverload("calibratedebevec", "CalibrateDebevec", "setLambda", {make_param<float>("lambda","float")}, setLambda);
//			//
//			//CV_WRAP virtual int getSamples() const = 0;
	overload->addOverload("calibratedebevec", "CalibrateDebevec", "getSamples", {}, getSamples);
//			//CV_WRAP virtual void setSamples(int samples) = 0;
	overload->addOverload("calibratedebevec", "CalibrateDebevec", "setSamples", {make_param<int>("samples","int")}, setSamples);
//			//
//			//CV_WRAP virtual bool getRandom() const = 0;
	overload->addOverload("calibratedebevec", "CalibrateDebevec", "getRandom", {}, getRandom);
//			//CV_WRAP virtual void setRandom(bool random) = 0;
	overload->addOverload("calibratedebevec", "CalibrateDebevec", "setRandom", {make_param<bool>("random","bool")}, setRandom);
//		};
//	
//		/** @brief Creates CalibrateDebevec object
//	
//		@param samples number of pixel locations to use
//		@param lambda smoothness term weight. Greater values produce smoother results, but can alter the
//		response.
//		@param random if true sample pixel locations are chosen at random, otherwise the form a
//		rectangular grid.
//		*/
//	
	overload->addOverload("calibratedebevec", "CalibrateDebevec", "createCalibrateDebevec", {
		make_param<int>("samples","int", 70),
		make_param<float>("lambda","float", 10.0f),
		make_param<bool>("random","bool", false)
	}, createCalibrateDebevec);
//		interface IcreateCalibrateDebevec {
//			(samples ? : _st.int /* = 70*/, lambda ? : _st.float /* = 10.0f*/, random ? : boolean/* = false*/) : CalibrateDebevec;
//		}
//	
//		export var createCalibrateDebevec : IcreateCalibrateDebevec = alvision_module.createCalibrateDebevec;
//	
//		//    CV_EXPORTS_W Ptr< CalibrateDebevec > createCalibrateDebevec(int samples = 70, float lambda = 10.0f, bool random = false);


	target->Set(Nan::New("CalibrateDebevec").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> CalibrateDebevec::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(CalibrateDebevec::New){throw std::runtime_error("not implemented");}
POLY_METHOD(CalibrateDebevec::getLambda){throw std::runtime_error("not implemented");}
POLY_METHOD(CalibrateDebevec::setLambda){throw std::runtime_error("not implemented");}
POLY_METHOD(CalibrateDebevec::getSamples){throw std::runtime_error("not implemented");}
POLY_METHOD(CalibrateDebevec::setSamples){throw std::runtime_error("not implemented");}
POLY_METHOD(CalibrateDebevec::getRandom){throw std::runtime_error("not implemented");}
POLY_METHOD(CalibrateDebevec::setRandom){throw std::runtime_error("not implemented");}
POLY_METHOD(CalibrateDebevec::createCalibrateDebevec){throw std::runtime_error("not implemented");}


