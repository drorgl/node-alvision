#include "UMatrix.h"


namespace umatrix_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("umatrix_general_callback is empty");
		}
		return overload->execute("umatrix", info);
	}
}

Nan::Persistent<FunctionTemplate> UMatrix::constructor;

std::string UMatrix::name;

void
UMatrix::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	UMatrix::name = "UMat";
	umatrix_general_callback::overload = overload;

	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(umatrix_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("UMat").ToLocalChecked());
	ctor->Inherit(Nan::New(IOArray::constructor));

	overload->register_type<UMatrix>(ctor, "mat", "UMat");

	overload->addOverloadConstructor("matrix", "UMat", {}, UMatrix::New);


	target->Set(Nan::New("UMat").ToLocalChecked(), ctor->GetFunction());

	
};

v8::Local<v8::Function> UMatrix::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


cv::_InputArray					UMatrix::GetInputArray() {
	return *_umat;
}
cv::_InputArray			UMatrix::GetInputArrayOfArrays() {
	return *_umat;
}
cv::_OutputArray					UMatrix::GetOutputArray() {
	return *_umat;
}
cv::_OutputArray			UMatrix::GetOutputArrayOfArrays() {
	return *_umat;
}
cv::_InputOutputArray			UMatrix::GetInputOutputArray() {
	return *_umat;
}
cv::_InputOutputArray	UMatrix::GetInputOutputArrayOfArrays() {
	return *_umat;
}

std::shared_ptr<UMatrix> UMatrix::UMat() {
	auto ret = std::make_shared<UMatrix>();
	ret->_umat = std::make_shared<cv::UMat>();
	return ret;
}


POLY_METHOD(UMatrix::New) {
	auto umat = new UMatrix();
	umat->_umat = std::make_shared<cv::UMat>();

	umat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
