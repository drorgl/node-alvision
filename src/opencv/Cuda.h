#ifndef _ALVISION_CUDA_H_
#define _ALVISION_CUDA_H_
//#include "OpenCV.h"
#include "../alvision.h"

#include "cuda/DeviceInfo.h"

class Cuda : public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target);
	static Nan::Persistent<Object> cudaObject;
};

#endif