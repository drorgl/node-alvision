#ifndef _ALVISION_BACKGROUND_SUBTRACTOR_H_
#define _ALVISION_BACKGROUND_SUBTRACTOR_H_

#include "../../../alvision.h"
#include "../../core/Algorithm.h"


class BackgroundSubtractor : public Algorithm {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::VideoCapture> _VideoCapture;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	static POLY_METHOD(apply);
	static POLY_METHOD(getBackgroundImage);

};

#endif