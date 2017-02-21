#ifndef _ALVISION_SIZE_IMP_H_
#define _ALVISION_SIZE_IMP_H_

#include "../../alvision.h"
#include "Size.h"

//#include "Point.h"

namespace size_general_callback {
	extern std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback);
}

template <typename T>
void Size_<T>::Register(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
	Size_<T>::name = name;
}

template <typename T>
	void Size_<T>::Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		size_general_callback::overload = overload;
		
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(size_general_callback::callback);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		overload->register_type<Size_<T>>(ctor, "size", name);



		//export interface Size_Static<T> {
		overload->addOverloadConstructor("size", name, {}, New);
			//new () : Size_<T>;

		overload->addOverloadConstructor("size", name, {
			make_param<TVT>("width","Number"),
			make_param<TVT>("height","Number"),
		}, New_width_height);
			//new (_width : T, _height : T) : Size_<T>;

		overload->addOverloadConstructor("size", name, {
			make_param<Size_<T>*>("sz",Size_<T>::name)
		}, New_size);
			//new (sz : Size_<T>) : Size_<T>;

		overload->addOverloadConstructor("size", name, {
			make_param<PointT*>("pt",PointT::name)
		}, New_point);
			//new (pt: Point_<T>) : Size_<T>;


			////////////////////////////////// Size /////////////////////////////////

			//template < typename _Tp> inline
			//Size_<_Tp>::Size_()
			//    : width(0), height(0) {}

			//template< typename _Tp> inline
			//Size_<_Tp>::Size_(_Tp _width, _Tp _height)
			//    : width(_width), height(_height) {}

			//template< typename _Tp> inline
			//Size_<_Tp>::Size_(const Size_& sz)
			//    : width(sz.width), height(sz.height) {}

			//template < typename _Tp> inline
			//Size_<_Tp>::Size_(const Point_<_Tp>& pt)
			//    : width(pt.x), height(pt.y) {}

			//template < typename _Tp> template < typename _Tp2> inline
			//Size_<_Tp>::operator Size_<_Tp2>() const
			//    {
			//        return Size_<_Tp2>(saturate_cast<_Tp2>(width), saturate_cast<_Tp2>(height));
			//}

			//template < typename _Tp> inline
			//Size_<_Tp>& Size_<_Tp>::operator = (const Size_<_Tp>& sz)
			//    {
			//        width = sz.width; height = sz.height;
			//return *this;
			//}

			//template < typename _Tp> inline
			//_Tp Size_<_Tp>::area() const
			//    {
			//        return width * height;
			//}

			//template < typename _Tp> static inline
			//Size_<_Tp>& operator *= (Size_<_Tp>& a, _Tp b)
			//{
			//    a.width *= b;
			//    a.height *= b;
			//    return a;
			//}

			//template< typename _Tp> static inline
			//Size_< _Tp > operator * (const Size_<_Tp>& a, _Tp b)
			//    {
			//        Size_<_Tp>tmp(a);
			//tmp *= b;
			//return tmp;
			//}
		overload->addStaticOverload("size", name, "op_Multiplication", {
			make_param<Size_<T>*>("a",Size_<T>::name),
			make_param<TVT>("b","Number"),
		}, op_Multiplication);
		Nan::SetMethod(ctor, "op_Multiplication", size_general_callback::callback);
			//op_Multiplication(a: Size_<T>, b : T) : Size_<T>;

			//template < typename _Tp> static inline
			//Size_<_Tp>& operator /= (Size_<_Tp>& a, _Tp b)
			//{
			//        a.width /= b;
			//        a.height /= b;
			//        return a;
			//    }

			//template< typename _Tp> static inline
			//Size_< _Tp > operator / (const Size_<_Tp>& a, _Tp b)
			//    {
			//        Size_<_Tp>tmp(a);
			//tmp /= b;
			//return tmp;
			//}
		overload->addStaticOverload("size", name, "op_Division", {
			make_param<Size_<T>*>("a",Size_<T>::name),
			make_param<TVT>("b","Number"),
		}, op_Division);
		Nan::SetMethod(ctor, "op_Division", size_general_callback::callback);

			//op_Division(a: Size_<T>, b : T) : Size_<T>;

			//template < typename _Tp> static inline
			//Size_<_Tp>& operator += (Size_<_Tp>& a, const Size_<_Tp>& b)
			//    {
			//        a.width += b.width;
			//a.height += b.height;
			//return a;
			//}

			//template < typename _Tp> static inline
			//Size_ < _Tp > operator + (const Size_<_Tp>& a, const Size_<_Tp>& b)
			//    {
			//        Size_<_Tp>tmp(a);
			//tmp += b;
			//return tmp;
			//}
		overload->addStaticOverload("size", name, "op_Addition", {
			make_param<Size_<T>*>("a",Size_<T>::name),
			make_param<Size_<T>*>("b",Size_<T>::name),
		}, op_Addition);
		Nan::SetMethod(ctor, "op_Addition", size_general_callback::callback);

			//op_Addition(a: Size_<T>, b : Size_<T>) : Size_<T>;

			//template < typename _Tp> static inline
			//Size_<_Tp>& operator -= (Size_<_Tp>& a, const Size_<_Tp>& b)
			//    {
			//        a.width -= b.width;
			//a.height -= b.height;
			//return a;
			//}

			//template < typename _Tp> static inline
			//Size_ < _Tp > operator - (const Size_<_Tp>& a, const Size_<_Tp>& b)
			//    {
			//        Size_<_Tp>tmp(a);
			//tmp -= b;
			//return tmp;
			//}
		overload->addStaticOverload("size", name, "op_Substraction", {
			make_param<Size_<T>*>("a",Size_<T>::name),
			make_param<Size_<T>*>("b",Size_<T>::name),
		}, op_Substraction);
		Nan::SetMethod(ctor, "op_Substraction", size_general_callback::callback);

			//op_Substraction(a: Size_<T>, b : Size_<T>) : Size_<T>;

			//template < typename _Tp> static inline
			//bool operator == (const Size_<_Tp>& a, const Size_<_Tp>& b)
			//    {
			//        return a.width == b.width && a.height == b.height;
			//}


			//template < typename _Tp> static inline
			//bool operator != (const Size_<_Tp>& a, const Size_<_Tp>& b)
			//    {
			//        return !(a == b);
			//}
		//}

		//export interface Size_<T> {
			//! the area (width*height)
		overload->addOverload("size", name, "area", {}, area);
		Nan::SetPrototypeMethod(ctor, "area", size_general_callback::callback);
			//area() : T;

		//width: T;
		//height: T;
		//}










		Nan::SetAccessor(ctor->InstanceTemplate(),Nan::New( "width").ToLocalChecked(), width_getter, width_setter);
		Nan::SetAccessor(ctor->InstanceTemplate(),Nan::New( "height").ToLocalChecked(), height_getter, height_setter);
		

		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());

		
	}




	template <typename T>
	std::shared_ptr<Size_<T>> Size_<T>::Empty() {
		auto ret = std::make_shared<Size_<T>>();
		ret->_size = std::make_shared<T>();
		return ret;
	}


	template <typename T>
	POLY_METHOD(Size_<T>::New) {
		auto size = new Size_<T>();

		size->_size = std::make_shared<T>();
		size->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}
	
	template <typename T>
	POLY_METHOD(Size_<T>::New_width_height) {
		auto size = new Size_<T>();

		size->_size = std::make_shared<T>(info.at<TVT>(0), info.at<TVT>(1));
		size->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Size_<T>::New_size) {
		auto size = new Size_<T>();

		auto a = *info.at<Size_<T>*>(0)->_size;
		size->_size = std::make_shared<T>(a);
		size->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Size_<T>::New_point) {
		auto size = new Size_<T>();

		auto pt = *info.at<PointT*>(0)->_point;

		size->_size = std::make_shared<T>(pt);
		size->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Size_<T>::op_Multiplication) {
		auto size = new Size_<T>();

		auto a = *info.at<Size_<T>*>(0)->_size;
		auto b = info.at<TVT>(1);

		size->_size = std::make_shared<T>(a * b);

		info.SetReturnValue(size);
	}

	template <typename T>
	POLY_METHOD(Size_<T>::op_Division) {
		auto size = new Size_<T>();

		auto a = *info.at<Size_<T>*>(0)->_size;
		auto b = info.at<TVT>(1);

		size->_size = std::make_shared<T>(a / b);

		info.SetReturnValue(size);
	}

	
	template <typename T>
	POLY_METHOD(Size_<T>::op_Addition) {
		auto size = new Size_<T>();

		auto a = *info.at<Size_<T>*>(0)->_size;
		auto b = *info.at<Size_<T>*>(1)->_size;

		size->_size = std::make_shared<T>(a + b);

		info.SetReturnValue(size);
	}

	template <typename T>
	POLY_METHOD(Size_<T>::op_Substraction) {
		auto size = new Size_<T>();

		auto a = *info.at<Size_<T>*>(0)->_size;
		auto b = *info.at<Size_<T>*>(1)->_size;

		size->_size = std::make_shared<T>(a - b);

		info.SetReturnValue(size);
	}

	template <typename T>
	POLY_METHOD(Size_<T>::area) {
		auto this_ = info.This<Size_<T>*>();
		info.SetReturnValue(this_->_size->area());
	}

	template <typename T>
	NAN_GETTER(Size_<T>::width_getter) {
		auto this_ = or ::ObjectWrap::Unwrap<Size_<T>>(info.This());
		info.GetReturnValue().Set(this_->_size->width);
	}

	template <typename T>
	NAN_SETTER(Size_<T>::width_setter) {
		auto this_ = or ::ObjectWrap::Unwrap<Size_<T>>(info.This());
		this_->_size->width = value->NumberValue();
	}


	template <typename T>
	NAN_GETTER(Size_<T>::height_getter) {
		auto this_ = or ::ObjectWrap::Unwrap<Size_<T>>(info.This());
		info.GetReturnValue().Set(this_->_size->height);
	}
	template <typename T>
	NAN_SETTER(Size_<T>::height_setter) {
		auto this_ = or ::ObjectWrap::Unwrap<Size_<T>>(info.This());
		this_->_size->height = value->NumberValue();
	}
	

//declare variables
template <typename T>
Nan::Persistent<FunctionTemplate> Size_<T>::constructor;

template<typename T>
std::string Size_<T>::name;

typedef typename Size_<cv::Size2i> Size2i;
typedef typename Size_<cv::Size2f> Size2f;
typedef typename Size_<cv::Size2d> Size2d;
typedef typename Size_<cv::Size>   Size;

namespace SizeInit {
	void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
}

#endif