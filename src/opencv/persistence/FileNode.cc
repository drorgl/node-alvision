#include "FileNode.h"

Nan::Persistent<FunctionTemplate> FileNode::constructor;


void
FileNode::Init(Handle<Object> target) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(FileNode::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("FileNode").ToLocalChecked());


	target->Set(Nan::New("FileNode").ToLocalChecked(), ctor->GetFunction());
};

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