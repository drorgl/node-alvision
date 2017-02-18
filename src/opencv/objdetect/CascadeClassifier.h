#ifndef _ALVISION_CASCADE_CLASSIFIER_H_
#define _ALVISION_CASCADE_CLASSIFIER_H_

#include "../../alvision.h"

class CascadeClassifier : public or ::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


	static POLY_METHOD(New);
	static POLY_METHOD(New_file);
	static POLY_METHOD(empty);
	static POLY_METHOD(load);
	static POLY_METHOD(read);
	static POLY_METHOD(detectMultiScale);
	static POLY_METHOD(isOldFormatCascade);
	static POLY_METHOD(getOriginalWindowSize);
	static POLY_METHOD(getFeatureType);
	static POLY_METHOD(convert);

};

#endif
