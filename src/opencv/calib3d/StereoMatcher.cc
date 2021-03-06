#include "StereoMatcher.h"
#include "../IOArray.h"

namespace stereomatcher_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("stereomatcher_general_callback is empty");
		}
		return overload->execute("stereomatcher", info);
	}
}

Nan::Persistent<FunctionTemplate> StereoMatcher::constructor;

void StereoMatcher::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	stereomatcher_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(stereomatcher_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("StereoMatcher").ToLocalChecked());
	ctor->Inherit(Nan::New(Algorithm::constructor));

	overload->register_type<StereoMatcher>(ctor, "stereomatcher", "StereoMatcher");



	auto StereoDISP = CreateNamedObject(target, "StereoDISP");
	SetObjectProperty(StereoDISP, "DISP_SHIFT", 4);
	SetObjectProperty(StereoDISP, "DISP_SCALE", (1 << cv::StereoMatcher::DISP_SHIFT));



	overload->addOverload("stereomatcher", "StereoMatcher", "compute", {
			make_param<IOArray*>("left","IOArray"),
			make_param<IOArray*>("right","IOArray"),
			make_param<IOArray*>("disparity","IOArray")
	}, StereoMatcher::compute);
	Nan::SetPrototypeMethod(ctor, "compute", stereomatcher_general_callback::callback);


	overload->addOverload("stereomatcher", "StereoMatcher", "getMinDisparity", {}, StereoMatcher::getMinDisparity);
	Nan::SetPrototypeMethod(ctor, "getMinDisparity", stereomatcher_general_callback::callback);

	overload->addOverload("stereomatcher", "StereoMatcher", "setMinDisparity", { make_param<int>("minDisparity","int") }, StereoMatcher::setMinDisparity);
	Nan::SetPrototypeMethod(ctor, "setMinDisparity", stereomatcher_general_callback::callback);

	overload->addOverload("stereomatcher", "StereoMatcher", "getNumDisparities", {}, StereoMatcher::getNumDisparities);
	Nan::SetPrototypeMethod(ctor, "getNumDisparities", stereomatcher_general_callback::callback);

	overload->addOverload("stereomatcher", "StereoMatcher", "setNumDisparities", { make_param<int>("minDisparities","int") }, StereoMatcher::setNumDisparities);
	Nan::SetPrototypeMethod(ctor, "setNumDisparities", stereomatcher_general_callback::callback);

	overload->addOverload("stereomatcher", "StereoMatcher", "getBlockSize", {}, StereoMatcher::getBlockSize);
	Nan::SetPrototypeMethod(ctor, "getBlockSize", stereomatcher_general_callback::callback);

	overload->addOverload("stereomatcher", "StereoMatcher", "setBlockSize", { make_param<int>("blockSize","int") }, StereoMatcher::setBlockSize);
	Nan::SetPrototypeMethod(ctor, "setBlockSize", stereomatcher_general_callback::callback);

	overload->addOverload("stereomatcher", "StereoMatcher", "getSpeckleWindowSize", {}, StereoMatcher::getSpeckleWindowSize);
	Nan::SetPrototypeMethod(ctor, "getSpeckleWindowSize", stereomatcher_general_callback::callback);

	overload->addOverload("stereomatcher", "StereoMatcher", "setSpeckleWindowSize", { make_param<int>("speckleWindowSize","int") }, StereoMatcher::setSpeckleWindowSize);
	Nan::SetPrototypeMethod(ctor, "setSpeckleWindowSize", stereomatcher_general_callback::callback);

	overload->addOverload("stereomatcher", "StereoMatcher", "getSpeckleRange", {}, StereoMatcher::getSpeckleRange);
	Nan::SetPrototypeMethod(ctor, "getSpeckleRange", stereomatcher_general_callback::callback);

	overload->addOverload("stereomatcher", "StereoMatcher", "setSpeckleRange", { make_param<int>("speckleRange","int") }, StereoMatcher::setSpeckleRange);
	Nan::SetPrototypeMethod(ctor, "setSpeckleRange", stereomatcher_general_callback::callback);

	overload->addOverload("stereomatcher", "StereoMatcher", "getDisp12MaxDiff", {}, StereoMatcher::getDisp12MaxDiff);
	Nan::SetPrototypeMethod(ctor, "getDisp12MaxDiff", stereomatcher_general_callback::callback);

	overload->addOverload("stereomatcher", "StereoMatcher", "setDisp12MaxDiff", { make_param<int>("disp12MaxDiff","int") }, StereoMatcher::setDisp12MaxDiff);
	Nan::SetPrototypeMethod(ctor, "setDisp12MaxDiff", stereomatcher_general_callback::callback);

	target->Set(Nan::New("StereoMatcher").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> StereoMatcher::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}

POLY_METHOD(StereoMatcher::compute) {
	auto left = info.at<IOArray*>(0)->GetInputArray();
	auto right = info.at<IOArray*>(1)->GetInputArray();
	auto disparity = info.at<IOArray*>(2)->GetOutputArray();

	auto this_ = info.This<StereoMatcher*>();
	this_->_algorithm.dynamicCast<cv::StereoMatcher>()->compute(left, right, disparity);
}
POLY_METHOD(StereoMatcher::getMinDisparity) {
	auto this_ = info.This<StereoMatcher*>();
	auto ret = this_->_algorithm.dynamicCast<cv::StereoMatcher>()->getMinDisparity();
	info.SetReturnValue(ret);
}
POLY_METHOD(StereoMatcher::setMinDisparity) {
	auto this_ = info.This<StereoMatcher*>();
	this_->_algorithm.dynamicCast<cv::StereoMatcher>()->setMinDisparity(info.at<int>(0));

}
POLY_METHOD(StereoMatcher::getNumDisparities) {
	auto this_ = info.This<StereoMatcher*>();
	auto ret = this_->_algorithm.dynamicCast<cv::StereoMatcher>()->getNumDisparities();
	info.SetReturnValue(ret);
}
POLY_METHOD(StereoMatcher::setNumDisparities) {
	auto this_ = info.This<StereoMatcher*>();
	this_->_algorithm.dynamicCast<cv::StereoMatcher>()->setNumDisparities(info.at<int>(0));
}
POLY_METHOD(StereoMatcher::getBlockSize) {
	auto this_ = info.This<StereoMatcher*>();
	auto ret = this_->_algorithm.dynamicCast<cv::StereoMatcher>()->getBlockSize();
	info.SetReturnValue(ret);
}
POLY_METHOD(StereoMatcher::setBlockSize) {
	auto this_ = info.This<StereoMatcher*>();
	this_->_algorithm.dynamicCast<cv::StereoMatcher>()->setBlockSize(info.at<int>(0));
}
POLY_METHOD(StereoMatcher::getSpeckleWindowSize) {
	auto this_ = info.This<StereoMatcher*>();
	auto ret = this_->_algorithm.dynamicCast<cv::StereoMatcher>()->getSpeckleWindowSize();
	info.SetReturnValue(ret);
}
POLY_METHOD(StereoMatcher::setSpeckleWindowSize) {
	auto this_ = info.This<StereoMatcher*>();
	this_->_algorithm.dynamicCast<cv::StereoMatcher>()->setSpeckleWindowSize(info.at<int>(0));
}
POLY_METHOD(StereoMatcher::getSpeckleRange) {
	auto this_ = info.This<StereoMatcher*>();
	auto ret = this_->_algorithm.dynamicCast<cv::StereoMatcher>()->getSpeckleRange();
	info.SetReturnValue(ret);
}
POLY_METHOD(StereoMatcher::setSpeckleRange) {
	auto this_ = info.This<StereoMatcher*>();
	this_->_algorithm.dynamicCast<cv::StereoMatcher>()->setSpeckleRange(info.at<int>(0));
}
POLY_METHOD(StereoMatcher::getDisp12MaxDiff) {
	auto this_ = info.This<StereoMatcher*>();
	auto ret = this_->_algorithm.dynamicCast<cv::StereoMatcher>()->getDisp12MaxDiff();
	info.SetReturnValue(ret);
}
POLY_METHOD(StereoMatcher::setDisp12MaxDiff) {
	auto this_ = info.This<StereoMatcher*>();
	this_->_algorithm.dynamicCast<cv::StereoMatcher>()->setDisp12MaxDiff(info.at<int>(0));
}



