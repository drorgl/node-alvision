#include "CascadeClassifier.h"
#include "../IOArray.h"
#include "../types/Size.h"
#include "../persistence/FileNode.h"

namespace cascadeclassifier_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("cascadeclassifier_general_callback is empty");
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
	overload->addOverload("cascadeclassifier", "CascadeClassifier","", {}, empty);
//	empty() : boolean;
//	/** @brief Loads a classifier from a file.
//
//	@param filename Name of the file from which the classifier is loaded. The file may contain an old
//	HAAR classifier trained by the haartraining application or a new cascade classifier trained by the
//	traincascade application.
//	*/
	overload->addOverload("cascadeclassifier", "CascadeClassifier", "load", {make_param<std::string>("filename","String")}, load);
//	load(filename : string) : boolean;
//	/** @brief Reads a classifier from a FileStorage node.
//
//	@note The file may contain a new cascade classifier (trained traincascade application) only.
//	*/
	overload->addOverload("cascadeclassifier", "CascadeClassifier", "read", {make_param<FileNode*>("node","FileNode")}, read);
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
//	isOldFormatCascade() : boolean;

	overload->addOverload("cascadeclassifier", "CascadeClassifier", "getOriginalWindowSize", {}, getOriginalWindowSize);
//	getOriginalWindowSize() : _types.Size;

	overload->addOverload("cascadeclassifier", "CascadeClassifier", "getFeatureType", {}, getFeatureType);
//	getFeatureType() : _st.int;
//
//	//getOldCascade(): any; //??????
//
	overload->addOverload("cascadeclassifier", "CascadeClassifier", "convert", {make_param<std::string>("oldcascade","String"), make_param<std::string>("newcascade","String")}, convert);
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
	//ret->_algorithm = cv::makePtr<cv::CascadeClassifier>();

	ret->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}


POLY_METHOD(CascadeClassifier::New_file){throw std::exception("not implemented");}
POLY_METHOD(CascadeClassifier::empty){throw std::exception("not implemented");}
POLY_METHOD(CascadeClassifier::load){throw std::exception("not implemented");}
POLY_METHOD(CascadeClassifier::read){throw std::exception("not implemented");}
POLY_METHOD(CascadeClassifier::detectMultiScale){throw std::exception("not implemented");}
POLY_METHOD(CascadeClassifier::isOldFormatCascade){throw std::exception("not implemented");}
POLY_METHOD(CascadeClassifier::getOriginalWindowSize){throw std::exception("not implemented");}
POLY_METHOD(CascadeClassifier::getFeatureType){throw std::exception("not implemented");}
POLY_METHOD(CascadeClassifier::convert){throw std::exception("not implemented");}

