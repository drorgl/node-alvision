#ifndef _ALVISION_BUFFER_H_
#define _ALVISION_BUFFER_H_

#include "../../../alvision.h"
#include "../../IOArray.h"

class Buffer : public IOArray {
public:
	static std::string name;

	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


};

#endif


