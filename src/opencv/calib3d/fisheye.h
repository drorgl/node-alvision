#ifndef _ALVISION_FISHEYE_H_
#define _ALVISION_FISHEYE_H_

#include "../../alvision.h"

class fisheye : public or ::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static POLY_METHOD(projectPoints_a);
	static POLY_METHOD(projectPoints_b);
	static POLY_METHOD(distortPoints);
	static POLY_METHOD(undistortPoints);
	static POLY_METHOD(initUndistortRectifyMap);
	static POLY_METHOD(undistortImage);
	static POLY_METHOD(estimateNewCameraMatrixForUndistortRectify);
	static POLY_METHOD(calibrate);
	static POLY_METHOD(stereoRectify);
	static POLY_METHOD(stereoCalibrate);

}

#endif