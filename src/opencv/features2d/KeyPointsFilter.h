#ifndef _ALVISION_KEYPOINTS_FILTER_H_
#define _ALVISION_KEYPOINTS_FILTER_H_

#include "../../alvision.h"

class KeyPointsFilter : public or ::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	static POLY_METHOD(runByImageBorder);
	static POLY_METHOD(runByKeypointSize);
	static POLY_METHOD(runByPixelsMask);
	static POLY_METHOD(removeDuplicated);
	static POLY_METHOD(retainBest);


};

#endif
