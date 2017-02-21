#ifndef _ALVISION_RECT_IMP_H_
#define _ALVISION_RECT_IMP_H_
//#include "OpenCV.h"
#include "../../alvision.h"
#include "Point.h"
#include "Size.h"
#include "Rect.h"

namespace rect_general_callback {
	extern std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback);
}

template <typename T>
void Rect_<T>::Register(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
	Rect_<T>::name = name;
}

template <typename T>
std::string Rect_<T>::name;


//declare variables
template <typename T>
Nan::Persistent<FunctionTemplate> Rect_<T>::constructor;






template <typename T>
	void Rect_<T>::Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		rect_general_callback::overload = overload;
		Rect_<T>::name = name;
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(rect_general_callback::callback);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		overload->register_type<Rect_<T>>(ctor, "rect", name);



//		export interface Rect_Static<T> {
//			new () : Rect_<T>;
		overload->addOverloadConstructor("rect", name, {},New );

//			new (_x : T, _y : T, _width : T, _height : T) : Rect_<T>;
		overload->addOverloadConstructor("rect", name, {
			make_param<TVT>("x","Number"),
			make_param<TVT>("y","Number"),
			make_param<TVT>("width","Number"),
			make_param<TVT>("height","Number"),
		}, New_x_y_width_height);
//			new (r : Rect_<T>) : Rect_<T>;
		overload->addOverloadConstructor("rect", name, {
			make_param<Rect_<T>*>("r",Rect_<T>::name)
		}, New_rect);
//			new (org: Point_<T>, sz : Size_<T>) : Rect_<T>;
		overload->addOverloadConstructor("rect", name, {
			make_param<PointT*>("org",PointT::name),
			make_param<SizeT*>("org",SizeT::name),
		},New_point_size );
//			new (pt1: Point_<T>, pt2 : Point_<T>) : Rect_<T>;
		overload->addOverloadConstructor("rect", name, {
			make_param<PointT*>("pt1",PointT::name),
			make_param<PointT*>("pt2",PointT::name),
		}, New_point_point);
//
//			op_And(a: Rect_<T>, b : Rect_<T>) : Rect_<T>;
		overload->addStaticOverload("rect", name,"op_And", {
			make_param<Rect_<T>*>("a",Rect_<T>::name),
			make_param<Rect_<T>*>("b",Rect_<T>::name),
		}, op_And);
		Nan::SetMethod(ctor, "op_And", rect_general_callback::callback);
//		}
//
//		export interface Rect_<T> {
//			//! the top-left corner
//			tl() : Point_<T>;
		overload->addOverload("rect", name, "tl", {}, tl);
//			//! the bottom-right corner
//			br() : Point_<T>;
		overload->addOverload("rect", name, "br", {}, br);
//
//			//! size (width, height) of the rectangle
//			size() : Size_<T>;
		overload->addOverload("rect", name, "size", {}, size);
//			//! area (width*height) of the rectangle
//			area() : T;
		overload->addOverload("rect", name, "area", {}, area);
//
//			//! conversion to another data type
//			//template < typename _Tp2> operator Rect_<_Tp2>() const;
//
//			//! checks whether the rectangle contains the point
//			contains(pt : Point_<T>) : boolean;
//
//		x: T;
//		y: T;
//		width: T;
//		height: T;
//
//			//_Tp x, y, width, height; //< the top-left corner, as well as width and height of the rectangle
//		}

		Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("x").ToLocalChecked(), Rect_<T>::x_getter, Rect_<T>::x_setter);
		Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("y").ToLocalChecked(), Rect_<T>::y_getter, Rect_<T>::y_setter);
		Nan::SetAccessor(ctor->InstanceTemplate(),Nan::New( "width").ToLocalChecked(),  Rect_<T>::width_getter, Rect_<T>::width_setter);
		Nan::SetAccessor(ctor->InstanceTemplate(),Nan::New( "height").ToLocalChecked(), Rect_<T>::height_getter, Rect_<T>::height_setter );
		

		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());
	}

	template <typename T>
	POLY_METHOD(Rect_<T>::New) {
		auto rect = new Rect_<T>();
	
		rect->_rect = std::make_shared<T>();

		rect->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Rect_<T>::New_x_y_width_height){
		auto rect = new Rect_<T>();

		rect->_rect = std::make_shared<T>(info.at<TVT>(0), info.at<TVT>(1), info.at<TVT>(2), info.at<TVT>(3));

		rect->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Rect_<T>::New_rect			   ){
		auto rect = new Rect_<T>();

		rect->_rect = std::make_shared<T>(*info.at<Rect_<T>*>(0)->_rect);

		rect->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Rect_<T>::New_point_size	   ){
		auto rect = new Rect_<T>();

		rect->_rect = std::make_shared<T>(*info.at<PointT*>(0)->_point, *info.at<SizeT*>(1)->_size);

		rect->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Rect_<T>::New_point_point	   ){
		auto rect = new Rect_<T>();

		rect->_rect = std::make_shared<T>(*info.at<PointT*>(0)->_point, *info.at<PointT*>(1)->_point);

		rect->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	template <typename T>
	POLY_METHOD(Rect_<T>::op_And			   ){
		auto rect = new Rect_<T>();

		rect->_rect = std::make_shared<T>((*info.at<Rect_<T>*>(0)->_rect) & (*info.at<Rect_<T>*>(0)->_rect));

		info.SetReturnValue(rect);
	}

	template <typename T>
	POLY_METHOD(Rect_<T>::tl				   ){
		auto this_ = info.This<Rect_<T>*>();
		
		auto ret = new PointT();
		ret -> _point = std::make_shared<cv::Point_<TVT>>(this_->_rect->tl());

		info.SetReturnValue(ret);
	}

	template <typename T>
	POLY_METHOD(Rect_<T>::br				   ){
		auto this_ = info.This<Rect_<T>*>();
		
		auto ret = new PointT();

		ret->_point = std::make_shared<cv::Point_<TVT>>(this_->_rect->br());
		info.SetReturnValue(ret);
	}

	template <typename T>
	POLY_METHOD(Rect_<T>::size				   ){
		auto this_ = info.This<Rect_<T>*>();

		auto ret = new SizeT();

		ret->_size = std::make_shared<cv::Size_<TVT>>(this_->_rect->size());
		info.SetReturnValue(ret);
	}

	template <typename T>
	POLY_METHOD(Rect_<T>::area				   ){
		auto this_ = info.This<Rect_<T>*>();
		auto ret = this_->_rect->area();
		info.SetReturnValue(ret);
	}

	template <typename T>
	NAN_GETTER(Rect_<T>::x_getter			){
		auto this_ = or ::ObjectWrap::Unwrap<Rect_<T>>(info.This());

		info.GetReturnValue().Set(this_->_rect->x);
	}

	template <typename T>
	NAN_SETTER(Rect_<T>::x_setter			){
		auto this_ = or ::ObjectWrap::Unwrap<Rect_<T>>(info.This());

		this_->_rect->x = value->NumberValue();
	}

	template <typename T>
	NAN_GETTER(Rect_<T>::y_getter			){
		auto this_ = or ::ObjectWrap::Unwrap<Rect_<T>>(info.This());

		info.GetReturnValue().Set(this_->_rect->y);
	}

	template <typename T>
	NAN_SETTER(Rect_<T>::y_setter			){
		auto this_ = or ::ObjectWrap::Unwrap<Rect_<T>>(info.This());

		this_->_rect->y = value->NumberValue();
	}

	template <typename T>
	NAN_GETTER(Rect_<T>::width_getter		){
		auto this_ = or ::ObjectWrap::Unwrap<Rect_<T>>(info.This());

		info.GetReturnValue().Set(this_->_rect->width);
	}

	template <typename T>
	NAN_SETTER(Rect_<T>::width_setter		){
		auto this_ = or ::ObjectWrap::Unwrap<Rect_<T>>(info.This());

		this_->_rect->width = value->NumberValue();
	}

	template <typename T>
	NAN_GETTER(Rect_<T>::height_getter		){
		auto this_ = or ::ObjectWrap::Unwrap<Rect_<T>>(info.This());

		info.GetReturnValue().Set(this_->_rect->height);
	}

	template <typename T>
	NAN_SETTER(Rect_<T>::height_setter		){
		auto this_ = or ::ObjectWrap::Unwrap<Rect_<T>>(info.This());

		this_->_rect->height = value->NumberValue();
	}

	


#endif