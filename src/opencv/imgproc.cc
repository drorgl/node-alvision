#include "imgproc.h"


void
imgproc::Init(Handle<Object> target) {
  Nan::SetMethod(target, "getTextSize", getTextSize);
}

NAN_METHOD(imgproc::getTextSize){
	return Nan::ThrowError("not implemented");
}

NAN_METHOD(imgproc::polylines) {
	return Nan::ThrowError("not implemented");
}