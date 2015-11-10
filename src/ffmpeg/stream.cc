#include "stream.h"

namespace alvision{

	v8::Persistent<FunctionTemplate> stream::constructor;

	void stream::Init(Handle<Object> target) {
		NanScope();

		//Class
		Local<FunctionTemplate> ctor = NanNew<FunctionTemplate>(stream::New);
		NanAssignPersistent(constructor, ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(NanNew("stream"));

		NODE_SET_PROTOTYPE_METHOD(ctor, "Decode", Decode);
		NODE_SET_PROTOTYPE_METHOD(ctor, "Encode", Encode);

		NODE_SET_PROTOTYPE_METHOD(ctor, "AddFilter", AddFilter);

		target->Set(NanNew("stream"), ctor->GetFunction());

	};

	NAN_METHOD(stream::New) {
		NanScope();
		if (!args.IsConstructCall())
			return NanThrowTypeError("Cannot call constructor as function");

		//return NanThrowTypeError("cannot initialize stream directly, please see ffmpeg.GetStreams or ffmpeg.AddStream");

		stream *st;
		st = new stream(NULL, "", std::weak_ptr<ffmpegcpp::stream>());

		st->Wrap(args.This());
		return args.This();
	}

	//possible bug
	Local<Object> stream::Instantiate(ffmpeg * ffmpeg_, std::string streamid_, std::weak_ptr<ffmpegcpp::stream> stream_)
	{
		NanScope();

		auto st = stream::constructor->GetFunction()->NewInstance();
		stream *stinst = ObjectWrap::Unwrap<stream>(st);
		stinst->_ffmpeg = ffmpeg_;
		stinst->_streamid = streamid_;
		stinst->_stream = stream_;

		stinst->ApplyV8Object(st);
		return st;
		/*stream *st;
		st = new stream(ffmpeg_, streamid_, stream_);

		auto newobj = NanNew<Object>();
		
		st->Wrap(newobj);
		st->ApplyV8Object(newobj);
		return newobj;*/
	}


	stream::stream(ffmpeg * ffmpeg, std::string streamid, std::weak_ptr<ffmpegcpp::stream> stream) : ObjectWrap() {
		_stream = stream;
		_ffmpeg = ffmpeg;
		_streamid = streamid;
	}

	void stream::ApplyV8Object(v8::Local<Object> obj)
	{
		auto stream = _stream.lock();

		auto codec = stream->getCodec();

		obj->Set(NanNew("id"), NanNew(_streamid));

		switch (codec->mediaType())
		{
		case ffmpegcpp::mediaType::video:
			obj->Set(NanNew("mediatype"), NanNew("video"));
			obj->Set(NanNew("width"), NanNew(codec->width()));
			obj->Set(NanNew("height"), NanNew(codec->height()));
			obj->Set(NanNew("gop_size"), NanNew(codec->gop_size()));
			obj->Set(NanNew("pixfmt"), NanNew(ffmpegcpp::getPixelFormatName(codec->pix_fmt())));
			break;
		case ffmpegcpp::mediaType::audio:
			obj->Set(NanNew("mediatype"), NanNew("audio"));
			obj->Set(NanNew("channels"), NanNew(codec->channels()));
			obj->Set(NanNew("channelslayout"), NanNew(ffmpegcpp::getChannelLayoutName(codec->channels_layout())));

			obj->Set(NanNew("samplefmt"), NanNew(ffmpegcpp::getSampleFormatName(codec->sample_fmt())));
			obj->Set(NanNew("samplerate"), NanNew(codec->sample_rate()));
			break;
		case ffmpegcpp::mediaType::attachment:
			obj->Set(NanNew("mediatype"), NanNew("attachment"));
			break;
		case ffmpegcpp::mediaType::data:
			obj->Set(NanNew("mediatype"), NanNew("data"));
			break;
		case ffmpegcpp::mediaType::nb:
			obj->Set(NanNew("mediatype"), NanNew("nb"));
			break;
		case ffmpegcpp::mediaType::subtitle:
			obj->Set(NanNew("mediatype"), NanNew("subtitle"));
			break;
		case ffmpegcpp::mediaType::unknown:
			obj->Set(NanNew("mediatype"), NanNew("unknown"));
			break;
		}

		obj->Set(NanNew("framerate"), NanNew(stream->r_frame_rate().toDouble()));
		obj->Set(NanNew("codec"), NanNew(codec->name()));
		obj->Set(NanNew("timebase"), NanNew(stream->time_base().toDouble()));
		obj->Set(NanNew("bitrate"), NanNew(codec->bit_rate()));
		obj->Set(NanNew("streamindex"), NanNew(stream->index()));
	}

	NAN_METHOD(stream::AddFilter)
	{
		SETUP_FUNCTION(stream);

		if (self->_ffmpeg == NULL){
			return NanThrowError("cannot add filter, instance does not exist");
		}

		NanUtf8String filtername((!args[0]->IsNull() && !args[0]->IsUndefined()) ? args[0]->ToString() : NanNew(""));
		NanUtf8String filterParams((!args[1]->IsNull() && !args[1]->IsUndefined()) ? args[1]->ToString() : NanNew(""));

		if (*filtername == ""){
			return NanThrowError("you must provide at least filter name, see ListFilters for a list of filters");
		}

		auto stream = self->_stream.lock();
		if (stream == nullptr){
			return NanThrowError("cannot add filter, stream does not exist");
		}

		try{
			std::shared_ptr<ffmpegcpp::bitstreamfilter> bsfilter = std::make_shared<ffmpegcpp::bitstreamfilter>(*filtername, *filterParams, stream->getCodec());
			stream->addBitstreamFilter(bsfilter);
		}
		catch (ffmpegcpp::ffmpeg_exception ffe){
			return NanThrowError(ffe.what());
		}
		catch (std::exception ex){
			return NanThrowError(ex.what());
		}

		NanReturnValue(NanNew(true));
	}

	NAN_METHOD(stream::Decode)
	{
		SETUP_FUNCTION(stream);

		if (self->_ffmpeg == NULL){
			return NanThrowError("cannot decode, ffmpeg instance does not exist");
		}

		if (self->_ffmpeg->_openedAsOutput){
			return NanThrowError("cannot decode an output, decoding is possible only for inputs");
		}

		if (args.Length() < 3){
			return NanThrowError("ffmpeg.Decode(packet,streamInfo{id:decodeFromStream, decoding parameters for destination Matrix...},Matrix);");
		}



		//packet
		packet *pt = ObjectWrap::Unwrap<packet>(args[0]->ToObject());
		if (pt == NULL){
			return NanThrowError("first argument must be a packet");
		}

		//output stream information
		auto streamInfo = (!args[1]->IsNull() && !args[1]->IsUndefined()) ? args[1]->ToObject() : NanNew<Object>();

		//NanUtf8String inputStreamId(streamInfo->Get(NanNew("id"))->ToString());
		//auto inputStreamId = std::to_string(pt->_packet->stream_index());



		//mat
		Matrix *mat = ObjectWrap::Unwrap<Matrix>(args[2]->ToObject());
		if (mat == NULL){
			return NanThrowError("third argument must be a Matrix");
		}

		bool decoded = false;
		int samplesRead = 0;

		try
		{
			auto stream = self->_stream.lock();

			if (stream == nullptr)
			{
				return NanThrowError("decode failed, stream is no longer valid");
			}


			ffmpegcpp::frame input_frame;
			decoded = stream->getDecoder()->decode(*pt->_packet, input_frame);

			/*if (_converter == nullptr)
			{
			self->_converters = std::make_shared < std::map<std::string, std::shared_ptr<ffmpegcpp::swscale>>>();
			}*/

			switch (stream->getCodec()->mediaType()){
			case ffmpegcpp::mediaType::audio:
			{
				auto channelslayout = ffmpegcpp::getChannelLayoutByName(*NanUtf8String(streamInfo->Get(NanNew("channelslayout"))->ToString()));
				auto channels = streamInfo->Get(NanNew("channels"))->Int32Value();
				auto samplefmt = ffmpegcpp::getSampleFormatByName(*NanUtf8String(streamInfo->Get(NanNew("samplefmt"))->ToString()));
				auto samplerate = streamInfo->Get(NanNew("samplerate"))->Int32Value();

				if (self->_converter == nullptr){
					self->_converter = ffmpegcpp::swscale::fromAudioCodec(stream->getCodec(), channelslayout, channels, samplefmt, samplerate);
				}

				if (decoded){
					self->_converter->scaleAudio(&input_frame, *mat->_mat, samplesRead);
				}
			}
				break;
			case ffmpegcpp::mediaType::video:
			{
				int width = streamInfo->Get(NanNew("width"))->Int32Value();
				int height = streamInfo->Get(NanNew("height"))->Int32Value();
				//pixelformat =

				if (self->_converter == nullptr){
					self->_converter = ffmpegcpp::swscale::fromVideoCodec(stream->getCodec(), width, height);
				}

				if (decoded){
					self->_converter->scaleVideo(&input_frame, *mat->_mat);
				}
			}
				break;
			}

			//convert to destination mat

		}
		catch (ffmpegcpp::ffmpeg_exception ffe){
			return NanThrowError(ffe.what());
		}
		catch (std::exception ex){
			return NanThrowError(ex.what());
		}

		auto retval = NanNew<Object>();
		retval->Set(NanNew("succeeded"), NanNew(decoded));
		retval->Set(NanNew("SamplesRead"), NanNew(samplesRead));

		NanReturnValue(retval);

	}

	NAN_METHOD(stream::Encode)
	{
		SETUP_FUNCTION(stream);

		if (self->_ffmpeg == NULL){
			return NanThrowError("cannot encode, ffmpeg instance does not exist");
		}

		if (self->_ffmpeg->_openedAsInput){
			return NanThrowError("cannot encode to input, encoding is possible only for outputs");
		}

		if (args.Length() < 3){
			return NanThrowError("ffmpeg.Encode(outputstream, frameinfo, mat);");
			//return NanThrowError("ffmpeg.Encode(packet,streamInfo{id:encodeToStream, encoding parameters for source Matrix...},Matrix);");
		}

		auto outputStreamInfo = (!args[0]->IsNull() && !args[0]->IsUndefined()) ? args[0]->ToObject() : NanNew<Object>();
		NanUtf8String outputStreamId(outputStreamInfo->Get(NanNew("id"))->ToString());

		//output stream information
		//auto streamInfo = (!args[1]->IsNull() && !args[1]->IsUndefined()) ? args[1]->ToObject() : NanNew<Object>();
		auto frameInfo = (!args[1]->IsNull() && !args[1]->IsUndefined()) ? args[1]->ToObject() : NanNew<Object>();

		//mat
		Matrix *mat = ObjectWrap::Unwrap<Matrix>(args[2]->ToObject());
		if (mat == NULL){
			return NanThrowError("third argument must be a Matrix");
		}
		if (mat->_mat == nullptr){
			return NanThrowError("Matrix is in invalid state, the object exists but mat is not");
		}

		bool encoded = false;

		try
		{
			auto stream = self->_stream.lock();// (*self->_ffmpegStreams)[*outputStreamId];

			if (stream == nullptr)
			{
				return NanThrowError("encode failed, stream instance is no longer valid");
			}

			auto output_codec = stream->getCodec();

			ffmpegcpp::frame output_frame;
			ffmpegcpp::packet output_packet;
			//encoded = stream->encoder()->encode(*pt->_packet, input_frame);

			switch (stream->getCodec()->mediaType()){
			case ffmpegcpp::mediaType::audio:
			{
				auto channelslayout = ffmpegcpp::getChannelLayoutByName(*NanUtf8String(outputStreamInfo->Get(NanNew("channelslayout"))->ToString()));
				auto channels = outputStreamInfo->Get(NanNew("channels"))->Int32Value();
				auto samplefmt = ffmpegcpp::getSampleFormatByName(*NanUtf8String(outputStreamInfo->Get(NanNew("samplefmt"))->ToString()));
				auto samplerate = outputStreamInfo->Get(NanNew("samplerate"))->Int32Value();

				if (frameInfo->Get(NanNew("SamplesRead"))->IsUndefined())
				{
					return NanThrowError("for encoding audio, SamplesRead property must be provided inside frameInfo, this parameter specifies how much of the matrix to encode as the number of samples can be different");
				}

				auto samplesRead = frameInfo->Get(NanNew("SamplesRead"))->Int32Value();

				if (self->_converter == nullptr){
					self->_converter = ffmpegcpp::swscale::toAudioCodec(output_codec, channelslayout, channels, samplefmt, samplerate);
				}


				output_frame.set_audio_parameters(output_codec->channels(), output_codec->sample_fmt(), output_codec->channels_layout(), output_codec->sample_rate(), samplesRead);
				output_frame.get_buffer(64);

				//TODO: fix scaleaudio
				self->_converter->scaleAudio(&output_frame, *mat->_mat, samplesRead);

				if (stream->getEncoder()->encode(&output_frame, &output_packet)){
					if (!self->_ffmpeg->_outputWroteHeader){
						self->_ffmpeg->_ffmpegContext->write_header();
						self->_ffmpeg->_outputWroteHeader = true;
					}

					self->_ffmpeg->_ffmpegContext->write_packet_interleaved(output_packet);
					encoded = true;
				}
			}
				break;
			case ffmpegcpp::mediaType::video:
			{
				int width = outputStreamInfo->Get(NanNew("width"))->Int32Value();
				int height = outputStreamInfo->Get(NanNew("height"))->Int32Value();
				//pixelformat =

				if (self->_converter == nullptr){
					self->_converter = ffmpegcpp::swscale::toVideoCodec(output_codec, width, height);
				}

				output_frame.set_video_parameters(output_codec->width(), output_codec->height(), output_codec->pix_fmt());
				output_frame.get_buffer(64);

				self->_converter->scaleVideo(&output_frame, *mat->_mat);

				if (stream->getEncoder()->encode(&output_frame, &output_packet)){
					if (!self->_ffmpeg->_outputWroteHeader){
						self->_ffmpeg->_ffmpegContext->write_header();
						self->_ffmpeg->_outputWroteHeader = true;
					}

					self->_ffmpeg->_ffmpegContext->write_packet_interleaved(output_packet);
					encoded = true;
				}


			}
				break;
			}


		}
		catch (ffmpegcpp::ffmpeg_exception ffe){
			return NanThrowError(ffe.what());
		}
		catch (std::exception ex){
			return NanThrowError(ex.what());
		}


		auto retval = NanNew<Object>();
		retval->Set(NanNew("succeeded"), NanNew(encoded));

		NanReturnValue(retval);
	}

}