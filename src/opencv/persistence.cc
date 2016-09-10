#include "persistence.h"


void
persistence::Init(Handle<Object> target) {
	FileNode::Init(target);
	FileStorage::Init(target);
};
