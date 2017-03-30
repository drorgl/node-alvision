#ifndef _ALVISION_KAZE_H_
#define _ALVISION_KAZE_H_

#include "../../alvision.h"

#include "Feature2D.h"

class KAZE : public Feature2D {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(create);
	static POLY_METHOD(setExtended);
	static POLY_METHOD(getExtended);
	static POLY_METHOD(setUpright);
	static POLY_METHOD(getUpright);
	static POLY_METHOD(setThreshold);
	static POLY_METHOD(getThreshold);
	static POLY_METHOD(setNOctaves);
	static POLY_METHOD(getNOctaves);
	static POLY_METHOD(setNOctaveLayers);
	static POLY_METHOD(getNOctaveLayers);
	static POLY_METHOD(setDiffusivity);
	static POLY_METHOD(getDiffusivity);


};

#endif
