#ifndef _ALVISION_SCALAR_H_
#define _ALVISION_SCALAR_H_

#include "../../alvision.h"
#include "../Vec.h"

namespace scalar_general_callback {
	extern std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback);
}


template <class T>
class Scalar_ : public Vec<cv::Vec<typename T::value_type, 4>>{
public:
	typedef typename T::value_type TVT;
	typedef Vec<cv::Vec<TVT, 4>> TVEC;

	//static std::string Scalar_<T>::name;


	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		Scalar_<T>::name = name;
		scalar_general_callback::overload = overload;
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(scalar_general_callback::callback);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		assert(!TVEC::constructor.IsEmpty() && "cannot initialize derived class before base class");
		ctor->Inherit(Nan::New(TVEC::constructor));

		overload->register_type<Scalar_<T>>(ctor, "scalar", name);

		////! various constructors
		//Scalar_();
		overload->addOverloadConstructor("scalar", name, {}, New_no_params);
		//Scalar_(_Tp v0, _Tp v1, _Tp v2 = 0, _Tp v3 = 0);
		overload->addOverloadConstructor("scalar", name, {
			make_param<TVT>("v0","Number"),
			make_param<TVT>("v1","Number"),
			make_param<TVT>("v2","Number",0),
			make_param<TVT>("v3","Number",0)
		}, New_v0_v1_v2_v3);
		//Scalar_(_Tp v0);
		overload->addOverloadConstructor("scalar", name, {
			make_param<TVT>("v0","Number")
		}, New_v0);
		//
		//template<typename _Tp2, int cn>
		//Scalar_(const Vec<_Tp2, cn>& v);
		//2,3,4,6,8
		overload->addOverloadConstructor("scalar", name, { make_param<Vec<cv::Vec<TVT,2>>*>("v",Vec<cv::Vec<TVT,2>>::name) }, New_vec_2);
		overload->addOverloadConstructor("scalar", name, { make_param<Vec<cv::Vec<TVT,3>>*>("v",Vec<cv::Vec<TVT,3>>::name) }, New_vec_3);
		overload->addOverloadConstructor("scalar", name, { make_param<Vec<cv::Vec<TVT,4>>*>("v",Vec<cv::Vec<TVT,4>>::name) }, New_vec_4);
		overload->addOverloadConstructor("scalar", name, { make_param<Vec<cv::Vec<TVT,6>>*>("v",Vec<cv::Vec<TVT,6>>::name) }, New_vec_6);
		//overload->addOverloadConstructor("scalar", name, { make_param<Vec<cv::Vec<TVT,8>>*>("v",Vec<cv::Vec<TVT,8>>::name) }, New_vec_8);
		//
		////! returns a scalar with all elements set to v0
		//static Scalar_<_Tp> all(_Tp v0);
		overload->addStaticOverload("scalar", name, "all", {
			make_param<TVT>("v0","Number")
		}, all);
		Nan::SetMethod(ctor, "all", scalar_general_callback::callback);
		
		////! conversion to another data type
		//template<typename T2> operator Scalar_<T2>() const;
		//
		////! per-element product
		//Scalar_<_Tp> mul(const Scalar_<_Tp>& a, double scale = 1) const;
		overload->addOverload("scalar", name, "mul", {
			make_param<Scalar_<T>*>("a",name),
			make_param<double>("scale","double",1)
		}, mul);
		Nan::SetPrototypeMethod(ctor, "mul", scalar_general_callback::callback);
		
		//// returns (v0, -v1, -v2, -v3)
		//Scalar_<_Tp> conj() const;
		overload->addOverload("scalar", name, "conj", {}, conj);
		Nan::SetPrototypeMethod(ctor, "conj", scalar_general_callback::callback);
		//
		//// returns true iff v1 == v2 == v3 == 0
		//bool isReal() const;
		overload->addOverload("scalar", name, "isReal", {}, isReal);
		Nan::SetPrototypeMethod(ctor, "isReal", scalar_general_callback::callback);

		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());
	}

	std::shared_ptr<T> _scalar;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor() {
		assert(!constructor.IsEmpty() && "constructor is empty");
		return Nan::New(constructor)->GetFunction();
	}

	template<typename... Args>
	static std::shared_ptr<Scalar_<T>> create(Args&&... args) {
		auto scalar = std::make_shared<Scalar_<T>>();
		scalar->_scalar = std::shared_ptr<T>(new T(std::forward<Args>(args)...));
		scalar->_vec = scalar->_scalar;
		scalar->_matx = scalar->_scalar;
		return scalar;
	}

	virtual cv::_InputArray GetInputArray() {
		return *_scalar;
	}
	virtual cv::_InputArray GetInputArrayOfArrays() {
		return *_scalar;
	}
	virtual cv::_OutputArray GetOutputArray() {
		return *_scalar;
	}
	virtual cv::_OutputArray GetOutputArrayOfArrays() {
		return *_scalar;
	}
	virtual cv::_InputOutputArray GetInputOutputArray() {
		return *_scalar;
	}
	virtual cv::_InputOutputArray GetInputOutputArrayOfArrays() {
		return *_scalar;
	}

	
	static std::shared_ptr<Scalar_<T>> all(double v0) {
		auto scalar = std::make_shared< Scalar_<T>>();
		scalar->_scalar = std::make_shared<T>(T::all(v0));
		scalar->_vec = scalar->_scalar;
		scalar->_matx = scalar->_scalar;
		return scalar;
	}

	
	static POLY_METHOD(New_no_params) {
		auto scalar = new Scalar_<T>();
		scalar->_scalar = std::make_shared<T>();
		scalar->_vec = scalar->_scalar;
		scalar->_matx = scalar->_scalar;

		scalar->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	static POLY_METHOD(New_v0_v1_v2_v3) {
		auto scalar = new Scalar_<T>();
		scalar->_scalar = std::make_shared<T>(info.at<TVT>(0), info.at<TVT>(1), info.at<TVT>(2), info.at<TVT>(3));
		scalar->_vec = scalar->_scalar;
		scalar->_matx = scalar->_scalar;

		scalar->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}
	
	static POLY_METHOD(New_v0) {
		auto scalar = new Scalar_<T>();
		scalar->_scalar = std::make_shared<T>(info.at<TVT>(0));
		scalar->_vec = scalar->_scalar;
		scalar->_matx = scalar->_scalar;

		scalar->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}
	
	static POLY_METHOD(New_vec_2) {
		auto scalar = new Scalar_<T>();
		scalar->_scalar = std::make_shared<T>(*info.at<Vec<cv::Vec<TVT, 2>>*>(0)->_vec);
		scalar->_vec = scalar->_scalar;
		scalar->_matx = scalar->_scalar;

		scalar->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}
	
	static POLY_METHOD(New_vec_3) {
		auto scalar = new Scalar_<T>();
		scalar->_scalar = std::make_shared<T>(*info.at<Vec<cv::Vec<TVT, 3>>*>(0)->_vec);
		scalar->_vec = scalar->_scalar;
		scalar->_matx = scalar->_scalar;

		scalar->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}
	
	static POLY_METHOD(New_vec_4) {
		auto scalar = new Scalar_<T>();
		scalar->_scalar = std::make_shared<T>(*info.at<Vec<cv::Vec<TVT, 4>>*>(0)->_vec);
		scalar->_vec = scalar->_scalar;
		scalar->_matx = scalar->_scalar;

		scalar->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}
	
	static POLY_METHOD(New_vec_6) {
		auto scalar = new Scalar_<T>();
		scalar->_scalar = std::make_shared<T>(*info.at<Vec<cv::Vec<TVT, 6>>*>(0)->_vec);
		scalar->_vec = scalar->_scalar;
		scalar->_matx = scalar->_scalar;

		scalar->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}
	
	static POLY_METHOD(New_vec_8) {
		auto scalar = new Scalar_<T>();
		scalar->_scalar = std::make_shared<T>(*info.at<Vec<cv::Vec<TVT, 8>>*>(0)->_vec);
		scalar->_vec = scalar->_scalar;
		scalar->_matx = scalar->_scalar;

		scalar->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}
	
	static POLY_METHOD(all) {
		auto scalar = new Scalar_<T>();
		scalar->_scalar = std::make_shared<T>(T::all(info.at<TVT>(0)));
		scalar->_vec = scalar->_scalar;
		scalar->_matx = scalar->_scalar;

		
		info.SetReturnValue(scalar);
	}
	
	static POLY_METHOD(mul) {
		auto this_ = *info.This<Scalar_<T>*>()->_scalar;
		
		auto a = info.at<Scalar_<T>*>(0)->_scalar;
		auto scale = info.at<double>(1);
		
		auto ret = new Scalar_<T>();
		ret->_scalar = std::make_shared<T>(this_.mul(*a, scale));
		
		info.SetReturnValue(ret);
	}
	
	static POLY_METHOD(conj) {
		auto this_ = *info.This<Scalar_<T>*>()->_scalar;
	
		auto ret = new Scalar_<T>();
		ret->_scalar = std::make_shared<T>(this_.conj());
	
		info.SetReturnValue(ret);
	}
	
	static POLY_METHOD(isReal) {
		auto this_ = *info.This<Scalar_<T>*>()->_scalar;
	
		info.SetReturnValue(this_.isReal());
	}
	
};


//declare variables
template <typename T>
Nan::Persistent<FunctionTemplate> Scalar_<T>::constructor;

//template <typename T>
//std::string Scalar_<T>::name;



typedef Scalar_<cv::Scalar_<double>> Scalar;

namespace ScalarInit {
	void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
}

#endif