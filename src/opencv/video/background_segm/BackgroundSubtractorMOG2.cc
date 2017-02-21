#include "BackgroundSubtractorMOG2.h"
#include "../../IOArray.h"

namespace backgroundsubtractormog2_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("backgroundsubtractormog2_general_callback is empty");
		}
		return overload->execute("backgroundsubtractormog2", info);
	}
}

Nan::Persistent<FunctionTemplate> BackgroundSubtractorMOG2::constructor;

void BackgroundSubtractorMOG2::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	backgroundsubtractormog2_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(backgroundsubtractormog2_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("BackgroundSubtractorMOG2").ToLocalChecked());
	ctor->Inherit(Nan::New(BackgroundSubtractor::constructor));

	overload->register_type<BackgroundSubtractorMOG2>(ctor, "backgroundsubtractormog2", "BackgroundSubtractorMOG2");


//	/** @brief Gaussian Mixture-based Background/Foreground Segmentation Algorithm.
//	
//	The class implements the Gaussian mixture model background subtraction described in @cite Zivkovic2004
//	and @cite Zivkovic2006 .
//	 */
//	
//	export interface BackgroundSubtractorMOG2Static {
//	    new (): BackgroundSubtractorMOG2;
	overload->addOverloadConstructor("backgroundsubtractormog2", "BackgroundSubtractorMOG2", {}, New);
//	}
//	
//	export interface BackgroundSubtractorMOG2 extends BackgroundSubtractor
//	{
//	//public:
//	//    /** @brief Returns the number of last frames that affect the background model
//	//    */
//	    getHistory(): _st.int;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "getHistory", {}, getHistory);
	Nan::SetPrototypeMethod(ctor, "getHistory", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual int getHistory() const = 0;
//	//    /** @brief Sets the number of last frames that affect the background model
//	//    */
//	    setHistory(history: _st.int ): void ;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "setHistory", {make_param<int>("history","int")}, setHistory);
	Nan::SetPrototypeMethod(ctor, "setHistory", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual void setHistory(int history) = 0;
//	//
//	//    /** @brief Returns the number of gaussian components in the background model
//	//    */
//	    getNMixtures(): _st.int;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "getNMixtures", {}, getNMixtures);
	Nan::SetPrototypeMethod(ctor, "getNMixtures", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual int getNMixtures() const = 0;
//	//    /** @brief Sets the number of gaussian components in the background model.
//	//
//	//    The model needs to be reinitalized to reserve memory.
//	//    */
//	    setNMixtures(nmixtures: _st.int ): void;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "setNMixtures", {make_param<int>("nmixtures","int")}, setNMixtures);
	Nan::SetPrototypeMethod(ctor, "setNMixtures", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual void setNMixtures(int nmixtures) = 0;//needs reinitialization!
//	//
//	//    /** @brief Returns the "background ratio" parameter of the algorithm
//	//
//	//    If a foreground pixel keeps semi-constant value for about backgroundRatio\*history frames, it's
//	//    considered background and added to the model as a center of a new component. It corresponds to TB
//	//    parameter in the paper.
//	//     */
//	    getBackgroundRatio(): _st.double;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "getBackgroundRatio", {}, getBackgroundRatio);
	Nan::SetPrototypeMethod(ctor, "getBackgroundRatio", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual double getBackgroundRatio() const = 0;
//	//    /** @brief Sets the "background ratio" parameter of the algorithm
//	//    */
//	    setBackgroundRatio(ratio: _st.double ) : void;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "setBackgroundRatio", {make_param<double>("ratio","double")}, setBackgroundRatio);
	Nan::SetPrototypeMethod(ctor, "setBackgroundRatio", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual void setBackgroundRatio(double ratio) = 0;
//	//
//	//    /** @brief Returns the variance threshold for the pixel-model match
//	//
//	//    The main threshold on the squared Mahalanobis distance to decide if the sample is well described by
//	//    the background model or not. Related to Cthr from the paper.
//	//     */
//	    getVarThreshold() : _st.double;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "getVarThreshold", {}, getVarThreshold);
	Nan::SetPrototypeMethod(ctor, "getVarThreshold", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual double getVarThreshold() const = 0;
//	//    /** @brief Sets the variance threshold for the pixel-model match
//	//    */
//	    setVarThreshold(varThreshold: _st.double ): void;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "setVarThreshold", {make_param<double>("varThreshold","double")}, setVarThreshold);
	Nan::SetPrototypeMethod(ctor, "setVarThreshold", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual void setVarThreshold(double varThreshold) = 0;
//	//
//	//    /** @brief Returns the variance threshold for the pixel-model match used for new mixture component generation
//	//
//	//    Threshold for the squared Mahalanobis distance that helps decide when a sample is close to the
//	//    existing components (corresponds to Tg in the paper). If a pixel is not close to any component, it
//	//    is considered foreground or added as a new component. 3 sigma =\> Tg=3\*3=9 is default. A smaller Tg
//	//    value generates more components. A higher Tg value may result in a small number of components but
//	//    they can grow too large.
//	//     */
//	    getVarThresholdGen(): _st.double;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "getVarThresholdGen", {}, getVarThresholdGen);
	Nan::SetPrototypeMethod(ctor, "getVarThresholdGen", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual double getVarThresholdGen() const = 0;
//	//    /** @brief Sets the variance threshold for the pixel-model match used for new mixture component generation
//	//    */
//	    setVarThresholdGen(varThresholdGen: _st.double ): void;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "setVarThresholdGen", { make_param<double>("varThresholdGen","double")}, setVarThresholdGen);
	Nan::SetPrototypeMethod(ctor, "setVarThresholdGen", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual void setVarThresholdGen(double varThresholdGen) = 0;
//	//
//	//    /** @brief Returns the initial variance of each gaussian component
//	//    */
//	    getVarInit(): _st.double;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "getVarInit", {}, getVarInit);
	Nan::SetPrototypeMethod(ctor, "getVarInit", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual double getVarInit() const = 0;
//	//    /** @brief Sets the initial variance of each gaussian component
//	//    */
//	    setVarInit(varInit: _st.double ): void;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "setVarInit", {make_param<double>("varInit","double")}, setVarInit);
	Nan::SetPrototypeMethod(ctor, "setVarInit", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual void setVarInit(double varInit) = 0;
//	//
//	    getVarMin(): _st.double;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "getVarMin", {}, getVarMin);
	Nan::SetPrototypeMethod(ctor, "getVarMin", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual double getVarMin() const = 0;
//	    setVarMin(varMin: _st.double ): void;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "setVarMin", {make_param<double>("varMin","double")}, setVarMin);
	Nan::SetPrototypeMethod(ctor, "setVarMin", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual void setVarMin(double varMin) = 0;
//	//
//	    getVarMax(): _st.double;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "getVarMax", {}, getVarMax);
	Nan::SetPrototypeMethod(ctor, "getVarMax", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual double getVarMax() const = 0;
//	    setVarMax(varMax: _st.double ): void;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "setVarMax", {make_param<double>("varMax","double")}, setVarMax);
	Nan::SetPrototypeMethod(ctor, "setVarMax", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual void setVarMax(double varMax) = 0;
//	//
//	//    /** @brief Returns the complexity reduction threshold
//	//
//	//    This parameter defines the number of samples needed to accept to prove the component exists. CT=0.05
//	//    is a default value for all the samples. By setting CT=0 you get an algorithm very similar to the
//	//    standard Stauffer&Grimson algorithm.
//	//     */
//	    getComplexityReductionThreshold(): _st.double;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "getComplexityReductionThreshold", {}, getComplexityReductionThreshold);
	Nan::SetPrototypeMethod(ctor, "getComplexityReductionThreshold", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual double getComplexityReductionThreshold() const = 0;
//	//    /** @brief Sets the complexity reduction threshold
//	//    */
//	    setComplexityReductionThreshold(ct: _st.double ): void;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "setComplexityReductionThreshold", {make_param<double>("ct","double")}, setComplexityReductionThreshold);
	Nan::SetPrototypeMethod(ctor, "setComplexityReductionThreshold", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual void setComplexityReductionThreshold(double ct) = 0;
//	//
//	//    /** @brief Returns the shadow detection flag
//	//
//	//    If true, the algorithm detects shadows and marks them. See createBackgroundSubtractorMOG2 for
//	//    details.
//	//     */
//	    getDetectShadows(): boolean;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "getDetectShadows", {}, getDetectShadows);
	Nan::SetPrototypeMethod(ctor, "getDetectShadows", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual bool getDetectShadows() const = 0;
//	//    /** @brief Enables or disables shadow detection
//	//    */
//	    setDetectShadows(detectShadows : boolean): void;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "setDetectShadows", {make_param<bool>("detectShadows","bool")}, setDetectShadows);
	Nan::SetPrototypeMethod(ctor, "setDetectShadows", backgroundsubtractormog2_general_callback::callback);
//	//
//	//    /** @brief Returns the shadow value
//	//
//	//    Shadow value is the value used to mark shadows in the foreground mask. Default value is 127. Value 0
//	//    in the mask always means background, 255 means foreground.
//	//     */
//	    getShadowValue(): _st.int;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "getShadowValue", {}, getShadowValue);
	Nan::SetPrototypeMethod(ctor, "getShadowValue", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual int getShadowValue() const = 0;
//	//    /** @brief Sets the shadow value
//	//    */
//	    setShadowValue(value: _st.int ): void;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "setShadowValue", {make_param<int>("value","int")}, setShadowValue);
	Nan::SetPrototypeMethod(ctor, "setShadowValue", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual void setShadowValue(int value) = 0;
//	//
//	//    /** @brief Returns the shadow threshold
//	//
//	//    A shadow is detected if pixel is a darker version of the background. The shadow threshold (Tau in
//	//    the paper) is a threshold defining how much darker the shadow can be. Tau= 0.5 means that if a pixel
//	//    is more than twice darker then it is not shadow. See Prati, Mikic, Trivedi and Cucchiarra,
//	//    *Detecting Moving Shadows...*, IEEE PAMI,2003.
//	//     */
//	    getShadowThreshold(): _st.double;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "getShadowThreshold", {}, getShadowThreshold);
	Nan::SetPrototypeMethod(ctor, "getShadowThreshold", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual double getShadowThreshold() const = 0;
//	//    /** @brief Sets the shadow threshold
//	//    */
//	    setShadowThreshold(threshold: _st.double ): void;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "setShadowThreshold", {make_param<double>("threshold","double")}, setShadowThreshold);
	Nan::SetPrototypeMethod(ctor, "setShadowThreshold", backgroundsubtractormog2_general_callback::callback);
//	//    CV_WRAP virtual void setShadowThreshold(double threshold) = 0;
//	};
//	
//	export var BackgroundSubtractorMOG2: BackgroundSubtractorMOG2Static = alvision_module.BackgroundSubtractorMOG2;
//	
//	/** @brief Creates MOG2 Background Subtractor
//	
//	@param history Length of the history.
//	@param varThreshold Threshold on the squared Mahalanobis distance between the pixel and the model
//	to decide whether a pixel is well described by the background model. This parameter does not
//	affect the background update.
//	@param detectShadows If true, the algorithm will detect shadows and mark them. It decreases the
//	speed a bit, so if you do not need this feature, set the parameter to false.
//	 */
//	
//	interface IcreateBackgroundSubtractorMOG2{
//	    (history?: _st.int/*= 500*/, varThreshold?: _st.double /*= 16*/,
//	        detectShadows? : boolean /*= true*/) : BackgroundSubtractorMOG2;
//	}
//	
//	export var createBackgroundSubtractorMOG2: IcreateBackgroundSubtractorMOG2 = alvision_module.createBackgroundSubtractorMOG2;
	overload->addOverload("backgroundsubtractormog2", "BackgroundSubtractorMOG2", "createBackgroundSubtractorMOG2", {
		make_param<int>("history","int", 500),
		make_param<double>("varThreshold","double", 16),
		make_param<bool>("detectShadows","bool", true)
	}, createBackgroundSubtractorMOG2);
	Nan::SetMethod(target, "createBackgroundSubtractorMOG2", backgroundsubtractormog2_general_callback::callback);
//	
//	//CV_EXPORTS_W Ptr<BackgroundSubtractorMOG2>
//	//    createBackgroundSubtractorMOG2(int history=500, double varThreshold=16,
//	//                                   bool detectShadows=true);




target->Set(Nan::New("BackgroundSubtractorMOG2").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> BackgroundSubtractorMOG2::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(BackgroundSubtractorMOG2::New){
	auto ret = new BackgroundSubtractorMOG2();
	ret->_algorithm = cv::createBackgroundSubtractorMOG2();

	ret->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());

}
POLY_METHOD(BackgroundSubtractorMOG2::getHistory){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	auto res = this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->getHistory();
	info.SetReturnValue(res);
}
POLY_METHOD(BackgroundSubtractorMOG2::setHistory){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->setHistory(info.at<int>(0));

}
POLY_METHOD(BackgroundSubtractorMOG2::getNMixtures){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	auto res = this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->getNMixtures();
	info.SetReturnValue(res);
}
POLY_METHOD(BackgroundSubtractorMOG2::setNMixtures){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->setNMixtures(info.at<int>(0));
}
POLY_METHOD(BackgroundSubtractorMOG2::getBackgroundRatio){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	auto res = this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->getBackgroundRatio();
	info.SetReturnValue(res);
}
POLY_METHOD(BackgroundSubtractorMOG2::setBackgroundRatio){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->setBackgroundRatio(info.at<double>(0));
}
POLY_METHOD(BackgroundSubtractorMOG2::getVarThreshold){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	auto res = this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->getVarThreshold();
	info.SetReturnValue(res);
}
POLY_METHOD(BackgroundSubtractorMOG2::setVarThreshold){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->setVarThreshold(info.at<double>(0));
}
POLY_METHOD(BackgroundSubtractorMOG2::getVarThresholdGen){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	auto res = this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->getVarThresholdGen();
	info.SetReturnValue(res);
}
POLY_METHOD(BackgroundSubtractorMOG2::setVarThresholdGen){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->setVarThresholdGen(info.at<double>(0));
}
POLY_METHOD(BackgroundSubtractorMOG2::getVarInit){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	auto res = this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->getVarInit();
	info.SetReturnValue(res);
}
POLY_METHOD(BackgroundSubtractorMOG2::setVarInit){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->setVarInit(info.at<double>(0));
}
POLY_METHOD(BackgroundSubtractorMOG2::getVarMin){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	auto res = this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->getVarMin();
	info.SetReturnValue(res);
}
POLY_METHOD(BackgroundSubtractorMOG2::setVarMin){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->setVarMin(info.at<double>(0));
}
POLY_METHOD(BackgroundSubtractorMOG2::getVarMax){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	auto res = this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->getVarMax();
	info.SetReturnValue(res);
}
POLY_METHOD(BackgroundSubtractorMOG2::setVarMax){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->setVarMax(info.at<double>(0));
}
POLY_METHOD(BackgroundSubtractorMOG2::getComplexityReductionThreshold){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	auto res = this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->getComplexityReductionThreshold();
	info.SetReturnValue(res);
}
POLY_METHOD(BackgroundSubtractorMOG2::setComplexityReductionThreshold){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->setComplexityReductionThreshold(info.at<double>(0));
}
POLY_METHOD(BackgroundSubtractorMOG2::getDetectShadows){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	auto res = this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->getDetectShadows();
	info.SetReturnValue(res);
}
POLY_METHOD(BackgroundSubtractorMOG2::setDetectShadows){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->setDetectShadows(info.at<bool>(0));
}
POLY_METHOD(BackgroundSubtractorMOG2::getShadowValue){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	auto res = this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->getShadowValue();
	info.SetReturnValue(res);
}
POLY_METHOD(BackgroundSubtractorMOG2::setShadowValue){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->setShadowValue(info.at<int>(0));
}
POLY_METHOD(BackgroundSubtractorMOG2::getShadowThreshold){
	auto this_ = info.This<BackgroundSubtractorMOG2*>();
	auto res = this_->_algorithm.dynamicCast<cv::BackgroundSubtractorMOG2>()->getShadowThreshold();
	info.SetReturnValue(res);
}
POLY_METHOD(BackgroundSubtractorMOG2::setShadowThreshold){
	throw std::exception("not implemented");
}



POLY_METHOD(BackgroundSubtractorMOG2::createBackgroundSubtractorMOG2){
	auto ret = new BackgroundSubtractorMOG2();
	ret->_algorithm = cv::createBackgroundSubtractorMOG2(info.at<int>(0), info.at<double>(1), info.at<bool>(2));

	info.SetReturnValue(ret);
}

