#include "Texture2D.h"



namespace texture2d_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("texture2d_general_callback is empty");
		}
		return overload->execute("texture2d", info);
	}
}

Nan::Persistent<FunctionTemplate> Texture2D::constructor;

std::string Texture2D::name;

void
Texture2D::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	name = "Texture2D";
	texture2d_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(texture2d_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New(name).ToLocalChecked());
	ctor->Inherit(Nan::New(IOArray::constructor));

	overload->register_type<Texture2D>(ctor, "texture2d", name);

	auto Texture2DFormat = CreateNamedObject(target, "Texture2DFormat");
	SetObjectProperty(Texture2DFormat, "NONE", 0);
	SetObjectProperty(Texture2DFormat, "DEPTH_COMPONENT", 0x1902);
	SetObjectProperty(Texture2DFormat, "RGB", 0x1907);
	SetObjectProperty(Texture2DFormat, "RGBA", 0x1908);


//	export interface Texture2DStatic {
//		/** @brief The constructors.
//
//		Creates empty ogl::Texture2D object, allocates memory for ogl::Texture2D object or copies from
//		host/device memory.
//		*/
//		new () : Texture2D;
//
//		/** @overload */
//		new (arows: _st.int, acols : _st.int, aformat : Texture2DFormat, atexId : _st.uint, autoRelease ? : boolean õ//*= false*/) : Texture2D;
//
//		/** @overload */
//		new (asize: _types.Size, aformat : Texture2DFormat, atexId : _st.uint, autoRelease ? : boolean /*= false*/) /õõ/Texture2D;
//
//		/** @overload
//		@param arows Number of rows.
//		@param acols Number of columns.
//		@param aformat Image format. See cv::ogl::Texture2D::Format .
//		@param autoRelease Auto release mode (if true, release will be called in object's destructor).
//		*/
//		new (arows: _st.int, acols : _st.int, aformat : Texture2DFormat, autoRelease ? : boolean/*= false*/) : //Texture2D;
//
//		/** @overload
//		@param asize 2D array size.
//		@param aformat Image format. See cv::ogl::Texture2D::Format .
//		@param autoRelease Auto release mode (if true, release will be called in object's destructor).
//		*/
//		new (asize: _types.Size, aformat : Texture2DFormat, autoRelease ? : boolean /*= false*/) : Texture2D;
//
//		/** @overload
//		@param arr Input array (host or device memory, it can be Mat , cuda::GpuMat or ogl::Buffer ).
//		@param autoRelease Auto release mode (if true, release will be called in object's destructor).
//		*/
//		new (arr: _st.InputArray, autoRelease ? : boolean /*= false*/) : Texture2D;
//	}
//
//	export interface Texture2D extends _st.IOArray
//	{
//		//public:
//		//    /** @brief An Image Format describes the way that the images in Textures store their data.
//		//    */
//
//		//
//
//
//		/** @brief Allocates memory for ogl::Texture2D object.
//
//		@param arows Number of rows.
//		@param acols Number of columns.
//		@param aformat Image format. See cv::ogl::Texture2D::Format .
//		@param autoRelease Auto release mode (if true, release will be called in object's destructor).
//		*/
//		create(arows: _st.int, acols : _st.int , aformat : Texture2DFormat, autoRelease ? : boolean/*= false*/) : //void;
//	/** @overload
//	@param asize 2D array size.
//	@param aformat Image format. See cv::ogl::Texture2D::Format .
//	@param autoRelease Auto release mode (if true, release will be called in object's destructor).
//	*/
//	create(asize: _types.Size , aformat : Texture2DFormat, autoRelease ? : boolean /*= false*/) : void;
//	//
//	//    /** @brief Decrements the reference counter and destroys the texture object if needed.
//	//
//	//    The function will call setAutoRelease(true) .
//	//     */
//	//    void release();
//	//
//	//    /** @brief Sets auto release mode.
//	//
//	//    @param flag Auto release mode (if true, release will be called in object's destructor).
//	//
//	//    The lifetime of the OpenGL object is tied to the lifetime of the context. If OpenGL context was
//	//    bound to a window it could be released at any time (user can close a window). If object's destructor
//	//    is called after destruction of the context it will cause an error. Thus ogl::Texture2D doesn't
//	//    destroy OpenGL object in destructor by default (all OpenGL resources will be released with OpenGL
//	//    context). This function can force ogl::Texture2D destructor to destroy OpenGL object.
//	//     */
//	//    void setAutoRelease(bool flag);
//	//
//	/** @brief Copies from host/device memory to OpenGL texture.
//
//	@param arr Input array (host or device memory, it can be Mat , cuda::GpuMat or ogl::Buffer ).
//	@param autoRelease Auto release mode (if true, release will be called in object's destructor).
//	*/
//	copyFrom(arr: _st.InputArray , autoRelease ? : boolean /* = false*/) : void;
//
//	/** @brief Copies from OpenGL texture to host/device memory or another OpenGL texture object.
//
//	@param arr Destination array (host or device memory, can be Mat , cuda::GpuMat , ogl::Buffer or
//	ogl::Texture2D ).
//	@param ddepth Destination depth.
//	@param autoRelease Auto release mode for destination buffer (if arr is OpenGL buffer or texture).
//	*/
//	copyTo(arr: _st.OutputArray, ddepth ? : _st.int /*= CV_32F*/, autoRelease ? : boolean/*= false*/) : void;
//	//
//	//    /** @brief Binds texture to current active texture unit for GL_TEXTURE_2D target.
//	//    */
//	//    void bind() const;
//	//
//	rows() : _st.int;
//	cols() : _st.int;
//	size() :_types.Size;
//	empty() : boolean;
//
//	format() : Texture2DFormat;
//
//	//! get OpenGL opject id
//	texId() : _st.uint;
//	//
//	//    class Impl;
//	//
//	//private:
//	//    Ptr<Impl> impl_;
//	//    int rows_;
//	//    int cols_;
//	//    Format format_;
//	};
//
//	export var Texture2D : Texture2DStatic = alvision_module.Texture2D;
//
//
}





v8::Local<v8::Function> Texture2D::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}