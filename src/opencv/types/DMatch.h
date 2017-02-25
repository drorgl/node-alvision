#ifndef _ALVISION_DMATCH_H_
#define _ALVISION_DMATCH_H_

#include "../../alvision.h"


class DMatch: public overres::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::DMatch> _dmatch;
	static std::string name;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	template<typename... Args>
	static std::shared_ptr<DMatch> create(Args&&... args) {
		auto val = std::make_shared<DMatch>();
		val->_dmatch = std::shared_ptr<cv::DMatch>(new cv::DMatch(std::forward<Args>(args)...));
		return val;
	}

	static NAN_METHOD(New);



};

#endif