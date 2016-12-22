#ifndef _ALVISION_PERSISTENCE_H_
#define _ALVISION_PERSISTENCE_H_
//#include "OpenCV.h"
#include "../alvision.h"

#include "persistence/FileNode.h"
#include "persistence/FileStorage.h"


class persistence : public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);


};

#endif