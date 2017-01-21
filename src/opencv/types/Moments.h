#ifndef _ALVISION_MOMENTS_H_
#define _ALVISION_MOMENTS_H_

#include "../../alvision.h"

class Moments : public or ::ObjectWrap{
public:
	static std::string name;
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	std::shared_ptr<cv::Moments> _moments;

	virtual v8::Local<v8::Function> get_constructor();

	template<typename... Args>
	static std::shared_ptr<Moments> create(Args&&... args) {
		auto val = std::make_shared<Moments>();
		val->_moments = std::shared_ptr<cv::Moments>(new cv::Moments(std::forward<Args>(args)...));
		return val;
	}


	static POLY_METHOD(New);
	static POLY_METHOD(New_m);
	static NAN_GETTER(m00_getter);
	static NAN_SETTER(m00_setter);
	static NAN_GETTER(m10_getter);
	static NAN_SETTER(m10_setter);
	static NAN_GETTER(m01_getter);
	static NAN_SETTER(m01_setter);
	static NAN_GETTER(m20_getter);
	static NAN_SETTER(m20_setter);
	static NAN_GETTER(m11_getter);
	static NAN_SETTER(m11_setter);
	static NAN_GETTER(m02_getter);
	static NAN_SETTER(m02_setter);
	static NAN_GETTER(m30_getter);
	static NAN_SETTER(m30_setter);
	static NAN_GETTER(m21_getter);
	static NAN_SETTER(m21_setter);
	static NAN_GETTER(m12_getter);
	static NAN_SETTER(m12_setter);
	static NAN_GETTER(m03_getter);
	static NAN_SETTER(m03_setter);
	static NAN_GETTER(mu20_getter);
	static NAN_SETTER(mu20_setter);
	static NAN_GETTER(mu11_getter);
	static NAN_SETTER(mu11_setter);
	static NAN_GETTER(mu02_getter);
	static NAN_SETTER(mu02_setter);
	static NAN_GETTER(mu30_getter);
	static NAN_SETTER(mu30_setter);
	static NAN_GETTER(mu21_getter);
	static NAN_SETTER(mu21_setter);
	static NAN_GETTER(mu12_getter);
	static NAN_SETTER(mu12_setter);
	static NAN_GETTER(mu03_getter);
	static NAN_SETTER(mu03_setter);
	static NAN_GETTER(nu20_getter);
	static NAN_SETTER(nu20_setter);
	static NAN_GETTER(nu11_getter);
	static NAN_SETTER(nu11_setter);
	static NAN_GETTER(nu02_getter);
	static NAN_SETTER(nu02_setter);
	static NAN_GETTER(nu30_getter);
	static NAN_SETTER(nu30_setter);
	static NAN_GETTER(nu21_getter);
	static NAN_SETTER(nu21_setter);
	static NAN_GETTER(nu12_getter);
	static NAN_SETTER(nu12_setter);
	static NAN_GETTER(nu03_getter);
	static NAN_SETTER(nu03_setter);
};

#endif
