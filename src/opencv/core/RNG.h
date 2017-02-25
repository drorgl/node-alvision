#ifndef _ALVISION_RNG_H_
#define _ALVISION_RNG_H_

#include "../../alvision.h"


class RNG : public overres::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::RNG> _rng;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


	template<typename... Args>
	static std::shared_ptr<RNG> create(Args&&... args) {
		auto val = std::make_shared<RNG>();
		val->_rng = std::shared_ptr<cv::RNG>(new cv::RNG(std::forward<Args>(args)...));
		return val;
	}


	static POLY_METHOD(New);
	static POLY_METHOD(New_state);
	static POLY_METHOD(next_uint);
	static POLY_METHOD(next_uchar);
	static POLY_METHOD(next_ushort);
	static POLY_METHOD(next_short);
	static POLY_METHOD(next_unsigned);
	static POLY_METHOD(unsigned_upperBoundary);
	static POLY_METHOD(next_int);
	static POLY_METHOD(next_float);
	static POLY_METHOD(next_double);
	static POLY_METHOD(uniform);
	static POLY_METHOD(fill_array);
	static POLY_METHOD(fill_number);
	static POLY_METHOD(gaussian);

	static NAN_GETTER(state_getter);



};

#endif