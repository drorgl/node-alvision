#include "Cuda.h"

Nan::Persistent<Object> Cuda::cudaObject;


void
Cuda::Init(Handle<Object> target) {
	Local<Object> cuda = Nan::New<Object>();

	cudaObject.Reset(cuda);

	target->Set(Nan::New("cuda").ToLocalChecked(), cuda);

	DeviceInfo::Init(cuda);
};
