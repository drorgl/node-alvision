#include "Vec_uchar.h"
#include "../Vec.imp.h"

void VecUCharInit::Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Matx<cv::Vec<uchar, 1>::mat_type>	::Register(target, "Matx1b", overload);
	Matx<cv::Vec2b::mat_type>			::Register(target, "Matx2b", overload);
	Matx<cv::Vec3b::mat_type>			::Register(target, "Matx3b", overload);
	Matx<cv::Vec4b::mat_type>			::Register(target, "Matx4b", overload);
	Vec<cv::Vec<uchar, 1>> ::Register(target, "Vec1b", overload);
	Vec<cv::Vec2b>		   ::Register(target, "Vec2b", overload);
	Vec<cv::Vec3b>	       ::Register(target, "Vec3b", overload);
	Vec<cv::Vec4b>	       ::Register(target, "Vec4b", overload);
}

void VecUCharInit::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Matx<cv::Vec<uchar, 1>::mat_type>::Init(target, "Matx1b", overload);
	Matx<cv::Vec2b::mat_type>::Init(target, "Matx2b", overload);
	Matx<cv::Vec3b::mat_type>::Init(target, "Matx3b", overload);
	Matx<cv::Vec4b::mat_type>::Init(target, "Matx4b", overload);
	TrackedPtr<cv::Vec2b::mat_type>::Init(target, "TrackedPtr_Matx_Vec2b", overload);
	TrackedPtr<cv::Vec3b::mat_type>::Init(target, "TrackedPtr_Matx_Vec3b", overload);
	TrackedPtr<cv::Vec4b::mat_type>::Init(target, "TrackedPtr_Matx_Vec4b", overload);
	Vec<cv::Vec<uchar, 1>>::Init(target, "Vec1b", overload);
	Vec<cv::Vec2b>::Init(target, "Vec2b", overload);
	Vec<cv::Vec3b>::Init(target, "Vec3b", overload);
	Vec<cv::Vec4b>::Init(target, "Vec4b", overload);
	TrackedPtr<cv::Vec2b>::Init(target, "TrackedPtr_Vec2b", overload);
	TrackedPtr<cv::Vec3b>::Init(target, "TrackedPtr_Vec3b", overload);
	TrackedPtr<cv::Vec4b>::Init(target, "TrackedPtr_Vec4b", overload);
	TrackedElement<cv::Vec2b>::Init(target, "TrackedElement_Vec2b", overload);
	TrackedElement<cv::Vec3b>::Init(target, "TrackedElement_Vec3b", overload);
	TrackedElement<cv::Vec4b>::Init(target, "TrackedElement_Vec4b", overload);
}