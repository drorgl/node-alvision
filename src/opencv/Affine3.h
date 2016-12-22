#ifndef _ALVISION_AFFINE3_H_
#define _ALVISION_AFFINE3_H_
//#include "OpenCV.h"
#include "../alvision.h"

template <typename T>
class Affine3 : public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Affine3::New);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());


		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());
	}

	std::shared_ptr<T> _affine3;

	static Nan::Persistent<FunctionTemplate> constructor;

	static NAN_METHOD(New) {
		
		if (info.This()->InternalFieldCount() == 0)
			Nan::ThrowTypeError("Cannot instantiate without new");


		Affine3<T> *affine;
		affine = new Affine3<T>();

		affine->Wrap(info.Holder());

		info.GetReturnValue().Set(info.Holder());
	}
	
	//Identity() : Affine3<T>
	//new() : Affine3<T>;
	//new (affine: _matx.Matx<T>) : Affine3<T>;
	//new (data: _mat.Mat, t ? : _matx.Vec<T> /*= Vec3::all(0)*/) : Affine3<T>;
	//new (R: _matx.Matx<T>, t ? : _matx.Vec<T> /* = Vec3::all(0)*/) : Affine3<T>;
	//new (rvec: _matx.Vec<T>, t ? : _matx.Vec<T> /* = Vec3::all(0)*/) : Affine3<T>;
	//new (vals: Array<T>) : Affine3<T>;
	//op_Multiplication(affine1: Affine3<T>, affine2 : Affine3<T>) : Affine3<T>;
	//op_Multiplication(affine: Affine3<T>, vector : Array<T>) : Affine3<T>;
	//op_Multiplication(affine: Affine3<_st.double>, vector : _matx.Vec3d) : _matx.Vec3d;
	//op_Multiplication(affine: Affine3<_st.float>, vector : _matx.Vec3f) : _matx.Vec3f;
	//
	//
	//concatenate(affine : Affine3<T>) : Affine3<T>;
	//inv(method ? : _base.DecompTypes /*= cv::DECOMP_SVD*/) : Affine3<T>;
	//linear() : _matx.Matx<T>;
	//linear(L : _matx.Matx<T>) : void;
	//matrix: _matx.Matx<T>;
	//rotate(R : _matx.Matx<T>) : Affine3<T>;
	//rotate(rvec : _matx.Vec3<T>) : Affine3<T>;
	//rotation() : _matx.Matx<T>;
	//rotation(data : _mat.Mat) : void;
	//rotation(R : _matx.Matx<T>) : void;
	//rotation(rvec : _matx.Vec3<T>) : void;
	//rvec() : _matx.Vec<T>;
	//translate(t : _matx.Vec3<T>) : Affine3<T>;
	//translation() : _matx.Vec<T>;
	//translation(t : _matx.Vec<T>) : void;
};


//declare variables
template <typename T>
Nan::Persistent<FunctionTemplate> Affine3<T>::constructor;

#endif