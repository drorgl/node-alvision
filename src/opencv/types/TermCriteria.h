#ifndef _ALVISION_TERMCRITERIA_H_
#define _ALVISION_TERMCRITERIA_H_

#include "../../alvision.h"

class TermCriteria : public or ::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	std::shared_ptr<cv::TermCriteria> _termCriteria;

	static std::shared_ptr<TermCriteria> New(int type, int maxCount, double epsilon);

	virtual v8::Local<v8::Function> get_constructor(); 

	static POLY_METHOD(New_no_params);
	static POLY_METHOD(New);

	static NAN_GETTER(type_getter);
	static NAN_GETTER(maxCount_getter);
	static NAN_GETTER(epsilon_getter);
};

#endif
