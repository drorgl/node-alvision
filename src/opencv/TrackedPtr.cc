#include "TrackedPtr.h"

namespace trackedptr_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(tracked_ptr_callback) {
		return overload->execute("trackedptr", info);
	}
}


Nan::Persistent<FunctionTemplate> TrackedPtr::constructor;

void TrackedPtr::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	trackedptr_general_callback::overload = overload;

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(trackedptr_general_callback::tracked_ptr_callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("TrackedPtr").ToLocalChecked());

	overload->register_type<TrackedPtr>(ctor, "trackedptr", "TrackedPtr");

	overload->addOverloadConstructor("trackedptr", "TrackedPtr", {}, TrackedPtr::New);

	target->Set(Nan::New("TrackedPtr").ToLocalChecked(), ctor->GetFunction());
}

POLY_METHOD(TrackedPtr::New) {
	return Nan::ThrowError("TrackedPtr cannot be created manually, its part of the Alvision internal module");
}

