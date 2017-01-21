#ifndef _ALVISION_GENERALIZEDHOUGHGUIL_H_
#define _ALVISION_GENERALIZEDHOUGHGUIL_H_

#include "../../alvision.h"
#include "GeneralizedHough.h"

class GeneralizedHoughGuil : public GeneralizedHough {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static POLY_METHOD(setXi);
	static POLY_METHOD(getXi);
	static POLY_METHOD(setLevels);
	static POLY_METHOD(getLevels);
	static POLY_METHOD(setAngleEpsilon);
	static POLY_METHOD(getAngleEpsilon);
	static POLY_METHOD(setMinAngle);
	static POLY_METHOD(getMinAngle);
	static POLY_METHOD(setMaxAngle);
	static POLY_METHOD(getMaxAngle);
	static POLY_METHOD(setAngleStep);
	static POLY_METHOD(getAngleStep);
	static POLY_METHOD(setAngleThresh);
	static POLY_METHOD(getAngleThresh);
	static POLY_METHOD(setMinScale);
	static POLY_METHOD(getMinScale);
	static POLY_METHOD(setMaxScale);
	static POLY_METHOD(getMaxScale);
	static POLY_METHOD(setScaleStep);
	static POLY_METHOD(getScaleStep);
	static POLY_METHOD(setScaleThresh);
	static POLY_METHOD(getScaleThresh);
	static POLY_METHOD(setPosThresh);
	static POLY_METHOD(getPosThresh);

};
#endif
