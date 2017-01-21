#ifndef _ALVISION_ROTATEDRECT_H_
#define _ALVISION_ROTATEDRECT_H_
//#include "OpenCV.h"
#include "../../alvision.h"


class RotatedRect : public or ::ObjectWrap{
public:
	static std::string name;
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<RotatedRect> _rotatedrect;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	static POLY_METHOD(New_center);
	static POLY_METHOD(New_points);
	static POLY_METHOD(points);
	static POLY_METHOD(boundingRect);


	static NAN_GETTER(center_getter);
	static NAN_SETTER(center_setter);
	static NAN_GETTER(size_getter);
	static NAN_SETTER(size_setter);
	static NAN_GETTER(angle_getter);
	static NAN_SETTER(angle_setter);

};


#endif