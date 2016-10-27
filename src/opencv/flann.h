#ifndef _ALVISION_FLANN_H_
#define _ALVISION_FLANN_H_
//#include "OpenCV.h"
#include "../alvision.h"

//#include "cuda/DeviceInfo.h"

class flann : public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
	static Nan::Persistent<Object> flannObject;
};

#endif