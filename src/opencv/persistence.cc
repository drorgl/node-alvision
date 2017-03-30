#include "persistence.h"


void
persistence::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	FileNode::Init(target,overload);
	FileStorage::Init(target,overload);
};
