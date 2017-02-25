#include "Matrix.h"
#include "Constants.h"

#include <iterator>

#include "IOArray.h"
#include "types/Size.h"
#include "types/Scalar.h"
#include "MatExpr.h"
#include "types/Range.h"
#include "types/Rect.h"
#include "TrackedPtr.h"
#include "TrackedElement.h"
#include "Vec.h"
#include "Matx.h"
#include "types/Point.h"
#include "types/Point3.h"

#include "array_accessors/Matrix_array_accessor.h"

namespace matrix_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("matrix_general_callback is empty");
		}
		return overload->execute("matrix", info);
	}
}

Nan::Persistent<FunctionTemplate> Matrix::constructor;

std::string Matrix::name;

void
Matrix::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Matrix::name = "Mat";
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

	overload->register_type<Matrix>(ctor, "mat", "Mat");

	overload->addOverloadConstructor("matrix", "Mat", {}, Matrix::New);
	overload->addOverloadConstructor("matrix", "Mat", {make_param<int>("rows","int"),make_param<int>("cols","int"),make_param<int>("type","int")}, Matrix::New_rows_cols_type);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Size2i*>("size",Size2i::name),make_param<int>("type","int")}, Matrix::New_size_type);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<int>("rows","int"),make_param<int>("cols","int"),make_param<int>("type","int"),make_param<Scalar*>("s","Scalar") }, Matrix::New_rows_cols_type_scalar);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Size2i*>("size",Size2i::name),make_param<int>("type","int"),make_param<Scalar*>("s","Scalar") }, Matrix::New_size_type_scalar);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<int>("ndims","int"),make_param<std::shared_ptr<std::vector<int>>>("sizes","Array<int>"),make_param<int>("type","int") }, Matrix::New_ndims_sizes_type);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<int>("ndims","int"),make_param<std::shared_ptr<std::vector<int>>>("sizes","Array<int>"),make_param<int>("type","int"),make_param<Scalar*>("s","Scalar") }, Matrix::New_ndims_sizes_type_scalar);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matrix*>("m","Mat") }, Matrix::New_mat);
	//TODO: not sure...
	overload->addOverloadConstructor("matrix", "Mat", { make_param<int>("rows","int"),make_param<int>("cols","int"),make_param<int>("type","int"),make_param("data","Array"),make_param<int>("step","size_t",(int)cv::Mat::AUTO_STEP) }, Matrix::New_rows_cols_type_data_step);
	//TODO: not sure...
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Size2i*>("size",Size2i::name),make_param<int>("type","MatrixType"),make_param("data","Array"),make_param<int>("step","size_t",(int)cv::Mat::AUTO_STEP) }, Matrix::New_size_type_data_step);

	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec2b*>("vec","Vec2b"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec2b_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec3b*>("vec","Vec3b"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec3b_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec4b*>("vec","Vec4b"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec4b_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec2s*>("vec","Vec2s"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec2s_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec3s*>("vec","Vec3s"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec3s_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec4s*>("vec","Vec4s"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec4s_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec2w*>("vec","Vec2w"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec2w_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec3w*>("vec","Vec3w"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec3w_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec4w*>("vec","Vec4w"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec4w_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec2i*>("vec","Vec2i"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec2i_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec3i*>("vec","Vec3i"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec3i_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec4i*>("vec","Vec4i"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec4i_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec6i*>("vec","Vec6i"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec6i_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec8i*>("vec","Vec8i"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec8i_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec2f*>("vec","Vec2f"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec2f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec3f*>("vec","Vec3f"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec3f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec4f*>("vec","Vec4f"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec4f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec6f*>("vec","Vec6f"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec6f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec2d*>("vec","Vec2d"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec2d_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec3d*>("vec","Vec3d"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec3d_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec4d*>("vec","Vec4d"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec4d_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Vec6d*>("vec","Vec6d"),make_param<bool>("copyData","bool",false) }, Matrix::New_vec_Vec6d_copyData);

	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx12f*>("mtx","Matx12f"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx12f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx12d*>("mtx","Matx12d"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx12d_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx13f*>("mtx","Matx13f"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx13f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx13d*>("mtx","Matx13d"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx13d_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx14f*>("mtx","Matx14f"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx14f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx14d*>("mtx","Matx14d"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx14d_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx16f*>("mtx","Matx16f"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx16f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx16d*>("mtx","Matx16d"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx16d_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx21f*>("mtx","Matx21f"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx21f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx21d*>("mtx","Matx21d"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx21d_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx31f*>("mtx","Matx31f"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx31f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx31d*>("mtx","Matx31d"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx31d_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx41f*>("mtx","Matx41f"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx41f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx41d*>("mtx","Matx41d"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx41d_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx61f*>("mtx","Matx61f"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx61f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx61d*>("mtx","Matx61d"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx61d_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx22f*>("mtx","Matx22f"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx22f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx22d*>("mtx","Matx22d"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx22d_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx23f*>("mtx","Matx23f"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx23f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx23d*>("mtx","Matx23d"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx23d_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx32f*>("mtx","Matx32f"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx32f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx32d*>("mtx","Matx32d"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx32d_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx33f*>("mtx","Matx33f"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx33f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx33d*>("mtx","Matx33d"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx33d_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx34f*>("mtx","Matx34f"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx34f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx34d*>("mtx","Matx34d"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx34d_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx43f*>("mtx","Matx43f"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx43f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx43d*>("mtx","Matx43d"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx43d_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx44f*>("mtx","Matx44f"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx44f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx44d*>("mtx","Matx44d"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx44d_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx66f*>("mtx","Matx66f"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx66f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Matx66d*>("mtx","Matx66d"),make_param<bool>("copyData","bool",false) }, Matrix::New_matx_Matx66d_copyData);



	overload->addOverloadConstructor("matrix", "Mat", { make_param<Point2i*>("pt","Point2i"),make_param<bool>("copyData","bool",false) }, Matrix::New_point_Point2i_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Point2f*>("pt","Point2f"),make_param<bool>("copyData","bool",false) }, Matrix::New_point_Point2f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Point2d*>("pt","Point2d"),make_param<bool>("copyData","bool",false) }, Matrix::New_point_Point2d_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Point*>("pt","Point"  ),make_param<bool>("copyData","bool",false) }, Matrix::New_point_Point_copyData  );

	overload->addOverloadConstructor("matrix", "Mat", { make_param<Point3i*>("pt","Point3i"),make_param<bool>("copyData","bool",false) }, Matrix::New_point3_Point3i_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Point3f*>("pt","Point3f"),make_param<bool>("copyData","bool",false) }, Matrix::New_point3_Point3f_copyData);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<Point3d*>("pt","Point3d"),make_param<bool>("copyData","bool",false) }, Matrix::New_point3_Point3d_copyData);


	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec2b*>>>("vec","Array<"s + Vec2b::name + ">") }, Matrix::New_vector_Vec2b);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec3b*>>>("vec","Array<"s + Vec3b::name + ">") }, Matrix::New_vector_Vec3b);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec4b*>>>("vec","Array<"s + Vec4b::name + ">") }, Matrix::New_vector_Vec4b);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec2s*>>>("vec","Array<"s + Vec2s::name + ">") }, Matrix::New_vector_Vec2s);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec3s*>>>("vec","Array<"s + Vec3s::name + ">") }, Matrix::New_vector_Vec3s);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec4s*>>>("vec","Array<"s + Vec4s::name + ">") }, Matrix::New_vector_Vec4s);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec2w*>>>("vec","Array<"s + Vec2w::name + ">") }, Matrix::New_vector_Vec2w);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec3w*>>>("vec","Array<"s + Vec3w::name + ">") }, Matrix::New_vector_Vec3w);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec4w*>>>("vec","Array<"s + Vec4w::name + ">") }, Matrix::New_vector_Vec4w);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec2i*>>>("vec","Array<"s + Vec2i::name + ">") }, Matrix::New_vector_Vec2i);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec3i*>>>("vec","Array<"s + Vec3i::name + ">") }, Matrix::New_vector_Vec3i);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec4i*>>>("vec","Array<"s + Vec4i::name + ">") }, Matrix::New_vector_Vec4i);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec6i*>>>("vec","Array<"s + Vec6i::name + ">") }, Matrix::New_vector_Vec6i);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec8i*>>>("vec","Array<"s + Vec8i::name + ">") }, Matrix::New_vector_Vec8i);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec2f*>>>("vec","Array<"s + Vec2f::name + ">") }, Matrix::New_vector_Vec2f);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec3f*>>>("vec","Array<"s + Vec3f::name + ">") }, Matrix::New_vector_Vec3f);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec4f*>>>("vec","Array<"s + Vec4f::name + ">") }, Matrix::New_vector_Vec4f);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec6f*>>>("vec","Array<"s + Vec6f::name + ">") }, Matrix::New_vector_Vec6f);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec2d*>>>("vec","Array<"s + Vec2d::name + ">") }, Matrix::New_vector_Vec2d);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec3d*>>>("vec","Array<"s + Vec3d::name + ">") }, Matrix::New_vector_Vec3d);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec4d*>>>("vec","Array<"s + Vec4d::name + ">") }, Matrix::New_vector_Vec4d);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Vec6d*>>>("vec","Array<"s + Vec6d::name + ">") }, Matrix::New_vector_Vec6d);

	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Point2i*>>>("vec","Array<"s + Point2i::name + ">") }, Matrix::New_vector_Point2i);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Point2f*>>>("vec","Array<"s + Point2f::name + ">") }, Matrix::New_vector_Point2f);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Point2d*>>>("vec","Array<"s + Point2d::name + ">") }, Matrix::New_vector_Point2d);

	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Point3i*>>>("vec","Array<"s + Point3i::name + ">") }, Matrix::New_vector_Point3i);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Point3f*>>>("vec","Array<"s + Point3f::name + ">") }, Matrix::New_vector_Point3f);
	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<Point3d*>>>("vec","Array<"s + Point3d::name + ">") }, Matrix::New_vector_Point3d);


#ifdef HAVE_CUDA
	overload->addOverloadConstructor("matrix", "Mat", { make_param<GpuMat*>("m","cuda::GpuMat")}, Matrix::New_gpuMat);
#endif

	overload->addOverloadConstructor("matrix", "Mat", { make_param<std::shared_ptr<std::vector<uint8_t>>>("buf","Buffer") }, Matrix::New_buffer);

	//static
	overload->addStaticOverload("matrix", "Mat", "zeros", {make_param<int>("rows","int"),make_param<int>("cols","int"),make_param<int>("type","int")}, Matrix::zeros_rows_cols_type);
	overload->addStaticOverload("matrix", "Mat", "zeros", { make_param<Size2i*>("size",Size2i::name),make_param<int>("type","int")}, Matrix::zeros_size_type);
	overload->addStaticOverload("matrix", "Mat", "zeros", { make_param<int>("ndims","int"),make_param<std::shared_ptr<std::vector<int>>>("sz","Array<int>"),make_param<int>("type","int") }, Matrix::zeros_ndims_sz_type);
	Nan::SetMethod(ctor, "zeros", matrix_general_callback::callback);

	overload->addStaticOverload("matrix", "Mat", "ones", { make_param<int>("rows","int"),make_param<int>("cols","int"),make_param<int>("type","int") }, Matrix::ones_rows_cols_type);
	overload->addStaticOverload("matrix", "Mat", "ones", { make_param<Size2i*>("size",Size2i::name),make_param<int>("type","int") }, Matrix::ones_size_type);
	overload->addStaticOverload("matrix", "Mat", "ones", { make_param<int>("ndims","int"),make_param<std::shared_ptr<std::vector<int>>>("sz","Array<int>"), make_param<int>("type","MatrixType") }, Matrix::ones_ndims_sz_type);
	Nan::SetMethod(ctor, "ones", matrix_general_callback::callback);

	overload->addStaticOverload("matrix", "Mat", "eye", { make_param<int>("rows","int"),make_param<int>("cols","int"), make_param<int>("type","int") }, Matrix::eye_rows_cols_type);
	overload->addStaticOverload("matrix", "Mat", "eye", { make_param<Size2i*>("size",Size2i::name),make_param<int>("type","int") }, Matrix::eye_size_type);
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
	overload->addOverload("matrix", "Mat", "setTo", { make_param<Scalar*>("value","Scalar"),make_param<IOArray*>("mask","InputArray", IOArray::noArray()) }, Matrix::setTo_scalar);
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
	overload->addOverload("matrix", "Mat", "create", { make_param<Size2i* >("size",Size2i::name), make_param<int>("type","int")}, Matrix::create_size);
	//TODO: decide on matsize
	//overload->addOverload("matrix", "Mat", "create", { make_param<MatSize*>("size","MatSize"), make_param<int>("type","int") }, Matrix::create_matsize);
	overload->addOverload("matrix", "Mat", "create", { make_param<int>("ndims","int"), make_param<std::shared_ptr<std::vector<int>>>("sizes","Array<int>"), make_param<int>("type","int") }, Matrix::create_ndims_size);
	//TODO: decide on matsize
	//overload->addOverload("matrix", "Mat", "create", { make_param<int>("ndims","int"), make_param<MatSize*>("size","MatSize"), make_param<int>("type","int") }, Matrix::create_ndims_matsize);
	Nan::SetPrototypeMethod(ctor, "create", matrix_general_callback::callback);

	overload->addOverload("matrix", "Mat", "resize", { make_param<int>("sz","size_t"), make_param<Scalar*>("s","Scalar", Nan::Null()) }, Matrix::resize);
	Nan::SetPrototypeMethod(ctor, "resize", matrix_general_callback::callback);


	overload->addOverload("matrix", "Mat", "roi", { make_param<Rect*>("roi",Rect::name)}, Matrix::roi_rect);
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

	overload->addOverload("matrix", "Mat", "ptr", {make_param<std::string>("type","String"),make_param<int>("i0","int",0),make_param<int>("i1","int",0),make_param<int>("i2","int",0) }, Matrix::ptr);
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

	Nan::SetAccessor(itpl, Nan::New("data").ToLocalChecked(), Matrix::data);


	target->Set(Nan::New("Mat").ToLocalChecked(), ctor->GetFunction());

	
};

v8::Local<v8::Function> Matrix::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


cv::_InputArray					Matrix::GetInputArray() {
	return *_mat;
}
cv::_InputArray			Matrix::GetInputArrayOfArrays() {
	return *_mat;
}
cv::_OutputArray					Matrix::GetOutputArray() {
	return *_mat;
}
cv::_OutputArray			Matrix::GetOutputArrayOfArrays() {
	return *_mat;
}
cv::_InputOutputArray			Matrix::GetInputOutputArray() {
	return *_mat;
}
cv::_InputOutputArray	Matrix::GetInputOutputArrayOfArrays() {
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
	auto size = info.at<Size*>(0)->_size;
	
	mat->_mat = std::make_shared<cv::Mat>(*size, info.at<int>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_rows_cols_type_scalar) {
	Matrix *mat = new Matrix();

	auto s = *info.at<Scalar*>(3)->_scalar;

	mat->_mat = std::make_shared<cv::Mat>(info.at<int>(0), info.at<int>(1),info.at<int>(2), s);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_size_type_scalar) {
	Matrix *mat = new Matrix();
	
	auto size = *info.at<Size*>(0)->_size;
	auto s = *info.at<Scalar*>(2)->_scalar;

	mat->_mat = std::make_shared<cv::Mat>(size, info.at<int>(1), s);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_ndims_sizes_type) {
	throw std::exception("not implemented");
}
POLY_METHOD(Matrix::New_ndims_sizes_type_scalar) {
	throw std::exception("not implemented");
}
POLY_METHOD(Matrix::New_mat) {
	Matrix *mat = new Matrix();
	auto fromMat = *info.at<Matrix*>(0)->_mat;

	mat->_mat = std::make_shared<cv::Mat>(fromMat);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_rows_cols_type_data_step) {
	throw std::exception("not implemented");
}
POLY_METHOD(Matrix::New_size_type_data_step) {
	throw std::exception("not implemented");
}
POLY_METHOD(Matrix::New_array_copyData) {
	throw std::exception("not implemented");
}

POLY_METHOD(Matrix::New_vec_Vec2b_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec2b>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_vec_Vec3b_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec3b>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_vec_Vec4b_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec4b>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_vec_Vec2s_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec2s>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_vec_Vec3s_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec3s>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_vec_Vec4s_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec4s>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_vec_Vec2w_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec2w>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_vec_Vec3w_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec3w>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_vec_Vec4w_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec4w>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_vec_Vec2i_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec2i>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_vec_Vec3i_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec3i>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_vec_Vec4i_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec4i>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_vec_Vec6i_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec6i>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_vec_Vec8i_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec8i>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_vec_Vec2f_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec2f>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_vec_Vec3f_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec3f>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_vec_Vec4f_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec4f>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_vec_Vec6f_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec6f>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_vec_Vec2d_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec2d>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_vec_Vec3d_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec3d>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_vec_Vec4d_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec4d>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_vec_Vec6d_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Vec<cv::Vec6d>*>(0)->_vec, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}



POLY_METHOD(Matrix::New_matx_Matx12f_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx12f>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx12d_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx12d>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx13f_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx13f>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx13d_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx13d>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx14f_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx14f>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx14d_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx14d>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx16f_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx16f>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx16d_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx16d>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx21f_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx21f>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx21d_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx21d>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx31f_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx31f>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx31d_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx31d>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx41f_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx41f>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx41d_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx41d>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx61f_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx61f>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx61d_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx61d>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx22f_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx22f>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx22d_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx22d>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx23f_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx23f>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx23d_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx23d>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx32f_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx32f>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx32d_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx32d>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx33f_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx33f>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx33d_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx33d>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx34f_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx34f>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx34d_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx34d>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx43f_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx43f>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx43d_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx43d>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx44f_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx44f>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx44d_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx44d>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx66f_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx66f>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_matx_Matx66d_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Matx<cv::Matx66d>*>(0)->_matx, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}



POLY_METHOD(Matrix::New_point_Point2i_copyData) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Point2i*>(0)->_point, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_point_Point2f_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Point2f*>(0)->_point, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_point_Point2d_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Point2d*>(0)->_point, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_point_Point_copyData  ){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Point*>(0)->_point, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(Matrix::New_point3_Point3i_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Point3i*>(0)->_point3, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_point3_Point3f_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Point3f*>(0)->_point3, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(Matrix::New_point3_Point3d_copyData){
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<Point3d*>(0)->_point3, info.at<bool>(1));
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(Matrix::New_vector_Vec2b){
	typedef typename Vec2b VecCV;
	auto mat = new Matrix();
	
	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });
	

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(Matrix::New_vector_Vec3b){
	typedef typename Vec3b VecCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });


	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());

}


POLY_METHOD(Matrix::New_vector_Vec4b){
	typedef typename Vec4b VecCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });


	mat->_mat = std::make_shared<cv::Mat>(vec_cv);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(Matrix::New_vector_Vec2s){
	typedef typename Vec2s VecCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });


	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(Matrix::New_vector_Vec3s){
	typedef typename Vec3s VecCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}


POLY_METHOD(Matrix::New_vector_Vec4s){
	typedef typename Vec4s VecCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}


POLY_METHOD(Matrix::New_vector_Vec2w){
	typedef typename Vec2w VecCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });


	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}


POLY_METHOD(Matrix::New_vector_Vec3w){
	typedef typename Vec3w VecCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(Matrix::New_vector_Vec4w){
	typedef typename Vec4w VecCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(Matrix::New_vector_Vec2i){
	typedef typename Vec2i VecCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(Matrix::New_vector_Vec3i){
	typedef typename Vec3i VecCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(Matrix::New_vector_Vec4i){
	typedef typename Vec4i VecCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(Matrix::New_vector_Vec6i){
	typedef typename Vec6i VecCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}


POLY_METHOD(Matrix::New_vector_Vec8i){
	typedef typename Vec8i VecCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}


POLY_METHOD(Matrix::New_vector_Vec2f){
	typedef typename Vec2f VecCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}


POLY_METHOD(Matrix::New_vector_Vec3f){
	typedef typename Vec3f VecCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}


POLY_METHOD(Matrix::New_vector_Vec4f){
	typedef typename Vec4f VecCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}


POLY_METHOD(Matrix::New_vector_Vec6f){
	typedef typename Vec6f VecCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}


POLY_METHOD(Matrix::New_vector_Vec2d){
	typedef typename Vec2d VecCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });


	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}


POLY_METHOD(Matrix::New_vector_Vec3d){
	typedef typename Vec3d VecCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(Matrix::New_vector_Vec4d){
	typedef typename Vec4d VecCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(Matrix::New_vector_Vec6d){
	typedef typename Vec6d VecCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<VecCV*>>>(0);
	std::vector<VecCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const VecCV* vec) {return *vec->_vec; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(Matrix::New_vector_Point2i) {
	typedef typename Point2i PointCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<PointCV*>>>(0);
	std::vector<PointCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const PointCV* pt) {return *pt->_point; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(Matrix::New_vector_Point2f){
	typedef typename Point2f PointCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<PointCV*>>>(0);
	std::vector<PointCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const PointCV* pt) {return *pt->_point; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(Matrix::New_vector_Point2d){
	typedef typename Point2d PointCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<PointCV*>>>(0);
	std::vector<PointCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const PointCV* pt) {return *pt->_point; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(Matrix::New_vector_Point3i){
	typedef typename Point3i PointCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<PointCV*>>>(0);
	std::vector<PointCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const PointCV* pt) {return *pt->_point3; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(Matrix::New_vector_Point3f){
	typedef typename Point3f PointCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<PointCV*>>>(0);
	std::vector<PointCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const PointCV* pt) {return *pt->_point3; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(Matrix::New_vector_Point3d){
	typedef typename Point3d PointCV;
	auto mat = new Matrix();

	auto vec = *info.at < std::shared_ptr<std::vector<PointCV*>>>(0);
	std::vector<PointCV::CVT> vec_cv;
	std::transform(std::begin(vec), std::end(vec), std::back_inserter(vec_cv), [](const PointCV* pt) {return *pt->_point3; });

	mat->_mat = std::make_shared<cv::Mat>(vec_cv, true);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}





#ifdef HAVE_CUDA
POLY_METHOD(Matrix::New_gpuMat) {
	auto *mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*info.at<GpuMat*>(0)->_gpumat);
	mat->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
#endif

POLY_METHOD(Matrix::New_buffer) {
	throw std::exception("not implemented");
}
POLY_METHOD(Matrix::zeros_rows_cols_type) {
	auto retval = new MatExpr();
	
	auto res = cv::Mat::zeros(info.at<int>(0), info.at<int>(1), info.at<int>(2));
	retval->_matExpr = std::make_shared<cv::MatExpr>(std::move(res));
	
	info.SetReturnValue(retval);
}
POLY_METHOD(Matrix::zeros_size_type) {
	auto retval = new MatExpr();
	
	auto size = info.at<Size*>(0)->_size;

	auto res = cv::Mat::zeros(*size, info.at<int>(1));
	retval->_matExpr = std::make_shared<cv::MatExpr>(std::move(res));

	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::zeros_ndims_sz_type) {
	throw std::exception("not implemented");
}
POLY_METHOD(Matrix::ones_rows_cols_type) {
	auto retval = new MatExpr();

	auto res = cv::Mat::ones(info.at<int>(0), info.at<int>(1), info.at<int>(2));
	retval->_matExpr = std::make_shared<cv::MatExpr>(std::move(res));

	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::ones_size_type) {
	auto retval = new MatExpr();

	auto size = info.at<Size*>(0)->_size;

	auto res = cv::Mat::ones(*size, info.at<int>(1));
	retval->_matExpr = std::make_shared<cv::MatExpr>(std::move(res));

	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::ones_ndims_sz_type) {
	throw std::exception("not implemented");
}
POLY_METHOD(Matrix::eye_rows_cols_type) {
	auto retval = new MatExpr();

	auto res = cv::Mat::eye(info.at<int>(0), info.at<int>(1), info.at<int>(2));
	retval->_matExpr = std::make_shared<cv::MatExpr>(std::move(res));

	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::eye_size_type) {
	auto retval = new MatExpr();

	auto size = info.at<Size*>(0)->_size;

	auto res = cv::Mat::eye(*size, info.at<int>(1));
	retval->_matExpr = std::make_shared<cv::MatExpr>(std::move(res));

	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::from_mat) {
	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(*info.at<Matrix*>(0)->_mat);
	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::from_matexpr) {
	auto matexpr = *info.at<MatExpr*>(0)->_matExpr;

	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(matexpr);

	auto wrapped = retval->Wrap();

	info.GetReturnValue().Set(wrapped);
}
POLY_METHOD(Matrix::getUMat) {
	throw std::exception("not implemented");
}
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
	mat->convertTo(outputArray, info.at<int>(1), info.at<double>(2),info.at<double>(3) );

	info.GetReturnValue().SetUndefined();
}
POLY_METHOD(Matrix::setTo_inputArray) {
	auto mat = info.This<Matrix*>()->_mat;
	mat->setTo(info.at<IOArray*>(0)->GetInputArray(), info.at<IOArray*>(1)->GetInputArray());
}
POLY_METHOD(Matrix::setTo_scalar) {
	auto mat = info.This<Matrix*>()->_mat;
	auto scalar = *info.at<Scalar*>(0)->_scalar;
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
	auto size = *info.at<Size*>(0)->_size;

	mat->create(size, info.at<int>(1));
}
POLY_METHOD(Matrix::create_matsize) {
	throw std::exception("not implemented");
}
POLY_METHOD(Matrix::create_ndims_size) {
	throw std::exception("not implemented");
}
POLY_METHOD(Matrix::create_ndims_matsize) {
	throw std::exception("not implemented");
}
POLY_METHOD(Matrix::resize) {
	auto mat = info.This<Matrix*>()->_mat;
	auto scalar = *info.at<Scalar*>(1)->_scalar;

	mat->resize(info.at<int>(0), scalar);
}
POLY_METHOD(Matrix::roi_rect) {
	auto mat = *info.This<Matrix*>()->_mat;
	auto roirect = * info.at<Rect*>(0)->_rect;
	
	auto roimat = mat(roirect);
	
	auto retval = new Matrix();
	retval->_mat = std::make_shared<cv::Mat>(roimat);
	//auto wrapped = retval->Wrap();
	
	info.SetReturnValue(retval);
}
POLY_METHOD(Matrix::roi_ranges) {
	throw std::exception("not implemented");
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
	
	auto tptr = new TrackedPtr<Matrix>();
	tptr->_from = std::make_shared<Matrix_array_accessor>( mat, info.at<std::string>(0), info.at<int>(1), info.at<int>(2), info.at<int>(3));
	info.SetReturnValue(tptr);
	//auto xx = cv::InputArray(mat);
	//xx.kind()
}
POLY_METHOD(Matrix::at) {
	auto mat = info.This<Matrix*>()->_mat;

	auto tat = new TrackedElement<Matrix>();
	tat->_from = std::make_shared<Matrix_array_accessor>(mat, info.at<std::string>(0), info.at<int>(1), info.at<int>(2), info.at<int>(3));

	info.SetReturnValue(tat);
}

NAN_PROPERTY_GETTER(Matrix::dims) {
	auto mat = overres::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
	info.GetReturnValue().Set(mat->dims);
}

POLY_METHOD(Matrix::rows) {
	auto mat = info.This<Matrix*>()->_mat;
	info.GetReturnValue().Set(mat->rows);
}
POLY_METHOD(Matrix::cols) {
	auto m = info.This<Matrix*>();
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
	auto mat = info.This<Matrix*>()->_mat;
	
	auto size = new Size();
	size->_size = std::make_shared<cv::Size>(mat->size());
	info.GetReturnValue().Set(size->Wrap());
}

NAN_PROPERTY_GETTER(Matrix::step) {
	auto mat = overres::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;

	auto ret = Nan::New<v8::Array>();
	for (auto i = 0; i < mat->dims; i++) {
		ret->Set(i, Nan::New((int)mat->step[i]));
	}
	info.GetReturnValue().Set(ret);
}

NAN_GETTER(Matrix::data) {
	try {
		auto mat = overres::ObjectWrap::Unwrap<Matrix>(info.This())->_mat;
		uchar depth = mat->depth();
		uchar channels = mat->channels();


		std::unique_ptr<Matrix_array_accessor> accessor;

		if (channels == 1) {
			switch (depth) {
			case CV_8U:
				accessor = std::make_unique<Matrix_array_accessor>(mat, "uchar", 0, 0, 0);
				break;
			case CV_8S:
				accessor = std::make_unique<Matrix_array_accessor>(mat, "schar", 0, 0, 0);
				break;
			case CV_16U:
				accessor = std::make_unique<Matrix_array_accessor>(mat, "ushort", 0, 0, 0);
				break;
			case CV_16S:
				accessor = std::make_unique<Matrix_array_accessor>(mat, "short", 0, 0, 0);
				break;
			case CV_32S:
				accessor = std::make_unique<Matrix_array_accessor>(mat, "int", 0, 0, 0);
				break;
			case CV_32F:
				accessor = std::make_unique<Matrix_array_accessor>(mat, "float", 0, 0, 0);
				break;
			case CV_64F:
				accessor = std::make_unique<Matrix_array_accessor>(mat, "double", 0, 0, 0);
				break;
			default:
				return Nan::ThrowError("unknown mat type");
			}
		}
		else {

			std::string type = "Vec" + std::to_string(channels);

			switch (depth) {
			case CV_8U:
				type += "b";
				break;
			case CV_8S:
				type += "b";
				break;
			case CV_16U:
				type += "w";
				break;
			case CV_16S:
				type += "s";
				break;
			case CV_32S:
				type += "i";
				break;
			case CV_32F:
				type += "f";
				break;
			case CV_64F:
				type += "d";
				break;
			default:
				return Nan::ThrowError("unknown mat type");
			}

			accessor = std::make_unique<Matrix_array_accessor>(mat, type, 0, 0, 0);

		}

		auto vec = Nan::New<v8::Array>();
		for (auto i = 0; i < accessor->length(); i++) {
			vec->Set(i, accessor->get(i));
		}

		info.GetReturnValue().Set(vec);
	}
	catch (std::exception &ex) {
		return Nan::ThrowError(ex.what());
	}
}