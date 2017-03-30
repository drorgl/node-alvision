#ifndef _ALVISION_BFMATCHER_H_
#define _ALVISION_BFMATCHER_H_

#include "../../alvision.h"
#include "DescriptorMatcher.h"

class BFMatcher : public DescriptorMatcher {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	static POLY_METHOD(isMaskSupported);
	static POLY_METHOD(clone);

};

#endif
