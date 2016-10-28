#include "Matrix.h"
#include "Constants.h"

#include "IOArray.h"

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
	overload->addOverloadConstructor("matrix", "Mat", {make_param("rows","int"),make_param("cols","int"),make_param("type","int")}, Matrix::New_rows_cols_type);
	overload->addOverloadConstructor("matrix", "Mat", { make_param("size","Size"),make_param("type","int")}, Matrix::New_size_type);
	overload->addOverloadConstructor("matrix", "Mat", { make_param("rows","int"),make_param("cols","int"),make_param("type","int"),make_param("s","Scalar") }, Matrix::New_rows_cols_type_scalar);
	overload->addOverloadConstructor("matrix", "Mat", { make_param("size","Size"),make_param("type","int"),make_param("s","Scalar") }, Matrix::New_size_type_scalar);
	overload->addOverloadConstructor("matrix", "Mat", { make_param("ndims","int"),make_param("sizes","Array<int>"),make_param("type","int") }, Matrix::New_ndims_sizes_type);
	overload->addOverloadConstructor("matrix", "Mat", { make_param("ndims","int"),make_param("sizes","Array<int>"),make_param("type","int"),make_param("s","Scalar") }, Matrix::New_ndims_sizes_type_scalar);
	overload->addOverloadConstructor("matrix", "Mat", { make_param("m","Mat") }, Matrix::New_mat);
	overload->addOverloadConstructor("matrix", "Mat", { make_param("rows","int"),make_param("cols","int"),make_param("type","int"),make_param("data","Array"),make_param("step","size_t",cv::Mat::AUTO_STEP) }, Matrix::New_rows_cols_type_data_step);
	overload->addOverloadConstructor("matrix", "Mat", { make_param("size","Size"),make_param("type","MatrixType"),make_param("data","Array"),make_param("step","size_t",cv::Mat::AUTO_STEP) }, Matrix::New_size_type_data_step);
	overload->addOverloadConstructor("matrix", "Mat", {make_param("vec","Array"),make_param("copyData","bool",false)}, Matrix::New_array_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param("vec","Vec<>"),make_param("copyData","bool",false) }, Matrix::New_vec_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param("mtx","Matx<>"),make_param("copyData","bool",false) }, Matrix::New_matx_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param("pt","Point_<>"),make_param("copyData","bool",false) }, Matrix::New_point_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param("pt","Point3_<>"),make_param("copyData","bool",false) }, Matrix::New_point3_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param("m","cuda::GpuMat")}, Matrix::New_gpuMat);
	overload->addOverloadConstructor("matrix", "Mat", { make_param("buf","Buffer") }, Matrix::New_buffer);

	//static
	overload->addStaticOverload("matrix", "Mat", "zeros", {make_param("rows","int"),make_param("cols","int"),make_param("type","int")}, Matrix::zeros_rows_cols_type);
	overload->addStaticOverload("matrix", "Mat", "zeros", { make_param("size","Size"),make_param("type","int")}, Matrix::zeros_size_type);
	overload->addStaticOverload("matrix", "Mat", "zeros", { make_param("ndims","int"),make_param("sz","Array<int>"),make_param("type","int") }, Matrix::zeros_ndims_sz_type);
	Nan::SetMethod(ctor, "zeros", matrix_general_callback::callback);

	overload->addStaticOverload("matrix", "Mat", "ones", { make_param("rows","int"),make_param("cols","int"),make_param("type","int") }, Matrix::ones_rows_cols_type);
	overload->addStaticOverload("matrix", "Mat", "ones", { make_param("size","Size"),make_param("type","int") }, Matrix::ones_size_type);
	overload->addStaticOverload("matrix", "Mat", "ones", { make_param("ndims","int"),make_param("sz","Array<int>"), make_param("type","MatrixType") }, Matrix::ones_ndims_sz_type);
	Nan::SetMethod(ctor, "ones", matrix_general_callback::callback);

	overload->addStaticOverload("matrix", "Mat", "eye", { make_param("rows","int"),make_param("cols","int"), make_param("type","int") }, Matrix::eye_rows_cols_type);
	overload->addStaticOverload("matrix", "Mat", "eye", { make_param("size","Size"),make_param("type","int") }, Matrix::eye_size_type);
	Nan::SetMethod(ctor, "eye", matrix_general_callback::callback);

	overload->addStaticOverload("matrix", "Mat", "from", { make_param("m","Mat") }, Matrix::from_mat);
	overload->addStaticOverload("matrix", "Mat", "from", { make_param("expr","MatExpr") }, Matrix::from_matexpr);
	Nan::SetMethod(ctor, "from", matrix_general_callback::callback);

	// Prototype
	overload->add_type_alias("UMatUsageFlags", "int");


	overload->addOverload("matrix", "Mat", "getUMat", { make_param("accessFlags","int"),make_param("usageFlags","UMatUsageFlags",cv::UMatUsageFlags::USAGE_DEFAULT) }, Matrix::getUMat);
	Nan::SetPrototypeMethod(ctor, "getUMat", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "row", { make_param("y","int")}, Matrix::row);
	Nan::SetPrototypeMethod(ctor, "row", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "col", { make_param("x","int") }, Matrix::col);
	Nan::SetPrototypeMethod(ctor, "col", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "rowRange", { make_param("startrow","int"),make_param("endrow","int") }, Matrix::rowRange_startRow);
	overload->addOverload("matrix", "Mat", "rowRange", { make_param("r","Range")}, Matrix::rowRange_range);
	Nan::SetPrototypeMethod(ctor, "rowRange", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "colRange", { make_param("startcol","int"),make_param("endcol","int") }, Matrix::colRange_startcol);
	overload->addOverload("matrix", "Mat", "colRange", { make_param("r","Range") }, Matrix::colRange_range);
	Nan::SetPrototypeMethod(ctor, "colRange", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "clone", { }, Matrix::clone);
	Nan::SetPrototypeMethod(ctor, "clone", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "copyTo", {make_param("m","OutputArray")}, Matrix::copyTo_outputArray);
	overload->addOverload("matrix", "Mat", "copyTo", { make_param("m","OutputArray"),make_param("mask","InputArray") }, Matrix::copyTo_masked);
	Nan::SetPrototypeMethod(ctor, "copyTo", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "convertTo", { make_param("m","OutputArray"),make_param("rtype","int"), make_param("alpha","double",1), make_param("beta","double",0) }, Matrix::convertTo);
	Nan::SetPrototypeMethod(ctor, "convertTo", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "setTo", { make_param("value","InputArray"),make_param("mask","InputArray", IOArray::noArray())}, Matrix::setTo_inputArray);
	overload->addOverload("matrix", "Mat", "setTo", { make_param("value","Scalar"),make_param("mask","InputArray", IOArray::noArray()) }, Matrix::setTo_scalar);
	overload->addOverload("matrix", "Mat", "setTo", { make_param("value","int"),make_param("mask","InputArray", IOArray::noArray()) }, Matrix::setTo_int);
	Nan::SetPrototypeMethod(ctor, "setTo", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "reshape", { make_param("cn","int"),make_param("rows","int", 0) }, Matrix::reshape);
	Nan::SetPrototypeMethod(ctor, "reshape", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "t", {  }, Matrix::t);
	Nan::SetPrototypeMethod(ctor, "t", matrix_general_callback::callback);

	overload->add_type_alias("DecompTypes", "int");

	overload->addOverload("matrix", "Mat", "inv", {make_param("method","DecompTypes",cv::DECOMP_LU)}, Matrix::inv);
	Nan::SetPrototypeMethod(ctor, "inv", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "mul", { make_param("m","InputArray"),make_param("scale","double",1) }, Matrix::mul);
	Nan::SetPrototypeMethod(ctor, "mul", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "cross", { make_param("m","InputArray") }, Matrix::cross);
	Nan::SetPrototypeMethod(ctor, "cross", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "dot", { make_param("m","InputArray") }, Matrix::dot);
	Nan::SetPrototypeMethod(ctor, "dot", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "create", { make_param("rows","int"), make_param("cols","int"), make_param("type","int") }, Matrix::create_rows_cols);
	overload->addOverload("matrix", "Mat", "create", { make_param("size","Size"), make_param("type","int")}, Matrix::create_size);
	overload->addOverload("matrix", "Mat", "create", { make_param("size","MatSize"), make_param("type","int") }, Matrix::create_matsize);
	overload->addOverload("matrix", "Mat", "create", { make_param("ndims","int"), make_param("sizes","Array<int>"), make_param("type","int") }, Matrix::create_ndims_size);
	overload->addOverload("matrix", "Mat", "create", { make_param("ndims","int"), make_param("size","MatSize"), make_param("type","int") }, Matrix::create_ndims_matsize);
	Nan::SetPrototypeMethod(ctor, "create", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "resize", { make_param("sz","size_t"), make_param("s","Scalar", Nan::Null()) }, Matrix::resize);
	Nan::SetPrototypeMethod(ctor, "resize", matrix_general_callback::callback);


	overload->addOverload("matrix", "Mat", "roi", { make_param("roi","Rect")}, Matrix::roi_rect);
	overload->addOverload("matrix", "Mat", "roi", { make_param("ranges","Array<Range>") }, Matrix::roi_ranges);
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

	overload->addOverload("matrix", "Mat", "ptr", {make_param("type","String"),make_param("i0","int",0)}, Matrix::ptr);
	Nan::SetPrototypeMethod(ctor, "ptr", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "at", { make_param("type","String"),make_param("i0","int"),make_param("i1","int",Nan::Null()), make_param("i2","int",Nan::Null()) }, Matrix::at);
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

POLY_METHOD(Matrix::New) {
	
	if (info.This()->InternalFieldCount() == 0)
		Nan::ThrowTypeError("Cannot instantiate without new");

	Matrix *mat = NULL;

	if (info.Length() == 0){
		mat = new Matrix;
	}
	/*else if (info.Length() == 2 && info[0]->IsInt32() && info[1]->IsInt32()){
		mat = new Matrix(info[0]->IntegerValue(), info[1]->IntegerValue());
	}
	else if (info.Length() == 3 && info[0]->IsInt32() && info[1]->IsInt32() && info[2]->IsInt32()) {
		mat = new Matrix(info[0]->IntegerValue(), info[1]->IntegerValue(), info[2]->IntegerValue());
	}*/
	//else { // if (info.Length() == 5) {
	//	Matrix *other = ObjectWrap::Unwrap<Matrix>(info[0]->ToObject());
	//	int x = safe_cast<int>(info[1]->IntegerValue());
	//	int y = safe_cast<int>(info[2]->IntegerValue());
	//	int w = safe_cast<int>(info[3]->IntegerValue());
	//	int h = safe_cast<int>(info[4]->IntegerValue());
	//	mat = new Matrix(other->_mat, cv::Rect(x, y, w, h));
	//}

	if (mat != NULL) {
		mat->Wrap(info.Holder());
		info.Holder()->Set(Nan::New("width").ToLocalChecked(), Nan::New(mat->_mat->cols));
		info.Holder()->Set(Nan::New("height").ToLocalChecked(), Nan::New(mat->_mat->rows));
		info.Holder()->Set(Nan::New("type").ToLocalChecked(), Nan::New(Constants::fromMatType(mat->_mat->type())).ToLocalChecked());
		info.GetReturnValue().Set(info.Holder());
	}

	//TODO: should throw an error
	info.GetReturnValue().SetUndefined();
}

POLY_METHOD(Matrix::New_rows_cols_type) {}
POLY_METHOD(Matrix::New_size_type) {}
POLY_METHOD(Matrix::New_rows_cols_type_scalar) {}
POLY_METHOD(Matrix::New_size_type_scalar) {}
POLY_METHOD(Matrix::New_ndims_sizes_type) {}
POLY_METHOD(Matrix::New_ndims_sizes_type_scalar) {}
POLY_METHOD(Matrix::New_mat) {}
POLY_METHOD(Matrix::New_rows_cols_type_data_step) {}
POLY_METHOD(Matrix::New_size_type_data_step) {}
POLY_METHOD(Matrix::New_array_copyData) {}
POLY_METHOD(Matrix::New_vec_copyData) {}
POLY_METHOD(Matrix::New_matx_copyData) {}
POLY_METHOD(Matrix::New_point_copyData) {}
POLY_METHOD(Matrix::New_point3_copyData) {}
POLY_METHOD(Matrix::New_gpuMat) {}
POLY_METHOD(Matrix::New_buffer) {}
POLY_METHOD(Matrix::zeros_rows_cols_type) {}
POLY_METHOD(Matrix::zeros_size_type) {}
POLY_METHOD(Matrix::zeros_ndims_sz_type) {}
POLY_METHOD(Matrix::ones_rows_cols_type) {}
POLY_METHOD(Matrix::ones_size_type) {}
POLY_METHOD(Matrix::ones_ndims_sz_type) {}
POLY_METHOD(Matrix::eye_rows_cols_type) {}
POLY_METHOD(Matrix::eye_size_type) {}
POLY_METHOD(Matrix::from_mat) {}
POLY_METHOD(Matrix::from_matexpr) {}
POLY_METHOD(Matrix::getUMat) {}
POLY_METHOD(Matrix::row) {}
POLY_METHOD(Matrix::col) {}
POLY_METHOD(Matrix::rowRange_startRow) {}
POLY_METHOD(Matrix::rowRange_range) {}
POLY_METHOD(Matrix::colRange_startcol) {}
POLY_METHOD(Matrix::colRange_range) {}
POLY_METHOD(Matrix::clone) {}
POLY_METHOD(Matrix::copyTo_outputArray) {}
POLY_METHOD(Matrix::copyTo_masked) {}
POLY_METHOD(Matrix::convertTo) {}
POLY_METHOD(Matrix::setTo_inputArray) {}
POLY_METHOD(Matrix::setTo_scalar) {}
POLY_METHOD(Matrix::setTo_int) {}
POLY_METHOD(Matrix::reshape) {}
POLY_METHOD(Matrix::t) {}
POLY_METHOD(Matrix::inv) {}
POLY_METHOD(Matrix::mul) {}
POLY_METHOD(Matrix::cross) {}
POLY_METHOD(Matrix::dot) {}
POLY_METHOD(Matrix::create_rows_cols) {}
POLY_METHOD(Matrix::create_size) {}
POLY_METHOD(Matrix::create_matsize) {}
POLY_METHOD(Matrix::create_ndims_size) {}
POLY_METHOD(Matrix::create_ndims_matsize) {}
POLY_METHOD(Matrix::resize) {}
POLY_METHOD(Matrix::roi_rect) {}
POLY_METHOD(Matrix::roi_ranges) {}
POLY_METHOD(Matrix::isContinuous) {}
POLY_METHOD(Matrix::elemSize) {}
POLY_METHOD(Matrix::elemSize1) {}
POLY_METHOD(Matrix::type) {}
POLY_METHOD(Matrix::depth) {}
POLY_METHOD(Matrix::channels) {}
POLY_METHOD(Matrix::empty) {}
POLY_METHOD(Matrix::total) {}
POLY_METHOD(Matrix::ptr) {}
POLY_METHOD(Matrix::at) {}

NAN_PROPERTY_GETTER(Matrix::dims) {}

POLY_METHOD(Matrix::rows) {}
POLY_METHOD(Matrix::cols) {}
POLY_METHOD(Matrix::data) {}
POLY_METHOD(Matrix::size) {}

NAN_PROPERTY_GETTER(Matrix::step) {}

