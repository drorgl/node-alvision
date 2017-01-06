#include "Mat_.h"

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
void Mat_Init::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Mat_<uchar >	::Init(target, "Mat1b", overload);
	Mat_<cv::Vec2b >::Init(target, "Mat2b", overload);
	Mat_<cv::Vec3b >::Init(target, "Mat3b", overload);
	Mat_<cv::Vec4b >::Init(target, "Mat4b", overload);

	Mat_<short >     ::Init(target, "Mat1s", overload);
	Mat_<cv::Vec2s > ::Init(target, "Mat2s", overload);
	Mat_<cv::Vec3s > ::Init(target, "Mat3s", overload);
	Mat_<cv::Vec4s > ::Init(target, "Mat4s", overload);

	Mat_<ushort >    ::Init(target, "Mat1w", overload);
	Mat_<cv::Vec2w > ::Init(target, "Mat2w", overload);
	Mat_<cv::Vec3w > ::Init(target, "Mat3w", overload);
	Mat_<cv::Vec4w > ::Init(target, "Mat4w", overload);

	Mat_<int    >    ::Init(target, "Mat1i", overload);
	Mat_<cv::Vec2i > ::Init(target, "Mat2i", overload);
	Mat_<cv::Vec3i > ::Init(target, "Mat3i", overload);
	Mat_<cv::Vec4i > ::Init(target, "Mat4i", overload);

	Mat_<float  >	 ::Init(target, "Mat1f", overload);
	Mat_<cv::Vec2f > ::Init(target, "Mat2f", overload);
	Mat_<cv::Vec3f > ::Init(target, "Mat3f", overload);
	Mat_<cv::Vec4f > ::Init(target, "Mat4f", overload);

	Mat_<double >    ::Init(target, "Mat1d", overload);
	Mat_<cv::Vec2d > ::Init(target, "Mat2d", overload);
	Mat_<cv::Vec3d > ::Init(target, "Mat3d", overload);
	Mat_<cv::Vec4d>  ::Init(target, "Mat4d", overload);

	Mat_<cv::Point2f>::Init(target, "MatPoint2f", overload);
}