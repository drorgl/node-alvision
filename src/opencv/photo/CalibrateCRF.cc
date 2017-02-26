#include "CalibrateCRF.h"
#include "../IOArray.h"
#include "../Matrix.h"

namespace calibratecrf_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("calibratecrf_general_callback is empty");
		}
		return overload->execute("calibratecrf", info);
	}
}

Nan::Persistent<FunctionTemplate> CalibrateCRF::constructor;

void CalibrateCRF::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	calibratecrf_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(calibratecrf_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("CalibrateCRF").ToLocalChecked());
	ctor->Inherit(Nan::New(Algorithm::constructor));

	overload->register_type<CalibrateCRF>(ctor, "calibratecrf", "CalibrateCRF");

	overload->addOverloadConstructor("calibratecrf", "CalibrateCRF", {}, New);


//	/** @brief The base class for camera response calibration algorithms.
//	*/
//	interface CalibrateCRF extends _core.Algorithm
//	{
//		//public:
//		/** @brief Recovers inverse camera response.
//
//		@param src vector of input images
//		@param dst 256x1 matrix with inverse camera response function
//		@param times vector of exposure time values for each image
//		*/
//		process(src: _st.InputArrayOfArrays, dst : _st.OutputArray, times : _st.InputArray) : void;
	overload->addOverload("calibratecrf", "CalibrateCRF", "process", {
		make_param<IOArray*>("src","InputArrayOfArrays"),
		make_param<IOArray*>("dst","OutputArray"), 
		make_param<IOArray*>("times","InputArray")
	}, process);

//	};
//
	target->Set(Nan::New("CalibrateCRF").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> CalibrateCRF::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(CalibrateCRF::New){throw std::runtime_error("not implemented");}
POLY_METHOD(CalibrateCRF::process){throw std::runtime_error("not implemented");}

