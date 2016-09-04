#include "optical_flow.h"

Nan::Persistent<Object> optical_flow::opticalFlowObject;


void
optical_flow::Init(Handle<Object> target) {
	Local<Object> opticalFlow = Nan::New<Object>();

	opticalFlowObject.Reset(opticalFlow);

	target->Set(Nan::New("optical_flow").ToLocalChecked(), opticalFlow);

};
