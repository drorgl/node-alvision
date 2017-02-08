#ifndef _ALVISION_AKAZE_H_
#define _ALVISION_AKAZE_H_

#include "../../alvision.h"
#include "Feature2D.h"

class AKAZE : public Feature2D {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(create);
	static POLY_METHOD(setDescriptorType);
	static POLY_METHOD(getDescriptorType);
	static POLY_METHOD(setDescriptorSize);
	static POLY_METHOD(getDescriptorSize);
	static POLY_METHOD(setDescriptorChannels);
	static POLY_METHOD(getDescriptorChannels);
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
