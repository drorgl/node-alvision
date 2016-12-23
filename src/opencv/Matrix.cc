#include "Matrix.h"
#include "Constants.h"

#include "IOArray.h"
#include "Size.h"
#include "Scalar.h"
#include "MatExpr.h"
#include "Range.h"
#include "Rect.h"
#include "TrackedPtr.h"
#include "TrackedElement.h"

namespace matrix_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		return overload->execute("matrix", info);
	}
}

Nan::Persistent<FunctionTemplate> Matrix::constructor;


void
Matrix::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	matrix_general_callback::overload = overload;
	//overload->addStaticOverload("highgui", "", "stopLoop", {}, highgui::stopLoop);
	//Nan::SetMethod(target, "stopLoop", matrix_general_callback::highgui_callback);

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(matrix_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("Mat").ToLocalChecked());
	ctor->Inherit(Nan::New(IOArray::constructor));

	overload->register_type(ctor, "matrix", "Mat");

	overload->addOverloadConstructor("matrix", "Mat", {}, Matrix::New);
	overload->addOverloadConstructor("matrix", "Mat", {make_param<int>("rows","int"),make_param<int>("cols","int"),make_param<int>("type","int")}, Matrix::New_rows_cols_type);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Size<cv::Size2i>*>("size","Size"),make_param<int>("type","int")}, Matrix::New_size_type);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<int>("rows","int"),make_param<int>("cols","int"),make_param<int>("type","int"),make_param<Scalar<cv::Scalar>*>("s","Scalar") }, Matrix::New_rows_cols_type_scalar);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Size<cv::Size2i>*>("size","Size"),make_param<int>("type","int"),make_param<Scalar<cv::Scalar>*>("s","Scalar") }, Matrix::New_size_type_scalar);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<int>("ndims","int"),make_param<std::shared_ptr<std::vector<int>>>("sizes","Array<int>"),make_param<int>("type","int") }, Matrix::New_ndims_sizes_type);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<int>("ndims","int"),make_param<std::shared_ptr<std::vector<int>>>("sizes","Array<int>"),make_param<int>("type","int"),make_param<Scalar<cv::Scalar>*>("s","Scalar") }, Matrix::New_ndims_sizes_type_scalar);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matrix*>("m","Mat") }, Matrix::New_mat);
	//TODO: not sure...
	overload->addOverloadConstructor("matrix", "Mat", { make_param<int>("rows","int"),make_param<int>("cols","int"),make_param<int>("type","int"),make_param("data","Array"),make_param<int>("step","size_t",(int)cv::Mat::AUTO_STEP) }, Matrix::New_rows_cols_type_data_step);
	//TODO: not sure...
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Size<cv::Size2i>*>("size","Size"),make_param<int>("type","MatrixType"),make_param("data","Array"),make_param<int>("step","size_t",(int)cv::Mat::AUTO_STEP) }, Matrix::New_size_type_data_step);
	overload->addOverloadConstructor("matrix", "Mat", {make_param("vec","Array"),make_param<bool>("copyData","bool",false)}, Matrix::New_array_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param("vec","Vec<>"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param("mtx","Matx<>"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param("pt","Point_<>"),make_param<bool>("copyData","bool",false) }, Matrix::New_point_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param("pt","Point3_<>"),make_param<bool>("copyData","bool",false) }, Matrix::New_point3_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param("m","cuda::GpuMat")}, Matrix::New_gpuMat);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<uint8_t>>>("buf","Buffer") }, Matrix::New_buffer);

	//static
	overload->addStaticOverload("matrix", "Mat", "zeros", {make_param<int>("rows","int"),make_param<int>("cols","int"),make_param<int>("type","int")}, Matrix::zeros_rows_cols_type);
	overload->addStaticOverload("matrix", "Mat", "zeros", { make_param<Size<cv::Size2i>*>("size","Size"),make_param<int>("type","int")}, Matrix::zeros_size_type);
	overload->addStaticOverload("matrix", "Mat", "zeros", { make_param<int>("ndims","int"),make_param<std::shared_ptr<std::vector<int>>>("sz","Array<int>"),make_param<int>("type","int") }, Matrix::zeros_ndims_sz_type);
	Nan::SetMethod(ctor, "zeros", matrix_general_callback::callback);

	overload->addStaticOverload("matrix", "Mat", "ones", { make_param<int>("rows","int"),make_param<int>("cols","int"),make_param<int>("type","int") }, Matrix::ones_rows_cols_type);
	overload->addStaticOverload("matrix", "Mat", "ones", { make_param<Size<cv::Size2i>*>("size","Size"),make_param<int>("type","int") }, Matrix::ones_size_type);
	overload->addStaticOverload("matrix", "Mat", "ones", { make_param<int>("ndims","int"),make_param<std::shared_ptr<std::vector<int>>>("sz","Array<int>"), make_param<int>("type","MatrixType") }, Matrix::ones_ndims_sz_type);
	Nan::SetMethod(ctor, "ones", matrix_general_callback::callback);

	overload->addStaticOverload("matrix", "Mat", "eye", { make_param<int>("rows","int"),make_param<int>("cols","int"), make_param<int>("type","int") }, Matrix::eye_rows_cols_type);
	overload->addStaticOverload("matrix", "Mat", "eye", { make_param<Size<cv::Size2i>*>("size","Size"),make_param<int>("type","int") }, Matrix::eye_size_type);
	Nan::SetMethod(ctor, "eye", matrix_general_callback::callback);

	overload->addStaticOverload("matrix", "Mat", "from", { make_param<Matrix*>("m","Mat") }, Matrix::from_mat);
	overload->addStaticOverload("matrix", "Mat", "from", { make_param<MatExpr*>("expr","MatExpr") }, Matrix::from_matexpr);
	Nan::SetMethod(ctor, "from", matrix_general_callback::callback);

	// Prototype
	overload->add_type_alias("UMatUsageFlags", "int");


	overload->addOverload("matrix", "Mat", "getUMat", { make_param<int>("accessFlags","int"),make_param<int>("usageFlags","UMatUsageFlags",(int)cv::UMatUsageFlags::USAGE_DEFAULT) }, Matrix::getUMat);
	Nan::SetPrototypeMethod(ctor, "getUMat", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "row", { make_param<int>("y","int")}, Matrix::row);
	Nan::SetPrototypeMethod(ctor, "row", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "col", { make_param<int>("x","int") }, Matrix::col);
	Nan::SetPrototypeMethod(ctor, "col", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "rowRange", { make_param<int>("startrow","int"),make_param<int>("endrow","int") }, Matrix::rowRange_startRow);
	overload->addOverload("matrix", "Mat", "rowRange", { make_param<Range*>("r","Range")}, Matrix::rowRange_range);
	Nan::SetPrototypeMethod(ctor, "rowRange", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "colRange", { make_param<int>("startcol","int"),make_param<int>("endcol","int") }, Matrix::colRange_startcol);
	overload->addOverload("matrix", "Mat", "colRange", { make_param<Range*>("r","Range") }, Matrix::colRange_range);
	Nan::SetPrototypeMethod(ctor, "colRange", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "clone", { }, Matrix::clone);
	Nan::SetPrototypeMethod(ctor, "clone", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "copyTo", {make_param<IOArray*>("m","OutputArray")}, Matrix::copyTo_outputArray);
	overload->addOverload("matrix", "Mat", "copyTo", { make_param<IOArray*>("m","OutputArray"),make_param<IOArray*>("mask","InputArray") }, Matrix::copyTo_masked);
	Nan::SetPrototypeMethod(ctor, "copyTo", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "convertTo", { make_param<IOArray*>("m","OutputArray"),make_param<int>("rtype","int"), make_param<double>("alpha","double",1), make_param<double>("beta","double",0) }, Matrix::convertTo);
	Nan::SetPrototypeMethod(ctor, "convertTo", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "setTo", { make_param<IOArray*>("value","InputArray"),make_param<IOArray*>("mask","InputArray", IOArray::noArray())}, Matrix::setTo_inputArray);
	overload->addOverload("matrix", "Mat", "setTo", { make_param<Scalar<cv::Scalar>*>("value","Scalar"),make_param<IOArray*>("mask","InputArray", IOArray::noArray()) }, Matrix::setTo_scalar);
	overload->addOverload("matrix", "Mat", "setTo", { make_param<int>("value","int"),make_param<IOArray*>("mask","InputArray", IOArray::noArray()) }, Matrix::setTo_int);
	Nan::SetPrototypeMethod(ctor, "setTo", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "reshape", { make_param<int>("cn","int"),make_param<int>("rows","int", 0) }, Matrix::reshape);
	Nan::SetPrototypeMethod(ctor, "reshape", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "t", {  }, Matrix::t);
	Nan::SetPrototypeMethod(ctor, "t", matrix_general_callback::callback);

	overload->add_type_alias("DecompTypes", "int");

	overload->addOverload("matrix", "Mat", "inv", {make_param<int>("method","DecompTypes",(int)cv::DECOMP_LU)}, Matrix::inv);
	Nan::SetPrototypeMethod(ctor, "inv", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "mul", { make_param<IOArray*>("m","InputArray"),make_param<double>("scale","double",1) }, Matrix::mul);
	Nan::SetPrototypeMethod(ctor, "mul", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "cross", { make_param<IOArray*>("m","InputArray") }, Matrix::cross);
	Nan::SetPrototypeMethod(ctor, "cross", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "dot", { make_param<IOArray*>("m","InputArray") }, Matrix::dot);
	Nan::SetPrototypeMethod(ctor, "dot", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "create", { make_param<int>("rows","int"), make_param<int>("cols","int"), make_param<int>("type","int") }, Matrix::create_rows_cols_type);
	overload->addOverload("matrix", "Mat", "create", { make_param<Size<cv::Size2i>* >("size","Size"), make_param<int>("type","int")}, Matrix::create_size);
	//TODO: decide on matsize
	//overload->addOverload("matrix", "Mat", "create", { make_param<MatSize*>("size","MatSize"), make_param<int>("type","int") }, Matrix::create_matsize);
	overload->addOverload("matrix", "Mat", "create", { make_param<int>("ndims","int"), make_param<std::shared_ptr<std::vector<int>>>("sizes","Array<int>"), make_param<int>("type","int") }, Matrix::create_ndims_size);
	//TODO: decide on matsize
	//overload->addOverload("matrix", "Mat", "create", { make_param<int>("ndims","int"), make_param<MatSize*>("size","MatSize"), make_param<int>("type","int") }, Matrix::create_ndims_matsize);
	Nan::SetPrototypeMethod(ctor, "create", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "resize", { make_param<int>("sz","size_t"), make_param<Scalar<cv::Scalar>*>("s","Scalar", Nan::Null()) }, Matrix::resize);
	Nan::SetPrototypeMethod(ctor, "resize", matrix_general_callback::callback);


	overload->addOverload("matrix", "Mat", "roi", { make_param<Rect<cv::Rect>*>("roi","Rect")}, Matrix::roi_rect);
	overload->addOverload("matrix", "Mat", "roi", { make_param<std::shared_ptr<std::vector<Range*>>>("ranges","Array<Range>") }, Matrix::roi_ranges);
	Nan::SetPrototypeMethod(ctor, "roi", matrix_general_callback::callback);


	overload->addOverload("matrix", "Mat", "isContinuous", {  }, Matrix::isContinuous);
	Nan::SetPrototypeMethod(ctor, "isContinuous", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "elemSize", {}, Matrix::elemSize);
	Nan::SetPrototypeMethod(ctor, "elemSize", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "elemSize1", {}, Matrix::elemSize1);
	Nan::SetPrototypeMethod(ctor, "elemSize1", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "type", {}, Matrix::type);
	Nan::SetPrototypeMethod(ctor, "type", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "depth", {}, Matrix::depth);
	Nan::SetPrototypeMethod(ctor, "depth", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "channels", {}, Matrix::channels);
	Nan::SetPrototypeMethod(ctor, "channels", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "empty", {}, Matrix::empty);
	Nan::SetPrototypeMethod(ctor, "empty", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "total", {}, Matrix::total);
	Nan::SetPrototypeMethod(ctor, "total", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "ptr", {make_param<std::string>("type","String"),make_param<int>("i0","int",0)}, Matrix::ptr);
	Nan::SetPrototypeMethod(ctor, "ptr", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "at", { make_param<std::string>("type","String"),make_param<int>("i0","int"),make_param<int>("i1","int",Nan::Null()), make_param<int>("i2","int",Nan::Null()) }, Matrix::at);
	Nan::SetPrototypeMethod(ctor, "at", matrix_general_callback::callback);

	Nan::SetAccessor(itpl, Nan::New("dims").ToLocalChecked(), Matrix::dims);

	overload->addOverload("matrix", "Mat", "rows", { }, Matrix::rows);
	Nan::SetPrototypeMethod(ctor, "rows", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "cols", {}, Matrix::cols);
	Nan::SetPrototypeMethod(ctor, "cols", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "data", {}, Matrix::data);
	Nan::SetPrototypeMethod(ctor, "data", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "size", {}, Matrix::size);
	Nan::SetPrototypeMethod(ctor, "size", matrix_general_callback::callback);

	Nan::SetAccessor(itpl,Nan::New( "step").ToLocalChecked(), Matrix::step);


	target->Set(Nan::New("Mat").ToLocalChecked(), ctor->GetFunction());
};

v8::Local<v8::Object> Matrix::WrapThis() {
	auto retval = Nan::New<v8::Object>();
	this->Wrap(retval);
	return retval;
}

cv::InputArray& Matrix::GetInputArray() {
	return *_mat;
}
cv::InputArrayOfArrays& Matrix::GetInputArrayOfArrays() {
	return *_mat;
}
cv::OutputArray& Matrix::GetOutputArray() {
	return *_mat;
}
cv::OutputArrayOfArrays& Matrix::GetOutputArrayOfArrays() {
	return *_mat;
}
cv::InputOutputArray& Matrix::GetInputOutputArray() {
	return *_mat;
}
cv::InputOutputArrayOfArrays& Matrix::GetInputOutputArrayOfArrays() {
	return *_mat;
}

POLY_METHOD(Matrix::New) {
	Matrix *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>();

	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(Matrix::New_rows_cols_type) {
	Matrix *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>((int)info[0]->IntegerValue(), (int)info[1]->IntegerValue(), (int)info[2]->IntegerValue());
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_size_type) {
	//Matrix *mat = new Matrix();
	//auto size = info.at<Size<cv::Size>*>(0)->_size;
	//
	//mat->_mat = std::make_shared<cv::Mat>(size, (int)info[1]->IntegerValue());
	//mat->Wrap(info.Holder());
	//info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_rows_cols_type_scalar) {
	Matrix *mat = new Matrix();
	auto s = *Nan::ObjectWrap::Unwrap<Scalar<cv::Scalar>>(info[3].As<v8::Object>())->_scalar;

	mat->_mat = std::make_shared<cv::Mat>((int)info[0]->IntegerValue(), (int)info[1]->IntegerValue(), (int)info[2]->IntegerValue(), s);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_size_type_scalar) {
	Matrix *mat = new Matrix();
	
	auto size = *Nan::ObjectWrap::Unwrap<Size<cv::Size>>(info[0].As<v8::Object>())->_size;
	auto s = *Nan::ObjectWrap::Unwrap<Scalar<cv::Scalar>>(info[2].As<v8::Object>())->_scalar;

	mat->_mat = std::make_shared<cv::Mat>(size, (int)info[1]->IntegerValue(), s);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_ndims_sizes_type) {}
POLY_METHOD(Matrix::New_ndims_sizes_type_scalar) {}
POLY_METHOD(Matrix::New_mat) {
	Matrix *mat = new Matrix();
	auto fromMat = *Nan::ObjectWrap::Unwrap<Matrix>(info[0].As<v8::Object>())->_mat;

	mat->_mat = std::make_shared<cv::Mat>(fromMat);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_rows_cols_type_data_step) {}
POLY_METHOD(Matrix::New_size_type_data_step) {}
POLY_METHOD(Matrix::New_array_copyData) {}
POLY_METHOD(Matrix::New_vec_copyData) {}
POLY_METHOD(Matrix::New_matx_copyData) {}
POLY_METHOD(Matrix::New_point_copyData) {}
POLY_METHOD(Matrix::New_point3_copyData) {}
POLY_METHOD(Matrix::New_gpuMat) {}
POLY_METHOD(Matrix::New_buffer) {}
POLY_METHOD(Matrix::zeros_rows_cols_type) {
	auto retval = new MatExpr();
	
	auto res = cv::Mat::zeros((int)info[0]->IntegerValue(), (int)info[1]->IntegerValue(), (int)info[2]->IntegerValue());
	retval->_matExpr = std::make_shared<cv::MatExpr>(res);
	
	auto wrapped = retval->WrapThis();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::zeros_size_type) {
	auto retval = new MatExpr();
	
	auto size = *Nan::ObjectWrap::Unwrap<Size<cv::Size>>(info[0].As<v8::Object>())->_size;

	auto res = cv::Mat::zeros(size, (int)info[1]->IntegerValue());
	retval->_matExpr = std::make_shared<cv::MatExpr>(res);

	auto wrapped = retval->WrapThis();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::zeros_ndims_sz_type) {}
POLY_METHOD(Matrix::ones_rows_cols_type) {
	auto retval = new MatExpr();

	auto res = cv::Mat::ones((int)info[0]->IntegerValue(), (int)info[1]->IntegerValue(), (int)info[2]->IntegerValue());
	retval->_matExpr = std::make_shared<cv::MatExpr>(res);

	auto wrapped = retval->WrapThis();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::ones_size_type) {
	auto retval = new MatExpr();

	auto size = *Nan::ObjectWrap::Unwrap<Size<cv::Size>>(info[0].As<v8::Object>())->_size;

	auto res = cv::Mat::ones(size, (int)info[1]->IntegerValue());
	retval->_matExpr = std::make_shared<cv::MatExpr>(res);

	auto wrapped = retval->WrapThis();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::ones_ndims_sz_type) {}
POLY_METHOD(Matrix::eye_rows_cols_type) {
	auto retval = new MatExpr();

	auto res = cv::Mat::eye((int)info[0]->IntegerValue(), (int)info[1]->IntegerValue(), (int)info[2]->IntegerValue());
	retval->_matExpr = std::make_shared<cv::MatExpr>(res);

	auto wrapped = retval->WrapThis();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::eye_size_type) {
	auto retval = new MatExpr();

	auto size = *Nan::ObjectWrap::Unwrap<Size<cv::Size>>(info[0].As<v8::Object>())->_size;

	auto res = cv::Mat::eye(size, (int)info[1]->IntegerValue());
	retval->_matExpr = std::make_shared<cv::MatExpr>(res);

	auto wrapped = retval->WrapThis();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::from_mat) {}
POLY_METHOD(Matrix::from_matexpr) {
	auto matexpr = *Nan::ObjectWrap::Unwrap<MatExpr>(info[0].As<v8::Object>())->_matExpr;
	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(matexpr);

	auto wrapped = retval->WrapThis();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::getUMat) {}
POLY_METHOD(Matrix::row) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	auto rowmat = mat->row(info[0]->IntegerValue());

	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(rowmat);

	auto wrapped = retval->WrapThis();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::col) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	auto colmat = mat->col(info[0]->IntegerValue());

	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(colmat);

	auto wrapped = retval->WrapThis();

	info.GetReturnValue().Set(wrapped);

}
POLY_METHOD(Matrix::rowRange_startRow) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	auto rowrange = mat->rowRange(info[0]->IntegerValue(), info[1]->IntegerValue());

	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(rowrange);

	auto wrapped = retval->WrapThis();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::rowRange_range) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	auto range = *Nan::ObjectWrap::Unwrap<Range>(info[0].As<v8::Object>())->_range;
	auto rowrange = mat->rowRange(range);

	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(rowrange);

	auto wrapped = retval->WrapThis();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::colRange_startcol) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	auto colrange = mat->colRange(info[0]->IntegerValue(), info[1]->IntegerValue());

	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(colrange);

	auto wrapped = retval->WrapThis();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::colRange_range) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	auto range = *Nan::ObjectWrap::Unwrap<Range>(info[0].As<v8::Object>())->_range;
	auto colrange = mat->colRange(range);

	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(colrange);

	auto wrapped = retval->WrapThis();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::clone) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;

	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(mat->clone());

	auto wrapped = retval->WrapThis();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::copyTo_outputArray) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	auto outputArray = Nan::ObjectWrap::Unwrap<IOArray>(info[0].As<v8::Object>())->GetOutputArray();
	mat->copyTo(outputArray);

	info.GetReturnValue().SetUndefined();
}
POLY_METHOD(Matrix::copyTo_masked) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	auto outputArray = Nan::ObjectWrap::Unwrap<IOArray>(info[0].As<v8::Object>())->GetOutputArray();
	auto maskArray = Nan::ObjectWrap::Unwrap<IOArray>(info[1].As<v8::Object>())->GetInputArray();
	mat->copyTo(outputArray,maskArray);

	info.GetReturnValue().SetUndefined();
}
POLY_METHOD(Matrix::convertTo) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	auto outputArray = Nan::ObjectWrap::Unwrap<IOArray>(info[0].As<v8::Object>())->GetOutputArray();
	mat->convertTo(outputArray, info[1]->IntegerValue(), info[2]->NumberValue(), info[3]->NumberValue());

	info.GetReturnValue().SetUndefined();
}
POLY_METHOD(Matrix::setTo_inputArray) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	auto inputArray = Nan::ObjectWrap::Unwrap<IOArray>(info[0].As<v8::Object>())->GetInputArray();
	auto maskArray = Nan::ObjectWrap::Unwrap<IOArray>(info[1].As<v8::Object>())->GetInputArray();
	mat->setTo(inputArray, maskArray);
}
POLY_METHOD(Matrix::setTo_scalar) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	auto scalar = *Nan::ObjectWrap::Unwrap<Scalar<cv::Scalar>>(info[0].As<v8::Object>())->_scalar;
	auto maskArray = Nan::ObjectWrap::Unwrap<IOArray>(info[1].As<v8::Object>())->GetInputArray();
	mat->setTo(scalar, maskArray);

	info.GetReturnValue().SetUndefined();
}
POLY_METHOD(Matrix::setTo_int) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	auto scalar = info[0]->IntegerValue();
	auto maskArray = Nan::ObjectWrap::Unwrap<IOArray>(info[1].As<v8::Object>())->GetInputArray();
	mat->setTo(scalar, maskArray);

	info.GetReturnValue().SetUndefined();
}
POLY_METHOD(Matrix::reshape) {
	auto* mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This());

	mat->_mat->reshape(info[0]->IntegerValue(), info[1]->IntegerValue());
}

POLY_METHOD(Matrix::t) {
	auto* mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This());

	auto retval = new MatExpr();
	retval->_matExpr = std::make_shared<cv::MatExpr>(mat->_mat->t());

	auto wrapped = retval->WrapThis();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::inv) {
	auto* mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This());

	auto retval = new MatExpr();
	retval->_matExpr = std::make_shared<cv::MatExpr>(mat->_mat->inv(info[0]->IntegerValue()));

	auto wrapped = retval->WrapThis();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::mul) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	auto inputArray = Nan::ObjectWrap::Unwrap<IOArray>(info[0].As<v8::Object>())->GetInputArray();

	auto retval = mat->mul(inputArray, info[1]->NumberValue());

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(retval);

	auto wrapped = matexpr->WrapThis();
	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::cross) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	auto inputArray = Nan::ObjectWrap::Unwrap<IOArray>(info[0].As<v8::Object>())->GetInputArray();

	auto crossresult = mat->cross(inputArray);

	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(crossresult);
	
	auto wrapped = retval->WrapThis();
	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::dot) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	auto inputArray = Nan::ObjectWrap::Unwrap<IOArray>(info[0].As<v8::Object>())->GetInputArray();

	auto retval = mat->dot(inputArray);
	info.GetReturnValue().Set(retval);
}
POLY_METHOD(Matrix::create_rows_cols_type) {
	auto* mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This());
	
	mat->_mat->create((int)info[0]->IntegerValue(), (int)info[1]->IntegerValue(), (int)info[2]->IntegerValue());

	auto wrapped = mat->WrapThis();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::create_size) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	auto size = *Nan::ObjectWrap::Unwrap<Size<cv::Size>>(info[0].As<v8::Object>())->_size;

	mat->create(size, info[1]->IntegerValue());
}
POLY_METHOD(Matrix::create_matsize) {
}
POLY_METHOD(Matrix::create_ndims_size) {}
POLY_METHOD(Matrix::create_ndims_matsize) {}
POLY_METHOD(Matrix::resize) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	auto scalar = *Nan::ObjectWrap::Unwrap<Scalar<cv::Scalar>>(info[1].As<v8::Object>())->_scalar;

	mat->resize(info[0]->IntegerValue(), scalar);
}
POLY_METHOD(Matrix::roi_rect) {
	//auto mat = *Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	//auto roirect = *Nan::ObjectWrap::Unwrap<Rect<cv::Rect>>(info[0].As<v8::Object>())->_rect;
	//
	//auto roimat = mat(roirect);
	//
	//auto retval = new Matrix();
	//retval->_mat = std::make_shared<cv::Mat>(retval);
	//auto wrapped = retval->WrapThis();
	//
	//info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::roi_ranges) {

}
POLY_METHOD(Matrix::isContinuous) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	info.GetReturnValue().Set(mat->isContinuous());
}
POLY_METHOD(Matrix::elemSize) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	info.GetReturnValue().Set(safe_cast<int>(mat->elemSize()));
}
POLY_METHOD(Matrix::elemSize1) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	info.GetReturnValue().Set(safe_cast<int>(mat->elemSize1()));
}
POLY_METHOD(Matrix::type) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	info.GetReturnValue().Set(mat->type());
}
POLY_METHOD(Matrix::depth) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	info.GetReturnValue().Set(mat->depth());
}
POLY_METHOD(Matrix::channels) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	info.GetReturnValue().Set(mat->channels());
}
POLY_METHOD(Matrix::empty) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	info.GetReturnValue().Set(mat->empty());
}
POLY_METHOD(Matrix::total) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	info.GetReturnValue().Set(safe_cast<int>(mat->total()));
}
POLY_METHOD(Matrix::ptr) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;

	//ptr<T>(T: string, i0?: _st.int /* = 0*/): TrackedPtr<T>;
	auto tptr = new TrackedPtr();
	tptr->_from = mat;
	tptr->_Ttype = *Nan::Utf8String(info[0]);
	tptr->_i0 = safe_cast<int>(info[1]->IntegerValue());

	auto retval = tptr->WrapThis();

	info.GetReturnValue().Set(retval);
}
POLY_METHOD(Matrix::at) {
	//at<T>(T: string, i0 : _st.int, i1 ? : _st.int, i2 ? : _st.int) : TrackedElement<T>;

	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;

	auto tat = new TrackedElement();
	tat->_from = mat;
	tat->_Ttype = *Nan::Utf8String(info[0]);
	tat->_i0 = safe_cast<int>(info[1]->IntegerValue());
	tat->_i1 = safe_cast<int>(info[2]->IntegerValue());
	tat->_i2 = safe_cast<int>(info[3]->IntegerValue());

	auto retval = tat->WrapThis();

	info.GetReturnValue().Set(retval);
}

NAN_PROPERTY_GETTER(Matrix::dims) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	info.GetReturnValue().Set(mat->dims);
}

POLY_METHOD(Matrix::rows) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	info.GetReturnValue().Set(mat->rows);
}
POLY_METHOD(Matrix::cols) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	info.GetReturnValue().Set(mat->cols);
}

static void FreeMatRef(char* data, void* hint) {
	auto mat = (cv::Mat*)hint;
	mat->release();
}

POLY_METHOD(Matrix::data) {
	auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	mat->addref();
	int size = mat->total() * mat->elemSize();
	auto buf = Nan::NewBuffer((char*)mat->data, size, FreeMatRef, (void*)&*mat);

	info.GetReturnValue().Set(buf.ToLocalChecked());
}
POLY_METHOD(Matrix::size) {
	//auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	//mat->size
}

NAN_PROPERTY_GETTER(Matrix::step) {
	//auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	//info.GetReturnValue().Set(mat->step);
}

