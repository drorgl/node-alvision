#ifndef _ALVISION_MATX_INT_H_
#define _ALVISION_MATX_INT_H_

#include "../../alvision.h"

namespace MatxIntInit {
	void Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
	void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
}

#endif