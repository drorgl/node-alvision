#ifndef _ALVISION_STEREOMATCHER_H_
#define _ALVISION_STEREOMATCHER_H_

#include "../../alvision.h"
#include "../core/Algorithm.h"

class StereoMatcher : public Algorithm {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(compute);
	static POLY_METHOD(getMinDisparity);
	static POLY_METHOD(setMinDisparity);
	static POLY_METHOD(getNumDisparities);
	static POLY_METHOD(setNumDisparities);
	static POLY_METHOD(getBlockSize);
	static POLY_METHOD(setBlockSize);
	static POLY_METHOD(getSpeckleWindowSize);
	static POLY_METHOD(setSpeckleWindowSize);
	static POLY_METHOD(getSpeckleRange);
	static POLY_METHOD(setSpeckleRange);
	static POLY_METHOD(getDisp12MaxDiff);
	static POLY_METHOD(setDisp12MaxDiff);

};


#endif
