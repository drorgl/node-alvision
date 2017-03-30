#ifndef _ALVISION_AGAST_FEATURE_DETECTOR_H_
#define _ALVISION_AGAST_FEATURE_DETECTOR_H_

#include "../../alvision.h"
#include "Feature2D.h"

class AgastFeatureDetector : public Feature2D {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(create);
	static POLY_METHOD(setThreshold);
	static POLY_METHOD(getThreshold);
	static POLY_METHOD(setNonmaxSuppression);
	static POLY_METHOD(getNonmaxSuppression);
	static POLY_METHOD(setType);
	static POLY_METHOD(getType);
};

#endif
