#ifndef _ALVISION_CONJGRADSOLVER_H_
#define _ALVISION_CONJGRADSOLVER_H_

#include "../../alvision.h"


class ConjGradSolver: public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target);

	std::shared_ptr<cv::ConjGradSolver> _conjGradSolver;

	static Nan::Persistent<FunctionTemplate> constructor;
	static NAN_METHOD(New);



};

#endif