#include "video.h"
#include "video/KalmanFilter.h"
#include "video/background_segm.h"

void
video::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	KalmanFilter::Init(target, overload);
	background_segm::Init(target, overload);
};
