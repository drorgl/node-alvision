#include "Mat_.h"

namespace mat__general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("mat__general_callback is empty");
		}
		return overload->execute("mat_", info);
	}
}


void Mat_Init::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Mat_<cv::Mat_<uchar>, uchar>::Init(target, "Mat1b","uchar", overload);
	Mat_<cv::Mat_<cv::Vec2b>,Vec<cv::Vec2b>*>::Init(target, "Mat2b",Vec<cv::Vec2b>::name, overload);
	Mat_<cv::Mat_<cv::Vec3b>,Vec<cv::Vec3b>*>::Init(target, "Mat3b",Vec<cv::Vec3b>::name, overload);
	Mat_<cv::Mat_<cv::Vec4b>,Vec<cv::Vec4b>*>::Init(target, "Mat4b",Vec<cv::Vec4b>::name, overload);

	Mat_<cv::Mat_<short >, short>::Init(target, "Mat1s","short", overload);
	Mat_<cv::Mat_<cv::Vec2s>,Vec<cv::Vec2s>*>::Init(target, "Mat2s",Vec<cv::Vec2s>::name, overload);
	Mat_<cv::Mat_<cv::Vec3s>,Vec<cv::Vec3s>*>::Init(target, "Mat3s",Vec<cv::Vec3s>::name, overload);
	Mat_<cv::Mat_<cv::Vec4s>,Vec<cv::Vec4s>*>::Init(target, "Mat4s",Vec<cv::Vec4s>::name, overload);

	Mat_<cv::Mat_<ushort >    , ushort>::Init(target, "Mat1w","ushort", overload);
	Mat_<cv::Mat_<cv::Vec2w > , Vec<cv::Vec2w>*>::Init(target, "Mat2w",Vec<cv::Vec2w>::name, overload);
	Mat_<cv::Mat_<cv::Vec3w > , Vec<cv::Vec3w>*>::Init(target, "Mat3w",Vec<cv::Vec3w>::name, overload);
	Mat_<cv::Mat_<cv::Vec4w > , Vec<cv::Vec4w>*>::Init(target, "Mat4w",Vec<cv::Vec4w>::name, overload);

	Mat_<cv::Mat_<int    >    , int>::Init(target, "Mat1i","int", overload);
	Mat_<cv::Mat_<cv::Vec2i > , Vec<cv::Vec2i>*>::Init(target, "Mat2i",Vec<cv::Vec2i>::name, overload);
	Mat_<cv::Mat_<cv::Vec3i > , Vec<cv::Vec3i>*>::Init(target, "Mat3i",Vec<cv::Vec3i>::name, overload);
	Mat_<cv::Mat_<cv::Vec4i > , Vec<cv::Vec4i>*>::Init(target, "Mat4i",Vec<cv::Vec4i>::name, overload);

	Mat_<cv::Mat_<float  >	 , float>::Init(target, "Mat1f","float", overload);
	Mat_<cv::Mat_<cv::Vec2f >, Vec<cv::Vec2f>*> ::Init(target, "Mat2f",Vec<cv::Vec2f>::name, overload);
	Mat_<cv::Mat_<cv::Vec3f >, Vec<cv::Vec3f>*> ::Init(target, "Mat3f",Vec<cv::Vec3f>::name, overload);
	Mat_<cv::Mat_<cv::Vec4f >, Vec<cv::Vec4f>*> ::Init(target, "Mat4f",Vec<cv::Vec4f>::name, overload);

	Mat_<cv::Mat_<double >		, double>  ::Init(target, "Mat1d","double", overload);
	Mat_<cv::Mat_<cv::Vec2d >	, Vec<cv::Vec2d>*> ::Init(target, "Mat2d" ,Vec<cv::Vec2d>::name, overload);
	Mat_<cv::Mat_<cv::Vec3d >	, Vec<cv::Vec3d>*> ::Init(target, "Mat3d" ,Vec<cv::Vec3d>::name, overload);
	Mat_<cv::Mat_<cv::Vec4d>	, Vec<cv::Vec4d>*>  ::Init(target, "Mat4d",Vec<cv::Vec4d>::name, overload);

	Mat_<cv::Mat_<cv::Point2f>  , Point_<cv::Point2f>*>::Init(target, "MatPoint2f", Point_<cv::Point2f>::name, overload);
}