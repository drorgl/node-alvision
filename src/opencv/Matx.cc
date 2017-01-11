#include "Matx.h"
#include "TrackedPtr.h"

namespace matx_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("matx_general_callback is empty");
		}
		return overload->execute("matx", info);
	}
}

void MatxInit::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Matx<cv::Matx12f>::Init(target, "Matx12f", overload);
	Matx<cv::Matx12d>::Init(target, "Matx12d", overload);
	Matx<cv::Matx13f>::Init(target, "Matx13f", overload);
	Matx<cv::Matx13d>::Init(target, "Matx13d", overload);
	Matx<cv::Matx14f>::Init(target, "Matx14f", overload);
	Matx<cv::Matx14d>::Init(target, "Matx14d", overload);
	Matx<cv::Matx16f>::Init(target, "Matx16f", overload);
	Matx<cv::Matx16d>::Init(target, "Matx16d", overload);
	Matx<cv::Matx21f>::Init(target, "Matx21f", overload);
	Matx<cv::Matx21d>::Init(target, "Matx21d", overload);
	Matx<cv::Matx31f>::Init(target, "Matx31f", overload);
	Matx<cv::Matx31d>::Init(target, "Matx31d", overload);
	Matx<cv::Matx41f>::Init(target, "Matx41f", overload);
	Matx<cv::Matx41d>::Init(target, "Matx41d", overload);
	Matx<cv::Matx61f>::Init(target, "Matx61f", overload);
	Matx<cv::Matx61d>::Init(target, "Matx61d", overload);
	Matx<cv::Matx22f>::Init(target, "Matx22f", overload);
	Matx<cv::Matx22d>::Init(target, "Matx22d", overload);
	Matx<cv::Matx23f>::Init(target, "Matx23f", overload);
	Matx<cv::Matx23d>::Init(target, "Matx23d", overload);
	Matx<cv::Matx32f>::Init(target, "Matx32f", overload);
	Matx<cv::Matx32d>::Init(target, "Matx32d", overload);
	Matx<cv::Matx33f>::Init(target, "Matx33f", overload);
	Matx<cv::Matx33d>::Init(target, "Matx33d", overload);
	Matx<cv::Matx34f>::Init(target, "Matx34f", overload);
	Matx<cv::Matx34d>::Init(target, "Matx34d", overload);
	Matx<cv::Matx43f>::Init(target, "Matx43f", overload);
	Matx<cv::Matx43d>::Init(target, "Matx43d", overload);
	Matx<cv::Matx44f>::Init(target, "Matx44f", overload);
	Matx<cv::Matx44d>::Init(target, "Matx44d", overload);
	Matx<cv::Matx66f>::Init(target, "Matx66f", overload);
	Matx<cv::Matx66d>::Init(target, "Matx66d", overload);

	



	TrackedPtr<cv::Matx12f>::Init(target, "TrackedPtr_Matx12f", overload);
	TrackedPtr<cv::Matx12d>::Init(target, "TrackedPtr_Matx12d", overload);
	TrackedPtr<cv::Matx13f>::Init(target, "TrackedPtr_Matx13f", overload);
	TrackedPtr<cv::Matx13d>::Init(target, "TrackedPtr_Matx13d", overload);
	TrackedPtr<cv::Matx14f>::Init(target, "TrackedPtr_Matx14f", overload);
	TrackedPtr<cv::Matx14d>::Init(target, "TrackedPtr_Matx14d", overload);
	TrackedPtr<cv::Matx16f>::Init(target, "TrackedPtr_Matx16f", overload);
	TrackedPtr<cv::Matx16d>::Init(target, "TrackedPtr_Matx16d", overload);
	TrackedPtr<cv::Matx21f>::Init(target, "TrackedPtr_Matx21f", overload);
	TrackedPtr<cv::Matx21d>::Init(target, "TrackedPtr_Matx21d", overload);
	TrackedPtr<cv::Matx31f>::Init(target, "TrackedPtr_Matx31f", overload);
	TrackedPtr<cv::Matx31d>::Init(target, "TrackedPtr_Matx31d", overload);
	TrackedPtr<cv::Matx41f>::Init(target, "TrackedPtr_Matx41f", overload);
	TrackedPtr<cv::Matx41d>::Init(target, "TrackedPtr_Matx41d", overload);
	TrackedPtr<cv::Matx61f>::Init(target, "TrackedPtr_Matx61f", overload);
	TrackedPtr<cv::Matx61d>::Init(target, "TrackedPtr_Matx61d", overload);
	TrackedPtr<cv::Matx22f>::Init(target, "TrackedPtr_Matx22f", overload);
	TrackedPtr<cv::Matx22d>::Init(target, "TrackedPtr_Matx22d", overload);
	TrackedPtr<cv::Matx23f>::Init(target, "TrackedPtr_Matx23f", overload);
	TrackedPtr<cv::Matx23d>::Init(target, "TrackedPtr_Matx23d", overload);
	TrackedPtr<cv::Matx32f>::Init(target, "TrackedPtr_Matx32f", overload);
	TrackedPtr<cv::Matx32d>::Init(target, "TrackedPtr_Matx32d", overload);
	TrackedPtr<cv::Matx33f>::Init(target, "TrackedPtr_Matx33f", overload);
	TrackedPtr<cv::Matx33d>::Init(target, "TrackedPtr_Matx33d", overload);
	TrackedPtr<cv::Matx34f>::Init(target, "TrackedPtr_Matx34f", overload);
	TrackedPtr<cv::Matx34d>::Init(target, "TrackedPtr_Matx34d", overload);
	TrackedPtr<cv::Matx43f>::Init(target, "TrackedPtr_Matx43f", overload);
	TrackedPtr<cv::Matx43d>::Init(target, "TrackedPtr_Matx43d", overload);
	TrackedPtr<cv::Matx44f>::Init(target, "TrackedPtr_Matx44f", overload);
	TrackedPtr<cv::Matx44d>::Init(target, "TrackedPtr_Matx44d", overload);
	TrackedPtr<cv::Matx66f>::Init(target, "TrackedPtr_Matx66f", overload);
	TrackedPtr<cv::Matx66d>::Init(target, "TrackedPtr_Matx66d", overload);
}