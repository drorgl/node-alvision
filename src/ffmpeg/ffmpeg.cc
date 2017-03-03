#include "ffmpeg.h"
#include "packet.h"
#include "../opencv/Matrix.h"

namespace alvision{

	Nan::Persistent<FunctionTemplate> ffmpeg::constructor;
	Nan::Persistent<v8::Function> ffmpeg::_logger;
	threadsafe_queue<ffmpeg::log_message> ffmpeg::_log_messages;

	std::shared_ptr<uvasync> ffmpeg::_logger_async;

	void ffmpeg::_ffmpeg_logger(std::string module, int level, std::string message)
	{
		if (!_logger.IsEmpty()){
			_log_messages.enqueue(ffmpeg::log_message{ module, level, message });

			if (_logger_async != nullptr){
				_logger_async->signal();
			}
		}
	}

	NAN_MODULE_INIT(ffmpeg::Init) {

		//Class
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(ffmpeg::New);
		constructor.Reset(ctor);
		//NanAssignPersistent(constructor, ctor);
		//constructor.reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New("ffmpeg").ToLocalChecked());

		// Prototype
		Nan::SetMethod(ctor, "ListInputFormats", ListInputFormats);
		Nan::SetMethod(ctor, "ListOutputFormats", ListOutputFormats);

		Nan::SetMethod(ctor, "SetLogger", SetLogger);

		Nan::SetMethod(ctor, "ListCodecs", ListCodecs);
		Nan::SetMethod(ctor, "ListDevices", ListDevices);
		Nan::SetMethod(ctor, "ListFilters", ListFilters);

		Nan::SetMethod(ctor, "OpenAsInput", OpenAsInput);
		Nan::SetMethod(ctor, "OpenAsOutput", OpenAsOutput);
		Nan::SetMethod(ctor, "OpenAsOutputBuffer", OpenAsOutputBuffer);

	

		Nan::SetPrototypeMethod(ctor, "getNextBufferSizes", getNextBufferSizes);
		Nan::SetPrototypeMethod(ctor, "getNextBuffer", getNextBuffer);

		Nan::SetPrototypeMethod(ctor, "GetSDP", GetSDP);

		Nan::SetPrototypeMethod(ctor, "Close", Close);

		Nan::SetPrototypeMethod(ctor, "GetStreams", GetStreams);
		Nan::SetPrototypeMethod(ctor, "AddStream", AddStream);

		Nan::SetPrototypeMethod(ctor, "WriteHeader", WriteHeader);

		Nan::SetPrototypeMethod(ctor, "WritePacket", WritePacket);
		Nan::SetPrototypeMethod(ctor, "ReadPacket", ReadPacket);

		Nan::Set(target, Nan::New("ffmpeg").ToLocalChecked(), ctor->GetFunction());

		_logger_async = std::make_shared<uvasync>(_async_logger_callback);

		ffmpegcpp::ffmpeg::setLogger(_ffmpeg_logger);

	};

	NAN_METHOD( ffmpeg::New ) {
		if (!info.IsConstructCall())
			return Nan::ThrowTypeError("Cannot call constructor as function");

		/*if (args.This()->InternalFieldCount() == 0)
			NanThrowTypeError("Cannot instantiate without new");*/

		ffmpeg *fm;
		fm = new ffmpeg;

		fm->Wrap(info.This());
		info.GetReturnValue().Set(info.This());
	}


	ffmpeg::ffmpeg() : ObjectWrap() {
		_ffmpeg = std::make_shared<ffmpegcpp::ffmpeg>();
	}

	
	NAN_METHOD(ffmpeg::SetLogger)
	{

		auto cb = info[0].As<v8::Function>();
		//Local<Function> cb = info. Local<Function>::Cast(args[0]);

		//if we already have a logger, release it
		if (!_logger.IsEmpty()){
			_logger.Reset();
		}

		if (info.Length() > 0 && info[0]->IsFunction()){
			_logger.Reset(cb);
		}

		info.GetReturnValue().Set(Nan::Undefined());
	}

	void ffmpeg::_async_logger_callback(uv_async_t *handle)
	{
		
		log_message lm;
		Nan::Callback *callback = new Nan::Callback(Nan::New(_logger));

		while (_log_messages.dequeue(lm))
		{
			if (!callback->IsEmpty() && !_logger.IsEmpty() && _logger_async != nullptr && _logger_async->isActive()){
				v8::Local<v8::Value> argv[] = {
					Nan::New(lm.module).ToLocalChecked(),
					Nan::New(lm.level),
					Nan::New(lm.message).ToLocalChecked()
				};
				callback->Call(3, argv);
			}
		}


	}


	Local<Object> ffmpeg::fromFFMpegOptions(std::vector<ffmpegcpp::option> &options)
	{
		Local<Array> retoptions = Nan::New<Array>();
		int i = 0;
		for (auto option : options)
		{
			Local<Object> opt = Nan::New<Object>();
			opt->Set(Nan::New("name").ToLocalChecked(), Nan::New(option.name).ToLocalChecked());
			opt->Set(Nan::New("help").ToLocalChecked(), Nan::New(option.help).ToLocalChecked());
			opt->Set(Nan::New("type").ToLocalChecked(), Nan::New(ffmpegcpp::getOptionTypeName(option.type)).ToLocalChecked());
			switch (option.default_val.source_type())
			{
			case ffmpegcpp::variant_source_type::dbl:
				opt->Set(Nan::New("default_val").ToLocalChecked(), Nan::New(option.default_val.todbl()));
				break;
			case ffmpegcpp::variant_source_type::i64:
				//TODO: this may throw if indeed int64 is returned, need to convert to string??
				opt->Set(Nan::New("default_val").ToLocalChecked(), Nan::New(safe_cast<int>(option.default_val.toi64())));
				break;
			case ffmpegcpp::variant_source_type::q:
				opt->Set(Nan::New("default_val").ToLocalChecked(), Nan::New(option.default_val.todbl()));
				break;
			case ffmpegcpp::variant_source_type::str:
				opt->Set(Nan::New("default_val").ToLocalChecked(), Nan::New(option.default_val.tostr()).ToLocalChecked());
				break;
			}
			opt->Set(Nan::New("min")  .ToLocalChecked(), Nan::New(option.min));
			opt->Set(Nan::New("max")  .ToLocalChecked(), Nan::New(option.max));
			opt->Set(Nan::New("flags").ToLocalChecked(), Nan::New(option.flags));
			opt->Set(Nan::New("unit") .ToLocalChecked(), Nan::New(option.unit).ToLocalChecked());

			retoptions->Set(i, opt);
			i++;
		}
		//return NanEscapeScope(retoptions);
		return retoptions;
	}

	Local<Object> ffmpeg::fromFFMpegComponent(ffmpegcpp::component comp)
	{
		//
		Local<Object> ret = Nan::New<Object>();

		ret->Set(Nan::New("name")		.ToLocalChecked(), Nan::New(comp.name).ToLocalChecked());
		ret->Set(Nan::New("long_name")	.ToLocalChecked(), Nan::New(comp.long_name).ToLocalChecked());
		ret->Set(Nan::New("extensions")	.ToLocalChecked(), Nan::New(comp.extensions).ToLocalChecked());
		ret->Set(Nan::New("mime_type")	.ToLocalChecked(), Nan::New(comp.mime_type).ToLocalChecked());
		ret->Set(Nan::New("flags")		.ToLocalChecked(), Nan::New(ffmpegcpp::getComponentFlags(comp.flags)).ToLocalChecked());
		ret->Set(Nan::New("options")	.ToLocalChecked(), fromFFMpegOptions(comp.options));

		//return NanEscapeScope(ret);
		return ret;
	}

	class ffmpeg::AsyncListInputFormatsWorker : public Nan::AsyncWorker{
	public:
		AsyncListInputFormatsWorker(Nan::Callback *callback)
			: Nan::AsyncWorker(callback), _inputFormats(){}
		~AsyncListInputFormatsWorker() {}

		void Execute() {
			//need one local instance active to make sure all ffmpeg initialization is done. 
			ffmpegcpp::ffmpeg ffm;
			try{
				ffmpegcpp::formatcontext::listInputFormats(_inputFormats);
			}
			catch (ffmpegcpp::ffmpeg_exception ffe){
				std::string err = "ffmpeg: ";
				err.append(ffe.what());
				SetErrorMessage(err.c_str());
			}
			catch (std::exception ex){
				SetErrorMessage(ex.what());
			}

		}

		// Executed when the async work is complete
		// this function will be run inside the main event loop
		// so it is safe to use V8 again
		void HandleOKCallback() {
			

			Local<Array> res = Nan::New<Array>();
			try{
				int i = 0;

				for (auto input : _inputFormats)
				{
					res->Set(i, ffmpeg::fromFFMpegComponent(input));
					i++;
				}
			}
			catch (std::exception ex){
				//stacktrace::getstacktrace(err);

				v8::Local<v8::Value> argv[] = {
					v8::Exception::Error(Nan::New<v8::String>(ex.what()).ToLocalChecked())
				};
				callback->Call(1, argv);
				return;
			}

		{
			Local<Value> argv[] = {
				Nan::Null()
				, res
			};

			Nan::TryCatch try_catch;
			callback->Call(2, argv);
			if (try_catch.HasCaught()) {
				Nan::FatalException(try_catch);
			}
		}
		}

	private:
		std::vector<ffmpegcpp::component> _inputFormats;
	};

	NAN_METHOD(ffmpeg::ListInputFormats){
		auto cb = info[0].As<Function>();

		Nan::Callback *callback = new Nan::Callback(cb.As<Function>());
		Nan::AsyncQueueWorker(new AsyncListInputFormatsWorker(callback));

		info.GetReturnValue().Set(Nan::Undefined());
	}

	class ffmpeg::AsyncListOutputFormatsWorker : public Nan::AsyncWorker{
	public:
		AsyncListOutputFormatsWorker(Nan::Callback *callback)
			: Nan::AsyncWorker(callback), _outputFormats(){}
		~AsyncListOutputFormatsWorker() {}

		void Execute() {
			//need one local instance active to make sure all ffmpeg initialization is done. 
			ffmpegcpp::ffmpeg ffm;
			try{
				ffmpegcpp::formatcontext::listOutputFormats(_outputFormats);
			}
			catch (ffmpegcpp::ffmpeg_exception ffe){
				std::string err = "ffmpeg: ";
				err.append(ffe.what());
				SetErrorMessage(err.c_str());
			}
			catch (std::exception ex){
				SetErrorMessage(ex.what());
			}

		}

		// Executed when the async work is complete
		// this function will be run inside the main event loop
		// so it is safe to use V8 again
		void HandleOKCallback() {
			

			Local<Array> res = Nan::New<Array>();
			try{
				int i = 0;

				for (auto output : _outputFormats)
				{
					res->Set(i, ffmpeg::fromFFMpegComponent(output));
					i++;
				}
			}
			catch (std::exception ex){
				//stacktrace::getstacktrace(err);

				v8::Local<v8::Value> argv[] = {
					v8::Exception::Error(Nan::New<v8::String>(ex.what()).ToLocalChecked())
				};
				callback->Call(1, argv);
				return;
			}

		{
			Local<Value> argv[] = {
				Nan::Null()
				, res
			};

			Nan::TryCatch try_catch;
			callback->Call(2, argv);
			if (try_catch.HasCaught()) {
				Nan::FatalException(try_catch);
			}
		}
		}

	private:
		std::vector<ffmpegcpp::component> _outputFormats;
	};

	NAN_METHOD(ffmpeg::ListOutputFormats){
		

		REQ_FUN_ARG(0, cb);

		Nan::Callback *callback = new Nan::Callback(cb.As<Function>());
		Nan::AsyncQueueWorker(new AsyncListOutputFormatsWorker(callback));

		info.GetReturnValue().Set(Nan::Undefined());
	}


	NAN_METHOD(ffmpeg::ListCodecs){
		
		REQ_FUN_ARG(0, cb);
		Nan::Callback *callback = new Nan::Callback(cb.As<Function>());
		ffmpegcpp::ffmpeg ffm;
		auto codecs = ffmpegcpp::codec::listCodecs();

		auto retval = Nan::New<Array>();

		try{
			int i = 0;

			for (auto cod : codecs){
				auto cobj = Nan::New<Object>();
				cobj->Set(Nan::New("name")		.ToLocalChecked(), Nan::New(cod.name)		.ToLocalChecked());
				cobj->Set(Nan::New("long_name")	.ToLocalChecked(), Nan::New(cod.long_name)	.ToLocalChecked());
				cobj->Set(Nan::New("is_encoder").ToLocalChecked(), Nan::New(cod.isEncoder)	);
				cobj->Set(Nan::New("is_decoder").ToLocalChecked(), Nan::New(cod.isDecoder)	);
				cobj->Set(Nan::New("media_type").ToLocalChecked(), Nan::New(ffmpegcpp::getMediaTypeName(cod.mediaType)).ToLocalChecked());
				cobj->Set(Nan::New("max_lowres").ToLocalChecked(), Nan::New(cod.max_lowres)	);



				//todo, convert to array of flags

				cobj->Set(Nan::New("frame_rates")		.ToLocalChecked(), fromVector<ffmpegcpp::rational, Number>(cod.frameRates, [](ffmpegcpp::rational v){return Nan::New(v.toDouble()); }));
				cobj->Set(Nan::New("pixel_formats")		.ToLocalChecked(), fromVector<ffmpegcpp::pixel_format, String>(cod.pixelFormats, [](ffmpegcpp::pixel_format v){return Nan::New(ffmpegcpp::getPixelFormatName(v)).ToLocalChecked(); }));
				cobj->Set(Nan::New("sample_rates")		.ToLocalChecked(), fromVector<int, Integer>(cod.sampleRates, [](int v){return Nan::New(v); }));
				cobj->Set(Nan::New("sample_formats")	.ToLocalChecked(), fromVector<ffmpegcpp::sample_format, String>(cod.sampleFormats, [](ffmpegcpp::sample_format v){return Nan::New(ffmpegcpp::getSampleFormatName(v)).ToLocalChecked(); }));
				cobj->Set(Nan::New("channel_layouts")	.ToLocalChecked(), fromVector<ffmpegcpp::channel_layout, String>(cod.channelLayouts, [](ffmpegcpp::channel_layout v){return Nan::New(ffmpegcpp::getChannelLayoutName(v)).ToLocalChecked(); }));
				cobj->Set(Nan::New("codec_profiles")	.ToLocalChecked(), fromVector<ffmpegcpp::codec_profile, Object>(cod.profiles, [](ffmpegcpp::codec_profile v)
				{
					Local<Object> cp = Nan::New<Object>();
					cp->Set(Nan::New("id")	.ToLocalChecked(), Nan::New(v.profile));
					cp->Set(Nan::New("name").ToLocalChecked(), Nan::New(v.name).ToLocalChecked());
					return cp;
				}));

				cobj->Set(Nan::New("capabilities").ToLocalChecked(), fromVector<std::string, String>(ffmpegcpp::getCodecCapabilitiesVector(cod.capabilities), [](std::string s){return Nan::New(s).ToLocalChecked(); }));

				retval->Set(i, cobj);
				i++;
			}

		}
		catch (std::runtime_error re){
			v8::Local<v8::Value> argv[] = {
				v8::Exception::Error(Nan::New<v8::String>(re.what()).ToLocalChecked())
			};
			callback->Call(1, argv);
			info.GetReturnValue().Set(Nan::Undefined());
		}

		Local<Value> argv[] = {
			Nan::Null()
			, retval
		};

		Nan::TryCatch try_catch;
		callback->Call(2, argv);

		if (try_catch.HasCaught()) {
			Nan::FatalException(try_catch);
		}

		info.GetReturnValue().Set(Nan::Undefined());

	}

	NAN_METHOD(ffmpeg::ListDevices){
		
		REQ_FUN_ARG(0, cb);
		Nan::Callback *callback = new Nan::Callback(cb.As<Function>());
		ffmpegcpp::ffmpeg ffm;
		auto devices = ffmpegcpp::ffmpeg::ListInputDevices();

		/*std::string name;
			std::string full_name;
			std::string format;
			devicetype type;
			std::vector<std::shared_ptr<deviceinfo>> deviceInfos;*/

		auto retval = Nan::New<Array>();

		try{
			int i = 0;

			for (auto dev : devices){
				auto cobj = Nan::New<Object>();
				cobj->Set(Nan::New("name").ToLocalChecked(), Nan::New(dev->name).ToLocalChecked());
				cobj->Set(Nan::New("full_name").ToLocalChecked(), Nan::New(dev->full_name).ToLocalChecked());
				cobj->Set(Nan::New("format").ToLocalChecked(), Nan::New(dev->format).ToLocalChecked());



				cobj->Set(Nan::New("device_infos").ToLocalChecked(), fromVector<std::shared_ptr<ffmpegcpp::deviceinfo>, Object>(dev->deviceInfos, [cobj, dev](std::shared_ptr<ffmpegcpp::deviceinfo> di)
				{
					Local<Object> cp = Nan::New<Object>();

					if (di->pin != ""){
						cp->Set(Nan::New("pin").ToLocalChecked(), Nan::New(di->pin).ToLocalChecked());
					}

					switch (dev->type){
					case ffmpegcpp::devicetype::audio:
					{
						cobj->Set(Nan::New("type").ToLocalChecked(), Nan::New("audio").ToLocalChecked());
						auto dia = std::static_pointer_cast<ffmpegcpp::deviceinfoaudio>(di);
						cp->Set(Nan::New("minChannels").ToLocalChecked(), Nan::New(dia->minChannels));
						cp->Set(Nan::New("minBits").ToLocalChecked(), Nan::New(dia->minBits));
						cp->Set(Nan::New("minRate").ToLocalChecked(), Nan::New(dia->minRate));
						cp->Set(Nan::New("maxChannels").ToLocalChecked(), Nan::New(dia->maxChannels));
						cp->Set(Nan::New("maxBits").ToLocalChecked(), Nan::New(dia->maxBits));
						cp->Set(Nan::New("maxRate").ToLocalChecked(), Nan::New(dia->maxRate));
					}
						break;
					case ffmpegcpp::devicetype::video:
					{
						cobj->Set(Nan::New("type").ToLocalChecked(), Nan::New("video").ToLocalChecked());
						auto div = std::static_pointer_cast<ffmpegcpp::deviceinfovideo>(di);

						auto pixelFormatName = ffmpegcpp::getPixelFormatName(div->pixelFormat);
						if (pixelFormatName != ""){
							cp->Set(Nan::New("pixelFormat").ToLocalChecked(), Nan::New(pixelFormatName).ToLocalChecked());
						}

						if (div->codec != ""){
							cp->Set(Nan::New("codec").ToLocalChecked(), Nan::New(div->codec).ToLocalChecked());
						}
						cp->Set(Nan::New("minWidth")	.ToLocalChecked(), Nan::New(div->minWidth));
						cp->Set(Nan::New("minHeight")	.ToLocalChecked(), Nan::New(div->minHeight));
						cp->Set(Nan::New("minFPS")		.ToLocalChecked(), Nan::New(div->minFPS));
						cp->Set(Nan::New("maxWidth")	.ToLocalChecked(), Nan::New(div->maxWidth));
						cp->Set(Nan::New("maxHeight")	.ToLocalChecked(), Nan::New(div->maxHeight));
						cp->Set(Nan::New("maxFPS")		.ToLocalChecked(), Nan::New(div->maxFPS));
					}
						break;
					}
					return cp;
				}));



				retval->Set(i, cobj);
				i++;
			}

		}
		catch (std::runtime_error re){
			v8::Local<v8::Value> argv[] = {
				v8::Exception::Error(Nan::New<v8::String>(re.what()).ToLocalChecked())
			};
			callback->Call(1, argv);
			info.GetReturnValue().Set(Nan::Undefined());
		}

		Local<Value> argv[] = {
			Nan::Null()
			, retval
		};

		Nan::TryCatch try_catch;
		callback->Call(2, argv);

		if (try_catch.HasCaught()) {
			Nan::FatalException(try_catch);
		}

		info.GetReturnValue().Set(Nan::Undefined());
	}

	NAN_METHOD(ffmpeg::ListFilters){
		
		REQ_FUN_ARG(0, cb);
		Nan::Callback *callback = new Nan::Callback(cb.As<Function>());
		ffmpegcpp::ffmpeg ffm;


		auto retval = Nan::New<Array>();

		try{
			auto filters = ffmpegcpp::bitstreamfilter::listBitstreamFilters();

			int i = 0;

			for (auto filter : filters){
				retval->Set(i, Nan::New(filter).ToLocalChecked());
				i++;
			}

		}
		catch (std::runtime_error re){
			v8::Local<v8::Value> argv[] = {
				v8::Exception::Error(Nan::New<v8::String>(re.what()).ToLocalChecked())
			};
			callback->Call(1, argv);
			info.GetReturnValue().Set(Nan::Undefined());
		}

		Local<Value> argv[] = {
			Nan::Null()
			, retval
		};

		Nan::TryCatch try_catch;
		callback->Call(2, argv);

		if (try_catch.HasCaught()) {
			Nan::FatalException(try_catch);
		}

		info.GetReturnValue().Set(Nan::Undefined());
	}



	void ffmpeg::ConvertObjectToDictionary(Local<Object> object_, std::shared_ptr<ffmpegcpp::dictionary> dict_)
	{
		auto propnames = object_->GetPropertyNames();
		for (uint32_t i = 0; i < propnames->Length(); i++)
		{
			auto prop = propnames->Get(i);
			Nan::Utf8String propnamestr(prop->ToString());
			Nan::Utf8String value(object_->Get(prop)->ToString());

			dict_->set(*propnamestr, *value);
		}
	}

	NAN_METHOD(ffmpeg::OpenAsInput){
		if (info.Length() < 4){
			return Nan::ThrowTypeError("void alvision.ffmpeg.OpenAsInput(filename, format, options, callback(err,ffmpeg instance))");
		}

		Nan::Utf8String filename((!info[0]->IsNull() && !info[0]->IsUndefined()) ? info[0]->ToString() : Nan::New("").ToLocalChecked());
		Nan::Utf8String format((!info[1]->IsNull() && !info[1]->IsUndefined()) ? info[1]->ToString() : Nan::New("").ToLocalChecked());
		auto options = (!info[2]->IsNull() && !info[2]->IsUndefined()) ? info[2]->ToObject() : Nan::New<Object>();
		REQ_FUN_ARG(3, cb);
		Nan::Callback *callback = new Nan::Callback(cb.As<Function>());
		//auto callback = Local<Function>::Cast(args[3]);

		std::shared_ptr<ffmpegcpp::dictionary> dict = std::make_shared<ffmpegcpp::dictionary>();

		ConvertObjectToDictionary(options, dict);

		auto im_h = Nan::New(ffmpeg::constructor)->GetFunction()->NewInstance();
		//Local<Object> im_h = Nan::New(ffmpeg::constructor)->GetFunction()->NewInstance();
		ffmpeg *ffminst = Nan::ObjectWrap::Unwrap<ffmpeg>(im_h);

		//TODO: convert to error callback! (first parameter)
		try{
			assert(!ffminst->_openedAsOutput && "should not be here, context was already opened as output");
			ffminst->_ffmpegContext = ffminst->_ffmpeg->open_input(*filename, *format, dict);
			ffminst->_openedAsInput = true;
			ffminst->_ffmpegStreams = std::make_shared <std::map<std::string,std::shared_ptr<streamcontainer>>>();
			auto streams = ffminst->_ffmpegContext->getStreams();
			for (auto st : *streams){
				//POSSIBLE BUG
				std::shared_ptr<streamcontainer> sc = std::make_shared<streamcontainer>();
				sc->ffstream = st;
				sc->streamid = std::to_string(st->index());
				sc->streamindex = st->index();
				st->getDecoder()->open();

				auto newstream = stream::Instantiate(ffminst, sc->streamid, st);
				sc->stream.Reset(newstream);

				(*ffminst->_ffmpegStreams)[std::to_string(sc->streamindex)] = sc;
			}
		}
		catch (ffmpegcpp::ffmpeg_exception ffe){
			return Nan::ThrowError(ffe.what());
		}
		catch (std::exception ex){
			return Nan::ThrowError(ex.what());
		}

		//ffminst->Wrap(im_h);

		Local<Value> argv[] = {
			Nan::Null()
			, im_h
		};

		Nan::TryCatch try_catch;
		callback->Call(2, argv);
		if (try_catch.HasCaught()) {
			Nan::FatalException(try_catch);
		}

		info.GetReturnValue().Set(Nan::Undefined());
	}


	NAN_METHOD(ffmpeg::OpenAsOutputBuffer){
		

		if (info.Length() < 5){
			return Nan::ThrowTypeError("void alvision.ffmpeg.OpenAsOutputBuffer(filename, format, packetSize, totalSize, options, callback)");
		}

		Nan::Utf8String filename((!info[0]->IsNull() && !info[0]->IsUndefined()) ? info[0]->ToString() : Nan::New("").ToLocalChecked());

		Nan::Utf8String format((!info[1]->IsNull() && !info[1]->IsUndefined()) ? info[1]->ToString() : Nan::New("").ToLocalChecked());

		//packet size
		auto packetSize = info[2]->Int32Value();
		//total size/
		auto totalSize = info[3]->Int32Value();


		auto options = (!info[4]->IsNull() && !info[4]->IsUndefined()) ? info[4]->ToObject() : Nan::New<Object>();
		//auto callback = Local<Function>::Cast(args[3]);
		REQ_FUN_ARG(5, cb);
		Nan::Callback *callback = new Nan::Callback(cb.As<Function>());

		std::shared_ptr<ffmpegcpp::dictionary> dict = std::make_shared<ffmpegcpp::dictionary>();

		ConvertObjectToDictionary(options, dict);

		auto im_h = Nan::New(ffmpeg::constructor)->GetFunction()->NewInstance();
		//Local<Object> im_h = Nan::New(ffmpeg::constructor)->GetFunction()->NewInstance();
		ffmpeg *ffminst = Nan::ObjectWrap::Unwrap<ffmpeg>(im_h);

		//TODO: convert to error callback! (first parameter)
		try{
			assert(!ffminst->_openedAsInput && "shouldn't be here, instance already opened as output");
			ffminst->_ffmpegMemoryContext = std::make_shared<ffmpegcpp::memorycontext>(packetSize, totalSize);

			ffminst->_ffmpegContext = ffminst->_ffmpeg->open_output(ffminst->_ffmpegMemoryContext, *filename, *format);
			ffminst->_openedAsOutput = true;


		}
		catch (ffmpegcpp::ffmpeg_exception ffe){
			return Nan::ThrowError(ffe.what());
		}
		catch (std::exception ex){
			return Nan::ThrowError(ex.what());
		}

		//ffminst->Wrap(im_h);

		Local<Value> argv[] = {
			Nan::Null()
			, im_h
		};

		Nan::TryCatch try_catch;
		callback->Call(2, argv);
		if (try_catch.HasCaught()) {
			Nan::FatalException(try_catch);
		}

		info.GetReturnValue().Set(Nan::Undefined());
	}


	NAN_METHOD(ffmpeg::OpenAsOutput){
		

		if (info.Length() < 4){
			return Nan::ThrowTypeError("void alvision.ffmpeg.OpenAsOutput(filename, format, options, callback)");
		}

		Nan::Utf8String filename((!info[0]->IsNull() && !info[0]->IsUndefined()) ? info[0]->ToString() : Nan::EmptyString());
		Nan::Utf8String format((!info[1]->IsNull() && !info[1]->IsUndefined()) ? info[1]->ToString() : Nan::EmptyString());
		auto options = (!info[2]->IsNull() && !info[2]->IsUndefined()) ? info[2]->ToObject() : Nan::New<Object>();
		//auto callback = Local<Function>::Cast(args[3]);
		REQ_FUN_ARG(3, cb);
		Nan::Callback *callback = new Nan::Callback(cb.As<Function>());

		std::shared_ptr<ffmpegcpp::dictionary> dict = std::make_shared<ffmpegcpp::dictionary>();

		ConvertObjectToDictionary(options, dict);

		auto im_h = Nan::New(ffmpeg::constructor)->GetFunction()->NewInstance();
		//Local<Object> im_h = Nan::New(ffmpeg::constructor)->GetFunction()->NewInstance();
		ffmpeg *ffminst = Nan::ObjectWrap::Unwrap<ffmpeg>(im_h);

		//TODO: convert to error callback! (first parameter)
		try{
			assert(!ffminst->_openedAsInput && "shouldn't be here, instance already opened as output");
			ffminst->_ffmpegContext = ffminst->_ffmpeg->open_output(*filename, *format);
			ffminst->_openedAsOutput = true;


		}
		catch (ffmpegcpp::ffmpeg_exception ffe){
			return Nan::ThrowError(ffe.what());
		}
		catch (std::exception ex){
			return Nan::ThrowError(ex.what());
		}

		//ffminst->Wrap(im_h);

		Local<Value> argv[] = {
			Nan::Null()
			, im_h
		};

		Nan::TryCatch try_catch;
		callback->Call(2, argv);
		if (try_catch.HasCaught()) {
			Nan::FatalException(try_catch);
		}

		info.GetReturnValue().Set(Nan::Undefined());
	}

	NAN_METHOD(ffmpeg::getNextBufferSizes){
		SETUP_FUNCTION(ffmpeg);

		if (self->_ffmpegMemoryContext == nullptr){
			return Nan::ThrowError("getNextBufferSizes cannot execute on non Buffered instance");
		}

		auto retval = Nan::New<Object>();
		retval->Set(Nan::New("size").ToLocalChecked(), Nan::New(self->_ffmpegMemoryContext->size()));
		retval->Set(Nan::New("blocks").ToLocalChecked(), Nan::New(self->_ffmpegMemoryContext->blocks()));

		info.GetReturnValue().Set(retval);
	}


	NAN_METHOD(ffmpeg::getNextBuffer){
		SETUP_FUNCTION(ffmpeg);

		if (self->_ffmpegMemoryContext == nullptr){
			return Nan::ThrowError("getNextBuffer cannot execute on non Buffered instance");
		}

		if (info.Length() < 1){
			return Nan::ThrowTypeError("int getNextBuffer(buffer);");
		}

		if ((!node::Buffer::HasInstance(info[0])) || (node::Buffer::Length(info[0]) < self->_ffmpegMemoryContext->getBlockSize())){
			return Nan::ThrowRangeError("int getNextBuffer first argument must be a preallocated buffer at the size of the maximum packet size");
		}

		auto bufferDataPtr = node::Buffer::Data(info[0]);
		auto actuallyRead = self->_ffmpegMemoryContext->read_next_block((uint8_t*)bufferDataPtr, node::Buffer::Length(info[0]));

		info.GetReturnValue().Set(Nan::New(actuallyRead));
	}

	NAN_METHOD(ffmpeg::WriteHeader){
		SETUP_FUNCTION(ffmpeg);

		/*if (args.Length() < 4){
			return NanThrowTypeError("void alvision.ffmpeg.OpenAsOutput(filename, format, options, callback)");
			}*/

		if (self->_outputWroteHeader == true){
			return Nan::ThrowError("WriteHeader can only be executed once");
		}

		auto options = (!info[0]->IsNull() && !info[0]->IsUndefined()) ? info[0]->ToObject() : Nan::New<Object>();
		auto metadata = (!info[1]->IsNull() && !info[1]->IsUndefined()) ? info[1]->ToObject() : Nan::New<Object>();

		//REQ_FUN_ARG(2, cb);
		//Nan::Callback *callback = new Nan::Callback(cb.As<Function>());

		std::shared_ptr<ffmpegcpp::dictionary> optionsdict = std::make_shared<ffmpegcpp::dictionary>();
		std::shared_ptr<ffmpegcpp::dictionary> metadatadict = std::make_shared<ffmpegcpp::dictionary>();

		ConvertObjectToDictionary(options, optionsdict);
		ConvertObjectToDictionary(metadata, metadatadict);

		//TODO: convert to error callback! (first parameter)
		try{
			assert(self->_openedAsOutput && "should be opened as output to write header");
			self->_ffmpegContext->write_header(optionsdict, metadatadict);
			self->_outputWroteHeader = true;
		}
		catch (ffmpegcpp::ffmpeg_exception ffe){
			return Nan::ThrowError(ffe.what());
		}
		catch (std::exception ex){
			return Nan::ThrowError(ex.what());
		}

		/*Local<Value> argv[] = {
			NanNull()
			, self
			};*/

		/*TryCatch try_catch;
		callback->Call(2, argv);
		if (try_catch.HasCaught()) {
		FatalException(try_catch);
		}*/

		info.GetReturnValue().Set(Nan::New(true));
	}

	NAN_METHOD(ffmpeg::GetSDP){
		SETUP_FUNCTION(ffmpeg);

		if (self->_ffmpegContext == nullptr){
			return Nan::ThrowError("GetSDP must execute on initialized instance");
		}

		//REQ_FUN_ARG(2, cb);
		//Nan::Callback *callback = new Nan::Callback(cb.As<Function>());

		try{
			auto sdp = self->_ffmpegContext->getSDP();
			info.GetReturnValue().Set(Nan::New(sdp).ToLocalChecked());
		}
		catch (ffmpegcpp::ffmpeg_exception ffe){
			return Nan::ThrowError(ffe.what());
		}
		catch (std::exception ex){
			return Nan::ThrowError(ex.what());
		}

		/*Local<Value> argv[] = {
		NanNull()
		, self
		};*/

		/*TryCatch try_catch;
		callback->Call(2, argv);
		if (try_catch.HasCaught()) {
		FatalException(try_catch);
		}*/
	}

	NAN_METHOD(ffmpeg::Close){
		SETUP_FUNCTION(ffmpeg);
		bool success = false;
		try{
			if (self->_ffmpegContext != nullptr){
				self->_ffmpegContext->close();
				self->_ffmpegContext.reset();
			}

			if (self->_ffmpeg != nullptr){
				self->_ffmpeg.reset();
			}

			self->_openedAsInput = false;
			self->_openedAsOutput = false;
			success = true;
		}
		catch (ffmpegcpp::ffmpeg_exception ffe){
			return Nan::ThrowError(ffe.what());
		}
		catch (std::exception ex){
			return Nan::ThrowError(ex.what());
		}

		info.GetReturnValue().Set(Nan::New(success));
	}

	NAN_METHOD(ffmpeg::GetStreams)
	{
		SETUP_FUNCTION(ffmpeg);

		auto ret = Nan::New<Array>();

		int i = 0;

		for (auto streamkv : *self->_ffmpegStreams)
		{
			if (streamkv.second->stream.IsEmpty()){
				streamkv.second->stream.Reset(stream::Instantiate(self, streamkv.first, streamkv.second->ffstream));
			}

			ret->Set(i, Nan::New( streamkv.second->stream));
			i++;
		}

		info.GetReturnValue().Set(ret);

	}

	NAN_METHOD(ffmpeg::AddStream)
	{
		SETUP_FUNCTION(ffmpeg);

		if (info.Length() < 1){
			return Nan::ThrowTypeError("void ffmpeg.AddStream(config)");
		}

		if (self->_ffmpegContext == nullptr){
			return Nan::ThrowError("cannot perform operations on a closed instance");
		}

		if (!self->_openedAsOutput){
			return Nan::ThrowError("AddStream only works on outputs");
		}

		auto config = (!info[0]->IsNull() && !info[0]->IsUndefined()) ? info[0]->ToObject() : Nan::New<Object>();

		if (config->Get(Nan::New("id").ToLocalChecked())->IsUndefined())
			return Nan::ThrowError("id must be specified");
		if (config->Get(Nan::New("codec").ToLocalChecked())->IsUndefined())
			return Nan::ThrowError("codec must be specified");
		if (config->Get(Nan::New("timebase").ToLocalChecked())->IsUndefined())
			return Nan::ThrowError("timebase must be specified");

		Nan::Utf8String stream_id(config->Get(Nan::New("id").ToLocalChecked())->ToString());
		Nan::Utf8String codec_id(config->Get(Nan::New("codec").ToLocalChecked())->ToString());
		double timebase = config->Get(Nan::New("timebase").ToLocalChecked())->NumberValue();

		int streamIndex = -1;

		//std::shared_ptr<std::vector<std::shared_ptr<ffmpegcpp::stream>>> streams;
		//TODO: convert to error callback! (first parameter)

		auto sc = std::make_shared<streamcontainer>();

		try{
			std::shared_ptr<ffmpegcpp::dictionary> optionsdict = std::make_shared<ffmpegcpp::dictionary>();

			if (self->_ffmpegStreams == nullptr){
				self->_ffmpegStreams = std::make_shared<std::map<std::string, std::shared_ptr<streamcontainer>>>();
			}

			

			auto stream = self->_ffmpegContext->addStream(*codec_id, ffmpegcpp::rational(1, (int)timebase));

			sc->ffstream = stream;
			sc->streamid = *stream_id;
			sc->streamindex = stream->index();

			self->_ffmpegStreams->insert(std::make_pair(*stream_id, sc));

			auto streamCodec = stream->getCodec();
			streamCodec->time_base(ffmpegcpp::rational(1, (int)timebase));

			if (!config->Get(Nan::New("bitrate").ToLocalChecked())->IsUndefined())
				streamCodec->bit_rate(config->Get(Nan::New("bitrate").ToLocalChecked())->Int32Value());

			if (!config->Get(Nan::New("width").ToLocalChecked())->IsUndefined())
			{
				auto width = config->Get(Nan::New("width").ToLocalChecked())->Int32Value();
				streamCodec->width(width);
			}

			if (!config->Get(Nan::New("height").ToLocalChecked())->IsUndefined())
			{
				auto height = config->Get(Nan::New("height").ToLocalChecked())->Int32Value();
				streamCodec->height(height);
			}

			if (!config->Get(Nan::New("gopsize").ToLocalChecked())->IsUndefined())
				streamCodec->gop_size(config->Get(Nan::New("gopsize").ToLocalChecked())->Int32Value());

			if (!config->Get(Nan::New("pixfmt").ToLocalChecked())->IsUndefined())
				streamCodec->pix_fmt(ffmpegcpp::getPixelFormatByName(*Nan::Utf8String(config->Get(Nan::New("pixfmt").ToLocalChecked())->ToString())));

			if (!config->Get(Nan::New("channels").ToLocalChecked())->IsUndefined())
				streamCodec->channels(config->Get(Nan::New("channels").ToLocalChecked())->Int32Value());

			if (!config->Get(Nan::New("samplerate").ToLocalChecked())->IsUndefined())
				streamCodec->sample_rate(config->Get(Nan::New("samplerate").ToLocalChecked())->Int32Value());

			if (!config->Get(Nan::New("channelslayout").ToLocalChecked())->IsUndefined())
				streamCodec->channels_layout(ffmpegcpp::getChannelLayoutByName(*Nan::Utf8String(config->Get(Nan::New("channelslayout").ToLocalChecked())->ToString())));

			if (!config->Get(Nan::New("samplefmt").ToLocalChecked())->IsUndefined())
				streamCodec->sample_fmt(ffmpegcpp::getSampleFormatByName(*Nan::Utf8String(config->Get(Nan::New("samplefmt").ToLocalChecked())->ToString())));

			if (!config->Get(Nan::New("options").ToLocalChecked())->IsUndefined()){
				auto options = config->Get(Nan::New("options").ToLocalChecked())->ToObject();
				ConvertObjectToDictionary(options, optionsdict);
			}

			stream->getEncoder()->open(optionsdict);

			sc->stream.Reset(stream::Instantiate(self, sc->streamid, stream));

		}
		catch (ffmpegcpp::ffmpeg_exception ffe){
			return Nan::ThrowError(ffe.what());
		}
		catch (std::exception ex){
			return Nan::ThrowError(ex.what());
		}

		info.GetReturnValue().Set(Nan::New(sc->stream));
	}

	NAN_METHOD(ffmpeg::WritePacket)
	{
		SETUP_FUNCTION(ffmpeg);

		packet *pt = Nan::ObjectWrap::Unwrap<packet>(info[0]->ToObject());
		if (pt == NULL){
			return Nan::ThrowError("first argument must be a packet");
		}

		bool interleaved = (!info[1]->IsUndefined()) ? info[1]->BooleanValue() : true;

		try{
			if (interleaved){
				self->_ffmpegContext->write_packet_interleaved(*pt->_packet);
			}
			else{
				self->_ffmpegContext->write_packet(*pt->_packet);
			}
		}
		catch (ffmpegcpp::ffmpeg_exception ffe){
			return Nan::ThrowError(ffe.what());
		}
		catch (std::exception ex){
			return Nan::ThrowError(ex.what());
		}

		info.GetReturnValue().SetUndefined();
	}

	NAN_METHOD(ffmpeg::ReadPacket)
	{
		SETUP_FUNCTION(ffmpeg);

		packet *pt = Nan::ObjectWrap::Unwrap<packet>(info[0]->ToObject());
		if (pt == NULL){
			return Nan::ThrowError("first argument must be a packet");
		}

		ffmpegcpp::readPacketState state = ffmpegcpp::readPacketState::again;
		try{
			state = self->_ffmpegContext->readPacket(pt->_packet);
		}
		catch (ffmpegcpp::ffmpeg_exception ffe){
			return Nan::ThrowError(ffe.what());
		}
		catch (std::exception ex){
			return Nan::ThrowError(ex.what());
		}

		switch (state){
		case ffmpegcpp::readPacketState::success:
			info.GetReturnValue().Set(Nan::New("success").ToLocalChecked());
			break;
		case ffmpegcpp::readPacketState::again:
			info.GetReturnValue().Set(Nan::New("again").ToLocalChecked());
			break;
		case ffmpegcpp::readPacketState::eof:
			info.GetReturnValue().Set(Nan::New("eof").ToLocalChecked());
			break;
		default:
			info.GetReturnValue().Set(Nan::New("unknown").ToLocalChecked());
			break;
		}

	}

}
