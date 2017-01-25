#include "alvision.h"


#include "opencv/Matrix.h"
#include "ffmpeg/ffmpeg.h"
#include "ffmpeg/packet.h"
#include "ffmpeg/stream.h"

#include "opencv/base.h"

#include "opencv/UMatrix.h"

#include "opencv/HighGUI.h"
#include "opencv/Constants.h"
#include "opencv/Cuda.h"
#include "opencv/flann.h"
#include "opencv/cvtest.h"

#include "opencv/Vec.h"

#include "opencv/ml.h"
#include "opencv/superres.h"

#include "opencv/Affine3.h"

#include "opencv/calib3d.h"

#include "opencv/MatExpr.h"

#include "opencv/core.h"

#include "opencv/Matx.h"

#include "opencv/Mat_.h"

#include "opencv/persistence.h"

#include "opencv/MatND.h"
#include "opencv/SparseMat.h"


#include "opencv/imgcodecs.h"
#include "opencv/imgproc.h"


#include "opencv/stitching.h"

#include "opencv/shape.h"
#include "opencv/video.h"

#include "opencv/videoio.h"

#include "opencv/IOArray.h"

#include "opencv/TrackedPtr.h"	
#include "opencv/TrackedElement.h"	

#include "opencv/core/Algorithm.h"
#include "opencv/features2d/Feature2D.h"
#include "opencv/features2d/SimpleBlobDetector.h"

#include "opencv/types.h"

#include "opencv/MatOp.h"

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
	overload->add_type_alias("float", "Number");
	overload->add_type_alias("uint64_t", "Number");
	overload->add_type_alias("uint", "Number");
	overload->add_type_alias("unsigned", "Number");
	overload->add_type_alias("bool", "Boolean");
	overload->add_type_alias("size_t", "int");
	overload->add_type_alias("MatrixType", "int");
	overload->add_type_alias("uchar", "Number");
	overload->add_type_alias("short", "Number");
	overload->add_type_alias("ushort", "Number");

	base::Init(target, overload);

	IOArray::Init(target, overload);
	

	
	Constants::Init(target,overload);
	

	Cuda::Init(target,overload);

	flann::Init(target,overload);



	
	

	ml::Init(target, overload);
	superres::Init(target, overload);

	
	MatOp::Init(target, overload);
	MatExpr::Init(target, overload);

	MatxInit::Init(target, overload);
	VecInit::Init(target, overload);
	types::Init(target, overload);
	//cv::Vec3d::mat_type

	Matrix::Init(target, overload);
	UMatrix::Init(target, overload);
	TrackedPtr<Matrix>::Init(target, "TrackedPtr_Mat", overload);
	//TrackedElement<Matrix>::Init(target, overload);

	alvision::ffmpeg::Init(target, overload);
	alvision::packet::Init(target, overload);
	alvision::stream::Init(target, overload);
	
	Mat_Init::Init(target, overload);

	core::Init(target, overload);

	
	

	

	persistence::Init(target, overload);

	MatND::Init(target, overload);
	SparseMat::Init(target, overload);


	Feature2D::Init(target, overload);
	SimpleBlobDetector::Init(target, overload);


	imgcodecs::Init(target, overload);
	imgproc::Init(target, overload);

	stitching::Init(target, overload);

	shape::Init(target,overload);
	video::Init(target,overload);

	videoio::Init(target, overload);

	 
	
	

	AffineInit::Init(target, overload);
	
	calib3d::Init(target, overload);
	cv_test::Init(target, overload);
	highgui::Init(target, overload);

	target->Set(Nan::New("version").ToLocalChecked(), Nan::New("1.0.0").ToLocalChecked());

	//validate type/overload registrations
	assert(overload->validate_type_registrations());
};
}

NODE_MODULE(alvision, init)
