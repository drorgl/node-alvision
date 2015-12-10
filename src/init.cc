
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
	

	Matrix::Init(target);
	alvision::ffmpeg::Init(target);
	alvision::packet::Init(target);
	alvision::stream::Init(target);
	Constants::Init(target);
	NamedWindow::Init(target);

	target->Set(Nan::New("version").ToLocalChecked(), Nan::New("1.0.0").ToLocalChecked());
};
}

NODE_MODULE(alvision, init)
