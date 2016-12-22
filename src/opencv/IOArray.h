#ifndef _ALVISION_IOARRAY_H_
#define _ALVISION_IOARRAY_H_

#include "../alvision.h"

class IOArray : public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	static v8::Local<v8::Object> noArray();

	static POLY_METHOD(New);

	virtual cv::InputArray& GetInputArray() = 0;
	virtual cv::InputArrayOfArrays& GetInputArrayOfArrays() = 0;
	virtual cv::OutputArray& GetOutputArray() = 0;
	virtual cv::OutputArrayOfArrays& GetOutputArrayOfArrays() = 0;
	virtual cv::InputOutputArray& GetInputOutputArray() = 0;
	virtual cv::InputOutputArrayOfArrays& GetInputOutputArrayOfArrays() = 0;
};

#endif