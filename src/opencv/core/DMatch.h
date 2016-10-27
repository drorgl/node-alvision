#ifndef _ALVISION_DMATCH_H_
#define _ALVISION_DMATCH_H_

#include "../../alvision.h"


class DMatch: public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::DMatch> _dmatch;

	static Nan::Persistent<FunctionTemplate> constructor;
	static NAN_METHOD(New);



};

#endif