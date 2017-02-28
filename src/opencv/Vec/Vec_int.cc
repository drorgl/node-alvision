#include "Vec_int.h"
#include "../Vec.imp.h"

void VecIntInit::Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Matx<cv::Vec<int, 1>::mat_type>		::Register(target, "Matx1i", overload);
	Matx<cv::Vec2i::mat_type>			::Register(target, "Matx2i", overload);
	Matx<cv::Vec3i::mat_type>			::Register(target, "Matx3i", overload);
	Matx<cv::Vec4i::mat_type>			::Register(target, "Matx4i", overload);
	Matx<cv::Vec6i::mat_type>			::Register(target, "Matx6i", overload);
	Matx<cv::Vec8i::mat_type>			::Register(target, "Matx8i", overload);
	Vec<cv::Vec<int, 1>>   ::Register(target, "Vec1i", overload);
	Vec<cv::Vec2i>		   ::Register(target, "Vec2i", overload);
	Vec<cv::Vec3i>		   ::Register(target, "Vec3i", overload);
	Vec<cv::Vec4i>		   ::Register(target, "Vec4i", overload);
	Vec<cv::Vec6i>		   ::Register(target, "Vec6i", overload);
	Vec<cv::Vec8i>		   ::Register(target, "Vec8i", overload);
}

void VecIntInit::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Matx<cv::Vec<int, 1>::mat_type>::Init(target, "Matx1i", overload);
	Matx<cv::Vec2i::mat_type>::Init(target, "Matx2i", overload);
	Matx<cv::Vec3i::mat_type>::Init(target, "Matx3i", overload);
	Matx<cv::Vec4i::mat_type>::Init(target, "Matx4i", overload);
	Matx<cv::Vec6i::mat_type>::Init(target, "Matx6i", overload);
	Matx<cv::Vec8i::mat_type>::Init(target, "Matx8i", overload);
	TrackedPtr<cv::Vec2i::mat_type>::Init(target, "TrackedPtr_Matx_Vec2i", overload);
	TrackedPtr<cv::Vec3i::mat_type>::Init(target, "TrackedPtr_Matx_Vec3i", overload);
	TrackedPtr<cv::Vec4i::mat_type>::Init(target, "TrackedPtr_Matx_Vec4i", overload);
	TrackedPtr<cv::Vec6i::mat_type>::Init(target, "TrackedPtr_Matx_Vec6i", overload);
	TrackedPtr<cv::Vec8i::mat_type>::Init(target, "TrackedPtr_Matx_Vec8i", overload);
	Vec<cv::Vec<int, 1>>::Init(target, "Vec1i", overload);
	Vec<cv::Vec2i>::Init(target, "Vec2i", overload);
	Vec<cv::Vec3i>::Init(target, "Vec3i", overload);
	Vec<cv::Vec4i>::Init(target, "Vec4i", overload);
	Vec<cv::Vec6i>::Init(target, "Vec6i", overload);
	Vec<cv::Vec8i>::Init(target, "Vec8i", overload);
	TrackedElement<cv::Vec2i>::Init(target, "TrackedElement_Vec2i", overload);
	TrackedElement<cv::Vec3i>::Init(target, "TrackedElement_Vec3i", overload);
	TrackedElement<cv::Vec4i>::Init(target, "TrackedElement_Vec4i", overload);
	TrackedElement<cv::Vec6i>::Init(target, "TrackedElement_Vec6i", overload);
	TrackedElement<cv::Vec8i>::Init(target, "TrackedElement_Vec8i", overload);
	TrackedPtr<cv::Vec2i>::Init(target, "TrackedPtr_Vec2i", overload);
	TrackedPtr<cv::Vec3i>::Init(target, "TrackedPtr_Vec3i", overload);
	TrackedPtr<cv::Vec4i>::Init(target, "TrackedPtr_Vec4i", overload);
	TrackedPtr<cv::Vec6i>::Init(target, "TrackedPtr_Vec6i", overload);
	TrackedPtr<cv::Vec8i>::Init(target, "TrackedPtr_Vec8i", overload);
}