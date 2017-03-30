#ifndef _ALVISION_OPENGL_H_
#define _ALVISION_OPENGL_H_

#include "../../alvision.h"


class opengl : public overres::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
};

#endif