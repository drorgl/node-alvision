#ifndef _ALVISION_MATX_FLOAT_H_
#define _ALVISION_MATX_FLOAT_H_

#include "../../alvision.h"

namespace MatxFloatInit {
	void Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
	void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
}

#endif