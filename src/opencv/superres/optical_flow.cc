#include "optical_flow.h"

Nan::Persistent<Object> optical_flow::opticalFlowObject;


void
optical_flow::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Local<Object> opticalFlow = Nan::New<Object>();

	opticalFlowObject.Reset(opticalFlow);

	target->Set(Nan::New("optical_flow").ToLocalChecked(), opticalFlow);

	

};
