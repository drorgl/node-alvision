#ifndef _ALVISION_STEREOBM_H_
#define _ALVISION_STEREOBM_H_

#include "../../alvision.h"
#include "StereoMatcher.h"

class StereoBM : public StereoMatcher {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	static POLY_METHOD(create);
	static POLY_METHOD(getPreFilterType);
	static POLY_METHOD(setPreFilterType);
	static POLY_METHOD(getPreFilterSize);
	static POLY_METHOD(setPreFilterSize);
	static POLY_METHOD(getPreFilterCap);
	static POLY_METHOD(setPreFilterCap);
	static POLY_METHOD(getTextureThreshold);
	static POLY_METHOD(setTextureThreshold);
	static POLY_METHOD(getUniquenessRatio);
	static POLY_METHOD(setUniquenessRatio);
	static POLY_METHOD(getSmallerBlockSize);
	static POLY_METHOD(setSmallerBlockSize);
	static POLY_METHOD(getROI1);
	static POLY_METHOD(setROI1);
	static POLY_METHOD(getROI2);
	static POLY_METHOD(setROI2);
};

#endif
