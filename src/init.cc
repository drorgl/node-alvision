
#include "alvision.h"


#include "opencv/Matrix.h"
#include "ffmpeg/ffmpeg.h"
#include "ffmpeg/packet.h"
#include "ffmpeg/stream.h"

#include "opencv/HighGUI.h"
#include "opencv/Constants.h"
#include "opencv/Cuda.h"
#include "opencv/flann.h"
#include "opencv/cvtest.h"

#include "opencv/Size.h"

#include "opencv/ml.h"
#include "opencv/superres.h"


extern "C"{ 
void
init(Handle<Object> target) {
	

	Matrix::Init(target);
	alvision::ffmpeg::Init(target);
	alvision::packet::Init(target);
	alvision::stream::Init(target);
	Constants::Init(target);
	NamedWindow::Init(target);

	Cuda::Init(target);

	flann::Init(target);

	cvtest::Init(target);

	Size<cv::Size2i>::Init(target,"Size2i");
	Size<cv::Size2f>::Init(target, "Size2f");
	Size<cv::Size2d>::Init(target, "Size2d");

	ml::Init(target);
	superres::Init(target);

	target->Set(Nan::New("version").ToLocalChecked(), Nan::New("1.0.0").ToLocalChecked());
};
}

NODE_MODULE(alvision, init)
