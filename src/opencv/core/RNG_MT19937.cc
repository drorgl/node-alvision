#include "RNG_MT19937.h"

Nan::Persistent<FunctionTemplate> RNG_MT19937::constructor;


void
RNG_MT19937::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(RNG_MT19937::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("RNG_MT19937").ToLocalChecked());

	// Prototype
	Nan::SetPrototypeMethod(ctor, "fill", fill);
	Nan::SetPrototypeMethod(ctor, "int", genInt);
	Nan::SetPrototypeMethod(ctor, "double", genDouble);
	Nan::SetPrototypeMethod(ctor, "next", genNext);
	

	target->Set(Nan::New("RNG_MT19937").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(RNG_MT19937::New) {
	
	if (info.This()->InternalFieldCount() == 0)
		Nan::ThrowTypeError("Cannot instantiate without new");

	RNG_MT19937 *rng_mt19937;

	//if (info.Length() == 0){
	rng_mt19937 = new RNG_MT19937();
	//}

	rng_mt19937->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(RNG_MT19937::fill) {
	return Nan::ThrowError("not implemented");
}

NAN_METHOD(RNG_MT19937::genInt) {
	return Nan::ThrowError("not implemented");
}

NAN_METHOD(RNG_MT19937::genDouble) {
	return Nan::ThrowError("not implemented");
}

NAN_METHOD(RNG_MT19937::genNext) {
	return Nan::ThrowError("not implemented");
}