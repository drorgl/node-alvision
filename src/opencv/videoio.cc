#include "videoio.h"


void
videoio::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	VideoCapture::Init(target, overload);
	VideoWriter::Init(target, overload);
};
