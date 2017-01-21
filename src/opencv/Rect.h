#ifndef _ALVISION_RECT_H_
#define _ALVISION_RECT_H_
//#include "OpenCV.h"
#include "../alvision.h"

template <typename T>
class Rect_ : public or::ObjectWrap {
public:
	static std::string name;
	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		Rect_<T>::name = name;
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Rect_<T>::New);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		overload->register_type<Rect_<T>>(ctor, "rect", name);

		Nan::SetAccessor(ctor->InstanceTemplate(),Nan::New( "width").ToLocalChecked(),  Rect_<T>::width);
		Nan::SetAccessor(ctor->InstanceTemplate(),Nan::New( "height").ToLocalChecked(), Rect_<T>::height);
		

		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());
	}

	std::shared_ptr<T> _rect;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor() {
		assert(!constructor.IsEmpty() && "constructor is empty");
		return Nan::New(constructor)->GetFunction();
	}


	static NAN_METHOD(New) {
		if (info.This()->InternalFieldCount() == 0)
			Nan::ThrowTypeError("Cannot instantiate without new");


		auto rect = new Rect_<T>();

		rect->Wrap(info.Holder());

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
Nan::Persistent<FunctionTemplate> Rect_<T>::constructor;

template <typename T>
std::string Rect_<T>::name;


typedef Rect_<cv::Rect_<int>> Rect2i;
typedef Rect_<cv::Rect_<float>> Rect2f;
typedef Rect_<cv::Rect_<double>> Rect2d;
typedef Rect2i Rect;


namespace RectInit {
	void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
}



#endif