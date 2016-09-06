#ifndef _ALVISION_CORE_H_
#define _ALVISION_CORE_H_
//#include "OpenCV.h"
#include "../alvision.h"

#include "core/RNG.h"

class core : public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target);
};

#endif