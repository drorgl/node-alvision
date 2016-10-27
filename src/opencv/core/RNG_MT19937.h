#ifndef _ALVISION_RNG_MT19937_H_
#define _ALVISION_RNG_MT19937_H_

#include "../../alvision.h"


class RNG_MT19937: public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::RNG_MT19937> _rng;

	static Nan::Persistent<FunctionTemplate> constructor;
	static NAN_METHOD(New);
	static NAN_METHOD(fill);
	static NAN_METHOD(genInt);
	static NAN_METHOD(genDouble);
	static NAN_METHOD(genNext);



};

#endif