#include "Affine3.h"

namespace affine3_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("affine3_general_callback is empty");
		}
		return overload->execute("affine3", info);
	}
}

//#include "Size.h"

// Nan::Persistent<FunctionTemplate> Size::constructor;
//
//
//Size::Init(Handle<Object> target, std::string name) {
//	
//
//	//Class
//	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Size::New);
//	constructor.Reset(ctor);
//	ctor->InstanceTemplate()->SetInternalFieldCount(1);
//	ctor->SetClassName(Nan::New("Size").ToLocalChecked());
//
//
//	target->Set(Nan::New("Size").ToLocalChecked(), ctor->GetFunction());
//};
//
//template <typename T>
//NAN_METHOD(Size::New) {
//
//	if (info.This()->InternalFieldCount() == 0)
//		Nan::ThrowTypeError("Cannot instantiate without new");
//
//
//	Size *size;
//	size = new Size();
//
//	size->Wrap(info.Holder());
//
//	info.GetReturnValue().Set(info.Holder());
//}
//



void AffineInit::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Affine3<cv::Affine3d>::Init(target, "Affine3d", overload);
	Affine3<cv::Affine3f>::Init(target, "Affine3f", overload);

}