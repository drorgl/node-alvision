#include "Cuda.h"

Nan::Persistent<Object> Cuda::cudaObject;


void
Cuda::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Local<Object> cuda = Nan::New<Object>();

	cudaObject.Reset(cuda);

	target->Set(Nan::New("cuda").ToLocalChecked(), cuda);


#ifdef HAVE_CUDA
	DeviceInfo::Init(cuda);
	GpuMat::Init(cuda);
#endif
};
