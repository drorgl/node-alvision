#ifndef _ALVISION_BRISK_H_
#define _ALVISION_BRISK_H_

#include "../../alvision.h"
#include "Feature2D.h"

class BRISK : public Feature2D {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(create_a);
	static POLY_METHOD(create_b);
};

#endif
