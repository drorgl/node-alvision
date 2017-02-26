#include "TonemapReinhard.h"
#include "../IOArray.h"
#include "../Matrix.h"

namespace tonemapreinhard_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("tonemapreinhard_general_callback is empty");
		}
		return overload->execute("tonemapreinhard", info);
	}
}

Nan::Persistent<FunctionTemplate> TonemapReinhard::constructor;

void TonemapReinhard::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	tonemapreinhard_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(tonemapreinhard_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("TonemapReinhard").ToLocalChecked());
	ctor->Inherit(Nan::New(Tonemap::constructor));

	overload->register_type<TonemapReinhard>(ctor, "tonemapreinhard", "TonemapReinhard");



	overload->addOverloadConstructor("tonemapreinhard", "TonemapReinhard", {}, New);




//	/** @brief This is a global tonemapping operator that models human visual system.
//	
//		Mapping function is controlled by adaptation parameter, that is computed using light adaptation and
//		color adaptation.
//	
//		For more information see @cite RD05 .
//		*/
//		interface TonemapReinhard extends Tonemap
//		{
//			//public:
//			//CV_WRAP virtual float getIntensity() const = 0;
	overload->addOverload("tonemapreinhard", "TonemapReinhard", "getIntensity", {}, getIntensity);
//			//CV_WRAP virtual void setIntensity(float intensity) = 0;
	overload->addOverload("tonemapreinhard", "TonemapReinhard", "setIntensity", {make_param<float>("intensity","float")}, setIntensity);
//			//
//			//CV_WRAP virtual float getLightAdaptation() const = 0;
	overload->addOverload("tonemapreinhard", "TonemapReinhard", "getLightAdaptation", {}, getLightAdaptation);
//			//CV_WRAP virtual void setLightAdaptation(float light_adapt) = 0;
	overload->addOverload("tonemapreinhard", "TonemapReinhard", "setLightAdaptation", {make_param<float>("light_adapt","float")}, setLightAdaptation);
//			//
//			//CV_WRAP virtual float getColorAdaptation() const = 0;
	overload->addOverload("tonemapreinhard", "TonemapReinhard", "getColorAdaptation", {}, getColorAdaptation);
//			//CV_WRAP virtual void setColorAdaptation(float color_adapt) = 0;
	overload->addOverload("tonemapreinhard", "TonemapReinhard", "setColorAdaptation", {make_param<float>("color_adapt","float")}, setColorAdaptation);
//		};
//	
//		/** @brief Creates TonemapReinhard object
//	
//		@param gamma gamma value for gamma correction. See createTonemap
//		@param intensity result intensity in [-8, 8] range. Greater intensity produces brighter results.
//		@param light_adapt light adaptation in [0, 1] range. If 1 adaptation is based only on pixel
//		value, if 0 it's global, otherwise it's a weighted mean of this two cases.
//		@param color_adapt chromatic adaptation in [0, 1] range. If 1 channels are treated independently,
//		if 0 adaptation level is the same for each channel.
//		*/
//	
	overload->addOverload("tonemapreinhard", "TonemapReinhard", "createTonemapReinhard", {
		make_param<float>("gamma","float", 1.0f),
		make_param<float>("intensity","float", 0.0f),
		make_param<float>("light_adapt","float",1.0f), 
		make_param<float>("color_adapt","float", 0.0f)
	
	}, createTonemapReinhard);
//		interface IcreateTonemapReinhard {
//			(gamma ? : _st.float /* = 1.0f*/, intensity ? : _st.float /* = 0.0f*/, light_adapt ? : _st.float /*= 1.0f*/, color_adapt ? : _st.float /* = 0.0f*/) : TonemapReinhard;
//		}
//	
//		export var createTonemapReinhard : IcreateTonemapReinhard = alvision_module.createTonemapReinhard;
//	
//		//    CV_EXPORTS_W Ptr< TonemapReinhard >
//		//        createTonemapReinhard(float gamma = 1.0f, float intensity = 0.0f, float light_adapt = 1.0f, float color_adapt = 0.0f);
//	
	target->Set(Nan::New("TonemapReinhard").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> TonemapReinhard::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(TonemapReinhard::New){throw std::runtime_error("not implemented");}
POLY_METHOD(TonemapReinhard::getIntensity){throw std::runtime_error("not implemented");}
POLY_METHOD(TonemapReinhard::setIntensity){throw std::runtime_error("not implemented");}
POLY_METHOD(TonemapReinhard::getLightAdaptation){throw std::runtime_error("not implemented");}
POLY_METHOD(TonemapReinhard::setLightAdaptation){throw std::runtime_error("not implemented");}
POLY_METHOD(TonemapReinhard::getColorAdaptation){throw std::runtime_error("not implemented");}
POLY_METHOD(TonemapReinhard::setColorAdaptation){throw std::runtime_error("not implemented");}
POLY_METHOD(TonemapReinhard::createTonemapReinhard){throw std::runtime_error("not implemented");}

