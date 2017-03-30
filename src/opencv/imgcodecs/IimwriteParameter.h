#ifndef _ALVISION_IIMWRITEPARAMETER_H_
#define _ALVISION_IIMWRITEPARAMETER_H_

//#include <nan.h>
//
#include <v8.h>
#include <node.h>
#include <node_object_wrap.h>
#include <node_version.h>
#include <node_buffer.h>
#include "node_modules/nan/nan.h"

#include <memory>
#include <string>
//#include "../IStructuredObject.h"

#include <type_system.h>




class IimwriteParameter : public IStructuredObject {
private:
	static std::vector<std::shared_ptr<overload_info>> _definition;

public:
	int flag;
	int value;

	virtual bool verify(overres::type_system * ovres, v8::Local<v8::Value> obj);
	virtual bool parse(v8::Local<v8::Value> obj);

	 v8::Local<v8::Value> ToObject();

	 static v8::Local<v8::Object> New();
	 static v8::Local<v8::Object> New(int flag, int value);

	 virtual ~IimwriteParameter() {}
};


#endif