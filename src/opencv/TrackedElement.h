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
	static std::string name;
	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		trackedelement_general_callback::overload = overload;
		TrackedElement<T>::name = name;

		//Class
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(trackedelement_general_callback::tracked_ptr_callback);
		constructor.Reset(ctor);
		auto itpl = ctor->InstanceTemplate();
		itpl->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		overload->register_type<TrackedElement<T>>(ctor, "trackedelement", name);


		overload->addOverloadConstructor("tracked_element", name,{}, TrackedElement::New);

		overload->addOverload("tracked_element", name, "get", {}, get);
		Nan::SetPrototypeMethod(ctor, "get", trackedelement_general_callback::tracked_ptr_callback);
		overload->addOverload("tracked_element", name, "set", {}, set);
		Nan::SetPrototypeMethod(ctor, "set", trackedelement_general_callback::tracked_ptr_callback);

		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());
	}

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual  v8::Local<v8::Function> get_constructor() {
		assert(!constructor.IsEmpty() && "constructor is empty");
		return Nan::New(constructor)->GetFunction();
	}


	static POLY_METHOD(New) {
		auto telem = new TrackedElement<T>();

		telem->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}


	std::shared_ptr<array_accessor_base> _from;

	static POLY_METHOD(get) {
		auto this_ = info.This<TrackedElement<T>*>();
		if (this_->_from == nullptr) {
			throw std::exception("TrackedElement is empty");
		}
		info.GetReturnValue().Set(this_->_from->get(0));
	}
	static POLY_METHOD(set) {
		
		auto this_ = info.This<TrackedElement<T>*>();

		if (this_->_from == nullptr) {
			throw std::exception("TrackedElement is empty");
		}

		if (info.Length() != 1) {
			throw std::exception("set should be passed a value");
		}


		this_->_from->set(0,info[0]);
		info.GetReturnValue().Set(info[0]);
	}
};

template<typename T>
Nan::Persistent<FunctionTemplate> TrackedElement<T>::constructor;

template<typename T>
std::string TrackedElement<T>::name;

#endif