#ifndef _ALVISION_VEC_H_
#define _ALVISION_VEC_H_

#include "MatxAndVec.h"
#include "Vec.imp.h"

typedef Vec<cv::Vec2b> Vec2b;
typedef Vec<cv::Vec3b> Vec3b;
typedef Vec<cv::Vec4b> Vec4b;
typedef Vec<cv::Vec2s> Vec2s;
typedef Vec<cv::Vec3s> Vec3s;
typedef Vec<cv::Vec4s> Vec4s;
typedef Vec<cv::Vec2w> Vec2w;
typedef Vec<cv::Vec3w> Vec3w;
typedef Vec<cv::Vec4w> Vec4w;
typedef Vec<cv::Vec2i> Vec2i;
typedef Vec<cv::Vec3i> Vec3i;
typedef Vec<cv::Vec4i> Vec4i;
typedef Vec<cv::Vec6i> Vec6i;
typedef Vec<cv::Vec8i> Vec8i;
typedef Vec<cv::Vec2f> Vec2f;
typedef Vec<cv::Vec3f> Vec3f;
typedef Vec<cv::Vec4f> Vec4f;
typedef Vec<cv::Vec6f> Vec6f;
typedef Vec<cv::Vec2d> Vec2d;
typedef Vec<cv::Vec3d> Vec3d;
typedef Vec<cv::Vec4d> Vec4d;
typedef Vec<cv::Vec6d> Vec6d;



namespace VecInit {
	void Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
	void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
}

#endif