#ifndef _ALVISION_MATX_H_
#define _ALVISION_MATX_H_
//#include "OpenCV.h"
#include "../alvision.h"

template <typename T>
class Matx : public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Matx<T>::New);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		//ctor->Inherit(?);
		

		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());
	}

	std::shared_ptr<T> _matx;

	static Nan::Persistent<FunctionTemplate> constructor;

	static NAN_METHOD(New) {
		if (info.This()->InternalFieldCount() == 0)
			Nan::ThrowTypeError("Cannot instantiate without new");


		Matx<T> *matx;
		matx = new Matx<T>();

		matx->Wrap(info.Holder());

		info.GetReturnValue().Set(info.Holder());
	}
	

	
};


//declare variables
template <typename T>
Nan::Persistent<FunctionTemplate> Matx<T>::constructor;

#endif