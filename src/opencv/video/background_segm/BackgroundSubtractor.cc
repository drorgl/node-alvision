#include "BackgroundSubtractor.h"
#include "../../IOArray.h"

namespace backgroundsubtractor_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("backgroundsubtractor_general_callback is empty");
		}
		return overload->execute("backgroundsubtractor", info);
	}
}

Nan::Persistent<FunctionTemplate> BackgroundSubtractor::constructor;

void BackgroundSubtractor::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	backgroundsubtractor_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(backgroundsubtractor_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("BackgroundSubtractor").ToLocalChecked());
	ctor->Inherit(Nan::New(Algorithm::constructor));

	overload->register_type<BackgroundSubtractor>(ctor, "backgroundsubtractor", "BackgroundSubtractor");


	overload->addOverloadConstructor("backgroundsubtractor", "BackgroundSubtractor", {}, New);

//	
//	
//	export interface BackgroundSubtractorStatic {
//	    new (): BackgroundSubtractor;
//	}
//	
//	export interface BackgroundSubtractor extends _core.Algorithm
//	{
//	//public:
//	    /** @brief Computes a foreground mask.
//	
//	    @param image Next video frame.
//	    @param fgmask The output foreground mask as an 8-bit binary image.
//	    @param learningRate The value between 0 and 1 that indicates how fast the background model is
//	    learnt. Negative parameter value makes the algorithm to use some automatically chosen learning
//	    rate. 0 means that the background model is not updated at all, 1 means that the background model
//	    is completely reinitialized from the last frame.
//	     */
//	    apply(image: _st.InputArray, fgmask: _st.OutputArray, learningRate?: _st.double /*= -1*/): void;
	overload->addOverload("backgroundsubtractor", "BackgroundSubtractor", "apply", {
			make_param<IOArray*>("image","InputArray"),
			make_param<IOArray*>("fgmask","OutputArray"),
			make_param<double>("learningRate","double",-1)
	}, apply);
	Nan::SetPrototypeMethod(ctor, "apply", backgroundsubtractor_general_callback::callback);
//	
//	    /** @brief Computes a background image.
//	
//	    @param backgroundImage The output background image.
//	
//	    @note Sometimes the background image can be very blurry, as it contain the average background
//	    statistics.
//	     */
//	    getBackgroundImage(backgroundImage: _st.OutputArray ): void;
	overload->addOverload("backgroundsubtractor", "BackgroundSubtractor", "getBackgroundImage", {
		make_param<IOArray*>("backgroundImage","OutputArray")
	}, getBackgroundImage);
	Nan::SetPrototypeMethod(ctor, "getBackgroundImage", backgroundsubtractor_general_callback::callback);
//	};
//	
//	export var BackgroundSubtractor: BackgroundSubtractorStatic = alvision_module.BackgroundSubtractor;


	target->Set(Nan::New("BackgroundSubtractor").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> BackgroundSubtractor::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}

POLY_METHOD(BackgroundSubtractor::New){
	auto ret = new BackgroundSubtractor();

	ret->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(BackgroundSubtractor::apply){
	auto this_ = info.This<BackgroundSubtractor*>();
	this_->_algorithm.dynamicCast<cv::BackgroundSubtractor>()->apply(info.at<IOArray*>(0)->GetInputArray(), info.at<IOArray*>(1)->GetOutputArray(), info.at<double>(2));
	
}
POLY_METHOD(BackgroundSubtractor::getBackgroundImage){
	auto this_ = info.This<BackgroundSubtractor*>();
	this_->_algorithm.dynamicCast<cv::BackgroundSubtractor>()->getBackgroundImage(info.at<IOArray*>(0)->GetOutputArray());
}

