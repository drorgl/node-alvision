#include "cvtest.h"

Nan::Persistent<Object> cvtest::cvtestObject;


void
cvtest::Init(Handle<Object> target) {
	Local<Object> test = Nan::New<Object>();

	cvtestObject.Reset(test);

	target->Set(Nan::New("cvtest").ToLocalChecked(), test);

	

	DeviceManager::Init(target);
};
