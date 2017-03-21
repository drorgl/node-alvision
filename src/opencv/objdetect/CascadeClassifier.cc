#include "CascadeClassifier.h"

#include <iterator>

#include "../IOArray.h"
#include "../types/Size.h"
#include "../types/Rect.h"
#include "../persistence/FileNode.h"


namespace cascadeclassifier_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("cascadeclassifier_general_callback is empty");
		}
		return overload->execute("cascadeclassifier", info);
	}
}

Nan::Persistent<FunctionTemplate> CascadeClassifier::constructor;

void
CascadeClassifier::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	cascadeclassifier_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(cascadeclassifier_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("CascadeClassifier").ToLocalChecked());


	overload->register_type<CascadeClassifier>(ctor, "cascadeclassifier", "CascadeClassifier");



//
///** @brief Cascade classifier class for object detection.
//*/
//interface CascadeClassifierStatic {
//	new () : CascadeClassifier;
	overload->addOverloadConstructor("cascadeclassifier", "CascadeClassifier", {},New );
//	/** @brief Loads a classifier from a file.
//
//	@param filename Name of the file from which the classifier is loaded.
//	*/
//	new (filename : string) : CascadeClassifier;
	overload->addOverloadConstructor("cascadeclassifier", "CascadeClassifier", {make_param<std::string>("filename","String")}, New_file);
//	//    ~CascadeClassifier();
//
//}
//
//interface CascadeClassifier
//{
//	//public:
//	/** @brief Checks whether the classifier has been loaded.
//	*/
	overload->addOverload("cascadeclassifier", "CascadeClassifier","empty", {}, empty);
	Nan::SetPrototypeMethod(ctor, "empty", cascadeclassifier_general_callback::callback);
//	empty() : boolean;
//	/** @brief Loads a classifier from a file.
//
//	@param filename Name of the file from which the classifier is loaded. The file may contain an old
//	HAAR classifier trained by the haartraining application or a new cascade classifier trained by the
//	traincascade application.
//	*/
	overload->addOverload("cascadeclassifier", "CascadeClassifier", "load", {make_param<std::string>("filename","String")}, load);
	Nan::SetPrototypeMethod(ctor, "load", cascadeclassifier_general_callback::callback);
//	load(filename : string) : boolean;
//	/** @brief Reads a classifier from a FileStorage node.
//
//	@note The file may contain a new cascade classifier (trained traincascade application) only.
//	*/
	overload->addOverload("cascadeclassifier", "CascadeClassifier", "read", {make_param<FileNode*>("node","FileNode")}, read);
	Nan::SetPrototypeMethod(ctor, "read", cascadeclassifier_general_callback::callback);
//	read(node: _persistence.FileNode) : boolean;
//
//	/** @brief Detects objects of different sizes in the input image. The detected objects are returned as a list
//	of rectangles.
//
//	@param image Matrix of the type CV_8U containing an image where objects are detected.
//	@param objects Vector of rectangles where each rectangle contains the detected object, the
//	rectangles may be partially outside the original image.
//	@param scaleFactor Parameter specifying how much the image size is reduced at each image scale.
//	@param minNeighbors Parameter specifying how many neighbors each candidate rectangle should have
//	to retain it.
//	@param flags Parameter with the same meaning for an old cascade as in the function
//	cvHaarDetectObjects. It is not used for a new cascade.
//	@param minSize Minimum possible object size. Objects smaller than that are ignored.
//	@param maxSize Maximum possible object size. Objects larger than that are ignored.
//
//	The function is parallelized with the TBB library.
//
//	@note
//	-   (Python) A face detection example using cascade classifiers can be found at
//	opencv_source_code/samples/python/facedetect.py
//	*/
//	detectMultiScale(image: _st.InputArray,
//		cb : (objects : Array<_types.Rect>) = >void,
//		scaleFactor ? : _st.double /*= 1.1*/,
//		minNeighbors ? : _st.int /*= 3*/, flags ? : _st.int /* = 0*/,
//		minSize ? : _types.Size /*= Size()*/,
//		maxSize ? : _types.Size /*= Size()*/) : void;
//
//	/** @overload
//	@param image Matrix of the type CV_8U containing an image where objects are detected.
//	@param objects Vector of rectangles where each rectangle contains the detected object, the
//	rectangles may be partially outside the original image.
//	@param numDetections Vector of detection numbers for the corresponding objects. An object's number
//	of detections is the number of neighboring positively classified rectangles that were joined
//	together to form the object.
//	@param scaleFactor Parameter specifying how much the image size is reduced at each image scale.
//	@param minNeighbors Parameter specifying how many neighbors each candidate rectangle should have
//	to retain it.
//	@param flags Parameter with the same meaning for an old cascade as in the function
//	cvHaarDetectObjects. It is not used for a new cascade.
//	@param minSize Minimum possible object size. Objects smaller than that are ignored.
//	@param maxSize Maximum possible object size. Objects larger than that are ignored.
//	*/
//	detectMultiScale(image: _st.InputArray,
//		cb : (objects : Array<_types.Rect>, numDetections : Array<_st.int>) = >void,
//		scaleFactor ? : _st.double /*=1.1*/,
//		minNeighbors ? : _st.int /*=3*/, flags ? : _st.int /*=0*/,
//		minSize ? : _types.Size /*=Size()*/,
//		maxSize ? : _types.Size /*= Size()*/) : void;
//
//	/** @overload
//	if `outputRejectLevels` is `true` returns `rejectLevels` and `levelWeights`
//	*/
	overload->addOverload("cascadeclassifier", "CascadeClassifier", "detectMultiScale", {
		make_param<IOArray*>("image","InputArray"),
		make_param<std::shared_ptr<overres::Callback>>("cb","Function"),// : (objects : Array<_types.Rect>,rejectLevels : Array<_st.int>,levelWeights : Array<_st.double>) = >void,
		make_param<double>("scaleFactor","double", 1.1),
		make_param<int>("minNeighbors","int", 3),
		make_param<int>("flags","int", 0),
		make_param<Size*>("minSize",Size::name, Size::create()),
		make_param<Size*>("maxSize",Size::name, Size::create()),
		make_param<bool>("outputRejectLevels","bool", false)
	}, detectMultiScale);
	Nan::SetPrototypeMethod(ctor, "detectMultiScale", cascadeclassifier_general_callback::callback);
//	detectMultiScale(image: _st.InputArray,
//		cb : (objects : Array<_types.Rect>,
//			rejectLevels : Array<_st.int>,
//			levelWeights : Array<_st.double>) = >void,
//		scaleFactor ? : _st.double /* = 1.1*/,
//		minNeighbors ? : _st.int /*= 3*/, flags ? : _st.int /*= 0*/,
//		minSize ? : _types.Size /*= Size()*/,
//		maxSize ? : _types.Size /*= Size()*/,
//		outputRejectLevels ? : boolean /*= false*/) : void;
//
	overload->addOverload("cascadeclassifier", "CascadeClassifier", "isOldFormatCascade", {}, isOldFormatCascade);
	Nan::SetPrototypeMethod(ctor, "isOldFormatCascade", cascadeclassifier_general_callback::callback);
//	isOldFormatCascade() : boolean;

	overload->addOverload("cascadeclassifier", "CascadeClassifier", "getOriginalWindowSize", {}, getOriginalWindowSize);
	Nan::SetPrototypeMethod(ctor, "getOriginalWindowSize", cascadeclassifier_general_callback::callback);
//	getOriginalWindowSize() : _types.Size;

	overload->addOverload("cascadeclassifier", "CascadeClassifier", "getFeatureType", {}, getFeatureType);
	Nan::SetPrototypeMethod(ctor, "getFeatureType", cascadeclassifier_general_callback::callback);
//	getFeatureType() : _st.int;
//
//	//getOldCascade(): any; //??????
//
	overload->addOverload("cascadeclassifier", "CascadeClassifier", "convert", {make_param<std::string>("oldcascade","String"), make_param<std::string>("newcascade","String")}, convert);
	Nan::SetPrototypeMethod(ctor, "convert", cascadeclassifier_general_callback::callback);
//	convert(oldcascade: string, newcascade : string) : boolean;
//
//	//setMaskGenerator(const Ptr<BaseCascadeClassifier::MaskGenerator>& maskGenerator) : void;
//	//Ptr<BaseCascadeClassifier::MaskGenerator> getMaskGenerator();
//
//	//Ptr<BaseCascadeClassifier> cc;
//};
//
//export var CascadeClassifier : CascadeClassifierStatic = alvision_module.CascadeClassifier;



target->Set(Nan::New("CascadeClassifier").ToLocalChecked(), ctor->GetFunction());

}

v8::Local<v8::Function> CascadeClassifier::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}

//std::shared_ptr<CascadeClassifier> CascadeClassifier::create() {
//	auto ret = std::make_shared<CascadeClassifier>();
//	ret->_algorithm = cv::makePtr<cv::CascadeClassifier>();
//	return ret;
//}

POLY_METHOD(CascadeClassifier::New) {
	auto ret = new CascadeClassifier();
	ret->_cascadeClassifier = std::make_shared<cv::CascadeClassifier>();

	ret->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}


POLY_METHOD(CascadeClassifier::New_file){
	auto ret = new CascadeClassifier();
	ret->_cascadeClassifier = std::make_shared<cv::CascadeClassifier>(info.at<std::string>(0));

	ret->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(CascadeClassifier::empty){
	auto this_ = info.This<CascadeClassifier*>();
	auto ret = this_->_cascadeClassifier->empty();
	info.SetReturnValue(ret);
}
POLY_METHOD(CascadeClassifier::load){
	auto this_ = info.This<CascadeClassifier*>();
	auto ret = this_->_cascadeClassifier->load(info.at<std::string>(0));
	info.SetReturnValue(ret);
}
POLY_METHOD(CascadeClassifier::read){
	auto this_ = info.This<CascadeClassifier*>();
	auto node = *info.at<FileNode*>(0)->_fileNode;
	auto ret = this_->_cascadeClassifier->read(node);
	info.SetReturnValue(ret);
}
POLY_METHOD(CascadeClassifier::detectMultiScale){
	auto this_ = info.This<CascadeClassifier*>();

	auto image				= info.at<IOArray*>(0)->GetInputArray();
	auto cb					= info.at<std::shared_ptr<overres::Callback>>(1);// : (objects : Array<_types.Rect>,rejectLevels : Array<_st.int>,levelWeights : Array<_st.double>) = >void,
	auto scaleFactor		= info.at<double>(2);
	auto minNeighbors		= info.at<int>(3);
	auto flags				= info.at<int>(4);
	auto minSize			= *info.at<Size*>(5)->_size;
	auto maxSize			= *info.at<Size*>(6)->_size;
	auto outputRejectLevels = info.at<bool>(7);

	auto objects = std::make_shared<std::vector<cv::Rect>>();
	auto reject_levels = std::make_shared<std::vector<int>>();
	auto level_weights = std::make_shared<std::vector<double>>();

	this_->_cascadeClassifier->detectMultiScale(image, *objects, *reject_levels, *level_weights, scaleFactor, minNeighbors, flags, minSize, maxSize, outputRejectLevels);

	auto v8_objects = std::make_shared<std::vector<Rect*>>();
	std::transform(std::begin(*objects), std::end(*objects), std::back_inserter(*v8_objects), [](const cv::Rect& val) {
		auto rec = new Rect();
		rec->_rect = std::make_shared <cv::Rect>(val);
		return rec;
	});

	cb->Call({overres::make_value(v8_objects), overres::make_value(reject_levels), overres::make_value(level_weights)});
}
POLY_METHOD(CascadeClassifier::isOldFormatCascade){
	auto this_ = info.This<CascadeClassifier*>();
	auto ret = this_->_cascadeClassifier->isOldFormatCascade();
	info.SetReturnValue(ret);
}
POLY_METHOD(CascadeClassifier::getOriginalWindowSize){
	auto this_ = info.This<CascadeClassifier*>();
	auto windowSize = this_->_cascadeClassifier->getOriginalWindowSize();
	auto ret = new Size();
	ret->_size = std::make_shared<cv::Size>(windowSize);
	info.SetReturnValue(ret);
}
POLY_METHOD(CascadeClassifier::getFeatureType){
	auto this_ = info.This<CascadeClassifier*>();
	auto ret = this_->_cascadeClassifier->getFeatureType();
	info.SetReturnValue(ret);
}
POLY_METHOD(CascadeClassifier::convert){
	auto this_ = info.This<CascadeClassifier*>();
	auto ret = this_->_cascadeClassifier->convert(info.at<std::string>(0), info.at<std::string>(1));
	info.SetReturnValue(ret);
}

