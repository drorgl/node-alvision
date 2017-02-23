#ifndef _ALVISION_TONEMAP_DURAND_H_
#define _ALVISION_TONEMAP_DURAND_H_

#include "../../alvision.h"
#include "Tonemap.h"

class TonemapDurand : public Tonemap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	static POLY_METHOD(getSaturation);
	static POLY_METHOD(setSaturation);
	static POLY_METHOD(getContrast);
	static POLY_METHOD(setContrast);
	static POLY_METHOD(getSigmaSpace);
	static POLY_METHOD(setSigmaSpace);
	static POLY_METHOD(getSigmaColor);
	static POLY_METHOD(setSigmaColor);
	static POLY_METHOD(createTonemapDurand);


};

#endif