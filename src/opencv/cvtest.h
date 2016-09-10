#ifndef _ALVISION_CVTEST_H_
#define _ALVISION_CVTEST_H_
//#include "OpenCV.h"
#include "../alvision.h"

#include "ts/DeviceManager.h"
//#include "cuda/DeviceInfo.h"

class cvtest : public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target);
	static Nan::Persistent<Object> cvtestObject;

	static NAN_METHOD(randomSize);
	static NAN_METHOD(readImage);
};

#endif