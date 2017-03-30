#ifndef _ALVISION_ALIGN_MTB_H_
#define _ALVISION_ALIGN_MTB_H_

#include "../../alvision.h"
#include "AlignExposures.h"

class AlignMTB : public AlignExposures {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	static POLY_METHOD(process_times_response);
	static POLY_METHOD(process);
	static POLY_METHOD(calculateShift);
	static POLY_METHOD(shiftMat);
	static POLY_METHOD(computeBitmaps);
	static POLY_METHOD(getMaxBits);
	static POLY_METHOD(setMaxBits);
	static POLY_METHOD(getExcludeRange);
	static POLY_METHOD(setExcludeRange);
	static POLY_METHOD(getCut);
	static POLY_METHOD(setCut);
	static POLY_METHOD(createAlignMTB);


};

#endif