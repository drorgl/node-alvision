#ifndef _ALVISION_MINPROBLEMSOLVER_H_
#define _ALVISION_MINPROBLEMSOLVER_H_

#include "../../alvision.h"


class MinProblemSolver: public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::MinProblemSolver> _minProblemSolver;

	static Nan::Persistent<FunctionTemplate> constructor;
	static NAN_METHOD(New);



};

#endif