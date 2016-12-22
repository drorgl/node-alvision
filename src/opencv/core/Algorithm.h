#ifndef _ALVISION_ALGORITHM_H_
#define _ALVISION_ALGORITHM_H_

#include "../../alvision.h"


class Algorithm: public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::Algorithm> _algorithm;

	static Nan::Persistent<FunctionTemplate> constructor;
	static NAN_METHOD(New);

	static NAN_METHOD(load);

};

#endif