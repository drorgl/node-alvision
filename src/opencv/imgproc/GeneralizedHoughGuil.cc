#include "GeneralizedHoughGuil.h"



namespace generalizedhoughguil_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("generalizedhoughguil_general_callback is empty");
		}
		return overload->execute("generalizedhoughguil", info);
	}
}

Nan::Persistent<FunctionTemplate> GeneralizedHoughGuil::constructor;

std::string GeneralizedHoughGuil::name;

void
GeneralizedHoughGuil::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	generalizedhoughguil_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(generalizedhoughguil_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("GeneralizedHoughGuil").ToLocalChecked());
	ctor->Inherit(Nan::New(GeneralizedHough::constructor));

	overload->register_type<GeneralizedHoughGuil>(ctor, "generalizedhoughguil", "GeneralizedHoughGuil");





	////! Guil, N., Gonz?lez-Linares, J.M. and Zapata, E.L. (1999). Bidimensional shape detection using an invariant /approach./ Pattern Recognition 32 (6): 1025-1038.
	////! Detects position, traslation and rotation
	//interface GeneralizedHoughGuil extends GeneralizedHough
	//{
	//	//! Angle difference in degrees between two points in feature.
	overload->addOverload("generalizedhoughguil", "", "setXi", {make_param<double>("xi","double")}, setXi);
	//	setXi(xi: _st.double) : void;
	overload->addOverload("generalizedhoughguil", "", "getXi", {}, getXi);
	//	getXi() : _st.double;
	//
	//	//! Feature table levels.
	overload->addOverload("generalizedhoughguil", "", "setLevels", {make_param<int>("levels","int")}, setLevels);
	//	setLevels(levels : _st.int) : void;
	overload->addOverload("generalizedhoughguil", "", "getLevels", {}, getLevels);
	//	getLevels() : _st.int;
	//
	//	//! Maximal difference between angles that treated as equal.
	overload->addOverload("generalizedhoughguil", "", "setAngleEpsilon", {make_param<double>("angleEpsilon","double")}, setAngleEpsilon);
	//	setAngleEpsilon(angleEpsilon : _st.double) : void;
	overload->addOverload("generalizedhoughguil", "", "getAngleEpsilon", {}, getAngleEpsilon);
	//	getAngleEpsilon() : _st.double;
	//
	//	//! Minimal rotation angle to detect in degrees.
	overload->addOverload("generalizedhoughguil", "", "setMinAngle", {make_param<double>("minAngle","double")}, setMinAngle);
	//	setMinAngle(minAngle: _st.double) : void;
	overload->addOverload("generalizedhoughguil", "", "getMinAngle", {}, getMinAngle);
	//	getMinAngle() : _st.double;
	//
	//	//! Maximal rotation angle to detect in degrees.
	overload->addOverload("generalizedhoughguil", "", "setMaxAngle", {make_param<double>("maxAngle","double")}, setMaxAngle);
	//	setMaxAngle(maxAngle : _st.double) : void;
	overload->addOverload("generalizedhoughguil", "", "getMaxAngle", {}, getMaxAngle);
	//	getMaxAngle() : _st.double;
	//
	//	//! Angle step in degrees.
	overload->addOverload("generalizedhoughguil", "", "setAngleStep", {make_param<double>("angleStep","double")}, setAngleStep);
	//	setAngleStep(angleStep: _st.double) : void;
	overload->addOverload("generalizedhoughguil", "", "getAngleStep", {}, getAngleStep);
	//	getAngleStep() : _st.double;
	//
	//	//! Angle votes threshold.
	overload->addOverload("generalizedhoughguil", "", "setAngleThresh", {make_param<int>("angleThresh","int")}, setAngleThresh);
	//	setAngleThresh(angleThresh : _st.int) : void;
	overload->addOverload("generalizedhoughguil", "", "getAngleThresh", {}, getAngleThresh);
	//	getAngleThresh() : _st.int;
	//
	//	//! Minimal scale to detect.
	overload->addOverload("generalizedhoughguil", "", "setMinScale", {make_param<double>("minScale","double")}, setMinScale);
	//	setMinScale(minScale : _st.double) : void;
	overload->addOverload("generalizedhoughguil", "", "getMinScale", {}, getMinScale);
	//	getMinScale() : _st.double;
	//
	//	//! Maximal scale to detect.
	overload->addOverload("generalizedhoughguil", "", "setMaxScale", {make_param<double>("maxScale","double")}, setMaxScale);
	//	setMaxScale(maxScale : _st.double) : void;
	overload->addOverload("generalizedhoughguil", "", "getMaxScale", {}, getMaxScale);
	//	getMaxScale() : _st.double;
	//
	//	//! Scale step.
	overload->addOverload("generalizedhoughguil", "", "setScaleStep", {make_param<double>("scaleStep","double")}, setScaleStep);
	//	setScaleStep(scaleStep: _st.double) : void;
	overload->addOverload("generalizedhoughguil", "", "getScaleStep", {}, getScaleStep);
	//	getScaleStep() : _st.double;
	//
	//	//! Scale votes threshold.
	overload->addOverload("generalizedhoughguil", "", "setScaleThresh", {make_param<int>("scaleThresh","int")}, setScaleThresh);
	//	setScaleThresh(scaleThresh : _st.int) : void;
	overload->addOverload("generalizedhoughguil", "", "getScaleThresh", {}, getScaleThresh);
	//	getScaleThresh() : _st.int;
	//
	//	//! Position votes threshold.
	overload->addOverload("generalizedhoughguil", "", "setPosThresh", {make_param<int>("posThresh","int")}, setPosThresh);
	//	setPosThresh(posThresh : _st.int) : void;
	overload->addOverload("generalizedhoughguil", "", "getPosThresh", {}, getPosThresh);
	//	getPosThresh() : _st.int;
	//};




	target->Set(Nan::New("GeneralizedHoughGuil").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> GeneralizedHoughGuil::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}



POLY_METHOD(GeneralizedHoughGuil::setXi){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getXi){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setLevels){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getLevels){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setAngleEpsilon){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getAngleEpsilon){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setMinAngle){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getMinAngle){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setMaxAngle){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getMaxAngle){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setAngleStep){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getAngleStep){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setAngleThresh){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getAngleThresh){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setMinScale){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getMinScale){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setMaxScale){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getMaxScale){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setScaleStep){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getScaleStep){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setScaleThresh){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getScaleThresh){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setPosThresh){throw std::runtime_error("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getPosThresh){throw std::runtime_error("not implemented");}

