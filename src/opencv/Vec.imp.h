#ifndef _ALVISION_VEC_IMP_H_
#define _ALVISION_VEC_IMP_H_
//#include "OpenCV.h"
#include "../alvision.h"

#include "Vec.h"
#include "MatxAndVec.h"


#include "Matrix.h"
#include "TrackedElement.h"
#include "TrackedPtr.h"
#include "Matx.h"
#include "array_accessors/Vec_array_accessor.h"

namespace vec_general_callback {
	extern std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback);
}

template <typename T>
void Vec<T>::Register(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
	Vec<T>::name = name;
}

template <typename T>
void Vec<T>::Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		vec_general_callback::overload = overload;
		VecT::name = name;

		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(vec_general_callback::callback);
		VecT::constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		//if (Matx<mat_type>::constructor.IsEmpty()) {
		//	printf(GetTypeName<Matx<mat_type>>().c_str());
		assert(!Matx<mat_type>::constructor.IsEmpty() && "cannot initialize derived class before base class");
		//}
		ctor->Inherit(Nan::New(Matx<mat_type>::constructor));

		overload->register_type<VecT>(ctor, "vec", name);


		overload->addOverloadConstructor("vec", name, {}, New_no_parameters);
		//Vec();

		//Vec(_Tp v0); //!< 1-element vector constructor
		overload->addOverloadConstructor("vec", name, { make_param<TVT>("v0","Number") }, New_v0);
		//Vec(_Tp v0, _Tp v1); //!< 2-element vector constructor
		overload->addOverloadConstructor("vec", name, { make_param<TVT>("v0","Number"), make_param<TVT>("v1","Number") }, New_v0_v1);
		//Vec(_Tp v0, _Tp v1, _Tp v2); //!< 3-element vector constructor
		overload->addOverloadConstructor("vec", name, { make_param<TVT>("v0","Number"), make_param<TVT>("v1","Number"), make_param<TVT>("v2","Number") }, New_v0_v1_v2);
		//Vec(_Tp v0, _Tp v1, _Tp v2, _Tp v3); //!< 4-element vector constructor
		overload->addOverloadConstructor("vec", name, { make_param<TVT>("v0","Number"), make_param<TVT>("v1","Number"), make_param<TVT>("v2","Number"), make_param<TVT>("v3","Number") }, New_v0_v1_v2_v3);
		//Vec(_Tp v0, _Tp v1, _Tp v2, _Tp v3, _Tp v4); //!< 5-element vector constructor
		overload->addOverloadConstructor("vec", name, { make_param<TVT>("v0","Number"), make_param<TVT>("v1","Number"), make_param<TVT>("v2","Number"), make_param<TVT>("v3","Number"), make_param<TVT>("v4","Number") }, New_v0_v1_v2_v3_v4);
		//Vec(_Tp v0, _Tp v1, _Tp v2, _Tp v3, _Tp v4, _Tp v5); //!< 6-element vector constructor
		overload->addOverloadConstructor("vec", name, { make_param<TVT>("v0","Number"), make_param<TVT>("v1","Number"), make_param<TVT>("v2","Number"), make_param<TVT>("v3","Number"), make_param<TVT>("v4","Number"), make_param<TVT>("v5","Number") }, New_v0_v1_v2_v3_v4_v5);
		//Vec(_Tp v0, _Tp v1, _Tp v2, _Tp v3, _Tp v4, _Tp v5, _Tp v6); //!< 7-element vector constructor
		overload->addOverloadConstructor("vec", name, { make_param<TVT>("v0","Number"), make_param<TVT>("v1","Number"), make_param<TVT>("v2","Number"), make_param<TVT>("v3","Number"), make_param<TVT>("v4","Number"), make_param<TVT>("v5","Number"), make_param<TVT>("v6","Number") }, New_v0_v1_v2_v3_v4_v5_v6);
		//Vec(_Tp v0, _Tp v1, _Tp v2, _Tp v3, _Tp v4, _Tp v5, _Tp v6, _Tp v7); //!< 8-element vector constructor
		overload->addOverloadConstructor("vec", name, { make_param<TVT>("v0","Number"), make_param<TVT>("v1","Number"), make_param<TVT>("v2","Number"), make_param<TVT>("v3","Number"), make_param<TVT>("v4","Number"), make_param<TVT>("v5","Number"), make_param<TVT>("v6","Number"), make_param<TVT>("v7","Number") }, New_v0_v1_v2_v3_v4_v5_v6_v7);
		//Vec(_Tp v0, _Tp v1, _Tp v2, _Tp v3, _Tp v4, _Tp v5, _Tp v6, _Tp v7, _Tp v8); //!< 9-element vector constructor
		overload->addOverloadConstructor("vec", name, { make_param<TVT>("v0","Number"), make_param<TVT>("v1","Number"), make_param<TVT>("v2","Number"), make_param<TVT>("v3","Number"), make_param<TVT>("v4","Number"), make_param<TVT>("v5","Number"), make_param<TVT>("v6","Number"), make_param<TVT>("v7","Number"), make_param<TVT>("v8","Number") }, New_v0_v1_v2_v3_v4_v5_v6_v7_v8);
		//Vec(_Tp v0, _Tp v1, _Tp v2, _Tp v3, _Tp v4, _Tp v5, _Tp v6, _Tp v7, _Tp v8, _Tp v9); //!< 10-element vector constructor
		overload->addOverloadConstructor("vec", name, { make_param<TVT>("v0","Number"), make_param<TVT>("v1","Number"), make_param<TVT>("v2","Number"), make_param<TVT>("v3","Number"), make_param<TVT>("v4","Number"), make_param<TVT>("v5","Number"), make_param<TVT>("v6","Number"), make_param<TVT>("v7","Number"), make_param<TVT>("v8","Number"), make_param<TVT>("v9","Number") }, New_v0_v1_v2_v3_v4_v5_v6_v7_v8_v9);

		//Vec(_Tp v0, _Tp v1, _Tp v2, _Tp v3, _Tp v4, _Tp v5, _Tp v6, _Tp v7, _Tp v8, _Tp v9, _Tp v10, _Tp v11, _Tp v12, _Tp v13); //!< 14-element vector constructor
		overload->addOverloadConstructor("vec", name, { make_param<TVT>("v0","Number"), make_param<TVT>("v1","Number"), make_param<TVT>("v2","Number"), make_param<TVT>("v3","Number"), make_param<TVT>("v4","Number"), make_param<TVT>("v5","Number"), make_param<TVT>("v6","Number"), make_param<TVT>("v7","Number"), make_param<TVT>("v8","Number"), make_param<TVT>("v9","Number"), make_param<TVT>("v10","Number"), make_param<TVT>("v11","Number"), make_param<TVT>("v12","Number"), make_param<TVT>("v13","Number") }, New_v0_v1_v2_v3_v4_v5_v6_v7_v8_v9_v10_v11_v12_v13);

		//explicit Vec(const _Tp* values);
		overload->addOverloadConstructor("vec", name, { make_param<std::shared_ptr<std::vector<TVT>>>("values","Array<Number>") }, New_values);

		//Vec(const Vec<_Tp, cn>& v);
		overload->addOverloadConstructor("vec", name, { make_param<VecT*>("v",name) }, New_vec);

		//static Vec all(_Tp alpha);
		overload->addStaticOverload("vec", name, "all", { make_param<TVT>("alpha",name) }, all_T);
		Nan::SetMethod(ctor, "all", vec_general_callback::callback);

		////! per-element multiplication
		//Vec mul(const Vec<_Tp, cn>& v) const;
		overload->addOverload("vec", name, "mul", { make_param < VecT*>("v",name) }, mul_vec);
		Nan::SetPrototypeMethod(ctor, "mul", vec_general_callback::callback);

		////! conjugation (makes sense for complex numbers and quaternions)
		//Vec conj() const;
		overload->addOverload("vec", name, "conj", {}, conj);;
		Nan::SetPrototypeMethod(ctor, "conj", vec_general_callback::callback);


		///*!
		//cross product of the two 3D vectors.

		//For other dimensionalities the exception is raised
		//*/
		//Vec cross(const Vec& v) const;
		overload->addOverload("vec", name, "cross", { make_param < VecT*>("v",name) }, cross_vec);
		Nan::SetPrototypeMethod(ctor, "cross", vec_general_callback::callback);
		////! conversion to another data type
		//template<typename T2> operator Vec<T2, cn>() const;

		///*! element access */
		//const _Tp& operator [](int i) const;
		//_Tp& operator[](int i);
		//const _Tp& operator ()(int i) const;
		//_Tp& operator ()(int i);
		//overload->addOverload("vec", name, "ptr", { make_param<std::string>("type","String"),make_param<int>("i0","int",0),make_param<int>("i1","int",0),make_param<int>("i2","int",0) }, ptr);
		//Nan::SetPrototypeMethod(ctor, "ptr", vec_general_callback::callback);
		//
		overload->addOverload("vec", name, "at", { make_param<int>("i0","int"),make_param<int>("i1","int",0),make_param<int>("i2","int",0) }, at);
		Nan::SetPrototypeMethod(ctor, "at", vec_general_callback::callback);



		//Vec(const Matx<_Tp, cn, 1>& a, const Matx<_Tp, cn, 1>& b, Matx_AddOp);
		//Vec(const Matx<_Tp, cn, 1>& a, const Matx<_Tp, cn, 1>& b, Matx_SubOp);
		//template<typename _T2> Vec(const Matx<_Tp, cn, 1>& a, _T2 alpha, Matx_ScaleOp);


		//op_Addition(a: VecT | _st.float | _st.double | _st.int, b : VecT | _st.float | _st.double | _st.int) : VecT;
		overload->addStaticOverload("vec", name, "op_Addition", { make_param<VecT*>("a",name), make_param<VecT*>("b",name) }, op_Addition_vec_vec);
		overload->addStaticOverload("vec", name, "op_Addition", { make_param<double>("a","Number"), make_param<VecT*>("b",name) }, op_Addition_num_vec);
		overload->addStaticOverload("vec", name, "op_Addition", { make_param<VecT*>("a",name), make_param<double>("b","Number") }, op_Addition_vec_num);

		Nan::SetMethod(ctor, "op_Addition", vec_general_callback::callback);
		//op_Multiplication(a: VecT | _st.float | _st.double | _st.int, b : VecT | _st.float | _st.double | _st.int) : VecT;
		/*overload->addStaticOverload("vec", name, "op_Multiplication", { make_param<VecT*>("a",name), make_param<VecT*>("b",name) },			 op_Multiplication_vec_vec);
		overload->addStaticOverload("vec", name, "op_Multiplication", { make_param<double>("a","Number"), make_param<VecT*>("b",name) }, op_Multiplication_num_vec);*/
		overload->addStaticOverload("vec", name, "op_Multiplication", { make_param<VecT*>("a",name), make_param<double>("b","Number") }, op_Multiplication_vec_num);

		Nan::SetMethod(ctor, "op_Multiplication", vec_general_callback::callback);


		//op_Division(a: VecT | _st.float | _st.double | _st.int, b : VecT | _st.float | _st.double | _st.int) : VecT;
		/*overload->addStaticOverload("vec", name, "op_Division", { make_param<VecT*>("a",name), make_param<VecT*>("b",name) },          op_Division_vec_vec);
		overload->addStaticOverload("vec", name, "op_Division", { make_param<double>("a","Number"), make_param<VecT*>("b",name) }, op_Division_num_vec);*/
		overload->addStaticOverload("vec", name, "op_Division", { make_param<VecT*>("a",name), make_param<double>("b","Number") }, op_Division_vec_num);

		Nan::SetMethod(ctor, "op_Division", vec_general_callback::callback);


		//op_Substraction(a: VecT | _st.float | _st.double | _st.int, b: VecT | _st.float | _st.double | _st.int): VecT;
		overload->addStaticOverload("vec", name, "op_Substraction", { make_param<VecT*>("a",name), make_param<VecT*>("b",name) }, op_Substraction_vec_vec);
		overload->addStaticOverload("vec", name, "op_Substraction", { make_param<double>("a","Number"), make_param<VecT*>("b",name) }, op_Substraction_num_vec);
		overload->addStaticOverload("vec", name, "op_Substraction", { make_param<VecT*>("a",name), make_param<double>("b","Number") }, op_Substraction_vec_num);

		Nan::SetMethod(ctor, "op_Substraction", vec_general_callback::callback);

		//
		//			//template < typename _Tp, int m, int n> static inline
		//			//Vec < _Tp, m > operator * (const Matx<_Tp, m, n>& a, const Vec<_Tp, n>& b)
		//			//    {
		//			//        Matx<_Tp, m, 1> c(a, b, Matx_MatMulOp());
		//			//return (const Vec<_Tp, m>&)(c);
		//			//}
		//			op_Multiplication(a: Matx<T>, b : VecT) : Matx<T>;
		overload->addStaticOverload("matx", name, "op_Multiplication", { make_param<Matx<mat_type>*>("a",name), make_param<Vec<cv::Vec<TVT,TCOLS>>*>("b",Vec<cv::Vec<TVT,TCOLS>>::name) }, op_Multiplication_matx_vec);
		Nan::SetMethod(ctor, "op_Multiplication", vec_general_callback::callback);



		////norm(m ? : VecT) : _st.double;
		overload->addStaticOverload("vec", name, "norm", { make_param<VecT*>("m",name) }, norm_vec);
		Nan::SetMethod(ctor, "norm", vec_general_callback::callback);

		Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("data").ToLocalChecked(), data_getter);

		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());


	}

	//template <typename T>
	//std::shared_ptr<T> _vec;

	//static std::string VecT::name;

	template <typename T>
	Nan::Persistent<FunctionTemplate> Vec<T>::constructor;

	template <typename T>
	v8::Local<v8::Function> Vec<T>::get_constructor() {
		assert(!constructor.IsEmpty() && "constructor is empty");
		return Nan::New(constructor)->GetFunction();
	}

	//template <typename T>
	//Vec<T> * Vec<T>::from(T &vec_) {
	//	auto vec = new VecT();
	//	vec->_vec = std::make_shared<T>(vec_);
	//	vec->_matx = vec->_vec;
	//	return vec;
	//}

	template <typename T>
	std::shared_ptr<Vec<T>> Vec<T>::all(TVT value) {
		auto vec = std::make_shared<Vec<T>>();
		vec->_vec = std::make_shared<T>(T::all(value));
		vec->_matx = vec->_vec;
		return vec;
	}

	template <typename T>
	 cv::_InputArray Vec<T>::GetInputArray() {
		return *_vec;
	}

	template <typename T>
	 cv::_InputArray Vec<T>::GetInputArrayOfArrays() {
		return *_vec;
	}

	template <typename T>
	 cv::_OutputArray Vec<T>::GetOutputArray() {
		return *_vec;
	}

	template <typename T>
	 cv::_OutputArray Vec<T>::GetOutputArrayOfArrays() {
		return *_vec;
	}

	template <typename T>
	 cv::_InputOutputArray Vec<T>::GetInputOutputArray() {
		return *_vec;
	}

	template <typename T>
	 cv::_InputOutputArray Vec<T>::GetInputOutputArrayOfArrays() {
		return *_vec;
	}

	/*static NAN_METHOD(New) {
	if (info.This()->InternalFieldCount() == 0)
	Nan::ThrowTypeError("Cannot instantiate without new");


	Vec *size;
	size = new Vec();

	size->Wrap(info.Holder());

	info.GetReturnValue().Set(info.Holder());
	}*/

	template <typename T>
	POLY_METHOD(Vec<T>::New_no_parameters) {
		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>();
		vec->_matx = vec->_vec;
		vec->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Vec<T>::New_v0) {
		if (info.Length() < T::channels) {
			throw std::exception((std::string("constructor for Vec with ") + std::to_string(T::channels) + " should be called with the appropriate number of parameters").c_str());
		}

		Vec<T>::TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<Vec<T>::TVT>(i);
		}

		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>((TVT*)&values);
		vec->_matx = vec->_vec;
		vec->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Vec<T>::New_v0_v1) {
		if (info.Length() < T::channels) {
			throw std::exception((std::string("constructor for Vec with ") + std::to_string(T::channels) + " should be called with the appropriate number of parameters").c_str());
		}

		Vec<T>::TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<TVT>(i);
		}

		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>((TVT*)&values);
		vec->_matx = vec->_vec;
		vec->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Vec<T>::New_v0_v1_v2) {
		if (info.Length() < T::channels) {
			throw std::exception((std::string("constructor for Vec with ") + std::to_string(T::channels) + " should be called with the appropriate number of parameters").c_str());
		}

		Vec<T>::TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<Vec<T>::TVT>(i);
		}

		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>((Vec<T>::TVT*)&values);
		vec->_matx = vec->_vec;
		vec->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Vec<T>::New_v0_v1_v2_v3) {
		if (info.Length() < T::channels) {
			throw std::exception((std::string("constructor for Vec with ") + std::to_string(T::channels) + " should be called with the appropriate number of parameters").c_str());
		}

		Vec<T>::TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<Vec<T>::TVT>(i);
		}

		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>((Vec<T>::TVT*)&values);
		vec->_matx = vec->_vec;
		vec->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Vec<T>::New_v0_v1_v2_v3_v4) {
		if (info.Length() < T::channels) {
			throw std::exception((std::string("constructor for Vec with ") + std::to_string(T::channels) + " should be called with the appropriate number of parameters").c_str());
		}
		Vec<T>::TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<Vec<T>::TVT>(i);
		}

		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>((Vec<T>::TVT*)&values);
		vec->_matx = vec->_vec;
		vec->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Vec<T>::New_v0_v1_v2_v3_v4_v5) {
		if (info.Length() < T::channels) {
			throw std::exception((std::string("constructor for Vec with ") + std::to_string(T::channels) + " should be called with the appropriate number of parameters").c_str());
		}

		Vec<T>::TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<Vec<T>::TVT>(i);
		}

		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>((Vec<T>::TVT*)&values);
		vec->_matx = vec->_vec;
		vec->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Vec<T>::New_v0_v1_v2_v3_v4_v5_v6) {
		if (info.Length() < T::channels) {
			throw std::exception((std::string("constructor for Vec with ") + std::to_string(T::channels) + " should be called with the appropriate number of parameters").c_str());
		}

		Vec<T>::TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<Vec<T>::TVT>(i);
		}

		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>((Vec<T>::TVT*)&values);
		vec->_matx = vec->_vec;
		vec->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Vec<T>::New_v0_v1_v2_v3_v4_v5_v6_v7) {
		if (info.Length() < T::channels) {
			throw std::exception((std::string("constructor for Vec with ") + std::to_string(T::channels) + " should be called with the appropriate number of parameters").c_str());
		}

		Vec<T>::TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<Vec<T>::TVT>(i);
		}

		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>((Vec<T>::TVT*)&values);
		vec->_matx = vec->_vec;
		vec->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Vec<T>::New_v0_v1_v2_v3_v4_v5_v6_v7_v8) {
		if (info.Length() < T::channels) {
			throw std::exception((std::string("constructor for Vec with ") + std::to_string(T::channels) + " should be called with the appropriate number of parameters").c_str());
		}

		Vec<T>::TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<Vec<T>::TVT>(i);
		}

		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>((Vec<T>::TVT*)&values);
		vec->_matx = vec->_vec;
		vec->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Vec<T>::New_v0_v1_v2_v3_v4_v5_v6_v7_v8_v9) {
		if (info.Length() < T::channels) {
			throw std::exception((std::string("constructor for Vec with ") + std::to_string(T::channels) + " should be called with the appropriate number of parameters").c_str());
		}

		Vec<T>::TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<Vec<T>::TVT>(i);
		}

		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>((Vec<T>::TVT*)&values);
		vec->_matx = vec->_vec;
		vec->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Vec<T>::New_v0_v1_v2_v3_v4_v5_v6_v7_v8_v9_v10_v11_v12_v13) {
		if (info.Length() < T::channels) {
			throw std::exception((std::string("constructor for Vec with ") + std::to_string(T::channels) + " should be called with the appropriate number of parameters").c_str());
		}

		Vec<T>::TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<Vec<T>::TVT>(i);
		}

		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>((Vec<T>::TVT*)&values);
		vec->_matx = vec->_vec;
		vec->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Vec<T>::New_values) {
		if (info.Length() < T::channels) {
			throw std::exception((std::string("constructor for Vec with ") + std::to_string(T::channels) + " should be called with the appropriate number of parameters").c_str());
		}


		auto vec = new Vec<T>::VecT();

		auto vparams = *info.at<std::shared_ptr<std::vector<Vec<T>::TVT>>>(0);

		auto len = T::channels;
		std::vector<Vec<T>::TVT> values(len);
		for (auto i = 0; i < vparams.size(); i++) {
			values[i] = vparams[i];
		}
		for (auto i = vparams.size(); i < len; i++) {
			values[i] = 0;
		}

		vec->_vec = std::make_shared<T>(&values[0]);
		vec->_matx = vec->_vec;
		vec->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Vec<T>::New_vec) {

		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>(*info.at<Vec<T>::VecT*>(0)->_vec);
		vec->_matx = vec->_vec;
		vec->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Vec<T>::all_T) {
		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>(info.at<Vec<T>::TVT>(0));
		vec->_matx = vec->_vec;
		info.SetReturnValue(vec);
	}

	template <typename T>
	POLY_METHOD(Vec<T>::mul_vec) {
		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>(info.This<Vec<T>::VecT*>()->_vec->mul(*info.at<Vec<T>::VecT*>(0)->_vec));
		vec->_matx = vec->_vec;
		info.SetReturnValue(vec);
	}

	//POLY_METHOD(Vec<T>::conj);
	//
	//POLY_METHOD(Vec<T>::cross_vec);

	//POLY_METHOD(Vec<T>::ptr) {
	//	auto this_ = info.This<VecT*>();

	//	auto tptr = new TrackedPtr<VecT>();
	//	tptr->_from = std::make_shared<Vec_array_accessor<T>>(this_->_vec, info.at<std::string>(0), info.at<int>(1), info.at<int>(2), info.at<int>(3));
	//	info.SetReturnValue(tptr);
	//}

	template <typename T>
	POLY_METHOD(Vec<T>::at) {
		auto vec = info.This<Vec<T>::VecT*>()->_vec;

		auto tat = new TrackedElement<T>();
		tat->_from = std::make_shared<Vec_array_accessor<T>>(vec, info.at<int>(0), info.at<int>(1), info.at<int>(2));

		info.SetReturnValue(tat);
	}

	template <typename T>
	POLY_METHOD(Vec<T>::op_Addition_vec_vec) {
		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>((*info.at<Vec<T>::VecT*>(0)->_vec) + (*info.at<Vec<T>::VecT*>(0)->_vec));
		vec->_matx = vec->_vec;
		info.SetReturnValue(vec);
	}

	template <typename T>
	POLY_METHOD(Vec<T>::op_Addition_num_vec) {
		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>(T::all(info.at<double>(0)) + (*info.at<Vec<T>::VecT*>(0)->_vec));
		vec->_matx = vec->_vec;
		info.SetReturnValue(vec);
	}

	template <typename T>
	POLY_METHOD(Vec<T>::op_Addition_vec_num) {
		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>((*info.at<Vec<T>::VecT*>(0)->_vec) + T::all(info.at<double>(0)));
		vec->_matx = vec->_vec;
		info.SetReturnValue(vec);
	}


	/*POLY_METHOD(Vec<T>::op_Multiplication_vec_vec) {
	auto vec = new VecT();
	vec->_vec = std::make_shared<T>((*info.at<VecT*>(0)->_vec) * (*info.at<VecT*>(0)->_vec));
	info.SetReturnValue(vec);
	}
	POLY_METHOD(Vec<T>::op_Multiplication_num_vec) {
	auto vec = new VecT();
	vec->_vec = std::make_shared<T>((info.at<double>(0)) * (*info.at<VecT*>(0)->_vec));
	info.SetReturnValue(vec);
	}*/

	template <typename T>
	POLY_METHOD(Vec<T>::op_Multiplication_vec_num) {
		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>((*info.at<Vec<T>::VecT*>(0)->_vec) * (info.at<double>(0)));
		vec->_matx = vec->_vec;
		info.SetReturnValue(vec);
	}


	/*POLY_METHOD(Vec<T>::op_Division_vec_vec) {
	auto vec = new VecT();
	vec->_vec = std::make_shared<T>((*info.at<VecT*>(0)->_vec) / (*info.at<VecT*>(0)->_vec));
	info.SetReturnValue(vec);
	}*/
	/*POLY_METHOD(Vec<T>::op_Division_num_vec) {
	auto vec = new VecT();
	vec->_vec = std::make_shared<T>(T::all(info.at<double>(0)) / (*info.at<VecT*>(0)->_vec));
	info.SetReturnValue(vec);
	}*/

	template <typename T>
	POLY_METHOD(Vec<T>::op_Division_vec_num) {
		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>((*info.at<Vec<T>::VecT*>(0)->_vec) / (info.at<double>(0)));
		vec->_matx = vec->_vec;
		info.SetReturnValue(vec);
	}

	template <typename T>
	POLY_METHOD(Vec<T>::op_Substraction_vec_vec) {
		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>((*info.at<Vec<T>::VecT*>(0)->_vec) - (*info.at<VecT*>(0)->_vec));
		vec->_matx = vec->_vec;
		info.SetReturnValue(vec);
	}

	template <typename T>
	POLY_METHOD(Vec<T>::op_Substraction_num_vec) {
		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>(T::all(info.at<double>(0)) - (*info.at<VecT*>(0)->_vec));
		vec->_matx = vec->_vec;
		info.SetReturnValue(vec);
	}

	template <typename T>
	POLY_METHOD(Vec<T>::op_Substraction_vec_num) {
		auto vec = new Vec<T>::VecT();
		vec->_vec = std::make_shared<T>((*info.at<Vec<T>::VecT*>(0)->_vec) - T::all(info.at<double>(0)));
		vec->_matx = vec->_vec;
		info.SetReturnValue(vec);
	}

	template <typename T>
	POLY_METHOD(Vec<T>::norm_vec) {
		info.SetReturnValue(cv::norm(*info.at<VecT*>(0)->_vec));
	}

	template <typename T>
	POLY_METHOD(Vec<T>::op_Multiplication_matx_vec) {
		auto matx = new Matx<T>();

		auto a = *info.at<Matx<T>*>(0)->_matx;
		auto b = *info.at < Vec<cv::Vec<Vec<T>::TVT, TCOLS>>*>(1)->_vec;

		matx->_matx = std::make_shared<T>(a * b);

		info.SetReturnValue(matx);
	}

	template <typename T>
	NAN_GETTER(Vec<T>::data_getter) {
		auto this_ = overres::ObjectWrap::Unwrap<VecT>(info.This());
		auto vec = this_->_vec;

		auto data = Nan::New<v8::Array>();

		Vec_array_accessor<T> accessor(vec, 0, 0, 0);
		for (auto i = 0; i < accessor.length(); i++) {
			data->Set(i, accessor.get(i));
		}
		info.GetReturnValue().Set(data);

	}







//declare variables
//template <typename T>
//Nan::Persistent<FunctionTemplate> Vec<T>::constructor;

template<typename T>
POLY_METHOD(Vec<T>::conj) {
	throw std::exception("not implemented for type, only implemented for Vec<float,2>, Vec<double,2>, Vec<float,4>, Vec<double,4>");
}

template<typename T>
POLY_METHOD(conj_imp) {
	auto vec = new Vec<T>();
	vec->_vec = std::make_shared<T>(info.This<Vec<T>*>()->_vec->conj());
	info.SetReturnValue(vec);
}





template<typename T, int TCN>
class cross_vec_imp {
public:
	static POLY_METHOD(execute) {
		throw std::exception("cross-product is valid only for 3 channels");
	}
};

template<typename T>
class cross_vec_imp<T, 3> {
public:
	typedef typename Vec<cv::Vec<T, 3>> VecT;
	static POLY_METHOD(execute) {
		auto vec = new VecT();
		vec->_vec = std::make_shared<cv::Vec<T, 3>>(info.This<VecT*>()->_vec->cross(*info.at<VecT*>(0)->_vec));
		info.SetReturnValue(vec);
	}

};


template <typename T>
POLY_METHOD(Vec<T>::cross_vec) {
	cross_vec_imp<typename T::value_type, T::channels>::execute(info);
}

//template <typename T>
//std::string VecT::name;


namespace VecInit {
	void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
}

#endif