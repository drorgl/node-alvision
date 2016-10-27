#include "imgproc.h"


void
imgproc::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
  Nan::SetMethod(target, "getTextSize", getTextSize);
}

NAN_METHOD(imgproc::getTextSize){
	return Nan::ThrowError("not implemented");
}

NAN_METHOD(imgproc::polylines) {
	return Nan::ThrowError("not implemented");
}