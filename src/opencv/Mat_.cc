//#include "Size.h"

// Nan::Persistent<FunctionTemplate> Size::constructor;
//
//
//Size::Init(Handle<Object> target, std::string name) {
//	
//
//	//Class
//	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Size::New);
//	constructor.Reset(ctor);
//	ctor->InstanceTemplate()->SetInternalFieldCount(1);
//	ctor->SetClassName(Nan::New("Size").ToLocalChecked());
//
//
//	target->Set(Nan::New("Size").ToLocalChecked(), ctor->GetFunction());
//};
//
//template <typename T>
//NAN_METHOD(Size::New) {
//
//	if (info.This()->InternalFieldCount() == 0)
//		Nan::ThrowTypeError("Cannot instantiate without new");
//
//
//	Size *size;
//	size = new Size();
//
//	size->Wrap(info.Holder());
//
//	info.GetReturnValue().Set(info.Holder());
//}
//