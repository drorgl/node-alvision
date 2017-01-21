#include "GeneralizedHoughGuil.h"



namespace generalizedhoughguil_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("generalizedhoughguil_general_callback is empty");
		}
		return overload->execute("generalizedhoughguil", info);
	}
}

void
GeneralizedHoughGuil::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	generalizedhoughguil_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(generalizedhoughguil_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("StereoMatcher").ToLocalChecked());
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




	target->Set(Nan::New("GeneralizedHoughBallard").ToLocalChecked(), ctor->GetFunction());
}



POLY_METHOD(GeneralizedHoughGuil::setXi){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getXi){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setLevels){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getLevels){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setAngleEpsilon){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getAngleEpsilon){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setMinAngle){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getMinAngle){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setMaxAngle){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getMaxAngle){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setAngleStep){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getAngleStep){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setAngleThresh){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getAngleThresh){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setMinScale){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getMinScale){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setMaxScale){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getMaxScale){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setScaleStep){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getScaleStep){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setScaleThresh){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getScaleThresh){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::setPosThresh){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHoughGuil::getPosThresh){throw std::exception("not implemented");}

