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



void VecInit::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
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

	/*TrackedPtr<cv::Vec2b>::Init(target, "TrackedPtr<Vec2b>", overload);
	TrackedPtr<cv::Vec3b>::Init(target, "TrackedPtr<Vec3b>", overload);
	TrackedPtr<cv::Vec4b>::Init(target, "TrackedPtr<Vec4b>", overload);
	TrackedPtr<cv::Vec2s>::Init(target, "TrackedPtr<Vec2s>", overload);
	TrackedPtr<cv::Vec3s>::Init(target, "TrackedPtr<Vec3s>", overload);
	TrackedPtr<cv::Vec4s>::Init(target, "TrackedPtr<Vec4s>", overload);
	TrackedPtr<cv::Vec2w>::Init(target, "TrackedPtr<Vec2w>", overload);
	TrackedPtr<cv::Vec3w>::Init(target, "TrackedPtr<Vec3w>", overload);
	TrackedPtr<cv::Vec4w>::Init(target, "TrackedPtr<Vec4w>", overload);
	TrackedPtr<cv::Vec2i>::Init(target, "TrackedPtr<Vec2i>", overload);
	TrackedPtr<cv::Vec3i>::Init(target, "TrackedPtr<Vec3i>", overload);
	TrackedPtr<cv::Vec4i>::Init(target, "TrackedPtr<Vec4i>", overload);
	TrackedPtr<cv::Vec6i>::Init(target, "TrackedPtr<Vec6i>", overload);
	TrackedPtr<cv::Vec8i>::Init(target, "TrackedPtr<Vec8i>", overload);
	TrackedPtr<cv::Vec2f>::Init(target, "TrackedPtr<Vec2f>", overload);
	TrackedPtr<cv::Vec3f>::Init(target, "TrackedPtr<Vec3f>", overload);
	TrackedPtr<cv::Vec4f>::Init(target, "TrackedPtr<Vec4f>", overload);
	TrackedPtr<cv::Vec6f>::Init(target, "TrackedPtr<Vec6f>", overload);
	TrackedPtr<cv::Vec2d>::Init(target, "TrackedPtr<Vec2d>", overload);
	TrackedPtr<cv::Vec3d>::Init(target, "TrackedPtr<Vec3d>", overload);
	TrackedPtr<cv::Vec4d>::Init(target, "TrackedPtr<Vec4d>", overload);
	TrackedPtr<cv::Vec6d>::Init(target, "TrackedPtr<Vec6d>", overload);*/
}