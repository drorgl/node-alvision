#include "./stream.h"

namespace alvision{

	Nan::Persistent<FunctionTemplate> stream::constructor;

	void stream::Init(Nan::ADDON_REGISTER_FUNCTION_ARGS_TYPE target, std::shared_ptr<overload_resolution> overload){
		

		//Class
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(stream::New);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New("stream").ToLocalChecked());

		Nan::SetPrototypeMethod(ctor, "Decode", Decode);
		Nan::SetPrototypeMethod(ctor, "Encode", Encode);
		Nan::SetPrototypeMethod(ctor, "AddFilter", AddFilter);

		target->Set(Nan::New("stream").ToLocalChecked(), ctor->GetFunction());

	};

	NAN_METHOD(stream::New) {
		
		if (!info.IsConstructCall())
			return Nan::ThrowTypeError("Cannot call constructor as function");

		//return NanThrowTypeError("cannot initialize stream directly, please see ffmpeg.GetStreams or ffmpeg.AddStream");

		stream *st;
		st = new stream(NULL, "", std::weak_ptr<ffmpegcpp::stream>());

		st->Wrap(info.This());
		info.GetReturnValue().Set(info.This());
	}

	//possible bug
	Local<Object> stream::Instantiate(ffmpeg * ffmpeg_, std::string streamid_, std::weak_ptr<ffmpegcpp::stream> stream_)
	{
		

		auto st = Nan::New(stream::constructor)->GetFunction()->NewInstance();
		stream *stinst = ObjectWrap::Unwrap<stream>(st);
		stinst->_ffmpeg = ffmpeg_;
		stinst->_streamid = streamid_;
		stinst->_stream = stream_;

		stinst->ApplyV8Object(st);
		return st;
		/*stream *st;
		st = new stream(ffmpeg_, streamid_, stream_);

		auto newobj = Nan::New<Object>();
		
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


		obj->Set(Nan::New("id").ToLocalChecked(), Nan::New(_streamid).ToLocalChecked());

		switch (codec->mediaType())
		{
		case ffmpegcpp::mediaType::video:
			obj->Set(Nan::New("mediatype").ToLocalChecked(), Nan::New("video").ToLocalChecked());
			obj->Set(Nan::New("width").ToLocalChecked(), Nan::New(codec->width()));
			obj->Set(Nan::New("height").ToLocalChecked(), Nan::New(codec->height()));
			obj->Set(Nan::New("gop_size").ToLocalChecked(), Nan::New(codec->gop_size()));
			obj->Set(Nan::New("pixfmt").ToLocalChecked(), Nan::New(ffmpegcpp::getPixelFormatName(codec->pix_fmt())).ToLocalChecked());
			break;
		case ffmpegcpp::mediaType::audio:
			obj->Set(Nan::New("mediatype").ToLocalChecked(), Nan::New("audio").ToLocalChecked());
			obj->Set(Nan::New("channels").ToLocalChecked(), Nan::New(codec->channels()));
			obj->Set(Nan::New("channelslayout").ToLocalChecked(), Nan::New(ffmpegcpp::getChannelLayoutName(codec->channels_layout())).ToLocalChecked());

			obj->Set(Nan::New("samplefmt").ToLocalChecked(), Nan::New(ffmpegcpp::getSampleFormatName(codec->sample_fmt())).ToLocalChecked());
			obj->Set(Nan::New("samplerate").ToLocalChecked(), Nan::New(codec->sample_rate()));
			break;
		case ffmpegcpp::mediaType::attachment:
			obj->Set(Nan::New("mediatype").ToLocalChecked(), Nan::New("attachment").ToLocalChecked());
			break;
		case ffmpegcpp::mediaType::data:
			obj->Set(Nan::New("mediatype").ToLocalChecked(), Nan::New("data").ToLocalChecked());
			break;
		case ffmpegcpp::mediaType::nb:
			obj->Set(Nan::New("mediatype").ToLocalChecked(), Nan::New("nb").ToLocalChecked());
			break;
		case ffmpegcpp::mediaType::subtitle:
			obj->Set(Nan::New("mediatype").ToLocalChecked(), Nan::New("subtitle").ToLocalChecked());
			break;
		case ffmpegcpp::mediaType::unknown:
			obj->Set(Nan::New("mediatype").ToLocalChecked(), Nan::New("unknown").ToLocalChecked());
			break;
		}

		obj->Set(Nan::New("framerate").ToLocalChecked(), Nan::New(stream->r_frame_rate().toDouble()));
		obj->Set(Nan::New("codec").ToLocalChecked(), Nan::New(codec->name()).ToLocalChecked());
		obj->Set(Nan::New("timebase").ToLocalChecked(), Nan::New(stream->time_base().toDouble()));
		obj->Set(Nan::New("bitrate").ToLocalChecked(), Nan::New(codec->bit_rate()));
		obj->Set(Nan::New("streamindex").ToLocalChecked(), Nan::New(stream->index()));
	}

	NAN_METHOD(stream::AddFilter)
	{
		SETUP_FUNCTION(stream);

		if (self->_ffmpeg == NULL){
			return Nan::ThrowError("cannot add filter, instance does not exist");
		}

		Nan::Utf8String filtername((!info[0]->IsNull() && !info[0]->IsUndefined()) ? info[0]->ToString() : Nan::EmptyString());
		Nan::Utf8String filterParams((!info[1]->IsNull() && !info[1]->IsUndefined()) ? info[1]->ToString() : Nan::EmptyString());

		if (*filtername == ""){
			return Nan::ThrowError("you must provide at least filter name, see ListFilters for a list of filters");
		}

		auto stream = self->_stream.lock();
		if (stream == nullptr){
			return Nan::ThrowError("cannot add filter, stream does not exist");
		}

		try{
			std::shared_ptr<ffmpegcpp::bitstreamfilter> bsfilter = std::make_shared<ffmpegcpp::bitstreamfilter>(*filtername, *filterParams, stream->getCodec());
			stream->addBitstreamFilter(bsfilter);
		}
		catch (ffmpegcpp::ffmpeg_exception ffe){
			return Nan::ThrowError(ffe.what());
		}
		catch (std::exception ex){
			return Nan::ThrowError(ex.what());
		}

		info.GetReturnValue().Set(Nan::New(true));
	}

	NAN_METHOD(stream::Decode)
	{
		SETUP_FUNCTION(stream);

		if (self->_ffmpeg == NULL){
			return Nan::ThrowError("cannot decode, ffmpeg instance does not exist");
		}

		if (self->_ffmpeg->_openedAsOutput){
			return Nan::ThrowError("cannot decode an output, decoding is possible only for inputs");
		}

		if (info.Length() < 3){
			return Nan::ThrowError("ffmpeg.Decode(packet,streamInfo{id:decodeFromStream, decoding parameters for destination Matrix...},Matrix);");
		}



		//packet
		packet *pt = ObjectWrap::Unwrap<packet>(info[0]->ToObject());
		if (pt == NULL){
			return Nan::ThrowError("first argument must be a packet");
		}

		//output stream information
		auto streamInfo = (!info[1]->IsNull() && !info[1]->IsUndefined()) ? info[1]->ToObject() : Nan::New<Object>();

		//Nan::Utf8String inputStreamId(streamInfo->Get(Nan::New("id"))->ToString());
		//auto inputStreamId = std::to_string(pt->_packet->stream_index());



		//mat
		Matrix *mat = ObjectWrap::Unwrap<Matrix>(info[2]->ToObject());
		if (mat == NULL){
			return Nan::ThrowError("third argument must be a Matrix");
		}

		bool decoded = false;
		int samplesRead = 0;

		try
		{
			auto stream = self->_stream.lock();

			if (stream == nullptr)
			{
				return Nan::ThrowError("decode failed, stream is no longer valid");
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
				auto channelslayout = ffmpegcpp::getChannelLayoutByName(*Nan::Utf8String(streamInfo->Get(Nan::New("channelslayout").ToLocalChecked())->ToString()));
				auto channels = streamInfo->Get(Nan::New("channels").ToLocalChecked())->Int32Value();
				auto samplefmt = ffmpegcpp::getSampleFormatByName(*Nan::Utf8String(streamInfo->Get(Nan::New("samplefmt").ToLocalChecked())->ToString()));
				auto samplerate = streamInfo->Get(Nan::New("samplerate").ToLocalChecked())->Int32Value();

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
				int width = streamInfo->Get(Nan::New("width").ToLocalChecked())->Int32Value();
				int height = streamInfo->Get(Nan::New("height").ToLocalChecked())->Int32Value();
				//pixelformat =

				if (mat->_mat->cols != width || mat->_mat->rows != height) {
					throw std::exception("mat rows or cols do not match the stream");
				}

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
			return Nan::ThrowError(ffe.what());
		}
		catch (std::exception ex){
			return Nan::ThrowError(ex.what());
		}

		auto retval = Nan::New<Object>();
		retval->Set(Nan::New("succeeded").ToLocalChecked(), Nan::New(decoded));
		retval->Set(Nan::New("SamplesRead").ToLocalChecked(), Nan::New(samplesRead));

		info.GetReturnValue().Set(retval);
	}

	NAN_METHOD(stream::Encode)
	{
		SETUP_FUNCTION(stream);

		if (self->_ffmpeg == NULL){
			return Nan::ThrowError("cannot encode, ffmpeg instance does not exist");
		}

		if (self->_ffmpeg->_openedAsInput){
			return Nan::ThrowError("cannot encode to input, encoding is possible only for outputs");
		}

		if (info.Length() < 3){
			return Nan::ThrowError("ffmpeg.Encode(outputstream, frameinfo, mat);");
			//return Nan::ThrowError("ffmpeg.Encode(packet,streamInfo{id:encodeToStream, encoding parameters for source Matrix...},Matrix);");
		}

		auto outputStreamInfo = (!info[0]->IsNull() && !info[0]->IsUndefined()) ? info[0]->ToObject() : Nan::New<Object>();
		Nan::Utf8String outputStreamId(outputStreamInfo->Get(Nan::New("id").ToLocalChecked())->ToString());

		//output stream information
		//auto streamInfo = (!info[1]->IsNull() && !info[1]->IsUndefined()) ? info[1]->ToObject() : Nan::New<Object>();
		auto frameInfo = (!info[1]->IsNull() && !info[1]->IsUndefined()) ? info[1]->ToObject() : Nan::New<Object>();

		//mat
		Matrix *mat = ObjectWrap::Unwrap<Matrix>(info[2]->ToObject());
		if (mat == NULL){
			return Nan::ThrowError("third argument must be a Matrix");
		}
		if (mat->_mat == nullptr){
			return Nan::ThrowError("Matrix is in invalid state, the object exists but mat is not");
		}

		bool encoded = false;

		try
		{
			auto stream = self->_stream.lock();// (*self->_ffmpegStreams)[*outputStreamId];

			if (stream == nullptr)
			{
				return Nan::ThrowError("encode failed, stream instance is no longer valid");
			}

			auto output_codec = stream->getCodec();

			ffmpegcpp::frame output_frame;
			ffmpegcpp::packet output_packet;
			//encoded = stream->encoder()->encode(*pt->_packet, input_frame);

			switch (stream->getCodec()->mediaType()){
			case ffmpegcpp::mediaType::audio:
			{
				auto channelslayout = ffmpegcpp::getChannelLayoutByName(*Nan::Utf8String(outputStreamInfo->Get(Nan::New("channelslayout").ToLocalChecked())->ToString()));
				auto channels = outputStreamInfo->Get(Nan::New("channels").ToLocalChecked())->Int32Value();
				auto samplefmt = ffmpegcpp::getSampleFormatByName(*Nan::Utf8String(outputStreamInfo->Get(Nan::New("samplefmt").ToLocalChecked())->ToString()));
				auto samplerate = outputStreamInfo->Get(Nan::New("samplerate").ToLocalChecked())->Int32Value();

				if (frameInfo->Get(Nan::New("SamplesRead").ToLocalChecked())->IsUndefined())
				{
					return Nan::ThrowError("for encoding audio, SamplesRead property must be provided inside frameInfo, this parameter specifies how much of the matrix to encode as the number of samples can be different");
				}

				auto samplesRead = frameInfo->Get(Nan::New("SamplesRead").ToLocalChecked())->Int32Value();

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
				int width = outputStreamInfo->Get(Nan::New("width").ToLocalChecked())->Int32Value();
				int height = outputStreamInfo->Get(Nan::New("height").ToLocalChecked())->Int32Value();
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
			return Nan::ThrowError(ffe.what());
		}
		catch (std::exception ex){
			return Nan::ThrowError(ex.what());
		}


		auto retval = Nan::New<Object>();
		retval->Set(Nan::New("succeeded").ToLocalChecked(), Nan::New(encoded));

		info.GetReturnValue().Set(retval);
	}

}