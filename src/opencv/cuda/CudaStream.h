#ifndef _ALVISION_CUDA_STREAM_H_
#define _ALVISION_CUDA_STREAM_H_
#include "../../alvision.h"


//#ifdef HAVE_CUDA

namespace cuda {

	class Stream : public or ::ObjectWrap{
	public:
		static std::string name;

		static void Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
		static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
		static Nan::Persistent<FunctionTemplate> constructor;
		virtual v8::Local<v8::Function> get_constructor();

		std::shared_ptr<cv::cuda::Stream> _stream;

		static std::shared_ptr<Stream> Null();

		static POLY_METHOD(New);

		static POLY_METHOD(queryIfComplete);
		static POLY_METHOD(waitForCompletion);
		static POLY_METHOD(waitEvent);
		static POLY_METHOD(enqueueHostCallback);
		static POLY_METHOD(Null);

	};
};

//#endif

#endif