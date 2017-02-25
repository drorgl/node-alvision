#ifndef _ALVISION_DESCRIPTOR_COLLECTION_H_
#define _ALVISION_DESCRIPTOR_COLLECTION_H_

#include "../../alvision.h"

class DescriptorCollection : public overres::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New_collection);
	static POLY_METHOD(New);
	static POLY_METHOD(set);
	static POLY_METHOD(clear);
	static POLY_METHOD(getDescriptors);
	static POLY_METHOD(getDescriptor_local);
	static POLY_METHOD(getDescriptor);
	static POLY_METHOD(getLocalIdx);
	static POLY_METHOD(size);


};

#endif
