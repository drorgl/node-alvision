#include "Algorithm.h"

Nan::Persistent<FunctionTemplate> Algorithm::constructor;


void
Algorithm::Init(Handle<Object> target) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Algorithm::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("Algorithm").ToLocalChecked());

	Nan::SetMethod(ctor, "load", load);


	target->Set(Nan::New("Algorithm").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(Algorithm::New) {
	
	if (info.This()->InternalFieldCount() == 0)
		Nan::ThrowTypeError("Cannot instantiate without new");

	Algorithm *algorithm;

	//if (info.Length() == 0){
		algorithm = new Algorithm();
	//}

	algorithm->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(Algorithm::load) {
	return Nan::ThrowError("not implemented");
}