#include "MatExpr.h"

Nan::Persistent<FunctionTemplate> MatExpr::constructor;


void
MatExpr::Init(Handle<Object> target) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(MatExpr::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("MatExpr").ToLocalChecked());

	// Prototype
	

	target->Set(Nan::New("MatExpr").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(MatExpr::New) {
	
	if (info.This()->InternalFieldCount() == 0)
		Nan::ThrowTypeError("Cannot instantiate without new");

	MatExpr *mat;

	if (info.Length() == 0){
		mat = new MatExpr;
	}

	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

