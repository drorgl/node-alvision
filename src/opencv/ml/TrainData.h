#ifndef _ALVISION_TRAINDATA_H_
#define _ALVISION_TRAINDATA_H_

#include "../../alvision.h"


class TrainData: public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::ml::TrainData> _trainData;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


	static NAN_METHOD(New);

	static NAN_METHOD(loadFromCSV);



};

#endif