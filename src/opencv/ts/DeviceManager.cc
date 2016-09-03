#include "DeviceManager.h"

#ifdef HAVE_CUDA

Nan::Persistent<FunctionTemplate> DeviceManager::constructor;


void
DeviceManager::Init(Handle<Object> target) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(DeviceManager::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("DeviceManager").ToLocalChecked());


	Nan::SetMethod(ctor, "instance", instance);
	// Prototype

	target->Set(Nan::New("DeviceManager").ToLocalChecked(), ctor->GetFunction());
};



NAN_METHOD(DeviceManager::New) {

	if (info.This()->InternalFieldCount() == 0)
		Nan::ThrowTypeError("Cannot instantiate without new");

	//Matrix *mat;

	//if (info.Length() == 0) {
	//	mat = new Matrix;
	//}
	//else if (info.Length() == 2 && info[0]->IsInt32() && info[1]->IsInt32()) {
	//	mat = new Matrix(info[0]->IntegerValue(), info[1]->IntegerValue());
	//}
	//else if (info.Length() == 3 && info[0]->IsInt32() && info[1]->IsInt32() && info[2]->IsInt32()) {
	//	mat = new Matrix(info[0]->IntegerValue(), info[1]->IntegerValue(), info[2]->IntegerValue());
	//}
	//else { // if (info.Length() == 5) {
	//	Matrix *other = ObjectWrap::Unwrap<Matrix>(info[0]->ToObject());
	//	int x = safe_cast<int>(info[1]->IntegerValue());
	//	int y = safe_cast<int>(info[2]->IntegerValue());
	//	int w = safe_cast<int>(info[3]->IntegerValue());
	//	int h = safe_cast<int>(info[4]->IntegerValue());
	//	mat = new Matrix(other->_mat, cv::Rect(x, y, w, h));
	//}

	//mat->Wrap(info.Holder());
	//info.Holder()->Set(Nan::New("width").ToLocalChecked(), Nan::New(mat->_mat->cols));
	//info.Holder()->Set(Nan::New("height").ToLocalChecked(), Nan::New(mat->_mat->rows));
	//info.Holder()->Set(Nan::New("type").ToLocalChecked(), Nan::New(Constants::fromMatType(mat->_mat->type())).ToLocalChecked());
	//info.GetReturnValue().Set(info.Holder());
}


NAN_METHOD(DeviceManager::instance) {
	//SETUP_FUNCTION(DeviceManager)
		
	Local<Object> im_h = Nan::New(DeviceManager::constructor)->GetFunction()->NewInstance();
	//auto *img = ObjectWrap::Unwrap<DeviceManager>(im_h);

	info.GetReturnValue().Set(im_h);

}


#endif