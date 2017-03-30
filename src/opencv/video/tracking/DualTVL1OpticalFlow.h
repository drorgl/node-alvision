#ifndef _ALVISION_DUALTVL1OPTICAL_FLOW_H_
#define _ALVISION_DUALTVL1OPTICAL_FLOW_H_

#include "../../../alvision.h"
#include "DenseOpticalFlow.h"


class DualTVL1OpticalFlow : public DenseOpticalFlow {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


	static POLY_METHOD(New);
	static POLY_METHOD(getTau);
	static POLY_METHOD(setTau);
	static POLY_METHOD(getLambda);
	static POLY_METHOD(setLambda);
	static POLY_METHOD(getTheta);
	static POLY_METHOD(setTheta);
	static POLY_METHOD(getGamma);
	static POLY_METHOD(setGamma);
	static POLY_METHOD(getScalesNumber);
	static POLY_METHOD(setScalesNumber);
	static POLY_METHOD(getWarpingsNumber);
	static POLY_METHOD(setWarpingsNumber);
	static POLY_METHOD(getEpsilon);
	static POLY_METHOD(setEpsilon);
	static POLY_METHOD(getInnerIterations);
	static POLY_METHOD(setInnerIterations);
	static POLY_METHOD(getOuterIterations);
	static POLY_METHOD(setOuterIterations);
	static POLY_METHOD(getUseInitialFlow);
	static POLY_METHOD(setUseInitialFlow);
	static POLY_METHOD(getScaleStep);
	static POLY_METHOD(setScaleStep);
	static POLY_METHOD(getMedianFiltering);
	static POLY_METHOD(setMedianFiltering);
	static POLY_METHOD(createOptFlow_DualTVL1);



};

#endif