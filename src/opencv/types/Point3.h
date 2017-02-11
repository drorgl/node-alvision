#ifndef _ALVISION_POINT3_H_
#define _ALVISION_POINT3_H_
//#include "OpenCV.h"
#include "../../alvision.h"
#include "../Vec.h"

namespace point3_general_callback {
	extern std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback);
}

template <typename T>
class Point3_ : public or::ObjectWrap {
public:
	typedef typename T CVT;
	typedef typename T::value_type TVT;
	typedef typename Vec<cv::Vec<typename T::value_type,3>> Vec3T;

	static std::string name;
	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		point3_general_callback::overload = overload;
		Point3_<T>::name = name;
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(point3_general_callback::callback);
		Point3_<T>::constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		overload->register_type<Point3_<T>>(ctor, "", name);



		

		//export interface Point3_Static<T> {
		overload->addOverloadConstructor("point3", name, {}, New);
			//new () : Point3_<T>;
		overload->addOverloadConstructor("point3", name, {
			make_param<TVT>("","Number"),
			make_param<TVT>("","Number"),
			make_param<TVT>("","Number")
		}, New_x_y_z);
			//new (_x : T, _y : T, _z : T) : Point3_<T>;
		overload->addOverloadConstructor("point3", name, {
			make_param<Point3_<T>*>("pt",Point3_<T>::name)
		}, New_pt);
		//new (pt : Point3_<T>) : Point3_<T>;
		overload->addOverloadConstructor("point3", name, {
			make_param<Vec3T*>("v",Vec3T::name)
		}, New_v);
		//new (v: _matx.Vec<T>) : Point3_<T>;


			//////////////////////////////// 3D Point ///////////////////////////////

			//template < typename _Tp> inline
			//Point3_<_Tp>::Point3_()
			//    : x(0), y(0), z(0) {}

			//template< typename _Tp> inline
			//Point3_<_Tp>::Point3_(_Tp _x, _Tp _y, _Tp _z)
			//    : x(_x), y(_y), z(_z) {}

			//template< typename _Tp> inline
			//Point3_<_Tp>::Point3_(const Point3_& pt)
			//    : x(pt.x), y(pt.y), z(pt.z) {}

			//template < typename _Tp> inline
			//Point3_<_Tp>::Point3_(const Point_<_Tp>& pt)
			//    : x(pt.x), y(pt.y), z(_Tp()) {}

			//template < typename _Tp> inline
			//Point3_<_Tp>::Point3_(const Vec<_Tp, 3>& v)
			//    : x(v[0]), y(v[1]), z(v[2]) {}

			//template < typename _Tp> template < typename _Tp2> inline
			//Point3_<_Tp>::operator Point3_<_Tp2>() const
			//    {
			//        return Point3_<_Tp2>(saturate_cast<_Tp2>(x), saturate_cast<_Tp2>(y), saturate_cast<_Tp2>(z));
			//}

			//template < typename _Tp> inline
			//Point3_<_Tp>::operator Vec< _Tp, 3 > () const
			//    {
			//        return Vec<_Tp, 3>(x, y, z);
			//}

			//template < typename _Tp> inline
			//Point3_<_Tp>& Point3_<_Tp>::operator = (const Point3_& pt)
			//    {
			//        x = pt.x; y = pt.y; z = pt.z;
			//return *this;
			//}


			//template < typename _Tp> inline
			//_Tp Point3_<_Tp>::dot(const Point3_& pt) const
			//    {
			//        return saturate_cast<_Tp>(x * pt.x + y * pt.y + z * pt.z);
			//}


			//template < typename _Tp> inline
			//double Point3_<_Tp>::ddot(const Point3_& pt) const
			//    {
			//        return (double)x*pt.x + (double)y*pt.y + (double)z*pt.z;
			//}

			//template < typename _Tp> inline
			//Point3_ < _Tp > Point3_<_Tp>::cross(const Point3_<_Tp>& pt) const
			//    {
			//        return Point3_<_Tp>(y * pt.z - z * pt.y, z * pt.x - x * pt.z, x * pt.y - y * pt.x);
			//}


			//template < typename _Tp> static inline
			//Point3_<_Tp>& operator += (Point3_<_Tp>& a, const Point3_<_Tp>& b)
			//    {
			//        a.x += b.x;
			//a.y += b.y;
			//a.z += b.z;
			//return a;
			//}


			//template < typename _Tp> static inline
			//Point3_<_Tp>& operator -= (Point3_<_Tp>& a, const Point3_<_Tp>& b)
			//    {
			//        a.x -= b.x;
			//a.y -= b.y;
			//a.z -= b.z;
			//return a;
			//}

			//template < typename _Tp> static inline
			//Point3_<_Tp>& operator *= (Point3_<_Tp>& a, int b)
			//{
			//    a.x = saturate_cast<_Tp>(a.x * b);
			//    a.y = saturate_cast<_Tp>(a.y * b);
			//    a.z = saturate_cast<_Tp>(a.z * b);
			//    return a;
			//}

			//template< typename _Tp> static inline
			//Point3_<_Tp>& operator *= (Point3_<_Tp>& a, float b)
			//{
			//        a.x = saturate_cast<_Tp>(a.x * b);
			//        a.y = saturate_cast<_Tp>(a.y * b);
			//        a.z = saturate_cast<_Tp>(a.z * b);
			//        return a;
			//    }

			//template< typename _Tp> static inline
			//Point3_<_Tp>& operator *= (Point3_<_Tp>& a, double b)
			//{
			//            a.x = saturate_cast<_Tp>(a.x * b);
			//            a.y = saturate_cast<_Tp>(a.y * b);
			//            a.z = saturate_cast<_Tp>(a.z * b);
			//            return a;
			//        }

			//template< typename _Tp> static inline
			//Point3_<_Tp>& operator /= (Point3_<_Tp>& a, int b)
			//{
			//                    a.x = saturate_cast<_Tp>(a.x / b);
			//                    a.y = saturate_cast<_Tp>(a.y / b);
			//                    a.z = saturate_cast<_Tp>(a.z / b);
			//                    return a;
			//                }

			//template< typename _Tp> static inline
			//Point3_<_Tp>& operator /= (Point3_<_Tp>& a, float b)
			//{
			//                        a.x = saturate_cast<_Tp>(a.x / b);
			//                        a.y = saturate_cast<_Tp>(a.y / b);
			//                        a.z = saturate_cast<_Tp>(a.z / b);
			//                        return a;
			//                    }

			//template< typename _Tp> static inline
			//Point3_<_Tp>& operator /= (Point3_<_Tp>& a, double b)
			//{
			//                            a.x = saturate_cast<_Tp>(a.x / b);
			//                            a.y = saturate_cast<_Tp>(a.y / b);
			//                            a.z = saturate_cast<_Tp>(a.z / b);
			//                            return a;
			//                        }

			//template< typename _Tp> static inline
			//double norm(const Point3_<_Tp>& pt)
			//    {
			//        return std::sqrt((double)pt.x*pt.x + (double)pt.y*pt.y + (double)pt.z*pt.z);
			//}
			//norm(pt: Point3_<T>) : _st.double;
			overload->addStaticOverload("point3", name, "norm", {make_param<Point3_<T>*>("pt",name)},norm);
			Nan::SetMethod(ctor, "norm", point3_general_callback::callback);

			//template < typename _Tp> static inline
			//bool operator == (const Point3_<_Tp>& a, const Point3_<_Tp>& b)
			//    {
			//        return a.x == b.x && a.y == b.y && a.z == b.z;
			//}
			//op_Equals(pt1: Point3_<T>, pt2 : Point3_<T>) : boolean;
			overload->addStaticOverload("point3", name, "op_Equals", { 
				make_param<Point3_<T>*>("pt1",name),
				make_param<Point3_<T>*>("pt2",name)
			}, op_Equals);
			Nan::SetMethod(ctor, "op_Equals", point3_general_callback::callback);


			//template < typename _Tp> static inline
			//bool operator != (const Point3_<_Tp>& a, const Point3_<_Tp>& b)
			//    {
			//        return a.x != b.x || a.y != b.y || a.z != b.z;
			//}
			//op_NotEquals(pt1: Point3_<T>, pt2 : Point3_<T>) : boolean;
			overload->addStaticOverload("point3", name, "op_NotEquals", {
				make_param<Point3_<T>*>("pt1",name),
				make_param<Point3_<T>*>("pt2",name)
			}, op_NotEquals);
			Nan::SetMethod(ctor, "op_NotEquals", point3_general_callback::callback);


			//template < typename _Tp> static inline
			//Point3_ < _Tp > operator + (const Point3_<_Tp>& a, const Point3_<_Tp>& b)
			//    {
			//        return Point3_<_Tp>(saturate_cast<_Tp>(a.x + b.x), saturate_cast<_Tp>(a.y + b.y), saturate_cast<_Tp>(a.z + b.z));
			//}
			//op_Addition(pt1: Point3_<T>, pt2 : Point3_<T>) : Point3_<T>;
			overload->addStaticOverload("point3", name, "op_Addition", {
				make_param<Point3_<T>*>("pt1",name),
				make_param<Point3_<T>*>("pt2",name)
			}, op_Addition);
			Nan::SetMethod(ctor, "op_Addition", point3_general_callback::callback);

			//template < typename _Tp> static inline
			//Point3_ < _Tp > operator - (const Point3_<_Tp>& a, const Point3_<_Tp>& b)
			//    {
			//        return Point3_<_Tp>(saturate_cast<_Tp>(a.x - b.x), saturate_cast<_Tp>(a.y - b.y), saturate_cast<_Tp>(a.z - b.z));
			//}
			//op_Substraction(pt1: Point3_<T>, pt2 : Point3_<T>) : Point3_<T>;
			overload->addStaticOverload("point3", name, "op_Substraction", {
				make_param<Point3_<T>*>("pt1",name),
				make_param<Point3_<T>*>("pt2",name)
			}, op_Substraction_pt1_pt2);
			Nan::SetMethod(ctor, "op_Substraction", point3_general_callback::callback);

			//template < typename _Tp> static inline
			//Point3_ < _Tp > operator - (const Point3_<_Tp>& a)
			//    {
			//        return Point3_<_Tp>(saturate_cast<_Tp>(-a.x), saturate_cast<_Tp>(-a.y), saturate_cast<_Tp>(-a.z));
			//}
			//op_Substraction(a: Point3_<T>) : Point3_<T>;
			overload->addStaticOverload("point3", name, "op_Substraction", {
				make_param<Point3_<T>*>("pt",name)
			}, op_Substraction);
			Nan::SetMethod(ctor, "op_Substraction", point3_general_callback::callback);



			//template < typename _Tp> static inline
			//Point3_ < _Tp > operator * (const Point3_<_Tp>& a, int b)
			//    {
			//        return Point3_<_Tp>(saturate_cast<_Tp>(a.x * b), saturate_cast<_Tp>(a.y * b), saturate_cast<_Tp>(a.z * b));
			//}
			//op_Multiplication(pt1: Point3_<T>, b : _st.int) : Point3_<T>;
			overload->addStaticOverload("point3", name, "op_Multiplication", {
				make_param<Point3_<T>*>("pt1",name),
				make_param<double>("b","Number")
			}, op_Multiplication_pt_b);
			Nan::SetMethod(ctor, "op_Multiplication", point3_general_callback::callback);

			//template < typename _Tp> static inline
			//Point3_ < _Tp > operator * (int a, const Point3_<_Tp>& b)
			//    {
			//        return Point3_<_Tp>(saturate_cast<_Tp>(b.x * a), saturate_cast<_Tp>(b.y * a), saturate_cast<_Tp>(b.z * a));
			//}
			//op_Multiplication(a: _st.int, b : Point3_<T>) : Point3_<T>;
			overload->addStaticOverload("point3", name, "op_Multiplication", {
				make_param<double>("a","Number"),
				make_param<Point3_<T>*>("pt2",name)
			}, op_Multiplication_a_pt);
			Nan::SetMethod(ctor, "op_Multiplication", point3_general_callback::callback);

			//template < typename _Tp> static inline
			//Point3_ < _Tp > operator * (const Point3_<_Tp>& a, float b)
			//    {
			//        return Point3_<_Tp>(saturate_cast<_Tp>(a.x * b), saturate_cast<_Tp>(a.y * b), saturate_cast<_Tp>(a.z * b));
			//}
			//op_Multiplication(a: Point3_<T>, b : _st.float) : Point3_<T>;

			//template < typename _Tp> static inline
			//Point3_ < _Tp > operator * (float a, const Point3_<_Tp>& b)
			//    {
			//        return Point3_<_Tp>(saturate_cast<_Tp>(b.x * a), saturate_cast<_Tp>(b.y * a), saturate_cast<_Tp>(b.z * a));
			//}
			//op_Multiplication(a: _st.float, b : Point3_<T>) : Point3_<T>;
			//template < typename _Tp> static inline
			//Point3_ < _Tp > operator * (const Point3_<_Tp>& a, double b)
			//    {
			//        return Point3_<_Tp>(saturate_cast<_Tp>(a.x * b), saturate_cast<_Tp>(a.y * b), saturate_cast<_Tp>(a.z * b));
			//}
			//op_Multiplication(a: Point3_<T>, b : _st.double) : Point3_<T>;
			//template < typename _Tp> static inline
			//Point3_ < _Tp > operator * (double a, const Point3_<_Tp>& b)
			//    {
			//        return Point3_<_Tp>(saturate_cast<_Tp>(b.x * a), saturate_cast<_Tp>(b.y * a), saturate_cast<_Tp>(b.z * a));
			//}
			//op_Multiplication(a: _st.double, b : Point3_<T>) : Point3_<T>;

			//template < typename _Tp> static inline
			//Point3_ < _Tp > operator * (const Matx<_Tp, 3, 3 >& a, const Point_<_Tp>& b)
			//    {
			//        Matx<_Tp, 3, 1> tmp = a * Vec < _Tp, 3>(b.x, b.y, 1);
			//return Point3_<_Tp>(tmp.val[0], tmp.val[1], tmp.val[2]);
			//}

			//op_Multiplication(a: _matx.Matx<T>, b : Point_<T>) : Point3_<T>;

			//template < typename _Tp> static inline
			//Point3_ < _Tp > operator * (const Matx<_Tp, 3, 3 >& a, const Point3_<_Tp>& b)
			//    {
			//        Matx<_Tp, 3, 1> tmp = a * Vec < _Tp, 3>(b.x, b.y, b.z);
			//return Point3_<_Tp>(tmp.val[0], tmp.val[1], tmp.val[2]);
			//}
			//op_Multiplication(a: _matx.Matx<T>, b : Point3_<T>) : Point3_<T>;

			//template < typename _Tp> static inline
			//Matx < _Tp, 4, 1 > operator * (const Matx<_Tp, 4, 4 >& a, const Point3_<_Tp>& b)
			//    {
			//        return a * Matx < _Tp, 4, 1>(b.x, b.y, b.z, 1);
			//}

			//template < typename _Tp> static inline
			//Point3_ < _Tp > operator / (const Point3_<_Tp>& a, int b)
			//    {
			//        Point3_<_Tp>tmp(a);
			//tmp /= b;
			//return tmp;
			//}

			overload->addStaticOverload("point3", name, "op_Division", {
				make_param<Point3_<T>*>("pt1",name),
				make_param<double>("b","Number")
			}, op_Division_pt_b);
			Nan::SetMethod(ctor, "op_Division", point3_general_callback::callback);

			//op_Division(a: Point3_<T>, b : _st.int) : Point3_<T>;


			//template < typename _Tp> static inline
			//Point3_ < _Tp > operator / (const Point3_<_Tp>& a, float b)
			//    {
			//        Point3_<_Tp>tmp(a);
			//tmp /= b;
			//return tmp;
			//}
			//op_Division(a: Point3_<T>, b : _st.float) : Point3_<T>;

			//template < typename _Tp> static inline
			//Point3_ < _Tp > operator / (const Point3_<_Tp>& a, double b)
			//    {
			//        Point3_<_Tp>tmp(a);
			//tmp /= b;
			//return tmp;
			//}
			//op_Division(a: Point3_<T>, b : _st.double) : Point3_<T>;


		//}

		//export interface Point3_<T> {
			//! dot product
			//dot(pt : Point3_<T>) : T;
			overload->addOverload("point3", name, "dot", { make_param<Point3_<T>*>("pt",name) }, dot);
			Nan::SetPrototypeMethod(ctor, "dot", point3_general_callback::callback);
			//! dot product computed in double-precision arithmetics
			//ddot(pt : Point3_<T>) : _st.double;
			overload->addOverload("point3", name, "ddot", { make_param<Point3_<T>*>("pt",name) }, ddot);
			Nan::SetPrototypeMethod(ctor, "ddot", point3_general_callback::callback);
			//! cross product of the 2 3D points
			//cross(pt : Point3_<T>) : Point3_<T>;
			overload->addOverload("point3", name, "cross", { make_param<Point3_<T>*>("pt",name) }, cross);
			Nan::SetPrototypeMethod(ctor, "cross", point3_general_callback::callback);

			Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("x").ToLocalChecked(), x_getter, x_setter);
		//x: T;
			Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("y").ToLocalChecked(), y_getter, y_setter);
		//y: T;
			Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("z").ToLocalChecked(), z_getter, z_setter);
		//z: T;
			//_Tp x, y, z; //< the point coordinates

			overload->addOverload("point3", name, "norm", {}, norm_instance);
			Nan::SetPrototypeMethod(ctor, "norm", point3_general_callback::callback);
			//norm() : _st.double;


			//op_Equals(other: Point3_<T>) : boolean;
			overload->addOverload("point3", name, "op_Equals", { make_param<Point3_<T>*>("pt",name) }, op_Equals_other);
			Nan::SetPrototypeMethod(ctor, "op_Equals", point3_general_callback::callback);


			//op_NotEquals(other: Point3_<T>) : boolean;
			overload->addOverload("point3", name, "op_NotEquals", { make_param<Point3_<T>*>("pt",name) }, op_NotEquals_other);
			Nan::SetPrototypeMethod(ctor, "op_NotEquals", point3_general_callback::callback);

			//op_Addition(other: Point3_<T>) : Point3_<T>;
			overload->addOverload("point3", name, "op_Addition", { make_param<Point3_<T>*>("pt",name) }, op_Addition_other);
			Nan::SetPrototypeMethod(ctor, "op_Addition", point3_general_callback::callback);

			//op_Substraction(other: Point3_<T>) : Point3_<T>;
			overload->addOverload("point3", name, "op_Substraction", { make_param<Point3_<T>*>("pt",name) }, op_Substraction_other);
			Nan::SetPrototypeMethod(ctor, "op_Substraction", point3_general_callback::callback);

			//op_Multiplication(other: _st.int | _st.float | _st.double | number) : Point3_<T>;
			overload->addOverload("point3", name, "op_Multiplication", {make_param<double>("other","Number")}, op_Multiplication_other_number);
			Nan::SetPrototypeMethod(ctor, "op_Multiplication", point3_general_callback::callback);

			//op_Multiplication(other: _matx.Matx<T>) : Point3_<T>;
			//op_Division(other: _st.int | _st.float | _st.double) : Point3_<T>;
			overload->addOverload("point3", name, "op_Division", { make_param<double>("other","Number") }, op_Division_other_number);
			Nan::SetPrototypeMethod(ctor, "op_Division", point3_general_callback::callback);

		//}

			overload->addOverload("point3", name, "setTo", { make_param<Point3_<T>*>("other",name) }, setTo);
			Nan::SetPrototypeMethod(ctor, "setTo", point3_general_callback::callback);

		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());

		
	}

	std::shared_ptr<T> _point3;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor() {
		assert(!constructor.IsEmpty() && "constructor is empty");
		return Nan::New(constructor)->GetFunction();
	}

	template<typename... Args>
	static std::shared_ptr<Point3_<T>> create(Args&&... args) {
		auto val = std::make_shared<Point3_<T>>();
		val->_point3 = std::shared_ptr<T>(new T(std::forward<Args>(args)...));
		return val;
	}

	static Point3_<T>* from(T point) {
		auto pt = new Point3_<T>();
		pt->_point3 = std::make_shared<T>(std::move(point));
		return pt;
	}

	static POLY_METHOD(New) {
		auto point = new Point3_<T>();
		point->_point3 = std::make_shared<T>();

		point->Wrap(info.Holder());

		info.GetReturnValue().Set(info.Holder());
	}

	static POLY_METHOD(New_x_y_z) {
		auto point = new Point3_<T>();
		point->_point3 = std::make_shared<T>(info.at<TVT>(0), info.at<TVT>(1), info.at<TVT>(2));

		point->Wrap(info.Holder());

		info.GetReturnValue().Set(info.Holder());
	}

	static POLY_METHOD(New_pt) {
		auto point = new Point3_<T>();
		point->_point3 = std::make_shared<T>(*info.at<Point3_<T>*>(0)->_point3);

		point->Wrap(info.Holder());

		info.GetReturnValue().Set(info.Holder());
	}
	
	static POLY_METHOD(New_v) {
		auto point = new Point3_<T>();
		point->_point3 = std::make_shared<T>(*info.at<Vec3T*>(0)->_vec);

		point->Wrap(info.Holder());

		info.GetReturnValue().Set(info.Holder());
	}

	static POLY_METHOD(norm) {
		info.SetReturnValue(cv::norm(*info.at<Point3_<T>*>(0)->_point3));
	}
	
	static POLY_METHOD(op_Equals) {
		auto pt1 = *info.at<Point3_<T>*>(0)->_point3;
		auto pt2 = *info.at<Point3_<T>*>(1)->_point3;

		info.SetReturnValue(pt1 == pt2);
	}

	static POLY_METHOD(op_NotEquals) {
		auto pt1 = *info.at<Point3_<T>*>(0)->_point3;
		auto pt2 = *info.at<Point3_<T>*>(1)->_point3;

		info.SetReturnValue(pt1 != pt2);
	}

	static POLY_METHOD(op_Addition) {
		auto pt1 = *info.at<Point3_<T>*>(0)->_point3;
		auto pt2 = *info.at<Point3_<T>*>(1)->_point3;

		auto ret = new Point3_<T>();
		ret->_point3 = std::make_shared<T>(pt1 + pt2);

		info.SetReturnValue(ret);
	}

	static POLY_METHOD(op_Substraction_pt1_pt2) {
		auto pt1 = *info.at<Point3_<T>*>(0)->_point3;
		auto pt2 = *info.at<Point3_<T>*>(1)->_point3;

		auto ret = new Point3_<T>();
		ret->_point3 = std::make_shared<T>(pt1 - pt2);

		info.SetReturnValue(ret);
	}

	static POLY_METHOD(op_Substraction) {
		auto pt = *info.at<Point3_<T>*>(0)->_point3;

		auto ret = new Point3_<T>();
		ret->_point3 = std::make_shared<T>(-pt);

		info.SetReturnValue(ret);
	}

	

	static POLY_METHOD(op_Multiplication_pt_b) {
		auto pt1 = *info.at<Point3_<T>*>(0)->_point3;
		auto b = info.at<double>(1);

		auto ret = new Point3_<T>();
		ret->_point3 = std::make_shared<T>(pt1 * b);

		info.SetReturnValue(ret);
	}


	static POLY_METHOD(op_Multiplication_a_pt) {
		
		auto a = info.at<double>(0);
		auto pt2 = *info.at<Point3_<T>*>(1)->_point3;

		auto ret = new Point3_<T>();
		ret->_point3 = std::make_shared<T>(pt2 * 1);

		info.SetReturnValue(ret);
	}


	static POLY_METHOD(op_Division_pt_b) {
		auto pt1 = *info.at<Point3_<T>*>(0)->_point3;
		auto b = info.at<double>(1);

		auto ret = new Point3_<T>();
		ret->_point3 = std::make_shared<T>(pt1 / b);

		info.SetReturnValue(ret);
	}


	static POLY_METHOD(dot) {
		auto this_ = info.This<Point3_<T>*>()->_point3;

		auto pt = *info.at<Point3_<T>*>(0)->_point3;

		info.SetReturnValue(this_->dot(pt));
	}

	static POLY_METHOD(ddot) {
		auto this_ = info.This<Point3_<T>*>()->_point3;

		auto pt = *info.at<Point3_<T>*>(0)->_point3;

		info.SetReturnValue(this_->ddot(pt));
	}

	static POLY_METHOD(cross) {
		auto this_ = info.This<Point3_<T>*>()->_point3;

		auto pt = *info.at<Point3_<T>*>(0)->_point3;

		auto ret = new Point3_<T>();
		ret->_point3 = std::make_shared<T>(this_->cross(pt));

		info.SetReturnValue(ret);
	}

	static NAN_GETTER(x_getter){
		auto this_ = or ::ObjectWrap::Unwrap<Point3_<T>>(info.Holder());
		info.GetReturnValue().Set(this_->_point3->x);
	}
	static NAN_SETTER(x_setter){
		auto this_ = or ::ObjectWrap::Unwrap<Point3_<T>>(info.Holder());
		this_->_point3->x = value->NumberValue();
		info.GetReturnValue().Set(this_->_point3->x);
	}
	static NAN_GETTER(y_getter){
		auto this_ = or ::ObjectWrap::Unwrap<Point3_<T>>(info.Holder());
		info.GetReturnValue().Set(this_->_point3->y);
	}
	static NAN_SETTER(y_setter){
		auto this_ = or ::ObjectWrap::Unwrap<Point3_<T>>(info.Holder());
		this_->_point3->y = value->NumberValue();
		info.GetReturnValue().Set(this_->_point3->y);
	}
	static NAN_GETTER(z_getter){
		auto this_ = or ::ObjectWrap::Unwrap<Point3_<T>>(info.Holder());
		info.GetReturnValue().Set(this_->_point3->z);
	}
	static NAN_SETTER(z_setter){
		auto this_ = or ::ObjectWrap::Unwrap<Point3_<T>>(info.Holder());
		this_->_point3->z = value->NumberValue();
		info.GetReturnValue().Set(this_->_point3->z);
	}

	static POLY_METHOD(norm_instance) {
		auto this_ = *info.This<Point3_<T>*>()->_point3;

		info.SetReturnValue(cv::norm( this_));
	}

	static POLY_METHOD(op_Equals_other) {
		auto this_ = *info.This<Point3_<T>*>()->_point3;

		auto pt = *info.at<Point3_<T>*>(0)->_point3;

		info.SetReturnValue(this_ == pt);
	}

	static POLY_METHOD(op_NotEquals_other) {
		auto this_ = *info.This<Point3_<T>*>()->_point3;

		auto pt = *info.at<Point3_<T>*>(0)->_point3;

		info.SetReturnValue(this_ != pt);
	}

	static POLY_METHOD(op_Addition_other) {
		auto this_ = *info.This<Point3_<T>*>()->_point3;

		auto pt = *info.at<Point3_<T>*>(0)->_point3;

		auto ret = new Point3_<T>();
		ret->_point3 = std::make_shared<T>(this_ + pt);

		info.SetReturnValue(ret);
	}

	
	static POLY_METHOD(op_Substraction_other) {
		auto this_ = *info.This<Point3_<T>*>()->_point3;

		auto pt = *info.at<Point3_<T>*>(0)->_point3;

		auto ret = new Point3_<T>();
		ret->_point3 = std::make_shared<T>(this_ - pt);

		info.SetReturnValue(ret);
	}

	

	static POLY_METHOD(op_Multiplication_other_number) {
		auto this_ = *info.This<Point3_<T>*>()->_point3;

		auto other = info.at<double>(0);

		auto ret = new Point3_<T>();
		ret->_point3 = std::make_shared<T>(this_ * other);

		info.SetReturnValue(ret);
	}


	

	static POLY_METHOD(op_Division_other_number) {
		auto this_ = *info.This<Point3_<T>*>()->_point3;

		auto other = info.at<double>(0);

		auto ret = new Point3_<T>();
		ret->_point3 = std::make_shared<T>(this_ / other);

		info.SetReturnValue(ret);
	}

	static POLY_METHOD(setTo) {
		auto other = info.at<Point3_<T>*>(0)->_point3;
		auto this_ = info.This<Point3_<T>*>();

		this_->_point3 = std::make_shared<T>(*other);
	}
	
};



//declare variables
template <typename T>
Nan::Persistent<FunctionTemplate> Point3_<T>::constructor;

template <typename T>
std::string Point3_<T>::name;


typedef typename Point3_<cv::Point3i> Point3i;
typedef typename Point3_<cv::Point3f> Point3f;
typedef typename Point3_<cv::Point3d> Point3d;

namespace Point3Init {
	void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
}


#endif