#ifndef _ALVISION_MATRIX_ACCESSOR_H_
#define _ALVISION_MATRIX_ACCESSOR_H_

#include "../../alvision.h"
#include "array_accessor_base.h"

#include <memory>
#include <string>
#include <value_converter.h>
#include "../Vec.h"
#include "../Point.h"
#include "../Complex.h"

using namespace std::literals::string_literals;

class Matrix_array_accessor : public array_accessor_base {
private:
	static std::map<std::string, std::function<v8::Local<v8::Value>(int, cv::Mat&)>>  _get_accessors;
	static std::map<std::string, std::function<void(cv::Mat&, int, v8::Local<v8::Value>)>> _set_accessors;
	static std::map<std::string, std::function<size_t()>>  _sizeof_accessors;

public:
	std::shared_ptr<cv::Mat> _mat;
	std::string _type;
	int _i0;
	int _i1;
	int _i2;

	int _max_size;
	int _pre_index;
	int _sizeof;

	Matrix_array_accessor(std::shared_ptr<cv::Mat> mat, std::string type, int i0 = 0, int i1 = 0, int i2 = 0);

	virtual int length();
	virtual v8::Local<v8::Value> get(int index);
	virtual void set(int index, v8::Local<v8::Value> value);
};

#endif