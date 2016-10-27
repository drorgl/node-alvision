#include "flann.h"

Nan::Persistent<Object> flann::flannObject;


void
flann::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Local<Object> flann = Nan::New<Object>();

	flannObject.Reset(flann);

	target->Set(Nan::New("flann").ToLocalChecked(), flann);

	//DeviceInfo::Init(flann);
};
