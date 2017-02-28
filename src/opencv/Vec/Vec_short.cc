#include "Vec_short.h"
#include "../Vec.imp.h"

void VecShortInit::Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Matx<cv::Vec<short, 1>::mat_type>	::Register(target, "Matx1s", overload);
	Matx<cv::Vec2s::mat_type>			::Register(target, "Matx2s", overload);
	Matx<cv::Vec3s::mat_type>			::Register(target, "Matx3s", overload);
	Matx<cv::Vec4s::mat_type>			::Register(target, "Matx4s", overload);
	Vec<cv::Vec<short, 1>> ::Register(target, "Vec1s", overload);
	Vec<cv::Vec2s>		   ::Register(target, "Vec2s", overload);
	Vec<cv::Vec3s>		   ::Register(target, "Vec3s", overload);
	Vec<cv::Vec4s>		   ::Register(target, "Vec4s", overload);
}

void VecShortInit::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Matx<cv::Vec<short, 1>::mat_type>::Init(target, "Matx1s", overload);
	Matx<cv::Vec2s::mat_type>::Init(target, "Matx2s", overload);
	Matx<cv::Vec3s::mat_type>::Init(target, "Matx3s", overload);
	Matx<cv::Vec4s::mat_type>::Init(target, "Matx4s", overload);
	TrackedPtr<cv::Vec2s::mat_type>::Init(target, "TrackedPtr_Matx_Vec2s", overload);
	TrackedPtr<cv::Vec3s::mat_type>::Init(target, "TrackedPtr_Matx_Vec3s", overload);
	TrackedPtr<cv::Vec4s::mat_type>::Init(target, "TrackedPtr_Matx_Vec4s", overload);
	Vec<cv::Vec<short, 1>>::Init(target, "Vec1s", overload);
	Vec<cv::Vec2s>::Init(target, "Vec2s", overload);
	Vec<cv::Vec3s>::Init(target, "Vec3s", overload);
	Vec<cv::Vec4s>::Init(target, "Vec4s", overload);
	TrackedPtr<cv::Vec2s>::Init(target, "TrackedPtr_Vec2s", overload);
	TrackedPtr<cv::Vec3s>::Init(target, "TrackedPtr_Vec3s", overload);
	TrackedPtr<cv::Vec4s>::Init(target, "TrackedPtr_Vec4s", overload);
	TrackedElement<cv::Vec2s>::Init(target, "TrackedElement_Vec2s", overload);
	TrackedElement<cv::Vec3s>::Init(target, "TrackedElement_Vec3s", overload);
	TrackedElement<cv::Vec4s>::Init(target, "TrackedElement_Vec4s", overload);
}