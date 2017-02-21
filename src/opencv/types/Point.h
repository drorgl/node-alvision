#ifndef _ALVISION_POINT_H_
#define _ALVISION_POINT_H_

#include "../../alvision.h"
#include "SizePointRect.h"



typedef typename Point_<cv::Point2i> Point2i;
typedef typename Point_<cv::Point2f> Point2f;
typedef typename Point_<cv::Point2d> Point2d;
typedef typename Point2i   Point;

namespace PointInit {
	void Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
	void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
}

#endif