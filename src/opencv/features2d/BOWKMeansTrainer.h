#ifndef _ALVISION_BOW_KMEANS_TRAINER_H_
#define _ALVISION_BOW_KMEANS_TRAINER_H_

#include "../../alvision.h"
#include "BOWTrainer.h"

class BOWKMeansTrainer : public BOWTrainer {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	static POLY_METHOD(cluster);
	static POLY_METHOD(cluster_descriptors);

};

#endif
