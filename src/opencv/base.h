#ifndef _ALVISION_BASE_H_
#define _ALVISION_BASE_H_

#include "../alvision.h"

class base : public or ::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

};

#endif
