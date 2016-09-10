#ifndef _ALVISION_IMGPROC_H_
#define _ALVISION_IMGPROC_H_

#include "../alvision.h"

class imgproc: public Nan::ObjectWrap {
 public:
    static void Init(Handle<Object> target);

	static NAN_METHOD(getTextSize);
	static NAN_METHOD(polylines);
};


#endif