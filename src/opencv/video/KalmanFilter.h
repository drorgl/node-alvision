#ifndef _ALVISION_KALMANFILTER_H_
#define _ALVISION_KALMANFILTER_H_

#include "../../alvision.h"


class KalmanFilter: public overres::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::KalmanFilter> _kalmanFilter;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


	static NAN_METHOD(New);


};

#endif