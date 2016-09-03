#ifndef _ALVISION_ML_H_
#define _ALVISION_ML_H_
//#include "OpenCV.h"
#include "../alvision.h"

class ml : public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target);
	static Nan::Persistent<Object> mlObject;
};

#endif