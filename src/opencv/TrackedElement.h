#ifndef _ALVISION_TRACKED_ELEMENT_H_
#define _ALVISION_TRACKED_ELEMENT_H_

#include "../alvision.h"

class TrackedElement : Nan::ObjectWrap {
public:
	static POLY_METHOD(get);
	static POLY_METHOD(set);
};

#endif