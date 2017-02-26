#ifndef _ALVISION_MATX_H_
#define _ALVISION_MATX_H_

#include "MatxAndVec.h"
#include "Matx.imp.h"


typedef Matx<cv::Matx12f> Matx12f;
typedef Matx<cv::Matx12d> Matx12d;
typedef Matx<cv::Matx13f> Matx13f;
typedef Matx<cv::Matx13d> Matx13d;
typedef Matx<cv::Matx14f> Matx14f;
typedef Matx<cv::Matx14d> Matx14d;
typedef Matx<cv::Matx16f> Matx16f;
typedef Matx<cv::Matx16d> Matx16d;
typedef Matx<cv::Matx21f> Matx21f;
typedef Matx<cv::Matx21d> Matx21d;
typedef Matx<cv::Matx31f> Matx31f;
typedef Matx<cv::Matx31d> Matx31d;
typedef Matx<cv::Matx41f> Matx41f;
typedef Matx<cv::Matx41d> Matx41d;
typedef Matx<cv::Matx61f> Matx61f;
typedef Matx<cv::Matx61d> Matx61d;
typedef Matx<cv::Matx22f> Matx22f;
typedef Matx<cv::Matx<int,2,2>> Matx22i;
typedef Matx<cv::Matx22d> Matx22d;
typedef Matx<cv::Matx23f> Matx23f;
typedef Matx<cv::Matx23d> Matx23d;
typedef Matx<cv::Matx32f> Matx32f;
typedef Matx<cv::Matx32d> Matx32d;
typedef Matx<cv::Matx33f> Matx33f;
typedef Matx<cv::Matx33d> Matx33d;
typedef Matx<cv::Matx34f> Matx34f;
typedef Matx<cv::Matx34d> Matx34d;
typedef Matx<cv::Matx43f> Matx43f;
typedef Matx<cv::Matx43d> Matx43d;
typedef Matx<cv::Matx44f> Matx44f;
typedef Matx<cv::Matx44d> Matx44d;
typedef Matx<cv::Matx66f> Matx66f;
typedef Matx<cv::Matx66d> Matx66d;




namespace MatxInit {
	void Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
	void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
}


#endif