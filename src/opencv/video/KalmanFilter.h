#ifndef _ALVISION_KALMANFILTER_H_
#define _ALVISION_KALMANFILTER_H_

#include "../../alvision.h"


class KalmanFilter: public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target);

	std::shared_ptr<cv::KalmanFilter> _kalmanFilter;

	static Nan::Persistent<FunctionTemplate> constructor;
	static NAN_METHOD(New);


};

#endif