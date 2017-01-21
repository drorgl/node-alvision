#include "fisheye.h"
#include "../IOArray.h"
#include "../Affine3.h"
#include "../types/Size.h"
#include "../types/TermCriteria.h"

namespace fisheye_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("fisheye_general_callback is empty");
		}
		return overload->execute("fisheye", info);
	}
}

void
fisheye::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	fisheye_general_callback::overload = overload;

	auto FISHEYE_CALIB = CreateNamedObject(target, "FISHEYE_CALIB");
	SetObjectProperty(FISHEYE_CALIB, "CALIB_USE_INTRINSIC_GUESS", 1);
	SetObjectProperty(FISHEYE_CALIB, "CALIB_RECOMPUTE_EXTRINSIC", 2);
	SetObjectProperty(FISHEYE_CALIB, "CALIB_CHECK_COND", 4);
	SetObjectProperty(FISHEYE_CALIB, "CALIB_FIX_SKEW", 8);
	SetObjectProperty(FISHEYE_CALIB, "CALIB_FIX_K1", 16);
	SetObjectProperty(FISHEYE_CALIB, "CALIB_FIX_K2", 32);
	SetObjectProperty(FISHEYE_CALIB, "CALIB_FIX_K3", 64);
	SetObjectProperty(FISHEYE_CALIB, "CALIB_FIX_K4", 128);
	SetObjectProperty(FISHEYE_CALIB, "CALIB_FIX_INTRINSIC", 256);
	overload->add_type_alias("FISHEYE_CALIB", "int");


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



	overload->addStaticOverload("calib3d", "", "undistortPoints", {
			make_param<IOArray*>("distorted","IOArray"),
			make_param<IOArray*>("undistorted","IOArray"),
			make_param<IOArray*>("K","IOArray"),
			make_param<IOArray*>("D","IOArray"),
			make_param<IOArray*>("R","IOArray",IOArray::noArray()),
			make_param<IOArray*>("P","IOArray",IOArray::noArray())
	}, undistortPoints);

	overload->addStaticOverload("calib3d", "", "initUndistortRectifyMap", {

			make_param<IOArray*>("K","IOArray"),
			make_param<IOArray*>("D","IOArray"),
			make_param<IOArray*>("R","IOArray"),
			make_param<IOArray*>("P","IOArray"),
			make_param<Size*>("size",Size::name),
			make_param<int>("m1type","int"),
			make_param<IOArray*>("map1","IOArray"),
			make_param<IOArray*>("map2","IOArray")

	}, initUndistortRectifyMap);


	overload->addStaticOverload("calib3d", "", "undistortImage", {
		make_param<IOArray*>("distorted","IOArray"),
		make_param<IOArray*>("undistorted","IOArray"),
		make_param<IOArray*>("K","IOArray"),
		make_param<IOArray*>("D","IOArray"),
		make_param<IOArray*>("Knew","IOArray", IOArray::noArray()),
		make_param<Size*>("new_size",Size::name, Size::Empty())
	}, undistortImage);



	overload->addStaticOverload("calib3d", "", "estimateNewCameraMatrixForUndistortRectify", {
		make_param<IOArray*>("K","IOArray"),
		make_param<IOArray*>("D","IOArray"),
		make_param<Size*>("image_size",Size::name),
		make_param<IOArray*>("R","IOArray"),
		make_param<IOArray*>("P","IOArray"),
		make_param<double>("balance","double", 0.0),
		make_param<Size*>("new_size",Size::name, Size::Empty()),
		make_param<double>("fov_scale","double", 1.0)

	}, estimateNewCameraMatrixForUndistortRectify);

	overload->addStaticOverload("calib3d", "", "calibrate", {
		make_param<IOArray*>("objectPoints","IOArray"),
		make_param<IOArray*>("imagePoints","IOArray"),
		make_param<Size*>("image_size",Size::name),
		make_param<IOArray*>("K","IOArray"),
		make_param<IOArray*>("D","IOArray"),
		make_param<IOArray*>("rvecs","IOArray"),
		make_param<IOArray*>("tvecs","IOArray"),
		make_param<int>("flags","int", 0),
		make_param<TermCriteria*>("criteria","TermCriteria",TermCriteria::New(cv::TermCriteria::COUNT + cv::TermCriteria::EPS, 100, DBL_EPSILON))
	}, calibrate);


	overload->addStaticOverload("calib3d", "", "stereoRectify", {
		make_param<IOArray*>("K1","IOArray"),
		make_param<IOArray*>("D1","IOArray"),
		make_param<IOArray*>("K2","IOArray"),
		make_param<IOArray*>("D2","IOArray"),
		make_param<Size*>("imageSize",Size::name),
		make_param<IOArray*>("R","IOArray"),
		make_param<IOArray*>("tvec","IOArray"),
		make_param<IOArray*>("R1","IOArray"),
		make_param<IOArray*>("R2","IOArray"),
		make_param<IOArray*>("P1","IOArray"),
		make_param<IOArray*>("P2","IOArray"),
		make_param<IOArray*>("Q","IOArray"),
		make_param<int>("flags","int"),
		make_param<Size*>("newImageSize",Size::name, Size::Empty()),
		make_param<double>("balance","double", 0.0),
		make_param<double>("fov_scale","double", 1.0)
	}, stereoRectify);



	overload->addStaticOverload("calib3d", "", "stereoCalibrate", {
		make_param<IOArray*>("objectPoints","IOArray"),
		make_param<IOArray*>("imagePoints1","IOArray"),
		make_param<IOArray*>("imagePoints2","IOArray"),
		make_param<IOArray*>("K1","IOArray"),
		make_param<IOArray*>("D1","IOArray"),
		make_param<IOArray*>("K2","IOArray"),
		make_param<IOArray*>("D2","IOArray"),
		make_param<Size*>("imageSize",Size::name),
		make_param<IOArray*>("R","IOArray"),
		make_param<IOArray*>("T","IOArray"),
		make_param<int>("flags","FISHEYE_CALIB",cv::fisheye::CALIB_FIX_INTRINSIC),
		make_param<TermCriteria*>("criteria","TermCriteria",TermCriteria::New(cv::TermCriteria::COUNT + cv::TermCriteria::EPS, 100, DBL_EPSILON))
	}, stereoCalibrate);

}



POLY_METHOD(fisheye::projectPoints_a) {
	auto objectPoints = info.at<IOArray*>(0)->GetInputArray();
	auto imagePoints = info.at<IOArray*>(1)->GetOutputArray();
	auto affine = info.at<Affine3<cv::Affine3d>*>(2)->_affine3;
	auto K = info.at<IOArray*>(3)->GetInputArray();
	auto D = info.at<IOArray*>(4)->GetInputArray();
	auto alpha = info.at<double>(5);
	auto jacobian = info.at<IOArray*>(6)->GetOutputArray();

	cv::fisheye::projectPoints(
		objectPoints,
		imagePoints,
		*affine,
		K,
		D,
		alpha,
		jacobian);
}

POLY_METHOD(fisheye::projectPoints_b) {
	auto objectPoints = info.at<IOArray*>(0)->GetInputArray();
	auto imagePoints = info.at<IOArray*>(1)->GetOutputArray();
	auto rvec = info.at<IOArray*>(2)->GetInputArray();
	auto tvec = info.at<IOArray*>(3)->GetInputArray();
	auto K = info.at<IOArray*>(4)->GetInputArray();
	auto D = info.at<IOArray*>(5)->GetInputArray();
	auto alpha = info.at<double>(6);
	auto jacobian = info.at<IOArray*>(7)->GetOutputArray();

	cv::fisheye::projectPoints(
		objectPoints,
		imagePoints,
		rvec,
		tvec,
		K,
		D,
		alpha,
		jacobian);
}
POLY_METHOD(fisheye::distortPoints) {
	auto undistorted = info.at<IOArray*>(0)->GetInputArray();
	auto distorted = info.at<IOArray*>(1)->GetOutputArray();
	auto K = info.at<IOArray*>(2)->GetInputArray();
	auto D = info.at<IOArray*>(3)->GetInputArray();
	auto alpha = info.at<double>(4);

	cv::fisheye::distortPoints(
		undistorted,
		distorted,
		K,
		D,
		alpha);
}



POLY_METHOD(fisheye::undistortPoints) {
	auto distorted = info.at<IOArray*>(0)->GetInputArray();
	auto undistorted = info.at<IOArray*>(1)->GetOutputArray();
	auto K = info.at<IOArray*>(2)->GetInputArray();
	auto D = info.at<IOArray*>(3)->GetInputArray();
	auto R = info.at<IOArray*>(4)->GetInputArray();
	auto P = info.at<IOArray*>(5)->GetInputArray();

	cv::fisheye::undistortPoints(
		distorted,
		undistorted,
		K,
		D,
		R,
		P);
}


POLY_METHOD(fisheye::initUndistortRectifyMap) {
	auto K = info.at<IOArray*>(0)->GetInputArray();
	auto D = info.at<IOArray*>(1)->GetInputArray();
	auto R = info.at<IOArray*>(2)->GetInputArray();
	auto P = info.at<IOArray*>(3)->GetInputArray();
	auto size = info.at<Size*>(4)->_size;
	auto m1type = info.at<int>(5);
	auto map1 = info.at<IOArray*>(6)->GetOutputArray();
	auto map2 = info.at<IOArray*>(7)->GetOutputArray();

	cv::fisheye::initUndistortRectifyMap(
		K,
		D,
		R,
		P,
		*size,
		m1type,
		map1,
		map2);
}
POLY_METHOD(fisheye::undistortImage) {
	auto distorted = info.at<IOArray*>(0)->GetInputArray();
	auto undistorted = info.at<IOArray*>(1)->GetOutputArray();
	auto K = info.at<IOArray*>(2)->GetInputArray();
	auto D = info.at<IOArray*>(3)->GetInputArray();
	auto Knew = info.at<IOArray*>(4)->GetInputArray();
	auto new_size = info.at<Size*>(5)->_size;

	cv::fisheye::undistortImage(
		distorted,
		undistorted,
		K,
		D,
		Knew,
		*new_size);
}
POLY_METHOD(fisheye::estimateNewCameraMatrixForUndistortRectify) {
	auto K = info.at<IOArray*>(0)->GetInputArray();
	auto D = info.at<IOArray*>(1)->GetInputArray();
	auto image_size = info.at<Size*>(2)->_size;
	auto R = info.at<IOArray*>(3)->GetInputArray();
	auto P = info.at<IOArray*>(4)->GetOutputArray();
	auto balance = info.at<double>(5);
	auto new_size = info.at<Size*>(6)->_size;
	auto fov_scale = info.at<double>(7);

	cv::fisheye::estimateNewCameraMatrixForUndistortRectify(
		K,
		D,
		*image_size,
		R,
		P,
		balance,
		*new_size,
		fov_scale);

}
POLY_METHOD(fisheye::calibrate) {
	auto objectPoints = info.at<IOArray*>(0)->GetInputArrayOfArrays();
	auto imagePoints = info.at<IOArray*>(1)->GetInputArrayOfArrays();
	auto image_size = info.at<Size*>(2)->_size;
	auto K = info.at<IOArray*>(3)->GetInputOutputArray();
	auto D = info.at<IOArray*>(4)->GetInputOutputArray();
	auto rvecs = info.at<IOArray*>(5)->GetOutputArrayOfArrays();
	auto tvecs = info.at<IOArray*>(6)->GetOutputArrayOfArrays();
	auto flags = info.at<int>(7);
	auto criteria = info.at<TermCriteria*>(8)->_termCriteria;

	auto ret = cv::fisheye::calibrate(
		objectPoints,
		imagePoints,
		*image_size,
		K,
		D,
		rvecs,
		tvecs,
		flags,
		*criteria
	);

	info.SetReturnValue(ret);
}
POLY_METHOD(fisheye::stereoRectify) {
	auto K1 = info.at<IOArray*>(0)->GetInputArray();
	auto D1 = info.at<IOArray*>(1)->GetInputArray();
	auto K2 = info.at<IOArray*>(2)->GetInputArray();
	auto D2 = info.at<IOArray*>(3)->GetInputArray();
	auto imageSize = info.at<Size*>(4)->_size;
	auto R = info.at<IOArray*>(5)->GetInputArray();
	auto tvec = info.at<IOArray*>(6)->GetInputArray();
	auto R1 = info.at<IOArray*>(7)->GetOutputArray();
	auto R2 = info.at<IOArray*>(8)->GetOutputArray();
	auto P1 = info.at<IOArray*>(9)->GetOutputArray();
	auto P2 = info.at<IOArray*>(10)->GetOutputArray();
	auto Q = info.at<IOArray*>(11)->GetOutputArray();
	auto flags = info.at<int>(12);
	auto newImageSize = info.at<Size*>(13)->_size;
	auto balance = info.at<double>(14);
	auto fov_scale = info.at<double>(15);

	cv::fisheye::stereoRectify(
		K1,
		D1,
		K2,
		D2,
		*imageSize,
		R,
		tvec,
		R1,
		R2,
		P1,
		P2,
		Q,
		flags,
		*newImageSize,
		balance,
		fov_scale);
}
POLY_METHOD(fisheye::stereoCalibrate) {
	auto objectPoints = info.at<IOArray*>(0)->GetInputArrayOfArrays();
	auto imagePoints1 = info.at<IOArray*>(1)->GetInputArrayOfArrays();
	auto imagePoints2 = info.at<IOArray*>(2)->GetInputArrayOfArrays();
	auto K1 = info.at<IOArray*>(3)->GetInputOutputArray();
	auto D1 = info.at<IOArray*>(4)->GetInputOutputArray();
	auto K2 = info.at<IOArray*>(5)->GetInputOutputArray();
	auto D2 = info.at<IOArray*>(6)->GetInputOutputArray();
	auto imageSize = info.at<Size*>(7)->_size;
	auto R = info.at<IOArray*>(8)->GetOutputArray();
	auto T = info.at<IOArray*>(9)->GetOutputArray();
	auto flags = info.at<int>(10);
	auto criteria = info.at<TermCriteria*>(11)->_termCriteria;

	auto ret = cv::fisheye::stereoCalibrate(
		objectPoints,
		imagePoints1,
		imagePoints2,
		K1,
		D1,
		K2,
		D2,
		*imageSize,
		R,
		T,
		flags,
		*criteria
	);

	info.SetReturnValue(ret);
}