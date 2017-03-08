#include "Matrix_array_accessor.h"

#include <value_converter.h>
#include "../Vec.h"
#include "../types/Point.h"
#include "../types/Point3.h"
#include "../types/Complex.h"

std::map<std::string, std::function<v8::Local<v8::Value>(int, cv::Mat&)> > Matrix_array_accessor::_get_accessors = {
		{ "Vec2d",
				[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<Vec<cv::Vec2d> * >>();
			return converter->convert(Vec<cv::Vec2d>::from(*(cv::Vec2d *)(mat.data + index)));
		} },
		{ "Vec2f",
			[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<Vec<cv::Vec2f> * >>();
			return converter->convert(Vec<cv::Vec2f>::from(*(cv::Vec2f *)(mat.data + index)));
		} },
		{ "Vec3f",
			[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<Vec<cv::Vec3f> * >>();
			return converter->convert(Vec<cv::Vec3f>::from(*(cv::Vec3f *)(mat.data + index)));
		} },
		{ "Vec3d",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<Vec<cv::Vec3d> * >>();
			return converter->convert(Vec<cv::Vec3d>::from(*(cv::Vec3d *)(mat.data + index)));
		} },
		{ "Vec3b",
			[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<Vec<cv::Vec3b> * >>();
			return converter->convert(Vec<cv::Vec3b>::from(*(cv::Vec3b *)(mat.data + index)));
		} },
		{ "Vec4b",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<Vec<cv::Vec4b>* >>();
			return converter->convert(Vec<cv::Vec4b>::from(*(cv::Vec4b *)(mat.data + index)));
		} },
		{ "Vec4s",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<Vec<cv::Vec4s>* >>();
			return converter->convert(Vec<cv::Vec4s>::from(*(cv::Vec4s * )(mat.data + index)));
		} },
		{ "Point3f",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<Point3_<cv::Point3f>* > >();
			return converter->convert(
				Point3_<cv::Point3f>::from(*(cv::Point3f *)(mat.data + index)));
		} },
		{ "Point3i",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<Point3_<cv::Point3i>* > >();
			return converter->convert(
				Point3_<cv::Point3i>::from(*(cv::Point3i * )(mat.data + index)));
		} },
		{ "Point2f",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<Point_<cv::Point2f>* >>();
			return converter->convert(
				Point_<cv::Point2f>::from(*(cv::Point2f *)(mat.data + index)));
		} },
		{ "Point2d",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<Point_<cv::Point2d>* >>();
			return converter->convert(
				Point_<cv::Point2d>::from(*(cv::Point2d * )(mat.data + index)));
		} },
		{ "double",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<double>>();
			return converter->convert(*(double * ) (mat.data + index));
		} },
		{ "int",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<int>>();
			return converter->convert(*(int *) (mat.data + index));
		} },
		{ "uchar",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<uchar>>();
			return converter->convert(*(uchar *)(mat.data + index));
		} },
		{ "char",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<char>>();
			return converter->convert(*(char *)(mat.data + index));
		} },
		/*{ "double",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<double>>();
			return converter->convert(*(double * )(mat.data + index));
		} },*/
		{ "float",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<float>>();
			return converter->convert(*(float *)(mat.data + index));
		} },
		{ "schar",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<schar>>();
			return converter->convert(*(schar *)(mat.data + index));
		} },
		{ "ushort",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<ushort>>();
			return converter->convert(*(ushort *)(mat.data + index));
		} },
		{ "short",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<short>>();
			return converter->convert(*(short *)(mat.data + index));
		} },
		{ "int",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<int>>();
			return converter->convert(*(int *)(mat.data + index));
		} },
		{ "Complexd",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<Complex_<cv::Complexd>*>>();
			return converter->convert(
				Complex_<cv::Complexd>::from(*(cv::Complexd *)(mat.data + index)));
		} },
		{ "Complexf",
		[](int index, cv::Mat& mat) {
			auto converter = std::make_unique < overres::value_converter<Complex_<cv::Complexf>*>>();
			return converter->convert(
				Complex_<cv::Complexf>::from(*(cv::Complexf *)(mat.data + index)));
		}}
};

std::map<std::string, std::function<void(cv::Mat&, int, v8::Local<v8::Value>)> > Matrix_array_accessor::_set_accessors = {
	{
	"Vec2d", 
	[](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<Vec<cv::Vec2d>*>>();
		*(cv::Vec2d *)(mat.data + index) = *converter->convert(value)->_vec;
	} 
	}, 
	{
		"Vec2f",
		[](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<Vec<cv::Vec2f>*>>();
		*(cv::Vec2f *)(mat.data + index) = *converter->convert(value)->_vec;
	}
	},
	{
		"Vec3f",
		[](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<Vec<cv::Vec3f>*>>();
		*(cv::Vec3f *)(mat.data + index) = *converter->convert(value)->_vec;
	}
	},
	{
	"Vec3d", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<Vec<cv::Vec3d>*>>();
		*(cv::Vec3d *)(mat.data + index) = *converter->convert(value)->_vec;
	} }, 
	{
		"Vec3b", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<Vec<cv::Vec3b>*>>();
		*(cv::Vec3b *)(mat.data + index) = *converter->convert(value)->_vec;
	} },
	{
	"Vec4b", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<Vec<cv::Vec4b>*>>();
		*(cv::Vec4b *)(mat.data + index) = *converter->convert(value)->_vec;
	} }, {
	"Vec4s", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<Vec<cv::Vec4s>*>>();
		*(cv::Vec4s *)(mat.data + index) = *converter->convert(value)->_vec;
	} }, {
	"Point3f", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<Point3_<cv::Point3f>*>>();
		*(cv::Point3f *)(mat.data + index) = *converter->convert(value)->_point3;
	} }, {
	"Point3i", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<Point3_<cv::Point3i>*>>();
		*(cv::Point3i *)(mat.data + index) = *converter->convert(value)->_point3;
	} }, {
	"Point2f", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<Point_<cv::Point2f>*>>();
		*(cv::Point2f *)(mat.data + index) = *converter->convert(value)->_point;
	} }, {
	"Point2d", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<Point_<cv::Point2d>*>>();
		*(cv::Point2d *)(mat.data + index) = *converter->convert(value)->_point;
	} }, {
	"double", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<double>>();
		*(double *)(mat.data + index) = converter->convert(value);
	} }, {
	"int", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<int>>();
		*(int *)(mat.data + index) = converter->convert(value);
	} }, {
	"uchar", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<uchar>>();
		*(uchar *)(mat.data + index) = converter->convert(value);
	} }, {
	"char", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<char>>();
		*(char *)(mat.data + index) = converter->convert(value);
	} },
	/*{
	"double", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<double>>();
		mat.ptr<double>(index) = converter->convert(value);
	} },*/
	{
	"float", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<float>>();
		*(float *)(mat.data + index) = converter->convert(value);
	} }, {
	"schar", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<schar>>();
		*(schar *)(mat.data + index) = converter->convert(value);
	} }, {
	"ushort", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<ushort>>();
		*(ushort *)(mat.data + index) = converter->convert(value);
	} }, {
	"short", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<short>>();
		*(short * )(mat.data + index) = converter->convert(value);
	} }, {
	"int", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<int>>();
		*(int *)(mat.data + index) = converter->convert(value);
	} }, {
	"Complexd", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<Complex_<cv::Complexd>*>>();
		*(cv::Complexd *)(mat.data + index) = *converter->convert(value)->_complex;
	} }, {
	"Complexf", [](cv::Mat &mat, int index, v8::Local<v8::Value> value) {
		auto converter = std::make_unique< overres::value_converter<Complex_<cv::Complexf>*>>();
		*(cv::Complexf *)(mat.data + index) = *converter->convert(value)->_complex;
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
		"Vec2f",
		[]() {return sizeof(cv::Vec2f); }
	},
	{
		"Vec3f",
		[]() {return sizeof(cv::Vec3f); }
	},
	{
		"Vec3d", 
		[]() {return sizeof(cv::Vec2d);} 
	}, 
	{
		"Vec3b",
		[]() {return sizeof(cv::Vec2b); }
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
	/*{
		"double", 
		[]() {return sizeof(double);} 
	}, */
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
		throw std::runtime_error("type " + type +  " is not implemented");
	}

	//calculate maximum byte size for mat
	if (_mat->dims == 0) {
		_max_size = 0;
	}
	else {
		_max_size = _mat->dataend - _mat->datastart;
	}

	_pre_index = _i0 * ((_mat->dims > 0) ? _mat->step.p[0] :0)
		+ _i1 * ((_mat->dims > 1) ? _mat->step.p[1] : 0)
		+ _i2 * ((_mat->dims > 2) ? _mat->step.p[2] : 0);

	_sizeof = Matrix_array_accessor::_sizeof_accessors[_type]();

}

int Matrix_array_accessor::length() {
	return ((_max_size - _pre_index) / _sizeof);
}

v8::Local<v8::Value> Matrix_array_accessor::get(int index) {
	if (index > ((_max_size - _pre_index) / _sizeof)) {
		throw std::runtime_error("index out of bounds");
	}

	auto byte_index = _pre_index + (index *  _mat->step.p[0]);

	if ((byte_index) > _max_size) {
		throw std::runtime_error("index out of bounds for type specified");
	}

	return _get_accessors[_type](byte_index, *_mat);
}

void Matrix_array_accessor::set(int index, v8::Local<v8::Value> value) {
	if (index > ((_max_size - _pre_index) / _sizeof)) {
		throw std::runtime_error("index out of bounds");
	}

	auto byte_index = _pre_index + (index *  _mat->step.p[0]);

	if ((byte_index) > _max_size) {
		throw std::runtime_error("index out of bounds for type specified");
	}

	_set_accessors[_type](*_mat, byte_index, value);
}