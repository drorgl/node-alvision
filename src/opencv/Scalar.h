#ifndef _ALVISION_SCALAR_H_
#define _ALVISION_SCALAR_H_

#include "../alvision.h"

template <typename T>
class Scalar_ : public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Scalar_::New);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		overload->register_type<Scalar_<T>>(ctor, "scalar", name);


		Nan::SetMethod(ctor, "all", all);

		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());

		
	}

	std::shared_ptr<T> _scalar;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor() {
		assert(!constructor.IsEmpty() && "constructor is empty");
		return Nan::New(constructor)->GetFunction();
	}


	static NAN_METHOD(New) {
		if (info.This()->InternalFieldCount() == 0)
			Nan::ThrowTypeError("Cannot instantiate without new");


		
		auto scalar = new Scalar_();

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
Nan::Persistent<FunctionTemplate> Scalar_<T>::constructor;

typedef typename Scalar_<cv::Scalar> Scalar;

namespace ScalarInit {
	void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
}

#endif