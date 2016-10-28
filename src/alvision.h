#ifndef _NODE_ALVISION_H_
#define _NODE_ALVISION_H_

#include <v8.h>
#include <node.h>
#include <node_object_wrap.h>
#include <node_version.h>
#include <node_buffer.h>
#include <string.h>
#include <nan.h>

#include "safecast.h"

#include <opencv2/opencv.hpp>
#include <ffmpeg.h>

#include "utilities/stacktrace.h"

#include "overload_resolution.h"



using namespace v8;
//using namespace node;

//#define REQ_FUN_ARG(I, VAR)                                             \
//if (args.Length() <= (I) || !args[I]->IsFunction())                   \
//	return NanThrowTypeError("Argument " #I " must be a function");  \
//	Local<Function> VAR = Local<Function>::Cast(args[I]);
//
#define SETUP_FUNCTION(TYP)	\
			\
	TYP *self = Nan::ObjectWrap::Unwrap<TYP>(info.This());

#define REQ_FUN_ARG(I, VAR)                                             \
  if (info.Length() <= (I) || !info[I]->IsFunction())                   \
    return Nan::ThrowTypeError("Argument " #I " must be a function");  \
  Local<Function> VAR = Local<Function>::Cast(info[I]);
//
#define JSFUNC(NAME) \
	static NAN_METHOD(NAME);
//
#define JSTHROW_TYPE(ERR) \
	Nan::ThrowTypeError(ERR);
//
//
#define JSTHROW(ERR) \
	Nan::ThrowError(ERR);

//
//
//#define INT_FROM_ARGS(NAME, IND) \
//if (args[IND]->IsInt32()){
//\
//	NAME = args[IND]->Uint32Value(); \
//}
//
//#define DOUBLE_FROM_ARGS(NAME, IND) \
//if (args[IND]->IsInt32()){
//\
//	NAME = args[IND]->NumberValue(); \
//}
//
//class OpenCV : public node::ObjectWrap{
//public:
//	static void Init(Handle<Object> target);
//
//	static NAN_METHOD(ReadImage);
//};
//
//
//

inline v8::Local<v8::Object> CreateNamedObject(v8::Handle<v8::Object> target, std::string objectName) {
	auto obj = Nan::New<v8::Object>();
	target->Set(Nan::New(objectName).ToLocalChecked(), obj);
	return obj;
}

inline void SetObjectProperty(v8::Local<v8::Object> obj, std::string propertyName, v8::Local<v8::Value> val) {
	obj->Set(Nan::New(propertyName).ToLocalChecked(), val);
}

inline void SetObjectProperty(v8::Local<v8::Object> obj, std::string propertyName, int val) {
	SetObjectProperty(obj, propertyName, Nan::New(val));
}

inline void SetObjectProperty(v8::Local<v8::Object> obj, std::string propertyName, std::string val) {
	SetObjectProperty(obj, propertyName, Nan::New(val).ToLocalChecked());
}

inline std::shared_ptr<overload_info> make_param(const std::string parameterName, const std::string type, v8::Local<v8::Value> defaultValue = Nan::Undefined()) {
	return std::make_shared<overload_info>(parameterName, type, defaultValue);
}

inline std::shared_ptr<overload_info> make_param(const std::string parameterName, const std::string type, int defaultValue) {
	return std::make_shared<overload_info>(parameterName, type, defaultValue);
}

inline std::shared_ptr<overload_info> make_param(const std::string parameterName, const std::string type, double defaultValue) {
	return std::make_shared<overload_info>(parameterName, type, defaultValue);
}

inline std::shared_ptr<overload_info> make_param(const std::string parameterName, const std::string type, std::string defaultValue) {
	return std::make_shared<overload_info>(parameterName, type, defaultValue);
}

#endif

