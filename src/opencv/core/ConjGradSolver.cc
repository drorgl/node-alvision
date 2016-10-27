#include "ConjGradSolver.h"

Nan::Persistent<FunctionTemplate> ConjGradSolver::constructor;


void
ConjGradSolver::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(ConjGradSolver::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("ConjGradSolver").ToLocalChecked());


	target->Set(Nan::New("ConjGradSolver").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(ConjGradSolver::New) {
	
	if (info.This()->InternalFieldCount() == 0)
		Nan::ThrowTypeError("Cannot instantiate without new");

	ConjGradSolver *conjGradSolver;

	//if (info.Length() == 0){
		conjGradSolver = new ConjGradSolver();
	//}

	conjGradSolver->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

