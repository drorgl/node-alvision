#include "KalmanFilter.h"
#include "../../Matrix.h"

namespace kalmanfilter_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("kalmanfilter_general_callback is empty");
		}
		return overload->execute("kalmanfilter", info);
	}
}

Nan::Persistent<FunctionTemplate> KalmanFilter::constructor;


void
KalmanFilter::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(kalmanfilter_general_callback::callback);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("KalmanFilter").ToLocalChecked());

	overload->register_type<KalmanFilter>(ctor, "kalmanfilter", "KalmanFilter");






	/** @brief Kalman filter class.

	The class implements a standard Kalman filter <http://en.wikipedia.org/wiki/Kalman_filter>,
	@cite Welch95 . However, you can modify transitionMatrix, controlMatrix, and measurementMatrix to get
	an extended Kalman filter functionality. See the OpenCV sample kalman.cpp.

	@note

	-   An example using the standard Kalman filter can be found at
	opencv_source_code/samples/cpp/kalman.cpp
	*/



//			interface KalmanFilterStatic {
//				/** @brief The constructors.
//		
//				@note In C API when CvKalman\* kalmanFilter structure is not needed anymore, it should be released
//				with cvReleaseKalman(&kalmanFilter)
//				*/
//				new () : KalmanFilter;
	overload->addOverloadConstructor("kalmanfilter", "KalmanFilter", {}, New);
//				/** @overload
//				@param dynamParams Dimensionality of the state.
//				@param measureParams Dimensionality of the measurement.
//				@param controlParams Dimensionality of the control vector.
//				@param type Type of the created matrices that should be CV_32F or CV_64F.
//				*/
//				new (dynamParams: _st.int, measureParams : _st.int, controlParams ? : _st.int /*= 0*/, type ? : _st.int /*= CV_32F*/) : KalmanFilter;
	overload->addOverloadConstructor("kalmanfilter", "KalmanFilter", {
		make_param<int>("dynamParams","int"),
		make_param<int>("measureParams","int"),
		make_param<int>("controlParams","int", 0),
		make_param<int>("type","int",CV_32F)
	}, New_params);
//			}
//		
//			export interface KalmanFilter
//			{
//				//public:
//		
//		
//				/** @brief Re-initializes Kalman filter. The previous content is destroyed.
//		
//				@param dynamParams Dimensionality of the state.
//				@param measureParams Dimensionality of the measurement.
//				@param controlParams Dimensionality of the control vector.
//				@param type Type of the created matrices that should be CV_32F or CV_64F.
//				*/
//				init(dynamParams: _st.int, measureParams : _st.int, controlParams ? : _st.int /*= 0*/, type ? : _st.int /*= CV_32F*/) : void;
	overload->addOverload("kalmanfilter", "KalmanFilter", "init", {
		make_param<int>("dynamParams","int"),
		make_param<int>("measureParams","int"),
		make_param<int>("controlParams","int", 0),
		make_param<int>("type","int",CV_32F)
	}, init);
	Nan::SetPrototypeMethod(ctor, "init", kalmanfilter_general_callback::callback);
//		
//				/** @brief Computes a predicted state.
//		
//				@param control The optional input control
//				*/
//				predict(control ? : _mat.Mat /*= Mat()*/) : _mat.Mat;
	overload->addOverload("kalmanfilter", "KalmanFilter", "predict", {
		make_param<Matrix*>("control",Matrix::name, Matrix::create())
	}, predict);
	Nan::SetPrototypeMethod(ctor, "predict", kalmanfilter_general_callback::callback);
//		
//				/** @brief Updates the predicted state from the measurement.
//		
//				@param measurement The measured system parameters
//				*/
//				correct(measurement : _mat.Mat) : _mat.Mat;
	overload->addOverload("kalmanfilter", "KalmanFilter", "correct", {
		make_param<Matrix*>("measurement",Matrix::name)
	}, correct);
	Nan::SetPrototypeMethod(ctor, "correct", kalmanfilter_general_callback::callback);
//		
//			statePre: _mat.Mat;           //!< predicted state (x'(k)): x(k)=A*x(k-1)+B*u(k)
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("statePre").ToLocalChecked(), statePre_getter, statePre_setter);
//			statePost: _mat.Mat;          //!< corrected state (x(k)): x(k)=x'(k)+K(k)*(z(k)-H*x'(k))
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("statePost").ToLocalChecked(), statePost_getter, statePost_setter);
//			transitionMatrix: _mat.Mat;   //!< state transition matrix (A)
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("transitionMatrix").ToLocalChecked(), transitionMatrix_getter, transitionMatrix_setter);
//			controlMatrix: _mat.Mat;      //!< control matrix (B) (not used if there is no control)
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("controlMatrix").ToLocalChecked(), controlMatrix_getter, controlMatrix_setter);
//			measurementMatrix: _mat.Mat;  //!< measurement matrix (H)
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("measurementMatrix").ToLocalChecked(), measurementMatrix_getter, measurementMatrix_setter);
//			processNoiseCov: _mat.Mat;    //!< process noise covariance matrix (Q)
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("processNoiseCov").ToLocalChecked(), processNoiseCov_getter, processNoiseCov_setter);
//			measurementNoiseCov: _mat.Mat;//!< measurement noise covariance matrix (R)
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("measurementNoiseCov").ToLocalChecked(), measurementNoiseCov_getter, measurementNoiseCov_setter);
//			errorCovPre: _mat.Mat;        //!< priori error estimate covariance matrix (P'(k)): P'(k)=A*P(k-1)*At + Q)*/
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("errorCovPre").ToLocalChecked(), errorCovPre_getter, errorCovPre_setter);
//			gain: _mat.Mat;               //!< Kalman gain matrix (K(k)): K(k)=P'(k)*Ht*inv(H*P'(k)*Ht+R)
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("gain").ToLocalChecked(), gain_getter, gain_setter);
//			errorCovPost: _mat.Mat;       //!< posteriori error estimate covariance matrix (P(k)): P(k)=(I-K(k)*H)*P'(k)
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("errorCovPost").ToLocalChecked(), errorCovPost_getter, errorCovPost_setter);
//		
//										  //    // temporary matrices
//										  //    Mat temp1;
//										  //    Mat temp2;
//										  //    Mat temp3;
//										  //    Mat temp4;
//										  //    Mat temp5;
//			};
//		
//			export var KalmanFilter : KalmanFilterStatic = alvision_module.KalmanFilter;











	target->Set(Nan::New("KalmanFilter").ToLocalChecked(), ctor->GetFunction());

	
};

v8::Local<v8::Function> KalmanFilter::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}





POLY_METHOD(KalmanFilter::New){
	auto ret = new KalmanFilter();
	ret->_kalmanFilter = std::make_shared<cv::KalmanFilter>();
	
	ret->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(KalmanFilter::New_params){throw std::runtime_error("not implemented");}
POLY_METHOD(KalmanFilter::init){throw std::runtime_error("not implemented");}
POLY_METHOD(KalmanFilter::predict){throw std::runtime_error("not implemented");}
POLY_METHOD(KalmanFilter::correct){throw std::runtime_error("not implemented");}
NAN_GETTER(KalmanFilter::statePre_getter){throw std::runtime_error("not implemented");}
NAN_SETTER(KalmanFilter::statePre_setter){throw std::runtime_error("not implemented");}
NAN_GETTER(KalmanFilter::statePost_getter){throw std::runtime_error("not implemented");}
NAN_SETTER(KalmanFilter::statePost_setter){throw std::runtime_error("not implemented");}
NAN_GETTER(KalmanFilter::transitionMatrix_getter){throw std::runtime_error("not implemented");}
NAN_SETTER(KalmanFilter::transitionMatrix_setter){throw std::runtime_error("not implemented");}
NAN_GETTER(KalmanFilter::controlMatrix_getter){throw std::runtime_error("not implemented");}
NAN_SETTER(KalmanFilter::controlMatrix_setter){throw std::runtime_error("not implemented");}
NAN_GETTER(KalmanFilter::measurementMatrix_getter){throw std::runtime_error("not implemented");}
NAN_SETTER(KalmanFilter::measurementMatrix_setter){throw std::runtime_error("not implemented");}
NAN_GETTER(KalmanFilter::processNoiseCov_getter){throw std::runtime_error("not implemented");}
NAN_SETTER(KalmanFilter::processNoiseCov_setter){throw std::runtime_error("not implemented");}
NAN_GETTER(KalmanFilter::measurementNoiseCov_getter){throw std::runtime_error("not implemented");}
NAN_SETTER(KalmanFilter::measurementNoiseCov_setter){throw std::runtime_error("not implemented");}
NAN_GETTER(KalmanFilter::errorCovPre_getter){throw std::runtime_error("not implemented");}
NAN_SETTER(KalmanFilter::errorCovPre_setter){throw std::runtime_error("not implemented");}
NAN_GETTER(KalmanFilter::gain_getter){throw std::runtime_error("not implemented");}
NAN_SETTER(KalmanFilter::gain_setter){throw std::runtime_error("not implemented");}
NAN_GETTER(KalmanFilter::errorCovPost_getter){throw std::runtime_error("not implemented");}
NAN_SETTER(KalmanFilter::errorCovPost_setter){throw std::runtime_error("not implemented");}

