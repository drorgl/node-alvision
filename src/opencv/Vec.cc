#include "Vec.h"

namespace vec_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("vec_general_callback is empty");
		}
		return overload->execute("vec", info);
	}
}

template<>
POLY_METHOD(Vec<cv::Vec2f>::conj) {
	conj_imp<cv::Vec2f>(info);
}

template<>
POLY_METHOD(Vec<cv::Vec2d>::conj) {
	conj_imp<cv::Vec2d>(info);
}

template<>
POLY_METHOD(Vec<cv::Vec4f>::conj) {
	conj_imp<cv::Vec4f>(info);
}

template<>
POLY_METHOD(Vec<cv::Vec4d>::conj) {
	conj_imp<cv::Vec4d>(info);
}


void VecInit::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	//Matx bases
	Matx<cv::Vec2b::mat_type>::Init(target, "Matx2b", overload);
	Matx<cv::Vec3b::mat_type>::Init(target, "Matx3b", overload);
	Matx<cv::Vec4b::mat_type>::Init(target, "Matx4b", overload);
	Matx<cv::Vec2s::mat_type>::Init(target, "Matx2s", overload);
	Matx<cv::Vec3s::mat_type>::Init(target, "Matx3s", overload);
	Matx<cv::Vec4s::mat_type>::Init(target, "Matx4s", overload);
	Matx<cv::Vec2w::mat_type>::Init(target, "Matx2w", overload);
	Matx<cv::Vec3w::mat_type>::Init(target, "Matx3w", overload);
	Matx<cv::Vec4w::mat_type>::Init(target, "Matx4w", overload);
	Matx<cv::Vec2i::mat_type>::Init(target, "Matx2i", overload);
	Matx<cv::Vec3i::mat_type>::Init(target, "Matx3i", overload);
	Matx<cv::Vec4i::mat_type>::Init(target, "Matx4i", overload);
	Matx<cv::Vec6i::mat_type>::Init(target, "Matx6i", overload);
	Matx<cv::Vec8i::mat_type>::Init(target, "Matx8i", overload);
	Matx<cv::Vec2f::mat_type>::Init(target, "Matx2f", overload);
	Matx<cv::Vec3f::mat_type>::Init(target, "Matx3f", overload);
	Matx<cv::Vec4f::mat_type>::Init(target, "Matx4f", overload);
	Matx<cv::Vec6f::mat_type>::Init(target, "Matx6f", overload);
	Matx<cv::Vec2d::mat_type>::Init(target, "Matx2d", overload);
	Matx<cv::Vec3d::mat_type>::Init(target, "Matx3d", overload);
	Matx<cv::Vec4d::mat_type>::Init(target, "Matx4d", overload);
	Matx<cv::Vec6d::mat_type>::Init(target, "Matx6d", overload);

	TrackedPtr<cv::Vec2b::mat_type>::Init(target, "TrackedPtr_Matx_Vec2b", overload);
	TrackedPtr<cv::Vec3b::mat_type>::Init(target, "TrackedPtr_Matx_Vec3b", overload);
	TrackedPtr<cv::Vec4b::mat_type>::Init(target, "TrackedPtr_Matx_Vec4b", overload);
	TrackedPtr<cv::Vec2s::mat_type>::Init(target, "TrackedPtr_Matx_Vec2s", overload);
	TrackedPtr<cv::Vec3s::mat_type>::Init(target, "TrackedPtr_Matx_Vec3s", overload);
	TrackedPtr<cv::Vec4s::mat_type>::Init(target, "TrackedPtr_Matx_Vec4s", overload);
	TrackedPtr<cv::Vec2w::mat_type>::Init(target, "TrackedPtr_Matx_Vec2w", overload);
	TrackedPtr<cv::Vec3w::mat_type>::Init(target, "TrackedPtr_Matx_Vec3w", overload);
	TrackedPtr<cv::Vec4w::mat_type>::Init(target, "TrackedPtr_Matx_Vec4w", overload);
	TrackedPtr<cv::Vec2i::mat_type>::Init(target, "TrackedPtr_Matx_Vec2i", overload);
	TrackedPtr<cv::Vec3i::mat_type>::Init(target, "TrackedPtr_Matx_Vec3i", overload);
	TrackedPtr<cv::Vec4i::mat_type>::Init(target, "TrackedPtr_Matx_Vec4i", overload);
	TrackedPtr<cv::Vec6i::mat_type>::Init(target, "TrackedPtr_Matx_Vec6i", overload);
	TrackedPtr<cv::Vec8i::mat_type>::Init(target, "TrackedPtr_Matx_Vec8i", overload);
	TrackedPtr<cv::Vec2f::mat_type>::Init(target, "TrackedPtr_Matx_Vec2f", overload);
	TrackedPtr<cv::Vec3f::mat_type>::Init(target, "TrackedPtr_Matx_Vec3f", overload);
	TrackedPtr<cv::Vec4f::mat_type>::Init(target, "TrackedPtr_Matx_Vec4f", overload);
	TrackedPtr<cv::Vec6f::mat_type>::Init(target, "TrackedPtr_Matx_Vec6f", overload);
	TrackedPtr<cv::Vec2d::mat_type>::Init(target, "TrackedPtr_Matx_Vec2d", overload);
	TrackedPtr<cv::Vec3d::mat_type>::Init(target, "TrackedPtr_Matx_Vec3d", overload);
	TrackedPtr<cv::Vec4d::mat_type>::Init(target, "TrackedPtr_Matx_Vec4d", overload);
	TrackedPtr<cv::Vec6d::mat_type>::Init(target, "TrackedPtr_Matx_Vec6d", overload);




	Vec<cv::Vec2b>::Init(target, "Vec2b", overload);
	Vec<cv::Vec3b>::Init(target, "Vec3b", overload);
	Vec<cv::Vec4b>::Init(target, "Vec4b", overload);
	Vec<cv::Vec2s>::Init(target, "Vec2s", overload);
	Vec<cv::Vec3s>::Init(target, "Vec3s", overload);
	Vec<cv::Vec4s>::Init(target, "Vec4s", overload);
	Vec<cv::Vec2w>::Init(target, "Vec2w", overload);
	Vec<cv::Vec3w>::Init(target, "Vec3w", overload);
	Vec<cv::Vec4w>::Init(target, "Vec4w", overload);
	Vec<cv::Vec2i>::Init(target, "Vec2i", overload);
	Vec<cv::Vec3i>::Init(target, "Vec3i", overload);
	Vec<cv::Vec4i>::Init(target, "Vec4i", overload);
	Vec<cv::Vec6i>::Init(target, "Vec6i", overload);
	Vec<cv::Vec8i>::Init(target, "Vec8i", overload);
	Vec<cv::Vec2f>::Init(target, "Vec2f", overload);
	Vec<cv::Vec3f>::Init(target, "Vec3f", overload);
	Vec<cv::Vec4f>::Init(target, "Vec4f", overload);
	Vec<cv::Vec6f>::Init(target, "Vec6f", overload);
	Vec<cv::Vec2d>::Init(target, "Vec2d", overload);
	Vec<cv::Vec3d>::Init(target, "Vec3d", overload);
	Vec<cv::Vec4d>::Init(target, "Vec4d", overload);
	Vec<cv::Vec6d>::Init(target, "Vec6d", overload);

	TrackedPtr<cv::Vec2b>::Init(target, "TrackedPtr_Vec2b", overload);
	TrackedPtr<cv::Vec3b>::Init(target, "TrackedPtr_Vec3b", overload);
	TrackedPtr<cv::Vec4b>::Init(target, "TrackedPtr_Vec4b", overload);
	TrackedPtr<cv::Vec2s>::Init(target, "TrackedPtr_Vec2s", overload);
	TrackedPtr<cv::Vec3s>::Init(target, "TrackedPtr_Vec3s", overload);
	TrackedPtr<cv::Vec4s>::Init(target, "TrackedPtr_Vec4s", overload);
	TrackedPtr<cv::Vec2w>::Init(target, "TrackedPtr_Vec2w", overload);
	TrackedPtr<cv::Vec3w>::Init(target, "TrackedPtr_Vec3w", overload);
	TrackedPtr<cv::Vec4w>::Init(target, "TrackedPtr_Vec4w", overload);
	TrackedPtr<cv::Vec2i>::Init(target, "TrackedPtr_Vec2i", overload);
	TrackedPtr<cv::Vec3i>::Init(target, "TrackedPtr_Vec3i", overload);
	TrackedPtr<cv::Vec4i>::Init(target, "TrackedPtr_Vec4i", overload);
	TrackedPtr<cv::Vec6i>::Init(target, "TrackedPtr_Vec6i", overload);
	TrackedPtr<cv::Vec8i>::Init(target, "TrackedPtr_Vec8i", overload);
	TrackedPtr<cv::Vec2f>::Init(target, "TrackedPtr_Vec2f", overload);
	TrackedPtr<cv::Vec3f>::Init(target, "TrackedPtr_Vec3f", overload);
	TrackedPtr<cv::Vec4f>::Init(target, "TrackedPtr_Vec4f", overload);
	TrackedPtr<cv::Vec6f>::Init(target, "TrackedPtr_Vec6f", overload);
	TrackedPtr<cv::Vec2d>::Init(target, "TrackedPtr_Vec2d", overload);
	TrackedPtr<cv::Vec3d>::Init(target, "TrackedPtr_Vec3d", overload);
	TrackedPtr<cv::Vec4d>::Init(target, "TrackedPtr_Vec4d", overload);
	TrackedPtr<cv::Vec6d>::Init(target, "TrackedPtr_Vec6d", overload);



}