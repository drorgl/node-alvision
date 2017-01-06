#include "TrackedElement.h"

namespace trackedelement_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(tracked_ptr_callback) {
		if (overload == nullptr) {
			throw std::exception("trackedelement_general_callback is empty");
		}
		return overload->execute("tracked_element", info);
	}
}


Nan::Persistent<FunctionTemplate> TrackedElement::constructor;

 v8::Local<v8::Function> TrackedElement::get_constructor() {
	 assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


void TrackedElement::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	trackedelement_general_callback::overload = overload;

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(trackedelement_general_callback::tracked_ptr_callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("TrackedElement").ToLocalChecked());

	overload->register_type<TrackedElement>(ctor, "trackedelement", "TrackedElement");


	overload->addOverloadConstructor("tracked_element", "TrackedElement", {}, TrackedElement::New);

	target->Set(Nan::New("TrackedElement").ToLocalChecked(), ctor->GetFunction());

	
}

POLY_METHOD(TrackedElement::New) {
	return Nan::ThrowError("TrackedElement cannot be created manually, its part of the Alvision internal module");
}

