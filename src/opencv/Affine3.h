#ifndef _ALVISION_AFFINE3_H_
#define _ALVISION_AFFINE3_H_
//#include "OpenCV.h"
#include "../alvision.h"

template <typename T>
class Affine3 : public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::string name) {
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Affine3::New);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());


		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());
	}

	std::shared_ptr<T> _affine3;

	static Nan::Persistent<FunctionTemplate> constructor;

	static NAN_METHOD(New) {
		if (info.This()->InternalFieldCount() == 0)
			Nan::ThrowTypeError("Cannot instantiate without new");


		Affine3<T> *affine;
		affine = new Affine3<T>();

		affine->Wrap(info.Holder());

		info.GetReturnValue().Set(info.Holder());
	}
	

	
};


//declare variables
template <typename T>
Nan::Persistent<FunctionTemplate> Affine3<T>::constructor;

#endif