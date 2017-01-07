#ifndef _ALVISION_TRACKED_PTR_H_
#define _ALVISION_TRACKED_PTR_H_

#include "../alvision.h"
#include "array_accessors/array_accessor_base.h"

namespace trackedptr_general_callback {
	extern std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback);
}

template <typename T>
class TrackedPtr : public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		trackedptr_general_callback::overload = overload;

		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(vec_general_callback::callback);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		overload->register_type<TrackedPtr<T>>(ctor, "trackedptr", name);

		//Nan::SetIndexedPropertyHandler(ctor, indexed_getter, indexed_setter);
		//Nan::SetAccessor(ctor, Nan::New("length").ToLocalChecked(), index_length);

		overload->addOverloadConstructor("trackedptr", name,{}, New_no_parameters);
	}

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor() {
		assert(!constructor.IsEmpty() && "constructor is empty");
		return Nan::New(constructor)->GetFunction();
	}

	static POLY_METHOD(New_no_parameters) {
		throw std::exception("internal class use only");
	}
	
	std::shared_ptr<array_accessor_base> _from;
	//std::string _Ttype;
	//int _i0;

	static NAN_GETTER(index_length) {
		auto this_ = or ::ObjectWrap::Unwrap<TrackedPtr<T>>(info.Holder());
		auto length = this_->_from->length();
	}

	static NAN_INDEX_SETTER(indexed_setter) {
		auto this_ = or ::ObjectWrap::Unwrap<TrackedPtr<T>>(info.Holder());
		if ((index > this_->_from->length()) || (index < 0)) {
			Nan::ThrowRangeError("index out of range");
		}

		this_->_from->set(index, value);

		info.GetReturnValue().Set(info.This());
	}

	static NAN_INDEX_GETTER(indexed_getter) {
		auto this_ = or ::ObjectWrap::Unwrap<TrackedPtr<T>>(info.Holder());
		if ((index > this_->_from->length()) || (index < 0)) {
			Nan::ThrowRangeError("index out of range");
		}

		info.GetReturnValue().Set(this_->_from->get(index));
	}
};

template<typename T>
Nan::Persistent<FunctionTemplate> TrackedPtr<T>::constructor;

#endif