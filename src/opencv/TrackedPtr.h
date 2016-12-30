#ifndef _ALVISION_TRACKED_PTR_H_
#define _ALVISION_TRACKED_PTR_H_

#include "../alvision.h"

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

		overload->addOverloadConstructor("trackedptr", name,{}, New_no_parameters);
	}

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor() {
		return Nan::New(constructor)->GetFunction();
	}

	static POLY_METHOD(New_no_parameters) {
		throw std::exception("internal class use only");
	}
	
	std::shared_ptr<T> _from;
	std::string _Ttype;
	int _i0;
};

template<typename T>
Nan::Persistent<FunctionTemplate> TrackedPtr<T>::constructor;

#endif