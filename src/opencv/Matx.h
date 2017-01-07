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








//		export interface MatxStatic<T> {
//			new () : Matx<T>;
//			new (v0: T) : Matx<T>; //!< 1x1 matrix
//			new (v0: T, v1 : T) : Matx<T>; //!< 1x2 or 2x1 matrix
//			new (v0: T, v1 : T, v2 : T) : Matx<T>; //!< 1x3 or 3x1 matrix
//			new (v0: T, v1 : T, v2 : T, v3 : T) : Matx<T>; //!< 1x4, 2x2 or 4x1 matrix
//			new (v0: T, v1 : T, v2 : T, v3 : T, v4 : T) : Matx<T>; //!< 1x5 or 5x1 matrix
//			new (v0: T, v1 : T, v2 : T, v3 : T, v4 : T, v5 : T) : Matx<T>; //!< 1x6, 2x3, 3x2 or 6x1 matrix
//			new (v0: T, v1 : T, v2 : T, v3 : T, v4 : T, v5 : T, v6 : T) : Matx<T>; //!< 1x7 or 7x1 matrix
//			new (v0: T, v1 : T, v2 : T, v3 : T, v4 : T, v5 : T, v6 : T, v7 : T) : Matx<T>; //!< 1x8, 2x4, 4x2 or 8x1 matrix
//			new (v0: T, v1 : T, v2 : T, v3 : T, v4 : T, v5 : T, v6 : T, v7 : T, v8 : T) : Matx<T>; //!< 1x9, 3x3 or 9x1 matrix
//			new (v0: T, v1 : T, v2 : T, v3 : T, v4 : T, v5 : T, v6 : T, v7 : T, v8 : T, v9 : T) : Matx<T>; //!< 1x10, 2x5 or 5x2 or 10x1 matrix
//			new(v0 : T, v1 : T, v2 : T, v3 : T,
//				v4 : T, v5 : T, v6 : T, v7 : T,
//				v8 : T, v9 : T, v10 : T, v11 : T) : Matx<T>; //!< 1x12, 2x6, 3x4, 4x3, 6x2 or 12x1 matrix
//			new(v0 : T, v1 : T, v2 : T, v3 : T,
//				v4 : T, v5 : T, v6 : T, v7 : T,
//				v8 : T, v9 : T, v10 : T, v11 : T,
//				v12 : T, v13 : T) : Matx<T>; //!< 1x14, 2x7, 7x2 or 14x1 matrix
//			new(v0 : T, v1 : T, v2 : T, v3 : T,
//				v4 : T, v5 : T, v6 : T, v7 : T,
//				v8 : T, v9 : T, v10 : T, v11 : T,
//				v12, _v13 : T, v14 : T, v15 : T) : Matx<T>; //!< 1x16, 4x4 or 16x1 matrix
//			new(vals : Array<T>) : Matx<T>; //!< initialize from a plain array
//
//			all(alpha : T) : Matx<T>;
//			zeros() : Matx<T>;
//			ones() : Matx<T>;
//			eye() : Matx<T>;
//			//diag(const diag_type& d): Matx<T>;
//			randu(a : T, b : T) : Matx<T>;
//			randn(a: T, b : T) : Matx<T>;
//
//
//
//			//template < typename _Tp, int m, int n> static inline
//			//Matx < _Tp, m, n > operator + (const Matx<_Tp, m, n>& a, const Matx<_Tp, m, n>& b)
//			//    {
//			//        return Matx<_Tp, m, n>(a, b, Matx_AddOp());
//			//}
//			op_Addition(a: Matx<T>, b : Matx<T>) : Matx<T>;
//
//			//template < typename _Tp, int m, int n> static inline
//			//Matx < _Tp, m, n > operator - (const Matx<_Tp, m, n>& a, const Matx<_Tp, m, n>& b)
//			//    {
//			//        return Matx<_Tp, m, n>(a, b, Matx_SubOp());
//			//}
//			op_Substraction(a: Matx<T>, b : Matx<T>) : Matx<T>;
//
//			//template < typename _Tp, int m, int n> static inline
//			//Matx < _Tp, m, n > operator * (const Matx<_Tp, m, n>& a, int alpha)
//			//    {
//			//        return Matx<_Tp, m, n>(a, alpha, Matx_ScaleOp());
//			//}
//			op_Multiplication(a: Matx<T>, alpha : _st.int) : Matx<T>;
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
//
//			//template < typename _Tp, int m, int n, int l> static inline
//			//Matx < _Tp, m, n > operator * (const Matx<_Tp, m, l>& a, const Matx<_Tp, l, n>& b)
//			//    {
//			//        return Matx<_Tp, m, n>(a, b, Matx_MatMulOp());
//			//}
//			op_Multiplication(a: Matx<T>, b : Matx<T>) : Matx<T>;
//
//			//template < typename _Tp, int m, int n> static inline
//			//Vec < _Tp, m > operator * (const Matx<_Tp, m, n>& a, const Vec<_Tp, n>& b)
//			//    {
//			//        Matx<_Tp, m, 1> c(a, b, Matx_MatMulOp());
//			//return (const Vec<_Tp, m>&)(c);
//			//}
//			op_Multiplication(a: Matx<T>, b : Vec<T>) : Matx<T>;
//
//			//template < typename _Tp, int m, int n> static inline
//			//bool operator == (const Matx<_Tp, m, n>& a, const Matx<_Tp, m, n>& b)
//			//    {
//			//        for( int i = 0; i < m * n; i++ )
//			//if (a.val[i] != b.val[i]) return false;
//			//return true;
//			//}
//			op_Equals(a: Matx<T>, b : Matx<T>) : boolean;
//
//			//template < typename _Tp, int m, int n> static inline
//			//bool operator != (const Matx<_Tp, m, n>& a, const Matx<_Tp, m, n>& b)
//			//    {
//			//        return !(a == b);
//			//}
//			op_NotEquals(a: Matx<T>, b : Matx<T>) : boolean;
//
//
//			//template < typename _Tp, int m, int n> static inline
//			norm(m ? : Matx<T>) : _st.double;
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
//			//    rows = m,
//			rows() : _st.int;
//			//    cols = n,
//			cols() : _st.int;
//			//    channels = rows * cols,
//		channels: _st.int;
//			//    type = CV_MAKETYPE(depth, channels),
//			type() : _st.int;
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
//
//				//! dot product computed in double-precision arithmetics
//				ddot(v : Matx<T>) : _st.double;
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
//
//
//
//
//
//			op_Addition(other: Matx<T> | _st.int | _st.double | _st.float) : Matx<T>;
//			op_Substraction(other: Matx<T> | _st.int | _st.double | _st.float) : Matx<T>;
//			op_Multiplication(other: Matx<T> | _st.int | _st.double | _st.float) : Matx<T>;
//
//			mul(a: Matx<T>) : Matx<T>;
//			//template < typename _Tp, int m, int n> inline
//			//Matx < _Tp, m, n > Matx<_Tp, m, n>::mul(const Matx<_Tp, m, n>& a) const
//			//    {
//			//        return Matx<_Tp, m, n>(*this, a, Matx_MulOp());
//			//}
//		};










		

		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());

		
	}

	std::shared_ptr<T> _matx;

	static std::string Matx<T>::name;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor() {
		assert(!constructor.IsEmpty() && "constructor is empty");
		return Nan::New(constructor)->GetFunction();
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