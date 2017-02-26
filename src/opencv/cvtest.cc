#include "cvtest.h"
#include <opencv2/ts.hpp>

#include "Matrix.h"
#include "types/Scalar.h"
#include "core/RNG.h"
#include "types/Size.h"
#include "types/Point.h"

namespace cvtest_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("cvtest_general_callback is empty");
		}
		return overload->execute("cvtest", info);
	}
}

void
cv_test::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	cvtest_general_callback::overload = overload;
	Local<Object> testns = Nan::New<Object>();

	target->Set(Nan::New("cvtest").ToLocalChecked(), testns);



	//int64 readSeed(const char* str);
	overload->addOverload("cvtest", "", "readSeed", { make_param<std::string>("str","String") }, readSeed);
	Nan::SetMethod(testns, "readSeed", cvtest_general_callback::callback);
	//
	//void randUni(RNG& rng, Mat& a, const Scalar& param1, const Scalar& param2);
	overload->addOverload("cvtest", "", "randUni", {
		make_param<RNG*>("rng","RNG"),
		make_param<Matrix*>("a",Matrix::name),
		make_param<Scalar*>("param1","Scalar"),
		make_param<Scalar*>("param2","Scalar")
	}, randUni);
	Nan::SetMethod(testns, "randUni", cvtest_general_callback::callback);
	//
	//const char* getTypeName(int type);
	overload->addOverload("cvtest", "", "getTypeName", { make_param<int>("type","int") }, getTypeName);
	Nan::SetMethod(testns, "getTypeName", cvtest_general_callback::callback);
	//int typeByName(const char* type_name);
	overload->addOverload("cvtest", "", "typeByName", { make_param<std::string>("type_name","String") }, typeByName);
	Nan::SetMethod(testns, "typeByName", cvtest_general_callback::callback);
	//
	//string vec2str(const string& sep, const int* v, size_t nelems);
	//overload->addOverload("cvtest", "", "vec2str", {}, vec2str);
	//
	//
	//double getMinVal(int depth);
	overload->addOverload("cvtest", "", "getMinVal", { make_param<int>("depth","int") }, getMinVal);
	Nan::SetMethod(testns, "getMinVal", cvtest_general_callback::callback);
	//double getMaxVal(int depth);
	overload->addOverload("cvtest", "", "getMaxVal", { make_param<int>("depth","int") }, getMaxVal);
	Nan::SetMethod(testns, "getMaxVal", cvtest_general_callback::callback);
	//
	//Size randomSize(RNG& rng, double maxSizeLog);
	overload->addOverload("cvtest", "", "randomSize", {
			make_param<RNG*>("rng","RNG"),
			make_param<double>("maxSizeLog","double")
	}, randomSize_a);
	Nan::SetMethod(testns, "randomSize", cvtest_general_callback::callback);
	//void randomSize(RNG& rng, int minDims, int maxDims, double maxSizeLog, vector<int>& sz);
	overload->addOverload("cvtest", "", "randomSize", {
		make_param<RNG*>("rng","RNG"),
		make_param<int>("minDims","int"),
		make_param<int>("maxDims","int"),
		make_param<double>("maxSizeLog","double")
	}, randomSize_b);
	//int randomType(RNG& rng, int typeMask, int minChannels, int maxChannels);
	overload->addOverload("cvtest", "", "randomType", {
		make_param<RNG*> ("rng","RNG"),
		make_param<int> ("typeMask","int"),
		make_param<int> ("minChannels","int"),
		make_param<int> ("maxChannels","int")
	}, randomType);
	Nan::SetMethod(testns, "randomType", cvtest_general_callback::callback);
	//Mat randomMat(RNG& rng, Size size, int type, double minVal, double maxVal, bool useRoi);
	overload->addOverload("cvtest", "", "randomMat", {
		make_param<RNG*>("rng","RNG"),
		make_param<Size*>("size",Size::name),
		make_param<int>    ("type","int"),
		make_param<double> ("minVal","double"),
		make_param<double> ("maxVal","double"),
		make_param<bool>   ("useRoi","bool")
	
	}, randomMat_a);
	Nan::SetMethod(testns, "randomMat", cvtest_general_callback::callback);
	//Mat randomMat(RNG& rng, const vector<int>& size, int type, double minVal, double maxVal, bool useRoi);
	overload->addOverload("cvtest", "", "randomMat", {
		make_param<RNG*>("rng","RNG"),
		make_param<std::shared_ptr<std::vector<int>>>("size","Array<int>"),
		make_param<int>("type","int"),
		make_param<double>("minVal","double"),
		make_param<double>("maxVal","double"),
		make_param<bool>("useRoi","bool")
	}, randomMat_b);
	//void add(const Mat& a, double alpha, const Mat& b, double beta,
	//	Scalar gamma, Mat& c, int ctype, bool calcAbs = false);
	overload->addOverload("cvtest", "", "add", {
		make_param<Matrix*>("a",Matrix::name),
		make_param<double>("alpha","double"),
		make_param<Matrix*>("b",Matrix::name),
		make_param<double>("beta","double"),
		make_param<Scalar*>("gamma","Scalar"),
		make_param<Matrix*>("c",Matrix::name),
		make_param<int>("ctype","int"),
		make_param<bool>("calcAbs","bool", false)
	}, add);
	Nan::SetMethod(testns, "add", cvtest_general_callback::callback);
	//void multiply(const Mat& a, const Mat& b, Mat& c, double alpha = 1);
	overload->addOverload("cvtest", "", "multiply", {
		make_param<Matrix*>("a",Matrix::name),
		make_param<Matrix*>("b",Matrix::name),
		make_param<Matrix*>("c",Matrix::name),
		make_param<double>("alpha","double", 1)
	}, multiply);
	Nan::SetMethod(testns, "multiply", cvtest_general_callback::callback);
	//void divide(const Mat& a, const Mat& b, Mat& c, double alpha = 1);
	overload->addOverload("cvtest", "", "divide", {
		make_param<Matrix*>("a",Matrix::name),
		make_param<Matrix*>("b",Matrix::name),
		make_param<Matrix*>("c",Matrix::name),
		make_param<double>("alpha","double", 1)
	}, divide);
	Nan::SetMethod(testns, "divide", cvtest_general_callback::callback);
	//
	//void convert(const Mat& src, cv::OutputArray dst, int dtype, double alpha = 1, double beta = 0);
	overload->addOverload("cvtest", "", "convert", {
		make_param<Matrix*>("src",Matrix::name),
		make_param<IOArray*>("dst","IOArray"),
		make_param<int>("dtype","int"),
		make_param<double>("alpha","double", 1),
		make_param<double>("beta","double", 0)
	}, convert);
	Nan::SetMethod(testns, "convert", cvtest_general_callback::callback);
	//void copy(const Mat& src, Mat& dst, const Mat& mask = Mat(), bool invertMask = false);
	overload->addOverload("cvtest", "", "copy", {
		make_param<Matrix*>("src",Matrix::name),
		make_param<Matrix*>("dst",Matrix::name),
		make_param<Matrix*>("mask",Matrix::name,Matrix::create()),
		make_param<bool>("invertMask","bool", false)
	}, copy);
	Nan::SetMethod(testns, "copy", cvtest_general_callback::callback);
	//void set(Mat& dst, const Scalar& gamma, const Mat& mask = Mat());
	overload->addOverload("cvtest", "", "set", {
		make_param<Matrix*>("dst",Matrix::name),
		make_param<Scalar*>("gamma","Scalar" ),
		make_param<Matrix*>("mask",Matrix::name,Matrix:: create())
	}, set);
	Nan::SetMethod(testns, "set", cvtest_general_callback::callback);
	//
	//// working with multi-channel arrays
	//void extract(const Mat& a, Mat& plane, int coi);
	overload->addOverload("cvtest", "", "extract", {
		make_param<Matrix*>("a",Matrix::name),
		make_param<Matrix*>("plane",Matrix::name),
		make_param<int>("coi","int")
	}, extract);
	Nan::SetMethod(testns, "extract", cvtest_general_callback::callback);
	//void insert(const Mat& plane, Mat& a, int coi);
	overload->addOverload("cvtest", "", "insert", {
		make_param<Matrix*>("plane",Matrix::name),
		make_param<Matrix*>("a",Matrix::name),
		make_param<int>("coi","int")
	}, insert);
	Nan::SetMethod(testns, "insert", cvtest_general_callback::callback);
	//
	//// checks that the array does not have NaNs and/or Infs and all the elements are
	//// within [min_val,max_val). idx is the index of the first "bad" element.
	//int check(const Mat& data, double min_val, double max_val, vector<int>* idx);
	overload->addOverload("cvtest", "", "check", {
		make_param<Matrix*>("data",Matrix::name),
		make_param<double>("min_val","double"), 
		make_param<double>("max_val","double"),
		make_param<std::shared_ptr<std::vector<int>>>("idx","Array<int>")
	}, check);
	Nan::SetMethod(testns, "check", cvtest_general_callback::callback);
	//
	//// modifies values that are close to zero
	//void  patchZeros(Mat& mat, double level);
	overload->addOverload("cvtest", "", "patchZeros", {
		make_param<Matrix*>("mat",Matrix::name),
		make_param<double>("level","double")
	}, patchZeros);
	Nan::SetMethod(testns, "patchZeros", cvtest_general_callback::callback);
	//
	//void transpose(const Mat& src, Mat& dst);
	overload->addOverload("cvtest", "", "transpose", {
		make_param<Matrix*>("src",Matrix::name),
		make_param<Matrix*>("dst",Matrix::name)
	}, transpose);
	Nan::SetMethod(testns, "transpose", cvtest_general_callback::callback);
	//void erode(const Mat& src, Mat& dst, const Mat& _kernel, Point anchor = Point(-1, -1),
	//	int borderType = 0, const Scalar& borderValue = Scalar());
	overload->addOverload("cvtest", "", "erode", {
		make_param<Matrix*>("src",Matrix::name),
		make_param<Matrix*>("dst",Matrix::name),
		make_param<Matrix*>("_kernel",Matrix::name), 
		make_param<Point*>("anchor","Point", Point::create(-1, -1)),
		make_param<int>("borderType","int", 0),
		make_param<Scalar*>("borderValue","Scalar",Scalar::create())
	}, erode);
	Nan::SetMethod(testns, "erode", cvtest_general_callback::callback);
	//void dilate(const Mat& src, Mat& dst, const Mat& _kernel, Point anchor = Point(-1, -1),
	//	int borderType = 0, const Scalar& borderValue = Scalar());
	overload->addOverload("cvtest", "", "dilate", {
		make_param<Matrix*>("src",Matrix::name),
		make_param<Matrix*>("dst",Matrix::name),
		make_param<Matrix*>("_kernel",Matrix::name),
		make_param<Point*>("anchor","Point", Point::create(-1, -1)),
		make_param<int>("borderType","int", 0),
		make_param<Scalar*>("borderValue","Scalar", Scalar::create())
	}, dilate);
	Nan::SetMethod(testns, "dilate", cvtest_general_callback::callback);
	//void filter2D(const Mat& src, Mat& dst, int ddepth, const Mat& kernel,
	//	Point anchor, double delta, int borderType,
	//	const Scalar& borderValue = Scalar());
	overload->addOverload("cvtest", "", "filter2D", {
		make_param<Matrix*>("src",Matrix::name),
		make_param<Matrix*>("dst",Matrix::name),
		make_param<int>("ddepth","int"),
		make_param<Matrix*>("kernel",Matrix::name),
		make_param<Point*>("anchor",Point::name),
		make_param<double>("delta","double"),
		make_param<int>("borderType","int"),
		make_param<Scalar*>("borderValue",Scalar::name, Scalar::create())
	}, filter2D);
	Nan::SetMethod(testns, "filter2D", cvtest_general_callback::callback);
	//void copyMakeBorder(const Mat& src, Mat& dst, int top, int bottom, int left, int right,
	//	int borderType, const Scalar& borderValue = Scalar());
	overload->addOverload("cvtest", "", "copyMakeBorder", {
		make_param<Matrix*>("src",Matrix::name),
		make_param<Matrix*>("dst",Matrix::name),
		make_param<int>("top","int"),
		make_param<int>("bottom","int"),
		make_param<int>("left","int"),
		make_param<int>("right","int"),
		make_param<int>("borderType","int"),
		make_param<Scalar*>("borderValue",Scalar::name, Scalar::create())
	}, copyMakeBorder);
	Nan::SetMethod(testns, "copyMakeBorder", cvtest_general_callback::callback);
	//Mat calcSobelKernel2D(int dx, int dy, int apertureSize, int origin = 0);
	overload->addOverload("cvtest", "", "calcSobelKernel2D", {
		make_param<int>("dx","int"),
		make_param<int>("dy","int"),
		make_param<int>("apertureSize","int"),
		make_param<int>("origin","int", 0)
	}, calcSobelKernel2D);
	Nan::SetMethod(testns, "calcSobelKernel2D", cvtest_general_callback::callback);
	//Mat calcLaplaceKernel2D(int aperture_size);
	overload->addOverload("cvtest", "", "calcLaplaceKernel2D", {
		make_param<int>("aperture_size","int")
	}, calcLaplaceKernel2D);
	Nan::SetMethod(testns, "calcLaplaceKernel2D", cvtest_general_callback::callback);
	//
	//void initUndistortMap(const Mat& a, const Mat& k, Size sz, Mat& mapx, Mat& mapy);
	overload->addOverload("cvtest", "", "initUndistortMap", {
		make_param<Matrix*>("a",Matrix::name),
		make_param<Matrix*>("k",Matrix::name),
		make_param<Size*>("sz",Size::name),
		make_param<Matrix*>("mapx",Matrix::name),
		make_param<Matrix*>("mapy",Matrix::name)
	}, initUndistortMap);
	Nan::SetMethod(testns, "initUndistortMap", cvtest_general_callback::callback);
	//
	//void minMaxLoc(const Mat& src, double* minval, double* maxval,
	//	vector<int>* minloc, vector<int>* maxloc, const Mat& mask = Mat());
	/*overload->addOverload("cvtest", "", "minMaxLoc", {
		make_param<Matrix* src
		make_param<double* minval
		make_param<double* maxval
		make_param<vector<int>* minloc
		make_param<vector<int>* maxloc
		make_param<Matrix* mask = Mat()
	}, minMaxLoc);
*/

	//double norm(InputArray src, int normType, InputArray mask = noArray());
	overload->addOverload("cvtest", "", "norm", {
		make_param<IOArray*>("src","IOArray"),
		make_param<int>("normType","int"),
		make_param<IOArray*>("mask","IOArray",IOArray:: noArray())
	}, norm_a);
	Nan::SetMethod(testns, "norm", cvtest_general_callback::callback);
	//double norm(InputArray src1, InputArray src2, int normType, InputArray mask = noArray());
	overload->addOverload("cvtest", "", "norm", {
		make_param<IOArray*>("src1","IOArray"),
		make_param<IOArray*>("src2","IOArray"),
		make_param<int>("normType","int"),
		make_param<IOArray*>("mask","IOArray",IOArray::noArray())
	}, norm_b);
	
	//Scalar mean(const Mat& src, const Mat& mask = Mat());
	overload->addOverload("cvtest", "", "mean", {
		make_param<Matrix*>("src",Matrix::name),
		make_param<Matrix*>("mask",Matrix::name,Matrix::create())
	}, mean);
	Nan::SetMethod(testns, "mean", cvtest_general_callback::callback);

	//double PSNR(InputArray src1, InputArray src2);
	overload->addOverload("cvtest", "", "PSNR", {
		make_param<IOArray*>("src1","IOArray"),
		make_param<IOArray*>("src2","IOArray")
	}, PSNR);
	Nan::SetMethod(testns, "PSNR", cvtest_general_callback::callback);
	//
	//bool cmpUlps(const Mat& data, const Mat& refdata, int expMaxDiff, double* realMaxDiff, vector<int>* idx);
	/*overload->addOverload("cvtest", "", "cmpUlps", {
		Matrix* data
		Matrix* refdata
		int expMaxDiff
		double* realMaxDiff, 
		vector<int>* idx
	}, cmpUlps);*/
	//
	//// compares two arrays. max_diff is the maximum actual difference,
	//// success_err_level is maximum allowed difference, idx is the index of the first
	//// element for which difference is >success_err_level
	//// (or index of element with the maximum difference)
	//int cmpEps(const Mat& data, const Mat& refdata, double* max_diff,
	//	double success_err_level, vector<int>* idx,
	//	bool element_wise_relative_error);

	// (data: _mat.Mat, refdata: _mat.Mat, success_err_level: _st.double, element_wise_relative_error: boolean,
	//cb: (idx: Array<_st.int>, max_diff : _st.double) = > void): CMP_EPS_CODE

	overload->addOverload("cvtest", "", "cmpEps", {
		make_param<Matrix*>("data",Matrix::name),
		make_param<Matrix*>("refdata",Matrix::name),
		make_param<double>("success_err_level","double"),
		make_param<bool>("element_wise_relative_error","bool"),
		make_param<std::shared_ptr<overres::Callback>>("cb","Function")
	}, cmpEps);
	Nan::SetMethod(testns, "cmpEps", cvtest_general_callback::callback);
	//
	//// a wrapper for the previous function. in case of error prints the message to log file.
	//int cmpEps2(TS* ts, const Mat& data, const Mat& refdata, double success_err_level,
	//	bool element_wise_relative_error, const char* desc);
	//overload->addOverload("cvtest", "", "cmpEps2", {}, cmpEps2);


	//
	//int cmpEps2_64f(TS* ts, const double* val, const double* refval, int len,
	//	double eps, const char* param_name);
	//overload->addOverload("cvtest", "", "cmpEps2_64f", {}, cmpEps2_64f);
	//


	//void logicOp(const Mat& src1, const Mat& src2, Mat& dst, char c);
	overload->addOverload("cvtest", "", "logicOp", {
		make_param<Matrix*>("src1",Matrix::name),
		make_param<Matrix*>("src2",Matrix::name),
		make_param<Matrix*>("dst",Matrix::name),
		make_param<std::string>("c","String")
	}, logicOp_a);
	Nan::SetMethod(testns, "logicOp", cvtest_general_callback::callback);
	//void logicOp(const Mat& src, const Scalar& s, Mat& dst, char c);
	overload->addOverload("cvtest", "", "logicOp", {
		make_param<Matrix*>("src",Matrix::name),
		make_param<Scalar*>("s","Scalar"),
		make_param<Matrix*>("dst",Matrix::name),
		make_param<std::string>("c","String")
	}, logicOp_b);

	//void min(const Mat& src1, const Mat& src2, Mat& dst);
	overload->addOverload("cvtest", "", "min", {
		make_param<Matrix*>("src1",Matrix::name),
		make_param<Matrix*>("src2",Matrix::name),
		make_param<Matrix*>("dst",Matrix::name)
	}, min_a);
	Nan::SetMethod(testns, "min", cvtest_general_callback::callback);
	//void min(const Mat& src, double s, Mat& dst);
	overload->addOverload("cvtest", "", "min", {
		make_param<Matrix*>("src",Matrix::name),
		make_param<double>("s","double"),
		make_param<Matrix*>("dst",Matrix::name)
	}, min_b);
	//void max(const Mat& src1, const Mat& src2, Mat& dst);
	overload->addOverload("cvtest", "", "max", {
		make_param<Matrix*>("src1",Matrix::name),
		make_param<Matrix*>("src2",Matrix::name),
		make_param<Matrix*>("dst",Matrix::name)
	}, max_a);
	Nan::SetMethod(testns, "max", cvtest_general_callback::callback);
	//void max(const Mat& src, double s, Mat& dst);
	overload->addOverload("cvtest", "", "max", {
		make_param<Matrix*>("src",Matrix::name),
		make_param<double>("s","double"),
		make_param<Matrix*>("dst",Matrix::name)
	}, max_b);
	//

	//void compare(const Mat& src1, const Mat& src2, Mat& dst, int cmpop);
	overload->addOverload("cvtest", "", "compare", {
		make_param<Matrix*>("src1",Matrix::name),
		make_param<Matrix*>("src2",Matrix::name),
		make_param<Matrix*>("dst",Matrix::name),
		make_param<int>("cmpop","int")
	}, compare_a);
	Nan::SetMethod(testns, "compare", cvtest_general_callback::callback);
	//void compare(const Mat& src, double s, Mat& dst, int cmpop);
	overload->addOverload("cvtest", "", "compare", {
		make_param<Matrix*>("src",Matrix::name),
		make_param<double>("s","double"),
		make_param<Matrix*>("dst",Matrix::name),
		make_param<int>("cmpop","int")
	}, compare_b);
	//void gemm(const Mat& src1, const Mat& src2, double alpha,
	//	const Mat& src3, double beta, Mat& dst, int flags);
	overload->addOverload("cvtest", "", "gemm", {
		make_param<Matrix*>("src1",Matrix::name),
		make_param<Matrix*>("src2",Matrix::name),
		make_param<double>("alpha","double"),
		make_param<Matrix*>("src3",Matrix::name),
		make_param<double>("beta","double"),
		make_param<Matrix*>("dst",Matrix::name),
		make_param<int>("flags","int")
	}, gemm);
	Nan::SetMethod(testns, "gemm", cvtest_general_callback::callback);
	//void transform(const Mat& src, Mat& dst, const Mat& transmat, const Mat& shift);
	overload->addOverload("cvtest", "", "transform", {
		make_param<Matrix*>("src",Matrix::name),
		make_param<Matrix*>("dst",Matrix::name),
		make_param<Matrix*>("transmat",Matrix::name),
		make_param<Matrix*>("shift",Matrix::name)
	}, transform);
	Nan::SetMethod(testns, "transform", cvtest_general_callback::callback);
	//double crossCorr(const Mat& src1, const Mat& src2);
	overload->addOverload("cvtest", "", "crossCorr", {
		make_param<Matrix*>("src1",Matrix::name),
		make_param<Matrix*>("src2",Matrix::name)
	}, crossCorr);
	Nan::SetMethod(testns, "crossCorr", cvtest_general_callback::callback);
	//void threshold(const Mat& src, Mat& dst, double thresh, double maxval, int thresh_type);
	overload->addOverload("cvtest", "", "threshold", {
		make_param<Matrix*>("src",Matrix::name),
		make_param<Matrix*>("dst",Matrix::name),
		make_param<double>("thresh","double"),
		make_param<double>("maxval","double"),
		make_param<int>("thresh_type","int")
	}, threshold);
	Nan::SetMethod(testns, "threshold", cvtest_general_callback::callback);
	////void minMaxIdx(InputArray _img, double* minVal, double* maxVal,
	////	Point* minLoc, Point* maxLoc, InputArray _mask);
	//
	//overload->addOverload("cvtest", "", "minMaxIdx", {}, minMaxIdx);
	////// test images generation functions
	////void fillGradient(Mat& img, int delta = 5);
	//overload->addOverload("cvtest", "", "fillGradient", {}, fillGradient);
	////void smoothBorder(Mat& img, const Scalar& color, int delta = 3);
	//overload->addOverload("cvtest", "", "smoothBorder", {}, smoothBorder);
	//
	//void printVersionInfo(bool useStdOut = true);
	overload->addOverload("cvtest", "", "printVersionInfo", {
		make_param<bool>("useStdOut","bool",true)
	}, printVersionInfo);
	Nan::SetMethod(testns, "printVersionInfo", cvtest_general_callback::callback);



#ifdef HAVE_CUDA
	DeviceManager::Init(target);
#endif
};



POLY_METHOD(cv_test::readSeed) {
	auto str = info.at<std::string>(0);
	auto ret = cvtest::readSeed(str.c_str());
	info.SetReturnValue(ret);
}
POLY_METHOD(cv_test::randUni) {
	auto rng = info.at<RNG		*>(0)->_rng;
	auto a = info.at<Matrix	*	>(1)->_mat;
	auto param1 = info.at<Scalar  	*>(2)->_scalar;
	auto param2 = info.at<Scalar  	*>(3)->_scalar;

	cvtest::randUni(*rng, *a, *param1, *param2);
}
POLY_METHOD(cv_test::getTypeName) {
	auto type = info.at<int>(0);
	auto ret = std::string(cvtest::getTypeName(type));
	info.SetReturnValue(ret);
}
POLY_METHOD(cv_test::typeByName) {
	auto type_name = info.at<std::string>(0);
	auto ret = cvtest::typeByName(type_name.c_str());
	info.SetReturnValue(ret);
}
//POLY_METHOD(cv_test::vec2str){}
POLY_METHOD(cv_test::getMinVal) {
	auto depth = info.at<int>(0);
	auto ret = cvtest::getMinVal(depth);
	info.SetReturnValue(ret);
}
POLY_METHOD(cv_test::getMaxVal) {
	auto depth = info.at<int>(0);
	auto ret = cvtest::getMaxVal(depth);
	info.SetReturnValue(ret);
}
POLY_METHOD(cv_test::randomSize_a) {
	auto rng = info.at<RNG	*>(0)->_rng;
	auto maxSizeLog = info.at<double	>(1);

	auto ret = new Size();
	ret->_size = std::make_shared<cv::Size>(cvtest::randomSize(*rng, maxSizeLog));

	info.SetReturnValue(ret);
}
POLY_METHOD(cv_test::randomSize_b) {
	auto     rng = info.at<RNG*>(0)->_rng;
	auto     minDims = info.at<int>(1);
	auto     maxDims = info.at<int>(2);
	auto     maxSizeLog = info.at<double>(3);

	auto sz = std::make_shared<std::vector<int>>();

	cvtest::randomSize(*rng, minDims, maxDims, maxSizeLog, *sz);

	info.SetReturnValue(sz);
}
POLY_METHOD(cv_test::randomType) {
	auto rng = info.at<RNG*>(0)->_rng;
	auto typeMask 		= info.at<int >(1);
	auto minChannels 	= info.at<int >(2);
	auto maxChannels	= info.at<int >(3);

	auto ret = cvtest::randomType(*rng, typeMask, minChannels, maxChannels);
	info.SetReturnValue(ret);
}
POLY_METHOD(cv_test::randomMat_a) {
	auto rng		= info.at<RNG*	>(0)->_rng;	
	auto size		= info.at<Size*	>(1)->_size;
	auto type 		= info.at<int	>(2);	
	auto minVal		= info.at<double>(3);	
	auto maxVal		= info.at<double>(4);	
	auto useRoi		= info.at<bool	>(5);

	auto ret = new Matrix();
	ret->_mat = std::make_shared<cv::Mat>(cvtest::randomMat(*rng, *size, type, minVal, maxVal, useRoi));

	info.SetReturnValue(ret);
}
POLY_METHOD(cv_test::randomMat_b) {
	auto rng = info.at<RNG*>(0)->_rng;
	auto size = info.at<std::shared_ptr<std::vector<int>>>(1);
	auto type = info.at<int>(2);
	auto minVal = info.at<double>(3);
	auto maxVal = info.at<double>(4);
	auto useRoi = info.at<bool>(5);

	auto ret = new Matrix();
	ret->_mat = std::make_shared<cv::Mat>(cvtest::randomMat(*rng, *size, type, minVal, maxVal, useRoi));

	info.SetReturnValue(ret);
}
POLY_METHOD(cv_test::add) {
	auto a			= info.at<Matrix*>(0)->_mat;
	auto alpha		= info.at<double>(1);
	auto b			= info.at<Matrix*>(2)->_mat;
	auto beta		= info.at<double>(3);
	auto gamma		= info.at<Scalar*>(4)->_scalar;
	auto c			= info.at<Matrix*>(5)->_mat;
	auto ctype		= info.at<int>(6);
	auto calcAbs 	= info.at<bool>(7);

	cvtest::add(
		*a		,
		alpha	,
		*b		,
		beta	,
		*gamma	,
		*c		,
		ctype	,
		calcAbs
	);
}
POLY_METHOD(cv_test::multiply) {
	auto a			= info.at<Matrix*>(0)->_mat; 
	auto b			= info.at<Matrix*>(1)->_mat; 
	auto c			= info.at<Matrix*>(2)->_mat; 
	auto alpha		= info.at<double>(3);

	cvtest::multiply(*a, *b, *c, alpha);
}
POLY_METHOD(cv_test::divide) {
	auto a = info.at<Matrix*>(0)->_mat;
	auto b = info.at<Matrix*>(1)->_mat;
	auto c = info.at<Matrix*>(2)->_mat;
	auto alpha = info.at<double>(3);

	cvtest::divide(*a, *b, *c, alpha);
}
POLY_METHOD(cv_test::convert) {
	auto src = info.at<Matrix*>(0)->_mat;
	auto dst = info.at<IOArray*>(1)->GetOutputArray();
	auto dtype = info.at<int>(2);
	auto alpha = info.at<double>(3);
	auto beta = info.at<double>(4);

	cvtest::convert(*src, dst, dtype, alpha, beta);
}
POLY_METHOD(cv_test::copy) {
	auto src		= info.at<Matrix*>(0)->_mat;
	auto dst		= info.at<Matrix*>(1)->_mat;
	auto mask 		= info.at<Matrix*>(2)->_mat;
	auto invertMask = info.at<bool>(3);

	cvtest::copy(*src, *dst, *mask, invertMask);
}
POLY_METHOD(cv_test::set) {
	auto dst		= info.at<Matrix*>(0)->_mat; 
	auto gamma		= info.at<Scalar*>(1)->_scalar; 
	auto mask		= info.at<Matrix*>(2)->_mat; 

	cvtest::set(*dst, *gamma, *mask);
}
POLY_METHOD(cv_test::extract) {
	auto a		= info.at<Matrix*>(0)->_mat;
	auto plane	= info.at<Matrix*>(1)->_mat; 
	auto coi	= info.at<int>(2);

	cvtest::extract(*a, *plane, coi);
}
POLY_METHOD(cv_test::insert) {
	auto plane	= info.at<Matrix*>(0)->_mat;
	auto a		= info.at<Matrix*>(1)->_mat;
	auto coi	= info.at<int>(2);

	cvtest::insert(*plane, *a, coi);
}
POLY_METHOD(cv_test::check) {
	auto data		= info.at<Matrix*>(0)->_mat;
	auto min_val	= info.at<double>(1);
	auto max_val 	= info.at<double>(2);
	auto idx		= info.at<std::shared_ptr<std::vector<int>>>(3);

	auto ret = cvtest::check(*data, min_val, max_val, idx.get());
	info.SetReturnValue(ret);
}
POLY_METHOD(cv_test::patchZeros) {
	auto  mat	= info.at<Matrix*>(0)->_mat;
	auto  level = info.at<double>(1);

	cvtest::patchZeros(*mat, level);
}
POLY_METHOD(cv_test::transpose) {
	auto src = info.at<Matrix*>(0)->_mat;
	auto dst = info.at<Matrix*>(1)->_mat;

	cvtest::transpose(*src, *dst);
}
POLY_METHOD(cv_test::erode) {
	auto src			= info.at<Matrix*>(0)->_mat;		
	auto dst			= info.at<Matrix*>(1)->_mat;		
	auto _kernel		= info.at<Matrix*>(2)->_mat;		
	auto anchor			= info.at<Point*>(3)->_point;
	auto borderType		= info.at<int>(4);
	auto borderValue = info.at<Scalar*>(5)->_scalar;

	cvtest::erode(*src, *dst, *_kernel, *anchor, borderType, *borderValue);
}
POLY_METHOD(cv_test::dilate) {
	auto src = info.at<Matrix*>(0)->_mat;
	auto dst = info.at<Matrix*>(1)->_mat;
	auto _kernel = info.at<Matrix*>(2)->_mat;
	auto anchor = info.at<Point*>(3)->_point;
	auto borderType = info.at<int>(4);
	auto borderValue = info.at<Scalar*>(5)->_scalar;

	cvtest::dilate(*src, *dst, *_kernel, *anchor, borderType, *borderValue);
}
POLY_METHOD(cv_test::filter2D) {
	auto src			= info.at<Matrix*>(0)->_mat;		
	auto dst			= info.at<Matrix*>(1)->_mat;		
	auto ddepth			= info.at<int>(2);
	auto kernel			= info.at<Matrix*>(3)->_mat;
	auto anchor			= info.at<Point*>(4)->_point;
	auto delta			= info.at<double>(5);
	auto borderType		= info.at<int>(6);
	auto borderValue 	= info.at<Scalar*>(7)->_scalar;

	cvtest::filter2D(
		*src				,
		*dst				,
		ddepth			,
		*kernel			,
		*anchor			,
		delta			,
		borderType		,
		*borderValue
	);
}


POLY_METHOD(cv_test::copyMakeBorder) {
	auto src			= info.at<Matrix*>(0)->_mat;
	auto dst			= info.at<Matrix*>(1)->_mat; 
	auto top			= info.at<int>(2);		
	auto bottom			= info.at<int>(3);		
	auto left			= info.at<int>(4);		
	auto right			= info.at<int>(5);		
	auto borderType		= info.at<int>(6);		
	auto borderValue	= info.at<Scalar*>(7)->_scalar;

	cvtest::copyMakeBorder(
		*src,
		*dst,
		top,
		bottom,
		left,
		right,
		borderType,
		*borderValue
	);
}
POLY_METHOD(cv_test::calcSobelKernel2D) {
	auto dx				= info.at<int>(0);
	auto dy				= info.at<int>(1); 
	auto apertureSize	= info.at<int>(2); 
	auto origin 		= info.at<int>(3); 

	auto ret = new Matrix();
	ret->_mat = std::make_shared<cv::Mat>(cvtest::calcSobelKernel2D(dx, dy, apertureSize, origin));

	info.SetReturnValue(ret);
}
POLY_METHOD(cv_test::calcLaplaceKernel2D) {
	auto aperture_size = info.at<int>(0);

	auto ret = new Matrix();
	ret->_mat = std::make_shared<cv::Mat>(cvtest::calcLaplaceKernel2D(aperture_size));

	info.SetReturnValue(ret);
}
POLY_METHOD(cv_test::initUndistortMap) {
	auto a		= info.at<Matrix*>(0)->_mat; 
	auto k		= info.at<Matrix*>(1)->_mat; 
	auto sz		= info.at<Size*>(2)->_size;
	auto mapx	= info.at<Matrix*>(3)->_mat; 
	auto mapy	= info.at<Matrix*>(4)->_mat; 

	cvtest::initUndistortMap(
		*a,
		*k,
		*sz,
		*mapx,
		*mapy);
}

//POLY_METHOD(cv_test::minMaxLoc) {}

POLY_METHOD(cv_test::norm_a) {
	auto src = info.at<IOArray*>(0)->GetInputArray();
	auto normType = info.at<int>(1);
	auto mask = info.at<IOArray*>(2)->GetInputArray();

	auto ret = cvtest::norm(src, normType, mask);
	info.SetReturnValue(ret);
}

POLY_METHOD(cv_test::norm_b) {
	auto src1 = info.at<IOArray*>(0)->GetInputArray();
	auto src2 = info.at<IOArray*>(1)->GetInputArray();
	auto normType = info.at<int>(2);
	auto mask = info.at<IOArray*>(3)->GetInputArray();

	auto ret = cvtest::norm(src1,src2, normType, mask);
	info.SetReturnValue(ret);

}
POLY_METHOD(cv_test::mean) {
	auto src  = info.at<Matrix*>(0)->_mat;
	auto mask = info.at<Matrix*>(1)->_mat;

	auto ret = new Scalar();
	ret->_scalar = std::make_shared<cv::Scalar>(cvtest::mean(*src, *mask));
	info.SetReturnValue(ret);
}
POLY_METHOD(cv_test::PSNR) {
	auto src1  = info.at<IOArray*>(0)->GetInputArray();
	auto src2  = info.at<IOArray*>(1)->GetInputArray();

	auto ret = cvtest::PSNR(src1, src1);
	info.SetReturnValue(ret);
}

//POLY_METHOD(cv_test::cmpUlps) {}


POLY_METHOD(cv_test::cmpEps) {
	auto data = info.at<Matrix*>(0)->_mat;
	auto refdata = info.at<Matrix*>(1)->_mat;
	auto success_err_level = info.at<double>(2);
	auto element_wise_relative_error = info.at<bool>(3);
	auto cb = info.at<std::shared_ptr< overres::Callback>>(4);  // (idx: Array<_st.int>, max_diff : _st.double) = > void): CMP_EPS_CODE

	auto idx = std::make_shared<std::vector<int>>();
	double max_diff;

	auto ret = cvtest::cmpEps(*data, *refdata, &max_diff, success_err_level, idx.get(), element_wise_relative_error);
	cb->Call({ overres::make_value(idx), overres::make_value(max_diff) });

	info.SetReturnValue(ret);

}
//POLY_METHOD(cv_test::cmpEps2) {}
//POLY_METHOD(cv_test::cmpEps2_64f) {}

POLY_METHOD(cv_test::logicOp_a) {
	auto src1 = info.at<Matrix*>(0)->_mat;
	auto src2 = info.at<Matrix*>(1)->_mat;
	auto dst = info.at<Matrix*>(2)->_mat;
	auto c = info.at<std::string>(3);

	cvtest::logicOp(*src1, *src2, *dst, c[0]);

}
POLY_METHOD(cv_test::logicOp_b) {
	auto src1 = info.at<Matrix*>(0)->_mat;
	auto s = info.at<Scalar*>(1)->_scalar;
	auto dst = info.at<Matrix*>(2)->_mat;
	auto c = info.at<std::string>(3);

	cvtest::logicOp(*src1, *s, *dst, c[0]);
}
POLY_METHOD(cv_test::min_a) {
	auto src1 = info.at<Matrix*>(0)->_mat; 
	auto src2 = info.at<Matrix*>(1)->_mat; 
	auto dst  = info.at<Matrix*>(2)->_mat;

	cvtest::min(*src1, *src2, *dst);
}
POLY_METHOD(cv_test::min_b) {
	auto src = info.at<Matrix*>(0)->_mat;
	auto s = info.at<double>(1);
	auto dst = info.at<Matrix*>(2)->_mat;

	cvtest::min(*src, s, *dst);
}
POLY_METHOD(cv_test::max_a) {
	auto src1 = info.at<Matrix*>(0)->_mat;
	auto src2 = info.at<Matrix*>(1)->_mat;
	auto dst = info.at<Matrix*>(2)->_mat;

	cvtest::max(*src1, *src2, *dst);
}
POLY_METHOD(cv_test::max_b) {
	auto src = info.at<Matrix*>(0)->_mat;
	auto s = info.at<double>(1);
	auto dst = info.at<Matrix*>(2)->_mat;

	cvtest::max(*src, s, *dst);
}
POLY_METHOD(cv_test::compare_a) {
	auto src1	= info.at<Matrix*>(0)->_mat; 
	auto src2	= info.at<Matrix*>(1)->_mat; 
	auto dst	= info.at<Matrix*>(2)->_mat; 
	auto cmpop	= info.at<int>(3);

	cvtest::compare(*src1, *src2, *dst, cmpop);
}
POLY_METHOD(cv_test::compare_b) {
	auto src = info.at<Matrix*>(0)->_mat;
	auto s = info.at<double>(1);
	auto dst = info.at<Matrix*>(2)->_mat;
	auto cmpop = info.at<int>(3);

	cvtest::compare(*src, s, *dst, cmpop);
}
POLY_METHOD(cv_test::gemm) {
	auto src1	= info.at<Matrix*>(0)->_mat;
	auto src2	= info.at<Matrix*>(1)->_mat;
	auto alpha	= info.at<double>(2);
	auto src3	= info.at<Matrix*>(3)->_mat;
	auto beta	= info.at<double>(4);
	auto dst	= info.at<Matrix*>(5)->_mat;
	auto flags	= info.at<int>(6);

	cvtest::gemm(
		*src1	,
		*src2	,
		alpha	,
		*src3	,
		beta	,
		*dst		,
		flags);
}
POLY_METHOD(cv_test::transform) {
	auto src		= info.at<Matrix*>(0)->_mat; 
	auto dst		= info.at<Matrix*>(1)->_mat; 
	auto transmat	= info.at<Matrix*>(2)->_mat; 
	auto shift		= info.at<Matrix*>(3)->_mat;

	cvtest::transform(*src, *dst, *transmat, *shift);
}
POLY_METHOD(cv_test::crossCorr) {
	auto src1 = info.at<Matrix*>(0)->_mat;
	auto src2 = info.at<Matrix*>(1)->_mat;

	auto ret = cvtest::crossCorr(*src1, *src2);
	info.SetReturnValue(ret);
}
POLY_METHOD(cv_test::threshold) {
	auto src			= info.at<Matrix*>(0)->_mat; 
	auto dst			= info.at<Matrix*>(1)->_mat; 
	auto thresh			= info.at<double>(2);	
	auto maxval			= info.at<double>(3);	
	auto thresh_type	= info.at<int>(4);

	cvtest::threshold(
		*src				,
		*dst				,
		thresh			,
		maxval			,
		thresh_type
	);
}
//POLY_METHOD(cv_test::minMaxIdx) {}
//POLY_METHOD(cv_test::fillGradient) {}
//POLY_METHOD(cv_test::smoothBorder) {}

POLY_METHOD(cv_test::printVersionInfo) {
	auto useStdOut = info.at<bool>(0);
	cvtest::printVersionInfo(useStdOut);
}