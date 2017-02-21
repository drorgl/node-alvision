#ifndef _ALVISION_POINT_IMP_H_
#define _ALVISION_POINT_IMP_H_

#include "../../alvision.h"
#include "Point.h"
#include "Size.h"
#include "Rect.h"
template <typename T>
void Point_<T>::Register(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
	Point_<T>::name = name;
}

template <typename T>
void Point_<T>::Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		point_general_callback::overload = overload;
		
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(point_general_callback::callback);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		overload->register_type<Point_<T>>(ctor, "point", name);




//		export interface Point_Static<T> {
//			new () : Point_<T>;
		overload->addOverloadConstructor("point", name, {}, New);
//			new (_x : T, _y : T) : Point_<T>;
		overload->addOverloadConstructor("point", name, {
			make_param<value_type>("x","Number"),
			make_param<value_type>("y","Number")
		}, New_x_y);
//			new (sz: Size_<T>) : Point_<T>;
		overload->addOverloadConstructor("point", name, {
			make_param<SizeT*>("sz",SizeT::name)
		}, New_size);
//			new (v: _matx.Vec<T>) : Point_<T>;
		overload->addOverloadConstructor("point", name, {
			make_param<VecT*>("v",VecT::name)
		}, New_vec);
//			new (buf: Buffer) : Point_<T>; //from Buffer (deserialize)
		overload->addOverloadConstructor("point", name, {
			make_param<std::shared_ptr<std::vector<uint8_t>>>("buf","Buffer")
		}, New_buf);

//
//										   //template< typename _Tp> static inline
//										   //double norm(const Point_<_Tp>& pt)
//										   //    {
//										   //        return std::sqrt((double)pt.x*pt.x + (double)pt.y*pt.y);
//										   //}
//			norm(pt: Point_<T>) : _st.double;
		overload->addStaticOverload("point", name, "norm", {
			make_param<Point_<T>*>("pt",name)
		}, norm);
		Nan::SetMethod(ctor, "norm", point_general_callback::callback);
//
//			//template < typename _Tp> static inline
//			//bool operator == (const Point_<_Tp>& a, const Point_<_Tp>& b)
//			//    {
//			//        return a.x == b.x && a.y == b.y;
//			//}
//			op_Equals(a: Point_<T>, b : Point_<T>) : boolean;
		overload->addStaticOverload("point", name, "op_Equals", {
			make_param<Point_<T>*>("a",name),
			make_param<Point_<T>*>("b",name)
		}, op_Equals);
		Nan::SetMethod(ctor, "op_Equals", point_general_callback::callback);
//
//			//template < typename _Tp> static inline
//			//bool operator != (const Point_<_Tp>& a, const Point_<_Tp>& b)
//			//    {
//			//        return a.x != b.x || a.y != b.y;
//			//}
//			op_NotEquals(a: Point_<T>, b : Point_<T>) : boolean;
		overload->addStaticOverload("point", name, "op_NotEquals", {
			make_param<Point_<T>*>("a",name),
			make_param<Point_<T>*>("b",name)
		}, op_NotEquals);
		Nan::SetMethod(ctor, "op_NotEquals", point_general_callback::callback);
//
//			//template < typename _Tp> static inline
//			//Point_ < _Tp > operator + (const Point_<_Tp>& a, const Point_<_Tp>& b)
//			//    {
//			//        return Point_<_Tp>(saturate_cast<_Tp>(a.x + b.x), saturate_cast<_Tp>(a.y + b.y));
//			//}
//			op_Addition(a: Point_<T>, b : Point_<T>) : Point_<T>;
		overload->addStaticOverload("point", name, "op_Addition", {
			make_param<Point_<T>*>("a",name),
			make_param<Point_<T>*>("b",name)
		}, op_Addition);
		Nan::SetMethod(ctor, "op_Addition", point_general_callback::callback);
//
//			//template < typename _Tp> static inline
//			//Point_ < _Tp > operator - (const Point_<_Tp>& a, const Point_<_Tp>& b)
//			//    {
//			//        return Point_<_Tp>(saturate_cast<_Tp>(a.x - b.x), saturate_cast<_Tp>(a.y - b.y));
//			//}
//			op_Substraction(a: Point_<T>, b : Point_<T>) : Point_<T>;
		overload->addStaticOverload("point", name, "op_Substraction", {
			make_param<Point_<T>*>("a",name),
			make_param<Point_<T>*>("b",name)
		}, op_Substraction);
		Nan::SetMethod(ctor, "op_Substraction", point_general_callback::callback);
//
//			//template < typename _Tp> static inline
//			//Point_ < _Tp > operator - (const Point_<_Tp>& a)
//			//    {
//			//        return Point_<_Tp>(saturate_cast<_Tp>(-a.x), saturate_cast<_Tp>(-a.y));
//			//}
//			op_Substraction(a: Point_<T>) : Point_<T>;
		overload->addStaticOverload("point", name, "op_Substraction", {
			make_param<Point_<T>*>("a",name),
		}, op_Substraction_a);
		Nan::SetMethod(ctor, "op_Substraction", point_general_callback::callback);
//
//			//template < typename _Tp> static inline
//			//Point_ < _Tp > operator * (const Point_<_Tp>& a, int b)
//			//    {
//			//        return Point_<_Tp>(saturate_cast<_Tp>(a.x * b), saturate_cast<_Tp>(a.y * b));
//			//}
//			op_Multiplication(a: Point_<T>, b : _st.int) : Point_<T>;
		overload->addStaticOverload("point", name, "op_Multiplication", {
			make_param<Point_<T>*>("a",name),
			make_param<double>("b","Number")
		}, op_Multiplication_t_number);
		Nan::SetMethod(ctor, "op_Multiplication", point_general_callback::callback);
//
//			//template < typename _Tp> static inline
//			//Point_ < _Tp > operator * (int a, const Point_<_Tp>& b)
//			//    {
//			//        return Point_<_Tp>(saturate_cast<_Tp>(b.x * a), saturate_cast<_Tp>(b.y * a));
//			//}
//			op_Multiplication(a: _st.int, b : Point_<T>) : Point_<T>;
		overload->addStaticOverload("point", name, "op_Multiplication", {
			make_param<double>("a","Number"),
			make_param<Point_<T>*>("b",name)
		}, op_Multiplication_number_t);
		Nan::SetMethod(ctor, "op_Multiplication", point_general_callback::callback);
//
//			//template < typename _Tp> static inline
//			//Point_ < _Tp > operator * (const Point_<_Tp>& a, float b)
//			//    {
//			//        return Point_<_Tp>(saturate_cast<_Tp>(a.x * b), saturate_cast<_Tp>(a.y * b));
//			//}
//			op_Multiplication(a: Point_<T>, b : _st.float) : Point_<T>;
//
//			//template < typename _Tp> static inline
//			//Point_ < _Tp > operator * (float a, const Point_<_Tp>& b)
//			//    {
//			//        return Point_<_Tp>(saturate_cast<_Tp>(b.x * a), saturate_cast<_Tp>(b.y * a));
//			//}
//			op_Multiplication(a: _st.float, b : Point_<T>) : Point_<T>;
//
//			//template < typename _Tp> static inline
//			//Point_ < _Tp > operator * (const Point_<_Tp>& a, double b)
//			//    {
//			//        return Point_<_Tp>(saturate_cast<_Tp>(a.x * b), saturate_cast<_Tp>(a.y * b));
//			//}
//			op_Multiplication(a: Point_<T>, b : _st.double) : Point_<T>;
//
//			//template < typename _Tp> static inline
//			//Point_ < _Tp > operator * (double a, const Point_<_Tp>& b)
//			//    {
//			//        return Point_<_Tp>(saturate_cast<_Tp>(b.x * a), saturate_cast<_Tp>(b.y * a));
//			//}
//			op_Multiplication(a: _st.double, b : Point_<T>) : Point_<T>;
//
//			//template < typename _Tp> static inline
//			//Point_ < _Tp > operator * (const Matx<_Tp, 2, 2 >& a, const Point_<_Tp>& b)
//			//    {
//			//        Matx<_Tp, 2, 1> tmp = a * Vec < _Tp, 2>(b.x, b.y);
//			//return Point_<_Tp>(tmp.val[0], tmp.val[1]);
//			//}
//			op_Multiplication(a: _matx.Matx<T>, b : Point_<T>) : Point_<T>;
		overload->addStaticOverload("point", name, "op_Multiplication", {
			make_param<VecT*>("a",VecT::name),
			make_param<Point_<T>*>("b",name)
		}, op_Multiplication_vec_point);
		Nan::SetMethod(ctor, "op_Multiplication", point_general_callback::callback);
//
//
//
//			//template < typename _Tp> static inline
//			//Point_ < _Tp > operator / (const Point_<_Tp>& a, int b)
//			//    {
//			//        Point_<_Tp>tmp(a);
//			//tmp /= b;
//			//return tmp;
//			//}
//			op_Division(a: Point_<T>, b : _st.int) : Point_<T>;
		overload->addStaticOverload("point", name, "op_Division", {
			make_param<Point_<T>*>("a",name),
			make_param<double>("b","Number")
		}, op_Division);
		Nan::SetMethod(ctor, "op_Division", point_general_callback::callback);
//
//			//template < typename _Tp> static inline
//			//Point_ < _Tp > operator / (const Point_<_Tp>& a, float b)
//			//    {
//			//        Point_<_Tp>tmp(a);
//			//tmp /= b;
//			//return tmp;
//			//}
//			op_Division(a: Point_<T>, b : _st.float) : Point_<T>;
		//overload->addStaticOverload("point", name, "", {}, );
//
//			//template < typename _Tp> static inline
//			//Point_ < _Tp > operator / (const Point_<_Tp>& a, double b)
//			//    {
//			//        Point_<_Tp>tmp(a);
//			//tmp /= b;
//			//return tmp;
//			//}
//			op_Division(a: Point_<T>, b : _st.double) : Point_<T>;
		//overload->addStaticOverload("point", name, "", {}, );
//
//		}
//
//		export interface Point_<T> extends _st.IOArray{
//			dot(pt: Point_<T>) : T;
		overload->addOverload("point", name, "dot", {
			make_param<Point_<T>*>("a",name)
		}, dot);
		Nan::SetPrototypeMethod(ctor, "dot", point_general_callback::callback);
//		//! dot product computed in double-precision arithmetics
//		ddot(pt: Point_<T>) : _st.double;
		overload->addOverload("point", name, "ddot", {
			make_param<Point_<T>*>("a",name)
		}, ddot);
		Nan::SetPrototypeMethod(ctor, "ddot", point_general_callback::callback);
//		//! cross-product
//		cross(pt: Point_<T>) : _st.double;
		overload->addOverload("point", name, "cross", {
			make_param<Point_<T>*>("a",name)
		}, cross);
		Nan::SetPrototypeMethod(ctor, "cross", point_general_callback::callback);
//		//! checks whether the point is inside the specified rectangle
//		inside(r: Rect_<T>) : boolean;
		overload->addOverload("point", name, "inside", {
			make_param<RectT*>("a",RectT::name)
		}, inside);
		Nan::SetPrototypeMethod(ctor, "inside", point_general_callback::callback);
//
//	x: T;
		Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("x").ToLocalChecked(), x_getter, x_setter);
//	y: T;
		Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("y").ToLocalChecked(), y_getter, y_setter);
//		//_Tp x, y; //< the point coordinates
//
//		op_Equals(other: Point_<T>) : boolean;
		overload->addOverload("point", name, "op_Equals", {
			make_param<Point_<T>*>("other",name)
		}, op_Equals_other);
		Nan::SetPrototypeMethod(ctor, "op_Equals", point_general_callback::callback);
//		op_NotEquals(other: Point_<T>) : boolean;
		overload->addOverload("point", name, "op_NotEquals", {
			make_param<Point_<T>*>("other",name)
		}, op_NotEquals_other);
		Nan::SetPrototypeMethod(ctor, "op_NotEquals", point_general_callback::callback);
//		op_Addition(other: Point_<T>) : Point_<T>;
		overload->addOverload("point", name, "op_Addition", {
			make_param<Point_<T>*>("other",name)	
		}, op_Addition_other);
		Nan::SetPrototypeMethod(ctor, "op_Addition", point_general_callback::callback);
//		op_Substraction(other: Point_<T>) : Point_<T>;
		overload->addOverload("point", name, "op_Substraction", {
			make_param<Point_<T>*>("other",name)
		}, op_Substraction_other);
		Nan::SetPrototypeMethod(ctor, "op_Substraction", point_general_callback::callback);
//		op_Multiplication(other: _st.int | _st.float | _st.double | number) : Point_<T>;
		overload->addOverload("point", name, "op_Multiplication", {
			make_param<double>("other","Number")
		}, op_Multiplication_other_number);
		Nan::SetPrototypeMethod(ctor, "op_Multiplication", point_general_callback::callback);
//		op_Multiplication(other: _matx.Matx<T>) : Point_<T>;
		overload->addOverload("point", name, "op_Multiplication", {
			make_param<MatxT*>("other",MatxT::name)
		}, op_Multiplication_other_matx);
		Nan::SetPrototypeMethod(ctor, "op_Multiplication", point_general_callback::callback);
//		op_Division(other: _st.int | _st.float | _st.double) : Point_<T>;
		overload->addOverload("point", name, "op_Division", {
			make_param<double>("other","Number")
		}, op_Division_other_number);
		Nan::SetPrototypeMethod(ctor, "op_Division", point_general_callback::callback);
//
//		toBuffer() : Buffer;
		overload->addOverload("point", name, "toBuffer", {}, toBuffer);
		Nan::SetPrototypeMethod(ctor, "toBuffer", point_general_callback::callback);
//		}

		overload->addOverload("point", name, "setTo", { make_param<Point_<T>*>("other",name) }, setTo);
		Nan::SetPrototypeMethod(ctor, "setTo", point_general_callback::callback);

		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());

		
	}

	


	template <typename T>
	POLY_METHOD(Point_<T>::New) {
		auto point = new Point_<T>();
		
		point->_point = std::make_shared<T>();

		point->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Point_<T>::New_x_y){
		auto point = new Point_<T>();
		
		point->_point = std::make_shared<T>(info.at<value_type>(0), info.at<value_type>(1));

		point->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Point_<T>::New_size){
		auto point = new Point_<T>();
		
		point->_point = std::make_shared<T>(*info.at<SizeT*>(0)->_size);

		point->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Point_<T>::New_vec){
		auto point = new Point_<T>();
		
		point->_point = std::make_shared<T>(*info.at<VecT*>(0)->_vec);

		point->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Point_<T>::New_buf){
		auto point = new Point_<T>();

		auto value_size = sizeof(value_type);
		auto point_size = value_size * 2;
		
		auto buf = info.at < std::shared_ptr<std::vector<uint8_t>>>(0);
		if (buf->size() < point_size) {
			throw std::runtime_error("buffer must be at least "s + std::to_string(point_size) + " bytes"s);
		}

		point->_point = std::make_shared<T>();

		memcpy(&point->_point->x, &(*buf)[0], value_size);
		memcpy(&point->_point->y, (&(*buf)[0]) + value_size, value_size);

		point->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Point_<T>::norm) {
		info.SetReturnValue(cv::norm(*info.at<Point_<T>*>(0)->_point));
	}

	template <typename T>
	POLY_METHOD(Point_<T>::op_Equals) {
		auto a = *info.at<Point_<T>*>(0)->_point;
		auto b = *info.at<Point_<T>*>(1)->_point;

		info.SetReturnValue(a == b);
	}

	template <typename T>
	 POLY_METHOD(Point_<T>::op_NotEquals											){
		 auto a = *info.at<Point_<T>*>(0)->_point;
		 auto b = *info.at<Point_<T>*>(1)->_point;

		 info.SetReturnValue(a != b);
	 }

	 template <typename T>
	 POLY_METHOD(Point_<T>::op_Addition											){
		 auto a = *info.at<Point_<T>*>(0)->_point;
		 auto b = *info.at<Point_<T>*>(1)->_point;

		 auto point = new Point_<T>();
		 point->_point = std::make_shared<T>(a + b);
		 info.SetReturnValue(point);
	 }

	 template <typename T>
	 POLY_METHOD(Point_<T>::op_Substraction										){
		 auto a = *info.at<Point_<T>*>(0)->_point;
		 auto b = *info.at<Point_<T>*>(1)->_point;

		 auto point = new Point_<T>();
		 point->_point = std::make_shared<T>(a - b);
		 info.SetReturnValue(point);
	 }

	 template <typename T>
	 POLY_METHOD(Point_<T>::op_Substraction_a									){
		 auto a = *info.at<Point_<T>*>(0)->_point;

		 auto point = new Point_<T>();
		 point->_point = std::make_shared<T>(-a);
		 info.SetReturnValue(point);
	 }

	 template <typename T>
	 POLY_METHOD(Point_<T>::op_Multiplication_t_number							){
		 auto a = *info.at<Point_<T>*>(0)->_point;
		 auto b = info.at<double>(1);

		 auto point = new Point_<T>();
		 point->_point = std::make_shared<T>(a * b);
		 info.SetReturnValue(point);
	 }

	 template <typename T>
	 POLY_METHOD(Point_<T>::op_Multiplication_number_t							){
		 auto a = info.at<double>(0);
		 auto b = *info.at<Point_<T>*>(1)->_point;

		 auto point = new Point_<T>();
		 point->_point = std::make_shared<T>(a * b);
		 info.SetReturnValue(point);
	 }

	 template <typename T>
	 POLY_METHOD(Point_<T>::op_Multiplication_vec_point							){
		 throw std::exception("not implemented");
		 /*auto a = *info.at<VecT*>(0)->_vec;
		 auto b = *info.at<Point_<T>*>(1)->_point;

		 auto point = new Point_<T>();
		 point->_point = std::make_shared<T>(a * b);
		 info.SetReturnValue(point);*/
	 }

	 template <typename T>
	 POLY_METHOD(Point_<T>::op_Division											){
		 auto a = *info.at<Point_<T>*>(0)->_point;
		 auto b = info.at<double>(1);

		 auto point = new Point_<T>();
		 point->_point = std::make_shared<T>(a / b);
		 info.SetReturnValue(point);
	 }

	 template <typename T>
	 POLY_METHOD(Point_<T>::dot													){
		 auto this_ = info.This<Point_<T>*>()->_point;
		 auto a = *info.at<Point_<T>*>(0)->_point;
		 info.SetReturnValue(this_->dot(a));
	 }

	 template <typename T>
	 POLY_METHOD(Point_<T>::ddot													){
		 auto this_ = info.This<Point_<T>*>()->_point;
		 auto a = *info.at<Point_<T>*>(0)->_point;
		 info.SetReturnValue(this_->ddot(a));
	 }

	 template <typename T>
	 POLY_METHOD(Point_<T>::cross												){
		 auto this_ = info.This<Point_<T>*>()->_point;
		 auto a = *info.at<Point_<T>*>(0)->_point;
		 info.SetReturnValue(this_->cross(a));
	 }

	 template <typename T>
	 POLY_METHOD(Point_<T>::inside												){
		 auto this_ = info.This<Point_<T>*>()->_point;
		 auto rect = *info.at<RectT*>(0)->_rect;
		 info.SetReturnValue(this_->inside(rect));
	 }

	 template <typename T>
	 NAN_GETTER(Point_<T>::x_getter){
		 auto this_ = or ::ObjectWrap::Unwrap<Point_<T>>(info.This());
		 info.GetReturnValue().Set(this_->_point->x);
	 }

	 template <typename T>
	 NAN_SETTER(Point_<T>::x_setter){
		 auto this_ = or ::ObjectWrap::Unwrap<Point_<T>>(info.This());
		 this_->_point->x = value->NumberValue();
		 info.GetReturnValue().Set(this_->_point->x);
	 }

	 template <typename T>
	 NAN_GETTER(Point_<T>::y_getter){
		 auto this_ = or ::ObjectWrap::Unwrap<Point_<T>>(info.This());
		 info.GetReturnValue().Set(this_->_point->y);
	 }

	 template <typename T>
	 NAN_SETTER(Point_<T>::y_setter){
		 auto this_ = or ::ObjectWrap::Unwrap<Point_<T>>(info.This());
		 this_->_point->y = value->NumberValue();
		 info.GetReturnValue().Set(this_->_point->y);
	 }


	 template <typename T>
	 POLY_METHOD(Point_<T>::op_Equals_other					){
		 auto this_ = *info.This<Point_<T>*>()->_point;
		 auto other = *info.at<Point_<T>*>(0)->_point;
		 info.SetReturnValue(this_ == other);
	 }

	 template <typename T>
	 POLY_METHOD(Point_<T>::op_NotEquals_other				){
		 auto this_ = *info.This<Point_<T>*>()->_point;
		 auto other = *info.at<Point_<T>*>(0)->_point;
		 info.SetReturnValue(this_ != other);
	 }

	 template <typename T>
	 POLY_METHOD(Point_<T>::op_Addition_other				){
		 auto this_ = *info.This<Point_<T>*>()->_point;
		 auto other = *info.at<Point_<T>*>(0)->_point;

		 auto point = new Point_<T>();
		 point->_point = std::make_shared<T>(this_ + other);
		 info.SetReturnValue(point);
	 }

	 template <typename T>
	 POLY_METHOD(Point_<T>::op_Substraction_other			){
		 auto this_ = *info.This<Point_<T>*>()->_point;
		 auto other = *info.at<Point_<T>*>(0)->_point;

		 auto point = new Point_<T>();
		 point->_point = std::make_shared<T>(this_ - other);
		 info.SetReturnValue(point);
	 }

	 template <typename T>
	 POLY_METHOD(Point_<T>::op_Multiplication_other_number	){
		 auto this_ = *info.This<Point_<T>*>()->_point;
		 auto other = info.at<double>(0);

		 auto point = new Point_<T>();
		 point->_point = std::make_shared<T>(this_ * other);
		 info.SetReturnValue(point);
	 }

	 template <typename T>
	 POLY_METHOD(Point_<T>::op_Multiplication_other_matx		){
		 throw std::exception("not implemented");
		 /*auto this_ = *info.This<Point_<T>*>()->_point;
		 auto other = *info.at<MatxT*>(0)->_matx;

		 auto point = new Point_<T>();
		 point->_point = std::make_shared<T>(this_ * other);
		 info.SetReturnValue(point);*/
	 }

	 template <typename T>
	 POLY_METHOD(Point_<T>::op_Division_other_number			){
		 auto this_ = *info.This<Point_<T>*>()->_point;
		 auto other = info.at<double>(0);

		 auto point = new Point_<T>();
		 point->_point = std::make_shared<T>(this_ / other);
		 info.SetReturnValue(point);
	 }

	 template <typename T>
	 POLY_METHOD(Point_<T>::toBuffer							){
		 auto this_ = *info.This<Point_<T>*>()->_point;

		 auto value_size = sizeof(value_type);
		 auto point_size = value_size * 2;

		 auto buf = Nan::NewBuffer(point_size).ToLocalChecked();
		 auto buf_data = node::Buffer::Data(buf);
		 
		 memcpy(buf_data, &this_.x, value_size);
		 memcpy(buf_data + value_size, &this_.y, value_size);

		 info.GetReturnValue().Set(buf);
	 }

	 template <typename T>
	 POLY_METHOD(Point_<T>::setTo) {
		 auto other = info.at<Point_<T>*>(0)->_point;
		 auto this_ = info.This<Point_<T>*>();

		 this_->_point = std::make_shared<T>(*other);
	 }
	
		


//declare variables
template <typename T>
Nan::Persistent<FunctionTemplate> Point_<T>::constructor;

template <typename T>
std::string Point_<T>::name;


typedef typename Point_<cv::Point2i> Point2i;
typedef typename Point_<cv::Point2f> Point2f;
typedef typename Point_<cv::Point2d> Point2d;
typedef typename Point2i   Point;

namespace PointInit {
	void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
}

#endif