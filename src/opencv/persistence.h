#ifndef _ALVISION_PERSISTENCE_H_
#define _ALVISION_PERSISTENCE_H_
//#include "OpenCV.h"
#include "../alvision.h"

#include "persistence/FileNode.h"
#include "persistence/FileStorage.h"


class persistence : public Nan::ObjectWrap {
public:
	static void Init(Handle<Object> target);


};

#endif