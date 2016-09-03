#ifndef _ALVISION_SUPERRES_H_
#define _ALVISION_SUPERRES_H_
//#include "OpenCV.h"
#include "../alvision.h"

class superres : public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target);
	static Nan::Persistent<Object> superresObject;
};

#endif