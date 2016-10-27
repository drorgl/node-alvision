#ifndef _ALVISION_CALIB3D_H_
#define _ALVISION_CALIB3D_H_

#include "../alvision.h"

class calib3d: public Nan::ObjectWrap {
 public:
    static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static NAN_METHOD(Rodrigues);
	static NAN_METHOD(calibrateCamera);
	static NAN_METHOD(decomposeHomographyMat);
};


#endif