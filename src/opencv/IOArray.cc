#include "IOArray.h"

namespace general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(ioarray_callback) {
		return overload->execute("ioarray", info);
	}
}


Nan::Persistent<FunctionTemplate> IOArray::constructor;

void IOArray::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	general_callback::overload = overload;

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(general_callback::ioarray_callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("IOArray").ToLocalChecked());

	overload->register_type(ctor, "ioarray", "IOArray");

	overload->addOverloadConstructor("ioarray", "IOArray", {}, IOArray::New);

	target->Set(Nan::New("IOArray").ToLocalChecked(), ctor->GetFunction());
}

POLY_METHOD(IOArray::New) {

}


v8::Local<v8::Object> IOArray::noArray() {
	return Nan::New("not implemented").ToLocalChecked().As<v8::Object>();
}
