#ifndef _ALVISION_TONEMAP_DRAGO_H_
#define _ALVISION_TONEMAP_DRAGO_H_

#include "../../alvision.h"
#include "Tonemap.h"

class TonemapDrago : public Tonemap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	static POLY_METHOD(getSaturation);
	static POLY_METHOD(setSaturation);
	static POLY_METHOD(getBias);
	static POLY_METHOD(setBias);
	static POLY_METHOD(createTonemapDrago);


};


#endif