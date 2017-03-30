#ifndef _ALVISION_DESCRIPTOR_MATCHER_H_
#define _ALVISION_DESCRIPTOR_MATCHER_H_

#include "../../alvision.h"
#include "../core/Algorithm.h"

class DescriptorMatcher : public Algorithm {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static std::string name;
	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


	static POLY_METHOD(add);
	static POLY_METHOD(getTrainDescriptors);
	static POLY_METHOD(clear);
	static POLY_METHOD(empty);
	static POLY_METHOD(isMaskSupported);
	static POLY_METHOD(train);
	static POLY_METHOD(match_train);
	static POLY_METHOD(knnMatch_train);
	static POLY_METHOD(radiusMatch_train);
	static POLY_METHOD(match);
	static POLY_METHOD(knnMatch);
	static POLY_METHOD(radiusMatch);
	static POLY_METHOD(read);
	static POLY_METHOD(write);
	static POLY_METHOD(clone);
	static POLY_METHOD(create);

};

#endif
