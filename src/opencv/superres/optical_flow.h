#ifndef _ALVISION_OPTICAL_FLOW_H_
#define _ALVISION_OPTICAL_FLOW_H_
//#include "OpenCV.h"
#include "../../alvision.h"

class optical_flow : public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target);
	static Nan::Persistent<Object> opticalFlowObject;
};

#endif