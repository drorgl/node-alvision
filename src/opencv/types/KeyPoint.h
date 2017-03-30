#ifndef _ALVISION_KEYPOINT_H_
#define _ALVISION_KEYPOINT_H_

#include "../../alvision.h"

class KeyPoint : public overres::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;
	static std::string name;

	std::shared_ptr<cv::KeyPoint> _keyPoint;

	virtual v8::Local<v8::Function> get_constructor();

	template<typename... Args>
	static std::shared_ptr<KeyPoint> create(Args&&... args) {
		auto val = std::make_shared<KeyPoint>();
		val->_keyPoint = std::shared_ptr<cv::KeyPoint>(new cv::KeyPoint(std::forward<Args>(args)...));
		return val;
	}



	static POLY_METHOD(New_no_params);
	static POLY_METHOD(New_point2f);
	static POLY_METHOD(New_float);
	static POLY_METHOD(hash);
	static POLY_METHOD(convert_keypoint);
	static POLY_METHOD(convert_point2f);
	static POLY_METHOD(overlap);

	static NAN_GETTER(pt_getter);
	static NAN_SETTER(pt_setter);


	static NAN_GETTER(size_getter);
	static NAN_SETTER(size_setter);

	static NAN_GETTER(angle_getter);
	static NAN_SETTER(angle_setter);


	static NAN_GETTER(response_getter);
	static NAN_SETTER(response_setter);

	static NAN_GETTER(octave_getter);
	static NAN_SETTER(octave_setter);

	static NAN_GETTER(class_id_getter);
	static NAN_SETTER(class_id_setter);

};

#endif
