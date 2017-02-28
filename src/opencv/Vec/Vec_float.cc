#include "Vec_float.h"
#include "../Vec.imp.h"


template<>
POLY_METHOD(Vec<cv::Vec2f>::conj) {
	conj_imp<cv::Vec2f>(info);
}



template<>
POLY_METHOD(Vec<cv::Vec4f>::conj) {
	conj_imp<cv::Vec4f>(info);
}



void VecFloatInit::Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Matx<cv::Vec<float, 1>::mat_type>	::Register(target, "Matx1f", overload);
	Matx<cv::Vec2f::mat_type>			::Register(target, "Matx2f", overload);
	Matx<cv::Vec3f::mat_type>			::Register(target, "Matx3f", overload);
	Matx<cv::Vec4f::mat_type>			::Register(target, "Matx4f", overload);
	Matx<cv::Vec6f::mat_type>			::Register(target, "Matx6f", overload);
	Vec<cv::Vec<float, 1>> ::Register(target, "Vec1f", overload);
	Vec<cv::Vec2f>		   ::Register(target, "Vec2f", overload);
	Vec<cv::Vec3f>		   ::Register(target, "Vec3f", overload);
	Vec<cv::Vec4f>		   ::Register(target, "Vec4f", overload);
	Vec<cv::Vec6f>		   ::Register(target, "Vec6f", overload);
}

void VecFloatInit::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Matx<cv::Vec<float, 1>::mat_type>::Init(target, "Matx1f", overload);
	Matx<cv::Vec2f::mat_type>::Init(target, "Matx2f", overload);
	Matx<cv::Vec3f::mat_type>::Init(target, "Matx3f", overload);
	Matx<cv::Vec4f::mat_type>::Init(target, "Matx4f", overload);
	Matx<cv::Vec6f::mat_type>::Init(target, "Matx6f", overload);
	TrackedPtr<cv::Vec2f::mat_type>::Init(target, "TrackedPtr_Matx_Vec2f", overload);
	TrackedPtr<cv::Vec3f::mat_type>::Init(target, "TrackedPtr_Matx_Vec3f", overload);
	TrackedPtr<cv::Vec4f::mat_type>::Init(target, "TrackedPtr_Matx_Vec4f", overload);
	TrackedPtr<cv::Vec6f::mat_type>::Init(target, "TrackedPtr_Matx_Vec6f", overload);
	Vec<cv::Vec<float, 1>>::Init(target, "Vec1f", overload);
	Vec<cv::Vec2f>::Init(target, "Vec2f", overload);
	Vec<cv::Vec3f>::Init(target, "Vec3f", overload);
	Vec<cv::Vec4f>::Init(target, "Vec4f", overload);
	Vec<cv::Vec6f>::Init(target, "Vec6f", overload);
	TrackedPtr<cv::Vec2f>::Init(target, "TrackedPtr_Vec2f", overload);
	TrackedPtr<cv::Vec3f>::Init(target, "TrackedPtr_Vec3f", overload);
	TrackedPtr<cv::Vec4f>::Init(target, "TrackedPtr_Vec4f", overload);
	TrackedPtr<cv::Vec6f>::Init(target, "TrackedPtr_Vec6f", overload);
	TrackedElement<cv::Vec2f>::Init(target, "TrackedElement_Vec2f", overload);
	TrackedElement<cv::Vec3f>::Init(target, "TrackedElement_Vec3f", overload);
	TrackedElement<cv::Vec4f>::Init(target, "TrackedElement_Vec4f", overload);
	TrackedElement<cv::Vec6f>::Init(target, "TrackedElement_Vec6f", overload);
}