#ifndef _ALVISION_STREAM_H_
#define _ALVISION_STREAM_H_

#include "../alvision.h"
#include "ffmpeg.h"
#include "packet.h"
#include "../opencv/Matrix.h"

namespace alvision{
	class ffmpeg;

	class stream : public Nan::ObjectWrap {
	private:



	public:
		static void Init(Handle<Object> target);

		std::string _streamid;
		std::weak_ptr<ffmpegcpp::stream> _stream;
		ffmpeg * _ffmpeg;
		std::shared_ptr<ffmpegcpp::swscale> _converter = nullptr;

		static Nan::Persistent<FunctionTemplate> constructor;

		static Local<Object> Instantiate(ffmpeg * ffmpeg_, std::string streamid_, std::weak_ptr<ffmpegcpp::stream> stream_);

		void ApplyV8Object(v8::Local<Object> obj);

		static NAN_METHOD(Decode);
		static NAN_METHOD(Encode);

		static NAN_METHOD(New);

		static NAN_METHOD(AddFilter);

		stream(ffmpeg * ffmpeg, std::string streamid, std::weak_ptr<ffmpegcpp::stream> stream);
	};

}

#endif