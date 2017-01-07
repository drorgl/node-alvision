#ifndef _ALVISION_MATX_ACCESSOR_H_
#define _ALVISION_MATX_ACCESSOR_H_

#include "../../alvision.h"

template <typename T>
class Matx_array_accessor{
public:
	std::shared_ptr<T> _matx;

	virtual int length() {
		return T::rows * T::cols;
	}
	virtual v8::Local<v8::Value> get(int index) {
		return Nan::New(_matx->val[index]);
	}
	virtual void set(int index, v8::Local<v8::Value> value) {
		_matx->val[index] = value->NumberValue();
	}
};

#endif