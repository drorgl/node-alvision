#include "IOArray.h"

namespace general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(ioarray_callback) {
		return overload->execute("ioarray", info);
	}
}


Nan::Persistent<FunctionTemplate> IOArray::constructor;

void IOArray::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	general_callback::overload = overload;

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(general_callback::ioarray_callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("IOArray").ToLocalChecked());
	overload->register_type<IOArray>(ctor, "ioarray", "IOArray");


	overload->addOverloadConstructor("ioarray", "IOArray", {}, IOArray::New);

	target->Set(Nan::New("IOArray").ToLocalChecked(), ctor->GetFunction());

	
}

v8::Local<v8::Function> IOArray::get_constructor() {
	return Nan::New(constructor)->GetFunction();
}

POLY_METHOD(IOArray::New) {
	//auto instance = 
}

IOArray* IOArray::noArray() {

	auto ret = new IOArray();
	ret->_ioarray = std::make_shared<cv::_InputOutputArray>(cv::noArray());
	return ret;
}

cv::InputArray					IOArray::GetInputArray() {
	return cv::InputArray(*_ioarray);
}
cv::InputArrayOfArrays			IOArray::GetInputArrayOfArrays() {
	return cv::InputArrayOfArrays(*_ioarray);
}
cv::OutputArray					IOArray::GetOutputArray() {
	return cv::OutputArray(*_ioarray);
}
cv::OutputArrayOfArrays			IOArray::GetOutputArrayOfArrays() {
	return cv::OutputArrayOfArrays(*_ioarray);
}
cv::InputOutputArray			IOArray::GetInputOutputArray() {
	return cv::InputOutputArray(*_ioarray);
}
cv::InputOutputArrayOfArrays	IOArray::GetInputOutputArrayOfArrays() {
	return cv::InputOutputArrayOfArrays(*_ioarray);
}
