#ifndef _ALVISION_VIDEOCAPTURE_H_
#define _ALVISION_VIDEOCAPTURE_H_

#include "../../alvision.h"


class VideoCapture : public or ::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::VideoCapture> _VideoCapture;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


	static POLY_METHOD(New);
	static POLY_METHOD(New_filename);
	static POLY_METHOD(New_filename_apiPreference);
	static POLY_METHOD(New_index);
	static POLY_METHOD(open_filename);
	static POLY_METHOD(open_index);
	static POLY_METHOD(isOpened);
	static POLY_METHOD(release);
	static POLY_METHOD(grab);
	static POLY_METHOD(retrieve);
	static POLY_METHOD(read);
	static POLY_METHOD(set);
	static POLY_METHOD(get);
	static POLY_METHOD(open);



};

#endif