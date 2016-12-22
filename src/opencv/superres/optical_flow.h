#ifndef _ALVISION_OPTICAL_FLOW_H_
#define _ALVISION_OPTICAL_FLOW_H_
//#include "OpenCV.h"
#include "../../alvision.h"

class optical_flow : public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
	static Nan::Persistent<Object> opticalFlowObject;
};

#endif