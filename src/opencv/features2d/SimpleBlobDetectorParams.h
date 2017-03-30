#ifndef _ALVISION_SIMPLEBLOBDETECTORPARAMS_H_
#define _ALVISION_SIMPLEBLOBDETECTORPARAMS_H_

#include "../../alvision.h"

class SimpleBlobDetectorParams : public overres::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	std::shared_ptr<cv::SimpleBlobDetector::Params> _params;

	static std::shared_ptr<SimpleBlobDetectorParams> create();

	static POLY_METHOD(New);

	static NAN_GETTER(thresholdStep_getter);
	static NAN_SETTER(thresholdStep_setter);

	static NAN_GETTER(minThreshold_getter);
	static NAN_SETTER(minThreshold_setter);

	static NAN_GETTER(maxThreshold_getter);
	static NAN_SETTER(maxThreshold_setter);

	static NAN_GETTER(minRepeatability_getter);
	static NAN_SETTER(minRepeatability_setter);

	static NAN_GETTER(minDistBetweenBlobs_getter);
	static NAN_SETTER(minDistBetweenBlobs_setter);

	static NAN_GETTER(filterByColor_getter);
	static NAN_SETTER(filterByColor_setter);

	static NAN_GETTER(blobColor_getter);
	static NAN_SETTER(blobColor_setter);

	static NAN_GETTER(filterByArea_getter);
	static NAN_SETTER(filterByArea_setter);

	static NAN_GETTER(minArea_getter);
	static NAN_SETTER(minArea_setter);

	static NAN_GETTER(maxArea_getter);
	static NAN_SETTER(maxArea_setter);

	static NAN_GETTER(filterByCircularity_getter);
	static NAN_SETTER(filterByCircularity_setter);

	static NAN_GETTER(minCircularity_getter);
	static NAN_SETTER(minCircularity_setter);

	static NAN_GETTER(maxCircularity_getter);
	static NAN_SETTER(maxCircularity_setter);

	static NAN_GETTER(filterByInertia_getter);
	static NAN_SETTER(filterByInertia_setter);

	static NAN_GETTER(minInertiaRatio_getter);
	static NAN_SETTER(minInertiaRatio_setter);

	static NAN_GETTER(maxInertiaRatio_getter);
	static NAN_SETTER(maxInertiaRatio_setter);

	static NAN_GETTER(filterByConvexity_getter);
	static NAN_SETTER(filterByConvexity_setter);

	static NAN_GETTER(minConvexity_getter);
	static NAN_SETTER(minConvexity_setter);

	static NAN_GETTER(maxConvexity_getter);
	static NAN_SETTER(maxConvexity_setter);

	static POLY_METHOD(read);
	static POLY_METHOD(write);
};

#endif
