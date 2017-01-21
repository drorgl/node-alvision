#ifndef _ALVISION_GENERALIZEDHOUGHBALLARD_H_
#define _ALVISION_GENERALIZEDHOUGHBALLARD_H_

#include "../../alvision.h"
#include "GeneralizedHough.h"

class GeneralizedHoughBallard : public GeneralizedHough {
public:
	static std::string name;

	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();
	
	static POLY_METHOD(setLevels);
	static POLY_METHOD(getLevels);
	static POLY_METHOD(setVotesThreshold);
	static POLY_METHOD(getVotesThreshold);

};
#endif
