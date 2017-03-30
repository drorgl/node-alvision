#ifndef _ALVISION_FILENODE_H_
#define _ALVISION_FILENODE_H_

#include "../../alvision.h"


class FileNode : public overres::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::FileNode> _fileNode;

	static std::string name;
	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


	static POLY_METHOD(New);
	static POLY_METHOD(New_node);

	static NAN_GETTER(nodes_getter);
	static NAN_GETTER(data_getter);

	static POLY_METHOD(type);
	static POLY_METHOD(empty);
	static POLY_METHOD(isNone);
	static POLY_METHOD(isSeq);
	static POLY_METHOD(isMap);
	static POLY_METHOD(isInt);
	static POLY_METHOD(isReal);
	static POLY_METHOD(isString);
	static POLY_METHOD(isNamed);
	static POLY_METHOD(get_name);
	static POLY_METHOD(size);
	static POLY_METHOD(get_int);
	static POLY_METHOD(get_float);
	static POLY_METHOD(get_double);
	static POLY_METHOD(get_string);
	static POLY_METHOD(readInt);
	static POLY_METHOD(readFloat);
	static POLY_METHOD(readDouble);
	static POLY_METHOD(readString);
	static POLY_METHOD(readMat);
	static POLY_METHOD(readSparseMat);
	static POLY_METHOD(readKeyPoint);
	static POLY_METHOD(readDMatch);
	static POLY_METHOD(readPoint2d);
	static POLY_METHOD(readPoint3d);
	static POLY_METHOD(readArray);


};

#endif