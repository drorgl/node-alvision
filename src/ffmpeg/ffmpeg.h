#ifndef _ALVISION_FFMPEG_H_
#define _ALVISION_FFMPEG_H_

#include "../alvision.h"

#include "../utilities/uvasync.h"

#include "../utilities/threadsafe_queue.h"

#include "stream.h"

namespace alvision{

	struct streamcontainer
	{
		std::string streamid;
		int streamindex;
		Nan::Persistent<v8::Object> stream;
		std::shared_ptr<ffmpegcpp::stream> ffstream;
	};

	class ffmpeg : public Nan::ObjectWrap {
		friend class stream;
	private:

		struct log_message
		{
			std::string module;
			int level;
			std::string message;
		};


		class AsyncListInputFormatsWorker;
		class AsyncListOutputFormatsWorker;

		static Local<Object> fromFFMpegComponent(ffmpegcpp::component comp);
		//static Local<Array> fromFFMpegComponentFlags(ffmpegcpp::component_flags cflg);
		static Local<Object> fromFFMpegOptions(std::vector<ffmpegcpp::option> &options);
		//static std::string fromFFMpegOptionType(ffmpegcpp::option_type otype);



		/*Logger Begin*/

		/*v8 logger callback pointer*/
		static Nan::Persistent<Function> _logger;
		/*ffmpeg logger callback*/
		static void _ffmpeg_logger(std::string module, int level, std::string message);
		/*async callback for sending the messages on the main event loop*/
		static void _async_logger_callback(uv_async_t *handle/*, int status UNUSED*/);
		/*a queue for log messages*/
		static threadsafe_queue<log_message> _log_messages;
		/*uv async synchronizer for main event loop*/
		//static uv_async_t _logger_async;
		//static void closed_cb(uv_handle_t* handle);
		//static std::atomic<bool> _isClosed;
		static std::shared_ptr<uvasync> _logger_async;

		/*Logger Ends*/


		static void ConvertObjectToDictionary(Local<Object> object_, std::shared_ptr<ffmpegcpp::dictionary> dict_);

		template<typename VectorT, typename LocalT>
		static Local<Array> fromVector(std::vector<VectorT> vector, std::function<Local<LocalT>(VectorT)> cfunc)
		{
			Local<Array> retval = Nan::New<Array>();
			int i = 0;
			for (auto vt : vector)
			{
				retval->Set(i, cfunc(vt));
				i++;
			}
			return retval;
		}


		std::shared_ptr<ffmpegcpp::ffmpeg> _ffmpeg;
		std::shared_ptr<ffmpegcpp::formatcontext> _ffmpegContext;
		std::shared_ptr<ffmpegcpp::memorycontext> _ffmpegMemoryContext;
		bool _openedAsInput = false;
		bool _openedAsOutput = false;
		bool _outputWroteHeader = false; //protection against attempting to close without writing the header, it will crash ffmpeg
		std::shared_ptr<std::map<std::string, std::shared_ptr<streamcontainer>>> _ffmpegStreams = nullptr;


		static Nan::Persistent<FunctionTemplate> constructor;
		
		ffmpeg();



		



	public:
		static void Init(Nan::ADDON_REGISTER_FUNCTION_ARGS_TYPE target, std::shared_ptr<overload_resolution> overload);

		static NAN_METHOD(New);
		static NAN_METHOD(ListInputFormats);
		static NAN_METHOD(ListOutputFormats);
		static NAN_METHOD(SetLogger);
		static NAN_METHOD(ListCodecs);
		static NAN_METHOD(ListDevices);
		static NAN_METHOD(ListFilters);

		static NAN_METHOD(OpenAsInput);
		static NAN_METHOD(OpenAsOutput);
		static NAN_METHOD(OpenAsOutputBuffer);
		static NAN_METHOD(getNextBufferSizes);
		static NAN_METHOD(getNextBuffer);

		static NAN_METHOD(GetSDP);

		static NAN_METHOD(Close);

		static NAN_METHOD(GetStreams);
		static NAN_METHOD(AddStream);

		static NAN_METHOD(WriteHeader);
		static NAN_METHOD(ReadPacket); //bool ReadPacket();
		static NAN_METHOD(WritePacket);



	};

}
#endif