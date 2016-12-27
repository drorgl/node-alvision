#ifndef _ALVISION_VEC_H_
#define _ALVISION_VEC_H_
//#include "OpenCV.h"
#include "../alvision.h"

template <typename T>
class Vec: public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Vec::New);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		overload->register_type<Vec<T>>(ctor, "vec", name);


		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());

		
	}

	std::shared_ptr<T> _vec;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor() {
		return Nan::New(constructor)->GetFunction();
	}


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