#ifndef _ALVISION_COMPLEX_H_
#define _ALVISION_COMPLEX_H_

#include "../../alvision.h"

template <typename T>
class Complex_ : public or::ObjectWrap {
public:
	static std::string Complex_<T>::name;
	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		Complex_<T>::name = name;
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Complex_::New);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		overload->register_type<Complex_<T>>(ctor, "", name);


		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());

		
	}

	std::shared_ptr<T> _complex;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor() {
		assert(!constructor.IsEmpty() && "constructor is empty");
		return Nan::New(constructor)->GetFunction();
	}


	template<typename... Args>
	static std::shared_ptr<Complex_<T>> create(Args&&... args) {
		auto val = std::make_shared<Complex_<T>>();
		val->_complex = std::shared_ptr<T>(new T(std::forward<Args>(args)...));
		return val;
	}

	static Complex_<T>* from(T point) {
		auto pt = new Complex_<T>();
		pt->_complex = std::make_shared<T>(std::move(point));
		return pt;
	}

	static NAN_METHOD(New) {
		if (info.This()->InternalFieldCount() == 0)
			Nan::ThrowTypeError("Cannot instantiate without new");


		auto *point = new Complex_<T>();

		point->Wrap(info.Holder());

		info.GetReturnValue().Set(info.Holder());
	}
	
	
	
};


//declare variables
template <typename T>
Nan::Persistent<FunctionTemplate> Complex_<T>::constructor;

template <typename T>
std::string Complex_<T>::name;


typedef typename Complex_<cv::Complexd> Complexd;
typedef typename Complex_<cv::Complexf> Complexf;

#endif