#ifndef _ALVISION_BOW_TRAINER_H_
#define _ALVISION_BOW_TRAINER_H_

#include "../../alvision.h"

class BOWTrainer : public overres::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	static POLY_METHOD(add);
	static POLY_METHOD(getDescriptors);
	static POLY_METHOD(descriptorsCount);
	static POLY_METHOD(clear);
	static POLY_METHOD(cluster);
	static POLY_METHOD(cluster_descriptors);


};

#endif
