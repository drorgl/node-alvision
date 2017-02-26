#include "TonemapMantiuk.h"
#include "../IOArray.h"
#include "../Matrix.h"

namespace tonemapmantiuk_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("tonemapmantiuk_general_callback is empty");
		}
		return overload->execute("tonemapmantiuk", info);
	}
}

Nan::Persistent<FunctionTemplate> TonemapMantiuk::constructor;

void TonemapMantiuk::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	tonemapmantiuk_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(tonemapmantiuk_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("TonemapMantiuk").ToLocalChecked());
	ctor->Inherit(Nan::New(Tonemap::constructor));

	overload->register_type<TonemapMantiuk>(ctor, "tonemapmantiuk", "TonemapMantiuk");



	overload->addOverloadConstructor("tonemapmantiuk", "TonemapMantiuk", {}, New);





//	/** @brief This algorithm transforms image to contrast using gradients on all levels of gaussian pyramid,
//		transforms contrast values to HVS response and scales the response. After this the image is
//		reconstructed from new contrast values.
//	
//		For more information see @cite MM06 .
//		*/
//		interface TonemapMantiuk extends Tonemap
//		{
//			//public:
//			//CV_WRAP virtual float getScale() const = 0;
	overload->addOverload("tonemapmantiuk", "TonemapMantiuk", "getScale", {}, getScale);
//			//CV_WRAP virtual void setScale(float scale) = 0;
	overload->addOverload("tonemapmantiuk", "TonemapMantiuk", "setScale", {make_param<float>("scale","float")}, setScale);
//			//
//			//CV_WRAP virtual float getSaturation() const = 0;
	overload->addOverload("tonemapmantiuk", "TonemapMantiuk", "getSaturation", {}, getSaturation);
//			//CV_WRAP virtual void setSaturation(float saturation) = 0;
	overload->addOverload("tonemapmantiuk", "TonemapMantiuk", "setSaturation", {make_param<float>("saturation","float")}, setSaturation);
//		};
//	
//		/** @brief Creates TonemapMantiuk object
//	
//		@param gamma gamma value for gamma correction. See createTonemap
//		@param scale contrast scale factor. HVS response is multiplied by this parameter, thus compressing
//		dynamic range. Values from 0.6 to 0.9 produce best results.
//		@param saturation saturation enhancement value. See createTonemapDrago
//		*/
//	
	overload->addOverload("tonemapmantiuk", "TonemapMantiuk", "createTonemapMantiuk", {
		make_param<float>("gamma","float", 1.0f), 
		make_param<float>("scale","float", 0.7f), 
		make_param<float>("saturation","float", 1.0f)
	}, createTonemapMantiuk);
//		interface IcreateTonemapMantiuk {
//			(gamma ? : _st.float /* = 1.0f*/, scale ? : _st.float /* = 0.7f*/, saturation ? : _st.float /* = 1.0f*/) : TonemapMantiuk;
//		}
//	
//		export var createTonemapMantiuk : IcreateTonemapMantiuk = alvision_module.createTonemapMantiuk;
//	
//	
//		//    CV_EXPORTS_W Ptr< TonemapMantiuk >
//		//        createTonemapMantiuk(float gamma = 1.0f, float scale = 0.7f, float saturation = 1.0f);



	target->Set(Nan::New("TonemapMantiuk").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> TonemapMantiuk::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}



POLY_METHOD(TonemapMantiuk::New){throw std::runtime_error("not implemented");}
POLY_METHOD(TonemapMantiuk::getScale){throw std::runtime_error("not implemented");}
POLY_METHOD(TonemapMantiuk::setScale){throw std::runtime_error("not implemented");}
POLY_METHOD(TonemapMantiuk::getSaturation){throw std::runtime_error("not implemented");}
POLY_METHOD(TonemapMantiuk::setSaturation){throw std::runtime_error("not implemented");}
POLY_METHOD(TonemapMantiuk::createTonemapMantiuk){throw std::runtime_error("not implemented");}

