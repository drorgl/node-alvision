#ifndef _ALVISION_FLANN_BASED_MATCHER_H_
#define _ALVISION_FLANN_BASED_MATCHER_H_

#include "../../alvision.h"

#include "DescriptorMatcher.h"

class FlannBasedMatcher : public DescriptorMatcher {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	//TODO: implement new addConstructorOverload

	static POLY_METHOD(New);
	static POLY_METHOD(add);
	static POLY_METHOD(clear);
	static POLY_METHOD(read);
	static POLY_METHOD(write);
	static POLY_METHOD(train);
	static POLY_METHOD(isMaskSupported);
	static POLY_METHOD(clone);



};

#endif
