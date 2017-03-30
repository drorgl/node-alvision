#include "BaseCascadeClassifier.h"
#include "../IOArray.h"
#include "../types/Size.h"

namespace basecascadeclassifier_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("hogdescriptor_general_callback is empty");
		}
		return overload->execute("basecascadeclassifier", info);
	}
}

Nan::Persistent<FunctionTemplate> BaseCascadeClassifier::constructor;

void
BaseCascadeClassifier::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	basecascadeclassifier_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(basecascadeclassifier_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("BaseCascadeClassifier").ToLocalChecked());
	ctor->Inherit(Nan::New(Algorithm::constructor));

	overload->register_type<BaseCascadeClassifier>(ctor, "basecascadeclassifier", "BaseCascadeClassifier");


	overload->addOverloadConstructor("basecascadeclassifier", "BaseCascadeClassifier", {}, New);

//interface BaseCascadeClassifier extends _core.Algorithm
//{
//	//public:
//	//    virtual ~BaseCascadeClassifier();
	overload->addOverload("basecascadeclassifier", "BaseCascadeClassifier", "empty", {}, empty);
//bool empty() const = 0;

overload->addOverload("basecascadeclassifier", "BaseCascadeClassifier", "load", {make_param<std::string>("filename","String")}, load);
//bool load( const String& filename ) = 0;


//void detectMultiScale( InputArray image,
//               CV_OUT std::vector<Rect>& objects,
//               double scaleFactor,
//               int minNeighbors, int flags,
//               Size minSize, Size maxSize ) = 0;
//
//
//void detectMultiScale( InputArray image,
//               CV_OUT std::vector<Rect>& objects,
//               CV_OUT std::vector<int>& numDetections,
//               double scaleFactor,
//               int minNeighbors, int flags,
//               Size minSize, Size maxSize ) = 0;

overload->addOverload("basecascadeclassifier", "BaseCascadeClassifier", "detectMultiScale", {
	make_param<IOArray*>("image","InputArray"),
	make_param<std::shared_ptr<overres::Callback>>("cb","Function"),
	//make_param<std::shared_ptr<std::vector<Rect*>>>( "objects","Array<Rect>"),
	//make_param<std::shared_ptr<std::vector<int>>>(   "rejectLevels","Array<int>"),
	//make_param<std::shared_ptr<std::vector<double>>>("levelWeights","Array<double>")
	make_param<double>("scaleFactor","double"),
	make_param<int>("minNeighbors","int"),
	make_param<int>("flags","int"),
	make_param<Size*>("minSize",Size::name),
	make_param<Size*>("maxSize",Size::name),
	make_param<bool>("outputRejectLevels","bool")
}, detectMultiScale);
//void detectMultiScale( InputArray image,
//                       CV_OUT std::vector<Rect>& objects,
//                       CV_OUT std::vector<int>& rejectLevels,
//                       CV_OUT std::vector<double>& levelWeights,
//                       double scaleFactor,
//                       int minNeighbors, int flags,
//                       Size minSize, Size maxSize,
//                       bool outputRejectLevels ) = 0;

overload->addOverload("basecascadeclassifier", "BaseCascadeClassifier", "isOldFormatCascade", {}, isOldFormatCascade);
//bool isOldFormatCascade() const = 0;

overload->addOverload("basecascadeclassifier", "BaseCascadeClassifier", "getOriginalWindowSize", {}, getOriginalWindowSize);
//Size getOriginalWindowSize() const = 0;

overload->addOverload("basecascadeclassifier", "BaseCascadeClassifier", "getFeatureType", {}, getFeatureType);
//int getFeatureType() const = 0;

overload->addOverload("basecascadeclassifier", "BaseCascadeClassifier", "getOldCascade", {}, getOldCascade);
//void* getOldCascade() = 0;
//	//
//	//    class CV_EXPORTS MaskGenerator
//	//    {
//	//    public:
//	//        virtual ~MaskGenerator() {}
//	//        virtual Mat generateMask(const Mat& src)=0;
//	//        virtual void initializeMask(const Mat& /*src*/) { }
//	//    };

//overload->addOverload("basecascadeclassifier", "BaseCascadeClassifier", "setMaskGenerator", {make_param<MaskGenerator*>("maskGenerator","MaskGenerator")}, setMaskGenerator);
//virtual void setMaskGenerator(const Ptr<MaskGenerator>& maskGenerator) = 0;

//overload->addOverload("basecascadeclassifier", "BaseCascadeClassifier", "getMaskGenerator", {}, getMaskGenerator);
//virtual Ptr<MaskGenerator> getMaskGenerator() = 0;
//};


target->Set(Nan::New("BaseCascadeClassifier").ToLocalChecked(), ctor->GetFunction());

}

v8::Local<v8::Function> BaseCascadeClassifier::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}

//std::shared_ptr<BaseCascadeClassifier> BaseCascadeClassifier::create() {
//	auto ret = std::make_shared<BaseCascadeClassifier>();
//	ret->_algorithm = cv::makePtr<cv::BaseCascadeClassifier>();
//	return ret;
//}

POLY_METHOD(BaseCascadeClassifier::New) {
	auto ret = new BaseCascadeClassifier();
	//ret->_algorithm = cv::makePtr<cv::BaseCascadeClassifier>();

	ret->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}


POLY_METHOD(BaseCascadeClassifier::empty){throw std::runtime_error("not implemented");}
POLY_METHOD(BaseCascadeClassifier::load){throw std::runtime_error("not implemented");}
POLY_METHOD(BaseCascadeClassifier::detectMultiScale){throw std::runtime_error("not implemented");}
POLY_METHOD(BaseCascadeClassifier::isOldFormatCascade){throw std::runtime_error("not implemented");}
POLY_METHOD(BaseCascadeClassifier::getOriginalWindowSize){throw std::runtime_error("not implemented");}
POLY_METHOD(BaseCascadeClassifier::getFeatureType){throw std::runtime_error("not implemented");}
POLY_METHOD(BaseCascadeClassifier::getOldCascade){throw std::runtime_error("not implemented");}

