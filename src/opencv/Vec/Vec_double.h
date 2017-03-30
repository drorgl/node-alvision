#ifndef _ALVISION_VEC_DOUBLE_H_
#define _ALVISION_VEC_DOUBLE_H_

#include "../../alvision.h"

namespace VecDoubleInit {
	void Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
	void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
}

#endif