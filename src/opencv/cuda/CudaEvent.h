#ifndef _ALVISION_CUDA_EVENT_H_
#define _ALVISION_CUDA_EVENT_H_
#include "../../alvision.h"


//#ifdef HAVE_CUDA
namespace cuda {

	class Event : public or ::ObjectWrap{
	public:
		static std::string name;

		static void Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
		static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

		static Nan::Persistent<FunctionTemplate> constructor;
		virtual v8::Local<v8::Function> get_constructor();

		std::shared_ptr<cv::cuda::Event> _deviceInfo;

		static POLY_METHOD(New);

		static POLY_METHOD(record);
		static POLY_METHOD(queryIfComplete);
		static POLY_METHOD(waitForCompletion);
		static POLY_METHOD(elapsedTime);

	};
};

//#endif

#endif