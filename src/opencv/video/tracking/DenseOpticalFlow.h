#ifndef _ALVISION_DENSE_OPTICAL_FLOW_H_
#define _ALVISION_DENSE_OPTICAL_FLOW_H_

#include "../../../alvision.h"
#include "../../core/Algorithm.h"

class DenseOpticalFlow : public Algorithm {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


	static POLY_METHOD(New);

	static POLY_METHOD(calc);


};

#endif