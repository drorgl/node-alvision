#ifndef _ALVISION_ML_H_
#define _ALVISION_ML_H_
//#include "OpenCV.h"
#include "../alvision.h"

#include "ml/TrainData.h"

class ml : public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
	static Nan::Persistent<Object> mlObject;
};

#endif