
#include "Tonemap.h"
#include "../IOArray.h"
#include "../Matrix.h"

namespace tonemap_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("tonemap_general_callback is empty");
		}
		return overload->execute("tonemap", info);
	}
}

Nan::Persistent<FunctionTemplate> Tonemap::constructor;

void Tonemap::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	tonemap_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(tonemap_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("Tonemap").ToLocalChecked());
	ctor->Inherit(Nan::New(Algorithm::constructor));

	overload->register_type<Tonemap>(ctor, "tonemap", "Tonemap");



	overload->addOverloadConstructor("tonemap", "Tonemap", {}, New);




//	/** @brief Base class for tonemapping algorithms - tools that are used to map HDR image to 8-bit range.
//		*/
//		interface Tonemap extends _core.Algorithm
//		{
//			//public:
//			/** @brief Tonemaps image
//	
//			@param src source image - 32-bit 3-channel Mat
//			@param dst destination image - 32-bit 3-channel Mat with values in [0, 1] range
//			*/
//			process(src: _st.InputArray, dst : _st.OutputArray) : void;
	overload->addOverload("tonemap", "Tonemap", "process", {
		make_param<IOArray*>("src","InputArray"),
		make_param<IOArray*>("dst","OutputArray")
	}, process);
//	
//		getGamma() : _st.float;
	overload->addOverload("tonemap", "Tonemap", "getGamma", {}, getGamma);
//		setGamma(gamma: _st.float) : void
	overload->addOverload("tonemap", "Tonemap", "setGamma", {make_param<float>("gamma","float")}, setGamma);
//		};
//	
//		/** @brief Creates simple linear mapper with gamma correction
//	
//		@param gamma positive value for gamma correction. Gamma value of 1.0 implies no correction, gamma
//		equal to 2.2f is suitable for most displays.
//		Generally gamma \> 1 brightens the image and gamma \< 1 darkens it.
//		*/
//	
	overload->addOverload("tonemap", "Tonemap", "createTonemap", {
		make_param<float>("gamma","float", 1.0f)
	}, createTonemap);
//		interface IcreateTonemap {
//			(gamma ? : _st.float /* = 1.0f*/) : Tonemap;
//		}
//	
//		export var createTonemap : IcreateTonemap = alvision_module.createTonemap;
//	
//		//CV_EXPORTS_W Ptr< Tonemap > createTonemap(float gamma = 1.0f);
//	
//	

	target->Set(Nan::New("Tonemap").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> Tonemap::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}




POLY_METHOD(Tonemap::New){throw std::exception("not implemented");}
POLY_METHOD(Tonemap::process){throw std::exception("not implemented");}
POLY_METHOD(Tonemap::getGamma){throw std::exception("not implemented");}
POLY_METHOD(Tonemap::setGamma){throw std::exception("not implemented");}
POLY_METHOD(Tonemap::createTonemap){throw std::exception("not implemented");}

