#ifndef _ALVISION_MATRIX_H_
#define _ALVISION_MATRIX_H_
//#include "OpenCV.h"
#include "../alvision.h"


class Matrix : public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target);

	std::shared_ptr<cv::Mat> _mat;

	static Nan::Persistent<FunctionTemplate> constructor;
	static NAN_METHOD(New);
	Matrix();
	Matrix(std::shared_ptr<cv::Mat> other, cv::Rect roi);
	Matrix(int64_t rows, int64_t cols);
	Matrix(int64_t rows, int64_t cols, int64_t type);

	static double DblGet(cv::Mat mat, int i, int j);

	static NAN_METHOD(Zeros); // factory
	static NAN_METHOD(Ones); // factory
	static NAN_METHOD(Eye); // factory

	static NAN_METHOD(Row);
	static NAN_METHOD(PixelRow);
	static NAN_METHOD(Col);
	static NAN_METHOD(PixelCol);
};

#endif