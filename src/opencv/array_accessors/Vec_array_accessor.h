#ifndef _ALVISION_VEC_ACCESSOR_H_
#define _ALVISION_VEC_ACCESSOR_H_

#include "../../alvision.h"
#include "array_accessor_base.h"

#include <memory>
#include <string>


using namespace std::literals::string_literals;

template <typename T>
class Vec_array_accessor : public array_accessor_base {
private:
	static std::map<std::string, std::function<v8::Local<v8::Value>(int)>> _get_accessors;
	static std::map<std::string, std::function<void(int, v8::Local<v8::Value>)>> _set_accessors;
	static std::map<std::string, std::function<int(void)>> _sizeof_accessors;

public:
	std::shared_ptr<T> _vec;
	std::string _type;
	int _i0;
	int _i1;
	int _i2;

	int _max_size;
	int _pre_index;
	int _sizeof;

	Vec_array_accessor(std::shared_ptr<T> vec, std::string type, int i0 = 0, int i1 = 0, int i2 = 0) : _vec(vec), _type(type), _i0(i0), _i1(i1), _i2(i2) {
		if (_get_accessors.count(type) == 0) {
			throw new std::exception("type is not implemented");
		}

		//calculate maximum byte size for mat
		if (_vec->dims == 0) {
			_max_size = 0;
		}
		else {
			_max_size = 1;
			for (auto i = 0; i < _vec->dims; i++) {
				_max_size *= _vec->step.p[i];
			}
		}

		_pre_index = _i0 *(_vec->dims > 0) ? _vec->step.p[0] : 0
			+ _i1 *(_vec->dims > 1) ? _vec->step.p[1] : 0
			+ _i2 *(_vec->dims > 2) ? _vec->step.p[2] : 0;

		_sizeof = Vec_array_accessor::_sizeof_accessors[_type]();

	}

	virtual int length() {
		return (_max_size - _pre_index);
	}
	virtual v8::Local<v8::Value> get(int index) {
		if ((_pre_index + index) >= _max_size) {
			throw std::exception("index out of bounds");
		}

		if (((index + _pre_index) + _sizeof) > _max_size) {
			throw std::exception("index out of bounds for type specified");
		}

		return _get_accessors[_type](_pre_index + index);
	}
	virtual void set(int index, v8::Local<v8::Value> value) {
		_set_accessors[_type]((_pre_index + index), value);
	}
};

#endif