#ifndef _ALVISION_UMATRIX_H_
#define _ALVISION_UMATRIX_H_
//#include "OpenCV.h"
#include "../alvision.h"
#include "IOArray.h"


class UMatrix : public IOArray {
public:
	static std::string name;
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::UMat> _umat;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor(); 

	virtual cv::_InputArray GetInputArray();
	virtual cv::_InputArray GetInputArrayOfArrays();
	virtual cv::_OutputArray GetOutputArray();
	virtual cv::_OutputArray GetOutputArrayOfArrays();
	virtual cv::_InputOutputArray GetInputOutputArray();
	virtual cv::_InputOutputArray GetInputOutputArrayOfArrays();

	static std::shared_ptr<UMatrix> UMat();


	static POLY_METHOD(New);

	

};

#endif