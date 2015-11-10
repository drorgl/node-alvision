
#include "alvision.h"


#include "opencv/Matrix.h"
#include "ffmpeg/ffmpeg.h"
#include "ffmpeg/packet.h"
#include "ffmpeg/stream.h"

#include "opencv/HighGUI.h"
#include "opencv/Constants.h"


extern "C"{ 
void
init(Handle<Object> target) {
	NanScope();

	Matrix::Init(target);
	alvision::ffmpeg::Init(target);
	alvision::packet::Init(target);
	alvision::stream::Init(target);
	Constants::Init(target);
	NamedWindow::Init(target);

	target->Set(NanNew("version"), NanNew("1.0.0"));
};
}

NODE_MODULE(alvision, init)
