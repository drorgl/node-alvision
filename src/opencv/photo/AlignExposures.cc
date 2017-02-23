#include "AlignExposures.h"
#include "../IOArray.h"
#include "../Matrix.h"

namespace alignexposures_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("alignexposures_general_callback is empty");
		}
		return overload->execute("alignexposures", info);
	}
}

Nan::Persistent<FunctionTemplate> AlignExposures::constructor;

void AlignExposures::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	alignexposures_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(alignexposures_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("AlignExposures").ToLocalChecked());
	ctor->Inherit(Nan::New(Algorithm::constructor));

	overload->register_type<AlignExposures>(ctor, "alignexposures", "AlignExposures");



	overload->addOverloadConstructor("alignexposures", "AlignExposures", {}, New);
//	/** @brief The base class for algorithms that align images of the same scene with different exposures
//		*/
//		interface AlignExposures extends _core.Algorithm
//		{
//			//public:
//			///** @brief Aligns images
//			//
//			//@param src vector of input images
//			//@param dst vector of aligned images
//			//@param times vector of exposure time values for each image
//			//@param response 256x1 matrix with inverse camera response function for each pixel value, it should
//			//have the same number of channels as images.
//			// */
//			//CV_WRAP virtual void process(InputArrayOfArrays src, std::vector<Mat>& dst,
//			//    InputArray times, InputArray response) = 0;
	overload->addOverload("alignexposures", "AlignExposures","process", {
		make_param<IOArray*>("src","InputArrayOfArrays"),
		make_param<std::shared_ptr<std::vector<Matrix*>>>("dst","Array<Mat>"),
		make_param<IOArray*>("times","InputArray"),
		make_param<IOArray*>("response","InputArray")
	}, process);

	Nan::SetPrototypeMethod(ctor, "process", alignexposures_general_callback::callback);
//		};


	target->Set(Nan::New("AlignExposures").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> AlignExposures::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(AlignExposures::New){throw std::exception("not implemented");}
POLY_METHOD(AlignExposures::process){throw std::exception("not implemented");}

