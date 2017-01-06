#include "calib3d.h"
#include "IOArray.h"
#include "Matrix.h"
#include "Vec.h"
#include "Size.h"
#include "Rect.h"
#include "types/TermCriteria.h"
#include "Point.h"
#include "features2d/Feature2D.h"
#include "features2d/SimpleBlobDetector.h"

#include "calib3d/fisheye.h"
#include "calib3d/StereoMatcher.h"
#include "calib3d/StereoBM.h"
#include "calib3d/StereoSGBM.h"

namespace calib3d_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("calib3d_general_callback is empty");
		}
		return overload->execute("calib3d", info);
	}
}

void
calib3d::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	calib3d_general_callback::overload = overload;

  auto RobustEstimationAlgo = CreateNamedObject(target, "RobustEstimationAlgo");
  SetObjectProperty(RobustEstimationAlgo, "LMEDS", (4));
  SetObjectProperty(RobustEstimationAlgo, "RANSAC", (8));
  SetObjectProperty(RobustEstimationAlgo, "RHO", (16));

  auto SOLVEPNP = CreateNamedObject(target, "SOLVEPNP");
  SetObjectProperty(SOLVEPNP, "SOLVEPNP_ITERATIVE", (0));
  SetObjectProperty(SOLVEPNP, "SOLVEPNP_EPNP", (1));
  SetObjectProperty(SOLVEPNP, "SOLVEPNP_P3P", (2));
  SetObjectProperty(SOLVEPNP, "SOLVEPNP_DLS", (3));
  SetObjectProperty(SOLVEPNP, "SOLVEPNP_UPNP", (4));
  overload->add_type_alias("SOLVEPNP", "int");


  auto CALIB_CB = CreateNamedObject(target, "CALIB_CB");
  SetObjectProperty(CALIB_CB, "CALIB_CB_ADAPTIVE_THRESH", (1));
  SetObjectProperty(CALIB_CB, "CALIB_CB_NORMALIZE_IMAGE", (2));
  SetObjectProperty(CALIB_CB, "CALIB_CB_FILTER_QUADS", (4));
  SetObjectProperty(CALIB_CB, "CALIB_CB_FAST_CHECK", (8));

  auto CALIB_CB_SYM = CreateNamedObject(target, "CALIB_CB_SYM");
  SetObjectProperty(CALIB_CB_SYM, "CALIB_CB_SYMMETRIC_GRID", (1));
  SetObjectProperty(CALIB_CB_SYM, "CALIB_CB_ASYMMETRIC_GRID", (2));
  SetObjectProperty(CALIB_CB_SYM, "CALIB_CB_CLUSTERING", (4));
  overload->add_type_alias("CALIB_CB_SYM", "int");

  auto CALIB = CreateNamedObject(target, "CALIB");
  SetObjectProperty(CALIB, "CALIB_USE_INTRINSIC_GUESS", (0x00001));
  SetObjectProperty(CALIB, "CALIB_USE_INTRINSIC_GUESS", (0x00001));
  SetObjectProperty(CALIB, "CALIB_FIX_ASPECT_RATIO", (0x00002));
  SetObjectProperty(CALIB, "CALIB_FIX_PRINCIPAL_POINT", (0x00004));
  SetObjectProperty(CALIB, "CALIB_ZERO_TANGENT_DIST", (0x00008));
  SetObjectProperty(CALIB, "CALIB_FIX_FOCAL_LENGTH", (0x00010));
  SetObjectProperty(CALIB, "CALIB_FIX_K1", (0x00020));
  SetObjectProperty(CALIB, "CALIB_FIX_K2", (0x00040));
  SetObjectProperty(CALIB, "CALIB_FIX_K3", (0x00080));
  SetObjectProperty(CALIB, "CALIB_FIX_K4", (0x00800));
  SetObjectProperty(CALIB, "CALIB_FIX_K5", (0x01000));
  SetObjectProperty(CALIB, "CALIB_FIX_K6", (0x02000));
  SetObjectProperty(CALIB, "CALIB_RATIONAL_MODEL", (0x04000));
  SetObjectProperty(CALIB, "CALIB_THIN_PRISM_MODEL", (0x08000));
  SetObjectProperty(CALIB, "CALIB_FIX_S1_S2_S3_S4", (0x10000));
  SetObjectProperty(CALIB, "CALIB_TILTED_MODEL", (0x40000));
  SetObjectProperty(CALIB, "CALIB_FIX_TAUX_TAUY", (0x80000));
  SetObjectProperty(CALIB, "CALIB_FIX_INTRINSIC", (0x00100));
  SetObjectProperty(CALIB, "CALIB_SAME_FOCAL_LENGTH", (0x00200));
  SetObjectProperty(CALIB, "CALIB_ZERO_DISPARITY", (0x00400));
  SetObjectProperty(CALIB, "CALIB_USE_LU", ((1 << 17)));
  overload->add_type_alias("CALIB", "int");


  auto FundMatrixAlgo = CreateNamedObject(target, "FundMatrixAlgo");
  SetObjectProperty(FundMatrixAlgo, "FM_7POINT", (1));
  SetObjectProperty(FundMatrixAlgo, "FM_8POINT", (2));
  SetObjectProperty(FundMatrixAlgo, "FM_LMEDS", (4));
  SetObjectProperty(FundMatrixAlgo, "FM_RANSAC", (8));
  overload->add_type_alias("FundMatrixAlgo", "int");

  overload->addOverload("calib3d", "", "Rodrigues", {make_param<IOArray*>("src","IOArray"),make_param<IOArray*>("dst","IOArray"),make_param<IOArray*>("jacobian","IOArray",IOArray::noArray())}, calib3d::Rodrigues);
  Nan::SetMethod(target, "Rodrigues", calib3d_general_callback::callback);

  overload->addOverload("calib3d", "", "findHomography", { make_param<IOArray*>("srcPoints","IOArray"), make_param<IOArray*>("dstPoints","IOArray"), make_param<int>("method","int",0),
	make_param<double>("ransacReprojThreshold","double",3), make_param<IOArray*>("mask","IOArray",IOArray::noArray()), make_param<int>("maxIters","int",2000),make_param<double>("confidence","double",0.995) }, findHomography_adv);
  Nan::SetMethod(target, "findHomography", calib3d_general_callback::callback);

  overload->addOverload("calib3d", "", "findHomography", { make_param<IOArray*>("srcPoints","IOArray"), make_param<IOArray*>("dstPoints","IOArray"), make_param<IOArray*>("mask","IOArray"), make_param<int>("method","int",0), make_param<double>("ransacReprojThreshold","double",3) }, calib3d::findHomography);
  

  overload->addOverload("calib3d", "", "RQDecomp3x3", { make_param<IOArray*>("src","IOArray"), make_param<IOArray*>("mtxR","IOArray"), make_param<IOArray*>("mtxQ","IOArray"),
	  make_param<IOArray*>("Qx","IOArray",IOArray::noArray()),
	  make_param<IOArray*>("Qy","IOArray",IOArray::noArray()),
	  make_param<IOArray*>("Qz","IOArray",IOArray::noArray()), }, calib3d::RQDecomp3x3);
  Nan::SetMethod(target, "RQDecomp3x3", calib3d_general_callback::callback);


  overload->addOverload("calib3d", "", "decomposeProjectionMatrix", {make_param<IOArray*>("projMatrix","IOArray"), make_param<IOArray*>("cameraMatrix","IOArray"), 
		make_param<IOArray*>("rotMatrix","IOArray"), make_param<IOArray*>("transVect","IOArray"),
		make_param<IOArray*>("rotMatrixX","IOArray", IOArray::noArray()), 
	  make_param<IOArray*>("rotMatrixY","IOArray", IOArray::noArray()), 
	  make_param<IOArray*>("rotMatrixZ","IOArray", IOArray::noArray()), 
	  make_param<IOArray*>("eulerAngles","IOArray", IOArray::noArray()) }, decomposeProjectionMatrix);
  Nan::SetMethod(target, "decomposeProjectionMatrix", calib3d_general_callback::callback);

  overload->addOverload("calib3d", "", "matMulDeriv", {make_param<IOArray*>("A","IOArray"), make_param<IOArray*>("B","IOArray"), make_param<IOArray*>("dABdA","IOArray"), make_param<IOArray*>("dABdB","IOArray")}, matMulDeriv);
  Nan::SetMethod(target, "matMulDeriv", calib3d_general_callback::callback);

  overload->addOverload("calib3d", "", "composeRT", {
	  make_param<IOArray*>("rvec1","IOArray"),
	  make_param<IOArray*>("tvec1","IOArray"),
	  make_param<IOArray*>("rvec2","IOArray"),
	  make_param<IOArray*>("tvec2","IOArray"),
	  make_param<IOArray*>("rvec3","IOArray"),
	  make_param<IOArray*>("tvec3","IOArray"),
	  make_param<IOArray*>("dr3dr1","IOArray",IOArray::noArray()),
	  make_param<IOArray*>("dr3dt1","IOArray",IOArray::noArray()),
	  make_param<IOArray*>("dr3dr2","IOArray",IOArray::noArray()),
	  make_param<IOArray*>("dr3dt2","IOArray",IOArray::noArray()),
	  make_param<IOArray*>("dt3dr1","IOArray",IOArray::noArray()),
	  make_param<IOArray*>("dt3dt1","IOArray",IOArray::noArray()),
	  make_param<IOArray*>("dt3dr2","IOArray",IOArray::noArray()),
	  make_param<IOArray*>("dt3dt2","IOArray",IOArray::noArray())
  }, composeRT);
  Nan::SetMethod(target, "composeRT", calib3d_general_callback::callback);

  overload->addOverload("calib3d", "", "projectPoints", {
	make_param<IOArray*>("objectPoints","IOArray"),
	make_param<IOArray*>("rvec","IOArray"), 
	make_param<IOArray*>("tvec","IOArray"),
	make_param<IOArray*>("cameraMatrix","IOArray"),
	make_param<IOArray*>("distCoeffs","IOArray"),
	make_param<IOArray*>("imagePoints","IOArray"),
	make_param<IOArray*>("jacobian","IOArray",IOArray::noArray()),
	make_param<double>("aspectRatio","double",0)
  }, projectPoints);
  Nan::SetMethod(target, "projectPoints", calib3d_general_callback::callback);

  overload->addOverload("calib3d", "", "solvePnP", {
	make_param<IOArray*>("objectPoints","IOArray"),
	make_param<IOArray*>("imagePoints","IOArray"),
	make_param<IOArray*>("cameraMatrix","IOArray"),
	make_param<IOArray*>("distCoeffs","IOArray"),
	make_param<IOArray*>("rvec","IOArray"),
	make_param<IOArray*>("tvec","IOArray"),
	make_param<bool>("useExtrinsicGuess","bool",false),
	make_param<int>("flags","SOLVEPNP",cv::SOLVEPNP_ITERATIVE)
  }, solvePnP);
  Nan::SetMethod(target, "solvePnP", calib3d_general_callback::callback);

  overload->addOverload("calib3d", "", "solvePnPRansac", {
	  make_param<IOArray*>("objectPoints","IOArray"),
	  make_param<IOArray*>("imagePoints","IOArray"),
	  make_param<IOArray*>("cameraMatrix","IOArray"),
	  make_param<IOArray*>("distCoeffs","IOArray"),
	  make_param<IOArray*>("rvec","IOArray"),
	  make_param<IOArray*>("tvec","IOArray"),
	  make_param<bool>("useExtrinsicGuess","bool",false),
	  make_param<int>("iterationsCount","int"),
	  make_param<float>("reprojectionError","float",8.0),
	  make_param<double>("confidence","double",0.99),
	  make_param<IOArray*>("inliers","IOArray",IOArray::noArray()),
	  make_param<int>("flags","int",cv::SOLVEPNP_ITERATIVE)
  }, solvePnPRansac);
  Nan::SetMethod(target, "solvePnPRansac", calib3d_general_callback::callback);


  overload->addOverload("calib3d", "", "initCameraMatrix2D", {
	  make_param<IOArray*>("objectPoints","IOArray"),
	  make_param<IOArray*>("imagePoints","IOArray"),
	  make_param<Size*>("imageSize",Size::name),
	  make_param<double>("aspectRatio","double",1.0)
  }, initCameraMatrix2D);
  Nan::SetMethod(target, "initCameraMatrix2D", calib3d_general_callback::callback);

  overload->addOverload("calib3d", "", "findChessboardCorners", {
	  make_param<IOArray*>("image","IOArray"),
	  make_param<Size*>("patternSize",Size::name),
	  make_param<IOArray*>("corners","IOArray"),
	  make_param<int>("flags","int",cv::CALIB_CB_ADAPTIVE_THRESH + cv::CALIB_CB_NORMALIZE_IMAGE)
  }, findChessboardCorners);
  Nan::SetMethod(target, "findChessboardCorners", calib3d_general_callback::callback);


  overload->addOverload("calib3d", "", "find4QuadCornerSubpix", {
	  make_param<IOArray*>("img","IOArray"),
	  make_param<IOArray*>("corners","IOArray"),
	  make_param<Size*>("region_size",Size::name)
  }, find4QuadCornerSubpix);
  Nan::SetMethod(target, "find4QuadCornerSubpix", calib3d_general_callback::callback);

  overload->addOverload("calib3d", "", "drawChessboardCorners", {
	  make_param<IOArray*>("image","IOArray"),
	  make_param<Size*>("patternSize",Size::name),
	  make_param<IOArray*>("corners","IOArray"),
	  make_param<bool>("patternWasFound","bool")
  }, drawChessboardCorners);
  Nan::SetMethod(target, "drawChessboardCorners", calib3d_general_callback::callback);


  overload->addOverload("calib3d", "", "findCirclesGrid", {
	  make_param<IOArray*>("image","IOArray"),
	  make_param<Size*>("patternSize",Size::name),
	  make_param<IOArray*>("centers","IOArray"),
	  make_param<int>("flags","CALIB_CB_SYM",cv::CALIB_CB_SYMMETRIC_GRID),
	  make_param<FeatureDetector*>("blobDetector","FeatureDetector",SimpleBlobDetector::create())
  }, findCirclesGrid);
  Nan::SetMethod(target, "findCirclesGrid", calib3d_general_callback::callback);

  overload->addOverload("calib3d", "", "calibrateCamera", {
	  make_param<IOArray*>("objectPoints","IOArray"),
	  make_param<IOArray*>("imagePoints","IOArray"),
	  make_param<Size*>("imageSize",Size::name),
	  make_param<IOArray*>("cameraMatrix","IOArray"),
	  make_param<IOArray*>("distCoeffs","IOArray"),
	  make_param<IOArray*>("rvecs","IOArray"),
	  make_param<IOArray*>("tvecs","IOArray"),
	  make_param<int>("flags","int",0),
	  make_param<TermCriteria*>("criteria","TermCriteria",TermCriteria::New(cv::TermCriteria::COUNT + cv::TermCriteria::EPS, 30, DBL_EPSILON))
  }, calibrateCamera);
  Nan::SetMethod(target, "calibrateCamera", calib3d_general_callback::callback);

  overload->addOverload("calib3d", "", "calibrationMatrixValues", {
	  make_param<IOArray*>("cameraMatrix","IOArray"),
	  make_param<Size*>("imageSize",Size::name),
	  make_param<double>("apertureWidth","double"),
	  make_param<double>("apertureHeight","double"),
	  make_param<std::shared_ptr< or ::Callback>>("cb","Function")// : (fovx : _st.double, fovy : _st.double, focalLength : _st.double, principalPoint : _types.Point2d, aspectRatio : _st.double) = >void
  }, calibrationMatrixValues);
  Nan::SetMethod(target, "calibrationMatrixValues", calib3d_general_callback::callback);


  overload->addOverload("calib3d", "", "stereoCalibrate", {
	  make_param<IOArray*>("objectPoints","IOArray"),
	  make_param<IOArray*>("imagePoints1","IOArray"),
	  make_param<IOArray*>("imagePoints2","IOArray"),
	  make_param<IOArray*>("cameraMatrix1","IOArray"),
	  make_param<IOArray*>("distCoeffs1","IOArray"),
	  make_param<IOArray*>("cameraMatrix2","IOArray"),
	  make_param<IOArray*>("distCoeffs2","IOArray"),
	  make_param<Size*>("imageSize",Size::name),
	  make_param<IOArray*>("R","IOArray"),
	  make_param<IOArray*>("T","IOArray"),
	  make_param<IOArray*>("E","IOArray"),
	  make_param<IOArray*>("F","IOArray"),
	  make_param<int>("flags","CALIB",cv::CALIB_FIX_INTRINSIC),
	  make_param<TermCriteria*>("criteria","TermCriteria",TermCriteria::New(cv::TermCriteria::COUNT + cv::TermCriteria::EPS, 30, 1e-6))
  }, stereoCalibrate);
  Nan::SetMethod(target, "stereoCalibrate", calib3d_general_callback::callback);

  overload->addOverload("calib3d", "", "stereoRectify", {
		make_param<IOArray*>("cameraMatrix1","IOArray"),
		make_param<IOArray*>("distCoeffs1","IOArray"),
		make_param<IOArray*>("cameraMatrix2","IOArray"),
		make_param<IOArray*>("distCoeffs2","IOArray"),
		make_param<Size*>("imageSize",Size::name),
		make_param<IOArray*>("R","IOArray"),
		make_param<IOArray*>("T","IOArray"),
		make_param<IOArray*>("R1","IOArray"),
		make_param<IOArray*>("R2","IOArray"),
		make_param<IOArray*>("P1","IOArray"),
		make_param<IOArray*>("P2","IOArray"),
		make_param<IOArray*>("Q","IOArray"),
		make_param<int>("flags","CALIB",cv::CALIB_ZERO_DISPARITY),
		make_param<double>("alpha","double",-1),
		make_param<Size*>("newImageSize",Size::name,std::make_shared<Size>()),
		make_param<std::shared_ptr<or::Callback>>("cb","Function")// ? : (validPixROI1 : _types.Rect, validPixROI2 : _types.Rect) = > void
  }, stereoRectify);
  Nan::SetMethod(target, "stereoRectify", calib3d_general_callback::callback);


  overload->addOverload("calib3d", "", "stereoRectifyUncalibrated", {
		make_param<IOArray*>("points1","IOArray"),
		make_param<IOArray*>("points2","IOArray"),
		make_param<IOArray*>("F","IOArray"),
		make_param<Size*>("imgSize",Size::name),
		make_param<IOArray*>("H1","IOArray"),
		make_param<IOArray*>("H2","IOArray"),
		make_param<double>("threshold","double",5)
  }, stereoRectifyUncalibrated);
  Nan::SetMethod(target, "stereoRectifyUncalibrated", calib3d_general_callback::callback);

  overload->addOverload("calib3d", "", "rectify3Collinear", {
		make_param<IOArray*>("cameraMatrix1","IOArray"),
		make_param<IOArray*>("distCoeffs1","IOArray"),
		make_param<IOArray*>("cameraMatrix2","IOArray"),
		make_param<IOArray*>("distCoeffs2","IOArray"),
		make_param<IOArray*>("cameraMatrix3","IOArray"),
		make_param<IOArray*>("distCoeffs3","IOArray"),
		make_param<IOArray*>("imgpt1","IOArray"),
		make_param<IOArray*>("imgpt3","IOArray"),
		make_param<Size*>("imageSize", Size::name),
		make_param<IOArray*>("R12","IOArray"),
		make_param<IOArray*>("T12","IOArray"),
		make_param<IOArray*>("R13","IOArray"),
		make_param<IOArray*>("T13","IOArray"),
		make_param<IOArray*>("R1","IOArray"),
		make_param<IOArray*>("R2","IOArray"), 
		make_param<IOArray*>("R3","IOArray"),
		make_param<IOArray*>("P1","IOArray"), 
		make_param<IOArray*>("P2","IOArray"), 
		make_param<IOArray*>("P3","IOArray"),
		make_param<IOArray*>("Q","IOArray"),
		make_param<double>("alpha","double"),
		make_param<Size*>("newImgSize",Size::name),
		make_param<std::shared_ptr<or::Callback>>("cb","Function"),// : (roi1 : _types.Rect, roi2 : _types.Rect) = > void, 
		make_param<int>("flags","int")
  }, calib3d::rectify3Collinear);
  Nan::SetMethod(target, "rectify3Collinear", calib3d_general_callback::callback);

  overload->addOverload("calib3d", "", "getOptimalNewCameraMatrix", {
		make_param<IOArray*>("cameraMatrix","IOArray"),
		make_param<IOArray*>("distCoeffs","IOArray"),
		make_param<Size*>("imageSize",Size::name),
		make_param<double>("alpha","double"),
		make_param<Size*>("newImgSize",Size::name, Size::Empty()),
		make_param<std::shared_ptr<or::Callback>>("cb","Function"),// ? : (validPixROI : _types.Rect) = > void,
		make_param<bool>("centerPrincipalPoint","bool",false)
  }, getOptimalNewCameraMatrix);
  Nan::SetMethod(target, "getOptimalNewCameraMatrix", calib3d_general_callback::callback);


  overload->addOverload("calib3d", "", "convertPointsToHomogeneous", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray")
  }, convertPointsToHomogeneous);
  Nan::SetMethod(target, "convertPointsToHomogeneous", calib3d_general_callback::callback);

  overload->addOverload("calib3d", "", "convertPointsFromHomogeneous", {
	  make_param<IOArray*>("src","IOArray"),
	  make_param<IOArray*>("dst","IOArray")
  }, convertPointsFromHomogeneous);
  Nan::SetMethod(target, "convertPointsFromHomogeneous", calib3d_general_callback::callback);


  overload->addOverload("calib3d", "", "convertPointsHomogeneous", {
	  make_param<IOArray*>("src","IOArray"),
	  make_param<IOArray*>("dst","IOArray")
  }, convertPointsHomogeneous);
  Nan::SetMethod(target, "convertPointsHomogeneous", calib3d_general_callback::callback);


  overload->addOverload("calib3d", "", "findFundamentalMat", {
	make_param<IOArray*>("points1","IOArray"),
	make_param<IOArray*>("points2","IOArray"),
	make_param<IOArray*>("mask","IOArray"),
	make_param<int>("method","FundMatrixAlgo",cv::FM_RANSAC),
	  make_param<double>("param1","double",3.0),
	  make_param<double>("param2","double",0.99)
  }, findFundamentalMat_a);
  Nan::SetMethod(target, "findFundamentalMat", calib3d_general_callback::callback);

  overload->addOverload("calib3d", "", "findFundamentalMat", {
	  make_param<IOArray*>("points1","IOArray"),
	  make_param<IOArray*>("points2","IOArray"),
	  make_param<int>("method","FundMatrixAlgo",cv::FM_RANSAC),
	  make_param<double>("param1","double",3.0),
	  make_param<double>("param2","double",0.99),
	  make_param<IOArray*>("mask","IOArray",IOArray::noArray())
  }, findFundamentalMat_b);

  
  overload->addOverload("calib3d", "", "findEssentialMat", {
	  make_param<IOArray*>("points1","IOArray"),
		make_param<IOArray*>("points2","IOArray"),
		make_param<double>("focal","double",1.0),
		make_param<Point2d*>("pp","Point2d",Point2d::create(0, 0)),
		make_param<int>("method","int",cv::RANSAC),
		make_param<double>("prob","double", 0.999),
		make_param<double>("threshold","double",1.0),
		make_param<IOArray*>("mask","IOArray",IOArray::noArray())
  }, findEssentialMat_a);
  Nan::SetMethod(target, "findEssentialMat", calib3d_general_callback::callback);

  overload->addOverload("calib3d", "", "findEssentialMat", {
		make_param<IOArray*>("points1","IOArray"), 
		make_param<IOArray*>("points2","IOArray"),
		make_param<IOArray*>("cameraMatrix","IOArray"),
		make_param<int>("method","int",cv::RANSAC),
		make_param<double>("prob","double", 0.999),
		make_param<double>("threshold","double", 1.0),
		make_param<IOArray*>("mask","IOArray",IOArray::noArray())
  }, findEssentialMat_b);

  overload->addOverload("calib3d", "", "decomposeEssentialMat", {
		make_param<IOArray*>("E","IOArray"),
		make_param<IOArray*>("R1","IOArray"), 
		make_param<IOArray*>("R2","IOArray"),
		make_param<IOArray*>("t","IOArray")
  }, decomposeEssentialMat);
  Nan::SetMethod(target, "decomposeEssentialMat", calib3d_general_callback::callback);



  overload->addOverload("calib3d", "", "recoverPose", {
		make_param<IOArray*>("E","IOArray"),
		make_param<IOArray*>("points1","IOArray"),
		make_param<IOArray*>("points2","IOArray"),
		make_param<IOArray*>("R","IOArray"),
		make_param<IOArray*>("t","IOArray"),
		make_param<double>("focal","double", 1.0),
		make_param<Point2d*>("pp","Point2d",Point2d::create(0, 0)),
		make_param<IOArray*>("mask","IOArray",IOArray::noArray())
  }, recoverPose_a);
  Nan::SetMethod(target, "recoverPose", calib3d_general_callback::callback);

  overload->addOverload("calib3d", "", "recoverPose", {
		make_param<IOArray*>("E","IOArray"),
		make_param<IOArray*>("points1","IOArray"), 
		make_param<IOArray*>("points2","IOArray"),
		make_param<IOArray*>("cameraMatrix","IOArray"),
		make_param<IOArray*>("R","IOArray"),
		make_param<IOArray*>("t","IOArray"),
		make_param<IOArray*>("mask","IOArray",IOArray::noArray())						
  }, recoverPose_b);

  overload->addOverload("calib3d", "", "computeCorrespondEpilines", {
		make_param<IOArray*>("points","IOArray"),
		make_param<int>("whichImage","int"),
		make_param<IOArray*>("F","IOArray"),
		make_param<IOArray*>("lines","IOArray"),
  }, computeCorrespondEpilines);
  Nan::SetMethod(target, "computeCorrespondEpilines", calib3d_general_callback::callback);

  overload->addOverload("calib3d", "", "triangulatePoints", {
		make_param<IOArray*>("projMatr1","IOArray"), 
		make_param<IOArray*>("projMatr2","IOArray"),
		make_param<IOArray*>("projPoints1","IOArray"), 
		make_param<IOArray*>("projPoints2","IOArray"),
		make_param<IOArray*>("points4D","IOArray")
  }, triangulatePoints);
  Nan::SetMethod(target, "triangulatePoints", calib3d_general_callback::callback);



  overload->addOverload("calib3d", "", "correctMatches", {
		make_param<IOArray*>("F","IOArray"),
		make_param<IOArray*>("points1","IOArray"), 
		make_param<IOArray*>("points2","IOArray"),
		make_param<IOArray*>("newPoints1","IOArray"), 
		make_param<IOArray*>("newPoints2","IOArray")
  }, correctMatches);
  Nan::SetMethod(target, "correctMatches", calib3d_general_callback::callback);



  overload->addOverload("calib3d", "", "filterSpeckles", {
		make_param<IOArray*>("img","IOArray"),
		make_param<double>("newVal","double"),
		make_param<int>("maxSpeckleSize","int"),
		make_param<double>("maxDiff","double"),
		make_param<IOArray*>("buf","IOArray",IOArray::noArray())   
  }, filterSpeckles);
  Nan::SetMethod(target, "filterSpeckles", calib3d_general_callback::callback);



  overload->addOverload("calib3d", "", "getValidDisparityROI", {
		make_param<Rect<cv::Rect>*>("roi1",Rect<cv::Rect>::name),
		make_param<Rect<cv::Rect>*>("roi2",Rect<cv::Rect>::name),
		make_param<int>("minDisparity","int"),
		make_param<int>("numberOfDisparities","int"),
		make_param<int>("SADWindowSize","int")
  }, getValidDisparityROI);
  Nan::SetMethod(target, "getValidDisparityROI", calib3d_general_callback::callback);


  
  overload->addOverload("calib3d", "", "validateDisparity", {
		make_param<IOArray*>("disparity","IOArray"),
		make_param<IOArray*>("cost","IOArray"),
		make_param<int>("minDisparity","int"),
		make_param<int>("numberOfDisparities","int"),
		make_param<int>("disp12MaxDisp","int",1)
  }, validateDisparity);
  Nan::SetMethod(target, "validateDisparity", calib3d_general_callback::callback);



  overload->addOverload("calib3d", "", "reprojectImageTo3D", {
		make_param<IOArray*>("disparity","IOArray"),
		make_param<IOArray*>("_3dImage","IOArray"),
		make_param<IOArray*>("Q","IOArray"),
		make_param<bool>("handleMissingValues","bool",false),
		make_param<int>("ddepth","int", -1)  
  }, reprojectImageTo3D);
  Nan::SetMethod(target, "reprojectImageTo3D", calib3d_general_callback::callback);



  overload->addOverload("calib3d", "", "sampsonDistance", {
		make_param<IOArray*>("pt1","IOArray"),
		make_param<IOArray*>("pt2","IOArray"),
		make_param<IOArray*>("F","IOArray")
  }, sampsonDistance);
  Nan::SetMethod(target, "sampsonDistance", calib3d_general_callback::callback);



  overload->addOverload("calib3d", "", "estimateAffine3D", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<IOArray*>("out","IOArray"), 
		make_param<IOArray*>("inliers","IOArray"),
		make_param<double>("ransacThreshold","double", 3),
		make_param<double>("confidence","double", 0.99)
  }, estimateAffine3D);
  Nan::SetMethod(target, "estimateAffine3D", calib3d_general_callback::callback);



  overload->addOverload("calib3d", "", "decomposeHomographyMat", {
		make_param<IOArray*>("H","IOArray"),
		make_param<IOArray*>("K","IOArray"),
		make_param<IOArray*>("rotations","IOArray"),
		make_param<IOArray*>("translations","IOArray"),
		make_param<IOArray*>("normals","IOArray"),
  }, decomposeHomographyMat);
  Nan::SetMethod(target, "decomposeHomographyMat", calib3d_general_callback::callback);

  StereoMatcher::Init(target, overload);
  StereoBM::Init(target, overload);
  StereoSGBM::Init(target, overload);
  //! @} calib3d


  auto fisheye_ns = Nan::New<v8::Object>();
  target->Set(Nan::New("fisheye").ToLocalChecked(), fisheye_ns);
  fisheye::Init(fisheye_ns, overload);
  




}

  POLY_METHOD(calib3d::Rodrigues) {
	  auto src = info.at<IOArray*>(0)->GetInputArray();
	  auto dst = info.at<IOArray*>(1)->GetOutputArray();
	  auto jacobian = info.at<IOArray*>(2)->GetOutputArray();

	  cv::Rodrigues(src, dst, jacobian);
  }

  POLY_METHOD(calib3d::findHomography_adv) {
	  auto srcPoints = info.at<IOArray*>(0)->GetInputArray();
	  auto dstPoints = info.at<IOArray*>(1)->GetInputArray();
	  auto method = info.at<int>(2);
	  auto ransacReprojThreshold = info.at<double>(3);
	  auto mask = info.at<IOArray*>(4)->GetOutputArray();
	  auto maxIters = info.at<int>(5);
	  auto confidence = info.at<double>(6);

	  auto ret = new Matrix();
	  ret->_mat = std::make_shared<cv::Mat>(cv::findHomography(srcPoints, dstPoints, method, ransacReprojThreshold, mask, maxIters, confidence));

	  info.SetReturnValue(ret);
  }

  POLY_METHOD(calib3d::findHomography) {
	  auto srcPoints = info.at<IOArray*>(0)->GetInputArray();
	  auto dstPoints = info.at<IOArray*>(1)->GetInputArray();
	  auto mask = info.at<IOArray*>(2)->GetOutputArray();
	  auto method = info.at<int>(3);
	  auto ransacReprojThreshold = info.at<double>(4);

	  auto ret = new Matrix();
	  ret->_mat = std::make_shared<cv::Mat>(cv::findHomography(srcPoints, dstPoints, mask, method, ransacReprojThreshold));

	  info.SetReturnValue(ret);
  }

  POLY_METHOD(calib3d::RQDecomp3x3) {
	  auto src = info.at<IOArray*>(0)->GetInputArray();
	  auto mtxR = info.at<IOArray*>(1)->GetOutputArray();
	  auto mtxQ = info.at<IOArray*>(2)->GetOutputArray();
	  auto Qx = info.at<IOArray*>(3)->GetOutputArray();
	  auto Qy = info.at<IOArray*>(4)->GetOutputArray();
	  auto Qz = info.at<IOArray*>(5)->GetOutputArray();
	  
	  auto vec = new Vec<cv::Vec3d>();
	  vec->_vec = std::make_shared<cv::Vec3d>(cv::RQDecomp3x3(src, mtxR, mtxQ, Qx, Qy, Qz));

	  info.SetReturnValue(vec);
  }

  POLY_METHOD(calib3d::decomposeProjectionMatrix) {
	  auto projMatrix = info.at<IOArray*>(0)->GetInputArray();
	  auto cameraMatrix = info.at<IOArray*>(1)->GetOutputArray();
	  auto rotMatrix = info.at<IOArray*>(2)->GetOutputArray();
	  auto transVect = info.at<IOArray*>(3)->GetOutputArray();
	  auto rotMatrixX = info.at<IOArray*>(4)->GetOutputArray();
	  auto rotMatrixY = info.at<IOArray*>(5)->GetOutputArray();
	  auto rotMatrixZ = info.at<IOArray*>(6)->GetOutputArray();
	  auto eulerAngles = info.at<IOArray*>(7)->GetOutputArray();
	  cv::decomposeProjectionMatrix(projMatrix, cameraMatrix, rotMatrix, transVect, rotMatrixX, rotMatrixY, rotMatrixZ, eulerAngles);
  }

  POLY_METHOD(calib3d::matMulDeriv) {
	  auto      A = info.at<IOArray*>(0)->GetInputArray();
	  auto	    B = info.at<IOArray*>(1)->GetInputArray();
	  auto	dABdA = info.at<IOArray*>(2)->GetOutputArray();
	  auto  dABdB = info.at<IOArray*>(3)->GetOutputArray();
	  cv::matMulDeriv(A, B, dABdA, dABdB);
  }

  POLY_METHOD(calib3d::composeRT) {
	  auto rvec1 = info.at<IOArray*>(0)->GetInputArray();
	  auto tvec1 = info.at<IOArray*>(1)->GetInputArray();
	  auto rvec2 = info.at<IOArray*>(2)->GetInputArray();
	  auto tvec2 = info.at<IOArray*>(3)->GetInputArray();
	  auto rvec3 = info.at<IOArray*>(4)->GetOutputArray();
	  auto tvec3 = info.at<IOArray*>(5)->GetOutputArray();
	  auto dr3dr1 = info.at<IOArray*>(6)->GetOutputArray();
	  auto dr3dt1 = info.at<IOArray*>(7)->GetOutputArray();
	  auto dr3dr2 = info.at<IOArray*>(8)->GetOutputArray();
	  auto dr3dt2 = info.at<IOArray*>(9)->GetOutputArray();
	  auto dt3dr1 = info.at<IOArray*>(10)->GetOutputArray();
	  auto dt3dt1 = info.at<IOArray*>(11)->GetOutputArray();
	  auto dt3dr2 = info.at<IOArray*>(12)->GetOutputArray();
	  auto dt3dt2 = info.at<IOArray*>(13)->GetOutputArray();

	  cv::composeRT(rvec1,
		  tvec1,
		  rvec2,
		  tvec2,
		  rvec3,
		  tvec3,
		  dr3dr1,
		  dr3dt1,
		  dr3dr2,
		  dr3dt2,
		  dt3dr1,
		  dt3dt1,
		  dt3dr2,
		  dt3dt2);
  }

  POLY_METHOD(calib3d::projectPoints) {
	  auto objectPoints = info.at<IOArray*>(0)->GetInputArray();
	  auto rvec =		  info.at<IOArray*>(1)->GetInputArray();
	  auto tvec =		  info.at<IOArray*>(2)->GetInputArray();
	  auto cameraMatrix = info.at<IOArray*>(3)->GetInputArray();
	  auto distCoeffs =   info.at<IOArray*>(4)->GetInputArray();
	  auto imagePoints =  info.at<IOArray*>(5)->GetOutputArray();
	  auto jacobian =     info.at<IOArray*>(6)->GetOutputArray();
	  auto aspectRatio =  info.at<double>(7);
	  cv::projectPoints(
		  objectPoints,
		  rvec,
		  tvec,
		  cameraMatrix,
		  distCoeffs,
		  imagePoints,
		  jacobian,
		  aspectRatio
	  );
  }

  POLY_METHOD(calib3d::solvePnP) {
	  auto objectPoints = info.at<IOArray*>(0)->GetInputArray();
	  auto imagePoints = info.at<IOArray*>(1)->GetInputArray();
	  auto cameraMatrix = info.at<IOArray*>(2)->GetInputArray();
	  auto distCoeffs = info.at<IOArray*>(3)->GetInputArray();
	  auto rvec = info.at<IOArray*>(4)->GetOutputArray();
	  auto tvec = info.at<IOArray*>(5)->GetOutputArray();
	  auto useExtrinsicGuess = info.at<bool>(6);
	  auto flags = info.at<int>(7);

	  auto res = cv::solvePnP(
		  objectPoints,
		  imagePoints,
		  cameraMatrix,
		  distCoeffs,
		  rvec,
		  tvec,
		  useExtrinsicGuess,
		  flags);
	  info.SetReturnValue(res);
  }

  POLY_METHOD(calib3d::solvePnPRansac) {
	  auto objectPoints = info.at<IOArray*>(0)->GetInputArray();
	  auto imagePoints = info.at<IOArray*>(1)->GetInputArray();
	  auto cameraMatrix = info.at<IOArray*>(2)->GetInputArray();
	  auto distCoeffs = info.at<IOArray*>(3)->GetInputArray();
	  auto rvec = info.at<IOArray*>(4)->GetOutputArray();
	  auto tvec = info.at<IOArray*>(5)->GetOutputArray();
	  auto useExtrinsicGuess = info.at < bool>(6);
	  auto iterationsCount = info.at<int>(7);
	  auto reprojectionError = info.at<float>(8);
	  auto confidence = info.at<double>(9);
	  auto inliers = info.at<IOArray*>(10)->GetOutputArray();
	  auto flags = info.at<int>(11);

	  auto res = cv::solvePnPRansac(
		  objectPoints,
		  imagePoints,
		  cameraMatrix,
		  distCoeffs,
		  rvec,
		  tvec,
		  useExtrinsicGuess,
		  iterationsCount,
		  reprojectionError,
		  confidence,
		  inliers,
		  flags);
	  info.SetReturnValue(res);
  }

  POLY_METHOD(calib3d::initCameraMatrix2D) {
	  auto objectPoints = info.at<IOArray*>(0)->GetInputArrayOfArrays();
	  auto imagePoints = info.at<IOArray*>(1)->GetInputArrayOfArrays();
	  auto imageSize = info.at<Size*>(2);
	  auto aspectRatio = info.at<double>(3);

	  auto ret = cv::initCameraMatrix2D(
		  objectPoints,
		  imagePoints,
		  *imageSize->_size,
		  aspectRatio);

	  auto mat = new Matrix();
	  mat->_mat = std::make_shared<cv::Mat>(ret);
	  info.SetReturnValue(mat);
  }


  POLY_METHOD(calib3d::findChessboardCorners) {
	  auto image = info.at<IOArray*>(0)->GetInputArray();
	  auto patternSize = info.at<Size*>(1);
	  auto corners = info.at<IOArray*>(2)->GetOutputArray();
	  auto flags = info.at<int>(3);
	  auto ret = cv::findChessboardCorners(
		  image,
		  *patternSize->_size,
		  corners,
		  flags
	  );
	  info.SetReturnValue(ret);
  }


  POLY_METHOD(calib3d::find4QuadCornerSubpix) {
	  auto img = info.at<IOArray*>(0)->GetInputArray();
	  auto corners = info.at<IOArray*>(1)->GetInputOutputArray();
	  auto region_size = info.at<Size*>(2)->_size;

	  auto res = cv::find4QuadCornerSubpix(
		  img,
		  corners,
		  *region_size
	  );

	  info.SetReturnValue(res);
  }

  POLY_METHOD(calib3d::drawChessboardCorners) {
	  auto image = info.at<IOArray*>(0)->GetInputOutputArray();
	  auto patternSize = info.at<Size*>(1)->_size;
	  auto corners = info.at<IOArray*>(2)->GetInputArray();
	  auto patternWasFound = info.at<bool>(3);

	  cv::drawChessboardCorners(
		  image,
		  *patternSize,
		  corners,
		  patternWasFound
	  );

  }

  POLY_METHOD(calib3d::findCirclesGrid) {
	  auto image = info.at<IOArray*>(0)->GetInputArray();
	  auto patternSize = info.at<Size*>(1)->_size;
	  auto centers = info.at<IOArray*>(2)->GetOutputArray();
	  auto flags = info.at<int>(3);
	  auto blobDetector = info.at<FeatureDetector*>(4)->_algorithm;

	  auto ret = cv::findCirclesGrid(
		  image,
		  *patternSize,
		  centers,
		  flags,
		   blobDetector.dynamicCast<cv::FeatureDetector>()
	  );
	  info.SetReturnValue(ret);
  }


  POLY_METHOD(calib3d::calibrateCamera) {
	  auto objectPoints = info.at<IOArray*>(0)->GetInputArrayOfArrays();
	  auto imagePoints = info.at<IOArray*>(1)->GetInputArrayOfArrays();
	  auto imageSize = info.at<Size*>(2)->_size;
	  auto cameraMatrix = info.at<IOArray*>(3)->GetInputOutputArray();
	  auto distCoeffs = info.at<IOArray*>(4)->GetInputOutputArray();
	  auto rvecs = info.at<IOArray*>(5)->GetOutputArrayOfArrays();
	  auto tvecs = info.at<IOArray*>(6)->GetOutputArrayOfArrays();
	  auto flags = info.at<int>(7);
	  auto criteria = info.at<TermCriteria*>(8)->_termCriteria;

	  auto ret = cv::calibrateCamera(
		  objectPoints,
		  imagePoints,
		  *imageSize,
		  cameraMatrix,
		  distCoeffs,
		  rvecs,
		  tvecs,
		  flags,
		  *criteria
	  );
	  info.SetReturnValue(ret);
  }

  POLY_METHOD(calib3d::calibrationMatrixValues) {
		auto cameraMatrix	= info.at<IOArray*>(0)->GetInputArray();
		auto imageSize		= info.at<Size*>(1)->_size;
		auto apertureWidth	= info.at<double>(2); 
		auto apertureHeight = info.at<double>(3);
		auto cb  = info.at<std::shared_ptr<or::Callback>>(4); //(fovx : _st.double, fovy : _st.double, focalLength : _st.double, principalPoint : _types.Point2d, aspectRatio : _st.double) = >void

		double fovx;
		double fovy;
		double focalLength;
		cv::Point2d principalPoint;
		double aspectRatio;

		cv::calibrationMatrixValues(cameraMatrix, *imageSize, apertureWidth, apertureHeight, fovx, fovy, focalLength, principalPoint, aspectRatio);

		auto principal_point = new Point2d();
		principal_point->_point = std::make_shared<cv::Point2d>(principalPoint);

		cb->Call({ or ::make_value(fovx), or::make_value(fovy), or::make_value(focalLength), or::make_value(principal_point), or::make_value(aspectRatio) });
  }

  POLY_METHOD(calib3d::stereoCalibrate) {
	  auto objectPoints		= info.at<IOArray*>(0)->GetInputArrayOfArrays();
	  auto imagePoints1		= info.at<IOArray*>(1)->GetInputArrayOfArrays(); 
	  auto imagePoints2		= info.at<IOArray*>(2)->GetInputArrayOfArrays();
	  auto cameraMatrix1	= info.at<IOArray*>(3)->GetInputOutputArray()  ;
	  auto distCoeffs1		= info.at<IOArray*>(4)->GetInputOutputArray()  ;
	  auto cameraMatrix2	= info.at<IOArray*>(5)->GetInputOutputArray()  ;
	  auto distCoeffs2		= info.at<IOArray*>(6)->GetInputOutputArray()  ;
	  auto imageSize		= info.at<Size*>(7)->_size;
	  auto R				= info.at<IOArray*>(8)->GetOutputArray(); 
	  auto T				= info.at<IOArray*>(9)->GetOutputArray(); 
	  auto E				= info.at<IOArray*>(10)->GetOutputArray(); 
	  auto F				= info.at<IOArray*>(11)->GetOutputArray();
	  auto flags 			= info.at<int>(12);
	  auto criteria 		= info.at<TermCriteria*>(13)->_termCriteria;

	  auto ret = cv::stereoCalibrate(
		  objectPoints,
		  imagePoints1,
		  imagePoints2,
		  cameraMatrix1,
		  distCoeffs1,
		  cameraMatrix2,
		  distCoeffs2,
		  *imageSize,
		  R,
		  T,
		  E,
		  F,
		  flags,
		  *criteria);

	  info.SetReturnValue(ret);
  }

  POLY_METHOD(calib3d::stereoRectify) {
		auto cameraMatrix1		= info.at<IOArray*>(0)->GetInputArray(); 
		auto distCoeffs1		= info.at<IOArray*>(1)->GetInputArray();
		auto cameraMatrix2		= info.at<IOArray*>(2)->GetInputArray(); 
		auto distCoeffs2		= info.at<IOArray*>(3)->GetInputArray();
		auto imageSize			= info.at<Size*>(4)->_size;
		auto R					= info.at<IOArray*>(5)->GetInputArray();
		auto T					= info.at<IOArray*>(6)->GetInputArray();
		auto R1					= info.at<IOArray*>(7)->GetOutputArray();
		auto R2					= info.at<IOArray*>(8)->GetOutputArray();
		auto P1					= info.at<IOArray*>(9)->GetOutputArray();
		auto P2					= info.at<IOArray*>(10)->GetOutputArray();
		auto Q					= info.at<IOArray*>(11)->GetOutputArray();
		auto flags				= info.at<int>(12);
		auto alpha				= info.at<double>(13);
		auto newImageSize		= info.at<Size*>(14)->_size;
		auto cb 				= info.at<std::shared_ptr<or::Callback>>(15);// (validPixROI1 : _types.Rect, validPixROI2 : _types.Rect) = > void) : void;

		cv::Rect validPixROI1;
		cv::Rect validPixROI2;

		cv::stereoRectify(cameraMatrix1, distCoeffs1,
			cameraMatrix2, distCoeffs2,
			*imageSize, R, T,
			R1, R2,
			P1, P2,
			Q, flags,
			alpha, *newImageSize,
			&validPixROI1, &validPixROI2);

		auto rect1 = new Rect<cv::Rect>();
		rect1->_rect = std::make_shared<cv::Rect>(validPixROI1);

		auto rect2 = new Rect<cv::Rect>();
		rect2->_rect = std::make_shared<cv::Rect>(validPixROI2);

		cb->Call({or::make_value(rect1), or::make_value(rect2)});
  }

  POLY_METHOD(calib3d::stereoRectifyUncalibrated) {
	  auto points1 = info.at<IOArray*>(0)->GetInputArray();
	  auto points2 = info.at<IOArray*>(1)->GetInputArray();
	  auto F = info.at<IOArray*>(2)->GetInputArray();
	  auto imgSize = info.at<Size*>(3)->_size;
	  auto H1 = info.at<IOArray*>(4)->GetOutputArray();
	  auto H2 = info.at<IOArray*>(5)->GetOutputArray();
	  auto threshold = info.at<double>(6);

	  auto ret = cv::stereoRectifyUncalibrated(
		  points1,
		  points2,
		  F,
		  *imgSize,
		  H1,
		  H2,
		  threshold);

	  info.SetReturnValue(ret);
  }

  POLY_METHOD(calib3d::rectify3Collinear) {
		auto cameraMatrix1		= info.at<IOArray*>(0)->GetInputArray(); 
		auto distCoeffs1		= info.at<IOArray*>(1)->GetInputArray();
		auto cameraMatrix2		= info.at<IOArray*>(2)->GetInputArray();
		auto distCoeffs2		= info.at<IOArray*>(3)->GetInputArray();
		auto cameraMatrix3		= info.at<IOArray*>(4)->GetInputArray(); 
		auto distCoeffs3		= info.at<IOArray*>(5)->GetInputArray();
		auto imgpt1				= info.at<IOArray*>(6)->GetInputArrayOfArrays();
		auto imgpt3				= info.at<IOArray*>(7)->GetInputArrayOfArrays();
		auto imageSize			= info.at<Size*>(8)->_size;
		auto R12				= info.at<IOArray*>(9)->GetInputArray(); 
		auto T12				= info.at<IOArray*>(10)->GetInputArray();
		auto R13				= info.at<IOArray*>(11)->GetInputArray(); 
		auto T13				= info.at<IOArray*>(12)->GetInputArray();
		auto R1					= info.at<IOArray*>(13)->GetOutputArray(); 
		auto R2					= info.at<IOArray*>(14)->GetOutputArray();
		auto R3					= info.at<IOArray*>(15)->GetOutputArray();
		auto P1					= info.at<IOArray*>(16)->GetOutputArray();
		auto P2					= info.at<IOArray*>(17)->GetOutputArray(); 
		auto P3					= info.at<IOArray*>(18)->GetOutputArray();
		auto Q					= info.at<IOArray*>(19)->GetOutputArray(); 
		auto alpha				= info.at<double>(20);
		auto newImgSize			= info.at<Size*>(21)->_size;
		auto cb					= info.at<std::shared_ptr<or::Callback>>(22);// (roi1 : _types.Rect, roi2 : _types.Rect) = > void, 
		auto flags				= info.at<int>(23);
		
		cv::Rect cvroi1;
		cv::Rect cvroi2;

		auto res = cv::rectify3Collinear(
			 cameraMatrix1, distCoeffs1,
			cameraMatrix2, distCoeffs2,
			cameraMatrix3, distCoeffs3,
			imgpt1, imgpt3,
			*imageSize,R12, T12,
			R13, T13,
			R1, R2, R3,
			P1, P2, P3,
			Q, alpha, *newImgSize,
			&cvroi1, &cvroi2, flags);

		auto roi1 = new Rect<cv::Rect>();
		roi1->_rect = std::make_shared<cv::Rect>(cvroi1);
		auto roi2 = new Rect<cv::Rect>();
		roi2->_rect = std::make_shared<cv::Rect>(cvroi2);

		cb->Call({make_value(roi1), make_value(roi2)});

		info.SetReturnValue(res);
  }

  POLY_METHOD(calib3d::getOptimalNewCameraMatrix) {
	  throw std::exception("not implemented");

	  //auto cameraMatrix = info.at<IOArray*>(0)->GetInputArray();
	  //auto distCoeffs = info.at<IOArray*>(1)->GetInputArray();
		//  auto imageSize = info.at<Size*>(2)->_size;
	  //auto alpha = info.at<double>(3);
	  //auto newImgSize = info.at<Size*>(4)->_size;
	  //auto cb = info.at<std::shared_ptr< or ::Callback>>(5);// (validPixROI : _types.Rect) = > void,
	  //auto centerPrincipalPoint = info.at<bool>(6);
	  //
	  ///*auto ret = cv::getOptimalNewCameraMatrix(
		//  cameraMatrix,
		//  distCoeffs,
		//  *imageSize,
		//  alpha,
		//  *newImgSize,
		//  cb,
		//  centerPrincipalPoint);*/
	  //
	  //auto mat = new Matrix();
	  //mat->_mat = std::make_shared<cv::Mat>(ret);
	  //
	  //info.SetReturnValue(mat);
  }

  POLY_METHOD(calib3d::convertPointsToHomogeneous) {
	  auto src = info.at<IOArray*>(0)->GetInputArray();
	  auto dst = info.at<IOArray*>(1)->GetOutputArray();

	  cv::convertPointsToHomogeneous(src, dst);
  }

  POLY_METHOD(calib3d::convertPointsFromHomogeneous) {
	  auto src = info.at<IOArray*>(0)->GetInputArray();
	  auto dst = info.at<IOArray*>(1)->GetOutputArray();

	  cv::convertPointsFromHomogeneous(src, dst);
  }

  POLY_METHOD(calib3d::convertPointsHomogeneous) {
	  auto src = info.at<IOArray*>(0)->GetInputArray();
	  auto dst = info.at<IOArray*>(1)->GetOutputArray();

	  cv::convertPointsHomogeneous(src, dst);
  }

  POLY_METHOD(calib3d::findFundamentalMat_a) {
	  auto points1 = info.at<IOArray*>(0)->GetInputArray();
	  auto points2 = info.at<IOArray*>(1)->GetInputArray();
	  auto mask = info.at<IOArray*>(2)->GetOutputArray();
	  auto method = info.at<int>(3);
	  auto param1 = info.at<double>(4);
	  auto param2 = info.at<double>(5);

	  auto ret = cv::findFundamentalMat(points1, points2, mask, method, param1, param2);

	  auto mat_ret = new Matrix();
	  mat_ret->_mat = std::make_shared<cv::Mat>(ret);

	  info.SetReturnValue(mat_ret);
  }

  POLY_METHOD(calib3d::findFundamentalMat_b) {
	  auto points1 = info.at<IOArray*>(0)->GetInputArray();
	  auto points2 = info.at<IOArray*>(1)->GetInputArray();
	  auto method  = info.at<int>(2);
	  auto param1  = info.at<double>(3);
	  auto param2  = info.at<double>(4);
	  auto mask    = info.at<IOArray*>(5)->GetOutputArray();

	  auto ret = cv::findFundamentalMat(
		  points1,
		  points2,
		  method,
		  param1,
		  param2,
		  mask
	  );

	  auto mat_ret = new Matrix();
	  mat_ret->_mat = std::make_shared<cv::Mat>(ret);

	  info.SetReturnValue(mat_ret);
  }


  POLY_METHOD(calib3d::findEssentialMat_a) {
	auto points1		= info.at<IOArray*>(0)->GetInputArray(); 
	auto points2		= info.at<IOArray*>(1)->GetInputArray();
	auto focal 		= info.at<double>(2);
	auto pp = info.at<Point2d*>(3)->_point;
	auto method 		= info.at<int>(4);
	auto prob 			= info.at<double>(5);
	auto threshold 	= info.at<double>(6);
	auto mask 			= info.at<IOArray*>(7)->GetOutputArray();
	  
	auto ret = cv::findEssentialMat(
		points1		,
		points2		,
		focal		,
		*pp			,
		method		,
		prob		,
		threshold	,
		mask);

	auto mat_ret = new Matrix();
	mat_ret->_mat = std::make_shared<cv::Mat>(ret);

	info.SetReturnValue(mat_ret);
  }

  POLY_METHOD(calib3d::findEssentialMat_b) {
		  auto points1		= info.at<IOArray*>(0)->GetInputArray();
		  auto points2		= info.at<IOArray*>(1)->GetInputArray();
		  auto cameraMatrix = info.at<IOArray*>(2)->GetInputArray();
		  auto method 		= info.at<int>(3) ;
		  auto prob			= info.at<double>(4);
		  auto threshold	= info.at<double>(5);
		  auto mask			= info.at<IOArray*>(6)->GetOutputArray();
		  
		  auto ret = cv::findEssentialMat(
			  points1		,
			  points2		,
			  cameraMatrix	,
			  method		,
			  prob			,
			  threshold		,
			  mask);

		  auto mat_ret = new Matrix();
		  mat_ret->_mat = std::make_shared<cv::Mat>(ret);

		  info.SetReturnValue(mat_ret);
  }

  POLY_METHOD(calib3d::decomposeEssentialMat) {
		auto E	= info.at<IOArray*>(0)->GetInputArray();
		auto R1 = info.at<IOArray*>(1)->GetOutputArray();
		auto R2 = info.at<IOArray*>(2)->GetOutputArray();
		auto t	= info.at<IOArray*>(3)->GetOutputArray();

		cv::decomposeEssentialMat(E, R1, R2, t);
  }


  POLY_METHOD(calib3d::recoverPose_a){
		auto E			= info.at<IOArray*>(0)->GetInputArray(); 
		auto points1	= info.at<IOArray*>(1)->GetInputArray(); 
		auto points2	= info.at<IOArray*>(2)->GetInputArray();
		auto R			= info.at<IOArray*>(3)->GetOutputArray(); 
		auto t			= info.at<IOArray*>(4)->GetOutputArray();
		auto focal		= info.at<double>(5);
		auto pp = info.at<Point2d*>(6)->_point;
		auto mask		= info.at<IOArray*>(7)->GetInputOutputArray();
		  
		auto ret = cv::recoverPose(
			E			,
			points1		,
			points2		,
			R			,
			t			,
			focal		,
			*pp			,
			mask);

		info.SetReturnValue(ret);
  }

  POLY_METHOD(calib3d::recoverPose_b){
		auto E				= info.at<IOArray*>(0)->GetInputArray();
		auto points1		= info.at<IOArray*>(1)->GetInputArray();
		auto points2		= info.at<IOArray*>(2)->GetInputArray();
		auto cameraMatrix	= info.at<IOArray*>(3)->GetInputArray();
		auto R				= info.at<IOArray*>(4)->GetOutputArray();
		auto t				= info.at<IOArray*>(5)->GetOutputArray();
		auto mask			= info.at<IOArray*>(6)->GetInputOutputArray();
	  
		auto ret = cv::recoverPose(
			E				,
			points1			,
			points2			,
			cameraMatrix	,
			R				,
			t				,
			mask);
	  
		info.SetReturnValue(ret);
  }


  POLY_METHOD(calib3d::computeCorrespondEpilines) {
	auto	points		= info.at<IOArray*>(0)->GetInputArray();
	auto	whichImage	= info.at<int>(1);
	auto	F			= info.at<IOArray*>(2)->GetInputArray();
	auto	lines		= info.at<IOArray*>(3)->GetOutputArray();

	cv::computeCorrespondEpilines(
		points			,
		whichImage		,
		F				,
		lines);

  }

  POLY_METHOD(calib3d::triangulatePoints) {
	auto projMatr1		=info.at<IOArray*>(0)->GetInputArray();
	auto projMatr2		=info.at<IOArray*>(1)->GetInputArray();
	auto projPoints1	=info.at<IOArray*>(2)->GetInputArray();
	auto projPoints2	=info.at<IOArray*>(3)->GetInputArray();
	auto points4D		=info.at<IOArray*>(4)->GetOutputArray();

	cv::triangulatePoints(
		projMatr1,
		projMatr2,
		projPoints1,
		projPoints2,
		points4D);

  }

  POLY_METHOD(calib3d::correctMatches) {
		auto F			= info.at<IOArray*>(0)->GetInputArray();
		auto points1	= info.at<IOArray*>(1)->GetInputArray();
		auto points2	= info.at<IOArray*>(2)->GetInputArray();
		auto newPoints1 = info.at<IOArray*>(3)->GetOutputArray();
		auto newPoints2 = info.at<IOArray*>(4)->GetOutputArray();

		cv::correctMatches(
			F			,
			points1		,
			points2		,
			newPoints1	,
			newPoints2
		
		);
  }

  POLY_METHOD(calib3d::filterSpeckles) {
	auto 	img				= info.at<IOArray*>(0)->GetInputOutputArray();
	auto 	newVal			= info.at<double>(1);
	auto 	maxSpeckleSize	= info.at<int>(2);
	auto 	maxDiff			= info.at<double>(3);
	auto 	buf				= info.at<IOArray*>(4)->GetInputOutputArray();
	
	cv::filterSpeckles(
		img				,
		newVal			,
		maxSpeckleSize	,
		maxDiff			,
		buf);

  }

  POLY_METHOD(calib3d::getValidDisparityROI) {
	auto roi1					= info.at<Rect<cv::Rect>*>(0)->_rect;
	auto roi2					= info.at<Rect<cv::Rect>*>(1)->_rect;
	auto minDisparity			= info.at<int>(2);
	auto numberOfDisparities	= info.at<int>(3);
	auto SADWindowSize			= info.at<int>(4);

	auto ret = cv::getValidDisparityROI(
		*roi1				,
		*roi2				,
		minDisparity		,
		numberOfDisparities	,
		SADWindowSize);

	//ret = Rect
	auto rect_ret = new Rect<cv::Rect>();
	rect_ret->_rect = std::make_shared<cv::Rect>(ret);

	info.SetReturnValue(rect_ret);
	
  }

  POLY_METHOD(calib3d::validateDisparity) {
		auto disparity				= info.at<IOArray*>(0)->GetInputOutputArray();
		auto cost					= info.at<IOArray*>(1)->GetInputArray();
		auto minDisparity			= info.at<int>(2);
		auto numberOfDisparities	= info.at<int>(3);
		auto disp12MaxDisp			= info.at<int>(4);
		  
		cv::validateDisparity(
			disparity				,
			cost					,
			minDisparity			,
			numberOfDisparities		,
			disp12MaxDisp);

  }


  POLY_METHOD(calib3d::reprojectImageTo3D) {
		auto disparity			 = info.at<IOArray*>(0)->GetInputArray();
		auto _3dImage			 = info.at<IOArray*>(1)->GetOutputArray();
		auto Q					 = info.at<IOArray*>(2)->GetInputArray();
		auto handleMissingValues = info.at<bool>(3);
		auto ddepth				 = info.at<int>(4);

		cv::reprojectImageTo3D(
			disparity				,
			_3dImage				,
			Q						,
			handleMissingValues		,
			ddepth);

  }

  POLY_METHOD(calib3d::sampsonDistance) {
		auto pt1	= info.at<IOArray*>(0)->GetInputArray();
		auto pt2	= info.at<IOArray*>(1)->GetInputArray(); 
		auto F		= info.at<IOArray*>(2)->GetInputArray();
	  
		auto ret = cv::sampsonDistance(
			pt1	,
			pt2	,
			F
		);
	  
		info.SetReturnValue(ret);
  }

  POLY_METHOD(calib3d::estimateAffine3D) {
		auto src				= info.at<IOArray*>(0)->GetInputArray(); 
		auto dst				= info.at<IOArray*>(1)->GetInputArray();
		auto out				= info.at<IOArray*>(2)->GetOutputArray(); 
		auto inliers			= info.at<IOArray*>(3)->GetOutputArray();
		auto ransacThreshold 	= info.at<double>(4);
		auto confidence 		= info.at<double>(5);
		  
		auto ret = cv::estimateAffine3D(
			src					,
			dst					,
			out					,
			inliers				,
			ransacThreshold		,
			confidence
		);

		info.SetReturnValue(ret);
  }

  POLY_METHOD(calib3d::decomposeHomographyMat) {
		auto H				= info.at<IOArray*>(0)->GetInputArray();
		auto K				= info.at<IOArray*>(1)->GetInputArray();
		auto rotations		= info.at<IOArray*>(2)->GetOutputArrayOfArrays();
		auto translations	= info.at<IOArray*>(3)->GetOutputArrayOfArrays();
		auto normals		= info.at<IOArray*>(4)->GetOutputArrayOfArrays();
		  
		auto ret = cv::decomposeHomographyMat(
			H				,
			K				,
			rotations		,
			translations	,
			normals);
		  
		info.SetReturnValue(ret);
  }