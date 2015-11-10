#ifndef _ALVISION_PACKET_H_
#define _ALVISION_PACKET_H_

#include "../alvision.h"

namespace alvision{
	class packet : public node::ObjectWrap {
	private:

	public:
		static void Init(Handle<Object> target);

		std::shared_ptr<ffmpegcpp::packet> _packet;

		static Persistent<FunctionTemplate> constructor;

		//static NAN_METHOD(GetStreamId);
		//static v8::Handle<Value> GetStreamId(v8::Local<v8::String> property, const v8::AccessorInfo& info);

		static NAN_GETTER(GetStreamId);
		static NAN_SETTER(SetStreamId);

		static NAN_METHOD(RescaleRound);

		static NAN_METHOD(New);
		packet();
	};
}

#endif