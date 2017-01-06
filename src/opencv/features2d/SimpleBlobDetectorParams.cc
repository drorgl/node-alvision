#include "SimpleBlobDetectorParams.h"
#include "../persistence/FileNode.h"
#include "../persistence/FileStorage.h"

namespace simpleblobdetectorparams_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("simpleblobdetectorparams_general_callback is empty");
		}
		return overload->execute("simpleblobdetectorparams", info);
	}
}

Nan::Persistent<FunctionTemplate> SimpleBlobDetectorParams::constructor;

v8::Local<v8::Function> SimpleBlobDetectorParams::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(SimpleBlobDetectorParams::constructor)->GetFunction();
}

void SimpleBlobDetectorParams::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	simpleblobdetectorparams_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(simpleblobdetectorparams_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("SimpleBlobDetectorParams").ToLocalChecked());

	overload->register_type<SimpleBlobDetectorParams>(ctor, "simpleblobdetectorparams", "SimpleBlobDetectorParams");

	overload->addOverloadConstructor("simpleblobdetectorparams", "SimpleBlobDetectorParams", {}, New);
	
//		CV_PROP_RW float thresholdStep;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("thresholdStep").ToLocalChecked(), thresholdStep_getter, thresholdStep_setter);
//		CV_PROP_RW float minThreshold;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("minThreshold").ToLocalChecked(), minThreshold_getter, minThreshold_setter);
//		CV_PROP_RW float maxThreshold;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("maxThreshold").ToLocalChecked(), maxThreshold_getter, maxThreshold_setter);
//		CV_PROP_RW size_t minRepeatability;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("minRepeatability").ToLocalChecked(), minRepeatability_getter, minRepeatability_setter);
//		CV_PROP_RW float minDistBetweenBlobs;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("minDistBetweenBlobs").ToLocalChecked(), minDistBetweenBlobs_getter, minDistBetweenBlobs_setter);
//
//		CV_PROP_RW bool filterByColor;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("filterByColor").ToLocalChecked(), filterByColor_getter, filterByColor_setter);
//		CV_PROP_RW uchar blobColor;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("blobColor").ToLocalChecked(), blobColor_getter, blobColor_setter);
//
//		CV_PROP_RW bool filterByArea;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("filterByArea").ToLocalChecked(), filterByArea_getter, filterByArea_setter);
//		CV_PROP_RW float minArea, maxArea;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("minArea").ToLocalChecked(), minArea_getter, minArea_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("maxArea").ToLocalChecked(), maxArea_getter, maxArea_setter);
//
//		CV_PROP_RW bool filterByCircularity;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("filterByCircularity").ToLocalChecked(), filterByCircularity_getter, filterByCircularity_setter);
//		CV_PROP_RW float minCircularity, maxCircularity;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("minCircularity").ToLocalChecked(), minCircularity_getter, minCircularity_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("maxCircularity").ToLocalChecked(), maxCircularity_getter, maxCircularity_setter);
//
//		CV_PROP_RW bool filterByInertia;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("filterByInertia").ToLocalChecked(), filterByInertia_getter, filterByInertia_setter);
//		CV_PROP_RW float minInertiaRatio, maxInertiaRatio;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("minInertiaRatio").ToLocalChecked(), minInertiaRatio_getter, minInertiaRatio_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("maxInertiaRatio").ToLocalChecked(), maxInertiaRatio_getter, maxInertiaRatio_setter);
//
//		CV_PROP_RW bool filterByConvexity;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("filterByConvexity").ToLocalChecked(), filterByConvexity_getter, filterByConvexity_setter);
//		CV_PROP_RW float minConvexity, maxConvexity;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("minConvexity").ToLocalChecked(), minConvexity_getter, minConvexity_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("maxConvexity").ToLocalChecked(), maxConvexity_getter, maxConvexity_setter);
//
//		void read(const FileNode& fn);
	overload->addOverload("simpleblobdetectorparams", "SimpleBlobDetectorParams", "read", {make_param<FileNode*>("fn","FileNode")}, read);
//		void write(FileStorage& fs) const;
	overload->addOverload("simpleblobdetectorparams", "SimpleBlobDetectorParams", "write", {make_param<FileStorage*>("fs","FileStorage")}, write);

}

std::shared_ptr<SimpleBlobDetectorParams> SimpleBlobDetectorParams::create() {
	auto params = std::make_shared<SimpleBlobDetectorParams>();
	params->_params = std::make_shared<cv::SimpleBlobDetector::Params>();
	return params;
}


POLY_METHOD(SimpleBlobDetectorParams::New) {}

NAN_GETTER(SimpleBlobDetectorParams::thresholdStep_getter){}
NAN_SETTER(SimpleBlobDetectorParams::thresholdStep_setter){}

NAN_GETTER(SimpleBlobDetectorParams::minThreshold_getter){}
NAN_SETTER(SimpleBlobDetectorParams::minThreshold_setter){}

NAN_GETTER(SimpleBlobDetectorParams::maxThreshold_getter){}
NAN_SETTER(SimpleBlobDetectorParams::maxThreshold_setter){}

NAN_GETTER(SimpleBlobDetectorParams::minRepeatability_getter){}
NAN_SETTER(SimpleBlobDetectorParams::minRepeatability_setter){}

NAN_GETTER(SimpleBlobDetectorParams::minDistBetweenBlobs_getter){}
NAN_SETTER(SimpleBlobDetectorParams::minDistBetweenBlobs_setter){}

NAN_GETTER(SimpleBlobDetectorParams::filterByColor_getter){}
NAN_SETTER(SimpleBlobDetectorParams::filterByColor_setter){}

NAN_GETTER(SimpleBlobDetectorParams::blobColor_getter){}
NAN_SETTER(SimpleBlobDetectorParams::blobColor_setter){}

NAN_GETTER(SimpleBlobDetectorParams::filterByArea_getter){}
NAN_SETTER(SimpleBlobDetectorParams::filterByArea_setter){}

NAN_GETTER(SimpleBlobDetectorParams::minArea_getter){}
NAN_SETTER(SimpleBlobDetectorParams::minArea_setter){}

NAN_GETTER(SimpleBlobDetectorParams::maxArea_getter){}
NAN_SETTER(SimpleBlobDetectorParams::maxArea_setter){}

NAN_GETTER(SimpleBlobDetectorParams::filterByCircularity_getter){}
NAN_SETTER(SimpleBlobDetectorParams::filterByCircularity_setter){}

NAN_GETTER(SimpleBlobDetectorParams::minCircularity_getter){}
NAN_SETTER(SimpleBlobDetectorParams::minCircularity_setter){}

NAN_GETTER(SimpleBlobDetectorParams::maxCircularity_getter){}
NAN_SETTER(SimpleBlobDetectorParams::maxCircularity_setter){}

NAN_GETTER(SimpleBlobDetectorParams::filterByInertia_getter){}
NAN_SETTER(SimpleBlobDetectorParams::filterByInertia_setter){}

NAN_GETTER(SimpleBlobDetectorParams::minInertiaRatio_getter){}
NAN_SETTER(SimpleBlobDetectorParams::minInertiaRatio_setter){}

NAN_GETTER(SimpleBlobDetectorParams::maxInertiaRatio_getter){}
NAN_SETTER(SimpleBlobDetectorParams::maxInertiaRatio_setter){}

NAN_GETTER(SimpleBlobDetectorParams::filterByConvexity_getter){}
NAN_SETTER(SimpleBlobDetectorParams::filterByConvexity_setter){}

NAN_GETTER(SimpleBlobDetectorParams::minConvexity_getter){}
NAN_SETTER(SimpleBlobDetectorParams::minConvexity_setter){}

NAN_GETTER(SimpleBlobDetectorParams::maxConvexity_getter){}
NAN_SETTER(SimpleBlobDetectorParams::maxConvexity_setter){}


POLY_METHOD(SimpleBlobDetectorParams::read) {}
POLY_METHOD(SimpleBlobDetectorParams::write) {}