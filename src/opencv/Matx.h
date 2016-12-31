#ifndef _ALVISION_MATX_H_
#define _ALVISION_MATX_H_
//#include "OpenCV.h"
#include "../alvision.h"

template <typename T>
class Matx : public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Matx<T>::New);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		Matx<T>::name = name;
		overload->register_type<Matx<T>>(ctor, "matx", name);
		

		//ctor->Inherit(?);
		

		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());

		
	}

	std::shared_ptr<T> _matx;

	static std::string Matx<T>::name;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor() {
		return Nan::New(constructor)->GetFunction();
	}


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

template <typename T>
std::string Matx<T>::name;

#endif