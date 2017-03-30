#ifndef _ALVISION_POINT_H_
#define _ALVISION_POINT_H_

#include "../../alvision.h"
#include "SizePointRect.h"



typedef Point_<cv::Point2i> Point2i;
typedef Point_<cv::Point2f> Point2f;
typedef Point_<cv::Point2d> Point2d;
typedef Point2i   Point;

namespace PointInit {
	void Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
	void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
}

#endif