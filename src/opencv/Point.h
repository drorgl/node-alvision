#ifndef _ALVISION_POINT_H_
#define _ALVISION_POINT_H_
//#include "OpenCV.h"
#include "../alvision.h"

template <typename T>
class Point_ : public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Point_::New);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		overload->register_type<Point_<T>>(ctor, "", name);


		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());

		
	}

	std::shared_ptr<T> _point;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor() {
		return Nan::New(constructor)->GetFunction();
	}


	template<typename... Args>
	static std::shared_ptr<Point_<T>> create(Args&&... args) {
		auto val = std::make_shared<Point_<T>>();
		val->_point = std::shared_ptr<T>(new T(std::forward<Args>(args)...));
		return val;
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
Nan::Persistent<FunctionTemplate> Point_<T>::constructor;


typedef typename Point_<cv::Point2i> Point2i;
typedef typename Point_<cv::Point2f> Point2f;
typedef typename Point_<cv::Point2d> Point2d;
typedef typename Point_<cv::Point>   Point;

#endif