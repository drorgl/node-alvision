#include "SimpleBlobDetector.h"

namespace simpleblobdetector_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("simpleblobdetector_general_callback is empty");
		}
		return overload->execute("simpleblobdetector", info);
	}
}

void SimpleBlobDetector::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	simpleblobdetector_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(simpleblobdetector_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("SimpleBlobDetector").ToLocalChecked());
	ctor->Inherit(Nan::New(Feature2D::constructor));

	overload->register_type<SimpleBlobDetector>(ctor, "simpleblobdetector", "SimpleBlobDetector");

//	CV_WRAP static Ptr<SimpleBlobDetector>
//		create(const SimpleBlobDetector::Params &parameters = SimpleBlobDetector::Params());

}

std::shared_ptr<SimpleBlobDetector> SimpleBlobDetector::create(std::shared_ptr<SimpleBlobDetectorParams> params) {
	auto ret = std::make_shared<SimpleBlobDetector>();
	ret->_algorithm = cv::SimpleBlobDetector::create(*params->_params);
	return ret;
}