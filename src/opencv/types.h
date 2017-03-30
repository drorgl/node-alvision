#ifndef _ALVISION_TYPES_H_
#define _ALVISION_TYPES_H_
#include "../alvision.h"

class types : public overres::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

};

#endif