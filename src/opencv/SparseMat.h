#ifndef _ALVISION_SPARSEMAT_H_
#define _ALVISION_SPARSEMAT_H_
//#include "OpenCV.h"
#include "../alvision.h"


class SparseMat: public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target);

	std::shared_ptr<cv::SparseMat> _sparseMat;

	static Nan::Persistent<FunctionTemplate> constructor;
	static NAN_METHOD(New);
	

};

#endif