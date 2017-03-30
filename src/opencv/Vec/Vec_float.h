#ifndef _ALVISION_VEC_FLOAT_H_
#define _ALVISION_VEC_FLOAT_H_

#include "../../alvision.h"

namespace VecFloatInit {
	void Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
	void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
}

#endif