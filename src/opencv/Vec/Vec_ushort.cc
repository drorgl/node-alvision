#include "Vec_ushort.h"
#include "../Vec.imp.h"

void VecUShortInit::Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Matx<cv::Vec<ushort, 1>::mat_type>	::Register(target, "Matx1w", overload);
	Matx<cv::Vec2w::mat_type>			::Register(target, "Matx2w", overload);
	Matx<cv::Vec3w::mat_type>			::Register(target, "Matx3w", overload);
	Matx<cv::Vec4w::mat_type>			::Register(target, "Matx4w", overload);
	Vec<cv::Vec<ushort, 1>>::Register(target, "Vec1w", overload);
	Vec<cv::Vec2w>		   ::Register(target, "Vec2w", overload);
	Vec<cv::Vec3w>		   ::Register(target, "Vec3w", overload);
	Vec<cv::Vec4w>		   ::Register(target, "Vec4w", overload);
}

void VecUShortInit::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Matx<cv::Vec<ushort, 1>::mat_type>::Init(target, "Matx1w", overload);
	Matx<cv::Vec2w::mat_type>::Init(target, "Matx2w", overload);
	Matx<cv::Vec3w::mat_type>::Init(target, "Matx3w", overload);
	Matx<cv::Vec4w::mat_type>::Init(target, "Matx4w", overload);
	TrackedPtr<cv::Vec2w::mat_type>::Init(target, "TrackedPtr_Matx_Vec2w", overload);
	TrackedPtr<cv::Vec3w::mat_type>::Init(target, "TrackedPtr_Matx_Vec3w", overload);
	TrackedPtr<cv::Vec4w::mat_type>::Init(target, "TrackedPtr_Matx_Vec4w", overload);
	Vec<cv::Vec<ushort, 1>>::Init(target, "Vec1w", overload);
	Vec<cv::Vec2w>::Init(target, "Vec2w", overload);
	Vec<cv::Vec3w>::Init(target, "Vec3w", overload);
	Vec<cv::Vec4w>::Init(target, "Vec4w", overload);
	TrackedPtr<cv::Vec2w>::Init(target, "TrackedPtr_Vec2w", overload);
	TrackedPtr<cv::Vec3w>::Init(target, "TrackedPtr_Vec3w", overload);
	TrackedPtr<cv::Vec4w>::Init(target, "TrackedPtr_Vec4w", overload);
	TrackedElement<cv::Vec2w>::Init(target, "TrackedElement_Vec2w", overload);
	TrackedElement<cv::Vec3w>::Init(target, "TrackedElement_Vec3w", overload);
	TrackedElement<cv::Vec4w>::Init(target, "TrackedElement_Vec4w", overload);

}