#ifndef _ALVISION_OBJDETECT_H_
#define _ALVISION_OBJDETECT_H_

#include "../alvision.h"

class objdetect : public overres::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);


};

#endif