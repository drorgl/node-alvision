#include "opengl.h"
#include "opengl/Arrays.h"
#include "opengl/Buffer.h"
#include "opengl/Texture2D.h"

namespace opengl_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("opengl_general_callback is empty");
		}
		return overload->execute("opengl", info);
	}
}

void
opengl::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	opengl_general_callback::overload = overload;

	auto ogl = Nan::New<v8::Object>();
	target->Set(Nan::New("ogl").ToLocalChecked(), ogl);

//export    namespace ogl {

	/** @addtogroup core_opengl
	This section describes OpenGL interoperability.

	To enable OpenGL support, configure OpenCV using CMake with WITH_OPENGL=ON . Currently OpenGL is
	supported only with WIN32, GTK and Qt backends on Windows and Linux (MacOS and Android are not
	supported). For GTK backend gtkglext-1.0 library is required.

	To use OpenGL functionality you should first create OpenGL context (window or frame buffer). You can
	do this with namedWindow function or with other OpenGL toolkit (GLUT, for example).
	*/
	//! @{

	/////////////////// OpenGL Objects ///////////////////

	/** @brief Smart pointer for OpenGL buffer object with reference counting.

	Buffer Objects are OpenGL objects that store an array of unformatted memory allocated by the OpenGL
	context. These can be used to store vertex data, pixel data retrieved from images or the
	framebuffer, and a variety of other things.

	ogl::Buffer has interface similar with Mat interface and represents 2D array memory.

	ogl::Buffer supports memory transfers between host and device and also can be mapped to CUDA memory.
	*/

	auto BufferTarget = CreateNamedObject(ogl, "BufferTarget");
	SetObjectProperty(BufferTarget, "ARRAY_BUFFER", 0x8892);
	SetObjectProperty(BufferTarget, "ELEMENT_ARRAY_BUFFER", 0x8893);
	SetObjectProperty(BufferTarget, "PIXEL_PACK_BUFFER", 0x88EB);
	SetObjectProperty(BufferTarget, "PIXEL_UNPACK_BUFFER", 0x88EC);

	auto BufferAccess = CreateNamedObject(ogl, "BufferAccess");
	SetObjectProperty(BufferAccess, "READ_ONLY", 0x88B8);
	SetObjectProperty(BufferAccess, "WRITE_ONLY", 0x88B9);
	SetObjectProperty(BufferAccess, "READ_WRITE", 0x88BA);


	Buffer::Init(ogl, overload);

	Texture2D::Init(ogl, overload);
	
	Arrays::Init(ogl, overload);
	/////////////////// Render Functions ///////////////////

	auto RenderModes = CreateNamedObject(ogl, "RenderModes");
	SetObjectProperty(RenderModes, "POINTS", 0x0000);
	SetObjectProperty(RenderModes, "LINES", 0x0001);
	SetObjectProperty(RenderModes, "LINE_LOOP", 0x0002);
	SetObjectProperty(RenderModes, "LINE_STRIP", 0x0003);
	SetObjectProperty(RenderModes, "TRIANGLES", 0x0004);
	SetObjectProperty(RenderModes, "TRIANGLE_STRIP", 0x0005);
	SetObjectProperty(RenderModes, "TRIANGLE_FAN", 0x0006);
	SetObjectProperty(RenderModes, "QUADS", 0x0007);
	SetObjectProperty(RenderModes, "QUAD_STRIP", 0x0008);
	SetObjectProperty(RenderModes, "POLYGON", 0x0009);

	/** @brief Render OpenGL texture or primitives.
	@param tex Texture to draw.
	@param wndRect Region of window, where to draw a texture (normalized coordinates).
	@param texRect Region of texture to draw (normalized coordinates).
	*/
	//CV_EXPORTS void render(const Texture2D& tex,
	//    Rect_<double> wndRect = Rect_<double>(0.0, 0.0, 1.0, 1.0),
	//    Rect_<double> texRect = Rect_<double>(0.0, 0.0, 1.0, 1.0));

	/** @overload
	@param arr Array of privitives vertices.
	@param mode Render mode. One of cv::ogl::RenderModes
	@param color Color for all vertices. Will be used if arr doesn't contain color array.
	*/
	//CV_EXPORTS void render(const Arrays& arr, int mode = POINTS, Scalar color = Scalar::all(255));

	/** @overload
	@param arr Array of privitives vertices.
	@param indices Array of vertices indices (host or device memory).
	@param mode Render mode. One of cv::ogl::RenderModes
	@param color Color for all vertices. Will be used if arr doesn't contain color array.
	*/
	//CV_EXPORTS void render(const Arrays& arr, InputArray indices, int mode = POINTS, Scalar color = Scalar::all(255));

	/////////////////// CL-GL Interoperability Functions ///////////////////

//	namespace ocl {
		//using namespace cv::ocl;

		// TODO static functions in the Context class
		/** @brief Creates OpenCL context from GL.
		@return Returns reference to OpenCL Context
		*/
		//CV_EXPORTS Context& initializeContextFromGL();

//	} // namespace cv::ogl::ocl

	  /** @brief Converts InputArray to Texture2D object.
	  @param src     - source InputArray.
	  @param texture - destination Texture2D object.
	  */
	  //CV_EXPORTS void convertToGLTexture2D(InputArray src, Texture2D& texture);

	  /** @brief Converts Texture2D object to OutputArray.
	  @param texture - source Texture2D object.
	  @param dst     - destination OutputArray.
	  */
	  //CV_EXPORTS void convertFromGLTexture2D(const Texture2D& texture, OutputArray dst);

	  /** @brief Maps Buffer object to process on CL side (convert to UMat).

	  Function creates CL buffer from GL one, and then constructs UMat that can be used
	  to process buffer data with OpenCV functions. Note that in current implementation
	  UMat constructed this way doesn't own corresponding GL buffer object, so it is
	  the user responsibility to close down CL/GL buffers relationships by explicitly
	  calling unmapGLBuffer() function.
	  @param buffer      - source Buffer object.
	  @param accessFlags - data access flags (ACCESS_READ|ACCESS_WRITE).
	  @return Returns UMat object
	  */
	  //CV_EXPORTS UMat mapGLBuffer(const Buffer& buffer, int accessFlags = ACCESS_READ|ACCESS_WRITE);

	  /** @brief Unmaps Buffer object (releases UMat, previously mapped from Buffer).

	  Function must be called explicitly by the user for each UMat previously constructed
	  by the call to mapGLBuffer() function.
	  @param u           - source UMat, created by mapGLBuffer().
	  */
	  //CV_EXPORTS void unmapGLBuffer(UMat& u);

	// }

//} // namespace cv::ogl

//namespace cv { namespace cuda {

//! @addtogroup cuda
//! @{

/** @brief Sets a CUDA device and initializes it for the current thread with OpenGL interoperability.

This function should be explicitly called after OpenGL context creation and before any CUDA calls.
@param device System index of a CUDA device starting with 0.
@ingroup core_opengl
*/
//CV_EXPORTS void setGlDevice(int device = 0);

//! @}

//}}

//! @cond IGNORED

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

//inline
//cv::ogl::Buffer::Buffer(int arows, int acols, int atype, Target target, bool autoRelease) : rows_(0), cols_(0), type_(0)
//{
//    create(arows, acols, atype, target, autoRelease);
//}
//
//inline
//cv::ogl::Buffer::Buffer(Size asize, int atype, Target target, bool autoRelease) : rows_(0), cols_(0), type_(0)
//{
//    create(asize, atype, target, autoRelease);
//}
//
//inline
//void cv::ogl::Buffer::create(Size asize, int atype, Target target, bool autoRelease)
//{
//    create(asize.height, asize.width, atype, target, autoRelease);
//}
//
//inline
//int cv::ogl::Buffer::rows() const
//{
//    return rows_;
//}
//
//inline
//int cv::ogl::Buffer::cols() const
//{
//    return cols_;
//}
//
//inline
//cv::Size cv::ogl::Buffer::size() const
//{
//    return Size(cols_, rows_);
//}
//
//inline
//bool cv::ogl::Buffer::empty() const
//{
//    return rows_ == 0 || cols_ == 0;
//}
//
//inline
//int cv::ogl::Buffer::type() const
//{
//    return type_;
//}
//
//inline
//int cv::ogl::Buffer::depth() const
//{
//    return CV_MAT_DEPTH(type_);
//}
//
//inline
//int cv::ogl::Buffer::channels() const
//{
//    return CV_MAT_CN(type_);
//}
//
//inline
//int cv::ogl::Buffer::elemSize() const
//{
//    return CV_ELEM_SIZE(type_);
//}
//
//inline
//int cv::ogl::Buffer::elemSize1() const
//{
//    return CV_ELEM_SIZE1(type_);
//}
//
/////////
//
//inline
//cv::ogl::Texture2D::Texture2D(int arows, int acols, Format aformat, bool autoRelease) : rows_(0), cols_(0), format_(NONE)
//{
//    create(arows, acols, aformat, autoRelease);
//}
//
//inline
//cv::ogl::Texture2D::Texture2D(Size asize, Format aformat, bool autoRelease) : rows_(0), cols_(0), format_(NONE)
//{
//    create(asize, aformat, autoRelease);
//}
//
//inline
//void cv::ogl::Texture2D::create(Size asize, Format aformat, bool autoRelease)
//{
//    create(asize.height, asize.width, aformat, autoRelease);
//}
//
//inline
//int cv::ogl::Texture2D::rows() const
//{
//    return rows_;
//}
//
//inline
//int cv::ogl::Texture2D::cols() const
//{
//    return cols_;
//}
//
//inline
//cv::Size cv::ogl::Texture2D::size() const
//{
//    return Size(cols_, rows_);
//}
//
//inline
//bool cv::ogl::Texture2D::empty() const
//{
//    return rows_ == 0 || cols_ == 0;
//}
//
//inline
//cv::ogl::Texture2D::Format cv::ogl::Texture2D::format() const
//{
//    return format_;
//}
//
/////////
//
//inline
//cv::ogl::Arrays::Arrays() : size_(0)
//{
//}
//
//inline
//int cv::ogl::Arrays::size() const
//{
//    return size_;
//}
//
//inline
//bool cv::ogl::Arrays::empty() const
//{
//    return size_ == 0;
//}

//! @endcond

//#endif /* __OPENCV_CORE_OPENGL_HPP__ */
}