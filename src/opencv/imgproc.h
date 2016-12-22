#ifndef _ALVISION_IMGPROC_H_
#define _ALVISION_IMGPROC_H_

#include "../alvision.h"

class imgproc: public or::ObjectWrap {
 public:
    static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static NAN_METHOD(getTextSize);
	static NAN_METHOD(polylines);
};


#endif