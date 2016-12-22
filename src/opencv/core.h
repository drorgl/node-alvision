#ifndef _ALVISION_CORE_H_
#define _ALVISION_CORE_H_
//#include "OpenCV.h"
#include "../alvision.h"

#include "core/Algorithm.h"

#include "core/RNG.h"
#include "core/RNG_MT19937.h"

#include "core/ConjGradSolver.h"
#include "core/DownhillSolver.h"
#include "core/MinProblemSolver.h"

#include "core/DMatch.h"


class core : public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
	static NAN_METHOD(randu);
	static NAN_METHOD(theRNG);
	static NAN_METHOD(solveLP);
	static NAN_METHOD(norm);
	static NAN_METHOD(tempfile);
};

#endif