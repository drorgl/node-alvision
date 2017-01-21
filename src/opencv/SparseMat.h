#ifndef _ALVISION_SPARSEMAT_H_
#define _ALVISION_SPARSEMAT_H_
//#include "OpenCV.h"
#include "../alvision.h"


class SparseMat: public or::ObjectWrap {
public:
	static std::string name;
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::SparseMat> _sparseMat;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


	static NAN_METHOD(New);
	

};

#endif