#ifndef _ALVISION_MATND_H_
#define _ALVISION_MATND_H_
//#include "OpenCV.h"
#include "../alvision.h"


class MatND : public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::MatND> _mat;

	static Nan::Persistent<FunctionTemplate> constructor;
	static NAN_METHOD(New);
	/*Matrix();
	Matrix(std::shared_ptr<cv::Mat> other, cv::Rect roi);
	Matrix(int64_t rows, int64_t cols);
	Matrix(int64_t rows, int64_t cols, int64_t type);*/

	//static double DblGet(cv::Mat mat, int i, int j);

	//static NAN_METHOD(zeros); // factory
	//static NAN_METHOD(ones); // factory
	//static NAN_METHOD(eye); // factory

	//static NAN_METHOD(colRange);

	//static NAN_METHOD(Row);
	//static NAN_METHOD(PixelRow);
	//static NAN_METHOD(Col);
	//static NAN_METHOD(PixelCol);
	//static NAN_METHOD(create);

	//static NAN_METHOD(Cols);

	/*static NAN_METHOD(getUMat);
	static NAN_METHOD(rowRange);
	static NAN_METHOD(rowRange);
	static NAN_METHOD(colRange);
	static NAN_METHOD(colRange);
	static NAN_METHOD(diag);
	static NAN_METHOD(clone);
	static NAN_METHOD(copyTo);
	static NAN_METHOD(copyTo);
	static NAN_METHOD(convertTo);
	static NAN_METHOD(assignTo);
	static NAN_METHOD(setTo);
	static NAN_METHOD(reshape);
	static NAN_METHOD(reshape);
	static NAN_METHOD(t);
	static NAN_METHOD(inv);
	static NAN_METHOD(mul);
	static NAN_METHOD(cross);
	static NAN_METHOD(dot);
	static NAN_METHOD(zeros);
	static NAN_METHOD(ones);
	static NAN_METHOD(eye);
	
	static NAN_METHOD(copySize);
	static NAN_METHOD(reserve);
	static NAN_METHOD(resize);
	static NAN_METHOD(push_back_);
	static NAN_METHOD(push_back);
	static NAN_METHOD(pop_back);
	static NAN_METHOD(locateROI);
	static NAN_METHOD(adjustROI);
	static NAN_METHOD(isContinuous);
	static NAN_METHOD(isSubmatrix);
	static NAN_METHOD(elemSize);
	static NAN_METHOD(elemSize1);
	static NAN_METHOD(type);
	static NAN_METHOD(depth);
	static NAN_METHOD(channels);
	static NAN_METHOD(step1);
	static NAN_METHOD(empty);
	static NAN_METHOD(total);
	static NAN_METHOD(checkVector);*/

};

#endif