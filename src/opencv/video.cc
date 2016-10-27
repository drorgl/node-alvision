#include "video.h"


void
video::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	KalmanFilter::Init(target, overload);
};
