#include "core.h"


void
core::Init(Handle<Object> target) {
	Nan::SetMethod(target, "randu", randu);
	Nan::SetMethod(target, "theRNG", theRNG);
	RNG::Init(target);
};

NAN_METHOD(core::randu) {
	return Nan::ThrowError("not implemented");
}

NAN_METHOD(core::theRNG) {
	return Nan::ThrowError("not implemented");
}
