#ifndef _ALVISION_AFFINE3_H_
#define _ALVISION_AFFINE3_H_
//#include "OpenCV.h"
#include "../alvision.h"
#include "Matx.h"
#include "Vec.h"

#include <string>
using namespace std::literals::string_literals;


namespace affine3_general_callback {
	extern std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback);
}

template <typename T>
class Affine3 : public or::ObjectWrap {
public:
	typedef cv::Matx<typename T::float_type, 4, 4> cvMatx4;
	typedef Matx<cvMatx4> Matx4;
	typedef cv::Matx<typename T::float_type, 3, 3> cvMatx3;
	typedef Matx<cvMatx3> Matx3;
	typedef cv::Vec<typename T::float_type, 3> cvVec3;
	typedef Vec<cvVec3> Vec3;

	static std::string name;


	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		affine3_general_callback::overload = overload;
		Affine3<T>::name = name;
		auto float_type = GetTypeName<T::float_type>();
		auto array_float_type = "Array<"s + float_type + ">"s;
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(affine3_general_callback::callback);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		overload->register_type<Affine3<T>>(ctor, "affine3", name);

			
		



		//static 

		//new() : Affine3<T>;
		overload->addOverloadConstructor("affine3", name, {}, New_no_params);

		////! Augmented affine matrix
		//new (affine: _matx.Matx<T>) : Affine3<T>;
		overload->addOverloadConstructor("affine3", name, { make_param<Matx4*>("affine",Matx4::name) }, New_matx);

			////! Rotation matrix
			//new (R: _matx.Matx<T>, t ? : _matx.Vec<T> /* = Vec3::all(0)*/) : Affine3<T>;
			overload->addOverloadConstructor("affine3", name, { make_param < Matx3*>("R",Matx3::name), make_param<Vec3*>("t",Vec3::name,Vec3::all(0)) }, New_matx_vec);

		////! Rodrigues vector
		//new (rvec: _matx.Vec<T>, t ? : _matx.Vec<T> /* = Vec3::all(0)*/) : Affine3<T>;
		overload->addOverloadConstructor("affine3", name, { make_param <Vec3*>("rvec",Vec3::name), make_param<Vec3*>("t",Vec3::name,Vec3::all(0)) }, New_vec_vec);

		////! Combines all contructors above. Supports 4x4, 4x3, 3x3, 1x3, 3x1 sizes of data matrix
		//new (data: _mat.Mat, t ? : _matx.Vec<T> /*= Vec3::all(0)*/) : Affine3<T>;
		overload->addOverloadConstructor("affine3", name, { make_param <Matrix*>("data","Mat"), make_param<Vec3*>("t",Vec3::name,Vec3::all(0)) }, New_mat_vec);

		////! From 16th element array
		//new (vals: Array<T>) : Affine3<T>;
		overload->addOverloadConstructor("affine3", name, { make_param<std::shared_ptr<std::vector<T::float_type>>>("vals",array_float_type) }, New_array_T);

		////! Create identity transform
		//Identity() : Affine3<T>
		overload->addStaticOverload("affine3", name, "Identity", {}, Identity);
		Nan::SetMethod(ctor, "Identity", affine3_general_callback::callback);

		//	//    template<typename T> static
		//	//    Affine3<T> operator * (const Affine3<T>& affine1, const Affine3<T>& affine2);
		//	//
		//	//template < typename T, typename V> static
		//	//V operator* (const Affine3<T>& affine, const V& vector);
		//	//
		//	//
		//	//
		//	//    static Vec3f operator* (const Affine3f& affine, const Vec3f& vector);
		//	//    static Vec3d operator* (const Affine3d& affine, const Vec3d& vector);

		//	op_Multiplication(affine1: Affine3<T>, affine2 : Affine3<T>) : Affine3<T>;

		//op_Multiplication(affine: Affine3<T>, vector : Array<T>) : Affine3<T

		//TODO: find what type of vector this can be used on!
		//overload->addStaticOverload("affine3", name, "op_Multiplication", { make_param<Affine3<T>>("affine",Affine3<T>::name), make_param<std::shared_ptr<std::vector<T>>>("vector","Array<T>") }, op_Multiplication_affine3_array);
		
		//op_Multiplication(affine: Affine3<_st.float>, vector : _matx.Vec3f) : _matx.Vec3f;
		overload->addStaticOverload("affine3", name, "op_Multiplication", { make_param<Affine3<T>*>("affine",Affine3<T>::name), make_param<Vec3*>("vector",Vec3::name) }, op_Multiplication_affine3_vec3);
		//op_Multiplication(affine: Affine3<_st.double>, vector : _matx.Vec3d) : _matx.Vec3d;
			
		//member


	//	//! Rotation matrix
	//	rotation(R : _matx.Matx<T>) : void;
			overload->addOverload("affine3", name, "rotation", { make_param<Matx3*>("R",Matx3::name) }, rotation_matx);

	//	//! Rodrigues vector
	//	rotation(rvec : _matx.Vec3<T>) : void;
			overload->addOverload("affine3", name, "rotation", { make_param<Vec3*>("rvec",Vec3::name) }, rotation_vec3T);

	//	//! Combines rotation methods above. Suports 3x3, 1x3, 3x1 sizes of data matrix;
	//	rotation(data : _mat.Mat) : void;
			overload->addOverload("affine3", name, "rotation", { make_param<Matrix*>("data","Mat") }, rotation_mat);

			Nan::SetPrototypeMethod(ctor, "rotation", affine3_general_callback::callback);

	//	linear(L : _matx.Matx<T>) : void;
			overload->addOverload("affine3", name, "linear", { make_param<Matx3*>("L",Matx3::name) }, linear_matxT);

			Nan::SetPrototypeMethod(ctor, "linear", affine3_general_callback::callback);

	//	translation(t : _matx.Vec<T>) : void;
			overload->addOverload("affine3", name, "translation", { make_param<Vec3*>("t",Vec3::name) }, translation_vecT);

			Nan::SetPrototypeMethod(ctor, "translation", affine3_general_callback::callback);

	//	rotation() : _matx.Matx<T>;
			overload->addOverload("affine3", name, "rotation", {}, rotation);
	//	linear() : _matx.Matx<T>;
			overload->addOverload("affine3", name, "linear", {}, linear);
	//	translation() : _matx.Vec<T>;
			overload->addOverload("affine3", name, "translation", {}, translation);

	//	//! Rodrigues vector
	//	rvec() : _matx.Vec<T>;
			overload->addOverload("affine3", name, "rvec", {}, rvec);

			Nan::SetPrototypeMethod(ctor, "rvec", affine3_general_callback::callback);

	//	inv(method ? : _base.DecompTypes /*= cv::DECOMP_SVD*/) : Affine3<T>;
			overload->addOverload("affine3", name, "inv", {make_param<int>("method","DecompTypes",cv::DECOMP_SVD)}, inv_decomptypes);

			Nan::SetPrototypeMethod(ctor, "inv", affine3_general_callback::callback);

	//	//! a.rotate(R) is equivalent to Affine(R, 0) * a;
	//	rotate(R : _matx.Matx<T>) : Affine3<T>;
			overload->addOverload("affine3", name, "rotate", { make_param < Matx3*>("R",Matx3::name) }, rotate_matxT);

			Nan::SetPrototypeMethod(ctor, "rotate", affine3_general_callback::callback);

	//	//! a.rotate(rvec) is equivalent to Affine(rvec, 0) * a;
	//	rotate(rvec : _matx.Vec3<T>) : Affine3<T>;
			overload->addOverload("affine3", name, "rotate", { make_param < Vec3*>("R",Vec3::name) }, rotate_vec3T);

	//	//! a.translate(t) is equivalent to Affine(E, t) * a;
	//	translate(t : _matx.Vec3<T>) : Affine3<T>;
			overload->addOverload("affine3", name, "translate", { make_param<Vec3*>("t",Vec3::name) }, translate_vec3T);

			Nan::SetPrototypeMethod(ctor, "translate", affine3_general_callback::callback);

	//	//! a.concatenate(affine) is equivalent to affine * a;
	//	concatenate(affine : Affine3<T>) : Affine3<T>;
			overload->addOverload("affine3", name, "concatenate", { make_param<Affine3<T>*>("affine",Affine3<T>::name) }, concatenate_Affine3T);

			Nan::SetPrototypeMethod(ctor, "concatenate", affine3_general_callback::callback);

	//	//template < typename Y> operator Affine3<Y>() const;

	//	//template < typename Y> Affine3 < Y > cast() const;

	//matrix: _matx.Matx<T>;
			
			Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("matrix").ToLocalChecked(), matrix_getter, matrix_setter);

	//	//#if defined EIGEN_WORLD_VERSION && defined EIGEN_GEOMETRY_MODULE_H
	//	//Affine3(const Eigen::Transform<T, 3, Eigen::Affine, (Eigen::RowMajor)>& affine);
	//	//Affine3(const Eigen::Transform<T, 3, Eigen::Affine >& affine);
	//	//operator Eigen::Transform < T, 3, Eigen::Affine, (Eigen::RowMajor)>() const;
	//	//operator Eigen::Transform < T, 3, Eigen::Affine > () const;
	//	//#endif

			target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());
	}

	std::shared_ptr<T> _affine3;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor() {
		assert(!constructor.IsEmpty() && "constructor is empty");
		return Nan::New(constructor)->GetFunction();
	}


	/*static NAN_METHOD(New) {
		
		if (info.This()->InternalFieldCount() == 0)
			Nan::ThrowTypeError("Cannot instantiate without new");


		Affine3<T> *affine;
		affine = new Affine3<T>();

		affine->Wrap(info.Holder());

		info.GetReturnValue().Set(info.Holder());
	}*/
	
	static POLY_METHOD(New_no_params) {
		auto aff= new Affine3<T>();
		aff->_affine3 = std::make_shared<T>();

		aff->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	static POLY_METHOD(New_matx) {
		auto matx = info.at<Matx4*>(0);
		auto aff = new Affine3<T>();
		aff->_affine3 = std::make_shared<T>(*matx->_matx);

		aff->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	static POLY_METHOD(New_matx_vec) {
		auto matx = info.at <Matx3*>(0);
		auto vec = info.at < Vec3*>(1);
		auto aff = new Affine3<T>();
		aff->_affine3 = std::make_shared<T>(*matx->_matx, *vec->_vec);

		aff->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	static POLY_METHOD(New_vec_vec) {
		auto rvec = info.at <Vec3*>(0);
		auto t = info.at < Vec3*>(1);
		auto aff = new Affine3<T>();
		aff->_affine3 = std::make_shared<T>(*rvec->_vec, *t->_vec);

		aff->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	static POLY_METHOD(New_mat_vec) {
		auto mat = info.at <Matrix*>(0);
		auto t = info.at < Vec3*>(1);
		auto aff = new Affine3<T>();
		aff->_affine3 = std::make_shared<T>(*mat->_mat, *t->_vec);

		aff->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	static POLY_METHOD(New_array_T) {
		auto vals = info.at<std::shared_ptr<std::vector<T::float_type>>>(0);
		if (vals->size() != 16) {
			throw std::exception("Affine3 from array works only with 16 values");
		}
		auto aff = new Affine3<T>();
		aff->_affine3 = std::make_shared<T>(&((*vals)[0]));

		aff->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	static POLY_METHOD(Identity) {
		auto aff = new Affine3<T>();
		aff->_affine3 = std::shared_ptr<T>(new T(T::Identity()));

		info.SetReturnValue(aff);
	}

	static POLY_METHOD(op_Multiplication_affine3_vec3) {
		auto affine = info.at<Affine3<T>*>(0);
		auto vec = info.at<Vec3*>(1);

		auto aff = new Affine3<T>();
		aff->_affine3 = std::shared_ptr<T>(new T((*affine->_affine3) * (*vec->_vec)));

		info.SetReturnValue(aff);
	}

	static POLY_METHOD(rotation_matx) {
		auto this_ = info.This<Affine3<T>*>();

		this_->_affine3->rotation(*info.at<Matx3*>(0)->_matx);
	}

	static POLY_METHOD(rotation_vec3T) {
		auto this_ = info.This<Affine3<T>*>();

		this_->_affine3->rotation(*info.at<Vec3*>(0)->_vec);
	}

	static POLY_METHOD(rotation_mat) {
		auto this_ = info.This<Affine3<T>*>();

		this_->_affine3->rotation(*info.at<Matrix*>(0)->_mat);
	}

	static POLY_METHOD(linear_matxT) {
		auto this_ = info.This<Affine3<T>*>();

		this_->_affine3->linear(*info.at<Matx3*>(0)->_matx);
	}

	static POLY_METHOD(translation_vecT) {
		auto this_ = info.This<Affine3<T>*>();

		this_->_affine3->translation(*info.at<Vec3*>(0)->_vec);
	}

	static POLY_METHOD(rotation) {
		auto this_ = info.This<Affine3<T>*>();

		auto mat3 = new Matx3();
		mat3->_matx = std::make_shared<cvMatx3>(this_->_affine3->rotation());

		info.SetReturnValue(mat3);
	}

	static POLY_METHOD(linear) {
		auto this_ = info.This<Affine3<T>*>();

		auto mat3 = new Matx3();
		mat3->_matx = std::make_shared<cvMatx3>(this_->_affine3->linear());

		info.SetReturnValue(mat3);
	}

	static POLY_METHOD(translation) {
		auto this_ = info.This<Affine3<T>*>();

		auto vec3 = new Vec3();
		vec3->_vec = std::make_shared<cvVec3>(this_->_affine3->translation());

		info.SetReturnValue(vec3);
	}

	static POLY_METHOD(rvec) {
		auto this_ = info.This<Affine3<T>*>();

		auto vec3 = new Vec3();
		vec3->_vec = std::make_shared<cvVec3>(this_->_affine3->rvec());

		info.SetReturnValue(vec3);
	}

	static POLY_METHOD(inv_decomptypes) {
		auto this_ = info.This<Affine3<T>*>();

		auto ret = new Affine3<T>();
		ret->_affine3 = std::make_shared<T>(this_->_affine3->inv(info.at<int>(0)));

		info.SetReturnValue(ret);
	}

	static POLY_METHOD(rotate_matxT) {
		auto this_ = info.This<Affine3<T>*>();

		auto ret = new Affine3<T>();
		ret->_affine3 = std::make_shared<T>(this_->_affine3->rotate(*info.at<Matx3*>(0)->_matx));

		info.SetReturnValue(ret);
	}

	static POLY_METHOD(rotate_vec3T) {
		auto this_ = info.This<Affine3<T>*>();

		auto ret = new Affine3<T>();
		ret->_affine3 = std::make_shared<T>(this_->_affine3->rotate(*info.at<Vec3*>(0)->_vec));

		info.SetReturnValue(ret);
	}

	static POLY_METHOD(translate_vec3T) {
		auto this_ = info.This<Affine3<T>*>();

		auto ret = new Affine3<T>();
		ret->_affine3 = std::make_shared<T>(this_->_affine3->translate(*info.at<Vec3*>(0)->_vec));

		info.SetReturnValue(ret);
	}

	static POLY_METHOD(concatenate_Affine3T) {
		auto this_ = info.This<Affine3<T>*>();

		auto ret = new Affine3<T>();
		ret->_affine3 = std::make_shared<T>(this_->_affine3->concatenate(*info.at<Affine3<T>*>(0)->_affine3));

		info.SetReturnValue(ret);
	}

	


	static NAN_GETTER(matrix_getter) {
		//TODO: add validation / move handling to overload-resolution
		auto this_ = or ::ObjectWrap::Unwrap<Affine3<T>>(info.This());

		auto matx = new Matx4();
		matx->_matx = std::make_shared<cvMatx4>(this_->_affine3->matrix);

		info.GetReturnValue().Set(matx->Wrap());
	}
	static NAN_SETTER(matrix_setter) {
		//TODO: add validation / move handling to overload-resolution
		auto this_ = or ::ObjectWrap::Unwrap<Affine3<T>>(info.This());

		this_->_affine3->matrix = *or::ObjectWrap::Unwrap<Matx4>(value.As<v8::Object>())->_matx;
	}
	
};


//declare variables
template <typename T>
Nan::Persistent<FunctionTemplate> Affine3<T>::constructor;

template<typename T>
std::string Affine3<T>::name;



namespace AffineInit {
	void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
}

#endif