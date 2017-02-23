#include "TonemapDurand.h"
#include "../IOArray.h"
#include "../Matrix.h"

namespace tonemapdurand_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("tonemapdurand_general_callback is empty");
		}
		return overload->execute("tonemapdurand", info);
	}
}

Nan::Persistent<FunctionTemplate> TonemapDurand::constructor;

void TonemapDurand::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	tonemapdurand_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(tonemapdurand_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("TonemapDurand").ToLocalChecked());
	ctor->Inherit(Nan::New(Tonemap::constructor));

	overload->register_type<TonemapDurand>(ctor, "tonemapdurand", "TonemapDurand");



	overload->addOverloadConstructor("tonemapdurand", "TonemapDurand", {}, New);




//	
//	/** @brief This algorithm decomposes image into two layers: base layer and detail layer using bilateral filter
//		and compresses contrast of the base layer thus preserving all the details.
//	
//		This implementation uses regular bilateral filter from opencv.
//	
//		Saturation enhancement is possible as in ocvTonemapDrago.
//	
//		For more information see @cite DD02 .
//		*/
//		interface TonemapDurand extends Tonemap
//		{
//			//public:
//			//
//			//CV_WRAP virtual float getSaturation() const = 0;
	overload->addOverload("tonemapdurand", "TonemapDurand", "getSaturation", {}, getSaturation);
//			//CV_WRAP virtual void setSaturation(float saturation) = 0;
	overload->addOverload("tonemapdurand", "TonemapDurand", "setSaturation", {make_param<float>("saturation","float")}, setSaturation);
//			//
//			//CV_WRAP virtual float getContrast() const = 0;
	overload->addOverload("tonemapdurand", "TonemapDurand", "getContrast", {}, getContrast);
//			//CV_WRAP virtual void setContrast(float contrast) = 0;
	overload->addOverload("tonemapdurand", "TonemapDurand", "setContrast", {make_param<float>("contrast","float")}, setContrast);
//			//
//			//CV_WRAP virtual float getSigmaSpace() const = 0;
	overload->addOverload("tonemapdurand", "TonemapDurand", "getSigmaSpace", {}, getSigmaSpace);
//			//CV_WRAP virtual void setSigmaSpace(float sigma_space) = 0;
	overload->addOverload("tonemapdurand", "TonemapDurand", "setSigmaSpace", {make_param<float>("sigma_space","float")}, setSigmaSpace);
//			//
//			//CV_WRAP virtual float getSigmaColor() const = 0;
	overload->addOverload("tonemapdurand", "TonemapDurand", "getSigmaColor", {}, getSigmaColor);
//			//CV_WRAP virtual void setSigmaColor(float sigma_color) = 0;
	overload->addOverload("tonemapdurand", "TonemapDurand", "setSigmaColor", {make_param<float>("sigma_color","float")}, setSigmaColor);
//		};
//	
//		/** @brief Creates TonemapDurand object
//	
//		@param gamma gamma value for gamma correction. See createTonemap
//		@param contrast resulting contrast on logarithmic scale, i. e. log(max / min), where max and min
//		are maximum and minimum luminance values of the resulting image.
//		@param saturation saturation enhancement value. See createTonemapDrago
//		@param sigma_space bilateral filter sigma in color space
//		@param sigma_color bilateral filter sigma in coordinate space
//		*/
//	
	overload->addOverload("tonemapdurand", "TonemapDurand", "createTonemapDurand", {
		make_param<float>("gamma","float", 1.0f),
		make_param<float>("contrast","float", 4.0f),
		make_param<float>("saturation","float", 1.0f),
		make_param<float>("sigma_space","float", 2.0f),
		make_param<float>("sigma_color","float", 2.0f)
	}, createTonemapDurand);
//		interface IcreateTonemapDurand {
//			(gamma ? : _st.float /* = 1.0f*/, contrast ? : _st.float /* = 4.0f*/, saturation ? : _st.float /* = 1.0f*/, sigma_space ? : _st.float /* = 2.0f*/, sigma_color ? : _st.float /* = 2.0f*/) : //  TonemapDurand;
//		}
//	
//		export var createTonemapDurand : IcreateTonemapDurand = alvision_module.createTonemapDurand;
//	
//		//    CV_EXPORTS_W Ptr< TonemapDurand >
//		//        createTonemapDurand(float gamma = 1.0f, float contrast = 4.0f, float saturation = 1.0f, float sigma_space = 2.0f, float sigma_color = 2.0f);


	target->Set(Nan::New("TonemapDurand").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> TonemapDurand::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(TonemapDurand::New){throw std::exception("not implemented");}
POLY_METHOD(TonemapDurand::getSaturation){throw std::exception("not implemented");}
POLY_METHOD(TonemapDurand::setSaturation){throw std::exception("not implemented");}
POLY_METHOD(TonemapDurand::getContrast){throw std::exception("not implemented");}
POLY_METHOD(TonemapDurand::setContrast){throw std::exception("not implemented");}
POLY_METHOD(TonemapDurand::getSigmaSpace){throw std::exception("not implemented");}
POLY_METHOD(TonemapDurand::setSigmaSpace){throw std::exception("not implemented");}
POLY_METHOD(TonemapDurand::getSigmaColor){throw std::exception("not implemented");}
POLY_METHOD(TonemapDurand::setSigmaColor){throw std::exception("not implemented");}
POLY_METHOD(TonemapDurand::createTonemapDurand){throw std::exception("not implemented");}

