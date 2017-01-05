#include "TermCriteria.h"

namespace termcriteria_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("termcriteria_general_callback is empty");
		}
		return overload->execute("termcriteria", info);
	}
}

Nan::Persistent<FunctionTemplate> TermCriteria::constructor;


void TermCriteria::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	termcriteria_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(termcriteria_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("TermCriteria").ToLocalChecked());
	ctor->Inherit(Nan::New(TermCriteria::constructor));

	overload->register_type<TermCriteria>(ctor, "termcriteria", "TermCriteria");



	auto TermCriteriaType = CreateNamedObject(target, "TermCriteriaType");
	SetObjectProperty(TermCriteriaType, "COUNT", 1);
	SetObjectProperty(TermCriteriaType, "MAX_ITER", cv::TermCriteria::COUNT);
	SetObjectProperty(TermCriteriaType, "EPS", 2);

	//type: TermCriteriaType, maxCount : _st.int, epsilon : _st.double
	overload->addOverloadConstructor("termcriteria", "TermCriteria", {
			make_param<int>("type","TermCriteriaType"),
			make_param<int>("maxCount","int"),
			make_param<double>("epsilon","double")

	}, New);

	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("type").ToLocalChecked(), type_getter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("maxCount").ToLocalChecked(), maxCount_getter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("epsilon").ToLocalChecked(), epsilon_getter);
}

v8::Local<v8::Function> TermCriteria::get_constructor() {
	return Nan::New(constructor)->GetFunction();
}

std::shared_ptr<TermCriteria> TermCriteria::New(int type, int maxCount, double epsilon) {
	auto ret = std::make_shared<TermCriteria>();
	ret->_termCriteria = std::make_shared<cv::TermCriteria>(type, maxCount, epsilon);
	return ret;
}

POLY_METHOD(TermCriteria::New) {
	auto ret = new TermCriteria();
	ret->_termCriteria = std::make_shared<cv::TermCriteria>(info.at<int>(0), info.at<int>(1), info.at<double>(2));
	info.SetReturnValue(ret);
}

NAN_GETTER(TermCriteria::type_getter) {
	auto this_ = or ::ObjectWrap::Unwrap<TermCriteria>(info.This());
	info.GetReturnValue().Set(this_->_termCriteria->type);
}
NAN_GETTER(TermCriteria::maxCount_getter) {
	auto this_ = or ::ObjectWrap::Unwrap<TermCriteria>(info.This());
	info.GetReturnValue().Set(this_->_termCriteria->maxCount);
}
NAN_GETTER(TermCriteria::epsilon_getter) {
	auto this_ = or ::ObjectWrap::Unwrap<TermCriteria>(info.This());
	info.GetReturnValue().Set(this_->_termCriteria->epsilon);
}