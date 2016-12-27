#include "KalmanFilter.h"

Nan::Persistent<FunctionTemplate> KalmanFilter::constructor;


void
KalmanFilter::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(KalmanFilter::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("KalmanFilter").ToLocalChecked());

	overload->register_type<KalmanFilter>(ctor, "kalmanfilter", "KalmanFilter");

	target->Set(Nan::New("KalmanFilter").ToLocalChecked(), ctor->GetFunction());

	
};

v8::Local<v8::Function> KalmanFilter::get_constructor() {
	return Nan::New(constructor)->GetFunction();
}


NAN_METHOD(KalmanFilter::New) {
	
	if (info.This()->InternalFieldCount() == 0)
		Nan::ThrowTypeError("Cannot instantiate without new");

	KalmanFilter *kalmanFilter;

	//if (info.Length() == 0){
	kalmanFilter = new KalmanFilter();
	//}

	kalmanFilter->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
