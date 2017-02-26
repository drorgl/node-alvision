#ifndef _ALVISION_SIZE_H_
#define _ALVISION_SIZE_H_

#include "../../alvision.h"
#include "SizePointRect.h"


typedef Size_<cv::Size2i> Size2i;
typedef Size_<cv::Size2f> Size2f;
typedef Size_<cv::Size2d> Size2d;
typedef Size_<cv::Size>   Size;

namespace SizeInit {
	void Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
	void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
}

#endif