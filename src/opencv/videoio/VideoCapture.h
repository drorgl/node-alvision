#ifndef _ALVISION_VIDEOCAPTURE_H_
#define _ALVISION_VIDEOCAPTURE_H_

#include "../../alvision.h"


class VideoCapture: public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target);

	std::shared_ptr<cv::VideoCapture> _VideoCapture;

	static Nan::Persistent<FunctionTemplate> constructor;
	static NAN_METHOD(New);


};

#endif