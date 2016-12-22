#ifndef _ALVISION_DEVICEINFO_H_
#define _ALVISION_DEVICEINFO_H_
//#include "OpenCV.h"
#include "../../alvision.h"


#ifdef HAVE_CUDA


class DeviceInfo : public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
	static Nan::Persistent<FunctionTemplate> constructor;

	std::shared_ptr<cv::cuda::DeviceInfo> _deviceInfo;

	static NAN_METHOD(New);
};

#endif

#endif