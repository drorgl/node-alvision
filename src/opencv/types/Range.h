#ifndef _ALVISION_RANGE_H_
#define _ALVISION_RANGE_H_
//#include "OpenCV.h"
#include "../../alvision.h"

class Range : public overres::ObjectWrap {
public:
	static std::string name;
	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload) {
		Range::name = name;
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Range::New);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());

		overload->register_type<Range>(ctor, "range", name);

		Nan::SetAccessor(ctor->InstanceTemplate(),Nan::New( "start").ToLocalChecked(), Range::start);
		Nan::SetAccessor(ctor->InstanceTemplate(),Nan::New( "end").ToLocalChecked(), Range::end);
		

		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());
	}

	std::shared_ptr<cv::Range> _range;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor() {
		assert(!constructor.IsEmpty() && "constructor is empty");
		return Nan::New(constructor)->GetFunction();
	}

	static NAN_METHOD(New) {
		if (info.This()->InternalFieldCount() == 0)
			Nan::ThrowTypeError("Cannot instantiate without new");


		Range *range;
		range = new Range();

		range->Wrap(info.Holder());

		info.GetReturnValue().Set(info.Holder());
	}
	
	static NAN_PROPERTY_GETTER(start) {
		return Nan::ThrowError("not implemented");
	}

	static NAN_PROPERTY_GETTER(end) {
		return Nan::ThrowError("not implemented");
	}
	
};


//declare variables
//template <typename T>
//Nan::Persistent<FunctionTemplate> Range::constructor;

#endif