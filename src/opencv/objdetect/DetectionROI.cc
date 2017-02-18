#include "DetectionROI.h"

namespace detectionroi_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("detectionroi_general_callback is empty");
		}
		return overload->execute("detectionroi", info);
	}
}

Nan::Persistent<FunctionTemplate> DetectionROI::constructor;

void
DetectionROI::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	detectionroi_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(detectionroi_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("CascadeClassifier").ToLocalChecked());


	overload->register_type<DetectionROI>(ctor, "detectionroi", "DetectionROI");

	//! struct for detection region of interest (ROI)
	//class DetectionROI {
	//	//! scale(size) of the bounding box
	//	public scale: _st.double;
	Nan::SetAccessor(itpl, Nan::New("scale").ToLocalChecked(), scale_getter, scale_setter);
	//	//! set of requrested locations to be evaluated
	//	public locations: Array<_types.Point>;
	Nan::SetAccessor(itpl, Nan::New("locations").ToLocalChecked(), locations_getter, locations_setter);
	//	//! vector that will contain confidence values for each location
	//	public confidences: Array<_st.double>;
	Nan::SetAccessor(itpl, Nan::New("confidences").ToLocalChecked(), confidences_getter, confidences_setter);
	//}

	target->Set(Nan::New("DetectionROI").ToLocalChecked(), ctor->GetFunction());

}

v8::Local<v8::Function> DetectionROI::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(DetectionROI::New) {
	auto ret = new DetectionROI();
	ret->_detectionROI = std::make_shared<cv::DetectionROI>();

	ret->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

NAN_GETTER(DetectionROI::scale_getter) { return Nan::ThrowError("not implemented"); }
NAN_SETTER(DetectionROI::scale_setter) { return Nan::ThrowError("not implemented"); }
NAN_GETTER(DetectionROI::locations_getter) { return Nan::ThrowError("not implemented"); }
NAN_SETTER(DetectionROI::locations_setter) { return Nan::ThrowError("not implemented"); }
NAN_GETTER(DetectionROI::confidences_getter) { return Nan::ThrowError("not implemented"); }
NAN_SETTER(DetectionROI::confidences_setter) { return Nan::ThrowError("not implemented"); }

