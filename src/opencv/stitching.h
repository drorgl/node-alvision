#ifndef _ALVISION_STITCHING_H_
#define _ALVISION_STITCHING_H_

#include "../alvision.h"

class stitching: public Nan::ObjectWrap {
 public:
    static void Init(Handle<Object> target);
};


#endif