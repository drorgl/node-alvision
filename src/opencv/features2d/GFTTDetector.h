#ifndef _ALVISION_FGTTD_DETECTOR_H_
#define _ALVISION_FGTTD_DETECTOR_H_

#include "../../alvision.h"
#include "Feature2D.h"

class GFTTDetector : public Feature2D {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(create);
	static POLY_METHOD(setMaxFeatures);
	static POLY_METHOD(getMaxFeatures);
	static POLY_METHOD(setQualityLevel);
	static POLY_METHOD(getQualityLevel);
	static POLY_METHOD(setMinDistance);
	static POLY_METHOD(getMinDistance);
	static POLY_METHOD(setBlockSize);
	static POLY_METHOD(getBlockSize);
	static POLY_METHOD(setHarrisDetector);
	static POLY_METHOD(getHarrisDetector);
	static POLY_METHOD(setK);
	static POLY_METHOD(getK);


};

#endif
