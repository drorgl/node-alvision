#ifndef _ALVISION_MATOP_H_
#define _ALVISION_MATOP_H_

#include "../alvision.h"

class MatOp : public overres::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	std::shared_ptr<cv::TermCriteria> _termCriteria;

	virtual v8::Local<v8::Function> get_constructor();

};

#endif
