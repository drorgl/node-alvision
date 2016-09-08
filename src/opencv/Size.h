#ifndef _ALVISION_SIZE_H_
#define _ALVISION_SIZE_H_
//#include "OpenCV.h"
#include "../alvision.h"

template <typename T>
class Size : public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::string name) {
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Size::New);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		Nan::SetAccessor(ctor->InstanceTemplate(),Nan::New( "width").ToLocalChecked(), Size::width);
		Nan::SetAccessor(ctor->InstanceTemplate(),Nan::New( "height").ToLocalChecked(), Size::height);
		

		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());
	}

	std::shared_ptr<T> _size;

	static Nan::Persistent<FunctionTemplate> constructor;

	static NAN_METHOD(New) {
		if (info.This()->InternalFieldCount() == 0)
			Nan::ThrowTypeError("Cannot instantiate without new");


		Size *size;
		size = new Size();

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
Nan::Persistent<FunctionTemplate> Size<T>::constructor;

#endif