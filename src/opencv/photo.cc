#include "photo.h"
#include "IOArray.h"
#include "Matrix.h"
#include "types/Point.h"

#include "photo/AlignExposures.h"
#include "photo/AlignMTB.h"
#include "photo/CalibrateCRF.h"
#include "photo/CalibrateDebevec.h"
#include "photo/CalibrateRobertson.h"
#include "photo/MergeDebevec.h"
#include "photo/MergeExposures.h"
#include "photo/MergeMertens.h"
#include "photo/MergeRobertson.h"
#include "photo/Tonemap.h"
#include "photo/TonemapDrago.h"
#include "photo/TonemapDurand.h"
#include "photo/TonemapMantiuk.h"
#include "photo/TonemapReinhard.h"

namespace photo_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("photo_general_callback is empty");
		}
		return overload->execute("photo", info);
	}
}

void
photo::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	photo_general_callback::overload = overload;

	auto INPAINT = CreateNamedObject(target, "INPAINT");
	SetObjectProperty(INPAINT, "INPAINT_NS", cv::INPAINT_NS);
	SetObjectProperty(INPAINT, "INPAINT_TELEA", cv::INPAINT_TELEA);
	overload->add_type_alias("INPAINT", "int");

	auto CLONING_METHOD = CreateNamedObject(target, "CLONING_METHOD");
	SetObjectProperty(CLONING_METHOD, "NORMAL_CLONE", cv::NORMAL_CLONE);
	SetObjectProperty(CLONING_METHOD, "MIXED_CLONE", cv::MIXED_CLONE);
	SetObjectProperty(CLONING_METHOD, "MONOCHROME_TRANSFER", cv::MONOCHROME_TRANSFER);
	overload->add_type_alias("CLONING_METHOD", "int");

	auto EDGE_PRESERVING_FILTER = CreateNamedObject(target, "EDGE_PRESERVING_FILTER");
	SetObjectProperty(EDGE_PRESERVING_FILTER, "RECURS_FILTER", cv::RECURS_FILTER);
	SetObjectProperty(EDGE_PRESERVING_FILTER, "NORMCONV_FILTER", cv::NORMCONV_FILTER);
	overload->add_type_alias("EDGE_PRESERVING_FILTER", "int");


	/** @brief Restores the selected region in an image using the region neighborhood.

	@param src Input 8-bit 1-channel or 3-channel image.
	@param inpaintMask Inpainting mask, 8-bit 1-channel image. Non-zero pixels indicate the area that
	needs to be inpainted.
	@param dst Output image with the same size and type as src .
	@param inpaintRadius Radius of a circular neighborhood of each point inpainted that is considered
	by the algorithm.
	@param flags Inpainting method that could be one of the following:
	-   **INPAINT_NS** Navier-Stokes based method [Navier01]
	-   **INPAINT_TELEA** Method by Alexandru Telea @cite Telea04 .

	The function reconstructs the selected image area from the pixel near the area boundary. The
	function may be used to remove dust and scratches from a scanned photo, or to remove undesirable
	objects from still images or video. See <http://en.wikipedia.org/wiki/Inpainting> for more details.

	@note
	-   An example using the inpainting technique can be found at
	opencv_source_code/samples/cpp/inpaint.cpp
	-   (Python) An example using the inpainting technique can be found at
	opencv_source_code/samples/python/inpaint.py
	*/

	overload->addOverload("photo", "", "inpaint", {
		make_param<IOArray*>("src","InputArray"),
		make_param<IOArray*>("inpaintMask","InputArray"),
		make_param<IOArray*>("dst","OutputArray"),
		make_param<double>("inpaintRadius","double"),
		make_param<int>("flags","INPAINT")
	}, inpaint);
	Nan::SetMethod(target, "inpaint", photo_general_callback::callback);

//	interface Iinpaint {
//		(src : _st.InputArray, inpaintMask : _st.InputArray,
//			dst : _st.OutputArray, inpaintRadius : _st.double, flags : INPAINT) : void;
//	}
//
//	export var inpaint : Iinpaint = alvision_module.inpaint;

	//CV_EXPORTS_W void inpaint(InputArray src, InputArray inpaintMask,
	//    OutputArray dst, double inpaintRadius, int flags );

	//! @addtogroup photo_denoise
	//! @{

	/** @brief Perform image denoising using Non-local Means Denoising algorithm
	<http://www.ipol.im/pub/algo/bcm_non_local_means_denoising/> with several computational
	optimizations. Noise expected to be a gaussian white noise

	@param src Input 8-bit 1-channel, 2-channel, 3-channel or 4-channel image.
	@param dst Output image with the same size and type as src .
	@param templateWindowSize Size in pixels of the template patch that is used to compute weights.
	Should be odd. Recommended value 7 pixels
	@param searchWindowSize Size in pixels of the window that is used to compute weighted average for
	given pixel. Should be odd. Affect performance linearly: greater searchWindowsSize - greater
	denoising time. Recommended value 21 pixels
	@param h Parameter regulating filter strength. Big h value perfectly removes noise but also
	removes image details, smaller h value preserves details but also preserves some noise

	This function expected to be applied to grayscale images. For colored images look at
	fastNlMeansDenoisingColored. Advanced usage of this functions can be manual denoising of colored
	image in different colorspaces. Such approach is used in fastNlMeansDenoisingColored by converting
	image to CIELAB colorspace and then separately denoise L and AB components with different h
	parameter.
	*/

	//interface IfastNlMeansDenoising {
	//    (src: _st.InputArray, dst: _st.OutputArray , h? : _st.float /*= 3*/,
	//        templateWindowSize? :_st.int /*= 7*/, searchWindowSize? : _st.int /*= 21*/): void;
	//}
	//export var fastNlMeansDenoising: IfastNlMeansDenoising = alvision_module.fastNlMeansDenoising;

	//    CV_EXPORTS_W void fastNlMeansDenoising(InputArray src, OutputArray dst, float h = 3,
	//        int templateWindowSize = 7, int searchWindowSize = 21);

	/** @brief Perform image denoising using Non-local Means Denoising algorithm
	<http://www.ipol.im/pub/algo/bcm_non_local_means_denoising/> with several computational
	optimizations. Noise expected to be a gaussian white noise

	@param src Input 8-bit or 16-bit (only with NORM_L1) 1-channel,
	2-channel, 3-channel or 4-channel image.
	@param dst Output image with the same size and type as src .
	@param templateWindowSize Size in pixels of the template patch that is used to compute weights.
	Should be odd. Recommended value 7 pixels
	@param searchWindowSize Size in pixels of the window that is used to compute weighted average for
	given pixel. Should be odd. Affect performance linearly: greater searchWindowsSize - greater
	denoising time. Recommended value 21 pixels
	@param h Array of parameters regulating filter strength, either one
	parameter applied to all channels or one per channel in dst. Big h value
	perfectly removes noise but also removes image details, smaller h
	value preserves details but also preserves some noise
	@param normType Type of norm used for weight calculation. Can be either NORM_L2 or NORM_L1

	This function expected to be applied to grayscale images. For colored images look at
	fastNlMeansDenoisingColored. Advanced usage of this functions can be manual denoising of colored
	image in different colorspaces. Such approach is used in fastNlMeansDenoisingColored by converting
	image to CIELAB colorspace and then separately denoise L and AB components with different h
	parameter.
	*/

	overload->addOverload("photo", "", "fastNlMeansDenoising", {
		make_param<IOArray*>("src","InputArray"),
		make_param<IOArray*>("dst","OutputArray"),
		make_param<std::shared_ptr<std::vector<float>>>("h","Array<float>"),
		make_param<int>("templateWindowSize","int", 7),
		make_param<int>("searchWindowSize","int",21),
		make_param<int>("normType","NormTypes",cv:: NORM_L2)
	}, fastNlMeansDenoising_h_arr);

	Nan::SetMethod(target, "fastNlMeansDenoising", photo_general_callback::callback);

	overload->addOverload("photo", "", "fastNlMeansDenoising", {
		make_param<IOArray*>("src","InputArray"),
		make_param<IOArray*>("dst","OutputArray"),
		make_param<float>("h","float", 3),
		make_param<int>("templateWindowSize","int", 7),
		make_param<int>("searchWindowSize","int", 21)
	}, fastNlMeansDenoising);

//	interface IfastNlMeansDenoising {
//		(src : _st.InputArray, dst : _st.OutputArray,
//			h : Array<_st.float>,
//			templateWindowSize ? : _st.int /* = 7*/, searchWindowSize ? : _st.int /* = 21*/,
//			normType ? : _base.NormTypes /* = NORM_L2*/) : void;
//
//		(src : _st.InputArray, dst : _st.OutputArray, h ? : _st.float /*= 3*/,
//			templateWindowSize ? : _st.int /*= 7*/, searchWindowSize ? : _st.int /*= 21*/) : void;
//	}
//	export var fastNlMeansDenoising : IfastNlMeansDenoising = alvision_module.fastNlMeansDenoising;

	//    CV_EXPORTS_W void fastNlMeansDenoising(InputArray src, OutputArray dst,
	//                                        const std::vector<float>& h,
	//        int templateWindowSize = 7, int searchWindowSize = 21,
	//        int normType = NORM_L2);

	/** @brief Modification of fastNlMeansDenoising function for colored images

	@param src Input 8-bit 3-channel image.
	@param dst Output image with the same size and type as src .
	@param templateWindowSize Size in pixels of the template patch that is used to compute weights.
	Should be odd. Recommended value 7 pixels
	@param searchWindowSize Size in pixels of the window that is used to compute weighted average for
	given pixel. Should be odd. Affect performance linearly: greater searchWindowsSize - greater
	denoising time. Recommended value 21 pixels
	@param h Parameter regulating filter strength for luminance component. Bigger h value perfectly
	removes noise but also removes image details, smaller h value preserves details but also preserves
	some noise
	@param hColor The same as h but for color components. For most images value equals 10
	will be enough to remove colored noise and do not distort colors

	The function converts image to CIELAB colorspace and then separately denoise L and AB components
	with given h parameters using fastNlMeansDenoising function.
	*/

	overload->addOverload("photo", "", "fastNlMeansDenoisingColored", {
		make_param<IOArray*>("src","InputArray"),
		make_param<IOArray*>("dst","OutputArray"),
		make_param<float>("h","float", 3),
		make_param<float>("hColor","float", 3),
		make_param<int>("templateWindowSize","int", 7),
		make_param<int>("searchWindowSize","int", 21)
	}, fastNlMeansDenoisingColored);

	Nan::SetMethod(target, "fastNlMeansDenoisingColored", photo_general_callback::callback);

//	interface IfastNlMeansDenoisingColored {
//		(src : _st.InputArray, dst : _st.OutputArray,
//			h ? : _st.float /*= 3*/, hColor ? : _st.float /* = 3*/,
//			templateWindowSize ? : _st.int /* = 7*/, searchWindowSize ? : _st.int /* = 21*/) : void;
//	}
//
//	export var fastNlMeansDenoisingColored : IfastNlMeansDenoisingColored = alvision_module.fastNlMeansDenoisingColored;

	//    CV_EXPORTS_W void fastNlMeansDenoisingColored(InputArray src, OutputArray dst,
	//        float h = 3, float hColor = 3,
	//        int templateWindowSize = 7, int searchWindowSize = 21);

	/** @brief Modification of fastNlMeansDenoising function for images sequence where consequtive images have been
	captured in small period of time. For example video. This version of the function is for grayscale
	images or for manual manipulation with colorspaces. For more details see
	<http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.131.6394>

	@param srcImgs Input 8-bit 1-channel, 2-channel, 3-channel or
	4-channel images sequence. All images should have the same type and
	size.
	@param imgToDenoiseIndex Target image to denoise index in srcImgs sequence
	@param temporalWindowSize Number of surrounding images to use for target image denoising. Should
	be odd. Images from imgToDenoiseIndex - temporalWindowSize / 2 to
	imgToDenoiseIndex - temporalWindowSize / 2 from srcImgs will be used to denoise
	srcImgs[imgToDenoiseIndex] image.
	@param dst Output image with the same size and type as srcImgs images.
	@param templateWindowSize Size in pixels of the template patch that is used to compute weights.
	Should be odd. Recommended value 7 pixels
	@param searchWindowSize Size in pixels of the window that is used to compute weighted average for
	given pixel. Should be odd. Affect performance linearly: greater searchWindowsSize - greater
	denoising time. Recommended value 21 pixels
	@param h Parameter regulating filter strength. Bigger h value
	perfectly removes noise but also removes image details, smaller h
	value preserves details but also preserves some noise
	*/

	//interface IfastNlMeansDenoisingMulti{
	//    (srcImgs: _st.InputArrayOfArrays, dst: _st.OutputArray ,
	//        imgToDenoiseIndex: _st.int, temporalWindowSize: _st.int ,
	//        h?: _st.float /*= 3*/, templateWindowSize?: _st.int /* = 7*/, searchWindowSize?: _st.int /* = 21*/);
	//}

	//export var fastNlMeansDenoisingMulti: IfastNlMeansDenoisingMulti = alvision_module.fastNlMeansDenoisingMulti;

	//    CV_EXPORTS_W void fastNlMeansDenoisingMulti(InputArrayOfArrays srcImgs, OutputArray dst,
	//        int imgToDenoiseIndex, int temporalWindowSize,
	//        float h = 3, int templateWindowSize = 7, int searchWindowSize = 21);

	/** @brief Modification of fastNlMeansDenoising function for images sequence where consequtive images have been
	captured in small period of time. For example video. This version of the function is for grayscale
	images or for manual manipulation with colorspaces. For more details see
	<http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.131.6394>

	@param srcImgs Input 8-bit or 16-bit (only with NORM_L1) 1-channel,
	2-channel, 3-channel or 4-channel images sequence. All images should
	have the same type and size.
	@param imgToDenoiseIndex Target image to denoise index in srcImgs sequence
	@param temporalWindowSize Number of surrounding images to use for target image denoising. Should
	be odd. Images from imgToDenoiseIndex - temporalWindowSize / 2 to
	imgToDenoiseIndex - temporalWindowSize / 2 from srcImgs will be used to denoise
	srcImgs[imgToDenoiseIndex] image.
	@param dst Output image with the same size and type as srcImgs images.
	@param templateWindowSize Size in pixels of the template patch that is used to compute weights.
	Should be odd. Recommended value 7 pixels
	@param searchWindowSize Size in pixels of the window that is used to compute weighted average for
	given pixel. Should be odd. Affect performance linearly: greater searchWindowsSize - greater
	denoising time. Recommended value 21 pixels
	@param h Array of parameters regulating filter strength, either one
	parameter applied to all channels or one per channel in dst. Big h value
	perfectly removes noise but also removes image details, smaller h
	value preserves details but also preserves some noise
	@param normType Type of norm used for weight calculation. Can be either NORM_L2 or NORM_L1
	*/

	overload->addOverload("photo", "", "fastNlMeansDenoisingMulti", {
		make_param<IOArray*>("srcImgs","InputArrayOfArrays"),
		make_param<IOArray*>("dst","OutputArray"),
		make_param<int>("imgToDenoiseIndex","int"),
		make_param<int>("temporalWindowSize","int"),
		make_param<std::shared_ptr<std::vector<float>>>("h","Array<float>"),
		make_param<int>("templateWindowSize","int", 7),
		make_param<int>("searchWindowSize","int", 21),
		make_param<int>("normType","NormTypes",cv:: NORM_L2)
	}, fastNlMeansDenoisingMulti_h_array);

	Nan::SetMethod(target, "fastNlMeansDenoisingMulti", photo_general_callback::callback);

	overload->addOverload("photo", "", "fastNlMeansDenoisingMulti", {
		make_param<IOArray*>("srcImgs","InputArrayOfArrays"),
		make_param<IOArray*>("dst","OutputArray"),
		make_param<int>("imgToDenoiseIndex","int"),
		make_param<int>("temporalWindowSize","int"),
		make_param<float>("h","float", 3),
		make_param<int>("templateWindowSize","int", 7),
		make_param<int>("searchWindowSize","int", 21)
	}, fastNlMeansDenoisingMulti);

//	interface IfastNlMeansDenoisingMulti {
//		(srcImgs : _st.InputArrayOfArrays, dst : _st.OutputArray,
//			imgToDenoiseIndex : _st.int, temporalWindowSize : _st.int,
//			h : Array<_st.float>,
//			templateWindowSize ? : _st.int /* = 7*/, searchWindowSize ? : _st.int /* = 21*/,
//			normType ? : _base.NormTypes/* = NORM_L2*/) : void;
//
//
//		(srcImgs : _st.InputArrayOfArrays, dst : _st.OutputArray,
//			imgToDenoiseIndex : _st.int, temporalWindowSize : _st.int,
//			h ? : _st.float /*= 3*/, templateWindowSize ? : _st.int /* = 7*/, searchWindowSize ? : _st.int /* = 21*/);
//	}
//
//	export var fastNlMeansDenoisingMulti : IfastNlMeansDenoisingMulti = alvision_module.fastNlMeansDenoisingMulti;

	//    CV_EXPORTS_W void fastNlMeansDenoisingMulti(InputArrayOfArrays srcImgs, OutputArray dst,
	//        int imgToDenoiseIndex, int temporalWindowSize,
	//                                             const std::vector<float>& h,
	//        int templateWindowSize = 7, int searchWindowSize = 21,
	//        int normType = NORM_L2);

	/** @brief Modification of fastNlMeansDenoisingMulti function for colored images sequences

	@param srcImgs Input 8-bit 3-channel images sequence. All images should have the same type and
	size.
	@param imgToDenoiseIndex Target image to denoise index in srcImgs sequence
	@param temporalWindowSize Number of surrounding images to use for target image denoising. Should
	be odd. Images from imgToDenoiseIndex - temporalWindowSize / 2 to
	imgToDenoiseIndex - temporalWindowSize / 2 from srcImgs will be used to denoise
	srcImgs[imgToDenoiseIndex] image.
	@param dst Output image with the same size and type as srcImgs images.
	@param templateWindowSize Size in pixels of the template patch that is used to compute weights.
	Should be odd. Recommended value 7 pixels
	@param searchWindowSize Size in pixels of the window that is used to compute weighted average for
	given pixel. Should be odd. Affect performance linearly: greater searchWindowsSize - greater
	denoising time. Recommended value 21 pixels
	@param h Parameter regulating filter strength for luminance component. Bigger h value perfectly
	removes noise but also removes image details, smaller h value preserves details but also preserves
	some noise.
	@param hColor The same as h but for color components.

	The function converts images to CIELAB colorspace and then separately denoise L and AB components
	with given h parameters using fastNlMeansDenoisingMulti function.
	*/

	overload->addOverload("photo", "", "fastNlMeansDenoisingColoredMulti", {
		make_param<IOArray*>("srcImgs","InputArrayOfArrays"),
		make_param<IOArray*>("dst","OutputArray"),
		make_param<int>("imgToDenoiseIndex","int"),
		make_param<int>("temporalWindowSize","int"),
		make_param<float>("h","float", 3),
		make_param<float>("hColor","float",3),
		make_param<int>("templateWindowSize","int", 7),
		make_param<int>("searchWindowSize","int", 21)
	}, fastNlMeansDenoisingColoredMulti);

	Nan::SetMethod(target, "fastNlMeansDenoisingColoredMulti", photo_general_callback::callback);

//	interface IfastNlMeansDenoisingColoredMulti {
//		(srcImgs : _st.InputArrayOfArrays, dst : _st.OutputArray,
//			imgToDenoiseIndex : _st.int, temporalWindowSize : _st.int,
//			h ? : _st.float  /*= 3*/, hColor ? : _st.float /* = 3*/,
//			templateWindowSize ? : _st.int /* = 7*/, searchWindowSize ? : _st.int /* = 21*/) : void;
//	}
//
//	export var fastNlMeansDenoisingColoredMulti : IfastNlMeansDenoisingColoredMulti = alvision_module.fastNlMeansDenoisingColoredMulti;

	//    CV_EXPORTS_W void fastNlMeansDenoisingColoredMulti(InputArrayOfArrays srcImgs, OutputArray dst,
	//        int imgToDenoiseIndex, int temporalWindowSize,
	//        float h = 3, float hColor = 3,
	//        int templateWindowSize = 7, int searchWindowSize = 21);

	/** @brief Primal-dual algorithm is an algorithm for solving special types of variational problems (that is,
	finding a function to minimize some functional). As the image denoising, in particular, may be seen
	as the variational problem, primal-dual algorithm then can be used to perform denoising and this is
	exactly what is implemented.

	It should be noted, that this implementation was taken from the July 2013 blog entry
	@cite MA13 , which also contained (slightly more general) ready-to-use source code on Python.
	Subsequently, that code was rewritten on C++ with the usage of openCV by Vadim Pisarevsky at the end
	of July 2013 and finally it was slightly adapted by later authors.

	Although the thorough discussion and justification of the algorithm involved may be found in
	@cite ChambolleEtAl, it might make sense to skim over it here, following @cite MA13 . To begin
	with, we consider the 1-byte gray-level images as the functions from the rectangular domain of
	pixels (it may be seen as set
	\f$\left\{(x,y)\in\mathbb{N}\times\mathbb{N}\mid 1\leq x\leq n,\;1\leq y\leq m\right\}\f$ for some
	\f$m,\;n\in\mathbb{N}\f$) into \f$\{0,1,\dots,255\}\f$. We shall denote the noised images as \f$f_i\f$ and with
	this view, given some image \f$x\f$ of the same size, we may measure how bad it is by the formula

	\f[\left\|\left\|\nabla x\right\|\right\| + \lambda\sum_i\left\|\left\|x-f_i\right\|\right\|\f]

	\f$\|\|\cdot\|\|\f$ here denotes \f$L_2\f$-norm and as you see, the first addend states that we want our
	image to be smooth (ideally, having zero gradient, thus being constant) and the second states that
	we want our result to be close to the observations we've got. If we treat \f$x\f$ as a function, this is
	exactly the functional what we seek to minimize and here the Primal-Dual algorithm comes into play.

	@param observations This array should contain one or more noised versions of the image that is to
	be restored.
	@param result Here the denoised image will be stored. There is no need to do pre-allocation of
	storage space, as it will be automatically allocated, if necessary.
	@param lambda Corresponds to \f$\lambda\f$ in the formulas above. As it is enlarged, the smooth
	(blurred) images are treated more favorably than detailed (but maybe more noised) ones. Roughly
	speaking, as it becomes smaller, the result will be more blur but more sever outliers will be
	removed.
	@param niters Number of iterations that the algorithm will run. Of course, as more iterations as
	better, but it is hard to quantitatively refine this statement, so just use the default and
	increase it if the results are poor.
	*/

	overload->addOverload("photo", "", "denoise_TVL1", {  
		make_param<std::shared_ptr<std::vector<IOArray*>>>("observations","Array<Mat>"),
		make_param<IOArray*>("result",Matrix::name),
		make_param<double>("lambda","double", 1.0),
		make_param<int>("niters","int", 30)
	}, denoise_TVL1);

	Nan::SetMethod(target, "denoise_TVL1", photo_general_callback::callback);

//	interface Idenoise_TVL1 {
//		(observations : Array<_mat.Mat>, result : _mat.Mat, lambda ? : _st.double /*= 1.0*/, niters ? : _st.int  /*= 30*/) : void;
//	}
//
//	export var denoise_TVL1 : Idenoise_TVL1 = alvision_module.denoise_TVL1;

	//CV_EXPORTS_W void denoise_TVL1(const std::vector<Mat>& observations, Mat& result, double lambda= 1.0, int niters= 30);

	//! @} photo_denoise

	//! @addtogroup photo_hdr
	//! @{

	auto LDR = CreateNamedObject(target, "LDR");
	SetObjectProperty(LDR, "LDR_SIZE", cv::LDR_SIZE);
	overload->add_type_alias("LDR", "int");

	Tonemap::Init(target, overload);

	TonemapDrago::Init(target, overload);

	TonemapDurand::Init(target, overload);

	TonemapReinhard::Init(target, overload);

	
	TonemapMantiuk::Init(target, overload);


	AlignExposures::Init(target, overload);

	AlignMTB::Init(target, overload);


	CalibrateCRF::Init(target, overload);
	
	CalibrateDebevec::Init(target, overload);

	CalibrateRobertson::Init(target, overload);

	MergeExposures::Init(target, overload);


	MergeDebevec::Init(target, overload);
	
	MergeMertens::Init(target, overload);


	MergeRobertson::Init(target, overload);
	

	//! @} photo_hdr

	/** @brief Transforms a color image to a grayscale image. It is a basic tool in digital printing, stylized
	black-and-white photograph rendering, and in many single channel image processing applications
	@cite CL12 .

	@param src Input 8-bit 3-channel image.
	@param grayscale Output 8-bit 1-channel image.
	@param color_boost Output 8-bit 3-channel image.

	This function is to be applied on color images.
	*/

	overload->addOverload("photo", "", "decolor", {
		make_param<IOArray*>("src","InputArray"),
		make_param<IOArray*>("grayscale","OutputArray"),
		make_param<IOArray*>("color_boost","OutputArray")
	}, decolor);

	Nan::SetMethod(target, "decolor", photo_general_callback::callback);

//	interface Idecolor {
//		(src : _st.InputArray, grayscale : _st.OutputArray, color_boost : _st.OutputArray) : void;
//	}
//	export var decolor : Idecolor = alvision_module.decolor;

	//    CV_EXPORTS_W void decolor(InputArray src, OutputArray grayscale, OutputArray color_boost);

	//! @addtogroup photo_clone
	//! @{

	/** @brief Image editing tasks concern either global changes (color/intensity corrections, filters,
	deformations) or local changes concerned to a selection. Here we are interested in achieving local
	changes, ones that are restricted to a region manually selected (ROI), in a seamless and effortless
	manner. The extent of the changes ranges from slight distortions to complete replacement by novel
	content @cite PM03 .

	@param src Input 8-bit 3-channel image.
	@param dst Input 8-bit 3-channel image.
	@param mask Input 8-bit 1 or 3-channel image.
	@param p Point in dst image where object is placed.
	@param blend Output image with the same size and type as dst.
	@param flags Cloning method that could be one of the following:
	-   **NORMAL_CLONE** The power of the method is fully expressed when inserting objects with
	complex outlines into a new background
	-   **MIXED_CLONE** The classic method, color-based selection and alpha masking might be time
	consuming and often leaves an undesirable halo. Seamless cloning, even averaged with the
	original image, is not effective. Mixed seamless cloning based on a loose selection proves
	effective.
	-   **FEATURE_EXCHANGE** Feature exchange allows the user to easily replace certain features of
	one object by alternative features.
	*/

	overload->addOverload("photo", "", "seamlessClone", {
		make_param<IOArray*>("src","InputArray"),
		make_param<IOArray*>("dst","InputArray"),
		make_param<IOArray*>("mask","InputArray"),
		make_param<Point*>("p",Point::name),
		make_param<IOArray*>("blend","OutputArray"),
		make_param<int>("flags","CLONING_METHOD")
	}, seamlessClone);

	Nan::SetMethod(target, "seamlessClone", photo_general_callback::callback);


//	interface IseamlessClone {
//		(src : _st.InputArray, dst : _st.InputArray, mask : _st.InputArray, p : _types.Point,
//			blend : _st.OutputArray, flags : CLONING_METHOD) : void;
//	}
//	export var seamlessClone : IseamlessClone = alvision_module.seamlessClone;

	//    CV_EXPORTS_W void seamlessClone(InputArray src, InputArray dst, InputArray mask, Point p,
	//        OutputArray blend, int flags);

	/** @brief Given an original color image, two differently colored versions of this image can be mixed
	seamlessly.

	@param src Input 8-bit 3-channel image.
	@param mask Input 8-bit 1 or 3-channel image.
	@param dst Output image with the same size and type as src .
	@param red_mul R-channel multiply factor.
	@param green_mul G-channel multiply factor.
	@param blue_mul B-channel multiply factor.

	Multiplication factor is between .5 to 2.5.
	*/

	overload->addOverload("photo", "", "colorChange", {
		make_param<IOArray*>("src","InputArray"),
		make_param<IOArray*>("mask","InputArray"),
		make_param<IOArray*>("dst","OutputArray"),
		make_param<float>("red_mul","float", 1.0f),
		make_param<float>("green_mul","float", 1.0f),
		make_param<float>("blue_mul","float",1.0f)
	}, colorChange);

	Nan::SetMethod(target, "colorChange", photo_general_callback::callback);

//	interface IcolorChange {
//		(src : _st.InputArray, mask : _st.InputArray, dst : _st.OutputArray, red_mul ? : _st.float /* = 1.0f*/,
//			green_mul ? : _st.float /* = 1.0f*/, blue_mul ? : _st.float /* = 1.0f*/) : void;
//	}
//
//	export var colorChange : IcolorChange = alvision_module.colorChange;

	//    CV_EXPORTS_W void colorChange(InputArray src, InputArray mask, OutputArray dst, float red_mul = 1.0f,
	//        float green_mul = 1.0f, float blue_mul = 1.0f);

	/** @brief Applying an appropriate non-linear transformation to the gradient field inside the selection and
	then integrating back with a Poisson solver, modifies locally the apparent illumination of an image.

	@param src Input 8-bit 3-channel image.
	@param mask Input 8-bit 1 or 3-channel image.
	@param dst Output image with the same size and type as src.
	@param alpha Value ranges between 0-2.
	@param beta Value ranges between 0-2.

	This is useful to highlight under-exposed foreground objects or to reduce specular reflections.
	*/

	overload->addOverload("photo", "", "illuminationChange", {
		make_param<IOArray*>("src","InputArray"), 
		make_param<IOArray*>("mask","InputArray"), 
		make_param<IOArray*>("dst","OutputArray"),
		make_param<float>("alpha","float", 0.2f),
		make_param<float>("beta","float", 0.4f)
	}, illuminationChange);

	Nan::SetMethod(target, "illuminationChange", photo_general_callback::callback);

//	interface IilluminationChange {
//		(src : _st.InputArray, mask : _st.InputArray, dst : _st.OutputArray,
//			alpha ? : _st.float /* = 0.2f*/, beta ? : _st.float /* = 0.4f*/) : void;
//	}
//	export var illuminationChange : IilluminationChange = alvision_module.illuminationChange;

	//    CV_EXPORTS_W void illuminationChange(InputArray src, InputArray mask, OutputArray dst,
	//        float alpha = 0.2f, float beta = 0.4f);

	/** @brief By retaining only the gradients at edge locations, before integrating with the Poisson solver, one
	washes out the texture of the selected region, giving its contents a flat aspect. Here Canny Edge
	Detector is used.

	@param src Input 8-bit 3-channel image.
	@param mask Input 8-bit 1 or 3-channel image.
	@param dst Output image with the same size and type as src.
	@param low_threshold Range from 0 to 100.
	@param high_threshold Value \> 100.
	@param kernel_size The size of the Sobel kernel to be used.

	**NOTE:**

	The algorithm assumes that the color of the source image is close to that of the destination. This
	assumption means that when the colors don't match, the source image color gets tinted toward the
	color of the destination image.
	*/

	overload->addOverload("photo", "", "textureFlattening", {
		make_param<IOArray*>("src","InputArray"),
		make_param<IOArray*>("mask","InputArray"),
		make_param<IOArray*>("dst","OutputArray"),
		make_param<float>("low_threshold","float", 30),
		make_param<float>("high_threshold","float", 45),
		make_param<int>("kernel_size","int", 3)
	}, textureFlattening);

	Nan::SetMethod(target, "textureFlattening", photo_general_callback::callback);

//	interface ItextureFlattening {
//		(src : _st.InputArray, mask : _st.InputArray, dst : _st.OutputArray,
//			low_threshold ? : _st.float /* = 30*/, high_threshold ? : _st.float /* = 45*/,
//			kernel_size ? : _st.int /* = 3*/) : void;
//	}
//
//	export var textureFlattening : ItextureFlattening = alvision_module.textureFlattening;

	//    CV_EXPORTS_W void textureFlattening(InputArray src, InputArray mask, OutputArray dst,
	//        float low_threshold = 30, float high_threshold = 45,
	//        int kernel_size = 3);

	//! @} photo_clone

	//! @addtogroup photo_render
	//! @{

	/** @brief Filtering is the fundamental operation in image and video processing. Edge-preserving smoothing
	filters are used in many different applications @cite EM11 .

	@param src Input 8-bit 3-channel image.
	@param dst Output 8-bit 3-channel image.
	@param flags Edge preserving filters:
	-   **RECURS_FILTER** = 1
	-   **NORMCONV_FILTER** = 2
	@param sigma_s Range between 0 to 200.
	@param sigma_r Range between 0 to 1.
	*/

	overload->addOverload("photo", "", "edgePreservingFilter", {
		make_param<IOArray*>("src","InputArray"), 
		make_param<IOArray*>("dst","OutputArray"), 
		make_param<int>("flags","EDGE_PRESERVING_FILTER", 1),
		make_param<float>("sigma_s","float", 60),
		make_param<float>("sigma_r","float", 0.4f)
	}, edgePreservingFilter);

	Nan::SetMethod(target, "edgePreservingFilter", photo_general_callback::callback);

//	interface IedgePreservingFilter {
//		(src : _st.InputArray, dst : _st.OutputArray, flags ? : EDGE_PRESERVING_FILTER /* = 1*/,
//			sigma_s ? : _st.float /* = 60*/, sigma_r ? : _st.float  /* = 0.4f*/) : void;
//	}
//	export var edgePreservingFilter : IedgePreservingFilter = alvision_module.edgePreservingFilter;

	//    CV_EXPORTS_W void edgePreservingFilter(InputArray src, OutputArray dst, int flags = 1,
	//        float sigma_s = 60, float sigma_r = 0.4f);

	/** @brief This filter enhances the details of a particular image.

	@param src Input 8-bit 3-channel image.
	@param dst Output image with the same size and type as src.
	@param sigma_s Range between 0 to 200.
	@param sigma_r Range between 0 to 1.
	*/

	overload->addOverload("photo", "", "detailEnhance", {
		make_param<IOArray*>("src","InputArray"), 
		make_param<IOArray*>("dst","OutputArray"), 
		make_param<float>("sigma_s","float", 10),
		make_param<float>("sigma_r","float", 0.15f)
	}, detailEnhance);


	Nan::SetMethod(target, "detailEnhance", photo_general_callback::callback);

//	interface IdetailEnhance {
//		(src : _st.InputArray, dst : _st.OutputArray, sigma_s ? : _st.float  /* = 10*/,
//			sigma_r ? : _st.float /* = 0.15f*/) : void;
//	}
//	export var detailEnhance : IdetailEnhance = alvision_module.detailEnhance;

	//    CV_EXPORTS_W void detailEnhance(InputArray src, OutputArray dst, float sigma_s = 10,
	//        float sigma_r = 0.15f);

	/** @brief Pencil-like non-photorealistic line drawing

	@param src Input 8-bit 3-channel image.
	@param dst1 Output 8-bit 1-channel image.
	@param dst2 Output image with the same size and type as src.
	@param sigma_s Range between 0 to 200.
	@param sigma_r Range between 0 to 1.
	@param shade_factor Range between 0 to 0.1.
	*/

	overload->addOverload("photo", "", "pencilSketch", {
		make_param<IOArray*>("src","InputArray"), 
		make_param<IOArray*>("dst1","OutputArray"), 
		make_param<IOArray*>("dst2","OutputArray"),
		make_param<float>("sigma_s","float", 60),
		make_param<float>("sigma_r","float", 0.07f),
		make_param<float>("shade_factor","float", 0.02f)
	}, pencilSketch);

	Nan::SetMethod(target, "pencilSketch", photo_general_callback::callback);

//	interface IpencilSketch {
//		(src : _st.InputArray, dst1 : _st.OutputArray, dst2 : _st.OutputArray,
//			sigma_s ? : _st.float /* = 60*/, sigma_r ? : _st.float /* = 0.07f*/, shade_factor ? : _st.float /* = 0.02f*/) : void;
//	}
//
//	export var pencilSketch : IpencilSketch = alvision_module.pencilSketch;

	//    CV_EXPORTS_W void pencilSketch(InputArray src, OutputArray dst1, OutputArray dst2,
	//        float sigma_s = 60, float sigma_r = 0.07f, float shade_factor = 0.02f);

	/** @brief Stylization aims to produce digital imagery with a wide variety of effects not focused on
	photorealism. Edge-aware filters are ideal for stylization, as they can abstract regions of low
	contrast while preserving, or enhancing, high-contrast features.

	@param src Input 8-bit 3-channel image.
	@param dst Output image with the same size and type as src.
	@param sigma_s Range between 0 to 200.
	@param sigma_r Range between 0 to 1.
	*/

	overload->addOverload("photo", "", "stylization", {
		make_param<IOArray*>("src","InputArray"), 
		make_param<IOArray*>("dst","OutputArray"),
		make_param<float>("sigma_s","float", 60),
		make_param<float>("sigma_r","float",0.45f)
	}, stylization);

	Nan::SetMethod(target, "stylization", photo_general_callback::callback);

//	interface Istylization {
//		(src : _st.InputArray, dst : _st.OutputArray, sigma_s ? : _st.float  /* = 60*/,
//			sigma_r ? : _st.float  /*= 0.45f*/) : void;
//	}
//	export var stylization : Istylization = alvision_module.stylization;

	//    CV_EXPORTS_W void stylization(InputArray src, OutputArray dst, float sigma_s = 60,
	//        float sigma_r = 0.45f);


	//#ifndef DISABLE_OPENCV_24_COMPATIBILITY
	//#include "opencv2/photo/photo_c.h"





}


POLY_METHOD(photo::inpaint){throw std::runtime_error("not implemented");}
POLY_METHOD(photo::fastNlMeansDenoising_h_arr){throw std::runtime_error("not implemented");}
POLY_METHOD(photo::fastNlMeansDenoising){throw std::runtime_error("not implemented");}
POLY_METHOD(photo::fastNlMeansDenoisingColored){
	auto src = info.at<IOArray*>(0)->GetInputArray();
	auto dst = info.at<IOArray*>(1)->GetOutputArray();
	auto h = info.at<float>(2);
	auto hColor = info.at<float>(3);
	auto templateWindowSize = info.at<int>(4);
	auto searchWindowSize = info.at<int>(5);

	cv::fastNlMeansDenoisingColored(src, dst, h, hColor, templateWindowSize, searchWindowSize);

}
POLY_METHOD(photo::fastNlMeansDenoisingMulti_h_array){throw std::runtime_error("not implemented");}
POLY_METHOD(photo::fastNlMeansDenoisingMulti){throw std::runtime_error("not implemented");}
POLY_METHOD(photo::fastNlMeansDenoisingColoredMulti){throw std::runtime_error("not implemented");}
POLY_METHOD(photo::denoise_TVL1){throw std::runtime_error("not implemented");}
POLY_METHOD(photo::decolor){throw std::runtime_error("not implemented");}
POLY_METHOD(photo::seamlessClone){throw std::runtime_error("not implemented");}
POLY_METHOD(photo::colorChange){throw std::runtime_error("not implemented");}
POLY_METHOD(photo::illuminationChange){throw std::runtime_error("not implemented");}
POLY_METHOD(photo::textureFlattening){throw std::runtime_error("not implemented");}
POLY_METHOD(photo::edgePreservingFilter){throw std::runtime_error("not implemented");}
POLY_METHOD(photo::detailEnhance){throw std::runtime_error("not implemented");}
POLY_METHOD(photo::pencilSketch){throw std::runtime_error("not implemented");}
POLY_METHOD(photo::stylization){throw std::runtime_error("not implemented");}

