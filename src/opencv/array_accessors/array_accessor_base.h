#ifndef _ALVISION_ARRAY_ACCESSOR_BASE_H_
#define _ALVISION_ARRAY_ACCESSOR_BASE_H_

#include "../../alvision.h"


class array_accessor_base {
public:
	virtual int length() = 0;
	virtual v8::Local<v8::Value> get(int index) = 0;
	virtual void set(int index, v8::Local<v8::Value> value) = 0;
};

#endif