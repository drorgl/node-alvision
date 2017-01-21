#include "GeneralizedHoughBallard.h"



namespace generalizedhoughballard_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("generalizedhoughballard_general_callback is empty");
		}
		return overload->execute("generalizedhoughballard", info);
	}
}


Nan::Persistent<FunctionTemplate> GeneralizedHoughBallard::constructor;

std::string GeneralizedHoughBallard::name;

void
GeneralizedHoughBallard::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	generalizedhoughballard_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(generalizedhoughballard_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("GeneralizedHoughBallard").ToLocalChecked());
	ctor->Inherit(Nan::New(GeneralizedHough::constructor));

	overload->register_type<GeneralizedHoughBallard>(ctor, "generalizedhoughballard", "GeneralizedHoughBallard");


	////! Ballard, D.H. (1981). Generalizing the Hough transform to detect arbitrary shapes. Pattern Recognition 13 /(2): /111-122.
	////! Detects position only without traslation and rotation
	//export interface GeneralizedHoughBallard extends GeneralizedHough
	//{
	//	//! R-Table levels.
	overload->addOverload("generalizedhoughballard", "", "setLevels", {make_param<int>("levels","int")}, setLevels);
	//	setLevels(levels: _st.int) : void;

	overload->addOverload("generalizedhoughballard", "", "getLevels", {}, getLevels);
	//	getLevels() : _st.int;
	//
	//	//! The accumulator threshold for the template centers at the detection stage. The smaller it is, the more /false/ positions may be detected.

	overload->addOverload("generalizedhoughballard", "", "setVotesThreshold", {make_param<int>("votesThreshold","int")}, setVotesThreshold);
	//	setVotesThreshold(votesThreshold : _st.int) : void;

	overload->addOverload("generalizedhoughballard", "", "getVotesThreshold", {}, getVotesThreshold);
	//	getVotesThreshold() : _st.int;
	//};


	target->Set(Nan::New("GeneralizedHoughBallard").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> GeneralizedHoughBallard::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}



POLY_METHOD(GeneralizedHoughBallard::setLevels){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughBallard::getLevels){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughBallard::setVotesThreshold){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughBallard::getVotesThreshold){throw std::exception("not implemented");}


