#ifndef _ALVISION_IOARRAY_H_
#define _ALVISION_IOARRAY_H_

#include "../alvision.h"
#include <memory>

class IOArray : public overres::ObjectWrap {
public:
	static std::string name;

	std::vector<std::shared_ptr<void>> _references;
	std::shared_ptr<cv::_InputOutputArray> _ioarray;

	static void Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
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

	/*static POLY_METHOD(New_vector_Point2i);
	static POLY_METHOD(New_vector_Point2f);
	static POLY_METHOD(New_vector_Point2d);
	
	static POLY_METHOD(New_vector_Point3i);
	static POLY_METHOD(New_vector_Point3f);
	static POLY_METHOD(New_vector_Point3d);*/
};

#endif