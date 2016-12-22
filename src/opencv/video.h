#ifndef _ALVISION_VIDEO_H_
#define _ALVISION_VIDEO_H_
//#include "OpenCV.h"
#include "../alvision.h"

#include "video/KalmanFilter.h"

class video : public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	

};

#endif