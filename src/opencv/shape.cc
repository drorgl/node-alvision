#include "shape.h"


void
shape::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
  Nan::SetMethod(target, "createShapeContextDistanceExtractor", createShapeContextDistanceExtractor);
  Nan::SetMethod(target, "createHausdorffDistanceExtractor", createHausdorffDistanceExtractor);
}

NAN_METHOD(shape::createShapeContextDistanceExtractor){
	return Nan::ThrowError("not implemented");
}

NAN_METHOD(shape::createHausdorffDistanceExtractor) {
	return Nan::ThrowError("not implemented");
}