#ifndef _ALVISION_TRACKED_ELEMENT_H_
#define _ALVISION_TRACKED_ELEMENT_H_

#include "../alvision.h"

class TrackedElement : or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	static POLY_METHOD(New);

	std::shared_ptr<cv::Mat> _from;
	std::string _Ttype;
	int _i0;
	int _i1;
	int _i2;

	v8::Local<v8::Object> WrapThis();

	static POLY_METHOD(get);
	static POLY_METHOD(set);
};

#endif