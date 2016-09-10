//#include "Point.h"

// Nan::Persistent<FunctionTemplate> Point::constructor;
//
//
//Point::Init(Handle<Object> target, std::string name) {
//	
//
//	//Class
//	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Point::New);
//	constructor.Reset(ctor);
//	ctor->InstanceTemplate()->SetInternalFieldCount(1);
//	ctor->SetClassName(Nan::New("Point").ToLocalChecked());
//
//
//	target->Set(Nan::New("Point").ToLocalChecked(), ctor->GetFunction());
//};
//
//template <typename T>
//NAN_METHOD(Point::New) {
//
//	if (info.This()->InternalFieldCount() == 0)
//		Nan::ThrowTypeError("Cannot instantiate without new");
//
//
//	Point *Point;
//	Point = new Point();
//
//	Point->Wrap(info.Holder());
//
//	info.GetReturnValue().Set(info.Holder());
//}
//
