#ifndef _ALVISION_STEREOBM_H_
#define _ALVISION_STEREOBM_H_

#include "../../alvision.h"

class StereoBM : public or ::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

}

#endif
