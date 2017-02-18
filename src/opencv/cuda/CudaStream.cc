#include "CudaStream.h"
#include "CudaEvent.h"

//#ifdef HAVE_CUDA

namespace stream_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("stream_general_callback is empty");
		}
		return overload->execute("stream", info);
	}
}

namespace cuda {

	Nan::Persistent<FunctionTemplate> Stream::constructor;
	std::string Stream::name;

	void
		Stream::Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
		Stream::name = "Stream";
		stream_general_callback::overload = overload;
	}

	void
		Stream::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
		

		//Class
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(stream_general_callback::callback);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New("Stream").ToLocalChecked());

		overload->register_type<Stream>(ctor, "stream", "Stream");




		//        //===================================================================================
		//        // Stream
		//        //===================================================================================
		//
		//        /** @brief This class encapsulates a queue of asynchronous calls.
		//        
		//        @note Currently, you may face problems if an operation is enqueued twice with different data. Some
		//        functions use the constant GPU memory, and next call may update the memory before the previous one
		//        has been finished. But calling different operations asynchronously is safe because each operation
		//        has its own constant buffer. Memory copy/upload/download/set operations to the buffers you hold are
		//        also safe. :
		//         */
		//interface StreamStatic {
		//	//! creates a new asynchronous stream
		//	new () : Stream;
		overload->addOverloadConstructor("stream", "Stream", {}, New);
		//
		//}


		//export interface Stream {
			//            typedef void (Stream::*bool_type)() const;
			//            void this_type_does_not_support_comparisons() const {}
			//
			//            public:
			//            typedef void (*StreamCallback)(int status, void* userData);
			//
			//
			/** @brief Returns true if the current stream queue is finished. Otherwise, it returns false.
			*/
		overload->addOverload("stream", "Stream", "queryIfComplete", {}, queryIfComplete);
		//queryIfComplete() : boolean;

		/** @brief Blocks the current CPU thread until all operations in the stream are complete.
		*/
		overload->addOverload("stream", "Stream", "waitForCompletion", {
			make_param<std::shared_ptr< or ::AsyncCallback>>("cb","Function")
		}, waitForCompletion);
		//waitForCompletion(cb: () = > void) : void;

		/** @brief Makes a compute stream wait on an event.
		*/
		overload->addOverload("stream", "Stream", "waitEvent", { make_param<Event*>("event",Event::name) }, waitEvent);
		//waitEvent(event: Event) : void;

		/** @brief Adds a callback to be called on the host after all currently enqueued items in the stream have
		completed.

		@note Callbacks must not make any CUDA API calls. Callbacks must not perform any synchronization
		that may depend on outstanding device work or other callbacks that are not mandated to run earlier.
		Callbacks without a mandated order (in independent streams) execute in undefined order and may be
		serialized.
		*/
		overload->addOverload("stream", "Stream", "enqueueHostCallback", {
			make_param<std::shared_ptr< or ::AsyncCallback>>("cb","Function")
		}, enqueueHostCallback);
		//enqueueHostCallback(callback: (status: _st.int, userData : any) = > void, userData: any) : void;
		//
		//    //! return Stream object for default CUDA stream
		overload->addOverload("stream", "Stream", "Null", {}, Null);
		//    static Stream & Null();
		//
		//            //! returns true if stream object is not default (!= 0)
		//            operator bool_type() const;
		//
		//            class Impl;
		//
		//            private:
		//            Ptr < Impl > impl_;
		//            Stream(const Ptr<Impl>& impl);
		//
		//            friend struct StreamAccessor;
		//            friend class BufferPool;
		//            friend class DefaultDeviceInitializer;
	//}

	//export var Stream : StreamStatic = alvision_module.Stream;
		target->Set(Nan::New("Stream").ToLocalChecked(), ctor->GetFunction());

	}

	v8::Local<v8::Function> Stream::get_constructor() {
		assert(!constructor.IsEmpty() && "constructor is empty");
		return Nan::New(constructor)->GetFunction();
	}

	std::shared_ptr<Stream> Stream::Null() {
		auto ret = std::make_shared<Stream>();
		ret->_stream = std::make_shared<cv::cuda::Stream>();

		return ret;
	}


	POLY_METHOD(Stream::New) { 
		auto ret = new Stream();
		
		ret->_stream = std::make_shared<cv::cuda::Stream>();

		ret->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}
	POLY_METHOD(Stream::queryIfComplete) { throw std::exception("not implemented"); }
	POLY_METHOD(Stream::waitForCompletion) { throw std::exception("not implemented"); }
	POLY_METHOD(Stream::waitEvent) { throw std::exception("not implemented"); }
	POLY_METHOD(Stream::enqueueHostCallback) { throw std::exception("not implemented"); }
	POLY_METHOD(Stream::Null) { throw std::exception("not implemented"); }

};