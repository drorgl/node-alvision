#include "TrainData.h"

Nan::Persistent<FunctionTemplate> TrainData::constructor;


void
TrainData::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(TrainData::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("TrainData").ToLocalChecked());

	Nan::SetMethod(ctor, "loadFromCSV", loadFromCSV);

	target->Set(Nan::New("TrainData").ToLocalChecked(), ctor->GetFunction());
};

v8::Local<v8::Function> TrainData::get_constructor()  {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


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