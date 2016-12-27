#ifndef _ALVISION_RNG_H_
#define _ALVISION_RNG_H_

#include "../../alvision.h"


class RNG: public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::RNG> _rng;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


	static NAN_METHOD(New);
	static NAN_METHOD(fill);
	static NAN_METHOD(genInt);
	static NAN_METHOD(genDouble);
	static NAN_METHOD(genNext);



};

#endif