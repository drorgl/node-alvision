#include "Moments.h"

namespace moments_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("moments_general_callback is empty");
		}
		return overload->execute("moments", info);
	}
}

Nan::Persistent<FunctionTemplate> Moments::constructor;

std::string Moments::name;

void Moments::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	name = "Moments";
	moments_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(moments_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New(name).ToLocalChecked());

	overload->register_type<Moments>(ctor, "moments", name);



//
//	@note
//		Since the contour moments are computed using Green formula, you may get seemingly odd results for
//		contours with self - intersections, e.g.a zero area(m00) for butterfly - shaped contours.
//		* /
//		class CV_EXPORTS_W_MAP Moments
//	{
//	public:
//		//! the default constructor
//		Moments();
	overload->addOverloadConstructor("moments", name, {}, New);
//		//! the full constructor
//		Moments(double m00, double m10, double m01, double m20, double m11,
//			double m02, double m30, double m21, double m12, double m03);
	overload->addOverloadConstructor("moments", name, {
		make_param<double>("m00","double"), 
		make_param<double>("m10","double"), 
		make_param<double>("m01","double"), 
		make_param<double>("m20","double"), 
		make_param<double>("m11","double"),
		make_param<double>("m02","double"), 
		make_param<double>("m30","double"), 
		make_param<double>("m21","double"), 
		make_param<double>("m12","double"), 
		make_param<double>("m03","double")
	}, New_m);
//		////! the conversion from CvMoments
//		//Moments( const CvMoments& moments );
//		////! the conversion to CvMoments
//		//operator CvMoments() const;
//
//		//! @name spatial moments
//		//! @{
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("m00").ToLocalChecked(), m00_getter, m00_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("m10").ToLocalChecked(), m10_getter, m10_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("m01").ToLocalChecked(), m01_getter, m01_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("m20").ToLocalChecked(), m20_getter, m20_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("m11").ToLocalChecked(), m11_getter, m11_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("m02").ToLocalChecked(), m02_getter, m02_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("m30").ToLocalChecked(), m30_getter, m30_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("m21").ToLocalChecked(), m21_getter, m21_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("m12").ToLocalChecked(), m12_getter, m12_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("m03").ToLocalChecked(), m03_getter, m03_setter);
//		CV_PROP_RW double  m00, m10, m01, m20, m11, m02, m30, m21, m12, m03;
//		//! @}
//
//		//! @name central moments
//		//! @{

	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("mu20").ToLocalChecked(), mu20_getter, mu20_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("mu11").ToLocalChecked(), mu11_getter, mu11_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("mu02").ToLocalChecked(), mu02_getter, mu02_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("mu30").ToLocalChecked(), mu30_getter, mu30_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("mu21").ToLocalChecked(), mu21_getter, mu21_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("mu12").ToLocalChecked(), mu12_getter, mu12_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("mu03").ToLocalChecked(), mu03_getter, mu03_setter);


//		CV_PROP_RW double  mu20, mu11, mu02, mu30, mu21, mu12, mu03;
//		//! @}
//
//		//! @name central normalized moments
//		//! @{

	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("nu20").ToLocalChecked(), nu20_getter, nu20_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("nu11").ToLocalChecked(), nu11_getter, nu11_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("nu02").ToLocalChecked(), nu02_getter, nu02_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("nu30").ToLocalChecked(), nu30_getter, nu30_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("nu21").ToLocalChecked(), nu21_getter, nu21_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("nu12").ToLocalChecked(), nu12_getter, nu12_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("nu03").ToLocalChecked(), nu03_getter, nu03_setter);


//		CV_PROP_RW double  nu20, nu11, nu02, nu30, nu21, nu12, nu03;
//		//! @}
//	};
//




	target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());

}

v8::Local<v8::Function> Moments::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}




POLY_METHOD(Moments::New){throw std::exception("not implemented");}
POLY_METHOD(Moments::New_m){throw std::exception("not implemented");}
NAN_GETTER(Moments::m00_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::m00_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::m10_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::m10_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::m01_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::m01_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::m20_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::m20_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::m11_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::m11_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::m02_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::m02_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::m30_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::m30_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::m21_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::m21_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::m12_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::m12_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::m03_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::m03_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::mu20_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::mu20_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::mu11_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::mu11_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::mu02_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::mu02_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::mu30_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::mu30_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::mu21_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::mu21_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::mu12_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::mu12_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::mu03_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::mu03_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::nu20_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::nu20_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::nu11_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::nu11_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::nu02_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::nu02_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::nu30_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::nu30_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::nu21_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::nu21_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::nu12_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::nu12_setter){throw std::exception("not implemented");}
NAN_GETTER(Moments::nu03_getter){throw std::exception("not implemented");}
NAN_SETTER(Moments::nu03_setter){throw std::exception("not implemented");}


