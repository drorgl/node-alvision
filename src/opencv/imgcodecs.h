#ifndef _ALVISION_IMGCODECS_H_
#define _ALVISION_IMGCODECS_H_

#include "../alvision.h"

class imgcodecs: public Nan::ObjectWrap {
 public:
    static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static NAN_METHOD(imread);
	static NAN_METHOD(imreadmulti);
};


#endif