#ifndef _ALVISION_DMATCH_H_
#define _ALVISION_DMATCH_H_

#include "../../alvision.h"


class DMatch: public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::DMatch> _dmatch;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


	static NAN_METHOD(New);



};

#endif