#ifndef _ALVISION_RECT_H_
#define _ALVISION_RECT_H_

#include "../../alvision.h"
#include "SizePointRect.h"

typedef Rect_<cv::Rect_<int>> Rect2i;
typedef Rect_<cv::Rect_<float>> Rect2f;
typedef Rect_<cv::Rect_<double>> Rect2d;
typedef Rect2i Rect;


namespace RectInit {
	void Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
	void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
}

#endif