#ifndef _ALVISION_KALMANFILTER_H_
#define _ALVISION_KALMANFILTER_H_

#include "../../../alvision.h"


class KalmanFilter : public overres::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::KalmanFilter> _kalmanFilter;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


	static POLY_METHOD(New);

	static POLY_METHOD(New_params);
	static POLY_METHOD(init);
	static POLY_METHOD(predict);
	static POLY_METHOD(correct);


	static NAN_GETTER(statePre_getter);
	static NAN_SETTER(statePre_setter);
	static NAN_GETTER(statePost_getter);
	static NAN_SETTER(statePost_setter);
	static NAN_GETTER(transitionMatrix_getter);
	static NAN_SETTER(transitionMatrix_setter);
	static NAN_GETTER(controlMatrix_getter);
	static NAN_SETTER(controlMatrix_setter);
	static NAN_GETTER(measurementMatrix_getter);
	static NAN_SETTER(measurementMatrix_setter);
	static NAN_GETTER(processNoiseCov_getter);
	static NAN_SETTER(processNoiseCov_setter);
	static NAN_GETTER(measurementNoiseCov_getter);
	static NAN_SETTER(measurementNoiseCov_setter);
	static NAN_GETTER(errorCovPre_getter);
	static NAN_SETTER(errorCovPre_setter);
	static NAN_GETTER(gain_getter);
	static NAN_SETTER(gain_setter);
	static NAN_GETTER(errorCovPost_getter );
	static NAN_SETTER(errorCovPost_setter);

};

#endif