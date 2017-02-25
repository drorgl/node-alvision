#ifndef _ALVISION_CALIB3D_H_
#define _ALVISION_CALIB3D_H_

#include "../alvision.h"

class calib3d: public overres::ObjectWrap {
 public:
    static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);


	static POLY_METHOD(Rodrigues);
	static POLY_METHOD(findHomography_adv);
	static POLY_METHOD(findHomography);
	static POLY_METHOD(RQDecomp3x3);
	static POLY_METHOD(decomposeProjectionMatrix);
	static POLY_METHOD(matMulDeriv);
	static POLY_METHOD(composeRT);
	static POLY_METHOD(projectPoints);
	static POLY_METHOD(projectPoints_vec_points);
	static POLY_METHOD(solvePnP);
	static POLY_METHOD(solvePnPRansac);
	static POLY_METHOD(initCameraMatrix2D);
	static POLY_METHOD(findChessboardCorners);
	static POLY_METHOD(find4QuadCornerSubpix);
	static POLY_METHOD(drawChessboardCorners);
	static POLY_METHOD(findCirclesGrid);
	static POLY_METHOD(calibrateCamera);
	static POLY_METHOD(calibrationMatrixValues);
	static POLY_METHOD(stereoCalibrate);
	static POLY_METHOD(stereoRectify);
	static POLY_METHOD(stereoRectifyUncalibrated);
	static POLY_METHOD(rectify3Collinear);
	static POLY_METHOD(getOptimalNewCameraMatrix);
	static POLY_METHOD(convertPointsToHomogeneous);
	static POLY_METHOD(convertPointsFromHomogeneous);
	static POLY_METHOD(convertPointsHomogeneous);
	static POLY_METHOD(findFundamentalMat_a);
	static POLY_METHOD(findFundamentalMat_b);
	static POLY_METHOD(findEssentialMat_a);
	static POLY_METHOD(findEssentialMat_b);
	static POLY_METHOD(decomposeEssentialMat);
	static POLY_METHOD(recoverPose_a);
	static POLY_METHOD(recoverPose_b);
	static POLY_METHOD(computeCorrespondEpilines);
	static POLY_METHOD(triangulatePoints);
	static POLY_METHOD(correctMatches);
	static POLY_METHOD(filterSpeckles);
	static POLY_METHOD(getValidDisparityROI);
	static POLY_METHOD(validateDisparity);
	static POLY_METHOD(reprojectImageTo3D);
	static POLY_METHOD(sampsonDistance);
	static POLY_METHOD(estimateAffine3D);
	static POLY_METHOD(decomposeHomographyMat);

};


#endif