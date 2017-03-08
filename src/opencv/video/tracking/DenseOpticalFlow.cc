#include "DenseOpticalFlow.h"
#include "../../IOArray.h"


namespace denseopticalflow_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("denseopticalflow_general_callback is empty");
		}
		return overload->execute("denseopticalflow", info);
	}
}

Nan::Persistent<FunctionTemplate> DenseOpticalFlow::constructor;


void
DenseOpticalFlow::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {


	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(denseopticalflow_general_callback::callback);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("DenseOpticalFlow").ToLocalChecked());
	ctor->Inherit(Nan::New(Algorithm::constructor));

	overload->register_type<DenseOpticalFlow>(ctor, "denseopticalflow", "DenseOpticalFlow");



	overload->addOverloadConstructor("denseopticalflow", "DenseOpticalFlow", {}, New);


	//	interface DenseOpticalFlow extends _core.Algorithm
	//	{
	//	//public:
	//	/** @brief Calculates an optical flow.
	//	
	//	@param I0 first 8-bit single-channel input image.
	//	@param I1 second input image of the same size and the same type as prev.
	//	@param flow computed flow image that has the same size as prev and type CV_32FC2.
	//	 */
	//	
	overload->addOverload("kalmanfilter", "KalmanFilter", "calc", {
		make_param<IOArray*>("I0","InputArray"),
		make_param<IOArray*>("I1","InputArray"),
		make_param<IOArray*>("flow","InputOutputArray")
	}, calc);
	Nan::SetPrototypeMethod(ctor, "calc", denseopticalflow_general_callback::callback);
	//	    calc(I0: _st.InputArray, I1: _st.InputArray, flow: _st.InputOutputArray ): void;
	//	/** @brief Releases all inner buffers.
	//	*/
	//	//    CV_WRAP virtual void collectGarbage() = 0;
	//	};


	target->Set(Nan::New("DenseOpticalFlow").ToLocalChecked(), ctor->GetFunction());


};

v8::Local<v8::Function> DenseOpticalFlow::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(DenseOpticalFlow::New) {
	auto ret = new DenseOpticalFlow();
	//ret->_algorithm = cv::makePtr<cv::DenseOpticalFlow>();

	ret->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}


POLY_METHOD(DenseOpticalFlow::calc) {
	auto this_ = info.This<DenseOpticalFlow*>();

	auto I0 = info.at<IOArray*>(0)->GetInputArray();
	auto I1 = info.at<IOArray*>(1)->GetInputArray();
	auto flow = info.at<IOArray*>(2)->GetInputOutputArray();

	this_->_algorithm.dynamicCast<cv::DenseOpticalFlow>()->calc(I0, I1, flow);
}