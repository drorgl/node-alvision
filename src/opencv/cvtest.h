#ifndef _ALVISION_CVTEST_H_
#define _ALVISION_CVTEST_H_
//#include "OpenCV.h"
#include "../alvision.h"

#include "ts/DeviceManager.h"
//#include "cuda/DeviceInfo.h"

class cv_test : public or ::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static POLY_METHOD(readSeed);
	static POLY_METHOD(randUni);
	static POLY_METHOD(getTypeName);
	static POLY_METHOD(typeByName);
	//static POLY_METHOD(vec2str);
	static POLY_METHOD(getMinVal);
	static POLY_METHOD(getMaxVal);
	static POLY_METHOD(randomSize_a);
	static POLY_METHOD(randomSize_b);
	static POLY_METHOD(randomType);
	static POLY_METHOD(randomMat_a);
	static POLY_METHOD(randomMat_b);
	static POLY_METHOD(add);
	static POLY_METHOD(multiply);
	static POLY_METHOD(divide);
	static POLY_METHOD(convert);
	static POLY_METHOD(copy);
	static POLY_METHOD(set);
	static POLY_METHOD(extract);
	static POLY_METHOD(insert);
	static POLY_METHOD(check);
	static POLY_METHOD(patchZeros);
	static POLY_METHOD(transpose);
	static POLY_METHOD(erode);
	static POLY_METHOD(dilate);
	static POLY_METHOD(filter2D);
	static POLY_METHOD(copyMakeBorder);
	static POLY_METHOD(calcSobelKernel2D);
	static POLY_METHOD(calcLaplaceKernel2D);
	static POLY_METHOD(initUndistortMap);
	//static POLY_METHOD(minMaxLoc);
	static POLY_METHOD(norm_a);
	static POLY_METHOD(norm_b);
	static POLY_METHOD(mean);
	static POLY_METHOD(PSNR);
	//static POLY_METHOD(cmpUlps);
	static POLY_METHOD(cmpEps);
	//static POLY_METHOD(cmpEps2);
	//static POLY_METHOD(cmpEps2_64f);
	static POLY_METHOD(logicOp_a);
	static POLY_METHOD(logicOp_b);
	static POLY_METHOD(min_a);
	static POLY_METHOD(min_b);
	static POLY_METHOD(max_a);
	static POLY_METHOD(max_b);
	static POLY_METHOD(compare_a);
	static POLY_METHOD(compare_b);
	static POLY_METHOD(gemm);
	static POLY_METHOD(transform);
	static POLY_METHOD(crossCorr);
	static POLY_METHOD(threshold);
	//static POLY_METHOD(minMaxIdx);
	//static POLY_METHOD(fillGradient);
	//static POLY_METHOD(smoothBorder);
	static POLY_METHOD(printVersionInfo);

};

#endif