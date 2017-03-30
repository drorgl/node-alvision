#ifndef _ALVISION_VEC_ACCESSOR_H_
#define _ALVISION_VEC_ACCESSOR_H_

#include "../../alvision.h"
#include "array_accessor_base.h"

#include <memory>
#include <string>


using namespace std::literals::string_literals;

template <typename T>
class Vec_array_accessor : public array_accessor_base {
public:
	std::shared_ptr<T> _vec;
	int _i0;
	int _i1;
	int _i2;

	int _max_size;
	int _pre_index;
	int _sizeof;

	Vec_array_accessor(std::shared_ptr<T> vec, int i0 = 0, int i1 = 0, int i2 = 0) : _vec(vec), _i0(i0), _i1(i1), _i2(i2) {
		//if (_get_accessors.count(type) == 0) {
		//	throw std::runtime_error("type is not implemented");
		//}

		_max_size = _vec->channels;
		//_pre_index = 0;

		_pre_index = i0;
			
		//_pre_index = _i0 *(_vec->depth > 0) ? _vec->step.p[0] : 0
		//	+ _i1 *(_vec->depth > 1) ?		  _vec->step.p[1] : 0
		//	+ _i2 *(_vec->depth > 2) ?		  _vec->step.p[2] : 0;

		_sizeof = sizeof(typename T::value_type);

	}

	virtual int length() {
		return (_max_size - _pre_index);
	}
	virtual v8::Local<v8::Value> get(int index) {
		if ((_pre_index + index) >= _max_size) {
			throw std::runtime_error("index out of bounds");
		}

		return Nan::New((*_vec)[(_pre_index + index)]);
	}
	virtual void set(int index, v8::Local<v8::Value> value) {
		(*_vec)[((_pre_index + index))] = value->NumberValue();
	}
};

#endif