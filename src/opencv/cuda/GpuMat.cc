#include "GpuMat.h"

#ifdef HAVE_CUDA

Nan::Persistent<FunctionTemplate> constructor;

void GpuMat::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {

}

NAN_METHOD(GpuMat::New) {

}

#endif