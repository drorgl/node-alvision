#ifndef _ALVISION_STITCHING_H_
#define _ALVISION_STITCHING_H_

#include "../alvision.h"

class stitching: public or::ObjectWrap {
 public:
    static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
};


#endif