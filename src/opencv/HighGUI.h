#ifndef _ALVISION_HIGHGUI_H_
#define _ALVISION_HIGHGUI_H_


#include "../alvision.h"


class highgui: public Nan::ObjectWrap {
public:
	  static void Init(Handle<Object> target);
      static NAN_METHOD(destroyAllWindows);

};


#endif