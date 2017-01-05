#ifndef _ALVISION_POINT3_H_
#define _ALVISION_POINT3_H_
//#include "OpenCV.h"
#include "../alvision.h"

template <typename T>
class Point3_ : public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Point3_::New);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		overload->register_type<Point3_<T>>(ctor, "", name);


		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());

		
	}

	std::shared_ptr<T> _point;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor() {
		return Nan::New(constructor)->GetFunction();
	}


	static NAN_METHOD(New) {
		if (info.This()->InternalFieldCount() == 0)
			Nan::ThrowTypeError("Cannot instantiate without new");


		auto *point = new Point_<T>();

		point->Wrap(info.Holder());

		info.GetReturnValue().Set(info.Holder());
	}
	
	
	
};


//declare variables
template <typename T>
Nan::Persistent<FunctionTemplate> Point3_<T>::constructor;

typedef typename Point3_<cv::Point3i> Point3i;
typedef typename Point3_<cv::Point3f> Point3f;
typedef typename Point3_<cv::Point3d> Point3d;

#endif