#ifndef _ALVISION_SVD_H_
#define _ALVISION_SVD_H_

#include "../../alvision.h"


class SVD : public overres::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::SVD> _svd;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


	static POLY_METHOD(New);
	static POLY_METHOD(New_array);
	static POLY_METHOD(compute_u_vt);
	static POLY_METHOD(compute);
	static POLY_METHOD(backSubst_w_u_vt_rhs);
	static POLY_METHOD(solveZ);
	static POLY_METHOD(run);
	static POLY_METHOD(backSubst);


	static NAN_GETTER(u_getter);
	static NAN_SETTER(u_setter);

	static NAN_GETTER(w_getter);
	static NAN_SETTER(w_setter);

	static NAN_GETTER(vt_getter);
	static NAN_SETTER(vt_setter);
};

#endif