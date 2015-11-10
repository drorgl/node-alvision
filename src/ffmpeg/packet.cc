#include "packet.h"

namespace alvision{

	v8::Persistent<FunctionTemplate> packet::constructor;

	void packet::Init(Handle<Object> target) {
		NanScope();

		//Class
		Local<FunctionTemplate> ctor = NanNew<FunctionTemplate>(packet::New);
		NanAssignPersistent(constructor, ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(NanNew("packet"));

		//ctor->InstanceTemplate()->SetAccessor(NanNew("streamid"), GetStreamId);

		ctor->InstanceTemplate()->SetAccessor(NanNew("streamid"), GetStreamId, SetStreamId);


		NODE_SET_PROTOTYPE_METHOD(ctor, "RescaleRound", RescaleRound);

		target->Set(NanNew("packet"), ctor->GetFunction());

	};

	NAN_METHOD(packet::New) {
		NanScope();
		if (!args.IsConstructCall())
			return NanThrowTypeError("Cannot call constructor as function");

		packet *pt;

		pt = new packet();

		pt->Wrap(args.This());
		return args.This();
	}


	packet::packet() : ObjectWrap() {
		_packet = std::make_shared<ffmpegcpp::packet>();
	}

	NAN_GETTER(packet::GetStreamId){
		NanScope();

		auto* pt = node::ObjectWrap::Unwrap<packet>(args.This());

		NanReturnValue(NanNew(pt->_packet->stream_index()));
	}

	NAN_SETTER(packet::SetStreamId){
		NanScope();
		auto* pt = node::ObjectWrap::Unwrap<packet>(args.This());
		pt->_packet->stream_index((int)value->Int32Value());
	}

	NAN_METHOD(packet::RescaleRound){
		SETUP_FUNCTION(packet);

		auto fromTimeBase = (!args[0]->IsNull() && !args[0]->IsUndefined()) ? args[0]->NumberValue() : 1;
		auto toTimeBase = (!args[1]->IsNull() && !args[1]->IsUndefined()) ? args[1]->NumberValue() : 1;

		self->_packet->rescale_rnd(ffmpegcpp::rational::fromDouble(fromTimeBase, 1), ffmpegcpp::rational::fromDouble(toTimeBase, 1));

		NanReturnValue(NanNew(true));
	}

	//v8::Handle<Value> packet::GetStreamId(v8::Local<v8::String> property, const v8::AccessorInfo& info) {
	//	auto pt = ObjectWrap::Unwrap<packet>(info.Holder());
	//	//NanReturnValue(pt->_packet->stream_index());
	//	return NanNew(pt->_packet->stream_index());
	//
	//	// Extract the C++ request object from the JavaScript wrapper.
	//	//Gtknotify* gtknotify_instance = node::ObjectWrap::Unwrap<Gtknotify>(info.Holder());
	//	//return v8::String::New(gtknotify_instance->title.c_str());
	//}

}