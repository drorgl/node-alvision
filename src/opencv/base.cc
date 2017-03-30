#include "base.h"

void
base::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {

	auto cvns = Nan::New<v8::Object>();
	target->Set(Nan::New("cv").ToLocalChecked(), cvns);

	auto errorns = Nan::New<v8::Object>();
	cvns->Set(Nan::New("Error").ToLocalChecked(), errorns);


	auto Code =  CreateNamedObject(errorns, "Code");
	SetObjectProperty(Code, "StsOk", 0);
	SetObjectProperty(Code, "StsBackTrace", -1);
	SetObjectProperty(Code, "StsError", -2);
	SetObjectProperty(Code, "StsInternal", -3);
	SetObjectProperty(Code, "StsNoMem", -4);
	SetObjectProperty(Code, "StsBadArg", -5);
	SetObjectProperty(Code, "StsBadFunc", -6);
	SetObjectProperty(Code, "StsNoConv", -7);
	SetObjectProperty(Code, "StsAutoTrace", -8);
	SetObjectProperty(Code, "HeaderIsNull", -9);
	SetObjectProperty(Code, "BadImageSize", -10);
	SetObjectProperty(Code, "BadOffset", -11);
	SetObjectProperty(Code, "BadDataPtr", -12);
	SetObjectProperty(Code, "BadStep", -13);
	SetObjectProperty(Code, "BadModelOrChSeq", -14);
	SetObjectProperty(Code, "BadNumChannels", -15);
	SetObjectProperty(Code, "BadNumChannel1U", -16);
	SetObjectProperty(Code, "BadDepth", -17);
	SetObjectProperty(Code, "BadAlphaChannel", -18);
	SetObjectProperty(Code, "BadOrder",  -19);
	SetObjectProperty(Code, "BadOrigin", -20);
	SetObjectProperty(Code, "BadAlign",  -21);
	SetObjectProperty(Code, "BadCallBack", -22);
	SetObjectProperty(Code, "BadTileSize", -23);
	SetObjectProperty(Code, "BadCOI", -24);
	SetObjectProperty(Code, "BadROISize",  -25);
	SetObjectProperty(Code, "MaskIsTiled", -26);
	SetObjectProperty(Code, "StsNullPtr", -27);
	SetObjectProperty(Code, "StsVecLengthErr", -28);
	SetObjectProperty(Code, "StsFilterStructContentErr", -29);
	SetObjectProperty(Code, "StsKernelStructContentErr", -30);
	SetObjectProperty(Code, "StsFilterOffsetErr", -31);
	SetObjectProperty(Code, "StsBadSize", -201);
	SetObjectProperty(Code, "StsDivByZero", -202);
	SetObjectProperty(Code, "StsInplaceNotSupported", -203);
	SetObjectProperty(Code, "StsObjectNotFound", -204);
	SetObjectProperty(Code, "StsUnmatchedFormats", -205);
	SetObjectProperty(Code, "StsBadFlag", -206);
	SetObjectProperty(Code, "StsBadPoint", -207);
	SetObjectProperty(Code, "StsBadMask", -208);
	SetObjectProperty(Code, "StsUnmatchedSizes", -209);
	SetObjectProperty(Code, "StsUnsupportedFormat", -210);
	SetObjectProperty(Code, "StsOutOfRange", -211);
	SetObjectProperty(Code, "StsParseError", -212);
	SetObjectProperty(Code, "StsNotImplemented", -213);
	SetObjectProperty(Code, "StsBadMemBlock", -214);
	SetObjectProperty(Code, "StsAssert", -215);
	SetObjectProperty(Code, "GpuNotSupported", -216);
	SetObjectProperty(Code, "GpuApiCallError", -217);
	SetObjectProperty(Code, "OpenGlNotSupported", -218);
	SetObjectProperty(Code, "OpenGlApiCallError", -219);
	SetObjectProperty(Code, "OpenCLApiCallError", -220);
	SetObjectProperty(Code, "OpenCLDoubleNotSupported", -221);
	SetObjectProperty(Code, "OpenCLInitError", -222);
	SetObjectProperty(Code, "OpenCLNoAMDBlasFft", -223);
	
	auto DecompTypes = CreateNamedObject(target, "DecompTypes");
	SetObjectProperty(DecompTypes, "DECOMP_LU", 0);
	SetObjectProperty(DecompTypes, "DECOMP_SVD", 1);
	SetObjectProperty(DecompTypes, "DECOMP_EIG", 2);
	SetObjectProperty(DecompTypes, "DECOMP_CHOLESKY", 3);
	SetObjectProperty(DecompTypes, "DECOMP_QR", 4);
	SetObjectProperty(DecompTypes, "DECOMP_NORMAL", 16);
	overload->add_type_alias("DecompTypes", "int");
			

	auto NormTypes = CreateNamedObject(target, "NormTypes");
	SetObjectProperty(NormTypes, "NORM_INF", 1);
	SetObjectProperty(NormTypes, "NORM_L1",  2);
	SetObjectProperty(NormTypes, "NORM_L2",  4);
	SetObjectProperty(NormTypes, "NORM_L2SQR", 5);
	SetObjectProperty(NormTypes, "NORM_HAMMING", 6);
	SetObjectProperty(NormTypes, "NORM_HAMMING2", 7);
	SetObjectProperty(NormTypes, "NORM_TYPE_MASK", 7);
	SetObjectProperty(NormTypes, "NORM_RELATIVE", 8);
	SetObjectProperty(NormTypes, "NORM_MINMAX", 32);
	SetObjectProperty(NormTypes, "NORM_RELATIVE_L2", cv::NORM_L2 | cv::NORM_RELATIVE);
	overload->add_type_alias("NormTypes", "int");


	auto CmpTypes = CreateNamedObject(target, "CmpTypes");
	SetObjectProperty(CmpTypes, "CMP_EQ", 0);
	SetObjectProperty(CmpTypes, "CMP_GT", 1);
	SetObjectProperty(CmpTypes, "CMP_GE", 2);
	SetObjectProperty(CmpTypes, "CMP_LT", 3);
	SetObjectProperty(CmpTypes, "CMP_LE", 4);
	SetObjectProperty(CmpTypes, "CMP_NE", 5);
	overload->add_type_alias("CmpTypes", "int");


	auto GemmFlags = CreateNamedObject(target, "GemmFlags");
	SetObjectProperty(GemmFlags, "GEMM_1_T", 1);
	SetObjectProperty(GemmFlags, "GEMM_2_T", 2);
	SetObjectProperty(GemmFlags, "GEMM_3_T", 4);
	overload->add_type_alias("GemmFlags", "int");


	auto DftFlags = CreateNamedObject(target, "DftFlags");
	SetObjectProperty(DftFlags, "DFT_INVERSE", 1);
	SetObjectProperty(DftFlags, "DFT_SCALE", 2);
	SetObjectProperty(DftFlags, "DFT_ROWS", 4);
	SetObjectProperty(DftFlags, "DFT_COMPLEX_OUTPUT", 16);
	SetObjectProperty(DftFlags, "DFT_REAL_OUTPUT", 32);
	SetObjectProperty(DftFlags, "DCT_INVERSE", cv::DFT_INVERSE);
	SetObjectProperty(DftFlags, "DCT_ROWS", cv::DFT_ROWS);
	overload->add_type_alias("DftFlags", "int");

	auto BorderTypes = CreateNamedObject(target, "BorderTypes");
	SetObjectProperty(BorderTypes, "BORDER_CONSTANT", 0);
	SetObjectProperty(BorderTypes, "BORDER_REPLICATE", 1);
	SetObjectProperty(BorderTypes, "BORDER_REFLECT", 2);
	SetObjectProperty(BorderTypes, "BORDER_WRAP", 3);
	SetObjectProperty(BorderTypes, "BORDER_REFLECT_101", 4);
	SetObjectProperty(BorderTypes, "BORDER_TRANSPARENT", 5);
	SetObjectProperty(BorderTypes, "BORDER_REFLECT101", cv::BORDER_REFLECT_101);
	SetObjectProperty(BorderTypes, "BORDER_DEFAULT", cv::BORDER_REFLECT_101);
	SetObjectProperty(BorderTypes, "BORDER_ISOLATED", 16);
	overload->add_type_alias("BorderTypes", "int");

	//
	//
	//
	//interface Ierror {
	//	(_code : cv.Error.Code, _err : string, _func : string, _file : string, _line : _st.int) : void;
	//
	//	(exc : _core.IException) : void;
	//}
	//
	//export var error : Ierror = alvision_module.error;
	//
	//
	//
	//
	///** same as cv::error, but does not return */
	//interface IerrorNoReturn {
	//	(code : cv.Error.Code, _err : string, _func : string, _file : string, _line : _st.int) : void;
	//}
	//
	//export var errorNoReturn : IerrorNoReturn = alvision_module.errorNoReturn;







	/*
	* Hamming distance functor - counts the bit differences between two strings - useful for the Brief descriptor
	* bit count of A exclusive XOR'ed with B
	*/
	//export interface Hamming
	//{
	//	//    enum { normType = NORM_HAMMING };
	//	//    typedef unsigned char ValueType;
	//	//    typedef int ResultType;
	//	//
	//	//    /** this will count the bits in a ^ b
	//	//     */
	//	//    ResultType operator()( const unsigned char* a, const unsigned char* b, int size ) const;
	//};
	//
	//typedef Hamming HammingLUT;

	/////////////////////////////////// inline norms ////////////////////////////////////


	//template<typename _Tp> inline _Tp cv_abs(_Tp x) { return std::abs(x); }
	//inline int cv_abs(uchar x) { return x; }
	//inline int cv_abs(schar x) { return std::abs(x); }
	//inline int cv_abs(ushort x) { return x; }
	//inline int cv_abs(short x) { return std::abs(x); }
	//
	//template<typename _Tp, typename _AccTp> static inline
	//_AccTp normL2Sqr(const _Tp* a, int n)
	//{
	//    _AccTp s = 0;
	//    int i=0;
	//#if CV_ENABLE_UNROLLED
	//    for( ; i <= n - 4; i += 4 )
	//    {
	//        _AccTp v0 = a[i], v1 = a[i+1], v2 = a[i+2], v3 = a[i+3];
	//        s += v0*v0 + v1*v1 + v2*v2 + v3*v3;
	//    }
	//#endif
	//    for( ; i < n; i++ )
	//    {
	//        _AccTp v = a[i];
	//        s += v*v;
	//    }
	//    return s;
	//}
	//
	//template<typename _Tp, typename _AccTp> static inline
	//_AccTp normL1(const _Tp* a, int n)
	//{
	//    _AccTp s = 0;
	//    int i = 0;
	//#if CV_ENABLE_UNROLLED
	//    for(; i <= n - 4; i += 4 )
	//    {
	//        s += (_AccTp)cv_abs(a[i]) + (_AccTp)cv_abs(a[i+1]) +
	//            (_AccTp)cv_abs(a[i+2]) + (_AccTp)cv_abs(a[i+3]);
	//    }
	//#endif
	//    for( ; i < n; i++ )
	//        s += cv_abs(a[i]);
	//    return s;
	//}
	//
	//template<typename _Tp, typename _AccTp> static inline
	//_AccTp normInf(const _Tp* a, int n)
	//{
	//    _AccTp s = 0;
	//    for( int i = 0; i < n; i++ )
	//        s = std::max(s, (_AccTp)cv_abs(a[i]));
	//    return s;
	//}
	//
	//template<typename _Tp, typename _AccTp> static inline
	//_AccTp normL2Sqr(const _Tp* a, const _Tp* b, int n)
	//{
	//    _AccTp s = 0;
	//    int i= 0;
	//#if CV_ENABLE_UNROLLED
	//    for(; i <= n - 4; i += 4 )
	//    {
	//        _AccTp v0 = _AccTp(a[i] - b[i]), v1 = _AccTp(a[i+1] - b[i+1]), v2 = _AccTp(a[i+2] - b[i+2]), v3 = _AccTp(a[i+3] - b[i+3]);
	//        s += v0*v0 + v1*v1 + v2*v2 + v3*v3;
	//    }
	//#endif
	//    for( ; i < n; i++ )
	//    {
	//        _AccTp v = _AccTp(a[i] - b[i]);
	//        s += v*v;
	//    }
	//    return s;
	//}
	//
	//static inline float normL2Sqr(const float* a, const float* b, int n)
	//{
	//    float s = 0.f;
	//    for( int i = 0; i < n; i++ )
	//    {
	//        float v = a[i] - b[i];
	//        s += v*v;
	//    }
	//    return s;
	//}
	//
	//template<typename _Tp, typename _AccTp> static inline
	//_AccTp normL1(const _Tp* a, const _Tp* b, int n)
	//{
	//    _AccTp s = 0;
	//    int i= 0;
	//#if CV_ENABLE_UNROLLED
	//    for(; i <= n - 4; i += 4 )
	//    {
	//        _AccTp v0 = _AccTp(a[i] - b[i]), v1 = _AccTp(a[i+1] - b[i+1]), v2 = _AccTp(a[i+2] - b[i+2]), v3 = _AccTp(a[i+3] - b[i+3]);
	//        s += std::abs(v0) + std::abs(v1) + std::abs(v2) + std::abs(v3);
	//    }
	//#endif
	//    for( ; i < n; i++ )
	//    {
	//        _AccTp v = _AccTp(a[i] - b[i]);
	//        s += std::abs(v);
	//    }
	//    return s;
	//}
	//
	//inline float normL1(const float* a, const float* b, int n)
	//{
	//    float s = 0.f;
	//    for( int i = 0; i < n; i++ )
	//    {
	//        s += std::abs(a[i] - b[i]);
	//    }
	//    return s;
	//}
	//
	//inline int normL1(const uchar* a, const uchar* b, int n)
	//{
	//    int s = 0;
	//    for( int i = 0; i < n; i++ )
	//    {
	//        s += std::abs(a[i] - b[i]);
	//    }
	//    return s;
	//}
	//
	//template<typename _Tp, typename _AccTp> static inline
	//_AccTp normInf(const _Tp* a, const _Tp* b, int n)
	//{
	//    _AccTp s = 0;
	//    for( int i = 0; i < n; i++ )
	//    {
	//        _AccTp v0 = a[i] - b[i];
	//        s = std::max(s, std::abs(v0));
	//    }
	//    return s;
	//}

	/** @brief Computes the cube root of an argument.

	The function cubeRoot computes \f$\sqrt[3]{\texttt{val}}\f$. Negative arguments are handled correctly.
	NaN and Inf are not handled. The accuracy approaches the maximum possible accuracy for
	single-precision data.
	@param val A function argument.
	*/

//	interface IcubeRoot {
//		(val : _st.float) : _st.float;
//	}
//	export var cubeRoot : IcubeRoot = alvision_module.cubeRoot;
//
//	/** @brief Calculates the angle of a 2D vector in degrees.
//
//	The function fastAtan2 calculates the full-range angle of an input 2D vector. The angle is measured
//	in degrees and varies from 0 to 360 degrees. The accuracy is about 0.3 degrees.
//	@param x x-coordinate of the vector.
//	@param y y-coordinate of the vector.
//	*/
//
//	interface IfastAtan2 {
//		fastAtan2(y: _st.float, x : _st.float) : _st.float;
//	}
//
//	export var fastAtan2 : IfastAtan2 = alvision_module.fastAtan2;
//
//	/** proxy for hal::LU */
//	interface ILU {
//		//(float* A, size_t astep, int m, float* b, size_t bstep, int n): int;
//		//(double * A, size_t astep, int m, double * b, size_t bstep, int n) : int;
//	}
//
//	export var LU : ILU = alvision_module.LU;
//
//	//CV_EXPORTS int LU(float* A, size_t astep, int m, float* b, size_t bstep, int n);
//	/** proxy for hal::LU */
//	//CV_EXPORTS int LU(double* A, size_t astep, int m, double* b, size_t bstep, int n);
//	/** proxy for hal::Cholesky */
//
//	interface ICholesky {
//		//    (float * A, size_t astep, int m, float * b, size_t bstep, int n) : boolean;
//		//    (double * A, size_t astep, int m, double * b, size_t bstep, int n) : boolean;
//	}
//
//	export var Cholesky : ICholesky = alvision_module.Cholesky;

	//CV_EXPORTS bool Cholesky(float* A, size_t astep, int m, float* b, size_t bstep, int n);
	/** proxy for hal::Cholesky */
	//CV_EXPORTS bool Cholesky(double* A, size_t astep, int m, double* b, size_t bstep, int n);

	


}