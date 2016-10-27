#include "cvtest.h"

Nan::Persistent<Object> cvtest::cvtestObject;


void
cvtest::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Local<Object> test = Nan::New<Object>();

	cvtestObject.Reset(test);

	target->Set(Nan::New("cvtest").ToLocalChecked(), test);

	Nan::SetMethod(test, "randomSize", randomSize);
	Nan::SetMethod(test, "readImage", readImage);
		
#ifdef HAVE_CUDA
	DeviceManager::Init(target);
#endif
};

NAN_METHOD(cvtest::randomSize) {
	return Nan::ThrowError("not implemented");
}

NAN_METHOD(cvtest::readImage) {
	return Nan::ThrowError("not implemented");
}