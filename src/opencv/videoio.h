#ifndef _ALVISION_VIDEOIO_H_
#define _ALVISION_VIDEOIO_H_
//#include "OpenCV.h"
#include "../alvision.h"

#include "videoio/VideoCapture.h"
#include "videoio/VideoWriter.h"


class videoio : public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);


};

#endif