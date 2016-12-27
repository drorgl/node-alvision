#ifndef _ALVISION_GPUMAT_H_
#define _ALVISION_GPUMAT_H_
//#include "OpenCV.h"
#include "../../alvision.h"


#ifdef HAVE_CUDA


class GpuMat : public or ::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
	static Nan::Persistent<FunctionTemplate> constructor;

	std::shared_ptr<cv::cuda::GpuMat> _gpumat;

	static NAN_METHOD(New);
};

#endif

#endif