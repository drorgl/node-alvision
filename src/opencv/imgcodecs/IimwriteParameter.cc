#include "IimwriteParameter.h"

std::vector<std::shared_ptr<overload_info>> IimwriteParameter::_definition = {
	make_param("prop1","String") ,
	make_param("prop2","String")
};


bool IimwriteParameter::verify(or ::type_system * ovres, v8::Local<v8::Value> obj) {
	return ovres->verifyObject(IimwriteParameter::_definition, obj);
}

bool IimwriteParameter::parse(v8::Local<v8::Value> obj) {
	this->flag = or ::type_system::GetFromObject(obj, "flag").ToLocalChecked()->NumberValue();
	this->value = or ::type_system::GetFromObject(obj, "value").ToLocalChecked()->NumberValue();

	return true;
}


v8::Local<v8::Value> IimwriteParameter::ToObject() {
	auto retval = Nan::New<v8::Object>();
	retval->Set(Nan::New("flag").ToLocalChecked(), Nan::New(this->flag));
	retval->Set(Nan::New("value").ToLocalChecked(), Nan::New(this->value));
	return retval;
}

v8::Local<v8::Object> IimwriteParameter::New() {
	auto a = std::make_shared<IimwriteParameter>();// a;
	return a->ToObject().As<v8::Object>();
}


v8::Local<v8::Object> IimwriteParameter::New(int flag, int value) {
	auto a = std::make_shared<IimwriteParameter>();// a;
	a->flag = flag;
	a->value = value;
	return a->ToObject().As<v8::Object>();
}
