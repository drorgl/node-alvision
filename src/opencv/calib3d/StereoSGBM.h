#ifndef _ALVISION_STEREOSGBM_H_
#define _ALVISION_STEREOSGBM_H_

#include "../../alvision.h"

class StereoSGBM : public or ::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

}

#endif
