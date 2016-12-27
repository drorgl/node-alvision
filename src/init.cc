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
#include "opencv/Scalar.h"

#include "opencv/Mat_.h"

#include "opencv/persistence.h"

#include "opencv/MatND.h"
#include "opencv/SparseMat.h"

#include "opencv/Point.h"
#include "opencv/Point3.h"

#include "opencv/imgcodecs.h"
#include "opencv/imgproc.h"


#include "opencv/stitching.h"

#include "opencv/shape.h"
#include "opencv/video.h"

#include "opencv/videoio.h"

#include "opencv/IOArray.h"

#include "opencv/Range.h"
#include "opencv/Rect.h"

#include "opencv/TrackedPtr.h"	
#include "opencv/TrackedElement.h"	

extern "C"{ 
void
init(Handle<Object> target) {
	assert(false);
	auto overload = std::make_shared<overload_resolution>();

	overload->add_type_alias("InputArray", "IOArray");
	overload->add_type_alias("InputArrayOfArrays", "Array<InputArray>");
	overload->add_type_alias("OutputArray", "IOArray");
	overload->add_type_alias("OutputArrayOfArrays", "Array<InputArray>");
	overload->add_type_alias("InputOutputArray", "IOArray");
	overload->add_type_alias("InputOutputArrayOfArrays", "Array<InputArray>");
	overload->add_type_alias("int", "Number");
	overload->add_type_alias("double", "Number");
	overload->add_type_alias("size_t", "int");
	overload->add_type_alias("MatrixType", "int");

	IOArray::Init(target, overload);

	Matrix::Init(target,overload);
	alvision::ffmpeg::Init(target,overload);
	alvision::packet::Init(target,overload);
	alvision::stream::Init(target,overload);
	Constants::Init(target,overload);
	highgui::Init(target,overload);

	Cuda::Init(target,overload);

	flann::Init(target,overload);

	cvtest::Init(target, overload);

	Size<cv::Size2i>::Init(target,"Size2i" ,overload);
	Size<cv::Size2f>::Init(target, "Size2f",overload);
	Size<cv::Size2d>::Init(target, "Size2d",overload);
	overload->add_type_alias("Size", "Size2i");


	Vec<cv::Vec2b>::Init(target,"Vec2b",overload);
	Vec<cv::Vec3b>::Init(target,"Vec3b",overload);
	Vec<cv::Vec4b>::Init(target,"Vec4b",overload);
	Vec<cv::Vec2s>::Init(target,"Vec2s",overload);
	Vec<cv::Vec3s>::Init(target,"Vec3s",overload);
	Vec<cv::Vec4s>::Init(target,"Vec4s",overload);
	Vec<cv::Vec2w>::Init(target,"Vec2w",overload);
	Vec<cv::Vec3w>::Init(target,"Vec3w",overload);
	Vec<cv::Vec4w>::Init(target,"Vec4w",overload);
	Vec<cv::Vec2i>::Init(target,"Vec2i",overload);
	Vec<cv::Vec3i>::Init(target,"Vec3i",overload);
	Vec<cv::Vec4i>::Init(target,"Vec4i",overload);
	Vec<cv::Vec6i>::Init(target,"Vec6i",overload);
	Vec<cv::Vec8i>::Init(target,"Vec8i",overload);
	Vec<cv::Vec2f>::Init(target,"Vec2f",overload);
	Vec<cv::Vec3f>::Init(target,"Vec3f",overload);
	Vec<cv::Vec4f>::Init(target,"Vec4f",overload);
	Vec<cv::Vec6f>::Init(target,"Vec6f",overload);
	Vec<cv::Vec2d>::Init(target,"Vec2d",overload);
	Vec<cv::Vec3d>::Init(target,"Vec3d",overload);
	Vec<cv::Vec4d>::Init(target,"Vec4d",overload);
	Vec<cv::Vec6d>::Init(target,"Vec6d",overload);

	Affine3<cv::Affine3d>::Init(target, "Affine3d", overload);
	Affine3<cv::Affine3f>::Init(target, "Affine3f", overload);
	

	ml::Init(target, overload);
	superres::Init(target, overload);

	calib3d::Init(target, overload);

	MatExpr::Init(target, overload);

	core::Init(target, overload);

	//Matx<cv::Matx
	Matx<cv::Matx12f>::Init(target,"Matx12f",overload);
	Matx<cv::Matx12d>::Init(target,"Matx12d",overload);
	Matx<cv::Matx13f>::Init(target,"Matx13f",overload);
	Matx<cv::Matx13d>::Init(target,"Matx13d",overload);
	Matx<cv::Matx14f>::Init(target,"Matx14f",overload);
	Matx<cv::Matx14d>::Init(target,"Matx14d",overload);
	Matx<cv::Matx16f>::Init(target,"Matx16f",overload);
	Matx<cv::Matx16d>::Init(target,"Matx16d",overload);
	Matx<cv::Matx21f>::Init(target,"Matx21f",overload);
	Matx<cv::Matx21d>::Init(target,"Matx21d",overload);
	Matx<cv::Matx31f>::Init(target,"Matx31f",overload);
	Matx<cv::Matx31d>::Init(target,"Matx31d",overload);
	Matx<cv::Matx41f>::Init(target,"Matx41f",overload);
	Matx<cv::Matx41d>::Init(target,"Matx41d",overload);
	Matx<cv::Matx61f>::Init(target,"Matx61f",overload);
	Matx<cv::Matx61d>::Init(target,"Matx61d",overload);
	Matx<cv::Matx22f>::Init(target,"Matx22f",overload);
	Matx<cv::Matx22d>::Init(target,"Matx22d",overload);
	Matx<cv::Matx23f>::Init(target,"Matx23f",overload);
	Matx<cv::Matx23d>::Init(target,"Matx23d",overload);
	Matx<cv::Matx32f>::Init(target,"Matx32f",overload);
	Matx<cv::Matx32d>::Init(target,"Matx32d",overload);
	Matx<cv::Matx33f>::Init(target,"Matx33f",overload);
	Matx<cv::Matx33d>::Init(target,"Matx33d",overload);
	Matx<cv::Matx34f>::Init(target,"Matx34f",overload);
	Matx<cv::Matx34d>::Init(target,"Matx34d",overload);
	Matx<cv::Matx43f>::Init(target,"Matx43f",overload);
	Matx<cv::Matx43d>::Init(target,"Matx43d",overload);
	Matx<cv::Matx44f>::Init(target,"Matx44f",overload);
	Matx<cv::Matx44d>::Init(target,"Matx44d",overload);
	Matx<cv::Matx66f>::Init(target,"Matx66f",overload);
	Matx<cv::Matx66d>::Init(target,"Matx66d",overload);

	Scalar<cv::Scalar>::Init(target, "Scalar", overload);

	Mat_<uchar >	::Init(target,"Mat1b",overload);
	Mat_<cv::Vec2b >::Init(target,"Mat2b",overload);
	Mat_<cv::Vec3b >::Init(target,"Mat3b",overload);
	Mat_<cv::Vec4b >::Init(target,"Mat4b",overload);
	
	Mat_<short >     ::Init(target,"Mat1s",overload);
	Mat_<cv::Vec2s > ::Init(target,"Mat2s",overload);
	Mat_<cv::Vec3s > ::Init(target,"Mat3s",overload);
	Mat_<cv::Vec4s > ::Init(target,"Mat4s",overload);
	
	Mat_<ushort >    ::Init(target,"Mat1w",overload);
	Mat_<cv::Vec2w > ::Init(target,"Mat2w",overload);
	Mat_<cv::Vec3w > ::Init(target,"Mat3w",overload);
	Mat_<cv::Vec4w > ::Init(target,"Mat4w",overload);
	
	Mat_<int    >    ::Init(target,"Mat1i",overload);
	Mat_<cv::Vec2i > ::Init(target,"Mat2i",overload);
	Mat_<cv::Vec3i > ::Init(target,"Mat3i",overload);
	Mat_<cv::Vec4i > ::Init(target,"Mat4i",overload);
	
	Mat_<float  >	 ::Init(target,"Mat1f",overload);
	Mat_<cv::Vec2f > ::Init(target,"Mat2f",overload);
	Mat_<cv::Vec3f > ::Init(target,"Mat3f",overload);
	Mat_<cv::Vec4f > ::Init(target,"Mat4f",overload);
	
	Mat_<double >    ::Init(target,"Mat1d",overload);
	Mat_<cv::Vec2d > ::Init(target,"Mat2d",overload);
	Mat_<cv::Vec3d > ::Init(target,"Mat3d",overload);
	Mat_<cv::Vec4d>  ::Init(target,"Mat4d",overload);

	Mat_<cv::Point2f>::Init(target, "MatPoint2f", overload);

	persistence::Init(target, overload);

	MatND::Init(target, overload);
	SparseMat::Init(target, overload);

	Point<cv::Point2i>::Init(target, "Point2i",overload);
	Point<cv::Point2f>::Init(target, "Point2f",overload);
	Point<cv::Point2d>::Init(target, "Point2d",overload);
	Point<cv::Point>::Init(target,   "Point", overload);

	Point3<cv::Point3i>::Init(target, "Point3i", overload);
	Point3<cv::Point3f>::Init(target, "Point3f", overload);
	Point3<cv::Point3d>::Init(target, "Point3d", overload);

	
	Rect<cv::Rect2i>::Init(target, "Rect2i", overload);
	Rect<cv::Rect2f>::Init(target, "Rect2f", overload);
	Rect<cv::Rect2d>::Init(target, "Rect2d", overload);
	
	Rect<cv::Rect>::Init(target, "Rect", overload);


	Range::Init(target, "Range", overload);

	imgcodecs::Init(target, overload);
	imgproc::Init(target, overload);

	stitching::Init(target, overload);

	shape::Init(target,overload);
	video::Init(target,overload);

	videoio::Init(target, overload);

	TrackedPtr::Init(target, overload);
	TrackedElement::Init(target, overload);


	target->Set(Nan::New("version").ToLocalChecked(), Nan::New("1.0.0").ToLocalChecked());

	//validate type/overload registrations
	assert(overload->validate_type_registrations());
};
}

NODE_MODULE(alvision, init)
