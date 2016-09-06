#include "videoio.h"


void
videoio::Init(Handle<Object> target) {
	VideoCapture::Init(target);
	VideoWriter::Init(target);
};
