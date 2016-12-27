#ifndef _ALVISION_RECT_H_
#define _ALVISION_RECT_H_
//#include "OpenCV.h"
#include "../alvision.h"

template <typename T>
class Rect : public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Rect::New);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		Nan::SetAccessor(ctor->InstanceTemplate(),Nan::New( "width").ToLocalChecked(), Rect::width);
		Nan::SetAccessor(ctor->InstanceTemplate(),Nan::New( "height").ToLocalChecked(), Rect::height);
		

		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());
	}

	std::shared_ptr<T> _rect;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor() {
		return Nan::New(constructor)->GetFunction();
	}


	static NAN_METHOD(New) {
		if (info.This()->InternalFieldCount() == 0)
			Nan::ThrowTypeError("Cannot instantiate without new");


		Rect<T> *rect;
		rect = new Rect<T>();

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
Nan::Persistent<FunctionTemplate> Rect<T>::constructor;

#endif