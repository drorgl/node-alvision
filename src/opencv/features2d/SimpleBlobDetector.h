#ifndef _ALVISION_SIMPLEBLOBDETECTOR_H_
#define _ALVISION_SIMPLEBLOBDETECTOR_H_

#include "../../alvision.h"
#include "Feature2D.h"
#include "SimpleBlobDetectorParams.h"

class SimpleBlobDetector : public Feature2D{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static std::shared_ptr<SimpleBlobDetector> create(std::shared_ptr<SimpleBlobDetectorParams> params   = SimpleBlobDetectorParams::create());

};

#endif
