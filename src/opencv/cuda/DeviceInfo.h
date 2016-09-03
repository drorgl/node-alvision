#ifndef _ALVISION_DEVICEINFO_H_
#define _ALVISION_DEVICEINFO_H_
//#include "OpenCV.h"
#include "../../alvision.h"


class DeviceInfo : public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target);
	static Nan::Persistent<FunctionTemplate> constructor;

	static NAN_METHOD(New);
};

#endif