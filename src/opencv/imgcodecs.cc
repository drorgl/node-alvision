#include "imgcodecs.h"


void
imgcodecs::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
  Nan::SetMethod(target, "imread", imread);
  Nan::SetMethod(target, "imreadmulti", imreadmulti);
}

NAN_METHOD(imgcodecs::imread){
	return Nan::ThrowError("not implemented");
}

NAN_METHOD(imgcodecs::imreadmulti) {
	return Nan::ThrowError("not implemented");
}
