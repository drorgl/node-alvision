#include "Matx_float.h"
#include "../MatxAndVec.h"
#include "../Matx.imp.h"
#include "../TrackedPtr.h"


void MatxFloatInit::Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Matx<cv::Matx12f>        ::Register(target, "Matx12f", overload);
	Matx<cv::Matx13f>        ::Register(target, "Matx13f", overload);
	Matx<cv::Matx14f>        ::Register(target, "Matx14f", overload);
	Matx<cv::Matx16f>        ::Register(target, "Matx16f", overload);
	Matx<cv::Matx21f>        ::Register(target, "Matx21f", overload);
	Matx<cv::Matx31f>        ::Register(target, "Matx31f", overload);
	Matx<cv::Matx41f>        ::Register(target, "Matx41f", overload);
	Matx<cv::Matx61f>        ::Register(target, "Matx61f", overload);
	Matx<cv::Matx22f>        ::Register(target, "Matx22f", overload);
	Matx<cv::Matx23f>        ::Register(target, "Matx23f", overload);
	Matx<cv::Matx32f>        ::Register(target, "Matx32f", overload);
	Matx<cv::Matx33f>        ::Register(target, "Matx33f", overload);
	Matx<cv::Matx34f>        ::Register(target, "Matx34f", overload);
	Matx<cv::Matx43f>        ::Register(target, "Matx43f", overload);
	Matx<cv::Matx44f>        ::Register(target, "Matx44f", overload);
	Matx<cv::Matx66f>        ::Register(target, "Matx66f", overload);
}

void MatxFloatInit::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Matx<cv::Matx12f>::Init(target, "Matx12f", overload);
	Matx<cv::Matx13f>::Init(target, "Matx13f", overload);
	Matx<cv::Matx14f>::Init(target, "Matx14f", overload);
	Matx<cv::Matx16f>::Init(target, "Matx16f", overload);
	Matx<cv::Matx21f>::Init(target, "Matx21f", overload);
	Matx<cv::Matx31f>::Init(target, "Matx31f", overload);
	Matx<cv::Matx41f>::Init(target, "Matx41f", overload);
	Matx<cv::Matx61f>::Init(target, "Matx61f", overload);
	Matx<cv::Matx22f>::Init(target, "Matx22f", overload);
	Matx<cv::Matx23f>::Init(target, "Matx23f", overload);
	Matx<cv::Matx32f>::Init(target, "Matx32f", overload);
	Matx<cv::Matx33f>::Init(target, "Matx33f", overload);
	Matx<cv::Matx34f>::Init(target, "Matx34f", overload);
	Matx<cv::Matx43f>::Init(target, "Matx43f", overload);
	Matx<cv::Matx44f>::Init(target, "Matx44f", overload);
	Matx<cv::Matx66f>::Init(target, "Matx66f", overload);

	TrackedPtr<cv::Matx12f>::Init(target, "TrackedPtr_Matx12f", overload);
	TrackedPtr<cv::Matx13f>::Init(target, "TrackedPtr_Matx13f", overload);
	TrackedPtr<cv::Matx14f>::Init(target, "TrackedPtr_Matx14f", overload);
	TrackedPtr<cv::Matx16f>::Init(target, "TrackedPtr_Matx16f", overload);
	TrackedPtr<cv::Matx21f>::Init(target, "TrackedPtr_Matx21f", overload);
	TrackedPtr<cv::Matx31f>::Init(target, "TrackedPtr_Matx31f", overload);
	TrackedPtr<cv::Matx41f>::Init(target, "TrackedPtr_Matx41f", overload);
	TrackedPtr<cv::Matx61f>::Init(target, "TrackedPtr_Matx61f", overload);
	TrackedPtr<cv::Matx22f>::Init(target, "TrackedPtr_Matx22f", overload);
	TrackedPtr<cv::Matx23f>::Init(target, "TrackedPtr_Matx23f", overload);
	TrackedPtr<cv::Matx32f>::Init(target, "TrackedPtr_Matx32f", overload);
	TrackedPtr<cv::Matx33f>::Init(target, "TrackedPtr_Matx33f", overload);
	TrackedPtr<cv::Matx34f>::Init(target, "TrackedPtr_Matx34f", overload);
	TrackedPtr<cv::Matx43f>::Init(target, "TrackedPtr_Matx43f", overload);
	TrackedPtr<cv::Matx44f>::Init(target, "TrackedPtr_Matx44f", overload);
	TrackedPtr<cv::Matx66f>::Init(target, "TrackedPtr_Matx66f", overload);
}