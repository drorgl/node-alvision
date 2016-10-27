#ifndef _ALVISION_MAT__H_
#define _ALVISION_MAT__H_
//#include "OpenCV.h"
#include "../alvision.h"

template <typename T>
class Mat_ : public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Mat_::New);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		Nan::SetMethod(target, "zeros", zeros);

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
	
	static NAN_METHOD(zeros) {
		return Nan::ThrowError("not implemented");
	}
	
};


//declare variables
template <typename T>
Nan::Persistent<FunctionTemplate> Mat_<T>::constructor;

#endif