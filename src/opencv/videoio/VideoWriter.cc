#include "VideoWriter.h"

Nan::Persistent<FunctionTemplate> VideoWriter::constructor;


void
VideoWriter::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(VideoWriter::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("VideoWriter").ToLocalChecked());

	overload->register_type<VideoWriter>(ctor, "videowriter", "VideoWriter");

	// Prototype
	//Nan::SetPrototypeMethod(ctor, "fill", fill);
	//Nan::SetPrototypeMethod(ctor, "int", genInt);
	//Nan::SetPrototypeMethod(ctor, "int", genDouble);
	

	target->Set(Nan::New("VideoWriter").ToLocalChecked(), ctor->GetFunction());

	
};

v8::Local<v8::Function> VideoWriter::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


NAN_METHOD(VideoWriter::New) {
	
	if (info.This()->InternalFieldCount() == 0)
		Nan::ThrowTypeError("Cannot instantiate without new");

	VideoWriter *videoWriter;

	//if (info.Length() == 0){
		videoWriter = new VideoWriter();
	//}

	videoWriter->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
