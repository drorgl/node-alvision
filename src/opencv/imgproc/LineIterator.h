#ifndef _ALVISION_LINEITERATOR_H_
#define _ALVISION_LINEITERATOR_H_

#include "../../alvision.h"
#include "../core/Algorithm.h"

class LineIterator : public overres::ObjectWrap{
public:
	static std::string name;

	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	std::shared_ptr<cv::LineIterator> _lineiterator;

	virtual v8::Local<v8::Function> get_constructor();

	template<typename... Args>
	static std::shared_ptr<LineIterator> create(Args&&... args) {
		auto val = std::make_shared<LineIterator>();
		val->_lineiterator = std::shared_ptr<cv::LineIterator>(new cv::LineIterator(std::forward<Args>(args)...));
		return val;
	}

	static POLY_METHOD(New_pt);
	static POLY_METHOD(each);

};

#endif
