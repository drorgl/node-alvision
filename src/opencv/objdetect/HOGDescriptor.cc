#include "HOGDescriptor.h"

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
	overload->addOverloadConstructor("hogdescriptor", "HOGDescriptor", {}, New_full);
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
	overload->addOverloadConstructor("hogdescriptor", "HOGDescriptor", {}, New_file);
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
	//    CV_WRAP size_t getDescriptorSize() const;

	overload->addOverload("hogdescriptor", "HOGDescriptor", "checkDetectorSize", {}, checkDetectorSize);
	//    CV_WRAP bool checkDetectorSize() const;

	overload->addOverload("hogdescriptor", "HOGDescriptor", "getWinSigma", {}, getWinSigma);
	//    CV_WRAP double getWinSigma() const;
	//

	overload->addOverload("hogdescriptor", "HOGDescriptor", "setSVMDetector", {}, setSVMDetector);
	//    CV_WRAP virtual void setSVMDetector(InputArray _svmdetector);
	//

	overload->addOverload("hogdescriptor", "HOGDescriptor", "read", {}, read);
	//    virtual bool read(FileNode& fn);

	overload->addOverload("hogdescriptor", "HOGDescriptor", "write", {}, write);
	//    virtual void write(FileStorage& fs, const String& objname) const;
	//

	overload->addOverload("hogdescriptor", "HOGDescriptor", "load", {}, load);
	//    CV_WRAP virtual bool load(const String& filename, const String& objname = String());

	overload->addOverload("hogdescriptor", "HOGDescriptor", "save", {}, save);
	//    CV_WRAP virtual void save(const String& filename, const String& objname = String()) const;

	overload->addOverload("hogdescriptor", "HOGDescriptor", "copyTo", {}, copyTo);
	//    virtual void copyTo(HOGDescriptor& c) const;
	//

	overload->addOverload("hogdescriptor", "HOGDescriptor", "compute", {}, compute);
	//    CV_WRAP virtual void compute(InputArray img,
	//                         CV_OUT std::vector<float>& descriptors,
	//                         Size winStride = Size(), Size padding = Size(),
	//                         const std::vector<Point>& locations = std::vector<Point>()) const;
	//
	//    //! with found weights output

	overload->addOverload("hogdescriptor", "HOGDescriptor", "detect", {}, detect);
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

	overload->addOverload("hogdescriptor", "HOGDescriptor", "detectMultiScale", {}, detectMultiScale);
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

	overload->addOverload("hogdescriptor", "HOGDescriptor", "computeGradient", {}, computeGradient);
	//    CV_WRAP virtual void computeGradient(const Mat& img, CV_OUT Mat& grad, CV_OUT Mat& angleOfs,
	//                                 Size paddingTL = Size(), Size paddingBR = Size()) const;
	//

	overload->addStaticOverload("hogdescriptor", "HOGDescriptor", "getDefaultPeopleDetector", {}, getDefaultPeopleDetector);
	//    CV_WRAP static std::vector<float> getDefaultPeopleDetector();
	overload->addStaticOverload("hogdescriptor", "HOGDescriptor", "getDaimlerPeopleDetector", {}, getDaimlerPeopleDetector);
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
	overload->addOverload("hogdescriptor", "HOGDescriptor", "detectROI", {}, detectROI);
	//    virtual void detectROI(const cv::Mat& img, const std::vector<cv::Point> &locations,
	//                                   CV_OUT std::vector<cv::Point>& foundLocations, CV_OUT std::vector<double>& confidences,
	//                                   double hitThreshold = 0, cv::Size winStride = Size(),
	//                                   cv::Size padding = Size()) const;
	//
	//    //! evaluate specified ROI and return confidence value for each location in multiple scales
	overload->addOverload("hogdescriptor", "HOGDescriptor", "detectMultiScaleROI", {}, detectMultiScaleROI);
	//    virtual void detectMultiScaleROI(const cv::Mat& img,
	//                                                       CV_OUT std::vector<cv::Rect>& foundLocations,
	//                                                       std::vector<DetectionROI>& locations,
	//                                                       double hitThreshold = 0,
	//                                                       int groupThreshold = 0) const;
	//
	//    //! read/parse Dalal's alt model file
	overload->addOverload("hogdescriptor", "HOGDescriptor", "readALTModel", {}, readALTModel);
	//    void readALTModel(String modelfile);

	overload->addOverload("hogdescriptor", "HOGDescriptor", "groupRectangles", {}, groupRectangles);
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
	//ret->_algorithm = cv::makePtr<cv::CascadeClassifier>();

	ret->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}




POLY_METHOD(HOGDescriptor::New_full){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::New_file){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::getDescriptorSize){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::checkDetectorSize){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::getWinSigma){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::setSVMDetector){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::read){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::write){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::load){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::save){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::copyTo){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::compute){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::detect){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::detectMultiScale){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::computeGradient){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::getDefaultPeopleDetector){throw std::exception("not implemented");}
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
NAN_GETTER(HOGDescriptor::nlevels_getter){return Nan::ThrowError("not implemented");}
NAN_SETTER(HOGDescriptor::nlevels_setter){return Nan::ThrowError("not implemented");}
NAN_GETTER(HOGDescriptor::signedGradient_getter){return Nan::ThrowError("not implemented");}
NAN_SETTER(HOGDescriptor::signedGradient_setter){return Nan::ThrowError("not implemented");}

POLY_METHOD(HOGDescriptor::detectROI){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::detectMultiScaleROI){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::readALTModel){throw std::exception("not implemented");}
POLY_METHOD(HOGDescriptor::groupRectangles){throw std::exception("not implemented");}


