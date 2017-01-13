#ifndef _ALVISION_RNG_MT19937_H_
#define _ALVISION_RNG_MT19937_H_

#include "../../alvision.h"


class RNG_MT19937 : public or ::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::RNG_MT19937> _rng;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	static POLY_METHOD(New_seed);
	static POLY_METHOD(next);
	static POLY_METHOD(next_int);
	static POLY_METHOD(next_unsigned);
	static POLY_METHOD(next_float);
	static POLY_METHOD(next_double);
	static POLY_METHOD(run_n);
	static POLY_METHOD(run);
	static POLY_METHOD(uniform);






};

#endif