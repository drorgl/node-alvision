#include "DualTVL1OpticalFlow.h"

namespace dualtvl1opticalflow_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("dualtvl1opticalflow_general_callback is empty");
		}
		return overload->execute("dualtvl1opticalflow", info);
	}
}

Nan::Persistent<FunctionTemplate> DualTVL1OpticalFlow::constructor;


void
DualTVL1OpticalFlow::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {


	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(dualtvl1opticalflow_general_callback::callback);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("DualTVL1OpticalFlow").ToLocalChecked());
	ctor->Inherit(Nan::New(DenseOpticalFlow::constructor));

	overload->register_type<DualTVL1OpticalFlow>(ctor, "dualtvl1opticalflow", "DualTVL1OpticalFlow");


	overload->addOverloadConstructor("dualtvl1opticalflow", "DualTVL1OpticalFlow", {
		make_param<double>("tau","double",0.25),
		make_param<double>("lambda","double", 0.15),
		make_param<double>("theta","double", 0.3),
		make_param<int>("nscales","int", 5),
		make_param<int>("warps","int", 5),
		make_param<double>("epsilon","double", 0.01),
		make_param<int>("innnerIterations","int", 30),
		make_param<int>("outerIterations","int", 10),
		make_param<double>("scaleStep","double", 0.8),
		make_param<double>("gamma","double", 0.0),
		make_param<int>("medianFiltering","int", 5),
		make_param<bool>("useInitialFlow","bool", false)
	}, New);



	/** @brief "Dual TV L1" Optical Flow Algorithm.

	The class implements the "Dual TV L1" optical flow algorithm described in @cite Zach2007 and
	@cite Javier2012 .
	Here are important members of the class that control the algorithm, which you can set after
	constructing the class instance:

	-   member double tau
		Time step of the numerical scheme.

	-   member double lambda
		Weight parameter for the data term, attachment parameter. This is the most relevant
		parameter, which determines the smoothness of the output. The smaller this parameter is,
		the smoother the solutions we obtain. It depends on the range of motions of the images, so
		its value should be adapted to each image sequence.

	-   member double theta
		Weight parameter for (u - v)\^2, tightness parameter. It serves as a link between the
		attachment and the regularization terms. In theory, it should have a small value in order
		to maintain both parts in correspondence. The method is stable for a large range of values
		of this parameter.

	-   member int nscales
		Number of scales used to create the pyramid of images.

	-   member int warps
		Number of warpings per scale. Represents the number of times that I1(x+u0) and grad(
		I1(x+u0) ) are computed per scale. This is a parameter that assures the stability of the
		method. It also affects the running time, so it is a compromise between speed and
		accuracy.

	-   member double epsilon
		Stopping criterion threshold used in the numerical scheme, which is a trade-off between
		precision and running time. A small value will yield more accurate solutions at the
		expense of a slower convergence.

	-   member int iterations
		Stopping criterion iterations number used in the numerical scheme.

	C. Zach, T. Pock and H. Bischof, "A Duality Based Approach for Realtime TV-L1 Optical Flow".
	Javier Sanchez, Enric Meinhardt-Llopis and Gabriele Facciolo. "TV-L1 Optical Flow Estimation".
	*/
	//	interface DualTVL1OpticalFlow extends DenseOpticalFlow
	//	{
	//	//public:
	//	    //! @brief Time step of the numerical scheme
	//	    /** @see setTau */
	//	    getTau(): _st.double;
	overload->addOverload("kalmanfilter", "KalmanFilter", "getTau", {}, getTau);
	Nan::SetPrototypeMethod(ctor, "getTau", dualtvl1opticalflow_general_callback::callback);
	//	    /** @copybrief getTau @see getTau */
	//	    setTau(val: _st.double): void;
	overload->addOverload("kalmanfilter", "KalmanFilter", "setTau", { make_param<double>("val","double") }, setTau);
	Nan::SetPrototypeMethod(ctor, "setTau", dualtvl1opticalflow_general_callback::callback);
	//	    //! @brief Weight parameter for the data term, attachment parameter
	//	    /** @see setLambda */
	//	    getLambda(): _st.double;
	overload->addOverload("kalmanfilter", "KalmanFilter", "getLambda", {}, getLambda);
	Nan::SetPrototypeMethod(ctor, "getLambda", dualtvl1opticalflow_general_callback::callback);
	//	    /** @copybrief getLambda @see getLambda */
	//	    setLambda(val: _st.double ): void;
	overload->addOverload("kalmanfilter", "KalmanFilter", "setLambda", { make_param<double>("val","double") }, setLambda);
	Nan::SetPrototypeMethod(ctor, "setLambda", dualtvl1opticalflow_general_callback::callback);
	//	    //! @brief Weight parameter for (u - v)^2, tightness parameter
	//	    /** @see setTheta */
	//	    getTheta(): _st.double;
	overload->addOverload("kalmanfilter", "KalmanFilter", "getTheta", {}, getTheta);
	Nan::SetPrototypeMethod(ctor, "getTheta", dualtvl1opticalflow_general_callback::callback);
	//	    /** @copybrief getTheta @see getTheta */
	//	    setTheta(val: _st.double): void;
	overload->addOverload("kalmanfilter", "KalmanFilter", "setTheta", { make_param<double>("val","double") }, setTheta);
	Nan::SetPrototypeMethod(ctor, "setTheta", dualtvl1opticalflow_general_callback::callback);
	//	    //! @brief coefficient for additional illumination variation term
	//	    /** @see setGamma */
	//	    getGamma(): _st.double;
	overload->addOverload("kalmanfilter", "KalmanFilter", "getGamma", {}, getGamma);
	Nan::SetPrototypeMethod(ctor, "getGamma", dualtvl1opticalflow_general_callback::callback);
	//	    /** @copybrief getGamma @see getGamma */
	//	    setGamma(val: _st.double): void;
	overload->addOverload("kalmanfilter", "KalmanFilter", "setGamma", { make_param<double>("val","double") }, setGamma);
	Nan::SetPrototypeMethod(ctor, "setGamma", dualtvl1opticalflow_general_callback::callback);
	//	    //! @brief Number of scales used to create the pyramid of images
	//	    /** @see setScalesNumber */
	//	    getScalesNumber(): _st.int;
	overload->addOverload("kalmanfilter", "KalmanFilter", "getScalesNumber", {}, getScalesNumber);
	Nan::SetPrototypeMethod(ctor, "getScalesNumber", dualtvl1opticalflow_general_callback::callback);
	//	    /** @copybrief getScalesNumber @see getScalesNumber */
	//	    setScalesNumber(val: _st.int): void;
	overload->addOverload("kalmanfilter", "KalmanFilter", "setScalesNumber", { make_param<int>("val","int") }, setScalesNumber);
	Nan::SetPrototypeMethod(ctor, "setScalesNumber", dualtvl1opticalflow_general_callback::callback);
	//	    //! @brief Number of warpings per scale
	//	    /** @see setWarpingsNumber */
	//	    getWarpingsNumber(): _st.int;
	overload->addOverload("kalmanfilter", "KalmanFilter", "getWarpingsNumber", {}, getWarpingsNumber);
	Nan::SetPrototypeMethod(ctor, "getWarpingsNumber", dualtvl1opticalflow_general_callback::callback);
	//	    /** @copybrief getWarpingsNumber @see getWarpingsNumber */
	//	    setWarpingsNumber(val: _st.int): void;
	overload->addOverload("kalmanfilter", "KalmanFilter", "setWarpingsNumber", { make_param<int>("val","int") }, setWarpingsNumber);
	Nan::SetPrototypeMethod(ctor, "setWarpingsNumber", dualtvl1opticalflow_general_callback::callback);
	//	    //! @brief Stopping criterion threshold used in the numerical scheme, which is a trade-off between precision and running time
	//	    /** @see setEpsilon */
	//	    getEpsilon(): _st.double;
	overload->addOverload("kalmanfilter", "KalmanFilter", "getEpsilon", {}, getEpsilon);
	Nan::SetPrototypeMethod(ctor, "getEpsilon", dualtvl1opticalflow_general_callback::callback);
	//	    /** @copybrief getEpsilon @see getEpsilon */
	//	    setEpsilon(val: _st.double): void;
	overload->addOverload("kalmanfilter", "KalmanFilter", "setEpsilon", { make_param<double>("val","double") }, setEpsilon);
	Nan::SetPrototypeMethod(ctor, "setEpsilon", dualtvl1opticalflow_general_callback::callback);
	//	    //! @brief Inner iterations (between outlier filtering) used in the numerical scheme
	//	    /** @see setInnerIterations */
	//	    getInnerIterations(): _st.int;
	overload->addOverload("kalmanfilter", "KalmanFilter", "getInnerIterations", {}, getInnerIterations);
	Nan::SetPrototypeMethod(ctor, "getInnerIterations", dualtvl1opticalflow_general_callback::callback);
	//	    /** @copybrief getInnerIterations @see getInnerIterations */
	//	    setInnerIterations(val: _st.int): void;
	overload->addOverload("kalmanfilter", "KalmanFilter", "setInnerIterations", { make_param<int>("val","int") }, setInnerIterations);
	Nan::SetPrototypeMethod(ctor, "setInnerIterations", dualtvl1opticalflow_general_callback::callback);
	//	    //! @brief Outer iterations (number of inner loops) used in the numerical scheme
	//	    /** @see setOuterIterations */
	//	    getOuterIterations(): _st.int;
	overload->addOverload("kalmanfilter", "KalmanFilter", "getOuterIterations", {}, getOuterIterations);
	Nan::SetPrototypeMethod(ctor, "getOuterIterations", dualtvl1opticalflow_general_callback::callback);
	//	    /** @copybrief getOuterIterations @see getOuterIterations */
	//	    setOuterIterations(val: _st.int): void;
	overload->addOverload("kalmanfilter", "KalmanFilter", "setOuterIterations", { make_param<int>("val","int") }, setOuterIterations);
	Nan::SetPrototypeMethod(ctor, "setOuterIterations", dualtvl1opticalflow_general_callback::callback);
	//	    //! @brief Use initial flow
	//	    /** @see setUseInitialFlow */
	//	    getUseInitialFlow(): boolean;
	overload->addOverload("kalmanfilter", "KalmanFilter", "getUseInitialFlow", {}, getUseInitialFlow);
	Nan::SetPrototypeMethod(ctor, "getUseInitialFlow", dualtvl1opticalflow_general_callback::callback);
	//	    /** @copybrief getUseInitialFlow @see getUseInitialFlow */
	//	    setUseInitialFlow( val : boolean): void;
	overload->addOverload("kalmanfilter", "KalmanFilter", "setUseInitialFlow", { make_param<bool>("val","bool") }, setUseInitialFlow);
	Nan::SetPrototypeMethod(ctor, "setUseInitialFlow", dualtvl1opticalflow_general_callback::callback);
	//	    //! @brief Step between scales (<1)
	//	    /** @see setScaleStep */
	//	    getScaleStep(): _st.double;
	overload->addOverload("kalmanfilter", "KalmanFilter", "getScaleStep", {}, getScaleStep);
	Nan::SetPrototypeMethod(ctor, "getScaleStep", dualtvl1opticalflow_general_callback::callback);
	//	    /** @copybrief getScaleStep @see getScaleStep */
	//	    setScaleStep(val: _st.double): void;
	overload->addOverload("kalmanfilter", "KalmanFilter", "setScaleStep", { make_param<double>("val","double") }, setScaleStep);
	Nan::SetPrototypeMethod(ctor, "setScaleStep", dualtvl1opticalflow_general_callback::callback);
	//	    //! @brief Median filter kernel size (1 = no filter) (3 or 5)
	//	    /** @see setMedianFiltering */
	//	    getMedianFiltering(): _st.int;
	overload->addOverload("kalmanfilter", "KalmanFilter", "getMedianFiltering", {}, getMedianFiltering);
	Nan::SetPrototypeMethod(ctor, "getMedianFiltering", dualtvl1opticalflow_general_callback::callback);
	//	    /** @copybrief getMedianFiltering @see getMedianFiltering */
	//	    setMedianFiltering( val : _st.int): void;
	overload->addOverload("kalmanfilter", "KalmanFilter", "setMedianFiltering", { make_param<int>("val","int") }, setMedianFiltering);
	Nan::SetPrototypeMethod(ctor, "setMedianFiltering", dualtvl1opticalflow_general_callback::callback);
	//	};

	/** @brief Creates instance of cv::DenseOpticalFlow
	*/

	//interface IcreateOptFlow_DualTVL1 {
	//    ():DualTVL1OpticalFlow;
	//}
	//
	//export var createOptFlow_DualTVL1: IcreateOptFlow_DualTVL1 = alvision_module.createOptFlow_DualTVL1;
	overload->addOverload("kalmanfilter", "KalmanFilter", "createOptFlow_DualTVL1", {
		make_param<double>("tau","double",0.25),
		make_param<double>("lambda","double", 0.15),
		make_param<double>("theta","double", 0.3),
		make_param<int>("nscales","int", 5),
		make_param<int>("warps","int", 5),
		make_param<double>("epsilon","double", 0.01),
		make_param<int>("innnerIterations","int", 30),
		make_param<int>("outerIterations","int", 10),
		make_param<double>("scaleStep","double", 0.8),
		make_param<double>("gamma","double", 0.0),
		make_param<int>("medianFiltering","int", 5),
		make_param<bool>("useInitialFlow","bool", false)
	}, createOptFlow_DualTVL1);
	Nan::SetMethod(target, "createOptFlow_DualTVL1", dualtvl1opticalflow_general_callback::callback);

	//CV_EXPORTS_W Ptr<DualTVL1OpticalFlow> createOptFlow_DualTVL1();



	target->Set(Nan::New("DualTVL1OpticalFlow").ToLocalChecked(), ctor->GetFunction());


};

v8::Local<v8::Function> DualTVL1OpticalFlow::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(DualTVL1OpticalFlow::New) {
	auto ret = new DualTVL1OpticalFlow();

	auto tau				= info.at<double>(0);
	auto lambda				= info.at<double>(1);
	auto theta				= info.at<double>(2);
	auto nscales			= info.at<int>(3);
	auto warps				= info.at<int>(4);
	auto epsilon			= info.at<double>(5);
	auto innnerIterations	= info.at<int>(6);
	auto outerIterations	= info.at<int>(7);
	auto scaleStep			= info.at<double>(8);
	auto gamma				= info.at<double>(9);
	auto medianFiltering	= info.at<int>(10);
	auto useInitialFlow		= info.at<bool>(11);


	ret->_algorithm = cv::DualTVL1OpticalFlow::create(
		tau					,
		lambda				,
		theta				,
		nscales				,
		warps				,
		epsilon				,
		innnerIterations	,
		outerIterations		,
		scaleStep			,
		gamma				,
		medianFiltering		,
		useInitialFlow
	
	);

	ret->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}


POLY_METHOD(DualTVL1OpticalFlow::getTau){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::setTau){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::getLambda){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::setLambda){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::getTheta){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::setTheta){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::getGamma){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::setGamma){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::getScalesNumber){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::setScalesNumber){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::getWarpingsNumber){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::setWarpingsNumber){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::getEpsilon){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::setEpsilon){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::getInnerIterations){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::setInnerIterations){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::getOuterIterations){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::setOuterIterations){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::getUseInitialFlow){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::setUseInitialFlow){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::getScaleStep){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::setScaleStep){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::getMedianFiltering){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::setMedianFiltering){throw std::runtime_error("not implemented");}
POLY_METHOD(DualTVL1OpticalFlow::createOptFlow_DualTVL1){
	auto ret = new DualTVL1OpticalFlow();

	auto tau = info.at<double>(0);
	auto lambda = info.at<double>(1);
	auto theta = info.at<double>(2);
	auto nscales = info.at<int>(3);
	auto warps = info.at<int>(4);
	auto epsilon = info.at<double>(5);
	auto innnerIterations = info.at<int>(6);
	auto outerIterations = info.at<int>(7);
	auto scaleStep = info.at<double>(8);
	auto gamma = info.at<double>(9);
	auto medianFiltering = info.at<int>(10);
	auto useInitialFlow = info.at< boolean>(11);


	ret->_algorithm = cv::DualTVL1OpticalFlow::create(
		tau,
		lambda,
		theta,
		nscales,
		warps,
		epsilon,
		innnerIterations,
		outerIterations,
		scaleStep,
		gamma,
		medianFiltering,
		useInitialFlow

	);

	info.SetReturnValue(ret);
}


