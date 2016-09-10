#include "TrainData.h"

Nan::Persistent<FunctionTemplate> TrainData::constructor;


void
TrainData::Init(Handle<Object> target) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(TrainData::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("TrainData").ToLocalChecked());

	Nan::SetMethod(ctor, "loadFromCSV", loadFromCSV);

	target->Set(Nan::New("TrainData").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(TrainData::New) {
	
	if (info.This()->InternalFieldCount() == 0)
		Nan::ThrowTypeError("Cannot instantiate without new");

	TrainData *trainData;

	//if (info.Length() == 0){
	trainData = new TrainData();
	//}

	trainData->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

NAN_METHOD(TrainData::loadFromCSV) {
	return Nan::ThrowError("not implemented");
}