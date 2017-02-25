#ifndef _ALVISION_VIDEOWRITER_H_
#define _ALVISION_VIDEOWRITER_H_

#include "../../alvision.h"


class VideoWriter : public overres::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::VideoWriter> _videoWriter;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


	static POLY_METHOD(New);
	static POLY_METHOD(New_filename);
	static POLY_METHOD(fourcc);
	static POLY_METHOD(isOpened);
	static POLY_METHOD(release);
	static POLY_METHOD(write);
	static POLY_METHOD(set);
	static POLY_METHOD(get);



};

#endif