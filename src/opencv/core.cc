#include "core.h"


void
core::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Nan::SetMethod(target, "randu", randu);
	Nan::SetMethod(target, "theRNG", theRNG);
	Nan::SetMethod(target, "solveLP", solveLP);
	Nan::SetMethod(target, "norm", norm);
	Nan::SetMethod(target, "tempfile", tempfile);

	RNG::Init(target, overload);
	RNG_MT19937::Init(target, overload);

	ConjGradSolver::Init(target, overload);
	DownhillSolver::Init(target, overload);
	MinProblemSolver::Init(target, overload);
	Algorithm::Init(target, overload);
	DMatch::Init(target, overload);
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