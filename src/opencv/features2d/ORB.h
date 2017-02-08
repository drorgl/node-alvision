#ifndef _ALVISION_ORB_H_
#define _ALVISION_ORB_H_

#include "../../alvision.h"

#include "Feature2D.h"

class ORB : public Feature2D {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


	static POLY_METHOD(create);
	static POLY_METHOD(setMaxFeatures);
	static POLY_METHOD(getMaxFeatures);
	static POLY_METHOD(setScaleFactor);
	static POLY_METHOD(getScaleFactor);
	static POLY_METHOD(setNLevels);
	static POLY_METHOD(getNLevels);
	static POLY_METHOD(setEdgeThreshold);
	static POLY_METHOD(getEdgeThreshold);
	static POLY_METHOD(setFirstLevel);
	static POLY_METHOD(getFirstLevel);
	static POLY_METHOD(setWTA_K);
	static POLY_METHOD(getWTA_K);
	static POLY_METHOD(setScoreType);
	static POLY_METHOD(getScoreType);
	static POLY_METHOD(setPatchSize);
	static POLY_METHOD(getPatchSize);
	static POLY_METHOD(setFastThreshold);
	static POLY_METHOD(getFastThreshold);

};

#endif
