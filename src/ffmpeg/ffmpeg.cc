#include "ffmpeg.h"
#include "packet.h"
#include "../opencv/Matrix.h"

namespace alvision{

	v8::Persistent<FunctionTemplate> ffmpeg::constructor;
	v8::Persistent<Function> ffmpeg::_logger;
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

	void
		ffmpeg::Init(Handle<Object> target) {
		NanScope();

		//Class
		Local<FunctionTemplate> ctor = NanNew<FunctionTemplate>(ffmpeg::New);
		NanAssignPersistent(constructor, ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(NanNew("ffmpeg"));

		// Prototype
		NODE_SET_METHOD(ctor, "ListInputFormats", ListInputFormats);
		NODE_SET_METHOD(ctor, "ListOutputFormats", ListOutputFormats);

		NODE_SET_METHOD(ctor, "SetLogger", SetLogger);

		NODE_SET_METHOD(ctor, "ListCodecs", ListCodecs);
		NODE_SET_METHOD(ctor, "ListDevices", ListDevices);
		NODE_SET_METHOD(ctor, "ListFilters", ListFilters);

		NODE_SET_METHOD(ctor, "OpenAsInput", OpenAsInput);
		NODE_SET_METHOD(ctor, "OpenAsOutput", OpenAsOutput);
		NODE_SET_METHOD(ctor, "OpenAsOutputBuffer", OpenAsOutputBuffer);

		NODE_SET_PROTOTYPE_METHOD(ctor, "getNextBufferSizes", getNextBufferSizes);
		NODE_SET_PROTOTYPE_METHOD(ctor, "getNextBuffer", getNextBuffer);

		NODE_SET_PROTOTYPE_METHOD(ctor, "GetSDP", GetSDP);

		NODE_SET_PROTOTYPE_METHOD(ctor, "Close", Close);

		NODE_SET_PROTOTYPE_METHOD(ctor, "GetStreams", GetStreams);
		NODE_SET_PROTOTYPE_METHOD(ctor, "AddStream", AddStream);

		NODE_SET_PROTOTYPE_METHOD(ctor, "WriteHeader", WriteHeader);

		NODE_SET_PROTOTYPE_METHOD(ctor, "WritePacket", WritePacket);
		NODE_SET_PROTOTYPE_METHOD(ctor, "ReadPacket", ReadPacket);

		target->Set(NanNew("ffmpeg"), ctor->GetFunction());

		_logger_async = std::make_shared<uvasync>(_async_logger_callback);

		ffmpegcpp::ffmpeg::setLogger(_ffmpeg_logger);

	};

	NAN_METHOD(ffmpeg::New) {
		NanScope();
		if (!args.IsConstructCall())
			return NanThrowTypeError("Cannot call constructor as function");

		/*if (args.This()->InternalFieldCount() == 0)
			NanThrowTypeError("Cannot instantiate without new");*/

		ffmpeg *fm;
		fm = new ffmpeg;

		fm->Wrap(args.This());
		return args.This();
	}


	ffmpeg::ffmpeg() : ObjectWrap() {
		_ffmpeg = std::make_shared<ffmpegcpp::ffmpeg>();
	}

	NAN_METHOD(ffmpeg::SetLogger){
		NanScope();

		Local<Function> cb = Local<Function>::Cast(args[0]);

		//if we already have a logger, release it
		if (!_logger.IsEmpty()){
			NanDisposePersistent(_logger);
		}

		if (args.Length() > 0 && args[0]->IsFunction()){
			NanAssignPersistent(_logger, cb);
		}

		NanReturnUndefined();
	}

	void ffmpeg::_async_logger_callback(uv_async_t *handle, int status /*UNUSED*/)
	{
		NanScope();
		log_message lm;
		NanCallback *callback = new NanCallback(_logger);

		while (_log_messages.dequeue(lm))
		{
			if (!callback->IsEmpty() && !_logger.IsEmpty() && _logger_async != nullptr && _logger_async->isActive()){
				v8::Local<v8::Value> argv[] = {
					NanNew(lm.module),
					NanNew(lm.level),
					NanNew(lm.message)
				};
				callback->Call(3, argv);
			}
		}


	}


	Local<Object> ffmpeg::fromFFMpegOptions(std::vector<ffmpegcpp::option> &options)
	{
		//NanScope();
		Local<Array> retoptions = NanNew<Array>();
		int i = 0;
		for (auto option : options)
		{
			Local<Object> opt = NanNew<Object>();
			opt->Set(NanNew("name"), NanNew(option.name));
			opt->Set(NanNew("help"), NanNew(option.help));
			opt->Set(NanNew("type"), NanNew(ffmpegcpp::getOptionTypeName(option.type)));
			switch (option.default_val.source_type())
			{
			case ffmpegcpp::variant_source_type::dbl:
				opt->Set(NanNew("default_val"), NanNew(option.default_val.todbl()));
				break;
			case ffmpegcpp::variant_source_type::i64:
				//TODO: this may throw if indeed int64 is returned, need to convert to string??
				opt->Set(NanNew("default_val"), NanNew(safe_cast<int>(option.default_val.toi64())));
				break;
			case ffmpegcpp::variant_source_type::q:
				opt->Set(NanNew("default_val"), NanNew(option.default_val.todbl()));
				break;
			case ffmpegcpp::variant_source_type::str:
				opt->Set(NanNew("default_val"), NanNew(option.default_val.tostr()));
				break;
			}
			opt->Set(NanNew("min"), NanNew(option.min));
			opt->Set(NanNew("max"), NanNew(option.max));
			opt->Set(NanNew("flags"), NanNew(option.flags));
			opt->Set(NanNew("unit"), NanNew(option.unit));

			retoptions->Set(i, opt);
			i++;
		}
		//return NanEscapeScope(retoptions);
		return retoptions;
	}

	Local<Object> ffmpeg::fromFFMpegComponent(ffmpegcpp::component comp)
	{
		//NanScope();
		Local<Object> ret = NanNew<Object>();

		ret->Set(NanNew("name"), NanNew(comp.name));
		ret->Set(NanNew("long_name"), NanNew(comp.long_name));
		ret->Set(NanNew("extensions"), NanNew(comp.extensions));
		ret->Set(NanNew("mime_type"), NanNew(comp.mime_type));
		ret->Set(NanNew("flags"), NanNew(ffmpegcpp::getComponentFlags(comp.flags)));
		ret->Set(NanNew("options"), fromFFMpegOptions(comp.options));

		//return NanEscapeScope(ret);
		return ret;
	}

	class ffmpeg::AsyncListInputFormatsWorker : public NanAsyncWorker{
	public:
		AsyncListInputFormatsWorker(NanCallback *callback)
			: NanAsyncWorker(callback), _inputFormats(){}
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
			NanScope();

			Local<Array> res = NanNew<Array>();
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
					v8::Exception::Error(NanNew<v8::String>(ex.what()))
				};
				callback->Call(1, argv);
				return;
			}

		{
			Local<Value> argv[] = {
				NanNull()
				, res
			};

			TryCatch try_catch;
			callback->Call(2, argv);
			if (try_catch.HasCaught()) {
				FatalException(try_catch);
			}
		}
		}

	private:
		std::vector<ffmpegcpp::component> _inputFormats;
	};

	NAN_METHOD(ffmpeg::ListInputFormats){
		NanScope();

		REQ_FUN_ARG(0, cb);

		NanCallback *callback = new NanCallback(cb.As<Function>());
		NanAsyncQueueWorker(new AsyncListInputFormatsWorker(callback));

		NanReturnUndefined();
	}

	class ffmpeg::AsyncListOutputFormatsWorker : public NanAsyncWorker{
	public:
		AsyncListOutputFormatsWorker(NanCallback *callback)
			: NanAsyncWorker(callback), _outputFormats(){}
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
			NanScope();

			Local<Array> res = NanNew<Array>();
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
					v8::Exception::Error(NanNew<v8::String>(ex.what()))
				};
				callback->Call(1, argv);
				return;
			}

		{
			Local<Value> argv[] = {
				NanNull()
				, res
			};

			TryCatch try_catch;
			callback->Call(2, argv);
			if (try_catch.HasCaught()) {
				FatalException(try_catch);
			}
		}
		}

	private:
		std::vector<ffmpegcpp::component> _outputFormats;
	};

	NAN_METHOD(ffmpeg::ListOutputFormats){
		NanScope();

		REQ_FUN_ARG(0, cb);

		NanCallback *callback = new NanCallback(cb.As<Function>());
		NanAsyncQueueWorker(new AsyncListOutputFormatsWorker(callback));

		NanReturnUndefined();
	}


	NAN_METHOD(ffmpeg::ListCodecs){
		NanScope();
		REQ_FUN_ARG(0, cb);
		NanCallback *callback = new NanCallback(cb.As<Function>());
		ffmpegcpp::ffmpeg ffm;
		auto codecs = ffmpegcpp::codec::listCodecs();

		auto retval = NanNew<Array>();

		try{
			int i = 0;

			for (auto cod : codecs){
				auto cobj = NanNew<Object>();
				cobj->Set(NanNew("name"), NanNew(cod.name));
				cobj->Set(NanNew("long_name"), NanNew(cod.long_name));
				cobj->Set(NanNew("is_encoder"), NanNew(cod.isEncoder));
				cobj->Set(NanNew("is_decoder"), NanNew(cod.isDecoder));
				cobj->Set(NanNew("media_type"), NanNew(ffmpegcpp::getMediaTypeName(cod.mediaType)));
				cobj->Set(NanNew("max_lowres"), NanNew(cod.max_lowres));



				//todo, convert to array of flags

				cobj->Set(NanNew("frame_rates"), fromVector<ffmpegcpp::rational, Number>(cod.frameRates, [](ffmpegcpp::rational v){return NanNew(v.toDouble()); }));
				cobj->Set(NanNew("pixel_formats"), fromVector<ffmpegcpp::pixel_format, String>(cod.pixelFormats, [](ffmpegcpp::pixel_format v){return NanNew(ffmpegcpp::getPixelFormatName(v)); }));
				cobj->Set(NanNew("sample_rates"), fromVector<int, Integer>(cod.sampleRates, [](int v){return NanNew(v); }));
				cobj->Set(NanNew("sample_formats"), fromVector<ffmpegcpp::sample_format, String>(cod.sampleFormats, [](ffmpegcpp::sample_format v){return NanNew(ffmpegcpp::getSampleFormatName(v)); }));
				cobj->Set(NanNew("channel_layouts"), fromVector<ffmpegcpp::channel_layout, String>(cod.channelLayouts, [](ffmpegcpp::channel_layout v){return NanNew(ffmpegcpp::getChannelLayoutName(v)); }));
				cobj->Set(NanNew("codec_profiles"), fromVector<ffmpegcpp::codec_profile, Object>(cod.profiles, [](ffmpegcpp::codec_profile v)
				{
					Local<Object> cp = NanNew<Object>();
					cp->Set(NanNew("id"), NanNew(v.profile));
					cp->Set(NanNew("name"), NanNew(v.name));
					return cp;
				}));

				cobj->Set(NanNew("capabilities"), fromVector<std::string, String>(ffmpegcpp::getCodecCapabilitiesVector(cod.capabilities), [](std::string s){return NanNew(s); }));

				retval->Set(i, cobj);
				i++;
			}

		}
		catch (std::runtime_error re){
			v8::Local<v8::Value> argv[] = {
				v8::Exception::Error(NanNew<v8::String>(re.what()))
			};
			callback->Call(1, argv);
			NanReturnUndefined();
		}

		Local<Value> argv[] = {
			NanNull()
			, retval
		};

		TryCatch try_catch;
		callback->Call(2, argv);

		if (try_catch.HasCaught()) {
			FatalException(try_catch);
		}

		NanReturnUndefined();

	}

	NAN_METHOD(ffmpeg::ListDevices){
		NanScope();
		REQ_FUN_ARG(0, cb);
		NanCallback *callback = new NanCallback(cb.As<Function>());
		ffmpegcpp::ffmpeg ffm;
		auto devices = ffmpegcpp::ffmpeg::ListInputDevices();

		/*std::string name;
			std::string full_name;
			std::string format;
			devicetype type;
			std::vector<std::shared_ptr<deviceinfo>> deviceInfos;*/

		auto retval = NanNew<Array>();

		try{
			int i = 0;

			for (auto dev : devices){
				auto cobj = NanNew<Object>();
				cobj->Set(NanNew("name"), NanNew(dev->name));
				cobj->Set(NanNew("full_name"), NanNew(dev->full_name));
				cobj->Set(NanNew("format"), NanNew(dev->format));



				cobj->Set(NanNew("device_infos"), fromVector<std::shared_ptr<ffmpegcpp::deviceinfo>, Object>(dev->deviceInfos, [cobj, dev](std::shared_ptr<ffmpegcpp::deviceinfo> di)
				{
					Local<Object> cp = NanNew<Object>();

					if (di->pin != ""){
						cp->Set(NanNew("pin"), NanNew(di->pin));
					}

					switch (dev->type){
					case ffmpegcpp::devicetype::audio:
					{
						cobj->Set(NanNew("type"), NanNew("audio"));
						auto dia = std::static_pointer_cast<ffmpegcpp::deviceinfoaudio>(di);
						cp->Set(NanNew("minChannels"), NanNew(dia->minChannels));
						cp->Set(NanNew("minBits"), NanNew(dia->minBits));
						cp->Set(NanNew("minRate"), NanNew(dia->minRate));
						cp->Set(NanNew("maxChannels"), NanNew(dia->maxChannels));
						cp->Set(NanNew("maxBits"), NanNew(dia->maxBits));
						cp->Set(NanNew("maxRate"), NanNew(dia->maxRate));
					}
						break;
					case ffmpegcpp::devicetype::video:
					{
						cobj->Set(NanNew("type"), NanNew("video"));
						auto div = std::static_pointer_cast<ffmpegcpp::deviceinfovideo>(di);

						auto pixelFormatName = ffmpegcpp::getPixelFormatName(div->pixelFormat);
						if (pixelFormatName != ""){
							cp->Set(NanNew("pixelFormat"), NanNew(pixelFormatName));
						}

						if (div->codec != ""){
							cp->Set(NanNew("codec"), NanNew(div->codec));
						}
						cp->Set(NanNew("minWidth"), NanNew(div->minWidth));
						cp->Set(NanNew("minHeight"), NanNew(div->minHeight));
						cp->Set(NanNew("minFPS"), NanNew(div->minFPS));
						cp->Set(NanNew("maxWidth"), NanNew(div->maxWidth));
						cp->Set(NanNew("maxHeight"), NanNew(div->maxHeight));
						cp->Set(NanNew("maxFPS"), NanNew(div->maxFPS));
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
				v8::Exception::Error(NanNew<v8::String>(re.what()))
			};
			callback->Call(1, argv);
			NanReturnUndefined();
		}

		Local<Value> argv[] = {
			NanNull()
			, retval
		};

		TryCatch try_catch;
		callback->Call(2, argv);

		if (try_catch.HasCaught()) {
			FatalException(try_catch);
		}

		NanReturnUndefined();
	}

	NAN_METHOD(ffmpeg::ListFilters){
		NanScope();
		REQ_FUN_ARG(0, cb);
		NanCallback *callback = new NanCallback(cb.As<Function>());
		ffmpegcpp::ffmpeg ffm;


		auto retval = NanNew<Array>();

		try{
			auto filters = ffmpegcpp::bitstreamfilter::listBitstreamFilters();

			int i = 0;

			for (auto filter : filters){
				retval->Set(i, NanNew(filter));
				i++;
			}

		}
		catch (std::runtime_error re){
			v8::Local<v8::Value> argv[] = {
				v8::Exception::Error(NanNew<v8::String>(re.what()))
			};
			callback->Call(1, argv);
			NanReturnUndefined();
		}

		Local<Value> argv[] = {
			NanNull()
			, retval
		};

		TryCatch try_catch;
		callback->Call(2, argv);

		if (try_catch.HasCaught()) {
			FatalException(try_catch);
		}

		NanReturnUndefined();
	}



	void ffmpeg::ConvertObjectToDictionary(Local<Object> object_, std::shared_ptr<ffmpegcpp::dictionary> dict_)
	{
		auto propnames = object_->GetPropertyNames();
		for (uint32_t i = 0; i < propnames->Length(); i++)
		{
			auto prop = propnames->Get(i);
			NanUtf8String propnamestr(prop->ToString());
			NanUtf8String value(object_->Get(prop)->ToString());

			dict_->set(*propnamestr, *value);
		}
	}

	NAN_METHOD(ffmpeg::OpenAsInput){
		NanScope();

		if (args.Length() < 4){
			return NanThrowTypeError("void alvision.ffmpeg.OpenAsInput(filename, format, options, callback(err,ffmpeg instance))");
		}

		NanUtf8String filename((!args[0]->IsNull() && !args[0]->IsUndefined()) ? args[0]->ToString() : NanNew(""));
		NanUtf8String format((!args[1]->IsNull() && !args[1]->IsUndefined()) ? args[1]->ToString() : NanNew(""));
		auto options = (!args[2]->IsNull() && !args[2]->IsUndefined()) ? args[2]->ToObject() : NanNew<Object>();
		REQ_FUN_ARG(3, cb);
		NanCallback *callback = new NanCallback(cb.As<Function>());
		//auto callback = Local<Function>::Cast(args[3]);

		std::shared_ptr<ffmpegcpp::dictionary> dict = std::make_shared<ffmpegcpp::dictionary>();

		ConvertObjectToDictionary(options, dict);

		auto im_h = ffmpeg::constructor->GetFunction()->NewInstance();
		//Local<Object> im_h = NanNew(ffmpeg::constructor)->GetFunction()->NewInstance();
		ffmpeg *ffminst = ObjectWrap::Unwrap<ffmpeg>(im_h);

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
				NanAssignPersistent<Object>(sc->stream, newstream);

				(*ffminst->_ffmpegStreams)[std::to_string(sc->streamindex)] = sc;
			}
		}
		catch (ffmpegcpp::ffmpeg_exception ffe){
			return NanThrowError(ffe.what());
		}
		catch (std::exception ex){
			return NanThrowError(ex.what());
		}

		//ffminst->Wrap(im_h);

		Local<Value> argv[] = {
			NanNull()
			, im_h
		};

		TryCatch try_catch;
		callback->Call(2, argv);
		if (try_catch.HasCaught()) {
			FatalException(try_catch);
		}

		NanReturnUndefined();
	}


	NAN_METHOD(ffmpeg::OpenAsOutputBuffer){
		NanScope();

		if (args.Length() < 5){
			return NanThrowTypeError("void alvision.ffmpeg.OpenAsOutputBuffer(filename, format, packetSize, totalSize, options, callback)");
		}

		NanUtf8String filename((!args[0]->IsNull() && !args[0]->IsUndefined()) ? args[0]->ToString() : NanNew(""));

		NanUtf8String format((!args[1]->IsNull() && !args[1]->IsUndefined()) ? args[1]->ToString() : NanNew(""));

		//packet size
		auto packetSize = args[2]->Int32Value();
		//total size/
		auto totalSize = args[3]->Int32Value();


		auto options = (!args[4]->IsNull() && !args[4]->IsUndefined()) ? args[4]->ToObject() : NanNew<Object>();
		//auto callback = Local<Function>::Cast(args[3]);
		REQ_FUN_ARG(5, cb);
		NanCallback *callback = new NanCallback(cb.As<Function>());

		std::shared_ptr<ffmpegcpp::dictionary> dict = std::make_shared<ffmpegcpp::dictionary>();

		ConvertObjectToDictionary(options, dict);

		auto im_h = ffmpeg::constructor->GetFunction()->NewInstance();
		//Local<Object> im_h = NanNew(ffmpeg::constructor)->GetFunction()->NewInstance();
		ffmpeg *ffminst = ObjectWrap::Unwrap<ffmpeg>(im_h);

		//TODO: convert to error callback! (first parameter)
		try{
			assert(!ffminst->_openedAsInput && "shouldn't be here, instance already opened as output");
			ffminst->_ffmpegMemoryContext = std::make_shared<ffmpegcpp::memorycontext>(packetSize, totalSize);

			ffminst->_ffmpegContext = ffminst->_ffmpeg->open_output(ffminst->_ffmpegMemoryContext, *filename, *format);
			ffminst->_openedAsOutput = true;


		}
		catch (ffmpegcpp::ffmpeg_exception ffe){
			return NanThrowError(ffe.what());
		}
		catch (std::exception ex){
			return NanThrowError(ex.what());
		}

		//ffminst->Wrap(im_h);

		Local<Value> argv[] = {
			NanNull()
			, im_h
		};

		TryCatch try_catch;
		callback->Call(2, argv);
		if (try_catch.HasCaught()) {
			FatalException(try_catch);
		}


		NanReturnUndefined();
	}


	NAN_METHOD(ffmpeg::OpenAsOutput){
		NanScope();

		if (args.Length() < 4){
			return NanThrowTypeError("void alvision.ffmpeg.OpenAsOutput(filename, format, options, callback)");
		}

		NanUtf8String filename((!args[0]->IsNull() && !args[0]->IsUndefined()) ? args[0]->ToString() : NanNew(""));
		NanUtf8String format((!args[1]->IsNull() && !args[1]->IsUndefined()) ? args[1]->ToString() : NanNew(""));
		auto options = (!args[2]->IsNull() && !args[2]->IsUndefined()) ? args[2]->ToObject() : NanNew<Object>();
		//auto callback = Local<Function>::Cast(args[3]);
		REQ_FUN_ARG(3, cb);
		NanCallback *callback = new NanCallback(cb.As<Function>());

		std::shared_ptr<ffmpegcpp::dictionary> dict = std::make_shared<ffmpegcpp::dictionary>();

		ConvertObjectToDictionary(options, dict);

		auto im_h = ffmpeg::constructor->GetFunction()->NewInstance();
		//Local<Object> im_h = NanNew(ffmpeg::constructor)->GetFunction()->NewInstance();
		ffmpeg *ffminst = ObjectWrap::Unwrap<ffmpeg>(im_h);

		//TODO: convert to error callback! (first parameter)
		try{
			assert(!ffminst->_openedAsInput && "shouldn't be here, instance already opened as output");
			ffminst->_ffmpegContext = ffminst->_ffmpeg->open_output(*filename, *format);
			ffminst->_openedAsOutput = true;


		}
		catch (ffmpegcpp::ffmpeg_exception ffe){
			return NanThrowError(ffe.what());
		}
		catch (std::exception ex){
			return NanThrowError(ex.what());
		}

		//ffminst->Wrap(im_h);

		Local<Value> argv[] = {
			NanNull()
			, im_h
		};

		TryCatch try_catch;
		callback->Call(2, argv);
		if (try_catch.HasCaught()) {
			FatalException(try_catch);
		}


		NanReturnUndefined();
	}

	NAN_METHOD(ffmpeg::getNextBufferSizes){
		SETUP_FUNCTION(ffmpeg);

		if (self->_ffmpegMemoryContext == nullptr){
			return NanThrowError("getNextBufferSizes cannot execute on non Buffered instance");
		}

		auto retval = NanNew<Object>();
		retval->Set(NanNew("size"), NanNew(self->_ffmpegMemoryContext->size()));
		retval->Set(NanNew("blocks"), NanNew(self->_ffmpegMemoryContext->blocks()));

		NanReturnValue(retval);
	}


	NAN_METHOD(ffmpeg::getNextBuffer){
		SETUP_FUNCTION(ffmpeg);

		if (self->_ffmpegMemoryContext == nullptr){
			return NanThrowError("getNextBuffer cannot execute on non Buffered instance");
		}

		if (args.Length() < 1){
			return NanThrowTypeError("int getNextBuffer(buffer);");
		}

		if ((!node::Buffer::HasInstance(args[0])) || (node::Buffer::Length(args[0]) < self->_ffmpegMemoryContext->getBlockSize())){
			return NanThrowRangeError("int getNextBuffer first argument must be a preallocated buffer at the size of the maximum packet size");
		}

		auto bufferDataPtr = node::Buffer::Data(args[0]);
		auto actuallyRead = self->_ffmpegMemoryContext->read_next_block((uint8_t*)bufferDataPtr, node::Buffer::Length(args[0]));

		NanReturnValue(NanNew(actuallyRead));
	}

	NAN_METHOD(ffmpeg::WriteHeader){
		SETUP_FUNCTION(ffmpeg);

		/*if (args.Length() < 4){
			return NanThrowTypeError("void alvision.ffmpeg.OpenAsOutput(filename, format, options, callback)");
			}*/

		if (self->_outputWroteHeader == true){
			return NanThrowError("WriteHeader can only be executed once");
		}

		auto options = (!args[0]->IsNull() && !args[0]->IsUndefined()) ? args[0]->ToObject() : NanNew<Object>();
		auto metadata = (!args[1]->IsNull() && !args[1]->IsUndefined()) ? args[1]->ToObject() : NanNew<Object>();

		//REQ_FUN_ARG(2, cb);
		//NanCallback *callback = new NanCallback(cb.As<Function>());

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
			return NanThrowError(ffe.what());
		}
		catch (std::exception ex){
			return NanThrowError(ex.what());
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

		NanReturnValue(NanNew(true));

		NanReturnUndefined();
	}

	NAN_METHOD(ffmpeg::GetSDP){
		SETUP_FUNCTION(ffmpeg);

		if (self->_ffmpegContext == nullptr){
			return NanThrowError("GetSDP must execute on initialized instance");
		}

		//REQ_FUN_ARG(2, cb);
		//NanCallback *callback = new NanCallback(cb.As<Function>());

		try{
			auto sdp = self->_ffmpegContext->getSDP();
			NanReturnValue(NanNew(sdp));
		}
		catch (ffmpegcpp::ffmpeg_exception ffe){
			return NanThrowError(ffe.what());
		}
		catch (std::exception ex){
			return NanThrowError(ex.what());
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
			return NanThrowError(ffe.what());
		}
		catch (std::exception ex){
			return NanThrowError(ex.what());
		}

		NanReturnValue(NanNew(success));
	}

	NAN_METHOD(ffmpeg::GetStreams)
	{
		SETUP_FUNCTION(ffmpeg);

		auto ret = NanNew<Array>();

		int i = 0;

		for (auto streamkv : *self->_ffmpegStreams)
		{
			if (streamkv.second->stream.IsEmpty()){
				NanAssignPersistent<Object>(streamkv.second->stream, stream::Instantiate(self, streamkv.first, streamkv.second->ffstream));
			}

			ret->Set(i, streamkv.second->stream);
			i++;
		}

		NanReturnValue(ret);

	}

	NAN_METHOD(ffmpeg::AddStream)
	{
		SETUP_FUNCTION(ffmpeg);

		if (args.Length() < 1){
			return NanThrowTypeError("void ffmpeg.AddStream(config)");
		}

		if (self->_ffmpegContext == nullptr){
			return NanThrowError("cannot perform operations on a closed instance");
		}

		if (!self->_openedAsOutput){
			return NanThrowError("AddStream only works on outputs");
		}

		auto config = (!args[0]->IsNull() && !args[0]->IsUndefined()) ? args[0]->ToObject() : NanNew<Object>();

		if (config->Get(NanNew("id"))->IsUndefined())
			return NanThrowError("id must be specified");
		if (config->Get(NanNew("codec"))->IsUndefined())
			return NanThrowError("codec must be specified");
		if (config->Get(NanNew("timebase"))->IsUndefined())
			return NanThrowError("timebase must be specified");

		NanUtf8String stream_id(config->Get(NanNew("id"))->ToString());
		NanUtf8String codec_id(config->Get(NanNew("codec"))->ToString());
		double timebase = config->Get(NanNew("timebase"))->NumberValue();

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

			if (!config->Get(NanNew("bitrate"))->IsUndefined())
				streamCodec->bit_rate(config->Get(NanNew("bitrate"))->Int32Value());

			if (!config->Get(NanNew("width"))->IsUndefined())
			{
				auto width = config->Get(NanNew("width"))->Int32Value();
				streamCodec->width(width);
			}

			if (!config->Get(NanNew("height"))->IsUndefined())
			{
				auto height = config->Get(NanNew("height"))->Int32Value();
				streamCodec->height(height);
			}

			if (!config->Get(NanNew("gopsize"))->IsUndefined())
				streamCodec->gop_size(config->Get(NanNew("gopsize"))->Int32Value());

			if (!config->Get(NanNew("pixfmt"))->IsUndefined())
				streamCodec->pix_fmt(ffmpegcpp::getPixelFormatByName(*NanUtf8String(config->Get(NanNew("pixfmt"))->ToString())));

			if (!config->Get(NanNew("channels"))->IsUndefined())
				streamCodec->channels(config->Get(NanNew("channels"))->Int32Value());

			if (!config->Get(NanNew("samplerate"))->IsUndefined())
				streamCodec->sample_rate(config->Get(NanNew("samplerate"))->Int32Value());

			if (!config->Get(NanNew("channelslayout"))->IsUndefined())
				streamCodec->channels_layout(ffmpegcpp::getChannelLayoutByName(*NanUtf8String(config->Get(NanNew("channelslayout"))->ToString())));

			if (!config->Get(NanNew("samplefmt"))->IsUndefined())
				streamCodec->sample_fmt(ffmpegcpp::getSampleFormatByName(*NanUtf8String(config->Get(NanNew("samplefmt"))->ToString())));

			if (!config->Get(NanNew("options"))->IsUndefined()){
				auto options = config->Get(NanNew("options"))->ToObject();
				ConvertObjectToDictionary(options, optionsdict);
			}

			stream->getEncoder()->open(optionsdict);

			NanAssignPersistent<Object>(sc->stream, stream::Instantiate(self, sc->streamid, stream));

		}
		catch (ffmpegcpp::ffmpeg_exception ffe){
			return NanThrowError(ffe.what());
		}
		catch (std::exception ex){
			return NanThrowError(ex.what());
		}

		NanReturnValue(sc->stream);
	}

	NAN_METHOD(ffmpeg::WritePacket)
	{
		SETUP_FUNCTION(ffmpeg);

		packet *pt = ObjectWrap::Unwrap<packet>(args[0]->ToObject());
		if (pt == NULL){
			return NanThrowError("first argument must be a packet");
		}

		bool interleaved = (!args[1]->IsUndefined()) ? args[1]->BooleanValue() : true;

		try{
			if (interleaved){
				self->_ffmpegContext->write_packet_interleaved(*pt->_packet);
			}
			else{
				self->_ffmpegContext->write_packet(*pt->_packet);
			}
		}
		catch (ffmpegcpp::ffmpeg_exception ffe){
			return NanThrowError(ffe.what());
		}
		catch (std::exception ex){
			return NanThrowError(ex.what());
		}

		NanReturnUndefined();
	}

	NAN_METHOD(ffmpeg::ReadPacket)
	{
		SETUP_FUNCTION(ffmpeg);

		packet *pt = ObjectWrap::Unwrap<packet>(args[0]->ToObject());
		if (pt == NULL){
			return NanThrowError("first argument must be a packet");
		}

		ffmpegcpp::readPacketState state = ffmpegcpp::readPacketState::again;
		try{
			state = self->_ffmpegContext->readPacket(pt->_packet);
		}
		catch (ffmpegcpp::ffmpeg_exception ffe){
			return NanThrowError(ffe.what());
		}
		catch (std::exception ex){
			return NanThrowError(ex.what());
		}

		switch (state){
		case ffmpegcpp::readPacketState::success:
			NanReturnValue(NanNew("success"));
			break;
		case ffmpegcpp::readPacketState::again:
			NanReturnValue(NanNew("again"));
			break;
		case ffmpegcpp::readPacketState::eof:
			NanReturnValue(NanNew("eof"));
			break;
		default:
			NanReturnValue(NanNew("unknown"));
			break;
		}

	}

}