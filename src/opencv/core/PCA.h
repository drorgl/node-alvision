#ifndef _ALVISION_PCA_H_
#define _ALVISION_PCA_H_

#include "../../alvision.h"


class PCA : public overres::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::PCA> _pca;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


	static POLY_METHOD(New);
	static POLY_METHOD(New_maxComponents);
	static POLY_METHOD(New_retainedVariance);
	static POLY_METHOD(pca_maxComponents);
	static POLY_METHOD(pca_retainedVariance);
	static POLY_METHOD(project);
	static POLY_METHOD(project_result);
	static POLY_METHOD(backProject);
	static POLY_METHOD(backProject_result);
	static POLY_METHOD(write);
	static POLY_METHOD(read);

	static NAN_GETTER(eigenvectors_getter);
	static NAN_SETTER(eigenvectors_setter);

	static NAN_GETTER(eigenvalues_getter);
	static NAN_SETTER(eigenvalues_setter);

	static NAN_GETTER(mean_getter);
	static NAN_SETTER(mean_setter);

};

#endif