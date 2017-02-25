#ifndef _ALVISION_MATX_ACCESSOR_H_
#define _ALVISION_MATX_ACCESSOR_H_

#include "../../alvision.h"
#include "array_accessor_base.h"

#include <memory>
#include <string>


using namespace std::literals::string_literals;

template <typename T, typename TVT>
class Matx_array_accessor : public array_accessor_base {

public:
	std::shared_ptr<T> _matx;
	std::unique_ptr< overres::value_converter<TVT>> _converter;
	std::string _type;

	int _max_size;
	int _pre_index;
	int _sizeof;

	Matx_array_accessor(std::shared_ptr<T> matx, std::string type) : _matx(matx), _type(type) {
		//calculate maximum byte size for mat
		_max_size = T::rows * T::cols;

		_converter = std::make_unique < overres::value_converter<TVT>>();
	}

	virtual int length() {
		return (_max_size);
	}
	virtual v8::Local<v8::Value> get(int index) {
		if (index >= _max_size || index < 0) {
			throw std::exception("index out of bounds");
		}

		return _converter->convert(_matx->val[index]);
	}
	virtual void set(int index, v8::Local<v8::Value> value) {
		if (index >= _max_size || index < 0) {
			throw std::exception("index out of bounds");
		}

		_matx->val[index] = _converter->convert(value);
	}
};

#endif