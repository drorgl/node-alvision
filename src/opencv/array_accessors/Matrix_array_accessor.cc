#include "Matrix_array_accessor.h"

#include <value_converter.h>
#include "../Vec.h"
#include "../Point.h"
#include "../Complex.h"


std::map<std::string, std::function<v8::Local<v8::Value>(int, cv::Mat)> > Matrix_array_accessor::_get_accessors = {
		{ "Vec2d",
				[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < or ::value_converter<std::shared_ptr<Vec<cv::Vec2d> > >>();
			return converter->convert(Vec<cv::Vec2d>::from(mat.at<cv::Vec2d>(index)));
		} },
		{ "Vec3d",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < or ::value_converter<std::shared_ptr<Vec<cv::Vec3d> > >>();
			return converter->convert(Vec<cv::Vec3d>::from(mat.at<cv::Vec3d>(index)));
		} },
		{ "Vec4b",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < or ::value_converter<std::shared_ptr<Vec<cv::Vec4b> > >>();
			return converter->convert(Vec<cv::Vec4b>::from(mat.at<cv::Vec4b>(index)));
		} },
		{ "Vec4s",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < or ::value_converter<std::shared_ptr<Vec<cv::Vec4s> > >>();
			return converter->convert(Vec<cv::Vec4s>::from(mat.at<cv::Vec4s>(index)));
		} },
		{ "Point3f",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < or ::value_converter<std::shared_ptr<Point_<cv::Point3f> > >>();
			return converter->convert(
				Point_<cv::Point3f>::from(mat.at<cv::Point3f>(index)));
		} },
		{ "Point3i",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < or ::value_converter<std::shared_ptr<Point_<cv::Point3i> > >>();
			return converter->convert(
				Point_<cv::Point3i>::from(mat.at<cv::Point3i>(index)));
		} },
		{ "Point2f",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < or ::value_converter<std::shared_ptr<Point_<cv::Point2f> > >>();
			return converter->convert(
				Point_<cv::Point2f>::from(mat.at<cv::Point2f>(index)));
		} },
		{ "Point2d",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < or ::value_converter<std::shared_ptr<Point_<cv::Point2d> > >>();
			return converter->convert(
				Point_<cv::Point2d>::from(mat.at<cv::Point2d>(index)));
		} },
		{ "double",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < or ::value_converter<double>>();
			return converter->convert(mat.at<double>(index));
		} },
		{ "int",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < or ::value_converter<int>>();
			return converter->convert(mat.at<int>(index));
		} },
		{ "uchar",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < or ::value_converter<uchar>>();
			return converter->convert(mat.at<uchar>(index));
		} },
		{ "char",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < or ::value_converter<char>>();
			return converter->convert(mat.at<char>(index));
		} },
		{ "double",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < or ::value_converter<double>>();
			return converter->convert(mat.at<double>(index));
		} },
		{ "float",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < or ::value_converter<float>>();
			return converter->convert(mat.at<float>(index));
		} },
		{ "schar",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < or ::value_converter<schar>>();
			return converter->convert(mat.at<schar>(index));
		} },
		{ "ushort",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < or ::value_converter<ushort>>();
			return converter->convert(mat.at<ushort>(index));
		} },
		{ "short",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < or ::value_converter<short>>();
			return converter->convert(mat.at<short>(index));
		} },
		{ "int",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < or ::value_converter<int>>();
			return converter->convert(mat.at<int>(index));
		} },
		{ "Complexd",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < or ::value_converter<std::shared_ptr<Complex_<cv::Complexd> > >>();
			return converter->convert(
				Complex_<cv::Complexd>::from(mat.at<cv::Complexd>(index)));
		} },
		{ "Complexf",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < or ::value_converter<std::shared_ptr<Complex_<cv::Complexf> > >>();
			return converter->convert(
				Complex_<cv::Complexf>::from(mat.at<cv::Complexf>(index)));
		}}
};

std::map<std::string, std::function<void(cv::Mat&, int, v8::Local<v8::Value>)> > Matrix_array_accessor::_set_accessors = {
	{
	"Vec2d", 
	[](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< or ::value_converter<std::shared_ptr<Vec<cv::Vec2d>>>>();
		mat.at<cv::Vec2d>(index) = *converter->convert(value)->_vec;
	} 
	}, 
	{
	"Vec3d", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< or ::value_converter<std::shared_ptr<Vec<cv::Vec3d>>>>();
		mat.at<cv::Vec3d>(index) = *converter->convert(value)->_vec;
	} }, {
	"Vec4b", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< or ::value_converter<std::shared_ptr<Vec<cv::Vec4b>>>>();
		mat.at<cv::Vec4b>(index) = *converter->convert(value)->_vec;
	} }, {
	"Vec4s", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< or ::value_converter<std::shared_ptr<Vec<cv::Vec4s>>>>();
		mat.at<cv::Vec4s>(index) = *converter->convert(value)->_vec;
	} }, {
	"Point3f", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< or ::value_converter<std::shared_ptr<Point_<cv::Point3f>>>>();
		mat.at<cv::Point3f>(index) = *converter->convert(value)->_point;
	} }, {
	"Point3i", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< or ::value_converter<std::shared_ptr<Point_<cv::Point3i>>>>();
		mat.at<cv::Point3i>(index) = *converter->convert(value)->_point;
	} }, {
	"Point2f", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< or ::value_converter<std::shared_ptr<Point_<cv::Point2f>>>>();
		mat.at<cv::Point2f>(index) = *converter->convert(value)->_point;
	} }, {
	"Point2d", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< or ::value_converter<std::shared_ptr<Point_<cv::Point2d>>>>();
		mat.at<cv::Point2d>(index) = *converter->convert(value)->_point;
	} }, {
	"double", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< or ::value_converter<double>>();
		mat.at<double>(index) = converter->convert(value);
	} }, {
	"int", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< or ::value_converter<int>>();
		mat.at<int>(index) = converter->convert(value);
	} }, {
	"uchar", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< or ::value_converter<uchar>>();
		mat.at<uchar>(index) = converter->convert(value);
	} }, {
	"char", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< or ::value_converter<char>>();
		mat.at<char>(index) = converter->convert(value);
	} }, {
	"double", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< or ::value_converter<double>>();
		mat.at<double>(index) = converter->convert(value);
	} }, {
	"float", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< or ::value_converter<float>>();
		mat.at<float>(index) = converter->convert(value);
	} }, {
	"schar", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< or ::value_converter<schar>>();
		mat.at<schar>(index) = converter->convert(value);
	} }, {
	"ushort", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< or ::value_converter<ushort>>();
		mat.at<ushort>(index) = converter->convert(value);
	} }, {
	"short", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< or ::value_converter<short>>();
		mat.at<short>(index) = converter->convert(value);
	} }, {
	"int", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< or ::value_converter<int>>();
		mat.at<int>(index) = converter->convert(value);
	} }, {
	"Complexd", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< or ::value_converter<std::shared_ptr<Complex_<cv::Complexd>>>>();
		mat.at<cv::Complexd>(index) = *converter->convert(value)->_complex;
	} }, {
	"Complexf", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< or ::value_converter<std::shared_ptr<Complex_<cv::Complexf>>>>();
		mat.at<cv::Complexf>(index) = *converter->convert(value)->_complex;
	}
	}
};
std::map<std::string, std::function<size_t()> > Matrix_array_accessor::_sizeof_accessors =
{
	{
		"Vec2d", 
		[]() {return sizeof(cv::Vec2d);} 
	}, 
	{
		"Vec3d", 
		[]() {return sizeof(cv::Vec2d);} 
	}, 
	{
		"Vec4b", 
		[]() {return sizeof(cv::Vec2d);} 
	}, 
	{
		"Vec4s", 
		[]() {return sizeof(cv::Vec2d);} 
	}, 
	{
		"Point3f", 
		[]() {return sizeof(cv::Point3f);} 
	}, 
	{
		"Point3i", 
		[]() {return sizeof(cv::Point3i);} 
	}, 
	{
		"Point2f", 
		[]() {return sizeof(cv::Point2f);} 
	}, 
	{
		"Point2d", 
		[]() {return sizeof(cv::Point2d);} 
	}, 
	{
		"double", 
		[]() {return sizeof(double);} 
	}, 
	{
		"int", 
		[]() {return sizeof(int);} 
	}, 
	{
		"uchar", 
		[]() {return sizeof(uchar);} 
	}, 
	{
		"char", 
		[]() {return sizeof(char);} 
	}, 
	{
		"double", 
		[]() {return sizeof(double);} 
	}, 
	{
		"float", 
		[]() {return sizeof(float);}
	}, 
	{
		"schar", 
		[]() {return sizeof(schar);} 
	}, 
	{
		"ushort", 
		[]() {return sizeof(ushort);} 
	}, 
	{
		"short", 
		[]() {return sizeof(short);} 
	}, 
	{
		"int", 
		[]() {return sizeof(int);} 
	}, 
	{
		"Complexd", 
		[]() {return sizeof(cv::Complexd);} 
	}, 
	{
		"Complexf", 
		[]() {return sizeof(cv::Complexf);} 
	}


};




Matrix_array_accessor::Matrix_array_accessor(std::shared_ptr<cv::Mat> mat, std::string type, int i0, int i1, int i2) : _mat(mat), _type(type), _i0(i0), _i1(i1), _i2(i2) {
	if (_get_accessors.count(type) == 0) {
		throw new std::exception("type is not implemented");
	}

	//calculate maximum byte size for mat
	if (_mat->dims == 0) {
		_max_size = 0;
	}
	else {
		_max_size = 1;
		for (auto i = 0; i < _mat->dims; i++) {
			_max_size *= _mat->step.p[i];
		}
	}

	_pre_index = _i0 *(_mat->dims > 0) ? _mat->step.p[0] : 0
		+ _i1 *(_mat->dims > 1) ? _mat->step.p[1] : 0
		+ _i2 *(_mat->dims > 2) ? _mat->step.p[2] : 0;

	_sizeof = Matrix_array_accessor::_sizeof_accessors[_type]();

}

int Matrix_array_accessor::length() {
	return (_max_size - _pre_index);
}

v8::Local<v8::Value> Matrix_array_accessor::get(int index) {
	if ((_pre_index + index) >= _max_size) {
		throw std::exception("index out of bounds");
	}

	if (((index + _pre_index) + _sizeof) > _max_size) {
		throw std::exception("index out of bounds for type specified");
	}

	return _get_accessors[_type](_pre_index + index, *_mat);
}

void Matrix_array_accessor::set(int index, v8::Local<v8::Value> value) {
	_set_accessors[_type](*_mat, (_pre_index + index), value);
}