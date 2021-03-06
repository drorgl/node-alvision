#include "MinProblemSolver.h"

Nan::Persistent<FunctionTemplate> MinProblemSolver::constructor;


void
MinProblemSolver::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(MinProblemSolver::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("MinProblemSolver").ToLocalChecked());
	overload->register_type<MinProblemSolver>(ctor, "minproblemsolver", "MinProblemSolver");


	target->Set(Nan::New("MinProblemSolver").ToLocalChecked(), ctor->GetFunction());

	
};

v8::Local<v8::Function> MinProblemSolver::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


NAN_METHOD(MinProblemSolver::New) {
	
	if (info.This()->InternalFieldCount() == 0)
		Nan::ThrowTypeError("Cannot instantiate without new");

	MinProblemSolver *minProblemSolver;

	//if (info.Length() == 0){
		minProblemSolver = new MinProblemSolver();
	//}

	minProblemSolver->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

