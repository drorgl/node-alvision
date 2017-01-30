#ifndef _ALVISION_MATX_IMP_H_
#define _ALVISION_MATX_IMP_H_

#include "../alvision.h"

#include "Matx.h"


#include <typeinfo>
#include <class_typename.h>
#include "IOArray.h"
#include "array_accessors/Matx_array_accessor.h"

namespace matx_general_callback {
	extern std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback);
}

template <typename T>
void Matx<T>::Register(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
	Matx<T>::name = name;
}

template <typename T>
	void Matx<T>::Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		matx_general_callback::overload = overload;
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(matx_general_callback::callback);
		Matx<T>::constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		
		overload->register_type<Matx<T>>(ctor, "matx", name);

		assert(!IOArray::constructor.IsEmpty() && "cannot initialize derived class before base class");
		ctor->Inherit(Nan::New(IOArray::constructor));


		//			new () : Matx<T>;
		overload->addOverloadConstructor("matx", name,{}, New_no_params);
		//			new (v0: T) : Matx<T>; //!< 1x1 matrix
		overload->addOverloadConstructor("matx", name,{ make_param<TVT>("v0","Number") }, New_v0);
		//			new (v0: T, v1 : T) : Matx<T>; //!< 1x2 or 2x1 matrix
		overload->addOverloadConstructor("matx", name,{ make_param<TVT>("v0","Number"),make_param<TVT>("v1","Number") }, New_v0_v1);
		//			new (v0: T, v1 : T, v2 : T) : Matx<T>; //!< 1x3 or 3x1 matrix
		overload->addOverloadConstructor("matx", name,{ make_param<TVT>("v0","Number"),make_param<TVT>("v1","Number"),make_param<TVT>("v2","Number") }, New_v0_v1_v2);
		//			new (v0: T, v1 : T, v2 : T, v3 : T) : Matx<T>; //!< 1x4, 2x2 or 4x1 matrix
		overload->addOverloadConstructor("matx", name,{ make_param<TVT>("v0","Number"),make_param<TVT>("v1","Number"),make_param<TVT>("v2","Number")
			,make_param<TVT>("v3","Number")
		}, New_v0_v1_v2_v3);
		//			new (v0: T, v1 : T, v2 : T, v3 : T, v4 : T) : Matx<T>; //!< 1x5 or 5x1 matrix
		overload->addOverloadConstructor("matx", name,{ make_param<TVT>("v0","Number"),make_param<TVT>("v1","Number"),make_param<TVT>("v2","Number")
			,make_param<TVT>("v3","Number"),make_param<TVT>("v4","Number")
		}, New_v0_v1_v2_v3_v4);

		//			new (v0: T, v1 : T, v2 : T, v3 : T, v4 : T, v5 : T) : Matx<T>; //!< 1x6, 2x3, 3x2 or 6x1 matrix
		overload->addOverloadConstructor("matx", name,{ make_param<TVT>("v0","Number"),make_param<TVT>("v1","Number"),make_param<TVT>("v2","Number")
			,make_param<TVT>("v3","Number"),make_param<TVT>("v4","Number"),make_param<TVT>("v5","Number")
		}, New_v0_v1_v2_v3_v4_v5);

		//			new (v0: T, v1 : T, v2 : T, v3 : T, v4 : T, v5 : T, v6 : T) : Matx<T>; //!< 1x7 or 7x1 matrix
		overload->addOverloadConstructor("matx", name,{ make_param<TVT>("v0","Number"),make_param<TVT>("v1","Number"),make_param<TVT>("v2","Number")
			,make_param<TVT>("v3","Number"),make_param<TVT>("v4","Number"),make_param<TVT>("v5","Number"),make_param<TVT>("v6","Number")
		}, New_v0_v1_v2_v3_v4_v5_v6);

		//			new (v0: T, v1 : T, v2 : T, v3 : T, v4 : T, v5 : T, v6 : T, v7 : T) : Matx<T>; //!< 1x8, 2x4, 4x2 or 8x1 matrix
		overload->addOverloadConstructor("matx", name,{ make_param<TVT>("v0","Number"),make_param<TVT>("v1","Number"),make_param<TVT>("v2","Number")
			,make_param<TVT>("v3","Number"),make_param<TVT>("v4","Number"),make_param<TVT>("v5","Number"),make_param<TVT>("v6","Number")
			,make_param<TVT>("v7","Number")
		}, New_v0_v1_v2_v3_v4_v5_v6_v7);

		//			new (v0: T, v1 : T, v2 : T, v3 : T, v4 : T, v5 : T, v6 : T, v7 : T, v8 : T) : Matx<T>; //!< 1x9, 3x3 or 9x1 matrix
		overload->addOverloadConstructor("matx", name,{ make_param<TVT>("v0","Number"),make_param<TVT>("v1","Number"),make_param<TVT>("v2","Number")
			,make_param<TVT>("v3","Number"),make_param<TVT>("v4","Number"),make_param<TVT>("v5","Number"),make_param<TVT>("v6","Number")
			,make_param<TVT>("v7","Number"),make_param<TVT>("v8","Number")
		}, New_v0_v1_v2_v3_v4_v5_v6_v7_v8);

		//			new (v0: T, v1 : T, v2 : T, v3 : T, v4 : T, v5 : T, v6 : T, v7 : T, v8 : T, v9 : T) : Matx<T>; //!< 1x10, 2x5 or 5x2 or 10x1 matrix
		overload->addOverloadConstructor("matx", name,{ make_param<TVT>("v0","Number"),make_param<TVT>("v1","Number"),make_param<TVT>("v2","Number")
			,make_param<TVT>("v3","Number"),make_param<TVT>("v4","Number"),make_param<TVT>("v5","Number"),make_param<TVT>("v6","Number")
			,make_param<TVT>("v7","Number"),make_param<TVT>("v8","Number"),make_param<TVT>("v9","Number")
		}, New_v0_v1_v2_v3_v4_v5_v6_v7_v8_v9);

		//			new(v0 : T, v1 : T, v2 : T, v3 : T,
		//				v4 : T, v5 : T, v6 : T, v7 : T,
		//				v8 : T, v9 : T, v10 : T, v11 : T) : Matx<T>; //!< 1x12, 2x6, 3x4, 4x3, 6x2 or 12x1 matrix
		overload->addOverloadConstructor("matx", name,{ make_param<TVT>("v0","Number"),make_param<TVT>("v1","Number"),make_param<TVT>("v2","Number")
			,make_param<TVT>("v3","Number"),make_param<TVT>("v4","Number"),make_param<TVT>("v5","Number"),make_param<TVT>("v6","Number")
			,make_param<TVT>("v7","Number"),make_param<TVT>("v8","Number"),make_param<TVT>("v9","Number"),make_param<TVT>("v10","Number"),make_param<TVT>("v11","Number")
		}, New_v0_v1_v2_v3_v4_v5_v6_v7_v8_v9_v10_v11);

		//			new(v0 : T, v1 : T, v2 : T, v3 : T,
		//				v4 : T, v5 : T, v6 : T, v7 : T,
		//				v8 : T, v9 : T, v10 : T, v11 : T,
		//				v12 : T, v13 : T) : Matx<T>; //!< 1x14, 2x7, 7x2 or 14x1 matrix
		overload->addOverloadConstructor("matx", name,{ make_param<TVT>("v0","Number"),make_param<TVT>("v1","Number"),make_param<TVT>("v2","Number")
			,make_param<TVT>("v3","Number"),make_param<TVT>("v4","Number"),make_param<TVT>("v5","Number"),make_param<TVT>("v6","Number")
			,make_param<TVT>("v7","Number"),make_param<TVT>("v8","Number"),make_param<TVT>("v9","Number"),make_param<TVT>("v10","Number"),make_param<TVT>("v11","Number")
			,make_param<TVT>("v12","Number"),make_param<TVT>("v13","Number")
		}, New_v0_v1_v2_v3_v4_v5_v6_v7_v8_v9_v10_v11_v12_v13);

		//			new(v0 : T, v1 : T, v2 : T, v3 : T,
		//				v4 : T, v5 : T, v6 : T, v7 : T,
		//				v8 : T, v9 : T, v10 : T, v11 : T,
		//				v12, _v13 : T, v14 : T, v15 : T) : Matx<T>; //!< 1x16, 4x4 or 16x1 matrix
		overload->addOverloadConstructor("matx", name,{ make_param<TVT>("v0","Number"),make_param<TVT>("v1","Number"),make_param<TVT>("v2","Number")
			,make_param<TVT>("v3","Number"),make_param<TVT>("v4","Number"),make_param<TVT>("v5","Number"),make_param<TVT>("v6","Number")
			,make_param<TVT>("v7","Number"),make_param<TVT>("v8","Number"),make_param<TVT>("v9","Number"),make_param<TVT>("v10","Number"),make_param<TVT>("v11","Number")
			,make_param<TVT>("v12","Number"),make_param<TVT>("v13","Number"),make_param<TVT>("v14","Number"),make_param<TVT>("v15","Number")
		}, New_v0_v1_v2_v3_v4_v5_v6_v7_v8_v9_v10_v11_v12_v13_v14_v15);

		//			new(vals : Array<T>) : Matx<T>; //!< initialize from a plain array
		overload->addOverloadConstructor("matx", name,{ make_param<std::shared_ptr<std::vector<TVT>>>("vals","Array<Number>") }, New_vals);
		//
		//			all(alpha : T) : Matx<T>;
		overload->addStaticOverload("matx", name, "all",{ make_param<TVT>("alpha","Number") }, all);
		Nan::SetMethod(ctor, "all", matx_general_callback::callback);
		//			zeros() : Matx<T>;
		overload->addStaticOverload("matx", name, "zeros",{}, zeros);
		Nan::SetMethod(ctor, "zeros", matx_general_callback::callback);
		//			ones() : Matx<T>;
		overload->addStaticOverload("matx", name, "ones",{}, ones);
		Nan::SetMethod(ctor, "ones", matx_general_callback::callback);
		//			eye() : Matx<T>;
		overload->addStaticOverload("matx", name, "eye",{}, eye);
		Nan::SetMethod(ctor, "eye", matx_general_callback::callback);
		//			//diag(const diag_type& d): Matx<T>;
		//			randu(a : T, b : T) : Matx<T>;
		overload->addStaticOverload("matx", name, "randu",{ make_param<TVT>("a","Number"), make_param<TVT>("b","Number") }, randu);
		Nan::SetMethod(ctor, "randu", matx_general_callback::callback);
		//			randn(a: T, b : T) : Matx<T>;
		overload->addStaticOverload("matx", name, "randn",{ make_param<TVT>("a","Number"), make_param<TVT>("b","Number") }, randn);
		Nan::SetMethod(ctor, "randn", matx_general_callback::callback);
		//
		//
		//
		//			//template < typename _Tp, int m, int n> static inline
		//			//Matx < _Tp, m, n > operator + (const Matx<_Tp, m, n>& a, const Matx<_Tp, m, n>& b)
		//			//    {
		//			//        return Matx<_Tp, m, n>(a, b, Matx_AddOp());
		//			//}
		//			op_Addition(a: Matx<T>, b : Matx<T>) : Matx<T>;
		overload->addStaticOverload("matx", name, "op_Addition",{ make_param<Matx<T>*>("a",name), make_param<Matx<T>*>("b",name) }, op_Addition_matx_matx);
		Nan::SetMethod(ctor, "op_Addition", matx_general_callback::callback);
		//
		//			//template < typename _Tp, int m, int n> static inline
		//			//Matx < _Tp, m, n > operator - (const Matx<_Tp, m, n>& a, const Matx<_Tp, m, n>& b)
		//			//    {
		//			//        return Matx<_Tp, m, n>(a, b, Matx_SubOp());
		//			//}
		//			op_Substraction(a: Matx<T>, b : Matx<T>) : Matx<T>;
		overload->addStaticOverload("matx", name, "op_Substraction",{ make_param<Matx<T>*>("a",name), make_param<Matx<T>*>("b",name) }, op_Substraction_matx_matx);
		Nan::SetMethod(ctor, "op_Substraction", matx_general_callback::callback);
		//
		//			//template < typename _Tp, int m, int n> static inline
		//			//Matx < _Tp, m, n > operator * (const Matx<_Tp, m, n>& a, int alpha)
		//			//    {
		//			//        return Matx<_Tp, m, n>(a, alpha, Matx_ScaleOp());
		//			//}
		//			op_Multiplication(a: Matx<T>, alpha : _st.int) : Matx<T>;
		overload->addStaticOverload("matx", name, "op_Multiplication",{ make_param<Matx<T>*>("a",name), make_param<double>("alpha","Number") }, op_Multiplication_matx_number);
		Nan::SetMethod(ctor, "op_Multiplication", matx_general_callback::callback);


		//overload->addStaticOverload("matx", name, "op_Multiplication",{
		//	make_param<Matx<T>*>("a",name),
		//	make_param<Vec<T::value_type,T::channels>("b",...)
		//},op_Multiplication_matx_vec)
			//		template<typename _Tp, int m, int n> static inline
			//			Vec<_Tp, m> operator * (const Matx<_Tp, m, n>& a, const Vec<_Tp, n>& b)
			//		{
			//			Matx<_Tp, m, 1> c(a, b, Matx_MatMulOp());
			//			return (const Vec<_Tp, m>&)(c);
			//		}
			//
			//
			//			//template < typename _Tp, int m, int n> static inline
			//			//Matx < _Tp, m, n > operator * (const Matx<_Tp, m, n>& a, float alpha)
			//			//    {
			//			//        return Matx<_Tp, m, n>(a, alpha, Matx_ScaleOp());
			//			//}
			//			op_Multiplication(a: Matx<T>, alpha : _st.float) : Matx<T>;
			//
			//			//template < typename _Tp, int m, int n> static inline
			//			//Matx < _Tp, m, n > operator * (const Matx<_Tp, m, n>& a, double alpha)
			//			//    {
			//			//        return Matx<_Tp, m, n>(a, alpha, Matx_ScaleOp());
			//			//}
			//			op_Multiplication(a: Matx<T>, alpha : _st.double) : Matx<T>;
			//
			//			//template < typename _Tp, int m, int n> static inline
			//			//Matx < _Tp, m, n > operator * (int alpha, const Matx<_Tp, m, n>& a)
			//			//    {
			//			//        return Matx<_Tp, m, n>(a, alpha, Matx_ScaleOp());
			//			//}
			//			op_Multiplication(alpha: _st.int, a : Matx<T>) : Matx<T>;
			overload->addStaticOverload("matx", name, "op_Multiplication",{ make_param<double>("alpha","Number"), make_param<Matx<T>*>("a",name) }, op_Multiplication_number_matx);
		Nan::SetMethod(ctor, "op_Multiplication", matx_general_callback::callback);
		//
		//			//template < typename _Tp, int m, int n> static inline
		//			//Matx < _Tp, m, n > operator * (float alpha, const Matx<_Tp, m, n>& a)
		//			//    {
		//			//        return Matx<_Tp, m, n>(a, alpha, Matx_ScaleOp());
		//			//}
		//			op_Multiplication(alpha: _st.float, a : Matx<T>) : Matx<T>;
		//
		//			//template < typename _Tp, int m, int n> static inline
		//			//Matx < _Tp, m, n > operator * (double alpha, const Matx<_Tp, m, n>& a)
		//			//    {
		//			//        return Matx<_Tp, m, n>(a, alpha, Matx_ScaleOp());
		//			//}
		//			op_Multiplication(alpha: _st.double, a : Matx<T>) : Matx<T>;
		//
		//			//template < typename _Tp, int m, int n> static inline
		//			//Matx < _Tp, m, n > operator - (const Matx<_Tp, m, n>& a)
		//			//    {
		//			//        return Matx<_Tp, m, n>(a, -1, Matx_ScaleOp());
		//			//}
		//			op_Substraction(a: Matx<T>) : Matx<T>;
		overload->addStaticOverload("matx", name, "op_Substraction",{ make_param<Matx<T>*>("a",name) }, op_Substraction_matx_negative);
		Nan::SetMethod(ctor, "op_Substraction", matx_general_callback::callback);
		//
		//			//template < typename _Tp, int m, int n, int l> static inline
		//			//Matx < _Tp, m, n > operator * (const Matx<_Tp, m, l>& a, const Matx<_Tp, l, n>& b)
		//			//    {
		//			//        return Matx<_Tp, m, n>(a, b, Matx_MatMulOp());
		//			//}
		//			op_Multiplication(a: Matx<T>, b : Matx<T>) : Matx<T>;
		overload->addStaticOverload("matx", name, "op_Multiplication",{ make_param<Matx<T>*>("a",name), make_param<Matx<T>*>("b",name) }, op_Multiplication_matx_matx);
		Nan::SetMethod(ctor, "op_Multiplication", matx_general_callback::callback);
		//
		//			//template < typename _Tp, int m, int n> static inline
		//			//bool operator == (const Matx<_Tp, m, n>& a, const Matx<_Tp, m, n>& b)
		//			//    {
		//			//        for( int i = 0; i < m * n; i++ )
		//			//if (a.val[i] != b.val[i]) return false;
		//			//return true;
		//			//}
		//			op_Equals(a: Matx<T>, b : Matx<T>) : boolean;
		overload->addStaticOverload("matx", name, "op_Equals",{ make_param<Matx<T>*>("a",name), make_param<Matx<T>*>("b",name) }, op_Equals_matx_matx);
		Nan::SetMethod(ctor, "op_Equals", matx_general_callback::callback);
		//
		//			//template < typename _Tp, int m, int n> static inline
		//			//bool operator != (const Matx<_Tp, m, n>& a, const Matx<_Tp, m, n>& b)
		//			//    {
		//			//        return !(a == b);
		//			//}
		//			op_NotEquals(a: Matx<T>, b : Matx<T>) : boolean;
		overload->addStaticOverload("matx", name, "op_NotEquals",{ make_param<Matx<T>*>("a",name), make_param<Matx<T>*>("b",name) }, op_NotEquals_matx_matx);
		Nan::SetMethod(ctor, "op_NotEquals", matx_general_callback::callback);
		//
		//
		//			//template < typename _Tp, int m, int n> static inline
		//			norm(m ? : Matx<T>) : _st.double;
		overload->addStaticOverload("matx", name, "norm",{ make_param<Matx<T>*>("a",name) }, norm_matx);
		Nan::SetMethod(ctor, "norm", matx_general_callback::callback);
		//			//double norm(const Matx<_Tp, m, n>& M)
		//			//    {
		//			//        return std::sqrt(normL2Sqr<_Tp, double>(M.val, m * n));
		//			//}
		//
		//			//template < typename _Tp, int m, int n> static inline
		//			//double norm(const Matx<_Tp, m, n>& M, int normType)
		//			//    {
		//			//        switch(normType) {
		//			//    case NORM_INF:
		//			//        return (double)normInf<_Tp, typename DataType<_Tp>::work_type > (M.val, m * n);
		//			//    case NORM_L1:
		//			//return (double)normL1<_Tp, typename DataType<_Tp>::work_type>(M.val, m * n);
		//			//    case NORM_L2SQR:
		//			//return (double)normL2Sqr<_Tp, typename DataType<_Tp>::work_type>(M.val, m * n);
		//			//    default:
		//			//    case NORM_L2:
		//			//return std::sqrt((double)normL2Sqr<_Tp, typename DataType<_Tp>::work_type>(M.val, m * n));
		//			//    }
		//			//}
		//
		//
		//		}
		//
		//		export interface Matx<T> extends _st.IOArray{
		//			//template < typename _Tp, int m, int n> class Matx {
		//			//    public:
		//			//enum { depth = DataType<_Tp>::depth,
		//		depth: _st.int;
		Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("depth").ToLocalChecked(), depth_getter);
		//			//    rows = m,
		//			rows() : _st.int;
		overload->addOverload("matx", name, "rows",{}, rows);
		Nan::SetPrototypeMethod(ctor, "rows", matx_general_callback::callback);
		//			//    cols = n,
		//			cols() : _st.int;
		overload->addOverload("matx", name, "cols",{}, cols);
		Nan::SetPrototypeMethod(ctor, "cols", matx_general_callback::callback);
		//			//    channels = rows * cols,
		//		channels: _st.int;
		Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("channels").ToLocalChecked(), channels_getter);
		//			//    type = CV_MAKETYPE(depth, channels),
		//			type() : _st.int;
		overload->addOverload("matx", name, "type",{}, type);
		Nan::SetPrototypeMethod(ctor, "type", matx_general_callback::callback);
		//			//    shortdim = (m < n ? m : n)
		//			//     };
		//
		//			//typedef _Tp                           value_type;
		//			//typedef Matx< _Tp, m, n > mat_type;
		//			//typedef Matx< _Tp, shortdim, 1 > diag_type;
		//
		//			//! default constructor
		//
		//
		//			//! dot product computed with the default precision
		//			dot(v: Matx<T>) : T
		overload->addOverload("matx", name, "dot",{ make_param<Matx<T>*>("a",name) }, dot_matx);
		Nan::SetPrototypeMethod(ctor, "dot", matx_general_callback::callback);
		//
		//				//! dot product computed in double-precision arithmetics
		//				ddot(v : Matx<T>) : _st.double;
		overload->addOverload("matx", name, "ddot",{ make_param<Matx<T>*>("a",name) }, ddot_matx);
		Nan::SetPrototypeMethod(ctor, "ddot", matx_general_callback::callback);
		//
		//			//! conversion to another data type
		//			//template < typename T2> operator Matx<T2, m, n>() const;
		//
		//			//! change the matrix shape
		//			//template < int m1, int n1> Matx < _Tp, m1, n1 > reshape() const;
		//
		//			//! extract part of the matrix
		//			//template < int m1, int n1> Matx < _Tp, m1, n1 > get_minor(int i, int j) const;
		//
		//			//! extract the matrix row
		//			//Matx < _Tp, 1, n > row(int i) const;
		//
		//			//! extract the matrix column
		//			//Matx < _Tp, m, 1 > col(int i) const;
		//
		//			//! extract the matrix diagonal
		//			//diag_type diag() const;
		//
		//			//! transpose the matrix
		//			//Matx < _Tp, n, m > t() const;
		//
		//			//! invert the matrix
		//			inv(method ? : _base.DecompTypes /*= DECOMP_LU*//*, bool * p_is_ok = NULL*/) : Matx<T>
		overload->addOverload("matx", name, "inv",{
			make_param<int>("method","DecompTypes",cv::DECOMP_LU),
			make_param<std::shared_ptr< or ::Callback>>("cb","Function", nullptr)
		}, inv_method);
		Nan::SetPrototypeMethod(ctor, "inv", matx_general_callback::callback);
		//
		//
		//				////! solve linear system
		//				//template < int l> Matx < _Tp, n, l > solve(const Matx<_Tp, m, l>& rhs, int flags= DECOMP_LU) const;
		//				//Vec < _Tp, n > solve(const Vec<_Tp, m>& rhs, int method) const;
		//
		//				////! multiply two matrices element-wise
		//				//Matx < _Tp, m, n > mul(const Matx<_Tp, m, n>& a) const;
		//
		//				////! divide two matrices element-wise
		//				//Matx < _Tp, m, n > div(const Matx<_Tp, m, n>& a) const;
		//
		//				////! element access
		//				//const _Tp& operator()(int i, int j) const;
		//				//_Tp & operator()(int i, int j);
		//				//Element(i: _st.int, j: _st.int): T;
		//
		//				////! 1D element access
		//				//const _Tp& operator()(int i) const;
		//				//_Tp & operator()(int i);
		//				//Element(i: _st.int): T;
		//				at(i0: _st.int, i1 ? : _st.int, i2 ? : _st.int) : _mat.TrackedElement<T>;
		//
		//			//Matx(const Matx<_Tp, m, n>& a, const Matx<_Tp, m, n>& b, Matx_AddOp);
		//			//Matx(const Matx<_Tp, m, n>& a, const Matx<_Tp, m, n>& b, Matx_SubOp);
		//			//template < typename _T2> Matx(const Matx<_Tp, m, n>& a, _T2 alpha, Matx_ScaleOp);
		//			//Matx(const Matx<_Tp, m, n>& a, const Matx<_Tp, m, n>& b, Matx_MulOp);
		//			//Matx(const Matx<_Tp, m, n>& a, const Matx<_Tp, m, n>& b, Matx_DivOp);
		//			//template < int l> Matx(const Matx<_Tp, m, l>& a, const Matx<_Tp, l, n>& b, Matx_MatMulOp);
		//			//Matx(const Matx<_Tp, n, m>& a, Matx_TOp);
		//
		//			//_Tp val[m * n]; //< matrix elements
		//		val: T[];
		Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("val").ToLocalChecked(), val_getter); //TrackedPtr
																								  //
																								  //
																								  //
																								  //
																								  //
																								  //			op_Addition(other: Matx<T> | _st.int | _st.double | _st.float) : Matx<T>;
		overload->addOverload("matx", name, "op_Addition",{ make_param<Matx<T>*>("other",name) }, op_addition_matx);
		overload->addOverload("matx", name, "op_Addition",{ make_param<double>("other","Number") }, op_addition_double);
		Nan::SetPrototypeMethod(ctor, "op_Addition", matx_general_callback::callback);
		//			op_Substraction(other: Matx<T> | _st.int | _st.double | _st.float) : Matx<T>;
		overload->addOverload("matx", name, "op_Substraction",{ make_param<Matx<T>*>("other",name) }, op_Substraction_matx);
		overload->addOverload("matx", name, "op_Substraction",{ make_param<double>("other","Number") }, op_Substraction_double);
		Nan::SetPrototypeMethod(ctor, "op_Substraction", matx_general_callback::callback);

		//			op_Multiplication(other: Matx<T> | _st.int | _st.double | _st.float) : Matx<T>;
		overload->addOverload("matx", name, "op_Multiplication",{ make_param<Matx<T>*>("other",name) },   op_Multiplication_matx);
		overload->addOverload("matx", name, "op_Multiplication",{ make_param<double>("other","Number") }, op_Multiplication_double);
		Nan::SetPrototypeMethod(ctor, "op_Multiplication", matx_general_callback::callback);
		//
		//			mul(a: Matx<T>) : Matx<T>;
		overload->addOverload("matx", name, "mul",{ make_param<Matx<T>*>("a",name) }, mul_matx);
		Nan::SetPrototypeMethod(ctor, "mul", matx_general_callback::callback);
		//			//template < typename _Tp, int m, int n> inline
		//			//Matx < _Tp, m, n > Matx<_Tp, m, n>::mul(const Matx<_Tp, m, n>& a) const
		//			//    {
		//			//        return Matx<_Tp, m, n>(*this, a, Matx_MulOp());
		//			//}
		//		};












		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());


	}

	//std::shared_ptr<T> _matx;

	//static std::string Matx<T>::name;

	//static Nan::Persistent<FunctionTemplate> constructor;

	template <typename T>
	v8::Local<v8::Function> Matx<T>::get_constructor() {
		assert(!constructor.IsEmpty() && "constructor is empty");
		return Nan::New(constructor)->GetFunction();
	}

	template <typename T>
	cv::_InputArray Matx<T>::GetInputArray() {
		return *_matx;
	}

	template <typename T>
	cv::_InputArray Matx<T>::GetInputArrayOfArrays() {
		return *_matx;
	}

	template <typename T>
	cv::_OutputArray Matx<T>::GetOutputArray() {
		return *_matx;
	}

	template <typename T>
	cv::_OutputArray Matx<T>::GetOutputArrayOfArrays() {
		return *_matx;
	}

	template <typename T>
	cv::_InputOutputArray Matx<T>::GetInputOutputArray() {
		return *_matx;
	}

	template <typename T>
	cv::_InputOutputArray Matx<T>::GetInputOutputArrayOfArrays() {
		return *_matx;
	}

	template <typename T>
	POLY_METHOD(Matx<T>::New_no_params) {
		auto matx = new Matx<T>();
		matx->_matx = std::make_shared<T>();
		matx->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Matx<T>::New_v0) {
		auto matx = new Matx<T>();

		TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<TVT>(i);
		}

		matx->_matx = std::make_shared<T>((TVT*)&values);
		matx->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}


	template <typename T>
	POLY_METHOD(Matx<T>::New_v0_v1) {
		auto matx = new Matx<T>();

		TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<TVT>(i);
		}

		matx->_matx = std::make_shared<T>((TVT*)&values);
		matx->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Matx<T>::New_v0_v1_v2) {
		auto matx = new Matx<T>();

		TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<TVT>(i);
		}

		matx->_matx = std::make_shared<T>((TVT*)&values);
		matx->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Matx<T>::New_v0_v1_v2_v3) {
		auto matx = new Matx<T>();

		TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<TVT>(i);
		}

		matx->_matx = std::make_shared<T>((TVT*)&values);
		matx->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Matx<T>::New_v0_v1_v2_v3_v4) {
		auto matx = new Matx<T>();

		TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<TVT>(i);
		}

		matx->_matx = std::make_shared<T>((TVT*)&values);
		matx->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Matx<T>::New_v0_v1_v2_v3_v4_v5) {
		auto matx = new Matx<T>();

		TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<TVT>(i);
		}

		matx->_matx = std::make_shared<T>((TVT*)&values);
		matx->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Matx<T>::New_v0_v1_v2_v3_v4_v5_v6) {
		auto matx = new Matx<T>();

		TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<TVT>(i);
		}

		matx->_matx = std::make_shared<T>((TVT*)&values);
		matx->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Matx<T>::New_v0_v1_v2_v3_v4_v5_v6_v7) {
		auto matx = new Matx<T>();

		TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<TVT>(i);
		}

		matx->_matx = std::make_shared<T>((TVT*)&values);
		matx->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Matx<T>::New_v0_v1_v2_v3_v4_v5_v6_v7_v8) {
		auto matx = new Matx<T>();

		TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<TVT>(i);
		}

		matx->_matx = std::make_shared<T>((TVT*)&values);
		matx->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Matx<T>::New_v0_v1_v2_v3_v4_v5_v6_v7_v8_v9) {
		auto matx = new Matx<T>();

		TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<TVT>(i);
		}

		matx->_matx = std::make_shared<T>((TVT*)&values);
		matx->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Matx<T>::New_v0_v1_v2_v3_v4_v5_v6_v7_v8_v9_v10_v11) {
		auto matx = new Matx<T>();

		TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<TVT>(i);
		}

		matx->_matx = std::make_shared<T>((TVT*)&values);
		matx->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Matx<T>::New_v0_v1_v2_v3_v4_v5_v6_v7_v8_v9_v10_v11_v12_v13) {
		auto matx = new Matx<T>();

		TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<TVT>(i);
		}

		matx->_matx = std::make_shared<T>((TVT*)&values);
		matx->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Matx<T>::New_v0_v1_v2_v3_v4_v5_v6_v7_v8_v9_v10_v11_v12_v13_v14_v15) {
		auto matx = new Matx<T>();

		TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<TVT>(i);
		}

		matx->_matx = std::make_shared<T>((TVT*)&values);
		matx->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Matx<T>::New_vals) {
		auto matx = new Matx<T>();

		TVT values[T::channels];
		for (auto i = 0; i < T::channels; i++) {
			values[i] = info.at<TVT>(i);
		}

		matx->_matx = std::make_shared<T>((TVT*)&values);
		matx->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Matx<T>::all) {
		auto matx = new Matx<T>();

		matx->_matx = std::make_shared<T>(T::all(info.at<TVT>(0)));

		info.SetReturnValue(matx);
	}

	template <typename T>
	POLY_METHOD(Matx<T>::zeros) {
		auto matx = new Matx<T>();

		matx->_matx = std::make_shared<T>(T::zeros());

		info.SetReturnValue(matx);

		matx->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Matx<T>::ones) {
		auto matx = new Matx<T>();

		matx->_matx = std::make_shared<T>(T::ones());
		info.SetReturnValue(matx);
	}

	template <typename T>
	POLY_METHOD(Matx<T>::eye) {
		auto matx = new Matx<T>();

		matx->_matx = std::make_shared<T>(T::eye());

		info.SetReturnValue(matx);
	}

	template <typename T>
	POLY_METHOD(Matx<T>::randu) {
		auto matx = new Matx<T>();

		matx->_matx = std::make_shared<T>(T::randu(info.at<TVT>(0), info.at<TVT>(1)));
		info.SetReturnValue(matx);
	}

	template <typename T>
	POLY_METHOD(Matx<T>::randn) {
		auto matx = new Matx<T>();

		matx->_matx = std::make_shared<T>(T::randn(info.at<TVT>(0), info.at<TVT>(1)));
		info.SetReturnValue(matx);
	}

	template <typename T>
	POLY_METHOD(Matx<T>::op_Addition_matx_matx) {
		auto matx = new Matx<T>();

		auto a = *info.at<Matx<T>*>(0)->_matx;
		auto b = *info.at<Matx<T>*>(1)->_matx;

		matx->_matx = std::make_shared<T>(a + b);
		info.SetReturnValue(matx);
	}

	template <typename T>
	POLY_METHOD(Matx<T>::op_Substraction_matx_matx) {
		auto matx = new Matx<T>();

		auto a = *info.at<Matx<T>*>(0)->_matx;
		auto b = *info.at<Matx<T>*>(1)->_matx;

		matx->_matx = std::make_shared<T>(a - b);
		info.SetReturnValue(matx);
	}

	template <typename T>
	POLY_METHOD(Matx<T>::op_Multiplication_matx_number) {
		auto matx = new Matx<T>();

		auto a = *info.at<Matx<T>*>(0)->_matx;
		auto b = info.at<double>(1);

		matx->_matx = std::make_shared<T>(a * b);
		info.SetReturnValue(matx);
	}

	template <typename T>
	POLY_METHOD(Matx<T>::op_Multiplication_number_matx) {
		auto matx = new Matx<T>();

		auto a = info.at<double>(0);
		auto b = *info.at<Matx<T>*>(1)->_matx;

		matx->_matx = std::make_shared<T>(a * b);
		info.SetReturnValue(matx);
	}

	template <typename T>
	POLY_METHOD(Matx<T>::op_Substraction_matx_negative) {
		auto matx = new Matx<T>();

		auto a = *info.at<Matx<T>*>(0)->_matx;

		matx->_matx = std::make_shared<T>(-a);
		info.SetReturnValue(matx);
	}

	template <typename T>
	POLY_METHOD(Matx<T>::op_Multiplication_matx_matx) {
		auto matx = new Matx<T>();

		auto a = *info.at<Matx<T>*>(0)->_matx;
		auto b = *info.at<Matx<T>*>(1)->_matx;

		matx->_matx = std::make_shared<T>(a.mul(b));
		info.SetReturnValue(matx);
	}

	template <typename T>
	POLY_METHOD(Matx<T>::op_Equals_matx_matx) {
		auto matx = new Matx<T>();

		auto a = *info.at<Matx<T>*>(0)->_matx;
		auto b = *info.at<Matx<T>*>(1)->_matx;

		info.SetReturnValue(a == b);
	}

	template <typename T>
	POLY_METHOD(Matx<T>::op_NotEquals_matx_matx) {
		auto matx = new Matx<T>();

		auto a = *info.at<Matx<T>*>(0)->_matx;
		auto b = *info.at<Matx<T>*>(1)->_matx;

		info.SetReturnValue(a != b);
	}

	template <typename T>
	POLY_METHOD(Matx<T>::norm_matx) {
		auto matx = new Matx<T>();

		auto m = *info.at<Matx<T>*>(0)->_matx;

		info.SetReturnValue(cv::norm(m));
	}

	template <typename T>
	NAN_GETTER(Matx<T>::depth_getter) {
		auto this_ = or ::ObjectWrap::Unwrap<Matx<T>>(info.This())->_matx;
		info.GetReturnValue().Set(Nan::New(this_->depth));
	}

	template <typename T>
	POLY_METHOD(Matx<T>::rows) {
		auto this_ = info.This<Matx<T>*>()->_matx;
		info.SetReturnValue(this_->rows);
	}

	template <typename T>
	POLY_METHOD(Matx<T>::cols) {
		auto this_ = info.This<Matx<T>*>()->_matx;
		info.SetReturnValue(this_->cols);
	}

	template <typename T>
	NAN_GETTER(Matx<T>::channels_getter) {
		auto this_ = or ::ObjectWrap::Unwrap<Matx<T>>(info.This())->_matx;
		info.GetReturnValue().Set(Nan::New(this_->channels));
	}

	template <typename T>
	POLY_METHOD(Matx<T>::type) {
		auto this_ = info.This<Matx<T>*>()->_matx;
		info.SetReturnValue(this_->type);
	}

	template <typename T>
	POLY_METHOD(Matx<T>::dot_matx) {
		auto this_ = info.This<Matx<T>*>()->_matx;
		info.SetReturnValue(this_->dot(*info.at<Matx<T>*>(0)->_matx));
	}

	template <typename T>
	POLY_METHOD(Matx<T>::ddot_matx) {
		auto this_ = info.This<Matx<T>*>()->_matx;
		info.SetReturnValue(this_->ddot(*info.at<Matx<T>*>(0)->_matx));
	}

	template <typename T>
	POLY_METHOD(Matx<T>::inv_method);

	template <typename T>
	NAN_GETTER(Matx<T>::val_getter) {
		auto this_ = or ::ObjectWrap::Unwrap<Matx<T>>(info.This());

		auto tptr = new TrackedPtr<T>();
		tptr->_from = std::make_shared<Matx_array_accessor<T,TVT>>(this_->_matx, GetTypeName<TVT>());
		info.GetReturnValue().Set(tptr->Wrap());
	}

	template <typename T>
	POLY_METHOD(Matx<T>::op_addition_matx) {
		auto this_ = *info.This<Matx<T>*>()->_matx;
		auto other = *info.at<Matx<T>*>(0)->_matx;

		auto ret = new Matx<T>();
		ret->_matx = std::make_shared<T>(this_ + other);

		info.SetReturnValue(ret);
	}

	template <typename T>
	POLY_METHOD(Matx<T>::op_addition_double) {
		auto this_ = *info.This<Matx<T>*>()->_matx;
		auto other = T::all(info.at<double>(0));

		auto ret = new Matx<T>();
		ret->_matx = std::make_shared<T>(this_ + other);

		info.SetReturnValue(ret);
	}

	template <typename T>
	POLY_METHOD(Matx<T>::op_Substraction_matx) {
		auto this_ = *info.This<Matx<T>*>()->_matx;
		auto other = *info.at<Matx<T>*>(0)->_matx;

		auto ret = new Matx<T>();
		ret->_matx = std::make_shared<T>(this_ - other);

		info.SetReturnValue(ret);
	}

	template <typename T>
	POLY_METHOD(Matx<T>::op_Substraction_double) {
		auto this_ = *info.This<Matx<T>*>()->_matx;
		auto other = T::all(info.at<double>(0));

		auto ret = new Matx<T>();
		ret->_matx = std::make_shared<T>(this_ - other);

		info.SetReturnValue(ret);
	}

	template <typename T>
	POLY_METHOD(Matx<T>::op_Multiplication_matx) {
		auto this_ = *info.This<Matx<T>*>()->_matx;
		auto other = *info.at<Matx<T>*>(0)->_matx;

		auto ret = new Matx<T>();
		ret->_matx = std::make_shared<T>(this_.mul(other));

		info.SetReturnValue(ret);
	}

	template <typename T>
	POLY_METHOD(Matx<T>::op_Multiplication_double) {
		auto this_ = *info.This<Matx<T>*>()->_matx;
		auto other = info.at<double>(0);

		auto ret = new Matx<T>();
		ret->_matx = std::make_shared<T>(this_ * other);

		info.SetReturnValue(ret);
	}

	template <typename T>
	POLY_METHOD(Matx<T>::mul_matx) {
		auto this_ = *info.This<Matx<T>*>()->_matx;
		auto other = *info.at<Matx<T>*>(0)->_matx;

		auto ret = new Matx<T>();
		ret->_matx = std::make_shared<T>(this_.mul(other));

		info.SetReturnValue(ret);
	}



//declare variables
template <typename T>
Nan::Persistent<FunctionTemplate> Matx<T>::constructor;

template <typename T>
std::string Matx<T>::name;

//inv implementation, a bit tricky because it only compiles for float and double where rows = cols
template<typename T, typename MAT_TYPE, class = void>
class inv_imp {
public:
	static POLY_METHOD(run) {
		throw std::exception("inv is unavailable for this type");
	}
};

template<typename T, typename MAT_TYPE>
class inv_imp<T, MAT_TYPE, typename std::enable_if<(std::is_same<cv::Matx<float, T::rows, T::rows>, MAT_TYPE>::value) || (std::is_same<cv::Matx<double, T::rows, T::rows>, MAT_TYPE>::value)>::type> {
public:
	static POLY_METHOD(run) {
		auto this_ = info.This<Matx<T>*>()->_matx;
		bool p_is_ok;
		auto p_is_ok_cb = info.at<std::shared_ptr< or ::Callback>>(1);
		auto res = this_->inv(info.at<int>(0), &p_is_ok);

		auto ret = new Matx<T>();
		ret->_matx = std::make_shared<T>(res);

		p_is_ok_cb->Call({ or ::make_value(p_is_ok) });

		info.SetReturnValue(ret);
	}
};

template<typename T>
POLY_METHOD(Matx<T>::inv_method) {
	inv_imp<T, T::mat_type>::run(info);
}

#endif