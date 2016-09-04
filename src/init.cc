
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

#include "opencv/Vec.h"

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


	Vec<cv::Vec2b>::Init(target,"Vec2b");
	Vec<cv::Vec3b>::Init(target,"Vec3b");
	Vec<cv::Vec4b>::Init(target,"Vec4b");
	Vec<cv::Vec2s>::Init(target,"Vec2s");
	Vec<cv::Vec3s>::Init(target,"Vec3s");
	Vec<cv::Vec4s>::Init(target,"Vec4s");
	Vec<cv::Vec2w>::Init(target,"Vec2w");
	Vec<cv::Vec3w>::Init(target,"Vec3w");
	Vec<cv::Vec4w>::Init(target,"Vec4w");
	Vec<cv::Vec2i>::Init(target,"Vec2i");
	Vec<cv::Vec3i>::Init(target,"Vec3i");
	Vec<cv::Vec4i>::Init(target,"Vec4i");
	Vec<cv::Vec6i>::Init(target,"Vec6i");
	Vec<cv::Vec8i>::Init(target,"Vec8i");
	Vec<cv::Vec2f>::Init(target,"Vec2f");
	Vec<cv::Vec3f>::Init(target,"Vec3f");
	Vec<cv::Vec4f>::Init(target,"Vec4f");
	Vec<cv::Vec6f>::Init(target,"Vec6f");
	Vec<cv::Vec2d>::Init(target,"Vec2d");
	Vec<cv::Vec3d>::Init(target,"Vec3d");
	Vec<cv::Vec4d>::Init(target,"Vec4d");
	Vec<cv::Vec6d>::Init(target,"Vec6d");
	

	ml::Init(target);
	superres::Init(target);

	target->Set(Nan::New("version").ToLocalChecked(), Nan::New("1.0.0").ToLocalChecked());

};
}

NODE_MODULE(alvision, init)
