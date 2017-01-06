#ifndef _ALVISION_STEREOSGBM_H_
#define _ALVISION_STEREOSGBM_H_

#include "../../alvision.h"
#include "StereoMatcher.h"

class StereoSGBM : public StereoMatcher {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(create);
	static POLY_METHOD(getPreFilterCap);
	static POLY_METHOD(setPreFilterCap);
	static POLY_METHOD(getUniquenessRatio);
	static POLY_METHOD(setUniquenessRatio);
	static POLY_METHOD(getP1);
	static POLY_METHOD(setP1);
	static POLY_METHOD(getP2);
	static POLY_METHOD(setP2);
	static POLY_METHOD(getMode);
	static POLY_METHOD(setMode);
};

#endif
