#ifndef _ALVISION_LDA_H_
#define _ALVISION_LDA_H_

#include "../../alvision.h"


class LDA : public overres::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::LDA> _lda;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


	static POLY_METHOD(New_num);
	static POLY_METHOD(New_array);
	static POLY_METHOD(subspaceProject);
	static POLY_METHOD(subspaceReconstruct);
	static POLY_METHOD(save);
	static POLY_METHOD(load);
	static POLY_METHOD(save_filestorage);
	static POLY_METHOD(load_filestorage);
	static POLY_METHOD(compute);
	static POLY_METHOD(project);
	static POLY_METHOD(reconstruct);
	static POLY_METHOD(eigenvectors);
	static POLY_METHOD(eigenvalues);


};

#endif