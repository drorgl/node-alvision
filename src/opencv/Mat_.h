#ifndef _ALVISION_MAT__H_
#define _ALVISION_MAT__H_
//#include "OpenCV.h"
#include "../alvision.h"

template <typename T>
class Mat_ : public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::string name) {
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Mat_::New);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());


		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());
	}

	std::shared_ptr<T> _Mat_;

	static Nan::Persistent<FunctionTemplate> constructor;

	static NAN_METHOD(New) {
		if (info.This()->InternalFieldCount() == 0)
			Nan::ThrowTypeError("Cannot instantiate without new");


		Mat_ *mat_;
		mat_ = new Mat_();

		mat_->Wrap(info.Holder());

		info.GetReturnValue().Set(info.Holder());
	}
	

	
};


//declare variables
template <typename T>
Nan::Persistent<FunctionTemplate> Mat_<T>::constructor;

#endif