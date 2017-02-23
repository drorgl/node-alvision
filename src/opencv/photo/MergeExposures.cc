#include "MergeExposures.h"
#include "../IOArray.h"
#include "../Matrix.h"

namespace mergeexposures_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("mergeexposures_general_callback is empty");
		}
		return overload->execute("mergeexposures", info);
	}
}

Nan::Persistent<FunctionTemplate> MergeExposures::constructor;

void MergeExposures::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	mergeexposures_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(mergeexposures_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("MergeExposures").ToLocalChecked());
	ctor->Inherit(Nan::New(Algorithm::constructor));

	overload->register_type<MergeExposures>(ctor, "mergeexposures", "MergeExposures");



	overload->addOverloadConstructor("mergeexposures", "MergeExposures", {}, New);
	

//		/** @brief The base class algorithms that can merge exposure sequence to a single image.
//		*/
//		interface MergeExposures extends _core.Algorithm
//		{
//			//public:
//			/** @brief Merges images.
//	
//			@param src vector of input images
//			@param dst result image
//			@param times vector of exposure time values for each image
//			@param response 256x1 matrix with inverse camera response function for each pixel value, it should
//			have the same number of channels as images.
//			*/
//			process(src: _st.InputArrayOfArrays, dst : _st.OutputArray ,
//			times : _st.InputArray, response : _st.InputArray) : void;
	overload->addOverload("mergeexposures", "MergeExposures", "process", {
		make_param<IOArray*>("src","InputArrayOfArrays"),
		make_param<IOArray*>("dst","OutputArray"),
		make_param<IOArray*>("times","InputArray"),
		make_param<IOArray*>("response","InputArray")
	}, process);
//		};



	target->Set(Nan::New("MergeExposures").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> MergeExposures::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}

POLY_METHOD(MergeExposures::New){throw std::exception("not implemented");}
POLY_METHOD(MergeExposures::process){throw std::exception("not implemented");}

