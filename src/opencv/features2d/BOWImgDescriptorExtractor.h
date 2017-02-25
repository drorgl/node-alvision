#ifndef _ALVISION_BOW_IMG_DESCRIPTOR_EXTRACTOR_H_
#define _ALVISION_BOW_IMG_DESCRIPTOR_EXTRACTOR_H_

#include "../../alvision.h"

class BOWImgDescriptorExtractor : public overres::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	static POLY_METHOD(New_dmatcher);
	static POLY_METHOD(setVocabulary);
	static POLY_METHOD(getVocabulary);
	static POLY_METHOD(compute_img);
	static POLY_METHOD(compute_kp);
	static POLY_METHOD(compute2);
	static POLY_METHOD(descriptorSize);
	static POLY_METHOD(descriptorType);


};

#endif
