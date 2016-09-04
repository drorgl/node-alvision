#include "superres.h"

Nan::Persistent<Object> superres::superresObject;


void
superres::Init(Handle<Object> target) {
	Local<Object> superres = Nan::New<Object>();

	superresObject.Reset(superres);

	target->Set(Nan::New("superres").ToLocalChecked(), superres);

	optical_flow::Init(superres);

};
