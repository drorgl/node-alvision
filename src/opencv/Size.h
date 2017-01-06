#ifndef _ALVISION_SIZE_H_
#define _ALVISION_SIZE_H_
//#include "OpenCV.h"
#include "../alvision.h"

template <typename T>
class Size_ : public or::ObjectWrap {
public:
	static std::string name;
	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		Size_<T>::name = name;
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Size_::New);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		overload->register_type<Size_<T>>(ctor, "size", name);

		Nan::SetAccessor(ctor->InstanceTemplate(),Nan::New( "width").ToLocalChecked(), Size_::width);
		Nan::SetAccessor(ctor->InstanceTemplate(),Nan::New( "height").ToLocalChecked(), Size_::height);
		

		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());

		
	}

	std::shared_ptr<T> _size;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor() {
		assert(!constructor.IsEmpty() && "constructor is empty");
		return Nan::New(constructor)->GetFunction();
	}

	static std::shared_ptr<Size_<T>> Empty() {
		auto ret = std::make_shared<Size_<T>>();
		ret->_size = std::make_shared<cv::Size>();
		return ret;
	}


	static NAN_METHOD(New) {
		if (info.This()->InternalFieldCount() == 0)
			Nan::ThrowTypeError("Cannot instantiate without new");


		Size_ *size;
		size = new Size_();

		size->Wrap(info.Holder());

		info.GetReturnValue().Set(info.Holder());
	}
	
	static NAN_PROPERTY_GETTER(width) {
		return Nan::ThrowError("not implemented");
	}

	static NAN_PROPERTY_GETTER(height) {
		return Nan::ThrowError("not implemented");
	}
	
};


//declare variables
template <typename T>
Nan::Persistent<FunctionTemplate> Size_<T>::constructor;

template<typename T>
std::string Size_<T>::name;

typedef typename Size_<cv::Size2i> Size2i;
typedef typename Size_<cv::Size2f> Size2f;
typedef typename Size_<cv::Size2d> Size2d;
typedef typename Size_<cv::Size>   Size;

namespace SizeInit {
	void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
}

#endif