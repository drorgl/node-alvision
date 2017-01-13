#include "RNG_MT19937.h"

namespace rng19937_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("rng19937_general_callback is empty");
		}
		return overload->execute("rng19937", info);
	}
}


Nan::Persistent<FunctionTemplate> RNG_MT19937::constructor;


void
RNG_MT19937::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(rng19937_general_callback::callback);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("RNG_MT19937").ToLocalChecked());

	overload->register_type<RNG_MT19937>(ctor, "rng_mt19937", "RNG_MT19937");



	/** @brief Mersenne Twister random number generator

	Inspired by http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/MT2002/CODES/mt19937ar.c
	@todo document
	*/
	//interface RNG_MT19937Static {
		//    public:

	overload->addOverloadConstructor("rng19937", "RNG_MT19937", {}, New);
		//new () : RNG_MT19937;
		overload->addOverloadConstructor("rng19937", "RNG_MT19937", {make_param<uint>("s","uint")},New_seed );
		//new (s : _st.uint) : RNG_MT19937;
		//
//	}
//
//	interface RNG_MT19937
//	{
		//    void seed(unsigned s);
		//
		overload->addOverload("rng19937", "RNG_MT19937", "next", {},next );
		//next() : _st.uint;
		//
		overload->addOverload("rng19937", "RNG_MT19937", "int", {}, next_int);
		//    operator int();
		overload->addOverload("rng19937", "RNG_MT19937", "unsigned", {}, next_unsigned);
		//    operator unsigned();
		overload->addOverload("rng19937", "RNG_MT19937", "float", {},next_float );
		//    operator float();
		overload->addOverload("rng19937", "RNG_MT19937", "double", {},next_double );
		//    operator double();
		//

		overload->addOverload("rng19937", "RNG_MT19937", "run", {make_param<unsigned>("N","unsigned")},run_n );
		//    unsigned operator ()(unsigned N);
		overload->addOverload("rng19937", "RNG_MT19937", "run", {}, run);
		//    unsigned operator ()();
		//
		//    /** @brief returns uniformly distributed integer random number from [a,b) range
		//
		//*/
		overload->addOverload("rng19937", "RNG_MT19937", "uniform", {make_param<double>("a","double"), make_param<double>("b","double")}, uniform);
		//    int uniform(int a, int b);
		//    /** @brief returns uniformly distributed floating-point random number from [a,b) range
		//
		//*/
		//overload->addOverload("rng19937", "RNG_MT19937", "", {}, uniform_float);
		//    float uniform(float a, float b);
		//    /** @brief returns uniformly distributed double-precision floating-point random number from [a,b) range
		//
		//*/
		//overload->addOverload("rng19937", "RNG_MT19937", "", {}, );
		//    double uniform(double a, double b);
		//
		//    private:
		//    enum PeriodParameters { N = 624, M = 397 };
		//    unsigned state[N];
		//    int mti;
	//};
	//
	//export var RNG_MT19937 : RNG_MT19937Static = alvision_module.RNG_MT19937;




	target->Set(Nan::New("RNG_MT19937").ToLocalChecked(), ctor->GetFunction());

	
};

v8::Local<v8::Function> RNG_MT19937::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(RNG_MT19937::New) {

	auto rng_mt19937 = new RNG_MT19937();
	//}

	rng_mt19937->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(RNG_MT19937::New_seed){throw std::exception("not implemented");}
POLY_METHOD(RNG_MT19937::next){throw std::exception("not implemented");}
POLY_METHOD(RNG_MT19937::next_int){throw std::exception("not implemented");}
POLY_METHOD(RNG_MT19937::next_unsigned){throw std::exception("not implemented");}
POLY_METHOD(RNG_MT19937::next_float){throw std::exception("not implemented");}
POLY_METHOD(RNG_MT19937::next_double){throw std::exception("not implemented");}
POLY_METHOD(RNG_MT19937::run_n){throw std::exception("not implemented");}
POLY_METHOD(RNG_MT19937::run){throw std::exception("not implemented");}
POLY_METHOD(RNG_MT19937::uniform){throw std::exception("not implemented");}
