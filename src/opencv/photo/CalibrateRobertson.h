#ifndef _ALVISION_CALIBRATE_ROBERTSON_H_
#define _ALVISION_CALIBRATE_ROBERTSON_H_

#include "../../alvision.h"
#include "CalibrateCRF.h"

class CalibrateRobertson : public CalibrateCRF {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	static POLY_METHOD(getMaxIter);
	static POLY_METHOD(setMaxIter);
	static POLY_METHOD(getThreshold);
	static POLY_METHOD(setThreshold);
	static POLY_METHOD(getRadiance);
	static POLY_METHOD(createCalibrateRobertson);


};

#endif