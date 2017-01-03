#include "fisheye.h"
#include "../IOArray.h"
#include "../Affine3.h"

void
fisheye::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	auto FISHEYE_CALIB = CreateNamedObject(target, "FISHEYE_CALIB");
	SetObjectProperty(FISHEYE_CALIB, "CALIB_USE_INTRINSIC_GUESS", 1);
	SetObjectProperty(FISHEYE_CALIB, "CALIB_RECOMPUTE_EXTRINSIC",2 );
	SetObjectProperty(FISHEYE_CALIB, "CALIB_CHECK_COND",4		   );
	SetObjectProperty(FISHEYE_CALIB, "CALIB_FIX_SKEW", 8		   );
	SetObjectProperty(FISHEYE_CALIB, "CALIB_FIX_K1", 16		   );
	SetObjectProperty(FISHEYE_CALIB, "CALIB_FIX_K2", 32		   );
	SetObjectProperty(FISHEYE_CALIB, "CALIB_FIX_K3", 64		   );
	SetObjectProperty(FISHEYE_CALIB, "CALIB_FIX_K4", 128		   );
	SetObjectProperty(FISHEYE_CALIB, "CALIB_FIX_INTRINSIC", 256	   );


		overload->addStaticOverload("calib3d", "", "projectPoints", {
				make_param<IOArray*>("objectPoints","IOArray"),
				make_param<IOArray*>("imagePoints","IOArray"),
				make_param<Affine3<cv::Affine3d>*>("affine",Affine3<cv::Affine3d>::name),
				make_param<IOArray*>("K","IOArray"),
				make_param<IOArray*>("D","IOArray"),
				make_param<double>("alpha","double", 0),
				make_param<IOArray*>("jacobian","IOArray",IOArray::noArray())
		}, projectPoints_a);


		overload->addStaticOverload("calib3d", "", "projectPoints", {
			make_param<IOArray*>("objectPoints","IOArray"),
			make_param<IOArray*>("imagePoints","IOArray"),
			make_param<IOArray*>("rvec","IOArray"), 
			make_param<IOArray*>("tvec","IOArray"),
			make_param<IOArray*>("K","IOArray"), 
			make_param<IOArray*>("D","IOArray"),
			make_param<double>("alpha","double", 0),
			make_param<IOArray*>("jacobian","IOArray",IOArray::noArray())
		}, projectPoints_b);



		overload->addStaticOverload("calib3d", "", "distortPoints", {
			make_param<IOArray*>("undistorted","IOArray"),
			make_param<IOArray*>("distorted","IOArray"),
			make_param<IOArray*>("K","IOArray"),
			make_param<IOArray*>("D","IOArray"),
			make_param<double>("alpha","double", 0)
		}, distortPoints);



		overload->addStaticOverload("calib3d", "", "", {}, );

		interface IundistortPoints {
			(distorted : _st.InputArray, undistorted : _st.OutputArray,
				K : _st.InputArray, D : _st.InputArray, R ? : _st.InputArray  /*= noArray()*/, P ? : _st.InputArray /*  = noArray()*/) : void;
		}
		export var undistortPoints : IundistortPoints = alvision_module.undistortPoints;

		//CV_EXPORTS_W void undistortPoints(InputArray distorted, OutputArray undistorted,
		//    InputArray K, InputArray D, InputArray R = noArray(), InputArray P  = noArray());

		/** @brief Computes undistortion and rectification maps for image transform by cv::remap(). If D is empty zero
		distortion is used, if R or P is empty identity matrixes are used.

		@param K Camera matrix \f$K = \vecthreethree{f_x}{0}{c_x}{0}{f_y}{c_y}{0}{0}{_1}\f$.
		@param D Input vector of distortion coefficients \f$(k_1, k_2, k_3, k_4)\f$.
		@param R Rectification transformation in the object space: 3x3 1-channel, or vector: 3x1/1x3
		1-channel or 1x1 3-channel
		@param P New camera matrix (3x3) or new projection matrix (3x4)
		@param size Undistorted image size.
		@param m1type Type of the first output map that can be CV_32FC1 or CV_16SC2 . See convertMaps()
		for details.
		@param map1 The first output map.
		@param map2 The second output map.
		*/

		overload->addStaticOverload("calib3d", "", "", {}, );

		interface IinitUndistortRectifyMap {
			(K : _st.InputArray, D : _st.InputArray, R : _st.InputArray, P : _st.InputArray,
				size : _types.Size, m1type : _st.int, map1 : _st.OutputArray, map2 : _st.OutputArray) : void;
		}
		export var initUndistortRectifyMap : IinitUndistortRectifyMap = alvision_module.initUndistortRectifyMap;

		//CV_EXPORTS_W void initUndistortRectifyMap(InputArray K, InputArray D, InputArray R, InputArray P,
		//    const cv::Size& size, int m1type, OutputArray map1, OutputArray map2);

		/** @brief Transforms an image to compensate for fisheye lens distortion.

		@param distorted image with fisheye lens distortion.
		@param undistorted Output image with compensated fisheye lens distortion.
		@param K Camera matrix \f$K = \vecthreethree{f_x}{0}{c_x}{0}{f_y}{c_y}{0}{0}{_1}\f$.
		@param D Input vector of distortion coefficients \f$(k_1, k_2, k_3, k_4)\f$.
		@param Knew Camera matrix of the distorted image. By default, it is the identity matrix but you
		may additionally scale and shift the result by using a different matrix.
		@param new_size

		The function transforms an image to compensate radial and tangential lens distortion.

		The function is simply a combination of fisheye::initUndistortRectifyMap (with unity R ) and remap
		(with bilinear interpolation). See the former function for details of the transformation being
		performed.

		See below the results of undistortImage.
		-   a\) result of undistort of perspective camera model (all possible coefficients (k_1, k_2, k_3,
		k_4, k_5, k_6) of distortion were optimized under calibration)
		-   b\) result of fisheye::undistortImage of fisheye camera model (all possible coefficients (k_1, k_2,
		k_3, k_4) of fisheye distortion were optimized under calibration)
		-   c\) original image was captured with fisheye lens

		Pictures a) and b) almost the same. But if we consider points of image located far from the center
		of image, we can notice that on image a) these points are distorted.

		![image](pics/fisheye_undistorted.jpg)
		*/

		overload->addStaticOverload("calib3d", "", "undistortImage", {
			make_param<IOArray*>("distorted","IOArray"),
			make_param<IOArray*>("undistorted","IOArray"),
			make_param<IOArray*>("K","IOArray"),
			make_param<IOArray*>("D","IOArray"), 
			make_param<IOArray*>("Knew","IOArray", IOArray::noArray()),
			make_param<Size<cv::Size>*>("new_size",Size<cv::Size>::name, Size())
		}, undistortImage);



		overload->addStaticOverload("calib3d", "", "", {}, );

		interface IestimateNewCameraMatrixForUndistortRectify {
			(K : _st.InputArray, D : _st.InputArray, image_size : _types.Size, R : _st.InputArray,
				P : _st.OutputArray, balance : _st.double /* = 0.0*/, new_size ? : _types.Size /* = Size()*/, fov_scale ? : _st.double /*= 1.0*/) : void;
		}
		export var estimateNewCameraMatrixForUndistortRectify : IestimateNewCameraMatrixForUndistortRectify = alvision_module.estimateNewCameraMatrixForUndistortRectify;

		//CV_EXPORTS_W void estimateNewCameraMatrixForUndistortRectify(InputArray K, InputArray D, const Size &image_size, InputArray R,
		//    OutputArray P, double balance = 0.0, const Size& new_size = Size(), double fov_scale = 1.0);

		/** @brief Performs camera calibaration

		@param objectPoints vector of vectors of calibration pattern points in the calibration pattern
		coordinate space.
		@param imagePoints vector of vectors of the projections of calibration pattern points.
		imagePoints.size() and objectPoints.size() and imagePoints[i].size() must be equal to
		objectPoints[i].size() for each i.
		@param image_size Size of the image used only to initialize the intrinsic camera matrix.
		@param K Output 3x3 floating-point camera matrix
		\f$A = \vecthreethree{f_x}{0}{c_x}{0}{f_y}{c_y}{0}{0}{1}\f$ . If
		fisheye::CALIB_USE_INTRINSIC_GUESS/ is specified, some or all of fx, fy, cx, cy must be
		initialized before calling the function.
		@param D Output vector of distortion coefficients \f$(k_1, k_2, k_3, k_4)\f$.
		@param rvecs Output vector of rotation vectors (see Rodrigues ) estimated for each pattern view.
		That is, each k-th rotation vector together with the corresponding k-th translation vector (see
		the next output parameter description) brings the calibration pattern from the model coordinate
		space (in which object points are specified) to the world coordinate space, that is, a real
		position of the calibration pattern in the k-th pattern view (k=0.. *M* -1).
		@param tvecs Output vector of translation vectors estimated for each pattern view.
		@param flags Different flags that may be zero or a combination of the following values:
		-   **fisheye::CALIB_USE_INTRINSIC_GUESS** cameraMatrix contains valid initial values of
		fx, fy, cx, cy that are optimized further. Otherwise, (cx, cy) is initially set to the image
		center ( imageSize is used), and focal distances are computed in a least-squares fashion.
		-   **fisheye::CALIB_RECOMPUTE_EXTRINSIC** Extrinsic will be recomputed after each iteration
		of intrinsic optimization.
		-   **fisheye::CALIB_CHECK_COND** The functions will check validity of condition number.
		-   **fisheye::CALIB_FIX_SKEW** Skew coefficient (alpha) is set to zero and stay zero.
		-   **fisheye::CALIB_FIX_K1..4** Selected distortion coefficients are set to zeros and stay
		zero.
		@param criteria Termination criteria for the iterative optimization algorithm.
		*/

		overload->addStaticOverload("calib3d", "", "", {}, );

		interface Icalibrate {
			(objectPoints : _st.InputArrayOfArrays, imagePoints : _st.InputArrayOfArrays, image_size : _types.Size,
				K : _st.InputOutputArray, D : _st.InputOutputArray, rvecs : _st.OutputArrayOfArrays, tvecs : _st.OutputArrayOfArrays, flags ? : _st.int /* = 0*/,
				criteria ? : _types.TermCriteria /* = TermCriteria(TermCriteria::COUNT + TermCriteria::EPS, 100, DBL_EPSILON)*/) : _st.double;
		}
		export var calibrate : Icalibrate = alvision_module.calibrate;

		//CV_EXPORTS_W double calibrate(InputArrayOfArrays objectPoints, InputArrayOfArrays imagePoints, const Size& image_size,
		//    InputOutputArray K, InputOutputArray D, OutputArrayOfArrays rvecs, OutputArrayOfArrays tvecs, int flags = 0,
		//        TermCriteria criteria = TermCriteria(TermCriteria::COUNT + TermCriteria::EPS, 100, DBL_EPSILON));

		/** @brief Stereo rectification for fisheye camera model

		@param K1 First camera matrix.
		@param D1 First camera distortion parameters.
		@param K2 Second camera matrix.
		@param D2 Second camera distortion parameters.
		@param imageSize Size of the image used for stereo calibration.
		@param R Rotation matrix between the coordinate systems of the first and the second
		cameras.
		@param tvec Translation vector between coordinate systems of the cameras.
		@param R1 Output 3x3 rectification transform (rotation matrix) for the first camera.
		@param R2 Output 3x3 rectification transform (rotation matrix) for the second camera.
		@param P1 Output 3x4 projection matrix in the new (rectified) coordinate systems for the first
		camera.
		@param P2 Output 3x4 projection matrix in the new (rectified) coordinate systems for the second
		camera.
		@param Q Output \f$4 \times 4\f$ disparity-to-depth mapping matrix (see reprojectImageTo3D ).
		@param flags Operation flags that may be zero or CV_CALIB_ZERO_DISPARITY . If the flag is set,
		the function makes the principal points of each camera have the same pixel coordinates in the
		rectified views. And if the flag is not set, the function may still shift the images in the
		horizontal or vertical direction (depending on the orientation of epipolar lines) to maximize the
		useful image area.
		@param newImageSize New image resolution after rectification. The same size should be passed to
		initUndistortRectifyMap (see the stereo_calib.cpp sample in OpenCV samples directory). When (0,0)
		is passed (default), it is set to the original imageSize . Setting it to larger value can help you
		preserve details in the original image, especially when there is a big radial distortion.
		@param balance Sets the new focal length in range between the min focal length and the max focal
		length. Balance is in range of [0, 1].
		@param fov_scale Divisor for new focal length.
		*/

		overload->addStaticOverload("calib3d", "", "", {}, );

		interface IstereoRectify {
			(K1 : _st.InputArray, D1 : _st.InputArray, K2 : _st.InputArray, D2 : _st.InputArray, imageSize : _types.Size, R : _st.InputArray, tvec : _st.InputArray,
				R1 : _st.OutputArray, R2 : _st.OutputArray, P1 : _st.OutputArray, P2 : _st.OutputArray, Q : _st.OutputArray, flags : _st.int, newImageSize ? : _types.Size/* = Size()*/,
				balance ? : _st.double /* = 0.0*/, fov_scale ? : _st.double /* = 1.0*/) : void;
		}
		export var stereoRectify : IstereoRectify = alvision_module.stereoRectify;

		//CV_EXPORTS_W void stereoRectify(InputArray K1, InputArray D1, InputArray K2, InputArray D2, const Size &imageSize, InputArray R, InputArray tvec,
		//    OutputArray R1, OutputArray R2, OutputArray P1, OutputArray P2, OutputArray Q, int flags, const Size &newImageSize = Size(),
		//    double balance = 0.0, double fov_scale = 1.0);

		/** @brief Performs stereo calibration

		@param objectPoints Vector of vectors of the calibration pattern points.
		@param imagePoints1 Vector of vectors of the projections of the calibration pattern points,
		observed by the first camera.
		@param imagePoints2 Vector of vectors of the projections of the calibration pattern points,
		observed by the second camera.
		@param K1 Input/output first camera matrix:
		\f$\vecthreethree{f_x^{(j)}}{0}{c_x^{(j)}}{0}{f_y^{(j)}}{c_y^{(j)}}{0}{0}{1}\f$ , \f$j = 0,\, 1\f$ . If
		any of fisheye::CALIB_USE_INTRINSIC_GUESS , fisheye::CV_CALIB_FIX_INTRINSIC are specified,
		some or all of the matrix components must be initialized.
		@param D1 Input/output vector of distortion coefficients \f$(k_1, k_2, k_3, k_4)\f$ of 4 elements.
		@param K2 Input/output second camera matrix. The parameter is similar to K1 .
		@param D2 Input/output lens distortion coefficients for the second camera. The parameter is
		similar to D1 .
		@param imageSize Size of the image used only to initialize intrinsic camera matrix.
		@param R Output rotation matrix between the 1st and the 2nd camera coordinate systems.
		@param T Output translation vector between the coordinate systems of the cameras.
		@param flags Different flags that may be zero or a combination of the following values:
		-   **fisheye::CV_CALIB_FIX_INTRINSIC** Fix K1, K2? and D1, D2? so that only R, T matrices
		are estimated.
		-   **fisheye::CALIB_USE_INTRINSIC_GUESS** K1, K2 contains valid initial values of
		fx, fy, cx, cy that are optimized further. Otherwise, (cx, cy) is initially set to the image
		center (imageSize is used), and focal distances are computed in a least-squares fashion.
		-   **fisheye::CALIB_RECOMPUTE_EXTRINSIC** Extrinsic will be recomputed after each iteration
		of intrinsic optimization.
		-   **fisheye::CALIB_CHECK_COND** The functions will check validity of condition number.
		-   **fisheye::CALIB_FIX_SKEW** Skew coefficient (alpha) is set to zero and stay zero.
		-   **fisheye::CALIB_FIX_K1..4** Selected distortion coefficients are set to zeros and stay
		zero.
		@param criteria Termination criteria for the iterative optimization algorithm.
		*/

		overload->addStaticOverload("calib3d", "", "", {}, );

		interface IstereoCalibrate {
			(objectPoints : _st.InputArrayOfArrays, imagePoints1 : _st.InputArrayOfArrays, imagePoints2 : _st.InputArrayOfArrays,
				K1 : _st.InputOutputArray, D1 : _st.InputOutputArray, K2 : _st.InputOutputArray, D2 : _st.InputOutputArray, imageSize : _types.Size,
				R : _st.OutputArray, T : _st.OutputArray, flags ? : FISHEYE_CALIB /* = fisheye::CALIB_FIX_INTRINSIC*/,
				criteria ? : _types.TermCriteria /* = TermCriteria(TermCriteria::COUNT + TermCriteria::EPS, 100, DBL_EPSILON)*/) : _st.double;
		}
		export var stereoCalibrate : IstereoCalibrate = alvision_module.stereoCalibrate;

		//CV_EXPORTS_W double stereoCalibrate(InputArrayOfArrays objectPoints, InputArrayOfArrays imagePoints1, InputArrayOfArrays imagePoints2,
		//                              InputOutputArray K1, InputOutputArray D1, InputOutputArray K2, InputOutputArray D2, Size imageSize,
		//                              OutputArray R, OutputArray T, int flags = fisheye::CALIB_FIX_INTRINSIC,
		//                              TermCriteria criteria = TermCriteria(TermCriteria::COUNT + TermCriteria::EPS, 100, DBL_EPSILON));

		//! @} calib3d_fisheye
	}

	POLY_METHOD(fisheye::projectPoints_a) {
		auto objectPoints	= info.at<IOArray*>(0)->GetInputArray();
		auto imagePoints	= info.at<IOArray*>(1)->GetOutputArray();
		auto affine			= info.at<Affine3<cv::Affine3d>*>(2) ->_affine3;
		auto K				= info.at<IOArray*>(3)->GetInputArray();
		auto D				= info.at<IOArray*>(4)->GetInputArray();
		auto alpha 			= info.at<double>(5);
		auto jacobian 		= info.at<IOArray*>(6)->GetOutputArray();

		cv::projectPoints(
			objectPoints,
			imagePoints	,
			affine		,
			K			,
			D			,
			alpha		,
			jacobian);
	}

	POLY_METHOD(fisheye::projectPoints_b) {
			auto objectPoints	= info.at<IOArray*>(0)->GetInputArray();
			auto imagePoints	= info.at<IOArray*>(1)->GetOutputArray();
			auto rvec			= info.at<IOArray*>(2)->GetInputArray();
			auto tvec			= info.at<IOArray*>(3)->GetInputArray();
			auto K				= info.at<IOArray*>(4)->GetInputArray();
			auto D				= info.at<IOArray*>(5)->GetInputArray();
			auto alpha			= info.at<double*>(6);
			auto jacobian 		= info.at<IOArray*>(7)->GetOutputArray();

		cv::projectPoints(
			objectPoints	,
			imagePoints		,
			rvec			,
			tvec			,
			K				,
			D				,
			alpha			,
			jacobian);
	}
	POLY_METHOD(fisheye::distortPoints) {
			auto undistorted	= info.at<IOArray*>(0)->GetInputArray();
			auto distorted		= info.at<IOArray*>(1)->GetOutputArray();
			auto K				= info.at<IOArray*>(2)->GetInputArray();
			auto D				= info.at<IOArray*>(3)->GetInputArray();
			auto alpha			= info.at<double>(4);

			cv::distortPoints(
				undistorted	,
				distorted	,
				K			,
				D			,
				alpha);
	}


	POLY_METHOD(fisheye::undistortPoints) {
		auto distorted		= info.at<IOArray*>(0)->GetInputArray();
		auto undistorted	= info.at<IOArray*>(1)->GetOutputArray();
		auto K				= info.at<IOArray*>(2)->GetInputArray();
		auto D				= info.at<IOArray*>(3)->GetInputArray();
		auto Knew			= info.at<IOArray*>(4)->GetInputArray(); 
		auto new_size		= info.at<Size<cv::Size>*>(5)->_size;


		cv::undistortPoints(
			distorted,
			undistorted,
			K,
			D,
			Knew,
			new_size);
	}
	POLY_METHOD(fisheye::initUndistortRectifyMap) {}
	POLY_METHOD(fisheye::undistortImage) {}
	POLY_METHOD(fisheye::estimateNewCameraMatrixForUndistortRectify) {}
	POLY_METHOD(fisheye::calibrate) {}
	POLY_METHOD(fisheye::stereoRectify) {}
	POLY_METHOD(fisheye::stereoCalibrate) {}