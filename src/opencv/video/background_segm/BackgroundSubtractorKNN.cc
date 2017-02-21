#include "BackgroundSubtractorKNN.h"
#include "../../IOArray.h"

namespace backgroundsubtractorknn_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("backgroundsubtractorknn_general_callback is empty");
		}
		return overload->execute("backgroundsubtractorknn", info);
	}
}

Nan::Persistent<FunctionTemplate> BackgroundSubtractorKNN::constructor;

void BackgroundSubtractorKNN::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	backgroundsubtractorknn_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(backgroundsubtractorknn_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("BackgroundSubtractorKNN").ToLocalChecked());
	ctor->Inherit(Nan::New(BackgroundSubtractor::constructor));

	overload->register_type<BackgroundSubtractorKNN>(ctor, "backgroundsubtractorknn", "BackgroundSubtractorKNN");


	


//	
//	
//	/** @brief K-nearest neigbours - based Background/Foreground Segmentation Algorithm.
//	
//	The class implements the K-nearest neigbours background subtraction described in @cite Zivkovic2006 .
//	Very efficient if number of foreground pixels is low.
//	 */
//	export interface BackgroundSubtractorKNNStatic {
//	    new (): BackgroundSubtractorKNN;
//	}
	overload->addOverloadConstructor("backgroundsubtractorknn", "BackgroundSubtractorKNN", {}, New);
//	
//	export interface BackgroundSubtractorKNN extends BackgroundSubtractor
//	{
//	//public:
//	//    /** @brief Returns the number of last frames that affect the background model
//	//    */
//	    getHistory(): _st.int;
	overload->addOverload("backgroundsubtractorknn", "BackgroundSubtractorKNN", "getHistory", {}, getHistory);
	Nan::SetPrototypeMethod(ctor, "getHistory", backgroundsubtractorknn_general_callback::callback);
//	//    CV_WRAP virtual int getHistory() const = 0;
//	//    /** @brief Sets the number of last frames that affect the background model
//	//    */
//	    setHistory(history: _st.int ): void;
	overload->addOverload("backgroundsubtractorknn", "BackgroundSubtractorKNN", "setHistory", {make_param<int>("history","int")}, setHistory);
	Nan::SetPrototypeMethod(ctor, "setHistory", backgroundsubtractorknn_general_callback::callback);
//	//    CV_WRAP virtual void setHistory(int history) = 0;
//	//
//	//    /** @brief Returns the number of data samples in the background model
//	//    */
//	    getNSamples(): _st.int;
	overload->addOverload("backgroundsubtractorknn", "BackgroundSubtractorKNN", "getNSamples", {}, getNSamples);
	Nan::SetPrototypeMethod(ctor, "getNSamples", backgroundsubtractorknn_general_callback::callback);
//	//    CV_WRAP virtual int getNSamples() const = 0;
//	//    /** @brief Sets the number of data samples in the background model.
//	//
//	//    The model needs to be reinitalized to reserve memory.
//	//    */
//	    setNSamples(_nN: _st.int ): void;
	overload->addOverload("backgroundsubtractorknn", "BackgroundSubtractorKNN", "setNSamples", {make_param<int>("nN","int")}, setNSamples);
	Nan::SetPrototypeMethod(ctor, "setNSamples", backgroundsubtractorknn_general_callback::callback);
//	//    CV_WRAP virtual void setNSamples(int _nN) = 0;//needs reinitialization!
//	//
//	//    /** @brief Returns the threshold on the squared distance between the pixel and the sample
//	//
//	//    The threshold on the squared distance between the pixel and the sample to decide whether a pixel is
//	//    close to a data sample.
//	//     */
//	    getDist2Threshold(): _st.double;
	overload->addOverload("backgroundsubtractorknn", "BackgroundSubtractorKNN", "getDist2Threshold", {}, getDist2Threshold);
	Nan::SetPrototypeMethod(ctor, "getDist2Threshold", backgroundsubtractorknn_general_callback::callback);
//	//    CV_WRAP virtual double getDist2Threshold() const = 0;
//	//    /** @brief Sets the threshold on the squared distance
//	//    */
//	    setDist2Threshold(_dist2Threshold: _st.double ): void;
	overload->addOverload("backgroundsubtractorknn", "BackgroundSubtractorKNN", "setDist2Threshold", {make_param<double>("dist2Threshold","double")}, setDist2Threshold);
	Nan::SetPrototypeMethod(ctor, "setDist2Threshold", backgroundsubtractorknn_general_callback::callback);
//	//    CV_WRAP virtual void setDist2Threshold(double _dist2Threshold) = 0;
//	//
//	//    /** @brief Returns the number of neighbours, the k in the kNN.
//	//
//	//    K is the number of samples that need to be within dist2Threshold in order to decide that that
//	//    pixel is matching the kNN background model.
//	//     */
//	    getkNNSamples(): _st.int;
	overload->addOverload("backgroundsubtractorknn", "BackgroundSubtractorKNN", "getkNNSamples", {}, getkNNSamples);
	Nan::SetPrototypeMethod(ctor, "getkNNSamples", backgroundsubtractorknn_general_callback::callback);
//	//    CV_WRAP virtual int getkNNSamples() const = 0;
//	//    /** @brief Sets the k in the kNN. How many nearest neigbours need to match.
//	//    */
//	    setkNNSamples(_nkNN: _st.int ): void;
	overload->addOverload("backgroundsubtractorknn", "BackgroundSubtractorKNN", "setkNNSamples", {make_param<int>("nkNN","int")}, setkNNSamples);
	Nan::SetPrototypeMethod(ctor, "setkNNSamples", backgroundsubtractorknn_general_callback::callback);
//	//    CV_WRAP virtual void setkNNSamples(int _nkNN) = 0;
//	//
//	//    /** @brief Returns the shadow detection flag
//	//
//	//    If true, the algorithm detects shadows and marks them. See createBackgroundSubtractorKNN for
//	//    details.
//	//     */
//	    getDetectShadows(): boolean;
	overload->addOverload("backgroundsubtractorknn", "BackgroundSubtractorKNN", "getDetectShadows", {}, getDetectShadows);
	Nan::SetPrototypeMethod(ctor, "getDetectShadows", backgroundsubtractorknn_general_callback::callback);
//	//    CV_WRAP virtual bool getDetectShadows() const = 0;
//	//    /** @brief Enables or disables shadow detection
//	//    */
//	    setDetectShadows(detectShadows : boolean): void;
	overload->addOverload("backgroundsubtractorknn", "BackgroundSubtractorKNN", "setDetectShadows", {make_param<bool>("detectShadows","bool")}, setDetectShadows);
	Nan::SetPrototypeMethod(ctor, "setDetectShadows", backgroundsubtractorknn_general_callback::callback);
//	//
//	//    /** @brief Returns the shadow value
//	//
//	//    Shadow value is the value used to mark shadows in the foreground mask. Default value is 127. Value 0
//	//    in the mask always means background, 255 means foreground.
//	//     */
//	    getShadowValue(): _st.int;
	overload->addOverload("backgroundsubtractorknn", "BackgroundSubtractorKNN", "getShadowValue", {}, getShadowValue);
	Nan::SetPrototypeMethod(ctor, "getShadowValue", backgroundsubtractorknn_general_callback::callback);
//	//    CV_WRAP virtual int getShadowValue() const = 0;
//	//    /** @brief Sets the shadow value
//	//    */
//	    setShadowValue(value: _st.int ): void;
	overload->addOverload("backgroundsubtractorknn", "BackgroundSubtractorKNN", "setShadowValue", {make_param<int>("value","int")}, setShadowValue);
	Nan::SetPrototypeMethod(ctor, "setShadowValue", backgroundsubtractorknn_general_callback::callback);
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
	overload->addOverload("backgroundsubtractorknn", "BackgroundSubtractorKNN", "getShadowThreshold", {}, getShadowThreshold);
	Nan::SetPrototypeMethod(ctor, "getShadowThreshold", backgroundsubtractorknn_general_callback::callback);
//	//    CV_WRAP virtual double getShadowThreshold() const = 0;
//	//    /** @brief Sets the shadow threshold
//	//     */
//	    setShadowThreshold(threshold: _st.double): void;
	overload->addOverload("backgroundsubtractorknn", "BackgroundSubtractorKNN", "setShadowThreshold", {make_param<double>("threshold","double")}, setShadowThreshold);
	Nan::SetPrototypeMethod(ctor, "setShadowThreshold", backgroundsubtractorknn_general_callback::callback);
//	//    CV_WRAP virtual void setShadowThreshold(double threshold) = 0;
//	};
//	
//	export var BackgroundSubtractorKNN: BackgroundSubtractorKNNStatic = alvision_module.BackgroundSubtractorKNN;
//	
//	/** @brief Creates KNN Background Subtractor
//	
//	@param history Length of the history.
//	@param dist2Threshold Threshold on the squared distance between the pixel and the sample to decide
//	whether a pixel is close to that sample. This parameter does not affect the background update.
//	@param detectShadows If true, the algorithm will detect shadows and mark them. It decreases the
//	speed a bit, so if you do not need this feature, set the parameter to false.
//	 */
//	
//	export interface IcreateBackgroundSubtractorKNN {
//	    (history?: _st.int /*= 500*/, dist2Threshold?: _st.double /*= 400.0*/, detectShadows?: boolean /* =true*/): BackgroundSubtractorKNN;
//	}
//	
//	export var createBackgroundSubtractorKNN: IcreateBackgroundSubtractorKNN = alvision_module.createBackgroundSubtractorKNN;
	overload->addOverload("backgroundsubtractorknn", "BackgroundSubtractorKNN", "createBackgroundSubtractorKNN", {
		make_param<int>("history","int", 500),
		make_param<double>("dist2Threshold","double", 400.0),
		make_param<bool>("detectShadows","bool",true)
	}, createBackgroundSubtractorKNN);
	Nan::SetMethod(target,"createBackgroundSubtractorKNN", backgroundsubtractorknn_general_callback::callback);



target->Set(Nan::New("BackgroundSubtractorKNN").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> BackgroundSubtractorKNN::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(BackgroundSubtractorKNN::New){
	auto ret = new BackgroundSubtractorKNN();
	ret->_algorithm = cv::createBackgroundSubtractorKNN();

	ret->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(BackgroundSubtractorKNN::getHistory){
	auto this_ = info.This<BackgroundSubtractorKNN*>();
	auto res = this_->_algorithm.dynamicCast<cv::BackgroundSubtractorKNN>()->getHistory();
	info.SetReturnValue(res);
}
POLY_METHOD(BackgroundSubtractorKNN::setHistory){
	auto this_ = info.This<BackgroundSubtractorKNN*>();
	this_->_algorithm.dynamicCast<cv::BackgroundSubtractorKNN>()->setHistory(info.at<int>(0));
}
POLY_METHOD(BackgroundSubtractorKNN::getNSamples){
	auto this_ = info.This<BackgroundSubtractorKNN*>();
	auto res = this_->_algorithm.dynamicCast<cv::BackgroundSubtractorKNN>()->getNSamples();
	info.SetReturnValue(res);
}
POLY_METHOD(BackgroundSubtractorKNN::setNSamples){
	auto this_ = info.This<BackgroundSubtractorKNN*>();
	this_->_algorithm.dynamicCast<cv::BackgroundSubtractorKNN>()->setNSamples(info.at<int>(0));
}
POLY_METHOD(BackgroundSubtractorKNN::getDist2Threshold){
	auto this_ = info.This<BackgroundSubtractorKNN*>();
	auto res = this_->_algorithm.dynamicCast<cv::BackgroundSubtractorKNN>()->getDist2Threshold();
	info.SetReturnValue(res);
}
POLY_METHOD(BackgroundSubtractorKNN::setDist2Threshold){
	auto this_ = info.This<BackgroundSubtractorKNN*>();
	this_->_algorithm.dynamicCast<cv::BackgroundSubtractorKNN>()->setDist2Threshold(info.at<double>(0));
}
POLY_METHOD(BackgroundSubtractorKNN::getkNNSamples){
	auto this_ = info.This<BackgroundSubtractorKNN*>();
	auto res = this_->_algorithm.dynamicCast<cv::BackgroundSubtractorKNN>()->getkNNSamples();
	info.SetReturnValue(res);
}
POLY_METHOD(BackgroundSubtractorKNN::setkNNSamples){
	auto this_ = info.This<BackgroundSubtractorKNN*>();
	this_->_algorithm.dynamicCast<cv::BackgroundSubtractorKNN>()->setkNNSamples(info.at<int>(0));
}
POLY_METHOD(BackgroundSubtractorKNN::getDetectShadows){
	auto this_ = info.This<BackgroundSubtractorKNN*>();
	auto res = this_->_algorithm.dynamicCast<cv::BackgroundSubtractorKNN>()->getDetectShadows();
	info.SetReturnValue(res);
}
POLY_METHOD(BackgroundSubtractorKNN::setDetectShadows){
	auto this_ = info.This<BackgroundSubtractorKNN*>();
	this_->_algorithm.dynamicCast<cv::BackgroundSubtractorKNN>()->setDetectShadows(info.at<bool>(0));
}
POLY_METHOD(BackgroundSubtractorKNN::getShadowValue){
	auto this_ = info.This<BackgroundSubtractorKNN*>();
	auto res = this_->_algorithm.dynamicCast<cv::BackgroundSubtractorKNN>()->getShadowValue();
	info.SetReturnValue(res);
}
POLY_METHOD(BackgroundSubtractorKNN::setShadowValue){
	auto this_ = info.This<BackgroundSubtractorKNN*>();
	this_->_algorithm.dynamicCast<cv::BackgroundSubtractorKNN>()->setShadowValue(info.at<int>(0));
}
POLY_METHOD(BackgroundSubtractorKNN::getShadowThreshold){
	auto this_ = info.This<BackgroundSubtractorKNN*>();
	auto res = this_->_algorithm.dynamicCast<cv::BackgroundSubtractorKNN>()->getShadowThreshold();
	info.SetReturnValue(res);
}
POLY_METHOD(BackgroundSubtractorKNN::setShadowThreshold){
	auto this_ = info.This<BackgroundSubtractorKNN*>();
	this_->_algorithm.dynamicCast<cv::BackgroundSubtractorKNN>()->setShadowThreshold(info.at<double>(0));
}



POLY_METHOD(BackgroundSubtractorKNN::createBackgroundSubtractorKNN){
	auto ret = new BackgroundSubtractorKNN();
	ret->_algorithm = cv::createBackgroundSubtractorKNN(info.at<int>(0), info.at<double>(1), info.at<bool>(2));

	info.SetReturnValue(ret);
}

