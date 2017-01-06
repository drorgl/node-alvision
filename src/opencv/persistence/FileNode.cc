#include "FileNode.h"

Nan::Persistent<FunctionTemplate> FileNode::constructor;


void
FileNode::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(FileNode::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("FileNode").ToLocalChecked());

	overload->register_type<FileNode>(ctor, "filenode", "FileNode");


	target->Set(Nan::New("FileNode").ToLocalChecked(), ctor->GetFunction());

	
};

v8::Local<v8::Function> FileNode::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


NAN_METHOD(FileNode::New) {
	
	if (info.This()->InternalFieldCount() == 0)
		Nan::ThrowTypeError("Cannot instantiate without new");

	FileNode *fileNode;

	//if (info.Length() == 0){
		fileNode = new FileNode();
	//}

	fileNode->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}