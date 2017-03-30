#include "CudaEvent.h"
#include "CudaStream.h"

//#ifdef HAVE_CUDA

namespace event_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("event_general_callback is empty");
		}
		return overload->execute("event", info);
	}
}

namespace cuda {
	Nan::Persistent<FunctionTemplate> Event::constructor;
	std::string Event::name;

	void
		Event::Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
		Event::name = "Event";
		event_general_callback::overload = overload;

	}

	void
		Event::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
		

		//Class
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(event_general_callback::callback);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New("Event").ToLocalChecked());

		overload->register_type<Event>(ctor, "event", "Event");




		auto CreateFlags = CreateNamedObject(target, "CreateFlags");
		SetObjectProperty(CreateFlags, "DEFAULT", cv::cuda::Event::CreateFlags::DEFAULT);
		SetObjectProperty(CreateFlags, "BLOCKING_SYNC", cv::cuda::Event::CreateFlags::BLOCKING_SYNC);
		SetObjectProperty(CreateFlags, "DISABLE_TIMING", cv::cuda::Event::CreateFlags::DISABLE_TIMING);
		SetObjectProperty(CreateFlags, "INTERPROCESS", cv::cuda::Event::CreateFlags::INTERPROCESS);
		overload->add_type_alias("CreateFlags", "int");

		//
		//interface Event
		//{
			//            public:
			//            enum CreateFlags {
			//                DEFAULT = 0x00,  /**< Default event flag */
			//                BLOCKING_SYNC = 0x01,  /**< Event uses blocking synchronization */
			//                DISABLE_TIMING = 0x02,  /**< Event will not record timing data */
			//                INTERPROCESS = 0x04   /**< Event is suitable for interprocess use. DisableTiming must be set */
			//            };
			//
		overload->addOverloadConstructor("event", "Event", { make_param<int>("flags","CreateFlags") }, New);
		//            explicit Event(CreateFlags flags = DEFAULT);
		//
		//            //! records an event
		//            void record(Stream & stream = Stream::Null());
#ifdef HAVE_CUDA
		overload->addOverload("event", "Event", "record", { make_param<Stream*>("stream",Stream::name, Stream::Null()) }, record);
#endif
		//
		//            //! queries an event's status
		//            bool queryIfComplete() const;
		overload->addOverload("event", "Event", "queryIfComplete", {}, queryIfComplete);
		//
		//            //! waits for an event to complete
		//            void waitForCompletion();
		overload->addOverload("event", "Event", "waitForCompletion", {}, waitForCompletion);
		//
		//    //! computes the elapsed time between events
		//    static float elapsedTime(const Event& start, const Event& end);
		overload->addStaticOverload("event", "Event", "elapsedTime", {
			make_param<Event*>("event",Event::name),
			make_param<Event*>("elapsedTime",Event::name)
		}, elapsedTime);
		//
		//            class Impl;
		//
		//            private:
		//            Ptr < Impl > impl_;
		//            Event(const Ptr<Impl>& impl);
		//
		//            friend struct EventAccessor;
	//};

		target->Set(Nan::New("Event").ToLocalChecked(), ctor->GetFunction());

	}

	v8::Local<v8::Function> Event::get_constructor() {
		assert(!constructor.IsEmpty() && "constructor is empty");
		return Nan::New(constructor)->GetFunction();
	}

	POLY_METHOD(Event::New) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(Event::record) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(Event::queryIfComplete) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(Event::waitForCompletion) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(Event::elapsedTime) { throw std::runtime_error("not implemented"); }

};