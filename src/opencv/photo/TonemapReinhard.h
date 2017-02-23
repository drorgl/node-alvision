#ifndef _ALVISION_TONEMAP_REINHARD_H_
#define _ALVISION_TONEMAP_REINHARD_H_

#include "../../alvision.h"
#include "Tonemap.h"

class TonemapReinhard : public Tonemap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	static POLY_METHOD(getIntensity);
	static POLY_METHOD(setIntensity);
	static POLY_METHOD(getLightAdaptation);
	static POLY_METHOD(setLightAdaptation);
	static POLY_METHOD(getColorAdaptation);
	static POLY_METHOD(setColorAdaptation);
	static POLY_METHOD(createTonemapReinhard);



};

#endif