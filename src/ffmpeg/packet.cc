#include "packet.h"

namespace alvision{

	Nan::Persistent<FunctionTemplate> packet::constructor;

	void packet::Init(Handle<Object> target) {
		

		//Class
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(packet::New);
		constructor.Reset(ctor);
		//NanAssignPersistent(constructor, ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New("packet").ToLocalChecked());

		//ctor->InstanceTemplate()->SetAccessor(Nan::New("streamid"), GetStreamId);
		Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("streamid").ToLocalChecked(), packet::GetStreamId, packet::SetStreamId);

		Nan::SetPrototypeMethod(ctor, "RescaleRound", RescaleRound);

		target->Set(Nan::New("packet").ToLocalChecked(), ctor->GetFunction());

	};

	NAN_METHOD(packet::New) {
		
		if (!info.IsConstructCall())
			return Nan::ThrowTypeError("Cannot call constructor as function");

		packet *pt;

		pt = new packet();

		pt->Wrap(info.This());
		info.GetReturnValue().Set(info.This());
	}


	packet::packet() : Nan::ObjectWrap() {
		_packet = std::make_shared<ffmpegcpp::packet>();
	}

	NAN_GETTER(packet::GetStreamId){
		

		auto* pt = Nan::ObjectWrap::Unwrap<packet>(info.This());

		info.GetReturnValue().Set(Nan::New(pt->_packet->stream_index()));
	}

	NAN_SETTER(packet::SetStreamId){
		
		auto* pt = Nan::ObjectWrap::Unwrap<packet>(info.This());
		pt->_packet->stream_index((int)value->Int32Value());
	}

	NAN_METHOD(packet::RescaleRound){
		SETUP_FUNCTION(packet);

		auto fromTimeBase = (!info[0]->IsNull() && !info[0]->IsUndefined()) ? info[0]->NumberValue() : 1;
		auto toTimeBase = (!info[1]->IsNull() && !info[1]->IsUndefined()) ? info[1]->NumberValue() : 1;

		self->_packet->rescale_rnd(ffmpegcpp::rational::fromDouble(fromTimeBase, 1), ffmpegcpp::rational::fromDouble(toTimeBase, 1));

		info.GetReturnValue().Set(Nan::New(true));
	}

	//v8::Handle<Value> packet::GetStreamId(v8::Local<v8::String> property, const v8::AccessorInfo& info) {
	//	auto pt = Nan::ObjectWrap::Unwrap<packet>(info.Holder());
	//	//NanReturnValue(pt->_packet->stream_index());
	//	return Nan::New(pt->_packet->stream_index());
	//
	//	// Extract the C++ request object from the JavaScript wrapper.
	//	//Gtknotify* gtknotify_instance = Nan::ObjectWrap::Unwrap<Gtknotify>(info.Holder());
	//	//return v8::String::New(gtknotify_instance->title.c_str());
	//}

}