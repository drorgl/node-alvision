#ifndef _ALVISION_FEATURES2D_H_
#define _ALVISION_FEATURES2D_H_
#include "../alvision.h"


class features2d : public or ::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static POLY_METHOD(FAST_a);
	static POLY_METHOD(FAST_b);
	static POLY_METHOD(AGAST_a);
	static POLY_METHOD(AGAST_b);
	static POLY_METHOD(drawKeypoints);
	static POLY_METHOD(drawMatches);
	static POLY_METHOD(drawMatchesKnn);
	static POLY_METHOD(evaluateFeatureDetector);
	static POLY_METHOD(computeRecallPrecisionCurve);
	static POLY_METHOD(getRecall);
	static POLY_METHOD(getNearestPoint);



};

#endif