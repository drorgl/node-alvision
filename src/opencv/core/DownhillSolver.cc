#include "DownhillSolver.h"

Nan::Persistent<FunctionTemplate> DownhillSolver::constructor;


void
DownhillSolver::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(DownhillSolver::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("DownhillSolver").ToLocalChecked());


	target->Set(Nan::New("DownhillSolver").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(DownhillSolver::New) {
	
	if (info.This()->InternalFieldCount() == 0)
		Nan::ThrowTypeError("Cannot instantiate without new");

	DownhillSolver *downhillSolver;

	//if (info.Length() == 0){
		downhillSolver = new DownhillSolver();
	//}

	downhillSolver->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

