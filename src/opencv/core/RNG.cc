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
	Nan::SetPrototypeMethod(ctor, "next", rng_general_callback::callback);
	//next() : _st.uint;
	overload->addOverload("rng", "RNG", "uchar", {}, next_uchar);
	Nan::SetPrototypeMethod(ctor, "uchar", rng_general_callback::callback);
	//uchar() : _st.uchar;
	//schar() : _st.schar;
	overload->addOverload("rng", "RNG", "ushort", {}, next_ushort);
	Nan::SetPrototypeMethod(ctor, "ushort", rng_general_callback::callback);
	//ushort() : _st.ushort;
	overload->addOverload("rng", "RNG", "short", {}, next_short);
	Nan::SetPrototypeMethod(ctor, "short", rng_general_callback::callback);
	//short() : _st.short;
	overload->addOverload("rng", "RNG", "unsigned", {}, next_unsigned);
	Nan::SetPrototypeMethod(ctor, "unsigned", rng_general_callback::callback);
	overload->addOverload("rng", "RNG", "unsigned", { make_param<uint>("upperBoundary","uint") }, unsigned_upperBoundary);
	//unsigned(upperBoundary ? : _st.uint) : _st.uint;
	overload->addOverload("rng", "RNG", "int", {}, next_int);
	Nan::SetPrototypeMethod(ctor, "int", rng_general_callback::callback);
	//int() : _st.int;
	overload->addOverload("rng", "RNG", "float", {}, next_float);
	Nan::SetPrototypeMethod(ctor, "float", rng_general_callback::callback);
	//float() : _st.float;
	overload->addOverload("rng", "RNG", "double", {}, next_double);
	Nan::SetPrototypeMethod(ctor, "double", rng_general_callback::callback);
	//double() : _st.double;

	overload->addOverload("rng", "RNG", "uniform", {
		make_param<double>("a","double"),
		make_param<double>("b","double")
	}, uniform);
	Nan::SetPrototypeMethod(ctor, "uniform", rng_general_callback::callback);
	//uniform(a : _st.int, b : _st.int) : _st.int;
	overload->addOverload("rng", "RNG", "fill", {
		make_param<IOArray*>("mat","IOArray"),
		make_param<int>("distType","DistType"),
		make_param<IOArray*>("a","IOArray"),
		make_param<IOArray*>("b","IOArray"),
		make_param<bool>("saturateRange","bool", false)
	}, fill_array);
	Nan::SetPrototypeMethod(ctor, "fill", rng_general_callback::callback);

	overload->addOverload("rng", "RNG", "fill", {
		make_param<IOArray*>("mat","IOArray"),
		make_param<int>("distType","DistType"),
		make_param<double>("a","double"),
		make_param<double>("b","double"),
			make_param<bool>("saturateRange","bool", false)
	}, fill_number);
	//fill(mat: _st.InputOutputArray, distType : DistType, a : _st.InputArray | Number, b : _st.InputArray | Number, saturateRange ? : boolean /* = false*/) : void;


	overload->addOverload("rng", "RNG", "gaussian", { make_param<double>("sigma","double") }, gaussian);
	Nan::SetPrototypeMethod(ctor, "gaussian", rng_general_callback::callback);
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
	rng->_rng = std::make_shared<cv::RNG>();

	rng->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(RNG::New_state){
	auto rng = new RNG();
	rng->_rng = std::make_shared<cv::RNG>(info.at<uint64_t>(0));

	rng->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(RNG::next_uint){
	auto this_ = info.This<RNG*>()->_rng;
	info.SetReturnValue(this_->next());
}
POLY_METHOD(RNG::next_uchar){
	auto this_ = info.This<RNG*>()->_rng;
	info.SetReturnValue((uchar)this_->operator uchar());
}
POLY_METHOD(RNG::next_ushort){
	auto this_ = info.This<RNG*>()->_rng;
	info.SetReturnValue((ushort)this_->operator ushort());
}
POLY_METHOD(RNG::next_short){
	auto this_ = info.This<RNG*>()->_rng;
	info.SetReturnValue((short)this_->operator short());
}
POLY_METHOD(RNG::next_unsigned){
	auto this_ = info.This<RNG*>()->_rng;
	info.SetReturnValue((unsigned)this_->operator unsigned());
}
POLY_METHOD(RNG::unsigned_upperBoundary){
	auto this_ = info.This<RNG*>()->_rng;
	info.SetReturnValue((unsigned)this_->operator()(info.at<uint>(0)));
}
POLY_METHOD(RNG::next_int){
	auto this_ = info.This<RNG*>()->_rng;
	info.SetReturnValue((int)this_->operator int());
}
POLY_METHOD(RNG::next_float){
	auto this_ = info.This<RNG*>()->_rng;
	info.SetReturnValue((float)this_->operator float());
}
POLY_METHOD(RNG::next_double){
	auto this_ = info.This<RNG*>()->_rng;
	info.SetReturnValue((double)this_->operator double());
}
POLY_METHOD(RNG::uniform){
	auto this_ = info.This<RNG*>()->_rng;
	info.SetReturnValue(this_->uniform(info.at<double>(0),info.at<double>(1)));
}
POLY_METHOD(RNG::fill_array){
	auto this_ = info.This<RNG*>()->_rng;
	auto mat = info.at<IOArray*>(0);
	auto distType = info.at<int>(1);
	auto a = info.at<IOArray*>(2);
	auto b = info.at<IOArray*>(3);
	auto saturateRange = info.at<bool>(4);

	this_->fill(mat->GetInputOutputArray(), distType, a->GetInputArray(), b->GetInputArray(), saturateRange);
}
POLY_METHOD(RNG::fill_number){
	auto this_ = info.This<RNG*>()->_rng;
	auto mat = info.at<IOArray*>(0);
	auto distType = info.at<int>(1);
	auto a = info.at<double>(2);
	auto b = info.at<double>(3);
	auto saturateRange = info.at<bool>(4);

	this_->fill(mat->GetInputOutputArray(), distType, a, b, saturateRange);
}
POLY_METHOD(RNG::gaussian){
	auto this_ = info.This<RNG*>()->_rng;
	info.SetReturnValue(this_->gaussian(info.at<double>(0)));
}

NAN_GETTER(RNG::state_getter){
	auto this_ = overres::ObjectWrap::Unwrap<RNG>(info.This())->_rng;
	info.GetReturnValue().Set((double)this_->state);
}