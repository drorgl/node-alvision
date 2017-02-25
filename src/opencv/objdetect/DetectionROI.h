#ifndef _ALVISION_DETECTION_ROI_H_
#define _ALVISION_DETECTION_ROI_H_

#include "../../alvision.h"

class DetectionROI : public overres::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	std::shared_ptr<cv::DetectionROI> _detectionROI;

	static POLY_METHOD(New);

	static NAN_GETTER(scale_getter);
	static NAN_SETTER(scale_setter);
	static NAN_GETTER(locations_getter);
	static NAN_SETTER(locations_setter);
	static NAN_GETTER(confidences_getter);
	static NAN_SETTER(confidences_setter);


};

#endif
