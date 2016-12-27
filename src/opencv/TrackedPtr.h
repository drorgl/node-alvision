#ifndef _ALVISION_TRACKED_PTR_H_
#define _ALVISION_TRACKED_PTR_H_

#include "../alvision.h"

class TrackedPtr : public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	
	std::shared_ptr<cv::Mat> _from;
	std::string _Ttype;
	int _i0;

};


#endif