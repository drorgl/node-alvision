#include "DMatch.h"

Nan::Persistent<FunctionTemplate> DMatch::constructor;


void
DMatch::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(DMatch::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("DMatch").ToLocalChecked());

	overload->register_type<DMatch>(ctor, "dmatch", "DMatch");


	target->Set(Nan::New("DMatch").ToLocalChecked(), ctor->GetFunction());

	

};

v8::Local<v8::Function> DMatch::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


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

