#include "StereoSGBM.h"

namespace stereosgbm_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("stereosgbm_general_callback is empty");
		}
		return overload->execute("matrix", info);
	}
}

Nan::Persistent<FunctionTemplate> StereoSGBM::constructor;


void StereoSGBM::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	stereosgbm_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(stereosgbm_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("StereoSGBM").ToLocalChecked());
	ctor->Inherit(Nan::New(StereoMatcher::constructor));

	overload->register_type<StereoSGBM>(ctor, "stereosgbm", "StereoSGBM");



	auto StereoSGBMMode = CreateNamedObject(target, "StereoSGBMMode");
	SetObjectProperty(StereoSGBMMode, "MODE_SGBM", 0);
	SetObjectProperty(StereoSGBMMode, "MODE_HH", 1);
	SetObjectProperty(StereoSGBMMode, "MODE_SGBM_3WAY", 2);
	overload->add_type_alias("StereoSGBMMode", "int");


	overload->addStaticOverload("stereosgbm", "", "create", {
			make_param<int>("minDisparity","int"),
			make_param<int>("numDisparities","int"),
			make_param<int>("blockSize","int"),
			make_param<int>("P1","int",0),
			make_param<int>("P2","int",0),
			make_param<int>("disp12MaxDiff","int",0),
			make_param<int>("preFilterCap","int",0),
			make_param<int>("uniquenessRatio","int",0),
			make_param<int>("speckleWindowSize","int",0),
			make_param<int>("speckleRange","int",0),
			make_param<int>("mode","StereoSGBMMode",cv::StereoSGBM::MODE_SGBM)
	}, create);

	overload->addOverload("stereosgbm", "", "getPreFilterCap", {}, getPreFilterCap);
	overload->addOverload("stereosgbm", "", "setPreFilterCap", { make_param<int>("preFilterCap","int") }, setPreFilterCap);

	overload->addOverload("stereosgbm", "", "getUniquenessRatio", {}, getUniquenessRatio);
	overload->addOverload("stereosgbm", "", "setUniquenessRatio", { make_param<int>("uniquenessRatio","int") }, setUniquenessRatio);

	overload->addOverload("stereosgbm", "", "getP1", {}, getP1);
	overload->addOverload("stereosgbm", "", "setP1", { make_param<int>("P1","int") }, setP1);

	overload->addOverload("stereosgbm", "", "getP2", {}, getP2);
	overload->addOverload("stereosgbm", "", "setP2", { make_param<int>("P2","int") }, setP2);

	overload->addOverload("stereosgbm", "", "getMode", {}, getMode);
	overload->addOverload("stereosgbm", "", "setMode", { make_param<int>("mode","int") }, setMode);

}
v8::Local<v8::Function> StereoSGBM::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}

POLY_METHOD(StereoSGBM::create) {
	auto minDisparity = info.at<int>(0);
	auto numDisparities = info.at<int>(1);
	auto blockSize = info.at<int>(2);
	auto P1 = info.at<int>(3);
	auto P2 = info.at<int>(4);
	auto disp12MaxDiff = info.at<int>(5);
	auto preFilterCap = info.at<int>(6);
	auto uniquenessRatio = info.at<int>(7);
	auto speckleWindowSize = info.at<int>(8);
	auto speckleRange = info.at<int>(9);
	auto mode = info.at<int>(10);

	auto ret = cv::StereoSGBM::create(
		minDisparity,
		numDisparities,
		blockSize,
		P1,
		P2,
		disp12MaxDiff,
		preFilterCap,
		uniquenessRatio,
		speckleWindowSize,
		speckleRange,
		mode
	);

	info.SetReturnValue(ret);

}

POLY_METHOD(StereoSGBM::getPreFilterCap) {
	auto this_ = info.This<StereoSGBM*>();
	auto ret = this_->_algorithm.dynamicCast<cv::StereoSGBM>()->getPreFilterCap();
	info.SetReturnValue(ret);
}
POLY_METHOD(StereoSGBM::setPreFilterCap) {
	auto this_ = info.This<StereoSGBM*>();
	this_->_algorithm.dynamicCast<cv::StereoSGBM>()->setPreFilterCap(info.at<int>(0));
}
POLY_METHOD(StereoSGBM::getUniquenessRatio) {
	auto this_ = info.This<StereoSGBM*>();
	auto ret = this_->_algorithm.dynamicCast<cv::StereoSGBM>()->getUniquenessRatio();
	info.SetReturnValue(ret);
}
POLY_METHOD(StereoSGBM::setUniquenessRatio) {
	auto this_ = info.This<StereoSGBM*>();
	this_->_algorithm.dynamicCast<cv::StereoSGBM>()->setUniquenessRatio(info.at<int>(0));
}
POLY_METHOD(StereoSGBM::getP1) {
	auto this_ = info.This<StereoSGBM*>();
	auto ret = this_->_algorithm.dynamicCast<cv::StereoSGBM>()->getP1();
	info.SetReturnValue(ret);
}
POLY_METHOD(StereoSGBM::setP1) {
	auto this_ = info.This<StereoSGBM*>();
	this_->_algorithm.dynamicCast<cv::StereoSGBM>()->setP1(info.at<int>(0));
}
POLY_METHOD(StereoSGBM::getP2) {
	auto this_ = info.This<StereoSGBM*>();
	auto ret = this_->_algorithm.dynamicCast<cv::StereoSGBM>()->getP2();
	info.SetReturnValue(ret);
}
POLY_METHOD(StereoSGBM::setP2) {
	auto this_ = info.This<StereoSGBM*>();
	this_->_algorithm.dynamicCast<cv::StereoSGBM>()->setP2(info.at<int>(0));
}
POLY_METHOD(StereoSGBM::getMode) {
	auto this_ = info.This<StereoSGBM*>();
	auto ret = this_->_algorithm.dynamicCast<cv::StereoSGBM>()->getMode();
	info.SetReturnValue(ret);
}
POLY_METHOD(StereoSGBM::setMode) {
	auto this_ = info.This<StereoSGBM*>();
	this_->_algorithm.dynamicCast<cv::StereoSGBM>()->setMode(info.at<int>(0));
}


