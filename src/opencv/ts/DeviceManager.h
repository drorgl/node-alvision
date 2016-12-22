#ifndef _ALVISION_DEVICEMANAGER_H_
#define _ALVISION_DEVICEMANAGER_H_
//#include "OpenCV.h"
#include "../../alvision.h"

#ifdef HAVE_CUDA

class DeviceManager : public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
	static Nan::Persistent<FunctionTemplate> constructor;

	static NAN_METHOD(New);
	static NAN_METHOD(instance);
};

#endif

#endif