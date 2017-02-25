#ifndef _ALVISION_ALGORITHM_H_
#define _ALVISION_ALGORITHM_H_

#include "../../alvision.h"


class Algorithm : public overres::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	//std::shared_ptr<cv::Algorithm> _algorithm;
	cv::Ptr<cv::Algorithm> _algorithm;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	static POLY_METHOD(read);
	static POLY_METHOD(load);
	static POLY_METHOD(loadFromString);
	static POLY_METHOD(clear);
	static POLY_METHOD(write);
	static POLY_METHOD(read_member);
	static POLY_METHOD(empty);
	static POLY_METHOD(save);
	static POLY_METHOD(getDefaultName);

};

#endif