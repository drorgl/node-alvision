#ifndef _ALVISION_CLAHE_H_
#define _ALVISION_CLAHE_H_

#include "../../alvision.h"
#include "../core/Algorithm.h"

class CLAHE : public Algorithm {
public:
	static std::string name;

	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(apply);
	static POLY_METHOD(setClipLimit);
	static POLY_METHOD(getClipLimit);
	static POLY_METHOD(setTilesGridSize);
	static POLY_METHOD(getTilesGridSize);
	static POLY_METHOD(collectGarbage);

};

#endif



