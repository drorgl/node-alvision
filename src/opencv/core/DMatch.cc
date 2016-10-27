#include "DMatch.h"

Nan::Persistent<FunctionTemplate> DMatch::constructor;


void
DMatch::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(DMatch::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("DMatch").ToLocalChecked());


	target->Set(Nan::New("DMatch").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(DMatch::New) {
	
	if (info.This()->InternalFieldCount() == 0)
		Nan::ThrowTypeError("Cannot instantiate without new");

	DMatch *dmatch;

	//if (info.Length() == 0){
	dmatch = new DMatch();
	//}

	dmatch->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

