#include "video.h"
#include "video/background_segm.h"
#include "video/tracking.h"

void
video::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	tracking::Init(target, overload);
	background_segm::Init(target, overload);
};
