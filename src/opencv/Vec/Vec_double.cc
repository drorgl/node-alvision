#include "Vec_double.h"
#include "../Vec.imp.h"


template<>
POLY_METHOD(Vec<cv::Vec2d>::conj) {
	conj_imp<cv::Vec2d>(info);
}


template<>
POLY_METHOD(Vec<cv::Vec4d>::conj) {
	conj_imp<cv::Vec4d>(info);
}


void VecDoubleInit::Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Matx<cv::Vec<double, 1>::mat_type>	::Register(target, "Matx1d", overload);
	Matx<cv::Vec2d::mat_type>			::Register(target, "Matx2d", overload);
	Matx<cv::Vec3d::mat_type>			::Register(target, "Matx3d", overload);
	Matx<cv::Vec4d::mat_type>			::Register(target, "Matx4d", overload);
	Matx<cv::Vec6d::mat_type>			::Register(target, "Matx6d", overload);
	Vec<cv::Vec<double, 1>>::Register(target, "Vec1d", overload);
	Vec<cv::Vec2d>		   ::Register(target, "Vec2d", overload);
	Vec<cv::Vec3d>		   ::Register(target, "Vec3d", overload);
	Vec<cv::Vec4d>		   ::Register(target, "Vec4d", overload);
	Vec<cv::Vec6d>		   ::Register(target, "Vec6d", overload);
}

void VecDoubleInit::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Matx<cv::Vec<double, 1>::mat_type>::Init(target, "Matx1d", overload);
	Matx<cv::Vec2d::mat_type>::Init(target, "Matx2d", overload);
	Matx<cv::Vec3d::mat_type>::Init(target, "Matx3d", overload);
	Matx<cv::Vec4d::mat_type>::Init(target, "Matx4d", overload);
	Matx<cv::Vec6d::mat_type>::Init(target, "Matx6d", overload);
	TrackedPtr<cv::Vec2d::mat_type>::Init(target, "TrackedPtr_Matx_Vec2d", overload);
	TrackedPtr<cv::Vec3d::mat_type>::Init(target, "TrackedPtr_Matx_Vec3d", overload);
	TrackedPtr<cv::Vec4d::mat_type>::Init(target, "TrackedPtr_Matx_Vec4d", overload);
	TrackedPtr<cv::Vec6d::mat_type>::Init(target, "TrackedPtr_Matx_Vec6d", overload);
	Vec<cv::Vec<double, 1>>::Init(target, "Vec1d", overload);
	Vec<cv::Vec2d>::Init(target, "Vec2d", overload);
	Vec<cv::Vec3d>::Init(target, "Vec3d", overload);
	Vec<cv::Vec4d>::Init(target, "Vec4d", overload);
	Vec<cv::Vec6d>::Init(target, "Vec6d", overload);
	TrackedPtr<cv::Vec2d>::Init(target, "TrackedPtr_Vec2d", overload);
	TrackedPtr<cv::Vec3d>::Init(target, "TrackedPtr_Vec3d", overload);
	TrackedPtr<cv::Vec4d>::Init(target, "TrackedPtr_Vec4d", overload);
	TrackedPtr<cv::Vec6d>::Init(target, "TrackedPtr_Vec6d", overload);
	TrackedElement<cv::Vec2d>::Init(target, "TrackedElement_Vec2d", overload);
	TrackedElement<cv::Vec3d>::Init(target, "TrackedElement_Vec3d", overload);
	TrackedElement<cv::Vec4d>::Init(target, "TrackedElement_Vec4d", overload);
	TrackedElement<cv::Vec6d>::Init(target, "TrackedElement_Vec6d", overload);
}