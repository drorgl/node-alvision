#ifndef _ALVISION_STEREOMATCHER_H_
#define _ALVISION_STEREOMATCHER_H_

#include "../../alvision.h"

class StereoMatcher : public or ::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

}

#endif
