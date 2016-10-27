#ifndef _ALVISION_FILENODE_H_
#define _ALVISION_FILENODE_H_

#include "../../alvision.h"


class FileNode: public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::FileNode> _fileNode;

	static Nan::Persistent<FunctionTemplate> constructor;
	static NAN_METHOD(New);

};

#endif