#ifndef _ALVISION_TRACKED_ELEMENT_H_
#define _ALVISION_TRACKED_ELEMENT_H_

#include "../alvision.h"
#include "array_accessors/array_accessor_base.h"

namespace trackedelement_general_callback {
	extern std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(tracked_ptr_callback);
}

template <typename T>
class TrackedElement : public or ::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
		trackedelement_general_callback::overload = overload;

		//Class
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(trackedelement_general_callback::tracked_ptr_callback);
		constructor.Reset(ctor);
		auto itpl = ctor->InstanceTemplate();
		itpl->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New("TrackedElement").ToLocalChecked());

		overload->register_type<TrackedElement>(ctor, "trackedelement", "TrackedElement");


		overload->addOverloadConstructor("tracked_element", "TrackedElement",{}, TrackedElement::New);
		overload->addOverload("tracked_element", "TrackedElement", "get", {}, get);
		overload->addOverload("tracked_element", "TrackedElement", "set", {make_param<T>("val",T::name)}, set);

		target->Set(Nan::New("TrackedElement").ToLocalChecked(), ctor->GetFunction());
	}

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual  v8::Local<v8::Function> get_constructor() {
		assert(!constructor.IsEmpty() && "constructor is empty");
		return Nan::New(constructor)->GetFunction();
	}


	static POLY_METHOD(New) {
		return Nan::ThrowError("TrackedElement cannot be created manually, its part of the Alvision internal module");
	}


	std::shared_ptr<array_accessor_base> _from;

	static POLY_METHOD(get) {
		auto this_ = info.This<TrackedElement<T>*>();
		info.GetReturnValue().Set(this_->_from->get(0));
	}
	static POLY_METHOD(set) {
		auto this_ = info.This<TrackedElement<T>*>();
		this_->_from->set(0,info.at<T>(0));
		info.SetReturnValue(info.at<T>(0));
	}
};

template<typename T>
Nan::Persistent<FunctionTemplate> TrackedElement<T>::constructor;



#endif