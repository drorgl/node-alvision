#include "superres.h"

Nan::Persistent<Object> superres::superresObject;


void
superres::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Local<Object> superres = Nan::New<Object>();

	superresObject.Reset(superres);

	target->Set(Nan::New("superres").ToLocalChecked(), superres);

	Nan::SetMethod(superres, "createSuperResolution_BTVL1", createSuperResolution_BTVL1);

	optical_flow::Init(superres, overload);

};

NAN_METHOD(superres::createSuperResolution_BTVL1) {
	return Nan::ThrowError("not implemented");
}