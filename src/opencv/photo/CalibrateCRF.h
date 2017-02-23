#ifndef _ALVISION_CALIBRATE_CRF_H_
#define _ALVISION_CALIBRATE_CRF_H_

#include "../../alvision.h"
#include "../core/Algorithm.h"

class CalibrateCRF : public Algorithm {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	static POLY_METHOD(process);
};

#endif