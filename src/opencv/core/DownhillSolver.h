#ifndef _ALVISION_DOWNHILLSOLVER_H_
#define _ALVISION_DOWNHILLSOLVER_H_

#include "../../alvision.h"


class DownhillSolver: public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target);

	std::shared_ptr<cv::DownhillSolver> _downhillSolver;

	static Nan::Persistent<FunctionTemplate> constructor;
	static NAN_METHOD(New);



};

#endif