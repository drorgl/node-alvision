#ifndef _ALVISION_VIDEOWRITER_H_
#define _ALVISION_VIDEOWRITER_H_

#include "../../alvision.h"


class VideoWriter: public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target);

	std::shared_ptr<cv::VideoWriter> _videoWriter;

	static Nan::Persistent<FunctionTemplate> constructor;
	static NAN_METHOD(New);



};

#endif