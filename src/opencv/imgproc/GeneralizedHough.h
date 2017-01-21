#ifndef _ALVISION_GENERALIZEDHOUGH_H_
#define _ALVISION_GENERALIZEDHOUGH_H_

#include "../../alvision.h"
#include "../core/Algorithm.h"

class GeneralizedHough : public Algorithm {
public:
	static std::string name;

	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(setTemplate);
	static POLY_METHOD(setTemplate_edge);
	static POLY_METHOD(detect);
	static POLY_METHOD(detect_edge);
	static POLY_METHOD(setCannyLowThresh);
	static POLY_METHOD(getCannyLowThresh);
	static POLY_METHOD(setCannyHighThresh);
	static POLY_METHOD(getCannyHighThresh);
	static POLY_METHOD(setMinDist);
	static POLY_METHOD(getMinDist);
	static POLY_METHOD(setDp);
	static POLY_METHOD(getDp);
	static POLY_METHOD(setMaxBufferSize);
	static POLY_METHOD(getMaxBufferSize);


};

#endif


 