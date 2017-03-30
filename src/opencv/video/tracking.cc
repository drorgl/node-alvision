#include "tracking.h"
#include "../IOArray.h"
#include "../types/Rect.h"
#include "../types/Size.h"
#include "../types/TermCriteria.h"

#include "tracking/KalmanFilter.h"
#include "tracking/DenseOpticalFlow.h"
#include "tracking/DualTVL1OpticalFlow.h"


namespace tracking_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("tracking_general_callback is empty");
		}
		return overload->execute("tracking", info);
	}
}

void
tracking::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	tracking_general_callback::overload = overload;

	auto OPTFLOW = CreateNamedObject(target, "OPTFLOW");
	SetObjectProperty(OPTFLOW, "OPTFLOW_USE_INITIAL_FLOW", cv::OPTFLOW_USE_INITIAL_FLOW);
	SetObjectProperty(OPTFLOW, "OPTFLOW_LK_GET_MIN_EIGENVALS", cv::OPTFLOW_LK_GET_MIN_EIGENVALS);
	SetObjectProperty(OPTFLOW, "OPTFLOW_FARNEBACK_GAUSSIAN", cv::OPTFLOW_FARNEBACK_GAUSSIAN);
	overload->add_type_alias("OPTFLOW", "int");


	overload->addOverload("tracking", "", "CamShift", {
		make_param<IOArray*>("probImage","InputArray"),
		make_param<Rect*>("window",Rect::name),
		make_param<TermCriteria*>("criteria",TermCriteria::name)
	}, CamShift);
	Nan::SetMethod(target, "CamShift", tracking_general_callback::callback);

	//     interface ICamShift {
	//         (probImage: _st.InputArray , 
	//			 window : _types.Rect, 
	//             criteria: _types.TermCriteria
	//     }
	//
	//export var CamShift: ICamShift = alvision_module.CamShift;

	//CV_EXPORTS_W RotatedRect CamShift( InputArray probImage, CV_IN_OUT Rect& window,
	//                                   TermCriteria criteria );

	/** @brief Finds an object on a back projection image.

	@param probImage Back projection of the object histogram. See calcBackProject for details.
	@param window Initial search window.
	@param criteria Stop criteria for the iterative search algorithm.
	returns
	:   Number of iterations CAMSHIFT took to converge.
	The function implements the iterative object search algorithm. It takes the input back projection of
	an object and the initial position. The mass center in window of the back projection image is
	computed and the search window center shifts to the mass center. The procedure is repeated until the
	specified number of iterations criteria.maxCount is done or until the window center shifts by less
	than criteria.epsilon. The algorithm is used inside CamShift and, unlike CamShift , the search
	window size or orientation do not change during the search. You can simply pass the output of
	calcBackProject to this function. But better results can be obtained if you pre-filter the back
	projection and remove the noise. For example, you can do this by retrieving connected components
	with findContours , throwing away contours with small area ( contourArea ), and rendering the
	remaining contours with drawContours.

	@note
	-   A mean-shift tracking sample can be found at opencv_source_code/samples/cpp/camshiftdemo.cpp
	 */
	overload->addOverload("tracking", "", "meanShift", {
		make_param<IOArray*>("probImage","InputArray"),
		make_param<Rect*>("window",Rect::name),
		make_param<TermCriteria*>("criteria",TermCriteria::name)
	}, meanShift);
	Nan::SetMethod(target, "meanShift", tracking_general_callback::callback);

	//interface ImeanShift {
	//    (probImage: _st.InputArray, window: _types.Rect, criteria: _types.TermCriteria ): _st.int;
	//}
	//
	//export var meanShift: ImeanShift = alvision_module.meanShift;

	//CV_EXPORTS_W int meanShift( InputArray probImage, CV_IN_OUT Rect& window, TermCriteria criteria );

	/** @brief Constructs the image pyramid which can be passed to calcOpticalFlowPyrLK.

	@param img 8-bit input image.
	@param pyramid output pyramid.
	@param winSize window size of optical flow algorithm. Must be not less than winSize argument of
	calcOpticalFlowPyrLK. It is needed to calculate required padding for pyramid levels.
	@param maxLevel 0-based maximal pyramid level number.
	@param withDerivatives set to precompute gradients for the every pyramid level. If pyramid is
	constructed without the gradients then calcOpticalFlowPyrLK will calculate them internally.
	@param pyrBorder the border mode for pyramid layers.
	@param derivBorder the border mode for gradients.
	@param tryReuseInputImage put ROI of input image into the pyramid if possible. You can pass false
	to force data copying.
	@return number of levels in constructed pyramid. Can be less than maxLevel.
	 */
	overload->addOverload("tracking", "", "buildOpticalFlowPyramid", {
		make_param<IOArray*>("img","InputArray"),
		make_param<IOArray*>("pyramid","OutputArrayOfArrays"),
		make_param<Size*>("winSize",Size::name),
		make_param<int>("maxLevel","int"),
		make_param<bool>("withDerivatives","bool", true),
		make_param<int>("pyrBorder","BorderTypes",cv::BORDER_REFLECT_101),
		make_param<int>("derivBorder","BorderTypes",cv::BORDER_CONSTANT),
		make_param<bool>("tryReuseInputImage","bool", true)
	}, buildOpticalFlowPyramid);
	Nan::SetMethod(target, "buildOpticalFlowPyramid", tracking_general_callback::callback);

	//interface IbuildOpticalFlowPyramid {
	//    (img: _st.InputArray, pyramid: _st.OutputArrayOfArrays ,
	//        winSize: _types.Size, maxLevel: _st.int , withDerivatives?  : boolean /*= true*/,
	//        pyrBorder?: _base.BorderTypes |  _st.int /*= BORDER_REFLECT_101*/,
	//        derivBorder?: _base.BorderTypes |_st.int /*= BORDER_CONSTANT*/,
	//        tryReuseInputImage?  : boolean /*= true*/): _st.int;
	//}
	//
	//export var buildOpticalFlowPyramid: IbuildOpticalFlowPyramid = alvision_module.buildOpticalFlowPyramid;

	//CV_EXPORTS_W int buildOpticalFlowPyramid( InputArray img, OutputArrayOfArrays pyramid,
	//                                          Size winSize, int maxLevel, bool withDerivatives = true,
	//                                          int pyrBorder = BORDER_REFLECT_101,
	//                                          int derivBorder = BORDER_CONSTANT,
	//                                          bool tryReuseInputImage = true );

	/** @brief Calculates an optical flow for a sparse feature set using the iterative Lucas-Kanade method with
	pyramids.

	@param prevImg first 8-bit input image or pyramid constructed by buildOpticalFlowPyramid.
	@param nextImg second input image or pyramid of the same size and the same type as prevImg.
	@param prevPts vector of 2D points for which the flow needs to be found; point coordinates must be
	single-precision floating-point numbers.
	@param nextPts output vector of 2D points (with single-precision floating-point coordinates)
	containing the calculated new positions of input features in the second image; when
	OPTFLOW_USE_INITIAL_FLOW flag is passed, the vector must have the same size as in the input.
	@param status output status vector (of unsigned chars); each element of the vector is set to 1 if
	the flow for the corresponding features has been found, otherwise, it is set to 0.
	@param err output vector of errors; each element of the vector is set to an error for the
	corresponding feature, type of the error measure can be set in flags parameter; if the flow wasn't
	found then the error is not defined (use the status parameter to find such cases).
	@param winSize size of the search window at each pyramid level.
	@param maxLevel 0-based maximal pyramid level number; if set to 0, pyramids are not used (single
	level), if set to 1, two levels are used, and so on; if pyramids are passed to input then
	algorithm will use as many levels as pyramids have but no more than maxLevel.
	@param criteria parameter, specifying the termination criteria of the iterative search algorithm
	(after the specified maximum number of iterations criteria.maxCount or when the search window
	moves by less than criteria.epsilon.
	@param flags operation flags:
	 -   **OPTFLOW_USE_INITIAL_FLOW** uses initial estimations, stored in nextPts; if the flag is
		 not set, then prevPts is copied to nextPts and is considered the initial estimate.
	 -   **OPTFLOW_LK_GET_MIN_EIGENVALS** use minimum eigen values as an error measure (see
		 minEigThreshold description); if the flag is not set, then L1 distance between patches
		 around the original and a moved point, divided by number of pixels in a window, is used as a
		 error measure.
	@param minEigThreshold the algorithm calculates the minimum eigen value of a 2x2 normal matrix of
	optical flow equations (this matrix is called a spatial gradient matrix in @cite Bouguet00), divided
	by number of pixels in a window; if this value is less than minEigThreshold, then a corresponding
	feature is filtered out and its flow is not processed, so it allows to remove bad points and get a
	performance boost.

	The function implements a sparse iterative version of the Lucas-Kanade optical flow in pyramids. See
	@cite Bouguet00 . The function is parallelized with the TBB library.

	@note

	-   An example using the Lucas-Kanade optical flow algorithm can be found at
		opencv_source_code/samples/cpp/lkdemo.cpp
	-   (Python) An example using the Lucas-Kanade optical flow algorithm can be found at
		opencv_source_code/samples/python/lk_track.py
	-   (Python) An example using the Lucas-Kanade tracker for homography matching can be found at
		opencv_source_code/samples/python/lk_homography.py
	 */

	overload->addOverload("tracking", "", "calcOpticalFlowPyrLK", {
		make_param<IOArray*>("prevImg","InputArray"),
		make_param<IOArray*>("nextImg","InputArray"),
		make_param<IOArray*>("prevPts","InputArray"),
		make_param<IOArray*>("nextPts","InputOutputArray"),
		make_param<IOArray*>("status","OutputArray"),
		make_param<IOArray*>("err","OutputArray"),
		make_param<Size*>("winSize",Size::name, Size::create(21, 21)),
		make_param<int>("maxLevel","int", 3),
		make_param<TermCriteria*>("criteria",TermCriteria::name, TermCriteria::create(cv::TermCriteria::COUNT + cv::TermCriteria::EPS, 30, 0.01)),
		make_param<int>("flags","int", 0),
		make_param<double>("minEigThreshold","double", 1e-4)
	}, calcOpticalFlowPyrLK);
	Nan::SetMethod(target, "calcOpticalFlowPyrLK", tracking_general_callback::callback);

	//interface IcalcOpticalFlowPyrLK {
	//    (prevImg: _st.InputArray, nextImg: _st.InputArray ,
	//        prevPts: _st.InputArray, nextPts: _st.InputOutputArray ,
	//        status: _st.OutputArray, err: _st.OutputArray ,
	//        winSize?: _types.Size /*= Size(21, 21)*/, maxLevel?: _st.int /*= 3*/,
	//        criteria?: _types.TermCriteria /*= TermCriteria(TermCriteria::COUNT + TermCriteria::EPS, 30, 0.01)*/,
	//        flags?: _st.int  /*= 0*/, minEigThreshold?: _st.double  /*= 1e-4*/): void;
	//}
	//
	//export var calcOpticalFlowPyrLK: IcalcOpticalFlowPyrLK = alvision_module.calcOpticalFlowPyrLK;

	//CV_EXPORTS_W void calcOpticalFlowPyrLK( InputArray prevImg, InputArray nextImg,
	//                                        InputArray prevPts, InputOutputArray nextPts,
	//                                        OutputArray status, OutputArray err,
	//                                        Size winSize = Size(21,21), int maxLevel = 3,
	//                                        TermCriteria criteria = TermCriteria(TermCriteria::COUNT+TermCriteria::EPS, 30, 0.01),
	//                                        int flags = 0, double minEigThreshold = 1e-4 );

	/** @brief Computes a dense optical flow using the Gunnar Farneback's algorithm.

	@param prev first 8-bit single-channel input image.
	@param next second input image of the same size and the same type as prev.
	@param flow computed flow image that has the same size as prev and type CV_32FC2.
	@param pyr_scale parameter, specifying the image scale (\<1) to build pyramids for each image;
	pyr_scale=0.5 means a classical pyramid, where each next layer is twice smaller than the previous
	one.
	@param levels number of pyramid layers including the initial image; levels=1 means that no extra
	layers are created and only the original images are used.
	@param winsize averaging window size; larger values increase the algorithm robustness to image
	noise and give more chances for fast motion detection, but yield more blurred motion field.
	@param iterations number of iterations the algorithm does at each pyramid level.
	@param poly_n size of the pixel neighborhood used to find polynomial expansion in each pixel;
	larger values mean that the image will be approximated with smoother surfaces, yielding more
	robust algorithm and more blurred motion field, typically poly_n =5 or 7.
	@param poly_sigma standard deviation of the Gaussian that is used to smooth derivatives used as a
	basis for the polynomial expansion; for poly_n=5, you can set poly_sigma=1.1, for poly_n=7, a
	good value would be poly_sigma=1.5.
	@param flags operation flags that can be a combination of the following:
	 -   **OPTFLOW_USE_INITIAL_FLOW** uses the input flow as an initial flow approximation.
	 -   **OPTFLOW_FARNEBACK_GAUSSIAN** uses the Gaussian \f$\texttt{winsize}\times\texttt{winsize}\f$
		 filter instead of a box filter of the same size for optical flow estimation; usually, this
		 option gives z more accurate flow than with a box filter, at the cost of lower speed;
		 normally, winsize for a Gaussian window should be set to a larger value to achieve the same
		 level of robustness.

	The function finds an optical flow for each prev pixel using the @cite Farneback2003 algorithm so that

	\f[\texttt{prev} (y,x)  \sim \texttt{next} ( y + \texttt{flow} (y,x)[1],  x + \texttt{flow} (y,x)[0])\f]

	@note

	-   An example using the optical flow algorithm described by Gunnar Farneback can be found at
		opencv_source_code/samples/cpp/fback.cpp
	-   (Python) An example using the optical flow algorithm described by Gunnar Farneback can be
		found at opencv_source_code/samples/python/opt_flow.py
	 */
	overload->addOverload("tracking", "", "calcOpticalFlowFarneback", {
		make_param<IOArray*>("prev","InputArray"),
		make_param<IOArray*>("next","InputArray"),
		make_param<IOArray*>("flow","InputOutputArray"),
		make_param<double>("pyr_scale","double"),
		make_param<int>("levels","int"),
		make_param<int>("winsize","int") ,
		make_param<int>("iterations","int"),
		make_param<int>("poly_n","int"),
		make_param<double>("poly_sigma","double") ,
		make_param<int>("flags","int")
	}, calcOpticalFlowFarneback);
	Nan::SetMethod(target, "calcOpticalFlowFarneback", tracking_general_callback::callback);


	//interface IcalcOpticalFlowFarneback {
	//    (prev: _st.InputArray, next: _st.InputArray, flow: _st.InputOutputArray ,
	//        pyr_scale: _st.double, levels: _st.int, winsize: _st.int ,
	//        iterations: _st.int, poly_n: _st.int, poly_sigma: _st.double ,
	//        flags: _st.int ) : void
	//}
	//
	//export var calcOpticalFlowFarneback: IcalcOpticalFlowFarneback = alvision_module.calcOpticalFlowFarneback;
	//CV_EXPORTS_W void calcOpticalFlowFarneback( InputArray prev, InputArray next, InputOutputArray flow,
	//                                            double pyr_scale, int levels, int winsize,
	//                                            int iterations, int poly_n, double poly_sigma,
	//                                            int flags );

	/** @brief Computes an optimal affine transformation between two 2D point sets.

	@param src First input 2D point set stored in std::vector or Mat, or an image stored in Mat.
	@param dst Second input 2D point set of the same size and the same type as A, or another image.
	@param fullAffine If true, the function finds an optimal affine transformation with no additional
	restrictions (6 degrees of freedom). Otherwise, the class of transformations to choose from is
	limited to combinations of translation, rotation, and uniform scaling (5 degrees of freedom).

	The function finds an optimal affine transform *[A|b]* (a 2 x 3 floating-point matrix) that
	approximates best the affine transformation between:

	*   Two point sets
	*   Two raster images. In this case, the function first finds some features in the src image and
		finds the corresponding features in dst image. After that, the problem is reduced to the first
		case.
	In case of point sets, the problem is formulated as follows: you need to find a 2x2 matrix *A* and
	2x1 vector *b* so that:

	\f[[A^*|b^*] = arg  \min _{[A|b]}  \sum _i  \| \texttt{dst}[i] - A { \texttt{src}[i]}^T - b  \| ^2\f]
	where src[i] and dst[i] are the i-th points in src and dst, respectively
	\f$[A|b]\f$ can be either arbitrary (when fullAffine=true ) or have a form of
	\f[\begin{bmatrix} a_{11} & a_{12} & b_1  \\ -a_{12} & a_{11} & b_2  \end{bmatrix}\f]
	when fullAffine=false.

	@sa
	getAffineTransform, getPerspectiveTransform, findHomography
	 */
	overload->addOverload("tracking", "", "estimateRigidTransform", {
		make_param<IOArray*>("src","InputArray"),
		make_param<IOArray*>("dst","InputArray"),
		make_param<bool>("fullAffine","bool")
	}, estimateRigidTransform);
	Nan::SetMethod(target, "estimateRigidTransform", tracking_general_callback::callback);


	//interface IestimateRigidTransform {
	//    (src: _st.InputArray, dst: _st.InputArray, fullAffine: boolean): _mat.Mat;
	//}
	//
	//export var estimateRigidTransform: IestimateRigidTransform = alvision_module.estimateRigidTransform;

	//CV_EXPORTS_W Mat estimateRigidTransform( InputArray src, InputArray dst, bool fullAffine );
	auto MOTION = CreateNamedObject(target, "MOTION");
	SetObjectProperty(MOTION, "MOTION_TRANSLATION", cv::MOTION_TRANSLATION);
	SetObjectProperty(MOTION, "MOTION_EUCLIDEAN", cv::MOTION_EUCLIDEAN);
	SetObjectProperty(MOTION, "MOTION_AFFINE", cv::MOTION_AFFINE);
	SetObjectProperty(MOTION, "MOTION_HOMOGRAPHY", cv::MOTION_HOMOGRAPHY);
	overload->add_type_alias("MOTION", "int");

	/** @brief Finds the geometric transform (warp) between two images in terms of the ECC criterion @cite EP08 .

	@param templateImage single-channel template image; CV_8U or CV_32F array.
	@param inputImage single-channel input image which should be warped with the final warpMatrix in
	order to provide an image similar to templateImage, same type as temlateImage.
	@param warpMatrix floating-point \f$2\times 3\f$ or \f$3\times 3\f$ mapping matrix (warp).
	@param motionType parameter, specifying the type of motion:
	 -   **MOTION_TRANSLATION** sets a translational motion model; warpMatrix is \f$2\times 3\f$ with
		 the first \f$2\times 2\f$ part being the unity matrix and the rest two parameters being
		 estimated.
	 -   **MOTION_EUCLIDEAN** sets a Euclidean (rigid) transformation as motion model; three
		 parameters are estimated; warpMatrix is \f$2\times 3\f$.
	 -   **MOTION_AFFINE** sets an affine motion model (DEFAULT); six parameters are estimated;
		 warpMatrix is \f$2\times 3\f$.
	 -   **MOTION_HOMOGRAPHY** sets a homography as a motion model; eight parameters are
		 estimated;\`warpMatrix\` is \f$3\times 3\f$.
	@param criteria parameter, specifying the termination criteria of the ECC algorithm;
	criteria.epsilon defines the threshold of the increment in the correlation coefficient between two
	iterations (a negative criteria.epsilon makes criteria.maxcount the only termination criterion).
	Default values are shown in the declaration above.
	@param inputMask An optional mask to indicate valid values of inputImage.

	The function estimates the optimum transformation (warpMatrix) with respect to ECC criterion
	(@cite EP08), that is

	\f[\texttt{warpMatrix} = \texttt{warpMatrix} = \arg\max_{W} \texttt{ECC}(\texttt{templateImage}(x,y),\texttt{inputImage}(x',y'))\f]

	where

	\f[\begin{bmatrix} x' \\ y' \end{bmatrix} = W \cdot \begin{bmatrix} x \\ y \\ 1 \end{bmatrix}\f]

	(the equation holds with homogeneous coordinates for homography). It returns the final enhanced
	correlation coefficient, that is the correlation coefficient between the template image and the
	final warped input image. When a \f$3\times 3\f$ matrix is given with motionType =0, 1 or 2, the third
	row is ignored.

	Unlike findHomography and estimateRigidTransform, the function findTransformECC implements an
	area-based alignment that builds on intensity similarities. In essence, the function updates the
	initial transformation that roughly aligns the images. If this information is missing, the identity
	warp (unity matrix) should be given as input. Note that if images undergo strong
	displacements/rotations, an initial transformation that roughly aligns the images is necessary
	(e.g., a simple euclidean/similarity transform that allows for the images showing the same image
	content approximately). Use inverse warping in the second image to take an image close to the first
	one, i.e. use the flag WARP_INVERSE_MAP with warpAffine or warpPerspective. See also the OpenCV
	sample image_alignment.cpp that demonstrates the use of the function. Note that the function throws
	an exception if algorithm does not converges.

	@sa
	estimateRigidTransform, findHomography
	 */

	overload->addOverload("tracking", "", "findTransformECC", {
		make_param<IOArray*>("templateImage","InputArray"),
		make_param<IOArray*>("inputImage","InputArray"),
		make_param<IOArray*>("warpMatrix","InputOutputArray"),
		make_param<int>("motionType","MOTION",cv::MOTION_AFFINE),
		make_param<TermCriteria*>("criteria",TermCriteria::name, TermCriteria::create(cv::TermCriteria::COUNT + cv::TermCriteria::EPS, 50, 0.001)),
		make_param<IOArray*>("inputMask","InputArray",IOArray::noArray())
	}, findTransformECC);
	Nan::SetMethod(target, "findTransformECC", tracking_general_callback::callback);

	//interface IfindTransformECC {
	//    (templateImage: _st.InputArray, inputImage: _st.InputArray ,
	//        warpMatrix: _st.InputOutputArray, motionType?: MOTION | _st.int /*= MOTION_AFFINE*/,
	//        criteria?: _types.TermCriteria /*= TermCriteria(TermCriteria::COUNT + TermCriteria::EPS, 50, 0.001)*/,
	//        inputMask?: _st.InputArray /*= noArray()*/): _st.double;
	//}
	//
	//export var findTransformECC: IfindTransformECC = alvision_module.findTransformECC;

	//CV_EXPORTS_W double findTransformECC( InputArray templateImage, InputArray inputImage,
	//                                      InputOutputArray warpMatrix, int motionType = MOTION_AFFINE,
	//                                      TermCriteria criteria = TermCriteria(TermCriteria::COUNT+TermCriteria::EPS, 50, 0.001),
	//                                      InputArray inputMask = noArray());

	KalmanFilter::Init(target, overload);

	DenseOpticalFlow::Init(target, overload);

	DualTVL1OpticalFlow::Init(target, overload);

	//! @} video_track

	//} // cv
	//
	//#endif
}


POLY_METHOD(tracking::CamShift){throw std::runtime_error("not implemented");}
POLY_METHOD(tracking::meanShift){throw std::runtime_error("not implemented");}
POLY_METHOD(tracking::buildOpticalFlowPyramid){throw std::runtime_error("not implemented");}
POLY_METHOD(tracking::calcOpticalFlowPyrLK){
	auto prevImg		 = info.at<IOArray*>(0)->GetInputArray();
	auto nextImg		 = info.at<IOArray*>(1)->GetInputArray();
	auto prevPts		 = info.at<IOArray*>(2)->GetInputArray();
	auto nextPts		 = info.at<IOArray*>(3)->GetInputOutputArray();
	auto status			 = info.at<IOArray*>(4)->GetOutputArray();
	auto err			 = info.at<IOArray*>(5)->GetOutputArray();
	auto winSize		 = *info.at<Size*>(6)->_size;
	auto maxLevel		 = info.at<int>(7);
	auto criteria		 = *info.at<TermCriteria*>(8)->_termCriteria;
	auto flags			 = info.at<int>(9);
	auto minEigThreshold = info.at<double>(10);

	cv::calcOpticalFlowPyrLK(
		prevImg,
		nextImg,
		prevPts,
		nextPts,
		status,
		err,
		winSize,
		maxLevel,
		criteria,
		flags,
		minEigThreshold
	);
}
POLY_METHOD(tracking::calcOpticalFlowFarneback){
		auto prev =			info.at<IOArray*>(0)->GetInputArray();
		auto next =			info.at<IOArray*>(1)->GetInputArray();
		auto flow =			info.at<IOArray*>(2)->GetInputOutputArray();
		auto pyr_scale =	info.at<double>(3);
		auto levels =		info.at<int>(4);
		auto winsize =		info.at<int>(5);
		auto iterations =	info.at<int>(6);
		auto poly_n =		info.at<int>(7);
		auto poly_sigma =	info.at<double>(8);
		auto flags =		info.at<int>(9);

		cv::calcOpticalFlowFarneback(
			prev,
			next,
			flow,
			pyr_scale,
			levels,
			winsize,
			iterations,
			poly_n,
			poly_sigma,
			flags
		);

}
POLY_METHOD(tracking::estimateRigidTransform){throw std::runtime_error("not implemented");}
POLY_METHOD(tracking::findTransformECC){throw std::runtime_error("not implemented");}

