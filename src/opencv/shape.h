#ifndef _ALVISION_SHAPE_H_
#define _ALVISION_SHAPE_H_

#include "../alvision.h"

class shape: public Nan::ObjectWrap {
 public:
    static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
	static NAN_METHOD(createShapeContextDistanceExtractor);
	static NAN_METHOD(createHausdorffDistanceExtractor);
};


#endif