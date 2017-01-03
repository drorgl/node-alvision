#ifndef _ALVISION_IOARRAY_H_
#define _ALVISION_IOARRAY_H_

#include "../alvision.h"
#include <memory>

class IOArray : public or::ObjectWrap {
public:
	std::shared_ptr<cv::_InputArray> _ioarray;

	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;
	virtual v8::Local<v8::Function> get_constructor();

	static std::shared_ptr<IOArray> noArray();

	static POLY_METHOD(New);

	virtual cv::InputArray GetInputArray();
	virtual cv::InputArrayOfArrays GetInputArrayOfArrays();
	virtual cv::OutputArray GetOutputArray();
	virtual cv::OutputArrayOfArrays GetOutputArrayOfArrays();
	virtual cv::InputOutputArray GetInputOutputArray();
	virtual cv::InputOutputArrayOfArrays GetInputOutputArrayOfArrays();
};

#endif