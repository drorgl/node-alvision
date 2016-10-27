#include "VideoCapture.h"

Nan::Persistent<FunctionTemplate> VideoCapture::constructor;


void
VideoCapture::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(VideoCapture::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("VideoCapture").ToLocalChecked());


	target->Set(Nan::New("VideoCapture").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(VideoCapture::New) {
	
	if (info.This()->InternalFieldCount() == 0)
		Nan::ThrowTypeError("Cannot instantiate without new");

	VideoCapture *videoCapture;

	//if (info.Length() == 0){
		videoCapture = new VideoCapture();
	//}

	videoCapture->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
