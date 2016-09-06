#include "RNG.h"

Nan::Persistent<FunctionTemplate> RNG::constructor;


void
RNG::Init(Handle<Object> target) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(RNG::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("RNG").ToLocalChecked());

	// Prototype
	

	target->Set(Nan::New("RNG").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(RNG::New) {
	
	if (info.This()->InternalFieldCount() == 0)
		Nan::ThrowTypeError("Cannot instantiate without new");

	RNG *rng;

	if (info.Length() == 0){
		rng = new RNG();
	}

	rng->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

