#ifndef _ALVISION_BACKGROUND_SEGM_H_
#define _ALVISION_BACKGROUND_SEGM_H_

#include "../../alvision.h"


class background_segm : public or ::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
};

#endif