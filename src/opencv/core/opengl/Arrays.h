#ifndef _ALVISION_ARRAYS_H_
#define _ALVISION_ARRAYS_H_

#include "../../../alvision.h"

class Arrays : public overres::ObjectWrap {
public:
	static std::string name;

	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

};

#endif


