#ifndef _ALVISION_MERGE_DEBEVEC_H_
#define _ALVISION_MERGE_DEBEVEC_H_

#include "../../alvision.h"
#include "MergeExposures.h"

class MergeDebevec : public MergeExposures {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	static POLY_METHOD(process_response);
	static POLY_METHOD(process);
	static POLY_METHOD(createMergeDebevec);

};

#endif