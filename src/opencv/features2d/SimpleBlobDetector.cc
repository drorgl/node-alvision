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

Nan::Persistent<FunctionTemplate> SimpleBlobDetector::constructor;

void SimpleBlobDetector::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	simpleblobdetector_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(simpleblobdetector_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("SimpleBlobDetector").ToLocalChecked());
	ctor->Inherit(Nan::New(Feature2D::constructor));

	overload->register_type<SimpleBlobDetector>(ctor, "simpleblobdetector", "SimpleBlobDetector");

	overload->addOverloadConstructor("simpleblobdetector", "SimpleBlobDetector", {}, New);
//	CV_WRAP static Ptr<SimpleBlobDetector>
//		create(const SimpleBlobDetector::Params &parameters = SimpleBlobDetector::Params());

}

v8::Local<v8::Function> SimpleBlobDetector::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


std::shared_ptr<SimpleBlobDetector> SimpleBlobDetector::create(std::shared_ptr<SimpleBlobDetectorParams> params) {
	auto ret = std::make_shared<SimpleBlobDetector>();
	ret->_algorithm = cv::SimpleBlobDetector::create(*params->_params);
	return ret;
}

POLY_METHOD(SimpleBlobDetector::New) {
	auto inst = new SimpleBlobDetector();
	inst->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}