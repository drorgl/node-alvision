
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

#include "opencv/Affine3.h"

#include "opencv/calib3d.h"

#include "opencv/MatExpr.h"

#include "opencv/core.h"

#include "opencv/Matx.h"

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

	Affine3<cv::Affine3d>::Init(target, "Affine3d");
	Affine3<cv::Affine3f>::Init(target, "Affine3f");
	

	ml::Init(target);
	superres::Init(target);

	calib3d::Init(target);

	MatExpr::Init(target);

	core::Init(target);

	//Matx<cv::Matx
	Matx<cv::Matx12f>::Init(target,"Matx12f");
	Matx<cv::Matx12d>::Init(target,"Matx12d");
	Matx<cv::Matx13f>::Init(target,"Matx13f");
	Matx<cv::Matx13d>::Init(target,"Matx13d");
	Matx<cv::Matx14f>::Init(target,"Matx14f");
	Matx<cv::Matx14d>::Init(target,"Matx14d");
	Matx<cv::Matx16f>::Init(target,"Matx16f");
	Matx<cv::Matx16d>::Init(target,"Matx16d");

	Matx<cv::Matx21f>::Init(target,"Matx21f");
	Matx<cv::Matx21d>::Init(target,"Matx21d");
	Matx<cv::Matx31f>::Init(target,"Matx31f");
	Matx<cv::Matx31d>::Init(target,"Matx31d");
	Matx<cv::Matx41f>::Init(target,"Matx41f");
	Matx<cv::Matx41d>::Init(target,"Matx41d");
	Matx<cv::Matx61f>::Init(target,"Matx61f");
	Matx<cv::Matx61d>::Init(target,"Matx61d");

	Matx<cv::Matx22f>::Init(target,"Matx22f");
	Matx<cv::Matx22d>::Init(target,"Matx22d");
	Matx<cv::Matx23f>::Init(target,"Matx23f");
	Matx<cv::Matx23d>::Init(target,"Matx23d");
	Matx<cv::Matx32f>::Init(target,"Matx32f");
	Matx<cv::Matx32d>::Init(target,"Matx32d");

	Matx<cv::Matx33f>::Init(target,"Matx33f");
	Matx<cv::Matx33d>::Init(target,"Matx33d");

	Matx<cv::Matx34f>::Init(target,"Matx34f");
	Matx<cv::Matx34d>::Init(target,"Matx34d");
	Matx<cv::Matx43f>::Init(target,"Matx43f");
	Matx<cv::Matx43d>::Init(target,"Matx43d");

	Matx<cv::Matx44f>::Init(target,"Matx44f");
	Matx<cv::Matx44d>::Init(target,"Matx44d");
	Matx<cv::Matx66f>::Init(target,"Matx66f");
	Matx<cv::Matx66d>::Init(target,"Matx66d");

	target->Set(Nan::New("version").ToLocalChecked(), Nan::New("1.0.0").ToLocalChecked());

};
}

NODE_MODULE(alvision, init)
