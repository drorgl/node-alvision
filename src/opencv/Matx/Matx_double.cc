#include "Matx_double.h"
#include "../MatxAndVec.h"
#include "../Matx.imp.h"
#include "../TrackedPtr.h"


void MatxDoubleInit::Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Matx<cv::Matx12d>        ::Register(target, "Matx12d", overload);
	Matx<cv::Matx13d>        ::Register(target, "Matx13d", overload);
	Matx<cv::Matx14d>        ::Register(target, "Matx14d", overload);
	Matx<cv::Matx16d>        ::Register(target, "Matx16d", overload);
	Matx<cv::Matx21d>        ::Register(target, "Matx21d", overload);
	Matx<cv::Matx31d>        ::Register(target, "Matx31d", overload);
	Matx<cv::Matx41d>        ::Register(target, "Matx41d", overload);
	Matx<cv::Matx61d>        ::Register(target, "Matx61d", overload);
	Matx<cv::Matx22d>        ::Register(target, "Matx22d", overload);
	Matx<cv::Matx23d>        ::Register(target, "Matx23d", overload);
	Matx<cv::Matx32d>        ::Register(target, "Matx32d", overload);
	Matx<cv::Matx33d>        ::Register(target, "Matx33d", overload);
	Matx<cv::Matx34d>        ::Register(target, "Matx34d", overload);
	Matx<cv::Matx43d>        ::Register(target, "Matx43d", overload);
	Matx<cv::Matx44d>        ::Register(target, "Matx44d", overload);
	Matx<cv::Matx66d>        ::Register(target, "Matx66d", overload);
}

void MatxDoubleInit::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Matx<cv::Matx12d>::Init(target, "Matx12d", overload);
	Matx<cv::Matx13d>::Init(target, "Matx13d", overload);
	Matx<cv::Matx14d>::Init(target, "Matx14d", overload);
	Matx<cv::Matx16d>::Init(target, "Matx16d", overload);
	Matx<cv::Matx21d>::Init(target, "Matx21d", overload);
	Matx<cv::Matx31d>::Init(target, "Matx31d", overload);
	Matx<cv::Matx41d>::Init(target, "Matx41d", overload);
	Matx<cv::Matx61d>::Init(target, "Matx61d", overload);
	Matx<cv::Matx22d>::Init(target, "Matx22d", overload);
	Matx<cv::Matx23d>::Init(target, "Matx23d", overload);
	Matx<cv::Matx32d>::Init(target, "Matx32d", overload);
	Matx<cv::Matx33d>::Init(target, "Matx33d", overload);
	Matx<cv::Matx34d>::Init(target, "Matx34d", overload);
	Matx<cv::Matx43d>::Init(target, "Matx43d", overload);
	Matx<cv::Matx44d>::Init(target, "Matx44d", overload);
	Matx<cv::Matx66d>::Init(target, "Matx66d", overload);

	TrackedPtr<cv::Matx12d>::Init(target, "TrackedPtr_Matx12d", overload);
	TrackedPtr<cv::Matx13d>::Init(target, "TrackedPtr_Matx13d", overload);
	TrackedPtr<cv::Matx14d>::Init(target, "TrackedPtr_Matx14d", overload);
	TrackedPtr<cv::Matx16d>::Init(target, "TrackedPtr_Matx16d", overload);
	TrackedPtr<cv::Matx21d>::Init(target, "TrackedPtr_Matx21d", overload);
	TrackedPtr<cv::Matx31d>::Init(target, "TrackedPtr_Matx31d", overload);
	TrackedPtr<cv::Matx41d>::Init(target, "TrackedPtr_Matx41d", overload);
	TrackedPtr<cv::Matx61d>::Init(target, "TrackedPtr_Matx61d", overload);
	TrackedPtr<cv::Matx22d>::Init(target, "TrackedPtr_Matx22d", overload);
	TrackedPtr<cv::Matx23d>::Init(target, "TrackedPtr_Matx23d", overload);
	TrackedPtr<cv::Matx32d>::Init(target, "TrackedPtr_Matx32d", overload);
	TrackedPtr<cv::Matx33d>::Init(target, "TrackedPtr_Matx33d", overload);
	TrackedPtr<cv::Matx34d>::Init(target, "TrackedPtr_Matx34d", overload);
	TrackedPtr<cv::Matx43d>::Init(target, "TrackedPtr_Matx43d", overload);
	TrackedPtr<cv::Matx44d>::Init(target, "TrackedPtr_Matx44d", overload);
	TrackedPtr<cv::Matx66d>::Init(target, "TrackedPtr_Matx66d", overload);
}