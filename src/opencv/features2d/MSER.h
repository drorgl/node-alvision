#ifndef _ALVISION_MSER_H_
#define _ALVISION_MSER_H_

#include "../../alvision.h"

#include "Feature2D.h"

class MSER : public Feature2D {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(create);
	static POLY_METHOD(detectRegions);
	static POLY_METHOD(setDelta);
	static POLY_METHOD(getDelta);
	static POLY_METHOD(setMinArea);
	static POLY_METHOD(getMinArea);
	static POLY_METHOD(setMaxArea);
	static POLY_METHOD(getMaxArea);
	static POLY_METHOD(setPass2Only);
	static POLY_METHOD(getPass2Only);

};

#endif
