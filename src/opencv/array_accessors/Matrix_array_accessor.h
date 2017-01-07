#ifndef _ALVISION_MATRIX_ACCESSOR_H_
#define _ALVISION_MATRIX_ACCESSOR_H_

#include "../../alvision.h"

template <typename T>
class Matrix_array_accessor {
public:
	std::shared_ptr<cv::Mat> _mat;
	std::string _type;
	std::map<string, std::function<v8::Local<v8::Value>(int)>> _get_accessors;

	Matrix_array_accessor(std::shared_ptr<cv::Mat> mat, std::string type) : _mat(mat), _type(type) {
		_get_accessors["Vec2d"] = [&](int index) {return Nan::New(_mat->at<cv::Vec2d>(index); };
		_get_accessors["Vec3d"] = [&](int index) {return Nan::New(_mat->at<cv::Vec3d>(index); };
		_get_accessors["Vec4b"] = [&](int index){return Nan::New(_mat->at<cv::Vec4b>(index); };
		_get_accessors["Vec4s"] = [&](int index){return Nan::New(_mat->at<cv::Vec4s>(index); };
		_get_accessors["Point3f"] = [&](int index){return Nan::New(_mat->at<cv::Point3f>(index); };
		_get_accessors["Point3i"] = [&](int index){return Nan::New(_mat->at<cv::Point3i>(index); };
		_get_accessors["Point2f"] = [&](int index){return Nan::New(_mat->at<cv::Point2f>(index); };
		_get_accessors["Point2d"] = [&](int index){return Nan::New(_mat->at<cv::Point2d>(index); };
		_get_accessors["double"] = [&](int index){return Nan::New(_mat->at<double>(index); };
		_get_accessors["int"] = [&](int index){return Nan::New(_mat->at<int>(index); };
		_get_accessors["uchar"] = [&](int index) {return Nan::New(_mat->at<uchar>(index); };
		_get_accessors["char"] = [&](int index) {return Nan::New(_mat->at<char>(index); };
		_get_accessors["double"] = [&](int index){return Nan::New(_mat->at<double>(index); };
		_get_accessors["float"] = [&](int index) {return Nan::New(_mat->at<float>(index); };
		_get_accessors["schar"] = [&](int index) {return Nan::New(_mat->at<schar>(index); };
		_get_accessors["ushort"] = [&](int index){return Nan::New(_mat->at<ushort>(index); };
		_get_accessors["short"] = [&](int index) {return Nan::New(_mat->at<short>(index); };
		_get_accessors["int"] = [&](int index) {return Nan::New(_mat->at<int>(index); }; 
		_get_accessors["Complexd"] = [&](int index) {return Nan::New(_mat->at<cv::Complexd>(index); };
		_get_accessors["Complexf"] = [&](int index) {return Nan::New(_mat->at<cv::Complexf>(index); };

	}
	



	virtual int length() {
		return (unsigned)(size.p[0] * size.p[1]);
	}
	virtual v8::Local<v8::Value> get(int index) {
		return _get_accessors[_type](index);
	}
	virtual void set(int index, v8::Local<v8::Value> value) {
		//TODO: implement?
		//_matx->val[index] = value->NumberValue();
	}
};

#endif