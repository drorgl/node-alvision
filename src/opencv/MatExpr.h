#ifndef _ALVISION_MATEXPR_H_
#define _ALVISION_MATEXPR_H_
//#include "OpenCV.h"
#include "../alvision.h"


class MatExpr : public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::MatExpr> _matExpr;

	static Nan::Persistent<FunctionTemplate> constructor;
	static NAN_METHOD(New);



};

#endif