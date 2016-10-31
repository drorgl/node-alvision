#ifndef _ALVISION_IOARRAY_H_
#define _ALVISION_IOARRAY_H_

#include "../alvision.h"

class IOArray : Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	static v8::Local<v8::Object> noArray();

	static POLY_METHOD(New);

};

#endif