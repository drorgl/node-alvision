#include "imgproc.h"
#include "IOArray.h"
#include "Matrix.h"
#include "types/Size.h"
#include "types/Point.h"
#include "types/Scalar.h"
#include "SparseMat.h"
#include "types/Rect.h"
#include "types/RotatedRect.h"
#include "types/TermCriteria.h"
#include "types/Moments.h"
#include "imgproc/GeneralizedHough.h"
#include "imgproc/GeneralizedHoughBallard.h"
#include "imgproc/GeneralizedHoughGuil.h"
#include "imgproc/CLAHE.h"
#include "imgproc/Subdiv2D.h"
#include "imgproc/LineSegmentDetector.h"
#include "imgproc/LineIterator.h"

namespace imgproc_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("imgproc_general_callback is empty");
		}
		return overload->execute("imgproc", info);
	}
}

static std::shared_ptr<Scalar> morphologyDefaultBorderValue_all() {
	return Scalar::all(DBL_MAX); 
}


void
imgproc::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	imgproc_general_callback::overload = overload;



	auto MorphTypes = CreateNamedObject(target, "MorphTypes");
	SetObjectProperty(MorphTypes, "MORPH_ERODE", 0);
	SetObjectProperty(MorphTypes, "MORPH_DILATE", 1);
	SetObjectProperty(MorphTypes, "MORPH_OPEN", 2);
	SetObjectProperty(MorphTypes, "MORPH_CLOSE", 3);
	SetObjectProperty(MorphTypes, "MORPH_GRADIENT", 4);
	SetObjectProperty(MorphTypes, "MORPH_TOPHAT", 5);
	SetObjectProperty(MorphTypes, "MORPH_BLACKHAT", 6);
	SetObjectProperty(MorphTypes, "MORPH_HITMISS", 7);
	overload->add_type_alias("MorphTypes", "int");


	auto MorphShapes = CreateNamedObject(target, "MorphShapes");
	SetObjectProperty(MorphShapes, "MORPH_RECT", 0);
	SetObjectProperty(MorphShapes, "MORPH_CROSS", 1);
	SetObjectProperty(MorphShapes, "MORPH_ELLIPSE", 2);
	overload->add_type_alias("MorphShapes", "int");


	auto InterpolationFlags = CreateNamedObject(target, "InterpolationFlags");
	SetObjectProperty(InterpolationFlags, "INTER_NEAREST", 0);
	SetObjectProperty(InterpolationFlags, "INTER_LINEAR", 1);
	SetObjectProperty(InterpolationFlags, "INTER_CUBIC", 2);
	SetObjectProperty(InterpolationFlags, "INTER_AREA", 3);
	SetObjectProperty(InterpolationFlags, "INTER_LANCZOS4", 4);
	SetObjectProperty(InterpolationFlags, "INTER_MAX", 7);
	SetObjectProperty(InterpolationFlags, "WARP_FILL_OUTLIERS", 8);
	SetObjectProperty(InterpolationFlags, "WARP_INVERSE_MAP", 16);
	overload->add_type_alias("InterpolationFlags", "int");

	auto InterpolationMasks = CreateNamedObject(target, "InterpolationMasks");
	SetObjectProperty(InterpolationMasks, "INTER_BITS", 5);
	SetObjectProperty(InterpolationMasks, "INTER_BITS2", cv::INTER_BITS * 2);
	SetObjectProperty(InterpolationMasks, "INTER_TAB_SIZE", 1 << cv::INTER_BITS);
	SetObjectProperty(InterpolationMasks, "INTER_TAB_SIZE2", cv::INTER_TAB_SIZE * cv::INTER_TAB_SIZE);
	overload->add_type_alias("InterpolationMasks", "int");


	auto DistanceTypes = CreateNamedObject(target, "DistanceTypes");
	SetObjectProperty(DistanceTypes, "DIST_USER", -1);
	SetObjectProperty(DistanceTypes, "DIST_L1", 1);
	SetObjectProperty(DistanceTypes, "DIST_L2", 2);
	SetObjectProperty(DistanceTypes, "DIST_C", 3);
	SetObjectProperty(DistanceTypes, "DIST_L12", 4);
	SetObjectProperty(DistanceTypes, "DIST_FAIR", 5);
	SetObjectProperty(DistanceTypes, "DIST_WELSCH", 6);
	SetObjectProperty(DistanceTypes, "DIST_HUBER", 7);
	overload->add_type_alias("DistanceTypes", "int");


	auto DistanceTransformMasks = CreateNamedObject(target, "DistanceTransformMasks");
	SetObjectProperty(DistanceTransformMasks, "DIST_MASK_3", 3);
	SetObjectProperty(DistanceTransformMasks, "DIST_MASK_5", 5);
	SetObjectProperty(DistanceTransformMasks, "DIST_MASK_PRECISE", 0);
	overload->add_type_alias("DistanceTransformMasks", "int");


	auto ThresholdTypes = CreateNamedObject(target, "ThresholdTypes");
	SetObjectProperty(ThresholdTypes, "THRESH_BINARY", 0);
	SetObjectProperty(ThresholdTypes, "THRESH_BINARY_INV", 1);
	SetObjectProperty(ThresholdTypes, "THRESH_TRUNC", 2);
	SetObjectProperty(ThresholdTypes, "THRESH_TOZERO", 3);
	SetObjectProperty(ThresholdTypes, "THRESH_TOZERO_INV", 4);
	SetObjectProperty(ThresholdTypes, "THRESH_MASK", 7);
	SetObjectProperty(ThresholdTypes, "THRESH_OTSU", 8);
	SetObjectProperty(ThresholdTypes, "THRESH_TRIANGLE", 16);
	overload->add_type_alias("ThresholdTypes", "int");

	auto AdaptiveThresholdTypes = CreateNamedObject(target, "AdaptiveThresholdTypes");
	SetObjectProperty(AdaptiveThresholdTypes, "ADAPTIVE_THRESH_MEAN_C", 0);
	SetObjectProperty(AdaptiveThresholdTypes, "ADAPTIVE_THRESH_GAUSSIAN_C", 1);
	overload->add_type_alias("AdaptiveThresholdTypes", "int");


	auto UndistortTypes = CreateNamedObject(target, "UndistortTypes");
	SetObjectProperty(UndistortTypes, "PROJ_SPHERICAL_ORTHO", 0);
	SetObjectProperty(UndistortTypes, "PROJ_SPHERICAL_EQRECT", 1);
	overload->add_type_alias("UndistortTypes", "int");

	auto GrabCutClasses = CreateNamedObject(target, "GrabCutClasses");
	SetObjectProperty(GrabCutClasses, "GC_BGD", 0);
	SetObjectProperty(GrabCutClasses, "GC_FGD", 1);
	SetObjectProperty(GrabCutClasses, "GC_PR_BGD", 2);
	SetObjectProperty(GrabCutClasses, "GC_PR_FGD", 3);
	overload->add_type_alias("GrabCutClasses", "int");

	auto GrabCutModes = CreateNamedObject(target, "GrabCutModes");
	SetObjectProperty(GrabCutModes, "GC_INIT_WITH_RECT", 0);
	SetObjectProperty(GrabCutModes, "GC_INIT_WITH_MASK", 1);
	SetObjectProperty(GrabCutModes, "GC_EVAL", 2);
	overload->add_type_alias("GrabCutModes", "int");


	auto DistanceTransformLabelTypes = CreateNamedObject(target, "DistanceTransformLabelTypes");
	SetObjectProperty(DistanceTransformLabelTypes, "DIST_LABEL_CCOMP", 0);
	SetObjectProperty(DistanceTransformLabelTypes, "DIST_LABEL_PIXEL", 1);
	overload->add_type_alias("DistanceTransformLabelTypes", "int");

	auto FloodFillFlags = CreateNamedObject(target, "FloodFillFlags");
	SetObjectProperty(FloodFillFlags, "FLOODFILL_FIXED_RANGE", 1 << 16);
	SetObjectProperty(FloodFillFlags, "FLOODFILL_MASK_ONLY", 1 << 17);
	overload->add_type_alias("FloodFillFlags", "int");

   
	auto ConnectedComponentsTypes = CreateNamedObject(target, "ConnectedComponentsTypes");
	SetObjectProperty(ConnectedComponentsTypes, "CC_STAT_LEFT", 0);
	SetObjectProperty(ConnectedComponentsTypes, "CC_STAT_TOP", 1);
	SetObjectProperty(ConnectedComponentsTypes, "CC_STAT_WIDTH", 2);
	SetObjectProperty(ConnectedComponentsTypes, "CC_STAT_HEIGHT", 3);
	SetObjectProperty(ConnectedComponentsTypes, "CC_STAT_AREA", 4);
	SetObjectProperty(ConnectedComponentsTypes, "CC_STAT_MAX", 5);
	overload->add_type_alias("ConnectedComponentsTypes", "int");


	auto RetrievalModes = CreateNamedObject(target, "RetrievalModes");
	SetObjectProperty(RetrievalModes, "RETR_EXTERNAL", 0);
	SetObjectProperty(RetrievalModes, "RETR_LIST", 1);
	SetObjectProperty(RetrievalModes, "RETR_CCOMP", 2);
	SetObjectProperty(RetrievalModes, "RETR_TREE", 3);
	SetObjectProperty(RetrievalModes, "RETR_FLOODFILL", 4);
	overload->add_type_alias("RetrievalModes", "int");


	auto ContourApproximationModes = CreateNamedObject(target, "ContourApproximationModes");
	SetObjectProperty(ContourApproximationModes, "CHAIN_APPROX_NONE", 1);
	SetObjectProperty(ContourApproximationModes, "CHAIN_APPROX_SIMPLE", 2);
	SetObjectProperty(ContourApproximationModes, "CHAIN_APPROX_TC89_L1", 3);
	SetObjectProperty(ContourApproximationModes, "CHAIN_APPROX_TC89_KCOS", 4);
	overload->add_type_alias("ContourApproximationModes", "int");

	auto HoughModes = CreateNamedObject(target, "HoughModes");
	SetObjectProperty(HoughModes, "HOUGH_STANDARD", 0);
	SetObjectProperty(HoughModes, "HOUGH_PROBABILISTIC", 1);
	SetObjectProperty(HoughModes, "HOUGH_MULTI_SCALE", 2);
	SetObjectProperty(HoughModes, "HOUGH_GRADIENT", 3);
	overload->add_type_alias("HoughModes", "int");


	auto LineSegmentDetectorModes = CreateNamedObject(target, "LineSegmentDetectorModes");
	SetObjectProperty(LineSegmentDetectorModes, "LSD_REFINE_NONE", 0);
	SetObjectProperty(LineSegmentDetectorModes, "LSD_REFINE_STD", 1);
	SetObjectProperty(LineSegmentDetectorModes, "LSD_REFINE_ADV", 2);
	overload->add_type_alias("LineSegmentDetectorModes", "int");


	auto HistCompMethods = CreateNamedObject(target, "HistCompMethods");
	SetObjectProperty(HistCompMethods, "HISTCMP_CORREL", 0);
	SetObjectProperty(HistCompMethods, "HISTCMP_CHISQR", 1);
	SetObjectProperty(HistCompMethods, "HISTCMP_INTERSECT", 2);
	SetObjectProperty(HistCompMethods, "HISTCMP_BHATTACHARYYA", 3);
	SetObjectProperty(HistCompMethods, "HISTCMP_HELLINGER", cv::HISTCMP_BHATTACHARYYA);
	SetObjectProperty(HistCompMethods, "HISTCMP_CHISQR_ALT", 4);
	SetObjectProperty(HistCompMethods, "HISTCMP_KL_DIV", 5);
	overload->add_type_alias("HistCompMethods", "int");

	auto ColorConversionCodes = CreateNamedObject(target, "ColorConversionCodes");
	SetObjectProperty(ColorConversionCodes, "COLOR_BGR2BGRA", 0);
	SetObjectProperty(ColorConversionCodes, "COLOR_RGB2RGBA", cv::COLOR_BGR2BGRA);
	SetObjectProperty(ColorConversionCodes, "COLOR_BGRA2BGR", 1);
	SetObjectProperty(ColorConversionCodes, "COLOR_RGBA2RGB", cv::COLOR_BGRA2BGR);
	SetObjectProperty(ColorConversionCodes, "COLOR_BGR2RGBA", 2);
	SetObjectProperty(ColorConversionCodes, "COLOR_RGB2BGRA", cv::COLOR_BGR2RGBA);
	SetObjectProperty(ColorConversionCodes, "COLOR_RGBA2BGR", 3);
	SetObjectProperty(ColorConversionCodes, "COLOR_BGRA2RGB", cv::COLOR_RGBA2BGR);
	SetObjectProperty(ColorConversionCodes, "COLOR_BGR2RGB", 4);
	SetObjectProperty(ColorConversionCodes, "COLOR_RGB2BGR", cv::COLOR_BGR2RGB);
	SetObjectProperty(ColorConversionCodes, "COLOR_BGRA2RGBA", 5);
	SetObjectProperty(ColorConversionCodes, "COLOR_RGBA2BGRA", cv::COLOR_BGRA2RGBA);
	SetObjectProperty(ColorConversionCodes, "COLOR_BGR2GRAY", 6);
	SetObjectProperty(ColorConversionCodes, "COLOR_RGB2GRAY", 7);
	SetObjectProperty(ColorConversionCodes, "COLOR_GRAY2BGR", 8);
	SetObjectProperty(ColorConversionCodes, "COLOR_GRAY2RGB", cv::COLOR_GRAY2BGR);
	SetObjectProperty(ColorConversionCodes, "COLOR_GRAY2BGRA", 9);
	SetObjectProperty(ColorConversionCodes, "COLOR_GRAY2RGBA", cv::COLOR_GRAY2BGRA);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGRA2GRAY", 10);
    SetObjectProperty(ColorConversionCodes, "COLOR_RGBA2GRAY", 11);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR2BGR565", 12);
    SetObjectProperty(ColorConversionCodes, "COLOR_RGB2BGR565", 13);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR5652BGR", 14);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR5652RGB", 15);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGRA2BGR565", 16);
    SetObjectProperty(ColorConversionCodes, "COLOR_RGBA2BGR565", 17);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR5652BGRA", 18);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR5652RGBA", 19);
    SetObjectProperty(ColorConversionCodes, "COLOR_GRAY2BGR565", 20);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR5652GRAY", 21);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR2BGR555", 22);
    SetObjectProperty(ColorConversionCodes, "COLOR_RGB2BGR555", 23);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR5552BGR", 24);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR5552RGB", 25);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGRA2BGR555", 26);
    SetObjectProperty(ColorConversionCodes, "COLOR_RGBA2BGR555", 27);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR5552BGRA", 28);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR5552RGBA", 29);
    SetObjectProperty(ColorConversionCodes, "COLOR_GRAY2BGR555", 30);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR5552GRAY", 31);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR2XYZ", 32);
    SetObjectProperty(ColorConversionCodes, "COLOR_RGB2XYZ", 33);
    SetObjectProperty(ColorConversionCodes, "COLOR_XYZ2BGR", 34);
    SetObjectProperty(ColorConversionCodes, "COLOR_XYZ2RGB", 35);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR2YCrCb", 36);
    SetObjectProperty(ColorConversionCodes, "COLOR_RGB2YCrCb", 37);
    SetObjectProperty(ColorConversionCodes, "COLOR_YCrCb2BGR", 38);
    SetObjectProperty(ColorConversionCodes, "COLOR_YCrCb2RGB", 39);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR2HSV", 40);
    SetObjectProperty(ColorConversionCodes, "COLOR_RGB2HSV", 41);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR2Lab", 44);
    SetObjectProperty(ColorConversionCodes, "COLOR_RGB2Lab", 45);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR2Luv", 50);
    SetObjectProperty(ColorConversionCodes, "COLOR_RGB2Luv", 51);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR2HLS", 52);
    SetObjectProperty(ColorConversionCodes, "COLOR_RGB2HLS", 53);
    SetObjectProperty(ColorConversionCodes, "COLOR_HSV2BGR", 54);
    SetObjectProperty(ColorConversionCodes, "COLOR_HSV2RGB", 55);
    SetObjectProperty(ColorConversionCodes, "COLOR_Lab2BGR", 56);
    SetObjectProperty(ColorConversionCodes, "COLOR_Lab2RGB", 57);
    SetObjectProperty(ColorConversionCodes, "COLOR_Luv2BGR", 58);
    SetObjectProperty(ColorConversionCodes, "COLOR_Luv2RGB", 59);
    SetObjectProperty(ColorConversionCodes, "COLOR_HLS2BGR", 60);
    SetObjectProperty(ColorConversionCodes, "COLOR_HLS2RGB", 61);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR2HSV_FULL", 66);
    SetObjectProperty(ColorConversionCodes, "COLOR_RGB2HSV_FULL", 67);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR2HLS_FULL", 68);
    SetObjectProperty(ColorConversionCodes, "COLOR_RGB2HLS_FULL", 69);
    SetObjectProperty(ColorConversionCodes, "COLOR_HSV2BGR_FULL", 70);
    SetObjectProperty(ColorConversionCodes, "COLOR_HSV2RGB_FULL", 71);
    SetObjectProperty(ColorConversionCodes, "COLOR_HLS2BGR_FULL", 72);
    SetObjectProperty(ColorConversionCodes, "COLOR_HLS2RGB_FULL", 73);
    SetObjectProperty(ColorConversionCodes, "COLOR_LBGR2Lab", 74);
    SetObjectProperty(ColorConversionCodes, "COLOR_LRGB2Lab", 75);
    SetObjectProperty(ColorConversionCodes, "COLOR_LBGR2Luv", 76);
    SetObjectProperty(ColorConversionCodes, "COLOR_LRGB2Luv", 77);
    SetObjectProperty(ColorConversionCodes, "COLOR_Lab2LBGR", 78);
    SetObjectProperty(ColorConversionCodes, "COLOR_Lab2LRGB", 79);
    SetObjectProperty(ColorConversionCodes, "COLOR_Luv2LBGR", 80);
    SetObjectProperty(ColorConversionCodes, "COLOR_Luv2LRGB", 81);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR2YUV", 82);
    SetObjectProperty(ColorConversionCodes, "COLOR_RGB2YUV", 83);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGR", 84);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGB", 85);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGB_NV12", 90);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGR_NV12", 91);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGB_NV21", 92);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGR_NV21", 93);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV420sp2RGB",cv:: COLOR_YUV2RGB_NV21);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV420sp2BGR",cv:: COLOR_YUV2BGR_NV21);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGBA_NV12", 94);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGRA_NV12", 95);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGBA_NV21", 96);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGRA_NV21", 97);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV420sp2RGBA",cv:: COLOR_YUV2RGBA_NV21);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV420sp2BGRA",cv:: COLOR_YUV2BGRA_NV21);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGB_YV12", 98);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGR_YV12", 99);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGB_IYUV", 100);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGR_IYUV", 101);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGB_I420",cv:: COLOR_YUV2RGB_IYUV);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGR_I420",cv:: COLOR_YUV2BGR_IYUV);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV420p2RGB",cv:: COLOR_YUV2RGB_YV12);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV420p2BGR",cv:: COLOR_YUV2BGR_YV12);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGBA_YV12", 102);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGRA_YV12", 103);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGBA_IYUV", 104);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGRA_IYUV", 105);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGBA_I420",cv:: COLOR_YUV2RGBA_IYUV);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGRA_I420",cv:: COLOR_YUV2BGRA_IYUV);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV420p2RGBA",cv:: COLOR_YUV2RGBA_YV12);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV420p2BGRA",cv:: COLOR_YUV2BGRA_YV12);
	SetObjectProperty(ColorConversionCodes, "COLOR_YUV2GRAY_420", 106);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2GRAY_NV21",cv:: COLOR_YUV2GRAY_420);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2GRAY_NV12",cv:: COLOR_YUV2GRAY_420);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2GRAY_YV12",cv:: COLOR_YUV2GRAY_420);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2GRAY_IYUV",cv:: COLOR_YUV2GRAY_420);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2GRAY_I420",cv:: COLOR_YUV2GRAY_420);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV420sp2GRAY",cv:: COLOR_YUV2GRAY_420);
	SetObjectProperty(ColorConversionCodes, "COLOR_YUV420p2GRAY", cv::COLOR_YUV2GRAY_420);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGB_UYVY", 107);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGR_UYVY", 108);
    //SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGB_VYUY", 109);
    //SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGR_VYUY", 110);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGB_Y422",cv:: COLOR_YUV2RGB_UYVY);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGR_Y422",cv:: COLOR_YUV2BGR_UYVY);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGB_UYNV",cv:: COLOR_YUV2RGB_UYVY);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGR_UYNV",cv:: COLOR_YUV2BGR_UYVY);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGBA_UYVY", 111);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGRA_UYVY", 112);
    SetObjectProperty(ColorConversionCodes, "//COLOR_YUV2RGBA_VYUY", 113);
    SetObjectProperty(ColorConversionCodes, "//COLOR_YUV2BGRA_VYUY", 114);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGBA_Y422",cv:: COLOR_YUV2RGBA_UYVY);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGRA_Y422",cv:: COLOR_YUV2BGRA_UYVY);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGBA_UYNV",cv:: COLOR_YUV2RGBA_UYVY);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGRA_UYNV",cv:: COLOR_YUV2BGRA_UYVY);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGB_YUY2", 115);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGR_YUY2", 116);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGB_YVYU", 117);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGR_YVYU", 118);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGB_YUYV",cv:: COLOR_YUV2RGB_YUY2);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGR_YUYV",cv:: COLOR_YUV2BGR_YUY2);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGB_YUNV",cv:: COLOR_YUV2RGB_YUY2);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGR_YUNV",cv:: COLOR_YUV2BGR_YUY2);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGBA_YUY2", 119);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGRA_YUY2", 120);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGBA_YVYU", 121);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGRA_YVYU", 122);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGBA_YUYV",cv:: COLOR_YUV2RGBA_YUY2);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGRA_YUYV",cv:: COLOR_YUV2BGRA_YUY2);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2RGBA_YUNV",cv:: COLOR_YUV2RGBA_YUY2);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2BGRA_YUNV",cv:: COLOR_YUV2BGRA_YUY2);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2GRAY_UYVY", 123);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2GRAY_YUY2", 124);
    //SetObjectProperty(ColorConversionCodes, "CV_YUV2GRAY_VYUY", cv::CV_YUV2GRAY_UYVY);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2GRAY_Y422", cv::COLOR_YUV2GRAY_UYVY);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2GRAY_UYNV", cv::COLOR_YUV2GRAY_UYVY);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2GRAY_YVYU", cv::COLOR_YUV2GRAY_YUY2);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2GRAY_YUYV", cv::COLOR_YUV2GRAY_YUY2);
    SetObjectProperty(ColorConversionCodes, "COLOR_YUV2GRAY_YUNV", cv::COLOR_YUV2GRAY_YUY2);
    SetObjectProperty(ColorConversionCodes, "COLOR_RGBA2mRGBA", 125);
    SetObjectProperty(ColorConversionCodes, "COLOR_mRGBA2RGBA", 126);
    SetObjectProperty(ColorConversionCodes, "COLOR_RGB2YUV_I420", 127);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR2YUV_I420", 128);
    SetObjectProperty(ColorConversionCodes, "COLOR_RGB2YUV_IYUV", cv::COLOR_RGB2YUV_I420);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR2YUV_IYUV", cv::COLOR_BGR2YUV_I420);
    SetObjectProperty(ColorConversionCodes, "COLOR_RGBA2YUV_I420", 129);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGRA2YUV_I420", 130);
    SetObjectProperty(ColorConversionCodes, "COLOR_RGBA2YUV_IYUV", cv::COLOR_RGBA2YUV_I420);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGRA2YUV_IYUV", cv::COLOR_BGRA2YUV_I420);
    SetObjectProperty(ColorConversionCodes, "COLOR_RGB2YUV_YV12", 131);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGR2YUV_YV12", 132);
    SetObjectProperty(ColorConversionCodes, "COLOR_RGBA2YUV_YV12", 133);
    SetObjectProperty(ColorConversionCodes, "COLOR_BGRA2YUV_YV12", 134);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerBG2BGR", 46);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerGB2BGR", 47);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerRG2BGR", 48);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerGR2BGR", 49);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerBG2RGB", cv::COLOR_BayerRG2BGR);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerGB2RGB", cv::COLOR_BayerGR2BGR);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerRG2RGB", cv::COLOR_BayerBG2BGR);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerGR2RGB", cv::COLOR_BayerGB2BGR);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerBG2GRAY", 86);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerGB2GRAY", 87);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerRG2GRAY", 88);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerGR2GRAY", 89);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerBG2BGR_VNG", 62);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerGB2BGR_VNG", 63);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerRG2BGR_VNG", 64);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerGR2BGR_VNG", 65);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerBG2RGB_VNG", cv::COLOR_BayerRG2BGR_VNG);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerGB2RGB_VNG", cv::COLOR_BayerGR2BGR_VNG);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerRG2RGB_VNG", cv::COLOR_BayerBG2BGR_VNG);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerGR2RGB_VNG", cv::COLOR_BayerGB2BGR_VNG);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerBG2BGR_EA", 135);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerGB2BGR_EA", 136);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerRG2BGR_EA", 137);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerGR2BGR_EA", 138);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerBG2RGB_EA", cv::COLOR_BayerRG2BGR_EA);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerGB2RGB_EA", cv::COLOR_BayerGR2BGR_EA);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerRG2RGB_EA", cv::COLOR_BayerBG2BGR_EA);
    SetObjectProperty(ColorConversionCodes, "COLOR_BayerGR2RGB_EA", cv::COLOR_BayerGB2BGR_EA);
    SetObjectProperty(ColorConversionCodes, "COLOR_COLORCVT_MAX", 139);
	overload->add_type_alias("ColorConversionCodes", "int");

	auto RectanglesIntersectTypes = CreateNamedObject(target, "RectanglesIntersectTypes");
	SetObjectProperty(RectanglesIntersectTypes, "INTERSECT_NONE", 0);
	SetObjectProperty(RectanglesIntersectTypes, "INTERSECT_PARTIAL", 1);
	SetObjectProperty(RectanglesIntersectTypes, "INTERSECT_FULL", 2);
	overload->add_type_alias("RectanglesIntersectTypes", "int");


	GeneralizedHough::Init(target, overload);
  

	GeneralizedHoughBallard::Init(target, overload);

   
	GeneralizedHoughGuil::Init(target, overload);

	CLAHE::Init(target, overload);

	Subdiv2D::Init(target, overload);


	LineSegmentDetector::Init(target, overload);
  
        

    /** @brief Creates a smart pointer to a LineSegmentDetector object and initializes it.
    
    The LineSegmentDetector algorithm is defined using the standard values. Only advanced users may want
    to edit those, as to tailor it for their own application.
    
    @param _refine The way found lines will be refined, see cv::LineSegmentDetectorModes
    @param _scale The scale of the image that will be used to find the lines. Range (0..1].
    @param _sigma_scale Sigma for Gaussian filter. It is computed as sigma = _sigma_scale/_scale.
    @param _quant Bound to the quantization error on the gradient norm.
    @param _ang_th Gradient angle tolerance in degrees.
    @param _log_eps Detection threshold: -log10(NFA) \> log_eps. Used only when advancent refinement
    is chosen.
    @param _density_th Minimal density of aligned region points in the enclosing rectangle.
    @param _n_bins Number of bins in pseudo-ordering of gradient modulus.
     */

	overload->addOverload("imgproc", "", "createLineSegmentDetector", {
		make_param<int>("refine","LineSegmentDetectorModes",cv::LSD_REFINE_STD),
		make_param<double>("scale", "double", 0.8),
		make_param<double>("sigma_scale","double",0.6),
		make_param<double>("quant", "double", 2.0),
		make_param<double>("ang_th", "double", 22.5),
		make_param<double>("log_eps", "double", 0),
		make_param<double>("density_th", "double", 0.7),
		make_param<int>("n_bins", "int", 1024)
	}, createLineSegmentDetector );
	Nan::SetMethod(target, "createLineSegmentDetector", imgproc_general_callback::callback);

    //interface IcreateLineSegmentDetector {
    //    (
    //        _refine?: LineSegmentDetectorModes | _st.int /* = LSD_REFINE_STD*/, _scale?: _st.double /* = 0.8*/,
    //        _sigma_scale?: _st.double /* = 0.6*/, _quant?: _st.double /* = 2.0*/, _ang_th?: _st.double /* = 22.5*/,
    //        _log_eps?: _st.double  /*= 0*/, _density_th?: _st.double /* = 0.7*/, _n_bins?: _st.int  /*= 1024*/): LineSegmentDetector;
    //}

    //export var createLineSegmentDetector: IcreateLineSegmentDetector = alvision_module.createLineSegmentDetector;

    //! @} imgproc_feature

    //! @addtogroup imgproc_filter
    //! @{

    /** @brief Returns Gaussian filter coefficients.
    
    The function computes and returns the \f$\texttt{ksize} \times 1\f$ matrix of Gaussian filter
    coefficients:
    
    \f[G_i= \alpha *e^{-(i-( \texttt{ksize} -1)/2)^2/(2* \texttt{sigma}^2)},\f]
    
    where \f$i=0..\texttt{ksize}-1\f$ and \f$\alpha\f$ is the scale factor chosen so that \f$\sum_i G_i=1\f$.
    
    Two of such generated kernels can be passed to sepFilter2D. Those functions automatically recognize
    smoothing kernels (a symmetrical kernel with sum of weights equal to 1) and handle them accordingly.
    You may also use the higher-level GaussianBlur.
    @param ksize Aperture size. It should be odd ( \f$\texttt{ksize} \mod 2 = 1\f$ ) and positive.
    @param sigma Gaussian standard deviation. If it is non-positive, it is computed from ksize as
    `sigma = 0.3\*((ksize-1)\*0.5 - 1) + 0.8`.
    @param ktype Type of filter coefficients. It can be CV_32F or CV_64F .
    @sa  sepFilter2D, getDerivKernels, getStructuringElement, GaussianBlur
     */

	overload->addOverload("imgproc", "", "getGaussianKernel", {
		make_param<int>("ksize","int"),
		make_param<double>("sigma","double"),
		make_param<int>("ktype","int",CV_64F)
	}, getGaussianKernel);
	Nan::SetMethod(target, "getGaussianKernel", imgproc_general_callback::callback);

    //interface IgetGaussianKernel {
    //    (ksize: _st.int, sigma: _st.double, ktype: _st.int /* = CV_64F*/): _mat.Mat;
    //}
	//
    //export var getGaussianKernel: IgetGaussianKernel = alvision_module.getGaussianKernel;

    /** @brief Returns filter coefficients for computing spatial image derivatives.
    
    The function computes and returns the filter coefficients for spatial image derivatives. When
    `ksize=CV_SCHARR`, the Scharr \f$3 \times 3\f$ kernels are generated (see cv::Scharr). Otherwise, Sobel
    kernels are generated (see cv::Sobel). The filters are normally passed to sepFilter2D or to
    
    @param kx Output matrix of row filter coefficients. It has the type ktype .
    @param ky Output matrix of column filter coefficients. It has the type ktype .
    @param dx Derivative order in respect of x.
    @param dy Derivative order in respect of y.
    @param ksize Aperture size. It can be CV_SCHARR, 1, 3, 5, or 7.
    @param normalize Flag indicating whether to normalize (scale down) the filter coefficients or not.
    Theoretically, the coefficients should have the denominator \f$=2^{ksize*2-dx-dy-2}\f$. If you are
    going to filter floating-point images, you are likely to use the normalized kernels. But if you
    compute derivatives of an 8-bit image, store the results in a 16-bit image, and wish to preserve
    all the fractional bits, you may want to set normalize=false .
    @param ktype Type of filter coefficients. It can be CV_32f or CV_64F .
     */

	overload->addOverload("imgproc", "", "getDerivKernels", {
		make_param<IOArray*>("kx","IOArray"),
		make_param<IOArray*>("ky","IOArray"),
		make_param<int>("dx","int"),
		make_param<int>("dy","int"),
		make_param<int>("ksize","int"),
		make_param<bool>("normalize","bool", false),
		make_param<int>("ktype","int", CV_32F)
	}, getDerivKernels);
	Nan::SetMethod(target, "getDerivKernels", imgproc_general_callback::callback);

    //interface IgetDerivKernels {
    //    (kx: _st.OutputArray, ky: _st.OutputArray ,
    //        dx: _st.int, dy: _st.int, ksize: _st.int ,
    //        normalize: boolean /* = false*/, ktype: _st.int  /*= CV_32F*/): void;
    //}
	//
    //export var getDerivKernels: IgetDerivKernels = alvision_module.getDerivKernels;

    /** @brief Returns Gabor filter coefficients.
    
    For more details about gabor filter equations and parameters, see: [Gabor
    Filter](http://en.wikipedia.org/wiki/Gabor_filter).
    
    @param ksize :_types.Size of the filter returned.
    @param sigma Standard deviation of the gaussian envelope.
    @param theta Orientation of the normal to the parallel stripes of a Gabor function.
    @param lambd Wavelength of the sinusoidal factor.
    @param gamma Spatial aspect ratio.
    @param psi Phase offset.
    @param ktype Type of filter coefficients. It can be CV_32F or CV_64F .
     */
	overload->addOverload("imgproc", "", "getGaborKernel", {
		make_param<Size*>("ksize",Size::name),
		make_param<double>("sigma","double"), 
		make_param<double>("theta","double"),
		make_param<double>("lambd","double"),
		make_param<double>("gamma","double"),
		make_param<double>("psi","double",CV_PI * 0.5),
		make_param<int>("ktype","int", CV_64F)
	}, getGaborKernel);
	Nan::SetMethod(target, "getGaborKernel", imgproc_general_callback::callback);

    //interface IgetGaborKernel{
    //    (ksize: _types.Size, sigma: _st.double, theta: _st.double, lambd: _st.double,
    //        gamma: _st.double, psi: _st.double  /*= CV_PI * 0.5*/, ktype: _st.int  /*= CV_64F*/): _mat.Mat;
    //}
	//
    //export var getGaborKernel: IgetGaborKernel = alvision_module.getGaborKernel;

//! returns "magic" border value for erosion and dilation. It is automatically transformed to Scalar::all(-DBL_MAX) for dilation.

	overload->addOverload("imgproc", "", "morphologyDefaultBorderValue", {}, morphologyDefaultBorderValue);
	Nan::SetMethod(target, "morphologyDefaultBorderValue", imgproc_general_callback::callback);
//export function morphologyDefaultBorderValue(): _types.Scalar  { return _types.Scalar.all(_st.DBL_MAX); }

    /** @brief Returns a structuring element of the specified size and shape for morphological operations.
    
    The function constructs and returns the structuring element that can be further passed to cv::erode,
    cv::dilate or cv::morphologyEx. But you can also construct an arbitrary binary mask yourself and use it as
    the structuring element.
    
    @param shape Element shape that could be one of cv::MorphShapes
    @param ksize :_types.Size of the structuring element.
    @param anchor Anchor position within the element. The default value \f$(-1, -1)\f$ means that the
    anchor is at the center. Note that only the shape of a cross-shaped element depends on the anchor
    position. In other cases the anchor just regulates how much the result of the morphological
    operation is shifted.
     */
overload->addOverload("imgproc", "", "getStructuringElement", {
		make_param<int>("shape","int"),
		make_param<Size*>("ksize",Size::name),
		make_param<Point*>("anchor",Point::name ,Point::create(-1, -1))
}, getStructuringElement);
	Nan::SetMethod(target, "getStructuringElement", imgproc_general_callback::callback);

//interface IgetStructuringElement {
//    (shape: _st.int, ksize: _types.Size, anchor: _types.Point /* = Point(-1, -1)*/): _mat.Mat;
//}
//
//export var getStructuringElement: IgetStructuringElement = alvision_module.getStructuringElement;

    /** @brief Blurs an image using the median filter.
    
    The function smoothes an image using the median filter with the \f$\texttt{ksize} \times
    \texttt{ksize}\f$ aperture. Each channel of a multi-channel image is processed independently.
    In-place operation is supported.
    
    @param src input 1-, 3-, or 4-channel image; when ksize is 3 or 5, the image depth should be
    CV_8U, CV_16U, or CV_32F, for larger aperture sizes, it can only be CV_8U.
    @param dst destination array of the same size and type as src.
    @param ksize aperture linear size; it must be odd and greater than 1, for example: 3, 5, 7 ...
    @sa  bilateralFilter, blur, boxFilter, GaussianBlur
     */

overload->addOverload("imgproc", "", "medianBlur", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<int>("ksize","int")
}, medianBlur);
	Nan::SetMethod(target, "medianBlur", imgproc_general_callback::callback);

//interface ImedianBlur {
//    (src: _st.InputArray, dst: _st.OutputArray, ksize: _st.int  ): void;
//}
//export var medianBlur: ImedianBlur = alvision_module.medianBlur;

    /** @brief Blurs an image using a Gaussian filter.
    
    The function convolves the source image with the specified Gaussian kernel. In-place filtering is
    supported.
    
    @param src input image; the image can have any number of channels, which are processed
    independently, but the depth should be CV_8U, CV_16U, CV_16S, CV_32F or CV_64F.
    @param dst output image of the same size and type as src.
    @param ksize Gaussian kernel size. ksize.width and ksize.height can differ but they both must be
    positive and odd. Or, they can be zero's and then they are computed from sigma.
    @param sigmaX Gaussian kernel standard deviation in X direction.
    @param sigmaY Gaussian kernel standard deviation in Y direction; if sigmaY is zero, it is set to be
    equal to sigmaX, if both sigmas are zeros, they are computed from ksize.width and ksize.height,
    respectively (see cv::getGaussianKernel for details); to fully control the result regardless of
    possible future modifications of all this semantics, it is recommended to specify all of ksize,
    sigmaX, and sigmaY.
    @param borderType pixel extrapolation method, see cv::BorderTypes
    
    @sa  sepFilter2D, filter2D, blur, boxFilter, bilateralFilter, medianBlur
     */
overload->addOverload("imgproc", "", "GaussianBlur", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<Size*>("ksize",Size::name),
		make_param<double>("sigmaX","double"),
		make_param<double>("sigmaY","double", 0),
		make_param<int>("borderType","BorderTypes",cv::BORDER_DEFAULT)
}, GaussianBlur);
	Nan::SetMethod(target, "GaussianBlur", imgproc_general_callback::callback);

//interface IGaussianBlur{
//    (src: _st.InputArray, dst: _st.OutputArray, ksize: _types.Size,
//        sigmaX: _st.double, sigmaY?: _st.double /* = 0*/,
//        borderType?: _base.BorderTypes | _st.int /* = BORDER_DEFAULT*/) : void
//}
//
//export var GaussianBlur: IGaussianBlur = alvision_module.GaussianBlur;

    //CV_EXPORTS_W void GaussianBlur(src : _st.InputArray, dst : _st.OutputArray, ksize : _types.Size,
    //    double sigmaX, double sigmaY = 0,
    //    borderType : _st.int /* = BORDER_DEFAULT*/);

    /** @brief Applies the bilateral filter to an image.
    
    The function applies bilateral filtering to the input image, as described in
    http://www.dai.ed.ac.uk/CVonline/LOCAL_COPIES/MANDUCHI1/Bilateral_Filtering.html
    bilateralFilter can reduce unwanted noise very well while keeping edges fairly sharp. However, it is
    very slow compared to most filters.
    
    _Sigma values_: For simplicity, you can set the 2 sigma values to be the same. If they are small (\<
    10), the filter will not have much effect, whereas if they are large (\> 150), they will have a very
    strong effect, making the image look "cartoonish".
    
    _Filter size_: Large filters (d \> 5) are very slow, so it is recommended to use d=5 for real-time
    applications, and perhaps d=9 for offline applications that need heavy noise filtering.
    
    This filter does not work inplace.
    @param src Source 8-bit or floating-point, 1-channel or 3-channel image.
    @param dst Destination image of the same size and type as src .
    @param d Diameter of each pixel neighborhood that is used during filtering. If it is non-positive,
    it is computed from sigmaSpace.
    @param sigmaColor Filter sigma in the color space. A larger value of the parameter means that
    farther colors within the pixel neighborhood (see sigmaSpace) will be mixed together, resulting
    in larger areas of semi-equal color.
    @param sigmaSpace Filter sigma in the coordinate space. A larger value of the parameter means that
    farther pixels will influence each other as long as their colors are close enough (see sigmaColor
    ). When d\>0, it specifies the neighborhood size regardless of sigmaSpace. Otherwise, d is
    proportional to sigmaSpace.
    @param borderType border mode used to extrapolate pixels outside of the image, see cv::BorderTypes
     */

overload->addOverload("imgproc", "", "bilateralFilter", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<int>("d","int"),
		make_param<double>("sigmaColor","double"), 
		make_param<double>("sigmaSpace","double"),
		make_param<int>("borderType","BorderTypes",cv:: BORDER_DEFAULT)
}, bilateralFilter);
	Nan::SetMethod(target, "bilateralFilter", imgproc_general_callback::callback);

//interface IbilateralFilter{
//    (src: _st.InputArray, dst: _st.OutputArray, d: _st.int,
//        sigmaColor: _st.double, sigmaSpace: _st.double,
//        borderType?: _base.BorderTypes /* = BORDER_DEFAULT*/): void;
//}
//
//export var bilateralFilter: IbilateralFilter = alvision_module.bilateralFilter;

//    CV_EXPORTS_W void bilateralFilter(src : _st.InputArray, dst : _st.OutputArray, int d,
//        sigmaColor : _st.double, sigmaSpace : _st.double,
//        borderType : _st.int /* = BORDER_DEFAULT*/);

    /** @brief Blurs an image using the box filter.
    
    The function smoothes an image using the kernel:
    
    \f[\texttt{K} =  \alpha \begin{bmatrix} 1 & 1 & 1 &  \cdots & 1 & 1  \\ 1 & 1 & 1 &  \cdots & 1 & 1  \\ \hdotsfor{6} \\ 1 & 1 & 1 &  \cdots & 1 & 1 \end{bmatrix}\f]
    
    where
    
    \f[\alpha = \fork{\frac{1}{\texttt{ksize.width*ksize.height}}}{when \texttt{normalize=true}}{1}{otherwise}\f]
    
    Unnormalized box filter is useful for computing various integral characteristics over each pixel
    neighborhood, such as covariance matrices of image derivatives (used in dense optical flow
    algorithms, and so on). If you need to compute pixel sums over variable-size windows, use cv::integral.
    
    @param src input image.
    @param dst output image of the same size and type as src.
    @param ddepth the output image depth (-1 to use src.depth()).
    @param ksize blurring kernel size.
    @param anchor anchor point; default value Point(-1,-1) means that the anchor is at the kernel
    center.
    @param normalize flag, specifying whether the kernel is normalized by its area or not.
    @param borderType border mode used to extrapolate pixels outside of the image, see cv::BorderTypes
    @sa  blur, bilateralFilter, GaussianBlur, medianBlur, integral
     */

overload->addOverload("imgproc", "", "boxFilter", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<int>("ddepth","int"),
		make_param<Size*>("ksize",Size::name),
		make_param<Point*>("anchor",Point::name, Point::create(-1, -1)),
		make_param<bool>("normalize","bool", true),
		make_param<int>("borderType","BorderTypes",cv:: BORDER_DEFAULT)
}, boxFilter);
	Nan::SetMethod(target, "boxFilter", imgproc_general_callback::callback);

//interface IboxFilter {
//    (src: _st.InputArray, dst: _st.OutputArray, ddepth: _st.int,
//        ksize: _types.Size, anchor?: _types.Point /* = Point(-1, -1)*/,
//        normalize? : boolean /* = true*/,
//        borderType?: _base.BorderTypes| _st.int /* = BORDER_DEFAULT*/): void;
//}
//
//export var boxFilter: IboxFilter = alvision_module.boxFilter;

//    CV_EXPORTS_W void boxFilter(src : _st.InputArray, dst : _st.OutputArray, ddepth : _st.int,
//        ksize : _types.Size, anchor : _types.Point /* = Point(-1,-1)*/,
//        normalize : boolean /*= true*/,
//        borderType : _st.int /* = BORDER_DEFAULT*/);

    /** @brief Calculates the normalized sum of squares of the pixel values overlapping the filter.
    
    For every pixel \f$ (x, y) \f$ in the source image, the function calculates the sum of squares of those neighboring
    pixel values which overlap the filter placed over the pixel \f$ (x, y) \f$.
    
    The unnormalized square box filter can be useful in computing local image statistics such as the the local
    variance and standard deviation around the neighborhood of a pixel.
    
    @param _src input image
    @param _dst output image of the same size and type as _src
    @param ddepth the output image depth (-1 to use src.depth())
    @param ksize kernel size
    @param anchor kernel anchor point. The default value of Point(-1, -1) denotes that the anchor is at the kernel
    center.
    @param normalize flag, specifying whether the kernel is to be normalized by it's area or not.
    @param borderType border mode used to extrapolate pixels outside of the image, see cv::BorderTypes
    @sa boxFilter
    */

overload->addOverload("imgproc", "", "sqrBoxFilter", {
		make_param<IOArray*>("_src","IOArray"),
		make_param<IOArray*>("_dst","IOArray"),
		make_param<int>("ddepth","int"),
		make_param<Size*>("ksize",Size::name),
		make_param<Point*>("anchor",Point::name , Point::create(-1,-1)),
		make_param<bool>("normalize","bool", true),
		make_param<int>("borderType","int",cv:: BORDER_DEFAULT)
}, sqrBoxFilter);
	Nan::SetMethod(target, "sqrBoxFilter", imgproc_general_callback::callback);

//interface IsqrBoxFilter {
//    (_src: _st.InputArray, _dst: _st.OutputArray, ddepth: _st.int,
//        ksize: _types.Size, anchor: _types.Point /* = Point(-1,-1)*/,
//        normalize: boolean /*= true*/,
//        borderType: _st.int /* = BORDER_DEFAULT*/): void;
//}
//
//export var sqrBoxFilter: IsqrBoxFilter = alvision_module.sqrBoxFilter;

//
//    CV_EXPORTS_W void sqrBoxFilter(_src : _st.InputArray, _dst : _st.OutputArray, ddepth : _st.int,
//        ksize : _types.Size, anchor : _types.Point /* = Point(-1,-1)*/,
//        normalize : boolean /*= true*/,
//        borderType : _st.int /* = BORDER_DEFAULT*/);

    /** @brief Blurs an image using the normalized box filter.
    
    The function smoothes an image using the kernel:
    
    \f[\texttt{K} =  \frac{1}{\texttt{ksize.width*ksize.height}} \begin{bmatrix} 1 & 1 & 1 &  \cdots & 1 & 1  \\ 1 & 1 & 1 &  \cdots & 1 & 1  \\ \hdotsfor{6} \\ 1 & 1 & 1 &  \cdots & 1 & 1  \\ \end{bmatrix}\f]
    
    The call `blur(src, dst, ksize, anchor, borderType)` is equivalent to `boxFilter(src, dst, src.type(),
    anchor, true, borderType)`.
    
    @param src input image; it can have any number of channels, which are processed independently, but
    the depth should be CV_8U, CV_16U, CV_16S, CV_32F or CV_64F.
    @param dst output image of the same size and type as src.
    @param ksize blurring kernel size.
    @param anchor anchor point; default value Point(-1,-1) means that the anchor is at the kernel
    center.
    @param borderType border mode used to extrapolate pixels outside of the image, see cv::BorderTypes
    @sa  boxFilter, bilateralFilter, GaussianBlur, medianBlur
     */

overload->addOverload("imgproc", "", "blur", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<Size*>("ksize",Size::name),
		make_param<Point*>("anchor",Point::name,Point::create(-1,-1)),
		make_param<int>("borderType","int",cv:: BORDER_DEFAULT)
}, blur);
	Nan::SetMethod(target, "blur", imgproc_general_callback::callback);

//export interface Iblur {
//    (src: _st.InputArray, dst: _st.OutputArray,
//        ksize: _types.Size, anchor: _types.Point /* = Point(-1,-1)*/,
//        borderType: _st.int /* = BORDER_DEFAULT*/): void;
//}
//
//export var blur: Iblur = alvision_module.blur;

    //CV_EXPORTS_W void blur(src : _st.InputArray, dst : _st.OutputArray,
    //    ksize : _types.Size, anchor : _types.Point /* = Point(-1,-1)*/,
    //    borderType : _st.int /* = BORDER_DEFAULT*/);

    /** @brief Convolves an image with the kernel.
    
    The function applies an arbitrary linear filter to an image. In-place operation is supported. When
    the aperture is partially outside the image, the function interpolates outlier pixel values
    according to the specified border mode.
    
    The function does actually compute correlation, not the convolution:
    
    \f[\texttt{dst} (x,y) =  \sum _{ \stackrel{0\leq x' < \texttt{kernel.cols},}{0\leq y' < \texttt{kernel.rows}} }  \texttt{kernel} (x',y')* \texttt{src} (x+x'- \texttt{anchor.x} ,y+y'- \texttt{anchor.y} )\f]
    
    That is, the kernel is not mirrored around the anchor point. If you need a real convolution, flip
    the kernel using cv::flip and set the new anchor to `(kernel.cols - anchor.x - 1, kernel.rows -
    anchor.y - 1)`.
    
    The function uses the DFT-based algorithm in case of sufficiently large kernels (~`11 x 11` or
    larger) and the direct algorithm for small kernels.
    
    @param src input image.
    @param dst output image of the same size and the same number of channels as src.
    @param ddepth desired depth of the destination image, see @ref filter_depths "combinations"
    @param kernel convolution kernel (or rather a correlation kernel), a single-channel floating point
    matrix; if you want to apply different kernels to different channels, split the image into
    separate color planes using split and process them individually.
    @param anchor anchor of the kernel that indicates the relative position of a filtered point within
    the kernel; the anchor should lie within the kernel; default value (-1,-1) means that the anchor
    is at the kernel center.
    @param delta optional value added to the filtered pixels before storing them in dst.
    @param borderType pixel extrapolation method, see cv::BorderTypes
    @sa  sepFilter2D, dft, matchTemplate
     */

overload->addOverload("imgproc", "", "filter2D", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"), 
		make_param<int>("ddepth","int"),
		make_param<IOArray*>("kernel","IOArray"),
		make_param<Point*>("anchor",Point::name, Point::create(-1,-1)),
		make_param<double>("delta","double", 0),
		make_param<int>("borderType","int",cv:: BORDER_DEFAULT)
}, filter2D);
	Nan::SetMethod(target, "filter2D", imgproc_general_callback::callback);

//interface Ifilter2D {
//    (src: _st.InputArray, dst: _st.OutputArray, ddepth: _st.int,
//        kernel: _st.InputArray, anchor: _types.Point /* = Point(-1,-1)*/,
//        delta: _st.double /* = 0*/, borderType: _st.int /* = BORDER_DEFAULT*/): void;
//}
//
//export var filter2D: Ifilter2D = alvision_module.filter2D;

//    CV_EXPORTS_W void filter2D(src : _st.InputArray, dst : _st.OutputArray, ddepth : _st.int,
//        kernel : _st.InputArray, anchor : _types.Point /* = Point(-1,-1)*/,
//        delta : _st.double /* = 0*/, borderType : _st.int /* = BORDER_DEFAULT*/);

    /** @brief Applies a separable linear filter to an image.
    
    The function applies a separable linear filter to the image. That is, first, every row of src is
    filtered with the 1D kernel kernelX. Then, every column of the result is filtered with the 1D
    kernel kernelY. The final result shifted by delta is stored in dst .
    
    @param src Source image.
    @param dst Destination image of the same size and the same number of channels as src .
    @param ddepth Destination image depth, see @ref filter_depths "combinations"
    @param kernelX Coefficients for filtering each row.
    @param kernelY Coefficients for filtering each column.
    @param anchor Anchor position within the kernel. The default value \f$(-1,-1)\f$ means that the anchor
    is at the kernel center.
    @param delta Value added to the filtered results before storing them.
    @param borderType Pixel extrapolation method, see cv::BorderTypes
    @sa  filter2D, Sobel, GaussianBlur, boxFilter, blur
     */

overload->addOverload("imgproc", "", "sepFilter2D", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"), 
		make_param<int>("ddepth","int"),
		make_param<IOArray*>("kernelX","IOArray"),
		make_param<IOArray*>("kernelY","IOArray"),
		make_param<Point*>("anchor",Point::name, Point::create(-1,-1)),
		make_param<double>("delta","double", 0),
		make_param<int>("borderType","int",cv:: BORDER_DEFAULT)
}, sepFilter2D);
	Nan::SetMethod(target, "sepFilter2D", imgproc_general_callback::callback);

//interface IsepFilter2D {
//    (src: _st.InputArray, dst: _st.OutputArray, ddepth: _st.int,
//        kernelX: _st.InputArray, kernelY: _st.InputArray,
//        anchor: _types.Point /* = Point(-1,-1)*/,
//        delta: _st.double /* = 0*/, borderType: _st.int /* = BORDER_DEFAULT*/): void;
//}
//
//export var sepFilter2D: IsepFilter2D = alvision_module.sepFilter2D;

    //CV_EXPORTS_W void sepFilter2D(src : _st.InputArray, dst : _st.OutputArray, ddepth : _st.int,
    //    kernel : _st.InputArrayX, kernel : _st.InputArrayY,
    //    anchor : _types.Point /* = Point(-1,-1)*/,
    //    delta : _st.double /* = 0*/, borderType : _st.int /* = BORDER_DEFAULT*/);

    /** @brief Calculates the first, second, third, or mixed image derivatives using an extended Sobel operator.
    
    In all cases except one, the \f$\texttt{ksize} \times \texttt{ksize}\f$ separable kernel is used to
    calculate the derivative. When \f$\texttt{ksize = 1}\f$, the \f$3 \times 1\f$ or \f$1 \times 3\f$
    kernel is used (that is, no Gaussian smoothing is done). `ksize = 1` can only be used for the first
    or the second x- or y- derivatives.
    
    There is also the special value `ksize = CV_SCHARR (-1)` that corresponds to the \f$3\times3\f$ Scharr
    filter that may give more accurate results than the \f$3\times3\f$ Sobel. The Scharr aperture is
    
    \f[\vecthreethree{-3}{0}{3}{-10}{0}{10}{-3}{0}{3}\f]
    
    for the x-derivative, or transposed for the y-derivative.
    
    The function calculates an image derivative by convolving the image with the appropriate kernel:
    
    \f[\texttt{dst} =  \frac{\partial^{xorder+yorder} \texttt{src}}{\partial x^{xorder} \partial y^{yorder}}\f]
    
    The Sobel operators combine Gaussian smoothing and differentiation, so the result is more or less
    resistant to the noise. Most often, the function is called with ( xorder = 1, yorder = 0, ksize = 3)
    or ( xorder = 0, yorder = 1, ksize = 3) to calculate the first x- or y- image derivative. The first
    case corresponds to a kernel of:
    
    \f[\vecthreethree{-1}{0}{1}{-2}{0}{2}{-1}{0}{1}\f]
    
    The second case corresponds to a kernel of:
    
    \f[\vecthreethree{-1}{-2}{-1}{0}{0}{0}{1}{2}{1}\f]
    
    @param src input image.
    @param dst output image of the same size and the same number of channels as src .
    @param ddepth output image depth, see @ref filter_depths "combinations"; in the case of
        8-bit input images it will result in truncated derivatives.
    @param dx order of the derivative x.
    @param dy order of the derivative y.
    @param ksize :_types.Size of the extended Sobel kernel; it must be 1, 3, 5, or 7.
    @param scale optional scale factor for the computed derivative values; by default, no scaling is
    applied (see cv::getDerivKernels for details).
    @param delta optional delta value that is added to the results prior to storing them in dst.
    @param borderType pixel extrapolation method, see cv::BorderTypes
    @sa  Scharr, Laplacian, sepFilter2D, filter2D, GaussianBlur, cartToPolar
     */



overload->addOverload("imgproc", "", "Sobel", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<int>("ddepth","int"),
		make_param<int>("dx","int"),
		make_param<int>("dy","int"),
		make_param<int>("ksize","int", 3),
		make_param<double>("scale","double", 1), 
		make_param<double>("delta","double", 0),
		make_param<int>("borderType","BorderTypes",cv:: BORDER_DEFAULT)
}, Sobel);
	Nan::SetMethod(target, "Sobel", imgproc_general_callback::callback);

//interface ISobel {
//    (src: _st.InputArray, dst: _st.OutputArray, ddepth: _st.int,
//        dx : _st.int, dy : _st.int, ksize? : _st.int /* = 3*/,
//        scale? : _st.double /* = 1*/, delta?: _st.double /* = 0*/,
//        borderType?: _base.BorderTypes | _st.int /* = BORDER_DEFAULT*/): void;
//}
//
//export var Sobel: ISobel = alvision_module.Sobel;

    //CV_EXPORTS_W void Sobel(src : _st.InputArray, dst : _st.OutputArray, ddepth : _st.int,
    //    dx : _st.int, dy : _st.int, ksize : _st.int /* = 3*/,
    //    scale : _st.double /* = 1*/, delta : _st.double /* = 0*/,
    //    borderType : _st.int /* = BORDER_DEFAULT*/);

    /** @brief Calculates the first order image derivative in both x and y using a Sobel operator
    
    Equivalent to calling:
    
    @code
    Sobel( src, dx, CV_16SC1, 1, 0, 3 );
    Sobel( src, dy, CV_16SC1, 0, 1, 3 );
    @endcode
    
    @param src input image.
    @param dx output image with first-order derivative in x.
    @param dy output image with first-order derivative in y.
    @param ksize :_types.Size of Sobel kernel. It must be 3.
    @param borderType pixel extrapolation method, see cv::BorderTypes
    
    @sa Sobel
     */

overload->addOverload("imgproc", "", "spatialGradient", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dx","IOArray"),
		make_param<IOArray*>("dy","IOArray"), 
		make_param<int>("ksize","int", 3),
		make_param<int>("borderType","int",cv:: BORDER_DEFAULT)
}, spatialGradient);
	Nan::SetMethod(target, "spatialGradient", imgproc_general_callback::callback);

//interface IspatialGradient {
//    (src: _st.InputArray, dx : _st.OutputArray,
//        dy : _st.OutputArray, ksize: _st.int /* = 3*/,
//        borderType: _st.int /* = BORDER_DEFAULT*/): void;
//}
//
//export var spatialGradient : IspatialGradient = alvision_module.spatialGradient;

//    CV_EXPORTS_W void spatialGradient(src : _st.InputArray, dx : _st.OutputArray,
//        dy : _st.OutputArray, ksize : _st.int /* = 3*/,
//        borderType : _st.int /* = BORDER_DEFAULT*/);

    /** @brief Calculates the first x- or y- image derivative using Scharr operator.
    
    The function computes the first x- or y- spatial image derivative using the Scharr operator. The
    call
    
    \f[\texttt{Scharr(src, dst, ddepth, dx, dy, scale, delta, borderType)}\f]
    
    is equivalent to
    
    \f[\texttt{Sobel(src, dst, ddepth, dx, dy, CV\_SCHARR, scale, delta, borderType)} .\f]
    
    @param src input image.
    @param dst output image of the same size and the same number of channels as src.
    @param ddepth output image depth, see @ref filter_depths "combinations"
    @param dx order of the derivative x.
    @param dy order of the derivative y.
    @param scale optional scale factor for the computed derivative values; by default, no scaling is
    applied (see getDerivKernels for details).
    @param delta optional delta value that is added to the results prior to storing them in dst.
    @param borderType pixel extrapolation method, see cv::BorderTypes
    @sa  cartToPolar
     */

overload->addOverload("imgproc", "", "Scharr", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"), 
		make_param<int>("ddepth","int"),
		make_param<int>("dx","int"),
		make_param<int>("dy","int"),
		make_param<double>("scale","double", 1),
		make_param<double>("delta","double", 0),
		make_param<int>("borderType","int",cv:: BORDER_DEFAULT)
}, Scharr);
	Nan::SetMethod(target, "Scharr", imgproc_general_callback::callback);

//interface IScharr {
//    (src: _st.InputArray, dst: _st.OutputArray, ddepth: _st.int,
//        dx: _st.int, dy: _st.int, scale: _st.double /* = 1*/, delta: _st.double /* = 0*/,
//        borderType: _st.int /* = BORDER_DEFAULT*/): void;
//}
//
//export var Scharr: IScharr = alvision_module.Scharr;

//    CV_EXPORTS_W void Scharr(src : _st.InputArray, dst : _st.OutputArray, ddepth : _st.int,
//        dx : _st.int, dy : _st.int, scale : _st.double /* = 1*/, delta : _st.double /* = 0*/,
//        borderType : _st.int /* = BORDER_DEFAULT*/);

    /** @example laplace.cpp
      An example using Laplace transformations for edge detection
    */

    /** @brief Calculates the Laplacian of an image.
    
    The function calculates the Laplacian of the source image by adding up the second x and y
    derivatives calculated using the Sobel operator:
    
    \f[\texttt{dst} =  \Delta \texttt{src} =  \frac{\partial^2 \texttt{src}}{\partial x^2} +  \frac{\partial^2 \texttt{src}}{\partial y^2}\f]
    
    This is done when `ksize > 1`. When `ksize == 1`, the Laplacian is computed by filtering the image
    with the following \f$3 \times 3\f$ aperture:
    
    \f[\vecthreethree {0}{1}{0}{1}{-4}{1}{0}{1}{0}\f]
    
    @param src Source image.
    @param dst Destination image of the same size and the same number of channels as src .
    @param ddepth Desired depth of the destination image.
    @param ksize Aperture size used to compute the second-derivative filters. See getDerivKernels for
    details. The size must be positive and odd.
    @param scale Optional scale factor for the computed Laplacian values. By default, no scaling is
    applied. See getDerivKernels for details.
    @param delta Optional delta value that is added to the results prior to storing them in dst .
    @param borderType Pixel extrapolation method, see cv::BorderTypes
    @sa  Sobel, Scharr
     */


overload->addOverload("imgproc", "", "Laplacian", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"), 
		make_param<int>("ddepth","int"),
		make_param<int>("ksize","int", 1),
		make_param<double>("scale","double", 1),
		make_param<double>("delta","double", 0),
		make_param<int>("borderType","int",cv:: BORDER_DEFAULT)
}, Laplacian);
	Nan::SetMethod(target, "Laplacian", imgproc_general_callback::callback);

//interface ILaplacian{
//    (src: _st.InputArray, dst: _st.OutputArray, ddepth: _st.int,
//    ksize? : _st.int /* = 1*/, scale?: _st.double /* = 1*/, delta?: _st.double /* = 0*/,
//    borderType?: _st.int /* = BORDER_DEFAULT*/): void;
//}
//
//export var Laplacian: ILaplacian = alvision_module.Laplacian;

//    CV_EXPORTS_W void Laplacian(src : _st.InputArray, dst : _st.OutputArray, ddepth : _st.int,
//        ksize : _st.int /* = 1*/, scale : _st.double /* = 1*/, delta : _st.double /* = 0*/,
//        borderType : _st.int /* = BORDER_DEFAULT*/);

    //! @} imgproc_filter

    //! @addtogroup imgproc_feature
    //! @{

    /** @example edge.cpp
      An example on using the canny edge detector
    */

    /** @brief Finds edges in an image using the Canny algorithm @cite Canny86 .
    
    The function finds edges in the input image image and marks them in the output map edges using the
    Canny algorithm. The smallest value between threshold1 and threshold2 is used for edge linking. The
    largest value is used to find initial segments of strong edges. See
    <http://en.wikipedia.org/wiki/Canny_edge_detector>
    
    @param image 8-bit input image.
    @param edges output edge map; single channels 8-bit image, which has the same size as image .
    @param threshold1 first threshold for the hysteresis procedure.
    @param threshold2 second threshold for the hysteresis procedure.
    @param apertureSize aperture size for the Sobel operator.
    @param L2gradient a flag, indicating whether a more accurate \f$L_2\f$ norm
    \f$=\sqrt{(dI/dx)^2 + (dI/dy)^2}\f$ should be used to calculate the image gradient magnitude (
    L2gradient=true ), or whether the default \f$L_1\f$ norm \f$=|dI/dx|+|dI/dy|\f$ is enough (
    L2gradient=false ).
     */

overload->addOverload("imgproc", "", "Canny", {
		make_param<IOArray*>("image","IOArray"),
		make_param<IOArray*>("edges","IOArray"),
		make_param<double>("threshold1","double"), 
		make_param<double>("threshold2","double"),
		make_param<int>("apertureSize","int", 3),
		make_param<bool>("L2gradient","bool", false)
}, Canny);
	Nan::SetMethod(target, "Canny", imgproc_general_callback::callback);

//interface ICanny {
//    (image: _st.InputArray, edges : _st.OutputArray,
//        threshold1 : _st.double, threshold2 : _st.double,
//        apertureSize? : _st.int /* = 3*/, L2gradient? : boolean /* = false*/): void;
//}
//
//export var Canny: ICanny = alvision_module.Canny;

//    CV_EXPORTS_W void Canny(image : _st.InputArray, edges : _st.OutputArray,
//        threshold1 : _st.double, threshold2 : _st.double,
//        apertureSize : _st.int /* = 3*/, L2gradient : boolean /* = false*/);

    /** @brief Calculates the minimal eigenvalue of gradient matrices for corner detection.
    
    The function is similar to cornerEigenValsAndVecs but it calculates and stores only the minimal
    eigenvalue of the covariance matrix of derivatives, that is, \f$\min(\lambda_1, \lambda_2)\f$ in terms
    of the formulae in the cornerEigenValsAndVecs description.
    
    @param src Input single-channel 8-bit or floating-point image.
    @param dst Image to store the minimal eigenvalues. It has the type CV_32FC1 and the same size as
    src .
    @param blockSize Neighborhood size (see the details on cornerEigenValsAndVecs ).
    @param ksize Aperture parameter for the Sobel operator.
    @param borderType Pixel extrapolation method. See cv::BorderTypes.
     */

overload->addOverload("imgproc", "", "cornerMinEigenVal", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<int>("blockSize","int"), 
		make_param<int>("ksize","int", 3),
		make_param<int>("borderType","int",cv:: BORDER_DEFAULT)
}, cornerMinEigenVal);
	Nan::SetMethod(target, "cornerMinEigenVal", imgproc_general_callback::callback);

//interface IcornerMinEigenVal{
//    (src: _st.InputArray, dst: _st.OutputArray,
//        blockSize : _st.int, ksize: _st.int /* = 3*/,
//        borderType: _st.int /* = BORDER_DEFAULT*/): void;
//}
//
//export var cornerMinEigenVal: IcornerMinEigenVal = alvision_module.cornerMinEigenVal;


//    CV_EXPORTS_W void cornerMinEigenVal(src : _st.InputArray, dst : _st.OutputArray,
//        blockSize : _st.int, ksize : _st.int /* = 3*/,
//        borderType : _st.int /* = BORDER_DEFAULT*/);

    /** @brief Harris corner detector.
    
    The function runs the Harris corner detector on the image. Similarly to cornerMinEigenVal and
    cornerEigenValsAndVecs , for each pixel \f$(x, y)\f$ it calculates a \f$2\times2\f$ gradient covariance
    matrix \f$M^{(x,y)}\f$ over a \f$\texttt{blockSize} \times \texttt{blockSize}\f$ neighborhood. Then, it
    computes the following characteristic:
    
    \f[\texttt{dst} (x,y) =  \mathrm{det} M^{(x,y)} - k  \cdot \left ( \mathrm{tr} M^{(x,y)} \right )^2\f]
    
    Corners in the image can be found as the local maxima of this response map.
    
    @param src Input single-channel 8-bit or floating-point image.
    @param dst Image to store the Harris detector responses. It has the type CV_32FC1 and the same
    size as src .
    @param blockSize Neighborhood size (see the details on cornerEigenValsAndVecs ).
    @param ksize Aperture parameter for the Sobel operator.
    @param k Harris detector free parameter. See the formula below.
    @param borderType Pixel extrapolation method. See cv::BorderTypes.
     */

overload->addOverload("imgproc", "", "cornerHarris", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"), 
		make_param<int>("blockSize","int"),
		make_param<int>("ksize","int"),
		make_param<double>("k","double"),
		make_param<int>("borderType","int",cv:: BORDER_DEFAULT)
}, cornerHarris);
	Nan::SetMethod(target, "cornerHarris", imgproc_general_callback::callback);

//interface IcornerHarris {
//    (src: _st.InputArray, dst: _st.OutputArray, blockSize: _st.int,
//        ksize : _st.int, k : _st.double,
//        borderType: _st.int /* = BORDER_DEFAULT*/): void;
//}
//
//export var cornerHarris: IcornerHarris = alvision_module.cornerHarris;


//
//    CV_EXPORTS_W void cornerHarris(src : _st.InputArray, dst : _st.OutputArray, blockSize : _st.int,
//        ksize : _st.int, k : _st.double,
//        borderType : _st.int /* = BORDER_DEFAULT*/);

    /** @brief Calculates eigenvalues and eigenvectors of image blocks for corner detection.
    
    For every pixel \f$p\f$ , the function cornerEigenValsAndVecs considers a blockSize \f$\times\f$ blockSize
    neighborhood \f$S(p)\f$ . It calculates the covariation matrix of derivatives over the neighborhood as:
    
    \f[M =  \begin{bmatrix} \sum _{S(p)}(dI/dx)^2 &  \sum _{S(p)}dI/dx dI/dy  \\ \sum _{S(p)}dI/dx dI/dy &  \sum _{S(p)}(dI/dy)^2 \end{bmatrix}\f]
    
    where the derivatives are computed using the Sobel operator.
    
    After that, it finds eigenvectors and eigenvalues of \f$M\f$ and stores them in the destination image as
    \f$(\lambda_1, \lambda_2, x_1, y_1, x_2, y_2)\f$ where
    
    -   \f$\lambda_1, \lambda_2\f$ are the non-sorted eigenvalues of \f$M\f$
    -   \f$x_1, y_1\f$ are the eigenvectors corresponding to \f$\lambda_1\f$
    -   \f$x_2, y_2\f$ are the eigenvectors corresponding to \f$\lambda_2\f$
    
    The output of the function can be used for robust edge or corner detection.
    
    @param src Input single-channel 8-bit or floating-point image.
    @param dst Image to store the results. It has the same size as src and the type CV_32FC(6) .
    @param blockSize Neighborhood size (see details below).
    @param ksize Aperture parameter for the Sobel operator.
    @param borderType Pixel extrapolation method. See cv::BorderTypes.
    
    @sa  cornerMinEigenVal, cornerHarris, preCornerDetect
     */

overload->addOverload("imgproc", "", "cornerEigenValsAndVecs", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<int>("blockSize","int"),
		make_param<int>("ksize","int"),
		make_param<int>("borderType","int",cv:: BORDER_DEFAULT)

}, cornerEigenValsAndVecs);
	Nan::SetMethod(target, "cornerEigenValsAndVecs", imgproc_general_callback::callback);

//interface IcornerEigenValsAndVecs{
//    (src: _st.InputArray, dst: _st.OutputArray,
//        blockSize: _st.int, ksize: _st.int,
//        borderType: _st.int /* = BORDER_DEFAULT*/): void;
//}
//
//export var cornerEigenValsAndVecs: IcornerEigenValsAndVecs = alvision_module.cornerEigenValsAndVecs;

//    CV_EXPORTS_W void cornerEigenValsAndVecs(src : _st.InputArray, dst : _st.OutputArray,
//        blockSize : _st.int, ksize : _st.int,
//        borderType : _st.int /* = BORDER_DEFAULT*/);

    /** @brief Calculates a feature map for corner detection.
    
    The function calculates the complex spatial derivative-based function of the source image
    
    \f[\texttt{dst} = (D_x  \texttt{src} )^2  \cdot D_{yy}  \texttt{src} + (D_y  \texttt{src} )^2  \cdot D_{xx}  \texttt{src} - 2 D_x  \texttt{src} \cdot D_y  \texttt{src} \cdot D_{xy}  \texttt{src}\f]
    
    where \f$D_x\f$,\f$D_y\f$ are the first image derivatives, \f$D_{xx}\f$,\f$D_{yy}\f$ are the second image
    derivatives, and \f$D_{xy}\f$ is the mixed derivative.
    
    The corners can be found as local maximums of the functions, as shown below:
    @code
        Mat corners, dilated_corners;
        preCornerDetect(image, corners, 3);
        // dilation with 3x3 rectangular structuring element
        dilate(corners, dilated_corners, Mat(), 1);
        Mat corner_mask = corners == dilated_corners;
    @endcode
    
    @param src Source single-channel 8-bit of floating-point image.
    @param dst Output image that has the type CV_32F and the same size as src .
    @param ksize %Aperture size of the Sobel .
    @param borderType Pixel extrapolation method. See cv::BorderTypes.
     */


overload->addOverload("imgproc", "", "preCornerDetect", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"), 
		make_param<int>("ksize","int"),
		make_param<int>("borderType","int",cv::BORDER_DEFAULT)
}, preCornerDetect);
	Nan::SetMethod(target, "preCornerDetect", imgproc_general_callback::callback);

//interface IpreCornerDetect{
//    (src: _st.InputArray, dst: _st.OutputArray, ksize: _st.int,
//    borderType: _st.int /* = BORDER_DEFAULT*/): void;
//}
//
//export var preCornerDetect: IpreCornerDetect = alvision_module.preCornerDetect;

//    CV_EXPORTS_W void preCornerDetect(src : _st.InputArray, dst : _st.OutputArray, ksize : _st.int,
//        borderType : _st.int /* = BORDER_DEFAULT*/);

    /** @brief Refines the corner locations.
    
    The function iterates to find the sub-pixel accurate location of corners or radial saddle points, as
    shown on the figure below.
    
    ![image](pics/cornersubpix.png)
    
    Sub-pixel accurate corner locator is based on the observation that every vector from the center \f$q\f$
    to a point \f$p\f$ located within a neighborhood of \f$q\f$ is orthogonal to the image gradient at \f$p\f$
    subject to image and measurement noise. Consider the expression:
    
    \f[\epsilon _i = {DI_{p_i}}^T  \cdot (q - p_i)\f]
    
    where \f${DI_{p_i}}\f$ is an image gradient at one of the points \f$p_i\f$ in a neighborhood of \f$q\f$ . The
    value of \f$q\f$ is to be found so that \f$\epsilon_i\f$ is minimized. A system of equations may be set up
    with \f$\epsilon_i\f$ set to zero:
    
    \f[\sum _i(DI_{p_i}  \cdot {DI_{p_i}}^T) -  \sum _i(DI_{p_i}  \cdot {DI_{p_i}}^T  \cdot p_i)\f]
    
    where the gradients are summed within a neighborhood ("search window") of \f$q\f$ . Calling the first
    gradient term \f$G\f$ and the second gradient term \f$b\f$ gives:
    
    \f[q = G^{-1}  \cdot b\f]
    
    The algorithm sets the center of the neighborhood window at this new center \f$q\f$ and then iterates
    until the center stays within a set threshold.
    
    @param image Input image.
    @param corners Initial coordinates of the input corners and refined coordinates provided for
    output.
    @param winSize Half of the side length of the search window. For example, if winSize=Size(5,5) ,
    then a \f$5*2+1 \times 5*2+1 = 11 \times 11\f$ search window is used.
    @param zeroZone Half of the size of the dead region in the middle of the search zone over which
    the summation in the formula below is not done. It is used sometimes to avoid possible
    singularities of the autocorrelation matrix. The value of (-1,-1) indicates that there is no such
    a size.
    @param criteria Criteria for termination of the iterative process of corner refinement. That is,
    the process of corner position refinement stops either after criteria.maxCount iterations or when
    the corner position moves by less than criteria.epsilon on some iteration.
     */

overload->addOverload("imgproc", "", "cornerSubPix", {
		make_param<IOArray*>("image","IOArray"),
		make_param<IOArray*>("corners","IOArray"),
		make_param<Size*>("winSize",Size::name),
		make_param<Size*>("zeroZone",Size::name),
		make_param<TermCriteria*>("criteria","TermCriteria")
}, cornerSubPix);
	Nan::SetMethod(target, "cornerSubPix", imgproc_general_callback::callback);

//interface IcornerSubPix{
//    (image: _st.InputArray, Inputcorners: _st.OutputArray,
//        winSize: _types.Size, zeroZone: _types.Size,
//        criteria: _types.TermCriteria): void;
//}
//
//export var cornerSubPix: IcornerSubPix = alvision_module.cornerSubPix;


//
//    CV_EXPORTS_W void cornerSubPix(image : _st.InputArray, Inputcorners : _st.OutputArray,
//        winSize : _types.Size, zeroZone : _types.Size,
//        criteria : _types.TermCriteria );

    /** @brief Determines strong corners on an image.
    
    The function finds the most prominent corners in the image or in the specified image region, as
    described in @cite Shi94
    
    -   Function calculates the corner quality measure at every source image pixel using the
        cornerMinEigenVal or cornerHarris .
    -   Function performs a non-maximum suppression (the local maximums in *3 x 3* neighborhood are
        retained).
    -   The corners with the minimal eigenvalue less than
        \f$\texttt{qualityLevel} \cdot \max_{x,y} qualityMeasureMap(x,y)\f$ are rejected.
    -   The remaining corners are sorted by the quality measure in the descending order.
    -   Function throws away each corner for which there is a stronger corner at a distance less than
        maxDistance.
    
    The function can be used to initialize a point-based tracker of an object.
    
    @note If the function is called with different values A and B of the parameter qualityLevel , and
    A \> B, the vector of returned corners with qualityLevel=A will be the prefix of the output vector
    with qualityLevel=B .
    
    @param image Input 8-bit or floating-point 32-bit, single-channel image.
    @param corners Output vector of detected corners.
    @param maxCorners Maximum number of corners to return. If there are more corners than are found,
    the strongest of them is returned.
    @param qualityLevel Parameter characterizing the minimal accepted quality of image corners. The
    parameter value is multiplied by the best corner quality measure, which is the minimal eigenvalue
    (see cornerMinEigenVal ) or the Harris function response (see cornerHarris ). The corners with the
    quality measure less than the product are rejected. For example, if the best corner has the
    quality measure = 1500, and the qualityLevel=0.01 , then all the corners with the quality measure
    less than 15 are rejected.
    @param minDistance Minimum possible Euclidean distance between the returned corners.
    @param mask Optional region of interest. If the image is not empty (it needs to have the type
    CV_8UC1 and the same size as image ), it specifies the region in which the corners are detected.
    @param blocksize :_types.Size of an average block for computing a derivative covariation matrix over each
    pixel neighborhood. See cornerEigenValsAndVecs .
    @param useHarrisDetector Parameter indicating whether to use a Harris detector (see cornerHarris)
    or cornerMinEigenVal.
    @param k Free parameter of the Harris detector.
    
    @sa  cornerMinEigenVal, cornerHarris, calcOpticalFlowPyrLK, estimateRigidTransform,
     */

overload->addOverload("imgproc", "", "goodFeaturesToTrack", {
		make_param<IOArray*>("image","IOArray"),
		make_param<IOArray*>("corners","IOArray"),
		make_param<int>("maxCorners","int"),
		make_param<double>("qualityLevel","double"),
		make_param<double>("minDistance","double"),
		make_param<IOArray*>("mask","IOArray",IOArray:: noArray()),
		make_param<int>("blockSize","int", 3),
		make_param<bool>("useHarrisDetector","bool", false),
		make_param<double>("k","double", 0.04)
}, goodFeaturesToTrack);
	Nan::SetMethod(target, "goodFeaturesToTrack", imgproc_general_callback::callback);


//interface IgoodFeaturesToTrack{
//    (image: _st.InputArray, corners: _st.OutputArray,
//        maxCorners : _st.int, qualityLevel : _st.double, minDistance : _st.double,
//        mask? : _st.InputArray /* = noArray()*/, blockSize?: _st.int /*= 3*/,
//        useHarrisDetector? : boolean /*= false*/, k?: _st.double /*= 0.04*/): void;
//}
//
//export var goodFeaturesToTrack: IgoodFeaturesToTrack = alvision_module.goodFeaturesToTrack;

//    CV_EXPORTS_W void goodFeaturesToTrack(image : _st.InputArray, corners : _st.OutputArray,
//        maxCorners : _st.int, qualityLevel : _st.double, minDistance : _st.double,
//        mask : _st.InputArray /* = noArray()*/, blockSize : _st.int = 3,
//        bool useHarrisDetector = false, k : _st.double = 0.04);

    /** @example houghlines.cpp
    An example using the Hough line detector
    */

    /** @brief Finds lines in a binary image using the standard Hough transform.
    
    The function implements the standard or standard multi-scale Hough transform algorithm for line
    detection. See <http://homepages.inf.ed.ac.uk/rbf/HIPR2/hough.htm> for a good explanation of Hough
    transform.
    
    @param image 8-bit, single-channel binary source image. The image may be modified by the function.
    @param lines Output vector of lines. Each line is represented by a two-element vector
    \f$(\rho, \theta)\f$ . \f$\rho\f$ is the distance from the coordinate origin \f$(0,0)\f$ (top-left corner of
    the image). \f$\theta\f$ is the line rotation angle in radians (
    \f$0 \sim \textrm{vertical line}, \pi/2 \sim \textrm{horizontal line}\f$ ).
    @param rho Distance resolution of the accumulator in pixels.
    @param theta Angle resolution of the accumulator in radians.
    @param threshold Accumulator threshold parameter. Only those lines are returned that get enough
    votes ( \f$>\texttt{threshold}\f$ ).
    @param srn For the multi-scale Hough transform, it is a divisor for the distance resolution rho .
    The coarse accumulator distance resolution is rho and the accurate accumulator resolution is
    rho/srn . If both srn=0 and stn=0 , the classical Hough transform is used. Otherwise, both these
    parameters should be positive.
    @param stn For the multi-scale Hough transform, it is a divisor for the distance resolution theta.
    @param min_theta For standard and multi-scale Hough transform, minimum angle to check for lines.
    Must fall between 0 and max_theta.
    @param max_theta For standard and multi-scale Hough transform, maximum angle to check for lines.
    Must fall between min_theta and CV_PI.
     */


overload->addOverload("imgproc", "", "HoughLines", {
		make_param<IOArray*>("image","IOArray"),
		make_param<IOArray*>("lines","IOArray"),
		make_param<double>("rho","double"),
		make_param<double>("theta","double"),
		make_param<int>("threshold","int"),
		make_param<double>("srn","double", 0), 
		make_param<double>("stn","double", 0),
		make_param<double>("min_theta","double", 0),
		make_param<double>("max_theta","double", CV_PI)
}, HoughLines);
	Nan::SetMethod(target, "HoughLines", imgproc_general_callback::callback);


//interface IHoughLines{
//    (image: _st.InputArray, lines: _st.OutputArray,
//        rho: _st.double, theta: _st.double, threshold: _st.int,
//        srn: _st.double /* = 0*/, stn: _st.double /* = 0*/,
//        min_theta: _st.double /* = 0*/, max_theta: _st.double /* = CV_PI*/): void;
//}
//
//export var HoughLines: IHoughLines = alvision_module.HoughLines;

//    CV_EXPORTS_W void HoughLines(image : _st.InputArray, lines : _st.OutputArray,
//        rho : _st.double, theta : _st.double, threshold : _st.int,
//        srn : _st.double /* = 0*/, stn : _st.double /* = 0*/,
//        min_theta : _st.double /* = 0*/, max_theta : _st.double /* = CV_PI*/);

    /** @brief Finds line segments in a binary image using the probabilistic Hough transform.
    
    The function implements the probabilistic Hough transform algorithm for line detection, described
    in @cite Matas00
    
    See the line detection example below:
    
    @code
        #include <opencv2/imgproc.hpp>
        #include <opencv2/highgui.hpp>
    
        using namespace cv;
        using namespace std;
    
        int main(int argc, char** argv)
        {
            Mat src, dst, color_dst;
            if( argc != 2 || !(src=imread(argv[1], 0)).data)
                return -1;
    
            Canny( src, dst, 50, 200, 3 );
            cvtColor( dst, color_dst, COLOR_GRAY2BGR );
    
        #if 0
            vector<Vec2f> lines;
            HoughLines( dst, lines, 1, CV_PI/180, 100 );
    
            for( size_t i = 0; i < lines.size(); i++ )
            {
                float rho = lines[i][0];
                float theta = lines[i][1];
                double a = cos(theta), b = sin(theta);
                double x0 = a*rho, y0 = b*rho;
                pt1 : _types.Point(cvRound(x0 + 1000*(-b)),
                          cvRound(y0 + 1000*(a)));
                pt2 : _types.Point(cvRound(x0 - 1000*(-b)),
                          cvRound(y0 - 1000*(a)));
                line( color_dst, pt1, pt2, Scalar(0,0,255), 3, 8 );
            }
        #else
            vector<Vec4i> lines;
            HoughLinesP( dst, lines, 1, CV_PI/180, 80, 30, 10 );
            for( size_t i = 0; i < lines.size(); i++ )
            {
                line( color_dst, Point(lines[i][0], lines[i][1]),
                    Point(lines[i][2], lines[i][3]), Scalar(0,0,255), 3, 8 );
            }
        #endif
            namedWindow( "Source", 1 );
            imshow( "Source", src );
    
            namedWindow( "Detected Lines", 1 );
            imshow( "Detected Lines", color_dst );
    
            waitKey(0);
            return 0;
        }
    @endcode
    This is a sample picture the function parameters have been tuned for:
    
    ![image](pics/building.jpg)
    
    And this is the output of the above program in case of the probabilistic Hough transform:
    
    ![image](pics/houghp.png)
    
    @param image 8-bit, single-channel binary source image. The image may be modified by the function.
    @param lines Output vector of lines. Each line is represented by a 4-element vector
    \f$(x_1, y_1, x_2, y_2)\f$ , where \f$(x_1,y_1)\f$ and \f$(x_2, y_2)\f$ are the ending points of each detected
    line segment.
    @param rho Distance resolution of the accumulator in pixels.
    @param theta Angle resolution of the accumulator in radians.
    @param threshold Accumulator threshold parameter. Only those lines are returned that get enough
    votes ( \f$>\texttt{threshold}\f$ ).
    @param minLineLength Minimum line length. Line segments shorter than that are rejected.
    @param maxLineGap Maximum allowed gap between points on the same line to link them.
    
    @sa LineSegmentDetector
     */


overload->addOverload("imgproc", "", "HoughLinesP", {
	make_param<IOArray*>("image","IOArray"),
	make_param<IOArray*>("lines","IOArray"),
	make_param<double>("rho","double"),
	make_param<double>("theta","double"),
	make_param<int>("threshold","int"),
	make_param<double>("minLineLength","double", 0),
	make_param<double>("maxLineGap","double", 0)
}, HoughLinesP);
Nan::SetMethod(target, "HoughLinesP", imgproc_general_callback::callback);

//interface IHoughLinesP {
//    (image: _st.InputArray, lines: _st.OutputArray,
//        rho: _st.double, theta: _st.double, threshold: _st.int,
//        minLineLength : _st.double /* = 0*/, maxLineGap : _st.double /* = 0*/): void;
//}
//
//export var HoughLinesP: IHoughLinesP = alvision_module.HoughLinesP;

//    CV_EXPORTS_W void HoughLinesP(image : _st.InputArray, lines : _st.OutputArray,
//        rho : _st.double, theta : _st.double, threshold : _st.int,
//        minLineLength : _st.double /* = 0*/, maxLineGap : _st.double /* = 0*/);

    /** @example houghcircles.cpp
    An example using the Hough circle detector
    */

    /** @brief Finds circles in a grayscale image using the Hough transform.
    
    The function finds circles in a grayscale image using a modification of the Hough transform.
    
    Example: :
    @code
        #include <opencv2/imgproc.hpp>
        #include <opencv2/highgui.hpp>
        #include <math.h>
    
        using namespace cv;
        using namespace std;
    
        int main(int argc, char** argv)
        {
            Mat img, gray;
            if( argc != 2 || !(img=imread(argv[1], 1)).data)
                return -1;
            cvtColor(img, gray, COLOR_BGR2GRAY);
            // smooth it, otherwise a lot of false circles may be detected
            GaussianBlur( gray, gray, Size(9, 9), 2, 2 );
            vector<Vec3f> circles;
            HoughCircles(gray, circles, HOUGH_GRADIENT,
                         2, gray.rows/4, 200, 100 );
            for( size_t i = 0; i < circles.size(); i++ )
            {
                 center : _types.Point(cvRound(circles[i][0]), cvRound(circles[i][1]));
                 radius : _st.int = cvRound(circles[i][2]);
                 // draw the circle center
                 circle( img, center, 3, Scalar(0,255,0), -1, 8, 0 );
                 // draw the circle outline
                 circle( img, center, radius, Scalar(0,0,255), 3, 8, 0 );
            }
            namedWindow( "circles", 1 );
            imshow( "circles", img );
    
            waitKey(0);
            return 0;
        }
    @endcode
    
    @note Usually the function detects the centers of circles well. However, it may fail to find correct
    radii. You can assist to the function by specifying the radius range ( minRadius and maxRadius ) if
    you know it. Or, you may ignore the returned radius, use only the center, and find the correct
    radius using an additional procedure.
    
    @param image 8-bit, single-channel, grayscale input image.
    @param circles Output vector of found circles. Each vector is encoded as a 3-element
    floating-point vector \f$(x, y, radius)\f$ .
    @param method Detection method, see cv::HoughModes. Currently, the only implemented method is HOUGH_GRADIENT
    @param dp Inverse ratio of the accumulator resolution to the image resolution. For example, if
    dp=1 , the accumulator has the same resolution as the input image. If dp=2 , the accumulator has
    half as big width and height.
    @param minDist Minimum distance between the centers of the detected circles. If the parameter is
    too small, multiple neighbor circles may be falsely detected in addition to a true one. If it is
    too large, some circles may be missed.
    @param param1 First method-specific parameter. In case of CV_HOUGH_GRADIENT , it is the higher
    threshold of the two passed to the Canny edge detector (the lower one is twice smaller).
    @param param2 Second method-specific parameter. In case of CV_HOUGH_GRADIENT , it is the
    accumulator threshold for the circle centers at the detection stage. The smaller it is, the more
    false circles may be detected. Circles, corresponding to the larger accumulator values, will be
    returned first.
    @param minRadius Minimum circle radius.
    @param maxRadius Maximum circle radius.
    
    @sa fitEllipse, minEnclosingCircle
     */


overload->addOverload("imgproc", "", "HoughCircles", {
		make_param<IOArray*>("image","IOArray"),
		make_param<IOArray*>("circles","IOArray"),
		make_param<int>("method","int"),
		make_param<double>("dp","double"),
		make_param<double>("minDist","double"),
		make_param<double>("param1","double", 100),
		make_param<double>("param2","double", 100),
		make_param<int>("minRadius","int", 0), 
		make_param<int>("maxRadius","int", 0)
}, HoughCircles);
Nan::SetMethod(target, "HoughCircles", imgproc_general_callback::callback);

//interface IHoughCircles{
//    (image: _st.InputArray, circles : _st.OutputArray,
//    method : _st.int, dp : _st.double, minDist : _st.double,
//    param1 : _st.double /* = 100*/, param2 : _st.double /* = 100*/,
//    minRadius : _st.int /* = 0*/, maxRadius : _st.int /* = 0*/): void;
//}
//
//export var HoughCircles: IHoughCircles = alvision_module.HoughCircles;

//    CV_EXPORTS_W void HoughCircles(image : _st.InputArray, circles : _st.OutputArray,
//        method : _st.int, dp : _st.double, minDist : _st.double,
//        param1 : _st.double /* = 100*/, param2 : _st.double /* = 100*/,
//        minRadius : _st.int /* = 0*/, maxRadius : _st.int /* = 0*/);

    //! @} imgproc_feature

    //! @addtogroup imgproc_filter
    //! @{

    /** @example morphology2.cpp
      An example using the morphological operations
    */

    /** @brief Erodes an image by using a specific structuring element.
    
    The function erodes the source image using the specified structuring element that determines the
    shape of a pixel neighborhood over which the minimum is taken:
    
    \f[\texttt{dst} (x,y) =  \min _{(x',y'):  \, \texttt{element} (x',y') \ne0 } \texttt{src} (x+x',y+y')\f]
    
    The function supports the in-place mode. Erosion can be applied several ( iterations ) times. In
    case of multi-channel images, each channel is processed independently.
    
    @param src input image; the number of channels can be arbitrary, but the depth should be one of
    CV_8U, CV_16U, CV_16S, CV_32F or CV_64F.
    @param dst output image of the same size and type as src.
    @param kernel structuring element used for erosion; if `element=Mat()`, a `3 x 3` rectangular
    structuring element is used. Kernel can be created using getStructuringElement.
    @param anchor position of the anchor within the element; default value (-1, -1) means that the
    anchor is at the element center.
    @param iterations number of times erosion is applied.
    @param borderType pixel extrapolation method, see cv::BorderTypes
    @param borderValue border value in case of a constant border
    @sa  dilate, morphologyEx, getStructuringElement
     */


overload->addOverload("imgproc", "", "erode", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"), 
	make_param<IOArray*>("kernel","IOArray"),
	make_param<Point*>("anchor",Point::name, Point::create(-1,-1)),
	make_param<int>("iterations","int", 1),
	make_param<int>("borderType","BorderTypes",cv:: BORDER_CONSTANT),
	make_param<Scalar*>("borderValue",Scalar::name, morphologyDefaultBorderValue_all())
}, erode);
Nan::SetMethod(target, "erode", imgproc_general_callback::callback);

//interface Ierode{
//    (src: _st.InputArray, dst: _st.OutputArray, kernel: _st.InputArray,
//        anchor?: _types.Point /* = Point(-1,-1)*/, iterations?: _st.int /* = 1*/,
//        borderType?: _base.BorderTypes | _st.int /* = BORDER_CONSTANT*/,
//        borderValue?: _types.Scalar /* = morphologyDefaultBorderValue()*/): void;
//}
//
//export var erode: Ierode = alvision_module.erode;

//    CV_EXPORTS_W void erode(src : _st.InputArray, dst : _st.OutputArray, kernel : _st.InputArray,
//        anchor : _types.Point /* = Point(-1,-1)*/, iterations : _st.int /* = 1*/,
//        borderType : _st.int /* = BORDER_CONSTANT*/,
//                         borderValue : _types.Scalar /* = morphologyDefaultBorderValue()*/ );

    /** @brief Dilates an image by using a specific structuring element.
    
    The function dilates the source image using the specified structuring element that determines the
    shape of a pixel neighborhood over which the maximum is taken:
    \f[\texttt{dst} (x,y) =  \max _{(x',y'):  \, \texttt{element} (x',y') \ne0 } \texttt{src} (x+x',y+y')\f]
    
    The function supports the in-place mode. Dilation can be applied several ( iterations ) times. In
    case of multi-channel images, each channel is processed independently.
    
    @param src input image; the number of channels can be arbitrary, but the depth should be one of
    CV_8U, CV_16U, CV_16S, CV_32F or CV_64F.
    @param dst output image of the same size and type as src\`.
    @param kernel structuring element used for dilation; if elemenat=Mat(), a 3 x 3 rectangular
    structuring element is used. Kernel can be created using getStructuringElement
    @param anchor position of the anchor within the element; default value (-1, -1) means that the
    anchor is at the element center.
    @param iterations number of times dilation is applied.
    @param borderType pixel extrapolation method, see cv::BorderTypes
    @param borderValue border value in case of a constant border
    @sa  erode, morphologyEx, getStructuringElement
     */

overload->addOverload("imgproc", "", "dilate", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"), 
		make_param<IOArray*>("kernel","IOArray"),
		make_param<Point*>("anchor",Point::name, Point::create(-1,-1)),
		make_param<int>("iterations","int", 1),
		make_param<int>("borderType","BorderTypes",cv::BORDER_CONSTANT),
		make_param<Scalar*>("borderValue",Scalar::name,morphologyDefaultBorderValue_all())
}, dilate);
Nan::SetMethod(target, "dilate", imgproc_general_callback::callback);


//interface Idilate{
//    (src: _st.InputArray, dst: _st.OutputArray, kernel: _st.InputArray,
//    anchor?: _types.Point /* = Point(-1,-1)*/, iterations?: _st.int /* = 1*/,
//    borderType?: _base.BorderTypes |  _st.int /* = BORDER_CONSTANT*/,
//    borderValue?: _types.Scalar /* = morphologyDefaultBorderValue()*/): void;
//}
//
//export var dilate: Idilate = alvision_module.dilate;

//    CV_EXPORTS_W void dilate(src : _st.InputArray, dst : _st.OutputArray, kernel : _st.InputArray,
//        anchor : _types.Point /* = Point(-1,-1)*/, iterations : _st.int /* = 1*/,
//        borderType : _st.int /* = BORDER_CONSTANT*/,
//                          borderValue : _types.Scalar /* = morphologyDefaultBorderValue()*/ );

    /** @brief Performs advanced morphological transformations.
    
    The function morphologyEx can perform advanced morphological transformations using an erosion and dilation as
    basic operations.
    
    Any of the operations can be done in-place. In case of multi-channel images, each channel is
    processed independently.
    
    @param src Source image. The number of channels can be arbitrary. The depth should be one of
    CV_8U, CV_16U, CV_16S, CV_32F or CV_64F.
    @param dst Destination image of the same size and type as source image.
    @param op Type of a morphological operation, see cv::MorphTypes
    @param kernel Structuring element. It can be created using cv::getStructuringElement.
    @param anchor Anchor position with the kernel. Negative values mean that the anchor is at the
    kernel center.
    @param iterations Number of times erosion and dilation are applied.
    @param borderType Pixel extrapolation method, see cv::BorderTypes
    @param borderValue Border value in case of a constant border. The default value has a special
    meaning.
    @sa  dilate, erode, getStructuringElement
     */

overload->addOverload("imgproc", "", "morphologyEx", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<int>("op","int"),
		make_param<IOArray*>("kernel","IOArray"),
		make_param<Point*>("anchor",Point::name, Point::create(-1,-1)),
		make_param<int>("iterations","int", 1),
		make_param<int>("borderType","int",cv:: BORDER_CONSTANT),
		make_param<Scalar*>("borderValue",Scalar::name,morphologyDefaultBorderValue_all())
}, morphologyEx);
Nan::SetMethod(target, "morphologyEx", imgproc_general_callback::callback);


//interface ImorphologyEx{
//    (src: _st.InputArray, dst: _st.OutputArray,
//    op : _st.int, kernel: _st.InputArray,
//    anchor?: _types.Point /* = Point(-1,-1)*/, iterations?: _st.int /* = 1*/,
//    borderType?: _st.int /* = BORDER_CONSTANT*/,
//    borderValue?: _types.Scalar /* = morphologyDefaultBorderValue()*/): void;
//}
//
//export var morphologyEx: ImorphologyEx = alvision_module.morphologyEx;

//    CV_EXPORTS_W void morphologyEx(src : _st.InputArray, dst : _st.OutputArray,
//        op : _st.int, kernel : _st.InputArray,
//        anchor : _types.Point /* = Point(-1,-1)*/, iterations : _st.int /* = 1*/,
//        borderType : _st.int /* = BORDER_CONSTANT*/,
//                                borderValue : _types.Scalar /* = morphologyDefaultBorderValue()*/ );

    //! @} imgproc_filter

    //! @addtogroup imgproc_transform
    //! @{

    /** @brief Resizes an image.
    
    The function resize resizes the image src down to or up to the specified size. Note that the
    initial dst type or size are not taken into account. Instead, the size and type are derived from
    the `src`,`dsize`,`fx`, and `fy`. If you want to resize src so that it fits the pre-created dst,
    you may call the function as follows:
    @code
        // explicitly specify dsize=dst.size(); fx and fy will be computed from that.
        resize(src, dst, dst.size(), 0, 0, interpolation);
    @endcode
    If you want to decimate the image by factor of 2 in each direction, you can call the function this
    way:
    @code
        // specify fx and fy and let the function compute the destination image size.
        resize(src, dst, Size(), 0.5, 0.5, interpolation);
    @endcode
    To shrink an image, it will generally look best with cv::INTER_AREA interpolation, whereas to
    enlarge an image, it will generally look best with cv::INTER_CUBIC (slow) or cv::INTER_LINEAR
    (faster but still looks OK).
    
    @param src input image.
    @param dst output image; it has the dsize : _types.Size (when it is non-zero) or the size computed from
    src.size(), fx, and fy; the type of dst is the same as of src.
    @param dsize output image size; if it equals zero, it is computed as:
     \f[\texttt{dsize = Size(round(fx*src.cols), round(fy*src.rows))}\f]
     Either dsize or both fx and fy must be non-zero.
    @param fx scale factor along the horizontal axis; when it equals 0, it is computed as
    \f[\texttt{(double)dsize.width/src.cols}\f]
    @param fy scale factor along the vertical axis; when it equals 0, it is computed as
    \f[\texttt{(double)dsize.height/src.rows}\f]
    @param interpolation interpolation method, see cv::InterpolationFlags
    
    @sa  warpAffine, warpPerspective, remap
     */

overload->addOverload("imgproc", "", "resize", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<Size*>("dsize",Size::name), 
	make_param<double>("fx","double", 0), 
	make_param<double>("fy","double", 0),
	make_param<int>("interpolation","InterpolationFlags",cv:: INTER_LINEAR)
}, resize);
Nan::SetMethod(target, "resize", imgproc_general_callback::callback);


//interface Iresize{
//    (src: _st.InputArray, dst: _st.OutputArray,
//    dsize : _types.Size, fx? : _st.double /* = 0*/, fy? : _st.double /* = 0*/,
//    interpolation?: InterpolationFlags | _st.int /* = INTER_LINEAR*/): void;
//}
//
//export var resize: Iresize = alvision_module.resize;

//    CV_EXPORTS_W void resize(src : _st.InputArray, dst : _st.OutputArray,
//        dsize : _types.Size, fx : _st.double /* = 0*/, fy : _st.double /* = 0*/,
//        interpolation : _st.int /* = INTER_LINEAR*/);

    /** @brief Applies an affine transformation to an image.
    
    The function warpAffine transforms the source image using the specified matrix:
    
    \f[\texttt{dst} (x,y) =  \texttt{src} ( \texttt{M} _{11} x +  \texttt{M} _{12} y +  \texttt{M} _{13}, \texttt{M} _{21} x +  \texttt{M} _{22} y +  \texttt{M} _{23})\f]
    
    when the flag WARP_INVERSE_MAP is set. Otherwise, the transformation is first inverted
    with cv::invertAffineTransform and then put in the formula above instead of M. The function cannot
    operate in-place.
    
    @param src input image.
    @param dst output image that has the dsize : _types.Size and the same type as src .
    @param M \f$2\times 3\f$ transformation matrix.
    @param dsize :_types.Size of the output image.
    @param flags combination of interpolation methods (see cv::InterpolationFlags) and the optional
    flag WARP_INVERSE_MAP that means that M is the inverse transformation (
    \f$\texttt{dst}\rightarrow\texttt{src}\f$ ).
    @param borderMode pixel extrapolation method (see cv::BorderTypes); when
    borderMode=BORDER_TRANSPARENT, it means that the pixels in the destination image corresponding to
    the "outliers" in the source image are not modified by the function.
    @param borderValue value used in case of a constant border; by default, it is 0.
    
    @sa  warpPerspective, resize, remap, getRectSubPix, transform
     */

overload->addOverload("imgproc", "", "warpAffine", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<IOArray*>("M","IOArray"),
		make_param<Size*>("dsize",Size::name),
		make_param<int>("flags","InterpolationFlags",cv:: INTER_LINEAR),
		make_param<int>("borderMode","BorderTypes",cv::BORDER_CONSTANT),
		make_param<Scalar*>("borderValue",Scalar::name, Scalar::create())
}, warpAffine);
Nan::SetMethod(target, "warpAffine", imgproc_general_callback::callback);

//interface IwarpAffine{
//    (src: _st.InputArray, dst: _st.OutputArray,
//    M : _st.InputArray, dsize: _types.Size,
//    flags?: InterpolationFlags | _st.int /* = INTER_LINEAR*/,
//    borderMode?: _base.BorderTypes | _st.int /* = BORDER_CONSTANT*/,
//                              borderValue? : _types.Scalar /* = Scalar()*/): void;
//}
//
//export var warpAffine: IwarpAffine = alvision_module.warpAffine;

//    CV_EXPORTS_W void warpAffine(src : _st.InputArray, dst : _st.OutputArray,
//        M : _st.InputArray, dsize : _types.Size,
//        flags : _st.int /* = INTER_LINEAR*/,
//        borderMode : _st.int /* = BORDER_CONSTANT*/,
//                              borderValue : _types.Scalar /* = Scalar()*/);

    /** @brief Applies a perspective transformation to an image.
    
    The function warpPerspective transforms the source image using the specified matrix:
    
    \f[\texttt{dst} (x,y) =  \texttt{src} \left ( \frac{M_{11} x + M_{12} y + M_{13}}{M_{31} x + M_{32} y + M_{33}} ,
         \frac{M_{21} x + M_{22} y + M_{23}}{M_{31} x + M_{32} y + M_{33}} \right )\f]
    
    when the flag WARP_INVERSE_MAP is set. Otherwise, the transformation is first inverted with invert
    and then put in the formula above instead of M. The function cannot operate in-place.
    
    @param src input image.
    @param dst output image that has the dsize : _types.Size and the same type as src .
    @param M \f$3\times 3\f$ transformation matrix.
    @param dsize :_types.Size of the output image.
    @param flags combination of interpolation methods (INTER_LINEAR or INTER_NEAREST) and the
    optional flag WARP_INVERSE_MAP, that sets M as the inverse transformation (
    \f$\texttt{dst}\rightarrow\texttt{src}\f$ ).
    @param borderMode pixel extrapolation method (BORDER_CONSTANT or BORDER_REPLICATE).
    @param borderValue value used in case of a constant border; by default, it equals 0.
    
    @sa  warpAffine, resize, remap, getRectSubPix, perspectiveTransform
     */

overload->addOverload("imgproc", "", "warpPerspective", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<IOArray*>("M","IOArray"),
		make_param<Size*>("dsize",Size::name),
		make_param<int>("flags","int",cv::INTER_LINEAR),
		make_param<int>("borderMode","int",cv:: BORDER_CONSTANT),
		make_param<Scalar*>("borderValue",Scalar::name, Scalar::create())
}, warpPerspective);
Nan::SetMethod(target, "warpPerspective", imgproc_general_callback::callback);

//interface IwarpPerspective{
//    (src: _st.InputArray, dst: _st.OutputArray,
//        M: _st.InputArray, dsize: _types.Size,
//        flags?: _st.int /* = INTER_LINEAR*/,
//        borderMode?: _st.int /* = BORDER_CONSTANT*/,
//        borderValue?: _types.Scalar /* = Scalar()*/): void;
//}
//
//export var warpPerspective: IwarpPerspective = alvision_module.warpPerspective;

//    CV_EXPORTS_W void warpPerspective(src : _st.InputArray, dst : _st.OutputArray,
//        M : _st.InputArray, dsize : _types.Size,
//        flags : _st.int /* = INTER_LINEAR*/,
//        borderMode : _st.int /* = BORDER_CONSTANT*/,
//                                   borderValue : _types.Scalar /* = Scalar()*/);

    /** @brief Applies a generic geometrical transformation to an image.
    
    The function remap transforms the source image using the specified map:
    
    \f[\texttt{dst} (x,y) =  \texttt{src} (map_x(x,y),map_y(x,y))\f]
    
    where values of pixels with non-integer coordinates are computed using one of available
    interpolation methods. \f$map_x\f$ and \f$map_y\f$ can be encoded as separate floating-point maps
    in \f$map_1\f$ and \f$map_2\f$ respectively, or interleaved floating-point maps of \f$(x,y)\f$ in
    \f$map_1\f$, or fixed-point maps created by using convertMaps. The reason you might want to
    convert from floating to fixed-point representations of a map is that they can yield much faster
    (\~2x) remapping operations. In the converted case, \f$map_1\f$ contains pairs (cvFloor(x),
    cvFloor(y)) and \f$map_2\f$ contains indices in a table of interpolation coefficients.
    
    This function cannot operate in-place.
    
    @param src Source image.
    @param dst Destination image. It has the same size as map1 and the same type as src .
    @param map1 The first map of either (x,y) points or just x values having the type CV_16SC2 ,
    CV_32FC1, or CV_32FC2. See convertMaps for details on converting a floating point
    representation to fixed-point for speed.
    @param map2 The second map of y values having the type CV_16UC1, CV_32FC1, or none (empty map
    if map1 is (x,y) points), respectively.
    @param interpolation Interpolation method (see cv::InterpolationFlags). The method INTER_AREA is
    not supported by this function.
    @param borderMode Pixel extrapolation method (see cv::BorderTypes). When
    borderMode=BORDER_TRANSPARENT, it means that the pixels in the destination image that
    corresponds to the "outliers" in the source image are not modified by the function.
    @param borderValue Value used in case of a constant border. By default, it is 0.
     */

overload->addOverload("imgproc", "", "remap", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<IOArray*>("Map1","IOArray"),
		make_param<IOArray*>("Map2","IOArray"),
		make_param<int>("interpolation","InterpolationFlags"),
		make_param<int>("borderMode","BorderTypes",cv::BORDER_CONSTANT),
		make_param<Scalar*>("borderValue",Scalar::name, Scalar::create())
}, remap);
Nan::SetMethod(target, "remap", imgproc_general_callback::callback);


//interface Iremap{
//    (src: _st.InputArray, dst: _st.OutputArray,
//        Map1: _st.InputArray, Map2: _st.InputArray,
//        interpolation: InterpolationFlags | _st.int, borderMode?: _base.BorderTypes | _st.int /* = BORDER_CONSTANT*/,
//        borderValue?: _types.Scalar /* = Scalar()*/): void;
//}
//
//export var remap: Iremap = alvision_module.remap;

    //CV_EXPORTS_W void remap(src : _st.InputArray, dst : _st.OutputArray,
    //    M : _st.InputArrayap1, M : _st.InputArrayap2,
    //    interpolation : _st.int, borderMode : _st.int /* = BORDER_CONSTANT*/,
    //                     borderValue : _types.Scalar /* = Scalar()*/);

    /** @brief Converts image transformation maps from one representation to another.
    
    The function converts a pair of maps for remap from one representation to another. The following
    options ( (map1.type(), map2.type()) \f$\rightarrow\f$ (dstmap1.type(), dstmap2.type()) ) are
    supported:
    
    - \f$\texttt{(CV\_32FC1, CV\_32FC1)} \rightarrow \texttt{(CV\_16SC2, CV\_16UC1)}\f$. This is the
    most frequently used conversion operation, in which the original floating-point maps (see remap )
    are converted to a more compact and much faster fixed-point representation. The first output array
    contains the rounded coordinates and the second array (created only when nninterpolation=false )
    contains indices in the interpolation tables.
    
    - \f$\texttt{(CV\_32FC2)} \rightarrow \texttt{(CV\_16SC2, CV\_16UC1)}\f$. The same as above but
    the original maps are stored in one 2-channel matrix.
    
    - Reverse conversion. Obviously, the reconstructed floating-point maps will not be exactly the same
    as the originals.
    
    @param map1 The first input map of type CV_16SC2, CV_32FC1, or CV_32FC2 .
    @param map2 The second input map of type CV_16UC1, CV_32FC1, or none (empty matrix),
    respectively.
    @param dstmap1 The first output map that has the type dstmap1type and the same size as src .
    @param dstmap2 The second output map.
    @param dstmap1type Type of the first output map that should be CV_16SC2, CV_32FC1, or
    CV_32FC2 .
    @param nninterpolation Flag indicating whether the fixed-point maps are used for the
    nearest-neighbor or for a more complex interpolation.
    
    @sa  remap, undistort, initUndistortRectifyMap
     */


overload->addOverload("imgproc", "", "convertMaps", {
	make_param<IOArray*>("Map1","IOArray"),
	make_param<IOArray*>("Map2","IOArray"),
	make_param<IOArray*>("dstmap1","IOArray"),
	make_param<IOArray*>("dstmap2","IOArray"),
	make_param<int>("dstmap1type","int"),
	make_param<bool>("nninterpolation","bool", false)
}, convertMaps);
Nan::SetMethod(target, "convertMaps", imgproc_general_callback::callback);

//interface IconvertMaps{
//    (Map1: _st.InputArray, Map2: _st.InputArray,
//        dstmap1: _st.OutputArray, dstmap2: _st.OutputArray,
//        dstmap1type : _st.int, nninterpolation? : boolean /* = false*/): void;
//}
//
//export var convertMaps: IconvertMaps = alvision_module.convertMaps;

//    CV_EXPORTS_W void convertMaps(M : _st.InputArrayap1, M : _st.InputArrayap2,
//        dst : _st.OutputArraymap1, dst : _st.OutputArraymap2,
//        dstmap1type : _st.int, nninterpolation : boolean /* = false*/);

    /** @brief Calculates an affine matrix of 2D rotation.
    
    The function calculates the following matrix:
    
    \f[\begin{bmatrix} \alpha &  \beta & (1- \alpha )  \cdot \texttt{center.x} -  \beta \cdot \texttt{center.y} \\ - \beta &  \alpha &  \beta \cdot \texttt{center.x} + (1- \alpha )  \cdot \texttt{center.y} \end{bmatrix}\f]
    
    where
    
    \f[\begin{array}{l} \alpha =  \texttt{scale} \cdot \cos \texttt{angle} , \\ \beta =  \texttt{scale} \cdot \sin \texttt{angle} \end{array}\f]
    
    The transformation maps the rotation center to itself. If this is not the target, adjust the shift.
    
    @param center Center of the rotation in the source image.
    @param angle Rotation angle in degrees. Positive values mean counter-clockwise rotation (the
    coordinate origin is assumed to be the top-left corner).
    @param scale Isotropic scale factor.
    
    @sa  getAffineTransform, warpAffine, transform
     */

overload->addOverload("imgproc", "", "getRotationMatrix2D", {
		make_param<Point2f*>("center",Point2f::name),
		make_param<double>("angle","double"), 
		make_param<double>("scale","double")
}, getRotationMatrix2D);
Nan::SetMethod(target, "getRotationMatrix2D", imgproc_general_callback::callback);

//interface IgetRotationMatrix2D{
//    (center : _types.Point2f, angle : _st.double, scale : _st.double ): _mat.Mat;
//}
//
//export var getRotationMatrix2D: IgetRotationMatrix2D = alvision_module.getRotationMatrix2D;

//    CV_EXPORTS_W Mat getRotationMatrix2D(center : _types.Point2f, angle : _st.double, scale : _st.double );


//interface IgetPerspectiveTransform{
//    ( src : Array<_types.Point2f>, dst : Array<_types.Point2f>): _mat.Mat;
//}

//export var getPerspectiveTransform: IgetPerspectiveTransform = alvision_module.getPerspectiveTransform;

    //! returns 3x3 perspective transformation for the corresponding 4 point pairs.
//    CV_EXPORTS Mat getPerspectiveTransform( src : Array<_types.Point2f>, dst : Array<_types.Point2f> );

    /** @brief Calculates an affine transform from three pairs of the corresponding points.
    
    The function calculates the \f$2 \times 3\f$ matrix of an affine transform so that:
    
    \f[\begin{bmatrix} x'_i \\ y'_i \end{bmatrix} = \texttt{map\_matrix} \cdot \begin{bmatrix} x_i \\ y_i \\ 1 \end{bmatrix}\f]
    
    where
    
    \f[dst(i)=(x'_i,y'_i), src(i)=(x_i, y_i), i=0,1,2\f]
    
    @param src Coordinates of triangle vertices in the source image.
    @param dst Coordinates of the corresponding triangle vertices in the destination image.
    
    @sa  warpAffine, transform
     */

//interface IgetAffineTransform{
//    (src: Array<_types.Point2f>, dst: Array<_types.Point2f>): _mat.Mat;
//}

//export var getAffineTransform: IgetAffineTransform = alvision_module.getAffineTransform;

    //CV_EXPORTS Mat getAffineTransform( src : Array<_types.Point2f>, dst : Array<_types.Point2f> );

    /** @brief Inverts an affine transformation.
    
    The function computes an inverse affine transformation represented by \f$2 \times 3\f$ matrix M:
    
    \f[\begin{bmatrix} a_{11} & a_{12} & b_1  \\ a_{21} & a_{22} & b_2 \end{bmatrix}\f]
    
    The result is also a \f$2 \times 3\f$ matrix of the same type as M.
    
    @param M Original affine transformation.
    @param iM Output reverse affine transformation.
     */

overload->addOverload("imgproc", "", "invertAffineTransform", {
	make_param<IOArray*>( "M","IOArray"),
	make_param<IOArray*>("iM","IOArray")
}, invertAffineTransform);
Nan::SetMethod(target, "invertAffineTransform", imgproc_general_callback::callback);

//interface IinvertAffineTransform {
//    (M: _st.InputArray, iM : _st.OutputArray ): void;
//}
//
//export var invertAffineTransform: IinvertAffineTransform = alvision_module.invertAffineTransform;

//    CV_EXPORTS_W void invertAffineTransform(M : _st.InputArray, iM : _st.OutputArray );

    /** @brief Calculates a perspective transform from four pairs of the corresponding points.
    
    The function calculates the \f$3 \times 3\f$ matrix of a perspective transform so that:
    
    \f[\begin{bmatrix} t_i x'_i \\ t_i y'_i \\ t_i \end{bmatrix} = \texttt{map\_matrix} \cdot \begin{bmatrix} x_i \\ y_i \\ 1 \end{bmatrix}\f]
    
    where
    
    \f[dst(i)=(x'_i,y'_i), src(i)=(x_i, y_i), i=0,1,2,3\f]
    
    @param src Coordinates of quadrangle vertices in the source image.
    @param dst Coordinates of the corresponding quadrangle vertices in the destination image.
    
    @sa  findHomography, warpPerspective, perspectiveTransform
     */

overload->addOverload("imgproc", "", "getPerspectiveTransform", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray")
}, getPerspectiveTransform_mat);
Nan::SetMethod(target, "getPerspectiveTransform", imgproc_general_callback::callback);

overload->addOverload("imgproc", "", "getPerspectiveTransform", {
	make_param<std::shared_ptr<std::vector<Point2f*>>>("src","Array<Point2f>"), 
	make_param<std::shared_ptr<std::vector<Point2f*>>>("dst","Array<Point2f>")
}, getPerspectiveTransform_point);

//interface IgetPerspectiveTransform{
//    (src: _st.InputArray, dst: _st.InputArray): _mat.Mat;
//
//    (src: Array<_types.Point2f>, dst: Array<_types.Point2f>): _mat.Mat;
//}
//
//export var getPerspectiveTransform: IgetPerspectiveTransform = alvision_module.getPerspectiveTransform;

//    CV_EXPORTS_W Mat getPerspectiveTransform(src : _st.InputArray, dst : _st.InputArray );

overload->addOverload("imgproc", "", "getAffineTransform", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray")
}, getAffineTransform_mat);
Nan::SetMethod(target, "getAffineTransform", imgproc_general_callback::callback);

overload->addOverload("imgproc", "", "getAffineTransform", {
	make_param<std::shared_ptr<std::vector<Point2f*>>>("src","Array<Point2f>"),
	make_param<std::shared_ptr<std::vector<Point2f*>>>("dst","Array<Point2f>")
}, getAffineTransform_point);

//
//interface IgetAffineTransform{
//    (src: _st.InputArray, dst: _st.InputArray): _mat.Mat;
//
//    (src: Array<_types.Point2f>, dst: Array<_types.Point2f>): _mat.Mat;
//}
//
//export var getAffineTransform: IgetAffineTransform = alvision_module.getAffineTransform;

//    CV_EXPORTS_W Mat getAffineTransform(src : _st.InputArray, dst : _st.InputArray );

    /** @brief Retrieves a pixel rectangle from an image with sub-pixel accuracy.
    
    The function getRectSubPix extracts pixels from src:
    
    \f[dst(x, y) = src(x +  \texttt{center.x} - ( \texttt{dst.cols} -1)*0.5, y +  \texttt{center.y} - ( \texttt{dst.rows} -1)*0.5)\f]
    
    where the values of the pixels at non-integer coordinates are retrieved using bilinear
    interpolation. Every channel of multi-channel images is processed independently. While the center of
    the rectangle must be inside the image, parts of the rectangle may be outside. In this case, the
    replication border mode (see cv::BorderTypes) is used to extrapolate the pixel values outside of
    the image.
    
    @param image Source image.
    @param patchsize :_types.Size of the extracted patch.
    @param center Floating point coordinates of the center of the extracted rectangle within the
    source image. The center must be inside the image.
    @param patch Extracted patch that has the patchSize : _types.Size and the same number of channels as src .
    @param patchType Depth of the extracted pixels. By default, they have the same depth as src .
    
    @sa  warpAffine, warpPerspective
     */

overload->addOverload("imgproc", "", "getRectSubPix", {
	make_param<IOArray*>("image","IOArray"),
	make_param<Size*>("patchSize",Size::name),
	make_param<Point2f*>("center",Point2f::name), 
	make_param<IOArray*>("patch","IOArray"),
	make_param<int>("patchType","int", -1)
}, getRectSubPix);
Nan::SetMethod(target, "getRectSubPix", imgproc_general_callback::callback);

//interface IgetRectSubPix{
//    (image: _st.InputArray, patchSize : _types.Size,
//    center: _types.Point2f, patch : _st.OutputArray, patchType : _st.int /* = -1 */): void;
//}
//
//export var getRectSubPix: IgetRectSubPix = alvision_module.getRectSubPix;

//    CV_EXPORTS_W void getRectSubPix(image : _st.InputArray, patchSize : _types.Size,
//        center : _types.Point2f, patch : _st.OutputArray, patchType : _st.int /* = -1 */);

    /** @example polar_transforms.cpp
    An example using the cv::linearPolar and cv::logPolar operations
    */

    /** @brief Remaps an image to log-polar space.
    
    transforms the source image using the following transformation:
    \f[dst( \phi , \rho ) = src(x,y)\f]
    where
    \f[\rho = M  \cdot \log{\sqrt{x^2 + y^2}} , \phi =atan(y/x)\f]
    
    The function emulates the human "foveal" vision and can be used for fast scale and
    rotation-invariant template matching, for object tracking and so forth. The function can not operate
    in-place.
    
    @param src Source image
    @param dst Destination image
    @param center The transformation center; where the output precision is maximal
    @param M Magnitude scale parameter.
    @param flags A combination of interpolation methods, see cv::InterpolationFlags
     */

overload->addOverload("imgproc", "", "logPolar", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<Point2f*>("center",Point2f::name),
		make_param<double>("M","double"),
		make_param<int>("flags","InterpolationFlags")
}, logPolar);
Nan::SetMethod(target, "logPolar", imgproc_general_callback::callback);

//interface IlogPolar{
//    (src: _st.InputArray, dst: _st.OutputArray,
//    center: _types.Point2f, M : _st.double, flags : _st.int ): void;
//}
//
//export var logPolar: IlogPolar = alvision_module.logPolar;

//    CV_EXPORTS_W void logPolar(src : _st.InputArray, dst : _st.OutputArray,
//        center : _types.Point2f, M : _st.double, flags : _st.int );
//
    /** @brief Remaps an image to polar space.
    
    transforms the source image using the following transformation:
    \f[dst( \phi , \rho ) = src(x,y)\f]
    where
    \f[\rho = (src.width/maxRadius)  \cdot \sqrt{x^2 + y^2} , \phi =atan(y/x)\f]
    
    The function can not operate in-place.
    
    @param src Source image
    @param dst Destination image
    @param center The transformation center;
    @param maxRadius Inverse magnitude scale parameter
    @param flags A combination of interpolation methods, see cv::InterpolationFlags
     */

overload->addOverload("imgproc", "", "linearPolar", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<Point2f*>("center",Point2f::name),
	make_param<double>("MaxRadius","double"),
	make_param<int>("flags","int")
}, linearPolar);
Nan::SetMethod(target, "linearPolar", imgproc_general_callback::callback);

//interface IlinearPolar{
//    (src: _st.InputArray, dst: _st.OutputArray,
//        center: _types.Point2f, MaxRadius: _st.double, flags: _st.int): void;
//}
//
//export var linearPolar: IlinearPolar = alvision_module.linearPolar;

//    CV_EXPORTS_W void linearPolar(src : _st.InputArray, dst : _st.OutputArray,
//        center : _types.Point2f, M : _st.doubleaxRadius, flags : _st.int );

    //! @} imgproc_transform

    //! @addtogroup imgproc_misc
    //! @{

    /** @overload */

//interface Iintegral{
//    (src: _st.InputArray, sum : _st.OutputArray, sdepth : _st.int /* = -1*/): void;
//}

//export var integral: Iintegral = alvision_module.integral;

//    CV_EXPORTS_W void integral(src : _st.InputArray, sum : _st.OutputArray, sdepth : _st.int /* = -1*/);

    /** @overload */

//interface Iintegral {
//    (src: _st.InputArray, sum: _st.OutputArray,
//        sqsum: _st.OutputArray, sdepth: _st.int /* = -1*/, sqdepth: _st.int /* = -1*/): void;

//    (src: _st.InputArray, sum: _st.OutputArray, sdepth: _st.int /* = -1*/): void;
//}

//export var integral: Iintegral = alvision_module.integral;

//    CV_EXPORTS_AS(integral2) void integral(src : _st.InputArray, sum : _st.OutputArray,
//        sqsum : _st.OutputArray, sdepth : _st.int /* = -1*/, sqdepth : _st.int /* = -1*/);

    /** @brief Calculates the integral of an image.
    
    The functions calculate one or more integral images for the source image as follows:
    
    \f[\texttt{sum} (X,Y) =  \sum _{x<X,y<Y}  \texttt{image} (x,y)\f]
    
    \f[\texttt{sqsum} (X,Y) =  \sum _{x<X,y<Y}  \texttt{image} (x,y)^2\f]
    
    \f[\texttt{tilted} (X,Y) =  \sum _{y<Y,abs(x-X+1) \leq Y-y-1}  \texttt{image} (x,y)\f]
    
    Using these integral images, you can calculate sum, mean, and standard deviation over a specific
    up-right or rotated rectangular region of the image in a constant time, for example:
    
    \f[\sum _{x_1 \leq x < x_2,  \, y_1  \leq y < y_2}  \texttt{image} (x,y) =  \texttt{sum} (x_2,y_2)- \texttt{sum} (x_1,y_2)- \texttt{sum} (x_2,y_1)+ \texttt{sum} (x_1,y_1)\f]
    
    It makes possible to do a fast blurring or fast block correlation with a variable window size, for
    example. In case of multi-channel images, sums for each channel are accumulated independently.
    
    As a practical example, the next figure shows the calculation of the integral of a straight
    rectangle Rect(3,3,3,2) and of a tilted rectangle Rect(5,1,2,3) . The selected pixels in the
    original image are shown, as well as the relative pixels in the integral images sum and tilted .
    
    ![integral calculation example](pics/integral.png)
    
    @param src input image as \f$W \times H\f$, 8-bit or floating-point (32f or 64f).
    @param sum integral image as \f$(W+1)\times (H+1)\f$ , 32-bit integer or floating-point (32f or 64f).
    @param sqsum integral image for squared pixel values; it is \f$(W+1)\times (H+1)\f$, double-precision
    floating-point (64f) array.
    @param tilted integral for the image rotated by 45 degrees; it is \f$(W+1)\times (H+1)\f$ array with
    the same data type as sum.
    @param sdepth desired depth of the integral and the tilted integral images, CV_32S, CV_32F, or
    CV_64F.
    @param sqdepth desired depth of the integral image of squared pixel values, CV_32F or CV_64F.
     */

overload->addOverload("imgproc", "", "integral", {
	make_param<IOArray*>(   "src","IOArray"),
	make_param<IOArray*>(   "sum","IOArray"),
	make_param<IOArray*>( "sqsum","IOArray"),
	make_param<IOArray*>("tilted","IOArray"),
	make_param<int>( "sdepth","int", -1), 
	make_param<int>("sqdepth","int", -1)
}, integral_tilted);
Nan::SetMethod(target, "integral", imgproc_general_callback::callback);

overload->addOverload("imgproc", "", "integral", {
	make_param<IOArray*>(  "src","IOArray"),
	make_param<IOArray*>(  "sum","IOArray"),
	make_param<IOArray*>("sqsum","IOArray"),
	make_param<int>( "sdepth","int", -1), 
	make_param<int>("sqdepth","int", -1)
}, integral_squared);

overload->addOverload("imgproc", "", "integral", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("sum","IOArray"), 
	make_param<int>("sdepth","int", -1)
}, integral);

//interface Iintegral{
//    (src: _st.InputArray, sum: _st.OutputArray,
//    sqsum: _st.OutputArray, tilted : _st.OutputArray,
//    sdepth: _st.int /* = -1*/, sqdepth: _st.int /* = -1*/);
//
//    (src: _st.InputArray, sum: _st.OutputArray,
//        sqsum: _st.OutputArray, sdepth: _st.int /* = -1*/, sqdepth: _st.int /* = -1*/): void;
//
//
//    (src: _st.InputArray, sum: _st.OutputArray, sdepth: _st.int /* = -1*/): void;
//}
//
//
//export var integral: Iintegral = alvision_module.integral;
//    CV_EXPORTS_AS(integral3) void integral(src : _st.InputArray, sum : _st.OutputArray,
//        sqsum : _st.OutputArray, tilted : _st.OutputArray,
//        sdepth : _st.int /* = -1*/, sqdepth : _st.int /* = -1*/);

    //! @} imgproc_misc

    //! @addtogroup imgproc_motion
    //! @{

    /** @brief Adds an image to the accumulator.
    
    The function adds src or some of its elements to dst :
    
    \f[\texttt{dst} (x,y)  \leftarrow \texttt{dst} (x,y) +  \texttt{src} (x,y)  \quad \text{if} \quad \texttt{mask} (x,y)  \ne 0\f]
    
    The function supports multi-channel images. Each channel is processed independently.
    
    The functions accumulate\* can be used, for example, to collect statistics of a scene background
    viewed by a still camera and for the further foreground-background segmentation.
    
    @param src Input image as 1- or 3-channel, 8-bit or 32-bit floating point.
    @param dst %Accumulator image with the same number of channels as input image, 32-bit or 64-bit
    floating-point.
    @param mask Optional operation mask.
    
    @sa  accumulateSquare, accumulateProduct, accumulateWeighted
     */


overload->addOverload("imgproc", "", "accumulate", {
	make_param<IOArray*>( "src","IOArray"),
	make_param<IOArray*>( "dst","IOArray"),
	make_param<IOArray*>("mask","IOArray",IOArray::noArray())
}, accumulate);
Nan::SetMethod(target, "accumulate", imgproc_general_callback::callback);

//interface Iaccumulate{
//    (src: _st.InputArray, dst: _st.InputOutputArray,
//        mask: _st.InputArray /* = noArray()*/): void;
//}
//
//export var accumulate: Iaccumulate = alvision_module.accumulate;

//    CV_EXPORTS_W void accumulate(src : _st.InputArray, Inputdst : _st.OutputArray,
//        mask : _st.InputArray /* = noArray()*/);

    /** @brief Adds the square of a source image to the accumulator.
    
    The function adds the input image src or its selected region, raised to a power of 2, to the
    accumulator dst :
    
    \f[\texttt{dst} (x,y)  \leftarrow \texttt{dst} (x,y) +  \texttt{src} (x,y)^2  \quad \text{if} \quad \texttt{mask} (x,y)  \ne 0\f]
    
    The function supports multi-channel images. Each channel is processed independently.
    
    @param src Input image as 1- or 3-channel, 8-bit or 32-bit floating point.
    @param dst %Accumulator image with the same number of channels as input image, 32-bit or 64-bit
    floating-point.
    @param mask Optional operation mask.
    
    @sa  accumulateSquare, accumulateProduct, accumulateWeighted
     */

overload->addOverload("imgproc", "", "accumulateSquare", {
	make_param<IOArray*>( "src","IOArray"),
	make_param<IOArray*>( "dst","IOArray"),
	make_param<IOArray*>("mask","IOArray",IOArray::noArray())
}, accumulateSquare);
Nan::SetMethod(target, "accumulateSquare", imgproc_general_callback::callback);


//interface IaccumulateSquare {
//    (src: _st.InputArray, dst: _st.InputOutputArray,
//        mask: _st.InputArray /* = noArray()*/): void;
//}
//
//export var accumulateSquare: IaccumulateSquare = alvision_module.accumulateSquare;

//    CV_EXPORTS_W void accumulateSquare(src : _st.InputArray, Inputdst : _st.OutputArray,
//        mask : _st.InputArray /* = noArray()*/);

    /** @brief Adds the per-element product of two input images to the accumulator.
    
    The function adds the product of two images or their selected regions to the accumulator dst :
    
    \f[\texttt{dst} (x,y)  \leftarrow \texttt{dst} (x,y) +  \texttt{src1} (x,y)  \cdot \texttt{src2} (x,y)  \quad \text{if} \quad \texttt{mask} (x,y)  \ne 0\f]
    
    The function supports multi-channel images. Each channel is processed independently.
    
    @param src1 First input image, 1- or 3-channel, 8-bit or 32-bit floating point.
    @param src2 Second input image of the same type and the same size as src1 .
    @param dst %Accumulator with the same number of channels as input images, 32-bit or 64-bit
    floating-point.
    @param mask Optional operation mask.
    
    @sa  accumulate, accumulateSquare, accumulateWeighted
     */

overload->addOverload("imgproc", "", "accumulateProduct", {
	make_param<IOArray*>("src1","IOArray"),
	make_param<IOArray*>("src2","IOArray"),
	make_param<IOArray*>( "dst","IOArray"),
	make_param<IOArray*>("Mask","IOArray", IOArray::noArray())
}, accumulateProduct);
Nan::SetMethod(target, "accumulateProduct", imgproc_general_callback::callback);

//interface IaccumulateProduct{
//    (src1: _st.InputArray, src2: _st.InputArray,
//        dst: _st.InputOutputArray, Mask: _st.InputArray /* = noArray()*/): void;
//}
//
//export var accumulateProduct: IaccumulateProduct = alvision_module.accumulateProduct;


//    CV_EXPORTS_W void accumulateProduct(src : _st.InputArray1, src : _st.InputArray2,
//        Inputdst : _st.OutputArray, M : _st.InputArrayask= noArray());

    /** @brief Updates a running average.
    
    The function calculates the weighted sum of the input image src and the accumulator dst so that dst
    becomes a running average of a frame sequence:
    
    \f[\texttt{dst} (x,y)  \leftarrow (1- \texttt{alpha} )  \cdot \texttt{dst} (x,y) +  \texttt{alpha} \cdot \texttt{src} (x,y)  \quad \text{if} \quad \texttt{mask} (x,y)  \ne 0\f]
    
    That is, alpha regulates the update speed (how fast the accumulator "forgets" about earlier images).
    The function supports multi-channel images. Each channel is processed independently.
    
    @param src Input image as 1- or 3-channel, 8-bit or 32-bit floating point.
    @param dst %Accumulator image with the same number of channels as input image, 32-bit or 64-bit
    floating-point.
    @param alpha Weight of the input image.
    @param mask Optional operation mask.
    
    @sa  accumulate, accumulateSquare, accumulateProduct
     */


overload->addOverload("imgproc", "", "accumulateWeighted", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<double>("alpha","double"),
	make_param<IOArray*>("mask","IOArray",IOArray::noArray())
}, accumulateWeighted);
Nan::SetMethod(target, "accumulateWeighted", imgproc_general_callback::callback);

//interface IaccumulateWeighted {
//    (src: _st.InputArray, dst: _st.InputOutputArray,
//        alpha : _st.double, mask: _st.InputArray /* = noArray()*/): void;
//}
//
//export var accumulateWeighted: IaccumulateWeighted = alvision_module.accumulateWeighted;

//    CV_EXPORTS_W void accumulateWeighted(src : _st.InputArray, Inputdst : _st.OutputArray,
//        alpha : _st.double, mask : _st.InputArray /* = noArray()*/);

    /** @brief The function is used to detect translational shifts that occur between two images.
    
    The operation takes advantage of the Fourier shift theorem for detecting the translational shift in
    the frequency domain. It can be used for fast image registration as well as motion estimation. For
    more information please see <http://en.wikipedia.org/wiki/Phase_correlation>
    
    Calculates the cross-power spectrum of two supplied source arrays. The arrays are padded if needed
    with getOptimalDFTSize.
    
    The function performs the following equations:
    - First it applies a Hanning window (see <http://en.wikipedia.org/wiki/Hann_function>) to each
    image to remove possible edge effects. This window is cached until the array size changes to speed
    up processing time.
    - Next it computes the forward DFTs of each source array:
    \f[\mathbf{G}_a = \mathcal{F}\{src_1\}, \; \mathbf{G}_b = \mathcal{F}\{src_2\}\f]
    where \f$\mathcal{F}\f$ is the forward DFT.
    - It then computes the cross-power spectrum of each frequency domain array:
    \f[R = \frac{ \mathbf{G}_a \mathbf{G}_b^*}{|\mathbf{G}_a \mathbf{G}_b^*|}\f]
    - Next the cross-correlation is converted back into the time domain via the inverse DFT:
    \f[r = \mathcal{F}^{-1}\{R\}\f]
    - Finally, it computes the peak location and computes a 5x5 weighted centroid around the peak to
    achieve sub-pixel accuracy.
    \f[(\Delta x, \Delta y) = \texttt{weightedCentroid} \{\arg \max_{(x, y)}\{r\}\}\f]
    - If non-zero, the response parameter is computed as the sum of the elements of r within the 5x5
    centroid around the peak location. It is normalized to a maximum of 1 (meaning there is a single
    peak) and will be smaller when there are multiple peaks.
    
    @param src1 Source floating point array (CV_32FC1 or CV_64FC1)
    @param src2 Source floating point array (CV_32FC1 or CV_64FC1)
    @param window Floating point array with windowing coefficients to reduce edge effects (optional).
    @param response Signal power within the 5x5 centroid around the peak, between 0 and 1 (optional).
    @returns detected phase shift (sub-pixel) between the two arrays.
    
    @sa dft, getOptimalDFTSize, idft, mulSpectrums createHanningWindow
     */

overload->addOverload("imgproc", "", "phaseCorrelate", {
	make_param<IOArray*>("src1","IOArray"),
	make_param<IOArray*>("src2","IOArray"),
	make_param<IOArray*>("window","IOArray", IOArray::noArray()),
	make_param<std::shared_ptr<or::Callback>>("cb","Function")// ? : (response : _st.double) = > void
}, phaseCorrelate);
Nan::SetMethod(target, "phaseCorrelate", imgproc_general_callback::callback);

//interface IphaseCorrelate{
//    (src1: _st.InputArray, src2: _st.InputArray,
//        window?: _st.InputArray /* = noArray()*/, cb?: (response: _st.double) => void) : _types.Point2d
//}
//
//export var phaseCorrelate: IphaseCorrelate = alvision_module.phaseCorrelate;


//    CV_EXPORTS_W Point2d phaseCorrelate(src : _st.InputArray1, src : _st.InputArray2,
//        window : _st.InputArray /* = noArray()*/, CV_OUT double* response = 0);

    /** @brief This function computes a Hanning window coefficients in two dimensions.
    
    See (http://en.wikipedia.org/wiki/Hann_function) and (http://en.wikipedia.org/wiki/Window_function)
    for more information.
    
    An example is shown below:
    @code
        // create hanning window of size 100x100 and type CV_32F
        Mat hann;
        createHanningWindow(hann, Size(100, 100), CV_32F);
    @endcode
    @param dst Destination array to place Hann coefficients in
    @param winSize The window size specifications
    @param type Created array type
     */

overload->addOverload("imgproc", "", "createHanningWindow", {
	make_param<IOArray*>("dst","IOArray"),
	make_param<Size*>("winSize",Size::name),
	make_param<int>("type","MatrixType")
}, createHanningWindow);
Nan::SetMethod(target, "createHanningWindow", imgproc_general_callback::callback);

//interface IcreateHanningWindow{
//    (dst: _st.OutputArray, winSize: _types.Size, type : _cvdef.MatrixType): void;
//}
//
//export var createHanningWindow: IcreateHanningWindow = alvision_module.createHanningWindow;

    //CV_EXPORTS_W void createHanningWindow(dst : _st.OutputArray, winSize : _types.Size, int type);

    //! @} imgproc_motion

    //! @addtogroup imgproc_misc
    //! @{

    /** @brief Applies a fixed-level threshold to each array element.
    
    The function applies fixed-level thresholding to a single-channel array. The function is typically
    used to get a bi-level (binary) image out of a grayscale image ( cv::compare could be also used for
    this purpose) or for removing a noise, that is, filtering out pixels with too small or too large
    values. There are several types of thresholding supported by the function. They are determined by
    type parameter.
    
    Also, the special values cv::THRESH_OTSU or cv::THRESH_TRIANGLE may be combined with one of the
    above values. In these cases, the function determines the optimal threshold value using the Otsu's
    or Triangle algorithm and uses it instead of the specified thresh . The function returns the
    computed threshold value. Currently, the Otsu's and Triangle methods are implemented only for 8-bit
    images.
    
    @param src input array (single-channel, 8-bit or 32-bit floating point).
    @param dst output array of the same size and type as src.
    @param thresh threshold value.
    @param maxval maximum value to use with the THRESH_BINARY and THRESH_BINARY_INV thresholding
    types.
    @param type thresholding type (see the cv::ThresholdTypes).
    
    @sa  adaptiveThreshold, findContours, compare, min, max
     */

overload->addOverload("imgproc", "", "threshold", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<double>("thresh","double"),
	make_param<double>("Maxval","double"),
	make_param<int>("type","ThresholdTypes")
}, threshold);
Nan::SetMethod(target, "threshold", imgproc_general_callback::callback);

//interface Ithreshold {
//    (src: _st.InputArray, dst: _st.OutputArray,
//        thresh: _st.double, Maxval: _st.double, type: ThresholdTypes| _st.int ): _st.double;
//}
//
//export var threshold: Ithreshold = alvision_module.threshold;

//    CV_EXPORTS_W thresh : _st.doubleold(src : _st.InputArray, dst : _st.OutputArray,
//        thresh : _st.double, M : _st.doubleaxval, int type );


    /** @brief Applies an adaptive threshold to an array.
    
    The function transforms a grayscale image to a binary image according to the formulae:
    -   **THRESH_BINARY**
        \f[dst(x,y) =  \fork{\texttt{maxValue}}{if \(src(x,y) > T(x,y)\)}{0}{otherwise}\f]
    -   **THRESH_BINARY_INV**
        \f[dst(x,y) =  \fork{0}{if \(src(x,y) > T(x,y)\)}{\texttt{maxValue}}{otherwise}\f]
    where \f$T(x,y)\f$ is a threshold calculated individually for each pixel (see adaptiveMethod parameter).
    
    The function can process the image in-place.
    
    @param src Source 8-bit single-channel image.
    @param dst Destination image of the same size and the same type as src.
    @param maxValue Non-zero value assigned to the pixels for which the condition is satisfied
    @param adaptiveMethod Adaptive thresholding algorithm to use, see cv::AdaptiveThresholdTypes
    @param thresholdType Thresholding type that must be either THRESH_BINARY or THRESH_BINARY_INV,
    see cv::ThresholdTypes.
    @param blocksize :_types.Size of a pixel neighborhood that is used to calculate a threshold value for the
    pixel: 3, 5, 7, and so on.
    @param C Constant subtracted from the mean or weighted mean (see the details below). Normally, it
    is positive but may be zero or negative as well.
    
    @sa  threshold, blur, GaussianBlur
     */


overload->addOverload("imgproc", "", "adaptiveThreshold", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<double>("MaxValue","double"),
	make_param<int>("adaptiveMethod","int"),
	make_param<int>("thresholdType","int"),
	make_param<int>("blockSize","int"),
	make_param<double>("C","double")
}, adaptiveThreshold);
Nan::SetMethod(target, "adaptiveThreshold", imgproc_general_callback::callback);

//interface IadaptiveThreshold{
//    (src: _st.InputArray, dst: _st.OutputArray,
//        MaxValue: _st.double, adaptiveMethod: _st.int,
//        thresholdType: _st.int, blockSize: _st.int, C: _st.double): void;
//}
//
//export var adaptiveThreshold: IadaptiveThreshold = alvision_module.adaptiveThreshold;


//    CV_EXPORTS_W void adaptiveThreshold(src : _st.InputArray, dst : _st.OutputArray,
//        M : _st.doubleaxValue, int adaptiveMethod,
//        threshold : _st.intType, blockSize : _st.int, double C );

    //! @} imgproc_misc

    //! @addtogroup imgproc_filter
    //! @{

    /** @brief Blurs an image and downsamples it.
    
    By default, size of the output image is computed as `Size((src.cols+1)/2, (src.rows+1)/2)`, but in
    any case, the following conditions should be satisfied:
    
    \f[\begin{array}{l} | \texttt{dstsize.width} *2-src.cols| \leq 2 \\ | \texttt{dstsize.height} *2-src.rows| \leq 2 \end{array}\f]
    
    The function performs the downsampling step of the Gaussian pyramid construction. First, it
    convolves the source image with the kernel:
    
    \f[\frac{1}{256} \begin{bmatrix} 1 & 4 & 6 & 4 & 1  \\ 4 & 16 & 24 & 16 & 4  \\ 6 & 24 & 36 & 24 & 6  \\ 4 & 16 & 24 & 16 & 4  \\ 1 & 4 & 6 & 4 & 1 \end{bmatrix}\f]
    
    Then, it downsamples the image by rejecting even rows and columns.
    
    @param src input image.
    @param dst output image; it has the specified size and the same type as src.
    @param dstsize :_types.Size of the output image.
    @param borderType Pixel extrapolation method, see cv::BorderTypes (BORDER_CONSTANT isn't supported)
     */

overload->addOverload("imgproc", "", "pyrDown", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<Size*>("dstsize",Size::name , Size::create()),
	make_param<int>("borderType","BorderTypes",cv::BORDER_DEFAULT)
}, pyrDown);
Nan::SetMethod(target, "pyrDown", imgproc_general_callback::callback);


//interface IpyrDown{
//        (src: _st.InputArray, dst: _st.OutputArray,
//            dstsize? : _types.Size /* = Size()*/, borderType?: _base.BorderTypes | _st.int /* = BORDER_DEFAULT*/);
//}
//
//export var pyrDown: IpyrDown = alvision_module.pyrDown;

//    CV_EXPORTS_W void pyrDown(src : _st.InputArray, dst : _st.OutputArray,
//                           const Size& dstsize = Size(), borderType : _st.int /* = BORDER_DEFAULT*/ );

    /** @brief Upsamples an image and then blurs it.
    
    By default, size of the output image is computed as `Size(src.cols\*2, (src.rows\*2)`, but in any
    case, the following conditions should be satisfied:
    
    \f[\begin{array}{l} | \texttt{dstsize.width} -src.cols*2| \leq  ( \texttt{dstsize.width}   \mod  2)  \\ | \texttt{dstsize.height} -src.rows*2| \leq  ( \texttt{dstsize.height}   \mod  2) \end{array}\f]
    
    The function performs the upsampling step of the Gaussian pyramid construction, though it can
    actually be used to construct the Laplacian pyramid. First, it upsamples the source image by
    injecting even zero rows and columns and then convolves the result with the same kernel as in
    pyrDown multiplied by 4.
    
    @param src input image.
    @param dst output image. It has the specified size and the same type as src .
    @param dstsize :_types.Size of the output image.
    @param borderType Pixel extrapolation method, see cv::BorderTypes (only BORDER_DEFAULT is supported)
     */

overload->addOverload("imgproc", "", "pyrUp", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<Size*>("dstsize",Size::name, Size::create()),
	make_param<int>("borderType","int",cv::BORDER_DEFAULT)
}, pyrUp);
Nan::SetMethod(target, "pyrUp", imgproc_general_callback::callback);


//interface IpyrUp{
//    (src: _st.InputArray, dst: _st.OutputArray,
//        dstsize?: _types.Size /*= Size()*/, borderType?: _st.int /* = BORDER_DEFAULT*/): void;
//}
//
//export var pyrUp: IpyrUp = alvision_module.pyrUp;

//    CV_EXPORTS_W void pyrUp(src : _st.InputArray, dst : _st.OutputArray,
//                         const Size& dstsize = Size(), borderType : _st.int /* = BORDER_DEFAULT*/ );

    /** @brief Constructs the Gaussian pyramid for an image.
    
    The function constructs a vector of images and builds the Gaussian pyramid by recursively applying
    pyrDown to the previously built pyramid layers, starting from `dst[0]==src`.
    
    @param src Source image. Check pyrDown for the list of supported types.
    @param dst Destination vector of maxlevel+1 images of the same type as src. dst[0] will be the
    same as src. dst[1] is the next pyramid layer, a smoothed and down-sized src, and so on.
    @param maxlevel 0-based index of the last (the smallest) pyramid layer. It must be non-negative.
    @param borderType Pixel extrapolation method, see cv::BorderTypes (BORDER_CONSTANT isn't supported)
     */

overload->addOverload("imgproc", "", "buildPyramid", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<int>("maxlevel","int"),
	make_param<int>("borderType","int",cv:: BORDER_DEFAULT)
}, buildPyramid);
Nan::SetMethod(target, "buildPyramid", imgproc_general_callback::callback);

//interface IbuildPyramid{
//    (src: _st.InputArray, dst : _st.OutputArrayOfArrays ,
//    maxlevel : _st.int, borderType: _st.int /* = BORDER_DEFAULT*/): void;
//}
//
//export var buildPyramid: IbuildPyramid = alvision_module.buildPyramid;

//    CV_EXPORTS void buildPyramid(src : _st.InputArray, OutputArrayOfArrays dst,
//        int maxlevel, borderType : _st.int /* = BORDER_DEFAULT*/);

    //! @} imgproc_filter

    //! @addtogroup imgproc_transform
    //! @{

    /** @brief Transforms an image to compensate for lens distortion.
    
    The function transforms an image to compensate radial and tangential lens distortion.
    
    The function is simply a combination of cv::initUndistortRectifyMap (with unity R ) and cv::remap
    (with bilinear interpolation). See the former function for details of the transformation being
    performed.
    
    Those pixels in the destination image, for which there is no correspondent pixels in the source
    image, are filled with zeros (black color).
    
    A particular subset of the source image that will be visible in the corrected image can be regulated
    by newCameraMatrix. You can use cv::getOptimalNewCameraMatrix to compute the appropriate
    newCameraMatrix depending on your requirements.
    
    The camera matrix and the distortion parameters can be determined using cv::calibrateCamera. If
    the resolution of images is different from the resolution used at the calibration stage, \f$f_x,
    f_y, c_x\f$ and \f$c_y\f$ need to be scaled accordingly, while the distortion coefficients remain
    the same.
    
    @param src Input (distorted) image.
    @param dst Output (corrected) image that has the same size and type as src .
    @param cameraMatrix Input camera matrix \f$A = \vecthreethree{f_x}{0}{c_x}{0}{f_y}{c_y}{0}{0}{1}\f$ .
    @param distCoeffs Input vector of distortion coefficients
    \f$(k_1, k_2, p_1, p_2[, k_3[, k_4, k_5, k_6[, s_1, s_2, s_3, s_4[, \tau_x, \tau_y]]]])\f$
    of 4, 5, 8, 12 or 14 elements. If the vector is NULL/empty, the zero distortion coefficients are assumed.
    @param newCameraMatrix Camera matrix of the distorted image. By default, it is the same as
    cameraMatrix but you may additionally scale and shift the result by using a different matrix.
     */


overload->addOverload("imgproc", "", "undistort", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<IOArray*>("cameraMatrix","IOArray"),
		make_param<IOArray*>("distCoeffs","IOArray"),
		make_param<IOArray*>("newCameraMatrix","IOArray", IOArray::noArray())
}, undistort);
Nan::SetMethod(target, "undistort", imgproc_general_callback::callback);

//interface Iundistort{
//    (src: _st.InputArray, dst: _st.OutputArray,
//        cameraMatrix: _st.InputArray,
//        distCoeffs: _st.InputArray,
//        newCameraMatrix: _st.InputArray /* = noArray()*/): void;
//}
//
//export var undistort: Iundistort = alvision_module.undistort;

//    CV_EXPORTS_W void undistort(src : _st.InputArray, dst : _st.OutputArray,
//        cameraMatrix : _st.InputArray,
//        distCoeffs : _st.InputArray,
//        newCameraMatrix : _st.InputArray /* = noArray()*/);

    /** @brief Computes the undistortion and rectification transformation map.
    
    The function computes the joint undistortion and rectification transformation and represents the
    result in the form of maps for remap. The undistorted image looks like original, as if it is
    captured with a camera using the camera matrix =newCameraMatrix and zero distortion. In case of a
    monocular camera, newCameraMatrix is usually equal to cameraMatrix, or it can be computed by
    cv::getOptimalNewCameraMatrix for a better control over scaling. In case of a stereo camera,
    newCameraMatrix is normally set to P1 or P2 computed by cv::stereoRectify .
    
    Also, this new camera is oriented differently in the coordinate space, according to R. That, for
    example, helps to align two heads of a stereo camera so that the epipolar lines on both images
    become horizontal and have the same y- coordinate (in case of a horizontally aligned stereo camera).
    
    The function actually builds the maps for the inverse mapping algorithm that is used by remap. That
    is, for each pixel \f$(u, v)\f$ in the destination (corrected and rectified) image, the function
    computes the corresponding coordinates in the source image (that is, in the original image from
    camera). The following process is applied:
    \f[
    \begin{array}{l}
    x  \leftarrow (u - {c'}_x)/{f'}_x  \\
    y  \leftarrow (v - {c'}_y)/{f'}_y  \\
    {[X\,Y\,W]} ^T  \leftarrow R^{-1}*[x \, y \, 1]^T  \\
    x'  \leftarrow X/W  \\
    y'  \leftarrow Y/W  \\
    r^2  \leftarrow x'^2 + y'^2 \\
    x''  \leftarrow x' \frac{1 + k_1 r^2 + k_2 r^4 + k_3 r^6}{1 + k_4 r^2 + k_5 r^4 + k_6 r^6}
    + 2p_1 x' y' + p_2(r^2 + 2 x'^2)  + s_1 r^2 + s_2 r^4\\
    y''  \leftarrow y' \frac{1 + k_1 r^2 + k_2 r^4 + k_3 r^6}{1 + k_4 r^2 + k_5 r^4 + k_6 r^6}
    + p_1 (r^2 + 2 y'^2) + 2 p_2 x' y' + s_3 r^2 + s_4 r^4 \\
    s\vecthree{x'''}{y'''}{1} =
    \vecthreethree{R_{33}(\tau_x, \tau_y)}{0}{-R_{13}((\tau_x, \tau_y)}
    {0}{R_{33}(\tau_x, \tau_y)}{-R_{23}(\tau_x, \tau_y)}
    {0}{0}{1} R(\tau_x, \tau_y) \vecthree{x''}{y''}{1}\\
    map_x(u,v)  \leftarrow x''' f_x + c_x  \\
    map_y(u,v)  \leftarrow y''' f_y + c_y
    \end{array}
    \f]
    where \f$(k_1, k_2, p_1, p_2[, k_3[, k_4, k_5, k_6[, s_1, s_2, s_3, s_4[, \tau_x, \tau_y]]]])\f$
    are the distortion coefficients.
    
    In case of a stereo camera, this function is called twice: once for each camera head, after
    stereoRectify, which in its turn is called after cv::stereoCalibrate. But if the stereo camera
    was not calibrated, it is still possible to compute the rectification transformations directly from
    the fundamental matrix using cv::stereoRectifyUncalibrated. For each camera, the function computes
    homography H as the rectification transformation in a pixel domain, not a rotation matrix R in 3D
    space. R can be computed from H as
    \f[\texttt{R} = \texttt{cameraMatrix} ^{-1} \cdot \texttt{H} \cdot \texttt{cameraMatrix}\f]
    where cameraMatrix can be chosen arbitrarily.
    
    @param cameraMatrix Input camera matrix \f$A=\vecthreethree{f_x}{0}{c_x}{0}{f_y}{c_y}{0}{0}{1}\f$ .
    @param distCoeffs Input vector of distortion coefficients
    \f$(k_1, k_2, p_1, p_2[, k_3[, k_4, k_5, k_6[, s_1, s_2, s_3, s_4[, \tau_x, \tau_y]]]])\f$
    of 4, 5, 8, 12 or 14 elements. If the vector is NULL/empty, the zero distortion coefficients are assumed.
    @param R Optional rectification transformation in the object space (3x3 matrix). R1 or R2 ,
    computed by stereoRectify can be passed here. If the matrix is empty, the identity transformation
    is assumed. In cvInitUndistortMap R assumed to be an identity matrix.
    @param newCameraMatrix New camera matrix \f$A'=\vecthreethree{f_x'}{0}{c_x'}{0}{f_y'}{c_y'}{0}{0}{1}\f$.
    @param size Undistorted image size.
    @param m1type Type of the first output map that can be CV_32FC1 or CV_16SC2, see cv::convertMaps
    @param map1 The first output map.
    @param map2 The second output map.
     */

overload->addOverload("imgproc", "", "initUndistortRectifyMap", {
	make_param<IOArray*>("cameraMatrix","IOArray"),
	make_param<IOArray*>("distCoeffs","IOArray"),
	make_param<IOArray*>("R","IOArray"),
	make_param<IOArray*>("newCameraMatrix","IOArray"),
	make_param<Size*>("size",Size::name),
	make_param<int>("m1type","int"),
	make_param<IOArray*>("map1","IOArray"),
	make_param<IOArray*>("map2","IOArray")
}, initUndistortRectifyMap);
Nan::SetMethod(target, "initUndistortRectifyMap", imgproc_general_callback::callback);
//
//interface IinitUndistortRectifyMap {
//    (cameraMatrix: _st.InputArray, distCoeffs: _st.InputArray,
//        R : _st.InputArray, newCameraMatrix : _st.InputArray,
//        size :_types.Size, m1type : _st.int, map1 : _st.OutputArray, map2 : _st.OutputArray ): void;
//}
//
//export var initUndistortRectifyMap: IinitUndistortRectifyMap = alvision_module.initUndistortRectifyMap;




//    CV_EXPORTS_W void initUndistortRectifyMap(cameraMatrix : _st.InputArray, distCoeffs : _st.InputArray,
//        R : _st.InputArray, newCameraMatrix : _st.InputArray,
//        size :_types.Size, m1type : _st.int, map1 : _st.OutputArray, map2 : _st.OutputArray );

    //! initializes maps for cv::remap() for wide-angle

overload->addOverload("imgproc", "", "initWideAngleProjMap", {
	make_param<IOArray*>("cameraMatrix","IOArray"),
	make_param<IOArray*>("distCoeffs","IOArray"),
	make_param<Size*>("imageSize",Size::name),
	make_param<int>("destImageWidth","int"),
	make_param<int>("m1type","int"),
	make_param<IOArray*>("map1","IOArray"),
	make_param<IOArray*>("map2","IOArray"),
	make_param<int>("projType","int",cv ::PROJ_SPHERICAL_EQRECT),
	make_param<double>("alpha","double", 0)
}, initWideAngleProjMap);
Nan::SetMethod(target, "initWideAngleProjMap", imgproc_general_callback::callback);

//interface IinitWideAngleProjMap{
//    (cameraMatrix: _st.InputArray, distCoeffs: _st.InputArray,
//    imageSize : _types.Size, destImageWidth : _st.int,
//    m1type: _st.int, map1: _st.OutputArray, map2: _st.OutputArray,
//    projType: _st.int /* = PROJ_SPHERICAL_EQRECT*/, alpha: _st.double /*= 0*/): _st.float;
//}
//
//export var initWideAngleProjMap: IinitWideAngleProjMap = alvision_module.initWideAngleProjMap;

//    CV_EXPORTS_W float initWideAngleProjMap(cameraMatrix : _st.InputArray, distCoeffs : _st.InputArray,
//        imageSize : _types.Size, destImageWidth : _st.int,
//        m1type : _st.int, map1 : _st.OutputArray, map2 : _st.OutputArray,
//        int projType = PROJ_SPHERICAL_EQRECT, alpha : _st.double = 0);

    /** @brief Returns the default new camera matrix.
    
    The function returns the camera matrix that is either an exact copy of the input cameraMatrix (when
    centerPrinicipalPoint=false ), or the modified one (when centerPrincipalPoint=true).
    
    In the latter case, the new camera matrix will be:
    
    \f[\begin{bmatrix} f_x && 0 && ( \texttt{imgSize.width} -1)*0.5  \\ 0 && f_y && ( \texttt{imgSize.height} -1)*0.5  \\ 0 && 0 && 1 \end{bmatrix} ,\f]
    
    where \f$f_x\f$ and \f$f_y\f$ are \f$(0,0)\f$ and \f$(1,1)\f$ elements of cameraMatrix, respectively.
    
    By default, the undistortion functions in OpenCV (see initUndistortRectifyMap, undistort) do not
    move the principal point. However, when you work with stereo, it is important to move the principal
    points in both views to the same y-coordinate (which is required by most of stereo correspondence
    algorithms), and may be to the same x-coordinate too. So, you can form the new camera matrix for
    each view where the principal points are located at the center.
    
    @param cameraMatrix Input camera matrix.
    @param imgsize Camera view image size in pixels.
    @param centerPrincipalPoint Location of the principal point in the new camera matrix. The
    parameter indicates whether this location should be at the image center or not.
     */

overload->addOverload("imgproc", "", "getDefaultNewCameraMatrix", {
	make_param<IOArray*>("cameraMatrix","IOArray"),
	make_param<Size*>("imgSize",Size::name, Size::create()),
	make_param<bool>("centerPrincipalPoint","bool",false)
}, getDefaultNewCameraMatrix);
Nan::SetMethod(target, "getDefaultNewCameraMatrix", imgproc_general_callback::callback);


//interface IgetDefaultNewCameraMatrix{
//    (cameraMatrix: _st.InputArray, imgSize: _types.Size /*= Size()*/,
//        centerPrincipalPoint: boolean /*= false*/): _mat.Mat;
//}
//
//export var getDefaultNewCameraMatrix: IgetDefaultNewCameraMatrix = alvision_module.getDefaultNewCameraMatrix;

//    CV_EXPORTS_W Mat getDefaultNewCameraMatrix(cameraMatrix : _st.InputArray, imgSize : _types.Size = Size(),
//        bool centerPrincipalPoint = false);

    /** @brief Computes the ideal point coordinates from the observed point coordinates.
    
    The function is similar to cv::undistort and cv::initUndistortRectifyMap but it operates on a
    sparse set of points instead of a raster image. Also the function performs a reverse transformation
    to projectPoints. In case of a 3D object, it does not reconstruct its 3D coordinates, but for a
    planar object, it does, up to a translation vector, if the proper R is specified.
    @code
        // (u,v) is the input point, (u', v') is the output point
        // camera_matrix=[fx 0 cx; 0 fy cy; 0 0 1]
        // P=[fx' 0 cx' tx; 0 fy' cy' ty; 0 0 1 tz]
        x" = (u - cx)/fx
        y" = (v - cy)/fy
        (x',y') = undistort(x",y",dist_coeffs)
        [X,Y,W]T = R*[x' y' 1]T
        x = X/W, y = Y/W
        // only performed if P=[fx' 0 cx' [tx]; 0 fy' cy' [ty]; 0 0 1 [tz]] is specified
        u' = x*fx' + cx'
        v' = y*fy' + cy',
    @endcode
    where cv::undistort is an approximate iterative algorithm that estimates the normalized original
    point coordinates out of the normalized distorted point coordinates ("normalized" means that the
    coordinates do not depend on the camera matrix).
    
    The function can be used for both a stereo camera head or a monocular camera (when R is empty).
    
    @param src Observed point coordinates, 1xN or Nx1 2-channel (CV_32FC2 or CV_64FC2).
    @param dst Output ideal point coordinates after undistortion and reverse perspective
    transformation. If matrix P is identity or omitted, dst will contain normalized point coordinates.
    @param cameraMatrix Camera matrix \f$\vecthreethree{f_x}{0}{c_x}{0}{f_y}{c_y}{0}{0}{1}\f$ .
    @param distCoeffs Input vector of distortion coefficients
    \f$(k_1, k_2, p_1, p_2[, k_3[, k_4, k_5, k_6[, s_1, s_2, s_3, s_4[, \tau_x, \tau_y]]]])\f$
    of 4, 5, 8, 12 or 14 elements. If the vector is NULL/empty, the zero distortion coefficients are assumed.
    @param R Rectification transformation in the object space (3x3 matrix). R1 or R2 computed by
    cv::stereoRectify can be passed here. If the matrix is empty, the identity transformation is used.
    @param P New camera matrix (3x3) or new projection matrix (3x4). P1 or P2 computed by
    cv::stereoRectify can be passed here. If the matrix is empty, the identity new camera matrix is used.
     */

overload->addOverload("imgproc", "", "undistortPoints", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<IOArray*>("cameraMatrix","IOArray"),
	make_param<IOArray*>("distCoeffs","IOArray"),
	make_param<IOArray*>("R","IOArray", IOArray::noArray() ),
	make_param<IOArray*>("P","IOArray", IOArray::noArray())
}, undistortPoints);
Nan::SetMethod(target, "undistortPoints", imgproc_general_callback::callback);


//interface IundistortPoints{
//    (src: _st.InputArray, dst: _st.OutputArray,
//    cameraMatrix: _st.InputArray, distCoeffs: _st.InputArray,
//    R?: _st.InputArray /*= noArray()*/, P?: _st.InputArray  /*= noArray()*/): void;
//}
//
//export var undistortPoints: IundistortPoints = alvision_module.undistortPoints;

//    CV_EXPORTS_W void undistortPoints(src : _st.InputArray, dst : _st.OutputArray,
//        cameraMatrix : _st.InputArray, distCoeffs : _st.InputArray,
//        R : _st.InputArray = noArray(), InputArray P = noArray());

    //! @} imgproc_transform

    //! @addtogroup imgproc_hist
    //! @{

    /** @example demhist.cpp
    An example for creating histograms of an image
    */

    /** @brief Calculates a histogram of a set of arrays.
    
    The functions calcHist calculate the histogram of one or more arrays. The elements of a tuple used
    to increment a histogram bin are taken from the corresponding input arrays at the same location. The
    sample below shows how to compute a 2D Hue-Saturation histogram for a color image. :
    @code
        #include <opencv2/imgproc.hpp>
        #include <opencv2/highgui.hpp>
    
        using namespace cv;
    
        int main( int argc, char** argv )
        {
            Mat src, hsv;
            if( argc != 2 || !(src=imread(argv[1], 1)).data )
                return -1;
    
            cvtColor(src, hsv, COLOR_BGR2HSV);
    
            // Quantize the hue to 30 levels
            // and the saturation to 32 levels
            int hbins = 30, sbins = 32;
            int histSize[] = {hbins, sbins};
            // hue varies from 0 to 179, see cvtColor
            float hranges[] = { 0, 180 };
            // saturation varies from 0 (black-gray-white) to
            // 255 (pure spectrum color)
            float sranges[] = { 0, 256 };
            const float* ranges[] = { hranges, sranges };
            MatND hist;
            // we compute the histogram from the 0-th and 1-st channels
            int channels[] = {0, 1};
    
            calcHist( &hsv, 1, channels, Mat(), // do not use mask
                     hist, 2, histSize, ranges,
                     true, // the histogram is uniform
                     false );
            M : _st.doubleaxVal=0;
            minMaxLoc(hist, 0, &maxVal, 0, 0);
    
            int scale = 10;
            Mat histImg = Mat::zeros(sbins*scale, hbins*10, CV_8UC3);
    
            for( int h = 0; h < hbins; h++ )
                for( int s = 0; s < sbins; s++ )
                {
                    float binVal = hist.at<float>(h, s);
                    int intensity = cvRound(binVal*255/maxVal);
                    rectangle( histImg, Point(h*scale, s*scale),
                                Point( (h+1)*scale - 1, (s+1)*scale - 1),
                                Scalar::all(intensity),
                                CV_FILLED );
                }
    
            namedWindow( "Source", 1 );
            imshow( "Source", src );
    
            namedWindow( "H-S Histogram", 1 );
            imshow( "H-S Histogram", histImg );
            waitKey();
        }
    @endcode
    
    @param images Source arrays. They all should have the same depth, CV_8U or CV_32F , and the same
    size. Each of them can have an arbitrary number of channels.
    @param nimages Number of source images.
    @param channels List of the dims channels used to compute the histogram. The first array channels
    are numerated from 0 to images[0].channels()-1 , the second array channels are counted from
    images[0].channels() to images[0].channels() + images[1].channels()-1, and so on.
    @param mask Optional mask. If the matrix is not empty, it must be an 8-bit array of the same size
    as images[i] . The non-zero mask elements mark the array elements counted in the histogram.
    @param hist Output histogram, which is a dense or sparse dims -dimensional array.
    @param dims Histogram dimensionality that must be positive and not greater than CV_MAX_DIMS
    (equal to 32 in the current OpenCV version).
    @param histSize Array of histogram sizes in each dimension.
    @param ranges Array of the dims arrays of the histogram bin boundaries in each dimension. When the
    histogram is uniform ( uniform =true), then for each dimension i it is enough to specify the lower
    (inclusive) boundary \f$L_0\f$ of the 0-th histogram bin and the upper (exclusive) boundary
    \f$U_{\texttt{histSize}[i]-1}\f$ for the last histogram bin histSize[i]-1 . That is, in case of a
    uniform histogram each of ranges[i] is an array of 2 elements. When the histogram is not uniform (
    uniform=false ), then each of ranges[i] contains histSize[i]+1 elements:
    \f$L_0, U_0=L_1, U_1=L_2, ..., U_{\texttt{histSize[i]}-2}=L_{\texttt{histSize[i]}-1}, U_{\texttt{histSize[i]}-1}\f$
    . The array elements, that are not between \f$L_0\f$ and \f$U_{\texttt{histSize[i]}-1}\f$ , are not
    counted in the histogram.
    @param uniform Flag indicating whether the histogram is uniform or not (see above).
    @param accumulate Accumulation flag. If it is set, the histogram is not cleared in the beginning
    when it is allocated. This feature enables you to compute a single histogram from several sets of
    arrays, or to update the histogram in time.
    */

overload->addOverload("imgproc", "", "calcHist", {
	make_param<std::shared_ptr<std::vector<Matrix*>>>("images","Array<Mat>"),
	make_param<std::shared_ptr<std::vector<int>>>("channels","Array<int>"),
	make_param<IOArray*>("Mask","IOArray"),
	make_param<IOArray*>("hist","IOArray"),
	make_param<int>("dims","int"),
	make_param<std::shared_ptr<std::vector<int>>>("histSize","Array<int>"),
	make_param<std::shared_ptr<std::vector<float>>>("ranges","Array<float>"),
	make_param<bool>("uniform","bool", true),
	make_param<bool>("accumulate","bool", false)
}, calcHist_array);
Nan::SetMethod(target, "calcHist", imgproc_general_callback::callback);

overload->addOverload("imgproc", "", "calcHist", {
	make_param<std::shared_ptr<std::vector<Matrix*>>>("images","Array<Mat>"),
	make_param<std::shared_ptr<std::vector<int>>>("channels","Array<int>"),
	make_param<IOArray*>("Mask","IOArray"),
	make_param<SparseMat*>("hist","SparseMat"),
	make_param<int>("dims","int"),
	make_param<std::shared_ptr<std::vector<int>>>("histSize","Array<int>"),
	make_param<std::shared_ptr<std::vector<float>>>("ranges","Array<float>"),
	make_param<bool>("uniform","bool", true),
	make_param<bool>("accumulate","bool", false)
}, calcHist_sparsemat);

overload->addOverload("imgproc", "", "calcHist", {
	make_param<std::shared_ptr<std::vector<Matrix*>>>("images","Array<Mat>"),
	make_param<std::shared_ptr<std::vector<int>>>("channels","Array<int>"),	
	make_param<IOArray*>("Mask","IOArray"),
	make_param<IOArray*>("hist","IOArray"),
	make_param<std::shared_ptr<std::vector<int>>>("histSize","Array<int>"),
	make_param<std::shared_ptr<std::vector<float>>>("ranges","Array<float>"),
	make_param<bool>("accumulate","bool", false)
}, calcHist_mat);

//interface IcalcHist{
//    ( images : Array<_mat.Mat>,channels : Array<_st.int>, Mask: _st.InputArray,
//        hist: _st.OutputArray , dims : _st.int, histSize : Array<_st.int>,
//   ranges : Array<_st.float>,  uniform? : boolean /*= true*/, accumulate? : boolean /*= false */) : void;
//
//
//    ( images : Array<_mat.Mat>,
//    channels : Array<_st.int>, Mask: _st.InputArray,
//        hist : _mat.SparseMat, dims : _st.int,
//        histSize: Array<_st.int>, ranges: Array<_st.float>,
//        uniform?: boolean /*= true*/, accumulate?: boolean /*= false */ ) : void;
//
//    /** @overload */
//    (images : _st.InputArrayOfArrays, channels : Array<_st.int>,
//        Mask: _st.InputArray, hist: _st.OutputArray ,
//        histSize : Array<_st.int>, ranges : Array<_st.float>, accumulate? : boolean /*= false */ ) : void;
//
//}
//
//export var calcHist: IcalcHist = alvision_module.calcHist;


//    CV_EXPORTS void calcHist( images : Array<_mat.Mat>, int nimages,
//        channels : Array < _st.int >, M : _st.InputArrayask,
//        OutputArray hist, dims : _st.int, histSize : Array<_st.int>,
//    ranges : Array<_st.float>, uniform : boolean /* = true*/, bool accumulate = false );
//
//    /** @overload
//    
//    this variant uses cv::SparseMat for output
//    */
//    CV_EXPORTS void calcHist( images : Array<_mat.Mat>, int nimages,
//    channels : Array<_st.int>, M : _st.InputArrayask,
//        hist : _mat.SparseMat, dims : _st.int,
//    histSize : Array<_st.int>, ranges : Array<_st.float>,
//        uniform : boolean /* = true*/, bool accumulate = false );
//
//    /** @overload */
//    CV_EXPORTS_W void calcHist(images : _st.InputArrayOfArrays,
//                            const std::vector<int>& channels,
//        M : _st.InputArrayask, OutputArray hist,
//    const std::vector<int>& histSize,
//    const std::vector<float>& ranges,
//        bool accumulate = false );

    /** @brief Calculates the back projection of a histogram.
    
    The functions calcBackProject calculate the back project of the histogram. That is, similarly to
    cv::calcHist , at each location (x, y) the function collects the values from the selected channels
    in the input images and finds the corresponding histogram bin. But instead of incrementing it, the
    function reads the bin value, scales it by scale , and stores in backProject(x,y) . In terms of
    statistics, the function computes probability of each element value in respect with the empirical
    probability distribution represented by the histogram. See how, for example, you can find and track
    a bright-colored object in a scene:
    
    - Before tracking, show the object to the camera so that it covers almost the whole frame.
    Calculate a hue histogram. The histogram may have strong maximums, corresponding to the dominant
    colors in the object.
    
    - When tracking, calculate a back projection of a hue plane of each input video frame using that
    pre-computed histogram. Threshold the back projection to suppress weak colors. It may also make
    sense to suppress pixels with non-sufficient color saturation and too dark or too bright pixels.
    
    - Find connected components in the resulting picture and choose, for example, the largest
    component.
    
    This is an approximate algorithm of the CamShift color object tracker.
    
    @param images Source arrays. They all should have the same depth, CV_8U or CV_32F , and the same
    size. Each of them can have an arbitrary number of channels.
    @param nimages Number of source images.
    @param channels The list of channels used to compute the back projection. The number of channels
    must match the histogram dimensionality. The first array channels are numerated from 0 to
    images[0].channels()-1 , the second array channels are counted from images[0].channels() to
    images[0].channels() + images[1].channels()-1, and so on.
    @param hist Input histogram that can be dense or sparse.
    @param backProject Destination back projection array that is a single-channel array of the same
    size and depth as images[0] .
    @param ranges Array of arrays of the histogram bin boundaries in each dimension. See calcHist .
    @param scale Optional scale factor for the output back projection.
    @param uniform Flag indicating whether the histogram is uniform or not (see above).
    
    @sa cv::calcHist, cv::compareHist
     */

overload->addOverload("imgproc", "", "calcBackProject", {
	make_param<std::shared_ptr<std::vector<Matrix*>>>("images","Array<Mat>"),
	make_param<std::shared_ptr<std::vector<int>>>("channels","Array<int>"),
	make_param<IOArray*>("hist","IOArray"),
	make_param<IOArray*>("backProject","IOArray"),
	make_param<std::shared_ptr<std::vector<float>>>("ranges","Array<float>"),
	make_param<double>("scale","double", 1),
	make_param<bool>("uniform","bool", true)
},calcBackProject );
Nan::SetMethod(target, "calcBackProject", imgproc_general_callback::callback);

overload->addOverload("imgproc", "", "calcBackProject", {
	make_param<std::shared_ptr<std::vector<Matrix*>>>("images","Array<Mat>"),
	make_param<std::shared_ptr<std::vector<int>>>("channels","Array<int>"),
	make_param<SparseMat*>("hist",SparseMat::name),
	make_param<IOArray*>("backProject","IOArray"),
	make_param<std::shared_ptr<std::vector<float>>>("ranges","Array<float>"),
	make_param<double>("scale","double",1),
	make_param<bool>("uniform","bool", true)
},calcBackProject_sparsemat );

overload->addOverload("imgproc", "", "calcBackProject", {
	make_param<IOArray*>("images","IOArray"),
	make_param<std::shared_ptr<std::vector<int>>>("channels","Array<int>"),
	make_param<IOArray*>("hist","IOArray"),
	make_param<IOArray*>( "dst","IOArray"),
	make_param<std::shared_ptr<std::vector<float>>>("ranges","Array<float>"),
	make_param<double>("scale","double"),
},calcBackProject_arrayofarrays );


//interface IcalcBackProject {
//(images : Array < _mat.Mat >, 
//    channels : Array<_st.int>, hist : _st.InputArray,
//    backProject : _st.OutputArray, ranges : Array<_st.float>,
//        scale: _st.double /* = 1*/, uniform : boolean /* = true*/ ) : void;
//
///** @overload */
//(images : Array < _mat.Mat >, 
//    channels : Array<_st.int>, hist: _mat.SparseMat,
//    backProject : _st.OutputArray, ranges : Array<_st.float>,
//        scale: _st.double /* = 1*/, uniform : boolean /* = true*/ ) : void;
//
///** @overload */
//(images : _st.InputArrayOfArrays, channels: Array<_st.int>,
//    hist : _st.InputArray, dst: _st.OutputArray,
//    ranges: Array<_st.float>,
//    scale: _st.double ) : void;
//}
//
//export var calcBackProject: IcalcBackProject = alvision_module.calcBackProject;

//
//    CV_EXPORTS void calcBackProject( images : Array<_mat.Mat>, int nimages,
//    channels : Array<_st.int>, hist : _st.InputArray,
//        backProject : _st.OutputArray, ranges : Array<_st.float>,
//            scale : _st.double /* = 1*/, uniform : boolean /* = true*/ );
//
//    /** @overload */
//    CV_EXPORTS void calcBackProject( images : Array<_mat.Mat>, int nimages,
//    channels : Array<_st.int>, const hist : _mat.SparseMat,
//        backProject : _st.OutputArray, ranges : Array<_st.float>,
//            scale : _st.double /* = 1*/, uniform : boolean /* = true*/ );
//
//    /** @overload */
//    CV_EXPORTS_W void calcBackProject(images : _st.InputArrayOfArrays, const std::vector<int>& channels,
//        hist : _st.InputArray, dst : _st.OutputArray,
//    const std::vector<float>& ranges,
//        scale : _st.double );

    /** @brief Compares two histograms.
    
    The function compare two dense or two sparse histograms using the specified method.
    
    The function returns \f$d(H_1, H_2)\f$ .
    
    While the function works well with 1-, 2-, 3-dimensional dense histograms, it may not be suitable
    for high-dimensional sparse histograms. In such histograms, because of aliasing and sampling
    problems, the coordinates of non-zero histogram bins can slightly shift. To compare such histograms
    or more general sparse configurations of weighted points, consider using the cv::EMD function.
    
    @param H1 First compared histogram.
    @param H2 Second compared histogram of the same size as H1 .
    @param method Comparison method, see cv::HistCompMethods
     */

overload->addOverload("imgproc", "", "compareHist", {
	make_param<IOArray*>("H1","IOArray"),
	make_param<IOArray*>("H2","IOArray"), 
	make_param<int>("method","HistCompMethods")
},compareHist );
Nan::SetMethod(target, "compareHist", imgproc_general_callback::callback);

overload->addOverload("imgproc", "", "compareHist", {
	make_param<SparseMat*>("H1",SparseMat::name), 
	make_param<SparseMat*>("H2",SparseMat::name), 
	make_param<int>("method","HistCompMethods")
},compareHist_sparsemat );

//interface IcompareHist {
//    (H1: _st.InputArray, H2: _st.InputArray, method: _st.int): _st.double;
//    (H1 : _mat.SparseMat, H2 : _mat.SparseMat, method: _st.int): _st.double;
//}
//
//export var compareHist: IcompareHist = alvision_module.compareHist;

//    CV_EXPORTS_W double compareHist(H1 : _st.InputArray, H2 : _st.InputArray, method : _st.int );
//
//    /** @overload */
//    CV_EXPORTS double compareHist( const SparseMat& H1, const SparseMat& H2, method : _st.int );

    /** @brief Equalizes the histogram of a grayscale image.
    
    The function equalizes the histogram of the input image using the following algorithm:
    
    - Calculate the histogram \f$H\f$ for src .
    - Normalize the histogram so that the sum of histogram bins is 255.
    - Compute the integral of the histogram:
    \f[H'_i =  \sum _{0  \le j < i} H(j)\f]
    - Transform the image using \f$H'\f$ as a look-up table: \f$\texttt{dst}(x,y) = H'(\texttt{src}(x,y))\f$
    
    The algorithm normalizes the brightness and increases the contrast of the image.
    
    @param src Source 8-bit single channel image.
    @param dst Destination image of the same size and type as src .
     */


overload->addOverload("imgproc", "", "equalizeHist", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray")
}, equalizeHist);
Nan::SetMethod(target, "equalizeHist", imgproc_general_callback::callback);

//interface IequalizeHist{
//    (src: _st.InputArray, dst: _st.OutputArray): void;
//}
//
//export var equalizeHist: IequalizeHist = alvision_module.equalizeHist;

    //CV_EXPORTS_W void equalizeHist(src : _st.InputArray, dst : _st.OutputArray );

    /** @brief Computes the "minimal work" distance between two weighted point configurations.
    
    The function computes the earth mover distance and/or a lower boundary of the distance between the
    two weighted point configurations. One of the applications described in @cite RubnerSept98,
    @cite Rubner2000 is multi-dimensional histogram comparison for image retrieval. EMD is a transportation
    problem that is solved using some modification of a simplex algorithm, thus the complexity is
    exponential in the worst case, though, on average it is much faster. In the case of a real metric
    the lower boundary can be calculated even faster (using linear-time algorithm) and it can be used
    to determine roughly whether the two signatures are far enough so that they cannot relate to the
    same object.
    
    @param signature1 First signature, a \f$\texttt{size1}\times \texttt{dims}+1\f$ floating-point matrix.
    Each row stores the point weight followed by the point coordinates. The matrix is allowed to have
    a single column (weights only) if the user-defined cost matrix is used.
    @param signature2 Second signature of the same format as signature1 , though the number of rows
    may be different. The total weights may be different. In this case an extra "dummy" point is added
    to either signature1 or signature2 .
    @param distType Used metric. See cv::DistanceTypes.
    @param cost User-defined \f$\texttt{size1}\times \texttt{size2}\f$ cost matrix. Also, if a cost matrix
    is used, lower boundary lowerBound cannot be calculated because it needs a metric function.
    @param lowerBound Optional input/output parameter: lower boundary of a distance between the two
    signatures that is a distance between mass centers. The lower boundary may not be calculated if
    the user-defined cost matrix is used, the total weights of point configurations are not equal, or
    if the signatures consist of weights only (the signature matrices have a single column). You
    **must** initialize \*lowerBound . If the calculated distance between mass centers is greater or
    equal to \*lowerBound (it means that the signatures are far enough), the function does not
    calculate EMD. In any case \*lowerBound is set to the calculated distance between mass centers on
    return. Thus, if you want to calculate both distance between mass centers and EMD, \*lowerBound
    should be set to 0.
    @param flow Resultant \f$\texttt{size1} \times \texttt{size2}\f$ flow matrix: \f$\texttt{flow}_{i,j}\f$ is
    a flow from \f$i\f$ -th point of signature1 to \f$j\f$ -th point of signature2 .
     */

overload->addOverload("imgproc", "", "EMD", {
	make_param<IOArray*>("signature1","IOArray"),
	make_param<IOArray*>("signature2","IOArray"),
	make_param<int>("distType","int"),
	make_param<IOArray*>("cost","IOArray", IOArray::noArray()),
	make_param<float>("lowerBound","float",0),
	make_param<std::shared_ptr<or::Callback>>("cb","Function",nullptr),// ? : (lowerBound : _st.float) = > void,
	make_param<IOArray*>("flow","IOArray", IOArray:: noArray())
}, EMD);
Nan::SetMethod(target, "EMD", imgproc_general_callback::callback);
//
//    interface IEMD {
//        (signature1 : _st.InputArray, signature2 : _st.InputArray,
//            distType : _st.int, cost? : _st.InputArray /* = noArray()*/,
//            lowerBound? : _st.float, cb?: (lowerBound : _st.float) => void,flow? : _st.OutputArray /*= noArray()/*/) :/ _st.float;
//    }
//
//export var EMD: IEMD = alvision_module.EMD;

//    CV_EXPORTS float EMD(signature1 : _st.InputArray, signature2 : _st.InputArray,
//        distType : _st.int, cost : _st.InputArray /* = noArray()*/,
//        float * lowerBound = 0, OutputArray flow = noArray());

    //! @} imgproc_hist

    /** @example watershed.cpp
    An example using the watershed algorithm
     */

    /** @brief Performs a marker-based image segmentation using the watershed algorithm.
    
    The function implements one of the variants of watershed, non-parametric marker-based segmentation
    algorithm, described in @cite Meyer92 .
    
    Before passing the image to the function, you have to roughly outline the desired regions in the
    image markers with positive (\>0) indices. So, every region is represented as one or more connected
    components with the pixel values 1, 2, 3, and so on. Such markers can be retrieved from a binary
    mask using findContours and drawContours (see the watershed.cpp demo). The markers are "seeds" of
    the future image regions. All the other pixels in markers , whose relation to the outlined regions
    is not known and should be defined by the algorithm, should be set to 0's. In the function output,
    each pixel in markers is set to a value of the "seed" components or to -1 at boundaries between the
    regions.
    
    @note Any two neighbor connected components are not necessarily separated by a watershed boundary
    (-1's pixels); for example, they can touch each other in the initial marker image passed to the
    function.
    
    @param image Input 8-bit 3-channel image.
    @param markers Input/output 32-bit single-channel image (map) of markers. It should have the same
    size as image .
    
    @sa findContours
    
    @ingroup imgproc_misc
     */


overload->addOverload("imgproc", "", "watershed", {
	make_param<IOArray*>(  "image","IOArray"),
	make_param<IOArray*>("markers","IOArray")
}, watershed);
Nan::SetMethod(target, "watershed", imgproc_general_callback::callback);

//    interface Iwatershed{
//        (image: _st.InputArray, markers: _st.InputOutputArray): void;
//    }
//
//export var watershed: Iwatershed = alvision_module.watershed;

    //CV_EXPORTS_W void watershed(image : _st.InputArray, markers : _st.InputOutputArray );

    //! @addtogroup imgproc_filter
    //! @{

    /** @brief Performs initial step of meanshift segmentation of an image.
    
    The function implements the filtering stage of meanshift segmentation, that is, the output of the
    function is the filtered "posterized" image with color gradients and fine-grain texture flattened.
    At every pixel (X,Y) of the input image (or down-sized input image, see below) the function executes
    meanshift iterations, that is, the pixel (X,Y) neighborhood in the joint space-color hyperspace is
    considered:
    
    \f[(x,y): X- \texttt{sp} \le x  \le X+ \texttt{sp} , Y- \texttt{sp} \le y  \le Y+ \texttt{sp} , ||(R,G,B)-(r,g,b)||   \le \texttt{sr}\f]
    
    where (R,G,B) and (r,g,b) are the vectors of color components at (X,Y) and (x,y), respectively
    (though, the algorithm does not depend on the color space used, so any 3-component color space can
    be used instead). Over the neighborhood the average spatial value (X',Y') and average color vector
    (R',G',B') are found and they act as the neighborhood center on the next iteration:
    
    \f[(X,Y)~(X',Y'), (R,G,B)~(R',G',B').\f]
    
    After the iterations over, the color components of the initial pixel (that is, the pixel from where
    the iterations started) are set to the final value (average color at the last iteration):
    
    \f[I(X,Y) <- (R*,G*,B*)\f]
    
    When maxLevel \> 0, the gaussian pyramid of maxLevel+1 levels is built, and the above procedure is
    run on the smallest layer first. After that, the results are propagated to the larger layer and the
    iterations are run again only on those pixels where the layer colors differ by more than sr from the
    lower-resolution layer of the pyramid. That makes boundaries of color regions sharper. Note that the
    results will be actually different from the ones obtained by running the meanshift procedure on the
    whole original image (i.e. when maxLevel==0).
    
    @param src The source 8-bit, 3-channel image.
    @param dst The destination image of the same format and the same size as the source.
    @param sp The spatial window radius.
    @param sr The color window radius.
    @param maxLevel Maximum level of the pyramid for the segmentation.
    @param termcrit Termination criteria: when to stop meanshift iterations.
     */

overload->addOverload("imgproc", "", "pyrMeanShiftFiltering", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<double>("sp","double"), 
	make_param<double>("sr","double"), 
	make_param<int>("maxLevel","int", 1),
	make_param<TermCriteria*>("termCriteria","TermCriteria",TermCriteria::New(cv::TermCriteria::MAX_ITER + cv::TermCriteria::EPS, 5, 1))
}, pyrMeanShiftFiltering);
Nan::SetMethod(target, "pyrMeanShiftFiltering", imgproc_general_callback::callback);

//interface IpyrMeanShiftFiltering {
//    (src: _st.InputArray, dst: _st.OutputArray,
//        sp : _st.double, sr : _st.double, maxLevel : _st.int /* = 1*/,
//        termCriteria : _types.TermCriteria /*= TermCriteria(TermCriteria::MAX_ITER + TermCriteria::EPS, 5, 1)*/): //void;
//}
//
//export var pyrMeanShiftFiltering: IpyrMeanShiftFiltering = alvision_module.pyrMeanShiftFiltering;

//    CV_EXPORTS_W void pyrMeanShiftFiltering(src : _st.InputArray, dst : _st.OutputArray,
//        sp : _st.double, sr : _st.double, maxLevel : _st.int /* = 1*/,
//        TermCriteria termcrit= TermCriteria(TermCriteria::MAX_ITER + TermCriteria::EPS, 5, 1));

    //! @}

    //! @addtogroup imgproc_misc
    //! @{

    /** @example grabcut.cpp
    An example using the GrabCut algorithm
     */

    /** @brief Runs the GrabCut algorithm.
    
    The function implements the [GrabCut image segmentation algorithm](http://en.wikipedia.org/wiki/GrabCut).
    
    @param img Input 8-bit 3-channel image.
    @param mask Input/output 8-bit single-channel mask. The mask is initialized by the function when
    mode is set to GC_INIT_WITH_RECT. Its elements may have one of the cv::GrabCutClasses.
    @param rect ROI containing a segmented object. The pixels outside of the ROI are marked as
    "obvious background". The parameter is only used when mode==GC_INIT_WITH_RECT .
    @param bgdModel Temporary array for the background model. Do not modify it while you are
    processing the same image.
    @param fgdModel Temporary arrays for the foreground model. Do not modify it while you are
    processing the same image.
    @param iterCount Number of iterations the algorithm should make before returning the result. Note
    that the result can be refined with further calls with mode==GC_INIT_WITH_MASK or
    mode==GC_EVAL .
    @param mode Operation mode that could be one of the cv::GrabCutModes
     */

overload->addOverload("imgproc", "", "grabCut", {
	make_param<IOArray*>( "img","IOArray"),
	make_param<IOArray*>("mask","IOArray"),
	make_param<Rect*>("rect",Rect::name),
	make_param<IOArray*>("bgdModel","IOArray"), 
	make_param<IOArray*>("fgdModel","IOArray"),
	make_param<int>("iterCount","int"),
	make_param<int>("mode","GrabCutModes",cv::GC_EVAL)
}, grabCut);
Nan::SetMethod(target, "grabCut", imgproc_general_callback::callback);

//interface IgrabCut{
//    (img : _st.InputArray, mask: _st.InputOutputArray, rect: _types.Rect,
//        bgdModel: _st.InputOutputArray, fgdModel: _st.InputOutputArray,
//        iterCount: _st.int, mode: GrabCutModes /*= GC_EVAL*/): void;
//}
//
//export var grabCut: IgrabCut = alvision_module.grabCut;

//    CV_EXPORTS_W void grabCut(img : _st.InputArray, mask : _st.InputOutputArray, rec : _types.Rectt,
//        InputOutputArray bgdModel, InputOutputArray fgdModel,
//        int iterCount, int mode = GC_EVAL);

    /** @example distrans.cpp
    An example on using the distance transform\
    */


    /** @brief Calculates the distance to the closest zero pixel for each pixel of the source image.
    
    The functions distanceTransform calculate the approximate or precise distance from every binary
    image pixel to the nearest zero pixel. For zero image pixels, the distance will obviously be zero.
    
    When maskSize == DIST_MASK_PRECISE and distanceType == DIST_L2 , the function runs the
    algorithm described in @cite Felzenszwalb04 . This algorithm is parallelized with the TBB library.
    
    In other cases, the algorithm @cite Borgefors86 is used. This means that for a pixel the function
    finds the shortest path to the nearest zero pixel consisting of basic shifts: horizontal, vertical,
    diagonal, or knight's move (the latest is available for a \f$5\times 5\f$ mask). The overall
    distance is calculated as a sum of these basic distances. Since the distance function should be
    symmetric, all of the horizontal and vertical shifts must have the same cost (denoted as a ), all
    the diagonal shifts must have the same cost (denoted as `b`), and all knight's moves must have the
    same cost (denoted as `c`). For the cv::DIST_C and cv::DIST_L1 types, the distance is calculated
    precisely, whereas for cv::DIST_L2 (Euclidean distance) the distance can be calculated only with a
    relative error (a \f$5\times 5\f$ mask gives more accurate results). For `a`,`b`, and `c`, OpenCV
    uses the values suggested in the original paper:
    - DIST_L1: `a = 1, b = 2`
    - DIST_L2:
        - `3 x 3`: `a=0.955, b=1.3693`
        - `5 x 5`: `a=1, b=1.4, c=2.1969`
    - DIST_C: `a = 1, b = 1`
    
    Typically, for a fast, coarse distance estimation DIST_L2, a \f$3\times 3\f$ mask is used. For a
    more accurate distance estimation DIST_L2, a \f$5\times 5\f$ mask or the precise algorithm is used.
    Note that both the precise and the approximate algorithms are linear on the number of pixels.
    
    This variant of the function does not only compute the minimum distance for each pixel \f$(x, y)\f$
    but also identifies the nearest connected component consisting of zero pixels
    (labelType==DIST_LABEL_CCOMP) or the nearest zero pixel (labelType==DIST_LABEL_PIXEL). Index of the
    component/pixel is stored in `labels(x, y)`. When labelType==DIST_LABEL_CCOMP, the function
    automatically finds connected components of zero pixels in the input image and marks them with
    distinct labels. When labelType==DIST_LABEL_CCOMP, the function scans through the input image and
    marks all the zero pixels with distinct labels.
    
    In this mode, the complexity is still linear. That is, the function provides a very fast way to
    compute the Voronoi diagram for a binary image. Currently, the second variant can use only the
    approximate distance transform algorithm, i.e. maskSize=DIST_MASK_PRECISE is not supported
    yet.
    
    @param src 8-bit, single-channel (binary) source image.
    @param dst Output image with calculated distances. It is a 8-bit or 32-bit floating-point,
    single-channel image of the same size as src.
    @param labels Output 2D array of labels (the discrete Voronoi diagram). It has the type
    CV_32SC1 and the same size as src.
    @param distanceType Type of distance, see cv::DistanceTypes
    @param masksize :_types.Size of the distance transform mask, see cv::DistanceTransformMasks.
    DIST_MASK_PRECISE is not supported by this variant. In case of the DIST_L1 or DIST_C distance type,
    the parameter is forced to 3 because a \f$3\times 3\f$ mask gives the same result as \f$5\times
    5\f$ or any larger aperture.
    @param labelType Type of the label array to build, see cv::DistanceTransformLabelTypes.
     */

//interface IdistanceTransform{
//    (src: _st.InputArray, dst: _st.OutputArray,
//        labels: _st.OutputArray,  distanceType :_st.int, maskSize : _st.int,
//        labelType: DistanceTransformLabelTypes /* = DIST_LABEL_CCOMP*/): void;
//}

//export var distanceTransform: IdistanceTransform = alvision_module.distanceTransform;

//    CV_EXPORTS_AS(distanceTransformWithLabels) void distanceTransform(src : _st.InputArray, dst : _st.OutputArray,
//        labels : _st.OutputArray, int distanceType, int maskSize,
//        int labelType = DIST_LABEL_CCOMP);

    /** @overload
    @param src 8-bit, single-channel (binary) source image.
    @param dst Output image with calculated distances. It is a 8-bit or 32-bit floating-point,
    single-channel image of the same size as src .
    @param distanceType Type of distance, see cv::DistanceTypes
    @param masksize :_types.Size of the distance transform mask, see cv::DistanceTransformMasks. In case of the
    DIST_L1 or DIST_C distance type, the parameter is forced to 3 because a \f$3\times 3\f$ mask gives
    the same result as \f$5\times 5\f$ or any larger aperture.
    @param dstType Type of output image. It can be CV_8U or CV_32F. Type CV_8U can be used only for
    the first variant of the function and distanceType == DIST_L1.
    */

overload->addOverload("imgproc", "", "distanceTransform", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<int>("distanceType","DistanceTypes"),
	make_param<int>("maskSize","int"),
	make_param<int>("dstType","int", CV_32F)
},distanceTransform );
Nan::SetMethod(target, "distanceTransform", imgproc_general_callback::callback);

overload->addOverload("imgproc", "", "distanceTransform", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<IOArray*>("labels","IOArray"),
	make_param<int>("distanceType","int"),
	make_param<int>("maskSize","int"),
	make_param<int>("labelType","DistanceTransformLabelTypes",cv::DIST_LABEL_CCOMP)
},distanceTransform_labels );

//interface IdistanceTransform{
//    (src: _st.InputArray, dst: _st.OutputArray,
//        distanceType: DistanceTypes, maskSize: _st.int, dstType: _st.int  /*= CV_32F*/): void;
//    (src: _st.InputArray, dst: _st.OutputArray,
//        labels: _st.OutputArray, distanceType: _st.int, maskSize: _st.int,
//        labelType: DistanceTransformLabelTypes /* = DIST_LABEL_CCOMP*/): void;
//}
//
//export var distanceTransform: IdistanceTransform = alvision_module.distanceTransform;

//    CV_EXPORTS_W void distanceTransform(src : _st.InputArray, dst : _st.OutputArray,
//        int distanceType, int maskSize, int dstType= CV_32F);

    /** @example ffilldemo.cpp
      An example using the FloodFill technique
    */

    /** @overload
    
    variant without `mask` parameter
    */

//interface IfloodFill{
//    (image: _st.InputOutputArray,
//        seedPoint: _types.Point, newVal: _types.Scalar, cb : (rect : _types.Rect) => void,
//            loDiff : _types.Scalar /* = Scalar()*/, upDiff : _types.Scalar /* = Scalar()*/,
//                flags : _st.int /* = 4*/) : _st.int;
//}

//export var floodFill: IfloodFill = alvision_module.floodFill;

 //   CV_EXPORTS int floodFill(image : _st.InputOutputArray,
 //       seedPoint : _types.Point, newVal : _types.Scalar, CV_OUT Rect* rect = 0,
 //       loDiff : _types.Scalar /* = Scalar()*/, upDiff : _types.Scalar /* = Scalar()*/,
 //       flags : _st.int /* = 4*/);

    /** @brief Fills a connected component with the given color.
    
    The functions floodFill fill a connected component starting from the seed point with the specified
    color. The connectivity is determined by the color/brightness closeness of the neighbor pixels. The
    pixel at \f$(x,y)\f$ is considered to belong to the repainted domain if:
    
    - in case of a grayscale image and floating range
    \f[\texttt{src} (x',y')- \texttt{loDiff} \leq \texttt{src} (x,y)  \leq \texttt{src} (x',y')+ \texttt{upDiff}\f]
    
    
    - in case of a grayscale image and fixed range
    \f[\texttt{src} ( \texttt{seedPoint} .x, \texttt{seedPoint} .y)- \texttt{loDiff} \leq \texttt{src} (x,y)  \leq \texttt{src} ( \texttt{seedPoint} .x, \texttt{seedPoint} .y)+ \texttt{upDiff}\f]
    
    
    - in case of a color image and floating range
    \f[\texttt{src} (x',y')_r- \texttt{loDiff} _r \leq \texttt{src} (x,y)_r \leq \texttt{src} (x',y')_r+ \texttt{upDiff} _r,\f]
    \f[\texttt{src} (x',y')_g- \texttt{loDiff} _g \leq \texttt{src} (x,y)_g \leq \texttt{src} (x',y')_g+ \texttt{upDiff} _g\f]
    and
    \f[\texttt{src} (x',y')_b- \texttt{loDiff} _b \leq \texttt{src} (x,y)_b \leq \texttt{src} (x',y')_b+ \texttt{upDiff} _b\f]
    
    
    - in case of a color image and fixed range
    \f[\texttt{src} ( \texttt{seedPoint} .x, \texttt{seedPoint} .y)_r- \texttt{loDiff} _r \leq \texttt{src} (x,y)_r \leq \texttt{src} ( \texttt{seedPoint} .x, \texttt{seedPoint} .y)_r+ \texttt{upDiff} _r,\f]
    \f[\texttt{src} ( \texttt{seedPoint} .x, \texttt{seedPoint} .y)_g- \texttt{loDiff} _g \leq \texttt{src} (x,y)_g \leq \texttt{src} ( \texttt{seedPoint} .x, \texttt{seedPoint} .y)_g+ \texttt{upDiff} _g\f]
    and
    \f[\texttt{src} ( \texttt{seedPoint} .x, \texttt{seedPoint} .y)_b- \texttt{loDiff} _b \leq \texttt{src} (x,y)_b \leq \texttt{src} ( \texttt{seedPoint} .x, \texttt{seedPoint} .y)_b+ \texttt{upDiff} _b\f]
    
    
    where \f$src(x',y')\f$ is the value of one of pixel neighbors that is already known to belong to the
    component. That is, to be added to the connected component, a color/brightness of the pixel should
    be close enough to:
    - Color/brightness of one of its neighbors that already belong to the connected component in case
    of a floating range.
    - Color/brightness of the seed point in case of a fixed range.
    
    Use these functions to either mark a connected component with the specified color in-place, or build
    a mask and then extract the contour, or copy the region to another image, and so on.
    
    @param image Input/output 1- or 3-channel, 8-bit, or floating-point image. It is modified by the
    function unless the FLOODFILL_MASK_ONLY flag is set in the second variant of the function. See
    the details below.
    @param mask Operation mask that should be a single-channel 8-bit image, 2 pixels wider and 2 pixels
    taller than image. Since this is both an input and output parameter, you must take responsibility
    of initializing it. Flood-filling cannot go across non-zero pixels in the input mask. For example,
    an edge detector output can be used as a mask to stop filling at edges. On output, pixels in the
    mask corresponding to filled pixels in the image are set to 1 or to the a value specified in flags
    as described below. It is therefore possible to use the same mask in multiple calls to the function
    to make sure the filled areas do not overlap.
    @param seedPoint Starting point.
    @param newVal New value of the repainted domain pixels.
    @param loDiff Maximal lower brightness/color difference between the currently observed pixel and
    one of its neighbors belonging to the component, or a seed pixel being added to the component.
    @param upDiff Maximal upper brightness/color difference between the currently observed pixel and
    one of its neighbors belonging to the component, or a seed pixel being added to the component.
    @param rect Optional output parameter set by the function to the minimum bounding rectangle of the
    repainted domain.
    @param flags Operation flags. The first 8 bits contain a connectivity value. The default value of
    4 means that only the four nearest neighbor pixels (those that share an edge) are considered. A
    connectivity value of 8 means that the eight nearest neighbor pixels (those that share a corner)
    will be considered. The next 8 bits (8-16) contain a value between 1 and 255 with which to fill
    the mask (the default value is 1). For example, 4 | ( 255 \<\< 8 ) will consider 4 nearest
    neighbours and fill the mask with a value of 255. The following additional options occupy higher
    bits and therefore may be further combined with the connectivity and mask fill values using
    bit-wise or (|), see cv::FloodFillFlags.
    
    @note Since the mask is larger than the filled image, a pixel \f$(x, y)\f$ in image corresponds to the
    pixel \f$(x+1, y+1)\f$ in the mask .
    
    @sa findContours
     */

overload->addOverload("imgproc", "", "floodFill", {
	make_param<IOArray*>("image","IOArray"),
	make_param<IOArray*>( "mask","IOArray"),
	make_param<Point*>("seedPoint",Point::name), 
	make_param<Scalar*>("newVal",Scalar::name),
	make_param<std::shared_ptr<or::Callback>>("cb","Function"),// : (rect : _types.Rect) = > void,
	make_param<Scalar*>("loDiff",Scalar::name, Scalar::create()),
	make_param<Scalar*>("upDiff",Scalar::name, Scalar::create()),
	make_param<int>("flags","int", 4)
},floodFill_mask );
Nan::SetMethod(target, "floodFill", imgproc_general_callback::callback);

overload->addOverload("imgproc", "", "floodFill", {
	make_param<IOArray*>("image","IOArray"),
	make_param<Point*>("seedPoint",Point::name), 
	make_param<Scalar*>("newVal",Scalar::name), 
	make_param<std::shared_ptr<or::Callback>>("cb","Function"),// : (rect : _types.Rect) = > void,
	make_param<Scalar*>("loDiff",Scalar::name, Scalar::create()),
	make_param<Scalar*>("upDiff",Scalar::name, Scalar::create()),
	make_param<int>("flags","int", 4)
},floodFill );


//    interface IfloodFill{
//        (image : _st.InputOutputArray, mask : _st.InputOutputArray,
//        seedPoint : _types.Point, newVal : _types.Scalar, cb : (rect : _types.Rect) => void,
//            loDiff : _types.Scalar /* = Scalar()*/, upDiff : _types.Scalar /* = Scalar()*/,
//            flags: _st.int /* = 4*/): _st.int;
//
//        (image: _st.InputOutputArray,
//            seedPoint: _types.Point, newVal: _types.Scalar, cb: (rect: _types.Rect) => void,
//            loDiff: _types.Scalar /* = Scalar()*/, upDiff: _types.Scalar /* = Scalar()*/,
//            flags: _st.int /* = 4*/): _st.int;
//}
//
//export var floodFill: IfloodFill = alvision_module.floodFill;

//    CV_EXPORTS_W int floodFill(image : _st.InputOutputArray, mask : _st.InputOutputArray,
//        seedPoint : _types.Point, newVal : _types.Scalar, CV_OUT Rect* rect=0,
//        loDiff : _types.Scalar /* = Scalar()*/, upDiff : _types.Scalar /* = Scalar()*/,
//        flags : _st.int /* = 4*/);

    /** @brief Converts an image from one color space to another.
    
    The function converts an input image from one color space to another. In case of a transformation
    to-from RGB color space, the order of the channels should be specified explicitly (RGB or BGR). Note
    that the default color format in OpenCV is often referred to as RGB but it is actually BGR (the
    bytes are reversed). So the first byte in a standard (24-bit) color image will be an 8-bit Blue
    component, the second byte will be Green, and the third byte will be Red. The fourth, fifth, and
    sixth bytes would then be the second pixel (Blue, then Green, then Red), and so on.
    
    The conventional ranges for R, G, and B channel values are:
    -   0 to 255 for CV_8U images
    -   0 to 65535 for CV_16U images
    -   0 to 1 for CV_32F images
    
    In case of linear transformations, the range does not matter. But in case of a non-linear
    transformation, an input RGB image should be normalized to the proper value range to get the correct
    results, for example, for RGB \f$\rightarrow\f$ L\*u\*v\* transformation. For example, if you have a
    32-bit floating-point image directly converted from an 8-bit image without any scaling, then it will
    have the 0..255 value range instead of 0..1 assumed by the function. So, before calling cvtColor ,
    you need first to scale the image down:
    @code
        img *= 1./255;
        cvtColor(img, img, COLOR_BGR2Luv);
    @endcode
    If you use cvtColor with 8-bit images, the conversion will have some information lost. For many
    applications, this will not be noticeable but it is recommended to use 32-bit images in applications
    that need the full range of colors or that convert an image before an operation and then convert
    back.
    
    If conversion adds the alpha channel, its value will set to the maximum of corresponding channel
    range: 255 for CV_8U, 65535 for CV_16U, 1 for CV_32F.
    
    @param src input image: 8-bit unsigned, 16-bit unsigned ( CV_16UC... ), or single-precision
    floating-point.
    @param dst output image of the same size and depth as src.
    @param code color space conversion code (see cv::ColorConversionCodes).
    @param dstCn number of channels in the destination image; if the parameter is 0, the number of the
    channels is derived automatically from src and code.
    
    @see @ref imgproc_color_conversions
     */

overload->addOverload("imgproc", "", "cvtColor", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<int>("code","ColorConversionCodes"),
	make_param<int>("dstCn","int", 0)
}, cvtColor);
Nan::SetMethod(target, "cvtColor", imgproc_general_callback::callback);

//interface IcvtColor{
//    (src: _st.InputArray, dst: _st.OutputArray, code: ColorConversionCodes | _st.int, dstCn?: _st.int /*= 0*/): void;
//}
//
//export var cvtColor: IcvtColor = alvision_module.cvtColor;

//    CV_EXPORTS_W void cvtColor(src : _st.InputArray, dst : _st.OutputArray, int code, int dstCn = 0);

    //! @} imgproc_misc

    // main function for all demosaicing procceses

overload->addOverload("imgproc", "", "demosaicing", {
	make_param<IOArray*>("_src","IOArray"),
	make_param<IOArray*>("_dst","IOArray"),
	make_param<int>("code","int"),
	make_param<int>("dcn","int", 0)
}, demosaicing);
Nan::SetMethod(target, "demosaicing", imgproc_general_callback::callback);

//interface Idemosaicing{
//    (_src: _st.InputArray, _dst: _st.OutputArray, code : _st.int, dcn? : _st.int/* = 0*/): void;
//}
//
//export var demosaicing: Idemosaicing = alvision_module.demosaicing;

//    CV_EXPORTS_W void demosaicing(_src : _st.InputArray, _dst : _st.OutputArray, int code, int dcn = 0);

    //! @addtogroup imgproc_shape
    //! @{

    /** @brief Calculates all of the moments up to the third order of a polygon or rasterized shape.
    
    The function computes moments, up to the 3rd order, of a vector shape or a rasterized shape. The
    results are returned in the structure cv::Moments.
    
    @param array Raster image (single-channel, 8-bit or floating-point 2D array) or an array (
    \f$1 \times N\f$ or \f$N \times 1\f$ ) of 2D points (Point or Point2f ).
    @param binaryImage If it is true, all non-zero image pixels are treated as 1's. The parameter is
    used for images only.
    @returns moments.
    
    @sa  contourArea, arcLength
     */


overload->addOverload("imgproc", "", "moments", {
	make_param<IOArray*>("array","IOArray"),
	make_param<bool>("binaryImage","bool", false)
}, moments);
Nan::SetMethod(target, "moments", imgproc_general_callback::callback);

//interface Imoments {
//    (array: _st.InputArray , binaryImage? : boolean /* = false*/): _types.Moments;
//}
//
//export var moments: Imoments = alvision_module.moments;
//    CV_EXPORTS_W Moments moments(InputArray array, bool binaryImage = false);

    /** @brief Calculates seven Hu invariants.
    
    The function calculates seven Hu invariants (introduced in @cite Hu62; see also
    <http://en.wikipedia.org/wiki/Image_moment>) defined as:
    
    \f[\begin{array}{l} hu[0]= \eta _{20}+ \eta _{02} \\ hu[1]=( \eta _{20}- \eta _{02})^{2}+4 \eta _{11}^{2} \\ hu[2]=( \eta _{30}-3 \eta _{12})^{2}+ (3 \eta _{21}- \eta _{03})^{2} \\ hu[3]=( \eta _{30}+ \eta _{12})^{2}+ ( \eta _{21}+ \eta _{03})^{2} \\ hu[4]=( \eta _{30}-3 \eta _{12})( \eta _{30}+ \eta _{12})[( \eta _{30}+ \eta _{12})^{2}-3( \eta _{21}+ \eta _{03})^{2}]+(3 \eta _{21}- \eta _{03})( \eta _{21}+ \eta _{03})[3( \eta _{30}+ \eta _{12})^{2}-( \eta _{21}+ \eta _{03})^{2}] \\ hu[5]=( \eta _{20}- \eta _{02})[( \eta _{30}+ \eta _{12})^{2}- ( \eta _{21}+ \eta _{03})^{2}]+4 \eta _{11}( \eta _{30}+ \eta _{12})( \eta _{21}+ \eta _{03}) \\ hu[6]=(3 \eta _{21}- \eta _{03})( \eta _{21}+ \eta _{03})[3( \eta _{30}+ \eta _{12})^{2}-( \eta _{21}+ \eta _{03})^{2}]-( \eta _{30}-3 \eta _{12})( \eta _{21}+ \eta _{03})[3( \eta _{30}+ \eta _{12})^{2}-( \eta _{21}+ \eta _{03})^{2}] \\ \end{array}\f]
    
    where \f$\eta_{ji}\f$ stands for \f$\texttt{Moments::nu}_{ji}\f$ .
    
    These values are proved to be invariants to the image scale, rotation, and reflection except the
    seventh one, whose sign is changed by reflection. This invariance is proved with the assumption of
    infinite image resolution. In case of raster images, the computed Hu invariants for the original and
    transformed images are a bit different.
    
    @param moments Input moments computed with moments .
    @param hu Output Hu invariants.
    
    @sa matchShapes
     */

overload->addOverload("imgproc", "", "HuMoments", {
	make_param<Moments*>("moments",Moments::name), 
	make_param<std::shared_ptr<std::vector<double>>>("hu","Array<double>")
}, HuMoments_array);
Nan::SetMethod(target, "HuMoments", imgproc_general_callback::callback);

overload->addOverload("imgproc", "", "HuMoments", {
	make_param<Moments*>("m",Moments::name), 
	make_param<Matrix*>("hu","Mat")
}, HuMoments);


//interface IHuMoments {
//    (moments: _types.Moments, hu: Array<_st.double>): void;
//    (m: _types.Moments, hu: _st.OutputArray ): void;
//}
//
//
//export var HuMoments: IHuMoments = alvision_module.HuMoments;
//    CV_EXPORTS void HuMoments( const Moments& moments, double hu[7] );

    /** @overload */
   // CV_EXPORTS_W void HuMoments( const Moments& m, OutputArray hu );

    //! @} imgproc_shape

    //! @addtogroup imgproc_object
    //! @{

    //! type of the template matching operation

auto TemplateMatchModes = CreateNamedObject(target, "TemplateMatchModes");
SetObjectProperty(TemplateMatchModes, "TM_SQDIFF", 0);
SetObjectProperty(TemplateMatchModes, "TM_SQDIFF_NORMED", 1);
SetObjectProperty(TemplateMatchModes, "TM_CCORR", 2);
SetObjectProperty(TemplateMatchModes, "TM_CCORR_NORMED", 3);
SetObjectProperty(TemplateMatchModes, "TM_CCOEFF", 4);
SetObjectProperty(TemplateMatchModes, "TM_CCOEFF_NORMED", 5);

    /** @brief Compares a template against overlapped image regions.
    
    The function slides through image , compares the overlapped patches of size \f$w \times h\f$ against
    templ using the specified method and stores the comparison results in result . Here are the formulae
    for the available comparison methods ( \f$I\f$ denotes image, \f$T\f$ template, \f$R\f$ result ). The summation
    is done over template and/or the image patch: \f$x' = 0...w-1, y' = 0...h-1\f$
    
    After the function finishes the comparison, the best matches can be found as global minimums (when
    TM_SQDIFF was used) or maximums (when TM_CCORR or TM_CCOEFF was used) using the
    minMaxLoc function. In case of a color image, template summation in the numerator and each sum in
    the denominator is done over all of the channels and separate mean values are used for each channel.
    That is, the function can take a color template and a color image. The result will still be a
    single-channel image, which is easier to analyze.
    
    @param image Image where the search is running. It must be 8-bit or 32-bit floating-point.
    @param templ Searched template. It must be not greater than the source image and have the same
    data type.
    @param result Map of comparison results. It must be single-channel 32-bit floating-point. If image
    is \f$W \times H\f$ and templ is \f$w \times h\f$ , then result is \f$(W-w+1) \times (H-h+1)\f$ .
    @param method Parameter specifying the comparison method, see cv::TemplateMatchModes
    @param mask Mask of searched template. It must have the same datatype and size with templ. It is
    not set by default.
     */

	overload->addOverload("imgproc", "", "matchTemplate", {
		make_param<IOArray*>( "image","IOArray"),
		make_param<IOArray*>( "templ","IOArray"),
		make_param<IOArray*>("result","IOArray"), 
		make_param<int>("method","int"),
		make_param<IOArray*>("mask","IOArray",IOArray:: noArray())
	}, matchTemplate);
	Nan::SetMethod(target, "matchTemplate", imgproc_general_callback::callback);

//
//    interface ImatchTemplate{
//        (image: _st.InputArray, templ: _st.InputArray,
//            result: _st.OutputArray, method: _st.int, mask?: _st.InputArray /* = noArray()*/): void;
//    }
//export var matchTemplate: ImatchTemplate = alvision_module.matchTemplate;

//
//    CV_EXPORTS_W void matchTemplate(image : _st.InputArray, templ : _st.InputArray,
//        result : _st.OutputArray, method : _st.int, mask : _st.InputArray /* = noArray()*/);

    //! @}

    //! @addtogroup imgproc_shape
    //! @{

    /** @brief computes the connected components labeled image of boolean image
    
    image with 4 or 8 way connectivity - returns N, the total number of labels [0, N-1] where 0
    represents the background label. ltype specifies the output label image type, an important
    consideration based on the total number of labels or alternatively the total number of pixels in
    the source image.
    
    @param image the 8-bit single-channel image to be labeled
    @param labels destination labeled image
    @param connectivity 8 or 4 for 8-way or 4-way connectivity respectively
    @param ltype output image label type. Currently CV_32S and CV_16U are supported.
     */


overload->addOverload("imgproc", "", "connectedComponents", {
	make_param<IOArray*>( "image","IOArray"),
	make_param<IOArray*>("labels","IOArray"),
	make_param<int>("connectivity","int", 8),
	make_param<int>("ltype","int", CV_32S)
}, connectedComponents);
	Nan::SetMethod(target, "connectedComponents", imgproc_general_callback::callback);

//interface IconnectedComponents{
//    (image: _st.InputArray, labels : _st.OutputArray,
//        connectivity? : _st.int /* = 8*/, ltype? : _st.int /* = CV_32S*/): _st.int;
//}
//
//export var connectedComponents: IconnectedComponents = alvision_module.connectedComponents;

//    CV_EXPORTS_W int connectedComponents(image : _st.InputArray, labels : _st.OutputArray,
//        connectivity : _st.int /* = 8*/, ltype : _st.int /* = CV_32S*/);

    /** @overload
    @param image the 8-bit single-channel image to be labeled
    @param labels destination labeled image
    @param stats statistics output for each label, including the background label, see below for
    available statistics. Statistics are accessed via stats(label, COLUMN) where COLUMN is one of
    cv::ConnectedComponentsTypes. The data type is CV_32S.
    @param centroids centroid output for each label, including the background label. Centroids are
    accessed via centroids(label, 0) for x and centroids(label, 1) for y. The data type CV_64F.
    @param connectivity 8 or 4 for 8-way or 4-way connectivity respectively
    @param ltype output image label type. Currently CV_32S and CV_16U are supported.
    */


overload->addOverload("imgproc", "", "connectedComponentsWithStats", {
	make_param<IOArray*>( "image","IOArray"),
	make_param<IOArray*>("labels","IOArray"),
	make_param<IOArray*>( "stats","IOArray"), 
	make_param<IOArray*>("centroids","IOArray"),
	make_param<int>("connectivity","int", 8),
	make_param<int>("ltype","int",CV_32S)
}, connectedComponentsWithStats);
	Nan::SetMethod(target, "connectedComponentsWithStats", imgproc_general_callback::callback);

//interface IconnectedComponentsWithStats {
//    (image: _st.InputArray, labels: _st.OutputArray,
//        stats : _st.OutputArray, centroids : _st.OutputArray,
//        connectivity: _st.int /* = 8*/, ltype: _st.int /* = CV_32S*/): _st.int;
//}
//
//export var connectedComponentsWithStats: IconnectedComponentsWithStats = alvision_module.connectedComponentsWithStats;

//    CV_EXPORTS_W int connectedComponentsWithStats(image : _st.InputArray, labels : _st.OutputArray,
//        stats : _st.OutputArray, centroids : _st.OutputArray,
//        connectivity : _st.int /* = 8*/, ltype : _st.int /* = CV_32S*/);


    /** @brief Finds contours in a binary image.
    
    The function retrieves contours from the binary image using the algorithm @cite Suzuki85 . The contours
    are a useful tool for shape analysis and object detection and recognition. See squares.c in the
    OpenCV sample directory.
    
    @note Source image is modified by this function. Also, the function does not take into account
    1-pixel border of the image (it's filled with 0's and used for neighbor analysis in the algorithm),
    therefore the contours touching the image border will be clipped.
    
    @param image Source, an 8-bit single-channel image. Non-zero pixels are treated as 1's. Zero
    pixels remain 0's, so the image is treated as binary . You can use compare , inRange , threshold ,
    adaptiveThreshold , Canny , and others to create a binary image out of a grayscale or color one.
    The function modifies the image while extracting the contours. If mode equals to RETR_CCOMP
    or RETR_FLOODFILL, the input can also be a 32-bit integer image of labels (CV_32SC1).
    @param contours Detected contours. Each contour is stored as a vector of points.
    @param hierarchy Optional output vector, containing information about the image topology. It has
    as many elements as the number of contours. For each i-th contour contours[i] , the elements
    hierarchy[i][0] , hiearchy[i][1] , hiearchy[i][2] , and hiearchy[i][3] are set to 0-based indices
    in contours of the next and previous contours at the same hierarchical level, the first child
    contour and the parent contour, respectively. If for the contour i there are no next, previous,
    parent, or nested contours, the corresponding elements of hierarchy[i] will be negative.
    @param mode Contour retrieval mode, see cv::RetrievalModes
    @param method Contour approximation method, see cv::ContourApproximationModes
    @param offset Optional offset by which every contour point is shifted. This is useful if the
    contours are extracted from the image ROI and then they should be analyzed in the whole image
    context.
     */

overload->addOverload("imgproc", "", "findContours", {
	make_param<IOArray*>("image","IOArray"),
	make_param<IOArray*>("contours","IOArray"),
	make_param<IOArray*>("hierarchy","IOArray"),
	make_param<int>("mode","RetrievalModes"),
	make_param<int>("method","ContourApproximationModes"),
	make_param<Point*>("offset",Point::name,Point::create())
}, findContours_hierarchy);
	Nan::SetMethod(target, "findContours", imgproc_general_callback::callback);

overload->addOverload("imgproc", "", "findContours", {
	make_param<IOArray*>("image","IOArray"),
	make_param<IOArray*>("contours","IOArray"),
	make_param<int>("mode","RetrievalModes"),
	make_param<int>("method","ContourApproximationModes"),
	make_param<Point*>("offset",Point::name, Point::create())
}, findContours);

//interface IfindContours{
//    (image: _st.InputOutputArray, contours : _st.OutputArrayOfArrays,
//        hierarchy: _st.OutputArray, mode: RetrievalModes,
//        method: ContourApproximationModes, offset?: _types.Point /* = Point()*/): void;
//
//    (image: _st.InputOutputArray, contours : _st.OutputArrayOfArrays,
//        mode: RetrievalModes, method: ContourApproximationModes, offset?: _types.Point /* = Point()*/): void;
//}
//
//export var findContours: IfindContours = alvision_module.findContours;

//    CV_EXPORTS_W void findContours(image : _st.InputOutputArray, contours : _st.OutputArrayOfArrays,
//        hierarchy : _st.OutputArray, int mode,
//        method : _st.int, offset : _types.Point /* = Point()*/);
//
//    /** @overload */
//    CV_EXPORTS void findContours(image : _st.InputOutputArray, contours : _st.OutputArrayOfArrays,
//        int mode, method : _st.int, offset : _types.Point /* = Point()*/);

    /** @brief Approximates a polygonal curve(s) with the specified precision.
    
    The functions approxPolyDP approximate a curve or a polygon with another curve/polygon with less
    vertices so that the distance between them is less or equal to the specified precision. It uses the
    Douglas-Peucker algorithm <http://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm>
    
    @param curve Input vector of a 2D point stored in std::vector or Mat
    @param approxCurve Result of the approximation. The type should match the type of the input curve.
    @param epsilon Parameter specifying the approximation accuracy. This is the maximum distance
    between the original curve and its approximation.
    @param closed If true, the approximated curve is closed (its first and last vertices are
    connected). Otherwise, it is not closed.
     */

overload->addOverload("imgproc", "", "approxPolyDP", {
	make_param<IOArray*>("curve","IOArray"),
	make_param<IOArray*>("approxCurve","IOArray"),
	make_param<double>("epsilon","double"),
	make_param<bool>("closed","bool")
}, approxPolyDP);
Nan::SetMethod(target, "approxPolyDP", imgproc_general_callback::callback);

//interface IapproxPolyDP{
//    (curve : _st.InputArray,
//    approxCurve : _st.OutputArray,
//    epsilon : _st.double, closed : boolean) : void;
//}
//
//export var approxPolyDP: IapproxPolyDP = alvision_module.approxPolyDP;

//    CV_EXPORTS_W void approxPolyDP(curve : _st.InputArray,
//        approxCurve : _st.OutputArray,
//        epsilon : _st.double, closed : boolean );

    /** @brief Calculates a contour perimeter or a curve length.
    
    The function computes a curve length or a closed contour perimeter.
    
    @param curve Input vector of 2D points, stored in std::vector or Mat.
    @param closed Flag indicating whether the curve is closed or not.
     */

overload->addOverload("imgproc", "", "arcLength", {
	make_param<IOArray*>("curve","IOArray"),
	make_param<bool>("closed","bool")
}, arcLength);
Nan::SetMethod(target, "arcLength", imgproc_general_callback::callback);


//interface IarcLength {
//    (curve: _st.InputArray, closed: boolean): _st.double;
//}
//
//export var arcLength: IarcLength = alvision_module.arcLength;

    //CV_EXPORTS_W double arcLength(curve : _st.InputArray, closed : boolean );

    /** @brief Calculates the up-right bounding rectangle of a point set.
    
    The function calculates and returns the minimal up-right bounding rectangle for the specified point set.
    
    @param points Input 2D point set, stored in std::vector or Mat.
     */



overload->addOverload("imgproc", "", "boundingRect", {
	make_param<IOArray*>("points","IOArray")
}, boundingRect);
Nan::SetMethod(target, "boundingRect", imgproc_general_callback::callback);

//interface IboundingRect{
//    (points: _st.InputArray): _types.Rect;
//}
//
//export var boundingRect: IboundingRect = alvision_module.boundingRect;

    //CV_EXPORTS_W Rect boundingRect(points : _st.InputArray );

    /** @brief Calculates a contour area.
    
    The function computes a contour area. Similarly to moments , the area is computed using the Green
    formula. Thus, the returned area and the number of non-zero pixels, if you draw the contour using
    drawContours or fillPoly , can be different. Also, the function will most certainly give a wrong
    results for contours with self-intersections.
    
    Example:
    @code
        vector<Point> contour;
        contour.push_back(Point2f(0, 0));
        contour.push_back(Point2f(10, 0));
        contour.push_back(Point2f(10, 10));
        contour.push_back(Point2f(5, 4));
    
        double area0 = contourArea(contour);
        vector<Point> approx;
        approxPolyDP(contour, approx, 5, true);
        double area1 = contourArea(approx);
    
        cout << "area0 =" << area0 << endl <<
                "area1 =" << area1 << endl <<
                "approx poly vertices" << approx.size() << endl;
    @endcode
    @param contour Input vector of 2D points (contour vertices), stored in std::vector or Mat.
    @param oriented Oriented area flag. If it is true, the function returns a signed area value,
    depending on the contour orientation (clockwise or counter-clockwise). Using this feature you can
    determine orientation of a contour by taking the sign of an area. By default, the parameter is
    false, which means that the absolute value is returned.
     */


overload->addOverload("imgproc", "", "contourArea", {
	make_param<IOArray*>("contour","IOArray"),
	make_param<bool>("oriented","bool", false)
}, contourArea);
Nan::SetMethod(target, "contourArea", imgproc_general_callback::callback);

//interface IcontourArea{
//    (contour : _st.InputArray, oriented? : boolean /* = false*/): _st.double;
//}
//
//export var contourArea: IcontourArea = alvision_module.contourArea;

    //CV_EXPORTS_W double contourArea(contour : _st.InputArray, oriented : boolean /* = false*/);

    /** @brief Finds a rotated rectangle of the minimum area enclosing the input 2D point set.
    
    The function calculates and returns the minimum-area bounding rectangle (possibly rotated) for a
    specified point set. See the OpenCV sample minarea.cpp . Developer should keep in mind that the
    returned rotatedRect can contain negative indices when data is close to the containing Mat element
    boundary.
    
    @param points Input vector of 2D points, stored in std::vector\<\> or Mat
     */

overload->addOverload("imgproc", "", "minAreaRect", {
	make_param<IOArray*>("points","IOArray")
}, minAreaRect);
Nan::SetMethod(target, "minAreaRect", imgproc_general_callback::callback);


//interface IminAreaRect{
//    (points: _st.InputArray): _types.RotatedRect;
//}
//
//export var minAreaRect: IminAreaRect = alvision_module.minAreaRect;

    //CV_EXPORTS_W RotatedRect minAreaRect(points : _st.InputArray );

    /** @brief Finds the four vertices of a rotated rect. Useful to draw the rotated rectangle.
    
    The function finds the four vertices of a rotated rectangle. This function is useful to draw the
    rectangle. In C++, instead of using this function, you can directly use box.points() method. Please
    visit the [tutorial on bounding
    rectangle](http://docs.opencv.org/doc/tutorials/imgproc/shapedescriptors/bounding_rects_circles/bounding_rects_circles.html#bounding-rects-circles)
    for more information.
    
    @param box The input rotated rectangle. It may be the output of
    @param points The output array of four vertices of rectangles.
     */


overload->addOverload("imgproc", "", "boxPoints", {
	make_param<RotatedRect*>("box",RotatedRect::name), 
	make_param<IOArray*>("points","IOArray")
}, boxPoints);
Nan::SetMethod(target, "boxPoints", imgproc_general_callback::callback);

//interface IboxPoints{
//    (box : _types.RotatedRect, points : _st.OutputArray): void;
//}
//
//export var boxPoints: IboxPoints = alvision_module.boxPoints;

//    CV_EXPORTS_W void boxPoints(box : _types.RotatedRect, points : _st.OutputArray);

    /** @brief Finds a circle of the minimum area enclosing a 2D point set.
    
    The function finds the minimal enclosing circle of a 2D point set using an iterative algorithm. See
    the OpenCV sample minarea.cpp .
    
    @param points Input vector of 2D points, stored in std::vector\<\> or Mat
    @param center Output center of the circle.
    @param radius Output radius of the circle.
     */

overload->addOverload("imgproc", "", "minEnclosingCircle", {
	make_param<IOArray*>("points","IOArray"),
	make_param<std::shared_ptr<or::Callback>>("cb","Function")// : (center : _types.Point2f,radius : _st.float) = > void
}, minEnclosingCircle);
Nan::SetMethod(target, "minEnclosingCircle", imgproc_general_callback::callback);

//interface IminEnclosingCircle{
//    (points: _st.InputArray, cb: (center: _types.Point2f,radius : _st.float) => void): void;
//}
//
//export var minEnclosingCircle: IminEnclosingCircle = alvision_module.minEnclosingCircle;

//    CV_EXPORTS_W void minEnclosingCircle(points : _st.InputArray,
//        CV_OUT Point2f& center, CV_OUT float& radius);

    /** @example minarea.cpp
      */

    /** @brief Finds a triangle of minimum area enclosing a 2D point set and returns its area.
    
    The function finds a triangle of minimum area enclosing the given set of 2D points and returns its
    area. The output for a given 2D point set is shown in the image below. 2D points are depicted in
    *red* and the enclosing triangle in *yellow*.
    
    ![Sample output of the minimum enclosing triangle function](pics/minenclosingtriangle.png)
    
    The implementation of the algorithm is based on O'Rourke's @cite ORourke86 and Klee and Laskowski's
    @cite KleeLaskowski85 papers. O'Rourke provides a \f$\theta(n)\f$ algorithm for finding the minimal
    enclosing triangle of a 2D convex polygon with n vertices. Since the minEnclosingTriangle function
    takes a 2D point set as input an additional preprocessing step of computing the convex hull of the
    2D point set is required. The complexity of the convexHull function is \f$O(n log(n))\f$ which is higher
    than \f$\theta(n)\f$. Thus the overall complexity of the function is \f$O(n log(n))\f$.
    
    @param points Input vector of 2D points with depth CV_32S or CV_32F, stored in std::vector\<\> or Mat
    @param triangle Output vector of three 2D points defining the vertices of the triangle. The depth
    of the OutputArray must be CV_32F.
     */

overload->addOverload("imgproc", "", "minEnclosingTriangle", {
	make_param<IOArray*>("points","IOArray"),
	make_param<IOArray*>("triangle","IOArray")
}, minEnclosingTriangle);
Nan::SetMethod(target, "minEnclosingTriangle", imgproc_general_callback::callback);

//interface IminEnclosingTriangle {
//    (points: _st.InputArray , triangle : _st.OutputArray): _st.double;
//}
//
//export var minEnclosingTriangle: IminEnclosingTriangle = alvision_module.minEnclosingTriangle;

//CV_EXPORTS_W double minEnclosingTriangle(InputArray points, CV_OUT OutputArray triangle );

    /** @brief Compares two shapes.
    
    The function compares two shapes. All three implemented methods use the Hu invariants (see cv::HuMoments)
    
    @param contour1 First contour or grayscale image.
    @param contour2 Second contour or grayscale image.
    @param method Comparison method, see ::ShapeMatchModes
    @param parameter Method-specific parameter (not supported now).
     */

overload->addOverload("imgproc", "", "matchShapes", {
	make_param<IOArray*>("contour1","IOArray"),
	make_param<IOArray*>("contour2","IOArray"),
	make_param<int>("method","ShapeMatchModes"),
	make_param<double>("parameter","double")
}, matchShapes);
Nan::SetMethod(target, "matchShapes", imgproc_general_callback::callback);

//interface ImatchShapes {
//    (contour1: _st.InputArray, contour2: _st.InputArray ,
//        method : _types.ShapeMatchModes, parameter : _st.double): _st.double;
//}
//
//export var matchShapes: ImatchShapes = alvision_module.matchShapes;

//CV_EXPORTS_W double matchShapes(InputArray contour1, InputArray contour2,
//    int method, double parameter );

    /** @example convexhull.cpp
    An example using the convexHull functionality
    */

    /** @brief Finds the convex hull of a point set.
    
    The functions find the convex hull of a 2D point set using the Sklansky's algorithm @cite Sklansky82
    that has *O(N logN)* complexity in the current implementation. See the OpenCV sample convexhull.cpp
    that demonstrates the usage of different function variants.
    
    @param points Input 2D point set, stored in std::vector or Mat.
    @param hull Output convex hull. It is either an integer vector of indices or vector of points. In
    the first case, the hull elements are 0-based indices of the convex hull points in the original
    array (since the set of convex hull points is a subset of the original point set). In the second
    case, hull elements are the convex hull points themselves.
    @param clockwise Orientation flag. If it is true, the output convex hull is oriented clockwise.
    Otherwise, it is oriented counter-clockwise. The assumed coordinate system has its X axis pointing
    to the right, and its Y axis pointing upwards.
    @param returnPoints Operation flag. In case of a matrix, when the flag is true, the function
    returns convex hull points. Otherwise, it returns indices of the convex hull points. When the
    output array is std::vector, the flag is ignored, and the output depends on the type of the
    vector: std::vector\<int\> implies returnPoints=true, std::vector\<Point\> implies
    returnPoints=false.
     */

overload->addOverload("imgproc", "", "convexHull", {
	make_param<IOArray*>("points","IOArray"),
	make_param<IOArray*>(  "hull","IOArray"),
	make_param<bool>("clockwise","bool", false),
	make_param<bool>("returnPoints","bool", true)
}, convexHull);
Nan::SetMethod(target, "convexHull", imgproc_general_callback::callback);

//interface IconvexHull{
//    (points: _st.InputArray, hull: _st.OutputArray ,
//        clockwise? : boolean /*= false*/, returnPoints? : boolean /*= true*/): void;
//}
//
//export var convexHull: IconvexHull = alvision_module.convexHull;

//    CV_EXPORTS_W void convexHull(points : _st.InputArray, OutputArray hull,
//        bool clockwise = false, bool returnPoints = true);

    /** @brief Finds the convexity defects of a contour.
    
    The figure below displays convexity defects of a hand contour:
    
    ![image](pics/defects.png)
    
    @param contour Input contour.
    @param convexhull Convex hull obtained using convexHull that should contain indices of the contour
    points that make the hull.
    @param convexityDefects The output vector of convexity defects. In C++ and the new Python/Java
    interface each convexity defect is represented as 4-element integer vector (a.k.a. cv::Vec4i):
    (start_index, end_index, farthest_pt_index, fixpt_depth), where indices are 0-based indices
    in the original contour of the convexity defect beginning, end and the farthest point, and
    fixpt_depth is fixed-point approximation (with 8 fractional bits) of the distance between the
    farthest contour point and the hull. That is, to get the floating-point value of the depth will be
    fixpt_depth/256.0.
     */

overload->addOverload("imgproc", "", "convexityDefects", {
	make_param<IOArray*>("contour","IOArray"),
	make_param<IOArray*>("convexhull","IOArray"),
	make_param<IOArray*>("convexityDefects","IOArray")
}, convexityDefects);
Nan::SetMethod(target, "convexityDefects", imgproc_general_callback::callback);

//interface IconvexityDefects {
//    (contour: _st.InputArray, convexhull: _st.InputArray, convexityDefects: _st.OutputArray  ): void;
//}
//
//export var convexityDefects: IconvexityDefects = alvision_module.convexityDefects;

    //CV_EXPORTS_W void convexityDefects(contour : _st.InputArray, InputArray convexhull, OutputArray convexityDefects );

    /** @brief Tests a contour convexity.
    
    The function tests whether the input contour is convex or not. The contour must be simple, that is,
    without self-intersections. Otherwise, the function output is undefined.
    
    @param contour Input vector of 2D points, stored in std::vector\<\> or Mat
     */

overload->addOverload("imgproc", "", "isContourConvex", {
	make_param<IOArray*>("contour","IOArray")
}, isContourConvex);
Nan::SetMethod(target, "isContourConvex", imgproc_general_callback::callback);


//interface IisContourConvex {
//    (contour: _st.InputArray): boolean;
//}
//
//export var isContourConvex: IisContourConvex = alvision_module.isContourConvex;

//    CV_EXPORTS_W bool isContourConvex(contour : _st.InputArray );

    //! finds intersection of two convex polygons

overload->addOverload("imgproc", "", "intersectConvexConvex", {
	make_param<IOArray*>( "_p1","IOArray"),
	make_param<IOArray*>( "_p2","IOArray"),
	make_param<IOArray*>("_p12","IOArray"), 
	make_param<bool>("handleNested","bool", true)
}, intersectConvexConvex);
Nan::SetMethod(target, "intersectConvexConvex", imgproc_general_callback::callback);

//interface IintersectConvexConvex {
//    (_p1: _st.InputArray, _p2: _st.InputArray ,
//        _p12: _st.OutputArray , handleNested : boolean /* = true*/): _st.float;
//}
//
//export var intersectConvexConvex: IintersectConvexConvex = alvision_module.intersectConvexConvex;

//    CV_EXPORTS_W float intersectConvexConvex(InputArray _p1, InputArray _p2,
//        OutputArray _p12, bool handleNested = true);

    /** @example fitellipse.cpp
      An example using the fitEllipse technique
    */

    /** @brief Fits an ellipse around a set of 2D points.
    
    The function calculates the ellipse that fits (in a least-squares sense) a set of 2D points best of
    all. It returns the rotated rectangle in which the ellipse is inscribed. The first algorithm described by @cite Fitzgibbon95
    is used. Developer should keep in mind that it is possible that the returned
    ellipse/rotatedRect data contains negative indices, due to the data points being close to the
    border of the containing Mat element.
    
    @param points Input 2D point set, stored in std::vector\<\> or Mat
     */


overload->addOverload("imgproc", "", "fitEllipse", {
	make_param<IOArray*>("points","IOArray")
}, fitEllipse);
Nan::SetMethod(target, "fitEllipse", imgproc_general_callback::callback);

//interface IfitEllipse{
//    (points: _st.InputArray): _types.RotatedRect;
//}
//
//export var fitEllipse: IfitEllipse = alvision_module.fitEllipse;

//    CV_EXPORTS_W RotatedRect fitEllipse(points : _st.InputArray );

    /** @brief Fits a line to a 2D or 3D point set.
    
    The function fitLine fits a line to a 2D or 3D point set by minimizing \f$\sum_i \rho(r_i)\f$ where
    \f$r_i\f$ is a distance between the \f$i^{th}\f$ point, the line and \f$\rho(r)\f$ is a distance function, one
    of the following:
    -  DIST_L2
    \f[\rho (r) = r^2/2  \quad \text{(the simplest and the fastest least-squares method)}\f]
    - DIST_L1
    \f[\rho (r) = r\f]
    - DIST_L12
    \f[\rho (r) = 2  \cdot ( \sqrt{1 + \frac{r^2}{2}} - 1)\f]
    - DIST_FAIR
    \f[\rho \left (r \right ) = C^2  \cdot \left (  \frac{r}{C} -  \log{\left(1 + \frac{r}{C}\right)} \right )  \quad \text{where} \quad C=1.3998\f]
    - DIST_WELSCH
    \f[\rho \left (r \right ) =  \frac{C^2}{2} \cdot \left ( 1 -  \exp{\left(-\left(\frac{r}{C}\right)^2\right)} \right )  \quad \text{where} \quad C=2.9846\f]
    - DIST_HUBER
    \f[\rho (r) =  \fork{r^2/2}{if \(r < C\)}{C \cdot (r-C/2)}{otherwise} \quad \text{where} \quad C=1.345\f]
    
    The algorithm is based on the M-estimator ( <http://en.wikipedia.org/wiki/M-estimator> ) technique
    that iteratively fits the line using the weighted least-squares algorithm. After each iteration the
    weights \f$w_i\f$ are adjusted to be inversely proportional to \f$\rho(r_i)\f$ .
    
    @param points Input vector of 2D or 3D points, stored in std::vector\<\> or Mat.
    @param line Output line parameters. In case of 2D fitting, it should be a vector of 4 elements
    (like Vec4f) - (vx, vy, x0, y0), where (vx, vy) is a normalized vector collinear to the line and
    (x0, y0) is a point on the line. In case of 3D fitting, it should be a vector of 6 elements (like
    Vec6f) - (vx, vy, vz, x0, y0, z0), where (vx, vy, vz) is a normalized vector collinear to the line
    and (x0, y0, z0) is a point on the line.
    @param distType Distance used by the M-estimator, see cv::DistanceTypes
    @param param Numerical parameter ( C ) for some types of distances. If it is 0, an optimal value
    is chosen.
    @param reps Sufficient accuracy for the radius (distance between the coordinate origin and the line).
    @param aeps Sufficient accuracy for the angle. 0.01 would be a good default value for reps and aeps.
     */

overload->addOverload("imgproc", "", "fitLine", {
	make_param<IOArray*>("points","IOArray"),
	make_param<IOArray*>("line","IOArray"),
	make_param<int>("distType","int"),
	make_param<double>("param","double"), 
	make_param<double>("reps","double"), 
	make_param<double>("aeps","double")
}, fitLine);
Nan::SetMethod(target, "fitLine", imgproc_general_callback::callback);

//interface IfitLine{
//    (points: _st.InputArray, line: _st.OutputArray , distType: _st.int,
//        param: _st.double, reps: _st.double, aeps: _st.double  ): void;
//}
//
//export var fitLine: IfitLine = alvision_module.fitLine;

//    CV_EXPORTS_W void fitLine(points : _st.InputArray, OutputArray line, distType : _st.int,
//        double param, double reps, double aeps );

    /** @brief Performs a point-in-contour test.
    
    The function determines whether the point is inside a contour, outside, or lies on an edge (or
    coincides with a vertex). It returns positive (inside), negative (outside), or zero (on an edge)
    value, correspondingly. When measureDist=false , the return value is +1, -1, and 0, respectively.
    Otherwise, the return value is a signed distance between the point and the nearest contour edge.
    
    See below a sample output of the function where each image pixel is tested against the contour:
    
    ![sample output](pics/pointpolygon.png)
    
    @param contour Input contour.
    @param pt Point tested against the contour.
    @param measureDist If true, the function estimates the signed distance from the point to the
    nearest contour edge. Otherwise, the function only checks if the point is inside a contour or not.
     */

overload->addOverload("imgproc", "", "pointPolygonTest", {
	make_param<IOArray*>("contour","IOArray"),
	make_param<Point2f*>("pt",Point2f::name) , 
	make_param<bool>("measureDist","bool")
}, pointPolygonTest);
Nan::SetMethod(target, "pointPolygonTest", imgproc_general_callback::callback);

//interface IpointPolygonTest{
//    (contour: _st.InputArray, pt: _types.Point2f , measureDist : boolean ): _st.double;
//}
//
//export var pointPolygonTest: IpointPolygonTest = alvision_module.pointPolygonTest;

//    CV_EXPORTS_W double pointPolygonTest(contour : _st.InputArray, Point2f pt, bool measureDist );

    /** @brief Finds out if there is any intersection between two rotated rectangles.
    
    If there is then the vertices of the interesecting region are returned as well.
    
    Below are some examples of intersection configurations. The hatched pattern indicates the
    intersecting region and the red vertices are returned by the function.
    
    ![intersection examples](pics/intersection.png)
    
    @param rect1 First rectangle
    @param rect2 Second rectangle
    @param intersectingRegion The output array of the verticies of the intersecting region. It returns
    at most 8 vertices. Stored as std::vector\<cv::Point2f\> or cv::Mat as Mx1 of type CV_32FC2.
    @returns One of cv::RectanglesIntersectTypes
     */
overload->addOverload("imgproc", "", "rotatedRectangleIntersection", {
	make_param<RotatedRect*>("rect1","RotatedRect"),
	make_param<RotatedRect*>("rect2","RotatedRect"),
	make_param<IOArray*>("intersectingRegion","IOArray")
}, rotatedRectangleIntersection);
Nan::SetMethod(target, "rotatedRectangleIntersection", imgproc_general_callback::callback);


//interface IrotatedRectangleIntersection{
//    (rect1: _types.RotatedRect, rect2: _types.RotatedRect, intersectingRegion: _st.OutputArray  ): _st.int;
//}
//
//export var rotatedRectangleIntersection: IrotatedRectangleIntersection = alvision_module.rotatedRectangleIntersection;

//    CV_EXPORTS_W int rotatedRectangleIntersection( const RotatedRect& rect1, const RotatedRect& rect2, OutputArray intersectingRegion  );

    //! @} imgproc_shape


overload->addOverload("imgproc", "", "createCLAHE", {
	make_param<double>("clipLimit","double", 40.0),
	make_param<Size*>("tileGridSize",Size::name, Size::create(8, 8))
}, createCLAHE);
Nan::SetMethod(target, "createCLAHE", imgproc_general_callback::callback);

//interface IcreateCLAHE{
//    (clipLimit?: _st.double /*= 40.0*/, tileGridSize?: _types.Size /* = Size(8, 8)*/) : CLAHE
//}
//
//export var createCLAHE: IcreateCLAHE = alvision_module.createCLAHE;

//    CV_EXPORTS_W Ptr< CLAHE > createCLAHE(clipLimit : _st.double = 40.0, Size tileGridSize = Size(8, 8));

    //! Ballard, D.H. (1981). Generalizing the Hough transform to detect arbitrary shapes. Pattern Recognition 13 (2): 111-122.
    //! Detects position only without traslation and rotation

overload->addOverload("imgproc", "", "createGeneralizedHoughBallard", {}, createGeneralizedHoughBallard);
Nan::SetMethod(target, "createGeneralizedHoughBallard", imgproc_general_callback::callback);

//export var createGeneralizedHoughBallard: () => GeneralizedHoughBallard = alvision_module.createGeneralizedHoughBallard;

    //CV_EXPORTS Ptr< GeneralizedHoughBallard > createGeneralizedHoughBallard();

    //! Guil, N., González-Linares, J.M. and Zapata, E.L. (1999). Bidimensional shape detection using an invariant approach. Pattern Recognition 32 (6): 1025-1038.
    //! Detects position, traslation and rotation
overload->addOverload("imgproc", "", "createGeneralizedHoughGuil", {}, createGeneralizedHoughGuil);
Nan::SetMethod(target, "createGeneralizedHoughGuil", imgproc_general_callback::callback);

//export var createGeneralizedHoughGuil: () => GeneralizedHoughGuil = alvision_module.createGeneralizedHoughGuil;
//    CV_EXPORTS Ptr< GeneralizedHoughGuil > createGeneralizedHoughGuil();

    //! Performs linear blending of two images

overload->addOverload("imgproc", "", "blendLinear", {
	make_param<IOArray*>("src1","IOArray"),
	make_param<IOArray*>("src2","IOArray"), 
	make_param<IOArray*>("weights1","IOArray"),
	make_param<IOArray*>("weights2","IOArray"),
	make_param<IOArray*>("dst","IOArray")
}, blendLinear);
Nan::SetMethod(target, "blendLinear", imgproc_general_callback::callback);

    //interface IblendLinear {
    //    (src1: _st.InputArray, src2: _st.InputArray, weights1 : _st.InputArray, weights2 : _st.InputArray, dst: //_st.OutputArray): void;
    //}
	//
    //export var blendLinear: IblendLinear = alvision_module.blendLinear;

    //CV_EXPORTS void blendLinear(src : _st.InputArray1, src : _st.InputArray2, weights1 : _st.InputArray, weights2 : _st.InputArray, dst : _st.OutputArray);

    //! @addtogroup imgproc_colormap
    //! @{


auto ColormapTypes = CreateNamedObject(target, "ColormapTypes");
SetObjectProperty(ColormapTypes, "COLORMAP_AUTUMN", 0);
SetObjectProperty(ColormapTypes, "COLORMAP_BONE", 1);
SetObjectProperty(ColormapTypes, "COLORMAP_JET", 2);
SetObjectProperty(ColormapTypes, "COLORMAP_WINTER", 3);
SetObjectProperty(ColormapTypes, "COLORMAP_RAINBOW", 4);
SetObjectProperty(ColormapTypes, "COLORMAP_OCEAN", 5);
SetObjectProperty(ColormapTypes, "COLORMAP_SUMMER", 6);
SetObjectProperty(ColormapTypes, "COLORMAP_SPRING", 7);
SetObjectProperty(ColormapTypes, "COLORMAP_COOL", 8);
SetObjectProperty(ColormapTypes, "COLORMAP_HSV", 9);
SetObjectProperty(ColormapTypes, "COLORMAP_PINK", 10);
SetObjectProperty(ColormapTypes, "COLORMAP_HOT", 11);
SetObjectProperty(ColormapTypes, "COLORMAP_PARULA", 12);
overload->add_type_alias("ColormapTypes", "int");


    /** @brief Applies a GNU Octave/MATLAB equivalent colormap on a given image.
    
    @param src The source image, grayscale or colored does not matter.
    @param dst The result is the colormapped source image. Note: Mat::create is called on dst.
    @param colormap The colormap to apply, see cv::ColormapTypes
     */


	overload->addOverload("imgproc", "", "applyColorMap", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"), 
		make_param<int>("colormap","ColormapTypes")
	}, applyColorMap);
	Nan::SetMethod(target, "applyColorMap", imgproc_general_callback::callback);


//    interface IapplyColorMap{
//        (src: _st.InputArray, dst: _st.OutputArray, colormap: ColormapTypes): void;
//    }
//
//export var applyColorMap: IapplyColorMap = alvision_module.applyColorMap;

//    CV_EXPORTS_W void applyColorMap(src : _st.InputArray, dst : _st.OutputArray, colormap : _st.int);

    //! @} imgproc_colormap

    //! @addtogroup imgproc_draw
    //! @{

    /** @brief Draws a line segment connecting two points.
    
    The function line draws the line segment between pt1 and pt2 points in the image. The line is
    clipped by the image boundaries. For non-antialiased lines with integer coordinates, the 8-connected
    or 4-connected Bresenham algorithm is used. Thick lines are drawn with rounding endings. Antialiased
    lines are drawn using Gaussian filtering.
    
    @param img Image.
    @param pt1 First point of the line segment.
    @param pt2 Second point of the line segment.
    @param color Line color.
    @param thickness Line thickness.
    @param lineType Type of the line, see cv::LineTypes.
    @param shift Number of fractional bits in the point coordinates.
     */


overload->addOverload("imgproc", "", "line", {
	make_param<IOArray*>("img","IOArray"),
	make_param<Point*>("pt1",Point::name), 
	make_param<Point*>("pt2",Point::name), 
	make_param<Scalar*>("color",Scalar::name),
	make_param<int>("thickness","int", 1),
	make_param<int>("lineType","LineTypes", cv:: LINE_8),
	make_param<int>("shift","int", 0)
}, line);
	Nan::SetMethod(target, "line", imgproc_general_callback::callback);

//    interface Iline{
//        (img: _st.InputOutputArray, pt1: _types.Point, pt2: _types.Point, color: _types.Scalar,
//            thickness?: _st.int /*= 1*/, lineType?: _core.LineTypes /* = LINE_8*/, shift?: _st.int /* = 0*/): void;
//}
//
//export var line: Iline = alvision_module.line;

    //CV_EXPORTS_W void line(img : InputOutputArray, pt1 : _types.Point, pt2 : _types.Point, color : _types.Scalar,
    //    thickness : _st.int = 1, lineType?: _core.LineTypes /* = LINE_8*/, shift : _st.int /* = 0*/);

    /** @brief Draws a arrow segment pointing from the first point to the second one.
    
    The function arrowedLine draws an arrow between pt1 and pt2 points in the image. See also cv::line.
    
    @param img Image.
    @param pt1 The point the arrow starts from.
    @param pt2 The point the arrow points to.
    @param color Line color.
    @param thickness Line thickness.
    @param line_type Type of the line, see cv::LineTypes
    @param shift Number of fractional bits in the point coordinates.
    @param tipLength The length of the arrow tip in relation to the arrow length
     */


overload->addOverload("imgproc", "", "arrowedLine", {
	make_param<IOArray*>("img","IOArray"),
	make_param<Point*>("pt1",Point::name), 
	make_param<Point*>("pt2",Point::name), 
	make_param<Scalar*>("color",Scalar::name),
	make_param<int>("thickness","int", 1),
	make_param<int>("lineType","LineTypes", 8),
	make_param<int>("shift","int", 0),
	make_param<double>("tipLength","double", 0.1)
}, arrowedLine);
	Nan::SetMethod(target, "arrowedLine", imgproc_general_callback::callback);

//interface IarrowedLine{
//    (img: _st.InputOutputArray, pt1: _types.Point, pt2: _types.Point, color: _types.Scalar,
//        thickness?: _st.int /*= 1*/, lineType?: _core.LineTypes /* = 8*/, shift? : _st.int /* = 0*/, tipLength? : //_st.double /* = 0.1 */): void;
//}
//
//export var arrowedLine: IarrowedLine = alvision_module.arrowedLine;

//    CV_EXPORTS_W void arrowedLine(img : InputOutputArray, pt1 : _types.Point, pt2 : _types.Point, color : _types.Scalar,
//        thickness : _st.int= 1, line_type : _st.int /* = 8*/, shift : _st.int /* = 0*/, tipLength : _st.double /* = 0.1 */);

    /** @brief Draws a simple, thick, or filled up-right rectangle.
    
    The function rectangle draws a rectangle outline or a filled rectangle whose two opposite corners
    are pt1 and pt2.
    
    @param img Image.
    @param pt1 Vertex of the rectangle.
    @param pt2 Vertex of the rectangle opposite to pt1 .
    @param color Rectangle color or brightness (grayscale image).
    @param thickness Thickness of lines that make up the rectangle. Negative values, like CV_FILLED ,
    mean that the function has to draw a filled rectangle.
    @param lineType Type of the line. See the line description.
    @param shift Number of fractional bits in the point coordinates.
     */

//    interface Irectangle {
//        (img: _st.InputOutputArray, pt1 : _types.Point, pt2 : _types.Point,
//            color: _types.Scalar, thickness?: _st.int /*= 1*/,
//            lineType?: _core.LineTypes /* = LINE_8*/, shift?: _st.int /* = 0*/): void;
//    }

//export var rectangle: Irectangle = alvision_module.rectangle;

//    CV_EXPORTS_W void rectangle(img : InputOutputArray, pt1 : _types.Point, pt2 : _types.Point,
//                          color : _types.Scalar, thickness : _st.int = 1,
//        lineType?: _core.LineTypes /* = LINE_8*/, shift : _st.int /* = 0*/);

    /** @overload
    
    use `rec` parameter as alternative specification of the drawn rectangle: `r.tl() and
    r.br()-Point(1,1)` are opposite corners
    */

overload->addOverload("imgproc", "", "rectangle", {
	make_param<Matrix*>("img","Mat"),
	make_param<Rect*>("rec",Rect::name),
	make_param<Scalar*>("color",Scalar::name), 
	make_param<int>("thickness","int", 1),
	make_param<int>("lineType","LineTypes",cv:: LINE_8),
	make_param<int>("shift","int", 0)
}, rectangle);
	Nan::SetMethod(target, "rectangle", imgproc_general_callback::callback);

overload->addOverload("imgproc", "", "rectangle", {
	make_param<IOArray*>("img","IOArray"),
	make_param<Point*>("pt1",Point::name), 
	make_param<Point*>("pt2",Point::name),
	make_param<Scalar*>("color",Scalar::name), 
	make_param<int>("thickness","int", 1),
	make_param<int>("lineType","LineTypes",cv:: LINE_8),
	make_param<int>("shift","int", 0)
}, rectangle_points);

//    interface Irectangle {
//        (img: _mat.Mat, rec : _types.Rect,
//            color: _types.Scalar, thickness?: _st.int /*= 1*/,
//            lineType?: _core.LineTypes /* = LINE_8*/, shift?: _st.int /* = 0*/): void;
//
//        (img: _st.InputOutputArray, pt1: _types.Point, pt2: _types.Point,
//            color: _types.Scalar, thickness?: _st.int /*= 1*/,
//            lineType?: _core.LineTypes /* = LINE_8*/, shift?: _st.int /* = 0*/): void;
//    }
//
//export var rectangle: Irectangle = alvision_module.rectangle;

//    CV_EXPORTS void rectangle(img : _mat.Mat, rec : _types.Rect,
//                          color : _types.Scalar, thickness : _st.int = 1,
//        lineType?: _core.LineTypes /* = LINE_8*/, shift : _st.int /* = 0*/);

    /** @brief Draws a circle.
    
    The function circle draws a simple or filled circle with a given center and radius.
    @param img Image where the circle is drawn.
    @param center Center of the circle.
    @param radius Radius of the circle.
    @param color Circle color.
    @param thickness Thickness of the circle outline, if positive. Negative thickness means that a
    filled circle is to be drawn.
    @param lineType Type of the circle boundary. See the line description.
    @param shift Number of fractional bits in the coordinates of the center and in the radius value.
     */

overload->addOverload("imgproc", "", "circle", {
	make_param<IOArray*>("img","IOArray"),
	make_param<Point*>("center",Point::name), 
	make_param<int>("radius","int"),
	make_param<Scalar*>("color",Scalar::name), 
	make_param<int>("thickness","int", 1),
	make_param<int>("lineType","LineTypes",cv::LINE_8),
	make_param<int>("shift","int", 0)
}, circle);
Nan::SetMethod(target, "circle", imgproc_general_callback::callback);

//    interface Icircle{
//        (img: _st.InputOutputArray, center: _types.Point, radius : _st.int,
//        color: _types.Scalar, thickness?: _st.int /*= 1*/,
//        lineType?: _core.LineTypes /* = LINE_8*/, shift?: _st.int /* = 0*/): void;
//    }
//
//export var circle: Icircle = alvision_module.circle;

//    CV_EXPORTS_W void circle(img : InputOutputArray, center : _types.Point, radius : _st.int,
//                       color : _types.Scalar, thickness : _st.int = 1,
//        lineType?: _core.LineTypes /* = LINE_8*/, shift : _st.int /* = 0*/);

    /** @brief Draws a simple or thick elliptic arc or fills an ellipse sector.
    
    The functions ellipse with less parameters draw an ellipse outline, a filled ellipse, an elliptic
    arc, or a filled ellipse sector. A piecewise-linear curve is used to approximate the elliptic arc
    boundary. If you need more control of the ellipse rendering, you can retrieve the curve using
    ellipse2Poly and then render it with polylines or fill it with fillPoly . If you use the first
    variant of the function and want to draw the whole ellipse, not an arc, pass startAngle=0 and
    endAngle=360 . The figure below explains the meaning of the parameters.
    
    ![Parameters of Elliptic Arc](pics/ellipse.png)
    
    @param img Image.
    @param center Center of the ellipse.
    @param axes Half of the size of the ellipse main axes.
    @param angle Ellipse rotation angle in degrees.
    @param startAngle Starting angle of the elliptic arc in degrees.
    @param endAngle Ending angle of the elliptic arc in degrees.
    @param color Ellipse color.
    @param thickness Thickness of the ellipse arc outline, if positive. Otherwise, this indicates that
    a filled ellipse sector is to be drawn.
    @param lineType Type of the ellipse boundary. See the line description.
    @param shift Number of fractional bits in the coordinates of the center and values of axes.
     */

//    interface Iellipse{
//        (img: _st.InputOutputArray, center: _types.Point, axes: _types.Size,
//            angle: _st.double, startAngle: _st.double, endAngle: _st.double,
//            color: _types.Scalar, thickness?: _st.int /*= 1*/,
//            lineType?: _core.LineTypes  /* = LINE_8*/, shift?: _st.int /* = 0*/): void;
//    }

//export var ellipse: Iellipse = alvision_module.ellipse;

//    CV_EXPORTS_W void ellipse(img : InputOutputArray, center : _types.Point, axes : _types.Size,
//        angle : _st.double, startAngle : _st.double, endAngle : _st.double,
//                        color : _types.Scalar, thickness : _st.int = 1,
//        lineType?: _core.LineTypes /* = LINE_8*/, shift : _st.int /* = 0*/);

    /** @overload
    @param img Image.
    @param box Alternative ellipse representation via RotatedRect. This means that the function draws
    an ellipse inscribed in the rotated rectangle.
    @param color Ellipse color.
    @param thickness Thickness of the ellipse arc outline, if positive. Otherwise, this indicates that
    a filled ellipse sector is to be drawn.
    @param lineType Type of the ellipse boundary. See the line description.
    */

overload->addOverload("imgproc", "", "ellipse", {
	make_param<IOArray*>("img","IOArray"),
	make_param<RotatedRect*>("box",RotatedRect::name),
	make_param<Scalar*>("color",Scalar::name),
	make_param<int>("thickness","int", 1),
	make_param<int>("lineType","LineTypes",cv:: LINE_8)
}, ellipse);
Nan::SetMethod(target, "ellipse", imgproc_general_callback::callback);

overload->addOverload("imgproc", "", "ellipse", {
	make_param<IOArray*>("img","IOArray"),
	make_param<Point*>("center",Point::name), 
	make_param<Size*>("axes",Size::name),
	make_param<double>("angle","double"), 
	make_param<double>("startAngle","double"), 
	make_param<double>("endAngle","double"),
	make_param<Scalar*>("color",Scalar::name),
	make_param<int>("thickness","int", 1),
	make_param<int>("lineType","LineTypes",cv:: LINE_8),
	make_param<int>("shift","int",0)
}, ellipse_center);

//    interface Iellipse{
//        (img: _st.InputOutputArray, box: _types.RotatedRect, color: _types.Scalar,
//            thickness?: _st.int /*= 1*/, lineType?: _core.LineTypes  /* = LINE_8*/): void;
//        (img: _st.InputOutputArray, center: _types.Point, axes: _types.Size,
//            angle: _st.double, startAngle: _st.double, endAngle: _st.double,
//            color: _types.Scalar, thickness?: _st.int /*= 1*/,
//            lineType?: _core.LineTypes  /* = LINE_8*/, shift?: _st.int /* = 0*/): void;
//    }
//
//export var ellipse: Iellipse = alvision_module.ellipse;

//    CV_EXPORTS_W void ellipse(img : InputOutputArray, box : _types.RotatedRect, color : _types.Scalar,
//        thickness : _st.int = 1, lineType?: _core.LineTypes /* = LINE_8*/);

    /* ----------------------------------------------------------------------------------------- */
    /* ADDING A SET OF PREDEFINED MARKERS WHICH COULD BE USED TO HIGHLIGHT POSITIONS IN AN IMAGE */
    /* ----------------------------------------------------------------------------------------- */
auto MarkerTypes = CreateNamedObject(target, "MarkerTypes");
SetObjectProperty(MarkerTypes, "MARKER_CROSS", 0);
SetObjectProperty(MarkerTypes, "MARKER_TILTED_CROSS", 1);
SetObjectProperty(MarkerTypes, "MARKER_STAR", 2);
SetObjectProperty(MarkerTypes, "MARKER_DIAMOND", 3);
SetObjectProperty(MarkerTypes, "MARKER_SQUARE", 4);
SetObjectProperty(MarkerTypes, "MARKER_TRIANGLE_UP", 5);
SetObjectProperty(MarkerTypes, "MARKER_TRIANGLE_DOWN", 6);


    /** @brief Draws a marker on a predefined position in an image.
    
    The function drawMarker draws a marker on a given position in the image. For the moment several
    marker types are supported, see cv::MarkerTypes for more information.
    
    @param img Image.
    @param position The point where the crosshair is positioned.
    @param color Line color.
    @param markerType The specific type of marker you want to use, see cv::MarkerTypes
    @param thickness Line thickness.
    @param line_type Type of the line, see cv::LineTypes
    @param markerSize The length of the marker axis [default = 20 pixels]
     */


	overload->addOverload("imgproc", "", "drawMarker", {
		make_param<Matrix*>("img","Mat"), 
		make_param<Point*>("position",Point::name), 
		make_param<Scalar*>("color",Scalar::name),
		make_param<int>("markerType","int",cv:: MARKER_CROSS),
		make_param<int>("markerSize","int", 20),
		make_param<int>( "thickness","int",1),
		make_param<int>( "line_type","int", 8)
	}, drawMarker);
	Nan::SetMethod(target, "drawMarker", imgproc_general_callback::callback);

//    interface IdrawMarker{
//        (img: _mat.Mat, position: _types.Point, color: _types.Scalar,
//            markerType: _st.int /* = MARKER_CROSS*/, markerSize: _st.int /* = 20*/, thickness: _st.int /*= 1*/,
//            line_type: _st.int /* = 8*/): void;
//    }
//
//export var drawMarker: IdrawMarker = alvision_module.drawMarker;

//    CV_EXPORTS_W void drawMarker(img : _mat.Mat, position : _types.Point, color : _types.Scalar,
//        markerType : _st.int /* = MARKER_CROSS*/, markerSize : _st.int /* = 20*/, thickness : _st.int= 1,
//        line_type : _st.int /* = 8*/);

    /* ----------------------------------------------------------------------------------------- */
    /* END OF MARKER SECTION */
    /* ----------------------------------------------------------------------------------------- */

    /** @overload */

//    interface IfillConvexPoly{
//        (img: _mat.Mat, pts : Array<_types.Point>,
//            color: _types.Scalar, lineType?: _core.LineTypes  /* = LINE_8*/,
//            shift?: _st.int /* = 0*/): void;
//    }

//export var fillConvexPoly: IfillConvexPoly = alvision_module.fillConvexPoly;

//    CV_EXPORTS void fillConvexPoly(img : _mat.Mat, const Point* pts, int npts,
//    color : _types.Scalar, lineType?: _core.LineTypes /* = LINE_8*/,
//        shift : _st.int /* = 0*/);

    /** @brief Fills a convex polygon.
    
    The function fillConvexPoly draws a filled convex polygon. This function is much faster than the
    function cv::fillPoly . It can fill not only convex polygons but any monotonic polygon without
    self-intersections, that is, a polygon whose contour intersects every horizontal line (scan line)
    twice at the most (though, its top-most and/or the bottom edge could be horizontal).
    
    @param img Image.
    @param points Polygon vertices.
    @param color Polygon color.
    @param lineType Type of the polygon boundaries. See the line description.
    @param shift Number of fractional bits in the vertex coordinates.
     */


overload->addOverload("imgproc", "", "fillConvexPoly", {
	make_param<IOArray*>("img","IOArray"),
	make_param<IOArray*>("points","IOArray"),
	make_param<Scalar*>("color",Scalar::name), 
	make_param<int>("lineType","LineTypes",cv:: LINE_8),
	make_param<int>("shift","int", 0)
},fillConvexPoly );
	Nan::SetMethod(target, "fillConvexPoly", imgproc_general_callback::callback);

overload->addOverload("imgproc", "", "fillConvexPoly", {
	make_param<Matrix*>("img","Mat"),
	make_param<std::shared_ptr<std::vector<Point*>>>("pts","Array<Point>"),
	make_param<Scalar*>("color",Scalar::name), 
	make_param<int>("lineType","LineTypes",cv:: LINE_8),
	make_param<int>("shift","int", 0)
},fillConvexPoly_mat );

//    interface IfillConvexPoly{
//        (img: _st.InputOutputArray, points: _st.InputArray,
//            color: _types.Scalar, lineType?: _core.LineTypes  /* = LINE_8*/,
//            shift?: _st.int /* = 0*/): void;
//
//        (img: _mat.Mat, pts: Array<_types.Point>,
//            color: _types.Scalar, lineType?: _core.LineTypes  /* = LINE_8*/,
//            shift?: _st.int /* = 0*/): void;
//    }
//
//export var fillConvexPoly: IfillConvexPoly = alvision_module.fillConvexPoly;

//    CV_EXPORTS_W void fillConvexPoly(img : InputOutputArray, points : _st.InputArray,
//                                 color : _types.Scalar, lineType?: _core.LineTypes /* = LINE_8*/,
//        shift : _st.int /* = 0*/);

    /** @overload */

//    interface IfillPoly{
//        (img: _mat.Mat, pts : Array<Array<_types.Point>>, /*ncontours: _st.int,*/
//            color: _types.Scalar, lineType?: _core.LineTypes  /* = LINE_8*/, shift?: _st.int /* = 0*/,
//        offset?: _types.Point /* = Point()*/): void;
//    }

//export var fillPoly: IfillPoly = alvision_module.fillPoly;

//    CV_EXPORTS void fillPoly(img : _mat.Mat, const Point** pts,
//    const int* npts, ncontours : _st.int,
//    color : _types.Scalar, lineType?: _core.LineTypes /* = LINE_8*/, shift : _st.int /* = 0*/,
//        offset : _types.Point /* = Point()*/ );

    /** @brief Fills the area bounded by one or more polygons.
    
    The function fillPoly fills an area bounded by several polygonal contours. The function can fill
    complex areas, for example, areas with holes, contours with self-intersections (some of their
    parts), and so forth.
    
    @param img Image.
    @param pts Array of polygons where each polygon is represented as an array of points.
    @param color Polygon color.
    @param lineType Type of the polygon boundaries. See the line description.
    @param shift Number of fractional bits in the vertex coordinates.
    @param offset Optional offset of all points of the contours.
     */

overload->addOverload("imgproc", "", "fillPoly", {
	make_param<IOArray*>("img","IOArray"),
	make_param<IOArray*>("pts","IOArray"),
	make_param<Scalar*>("color",Scalar::name), 
	make_param<int>("lineType","LineTypes",cv:: LINE_8),
	make_param<int>("shift","int" , 0),
	make_param<Point*>("offset",Point::name, Point::create())
}, fillPoly);
Nan::SetMethod(target, "fillPoly", imgproc_general_callback::callback);

overload->addOverload("imgproc", "", "fillPoly", {
	make_param<Matrix*>("img","Mat"),
	make_param<std::shared_ptr<std::vector<std::shared_ptr<std::vector<Point*>>>>>("pts","Array<Array<Point>>"), /*ncontours: _st.int,*/
	make_param<Scalar*>("color",Scalar::name),
	make_param<int>("lineType","LineTypes",cv:: LINE_8),
	make_param<int>("shift","int",0),
	make_param<Point*>("offset",Point::name,Point::create())
}, fillPoly_mat);

//
//    interface IfillPoly {
//        (img: _st.InputOutputArray, pts: _st.InputArrayOfArrays,
//            color: _types.Scalar, lineType?: _core.LineTypes  /* = LINE_8*/, shift?: _st.int /* = 0*/,
//            offset?: _types.Point /* = Point()*/): void;
//
//        (img: _mat.Mat, pts: Array<Array<_types.Point>>, /*ncontours: _st.int,*/
//            color: _types.Scalar, lineType?: _core.LineTypes  /* = LINE_8*/, shift?: _st.int /* = 0*/,
//            offset?: _types.Point /* = Point()*/): void;
//    }
//
//export var fillPoly: IfillPoly = alvision_module.fillPoly;

//    CV_EXPORTS_W void fillPoly(img : InputOutputArray, pts : _st.InputArrayOfArrays,
//                           color : _types.Scalar, lineType?: _core.LineTypes /* = LINE_8*/, shift : _st.int /* = 0*/,
//        offset : _types.Point /* = Point()*/ );

    /** @overload */

//    interface Ipolylines{
//        (img : _mat.Mat, pts : Array<_types.Point>,
//        ncontours : _st.int, isClosed: boolean, color: _types.Scalar,
//        thickness?: _st.int /*= 1*/, lineType?: _core.LineTypes  /* = LINE_8*/, shift?: _st.int /* = 0*/ ) : void;
//    }
//export var polylines: Ipolylines = alvision_module.polyLines;

//    CV_EXPORTS void polylines(img : _mat.Mat, const Point* const* pts, const int* npts,
//        ncontours : _st.int, isClosed : boolean, color : _types.Scalar,
//            thickness : _st.int = 1, lineType?: _core.LineTypes /* = LINE_8*/, shift : _st.int /* = 0*/ );

    /** @brief Draws several polygonal curves.
    
    @param img Image.
    @param pts Array of polygonal curves.
    @param isClosed Flag indicating whether the drawn polylines are closed or not. If they are closed,
    the function draws a line from the last vertex of each curve to its first vertex.
    @param color Polyline color.
    @param thickness Thickness of the polyline edges.
    @param lineType Type of the line segments. See the line description.
    @param shift Number of fractional bits in the vertex coordinates.
    
    The function polylines draws one or more polygonal curves.
     */

overload->addOverload("imgproc", "", "polylines", {
	make_param<IOArray*>("img","IOArray"),
	make_param<IOArray*>("pts","IOArray"),
	make_param<bool>("isClosed","bool"),
	make_param<Scalar*>("color",Scalar::name),
	make_param<int>("thickness","int", 1),
	make_param<int>("lineType","LineTypes",cv:: LINE_8),
	make_param<int>("shift","int", 0)
},polylines );
Nan::SetMethod(target, "polylines", imgproc_general_callback::callback);

overload->addOverload("imgproc", "", "polylines", {
	make_param<Matrix*>("img","Mat"),
	make_param<std::shared_ptr<std::vector<Point*>>>("pts","Array<Point>"),
	make_param<int>("ncontours","int"),
	make_param<bool>("isClosed","bool"),
	make_param<Scalar*>("color",Scalar::name),
	make_param<int>("thickness","int", 1),
	make_param<int>("lineType","LineTypes",cv:: LINE_8),
	make_param<int>("shift","int", 0)
},polylines_mat );

//    interface Ipolylines{
//        (img: _st.InputOutputArray, pts : _st.InputArrayOfArrays,
//        isClosed : boolean, color: _types.Scalar,
//        thickness?: _st.int /*= 1*/, lineType?: _core.LineTypes  /* = LINE_8*/, shift? : _st.int /* = 0*/): void;
//
//        (img: _mat.Mat, pts: Array<_types.Point>,
//            ncontours: _st.int, isClosed: boolean, color: _types.Scalar,
//            thickness?: _st.int /*= 1*/, lineType?: _core.LineTypes  /* = LINE_8*/, shift?: _st.int /* = 0*/): void;
//    }
//
//export var polylines: Ipolylines = alvision_module.polylines;

 //   CV_EXPORTS_W void polylines(img : InputOutputArray, pts : _st.InputArrayOfArrays,
 //       isClosed : boolean, color : _types.Scalar,
 //           thickness : _st.int = 1, lineType?: _core.LineTypes /* = LINE_8*/, shift : _st.int /* = 0*/ );

    /** @example contours2.cpp
      An example using the drawContour functionality
    */

    /** @example segment_objects.cpp
    An example using drawContours to clean up a background segmentation result
     */

    /** @brief Draws contours outlines or filled contours.
    
    The function draws contour outlines in the image if \f$\texttt{thickness} \ge 0\f$ or fills the area
    bounded by the contours if \f$\texttt{thickness}<0\f$ . The example below shows how to retrieve
    connected components from the binary image and label them: :
    @code
        #include "opencv2/imgproc.hpp"
        #include "opencv2/highgui.hpp"
    
        using namespace cv;
        using namespace std;
    
        int main( int argc, char** argv )
        {
            Mat src;
            // the first command-line parameter must be a filename of the binary
            // (black-n-white) image
            if( argc != 2 || !(src=imread(argv[1], 0)).data)
                return -1;
    
            Mat dst = Mat::zeros(src.rows, src.cols, CV_8UC3);
    
            src = src > 1;
            namedWindow( "Source", 1 );
            imshow( "Source", src );
    
            vector<vector<Point> > contours;
            vector<Vec4i> hierarchy;
    
            findContours( src, contours, hierarchy,
                RETR_CCOMP, CHAIN_APPROX_SIMPLE );
    
            // iterate through all the top-level contours,
            // draw each connected component with its own random color
            int idx = 0;
            for( ; idx >= 0; idx = hierarchy[idx][0] )
            {
                color : _types.Scalar( rand()&255, rand()&255, rand()&255 );
                drawContours( dst, contours, idx, color, FILLED, 8, hierarchy );
            }
    
            namedWindow( "Components", 1 );
            imshow( "Components", dst );
            waitKey(0);
        }
    @endcode
    
    @param image Destination image.
    @param contours All the input contours. Each contour is stored as a point vector.
    @param contourIdx Parameter indicating a contour to draw. If it is negative, all the contours are drawn.
    @param color Color of the contours.
    @param thickness Thickness of lines the contours are drawn with. If it is negative (for example,
    thickness=CV_FILLED ), the contour interiors are drawn.
    @param lineType Line connectivity. See cv::LineTypes.
    @param hierarchy Optional information about hierarchy. It is only needed if you want to draw only
    some of the contours (see maxLevel ).
    @param maxLevel Maximal level for drawn contours. If it is 0, only the specified contour is drawn.
    If it is 1, the function draws the contour(s) and all the nested contours. If it is 2, the function
    draws the contours, all the nested contours, all the nested-to-nested contours, and so on. This
    parameter is only taken into account when there is hierarchy available.
    @param offset Optional contour shift parameter. Shift all the drawn contours by the specified
    \f$\texttt{offset}=(dx,dy)\f$ .
     */

overload->addOverload("imgproc", "", "drawContours", {
	make_param<IOArray*>("image","IOArray"),
	make_param<IOArray*>("contours","IOArray"),
	make_param<int>("contourIdx","int"),
	make_param<Scalar*>("color",Scalar::name),
	make_param<int>("thickness","int", 1),
	make_param<int>("lineType","LineTypes",cv:: LINE_8),
	make_param<IOArray*>("hierarchy","IOArray", IOArray::noArray()),
	make_param<int>("maxLevel","int", INT_MAX),
	make_param<Point*>("offset",Point::name, Point::create())
}, drawContours);
Nan::SetMethod(target, "drawContours", imgproc_general_callback::callback);


//        interface IdrawContours {
//            (image: _st.InputOutputArray, contours : _st.InputArrayOfArrays,
//                contourIdx : _st.int, color : _types.Scalar,
//                thickness?: _st.int /*= 1*/, lineType?: _core.LineTypes  /* = LINE_8*/,
//                hierarchy? : _st.InputArray /* = noArray()*/,
//                maxLevel? : _st.int /* =  INT_MAX*/, offset? : _types.Point /* = Point()*/): void;
//    }
//
//export var drawContours: IdrawContours = alvision_module.drawContours;

//    CV_EXPORTS_W void drawContours(image : _st.InputOutputArray, contours : _st.InputArrayOfArrays,
//        contourIdx : _st.int, color : _types.Scalar,
//            thickness : _st.int = 1, lineType?: _core.LineTypes /* = LINE_8*/,
//            hierarchy : _st.InputArray /* = noArray()*/,
//            maxLevel : _st.int /* =  INT_MAX*/, offset : _types.Point /* = Point()*/ );

    /** @brief Clips the line against the image rectangle.
    
    The functions clipLine calculate a part of the line segment that is entirely within the specified
    rectangle. They return false if the line segment is completely outside the rectangle. Otherwise,
    they return true .
    @param imgSize Image size. The image rectangle is Rect(0, 0, imgSize.width, imgSize.height) .
    @param pt1 First line point.
    @param pt2 Second line point.
     */

overload->addOverload("imgproc", "", "clipLine", {
	make_param<Size*>("imgSize",Size::name), 
	make_param<Point*>("pt1",Point::name),
		make_param<Point*>("pt2",Point::name),
		make_param<std::shared_ptr< or ::Callback>>("cb","Function")// ? : (pt1 : _types.Point, pt2 : _types.Point) = > void
},clipLine_size );
Nan::SetMethod(target, "clipLine", imgproc_general_callback::callback);

overload->addOverload("imgproc", "", "clipLine", {
	make_param<Rect*>("imgRect",Rect::name),
	make_param<Point*>("pt1",Point::name), 
	make_param<Point*>("pt2",Point::name), 
	make_param<std::shared_ptr<or::Callback>>("cb","Function")// ? : (pt1 : _types.Point, pt2 : _types.Point) = > void

},clipLine_rect );

//        interface IclipLine{
//            (imgSize: _types.Size, pt1: _types.Point, pt2: _types.Point, cb?: (pt1: _types.Point, pt2: _types.Point) => void): boolean;
//            (imgRect: _types.Rect, pt1: _types.Point, pt2: _types.Point, cb?: (pt1: _types.Point, pt2: _types.Point) => void): boolean;
//
//        }
//
//export var clipLine: IclipLine = alvision_module.clipLine;

    //CV_EXPORTS bool clipLine(imgSize : _types.Size, CV_IN_OUT Point& pt1, CV_IN_OUT Point& pt2);

    /** @overload
    @param imgRect Image rectangle.
    @param pt1 First line point.
    @param pt2 Second line point.
    */
//interface IclipLine {
//    (imgRect: _types.Rect, pt1: _types.Point, pt2: _types.Point, cb?: (pt1: _types.Point, pt2: _types.Point) => void): boolean;
//    }

//export var clipLine: IclipLine = alvision_module.clipLine;

    //CV_EXPORTS_W bool clipLine(imgRect : _types.Rect, CV_OUT CV_IN_OUT Point& pt1, CV_OUT CV_IN_OUT Point& pt2);

    /** @brief Approximates an elliptic arc with a polyline.
    
    The function ellipse2Poly computes the vertices of a polyline that approximates the specified
    elliptic arc. It is used by cv::ellipse.
    
    @param center Center of the arc.
    @param axes Half of the size of the ellipse main axes. See the ellipse for details.
    @param angle Rotation angle of the ellipse in degrees. See the ellipse for details.
    @param arcStart Starting angle of the elliptic arc in degrees.
    @param arcEnd Ending angle of the elliptic arc in degrees.
    @param delta Angle between the subsequent polyline vertices. It defines the approximation
    accuracy.
    @param pts Output vector of polyline vertices.
     */


overload->addOverload("imgproc", "", "ellipse2Poly", {
		make_param<Point*>("center",Point::name), 
		make_param<Size*>("axes",Size::name), 
		make_param<int>("angle","int"),
		make_param<int>("arcStart","int"), 
		make_param<int>("arcEnd","int"), 
		make_param<int>("delta","int"),
		make_param<std::shared_ptr<or::Callback>>("cb","Function")// : (pts : Array<_types.Point>) = > void
}, ellipse2Poly);
Nan::SetMethod(target, "ellipse2Poly", imgproc_general_callback::callback);

//    interface Iellipse2Poly{
//        (center : _types.Point, axes : _types.Size, angle : _st.int,
//        arcStart : _st.int, arcEnd : _st.int, delta : _st.int,
//        cb: (pts: Array<_types.Point>) => void) : void;
//    }
//
//export var ellipse2Poly: Iellipse2Poly = alvision_module.ellipse2Poly;


//    CV_EXPORTS_W void ellipse2Poly(center : _types.Point, axes : _types.Size, angle : _st.int,
//        arcStart : _st.int, arcEnd : _st.int, delta : _st.int,
//        CV_OUT std::vector<Point>& pts);

    /** @brief Draws a text string.
    
    The function putText renders the specified text string in the image. Symbols that cannot be rendered
    using the specified font are replaced by question marks. See getTextSize for a text rendering code
    example.
    
    @param img Image.
    @param text Text string to be drawn.
    @param org Bottom-left corner of the text string in the image.
    @param fontFace Font type, see cv::HersheyFonts.
    @param fontScale Font scale factor that is multiplied by the font-specific base size.
    @param color Text color.
    @param thickness Thickness of the lines used to draw a text.
    @param lineType Line type. See the line for details.
    @param bottomLeftOrigin When true, the image data origin is at the bottom-left corner. Otherwise,
    it is at the top-left corner.
     */


overload->addOverload("imgproc", "", "putText", {
	make_param<IOArray*>("img","IOArray"),
	make_param<std::string>("text","String"),
	make_param<Point*>("org",Point::name),
	make_param<int>("fontFace","int"),
	make_param<double>("fontScale","double"), 
	make_param<Scalar*>("color",Scalar::name),
	make_param<int>("thickness","int", 1),
	make_param<int>("lineType","LineTypes",cv::LINE_8),
	make_param<bool>("bottomLeftOrigin","bool", false)
}, putText);
Nan::SetMethod(target, "putText", imgproc_general_callback::callback);

//    interface IputText {
//        (img : _st.InputOutputArray, text: string, org : _types.Point,
//            fontFace: _st.int, fontScale: _st.double, color : _types.Scalar,
//            thickness?: _st.int /* = 1*/, lineType?: _core.LineTypes /* = LINE_8*/,
//            bottomLeftOrigin? : boolean /* = false*/): void;
//    }
//
//export var putText: IputText = alvision_module.putText;

//    CV_EXPORTS_W void putText(img : InputOutputArray, text : string, org : _types.Point,
//        fontFace : _st.int, fontScale : _st.double, color : _types.Scalar,
//        thickness : _st.int = 1, lineType?: _core.LineTypes /* = LINE_8*/,
//        bottomLeftOrigin : boolean /* = false*/ );

    /** @brief Calculates the width and height of a text string.
    
    The function getTextSize calculates and returns the size of a box that contains the specified text.
    That is, the following code renders some text, the tight box surrounding it, and the baseline: :
    @code
        String text = "Funny text inside the box";
        fontFace : _st.int = FONT_HERSHEY_SCRIPT_SIMPLEX;
        fontScale : _st.double = 2;
        thickness : _st.int = 3;
    
        Mat img(600, 800, CV_8UC3, Scalar::all(0));
    
        int baseline=0;
        Size textSize = getTextSize(text, fontFace,
                                    fontScale, thickness, &baseline);
        baseline += thickness;
    
        // center the text
        Point textOrg((img.cols - textSize.width)/2,
                      (img.rows + textSize.height)/2);
    
        // draw the box
        rectangle(img, textOrg + Point(0, baseline),
                  textOrg + Point(textSize.width, -textSize.height),
                  Scalar(0,0,255));
        // ... and the baseline first
        line(img, textOrg + Point(0, thickness),
             textOrg + Point(textSize.width, thickness),
             Scalar(0, 0, 255));
    
        // then put the text itself
        putText(img, text, textOrg, fontFace, fontScale,
                Scalar::all(255), thickness, 8);
    @endcode
    
    @param text Input text string.
    @param fontFace Font to use, see cv::HersheyFonts.
    @param fontScale Font scale factor that is multiplied by the font-specific base size.
    @param thickness Thickness of lines used to render the text. See putText for details.
    @param[out] baseLine y-coordinate of the baseline relative to the bottom-most text
    point.
    @return The size of a box that contains the specified text.
    
    @see cv::putText
     */

overload->addOverload("imgproc", "", "getTextSize", {
	make_param<std::string>("text","String"),
	make_param<int>("fontFace","HersheyFonts"),
	make_param<double>("fontScale","double"), 
	make_param<int>("thickness","int"),
	make_param<std::shared_ptr<or::Callback>>("cb","Function")// : (baseLine : _st.int) = > void
}, getTextSize);
Nan::SetMethod(target, "getTextSize", imgproc_general_callback::callback);

//    interface IgetTextSize{
//        (text: string, fontFace: _core.HersheyFonts |  _st.int,
//        fontScale: _st.double, thickness: _st.int,
//        cb: (baseLine: _st.int) => void): _types.Size;
//    }
//
//export var getTextSize: IgetTextSize = alvision_module.getTextSize;

//    CV_EXPORTS_W Size getTextSize(text : string, fontFace : _st.int,
//        fontScale : _st.double, thickness : _st.int,
//        CV_OUT int* baseLine);

LineIterator::Init(target, overload);

target->Set(Nan::New("CV_FILLED").ToLocalChecked(), Nan::New(-1));
//export const CV_FILLED = -1;


/** Connected component structure */
//export class ConnectedComp
//{
//    public area: _st.double ;    /**<area of the connected component  */
//    public value: _types.Scalar ; /**<average color of the connected component */
//    public rect: _types.Rect ;    /**<ROI of the component  */
//    public contour: any;//CvSeq ; /**<optional component boundary (the contour might have child contours corresponding /to /the holes)*/
//}

target->Set(Nan::New("CV_CANNY_L2_GRADIENT").ToLocalChecked(), Nan::New((1 << 31)));
//export const CV_CANNY_L2_GRADIENT = (1 << 31);

auto ShapeOrientation = CreateNamedObject(target, "ShapeOrientation");
SetObjectProperty(ShapeOrientation, "CLOCKWISE", 1);
SetObjectProperty(ShapeOrientation, "COUNTER_CLOCKWISE", 2);















}



 POLY_METHOD(imgproc::createLineSegmentDetector){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::getGaussianKernel){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::getDerivKernels) { throw std::exception("not implemented"); }
 POLY_METHOD(imgproc::getGaborKernel){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::morphologyDefaultBorderValue){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::getStructuringElement){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::medianBlur){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::GaussianBlur){
	 auto src			=info.at<IOArray*>(0)->GetInputArray();
	 auto dst			=info.at<IOArray*>(1)->GetOutputArray();
	 auto ksize			=info.at<Size*>(2)->_size;
	 auto sigmaX		=info.at<double>(3);
	 auto sigmaY		=info.at<double>(4);
	 auto borderType	= info.at<int>(5);
	 
	 cv::GaussianBlur(
		 src,
		 dst,
		 *ksize,
		 sigmaX,
		 sigmaY,
		 borderType);
 }
 POLY_METHOD(imgproc::bilateralFilter){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::boxFilter){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::sqrBoxFilter){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::blur){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::filter2D){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::sepFilter2D){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::Sobel){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::spatialGradient){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::Scharr){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::Laplacian){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::Canny){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::cornerMinEigenVal){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::cornerHarris){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::cornerEigenValsAndVecs){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::preCornerDetect){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::cornerSubPix){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::goodFeaturesToTrack){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::HoughLines){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::HoughLinesP){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::HoughCircles){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::erode){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::dilate){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::morphologyEx){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::resize){
	 auto src			= info.at<IOArray*>(0)->GetInputArray();
	 auto dst			= info.at<IOArray*>(1)->GetOutputArray();
	 auto dsize			= *info.at<Size*>(2)->_size;
	 auto fx			= info.at<double>(3);
	 auto fy			= info.at<double>(4);
	 auto interpolation = info.at<int>(5);

	 cv::resize(src, dst, dsize, fx, fy, interpolation);
 }
 POLY_METHOD(imgproc::warpAffine){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::warpPerspective){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::remap){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::convertMaps){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::getRotationMatrix2D){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::invertAffineTransform){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::getPerspectiveTransform_mat){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::getPerspectiveTransform_point){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::getAffineTransform_mat){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::getAffineTransform_point){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::getRectSubPix){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::logPolar) { throw std::exception("not implemented"); }
 POLY_METHOD(imgproc::linearPolar){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::integral_tilted){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::integral_squared){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::integral){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::accumulate){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::accumulateSquare){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::accumulateProduct){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::accumulateWeighted){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::phaseCorrelate){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::createHanningWindow){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::threshold){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::adaptiveThreshold){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::pyrDown){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::pyrUp){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::buildPyramid){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::undistort){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::initUndistortRectifyMap){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::initWideAngleProjMap){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::getDefaultNewCameraMatrix){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::undistortPoints){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::calcHist_array){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::calcHist_sparsemat){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::calcHist_mat){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::calcBackProject){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::calcBackProject_sparsemat){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::calcBackProject_arrayofarrays){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::compareHist){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::compareHist_sparsemat){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::equalizeHist){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::EMD){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::watershed){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::pyrMeanShiftFiltering){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::grabCut){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::distanceTransform){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::distanceTransform_labels){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::floodFill_mask){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::floodFill){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::cvtColor){
		auto src	= info.at<IOArray*>(0)->GetInputArray();
		auto dst	= info.at<IOArray*>(1)->GetOutputArray();
		auto code	= info.at<int>(2);
		auto dstCn  = info.at<int>(3);
		
		cv::cvtColor(src, dst, code, dstCn);
 }
 POLY_METHOD(imgproc::demosaicing){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::moments){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::HuMoments_array){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::HuMoments){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::matchTemplate){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::connectedComponents){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::connectedComponentsWithStats){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::findContours_hierarchy){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::findContours){throw std::exception("not implemented");}
 
POLY_METHOD(imgproc::approxPolyDP){
	auto curve			= info.at<IOArray*>(0)->GetInputArray();
	auto approxCurve	= info.at<IOArray*>(1)->GetOutputArray();
	auto epsilon		= info.at<double>(2) ;
	auto closed			= info.at<bool>(3) ;

	cv::approxPolyDP(curve, approxCurve, epsilon, closed);
 }

 POLY_METHOD(imgproc::arcLength){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::boundingRect){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::contourArea){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::minAreaRect){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::boxPoints){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::minEnclosingCircle){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::minEnclosingTriangle){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::matchShapes){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::convexHull){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::convexityDefects){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::isContourConvex){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::intersectConvexConvex){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::fitEllipse){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::fitLine){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::pointPolygonTest){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::rotatedRectangleIntersection){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::createCLAHE){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::createGeneralizedHoughBallard){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::createGeneralizedHoughGuil){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::blendLinear){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::applyColorMap){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::line){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::arrowedLine){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::rectangle){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::rectangle_points){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::circle){
	 auto img		=info.at<IOArray*>(0)->GetInputOutputArray();
	 auto center	=info.at<Point*>(1)->_point;
	 auto radius	=info.at<int>(2);
	 auto color		=info.at<Scalar*>(3)->_scalar;
	 auto thickness =info.at<int>(4);
	 auto lineType	=info.at<int>(5);
	 auto shift		=info.at<int>(6);
	 cv::circle(img, *center, radius, *color, thickness, lineType, shift);

 }
 POLY_METHOD(imgproc::ellipse){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::ellipse_center){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::drawMarker){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::fillConvexPoly){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::fillConvexPoly_mat){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::fillPoly){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::fillPoly_mat){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::polylines){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::polylines_mat){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::drawContours){
		auto image		= info.at<IOArray*>(0)->GetInputOutputArray();
		auto contours	= info.at<IOArray*>(1)->GetInputArrayOfArrays();
		auto contourIdx = info.at<int>(2);
		auto color		= *info.at<Scalar*>(3)->_scalar;
		auto thickness	= info.at<int>(4);
		auto lineType	= info.at<int>(5);
		auto hierarchy	= info.at<IOArray*>(6)->GetInputArray();
		auto maxLevel	= info.at<int>(7);
		auto offset		= *info.at<Point*>(8)->_point;

		cv::drawContours(
			image,
			contours,
			contourIdx,
			color,
			thickness,
			lineType,
			hierarchy,
			maxLevel,
			offset
		);
}
 POLY_METHOD(imgproc::clipLine_size){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::clipLine_rect){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::ellipse2Poly){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::putText){throw std::exception("not implemented");}
 POLY_METHOD(imgproc::getTextSize){throw std::exception("not implemented");}
