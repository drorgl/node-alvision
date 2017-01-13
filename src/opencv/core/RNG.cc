#include "RNG.h"
#include "../IOArray.h"

namespace rng_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("rng_general_callback is empty");
		}
		return overload->execute("rng", info);
	}
}

Nan::Persistent<FunctionTemplate> RNG::constructor;


void
RNG::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	rng_general_callback::overload = overload;
	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(rng_general_callback::callback);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("RNG").ToLocalChecked());

	overload->register_type<RNG>(ctor, "rng", "RNG");

	auto DistType = CreateNamedObject(target, "DistType");
	SetObjectProperty(DistType, "UNIFORM", 0);
	SetObjectProperty(DistType, "NORMAL", 1);
	overload->add_type_alias("DistType", "int");

	overload->addOverloadConstructor("rng", "RNG", {}, New);
	//new () : RNG;

	overload->addOverloadConstructor("rng", "RNG", {
		make_param<uint64_t>("state","uint64_t")
	}, New_state);
	//new (state: _st.uint64) : RNG;

	overload->addOverload("rng", "RNG", "next", {}, next_uint);
	//next() : _st.uint;
	overload->addOverload("rng", "RNG", "uchar", {}, next_uchar);
	//uchar() : _st.uchar;
	//schar() : _st.schar;
	overload->addOverload("rng", "RNG", "ushort", {}, next_ushort);
	//ushort() : _st.ushort;
	overload->addOverload("rng", "RNG", "short", {}, next_short);
	//short() : _st.short;
	overload->addOverload("rng", "RNG", "unsigned", {}, next_unsigned);
	overload->addOverload("rng", "RNG", "unsigned", { make_param<uint>("upperBoundary","uint") }, unsigned_upperBoundary);
	//unsigned(upperBoundary ? : _st.uint) : _st.uint;
	overload->addOverload("rng", "RNG", "int", {}, next_int);
	//int() : _st.int;
	overload->addOverload("rng", "RNG", "float", {}, next_float);
	//float() : _st.float;
	overload->addOverload("rng", "RNG", "double", {}, next_double);
	//double() : _st.double;

	overload->addOverload("rng", "RNG", "uniform", {
		make_param<double>("a","double"),
		make_param<double>("b","double")
	}, uniform);
	//uniform(a : _st.int, b : _st.int) : _st.int;
	overload->addOverload("rng", "RNG", "fill", {
		make_param<IOArray*>("mat","IOArray"),
		make_param<int>("distType","DistType"),
		make_param<IOArray*>("a","IOArray"),
		make_param<IOArray*>("b","IOArray"),
		make_param<bool>("saturateRange","bool", false)
	}, fill_array);

	overload->addOverload("rng", "RNG", "fill", {
		make_param<IOArray*>("mat","IOArray"),
		make_param<int>("distType","DistType"),
		make_param<double>("a","double"),
		make_param<double>("b","double"),
			make_param<bool>("saturateRange","bool", false)
	}, fill_number);
	//fill(mat: _st.InputOutputArray, distType : DistType, a : _st.InputArray | Number, b : _st.InputArray | Number, saturateRange ? : boolean /* = false*/) : void;


	overload->addOverload("rng", "RNG", "gaussian", { make_param<double>("sigma","double") }, gaussian);
	//gaussian(sigma: _st.double) : _st.double;

	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("state").ToLocalChecked(), state_getter);
	//state: _st.uint64;
//};

	target->Set(Nan::New("RNG").ToLocalChecked(), ctor->GetFunction());

};

v8::Local<v8::Function> RNG::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(RNG::New) {
	auto rng = new RNG();

	rng->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(RNG::New_state){
	throw std::exception("not implemented");
}

POLY_METHOD(RNG::next_uint){
	throw std::exception("not implemented");
}
POLY_METHOD(RNG::next_uchar){
	throw std::exception("not implemented");
}
POLY_METHOD(RNG::next_ushort){
	throw std::exception("not implemented");
}
POLY_METHOD(RNG::next_short){
	throw std::exception("not implemented");
}
POLY_METHOD(RNG::next_unsigned){
	throw std::exception("not implemented");
}
POLY_METHOD(RNG::unsigned_upperBoundary){
	throw std::exception("not implemented");
}
POLY_METHOD(RNG::next_int){
	throw std::exception("not implemented");
}
POLY_METHOD(RNG::next_float){
	throw std::exception("not implemented");
}
POLY_METHOD(RNG::next_double){
	throw std::exception("not implemented");
}
POLY_METHOD(RNG::uniform){
	throw std::exception("not implemented");
}
POLY_METHOD(RNG::fill_array){
	throw std::exception("not implemented");
}
POLY_METHOD(RNG::fill_number){
	throw std::exception("not implemented");
}
POLY_METHOD(RNG::gaussian){
	throw std::exception("not implemented");
}

NAN_GETTER(RNG::state_getter){
	throw std::exception("not implemented");
}