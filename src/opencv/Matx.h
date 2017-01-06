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
		assert(!constructor.IsEmpty() && "constructor is empty");
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

typedef typename Matx<cv::Matx12f> Matx12f;
typedef typename Matx<cv::Matx12d> Matx12d;
typedef typename Matx<cv::Matx13f> Matx13f;
typedef typename Matx<cv::Matx13d> Matx13d;
typedef typename Matx<cv::Matx14f> Matx14f;
typedef typename Matx<cv::Matx14d> Matx14d;
typedef typename Matx<cv::Matx16f> Matx16f;
typedef typename Matx<cv::Matx16d> Matx16d;
typedef typename Matx<cv::Matx21f> Matx21f;
typedef typename Matx<cv::Matx21d> Matx21d;
typedef typename Matx<cv::Matx31f> Matx31f;
typedef typename Matx<cv::Matx31d> Matx31d;
typedef typename Matx<cv::Matx41f> Matx41f;
typedef typename Matx<cv::Matx41d> Matx41d;
typedef typename Matx<cv::Matx61f> Matx61f;
typedef typename Matx<cv::Matx61d> Matx61d;
typedef typename Matx<cv::Matx22f> Matx22f;
typedef typename Matx<cv::Matx22d> Matx22d;
typedef typename Matx<cv::Matx23f> Matx23f;
typedef typename Matx<cv::Matx23d> Matx23d;
typedef typename Matx<cv::Matx32f> Matx32f;
typedef typename Matx<cv::Matx32d> Matx32d;
typedef typename Matx<cv::Matx33f> Matx33f;
typedef typename Matx<cv::Matx33d> Matx33d;
typedef typename Matx<cv::Matx34f> Matx34f;
typedef typename Matx<cv::Matx34d> Matx34d;
typedef typename Matx<cv::Matx43f> Matx43f;
typedef typename Matx<cv::Matx43d> Matx43d;
typedef typename Matx<cv::Matx44f> Matx44f;
typedef typename Matx<cv::Matx44d> Matx44d;
typedef typename Matx<cv::Matx66f> Matx66f;
typedef typename Matx<cv::Matx66d> Matx66d;

namespace MatxInit {
	void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
}


#endif