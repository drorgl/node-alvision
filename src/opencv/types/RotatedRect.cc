#include "RotatedRect.h"
#include "Point.h"
#include "Size.h"

namespace rotatedrect_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("rotatedrect_general_callback is empty");
		}
		return overload->execute("rotatedrect", info);
	}
}

std::string RotatedRect::name;

Nan::Persistent<FunctionTemplate> RotatedRect::constructor;


void RotatedRect::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	name = "RotatedRect";
	rotatedrect_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(rotatedrect_general_callback::callback);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New(name).ToLocalChecked());

	overload->register_type<RotatedRect>(ctor, "rotatedrect", name);


	//	interface RotatedRectStatic {
	//		//! various constructors
	//		new () : RotatedRect;
	overload->addOverloadConstructor("rotatedrect", "RotatedRect", {}, New);
	//		/**
	//		@param center The rectangle mass center.
	//		@param size Width and height of the rectangle.
	//		@param angle The rotation angle in a clockwise direction. When the angle is 0, 90, 180, 270 etc.,
	//		the rectangle becomes an up-right rectangle.
	//		*/
	//		new (center: Point2f, size : Size2f, angle : _st.float) : RotatedRect;
	overload->addOverloadConstructor("rotatedrect", "RotatedRect", {
		make_param<Point2f*>("center",Point2f::name),
		make_param<Size2f*>("size",Size2f::name),
		make_param<float>("angle","float")
	}, New_center);
	//		/**
	//		Any 3 end points of the RotatedRect. They must be given in order (either clockwise or
	//		anticlockwise).
	//		*/
	//		new (point1: Point2f, point2 : Point2f, point3 : Point2f) : RotatedRect;
	overload->addOverloadConstructor("rotatedrect", "RotatedRect", {
		make_param<Point2f*>("point1",Point2f::name),
		make_param<Point2f*>("point2",Point2f::name),
		make_param<Point2f*>("point3",Point2f::name)
	}, New_points);
	//	}
	//
	//	export interface RotatedRect
	//	{
	//
	//		/** returns 4 vertices of the rectangle
	//		@param pts The points array for storing rectangle vertices.
	//		*/
	//		points(pts : Array<Point2f>) : void;
	overload->addOverload("rotatedrect", "RotatedRect", "point", {
		make_param<std::shared_ptr<std::vector<Point2f*>>>("pts","Array<Point2f>")
	}, points);
//		//! returns the minimal up-right rectangle containing the rotated rectangle
//		boundingRect() : Rect;
	overload->addOverload("rotatedrect", "RotatedRect", "boundingRect", {}, boundingRect);
//
//	center: Point2f; //< the rectangle mass center
	Nan::SetAccessor(ctor->InstanceTemplate(),Nan::New( "center").ToLocalChecked(), center_getter, center_setter);
//	size: Size2f;    //< width and height of the rectangle
	Nan::SetAccessor(ctor->InstanceTemplate(),Nan::New( "size").ToLocalChecked(), size_getter, size_setter);
//	angle: _st.float;    //< the rotation angle. When the angle is 0, 90, 180, 270 etc., the rectangle becomes an up-right rectangle.
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("angle").ToLocalChecked(), angle_getter, angle_setter);
//	};
//
//	export var RotatedRect : RotatedRectStatic = alvision_module.RotatedRect;




	target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> RotatedRect::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(RotatedRect::New){throw std::runtime_error("not implemented");}
POLY_METHOD(RotatedRect::New_center){throw std::runtime_error("not implemented");}
POLY_METHOD(RotatedRect::New_points){throw std::runtime_error("not implemented");}
POLY_METHOD(RotatedRect::points){throw std::runtime_error("not implemented");}
POLY_METHOD(RotatedRect::boundingRect){throw std::runtime_error("not implemented");}


NAN_GETTER(RotatedRect::center_getter){throw std::runtime_error("not implemented");}
NAN_SETTER(RotatedRect::center_setter){throw std::runtime_error("not implemented");}
NAN_GETTER(RotatedRect::size_getter){throw std::runtime_error("not implemented");}
NAN_SETTER(RotatedRect::size_setter){throw std::runtime_error("not implemented");}
NAN_GETTER(RotatedRect::angle_getter){throw std::runtime_error("not implemented");}
NAN_SETTER(RotatedRect::angle_setter){throw std::runtime_error("not implemented");}

