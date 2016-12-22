#ifndef _ALVISION_FILESTORAGE_H_
#define _ALVISION_FILESTORAGE_H_

#include "../../alvision.h"


class FileStorage: public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::FileStorage> _fileStorage;

	static Nan::Persistent<FunctionTemplate> constructor;
	static NAN_METHOD(New);
	static NAN_METHOD(isOpened);


};

#endif