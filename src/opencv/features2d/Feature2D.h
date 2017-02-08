#ifndef _ALVISION_FEATURE2D_H_
#define _ALVISION_FEATURE2D_H_

#include "../../alvision.h"
#include "../core/Algorithm.h"

class Feature2D : public Algorithm {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static std::string name;
	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static std::shared_ptr<Feature2D> New();

	static POLY_METHOD(New);

	static POLY_METHOD(detect_a);
	static POLY_METHOD(detect_b);
	static POLY_METHOD(compute_a);
	static POLY_METHOD(compute_b);
	static POLY_METHOD(detectAndCompute);
	static POLY_METHOD(descriptorSize);
	static POLY_METHOD(descriptorType);
	static POLY_METHOD(defaultNorm);
	static POLY_METHOD(empty);

};

typedef Feature2D FeatureDetector;
typedef Feature2D DescriptorExtractor;

#endif
