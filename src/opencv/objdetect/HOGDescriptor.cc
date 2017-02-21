#include "HOGDescriptor.h"
#include "../types/Size.h"
#include "../types/Rect.h"
#include "../persistence/FileNode.h"
#include "../persistence/FileStorage.h"
#include "../types/Point.h"
#include "DetectionROI.h"
#include  <iterator>

namespace hogdescriptor_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("hogdescriptor_general_callback is empty");
		}
		return overload->execute("hogdescriptor", info);
	}
}

Nan::Persistent<FunctionTemplate> HOGDescriptor::constructor;

std::string HOGDescriptor::name = "HOGDescriptor";

void
HOGDescriptor::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	hogdescriptor_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(hogdescriptor_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("HOGDescriptor").ToLocalChecked());
	

	overload->register_type<HOGDescriptor>(ctor, "hogdescriptor", "HOGDescriptor");

	target->Set(Nan::New("L2Hys").ToLocalChecked(), Nan::New(cv::HOGDescriptor::L2Hys));
	target->Set(Nan::New("DEFAULT_NLEVELS").ToLocalChecked(), Nan::New(cv::HOGDescriptor::DEFAULT_NLEVELS));



//interface HOGDescriptor
//{
	//public:
	//    enum { L2Hys = 0
	//         };
	//    enum { DEFAULT_NLEVELS = 64
	//         };
	//
	overload->addOverloadConstructor("hogdescriptor", "HOGDescriptor", {}, New);
	//    CV_WRAP HOGDescriptor() : winSize(64,128), blockSize(16,16), blockStride(8,8),
	//        cellSize(8,8), nbins(9), derivAperture(1), winSigma(-1),
	//        histogramNormType(HOGDescriptor::L2Hys), L2HysThreshold(0.2), gammaCorrection(true),
	//        free_coef(-1.f), nlevels(HOGDescriptor::DEFAULT_NLEVELS), signedGradient(false)
	//    {}
	//
	overload->addOverloadConstructor("hogdescriptor", "HOGDescriptor", {
		make_param<Size*>("winSize",Size::name),
		make_param<Size*>("blockSize",Size::name),
		make_param<Size*>("blockStride",Size::name),
		make_param<Size*>("cellSize",Size::name),
		make_param<int>("_nbins","int"),
		make_param<int>("derivAperture","int",1),
		make_param<double>("winSigma","double",-1),
		make_param<int>("histogramNormType","int",cv::HOGDescriptor::L2Hys),
		make_param<double>("L2HysThreshold","double",0.2),
		make_param<bool>("gammaCorrection","bool",false),
		make_param<int>("nlevels","int",cv::HOGDescriptor::DEFAULT_NLEVELS),
		make_param<bool>("signedGradient","bool",false)
	}, New_full);
	//    CV_WRAP HOGDescriptor(Size _winSize, Size _blockSize, Size _blockStride,
	//                  Size _cellSize, int _nbins, int _derivAperture=1, double _winSigma=-1,
	//                  int _histogramNormType=HOGDescriptor::L2Hys,
	//                  double _L2HysThreshold=0.2, bool _gammaCorrection=false,
	//                  int _nlevels=HOGDescriptor::DEFAULT_NLEVELS, bool _signedGradient=false)
	//    : winSize(_winSize), blockSize(_blockSize), blockStride(_blockStride), cellSize(_cellSize),
	//    nbins(_nbins), derivAperture(_derivAperture), winSigma(_winSigma),
	//    histogramNormType(_histogramNormType), L2HysThreshold(_L2HysThreshold),
	//    gammaCorrection(_gammaCorrection), free_coef(-1.f), nlevels(_nlevels), signedGradient(_signedGradient)
	//    {}
	//
	overload->addOverloadConstructor("hogdescriptor", "HOGDescriptor", {make_param<std::string>("filename","String")}, New_file);
	//    CV_WRAP HOGDescriptor(const String& filename)
	//    {
	//        load(filename);
	//    }
	//
	//    HOGDescriptor(const HOGDescriptor& d)
	//    {
	//        d.copyTo(*this);
	//    }
	//
	//    virtual ~HOGDescriptor() {}
	//
	overload->addOverload("hogdescriptor", "HOGDescriptor","getDescriptorSize", {}, getDescriptorSize);
	Nan::SetPrototypeMethod(ctor, "getDescriptorSize", hogdescriptor_general_callback::callback);
	//    CV_WRAP size_t getDescriptorSize() const;

	overload->addOverload("hogdescriptor", "HOGDescriptor", "checkDetectorSize", {}, checkDetectorSize);
	Nan::SetPrototypeMethod(ctor, "checkDetectorSize", hogdescriptor_general_callback::callback);
	//    CV_WRAP bool checkDetectorSize() const;

	overload->addOverload("hogdescriptor", "HOGDescriptor", "getWinSigma", {}, getWinSigma);
	Nan::SetPrototypeMethod(ctor, "getWinSigma", hogdescriptor_general_callback::callback);
	//    CV_WRAP double getWinSigma() const;
	//

	overload->addOverload("hogdescriptor", "HOGDescriptor", "setSVMDetector", {make_param<IOArray*>("svmdetector","InputArray")}, setSVMDetector_ioarray);
	overload->addOverload("hogdescriptor", "HOGDescriptor", "setSVMDetector", { make_param<std::shared_ptr<std::vector<float>>>("svmdetector","Array<float>") }, setSVMDetector_float);
	Nan::SetPrototypeMethod(ctor, "setSVMDetector", hogdescriptor_general_callback::callback);
	//    CV_WRAP virtual void setSVMDetector(InputArray _svmdetector);
	//

	overload->addOverload("hogdescriptor", "HOGDescriptor", "read", {make_param<FileNode*>("fn",FileNode::name)}, read);
	Nan::SetPrototypeMethod(ctor, "read", hogdescriptor_general_callback::callback);
	//    virtual bool read(FileNode& fn);

	overload->addOverload("hogdescriptor", "HOGDescriptor", "write", {
		make_param<FileStorage*>("fs",FileStorage::name),
		make_param<std::string>("objname","String")
	}, write);
	Nan::SetPrototypeMethod(ctor, "write", hogdescriptor_general_callback::callback);
	//    virtual void write(FileStorage& fs, const String& objname) const;
	//

	overload->addOverload("hogdescriptor", "HOGDescriptor", "load", {
		make_param<std::string>("filename","String"),
		make_param<std::string>("objname","String","")
	}, load);
	Nan::SetPrototypeMethod(ctor, "load", hogdescriptor_general_callback::callback);
	//    CV_WRAP virtual bool load(const String& filename, const String& objname = String());

	overload->addOverload("hogdescriptor", "HOGDescriptor", "save", {
		make_param<std::string>("filename","String"),
		make_param<std::string>("objname","String","")
	}, save);
	Nan::SetPrototypeMethod(ctor, "save", hogdescriptor_general_callback::callback);
	//    CV_WRAP virtual void save(const String& filename, const String& objname = String()) const;

	overload->addOverload("hogdescriptor", "HOGDescriptor", "copyTo", {
		make_param<HOGDescriptor*>("c",HOGDescriptor::name)
	}, copyTo);
	Nan::SetPrototypeMethod(ctor, "copyTo", hogdescriptor_general_callback::callback);
	//    virtual void copyTo(HOGDescriptor& c) const;
	//

	overload->addOverload("hogdescriptor", "HOGDescriptor", "compute", {
		make_param<IOArray*>("img","InputArray"),
		make_param<std::shared_ptr<or::Callback>>("cb","Function"),//"CV_OUT std::vector<float>& descriptors,
		make_param<Size*>("winStride",Size::name,Size::create()), 
		make_param<Size*>("padding",Size::name,Size::create()),
		make_param<std::shared_ptr<std::vector<Point*>>>("locations","Array<Point>",nullptr)
	}, compute);
	Nan::SetPrototypeMethod(ctor, "compute", hogdescriptor_general_callback::callback);
	//    CV_WRAP virtual void compute(InputArray img,
	//                         CV_OUT std::vector<float>& descriptors,
	//                         Size winStride = Size(), Size padding = Size(),
	//                         const std::vector<Point>& locations = std::vector<Point>()) const;
	//
	//    //! with found weights output

	overload->addOverload("hogdescriptor", "HOGDescriptor", "detect", {
		make_param<Matrix*>("img",Matrix::name),
		make_param<std::shared_ptr<or::Callback>>("cb","Function"),//"CV_OUT std::vector<Point>& foundLocations,CV_OUT std::vector<double>& weights,
		make_param<double>("hitThreshold","double", 0),
		make_param<Size*>("winStride",Size ::name,Size::create()),
		make_param<Size*>("padding",Size ::name,Size::create()),
		make_param<std::shared_ptr<std::vector<Point*>>>("searchLocations","Array<Point>" ,nullptr)
	}, detect);
	Nan::SetPrototypeMethod(ctor, "detect", hogdescriptor_general_callback::callback);
	//    CV_WRAP virtual void detect(const Mat& img, CV_OUT std::vector<Point>& foundLocations,
	//                        CV_OUT std::vector<double>& weights,
	//                        double hitThreshold = 0, Size winStride = Size(),
	//                        Size padding = Size(),
	//                        const std::vector<Point>& searchLocations = std::vector<Point>()) const;
	//    //! without found weights output

	//overload->addOverload("hogdescriptor", "HOGDescriptor", "detect", {}, detect);
	//    virtual void detect(const Mat& img, CV_OUT std::vector<Point>& foundLocations,
	//                        double hitThreshold = 0, Size winStride = Size(),
	//                        Size padding = Size(),
	//                        const std::vector<Point>& searchLocations=std::vector<Point>()) const;
	//
	//    //! with result weights output

	overload->addOverload("hogdescriptor", "HOGDescriptor", "detectMultiScale", {
		make_param<IOArray*>("img","InputArray"),
		make_param<std::shared_ptr<or::Callback>>("cb","Function"),//CV_OUT std::vector<Rect>& foundLocations,CV_OUT std::vector<double>& foundWeights,
		make_param<double>("hitThreshold","double", 0),
		make_param<Size*>("winStride",Size ::name, Size::create()),
		make_param<Size*>("padding",Size ::name, Size::create()),
		make_param<double>("scale","double", 1.05),
		make_param<double>("finalThreshold","double", 2.0),
		make_param<bool>("useMeanshiftGrouping","bool", false)
	}, detectMultiScale);
	Nan::SetPrototypeMethod(ctor, "detectMultiScale", hogdescriptor_general_callback::callback);
	//    CV_WRAP virtual void detectMultiScale(InputArray img, CV_OUT std::vector<Rect>& foundLocations,
	//                                  CV_OUT std::vector<double>& foundWeights, double hitThreshold = 0,
	//                                  Size winStride = Size(), Size padding = Size(), double scale = 1.05,
	//                                  double finalThreshold = 2.0,bool useMeanshiftGrouping = false) const;
	//    //! without found weights output
	//    virtual void detectMultiScale(InputArray img, CV_OUT std::vector<Rect>& foundLocations,
	//                                  double hitThreshold = 0, Size winStride = Size(),
	//                                  Size padding = Size(), double scale = 1.05,
	//                                  double finalThreshold = 2.0, bool useMeanshiftGrouping = false) const;
	//

	overload->addOverload("hogdescriptor", "HOGDescriptor", "computeGradient", {
		make_param<Matrix*>("img",Matrix::name),
		make_param<Matrix*>("grad",Matrix::name),
		make_param<Matrix*>("angleOfs",Matrix::name),
		make_param<Size*>("paddingTL",Size::name, Size::create()),
		make_param<Size*>("paddingBR",Size::name, Size::create())
	}, computeGradient);
	Nan::SetPrototypeMethod(ctor, "computeGradient", hogdescriptor_general_callback::callback);
	//    CV_WRAP virtual void computeGradient(const Mat& img, CV_OUT Mat& grad, CV_OUT Mat& angleOfs,
	//                                 Size paddingTL = Size(), Size paddingBR = Size()) const;
	//

	overload->addStaticOverload("hogdescriptor", "HOGDescriptor", "getDefaultPeopleDetector", {}, getDefaultPeopleDetector);
	Nan::SetMethod(ctor, "getDefaultPeopleDetector", hogdescriptor_general_callback::callback);
	//    CV_WRAP static std::vector<float> getDefaultPeopleDetector();
	overload->addStaticOverload("hogdescriptor", "HOGDescriptor", "getDaimlerPeopleDetector", {}, getDaimlerPeopleDetector);
	Nan::SetMethod(ctor, "getDaimlerPeopleDetector", hogdescriptor_general_callback::callback);
	//    CV_WRAP static std::vector<float> getDaimlerPeopleDetector();
	//


	//    CV_PROP Size winSize;
	Nan::SetAccessor(itpl, Nan::New("winSize").ToLocalChecked(), winSize_getter, winSize_setter);


	//    CV_PROP Size blockSize;
	Nan::SetAccessor(itpl, Nan::New("blockSize").ToLocalChecked(), blockSize_getter, blockSize_setter);

	//    CV_PROP Size blockStride;
	Nan::SetAccessor(itpl, Nan::New("blockStride").ToLocalChecked(), blockStride_getter, blockStride_setter);

	//    CV_PROP Size cellSize;
	Nan::SetAccessor(itpl, Nan::New("cellSize").ToLocalChecked(), cellSize_getter, cellSize_setter);

	//    CV_PROP int nbins;
	Nan::SetAccessor(itpl, Nan::New("nbins").ToLocalChecked(), nbins_getter, nbins_setter);

	//    CV_PROP int derivAperture;
	Nan::SetAccessor(itpl, Nan::New("derivAperture").ToLocalChecked(), derivAperture_getter, derivAperture_setter);

	//    CV_PROP double winSigma;
	Nan::SetAccessor(itpl, Nan::New("winSigma").ToLocalChecked(), winSigma_getter, winSigma_setter);

	//    CV_PROP int histogramNormType;
	Nan::SetAccessor(itpl, Nan::New("histogramNormType").ToLocalChecked(), histogramNormType_getter, histogramNormType_setter);

	//    CV_PROP double L2HysThreshold;
	Nan::SetAccessor(itpl, Nan::New("L2HysThreshold").ToLocalChecked(), L2HysThreshold_getter, L2HysThreshold_setter);

	//    CV_PROP bool gammaCorrection;
	Nan::SetAccessor(itpl, Nan::New("gammaCorrection").ToLocalChecked(), gammaCorrection_getter, gammaCorrection_setter);

	//    CV_PROP std::vector<float> svmDetector;
	Nan::SetAccessor(itpl, Nan::New("svmDetector").ToLocalChecked(), svmDetector_getter, svmDetector_setter);

	//    UMat oclSvmDetector;
	Nan::SetAccessor(itpl, Nan::New("oclSvmDetector").ToLocalChecked(), oclSvmDetector_getter, oclSvmDetector_setter);

	//    float free_coef;
	Nan::SetAccessor(itpl, Nan::New("free_coef").ToLocalChecked(), free_coef_getter, free_coef_setter);

	//    CV_PROP int nlevels;
	Nan::SetAccessor(itpl, Nan::New("nlevels").ToLocalChecked(), nlevels_getter, nlevels_setter);

	//    CV_PROP bool signedGradient;
	Nan::SetAccessor(itpl, Nan::New("signedGradient").ToLocalChecked(), signedGradient_getter, signedGradient_setter);

	//
	//
	//    //! evaluate specified ROI and return confidence value for each location
	overload->addOverload("hogdescriptor", "HOGDescriptor", "detectROI", {
		make_param<Matrix*>("img",Matrix::name),
		make_param<std::shared_ptr<std::vector<Point*>>>("locations","Array<Point>"),
		make_param<std::shared_ptr<or::Callback>>("cb","Function"),//CV_OUT std::vector<cv::Point>& foundLocations, CV_OUT std::vector<double>& confidences,
		make_param<double>("hitThreshold","double", 0),
		make_param<Size*>("winStride",Size::name, Size::create()),
		make_param<Size*>("padding",Size::name,Size::create()),
	}, detectROI);
	Nan::SetPrototypeMethod(ctor, "detectROI", hogdescriptor_general_callback::callback);
	//    virtual void detectROI(const cv::Mat& img, const std::vector<cv::Point> &locations,
	//                                   CV_OUT std::vector<cv::Point>& foundLocations, CV_OUT std::vector<double>& confidences,
	//                                   double hitThreshold = 0, cv::Size winStride = Size(),
	//                                   cv::Size padding = Size()) const;
	//
	//    //! evaluate specified ROI and return confidence value for each location in multiple scales
	overload->addOverload("hogdescriptor", "HOGDescriptor", "detectMultiScaleROI", {
		make_param<Matrix*>("img",Matrix::name),
		make_param<std::shared_ptr<or::Callback>>("cb","Function"),//"CV_OUT std::vector<cv::Rect>& foundLocations,
		make_param<std::shared_ptr<std::vector<DetectionROI*>>>("locations","Array<DetectionROI>"),
		make_param<double>("hitThreshold","double", 0),
		make_param<int>("groupThreshold","int", 0)
	}, detectMultiScaleROI);
	Nan::SetPrototypeMethod(ctor, "detectMultiScaleROI", hogdescriptor_general_callback::callback);
	//    virtual void detectMultiScaleROI(const cv::Mat& img,
	//                                                       CV_OUT std::vector<cv::Rect>& foundLocations,
	//                                                       std::vector<DetectionROI>& locations,
	//                                                       double hitThreshold = 0,
	//                                                       int groupThreshold = 0) const;
	//
	//    //! read/parse Dalal's alt model file
	overload->addOverload("hogdescriptor", "HOGDescriptor", "readALTModel", {make_param<std::string>("modelfile","String")}, readALTModel);
	Nan::SetPrototypeMethod(ctor, "readALTModel", hogdescriptor_general_callback::callback);
	//    void readALTModel(String modelfile);

	overload->addOverload("hogdescriptor", "HOGDescriptor", "groupRectangles", {
		make_param<std::shared_ptr<std::vector<Rect*>>>( "rectList","Array<Rect>"),
		make_param<std::shared_ptr<std::vector<double>>>("weights","Array<double>"),
		make_param<int>("groupThreshold","int"),
		make_param<double>("eps","double")
	}, groupRectangles);
	Nan::SetPrototypeMethod(ctor, "groupRectangles", hogdescriptor_general_callback::callback);
	//    void groupRectangles(std::vector<cv::Rect>& rectList, std::vector<double>& weights, int groupThreshold, double eps) const;
//};


target->Set(Nan::New("HOGDescriptor").ToLocalChecked(), ctor->GetFunction());

}

v8::Local<v8::Function> HOGDescriptor::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}

//std::shared_ptr<CascadeClassifier> CascadeClassifier::create() {
//	auto ret = std::make_shared<CascadeClassifier>();
//	ret->_algorithm = cv::makePtr<cv::CascadeClassifier>();
//	return ret;
//}

POLY_METHOD(HOGDescriptor::New) {
	auto ret = new HOGDescriptor();
	ret->_hogDescriptor = std::make_shared<cv::HOGDescriptor>();

	ret->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}




POLY_METHOD(HOGDescriptor::New_full){
	auto winSize		   = *info.at<Size*>(0)->_size;
	auto blockSize		   = *info.at<Size*>(1)->_size;
	auto blockStride	   = *info.at<Size*>(2)->_size;
	auto cellSize		   = *info.at<Size*>(3)->_size;
	auto nbins			   = info.at<int>(4);
	auto derivAperture	   = info.at<int>(5);
	auto winSigma		   = info.at<double>(6);
	auto histogramNormType = info.at<int>(7);
	auto L2HysThreshold		= info.at<double>(8);
	auto gammaCorrection	= info.at<bool>(9);
	auto nlevels			= info.at<int>(10);
	auto signedGradient		= info.at<bool>(11);



	auto ret = new HOGDescriptor();
	ret->_hogDescriptor = std::make_shared<cv::HOGDescriptor>(
		winSize					,
		blockSize 				,
		blockStride 			,
		cellSize 				,
		nbins 					,
		derivAperture 			,
		winSigma 				,
		histogramNormType 		,
		L2HysThreshold			,
		gammaCorrection			,
		nlevels					,
		signedGradient);

	ret->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(HOGDescriptor::New_file){
	auto ret = new HOGDescriptor();
	ret->_hogDescriptor = std::make_shared<cv::HOGDescriptor>(info.at<std::string>(0));

	ret->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(HOGDescriptor::getDescriptorSize){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::checkDetectorSize){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::getWinSigma){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::setSVMDetector_ioarray) { throw std::exception("not implemented"); }
POLY_METHOD(HOGDescriptor::setSVMDetector_float) { 
	auto this_ = info.This<HOGDescriptor*>();
	auto detector = info.at< std::shared_ptr<std::vector<float>>>(0);

	this_->_hogDescriptor->setSVMDetector(*detector);

}
POLY_METHOD(HOGDescriptor::read){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::write){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::load){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::save){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::copyTo){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::compute){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::detect){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::detectMultiScale){
		auto img					= info.at<IOArray*>(0)->GetInputArray();
		auto cb						= info.at<std::shared_ptr< or ::Callback>>(1);
		auto hitThreshold			= info.at<double>(2);
		auto winStride				= *info.at<Size*>(3)->_size;
		auto padding				= *info.at<Size*>(4)->_size;
		auto scale					= info.at<double>(5);
		auto finalThreshold			= info.at<double>(6);
		auto useMeanshiftGrouping	= info.at<bool>(7);

		auto this_ = info.This<HOGDescriptor*>();
		std::vector<cv::Rect> rect;
		auto weights = std::make_shared<std::vector<double>>();
		this_->_hogDescriptor->detectMultiScale(img, rect, *weights, hitThreshold, winStride, padding, scale, finalThreshold, useMeanshiftGrouping);

		auto v8_rect = std::make_shared<std::vector<Rect*>>() ;
		std::transform(std::begin(rect), std::end(rect), std::back_inserter(*v8_rect), [](const cv::Rect& pt) {
			auto rec = new Rect();
			rec->_rect = std::make_shared <cv::Rect>( pt);
			return rec;
		});


		cb->Call({ or::make_value(v8_rect), or::make_value(weights) });


}
POLY_METHOD(HOGDescriptor::computeGradient){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::getDefaultPeopleDetector){
	auto res = std::make_shared<std::vector<float>>(cv::HOGDescriptor::getDefaultPeopleDetector());

	info.SetReturnValue(res);
}
POLY_METHOD(HOGDescriptor::getDaimlerPeopleDetector){throw std::exception("not implemented");}

NAN_GETTER(HOGDescriptor::winSize_getter){return Nan::ThrowError("not implemented");}
NAN_SETTER(HOGDescriptor::winSize_setter){return Nan::ThrowError("not implemented");}
NAN_GETTER(HOGDescriptor::blockSize_getter){return Nan::ThrowError("not implemented");}
NAN_SETTER(HOGDescriptor::blockSize_setter){return Nan::ThrowError("not implemented");}
NAN_GETTER(HOGDescriptor::blockStride_getter){return Nan::ThrowError("not implemented");}
NAN_SETTER(HOGDescriptor::blockStride_setter){return Nan::ThrowError("not implemented");}
NAN_GETTER(HOGDescriptor::cellSize_getter){return Nan::ThrowError("not implemented");}
NAN_SETTER(HOGDescriptor::cellSize_setter){return Nan::ThrowError("not implemented");}
NAN_GETTER(HOGDescriptor::nbins_getter){return Nan::ThrowError("not implemented");}
NAN_SETTER(HOGDescriptor::nbins_setter){return Nan::ThrowError("not implemented");}
NAN_GETTER(HOGDescriptor::derivAperture_getter){return Nan::ThrowError("not implemented");}
NAN_SETTER(HOGDescriptor::derivAperture_setter){return Nan::ThrowError("not implemented");}
NAN_GETTER(HOGDescriptor::winSigma_getter){return Nan::ThrowError("not implemented");}
NAN_SETTER(HOGDescriptor::winSigma_setter){return Nan::ThrowError("not implemented");}
NAN_GETTER(HOGDescriptor::histogramNormType_getter){return Nan::ThrowError("not implemented");}
NAN_SETTER(HOGDescriptor::histogramNormType_setter){return Nan::ThrowError("not implemented");}
NAN_GETTER(HOGDescriptor::L2HysThreshold_getter){return Nan::ThrowError("not implemented");}
NAN_SETTER(HOGDescriptor::L2HysThreshold_setter){return Nan::ThrowError("not implemented");}
NAN_GETTER(HOGDescriptor::gammaCorrection_getter){return Nan::ThrowError("not implemented");}
NAN_SETTER(HOGDescriptor::gammaCorrection_setter){return Nan::ThrowError("not implemented");}
NAN_GETTER(HOGDescriptor::svmDetector_getter){return Nan::ThrowError("not implemented");}
NAN_SETTER(HOGDescriptor::svmDetector_setter){return Nan::ThrowError("not implemented");}
NAN_GETTER(HOGDescriptor::oclSvmDetector_getter){return Nan::ThrowError("not implemented");}
NAN_SETTER(HOGDescriptor::oclSvmDetector_setter){return Nan::ThrowError("not implemented");}
NAN_GETTER(HOGDescriptor::free_coef_getter){return Nan::ThrowError("not implemented");}
NAN_SETTER(HOGDescriptor::free_coef_setter){return Nan::ThrowError("not implemented");}
NAN_GETTER(HOGDescriptor::nlevels_getter){
	auto this_ = or ::ObjectWrap::Unwrap<HOGDescriptor>(info.This());
	info.GetReturnValue().Set(this_->_hogDescriptor->nlevels);
}
NAN_SETTER(HOGDescriptor::nlevels_setter){
	auto this_ = or ::ObjectWrap::Unwrap<HOGDescriptor>(info.This());
	this_->_hogDescriptor->nlevels = value->IntegerValue();
}
NAN_GETTER(HOGDescriptor::signedGradient_getter){return Nan::ThrowError("not implemented");}
NAN_SETTER(HOGDescriptor::signedGradient_setter){return Nan::ThrowError("not implemented");}

POLY_METHOD(HOGDescriptor::detectROI){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::detectMultiScaleROI){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::readALTModel){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::groupRectangles){throw std::exception("not implemented");}


