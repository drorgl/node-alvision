#include "Matx_int.h"
#include "../MatxAndVec.h"
#include "../Matx.imp.h"
#include "../TrackedPtr.h"


void MatxIntInit::Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Matx<cv::Matx<int, 2, 2>>::Register(target, "Matx22i", overload);

}

void MatxIntInit::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Matx<cv::Matx<int, 2, 2>>::Init(target, "Matx22i", overload);
}