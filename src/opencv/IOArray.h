#ifndef _ALVISION_IOARRAY_H_
#define _ALVISION_IOARRAY_H_

#include "../alvision.h"
#include <memory>

class IOArray : public or::ObjectWrap {
public:
	static std::string name;
	std::shared_ptr<cv::_InputOutputArray> _ioarray;

	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;
	virtual v8::Local<v8::Function> get_constructor();

	static std::shared_ptr<IOArray> noArray();

	static POLY_METHOD(New);

	virtual cv::_InputArray GetInputArray();
	virtual cv::_InputArray GetInputArrayOfArrays();
	virtual cv::_OutputArray GetOutputArray();
	virtual cv::_OutputArray GetOutputArrayOfArrays();
	virtual cv::_InputOutputArray GetInputOutputArray();
	virtual cv::_InputOutputArray GetInputOutputArrayOfArrays();
};

#endif