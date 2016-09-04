#ifndef _ALVISION_VEC_H_
#define _ALVISION_VEC_H_
//#include "OpenCV.h"
#include "../alvision.h"

template <typename T>
class Vec: public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::string name) {
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Vec::New);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());


		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());
	}

	std::shared_ptr<T> _vec;

	static Nan::Persistent<FunctionTemplate> constructor;

	static NAN_METHOD(New) {
		if (info.This()->InternalFieldCount() == 0)
			Nan::ThrowTypeError("Cannot instantiate without new");


		Vec *size;
		size = new Vec();

		size->Wrap(info.Holder());

		info.GetReturnValue().Set(info.Holder());
	}
	

	
};


//declare variables
template <typename T>
Nan::Persistent<FunctionTemplate> Vec<T>::constructor;

#endif