#ifndef _ALVISION_TRACKING_H_
#define _ALVISION_TRACKING_H_

#include "../../alvision.h"


class tracking : public overres::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static POLY_METHOD(CamShift);
	static POLY_METHOD(meanShift);
	static POLY_METHOD(buildOpticalFlowPyramid);
	static POLY_METHOD(calcOpticalFlowPyrLK);
	static POLY_METHOD(calcOpticalFlowFarneback);
	static POLY_METHOD(estimateRigidTransform);
	static POLY_METHOD(findTransformECC);

};

#endif