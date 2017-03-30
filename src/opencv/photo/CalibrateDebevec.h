#ifndef _ALVISION_CALIBRATE_DEBEVEC_H_
#define _ALVISION_CALIBRATE_DEBEVEC_H_

#include "../../alvision.h"
#include "CalibrateCRF.h"

class CalibrateDebevec : public CalibrateCRF {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	static POLY_METHOD(getLambda);
	static POLY_METHOD(setLambda);
	static POLY_METHOD(getSamples);
	static POLY_METHOD(setSamples);
	static POLY_METHOD(getRandom);
	static POLY_METHOD(setRandom);
	static POLY_METHOD(createCalibrateDebevec);


};

#endif