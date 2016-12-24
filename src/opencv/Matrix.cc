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

	overload->register_type<Matrix>(ctor, "matrix", "Mat");

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
	//TODO: multiple implementations, all vecs, all matxs etc'
	//overload->addOverloadConstructor("matrix", "Mat", {make_param("vec","Array"),make_param<bool>("copyData","bool",false)}, Matrix::New_array_copyData);
	//overload->addOverloadConstructor("matrix", "Mat", { make_param("vec","Vec<>"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_copyData);
	//overload->addOverloadConstructor("matrix", "Mat", { make_param("mtx","Matx<>"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_copyData);
	//overload->addOverloadConstructor("matrix", "Mat", { make_param("pt","Point_<>"),make_param<bool>("copyData","bool",false) }, Matrix::New_point_copyData);
	//overload->addOverloadConstructor("matrix", "Mat", { make_param("pt","Point3_<>"),make_param<bool>("copyData","bool",false) }, Matrix::New_point3_copyData);
	//overload->addOverloadConstructor("matrix", "Mat", { make_param("m","cuda::GpuMat")}, Matrix::New_gpuMat);
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
	mat->_mat = std::make_shared<cv::Mat>(info.at<int>(0),info.at<int>(1),info.at<int>(2));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_size_type) {
	Matrix *mat = new Matrix();
	auto size = info.at<Size<cv::Size>*>(0)->_size;
	
	mat->_mat = std::make_shared<cv::Mat>(*size, info.at<int>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_rows_cols_type_scalar) {
	Matrix *mat = new Matrix();
	auto s = *info.at<Scalar<cv::Scalar>*>(3)->_scalar;

	mat->_mat = std::make_shared<cv::Mat>(info.at<int>(0), info.at<int>(1),info.at<int>(2), s);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_size_type_scalar) {
	Matrix *mat = new Matrix();
	
	auto size = *info.at<Size<cv::Size>*>(0)->_size;
	auto s = *info.at<Scalar<cv::Scalar>*>(2)->_scalar;

	mat->_mat = std::make_shared<cv::Mat>(size, info.at<int>(1), s);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_ndims_sizes_type) {}
POLY_METHOD(Matrix::New_ndims_sizes_type_scalar) {}
POLY_METHOD(Matrix::New_mat) {
	Matrix *mat = new Matrix();
	auto fromMat = *info.at<Matrix*>(0)->_mat;

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
	
	auto res = cv::Mat::zeros(info.at<int>(0), info.at<int>(1), info.at<int>(2));
	retval->_matExpr = std::make_shared<cv::MatExpr>(res);
	
	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::zeros_size_type) {
	auto retval = new MatExpr();
	
	auto size = info.at<Size<cv::Size>*>(0)->_size;

	auto res = cv::Mat::zeros(*size, info.at<int>(1));
	retval->_matExpr = std::make_shared<cv::MatExpr>(res);

	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::zeros_ndims_sz_type) {}
POLY_METHOD(Matrix::ones_rows_cols_type) {
	auto retval = new MatExpr();

	auto res = cv::Mat::ones(info.at<int>(0), info.at<int>(1), info.at<int>(2));
	retval->_matExpr = std::make_shared<cv::MatExpr>(res);

	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::ones_size_type) {
	auto retval = new MatExpr();

	auto size = info.at<Size<cv::Size>*>(0)->_size;

	auto res = cv::Mat::ones(*size, info.at<int>(1));
	retval->_matExpr = std::make_shared<cv::MatExpr>(res);

	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::ones_ndims_sz_type) {}
POLY_METHOD(Matrix::eye_rows_cols_type) {
	auto retval = new MatExpr();

	auto res = cv::Mat::eye(info.at<int>(0), info.at<int>(1), info.at<int>(2));
	retval->_matExpr = std::make_shared<cv::MatExpr>(res);

	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::eye_size_type) {
	auto retval = new MatExpr();

	auto size = info.at<Size<cv::Size>*>(0)->_size;

	auto res = cv::Mat::eye(*size, info.at<int>(1));
	retval->_matExpr = std::make_shared<cv::MatExpr>(res);

	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::from_mat) {}
POLY_METHOD(Matrix::from_matexpr) {
	auto matexpr = *info.at<MatExpr*>(0)->_matExpr;

	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(matexpr);

	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::getUMat) {}
POLY_METHOD(Matrix::row) {
	auto mat = info.This<Matrix*>()->_mat;
	auto rowmat = mat->row(info.at<int>(0));

	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(rowmat);

	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::col) {
	auto mat = info.This<Matrix*>()->_mat;
	auto colmat = mat->col(info.at<int>(0));

	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(colmat);

	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);

}
POLY_METHOD(Matrix::rowRange_startRow) {
	auto mat = info.This<Matrix*>()->_mat;
	auto rowrange = mat->rowRange(info.at<int>(0),info.at<int>(1));

	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(rowrange);

	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::rowRange_range) {
	auto mat = info.This<Matrix*>()->_mat;
	auto range = info.at<Range*>(0);
	auto rowrange = mat->rowRange(*range->_range);

	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(rowrange);

	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::colRange_startcol) {
	auto mat = info.This<Matrix*>()->_mat;
	auto colrange = mat->colRange(info.at<int>(0),info.at<int>(1));

	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(colrange);

	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::colRange_range) {
	auto mat = info.This<Matrix*>()->_mat;
	auto range = info.at<Range*>(0);
	auto colrange = mat->colRange(*range->_range);

	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(colrange);

	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::clone) {
	auto mat = info.This<Matrix*>()->_mat;

	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(mat->clone());

	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::copyTo_outputArray) {
	auto mat = info.This<Matrix*>()->_mat;
	auto outputArray = info.at<IOArray*>(0)->GetOutputArray();
	mat->copyTo(outputArray);

	info.GetReturnValue().SetUndefined();
}
POLY_METHOD(Matrix::copyTo_masked) {
	auto mat = info.This<Matrix*>()->_mat;
	auto outputArray = info.at<IOArray*>(0)->GetOutputArray();
	auto maskArray = info.at<IOArray*>(1)->GetInputArray();
	mat->copyTo(outputArray,maskArray);

	info.GetReturnValue().SetUndefined();
}
POLY_METHOD(Matrix::convertTo) {
	auto mat = info.This<Matrix*>()->_mat;
	auto outputArray = info.at<IOArray*>(0)->GetOutputArray();
	mat->convertTo(outputArray, info.at<double>(1), info.at<double>(2),info.at<double>(3) );

	info.GetReturnValue().SetUndefined();
}
POLY_METHOD(Matrix::setTo_inputArray) {
	auto mat = info.This<Matrix*>()->_mat;
	mat->setTo(info.at<IOArray*>(0)->GetInputArray(), info.at<IOArray*>(1)->GetInputArray());
}
POLY_METHOD(Matrix::setTo_scalar) {
	auto mat = info.This<Matrix*>()->_mat;
	auto scalar = *info.at<Scalar<cv::Scalar>*>(0)->_scalar;
	auto maskArray = info.at<IOArray*>(1)->GetInputArray();
	mat->setTo( scalar, maskArray);

	info.GetReturnValue().SetUndefined();
}
POLY_METHOD(Matrix::setTo_int) {
	auto mat = info.This<Matrix*>()->_mat;
	auto scalar = info.at<int>(0);
	auto maskArray = info.at<IOArray*>(1)->GetInputArray();
	mat->setTo(scalar, maskArray);

	info.GetReturnValue().SetUndefined();
}
POLY_METHOD(Matrix::reshape) {
	auto mat = info.This<Matrix*>();

	mat->_mat->reshape(info.at<int>(0),info.at<int>(1));
}

POLY_METHOD(Matrix::t) {
	auto  mat = info.This<Matrix*>();

	auto retval = new MatExpr();
	retval->_matExpr = std::make_shared<cv::MatExpr>(mat->_mat->t());

	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::inv) {
	auto mat = info.This<Matrix*>();

	auto retval = new MatExpr();
	retval->_matExpr = std::make_shared<cv::MatExpr>(mat->_mat->inv(info.at<int>(0)));

	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::mul) {
	auto mat = info.This<Matrix*>()->_mat;
	auto inputArray = info.at<IOArray*>(0)->GetInputArray();

	auto retval = mat->mul(inputArray, info.at<double>(1));

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(retval);

	auto wrapped = matexpr->Wrap();
	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::cross) {
	auto mat = info.This<Matrix*>()->_mat;
	auto inputArray = info.at<IOArray*>(0)->GetInputArray();

	auto crossresult = mat->cross(inputArray);

	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(crossresult);
	
	auto wrapped = retval->Wrap();
	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::dot) {
	auto mat = info.This<Matrix*>()->_mat;
	auto inputArray = info.at<IOArray*>(0)->GetInputArray();

	auto retval = mat->dot(inputArray);
	info.GetReturnValue().Set(retval);
}
POLY_METHOD(Matrix::create_rows_cols_type) {
	auto mat = info.This<Matrix*>();
	
	mat->_mat->create(info.at<int>(0), info.at<int>(1), info.at<int>(2));

	auto wrapped = mat->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::create_size) {
	auto mat = info.This<Matrix*>()->_mat;
	auto size = *info.at<Size<cv::Size>*>(0)->_size;

	mat->create(size, info.at<int>(1));
}
POLY_METHOD(Matrix::create_matsize) {
}
POLY_METHOD(Matrix::create_ndims_size) {}
POLY_METHOD(Matrix::create_ndims_matsize) {}
POLY_METHOD(Matrix::resize) {
	auto mat = info.This<Matrix*>()->_mat;
	auto scalar = *info.at<Scalar<cv::Scalar>*>(1)->_scalar;

	mat->resize(info.at<int>(0), scalar);
}
POLY_METHOD(Matrix::roi_rect) {
	auto mat = *info.This<Matrix*>()->_mat;
	auto roirect = * info.at<Rect<cv::Rect>*>(0)->_rect;
	
	auto roimat = mat(roirect);
	
	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(roimat);
	//auto wrapped = retval->Wrap();
	
	info.SetReturnValue(retval);
}
POLY_METHOD(Matrix::roi_ranges) {

}
POLY_METHOD(Matrix::isContinuous) {
	auto mat = info.This<Matrix*>()->_mat;
	info.SetReturnValue(mat->isContinuous());
}
POLY_METHOD(Matrix::elemSize) {
	auto mat = info.This<Matrix*>()->_mat;
	info.SetReturnValue(safe_cast<int>(mat->elemSize()));
}
POLY_METHOD(Matrix::elemSize1) {
	auto mat = info.This<Matrix*>()->_mat;
	info.SetReturnValue(safe_cast<int>(mat->elemSize1()));
}
POLY_METHOD(Matrix::type) {
	auto mat = info.This<Matrix*>()->_mat;
	info.SetReturnValue(mat->type());
}
POLY_METHOD(Matrix::depth) {
	auto mat = info.This<Matrix*>()->_mat;
	info.SetReturnValue(mat->depth());
}
POLY_METHOD(Matrix::channels) {
	auto mat = info.This<Matrix*>()->_mat;
	info.GetReturnValue().Set(mat->channels());
}
POLY_METHOD(Matrix::empty) {
	auto mat = info.This<Matrix*>()->_mat;
	info.SetReturnValue(mat->empty());
}
POLY_METHOD(Matrix::total) {
	auto mat = info.This<Matrix*>()->_mat;
	info.SetReturnValue(safe_cast<int>(mat->total()));
}
POLY_METHOD(Matrix::ptr) {
	auto mat = info.This<Matrix*>()->_mat;

	//ptr<T>(T: string, i0?: _st.int /* = 0*/): TrackedPtr<T>;
	auto tptr = new TrackedPtr();
	tptr->_from = mat;
	tptr->_Ttype = info.at<std::string>(0);
	tptr->_i0 = safe_cast<int>(info.at<int>(1));

	info.SetReturnValue(tptr);
}
POLY_METHOD(Matrix::at) {
	//at<T>(T: string, i0 : _st.int, i1 ? : _st.int, i2 ? : _st.int) : TrackedElement<T>;

	auto mat = info.This<Matrix*>()->_mat;

	auto tat = new TrackedElement();
	tat->_from = mat;
	tat->_Ttype = info.at<std::string>(0);
	tat->_i0 = safe_cast<int>(info.at<int>(1));
	tat->_i1 = safe_cast<int>(info.at<int>(2));
	tat->_i2 = safe_cast<int>(info.at<int>(3));

	info.SetReturnValue(tat);
}

NAN_PROPERTY_GETTER(Matrix::dims) {
	auto mat = or ::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	info.GetReturnValue().Set(mat->dims);
}

POLY_METHOD(Matrix::rows) {
	auto mat = info.This<Matrix*>()->_mat;
	info.GetReturnValue().Set(mat->rows);
}
POLY_METHOD(Matrix::cols) {
	auto mat = info.This<Matrix*>()->_mat;
	info.GetReturnValue().Set(mat->cols);
}

static void FreeMatRef(char* data, void* hint) {
	auto mat = (cv::Mat*)hint;
	mat->release();
}

POLY_METHOD(Matrix::data) {
	auto mat = info.This<Matrix*>()->_mat;
	mat->addref();
	int size = mat->total() * mat->elemSize();
	auto buf = Nan::NewBuffer((char*)mat->data, size, FreeMatRef, (void*)&*mat);

	info.GetReturnValue().Set(buf.ToLocalChecked());
}
POLY_METHOD(Matrix::size) {
	//auto mat = info.This<Matrix*>()->_mat;
	//mat->size
}

NAN_PROPERTY_GETTER(Matrix::step) {
	//auto mat = info.This<Matrix*>()->_mat;
	//info.GetReturnValue().Set(mat->step);
}

