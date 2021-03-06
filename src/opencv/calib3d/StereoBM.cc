#include "StereoBM.h"
#include "../types/Rect.h"

namespace stereobm_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("stereobm_general_callback is empty");
		}
		return overload->execute("stereobm", info);
	}
}

Nan::Persistent<FunctionTemplate> StereoBM::constructor;

void
StereoBM::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	stereobm_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(stereobm_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("StereoBM").ToLocalChecked());
	ctor->Inherit(Nan::New(StereoMatcher::constructor));

	overload->register_type<StereoBM>(ctor, "stereobm", "StereoBM");



	auto STEREOBM_PREFILTER = CreateNamedObject(target, "STEREOBM_PREFILTER");
	SetObjectProperty(STEREOBM_PREFILTER, "PREFILTER_NORMALIZED_RESPONSE", 0);
	SetObjectProperty(STEREOBM_PREFILTER, "PREFILTER_XSOBEL", 1);

	overload->addOverloadConstructor("stereobm", "StereoBM", {
		make_param<int>("numDisparities","int", 0),
		make_param<int>("blockSize","int", 21)
	}, New);

	overload->addStaticOverload("stereobm", "StereoBM", "create", {
		make_param<int>("numDisparities","int", 0),
		make_param<int>("blockSize","int", 21)

	}, create);
	Nan::SetMethod(ctor, "create", stereobm_general_callback::callback);

	overload->addOverload("stereobm", "StereoBM", "getPreFilterType", {}, getPreFilterType);
	Nan::SetPrototypeMethod(ctor, "getPreFilterType", stereobm_general_callback::callback);

	overload->addOverload("stereobm", "StereoBM", "setPreFilterType", { make_param<int>("preFilterType","int") }, setPreFilterType);
	Nan::SetPrototypeMethod(ctor, "setPreFilterType", stereobm_general_callback::callback);

	overload->addOverload("stereobm", "StereoBM", "getPreFilterSize", {}, getPreFilterSize);
	Nan::SetPrototypeMethod(ctor, "getPreFilterSize", stereobm_general_callback::callback);

	overload->addOverload("stereobm", "StereoBM", "setPreFilterSize", { make_param<int>("preFilterSize","int") }, setPreFilterSize);
	Nan::SetPrototypeMethod(ctor, "setPreFilterSize", stereobm_general_callback::callback);

	overload->addOverload("stereobm", "StereoBM", "getPreFilterCap", {}, getPreFilterCap);
	Nan::SetPrototypeMethod(ctor, "getPreFilterCap", stereobm_general_callback::callback);

	overload->addOverload("stereobm", "StereoBM", "setPreFilterCap", { make_param<int>("preFilterCap","int") }, setPreFilterCap);
	Nan::SetPrototypeMethod(ctor, "setPreFilterCap", stereobm_general_callback::callback);

	overload->addOverload("stereobm", "StereoBM", "getTextureThreshold", {}, getTextureThreshold);
	Nan::SetPrototypeMethod(ctor, "getTextureThreshold", stereobm_general_callback::callback);

	overload->addOverload("stereobm", "StereoBM", "setTextureThreshold", { make_param<int>("textureThreshold","int") }, setTextureThreshold);
	Nan::SetPrototypeMethod(ctor, "setTextureThreshold", stereobm_general_callback::callback);

	overload->addOverload("stereobm", "StereoBM", "getUniquenessRatio", {}, getUniquenessRatio);
	Nan::SetPrototypeMethod(ctor, "getUniquenessRatio", stereobm_general_callback::callback);

	overload->addOverload("stereobm", "StereoBM", "setUniquenessRatio", { make_param<int>("uniquenessRatio","int") }, setUniquenessRatio);
	Nan::SetPrototypeMethod(ctor, "setUniquenessRatio", stereobm_general_callback::callback);

	overload->addOverload("stereobm", "StereoBM", "getSmallerBlockSize", {}, getSmallerBlockSize);
	Nan::SetPrototypeMethod(ctor, "getSmallerBlockSize", stereobm_general_callback::callback);

	overload->addOverload("stereobm", "StereoBM", "setSmallerBlockSize", { make_param<int>("blockSize","int") }, setSmallerBlockSize);
	Nan::SetPrototypeMethod(ctor, "setSmallerBlockSize", stereobm_general_callback::callback);

	overload->addOverload("stereobm", "StereoBM", "getROI1", {}, getROI1);
	Nan::SetPrototypeMethod(ctor, "getROI1", stereobm_general_callback::callback);

	overload->addOverload("stereobm", "StereoBM", "setROI1", { make_param<Rect*>("roi1",Rect::name) }, setROI1);
	Nan::SetPrototypeMethod(ctor, "setROI1", stereobm_general_callback::callback);

	overload->addOverload("stereobm", "StereoBM", "getROI2", {}, getROI2);
	Nan::SetPrototypeMethod(ctor, "getROI2", stereobm_general_callback::callback);

	overload->addOverload("stereobm", "StereoBM", "setROI2", { make_param<Rect*>("roi2",Rect::name) }, setROI2);
	Nan::SetPrototypeMethod(ctor, "setROI2", stereobm_general_callback::callback);

	target->Set(Nan::New("StereoBM").ToLocalChecked(), ctor->GetFunction());

};

v8::Local<v8::Function> StereoBM::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}

POLY_METHOD(StereoBM::New) {
	auto ret = new StereoBM();
	ret->_algorithm = cv::StereoBM::create(info.at<int>(0), info.at<int>(1));

	ret->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(StereoBM::create) {
	auto ret = new StereoBM();
	ret->_algorithm = cv::StereoBM::create(info.at<int>(0), info.at<int>(1));
	info.SetReturnValue(ret);
}
POLY_METHOD(StereoBM::getPreFilterType) {
	auto this_ = info.This<StereoBM*>();
	auto ret = this_->_algorithm.dynamicCast<cv::StereoBM>()->getPreFilterType();
	info.SetReturnValue(ret);
}
POLY_METHOD(StereoBM::setPreFilterType) {
	auto this_ = info.This<StereoBM*>();
	this_->_algorithm.dynamicCast<cv::StereoBM>()->setPreFilterType(info.at<int>(0));
}
POLY_METHOD(StereoBM::getPreFilterSize) {
	auto this_ = info.This<StereoBM*>();
	auto ret = this_->_algorithm.dynamicCast<cv::StereoBM>()->getPreFilterType();
	info.SetReturnValue(ret);
}
POLY_METHOD(StereoBM::setPreFilterSize) {
	auto this_ = info.This<StereoBM*>();
	this_->_algorithm.dynamicCast<cv::StereoBM>()->setPreFilterSize(info.at<int>(0));
}
POLY_METHOD(StereoBM::getPreFilterCap) {
	auto this_ = info.This<StereoBM*>();
	auto ret = this_->_algorithm.dynamicCast<cv::StereoBM>()->getPreFilterType();
	info.SetReturnValue(ret);
}
POLY_METHOD(StereoBM::setPreFilterCap) {
	auto this_ = info.This<StereoBM*>();
	this_->_algorithm.dynamicCast<cv::StereoBM>()->setPreFilterCap(info.at<int>(0));
}
POLY_METHOD(StereoBM::getTextureThreshold) {
	auto this_ = info.This<StereoBM*>();
	auto ret = this_->_algorithm.dynamicCast<cv::StereoBM>()->getPreFilterType();
	info.SetReturnValue(ret);
}

POLY_METHOD(StereoBM::setTextureThreshold) {
	auto this_ = info.This<StereoBM*>();
	this_->_algorithm.dynamicCast<cv::StereoBM>()->setTextureThreshold(info.at<int>(0));
}
POLY_METHOD(StereoBM::getUniquenessRatio) {
	auto this_ = info.This<StereoBM*>();
	auto ret = this_->_algorithm.dynamicCast<cv::StereoBM>()->getPreFilterType();
	info.SetReturnValue(ret);
}
POLY_METHOD(StereoBM::setUniquenessRatio) {
	auto this_ = info.This<StereoBM*>();
	this_->_algorithm.dynamicCast<cv::StereoBM>()->setUniquenessRatio(info.at<int>(0));
}
POLY_METHOD(StereoBM::getSmallerBlockSize) {
	auto this_ = info.This<StereoBM*>();
	auto ret = this_->_algorithm.dynamicCast<cv::StereoBM>()->getPreFilterType();
	info.SetReturnValue(ret);
}
POLY_METHOD(StereoBM::setSmallerBlockSize) {
	auto this_ = info.This<StereoBM*>();
	this_->_algorithm.dynamicCast<cv::StereoBM>()->setSmallerBlockSize(info.at<int>(0));
}
POLY_METHOD(StereoBM::getROI1) {
	auto this_ = info.This<StereoBM*>();
	auto ret = this_->_algorithm.dynamicCast<cv::StereoBM>()->getPreFilterType();
	info.SetReturnValue(ret);
}
POLY_METHOD(StereoBM::setROI1) {
	auto this_ = info.This<StereoBM*>();
	this_->_algorithm.dynamicCast<cv::StereoBM>()->setROI1(*info.at<Rect*>(0)->_rect);
}
POLY_METHOD(StereoBM::getROI2) {
	auto this_ = info.This<StereoBM*>();
	auto ret = this_->_algorithm.dynamicCast<cv::StereoBM>()->getPreFilterType();
	info.SetReturnValue(ret);
}
POLY_METHOD(StereoBM::setROI2) {
	auto this_ = info.This<StereoBM*>();
	this_->_algorithm.dynamicCast<cv::StereoBM>()->setROI2(*info.at<Rect*>(0)->_rect);
}