#include "imgcodecs.h"
#include "IOArray.h"
#include "Matrix.h"
#include "imgcodecs/IimwriteParameter.h"

namespace imgcodecs_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("imgcodecs_general_callback is empty");
		}
		return overload->execute("imgcodecs", info);
	}
}

void
imgcodecs::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	imgcodecs_general_callback::overload = overload;

	auto ImreadModes = CreateNamedObject(target, "ImreadModes");
	SetObjectProperty(ImreadModes, "IMREAD_UNCHANGED",cv::IMREAD_UNCHANGED				);
	SetObjectProperty(ImreadModes, "IMREAD_GRAYSCALE",cv::IMREAD_GRAYSCALE				);
	SetObjectProperty(ImreadModes, "IMREAD_COLOR",cv::IMREAD_COLOR					);
	SetObjectProperty(ImreadModes, "IMREAD_ANYDEPTH",cv::IMREAD_ANYDEPTH				);
	SetObjectProperty(ImreadModes, "IMREAD_ANYCOLOR",cv::IMREAD_ANYCOLOR				);
	SetObjectProperty(ImreadModes, "IMREAD_LOAD_GDAL",cv::IMREAD_LOAD_GDAL				);
	SetObjectProperty(ImreadModes, "IMREAD_REDUCED_GRAYSCALE_2",cv::IMREAD_REDUCED_GRAYSCALE_2	);
	SetObjectProperty(ImreadModes, "IMREAD_REDUCED_COLOR_2",cv::IMREAD_REDUCED_COLOR_2		);
	SetObjectProperty(ImreadModes, "IMREAD_REDUCED_GRAYSCALE_4",cv::IMREAD_REDUCED_GRAYSCALE_4	);
	SetObjectProperty(ImreadModes, "IMREAD_REDUCED_COLOR_4",cv::IMREAD_REDUCED_COLOR_4		);
	SetObjectProperty(ImreadModes, "IMREAD_REDUCED_GRAYSCALE_8",cv::IMREAD_REDUCED_GRAYSCALE_8	);
	SetObjectProperty(ImreadModes, "IMREAD_REDUCED_COLOR_8",cv::IMREAD_REDUCED_COLOR_8		);
	overload->add_type_alias("ImreadModes", "int");

	auto ImwriteFlags = CreateNamedObject(target, "ImwriteFlags");
	SetObjectProperty(ImwriteFlags, "IMWRITE_JPEG_QUALITY",cv::IMWRITE_JPEG_QUALITY			);
	SetObjectProperty(ImwriteFlags, "IMWRITE_JPEG_PROGRESSIVE",cv::IMWRITE_JPEG_PROGRESSIVE		);
	SetObjectProperty(ImwriteFlags, "IMWRITE_JPEG_OPTIMIZE",cv::IMWRITE_JPEG_OPTIMIZE			);
	SetObjectProperty(ImwriteFlags, "IMWRITE_JPEG_RST_INTERVAL",cv::IMWRITE_JPEG_RST_INTERVAL		);
	SetObjectProperty(ImwriteFlags, "IMWRITE_JPEG_LUMA_QUALITY",cv::IMWRITE_JPEG_LUMA_QUALITY		);
	SetObjectProperty(ImwriteFlags, "IMWRITE_JPEG_CHROMA_QUALITY",cv::IMWRITE_JPEG_CHROMA_QUALITY	);
	SetObjectProperty(ImwriteFlags, "IMWRITE_PNG_COMPRESSION",cv::IMWRITE_PNG_COMPRESSION		);
	SetObjectProperty(ImwriteFlags, "IMWRITE_PNG_STRATEGY",cv::IMWRITE_PNG_STRATEGY			);
	SetObjectProperty(ImwriteFlags, "IMWRITE_PNG_BILEVEL",cv::IMWRITE_PNG_BILEVEL			);
	SetObjectProperty(ImwriteFlags, "IMWRITE_PXM_BINARY",cv::IMWRITE_PXM_BINARY			);
	SetObjectProperty(ImwriteFlags, "IMWRITE_WEBP_QUALITY",cv::IMWRITE_WEBP_QUALITY			);
	overload->add_type_alias("ImwriteFlags", "int");


	auto ImwritePNGFlags = CreateNamedObject(target, "ImwritePNGFlags");
	SetObjectProperty(ImwritePNGFlags, "IMWRITE_PNG_STRATEGY_DEFAULT",cv::IMWRITE_PNG_STRATEGY_DEFAULT		);
	SetObjectProperty(ImwritePNGFlags, "IMWRITE_PNG_STRATEGY_FILTERED",cv::IMWRITE_PNG_STRATEGY_FILTERED		);
	SetObjectProperty(ImwritePNGFlags, "IMWRITE_PNG_STRATEGY_HUFFMAN_ONLY",cv::IMWRITE_PNG_STRATEGY_HUFFMAN_ONLY	);
	SetObjectProperty(ImwritePNGFlags, "IMWRITE_PNG_STRATEGY_RLE",cv::IMWRITE_PNG_STRATEGY_RLE			);
	SetObjectProperty(ImwritePNGFlags, "IMWRITE_PNG_STRATEGY_FIXED",cv::IMWRITE_PNG_STRATEGY_FIXED		);
	overload->add_type_alias("ImwritePNGFlags", "int");



	/** @brief Loads an image from a file.

	@anchor imread

	The function imread loads an image from the specified file and returns it. If the image cannot be
	read (because of missing file, improper permissions, unsupported or invalid format), the function
	returns an empty matrix ( Mat::data==NULL ).

	Currently, the following file formats are supported:

	-   Windows bitmaps - \*.bmp, \*.dib (always supported)
	-   JPEG files - \*.jpeg, \*.jpg, \*.jpe (see the *Notes* section)
	-   JPEG 2000 files - \*.jp2 (see the *Notes* section)
	-   Portable Network Graphics - \*.png (see the *Notes* section)
	-   WebP - \*.webp (see the *Notes* section)
	-   Portable image format - \*.pbm, \*.pgm, \*.ppm \*.pxm, \*.pnm (always supported)
	-   Sun rasters - \*.sr, \*.ras (always supported)
	-   TIFF files - \*.tiff, \*.tif (see the *Notes* section)
	-   OpenEXR Image files - \*.exr (see the *Notes* section)
	-   Radiance HDR - \*.hdr, \*.pic (always supported)
	-   Raster and Vector geospatial data supported by Gdal (see the *Notes* section)

	@note

	-   The function determines the type of an image by the content, not by the file extension.
	-   In the case of color images, the decoded images will have the channels stored in **B G R** order.
	-   On Microsoft Windows\* OS and MacOSX\*, the codecs shipped with an OpenCV image (libjpeg,
	libpng, libtiff, and libjasper) are used by default. So, OpenCV can always read JPEGs, PNGs,
	and TIFFs. On MacOSX, there is also an option to use native MacOSX image readers. But beware
	that currently these native image loaders give images with different pixel values because of
	the color management embedded into MacOSX.
	-   On Linux\*, BSD flavors and other Unix-like open-source operating systems, OpenCV looks for
	codecs supplied with an OS image. Install the relevant packages (do not forget the development
	files, for example, "libjpeg-dev", in Debian\* and Ubuntu\*) to get the codec support or turn
	on the OPENCV_BUILD_3RDPARTY_LIBS flag in CMake.
	-   In the case you set *WITH_GDAL* flag to true in CMake and @ref IMREAD_LOAD_GDAL to load the image,
	then [GDAL](http://www.gdal.org) driver will be used in order to decode the image by supporting
	the following formats: [Raster](http://www.gdal.org/formats_list.html),
	[Vector](http://www.gdal.org/ogr_formats.html).
	@param filename Name of file to be loaded.
	@param flags Flag that can take values of cv::ImreadModes
	*/
	overload->addOverload("imgcodecs", "", "imread", {
		make_param<std::string>("filename","String"),
		make_param<int>("flags","ImreadModes",cv:: IMREAD_COLOR)
	}, imread);
	Nan::SetMethod(target, "imread", imgcodecs_general_callback::callback);

	//interface Iimread {
	//	(filename : string, flags ? : ImreadModes /* = IMREAD_COLOR*/) : _mat.Mat;
	//}
	//export var imread : Iimread = alvision_module.imread;

	//CV_EXPORTS_W Mat imread( const String& filename, int flags = IMREAD_COLOR );

	/** @brief Loads a multi-page image from a file.

	The function imreadmulti loads a multi-page image from the specified file into a vector of Mat objects.
	@param filename Name of file to be loaded.
	@param flags Flag that can take values of cv::ImreadModes, default with cv::IMREAD_ANYCOLOR.
	@param mats A vector of Mat objects holding each page, if more than one.
	@sa cv::imread
	*/

	overload->addOverload("imgcodecs", "", "imreadmulti", {
		make_param<std::string>("filename","String"),
		make_param<std::shared_ptr<or::Callback>>("cb","Function"),// : (mats : Array<_mat.Mat>) = >void, 
		make_param<int>("flags","ImreadModes",cv::IMREAD_ANYCOLOR)
	}, imreadmulti);
	Nan::SetMethod(target, "imreadmulti", imgcodecs_general_callback::callback);

	//interface Iimreadmulti {
	//	(filename : string, cb : (mats : Array<_mat.Mat>) = >void, flags :  ImreadModes /*= IMREAD_ANYCOLOR*/) : boolean;
	//}
	//
	//export var imreadmulti : Iimreadmulti = alvision_module.imreadmulti;

	//CV_EXPORTS_W bool imreadmulti(const String& filename, std::vector<Mat>& mats, int flags = IMREAD_ANYCOLOR);

	/** @brief Saves an image to a specified file.

	The function imwrite saves the image to the specified file. The image format is chosen based on the
	filename extension (see cv::imread for the list of extensions). Only 8-bit (or 16-bit unsigned (CV_16U)
	in case of PNG, JPEG 2000, and TIFF) single-channel or 3-channel (with 'BGR' channel order) images
	can be saved using this function. If the format, depth or channel order is different, use
	Mat::convertTo , and cv::cvtColor to convert it before saving. Or, use the universal FileStorage I/O
	functions to save the image to XML or YAML format.

	It is possible to store PNG images with an alpha channel using this function. To do this, create
	8-bit (or 16-bit) 4-channel image BGRA, where the alpha channel goes last. Fully transparent pixels
	should have alpha set to 0, fully opaque pixels should have alpha set to 255/65535.

	The sample below shows how to create such a BGRA image and store to PNG file. It also demonstrates how to set custom
	compression parameters :
	@code
	#include <opencv2/opencv.hpp>

	using namespace cv;
	using namespace std;

	void createAlphaMat(Mat &mat)
	{
	CV_Assert(mat.channels() == 4);
	for (int i = 0; i < mat.rows; ++i) {
	for (int j = 0; j < mat.cols; ++j) {
	Vec4b& bgra = mat.at<Vec4b>(i, j);
	bgra[0] = UCHAR_MAX; // Blue
	bgra[1] = saturate_cast<uchar>((float (mat.cols - j)) / ((float)mat.cols) * UCHAR_MAX); // Green
	bgra[2] = saturate_cast<uchar>((float (mat.rows - i)) / ((float)mat.rows) * UCHAR_MAX); // Red
	bgra[3] = saturate_cast<uchar>(0.5 * (bgra[1] + bgra[2])); // Alpha
	}
	}
	}

	int main(int argv, char **argc)
	{
	// Create mat with alpha channel
	Mat mat(480, 640, CV_8UC4);
	createAlphaMat(mat);

	vector<int> compression_params;
	compression_params.push_back(IMWRITE_PNG_COMPRESSION);
	compression_params.push_back(9);

	try {
	imwrite("alpha.png", mat, compression_params);
	}
	catch (cv::Exception& ex) {
	fprintf(stderr, "Exception converting image to PNG format: %s\n", ex.what());
	return 1;
	}

	fprintf(stdout, "Saved PNG file with alpha data.\n");
	return 0;
	}
	@endcode
	@param filename Name of the file.
	@param img Image to be saved.
	@param params Format-specific parameters encoded as pairs (paramId_1, paramValue_1, paramId_2, paramValue_2, ... .) see cv::ImwriteFlags
	*/

	overload->register_type<IimwriteParameter>("", "IimwriteParameter");

	overload->addOverload("imgcodecs", "", "imwrite", {
		make_param<std::string>("filename","String"),
		make_param<IOArray*>("img","IOArray"),
		make_param<std::shared_ptr<std::vector<std::shared_ptr<IimwriteParameter>>>>("params","Array<IimwriteParameter>",nullptr)
	}, imwrite);
	Nan::SetMethod(target, "imwrite", imgcodecs_general_callback::callback);

	//interface Iimwrite {
	//	(filename : string, img : _st.InputArray,
	//		params ? : Array<IimwriteParameter>) : boolean;
	//}
	//
	//export var imwrite : Iimwrite = alvision_module.imwrite;

	//CV_EXPORTS_W bool imwrite( const String& filename, InputArray img,
	//              const std::vector<int>& params = std::vector<int>());

	/** @brief Reads an image from a buffer in memory.

	The function imdecode reads an image from the specified buffer in the memory. If the buffer is too short or
	contains invalid data, the function returns an empty matrix ( Mat::data==NULL ).

	See cv::imread for the list of supported formats and flags description.

	@note In the case of color images, the decoded images will have the channels stored in **B G R** order.
	@param buf Input array or vector of bytes.
	@param flags The same flags as in cv::imread, see cv::ImreadModes.
	*/

	//interface Iimdecode {
	//    (buf: _st.InputArray | Buffer, flags: ImreadModes): _mat.Mat;
	//}

	//export var imdecode: Iimdecode = alvision_module.imdecode;

	//CV_EXPORTS_W Mat imdecode( InputArray buf, int flags );

	/** @overload
	@param buf
	@param flags
	@param dst The optional output placeholder for the decoded matrix. It can save the image
	reallocations when the function is called repeatedly for images of the same size.
	*/

	overload->addOverload("imgcodecs", "", "imdecode", {
		make_param<IOArray*>("buf","IOArray"),
		make_param<int>("flags","ImreadModes"),
		make_param<Matrix*>("dst","Mat",Matrix::create())
	},imdecode_dst );
	Nan::SetMethod(target, "imdecode", imgcodecs_general_callback::callback);

	overload->addOverload("imgcodecs", "", "imdecode", {
		make_param<std::shared_ptr<std::vector<uint8_t>>>("buf","Buffer"),
		make_param<int>("flags","ImreadModes"),
		make_param<Matrix*>("dst","Mat",Matrix::create())
	},imdecode );

	//interface Iimdecode {
	//	(buf : _st.InputArray, flags : ImreadModes, dst : _mat.Mat) : _mat.Mat;
	//
	//	(buf : _st.InputArray | Buffer, flags : ImreadModes) : _mat.Mat;
	//}
	//
	//export var imdecode : Iimdecode = alvision_module.imdecode;

	//CV_EXPORTS Mat imdecode( InputArray buf, int flags, Mat* dst);

	/** @brief Encodes an image into a memory buffer.

	The function imencode compresses the image and stores it in the memory buffer that is resized to fit the
	result. See cv::imwrite for the list of supported formats and flags description.

	@param ext File extension that defines the output format.
	@param img Image to be written.
	@param buf Output buffer resized to fit the compressed image.
	@param params Format-specific parameters. See cv::imwrite and cv::ImwriteFlags.
	*/

	overload->addOverload("imgcodecs", "", "imencode", {
		make_param<std::string>("ext","String"),
		make_param<IOArray*>("img","IOArray"),
		make_param<std::shared_ptr<std::vector<uint8_t>>>("buf","Buffer"),
		make_param<std::shared_ptr<std::vector<std::shared_ptr<IimwriteParameter>>>>("params","Array<IimwriteParameter>",nullptr)
	}, imencode);
	Nan::SetMethod(target, "imencode", imgcodecs_general_callback::callback);
	//interface Iimencode {
	//	(ext : string, img : _st.InputArray, buf : Buffer, params ? : Array<IimwriteParameter>) : boolean;
	//}
	//
	//export var imencode : Iimencode = alvision_module.imencode;

	//CV_EXPORTS_W bool imencode( const String& ext, InputArray img,
	//                            CV_OUT std::vector<uchar>& buf,
	//                            const std::vector<int>& params = std::vector<int>());


}

POLY_METHOD(imgcodecs::imread) { 
	auto filename = info.at<std::string>(0);
	auto flags = info.at<int>(1);

#ifdef WIN32
	filename = string_replace(filename, "/", "\\");
#endif

	if (!file_exists(filename)) {
		throw std::runtime_error("file not found " + filename);
	}

	auto mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(cv::imread(filename, flags));
	info.SetReturnValue(mat);
}
POLY_METHOD(imgcodecs::imreadmulti) { throw std::exception("not implemented"); }
POLY_METHOD(imgcodecs::imwrite) { throw std::exception("not implemented"); }
POLY_METHOD(imgcodecs::imdecode_dst) { throw std::exception("not implemented"); }
POLY_METHOD(imgcodecs::imdecode) { throw std::exception("not implemented"); }
POLY_METHOD(imgcodecs::imencode) { throw std::exception("not implemented"); }