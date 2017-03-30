#ifndef _ALVISION_MERGE_MERTENS_H_
#define _ALVISION_MERGE_MERTENS_H_

#include "../../alvision.h"
#include "MergeExposures.h"

class MergeMertens : public MergeExposures {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	static POLY_METHOD(process_times_response);
	static POLY_METHOD(process);
	static POLY_METHOD(getContrastWeight);
	static POLY_METHOD(setContrastWeight);
	static POLY_METHOD(getSaturationWeight);
	static POLY_METHOD(setSaturationWeight);
	static POLY_METHOD(getExposureWeight);
	static POLY_METHOD(setExposureWeight);
	static POLY_METHOD(createMergeMertens);


};

#endif