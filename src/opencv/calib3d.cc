#include "calib3d.h"


void
calib3d::Init(Handle<Object> target) {
  Nan::SetMethod(target, "Rodrigues", Rodrigues);
  Nan::SetMethod(target, "calibrateCamera", calibrateCamera);
}

NAN_METHOD(calib3d::Rodrigues){
	return Nan::ThrowError("not implemented");
}

NAN_METHOD(calib3d::calibrateCamera) {
	return Nan::ThrowError("not implemented");
}

