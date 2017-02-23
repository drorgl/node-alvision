
#include "TonemapDrago.h"
#include "../IOArray.h"
#include "../Matrix.h"

namespace tonemapdrago_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("tonemapdrago_general_callback is empty");
		}
		return overload->execute("tonemapdrago", info);
	}
}

Nan::Persistent<FunctionTemplate> TonemapDrago::constructor;

void TonemapDrago::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	tonemapdrago_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(tonemapdrago_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("TonemapDrago").ToLocalChecked());
	ctor->Inherit(Nan::New(Tonemap::constructor));

	overload->register_type<TonemapDrago>(ctor, "tonemapdrago", "TonemapDrago");



	overload->addOverloadConstructor("tonemapdrago", "TonemapDrago", {}, New);



//		/** @brief Adaptive logarithmic mapping is a fast global tonemapping algorithm that scales the image in
//		logarithmic domain.
//	
//		Since it's a global operator the same function is applied to all the pixels, it is controlled by the
//		bias parameter.
//	
//		Optional saturation enhancement is possible as described in @cite FL02 .
//	
//		For more information see @cite DM03 .
//		*/
//		interface TonemapDrago extends Tonemap
//		{
//			//public:
//			//
//			//CV_WRAP virtual float getSaturation() const = 0;
	overload->addOverload("tonemapdrago", "TonemapDrago", "getSaturation", {}, getSaturation);
//			//CV_WRAP virtual void setSaturation(float saturation) = 0;
	overload->addOverload("tonemapdrago", "TonemapDrago", "setSaturation", {make_param<float>("saturation","float")}, setSaturation);
//			//
//			//CV_WRAP virtual float getBias() const = 0;
	overload->addOverload("tonemapdrago", "TonemapDrago", "getBias", {}, getBias);
//			//CV_WRAP virtual void setBias(float bias) = 0;
	overload->addOverload("tonemapdrago", "TonemapDrago", "setBias", {make_param<float>("bias","float")}, setBias);
//		};
//	
//		/** @brief Creates TonemapDrago object
//	
//		@param gamma gamma value for gamma correction. See createTonemap
//		@param saturation positive saturation enhancement value. 1.0 preserves saturation, values greater
//		than 1 increase saturation and values less than 1 decrease it.
//		@param bias value for bias function in [0, 1] range. Values from 0.7 to 0.9 usually give best
//		results, default value is 0.85.
//		*/
//	
	overload->addOverload("tonemapdrago", "TonemapDrago", "createTonemapDrago", {
		make_param<float>("gamma","float", 1.0f),
		make_param<float>("saturation","float", 1.0f),
		make_param<float>("bias","float", 0.85f)
	}, createTonemapDrago);
//		interface IcreateTonemapDrago {
//			(gamma ? : _st.float /* = 1.0f*/, saturation ? : _st.float /* = 1.0f*/, bias ? : _st.float /* = 0.85f*/) : TonemapDrago;
//		}
//	
//		export var createTonemapDrago : IcreateTonemapDrago = alvision_module.createTonemapDrago;
//	
//		//CV_EXPORTS_W Ptr< TonemapDrago > createTonemapDrago(float gamma = 1.0f, float saturation = 1.0f, float bias = 0.85f);


	target->Set(Nan::New("TonemapDrago").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> TonemapDrago::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}



POLY_METHOD(TonemapDrago::New){throw std::exception("not implemented");}
POLY_METHOD(TonemapDrago::getSaturation){throw std::exception("not implemented");}
POLY_METHOD(TonemapDrago::setSaturation){throw std::exception("not implemented");}
POLY_METHOD(TonemapDrago::getBias){throw std::exception("not implemented");}
POLY_METHOD(TonemapDrago::setBias){throw std::exception("not implemented");}
POLY_METHOD(TonemapDrago::createTonemapDrago){throw std::exception("not implemented");}
