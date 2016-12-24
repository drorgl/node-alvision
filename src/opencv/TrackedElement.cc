#include "TrackedElement.h"

namespace trackedelement_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(tracked_ptr_callback) {
		return overload->execute("tracked_element", info);
	}
}


Nan::Persistent<FunctionTemplate> TrackedElement::constructor;

void TrackedElement::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	trackedelement_general_callback::overload = overload;

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(trackedelement_general_callback::tracked_ptr_callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("TrackedElement").ToLocalChecked());

	overload->register_type<TrackedElement>(ctor, "tracked_element", "TrackedElement");

	overload->addOverloadConstructor("tracked_element", "TrackedElement", {}, TrackedElement::New);

	target->Set(Nan::New("TrackedElement").ToLocalChecked(), ctor->GetFunction());
}

POLY_METHOD(TrackedElement::New) {
	return Nan::ThrowError("TrackedElement cannot be created manually, its part of the Alvision internal module");
}

