#include "ml.h"

Nan::Persistent<Object> ml::mlObject;


void
ml::Init(Handle<Object> target) {
	Local<Object> ml = Nan::New<Object>();

	mlObject.Reset(ml);

	target->Set(Nan::New("ml").ToLocalChecked(), ml);

	TrainData::Init(ml);
};
