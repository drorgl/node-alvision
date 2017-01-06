#include "RNG.h"

Nan::Persistent<FunctionTemplate> RNG::constructor;


void
RNG::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(RNG::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("RNG").ToLocalChecked());

	overload->register_type<RNG>(ctor, "rng", "RNG");

	// Prototype
	Nan::SetPrototypeMethod(ctor, "fill", fill);
	Nan::SetPrototypeMethod(ctor, "int", genInt);
	Nan::SetPrototypeMethod(ctor, "double", genDouble);
	Nan::SetPrototypeMethod(ctor, "next", genNext);
	

	target->Set(Nan::New("RNG").ToLocalChecked(), ctor->GetFunction());

	
};

v8::Local<v8::Function> RNG::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


NAN_METHOD(RNG::New) {
	
	if (info.This()->InternalFieldCount() == 0)
		Nan::ThrowTypeError("Cannot instantiate without new");

	RNG *rng;

	//if (info.Length() == 0){
		rng = new RNG();
	//}

	rng->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(RNG::fill) {
	return Nan::ThrowError("not implemented");
}

NAN_METHOD(RNG::genInt) {
	return Nan::ThrowError("not implemented");
}

NAN_METHOD(RNG::genDouble) {
	return Nan::ThrowError("not implemented");
}

NAN_METHOD(RNG::genNext) {
	return Nan::ThrowError("not implemented");
}