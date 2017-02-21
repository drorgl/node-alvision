#ifndef _ALVISION_BACKGROUND_SUBTRACTOR_MOG2_H_
#define _ALVISION_BACKGROUND_SUBTRACTOR_MOG2_H_

#include "../../../alvision.h"
#include "BackgroundSubtractor.h"

class BackgroundSubtractorMOG2 : public BackgroundSubtractor {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::VideoCapture> _VideoCapture;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


	static POLY_METHOD(New);
	static POLY_METHOD(getHistory);
	static POLY_METHOD(setHistory);
	static POLY_METHOD(getNMixtures);
	static POLY_METHOD(setNMixtures);
	static POLY_METHOD(getBackgroundRatio);
	static POLY_METHOD(setBackgroundRatio);
	static POLY_METHOD(getVarThreshold);
	static POLY_METHOD(setVarThreshold);
	static POLY_METHOD(getVarThresholdGen);
	static POLY_METHOD(setVarThresholdGen);
	static POLY_METHOD(getVarInit);
	static POLY_METHOD(setVarInit);
	static POLY_METHOD(getVarMin);
	static POLY_METHOD(setVarMin);
	static POLY_METHOD(getVarMax);
	static POLY_METHOD(setVarMax);
	static POLY_METHOD(getComplexityReductionThreshold);
	static POLY_METHOD(setComplexityReductionThreshold);
	static POLY_METHOD(getDetectShadows);
	static POLY_METHOD(setDetectShadows);
	static POLY_METHOD(getShadowValue);
	static POLY_METHOD(setShadowValue);
	static POLY_METHOD(getShadowThreshold);
	static POLY_METHOD(setShadowThreshold);
	static POLY_METHOD(createBackgroundSubtractorMOG2);



};

#endif