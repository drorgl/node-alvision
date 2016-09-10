#include "core.h"


void
core::Init(Handle<Object> target) {
	Nan::SetMethod(target, "randu", randu);
	Nan::SetMethod(target, "theRNG", theRNG);
	Nan::SetMethod(target, "solveLP", solveLP);
	Nan::SetMethod(target, "norm", norm);
	Nan::SetMethod(target, "tempfile", tempfile);

	RNG::Init(target);
	RNG_MT19937::Init(target);

	ConjGradSolver::Init(target);
	DownhillSolver::Init(target);
	MinProblemSolver::Init(target);
	Algorithm::Init(target);
	DMatch::Init(target);
};

NAN_METHOD(core::randu) {
	return Nan::ThrowError("not implemented");
}

NAN_METHOD(core::theRNG) {
	return Nan::ThrowError("not implemented");
}

NAN_METHOD(core::solveLP) {
	return Nan::ThrowError("not implemented");
}


NAN_METHOD(core::norm) {
	return Nan::ThrowError("not implemented");
}

NAN_METHOD(core::tempfile) {
	return Nan::ThrowError("not implemented");
}