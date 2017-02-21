#ifndef _ALVISION_BACKGROUND_SUBTRACTOR_KNN_H_
#define _ALVISION_BACKGROUND_SUBTRACTOR_KNN_H_

#include "../../../alvision.h"
#include "BackgroundSubtractor.h"


class BackgroundSubtractorKNN : public BackgroundSubtractor {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::VideoCapture> _VideoCapture;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


	static POLY_METHOD(New);
	static POLY_METHOD(getHistory);
	static POLY_METHOD(setHistory);
	static POLY_METHOD(getNSamples);
	static POLY_METHOD(setNSamples);
	static POLY_METHOD(getDist2Threshold);
	static POLY_METHOD(setDist2Threshold);
	static POLY_METHOD(getkNNSamples);
	static POLY_METHOD(setkNNSamples);
	static POLY_METHOD(getDetectShadows);
	static POLY_METHOD(setDetectShadows);
	static POLY_METHOD(getShadowValue);
	static POLY_METHOD(setShadowValue);
	static POLY_METHOD(getShadowThreshold);
	static POLY_METHOD(setShadowThreshold);
	static POLY_METHOD(createBackgroundSubtractorKNN);

};

#endif