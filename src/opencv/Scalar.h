#ifndef _ALVISION_SCALAR_H_
#define _ALVISION_SCALAR_H_

#include "../alvision.h"

template <typename T>
class Scalar : public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Scalar::New);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		Nan::SetMethod(ctor, "all", all);

		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());
	}

	std::shared_ptr<T> _scalar;

	static Nan::Persistent<FunctionTemplate> constructor;

	static NAN_METHOD(New) {
		if (info.This()->InternalFieldCount() == 0)
			Nan::ThrowTypeError("Cannot instantiate without new");


		Scalar *scalar;
		scalar = new Scalar();

		scalar->Wrap(info.Holder());

		info.GetReturnValue().Set(info.Holder());
	}

	static NAN_METHOD(all) {
		return Nan::ThrowError("not implemented");
	}
	
	static v8::Local<v8::Object> all(double v0) {
		//TODO: implement!
		return Nan::New("not implemented").ToLocalChecked().As<v8::Object>();
		//cv::Scalar::all()
	}

	
};


//declare variables
template <typename T>
Nan::Persistent<FunctionTemplate> Scalar<T>::constructor;

#endif