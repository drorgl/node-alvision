#include "FileStorage.h"

Nan::Persistent<FunctionTemplate> FileStorage::constructor;


void
FileStorage::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(FileStorage::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("FileStorage").ToLocalChecked());

	overload->register_type<FileStorage>(ctor, "filestorage", "FileStorage");

	Nan::SetPrototypeMethod(ctor, "isOpened", isOpened);

	target->Set(Nan::New("FileStorage").ToLocalChecked(), ctor->GetFunction());

	
};

v8::Local<v8::Function> FileStorage::get_constructor() {
	return Nan::New(constructor)->GetFunction();
}


NAN_METHOD(FileStorage::New) {
	
	if (info.This()->InternalFieldCount() == 0)
		Nan::ThrowTypeError("Cannot instantiate without new");

	FileStorage *fileStorage;

	//if (info.Length() == 0){
		fileStorage = new FileStorage();
	//}

	fileStorage->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(FileStorage::isOpened) {
	return Nan::ThrowError("not implemented");
}